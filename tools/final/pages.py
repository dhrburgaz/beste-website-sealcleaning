"""Definitieve inhoud van de algemene pagina's (NL): home, prijzen en offertes, over ons, werkwijze, werkgebied, projecten (kop),
kennisbank, materialen en de aanpassingen op de formulierpagina's. Alleen bevestigde, algemene beschrijvingen; geen prijzen.
Gebruik: python3 tools/final/pages.py   (idempotent; daarna apply-nav, i18n build en zoekindex)"""
import re, os, html, json, glob
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "/"
e = html.escape
AREA = "Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de Drechtsteden"
CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>'
CHEV = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>'

def rd(p): return open(R + p, encoding="utf-8").read()
def wr(p, s): open(R + p, "w", encoding="utf-8").write(s)
def put_main(path, main):
    s = rd(path); s = re.sub(r"<main.*?</main>", lambda m: main, s, count=1, flags=re.S); wr(path, s)
def hero(rel, crumbs, eyebrow, h1, lede):
    cr = "".join(f'<li><a href="{rel}{h}">{l}</a></li>' for h, l in crumbs) + f"<li>{e(h1)}</li>"
    return (f'<section class="page-hero page-hero--plain"><div class="container page-hero-inner"><div class="breadcrumbs"><ol><li><a href="{rel}">Home</a></li>{cr}</ol></div>'
            f'<p class="eyebrow">{e(eyebrow)}</p><h1>{e(h1)}</h1><p class="lede">{e(lede)}</p></div></section>')
def sec(inner, cls="section"): return f'<section class="{cls}"><div class="container-narrow">{inner}</div></section>'
def faq(items): return '<div class="faq-list">' + "".join(f'<details class="faq-item"><summary>{e(q)}<span class="chev">{CHEV}</span></summary><p>{a}</p></details>' for q, a in items) + "</div>"
def checks(items): return '<ul class="checklist">' + "".join(f"<li>{CHECK}<span>{x}</span></li>" for x in items) + "</ul>"
def cta(rel, title, text, btn="Vraag een offerte aan"):
    return f'<section class="section section-sand-deep"><div class="container-narrow text-center"><h2>{e(title)}</h2><p>{text}</p><a href="{rel}contact/" class="btn btn-primary btn-lg">{e(btn)}</a></div></section>'

SERVICES = [("tuinonderhoud", "Tuinonderhoud", "Hagen, struiken, onkruid, blad en winterklaar maken."), ("periodiek-tuinonderhoud", "Periodiek tuinonderhoud", "Vaste onderhoudsmomenten voor uw tuin."), ("snoeiwerk", "Snoeiwerk", "Hagen, heggen, heesters en geschikte kleinere bomen."),
            ("schuttingen", "Schuttingen", "Hout, hout-beton en composiet, plaatsen of vervangen."), ("bestrating", "Bestrating", "Paden, terrassen en opritten aanleggen, ophogen of herstellen."), ("hogedrukreiniging", "Hogedrukreiniging", "Mos, onkruid en vuil verwijderen."),
            ("kunstgras", "Kunstgras", "Ondergrond, aanleg en afwerking."), ("groenafval-en-onkruid", "Onkruid en groenafval", "Verwijderen en eventueel afvoeren."), ("tuinaanleg", "Tuinaanleg", "Een tuin die bij u past."),
            ("tuinrenovatie", "Tuinrenovatie", "Een bestaande tuin vernieuwen."), ("plantenbakken", "Plantenbakken", "Plantenbakken en verhoogde borders.")]

def projects_cards(rel, slugs=None):
    out = ""
    for m in sorted((json.load(open(f, encoding="utf-8")) for f in glob.glob(R + "tools/projects/*.json") if not f.endswith("hidden.json")), key=lambda m: m.get("order", 99)):
        if m.get("status", "published") != "published": continue
        c = next(p for p in m["photos"] if p["role"] == "cover"); b = f"{rel}images/projects/{c['name']}"
        from PIL import Image
        w, h = Image.open(R + f"images/projects/{c['name']}.jpg").size
        out += (f'<a class="v-project" href="{rel}projecten/{m["slug"]}/"><figure style="margin:0;height:100%"><picture><source srcset="{b}-640.webp 640w, {b}-800.webp 800w, {b}-960.webp 960w" sizes="(max-width: 700px) 92vw, 360px" type="image/webp">'
                f'<img src="{b}.jpg" alt="{e(c["alt"])}" loading="lazy" decoding="async" width="{w}" height="{h}"></picture><figcaption><strong>{e(m["title"])}</strong>{e(m["tag"])}</figcaption></figure></a>')
    return out

