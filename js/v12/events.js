/**
 * Privacyvriendelijke event-taxonomie (V12-10). Er is bewust GEEN externe tracker.
 * Events dragen alleen vaste, niet-persoonlijke waarden (geen naam, e-mail, adres, foto,
 * vrije tekst, locatie of ontwerp). Zonder toestemming en zonder ingestelde ontvanger gebeurt er
 * buiten de browser niets; een lokale hook (`seal:event`) maakt toetsen en latere koppeling mogelijk.
 */
export const EVENT_NAMES = Object.freeze([
  "service_choice", "product_view", "material_selected", "measurement_help_opened",
  "design_preview_seen", "quote_started", "quote_submitted", "checkout_enabled_order_completed"
]);
// Per event de toegestane eigenschappen en hun toegestane waarden (alles daarbuiten wordt weggelaten).
const PROPS = {
  service: ["schutting", "bestrating", "tuinaanleg", "tuinonderhoud", "materialen", "hulp"],
  material: ["hout", "hout-beton", "composiet", "lamellen"],
  route: ["nieuw", "herstel", "weet-niet", "alleen-materiaal", "met-montage", "alleen-montage"],
  measure: ["precies", "ongeveer", "onbekend"]
};

export function cleanProps(props) {
  const out = {};
  for (const [k, v] of Object.entries(props || {})) {
    if (PROPS[k] && PROPS[k].includes(v)) out[k] = v;
  }
  return out;
}

export function emit(name, props) {
  if (!EVENT_NAMES.includes(name)) return false;
  if (name === "checkout_enabled_order_completed") {
    const cfg = (window.SEAL_CONFIG && window.SEAL_CONFIG.shop) || {};
    if (!cfg.live) return false; // alleen wanneer de winkel echt open is
  }
  const detail = { name, props: cleanProps(props) };
  try { window.dispatchEvent(new CustomEvent("seal:event", { detail })); } catch (e) { /* geen CustomEvent: niets doen */ }
  // Doorsturen kan alleen als de eigenaar een ontvanger instelt én de bezoeker toestemming geeft.
  const sink = window.SEAL_CONFIG && window.SEAL_CONFIG.analytics;
  if (sink && sink.enabled && sink.consent === true && typeof sink.send === "function") {
    try { sink.send(detail.name, detail.props); } catch (e) { /* een kapotte ontvanger mag niets blokkeren */ }
  }
  return true;
}
