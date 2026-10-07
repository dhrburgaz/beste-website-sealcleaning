# SEAL Claude Code Masterprompt — website, 3D tuinontwerp, materiaalplatform en commerciële operatie

Versie 2.0 MASTER • 7 oktober 2026 • Opdrachtgever Sealcleaning • Uitvoerder Claude Code

Dit dossier is één complete bouwopdracht voor het verbeteren van de bestaande Sealcleaning website. Het combineert concurrentieonderzoek, fotografie, navigatie, conversie, echte interactieve 3D, aanvraagverwerking, prijsinformatie en toetsbare kwaliteitseisen. Behoud de bestaande premium identiteit en bouw daadwerkelijk in de repository.

**Gebruik:** geef dit hele bestand aan Claude Code met toegang tot de website repository. Alle hoofdstukken, tabellen en bijlagen horen bij dezelfde opdracht. Het dossier bevat voldoende beslisregels om zelfstandig door te werken. Externe gegevens die werkelijk ontbreken, krijgen een zichtbare status en een werkende fallback.

**Prioriteit bij conflict:** versie 2.0 is de nieuwste instructie. Hoofdstuk 35–50 en expliciete versie-2.0 wijzigingen overrulen oudere passages waar die botsen. Oudere onderzoeksfeiten en testbevindingen blijven bruikbaar zolang ze niet door nieuwere controle zijn achterhaald.

De professionele mentaliteit van een groot, ervaren hoveniersbedrijf is de kwaliteitsnorm. Dat is geen toestemming om 50 jaar ervaring, miljoenenomzet, certificaten, personeel, garanties of reviews als bedrijfsfeiten te presenteren. Het doel is aantoonbaar betere bruikbaarheid en aanvragen in Dordrecht. Een eerste positie in Google of marktdominantie kan niet worden gegarandeerd.

## 1 Opdracht en beslisregels

Je bent verantwoordelijk voor productkeuzes, frontend, 2D/3D, toegankelijkheid, SEO, privacy, calculatiearchitectuur, prijs- en productarchitectuur, aanvraag- en orderflows, offerte/factuurdocumenten, B2B-instroom, recruitmentvoorbereiding en regressietests. Werk met de zorgvuldigheid van een senior multidisciplinair team dat een belangrijk commercieel digitaal product oplevert.

- Voer verbeteringen uit in de bestanden. Stop niet bij advies, mockups of een plan.
- Inspecteer eerst bestaande code, assets, configuratie en repository instructies. Behoud bruikbare onderdelen en gebruikerswijzigingen.
- Echte 3D voor schuttingen én bestrating is verplicht in deze implementatie. Verlaag indien nodig grafische complexiteit; stel de functionele 3D scope niet uit.
- Combineer schutting en bestrating in één eenvoudige tuin scène. Alle schermen, 3D, prijsinformatie en aanvraag lezen dezelfde projectstate.
- Prijsinformatie mag nu worden toegevoegd op basis van controleerbare bronnen. Onderscheid leveranciersprijzen, marktbenchmarks, eigen verkoopprijzen en projectoffertes.
- Maak routinekeuzes zelfstandig. Vraag alleen om een werkelijk onmisbare ontbrekende toegang of een onomkeerbare wijziging die niet is geautoriseerd. Werk intussen door aan onafhankelijke onderdelen.
- Verander hosting, DNS, mailboxen, externe accounts of advertentiebudgetten niet als onderdeel van deze codeopdracht. Bereid een concrete, gecontroleerde release voor binnen de repository afspraken.
- Bij beperkte sessieruimte: leg voortgang vast in docs/IMPLEMENTATION_STATUS.md, inclusief werkende functies, tests en volgende commando’s. Dit dossier blijft de opdracht; vraag niet om een nieuwe prompt.
- Laat geen zichtbare dode knoppen, nepfunctionaliteit of onafgemaakte kernflow achter. Rapporteer een blokkade precies, zonder een ongeteste functie als gereed te markeren.

## 2 Onderzoeksbasis en beperkingen

Het openbare onderzoek is uitgevoerd op 7 oktober 2026. Acht directe en regionale hoveniers zijn vergeleken, aangevuld met configuratorspecialisten en leveranciers. De vergelijking betreft ontsloten pagina inhoud en herkenbare informatiearchitectuur. Er zijn geen gemeten snelheidsranglijsten, volledige mobiele audits of end to end tests van concurrenten uitgevoerd. Een niet waargenomen functie is geen bewijs dat zij nergens bestaat.

De actuele Sealcleaning repository en originele projectfoto’s waren bij het opstellen niet beschikbaar. Na de eerste versie is https://sealcleaning.nl/ wel rechtstreeks in een browser gecontroleerd: homepage, projectfilter, lightbox, contactformulier en de bestratingswizard tot aan de ingevulde contactpagina. De openbare onderzoekstool kon de site nog niet ophalen; dat is geen bewijs van een offline site. De bevindingen in hoofdstuk 32 zijn browserwaarnemingen. Bestandsstructuur, backendontvangst, alle dienstpagina’s, mobiel gedrag en broncode moeten tijdens uitvoering nog worden gecontroleerd.

Bronverwijzingen staan in hoofdstuk 30. Ze zijn onderdeel van het dossier. Controleer vluchtige productprijzen opnieuw tijdens uitvoering en registreer verschillen. Claims van concurrenten blijven claims op hun eigen websites; neem ze niet over als Sealcleaning bewijs.

## 3 Vergelijking van lokale en regionale hoveniers

| Bedrijf en bereik | Aangetroffen sterke aanpak | Kans voor Sealcleaning | Bron |
| --- | --- | --- | --- |
| Visser Tuinservice, Dordrecht en omgeving | Dienststructuur, veel benoemde tuincases met plaats, eigen projecten en Google reviewroute | Koppel een case direct aan een passende configuratie; laat de klant vanuit inspiratie een eigen ontwerp maken | S01 |
| De Biesbosch Gijsbers Groep, Dordrecht en Drechtsteden | Complete tuin als samenhangend plan; ontwerp, aanleg en onderhoud verbonden; expliciete trustinformatie | Toon die samenhang interactief en maak offerteonderdelen inzichtelijk; gebruik uitsluitend eigen bevestigd bewijs | S02 |
| Stam Hoveniers, Dordrecht en regio | Premium tuinvisie, ontwerp, impressies, showroom en materiaalpartners | Maak kwaliteit tastbaar met echte afwerkingsdetails en materiaalvergelijkingen die klanten zelf bedienen | S03 |
| Baan Hofman, Dordrecht | Brede disciplines, projecten en één aanspreekpunt, ook na oplevering | Maak het traject van wens tot onderhoud concreet en geef een klant een bruikbaar dossier mee | S04 |
| De Groene M, Dordrecht | Groen en infra, houtwerk, onderhoud en 3D ontwerp op aanvraag | Echte zelfbediening in 3D vóór de aanvraag; onderscheid dat van een 3D ontwerp dat het bedrijf later maakt | S05 |
| Drechtsteden Hoveniers, Dordrecht | Veel tuinonderdelen en zowel eenmalig als periodiek onderhoud | Begeleid de klant bij die breedte met korte dienstspecifieke vragen en relevante keuzes | S06 |
| Van der Elst Hoveniers, Drechtsteden | Grondwerk, bestrating en beplanting expliciet; regionale route en offerte CTA | Laat foto’s, gekozen onderdelen en technische aandachtspunten direct bij elkaar aansluiten | S07 |
| Zoon Hovenier, actief in Dordrecht | Familiebedrijf, klantverhalen en aparte onderhoudsopties | Verbind echte verhalen met vergelijkbare cases, herstelkeuzes en een onderhoudsaanvraag na aanleg | S08 |

Onze gevolgtrekking: mooie fotografie en een offerteknop zijn al gangbaar. Het sterkste onderscheid wordt de combinatie van echte cases, duidelijke keuzehulp, maatvaste 3D, transparante prijscomponenten en een complete aanvraag. Deze combinatie is onze productrichting, geen onderbouwde claim dat geen enkele concurrent haar aanbiedt.

| Aanvullend voorbeeld | Waargenomen patroon | Te gebruiken principe | Bron |
| --- | --- | --- | --- |
| Schutting Direct | Vormkeuze, materialen, poorten, services en overzicht in een gefaseerde aanvraag | Maak afhankelijkheden begrijpelijk en stuur de hele samenstelling mee | S09 |
| EvoWood | Secties in 3D selecteren, materiaalkeuze, draaien, delen en afbeelding downloaden in de interface | Maak de geometrie bewerkbaar en bied ontwerp export; verifieer onze uitvoering zelf | S10 |
| ForaVida | Configuratorpagina beschrijft 3D weergave en aanvullende opties | Toon opties meteen in het ontwerp wanneer ze ruimtelijk relevant zijn | S11 |
| HomingXL | Productgegevens, inspiratie en uitgesplitste montagekosten met voorwaarden | Scheid product, montage, vervoer en aanvullend werk in de prijsarchitectuur | S12 en S13 |
| Riet Poel Hoveniers, Rotterdam | Openbare richtprijzen met btw, actualisatiedatum, medewerkerbasis en afvoervoorwaarden | Maak onze prijsinformatie eveneens controleerbaar en leg verschillen in scope uit | S14 |

Kopieer geen teksten, foto’s, code, reviews, merkidentiteiten of ontwerpen van deze bedrijven. Gebruik patronen als onderzoeksmateriaal.

## 4 Meetbaar commercieel doel

Optimaliseer voor passende, complete aanvragen en winstgevende uitvoering. Pageviews en aantallen configuratorstarts zijn ondersteunende signalen.

Meet zodra toestemming en analytics zijn ingericht: afgeronde aanvragen per dienst, aandeel aanvragen met maten en foto’s, ontbrekende gegevens, contactvoorkeur, tijd van aanvraag tot persoonlijke reactie, offerteacceptatie en brutomarge per soort werk. Offerteacceptatie en marge vereisen bedrijfsgegevens en zijn geen browsermetrics.

Maak de beslisroute kort: zien wat Sealcleaning doet, bewijs bekijken, dienst kiezen, zelf ontwerpen of hulp kiezen, situatie aanvullen en aanvraag versturen. Geef bezoekers die niet willen ontwerpen ook een korte route met foto’s en omschrijving. Verplicht 3D niet om contact te kunnen opnemen.

Geen verzonnen schaarste, aftelklokken, automatische claim “binnen 5 minuten offerte”, kunstmatige badges of verplichte gegevens vóór de eerste preview. Geen popups die de gebruiker vroegtijdig onderbreken.

## 5 Repository onderzoek vóór wijzigen

Lees AGENTS.md en overige toepasselijke repository instructies. Controleer gitstatus, branch, deploymentproces, buildinstellingen en bestaande tests. Maak binnen de repository werkwijze een veilige featurebranch of geïsoleerde checkout. Behoud ongecommitte werk.

Inspecteer minimaal index.html, css/style.css, projecten/index.html, contact/index.html, schuttingen/index.html, bestrating/index.html, tuinaanleg/index.html, tuinrenovatie/index.html, werkwijze/index.html, werkgebied/index.html, js/config.js, js/main.js, js/wizard.js, js/wizard-prefill.js, js/lightbox.js, sitemap.xml, robots.txt, README.md en images/projects/. Controleer daarnaast alle dienstpagina’s, over ons, kennisbank, footer, privacy, 404 en eventuele form scripts.

Leg routes, bestaande wizardstate, hergebruikte componenten, contactgegevens, assets, claims, externe dependencies en terugkerende inconsistenties vast. Onderzoek de gemelde fout “Diensten verwijst naar /projecten/” in de actuele code en herstel alle voorkomens.

Behouden tenzij een concreet probleem verbetering vraagt: deep forest, sand en stone palette, Fraunces en Inter, echte fotografie, ruime editorial opbouw, responsive layout, skip link, focus states, reduced motion, canonicals, bestaande relevante structured data, WebP en mobiele contactmogelijkheden. Gooi de wizardlogica niet zonder onderzoek weg.

De site blijft geschikt voor de bestaande statische GitHub Pages omgeving. Een lokale build of generator mag, maar publiceer de gegenereerde statische bestanden met de correcte Pages configuratie. Introduceer geen frameworkmigratie zonder aantoonbare noodzaak. GitHub Pages voert geen eigen formulierbackend uit [S27].

## 6 Centrale gegevens en componenten

Organiseer gegevens bij voorkeur in data/projects.js, data/services.js, data/materials.js, data/fence-products.js, data/paving-products.js, data/price-sources.json en data/reviews.js. Gebruik stabiele IDs, geldige schema’s en één schrijfwijze per dienst. Bestaande architectuur mag andere namen krijgen als het resultaat even helder is.

Bedrijfsnaam, telefoon, WhatsApp, e-mail, KvK, btw nummer, werkgebied, domein en eventuele openingstijden komen uit één gecontroleerde businessconfig. Controleer tegen bestaande officiële gegevens; verzin ontbrekende waarden niet. De nieuwste door opdrachtgever aangeleverde bedrijfsset is hieronder leidend zolang een officiële controle haar niet tegenspreekt:

- Publieke handelsnaam: Sealcleaning Groenonderhoud en Aanleg; merknaam: Sealcleaning.
- KvK: 83078665. Dit nummer staat ook in de huidige repository. Verifieer in het actuele Handelsregister vóór definitieve juridische publicatie, maar vervang het niet op basis van oudere geheugeninformatie.
- Btw-id: NL003773849B79. Dit komt overeen met de huidige repository en de nieuwste gebruikersopgave; verifieer in de eigen administratie vóór officiële facturatie.
- Adres: Romboutslaan 582, 3312 KP Dordrecht. Het adres/postcodepaar bestaat; verifieer dat dit het juiste geregistreerde en openbaar te gebruiken ondernemingsadres is vóór webshop/contractgebruik.
- Publiek zakelijk telefoonnummer: +31 78 204 95 17, weer te geven als 078 204 95 17. Dit is de nieuwste door opdrachtgever bevestigde publieke bellijn en vervangt het oude zichtbare mobiele belnummer.
- WhatsApp: gebruik +31 6 48 87 19 86 (wa.me: 31648871986) alleen achter een WhatsApp-icoon/CTA en toon de cijferreeks nergens als zichtbare tekst. Een directe wa.me-link bevat technisch het nummer in de href en is dus niet geheim voor iemand die broncode inspecteert; beloof geen technische anonimiteit. Als echte afscherming gewenst is, is later een server-side redirect of officiële WhatsApp Business-integratie nodig.
- Huidige e-mail in de repository: sealcleaningaanleg@gmail.com. Gebruik een domeinmail zoals info@sealcleaning.nl pas wanneer die mailbox werkelijk bestaat en is getest. Bereid SPF/DKIM/DMARC en transactional-mail documentatie voor, maar wijzig DNS/mail niet zonder toestemming.

Publiceer geen privégegevens die niet functioneel of wettelijk nodig zijn en verzin geen showroom, IBAN, verzekeringsnummer, certificaat, garantie of openingstijd.

Modulaire code voor state, validatie, projectsummary, prijsregels, submission, analytics en 3D builders. Gebruik herbruikbare functies voor nummerformaten, maatconversie en tekstlabels. Houd een bestand bij voorkeur onder ongeveer 400 regels als dat logisch kan, maar maak geen kunstmatige versnippering.

Eén centrale state is leidend. Deriveer lengte, oppervlakte, materiaalindicatie en prijscomponenten; sla geen tweede, mogelijk verouderd totaal op. Camera en tijdelijke formulierinvoer zijn viewstate. Bestanden blijven in een aparte runtime opslag, gekoppeld met IDs aan het dossier.

## 7 Eigen fotografie volledig benutten

Maak eerst een visueel gecontroleerde inventaris van alle afbeeldingen: bestandsnaam, resolutie, oriëntatie, mogelijke case, zichtbaar onderwerp, kwaliteitsstatus, relevante diensten, privacy en bruikbare uitsnedes. Maak een contact sheet voor interne beoordeling en inspecteer de foto’s zelf. Bestandsnamen zijn aanwijzingen, geen sluitend bewijs.

Groepeer bijvoorbeeld schutting-grenen-zwarte-voet-1/2/3, schutting-horizontaal-lamellen-*, schutting-kastanje-paaltjes-dordrecht-1/2, terras-houtlook-kunstgras-pad-*, terras-kunstgras-zwart-plantenbak-* en waterzijde-tuin-* alleen als beeldinhoud en bestaande informatie de samenhang ondersteunen. Leg twijfel vast. Onzekere beelden mogen als algemene inspiratie met correcte omschrijving worden gebruikt, zonder verzonnen casegeschiedenis.

