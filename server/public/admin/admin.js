/** Sealcleaning beheer (server-gebaseerd): aanvragen, projecten, calculatie, offertes, facturen, planning, instellingen. */
import { h, api, euro, nl, dt, d, field, input, select, textarea, msg, btn, action, table } from "/shared/ui.js";
import { quoteDoc, invoiceDoc, printDocument } from "/shared/docs.js";
import { encodeShare } from "/js/configurator/design-io.js";

const app = document.querySelector("[data-app]");
const tabs = document.querySelector("[data-tabs]");
const logoutBtn = document.querySelector("[data-logout]");
let me = null, meta = null;

logoutBtn.addEventListener("click", async () => { await api("POST", "/api/auth/logout", {}); location.hash = ""; location.reload(); });
window.addEventListener("hashchange", route);

const TABS = [["overzicht", "Overzicht"], ["aanvragen", "Aanvragen"], ["projecten", "Projecten"], ["klanten", "Klanten"], ["facturen", "Facturen"], ["winkel", "Winkel"], ["instellingen", "Instellingen"], ["email", "E-mail"], ["audit", "Audit"], ["account", "Account"]];
const KIND = { contact: "Contact", b2b: "Zakelijk", werken: "Werken met ons", configurator: "Configurator" };
const BASIS = { purchase: ["eigen inkoop", "badge-ok"], market: ["marktprijs (benadering)", "badge-warn"], confirmed: ["bevestigd", "badge-ok"], example: ["voorbeeldnorm", "badge-warn"], missing: ["ontbreekt", "badge-block"] };

async function start() {
  try { me = await api("GET", "/api/auth/me"); } catch { return renderLogin(); }
  if (me.kind !== "staff") return renderLogin();
  if (!me.mfaOk && (me.requireTotp || me.totpEnabled)) return me.totpEnabled ? renderLogin("Log opnieuw in met uw code.") : renderEnroll();
  meta = await api("GET", "/api/admin/dashboard");
  tabs.hidden = false; logoutBtn.hidden = false;
  route();
}

function renderTabs(active) {
  tabs.replaceChildren(...TABS.map(([id, label]) => h("a", { href: `#${id}`, class: "beheer-tab", "aria-current": active === id ? "page" : null, text: label })));
}

async function route() {
  if (!me) return;
  const [tab, id] = (location.hash.slice(1) || "overzicht").split("/");
  renderTabs(tab);
  app.replaceChildren(msg("Laden…"));
  try {
    const fn = { overzicht: viewDashboard, aanvragen: id ? viewLead : viewLeads, projecten: id ? viewProject : viewProjects, klanten: id ? viewCustomer : viewCustomers, facturen: viewInvoices, winkel: viewShop, instellingen: viewSettings, email: viewEmail, audit: viewAudit, account: viewAccount }[tab] || viewDashboard;
    await fn(id);
  } catch (e) {
    if (e.status === 401) return location.reload();
    app.replaceChildren(msg(e.message, true));
  }
}

/* ---------- inloggen ---------- */
function renderLogin(note) {
  tabs.hidden = true; logoutBtn.hidden = true;
  const email = input("email", "", { autocomplete: "username", required: true });
  const pw = input("password", "", { autocomplete: "current-password", required: true });
  const code = input("text", "", { inputmode: "numeric", autocomplete: "one-time-code", maxlength: "6", pattern: "\\d{6}" });
  const codeField = field("Code uit authenticator-app", code); codeField.hidden = true;
  const out = h("div"); if (note) out.appendChild(msg(note, true));
  app.replaceChildren(h("form", { class: "beheer-lock", onsubmit: async (e) => {
    e.preventDefault(); out.replaceChildren();
    try {
      const r = await api("POST", "/api/auth/login", { email: email.value, password: pw.value, totp: code.value || undefined });
      if (r.enrollTotp) return renderEnroll();
      start();
    } catch (err) { if (err.body?.needTotp) { codeField.hidden = false; code.focus(); } out.replaceChildren(msg(err.message, true)); }
  } }, h("h1", { text: "Beheer inloggen" }), field("E-mailadres", email), field("Wachtwoord", pw), codeField, h("button", { type: "submit", class: "btn btn-primary", text: "Inloggen" }), out));
}

async function renderEnroll() {
  const s = await api("POST", "/api/auth/totp/setup", {});
  const code = input("text", "", { inputmode: "numeric", maxlength: "6" });
  const out = h("div");
  app.replaceChildren(h("div", { class: "beheer-lock" }, h("h1", { text: "Tweestapsverificatie instellen" }),
    h("p", { text: "Voeg in uw authenticator-app (bijv. Microsoft Authenticator, Google Authenticator of 1Password) handmatig een account toe met deze sleutel:" }),
    h("p", { class: "totp-secret", text: s.secret.match(/.{1,4}/g).join(" ") }),
    h("details", {}, h("summary", { text: "Of gebruik deze otpauth-link" }), h("code", { class: "totp-uri", text: s.uri })),
    field("Voer de 6-cijferige code in", code),
    action("Bevestigen", async () => { await api("POST", "/api/auth/totp/verify", { code: code.value }); start(); }, "btn btn-primary"), out));
}

/* ---------- overzicht ---------- */
async function viewDashboard() {
  const m = meta = await api("GET", "/api/admin/dashboard");
  app.replaceChildren(h("h1", { text: "Overzicht" }),
    h("div", { class: "beheer-kpis" },
      kpi("Nieuwe aanvragen", m.leadsNew, "#aanvragen"), kpi("Offertes wachtend op akkoord", m.quotesOpen, "#projecten"),
      kpi("Openstaande facturen", `${m.invoicesOpen.length} · ${euro(m.invoicesOpen.reduce((s, i) => s + i.open, 0))}`, "#facturen"),
      kpi("Ongelezen klantberichten", m.unreadMessages, "#projecten"), kpi("E-mail niet verzonden", m.outboxPending, "#email")),
    m.invoicesOpen.some((i) => i.overdue) ? msg(`Vervallen facturen: ${m.invoicesOpen.filter((i) => i.overdue).map((i) => i.number).join(", ")}`, true) : null,
    h("h2", { text: "Komende afspraken" }),
    m.upcoming.length ? table(["Wanneer", "Wat", "Project", "Status"], m.upcoming.map((a) => [dt(a.starts_at), a.kind, a.title, a.status])) : h("p", { text: "Geen komende afspraken." }),
    h("h2", { text: "Projecten per status" }), h("p", { text: m.projectsByStatus.map((s) => `${s.status}: ${s.n}`).join(" · ") || "Nog geen projecten." }),
    h("h2", { text: "Koppelingen" }), table(["Onderdeel", "Status"], Object.entries(m.integrations).map(([k, v]) => [k, v])));
}
const kpi = (label, value, href) => h("a", { class: "beheer-kpi", href }, h("strong", { text: String(value) }), h("span", { text: label }));

