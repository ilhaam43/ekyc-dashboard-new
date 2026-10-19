const titles = { bank: 'Bank details', banks: 'Banks', plans: 'Plans', apps: 'Applications', accounts: 'Accounts', links: 'Links', storage: 'Storage', officers: 'Officers', users: 'Users', agents: 'Agents', calls: 'Calls', liveness: 'Liveness', ocr: 'OCR', usage: 'API Usage', exports: 'Exports' };
// Keep the action and record in the URL: refresh and shared legacy links must
// reopen the same form/detail, rather than silently returning to the list.
export function resolvePage(pathname, banks, actor) {
  if (['/', '/dashboard', '/login'].includes(pathname)) return { kind: 'dashboard', title: 'Dashboard' };
  if (pathname === '/profile/change-password') return { kind: 'password', title: 'Ganti password' };
  if (pathname === '/app-requests') return { kind: 'requests', title: 'Application Requests' };
  if (pathname === '/quota') return { kind: 'quota', title: 'Quota' };
  let tail = pathname, bank = banks.find(row => row.id === actor?.bank_id);
  const matched = pathname.match(/^\/banks\/@([^/]+)(.*)$/);
  if (matched) {
    bank = banks.find(row => row.username === decodeURIComponent(matched[1]));
    if (!bank) return { kind: 'missing', title: 'Bank tidak ditemukan' };
    tail = matched[2] || '/';
  }
  if (matched && ['/', '/edit'].includes(tail)) return { kind: 'bank', title: titles.bank, bank, action: tail === '/edit' ? 'edit' : null, parent: pathname.replace(/\/edit$/, '') };
  const app = tail.match(/^\/apps\/([^/]+)(?:\/(.*))?$/);
  if (app && app[1] !== 'create') {
    const parts = (app[2] || '').split('/').filter(Boolean);
    if (!parts.length || parts[0] === 'edit') return { kind: 'application', title: 'Application', bank, appId: app[1], action: parts[0] || null, parent: pathname.replace(/\/edit$/, '') };
    const [kind, record, action] = parts;
    const exportAction = ['export', 'export-excel', 'export-xlsx'].includes(record);
    return { kind, title: titles[kind] || kind, bank, appId: app[1], record: record && record !== 'create' && !exportAction && record !== 'json' ? decodeURIComponent(record) : null, action: exportAction ? 'export' : record === 'create' ? 'create' : action || (record ? 'detail' : null), parent: pathname.slice(0, pathname.indexOf(`/${kind}`, pathname.indexOf('/apps/') + 6) + kind.length + 1) };
  }
  const [kind, record, action] = tail.split('/').filter(Boolean);
  return { kind: kind || 'bank', title: titles[kind] || 'Dashboard', bank, record: record && record !== 'create' ? decodeURIComponent(record) : null, action: record === 'create' ? 'create' : action || (record ? 'detail' : null), parent: matched ? `/banks/@${bank.username}/${kind}` : `/${kind}` };
}