- Eén uitgevoerd werk is één case met meerdere beelden. Niet één case per foto.
- Eén case kan meerdere diensten bevatten. Gebruik primaryService én services[], bijvoorbeeld tuinaanleg plus bestrating en schutting.
- Geef een foto een rol: cover, totaalbeeld, afwerkingsdetail, aantoonbaar voor/tijdens/na of uitvoering. Bevestig de chronologie vóór labels of een voor en na slider.
- Kies per plaatsing een passende uitsnede en focal point. Een klein detailbeeld is geen geloofwaardige hero voor een volledige tuin.
- Toon op schuttingpagina’s schuttingcases en details van poort, palen en aansluitingen; op bestrating pagina’s terras, pad, kantopsluiting en afwerking; op onderhoud echte onderhoudsresultaten.
- Gebruik enkele sterke covers op de homepage. Laat niet dezelfde foto in iedere sectie terugkomen.
- Genereer benodigde responsive maten vanuit originele bestanden, behoud de originele bestanden en voorkom herhaald verlies door compressie.
- Stel width/height of aspect ratio in. Lazyload onder de vouw; hero krijgt passende prioriteit. Test srcset en sizes vanaf subroutes.
- Alt tekst beschrijft zichtbaar beeld. Geen SEO opsomming. Verberg decoratieve dubbele afbeeldingen correct voor assistieve technologie.
- Verwijder gevoelige EXIF locatiegegevens uit publieke afgeleiden. Beoordeel gezichten, kentekens, huisnummers en toestemming; publiceer geen volledige klantnamen of adressen zonder basis.

Maak een assetmanifest met koppeling naar cases en pagina’s, zodat een nieuw project later op één plek kan worden toegevoegd. Markeer een render van de configurator als visualisatie; meng hem niet tussen uitgevoerd werk zonder label.

## 8 Projecten als complete cases

Projectdatamodel: slug, title, primaryService, services[], location met verificatiestatus, coverImage, gallery[] met alt/focalPoint/stage, summary, situation, workDone[], materials[], duration, dimensions, tags[], featured, relatedServices[], evidence en publishStatus. Onbekende velden zijn null of ontbreken in de presentatie.

Projectkaart: grote cover, duidelijke naam, plaats indien bevestigd, dienst, twee tot vier inhoudelijke tags en “Bekijk project”. Geen fictieve locatie, duur, materiaalsoort of aantal projecten. Een houtlook tegel op een foto bewijst bijvoorbeeld niet dat het een bepaald keramisch merk is.

Filters: Alle, Tuinaanleg, Renovatie, Bestrating, Schuttingen, Onderhoud en Snoeiwerk. Filter op alle gekoppelde services, met aantallen en duidelijke actieve status. Maak leeg resultaat begrijpelijk met “Wis filters”. Filterstatus mag in de URL zonder persoonsgegevens en moet browser terug/vooruit ondersteunen.

Maak statische detailroutes /projecten/[slug]/ als de repository dit met een kleine generator kan dragen. Genereer ze vanuit dezelfde data; niet afzonderlijk handmatig dupliceren. Deze routes moeten direct openen en vernieuwen op GitHub Pages. Een JS router met wildcard fallback is daarvoor onvoldoende.

Een case toont cover, alleen de eigen fotogalerij, situatie, aantoonbare werkzaamheden, resultaat, bekende materialen/maten en locatie. Laat lege kopjes weg. Toon geschikte gerelateerde cases en “Heeft u een vergelijkbaar project? Stel uw project samen”. Prefill alleen onderbouwde voorkeuren en laat de bezoeker zijn eigen maten opgeven.

Een modal mag aanvullend snelle weergave bieden. Gebruik een toegankelijk dialog met label, focusbeheer, Escape, correcte terugkeerfocus en scroll lock zonder pagina sprong. Lightboxnavigatie blijft beperkt tot de geselecteerde case. Maak ook een gewone link naar de detailpagina beschikbaar.

Een voor en na vergelijking krijgt toetsenbordknoppen en tekstlabels. Bouw haar alleen als twee foto’s aantoonbaar dezelfde situatie vóór en na tonen. Vergelijk niet willekeurige tuinen.

## 9 Routes en navigatie

| Route | Hoofddoel | Primaire actie |
| --- | --- | --- |
| / | Diensten en eigen bewijs snel begrijpen | Stel uw project samen |
| /diensten/ | De juiste dienst kiezen | Dienst bekijken of direct starten |
| Bestaande afzonderlijke dienstpagina’s | Keuzehulp, bewijs, voorwaarden en prijscontext | Start met deze dienst |
| /projecten/ en /projecten/[slug]/ | Werk bekijken en een vergelijkbaar plan starten | Stel uw project samen |
| /project-samenstellen/ | Ontwerp en complete aanvraag | Project aanvragen |
| /werkwijze/ | Van intake tot oplevering begrijpen | Begin uw aanvraag |
| /over-ons/ en /werkgebied/ | Bedrijf en regio controleren | Contact of starten |
| /contact/ | Direct contact of korte aanvraag | Versturen of bewust kiezen voor WhatsApp |
| /prijzen/ | Onderbouwde prijscontext en inbegrepen werk | Eigen situatie samenstellen |
| /kennisbank/ | Antwoorden op echte klantvragen | Relevante dienst of configurator |
| /privacy/ en /404.html | Privacyinformatie en routeherstel | Passende vervolglink |
| /materialen/ | Materiaalkeuze, pakketten en gecontroleerde prijscontext | Ontwerp koppelen of materiaal aanvragen |
| /voor-aannemers/ | B2B samenwerking, onderaanneming, VvE/zakelijk | Project of capaciteit aanvragen |
| /werken-met-ons/ | Vakmensen, zzp'ers en toekomstige medewerkers | Interesse / beschikbaarheid doorgeven |

Hoofdnavigatie: Home, Diensten, Projecten, Werkwijze, Over ons, Werkgebied en Contact. Maak “Stel uw project samen” de duidelijke CTA. Plaats Prijzen als secundaire link bij Diensten en in footer; voorkom een overvolle desktopbalk.

Een diensten dropdown ondersteunt toetsenbord en touch. De link naar het overzicht moet ook zelfstandig bruikbaar blijven. Toon actieve route, aria-current, duidelijke submenu status en een sluitknop op mobiel. Een enorme megamenu is pas nuttig als de inhoud het rechtvaardigt.

Behoud bestaande URL’s zoveel mogelijk. Maak bij verplaatsing een routekaart en beschikbare redirects; een canonical is geen redirect. Corrigeer alle interne links en relatieve paden. Ondersteun een projectrepo preview met basePath, los van het SEO hoofddomein.

## 10 Design en interactieve patronen

Het ontwerp blijft rustig, premium en bouwkundig helder. Echte fotografie, typografie, ritme, maatvoering en afwerking dragen het merk. Werk met herbruikbare spacing, kleur, type, button en form tokens.

| Inhoud of keuze | Geschikt patroon | Gedrag |
| --- | --- | --- |
| Eén dienst, vorm, hoogte of materiaal | Radio opties of compacte visuele keuzegroepen | Eén actieve keuze, tekstlabel, goede focus |
| Meerdere tuinwensen | Checkboxes met duidelijke labels | Meerdere keuzes, geen impliciete betaalde toevoegingen |
| Ondergrond of bereikbaarheid onbekend | Ja, nee, onbekend of korte select | Onbekend blijft een geldige waarde |
| Meer technische informatie | Details en summary of toegankelijk accordion | Basiskeuze blijft zichtbaar; samenvatting noemt gekozen waarde |
| Materiaalsoorten vergelijken | Tabel met gelijke criteria | Mobiel eigen scrollcontainer of leesbare rijen |
| Case kiezen | Foto en korte editorial tekst | Klik opent uitsluitend die case |
| Live projectoverzicht | Beschrijvingslijst en gegroepeerde regels | Wijzigen link gaat naar juiste stap |
| Fout of verzendstatus | Inline tekst plus statusregion | Niet alleen kleur of toast |
| Extra terrasvlak of poort | Herhaalbare benoemde sectie | Toevoegen, bewerken en verwijderen met heldere grenzen |

Gebruik consistente lijniconen met dezelfde stroke en optische maat. Labels blijven aanwezig; een onbekend icoon is geen uitleg. Geen emoji als hoofdiconografie, glassmorphism, decoratieve gradients of ontelbare afgeronde kaarten.

Maak details van materiaal, uitvoering, wat inbegrepen is en veelgestelde vragen inklapbaar. Plaats belangrijke prijsbeperkingen, fouten en geselecteerde opties nooit uitsluitend in een gesloten blok. Geen automatische sprong naar een volgende stap na een keuze.

Materialen vergelijken op uitstraling, onderhoud, privacy/doorkijk, toepassingsmogelijkheden, prijsbasis en geverifieerde productspecificaties. Gebruik vinkjes alleen voor concrete ondersteunde eigenschappen. Geen willekeurige scores of universele “beste keuze”. “Meest gekozen” alleen op basis van eigen meetgegevens.

## 11 Homepage en dienstpagina’s

Homepage hero vermeldt duidelijk tuinaanleg, renovatie, bestrating, schuttingen en onderhoud in Dordrecht en het bevestigde werkgebied. Voorbeeldrichting: “Uw tuinproject in Dordrecht begint met een goed plan”. Primaire CTA “Stel uw project samen”, secundair “Bekijk onze projecten”, subtiel telefoon/WhatsApp. Geen zware 3D scene of automatisch afgespeelde video in de hero.

Volgorde: hero, compacte dienstkeuze, enkele sterke cases, uitleg over zelf ontwerpen of advies, duidelijke werkwijze, materiaalkeuze of vergelijking, werkgebied, echte trustinformatie indien beschikbaar, enkele relevante FAQ’s en afsluitende CTA. Pas lengte aan inhoud aan; geen lege secties vullen.

De dienstenpagina omvat Tuinonderhoud, Tuinaanleg, Tuinrenovatie, Bestrating, Schuttingen, Snoeiwerk en Periodiek onderhoud. Kunstgras/gazon kan als dienst of onderdeel worden gekoppeld afhankelijk van de huidige website. Overige bevestigde diensten blijven behouden en krijgen een logische plaats.

Dienstpagina’s beantwoorden: voor welke situaties, welke opties, relevante cases, materiaalverschillen, kostenfactoren, inbegrepen versus extra werk, praktische voorbereiding, werkwijze en aanvraag. Maak herstel/ophogen/hergebruik zichtbaar naast volledige vervanging wanneer Sealcleaning dat aanbiedt. Gebruik geen probleemtaal die automatisch de duurste optie stuurt.

Voeg een korte keuzehulp toe bij schuttingen en bestrating. Laat de configurator direct met die dienst starten. Bij tuinaanleg of renovatie wordt een onderdelenlijst geopend. Onderhoud, snoeiwerk en periodiek onderhoud krijgen een korte intake zonder overbodige maatstappen.

Voor zakelijke klanten en VvE’s: conditionele keuze particulier/zakelijk, terreinoppervlak, onderhoudsfrequentie, bereikbaarheid, factuurwensen en contactpersoon. Geen apart portal of abonnementcontract dat online automatisch wordt afgesloten.

Reviewscomponent leest uit een leeg of geverifieerd databestand met bron, datum, toestemming/rechten en eventueel originele link. Publiceer geen placeholder review of fictieve totaalscore. Voeg geen eigen LocalBusiness sterrenmarkup toe om Google reviewsterren af te dwingen; daarvoor gelden beperkingen op reviews over het eigen bedrijf [S25].

## 12 Centrale configurator en korte aanvraagroute

Begin met “Wat wilt u laten uitvoeren?”: Complete tuinaanleg, Tuinrenovatie, Bestrating, Schutting, Tuinonderhoud, Snoeiwerk, Kunstgras/gazon, Periodiek onderhoud en Anders. Laat combineren toe zonder bestaande onderdelen te wissen.

Algemene route: dienst → ontwerpen of wensen → bestaande situatie en uitvoering → locatie/foto’s/planning → overzicht en contact → bewust versturen. Toon stapnaam, afgeronde stappen en voortgang op basis van de werkelijk benodigde route.

3D diensten starten met een bruikbaar voorbeeldontwerp vóór contactgegevens. Benoem voorbeeldmaten en maak wijzigen eenvoudig. Een voorbeeld is nooit een gerealiseerde klantcase. Bied “Ik weet de maten nog niet” en “Liever hulp bij mijn project”; die route levert een bruikbare intake met maatstatus onbekend.

Behoud state bij teruggaan, wijzigen, sluiten van een accordion en interne navigatie. Sla standaard alleen niet persoonlijke ontwerpkeuzes tijdelijk op. Persoonsgegevens en ruwe foto’s blijven in geheugen totdat bewust wordt verzonden. Bewaren op dit apparaat gebeurt expliciet, met verwijderoptie en ontwerpvervaltermijn, bijvoorbeeld 30 dagen als productkeuze.

Wanneer een dienstwisseling bestaande elementen beïnvloedt, leg uit wat er gebeurt en bied behouden als gecombineerd project of bewust verwijderen. Back/forward, reset, refreshherstel van niet persoonlijke keuzes en meerdere tabbladen mogen geen verborgen gegevensverlies veroorzaken.

Validation gebeurt per stap en bij verzending. Focus de eerste fout, toon een korte foutlijst met links, behoud invoer en gebruik begrijpelijke meldingen. Geef foutieve maatvelden niet stilzwijgend een minimumwaarde. Bewaar een tijdelijk lege tekstinvoer los van de laatst geldige geometrie.

De korte aanvraagroute vraagt dienst, omschrijving, postcode/plaats, foto’s optioneel en naam plus één bereikbaar contactkanaal. Geen verplicht account, adres vóór de preview of marketingtoestemming als voorwaarde voor een offerte.

## 13 Schuttingconfigurator

Vormen: I, L links, L rechts, U en meerdere losse delen. Definieer links/rechts vanuit één benoemd bovenaanzicht. Elk deel heeft een stabiel ID, beginpunt, richting en lengte. Zijde A/B/C blijft herkenbaar in formulier, labels, 3D en dossier.

Maten worden intern opgeslagen als gehele millimeters. Laat invoer als meter met decimale komma of punt toe en bied waar nuttig aparte meter/centimetervelden die dezelfde waarde aanpassen. Vermeld wat de gemeten lengte inhoudt. Onderscheid lijnlengte, palen en vrije poortopening; de preview mag geen onbedoelde extra meters toevoegen.

Hoogtes 100, 120, 150, 180 en 200 cm zijn generieke visualisatieopties. Bij officiële systemen toon alleen ondersteunde varianten. Definieer hoogte boven lokaal maaiveld; bij hout beton is totale hoogte inclusief onderplaat, niet schermhoogte plus onzichtbaar extra beton. Een 180 cm scherm met 26 cm onderplaat is niet zonder meer een 180 cm complete schutting.

Generieke systemen: volledig hout, hout beton, composiet, horizontale lamellen en gaas/hekwerk. Materiaalpresets: naturel/donker hout, antraciet composiet, grijs/antraciet beton. Noem ze generieke visualisaties totdat een werkelijk product is geselecteerd. Gaas krijgt geloofwaardige transparantie of lichte draadgeometrie; geen massieve muur met ander label.

Palen en panelen komen uit de systeemconfig: nominale schermbreedte, paaldikte, montageafstand, onderplaat en passtukregels. Voor een generieke preview mag bijvoorbeeld 180 cm nominale schermbreedte als expliciete aanname worden gebruikt, zonder dit als universele standaard te claimen. Dedupliceer gedeelde hoekpalen. Geometrie moet de ingevoerde lijn afsluiten; passtukken worden zichtbaar en benoemd.

Poorten zijn zichtbaar, met vrije breedte, hoogte, zijde, afstand vanaf het aangeduide beginpunt, scharnierkant en draairichting. Bied aantal toevoegen/verwijderen en meerdere poorten. Definieer vrije opening apart van blad en palen. Trek poortopeningen af van gesloten schermvakken. Geen dubbel paneel achter de poort en geen dubbele paal op dezelfde knoop.

Controleer dat iedere poort plus benodigde systeemruimte binnen de zijde past, poorten niet overlappen en plaatsing bij hoeken mogelijk is. Bij niet kloppende invoer: behoud het laatste geldige model, toon fout en laat corrigeren. Toon desgewenst een open/dicht preview, met een herkenbare opening; draaiing is geen constructieve goedkeuring.

Projectvragen: bestaande schutting, verwijderen, afvoer, materiaal zelf leveren of laten adviseren/leveren, ondergrond aarde/bestrating/beton/onbekend, hoogteverschil, bereikbaarheid, breedte achterom, obstakels/wortels, gedeelde erfgrens/burenoverleg, wensen, postcode, plaats, planning, foto’s en eigen schets. Een onbekende ondergrond blijft onbekend in prijs en dossier.

Live overzicht: vorm, zijden, totale lijnlengte inclusief openingen, gesloten schuttinglengte, hoogtes, systeem, kleuren, poorten en uitvoering. Leg de twee lengtes kort uit. Automatische aantallen zijn voorlopig materiaaladvies zolang inmeting en systeemgegevens niet definitief zijn.

Plaats geen algemene belofte “vergunningsvrij tot 2 meter”. Locatie, erfpositie en regels vragen controle. Bied een contextlink naar de actuele gemeente/Omgevingsloket informatie als die tijdens implementatie is geverifieerd. Geef de klant geen automatische juridische goedkeuring.

## 14 Bestratingsconfigurator

Toepassing: terras, pad, oprit, parkeerplaats of anders. Vraag lengte en breedte, meerdere rechthoekige vlakken, positie en oriëntatie. Bereken oppervlak per vlak en totaal. Toon het verschil tussen geometrisch oppervlak en te bestellen materiaal inclusief snijverlies.

