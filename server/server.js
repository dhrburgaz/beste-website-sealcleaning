/**
 * Start de Sealcleaning-backend.  node --disable-warning=ExperimentalWarning server/server.js
 * Configuratie via omgevingsvariabelen (zie server/.env.example).
 */
import { createApp } from "./src/app.js";
import { processOutbox } from "./src/mail.js";
import { runRetention, createBackup } from "./src/services.js";

const { server, db, cfg } = createApp();
server.listen(cfg.port, cfg.host, () => console.log(`Sealcleaning-backend op http://${cfg.host}:${cfg.port} (data: ${cfg.dataDir})`));

const safe = (name, fn) => async () => { try { await fn(); } catch (e) { console.error(new Date().toISOString(), name, e.message); } };
setInterval(safe("mail", () => processOutbox(db, cfg)), 30e3).unref();
setInterval(safe("retentie", () => runRetention(db, cfg)), 6 * 3600e3).unref();
if (cfg.backupKey && cfg.backupIntervalHours > 0) setInterval(safe("back-up", () => createBackup(db, cfg)), cfg.backupIntervalHours * 3600e3).unref();
safe("retentie", () => runRetention(db, cfg))();

const stop = () => { server.close(() => { db.close(); process.exit(0); }); setTimeout(() => process.exit(0), 5000).unref(); };
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
