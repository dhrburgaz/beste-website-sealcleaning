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
import { renderScene } from "./svg-scene.js";
import { SERVICES, GARDEN_SCENE_SERVICE_IDS } from "../../data/services.js";
import { FENCE_SHAPES, FENCE_HEIGHTS_MM, FENCE_SYSTEMS, FENCE_MATERIAL_PRESETS } from "../../data/fence-systems.js";
import { PAVING_FORMATS_MM, PAVING_PATTERNS, PAVING_COLOR_PRESETS } from "../../data/paving-products.js";
import { getPavingProductsForFormat } from "../../data/materials.js";
import { attachSvgInteraction, snapMm } from "./svg-interaction.js";
import { MAX_VARIANTS, captureChoices, applyChoices, sameChoices, pavingIndication, describeChoices, diffChoices } from "./variants.js";
import { toDesignPayload, sanitizeDesign, encodeShare, decodeShare, MAX_FILE_BYTES } from "./design-io.js";
import { lPolygon, polygonAreaMm2, polygonBounds, findPolygonProblem, gardenPolygon } from "./geometry.js";

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

  function renderStepProject() {
    panel.innerHTML = "";
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
    (project.fence.gates || []).forEach((gate) => {
      const li = document.createElement("li");
      li.className = "configurator-list-item";
      li.innerHTML = `<span>Zijde ${gate.sectionId}, op ${formatMeters(gate.offsetMm, 2)}, breedte ${formatMeters(gate.clearWidthMm, 2)}</span>`;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Verwijderen";
      removeBtn.addEventListener("click", () => {
        project.fence.gates = project.fence.gates.filter((g) => g.id !== gate.id);
        renderAll();
      });
      li.appendChild(removeBtn);
      ul.appendChild(li);
    });
    fs.appendChild(ul);

    const gateErrors = validateFenceGates(project.fence);
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
      }
      const note = document.createElement("p");
      note.className = "field-hint";
      note.textContent = "Een kleur maakt een tegel niet automatisch geschikt voor een oprit — geschiktheid wordt na uw aanvraag beoordeeld.";
      fs.appendChild(note);
      panel.appendChild(fs);
    }
    if (usesFence() || usesPaving()) panel.appendChild(buildVariantsFieldset());
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
        (g.shape !== "rect" && g.polygon ? ` (hoekpunten in m: ${g.polygon.map((p) => `${mmToMeters(p.xMm)};${mmToMeters(p.zMm)}`).join(" | ")})` : ""));
    }
    if (project.fence && project.options.fenceIntent === "repair") lines.push(`Schutting: HERSTEL gevraagd. Schade: ${project.options.repairNote || "nog niet omschreven"}`);
    if (project.removal.existingFence || project.removal.existingPaving) {
      lines.push(`Verwijderen: ${[project.removal.existingFence && "bestaande schutting", project.removal.existingPaving && "bestaande bestrating"].filter(Boolean).join(", ")}`);
    }
    for (const o of project.existingObjects || []) {
      lines.push(`Object: ${o.label || o.type} — ${{ "existing-keep": "bestaand, behouden", "existing-remove": "bestaand, verwijderen", new: "nieuw" }[o.status] || o.status}` +
        (o.footprint ? `, ${mmToMeters(o.footprint.lengthMm)} × ${mmToMeters(o.footprint.widthMm)} m` : ""));
    }
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
  }

  window.addEventListener("beforeunload", () => { if (sceneController) sceneController.dispose(); });

  openSharedDesignFromHash();
  window.addEventListener("hashchange", () => { openSharedDesignFromHash(); renderDesignTools(); });
  renderAll();
  return {
    getProject: () => project,
    dispose: () => { if (sceneController) sceneController.dispose(); }
  };
}