Formaten minimaal 20 × 30, 30 × 30, 40 × 40, 60 × 60, 60 × 30 en 80 × 80 cm als generieke maten. Productkeuze kan extra formaten toevoegen. Bij officiële producten gebruik werkelijke afmetingen, nominale modulemaat en voegbreedte afzonderlijk.

Legpatronen: recht en halfsteens. Ondersteun richting 0/90 graden waar zinvol. Een patroonwijziging moet zichtbaar zijn in het raster. Voeg wildverband of visgraat pas toe wanneer geometrie, compatibiliteit en hoeveelheden correct zijn geïmplementeerd; laat geen nepoptie zien.

Materiaal/kleur: generiek beton, keramiek of klinkeruitstraling met lichtgrijs, grijs, antraciet, beige, bruin of roodbruin. Toon echte productnaam alleen na broncontrole. Een kleur maakt een tegel niet geschikt voor een oprit. Producteigenschappen en legmethode bepalen de toepasbaarheid; onbekende geschiktheid vraagt beoordeling.

Preview heeft echte gewijzigde verhoudingen en individuele of instanced tegels met voegen. Snijd randtegels op de begrenzing; geen uitstekende rasterstukken of halfsteens dat buiten het terras doorgaat. Snijstukken zijn geen volwaardige extra m². Legpatroon en materiaalstaat delen dezelfde layoutlogica.

Bij meerdere vlakken: controleer overlap. Kies eerst een robuuste regel “vlakken mogen elkaar niet overlappen”; markeer overlap en blokkeer dubbeltelling. Voeg pas een oppervlakte union toe als die daadwerkelijk is getest. Een naastgelegen terras en pad delen eventueel een rand, zonder overlapoppervlak.

Vraag: bestaande bestrating, behouden/hergebruiken/verwijderen, afvoer, huidige ondergrond, ophogen ja/nee/onbekend, hoogteverschil, wateroverlast, gewenste afwatering/drainage, kantopsluiting/opsluitbanden, materiaalkeuze en levering, voegafwerking, toegang en achterombreedte, planning en foto’s. Bekende gewenste afschotrichting mag worden aangegeven; geef geen universele funderingsdikte of technisch legadvies als automatische uitvoeringsspecificatie.

Tel opsluitbanden alleen langs werkelijk gekozen grenzen; niet standaard de gehele rechthoekomtrek als een rand al tegen een geschikte constructie aansluit. Maak hoekstukken, aansluitingen en regenwaterwensen zichtbaar als onderdelen voor beoordeling.

## 15 Complete tuin en overige diensten

Bouw een instelbaar tuinvlak met lengte/breedte, een herkenbare huiszijde, eenvoudig nulpunt en grenzen. Schutting en bestrating moeten in dezelfde schaal zichtbaar zijn. Laat elementen via getalsvelden plaatsen; optioneel aanvullend slepen met raster/snapping en altijd een alternatief zonder drag.

Breid dit tuinmodel uit met een maatvaste 2D-plankaart die dezelfde state gebruikt als de 3D-scène. De gebruiker kan starten met rechthoek, L-vorm, U-vorm of vrije polygooncontour. Iedere zijde/punt krijgt stabiele IDs en maatvelden; bereken de werkelijke oppervlakte met polygon area. Wanneer alleen “80 m²” bekend is zonder vorm, registreer areaKnown=true en geometryKnown=false; verzin geen 10 × 8 meter als echte tuin. Bied dan een duidelijk schematisch voorbeeld dat niet als ingemeten situatie wordt gepresenteerd.

Ondersteun bestaande elementen als afzonderlijke objecten met status existing-keep, existing-remove of new. Minimaal: bestaande poort, schutting, muur/gevel, schuur/berging, boom/stronk, haag/heg, terras/bestrating, gazon, border en een vrij obstakel. Bestaande te behouden objecten kunnen worden vergrendeld en tellen niet als nieuw materiaal/montage, maar beïnvloeden geometrie, vrije ruimte en aansluitingen. Een bestaande poort kan dus tussen twee nieuwe schuttingdelen blijven staan. Nieuwe schuttingsecties mogen aan beide zijden aansluiten zonder dat de poort als nieuw product wordt geprijsd.

Maak ook een echte verwijder-/slooplaag: oude schutting, tegels/klinkers, graszoden, kunstgras, struiken/heggen, bomen/stronken, wortels, grond/zand, puin, groenafval, meubels/objecten en “onbekende rommel/overig”. Vraag aantal, strekkende meter, m², m³ of foto waar zinvol. Laat onbekende hoeveelheden onbekend en zet opname/controle in plaats van een verzonnen afvalprijs.

Verplicht voor de eerste complete tuin: tuinvlak, één of meer schuttingdelen, poorten, één of meer bestratingsvlakken en controle op buiten de tuin geplaatste elementen. Maak origin, oriëntatie en “links/rechts” overal consistent. Afmetingen en materiaalkeuzes komen uit dezelfde gespecialiseerde configurators.

Voeg eenvoudige schematische vlakken toe voor gazon/kunstgras, borders en grind en een eenvoudig volume voor plantenbakken als ze betrouwbaar binnen deze architectuur kunnen worden verwerkt. Tuinpad is een benoemd bestratingsvlak. Andere onderdelen krijgen nu een echte wensenlijst en dossierregel, zonder te doen alsof verlichting of pergola al volledig configureerbaar is.

Tuinaanleg/renovatie onderdelen: terras, tuinpad, schutting, kunstgras, gazon, borders, beplanting, grind, plantenbakken, verlichting, drainage, verwijderen bestaande tuin, grondwerk en overige wensen. Vraag globale maten, te behouden elementen, stijl strak/modern, groen/natuurlijk, onderhoudsarm, landelijk of nog niet bepaald. Vraag waar relevant zon/schaduw, gebruik door kinderen/huisdieren, gewenste groenbalans, toegankelijkheid en budgetvoorkeur met “weet ik nog niet”.

Onderhoud/snoeiwerk: tuinoppervlak indien bekend, werkzaamheden, type en hoeveelheid groen, haaglengte/hoogte indien bekend, eenmalig of periodiek, achterstallig onderhoud, afvoer, toegang, gewenste periode en foto’s. Risicovolle boomwerkzaamheden of onbekende boomconditie leveren een opnamevraag, geen vaste online prijs of automatische kaptoezegging.

Kunstgras/gazon: oppervlak, huidig terrein, verwijderen, bodemvoorbereiding, drainage, materiaal zelf leveren, huisdieren/gebruiksvoorkeur en onderhoud. Periodiek onderhoud: frequentievoorkeur, werkzaamheden, seizoenen, particulier/zakelijk en terrein. Een voorkeur voor vier of zes bezoeken is nog geen afgesloten onderhoudsovereenkomst.

## 16 3D techniek en bediening

Gebruik een vastgezette onderhouden Three.js versie, met overeenkomende OrbitControls uit dezelfde versie. Installeer via de bestaande build of vendor noodzakelijke modules lokaal met licentievermelding. Vermijd ongepinde CDN imports en afhankelijkheid van externe producttextures. Raadpleeg actuele officiële documentatie [S20 tot S22].

Recente WebGLRenderer gebruikt WebGL2; detecteer ondersteuning, rendererfouten en context loss [S20]. Op ondersteunde apparaten werkt echte roterende 3D. Zonder WebGL2 blijft de configurator volledig bruikbaar met een exacte 2D/SVG preview en alle dossierkeuzes. Die fallback mag de verplichte 3D op ondersteunde apparaten niet vervangen.

Gebruik modules voor scene lifecycle, camera, materiaalpresets, fence builder, paving builder, maatlabels en screenshot. Geometry/materialen worden hergebruikt. Gebruik InstancedMesh voor repeterende tegels/planken wanneer passend [S22]. Geef alle afhankelijke graphics en eventhandlers een expliciete opruimroute; verwijder niet een materiaal dat nog door een andere mesh wordt gedeeld.

Render op wijzigingen en camera interactie. Gebruik tijdelijke requestAnimationFrame tijdens controls/damping of animatie en stop zodra de scene stil is. Pauzeer bij verborgen tab of niet zichtbare viewer. Beperk device pixel ratio, begin bijvoorbeeld met maximaal 1,5 op mobiel en 2 op desktop en pas aan op gemeten prestaties.

Laat draaien, zoomen en camera reset werken. Bied 3D, bovenaanzicht en vooraanzicht met tekstknoppen. Configureer min/max afstand en grondgrenzen. Houd camera zo veel mogelijk vast bij materiaalwijziging. Bij forse maatwijziging kan “Alles in beeld” bewust kaderen; automatisch herframen mag een 5 meter en 15 meter schutting niet onbegrijpelijk even groot laten lijken. Toon een vaste maatgrid en maatlabels.

Mobiel: gewone pagina scrollt buiten de actieve viewer. Bied zo nodig een expliciete “3D bedienen” stand met “Terug naar formulier”. Scope touch action tot het actieve canvas. Geen sitebrede blokkade van pinch zoom of scrolling. Toetsenbordknoppen voor view reset, draaien en zoomen maken het ontwerp ook zonder muis begrijpelijk.

Maatlabels tonen zijden, hoogte waar bruikbaar, terraslengte/breedte en m². HTML overlays hebben heldere posities en botsen niet met knoppen. Eén korte aria-live samenvatting na een invoerwijziging, geen continue aankondiging van iedere cameraframe.

Maak “Bewaar ontwerp als afbeelding” via een render op het exportmoment en canvas.toBlob. Houd preserveDrawingBuffer niet standaard aan alleen voor export. Een canvasfoto bevat HTML maatlabels niet vanzelf: voeg die via een aparte 2D compositingstap toe of vermeld maten in een bijgevoegde samenvatting. Test export op ondersteunde browsers. Cross origin textures kunnen export blokkeren; gebruik eigen/licentieerbare assets en correcte CORS [S23].

Screenshot krijgt neutrale achtergrond, beschrijvende bestandsnaam en visualisatielabel. Bewaar een Blob/File referentie; zet geen zware base64foto in algemene state, URL of localStorage. Revoke tijdelijke object URLs na gebruik. Publiceer geen screenshot automatisch.

Iedere officiële export uit de configurator (PNG, print/PDF-samenvatting en social-share image) krijgt een subtiele vaste Sealcleaning-brandinglaag: logo/woordmerk, sealcleaning.nl, “Ontworpen met Sealcleaning” en optioneel project-ID/QR naar een niet-persoonlijke deelroute. Branding staat in een nette onderrand/hoek en bedekt het ontwerp niet. Een browser- of telefoonscreenshot buiten onze export is niet te voorkomen; misbruik wordt niet bestreden door normale bezoekers te hinderen. Laat high-resolution bulkexport of white-label/embedfunctionaliteit niet openbaar beschikbaar zijn.

## 17 Ontwerp bewaren en vergelijken

Laat maximaal drie ontwerpvarianten lokaal vergelijken, bijvoorbeeld hout beton versus composiet of beton versus keramiek. Variant bevat ontwerpkeuzes en toepasselijke prijscomponenten; kopieer geen persoonsgegevens mee.

“Dupliceer ontwerp” maakt een nieuw ontwerp ID. “Wijzig variant” beïnvloedt alleen die variant. Vergelijk in een tabel maten, materiaal, onderhoudskenmerken indien onderbouwd, opties en prijsstatus. Toon geen verschilbedrag wanneer één variant onbekende kosten bevat.

Export: niet persoonlijk ontwerp JSON, PNG en printbare samenvatting. Import: schema/versionvalidatie, lengte en bestandlimieten, veilige tekstverwerking, geldige IDs, geen uitvoerbare strings en geen arbitraire externe texture URL’s. Oude ontwerpen behouden hun inhoud via een migratie of krijgen een duidelijke melding.

Een openbare deellink mag uitsluitend niet persoonlijke configuratie bevatten, met lengtebeperking en expliciete deelactie. Een eigen download/upload route is voldoende wanneer een betrouwbare linkservice ontbreekt. Geen cloudopslag of login fingeren.

## 18 Projectobject en versiebeheer

Gebruik een gedocumenteerd schema. Onderstaande structuur is richtinggevend; definieer alle eenheden en referenties expliciet in code.

```json
{
  "schemaVersion": 1,
  "projectId": "generated-uuid",
  "projectType": "combined",
  "services": ["fence", "paving"],
  "sourceCaseId": null,
  "garden": {"widthMm": 10000, "depthMm": 6000},
  "fence": {
    "shape": "L-left",
    "systemId": "generic-wood-concrete",
    "heightMm": 1800,
    "materialPresetId": "natural-wood-grey-concrete",
    "sections": [
      {"id": "A", "start": {"xMm": 0, "zMm": 0}, "directionDeg": 0, "lengthMm": 8400},
      {"id": "B", "start": {"xMm": 8400, "zMm": 0}, "directionDeg": 90, "lengthMm": 4200}
    ],
    "gates": [
      {"id": "G1", "sectionId": "A", "offsetMm": 2000, "clearWidthMm": 1000, "heightMm": 1800, "hingeSide": "left", "swing": "inward"}
    ]
  },
  "paving": {
    "areas": [{"id": "P1", "lengthMm": 6000, "widthMm": 4000, "position": {"xMm": 0, "zMm": 0}, "rotationDeg": 0}],
    "productId": null,
    "nominalTileLengthMm": 600,
    "nominalTileWidthMm": 600,
    "pattern": "straight",
    "colorPresetId": "light-grey"
  },
  "options": {"materialSupply": "advice-needed"},
  "removal": {"existingFence": true, "removeFence": true, "disposal": "unknown"},
  "access": {"surface": "unknown", "rearPassageWidthMm": null},
  "location": {"postalCode": null, "city": null},
  "schedule": {"preferredPeriod": null, "flexible": true},
  "photos": [],
  "notes": "",
  "customer": {"name": null, "email": null, "phone": null, "preferredChannel": null}
}
```

Dit voorbeeld gebruikt een tuin van 10 bij 6 meter, met richting 0 langs de x as en richting 90 langs de z as. Valideer altijd posities, grenzen en onderlinge aansluitingen in de echte app; voorbeeldwaarden worden nooit blind als klantontwerp overgenomen.

Voeg waar nodig propertyDetails, maintenance, planting, attachments en consentStatus toe. Leg views/camera buiten dit domeinobject. Derived summary en estimate hebben eigen versienummer en verwijzen naar project en pricebook version. Leg vast welke prijsdata bij een verzonden aanvraag gold.

Foto’s[] bevatten alleen metadata en runtime bestandsreferentie of later een veilige server ID. Project JSON moet stringify/parse roundtrip ondersteunen zonder Three.js objecten, DOM nodes, File of Blob intern op te nemen. Voorlopige IDs zijn voorbeeldwaarden; genereer werkelijke IDs.

## 19 Onderzochte prijsinformatie

Onderstaande waarden zijn openbaar aangetroffen referenties, geen bindende Sealcleaning tarieven. “Onderzocht op 7 oktober 2026” betekent niet dat iedere bron zijn prijslijst op die datum heeft vernieuwd. Productprijzen kunnen per hoeveelheid, vestiging, levering en moment verschillen.

