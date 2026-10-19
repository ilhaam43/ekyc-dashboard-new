# Local dashboard acceptance results — 14 October 2026 (WIB)

Target: running Docker deployment at http://127.0.0.1:5301. No requests or mutations were made to the live Lintasarta website. Browser checks used the deployed client/API without intercepted responses. Test accounts, banks, plans, applications, agents, customers, and links were synthetic and uniquely identified.

## Deployed checks: 21 passed

| Area | Verified behavior |
| --- | --- |
| Authentication | Existing superadmin login; incorrect password rejected; deployed session identity |
| Banks | Create, read, edit with mapped tenant |
| Accounts | Admin/bank account creation; invitation stores an expiring token hash; username/email edit; immutable role |
| Authorization | Admin cannot list/create/edit/delete central administrators; self-deactivation blocked; cross-bank account/application access rejected |
| Plans | Creation with generated short names, real subscription counts, limited and unlimited configurations |
| Applications | Bank requests an application; ordinary admin approves it; real Kong consumer/API key provisioned; key omitted from subsequent detail reads |
| Kong | A disposable test-only route enforces key-auth and ACL; two allowed requests followed by HTTP 429 for the configured limit |
| Subscription lifecycle | Inactivation returns HTTP 403 at the Kong proxy; reactivation and plan reassignment work; unlimited assignment removes the consumer rate plugin while retaining authentication |
| Agents | Create/list/edit mapped to the synthetic bank/application |
| Links | Superadmin create/edit/delete; ordinary admin mutation rejected |
| Customers | Synthetic customer detail read through the deployed master API |
| Exports/storage | HTTP 202 starts an asynchronous export; real worker produces XLSX; report is stored in SeaweedFS; downloaded ZIP signature and SHA-256 match |
| Browser | Actual login/navigation/forms for superadmin, admin, and bank; correct menus/role controls; forbidden direct central account URL; customer page; mobile layout without horizontal overflow or JavaScript errors |
| Cleanup | Deactivation/delete actions tested; temporary Kong route/service/consumer, data fixtures, and completed test export removed |

The test created its own Kong route/service pointing only to local dashboard readiness. It did not change existing API routes or bank subscriptions. API keys and random test passwords were kept in memory and are excluded from the report.

Database follow-up confirmed **zero** remaining acceptance-prefixed accounts, banks, plans, and applications. Detailed check results and synthetic IDs: `.local/dashboard-deployed-test.json`. Browser screenshots: `.local/previews/dashboard-deployed-{superadmin,admin,bank}.png`.

## Additional regression checks

- 57 unit tests.
- 39 dashboard API/authentication integration tests against the separate `*_test` database.
- 23 isolated fixture-based browser workflows, in addition to the deployed browser checks above.
- ESLint and whitespace checks.

## Limits of this result

Local email delivery is explicitly mocked: the invitation was created correctly, but no real email was sent. Encryption, provider OCR/liveness, and usage integrations use the existing local mock configuration and require staging contract tests. This run did not establish production data-import parity, reconcile the legacy application billing-quota ledger, place a new Jitsi/Jibri video call, or repeat the five-recording capacity test. Those remain separate release gates.

## Repeat safely

Set `DASHBOARD_TEST_USERNAME` and `DASHBOARD_TEST_PASSWORD` to the local superadmin account in the shell, then run from the platform root:

```powershell
node --env-file=.env scripts/test-dashboard-deployed.mjs
```

The harness rejects non-loopback dashboard/database hosts and production mode. It creates disposable fixtures and deletes only tracked test resources. Authentication rate limits remain enabled; the harness respects a `Retry-After` response between repeated runs. Docker, the dashboard/worker, PostgreSQL, Kong, master/calls services, SeaweedFS, and a local Edge/Chromium installation must be available.
