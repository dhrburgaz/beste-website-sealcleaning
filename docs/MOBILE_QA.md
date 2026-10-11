# MOBILE_QA: mobiele kwaliteitsronde (V7-06 / fase 6)

Datum: 10 oktober 2026. Omgeving: Chromium (Playwright) tegen de lokale ontwikkelversie. Het is **geen test op fysieke iOS- of Android-toestellen**: iOS Safari en Android Chrome zijn niet getest en blijven open (zie onderaan).

## Reproduceerbare metingen

| Doel | Commando |
|---|---|
| Tikdoelen, afbeeldingsafmetingen, overflow, formuliervelden zonder label op alle sitemap-pagina's | `WIDTH=390 node tools/ux-metrics.mjs` |
| Console-, link-, afbeelding-, overflow- en axe-controle op alle pagina's (360 en 1280 px) | `node tests/e2e/site-crawl.mjs` |
| LCP, CLS en transfer onder 4× CPU-vertraging en 1,6 Mbit/s, 150 ms latency | `node tools/perf-lab.mjs` |
| Schermafbeeldingen voor/na (390 en 1440 px) | `node tools/screens.mjs <label>` |
| Volledige keten (aanvraag → akkoord → factuur) in de browser | `node tests/e2e/server-keten.mjs` |
| Webwinkel (mandje → code → gegevens → betalen) op 390 en 1440 px | `node tests/e2e/webwinkel.mjs` |

## Resultaten

### Breedtes (35 pagina's uit de sitemap)

| Breedte | Tikdoelen < 44 px | Horizontale overflow | Opmerking |
|---|---|---|---|
| 320 | 5 | 0 | 1 px afrondingsruis op twee kennisbankpagina's (tabel in scrollcontainer) is geen zichtbare overflow |
| 360 | 5 | 0 | |
| 390 | 4 | 0 | **Begin van de ronde: 929** |
| 430 | 5 | 0 | |
| 768 | 4 | 0 | |
| 1024 | n.v.t. | 0 | De 44 px-doelstelling geldt voor aanraking (≤ 900 px). Op desktop is de muis leidend |

De resterende 4–5 tikdoelen zijn het visueel verborgen honeypotveld, het telefoonnummer en e-mailadres als inline tekstlinks in lopende tekst, en één leeg anker. Dat zijn bewuste uitzonderingen volgens WCAG 2.5.8 (inline, equivalente route aanwezig).

### Afbeeldingen en prestaties

| Meting | Begin | Na ronde 1 |
|---|---|---|
| `<img>` zonder `width`/`height` (CLS-risico) | 83 | 1 (dynamisch lightboxbeeld) |
| CLS onder throttling | niet gemeten | 0,000 op alle gemeten pagina's |
| Projectfoto's | één bestand per foto, tot 440 kB, ook op telefoons | `srcset` met 640/960 px-varianten (WebP); 640 px ≈ 37 kB |
| Webfonts | Google Fonts, externe verzoeken | zelf gehost, preload, geen verzoeken naar Google |

**LCP in het lab** (4× CPU-vertraging, 1,6 Mbit/s, 150 ms latency, 390 px, 2× DPR). Dit is een zware testconditie, **geen veldgegevens (p75)**:

| Pagina | LCP vóór | LCP na | Overdracht na |
|---|---|---|---|
| Home | 2,55 s | 2,32 s | 496 kB |
| Schuttingen | 3,43 s | 2,87 s | 559 kB |
| Materialen | 2,27 s | 2,27 s | 449 kB |
| Configurator | 2,29 s | 2,19 s | 698 kB |
| Projecten | **5,92 s** | **2,68 s** | 805 kB (was 1148 kB) |

Doel (V7-06): LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 op echt verkeer (p75). Daarvoor is nog geen meting beschikbaar (geen analytics, bewust). `/schuttingen/` en `/projecten/` zitten onder deze zware testcondities nog iets boven 2,5 s; dat is genoteerd als vervolgstap (kleinere hero's, AVIF).

### Toegankelijkheid

- axe-core (WCAG 2.2 AA-regels) op 42 pagina's: 0 bevindingen. Dit is geen formele audit.
- **Focusring:** toetsenbordnavigatie op `/`, `/contact/`, `/materialen/`, `/project-samenstellen/`, `/prijzen/`, `/zoeken/` en `/voor-aannemers/` getest. Eerst misten invoervelden en keuzelijsten de ring (bestaande stijlen zetten `outline: none`); nu hebben alle gefocuste elementen een ring van 3 px.
- **Dialogen:** de vergelijk- en filterdialogen gebruiken het native `<dialog>` (focusbeheer door de browser).
- Meldingen, filterwijzigingen en mandjeacties worden via een `aria-live`-gebied aangekondigd.
- `prefers-reduced-motion` wordt overal gerespecteerd.
- Schermlezertest (NVDA/VoiceOver): **niet uitgevoerd**.

### 3D-terugval

Chromium zonder WebGL2: de configurator toont de melding "3D wordt niet ondersteund op dit apparaat/deze browser", houdt de 2D-tekening bruikbaar en schakelt de 3D-knop uit. Eerst werd daarbij een onafgevangen fout gegooid; die is opgelost.

### Gevonden en opgelost

| # | Prio | Bevinding | Oplossing |
|---|---|---|---|
| 1 | P1 | Dienstenlijst mobiel kapot (rasterplaatsing) | expliciete rasterplaatsing, eigen mobiele stapel |
| 2 | P1 | Eyebrow en breadcrumb op foto onleesbaar | tekst op effen vlak (mobiel) en scrim (desktop); AA-contrast |
| 3 | P1 | Google Fonts-verzoeken | zelf gehost |
| 4 | P1 | Primaire knop in de hero onzichtbaar (groen op groen) | lichte knop op donker vlak |
| 5 | P1 | Configurator op 320 px: paneel 312 px in 280 px ruimte | `minmax(0, 1fr)` onder 900 px |
| 6 | P2 | Contactpagina en B2B-invoer overflow op 320 px | `min-width: 0` op rasterkinderen |
| 7 | P2 | Focusring ontbrak op invoervelden | globale ring met voldoende specificiteit |
| 8 | P2 | Onafgevangen fout bij 3D zonder WebGL2 | afgevangen |
| 9 | P2 | Statuspagina toonde 404 als "niet bereikbaar" | onderscheid 404 en netwerkfout |
| 10 | P2 | LCP `/projecten/` 5,9 s door 440 kB-foto's | responsive varianten |

## Open (niet gedaan)

- **Fysieke toestellen:** iOS Safari (toolbar, safe-area, zoomgedrag bij invoer) en Android Chrome. Chromium-emulatie vervangt dat niet.
- **Schermlezer**, zoom 200 % en systeemfontgrootte handmatig.
- **Gebruikerstest** met echte bezoekers (V7-15): nog niet gepland.
- **AVIF** en kleinere hero-beelden voor `/schuttingen/` en `/projecten/`.
- **Core Web Vitals met echte bezoekers:** vereist meting na livegang.
