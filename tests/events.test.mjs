import test from "node:test";
import assert from "node:assert/strict";
import { EVENT_NAMES, cleanProps } from "../js/v12/events.js";

test("event-taxonomie: vaste namen volgens V12-10", () => {
  assert.deepEqual([...EVENT_NAMES], ["service_choice", "product_view", "material_selected", "measurement_help_opened", "design_preview_seen", "quote_started", "quote_submitted", "checkout_enabled_order_completed"]);
});

test("event-eigenschappen: alleen vaste waarden, geen persoonsgegevens of vrije tekst", () => {
  const dirty = { service: "schutting", material: "hout-beton", email: "a@b.nl", naam: "Jan", adres: "Straat 1", tekst: "vrije tekst", foto: "data:image/png;base64,AAA", ontwerp: "#ontwerp=abc", measure: "ongeveer", route: "<script>" };
  assert.deepEqual(cleanProps(dirty), { service: "schutting", material: "hout-beton", measure: "ongeveer" });
  assert.deepEqual(cleanProps({ material: "plastic" }), {});
  assert.deepEqual(cleanProps(null), {});
});
