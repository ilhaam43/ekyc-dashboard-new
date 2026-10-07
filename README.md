# ekyc-dashboard-new

Independent source repository exported from [ekyc-vidcall-new](https://github.com/ilhaam43/ekyc-vidcall-new), commit 9a2538b. Includes this service and the shared JavaScript package it requires. Source layout is preserved so imports remain compatible.

## Develop

Use Node.js 24. Run commands from this repository root:

```sh
npm ci
npm run lint
npm test
npm run build
npm start
```

Inject environment variables before starting. Copy .env.example as a template and configure actual service endpoints and secrets; never commit .env. The backend uses PostgreSQL, Valkey and platform services as configured. 

## Container

```sh
docker build -t ekyc-dashboard-new:local .
```

The container listens on port 5301. Connect it to the platform Docker network and inject its service configuration. The agent frontend Nginx proxy resolves master and calls on that network. Kong Console requires Kong Admin API and Valkey; the dashboard requires the platform and its configured adapters.

This repository does not start dependent infrastructure. Use the monorepository Compose stack for the complete local Jitsi/Jibri, storage and gateway environment. Shared database migrations are included for compatibility; run them once per database, not from every service concurrently.

No environment secrets, database contents, recordings, backups or legacy repository history are included. See the service subdirectory README where available for feature details.
