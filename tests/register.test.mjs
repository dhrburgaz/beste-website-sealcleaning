import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;

test("eisenregister: alle 160 IDs A01–P10 exact één keer", () => {
  const ids = [...readFileSync(ROOT + "docs/REQUIREMENTS_INDEX.md", "utf8").matchAll(/^\| ([A-P]\d\d) \|/gm)].map((m) => m[1]);
  const expected = [..."ABCDEFGHIJKLMNOP"].flatMap((l) => Array.from({ length: 10 }, (_, i) => `${l}${String(i + 1).padStart(2, "0")}`));
  assert.deepEqual([...ids].sort(), expected);
});

test("v7-register: doorlopend genummerd, iedere regel heeft een status", () => {
  const rows = [...readFileSync(ROOT + "docs/UX_REQUIREMENTS.md", "utf8").matchAll(/^\| (UX\d{3}) \|[^|]*\|[^|]*\|[^|]*\| ([^|]+) \|/gm)];
  assert.ok(rows.length >= 170);
  rows.forEach((m, i) => { assert.equal(m[1], `UX${String(i + 1).padStart(3, "0")}`); assert.ok(m[2].trim()); });
});
