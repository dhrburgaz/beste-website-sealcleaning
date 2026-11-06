"""Alle 11 dienstenpagina's (NL), met uitsluitend bevestigde, algemene dienstbeschrijvingen. Geen prijzen, geen onbevestigde claims.
Gebruik: python3 tools/final/diensten.py"""
import re, html, os
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "/"
AREA = "Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de Drechtsteden"
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>'
e = html.escape

S = {}
def add(slug, title, h1, lede, desc, cards, aanpak, goed, faq, projects=None, extra_cta=None, crumb=None, label=None):
    S[slug] = dict(title=title, h1=h1, lede=lede, desc=desc, cards=cards, aanpak=aanpak, goed=goed, faq=faq, projects=projects or [], extra=extra_cta, crumb=crumb or h1, label=label or h1.lower())

add("tuinonderhoud", "Tuinonderhoud in Dordrecht en omgeving — Sealcleaning", "Tuinonderhoud",
 "Een verzorgde tuin het hele jaar door. Wij onderhouden hagen en struiken, verwijderen onkruid, ruimen blad op en maken uw tuin winterklaar.",
 "Tuinonderhoud in Dordrecht en de Drechtsteden: hagen en struiken onderhouden, onkruid verwijderen, blad opruimen en de tuin winterklaar maken. Vraag een offerte aan.",
 [("Hagen en struiken","Snoeien en in vorm houden van hagen, heggen en heesters."),("Onkruid verwijderen","Borders, paden en kantjes vrij van onkruid."),("Blad opruimen","In het najaar blad uit de tuin, van paden en uit borders."),("Tuin winterklaar maken","Beplanting terugsnoeien en de tuin netjes de winter in laten gaan.")],
 "Wij bekijken uw tuin, bespreken wat u wilt laten doen en stellen daarna een offerte op die bij uw situatie past. Het werk kan eenmalig zijn of op een vast moment terugkomen; kijk daarvoor ook bij periodiek tuinonderhoud.",
 ["Welk onderhoud nodig is, hangt af van de beplanting, de grootte en het gebruik van uw tuin.","Groenafval kan worden afgevoerd. Dat spreken we vooraf met u af."],
 [("Hoe vaak is onderhoud nodig?","Dat verschilt per tuin. Een heg moet vaker worden geknipt dan een border wordt bijgehouden. Wij adviseren een passend moment."),("Neemt u het groenafval mee?","Dat kan. We spreken vooraf af of het afvoeren in de offerte wordt opgenomen.")])
add("periodiek-tuinonderhoud", "Periodiek tuinonderhoud in Dordrecht en omgeving — Sealcleaning", "Periodiek tuinonderhoud",
 "Vaste onderhoudsmomenten voor een tuin die er steeds verzorgd uitziet, zonder dat u er zelf aan hoeft te denken.",
 "Periodiek tuinonderhoud in Dordrecht en de Drechtsteden: vaste momenten voor het onderhoud van hagen, borders en paden. Vraag een offerte aan.",
 [("Vast ritme","Samen bepalen we hoe vaak wij langskomen, bijvoorbeeld per seizoen of per maand."),("Afspraken per bezoek","Wat we per keer doen, spreken we vooraf met u af."),("Werk op het juiste moment","Snoeien, onkruid verwijderen, blad opruimen en winterklaar maken, passend bij het seizoen."),("Eén aanspreekpunt","U heeft direct contact met ons over uw tuin.")],
 "We bekijken eerst uw tuin en bespreken welk onderhoud nodig is. In de offerte staat wat we doen en hoe vaak we dat doen.",
 ["De frequentie hangt af van de tuin en uw wensen.","Een vast ritme kunt u aanvullen met eenmalige klussen, zoals snoeiwerk of het opnieuw bestraten van een pad."],
 [("Kan ik eerst eenmalig onderhoud laten doen?","Ja. Veel klanten beginnen met een eenmalige beurt. Daarna bespreken we of een vast ritme zinvol is."),("Kan ik de afspraken later aanpassen?","Ja, in overleg. Wij houden de afspraken graag passend bij uw tuin.")],
 crumb="Periodiek onderhoud")
