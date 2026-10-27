import { afterEach, expect, test, vi } from 'vitest';
import { integrations } from '../../ekyc-dashboard-new/server/integrations.js';

afterEach(() => vi.unstubAllGlobals());
function gateway() {
  const writes = [];
  vi.stubGlobal('fetch', async (url, options) => {
    const path = new URL(url).pathname;
    if (options.method !== 'GET') writes.push({ path, method: options.method, body: options.body && JSON.parse(options.body) });
    let body = { data: [] };
    if (path === '/routes/route-1') body = { id: 'route-1', tags: [] };
    if (path === '/consumers/consumer-1/plugins' && options.method === 'GET') body = { data: [{ id: 'old-rate', name: 'rate-limiting', route: null, config: { minute: 60 } }] };
    return { ok: true, status: options.method === 'DELETE' ? 204 : 200, json: async () => body };
  });
  return writes;
}
const cfg = { kongMock: false, kongUrl: 'http://kong.example.test', kongApiRouteId: 'route-1', kongRateLimitPolicy: 'local' };
test('switching rate period clears the old Kong periods', async () => {
  const writes = gateway();
  await integrations(cfg).kong.applyPlan('consumer-1', { shortname: 'daily', limits: { type: 'global', limit: 1000, period: 'day' } });
  const rate = writes.find(row => row.path === '/plugins/old-rate');
  expect(rate.body.config).toMatchObject({ day: 1000, minute: null, hour: null, limit_by: 'consumer' });
});
test('per-route rate limits bind both consumer and route before removing the old global plugin', async () => {
  const writes = gateway();
  await integrations(cfg).kong.applyPlan('consumer-1', { shortname: 'route-plan', limits: { type: 'routes', routes: [{ id: 'route-1', limit: 120, period: 'hour' }] } });
  const index = writes.findIndex(row => row.path === '/plugins' && row.method === 'POST');
  expect(writes[index].body).toMatchObject({ consumer: { id: 'consumer-1' }, route: { id: 'route-1' }, config: { hour: 120, minute: null } });
  expect(writes.findIndex(row => row.path === '/plugins/old-rate' && row.method === 'DELETE')).toBeGreaterThan(index);
});
test('public Kong routes cannot be made private by plan assignment', async () => {
  vi.stubGlobal('fetch', async () => ({ ok: true, status: 200, json: async () => ({ id: 'route-1', tags: ['public'] }) }));
  await expect(integrations(cfg).kong.applyPlan('consumer-1', { shortname: 'standard', limits: {} })).rejects.toMatchObject({ code: 'PUBLIC_ROUTE_CANNOT_BE_ASSIGNED' });
});

test('no-limit plans remove consumer rate plugins while retaining authentication and ACL', async () => {
  const writes = gateway();
  const policy = await integrations(cfg).kong.applyPlan('consumer-1', { shortname: 'unlimited', limits: { type: 'none' } });
  expect(policy.rate_limit_per_minute).toBeNull();
  expect(policy.rate_limit_policy.type).toBe('none');
  expect(writes).toContainEqual({ path: '/plugins/old-rate', method: 'DELETE', body: undefined });
  expect(writes.filter(row => row.body?.name === 'rate-limiting')).toHaveLength(0);
  expect(writes.some(row => row.body?.name === 'key-auth')).toBe(true);
  expect(writes.some(row => row.body?.name === 'acl')).toBe(true);
});

test('legacy prefix plan grants and per-route limits reach its catalog children', async () => {
  const writes = [];
  vi.stubGlobal('fetch', async (url, options) => {
    const parsed = new URL(url), path = parsed.pathname;
    if (options.method !== 'GET') writes.push({ path, body: options.body && JSON.parse(options.body) });
    let data = { data: [] };
    if (path === '/routes' && parsed.searchParams.get('tags') === 'parent-route-1') data = { data: [{ id: 'operation-1', tags: ['parent-route-1'] }] };
    if (path.startsWith('/routes/') && !path.endsWith('/plugins')) data = { id: path.split('/')[2], tags: [] };
    return { ok: true, status: 200, json: async () => data };
  });
  await integrations(cfg).kong.applyPlan('consumer-1', { shortname: 'legacy', limits: { type: 'routes', routes: [{ id: 'route-1', limit: 12, period: 'hour' }] } });
  expect(writes.some(row => row.path === '/routes/operation-1/plugins' && row.body.name === 'key-auth')).toBe(true);
  expect(writes.some(row => row.path === '/routes/operation-1/plugins' && row.body.name === 'acl' && row.body.config.allow.includes('plan-legacy'))).toBe(true);
  expect(writes.some(row => row.path === '/plugins' && row.body.route.id === 'operation-1' && row.body.config.hour === 12)).toBe(true);
});
