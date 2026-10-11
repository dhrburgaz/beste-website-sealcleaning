/**
 * Authenticatie. Medewerkers: wachtwoord (scrypt) + TOTP (RFC 6238).
 * Klanten: eenmalige inloglink (15 min geldig, één keer bruikbaar).
 * Sessietokens worden alleen als SHA-256-hash opgeslagen; de cookie is
 * HttpOnly, SameSite=Strict en (in productie) Secure met __Host-prefix.
 */
import { scryptSync, randomBytes, timingSafeEqual, createHash, createHmac } from "node:crypto";
import { now, newId } from "./db.js";

const SCRYPT = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export const STAFF_SESSION = { idleMs: 2 * 3600e3, absMs: 12 * 3600e3 };
export const CUSTOMER_SESSION = { idleMs: 24 * 3600e3, absMs: 14 * 24 * 3600e3 };

export function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${salt.toString("base64")}$${key.toString("base64")}`;
}
export function verifyPassword(pw, stored) {
  const [alg, n, salt, key] = String(stored).split("$");
  if (alg !== "scrypt") return false;
  const k = scryptSync(pw, Buffer.from(salt, "base64"), 64, { ...SCRYPT, N: Number(n) });
  const ref = Buffer.from(key, "base64");
  return ref.length === k.length && timingSafeEqual(ref, k);
}
export function passwordProblem(pw) {
  if (typeof pw !== "string" || pw.length < 12) return "Kies een wachtwoord van minimaal 12 tekens.";
  if (pw.length > 200) return "Wachtwoord is te lang.";
  if (/^(.)\1+$/.test(pw)) return "Wachtwoord is te eenvoudig.";
  return null;
}

export const token = () => randomBytes(32).toString("base64url");
export const sha256 = (s) => createHash("sha256").update(s).digest("base64url");

/* ---------- TOTP ---------- */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function newTotpSecret() {
  const b = randomBytes(20);
  let bits = "", out = "";
  for (const x of b) bits += x.toString(2).padStart(8, "0");
  for (let i = 0; i + 5 <= bits.length; i += 5) out += B32[parseInt(bits.slice(i, i + 5), 2)];
  return out;
}
function b32decode(s) {
  let bits = "";
  for (const c of s.replace(/=+$/, "").toUpperCase()) { const v = B32.indexOf(c); if (v < 0) continue; bits += v.toString(2).padStart(5, "0"); }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}
export function totpAt(secret, timeMs, step = 30) {
  const counter = Math.floor(timeMs / 1000 / step);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", b32decode(secret)).update(buf).digest();
  const off = hmac[hmac.length - 1] & 0xf;
  const code = ((hmac.readUInt32BE(off) & 0x7fffffff) % 1e6).toString().padStart(6, "0");
  return code;
}
export function verifyTotp(secret, code, timeMs = Date.now()) {
  if (!/^\d{6}$/.test(String(code || ""))) return false;
  return [-1, 0, 1].some((w) => totpAt(secret, timeMs + w * 30000) === String(code));
}
export function totpUri(secret, email) {
  return `otpauth://totp/${encodeURIComponent("Sealcleaning beheer:" + email)}?secret=${secret}&issuer=Sealcleaning&algorithm=SHA1&digits=6&period=30`;
}

/* ---------- sessies ---------- */
export function createSession(db, { kind, userId = null, customerId = null, mfaOk = false, ipHash, ua }) {
  const t = token();
  const cfg = kind === "staff" ? STAFF_SESSION : CUSTOMER_SESSION;
  const ts = now();
  db.run("INSERT INTO sessions (id, kind, user_id, customer_id, mfa_ok, created_at, last_seen_at, expires_at, ip_hash, ua) VALUES (?,?,?,?,?,?,?,?,?,?)",
    sha256(t), kind, userId, customerId, mfaOk ? 1 : 0, ts, ts, new Date(Date.now() + cfg.absMs).toISOString(), ipHash || null, String(ua || "").slice(0, 200));
  return { token: t, maxAgeSec: Math.floor(cfg.absMs / 1000) };
}

export function loadSession(db, t) {
  if (!t || t.length > 100) return null;
  const s = db.get("SELECT * FROM sessions WHERE id = ?", sha256(t));
  if (!s) return null;
  const cfg = s.kind === "staff" ? STAFF_SESSION : CUSTOMER_SESSION;
  const t0 = Date.now();
  if (Date.parse(s.expires_at) < t0 || t0 - Date.parse(s.last_seen_at) > cfg.idleMs) {
    db.run("DELETE FROM sessions WHERE id = ?", s.id);
    return null;
  }
  db.run("UPDATE sessions SET last_seen_at = ? WHERE id = ?", now(), s.id);
  if (s.kind === "staff") {
    const u = db.get("SELECT id, email, name, role, totp_enabled, disabled FROM users WHERE id = ?", s.user_id);
    if (!u || u.disabled) return null;
    s.user = u;
  }
  return s;
}

export function destroySession(db, t) { if (t) db.run("DELETE FROM sessions WHERE id = ?", sha256(t)); }
export function destroyUserSessions(db, userId, exceptId) { db.run("DELETE FROM sessions WHERE user_id = ? AND id != ?", userId, exceptId || ""); }

/* ---------- portaal-inloglinks ---------- */
export function createPortalToken(db, customerId, ttlMs = 15 * 60e3) {
  const t = token();
  db.run("INSERT INTO portal_tokens (token_hash, customer_id, created_at, expires_at) VALUES (?,?,?,?)", sha256(t), customerId, now(), new Date(Date.now() + ttlMs).toISOString());
  return t;
}
export function consumePortalToken(db, t) {
  if (!t || t.length > 100) return null;
  return db.tx(() => {
    const r = db.get("SELECT * FROM portal_tokens WHERE token_hash = ?", sha256(t));
    if (!r || r.used_at || Date.parse(r.expires_at) < Date.now()) return null;
    db.run("UPDATE portal_tokens SET used_at = ? WHERE token_hash = ?", now(), r.token_hash);
    return r.customer_id;
  });
}

export function createUser(db, { email, name, password, role = "staff" }) {
  const problem = passwordProblem(password);
  if (problem) throw new Error(problem);
  const id = newId("usr");
  db.run("INSERT INTO users (id, email, name, password_hash, role, created_at, password_changed_at) VALUES (?,?,?,?,?,?,?)", id, email.trim().toLowerCase(), name.trim(), hashPassword(password), role, now(), now());
  return id;
}
