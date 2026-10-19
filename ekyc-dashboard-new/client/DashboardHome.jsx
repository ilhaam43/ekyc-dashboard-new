import { Link } from 'react-router-dom';
import { AppstoreOutlined, BankOutlined, FileTextOutlined, TeamOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';

export default function DashboardHome({ data, actor, banks }) {
  const central = ['admin', 'superadmin'].includes(actor.role);
  const bank = banks.find(row => row.id === actor.bank_id);
  const cards = (entries, className) => <div className={className}>{entries.map(({ label, value, icon: Icon, href }) => <div className="overview-card" key={label}><span className="overview-value">{value ?? '—'}</span><Icon/><span className="overview-label">{label}</span>{href && <Link to={href}>Browse <ArrowRightOutlined/></Link>}</div>)}</div>;
  return <div className="reference-home"><div className="page-heading"><div><h1>Dashboard</h1>{bank && <p>{bank.name}</p>}</div><time>{new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long' }).format(new Date())} · WIB</time></div>
    {central && <section aria-label="Overview"><h2>Overview</h2>{cards([{ label: 'Registered banks', value: data?.banks, icon: BankOutlined, href: '/banks' }, { label: 'Plan available', value: data?.plans, icon: FileTextOutlined, href: '/plans' }], 'overview-grid')}</section>}
    <section aria-label="Bank Overview"><h2>Bank Overview</h2>{cards([{ label: 'Total Apps', value: data?.applications, icon: AppstoreOutlined }, { label: 'Total Agents', value: data?.agents, icon: TeamOutlined }, { label: 'Total Users', value: data?.customers, icon: UserOutlined }], 'bank-overview-grid')}</section>
    <div className="overview-workspace"><div><h2>{central ? 'Bank applications' : 'Your applications'}</h2><p>{central ? 'Select a bank to manage applications, accounts, agents, and reports.' : 'Open an application to review customers, calls, and verification results.'}</p></div><Link className="primary button-link" to={central ? '/banks' : '/apps'}>{central ? 'Browse banks' : 'Browse applications'} <ArrowRightOutlined/></Link></div>
  </div>;
}
