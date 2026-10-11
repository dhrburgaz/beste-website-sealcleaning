# DESIGN_SYSTEM: SEAL designsysteem v7

## 1. Drie richtingen vergeleken (V7-02 / V7-17 fase 2)

De drie concepten zijn als **werkende stylesheets** gebouwd, niet als statische mock-ups. Ze staan in `tools/concepts/a.css`, `b.css` en `c.css`; gedeelde bugfixes staan in `common.css`.

Ze zijn met `tools/screens.mjs` (`CSS=…`) op de echte pagina's en met echte foto's beoordeeld:

- homepage;
- dienstpagina (schuttingen);
- projectcase;
- configurator;
- contact.

Dat gebeurde op 390 en 1440 px. Reproduceren:

```
CSS=tools/concepts/common.css,tools/concepts/b.css PAGES=/,/schuttingen/ node tools/screens.mjs b
```

| Criterium | A: Architectural Forest | B: Modern Stone Studio | C: Warm Craft & Nature |
|---|---|---|---|
| Merkonderscheid | Bouwt voort op het bestaande bosgroen/zand/terracotta en Fraunces: herkenbaar en eigen | Inter-koppen en bijna-wit: strak, maar inwisselbaar met elk SaaS-/architectenbureau | Warm en vriendelijk, terracotta CTA's; minder onderscheidend van lifestyle-sites |
| Foto als bewijs boven de vouw (V7-11.1) | **Ja.** Desktop: volle foto; mobiel: foto bovenaan, volledig zichtbaar | Nee: op desktop staat de foto onder de vouw, op mobiel pas na de tekst | Deels: de overlappende kaart bedekt een derde van de foto |
| Leesbaarheid en contrast | **Opgelost bij de bron.** Mobiel: tekst op een effen bosgroen vlak; desktop: horizontale scrim aan de tekstzijde | Goed (donker op licht) | Goed (donker op crème) |
| Geloofwaardigheid / premium | Rustig en beheerst; past bij investeringen in huis en tuin | Koel en afstandelijk; weinig "tuin" | Toegankelijk, minder verfijnd |
| Mobiel | Hero-foto 30 % van het scherm; propositie en eerste CTA zichtbaar | Lange tekstkolom vóór beeld | Kaart schuift ver over de foto; extra verticale ruimte |
| Implementatiekosten / onderhoud | Laag: tokens en componenten op het bestaande systeem | Middel: typografie en hero-structuur wijzigen | Middel: kaarten en radii in alle componenten |
| Risico | Bosgroen + foto kan zwaar ogen → gecompenseerd met zandvlakken en ruimte | Verlies van merkgevoel | Terracotta als actiekleur concurreert met foto's |

**Keuze: A.** De overwegingen:

- Het bestaande merk is na vergelijking sterker dan een redesign. Het dossier zegt: "geen redesign uitsluitend om redesign".
- A lost de echte auditproblemen structureel op: contrast, mobiele hero en dienstenlijst.
- A houdt eigen fotografie als primair bewijs.

Van B en C zijn alleen details overgenomen:

- uit B: de strakke vertrouwensregel met vinkjes;
- uit C: afgeronde, zachte kaarten voor interactieve componenten (catalogus, mandje). Editorial secties blijven vlak.

Voor/na-bewijs staat in `docs/MOBILE_QA.md` en is te reproduceren met `tools/screens.mjs`.

## 2. Tokens (`css/style.css`, blok "Designsysteem v7")

### Kleur: semantische rollen

Kleur is nooit de enige statusdrager: badges en meldingen hebben altijd tekst plus een eigen vorm of icoon.

| Rol | Token | Waarde | Gebruik |
|---|---|---|---|
| primary | `--role-primary` | `#1b2a1e` bosgroen | primaire knoppen, actieve chips, stappen |
| accent | `--role-accent` | `#8a5a3a` terracotta (≥ 4,5:1 op zand) | eyebrows, nummering |
| accent op donker | `--role-accent-on-dark` | `#e6dcc6` | eyebrows en details op foto of bosgroen |
| positive | `--role-positive` / `-bg` | `#2f5a36` / `#e3ecdf` | bevestigd, geverifieerd, gelukt |
| attention | `--role-attention` / `-bg` | `#7a5410` / `#f5e9cc` | indicatie, wachtend, onzeker |
| danger | `--role-danger` / `-bg` | `#9c3b23` / `#f6e1d9` | fout, niet leverbaar |
| info | `--role-info` / `-bg` | `#2d4a5a` / `#e1eaee` | op aanvraag, niet ingesteld |
| focus | `--role-focus` | `#1f6feb` + witte halo | focusring (zichtbaar op licht, donker én foto) |
| surface | `--role-surface`, `--role-surface-raised` | zand / `#fbf8f2` | pagina / kaarten |
| overlay | `--role-overlay` | rgba bosgroen 62 % | dialoogachtergrond |

### Typografie

