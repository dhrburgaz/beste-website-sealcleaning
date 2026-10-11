/**
 * E-mail: elke mail gaat eerst naar de outbox-tabel. Een verwerker verstuurt
 * via SMTP zodra SMTP_* is ingesteld; zonder mailserver blijft de mail
 * zichtbaar als "niet verzonden" in beheer (nooit als verzonden getoond).
 */
import net from "node:net";
import tls from "node:tls";
import { now, newId } from "./db.js";

export function queueMail(db, { kind, to, subject, text }) {
  if (!to || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(to)) return null;
  const id = newId("mail");
  db.run("INSERT INTO outbox (id, kind, to_addr, subject, body_text, created_at) VALUES (?,?,?,?,?,?)", id, kind, to, String(subject).slice(0, 200), String(text).slice(0, 20000), now());
  return id;
}

function encodeHeader(s) { return /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s).toString("base64")}?=`; }

export function buildMessage({ from, to, replyTo, subject, text, messageIdDomain }) {
  const body = Buffer.from(text.replace(/\r?\n/g, "\r\n"), "utf8").toString("base64").replace(/(.{76})/g, "$1\r\n");
  const headers = [
    `From: ${from}`, `To: ${to}`, replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodeHeader(subject)}`, `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${newId("m")}@${messageIdDomain || "sealcleaning.nl"}>`,
    "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: base64"
  ].filter(Boolean);
  return headers.join("\r\n") + "\r\n\r\n" + body;
}

/** Minimale SMTP-client: implicit TLS (465), STARTTLS (587) of plain (alleen tests). */
export function smtpSend(smtp, { to, subject, text }, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    let sock = smtp.secure === "tls" ? tls.connect({ host: smtp.host, port: smtp.port, servername: smtp.host }) : net.connect({ host: smtp.host, port: smtp.port });
    let buf = "";
    const queue = [];
    const timer = setTimeout(() => { sock.destroy(); reject(new Error("SMTP-time-out")); }, timeoutMs);
    const onData = (d) => {
      buf += d.toString("utf8");
      let idx;
      while ((idx = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, idx); buf = buf.slice(idx + 2);
        if (/^\d{3} /.test(line)) { const w = queue.shift(); if (w) w(line); }
      }
    };
    const attach = (s) => { s.on("data", onData); s.on("error", (e) => { clearTimeout(timer); reject(e); }); };
    attach(sock);
    const expect = (code) => new Promise((res, rej) => queue.push((line) => (line.startsWith(String(code)) ? res(line) : rej(new Error(`SMTP: ${line}`)))));
    const send = (cmd, code) => { const p = expect(code); sock.write(cmd + "\r\n"); return p; };
    const domain = (smtp.from.match(/@([^>\s]+)/) || [, "localhost"])[1];
    (async () => {
      await expect(220);
      await send(`EHLO ${domain}`, 250);
      if (smtp.secure === "starttls") {
        await send("STARTTLS", 220);
        sock.removeListener("data", onData);
        sock = tls.connect({ socket: sock, servername: smtp.host });
        attach(sock);
        await new Promise((r) => sock.once("secureConnect", r));
        await send(`EHLO ${domain}`, 250);
      }
      if (smtp.user) {
        await send("AUTH LOGIN", 334);
        await send(Buffer.from(smtp.user).toString("base64"), 334);
        await send(Buffer.from(smtp.pass).toString("base64"), 235);
      }
      const fromAddr = (smtp.from.match(/<([^>]+)>/) || [, smtp.from])[1];
      await send(`MAIL FROM:<${fromAddr}>`, 250);
      await send(`RCPT TO:<${to}>`, 250);
      await send("DATA", 354);
      const msg = buildMessage({ from: smtp.from, to, replyTo: smtp.replyTo, subject, text, messageIdDomain: domain }).replace(/\r\n\./g, "\r\n..");
      await send(msg + "\r\n.", 250);
      sock.write("QUIT\r\n");
      clearTimeout(timer);
      sock.end();
      resolve();
    })().catch((e) => { clearTimeout(timer); sock.destroy(); reject(e); });
  });
}

let busy = false;
export async function processOutbox(db, cfg) {
  if (!cfg.smtp || busy) return 0;
  busy = true;
  let sent = 0;
  try {
    const rows = db.all("SELECT * FROM outbox WHERE status IN ('queued','failed') AND attempts < 5 ORDER BY created_at LIMIT 20");
    for (const m of rows) {
      try {
        await smtpSend(cfg.smtp, { to: m.to_addr, subject: m.subject, text: m.body_text });
        db.run("UPDATE outbox SET status = 'sent', sent_at = ?, attempts = attempts + 1, last_error = NULL WHERE id = ?", now(), m.id);
        sent++;
      } catch (e) {
        db.run("UPDATE outbox SET status = 'failed', attempts = attempts + 1, last_error = ? WHERE id = ?", String(e.message).slice(0, 300), m.id);
      }
    }
  } finally { busy = false; }
  return sent;
}
