/** Inloggen medewerkers (wachtwoord + TOTP) en klanten (eenmalige link). */
import { HttpError, readJson, rateLimit, setSessionCookie, clearSessionCookie, parseCookies, cookieName } from "../http.js";
import { audit, now } from "../db.js";
import { verifyPassword, verifyTotp, newTotpSecret, totpUri, createSession, destroySession, destroyUserSessions, hashPassword, passwordProblem, createPortalToken, consumePortalToken } from "../auth.js";
import { queueMail } from "../mail.js";

export function registerAuth(r) {
  r.post("/api/auth/login", async (ctx) => {
    const { email, password, totp } = await readJson(ctx.req, 4096);
    rateLimit(`login-ip:${ctx.ipHash}`, 20, 15 * 60e3);
    rateLimit(`login-user:${String(email).toLowerCase()}`, 8, 15 * 60e3);
    const u = ctx.db.get("SELECT * FROM users WHERE email = ? AND disabled = 0", String(email || "").trim().toLowerCase());
    const ok = u && verifyPassword(String(password || ""), u.password_hash);
    if (!ok) { audit(ctx.db, String(email || "?").slice(0, 80), "inlogpoging mislukt", null, ctx.ipHash); throw new HttpError(401, "E-mailadres of wachtwoord onjuist."); }
    let mfaOk = false;
    if (u.totp_enabled) {
      if (!totp) throw new HttpError(401, "Voer de code uit uw authenticator-app in.", { needTotp: true });
      if (!verifyTotp(u.totp_secret, totp)) { audit(ctx.db, u.email, "2FA-code onjuist", null, ctx.ipHash); throw new HttpError(401, "Code onjuist.", { needTotp: true }); }
      mfaOk = true;
    } else if (!ctx.cfg.requireTotp) mfaOk = true;
    const s = createSession(ctx.db, { kind: "staff", userId: u.id, mfaOk, ipHash: ctx.ipHash, ua: ctx.req.headers["user-agent"] });
    setSessionCookie(ctx.res, ctx.cfg, s.token, s.maxAgeSec);
    audit(ctx.db, u.email, "ingelogd", null, ctx.ipHash);
    ctx.json(200, { ok: true, enrollTotp: !u.totp_enabled && ctx.cfg.requireTotp });
  });

  r.post("/api/auth/logout", async (ctx) => {
    destroySession(ctx.db, parseCookies(ctx.req)[cookieName(ctx.cfg)]);
    clearSessionCookie(ctx.res, ctx.cfg);
    ctx.json(200, { ok: true });
  });

  r.get("/api/auth/me", (ctx) => {
    const s = ctx.session;
    if (!s) throw new HttpError(401, "Niet ingelogd.");
    if (s.kind === "staff") return ctx.json(200, { kind: "staff", name: s.user.name, email: s.user.email, role: s.user.role, totpEnabled: !!s.user.totp_enabled, mfaOk: !!s.mfa_ok, requireTotp: ctx.cfg.requireTotp });
    ctx.json(200, { kind: "customer" });
  });

  r.post("/api/auth/totp/setup", async (ctx) => {
    const s = ctx.session;
    if (!s || s.kind !== "staff") throw new HttpError(401, "Niet ingelogd.");
    if (s.user.totp_enabled) throw new HttpError(409, "Tweestapsverificatie is al actief.");
    const secret = newTotpSecret();
    ctx.db.run("UPDATE users SET totp_secret = ? WHERE id = ? AND totp_enabled = 0", secret, s.user.id);
    ctx.json(200, { secret, uri: totpUri(secret, s.user.email) });
  });

  r.post("/api/auth/totp/verify", async (ctx) => {
    const s = ctx.session;
    if (!s || s.kind !== "staff") throw new HttpError(401, "Niet ingelogd.");
    rateLimit(`totp:${s.user.id}`, 10, 15 * 60e3);
    const { code } = await readJson(ctx.req, 1024);
    const u = ctx.db.get("SELECT * FROM users WHERE id = ?", s.user.id);
    if (!u.totp_secret || !verifyTotp(u.totp_secret, code)) throw new HttpError(400, "Code onjuist. Controleer de tijd op uw telefoon.");
    ctx.db.run("UPDATE users SET totp_enabled = 1 WHERE id = ?", u.id);
    ctx.db.run("UPDATE sessions SET mfa_ok = 1 WHERE id = ?", s.id);
    audit(ctx.db, u.email, "tweestapsverificatie ingeschakeld");
    ctx.json(200, { ok: true });
  });

  r.post("/api/auth/password", async (ctx) => {
    const s = ctx.session;
    if (!s || s.kind !== "staff" || (!s.mfa_ok && (ctx.cfg.requireTotp || s.user.totp_enabled))) throw new HttpError(401, "Niet ingelogd.");
    const { current, next } = await readJson(ctx.req, 4096);
    const u = ctx.db.get("SELECT * FROM users WHERE id = ?", s.user.id);
    if (!verifyPassword(String(current || ""), u.password_hash)) throw new HttpError(400, "Huidig wachtwoord onjuist.");
    const p = passwordProblem(next);
    if (p) throw new HttpError(400, p);
    ctx.db.run("UPDATE users SET password_hash = ?, password_changed_at = ? WHERE id = ?", hashPassword(next), now(), u.id);
    destroyUserSessions(ctx.db, u.id, s.id);
    audit(ctx.db, u.email, "wachtwoord gewijzigd");
    ctx.json(200, { ok: true });
  });

  /* ---- klantportaal: inloglink aanvragen en gebruiken ---- */
  r.post("/api/portal/login-request", async (ctx) => {
    const { email } = await readJson(ctx.req, 1024);
    rateLimit(`portal-req:${ctx.ipHash}`, 5, 3600e3);
    const e = String(email || "").trim().toLowerCase();
    const c = e ? ctx.db.get("SELECT * FROM customers WHERE email = ? ORDER BY created_at LIMIT 1", e) : null;
    if (c) {
      const t = createPortalToken(ctx.db, c.id);
      queueMail(ctx.db, { kind: "portaal-inloglink", to: c.email, subject: "Uw inloglink voor het Sealcleaning-klantportaal",
        text: `Beste ${c.name},\n\nMet deze link logt u in op uw klantportaal (15 minuten geldig, één keer te gebruiken):\n${ctx.cfg.publicBaseUrl}/portaal/#token=${t}\n\nHeeft u dit niet aangevraagd? Dan kunt u dit bericht negeren.\n\nSealcleaning Groenonderhoud en Aanleg` });
      audit(ctx.db, "klant", "inloglink aangevraagd", c.id, ctx.ipHash);
    }
    // Altijd hetzelfde antwoord: geen prijsgeven of een adres bekend is.
    ctx.json(200, { ok: true, message: "Als dit e-mailadres bij ons bekend is, ontvangt u binnen enkele minuten een inloglink." });
  });

  r.post("/api/portal/login", async (ctx) => {
    rateLimit(`portal-login:${ctx.ipHash}`, 20, 3600e3);
    const { token } = await readJson(ctx.req, 1024);
    const customerId = consumePortalToken(ctx.db, String(token || ""));
    if (!customerId) throw new HttpError(401, "Deze inloglink is ongeldig of verlopen. Vraag een nieuwe aan.");
    const s = createSession(ctx.db, { kind: "customer", customerId, mfaOk: true, ipHash: ctx.ipHash, ua: ctx.req.headers["user-agent"] });
    setSessionCookie(ctx.res, ctx.cfg, s.token, s.maxAgeSec);
    audit(ctx.db, "klant", "ingelogd op portaal", customerId, ctx.ipHash);
    ctx.json(200, { ok: true });
  });
}
