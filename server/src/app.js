/**
 * HTTP-applicatie: koppelt routes, sessies, CSRF-/origin-controle en
 * statische bestanden. Wordt gebruikt door server.js en door de tests.
 */
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { openDb } from "./db.js";
import { loadConfig } from "./config.js";
import { createRouter, applySecurityHeaders, sendJson, HttpError, clientIp, hashIp, parseCookies, cookieName, serveStatic } from "./http.js";
import { loadSession } from "./auth.js";
import { registerPublic } from "./routes/public.js";
import { registerAuth } from "./routes/auth.js";
import { registerAdmin } from "./routes/admin.js";
import { registerPortal } from "./routes/portal.js";

const SERVER_PUBLIC = fileURLToPath(new URL("../public/", import.meta.url));
const SITE_STATIC = ["css/", "js/", "data/", "images/branding/", "vendor/", "favicon.svg"];

export function createApp(overrides = {}) {
  const cfg = loadConfig(overrides);
  const db = overrides.db || openDb(cfg.dbPath);
  const router = createRouter();
  registerPublic(router);
  registerAuth(router);
  registerAdmin(router);
  registerPortal(router);

  const handler = async (req, res) => {
    applySecurityHeaders(res, cfg);
    const url = new URL(req.url, "http://x");
    const ip = clientIp(req, cfg);
    const ctx = { db, cfg, req, res, url, ip, ipHash: hashIp(ip, cfg.ipHashSecret || "seal"), params: {}, json: (s, b) => sendJson(res, s, b) };
    try {
      if (url.pathname.startsWith("/api/")) {
        const isPublic = url.pathname.startsWith("/api/public/") || url.pathname === "/api/health";
        const origin = req.headers.origin;
        if (isPublic && origin && cfg.siteOrigins.includes(origin)) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Vary", "Origin");
          res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        }
        if (req.method === "OPTIONS") {
          if (!isPublic || !origin || !cfg.siteOrigins.includes(origin)) throw new HttpError(403, "Niet toegestaan.");
          res.writeHead(204, { "Access-Control-Allow-Methods": "POST, GET", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" });
          return res.end();
        }
        const m = router.match(req.method, url.pathname);
        if (!m) throw new HttpError(404, "Niet gevonden.");
        if (m.methodNotAllowed) throw new HttpError(405, "Methode niet toegestaan.");
        ctx.params = m.params;
        // Sessie + CSRF voor alles behalve publieke endpoints en de betaal-webhook
        if (!isPublic && !m.route.opts.webhook) {
          ctx.session = loadSession(db, parseCookies(req)[cookieName(cfg)]);
          if (req.method !== "GET") {
            if (req.headers["x-seal-csrf"] !== "1") throw new HttpError(403, "Ontbrekende beveiligingsheader.");
            const o = req.headers.origin;
            if (o && o !== new URL(cfg.publicBaseUrl).origin) throw new HttpError(403, "Verzoek van een andere herkomst geweigerd.");
          }
        }
        await m.route.handler(ctx);
        if (!res.writableEnded) sendJson(res, 204, {});
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") throw new HttpError(405, "Methode niet toegestaan.");
      const path = decodeURIComponent(url.pathname);
      if (path === "/" ) { res.writeHead(302, { Location: "/portaal/" }); return res.end(); }
      if (path.startsWith("/admin") || path.startsWith("/portaal") || path.startsWith("/shared/")) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        if (await serveStatic(res, SERVER_PUBLIC, path.replace(/^\//, ""))) return;
      }
      if (path === "/robots.txt") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("User-agent: *\nDisallow: /\n"); }
      const rel = path.replace(/^\//, "");
      if (SITE_STATIC.some((p) => rel.startsWith(p)) && await serveStatic(res, cfg.siteRoot, rel)) return;
      throw new HttpError(404, "Niet gevonden.");
    } catch (e) {
      const status = e instanceof HttpError ? e.status : 500;
      if (status === 500) console.error(new Date().toISOString(), req.method, url.pathname, e);
      if (!res.headersSent) sendJson(res, status, { error: status === 500 ? "Er ging iets mis. Probeer het later opnieuw." : e.message, ...(e.extra || {}) });
      else res.end();
    }
  };
  const server = createServer(handler);
  server.requestTimeout = 60000;
  server.headersTimeout = 20000;
  return { server, db, cfg };
}

export const guards = {
  staff(ctx, { owner = false } = {}) {
    const s = ctx.session;
    if (!s || s.kind !== "staff") throw new HttpError(401, "Niet ingelogd.");
    if (!s.mfa_ok && (ctx.cfg.requireTotp || s.user.totp_enabled)) throw new HttpError(401, "Tweestapsverificatie vereist.", { needTotp: true });
    if (owner && s.user.role !== "owner") throw new HttpError(403, "Alleen de eigenaar mag dit.");
    return s.user;
  },
  customer(ctx) {
    const s = ctx.session;
    if (!s || s.kind !== "customer") throw new HttpError(401, "Niet ingelogd.");
    return s.customer_id;
  }
};
