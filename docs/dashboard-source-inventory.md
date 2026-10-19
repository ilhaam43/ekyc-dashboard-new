# Legacy dashboard source inventory

Generated from `infinid-dashboard` by `node scripts/inventory-legacy-dashboard.mjs`. The code is not copied or modified. See `dashboard-inventory.md` for status, permissions, and data ownership.

## Controllers (16)

| File | Exported actions |
| --- | --- |
| `controllers/AdminController.js` | index, create, insert, show, edit, update, destroy |
| `controllers/AgentController.js` | index, create, store, edit, update, show, destroy, activate, deactivate, changePassword, changePasswordPost |
| `controllers/ApplicationController.js` | index, create, store, getById, show, edit, update, usage, usageJSON, exportXls, getUnconfirmedApplication, confirmApplication, rejectApplication, showExport, doExport |
| `controllers/BankController.js` | index, create, store, show, edit, update, destroy, statistics, accounts, accountsCreate, showSettings, updateSettings, storage, updateStorageSecretKey, recreateAllMinioUsers |
| `controllers/CallController.js` | index |
| `controllers/DashboardController.js` | index, login, logout |
| `controllers/DocumentController.js` | downloadFile, publicDownload |
| `controllers/ForgotPasswordController.js` | index, store, show, update |
| `controllers/LinkController.js` | index, create, insert, edit, update, destroy |
| `controllers/LivenessController.js` | index, exportExcel |
| `controllers/OCRController.js` | index, exportExcel |
| `controllers/OfficerController.js` | index, create, store, edit, update, show, destroy, activate, deactivate, changePassword, changePasswordPost, editOfficer, updateOfficer, changePasswordOfficer, changePasswordOfficerPost, deleteOfficer |
| `controllers/PlanController.js` | index, create, store, destroy |
| `controllers/ProfileController.js` | changePassword, changePasswordPost |
| `controllers/QuotaController.js` | index |
| `controllers/UserController.js` | index, show, destroy, exportXls |

## Models (31)

| Model | Methods / hooks (static extraction) |
| --- | --- |
| `models/AccountPuporse.js` | tableName |
| `models/Actor.js` | tableName |
| `models/Address.js` | tableName, encryptedColumns, relationMappings |
| `models/Admin.js` | tableName, hidden, relationMappings |
| `models/Agent.js` | tableName, hidden, relationMappings |
| `models/Application.js` | tableName, relationMappings, createConsumer, withDetails |
| `models/ApplicationRatelimit.js` | tableName, relationMappings |
| `models/Bank.js` | tableName, relationMappings |
| `models/BankAccount.js` | tableName, encryptedColumns, relationMappings |
| `models/BankSetting.js` | tableName, defaultSettingsValue, $formatJson |
| `models/BusinessSector.js` | tableName |
| `models/Call.js` | tableName, relationMappings |
| `models/CallHistory.js` | tableName, relationMappings |
| `models/Document.js` | tableName |
| `models/ExportedDocument.js` | tableName |
| `models/Fund.js` | tableName, relationMappings |
| `models/FundSource.js` | tableName |
| `models/Income.js` | tableName |
| `models/Link.js` | tableName |
| `models/Occupation.js` | tableName |
| `models/Officer.js` | tableName, hidden, relationMappings |
| `models/Plan.js` | tableName, relationMappings, $formatJson, services |
| `models/PlanService.js` | tableName, idColumn |
| `models/PostalCode.js` | tableName, relationMappings |
| `models/QueryBuilder/index.js` | whereNotDeleted, softDelete |
| `models/Transaction.js` | tableName |
| `models/User.js` | tableName, columns, encryptedColumns, casts, documentTypes, relationMappings, hidden, QueryBuilder |
| `models/UserLogActivity.js` | tableName, steps, modifiers, orderByTimestamp |
| `models/UserOccupation.js` | tableName, encryptedColumns, relationMappings |
| `models/VerificationStatus.js` | tableName, status |
| `models/index.js` | visibilityPlugin |

## Helpers, middleware, validation and jobs (42 files)