- **Display:** Fraunces (variabel; optische maat en gewicht).
- **UI en tekst:** Inter (variabel).
- Beide zelf gehost in `vendor/fonts/`, SIL OFL 1.1, alleen het latin-subset, met preload en `font-display: swap`.
- Er gaan geen verzoeken naar Google (privacy) en de typografie is gegarandeerd.
- **Schaal:** `--fs-hero`, `--fs-display`, `--fs-h1` t/m `--fs-h3`, `--fs-body` (1,0625 rem), `--fs-small`, `--fs-eyebrow`, allemaal vloeiend via `clamp()`.
- **Tabelcijfers:** `font-variant-numeric: tabular-nums` voor prijzen, totalen en hoeveelheden (`.price`, `.num`, `.price-row`).
- **Leesbreedte:** 56–68 tekens (`max-width` in `ch`).

### Ruimte, vorm en beweging

- **Ruimte:** `--sp-1` t/m `--sp-8` (0,5 rem tot 8 rem); op mobiel worden secties krapper (`--sp-5`/`--sp-6`/`--sp-7`).
- **Tikdoel:** `--tap: 44px` voor alle eigen interactieve controls op mobiel.
- **Vorm:**
  - editorial secties vlak (`--radius-s` 2 px);
  - interactieve kaarten en meldingen `--radius-l` 6 px;
  - chips en badges volledig rond.
- **Schaduw:** alleen `--shadow-raised`, voor kaarten bij hover, toasts en dialogen.
- **Beweging:**
  - `--dur-fast` 120 ms, `--dur` 200 ms, `--dur-slow` 300 ms;
  - easing `--ease-soft` / `--ease-expo`;
  - met `prefers-reduced-motion` wordt alles uitgezet, inclusief skeleton-shimmer.

## 3. Componenten

| Component | Klasse | Toestanden |
|---|---|---|
| Knop | `.btn .btn-primary/.btn-secondary/.btn-ghost-light`, `.btn-sm/.btn-lg/.btn-block` | hover, focus, active, `disabled`/`aria-disabled`, `aria-busy="true"` (spinner, geen tekstverschuiving) |
| Tekst-CTA | `.link-underline` | hover-onderstreping, ≥ 44 px hoog |
| Chip | `.chip` | `aria-pressed="true"` / `.is-active`; verwijderbaar met `.chip-x` |
| Badge | `.badge .badge--verified/--estimated/--pending/--on-request/--not-configured/--unavailable/--error` | vorm verschilt per status (rond / vierkant / ruit) |
| Melding | `.notice .notice--success/--error/--attention/--estimated/--pending/--offline/--empty` | eigen icoon per toestand |
| Kaart | `.card`, `.card-link` | hover-verheffing |
| Skeleton | `.skeleton` | laden; geen animatie bij reduced motion |
| Toast | `.toast-region` + `.toast/.toast--error` | live-gebied; boven de mobiele actiebalk |
| Stappen | `.stepper li[aria-current=step]`, `.is-done` | |
| Dialoog | `dialog.dialog` + `.dialog-head/.dialog-body/.dialog-close` | native `<dialog>` (focusbeheer door de browser) |
| Hoeveelheid | `.qty` (− invoerveld +) | invoer én knoppen; grenzen via `disabled` |
| Prijsregels | `.price-row`, `.price-row--total` | tabelcijfers |
| Hero | `.hero`, `.page-hero`, `.page-hero--tool` | mobiel: foto boven tekst; `--tool` zonder foto op mobiel |
| Vertrouwensregel | `.hero-trust` | vinkje via CSS-mask |
| Navigatie | `.main-nav` (gegenereerd met `tools/apply-nav.py`) | `aria-current`, sectie-indicatie `data-section-current` |
| Mobiele actiebalk | `.mobile-cta-bar` | safe-area; één primaire actie |

## 4. Beeldregels

- Alleen eigen projectfoto's van SEAL:
  - geen stockbeeld;
  - geen gefingeerde voor/na-paren;
  - geen AI-beelden als resultaat.
- Elke `<img>` heeft `width` en `height` tegen layoutverschuiving (`tools/add-image-dims.py`), alt-tekst en lazy-load onder de vouw.
- De hero krijgt `fetchpriority="high"`.
- Er zijn WebP-varianten via `<picture>`. AVIF ontbreekt nog; dat vraagt een build-stap (genoteerd in MOBILE_QA).
- Focal point via `object-position` per beeld als de uitsnede belangrijk is.

## 5. Copy-systeem (V7-13)

CTA = werkwoord + uitkomst (+ verwachting). Voorbeelden:

- "Vraag vrijblijvend een offerte aan"
- "Ontwerp uw tuin in 2D/3D"
- "Vraag een offerte voor uw schutting aan"
- "Teken uw terras of pad in 2D/3D"

Microcopy bij gevoelige keuzes:

- "Een afspraak staat pas vast na onze bevestiging"
- "Dit is een indicatie, geen definitieve offerte"
