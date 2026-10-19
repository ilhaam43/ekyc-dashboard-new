import { afterEach, expect, test, vi } from 'vitest';
import { resolvePage } from '../../ekyc-dashboard-new/client/routes.js';
import { reportQuery } from '../../ekyc-dashboard-new/server/reports.js';
import { callbackAdapter } from '../../ekyc-dashboard-new/server/callbacks.js';
import { planConfiguration } from '../../ekyc-dashboard-new/server/integrations.js';

const banks = [{ id: 'bank-1', username: 'lampung' }], actor = { role: 'bank', bank_id: 'bank-1' };
afterEach(() => vi.unstubAllGlobals());
test.each([
  ['/banks/create', 'banks', 'create', undefined],
  ['/plans/create', 'plans', 'create', undefined],
  ['/banks/@lampung/edit', 'bank', 'edit', undefined],
  ['/banks/@lampung/accounts/admin/edit', 'accounts', 'edit', 'admin'],
  ['/banks/@lampung/apps/create', 'apps', 'create', undefined],
  ['/banks/@lampung/apps/app-1/edit', 'application', 'edit', undefined],
  ['/apps/app-1/agents/alice/change-password', 'agents', 'change-password', 'alice'],
  ['/apps/app-1/users/customer-1', 'users', 'detail', 'customer-1'],
  ['/apps/app-1/calls/call-1', 'calls', 'detail', 'call-1'],
  ['/apps/app-1/ocr/export-excel', 'ocr', 'export', null],
  ['/apps/app-1/usage/export-xlsx', 'usage', 'export', null],
])('legacy URL %s preserves its workflow', (path, kind, action, record) => {
  const result = resolvePage(path, banks, actor);
  expect(result.kind).toBe(kind); expect(result.action).toBe(action);
  if (record !== undefined) expect(result.record).toBe(record);
  if (path.includes('/apps/app-1/')) expect(result.appId).toBe('app-1');
});
test('legacy record parent retains bank and application scope', () => {
  expect(resolvePage('/banks/@lampung/apps/app-1/agents/alice/edit', banks, actor).parent).toBe('/banks/@lampung/apps/app-1/agents');
  expect(resolvePage('/banks/@other/apps', banks, actor).kind).toBe('missing');
});
test('report dates cover a complete WIB day, and pagination is one-based', () => {
  const q = reportQuery({ from: '2026-10-01', to: '2026-10-01', page: '2', page_size: '20', order_by: 'call_end_time', status: 'completed' });
  expect(q.from.toISOString()).toBe('2026-09-30T17:00:00.000Z'); expect(q.until.toISOString()).toBe('2026-10-01T17:00:00.000Z');
  expect(q.offset).toBe(20); expect(q.order).toBe('c.ended_at');
});
test.each([{ from: '2026-02-30' }, { from: '2026-10-02', to: '2026-10-01' }, { page: -1 }, { order_by: 'id; DROP TABLE x' }, { order_direction: 'arbitrary' }, { status: 'unknown' }])('invalid report filters reject safely: %j', query => expect(() => reportQuery(query)).toThrow());
test('plans preserve legacy global and per-route periods', () => {
  expect(planConfiguration({ limits: { limit: 1000, period: 'day', type: 'global' } })).toMatchObject({ limit: 1000, period: 'day' });
  expect(planConfiguration({ limits: { type: 'routes', routes: [{ id: 'route-1', limit: 10, period: 'second' }] } }).routes).toEqual([{ id: 'route-1', limit: 10, period: 'second' }]);
  for (const limits of [{ period: 'week' }, { type: 'routes' }, { routes: [{ id: 'x' }, { id: 'x' }] }, { routes: [{ id: '../admin' }] }]) expect(() => planConfiguration({ limits })).toThrow();
});
test('callback adapter uses private consumer key, validates legacy payload and normalizes timestamps', async () => {
  const request = vi.fn(async () => ({ data: [{ key: 'private-test-key' }] }));
  const fetch = vi.fn(async () => ({ ok: true, json: async () => ({ data: { data: [{ submissionId: 's1', status: 'COMPLETED', updatedAt: 1790823600, secret: 'must-not-leak' }] } }) }));
  vi.stubGlobal('fetch', fetch);
  const result = await callbackAdapter({ ocrCallbackUrl: 'https://callback.example.test/v1/callback' }, { request }).history({ kong_consumer_id: 'consumer-1' }, 'ocr');
  expect(request).toHaveBeenCalledWith('/consumers/consumer-1/key-auth');
  expect(fetch.mock.calls[0][1].headers.apikey).toBe('private-test-key');
  expect(result.rows[0].updatedAt).toMatch(/Z$/); expect(result.rows[0].secret).toBeUndefined(); expect(result.rows[0].key).toBeUndefined();
});
test('callback failure never becomes a successful empty history', async () => {
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => '<html>unavailable</html>' }));
  const adapter = callbackAdapter({ livenessCallbackUrl: 'https://callback.example.test/' }, { request: async () => ({ data: [{ key: 'test' }] }) });
  await expect(adapter.history({ kong_consumer_id: 'c' }, 'liveness')).rejects.toMatchObject({ code: 'CALLBACK_INVALID_RESPONSE' });
  await expect(callbackAdapter({}, {}).history({}, 'ocr')).rejects.toMatchObject({ code: 'CALLBACK_HISTORY_NOT_CONFIGURED' });
});