| File | Named functions (static extraction) |
| --- | --- |
| `helpers/ColorGenerator.js` | randomInt, getLightHSL, getDarkHSL, toHSL |
| `helpers/EmailService.js` | send, then |
| `helpers/EncryptionService.js` | encrypt, then, decrypt, massiveEncrypt, massiveDecrypt, arrayEncrypt, arrayDecrypt |
| `helpers/Minio.js` | configuration / anonymous callbacks |
| `helpers/MinioUserManagement.js` | bucketExists, makeBucket, on, removeObjects, removeBucket, addMinioUser, changePasswordMinioUser, deleteMinioUser |
| `helpers/index.js` | configuration / anonymous callbacks |
| `helpers/randomStringGenerator.js` | configuration / anonymous callbacks |
| `middlewares/allowRoles.js` | configuration / anonymous callbacks |
| `middlewares/applicationHasFeature.js` | configuration / anonymous callbacks |
| `middlewares/applicationIsConfirmed.js` | configuration / anonymous callbacks |
| `middlewares/applicationIsRejected.js` | configuration / anonymous callbacks |
| `middlewares/cacheControl.js` | function |
| `middlewares/getBankData.js` | getBankData |
| `middlewares/index.js` | configuration / anonymous callbacks |
| `middlewares/isAuthenticated.js` | configuration / anonymous callbacks |
| `middlewares/isNotAuthenticated.js` | configuration / anonymous callbacks |
| `middlewares/storageMiddleware.js` | configuration / anonymous callbacks |
| `middlewares/validateBody.js` | configuration / anonymous callbacks |
| `src/banks.apps.usage.react.js` | configuration / anonymous callbacks |
| `src/plans.create.js` | configuration / anonymous callbacks |
| `src/users.js` | debounce, function, Users, then, setFilterGroups |
| `utils/applicationJobSchedule.js` | configuration / anonymous callbacks |
| `utils/breadcrumbs.js` | function |
| `utils/csp.js` | generateNonce, getNonce, getDirectives |
| `utils/elasticsearch.js` | requestsOfConsumer |
| `utils/errors.js` | configuration / anonymous callbacks |
| `utils/excel-generator.js` | generateApiUsageReport, createRequestsWorkbook, createUsersWorkBook |
| `utils/exporter.service.js` | createExportJob, OUTPUT_TYPE, createExcelFile, createJSONFile, createFile, createAndStoreFile |
| `utils/kong-admin.js` | Plugin, function |
| `utils/minio.js` | getMinioUrlFromPath, function |
| `utils/passport-config.js` | configuration / anonymous callbacks |
| `utils/utils.js` | slugify, omitBy, mapObj, flattenObj, function, recurse, lastMonthStartLimit, lastYearStartLimit |
| `validations/account.js` | insertAccountSchema, updateAccountSchema, resetPasswordSchema |
| `validations/agent.js` | insertAgentSchema, changePasswordAgentSchema, updateAgentSchema |
| `validations/app.js` | insertAppSchema |
| `validations/bank.js` | insertBankSchema, updateBankSchema |
| `validations/exports.js` | exportDocument |
| `validations/link.js` | createLinkSchema, updateLinkSchema |
| `validations/officer.js` | insertOfficerSchema, updateOfficerSchema, changePasswordOfficerSchema |
| `validations/plan.js` | insertPlanSchema |
| `validations/profile.js` | changePasswordProfileSchema |
| `validations/user.js` | getUsersSchema |

## Route declarations (14 files)

