import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const walk = (d) => readdirSync(join(ROOT, d), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (["vendor", "node_modules", ".git", "tests", "docs", "images", "server", "tools", "deploy"].includes(e.name) ? [] : walk(`${d}${e.name}/`)) : e.name.endsWith(".html") ? [`${d}${e.name}`] : []);

test("alle srcset-, src- en preload-bestanden in de HTML bestaan", () => {
  const missing = [];
  for (const f of walk("")) {
    const html = readFileSync(join(ROOT, f), "utf8");
    const refs = [...html.matchAll(/(?:srcset|src|href)="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((x) => x.trim().split(/\s+/)[0]))
      .filter((u) => /\.(webp|jpg|jpeg|png|svg|woff2|js|css|json)$/.test(u) && !/^(https?:|data:|\/\/|#|mailto:|tel:)/.test(u));
    for (const u of refs) {
      const p = u.startsWith("/") ? join(ROOT, u) : normalize(join(ROOT, dirname(f), u));
      if (!existsSync(p)) missing.push(`${f}: ${u}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("webfonts zelf gehost met licentie; geen Google Fonts-verzoeken", () => {
  for (const f of ["fraunces-latin-opsz-normal.woff2", "inter-latin-wght-normal.woff2", "LICENSE-Fraunces.txt", "LICENSE-Inter.txt"]) assert.ok(existsSync(join(ROOT, "vendor/fonts", f)), f);
  for (const f of walk("")) assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(readFileSync(join(ROOT, f), "utf8")), `${f} laadt Google Fonts`);
});

test("projectfoto's: responsive varianten bestaan en zijn kleiner dan het origineel", () => {
  const dir = join(ROOT, "images/projects");
  const originals = readdirSync(dir).filter((f) => /^[a-z0-9-]+\.webp$/.test(f) && !/-(640|960)\.webp$/.test(f));
  for (const f of originals) {
    for (const w of [640, 960]) {
      const v = join(dir, f.replace(".webp", `-${w}.webp`));
      assert.ok(existsSync(v), `${f}: ${w}-variant ontbreekt`);
      assert.ok(statSync(v).size <= statSync(join(dir, f)).size, `${f}: ${w}-variant is groter dan het origineel`);
    }
  }
});
