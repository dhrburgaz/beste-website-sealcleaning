# UX_REQUIREMENTS — v7.0 experience-register

Aanvullend op de 160 IDs in `docs/REQUIREMENTS_INDEX.md`. Bron: `docs/SEAL_MASTER_BRIEF.md` hoofdstukken V7-02 t/m V7-19.
Status: `gebouwd, getest` (bewijs in kolom), `gebouwd`, `deels gebouwd`, `nog te bouwen`, `extern geblokkeerd`, `wacht op eigenaar`, `n.v.t.`, `niet beoordeeld`. 'Live' is voor alle regels **nee** zolang PR #3 niet gemerged is.

| ID | Groep | Bron | Eis | Status | Bewijs / toelichting |
| --- | --- | --- | --- | --- | --- |
| UX001 | Klantreis | V7-04.1 | Eerste bezoek mobiel → snelle bel/WhatsApp-actie: meteen duidelijk werkgebied, diensten, bereikbaar kanaal en geen overbodige pop-ups. | gebouwd, getest | Hero: werkgebied zichtbaar, sticky Bellen/WhatsApp/Offerte-balk; screenshots 390 px (docs/MOBILE_QA.md) |
| UX002 | Klantreis | V7-04.2 | Nieuwe bezoeker → vrijblijvende tuinaanvraag in < 2 minuten (gebruikersdoel, geen beloofde meetwaarde): dienst, locatie, korte omschrijving, contact; alleen noodzakelijke velden. | gebouwd | Contactformulier en backend-intake; de duur van 2 minuten is niet gemeten |
| UX003 | Klantreis | V7-04.3 | Schuttingproject → meters/hoogte/hoek/poort → voorstel → aanvraag: inclusief bestaande schutting, verwijdering en buurtafspraken. | gebouwd, getest | Configurator schutting/bestrating + intake; tests/geometry-io, calc, e2e |
| UX004 | Klantreis | V7-04.4 | Bestratingsproject → oppervlak/verband/ondergrond/afvoer → materiaalscenario's → aanvraag: pakketten en snijverlies transparant. | gebouwd, getest | Configurator schutting/bestrating + intake; tests/geometry-io, calc, e2e |
| UX005 | Klantreis | V7-04.5 | Complete tuin → wensen → tekenen → bewaren → samen bespreken → aanvraag: geen verplichte complete 3D voordat contact mogelijk is. | gebouwd | Instapkeuze 'Snel project' / 'Zelf ontwerpen'; ontwerp bewaard in browser, contact zonder tekenen mogelijk |
| UX006 | Klantreis | V7-04.6 | Inspiratie → case → bewaren → vergelijken → eigen plan: alleen echte case claims en herleidbare foto's. | gebouwd | Projectcases, inspiratiebord (lokaal), alleen eigen foto's |
| UX007 | Klantreis | V7-04.7 | Materiaal ontdekken → zoeken/filteren → vergelijken → informatie/demonstratie → prijsstatus. | gebouwd, getest | /materialen/: zoeken, filters, vergelijken, productdetail (tests/catalog.test.mjs, e2e) |
| UX008 | Klantreis | V7-04.8 | Materiaal kopen (alleen wanneer daadwerkelijk aangeboden): productdetail → configureerbare hoeveelheid → mandje → coupon → verzending/afhaaloptie → betaaldienst → bevestiging → nazorg/retourproces. | gebouwd, getest | Mandje/checkout gebouwd en getest (tests/shop.test.mjs, e2e/webwinkel.mjs); uitgeschakeld achter flags; live: extern geblokkeerd |
| UX009 | Klantreis | V7-04.9 | Alleen montage, klant levert materiaal: duidelijke verantwoordelijkheid, aantallen, tolerantie, risico, levertijd en afspraak. | deels gebouwd | Aanpakkeuze 'alleen montage' op dienstpagina's; verantwoordelijkheid voor aangeleverd materiaal beschreven; aantallen/tolerantie per project nog niet in de flow |
| UX010 | Klantreis | V7-04.10 | Onderhoudsklant → éénmalig vs seizoenscontract: scope, frequentie, toegankelijkheid, afvoer, opzeg- en prijsvoorwaarden. | deels gebouwd | Eenmalig vs periodiek beschreven; seizoenscontract met opzegvoorwaarden vereist eigenaar/juridisch |
| UX011 | Klantreis | V7-04.11 | Budgetbewuste klant → varianten A/B/C: eerlijke uitgangspunten en leverbaarheid; aanpassingen binnen hetzelfde ontwerp. | gebouwd, getest | Varianten A/B/C in configurator |
| UX012 | Klantreis | V7-04.12 | Zakelijke opdrachtgever/VvE → meerdere locaties/PO/BTW: gestandaardiseerde projectaanvraag, documenten, rollen, facturatie. | deels gebouwd | Zakelijke intake, PO-veld bij facturen; meerdere locaties en btw-verlegging wachten op bevestiging |
| UX013 | Klantreis | V7-04.13 | Offerte ontvangen → vragen → wijzigen → akkoord: exacte versie/voorwaarden vastleggen; niet verplicht eerst een account creëren om inhoud te zien. | gebouwd, getest | Klantportaal (server): akkoord met hash, versies, planning, status |
| UX014 | Klantreis | V7-04.14 | Uitvoering → planning/meerwerk/oplevering: transparante status en contactmomenten. | gebouwd, getest | Klantportaal (server): akkoord met hash, versies, planning, status |
| UX015 | Klantreis | V7-04.15 | Probleem/klacht/herroeping: frictiearme toegang, wettelijk proces, geen defensieve interface. | deels gebouwd | Klacht/serviceverzoek via portaal; herroepingsfunctie wacht op juridische toetsing |
| UX016 | Klantreis | V7-04.16 | Bestaande klant → onderhoud → vervolgproject → aanbeveling: opt-in opvolging en eenvoudig opnieuw aanvragen. | deels gebouwd | Opt-in toestemmingen in portaal; opvolgacties niet geautomatiseerd |
| UX017 | Klantreis | V7-04 | Mislukte scenario's per route: geen internet, verkeerd formaat, offerte verlopen, ontwerp te groot voor deellink, ontbrekend product, ongeldige korting, mislukte betaling, geen mailserver, verboden locatie, API niet beschikbaar, tablet gedraaid, sessie verlopen; data verdwijnt niet | deels gebouwd | Gedekt: offline/geen WebGL, verlopen offerte, ongeldige code, mislukte betaling, geen mailserver (wachtrij); niet alle scenario's |
| UX018 | Conversie/psychologie | V7-11.1 | Fotografisch bewijs boven de vouw uit echte SEAL-klussen. | gebouwd, getest | Home/hero: echte foto, werkgebied, wat-gebeurt-er-daarna (screenshots) |
| UX019 | Conversie/psychologie | V7-11.2 | Direct zichtbaar werkgebied, zodat bezoeker niet hoeft te twijfelen. | gebouwd, getest | Home/hero: echte foto, werkgebied, wat-gebeurt-er-daarna (screenshots) |
| UX020 | Conversie/psychologie | V7-11.3 | Bereikbaarheid en verwachte contactroute duidelijk, geen onhaalbare beloftes. | gebouwd, getest | Home/hero: echte foto, werkgebied, wat-gebeurt-er-daarna (screenshots) |
| UX021 | Conversie/psychologie | V7-11.4 | Echte vakmensen en uitvoeringsproces, geen stockteam. | wacht op eigenaar | Geen teamfoto's aangeleverd; geen stockteam geplaatst |
| UX022 | Conversie/psychologie | V7-11.5 | Geverifieerde reviews en herkomst, niet manipuleren of selectief fictief publiceren. | wacht op eigenaar | Geen geverifieerde reviews aangeleverd; geen reviews getoond |
| UX023 | Conversie/psychologie | V7-11.6 | Casegegevens: situatie, aanpak, resultaat en authentieke foto's. | deels gebouwd | Cases met situatie/aanpak/resultaat waar onderbouwd; niet alle cases volledig |
| UX024 | Conversie/psychologie | V7-11.7 | Duidelijke wat-wel/niet-inbegrepen informatie. | gebouwd | Dienstpagina's: wat wel/niet standaard inbegrepen, kostenfactoren, indicatiedisclaimers |
| UX025 | Conversie/psychologie | V7-11.8 | Concrete uitleg over onzekerheid, risico en onverwachte kosten. | gebouwd | Dienstpagina's: wat wel/niet standaard inbegrepen, kostenfactoren, indicatiedisclaimers |
| UX026 | Conversie/psychologie | V7-11.9 | Persoonlijke doelselectie ('privacy', 'onderhoudsvriendelijk', 'renovatie'). | gebouwd | Doelkeuze in configurator, snelle route zonder 3D, progressive disclosure |
| UX027 | Conversie/psychologie | V7-11.10 | Snelle route zonder 3D en gevorderde route mét editor. | gebouwd | Doelkeuze in configurator, snelle route zonder 3D, progressive disclosure |
| UX028 | Conversie/psychologie | V7-11.11 | Progressive disclosure van technisch ingewikkelde velden. | gebouwd | Doelkeuze in configurator, snelle route zonder 3D, progressive disclosure |
| UX029 | Conversie/psychologie | V7-11.12 | Jargon in begrijpelijk Nederlands met contextuitleg. | deels gebouwd | Uitleg in gewone taal; niet overal gecontroleerd |
| UX030 | Conversie/psychologie | V7-11.13 | Snel filteren op materiaal, formaat, onderhoud, stijl en kostenbasis. | gebouwd, getest | Catalogusfilters en vergelijk tot 3 |
| UX031 | Conversie/psychologie | V7-11.14 | Vergelijk maximaal drie hoofdopties per scherm, verdere keuzen uitklapbaar. | gebouwd, getest | Catalogusfilters en vergelijk tot 3 |
| UX032 | Conversie/psychologie | V7-11.15 | Alternatieven met uitleg waarom ze mogelijk beter passen. | gebouwd | Vergelijkbare materialen op productdetail |
| UX033 | Conversie/psychologie | V7-11.16 | 'Weet ik niet' als respectabele optie, niet afstraffen met error. | gebouwd | 'Weet ik niet' in intake en configurator |
| UX034 | Conversie/psychologie | V7-11.17 | Resultaatgericht schrijven (privacy/rust/gebruiksruimte), niet alleen werkzaamheden. | deels gebouwd | Resultaatgerichte koppen op home; niet overal |
| UX035 | Conversie/psychologie | V7-11.18 | Kwalitatieve 3D-scène met begrijpelijke materiaalweergave. | gebouwd | 3D-scène met materialen; WebGL2-terugval getest |
| UX036 | Conversie/psychologie | V7-11.19 | Eerlijke kosten- en onderhoudsvergelijking over langere termijn. | deels gebouwd | Onderhoudsniveau per materiaal; geen langetermijnkostenvergelijking |
| UX037 | Conversie/psychologie | V7-11.20 | Inspiratiebord en opgeslagen ontwerpen om samen te bespreken. | gebouwd | Inspiratiebord en opgeslagen ontwerpen (lokaal) |
| UX038 | Conversie/psychologie | V7-11.21 | Relevante aanvullingen: bijvoorbeeld afvoer/ondergrond/poort bij schutting. | deels gebouwd | Aanvullingen in de offerte-intake; geen aparte aanbevelingen |
| UX039 | Conversie/psychologie | V7-11.22 | Niet-dwingende stijlkiezer (modern/natuurlijk/tijdloos) met echt beeld. | wacht op eigenaar | Stijllabels per case (A05) wachten op eigenaar |
| UX040 | Conversie/psychologie | V7-11.23 | Locatie/passendheid alleen waar bron werkelijk geverifieerd. | gebouwd | Werkgebiedcheck op bronbasis |
| UX041 | Conversie/psychologie | V7-11.24 | Persoonlijke offertesamenvatting met het eigen tuinontwerp. | deels gebouwd | Offerte hoort bij projectdossier met ontwerp-id; ontwerptekening nog niet in offertedocument |
| UX042 | Conversie/psychologie | V7-11.25 | Vroegtijdige totaalprijsstatus incl. onbekende onderdelen. | gebouwd | Onbekende onderdelen als 'op aanvraag'; bezorgkosten nooit stilzwijgend € 0 |
| UX043 | Conversie/psychologie | V7-11.26 | Geen onverwachte kosten op het laatst. | gebouwd | Onbekende onderdelen als 'op aanvraag'; bezorgkosten nooit stilzwijgend € 0 |
| UX044 | Conversie/psychologie | V7-11.27 | Begrijpelijke offertestadia en reactieverwachting. | gebouwd | Portaalstatus en prijssoort (indicatie/richtprijs/vast) visueel verschillend |
| UX045 | Conversie/psychologie | V7-11.28 | Echt visueel verschil tussen 'prijsindicatie' en 'bindende opdracht'. | gebouwd | Portaalstatus en prijssoort (indicatie/richtprijs/vast) visueel verschillend |
| UX046 | Conversie/psychologie | V7-11.29 | Duidelijke voorwaarden, garantie alleen met echt beleid. | wacht op eigenaar | Voorwaarden/garantie wachten op juridische toetsing |
| UX047 | Conversie/psychologie | V7-11.30 | Eenvoudig bestanden en ontwerpgegevens aanleveren. | gebouwd | Uploads zonder account; aanvraag zonder account |
| UX048 | Conversie/psychologie | V7-11.31 | Geen verplichte accountaanmaak voor een simpele aanvraag. | gebouwd | Uploads zonder account; aanvraag zonder account |
| UX049 | Conversie/psychologie | V7-11.32 | Bevestiging met referentie alleen na serveracceptatie. | gebouwd, getest | Referentie pas na serveracceptatie (integratietest) |
| UX050 | Conversie/psychologie | V7-11.33 | Projectportaal met tijdlijn, planning en verantwoordelijke acties. | gebouwd, getest | Klantportaal getest (integratie + browser) |
| UX051 | Conversie/psychologie | V7-11.34 | Transparante controle en toestemming bij meerwerk. | gebouwd | Meerwerk als nieuwe offerteversie; akkoord vóór uitvoering |
| UX052 | Conversie/psychologie | V7-11.35 | Opleverchecklist en productspecifieke nazorg waar data bestaat. | deels gebouwd | Opleverdocument aanwezig; productspecifieke nazorg wacht op SKU's |
| UX053 | Conversie/psychologie | V7-11.36 | Passende seizoensadviezen opt-in, geen ongevraagde marketing. | deels gebouwd | Toestemming onderhoudsherinnering vastgelegd; verzenden niet geautomatiseerd |
| UX054 | Conversie/psychologie | V7-11.37 | Eenvoudige klacht- en servicemelding. | gebouwd | Service- en klachtverzoek via portaal |
| UX055 | Conversie/psychologie | V7-11.38 | Burenproject samenstellen met daadwerkelijke gedeelde kostenefficiëntie. | nog te bouwen | Burenproject niet gebouwd |
| UX056 | Conversie/psychologie | V7-11.39 | Vriendelijk terughalen van opgeslagen ontwerpen, zonder manipulatieve push. | deels gebouwd | Autosave en heropenen van ontwerp in dezelfde browser; geen push |
| UX057 | Conversie/psychologie | V7-11.40 | Echte aanbevelingen van tevreden klanten alleen vrijwillig en geverifieerd. | wacht op eigenaar | Aanbevelingen alleen vrijwillig en geverifieerd; nog geen bron |
| UX058 | Microdetail | V7-12.01 | voorspelbare button states | gebouwd | Knoptoestanden: hover/active/disabled/busy |
| UX059 | Microdetail | V7-12.02 | focus altijd zichtbaar | gebouwd, getest | Focusring op alle gefocuste elementen (toetsenbordtest, MOBILE_QA) |
| UX060 | Microdetail | V7-12.03 | terugknop behoudt data | gebouwd, getest | Catalogus: filters in URL; mandje blijft bewaard |
| UX061 | Microdetail | V7-12.04 | tekst en getal netjes uitgelijnd | gebouwd | tabular-nums; Nederlandse valuta/datum |
| UX062 | Microdetail | V7-12.05 | consistente Nederlandse datum-/valutaformattering | gebouwd | tabular-nums; Nederlandse valuta/datum |
| UX063 | Microdetail | V7-12.06 | klikzones niet alleen op kleine iconen | gebouwd, getest | Tikdoelen ≥ 44 px: 929 → 4 (ux-metrics) |
| UX064 | Microdetail | V7-12.07 | label/tooltip die uitleg geeft vóór de keuze | gebouwd | Uitleg bij filters/sortering/statusbadges |
| UX065 | Microdetail | V7-12.08 | projectfotografie met intelligente focal points | nog te bouwen | Focal points per foto ontbreken |
| UX066 | Microdetail | V7-12.09 | leesbare chips en tags | gebouwd | Chips en badges met tekst + vorm |
| UX067 | Microdetail | V7-12.10 | beelden met breedte/hoogte om layoutverschuiving te voorkomen | gebouwd, getest | Afmetingen op afbeeldingen, CLS 0,000 |
| UX068 | Microdetail | V7-12.11 | zoekresultaten bij synoniemen | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX069 | Microdetail | V7-12.12 | tikfouten tolerant | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX070 | Microdetail | V7-12.13 | actieve filters zichtbaar | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX071 | Microdetail | V7-12.14 | filter reset | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX072 | Microdetail | V7-12.15 | geen-resultaten met alternatief | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX073 | Microdetail | V7-12.16 | sorteren met uitleg | gebouwd, getest | Catalogus unit- en browsertests (synoniemen, tikfouten, actieve filters, reset, geen resultaten, sorteeruitleg) |
| UX074 | Microdetail | V7-12.17 | merken/leveranciers niet suggereren die niet zijn aangesloten | gebouwd, getest | Alleen geverifieerde producten tonen een leverancier; test controleert SKU/leverancier null bij opties |
| UX075 | Microdetail | V7-12.18 | bron en datum bij prijzen | gebouwd, getest | Bron en peildatum bij marktreferentie; verlopen = geen bedrag |
| UX076 | Microdetail | V7-12.19 | productverschillen in gewone taal | gebouwd | Specificaties en vergelijking in gewone taal |
| UX077 | Microdetail | V7-12.20 | vergelijkingsweergave op mobiel zonder onbereikbare kolommen | gebouwd, getest | Vergelijking stapelt kolommen op mobiel (screenshot) |
| UX078 | Microdetail | V7-12.21 | undo/redo op mobiel | gebouwd | Undo/redo, schaalbare labels en numeriek invoeren in configurator (eerdere sessies getest) |
| UX079 | Microdetail | V7-12.22 | annotaties en maatlabels schaalbaar | gebouwd | Undo/redo, schaalbare labels en numeriek invoeren in configurator (eerdere sessies getest) |
| UX080 | Microdetail | V7-12.23 | bereikbare numeric editor als drag niet lukt | gebouwd | Undo/redo, schaalbare labels en numeriek invoeren in configurator (eerdere sessies getest) |
| UX081 | Microdetail | V7-12.24 | tekenvenster blijft scherp na rotatie | gebouwd | Canvas herschaalt; rotatie niet op toestel getest |
| UX082 | Microdetail | V7-12.25 | omrekenen m²/m/element per juiste eenheid | gebouwd, getest | Eenhedenomrekening in unit tests |
| UX083 | Microdetail | V7-12.26 | ongeldige contour geeft visuele uitleg | gebouwd | Ongeldige contour: uitleg in configurator |
| UX084 | Microdetail | V7-12.27 | kopiëren van een vlak behoudt materiaalinformatie | niet beoordeeld | Niet in deze ronde gecontroleerd |
| UX085 | Microdetail | V7-12.28 | bescherming tegen per ongeluk verwijderen | niet beoordeeld | Niet in deze ronde gecontroleerd |
| UX086 | Microdetail | V7-12.29 | varianten consistent en synchroniseerbaar | gebouwd | Varianten en exportaannames |
| UX087 | Microdetail | V7-12.30 | export bevat verwerkingsstatus en aannames | gebouwd | Varianten en exportaannames |
| UX088 | Microdetail | V7-12.31 | juiste toetsenbordtype | gebouwd | inputmode/autocomplete op formulieren; 0 velden zonder label |
| UX089 | Microdetail | V7-12.32 | auto-fill waar veilig | gebouwd | inputmode/autocomplete op formulieren; 0 velden zonder label |
| UX090 | Microdetail | V7-12.33 | veldfout direct bij veld | gebouwd, getest | Veldfouten direct bij veld (e2e/webwinkel) |
| UX091 | Microdetail | V7-12.34 | eerdere velden bewaard bij teruggaan | gebouwd | Gegevens bewaard in sessionStorage bij terug |
| UX092 | Microdetail | V7-12.35 | datum geen fictieve beschikbaarheid | gebouwd | Afspraak is voorstel tot bevestiging; geen fictieve beschikbaarheid |
| UX093 | Microdetail | V7-12.36 | fotoformaat/limiet duidelijk | gebouwd | Fotolimiet in formulier vermeld |
| UX094 | Microdetail | V7-12.37 | success state niet te vroeg | gebouwd, getest | Success pas na serveracceptatie (e2e) |
| UX095 | Microdetail | V7-12.38 | 'ik weet het niet' waar zinvol | gebouwd | 'Weet ik niet' in intake |
| UX096 | Microdetail | V7-12.39 | contactvoorkeur | nog te bouwen | Contactvoorkeur niet in het formulier |
| UX097 | Microdetail | V7-12.40 | WhatsApp-bericht met korte, niet-privacygevoelige context | gebouwd | WhatsApp-bericht zonder persoonsgegevens |
| UX098 | Microdetail | V7-12.41 | promotiecode foutmelding vriendelijk | gebouwd, getest | Concrete redenen: verlopen, op, minimum (tests/commerce, shop) |
| UX099 | Microdetail | V7-12.42 | uitgeputte code toont echt reden | gebouwd, getest | Concrete redenen: verlopen, op, minimum (tests/commerce, shop) |
| UX100 | Microdetail | V7-12.43 | minimumwaarde eerlijk | gebouwd, getest | Concrete redenen: verlopen, op, minimum (tests/commerce, shop) |
| UX101 | Microdetail | V7-12.44 | couponverwijdering herstelt totaal | gebouwd | Code verwijderen herberekent direct |
| UX102 | Microdetail | V7-12.45 | BTW na korting correct | gebouwd, getest | Btw na korting, aantalgrens, idempotente bestelling, onbekende bezorgkosten (tests) |
| UX103 | Microdetail | V7-12.46 | gebruikershoeveelheid begrensd | gebouwd, getest | Btw na korting, aantalgrens, idempotente bestelling, onbekende bezorgkosten (tests) |
| UX104 | Microdetail | V7-12.47 | nooit dubbele betaling door dubbele taps | gebouwd, getest | Btw na korting, aantalgrens, idempotente bestelling, onbekende bezorgkosten (tests) |
| UX105 | Microdetail | V7-12.48 | onbekende verzendkosten niet als €0 | gebouwd, getest | Btw na korting, aantalgrens, idempotente bestelling, onbekende bezorgkosten (tests) |
| UX106 | Microdetail | V7-12.49 | uitstap uit checkout houdt mandje intact | gebouwd | Mandje in localStorage; terug van betaalpagina herlaadt actuele staat |
| UX107 | Microdetail | V7-12.50 | herroeping/retourregels bereikbaar | gebouwd | Herroepingsinformatie zichtbaar in checkout; formele functie wacht op juridisch |
| UX108 | Microdetail | V7-12.51 | privacyvriendelijke meetopties | gebouwd | Geen analytics of tracking op de site |
| UX109 | Microdetail | V7-12.52 | server autoriseert prijs en order | gebouwd, getest | Server rekent prijs; geen PII in deellink; klant ziet geen inkoop/marge (tests) |
| UX110 | Microdetail | V7-12.53 | geen klant-PII in deellinks | gebouwd, getest | Server rekent prijs; geen PII in deellink; klant ziet geen inkoop/marge (tests) |
| UX111 | Microdetail | V7-12.54 | klant ziet nooit inkoop/marges | gebouwd, getest | Server rekent prijs; geen PII in deellink; klant ziet geen inkoop/marge (tests) |
| UX112 | Microdetail | V7-12.55 | sessieverloop begrijpelijk | deels gebouwd | Sessieverloop server-side; begrijpelijke melding in UI niet apart getest |
| UX113 | Microdetail | V7-12.56 | back-ups en herstel bewezen | gebouwd, getest | Back-up en herstel getest (tests/server) |
| UX114 | Microdetail | V7-12.57 | `prefers-reduced-motion` | gebouwd, getest | prefers-reduced-motion |
| UX115 | Microdetail | V7-12.58 | foutstatus schermlezer-aankondiging | deels gebouwd | aria-live aanwezig; geen schermlezertest |
| UX116 | Microdetail | V7-12.59 | snelheid op zwakke telefoons | deels gebouwd | Labmeting onder throttling; geen toesteltest |
| UX117 | Microdetail | V7-12.60 | duidelijke help/contactroute als iets faalt | deels gebouwd | Contactroutes aanwezig; geen centrale help bij elke fout |
| UX118 | Hoofdstuk-eis | V7-02 | Drie visuele concepten (A Architectural Forest, B Modern Stone Studio, C Warm Craft & Nature) als werkende prototypes; onderbouwde keuze | gebouwd, getest | Drie werkende concepten (tools/concepts) beoordeeld op echte pagina's; A gekozen (docs/DESIGN_SYSTEM.md) |
| UX119 | Hoofdstuk-eis | V7-02 | Semantische kleurrollen met contrast in alle toestanden; kleur nooit enige statusdrager | gebouwd, getest | Rollen in css; axe 0 bevindingen |
| UX120 | Hoofdstuk-eis | V7-02 | Typografische rollen en fluid scale; lange Nederlandse woorden en prijsregels getest | gebouwd | Tokens in css/style.css |
| UX121 | Hoofdstuk-eis | V7-02 | Spacing/ritme-schaal, grid, fotoverhoudingen, radii, schaduwen als bewuste signatuur | gebouwd | Tokens in css/style.css |
| UX122 | Hoofdstuk-eis | V7-02 | Componentbibliotheek (knop, chip, kaart, tabs, accordion, keuzetegel, input, validatie, status, vergelijkingstabel, sticky CTA, mobiele navigatie, dialog, toast, skeleton, progress, lightbox, galerij, besteloverzicht, prijstabel, foutscherm) | deels gebouwd | Knop, chip, kaart, badge, melding, skeleton, toast, stappen, dialoog, hoeveelheid, prijsregels; tabs ontbreken |
| UX123 | Hoofdstuk-eis | V7-02 | Statussen loading/empty/error/offline/success/pending/estimated/out-of-service-area/not-configured, niet alleen kleur | gebouwd | Toestanden in CSS en in catalogus/checkout toegepast |
| UX124 | Hoofdstuk-eis | V7-02 | Consistente iconenlijnstijl, geen onnodige gradients/glow/stock | gebouwd | Geen gradients/glow/stock |
| UX125 | Hoofdstuk-eis | V7-02 | Motion-systeem 100–300 ms, prefers-reduced-motion | gebouwd | Tokens in css/style.css |
| UX126 | Hoofdstuk-eis | V7-02 | Beeldregie: echte projectfoto's, webp/avif, alt, focal points | deels gebouwd | Echte foto's, WebP-varianten; AVIF en focal points ontbreken |
| UX127 | Hoofdstuk-eis | V7-03 | Benchmark ≥12 Nederlandse branchevoorbeelden + 6 aangrenzende categorieën met bron, datum, matrix en principe-advies | extern geblokkeerd | Netwerkpolicy blokkeert externe sites; zie docs/COMPETITOR_BENCHMARK.md |
| UX128 | Hoofdstuk-eis | V7-05 | Homepage volgens template (echte foto, propositie, werkgebied, twee paden, wat-gebeurt-er-daarna, bewijs, 5–7 diensten, case, materiaal, werkwijze, FAQ, zakelijk, slot-CTA) | gebouwd | Home volgens template (screenshots) |
| UX129 | Hoofdstuk-eis | V7-05 | Dienstpagina volgens template incl. inbegrepen/niet inbegrepen en kostenfactoren | gebouwd | Dienstpagina's met aanpak en inbegrepen/niet standaard |
| UX130 | Hoofdstuk-eis | V7-05 | Projectcase volgens template (galerij, situatie/uitdaging/uitvoering/resultaat, vergelijkbaar project starten) | deels gebouwd | 'Vergelijkbaar project starten' ontbreekt |
| UX131 | Hoofdstuk-eis | V7-05 | Materialencategorie met vakfilters, sortering, reset, actieve filters, resultaatcount, no-results, vergelijken | gebouwd, getest | Catalogus en productdetail (tests/e2e) |
| UX132 | Hoofdstuk-eis | V7-05 | Productdetail met specs, eenheid, verpakking, benodigde hoeveelheid, status, alternatief; geen zelfbedachte SKU | gebouwd, getest | Catalogus en productdetail (tests/e2e) |
| UX133 | Hoofdstuk-eis | V7-05 | Configurator: 'Snel project' en 'Zelf ontwerpen', persistente maat-/prijsstatus, heropenen na sluiten | gebouwd, getest | Instapkeuze en autosave |
| UX134 | Hoofdstuk-eis | V7-05 | Prijzenpagina: arbeidstarief, marktbenchmark, bron/datum, in- en uitsluitingen | gebouwd | /prijzen/ met bronnen en peildata |
| UX135 | Hoofdstuk-eis | V7-05 | Offerte/portaal volgens template | gebouwd, getest | Portaalofferte (e2e/server-keten) |
| UX136 | Hoofdstuk-eis | V7-05 | Over ons, zakelijk, contact-keuzehulp, 404/0-resultaten met herstelpad | deels gebouwd | Contact en 404 aanwezig; keuzehulp bij contact beperkt |
| UX137 | Hoofdstuk-eis | V7-06 | Mobile-first 320/360/375/390/430/768/1024/1440 px, portrait/landscape, zoom 200% | deels gebouwd | 320–1440 px gemeten in Chromium; geen fysieke toestellen, zoom 200 % niet getest |
| UX138 | Hoofdstuk-eis | V7-06 | Eigen interactieve controls ≥44×44 CSS px | gebouwd, getest | 44 px: 929 → 4 |
| UX139 | Hoofdstuk-eis | V7-06 | Contextuele sticky actiebalk met safe-area, nooit dubbel, verbergt geen velden | gebouwd | Sticky balk met safe-area; één balk |
| UX140 | Hoofdstuk-eis | V7-06 | Formulieren met autocomplete/inputmode, persistente labels, inline fouten | gebouwd | autocomplete/inputmode/labels |
| UX141 | Hoofdstuk-eis | V7-06 | 3D zonder WebGL → 2D-fallback; geen horizontale overflow; langzaam netwerk getest | gebouwd, getest | 2D-terugval zonder WebGL2; 0 overflow; throttled lab |
| UX142 | Hoofdstuk-eis | V7-06 | Geen storende pop-ups | gebouwd | Geen pop-ups |
| UX143 | Hoofdstuk-eis | V7-06 | Performance: LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 (lab apart van veld); 3D on demand | deels gebouwd | Lab-LCP 2,2–2,9 s onder zware throttling; INP en veldwaarden niet gemeten |
| UX144 | Hoofdstuk-eis | V7-07 | Editor: meerdere zones, niet-zelfkruisende polygonen, sanity checks | deels gebouwd | Rechthoek, L, vrije contour; meerdere zones niet |
| UX145 | Hoofdstuk-eis | V7-07 | Hoogteverschil als expliciete informatie | deels gebouwd | Hoogteverschil als intakevraag |
| UX146 | Hoofdstuk-eis | V7-07 | Camerastandpunten boven/ooghoogte/ingang/terras + reset | deels gebouwd | Boven, voor, 3D en ooghoogte + reset; ingang/terras-standpunten niet |
| UX147 | Hoofdstuk-eis | V7-07 | Versiegeschiedenis, kopiëren, dupliceren, vastzetten, A/B/C | deels gebouwd | Undo/redo, A/B/C, autosave; dupliceren/vastzetten beperkt |
| UX148 | Hoofdstuk-eis | V7-07 | 'Wat verandert er als?'-scenario's | nog te bouwen | Scenario's 'wat als' alleen via varianten |
| UX149 | Hoofdstuk-eis | V7-07 | Zelfopmeten-hulp | deels gebouwd | Kennisbank 'schutting opmeten'; geen fotovoorbeelden per stap |
| UX150 | Hoofdstuk-eis | V7-07 | Downloads: PNG, ontwerpbestand, projectdossier; betrouwbare re-import | gebouwd | PNG, ontwerpbestand, dossier, re-import |
| UX151 | Hoofdstuk-eis | V7-07 | AR/foto-visualisatie als R&D-kandidaat (niet bouwen zonder betrouwbare basis) | n.v.t. | R&D-kandidaat; bewust niet gebouwd |
| UX152 | Hoofdstuk-eis | V7-08 | Schaalbaar productdatamodel met status geverifieerd-product / algemene materiaaloptie / op aanvraag / niet leverbaar; onzekere velden null | gebouwd, getest | data/catalog.js (45 items), js/catalog; tests |
| UX153 | Hoofdstuk-eis | V7-08 | Alle categorieën (schutting, bestrating, banden/zand/split, gras, groen, verlichting/drainage/vlonders binnen scope) als data | gebouwd, getest | data/catalog.js (45 items), js/catalog; tests |
| UX154 | Hoofdstuk-eis | V7-08 | Productzoeker met synoniemen en tikfouten, facetfilters, vergelijk tot 3, favorieten, alternatieven | gebouwd, getest | data/catalog.js (45 items), js/catalog; tests |
| UX155 | Hoofdstuk-eis | V7-09 | Vijf commerciële modellen A–E gescheiden in taal en techniek | gebouwd | docs/COMMERCE_RULES.md; modellen A–E gescheiden |
| UX156 | Hoofdstuk-eis | V7-09 | Kortingsmotor server-side: typen, bereik, Europe/Amsterdam-periode, stapelregels, minimum, maximum, gebruikslimieten, audit | gebouwd, getest | server/src/commerce.js + routes/shop.js; tests/commerce en shop |
| UX157 | Hoofdstuk-eis | V7-09 | Transactionele/idempotente couponverwerking; geen negatieve totalen; afronding; herstel bij mislukte betaling | gebouwd, getest | server/src/commerce.js + routes/shop.js; tests/commerce en shop |
| UX158 | Hoofdstuk-eis | V7-09 | Ordermomentopname met prijs, korting, coupon, btw | gebouwd, getest | server/src/commerce.js + routes/shop.js; tests/commerce en shop |
| UX159 | Hoofdstuk-eis | V7-09 | Van/voor alleen met 30-dagen-laagsteprijshistorie (ACM) | gebouwd, getest | server/src/commerce.js + routes/shop.js; tests/commerce en shop |
| UX160 | Hoofdstuk-eis | V7-09 | Voorbeeldcode WELCOME10 alleen als inactieve testfixture | gebouwd, getest | Alleen als testfixture; niet publiek |
| UX161 | Hoofdstuk-eis | V7-10 | Serviceflow gescheiden van productflow | gebouwd | Aanvraag/offerte-akkoord en bestelling gescheiden flows en teksten |
| UX162 | Hoofdstuk-eis | V7-10 | Checkout zonder account, stappen, alle kosten vóór bevestigen, betalingsplichtige knoptekst | gebouwd, getest | e2e/webwinkel.mjs (390/1440) |
| UX163 | Hoofdstuk-eis | V7-10 | Dubbel klikken → nooit dubbele order; betaald alleen na serverbevestiging | gebouwd, getest | e2e/webwinkel.mjs (390/1440) |
| UX164 | Hoofdstuk-eis | V7-10 | Herroepings-/ontbindingsfunctie juridisch te beoordelen vóór productie | wacht op eigenaar | Juridische beoordeling nodig vóór productie |
| UX165 | Hoofdstuk-eis | V7-10 | Mandje bewaard zonder PII; aantal met invoer én +/-; aanvraag krijgt nooit 'besteld'-mail | gebouwd, getest | e2e/webwinkel.mjs (390/1440) |
| UX166 | Hoofdstuk-eis | V7-13 | Copy-systeem per CTA (werkwoord + uitkomst + verwachting) en microcopy bij gevoelige keuzes | gebouwd | Copy-systeem toegepast op CTA's |
| UX167 | Hoofdstuk-eis | V7-13 | SEO: één onderwerp per pagina, structured data alleen met echte feiten, geen massale lokale pagina's | deels gebouwd | Eén onderwerp per pagina, sitemap bijgewerkt; structured data niet uitgebreid |
| UX168 | Hoofdstuk-eis | V7-14 | Rollen eigenaar/medewerker/vakman/zakelijk/particulier; autorisatie per object server-side | gebouwd, getest | Server-side autorisatie (integratietests) |
| UX169 | Hoofdstuk-eis | V7-14 | Feature flags catalog/quotes/checkout/coupon/payments/appointments, per combinatie getest; server blijft grens | gebouwd, getest | Flags getest in standaard-uit en gedeeltelijk-aan; niet alle combinaties |
| UX170 | Hoofdstuk-eis | V7-15 | KPI-definities en privacyvriendelijke meting; geen conversieclaims zonder baseline | nog te bouwen | Geen meting (bewust: geen tracking vóór toestemming/beleid) |
| UX171 | Hoofdstuk-eis | V7-15 | Usability-rondes met echte doelgroep (scenario's vooraf vastgelegd) | nog te bouwen | Gebruikerstests nog niet uitgevoerd |
| UX172 | Hoofdstuk-eis | V7-16 | P0/P1/P2-gates; geen merge met P0 | deels gebouwd | Gates in docs; geen formele releaseprocedure |
| UX173 | Hoofdstuk-eis | V7-16 | WCAG 2.2 AA kernflows getoetst incl. toetsenbord, schermlezer, zoom, reduced motion | deels gebouwd | axe + toetsenbord; schermlezer en zoom niet |
| UX174 | Hoofdstuk-eis | V7-19 | Opleverdocumenten: UX_STRATEGY, DESIGN_SYSTEM, COMPETITOR_BENCHMARK, COMMERCE_RULES, MOBILE_QA, IMPLEMENTATION_STATUS, REQUIREMENTS_INDEX | deels gebouwd | DESIGN_SYSTEM, COMPETITOR_BENCHMARK (status), COMMERCE_RULES, MOBILE_QA, DESIGN_AUDIT aanwezig; UX_STRATEGY volgt |
