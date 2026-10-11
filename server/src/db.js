/**
 * SQLite-opslag (node:sqlite, ingebouwd in Node 22 — geen externe afhankelijkheid).
 * WAL-modus, foreign keys aan, migraties op volgorde. Bedragen in eurocenten.
 */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomBytes } from "node:crypto";

const MIGRATIONS = [
  `CREATE TABLE users (
     id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, name TEXT NOT NULL,
     password_hash TEXT NOT NULL, totp_secret TEXT, totp_enabled INTEGER NOT NULL DEFAULT 0,
     role TEXT NOT NULL DEFAULT 'staff', disabled INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL, password_changed_at TEXT);
   CREATE TABLE sessions (
     id TEXT PRIMARY KEY, kind TEXT NOT NULL, user_id TEXT, customer_id TEXT, mfa_ok INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL, last_seen_at TEXT NOT NULL, expires_at TEXT NOT NULL, ip_hash TEXT, ua TEXT);
   CREATE TABLE customers (
     id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT COLLATE NOCASE, phone TEXT, address TEXT,
     type TEXT NOT NULL DEFAULT 'particulier', notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE INDEX customers_email ON customers(email);
   CREATE TABLE portal_tokens (
     token_hash TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
     created_at TEXT NOT NULL, expires_at TEXT NOT NULL, used_at TEXT);
   CREATE TABLE leads (
     id TEXT PRIMARY KEY, ref TEXT NOT NULL UNIQUE, kind TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'nieuw',
     name TEXT, email TEXT, phone TEXT, city TEXT, postal TEXT, service TEXT, message TEXT,
     design_json TEXT, payload_json TEXT, customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
     project_id TEXT, ip_hash TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE TABLE projects (
     id TEXT PRIMARY KEY, ref TEXT NOT NULL UNIQUE, customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
     title TEXT NOT NULL, status TEXT NOT NULL, design_json TEXT, notes TEXT,
     created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE TABLE project_events (
     id INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     at TEXT NOT NULL, kind TEXT NOT NULL, data_json TEXT, actor TEXT, customer_visible INTEGER NOT NULL DEFAULT 0);
   CREATE TABLE attachments (
     id TEXT PRIMARY KEY, owner_type TEXT NOT NULL, owner_id TEXT NOT NULL, filename TEXT NOT NULL, mime TEXT NOT NULL,
     size INTEGER NOT NULL, stored_name TEXT NOT NULL, sha256 TEXT NOT NULL, customer_visible INTEGER NOT NULL DEFAULT 0,
     created_at TEXT NOT NULL);
   CREATE INDEX attachments_owner ON attachments(owner_type, owner_id);
   CREATE TABLE quotes (
     id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     number TEXT NOT NULL UNIQUE, version INTEGER NOT NULL DEFAULT 1, parent_id TEXT,
     status TEXT NOT NULL DEFAULT 'concept', price_type TEXT NOT NULL DEFAULT 'richtprijs',
     excluded TEXT, customer_work TEXT, po_ref TEXT, valid_until TEXT,
     manual_lines_json TEXT NOT NULL DEFAULT '[]', snapshot_json TEXT NOT NULL, internal_json TEXT NOT NULL,
     snapshot_hash TEXT NOT NULL, created_at TEXT NOT NULL, created_by TEXT, sent_at TEXT, accepted_at TEXT);
   CREATE TABLE acceptances (
     id TEXT PRIMARY KEY, quote_id TEXT NOT NULL REFERENCES quotes(id), accepted_at TEXT NOT NULL,
     name TEXT NOT NULL, email TEXT, customer_id TEXT, ip_hash TEXT, ua TEXT,
     snapshot_hash TEXT NOT NULL, terms_version TEXT NOT NULL, consents_json TEXT NOT NULL);
   CREATE TABLE invoices (
     id TEXT PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'invoice', number TEXT UNIQUE, year INTEGER, seq INTEGER,
     quote_id TEXT, project_id TEXT, customer_id TEXT, ref_invoice_id TEXT,
     issue_date TEXT, delivery_date TEXT, due_date TEXT, status TEXT NOT NULL DEFAULT 'concept',
     lines_json TEXT NOT NULL, total_excl INTEGER NOT NULL, vat_rate INTEGER NOT NULL, vat INTEGER NOT NULL,
     total_incl INTEGER NOT NULL, reason TEXT, po_ref TEXT, created_at TEXT NOT NULL, issued_at TEXT);
   CREATE UNIQUE INDEX invoices_seq ON invoices(year, seq) WHERE seq IS NOT NULL;
   CREATE TABLE payments (
     id TEXT PRIMARY KEY, invoice_id TEXT NOT NULL REFERENCES invoices(id), amount INTEGER NOT NULL,
     method TEXT NOT NULL, provider_id TEXT UNIQUE, status TEXT NOT NULL, received_at TEXT,
     checkout_url TEXT, created_at TEXT NOT NULL, created_by TEXT);
   CREATE TABLE appointments (
     id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, kind TEXT NOT NULL,
     starts_at TEXT NOT NULL, ends_at TEXT NOT NULL, status TEXT NOT NULL, location TEXT, note TEXT,
     proposed_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE TABLE messages (
     id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
     author_type TEXT NOT NULL, author_id TEXT, body TEXT NOT NULL, created_at TEXT NOT NULL, read_at TEXT);
   CREATE TABLE consents (
     id TEXT PRIMARY KEY, customer_id TEXT, project_id TEXT, kind TEXT NOT NULL, granted INTEGER NOT NULL,
     at TEXT NOT NULL, source TEXT NOT NULL, text_version TEXT);
   CREATE TABLE hours (
     id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE, worker TEXT NOT NULL,
     date TEXT NOT NULL, hours REAL NOT NULL, note TEXT, created_at TEXT NOT NULL, created_by TEXT);
   CREATE TABLE suppliers (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT, created_at TEXT NOT NULL);
   CREATE TABLE purchase_prices (
     key TEXT PRIMARY KEY, amount_excl INTEGER NOT NULL, supplier_id TEXT, sku TEXT, observed_at TEXT NOT NULL,
     updated_at TEXT NOT NULL, updated_by TEXT);
   CREATE TABLE settings (key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE TABLE audit (
     id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL,
     ref TEXT, ip_hash TEXT);
   CREATE TABLE outbox (
     id TEXT PRIMARY KEY, kind TEXT NOT NULL, to_addr TEXT NOT NULL, subject TEXT NOT NULL, body_text TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'queued', attempts INTEGER NOT NULL DEFAULT 0, last_error TEXT,
     created_at TEXT NOT NULL, sent_at TEXT);
   CREATE TABLE counters (name TEXT PRIMARY KEY, value INTEGER NOT NULL);`,
  // 2: online materiaalverkoop (V7-09/V7-10) — alles achter feature flags, standaard uit.
  `CREATE TABLE shop_products (
     id TEXT PRIMARY KEY, catalog_id TEXT, title TEXT NOT NULL, unit TEXT NOT NULL, category TEXT,
     price_excl INTEGER NOT NULL, vat_rate INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 0, max_per_order INTEGER,
     created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE TABLE shop_price_history (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT NOT NULL REFERENCES shop_products(id) ON DELETE CASCADE, price_excl INTEGER NOT NULL, at TEXT NOT NULL);
   CREATE TABLE promotions (
     id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, type TEXT NOT NULL, value INTEGER NOT NULL, scope TEXT NOT NULL, scope_ids_json TEXT NOT NULL DEFAULT '[]',
     starts_at TEXT, ends_at TEXT, active INTEGER NOT NULL DEFAULT 0, stackable INTEGER NOT NULL DEFAULT 0, min_subtotal INTEGER, max_discount INTEGER,
     max_uses_total INTEGER, max_uses_per_customer INTEGER, note TEXT, created_at TEXT NOT NULL, created_by TEXT);
   CREATE TABLE promotion_uses (
     id TEXT PRIMARY KEY, promotion_id TEXT NOT NULL REFERENCES promotions(id), order_id TEXT NOT NULL, customer_hash TEXT NOT NULL,
     amount INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
   CREATE INDEX promotion_uses_promo ON promotion_uses(promotion_id, status);
   CREATE TABLE orders (
     id TEXT PRIMARY KEY, ref TEXT NOT NULL UNIQUE, idempotency_key TEXT NOT NULL UNIQUE, status TEXT NOT NULL,
     name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, address_json TEXT, delivery_method TEXT NOT NULL,
     snapshot_json TEXT NOT NULL, total_incl INTEGER NOT NULL, terms_version TEXT NOT NULL, consents_json TEXT NOT NULL,
     status_token_hash TEXT NOT NULL, ip_hash TEXT, provider_id TEXT UNIQUE, checkout_url TEXT,
     created_at TEXT NOT NULL, updated_at TEXT NOT NULL, paid_at TEXT);`
];