add("snoeiwerk", "Snoeiwerk in Dordrecht en omgeving — Sealcleaning", "Snoeiwerk",
 "Hagen, heggen, heesters en geschikte kleinere bomen netjes gesnoeid, met aandacht voor de situatie en de veiligheid.",
 "Snoeiwerk in Dordrecht en de Drechtsteden: hagen, heggen, heesters en geschikte kleinere bomen snoeien. Vraag een offerte aan.",
 [("Hagen en heggen","Strak in model snoeien, aan de zijkanten en bovenop."),("Heesters en struiken","Terugsnoeien en in vorm brengen, afgestemd op de plant."),("Geschikte kleinere bomen","Snoeien wanneer dat veilig en verantwoord kan."),("Snoeiafval","Afvoeren kan worden meegenomen. Dat spreken we vooraf af.")],
 "We kijken eerst naar de planten, de bereikbaarheid en de omgeving. Daarna bespreken we wat er gesnoeid wordt en maken we een offerte voor uw situatie.",
 ["Het beste moment om te snoeien verschilt per soort. Wij adviseren per plant.","Bij grotere bomen of werk op hoogte beoordelen we eerst of dat veilig en verantwoord door ons kan worden uitgevoerd.","In het broedseizoen is snoeien aan hagen en struiken beperkt. Wij bespreken wat dan mogelijk is."],
 [("Wanneer kan ik het beste snoeien?","Dat verschilt per soort. Hagen worden vaak in het groeiseizoen geknipt; bloeiende heesters hebben een eigen moment. Wij adviseren u per plant."),("Kunt u ook grote bomen snoeien?","Dat beoordelen we vooraf. We voeren alleen werk uit dat wij veilig en verantwoord kunnen doen.")])
add("schuttingen", "Schutting plaatsen of vervangen in Dordrecht — Sealcleaning", "Schuttingen",
 "Een nieuwe tuinafscheiding van hout, hout en beton of composiet, netjes geplaatst. Ook voor het vervangen van een bestaande schutting.",
 "Schutting laten plaatsen of vervangen in Dordrecht en de Drechtsteden: hout, hout-beton en composiet, met poorten en afwerking. Vraag een offerte aan.",
 [("Houten schuttingen","Schermen van bijvoorbeeld grenen of douglas, in verschillende uitvoeringen."),("Hout-betonschuttingen","Houten schermen tussen betonpalen met een betonnen onderplaat, zodat het hout niet in de grond staat."),("Composietschuttingen","Onderhoudsarm en kleurvast, voor wie weinig onderhoud wil."),("Bestaande schutting vervangen","Het verwijderen en afvoeren van de oude afscheiding kan worden meegenomen."),("Poorten en afwerking","Een poort in dezelfde stijl en nette aansluitingen.")],
 "U vertelt welke schutting u wilt, of u laat zich adviseren over materiaal en hoogte. Wij meten de situatie op en stellen een offerte op, met het materiaal los of met montage.",
 ["Materiaal en hoogte bepalen hoeveel onderhoud en privacy u krijgt. Wij adviseren graag.","Regels voor hoogte en erfgrens verschillen per gemeente. U controleert een eventuele vergunningsplicht; wij denken mee.","U kunt eerst zelf uw idee uitwerken met onze 3D-ontwerper."],
 [("Kan ik het materiaal zelf kiezen?","Ja. Wij adviseren en nemen het gekozen materiaal op in de offerte, of u schaft het in overleg zelf aan."),("Verwijdert u de oude schutting?","Dat kan worden meegenomen in de opdracht. Wij spreken vooraf af wat er met de oude schutting gebeurt.")],
 projects=["grenen-schutting-zwarte-onderplaat","kastanjehouten-paaltjesschutting"], extra_cta=("schutting-ontwerpen/","Ontwerp uw schutting in 3D"))
