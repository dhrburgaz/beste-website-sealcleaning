/** Uitleg en illustraties voor de beginnersroute (gewone taal, B1). Alle uitleg is gewone HTML-tekst. */

export const MATERIALS = [
  { id: "hout", label: "Hout", system: "generic-wood", preset: "natural-wood",
    care: "Natuurlijke uitstraling. Af en toe behandelen met beits of olie.",
    photo: { name: "schutting-lichthout-appartement", alt: "Houten schutting met zwarte palen bij een nieuwbouwwoning, eigen werk", note: "Voorbeeld van een houten schutting uit eigen werk. Merk, soort hout en afmetingen staan in je offerte." } },
  { id: "hout-beton", label: "Hout met beton", system: "generic-wood-concrete", preset: "natural-wood-grey-concrete",
    care: "Het hout staat niet in de grond. Het hout behandel je af en toe.",
    photo: { name: "schutting-grenen-zwarte-voet-1", alt: "Houten schutting op een zwarte betonnen onderplaat, eigen werk", note: "Voorbeeld van een houten schutting op een betonnen onderplaat uit eigen werk. Het exacte product staat in je offerte." } },
  { id: "composiet", label: "Composiet", system: "generic-composite", preset: "anthracite-composite",
    care: "Weinig onderhoud. Meestal is schoonmaken genoeg.",
    photo: { name: "schutting-antraciet-composiet-hoek", alt: "Antracietkleurige schutting bij een parkeerplaats, eigen werk", note: "Antracietkleurige schutting uit eigen werk. Het precieze materiaal en product bevestigen we in je offerte." } },
  { id: "lamellen", label: "Horizontale planken", system: "generic-horizontal-lamellen", preset: "natural-wood",
    care: "Moderne uitstraling. Onderhoud hangt af van het materiaal.",
    photo: { name: "schutting-horizontaal-lamellen-border", alt: "Schutting met horizontale houten planken en zwarte palen, eigen werk", note: "Voorbeeld van een schutting met horizontale planken uit eigen werk. Het exacte product staat in je offerte." } }
];

export const HEIGHTS_CM = [100, 120, 150, 180, 200];
export const GATE_WIDTHS_CM = [80, 90, 100, 120];

export const HELP = {
  doel: { wat: "Hier kies je wat je met je schutting wilt.", zo: ["Kies ‘nieuwe schutting’ als je een nieuwe wilt laten plaatsen.", "Is er maar iets stuk, kies dan ‘repareren’. Je hoeft dan niets nieuws te kopen.", "Twijfel je? Kies ‘ik weet het niet’."], waarom: "Zo vragen we je alleen wat bij jouw situatie past.", voorbeeld: "Eén losse plank of een scheve paal is vaak te herstellen.", weetniet: "Kies ‘ik weet het niet’. Wij kijken met je mee." },
  materiaal: { wat: "Het materiaal bepaalt hoe je schutting eruitziet en hoeveel onderhoud hij vraagt.", zo: ["Kijk naar de foto’s. Dat zijn echte schuttingen uit ons eigen werk.", "Lees het onderhoudsregeltje.", "Je kunt later nog wisselen."], waarom: "Zodat het voorbeeld in 3D bij jouw keuze past.", voorbeeld: "Hout met beton: het houten scherm staat op een betonnen plaat, niet in de grond.", weetniet: "Kies ‘hout’ als beginpunt en vraag ons om advies." },
  vorm: { wat: "De vorm is de weg die je schutting volgt langs je tuin.", zo: ["Loop in gedachten langs de rand van je tuin waar de schutting komt.", "Eén rechte lijn? Kies ‘recht’.", "Gaat hij om een hoek? Kies ‘met een hoek’."], waarom: "Dan vragen we alleen de maten van de zijden die je echt nodig hebt.", voorbeeld: "Een schutting langs de achterkant van je tuin is meestal ‘recht’.", weetniet: "Kies ‘weet ik niet’. Je kunt een foto of omschrijving meesturen." },
  lengte: { wat: "De lengte is hoe ver de schutting loopt, van het begin tot het einde.", zo: ["Leg een rolmaat langs de plek waar de schutting komt.", "Meet van het begin tot het einde.", "Heeft je tuin een hoek? Meet elke kant apart."], waarom: "Zo kunnen we berekenen hoeveel schuttingdelen en palen je ongeveer nodig hebt.", voorbeeld: "6,5 meter is 6 meter en 50 centimeter. Je mag een komma of een punt gebruiken.", weetniet: "Kies ‘ik kan niet meten’. Stuur straks een foto of omschrijving. Dan komen wij de maten controleren." },
  hoogte: { wat: "De hoogte meet je van de grond tot de bovenkant van de schutting.", zo: ["Zet een rolmaat op de grond.", "Meet omhoog tot waar de bovenkant moet komen.", "180 centimeter is 1 meter en 80 centimeter."], waarom: "De hoogte bepaalt hoeveel privacy je krijgt en welk scherm nodig is.", voorbeeld: "Een schutting van 180 cm is hoger dan een gemiddeld persoon. Het poppetje laat dat zien.", weetniet: "Kies 180 cm als beginpunt. Wij adviseren je. Voor de toegestane hoogte gelden lokale regels." },
  poort: { wat: "Een poort is een deur in de schutting, zodat je erdoor kunt lopen.", zo: ["Bedenk waar je doorheen wilt lopen.", "Bepaal hoe breed de opening moet zijn.", "Dat is de vrije ruimte, niet de dikte van de paal."], waarom: "Een poort heeft een eigen opening in de schutting. Daar houden we rekening mee.", voorbeeld: "Voor een fiets is 100 cm doorgang meestal genoeg.", weetniet: "Kies ‘weet ik nog niet’. Je kunt later een poort toevoegen." },
  werk: { wat: "Hier kies je wie het werk doet.", zo: ["‘Alleen materialen’: je krijgt een offerte voor het materiaal. Wij plaatsen niets.", "‘Materialen en plaatsing’: wij leveren én plaatsen. Dat staat in één offerte.", "Een oude schutting weghalen kan er optioneel bij."], waarom: "Zo weten we welke prijzen we in de offerte moeten zetten.", voorbeeld: "Oude schutting meenemen kan extra kosten. Dat zie je dan apart in de offerte.", weetniet: "Kies ‘materialen en plaatsing’. Wij leggen de verschillen uit." },
  maten: { wat: "Hier zie je hoe zeker de maten zijn.", zo: ["‘Precies’ betekent: jij hebt het opgemeten.", "‘Ongeveer’ betekent: een schatting. Wij controleren het.", "‘Onbekend’ betekent: nog niet gemeten."], waarom: "Een definitieve prijs kan pas als de maten kloppen.", voorbeeld: "Heb je ‘ongeveer 6 meter’ ingevuld, dan komen wij het opmeten voordat de prijs vaststaat.", weetniet: "Geen probleem. Je kunt zo ook een aanvraag doen." }
};

