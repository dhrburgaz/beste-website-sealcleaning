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
export function createThreeScene(host, project) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true"); // de scene-svg blijft de toegankelijke beschrijving (ch.27)
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  const pixelRatioCap = /Mobi|Android/i.test(navigator.userAgent) ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  renderer.setClearColor(0xe9dfc9, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 60;
  controls.maxPolarAngle = Math.PI * 0.49; // niet onder de grond kunnen kijken
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
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
    const panelMaterial = track(
      new THREE.MeshStandardMaterial({
        color: panelColor,
        roughness: 0.85,
        transparent: !!preset?.transparent,
        opacity: preset?.transparent ? 0.35 : 1
      })
    );
    const fitMaterial = track(new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.85 }));
    const postMaterial = track(new THREE.MeshStandardMaterial({ color: 0x3a2f22, roughness: 0.9 }));

    const layout = computeFenceLayout(fence, system);
    const panelThicknessM = 0.07;

    for (const section of layout.sections) {
      for (const seg of section.segments) {
        if (seg.kind === "gate") continue; // opening blijft open; geen vast paneel
        const lengthM = seg.lengthMm * MM;
        const geom = track(new THREE.BoxGeometry(lengthM, heightM, panelThicknessM));
        const mesh = new THREE.Mesh(geom, seg.kind === "fit" ? fitMaterial : panelMaterial);
        const midX = ((seg.start.xMm + seg.end.xMm) / 2) * MM;
        const midZ = ((seg.start.zMm + seg.end.zMm) / 2) * MM;
        mesh.position.set(midX, baseM + heightM / 2, midZ);
        mesh.rotation.y = -(seg.directionDeg * Math.PI) / 180;
        dynamicGroup.add(mesh);
      }
    }

    const postSize = (system.postThicknessMm || 90) * MM;
    for (const post of layout.posts) {
      const geom = track(new THREE.BoxGeometry(postSize, heightM + baseM + 0.15, postSize));
      const mesh = new THREE.Mesh(geom, postMaterial);
      mesh.position.set(post.xMm * MM, (heightM + baseM) / 2, post.zMm * MM);
      dynamicGroup.add(mesh);
    }

    if (baseM > 0) {
      for (const section of layout.sections) {
        for (const seg of section.segments) {
          if (seg.kind === "gate") continue;
          const lengthM = seg.lengthMm * MM;
          const geom = track(new THREE.BoxGeometry(lengthM, baseM, 0.2));
          const mesh = new THREE.Mesh(geom, track(new THREE.MeshStandardMaterial({ color: 0x9a9a92, roughness: 0.95 })));
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
    });
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
    const material = track(new THREE.MeshStandardMaterial({ color: 0x9fb088, roughness: 1, side: THREE.DoubleSide }));
    const ground = new THREE.Mesh(geom, material);
    ground.rotation.x = -Math.PI / 2; // (x, -z) in vormvlak → (x, 0, z) in de wereld
    ground.position.y = -0.01;
    ground.userData.isGround = true;
    dynamicGroup.add(ground);

    const cx = (b.minX + b.maxX) / 2 * MM, cz = (b.minZ + b.maxZ) / 2 * MM;
    const grid = track(new THREE.GridHelper(Math.max(widthM, depthM) * 1.4, Math.round(Math.max(widthM, depthM))));
    grid.position.set(cx, 0, cz);
    dynamicGroup.add(grid);

    return { widthM, depthM, cx, cz };
  }

  /** Poortblad op 30° open, zodat draairichting en scharnier ook in 3D zichtbaar zijn (D05). */
  function buildGateLeaves(fence) {
    if (!fence) return;
    const mat = track(new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.8 }));
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
        const trunk = new THREE.Mesh(track(new THREE.CylinderGeometry(0.12, 0.16, 2.2, 10)), track(new THREE.MeshStandardMaterial({ color: remove ? 0xb5523b : 0x6e5338, transparent: remove, opacity: remove ? 0.35 : 1 })));
        trunk.position.set(cx, 1.1, cz);
        const crown = new THREE.Mesh(track(new THREE.SphereGeometry(crownR, 16, 12)), mat);
        crown.position.set(cx, 2.2 + crownR * 0.8, cz);
        dynamicGroup.add(trunk, crown);
        continue;
      }
      if (o.type === "plant") {
        const r = Math.min(lengthMm, widthMm) / 2 * MM;
        const bush = new THREE.Mesh(track(new THREE.SphereGeometry(r, 14, 10)), mat);
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
      const h = HEIGHTS[o.type] ?? 1;
      const box = new THREE.Mesh(track(new THREE.BoxGeometry(lengthMm * MM, h, widthMm * MM)), mat);
      box.position.set(cx, h / 2, cz);
      dynamicGroup.add(box);
    }
  }

  function update(nextProject) {
    project = nextProject;
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

    gardenCenter = { x: cx, z: cz, span: Math.max(widthM, depthM) };
    placeSun();
    dynamicGroup.traverse((o) => { if (o.isMesh) { o.castShadow = !o.userData.isGround; o.receiveShadow = true; } });

    if (!controls.target.lengthSq() && widthM && depthM) {
      controls.target.set(cx, 0.3, cz);
      camera.position.set(cx + widthM * 0.7, Math.max(widthM, depthM) * 0.6, cz + depthM * 0.9);
    }
    scheduleFrame();
  }

  function setView(viewName) {
    const target = controls.target.clone();
    const dist = Math.max(camera.position.distanceTo(target), 6);
    if (viewName === "top") {
      camera.position.set(target.x, dist * 1.3, target.z + 0.001);
    } else if (viewName === "front") {
      camera.position.set(target.x, target.y + dist * 0.25, target.z + dist * 1.1);
    } else {
      camera.position.set(target.x + dist * 0.7, dist * 0.55, target.z + dist * 0.9);
    }
    controls.update();
    scheduleFrame();
  }

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

  return { update, setView, resetCamera, exportPng, dispose, setSun };
}