add("bestrating", "Bestrating en opritten in Dordrecht — Sealcleaning", "Bestrating",
 "Tuinpaden, terrassen en opritten: aanleggen, herstellen of weer op hoogte brengen, met een ondergrond die blijft liggen.",
 "Bestrating in Dordrecht en de Drechtsteden: tuinpaden, terrassen en opritten aanleggen, tegels ophogen en verzakkingen herstellen. Vraag een offerte aan.",
 [("Tuinpaden en terrassen","Aanleg of herstel met tegels of klinkers."),("Opritten","Bestrating voor de oprit, passend bij het gebruik."),("Ophogen en rechtleggen","Verzakte tegels of klinkers opnieuw opbouwen en weer vlak leggen."),("Ondergrond en waterafvoer","Een goede fundering en afwatering bepalen hoe lang bestrating mooi blijft."),("Reinigen","Mos en onkruid uit de voegen verwijderen kan met hogedrukreiniging.")],
 "We bekijken de huidige situatie: hoogte, ondergrond, afwatering en wat u wilt. Daarna maken we een offerte voor uw bestrating, inclusief wat er met oud materiaal gebeurt.",
 ["De ondergrond bepaalt het resultaat. Daarom nemen we die altijd mee in de beoordeling.","Bij een oprit kijken we naar de belasting en de afwatering.","U kiest materiaal in overleg met ons."],
 [("Kan mijn oprit worden opgehoogd?","Meestal wel. We bekijken ter plaatse de huidige hoogte, de ondergrond en de afwatering en bespreken wat nodig is."),("Kan ik zelf tegels kiezen?","Ja. Wij adviseren over geschikte materialen. U kunt ze via ons laten opnemen in de offerte of zelf aanschaffen.")])
add("hogedrukreiniging", "Hogedrukreiniging in Dordrecht en omgeving — Sealcleaning", "Hogedrukreiniging",
 "Vervuiling, mos en onkruid verwijderen van bestrating en andere geschikte ondergronden, met koud of warm water, afhankelijk van de opdracht en het materiaal.",
 "Hogedrukreiniging in Dordrecht en de Drechtsteden: mos, onkruid en vuil verwijderen van bestrating, terrassen en paden. Vraag een offerte aan.",
 [("Mos en onkruid tussen de voegen","Voegen weer open en schoon, zodat de bestrating er verzorgd bij ligt."),("Terras, pad en oprit","Vuil en groene aanslag van geschikte ondergronden verwijderen."),("Koud of warm water","We kiezen koud of warm water afhankelijk van de opdracht en het materiaal."),("Voegen onderhouden","Na het reinigen kunnen de voegen worden aangevuld met geschikt voegzand.")],
 "We beoordelen eerst de ondergrond en de vervuiling en kiezen daarop de techniek en de druk. Na afloop bespreken we of het aanvullen van de voegen zinvol is.",
 ["Reinigen verwijdert mos, onkruid en vuil. Het maakt de stenen niet nieuw: kleurverschillen en slijtage blijven zichtbaar.","Onkruid kan na verloop van tijd terugkomen. Goed gevulde voegen en regelmatig onderhoud beperken dat.","Niet iedere ondergrond verdraagt hoge druk. Wij beoordelen dat vooraf."],
 [("Beschadigt hogedruk mijn bestrating?","Te hoge druk kan voegen uitspoelen of zacht materiaal aantasten. Daarom kiezen wij druk en techniek op het materiaal en de staat van de voegen."),("Welk resultaat kan ik verwachten?","Mos, onkruid en vuil worden verwijderd. Een volledig egaal, nieuw uiterlijk beloven wij niet.")],
 projects=["oprit-en-bestrating-gereinigd"])
add("kunstgras", "Kunstgras laten aanleggen in Dordrecht — Sealcleaning", "Kunstgras",
 "Een strak gazon dat er het hele jaar goed uitziet. De ondergrond bepaalt het resultaat, dus die maken wij eerst goed.",
 "Kunstgras laten aanleggen in Dordrecht en de Drechtsteden: voorbereiding van de ondergrond, aanleg en nette afwerking. Vraag een offerte aan.",
 [("Ondergrond voorbereiden","Oud gras en grond weg, een vlakke en waterdoorlatende basis."),("Kunstgras leggen","Strak gelegd, met nette naden."),("Randen en afwerking","Netjes afgewerkt aan paden, borders en gevels."),("Oud gras verwijderen","Het oude gazon verwijderen kan worden meegenomen.")],
 "We bekijken de tuin, bespreken het gebruik en de gewenste uitstraling en maken een offerte. Het kunstgras kiezen we samen met u.",
 ["Een goede ondergrond en afwatering zijn belangrijker dan het gras zelf.","Kunstgras vraagt minder onderhoud dan een gazon, maar af en toe schoonmaken is verstandig."],
 [("Heeft kunstgras onderhoud nodig?","Veel minder dan gras, maar af en toe schoonmaken en afharken is verstandig."),("Welk kunstgras past bij mijn tuin?","Dat hangt af van gebruik, kleur en wensen. Wij adviseren en nemen het gekozen materiaal op in de offerte.")])