/* ---- SVG-illustraties (schematisch, geen bouwtekeningen) ---- */
const INK = "#1C2722", GREEN = "#12513A", AMBER = "#B26A00", WOOD = "#B8864B", POST = "#2e3030", GROUND = "#cfc7b0";
const svg = (vb, title, inner, extra = "") => `<svg viewBox="${vb}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg" ${extra}><title>${title}</title>${inner}</svg>`;
const arrowH = (x1, x2, y, color, label, labelY) => `<g stroke="${color}" stroke-width="3" fill="none"><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><path d="M${x1 + 10} ${y - 7}L${x1} ${y}L${x1 + 10} ${y + 7}M${x2 - 10} ${y - 7}L${x2} ${y}L${x2 - 10} ${y + 7}"/><line x1="${x1}" y1="${y - 12}" x2="${x1}" y2="${y + 12}"/><line x1="${x2}" y1="${y - 12}" x2="${x2}" y2="${y + 12}"/></g><text x="${(x1 + x2) / 2}" y="${labelY ?? y + 30}" text-anchor="middle" font-size="15" font-weight="600" fill="${color}">${label}</text>`;

export function lengthIllustration() {
  let panels = "";
  for (let i = 0; i < 5; i++) panels += `<rect x="${40 + i * 56}" y="70" width="52" height="90" fill="${WOOD}" stroke="#8a6232"/>`;
  let posts = ""; for (let i = 0; i <= 5; i++) posts += `<rect x="${37 + i * 56}" y="62" width="6" height="104" fill="${POST}"/>`;
  return svg("0 0 360 230", "Voorbeeld: de lengte van de schutting meet je langs de hele schutting, van begin tot eind", `<rect x="0" y="166" width="360" height="30" fill="${GROUND}"/>${panels}${posts}${arrowH(40, 320, 206, GREEN, "Bijvoorbeeld 6 meter", 224)}`);
}

export function heightIllustration(cm) {
  const k = 0.55, g = 200; // px per cm en grondlijn
  const fh = Math.round(cm * k), figH = Math.round(175 * k);
  return svg("0 0 380 250", `Hoogte van ${cm} centimeter naast een schematisch poppetje van 1 meter 75`,
    `<rect x="0" y="${g}" width="380" height="40" fill="${GROUND}"/>
     <rect x="160" y="${g - fh}" width="110" height="${fh}" fill="${WOOD}" stroke="#8a6232"/><rect x="156" y="${g - fh - 6}" width="6" height="${fh + 6}" fill="${POST}"/><rect x="268" y="${g - fh - 6}" width="6" height="${fh + 6}" fill="${POST}"/>
     <g fill="#7e8b99"><circle cx="90" cy="${g - figH + 9}" r="9"/><rect x="78" y="${g - figH + 20}" width="24" height="${figH - 20}" rx="8"/></g>
     <text x="90" y="${g + 24}" text-anchor="middle" font-size="12" fill="${INK}">Schaalfiguur 1,75 m</text>
     <g stroke="${AMBER}" stroke-width="3" fill="none"><line x1="298" y1="${g}" x2="298" y2="${g - fh}"/><path d="M291 ${g - 10}L298 ${g}L305 ${g - 10}M291 ${g - fh + 10}L298 ${g - fh}L305 ${g - fh + 10}"/></g>
     <text x="308" y="${g - fh / 2}" font-size="15" font-weight="600" fill="${AMBER}" dominant-baseline="middle">${cm} cm</text>`);
}

