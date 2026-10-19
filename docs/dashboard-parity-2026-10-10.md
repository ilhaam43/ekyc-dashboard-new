# Dashboard parity with infinid-dashboard

The replacement uses the original controllers, routes, models, browser scripts and EJS pages as its behavior reference. Original files remain unchanged. This is a workflow restoration, not a claim that production legacy data has been imported.

Run `node scripts/inventory-legacy-dashboard.mjs` for the source inventory: 16 controllers, 30 domain models plus the base model index, 53 EJS pages, route declarations, exported controller actions, model methods, helpers, middleware, validation and scheduled jobs. Static extraction is an index; it does not prove a function is reachable or working.

## Controller/action mapping

| Original controller/actions | Replacement behavior |
| --- | --- |
| Dashboard: index, login, logout | React workspace, server session, actual bcrypt verification, logout/revocation. Password failure never authenticates. |
| ForgotPassword: index, store, show, update; Profile: changePassword/Post | Password-reset request/confirmation, expiring single-use token, own password change, existing-session revocation. Email is an explicit local mock unless configured. |
| Bank: index, create/store, show, edit/update, destroy | List, legacy create/edit URLs, bank detail/application navigation, tenant-scoped bank record, optional initial bank-admin invitation, bank suspension. Production key provisioning uses the original external `key`, `IV`, `data` encryption payload; stores returned ciphertext without changing its format. |
| Bank: accounts/accountsCreate; Admin: index/create/insert/show/edit/update/destroy | Bank-scoped accounts list/create/edit, password form, deactivate/reactivate; global Administrator navigation reserved for superadmin. Existing password hashes remain usable. |
| Plan: index/create/store/destroy | Plan list/create/edit/delete, feature checkboxes, Kong route picker excluding public routes, ACL group, global/per-route rate limits and second/minute/hour/day/month/year periods. Plans in use cannot have rate policy edited underneath active consumers. |
| Application: index/create/store/getById/show/edit/update | Bank applications, request forms, details, legacy direct URLs, plan selection and assignment. Approved applications are locked for ordinary metadata editing. |
| Application: getUnconfirmedApplication/confirmApplication/rejectApplication | Review queue, approve/reject with audited reason; real Kong consumer/key/ACL/rate provisioning, failures prevent approval. Subscription suspension revokes ACL memberships; reactivation reapplies plan. |
| Application: usage/usageJSON/exportXls | Date-filtered service totals, daily chart and Excel export using server-side search adapter; complete WIB days, Elasticsearch date-histogram time zone. Mock totals are explicitly labeled. |
| Application: showExport/doExport; exporter/service and applicationJobSchedule | Titled, selectable customer/call/audit CSV/XLSX reports, durable retry/lease state, SHA-256 verification, private download, idempotent monthly catch-up scheduling. Customer profile fields come from the owning master API, not direct ciphertext parsing. |
| Agent: index/create/store/show/edit/update/destroy/activate/deactivate/changePassword/Post | Application/tenant-mapped agent list, creation, editing, deactivate/reactivate and dedicated password route/form. Credential changes revoke agent sessions. |
| Officer: list/create/store/show/edit/update and bank-scoped editOfficer/updateOfficer/password/delete actions | Bank-scoped officer management, create/edit/password forms and deactivate/reactivate. The old application officer router contains no working route declarations; no application-assignment behavior is invented. Officer self-administration privileges are not added. |
| User: index/show/destroy/exportXls | Paginated date/status/ID-filtered list, status counts, profile/occupation/address/fund/bank-account sections, documents, audit/call history, soft deletion, selectable private report. Legacy username links resolve through populated `dashboard_id_map` entries (`user`/`customer`). |
| Call: index | Non-waiting history, status/date/search filters, safe sort, one-based pagination, status counts, average final duration, details and authenticated stored-recording download. |
| OCR/Liveness: index/exportExcel | Original callback `body.data.data` adapter, search/status/WIB dates, pagination, counts and Excel download. Payload validated; malformed/unavailable upstream responses fail visibly. API keys come from the private Kong adapter and never appear in report responses. |
| Quota: index | Bank-scoped platform quota balances. This is distinct from importing the original application-period rate-limit ledger. |
| Link: index/create/insert/edit/update/destroy | Link management with superadmin writes, authenticated list and HTTPS validation. |
| Document: downloadFile | Authorized application/customer document download through SeaweedFS adapter; image preview in customer details. No arbitrary caller-provided object key. |

