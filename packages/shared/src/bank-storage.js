import { iamQuery } from './iam.js';

export const bankRecordingBucket = bankId => {
  if (!/^[0-9a-f-]{36}$/i.test(bankId)) throw new Error('INVALID_BANK_ID');
  return `ekyc-bank-${bankId.replaceAll('-', '').toLowerCase()}-recordings`;
};
export async function queueBankStorage(db, bank) {
  await db('platform_tenant_storage').insert({ tenant_id: bank.tenant_id, recording_bucket: bankRecordingBucket(bank.id) }).onConflict('tenant_id').ignore();
  const accounts = await db('dashboard_accounts').where({ bank_id: bank.id, role: 'bank' }).select('id');
  for (const account of accounts) await db('dashboard_storage_accounts').insert({ account_id: account.id, tenant_id: bank.tenant_id }).onConflict('account_id').ignore();
}
export async function resolveRecordingBucket(db, cfg, tenantId, recording) {
  if (recording?.bucket) return recording.bucket;
  if (recording?.state === 'stored') return cfg.recordingBucket;
  const mapping = await db('platform_tenant_storage').where({ tenant_id: tenantId }).first();
  if (!mapping) return cfg.recordingBucket;
  if (mapping.state !== 'ready') throw Object.assign(new Error('BANK_STORAGE_PENDING'), { status: 503, code: 'BANK_STORAGE_PENDING' });
  return mapping.recording_bucket;
}
export const bankReadOnlyPolicy = bucket => ({ Version: '2012-10-17', Statement: [
  { Effect: 'Allow', Action: ['s3:ListBucket', 's3:GetBucketLocation'], Resource: [`arn:aws:s3:::${bucket}`] },
  { Effect: 'Allow', Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${bucket}/*`] },
] });

// One durable provisioning job, protected by a database lease. Retries reuse
// deterministic IAM names and bucket names; credentials are never duplicated.
export async function processBankStorageJob(db, storage, cfg, query = iamQuery) {
  const job = await db.transaction(async trx => {
    const row = await trx('platform_tenant_storage').whereIn('state', ['pending', 'failed', 'provisioning']).where('next_attempt_at', '<=', new Date())
      .where(q => q.whereNull('lease_until').orWhere('lease_until', '<', new Date())).forUpdate().skipLocked().first();
    if (!row) return null;
    await trx('platform_tenant_storage').where({ tenant_id: row.tenant_id }).update({ state: 'provisioning', lease_until: new Date(Date.now() + 120000), attempts: row.attempts + 1 });
    return row;
  });
  if (!job) return false;
  try {
    await storage.ensureBucket(job.recording_bucket);
    const identity = `bank-${job.tenant_id}`;
    const iamCfg = { endpoint: cfg.objectEndpoint, accessKey: cfg.objectAccess, secretKey: cfg.objectSecret };
    async function command(action, parameters, duplicate = false) {
      const response = await query(action, parameters, iamCfg);
      const body = await response.text();
      if (!response.ok && !(duplicate && response.status === 409 && body.includes('EntityAlreadyExists'))) throw new Error('STORAGE_IAM_UNAVAILABLE');
      return body;
    }
    await command('CreateUser', { UserName: identity }, true);
    const policyName = `${identity}-recordings-readonly`;
    const policyBody = await command('CreatePolicy', { PolicyName: policyName, PolicyDocument: JSON.stringify(bankReadOnlyPolicy(job.recording_bucket)) }, true);
    let policyArn = policyBody.match(/<Arn>([^<]+)<\/Arn>/)?.[1];
    if (!policyArn) {
      const policies = await command('ListPolicies', {});
      const policy = [...policies.matchAll(/<member>([\s\S]*?)<\/member>/g)].find(member => member[1].includes(`<PolicyName>${policyName}</PolicyName>`));
      policyArn = policy?.[1].match(/<Arn>([^<]+)<\/Arn>/)?.[1];
    }
    if (!policyArn) throw new Error('STORAGE_IAM_POLICY_MISSING');
    await command('AttachUserPolicy', { UserName: identity, PolicyArn: policyArn });
    await db('platform_tenant_storage').where({ tenant_id: job.tenant_id }).update({ state: 'ready', iam_user: identity, iam_policy: policyArn, lease_until: null, last_error_code: null, updated_at: new Date() });
  } catch {
    await db('platform_tenant_storage').where({ tenant_id: job.tenant_id }).update({ state: 'failed', lease_until: null, last_error_code: 'STORAGE_PROVISIONING_FAILED', next_attempt_at: new Date(Date.now() + Math.min(300000, 5000 * 2 ** Math.min(job.attempts, 6))), updated_at: new Date() });
  }
  return true;
}

export async function migrateOneBankRecording(db, storage, cfg) {
  const target = await db('platform_tenant_storage').where({ state: 'ready' }).where('next_migration_at', '<=', new Date()).orderBy('next_migration_at').first();
  if (!target) return false;
  await db('platform_tenant_storage').where({ tenant_id: target.tenant_id }).update({ next_migration_at: new Date(Date.now() + 60000) });
  const record = await db('platform_recordings').where({ tenant_id: target.tenant_id, state: 'stored' }).whereNotNull('object_key')
    .where(q => q.whereNull('bucket').orWhereNot('bucket', target.recording_bucket)).first();
  if (!record) return false;
  try {
    const source = record.bucket || cfg.recordingBucket;
    const checksum = await storage.checksum(source, record.object_key);
    if (checksum.sha256 !== record.sha256 || checksum.bytes !== Number(record.bytes)) throw new Error('SOURCE_CHECKSUM_MISMATCH');
    await storage.copyBetween(source, record.object_key, target.recording_bucket, record.object_key);
    const copied = await storage.checksum(target.recording_bucket, record.object_key);
    if (copied.sha256 !== checksum.sha256 || copied.bytes !== checksum.bytes) throw new Error('DESTINATION_CHECKSUM_MISMATCH');
    await db('platform_recordings').where({ id: record.id, state: 'stored' }).update({ bucket: target.recording_bucket, updated_at: new Date() });
    await db('platform_tenant_storage').where({ tenant_id: target.tenant_id }).update({ next_migration_at: new Date(), last_error_code: null });
    // Preserve the legacy object; automatic recording deletion is disabled.
  } catch {
    await db('platform_tenant_storage').where({ tenant_id: target.tenant_id }).update({ last_error_code: 'LEGACY_RECORDING_COPY_PENDING' });
  }
  return true;
}
