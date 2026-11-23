import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");

test("078 remains configured for calls, without WhatsApp route", () => {
  const config = read("js/config.js");
  const main = read("js/main.js");
  const style = read("css/style.css");
  assert.match(config, /phoneDisplay: "078 204 95 17"/);
  assert.match(config, /phoneHref: "tel:\+31782049517"/);
  assert.doesNotMatch(config, /https:\/\/wa\.me|window\.sealWaLink|whatsappNumber/);
  assert.match(config, /\[data-whatsapp\][\s\S]*?\.remove\(\)/);
  assert.match(style, /\[data-whatsapp\]\s*\{\s*display:\s*none\s*!important/);
  assert.doesNotMatch(main, /stuur een WhatsApp-bericht|WhatsApp-bericht sturen/);
});

test("NL and TR contact pages retain 078 and a functional quote form", () => {
  for (const page of ["contact/index.html", "tr/contact/index.html"]) {
    const html = read(page);
    assert.match(html, /078 204 95 17/);
    assert.match(html, /data-contact-form/);
    assert.match(html, /data-tel/);
    assert.doesNotMatch(html, /<option value="WhatsApp">/);
    assert.doesNotMatch(html, /data-attachment-alt-channel="WhatsApp"/);
  }
});

test("all published HTML pages load shared config when WhatsApp markup exists", () => {
  const excludes = new Set(["archief", "docs", "server", "tools", "tests", "vendor", "images", "data", ".github", "css", "js"]);
  function walk(path = "", results = []) {
    for (const name of readdirSync(new URL(path || "./", root))) {
      if (!path && excludes.has(name)) continue;
      const relative = join(path, name);
      const absolute = new URL(relative, root);
      if (statSync(absolute).isDirectory()) walk(relative + "/", results);
      else if (name.endsWith(".html")) results.push(relative);
    }
    return results;
  }
  for (const page of walk()) {
    const html = read(page);
    if (html.includes("data-whatsapp")) {
      assert.match(html, /js\/config\.js/, page + " requires shared config to hide WhatsApp");
      assert.match(html, /css\/style\.css/, page + " requires shared CSS");
    }
  }
});