def home():
    r = ""
    cards = "".join(f'<li class="v-why-card"><h3><a href="{r}{s}/">{e(t)}</a></h3><p>{e(d)}</p></li>' for s, t, d in SERVICES)
    main = f'''<main id="main">

  <section class="v-hero v-hero--plain" aria-labelledby="hero-titel"><div class="container v-hero-inner">
    <h1 id="hero-titel">Groenonderhoud en tuinaanleg in Dordrecht</h1>
    <p>Wij onderhouden tuinen, snoeien hagen, plaatsen schuttingen, leggen bestrating aan en reinigen met hogedruk. Actief in {AREA}.</p>
    <div class="btn-row"><a href="contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a><a href="#" class="btn btn-light btn-lg" data-tel>Bel ons</a><a href="#" class="btn btn-light btn-lg" data-whatsapp data-whatsapp-msg="Hallo Sealcleaning, ik heb een vraag over een klus in mijn tuin.">WhatsApp</a></div>
  </div></section>

  <section class="v-section" id="diensten" aria-labelledby="titel-diensten"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-diensten">Wat wij voor u doen</h2><p class="v-lede">Kies de werkzaamheid die bij u past. Twijfelt u? Neem contact op, dan denken wij met u mee.</p></div>
    <ul class="v-why v-why--cards">{cards}</ul>
  </div></section>

  <section class="v-section v-sand" aria-labelledby="titel-werk"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-werk">Ons werk</h2><p class="v-lede">Een selectie van werk dat wij hebben uitgevoerd.</p></div>
    <div class="v-projects v-projects-3">{projects_cards(r)}</div>
    <p style="margin-top:1.25rem"><a class="link-underline" href="projecten/">Bekijk alle projecten</a></p>
  </div></section>

  <section class="v-section" aria-labelledby="titel-stappen"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-stappen">Zo vraagt u een offerte aan</h2></div>
    <ol class="v-steps">
      <li><h3>U neemt contact op</h3><p>Via het formulier, telefoon of WhatsApp. Foto's helpen ons om uw situatie te begrijpen.</p></li>
      <li><h3>Wij bekijken uw situatie</h3><p>Soms is een foto genoeg, soms komen wij langs. Wij bespreken wat u wilt en wat mogelijk is.</p></li>
      <li><h3>U ontvangt een offerte</h3><p>Een prijsopgave voor uw situatie, met de werkzaamheden en het materiaal.</p></li>
    </ol>
    <p style="margin-top:1.25rem"><a class="link-underline" href="prijzen/">Lees hoe wij tot een prijs komen</a></p>
  </div></section>

  <section class="v-section v-sand" aria-labelledby="titel-ontwerp"><div class="container">
    <div class="v-advice"><div><h2 id="titel-ontwerp">Een schutting zelf ontwerpen</h2><p>Wilt u eerst zien hoe een schutting in uw tuin kan staan? Met de 3D-ontwerper kiest u materiaal en maten en stuurt u uw keuzes mee met uw aanvraag. Dit is een hulpmiddel; de definitieve keuze maken we samen met u.</p></div>
    <div class="btn-row"><a class="btn btn-secondary btn-lg" href="schutting-ontwerpen/">Ontwerp in 3D</a></div></div>
  </div></section>

  <section class="v-section" aria-labelledby="titel-regio"><div class="container container-narrow">
    <h2 class="v-h2" id="titel-regio">Waar wij werken</h2>
    <p>Sealcleaning is gevestigd in Dordrecht en werkt in {AREA}. Werkt u daarbuiten? Neem contact op, dan bekijken we wat mogelijk is. <a href="werkgebied/">Meer over ons werkgebied</a>.</p>
  </div></section>

</main>'''
    s = rd("index.html")
    s = re.sub(r"<main.*?</main>", lambda m: main, s, count=1, flags=re.S)
    s = re.sub(r'<script type="importmap">.*?</script>\s*', "", s, flags=re.S)
    s = re.sub(r'\s*<script type="module" src="js/v12/home3d.js"></script>', "", s)
    s = re.sub(r'<title>.*?</title>', "<title>Sealcleaning — Groenonderhoud en tuinaanleg in Dordrecht</title>", s, count=1)
    desc = "Groenonderhoud en tuinaanleg in Dordrecht en de Drechtsteden: tuinonderhoud, snoeiwerk, schuttingen, bestrating, hogedrukreiniging en kunstgras. Vraag een offerte aan."
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + "Sealcleaning — Groenonderhoud en tuinaanleg in Dordrecht", s, count=1)
    s = re.sub(r'(<meta property="og:image" content=")[^"]*', lambda m: m.group(1) + "https://sealcleaning.nl/images/branding/logo.jpg", s, count=1)
    wr("index.html", s)

