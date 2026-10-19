import { fail, requireRole, audit } from './auth.js';
import { makeXlsx } from './xlsx.js';

export const callStates = ['waiting', 'assigned', 'preparing_recording', 'ringing', 'active', 'completing', 'completed', 'canceled', 'missed', 'failed'];
export function reportQuery(query) {
  const integer = (value, fallback, max) => { const n = Number(value ?? fallback); if (!Number.isInteger(n) || n < 1 || n > max) throw fail(422, 'INVALID_PAGINATION'); return n; };
  const page = integer(query.page, 1, 100000), size = integer(query.page_size, 20, 100);
  const columns = { register_time: 'c.created_at', call_start_time: 'c.started_at', call_end_time: 'c.ended_at' };
  const order = query.order_by || 'register_time', direction = (query.order_direction || 'DESC').toUpperCase();
  if (!columns[order] || !['ASC', 'DESC'].includes(direction)) throw fail(422, 'INVALID_SORT');
  const date = value => {
    if (!value) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw fail(422, 'INVALID_DATE_RANGE');
    const parsed = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw fail(422, 'INVALID_DATE_RANGE');
    return new Date(`${value}T00:00:00+07:00`);
  };
  const from = date(query.from), to = date(query.to);
  if (from && to && from > to) throw fail(422, 'INVALID_DATE_RANGE');
  if (query.status && !callStates.includes(query.status)) throw fail(422, 'INVALID_CALL_STATUS');
  const search = String(query.search || '').trim();
  if (search.length > 150) throw fail(422, 'INVALID_SEARCH');
  return { page, size, offset: (page - 1) * size, order: columns[order], direction, from, until: to && new Date(to.getTime() + 86400000), status: query.status, search };
}

export function reportRoutes(app, db, adapters, management) {
  const p = '/dashboard/api/v1';
  const scope = async (req, feature, roles) => {
    requireRole(req.dashboard, ...roles);
    const application = await management.appRow(req.query.application_id, req.dashboard);
    if (!['confirmed', 'inactive'].includes(application.status)) throw fail(403, 'APPLICATION_NOT_ACTIVE');
    const plan = await db('dashboard_plans').where({ id: application.plan_id }).first();
    if (feature && !plan?.features?.includes(feature)) throw fail(403, 'FEATURE_NOT_IN_PLAN');
    return { application, bank: await management.bank(application.bank_id) };
  };
  app.get(`${p}/calls/report`, async (req, res) => {
    const { application, bank } = await scope(req, 'agent', ['superadmin', 'bank']);
    const q = reportQuery(req.query);
    const base = db('platform_calls as c').join('dashboard_customer_applications as m', 'c.user_id', 'm.customer_id').leftJoin('platform_agents as a', 'c.agent_id', 'a.id').where({ 'm.application_id': application.id, 'c.tenant_id': bank.tenant_id }).whereNot('c.state', 'waiting');
    if (q.from) base.where('c.created_at', '>=', q.from);
    if (q.until) base.where('c.created_at', '<', q.until);
    if (q.status) base.where('c.state', q.status);
    if (q.search) base.where(b => b.whereRaw('c.id::text ILIKE ?', [`%${q.search}%`]).orWhereRaw('c.user_id::text ILIKE ?', [`%${q.search}%`]).orWhereILike('a.name', `%${q.search}%`));
    const [count, statuses, duration, rows] = await Promise.all([
      base.clone().count('* as total').first(),
      base.clone().select('c.state').count('* as count').groupBy('c.state'),
      base.clone().whereNotNull('c.started_at').whereNotNull('c.ended_at').select(db.raw('AVG(GREATEST(0, EXTRACT(EPOCH FROM (c.ended_at - c.started_at)))) as average')).first(),
      base.clone().select('c.id', 'c.user_id', 'c.agent_id', 'a.name as agent_name', 'c.state', 'c.outcome', 'c.reason', 'c.created_at', 'c.started_at', 'c.ended_at', db.raw('CASE WHEN c.started_at IS NULL THEN 0 ELSE GREATEST(0, EXTRACT(EPOCH FROM (COALESCE(c.ended_at, CURRENT_TIMESTAMP) - c.started_at))) END as duration_seconds')).orderBy(q.order, q.direction).orderBy('c.id').limit(q.size).offset(q.offset),
    ]);
    res.json({ success: true, data: { rows, total: Number(count.total), page: q.page, page_size: q.size, average_duration_seconds: Number(duration.average || 0), count_by_status: statuses.map(row => ({ status: row.state, count: Number(row.count) })) } });
  });
  for (const feature of ['ocr', 'liveness']) {
    const columns = feature === 'ocr' ? ['status', 'submissionId', 'userId', 'userIdType', 'partnerSessionId', 'result', 'reasonCode', 'processedAt'] : ['submissionId', 'submissionType', 'partnerSessionId', 'userId', 'userIdType', 'partner', 'onboardingPartner', 'status', 'result', 'reasonCode', 'updatedAt'];
    const load = async req => {
      const { application } = await scope(req, feature === 'liveness' ? 'liveness' : null, ['superadmin', 'bank', 'officer']);
      const q = reportQuery({ ...req.query, status: undefined });
      if (req.query.status && !['COMPLETED', 'ERROR'].includes(req.query.status)) throw fail(422, 'INVALID_CALLBACK_STATUS');
      const result = await adapters.callbacks.history(application, feature);
      const rows = result.rows.filter(row => {
        const time = new Date(row.updatedAt || row.processedAt).getTime();
        return (!q.from || time >= q.from.getTime()) && (!q.until || time < q.until.getTime()) && (!req.query.status || row.status === req.query.status) && (!q.search || columns.some(key => String(row[key] ?? '').toLowerCase().includes(q.search.toLowerCase())));
      }).sort((a, b) => new Date(b.updatedAt || b.processedAt) - new Date(a.updatedAt || a.processedAt));
      return { rows, source: result.source, q, columns, application };
    };
    app.get([`${p}/${feature}`, `${p}/${feature}/report`], async (req, res) => {
      const { rows, source, q } = await load(req);
      res.json({ success: true, data: { source, rows: rows.slice(q.offset, q.offset + q.size), total: rows.length, page: q.page, page_size: q.size, count_by_status: ['COMPLETED', 'ERROR'].map(status => ({ status, count: rows.filter(row => row.status === status).length })) } });
    });
    app.get(`${p}/${feature}/export`, async (req, res) => {
      const { rows, columns, application } = await load(req);
      if (rows.length > 50000) throw fail(422, 'EXPORT_ROW_LIMIT');
      const cell = value => { const text = String(value ?? ''); return /^[=+@-]/.test(text) ? `'${text}` : text; };
      const output = makeXlsx([[feature, columns, rows.map(row => columns.map(key => cell(row[key])))]]);
      await audit(db, req.dashboard, `${feature}.exported`, { application_id: application.id, count: rows.length }, application.bank_id);
      res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').set({ 'cache-control': 'private, no-store', 'content-disposition': `attachment; filename="${feature}-callbacks.xlsx"` }).send(output);
    });
  }
}
