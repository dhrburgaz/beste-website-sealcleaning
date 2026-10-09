/**
 * Hoofdcontroller voor /project-samenstellen/. Bouwt projectstate op uit
 * formulierinvoer, rendert de 2D/SVG-scene altijd, en laadt de 3D-laag pas
 * na bewuste opening en alleen met WebGL2 (ch.16/27).
 */
import {
  createEmptyProject, parseMetersToMm, mmToMeters, formatMeters, formatM2,
  deriveFenceLengths, validateFenceGates, derivePavingTotals,
  findPavingOverlaps, generateId, assertSerializable, withDefaults
} from "../project-state.js";
import { checkServiceArea } from "../../data/service-area.js";
import { estimateWaste } from "./waste.js";
import { OBJECT_TYPES, OBJECT_STATUSES, getObjectType, objectQuantity } from "../../data/garden-objects.js";
import { renderScene } from "./svg-scene.js";
import { SERVICES, GARDEN_SCENE_SERVICE_IDS } from "../../data/services.js";
import { FENCE_SHAPES, FENCE_HEIGHTS_MM, FENCE_SYSTEMS, FENCE_MATERIAL_PRESETS } from "../../data/fence-systems.js";
import { PAVING_FORMATS_MM, PAVING_PATTERNS, PAVING_COLOR_PRESETS } from "../../data/paving-products.js";
import { getPavingProduct, getPavingProductsForFormat } from "../../data/materials.js";
import { attachSvgInteraction, snapMm } from "./svg-interaction.js";
import { MAX_VARIANTS, captureChoices, applyChoices, sameChoices, pavingIndication, describeChoices, diffChoices } from "./variants.js";
import { toDesignPayload, sanitizeDesign, encodeShare, decodeShare, MAX_FILE_BYTES } from "./design-io.js";
import { computeGateSwing, lPolygon, polygonAreaMm2, polygonBounds, findPolygonProblem, gardenPolygon } from "./geometry.js";

let priceSourcesCache = null;
/** fetch() i.p.v. een JSON-importattribuut: breder browserondersteund, geen baseline-risico. */
async function loadPriceSources() {
  if (priceSourcesCache) return priceSourcesCache;
  try {
    const res = await fetch(new URL("../../data/price-sources.json", import.meta.url));
    priceSourcesCache = await res.json();
  } catch (e) {
    priceSourcesCache = { rows: [], unresolved: [] };
  }
  return priceSourcesCache;
}

const STORAGE_KEY = "sealConfiguratorProject";
const STORAGE_DAYS = 30;
const STEPS = ["project", "maten", "materialen", "situatie", "overzicht"];
const STEP_LABELS = { project: "Uw project", maten: "Maten & vorm", materialen: "Materialen", situatie: "Situatie", overzicht: "Overzicht" };

