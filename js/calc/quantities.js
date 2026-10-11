/**
 * Hoeveelhedenstaat (takeoff) uit de projectstate. Puur: geen DOM, geen
 * prijzen. Elke regel heeft een sleutel die de calculatiemotor koppelt aan
 * materiaal-, arbeids- en machineregels. Aannames (laagdiktes, snijverlies)
 * staan als `assumption` bij de regel, zodat ze in de offerte zichtbaar zijn.
 */
import { derivePavingTotals, deriveTileCount, deriveFenceLengths } from "../project-state.js";
import { computeFenceLayout } from "../configurator/geometry.js";
import { getFenceSystem } from "../../data/fence-systems.js";
import { getObjectType } from "../../data/garden-objects.js";
import { estimateWaste } from "../configurator/waste.js";

const r2 = (n) => Math.round(n * 100) / 100;

/**
 * @returns {Array<{key:string, group:string, label:string, qty:number, unit:string, assumption?:string, meta?:object}>}
 */
export function takeoff(project) {
  const rows = [];
  const add = (key, group, label, qty, unit, assumption, meta) => {
    if (qty > 0) rows.push({ key, group, label, qty: r2(qty), unit, ...(assumption ? { assumption } : {}), ...(meta ? { meta } : {}) });
  };

  // Bestrating
  const p = project.paving;
  if (p && p.areas?.length) {
    const m2 = derivePavingTotals(p).totalM2;
    const tiles = deriveTileCount(m2, p.nominalTileLengthMm, p.nominalTileWidthMm, 0.05);
    const fmt = `${p.nominalTileLengthMm / 10}×${p.nominalTileWidthMm / 10} cm`;
    add("paving.tiles", "Bestrating", `Tegels ${fmt}`, tiles, "st", "Incl. 5% snijverlies", { productId: p.productId || null, tileLengthMm: p.nominalTileLengthMm, tileWidthMm: p.nominalTileWidthMm });
    add("paving.area", "Bestrating", "Bestraten (leggen, aftrillen, invegen)", m2, "m²");
    const perimeterM = p.areas.reduce((s, a) => s + 2 * (a.lengthMm + a.widthMm), 0) / 1000;
    add("paving.edging", "Bestrating", "Opsluitband 100 cm", Math.ceil(perimeterM * 1.05), "st", "Omtrek alle vlakken + 5%; gedeelde randen tussen vlakken niet afgetrokken");
    add("paving.sand", "Bestrating", "Straatzand (zandbed)", m2 * 0.05, "m³", "Zandbed 5 cm");
    const earth = ["earth", "unknown"].includes(project.access?.surface);
    if (earth) add("paving.excavation", "Grondwerk", "Afgraven voor bestrating", m2 * 0.2, "m³", "20 cm cunet; werkelijke diepte na opname");
    add("machine.plate", "Machines", "Trilplaat (huur)", Math.max(1, Math.ceil(m2 / 40)), "dag", "1 huurdag per begonnen 40 m²");
  }

  // Schutting
  const f = project.fence;
  if (f && f.sections?.length) {
    const system = getFenceSystem(f.systemId) || { nominalPanelWidthMm: 1800 };
    const layout = computeFenceLayout(f, system);
    const segs = layout.sections.flatMap((s) => s.segments);
    const panels = segs.filter((s) => s.kind === "panel").length;
    const fits = segs.filter((s) => s.kind === "fit").length;
    const len = deriveFenceLengths(f);
    const sysLabel = system.label || "schutting";
    add("fence.panels", "Schutting", `Schermen ${sysLabel}, ${f.heightMm / 10} cm`, panels, "st", null, { systemId: f.systemId, heightMm: f.heightMm });
    add("fence.fits", "Schutting", "Passtukken (op maat)", fits, "st");
    add("fence.posts", "Schutting", "Palen", layout.posts.length, "st");
    if (system.hasBasePlate) add("fence.baseplates", "Schutting", "Onderplaten", panels + fits, "st");
    add("fence.gates", "Schutting", "Poorten", (f.gates || []).length, "st");
    add("fence.length", "Schutting", "Schutting plaatsen (gesloten lengte)", len.closedLengthMm / 1000, "m");
    if (project.options?.fenceIntent === "repair") add("fence.repair", "Schutting", "Herstel bestaande schutting (na opname)", 1, "post", "Omvang pas na beoordeling");
  }

  // Objecten (alleen nieuw = scope; verwijderen = sloop)
  for (const o of project.existingObjects || []) {
    const t = getObjectType(o.type);
    if (!t || !o.footprint) continue;
    const m2 = (o.footprint.lengthMm * o.footprint.widthMm) / 1e6;
    const lenM = Math.max(o.footprint.lengthMm, o.footprint.widthMm) / 1000;
    if (o.status === "new") {
      if (o.type === "hedge") add("green.hedge", "Groen", "Haag aanplanten", lenM, "m");
      if (o.type === "border") add("green.border", "Groen", "Border inplanten", m2, "m²");
      if (o.type === "lawn") add("green.lawn", "Groen", "Graszoden leggen", m2, "m²");
      if (o.type === "plant") add("green.plant", "Groen", "Solitair / heester planten", 1, "st");
      if (o.type === "gravel") { add("hard.gravel", "Verharding", "Grindvak aanleggen", m2, "m²"); add("hard.gravel.volume", "Verharding", "Grind", m2 * 0.05, "m³", "Laag 5 cm"); }
      if (o.type === "deck") add("hard.deck", "Verharding", "Vlonder bouwen", m2, "m²");
      if (o.type === "planter") add("hard.planter", "Verharding", "Plantenbak / verhoogde border", lenM, "m");
      if (o.type === "lamp") add("light.point", "Verlichting", "Lichtpunt plaatsen", 1, "st", "Bekabeling/aansluiting na opname");
    }
    if (o.status === "existing-remove") {
      if (["border", "lawn", "gravel", "deck"].includes(o.type)) add(`remove.area`, "Verwijderen", `${t.label.split(" /")[0]} verwijderen`, m2, "m²");
      else if (["hedge", "planter"].includes(o.type)) add("remove.linear", "Verwijderen", `${t.label.split(" /")[0]} verwijderen`, lenM, "m");
      else add(`remove.item.${o.type}`, "Verwijderen", `${t.label.split(" /")[0]} verwijderen`, 1, "st");
    }
  }

  // Bestaande schutting/bestrating weg
  if (project.removal?.existingPaving) {
    const m2 = project.removal.existingPavingM2 ?? (p ? derivePavingTotals(p).totalM2 : 0);
    add("remove.paving", "Verwijderen", "Bestaande bestrating opbreken", m2, "m²");
  }
  if (project.removal?.existingFence && f) add("remove.fence", "Verwijderen", "Bestaande schutting slopen", deriveFenceLengths(f).totalLineLengthMm / 1000, "m");

  // Afval → containers (6 m³), alleen als Sealcleaning afvoert of nog onbekend
  if (["seal", "unknown"].includes(project.removal?.disposal ?? "unknown")) {
    const waste = estimateWaste(project, project.removal?.existingPavingM2);
    const byStream = { puin: 0, grond: 0, groen: 0, bouw: 0 };
    for (const w of waste) {
      const hi = w.m3 ? w.m3[1] : 0;
      if (/Puin/.test(w.stream)) byStream.puin += hi;
      else if (/Zand|grond/.test(w.stream) && !/Groen/.test(w.stream)) byStream.grond += hi;
      else if (/Groen/.test(w.stream)) byStream.groen += hi;
      else byStream.bouw += hi || 2;
    }
    const excav = rows.find((r) => r.key === "paving.excavation");
    if (excav) byStream.grond += excav.qty;
    const assume = "Bovenkant volumebandbreedte, 6 m³ per container";
    if (byStream.puin) add("waste.rubble", "Afvoer", "Container schoon puin 6 m³", Math.ceil(byStream.puin / 6), "st", assume);
    if (byStream.grond) add("waste.soil", "Afvoer", "Container grond 6 m³", Math.ceil(byStream.grond / 6), "st", assume);
    if (byStream.groen) add("waste.green", "Afvoer", "Container tuin-/plantsoenafval 6 m³", Math.ceil(byStream.groen / 6), "st", assume);
    if (byStream.bouw) add("waste.mixed", "Afvoer", "Container bouw-/sloopafval 6 m³", Math.ceil(byStream.bouw / 6), "st", assume);
  }
  return rows;
}