/* ---------- aanvragen ---------- */
async function viewLeads() {
  const leads = await api("GET", "/api/admin/leads");
  app.replaceChildren(h("h1", { text: "Aanvragen" }),
    leads.length ? table(["Ref", "Soort", "Naam", "Plaats", "Dienst", "Ontvangen", "Status", ""], leads.map((l) => [l.ref, KIND[l.kind] || l.kind, l.name, l.city || "", l.service || "", dt(l.created_at), l.status, h("a", { href: `#aanvragen/${l.id}`, text: "Openen" })]))
      : h("p", { text: "Nog geen aanvragen. Formulieren op de website sturen hierheen zodra het API-adres is ingesteld." }));
}
async function viewLead(id) {
  const l = await api("GET", `/api/admin/leads/${id}`);
  const custs = await api("GET", "/api/admin/customers");
  const existing = select([["", "Nieuwe klant aanmaken uit aanvraag"], ...custs.map((c) => [c.id, `${c.name}${c.email ? ` (${c.email})` : ""}`])], custs.find((c) => l.email && c.email === l.email)?.id || "");
  const title = input("text", `${l.service || "Project"} ${l.name || ""}`.trim());
  app.replaceChildren(h("p", {}, h("a", { href: "#aanvragen", text: "← Aanvragen" })), h("h1", { text: `${KIND[l.kind] || l.kind} ${l.ref}` }),
    h("div", { class: "beheer-card" }, table(["Veld", "Waarde"], [["Naam", l.name], ["E-mail", l.email], ["Telefoon", l.phone], ["Plaats / postcode", `${l.city || ""} ${l.postal || ""}`], ["Dienst", l.service], ["Ontvangen", dt(l.created_at)], ["Status", l.status], ...Object.entries(l.payload).map(([k, v]) => [k, v])]),
      l.message ? h("p", { class: "lead-message", text: l.message }) : null,
      l.files.length ? h("p", {}, "Bijlagen: ", ...l.files.map((f) => h("a", { href: `/api/admin/files/${f.id}`, text: `${f.filename} ` }))) : null,
      l.design ? h("p", {}, "Ontwerp meegestuurd: ", h("a", { href: `https://sealcleaning.nl/project-samenstellen/#ontwerp=${encodeShare(l.design)}`, target: "_blank", rel: "noopener", text: "openen in configurator" })) : null),
    l.project_id ? h("p", {}, "Omgezet naar ", h("a", { href: `#projecten/${l.project_id}`, text: "project" })) : h("div", { class: "beheer-card" }, h("h2", { text: "Omzetten naar project" }), field("Klant", existing), field("Projectnaam", title),
      action("Omzetten", async () => { const r = await api("POST", `/api/admin/leads/${id}/convert`, { customerId: existing.value || null, title: title.value }); location.hash = `#projecten/${r.projectId}`; }, "btn btn-primary btn-sm")),
    h("div", { class: "btn-row" },
      ...["in behandeling", "gesloten"].map((s) => action(`Markeer: ${s}`, async () => { await api("PUT", `/api/admin/leads/${id}`, { status: s }); route(); })),
      action("Verwijderen (AVG)", async () => { if (confirm("Aanvraag en bijlagen definitief verwijderen?")) { await api("DELETE", `/api/admin/leads/${id}`); location.hash = "#aanvragen"; } })));
}

/* ---------- klanten ---------- */
async function viewCustomers() {
  const list = await api("GET", "/api/admin/customers");
  const f = { name: input("text"), email: input("email"), phone: input("tel"), address: input("text") };
  const type = select([["particulier", "Particulier"], ["zakelijk", "Zakelijk"]], "particulier");
  app.replaceChildren(h("h1", { text: "Klanten" }),
    h("div", { class: "beheer-card beheer-grid" }, field("Naam", f.name), field("E-mail", f.email), field("Telefoon", f.phone), field("Adres", f.address), field("Soort", type),
      action("Klant toevoegen", async () => { await api("POST", "/api/admin/customers", { name: f.name.value, email: f.email.value, phone: f.phone.value, address: f.address.value, type: type.value }); route(); }, "btn btn-primary btn-sm")),
    table(["Naam", "E-mail", "Telefoon", "Soort", "Projecten", ""], list.map((c) => [c.name, c.email || "", c.phone || "", c.type, c.projects, h("a", { href: `#klanten/${c.id}`, text: "Openen" })])));
}
async function viewCustomer(id) {
  const c = await api("GET", `/api/admin/customers/${id}`);
  const f = { name: input("text", c.name), email: input("email", c.email), phone: input("tel", c.phone), address: input("text", c.address), notes: textarea(c.notes) };
  const type = select([["particulier", "Particulier"], ["zakelijk", "Zakelijk"]], c.type);
  const linkOut = h("div");
  app.replaceChildren(h("p", {}, h("a", { href: "#klanten", text: "← Klanten" })), h("h1", { text: c.name }),
    h("div", { class: "beheer-card beheer-grid" }, field("Naam", f.name), field("E-mail", f.email), field("Telefoon", f.phone), field("Adres", f.address), field("Soort", type), field("Notities", f.notes),
      action("Opslaan", async () => { await api("PUT", `/api/admin/customers/${id}`, { name: f.name.value, email: f.email.value, phone: f.phone.value, address: f.address.value, type: type.value, notes: f.notes.value }); route(); }, "btn btn-primary btn-sm")),
    h("div", { class: "beheer-card" }, h("h2", { text: "Klantportaal" }),
      action("Portaallink maken (7 dagen, eenmalig)", async () => { const r = await api("POST", `/api/admin/customers/${id}/portal-link`, {}); linkOut.replaceChildren(h("input", { type: "text", readonly: true, value: r.link, class: "design-share-input", "aria-label": "Portaallink" }), msg("Stuur deze link zelf (bijv. via WhatsApp) of gebruik de e-mailknop.")); }),
      action("Portaallink per e-mail sturen", async () => { const r = await api("POST", `/api/admin/customers/${id}/portal-link`, { email: true }); linkOut.replaceChildren(msg(r.queued ? "E-mail in de wachtrij gezet." : "Geen e-mailadres bekend.", !r.queued)); }), linkOut),
    h("div", { class: "beheer-card" }, h("h2", { text: "Projecten" }), c.projects.length ? h("ul", {}, c.projects.map((p) => h("li", {}, h("a", { href: `#projecten/${p.id}`, text: `${p.title} (${p.ref})` }), ` — ${p.status}`))) : h("p", { text: "Geen projecten." }),
      action("Nieuw project voor deze klant", async () => { const t = prompt("Projectnaam:"); if (t) { const r = await api("POST", "/api/admin/projects", { title: t, customerId: id }); location.hash = `#projecten/${r.id}`; } })),
    h("div", { class: "beheer-card" }, h("h2", { text: "Toestemmingen" }), c.consents.length ? table(["Soort", "Gegeven", "Moment", "Bron"], c.consents.map((x) => [x.kind, x.granted ? "ja" : "ingetrokken", dt(x.at), x.source])) : h("p", { text: "Geen geregistreerde toestemmingen." })),
    h("details", { class: "beheer-danger" }, h("summary", { text: "Klant verwijderen (AVG)" }), h("p", { class: "field-hint", text: "Niet mogelijk zolang er uitgegeven facturen zijn (fiscale bewaarplicht)." }),
      action("Definitief verwijderen", async () => { if (confirm("Klant met projecten en bestanden definitief verwijderen?")) { await api("DELETE", `/api/admin/customers/${id}`); location.hash = "#klanten"; } })));
}