export function openDb(path) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec("CREATE TABLE IF NOT EXISTS schema_version (v INTEGER NOT NULL)");
  const cur = db.prepare("SELECT v FROM schema_version").get()?.v ?? 0;
  if (cur === 0 && !db.prepare("SELECT 1 FROM schema_version").get()) db.prepare("INSERT INTO schema_version (v) VALUES (0)").run();
  for (let i = cur; i < MIGRATIONS.length; i++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[i]);
      db.prepare("UPDATE schema_version SET v = ?").run(i + 1);
      db.exec("COMMIT");
    } catch (e) { db.exec("ROLLBACK"); throw e; }
  }
  return wrap(db);
}

function wrap(db) {
  const cache = new Map();
  const stmt = (sql) => { let s = cache.get(sql); if (!s) { s = db.prepare(sql); cache.set(sql, s); } return s; };
  return {
    raw: db,
    get: (sql, ...p) => stmt(sql).get(...p),
    all: (sql, ...p) => stmt(sql).all(...p),
    run: (sql, ...p) => stmt(sql).run(...p),
    exec: (sql) => db.exec(sql),
    /** Transactie; BEGIN IMMEDIATE voorkomt dubbele nummers bij gelijktijdige aanvragen. */
    tx(fn) {
      db.exec("BEGIN IMMEDIATE");
      try { const r = fn(); db.exec("COMMIT"); return r; } catch (e) { db.exec("ROLLBACK"); throw e; }
    },
    close: () => db.close()
  };
}

export const now = () => new Date().toISOString();
export const newId = (prefix) => `${prefix}_${randomBytes(12).toString("base64url")}`;

/** Leesbare, niet-raadbare referentie (bijv. A-7KQ3-M9XP) — geen toegangsbewijs. */
export function newRef(prefix) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const b = randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[b[i] % alphabet.length];
  return `${prefix}-${s.slice(0, 4)}-${s.slice(4)}`;
}

export function getSetting(db, key, fallback = null) {
  const r = db.get("SELECT value_json FROM settings WHERE key = ?", key);
  return r ? JSON.parse(r.value_json) : fallback;
}
export function setSetting(db, key, value) {
  db.run("INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at", key, JSON.stringify(value), now());
}

export function audit(db, actor, action, ref, ipHash) {
  db.run("INSERT INTO audit (at, actor, action, ref, ip_hash) VALUES (?, ?, ?, ?, ?)", now(), actor || "systeem", action, ref ?? null, ipHash ?? null);
}

export function nextCounter(db, name) {
  db.run("INSERT INTO counters (name, value) VALUES (?, 1) ON CONFLICT(name) DO UPDATE SET value = value + 1", name);
  return db.get("SELECT value FROM counters WHERE name = ?", name).value;
}
