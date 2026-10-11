/**
 * Beginnersroute schutting (v12): één vraag per scherm, gewone taal, drie meetroutes.
 * Hergebruikt de bestaande projectstate, geometrie, 3D-scene en ontwerp-export; er is geen
 * tweede rekenmodel. Antwoorden worden lokaal op dit apparaat bewaard (geen account).
 */
import { createEmptyProject, generateId, parseMetersToMm, validateFenceGates, deriveFenceLengths } from "../../project-state.js";
import { computeFenceLayout } from "../../configurator/geometry.js";
import { getFenceSystem } from "../../../data/fence-systems.js";
import { encodeShare } from "../../configurator/design-io.js";
import { emit } from "../events.js";
import { STIJLEN, STIJL_NOTE, MATERIALS, HEIGHTS_CM, GATE_WIDTHS_CM, HELP, lengthIllustration, heightIllustration, shapeIcon, sideIllustration, gateIllustration } from "./content.js";

const root = document.querySelector("[data-beginner]");
if (!root) throw new Error("beginner root ontbreekt");

const STORE = "sealBeginnerSchuttingV12";
const BASE = new URL("../../../", import.meta.url); // site-root
// Directory-links: op hosts zonder directory-index (statische previews) eindigt de pagina op index.html; dan wijzen onze links ook naar index.html.
const dir = (p) => new URL(p + (p.endsWith("/") && /\/index\.html$/.test(location.pathname) ? "index.html" : ""), BASE).href;
const SIDES = { recht: ["Achterkant"], hoek: ["Achterkant", "Zijkant"], drie: ["Linkerkant", "Achterkant", "Rechterkant"] };
const DEFAULT_LEN_MM = 5000;
const DOEL = { nieuw: "Een nieuwe schutting plaatsen", herstel: "Mijn schutting repareren", "weet-niet": "Ik weet het niet" };
const WERK = { "alleen-materiaal": "Alleen de materialen", "met-montage": "Materialen én plaatsing door SEAL", "alleen-montage": "Alleen plaatsing, ik heb het materiaal zelf" };
const MEET = { precies: "Ik weet de maten", ongeveer: "Ik weet het ongeveer", onbekend: "Ik kan niet meten" };
const MEET_STATUS = { precies: "precies (door jou opgegeven)", ongeveer: "ongeveer (wij controleren dit)", onbekend: "onbekend (wij komen nameten)" };

/* ---------------- state ---------------- */
const fresh = () => ({ step: "doel", doel: null, herstel: { items: [], tekst: "" }, materiaal: null, stijl: null, vorm: null, lengtes: {}, hoogteCm: 180, poort: null, poortBreedteCm: 100, poortPlek: "midden", poortZijde: 0, werk: null, oudWeg: false, afvoer: false });
let st = fresh();
let loadedFromStore = false;
try { const raw = localStorage.getItem(STORE); if (raw) { st = { ...fresh(), ...JSON.parse(raw) }; loadedFromStore = st.step !== "doel" || !!st.doel; } } catch (e) { /* geen opslag: werkt gewoon door */ }
{
  // Ingang vanuit andere pagina's (productpagina): alleen als er nog geen eigen voortgang is.
  const qs = new URLSearchParams(location.search), qm = qs.get("materiaal");
  if (!loadedFromStore) {
    if (MATERIALS.some((m) => m.id === qm)) { st.doel = "nieuw"; st.materiaal = qm; st.step = "vorm"; }
    else if (qs.get("doel") === "herstel") { st.doel = "herstel"; st.step = "herstel"; }
  }
}
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* opslag niet beschikbaar */ } };

/* ---------------- helpers ---------------- */
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v; else if (k === "html") el.innerHTML = v; else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
};
const metersText = (mm) => { const m = Math.floor(mm / 1000), cm = Math.round((mm % 1000) / 10); return `${m} meter${cm ? ` en ${cm} centimeter` : ""}`; };
const mShort = (mm) => `${(mm / 1000).toLocaleString("nl-NL", { maximumFractionDigits: 2 })} m`;
const photoUrl = (name, w = 800) => new URL(`images/projects/${name}-${w}.webp`, BASE).href;
const inspPic = (name, alt) => h("picture", {}, h("source", { srcset: ["640", "960"].map((w) => `${new URL(`images/inspiratie/${name}-${w}.webp`, BASE).href} ${w}w`).join(", "), sizes: "(max-width: 700px) 92vw, 420px", type: "image/webp" }), h("img", { src: new URL(`images/inspiratie/${name}.jpg`, BASE).href, alt, loading: "lazy", decoding: "async" }));
const photoPic = (name, alt, cls) => h("picture", {}, h("source", { srcset: `${photoUrl(name, 640)} 640w, ${photoUrl(name, 800)} 800w, ${photoUrl(name, 960)} 960w`, sizes: "(max-width: 700px) 92vw, 420px", type: "image/webp" }), h("img", { src: new URL(`images/projects/${name}.jpg`, BASE).href, alt, loading: "lazy", decoding: "async", class: cls }));
const material = () => MATERIALS.find((m) => m.id === st.materiaal) || null;
const sideNames = () => SIDES[st.vorm === "onbekend" ? "recht" : st.vorm] || SIDES.recht;

function steps() {
  if (st.doel === "herstel") return ["doel", "herstel", "aanvraag"];
  if (st.doel === "weet-niet") return ["doel", "hulp", "aanvraag"];
  const s = ["doel", "vorm"];
  sideNames().forEach((_, i) => s.push(`lengte:${i}`));
  s.push("hoogte", "materiaal", "poort");
  if (st.poort === "ja") s.push("poortdetails");
  s.push("werk", "bekijk", "aanvraag");
  return s;
}
const PHASES = [
  { label: "Situatie", title: "Vertel over je situatie", steps: ["doel", "herstel", "hulp", "vorm"] },
  { label: "Maten", title: "Voer de maten in", steps: ["lengte", "hoogte"] },
  { label: "Materialen", title: "Kies je materiaal", steps: ["materiaal"] },
  { label: "Extra's", title: "Kies je extra's", steps: ["poort", "poortdetails", "werk"] },
  { label: "Resultaat", title: "Bekijk je idee en vraag een voorstel aan", steps: ["bekijk", "aanvraag"] }
];
const baseId = (id) => id.split(":")[0];
function activePhases(list) { return PHASES.filter((p) => list.some((id) => p.steps.includes(baseId(id)))); }
const STEP_TITLE = { doel: "Wat wil je doen?", herstel: "Wat is er stuk?", hulp: "Wij denken met je mee", materiaal: "Welke schutting vind je mooi?", vorm: "Hoe loopt de schutting?", hoogte: "Hoe hoog wil je de schutting?", poort: "Wil je ook een poort?", poortdetails: "Hoe breed en waar komt de poort?", werk: "Wie regelt het werk?", bekijk: "Bekijk jouw idee", aanvraag: "Vraag een voorstel aan" };
const titleOf = (id) => (id.startsWith("lengte:") ? `Hoe lang is de ${sideNames()[+id.split(":")[1]].toLowerCase()}?` : STEP_TITLE[id]);
const shortOf = (id) => (id.startsWith("lengte:") ? `Lengte ${sideNames()[+id.split(":")[1]].toLowerCase()}` : STEP_TITLE[id]);