export function initConfigurator(root) {
  let project = loadSavedProject() || createEmptyProject();
  let stepIndex = 0;
  let sceneController = null; // 3D controller, lazy
  let currentView = "2d";
  let selectedId = null; // geselecteerd object in de 2D-tekening (vlak-id of "vertex-<n>")
  const snap = { enabled: false, stepMm: 500 };
  const history = { stack: [], index: -1, max: 60 };
  let dragOrigin = null;

  const svg = root.querySelector("[data-scene-svg]");
  const stepNav = root.querySelector("[data-step-nav]");
  const panel = root.querySelector("[data-step-panel]");
  const ariaLive = root.querySelector("[data-scene-aria-live]");
  const canvasHost = root.querySelector("[data-scene-canvas-host]");
  const sceneStatus = root.querySelector("[data-scene-status]");
  // De mobiele balk staat buiten root (onderaan <main>, sticky), dus op document zoeken.
  const mobileBar = root.querySelector("[data-configurator-mobile-bar]") || document.querySelector("[data-configurator-mobile-bar]");
  const editControls = root.querySelector("[data-edit-controls]");
  const designTools = root.querySelector("[data-design-tools]");
  let designMessage = null; // { text, error }

  function persist() {
    try {
      const payload = { savedAt: new Date().toISOString(), project: assertSerializable(project) };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      /* privénavigatie of volle opslag: ontwerp blijft gewoon in geheugen */
    }
  }

  function loadSavedProject() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      const ageDays = (Date.now() - new Date(payload.savedAt).getTime()) / 86400000;
      if (ageDays > STORAGE_DAYS) {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return withDefaults(payload.project);
    } catch (e) {
      return null;
    }
  }

  function clearSaved() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    project = createEmptyProject();
    stepIndex = 0;
    renderAll();
  }

  function announceScene() {
    if (!ariaLive) return;
    const fenceLen = project.fence ? deriveFenceLengths(project.fence).totalLineLengthMm : 0;
    const paving = project.paving ? derivePavingTotals(project.paving).totalM2 : 0;
    const bits = [];
    if (fenceLen) bits.push(`schutting ${formatMeters(fenceLen, 1)}`);
    if (paving) bits.push(`bestrating ${formatM2(paving, 1)}`);
    ariaLive.textContent = bits.length ? `Bijgewerkt: ${bits.join(", ")}.` : "Ontwerp bijgewerkt.";
  }

  function renderScenes() {
    if (svg) {
      renderScene(svg, project, { gridMm: snap.enabled ? snap.stepMm : 0, selectedId, editable: true });
      svg.classList.toggle("is-editing", !!selectedId);
    }
    if (sceneController) sceneController.update(project);
    announceScene();
  }

  /* ---- Ongedaan maken / opnieuw (E04): momentopnamen van de volledige state ---- */
  function recordHistory() {
    const snapshot = JSON.stringify(project);
    if (history.stack[history.index] === snapshot) return;
    history.stack = history.stack.slice(0, history.index + 1);
    history.stack.push(snapshot);
    if (history.stack.length > history.max) history.stack.shift();
    history.index = history.stack.length - 1;
  }
  function stepHistory(delta) {
    const target = history.index + delta;
    if (target < 0 || target >= history.stack.length) return;
    history.index = target;
    project = JSON.parse(history.stack[target]);
    selectedId = null;
    renderAll();
    if (ariaLive) ariaLive.textContent = delta < 0 ? "Laatste wijziging ongedaan gemaakt." : "Wijziging opnieuw toegepast.";
  }

  function renderEditControls() {
    if (!editControls) return;
    editControls.innerHTML = "";
    const mk = (label, aria, onClick, disabled) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label; b.setAttribute("aria-label", aria);
      b.disabled = !!disabled; b.addEventListener("click", onClick);
      editControls.appendChild(b);
      return b;
    };
    mk("↶", "Ongedaan maken (Ctrl+Z)", () => stepHistory(-1), history.index <= 0);
    mk("↷", "Opnieuw (Ctrl+Shift+Z)", () => stepHistory(1), history.index >= history.stack.length - 1);

    const snapLabel = document.createElement("label");
    snapLabel.className = "scene-snap-toggle";
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = snap.enabled;
    cb.addEventListener("change", () => { snap.enabled = cb.checked; renderEditControls(); renderScenes(); });
    snapLabel.appendChild(cb);
    snapLabel.appendChild(document.createTextNode(" Raster"));
    editControls.appendChild(snapLabel);
    const stepSel = document.createElement("select");
    stepSel.setAttribute("aria-label", "Rastermaat");
    [[100, "10 cm"], [250, "25 cm"], [500, "50 cm"], [1000, "1 m"]].forEach(([mm, label]) => {
      const o = document.createElement("option");
      o.value = mm; o.textContent = label; o.selected = snap.stepMm === mm;
      stepSel.appendChild(o);
    });
    stepSel.disabled = !snap.enabled;
    stepSel.addEventListener("change", () => { snap.stepMm = parseInt(stepSel.value, 10); renderEditControls(); renderScenes(); });
    editControls.appendChild(stepSel);
    const status = document.createElement("span");
    status.className = "scene-snap-status";
    status.setAttribute("role", "status");
    status.textContent = snap.enabled ? `Snap aan · ${snap.stepMm >= 1000 ? snap.stepMm / 1000 + " m" : snap.stepMm / 10 + " cm"}` : "Snap uit";
    editControls.appendChild(status);
    mk("⛶", "Werkvlak vergroten", () => setFullscreen(!root.classList.contains("is-canvas-fullscreen")));
  }

  function setFullscreen(on) {
    root.classList.toggle("is-canvas-fullscreen", on);
    document.documentElement.classList.toggle("configurator-fullscreen-lock", on);
    const exitBtn = root.querySelector("[data-canvas-exit]");
    if (exitBtn) { exitBtn.hidden = !on; if (on) exitBtn.focus(); }
    renderScenes();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-canvas-fullscreen")) { setFullscreen(false); return; }
    const tag = (e.target && e.target.tagName) || "";
    if (/INPUT|SELECT|TEXTAREA/.test(tag)) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      stepHistory(e.shiftKey ? 1 : -1);
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      stepHistory(1);
    }
  });

  /* ---- Ontwerp opslaan, openen en delen (alleen niet-persoonlijke state) ---- */
  function adoptProject(next, message) {
    recordHistory();
    project = withDefaults(next);
    if (usesFence()) ensureFenceDefaults();
    if (usesPaving()) ensurePavingDefaults();
    fitGardenToContent();
    selectedId = null;
    stepIndex = project.services.length ? 1 : 0;
    designMessage = { text: message, error: false };
    renderAll();
  }

  function renderDesignTools() {
    if (!designTools) return;
    const body = designTools.querySelector("[data-design-tools-body]");
    body.innerHTML = "";
    const row = document.createElement("div");
    row.className = "btn-row";

    const dl = document.createElement("button");
    dl.type = "button";
    dl.className = "btn btn-secondary btn-sm";
    dl.textContent = "Download ontwerpbestand";
    dl.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(toDesignPayload(project), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sealcleaning-ontwerp-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      designMessage = { text: "Ontwerpbestand gedownload. Open het later hier via ‘Ontwerpbestand openen’.", error: false };
      renderDesignTools();
    });
    row.appendChild(dl);

    const openLabel = document.createElement("label");
    openLabel.className = "btn btn-secondary btn-sm design-file-label";
    openLabel.textContent = "Ontwerpbestand openen";
    const file = document.createElement("input");
    file.type = "file";
    file.accept = ".json,application/json";
    file.className = "visually-hidden";
    file.addEventListener("change", () => {
      const f = file.files && file.files[0];
      if (!f) return;
      if (f.size > MAX_FILE_BYTES) {
        designMessage = { text: "Dit bestand is te groot voor een ontwerpbestand.", error: true };
        renderDesignTools();
        return;
      }
      f.text().then((text) => {
        const next = sanitizeDesign(JSON.parse(text));
        adoptProject(next, "Ontwerpbestand geopend. Met ↶ gaat u terug naar uw vorige ontwerp.");
      }).catch((e) => {
        designMessage = { text: e instanceof SyntaxError ? "Dit bestand is geen geldig ontwerpbestand." : e.message, error: true };
        renderDesignTools();
      });
    });
    openLabel.appendChild(file);
    row.appendChild(openLabel);

    const share = document.createElement("button");
    share.type = "button";
    share.className = "btn btn-secondary btn-sm";
    share.textContent = "Maak deellink";
    share.addEventListener("click", async () => {
      const encoded = encodeShare(project);
      if (!encoded) {
        designMessage = { text: "Dit ontwerp is te groot voor een link. Gebruik ‘Download ontwerpbestand’ en deel het bestand.", error: true };
        renderDesignTools();
        return;
      }
      const link = `${location.origin}${location.pathname}#ontwerp=${encoded}`;
      let copied = false;
      try { await navigator.clipboard.writeText(link); copied = true; } catch (e) { /* handmatig kopiëren via veld */ }
      designMessage = { text: copied ? "Deellink gekopieerd." : "Kopieer de link hieronder.", error: false, link };
      renderDesignTools();
    });
    row.appendChild(share);
    body.appendChild(row);

    if (designMessage) {
      const msg = document.createElement("p");
      msg.className = designMessage.error ? "field-error" : "field-hint";
      msg.setAttribute("role", designMessage.error ? "alert" : "status");
      msg.textContent = designMessage.text;
      body.appendChild(msg);
      if (designMessage.link) {
        const input = document.createElement("input");
        input.type = "text";
        input.readOnly = true;
        input.value = designMessage.link;
        input.className = "design-share-input";
        input.setAttribute("aria-label", "Deellink");
        input.addEventListener("focus", () => input.select());
        body.appendChild(input);
      }
    }
  }

  function openSharedDesignFromHash() {
    const m = /^#ontwerp=([A-Za-z0-9_-]+)$/.exec(location.hash || "");
    if (!m) return;
    try {
      const next = decodeShare(m[1]);
      adoptProject(next, "U bekijkt een gedeeld ontwerp. Uw eigen opgeslagen ontwerp is niet overschreven; met ↶ gaat u terug.");
      if (designTools) designTools.open = true;
    } catch (e) {
      designMessage = { text: e.message, error: true };
      if (designTools) designTools.open = true;
    }
    try { window.history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* oude browser */ }
  }

  /* ---- Selecteren en slepen in 2D (E01/E02) ---- */
  function findDragObject(target) {
    if (target.kind === "area") return project.paving?.areas.find((a) => a.id === target.id)?.position || null;
    if (target.kind === "vertex") return project.garden.polygon?.[target.index] || null;
    if (target.kind === "object") {
      const o = project.existingObjects?.find((x) => x.id === target.id);
      return o && !o.locked ? o.footprint : null;
    }
    return null;
  }
  if (svg && "ResizeObserver" in window) {
    let pending = false;
    new ResizeObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; if (project.garden.shape === "free") renderScenes(); });
    }).observe(svg);
  }
  if (svg) {
    attachSvgInteraction(svg, {
      getSelectedId: () => selectedId,
      onSelect: (id) => {
        selectedId = id;
        renderScenes();
        if (STEPS[stepIndex] === "maten") renderPanel();
      },
      onDragMove: (target, delta) => {
        const obj = findDragObject(target);
        if (!obj) return;
        if (!dragOrigin) dragOrigin = { xMm: obj.xMm, zMm: obj.zMm };
        const step = snap.enabled ? snap.stepMm : 0;
        obj.xMm = Math.max(0, snapMm(dragOrigin.xMm + delta.dxMm, step));
        obj.zMm = Math.max(0, snapMm(dragOrigin.zMm + delta.dzMm, step));
        renderScenes();
      },
      onDragEnd: (moved) => {
        dragOrigin = null;
        if (moved) { fitGardenToContent(); renderScenesAndSummary(); }
      }
    });
  }

  function renderStepNav() {
    stepNav.innerHTML = "";
    STEPS.forEach((key, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${i + 1}. ${STEP_LABELS[key]}`;
      btn.setAttribute("aria-current", i === stepIndex ? "step" : "false");
      btn.disabled = i > stepIndex && !canAdvanceTo(i);
      btn.addEventListener("click", () => goToStep(i));
      stepNav.appendChild(btn);
    });
  }

  function canAdvanceTo(i) {
    if (i === 0) return true;
    if (i >= 1 && project.services.length === 0) return false;
    return true;
  }

  function goToStep(i) {
    stepIndex = Math.max(0, Math.min(STEPS.length - 1, i));
    renderAll();
    scrollPanelIntoView();
  }

  /** Scroll naar het stappaneel, rekening houdend met vaste header en (mobiel) vaste tekening. */
  function scrollPanelIntoView() {
    const header = document.querySelector(".site-header");
    const sticky = root.querySelector(".scene-sticky");
    let offset = header ? header.offsetHeight : 0;
    if (sticky && getComputedStyle(sticky).position === "sticky") offset += sticky.offsetHeight;
    const target = stepNav.getBoundingClientRect().top + window.scrollY - offset - 8;
    if (Math.abs(target - window.scrollY) > 4) window.scrollTo({ top: target, behavior: "smooth" });
  }

  function syncStickyTop() {
    const header = document.querySelector(".site-header");
    const headerH = header ? header.offsetHeight : 0;
    root.style.setProperty("--cfg-sticky-top", `${headerH}px`);
    const sticky = root.querySelector(".scene-sticky");
    const stickyH = sticky && getComputedStyle(sticky).position === "sticky" ? sticky.offsetHeight : 0;
    document.documentElement.style.scrollPaddingTop = `${headerH + stickyH + 8}px`;
  }
  syncStickyTop();
  window.addEventListener("resize", syncStickyTop);
  root.dataset.view = "2d";

  function usesFence() { return project.services.includes("schutting"); }
  function usesPaving() { return project.services.includes("bestrating"); }
  function usesGardenScene() { return project.services.some((s) => GARDEN_SCENE_SERVICE_IDS.includes(s)); }

  function ensureFenceDefaults() {
    if (!project.fence) {
      project.fence = {
        shape: "I", systemId: "generic-wood-concrete", heightMm: 1800,
        materialPresetId: "natural-wood-grey-concrete", sections: [], gates: []
      };
      rebuildFenceSections("I", [5000]);
    }
  }
  function ensurePavingDefaults() {
    if (!project.paving) {
      project.paving = {
        areas: [{ id: generateId("area"), lengthMm: 6000, widthMm: 4000, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: "terras" }],
        productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "light-grey"
      };
    }
  }

  /** Herbouwt de secties van een schutting-vorm met gegeven zijlengtes (mm), haaks verbonden. */
  function rebuildFenceSections(shape, lengthsMm) {
    const dirs = { I: [0], "L-left": [0, 90], "L-right": [0, -90], U: [0, 90, 180] };
    const directions = dirs[shape] || lengthsMm.map((_, i) => (i * 90) % 360);
    const sections = [];
    let cursor = { xMm: 0, zMm: 0 };
    const letters = ["A", "B", "C", "D", "E", "F"];
    lengthsMm.forEach((lengthMm, i) => {
      const directionDeg = directions[i] ?? 0;
      sections.push({ id: letters[i], start: { ...cursor }, directionDeg, lengthMm: lengthMm || 0 });
      const rad = (directionDeg * Math.PI) / 180;
      cursor = { xMm: cursor.xMm + Math.cos(rad) * (lengthMm || 0), zMm: cursor.zMm + Math.sin(rad) * (lengthMm || 0) };
    });
    project.fence.shape = shape;
    project.fence.sections = sections;
    project.fence.gates = (project.fence.gates || []).filter((g) => sections.some((s) => s.id === g.sectionId));
    fitGardenToContent();
  }

  /**
   * Schuttingvormen met een rechtsafslag (bv. L-right) geven secties een
   * negatieve richting (sin(-90°) = -1), dus negatieve z-coördinaten. De 2D/3D-
   * scenes gaan uit van een oorsprong bij (0,0) met alleen positieve ruimte —
   * zonder verschuiving valt zo'n vorm deels buiten de zichtbare viewBox/scene
   * (v6.0 H04-bevinding). Verschuif daarom eerst alle geometrie zodat de
   * kleinste x/z op 0 uitkomt, bepaal pas daarna de tuingrootte.
   */
  function fitGardenToContent() {
    const g = project.garden;
    const hasContour = g.shape !== "rect" && Array.isArray(g.polygon);
    let minX = 0, minZ = 0, maxX = g.widthMm || 0, maxZ = g.depthMm || 0;
    if (hasContour) {
      const b = polygonBounds(g.polygon);
      minX = Math.min(0, b.minX); minZ = Math.min(0, b.minZ);
    }
    if (project.fence) {
      for (const s of project.fence.sections) {
        const rad = (s.directionDeg * Math.PI) / 180;
        const endX = s.start.xMm + Math.cos(rad) * s.lengthMm;
        const endZ = s.start.zMm + Math.sin(rad) * s.lengthMm;
        minX = Math.min(minX, s.start.xMm, endX);
        minZ = Math.min(minZ, s.start.zMm, endZ);
        maxX = Math.max(maxX, s.start.xMm, endX);
        maxZ = Math.max(maxZ, s.start.zMm, endZ);
      }
    }
    if (project.paving) {
      for (const a of project.paving.areas) {
        minX = Math.min(minX, a.position.xMm);
        minZ = Math.min(minZ, a.position.zMm);
        maxX = Math.max(maxX, a.position.xMm + a.lengthMm);
        maxZ = Math.max(maxZ, a.position.zMm + a.widthMm);
      }
    }

    for (const o of project.existingObjects || []) {
      if (!o.footprint) continue;
      minX = Math.min(minX, o.footprint.xMm);
      minZ = Math.min(minZ, o.footprint.zMm);
      maxX = Math.max(maxX, o.footprint.xMm + o.footprint.lengthMm);
      maxZ = Math.max(maxZ, o.footprint.zMm + o.footprint.widthMm);
    }

    if (minX < 0 || minZ < 0) {
      const dx = -minX, dz = -minZ;
      if (project.fence) {
        for (const s of project.fence.sections) {
          s.start.xMm += dx;
          s.start.zMm += dz;
        }
      }
      if (project.paving) {
        for (const a of project.paving.areas) {
          a.position.xMm += dx;
          a.position.zMm += dz;
        }
      }
      if (hasContour) {
        for (const p of g.polygon) { p.xMm += dx; p.zMm += dz; }
      }
      for (const o of project.existingObjects || []) {
        if (o.footprint) { o.footprint.xMm += dx; o.footprint.zMm += dz; }
      }
      maxX += dx;
      maxZ += dz;
    }

    if (hasContour) {
      // Contour is leidend; breedte/diepte zijn dan de omhullende rechthoek.
      const b = polygonBounds(g.polygon);
      g.widthMm = Math.round(b.maxX);
      g.depthMm = Math.round(b.maxZ);
      return;
    }
    if (!g.geometryKnown || !g.widthMm) {
      g.widthMm = Math.max(3000, Math.round((maxX + 1500) / 100) * 100);
    }
    if (!g.geometryKnown || !g.depthMm) {
      g.depthMm = Math.max(3000, Math.round((maxZ + 1500) / 100) * 100);
    }
  }

  const GOALS = [
    { id: "privacy", label: "Meer privacy", services: ["schutting"] },
    { id: "onderhoud", label: "Tuin laten bijhouden", services: ["tuinonderhoud"] },
    { id: "groen", label: "Meer groen", services: ["tuinrenovatie"] },
    { id: "herstel", label: "Iets laten herstellen", services: [] },
    { id: "aanleg", label: "Complete nieuwe tuin", services: ["tuinaanleg"] }
  ];

  function applyGoal(goalId) {
    const goal = GOALS.find((g) => g.id === goalId);
    if (!goal) return;
    project.goal = goal.id;
    for (const sId of goal.services) if (!project.services.includes(sId)) project.services.push(sId);
    if (goal.id === "herstel") project.options.fenceIntent = "repair";
    if (usesFence()) ensureFenceDefaults();
    if (usesPaving()) ensurePavingDefaults();
    fitGardenToContent();
  }

  /** ?doel= of ?service= vanaf een dienst-/projectpagina: alleen toepassen op een leeg ontwerp. */
  function applyUrlPreselection() {
    const params = new URLSearchParams(location.search);
    if (project.services.length) return;
    const doel = params.get("doel");
    const service = params.get("service");
    if (doel) applyGoal(doel);
    if (service && SERVICES.some((x) => x.id === service) && !project.services.includes(service)) {
      project.services.push(service);
      if (usesFence()) ensureFenceDefaults();
      if (usesPaving()) ensurePavingDefaults();
      fitGardenToContent();
    }
  }

  function renderStepProject() {
    panel.innerHTML = "";
    const who = document.createElement("fieldset");
    who.innerHTML = `<legend class="configurator-section-title">Voor wie is het project?</legend>`;
    who.appendChild(selectField("Ik vraag aan als", [
      { id: "private", label: "Particulier" }, { id: "business", label: "Zakelijk (bedrijf, VvE, aannemer)" }
    ], project.customerType, (val) => { project.customerType = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (project.customerType === "business") {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.innerHTML = 'Voor zakelijke opdrachten (onderaanneming, VvE, meerdere locaties) is er een aparte <a href="../voor-aannemers/">zakelijke intake</a>. Uw ontwerp hier blijft bewaard en gaat mee in het dossier.';
      who.appendChild(p);
    }
    panel.appendChild(who);

    const goalFs = document.createElement("fieldset");
    goalFs.innerHTML = `<legend class="configurator-section-title">Wat is uw doel?</legend>
      <p class="field-hint">Kies een doel — wij zetten de passende dienst alvast aan. U kunt hieronder altijd aanpassen.</p>`;
    const goalTiles = document.createElement("div");
    goalTiles.className = "wizard-tiles";
    goalTiles.setAttribute("role", "group");
    goalTiles.setAttribute("aria-label", "Kies uw doel");
    GOALS.forEach((g) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wizard-tile wizard-tile-sm";
      btn.setAttribute("aria-pressed", project.goal === g.id ? "true" : "false");
      btn.textContent = g.label;
      btn.addEventListener("click", () => { applyGoal(g.id); renderAll(); });
      goalTiles.appendChild(btn);
    });
    goalFs.appendChild(goalTiles);
    if (project.goal === "herstel") {
      goalFs.appendChild(hintEl("Kies hieronder wat hersteld moet worden. Bij een schutting staat 'herstellen' in stap Situatie al aan — we adviseren pas vervanging als herstel niet zinvol is."));
    }
    panel.appendChild(goalFs);
    const fieldset = document.createElement("fieldset");
    fieldset.innerHTML = `<legend class="configurator-section-title">Wat wilt u laten uitvoeren?</legend>
      <p class="field-hint">Meerdere diensten combineren kan — kies alles wat van toepassing is.</p>`;
    const tiles = document.createElement("div");
    tiles.className = "wizard-tiles";
    tiles.setAttribute("role", "group");
    tiles.setAttribute("aria-label", "Kies één of meer diensten");
    SERVICES.forEach((service) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wizard-tile wizard-tile-sm";
      btn.setAttribute("aria-pressed", project.services.includes(service.id) ? "true" : "false");
      btn.innerHTML = `<span>${service.label}</span>`;
      btn.addEventListener("click", () => {
        const idx = project.services.indexOf(service.id);
        if (idx >= 0) project.services.splice(idx, 1);
        else project.services.push(service.id);
        if (usesFence()) ensureFenceDefaults(); else project.fence = null;
        if (usesPaving()) ensurePavingDefaults(); else project.paving = null;
        fitGardenToContent();
        renderAll();
      });
      tiles.appendChild(btn);
    });
    fieldset.appendChild(tiles);
    panel.appendChild(fieldset);
    if (project.services.length) panel.appendChild(buildWishesFieldset());
    appendNav(false, project.services.length > 0);
  }

  const SCOPES = [
    { id: "", label: "Weet ik nog niet" }, { id: "small", label: "Kleine klus" },
    { id: "partial", label: "Deel van de tuin vernieuwen" }, { id: "complete", label: "Complete tuin" }
  ];
  const USES = [
    { id: "zitten", label: "Zitten en buiten eten" }, { id: "spelen", label: "Spelen (kinderen/huisdieren)" },
    { id: "toegankelijk", label: "Goed begaanbaar (rollator/rolstoel)" }, { id: "privacy", label: "Privacy en beschutting" },
    { id: "groen", label: "Veel groen en beplanting" }
  ];
  const MAINTENANCE = [
    { id: "", label: "Geen voorkeur" }, { id: "low", label: "Zo weinig mogelijk onderhoud" },
    { id: "normal", label: "Normaal onderhoud is prima" }, { id: "high", label: "Ik tuinier graag zelf" }
  ];
  const TRI = [{ id: "unknown", label: "Weet ik niet" }, { id: "no", label: "Nee" }, { id: "yes", label: "Ja" }];
  const optLabel = (list, id) => (list.find((o) => o.id === (id ?? "")) || {}).label || "—";

  /** Projectomvang, gebruik en onderhoudswens (A04/A06/A07) — wensen, geen beloftes. */
  function buildWishesFieldset() {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Uw wensen</legend>`;
    fs.appendChild(selectField("Omvang van het project", SCOPES, project.wishes.scope || "", (val) => {
      project.wishes.scope = val || null;
      renderScenesAndSummary();
    }, (o) => o.label, (o) => o.id));
    const usesWrap = document.createElement("div");
    usesWrap.className = "configurator-field";
    const usesTitle = document.createElement("p");
    usesTitle.className = "configurator-field-label";
    usesTitle.textContent = "Waarvoor gebruikt u de tuin?";
    usesWrap.appendChild(usesTitle);
    USES.forEach((u) => usesWrap.appendChild(checkboxField(u.label, project.wishes.uses.includes(u.id), (checked) => {
      project.wishes.uses = checked ? [...new Set([...project.wishes.uses, u.id])] : project.wishes.uses.filter((x) => x !== u.id);
      renderScenesAndSummary();
    })));
    fs.appendChild(usesWrap);
    fs.appendChild(selectField("Onderhoudswens", MAINTENANCE, project.wishes.maintenance || "", (val) => {
      project.wishes.maintenance = val || null;
      renderScenesAndSummary();
    }, (o) => o.label, (o) => o.id));
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.textContent = "Uw wensen sturen ons advies en gaan mee in het dossier. Ze leiden niet tot een vaste prijs of een levensduurbelofte.";
    fs.appendChild(hint);
    return fs;
  }

  function renderStepMaten() {
    panel.innerHTML = "";
    if (usesGardenScene()) panel.appendChild(buildGardenFieldset());

    if (usesFence()) {
      ensureFenceDefaults();
      panel.appendChild(buildFenceGeometryFieldset());
    }
    if (usesPaving()) {
      ensurePavingDefaults();
      panel.appendChild(buildPavingGeometryFieldset());
    }
    if (usesGardenScene()) panel.appendChild(buildObjectsFieldset());
    appendNav(true, true);
  }

  /** Tuinvlak: rechthoek, L-vorm (maatgestuurd) of vrije contour (hoekpunten). */
  function buildGardenFieldset() {
    const g = project.garden;
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Tuinvlak</legend>`;
    fs.appendChild(selectField("Vorm van de tuin", [
      { id: "rect", label: "Rechthoek" }, { id: "L", label: "L-vorm" }, { id: "free", label: "Vrije contour (hoekpunten)" }
    ], g.shape || "rect", (val) => setGardenShape(val), (o) => o.label, (o) => o.id));

    if (g.shape !== "free") {
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(numberField("Breedte (m)", mmToMeters(g.widthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null || mm < 1000) return;
        g.widthMm = mm; g.geometryKnown = true; syncLPolygon(); renderScenesAndSummary();
      }));
      row.appendChild(numberField("Diepte (m)", mmToMeters(g.depthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null || mm < 1000) return;
        g.depthMm = mm; g.geometryKnown = true; syncLPolygon(); renderScenesAndSummary();
      }));
      fs.appendChild(row);
    }
    if (g.shape === "L") {
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(numberField("Uitsparing breedte (m)", mmToMeters(g.lCut.widthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null) return;
        g.lCut.widthMm = mm; syncLPolygon(); renderScenesAndSummary();
      }));
      row.appendChild(numberField("Uitsparing diepte (m)", mmToMeters(g.lCut.depthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null) return;
        g.lCut.depthMm = mm; syncLPolygon(); renderScenesAndSummary();
      }));
      fs.appendChild(row);
      const hint = document.createElement("p");
      hint.className = "field-hint";
      hint.textContent = "De uitsparing zit rechtsonder in de tekening. Wilt u een andere vorm? Kies dan vrije contour.";
      fs.appendChild(hint);
    }
    if (g.shape === "free") fs.appendChild(buildVertexEditor());

    const areaM2 = polygonAreaMm2(gardenPolygon(g)) / 1_000_000;
    const info = document.createElement("p");
    info.className = "field-hint";
    info.textContent = g.geometryKnown
      ? `Oppervlak tuinvlak: ${formatM2(Math.round(areaM2 * 10) / 10, 1)} (in 2D en 3D dezelfde contour).`
      : "Nog geen tuinmaten ingevuld — het tuinvlak wordt voorlopig afgeleid uit uw schutting/bestrating.";
    fs.appendChild(info);
    return fs;
  }

  function setGardenShape(shape) {
    const g = project.garden;
    const current = gardenPolygon(g).map((p) => ({ ...p }));
    g.shape = shape;
    g.geometryKnown = true;
    if (shape === "rect") {
      const b = polygonBounds(current);
      g.polygon = null;
      g.widthMm = Math.round(b.maxX - b.minX);
      g.depthMm = Math.round(b.maxZ - b.minZ);
    } else if (shape === "L") {
      g.lCut = g.lCut || { widthMm: Math.round((g.widthMm || 8000) / 3), depthMm: Math.round((g.depthMm || 6000) / 3) };
      syncLPolygon();
    } else {
      g.polygon = current; // vrije contour start vanaf de huidige vorm
    }
    selectedId = null;
    renderAll();
  }

  function syncLPolygon() {
    const g = project.garden;
    if (g.shape !== "L") return;
    g.polygon = lPolygon(g.widthMm || 8000, g.depthMm || 6000, g.lCut.widthMm, g.lCut.depthMm);
  }

  function buildVertexEditor() {
    const g = project.garden;
    const wrap = document.createElement("div");
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.textContent = "Versleep de genummerde hoekpunten in de tekening, of typ de positie (m vanaf linksboven). Met raster/snap aan springen gesleepte punten naar het raster; getypte waarden blijven exact.";
    wrap.appendChild(hint);
    const ul = document.createElement("ul");
    ul.className = "configurator-list";
    g.polygon.forEach((pt, i) => {
      const li = document.createElement("li");
      li.className = "configurator-list-item configurator-vertex" + (selectedId === `vertex-${i}` ? " is-selected" : "");
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(numberField(`Punt ${i + 1} — x (m)`, mmToMeters(pt.xMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null) return;
        pt.xMm = mm; fitGardenToContent(); renderScenesAndSummary();
      }));
      row.appendChild(numberField(`z (m)`, mmToMeters(pt.zMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm === null) return;
        pt.zMm = mm; fitGardenToContent(); renderScenesAndSummary();
      }));
      li.appendChild(row);
      const actions = document.createElement("div");
      actions.className = "configurator-vertex-actions";
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "link-btn";
      addBtn.textContent = "+ punt erna";
      addBtn.setAttribute("aria-label", `Hoekpunt toevoegen tussen punt ${i + 1} en ${((i + 1) % g.polygon.length) + 1}`);
      addBtn.addEventListener("click", () => {
        if (g.polygon.length >= 40) return;
        const next = g.polygon[(i + 1) % g.polygon.length];
        g.polygon.splice(i + 1, 0, { xMm: Math.round((pt.xMm + next.xMm) / 2), zMm: Math.round((pt.zMm + next.zMm) / 2) });
        selectedId = `vertex-${i + 1}`;
        renderAll();
      });
      actions.appendChild(addBtn);
      if (g.polygon.length > 3) {
        const rm = document.createElement("button");
        rm.type = "button";
        rm.textContent = "Verwijderen";
        rm.setAttribute("aria-label", `Hoekpunt ${i + 1} verwijderen`);
        rm.addEventListener("click", () => {
          g.polygon.splice(i, 1);
          selectedId = null;
          renderAll();
        });
        actions.appendChild(rm);
      }
      li.appendChild(actions);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    const problem = findPolygonProblem(g.polygon);
    if (problem) {
      const err = document.createElement("p");
      err.className = "field-error";
      err.setAttribute("role", "alert");
      err.textContent = problem;
      wrap.appendChild(err);
    }
    return wrap;
  }

  function rectsOverlap(a, b) {
    return a.xMm < b.xMm + b.lengthMm && b.xMm < a.xMm + a.lengthMm && a.zMm < b.zMm + b.widthMm && b.zMm < a.zMm + a.widthMm;
  }

  /** Nieuwe objecten die overlappen met bestrating of elkaar: kosten zouden dubbel tellen (E06). */
  function findObjectOverlaps() {
    const news = (project.existingObjects || []).filter((o) => o.status === "new" && ["m", "m2"].includes(getObjectType(o.type)?.unit)); // losse planten/lampen mogen in een vak staan
    const pav = (project.paving?.areas || []).map((a) => ({ label: "bestrating", xMm: a.position.xMm, zMm: a.position.zMm, lengthMm: a.lengthMm, widthMm: a.widthMm }));
    const out = [];
    news.forEach((o, i) => {
      for (const p of pav) if (rectsOverlap(o.footprint, p)) out.push(`${getObjectType(o.type).label.split(" /")[0]} en bestrating`);
      for (const q of news.slice(i + 1)) if (rectsOverlap(o.footprint, q.footprint)) out.push(`${getObjectType(o.type).label.split(" /")[0]} en ${getObjectType(q.type).label.split(" /")[0]}`);
    });
    return [...new Set(out)];
  }

  /** Bestaande en nieuwe objecten (C01/C04/C05/C06/D07/D08/E05/E06). */
  function buildObjectsFieldset() {
    project.existingObjects = project.existingObjects || [];
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Bestaande en nieuwe objecten</legend>
      <p class="field-hint">Teken wat er al staat (huiswand, schuur, boom, haag) en wat er nieuw bij komt (haag, border, gazon). Bestaande objecten zijn een referentie en worden niet als nieuw materiaal of montage gerekend. Te behouden objecten staan standaard vast zodat ze niet per ongeluk verschuiven.</p>`;
    const ul = document.createElement("ul");
    ul.className = "configurator-list";
    project.existingObjects.forEach((obj, i) => {
      const type = getObjectType(obj.type);
      if (!type) return;
      const li = document.createElement("li");
      li.className = "configurator-list-item configurator-object" + (selectedId === obj.id ? " is-selected" : "");
      const title = document.createElement("p");
      title.className = "configurator-object-title";
      const qty = objectQuantity(obj);
      title.textContent = `${type.label}${qty ? ` — ${qty.value.toLocaleString("nl-NL")} ${qty.unit}` : ""}${obj.locked ? " · vast" : ""}`;
      li.appendChild(title);
      li.appendChild(selectField("Status", type.statuses.map((id) => ({ id, label: OBJECT_STATUSES[id] })), obj.status, (val) => {
        obj.status = val;
        if (val !== "existing-keep") obj.locked = false;
        renderScenesAndSummary();
      }, (o) => o.label, (o) => o.id));
      if (obj.locked) {
        li.appendChild(hintEl(`Vast op ${formatMeters(obj.footprint.xMm, 2)} / ${formatMeters(obj.footprint.zMm, 2)}, ${formatMeters(obj.footprint.lengthMm, 2)} × ${formatMeters(obj.footprint.widthMm, 2)}.`));
      } else {
        const r1 = document.createElement("div");
        r1.className = "configurator-row";
        r1.appendChild(numberField(type.id === "tree" ? "Kroon (m)" : type.round ? "Doorsnede (m)" : "Lengte (m)", mmToMeters(obj.footprint.lengthMm), (v) => {
          const mm = parseMetersToMm(v); if (mm === null || mm < 100) return;
          obj.footprint.lengthMm = mm; if (type.id === "tree" || type.round) obj.footprint.widthMm = mm;
          fitGardenToContent(); renderScenesAndSummary();
        }));
        if (type.id !== "tree" && !type.round) r1.appendChild(numberField("Breedte (m)", mmToMeters(obj.footprint.widthMm), (v) => {
          const mm = parseMetersToMm(v); if (mm === null || mm < 50) return;
          obj.footprint.widthMm = mm; fitGardenToContent(); renderScenesAndSummary();
        }));
        li.appendChild(r1);
        const r2 = document.createElement("div");
        r2.className = "configurator-row";
        r2.appendChild(numberField("Positie x (m)", mmToMeters(obj.footprint.xMm), (v) => {
          const mm = parseMetersToMm(v); if (mm === null) return;
          obj.footprint.xMm = mm; fitGardenToContent(); renderScenesAndSummary();
        }));
        r2.appendChild(numberField("Positie z (m)", mmToMeters(obj.footprint.zMm), (v) => {
          const mm = parseMetersToMm(v); if (mm === null) return;
          obj.footprint.zMm = mm; fitGardenToContent(); renderScenesAndSummary();
        }));
        li.appendChild(r2);
      }
      const actions = document.createElement("div");
      actions.className = "configurator-vertex-actions";
      if (obj.status === "existing-keep") {
        const lockBtn = document.createElement("button");
        lockBtn.type = "button";
        lockBtn.className = "link-btn";
        lockBtn.textContent = obj.locked ? "Ontgrendelen" : "Vastzetten";
        lockBtn.setAttribute("aria-label", `${type.label} ${obj.locked ? "ontgrendelen om te verplaatsen" : "vastzetten"}`);
        lockBtn.addEventListener("click", () => { obj.locked = !obj.locked; renderScenesAndSummary(); });
        actions.appendChild(lockBtn);
      }
      const dup = document.createElement("button");
      dup.type = "button";
      dup.className = "link-btn";
      dup.textContent = "Dupliceren";
      dup.setAttribute("aria-label", `${type.label} dupliceren`);
      dup.addEventListener("click", () => {
        const copy = JSON.parse(JSON.stringify(obj));
        copy.id = generateId("obj");
        copy.locked = false;
        copy.footprint.xMm += 500; copy.footprint.zMm += 500;
        project.existingObjects.splice(i + 1, 0, copy);
        selectedId = copy.id;
        fitGardenToContent(); renderAll();
      });
      actions.appendChild(dup);
      const rm = document.createElement("button");
      rm.type = "button";
      rm.textContent = "Verwijderen";
      rm.setAttribute("aria-label", `${type.label} uit de tekening halen`);
      rm.addEventListener("click", () => {
        project.existingObjects.splice(i, 1);
        selectedId = null;
        renderAll();
      });
      actions.appendChild(rm);
      li.appendChild(actions);
      ul.appendChild(li);
    });
    fs.appendChild(ul);

    const overlaps = findObjectOverlaps();
    if (overlaps.length) {
      const err = document.createElement("p");
      err.className = "field-error";
      err.setAttribute("role", "alert");
      err.textContent = `Let op: ${overlaps.join("; ")} overlappen. Overlappende oppervlakken zouden dubbel worden gerekend — pas positie of maat aan.`;
      fs.appendChild(err);
    }

    const addRow = document.createElement("div");
    addRow.className = "configurator-row configurator-add-object";
    const typeSel = selectField("Object toevoegen", OBJECT_TYPES, OBJECT_TYPES[0].id, () => {}, (t) => t.label, (t) => t.id);
    addRow.appendChild(typeSel);
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-secondary btn-sm";
    addBtn.textContent = "+ Toevoegen";
    addBtn.addEventListener("click", () => {
      if (project.existingObjects.length >= 30) return;
      const type = getObjectType(typeSel.querySelector("select").value);
      const status = type.statuses.includes("new") && !["hedge"].includes(type.id) ? "new" : type.statuses[0];
      const obj = {
        id: generateId("obj"), type: type.id, status, locked: status === "existing-keep",
        footprint: { xMm: 0, zMm: 0, lengthMm: type.lengthMm, widthMm: type.widthMm }
      };
      // midden in de tuin; de gebruiker schuift het daarna naar de juiste plek
      const b = polygonBounds(gardenPolygon(project.garden));
      obj.footprint.xMm = Math.max(0, Math.round(((b.minX + b.maxX) / 2 - type.lengthMm / 2) / 100) * 100);
      obj.footprint.zMm = Math.max(0, Math.round(((b.minZ + b.maxZ) / 2 - type.widthMm / 2) / 100) * 100);
      project.existingObjects.push(obj);
      selectedId = obj.id;
      fitGardenToContent();
      renderAll();
    });
    addRow.appendChild(addBtn);
    fs.appendChild(addRow);
    return fs;
  }

  /** Draait een poort tegen een vast object (schuur, huiswand, boom, haag) of tegen een andere poort? */
  function findGateSwingConflicts() {
    const out = [];
    const solids = (project.existingObjects || []).filter((o) => ["house-wall", "shed", "tree", "hedge"].includes(o.type) && o.status !== "existing-remove");
    const swings = (project.fence.gates || []).map((g) => computeGateSwing(project.fence, g));
    swings.forEach((sw, i) => {
      if (!sw) return;
      const box = { xMm: sw.bounds.minX, zMm: sw.bounds.minZ, lengthMm: sw.bounds.maxX - sw.bounds.minX, widthMm: sw.bounds.maxZ - sw.bounds.minZ };
      for (const o of solids) {
        if (rectsOverlap(box, o.footprint)) out.push(`Poort ${i + 1} draait tegen ${getObjectType(o.type).label.split(" /")[0].toLowerCase()} — kies een andere draairichting of positie.`);
      }
      swings.forEach((other, j) => {
        if (j <= i || !other) return;
        const b2 = { xMm: other.bounds.minX, zMm: other.bounds.minZ, lengthMm: other.bounds.maxX - other.bounds.minX, widthMm: other.bounds.maxZ - other.bounds.minZ };
        if (rectsOverlap(box, b2)) out.push(`De draaicirkels van poort ${i + 1} en ${j + 1} raken elkaar.`);
      });
    });
    return out;
  }

  function buildFenceGeometryFieldset() {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Schutting — vorm &amp; maten</legend>`;

    const shapeField = document.createElement("div");
    shapeField.className = "configurator-field";
    shapeField.innerHTML = `<label for="fence-shape">Vorm</label>`;
    const select = document.createElement("select");
    select.id = "fence-shape";
    FENCE_SHAPES.filter((s) => s !== "multi").forEach((shape) => {
      const opt = document.createElement("option");
      opt.value = shape;
      opt.textContent = { I: "I (rechte lijn)", "L-left": "L (naar links)", "L-right": "L (naar rechts)", U: "U" }[shape];
      opt.selected = project.fence.shape === shape;
      select.appendChild(opt);
    });
    select.addEventListener("change", () => {
      const count = { I: 1, "L-left": 2, "L-right": 2, U: 3 }[select.value];
      const lengths = project.fence.sections.map((s) => s.lengthMm);
      while (lengths.length < count) lengths.push(3000);
      rebuildFenceSections(select.value, lengths.slice(0, count));
      renderAll();
    });
    shapeField.appendChild(select);
    fs.appendChild(shapeField);

    project.fence.sections.forEach((section, i) => {
      fs.appendChild(
        numberField(`Zijde ${section.id} — lengte (m)`, mmToMeters(section.lengthMm), (v) => {
          const mm = parseMetersToMm(v);
          if (mm === null) return;
          const lengths = project.fence.sections.map((s) => s.lengthMm);
          lengths[i] = mm;
          rebuildFenceSections(project.fence.shape, lengths);
          renderScenesAndSummary();
        })
      );
    });

    const heightField = document.createElement("div");
    heightField.className = "configurator-field";
    heightField.innerHTML = `<label for="fence-height">Hoogte</label>`;
    const heightSelect = document.createElement("select");
    heightSelect.id = "fence-height";
    FENCE_HEIGHTS_MM.forEach((h) => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = `${h / 10} cm`;
      opt.selected = project.fence.heightMm === h;
      heightSelect.appendChild(opt);
    });
    heightSelect.addEventListener("change", () => {
      project.fence.heightMm = parseInt(heightSelect.value, 10);
      renderScenesAndSummary();
    });
    heightField.appendChild(heightSelect);
    fs.appendChild(heightField);

    const gateList = document.createElement("div");
    gateList.className = "configurator-section-title";
    gateList.textContent = "Poorten";
    fs.appendChild(gateList);
    const ul = document.createElement("ul");
    ul.className = "configurator-list";
    (project.fence.gates || []).forEach((gate, gi) => {
      const li = document.createElement("li");
      li.className = "configurator-list-item configurator-object";
      const title = document.createElement("p");
      title.className = "configurator-object-title";
      title.textContent = `Poort ${gi + 1}`;
      li.appendChild(title);
      const r1 = document.createElement("div");
      r1.className = "configurator-row";
      r1.appendChild(selectField("Zijde", project.fence.sections.map((x) => ({ id: x.id, label: `Zijde ${x.id}` })), gate.sectionId, (val) => {
        gate.sectionId = val; renderScenesAndSummary();
      }, (o) => o.label, (o) => o.id));
      r1.appendChild(numberField("Vanaf begin zijde (m)", mmToMeters(gate.offsetMm), (v) => {
        const mm = parseMetersToMm(v); if (mm === null) return;
        gate.offsetMm = mm; renderScenesAndSummary();
      }));
      r1.appendChild(numberField("Doorgang (m)", mmToMeters(gate.clearWidthMm), (v) => {
        const mm = parseMetersToMm(v); if (mm === null || mm < 300 || mm > 6000) return;
        gate.clearWidthMm = mm; renderScenesAndSummary();
      }));
      li.appendChild(r1);
      const r2 = document.createElement("div");
      r2.className = "configurator-row";
      r2.appendChild(selectField("Scharnier", [{ id: "left", label: "Links" }, { id: "right", label: "Rechts" }], gate.hingeSide || "left", (val) => {
        gate.hingeSide = val; renderScenesAndSummary();
      }, (o) => o.label, (o) => o.id));
      r2.appendChild(selectField("Draait", [{ id: "inward", label: "Naar de tuin" }, { id: "outward", label: "Van de tuin af" }], gate.swing || "inward", (val) => {
        gate.swing = val; renderScenesAndSummary();
      }, (o) => o.label, (o) => o.id));
      li.appendChild(r2);
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Poort verwijderen";
      removeBtn.addEventListener("click", () => {
        project.fence.gates = project.fence.gates.filter((g) => g.id !== gate.id);
        renderAll();
      });
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
    fs.appendChild(ul);

    const gateErrors = validateFenceGates(project.fence).concat(findGateSwingConflicts());
    if (gateErrors.length) {
      const err = document.createElement("p");
      err.className = "field-error";
      err.setAttribute("role", "alert");
      err.textContent = gateErrors.join(" ");
      fs.appendChild(err);
    }

    const addGateBtn = document.createElement("button");
    addGateBtn.type = "button";
    addGateBtn.className = "btn btn-secondary btn-sm";
    addGateBtn.textContent = "+ Poort toevoegen";
    addGateBtn.addEventListener("click", () => {
      const firstSection = project.fence.sections[0];
      if (!firstSection) return;
      project.fence.gates = project.fence.gates || [];
      project.fence.gates.push({
        id: generateId("gate"), sectionId: firstSection.id, offsetMm: 0, clearWidthMm: 1000,
        heightMm: project.fence.heightMm, hingeSide: "left", swing: "inward"
      });
      renderAll();
    });
    fs.appendChild(addGateBtn);

    return fs;
  }

  function buildPavingGeometryFieldset() {
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Bestrating — vlakken</legend>`;
    const ul = document.createElement("ul");
    ul.className = "configurator-list";
    project.paving.areas.forEach((area, i) => {
      const li = document.createElement("li");
      li.className = "configurator-list-item";
      li.style.flexDirection = "column";
      li.style.alignItems = "stretch";
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(numberField(`Vlak ${i + 1} — lengte (m)`, mmToMeters(area.lengthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm !== null) { area.lengthMm = mm; fitGardenToContent(); renderScenesAndSummary(); }
      }));
      row.appendChild(numberField(`Breedte (m)`, mmToMeters(area.widthMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm !== null) { area.widthMm = mm; fitGardenToContent(); renderScenesAndSummary(); }
      }));
      li.appendChild(row);
      if (selectedId === area.id) li.classList.add("is-selected");
      const posRow = document.createElement("div");
      posRow.className = "configurator-row";
      posRow.appendChild(numberField(`Positie x (m)`, mmToMeters(area.position.xMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm !== null) { area.position.xMm = mm; fitGardenToContent(); renderScenesAndSummary(); }
      }));
      posRow.appendChild(numberField(`Positie z (m)`, mmToMeters(area.position.zMm), (v) => {
        const mm = parseMetersToMm(v);
        if (mm !== null) { area.position.zMm = mm; fitGardenToContent(); renderScenesAndSummary(); }
      }));
      li.appendChild(posRow);
      const dupBtn = document.createElement("button");
      dupBtn.type = "button";
      dupBtn.className = "link-btn";
      dupBtn.textContent = "Vlak dupliceren";
      dupBtn.addEventListener("click", () => {
        if (project.paving.areas.length >= 20) return;
        const copy = JSON.parse(JSON.stringify(area));
        copy.id = generateId("area");
        copy.position.xMm += area.lengthMm + 500;
        project.paving.areas.splice(i + 1, 0, copy);
        selectedId = copy.id;
        fitGardenToContent(); renderAll();
      });
      li.appendChild(dupBtn);
      if (project.paving.areas.length > 1) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Vlak verwijderen";
        removeBtn.addEventListener("click", () => {
          project.paving.areas.splice(i, 1);
          renderAll();
        });
        li.appendChild(removeBtn);
      }
      ul.appendChild(li);
    });
    fs.appendChild(ul);

    const overlaps = findPavingOverlaps(project.paving);
    if (overlaps.length) {
      const err = document.createElement("p");
      err.className = "field-error";
      err.setAttribute("role", "alert");
      err.textContent = `Let op: vlakken ${overlaps.map((o) => `${o.a}/${o.b}`).join(", ")} overlappen elkaar. Pas positie of maat aan.`;
      fs.appendChild(err);
    }

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-secondary btn-sm";
    addBtn.textContent = "+ Vlak toevoegen";
    addBtn.addEventListener("click", () => {
      const lastArea = project.paving.areas[project.paving.areas.length - 1];
      const offsetX = lastArea ? lastArea.position.xMm + lastArea.lengthMm + 500 : 0;
      project.paving.areas.push({
        id: generateId("area"), lengthMm: 3000, widthMm: 2000,
        position: { xMm: offsetX, zMm: 0 }, rotationDeg: 0, application: "pad"
      });
      renderAll();
    });
    fs.appendChild(addBtn);
    return fs;
  }

  function renderStepMaterialen() {
    panel.innerHTML = "";
    if (usesFence()) {
      const fs = document.createElement("fieldset");
      fs.innerHTML = `<legend class="configurator-section-title">Schutting — systeem &amp; materiaal</legend>`;
      fs.appendChild(selectField("Systeem", FENCE_SYSTEMS, project.fence.systemId, (val) => {
        project.fence.systemId = val;
        const preset = FENCE_MATERIAL_PRESETS.find((p) => p.compatibleSystems.includes(val));
        if (preset && !FENCE_MATERIAL_PRESETS.find((p) => p.id === project.fence.materialPresetId)?.compatibleSystems.includes(val)) {
          project.fence.materialPresetId = preset.id;
        }
        renderAll();
      }, (s) => s.label));
      const compatiblePresets = FENCE_MATERIAL_PRESETS.filter((p) => p.compatibleSystems.includes(project.fence.systemId));
      fs.appendChild(selectField("Materiaal / kleur", compatiblePresets, project.fence.materialPresetId, (val) => {
        project.fence.materialPresetId = val;
        renderScenesAndSummary();
      }, (p) => p.label));
      const note = document.createElement("p");
      note.className = "field-hint";
      note.textContent = "Generieke visualisatie — geen vastgesteld productmerk totdat een echt artikel is gekoppeld.";
      fs.appendChild(note);
      panel.appendChild(fs);
    }
    if (usesPaving()) {
      const fs = document.createElement("fieldset");
      fs.innerHTML = `<legend class="configurator-section-title">Bestrating — formaat &amp; afwerking</legend>`;
      fs.appendChild(selectField("Tegelformaat", PAVING_FORMATS_MM, formatKey(project.paving), (val) => {
        const fmt = PAVING_FORMATS_MM.find((f) => f.id === val);
        project.paving.nominalTileLengthMm = fmt.lengthMm;
        project.paving.nominalTileWidthMm = fmt.widthMm;
        if (project.paving.productId) {
          const stillValid = getPavingProductsForFormat(fmt.lengthMm, fmt.widthMm).some((p) => p.id === project.paving.productId);
          if (!stillValid) project.paving.productId = null;
        }
        renderStepMaterialen();
        renderScenesAndSummary();
      }, (f) => f.label, (f) => f.id));
      fs.appendChild(selectField("Legpatroon", PAVING_PATTERNS, project.paving.pattern, (val) => {
        project.paving.pattern = val;
        renderScenesAndSummary();
      }, (p) => p.label, (p) => p.id));
      fs.appendChild(selectField("Kleur", PAVING_COLOR_PRESETS, project.paving.colorPresetId, (val) => {
        project.paving.colorPresetId = val;
        renderScenesAndSummary();
      }, (p) => p.label, (p) => p.id));
      const verifiedProducts = getPavingProductsForFormat(project.paving.nominalTileLengthMm, project.paving.nominalTileWidthMm);
      if (verifiedProducts.length) {
        const options = [{ id: "", label: "Geen specifiek product — generieke kleur" }, ...verifiedProducts.map((p) => ({ id: p.id, label: p.label }))];
        fs.appendChild(selectField("Specifiek product (optioneel)", options, project.paving.productId || "", (val) => {
          project.paving.productId = val || null;
          renderScenesAndSummary();
        }, (o) => o.label, (o) => o.id));
        const productNote = document.createElement("p");
        productNote.className = "field-hint";
        productNote.textContent = "Dit zijn echte, bij de leverancier onderzochte artikelen — geen Sealcleaning-eigen assortiment of inkoopprijs. Kies deze alleen als richtprijs voor dit specifieke formaat.";
        fs.appendChild(productNote);
      } else {
        // G08: suggestie uit de compatibele catalogus; de gebruiker kiest zelf, er wordt niets stil gewisseld.
        const alt = PAVING_FORMATS_MM.map((f) => ({ f, n: getPavingProductsForFormat(f.lengthMm, f.widthMm).length })).find((x) => x.n > 0);
        if (alt) {
          const box = document.createElement("div");
          box.className = "configurator-suggestion";
          box.appendChild(hintEl(`Voor dit formaat hebben we nog geen onderzocht product met referentieprijs. Voor ${alt.f.label} zijn er ${alt.n}. Uw keuze blijft staan tenzij u zelf wisselt.`));
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-secondary btn-sm";
          btn.textContent = `Bekijk ${alt.f.label}`;
          btn.addEventListener("click", () => {
            project.paving.nominalTileLengthMm = alt.f.lengthMm;
            project.paving.nominalTileWidthMm = alt.f.widthMm;
            renderScenesAndSummary();
          });
          box.appendChild(btn);
          fs.appendChild(box);
        }
      }
      const note = document.createElement("p");
      note.className = "field-hint";
      note.textContent = "Een kleur maakt een tegel niet automatisch geschikt voor een oprit — geschiktheid wordt na uw aanvraag beoordeeld.";
      fs.appendChild(note);
      panel.appendChild(fs);
    }
    if (usesFence() || usesPaving()) panel.appendChild(buildVariantsFieldset());
    if ((usesFence() || usesPaving()) && window.SealInspiration) panel.appendChild(buildInspirationSave());
    if (!usesFence() && !usesPaving()) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = "Voor de gekozen dienst(en) zijn hier geen aanvullende materialen te kiezen. Ga verder naar Situatie.";
      panel.appendChild(p);
    }
    appendNav(true, true);
  }
  function formatKey(paving) {
    const match = PAVING_FORMATS_MM.find((f) => f.lengthMm === paving.nominalTileLengthMm && f.widthMm === paving.nominalTileWidthMm);
    return match ? match.id : PAVING_FORMATS_MM[4].id;
  }

  function renderStepSituatie() {
    panel.innerHTML = "";
    const small = project.wishes.scope === "small";
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Situatie</legend>
      <p class="field-hint">Weet u iets niet? Kies "Weet ik niet" — dat is prima, we kijken het bij de bezichtiging na.</p>`;

    if (usesFence()) {
      fs.appendChild(selectField("Wat wilt u met de schutting?", [
        { id: "new", label: "Nieuwe schutting plaatsen" }, { id: "repair", label: "Bestaande schutting herstellen" }
      ], project.options.fenceIntent, (val) => { project.options.fenceIntent = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
      if (project.options.fenceIntent === "repair") {
        fs.appendChild(textAreaField("Wat is er beschadigd? (bijv. scheve palen, rotte planken, losse poort)", project.options.repairNote, (v) => { project.options.repairNote = v; }));
        fs.appendChild(hintEl("Herstel beoordelen we ter plaatse; we adviseren alleen vervanging als herstel niet zinvol is."));
      } else {
        fs.appendChild(checkboxField("Er staat al een schutting die weg moet", project.removal.existingFence, (checked) => {
          project.removal.existingFence = checked;
          project.removal.removeFence = checked;
          renderScenesAndSummary();
        }));
      }
    }
    if (usesPaving()) {
      fs.appendChild(checkboxField("Er ligt al bestrating die weg moet", project.removal.existingPaving, (checked) => {
        project.removal.existingPaving = checked;
        project.removal.removePaving = checked;
        renderScenesAndSummary();
      }));
    }

    if (project.removal.existingPaving || project.removal.existingFence || (project.existingObjects || []).some((o) => o.status === "existing-remove")) {
      fs.appendChild(buildWasteBlock());
    }

    fs.appendChild(selectField("Ondergrond", [
      { id: "unknown", label: "Weet ik niet" }, { id: "earth", label: "Aarde / gras" },
      { id: "paving", label: "Bestrating" }, { id: "concrete", label: "Beton" }
    ], project.access.surface, (val) => { project.access.surface = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));

    const accessTitle = document.createElement("p");
    accessTitle.className = "configurator-section-title";
    accessTitle.textContent = "Bereikbaarheid";
    fs.appendChild(accessTitle);
    fs.appendChild(selectField("Is de tuin bereikbaar via een achterom of zijpad?", TRI, project.access.rearAccess, (val) => { project.access.rearAccess = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (project.access.rearAccess === "yes") {
      fs.appendChild(numberField("Smalste doorgang (m)", mmToMeters(project.access.rearPassageWidthMm), (v) => {
        project.access.rearPassageWidthMm = parseMetersToMm(v);
        renderScenesAndSummary();
      }));
    }
    fs.appendChild(selectField("Trappen of opstapjes op de route?", TRI, project.access.steps, (val) => { project.access.steps = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    fs.appendChild(selectField("Loopafstand van parkeerplek tot tuin", [
      { id: "unknown", label: "Weet ik niet" }, { id: "short", label: "Kort (tot ±20 m)" },
      { id: "medium", label: "Gemiddeld (20–50 m)" }, { id: "long", label: "Lang (meer dan 50 m)" }
    ], project.access.carryDistance, (val) => { project.access.carryDistance = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));

    fs.appendChild(selectField("Parkeren en lossen bij het adres", [
      { id: "unknown", label: "Weet ik niet" }, { id: "own", label: "Eigen oprit/parkeerplek" },
      { id: "street-free", label: "Straat, vrij parkeren" }, { id: "street-paid", label: "Betaald of vergunning parkeren" },
      { id: "restricted", label: "Lastig (smalle straat, venstertijden)" }
    ], project.access.parking, (val) => { project.access.parking = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (["street-paid", "restricted"].includes(project.access.parking)) {
      fs.appendChild(textField("Bekende beperkingen of ontheffing (optioneel)", project.access.parkingNote, (v) => { project.access.parkingNote = v; }));
    }
    const notes = executionNotes();
    if (notes.length) {
      const box = document.createElement("div");
      box.className = "configurator-suggestion";
      box.appendChild(hintEl("Aandachtspunten voor de uitvoering (we beoordelen dit bij de opname; dit is geen haalbaarheidsoordeel):"));
      const ul = document.createElement("ul");
      ul.className = "configurator-photo-tips";
      notes.forEach((n) => { const li = document.createElement("li"); li.textContent = n; ul.appendChild(li); });
      box.appendChild(ul);
      fs.appendChild(box);
    }

    if (usesMaintenance()) fs.appendChild(buildMaintenanceIntake());

    const extra = document.createElement(small ? "details" : "div");
    if (small) {
      const sum = document.createElement("summary");
      sum.textContent = "Meer over de situatie (optioneel)";
      extra.appendChild(sum);
    } else {
      const t = document.createElement("p");
      t.className = "configurator-section-title";
      t.textContent = "Grond en omgeving";
      extra.appendChild(t);
    }
    extra.appendChild(selectField("Hoogteverschillen in de tuin?", TRI, project.site.levelDifference, (val) => { project.site.levelDifference = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    extra.appendChild(selectField("Blijft er water staan na regen?", TRI, project.site.wetSpots, (val) => { project.site.wetSpots = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    extra.appendChild(textField("Obstakels (bijv. boom, put, regenpijp)", project.access.obstacles, (v) => { project.access.obstacles = v; }));
    extra.appendChild(selectField("Bekende kabels of leidingen in de werkzone?", [
      { id: "unknown", label: "Weet ik niet" }, { id: "none-known", label: "Niet bij mij bekend" }, { id: "known", label: "Ja, er ligt iets" }
    ], project.site.utilities, (val) => { project.site.utilities = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (project.site.utilities === "known") {
      extra.appendChild(textAreaField("Wat en waar ongeveer?", project.site.utilitiesNote, (v) => { project.site.utilitiesNote = v; }));
    }
    extra.appendChild(hintEl("Wat u hier invult helpt ons voorbereiden, maar vervangt geen onderzoek: bij machinaal grondwerk wordt kabel- en leidinginformatie vooraf gecontroleerd (KLIC-melding waar van toepassing, zie voorwaarden artikel 10)."));
    if (usesFence()) {
      extra.appendChild(selectField("Staat de schutting op of bij de erfgrens?", [
        { id: "unknown", label: "Weet ik niet" }, { id: "own-ground", label: "Volledig op eigen grond" },
        { id: "shared-agreed", label: "Op de grens, afgesproken met de buren" }, { id: "shared-unclear", label: "Op de grens, nog niet besproken" }
      ], project.site.boundary, (val) => { project.site.boundary = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
      if (project.site.boundary.startsWith("shared")) {
        extra.appendChild(textAreaField("Bekende afspraken met de buren (optioneel)", project.site.boundaryNote, (v) => { project.site.boundaryNote = v; }));
      }
      extra.appendChild(hintEl("Ons ontwerp is geen juridische grensbepaling en geen vergunning. Zie onze voorwaarden (artikel 7 en 8) voor erfgrens en toestemming."));
    }
    fs.appendChild(extra);

    if (project.options.route === "install-only") {
      const t = document.createElement("p");
      t.className = "configurator-section-title";
      t.textContent = "Uw eigen materiaal";
      fs.appendChild(t);
      fs.appendChild(textField("Systeem of merk", project.options.ownMaterials.system, (v) => { project.options.ownMaterials.system = v; }));
      fs.appendChild(textField("Artikelnummer (SKU), indien bekend", project.options.ownMaterials.sku, (v) => { project.options.ownMaterials.sku = v; }));
      fs.appendChild(textField("Aantallen", project.options.ownMaterials.quantity, (v) => { project.options.ownMaterials.quantity = v; }));
      fs.appendChild(hintEl("Wij controleren of uw materiaal geschikt en compleet is voordat we montage bevestigen; een foto van verpakking of etiket helpt (toe te voegen in het aanvraagformulier)."));
    }

    const placeTitle = document.createElement("p");
    placeTitle.className = "configurator-section-title";
    placeTitle.textContent = "Locatie en planning";
    fs.appendChild(placeTitle);
    const row = document.createElement("div");
    row.className = "configurator-row";
    row.appendChild(textField("Postcode", project.location.postalCode, (v) => { project.location.postalCode = v || null; }));
    row.appendChild(textField("Plaats", project.location.city, (v) => { project.location.city = v || null; renderScenesAndSummary(); }));
    fs.appendChild(row);
    const area = checkServiceArea(project.location.city);
    if (area.message) {
      const p = hintEl(area.message);
      p.setAttribute("role", "status");
      p.className = area.status === "outside" ? "field-hint area-check area-check-outside" : "field-hint area-check";
      fs.appendChild(p);
    }

    fs.appendChild(selectField("Gewenste periode", [
      { id: "", label: "Nog niet gekozen" }, { id: "asap", label: "Zo snel mogelijk" }, { id: "1-3m", label: "Binnen 1-3 maanden" }, { id: "flex", label: "Nog geen haast" }
    ], project.schedule.preferredPeriod || "", (val) => { project.schedule.preferredPeriod = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));

    panel.appendChild(fs);
    appendNav(true, true);
  }

  function nlNum(n) {
    return Number(n).toLocaleString("nl-NL", { maximumFractionDigits: 3 });
  }

  function usesMaintenance() {
    return project.services.some((x) => ["tuinonderhoud", "snoeiwerk", "kunstgras", "periodiek"].includes(x));
  }

  /** J04: aandachtspunten uit de vastgelegde toegang — geen automatische haalbaarheidsclaim. */
  function executionNotes() {
    const a = project.access;
    const n = [];
    if (a.rearAccess === "yes" && a.rearPassageWidthMm && a.rearPassageWidthMm < 800) n.push(`Smalle doorgang (${formatMeters(a.rearPassageWidthMm, 2)}): waarschijnlijk handwerk en kruiwagen in plaats van een machine.`);
    if (a.rearAccess === "no") n.push("Geen achterom: materiaal en afval moeten mogelijk door de woning of via een andere route.");
    if (a.steps === "yes") n.push("Trappen of opstapjes op de route: extra draagwerk.");
    if (a.carryDistance === "long") n.push("Lange loopafstand: meer transporttijd voor materiaal en afval.");
    if (["street-paid", "restricted"].includes(a.parking)) n.push("Parkeren/lossen is beperkt: tijdstip en eventuele ontheffing vooraf afstemmen.");
    return n;
  }

  /** J02/J03: wie voert af en hoeveel ongeveer — bandbreedte, geen gewicht of tarief. */
  function buildWasteBlock() {
    const wrap = document.createElement("div");
    wrap.className = "configurator-waste";
    const t = document.createElement("p");
    t.className = "configurator-section-title";
    t.textContent = "Afvoer van wat weg moet";
    wrap.appendChild(t);
    wrap.appendChild(selectField("Wie regelt de afvoer?", [
      { id: "unknown", label: "Weet ik nog niet / graag advies" }, { id: "seal", label: "Sealcleaning voert af" },
      { id: "customer-container", label: "Ik regel zelf een container" }, { id: "leave", label: "Blijft (deels) liggen voor hergebruik" }
    ], project.removal.disposal, (val) => { project.removal.disposal = val; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (project.removal.existingPaving) {
      const def = project.paving ? derivePavingTotals(project.paving).totalM2 : null;
      wrap.appendChild(numberField(`Oppervlak bestaande bestrating (m²)${def ? ` — leeg = ${def.toLocaleString("nl-NL")} m² zoals getekend` : ""}`, project.removal.existingPavingM2, (v) => {
        const n = parseFloat(String(v).replace(",", "."));
        project.removal.existingPavingM2 = Number.isFinite(n) && n > 0 && n < 10000 ? Math.round(n * 10) / 10 : null;
        renderScenesAndSummary();
      }));
    }
    const rows = estimateWaste(project, project.removal.existingPavingM2);
    if (rows.length) {
      const ul = document.createElement("ul");
      ul.className = "configurator-photo-tips";
      rows.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = `${r.stream}: ${r.m3 ? `ca. ${r.m3[0].toLocaleString("nl-NL")}–${r.m3[1].toLocaleString("nl-NL")} m³` : "volume na opname"} (${r.basis}). ${r.note}`;
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
      wrap.appendChild(hintEl("Indicatie in vast volume, met bandbreedte. Los gestort neemt afval meer ruimte in. Gewicht, containermaat en kosten bepalen we pas na controle van het materiaal."));
    }
    return wrap;
  }

  /** H05–H08: dienstspecifieke onderhoudsintake. */
  function buildMaintenanceIntake() {
    const m = project.maintenance;
    const wrap = document.createElement("div");
    const t = document.createElement("p");
    t.className = "configurator-section-title";
    t.textContent = "Over het onderhoud";
    wrap.appendChild(t);
    wrap.appendChild(selectField("Eenmalig of periodiek?", [
      { id: "", label: "Weet ik nog niet" }, { id: "once", label: "Eenmalig" }, { id: "periodic", label: "Periodiek" }
    ], m.frequency || "", (val) => { m.frequency = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
    if (m.frequency === "periodic") {
      wrap.appendChild(textField("Gewenste frequentie (bijv. maandelijks, per seizoen)", m.frequencyWish, (v) => { m.frequencyWish = v; }));
      wrap.appendChild(hintEl("Een vaste frequentie en het tarief spreken we af na de bezichtiging."));
    }
    const has = (id) => project.services.includes(id);
    if (has("kunstgras") || has("tuinonderhoud") || has("periodiek")) {
      wrap.appendChild(selectField("Gazon: wat is nodig?", [
        { id: "", label: "Geen gazonwerk" }, { id: "mow", label: "Maaien" }, { id: "repair", label: "Herstellen (kale plekken, mos)" },
        { id: "seed", label: "Opnieuw inzaaien" }, { id: "sod", label: "Nieuwe graszoden" }, { id: "artificial", label: "Kunstgras" }
      ], m.lawn.route || "", (val) => { m.lawn.route = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
      if (m.lawn.route) {
        const row = document.createElement("div");
        row.className = "configurator-row";
        row.appendChild(selectField("Huidige staat", [
          { id: "", label: "Weet ik niet" }, { id: "ok", label: "Redelijk" }, { id: "patchy", label: "Kale plekken" },
          { id: "moss", label: "Veel mos/onkruid" }, { id: "none", label: "Geen gazon" }
        ], m.lawn.state || "", (val) => { m.lawn.state = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
        row.appendChild(numberField("Oppervlak (m², als bekend)", m.lawn.areaM2, (v) => {
          const n = parseFloat(String(v).replace(",", "."));
          m.lawn.areaM2 = Number.isFinite(n) && n > 0 && n < 100000 ? Math.round(n) : null;
          renderScenesAndSummary();
        }));
        wrap.appendChild(row);
      }
      const wl = document.createElement("div");
      wl.className = "configurator-field";
      const wt = document.createElement("p");
      wt.className = "configurator-field-label";
      wt.textContent = "Onkruid: waar?";
      wl.appendChild(wt);
      [["paving", "Tussen bestrating"], ["border", "In borders"], ["boundary", "Langs de erfgrens"]].forEach(([id, lab]) => {
        wl.appendChild(checkboxField(lab, m.weeds.locations.includes(id), (c) => {
          m.weeds.locations = c ? [...new Set([...m.weeds.locations, id])] : m.weeds.locations.filter((x) => x !== id);
          renderScenesAndSummary();
        }));
      });
      wrap.appendChild(wl);
      if (m.weeds.locations.length) {
        const row = document.createElement("div");
        row.className = "configurator-row";
        row.appendChild(selectField("Soort begroeiing", [
          { id: "", label: "Weet ik niet" }, { id: "grass", label: "Grassen/kiemplanten" }, { id: "root", label: "Wortelonkruid (bijv. heermoes, zevenblad)" }, { id: "climber", label: "Klimop/bramen" }
        ], m.weeds.type || "", (val) => { m.weeds.type = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
        row.appendChild(selectField("Achterstand", [
          { id: "", label: "Weet ik niet" }, { id: "light", label: "Licht" }, { id: "medium", label: "Gemiddeld" }, { id: "heavy", label: "Flink" }
        ], m.weeds.backlog || "", (val) => { m.weeds.backlog = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
        wrap.appendChild(row);
        wrap.appendChild(hintEl("Onkruid komt altijd terug; we beloven geen blijvend onkruidvrije tuin, wel een aanpak die past bij de plek."));
      }
    }
    if (has("snoeiwerk") || has("tuinonderhoud") || has("periodiek")) {
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(selectField("Snoeien: wat?", [
        { id: "", label: "Geen snoeiwerk" }, { id: "hedge", label: "Haag" }, { id: "shrub", label: "Struiken/heesters" }, { id: "tree", label: "Boom" }
      ], m.pruning.target || "", (val) => { m.pruning.target = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
      if (m.pruning.target) {
        row.appendChild(selectField("Gewenste ingreep", [
          { id: "", label: "Graag advies" }, { id: "shape", label: "In vorm knippen" }, { id: "reduce", label: "Flink terugsnoeien" }, { id: "thin", label: "Uitdunnen" }
        ], m.pruning.action || "", (val) => { m.pruning.action = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
      }
      wrap.appendChild(row);
      if (m.pruning.target) {
        wrap.appendChild(selectField("Hoogte ongeveer", [
          { id: "", label: "Weet ik niet" }, { id: "low", label: "Tot 2 m" }, { id: "mid", label: "2–4 m" }, { id: "high", label: "Hoger dan 4 m" }
        ], m.pruning.heightBand || "", (val) => { m.pruning.heightBand = val || null; renderScenesAndSummary(); }, (o) => o.label, (o) => o.id));
        if (m.pruning.target === "tree" || m.pruning.heightBand === "high") {
          wrap.appendChild(hintEl("Werk aan grote bomen of op hoogte bevestigen we pas na beoordeling ter plaatse; specialistisch boomwerk (zoals kappen) bieden we alleen aan als we het zelf verantwoord kunnen uitvoeren."));
        }
      }
    }
    return wrap;
  }

  function hintEl(textContent) {
    const p = document.createElement("p");
    p.className = "field-hint";
    p.textContent = textContent;
    return p;
  }

  function renderStepOverzicht() {
    panel.innerHTML = "";
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Commerciële route</legend>
      <p class="field-hint">Hoe wilt u dit laten uitvoeren?</p>`;
    const routes = [
      { id: "design-only", title: "Alleen ontwerpen", desc: "Bewaren, vergelijken en later terugkomen." },
      { id: "material-only", title: "Materialen via Sealcleaning", desc: "Gecontroleerde materiaallijst en prijsaanvraag." },
      { id: "install-only", title: "Alleen montage", desc: "U heeft eigen materiaal; wij monteren na controle." },
      { id: "material-and-install", title: "Materiaal + montage", desc: "Eén dossier, compleet uitgevoerd." },
      { id: "review-plan", title: "Laat ons het plan beoordelen", desc: "U komt zelf ver, wij toetsen de technische kant." }
    ];
    const grid = document.createElement("div");
    grid.className = "configurator-route-grid";
    routes.forEach((route) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-pressed", project.options.route === route.id ? "true" : "false");
      btn.innerHTML = `<strong>${route.title}</strong><span>${route.desc}</span>`;
      btn.addEventListener("click", () => {
        project.options.route = route.id;
        project.options.materialSupply = route.id === "install-only" ? "customer-supplied" : route.id === "design-only" ? "advice-needed" : "sealcleaning-supplied";
        renderAll();
      });
      grid.appendChild(btn);
    });
    fs.appendChild(grid);
    panel.appendChild(fs);

    panel.appendChild(buildSummaryBlock());
    const priceBox = document.createElement("div");
    priceBox.className = "configurator-price-status";
    priceBox.textContent = "Prijsindicatie wordt geladen…";
    panel.appendChild(priceBox);
    fillPriceStatusBlock(priceBox);
    panel.appendChild(buildCompletenessBlock());
    panel.appendChild(buildActionsBlock());
    appendNav(true, false);
  }

  function buildSummaryBlock() {
    const wrap = document.createElement("div");
    wrap.className = "configurator-summary";
    const dl = document.createElement("dl");
    const rows = [];
    rows.push(["Diensten", project.services.map((id) => SERVICES.find((s) => s.id === id)?.label || id).join(", ") || "—"]);
    if (project.garden.geometryKnown) {
      const gardenM2 = polygonAreaMm2(gardenPolygon(project.garden)) / 1_000_000;
      const shapeLabel = { rect: "rechthoek", L: "L-vorm", free: "vrije contour" }[project.garden.shape] || "rechthoek";
      rows.push(["Tuinvlak", `${shapeLabel}, ${formatM2(Math.round(gardenM2 * 10) / 10, 1)}`]);
    }
    if (project.fence) {
      const lens = deriveFenceLengths(project.fence);
      rows.push(["Schutting — lijnlengte", formatMeters(lens.totalLineLengthMm, 2)]);
      rows.push(["Schutting — gesloten lengte", formatMeters(lens.closedLengthMm, 2)]);
      rows.push(["Schutting — hoogte", `${project.fence.heightMm / 10} cm`]);
      rows.push(["Poorten", String((project.fence.gates || []).length)]);
    }
    if (project.paving) {
      const totals = derivePavingTotals(project.paving);
      rows.push(["Bestrating — oppervlak", formatM2(totals.totalM2, 1)]);
    }
    rows.push(["Route", project.options.route || "nog niet gekozen"]);
    rows.push(["Plaats", project.location.city || "—"]);
    for (const [label, value] of rows) {
      const dt = document.createElement("dt"); dt.textContent = label;
      const dd = document.createElement("dd"); dd.textContent = value;
      dl.appendChild(dt); dl.appendChild(dd);
    }
    wrap.appendChild(dl);
    return wrap;
  }

  /**
   * Toont alleen een materiaalindicatie wanneer er een prijsregel bestaat
   * voor het daadwerkelijk gekozen tegelformaat (v6.0 H04-bevinding: de
   * vorige versie gebruikte altijd dezelfde 60×60-productregel, ook bij
   * 30×30 of 80×80). Geen passende regel → geen verzonnen prijs, alleen de
   * generieke "op aanvraag"-tekst.
   */
  async function fillPriceStatusBlock(box) {
    const priceSources = await loadPriceSources();
    const parts = [];
    if (project.paving && derivePavingTotals(project.paving).totalM2 > 0) {
      const ind = pavingIndication(project, captureChoices(project).paving, priceSources);
      const formatLabel = `${project.paving.nominalTileLengthMm / 10}×${project.paving.nominalTileWidthMm / 10} cm`;
      if (ind) {
        const basis = ind.basis === "gekozen product" ? "uw gekozen product" : ind.basis;
        parts.push(`Bekende materiaalindicatie voor ${formatLabel} (${basis}, ${ind.row.productLabel}, ${ind.count} stuks, excl. korting): ${euro(ind.amountCents)}. Bron: ${ind.row.sourceUrl} (${ind.row.observedAt}).`);
      } else {
        parts.push(`Voor formaat ${formatLabel} is nog geen gecontroleerde materiaalprijs beschikbaar — zie alle onderzochte formaten op de prijzenpagina.`);
      }
    }
    parts.push("Montage, ondergrond, afvoer en levering ontbreken nog — dit is geen projecttotaal. Prijs wordt na controle van uw samenstelling berekend.");
    box.textContent = parts.join(" ");
  }

  function euro(cents) {
    return (cents / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
  }

  /** Materiaalkeuze bewaren op het inspiratiebord (I06), alleen lokaal. */
  function buildInspirationSave() {
    const wrap = document.createElement("div");
    wrap.className = "configurator-inspiration";
    const items = [];
    if (project.paving) {
      const product = project.paving.productId ? getPavingProduct(project.paving.productId) : null;
      const color = PAVING_COLOR_PRESETS.find((c) => c.id === project.paving.colorPresetId);
      const fmt = `${project.paving.nominalTileLengthMm / 10}×${project.paving.nominalTileWidthMm / 10} cm`;
      items.push(product
        ? { kind: "material", id: `paving:${product.id}`, title: product.label, group: "Bestrating", colorHex: null, note: "Referentieartikel bij externe leverancier (zie prijzenpagina voor bron)." }
        : { kind: "material", id: `paving:${color?.id}:${fmt}`, title: `Tegel ${fmt}, ${color?.label || ""}`.trim(), group: "Bestrating", colorHex: color?.colorHex || null, note: "Generieke kleur — visuele indicatie, geen specifiek product." });
    }
    if (project.fence) {
      const sys = FENCE_SYSTEMS.find((x) => x.id === project.fence.systemId);
      const preset = FENCE_MATERIAL_PRESETS.find((x) => x.id === project.fence.materialPresetId);
      items.push({ kind: "material", id: `fence:${sys?.id}:${preset?.id}`, title: `${sys?.label || "Schutting"} — ${preset?.label || ""}`, group: "Schutting", colorHex: preset?.colorHex || null, note: "Generiek systeem — visuele indicatie, geen specifiek product." });
    }
    const allSaved = items.every((it) => window.SealInspiration.has(it.kind, it.id));
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary btn-sm";
    btn.textContent = allSaved ? "Bewaard op inspiratiebord ✓" : "Bewaar deze materiaalkeuze op mijn inspiratiebord";
    btn.disabled = allSaved;
    btn.addEventListener("click", () => {
      items.forEach((it) => window.SealInspiration.add(it));
      renderPanel();
    });
    wrap.appendChild(btn);
    const a = document.createElement("a");
    a.href = "../inspiratie/";
    a.className = "inspiration-link";
    a.textContent = "Bekijk inspiratiebord";
    wrap.appendChild(a);
    return wrap;
  }

  /* ---- Varianten A/B/C vergelijken (F03/G06/G07) ---- */
  function buildVariantsFieldset() {
    const fs = document.createElement("fieldset");
    fs.className = "configurator-variants";
    fs.innerHTML = `<legend class="configurator-section-title">Varianten vergelijken (max. 3)</legend>
      <p class="field-hint">Bewaar uw huidige materiaalkeuze als variant en probeer daarna iets anders. Alle varianten gebruiken dezelfde tekening en maten, dus u vergelijkt alleen de keuzes.</p>`;
    project.variants = project.variants || [];
    const current = captureChoices(project);
    const duplicate = project.variants.find((v) => sameChoices(v.choices, current));
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-secondary btn-sm";
    const nextLabel = "ABC"[project.variants.length];
    addBtn.textContent = project.variants.length >= MAX_VARIANTS ? "Maximaal 3 varianten" : `Bewaar huidige keuze als variant ${nextLabel}`;
    addBtn.disabled = project.variants.length >= MAX_VARIANTS || !!duplicate;
    addBtn.addEventListener("click", () => {
      project.variants.push({ id: generateId("variant"), label: nextLabel, createdAt: new Date().toISOString(), choices: current });
      renderScenesAndSummary();
    });
    fs.appendChild(addBtn);
    if (duplicate) {
      const p = document.createElement("p");
      p.className = "field-hint";
      p.textContent = `Uw huidige keuze is gelijk aan variant ${duplicate.label}.`;
      fs.appendChild(p);
    }
    if (project.variants.length) {
      const holder = document.createElement("div");
      holder.className = "price-table-wrap variant-table-wrap";
      holder.textContent = "Vergelijking wordt geladen…";
      fs.appendChild(holder);
      loadPriceSources().then((ps) => fillVariantTable(holder, ps));
    }
    return fs;
  }

  function fillVariantTable(holder, priceSources) {
    const variants = project.variants;
    const described = variants.map((v) => describeChoices(v.choices));
    const indications = variants.map((v) => pavingIndication(project, v.choices.paving, priceSources));
    const table = document.createElement("table");
    table.className = "price-table variant-table";
    const thead = document.createElement("thead");
    const hr = document.createElement("tr");
    const th0 = document.createElement("th"); th0.scope = "col"; th0.textContent = "Onderdeel"; hr.appendChild(th0);
    variants.forEach((v) => { const th = document.createElement("th"); th.scope = "col"; th.textContent = `Variant ${v.label}`; hr.appendChild(th); });
    thead.appendChild(hr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const addRow = (label, cells) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th"); th.scope = "row"; th.textContent = label; tr.appendChild(th);
      cells.forEach((c) => { const td = document.createElement("td"); if (c instanceof Node) td.appendChild(c); else td.textContent = c; tr.appendChild(td); });
      tbody.appendChild(tr);
    };
    if (project.fence) {
      addRow("Schuttingsysteem", described.map((d) => d.fenceSystem || "—"));
      addRow("Materiaal / kleur", described.map((d) => d.fenceMaterial || "—"));
      addRow("Hoogte", described.map((d) => d.fenceHeight || "—"));
      addRow("Opbouw", described.map((d) => d.fenceBuildUp || "—"));
      addRow("Onderhoud schutting", described.map((d) => d.fenceMaintenance || "—"));
      addRow("Leverstatus schutting", described.map((d) => d.fenceSupply || "—"));
      addRow("Prijsbasis schutting", variants.map(() => "Geen gecontroleerde prijsregel voor dit systeem — op aanvraag"));
    }
    if (project.paving) {
      addRow("Tegelformaat", described.map((d) => d.pavingFormat || "—"));
      addRow("Legpatroon", described.map((d) => d.pavingPattern || "—"));
      addRow("Kleur", described.map((d) => d.pavingColor || "—"));
      addRow("Product", described.map((d) => d.pavingProduct || "—"));
      addRow("Onderhoud bestrating", described.map((d) => d.pavingMaintenance || "—"));
      addRow("Leverstatus bestrating", described.map((d) => d.pavingSupply || "—"));
      addRow("Materiaalindicatie tegels", indications.map((ind) => {
        if (!ind) return "Onbekend — geen gecontroleerde prijsregel voor dit formaat";
        const span = document.createElement("span");
        span.appendChild(document.createTextNode(`${euro(ind.amountCents)} (${ind.count} st., ${ind.basis}, excl. korting). Bron: `));
        const a = document.createElement("a");
        a.href = ind.row.sourceUrl; a.rel = "noopener"; a.target = "_blank";
        a.textContent = `${new URL(ind.row.sourceUrl).hostname} (${ind.row.observedAt})`;
        span.appendChild(a);
        return span;
      }));
      const ref = indications[0];
      addRow(`Verschil t.o.v. variant A`, indications.map((ind, i) => {
        if (i === 0) return "Referentie";
        if (!ind || !ref) return "Niet te berekenen — minstens één variant heeft geen bekende prijsregel";
        const d = ind.amountCents - ref.amountCents;
        return `${d > 0 ? "+" : d < 0 ? "−" : "±"}${euro(Math.abs(d))} op tegels`;
      }));
    }
    addRow("Wijzigt t.o.v. A", variants.map((v, i) => i === 0 ? "—" : (diffChoices(variants[0].choices, v.choices).join(", ") || "niets")));
    const actionCells = variants.map((v) => {
      const wrap = document.createElement("div");
      wrap.className = "variant-actions";
      const apply = document.createElement("button");
      apply.type = "button"; apply.className = "btn btn-secondary btn-sm";
      apply.textContent = `Gebruik ${v.label}`;
      apply.setAttribute("aria-label", `Variant ${v.label} toepassen op mijn ontwerp`);
      apply.disabled = sameChoices(v.choices, captureChoices(project));
      apply.addEventListener("click", () => { applyChoices(project, v.choices); renderScenesAndSummary(); });
      const rm = document.createElement("button");
      rm.type = "button"; rm.className = "link-btn";
      rm.textContent = "Verwijderen";
      rm.setAttribute("aria-label", `Variant ${v.label} verwijderen`);
      rm.addEventListener("click", () => {
        project.variants = project.variants.filter((x) => x.id !== v.id);
        project.variants.forEach((x, i) => { x.label = "ABC"[i]; });
        renderScenesAndSummary();
      });
      wrap.appendChild(apply); wrap.appendChild(rm);
      return wrap;
    });
    addRow("", actionCells);
    table.appendChild(tbody);
    holder.textContent = "";
    holder.appendChild(table);
    const note = document.createElement("p");
    note.className = "field-hint";
    note.textContent = "Onbekende impact in alle varianten: schuttingmateriaal, montage, ondergrond, afvoer en levering. Een verschil wordt alleen getoond als beide varianten een gecontroleerde prijsregel hebben.";
    holder.appendChild(note);
  }

  /** Wat zou nog helpen (B10) — informatief, blokkeert niets, geen score. */
  function missingInfo() {
    const m = [];
    const g = project.garden;
    if (usesGardenScene() && !g.geometryKnown) m.push(["maten", "Tuinmaten (stap Maten & vorm)"]);
    if (g.shape === "free" && findPolygonProblem(g.polygon)) m.push(["maten", "Een geldige tuincontour (de rand kruist zichzelf nog)"]);
    if (project.access.surface === "unknown") m.push(["situatie", "Ondergrond"]);
    if (project.access.rearAccess === "unknown") m.push(["situatie", "Bereikbaarheid via achterom/zijpad"]);
    if (project.wishes.scope !== "small" && project.site.levelDifference === "unknown") m.push(["situatie", "Hoogteverschillen"]);
    if (usesFence() && project.site.boundary === "unknown") m.push(["situatie", "Ligging t.o.v. de erfgrens"]);
    if (usesFence() && project.options.fenceIntent === "repair" && !project.options.repairNote) m.push(["situatie", "Omschrijving van de schade"]);
    if (project.options.route === "install-only" && !project.options.ownMaterials.system) m.push(["situatie", "Welk eigen materiaal u heeft"]);
    if (!project.location.city) m.push(["situatie", "Plaats"]);
    if (!project.options.route) m.push(["overzicht", "Hoe u het wilt laten uitvoeren (hierboven)"]);
    return m;
  }

  function photoTips() {
    const tips = ["Een overzichtsfoto van de hele tuin, vanaf het huis — laat zien hoe alles samenhangt."];
    if (usesFence()) tips.push("De huidige erfgrens of schutting over de volle lengte — laat palen, hoogte en aansluitingen zien.");
    if (usesPaving()) tips.push("De huidige ondergrond van dichtbij — bepaalt hoeveel grondwerk nodig is.");
    if (project.access.rearAccess !== "no") tips.push("De toegang (achterom/poort) — laat zien wat er met materiaal doorheen kan.");
    if (project.options.fenceIntent === "repair") tips.push("De schade van dichtbij — helpt bepalen of herstel zinvol is.");
    if (project.options.route === "install-only") tips.push("Het etiket of de verpakking van uw eigen materiaal — voor de controle op geschiktheid.");
    return tips;
  }

  function buildCompletenessBlock() {
    const wrap = document.createElement("div");
    wrap.className = "configurator-completeness";
    const missing = missingInfo();
    const h = document.createElement("p");
    h.className = "configurator-section-title";
    h.textContent = missing.length ? "Nuttig om nog aan te vullen" : "Uw dossier is goed gevuld";
    wrap.appendChild(h);
    if (missing.length) {
      wrap.appendChild(hintEl("Niet verplicht — u kunt gewoon doorgaan. Hoe meer we weten, hoe gerichter ons voorstel."));
      const ul = document.createElement("ul");
      ul.className = "configurator-missing";
      missing.forEach(([step, text]) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "link-btn";
        btn.textContent = text;
        btn.addEventListener("click", () => goToStep(STEPS.indexOf(step)));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    }
    const t = document.createElement("p");
    t.className = "configurator-section-title";
    t.textContent = "Handige foto's voor uw aanvraag";
    wrap.appendChild(t);
    const ul2 = document.createElement("ul");
    ul2.className = "configurator-photo-tips";
    photoTips().forEach((tip) => { const li = document.createElement("li"); li.textContent = tip; ul2.appendChild(li); });
    wrap.appendChild(ul2);
    wrap.appendChild(hintEl("Foto's voegt u toe in het aanvraagformulier. Ze worden alleen gebruikt om uw aanvraag te beoordelen."));
    return wrap;
  }

  function buildActionsBlock() {
    const wrap = document.createElement("div");
    wrap.className = "btn-row";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-secondary";
    saveBtn.textContent = "Bewaar ontwerp op dit apparaat (30 dagen)";
    saveBtn.addEventListener("click", persist);
    wrap.appendChild(saveBtn);

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn btn-secondary";
    clearBtn.textContent = "Opnieuw beginnen";
    clearBtn.addEventListener("click", () => {
      if (confirm("Weet u zeker dat u opnieuw wilt beginnen? Uw huidige ontwerp wordt verwijderd.")) clearSaved();
    });
    wrap.appendChild(clearBtn);

    if (currentView === "3d" && sceneController) {
      const exportBtn = document.createElement("button");
      exportBtn.type = "button";
      exportBtn.className = "btn btn-secondary";
      exportBtn.textContent = "Bewaar ontwerp als afbeelding";
      exportBtn.addEventListener("click", async () => {
        try {
          const blob = await sceneController.exportPng();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `sealcleaning-ontwerp-${project.projectId}.png`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (e) {
          alert("Export is niet gelukt op dit apparaat/deze browser.");
        }
      });
      wrap.appendChild(exportBtn);
    }

    const continueBtn = document.createElement("a");
    continueBtn.className = "btn btn-primary";
    continueBtn.href = buildContactHref();
    continueBtn.textContent = "Ga naar aanvraagformulier";
    continueBtn.addEventListener("click", () => storeHandoffSummary());
    wrap.appendChild(continueBtn);

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.className = "btn btn-secondary";
    downloadBtn.textContent = "Download dossier (tekst)";
    downloadBtn.addEventListener("click", downloadDossier);
    wrap.appendChild(downloadBtn);

    return wrap;
  }

  function buildTextSummary() {
    const lines = ["Sealcleaning — projectsamenvatting", `Project-ID: ${project.projectId}`, ""];
    lines.push("Diensten: " + (project.services.map((id) => SERVICES.find((s) => s.id === id)?.label || id).join(", ") || "—"));
    if (project.fence) {
      const lens = deriveFenceLengths(project.fence);
      lines.push(`Schutting: vorm ${project.fence.shape}, lijnlengte ${formatMeters(lens.totalLineLengthMm, 2)}, gesloten lengte ${formatMeters(lens.closedLengthMm, 2)}, hoogte ${project.fence.heightMm / 10} cm, ${(project.fence.gates || []).length} poort(en).`);
    }
    if (project.paving) {
      const totals = derivePavingTotals(project.paving);
      lines.push(`Bestrating: ${project.paving.areas.length} vlak(ken), totaal ${formatM2(totals.totalM2, 1)}, patroon ${project.paving.pattern}.`);
    }
    const g = project.garden;
    if (g.geometryKnown) {
      lines.push(`Tuinvlak: ${{ rect: "rechthoek", L: "L-vorm", free: "vrije contour" }[g.shape] || "rechthoek"}, ${formatM2(Math.round(polygonAreaMm2(gardenPolygon(g)) / 100000) / 10, 1)}` +
        (g.shape !== "rect" && g.polygon ? ` (hoekpunten in m: ${g.polygon.map((p) => `${nlNum(mmToMeters(p.xMm))};${nlNum(mmToMeters(p.zMm))}`).join(" | ")})` : ""));
    }
    if (project.fence && project.options.fenceIntent === "repair") lines.push(`Schutting: HERSTEL gevraagd. Schade: ${project.options.repairNote || "nog niet omschreven"}`);
    if (project.removal.existingFence || project.removal.existingPaving) {
      lines.push(`Verwijderen: ${[project.removal.existingFence && "bestaande schutting", project.removal.existingPaving && "bestaande bestrating"].filter(Boolean).join(", ")}`);
    }
    const objs = project.existingObjects || [];
    for (const [status, title] of [["existing-keep", "Bestaand, behouden"], ["existing-remove", "Bestaand, verwijderen (sloop/afvoer)"], ["new", "Nieuw aanleggen"]]) {
      const group = objs.filter((o) => o.status === status);
      if (!group.length) continue;
      lines.push(`${title}: ` + group.map((o) => {
        const t = getObjectType(o.type);
        const q = objectQuantity(o);
        return `${t ? t.label : o.type} (${nlNum(mmToMeters(o.footprint.lengthMm))} × ${nlNum(mmToMeters(o.footprint.widthMm))} m${q ? `, ${q.value.toLocaleString("nl-NL")} ${q.unit}` : ""})`;
      }).join("; "));
    }
    const protect = objs.filter((o) => o.status === "existing-keep" && getObjectType(o.type)?.protect);
    if (protect.length) lines.push(`Beschermen tijdens het werk: ${protect.map((o) => getObjectType(o.type).label).join(", ")} — werkzone rondom aangegeven in de tekening.`);
    lines.push(`Aanvrager: ${project.customerType === "business" ? "zakelijk" : "particulier"}${project.goal ? `; doel: ${GOALS.find((x) => x.id === project.goal)?.label || project.goal}` : ""}`);
    lines.push("", "Wensen:");
    lines.push(`- Omvang: ${optLabel(SCOPES, project.wishes.scope)}`);
    lines.push(`- Gebruik: ${project.wishes.uses.map((u) => optLabel(USES, u)).join(", ") || "—"}`);
    lines.push(`- Onderhoudswens: ${optLabel(MAINTENANCE, project.wishes.maintenance)}`);
    lines.push("", "Situatie:");
    lines.push(`- Ondergrond: ${{ unknown: "onbekend", earth: "aarde/gras", paving: "bestrating", concrete: "beton" }[project.access.surface] || "onbekend"}`);
    lines.push(`- Achterom/zijpad: ${optLabel(TRI, project.access.rearAccess)}${project.access.rearPassageWidthMm ? `, smalste doorgang ${formatMeters(project.access.rearPassageWidthMm, 2)}` : ""}`);
    lines.push(`- Trappen/opstapjes: ${optLabel(TRI, project.access.steps)}; loopafstand: ${{ unknown: "onbekend", short: "kort", medium: "gemiddeld", long: "lang" }[project.access.carryDistance]}`);
    lines.push(`- Hoogteverschillen: ${optLabel(TRI, project.site.levelDifference)}; water blijft staan: ${optLabel(TRI, project.site.wetSpots)}`);
    if (project.access.obstacles) lines.push(`- Obstakels: ${project.access.obstacles}`);
    lines.push(`- Kabels/leidingen: ${{ unknown: "onbekend", "none-known": "niet bekend bij klant", known: "ja" }[project.site.utilities]}${project.site.utilitiesNote ? ` (${project.site.utilitiesNote})` : ""} — klantinformatie, vervangt geen eigen onderzoek`);
    if (project.fence) lines.push(`- Erfgrens: ${{ unknown: "onbekend", "own-ground": "op eigen grond", "shared-agreed": "op de grens, afgesproken", "shared-unclear": "op de grens, nog niet besproken" }[project.site.boundary]}${project.site.boundaryNote ? ` (${project.site.boundaryNote})` : ""}`);
    if (project.options.route === "install-only") {
      const om = project.options.ownMaterials;
      lines.push(`- Eigen materiaal: ${om.system || "—"}, SKU ${om.sku || "—"}, aantallen ${om.quantity || "—"} (controle op geschiktheid volgt)`);
    }
    if (project.access.parking !== "unknown") lines.push(`- Parkeren/lossen: ${{ own: "eigen oprit", "street-free": "straat, vrij", "street-paid": "betaald/vergunning", restricted: "lastig" }[project.access.parking]}${project.access.parkingNote ? ` (${project.access.parkingNote})` : ""}`);
    executionNotes().forEach((n) => lines.push(`- Aandachtspunt: ${n}`));
    const waste = estimateWaste(project, project.removal.existingPavingM2);
    if (waste.length || project.removal.disposal !== "unknown") {
      lines.push("", `Afvoer: ${{ unknown: "nog niet bepaald", seal: "door Sealcleaning", "customer-container": "klant regelt container", leave: "blijft (deels) liggen" }[project.removal.disposal]}`);
      waste.forEach((r) => lines.push(`- ${r.stream}: ${r.m3 ? `ca. ${nlNum(r.m3[0])}–${nlNum(r.m3[1])} m³ (vast volume, indicatie)` : "volume na opname"} — ${r.basis}`));
    }
    if (usesMaintenance()) {
      const m = project.maintenance;
      lines.push("", "Onderhoud:");
      lines.push(`- ${{ once: "Eenmalig", periodic: "Periodiek" }[m.frequency] || "Eenmalig/periodiek nog onbekend"}${m.frequencyWish ? ` (${m.frequencyWish})` : ""}`);
      const L = {
        mow: "maaien", repair: "herstellen", seed: "inzaaien", sod: "graszoden", artificial: "kunstgras",
        ok: "redelijk", patchy: "kale plekken", moss: "veel mos/onkruid", none: "geen gazon",
        paving: "bestrating", border: "borders", boundary: "erfgrens",
        grass: "grassen/kiemplanten", root: "wortelonkruid", climber: "klimop/bramen",
        light: "licht", medium: "gemiddeld", heavy: "flink",
        hedge: "haag", shrub: "struiken/heesters", tree: "boom",
        shape: "in vorm knippen", reduce: "flink terugsnoeien", thin: "uitdunnen",
        low: "tot 2 m", mid: "2–4 m", high: "hoger dan 4 m"
      };
      const l = (k) => L[k] || "onbekend";
      if (m.lawn.route) lines.push(`- Gazon: ${l(m.lawn.route)}, staat ${l(m.lawn.state)}, ${m.lawn.areaM2 ? m.lawn.areaM2 + " m²" : "oppervlak onbekend"}`);
      if (m.weeds.locations.length) lines.push(`- Onkruid: ${m.weeds.locations.map(l).join(", ")}; soort ${l(m.weeds.type)}; achterstand ${l(m.weeds.backlog)}`);
      if (m.pruning.target) lines.push(`- Snoei: ${l(m.pruning.target)}, ingreep ${m.pruning.action ? l(m.pruning.action) : "graag advies"}, hoogte ${l(m.pruning.heightBand)}`);
    }
    lines.push("");
    lines.push(`Route: ${project.options.route || "nog niet gekozen"}`);
    lines.push(`Plaats: ${project.location.city || "—"}, postcode: ${project.location.postalCode || "—"}`);
    const area = checkServiceArea(project.location.city);
    if (area.message) lines.push(`Werkgebied: ${area.message}`);
    lines.push(`Gewenste periode: ${project.schedule.preferredPeriod || "—"}`);
    const missing = missingInfo();
    if (missing.length) lines.push("", "Nog niet ingevuld: " + missing.map((x) => x[1]).join("; "));
    lines.push("", "(Prijs wordt na controle van uw samenstelling berekend — zie website voor bekende materiaalindicaties.)");
    return lines.join("\n");
  }

  function storeHandoffSummary() {
    try { window.sessionStorage.setItem("sealProjectSummary", buildTextSummary()); } catch (e) {}
  }

  function buildContactHref() {
    const service = project.services[0];
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (project.location.city) params.set("plaats", project.location.city);
    return `../contact/?${params.toString()}&from=configurator#formulier`;
  }

  function downloadDossier() {
    const blob = new Blob([buildTextSummary()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sealcleaning-dossier-${project.projectId}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function appendNav(showBack, showNext) {
    const nav = document.createElement("div");
    nav.className = "wizard-actions";
    if (showBack) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "btn btn-secondary";
      back.textContent = "Terug";
      back.addEventListener("click", () => goToStep(stepIndex - 1));
      nav.appendChild(back);
    } else {
      nav.appendChild(document.createElement("span"));
    }
    if (showNext) {
      const next = document.createElement("button");
      next.type = "button";
      next.className = "btn btn-primary";
      next.textContent = "Volgende";
      next.disabled = stepIndex === 0 && project.services.length === 0;
      next.addEventListener("click", () => goToStep(stepIndex + 1));
      nav.appendChild(next);
    }
    panel.appendChild(nav);
    syncMobileBar(showBack, showNext);
  }

  function syncMobileBar(showBack, showNext) {
    if (!mobileBar) return;
    mobileBar.innerHTML = "";
    const label = document.createElement("span");
    label.textContent = `${stepIndex + 1}/${STEPS.length} · ${STEP_LABELS[STEPS[stepIndex]]}`;
    mobileBar.appendChild(label);
    if (showNext) {
      const next = document.createElement("button");
      next.type = "button";
      next.className = "btn btn-primary btn-sm";
      next.textContent = stepIndex === STEPS.length - 1 ? "Naar formulier" : "Volgende";
      next.addEventListener("click", () => {
        if (stepIndex === STEPS.length - 1) { storeHandoffSummary(); window.location.href = buildContactHref(); }
        else goToStep(stepIndex + 1);
      });
      mobileBar.appendChild(next);
    }
  }

  function numberField(labelText, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "configurator-field";
    const label = document.createElement("label");
    const id = "f-" + Math.random().toString(36).slice(2, 8);
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.id = id;
    input.value = value !== null && value !== undefined ? String(value).replace(".", ",") : "";
    input.addEventListener("change", () => onChange(input.value));
    wrap.appendChild(label);
    wrap.appendChild(input);
    return wrap;
  }
  function textField(labelText, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "configurator-field";
    const label = document.createElement("label");
    const id = "f-" + Math.random().toString(36).slice(2, 8);
    label.htmlFor = id; label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text"; input.id = id; input.value = value || "";
    input.addEventListener("change", () => onChange(input.value.trim()));
    wrap.appendChild(label); wrap.appendChild(input);
    return wrap;
  }
  function textAreaField(labelText, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "configurator-field";
    const label = document.createElement("label");
    const id = "f-" + Math.random().toString(36).slice(2, 8);
    label.htmlFor = id; label.textContent = labelText;
    const input = document.createElement("textarea");
    input.id = id; input.rows = 3; input.maxLength = 600; input.value = value || "";
    input.addEventListener("change", () => onChange(input.value.trim()));
    wrap.appendChild(label); wrap.appendChild(input);
    return wrap;
  }
  function checkboxField(labelText, checked, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "configurator-field";
    const label = document.createElement("label");
    label.style.display = "flex"; label.style.alignItems = "center"; label.style.gap = "0.6em";
    label.style.textTransform = "none"; label.style.fontWeight = "400";
    const input = document.createElement("input");
    input.type = "checkbox"; input.checked = !!checked; input.style.width = "20px"; input.style.height = "20px"; input.style.minHeight = "0";
    input.addEventListener("change", () => onChange(input.checked));
    label.appendChild(input);
    label.appendChild(document.createTextNode(labelText));
    wrap.appendChild(label);
    return wrap;
  }
  function selectField(labelText, options, currentId, onChange, getLabel, getId) {
    const wrap = document.createElement("div");
    wrap.className = "configurator-field";
    const label = document.createElement("label");
    const id = "f-" + Math.random().toString(36).slice(2, 8);
    label.htmlFor = id; label.textContent = labelText;
    const select = document.createElement("select");
    select.id = id;
    options.forEach((opt) => {
      const el = document.createElement("option");
      const optId = getId ? getId(opt) : opt.id;
      el.value = optId;
      el.textContent = getLabel ? getLabel(opt) : opt.label;
      el.selected = optId === currentId;
      select.appendChild(el);
    });
    select.addEventListener("change", () => onChange(select.value));
    wrap.appendChild(label); wrap.appendChild(select);
    return wrap;
  }

  function renderPanel() {
    const key = STEPS[stepIndex];
    if (key === "project") renderStepProject();
    else if (key === "maten") renderStepMaten();
    else if (key === "materialen") renderStepMaterialen();
    else if (key === "situatie") renderStepSituatie();
    else renderStepOverzicht();
  }

  /**
   * Na een veldwijziging: scene opnieuw tekenen én het huidige stappaneel
   * opnieuw renderen, zodat afgeleide meldingen (poort past niet, vlakken
   * overlappen, prijsindicatie) altijd actueel zijn. Formuliervelden
   * gebruiken het 'change'-event (niet 'input'), dat pas na blur vuurt, dus
   * een volledige re-render van het paneel verstoort geen actieve invoer.
   */
  function renderScenesAndSummary() {
    recordHistory();
    renderPanel();
    renderScenes();
    renderEditControls();
  }

  function renderAll() {
    root.dataset.step = STEPS[stepIndex];
    recordHistory();
    renderStepNav();
    renderPanel();
    renderScenes();
    renderEditControls();
    renderDesignTools();
    syncStickyTop();
  }

  // 2D/3D toggle
  const toggleButtons = root.querySelectorAll("[data-scene-view]");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const view = btn.getAttribute("data-scene-view");
      if (view === "3d" && !sceneController) {
        await load3D();
      }
      currentView = view;
      root.dataset.view = view;
      toggleButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      if (svg) svg.hidden = view === "3d";
      if (canvasHost) canvasHost.hidden = view !== "3d";
      if (sceneController && view !== "3d") { /* laat 3D-state intact, pauzeert via visibilitychange niet nodig hier */ }
      if (STEPS[stepIndex] === "overzicht") renderStepOverzicht();
    });
  });

  root.querySelectorAll("[data-camera-view]").forEach((btn) => {
    btn.addEventListener("click", () => sceneController && sceneController.setView(btn.getAttribute("data-camera-view")));
  });
  const sunAz = root.querySelector("[data-sun-azimuth]");
  const sunEl = root.querySelector("[data-sun-elevation]");
  const COMPASS = ["Noord", "Noordoost", "Oost", "Zuidoost", "Zuid", "Zuidwest", "West", "Noordwest"];
  function applySun() {
    if (!sunAz || !sunEl) return;
    const az = parseInt(sunAz.value, 10);
    sunAz.setAttribute("aria-valuetext", COMPASS[Math.round(az / 45) % 8]);
    if (sceneController && sceneController.setSun) sceneController.setSun(az, parseInt(sunEl.value, 10));
  }
  if (sunAz) sunAz.addEventListener("input", applySun);
  if (sunEl) sunEl.addEventListener("input", applySun);
  const canvasExit = root.querySelector("[data-canvas-exit]");
  if (canvasExit) canvasExit.addEventListener("click", () => setFullscreen(false));
  const resetBtn = root.querySelector("[data-camera-reset]");
  if (resetBtn) resetBtn.addEventListener("click", () => sceneController && sceneController.resetCamera());

  async function load3D() {
    const { isWebGL2Supported, createThreeScene } = await import("./three-scene.js");
    if (!isWebGL2Supported()) {
      if (sceneStatus) {
        sceneStatus.hidden = false;
        sceneStatus.textContent = "3D wordt niet ondersteund op dit apparaat/deze browser. De 2D-tekening hiernaast bevat dezelfde maten en keuzes.";
      }
      toggleButtons.forEach((b) => { if (b.getAttribute("data-scene-view") === "3d") b.disabled = true; });
      throw new Error("no-webgl2");
    }
    sceneController = createThreeScene(canvasHost, project);
    applySun();
  }

  window.addEventListener("beforeunload", () => { if (sceneController) sceneController.dispose(); });

  applyUrlPreselection();
  openSharedDesignFromHash();
  window.addEventListener("hashchange", () => { openSharedDesignFromHash(); renderDesignTools(); });
  renderAll();
  return {
    getProject: () => project,
    dispose: () => { if (sceneController) sceneController.dispose(); }
  };
}
