/** Klantportaal: projectstatus, offerte + digitaal akkoord, facturen, planning, berichten, bestanden, toestemmingen. */
import { h, api, euro, dt, d, field, input, textarea, msg, btn, action, table } from "/shared/ui.js";
import { quoteDoc, invoiceDoc, printDocument } from "/shared/docs.js";

const app = document.querySelector("[data-app]");
const logoutBtn = document.querySelector("[data-logout]");
logoutBtn.addEventListener("click", async () => { await api("POST", "/api/portal/logout", {}); location.reload(); });

const STEPS = ["Aanvraag", "Opname gepland", "Offerte in voorbereiding", "Offerte verstuurd", "Akkoord", "Ingepland", "In uitvoering", "Opgeleverd", "Gefactureerd", "Betaald"];

async function start() {
  const m = /#token=([A-Za-z0-9_-]+)/.exec(location.hash);
  if (m) {
    history.replaceState(null, "", location.pathname + location.search);
    try { await api("POST", "/api/portal/login", { token: m[1] }); }
    catch (e) { return renderLogin(e.message); }
  }
  try { renderHome(await api("GET", "/api/portal/me")); }
  catch (e) { if (e.status === 401) renderLogin(); else app.replaceChildren(msg(e.message, true)); }
}

function renderLogin(error) {
  logoutBtn.hidden = true;
  const email = input("email", "", { autocomplete: "email", required: true });
  const out = h("div");
  if (error) out.appendChild(msg(error, true));
  app.replaceChildren(h("form", { class: "beheer-lock", onsubmit: async (e) => {
    e.preventDefault();
    try { const r = await api("POST", "/api/portal/login-request", { email: email.value }); out.replaceChildren(msg(r.message)); }
    catch (err) { out.replaceChildren(msg(err.message, true)); }
  } },
    h("h1", { text: "Klantportaal" }),
    h("p", { class: "lede", text: "Bekijk uw project, offerte, planning en facturen. U logt in met een persoonlijke link die we u per e-mail sturen — een wachtwoord is niet nodig." }),
    field("Uw e-mailadres", email),
    h("button", { type: "submit", class: "btn btn-primary", text: "Stuur mij een inloglink" }), out,
    h("p", { class: "field-hint", text: "Liever zonder portaal? Bel of mail ons gewoon; u krijgt dezelfde service." })));
}

function renderHome(me) {
  logoutBtn.hidden = false;
  const parts = [h("h1", { text: `Welkom, ${me.name}` })];
  if (!me.projects.length) parts.push(h("p", { text: "Er staan nog geen projecten op uw naam." }));
  for (const p of me.projects) parts.push(h("div", { class: "beheer-card" }, h("h2", { text: p.title }), h("p", { text: `${p.ref} · status: ${p.status}` }), btn("Bekijk project", () => renderProject(p.id), "btn btn-primary btn-sm")));
  const consentKinds = [["projectfoto-publicatie", "Foto's van mijn tuin mogen (zonder herkenbare persoonsgegevens) als projectvoorbeeld worden gebruikt"], ["onderhoudsherinnering", "Ik wil een herinnering ontvangen voor periodiek onderhoud"]];
  const latest = (k) => me.consents.find((c) => c.kind === k);
  parts.push(h("div", { class: "beheer-card" }, h("h2", { text: "Mijn toestemmingen" }),
    h("p", { class: "field-hint", text: "Afzonderlijk te geven en altijd in te trekken; het heeft geen invloed op uw offerte of onze service." }),
    consentKinds.map(([k, label]) => {
      const cb = h("input", { type: "checkbox" }); cb.checked = !!latest(k)?.granted;
      cb.addEventListener("change", async () => { await api("POST", "/api/portal/consents", { kind: k, granted: cb.checked }); });
      return h("label", { class: "portal-consent" }, cb, " ", label);
    }),
    h("p", {}, h("a", { href: "/api/portal/export", text: "Download mijn gegevens (inzage)" }), " · ", h("a", { href: "https://sealcleaning.nl/privacy/", text: "Privacyverklaring" }))));
  app.replaceChildren(...parts);
}

