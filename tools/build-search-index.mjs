/**
 * Bouwt data/search-index.json voor /zoeken/ uit de echte pagina's van de
 * site (titel, beschrijving, h1, begin van de hoofdtekst) plus de
 * materiaalcatalogus. Opnieuw draaien na contentwijzigingen:
 *   node tools/build-search-index.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["vendor", "node_modules", ".git", "zoeken", "inspiratie", "docs", "tools", "images"]);
const SERVICES = ["tuinonderhoud", "tuinaanleg", "tuinrenovatie", "bestrating", "schuttingen", "snoeiwerk", "periodiek-tuinonderhoud"];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === "index.html") out.push(p);
  }
  return out;
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (s) => decode(s.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const pick = (html, re) => { const m = re.exec(html); return m ? strip(m[1]) : ""; };

const entries = [];
for (const file of walk(ROOT)) {
  const html = readFileSync(file, "utf8");
  if (/<meta name="robots" content="noindex/.test(html)) continue;
  const path = relative(ROOT, file).replace(/index\.html$/, "");
  const title = pick(html, /<title>([\s\S]*?)<\/title>/).replace(/\s+[—|-]\s+Sealcleaning.*$/, "");
  const description = decode(pick(html, /<meta name="description" content="([^"]*)"/));
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/);
  const mainHtml = (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) || [, ""])[1].replace(/<nav[\s\S]*?<\/nav>/g, " ").replace(/<div class="breadcrumbs">[\s\S]*?<\/div>/g, " ");
  const text = strip(mainHtml).slice(0, 700);
  const top = path.split("/")[0];
  const type = path === "" ? "Pagina" : top === "kennisbank" ? (path === "kennisbank/" ? "Pagina" : "Kennisbank")
    : top === "projecten" ? (path === "projecten/" ? "Pagina" : "Project") : SERVICES.includes(top) ? "Dienst" : "Pagina";
  entries.push({ url: path, type, title: title || h1, h1, description, text });
}

async function importData(rel) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  return import("data:text/javascript," + encodeURIComponent(src));
}
const { PAVING_VERIFIED_PRODUCTS } = await importData("data/materials.js");
const { FENCE_SYSTEMS } = await importData("data/fence-systems.js");
for (const p of PAVING_VERIFIED_PRODUCTS) {
  entries.push({ url: "prijzen/", type: "Materiaal", title: p.label, h1: "", description: `Onderzocht referentieartikel bestrating (${p.materialType}), met bron en peildatum op de prijzenpagina.`, text: "tegel terrastegel bestrating" });
}
for (const f of FENCE_SYSTEMS) {
  entries.push({ url: "project-samenstellen/?service=schutting", type: "Materiaal", title: `Schutting: ${f.label}`, h1: "", description: `${f.description} Generiek systeem — te visualiseren in de configurator.`, text: `${f.buildUp || ""} ${f.maintenance || ""}` });
}

entries.sort((a, b) => a.url.localeCompare(b.url));
writeFileSync(join(ROOT, "data/search-index.json"), JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), entries }, null, 1));
console.log(`search-index: ${entries.length} items`);