/* ---------------- meten en project ---------------- */
function sideMeasure(i) { return st.lengtes[i] || { mode: null, text: "" }; }
function sideMm(i) {
  const m = sideMeasure(i);
  if (m.mode === "onbekend") return DEFAULT_LEN_MM;
  const mm = parseMetersToMm(m.text || "");
  return mm && mm >= 500 && mm <= 60000 ? mm : null;
}
function overallMeasure() {
  const order = ["precies", "ongeveer", "onbekend"];
  let worst = 0, any = false;
  sideNames().forEach((_, i) => { const m = sideMeasure(i).mode; if (m) { any = true; worst = Math.max(worst, order.indexOf(m)); } });
  return any ? order[worst] : "onbekend";
}

function decorFor(W, D) {
  // Voorbeeldinrichting, alleen voor de weergave: nooit in samenvatting, deellink of aanvraag.
  const o = (type, x, z, l, w) => ({ id: generateId("obj"), type, status: "new", footprint: { xMm: x, zMm: z, lengthMm: l, widthMm: w } });
  if (W < 3000 || D < 2500) return { objects: [], paving: null };
  const objects = [o("border", 750, 150, Math.max(500, W - 1500), 650), o("lawn", 750, 1000, Math.round(W * 0.42), Math.max(800, D - 1500))];
  if (W >= 4500 && D >= 4500) objects.push(o("tree", W - 2100, 700, 1800, 1800));
  objects.push(o("planter", Math.round(W * 0.5), Math.max(1200, D - 900), 1800, 500), o("plant", 900, 900, 700, 700), o("lamp", Math.round(W * 0.5) - 300, Math.max(1200, D - 1000), 300, 300));
  const pl = Math.min(3600, Math.round(W * 0.4)), pw = Math.min(2400, D - 1800);
  const paving = pw >= 1200 ? { areas: [{ id: generateId("area"), lengthMm: pl, widthMm: pw, position: { xMm: Math.round(W * 0.5), zMm: 1000 }, rotationDeg: 0, application: "terras" }], productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "light-grey" } : null;
  return { objects, paving };
}

function buildProject(decor = false) {
  const p = createEmptyProject();
  const mat = material() || MATERIALS[1];
  const L = sideNames().map((_, i) => sideMm(i) || DEFAULT_LEN_MM);
  const vorm = st.vorm === "onbekend" || !st.vorm ? "recht" : st.vorm;
  let sections;
  if (vorm === "recht") sections = [{ id: "A", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: L[0] }];
  else if (vorm === "hoek") sections = [{ id: "A", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: L[0] }, { id: "B", start: { xMm: L[0], zMm: 0 }, directionDeg: 90, lengthMm: L[1] }];
  else sections = [{ id: "A", start: { xMm: 0, zMm: L[0] }, directionDeg: 270, lengthMm: L[0] }, { id: "B", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: L[1] }, { id: "C", start: { xMm: L[1], zMm: 0 }, directionDeg: 90, lengthMm: L[2] }];
  // Voor 'drie' staat de linkerkant als eerste in de lijst; de lengte van die kant is L[0].
  const width = vorm === "recht" ? L[0] : vorm === "hoek" ? L[0] : L[1];
  const depth = vorm === "recht" ? 3500 : vorm === "hoek" ? L[1] : Math.max(L[0], L[2]);
  p.services = ["schutting"];
  p.garden = { ...p.garden, shape: "rect", widthMm: width, depthMm: depth, areaKnown: false, geometryKnown: false };
  const gates = [];
  if (st.poort === "ja") {
    const idx = Math.min(st.poortZijde || 0, sections.length - 1);
    const sec = sections[idx], w = st.poortBreedteCm * 10, edge = 600;
    const offset = st.poortPlek === "links" ? edge : st.poortPlek === "rechts" ? Math.max(edge, sec.lengthMm - w - edge) : Math.max(0, Math.round((sec.lengthMm - w) / 2));
    gates.push({ id: generateId("gate"), sectionId: sec.id, offsetMm: offset, clearWidthMm: w, heightMm: st.hoogteCm * 10, hingeSide: "left", swing: "inward" });
  }
  p.fence = { shape: vorm === "recht" ? "I" : vorm === "hoek" ? "L-right" : "U", systemId: mat.system, heightMm: st.hoogteCm * 10, materialPresetId: mat.preset, sections, gates };
  p.options = { ...p.options, route: st.werk, materialSupply: st.werk === "alleen-montage" ? "own" : "advice-needed", fenceIntent: "new" };
  p.removal = { ...p.removal, existingFence: !!st.oudWeg, removeFence: !!st.oudWeg, items: st.afvoer ? ["afvoer"] : [], disposal: st.afvoer ? "wanted" : "unknown" };
  p.notes = `Maten: ${overallMeasure()}`;
  if (decor) { const d = decorFor(width, depth); p.existingObjects = d.objects; if (d.paving) { p.services = ["schutting", "bestrating"]; p.paving = d.paving; } }
  return p;
}

function indication(project) {
  const sys = getFenceSystem(project.fence.systemId);
  const layout = computeFenceLayout(project.fence, sys);
  let panels = 0, fit = 0;
  for (const sec of layout.sections) for (const seg of sec.segments) { if (seg.kind === "panel") panels++; else if (seg.kind === "fit") fit++; }
  const len = deriveFenceLengths(project.fence);
  return { panels, fit, posts: layout.posts.length, totalMm: len.totalLineLengthMm, gateMm: len.gateOpeningsMm };
}

function summaryLines() {
  const lines = [];
  if (st.doel === "herstel") {
    lines.push("Ik wil mijn schutting laten repareren of laten bekijken.");
    if (st.herstel.items.length) lines.push(`Wat is er stuk: ${st.herstel.items.join(", ")}`);
    if (st.herstel.tekst) lines.push(`Omschrijving: ${st.herstel.tekst}`);
    return lines;
  }
  if (st.doel === "weet-niet") return ["Ik weet nog niet wat ik wil. Ik wil graag advies over mijn schutting."];
  const mat = material();
  lines.push(`Schutting plaatsen: ${mat ? mat.label : "materiaal nog niet gekozen"}, ${st.hoogteCm} cm hoog`);
  if (st.stijl) lines.push(`Gewenste uitstraling: ${(STIJLEN.find((x) => x.id === st.stijl) || {}).label || st.stijl}`);
  lines.push(`Vorm: ${st.vorm === "recht" ? "recht" : st.vorm === "hoek" ? "met een hoek" : st.vorm === "drie" ? "langs drie kanten" : "weet ik niet"}`);
  sideNames().forEach((n, i) => {
    const m = sideMeasure(i), mm = sideMm(i);
    lines.push(`${n}: ${m.mode === "onbekend" || !mm ? "lengte onbekend (nameten nodig)" : `${mShort(mm)} (${m.mode})`}`);
  });
  lines.push(st.poort === "ja" ? `Poort: ja, ${st.poortBreedteCm} cm doorgang, plek: ${st.poortPlek === "seal" ? "SEAL bepaalt" : st.poortPlek}` : `Poort: ${st.poort === "nee" ? "nee" : "weet ik nog niet"}`);
  lines.push(`Wie regelt het werk: ${WERK[st.werk] || "nog niet gekozen"}`);
  if (st.oudWeg) lines.push("Oude schutting weghalen: ja" + (st.afvoer ? ", en afvoeren" : ""));
  lines.push(`Maatstatus: ${MEET_STATUS[overallMeasure()]}`);
  return lines;
}

