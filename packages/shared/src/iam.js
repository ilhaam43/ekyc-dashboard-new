import { createHash, createHmac } from 'node:crypto';

// SeaweedFS implements DeletePolicy but not ListEntitiesForPolicy, which the
// generic console calls before deleting. Sign the native IAM query protocol.
export async function iamQuery(action, parameters, { endpoint, accessKey, secretKey, now = new Date() }) {
  const url = new URL(endpoint);
  const date = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const day = date.slice(0, 8);
  const scope = `${day}/us-east-1/iam/aws4_request`;
  const contentType = 'application/x-www-form-urlencoded; charset=utf-8';
  const body = new URLSearchParams({ Action: action, Version: '2010-05-08', ...parameters }).toString();
  const hash = value => createHash('sha256').update(value).digest('hex');
  const hmac = (key, value) => createHmac('sha256', key).update(value).digest();
  const signedHeaders = 'content-type;host;x-amz-date';
  const canonical = `POST\n${url.pathname || '/'}\n\ncontent-type:${contentType}\nhost:${url.host}\nx-amz-date:${date}\n\n${signedHeaders}\n${hash(body)}`;
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretKey}`, day), 'us-east-1'), 'iam'), 'aws4_request');
  const signature = createHmac('sha256', signingKey).update(`AWS4-HMAC-SHA256\n${date}\n${scope}\n${hash(canonical)}`).digest('hex');
  return fetch(url, {
    method: 'POST', signal: AbortSignal.timeout(10000),
    headers: { 'content-type': contentType, 'x-amz-date': date, authorization: `AWS4-HMAC-SHA256 Credential=${accessKey}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}` }, body,
  });
}
