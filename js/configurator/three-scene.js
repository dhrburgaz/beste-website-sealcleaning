/**
 * 3D-weergave van de tuinscene (schutting + bestrating), op dezelfde
 * geometry.js-berekeningen als de 2D/SVG-weergave. Wordt alleen geladen na
 * bewuste opening (ch.16/27 — geen 3D-bundle op elke dienstpagina) en alleen
 * wanneer WebGL2 beschikbaar is (zie detectWebGL2() in app.js, vóór de
 * dynamische import van deze module).
 *
 * Three.js is lokaal gevendord (vendor/three/, MIT-licentie, versie 0.186.1,
 * zie vendor/three/NOTICE.md) en wordt via een importmap als "three"
 * opgelost — geen ongepinde CDN-import.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { computeFenceLayout, computeTileLayout, computeGateSwing, gardenPolygon, polygonBounds } from "./geometry.js";
import { getFenceSystem, getFenceMaterialPreset } from "../../data/fence-systems.js";
import { getPavingColorPreset } from "../../data/paving-products.js";

const MM = 0.001; // schaal: 1 wereldeenheid = 1 meter; alle state is mm.
const IDLE_STOP_MS = 600;

export function isWebGL2Supported() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl2"));
  } catch (e) {
    return false;
  }
}

/**
 * @param {HTMLElement} host container die een <canvas> krijgt
 * @param {object} project projectstate
 * @returns {{update:Function, setView:Function, resetCamera:Function, exportPng:Function, dispose:Function}}
 */
