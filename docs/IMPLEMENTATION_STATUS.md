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

## Afgerond — calculatie en beheerplatform (10 oktober 2026)

- **Calculatiemotor** (`js/calc/`): hoeveelhedenstaat uit het ontwerp en
  rekenmotor met arbeid (bevestigd € 60 excl. btw), materiaal, machines,
  afvoer, transport, opslag per soort, algemene kosten, risico,
  minimumorder, afronding en btw — elk afzonderlijk. Werkelijke kostprijs
  en brutomarge alleen als alle kosten echt bekend zijn; marktprijzen
  gelden als gelabelde benadering. Zie `docs/PRICING_OPERATIONS.md`.
- **Beheeromgeving** `/beheer/` (niet gelinkt, noindex, strikte CSP):
  versleutelde kluis op het eigen apparaat (PBKDF2 → AES-GCM), automatisch
  vergrendelen na 15 min, clickjacking-bescherming. Calculatie vanuit
  deellink/bestand/browser met scenariovergelijking, offertes met
  prijssoort/scope/versies, werkbon, factuur met betalingen, creditnota,
  opleverdocument, projecten met statuspijplijn en uren, klanten (AVG
  verwijderen), leveranciers en inkoop, instellingen, auditlog, CSV-export,
  versleutelde back-up/herstel. Zie `docs/LEGAL_AND_DOCUMENTS.md`.
- **Klantketen getest:** configurator → aanvraagdossier met ontwerplink →
  contactformulier → beheercalculatie → offerte → akkoord → factuur →
  betaling → status "Betaald".
- **Tests:** `npm test` (23 unit-/beveiligingstests) en `tests/e2e/`
  (kluis/versleuteling/herstel, facturatie, site-crawl met axe-core over
  38 pagina's: 0 consolefouten, 0 dode links, 0 kapotte afbeeldingen,
  0 mobiele overflow, 0 WCAG-bevindingen na fixes).

### Bewuste grens: geen klantportaal of server

De site draait statisch op GitHub Pages. Een klantomgeving met
projectstatus, digitale akkoorden, berichten en documenten vereist
authenticatie en server-side autorisatie per object (masterdossier
ch. 42 / L01). Dat is **niet** gesimuleerd. De beheeromgeving is een
echte, werkende interne tool, maar per apparaat en zonder synchronisatie.

## Afgerond — SEAL-backend (10 oktober 2026)

Een werkende bedrijfsbackend in `server/` (Node 22 + SQLite, zonder npm-afhankelijkheden). Architectuur, hosting en beheer staan in `docs/BACKEND.md`.

- **Formulieren:** contact, zakelijk en werken-met-ons sturen naar `/api/public/leads` zodra `apiBase` is ingevuld. Inbegrepen: uploads met inhoudscontrole, honeypot, starttijd, verplichte privacybevestiging, ontwerp via deellink en een referentienummer. Bij een leeg `apiBase` blijft de huidige mailto-werking.
- **Beheer `/admin/`:** login met verplichte 2FA. Onderdelen:
  - aanvragen → project, klanten, projecten met calculatie (intern);
  - offertes: versies, versturen, offline akkoord;
  - facturen: uitgifte met doorlopende nummers, termijnen, creditnota's, betalingen;
  - planning, berichten, uren, bestanden;
  - instellingen: calculatie, inkoop, document, bewaartermijnen, agenda-URL, back-up;
  - e-mailwachtrij, auditlog, gebruikers.
- **Klantportaal `/portaal/`:** inloggen met een eenmalige link. Onderdelen:
  - tijdlijn, offerte, digitaal akkoord en vroeg-starten-keuze;
  - vragen, wijzigings-, service- en klachtverzoeken;
  - planning met voorstel en ICS, facturen (bank of Mollie), bestanden;
  - toestemmingen, gegevensexport.
- **Tests:**
  - `tests/server.test.mjs`: integratie, beveiliging, nummering, akkoord-hash, Mollie-webhook (gemockt), SMTP (lokale testserver), back-up/herstel en retentie.
  - `tests/e2e/server-keten.mjs`: echte browser door de hele keten, van aanvraag tot betaalde factuur.
- **Calculatie:** arbeid blijft op de klantofferte op het bevestigde tarief van € 60,00 excl. Toeslagen en afronding gaan in de overige regels.
- **Deploy:**
  - `Dockerfile`, `deploy/docker-compose.yml` (app + Caddy HTTPS), `deploy/sealcleaning.service` en `server/.env.example`.
  - De server weigert in productie te starten met onveilige instellingen.
  - GitHub Pages publiceert `server/` en `deploy/` niet.

Niet operationeel zonder account (eerlijk gemarkeerd in het beheer): e-mailverzending (SMTP), online betalen (Mollie) en externe back-upopslag. Het Docker-image is niet in deze omgeving gebouwd (geen Docker-daemon).

## Nog niet gestart

- **Tier 9 (documentarchitectuur):** offerte/werkbon/factuurconcept,
  `docs/PRICING_OPERATIONS.md`, `docs/LEGAL_AND_DOCUMENTS.md`.
- **Tier 10-12:** webshop/checkout, analytics, onafhankelijke eindreview.
- **Formele WCAG 2.2 AA-audit (N10):** tot nu toe gerichte handmatige en
  geautomatiseerde controles, geen volledige audit.

## Openstaande vragen voor de eigenaar (BLOCKERS)

In de beheerkluis in te vullen (geen code nodig): interne kostprijs per
uur, opslag materiaal/machines/afvoer, algemene kosten, risico, transport
per werkdag, minimumorder, bevestiging/aanpassing productiviteitsnormen,
inkoopprijzen per artikel, geldigheid offerte, betaaltermijn, IBAN.

Beslissingen/gegevens:
- Juridische toets van voorwaarden en privacy (N01–N04) vóór bindend gebruik.
- Hosting voor de backend (advies: EU-VPS + Docker, zie docs/BACKEND.md) en
  DNS-record `api.sealcleaning.nl`; daarna `apiBase` in `js/config.js`.
- SMTP-account/domeinmail, Mollie-account, externe back-upopslag.
- Boekhoudpakket voor koppeling (nu CSV-export).
- Stijllabels per projectcase (A05), gecontroleerde plantdata (H01–H04,
  H09), voor/na-fotoparen (I04), geleverde SKU's en garantievoorwaarden
  (M04–M05), meer echte producten/leveranciers (F01).
- Btw-verlegging bij zakelijke opdrachten: per geval laten toetsen.
- Akkoord om de branch naar `main` (live) te mergen — zie de pull request.

## Belangrijk voor hervatten: commit vaak

Deze sessie verloor eenmalig ongecommit werk doordat de container tussen
beurten werd ververst zonder dat niet-gepushte bestanden behouden bleven.
Commit en push daarom na elk afgerond, getest onderdeel — niet pas aan het
einde van een tier.

## Eerstvolgende taak bij hervatten

Alle eisen die zonder externe toegang of eigenaarsgegevens kunnen, zijn
gebouwd en getest. Volgende stappen hangen af van de BLOCKERS: na
juridische toets en akkoord de PR mergen (live), daarna de backendkeuze
voor portaal/akkoord/synchronisatie. De backend is gebouwd (zie hierboven);
na hostingkeuze: installeren volgens docs/BACKEND.md.