add("groenafval-en-onkruid", "Onkruid verwijderen en groenafval afvoeren in Dordrecht — Sealcleaning", "Onkruid en groenafval",
 "Onkruid verwijderen en groenafval opruimen, en indien gewenst afvoeren, afhankelijk van de opdracht.",
 "Onkruid verwijderen en groenafval afvoeren in Dordrecht en de Drechtsteden. Vraag een offerte aan.",
 [("Onkruid verwijderen","Borders, paden en kantjes vrijmaken van onkruid."),("Groenafval opruimen","Snoeiafval en tuinafval verzamelen."),("Afvoeren","Het afvoeren kan in de offerte worden opgenomen. Dat spreken we vooraf af.")],
 "We bekijken wat er weg moet en hoe het gebruikt wordt. In de offerte staat of het afvoeren is inbegrepen.",
 ["Onkruid kan terugkomen. Regelmatig onderhoud houdt de tuin schoon.","Wat wij afvoeren, bespreken we vooraf met u."],
 [("Voert u het afval ook af?","Dat kan. Of het afvoeren in de offerte staat, spreken we vooraf met u af."),("Kan dit samen met tuinonderhoud?","Ja, als eenmalige opruiming vooraf of als start van periodiek onderhoud.")],
 crumb="Onkruid en groenafval")
add("tuinaanleg", "Tuinaanleg in Dordrecht en omgeving — Sealcleaning", "Tuinaanleg",
 "Van lege of verouderde tuin naar een tuin die bij u past. Wij stemmen werkzaamheden en materialen af op de plek en op uw wensen.",
 "Tuinaanleg in Dordrecht en de Drechtsteden: beplanting, gras, bestrating en schuttingen, afgestemd op uw wensen. Vraag een offerte aan.",
 [("Indeling en wensen","We bespreken wat u met de tuin wilt en wat de plek toelaat."),("Beplanting en gras","Borders, hagen en gazon of kunstgras."),("Bestrating en schutting","Paden, terras en erfafscheiding in samenhang."),("Materialen","Materiaalkeuzes stemmen we met u af, los of met montage.")],
 "U vertelt wat u wilt of werkt zelf een idee uit met de 3D-ontwerper. Wij bekijken de tuin, adviseren en stellen een offerte op.",
 ["Tuinaanleg bestaat vaak uit meerdere onderdelen. We bespreken wat u in welke volgorde wilt laten uitvoeren.","Een goede ondergrond en afwatering zijn de basis."],
 [("Kan ik eerst zelf een idee uitwerken?","Ja, met de 3D-ontwerper kunt u een schutting ontwerpen en uw keuzes meesturen met uw aanvraag."),("Kan de tuin in delen worden aangelegd?","Dat kan. We bespreken vooraf wat in welke volgorde logisch is.")],
 extra_cta=("schutting-ontwerpen/","Ontwerp uw schutting in 3D"))
add("tuinrenovatie", "Tuinrenovatie in Dordrecht en omgeving — Sealcleaning", "Tuinrenovatie",
 "Een bestaande tuin vernieuwen: we bekijken wat kan blijven en wat vervangen moet worden.",
 "Tuinrenovatie in Dordrecht en de Drechtsteden: verouderde bestrating, beplanting of schutting vernieuwen. Vraag een offerte aan.",
 [("Tuin beoordelen","Wat is nog goed, wat is versleten en wat wilt u anders?"),("Verouderde delen vervangen","Bijvoorbeeld bestrating, schutting of beplanting."),("Opruimen en afvoeren","Oud materiaal en groenafval kunnen worden afgevoerd."),("Nieuwe indeling","Een tuin die weer past bij uw gebruik.")],
 "We lopen met u door de tuin, bespreken wat er moet gebeuren en maken een offerte op basis van wat we zien.",
 ["Renovatie verschilt sterk per tuin. Daarom is een bezichtiging de beste start.","Wat u wilt behouden, nemen we mee in het plan."],
 [("Kan ik delen van mijn tuin laten staan?","Ja. We bekijken met u wat kan blijven en wat vervangen moet worden."),("Voert u oud materiaal af?","Dat kan worden meegenomen. We spreken vooraf af wat in de offerte staat.")])
