# IMPLEMENTATION_STATUS

Lees dit bestand, `git status` en alleen de relevante hoofdstukken van
`docs/SEAL_BUILD_BRIEF.md` bij hervatten. Begin niet opnieuw met onderzoek.

**Branch:** `claude/sealcleaning-website-overhaul-gvgtfj` (op `main`, pushed t/m
commit die dit bestand toevoegt). **Live:** sealcleaning.nl draait op `main`.
Deze branch moet naar `main` gemerged worden om live te komen — nog niet
gedaan in deze sessie; vraag de eigenaar wanneer een merge/PR gewenst is.

## Afgerond (ch.48 tier 1 — Herstel waarheid)

- Diensten-link wees naar `/projecten/` i.p.v. een dienstenoverzicht → wijst nu
  naar `#diensten` (homepage-sectie met de 7 diensten), op alle 16 pagina's.
- `schutting-horizontaal-lamellen-zon-1.*` toonde een gesnoeide heester, geen
  schutting → hernoemd naar `snoeiwerk-heester-fors-teruggesnoeid.*`,
  gecategoriseerd als snoeiwerk op `/projecten/` (incl. zichtbare `<h3>`/meta,
  niet alleen data-attributen — eerste poging miste dat, inmiddels gefixt).
  Schuttingen-servicepagina gebruikt nu de echte lamellenfoto (`zon-2`).
- WhatsApp-nummer stond als zichtbare tekst in footer (alle pagina's) en
  contactpagina → toont nu een label, wa.me-link blijft werkend.
- Telefoonnummer bijgewerkt naar +31 78 204 95 17 (bevestigd door eigenaar),
  overal incl. structured data.
- Details/bewijs: zie `docs/SOURCE_REGISTER.md`.

## Afgerond (ch.48 tier 2 — Datafundament, gedeeltelijk)

- `docs/SEAL_BUILD_BRIEF.md` — volledige kopie van de masterprompt (bron van
  waarheid voor hoofdstuknummers).
- `js/project-state.js` — ES-module, projectstate-schema (ch.18), mm/meter-
  conversie, fence length/gate-validatie, paving m²/overlap/tegelaantal,
  serialisatie-/variant-helpers. **Nog geen UI gebruikt dit.**
- `data/services.js` — canonieke dienstlijst + configuratorKind per dienst.
- `data/fence-systems.js` — generieke schuttingsystemen/hoogtes/materiaalpresets
  (ch.13), expliciet `verifiedProduct:false`.
- `data/paving-products.js` — generieke formaten/patronen/kleurpresets (ch.14).
  Wildverband/visgraat bewust weggelaten (nog niet geïmplementeerd = geen
  nepoptie tonen).
- `data/price-sources.json` — alle ch.19-prijzen gestructureerd per ch.20-schema
  (sourceUrl, observedAt, vatIncluded, scope, reviewAfter). HomingXL-montage-
  cijfers bewust op `status:"stale"` zodat een prijsengine ze nooit automatisch
  als actuele regel gebruikt. `unresolved[]` noemt wat nog ontbreekt.
- `data/projects.js` — 12 bestaande projecttegels gemigreerd naar het ch.8
  case-schema (slug/services/gallery/tags). **Nog geen volledige nieuwe
  contact-sheet-audit van alle ~67 bronfoto's** — alleen de al bekende tegels,
  plus de ene expliciet gecorrigeerde mismatch. `verification` per case geeft
  eerlijk aan wat visueel bevestigd is vs. alleen bestaande caption.

## Nog niet gestart (ch.48 tier 2 restant + tier 3-12)

- `data/materials.js`, `data/reviews.js` (leeg/geverifieerd, ch.11 — geen
  placeholder reviews).
- `supplierOffer`-model + landed-cost/margin-engine (ch.38-39) — bewust nog
  niet gebouwd; vereist bedrijfsinterne inkoopgegevens die nog niet zijn
  aangeleverd.
- **Tier 3 — 2D + echte 3D configurator:** grootste openstaande stuk.
  Volgende concrete stap: `/project-samenstellen/` route bouwen op
  `js/project-state.js`, beginnend met 2D/SVG (volledig zelfstandig bruikbaar
  per ch.16), daarna Three.js (vendored, pinned versie in `vendor/three/`,
  geen CDN) als verrijking op dezelfde state. Garden → fence → paving in die
  volgorde (ch.29 bouwvolgorde).
- Tier 4-12 (commerciële routes, prijsstatus-UI, leadbackend, projectdetail-
  routes, B2B/werken-met-ons, document-/factuurarchitectuur, checkout,
  analytics, eindreview): niet gestart.

## Bekende openstaande vragen voor de eigenaar

- Formulierbackend: GitHub Pages heeft geen eigen backend (ch.5/23). Zonder
  een echt endpoint blijft "aanvraag versturen" een bewuste WhatsApp/mail/
  download-actie, nooit een valse ontvangstbevestiging. Is er al een
  voorkeur voor een formulierprovider/serverless endpoint?
- Domeinmail (info@sealcleaning.nl) nog niet bevestigd te bestaan — huidige
  Gmail-adres blijft gebruikt totdat dat getest is.
- Geen leveranciers-/inkoopgegevens aangeleverd — margin-engine (ch.38) kan
  pas met echte cijfers, niet met aannames.

## Eerstvolgende taak bij hervatten

Start Tier 3: maak `/project-samenstellen/index.html` + een nieuw
`js/configurator/` modulepakket. Begin met de 2D SVG-tuinscene (rechthoekige
tuin, schutting I/L/U met poorten, bestratingsvlak) gevoed door
`js/project-state.js`, vóór de Three.js-laag. Testmatrix ch.28/47 gebruiken
voor acceptatie.
