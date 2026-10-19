import { createDb } from '@ekyc/shared/db';
import { Storage } from '@ekyc/shared/storage';
import { dashboardConfig } from './config.js';
import { processOneExport } from './exports.js';
import { scheduleMonthlyExports } from './export-schedule.js';
import { processBankStorageJob, migrateOneBankRecording } from '@ekyc/shared/bank-storage';

const cfg = dashboardConfig(); const db = createDb(cfg.databaseUrl); const storage = new Storage(cfg); let stopping = false; let nextScheduleCheck = 0;
process.on('SIGTERM', () => { stopping = true; }); process.on('SIGINT', () => { stopping = true; });
while (!stopping) { try { if (Date.now() >= nextScheduleCheck) { await scheduleMonthlyExports(db); nextScheduleCheck = Date.now() + 3_600_000; } const provisioned = await processBankStorageJob(db, storage, cfg); const migrated = await migrateOneBankRecording(db, storage, cfg); if (!await processOneExport(db, storage, cfg) && !provisioned && !migrated) await new Promise(resolve => setTimeout(resolve, 5000)); } catch { console.error('{"event":"dashboard_worker_error"}'); await new Promise(resolve => setTimeout(resolve, 5000)); } }
await db.destroy();
