/**
 * Interne calculatiemotor (V6-05, ch.38-39). Rekent per regel afzonderlijk:
 * arbeid (bevestigd verkooptarief), materiaal, machines, afvoer, transport,
 * opslag/marge, algemene kosten, risico en btw. Puur en deterministisch:
 * dezelfde invoer geeft altijd dezelfde uitkomst.
 *
 * Herkomst per regel (`basis`):
 *  - "purchase": inkoopprijs ingevoerd door de eigenaar (met leverancier/datum)
 *  - "market":   openbare consumentenprijs uit data/price-sources.json —
 *                geen bewezen inkoopprijs; als kostprijsbenadering gemarkeerd
 *  - "confirmed"/"example": arbeid met bevestigde of voorbeeldnorm
 *  - "missing":  geen prijs → regel "op aanvraag", offerte incompleet
 * De motor verzendt niets en bepaalt geen definitieve prijs: de uitkomst is
 * een voorstel dat een mens controleert en goedkeurt.
 */
import { DEFAULT_SETTINGS, DEFAULT_NORMS, MATERIAL_LINKS } from "../../data/calc-defaults.js";
import { getPavingProduct } from "../../data/materials.js";

const round = (c) => Math.round(c);

export function mergeSettings(owner) {
  const s = { ...DEFAULT_SETTINGS, ...(owner || {}) };
  s.norms = { ...(owner?.norms || {}) };
  return s;
}

function normFor(key, settings) {
  const own = settings.norms[key];
  if (own && Number.isFinite(own.hoursPerUnit)) return { hoursPerUnit: own.hoursPerUnit, status: "confirmed", note: own.note };
  return DEFAULT_NORMS[key] || null;
}

/** Prijs excl. btw per eenheid uit een marktregel, met staffel. */
function marketUnitExcl(row, qty, vatRate) {
  let cents = row.amountCents;
  for (const t of row.quantityTiers || []) if (qty >= t.minQuantity) cents = t.amountCents;
  if (row.vatIncluded === true) return { cents: cents / (1 + (row.vatRate ?? vatRate) / 100), vatKnown: true };
  if (row.vatIncluded === false) return { cents, vatKnown: true };
  return { cents: cents / (1 + vatRate / 100), vatKnown: false }; // btw-basis onbekend: als incl. behandeld, gemarkeerd
}

function resolveMarketRows(row, link, project, rows) {
  if (link.source === "tile") {
    const all = rows.filter((r) => r.tileLengthMm === row.meta?.tileLengthMm && r.tileWidthMm === row.meta?.tileWidthMm);
    const product = row.meta?.productId ? getPavingProduct(row.meta.productId) : null;
    const chosen = product ? all.find((r) => r.id === product.priceSourceId) : all.filter((r) => r.status !== "stale").sort((a, b) => a.amountCents - b.amountCents)[0];
    return { chosen: chosen || null, band: all };
  }
  if (link.source === "fence-panel") {
    const ok = ["generic-wood", "generic-wood-concrete"].includes(row.meta?.systemId) && row.meta?.heightMm === 1800;
    const r = ok ? rows.find((x) => x.id === link.priceSourceId) : null;
    return { chosen: r || null, band: r ? [r] : [] };
  }
  if (link.source === "price") {
    const r = rows.find((x) => x.id === link.priceSourceId) || null;
    return { chosen: r, band: r ? [r] : [] };
  }
  return { chosen: null, band: [] };
}

/**
 * @param {{takeoffRows:Array, project:object, settings?:object, priceSources:{rows:Array}, purchasePrices?:Object<string,{amountExclCents:number,supplier?:string,observedAt?:string,sku?:string}>}} input
 */