def prijzen():
    r = "../"
    main = f'''<main id="main">
  {hero(r, [], "Prijzen en offertes", "Prijzen en offertes", "Elke tuin en elke opdracht is anders. Daarom werken wij niet met een standaardprijslijst, maar met een offerte die past bij uw situatie.")}
  {sec(f"""<h2>Waarom prijzen verschillen</h2>
  <p>Twee tuinen die er op een foto hetzelfde uitzien, kunnen toch een ander werk zijn. Dit bepaalt vooral wat een opdracht kost:</p>
  {checks(["<strong>Afmetingen.</strong> De lengte van een schutting of het oppervlak van een pad, terras of oprit.", "<strong>Bereikbaarheid.</strong> Kunnen we met een kar tot bij de plek komen, of moet materiaal ver worden gedragen?", "<strong>Ondergrond en huidige situatie.</strong> Bijvoorbeeld de staat van bestaande bestrating, de grond of een oude schutting die weg moet.", "<strong>Werkzaamheden en materiaal.</strong> Wat u precies laat uitvoeren en welk materiaal u kiest.", "<strong>Afvoer.</strong> Of groenafval of oud materiaal moet worden afgevoerd."])}""")}
  {sec(f"""<h2>Wat u in een offerte terugvindt</h2>
  <p>In de offerte staat wat wij doen en wat dat kost, met de arbeid en het materiaal duidelijk uit elkaar. Is afvoer van groenafval of oud materiaal nodig, dan staat dat er ook in. Ontstaan er tijdens het werk aanvullende werkzaamheden, dan bespreken wij die met u vóórdat we ze uitvoeren.</p>""", "section section-sand-deep")}
  {sec(f"""<h2>Materialen</h2>
  <p>Heeft uw opdracht materialen nodig, bijvoorbeeld tegels, schermen of planten? Dan kunt u die in overleg zelf aanschaffen, of ze via Sealcleaning laten opnemen in de offerte, los of samen met de montage. Wij adviseren graag welk materiaal bij uw situatie past.</p>""")}
  {sec(f"""<h2>Zo vraagt u een offerte aan</h2>
  <ol class="v-steps"><li><h3>Beschrijf uw wens</h3><p>Vul het contactformulier in, bel of stuur een WhatsApp-bericht.</p></li><li><h3>Stuur foto's mee</h3><p>Foto's van de plek en eventueel afmetingen helpen ons enorm.</p></li><li><h3>U ontvangt een voorstel</h3><p>Wij komen met een prijsopgave of maken eerst een afspraak om de situatie te bekijken.</p></li></ol>
  <p style="margin-top:1.25rem"><a href="{r}contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a></p>""", "section section-sand-deep")}
  {sec(f"""<h2>Veelgestelde vragen</h2>
  {faq([("Kunt u vooraf een prijs noemen?", "Voor een betrouwbare prijs moeten we uw situatie kennen. Beschrijf uw wens en stuur foto's mee. Dan komen we met een voorstel of maken we een afspraak om ter plaatse te kijken."), ("Kan ik materiaal zelf aanschaffen?", "Ja, in overleg. Wij controleren dan vooraf of het materiaal geschikt is. U kunt het materiaal ook via ons laten opnemen in de offerte."), ("Worden aanvullende werkzaamheden vooraf besproken?", "Ja. Wij voeren geen extra werk uit zonder dat u daarvan vooraf op de hoogte bent.")])}""")}
</main>'''
    s = rd("prijzen/index.html"); s = re.sub(r"<main.*?</main>", lambda m: main, s, count=1, flags=re.S)
    s = re.sub(r'<script[^>]*src="[^"]*(prijzen\.js)"[^>]*></script>\s*', "", s)
    s = re.sub(r'<title>.*?</title>', "<title>Prijzen en offertes — Sealcleaning</title>", s, count=1)
    desc = "Hoe komt Sealcleaning tot een prijs? Wat een offerte bepaalt, wat erin staat en hoe u er een aanvraagt voor uw tuin in Dordrecht en omgeving."
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + "Prijzen en offertes — Sealcleaning", s, count=1)
    s = re.sub(r'<script type="application/ld\+json">(?:(?!</script>).)*?"(Offer|FAQPage)".*?</script>\s*', "", s, flags=re.S)
    wr("prijzen/index.html", s)

