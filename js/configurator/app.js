/**
 * Hoofdcontroller voor /project-samenstellen/. Bouwt projectstate op uit
 * formulierinvoer, rendert de 2D/SVG-scene altijd, en laadt de 3D-laag pas
 * na bewuste opening en alleen met WebGL2 (ch.16/27).
 */
import {
  createEmptyProject, parseMetersToMm, mmToMeters, formatMeters, formatM2,
  deriveFenceLengths, validateFenceGates, derivePavingTotals, deriveTileCount,
  findPavingOverlaps, generateId, assertSerializable, cloneProjectAsVariant
} from "../project-state.js";
import { renderScene } from "./svg-scene.js";
import { SERVICES, GARDEN_SCENE_SERVICE_IDS } from "../../data/services.js";
import { FENCE_SHAPES, FENCE_HEIGHTS_MM, FENCE_SYSTEMS, FENCE_MATERIAL_PRESETS } from "../../data/fence-systems.js";
import { PAVING_FORMATS_MM, PAVING_PATTERNS, PAVING_COLOR_PRESETS } from "../../data/paving-products.js";

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

  const svg = root.querySelector("[data-scene-svg]");
  const stepNav = root.querySelector("[data-step-nav]");
  const panel = root.querySelector("[data-step-panel]");
  const ariaLive = root.querySelector("[data-scene-aria-live]");
  const canvasHost = root.querySelector("[data-scene-canvas-host]");
  const sceneStatus = root.querySelector("[data-scene-status]");
  const mobileBar = root.querySelector("[data-configurator-mobile-bar]");

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
      return payload.project;
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
    if (svg) renderScene(svg, project);
    if (sceneController) sceneController.update(project);
    announceScene();
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
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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

  function fitGardenToContent() {
    let maxX = project.garden.widthMm || 0;
    let maxZ = project.garden.depthMm || 0;
    if (project.fence) {
      for (const s of project.fence.sections) {
        const rad = (s.directionDeg * Math.PI) / 180;
        const endX = s.start.xMm + Math.cos(rad) * s.lengthMm;
        const endZ = s.start.zMm + Math.sin(rad) * s.lengthMm;
        maxX = Math.max(maxX, s.start.xMm, endX);
        maxZ = Math.max(maxZ, s.start.zMm, endZ);
      }
    }
    if (project.paving) {
      for (const a of project.paving.areas) {
        maxX = Math.max(maxX, a.position.xMm + a.lengthMm);
        maxZ = Math.max(maxZ, a.position.zMm + a.widthMm);
      }
    }
    if (!project.garden.geometryKnown || !project.garden.widthMm) {
      project.garden.widthMm = Math.max(3000, Math.round((maxX + 1500) / 100) * 100);
    }
    if (!project.garden.geometryKnown || !project.garden.depthMm) {
      project.garden.depthMm = Math.max(3000, Math.round((maxZ + 1500) / 100) * 100);
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
    appendNav(false, project.services.length > 0);
  }

  function renderStepMaten() {
    panel.innerHTML = "";
    if (usesGardenScene()) {
      const gardenFs = document.createElement("fieldset");
      gardenFs.innerHTML = `<legend class="configurator-section-title">Tuinvlak</legend>`;
      const row = document.createElement("div");
      row.className = "configurator-row";
      row.appendChild(numberField("Breedte (m)", mmToMeters(project.garden.widthMm), (v) => {
        project.garden.widthMm = parseMetersToMm(v) ?? project.garden.widthMm;
        project.garden.geometryKnown = true;
        renderScenesAndSummary();
      }));
      row.appendChild(numberField("Diepte (m)", mmToMeters(project.garden.depthMm), (v) => {
        project.garden.depthMm = parseMetersToMm(v) ?? project.garden.depthMm;
        project.garden.geometryKnown = true;
        renderScenesAndSummary();
      }));
      gardenFs.appendChild(row);
      panel.appendChild(gardenFs);
    }

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
      const note = document.createElement("p");
      note.className = "field-hint";
      note.textContent = "Een kleur maakt een tegel niet automatisch geschikt voor een oprit — geschiktheid wordt na uw aanvraag beoordeeld.";
      fs.appendChild(note);
      panel.appendChild(fs);
    }
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
    const fs = document.createElement("fieldset");
    fs.innerHTML = `<legend class="configurator-section-title">Situatie</legend>`;

    if (usesFence()) {
      fs.appendChild(
        checkboxField("Er staat al een schutting die weg moet", project.removal.existingFence, (checked) => {
          project.removal.existingFence = checked;
          project.removal.removeFence = checked;
          renderScenesAndSummary();
        })
      );
    }
    if (usesPaving()) {
      fs.appendChild(
        checkboxField("Er ligt al bestrating die weg moet", project.removal.existingPaving, (checked) => {
          project.removal.existingPaving = checked;
          project.removal.removePaving = checked;
          renderScenesAndSummary();
        })
      );
    }

    fs.appendChild(selectField("Ondergrond", [
      { id: "unknown", label: "Onbekend" }, { id: "earth", label: "Aarde" },
      { id: "paving", label: "Bestrating" }, { id: "concrete", label: "Beton" }
    ], project.access.surface, (val) => { project.access.surface = val; }, (o) => o.label, (o) => o.id));

    const row = document.createElement("div");
    row.className = "configurator-row";
    row.appendChild(textField("Postcode", project.location.postalCode, (v) => { project.location.postalCode = v || null; }));
    row.appendChild(textField("Plaats", project.location.city, (v) => { project.location.city = v || null; }));
    fs.appendChild(row);

    fs.appendChild(selectField("Gewenste periode", [
      { id: "asap", label: "Zo snel mogelijk" }, { id: "1-3m", label: "Binnen 1-3 maanden" }, { id: "flex", label: "Nog geen haast" }
    ], project.schedule.preferredPeriod, (val) => { project.schedule.preferredPeriod = val; }, (o) => o.label, (o) => o.id));

    panel.appendChild(fs);
    appendNav(true, true);
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
    panel.appendChild(buildActionsBlock());
    appendNav(true, false);
  }

  function buildSummaryBlock() {
    const wrap = document.createElement("div");
    wrap.className = "configurator-summary";
    const dl = document.createElement("dl");
    const rows = [];
    rows.push(["Diensten", project.services.map((id) => SERVICES.find((s) => s.id === id)?.label || id).join(", ") || "—"]);
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

  async function fillPriceStatusBlock(box) {
    const priceSources = await loadPriceSources();
    const parts = [];
    if (project.paving) {
      const totals = derivePavingTotals(project.paving);
      const tileRow = priceSources.rows.find((r) => r.id === "price-flairstone-garden-moon-6060");
      if (tileRow && tileRow.status !== "stale" && totals.totalM2 > 0) {
        const count = deriveTileCount(totals.totalM2, project.paving.nominalTileLengthMm, project.paving.nominalTileWidthMm, 0.05);
        const amount = ((count * tileRow.amountCents) / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
        parts.push(`Bekende materiaalindicatie tegels (${count} stuks, excl. korting): ${amount}. Bron: ${tileRow.sourceUrl} (${tileRow.observedAt}).`);
      }
    }
    parts.push("Montage, ondergrond, afvoer en levering ontbreken nog — dit is geen projecttotaal. Prijs wordt na controle van uw samenstelling berekend.");
    box.textContent = parts.join(" ");
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
    lines.push(`Route: ${project.options.route || "nog niet gekozen"}`);
    lines.push(`Plaats: ${project.location.city || "—"}, postcode: ${project.location.postalCode || "—"}`);
    lines.push(`Gewenste periode: ${project.schedule.preferredPeriod || "—"}`);
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
    renderPanel();
    renderScenes();
  }

  function renderAll() {
    renderStepNav();
    renderPanel();
    renderScenes();
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

  renderAll();
  return {
    getProject: () => project,
    dispose: () => { if (sceneController) sceneController.dispose(); }
  };
}