add("plantenbakken", "Plantenbakken en verhoogde borders — Sealcleaning", "Plantenbakken",
 "Plantenbakken en verhoogde borders geven structuur aan terras of tuin en maken onderhoud makkelijker.",
 "Plantenbakken en verhoogde borders in Dordrecht en de Drechtsteden: advies, plaatsing en beplanting in overleg. Vraag een offerte aan.",
 [("Plantenbakken","Bakken in verschillende materialen en maten, passend bij uw tuin."),("Verhoogde borders","Meer structuur en makkelijker onderhoud."),("Beplanting","Planten die passen bij de plek, het licht en uw wensen."),("Plaatsing","Op een stevige en vlakke ondergrond.")],
 "We bespreken waar de bakken komen, welke maat past en wat u erin wilt. Daarna maken we een offerte, met materiaal los of met plaatsing.",
 ["Maat en materiaal bepalen hoeveel onderhoud een plantenbak vraagt.","Beplanting kiezen we op licht, grond en gewenste hoogte."],
 [("Kan ik zelf de bakken kiezen?","Ja. Wij adviseren en nemen uw keuze op in de offerte, of u schaft de bakken zelf aan."),("Planten jullie de bakken ook?","Dat kan in overleg.")])

_F = []
def frame():
    if _F: return _F[0]
    t = open(R + "kunstgras/index.html", encoding="utf-8").read()
    a = t.index("<body"); m1 = t.index('<main id="main">'); m2 = t.index("</main>") + 7
    _F.append((t[a:m1], t[m2:]))
    return _F[0]
HEAD_TPL = open(R + "kunstgras/index.html", encoding="utf-8").read()
HEAD_TPL = HEAD_TPL[:HEAD_TPL.index("<title>")], HEAD_TPL[HEAD_TPL.index('<meta name="theme-color"'):HEAD_TPL.index('<script type="application/ld+json">')]
frame()