/* ---------- projecten ---------- */
async function viewProjects() {
  const list = await api("GET", "/api/admin/projects");
  const title = input("text", "", { placeholder: "Projectnaam" });
  const design = input("url", "", { placeholder: "Deellink van ontwerp (optioneel)" });
  app.replaceChildren(h("h1", { text: "Projecten" }),
    h("div", { class: "beheer-card beheer-row" }, title, design, action("Project toevoegen", async () => { const r = await api("POST", "/api/admin/projects", { title: title.value, design: design.value || undefined }); location.hash = `#projecten/${r.id}`; }, "btn btn-primary btn-sm")),
    table(["Ref", "Project", "Klant", "Status", "Bijgewerkt", ""], list.map((p) => [p.ref, p.title, p.customer || "—", p.status, dt(p.updated_at), h("a", { href: `#projecten/${p.id}`, text: "Openen" })])));
}

async function viewProject(id) {
  const p = await api("GET", `/api/admin/projects/${id}`);
  const custs = await api("GET", "/api/admin/customers");
  const status = select(meta.statuses.map((s) => [s, s]), p.status);
  const cust = select([["", "— geen klant —"], ...custs.map((c) => [c.id, c.name])], p.customer_id || "");
  const title = input("text", p.title);
  const notes = textarea(p.notes, 3);
  const designLink = input("url", "", { placeholder: "Nieuwe deellink plakken om het ontwerp te vervangen" });
  const custLine = p.customer ? `${p.customer.name}${p.customer.address ? `, ${p.customer.address}` : ""}` : "";
  const plannedHours = p.quotes.find((q) => q.status === "akkoord")?.internal.result.totals.laborHours ?? p.quotes[0]?.internal.result.totals.laborHours;
  const spent = p.hours.reduce((s, x) => s + x.hours, 0);

  const sections = [
    h("p", {}, h("a", { href: "#projecten", text: "← Projecten" })),
    h("h1", { text: `${p.title} (${p.ref})` }),
    h("div", { class: "beheer-card beheer-grid" }, field("Titel", title), field("Status", status), field("Klant", cust), field("Notities", notes),
      action("Opslaan", async () => { await api("PUT", `/api/admin/projects/${id}`, { title: title.value, status: status.value, customerId: cust.value || null, notes: notes.value }); route(); }, "btn btn-primary btn-sm"),
      p.customer ? action("Portaallink voor klant", async () => { const r = await api("POST", `/api/admin/customers/${p.customer_id}/portal-link`, {}); prompt("Portaallink (7 dagen, eenmalig) — kopieer en stuur aan de klant:", r.link); }) : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Ontwerp" }),
      p.design ? h("p", {}, `Diensten: ${p.design.services.join(", ")}. `, h("a", { href: `https://sealcleaning.nl/project-samenstellen/#ontwerp=${encodeShare(p.design)}`, target: "_blank", rel: "noopener", text: "Openen in configurator" })) : h("p", { text: "Nog geen ontwerp gekoppeld." }),
      h("div", { class: "beheer-row" }, designLink, action("Ontwerp vervangen", async () => { await api("PUT", `/api/admin/projects/${id}`, { design: designLink.value }); route(); })))
  ];
  if (p.design) sections.push(await calcSection(id));
  sections.push(quotesSection(p, custLine), invoicesSection(p, custLine), planningSection(p), messagesSection(p),
    h("div", { class: "beheer-card" }, h("h2", { text: `Uren: ${nl(spent)}${plannedHours ? ` van ${nl(plannedHours)} gecalculeerd` : ""}` }),
      plannedHours && spent > plannedHours ? msg(`${nl(spent - plannedHours)} uur boven calculatie — meerwerk bespreken of nacalculatie.`, true) : null,
      p.hours.length ? table(["Datum", "Medewerker", "Uren", "Werkzaamheden", ""], p.hours.map((x) => [x.date, x.worker, nl(x.hours), x.note || "", btn("Verwijderen", async () => { await api("DELETE", `/api/admin/hours/${x.id}`); route(); }, "link-btn")])) : null,
      hoursForm(id)),
    filesSection(p),
    h("details", { class: "beheer-card" }, h("summary", { text: "Projecthistorie" }), h("ul", {}, p.events.map((e) => h("li", { text: `${dt(e.at)} · ${JSON.parse(e.data_json || "{}").status || e.kind} · ${e.actor || ""}` })))));
  app.replaceChildren(...sections);
}

async function calcSection(id) {
  const c = await api("POST", `/api/admin/projects/${id}/calc`, {});
  const r = c.result;
  const lines = r.lines.map((l) => [l.label, `${nl(l.qty)} ${l.unit}`, l.unitCostExclCents != null ? euro(l.unitCostExclCents) : "—", l.unitSaleExclCents != null ? euro(l.unitSaleExclCents) : "—", euro(l.saleExclCents), h("span", { class: `badge ${BASIS[l.basis]?.[1] || ""}`, text: BASIS[l.basis]?.[0] || l.basis }), [l.note, l.source].filter(Boolean).join(" — ")]);
  return h("details", { class: "beheer-card", open: true }, h("summary", {}, h("strong", { text: "Calculatie (intern) " }), h("span", { class: "badge", text: r.readiness })),
    table(["Regel", "Aantal", "Kost/eenh.", "Verkoop/eenh.", "Verkoop excl.", "Basis", "Toelichting / bron"], lines),
    h("dl", { class: "beheer-totals" },
      h("dt", { text: "Uren" }), h("dd", { text: `${nl(r.totals.laborHours)} (ca. ${r.totals.days} werkdagen)` }),
      ...r.extras.flatMap((e) => [h("dt", { text: e.label }), h("dd", { text: euro(e.cents) })]),
      h("dt", { text: "Verkoop excl. btw" }), h("dd", { text: euro(r.totals.saleExclCents) }),
      h("dt", { text: "Werkelijke kostprijs" }), h("dd", { text: r.totals.costExclCents == null ? "onbekend (niet alle kosten echt bekend)" : euro(r.totals.costExclCents) }),
      r.totals.costApproxExclCents != null ? [h("dt", { text: "Benaderde kostprijs" }), h("dd", { text: `${euro(r.totals.costApproxExclCents)} (incl. marktprijzen — geen marge op baseren)` })] : null,
      h("dt", { text: "Brutomarge" }), h("dd", { text: r.totals.grossMarginPct == null ? "onbekend" : `${euro(r.totals.grossMarginCents)} (${nl(r.totals.grossMarginPct, 1)}%)` })),
    h("ul", { class: "beheer-flags" }, r.flags.map((f) => h("li", { class: `flag-${f.level}`, text: f.text }))));
}