export function createThreeScene(host, project, opts = {}) {
  const scenic = !!opts.scenic; const zoomK = opts.zoom || 1; // <1 = dichterbij (brede weergave op de homepage) // rijkere weergave voor voorbeelden (homepage, beginnersroute); de gewone editor blijft ongewijzigd
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true"); // de scene-svg blijft de toegankelijke beschrijving (ch.27)
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  const pixelRatioCap = /Mobi|Android/i.test(navigator.userAgent) ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  renderer.setClearColor(scenic ? 0xdfe8ea : 0xe9dfc9, 1);
  if (scenic) { renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; }

  const scene = new THREE.Scene();
  if (scenic) {
    const sky = document.createElement("canvas"); sky.width = 4; sky.height = 256; const sg = sky.getContext("2d"), grad = sg.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#7fa9d2"); grad.addColorStop(0.55, "#cfe0ee"); grad.addColorStop(1, "#eef2ee"); sg.fillStyle = grad; sg.fillRect(0, 0, 4, 256);
    const skyTex = new THREE.CanvasTexture(sky); skyTex.colorSpace = THREE.SRGBColorSpace; scene.background = skyTex;
    scene.fog = new THREE.Fog(0xe4ece8, 30, 95);
  }
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 60;
  controls.maxPolarAngle = Math.PI * 0.49; // niet onder de grond kunnen kijken
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, scenic ? 0.75 : 0.65));
  if (scenic) scene.add(new THREE.HemisphereLight(0xdfeeff, 0x9a8a6a, 0.8));

  // ---- Scenic: procedurele texturen en vaste pseudo-willekeur (geen externe bestanden) ----
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  function woodTexture(hex, horizontal) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 256;
    const g = c.getContext("2d");
    const base = new THREE.Color(hex).lerp(new THREE.Color(0xffffff), 0.16);
    g.fillStyle = "#" + base.getHexString(); g.fillRect(0, 0, 256, 256);
    const n = 9;
    for (let i = 0; i < n; i++) {
      const k = 0.9 + ((i * 37) % 11) / 55;
      g.fillStyle = `rgba(${base.r * 255 * k | 0},${base.g * 255 * k | 0},${base.b * 255 * k | 0},0.55)`;
      if (horizontal) g.fillRect(0, i * 256 / n, 256, 256 / n); else g.fillRect(i * 256 / n, 0, 256 / n, 256);
      g.fillStyle = "rgba(40,25,10,0.45)";
      if (horizontal) g.fillRect(0, i * 256 / n, 256, 2); else g.fillRect(i * 256 / n, 0, 2, 256);
    }
    g.strokeStyle = "rgba(60,38,16,0.22)"; g.lineWidth = 1;
    for (let i = 0; i < 70; i++) { g.beginPath(); const x = (i * 53) % 256, y = (i * 29) % 256; if (horizontal) { g.moveTo(x, y); g.lineTo(x + 70, y + 1); } else { g.moveTo(x, y); g.lineTo(x + 1, y + 70); } g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  /** Scenic: planken met zichtbare naden en nerf; per paneel één herhaling zodat planken ±14 cm breed zijn. */
  const plankCache = new Map();
  function plankTexture(hex, horizontal, dark) {
    const key = hex + horizontal + dark;
    if (plankCache.has(key)) return plankCache.get(key);
    const size = 512, n = 6, c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"), base = new THREE.Color(hex);
    let sd = 11; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
    for (let i = 0; i < n; i++) {
      const k = dark ? 0.9 + r() * 0.2 : 0.82 + r() * 0.32, y0 = i * size / n, th = size / n;
      const col = base.clone().multiplyScalar(k);
      g.fillStyle = "#" + col.getHexString();
      if (horizontal) g.fillRect(0, y0, size, th); else g.fillRect(y0, 0, th, size);
      g.strokeStyle = dark ? "rgba(255,255,255,0.045)" : "rgba(70,40,15,0.2)"; g.lineWidth = 1;
      for (let j = 0; j < (dark ? 14 : 22); j++) {
        const o = y0 + 3 + r() * (th - 6), a = r() * size, len = 60 + r() * 220;
        g.beginPath(); if (horizontal) { g.moveTo(a, o); g.bezierCurveTo(a + len / 3, o + r() * 3 - 1.5, a + len * 2 / 3, o + r() * 3 - 1.5, a + len, o); } else { g.moveTo(o, a); g.bezierCurveTo(o + r() * 3 - 1.5, a + len / 3, o + r() * 3 - 1.5, a + len * 2 / 3, o, a + len); }
        g.stroke();
      }
      g.fillStyle = dark ? "rgba(0,0,0,0.75)" : "rgba(30,16,4,0.6)";
      if (horizontal) g.fillRect(0, y0, size, 3); else g.fillRect(y0, 0, 3, size);
      g.fillStyle = dark ? "rgba(255,255,255,0.07)" : "rgba(255,235,200,0.18)";
      if (horizontal) g.fillRect(0, y0 + 3, size, 1.5); else g.fillRect(y0 + 3, 0, 1.5, size);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
    plankCache.set(key, t); return t;
  }
  const panelMatCache = new Map();
  function scenicPanelMaterial(hex, horizontal, dark, lengthM, heightM) {
    const key = [hex, horizontal, dark, lengthM.toFixed(2), heightM.toFixed(2)].join("|");
    if (panelMatCache.has(key)) return panelMatCache.get(key);
    const t = plankTexture(hex, horizontal, dark).clone(); t.needsUpdate = true;
    const plank = 0.14 * 6; // 6 planken per tegel
    if (horizontal) t.repeat.set(lengthM / 1.8, heightM / plank); else t.repeat.set(lengthM / plank, heightM / 1.8);
    const m = track(new THREE.MeshStandardMaterial({ map: t, roughness: dark ? 0.55 : 0.82, metalness: dark ? 0.05 : 0 }));
    panelMatCache.set(key, m); return m;
  }
  /** Scenic: bladtextuur en geïnstantieerde beplanting (weinig draw calls, geschikt voor mobiel). */
  let leafTex = null;
  function leafTexture() {
    if (leafTex) return leafTex;
    const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
    g.fillStyle = "#2f5a30"; g.fillRect(0, 0, 256, 256);
    let sd = 3; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
    const cols = ["#3d7a3d", "#4f8f45", "#2a5128", "#63a050", "#36703a", "#1f4222"];
    for (let i = 0; i < 1500; i++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.beginPath(); g.ellipse(r() * 256, r() * 256, 2 + r() * 5, 1.5 + r() * 3, r() * 3.14, 0, 6.28); g.fill(); }
    leafTex = new THREE.CanvasTexture(c); leafTex.colorSpace = THREE.SRGBColorSpace; leafTex.wrapS = leafTex.wrapT = THREE.RepeatWrapping; return leafTex;
  }
  function foliageMaterial(repX, repY, tint) {
    const t = leafTexture().clone(); t.needsUpdate = true; t.repeat.set(repX, repY);
    return track(new THREE.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 2.2, roughness: 0.95, color: tint || 0xffffff }));
  }
  /** Eén InstancedMesh met n elementen; place(i, matrix, color) vult positie/schaal/kleur. */
  function instancedSet(geom, material, n, place) {
    const im = new THREE.InstancedMesh(track(geom), material, n); const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), col = new THREE.Color();
    for (let i = 0; i < n; i++) { const o = place(i); e.set(0, o.ry || 0, 0); q.setFromEuler(e); m.compose(new THREE.Vector3(o.x, o.y, o.z), q, new THREE.Vector3(o.sx, o.sy ?? o.sx, o.sz ?? o.sx)); im.setMatrixAt(i, m); im.setColorAt(i, col.set(o.color)); }
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = true; im.receiveShadow = true; im.userData.noShadowOverride = true; return im;
  }
  /** Beplanting in een vlak: struiken, siergras en bloemen (hortensia-achtig). baseY = bovenkant van de grond/bak. */
  function plantBed(cx, cz, lenM, widM, baseY, density) {
    const group = [];
    const nShrub = Math.max(3, Math.min(34, Math.round(lenM * widM * 6 * density))), nGrass = Math.max(4, Math.min(48, Math.round(lenM * widM * 9 * density))), nBloom = Math.max(2, Math.min(16, Math.round(lenM * widM * 2.2 * density)));
    const rx = () => cx + (rnd() - 0.5) * lenM * 0.9, rz = () => cz + (rnd() - 0.5) * widM * 0.8;
    const GR = [0x2f5d34, 0x3e7a3f, 0x4f8a45, 0x24492b, 0x5f9a50];
    group.push(instancedSet(new THREE.IcosahedronGeometry(1, 1), foliageMaterial(1, 1), nShrub, () => { const r = 0.2 + rnd() * 0.22; return { x: rx(), y: baseY + r * 0.8, z: rz(), sx: r, sy: r * (0.8 + rnd() * 0.3), sz: r, color: GR[Math.floor(rnd() * GR.length)] }; }));
    group.push(instancedSet(new THREE.ConeGeometry(0.07, 0.8, 5, 1, true), track(new THREE.MeshStandardMaterial({ roughness: 0.9, side: THREE.DoubleSide })), nGrass * 4, () => { const h = 0.5 + rnd() * 0.5; const tan = rnd() > 0.78; return { x: rx(), y: baseY + h * 0.35, z: rz(), sx: 0.6 + rnd() * 0.6, sy: h, sz: 0.6 + rnd() * 0.6, ry: rnd() * 3, color: tan ? 0xb8a56e : 0x5f8a3c }; }));
    group.push(instancedSet(new THREE.IcosahedronGeometry(1, 1), track(new THREE.MeshStandardMaterial({ roughness: 0.8 })), nBloom, () => { const r = 0.15 + rnd() * 0.1; const k = rnd(); return { x: rx(), y: baseY + 0.3 + rnd() * 0.12, z: rz(), sx: r * 1.3, sy: r * 0.7, sz: r * 1.3, color: k < 0.6 ? 0xdfe6c8 : k < 0.85 ? 0xcfdcae : 0x9a86c8 }; }));
    return group;
  }
  function lawnTexture(widthM, depthM) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 256; const g = c.getContext("2d");
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#86a864" : "#7aa05a"; g.fillRect(0, i * 32, 256, 32); }
    let sd = 5; const r = () => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
    for (let i = 0; i < 2600; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(20,50,10,0.07)"; g.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 3); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.25, 0.25); return t; // ShapeGeometry-UV = meters
  }
  function leafMaterial(hex) { return track(new THREE.MeshStandardMaterial({ color: hex, roughness: 0.95 })); }
  const GREENS = [0x2f5d34, 0x3e7a3f, 0x4f8a45, 0x5f9a50, 0x7aa85a, 0x24492b];
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 12, 6);
  sun.castShadow = true;
  const lowPower = scenic && (/Mobi|Android/i.test(navigator.userAgent) || (window.matchMedia && matchMedia("(max-width: 700px)").matches));
  sun.shadow.mapSize.set(lowPower ? 512 : 1024, lowPower ? 512 : 1024);
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(sun.target);
  // Illustratieve zonstand (E09): richting in graden (0 = noord/boven in de tekening, 90 = oost) en hoogte.
  const sunState = { azimuthDeg: 135, elevationDeg: 40 };
  let gardenCenter = { x: 0, z: 0, span: 10 };

  function placeSun() {
    const az = (sunState.azimuthDeg * Math.PI) / 180;
    const el = (sunState.elevationDeg * Math.PI) / 180;
    const d = gardenCenter.span * 1.5 + 10;
    // tekening: -z is "boven" (noord); +x is oost
    sun.position.set(gardenCenter.x + Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, gardenCenter.z - Math.cos(az) * Math.cos(el) * d);
    sun.target.position.set(gardenCenter.x, 0, gardenCenter.z);
    const half = gardenCenter.span * 0.9 + 3;
    Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half, near: 0.5, far: d * 3 });
    sun.shadow.camera.updateProjectionMatrix();
  }

  function setSun(azimuthDeg, elevationDeg) {
    sunState.azimuthDeg = azimuthDeg;
    sunState.elevationDeg = elevationDeg;
    placeSun();
    scheduleFrame();
  }

  const dynamicGroup = new THREE.Group();
  scene.add(dynamicGroup);

  const disposables = new Set();
  function track(obj) {
    disposables.add(obj);
    return obj;
  }

  const frameListeners = new Set();
  let frameRequested = false;
  let idleTimer = null;
  let running = false;

  function renderOnce() {
    const rect = host.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const w = rect.width, h = rect.height;
      if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, true);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
    renderer.render(scene, camera);
    frameListeners.forEach((fn) => fn());
  }

  function loop() {
    frameRequested = false;
    const changed = controls.update();
    renderOnce();
    if (changed) scheduleFrame();
  }

  function scheduleFrame() {
    if (!running) return;
    if (idleTimer) clearTimeout(idleTimer);
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(loop);
    }
    idleTimer = setTimeout(() => {
      /* geen render meer nodig; volgende controls.update() start de lus opnieuw via 'change' */
    }, IDLE_STOP_MS);
  }

  controls.addEventListener("change", scheduleFrame);

  function onVisibilityChange() {
    running = document.visibilityState === "visible";
    if (running) scheduleFrame();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  running = document.visibilityState === "visible";

  const resizeObserver = new ResizeObserver(() => scheduleFrame());
  resizeObserver.observe(host);

  function clearGroup(group) {
    for (const child of [...group.children]) {
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => m.dispose());
      }
    }
  }

  function buildFence(fence) {
    if (!fence || !Array.isArray(fence.sections) || fence.sections.length === 0) return;
    const system = getFenceSystem(fence.systemId) || { nominalPanelWidthMm: 1800, postThicknessMm: 90, hasBasePlate: false };
    const preset = getFenceMaterialPreset(fence.materialPresetId);
    const heightM = (fence.heightMm || 1800) * MM;
    const baseM = system.hasBasePlate ? (system.basePlateHeightMm || 0) * MM : 0;
    const panelColor = preset ? new THREE.Color(preset.colorHex) : new THREE.Color(0xc9a876);
    const woodLike = scenic && /wood|lamel/i.test(fence.systemId || "") ;
    const sid = fence.systemId || "", isDark = /composite/i.test(sid), horizontalPlanks = !/^generic-wood$/.test(sid);
    const panelHex = "#" + panelColor.clone().multiplyScalar(isDark ? 1 : 0.78).getHexString();
    const panelMaterial = track(
      new THREE.MeshStandardMaterial({
        color: woodLike ? 0xffffff : panelColor,
        map: woodLike ? track(woodTexture(preset ? preset.colorHex : "#c9a876", /lamel/i.test(fence.systemId))) : null,
        roughness: 0.85,
        transparent: !!preset?.transparent,
        opacity: preset?.transparent ? 0.35 : 1
      })
    );
    const fitMaterial = track(new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.85 }));
    const concretePosts = scenic && !!system.hasBasePlate;
    const postMaterial = track(new THREE.MeshStandardMaterial({ color: scenic ? (concretePosts ? 0x9b9b95 : 0x26292a) : 0x3a2f22, roughness: scenic ? (concretePosts ? 0.95 : 0.5) : 0.9, metalness: scenic && !concretePosts ? 0.15 : 0 }));

    const layout = computeFenceLayout(fence, system);
    const panelThicknessM = 0.07;

    for (const section of layout.sections) {
      for (const seg of section.segments) {
        if (seg.kind === "gate") continue; // opening blijft open; geen vast paneel
        const lengthM = seg.lengthMm * MM;
        const geom = track(new THREE.BoxGeometry(lengthM, heightM, panelThicknessM));
        const mesh = new THREE.Mesh(geom, scenic ? scenicPanelMaterial(panelHex, horizontalPlanks, isDark, lengthM, heightM) : seg.kind === "fit" ? fitMaterial : panelMaterial);
        const midX = ((seg.start.xMm + seg.end.xMm) / 2) * MM;
        const midZ = ((seg.start.zMm + seg.end.zMm) / 2) * MM;
        mesh.position.set(midX, baseM + heightM / 2, midZ);
        mesh.rotation.y = -(seg.directionDeg * Math.PI) / 180;
        dynamicGroup.add(mesh);
      }
    }

    const postSize = Math.max((system.postThicknessMm || 90) * MM, scenic ? 0.13 : 0);
    for (const post of layout.posts) {
      const geom = track(new THREE.BoxGeometry(postSize, heightM + baseM + 0.15, postSize));
      const mesh = new THREE.Mesh(geom, postMaterial);
      mesh.position.set(post.xMm * MM, (heightM + baseM) / 2, post.zMm * MM);
      dynamicGroup.add(mesh);
      if (scenic) {
        const cap = new THREE.Mesh(track(new THREE.BoxGeometry(postSize + 0.04, 0.035, postSize + 0.04)), postMaterial);
        cap.position.set(post.xMm * MM, heightM + baseM + 0.15 + 0.0175, post.zMm * MM);
        dynamicGroup.add(cap);
      }
    }

    if (baseM > 0) {
      for (const section of layout.sections) {
        for (const seg of section.segments) {
          if (seg.kind === "gate") continue;
          const lengthM = seg.lengthMm * MM;
          const geom = track(new THREE.BoxGeometry(lengthM, baseM, 0.2));
          const mesh = new THREE.Mesh(geom, track(new THREE.MeshStandardMaterial({ color: scenic ? 0x5d605f : 0x9a9a92, roughness: 0.95 })));
          const midX = ((seg.start.xMm + seg.end.xMm) / 2) * MM;
          const midZ = ((seg.start.zMm + seg.end.zMm) / 2) * MM;
          mesh.position.set(midX, baseM / 2, midZ);
          mesh.rotation.y = -(seg.directionDeg * Math.PI) / 180;
          dynamicGroup.add(mesh);
        }
      }
    }
  }

  function buildPaving(paving) {
    if (!paving || !Array.isArray(paving.areas) || paving.areas.length === 0) return;
    const preset = getPavingColorPreset(paving.colorPresetId);
    const color = preset ? new THREE.Color(preset.colorHex) : new THREE.Color(0xc7c6c0);
    const material = track(new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
    const thicknessM = 0.04;

    let allTiles = [];
    for (const area of paving.areas) {
      const tiles = computeTileLayout(area, paving.nominalTileLengthMm || 600, paving.nominalTileWidthMm || 600, paving.pattern || "straight");
      allTiles = allTiles.concat(tiles);
    }
    if (allTiles.length === 0) return;
    if (scenic && paving.areas.every((a) => !a.rotationDeg)) {
      // Voegen: donkere onderlaag onder de tegels, zodat de naden zichtbaar zijn
      for (const area of paving.areas) {
        const ts = computeTileLayout(area, paving.nominalTileLengthMm || 600, paving.nominalTileWidthMm || 600, paving.pattern || "straight");
        if (!ts.length) continue;
        const x0 = Math.min(...ts.map((t) => t.xMm)), z0 = Math.min(...ts.map((t) => t.zMm)), x1 = Math.max(...ts.map((t) => t.xMm + t.lengthMm)), z1 = Math.max(...ts.map((t) => t.zMm + t.widthMm));
        const under = new THREE.Mesh(track(new THREE.BoxGeometry((x1 - x0) * MM, 0.03, (z1 - z0) * MM)), track(new THREE.MeshStandardMaterial({ color: 0x6f6d68, roughness: 1 })));
        under.position.set((x0 + x1) / 2 * MM, 0.015, (z0 + z1) / 2 * MM); dynamicGroup.add(under);
      }
    }

    const unitGeom = track(new THREE.BoxGeometry(1, 1, 1));
    const instanced = new THREE.InstancedMesh(unitGeom, material, allTiles.length);
    const m = new THREE.Matrix4();
    allTiles.forEach((tile, i) => {
      const cx = (tile.xMm + tile.lengthMm / 2) * MM;
      const cz = (tile.zMm + tile.widthMm / 2) * MM;
      m.compose(
        new THREE.Vector3(cx, thicknessM / 2, cz),
        new THREE.Quaternion(),
        new THREE.Vector3(tile.lengthMm * MM - 0.004, thicknessM, tile.widthMm * MM - 0.004)
      );
      instanced.setMatrixAt(i, m);
      if (scenic) { const j = 0.93 + rnd() * 0.12; instanced.setColorAt(i, new THREE.Color(j, j, j)); }
    });
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
    instanced.instanceMatrix.needsUpdate = true;
    dynamicGroup.add(instanced);
    track(instanced.geometry);
  }

  function buildGardenGround(garden) {
    // Zelfde contour als de 2D-weergave (gardenPolygon), dus identiek oppervlak.
    const polygon = gardenPolygon(garden);
    const b = polygonBounds(polygon);
    const widthM = (b.maxX - b.minX) * MM;
    const depthM = (b.maxZ - b.minZ) * MM;
    const shape = new THREE.Shape(polygon.map((p) => new THREE.Vector2(p.xMm * MM, -p.zMm * MM)));
    const geom = track(new THREE.ShapeGeometry(shape));
    const material = track(new THREE.MeshStandardMaterial({ color: scenic ? 0xffffff : 0x9fb088, map: scenic ? lawnTexture(widthM, depthM) : null, roughness: 1, side: THREE.DoubleSide }));
    const ground = new THREE.Mesh(geom, material);
    ground.rotation.x = -Math.PI / 2; // (x, -z) in vormvlak → (x, 0, z) in de wereld
    ground.position.y = -0.01;
    ground.userData.isGround = true;
    dynamicGroup.add(ground);

    const cx = (b.minX + b.maxX) / 2 * MM, cz = (b.minZ + b.maxZ) / 2 * MM;
    if (scenic) {
      // Aarden voet onder de tuin, zoals een maquette
      const slab = new THREE.Mesh(track(new THREE.BoxGeometry(widthM + 0.3, 0.4, depthM + 0.3)), track(new THREE.MeshStandardMaterial({ color: 0x6d5642, roughness: 1 })));
      slab.position.set(cx, -0.22, cz); slab.userData.isGround = true;
      dynamicGroup.add(slab);
      const around = new THREE.Mesh(track(new THREE.PlaneGeometry(200, 200)), track(new THREE.MeshStandardMaterial({ color: 0x5f8350, roughness: 1 })));
      around.rotation.x = -Math.PI / 2; around.position.set(cx, -0.43, cz); around.userData.isGround = true;
      dynamicGroup.add(around);
    } else {
      const grid = track(new THREE.GridHelper(Math.max(widthM, depthM) * 1.4, Math.round(Math.max(widthM, depthM))));
      grid.position.set(cx, 0, cz);
      dynamicGroup.add(grid);
    }

    return { widthM, depthM, cx, cz };
  }

  /** Poortblad op 30° open, zodat draairichting en scharnier ook in 3D zichtbaar zijn (D05). */
  function buildGateLeaves(fence) {
    if (!fence) return;
    const mat = track(new THREE.MeshStandardMaterial({ color: scenic ? 0xffffff : 0x8a5a3a, map: scenic ? plankTexture("#9a6a3a", true, false) : null, roughness: 0.8 }));
    for (const gate of fence.gates || []) {
      const sw = computeGateSwing(fence, gate);
      if (!sw) continue;
      const t = Math.PI / 6;
      const v0 = { x: sw.closedTip.xMm - sw.hinge.xMm, z: sw.closedTip.zMm - sw.hinge.zMm };
      const v1 = { x: sw.openTip.xMm - sw.hinge.xMm, z: sw.openTip.zMm - sw.hinge.zMm };
      const tip = { x: sw.hinge.xMm + v0.x * Math.cos(t) + v1.x * Math.sin(t), z: sw.hinge.zMm + v0.z * Math.cos(t) + v1.z * Math.sin(t) };
      const h = (gate.heightMm || fence.heightMm || 1800) * MM;
      const len = gate.clearWidthMm * MM;
      const leaf = new THREE.Mesh(track(new THREE.BoxGeometry(len, h, 0.04)), mat);
      leaf.position.set((sw.hinge.xMm + tip.x) / 2 * MM, h / 2 + 0.05, (sw.hinge.zMm + tip.z) / 2 * MM);
      leaf.rotation.y = -Math.atan2(tip.z - sw.hinge.zMm, tip.x - sw.hinge.xMm);
      dynamicGroup.add(leaf);
    }
  }

  /** Bestaande/nieuwe objecten als eenvoudige volumes op dezelfde footprint als 2D. */
  function buildObjects(objects) {
    const COLORS = { plant: 0x55803f, lamp: 0x2f2f2f, gravel: 0xc9c2b2, deck: 0x9c7451, planter: 0x7d6650, "house-wall": 0x8a8a85, shed: 0xa98c6b, hedge: 0x3f6b35, border: 0x7a8f4a, lawn: 0x8fb36a, "gate-existing": 0x6e5338 };
    const HEIGHTS = { plant: 1.2, lamp: 0.6, gravel: 0.04, deck: 0.15, planter: 0.5, "house-wall": 2.7, shed: 2.3, hedge: 1.5, border: 0.12, lawn: 0.03, "gate-existing": 1.8 };
    for (const o of objects) {
      if (!o.footprint) continue;
      const { xMm, zMm, lengthMm, widthMm } = o.footprint;
      const remove = o.status === "existing-remove";
      const mat = track(new THREE.MeshStandardMaterial({
        color: remove ? 0xb5523b : (COLORS[o.type] ?? 0x4f7d3a), roughness: 0.9,
        transparent: remove, opacity: remove ? 0.35 : 1
      }));
      const cx = (xMm + lengthMm / 2) * MM, cz = (zMm + widthMm / 2) * MM;
      if (o.type === "tree") {
        const crownR = Math.min(lengthMm, widthMm) / 2 * MM;
        const trunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.17, 2.4, 10)), track(new THREE.MeshStandardMaterial({ color: remove ? 0xb5523b : 0x6e5338, roughness: 1, transparent: remove, opacity: remove ? 0.35 : 1 })));
        trunk.position.set(cx, 1.2, cz);
        dynamicGroup.add(trunk);
        if (scenic && !remove) {
          const GR = [0x3e7a3f, 0x4f8a45, 0x5f9a50, 0x2f5d34, 0x6aa557];
          const crown = instancedSet(new THREE.IcosahedronGeometry(1, 1), foliageMaterial(1, 1), 9, (i) => { const rr = crownR * (0.4 + rnd() * 0.3); const a = rnd() * 6.28, d = crownR * 0.55 * Math.sqrt(rnd()); return { x: cx + Math.cos(a) * d, y: 2.5 + crownR * (0.5 + rnd() * 0.9), z: cz + Math.sin(a) * d, sx: rr, sy: rr * 0.85, sz: rr, color: GR[i % GR.length] }; });
          dynamicGroup.add(crown);
        } else {
          const crown = new THREE.Mesh(track(new THREE.SphereGeometry(crownR, 16, 12)), mat);
          crown.position.set(cx, 2.2 + crownR * 0.8, cz); dynamicGroup.add(crown);
        }
        continue;
      }
      if (o.type === "plant") {
        const r = Math.min(lengthMm, widthMm) / 2 * MM;
        const bush = new THREE.Mesh(track(new THREE.SphereGeometry(r, 14, 10)), scenic && !remove ? foliageMaterial(1, 1) : mat);
        bush.position.set(cx, r, cz);
        dynamicGroup.add(bush);
        continue;
      }
      if (o.type === "lamp") {
        const pole = new THREE.Mesh(track(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 10)), mat);
        pole.position.set(cx, 0.3, cz);
        const glow = new THREE.Mesh(track(new THREE.SphereGeometry(0.07, 10, 8)), track(new THREE.MeshStandardMaterial({ color: 0xfff1c4, emissive: 0xffd77a, emissiveIntensity: 0.8 })));
        glow.position.set(cx, 0.64, cz);
        dynamicGroup.add(pole, glow);
        continue;
      }
      if (scenic && !remove && o.type === "hedge") {
        const hh = 1.15, lm = lengthMm * MM, wm = widthMm * MM;
        const hedge = new THREE.Mesh(track(new THREE.BoxGeometry(lm, hh, wm)), foliageMaterial(Math.max(1, lm / 0.9), 1.3, 0xffffff));
        hedge.position.set(cx, hh / 2 + 0.05, cz);
        const top = new THREE.Mesh(track(new THREE.BoxGeometry(lm * 0.97, 0.12, wm * 0.9)), foliageMaterial(Math.max(1, lm / 0.9), 1, 0xe8f2d8));
        top.position.set(cx, hh + 0.09, cz);
        dynamicGroup.add(hedge, top);
        continue;
      }
      if (scenic && !remove && (o.type === "border" || o.type === "planter")) {
        const isPlanter = o.type === "planter", baseH = isPlanter ? 0.55 : 0.1, lm = lengthMm * MM, wm = widthMm * MM;
        const body = new THREE.Mesh(track(new THREE.BoxGeometry(lm, baseH, wm)), track(new THREE.MeshStandardMaterial({ color: isPlanter ? 0x2b2f31 : 0x5a4634, roughness: isPlanter ? 0.55 : 1, metalness: isPlanter ? 0.3 : 0 })));
        body.position.set(cx, baseH / 2, cz); dynamicGroup.add(body);
        if (isPlanter) { const soil = new THREE.Mesh(track(new THREE.BoxGeometry(lm - 0.1, 0.04, wm - 0.1)), track(new THREE.MeshStandardMaterial({ color: 0x4a3a2d, roughness: 1 }))); soil.position.set(cx, baseH + 0.01, cz); dynamicGroup.add(soil); }
        plantBed(cx, cz, lm, wm, baseH, isPlanter ? 1.3 : 1).forEach((im) => dynamicGroup.add(im));
        continue;
      }
      const h = HEIGHTS[o.type] ?? 1;
      const box = new THREE.Mesh(track(new THREE.BoxGeometry(lengthMm * MM, h, widthMm * MM)), mat);
      box.position.set(cx, h / 2, cz);
      dynamicGroup.add(box);
    }
  }

  function update(nextProject) {
    project = nextProject;
    seed = 7;
    for (const obj of disposables) {
      if (obj.dispose) obj.dispose();
    }
    disposables.clear();
    clearGroup(dynamicGroup);

    const { widthM, depthM, cx, cz } = buildGardenGround(project.garden);
    buildFence(project.fence);
    buildPaving(project.paving);
    buildObjects(project.existingObjects || []);
    buildGateLeaves(project.fence);
    if (opts.figure && project.fence && project.fence.sections.length) {
      // Neutrale, schematische schaalfiguur van 1,75 m naast het begin van de schutting.
      const s0 = project.fence.sections[0];
      const rad = (s0.directionDeg * Math.PI) / 180;
      const fx = (s0.start.xMm + Math.cos(rad) * 1200 - Math.sin(rad) * 900) * MM;
      const fz = (s0.start.zMm + Math.sin(rad) * 1200 + Math.cos(rad) * 900) * MM;
      const fm = track(new THREE.MeshStandardMaterial({ color: 0x7e8b99, roughness: 0.8 }));
      const body = new THREE.Mesh(track(new THREE.CylinderGeometry(0.17, 0.2, 1.4, 14)), fm);
      body.position.set(fx, 0.7, fz);
      const head = new THREE.Mesh(track(new THREE.SphereGeometry(0.13, 14, 12)), fm);
      head.position.set(fx, 1.62, fz);
      dynamicGroup.add(body, head);
    }

    gardenCenter = { x: cx, z: cz, span: Math.max(widthM, depthM) };
    placeSun();
    dynamicGroup.traverse((o) => { if (o.isMesh) { o.castShadow = !o.userData.isGround; o.receiveShadow = true; } });

    if (scenic && widthM && depthM) {
      camera.fov = 32; camera.updateProjectionMatrix();
      const span = Math.max(widthM, depthM);
      controls.target.set(cx, 0.7, cz);
      const d = span * 1.85 * zoomK;
      camera.position.set(cx - d * 0.34, d * 0.31, cz + d * 0.82);
    } else if (!controls.target.lengthSq() && widthM && depthM) {
      controls.target.set(cx, 0.3, cz);
      camera.position.set(cx + widthM * 0.7, Math.max(widthM, depthM) * 0.6, cz + depthM * 0.9);
    }
    scheduleFrame();
  }

  function setView(viewName) {
    const target = controls.target.clone();
    const dist = Math.max(camera.position.distanceTo(target), 6);
    if (viewName === "eye" && gardenCenter) {
      // Ooghoogte: staand mens (±1,6 m) aan de rand van de tuin, kijkend over de tuin.
      const span = gardenCenter.span || 8;
      controls.target.set(gardenCenter.x, 0.9, gardenCenter.z - span * 0.15);
      camera.position.set(gardenCenter.x, 1.6, gardenCenter.z + span * 0.55);
      controls.update();
      scheduleFrame();
      return;
    }
    if (viewName === "top") {
      camera.position.set(target.x, dist * 1.3, target.z + 0.001);
    } else if (viewName === "front") {
      camera.position.set(target.x, target.y + dist * 0.25, target.z + dist * 1.1);
    } else if (scenic) {
      const d = Math.max(dist, (gardenCenter.span || 8) * 1.75 * zoomK);
      camera.position.set(target.x - d * 0.34, d * 0.34, target.z + d * 0.82);
    } else {
      camera.position.set(target.x + dist * 0.7, dist * 0.55, target.z + dist * 0.9);
    }
    controls.update();
    scheduleFrame();
  }

  /** Schermpositie (px, relatief aan de host) van een wereldpunt in meters, voor maatlabels in HTML. */
  function projectPoint(xM, yM, zM) {
    const v = new THREE.Vector3(xM, yM, zM).project(camera);
    const r = host.getBoundingClientRect();
    return { x: (v.x * 0.5 + 0.5) * r.width, y: (-v.y * 0.5 + 0.5) * r.height, visible: v.z < 1 };
  }
  function onFrame(fn) { frameListeners.add(fn); scheduleFrame(); return () => frameListeners.delete(fn); }

  function resetCamera() {
    update(project);
  }

  /**
   * Render + lees de canvas direct binnen dezelfde taak (vóór de volgende
   * clear/swap). Dat voorkomt dat preserveDrawingBuffer permanent aan moet
   * staan (ch.16) terwijl toBlob() toch het zojuist gerenderde frame pakt.
   */
  function exportPng(brandLabel) {
    return new Promise((resolve, reject) => {
      renderOnce();
      canvas.toBlob((rawBlob) => {
        if (!rawBlob) return reject(new Error("Export mislukt."));
        compositeWithBranding(rawBlob, brandLabel).then(resolve, reject);
      }, "image/png");
    });
  }

  async function compositeWithBranding(rawBlob, brandLabel) {
    const bitmap = await createImageBitmap(rawBlob);
    const out = document.createElement("canvas");
    out.width = bitmap.width;
    out.height = bitmap.height;
    const ctx = out.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    const barHeight = Math.round(bitmap.height * 0.07);
    ctx.fillStyle = "rgba(27,42,30,0.88)";
    ctx.fillRect(0, bitmap.height - barHeight, bitmap.width, barHeight);
    ctx.fillStyle = "#f3ede1";
    ctx.font = `${Math.round(barHeight * 0.42)}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(
      (brandLabel || "Ontworpen met Sealcleaning · sealcleaning.nl"),
      16,
      bitmap.height - barHeight / 2
    );
    return new Promise((resolve, reject) => {
      out.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt."))), "image/png");
    });
  }

  function dispose() {
    running = false;
    if (idleTimer) clearTimeout(idleTimer);
    controls.removeEventListener("change", scheduleFrame);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    resizeObserver.disconnect();
    controls.dispose();
    clearGroup(dynamicGroup);
    for (const obj of disposables) {
      if (obj.dispose) obj.dispose();
    }
    disposables.clear();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  update(project);
  setView("3d");

  return { update, setView, resetCamera, exportPng, dispose, setSun, projectPoint, onFrame };
}