def build(slug, d, projects):
    pre, post = frame()
    url = f"https://sealcleaning.nl/{slug}/"
    proj = [p for p in projects if p["slug"] in d["projects"]]
    og = f"https://sealcleaning.nl/images/projects/{proj[0]['cover']}.jpg" if proj else "https://sealcleaning.nl/images/branding/logo.jpg"
    head = (HEAD_TPL[0] + f'<title>{e(d["title"])}</title>\n<meta name="description" content="{e(d["desc"])}">\n<link rel="canonical" href="{url}">\n'
            f'<link rel="alternate" hreflang="nl" href="{url}">\n<link rel="alternate" hreflang="tr" href="https://sealcleaning.nl/tr/{slug}/">\n<link rel="alternate" hreflang="x-default" href="{url}">\n'
            f'<meta property="og:type" content="website">\n<meta property="og:title" content="{e(d["title"])}">\n<meta property="og:description" content="{e(d["desc"])}">\n<meta property="og:url" content="{url}">\n<meta property="og:image" content="{og}">\n<meta property="og:locale" content="nl_NL">\n'
            + HEAD_TPL[1] +
            '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  "serviceType": "%s",\n  "provider": { "@type": "LocalBusiness", "name": "Sealcleaning Groenonderhoud en Aanleg", "telephone": "+31782049517", "address": { "@type": "PostalAddress", "streetAddress": "Romboutslaan 582", "postalCode": "3312 KP", "addressLocality": "Dordrecht", "addressCountry": "NL" } },\n  "areaServed": ["Dordrecht", "Hendrik-Ido-Ambacht", "Zwijndrecht", "Drechtsteden"],\n  "url": "%s"\n}\n</script>\n' % (e(d["h1"]), url)
            + "</head>\n")
    r = "../"
    cards = "".join(f'<li class="v-why-card"><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in d["cards"])
    goed = "".join(f"<li>{e(x)}</li>" for x in d["goed"])
    faq = "".join(f'<details class="faq-item"><summary>{e(q)}<span class="chev">{CHEV}</span></summary><p>{e(a)}</p></details>' for q, a in d["faq"])
    b1 = f'<a href="{r}contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a>'
    b2 = f'<a href="#" class="btn btn-light btn-lg" data-whatsapp data-whatsapp-msg="Hallo Sealcleaning, ik heb een vraag over {e(d["label"])}.">Stuur een WhatsApp-bericht</a>'
    hero = (f'<section class="v-hero v-hero--page v-hero--plain" aria-labelledby="hero-titel"><div class="container v-hero-inner">'
            f'<nav class="v-crumbs" aria-label="Kruimelpad"><a href="{r}">Home</a> <span aria-hidden="true">/</span> <a href="{r}#diensten">Diensten</a> <span aria-hidden="true">/</span> {e(d["crumb"])}</nav>'
            f'<h1 id="hero-titel">{e(d["h1"])}</h1><p>{e(d["lede"])}</p><div class="btn-row">{b1}{b2}</div></div></section>')
    gal = ""
    if proj:
        gal = ('<section class="v-section" aria-labelledby="titel-werk"><div class="container"><div class="v-section-head"><h2 class="v-h2" id="titel-werk">Voorbeelden uit ons werk</h2></div><div class="v-projects v-projects-3">'
               + "".join(f'<a class="v-project" href="{r}projecten/{p["slug"]}/"><figure style="margin:0;height:100%"><picture><source srcset="{r}images/projects/{p["cover"]}-640.webp 640w, {r}images/projects/{p["cover"]}-800.webp 800w, {r}images/projects/{p["cover"]}-960.webp 960w" sizes="(max-width: 700px) 92vw, 360px" type="image/webp"><img src="{r}images/projects/{p["cover"]}.jpg" alt="{e(p["alt"])}" loading="lazy" decoding="async" width="{p["w"]}" height="{p["h"]}"></picture><figcaption><strong>{e(p["title"])}</strong>{e(p["tag"])}</figcaption></figure></a>' for p in proj)
               + '</div></div></section>')
    extra = f'<a class="btn btn-secondary btn-lg" href="{r}{d["extra"][0]}">{e(d["extra"][1])}</a>' if d["extra"] else f'<a class="btn btn-secondary btn-lg" href="{r}projecten/">Bekijk onze projecten</a>'
    main = f'''<main id="main">

  {hero}

  <section class="v-section" aria-labelledby="titel-doen"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-doen">Wat wij voor u doen</h2><p class="v-lede">Wij werken in {AREA}.</p></div>
    <ul class="v-why v-why--cards">{cards}</ul>
  </div></section>

  <section class="v-section v-sand" aria-labelledby="titel-aanpak"><div class="container container-narrow">
    <h2 class="v-h2" id="titel-aanpak">Onze aanpak</h2>
    <p>{e(d["aanpak"])}</p>
    <h3>Goed om te weten</h3>
    <ul class="case-list">{goed}</ul>
  </div></section>

  {gal}

  <section class="v-section" aria-labelledby="titel-faq-d"><div class="container container-narrow"><div class="v-section-head"><h2 class="v-h2" id="titel-faq-d">Veelgestelde vragen</h2></div><div class="faq-list">{faq}</div></div></section>

  <section class="v-section v-sand" aria-labelledby="titel-advies"><div class="container">
    <div class="v-advice"><div><h2 id="titel-advies">Een offerte voor uw situatie</h2><p>Beschrijf wat u wilt laten doen en stuur zo mogelijk foto's mee. U krijgt een prijsopgave die past bij uw tuin en opdracht. Lees ook hoe wij tot een prijs komen op <a href="{r}prijzen/">Prijzen en offertes</a>.</p></div>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="{r}contact/">Vraag een offerte aan</a>{extra}</div></div>
  </div></section>

</main>'''
    return head + pre + main + post

if __name__ == "__main__":
    import json
    projects = []
    for f in sorted(__import__("glob").glob(R + "tools/projects/*.json")):
        if f.endswith("hidden.json"): continue
        m = json.load(open(f, encoding="utf-8"))
        if m.get("status", "published") != "published": continue
        from PIL import Image
        cov = next(p for p in m["photos"] if p["role"] == "cover"); w, h = Image.open(R + f"images/projects/{cov['name']}.jpg").size
        projects.append(dict(slug=m["slug"], cover=cov["name"], alt=cov["alt"], title=m["title"], tag=m["tag"], w=w, h=h))
    for slug, d in S.items():
        os.makedirs(R + slug, exist_ok=True)
        open(R + slug + "/index.html", "w", encoding="utf-8").write(build(slug, d, projects))
    print(len(S), "dienstenpagina's")