function manualEditor(initial = []) {
  const lines = [...initial];
  const list = h("ul");
  const draw = () => list.replaceChildren(...lines.map((l, i) => h("li", {}, `${l.label}: ${nl(l.qty)} ${l.unit} × ${euro(l.unitSaleExclCents)} `, btn("×", () => { lines.splice(i, 1); draw(); }, "link-btn", { "aria-label": `${l.label} verwijderen` }))));
  draw();
  const label = input("text", "", { placeholder: "Omschrijving (bijv. meerwerk, stelpost)" }), qty = input("text", "1", { inputmode: "decimal" }), unit = input("text", "post"), price = input("text", "", { inputmode: "decimal", placeholder: "Prijs/eenh. excl. €" });
  const el = h("div", { class: "beheer-manual" }, h("h3", { text: "Handmatige regels" }), list,
    h("div", { class: "beheer-row" }, label, qty, unit, price, btn("Toevoegen", () => {
      const q = parseFloat(qty.value.replace(",", ".")), c = Math.round(parseFloat(price.value.replace(/\./g, "").replace(",", ".")) * 100);
      if (!label.value.trim() || !(q > 0) || !Number.isFinite(c)) return;
      lines.push({ label: label.value.trim(), qty: q, unit: unit.value || "post", unitSaleExclCents: c }); label.value = ""; price.value = ""; draw();
    })));
  return { el, lines };
}

function quotesSection(p, custLine) {
  const card = h("div", { class: "beheer-card" }, h("h2", { text: "Offertes" }));
  if (p.design) {
    const me1 = manualEditor();
    const pt = select(Object.entries(meta.priceTypes).map(([k, v]) => [k, v[0]]), "richtprijs");
    const po = input("text", "", { placeholder: "Referentie/PO klant (optioneel)" });
    const cw = textarea("", 2);
    card.appendChild(h("details", {}, h("summary", { text: "Nieuwe offerte maken" }), field("Prijssoort", pt), field("Klantwerk", cw), field("Referentie", po), me1.el,
      action("Offerte (concept) aanmaken", async () => { await api("POST", `/api/admin/projects/${p.id}/quotes`, { priceType: pt.value, customerWork: cw.value, poRef: po.value, manualLines: me1.lines }); route(); }, "btn btn-primary btn-sm")));
  }
  for (const q of p.quotes) {
    const s = q.snapshot;
    const box = h("div", { class: "beheer-quote" }, h("h3", { text: `${q.number} · ${q.status} · ${euro(s.totals.excl)} excl. / ${euro(s.totals.incl)} incl. · ${s.priceTypeLabel}` }),
      q.acceptance ? msg(`Akkoord: ${q.acceptance.name} op ${dt(q.acceptance.accepted_at)} (voorwaarden ${q.acceptance.terms_version}${JSON.parse(q.acceptance.consents_json).earlyStart ? ", vroeg starten gevraagd" : ""}${JSON.parse(q.acceptance.consents_json).offline ? `, offline: ${JSON.parse(q.acceptance.consents_json).offline}` : ""})`) : null,
      h("div", { class: "btn-row" }, btn("Bekijk / print", () => printDocument(quoteDoc(s, { customer: custLine, status: q.status })))));
    const row = box.querySelector(".btn-row");
    if (q.status === "concept") {
      const me2 = manualEditor(q.manualLines);
      const pt = select(Object.entries(meta.priceTypes).map(([k, v]) => [k, v[0]]), q.price_type);
      const ex = textarea(q.excluded, 3), cw = textarea(q.customer_work, 2), po = input("text", q.po_ref || "");
      box.appendChild(h("details", {}, h("summary", { text: "Concept bewerken (herberekent met actuele instellingen)" }), field("Prijssoort", pt), field("Niet inbegrepen", ex), field("Klantwerk", cw), field("Referentie", po), me2.el,
        action("Opslaan en herberekenen", async () => { await api("PUT", `/api/admin/quotes/${q.id}`, { priceType: pt.value, excluded: ex.value, customerWork: cw.value, poRef: po.value, manualLines: me2.lines }); route(); }, "btn btn-primary btn-sm")));
      row.appendChild(action("Versturen naar klant", async () => {
        if (!confirm("Offerte vastleggen en naar de klant sturen? Daarna is deze versie niet meer te wijzigen.")) return;
        const r = await api("POST", `/api/admin/quotes/${q.id}/send`, {}); if (r.portalLink) prompt("Verstuurd (e-mail in wachtrij). Portaallink voor de klant:", r.portalLink); route();
      }, "btn btn-primary btn-sm"));
    }
    if (["verstuurd", "akkoord", "afgewezen"].includes(q.status)) row.appendChild(action("Nieuwe versie", async () => { await api("POST", `/api/admin/projects/${p.id}/quotes`, { parentId: q.id }); route(); }));
    if (q.status === "verstuurd") {
      row.appendChild(action("Akkoord buiten portaal vastleggen", async () => {
        const name = prompt("Naam van de ondertekenaar:"); if (!name) return;
        const note = prompt("Vorm van het akkoord (bijv. 'getekende PDF per e-mail ontvangen op 12-10-2026'):"); if (!note) return;
        await api("POST", `/api/admin/quotes/${q.id}/accept-offline`, { name, note }); route();
      }));
      row.appendChild(action("Markeer afgewezen", async () => { await api("POST", `/api/admin/quotes/${q.id}/status`, { status: "afgewezen" }); route(); }));
    }
    if (q.status === "akkoord") {
      row.appendChild(action("Factuur (volledig)", async () => { await api("POST", `/api/admin/quotes/${q.id}/invoices`, {}); route(); }));
      row.appendChild(action("Termijnfactuur", async () => { const pct = Number(prompt("Percentage van de offerte (bijv. 40):")); if (!pct) return; const label = prompt("Omschrijving termijn:", "Eerste termijn") || "Termijn"; await api("POST", `/api/admin/quotes/${q.id}/invoices`, { part: { pct, label } }); route(); }));
    }
    card.appendChild(box);
  }
  return card;
}