def overons():
    r = "../"
    main = f'''<main id="main">
  {hero(r, [], "Over Sealcleaning", "Sealcleaning Groenonderhoud en Aanleg", "Een hoveniersbedrijf in Dordrecht voor onderhoud en aanleg van tuinen.")}
  {sec(f"""<h2>Wie wij zijn</h2>
  <p>Sealcleaning Groenonderhoud en Aanleg is gevestigd aan de Romboutslaan in Dordrecht. Wij onderhouden en leggen tuinen aan: van snoeiwerk en tuinonderhoud tot schuttingen, bestrating en hogedrukreiniging.</p>
  <p>Heeft u een vraag of een klus? U heeft direct contact met ons, per telefoon, WhatsApp, e-mail of via het formulier.</p>
  <h2>Waar wij voor staan</h2>
  {checks(["Duidelijk contact, zonder omwegen.", "Zorgvuldig uitgevoerd werk en een nette oplevering.", "Meedenken over praktische oplossingen die bij uw tuin passen.", "Een offerte die uitlegt wat wij doen en welk materiaal erbij hoort."])}""")}
  {cta(r, "Maak kennis met Sealcleaning", "Wilt u weten wat wij voor uw tuin kunnen betekenen? Vraag een offerte aan of neem contact met ons op.")}
</main>'''
    put_main("over-ons/index.html", main)

def werkwijze():
    r = "../"
    steps = [("Aanvraag", "U neemt contact op en vertelt kort wat u wilt laten doen. Foto's helpen ons."), ("Overleg of bezichtiging", "Wij bespreken uw wensen. Waar nodig komen wij langs om de situatie te bekijken."), ("Offerte", "U ontvangt een offerte met de werkzaamheden en het materiaal."), ("Planning", "We plannen de uitvoering in overleg met u, ook als er materiaal besteld moet worden."), ("Uitvoering", "Wij voeren de werkzaamheden uit zoals afgesproken."), ("Oplevering", "We ruimen op en leveren het werk netjes op. Vragen bespreken we direct.")]
    main = f'''<main id="main">
  {hero(r, [], "Werkwijze", "Van aanvraag tot oplevering", "Zo verloopt een opdracht bij Sealcleaning.")}
  <section class="section"><div class="container"><ol class="v-steps">{"".join(f"<li><h3>{e(t)}</h3><p>{e(d)}</p></li>" for t, d in steps)}</ol></div></section>
  {sec(f"""<h2>Materialen</h2><p>Heeft uw opdracht materialen nodig? Dan adviseren wij over het juiste materiaal en de hoeveelheid. U kunt het in overleg zelf aanschaffen of via ons laten opnemen in de offerte, los of samen met de montage.</p>""", "section section-sand-deep")}
  {cta(r, "Benieuwd hoe dit voor uw tuin werkt?", "Vertel ons wat u wilt laten doen. Wij denken met u mee.")}
</main>'''
    put_main("werkwijze/index.html", main)

def werkgebied():
    r = "../"
    main = f'''<main id="main">
  {hero(r, [], "Werkgebied", "Waar wij werken", f"Sealcleaning is gevestigd in Dordrecht en werkt in {AREA}.")}
  {sec(f"""<h2>Ons werkgebied</h2>
  <p>Wij werken in Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de rest van de Drechtsteden en omgeving.</p>
  <p>Werkt u daarbuiten, of twijfelt u of wij bij u in de buurt komen? Neem gerust contact op. Dan laten wij u weten wat mogelijk is.</p>""")}
  {cta(r, "Vraag naar de mogelijkheden", "Laat weten waar u woont en wat u wilt laten doen.", "Neem contact op")}
</main>'''
    put_main("werkgebied/index.html", main)