export function shapeIcon(kind) {
  const fence = (d) => `<path d="${d}" stroke="${WOOD}" stroke-width="7" fill="none" stroke-linecap="square"/>`;
  const frame = `<rect x="10" y="10" width="100" height="70" fill="#E9EFD9" stroke="#C9D3B0" stroke-dasharray="4 3"/>`;
  const body = { recht: fence("M10 10H110"), hoek: fence("M10 10H110V80"), drie: fence("M10 80V10H110V80"), onbekend: `<text x="60" y="58" text-anchor="middle" font-size="40" fill="${GREEN}">?</text>` }[kind];
  return svg("0 0 120 90", { recht: "Eén rechte schutting", hoek: "Schutting met een hoek", drie: "Schutting langs drie kanten", onbekend: "Vorm onbekend" }[kind], frame + body);
}

/** Bovenaanzicht met de gevraagde zijde in groen en met een maatpijl met pijlpunten. */
export function sideIllustration(shape, activeIndex) {
  const sides = {
    recht: [{ name: "Achterkant", d: [30, 30, 210, 30] }],
    hoek: [{ name: "Achterkant", d: [30, 30, 210, 30] }, { name: "Zijkant", d: [210, 30, 210, 120] }],
    drie: [{ name: "Linkerkant", d: [30, 120, 30, 30] }, { name: "Achterkant", d: [30, 30, 210, 30] }, { name: "Rechterkant", d: [210, 30, 210, 120] }]
  }[shape] || [];
  let lines = "", arrow = "";
  sides.forEach((s, i) => {
    const [x1, y1, x2, y2] = s.d, on = i === activeIndex;
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on ? GREEN : "#9aa39b"}" stroke-width="${on ? 9 : 6}" stroke-linecap="square"/>`;
    if (!on) return;
    const horiz = y1 === y2;
    if (horiz) {
      const y = y1 + 26;
      arrow = `<g stroke="${GREEN}" stroke-width="2.5" fill="none"><line x1="${x1 + 4}" y1="${y}" x2="${x2 - 4}" y2="${y}"/><path d="M${x1 + 14} ${y - 6}L${x1 + 4} ${y}L${x1 + 14} ${y + 6}M${x2 - 14} ${y - 6}L${x2 - 4} ${y}L${x2 - 14} ${y + 6}"/></g><text x="${(x1 + x2) / 2}" y="${y + 20}" text-anchor="middle" font-size="13" font-weight="700" fill="${GREEN}">${s.name}</text>`;
    } else {
      const left = x1 < 120, x = left ? x1 + 26 : x1 - 26, ya = Math.min(y1, y2) + 4, yb = Math.max(y1, y2) - 4;
      arrow = `<g stroke="${GREEN}" stroke-width="2.5" fill="none"><line x1="${x}" y1="${ya}" x2="${x}" y2="${yb}"/><path d="M${x - 6} ${ya + 10}L${x} ${ya}L${x + 6} ${ya + 10}M${x - 6} ${yb - 10}L${x} ${yb}L${x + 6} ${yb - 10}"/></g><text x="${left ? x + 10 : x - 10}" y="${(ya + yb) / 2 + 4}" text-anchor="${left ? "start" : "end"}" font-size="13" font-weight="700" fill="${GREEN}">${s.name}</text>`;
    }
  });
  return svg("0 0 240 150", `Bovenaanzicht van je tuin. De gevraagde zijde is groen: ${sides[activeIndex] ? sides[activeIndex].name : ""}`, `<rect x="30" y="30" width="180" height="90" fill="#EAF0DC"/><text x="120" y="108" text-anchor="middle" font-size="11" fill="#5D675E">je tuin, gezien van boven</text>${lines}${arrow}`);
}

export function gateIllustration() {
  const panel = (x) => `<rect x="${x}" y="70" width="60" height="90" fill="${WOOD}" stroke="#8a6232"/>`;
  return svg("0 0 360 230", "Voorbeeld: de doorgangsbreedte is de vrije opening tussen de palen", `<rect x="0" y="166" width="360" height="30" fill="${GROUND}"/>${panel(30)}${panel(92)}${panel(235)}${panel(297)}<rect x="26" y="62" width="6" height="104" fill="${POST}"/><rect x="152" y="62" width="6" height="104" fill="${POST}"/><rect x="229" y="62" width="6" height="104" fill="${POST}"/><rect x="355" y="62" width="5" height="104" fill="${POST}"/>${arrowH(158, 229, 120, GREEN, "Doorgang: de vrije opening", 150)}`);
}
