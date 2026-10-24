# GAP_MAP: verschilkaart open eisen (hervatting v7.0)

Stand: branch `claude/sealcleaning-website-overhaul-gvgtfj`. Bewijs staat in `docs/REQUIREMENTS_INDEX.md` (160 IDs) en `docs/UX_REQUIREMENTS.md` (UX001–UX174). "Live" is overal **nee**: niets is gemerged of gepubliceerd. Hieronder alleen wat niet `gebouwd, getest` is.

Categorieën: **BOUW** = zelf te bouwen zonder externe data · **EIGENAAR** = vereist inhoud/besluit van de eigenaar · **EXTERN** = vereist toestel, dienst, juridisch of netwerk · **BEWUST** = niet bouwen.

## Oorspronkelijke 160 (alleen open regels)

| ID | Code | Test | Categorie | Volgende actie |
|---|---|---|---|---|
| A05 | nee | nee | EIGENAAR | Stijllabel per echte case aanleveren |
| B05, C10, D10, I10, O04, O10 | nee | nee | EXTERN | Foto-/bestandsopslag, accounts: hosting + backend live |
| C05 | deels | nee | BOUW | Draairichting/aansluiting van bestaande poort vastleggen |
| F01 | deels | ja | EIGENAAR | Meer geverifieerde producten invoeren (nu 3 tegels) |
| F08, F09, J05 | nee | nee | EXTERN | Leveranciersdata, samples, leverroutes |
| G10, H10 | deels | ja (server) | EXTERN | Operationeel na hosting/SMTP |
| H01–H04, H09 | nee | nee | EIGENAAR | Gecontroleerde plantcatalogus |
| I04 | nee | nee | EIGENAAR | Echte voor/na-fotoparen |
| J07 | nee | nee | BOUW | Dienstspecifieke klantchecklist met gereedmelding |
| K10, L09 | deels | nee | EXTERN | Herroepingsformulier + digitale gereedmelding na juridische toets |
| M03–M05, M08–M10 | deels/nee | nee | EIGENAAR | SKU's, garantie, e-mailverzending na SMTP |
| N01–N04 | nee | nee | EXTERN | Juridische toets voorwaarden, privacy, bedrijfsgegevens |
| O05, P03 | deels | ja | BOUW | Goedkeuringsstap inkoop; btw-verlegging blijft handmatig |

## v7.0 experience-register (alleen open regels)

| ID | Categorie | Bewijs nu | Volgende actie |
|---|---|---|---|
| UX136 | BOUW | contact beperkt | Korte keuzehulp op contactpagina |
| UX055, UX148, UX144, UX146, UX147, UX065, UX126(focal) | BOUW (groot) | nee/deels | Burenproject, wat-als, meerdere zones, extra camerastandpunten, dupliceren, focal points |
| UX009, UX010, UX012, UX015, UX016, UX017, UX023, UX029, UX034, UX036, UX038, UX041, UX052, UX053, UX056, UX112, UX117, UX145, UX149, UX167, UX172 | BOUW/deels | deels | Per regel gedeeltelijke dekking; verfijning staat in UX_REQUIREMENTS |
| UX021, UX022, UX039, UX046, UX057, UX164 | EIGENAAR/EXTERN | n.v.t. | Teamfoto's, reviews, stijlen, voorwaarden, herroeping |
| UX115, UX116, UX137, UX143, UX173 | EXTERN | lab/axe | Schermlezer, fysieke toestellen, zoom 200 %, veldmeting |
| UX127 | EXTERN | geblokkeerd | Concurrentie-audit: netwerkpolicy blokkeert externe sites |
| UX170, UX171 | EXTERN | nee | Meetbeleid en gebruikerstest met echte bezoekers |
| UX151 | BEWUST | n.v.t. | AR niet bouwen zonder betrouwbare basis |

## Doorlopend niet bewezen

Docker-image niet gebouwd (geen daemon), geen fysieke toestellen, geen schermlezertest, geen gebruikerstest, geen veldmetrics, geen juridische toets, hosting/SMTP/Mollie/externe back-up niet gekoppeld.

Gesloten in deze ronde: UX084, UX085 (via code, geen browsertest), UX096 (getest), UX130.