def projecten_head():
    s = rd("projecten/index.html")
    s = re.sub(r"(<p class=\"eyebrow\">)Ons werk(</p>)", r"\1Ons werk\2", s)
    s = re.sub(r'<h1>[^<]*</h1>', "<h1>Ons werk</h1>", s, count=1)
    s = re.sub(r'(<h1>Ons werk</h1>\s*<p class="lede">)[^<]*', lambda m: m.group(1) + "Een selectie van werk dat wij hebben uitgevoerd. Klik op een foto om die groter te bekijken.", s, count=1)
    s = re.sub(r'<p class="callout"[^>]*>.*?</p>', "", s, flags=re.S)
    s = s.replace("Heeft u een vergelijkbare tuin?", "Heeft u een vergelijkbare klus?").replace("Laat ons uw tuin bekijken en ontdek wat mogelijk is — geheel vrijblijvend.", "Vertel ons wat u wilt laten doen. Wij denken graag met u mee.").replace("Plan een gratis bezichtiging", "Vraag een offerte aan")
    desc = "Een selectie van werk van Sealcleaning: hogedrukreiniging van bestrating en nieuwe schuttingen."
    s = re.sub(r'<title>.*?</title>', "<title>Projecten — Sealcleaning</title>", s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    wr("projecten/index.html", s)

def kennisbank():
    s = rd("kennisbank/index.html")
    s = re.sub(r'<h2[^>]*>Onderwerpen die op de planning staan</h2>.*?(?=</section>)', "", s, flags=re.S)
    s = s.replace("Deze kennisbank wordt stap voor stap uitgebreid.", "").replace("geschreven vanuit onze eigen praktijkervaring in Dordrecht en omgeving. ", "")
    s = re.sub(r"Praktische artikelen over tuinonderhoud, aanleg en seizoenswerkzaamheden — ?", "Praktische artikelen over schuttingen en bestrating. ", s)
    wr("kennisbank/index.html", s)
    # rekenvoorbeeld zonder materiaalprijs
    p = "kennisbank/bestratingsoppervlak-berekenen/index.html"; s = rd(p)
    s = re.sub(r"Bij €13,95 per tegel.*?(?=</p>)", "Daar komen montage, ondergrond, voegwerk, kantopsluiting, afvoer en levering nog bij. De prijs hangt af van het gekozen materiaal en uw situatie; een offerte maken wij op maat", s, flags=re.S)
    s = re.sub(r"\s*zie\s*<a[^>]*>prijzen en uitgangspunten</a>[^<]*", "", s)
    s = s.replace("een materiaalindicatie met bron", "een indicatie van het aantal tegels")
    wr(p, s)
    p = "kennisbank/hout-beton-vs-composiet/index.html"; s = rd(p)
    s = re.sub(r"Doorgaans lager in aanschaf; zie\s*<a[^>]*>prijzen en uitgangspunten</a>\s*voor onderzochte referenties", "Doorgaans lager in aanschaf", s)
    s = s.replace("Aanschafprijs", "Aanschaf").replace("Vraag een gratis bezichtiging aan — we adviseren ter plaatse", "Vraag een offerte aan — we adviseren u graag")
    s = s.replace("worden pas vermeld nadat wij een concreet product hebben geverifieerd", "verschillen per product")
    wr(p, s)
    p = "kennisbank/schutting-opmeten/index.html"; s = rd(p)
    s = s.replace("zodat u zelf een betrouwbare eerste maatvoering kunt maken", "zodat u zelf een goede eerste maatvoering kunt maken")
    wr(p, s)

    # verwijzingen naar de uitgebreide configurator vervangen
    p = "kennisbank/bestratingsoppervlak-berekenen/index.html"; s = rd(p)
    s = re.sub(r"\s*Wissel dit zelf uit in\s*<a[^>]*>onze configurator</a>\s*en zie het verschil direct in de tekening\.", "", s)
    s = re.sub(r'<p class="callout">Wilt u dit voor uw eigen terras uitrekenen\?.*?</p>', '<p class="callout">Wilt u dit voor uw eigen terras laten uitrekenen? <a href="../../contact/">Neem contact met ons op</a>.</p>', s, flags=re.S)
    wr(p, s)
    p = "kennisbank/hout-beton-vs-composiet/index.html"; s = rd(p)
    s = re.sub(r'Beide systemen zijn in onze\s*<a[^>]*>configurator</a>\s*te visualiseren op uw eigen maatvoering, zodat u het verschil in uw eigen tuin kunt zien voordat u kiest\.', 'Beide systemen kunt u bekijken in onze <a href="../../schutting-ontwerpen/">3D-ontwerper</a>, zodat u het verschil in uw eigen tuin kunt zien voordat u kiest.', s, flags=re.S)
    wr(p, s)
    p = "kennisbank/schutting-opmeten/index.html"; s = rd(p)
    s = re.sub(r"Dit artikel legt de begrippen uit die ook onze\s*<a[^>]*>configurator</a>\s*gebruikt", "Dit artikel legt de begrippen uit die ook onze <a href=\"../../schutting-ontwerpen/\">3D-ontwerper</a> gebruikt", s, flags=re.S)
    s = re.sub(r"Dezelfde indeling \(zijde-ID, beginpunt, richting, lengte\) gebruikt onze configurator\.", "", s)
    s = re.sub(r"Wilt u dit meteen zien in plaats van alleen berekenen\? Teken uw schutting in 2D of 3D en zie de lijnlengte, gesloten lengte en paalposities direct in\s*<a[^>]*>onze configurator</a>\s*\.", 'Wilt u het meteen zien? Teken uw schutting in onze <a href="../../schutting-ontwerpen/">3D-ontwerper</a>.', s, flags=re.S)
    wr(p, s)

def materialen():
    r = "../"
    cards = [("Hout", "Grenen en douglas zijn veelgebruikt voor schuttingen. Hout heeft een natuurlijke uitstraling en vraagt periodiek onderhoud."), ("Hout op beton", "Houten schermen tussen betonpalen met een betonnen onderplaat. Het hout staat niet in de grond."), ("Composiet", "Onderhoudsarm en kleurvast. Een goede keuze als u weinig onderhoud wilt."), ("Tegels en klinkers", "Beton, keramiek of gebakken klinkers voor paden, terrassen en opritten. De ondergrond is minstens zo belangrijk als de steen."), ("Kunstgras", "Verkrijgbaar in verschillende uitvoeringen. Wij adviseren over gebruik en onderhoud."), ("Planten en grond", "Beplanting, bodem en plantenbakken, afgestemd op licht, plek en uw wensen.")]
    main = f'''<main id="main">
  {hero(r, [], "Materialen", "Materiaaladvies", "Welk materiaal past bij uw tuin? Wij adviseren en leveren los of samen met montage.")}
  <section class="section"><div class="container"><ul class="v-why v-why--cards">{"".join(f'<li class="v-why-card"><h3>{e(t)}</h3><p>{e(d)}</p></li>' for t, d in cards)}</ul></div></section>
  {sec(f"""<h2>Los of met montage</h2><p>Heeft uw opdracht materiaal nodig? Dan kunt u het in overleg zelf aanschaffen of via Sealcleaning laten opnemen in de offerte, los of samen met de montage. Online bestellen is niet mogelijk; u vraagt een offerte aan. Wilt u zelf een schutting ontwerpen? Probeer dan onze <a href="{r}schutting-ontwerpen/">3D-ontwerper</a>.</p>""", "section section-sand-deep")}
  {cta(r, "Advies over materiaal", "Vertel ons wat u wilt laten doen. Wij adviseren over het juiste materiaal.", "Vraag een offerte aan")}
</main>'''
    put_main("materialen/index.html", main)
    s = rd("materialen/index.html")
    s = re.sub(r'<script[^>]*src="[^"]*catalog[^"]*"[^>]*>\s*</script>\s*', "", s)
    s = re.sub(r'<script type="module"[^>]*>.*?</script>\s*', "", s, flags=re.S) if "catalog" in s else s
    s = re.sub(r'<title>.*?</title>', "<title>Materiaaladvies — Sealcleaning</title>", s, count=1)
    desc = "Materiaaladvies voor schutting, bestrating, kunstgras en beplanting. Los of met montage, in een offerte op maat."
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, s, count=1)
    wr("materialen/index.html", s)

if __name__ == "__main__":
    home(); prijzen(); overons(); werkwijze(); werkgebied(); projecten_head(); kennisbank(); materialen()
    print("pagina's bijgewerkt")
