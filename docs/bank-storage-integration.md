# Bank recording storage integration

## Operator flow

1. Create a bank in the eKYC dashboard, optionally including its initial administrator invitation. The transaction queues storage provisioning and maps the invited bank account. Adding a bank-role account later also maps it automatically.
2. The dashboard worker creates the bank's private bucket and SeaweedFS read-only IAM identity/policy. Failed jobs retry; new bank recordings cannot fall back to a shared bucket while provisioning is incomplete.
3. Check **Bank → Storage** for the bucket and provisioning status. The page links to the bank storage sign-in.
4. The bank signs in at `http://127.0.0.1:58082/bank/login` with its normal dashboard credentials, after its invitation/password setup. There is no separately distributed storage password.
5. A completed recording becomes downloadable in **Application → Calls → Detail** and in the bank's storage recording list. Both paths enforce bank ownership and read from the recording's saved bucket.

Bank access is limited to listing and downloading its own stored recordings. Upload, delete, rename, policy changes, root connection selection, and cross-bank downloads are rejected server-side. Storage administrator access is separate at `/login`.

## Data and reliability

- `platform_tenant_storage`: per-tenant bucket, provisioning state, retries/lease, and native IAM mapping.
- `dashboard_storage_accounts`: maps bank-role dashboard identities to the tenant. It contains no password or S3 secret.
- `platform_recordings.bucket`: immutable upload destination for retries, or the verified destination after a legacy copy. A null value on an older stored recording means the legacy configured recording bucket.
- The uploader pins the destination before upload, checks video/audio and size, uploads, verifies SHA-256/bytes, then confirms durable storage.
- Legacy objects are copied with source and destination checksum verification. The metadata changes only after verification. Original objects are retained. A failed copy is retried and downloads continue using the original location.
- Bank sessions are separate from dashboard sessions, but use the same identity authority. Current password, active account, active bank and active tenant are checked on every storage request. Bank IDs, bucket names and object keys are never accepted as authorization inputs.
- Bucket creation is idempotent. A partial IAM outage leaves a visible retryable state. Bank/account creation is not rolled back or silently reported as fully provisioned.

## Deployment and checks

Apply migration `008_bank_storage` before running the updated dashboard, worker, calls service and storage UI. The storage UI now needs its configured PostgreSQL and Valkey connections. Set `STORAGE_CONSOLE_ORIGIN` to the exact public HTTPS origin in deployment; localhost defaults to `http://127.0.0.1:58082`.

Local acceptance on 19 October 2026 covered two disposable banks, both account-creation paths, repeated provisioning, real uploader processing of generated MP4s, correct bucket/checksum metadata, dashboard and console downloads, native IAM read-only checks, cross-bank denial, legacy migration, and immediate password/account/bank revocation. `.local/bank-storage-test.json` records the checks and fixture cleanup. This is not a live Jitsi/Jibri conference test.
