# IMPLEMENTATION_STATUS

Lees dit bestand, `git status`, `docs/REQUIREMENTS_INDEX.md` (160 v4-IDs
met status) en alleen de relevante hoofdstukken van
`docs/SEAL_MASTER_BRIEF.md` (v6.0, leidend bij conflict) bij hervatten.
Begin niet opnieuw met onderzoek.

**Branch:** `claude/sealcleaning-website-overhaul-gvgtfj`, gebaseerd op de
huidige `main` (live op sealcleaning.nl). Nog niet gemerged — vraag de
eigenaar wanneer een PR/merge gewenst is.

**specVersion: 6.0** (zie checkpointsjabloon in `SEAL_MASTER_BRIEF.md` V6-09).

## Afgerond — v2.0 tier 1-8 (zie `docs/REQUIREMENTS_INDEX.md` voor detail per ID)

1. **Herstel waarheid:** Diensten-link, foto/categorie-mismatch, zichtbaar
   WhatsApp-nummer, oud telefoonnummer. Bewijs: `docs/SOURCE_REGISTER.md`.
2. **Datafundament:** `js/project-state.js`, `data/services.js`,
   `data/fence-systems.js`, `data/paving-products.js`,
   `data/price-sources.json`, `data/projects.js`, `data/labor-rate.json`.
3. **2D/3D-configurator** op `/project-samenstellen/`
   (`js/configurator/{geometry,svg-scene,three-scene,app}.js`): gedeelde
   geometrie voor 2D (altijd werkend, ook zonder WebGL2) en 3D (vendored
   Three.js 0.186.1, `vendor/three/`), schutting I/L/U met poorten,
   bestrating met overlapcheck, 5 commerciële routes, branded PNG-export,
   lokale opslag (30 dagen, opt-in), dossier-download, handoff naar
   `/contact/`.
4. **`/prijzen/`** (`js/prijzen.js`): rendert direct uit
   `data/price-sources.json`, incl. het bevestigde € 60/€ 72,60
   arbeidstarief in een eigen sectie (zie v6.0 hieronder).
5. **Lead-fallback eerlijkheid:** `mailto`-fallback waarschuwt nu expliciet
   dat bijlagen niet automatisch meegaan.
6. **`/voor-aannemers/`, `/werken-met-ons/`**: B2B- en
   samenwerkingsintake, herbruiken hetzelfde formulierhandler-patroon.
7. **Kennisbank (3 artikelen) + 12 projectdetailroutes** `/projecten/<slug>/`,
   gegenereerd uit `data/projects.js`.

Getest met Playwright/Chromium (incl. software-WebGL): volledige
configurator-flow, 2D/3D-render, mobiele viewport 390px, alle formulieren,
lightbox→detailpagina, prijstabellen. Geen consolefouten behalve een
sandbox-eigen Google Fonts TLS-fout (niet-repro op een echte host).

## Afgerond — v6.0-dossier verwerkt (10 oktober 2026)

Een nieuw, veel groter dossier (`SEAL_MASTERPROMPT_v6.0`, 2397 regels, wrapt
v5.0→v4.0→v3.0 om de reeds bekende v2.0 heen) is gelezen en verwerkt:

- **Twee echte bugs gefixt** die v6.0's eigen codereview vond (H04):
  prijsindicatie gebruikte altijd dezelfde 60×60-tegelregel ongeacht
  gekozen formaat (nu: matcht op `tileLengthMm`/`tileWidthMm`, toont
  eerlijk "nog geen prijs" zonder match); `fitGardenToContent()` volgde
  alleen positieve bounds, waardoor een L-right-schutting (negatieve
  z-coördinaten) deels buiten de SVG/3D-scene viel (nu: geometrie wordt
  verschoven naar niet-negatieve coördinaten vóór tuingrootte wordt bepaald).
  Beide geverifieerd met Playwright.
- **Bevestigd arbeidstarief toegevoegd:** € 60,00 excl. btw / € 72,60 incl.
  21% per medewerker per uur, `data/labor-rate.json` + eigen sectie op
  `/prijzen/` (bewust gescheiden van de externe marktbenchmarks). Nog niet
  gekoppeld aan automatische calculatie — er is geen model dat benodigde
  arbeidsuren uit geometrie afleidt; dat zou een gok zijn, geen eis.
- **`docs/REQUIREMENTS_INDEX.md`** aangemaakt: alle 160 v4-eis-ID's (A–P)
  met eerlijke status. Gebruik dit bestand voor eis-niveau detail; dit
  bestand (`IMPLEMENTATION_STATUS.md`) blijft de compacte samenvatting.
- **`docs/SEAL_MASTER_BRIEF.md`** is nu de canonieke, volledige dossier
  (v6.0, bevat v2-v5 integraal). `docs/SEAL_BUILD_BRIEF.md` (oude v2.0-only
  kopie) is vervangen door een doorverwijzing — v6.0 verbiedt expliciet
  twee actieve tegenstrijdige briefs naast elkaar (V6-03).
- `docs/PRICING_OPERATIONS.md` en `docs/LEGAL_AND_DOCUMENTS.md` (door v6.0
  gevraagde opleverartefacten) **nog niet aangemaakt** — zinvol pas zodra
  er daadwerkelijk een prijsengine/documentbackend wordt gebouwd (tier 9).