| Onderdeel | Aangetroffen prijsbasis | Scope en beperking | Bron |
| --- | --- | --- | --- |
| EXCLUTON Terrastegel Plus schelpkalk 60 × 60 × 4 cm | €8,85 per stuk; bron noemt €24,58/m² | Materiaal, btw inbegrepen, verzending extra; vanaf 28 stuks €8,40/stuk | S15 |
| EXCLUTON Keramische tuintegel Madrid 60 × 60 × 2 cm | €12,50 per stuk; €34,72/m² in bron | Materiaal, btw inbegrepen, verzending extra; vanaf 60 stuks €11,85/stuk | S15 |
| FLAIRSTONE Garden moon 60 × 60 × 2 cm | €13,95 per stuk; €38,75/m² | Materiaal, btw inbegrepen, verzending extra; vanaf 64 stuks €13,25/stuk | S15 |
| EXCLUTON Opsluitband antraciet 100 × 15 × 5 cm | €2,80 per stuk en per meter | Materiaal, btw inbegrepen, verzending extra; hoeveelheidkorting apart | S16 |
| EXCLUTON Opsluitband grijs 100 × 15 × 5 cm | €2,30 per stuk en per meter | Materiaal, btw inbegrepen, verzending extra | S16 |
| Elephant Finch grenen scherm 180 × 180 × 4,7 cm | €79 per stuk | SKU 007237; alleen scherm, palen/beton/beslag/montage/levering apart; btw basis opnieuw bevestigen | S13 |
| Graszoden Premium siergras | €3,39/m² | Btw inbegrepen, levering extra; bestellen in rollen van 1 m², minimaal 30 m² | S17 |
| GARDEN PLACE Nancy 30, 200 cm breed | €11,95/m²; €23,90 per strekkende meter | Materiaal, btw inbegrepen, levering extra; rolbreedte beïnvloedt snijverlies | S18 |
| GARDEN PLACE Dela 35, 200 cm breed | €19,95/m²; €39,90 per strekkende meter | Materiaal, btw inbegrepen, levering extra; geen compleet gelegd gazon | S18 |
| Lichte trilplaat huren | Vanaf €33/dag excl. btw; rekenkundig €39,93 incl. 21% | Algemene Boels vanafprijs; concrete machine, verzekering en extra kosten controleren | S19 |
| 6 m³ bouw en sloopafval container | Vanaf €405 incl. btw | Openbare vanafprijs; locatie, afvalvoorwaarden, plaatsing en vergunning controleren | S28 |
| 6 m³ schoon puin container | Vanaf €202 incl. btw | Geen gemengd tuin of grondafval; acceptatievoorwaarden controleren | S28 |
| 6 m³ tuin en plantsoenafval container | Vanaf €238 incl. btw | Alleen toegestane afvalstroom | S28 |
| 6 m³ schone grond container | Vanaf €475 incl. btw | Grondkwaliteit, gewicht en regio controleren; andere pagina/snippet gaf afwijkende vanafprijs | S28 |
| HomingXL schermmontage | Vanaf €46 per scherm | Btw inbegrepen, materiaal/reiskosten extra; gepubliceerde peildatum oktober 2025 | S12 |
| HomingXL paal plaatsen | Vanaf €49 per paal | Zelfde oude prijsbasis; geen complete schuttingprijs | S12 |
| HomingXL poort plaatsen | Vanaf €219 per poort | Btw inbegrepen, materiaal/reiskosten extra; minimumklus €99, reis vanaf €45/dag | S12 |
| Riet Poel regulier medewerkeruurtarief | €55–€65 incl. btw | Per medewerker; hun scope en afvoerregels; pagina vermeldt september 2026 | S14 |
| Riet Poel onderhoudsbeurt | Eenmalig €150–€400; periodiek €120–€280 | Hun richtprijzen incl. btw; regulier groenafval volgens eigen voorwaarden inbegrepen | S14 |
| Riet Poel boomsnoei | Klein onder 4 m €150–€300; 4–8 m €300–€600 | Referentie van die uitvoerder, geen tarief op alleen boomhoogte voor Sealcleaning | S14 |
| Hovenier Hoofddorp compleet terras | Vanaf €80/m² | Bron noemt grondwerk, ondergrond en bestrating; minimum en exacte toepassing niet vastgesteld | S29 |
| Hovenier Hoofddorp complete tuin | Indicatie €100–€200/m² | Contextuele bronindicatie, geen lokale gemiddelde marktprijs en geen optelpost naast alle onderdelen | S29 |
| Limberger hout beton grenen | Vanaf €145 per meter incl. montage | Genoemde standaardhoogte 2 m; btw, reis, poort, afvoer en volledige scope niet bevestigd | S30 |
| Limberger hout beton Douglas | Vanaf €160 per meter incl. montage | Zelfde beperkingen; niet gebruiken als volledig vergelijkbare Sealcleaning offerte | S30 |
| Schutting Direct Red Class | €120 per meter incl. montage op productpagina | Btw en extra werkzaamheden niet voldoende bevestigd; uitsluitend benchmark | S31 |

Gebruik bij tegels de stukprijs als basis voor bestellen. De bronwaarde per m² is afgerond en mag niet alsnog afrondingsverschillen veroorzaken. De korte naam Garden moon in de tabel verwijst naar het volledige officiële product op S15; neem een volledige officiële naam alleen over na actuele controle.

Voor beplanting, zand per levering, voegen, composiet systemen, vlonders, pergola’s, tuinverlichting, reiniging en complexe boomzorg is in dit dossier geen universele, voldoende afgebakende verkoopprijs vastgesteld. Onderzoek bij implementatie echte actuele product of uitvoerdersbronnen voor de daadwerkelijk aangeboden onderdelen. Als prijs of scope ontbreekt, zet die regel op onbekend; sla onderzoek en uitkomst op. Gebruik geen willekeurig bedrag om de engine compleet te laten lijken.

## 20 Prijsboek en rekenregels

Prijsinformatie is nu onderdeel van de website. Bouw drie onderscheiden niveaus: openbare materiaalreferentie, indicatieve marktcontext en een eigen projectraming wanneer Sealcleaning regels voldoende compleet zijn. Een bindende projectofferte volgt uit gecontroleerde inmeting en calculatie.

Elke prijsregel bevat id, product/service ID, sourceType, sourceUrl, observedAt, sourceEffectiveDate, currency, unit, amountCents of rangeCents, vatRate of null, vatIncluded, quantityTiers, minimumQuantity, scopeIncluded[], scopeExcluded[], region, assumptions[], status en reviewAfter. Bedrijfsregels krijgen daarnaast arbeidsbasis, materiaalopslag, kosten, margedoel en expliciete herkomst. Zet zakelijke kostprijzen en marges nooit in een publiek client bestand.

Importeer de onderzochte waarden als gedateerde referentiedata. Beschouw de oude HomingXL montagecijfers en waarden met onbekende btw/scope niet als actuele automatische verkoopregel. Een redelijke interne hercontroletermijn, bijvoorbeeld 30 dagen voor producten en 90 dagen voor marktbenchmarks, is een bedrijfsinstelling, geen wettelijke regel.

Reken intern in eurocenten en millimeters. Gebruik decimale/vaste precisie voor aantallen en oppervlak en één vastgelegde afrondingsmethode voor btw. Toon consumentenprijzen inclusief btw waar vastgesteld. De Belastingdienst noemt 21% voor aanleg en onderhoud, maar 9% voor meegeleverde sierteeltproducten; maak btw per regel mogelijk en controleer classificatie [S26]. Geen 21% over iedere mogelijke levering blind toepassen.

Materiaalhoeveelheden houden rekening met hele verpakkingen, passtukken, rolbreedte, minimumafname, voegbreedte en expliciet snijverlies. Een generiek percentage snijverlies is een schattingsinstelling met label, geen garantie. Een visueel gesneden tegel kan niet automatisch opnieuw worden benut in een ander vlak zonder geteste zaagplanning.

Arbeid: onderscheid uren per medewerker, ploeguren en dagen. Twee mensen acht uur is zestien medewerkeruren. Bereken alleen wanneer productiviteit of urenonderbouwing bekend is. Neem niet zomaar een concurrentuurtarief als eigen winstgevend tarief over. Het eigen tarief moet inkoop/inhuur, reistijd, voorbereiding, gereedschap, verzekering, herstelrisico en overhead dekken.

Een complete raming bevat materiaal, arbeid, voorbereiding/grondwerk, verwijdering, afvalstroom, huur, vervoer/levering, eventuele aansluitingen, belastingen en duidelijk benoemde onzekerheden. Verwijder dubbelgetelde posten: inclusief montage plus losse montage, all in terras plus nogmaals tegels en zand, compleet tuinbudget plus alle onderdelen, of groenafvoer die al in een beurt zit.

Prijsstatus is één van complete-indication, partial-indication, on-request of stale. Bij onbekende onderdelen toon “Bekende materiaalindicatie” met bedrag, en daarnaast wat nog moet worden beoordeeld. Toon nooit een gedeeltelijke subtotaal als projecttotaal of ontbrekende waarden als €0. Een benchmark met “vanaf” is geen maximum en vormt op zichzelf geen betrouwbare totaalbandbreedte.

Voorbeeldberekening zonder hoeveelheidkorting: terras 6 × 4 m = 24 m². Met expliciete voorlopige 5% snijreserve en nominale 0,36 m² per tegel: ceil(24 × 1,05 / 0,36) = 70 tegels. Bij €13,95/stuk is de bekende tegelcomponent €976,50 incl. btw. Montage, ondergrond, voegwerk, afvoer en levering ontbreken; dus geen totaalprojectprijs. Dit is een rekenvoorbeeld, geen exact legplan. Een actuele gecontroleerde hoeveelheidkorting kan de materiaalcomponent wijzigen.

Maak /prijzen/ met bronnen/peildatum, duidelijke kostendrivers, voorbeeldcomponenten en link naar configurator. Geef marktbenchmarks een bronlabel; presenteer ze niet als “onze tarieven”. Laat geen schijnprecies totaal van €x,xx zien waar de ondergrond onbekend is. Onderbouwde volledige indicaties mogen met een transparante bandbreedte en aannames verschijnen.

Als actuele eigen tariefdata ontbreekt, hoeft de klant zijn ontwerp of aanvraag niet uit te stellen. De flow toont “Prijs wordt na controle van uw samenstelling berekend”, met bekende prijscomponenten waar passend. Dit vervangt de eerdere blanket instructie om helemaal geen prijsinformatie toe te voegen.

## 21 Productcatalogus en materiaalkeuze

Per product: id, manufacturer, collection, officialName, sku/productCode, category, material, color, finish, nominalDimensionsMm, actualDimensionsMm, thicknessMm, modulePitchMm, mountingRules, compatibleSystems, supportedUseCases, packaging, image, texture, sourceUrl, verifiedAt, licenseStatus, active en priceRefId.

Maak generieke visualisatiepresets in een ander gegevensbestand dan officiële producten. Een preset krijgt geen fictieve fabrikant of SKU. Officiële productspecificaties kunnen de preview voeden, maar een schematische visualisatie is geen kleurvaste materiaalsample. Vermeld dat echte kleur en uitstraling kunnen afwijken.

Leg compatibiliteit vast voor palen/schermen/onderplaten/beslag en poorten, ondersteunde hoogtes, opritgeschiktheid en patronen. Productproperties die onbekend zijn blijven null. Voeg geen onbewezen levensduur, onderhoudsvrijheid, FSC status of garantie toe aan een algemene categorie op basis van één product.

Gebruik leverancierfoto’s/textures alleen met passende rechten. Begin anders met eigen materiaalbeelden en procedurele presets. Lokale catalogusimport en validatie zijn voldoende; voeg geen onbetrouwbare browser scraping of API sleutels toe. Documenteer product en prijs bijwerken zodat later geen redesign nodig is.

## 22 Leesbaar dossier voor klant en Sealcleaning

Eindoverzicht “Uw project” toont dienst(en), ontwerp, maten, materiaalvoorkeur, uitvoeringsopties, verwijderen/afvoer, bereikbaarheid, postcode/plaats, planning, opmerkingen, foto aantal en prijsstatus. Geef per groep een “Wijzigen” knop naar de juiste stap.

De klant kan printen naar PDF met browserfunctionaliteit. Gebruik print CSS: leesbare tekst, maten, bron/peildatum van indicatie en visualisatie, zonder navigatie of lege canvas. Maak een vóór print beschikbare snapshot, met tekstfallback als capture niet lukt. Geen grote PDF library alleen voor hetzelfde resultaat.

Sealcleaning ontvangt dezelfde inhoud gestructureerd plus een menselijke samenvatting. Voeg project ID, schema versie, datum, gekozen prijsboek versie en interne beoordelingspunten toe. De samenvatting moet onbekende waarden benoemen in plaats van ze te verbergen.

Maak voorbereiding voor een intakechecklist: inmeten, bodem/hoogte, materiaalkeuze, toegang, afvalstroom, levering, buren/erfgrens waar relevant, planning en offerteonderdelen. Dit is een controlelijst in het dossier, geen automatisch goedgekeurd uitvoeringsplan.

Na echte ontvangst: duidelijk wat is verstuurd, aanvraagreferentie indien server die teruggeeft en de volgende stap zonder verzonnen reactietermijn. Een lokaal project ID is niet hetzelfde als een bevestigde serverontvangst.

## 23 Werkelijke formulierarchitectuur

Centraliseer formEndpoint, formEnabled, allowedEndpointOrigins, adapter, supportsFiles, maxFiles, maxFileBytes, maxTotalBytes en responseMapping. Geen geheimen in statische JS. Ondersteun een eigen API/serverless of een later gekozen formprovider. Kies niet stilzwijgend een betaald abonnement.

Zonder geconfigureerd endpoint: toon bewust gekozen WhatsApp, e-mail, tekst kopiëren en dossier downloaden. Zeg helder dat WhatsApp of de mailapp wordt geopend en dat de klant daar zelf moet verzenden. Toon nooit “aanvraag ontvangen” op basis van mailto of een wa.me klik.

WhatsApp/mailto hebben geen betrouwbare mogelijkheid om lokale File attachments automatisch te versturen. Voeg foto’s niet als nepbijlage toe en stuur geen enorme base64 URL. Geef instructie om foto’s in de geopende app zelf toe te voegen. Verstuur alleen bewust geselecteerde informatie na de knopactie; geen persoonsgegevens in interne site querystrings.

Met endpoint: valideer lokaal en serverzijde, zet loading/disabled state, voorkom herhaalde clicks, gebruik fetch met timeout/AbortController en toegankelijke statusregion. Controleer werkelijk succes volgens adaptercontract, niet alleen iedere response als succes. Toon op fout invoer en bestanden nog aanwezig. Bij timeout kan de server al ontvangen hebben; bied een gecontroleerde retry met dezelfde submission ID als backend idempotency ondersteunt.

Gebruik een payload snapshot van de geldige state op het verzendmoment. Een netwerkverzoek leest niet halverwege veranderende state. Een submission ID identificeert één poging inclusief veilige retry. Een nieuwe gewijzigde aanvraag krijgt een nieuwe submission ID. Backends moeten rate limiting, validatie en idempotency daadwerkelijk implementeren; een honeypot alleen is onvoldoende.

Honeypot buiten de gewone tabroute en begrijpelijk voor assistieve technologie. Geen automatische CAPTCHA dependency zonder behoefte. Endpoint whitelist en CORS controleren. Stel Content-Type bij FormData niet zelf in; de browser maakt de boundary. JSON zonder bestanden en multipart met bestanden worden per adapter ondersteund.

Uploads: meerdere foto’s, schets optioneel, preview, verwijderen en duidelijke aantallen/grootte. Ondersteun mobiele fotokeuze en een aparte camera actie; dwing niet één capture route af die galerijselectie blokkeert. HEIC/HEIF kan niet op ieder apparaat worden voorvertoond of omgezet: toon een duidelijke melding, laat verwijderen of veilige originele overdracht toe als de provider dit ondersteunt.

Clientlimieten moeten bij de provider passen. Zonder provider is een productinstelling zoals maximaal 8 foto’s van 10 MB met 30 MB totaal slechts een lokale bovengrens. Compressie is optioneel en moet resolutie, oriëntatie en foutafhandeling correct houden. Server valideert inhoud, type, grootte, bewaartermijn en toegang. Bestandsnamen en teksten worden veilig weergegeven; geen innerHTML van gebruikersinput.

Maak endpoint integratiedocumentatie met payload voorbeeld, response voorbeelden en configuratieplek. Houd live verzending uit automatische tests tenzij een gecontroleerd testendpoint is toegestaan. Mocktests bewijzen de UI, niet werkelijke e-mailbezorging. Test een echte ingestelde provider apart van ontvangst tot bereikbare melding.

## 24 Privacy en vertrouwen

Vraag alleen noodzakelijke contactgegevens. Maak naam plus één bereikbaar kanaal verplicht; adres/huisnummer alleen als de intake dat daadwerkelijk nodig heeft. Planning en budget zijn voorkeuren. Geen persoonlijke gegevens, foto’s of exacte adressen in analytics, URL, console of fouttelemetrie.

Toon bij verzending een korte uitleg over gebruik voor projectbeoordeling en een link naar een actuele privacyverklaring. Verplicht geen marketingcheckbox. Een privacyverklaring lezen is geen universele toestemming voor alle verwerking. Bepaal gegevensverwerking, bewaartermijnen en providerafspraken op basis van het werkelijke proces; verzin geen juridische zekerheid.

Functionele ontwerpstate en tracking zijn verschillend. Laad Google/Meta tracking niet vóór geldige toestemming wanneer die vereist is. Maak weigeren en later aanpassen duidelijk; de site en configurator blijven werken. Een banner die alleen “door verder te gaan gaat u akkoord” zegt, is geen geschikte toestemming voor tracking [S24]. Plaats geen lege cookiebanner als er geen toestemmingsplichtige technologie actief is.

Publiceer uitsluitend bevestigde bedrijfsfeiten. Gratis bezichtiging, garantie, materiaaltransparantie, betaling na oplevering en responstijd worden alleen als concrete voorwaarden getoond als ze werkelijk gelden. Bied geen btwvrije “contantprijs” als verkoopoptie; betaalmethode verandert niet automatisch de fiscale behandeling.

Materiaal zelf inkopen, alleen advies, levering via Sealcleaning, alleen montage en materiaal + montage zijn afzonderlijke commerciële routes met uitleg over verantwoordelijkheid, prijs, levering en garantie. Dit voorkomt verwarring over inbegrepen materialen en service. Sealcleaning mag materiaal met een redelijke, marktconforme marge doorverkopen zodra de interne inkoop-, logistiek-, btw- en prijsregels uit hoofdstuk 38 betrouwbaar zijn ingericht. Nazorg en onderhoud mogen als aanvraagoptie worden aangeboden zonder fictief contract of garantie.

## 25 SEO en lokale vindbaarheid

Gebruik het beoogde hoofddomein https://sealcleaning.nl/ voor production canonical, Open Graph, structured data en sitemap. Maak basePath/publicAssetBase apart voor previewassets. Canonical op productie mag niet verwijzen naar een developmentserver of GitHub Pages repo URL.

