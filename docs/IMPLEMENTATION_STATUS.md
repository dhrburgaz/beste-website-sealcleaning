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

## Nog niet gestart

- **Tier 9 (documentarchitectuur):** offerte/werkbon/factuurconcept,
  `docs/PRICING_OPERATIONS.md`. Datamodel (ch.18/40 in de brief) bestaat al
  in `js/project-state.js`; UI/document-rendering niet.
- **Tier 10-12:** webshop/checkout (bewust niet — vereist backend +
  juridisch gereed), analytics-laag, onafhankelijke eindreview.
- **24-artikelen voorwaarden-concept + volledige privacy-tabel (v4 §6, §8):**
  `/voorwaarden/` en `/privacy/` zijn nog de eenvoudige v1-pagina's, niet de
  v4-structuur. Vereist uiteindelijk juridische toets vóór bindende
  publicatie, maar de tekst kan al worden voorbereid.
- **Materiaalcatalogus (`data/materials.js`, F01):** alleen generieke
  presets, geen echte SKU's/leveranciersdata.
- **Vrije tuincontour, volledige existingObjects-catalogus,
  materiaalvergelijking (max. 3 varianten), ontwerp-export als
  JSON/deellink:** zie `docs/REQUIREMENTS_INDEX.md` (D02, C01/C05, F03/G06).
- Supplier/inkoop/margin-engine (ch.38-39 / v6.0 §V6-05): vereist echte
  interne inkoopcijfers die nog niet zijn aangeleverd.

## Openstaande vragen voor de eigenaar (BLOCKERS)

- Formulierbackend/endpoint-voorkeur — zonder is "aanvraag versturen"
  altijd een bewuste actie naar het bestaande formulier, nooit een
  geclaimde ontvangst.
- Domeinmail (info@sealcleaning.nl) nog niet bevestigd als werkende
  ontvangstmailbox.
- Leveranciers-/inkoopgegevens voor de margin-engine.
- Juridische verificatie van KvK/btw/handelsnaam/adres vóór bindende
  verkoopdocumenten (N01-N04).

## Belangrijk voor hervatten: commit vaak

Deze sessie verloor eenmalig ongecommit werk doordat de container tussen
beurten werd ververst zonder dat niet-gepushte bestanden behouden bleven.
Commit en push daarom na elk afgerond, getest onderdeel — niet pas aan het
einde van een tier.

## Eerstvolgende taak bij hervatten

Tier 1-8 zijn afgerond of substantieel afgerond. Tier 9-12 vereisen
grotendeels echte bedrijfsbeslissingen die niet zonder de eigenaar kunnen
worden ingevuld. Zinvolle volgende stap zonder die input: de 24-artikelen
voorwaarden-tekst en volledige privacy-tabel uitschrijven (v4 §6/§8) — puur
tekst-/structuurwerk, geen backend nodig, en direct bruikbaar zodra
juridische toets volgt.