- **24-artikelen voorwaarden-concept + volledige privacy-tabel geschreven:**
  `/voorwaarden/` heeft nu de volledige 24-artikel-structuur (partijen/KvK,
  offerte, prijssoort+btw met het bevestigde tarief, inmeting, ontwerp,
  erfgrens, vergunning, materiaal, planning, meer-/minderwerk, oplevering,
  garantie, factuur, herroeping, aansprakelijkheid, privacy/geschillen) en
  `/privacy/` heeft de volledige verwerkingstabel (8 categorieën met doel
  en bewaartermijn/grondslag) + secties over bijlagen, delen met derden,
  AP-klachtrecht, cookies, EXIF. Beide geverifieerd met Playwright (0
  consolefouten, 0 gebroken afbeeldingen, correcte h2-structuur, geen
  horizontale scroll op 390px). **Status blijft "wacht op goedkeuring"**
  (REQUIREMENTS_INDEX N02/N04) — de tekst is inhoudelijk compleet maar
  vereist juridische toets vóór bindende publicatie.

## Afgerond — configurator- en site-uitbreiding (10 oktober 2026)

Alle frontend-eisen die zonder eigenaarsgegevens kunnen, zijn gebouwd en in
Chromium getest (desktop 1280px, mobiel 360/390px portret en 740px
landschap met touch). Detail per eis-ID: `docs/REQUIREMENTS_INDEX.md`.

- **Tekenen:** tuin als rechthoek, L-vorm of vrije contour (hoekpunten
  slepen/typen, zelfdoorsnijding geblokkeerd); bestaande en nieuwe objecten
  (huiswand, schuur, boom, haag, border, gazon, bestaande poort) met status
  behouden/verwijderen/nieuw, vergrendelen, dupliceren, beschermingszone;
  poorten met scharnier en draairichting plus botsingscontrole. 2D en 3D
  gebruiken dezelfde geometrie (`js/configurator/geometry.js`).
- **Bediening:** selecteren en slepen in 2D, optioneel raster/snap met
  status, undo/redo (Ctrl+Z), vergroot-werkvlakmodus, sticky tekening op
  mobiel, 44px-raakvlakken, zon-/schaduwillustratie in 3D.
- **Opslaan/delen:** ontwerpbestand (.json) en deellink (in URL-hash,
  niet naar server), strikte witte-lijst-sanitizer
  (`js/configurator/design-io.js`); alleen niet-persoonlijke state.
- **Vergelijken:** varianten A/B/C op dezelfde geometrie
  (`js/configurator/variants.js`) met onderhoud, opbouw, leverstatus,
  prijsbasis, bron en verschil alleen bij bekende prijsregels.
- **Intake:** doel, particulier/zakelijk, omvang, gebruik, onderhoudswens,
  situatie (ondergrond, hoogte, water, kabels, erfgrens), toegang en
  parkeren met uitvoeringsaandachtspunten, afvoer + volume-indicatie
  (`js/configurator/waste.js`), eigen materiaal, herstel,
  gazon/onkruid/snoei, werkgebiedcheck, compleetheidslijst en fototips.
  Alles gaat mee in het tekstdossier en de overdracht naar `/contact/`.
- **Site:** `/zoeken/` (index via `node tools/build-search-index.mjs` →
  `data/search-index.json`; opnieuw draaien na contentwijzigingen),
  `/inspiratie/` (inspiratiebord in de browser, bewaarknop op
  projectpagina's en in de configurator), footerlinks op alle pagina's.
- **Gevonden en hersteld:** mobiele actiebalk werd nooit gevuld;
  `?service=`-links naar de configurator werden genegeerd; 404-knop
  "Bekijk diensten" wees naar projecten.

## Nog niet gestart

- **Tier 9 (documentarchitectuur):** offerte/werkbon/factuurconcept,
  `docs/PRICING_OPERATIONS.md`, `docs/LEGAL_AND_DOCUMENTS.md`.
- **Tier 10-12:** webshop/checkout, analytics, onafhankelijke eindreview.
- **Formele WCAG 2.2 AA-audit (N10):** tot nu toe gerichte handmatige en
  geautomatiseerde controles, geen volledige audit.

## Openstaande vragen voor de eigenaar (BLOCKERS)

- Formulierbackend/endpoint-voorkeur — zonder is "aanvraag versturen"
  altijd een bewuste actie naar het bestaande formulier, nooit een
  geclaimde ontvangst.
- Domeinmail (info@sealcleaning.nl) nog niet bevestigd als werkende
  ontvangstmailbox.
- Leveranciers-/inkoopgegevens voor de margin-engine en meer echte
  producten (nu alleen 3 × 60×60-bestrating).
- Juridische verificatie van KvK/btw/handelsnaam/adres en toets van
  `/voorwaarden/` en `/privacy/` vóór bindende publicatie (N01-N04).
- Stijllabels per projectcase (A05), gecontroleerde plantdata voor
  plantkeuze/haagcalculator/onderhoudskalender (H01-H04, H09), echte
  voor/na-fotoparen van dezelfde plek (I04), geleverde SKU's en
  garantievoorwaarden (M04-M05).
- Wanneer mag deze branch naar `main` (= live)? Er is nog niets gemerged.

## Belangrijk voor hervatten: commit vaak

Deze sessie verloor eenmalig ongecommit werk doordat de container tussen
beurten werd ververst zonder dat niet-gepushte bestanden behouden bleven.
Commit en push daarom na elk afgerond, getest onderdeel — niet pas aan het
einde van een tier.

## Eerstvolgende taak bij hervatten

Alle frontend-eisen zonder eigenaarsinput zijn gebouwd. Verder kan pas met
input uit de BLOCKERS hierboven, of met een besluit over een
formulier-/documentbackend (tier 9). Zonder die input is het enige
zinvolle resterende werk een formele toegankelijkheidsaudit (N10) en een
onafhankelijke eindreview van de branch vóór een eventuele merge.
