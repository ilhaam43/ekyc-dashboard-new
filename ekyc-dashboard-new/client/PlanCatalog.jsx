import { useEffect, useState } from 'react';

const features = { user: 'User', agent: 'Video Call', liveness: 'Liveness', 'api-usage': 'API Usage' };
export default function PlanCatalog({ rows, api }) {
  const [routes, setRoutes] = useState([]);
  useEffect(() => { let current = true; api('/plan-routes').then(data => { if (current) setRoutes(data.rows); }).catch(() => {}); return () => { current = false; }; }, [api]);
  return <div className="plan-catalog">{rows.length ? rows.map(plan => {
    const limits = typeof plan.limits === 'string' ? JSON.parse(plan.limits) : plan.limits || {};
    const selected = limits.routes || [];
    return <article className="plan-card" key={plan.id}><header><h2>{plan.name} <small>@{plan.shortname}</small></h2><p>Created at {plan.created_at ? new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(plan.created_at)) + ' WIB' : '—'}</p></header><div className="plan-card-summary"><section><h3>Dashboard features</h3><div className="feature-badges">{plan.features?.length ? plan.features.map(feature => <span key={feature}>{features[feature] || feature}</span>) : <span>No dashboard features</span>}</div></section><section><h3>Subscribed apps</h3><strong>{plan.subscribed_applications ?? '—'}</strong></section><section><h3>Rate limiting</h3>{limits.type === 'none' ? <p>No Rate Limiting</p> : limits.type === 'routes' ? <ul>{selected.map(route => <li key={route.id}>{routes.find(row => row.id === route.id)?.name || route.id}: <b>{route.limit}</b> hit / {route.period}</li>)}</ul> : <p>{limits.limit ?? limits.requests_per_minute ?? 60} hit / {limits.period || 'minute'}</p>}</section></div><details><summary>Services <span>Show/hide</span></summary><ul className="plan-service-list">{selected.length ? selected.map(selectedRoute => { const route = routes.find(row => row.id === selectedRoute.id); return <li key={selectedRoute.id}><strong>{route?.name || selectedRoute.id}</strong>{route && <small>{route.methods?.join(', ') || 'ALL'} {route.paths?.join(', ')}</small>}</li>; }) : <li>Configured default API route</li>}</ul></details></article>;
  }) : <div className="empty-state">No plans available.</div>}</div>;
}