function invoicesSection(p, custLine) {
  const card = h("div", { class: "beheer-card" }, h("h2", { text: "Facturen" }));
  if (!p.invoices.length) card.appendChild(h("p", { text: "Nog geen facturen (maak er een vanuit een geaccepteerde offerte)." }));
  for (const i of p.invoices) {
    const view = { ...i, issueDate: i.issue_date, deliveryDate: i.delivery_date, dueDate: i.due_date, totalExcl: i.total_excl, vatRate: i.vat_rate, totalIncl: i.total_incl, poRef: i.po_ref };
    const open = i.total_incl - i.paid;
    const box = h("div", { class: "beheer-invoice" }, h("h3", { text: `${i.kind === "credit" ? "Creditnota" : "Factuur"} ${i.number || "(concept, nog geen nummer)"} · ${i.status} · ${euro(i.total_incl)} incl.${i.kind === "invoice" && i.number ? ` · betaald ${euro(i.paid)} · open ${euro(open)}` : ""}` }));
    const row = h("div", { class: "btn-row" });
    box.appendChild(row);
    if (i.number) row.appendChild(btn("Bekijk / print", () => printDocument(invoiceDoc(view, { company: meta.company || {}, customer: custLine, iban: meta.iban }))));
    if (i.status === "concept") {
      const dd = input("date", new Date().toISOString().slice(0, 10));
      box.appendChild(field("Prestatiedatum (uitvoering)", dd));
      row.appendChild(action("Uitgeven (nummer toekennen en versturen)", async () => { if (confirm("Factuur definitief uitgeven? Het nummer wordt vastgelegd en de factuur kan daarna alleen nog via een creditnota worden gecorrigeerd.")) { await api("POST", `/api/admin/invoices/${i.id}/issue`, { deliveryDate: dd.value }); route(); } }, "btn btn-primary btn-sm"));
      row.appendChild(action("Concept verwijderen", async () => { await api("DELETE", `/api/admin/invoices/${i.id}`); route(); }));
    }
    if (i.kind === "invoice" && i.status === "verstuurd") {
      const amt = input("text", (open / 100).toFixed(2).replace(".", ","), { inputmode: "decimal" });
      const date = input("date", new Date().toISOString().slice(0, 10));
      box.appendChild(h("div", { class: "beheer-row" }, field("Ontvangen bedrag incl. (€)", amt), field("Datum ontvangst", date),
        action("Betaling registreren", async () => { await api("POST", `/api/admin/invoices/${i.id}/payments`, { amount: Math.round(parseFloat(amt.value.replace(/\./g, "").replace(",", ".")) * 100), method: "bank", receivedAt: date.value }); route(); })));
    }
    if (i.kind === "invoice" && i.number) row.appendChild(action("Creditnota", async () => {
      const reason = prompt("Reden van creditering:"); if (!reason) return;
      const amount = Math.round(parseFloat((prompt("Te crediteren bedrag excl. btw (€):", (i.total_excl / 100).toFixed(2).replace(".", ",")) || "").replace(/\./g, "").replace(",", ".")) * 100);
      await api("POST", `/api/admin/invoices/${i.id}/credit`, { amountExclCents: amount, reason }); route();
    }));
    if (i.payments?.length) box.appendChild(h("ul", {}, i.payments.map((x) => h("li", { text: `${d(x.received_at)} · ${euro(x.amount)} · ${x.method} · ${{ paid: "ontvangen", open: "open", failed: "mislukt", canceled: "geannuleerd", expired: "verlopen" }[x.status] || x.status}` }))));
    card.appendChild(box);
  }
  return card;
}

function planningSection(p) {
  const kind = select([["opname", "Opname"], ["uitvoering", "Uitvoering"], ["oplevering", "Oplevering"], ["overig", "Overig"]], "opname");
  const s = input("datetime-local"), e = input("datetime-local"), loc = input("text", p.customer?.address || ""), note = input("text");
  return h("div", { class: "beheer-card" }, h("h2", { text: "Planning" }),
    p.appointments.length ? table(["Wat", "Begin", "Eind", "Status", "Door", ""], p.appointments.map((a) => [a.kind, dt(a.starts_at), dt(a.ends_at), a.status, a.proposed_by,
      h("span", {}, a.status !== "bevestigd" ? btn("Bevestigen", async () => { await api("PUT", `/api/admin/appointments/${a.id}`, { status: "bevestigd" }); route(); }, "link-btn") : null,
        a.status !== "geannuleerd" ? btn("Annuleren", async () => { await api("PUT", `/api/admin/appointments/${a.id}`, { status: "geannuleerd" }); route(); }, "link-btn") : null)])) : h("p", { text: "Nog geen afspraken." }),
    h("div", { class: "beheer-grid" }, field("Soort", kind), field("Begin", s), field("Eind", e), field("Locatie", loc), field("Notitie", note)),
    action("Afspraak bevestigen", async () => { await api("POST", `/api/admin/projects/${p.id}/appointments`, { kind: kind.value, startsAt: new Date(s.value).toISOString(), endsAt: e.value ? new Date(e.value).toISOString() : undefined, location: loc.value, note: note.value }); route(); }, "btn btn-primary btn-sm"));
}

function messagesSection(p) {
  const body = textarea("", 3);
  return h("div", { class: "beheer-card" }, h("h2", { text: "Berichten met de klant" }),
    h("ul", { class: "portal-messages" }, p.messages.map((m) => h("li", { class: m.author_type === "staff" ? "me" : "them" }, h("small", { text: `${m.author_type === "staff" ? "Sealcleaning" : "Klant"} · ${dt(m.created_at)}` }), h("p", { text: m.body })))),
    field("Antwoord", body), action("Versturen", async () => { await api("POST", `/api/admin/projects/${p.id}/messages`, { body: body.value }); route(); }, "btn btn-primary btn-sm"));
}

function hoursForm(id) {
  const date = input("date", new Date().toISOString().slice(0, 10)), worker = input("text", me.name), hours = input("text", "", { inputmode: "decimal" }), note = input("text");
  return h("div", { class: "beheer-row" }, field("Datum", date), field("Medewerker", worker), field("Uren", hours), field("Werkzaamheden", note),
    action("Uren boeken", async () => { await api("POST", `/api/admin/projects/${id}/hours`, { date: date.value, worker: worker.value, hours: parseFloat(hours.value.replace(",", ".")), note: note.value }); route(); }));
}

function filesSection(p) {
  const f = input("file", null, { multiple: true, accept: "image/jpeg,image/png,image/webp,image/heic,application/pdf" });
  const vis = h("input", { type: "checkbox" });
  return h("div", { class: "beheer-card" }, h("h2", { text: "Bestanden" }),
    p.files.length ? table(["Bestand", "Grootte", "Zichtbaar voor klant", ""], p.files.map((x) => [h("a", { href: `/api/admin/files/${x.id}`, text: x.filename }), `${nl(x.size / 1024, 0)} kB`, x.customer_visible ? "ja" : "nee",
      btn(x.customer_visible ? "Verbergen" : "Tonen aan klant", async () => { await api("PUT", `/api/admin/files/${x.id}`, { customerVisible: !x.customer_visible }); route(); }, "link-btn")])) : h("p", { text: "Geen bestanden." }),
    field("Bestanden toevoegen", f), h("label", { class: "portal-consent" }, vis, " Zichtbaar in het klantportaal"),
    action("Uploaden", async () => { const fd = new FormData(); for (const x of f.files) fd.append("bestanden", x); fd.append("customerVisible", vis.checked ? "1" : "0"); await api("POST", `/api/admin/projects/${p.id}/files`, fd); route(); }));
}