Unieke title, beschrijving, H1 en heldere headinghierarchie per nuttige pagina. Natuurlijke zoekintentie: schutting plaatsen Dordrecht, bestrating Dordrecht, tuinaanleg Dordrecht en tuinonderhoud Dordrecht. Geen keyword stuffing en geen tientallen dunne gekopieerde wijk/plaatsroutes.

Werkgebiedpagina noemt alleen werkelijke plaatsen en koppelt bevestigde lokale cases waar beschikbaar. Maak locatiepagina’s alleen met eigen unieke informatie en relevante ervaring. Geen privéadres van klanten, verzonnen lokale vestigingen of wijkclaims uit een generieke foto.

Behoud/verifieer LocalBusiness of passende concrete subtype, Organization en stabiele @id verwijzingen. Gegevens moeten overeenkomen met zichtbare bedrijfsinformatie. Gebruik geldige afbeelding/logo/contact en werkelijk bevestigd adres waar passend. Zonder vereist publiek adres: claim geen lokale rich result geschiktheid; test schema en houd persoonlijke adresgegevens beschermd [S21a].

Voeg BreadcrumbList toe aan dienst/case/kennisbankroutes met werkelijk bestaande links [S21b]. Gebruik een passende WebPage/CreativeWork presentatie voor cases; forceer geen nep Product/Offer of reviewrating. FAQ inhoud kan nuttig zijn, maar beloof geen FAQ rich results.

Sitemap bevat alleen indexeerbare canonieke routes. robots.txt is geen beveiliging en een crawlblokkade is niet hetzelfde als noindex. Beoordeel noindex voor bedank en persoonlijke conceptpagina’s; ontwerpqueryvarianten mogen geen duizenden indexeerbare duplicaten vormen. Gebruik HTML noindex waar passend, met respect voor hoe zoekmachines die moeten kunnen ophalen.

Kennisbank: lever drie werkelijk bruikbare artikelen op, bijvoorbeeld schutting opmeten, bestratingoppervlak berekenen en hout beton versus composiet vergelijken. Gebruik eigen tekeningen, relevante cases, duidelijke bron/actualisatiedatum en alleen gecontroleerde technische claims. Kostenartikel kan verwijzen naar /prijzen/. Geen massaproductie van dunne artikelen.

Controleer favicon, OG fallback, image alt, interne links, 404 en echte case detailinhoud. Geen automatisch gewijzigd lastmod bij iedere build als inhoud niet veranderde. Maak een checklist voor Google Search Console, sitemap indienen en Business Profile website URL; externe accounts worden niet stilzwijgend gewijzigd.

## 26 Analytics en advertentievoorbereiding

Maak een veilige track(name, properties) facade. Standaard staat externe analytics uit. Publiceer desgewenst lokale CustomEvents; push alleen naar dataLayer wanneer expliciet ingesteld en toegestaan. Foutloze afwezigheid van GTM of analytics is vereist.

Events: click_call, click_whatsapp, configurator_start, configurator_service_selected, configurator_step_completed, configurator_complete, quote_form_start, quote_form_submit en project_view. Voeg indien nuttig configurator_error, estimate_view, design_export en lead_delivery_error toe zonder persoonsgegevens.

Definieer configurator_complete als een afgeronde, gevalideerde samenstelling. quote_form_submit betekent bevestigde ontvangst door het endpoint. Een fallbackklik of verzendpoging krijgt een aparte status/event en telt niet als ontvangen lead. Dedupeer echte succesvolle conversies.

Gebruik alleen niet persoonlijke parameters: dienst ID, stap, case ID, aantal onderdelen en prijsstatus. Telefoonnummers, namen, foto’s, opmerkingen en postcode horen niet in de eventpayload. Ga voorzichtig om met URL/UTM opslag; whitelist marketingparameters, filter lengte en lees ze niet als HTML.

Dienstpagina’s werken als zelfstandige landingspagina’s voor Google en Meta. Behoud duidelijke navigatie en snelle korte aanvraag. Maak geen tientallen identieke advertentiepagina’s of betaalde campagnes binnen deze bouwopdracht. Laat commerciële evaluatie later sturen op echte passende leads en marge.

## 27 Performance en toegankelijkheid

Doel voor echte gebruikersmetingen: LCP maximaal 2,5 seconden, INP maximaal 200 milliseconden en CLS maximaal 0,1, beoordeeld volgens de actuele Core Web Vitals context op het 75e percentiel [S22a]. Een Lighthouse score op een laptop is geen bewijs dat deze velddoelen al zijn gehaald.

Laad de 3D engine alleen voor de configurator en pas na benodigde selectie/viewportinteractie waar passend. Geen 3D bundle op alle dienstpagina’s. Gebruik fontsubsets/woff2, font display en gerichte preload. Geen zware slider, externe reviewwidget of videobackground zonder functionele noodzaak.

Stel meetbare startbudgetten vast en controleer de uiteindelijke output: gewone pagina JS bij voorkeur onder 80 KiB gzip, additionele 3D code bij voorkeur onder 350 KiB gzip, heroafbeelding passend bij viewport en geen texturepakketten van tientallen MB. Dit zijn engineeringbudgetten voor dit project, geen universele feiten. Rapporteer noodzakelijke afwijkingen met meting en reden.

Voor de 3D viewer: geen permanente renderloop in rust, bounded pixel ratio, geen geometriegeheugenlekken bij herhaald wijzigen, resize zonder vervorming en een zichtbaar laad/foutscherm zonder layout shift. Respons op een keuze bij voorkeur binnen 200 ms op het gekozen testapparaat na laden. Begrens instanceaantal en gebruik grotere rasters schematisch wanneer nodig met duidelijke status; verander nooit stilzwijgend de werkelijke maat of berekende oppervlakte.

Volg WCAG 2.2 AA als doel en controleer werkelijk relevante criteria [S22b]. Semantische HTML, fieldset/legend, labels, tekstuele fouten, headinghiërarchie, focus-visible, skip link, aria-expanded/pressed, contrast en toetsenbordroute. Grote bedieningsvlakken bij voorkeur 44 × 44 CSS px als ontwerpnorm; kleur is niet de enige selectie-indicatie.

3D canvas heeft naam, instructies en equivalente maat/keuze informatie in HTML. Canvas zelf is geen toegankelijke beschrijving van een ontwerp. Drag acties krijgen getalsvelden of knoppen als alternatief. Dialogs, gallery en vergelijking ondersteunen Escape en focusherstel. Gebruik reduced motion zonder noodzakelijke informatie te verwijderen.

Een sticky CTA/contactbar bedekt geen veld, fout, cookiekeuze of browser safe area. Test landscape, on screen toetsenbord en zoom. Responsive tabellen krijgen een eigen begrijpelijke scrollcontainer; de hele pagina mag niet horizontaal schuiven.

## 28 Testmatrix en acceptatie

Voer betekenisvolle unitchecks uit voor rekenlogica, validatie, state en export, plus browser tests voor gebruikersflows. Gebruik bestaande testtools of een kleine passende setup. Tests die alleen dezelfde implementatie herhalen zijn onvoldoende. Netwerkcalls in tests gaan naar mocks of toegestaan testendpoint.

| Test | Invoer of actie | Vereist resultaat |
| --- | --- | --- |
| Schuttingmaten | I van 5 m naar 15 m | Geometrie en labels veranderen; vaste grid verklaart schaal |
| Decimale invoer | 8,40 en 8.40 | Beide leveren 8400 mm; geen factor honderd fout |
| L vorm | A 8,40 m en B 4,20 m | Totale lijnlengte 12,60 m en één gedeelde hoek |
| Poortlengte | Openingen totaal 1 m bij 12,60 m lijn | Gesloten segmentlengte 11,60 m; poort zichtbaar |
| Poort past niet | Poort + systeemruimte overschrijdt zijde | Begrijpelijke fout; geen overlap of negatieve panelen |
| Meerdere poorten | Twee overlappende offsets | Validatie blokkeert overlap zonder stateverlies |
| Vormwijziging | U naar I met poort op verdwenen zijde | Expliciete correctie of behoud als losse zijde, geen stille orphan |
| Hoogte | 180 naar 120 cm | Geometrie en overzicht volgen definitie van totale hoogte |
| Materialen | Hout naar composiet/gaas | Werkelijke zichtbare wijziging met correct label |
| Terrasoppervlak | 6 × 4 m | 24 m² in UI, JSON, print en aanvraag |
| Verhoudingen | 3 × 3 versus 8 × 4 | Verschillende echte verhoudingen |
| Tegelformaat | 60 × 60 naar 30 × 30 | Ander raster, geen alleen tekstwijziging |
| Legverband | Recht naar halfsteens | Zichtbare verspringing en afgesneden randstukken |
| Meerdere vlakken | 24 en 6 m² zonder overlap | 30 m²; elk vlak apart te wijzigen |
| Overlap | Terrasvlakken deels boven elkaar | Geen dubbelgeteld totaal; heldere fout volgens gekozen regel |
| Tuinscene | Tuin 10 × 6, terras 5 × 3,5 en schutting | Gemeenschappelijke schaal; positie en grenscontrole werken |
| Terug en wijzigen | Stap 5 terug naar stap 2 | Keuzes/foto’s tijdens deze sessie behouden |
| Reset | Bewust nieuwe aanvraag starten | Ontwerp en tijdelijke gegevens werkelijk verwijderd |
| Ontwerpimport | Export/import plus ongeldige JSON | Geldige roundtrip; ongeldige structuur veilig geweigerd |
| Variant | Kopie maken en materiaal wijzigen | Origineel blijft gelijk; eigen ID’s en juiste vergelijking |
| Tegelcomponent | 70 × €13,95 zonder korting | €976,50; label materiaalcomponent, geen projecttotaal |
| Onbekende kosten | Ondergrond en montage onbekend | Onbekend of partial; geen €0 en geen complete prijs |
| Btw en minimum | Gemengde regels en gras 10 m² | Regel btw correct; 30 m² minimum zichtbaar, geen stil besteltotaal |
| Verouderde bron | reviewAfter verlopen | Stale status; automatische complete raming geblokkeerd |
| Submission | Dubbele click, timeout, 4xx, 5xx, success | Correcte status, data behouden, geen valse succesmelding |
| Bestanden | Too large, meerdere, verwijderen, HEIC | Limieten/uitleg correct; geen verdwenen attachment |
| Fallback | Geen endpoint ingesteld | Bewuste WhatsApp/mail/download; geen ontvangstclaim |
| Geen WebGL2 | Simuleer rendererfalen | Formulier + 2D + dossier blijven bruikbaar |
| Viewer lifecycle | 30 maatwisselingen en verwijderen | Geen oplopende ongebruikte meshes/listeners; geen rustloop |
| Export | PNG en browser print | Ontwerp/maten zichtbaar; geen blanco canvas |
| Case gallery | Open schuttingcase | Uitsluitend eigen foto’s; keyboard en Escape werken |
| Projectfilters | Iedere categorie en leeg resultaat | Juiste cases, status en reset; gecombineerde case vindbaar |
| Routes | Direct openen en refresh van iedere detailroute | Geen 404 door ontbrekende statische bestandroute |
| Privacy | Inspecteer requests, URL en console | Geen contactgegevens/foto’s in analytics of interne URL |
| Toestemming | Tracking uit, weigeren, later toestaan | Hele site werkt; tracking volgt echte instelling |

Controleer gewijzigde pagina’s op 360, 390, 430, 768, 1024 en 1440 px. Test minimaal een mobiel formaat volledig, alle kritieke breedtes op overflow, en desktop. Doe browser engine controle in Chromium, Firefox en WebKit waar beschikbaar; leg echte apparaatbeperkingen vast. Emulatie is geen claim van een fysieke iPhone test.

Controleer console errors, netwerkfouten, kapotte afbeeldingen, interne links, relatieve paden, tabvolgorde, focus, formulierlabels, mobiele toetsenbordbediening, reduced motion, 200% zoom en printlayout. Check bestaande wizardprefill en sticky contact op regressies. Meet performance met vastgelegde throttling/apparaatcondities.

## 29 Uitvoering release en oplevering

Werk in samenhangende stappen met een voortdurend bruikbare site. Eerste stap: inventaris en broncontrole. Daarna cases/beeldmanifest, diensten/navigatie, state en modulaire wizard, 3D schutting, 3D bestrating, combinatie tuin, samenvatting/export/varianten, prijsboek, submission/fallback, SEO/analytics/privacy en verificatie. Bouw per stap door tot de volledige opdracht gereed is.

Maak geen fase twee voor verplichte 3D. Geavanceerde AR, fotorealistische reconstructie van één tuinfoto, volledig autonoom AI-tuinontwerp en volledige technische constructiecalculatie blijven buiten de verplichte kern. Materiaalverkoop, winkelmand/order-intentie, B2B-instroom, offerte-/factuurarchitectuur en veilige backendgrenzen zijn vanaf deze versie wél onderdeel van de opdracht. Een daadwerkelijke online betaling, klantaccount of boekhoudkoppeling wordt alleen live geactiveerd wanneer een echte beveiligde provider/backend, juridische informatie en end-to-end test beschikbaar zijn; anders blijft er een eerlijke werkende bestel-/offerteaanvraag zonder nepcheckout.

Launchchecklist: DNS apex/www, GitHub Pages custom domain, HTTPS en redirectrichting, production canonical, OG/schema, sitemap/robots, Search Console, sitemap aanmelden, Business Profile URL, aanvraagtest, endpoint ontvangst, telefoon/WhatsApp, 404, detailroutes, mobiel, consent en rollback. Verifieer wat werkelijk toegankelijk is. CNAME wijzigen alleen wanneer domeinkoppeling en DNS status dat rechtvaardigen; een eerdere HTTPS fout is geen bewijs dat de koppeling nu gereed is.

GitHub Pages kan niet zelf een API ontvangen. Een provider of serverless endpoint blijft externe infrastructuur; documenteer precies wat ontbreekt. Een endpoint toevoegen omvat CORS, bestandslimieten, notificatiebestemming en echte ontvangsttest. Geen API key in README of frontend. Verplaats hosting niet alleen om 3D mogelijk te maken.

Documenteer in README: lokaal draaien/bouwen, deploymentpad, nieuw project toevoegen, foto’s verwerken, catalogus en prijzen vernieuwen, wizard schema, analytics configureren, formulieradapter, privacyinstellingen en tests. Voeg docs/SOURCE_REGISTER.md, docs/ACCEPTANCE_REPORT.md en docs/IMPLEMENTATION_STATUS.md toe. Een source register noteert ook conflicts en niet gevonden prijzen.

Oplevering bevat concrete gewijzigde bestanden, korte uitleg van gedrag, uitgevoerde tests met resultaat en bekende beperkingen. Onderscheid passed, failed en blocked. Geef geen “alles getest” zonder bewijs. Publicatie volgt bestaande autorisatie en repository afspraken; laat een reviewbare wijziging en rollbackmogelijkheid achter.

Externe TODO’s mogen alleen werkelijk ontbrekende gegevens betreffen: endpoint/toegang, geverifieerde bedrijfsvoorwaarden, rechten/toestemming bij foto’s/reviews, definitieve product/inkoopgegevens, arbeidskostregels en gecontroleerde domeinstatus. Laat zulke TODO’s werkende kernfeatures niet blokkeren als een nette fallback mogelijk is.

De eerstvolgende commerciële investering na deze release is een werkelijke aanvraagontvanger met volledige dossieroverdracht en betrouwbare opvolging, als die nog ontbreekt. Zodra ontvangst werkt, stuur verbeteringen op gemeten kwaliteit en offerteacceptatie van aanvragen, niet op steeds meer grafische effecten.

## 30 Bronnenregister

Alle onderstaande pagina’s zijn onderzocht op 7 oktober 2026. URL’s kunnen later inhoud of prijzen wijzigen. Een niet bevestigde prijs krijgt geen automatische verkoopstatus. Concurrentclaims zijn niet onafhankelijk gecertificeerd.

