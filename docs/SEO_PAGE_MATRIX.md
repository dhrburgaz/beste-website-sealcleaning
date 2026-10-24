# SEO_PAGE_MATRIX (pilotpagina's)

De overige pagina's volgen na ontwerpakkoord. Alle drie staan in `sitemap.xml`. Geen rankingbelofte, geen verzonnen structured data: alleen `LocalBusiness` (bestaand, home) en `BreadcrumbList` (product).

| URL | Klant en intentie | Titel | H1 | Canonical | Schema | Primaire CTA | Status |
|---|---|---|---|---|---|---|---|
| `/` | Wat kan Sealcleaning voor mijn tuin doen; hovenier Dordrecht | Hovenier Dordrecht, Schuttingen, bestrating en tuinaanleg | Jouw droomtuin, ons vakwerk | `/` | LocalBusiness (geverifieerde NAW) | Bekijk de mogelijkheden / Vraag een offerte aan | gebouwd, automatisch getest; kop wacht op eigenaar |
| `/schutting-ontwerpen/` | Schutting ontwerpen of laten plaatsen zonder te kunnen meten | Schutting ontwerpen in 3D, Sealcleaning Dordrecht | Ontwerp je schutting | zelf | geen | Vraag een voorstel aan | gebouwd, automatisch getest; tekst is stap-voor-stap, geen vaste inhoud: later een statische uitleg-sectie voor zoekmachines |
| `/materialen/elephant-finch-grenen-scherm/` | Grenen schuttingscherm 180 cm, alleen materiaal of met montage | Elephant Finch grenen schuttingscherm 180 × 180 cm | Elephant Finch grenen schuttingscherm 180 × 180 cm | zelf | BreadcrumbList; geen Product/Offer (geen prijs, geen foto, geen voorraad) | Alleen materiaal aanvragen | gebouwd, automatisch getest |

Technisch: één H1 per pagina, unieke title en description, canonical, geen `noindex` op deze pagina's. Beheer- en bestelpagina's blijven `noindex` (bestaande regels). Core Web Vitals zijn alleen in het lab gemeten.