| File | Local declarations (mount paths compose in parent routers) |
| --- | --- |
| `routes/admin.js` | `GET /`, `GET /banks`, `GET /banks/create`, `POST /banks/create`, `USE /banks/@:bank_username`, `GET /banks/recreate-all-storage-accounts`, `USE /plans`, `USE /accounts`, `USE /quota`, `GET /app-requests`, `POST /app-requests/:app_id/accept`, `POST /app-requests/:app_id/reject` |
| `routes/index.js` | `GET /forgot-password`, `POST /forgot-password`, `GET /reset-password`, `POST /reset-password`, `GET /login`, `POST /login`, `GET /dashboard`, `GET /officers`, `GET /officers/create`, `POST /officers/create`, `GET /officers/:id/edit`, `POST /officers/:id/edit`, `GET /officers/:id/change-password`, `POST /officers/:id/change-password`, `DELETE /officers/:id`, `POST /logout`, `GET /profile/change-password`, `POST /profile/change-password`, `GET /download`, `USE /links`, `USE /`, `GET /apps`, `GET /apps/:app_id`, `USE /apps/:app_id/liveness` |
| `routes/resources/account.js` | `GET /`, `GET /create`, `POST /create`, `GET /:accountId`, `GET /:accountId/edit`, `POST /:accountId/edit`, `DELETE /:accountId` |
| `routes/resources/agent.js` | `GET /`, `POST /create`, `GET /create`, `GET /:agentUsername`, `GET /:agentId/edit`, `POST /:agentId/edit`, `DELETE /:agentId`, `POST /:agentId/deactivate`, `POST /:agentId/activate`, `GET /:agentId/change-password`, `POST /:agentId/change-password` |
| `routes/resources/app.js` | `GET /`, `GET /create`, `POST /create`, `USE /:app_id`, `GET /:app_id`, `GET /:app_id/edit`, `POST /:app_id/update`, `USE /:app_id/usage`, `GET /:app_id/usage`, `GET /:app_id/usage/json`, `GET /:app_id/usage/export-xlsx`, `USE /:app_id/users`, `USE /:app_id/agents`, `USE /:app_id/calls`, `USE /:app_id/liveness`, `USE /:app_id/ocr`, `USE /:app_id/officers`, `GET /:app_id/exports`, `POST /:app_id/exports` |
| `routes/resources/bank.js` | `GET /`, `DELETE /`, `PUT /edit`, `GET /edit`, `GET /accounts`, `USE /accounts/`, `GET /accounts/create`, `POST /accounts/create`, `GET /accounts/:accountId`, `GET /accounts/:accountId/edit`, `POST /accounts/:accountId/edit`, `DELETE /accounts/:accountId`, `USE /apps`, `GET /storage`, `POST /storage/update-secret-key`, `GET /documents/download` |
| `routes/resources/call.js` | `GET /` |
| `routes/resources/link.js` | `GET /`, `GET /create`, `POST /create`, `GET /:linkId/edit`, `POST /:linkId/edit`, `DELETE /:linkId` |
| `routes/resources/liveness.js` | `GET /`, `GET /export-excel` |
| `routes/resources/ocr.js` | `GET /`, `GET /export-excel` |
| `routes/resources/officer.js` | no literal path |
| `routes/resources/plan.js` | `GET /`, `GET /create`, `POST /create`, `DELETE /:id` |
| `routes/resources/quota.js` | `GET /` |
| `routes/resources/user.js` | `GET /`, `GET /export`, `GET /:user_username`, `DELETE /:user_id` |

## EJS pages (53)

- `views/pages/accounts/create.ejs`
- `views/pages/accounts/edit.ejs`
- `views/pages/accounts/index.ejs`
- `views/pages/accounts/show.ejs`
- `views/pages/admin/apps/waiting.ejs`
- `views/pages/admin/plans/create.ejs`
- `views/pages/admin/plans/index.ejs`
- `views/pages/admin/quota/index.ejs`
- `views/pages/auth/forgot-password.ejs`
- `views/pages/auth/login.ejs`
- `views/pages/auth/reset-password.ejs`
- `views/pages/banks/agents/change-password.ejs`
- `views/pages/banks/agents/create.ejs`
- `views/pages/banks/agents/edit.ejs`
- `views/pages/banks/agents/index.ejs`
- `views/pages/banks/agents/show.ejs`
- `views/pages/banks/apps/create.ejs`
- `views/pages/banks/apps/edit.ejs`
- `views/pages/banks/apps/export.ejs`
- `views/pages/banks/apps/index.ejs`
- `views/pages/banks/apps/show.ejs`
- `views/pages/banks/apps/usage-react.ejs`
- `views/pages/banks/apps/usage.ejs`
- `views/pages/banks/calls/index.ejs`
- `views/pages/banks/create.ejs`
- `views/pages/banks/edit.ejs`
- `views/pages/banks/index.ejs`
- `views/pages/banks/liveness/index.ejs`
- `views/pages/banks/ocr/index.ejs`
- `views/pages/banks/officers/change-password-officer.ejs`
- `views/pages/banks/officers/change-password.ejs`
- `views/pages/banks/officers/create.ejs`
- `views/pages/banks/officers/edit-officer.ejs`
- `views/pages/banks/officers/edit.ejs`
- `views/pages/banks/officers/index.ejs`
- `views/pages/banks/officers/show.ejs`
- `views/pages/banks/plan/index.ejs`
- `views/pages/banks/plan/select-plan.ejs`
- `views/pages/banks/plan/usage.ejs`
- `views/pages/banks/setting.ejs`
- `views/pages/banks/show.ejs`
- `views/pages/banks/storage.ejs`
- `views/pages/banks/users/index.ejs`
- `views/pages/banks/users/show.ejs`
- `views/pages/dashboard.ejs`
- `views/pages/errors/400.ejs`
- `views/pages/errors/403.ejs`
- `views/pages/errors/404.ejs`
- `views/pages/errors/500.ejs`
- `views/pages/links/create.ejs`
- `views/pages/links/edit.ejs`
- `views/pages/links/index.ejs`
- `views/pages/profile/change-password.ejs`

Route extraction lists literal declarations only. Middleware chains and dynamic route composition remain in the source and are summarized in `dashboard-inventory.md`.
