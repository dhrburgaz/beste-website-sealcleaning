/**
 * Configuratie uitsluitend via omgevingsvariabelen (zie server/.env.example).
 * Geen geheimen in de repository. Ontbrekende koppelingen (SMTP, Mollie,
 * back-upsleutel) maken die functie "niet operationeel", nooit gesimuleerd.
 */
import { resolve } from "node:path";

const env = process.env;
const bool = (v, d) => (v == null || v === "" ? d : /^(1|true|yes|ja)$/i.test(v));
const int = (v, d) => (v == null || v === "" ? d : parseInt(v, 10));

export function loadConfig(overrides = {}) {
  const dataDir = resolve(overrides.dataDir || env.SEAL_DATA_DIR || "./server-data");
  const cfg = {
    port: int(env.PORT, 8787),
    host: env.HOST || "127.0.0.1",
    dataDir,
    dbPath: resolve(dataDir, "seal.sqlite"),
    filesDir: resolve(dataDir, "files"),
    backupDir: resolve(env.SEAL_BACKUP_DIR || resolve(dataDir, "backups")),
    publicBaseUrl: (env.PUBLIC_BASE_URL || "http://localhost:8787").replace(/\/$/, ""),
    siteOrigins: (env.SITE_ORIGINS || "https://sealcleaning.nl,https://www.sealcleaning.nl").split(",").map((s) => s.trim()).filter(Boolean),
    cookieSecure: bool(env.COOKIE_SECURE, true),
    requireTotp: bool(env.REQUIRE_TOTP, true),
    trustProxy: bool(env.TRUST_PROXY, false),
    ipHashSecret: env.IP_HASH_SECRET || "",
    termsVersion: env.TERMS_VERSION || "voorwaarden-concept-2026-10-10",
    smtp: env.SMTP_HOST ? {
      host: env.SMTP_HOST, port: int(env.SMTP_PORT, 465), secure: env.SMTP_SECURE || "tls", // tls | starttls | none (alleen tests)
      user: env.SMTP_USER || "", pass: env.SMTP_PASS || "", from: env.MAIL_FROM || "", replyTo: env.MAIL_REPLY_TO || ""
    } : null,
    staffNotify: env.STAFF_NOTIFY_EMAIL || "",
    mollieKey: env.MOLLIE_API_KEY || "",
    backupKey: env.BACKUP_KEY || "",
    backupKeep: int(env.BACKUP_KEEP, 14),
    backupIntervalHours: int(env.BACKUP_INTERVAL_HOURS, 24),
    siteRoot: resolve(env.SITE_ROOT || "."),
    ...overrides
  };
  return cfg;
}

/** Wat is operationeel en wat niet — getoond in beheer, nooit verborgen. */
export function integrationStatus(cfg) {
  return {
    email: cfg.smtp ? "operationeel (SMTP)" : "niet operationeel — geen mailserver gekoppeld; berichten blijven in de wachtrij",
    payments: cfg.mollieKey ? (cfg.mollieKey.startsWith("test_") ? "testmodus (Mollie test-sleutel)" : "operationeel (Mollie)") : "niet operationeel — geen betaalprovider gekoppeld; alleen handmatige registratie van bankbetalingen",
    backups: cfg.backupKey ? "operationeel (versleuteld, lokaal)" : "niet operationeel — BACKUP_KEY ontbreekt",
    offsiteBackups: "niet operationeel — geen externe opslag gekoppeld",
    calendar: "operationeel (ICS-feed, abonneerbaar in Google/Apple/Outlook-agenda)",
    portal: "operationeel (eenmalige inloglinks; per e-mail zodra SMTP gekoppeld is)"
  };
}
