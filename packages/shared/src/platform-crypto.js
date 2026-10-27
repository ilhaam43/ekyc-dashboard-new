import { createHash } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { assert } from './errors.js';
import { value } from './config.js';

export const platformFormat = 'ekyc-aes-256-gcm-v1';
export async function platformCrypt(cfg, operation, tenantId, purpose, resourceId, data) {
  assert(cfg.platformEncryptionUrl, 503, 'PLATFORM_ENCRYPTION_NOT_CONFIGURED');
  let secret;
  try { secret = value('PLATFORM_ENCRYPTION_TOKEN'); } catch { /* fail closed below */ }
  assert(secret?.length >= 32, 503, 'PLATFORM_ENCRYPTION_TOKEN_NOT_CONFIGURED');
  const body = JSON.stringify({ tenant_id: tenantId, purpose, resource_id: resourceId, data });
  const token = jwt.sign({ operation, digest: createHash('sha256').update(body).digest('hex') }, secret, { algorithm: 'HS256', issuer: 'ekyc-platform', audience: 'ekyc-crypto', expiresIn: 15 });
  let response, result;
  try {
    response = await fetch(`${cfg.platformEncryptionUrl.replace(/\/$/, '')}/v1/${operation}`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body, signal: AbortSignal.timeout(10000), redirect: 'error' });
    result = await response.json();
  } catch { assert(false, 503, 'PLATFORM_ENCRYPTION_UNAVAILABLE'); }
  assert(response.ok && result?.success === true, response.status === 422 ? 422 : 503, response.status === 422 ? 'INVALID_ENCRYPTED_DATA' : 'PLATFORM_ENCRYPTION_UNAVAILABLE');
  return result.data;
}
