/**
 * Werkgebied zoals gepubliceerd op /werkgebied/ (één bron voor scripts).
 * Plaatsnaam-controle, geen postcodegrenzen: die zijn niet door de eigenaar
 * bevestigd. Buiten dit gebied blijft aanvragen mogelijk (A09).
 */
export const SERVICE_AREA = {
  freeVisit: ["Dordrecht"],
  primary: ["Dordrecht", "Zwijndrecht", "Papendrecht", "Sliedrecht", "Hendrik-Ido-Ambacht", "Alblasserdam"],
  extended: ["Nieuw-Lekkerland", "Ridderkerk", "Barendrecht", "Rotterdam"]
};

function norm(s) {
  return String(s || "").trim().toLowerCase().replace(/[\s-]+/g, " ");
}

/** @returns {{status:'free-visit'|'primary'|'extended'|'outside'|'unknown', message:string}} */
export function checkServiceArea(city) {
  const c = norm(city);
  if (!c) return { status: "unknown", message: "" };
  const has = (list) => list.some((p) => norm(p) === c);
  if (has(SERVICE_AREA.freeVisit)) {
    return { status: "free-visit", message: "Dordrecht valt in ons primaire werkgebied; de bezichtiging is gratis en vrijblijvend." };
  }
  if (has(SERVICE_AREA.primary)) {
    return { status: "primary", message: "Deze plaats valt in ons primaire werkgebied (Drechtsteden). Eventuele voorrijkosten bespreken we altijd vooraf." };
  }
  if (has(SERVICE_AREA.extended)) {
    return { status: "extended", message: "Ook in deze plaats zijn we actief. Eventuele voorrijkosten bespreken we altijd vooraf." };
  }
  return { status: "outside", message: "Deze plaats staat niet in ons genoemde werkgebied. U kunt toch aanvragen — we laten u weten of en onder welke voorwaarden we langskomen." };
}