/* ---------- facturen ---------- */
async function viewInvoices() {
  const list = await api("GET", "/api/admin/invoices");
  app.replaceChildren(h("h1", { text: "Facturen" }),
    h("p", {}, h("a", { href: "/api/admin/export/invoices.csv", text: "Export facturen (CSV)" }), " · ", h("a", { href: "/api/admin/export/hours.csv", text: "Export uren (CSV)" })),
    table(["Nummer", "Soort", "Datum", "Vervalt", "Klant", "Project", "Incl. btw", "Betaald", "Status", ""], list.map((i) => [i.number || "concept", i.kind === "credit" ? "creditnota" : "factuur", d(i.issue_date), d(i.due_date), i.customer || "", i.project || "", euro(i.total_incl), euro(i.paid), i.status, i.project_id ? h("a", { href: `#projecten/${i.project_id}`, text: "Project" }) : ""])));
}


/* ---------- winkel (feature flags, producten, bezorging, kortingscodes, bestellingen) ---------- */
const FLAG_LABELS = { catalog_enabled: "Catalogus tonen", quotes_enabled: "Offertes", checkout_enabled: "Online bestellen openen", coupon_enabled: "Kortingscodes accepteren", payments_enabled: "Online betalen", appointments_enabled: "Afspraken" };
async function viewShop() {
  const s = await api("GET", "/api/admin/shop");
  const owner = me.role === "owner";
  const cents = (v) => (v.value.trim() === "" ? null : Math.round(parseFloat(v.value.replace(/\./g, "").replace(",", ".")) * 100));
  const flags = h("div", { class: "beheer-grid" }, ...s.flags.map((k) => { const cb = h("input", { type: "checkbox", id: `fl-${k}` }); cb.checked = !!s.features[k]; cb.disabled = !owner;
    cb.addEventListener("change", async () => { try { await api("PUT", "/api/admin/shop/features", { [k]: cb.checked }); route(); } catch (e) { cb.checked = !cb.checked; alert(e.message); } });
    return h("label", { class: "facet-option", for: cb.id }, cb, h("span", { text: FLAG_LABELS[k] || k })); }));
  const delivery = s.delivery.map((m) => { const price = input("text", m.priceExclCents == null ? "" : (m.priceExclCents / 100).toFixed(2).replace(".", ","), { inputmode: "decimal", "aria-label": `Prijs ${m.label} excl. btw` }); const on = h("input", { type: "checkbox" }); on.checked = m.enabled;
    return { m, price, on }; });
  const np = { title: input("text"), unit: input("text", "stuks"), category: input("text"), catalogId: input("text"), price: input("text", "", { inputmode: "decimal" }), max: input("text", "", { inputmode: "numeric" }) };
  const vat = select([["21", "21 %"], ["9", "9 %"], ["0", "0 %"]], "21");
  const nc = { code: input("text"), value: input("text", "10"), scopeIds: input("text", "bestrating"), starts: input("text", "", { placeholder: "2026-11-01T00:00" }), ends: input("text", "", { placeholder: "2026-12-01T00:00" }), min: input("text"), maxd: input("text"), total: input("text"), per: input("text", "1") };
  const type = select([["percentage", "Percentage"], ["fixed", "Vast bedrag"], ["free_shipping", "Gratis bezorging"]], "percentage");
  const scope = select([["categories", "Categorieën"], ["products", "Producten (id)"], ["order", "Hele bestelling"]], "categories");
  const act = h("input", { type: "checkbox" });
  app.replaceChildren(h("h1", { text: "Winkel" }),
    msg("Alles hier staat standaard uit. Er is niets te bestellen totdat u zelf de schakelaars aanzet.", false),
    h("div", { class: "beheer-card" }, h("h2", { text: "Status" }), s.state.open ? msg("Bestellen is open.") : h("ul", {}, ...s.state.reasons.map((r) => h("li", { text: r }))), flags,
      h("p", { class: "field-hint", text: "Online betalen werkt pas met een betaalprovider-account (Mollie) en geteste webhook. Kortingscodes en prijzen controleert de server altijd zelf." })),
    h("div", { class: "beheer-card" }, h("h2", { text: "Bezorgen en afhalen" }), h("p", { class: "field-hint", text: "Zonder vastgestelde prijs is een methode niet te kiezen: onbekende kosten worden nooit als € 0 getoond. Afhalen: vul 0 in." }),
      table(["Methode", "Prijs excl. btw (€)", "Aan"], delivery.map(({ m, price, on }) => [m.label, price, on])),
      owner ? action("Opslaan", async () => { await api("PUT", "/api/admin/shop/delivery", { methods: delivery.map(({ m, price, on }) => ({ id: m.id, priceExclCents: cents(price), enabled: on.checked })) }); route(); }, "btn btn-primary btn-sm") : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Producten in de webwinkel" }),
      s.products.length ? table(["Titel", "Eenheid", "Prijs excl.", "Btw", "Actief", "Catalogus-id"], s.products.map((p) => [p.title, p.unit, euro(p.price_excl), `${p.vat_rate} %`, p.active ? "ja" : "nee", p.catalog_id || ""])) : h("p", { text: "Nog geen producten. Voeg alleen artikelen toe waarvoor u de inkoop, voorraad en levering zeker heeft afgesproken." }),
      owner ? h("div", { class: "beheer-grid" }, field("Titel", np.title), field("Eenheid", np.unit), field("Categorie (bijv. bestrating)", np.category), field("Catalogus-id (optioneel)", np.catalogId), field("Verkoopprijs excl. btw (€)", np.price), field("Btw", vat), field("Max. per bestelling", np.max)) : null,
      owner ? action("Product toevoegen (actief)", async () => { await api("POST", "/api/admin/shop/products", { title: np.title.value, unit: np.unit.value, category: np.category.value, catalogId: np.catalogId.value, priceExclCents: cents(np.price), vatRate: Number(vat.value), maxPerOrder: np.max.value || null, active: true }); route(); }, "btn btn-primary btn-sm") : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Kortingscodes" }),
      s.promotions.length ? table(["Code", "Soort", "Waarde", "Bereik", "Periode", "Gebruikt", "Actief"], s.promotions.map((p) => [p.code, p.type, p.type === "percentage" ? `${p.value / 100} %` : p.type === "fixed" ? euro(p.value) : "gratis bezorging", `${p.scope}${p.scopeIds.length ? `: ${p.scopeIds.join(", ")}` : ""}`, `${p.startsAt || "—"} t/m ${p.endsAt || "—"}`, `${p.usesCount}${p.maxUsesTotal != null ? ` / ${p.maxUsesTotal}` : ""}`, p.active ? "ja" : "nee"])) : h("p", { text: "Nog geen codes." }),
      owner ? [h("div", { class: "beheer-grid" }, field("Code", nc.code), field("Soort", type), field("Waarde (basispunten 1000 = 10 %, of centen)", nc.value), field("Bereik", scope), field("Categorieën/product-id's (komma)", nc.scopeIds), field("Start (Amsterdam)", nc.starts), field("Einde (Amsterdam)", nc.ends), field("Minimum excl. (centen)", nc.min), field("Max. voordeel (centen)", nc.maxd), field("Max. totaal gebruik", nc.total), field("Max. per klant", nc.per)),
        h("label", { class: "facet-option" }, act, " Direct actief"),
        h("p", { class: "field-hint", text: "Let op de marge: een code mag nooit onder uw kostprijs uitkomen. Commerciële voorwaarden bevestigt u zelf; er staat niets standaard actief." }),
        action("Code opslaan", async () => { await api("POST", "/api/admin/shop/promotions", { code: nc.code.value, type: type.value, value: Number(nc.value.value), scope: scope.value, scopeIds: nc.scopeIds.value.split(",").map((x) => x.trim()).filter(Boolean), startsAt: nc.starts.value || null, endsAt: nc.ends.value || null, minSubtotalCents: nc.min.value, maxDiscountCents: nc.maxd.value, maxUsesTotal: nc.total.value, maxUsesPerCustomer: nc.per.value, active: act.checked }); route(); }, "btn btn-primary btn-sm")] : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Bestellingen" }),
      s.orders.length ? table(["Referentie", "Status", "Naam", "E-mail", "Levering", "Totaal incl.", "Besteld", "Betaald"], s.orders.map((o) => [o.ref, o.status, o.name, o.email, o.delivery_method, euro(o.total_incl), dt(o.created_at), o.paid_at ? dt(o.paid_at) : "—"])) : h("p", { text: "Nog geen bestellingen." })));
}

