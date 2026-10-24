/**
 * HTTP-laag zonder externe afhankelijkheden: router, veilige headers,
 * body-limieten, cookies, rate limiting, multipart-uploads en statische
 * bestanden uit een witte lijst.
 */
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep, resolve } from "node:path";

export class HttpError extends Error {
  constructor(status, message, extra) { super(message); this.status = status; this.extra = extra; }
}

export function createRouter() {
  const routes = [];
  const add = (method, path, handler, opts = {}) => {
    const keys = [];
    const re = new RegExp("^" + path.replace(/:([a-zA-Z]+)/g, (_, k) => { keys.push(k); return "([^/]+)"; }) + "/?$");
    routes.push({ method, re, keys, handler, opts });
  };
  const match = (method, pathname) => {
    let pathMatched = false;
    for (const r of routes) {
      const m = r.re.exec(pathname);
      if (!m) continue;
      pathMatched = true;
      if (r.method !== method) continue;
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { route: r, params };
    }
    return pathMatched ? { methodNotAllowed: true } : null;
  };
  return { get: (p, h, o) => add("GET", p, h, o), post: (p, h, o) => add("POST", p, h, o), put: (p, h, o) => add("PUT", p, h, o), del: (p, h, o) => add("DELETE", p, h, o), match };
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'; object-src 'none'"
};

export function applySecurityHeaders(res, cfg) {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  if (cfg.cookieSecure) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
}

export function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(data);
}

export function clientIp(req, cfg) {
  if (cfg.trustProxy) {
    const xf = req.headers["x-forwarded-for"];
    if (xf) return String(xf).split(",")[0].trim();
  }
  return req.socket.remoteAddress || "";
}

export function hashIp(ip, secret) {
  return createHash("sha256").update(`${secret}|${ip}`).digest("base64url").slice(0, 22);
}

export function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function cookieName(cfg) { return cfg.cookieSecure ? "__Host-seal_sess" : "seal_sess"; }

export function setSessionCookie(res, cfg, token, maxAgeSec) {
  const attrs = [`${cookieName(cfg)}=${token}`, "Path=/", "HttpOnly", "SameSite=Strict", `Max-Age=${maxAgeSec}`];
  if (cfg.cookieSecure) attrs.push("Secure");
  res.setHeader("Set-Cookie", attrs.join("; "));
}
export function clearSessionCookie(res, cfg) { setSessionCookie(res, cfg, "", 0); }

export async function readBody(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > limit) throw new HttpError(413, "Verzoek is te groot.");
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

export async function readJson(req, limit = 256 * 1024) {
  const ct = String(req.headers["content-type"] || "");
  if (!ct.startsWith("application/json")) throw new HttpError(415, "Verwacht JSON.");
  const buf = await readBody(req, limit);
  try { return buf.length ? JSON.parse(buf.toString("utf8")) : {}; } catch { throw new HttpError(400, "Ongeldige JSON."); }
}

/* ---------- rate limiting (geheugen, per proces) ---------- */
const buckets = new Map();
export function rateLimit(key, max, windowMs) {
  const t = Date.now();
  const arr = (buckets.get(key) || []).filter((x) => t - x < windowMs);
  if (arr.length >= max) { buckets.set(key, arr); throw new HttpError(429, "Te veel verzoeken. Probeer het later opnieuw."); }
  arr.push(t);
  buckets.set(key, arr);
  if (buckets.size > 50000) buckets.clear();
}
export function resetRateLimits() { buckets.clear(); }

/* ---------- multipart (uploads) ---------- */
const ALLOWED = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", ext: "webp", test: (b) => b.slice(0, 4).toString("latin1") === "RIFF" && b.slice(8, 12).toString("latin1") === "WEBP" },
  { mime: "image/heic", ext: "heic", test: (b) => b.slice(4, 8).toString("latin1") === "ftyp" && /heic|heix|mif1|msf1/.test(b.slice(8, 12).toString("latin1")) },
  { mime: "application/pdf", ext: "pdf", test: (b) => b.slice(0, 5).toString("latin1") === "%PDF-" }
];
export function sniffFile(buf) { return ALLOWED.find((a) => buf.length > 12 && a.test(buf)) || null; }

/**
 * Parseert multipart/form-data. Bestanden worden op inhoud (magic bytes)
 * gecontroleerd, niet op de opgegeven naam of het opgegeven type.
 * @returns {{fields: Object<string,string>, files: Array<{field, filename, mime, ext, data}>}}
 */
export async function readMultipart(req, { maxTotal = 15 * 1024 * 1024, maxFile = 8 * 1024 * 1024, maxFiles = 5 } = {}) {
  const ct = String(req.headers["content-type"] || "");
  const m = /^multipart\/form-data;.*boundary=(?:"([^"]+)"|([^;]+))/i.exec(ct);
  if (!m) throw new HttpError(415, "Verwacht multipart/form-data.");
  const boundary = Buffer.from("--" + (m[1] || m[2]).trim());
  const body = await readBody(req, maxTotal);
  const fields = {};
  const files = [];
  let pos = body.indexOf(boundary);
  if (pos < 0) throw new HttpError(400, "Ongeldige upload.");
  while (true) {
    pos += boundary.length;
    if (body.slice(pos, pos + 2).toString() === "--") break;
    pos += 2; // CRLF
    const headerEnd = body.indexOf("\r\n\r\n", pos);
    if (headerEnd < 0) throw new HttpError(400, "Ongeldige upload.");
    const headers = body.slice(pos, headerEnd).toString("utf8");
    const next = body.indexOf(boundary, headerEnd + 4);
    if (next < 0) throw new HttpError(400, "Ongeldige upload.");
    const data = body.slice(headerEnd + 4, next - 2); // zonder CRLF voor boundary
    const name = /name="([^"]*)"/i.exec(headers)?.[1];
    const filename = /filename="([^"]*)"/i.exec(headers)?.[1];
    if (name) {
      if (filename !== undefined) {
        if (data.length) {
          if (files.length >= maxFiles) throw new HttpError(400, `Maximaal ${maxFiles} bestanden.`);
          if (data.length > maxFile) throw new HttpError(413, `Bestand "${filename}" is groter dan ${Math.round(maxFile / 1048576)} MB.`);
          const kind = sniffFile(data);
          if (!kind) throw new HttpError(415, `Bestand "${filename}" heeft geen toegestaan type (jpg, png, webp, heic, pdf).`);
          files.push({ field: name, filename: filename.replace(/[^\w.\- ()]/g, "_").slice(0, 120) || `bestand.${kind.ext}`, mime: kind.mime, ext: kind.ext, data });
        }
      } else {
        fields[name] = data.toString("utf8").slice(0, 20000);
      }
    }
    pos = next;
  }
  return { fields, files };
}

/* ---------- statische bestanden (witte lijst) ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2" };

export async function serveStatic(res, rootDirIn, relPath) {
  const rootDir = resolve(rootDirIn);
  const safe = normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = resolve(join(rootDir, safe));
  if (!full.startsWith(rootDir + sep) && full !== rootDir) return false;
  let p = full;
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
    const data = await readFile(p);
    res.writeHead(200, { "Content-Type": TYPES[extname(p)] || "application/octet-stream", "Cache-Control": extname(p) === ".html" ? "no-cache" : "public, max-age=3600" });
    res.end(data);
    return true;
  } catch { return false; }
}
