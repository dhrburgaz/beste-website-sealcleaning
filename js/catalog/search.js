/**
 * Pure functies voor de materialencatalogus: zoeken met synoniemen en tikfouttolerantie,
 * facetten, filteren, sorteren, prijsstatus en hoeveelheidsberekening. Geen DOM: unit-getest.
 */
import { deriveTileCount } from "../project-state.js";

const GLOBAL_SYNONYMS = {
  hek: ["schutting", "poort"], erfafscheiding: ["schutting", "haag"], tegel: ["bestrating", "tegels"], tegels: ["bestrating"],
  terras: ["terras", "bestrating"], oprit: ["oprit", "klinkers"], stenen: ["klinkers", "bestrating"], gazon: ["gras"],
  onderhoudsarm: ["laag"], privacy: ["schutting", "haag", "privacy"], licht: ["verlichting"], water: ["drainage", "afwatering"]
};

export function normalize(s) {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/×/g, "x").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
const words = (s) => normalize(s).split(" ").filter(Boolean);

/** Levenshtein-afstand met vroege stop boven `max`. */
export function editDistance(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

function tokenHit(token, list) {
  for (const w of list) {
    if (w === token || w.startsWith(token)) return 1;
    if (token.length >= 5 && w.includes(token)) return 0.8;
  }
  const max = token.length >= 8 ? 2 : token.length >= 4 ? 1 : 0;
  // Tikfout in het hele woord, of in het begin van een langer woord ("schuting" → "schutting", "kerami" → "keramiek").
  if (max) for (const w of list) if (w.length >= 3 && (editDistance(token, w, max) <= max || (w.length > token.length && editDistance(token, w.slice(0, token.length), max) <= max))) return 0.6;
  return 0;
}

function prepared(item) {
  if (!item.__idx) {
    Object.defineProperty(item, "__idx", { enumerable: false, value: {
      title: words(item.title), syn: words((item.synonyms || []).join(" ")),
      body: words([item.summary, item.material, item.group, item.category, (item.application || []).join(" "), item.maintenanceLevel, (item.formats || []).map((f) => f.label).join(" ")].join(" "))
    } });
  }
  return item.__idx;
}

/** Zoekt; geeft [{item, score, exact}] gesorteerd. Elke zoekterm moet ergens raken (of via synoniem/tikfout). */
export function searchCatalog(items, query) {
  const tokens = words(query).filter((t) => t.length >= 2);
  if (!tokens.length) return items.map((item) => ({ item, score: 0, exact: true }));
  const out = [];
  for (const item of items) {
    const idx = prepared(item);
    let score = 0, all = true, exact = true;
    for (const t of tokens) {
      const variants = [t, ...(GLOBAL_SYNONYMS[t] || [])];
      let best = 0;
      for (const v of variants) {
        const w = v === t ? 1 : 0.7;
        best = Math.max(best, w * (3 * tokenHit(v, idx.title) || 2 * tokenHit(v, idx.syn) || tokenHit(v, idx.body)));
      }
      if (!best) all = false;
      if (best && best < 1) exact = false;
      score += best;
    }
    if (all && score > 0) out.push({ item, score, exact });
  }
  return out.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "nl"));
}

/** Suggestie bij 0 resultaten: dichtstbijzijnde titel- of synoniemwoord. */
export function suggest(items, query) {
  const t = words(query)[0];
  if (!t || t.length < 3) return null;
  let best = null, bestD = 3;
  for (const item of items) for (const w of [...prepared(item).title, ...prepared(item).syn]) {
    if (w.length < 3) continue;
    const d = editDistance(t, w, 2);
    if (d < bestD) { bestD = d; best = w; }
  }
  return bestD <= 2 ? best : null;
}

export const FACETS = {
  category: { label: "Categorie", of: (i) => [i.category] },
  material: { label: "Materiaal", of: (i) => (i.material ? [i.material] : []) },
  application: { label: "Toepassing", of: (i) => i.application || [] },
  maintenance: { label: "Onderhoud", of: (i) => (i.maintenanceLevel ? [i.maintenanceLevel] : []) },
  format: { label: "Formaat", of: (i) => (i.formats || []).map((f) => f.label.replace(/ \(.*\)$/, "")) },
  status: { label: "Status", of: (i) => [i.status] }
};

export function filterCatalog(items, filters = {}) {
  return items.filter((i) => Object.entries(filters).every(([k, vals]) => !vals?.length || FACETS[k].of(i).some((v) => vals.includes(v))));
}