export function calculate({ takeoffRows, settings: ownerSettings, priceSources, purchasePrices = {} }) {
  const settings = mergeSettings(ownerSettings);
  const rows = priceSources?.rows || [];
  const lines = [];
  const flags = [];
  const flag = (level, text) => { if (!flags.some((f) => f.text === text)) flags.push({ level, text }); };
  const markupFor = (kind) => ({ material: settings.materialMarkupPct, machine: settings.machineMarkupPct, waste: settings.wasteMarkupPct }[kind]);
  let laborHours = 0;

  for (const t of takeoffRows) {
    // Arbeid
    const norm = normFor(t.key, settings);
    if (norm) {
      const hours = Math.round(t.qty * norm.hoursPerUnit * 100) / 100;
      laborHours += hours;
      lines.push({
        group: t.group, kind: "labor", key: t.key, label: `Arbeid: ${t.label}`, qty: hours, unit: "uur",
        unitSaleExclCents: settings.laborRateExclCents,
        saleExclCents: round(hours * settings.laborRateExclCents),
        costExclCents: settings.laborCostRateCents != null ? round(hours * settings.laborCostRateCents) : null,
        basis: norm.status, note: `${t.qty} ${t.unit} × ${norm.hoursPerUnit} u/${t.unit}${norm.note ? ` (${norm.note})` : ""}`
      });
      if (norm.status === "example") flag("warn", `Voorbeeldnorm gebruikt voor "${t.label}" — bevestig of pas aan in Instellingen.`);
    } else if (["fence.repair"].includes(t.key) || t.key.startsWith("remove.item.tree")) {
      lines.push({ group: t.group, kind: "labor", key: t.key, label: `Arbeid: ${t.label}`, qty: t.qty, unit: t.unit, saleExclCents: null, costExclCents: null, basis: "missing", note: "Op aanvraag na beoordeling ter plaatse" });
      flag("block", `"${t.label}" kan pas na beoordeling worden geprijsd.`);
    }

    // Materiaal / machine / afvoer
    const link = MATERIAL_LINKS[t.key];
    if (!link) continue;
    const own = purchasePrices[t.key];
    let unitCost = null, basis = "missing", source = null, band = [];
    const market = resolveMarketRows(t, link, null, rows);
    band = market.band;
    if (own && Number.isFinite(own.amountExclCents)) {
      unitCost = own.amountExclCents; basis = "purchase";
      source = [own.supplier, own.sku, own.observedAt].filter(Boolean).join(" · ") || "eigen inkoop";
      if (own.observedAt && (Date.now() - Date.parse(own.observedAt)) / 86400000 > 30) flag("warn", `Inkoopprijs "${t.label}" is ouder dan 30 dagen — controleer bij de leverancier.`);
    } else {
      const res = market;
      if (res.chosen) {
        const m = marketUnitExcl(res.chosen, t.qty, settings.vatRate);
        unitCost = m.cents; basis = "market";
        source = `${res.chosen.productLabel} — ${res.chosen.sourceUrl} (${res.chosen.observedAt})`;
        if (!m.vatKnown) flag("warn", `Btw-basis van "${res.chosen.productLabel}" is niet bevestigd.`);
        if (res.chosen.status === "stale") flag("warn", `Prijsbron "${res.chosen.productLabel}" is verouderd (controle na ${res.chosen.reviewAfter}).`);
        if (res.chosen.minimumQuantity && t.qty < res.chosen.minimumQuantity) flag("warn", `"${res.chosen.productLabel}": minimale afname ${res.chosen.minimumQuantity} ${res.chosen.unit}.`);
      }
    }
    const markup = markupFor(link.kind);
    if (unitCost == null) {
      lines.push({ group: t.group, kind: link.kind, key: t.key, label: t.label, qty: t.qty, unit: t.unit, saleExclCents: null, costExclCents: null, basis: "missing", note: t.assumption || "", source: null });
      flag("block", `Geen prijs voor "${t.label}" — voer een inkoopprijs in (Leveranciers & inkoop).`);
      continue;
    }
    if (markup == null) flag("warn", `Opslag voor ${({ material: "materiaal", machine: "machines", waste: "afvoer" })[link.kind]} is niet ingesteld — 0% gebruikt.`);
    const unitSale = unitCost * (1 + (markup || 0) / 100);
    // Margeconflict alleen zinvol bij echte inkoop: verkoopprijs boven de hoogste gevonden marktprijs.
    if (basis === "purchase" && band.length) {
      const maxMarket = Math.max(...band.map((r) => marketUnitExcl(r, t.qty, settings.vatRate).cents));
      if (unitSale > maxMarket * 1.0001) flag("warn", `Margeconflict: verkoopprijs "${t.label}" ligt boven de hoogste gevonden marktprijs — kies lagere opslag, andere leverancier of bespreek de meerwaarde.`);
    }
    lines.push({
      group: t.group, kind: link.kind, key: t.key, label: t.label, qty: t.qty, unit: t.unit,
      unitCostExclCents: round(unitCost), unitSaleExclCents: round(unitSale),
      costExclCents: round(unitCost * t.qty), saleExclCents: round(unitSale * t.qty),
      basis, source, note: t.assumption || ""
    });
    if (basis === "market") flag("info", "Materiaalkosten zijn benaderd met openbare consumentenprijzen; vervang ze door echte inkoopprijzen.");
  }

  // Transport per werkdag
  const days = laborHours > 0 ? Math.ceil(laborHours / (settings.crewSize * settings.hoursPerDay)) : 0;
  if (days > 0) {
    if (settings.transportPerDayCents != null) {
      lines.push({ group: "Transport", kind: "transport", key: "transport", label: "Vervoer / voorrijden", qty: days, unit: "dag", unitSaleExclCents: settings.transportPerDayCents, saleExclCents: round(days * settings.transportPerDayCents), costExclCents: round(days * settings.transportPerDayCents), basis: "confirmed", note: "Doorberekende voertuigkosten, zonder marge" });
    } else {
      lines.push({ group: "Transport", kind: "transport", key: "transport", label: "Vervoer / voorrijden", qty: days, unit: "dag", saleExclCents: null, costExclCents: null, basis: "missing", note: "Tarief nog niet ingesteld" });
      flag("block", "Transport-/voorrijtarief per dag is niet ingesteld.");
    }
  }

  const known = lines.filter((l) => l.saleExclCents != null);
  const subtotal = known.reduce((s, l) => s + l.saleExclCents, 0);
  const extras = [];
  if (settings.overheadPct != null) extras.push({ label: `Algemene kosten (${settings.overheadPct}%)`, cents: round(subtotal * settings.overheadPct / 100) });
  else flag("warn", "Opslag algemene kosten is niet ingesteld.");
  if (settings.riskPct != null) extras.push({ label: `Risico/onvoorzien (${settings.riskPct}%)`, cents: round(subtotal * settings.riskPct / 100) });
  let saleExcl = subtotal + extras.reduce((s, e) => s + e.cents, 0);
  if (settings.minimumOrderExclCents != null && saleExcl > 0 && saleExcl < settings.minimumOrderExclCents) {
    extras.push({ label: "Aanvulling tot minimumorder", cents: settings.minimumOrderExclCents - saleExcl });
    saleExcl = settings.minimumOrderExclCents;
  }
  if (settings.roundToCents) saleExcl = Math.round(saleExcl / settings.roundToCents) * settings.roundToCents;
  const vat = round(saleExcl * settings.vatRate / 100);
  // Werkelijke kostprijs alleen als iedere geprijsde regel een echte kostprijs heeft:
  // marktprijzen zijn een benadering en tellen dan niet als bekende kostprijs.
  const priced = lines.filter((l) => l.saleExclCents != null);
  const costKnown = priced.length > 0 && priced.every((l) => l.costExclCents != null && l.basis !== "market");
  const cost = priced.reduce((s, l) => s + (l.costExclCents || 0), 0);
  const approxPossible = priced.every((l) => l.costExclCents != null);
  const missing = lines.filter((l) => l.basis === "missing").length;

  return {
    lines,
    extras,
    flags,
    totals: {
      laborHours: Math.round(laborHours * 100) / 100,
      days,
      saleExclCents: saleExcl,
      vatCents: vat,
      saleInclCents: saleExcl + vat,
      costExclCents: costKnown ? cost : null,
      costApproxExclCents: !costKnown && approxPossible ? cost : null, // incl. marktprijzen als benadering — geen marge op baseren
      grossMarginCents: costKnown ? saleExcl - cost : null,
      grossMarginPct: costKnown && saleExcl > 0 ? Math.round(((saleExcl - cost) / saleExcl) * 1000) / 10 : null,
      missingLines: missing
    },
    readiness: missing ? "incompleet" : flags.some((f) => f.level === "warn") ? "concept" : "gereed voor controle",
    settingsUsed: { laborRateExclCents: settings.laborRateExclCents, vatRate: settings.vatRate, crewSize: settings.crewSize }
  };
}

