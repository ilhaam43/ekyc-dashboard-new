import { assert } from './errors.js';
import { value } from './config.js';
import { platformCrypt, platformFormat } from './platform-crypto.js';
const columns = ['name', 'id_number', 'phone_number', 'email', 'birth_place', 'birth_date', 'mother_maiden_name'];
export class Encryption {
  constructor(cfg) { this.cfg = cfg; assert(!(cfg.production && cfg.encryptionMock), 500, 'MOCK_ENCRYPTION_FORBIDDEN'); }
  async request(operation, payload) {
    assert(this.cfg.encryptionUrl, 503, 'ENCRYPTION_NOT_CONFIGURED');
    let response;
    try { response = await fetch(`${this.cfg.encryptionUrl.replace(/\/$/, '')}/${operation}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(10000), redirect: 'error' }); }
    catch { assert(false, 503, 'ENCRYPTION_UNAVAILABLE'); }
    const data = await response.json().catch(() => null);
    assert(response.ok && data?.success === true && data.data != null, 503, 'ENCRYPTION_UNAVAILABLE'); return data.data;
  }
  async keys(tenant) {
    assert(this.cfg.encryptionUrl, 503, 'ENCRYPTION_NOT_CONFIGURED');
    let key, IV;
    try { key = value('MASTER_ENCRYPTION_KEY'); IV = value('MASTER_ENCRYPTION_IV'); }
    catch { assert(false, 503, 'ENCRYPTION_KEYS_NOT_CONFIGURED'); }
    assert(key && IV, 503, 'ENCRYPTION_KEYS_NOT_CONFIGURED');
    const result = await this.request('decrypt', { key, IV, data: tenant.encryption });
    assert(typeof result.encryption_key === 'string' && result.encryption_key.length && typeof result.iv === 'string' && result.iv.length, 503, 'ENCRYPTION_INVALID_KEYS');
    return result;
  }
  async transform(operation, tenant, data, resourceId, storedFormat) {
    if (this.cfg.platformEncryptionUrl) {
      if (operation === 'encrypt' || data?.format === platformFormat) return platformCrypt(this.cfg, operation, tenant.id, 'customer-profile', resourceId, data);
      // Existing synthetic fixtures remain readable in development, never production.
      if (storedFormat === 'synthetic-plaintext' && !this.cfg.production) return structuredClone(data);
      // Legacy ciphertext is only readable through its explicitly configured adapter.
      assert(this.cfg.encryptionUrl, 503, 'LEGACY_ENCRYPTION_MIGRATION_REQUIRED');
    }
    if (this.cfg.encryptionMock) return structuredClone(data);
    const keys = await this.keys(tenant); const payload = { key: keys.encryption_key, IV: keys.iv };
    const result = await this.request(operation, { ...payload, data, whitelist: columns });
    for (const [field, whitelist] of [['occupation_detail', ['company_name', 'business_sector', 'position', 'date_start']], ['bank_account', ['account_number', 'card_type']]]) {
      if (data[field]) result[field] = await this.request(operation, { ...payload, data: data[field], whitelist });
    }
    if (data.addresses) {
      result.addresses = {};
      for (const [type, address] of Object.entries(data.addresses)) result.addresses[type] = await this.request(operation, { ...payload, data: address, whitelist: ['address'] });
    }
    return result;
  }
}
