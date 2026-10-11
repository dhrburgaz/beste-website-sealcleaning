/**
 * Geschiktheidscheck (V12-05): optioneel, geen opslag, geen blokkade van de aanvraag.
 * De uitslag is nooit "geschikt": alleen "past mogelijk", "extra controle nodig" of "eerst advies".
 * Regels volgen alleen bevestigde producteigenschappen uit data-attributen op de pagina.
 */
const root = document.querySelector("[data-check]");
if (root) {
  const heightCm = Number(root.dataset.productHeightCm);
  const out = root.querySelector("[data-check-result]");
  const val = (n) => (root.querySelector(`input[name="${n}"]:checked`) || {}).value || "";
  function run() {
    const w = { doel: val("doel"), grond: val("grond"), hoogte: val("hoogte"), zelf: val("zelf") };
    const answered = Object.values(w).filter(Boolean).length;
    if (!answered) { out.hidden = true; return; }
    const unknown = Object.values(w).filter((v) => v === "weet-niet").length;
    const notes = [];
    let level = "past";
    if (["tegels", "klinkers", "beton"].includes(w.grond)) { level = "controle"; notes.push("Bij een harde ondergrond (tegels, klinkers of beton) vraagt de bevestiging van de palen een andere aanpak. Wij controleren dat vooraf."); }
    if (w.hoogte === "hoger") { level = "controle"; notes.push(`Dit scherm is ${heightCm} cm hoog. Wil je hoger, dan kijken we naar een ander scherm of een onderplaat.`); }
    if (w.hoogte === "lager") { level = "controle"; notes.push(`Dit scherm is ${heightCm} cm hoog. Wil je lager, dan is een ander scherm of op maat zagen nodig.`); }
    if (w.doel === "wind") { level = "controle"; notes.push("Een dicht scherm vangt wind. Wij bekijken of palen en fundering daarvoor geschikt zijn."); }
    if (unknown >= 2 || (w.grond === "weet-niet" && w.hoogte === "weet-niet")) { level = "advies"; }
    const text = { past: "Past mogelijk.", controle: "Extra controle nodig.", advies: "Wij raden eerst advies aan." }[level];
    const extra = level === "advies" ? "Je weet nog niet alles. Dat is niet erg: wij helpen je bij het kiezen." : (notes.length ? "" : "Op basis van je antwoorden zien we geen bezwaar. Wij controleren altijd de maten en de plek voordat een prijs vaststaat.");
    out.hidden = false;
    out.dataset.level = level;
    out.replaceChildren();
    const strong = document.createElement("strong"); strong.textContent = text; out.append(strong);
    if (extra) { const p = document.createElement("p"); p.textContent = extra; out.append(p); }
    if (notes.length) { const ul = document.createElement("ul"); notes.forEach((n) => { const li = document.createElement("li"); li.textContent = n; ul.append(li); }); out.append(ul); }
    const p2 = document.createElement("p"); p2.className = "v-muted"; p2.textContent = "Dit is een eerste indicatie, geen garantie. Je kunt altijd gewoon een offerte aanvragen."; out.append(p2);
  }
  root.addEventListener("change", run);
}
