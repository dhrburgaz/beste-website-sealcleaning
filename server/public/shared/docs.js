/**
 * Klantdocumenten (offerte, factuur, creditnota) uit de opgeslagen momentopname.
 * Bevat per definitie geen interne gegevens: de server levert alleen de snapshot.
 */
import { h, euro, nl, d } from "./ui.js";

function company(c) {
  return h("div", { class: "doc-company" }, h("img", { src: "/images/branding/logo.webp", alt: "", width: "64", height: "64" }),
    h("div", {}, h("strong", { text: c.businessName || "Sealcleaning" }), h("br"), `${c.addressLine1 || ""}, ${c.addressLine2 || ""}`, h("br"),
      `${c.phoneDisplay || ""} · ${c.email || ""}`, h("br"), `KvK ${c.kvk || "—"} · btw ${c.btw || "—"}`));
}
function linesTable(lines) {
  return h("table", { class: "price-table doc-table" },
    h("thead", {}, h("tr", {}, ["Omschrijving", "Aantal", "Prijs/eenh. excl.", "Totaal excl."].map((t) => h("th", { scope: "col", text: t })))),
    h("tbody", {}, lines.map((l) => h("tr", {}, h("td", { text: l.label }), h("td", { class: "num", text: `${nl(l.qty)} ${l.unit}` }), h("td", { class: "num", text: euro(l.unitSaleExclCents) }), h("td", { class: "num", text: euro(l.saleExclCents) })))));
}
function totals(excl, vatRate, vat, incl) {
  return h("dl", { class: "beheer-totals" }, h("dt", { text: "Totaal excl. btw" }), h("dd", { text: euro(excl) }), h("dt", { text: `Btw ${vatRate}%` }), h("dd", { text: euro(vat) }), h("dt", { text: "Totaal incl. btw" }), h("dd", { text: euro(incl) }));
}

export function quoteDoc(s, { customer, status } = {}) {
  const doc = h("article", { class: "doc" });
  if (status === "concept" || s.readiness === "incompleet") doc.appendChild(h("p", { class: "doc-watermark", text: status === "concept" ? "CONCEPT — nog niet verstuurd" : "Let op: enkele posten zijn nog op aanvraag" }));
  doc.append(company(s.company), h("h1", { text: `Offerte ${s.number}${s.version > 1 ? ` (versie ${s.version})` : ""}` }),
    h("p", { text: `Project: ${s.projectTitle} (${s.projectRef}) · Datum: ${d(s.date)}${s.validUntil ? ` · Geldig tot: ${d(s.validUntil)}` : ""}` }));
  if (customer) doc.appendChild(h("p", { class: "doc-customer" }, h("strong", { text: "Aan: " }), customer));
  if (s.poRef) doc.appendChild(h("p", { text: `Uw referentie: ${s.poRef}` }));
  doc.append(linesTable(s.lines), totals(s.totals.excl, s.totals.vatRate, s.totals.vat, s.totals.incl));
  if (s.onRequest?.length) doc.appendChild(h("p", { class: "doc-note", text: `Nog niet in dit bedrag (op aanvraag na opname): ${s.onRequest.join(", ")}.` }));
  doc.append(h("p", { class: "doc-note", text: `Prijssoort: ${s.priceTypeLabel}. ${s.priceTypeText}` }),
    h("h2", { text: "Niet inbegrepen" }), h("p", { class: "doc-note", text: s.excluded }));
  if (s.customerWork) doc.append(h("h2", { text: "Door de opdrachtgever" }), h("p", { class: "doc-note", text: s.customerWork }));
  if (s.assumptions?.length) doc.append(h("h2", { text: "Uitgangspunten" }), h("ul", {}, s.assumptions.map((a) => h("li", { text: a }))));
  doc.appendChild(h("p", { class: "doc-note", text: `Op deze offerte zijn de algemene voorwaarden van Sealcleaning van toepassing (versie: ${s.termsVersion}; sealcleaning.nl/voorwaarden). Meer- en minderwerk alleen na overleg en akkoord.` }));
  return doc;
}

export function invoiceDoc(i, { company: c, customer, iban } = {}) {
  const doc = h("article", { class: "doc" });
  doc.append(company(c || {}), h("h1", { text: `${i.kind === "credit" ? "Creditnota" : "Factuur"} ${i.number}` }),
    h("p", { text: `Factuurdatum: ${d(i.issueDate)} · Prestatiedatum: ${d(i.deliveryDate)}${i.dueDate ? ` · Vervaldatum: ${d(i.dueDate)}` : ""}` }));
  if (customer) doc.appendChild(h("p", { class: "doc-customer" }, h("strong", { text: "Aan: " }), customer));
  if (i.poRef) doc.appendChild(h("p", { text: `Uw referentie: ${i.poRef}` }));
  doc.append(linesTable(i.lines), totals(i.totalExcl, i.vatRate, i.vat, i.totalIncl));
  if (i.kind === "credit") doc.appendChild(h("p", { class: "doc-note", text: `Reden: ${i.reason}` }));
  else doc.appendChild(h("p", { class: "doc-note", text: `Graag betalen vóór ${d(i.dueDate)} op ${iban || "[IBAN]"} t.n.v. ${(c && c.businessName) || "Sealcleaning"}, o.v.v. ${i.number}.` }));
  return doc;
}

/** Print één document zonder de rest van de pagina. */
export function printDocument(node) {
  let root = document.getElementById("print-root");
  if (!root) { root = h("div", { id: "print-root" }); document.body.appendChild(root); }
  root.replaceChildren(node);
  document.body.classList.add("printing");
  const done = () => { document.body.classList.remove("printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  window.print();
}