async function renderProject(id) {
  const p = await api("GET", `/api/portal/projects/${id}`);
  const back = btn("← Alle projecten", async () => renderHome(await api("GET", "/api/portal/me")));
  const custLine = p.customer ? `${p.customer.name}${p.customer.address ? `, ${p.customer.address}` : ""}` : "";
  const idx = STEPS.indexOf(p.status);
  const parts = [back, h("h1", { text: p.title }), h("p", { text: `Projectnummer ${p.ref}` }),
    h("ol", { class: "portal-steps", "aria-label": "Voortgang" }, STEPS.map((s, i) => h("li", { class: i < idx ? "done" : i === idx ? "current" : "", "aria-current": i === idx ? "step" : null, text: s })))];

  // Offertes
  for (const q of p.quotes) {
    const card = h("div", { class: "beheer-card" }, h("h2", { text: `Offerte ${q.number} — ${q.status}` }), quoteDoc(q.document, { customer: custLine }),
      h("div", { class: "btn-row" }, btn("Printen / opslaan als PDF", () => printDocument(quoteDoc(q.document, { customer: custLine })))));
    if (q.status === "verstuurd") card.appendChild(acceptForm(q, id));
    if (q.status === "akkoord") card.appendChild(msg(`Akkoord gegeven op ${dt(q.acceptedAt)}. Een bevestiging is per e-mail verstuurd.`));
    parts.push(card);
  }

  // Facturen
  for (const i of p.invoices) {
    const open = i.totalIncl - i.paid;
    const card = h("div", { class: "beheer-card" }, h("h2", { text: `${i.kind === "credit" ? "Creditnota" : "Factuur"} ${i.number} — ${euro(i.totalIncl)}${i.kind === "invoice" ? ` · ${i.status === "betaald" ? "betaald" : `open: ${euro(open)}`}` : ""}` }),
      h("div", { class: "btn-row" }, btn("Bekijk / print", () => printDocument(invoiceDoc(i, { company: p.company, customer: custLine, iban: p.iban })))));
    if (i.kind === "invoice" && i.status === "verstuurd" && open > 0) {
      card.appendChild(p.payOnline
        ? action("Online betalen (iDEAL e.a.)", async () => { const r = await api("POST", `/api/portal/invoices/${i.id}/pay`, {}); location.href = r.checkoutUrl; }, "btn btn-primary btn-sm")
        : msg(`Betalen via bankoverschrijving: ${euro(open)} op ${p.iban || "het IBAN op de factuur"} o.v.v. ${i.number}, vóór ${d(i.dueDate)}.`));
    }
    parts.push(card);
  }

  // Planning
  const when = input("datetime-local", "", { required: true });
  const note = input("text", "", { placeholder: "Bijv. liefst ochtend" });
  const planOut = h("div");
  parts.push(h("div", { class: "beheer-card" }, h("h2", { text: "Planning" }),
    p.appointments.length ? table(["Wat", "Wanneer", "Status"], p.appointments.map((a) => [a.kind, `${dt(a.starts_at)} – ${new Date(a.ends_at).toLocaleTimeString("nl-NL", { timeStyle: "short", timeZone: "Europe/Amsterdam" })}`, a.status === "voorstel" ? "uw voorstel (nog niet bevestigd)" : "bevestigd"])) : h("p", { text: "Nog geen afspraken." }),
    h("p", {}, h("a", { href: "/api/portal/calendar.ics", text: "Bevestigde afspraken in mijn agenda zetten (.ics)" })),
    h("form", { class: "beheer-row", onsubmit: async (e) => { e.preventDefault(); try { await api("POST", `/api/portal/projects/${id}/appointments`, { startsAt: new Date(when.value).toISOString(), note: note.value }); renderProject(id); } catch (err) { planOut.replaceChildren(msg(err.message, true)); } } },
      field("Voorkeursmoment voorstellen", when), field("Toelichting", note), h("button", { type: "submit", class: "btn btn-secondary btn-sm", text: "Voorstellen" })),
    h("p", { class: "field-hint", text: "Een voorstel is nog geen afspraak; wij bevestigen het moment persoonlijk." }), planOut));

  // Berichten
  const body = textarea("", 3);
  const topic = h("select", {}, h("option", { value: "", text: "Vraag of opmerking" }), h("option", { value: "wijziging", text: "Wijzigingsverzoek" }), h("option", { value: "service", text: "Serviceverzoek (onderhoud/herstel)" }), h("option", { value: "klacht", text: "Klacht" }), h("option", { value: "verplaatsen", text: "Afspraak verplaatsen" }));
  const msgOut = h("div");
  parts.push(h("div", { class: "beheer-card" }, h("h2", { text: "Berichten" }),
    h("ul", { class: "portal-messages" }, p.messages.map((m) => h("li", { class: m.author_type === "customer" ? "me" : "them" }, h("small", { text: `${m.author_type === "customer" ? "U" : "Sealcleaning"} · ${dt(m.created_at)}` }), h("p", { text: m.body })))),
    field("Soort bericht", topic), field("Uw bericht", body),
    action("Versturen", async () => { await api("POST", `/api/portal/projects/${id}/messages`, { body: body.value, topic: topic.value }); renderProject(id); }, "btn btn-primary btn-sm"),
    h("p", { class: "field-hint", text: "Een wijzigingsverzoek is geen opdracht: wij reageren met een voorstel (en eventueel een nieuwe offerteversie). Bij een klacht of serviceverzoek kunt u hieronder foto's toevoegen; u ontvangt een reactie via dit portaal." }), msgOut));

  // Bestanden
  const files = input("file", null, { multiple: true, accept: "image/jpeg,image/png,image/webp,image/heic,application/pdf" });
  parts.push(h("div", { class: "beheer-card" }, h("h2", { text: "Foto's en documenten" }),
    p.files.length ? h("ul", {}, p.files.map((f) => h("li", {}, h("a", { href: `/api/portal/files/${f.id}`, text: f.filename })))) : h("p", { text: "Nog geen bestanden." }),
    field("Foto's toevoegen (max. 5, jpg/png/webp/heic/pdf, 8 MB per bestand)", files),
    action("Uploaden", async () => { const fd = new FormData(); for (const f of files.files) fd.append("bestanden", f); await api("POST", `/api/portal/projects/${id}/files`, fd); renderProject(id); })));

  if (p.timeline.length) parts.push(h("details", { class: "beheer-card" }, h("summary", { text: "Projecthistorie" }), h("ul", {}, p.timeline.map((e) => h("li", { text: `${dt(e.at)} · ${e.status || e.kind}` })))));
  app.replaceChildren(...parts);
  window.scrollTo(0, 0);
}

