import { useEffect, useState } from 'react';

const columns = {
  users: [['name', 'Customer'], ['id_number', 'NIK'], ['verification_status', 'Verification'], ['created_at', 'Registered']],
  calls: [['id', 'Call ID'], ['user_id', 'Customer ID'], ['agent_name', 'Agent'], ['state', 'Status'], ['outcome', 'Outcome'], ['reason', 'Reason'], ['duration_seconds', 'Duration (sec)'], ['created_at', 'Registered'], ['started_at', 'Started'], ['ended_at', 'Ended']],
  ocr: [['status', 'Status'], ['submissionId', 'Submission ID'], ['userId', 'User ID'], ['userIdType', 'ID type'], ['partnerSessionId', 'Partner session'], ['result', 'Result'], ['reasonCode', 'Reason'], ['processedAt', 'Processed']],
  liveness: [['submissionId', 'Submission ID'], ['submissionType', 'Type'], ['partnerSessionId', 'Partner session'], ['userId', 'User ID'], ['userIdType', 'ID type'], ['partner', 'Partner'], ['onboardingPartner', 'Onboarding partner'], ['status', 'Status'], ['result', 'Result'], ['reasonCode', 'Reason'], ['updatedAt', 'Updated']],
};
const callStates = ['assigned', 'preparing_recording', 'ringing', 'active', 'completing', 'completed', 'canceled', 'missed', 'failed'];
const display = value => {
  if (value === null || value === undefined || value === '') return '—';
  if (/^\d{4}-\d{2}-\d{2}T/.test(String(value))) return new Date(value).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB';
  return typeof value === 'number' ? Math.round(value * 100) / 100 : String(value);
};
export default function HistoryPage({ kind, applicationId, api, onDetail, refreshKey }) {
  const [filters, setFilters] = useState({ from: '', to: '', status: '', search: '', page: 1, page_size: 20, order_by: 'register_time', order_direction: 'DESC' });
  const [result, setResult] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const query = new URLSearchParams({ ...filters, application_id: applicationId }).toString();
  useEffect(() => {
    let current = true;
    setLoading(true); setError('');
    api(`/${kind === 'users' ? 'customers' : kind}/report?${query}`).then(data => { if (current) setResult(data); }).catch(err => { if (current) { setResult(null); setError(err.message); } }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [kind, query, api, refreshKey]);
  const update = (key, value) => setFilters(previous => ({ ...previous, [key]: value, page: key === 'page' ? value : 1 }));
  const download = async () => {
    try {
      const response = await fetch(`/dashboard/api/v1/${kind}/export?${query}`, { credentials: 'same-origin' });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error?.code || 'DOWNLOAD_FAILED');
      const url = URL.createObjectURL(await response.blob()), link = document.createElement('a');
      link.href = url; link.download = `${kind}-callbacks.xlsx`; link.click(); URL.revokeObjectURL(url);
    } catch (err) { setError(err.message); }
  };
  return <section>
    <div className="page-heading"><div><p className="eyebrow">APPLICATION HISTORY</p><h1>{kind === 'users' ? 'Users' : kind === 'calls' ? 'Calls' : kind === 'ocr' ? 'OCR' : 'Liveness'}</h1><p>Riwayat, statistik, dan pencarian data aplikasi.</p></div>{['ocr', 'liveness'].includes(kind) && <button className="primary" disabled={!result || loading} onClick={download}>Export Excel</button>}</div>
    {error && <div className="notice" role="alert">{error === 'CALLBACK_HISTORY_NOT_CONFIGURED' ? 'Layanan callback belum dikonfigurasi untuk lingkungan ini.' : error}</div>}
    {result?.source === 'synthetic' && <p className="info-panel">Data simulasi lokal — bukan hasil verifikasi nasabah nyata.</p>}
    <div className="history-filters">
      <label>Dari (WIB)<input type="date" value={filters.from} onChange={e => update('from', e.target.value)}/></label>
      <label>Sampai (WIB)<input type="date" value={filters.to} onChange={e => update('to', e.target.value)}/></label>
      <label>Status<select value={filters.status} onChange={e => update('status', e.target.value)}><option value="">Semua status</option>{(kind === 'users' ? ['waiting', 'verified', 'not_verified', 'rejected'] : kind === 'calls' ? callStates : ['COMPLETED', 'ERROR']).map(state => <option key={state}>{state}</option>)}</select></label>
      <label>Cari<input value={filters.search} onChange={e => update('search', e.target.value)} placeholder={kind === 'users' ? 'Customer ID' : kind === 'calls' ? 'Call / customer ID / agent' : 'Submission / user / partner'}/></label>
      {kind === 'calls' && <><label>Urutkan<select value={filters.order_by} onChange={e => update('order_by', e.target.value)}><option value="register_time">Registered</option><option value="call_start_time">Started</option><option value="call_end_time">Ended</option></select></label><label>Arah<select value={filters.order_direction} onChange={e => update('order_direction', e.target.value)}><option>DESC</option><option>ASC</option></select></label></>}
    </div>
    {result && <div className="history-stats"><div><span>Total</span><strong>{result.total}</strong></div>{kind === 'calls' && <div><span>Rata-rata durasi</span><strong>{Math.round(result.average_duration_seconds)} detik</strong></div>}{result.count_by_status?.map(row => <div key={row.status}><span>{row.status.replaceAll('_', ' ')}</span><strong>{row.count}</strong></div>)}</div>}
    <div className="table-wrap" aria-busy={loading}><table><thead><tr>{columns[kind].map(([key, title]) => <th key={key}>{title}</th>)}{['users', 'calls'].includes(kind) && <th>Detail</th>}</tr></thead><tbody>{result?.rows.map(row => <tr key={row.id || row.submissionId}>{columns[kind].map(([key]) => <td key={key}>{display(row[key])}</td>)}{['users', 'calls'].includes(kind) && <td><button onClick={() => onDetail(row)}>Detail</button></td>}</tr>)}{!result?.rows.length && <tr><td colSpan={columns[kind].length + 1} className="empty">{loading ? 'Memuat…' : error ? 'Data tidak tersedia.' : 'Belum ada riwayat untuk filter ini.'}</td></tr>}</tbody></table></div>
    <div className="history-pagination"><label>Per halaman<select value={filters.page_size} onChange={e => update('page_size', Number(e.target.value))}>{[20, 50, 100].map(size => <option key={size}>{size}</option>)}</select></label><span>Halaman {filters.page} / {Math.max(1, Math.ceil((result?.total || 0) / filters.page_size))}</span><button disabled={loading || filters.page <= 1} onClick={() => update('page', filters.page - 1)}>Sebelumnya</button><button disabled={loading || !result || filters.page * filters.page_size >= result.total} onClick={() => update('page', filters.page + 1)}>Berikutnya</button></div>
  </section>;
}