/** Opslag op kostprijs ↔ brutomarge op verkoopprijs (ch.38: niet verwarren). */
export function markupToMarginPct(markupPct) {
  return Math.round((markupPct / (100 + markupPct)) * 1000) / 10;
}
export function marginToMarkupPct(marginPct) {
  return Math.round((marginPct / (100 - marginPct)) * 1000) / 10;
}

/**
 * Klantregels: algemene kosten, risico, minimumorder en afronding worden naar
 * rato verwerkt in de geprijsde regels, zodat de klant geen interne opbouw
 * (opslagen/percentages) ziet en de regels exact optellen tot het totaal.
 * Regels zonder prijs komen terug als `onRequest`.
 */
export function customerLines(result, manualLines = []) {
  const priced = result.lines.filter((l) => l.saleExclCents != null);
  const manual = manualLines.map((l) => ({ label: l.label, qty: l.qty, unit: l.unit, saleExclCents: Math.round(l.qty * l.unitSaleExclCents) }));
  const base = priced.reduce((s, l) => s + l.saleExclCents, 0);
  const target = result.totals.saleExclCents;
  const factor = base > 0 ? target / base : 1;
  const out = priced.map((l) => ({ label: l.label, qty: l.qty, unit: l.unit, saleExclCents: Math.round(l.saleExclCents * factor) }));
  const diff = target - out.reduce((s, l) => s + l.saleExclCents, 0);
  if (out.length) out[out.length - 1].saleExclCents += diff;
  const all = out.concat(manual).map((l) => ({ ...l, unitSaleExclCents: l.qty ? Math.round(l.saleExclCents / l.qty) : l.saleExclCents }));
  return { lines: all, totalExclCents: all.reduce((s, l) => s + l.saleExclCents, 0), onRequest: result.lines.filter((l) => l.saleExclCents == null).map((l) => l.label) };
}
