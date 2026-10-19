export async function up(db) {
  await db.schema.createTable('platform_tenant_storage', t => {
    t.uuid('tenant_id').primary().references('id').inTable('platform_tenants').onDelete('CASCADE');
    t.string('recording_bucket', 63).notNullable().unique();
    t.string('state').notNullable().defaultTo('pending');
    t.integer('attempts').notNullable().defaultTo(0);
    t.timestamp('lease_until', { useTz: true });
    t.timestamp('next_attempt_at', { useTz: true }).notNullable().defaultTo(db.fn.now());
    t.timestamp('next_migration_at', { useTz: true }).notNullable().defaultTo(db.fn.now());
    t.string('last_error_code'); t.string('iam_user'); t.string('iam_policy'); t.timestamps(true, true);
  });
  await db.schema.createTable('dashboard_storage_accounts', t => {
    t.uuid('account_id').primary().references('id').inTable('dashboard_accounts').onDelete('CASCADE');
    t.uuid('tenant_id').notNullable().references('tenant_id').inTable('platform_tenant_storage').onDelete('CASCADE');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(db.fn.now());
  });
  await db.schema.alterTable('platform_recordings', t => t.string('bucket', 63));
  // Additive backfill. Existing objects stay in their original bucket until a
  // worker has copied and checksummed them; null recording.bucket means legacy.
  await db.raw(`INSERT INTO platform_tenant_storage (tenant_id, recording_bucket)
    SELECT tenant_id, 'ekyc-bank-' || replace(id::text, '-', '') || '-recordings' FROM dashboard_banks`);
  await db.raw(`INSERT INTO dashboard_storage_accounts (account_id, tenant_id)
    SELECT a.id, b.tenant_id FROM dashboard_accounts a JOIN dashboard_banks b ON b.id = a.bank_id WHERE a.role = 'bank'`);
}
export async function down() { throw new Error('Destructive rollback is disabled. Restore a verified backup using the migration runbook.'); }