/* ---------- instellingen ---------- */
async function viewSettings() {
  const s = await api("GET", "/api/admin/settings");
  meta.iban = s.company.iban;
  const owner = me.role === "owner";
  const c = s.calc;
  const pct = (k) => input("text", c[k] ?? "", { inputmode: "decimal", placeholder: "niet ingesteld" });
  const money = (k) => input("text", c[k] == null ? "" : (c[k] / 100).toFixed(2).replace(".", ","), { inputmode: "decimal", placeholder: "niet ingesteld" });
  const F = { materialMarkupPct: pct("materialMarkupPct"), machineMarkupPct: pct("machineMarkupPct"), wasteMarkupPct: pct("wasteMarkupPct"), overheadPct: pct("overheadPct"), riskPct: pct("riskPct"), laborCostRateCents: money("laborCostRateCents"), transportPerDayCents: money("transportPerDayCents"), minimumOrderExclCents: money("minimumOrderExclCents") };
  const crew = input("number", c.crewSize, { min: "1", max: "10" });
  const toCents = (v) => (v.value.trim() === "" ? null : Math.round(parseFloat(v.value.replace(/\./g, "").replace(",", ".")) * 100));
  const toPct = (v) => (v.value.trim() === "" ? null : parseFloat(v.value.replace(",", ".")));
  const normInputs = Object.entries(s.defaultNorms).map(([k, def]) => [k, def, input("text", nl(c.norms?.[k]?.hoursPerUnit ?? def.hoursPerUnit, 3), { inputmode: "decimal" }), !!c.norms?.[k]]);
  const co = s.company;
  const CO = { offerValidityDays: input("number", co.offerValidityDays ?? ""), paymentTermDays: input("number", co.paymentTermDays ?? ""), iban: input("text", co.iban), quotePrefix: input("text", co.quotePrefix), invoicePrefix: input("text", co.invoicePrefix) };
  const R = { leadDays: input("number", s.retention.leadDays ?? ""), applicationDays: input("number", s.retention.applicationDays ?? "") };
  const supName = input("text"), supContact = input("text");
  const feedOut = h("div"), backupOut = h("div");

  app.replaceChildren(h("h1", { text: "Instellingen" }), owner ? null : msg("Alleen de eigenaar kan instellingen wijzigen.", true),
    h("div", { class: "beheer-card" }, h("h2", { text: "Calculatie" }), h("p", { class: "field-hint", text: "Leeg = niet ingesteld; de calculatie markeert dat en verzint niets. Opslag is op kostprijs (25% opslag = 20% brutomarge)." }),
      h("div", { class: "beheer-grid" }, field("Verkoopuurtarief", input("text", euro(c.laborRateExclCents), { disabled: true }), "Bevestigd € 60,00 excl. btw"),
        field("Interne kostprijs per uur (€)", F.laborCostRateCents), field("Opslag materiaal %", F.materialMarkupPct), field("Opslag machines %", F.machineMarkupPct), field("Opslag afvoer %", F.wasteMarkupPct),
        field("Algemene kosten %", F.overheadPct), field("Risico %", F.riskPct), field("Transport per werkdag (€)", F.transportPerDayCents), field("Minimumorder excl. (€)", F.minimumOrderExclCents), field("Ploeggrootte", crew)),
      h("h3", { text: "Productiviteitsnormen (uren per eenheid)" }),
      table(["Werk", "Uren/eenh.", "Status", "Toelichting"], normInputs.map(([k, def, inp, own]) => [k, inp, own ? "bevestigd" : "voorbeeld", def.note || ""])),
      owner ? action("Calculatie-instellingen opslaan (normen worden bevestigd)", async () => {
        const norms = Object.fromEntries(normInputs.map(([k, , inp]) => [k, { hoursPerUnit: parseFloat(inp.value.replace(",", ".")) }]));
        await api("PUT", "/api/admin/settings/calc", { ...Object.fromEntries(Object.entries(F).map(([k, v]) => [k, k.endsWith("Cents") ? toCents(v) : toPct(v)])), crewSize: Number(crew.value), norms }); route();
      }, "btn btn-primary btn-sm") : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Inkoopprijzen (gaan vóór openbare marktprijzen)" }),
      table(["Artikel", "Prijs excl.", "Leverancier", "SKU", "Prijsdatum", ""], s.materialKeys.map((k) => {
        const cur = s.purchasePrices.find((x) => x.key === k) || {};
        const pr = input("text", cur.amount_excl != null ? (cur.amount_excl / 100).toFixed(2).replace(".", ",") : "", { inputmode: "decimal", "aria-label": `Prijs ${k}` });
        const sup = select([["", "—"], ...s.suppliers.map((x) => [x.id, x.name])], cur.supplier_id || "");
        const sku = input("text", cur.sku || ""), dte = input("date", cur.observed_at || new Date().toISOString().slice(0, 10));
        return [k, pr, sup, sku, dte, owner ? action("Opslaan", async () => { await api("PUT", `/api/admin/purchase-prices/${k}`, { amountExcl: pr.value.trim() === "" ? null : toCents(pr), supplierId: sup.value || null, sku: sku.value, observedAt: dte.value }); route(); }) : ""];
      })),
      h("h3", { text: "Leveranciers" }), h("ul", {}, s.suppliers.map((x) => h("li", {}, `${x.name} — ${x.contact || ""} `, owner ? btn("Verwijderen", async () => { await api("DELETE", `/api/admin/suppliers/${x.id}`); route(); }, "link-btn") : null))),
      owner ? h("div", { class: "beheer-row" }, field("Naam", supName), field("Contact", supContact), action("Leverancier toevoegen", async () => { await api("POST", "/api/admin/suppliers", { name: supName.value, contact: supContact.value }); route(); })) : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Documentgegevens" }), h("div", { class: "beheer-grid" }, field("Geldigheid offerte (dagen)", CO.offerValidityDays), field("Betaaltermijn (dagen)", CO.paymentTermDays), field("IBAN", CO.iban), field("Voorvoegsel offertes", CO.quotePrefix), field("Voorvoegsel facturen", CO.invoicePrefix)),
      owner ? action("Opslaan", async () => { await api("PUT", "/api/admin/settings/company", Object.fromEntries(Object.entries(CO).map(([k, v]) => [k, v.value]))); route(); }, "btn btn-primary btn-sm") : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Bewaartermijnen (AVG)" }), h("p", { class: "field-hint", text: "Leeg = niet automatisch verwijderen. Aanvragen die een project zijn geworden blijven bewaard." }),
      h("div", { class: "beheer-grid" }, field("Aanvragen zonder project (dagen)", R.leadDays), field("Sollicitaties / samenwerkingsaanvragen (dagen)", R.applicationDays)),
      owner ? action("Opslaan en direct toepassen", async () => { const r = await api("PUT", "/api/admin/settings/retention", { leadDays: R.leadDays.value, applicationDays: R.applicationDays.value }); alert(`${r.removedNow} oude aanvraag/aanvragen verwijderd.`); route(); }, "btn btn-primary btn-sm") : null),
    h("div", { class: "beheer-card" }, h("h2", { text: "Agenda-koppeling" }), h("p", { class: "field-hint", text: "Een geheime agenda-URL die u in Google Agenda, Apple Agenda of Outlook toevoegt (abonneren). Vernieuwen maakt de oude ongeldig." }),
      owner ? action("Agenda-URL maken/vernieuwen", async () => { const r = await api("POST", "/api/admin/calendar/feed", {}); feedOut.replaceChildren(h("input", { type: "text", readonly: true, value: r.url, class: "design-share-input", "aria-label": "Agenda-URL" }), msg(r.note)); }) : null, feedOut),
    h("div", { class: "beheer-card" }, h("h2", { text: "Back-up en koppelingen" }), table(["Onderdeel", "Status"], Object.entries(s.integrations)),
      owner ? action("Nu een back-up maken", async () => { const r = await api("POST", "/api/admin/backup", {}); backupOut.replaceChildren(msg(`Back-up gemaakt: ${r.path}`)); }) : null, backupOut,
      h("p", { class: "field-hint", text: `Voorwaardenversie bij digitaal akkoord: ${s.termsVersion}` })),
    owner ? await usersCard() : null);
}

