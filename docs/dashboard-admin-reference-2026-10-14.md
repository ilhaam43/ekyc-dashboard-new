# Superadmin and admin reference review — 14 October 2026 (WIB)

Reference: https://dashboard-ekyc.lintasarta.net/login. Inspection used the explicitly supplied superadmin login. The earlier account identified itself as **Service Provider Admin**, not a bank account. Only sign-in/sign-out, navigation, and unsaved form controls were used. No live records were created, edited, deleted, approved, or exported. Production passwords and account records were not copied into code, fixtures, or this document.

## Role and form requirements

| Capability | Superadmin | Service-provider admin |
| --- | --- | --- |
| Dashboard overview, banks, plans, application requests, quotas | Available | Available |
| Global Administrator menu and central account CRUD | Available | Forbidden, including direct URLs and API requests |
| Central account creation | `admin` selected by default; `superadmin` alternative | Forbidden |
| Bank account management in selected bank | Available; bank role fixed | Available; bank role fixed |
| Bank role creation in central Administrator form | Not shown; use bank's Accounts page | Not shown |
| Account role/bank reassignment through edit | Immutable | Immutable |
| Username and email editing | Available to authorized account manager | Bank accounts only |
| Global links creation/editing | Available | Read-only |
| Self-deactivation | Blocked | Blocked |

The local API now enforces this distinction. `GET /dashboard/api/v1/accounts` lists only central accounts and requires superadmin; bank-scoped account listings use `bank_id` and return only bank-role accounts. Existing bank actors can read their own bank accounts but cannot forge another bank's scope. Central account creation/edit/deactivation requires superadmin. Existing account IDs and roles survive username editing; passwords are not changed by a rename. Invitations use the existing expiring one-time setup mechanism, and responses exclude password/reset hashes.

## Applied design and workflows

- Shared navy header and light contextual sidebar retain the earlier reference redesign. The unscoped Officers menu was removed from the central menu; bank-scoped officer management remains available.
- Central Administrator forms now use the reference radio controls (`admin`/`superadmin`), username and email fields, with no bank selector. Bank account forms show the fixed bank role and bank identity. Default password setup is an email invitation; the existing explicit manual-password option remains useful in local mock mode.
- Account edit supports username and email while keeping role and bank assignment fixed. Deactivating the current session's account is blocked by the API and disabled in the list.
- Plans use read-only cards showing name/short name, creation time in WIB, dashboard features, actual subscribed-application count, rate policy, and expandable services. Known services resolve through the private configured Kong route catalog; unknown route IDs remain visible without fabricated names. Existing plan compatibility/update endpoints remain protected; an assigned plan's policy still requires a new plan and reassignment.
- Bank list offers Copy bank id and Edit. Deactivation retains the safer existing confirmation/soft-delete workflow.
- The header profile menu shows the signed-in username and role description and provides Change Password and Logout. Only the current user's safe identity fields are returned by the session API.
- Superadmin Link creation uses Title and HTTPS URL fields.

The original controller/routes corroborate the live distinction: central `/accounts` uses `allowRoles('superadmin')`, the central list excludes bank accounts, and account creation offers only `admin` and `superadmin`.

## Verification and limitations

- 57 unit tests passed.
- 39 dashboard API/authentication integration tests passed against the isolated PostgreSQL test database. Coverage includes direct admin requests to central accounts, bank scope, immutable role, username rename/login, own-account deactivation, safe session data, and stored subscription counts.
- 23 isolated browser workflows passed with synthetic fixtures, including both role menus/forms, forbidden direct navigation, plan cards/services, profile navigation, and mobile layouts. Screenshots are under `.local/previews/`.
- Build and ESLint passed. Docker dashboard/worker deployment is validated separately through readiness and authenticated checks.
- The rebuilt dashboard and worker are running locally. Authenticated deployed checks confirmed the signed-in username/role, a central account list without bank-role accounts, and real plan subscription counts; dashboard readiness returned HTTP 200. Existing login credentials were retained.

This supplements the earlier [live-reference review](dashboard-live-reference-2026-10-14.md). Existing application detail errors, missing legacy quota billing-ledger reconciliation, real data/schema import, and external service contracts remain the documented migration gaps. No additional superadmin permission was inferred for provider/customer features that could not be inspected live.
