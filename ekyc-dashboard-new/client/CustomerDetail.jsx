import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const text = value => value === null || value === undefined || value === '' ? '—' : typeof value === 'object' ? JSON.stringify(value) : String(value);
const label = name => name.replaceAll('_', ' ');
function Fields({ values }) { return <dl className="detail-list">{Object.entries(values).map(([key, value]) => <div key={key}><dt>{label(key)}</dt><dd>{text(value)}</dd></div>)}</dl>; }
export default function CustomerDetail({ item, applicationId, api, onDelete }) {
  const { pathname } = useLocation();
  const [documents, setDocuments] = useState([]), [activity, setActivity] = useState(null), [error, setError] = useState(''), [tab, setTab] = useState('profile');
  useEffect(() => {
    let current = true;
    Promise.all([api(`/customers/${item.id}/documents?application_id=${applicationId}`), api(`/customers/${item.id}/activity?application_id=${applicationId}`)]).then(([docs, history]) => { if (current) { setDocuments(docs); setActivity(history); } }).catch(err => { if (current) setError(err.message); });
    return () => { current = false; };
  }, [item.id, applicationId, api]);
  const nested = ['occupation', 'occupation_detail', 'addresses', 'fund', 'bank_account'];
  const profile = Object.fromEntries(Object.entries(item).filter(([key]) => !nested.includes(key)));
  return <section><div className="inline-actions"><button onClick={() => setTab('profile')} aria-pressed={tab === 'profile'}>Profil nasabah</button><button onClick={() => setTab('documents')} aria-pressed={tab === 'documents'}>Dokumen ({documents.length})</button><button onClick={() => setTab('activity')} aria-pressed={tab === 'activity'}>Riwayat aktivitas</button></div>{error && <p role="alert" className="notice">{error}</p>}
    {tab === 'profile' && <><Fields values={profile}/>{nested.map(key => <section key={key} className="customer-section"><h3>{label(key)}</h3>{item[key] && typeof item[key] === 'object' ? <Fields values={item[key]}/> : <p>{text(item[key])}</p>}</section>)}</>}
    {tab === 'documents' && <div className="customer-documents">{documents.length ? documents.map(doc => <article key={doc.id}><h3>{doc.type || 'Dokumen'}</h3>{doc.mimetype?.startsWith('image/') && <img alt={doc.type || 'Dokumen nasabah'} src={`/dashboard/api/v1/documents/${doc.id}/download?application_id=${applicationId}`}/>}<a href={`/dashboard/api/v1/documents/${doc.id}/download?application_id=${applicationId}`}>Download</a></article>) : <p>{error ? 'Dokumen tidak dapat dimuat.' : 'Belum ada dokumen.'}</p>}</div>}
    {tab === 'activity' && <><h3>Call history</h3>{activity?.calls?.map(call => <p key={call.id}><Link to={pathname.replace(/\/users\/[^/]+$/, `/calls/${call.id}`)}>{call.id}</Link> · {call.state} · {call.outcome || '—'}</p>)}<h3>Audit activity</h3>{activity?.events?.map(event => <p key={event.id}>{new Date(event.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB · {event.action}</p>)}{activity && !activity.calls?.length && !activity.events?.length && <p>Belum ada aktivitas.</p>}</>}
    <div className="modal-actions"><button className="danger" onClick={onDelete}>Nonaktifkan nasabah</button></div>
  </section>;
}
