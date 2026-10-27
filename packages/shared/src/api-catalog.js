// Generated from Express route registries by scripts/generate-api-catalog.mjs.
export const apiCatalog = [
  {
    "name": "user.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/users",
    "planAssignable": true
  },
  {
    "name": "user-detail.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/users/:id",
    "planAssignable": true
  },
  {
    "name": "user.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/users",
    "planAssignable": true
  },
  {
    "name": "user-detail.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/users/:id",
    "planAssignable": true
  },
  {
    "name": "user-detail.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/users/:id",
    "planAssignable": true
  },
  {
    "name": "user.softdelete.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/users/softdelete/:id",
    "planAssignable": true
  },
  {
    "name": "user-detail.delete",
    "backend": "master",
    "method": "DELETE",
    "path": "/api/v1/users/:id",
    "planAssignable": true
  },
  {
    "name": "users.by-id.deletion.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/users/:id/deletion",
    "planAssignable": true
  },
  {
    "name": "users.by-id.verify.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/users/:id/verify",
    "planAssignable": true
  },
  {
    "name": "users.by-id.reject.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/users/:id/reject",
    "planAssignable": true
  },
  {
    "name": "users.by-id.face-verification.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/users/:id/face-verification",
    "planAssignable": true
  },
  {
    "name": "actors.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/actors",
    "planAssignable": true
  },
  {
    "name": "actors.by-id.apikey.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/actors/:id/apikey",
    "planAssignable": true
  },
  {
    "name": "options.by-category.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/options/:category",
    "planAssignable": true
  },
  {
    "name": "postal.search.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/postal/search",
    "planAssignable": true
  },
  {
    "name": "postal.by-id.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/postal/:id",
    "planAssignable": true
  },
  {
    "name": "skip-otp.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/skip-otp",
    "planAssignable": true
  },
  {
    "name": "quota.videocalls.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/quota/videocalls",
    "planAssignable": true
  },
  {
    "name": "videocalls.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/videocalls",
    "planAssignable": true
  },
  {
    "name": "audit-trail.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/audit-trail",
    "planAssignable": true
  },
  {
    "name": "audit-trail.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/audit-trail",
    "planAssignable": true
  },
  {
    "name": "document.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/document",
    "planAssignable": true
  },
  {
    "name": "document-list.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/document/:userId",
    "planAssignable": true
  },
  {
    "name": "document-download.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/document/:userId/:id",
    "planAssignable": true
  },
  {
    "name": "otp.send.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/otp/send",
    "planAssignable": true
  },
  {
    "name": "otp.verify.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/otp/verify",
    "planAssignable": true
  },
  {
    "name": "otp.resend.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/otp/resend",
    "planAssignable": true
  },
  {
    "name": "secure-transactions.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/secure-transactions",
    "planAssignable": true
  },
  {
    "name": "verify-selfie.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/verify_selfie",
    "planAssignable": true
  },
  {
    "name": "verify_identity.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/verify_identity",
    "planAssignable": true
  },
  {
    "name": "verify_identitydukcapil.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/verify_identity_dukcapil",
    "planAssignable": true
  },
  {
    "name": "sivInitiateFlow.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/sivInitiateFlow",
    "planAssignable": true
  },
  {
    "name": "initiateFlowSDK.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/initiateFlowSDK",
    "planAssignable": true
  },
  {
    "name": "goto-partner-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/goto-partner-token",
    "planAssignable": true
  },
  {
    "name": "dev-auth-user-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_auth_staging/user-token",
    "planAssignable": true
  },
  {
    "name": "dev-user-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/user-token",
    "planAssignable": true
  },
  {
    "name": "dev-ocr-launch-url.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/onekyc_la_staging/ocr-launch-url",
    "planAssignable": true
  },
  {
    "name": "dev-ocr-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/ocr-result",
    "planAssignable": true
  },
  {
    "name": "dev-liveness-launch-url.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/onekyc_la_staging/liveness-launch-url",
    "planAssignable": true
  },
  {
    "name": "dev-liveness-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/liveness-result",
    "planAssignable": true
  },
  {
    "name": "dev-esign-dukcapil.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/esign-url",
    "planAssignable": true
  },
  {
    "name": "dev-esign-dukcapil-confirm.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/onekyc_la_staging/esign-confirm-submission",
    "planAssignable": true
  },
  {
    "name": "dev-esign-dukcapil-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/esign-result",
    "planAssignable": true
  },
  {
    "name": "dev-esign-dukcapil-result-detail.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_staging/esign-result-detail/:submissionId",
    "planAssignable": true
  },
  {
    "name": "auth-user-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_auth_prod/user-token",
    "planAssignable": true
  },
  {
    "name": "user-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/user-token",
    "planAssignable": true
  },
  {
    "name": "ocr-launch-url.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/onekyc_la_prod/ocr-launch-url",
    "planAssignable": true
  },
  {
    "name": "ocr-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/ocr-result",
    "planAssignable": true
  },
  {
    "name": "liveness-launch-url.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/onekyc_la_prod/liveness-launch-url",
    "planAssignable": true
  },
  {
    "name": "liveness-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/liveness-result",
    "planAssignable": true
  },
  {
    "name": "esign-dukcapil.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/esign-url",
    "planAssignable": true
  },
  {
    "name": "esign-dukcapil-confirm.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/onekyc_la_prod/esign-confirm-submission",
    "planAssignable": true
  },
  {
    "name": "esign-dukcapil-result.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/esign-result",
    "planAssignable": true
  },
  {
    "name": "esign-dukcapil-result-detail.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/onekyc_la_prod/esign-result-detail/:submissionId",
    "planAssignable": true
  },
  {
    "name": "goto-ktp.partner-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/goto-ktp/partner-token",
    "planAssignable": true
  },
  {
    "name": "goto-ktp.presigned-url.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/goto-ktp/presigned-url",
    "planAssignable": true
  },
  {
    "name": "goto-ktp.confirm-upload.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/goto-ktp/confirm-upload",
    "planAssignable": true
  },
  {
    "name": "goto-ktp.status-polling.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/goto-ktp/status-polling",
    "planAssignable": true
  },
  {
    "name": "goto-ktp.result-details.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/goto-ktp/result-details",
    "planAssignable": true
  },
  {
    "name": "liveness-gtf.liveness-gtf-partner-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/liveness-gtf/liveness-gtf-partner-token",
    "planAssignable": true
  },
  {
    "name": "liveness-gtf.liveness-gtf-presigned-url.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/liveness-gtf/liveness-gtf-presigned-url",
    "planAssignable": true
  },
  {
    "name": "liveness-gtf.liveness-gtf-confirm-upload.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/liveness-gtf/liveness-gtf-confirm-upload",
    "planAssignable": true
  },
  {
    "name": "liveness-gtf.liveness-gtf-status-polling.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/liveness-gtf/liveness-gtf-status-polling",
    "planAssignable": true
  },
  {
    "name": "liveness-gtf.liveness-gtf-result-details.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/liveness-gtf/liveness-gtf-result-details",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-partner-token.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/facematch-gtf/facematch-gtf-partner-token",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-presigned-url.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/facematch-gtf/facematch-gtf-presigned-url",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-confirm-upload.put",
    "backend": "master",
    "method": "PUT",
    "path": "/api/v1/facematch-gtf/facematch-gtf-confirm-upload",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-status-polling.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/facematch-gtf/facematch-gtf-status-polling",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-result-details.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/facematch-gtf/facematch-gtf-result-details",
    "planAssignable": true
  },
  {
    "name": "facematch-gtf.facematch-gtf-initiate-flow.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/facematch-gtf/facematch-gtf-initiate-flow",
    "planAssignable": true
  },
  {
    "name": "callback-data-ekyc.post",
    "backend": "master",
    "method": "POST",
    "path": "/api/v1/callback",
    "planAssignable": true
  },
  {
    "name": "callback-data-ekyc.get",
    "backend": "master",
    "method": "GET",
    "path": "/api/v1/callback",
    "planAssignable": true
  },
  {
    "name": "videocall.agents.login.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/agents/login",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.sessions.agent.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/sessions/agent",
    "planAssignable": false
  },
  {
    "name": "videocall.agents.refresh-token.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/agents/refresh-token",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.sessions.refresh.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/sessions/refresh",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.integrations.agent-links.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/integrations/agent-links",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.sessions.agent.link.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/sessions/agent/link",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.integrations.queue-links.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/integrations/queue-links",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.integrations.customer-links.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/integrations/customer-links",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.customer-grants.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/customer-grants",
    "planAssignable": true
  },
  {
    "name": "videocall-v2.customer-links.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/customer-links",
    "planAssignable": true
  },
  {
    "name": "videocall-v2.sessions.customer.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/sessions/customer",
    "planAssignable": false
  },
  {
    "name": "videocall.agents.logout.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/agents/logout",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.sessions.logout.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/sessions/logout",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.agents.password.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/agents/password",
    "planAssignable": false
  },
  {
    "name": "videocall.agents.profile.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/agents/profile",
    "planAssignable": false
  },
  {
    "name": "videocall.agents.analytics.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/agents/analytics",
    "planAssignable": false
  },
  {
    "name": "videocall.agents.register.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/agents/register",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.register.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/register",
    "planAssignable": true
  },
  {
    "name": "videocall-v2.calls.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls",
    "planAssignable": true
  },
  {
    "name": "videocall.calls.queues.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/calls/queues",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.queue-count.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/calls/queue-count",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.start.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/start",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.start.by-userid.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/start/:userId",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.claim.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/claim",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.current.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/calls/current",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.current.get",
    "backend": "calls",
    "method": "GET",
    "path": "/api/v2/calls/current",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.stop.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/stop",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.missed.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/missed",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.invite-user.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/invite-user",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.unregister.by-userid.post",
    "backend": "calls",
    "method": "POST",
    "path": "/v1/calls/unregister/:userId",
    "planAssignable": true
  },
  {
    "name": "videocall.calls.room.by-room.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/calls/room/:room",
    "planAssignable": false
  },
  {
    "name": "videocall.calls.by-userid.get",
    "backend": "calls",
    "method": "GET",
    "path": "/v1/calls/:userId",
    "planAssignable": true
  },
  {
    "name": "videocall-v2.calls.by-id.get",
    "backend": "calls",
    "method": "GET",
    "path": "/api/v2/calls/:id",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.consent.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/consent",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.admission.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/admission",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.heartbeat.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/heartbeat",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.decision.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/decision",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.cancel.post",
    "backend": "calls",
    "method": "POST",
    "path": "/api/v2/calls/:id/cancel",
    "planAssignable": false
  },
  {
    "name": "videocall-v2.calls.by-id.recording.get",
    "backend": "calls",
    "method": "GET",
    "path": "/api/v2/calls/:id/recording",
    "planAssignable": false
  },
  {
    "name": "videocall-customer-link.post",
    "backend": "partner",
    "method": "POST",
    "path": "/partner/v1/video-call/users",
    "planAssignable": true
  }
];
