import { fail } from './auth.js';

// The legacy controllers consumed body.data.data from GET /v1/callback.
// Configuration is fixed server-side; neither URL nor API key is browser input.
export function callbackAdapter(cfg, kong) {
  return {
    async history(application, feature) {
      if (cfg.mockExternal) return { source: 'synthetic', rows: [
        { submissionId: `demo-${feature}-${application.id}`, submissionType: feature.toUpperCase(), partnerSessionId: 'SYNTHETIC-ONLY', userId: 'SYNTHETIC-ONLY', userIdType: 'TEST', status: 'COMPLETED', result: 'PASS', updatedAt: '2026-10-01T03:00:00.000Z', processedAt: '2026-10-01T03:00:00.000Z' },
        { submissionId: `demo-error-${application.id}`, submissionType: feature.toUpperCase(), userId: 'SYNTHETIC-ONLY', status: 'ERROR', result: 'FAIL', reasonCode: 'SYNTHETIC_REJECTION', updatedAt: '2026-10-01T04:00:00.000Z' },
      ] };
      const endpoint = feature === 'ocr' ? cfg.ocrCallbackUrl : cfg.livenessCallbackUrl;
      if (!endpoint || !application.kong_consumer_id) throw fail(503, 'CALLBACK_HISTORY_NOT_CONFIGURED');
      const credentials = await kong.request(`/consumers/${encodeURIComponent(application.kong_consumer_id)}/key-auth`);
      const key = credentials?.data?.find(row => typeof row.key === 'string')?.key;
      if (!key) throw fail(503, 'CALLBACK_API_KEY_NOT_FOUND');
      let response;
      try { response = await fetch(endpoint, { headers: { accept: 'application/json', apikey: key }, redirect: 'error', signal: AbortSignal.timeout(8000) }); }
      catch { throw fail(503, 'CALLBACK_HISTORY_UNAVAILABLE'); }
      if (!response.ok) throw fail(502, 'CALLBACK_HISTORY_FAILED');
      const body = await response.json().catch(() => null);
      if (!Array.isArray(body?.data?.data) || body.data.data.length > 50000 || !body.data.data.every(row => row && typeof row === 'object' && !Array.isArray(row) && typeof row.status === 'string')) throw fail(502, 'CALLBACK_INVALID_RESPONSE');
      const keys = ['submissionId', 'submissionType', 'partnerSessionId', 'userId', 'userIdType', 'partner', 'onboardingPartner', 'status', 'result', 'reasonCode', 'updatedAt', 'processedAt'];
      const timestamp = value => {
        if (value === null || value === undefined || value === '') return null;
        const milliseconds = /^\d{10,13}$/.test(String(value)) ? Number(value) * (String(value).length === 10 ? 1000 : 1) : value;
        const date = new Date(milliseconds); return Number.isFinite(date.getTime()) ? date.toISOString() : null;
      };
      return { source: 'legacy-callback', rows: body.data.data.map(row => Object.fromEntries(keys.map(key => [key, ['updatedAt', 'processedAt'].includes(key) ? timestamp(row[key]) : typeof row[key] === 'string' || typeof row[key] === 'number' || typeof row[key] === 'boolean' ? row[key] : null]))) };
    },
  };
}
