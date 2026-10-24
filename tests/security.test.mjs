import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { DEFAULT_SETTINGS } from "../data/calc-defaults.js";

const ROOT = new URL("..", import.meta.url).pathname;
const tracked = execSync("git ls-files", { cwd: ROOT }).toString().split("\n")
  .filter((f) => f && !f.startsWith("vendor/") && !f.startsWith("images/") && !f.startsWith("docs/") && !f.startsWith("tests/") && /\.(html|js|mjs|json|css|txt|xml)$/.test(f));

test("geen geheimen of bankgegevens in openbare bestanden", () => {
  const patterns = [/-----BEGIN [A-Z ]*PRIVATE KEY/, /\bAKIA[0-9A-Z]{16}\b/, /\bsk-[A-Za-z0-9]{20,}/, /\bNL\d{2}[A-Z]{4}\d{10}\b/, /ghp_[A-Za-z0-9]{30,}/];
  for (const f of tracked) {
    const s = readFileSync(ROOT + f, "utf8");
    for (const p of patterns) assert.ok(!p.test(s), `${f} bevat verdacht patroon ${p}`);
  }
});

test("geen interne marges/kostprijzen in de openbare standaardinstellingen", () => {
  for (const k of ["laborCostRateCents", "materialMarkupPct", "machineMarkupPct", "wasteMarkupPct", "overheadPct", "riskPct", "transportPerDayCents", "minimumOrderExclCents"]) {
    assert.equal(DEFAULT_SETTINGS[k], null, `${k} moet leeg zijn in de openbare repository`);
  }
  assert.equal(DEFAULT_SETTINGS.laborRateExclCents, 6000);
});

test("beheer: strikte CSP, noindex, robots disallow", () => {
  const html = readFileSync(ROOT + "beheer/index.html", "utf8");
  assert.match(html, /Content-Security-Policy" content="default-src 'self'; script-src 'self'/);
  assert.match(html, /noindex/);
  assert.match(readFileSync(ROOT + "robots.txt", "utf8"), /Disallow: \/beheer\//);
  assert.ok(!/<script>(?!\s*$)/.test(html.replace(/<script type="module" src=|<script src=/g, "")), "geen inline scripts");
});

test("beheer- en publieke modules zetten geen data via innerHTML", () => {
  for (const f of ["js/beheer/app.js", "js/inspiration-board.js", "js/search.js"]) {
    const s = readFileSync(ROOT + f, "utf8");
    const uses = [...s.matchAll(/innerHTML\s*=\s*([^;]+);/g)].map((m) => m[1].trim());
    for (const u of uses) assert.equal(u, '""', `${f}: innerHTML alleen om te legen, gevonden: ${u}`);
  }
});

test("publieke configurator laadt geen beheergegevens", () => {
  for (const f of ["js/configurator/app.js", "js/main.js", "js/prijzen.js"]) {
    const s = readFileSync(ROOT + f, "utf8");
    assert.ok(!s.includes("sealBeheerVault"), `${f} mag de beheerkluis niet lezen`);
    assert.ok(!/calc\/engine|beheer\//.test(s), `${f} mag de interne motor niet laden`);
  }
});

test("server-UI zet geen data via innerHTML en laadt geen externe scripts", () => {
  for (const f of ["server/public/admin/admin.js", "server/public/portaal/portaal.js", "server/public/shared/ui.js", "server/public/shared/docs.js"]) {
    const s = readFileSync(ROOT + f, "utf8");
    assert.ok(!/innerHTML|insertAdjacentHTML|outerHTML\s*=|document\.write/.test(s), `${f} gebruikt HTML-injectie`);
    assert.ok(!/https?:\/\/[^"'`\s]*\.js/.test(s), `${f} laadt externe scripts`);
  }
});

test("GitHub Pages publiceert geen backend, deploy- of databestanden", () => {
  const wf = readFileSync(ROOT + ".github/workflows/deploy-pages.yml", "utf8");
  for (const p of ["./server", "./deploy", "./docs", "./tests", "./Dockerfile", "./server-data"]) assert.ok(wf.includes(`--exclude='${p}'`), `workflow sluit ${p} niet uit`);
});

test("voorbeeldconfiguratie bevat geen geheimen", () => {
  const env = readFileSync(ROOT + "server/.env.example", "utf8");
  for (const k of ["IP_HASH_SECRET", "BACKUP_KEY", "SMTP_PASS", "MOLLIE_API_KEY"]) assert.match(env, new RegExp(`^${k}=$`, "m"), `${k} moet leeg zijn`);
  const ig = readFileSync(ROOT + ".gitignore", "utf8");
  for (const p of ["server-data", ".env"]) assert.ok(ig.includes(p), `.gitignore mist ${p}`);
});
