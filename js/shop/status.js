/**
 * /bestelling/?ref=…#t=…: status na terugkeer van de betaalpagina. Toont alleen wat de server bevestigt;
 * "betaald" pas na geverifieerde webhook. Het geheime token staat in de hash (gaat niet mee in serverlogs).
 */
import { apiBase, clearCart } from "./cart-store.js";

const root = document.querySelector("[data-order-status]");
const ref = new URLSearchParams(location.search).get("ref") || "";
const t = (/(?:^|[#&])t=([A-Za-z0-9_-]+)/.exec(location.hash) || [])[1] || "";
const euro = (c) => (c / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
const p = (cls, strong, text) => { const d = document.createElement("div"); d.className = `notice ${cls}`; const s = document.createElement("strong"); s.textContent = strong; const sp = document.createElement("span"); sp.textContent = text; d.append(s, sp); return d; };

let tries = 0;
async function check() {
  if (!/^B-[A-Z0-9-]+$/.test(ref) || !t || !apiBase()) { root.replaceChildren(p("notice--error", "Bestelling niet gevonden.", "Gebruik de link uit uw bevestiging of neem contact met ons op.")); return; }
  try {
    const r = await fetch(`${apiBase()}/api/public/shop/orders/${encodeURIComponent(ref)}?t=${encodeURIComponent(t)}`, { credentials: "omit" });
    if (r.status === 404) { root.replaceChildren(p("notice--error", "Bestelling niet gevonden.", "Gebruik de link uit uw bevestiging of neem contact met ons op.")); return; }
    if (!r.ok) throw new Error(String(r.status));
    const o = await r.json();
    if (o.status === "paid") {
      clearCart(); try { sessionStorage.removeItem("sealCheckoutForm"); sessionStorage.removeItem("sealOrderKey"); } catch { /* */ }
      root.replaceChildren(p("notice--success", `Bedankt, bestelling ${o.ref} is betaald.`, `Totaal ${euro(o.totalInclCents)}. U ontvangt een bevestiging per e-mail; wij nemen contact op over de levering of het afhaalmoment.`));
    } else if (o.status === "pending_payment") {
      root.replaceChildren(p("notice--pending", `Bestelling ${o.ref}: betaling nog niet bevestigd.`, "Wij wachten op bevestiging van de betaalprovider. Deze pagina ververst automatisch; u hoeft niet opnieuw te betalen."));
      if (++tries < 20) setTimeout(check, 3000);
    } else {
      root.replaceChildren(p("notice--error", `Bestelling ${o.ref}: de betaling is niet gelukt (${o.status}).`, "Er is niets afgeschreven. Uw winkelmandje staat nog klaar; u kunt het opnieuw proberen."));
    }
  } catch {
    root.replaceChildren(p("notice--offline", "De status kan nu niet worden opgehaald.", "Controleer uw verbinding en ververs de pagina. Uw bestelling en betaling gaan hierdoor niet verloren."));
  }
}
check();