function acceptForm(q, projectId) {
  const name = input("text", "", { autocomplete: "name", required: true });
  const terms = h("input", { type: "checkbox", required: true });
  const early = h("input", { type: "checkbox" });
  const withdraw = h("input", { type: "checkbox" });
  const out = h("div");
  const reason = textarea("", 2);
  const question = textarea("", 2);
  return h("div", { class: "portal-accept" },
    h("h3", { text: "Akkoord geven" }),
    field("Uw volledige naam", name),
    h("label", { class: "portal-consent" }, terms, " Ik ga akkoord met deze offerte (versie ", String(q.version), ") en de ", h("a", { href: "https://sealcleaning.nl/voorwaarden/", target: "_blank", rel: "noopener", text: "algemene voorwaarden" }), "."),
    h("label", { class: "portal-consent" }, withdraw, " Ik heb de informatie over de bedenktijd gelezen (voorwaarden, artikel 22)."),
    h("label", { class: "portal-consent" }, early, " Ik wil dat het werk binnen de bedenktijd mag starten. (Optioneel; bij herroepen betaalt u dan naar rato voor het al uitgevoerde werk.)"),
    action("Akkoord geven", async () => {
      await api("POST", `/api/portal/quotes/${q.id}/accept`, { name: name.value, agreeTerms: terms.checked, earlyStart: early.checked, withdrawalInfoRead: withdraw.checked, snapshotHash: q.hash });
      renderProject(projectId);
    }, "btn btn-primary"),
    out,
    h("details", {}, h("summary", { text: "Vraag stellen over deze offerte" }), field("Uw vraag", question),
      action("Vraag versturen", async () => { await api("POST", `/api/portal/projects/${projectId}/messages`, { body: question.value, quoteNumber: q.number }); renderProject(projectId); })),
    h("details", {}, h("summary", { text: "Offerte afwijzen" }), field("Reden (optioneel)", reason),
      action("Afwijzen", async () => { if (confirm("Weet u zeker dat u deze offerte wilt afwijzen?")) { await api("POST", `/api/portal/quotes/${q.id}/decline`, { reason: reason.value }); renderProject(projectId); } })));
}

start();