/** Facettellingen voor de huidige set, elk facet geteld met de overige filters actief (gebruikelijke e-commerce-logica). */
export function facetCounts(items, filters = {}) {
  const out = {};
  for (const k of Object.keys(FACETS)) {
    const others = { ...filters, [k]: [] };
    const counts = new Map();
    for (const i of filterCatalog(items, others)) for (const v of new Set(FACETS[k].of(i))) counts.set(v, (counts.get(v) || 0) + 1);
    out[k] = [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "nl"));
  }
  return out;
}

const STATUS_ORDER = { "verified-product": 0, "general-option": 1, "on-request": 2, unavailable: 3 };
const MAINT_ORDER = { laag: 0, gemiddeld: 1, hoger: 2 };
export const SORTS = {
  relevantie: { label: "Relevantie", help: "Beste overeenkomst met uw zoekwoorden; zonder zoekwoord: geverifieerde producten eerst" },
  naam: { label: "Naam (A–Z)", help: "Alfabetisch" },
  onderhoud: { label: "Minste onderhoud eerst", help: "Op onderhoudsniveau; onbekend achteraan" },
  status: { label: "Zekerheid van gegevens", help: "Geverifieerde producten eerst, daarna opties en op aanvraag" }
};
export function sortCatalog(results, mode) {
  const r = [...results];
  const byStatus = (a, b) => STATUS_ORDER[a.item.status] - STATUS_ORDER[b.item.status];
  if (mode === "naam") return r.sort((a, b) => a.item.title.localeCompare(b.item.title, "nl"));
  if (mode === "onderhoud") return r.sort((a, b) => (MAINT_ORDER[a.item.maintenanceLevel] ?? 9) - (MAINT_ORDER[b.item.maintenanceLevel] ?? 9) || byStatus(a, b));
  if (mode === "status") return r.sort((a, b) => byStatus(a, b) || a.item.title.localeCompare(b.item.title, "nl"));
  return r.sort((a, b) => b.score - a.score || byStatus(a, b));
}

/**
 * Prijsstatus voor de klant: alleen een openbare marktreferentie met bron en peildatum, nooit een
 * SEAL-verkoopprijs. Verlopen referenties (na reviewAfter) tonen geen bedrag.
 */
export function priceInfo(item, priceSources, today = new Date().toISOString().slice(0, 10)) {
  const row = item.priceSourceId ? priceSources?.rows?.find((r) => r.id === item.priceSourceId) : null;
  if (!row || row.amountCents == null) return { status: "none" };
  let domain = null;
  try { domain = new URL(row.sourceUrl).hostname.replace(/^www\./, ""); } catch { /* geen url */ }
  const stale = row.status !== "active" || (row.reviewAfter && today > row.reviewAfter);
  return {
    status: stale ? "stale" : "reference",
    amountCents: stale ? null : row.amountCents,
    vatIncluded: row.vatIncluded, unit: row.unit, observedAt: row.observedAt, reviewAfter: row.reviewAfter,
    sourceUrl: row.sourceUrl, domain, tiers: stale ? [] : row.quantityTiers || [], scopeExcluded: row.scopeExcluded || []
  };
}

/** Hoeveelheid alleen waar wiskundig valide; geeft {qty, unit, note} of null. */
export function quantityFor(item, input) {
  const f = item.formats?.[0];
  if (item.quantityRule === "tiles" && f?.lengthMm && f?.widthMm) {
    const m2 = Number(input.m2), waste = input.waste ?? 0.05;
    if (!(m2 > 0 && m2 <= 10000)) return null;
    return { qty: deriveTileCount(m2, f.lengthMm, f.widthMm, waste), unit: "stuks", note: `${String(m2).replace(".", ",")} m² + ${Math.round(waste * 100)} % snijverlies, ${f.label}` };
  }
  if (item.quantityRule === "edging" && f?.lengthMm) {
    const m = Number(input.meters), waste = input.waste ?? 0.05;
    if (!(m > 0 && m <= 10000)) return null;
    return { qty: Math.ceil(Math.round((m * 1000 * (1 + waste)) / f.lengthMm * 1e6) / 1e6), unit: "stuks", note: `${String(m).replace(".", ",")} m + ${Math.round(waste * 100)} % zaagverlies, banden van ${f.lengthMm / 10} cm` };
  }
  if (item.quantityRule === "area") {
    const m2 = Number(input.m2);
    if (!(m2 > 0 && m2 <= 10000)) return null;
    return { qty: Math.ceil(m2 * 2) / 2, unit: "m²", note: "Netto oppervlak, afgerond op 0,5 m²; snijverlies hangt af van rolbreedte en vorm" };
  }
  return null;
}