- [S01 Visser Tuinservice](https://vissertuinservice.nl/) — diensten, benoemde cases en reviewroute.
- [S02 De Biesbosch Gijsbers Groep](https://debiesboschgijsbersgroep.nl/tuinaanleg/) — complete aanleg en trustpresentatie.
- [S03 Stam Hoveniers](https://www.stamhoveniers.nl/) — tuinvisie, ontwerp, showroom en impressies.
- [S04 Baan Hofman](https://www.hoveniersbedrijfbaanhofman.nl/) — disciplines, projecten en aanspreekpunt.
- [S05 De Groene M](https://www.degroenem.nl/) — dienstverlening en 3D ontwerp op aanvraag.
- [S06 Drechtsteden Hoveniers](https://www.drechtstedenhoveniers.nl/) — onderdelen en onderhoud.
- [S07 Van der Elst Hoveniers](https://www.vanderelsthoveniers.nl/tuinaanleg/) — aanleg en regionale structuur.
- [S08 Zoon Hovenier](https://zoonhovenier.nl/werkgebied/hovenier-dordrecht/) — Dordrechtpagina en traject.
- [S09 Schutting Direct configurator](https://www.schutting-direct.nl/configurator) — vormen, materialen, poorten en intake.
- [S10 EvoWood configurator](https://www.evo-wood.com/schutting-configurator.html) — interface voor 3D secties, delen en export.
- [S11 ForaVida configurator](https://www.foravida.nl/configurator) — beschrijving van 3D en opties.
- [S12 HomingXL montage](https://homingxl.nl/schutting-laten-plaatsen/) — prijsbasis en gepubliceerde peildatum oktober 2025.
- [S13 HomingXL scherm](https://homingxl.nl/elephant-schutting-grenen-finch-recht-15l-rvs-groen-geimpregneerd-180x180cm-schermdikte-4-7-cm/) — prijs en SKU van het genoemde paneel.
- [S14 Riet Poel prijsinformatie](https://rietpoelhoveniers.nl/prijzen) — eigen richtprijzen en scope, update september 2026.
- [S15 HORNBACH tegelassortiment](https://www.hornbach.nl/c/tuin/sierbestrating/tuintegels/S4991/) — gecontroleerde stuk en m² prijzen. Een afzonderlijke productpagina gaf beperkte inhoud; de categoriepagina leverde de genoemde waarden.
- [S16 HORNBACH kantopsluiting](https://www.hornbach.nl/c/tuin/sierbestrating/opsluitbanden/S4993/) — materiaalprijzen per stuk/meter.
- [S17 HORNBACH graszoden](https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/graszoden/S5199/) — prijs, rol en minimumafname.
- [S18 HORNBACH kunstgras](https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/kunstgras/S4904/) — materiaalprijzen en rolbreedtes.
- [S19 Boels verdichting](https://www.boels.com/nl-nl/huren/grondverzet/verdichting/c/rf0bi1if) — algemene huur vanafprijs.
- [S20 Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) — WebGL2 en renderer API.
- [S21 Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html) — camera controls.
- [S22 Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) — herhaalde geometrie.
- [S21a Google lokale bedrijfsgegevens](https://developers.google.com/search/docs/appearance/structured-data/local-business) — actuele voorwaarden voor LocalBusiness.
- [S21b Google breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — breadcrumb structured data.
- [S22a web.dev Web Vitals](https://web.dev/articles/vitals) — doelen en beoordeling van Core Web Vitals.
- [S22b W3C WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/) — toegankelijkheidscriteria.
- [S23 MDN canvas export](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) — export en origin beperkingen.
- [S24 Autoriteit Persoonsgegevens cookieinformatie](https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners) — zoekresultaatinformatie over geldige trackingtoestemming; directe pagina was niet ontsloten. Controleer de actuele pagina tijdens uitvoering.
- [S25 Google reviews](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) — beperkingen bij reviews over het eigen bedrijf.
- [S26 Belastingdienst sierteelt en hoveniers](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_9_btw/sierteeltproducten/) — 21% aanleg/onderhoud en 9% sierteeltlevering.
- [S27 GitHub Pages uitleg](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) — statische hosting.
- [S28 Afval.nl tariefoverzicht](https://www.afval.nl/tarieven/) — gebruikte container vanafprijzen. Gebruik het uitgewerkte actuele overzicht boven conflicterende zoeksnippets.
- [S29 Hovenier Hoofddorp kosteninformatie](https://www.hovenier-hoofddorp.nl/kennisbank/hovenier-kosten/) — eigen/contextuele terras en tuinrichtprijzen, update 7 augustus 2026.
- [S30 Limberger schuttingen](https://www.limbergerbouwservice.nl/schuttingen/) — montagebenchmarks, onvolledige btw/extrascope.
- [S31 Schutting Direct Red Class](https://www.schutting-direct.nl/schuttingen/red-class/) — gepubliceerde meterprijs incl. montage, aanvullende scope te verifiëren.
- [S32 Sealcleaning homepage](https://sealcleaning.nl/) — rechtstreeks bekeken in de browser; bestaande stijl, navigatie, foto's en wizard.
- [S33 Sealcleaning projecten](https://sealcleaning.nl/projecten/) — rechtstreeks getest: schuttingfilter, project openen, volgende foto en sluiten.
- [S34 Sealcleaning contact](https://sealcleaning.nl/contact/) — rechtstreeks bekeken; wizardprefill gecontroleerd, geen aanvraag verzonden.
- [S35 Claude Code kostengebruik](https://code.claude.com/docs/en/costs) — officiële uitleg over gebruik, contextbeheer, compaction en modelkeuze; controleer ondersteuning in de geïnstalleerde versie.

## 31 Onafhankelijke eindcontrole van het dossier en de uitvoering

Voer vóór oplevering een afzonderlijke kritische review uit na de implementatie. Toets dit dossier regel voor regel aan gewijzigde code en rapportage. Als de omgeving een reviewtool of afzonderlijke reviewer heeft, gebruik die binnen beschikbare toestemming; afwezigheid daarvan is geen reden om eigen controle over te slaan.

Zoek specifiek naar strijdige instructies: 3D uitstellen, fictieve officiële namen, dubbele state, dubbele meters, ongeldige poorten, dubbelgetelde vlakken, verouderde prijzen, onbekende btw, gedeeltelijke prijs als totaal, fallback als ontvangen aanvraag en SEO claims zonder bewijs.

Controleer dat elke zichtbare optie invloed heeft op ontwerp of dossier en dat elk dossieronderdeel de verzendpayload bereikt. Controleer dat al het verplichte werk is uitgevoerd of met een concrete echte blokkade is benoemd. Een professionele oplevering is volledig toetsbaar; geen enkele reviewer hoeft op “het zal wel werken” te vertrouwen.

## 32 Aanvulling na controle van de live website

Deze controle is uitgevoerd op 7 oktober 2026 in een desktopbrowser met een viewport van ongeveer 1348 × 926 px. Onderstaande stappen zijn werkelijk doorlopen. Er is geen klantaanvraag verzonden, geen DNS gewijzigd en geen productiecode aangepast. Dit is een gerichte controle van de belangrijkste instaproute, geen volledige technische audit.

| Stap en toestand | Waarneming | Concrete bouwopdracht |
| --- | --- | --- |
| 1 Homepage — goede visuele basis, navigatiefout | Zandkleurige header, donkergroene knoppen, grote serif koppen en een tuin aan het water. Zowel Diensten als Projecten verwijzen naar /projecten/. | Behoud logo en identiteit. Geef Diensten een echt dienstenoverzicht. Voeg naast de kennismaking een duidelijke instap naar ontwerpen in 3D toe. |
| 2 Projectfilter — werkt, inhoud moet worden gecontroleerd | Schutting kiezen beperkt de toegankelijke projectlijst tot drie schuttingkaarten. Titels en categorieën zijn aanwezig. | Behoud dit gedrag, voeg aantallen en consistente selectie toe; koppel gecombineerde cases aan meerdere diensten. Controleer ieder beeld op inhoud. |
| 3 Projectfoto — ernstige inhoudelijke mismatch | Open Grenen schutting en kies Volgende foto: het label wordt Schutting met horizontale lamellen, maar het beeld toont een sterk gesnoeide boom. De DOM koppelt dat beeld aan schutting-horizontaal-lamellen-zon-1.webp. | Controleer de bestandsbytes en iedere koppeling. De bestandsnaam is hier aantoonbaar geen betrouwbaar bewijs. Herstel cover, titel, alt, categorie en galerij gezamenlijk. |
| 4 Homepage onderhoud — foto past niet bij de dienst | De sectie Periodiek tuinonderhoud toont zichtbaar een schuttingfoto, terwijl de alttekst een voortuin met grindpad en bankje beschrijft. | Gebruik een visueel gecontroleerde onderhoudsfoto; herstel de bijbehorende alttekst en responsive varianten. |
| 5 Bestratingswizard — basisroute werkt | Bestrating → 10–25 m² → Dordrecht en Binnen 1–3 maanden → samenvatting. De wizard gebruikt grove omvangkeuzes en biedt in deze route geen 3D of exacte maatvoering. | Behoud een eenvoudige route. Voeg de verplichte exacte maatvoering en werkende 3D als aanvullende ontwerproute toe. Gebruik radiosemantiek voor één keuze en checkboxsemantiek voor meerdere. |
| 6 Overdracht naar contact — werkt voor deze keuzes | Dienst, woonplaats, omvang in de omschrijving en gewenste periode komen ingevuld op de contactpagina. | Behoud deze regressie. Breid overdracht uit naar het volledige dossier, afbeeldingen en variantkeuze; respecteer de privacyregels uit hoofdstuk 24. |
| 7 Aanvraagontvangst — niet getest | Het formulier toont foto-upload, maximaal vijf bestanden van 8 MB, en verplichte contactvelden. De DOM heeft geen gewone action/method; een JS handler kan de verzending regelen. | Inspecteer de bestaande handler en eventuele endpointconfig. Ontbrekende action bewijst geen defecte backend. Test ontvangst in een daarvoor toegestane testomgeving; geen valse succesmelding. |

**Eerste herstelprioriteit:** foutieve foto-inhoud en Diensten-link. **Daarna:** vroegere instap naar de configurator, complete projectcases, materiaalvergelijkingen en de volledige 3D-aanvraagflow. Voer dit uit als één samenhangende opdracht; het herstel vervangt de uitbreidingen niet.

Controleer voor beeldkwaliteit alle relevante bronbestanden via een contact sheet en individuele inspectie. Test dezelfde cases ook onder Alle projecten, Schutting en Snoeiwerk, en vergelijk steeds het werkelijk weergegeven beeld met de tekst. Laat een test niet slagen alleen omdat de bestandsnaam het woord schutting bevat. Als bronbestanden zelf verkeerd zijn benoemd, leg de herkomst vast voordat je namen of metadata wijzigt.

De live site publiceert nu afzonderlijke bel- en WhatsApp-nummers. De nieuwe instructie is: behoud de functionele scheiding tussen bellen en WhatsApp, maar toon het WhatsApp-nummer niet meer als tekst. Gebruik een WhatsApp-icoon/CTA met toegankelijke naam; het publieke belnummer wordt de nieuwste zakelijke lijn uit hoofdstuk 6 zodra operationeel bevestigd. De footer vermeldt KvK 83078665, overeenkomend met de nieuwste opgave. Verifieer de bedrijfsidentiteit en het openbaar te gebruiken adres vóór juridisch bindende verkoopdocumenten; voer geen blind global replace uit.

Geconstateerd visueel risico: de sticky header bedekt bij een wizardstap gedeeltelijk de stapkop na automatisch scrollen. Geef ankers en wizarddoelen passende scroll-margin-top; verifieer op desktop en mobiel. Het contactformulier is op desktop overzichtelijk, maar maakt zowel telefoon als e-mail verplicht. Laat voor de korte route één bruikbaar contactkanaal plus contactvoorkeur voldoende zijn als de gekozen aanvraagontvanger dat ondersteunt.

Bewijsbeelden zijn opgenomen in de Word-versie bij dit hoofdstuk. De afzonderlijke auditbestandsnamen zijn SEAL_huidig_home.jpg, SEAL_huidig_lightbox_fout.jpg en SEAL_huidig_prefill.jpg. De tekst van dit hoofdstuk blijft zelfstandig bruikbaar wanneer Claude alleen dit Markdown-bestand krijgt. Bron: [S32], [S33] en [S34].

## 33 Claude Code: zuinig werken met tokens en context

Behandel het tokengebruik van Claude Code als een expliciete uitvoeringseis. Het doel is minder onnodig lezen, herhalen, genereren en coördineren. Verlaag daarvoor niet de verplichte 3D, aanvraagbetrouwbaarheid, beeldcontrole of benodigde tests. Een prompt kan geen vast verbruik of besparingspercentage garanderen.

Officiële gebruiksinformatie: /usage toont gebruiksinformatie; dollarindicaties zijn bij een inbegrepen abonnement geen afzonderlijke API-factuur. /compact kan context samenvatten met instructies voor wat behouden moet blijven. /clear past bij een nieuwe, niet gerelateerde taak. Context vol en abonnementsgebruik op zijn verschillende beperkingen. Prompt caching kan kosten beperken; herhaalde grote context blijft context innemen. Onnodige MCP-tools en agentteams kunnen extra gebruik opleveren. Modelkeuze moet aansluiten op de complexiteit [S35]. Controleer eerst welke functies de geïnstalleerde versie en aanmeldmethode werkelijk ondersteunen. Voer slashcommando's via de ondersteunde Claude-interface uit; typ ze niet als willekeurige shellcommando's.

Concrete werkwijze voor deze repository:

- Lees dit dossier één keer volledig. Bewaar het daarna als docs/SEAL_BUILD_BRIEF.md, behoud de hoofdstuknummers en maak een compacte eisenlijst met verwijzingen. Kopieer het niet opnieuw naar ieder bericht, CLAUDE.md of iedere toolaanroep. Gebruik vervolgens alleen de hoofdstukken die bij de huidige wijziging horen.
- Begin met rg --files en gerichte rg-zoekopdrachten. Lees daarna relevante bestanden of regelbereiken. Dump niet de hele repository, node_modules, lockfiles, gegenereerde bundles, alle assets of alle tooldefinities in de context.
- Hergebruik het bronregister en de al onderzochte concurrenten. Controleer een vluchtige prijs gericht bij de bron. Herhaal geen compleet marktonderzoek als alleen de actuele tegelprijs ontbreekt. Verwerk foto-inventarisatie in overzichtelijke batches; sla visuele controle niet over.
- Bouw in samenhangende delen met een korte checklist. Gebruik bestaande componenten, dependencies en werkende prefill. Vermijd een grote herbouw en een lang architectuurdebat als een kleine wijziging het probleem oplost.
- Bundel onafhankelijke zoekopdrachten en controles. Beperk tooluitvoer tot de relevante resultaten. Bewaar grote logs in bestanden en lees alleen de foutregels en noodzakelijke context. Bij een fout: benoem eerst de oorzaak, pas gericht aan en herhaal de betrokken controle.
- Test gewijzigd gedrag en de afgesproken kritieke regressies. Herhaal een geslaagde volledige testset niet zonder nieuwe wijziging of nieuw risico. Sla verplichte checks niet over om tokens te sparen. Leg uit wat passed, failed of blocked is.
- Gebruik alleen relevante aangesloten plugins. Een verbinding in ChatGPT is geen bewijs dat dezelfde plugin in Claude Code beschikbaar is. Inventariseer daadwerkelijk beschikbare tools; werk zonder extra integratie als de taak dat toelaat. Installeer of activeer niet automatisch een hele toolset.
- Start geen agentteam of meerdere volledige reviews uit gewoonte. Gebruik standaard één uitvoerder. Als een gerichte reviewer binnen bestaande toestemming beschikbaar is, geef alleen het relevante verschil, de bijbehorende eisen en testresultaten; dupliceer niet het hele dossier of onderzoek.
- Behoud het door de gebruiker gekozen model en inspanningsniveau. Wissel niet ongemerkt naar een lager niveau of uitgebreidere context. Een passend goedkoper model voor een afgebakende eenvoudige taak is een keuze binnen toegestane instellingen, geen verplichting.
- Houd uitleg tijdens uitvoering kort: wat veranderd is, waarom en het testresultaat. Streef naar maximaal circa 150 woorden per gewone update en circa 350 woorden bij oplevering; wees langer wanneer een blokkade of risico dat nodig maakt. Plak geen complete bestanden of dit dossier terug in de chat.

**Checkpoint vóór contextverlies:** houd docs/IMPLEMENTATION_STATUS.md compact, bij voorkeur onder circa 150 regels. Noteer huidige branch, gewijzigde bestanden, afgeronde eisnummers, laatste testresultaten, echte blokkades en exact de eerstvolgende taak. Geen persoonsgegevens, secrets of volledige logs. Bij hervatten lees je dit checkpoint, gitstatus en de benodigde hoofdstukken; schrijf geen nieuwe masterprompt en begin niet opnieuw met onderzoek.

Gebruik de beschikbare gebruiksmonitor aan het begin, na grote onderdelen en bij oplevering wanneer dat zonder extra integratie kan. Rapporteer uitsluitend werkelijk gemeten waarden. Als token- of kosteninformatie niet beschikbaar is, schrijf dat kort op; schat geen exacte bedragen. Een vooraf ingesteld budget of limiet blijft gelden. Schakel extra betaalde gebruiksruimte niet zelf in. Dreigt een harde grens, leg voortgang vast en stop verantwoord op die grens; noem de resterende eisen en hervat vanuit hetzelfde dossier wanneer uitvoering weer mogelijk is.

## 34 Visuele uitwerking voor de bouw

De bij dit dossier getoonde conceptafbeelding is een visueel voorstel, geen screenshot van gewijzigde productiecode. Zij bewijst geen werkende 3D, prijsberekening, aanvraagontvangst of pixelidentieke eindweergave. Gebruik haar samen met onderstaande regels; bij verschil hebben functionele eisen, echte assets en gecontroleerde prijzen voorrang.

De desktophomepage behoudt de huidige zandkleurige header, het bestaande groene logo, serif koppen, rustige sans serif tekst en donkergroene acties. Maak de hero compacter dan de huidige vrijwel schermvullende foto, zodat de belangrijke vervolgstap eerder zichtbaar is. Gebruik dezelfde gecontroleerde tuin-aan-het-waterfoto met een zorgvuldige uitsnede en leesbare tekst. Kop: Tuinen die rust uitstralen. Acties: Stel uw project samen en Bekijk ons werk. Voeg Gratis bezichtiging in Dordrecht en Heldere offerte vooraf alleen toe als de bestaande voorwaarden dit dragen.

Direct daarna: drie duidelijke visuele ingangen voor Schuttingen, Bestrating en Complete tuin, met daarnaast een compacte ingang voor Onderhoud & snoeiwerk. Gebruik alleen passend eigen werk. Toon vervolgens een uitnodigende preview van de 3D-ontwerproute, projectcases met filters en een korte werkwijze. Prijscontext staat op de juiste dienstpagina en in de ontwerproute; zet geen willekeurige materiaalprijs neer als all-in homepageaanbieding.

De configurator heeft op desktop een compacte keuzezone links, een ruime interactieve 3D-scène rechts en een duidelijk projectoverzicht. Zichtbare stappen: Uw project, Maten & vorm, Materialen, Situatie, Overzicht. Vergelijk materialen is een bereikbare actie. Alleen de actieve keuze is geselecteerd. In het overzicht staan maten, materialen, bekende prijscomponenten, nog te bepalen kosten en de aanvraagactie. Op mobiel worden dezelfde onderdelen onder elkaar geplaatst; een vaste onderbalk mag de actieve stap en doorgaan tonen zonder velden te bedekken. 3D wordt pas na bewuste opening geladen.

Een beeldvoorbeeld mag eigen foto's tonen als stijlreferentie; de echte website gebruikt de oorspronkelijke, gecontroleerde bestanden. Gebruik door AI gegenereerde tuinen nooit als bewijs van uitgevoerd Sealcleaning-werk. Een stijlvolle schematische 3D-scène is passend voor ontwerp. Voeg geen fictieve reviews, sterren, kortingsbadges of garanties toe.


## 35 Productvisie: van hovenierswebsite naar SEAL projectplatform

De website blijft in de eerste plaats een geloofwaardige hovenierswebsite, maar de onderscheidende digitale functie is een gratis bruikbaar projectplatform. Iemand hoeft nog geen klant te zijn om een tuin, schutting of bestratingsvlak te tekenen. Dat gratis nut is acquisitie: mensen keren terug voor volgende projecten, delen ontwerpen en leren Sealcleaning kennen voordat zij materiaal of montage nodig hebben.

Bied na ieder bruikbaar ontwerp vier heldere vervolgroutes zonder druk:

1. **Alleen ontwerpen** — bewaren, vergelijken, branded exporteren en later terugkomen.
2. **Materialen via Sealcleaning** — gecontroleerde materiaallijst, prijsstatus, levering/afhalen waar werkelijk beschikbaar en bestel-/prijsaanvraag.
3. **Alleen montage** — klant heeft eigen materialen; vraag merk/systeem, aantallen, maten, foto’s, orderbon en compatibiliteit. Sealcleaning bevestigt pas na controle dat montage mogelijk is.
4. **Materiaal + montage / complete uitvoering** — één dossier met materiaal, werk, verwijderen, afval, grondwerk, vervoer, planning en opnamepunten.

Voeg voor complete tuinprojecten een vijfde route toe: **“Laat ons het complete plan beoordelen”**. De klant kan zelf ver komen, maar wordt niet gedwongen om technische beslissingen te nemen die vakkennis of locatiecontrole vereisen.

De configurator mag bewust aantrekkelijk genoeg zijn om ook door niet-klanten te worden gebruikt. Maak geen donkere patronen, kunstmatige tijdslimiet of verplichte contactgegevens vóór ontwerpen. Bescherm het merk met branded exports, rate limits op bulkverkeer en het niet aanbieden van white-label embeds; niet door de normale gebruiker te frustreren.

## 36 Informatiearchitectuur voor particulier, zakelijk, aannemer en vakman

Maak de hoofdsite niet onnodig druk. Houd de primaire navigatie consumentgericht. Plaats zakelijke ingangen in Diensten/footer en waar relevant als contextuele CTA.

### Voor aannemers, vastgoed, VvE en zakelijke opdrachtgevers

Bouw `/voor-aannemers/` als echte B2B-landingspagina, niet als generieke contactkopie. Mogelijke opdrachten: onderaanneming groen/tuin, schutting/hekwerk, herstelbestrating, terreinonderhoud, opleverwerk, periodiek onderhoud en tijdelijke capaciteit. Vraag: bedrijf, KvK optioneel bij eerste lead, contactpersoon, rol, projectlocatie, gewenste discipline, scope/hoeveelheden, planning/deadline, veiligheids- of toegangseisen, bestek/tekeningen/foto’s en gewenste vorm van prijs (uurtarief, dagtarief, vaste aanneemsom of nader te bepalen).

Maak in B2B-offertes/facturen btw-verlegging mogelijk wanneer de werkelijke situatie aan de voorwaarden voldoet. De verleggingsregeling kan in hoveniers-/onderaannemingssituaties voor fysieke werkzaamheden aan onroerende zaken gelden; pas dit nooit automatisch alleen op basis van “zakelijke klant” toe. Vereis classificatie van rol en prestatie, btw-id van afnemer en menselijke controle. Bij verlegging: geen btw-bedrag in rekening brengen, afnemers-btw-id vastleggen en “btw verlegd” op de factuur.

### Werken met ons / vakmensen

Bouw `/werken-met-ons/` voor zzp’ers, vakmensen en toekomstige medewerkers. Laat iemand zijn discipline kiezen: stratenmaker, hovenier/groen, schuttingbouwer/timmerman, grondwerker, boom-/snoeiwerk, voorman, algemeen buitenwerk of anders. Vraag regio, beschikbaarheid, ervaring, rijbewijs/vervoer, eigen gereedschap, KvK (bij zzp), VCA/certificaten indien relevant, tariefindicatie optioneel, korte motivatie en veilige bestandsupload voor CV/certificaten. Publiceer geen belofte dat er een vacature of opdracht is als dat niet zo is. Noem het “open samenwerking / interesse” wanneer er geen concrete vacature bestaat.

Recruitmentdata is persoonsgegevensinformatie met eigen bewaartermijn/toegang. Stuur sollicitatiebestanden niet door analytics en bewaar ze niet publiek in GitHub of clientstorage.

## 37 Verwijderen, grondwerk, afval en onbekende toestand als eersteklas projectdata

Een tuinproject bestaat vaak uit meer dan het nieuwe zichtwerk. Maak daarom “Wat moet eerst weg of worden voorbereid?” een volwaardige stap na ontwerp of als onderdeel van Situatie.

Ondersteun minimaal:

- oude schutting/poort demonteren en afvoeren;
- bestaande bestrating opnemen, hergebruiken, stapelen of afvoeren;
- gras/kunstgras verwijderen;
- struiken, heggen, klimplanten en beplanting verwijderen;
- boom/stronk/wortels: alleen intake en opname wanneer risico of conditie onbekend is;
- grond afgraven/aanvullen, zandbed, hoogtecorrectie;
- puin, groenafval, grondstromen en gemengd afval afzonderlijk;
- bestaande tuinmeubels/objecten verplaatsen of klant laat ze zelf verwijderen;
- smalle achterom, trappen, waterzijde, appartementen/galerijen of geen achterom;
- kabels/leidingen/drainage/putten: bekend/onbekend, nooit automatisch lokaliseren;
- onverwachte obstakels/rommel: foto + tekst, geen gokprijs.

Bereken containers, afvoer en arbeid alleen wanneer hoeveelheid, afvalstroom, acceptatievoorwaarden en transport voldoende bekend zijn. Geen generieke “1 container” omdat een oppervlakte groot is. Leg hergebruik expliciet vast om onnodige afval- en materiaalkosten te voorkomen.

## 38 Leveranciers-, inkoop-, markt- en margeverkoopengine

Dit is een kernonderdeel van de commerciële architectuur. De bezoeker ziet een begrijpelijke verkoopprijs; interne inkoop, kortingen, margedoel en leveranciersrangschikking blijven server-side of in een beveiligd beheersysteem.

### Gegevensmodel leverancier en aanbod

Maak naast het productmodel een `supplierOffer`-model met minimaal:

- supplierId, productId/SKU/mapping confidence;
- purchasePriceExVat en purchasePriceIncVat waar bron dit levert;
- kortingsstaffel, minimumafname, verpakkingsgrootte, statiegeld/palletkosten;
- bezorgkosten en voorwaarden, afhaaloptie, regio;
- voorraadstatus en voorraadbetrouwbaarheid;
- leadTimeMin/MaxDays en cut-off indien bevestigd;
- observedAt, validFrom, expiresAt/reviewAfter, source URL/API/feed;
- bronmethode: handmatig gecontroleerd, CSV/feed, API of publieke webbron;
- kwaliteits-/compatibiliteitsstatus en notities;
- `approvedForPricing` na menselijke controle.

Gebruik geen browser scraping als kritieke productiebron wanneer voorwaarden, login of stabiliteit dit niet dragen. Ontwerp adapters voor handmatige import, CSV/XML/JSON feed en later API. Sla credentials nooit in frontend/repository op.

### Landed cost

Bereken interne landed cost per order/product uit werkelijke componenten: netto inkoop, leverancierstransport, pallet/statiegeld, handling, betaal-/transactiekosten indien van toepassing, verwachte verpakkingsafronding/breukreserve wanneer aantoonbaar en toerekenbare logistiek. Houd projectarbeid apart zodat materiaal en montage niet dubbel worden belast.

### Marktconforme verkoopprijs

Maak een configureerbare pricing policy; geen hardcoded “altijd 25% opslag”. De interne assistent vergelijkt genormaliseerde marktprijzen op dezelfde SKU of werkelijk vergelijkbaar systeem, eenheid, maat, btw, levering en garantie. Leg per product een `competitiveCorridor` vast met brondata en datum.

Prijsbeslissing:

1. bepaal landed cost;
2. bereken duurzame ondergrens op basis van minimale bijdrage/marge en risico;
3. bereken doelprijs uit intern margedoel;
4. vergelijk met actuele marktband voor hetzelfde aanbod;
5. als doelprijs marktconform is: voorstel doelprijs;
6. als doelprijs boven marktband uitkomt: flag `margin-conflict` en laat mens kiezen tussen lagere marge, andere leverancier, bundel/servicewaarde of niet aanbieden;
7. als verkoop onder duurzame ondergrens zou komen: niet automatisch verliesgevend verkopen; toon op aanvraag of kies een ander product;
8. een servicepremie is alleen verdedigbaar wanneer Sealcleaning werkelijk waarde toevoegt zoals selectie, één aanspreekpunt, levering, coördinatie, montage, controle of duidelijke garantievoorwaarden. Claim geen garantie die niet is vastgelegd.

Publiceer nooit `purchasePrice`, `internalMargin`, leverancierskortingen of interne ranking in client JS, HTML, source maps of openbare JSON. Publieke productdata bevat alleen de verkoopprijs/prijsstatus en klantrelevante voorwaarden.

### Leverancierselectie

De “beste leverancier” is niet automatisch de laagste stuksprijs. Rangschik totale orderkosten, voorraad, levertijd, compleetheid van systeem, retour/garantieproces, leverbetrouwbaarheid en afstand/logistiek. Eén leverancier met iets hogere stuksprijs kan economisch beter zijn als transport lager is en alle compatibele palen, schermen, beslag en poort beschikbaar zijn.

### Exact versus indicatief

Een “exacte” materiaalprijs mag pas worden getoond wanneer SKU, hoeveelheid, verpakking, actuele verkoopprijs, btw en toepasselijke levering bekend zijn. Als leveradres, voorraad of transport nog ontbreekt, label materiaalprijs exact voor de artikelen maar levering nog te bepalen; noem het geen exact ordertotaal.

## 39 Interne SEAL calculatie- en CEO-assistent

Ontwerp de gegevenslaag zodat een interne assistent later als operationele copiloot kan werken. Het systeem mag voorstellen doen, maar publiceert geen nieuwe prijs, koopt niets in en verstuurt geen bindende offerte zonder menselijke goedkeuring.

De assistent moet op gestructureerde projectstate kunnen antwoorden:

- wat is de complete scope en wat ontbreekt nog;
- welke hoeveelheden volgen uit geometrie en productregels;
- welke bestaande delen blijven, worden verwijderd of hergebruikt;
- welke leverancierscombinatie is economisch en logistiek het beste;
- actuele inkoop, landed cost, verkoopvoorstel, brutomarge en marktpositie;
- benodigde medewerkeruren/ploeguren en risico-opslag;
- huur, vervoer, afval, voorwerk en onderaanneming;
- welke btw-regel per lijn moet worden beoordeeld;
- welke onzekerheid verhindert een bindende offerte;
- welke vragen nog aan de klant of leverancier moeten worden gesteld;
- welke commerciële route past: alleen materiaal, montage, compleet, B2B;
- voorstel voor duidelijke klanttekst zonder interne kosten prijs te geven.

Maak auditability verplicht: elk berekend bedrag verwijst naar pricebookVersion, source IDs, timestamp en aannames. AI-tekst mag nooit een numerieke prijs verzinnen buiten het calculatiemodel. Bij conflict tussen AI-advies en deterministische prijsregels winnen de gecontroleerde regels.

Lever naast code een `docs/PRICING_OPERATIONS.md` met workflow voor nieuwe leverancier, prijscontrole, margegoedkeuring, verouderde prijs, spoedorder, retour en product uit assortiment.

## 40 Offerte, opdracht, meerwerk, werkbon, oplevering en factuur

De digitale ervaring eindigt niet bij de lead. Ontwerp een document- en statusmodel dat later veilig op een backend/boekhoudpakket kan worden aangesloten.

### Documentsoorten

Minimaal voorbereiden:

- aanvraag/projectdossier;
- calculatie intern;
- offerte / prijsvoorstel;
- offerteversie/herziening;
- opdrachtbevestiging;
- materiaalbestelling/orderbevestiging;
- meerwerk-/wijzigingsvoorstel;
- werkbon / uitvoeringssamenvatting;
- opleveringssamenvatting;
- factuur en eventueel creditfactuur;
- nazorg/reviewverzoek.

### Huisstijl

Alle klantdocumenten hebben Sealcleaning-logo, bedrijfsnaam, contact, KvK, btw-id waar vereist, documentnummer, project-ID, datum en consistente groen/zand/zwart-wit typografie. Maak een printvriendelijke A4-stijl en een PDF-renderroute wanneer backend beschikbaar is. Gebruik een scherpe logo-afgeleide; vraag om vector/transparent bron als die ontbreekt, maar blokkeer niet als de bestaande hoge-resolutie versie bruikbaar is.

### Offerte

Een offerte toont minimaal scope, hoeveelheden/maten, gekozen producten, materiaal/arbeid/vervoer/afvoer/huur waar relevant, inbegrepen/uitgesloten onderdelen, aannames, onzekerheden, planningstatus, geldigheid, btw per relevante regel, betaalafspraken en toepasselijke voorwaarden. De 3D/2D visualisatie en materiaalstaat kunnen als bijlage/samenvatting worden toegevoegd met “visualisatie, maatvoering op locatie controleren” waar nodig.

Online akkoord mag pas wanneer identiteit, finale versie, voorwaardenversie, prijs en eventuele bedenktijdinformatie kunnen worden vastgelegd. Wijzig na akkoord niet stilzwijgend dezelfde offerte; maak versie of meerwerk.

### Factuur

Een officiële btw-factuur bevat de wettelijk vereiste gegevens: juridische/handelsnaam waar toegestaan, adressen van leverancier en afnemer, btw-id, KvK indien ingeschreven, uitgiftedatum, uniek opeenvolgend factuurnummer, omschrijving/hoeveelheid van goederen of omvang van diensten, lever-/prestatiedatum of vooruitbetaling, bedrag excl. btw, tarief per regel en btw-bedrag. Bij verschillende tarieven: splits de bedragen. Bij geldige btw-verlegging: geen btw-bedrag op die prestatie, afnemers-btw-id en “btw verlegd”.

Factuurnummers moeten uniek en opeenvolgend zijn en horen daarom niet door losse browsers/localStorage te worden uitgegeven. Laat een veilig backend- of boekhoudsysteem de reeks beheren. Als zo’n systeem ontbreekt, genereert de website alleen een **concept/calculatie**, nooit een officiële factuur met mogelijk dubbele nummers.

IBAN/betaallink, betalingstermijn en aanbetalingsregels zijn bedrijfsinstellingen en worden niet verzonnen. Het logo komt op de factuur; interne kostprijs/marge nooit.

## 41 Online materiaalverkoop: checkout, consumentrecht en veilige fallback

Wanneer Sealcleaning materiaal echt online verkoopt, verandert de site juridisch van alleen leadgen naar online verkoop. Activeer een bindende “Bestellen en betalen”-checkout daarom alleen als onderstaande lagen werkelijk zijn geregeld.

Vóór koop moet de klant duidelijke bedrijfsinformatie, belangrijkste product-/dienstkenmerken, totale prijs en bijkomende kosten, betaling, levering, garantie/klachten, bedenktijd/uitzonderingen en voorwaarden kunnen zien. Na koop volgt een duurzame bevestiging die de verplichte informatie bevat.

Voor online consumentenkoop geldt in veel situaties een wettelijke bedenktijd van 14 dagen. In 2026 geldt bovendien een verplichte online ontbindings-/herroepingsfunctie; implementeer die wanneer de site daadwerkelijk online contracten sluit waarop bedenktijd van toepassing is. Behandel wettelijke rechten nooit als speciale SEAL-bonus. Leg uitzonderingen alleen toe wanneer juridisch toepasselijk, bijvoorbeeld werkelijk maatwerk; neem niet aan dat iedere geconfigureerde standaardcombinatie automatisch maatwerk is.

Bij diensten die op uitdrukkelijk verzoek binnen de bedenktijd starten, leg de benodigde toestemmings-/informatieflow juridisch correct vast voordat werk wordt gestart. Laat dit door een jurist/branchebron controleren voordat het live bindend wordt.

Zonder veilige backend/payment/orderadministratie: bied **“Materiaalprijs aanvragen / bestelling laten controleren”** en een volledige winkelmand-/materiaallijst, maar toon geen nep-betaalknop of orderbevestiging. Het ontwerp moet later kunnen aansluiten op PSP, voorraad en orderstatus zonder de configurator opnieuw te bouwen.

## 42 Klantreis en operatie na de website

Maak `/werkwijze/` inhoudelijk rijker en laat dezelfde statussen ook intern bestaan:

1. Idee / zelfstandig ontwerp.
2. Aanvraag ontvangen.
3. Compleetheidscheck van maten, foto’s, bereikbaarheid, verwijderen en materiaal.
4. Indien nodig bezichtiging/inmeting.
5. Materiaal- en uitvoeringsadvies.
6. Calculatie en offerte.
7. Akkoord / voorwaarden / eventuele bedenktijd.
8. Materiaal inkoop/levering reserveren.
9. Planning bevestigen.
10. Uitvoering met wijzigings-/meerwerkprocedure.
11. Oplevering en aandachtspunten.
12. Factuur/betaling.
13. Nazorg, review en onderhoudsoptie.

Geef klanten op de website vooraf uitleg wat zij kunnen voorbereiden: vrije toegang, water/elektra alleen indien nodig, parkeer-/laadmogelijkheid, buren/erfgrens, waardevolle objecten verplaatsen, huisdieren/kinderen, bekende kabels/leidingen en wie aanwezig is. Maak dit projectafhankelijk; niet iedere klus krijgt dezelfde checklist.

Bouw geen fictief klantportaal. Als later een portal komt, moet projectstatus uit echte backenddata komen en geen nep-“in behandeling” tonen.

## 43 Garantie, kwaliteit en vertrouwen zonder overclaim

Een sterk merk mag premium worden geprijsd wanneer de ervaring daadwerkelijk beter is, maar de website mag dat niet onderbouwen met verzonnen garanties of nepautoriteit.

Maak garantie als gegevensmodel per component:

- manufacturerWarranty: bron, duur, voorwaarden, product-ID;
- Sealcleaning workmanship warranty: alleen wanneer de onderneming de inhoud, duur, uitsluitingen en claimprocedure formeel heeft vastgesteld;
- wettelijke rechten: niet presenteren als commerciële extra;
- garantie vervalt niet automatisch door kleine niet-gerelateerde handelingen tenzij juridisch/contractueel onderbouwd.

Toon premiumwaarde via concrete proceskwaliteit: correcte materiaalstaat, visuele configuratie, duidelijke prijscomponenten, nette voorbereiding, één dossier, levercoördinatie, foto’s van echt werk, gecontroleerde oplevering, bereikbaarheid en nazorg. “Duurder omdat ons systeem mooi is” is geen klantargument; “minder fouten, duidelijker keuze, één aanspreekpunt en gecontroleerde uitvoering” kan dat wel zijn als het proces dit waarmaakt.

## 44 Marketing, Meta/Google, content en herhaalbezoek

De website wordt de kern van acquisitie. Bouw landingspagina’s en events zo dat advertenties niet eindigen op een algemene homepage wanneer een specifieke intentie bekend is.

### Campagneroutes

- schutting → schuttingconfigurator met voorbeeld;
- bestrating → oppervlak/tegelkeuze + 2D/3D;
- complete tuin → tuinplan;
- onderhoud/snoei → korte foto-intake;
- alleen montage → montageroute;
- materialen → materiaalsamenstelling;
- aannemer/VvE → B2B-pagina;
- vakman/zzp → samenwerking.

Onderzoek in Nederlandse Meta-advertenties laat zien dat aanbieders vaak concurreren op voorraad, korting, privacy/uitstraling, directe prijs en lage frictie. Kopieer hun tekst niet. SEAL onderscheidt zich met “ontwerp eerst zelf”, transparante samenstelling en keuze tussen materiaal, montage of compleet. Test dit als hypotheses; claim geen hogere conversie zonder data.

### Contentmotor

Maak kennisbankclusters rond echte intentie: schutting opmeten, poortpositie, hout-beton/composiet, terras m² berekenen, tegelformaat/snijnadeel, tuin leeghalen vóór aanleg, afvalstromen, achterom/toegang, wat kost alleen montage, materiaal zelf kopen versus via hovenier, tuinrenovatie versus complete aanleg, VvE/zakelijk onderhoud. Gebruik configuratorvoorbeelden en eigen cases; geen generieke AI-vulling zonder vakcontrole.

### Meetplan

Breid events uit met design_start, design_object_add, design_save, design_export, design_share, material_list_view, material_quote_start, material_order_request, installation_quote_start, combined_quote_start, b2b_lead_start/submit, applicant_start/submit, quote_accept_start/complete en order_cancel_request. Verstuur geen PII of inhoud van ontwerpen/foto’s naar advertentieplatformen.

Koppel UTM/campagne aan sessie/lead via veilige whitelisted velden zodat offerteacceptatie en marge later per kanaal kunnen worden geëvalueerd zonder persoonsgegevens in analytics.

## 45 Visuele en UX-uitbreidingen bovenop de conceptafbeelding

De aangeleverde conceptafbeelding is een sterke richting: compacte premium header, fotografiehero, vier dienstingangen, grote configuratorpreview, projecten, werkwijze en donkere footer. Gebruik die hiërarchie, maar maak het eindproduct functioneler dan de afbeelding.

Voeg in/om de configurator toe:

- 2D/3D toggle plus bovenaanzicht/vooraanzicht;
- “bestaand / verwijderen / nieuw” objectstatus met duidelijke legenda;
- lock-icoon voor behouden objecten;
- undo/redo voor ontwerpacties;
- autosave van niet-persoonlijke lokale ontwerpstate en expliciet “Opnieuw beginnen”;
- materiaalvergelijking zonder marketingsterren;
- live materiaallijst met aantallen;
- prijsstatus met uitleg “exact artikelbedrag / levering nog te bepalen / opname nodig”;
- ontwerpvarianten A/B/C;
- branded export en “Voeg dit ontwerp toe aan mijn aanvraag”;
- duidelijke CTA-keuze materiaal, montage of compleet;
- op mobiel een compacte canvasmodus en geen miniatuurdesktopinterface.

Voeg op service- en materiaalpagina’s sticky context-CTA’s toe die de gekozen dienst/productprefill naar de configurator sturen. Een bezoeker die een eigen projectcase bekijkt kan “Gebruik dit als inspiratie” kiezen; kopieer alleen niet-persoonlijke stijl-/materiaalvoorkeuren en nooit klantmaten/adres.

## 46 Security, backendgrenzen en operationele data

De huidige site op GitHub Pages is openbaar en statisch. Behandel alles in repository/clientbundle als publiek leesbaar. Daarom horen hier **niet** in: inkoopprijzen, marges, supplier credentials, private APIs, klantdossiers, factuurreeksen, CV’s, offerte-akkoorden, orderstatus of betalingsgeheimen.

Definieer een adapterarchitectuur:

- public catalog/read-only prices;
- secure pricing/order API;
- submission API;
- document service;
- media upload/storage;
- transactional email;
- payment provider;
- accounting/CRM adapter.

Een provider mag pas worden gekozen na inspectie van bestaande hosting, kosten, AVG, file limits en onderhoud. Verplaats niet automatisch de hele site van GitHub Pages. Een statische frontend kan veilig met een aparte serverless/backend praten.

Minimale backendsecurity bij activering: server-side schema validation, rate limiting, CSRF/originstrategie waar relevant, allowlisted CORS, idempotency, signed/controlled uploads, MIME/content checks, beperkte bestandsgrootte, logging zonder gevoelige payloads, secrets via environment, role separation voor admin, backups en verwijder-/retentieproces.

## 47 Aanvullende acceptatietests voor de masterversie

Voeg deze tests toe aan hoofdstuk 28:

| Test | Actie | Vereist resultaat |
| --- | --- | --- |
| Vrije tuincontour | Teken niet-rechthoekige tuin en wijzig één zijde | m² verandert correct; 2D en 3D delen exact dezelfde geometrie |
| Alleen m² bekend | Vul 80 m² in zonder vorm | 80 m² blijft bekend; systeem verzint geen echte 10×8 geometrie |
| Bestaande poort | Zet bestaande te behouden poort tussen nieuwe schutting A/B | Opening blijft, geen nieuw poortproduct/montage, aansluitingen kloppen |
| Verwijderen | Markeer 20 m² oude tegels en 8 m heg voor verwijderen | Dossier bevat afzonderlijke sloop/afvoerregels; geen €0 bij onbekende afvoer |
| Branded export | Download PNG/PDF | Ontwerp, maten en subtiele Sealcleaning-branding zichtbaar; geen PII tenzij bewust documenttype |
| WhatsApp privacy UX | Bekijk footer/contactbron | Nummer niet als zichtbare tekst; toegankelijke WhatsApp-CTA werkt; site claimt geen technische geheimhouding |
| Publiek belnummer | Klik bellen | Gebruikt bevestigde zakelijke +31 78-lijn, geen oud mobiel nummer |
| Materiaalroute | Kies alleen materiaal | Geen montagekosten; materiaallijst/leverstatus coherent |
| Montage-only | Kies eigen materiaal + montage | Vraagt systeem/SKU/foto/orderinfo; geen automatische compatibiliteitsbelofte |
| Gecombineerd | Kies materiaal + montage + verwijderen | Eén dossier; geen dubbele transport-/montageposten |
| Markt/margeconflict | Interne doelprijs ligt boven vergelijkbare marktband | Publicatie geblokkeerd/flag; geen stille excessieve opslag |
| Inkoopgeheim | Inspecteer public assets/source map/network | Geen supplier purchasePrice, margin target of credentials in client |
| Verouderde supplier offer | expiresAt verstreken | Exacte bestelprijs niet automatisch gebruikt; review/refresh vereist |
| Factuurconcept zonder backend | Probeer officiële factuur te maken op statische site | Geen officieel uniek factuurnummer uit browser; alleen concept/preview |
| Btw verlegd | B2B onderaanneming met geldige configuratie | Afnemers-btw-id + “btw verlegd”; geen btw-bedrag; menselijke reviewstatus |
| B2C online order | Checkout actief | verplichte info, orderbevestiging en ontbindingsfunctie/bedenktijdflow waar toepasselijk |
| Aannemerlead | Verstuur B2B-intake | correcte aparte pipeline/event; geen particuliere velden verplicht zonder reden |
| Vakmanlead | Upload CV/certificaat | veilige file validation, geen analytics/URL-lek, juiste privacytekst |
| Offerteversie | Wijzig scope na akkoord | nieuwe versie/meerwerk, originele geaccepteerde versie onveranderd |
| Prijsbron | Open klantprijsdetail | bron/peildatum waar relevant; interne inkoop/marge niet zichtbaar |

## 48 Uitvoeringsprioriteit van versie 2.0

Bij conflict tussen eerdere hoofdstukken en hoofdstuk 35–48 geldt deze masteruitbreiding als nieuwste beslissing. Werk in deze volgorde, zonder verplichte kern onnodig uit te stellen:

1. **Herstel waarheid en huidige fouten:** foto-/categoriekoppelingen, Diensten-link, contactbeleid, nieuwste bedrijfsconfig, zichtbare WhatsApp verwijderen, oude telefoon opschonen.
2. **Datafundament:** projectstate, products, suppliers/public-vs-private pricing interface, bestaande/verwijder/nieuwe objectstatus en betrouwbare uploads.
3. **2D + echte 3D:** vrije/standaard tuincontour, schutting, poorten, bestrating, bestaande objecten, verwijderen, maatlabels, export.
4. **Commerciële routes:** ontwerp-only, materiaal, montage-only, materiaal+montage, compleet.
5. **Calculatie/prijsstatus:** actuele productdata, hoeveelheden, transport/afval/arbeidregels, marktvergelijking en veilige margearchitectuur.
6. **Leadbackend/fallback:** complete dossieroverdracht en echte ontvangsttest; geen mailto als eindambitie.
7. **Projectcases/SEO/content:** eigen bewijs, landingroutes en kennisbank.
8. **B2B + werken met ons.**
9. **Documentarchitectuur:** offerte, meerwerk, werkbon, oplevering, factuurconcept en veilige backendkoppeling.
10. **Webshop/checkout alleen wanneer backend, provider en juridische eisen echt gereed zijn.** Zonder die voorwaarden blijft materiaal bestellen een heldere prijs-/orderaanvraag, niet een nepcheckout.
11. **Analytics/ads:** privacybewuste eventlaag, daarna pas betaalde campagnes sturen op leadkwaliteit en brutomarge.
12. **Onafhankelijke review:** code, UX, bedragen, juridische labels, mobiel, toegankelijkheid, security, SEO en regressies.

Doel is niet zoveel mogelijk features zichtbaar maken. Doel is dat iedere zichtbare functie echt werkt, iedere prijs verklaarbaar is, iedere klantkeuze in hetzelfde dossier terechtkomt en Sealcleaning intern weet wat een opdracht oplevert voordat hij wordt aangenomen.

## 49 Nieuwe bron- en regelcontrole voor versie 2.0

Controleer tijdens implementatie de actuele officiële bronnen opnieuw; onderstaande uitgangspunten zijn op 7 oktober 2026 gecontroleerd:

- Belastingdienst factuureisen: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/
- Belastingdienst sierteelt/hoveniers: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_9_btw/sierteeltproducten/
- Belastingdienst btw-verlegging bij onderaanneming/groenvoorziening: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/btw_berekenen_aan_uw_klanten/waarover_btw_berekenen/verleggingsregeling/wanneer_btw_verleggen/bij_onderaanneming_en_personeel_uitlenen/verlegging_bij_onderaanneming_en_personeel_uitlenen
- ACM verplichte informatie vóór/na online koop: https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/verplichte-informatie-voor-en-na-de-koop
- ACM bedenktijd/ontbindingsfunctie: https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd
- Schutting Direct configurator en live prijslogica: https://www.schutting-direct.nl/configurator
- EvoWood 3D schuttingconfigurator: https://www.evo-wood.com/schutting-configurator.html
- SCHUTTING.nl configuratie + materiaal/montage positionering: https://www.schutting.nl/
- Tekenjetuin 2D/3D consumententool: https://www.tekenjetuin.nl/en/
- Smederij Papendrecht 3D poortconfigurator: https://smederijpapendrecht.nl/configurator/poorten

Gebruik deze voorbeelden alleen om patronen, eisen en marktverwachtingen te begrijpen. Kopieer geen tekst, code, visuals of merkuitingen.

## 50 Definitieve eindinstructie — MASTER

Lees dit masterdossier volledig één keer en behandel het als de leidende uitvoeringsspecificatie. Inspecteer daarna de echte repository en voer de opdracht daadwerkelijk uit. Werk niet terug naar alleen advies of mockups. Behoud aantoonbaar sterke bestaande onderdelen, maar laat oude teksten of flows niet staan wanneer ze rechtstreeks botsen met deze versie — met name het oude zichtbare WhatsApp-nummer, het oude mobiele belnummer, “klant koopt materiaal altijd zelf/geen opslag” als enige werkwijze en de beperking dat webshop/commerciële orderarchitectuur volledig buiten scope zou vallen.

Werk waarheid- en brongebaseerd. Exacte prijzen vereisen actuele product-/leveranciersdata en correcte scope. Maak onzekerheden zichtbaar, maar gebruik onzekerheid niet als excuus om de configurator, prijsarchitectuur, commerciële routes of documenten slecht te ontwerpen. Interne inkoop/marges blijven geheim. De klant krijgt een heldere, eerlijke verkoopprijs en weet wat inbegrepen is. Iedere export is herkenbaar van Sealcleaning; iedere aanvraag bevat het relevante ontwerp en dossier.

Bouw de website alsof zij niet alleen vandaag leads moet opleveren, maar de komende jaren het digitale hart van Sealcleaning wordt: ontwerpen, calculeren, materialen leveren, montage verkopen, aannemers bedienen, vakmensen aantrekken, projecten documenteren en professioneel opvolgen. Doe dit modulair, veilig, snel en toetsbaar. Geen nepfunctionaliteit, geen fictieve bewijsclaims, geen ongeteste “exacte” prijs en geen publieke bedrijfsgeheimen.

