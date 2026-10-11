/**
 * Start de Sealcleaning-backend.  node --disable-warning=ExperimentalWarning server/server.js
 * Configuratie via omgevingsvariabelen (zie server/.env.example).
 */
import { createApp } from "./src/app.js";
import { processOutbox } from "./src/mail.js";
import { runRetention, createBackup } from "./src/services.js";

const { server, db, cfg } = createApp();
if (process.env.NODE_ENV === "production") {
  const problems = [];
  if (!cfg.cookieSecure) problems.push("COOKIE_SECURE moet true zijn");
  if (!cfg.requireTotp) problems.push("REQUIRE_TOTP moet true zijn");
  if ((cfg.ipHashSecret || "").length < 32) problems.push("IP_HASH_SECRET ontbreekt of is te kort");
  if (!/^https:\/\//.test(cfg.publicBaseUrl)) problems.push("PUBLIC_BASE_URL moet https zijn");
  if (problems.length) { console.error(`Productieconfiguratie onveilig: ${problems.join("; ")}.`); process.exit(1); }
  if (!cfg.backupKey) console.warn("Waarschuwing: BACKUP_KEY ontbreekt — automatische back-ups staan uit.");
}
server.listen(cfg.port, cfg.host, () => console.log(`Sealcleaning-backend op http://${cfg.host}:${cfg.port} (data: ${cfg.dataDir})`));

const safe = (name, fn) => async () => { try { await fn(); } catch (e) { console.error(new Date().toISOString(), name, e.message); } };
setInterval(safe("mail", () => processOutbox(db, cfg)), 30e3).unref();
setInterval(safe("retentie", () => runRetention(db, cfg)), 6 * 3600e3).unref();
if (cfg.backupKey && cfg.backupIntervalHours > 0) setInterval(safe("back-up", () => createBackup(db, cfg)), cfg.backupIntervalHours * 3600e3).unref();
safe("retentie", () => runRetention(db, cfg))();

const stop = () => { server.close(() => { db.close(); process.exit(0); }); setTimeout(() => process.exit(0), 5000).unref(); };
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