Detail, create, edit and password URLs now retain their action and record on refresh. They are no longer indiscriminately redirected to a list. UI navigation observes application features and role restrictions. Backend feature checks are independent of UI controls.

## Deliberate differences and unresolved parity

These remain part of the migration work, not finished production features:

1. **Actual legacy data and relationships.** Obtain the real sanitized PostgreSQL schema and identifiers. Import bank/accounts/plans/PlanService/applications/customer demographics/reference rows/call history additively, populate ID mappings and reconcile totals. Supplied MySQL-style exports are not executed against PostgreSQL. Existing platform records can be managed now.
2. **Encrypted customer search/demographic aggregates.** Current replacement search covers customer ID, date and verification status. The original supports encrypted name/NIK and sex/religion/marital-status filters, demographic charts and reference-table joins. Preserving those requires validating the real legacy ciphertext/query contract and mappings. The dashboard does not invent deterministic encryption or strip a presumed prefix from new ciphertext.
3. **Legacy OAuth2 and storage credentials.** The current platform uses Kong API keys and scoped platform tokens. Original OAuth2 credentials, direct bank MinIO accounts, MinIO password rotation and storage-account recreation need a validated compatibility/migration adapter. The new storage view reports platform documents/recordings; it does not claim MinIO credentials were migrated.
4. **Legacy period quota reconciliation.** Original `ApplicationRatelimit` remaining/reset windows and historical usage must be imported/reconciled. New Kong rate limits are configured, but a platform quota balance is not presented as the original monthly ledger.
5. **Bank settings/statistics handlers.** `showSettings`, `updateSettings`, and `statistics` exist in the old controller, but their endpoints are not mounted in the supplied bank router. The settings template includes a nonfunctional recording checkbox. They are indexed as legacy code, not advertised as functioning old endpoints.
6. **Public downloads and destructive GET actions.** Original public downloads and `GET /banks/recreate-all-storage-accounts` are retired. Private authenticated document/report downloads replace the legitimate download workflow. Deactivation/soft deletion preserves history; it does not immediately erase records as some old controllers did.

## Local and staging configuration

- Existing Docker dashboard address: `http://127.0.0.1:5301` after building/starting its Compose service.
- Real encrypted bank creation requires `ENCRYPTION_URL`, `MASTER_ENCRYPTION_KEY`, and `MASTER_ENCRYPTION_IV`. Explicit local `ENCRYPTION_MOCK=true` is forbidden in production.
- Set `DASHBOARD_OCR_CALLBACK_URL` and `DASHBOARD_LIVENESS_CALLBACK_URL` to fixed private callback endpoints. Both may point to the same legacy `/v1/callback` when that is how the bank integration exposes histories. Separate URLs are supported; don't invent a query parameter that the old service doesn't document.
- Callback access requires the application's real mapped Kong consumer and a key retrievable through the private Admin API. Callback fixtures are used only in external mock mode, with visible simulation labels.
- Configure Kong route, email, search and S3-compatible adapter credentials only on the server. No credentials are added to frontend assets.
- Run `npm run build -w @ekyc/dashboard`, then `node scripts/test-dashboard-parity-ui.mjs` from the workspace root. The browser test defaults to installed Microsoft Edge; `DASHBOARD_TEST_BROWSER` can select an installed Playwright channel.

## Validation

Validation uses synthetic fixtures and an isolated `ekyc_test` PostgreSQL database. Browser regression fixtures never write to a running tenant or real Kong. Tests cover direct URLs, bank/admin invitation, password-only forms, plan policy validation and Kong HTTP adapter writes, recording authorization, customer profile exports, encryption payload/ciphertext preservation, callback contracts, WIB boundaries, pagination, and cross-bank access. Real staging callbacks, encrypted legacy imports, Kong quota reconciliation and production restore tests remain release gates.

Verified locally on 2026-10-10: repository lint, 56 unit tests, 33 dashboard API integration tests (5 auth + 28 feature tests), 12 isolated browser workflows, Vite production build and Compose configuration validation passed. Docker Desktop and the local PostgreSQL test dependency were started for API tests; this does not mean the dashboard container was rebuilt/deployed.
