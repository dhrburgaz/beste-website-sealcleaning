/** Gedeelde UI-hulpjes voor beheer en portaal. Alle data via textContent (geen HTML-injectie). */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  return el;
}
export const euro = (c) => (c == null ? "op aanvraag" : (c / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" }));
export const nl = (n, d = 2) => Number(n).toLocaleString("nl-NL", { maximumFractionDigits: d });
export const dt = (iso) => (iso ? new Date(iso).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" }) : "—");
export const d = (iso) => (iso ? new Date(iso.length === 10 ? iso + "T12:00:00Z" : iso).toLocaleDateString("nl-NL", { timeZone: "Europe/Amsterdam" }) : "—");

export class ApiError extends Error { constructor(status, body) { super(body?.error || `Fout ${status}`); this.status = status; this.body = body; } }
export async function api(method, path, body) {
  const opts = { method, headers: { "X-SEAL-CSRF": "1" }, credentials: "same-origin" };
  if (body instanceof FormData) opts.body = body;
  else if (body !== undefined) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const r = await fetch(path, opts);
  const ct = r.headers.get("content-type") || "";
  const data = ct.includes("json") ? await r.json() : await r.text();
  if (!r.ok) throw new ApiError(r.status, data);
  return data;
}

let uid = 0;
export function field(label, input, hint) {
  input.id = input.id || `f${++uid}`;
  return h("div", { class: "configurator-field" }, h("label", { for: input.id, text: label }), input, hint ? h("p", { class: "field-hint", text: hint }) : null);
}
export function input(type, value, attrs = {}) { const i = h("input", { type, ...attrs }); if (value != null) i.value = value; return i; }
export function select(options, value) { const s = h("select", {}); for (const [v, l] of options) { const o = h("option", { value: v, text: l }); if (String(v) === String(value ?? "")) o.selected = true; s.appendChild(o); } return s; }
export function textarea(value, rows = 3) { const t = h("textarea", { rows: String(rows) }); t.value = value || ""; return t; }
export function msg(text, error) { return h("p", { class: error ? "field-error" : "field-hint", role: error ? "alert" : "status", text }); }
export function btn(text, onclick, cls = "btn btn-secondary btn-sm", extra = {}) { return h("button", { type: "button", class: cls, text, onclick, ...extra }); }

/** Knop die een async actie uitvoert en fouten toont naast de knop. */
export function action(text, fn, cls) {
  const out = h("span", { class: "action-msg" });
  const b = btn(text, async () => {
    b.disabled = true; out.textContent = "";
    try { await fn(); } catch (e) { out.replaceChildren(msg(e.message, true)); } finally { b.disabled = false; }
  }, cls);
  return h("span", { class: "action" }, b, out);
}

export function table(head, rows) {
  return h("div", { class: "price-table-wrap", tabindex: "0", role: "region", "aria-label": "Tabel" },
    h("table", { class: "price-table beheer-table" }, h("thead", {}, h("tr", {}, head.map((t) => h("th", { scope: "col", text: t })))),
      h("tbody", {}, rows.map((r) => h("tr", {}, r.map((c) => (c instanceof Node ? h("td", {}, c) : h("td", { text: c == null ? "" : String(c) }))))))));
}
