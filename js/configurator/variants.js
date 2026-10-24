/**
 * Varianten A/B/C (F03/G06/G07): dezelfde geometrie, andere materiaalkeuzes.
 * Een variant bewaart alleen keuzes; hoeveelheden komen altijd uit de
 * actuele tekening, zodat vergelijken eerlijk blijft. Prijsverschil wordt
 * alleen berekend tussen bekende, vergelijkbare prijsregels.
 */
import { derivePavingTotals, deriveTileCount } from "../project-state.js";
import { getFenceSystem, getFenceMaterialPreset } from "../../data/fence-systems.js";
import { PAVING_PATTERNS, getPavingColorPreset, PAVING_MATERIAL_INFO } from "../../data/paving-products.js";
import { getPavingProduct } from "../../data/materials.js";

export const MAX_VARIANTS = 3;

export function captureChoices(project) {
  return {
    fence: project.fence ? {
      systemId: project.fence.systemId,
      materialPresetId: project.fence.materialPresetId,
      heightMm: project.fence.heightMm
    } : null,
    paving: project.paving ? {
      nominalTileLengthMm: project.paving.nominalTileLengthMm,
      nominalTileWidthMm: project.paving.nominalTileWidthMm,
      pattern: project.paving.pattern,
      colorPresetId: project.paving.colorPresetId,
      productId: project.paving.productId || null
    } : null
  };
}

export function applyChoices(project, choices) {
  if (project.fence && choices.fence) Object.assign(project.fence, choices.fence);
  if (project.paving && choices.paving) Object.assign(project.paving, choices.paving);
}

export function sameChoices(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Materiaalindicatie bestrating uit gecontroleerde prijsregels.
 * Gekozen product → exact die regel; anders de goedkoopste regel voor het
 * formaat. Geen passende regel → null (nooit een verzonnen bedrag).
 */
export function pavingIndication(project, choices, priceSources) {
  if (!project.paving || !choices) return null;
  const totals = derivePavingTotals(project.paving);
  if (!(totals.totalM2 > 0)) return null;
  const matches = (priceSources.rows || []).filter((r) =>
    r.status !== "stale" && r.tileLengthMm === choices.nominalTileLengthMm && r.tileWidthMm === choices.nominalTileWidthMm);
  const product = choices.productId ? getPavingProduct(choices.productId) : null;
  const row = product
    ? matches.find((r) => r.id === product.priceSourceId)
    : matches.reduce((best, r) => (!best || r.amountCents < best.amountCents ? r : best), null);
  if (!row) return null;
  const count = deriveTileCount(totals.totalM2, choices.nominalTileLengthMm, choices.nominalTileWidthMm, 0.05);
  return { row, count, amountCents: count * row.amountCents, basis: product ? "gekozen product" : "goedkoopste gevonden referentie" };
}

function fmtTile(c) { return `${c.nominalTileLengthMm / 10}×${c.nominalTileWidthMm / 10} cm`; }

/** Leesbare beschrijving per vergelijkingsrij. */
export function describeChoices(choices) {
  const out = {};
  if (choices.fence) {
    const sys = getFenceSystem(choices.fence.systemId);
    out.fenceSystem = sys ? sys.label : "—";
    out.fenceMaterial = getFenceMaterialPreset(choices.fence.materialPresetId)?.label || "—";
    out.fenceHeight = `${choices.fence.heightMm / 10} cm`;
    out.fenceBuildUp = sys?.buildUp || "—";
    out.fenceMaintenance = sys?.maintenance || "—";
    out.fenceSupply = "Generiek systeem — nog geen artikel gekoppeld; leverbaarheid op aanvraag.";
  }
  if (choices.paving) {
    const product = choices.paving.productId ? getPavingProduct(choices.paving.productId) : null;
    const color = getPavingColorPreset(choices.paving.colorPresetId);
    const materialKey = product ? product.materialType : color?.material;
    out.pavingFormat = fmtTile(choices.paving);
    out.pavingPattern = PAVING_PATTERNS.find((p) => p.id === choices.paving.pattern)?.label || "—";
    out.pavingColor = color?.label || "—";
    out.pavingProduct = product ? product.label : "Generiek — geen specifiek artikel";
    out.pavingMaintenance = PAVING_MATERIAL_INFO[materialKey]?.maintenance || "Afhankelijk van het gekozen product.";
    out.pavingSupply = product
      ? "Referentieartikel bij externe leverancier; voorraad en levertijd niet door ons gecontroleerd."
      : "Nog geen artikel gekoppeld; leverbaarheid op aanvraag.";
  }
  return out;
}

const DIFF_LABELS = {
  "fence.systemId": "schuttingsysteem", "fence.materialPresetId": "schuttingmateriaal", "fence.heightMm": "schuttinghoogte",
  "paving.nominalTileLengthMm": "tegelformaat", "paving.nominalTileWidthMm": "tegelformaat", "paving.pattern": "legpatroon",
  "paving.colorPresetId": "tegelkleur", "paving.productId": "tegelproduct"
};

/** Welke onderdelen (scope) wijken af van de referentievariant (G06). */
export function diffChoices(ref, other) {
  const changed = new Set();
  for (const group of ["fence", "paving"]) {
    if (!ref[group] || !other[group]) continue;
    for (const key of Object.keys(ref[group])) {
      if (ref[group][key] !== other[group][key]) changed.add(DIFF_LABELS[`${group}.${key}`]);
    }
  }
  return [...changed];
}
