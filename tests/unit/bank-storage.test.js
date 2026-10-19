import { describe, it, expect } from 'vitest';
import { bankRecordingBucket, bankReadOnlyPolicy, resolveRecordingBucket } from '../../packages/shared/src/bank-storage.js';

describe('bank recording storage', () => {
  it('generates private, deterministic, distinct bucket names without customer identifiers', () => {
    expect(bankRecordingBucket('710329d8-85b0-478c-b62f-b8716ea8f910')).toBe('ekyc-bank-710329d885b0478cb62fb8716ea8f910-recordings');
    expect(() => bankRecordingBucket('../../other-bank')).toThrow();
  });
  it('grants only list/location and download for a single bank bucket', () => {
    const policy = bankReadOnlyPolicy('bank-test');
    expect(policy.Statement.flatMap(statement => statement.Action)).toEqual(['s3:ListBucket', 's3:GetBucketLocation', 's3:GetObject']);
    expect(policy.Statement.flatMap(statement => statement.Resource)).toEqual(['arn:aws:s3:::bank-test', 'arn:aws:s3:::bank-test/*']);
  });
  const db = row => () => ({ where: () => ({ first: async () => row }) });
  it('fails closed while bank bucket provisioning is pending or failed', async () => {
    for (const state of ['pending', 'provisioning', 'failed']) await expect(resolveRecordingBucket(db({ state, recording_bucket: 'private' }), { recordingBucket: 'legacy' }, 'tenant')).rejects.toMatchObject({ code: 'BANK_STORAGE_PENDING' });
  });
  it('routes new recordings to the ready bank bucket and pins retries to the saved bucket', async () => {
    expect(await resolveRecordingBucket(db({ state: 'ready', recording_bucket: 'private' }), { recordingBucket: 'legacy' }, 'tenant')).toBe('private');
    expect(await resolveRecordingBucket(db(null), { recordingBucket: 'legacy' }, 'tenant', { bucket: 'already-pinned' })).toBe('already-pinned');
  });
  it('retains legacy stored-recording locations and supports existing non-bank tenants', async () => {
    expect(await resolveRecordingBucket(db({ state: 'ready', recording_bucket: 'private' }), { recordingBucket: 'legacy' }, 'tenant', { state: 'stored' })).toBe('legacy');
    expect(await resolveRecordingBucket(db(null), { recordingBucket: 'legacy' }, 'tenant')).toBe('legacy');
  });
});
