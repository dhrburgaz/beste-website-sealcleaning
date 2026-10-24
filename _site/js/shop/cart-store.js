/**
 * Winkelmandje in deze browser: alleen product-id's, aantallen en ingevoerde codes — geen persoonsgegevens,
 * geen prijzen (die komen altijd van de server). Gedeeld door catalogus en afrekenpagina.
 */
const KEY = "sealCart";
const MAX_QTY = 999;

export function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || !Array.isArray(raw.items)) return { items: [], codes: [] };
    return {
      items: raw.items.filter((i) => typeof i.productId === "string" && Number.isInteger(i.qty) && i.qty > 0).map((i) => ({ productId: i.productId.slice(0, 80), qty: Math.min(i.qty, MAX_QTY) })).slice(0, 50),
      codes: Array.isArray(raw.codes) ? raw.codes.filter((c) => typeof c === "string").slice(0, 3) : []
    };
  } catch { return { items: [], codes: [] }; }
}
export function writeCart(cart) {
  try { localStorage.setItem(KEY, JSON.stringify({ items: cart.items, codes: cart.codes, updatedAt: new Date().toISOString() })); return true; } catch { return false; }
}
export function addToCart(productId, qty = 1) {
  const cart = readCart();
  const line = cart.items.find((i) => i.productId === productId);
  if (line) line.qty = Math.min(line.qty + qty, MAX_QTY); else cart.items.push({ productId, qty: Math.min(qty, MAX_QTY) });
  writeCart(cart);
  return cart;
}
export function setQty(productId, qty) {
  const cart = readCart();
  cart.items = qty > 0 ? cart.items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)) : cart.items.filter((i) => i.productId !== productId);
  writeCart(cart);
  return cart;
}
export function clearCart() { try { localStorage.removeItem(KEY); } catch { /* geen opslag */ } }
export function cartCount() { return readCart().items.reduce((a, i) => a + i.qty, 0); }

/** Basisadres van de backend; leeg = geen online bestellen (statische site). */
export function apiBase() { return (window.SEAL_CONFIG && window.SEAL_CONFIG.apiBase || "").replace(/\/$/, ""); }

export async function shopConfig() {
  const base = apiBase();
  if (!base) return { checkoutOpen: false, reasons: ["Online bestellen is nog niet geopend."], offline: false };
  try {
    const r = await fetch(`${base}/api/public/shop/config`, { credentials: "omit" });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } catch {
    return { checkoutOpen: false, reasons: ["De bestelservice is op dit moment niet bereikbaar. Probeer het later opnieuw."], offline: true };
  }
}