async function usersCard() {
  const users = await api("GET", "/api/admin/users");
  const email = input("email"), name = input("text"), pw = input("password", "", { autocomplete: "new-password" });
  const role = select([["staff", "Medewerker"], ["owner", "Eigenaar"]], "staff");
  return h("div", { class: "beheer-card" }, h("h2", { text: "Gebruikers" }),
    table(["Naam", "E-mail", "Rol", "2FA", "Status", ""], users.map((u) => [u.name, u.email, u.role, u.totp_enabled ? "actief" : "nog instellen", u.disabled ? "geblokkeerd" : "actief",
      btn(u.disabled ? "Deblokkeren" : "Blokkeren", async () => { await api("PUT", `/api/admin/users/${u.id}`, { disabled: !u.disabled }); route(); }, "link-btn")])),
    h("div", { class: "beheer-grid" }, field("Naam", name), field("E-mail", email), field("Tijdelijk wachtwoord (min. 12 tekens)", pw), field("Rol", role)),
    action("Gebruiker toevoegen", async () => { await api("POST", "/api/admin/users", { name: name.value, email: email.value, password: pw.value, role: role.value }); route(); }, "btn btn-primary btn-sm"),
    h("p", { class: "field-hint", text: "Nieuwe gebruikers stellen bij hun eerste login zelf tweestapsverificatie in." }));
}

/* ---------- e-mail, audit, account ---------- */
async function viewEmail() {
  const list = await api("GET", "/api/admin/outbox");
  app.replaceChildren(h("h1", { text: "Uitgaande e-mail" }), msg(meta.integrations.email),
    action("Wachtrij nu verwerken", async () => { const r = await api("POST", "/api/admin/outbox/process", {}); alert(`${r.sent} verzonden.`); route(); }),
    ...list.map((m) => h("details", { class: "beheer-card" }, h("summary", {}, h("span", { class: `badge ${m.status === "sent" || m.status === "manual" ? "badge-ok" : m.status === "failed" ? "badge-block" : "badge-warn"}`, text: { queued: "in wachtrij", sent: "verzonden", failed: "mislukt", manual: "handmatig verstuurd" }[m.status] }), ` ${dt(m.created_at)} · ${m.to_addr} · ${m.subject}`),
      m.last_error ? msg(m.last_error, true) : null, h("pre", { class: "mail-body", text: m.body_text }),
      m.status !== "sent" && m.status !== "manual" ? action("Ik heb dit zelf verstuurd", async () => { await api("POST", `/api/admin/outbox/${m.id}/manual`, {}); route(); }) : null)));
}
async function viewAudit() {
  const list = await api("GET", "/api/admin/audit");
  app.replaceChildren(h("h1", { text: "Auditlog" }), table(["Moment", "Wie", "Actie", "Referentie"], list.map((a) => [dt(a.at), a.actor, a.action, a.ref || ""])));
}
function viewAccount() {
  const cur = input("password", "", { autocomplete: "current-password" }), nxt = input("password", "", { autocomplete: "new-password" });
  app.replaceChildren(h("h1", { text: "Mijn account" }), h("p", { text: `${me.name} · ${me.email} · ${me.role} · 2FA ${me.totpEnabled ? "actief" : "niet actief"}` }),
    h("div", { class: "beheer-card" }, h("h2", { text: "Wachtwoord wijzigen" }), field("Huidig wachtwoord", cur), field("Nieuw wachtwoord (min. 12 tekens)", nxt),
      action("Wijzigen (andere sessies worden uitgelogd)", async () => { await api("POST", "/api/auth/password", { current: cur.value, next: nxt.value }); alert("Wachtwoord gewijzigd."); }, "btn btn-primary btn-sm")));
}

start();
