import { useState } from 'react';
import PlanFields from './PlanFields.jsx';

const names = { banks: 'Bank', bank: 'Bank', accounts: 'Admin Account', officers: 'Officer', agents: 'Agent', apps: 'Application', application: 'Application', plans: 'Plan', links: 'Link' };
export default function ManagementForm({ kind, initial, banks, plans, currentBank, onSave, onClose, busy, mode, api, actorRole }) {
  const bank = ['banks', 'bank'].includes(kind), application = ['apps', 'application'].includes(kind);
  const [values, setValues] = useState(() => ({ role: currentBank ? 'bank' : 'admin', ...initial, ...(kind === 'plans' ? { features: initial?.features || [], limits: typeof initial?.limits === 'string' ? JSON.parse(initial.limits) : initial?.limits || { type: 'none' } } : {}) }));
  const [manualPassword, setManualPassword] = useState(false);
  const change = (key, value) => setValues(previous => ({ ...previous, [key]: value }));
  const passwordOnly = mode === 'change-password';
  const title = passwordOnly ? `Change ${names[kind]} Password` : `${initial ? 'Edit' : application ? 'Request' : 'Create'} ${names[kind] || 'Record'}`;
  const field = (key, label, { required = true, type = 'text', help, readOnly = false } = {}) => <label key={key}>{label}{required && <span className="required-mark"> *</span>}<input aria-label={label} type={type} value={values[key] || ''} onChange={e => change(key, e.target.value)} required={required} readOnly={readOnly} autoComplete={type === 'password' ? 'new-password' : undefined} minLength={type === 'password' ? 12 : undefined} maxLength={type === 'password' ? 72 : key.includes('username') ? 100 : 254}/>{help && <small className="field-help">{help}</small>}</label>;
  const bankSelect = !currentBank && <label>Bank<span className="required-mark"> *</span><select required value={values.bank_id || ''} onChange={e => change('bank_id', e.target.value)}><option value="">Select bank</option>{banks.map(row => <option key={row.id} value={row.id}>{row.name} · {row.username}</option>)}</select></label>;
  async function submit(event) {
    event.preventDefault(); const body = { ...values };
    if (kind !== 'accounts') delete body.role;
    if (!body.password || (kind === 'accounts' && !manualPassword && !passwordOnly)) delete body.password;
    if (passwordOnly) return onSave({ password: body.password });
    if (initial) { if (kind !== 'accounts') delete body.username; delete body.role; delete body.bank_id; }
    return onSave(body);
  }
  return <section className="management-form-page"><div className="page-heading"><div><h1>{title}</h1>{currentBank && <p>{currentBank.name}</p>}</div><button type="button" onClick={onClose}>Back to list</button></div><form className="management-form" onSubmit={submit}>
    {bank ? <><section className="form-section"><h2>Bank details</h2><div className="form-grid">{field('username', 'Username', { readOnly: !!initial, help: 'Use a short, unique username. It cannot be changed after the bank is created.' })}{field('email', 'Email', { type: 'email' })}{field('name', 'Bank Name')}</div></section>{!initial && <section className="form-section"><h2>Dashboard account</h2><p>The bank administrator receives an invitation to set their own password. A private recording bucket and read-only storage access are provisioned automatically. The same bank credentials work in the storage console.</p><div className="form-grid">{field('admin_username', 'Bank admin username')}{field('admin_email', 'Bank admin email', { type: 'email' })}</div></section>}</>
      : passwordOnly ? <section className="form-section"><h2>Password</h2><p>Changing the password revokes existing sessions.</p><div className="form-grid">{field('password', 'Password', { type: 'password', help: 'Use 12–72 characters.' })}</div></section>
        : kind === 'plans' ? <><section className="form-section"><h2>Details</h2><div className="form-grid">{field('name', 'Plan name')}{field('shortname', 'Short name', { required: false, readOnly: !!initial, help: 'No spaces. Leave blank to generate automatically.' })}<label className="full-width">Description<textarea value={values.description || ''} onChange={e => change('description', e.target.value)} maxLength={1000}/></label></div></section><section className="form-section"><h2>Services & access</h2><p>Select the APIs and dashboard features available to this application.</p><div className="form-grid"><PlanFields values={values} setValues={setValues} api={api}/></div></section></>
          : <section className="form-section"><h2>{application ? 'Application details' : kind === 'accounts' ? 'Dashboard account' : `${names[kind]} details`}</h2><div className="form-grid">
            {kind === 'accounts' && <><fieldset className="account-role"><legend>Role<span className="required-mark"> *</span></legend>{(initial ? [initial.role] : currentBank ? ['bank'] : actorRole === 'superadmin' ? ['admin', 'superadmin'] : []).map(role => <label key={role}><input type="radio" name="account-role" value={role} checked={values.role === role} disabled={!!initial || !!currentBank} onChange={() => change('role', role)}/>{role}</label>)}</fieldset>{currentBank && <label>Bank<input readOnly aria-label="Bank" value={currentBank.username}/></label>}</>}
            {kind === 'officers' && bankSelect}
            {['agents', 'officers', 'links'].includes(kind) && field('name', kind === 'links' ? 'Title' : 'Name')}
            {['accounts', 'agents', 'officers'].includes(kind) && field('username', 'Username', { readOnly: !!initial && kind !== 'accounts' })}
            {['accounts', 'officers'].includes(kind) && field('email', 'Email', { type: 'email' })}
            {application && <>{field('name', 'Application name')}<label className="full-width">Description<textarea value={values.description || ''} onChange={e => change('description', e.target.value)} maxLength={1000}/></label><label>Plan<span className="required-mark"> *</span><select required value={values.plan_id || ''} onChange={e => change('plan_id', e.target.value)}><option value="">Select plan</option>{plans.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>{values.plan_id && <div className="selected-plan-note">{plans.find(row => row.id === values.plan_id)?.description || 'Access follows the selected plan.'}</div>}</>}
            {kind === 'links' && field('url', 'HTTPS URL', { type: 'url' })}
            {kind === 'accounts' && !initial && <div className="full-width account-invitation"><p>An invitation is sent by email. No shared password is needed.</p><label><input type="checkbox" checked={manualPassword} onChange={e => setManualPassword(e.target.checked)}/>Set a password manually</label></div>}
            {((['agents', 'officers'].includes(kind) && !initial) || (kind === 'accounts' && !initial && manualPassword)) && field('password', 'Password', { type: 'password' })}
          </div></section>}
    <div className="form-page-actions"><button type="button" onClick={onClose}>Batal</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : application && !initial ? 'Request Application' : 'Simpan'}</button></div>
  </form></section>;
}
