/**
 * Afvalindicatie (J03): geometrische volumebandbreedte per afvalstroom, met
 * onzekerheid. Gebaseerd op de getekende maten en gangbare laagdiktes; de
 * werkelijke opbouw is pas na opname bekend. Geen gewicht of tarief — dat
 * vraagt materiaaldata en wordt pas na controle bepaald.
 */
import { derivePavingTotals, deriveFenceLengths } from "../project-state.js";

// Vaste-volume-aannames (m) — bewust als bandbreedte, niet als één getal.
const TILE_LAYER = [0.04, 0.08];   // tegel/klinker
const BED_LAYER = [0.03, 0.10];    // zand-/straatzandbed
const GREEN_LAYER = [0.10, 0.25];  // wortelzone border/gazon
const HEDGE_DEPTH = [0.6, 1.2];    // haag: breedte × hoogte-indicatie per meter (m²)

function range(area, [lo, hi]) {
  return [Math.round(area * lo * 10) / 10, Math.round(area * hi * 10) / 10];
}

/**
 * @returns {Array<{stream:string, basis:string, m3:[number,number]|null, note:string}>}
 */
export function estimateWaste(project, existingPavingM2) {
  const out = [];
  const removal = project.removal || {};
  if (removal.existingPaving) {
    const area = existingPavingM2 ?? (project.paving ? derivePavingTotals(project.paving).totalM2 : 0);
    if (area > 0) {
      out.push({ stream: "Puin (tegels/klinkers)", basis: `${area.toLocaleString("nl-NL")} m² bestaande bestrating`, m3: range(area, TILE_LAYER), note: "Afhankelijk van tegeldikte." });
      out.push({ stream: "Zand / grond (zandbed)", basis: `${area.toLocaleString("nl-NL")} m²`, m3: range(area, BED_LAYER), note: "Deel kan soms worden hergebruikt." });
    }
  }
  if (removal.existingFence && project.fence) {
    const len = deriveFenceLengths(project.fence).totalLineLengthMm / 1000;
    if (len > 0) {
      out.push({ stream: "Hout / schuttingdelen", basis: `ca. ${len.toLocaleString("nl-NL", { maximumFractionDigits: 1 })} m schutting (aangenomen gelijk aan de nieuwe lijn)`, m3: null, note: `Ongeveer ${Math.ceil(len / 1.8)} schermen plus palen; beton onderplaten/poeren apart als puin.` });
    }
  }
  for (const o of project.existingObjects || []) {
    if (o.status !== "existing-remove" || !o.footprint) continue;
    const m2 = (o.footprint.lengthMm * o.footprint.widthMm) / 1e6;
    if (o.type === "border" || o.type === "lawn") {
      out.push({ stream: "Groenafval + grond", basis: `${(Math.round(m2 * 10) / 10).toLocaleString("nl-NL")} m² ${o.type === "lawn" ? "gazon" : "border"}`, m3: range(m2, GREEN_LAYER), note: "Wortelzone verschilt sterk per plek." });
    } else if (o.type === "hedge") {
      const len = Math.max(o.footprint.lengthMm, o.footprint.widthMm) / 1000;
      out.push({ stream: "Groenafval (haag)", basis: `${len.toLocaleString("nl-NL", { maximumFractionDigits: 1 })} m haag`, m3: range(len, HEDGE_DEPTH), note: "Inclusief wortelkluiten; hoogte bepaalt veel." });
    } else if (o.type === "shed") {
      out.push({ stream: "Bouw- en sloopafval (schuur)", basis: `${(Math.round(m2 * 10) / 10).toLocaleString("nl-NL")} m² vloeroppervlak`, m3: null, note: "Volume hangt af van materiaal en fundering — beoordelen bij opname." });
    } else if (o.type === "tree") {
      out.push({ stream: "Groenafval (boom)", basis: "1 boom", m3: null, note: "Kap/stobbe alleen na beoordeling; volume niet te schatten uit tekening." });
    }
  }
  return out;
}