/* ---------------- preview (3D met 2D-terugval) ---------------- */
const preview = { scene: null, host: null, overlay: null, tried: false, fallback: false, showDims: true, mode: "3d", flat: null, decor: true };
const stageEl = () => root.querySelector(".b-preview-stage");
async function ensureScene() {
  if (preview.scene || preview.tried) return;
  preview.tried = true;
  try {
    const mod = await import("../../configurator/three-scene.js");
    if (!mod.isWebGL2Supported()) throw new Error("webgl");
    preview.scene = mod.createThreeScene(preview.host, buildProject(preview.decor), { scenic: true, figure: true });
    preview.scene.onFrame(drawDims);
    updatePreview();
  } catch (e) {
    preview.fallback = true;
    document.querySelectorAll("[data-b-mode='3d']").forEach((b) => { b.disabled = true; b.title = "3D werkt op dit apparaat niet"; });
    setMode("2d");
    setStatus("Het 3D-voorbeeld werkt op dit apparaat niet. Je ziet een tekening van boven. Alle keuzes en maten werken gewoon.");
  }
}
async function renderFlat() {
  if (!preview.flat) { preview.flat = h("svg", { class: "b-flat", role: "img", "aria-label": "Je schutting in 2D, bovenaanzicht" }); stageEl().append(preview.flat); }
  const { renderScene } = await import("../../configurator/svg-scene.js");
  renderScene(preview.flat, buildProject(preview.decor), {});
}
function setMode(m) {
  preview.mode = m; root.dataset.view = m; const se = stageEl(); if (se) se.dataset.mode = m;
  document.querySelectorAll("[data-b-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bMode === m)));
  if (m === "2d") renderFlat(); else if (preview.scene) { preview.scene.update(buildProject(preview.decor)); }
}
function updatePreview() {
  const p = buildProject(preview.decor);
  if (preview.scene && preview.mode === "3d") preview.scene.update(p);
  if (preview.mode === "2d") renderFlat();
  renderFacts();
  const any = sideNames().some((_, i) => sideMeasure(i).mode);
  if (!any && !preview.fallback) setStatus("Dit is een voorbeeld van 5 meter. Zodra je maten invult, past de tekening zich aan.");
}
function drawDims() {
  const o = preview.overlay; if (!o || !preview.scene) return;
  o.textContent = ""; if (!preview.showDims) return;
  const p = buildProject(), secs = p.fence.sections, pt = preview.scene.projectPoint;
  const ns = "http://www.w3.org/2000/svg";
  const add = (tag, a, txt) => { const e = document.createElementNS(ns, tag); for (const k in a) e.setAttribute(k, a[k]); if (txt) e.textContent = txt; o.append(e); return e; };
  const cx = secs.reduce((s, x) => s + x.start.xMm, 0) / secs.length / 1000, cz = secs.reduce((s, x) => s + x.start.zMm, 0) / secs.length / 1000;
  const label = (x, y, text, color) => {
    const w = Math.max(60, text.length * 7.4 + 18), hgt = 26;
    add("rect", { x: x - w / 2, y: y - hgt / 2 - 4, width: w, height: hgt, rx: 13, class: "b-pill", stroke: color });
    add("text", { x, y: y + 1, "text-anchor": "middle", class: "b-dim-text", fill: color }, text);
  };
  secs.forEach((s, i) => {
    const r = (s.directionDeg * Math.PI) / 180, dx = Math.cos(r), dz = Math.sin(r);
    const a = { x: s.start.xMm / 1000, z: s.start.zMm / 1000 }, b = { x: a.x + dx * s.lengthMm / 1000, z: a.z + dz * s.lengthMm / 1000 };
    let nx = -dz, nz = dx; const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
    if ((cx - mx) * nx + (cz - mz) * nz > 0) { nx = -nx; nz = -nz; }
    const off = 0.9, A = pt(a.x + nx * off, 0.05, a.z + nz * off), B = pt(b.x + nx * off, 0.05, b.z + nz * off), M = pt(mx + nx * off, 0.05, mz + nz * off);
    if (!A.visible || !B.visible) return;
    add("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: "b-dim-halo-line" });
    add("line", { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: "#12513A", "stroke-width": 3, "marker-start": "url(#b-arr)", "marker-end": "url(#b-arr)" });
    label(M.x, M.y - 18, `${secs.length > 1 ? sideNames()[i] + ": " : "Lengte: "}${mShort(s.lengthMm)}${sideMeasure(i).mode === "ongeveer" || sideMeasure(i).mode === "onbekend" ? " (geschat)" : ""}`, "#12513A");
  });
  const s0 = secs[0], r0 = (s0.directionDeg * Math.PI) / 180;
  const hx = s0.start.xMm / 1000 - Math.cos(r0) * 0.6, hz = s0.start.zMm / 1000 - Math.sin(r0) * 0.6, hh = st.hoogteCm / 100;
  const H0 = pt(hx, 0, hz), H1 = pt(hx, hh, hz);
  if (H0.visible && H1.visible) {
    add("line", { x1: H0.x, y1: H0.y, x2: H1.x, y2: H1.y, class: "b-dim-halo-line" });
    add("line", { x1: H0.x, y1: H0.y, x2: H1.x, y2: H1.y, stroke: "#B26A00", "stroke-width": 3, "marker-start": "url(#b-arr-a)", "marker-end": "url(#b-arr-a)" });
    const hl = Math.max(80, H1.x); label(hl + 62, (H0.y + H1.y) / 2, `Hoogte: ${st.hoogteCm} cm`, "#8a5200");
  }
}
function setStatus(t) { const el = root.querySelector("[data-b-status]"); if (el) el.textContent = t; }
function renderFacts() {
  const el = root.querySelector("[data-b-facts]"); if (!el) return;
  el.textContent = "";
  const p = buildProject(), ind = indication(p);
  sideNames().forEach((n, i) => { const m = sideMeasure(i), mm = sideMm(i); el.append(h("li", { text: `${n}: ${m.mode === "onbekend" || !mm ? "nog onbekend" : mShort(mm)}${m.mode && m.mode !== "precies" ? ` (${m.mode === "ongeveer" ? "geschat" : "voorbeeldmaat"})` : ""}` })); });
  el.append(h("li", { text: `Hoogte: ${st.hoogteCm} cm (${(st.hoogteCm / 100).toLocaleString("nl-NL")} meter)` }));
  if (st.poort === "ja") el.append(h("li", { text: `Poort: ${st.poortBreedteCm} cm doorgang` }));
  el.append(h("li", { class: "b-measure-status", text: `Maten: ${MEET_STATUS[overallMeasure()]}` }));
  el.append(h("li", { class: "b-muted", text: `Indicatie: ongeveer ${ind.panels + ind.fit} schuttingdelen en ${ind.posts} palen. Dit is een schatting, geen bestelling.` }));
}

/* ---------------- stappen tekenen ---------------- */
const stage = root.querySelector("[data-b-stage]");
const progress = document.querySelector("[data-b-progress]");
const bar = document.querySelector("[data-b-bar]");
preview.host = root.querySelector("[data-b-3d]");
preview.overlay = root.querySelector("[data-b-overlay]");

function helpBlock(key) {
  const c = HELP[key]; if (!c) return null;
  const id = `help-${key}`;
  const panel = h("div", { class: "b-help", id, hidden: true, role: "region", "aria-label": "Uitleg" },
    h("h3", { text: "Wat bedoelen we?" }), h("p", { text: c.wat }),
    h("h4", { text: "Zo doe je dat" }), h("ol", {}, c.zo.map((z) => h("li", { text: z }))),
    h("h4", { text: "Waarom vragen we dit?" }), h("p", { text: c.waarom }),
    h("h4", { text: "Voorbeeld" }), h("p", { text: c.voorbeeld }),
    h("h4", { text: "Ik weet het niet" }), h("p", {}, c.weetniet, " ", h("a", { href: dir("contact/") + "?help=schutting", text: "Of laat SEAL je helpen." })));
  const btn = h("button", { type: "button", class: "b-info", "aria-expanded": "false", "aria-controls": id, onclick: () => {
    const open = panel.hidden; panel.hidden = !open; btn.setAttribute("aria-expanded", String(open)); btn.querySelector("span").textContent = open ? "Uitleg sluiten" : "Uitleg: wat bedoelen we?";
    if (open) emit("measurement_help_opened", {});
  } }, h("span", { text: "Uitleg: wat bedoelen we?" }));
  const frag = document.createDocumentFragment();
  frag.append(btn, panel);
  return frag;
}

function choiceCards(name, options, current, onPick, opts = {}) {
  return h("div", { class: `b-cards ${opts.cls || ""}`, role: "radiogroup", "aria-label": opts.label || "" }, options.map((o) => {
    const id = `${name}-${o.id}`;
    const input = h("input", { type: "radio", name, id, value: o.id, checked: current === o.id, onchange: () => onPick(o.id) });
    return h("div", { class: "b-card-wrap" }, input, h("label", { for: id, class: "b-card" }, o.media || null, h("span", { class: "b-card-body" }, h("strong", { text: o.label }), o.sub ? h("span", { text: o.sub }) : null)));
  }));
}

function nav(id, list, canNext) {
  const i = list.indexOf(id), next = list[i + 1], prev = list[i - 1];
  const nextLabel = { materiaal: "Kies je schutting", vorm: "Kies de vorm" }[next] || (next === "aanvraag" ? "Vraag een voorstel aan" : next === "bekijk" ? "Bekijk jouw idee" : "Volgende");
  return h("div", { class: "b-nav" },
    prev ? h("button", { type: "button", class: "btn btn-secondary", onclick: () => go(prev) }, "Terug") : h("span"),
    next ? h("button", { type: "button", class: "btn btn-primary btn-lg", disabled: !canNext, onclick: () => go(next) }, nextLabel) : null);
}

function go(id) { st.step = id; save(); render(true); }

const stepperEl = document.querySelector("[data-b-stepper]");
const phaseTitle = document.querySelector("[data-b-phase-title]");
function renderStepper(list, id) {
  const phases = activePhases(list), cur = phases.findIndex((p) => p.steps.includes(baseId(id)));
  if (stepperEl) {
    stepperEl.textContent = "";
    phases.forEach((p, i) => {
      const first = list.find((x) => p.steps.includes(baseId(x)));
      const done = i < cur, active = i === cur;
      const li = h("li", { class: active ? "is-active" : done ? "is-done" : "" },
        h("button", { type: "button", "aria-current": active ? "step" : null, disabled: !done && !active, onclick: () => go(first) },
          h("span", { class: "b-dot", "aria-hidden": "true", text: done ? "✓" : String(i + 1) }), h("span", { class: "b-dot-label", text: p.label }), done ? h("span", { class: "visually-hidden", text: " (klaar)" }) : null));
      stepperEl.append(li);
    });
  }
  if (phaseTitle) phaseTitle.textContent = `Stap ${cur + 1}. ${phases[cur].title}`;
}

function render(focus) {
  const list = steps();
  if (!list.includes(st.step)) st.step = list[0];
  const id = st.step, idx = list.indexOf(id);
  progress.textContent = `Vraag ${idx + 1} van ${list.length}: ${shortOf(id)}`;
  bar.style.width = `${((idx + 1) / list.length) * 100}%`;
  renderStepper(list, id);
  root.dataset.step = id.split(":")[0];
  stage.textContent = "";
  const heading = h("h2", { class: "b-title", tabindex: "-1", text: titleOf(id) });
  stage.append(heading);
  const body = STEPS[id.split(":")[0]](id, list);
  stage.append(body);
  const showPreview = st.doel !== "herstel" && st.doel !== "weet-niet";
  root.classList.toggle("has-preview", showPreview);
  if (showPreview) { ensureScene().then(updatePreview); updatePreview(); if (id === "bekijk") emit("design_preview_seen", { material: st.materiaal || undefined }); }
  if (id.startsWith("lengte") || id === "hoogte" || id === "poortdetails") emit("quote_started", {});
  if (focus) { heading.focus({ preventScroll: true }); if (matchMedia("(max-width: 860px)").matches) heading.scrollIntoView({ block: "start", behavior: "smooth" }); }
}

const STEPS = {
  doel(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Kies wat het beste past. Je kunt altijd terug." }), helpBlock("doel") || "");
    body.append(choiceCards("doel", [
      { id: "nieuw", label: "Een nieuwe schutting plaatsen", sub: "Je kiest materiaal, maten en eventueel een poort." },
      { id: "herstel", label: "Mijn schutting repareren", sub: "Een losse plank of scheve paal? Dan hoeft er niets nieuws." },
      { id: "weet-niet", label: "Ik weet het niet", sub: "Wij denken met je mee." }
    ], st.doel, (v) => { st.doel = v; save(); emit("service_choice", { service: "schutting", route: v }); render(); }, { label: "Wat wil je doen?", cls: "b-cards-3" }));
    body.append(h("div", { class: "b-other" }, h("h3", { text: "Iets anders ontwerpen?" }), h("p", { class: "b-note", text: "Voor een terras, tuinindeling of plantenbakken gebruik je onze volledige 2D/3D-ontwerper." }),
      h("ul", { class: "b-other-list" }, [["Bestrating of terras", "Teken een terras of tuinpad"], ["Tuinindeling", "Teken je hele tuin"], ["Plantenbakken", "Plaats plantenbakken in je tuin"]].map(([t, d]) => h("li", {}, h("a", { class: "b-other-link", href: dir("project-samenstellen/"), onclick: () => emit("service_choice", { service: t.toLowerCase(), route: "volledige-ontwerper" }) }, h("strong", { text: t }), h("span", { text: d })))))));
    body.append(nav(id, list, !!st.doel));
    return body;
  },
  herstel(id, list) {
    const items = ["Een of meer planken zijn los of kapot", "Een paal staat scheef", "Delen zijn verrot", "De schutting is beschadigd door storm", "Anders"];
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Zet een vinkje bij wat past. Een foto sturen kan straks bij de aanvraag." }));
    body.append(h("fieldset", { class: "b-checks" }, h("legend", { class: "visually-hidden", text: "Wat is er stuk?" }), items.map((t, i) => {
      const cid = `herstel-${i}`;
      return h("div", { class: "b-check" }, h("input", { type: "checkbox", id: cid, checked: st.herstel.items.includes(t), onchange: (e) => { st.herstel.items = e.target.checked ? [...st.herstel.items, t] : st.herstel.items.filter((x) => x !== t); save(); } }), h("label", { for: cid, text: t }));
    })));
    body.append(h("p", { class: "b-note", text: "Wij stellen op afstand geen diagnose. Staat een schutting scheef of is er stormschade, dan komen we eerst kijken. Je hoeft geen nieuwe schutting te bestellen." }));
    body.append(h("label", { for: "herstel-tekst", class: "b-label", text: "Vertel kort wat je ziet (niet verplicht)" }), h("textarea", { id: "herstel-tekst", rows: 3, class: "b-input", oninput: (e) => { st.herstel.tekst = e.target.value.slice(0, 600); save(); } }, st.herstel.tekst));
    body.append(nav(id, list, true));
    return body;
  },
  hulp(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Geen probleem. Vertel ons kort wat er speelt, dan kijken wij mee. Een ontwerp is niet nodig." }), nav(id, list, true));
    return body;
  },
  materiaal(id, list) {
    const body = h("div", {});
    body.append(h("div", { class: "b-inspire" }, h("h3", { text: "Welke uitstraling wil je?" }), h("p", { class: "b-style-note", text: STIJL_NOTE }),
      choiceCards("stijl", STIJLEN.map((x) => ({ id: x.id, label: x.label, media: inspPic(x.photo, x.alt) })), st.stijl, (v) => { const x = STIJLEN.find((y) => y.id === v); st.stijl = v; st.materiaal = x.materiaal; save(); emit("material_selected", { material: x.materiaal }); render(); }, { label: "Kies een uitstraling", cls: "b-stijl" }),
      h("p", { class: "b-note", text: "Dit zijn inspiratiebeelden van mogelijke uitvoeringen, geen opgeleverde projecten van SEAL en geen exacte producten." })));
    body.append(h("p", { class: "b-sub", text: "Of kies direct het materiaal. Dit zijn voorbeelden uit ons eigen werk. Je ziet direct wat je kiest in de 3D. Je kunt later nog wisselen." }), helpBlock("materiaal") || "");
    body.append(choiceCards("materiaal", MATERIALS.map((m) => ({ id: m.id, label: m.label, media: photoPic(m.photo.name, m.photo.alt) })), st.materiaal, (v) => { st.materiaal = v; save(); emit("material_selected", { material: v }); render(); }, { label: "Kies een schutting", cls: "b-swatches" }));
    const cur = material();
    if (cur) {
      const sys = getFenceSystem(cur.system);
      body.append(h("div", { class: "b-detail" },
        h("figure", { class: "b-detail-fig" }, photoPic(cur.photo.name, cur.photo.alt), h("figcaption", { text: cur.photo.note })),
        h("div", { class: "b-detail-body" }, h("h3", { text: cur.label }), h("p", { text: cur.care }),
          h("details", {}, h("summary", { text: "Wat is dit precies?" }), h("p", { text: sys ? sys.buildUp : "" })),
          h("details", {}, h("summary", { text: "Onderhoud" }), h("p", { text: sys ? sys.maintenance : "" })),
          h("details", {}, h("summary", { text: "Welke hoogte past bij mij?" }), h("p", { text: "Dat hangt af van hoeveel privacy je wilt en wat in jouw gemeente is toegestaan. In de eerdere stap zie je wat 180 cm is. Wij denken graag mee." })),
          h("details", {}, h("summary", { text: "Is dit geschikt voor mijn tuin?" }), h("p", { text: "Dat hangt af van de ondergrond, de plek en de wind. Wij controleren dat voordat een prijs vaststaat. Je kunt altijd een ander materiaal kiezen." })))));
    } else body.append(h("p", { class: "b-note", text: "Kies een schutting om meer te lezen." }));
    body.append(nav(id, list, !!st.materiaal));
    return body;
  },
  vorm(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Kijk naar de rand van je tuin waar de schutting komt." }), helpBlock("vorm") || "");
    const icon = (k) => { const s = h("span", { class: "b-icon", html: shapeIcon(k) }); return s; };
    body.append(choiceCards("vorm", [
      { id: "recht", label: "Recht", sub: "Eén rechte lijn", media: icon("recht") },
      { id: "hoek", label: "Met een hoek", sub: "Achterkant en één zijkant", media: icon("hoek") },
      { id: "drie", label: "Langs drie kanten", sub: "Achterkant en beide zijkanten", media: icon("drie") },
      { id: "onbekend", label: "Weet ik niet", sub: "Geen probleem", media: icon("onbekend") }
    ], st.vorm, (v) => { st.vorm = v; st.lengtes = {}; save(); render(); }, { label: "Hoe loopt de schutting?", cls: "b-cards-2 b-cards-icons" }));
    body.append(nav(id, list, !!st.vorm));
    return body;
  },
  lengte(id, list) {
    const i = +id.split(":")[1], names = sideNames(), shape = st.vorm === "onbekend" ? "recht" : st.vorm;
    const m = sideMeasure(i);
    const body = h("div", { id: "meten" });
    body.append(h("p", { class: "b-sub", text: shape === "recht" ? "Meet langs de plek waar de schutting komt: van begin tot eind." : `Meet alleen de ${names[i].toLowerCase()}, van begin tot eind.` }));
    body.append(h("div", { class: "b-illus", html: shape === "recht" ? lengteIllus() : sideIllustration(shape, i) }));
    body.append(helpBlock("lengte") || "");
    const group = h("div", { class: "b-routes", role: "radiogroup", "aria-label": "Hoe zeker ben je van deze maat?" });
    ["precies", "ongeveer", "onbekend"].forEach((k) => {
      const rid = `route-${i}-${k}`;
      group.append(h("div", { class: "b-route" }, h("input", { type: "radio", name: `route-${i}`, id: rid, checked: m.mode === k, onchange: () => { st.lengtes[i] = { mode: k, text: k === "onbekend" ? "" : (st.lengtes[i] ? st.lengtes[i].text : "") }; save(); render(); } }), h("label", { for: rid, text: MEET[k] })));
    });
    body.append(group);
    let canNext = false;
    if (m.mode === "precies" || m.mode === "ongeveer") {
      const fid = `len-${i}`, out = h("p", { class: "b-echo", "aria-live": "polite" });
      const input = h("input", { id: fid, class: "b-input b-input-num", inputmode: "decimal", autocomplete: "off", placeholder: "Bijvoorbeeld 6,5", value: m.text || "", "aria-describedby": `${fid}-msg`, oninput: (e) => { st.lengtes[i] = { mode: m.mode, text: e.target.value }; save(); check(); } });
      const check = () => {
        const t = input.value.trim(), mm = parseMetersToMm(t);
        let msg = "", ok = false;
        if (!t) msg = "";
        else if (mm === null) msg = "Dit lijkt geen lengte te zijn. Vul bijvoorbeeld 6,5 meter in, of kies ‘Ik kan niet meten’.";
        else if (mm < 500 || mm > 60000) msg = "Een schutting korter dan 50 centimeter of langer dan 60 meter tekenen we hier niet. Neem contact met ons op voor maatwerk.";
        else { ok = true; msg = `Dat is ${metersText(mm)}${m.mode === "ongeveer" ? ". Wij controleren deze maat." : "."}`; }
        out.textContent = msg; out.className = `b-echo${t && !ok ? " is-error" : ""}`;
        const nb = stage.querySelector(".b-nav .btn-primary"); if (nb) nb.disabled = !ok;
        if (ok) updatePreview();
      };
      body.append(h("div", { class: "b-field" }, h("label", { for: fid, class: "b-label", text: m.mode === "precies" ? `Hoeveel meter is de ${shape === "recht" ? "schutting" : names[i].toLowerCase()}?` : "Ongeveer hoeveel meter?" }), h("div", { class: "b-unit" }, input, h("span", { text: "meter" })), out, h("span", { id: `${fid}-msg`, class: "visually-hidden", text: "Je mag een komma of een punt gebruiken." })));
      canNext = !!sideMm(i) && sideMm(i) === parseMetersToMm(input.value);
      setTimeout(check, 0);
    } else if (m.mode === "onbekend") {
      body.append(h("p", { class: "b-note", text: "Geen probleem. In het voorbeeld tekenen we 5 meter, alleen om te laten zien hoe het eruit kan zien. Straks kun je een foto of omschrijving meesturen. Wij komen de maten controleren voordat een prijs vaststaat." }));
      canNext = true;
    }
    body.append(nav(id, list, canNext));
    return body;
  },
  hoogte(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Meet van de grond tot de bovenkant. 180 cm is 1 meter en 80 centimeter." }));
    const il = h("div", { class: "b-illus", html: heightIllustration(st.hoogteCm), "data-height-illus": "" });
    body.append(il, helpBlock("hoogte") || "");
    body.append(h("div", { class: "b-chips", role: "radiogroup", "aria-label": "Hoogte van de schutting" }, HEIGHTS_CM.map((cm) => {
      const rid = `hoogte-${cm}`;
      return h("div", { class: "b-chipwrap" }, h("input", { type: "radio", name: "hoogte", id: rid, checked: st.hoogteCm === cm, onchange: () => { st.hoogteCm = cm; save(); il.innerHTML = heightIllustration(cm); updatePreview(); } }), h("label", { for: rid, text: `${cm} cm` }));
    })));
    body.append(h("p", { class: "b-note", text: "Het poppetje is een schematische schaalfiguur van 1,75 meter. Welke hoogtes er echt leverbaar zijn, hangt van het product af en bevestigen we in je offerte. Voor de toegestane hoogte in jouw tuin gelden lokale regels. Wij denken daarover mee." }));
    body.append(nav(id, list, true));
    return body;
  },
  poort(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Een poort is een deur in je schutting, zodat je erdoor kunt lopen." }), h("div", { class: "b-illus", html: gateIllustration() }), h("figure", { class: "b-gate-photo" }, inspPic("poort-hout-pad-dag", "Houten tuinpoort met horizontale planken en een pad van natuursteentegels"), h("figcaption", { text: "Inspiratiebeeld van een poort in dezelfde stijl als de schutting, geen opgeleverd project." })), helpBlock("poort") || "");
    body.append(choiceCards("poort", [{ id: "ja", label: "Ja" }, { id: "nee", label: "Nee" }, { id: "later", label: "Weet ik nog niet" }], st.poort, (v) => { st.poort = v; save(); render(); }, { label: "Wil je een poort?", cls: "b-cards-3 b-cards-plain" }));
    body.append(nav(id, list, !!st.poort));
    return body;
  },
  poortdetails(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Hoe breed moet de opening zijn om doorheen te lopen? Dat is de vrije ruimte, niet de paal." }));
    body.append(h("div", { class: "b-chips", role: "radiogroup", "aria-label": "Doorgangsbreedte van de poort" }, GATE_WIDTHS_CM.map((cm) => {
      const rid = `pb-${cm}`;
      return h("div", { class: "b-chipwrap" }, h("input", { type: "radio", name: "pb", id: rid, checked: st.poortBreedteCm === cm, onchange: () => { st.poortBreedteCm = cm; save(); render(); } }), h("label", { for: rid, text: `${cm} cm` }));
    })));
    if (sideNames().length > 1) body.append(h("div", { class: "b-field" }, h("p", { class: "b-label", text: "In welke kant komt de poort?" }), choiceCards("pz", sideNames().map((n, i) => ({ id: String(i), label: n })), String(st.poortZijde || 0), (v) => { st.poortZijde = +v; save(); render(); }, { label: "Kant van de poort", cls: "b-cards-3 b-cards-plain" })));
    body.append(h("div", { class: "b-field" }, h("p", { class: "b-label", text: "Waar in de schutting?" }), choiceCards("pp", [{ id: "links", label: "Links" }, { id: "midden", label: "In het midden" }, { id: "rechts", label: "Rechts" }, { id: "seal", label: "SEAL mag dit bepalen" }], st.poortPlek, (v) => { st.poortPlek = v; save(); render(); }, { label: "Plek van de poort", cls: "b-cards-2 b-cards-plain" })));
    const errs = validateFenceGates(buildProject().fence);
    if (errs.length) body.append(h("p", { class: "b-echo is-error", role: "alert", text: "Voor deze plek is de poort te breed. Kies een andere plek of een smallere poort, of vraag ons om hulp." }));
    body.append(nav(id, list, !errs.length));
    return body;
  },
  werk(id, list) {
    const body = h("div", {});
    body.append(h("p", { class: "b-sub", text: "Kies wat je wilt. Je ziet altijd eerst een offerte, je zit nergens aan vast." }), helpBlock("werk") || "");
    body.append(choiceCards("werk", Object.entries(WERK).map(([k, v]) => ({ id: k, label: v, sub: { "alleen-materiaal": "Wij plaatsen niets.", "met-montage": "Eén offerte, materiaal en werk apart zichtbaar.", "alleen-montage": "Wij controleren vooraf of je materiaal geschikt is." }[k] })), st.werk, (v) => { st.werk = v; save(); render(); }, { label: "Wie regelt het werk?", cls: "b-cards-3 b-cards-plain" }));
    if (st.werk === "met-montage" || st.werk === "alleen-montage") {
      body.append(h("div", { class: "b-field" }, h("p", { class: "b-label", text: "Extra (niet vooraf aangevinkt)" }), h("div", { class: "b-check" }, h("input", { type: "checkbox", id: "oudweg", checked: st.oudWeg, onchange: (e) => { st.oudWeg = e.target.checked; if (!st.oudWeg) st.afvoer = false; save(); render(); } }), h("label", { for: "oudweg", text: "Mijn oude schutting weghalen" })), st.oudWeg ? h("div", { class: "b-check" }, h("input", { type: "checkbox", id: "afvoer", checked: st.afvoer, onchange: (e) => { st.afvoer = e.target.checked; save(); } }), h("label", { for: "afvoer", text: "En het afval meenemen" })) : null, h("p", { class: "b-note", text: "Weghalen en afvoeren kan extra kosten. Dat staat dan apart in je offerte." })));
    }
    body.append(nav(id, list, !!st.werk));
    return body;
  },
  bekijk(id, list) {
    const body = h("div", {});
    const mat = material(), p = buildProject(), ind = indication(p);
    body.append(h("p", { class: "b-sub", text: "Dit is een voorbeeld op basis van jouw keuzes. Het is geen exacte bouwtekening." }));
    body.append(h("div", { class: "b-compare" },
      h("figure", { class: "b-fig" }, photoPic(mat.photo.name, mat.photo.alt), h("figcaption", {}, h("strong", { text: "Echt voorbeeld" }), h("span", { text: mat.photo.note }))),
      h("div", { class: "b-fig b-fig-3d" }, h("strong", { text: "Voorbeeld in 3D" }), h("span", { text: "Het 3D-voorbeeld hierboven toont het materiaaltype dat je koos. Het is een weergave van de uitstraling, niet het exacte artikel." }))));
    body.append(h("div", { class: "b-card-info", "data-transparantie": "" }, h("h3", { text: "Wat kost het en wat staat nog open?" }),
      h("p", { class: "b-note", text: "Dit is een indicatie, geen offerte. Er staan nog geen bedragen, omdat de maten en het product eerst gecontroleerd worden. Daarna zie je alle prijzen apart." }),
      h("dl", { class: "b-costs" },
        ...[["Materialen", st.werk === "alleen-montage" ? "Heb je zelf" : "Wordt berekend na controle"], ["Bezorgen", st.werk === "alleen-montage" ? "Niet nodig" : "Wordt berekend na controle"], ["Montage", st.werk === "alleen-materiaal" ? "Niet gekozen" : "Wordt berekend na controle"], ["Oude materialen verwijderen", st.oudWeg ? "Wordt berekend na controle" : "Niet gekozen"], ["Btw", "Staat in je offerte"], ["Nog te controleren", [overallMeasure() !== "precies" ? "de maten" : null, "de ondergrond en toegang", "het gekozen product en de hoogte"].filter(Boolean).join(", ")]].flatMap(([k, v]) => [h("dt", { text: k }), h("dd", { text: v })])),
      h("p", { class: "b-muted", text: `Indicatie van onderdelen: ongeveer ${ind.panels + ind.fit} schuttingdelen en ${ind.posts} palen.` }),
      helpBlock("maten") || ""));
    const enc = encodeShare(p);
    const shareUrl = enc ? dir("project-samenstellen/") + `#ontwerp=${enc}` : "";
    const msg = h("p", { class: "b-muted", role: "status", "aria-live": "polite", text: "Je keuzes zijn bewaard op dit apparaat. Ze worden niet naar andere apparaten gestuurd." });
    const sides = sideNames().map((n, i) => { const m = sideMeasure(i), mm = sideMm(i); return `${n.toLowerCase()} ${m.mode === "onbekend" || !mm ? "onbekend" : mShort(mm)}`; }).join(", ");
    const row = (thumb, title, sub, stepId) => h("li", { class: "b-plan-row" }, thumb, h("span", { class: "b-plan-text" }, h("strong", { text: title }), h("span", { text: sub })), h("button", { type: "button", class: "btn btn-secondary btn-sm", onclick: () => go(stepId), "aria-label": `${title} bewerken` }, "Bewerken"));
    const icon = (path) => h("span", { class: "b-plan-icon", html: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="${path}"/></svg>` });
    const rows = [row(photoPic(mat.photo.name, mat.photo.alt, "b-plan-thumb"), `${mat.label} schutting`, `${sides} · ${st.hoogteCm} cm hoog · maten: ${overallMeasure()}`, "lengte:0")];
    if (st.poort === "ja") rows.push(row(icon("M4 20V6l8-3 8 3v14M9 20v-7h6v7"), "Poort", `${st.poortBreedteCm} cm doorgang, plek: ${st.poortPlek === "seal" ? "SEAL bepaalt" : st.poortPlek}`, "poortdetails"));
    rows.push(row(icon("M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"), WERK[st.werk] || "Nog geen keuze", st.oudWeg ? "Oude schutting weghalen" + (st.afvoer ? " en afvoeren" : "") : "Geen extra werk gekozen", "werk"));
    body.append(h("div", { class: "b-plan b-tuinplan", id: "tuinplan" }, h("h3", { text: "Uw tuinplan" }),
      h("p", { class: "b-muted", text: "Dit is een overzicht van je keuzes. Er staan geen prijzen: die volgen in je offerte, na controle van maten en product." }),
      h("ul", { class: "b-plan-rows" }, rows),
      h("div", { class: "b-plan-total" }, h("strong", { text: "Prijs" }), h("span", { text: "Volgt in je offerte" })),
      h("div", { class: "b-plan-actions" },
        h("button", { type: "button", class: "btn btn-secondary btn-sm", onclick: async () => { if (!shareUrl) { msg.textContent = "Dit ontwerp is te groot voor een link."; return; } try { await navigator.clipboard.writeText(shareUrl); msg.textContent = "Link gekopieerd. Wie de link opent, ziet dit ontwerp."; } catch (e) { msg.textContent = "Kopiëren lukte niet. Gebruik de link onderaan."; } } }, "Delen"),
        h("button", { type: "button", class: "btn btn-secondary btn-sm", onclick: () => { save(); msg.textContent = "Opgeslagen op dit apparaat."; } }, "Opslaan"),
        h("button", { type: "button", class: "btn btn-secondary btn-sm", onclick: () => { document.body.classList.add("print-plan"); window.print(); setTimeout(() => document.body.classList.remove("print-plan"), 500); } }, "Afdrukken of pdf")),
      msg,
      shareUrl ? h("a", { class: "v-link", href: shareUrl, text: "Nauwkeurig tekenen (voor ervaren gebruikers)" }) : null));
    body.append(nav(id, list, true));
    return body;
  },
  aanvraag(id, list) {
    const body = h("div", {});
    const p = st.doel === "nieuw" ? buildProject() : null;
    const enc = p ? encodeShare(p) : null;
    const designUrl = enc ? dir("project-samenstellen/") + `#ontwerp=${enc}` : "";
    const text = [...summaryLines(), designUrl ? `Ontwerp: ${designUrl}` : ""].filter(Boolean).join("\n");
    body.append(h("p", { class: "b-sub", text: "Vul je gegevens in. Wij nemen contact met je op. Dit is een vrijblijvende vraag, geen bestelling." }));
    body.append(h("div", { class: "b-plan" }, h("h3", { text: "Dit sturen we mee" }), h("ul", { class: "b-plan-list" }, summaryLines().map((l) => h("li", { text: l })))));
    const f = (label, name, attrs = {}) => h("div", { class: "field" }, h("label", { for: name, text: label + (attrs.required ? "*" : "") }), h("input", { id: name, name, class: "b-input", ...attrs }), attrs.required ? h("span", { class: "error-msg", text: attrs.err || "Dit veld is verplicht." }) : null);
    const form = h("form", { "data-contact-form": "", "data-lead-kind": "configurator", "data-subject-prefix": "Aanvraag schutting via website", novalidate: true, class: "b-form" },
      h("div", { class: "form-grid" },
        f("Naam", "naam", { type: "text", required: true, autocomplete: "name", err: "Vul je naam in." }),
        f("Telefoonnummer", "telefoon", { type: "tel", required: true, autocomplete: "tel", err: "Vul een telefoonnummer in." }),
        f("E-mailadres", "email", { type: "email", required: true, autocomplete: "email", err: "Vul een geldig e-mailadres in." }),
        f("Postcode", "postcode", { type: "text", required: true, autocomplete: "postal-code", err: "Vul je postcode in." }),
        f("Woonplaats", "woonplaats", { type: "text", required: true, autocomplete: "address-level2", err: "Vul je woonplaats in." }),
        h("div", { class: "field" }, h("label", { for: "contactvoorkeur", text: "Hoe neem je liefst contact op?" }), h("select", { id: "contactvoorkeur", name: "contactvoorkeur", class: "b-input" }, ["Geen voorkeur", "Bel mij", "WhatsApp", "E-mail"].map((o) => h("option", { text: o }))))),
      h("input", { type: "hidden", name: "werkzaamheden", value: "Schutting plaatsen/vervangen" }),
      h("input", { type: "hidden", name: "maatstatus", value: st.doel === "nieuw" ? overallMeasure() : "onbekend" }),
      h("input", { type: "hidden", name: "werkroute", value: st.werk || st.doel || "" }),
      h("div", { class: "field full" }, h("label", { for: "omschrijving", text: "Je omschrijving (je mag dit aanvullen)*" }), h("textarea", { id: "omschrijving", name: "omschrijving", class: "b-input", rows: 7, required: true }, text), h("span", { class: "error-msg", text: "Geef een korte omschrijving." })),
      h("div", { class: "field full" }, h("label", { for: "fotos", text: "Foto’s van de plek (niet verplicht)" }), h("input", { type: "file", id: "fotos", name: "fotos", accept: "image/*", multiple: true, "data-file-input": "" }), h("div", { class: "hint", "data-file-count": "" }), h("p", { class: "b-muted", text: "Foto’s gebruiken we alleen om je aanvraag te beoordelen. Een foto is geen exacte maat; wij controleren de maten zelf." })),
      h("div", { class: "field full" }, h("div", { class: "b-check" }, h("input", { type: "checkbox", id: "privacy", name: "privacy", required: true }), h("label", { for: "privacy", html: `Ik ga akkoord met de <a href="${dir("privacy/")}" target="_blank" rel="noopener">privacyverklaring</a>*` })), h("span", { class: "error-msg", text: "Bevestig dat je akkoord gaat met de privacyverklaring." })),
      h("button", { type: "submit", class: "btn btn-primary btn-lg btn-block", text: "Verstuur mijn aanvraag" }),
      h("a", { href: "#", "data-mailto-fallback": "", class: "btn btn-secondary btn-block", style: "margin-top:.8rem", hidden: true, text: "Verstuur mijn aanvraag via e-mail" }));
    body.append(h("div", { class: "form-status", "data-form-status": "", hidden: true, role: "status" }), form);
    form.addEventListener("submit", () => emit("quote_submitted", {}), { capture: true });
    const prev = list[list.indexOf(id) - 1];
    body.append(h("div", { class: "b-nav" }, h("button", { type: "button", class: "btn btn-secondary", onclick: () => go(prev) }, "Terug"), h("button", { type: "button", class: "link-btn", onclick: reset }, "Opnieuw beginnen")));
    setTimeout(() => window.__sealBindContactForm && window.__sealBindContactForm(), 0);
    return body;
  }
};

function lengteIllus() { return lengthIllustration(); }

function showFailure(e) {
  stage.textContent = "";
  stage.append(h("h2", { class: "b-title", text: "Er ging iets mis" }), h("p", { class: "b-sub", text: "De ontwerphulp kon deze stap niet laten zien. Je keuzes zijn niet verloren. Je kunt ook zonder ontwerp een offerte aanvragen." }),
    h("div", { class: "b-fallback-links" }, h("a", { class: "btn btn-primary btn-lg", href: dir("contact/"), text: "Vraag een offerte aan" }), h("button", { type: "button", class: "btn btn-secondary btn-lg", onclick: () => location.reload(), text: "Probeer opnieuw" })),
    h("details", {}, h("summary", { text: "Technische melding" }), h("pre", { text: String(e && e.stack || e).slice(0, 600) })));
}
window.addEventListener("error", (ev) => { if (!root.dataset.failed && ev.error && stage && !stage.children.length) { root.dataset.failed = "1"; showFailure(ev.error); } });

function reset() { st = fresh(); preview.showDims = true; save(); render(true); }

/* ---------------- preview-bediening ---------------- */
root.querySelector("[data-b-view-top]")?.addEventListener("click", () => preview.scene && preview.scene.setView("top"));
root.querySelector("[data-b-view-iso]")?.addEventListener("click", () => preview.scene && preview.scene.setView("iso"));
root.querySelector("[data-b-view-front]")?.addEventListener("click", () => preview.scene && preview.scene.setView("front"));
root.querySelector("[data-b-view-reset]")?.addEventListener("click", () => preview.scene && preview.scene.resetCamera());
const dimBtn = root.querySelector("[data-b-dims]");
dimBtn?.addEventListener("click", () => { preview.showDims = !preview.showDims; dimBtn.setAttribute("aria-pressed", String(preview.showDims)); dimBtn.textContent = preview.showDims ? "Maten verbergen" : "Toon maten"; drawDims(); });
const decorBtn = root.querySelector("[data-b-decor]");
decorBtn?.addEventListener("click", () => { preview.decor = !preview.decor; decorBtn.setAttribute("aria-pressed", String(preview.decor)); decorBtn.textContent = preview.decor ? "Alleen mijn keuzes tonen" : "Voorbeeldtuin tonen"; updatePreview(); setStatus(preview.decor ? "De planten, het terras en het gras zijn een voorbeeldinrichting. Ze horen niet bij je aanvraag." : "Je ziet alleen de onderdelen die je zelf koos."); });
root.querySelector("[data-b-reset]")?.addEventListener("click", reset);
document.querySelectorAll("[data-b-mode]").forEach((b) => b.addEventListener("click", () => { if (!b.disabled) setMode(b.dataset.bMode); }));

if (loadedFromStore) setStatus("Je eerdere keuzes zijn terug. Ze zijn bewaard op dit apparaat.");
try { render(false); } catch (e) { showFailure(e); }
root.dataset.ready = "1";
