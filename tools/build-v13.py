#!/usr/bin/env python3
"""V13: bouwt de <main> van de pilotpagina's (home, schuttingen, plantenbakken) opnieuw volgens de goedgekeurde referentie (docs/design-ref/00).
Gebruik: python3 tools/build-v13.py   (idempotent; header/footer/nav blijven van tools/apply-nav.py en de bestaande pagina's)"""
import re, pathlib, importlib.util
R = pathlib.Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("ins", R / "tools/apply-inspiratie.py")
src = (R / "tools/apply-inspiratie.py").read_text().split("# 1. hero")[0].replace("R = pathlib.Path(__file__).resolve().parent.parent", "R = pathlib.Path('%s')" % R)
ns = {}; exec(src, ns)
ipic, ALT = ns["pic"], ns["ALT"]

def rpic(rel, name, alt, sizes, eager=False):
    b = f"{rel}images/projects/{name}"
    ld = 'fetchpriority="high" ' if eager else 'loading="lazy" '
    return (f'<picture><source srcset="{b}-640.webp 640w, {b}-800.webp 800w, {b}-960.webp 960w, {b}.webp 1500w" sizes="{sizes}" type="image/webp">'
            f'<img src="{b}.jpg" alt="{alt}" width="1500" height="1000" {ld}decoding="async"></picture>')
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
def ico(d): return f'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">{d}</svg>'
I = {
 "advies": ico('<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z M9 12l2 2 4-4"/>'),
 "plaatsing": ico('<path d="M4 20h16 M6 20V8l6-4 6 4v12 M10 20v-6h4v6"/>'),
 "materiaal": ico('<path d="M3 8l9-5 9 5v8l-9 5-9-5z M3 8l9 5 9-5 M12 13v8"/>'),
 "offerte": ico('<path d="M5 4h14v16H5z M8 9h8 M8 13h8 M8 17h5"/>'),
 "bezoek": ico('<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
 "vak": ico('<path d="M14 6l4 4-9 9H5v-4l9-9z M13 7l4 4"/>'),
 "regio": ico('<circle cx="12" cy="12" r="9"/><path d="M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18"/>'),
}
def usp(items, label="Waar je op kunt rekenen"):
    return f'<div class="v-usp" aria-label="{label}"><div class="container"><ul>' + "".join(f'<li>{I[k]}<span>{t}</span></li>' for k, t in items) + '</ul></div></div>'
STIJL_NOTE = ns["NOTE"]; DISC = ns["DISC"]
IMP = '<span class="i-tag">Impressie</span>'
SIZES = "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 300px"
def service_card(rel, href, title, sub, img, impress):
    return f'<li><a class="v-card" href="{rel}{href}"><span class="v-card-img">{img}{IMP if impress else ""}</span><span class="v-card-body v-card-row"><strong>{title}</strong>{ARROW}</span></a></li>'

def home_main():
    r = ""
    cards = [
     ("schuttingen/", "Schuttingen", "Privacy en een mooie uitstraling", ipic("schutting-hardhout-horizontaal-zonsondergang", ALT["schutting-hardhout-horizontaal-zonsondergang"], r, SIZES), True),
     ("bestrating/", "Bestrating", "Terras, oprit en tuinpad", ipic("tuinpad-stapplaten-avond", ALT["tuinpad-stapplaten-avond"], r, SIZES), True),
     ("tuinaanleg/", "Tuinaanleg", "Complete tuin, in overleg opgebouwd", rpic(r, "waterzijde-tuin-terras-hortensia", "Terras met border aan het water, een tuin die Sealcleaning heeft aangelegd", SIZES), False),
     ("tuinrenovatie/", "Tuinrenovatie", "Een tuin die weer bij u past", ipic("tuin-gazon-terras-dag", ALT["tuin-gazon-terras-dag"], r, SIZES), True),
     ("materialen/", "Materialen", "Schuttingen en meer, los of met montage", ipic("schutting-grenen-betonpalen-dag", ALT["schutting-grenen-betonpalen-dag"], r, SIZES), True),
     ("plantenbakken/", "Plantenbakken", "Groen in elke tuin", ipic("plantenbakken-cortenstaal-avond", ALT["plantenbakken-cortenstaal-avond"], r, SIZES), True),
     ("tuinonderhoud/", "Tuinonderhoud", "Altijd een verzorgde tuin", rpic(r, "voortuin-haag-gesnoeid", "Strak gesnoeide haag in een voortuin, onderhoud door Sealcleaning", SIZES), False),
     ("hogedrukreiniging/", "Hogedrukreiniging", "Terras, pad en schutting weer schoon", rpic(r, "tuin-voor-onderhoud-bemost-terras", "Terras met mos voor een schoonmaakbeurt", SIZES), False),
     ("kunstgras/", "Kunstgras", "Strak gazon zonder onderhoud", rpic(r, "terras-kunstgras-opgeleverd", "Achtertuin met kunstgras, werk van Sealcleaning", SIZES), False),
     ("groenafval-en-onkruid/", "Onkruid en groenafval", "Opruimen, verwijderen en afvoeren", rpic(r, "plantvak-leeggemaakt-voortuin", "Leeggemaakt plantvak in een voortuin", SIZES), False),
     ("snoeiwerk/", "Snoeiwerk", "Bomen, hagen en heesters", rpic(r, "boom-gesnoeid-voortuin", "Gesnoeide boom in een voortuin, werk van Sealcleaning", SIZES), False),
    ]
    proj = [("projecten/tuin-aan-het-water-compleet/", "waterzijde-tuin-terras-hortensia", "Tuin aan het water", "Terras en border, Dordrecht"),
            ("projecten/grenen-schutting-zwarte-onderplaat/", "schutting-grenen-zwarte-voet-1", "Grenen schutting", "Met zwarte onderplaat"),
            ("projecten/terras-houtlook-tegelpad/", "terras-houtlook-kunstgras-pad-1", "Terras met tegelpad", "Houtlook en kunstgras")]
    why = [("advies", "Persoonlijk advies", "U spreekt rechtstreeks met wie het werk uitvoert."), ("offerte", "Duidelijke afspraken", "In de offerte staat wat wel en niet is inbegrepen."),
           ("vak", "Vakwerk", "Professionele plaatsing, netjes afgewerkt."), ("regio", "Actief in de regio", "Dordrecht, de Drechtsteden en Rotterdam e.o.")]
    return f'''<main id="main">

  <section class="v-hero" aria-labelledby="hero-titel">
    <div class="v-hero-media">{ipic("tuin-loungehoek-avond", ALT["tuin-loungehoek-avond"], r, "100vw", True)}</div>
    <div class="v-hero-scrim"></div>
    <div class="container v-hero-inner">
      <h1 id="hero-titel">Jouw droomtuin, ons vakwerk</h1>
      <p>Van ontwerp tot realisatie. Schuttingen, bestrating, tuinaanleg en onderhoud, met professionele montage.</p>
      <div class="btn-row">
        <a href="schutting-ontwerpen/" class="btn btn-primary btn-lg">Start met 3D-ontwerp {ARROW}</a>
        <a href="projecten/" class="btn btn-light btn-lg">Bekijk projecten</a>
      </div>
    </div>
    <p class="i-caption">Impressiebeeld, geen opgeleverd project</p>
  </section>

  <section class="v-section v-3d-wrap" id="ontwerp3d" aria-labelledby="titel-3d">
    <div class="container">
      <div class="v-3d-head">
        <div><p class="v-eyebrow v-eyebrow--light">Ontwerp zelf, zonder technische kennis</p><h2 id="titel-3d">Bekijk uw tuinidee in 3D</h2>
          <p>Kies uw stijl, materiaal en maten en zie direct hoe uw schutting eruit kan zien. Weet u niet hoe u moet meten? Dan helpen we u stap voor stap.</p></div>
        <div class="v-3d-cta"><a href="schutting-ontwerpen/" class="btn btn-light btn-lg">Start 3D-ontwerp {ARROW}</a><a href="contact/" class="btn btn-line-light btn-lg">Liever advies? Vraag een offerte</a></div>
      </div>
      <div class="v-3d-stage v-3d-stage--big" data-home-3d>
        <div class="v-3d-poster"><img src="images/home-3d-poster.jpg" alt="Voorbeeldtuin in 3D: houten schutting op betonnen onderplaat, terras en borders" width="1600" height="800" decoding="async"><span>3D-voorbeeld wordt geladen…</span></div>
        <div data-home-3d-canvas></div>
        <svg data-home-3d-flat hidden role="img" aria-label="Voorbeeldtuin in 2D, bovenaanzicht"></svg>
      </div>
      <div class="v-3d-bar">
        <div class="v-3d-tools" role="group" aria-label="Kies een schutting in het voorbeeld">
          <button type="button" class="v-chip" data-3d-mat="hout" aria-pressed="false">Hout</button>
          <button type="button" class="v-chip" data-3d-mat="hout-beton" aria-pressed="true">Hout met beton</button>
          <button type="button" class="v-chip" data-3d-mat="composiet" aria-pressed="false">Composiet</button>
          <button type="button" class="v-chip" data-3d-mat="lamellen" aria-pressed="false">Horizontale planken</button>
        </div>
        <div class="v-3d-tools" role="group" aria-label="Sfeer">
          <button type="button" class="v-chip" data-3d-mood="day" aria-pressed="true">Dag</button>
          <button type="button" class="v-chip" data-3d-mood="evening" aria-pressed="false">Avond met verlichting</button>
        </div>
        <div class="v-3d-tools" role="group" aria-label="Camera">
          <button type="button" class="v-chip" data-3d-iso>Schuin van boven</button>
          <button type="button" class="v-chip" data-3d-top>Van boven</button>
          <button type="button" class="v-chip" data-3d-reset>Terug naar begin</button>
        </div>
      </div>
      <p class="v-3d-status" data-home-3d-status role="status">Voorbeeld in 3D, geen echt project.</p>
    </div>
  </section>

  {usp([("advies","Gratis bezichtiging in Dordrecht"),("plaatsing","Professionele plaatsing"),("materiaal","Materiaalkeuze op maat"),("offerte","Duidelijke offerte"),("bezoek","Persoonlijk advies")])}

  <section class="v-section" id="diensten" aria-labelledby="titel-help">
    <div class="container">
      <div class="v-section-head"><h2 class="v-h2" id="titel-help">Waar kunnen we u mee helpen?</h2><p class="v-lede">Kies wat het beste past. Twijfelt u? Dan denken we graag met u mee.</p></div>
      <ul class="v-cards v-cards-4">{"".join(service_card(r, *c) for c in cards)}</ul>
      <p class="i-disclaimer">Beelden met &lsquo;Impressie&rsquo; zijn voorbeelden van mogelijke uitvoeringen, geen opgeleverde projecten van Sealcleaning.</p>
    </div>
  </section>

  <section class="v-section" aria-labelledby="titel-projecten">
    <div class="container">
      <div class="v-section-head v-row"><div><h2 class="v-h2" id="titel-projecten">Onze projecten</h2><p class="v-lede">Een greep uit ons eigen werk in Dordrecht en de Drechtsteden.</p></div><a class="btn btn-primary" href="projecten/">Bekijk alle projecten {ARROW}</a></div>
      <div class="v-projects v-projects-3">{"".join(f'<a class="v-project" href="{h}"><figure style="margin:0;height:100%">{rpic(r, n, t + ", eigen werk van Sealcleaning", "(max-width: 700px) 92vw, 360px")}<figcaption><strong>{t}</strong>{s}</figcaption></figure></a>' for h, n, t, s in proj)}</div>
      <p style="margin-top:1.2rem"><a class="v-link" href="inspiratie/">Laat u inspireren door meer voorbeelden</a></p>
    </div>
  </section>

  <section class="v-section v-sand" aria-labelledby="titel-waarom">
    <div class="container">
      <div class="v-section-head" style="text-align:center;margin-inline:auto"><h2 class="v-h2" id="titel-waarom">Waarom kiezen voor SEAL?</h2></div>
      <ul class="v-why">{"".join(f'<li>{I[k]}<strong>{t}</strong><span>{d}</span></li>' for k, t, d in why)}</ul>
    </div>
  </section>

  <section class="v-cta" aria-labelledby="titel-cta">
    <div class="container v-cta-row">
      <div><h2 id="titel-cta">Klaar voor een nieuwe tuin?</h2><p>Vraag vandaag nog een vrijblijvende offerte aan.</p></div>
      <div class="btn-row"><a href="contact/" class="btn btn-light btn-lg">Offerte aanvragen</a><a href="#" class="btn btn-line-light btn-lg" data-whatsapp data-whatsapp-msg="Hallo Sealcleaning, ik wil graag informatie over een schutting of tuin.">WhatsApp ons</a></div>
    </div>
  </section>

</main>'''

STIJLEN6 = [
 ("schutting-composiet-antraciet-terras", "Modern", "Strak en tijdloos", "composiet", "Composiet, antraciet"),
 ("schutting-verticaal-hout-zwarte-palen", "Klassiek", "Rustiek en stijlvol", "hout", "Hout, verticale planken"),
 ("schutting-hardhout-horizontaal-zonsondergang", "Horizontaal", "Modern en luxe", "lamellen", "Hout, horizontale planken"),
 ("tuin-terras-donkere-schutting-avond", "Composiet zwart", "Donker, strak en gesloten", "composiet", "Composiet, zwart"),
 ("schutting-grenen-betonpalen-dag", "Hout-beton", "Warm hout tussen betonpalen", "hout-beton", "Hout op betonnen onderplaat en betonpalen"),
 ("poort-hout-pad-dag", "Met poort", "Schutting en poort in één stijl", None, "Hout, horizontale planken met poort"),
]
def style_card(rel, n, t, sub, mat, badge=''):
    mb = '<p class="i-mat">' + badge + '</p>' if badge else ''
    link = f"{rel}schutting-ontwerpen/" + (f"?materiaal={mat}" if mat else "")
    return (f'<li class="i-card"><figure class="i-card-img">{ipic(n, ALT[n], rel, "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 380px")}<span class="i-tag">Impressie</span></figure>'
            f'<div class="i-card-body"><h3>{t}</h3>{mb}<p>{sub}</p><div class="i-card-actions"><a class="btn btn-primary" href="{link}">Bekijk mogelijkheden</a><a class="btn btn-secondary" href="{rel}contact/">Vraag offerte aan</a></div></div></li>')

def hero_block(rel, img, eyebrow, h1, lede, b1, b2):
    return f"""<section class="v-hero v-hero--page" aria-labelledby="hero-titel">
    <div class="v-hero-media">{ipic(img, ALT[img], rel, "100vw", True)}</div>
    <div class="v-hero-scrim"></div>
    <div class="container v-hero-inner">
      <nav class="v-crumbs" aria-label="Kruimelpad"><a href="{rel}">Home</a> <span aria-hidden="true">/</span> <a href="{rel}#diensten">Diensten</a> <span aria-hidden="true">/</span> {eyebrow}</nav>
      <h1 id="hero-titel">{h1}</h1>
      <p>{lede}</p>
      <div class="btn-row">{b1}{b2}</div>
    </div>
    <p class="i-caption">Impressiebeeld, geen opgeleverd project</p>
  </section>"""

def schuttingen_main():
    f = R / "schuttingen/index.html"; s = f.read_text()
    m = re.search(r'<main id="main">(.*?)</main>', s, re.S); body = m.group(1)
    if "<!--v13-tail-->" in body:
        tail = body.split("<!--v13-tail-->", 1)[1]
        tail = re.sub(r'\s*<section class="v-section" aria-labelledby="titel-advies">.*?</section>', "", tail, flags=re.S)
    else:
        i = body.index('<section class="section section-sand-deep">'); tail = body[i:]
    if "<!--v13-acc-->" not in tail:
        cut = tail.index('<section class="section section-sand-deep">', 100)  # begin "Waarom Sealcleaning?"
        inner, rest = tail[:cut], tail[cut:]
        chunks = re.split(r"<h2[^>]*>", inner)[1:]
        items = []
        for n, ch in enumerate(chunks):
            title, body = ch.split("</h2>", 1)
            body = re.sub(r"<section[^>]*>|</section>|<div class=\"container-narrow\">|<div class=\"path-divider\">.*?</div>|<!--.*?-->", "", body, flags=re.S)
            while body.count("</div>") > body.count("<div"): body = body[:body.rfind("</div>")] + body[body.rfind("</div>") + 6:]
            items.append(f'<details class="v-acc-item"{" open" if n == 0 else ""}><summary>{title.strip()}</summary><div class="v-acc-body">{body.strip()}</div></details>')
        tail = '<!--v13-acc--><section class="v-section v-sand" aria-labelledby="titel-info"><div class="container"><div class="v-section-head"><p class="v-eyebrow">Goed om te weten</p><h2 class="v-h2" id="titel-info">Alles over schuttingen plaatsen</h2></div><div class="v-acc">' + "".join(items) + '</div></div></section>\n\n  ' + rest
    if "<!--v13-proj-->" not in tail:
        a = tail.index("<h2>Waarom Sealcleaning?</h2>"); a = tail.rfind("<section", 0, a)
        b = tail.index("<h2>Vragen over schuttingen</h2>"); b = tail.rfind("<section", 0, b)
        PJ = [("projecten/grenen-schutting-zwarte-onderplaat/", "schutting-grenen-zwarte-voet-1", "Grenen schutting op zwarte onderplaat", "Hout op onderplaat, Dordrecht"),
              ("projecten/kastanjehouten-paaltjesschutting/", "schutting-kastanje-paaltjes-dordrecht-1", "Kastanjehouten paaltjesschutting", "Rustiek en open, Dordrecht"),
              ("projecten/kunstgras-achter-nieuwe-schutting/", "terras-kunstgras-opgeleverd", "Kunstgras achter nieuwe schutting", "Schutting en gazon, Dordrecht")]
        cards = "".join(f'<a class="v-project" href="../{h}"><figure style="margin:0;height:100%">{rpic("../", n, t + ", eigen werk van Sealcleaning", "(max-width: 700px) 92vw, 360px")}<figcaption><strong>{t}</strong>{d}</figcaption></figure></a>' for h, n, t, d in PJ)
        proj = ('<!--v13-proj--><section class="v-section" aria-labelledby="titel-praktijk"><div class="container"><div class="v-section-head v-row"><div><p class="v-eyebrow">Uit de praktijk</p><h2 class="v-h2" id="titel-praktijk">Schuttingen die we plaatsten</h2>'
                '<p class="v-lede">Sealcleaning is een jong en gedreven hoveniersbedrijf uit Dordrecht, ondersteund door vakmensen met jarenlange praktijkervaring. U spreekt rechtstreeks met wie het werk uitvoert. <a class="v-link" href="../over-ons/">Meer over ons</a></p></div>'
                f'<a class="btn btn-secondary" href="../projecten/">Bekijk alle projecten</a></div><div class="v-projects v-projects-3">{cards}</div></div></section>\n\n  ')
        tail = tail[:a] + proj + tail[b:]
    tail = re.sub(r'\s*<section class="section">\s*<div class="container">\s*<div class="cta-banner reveal">.*?</section>', "", tail, flags=re.S)  # dubbele slot-CTA (advies + footer-CTA volstaan)
    r = "../"
    top = f"""
  {hero_block(r, "schutting-hout-wandverlichting-avond", "Schuttingen", "Schuttingen", "Meer privacy en een mooie uitstraling, netjes geplaatst door Sealcleaning in Dordrecht en omgeving.",
       '<a href="#stijlen" class="btn btn-primary btn-lg">Bekijk schuttingen</a>', f'<a href="{r}schutting-ontwerpen/" class="btn btn-light btn-lg">Start 3D-ontwerp {ARROW}</a>')}

  {usp([("advies","Persoonlijk advies"),("materiaal","Keuze uit diverse stijlen"),("plaatsing","Professionele plaatsing"),("offerte","Duidelijke offerte")])}

  <section class="v-section" id="stijlen" aria-labelledby="titel-stijlen"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-stijlen">Onze schuttingen</h2><p class="v-lede">Kies de stijl die bij uw tuin past. {STIJL_NOTE}</p></div>
    <ul class="i-cards">{"".join(style_card(r, *x) for x in STIJLEN6)}</ul>
    <p style="margin-top:1.4rem;display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-primary btn-lg" href="{r}schutting-ontwerpen/">Ontwerp uw schutting in 3D</a><a class="btn btn-secondary btn-lg" href="{r}contact/">Vraag een offerte aan</a></p>
    <p class="i-disclaimer">{DISC} Houtsoort (bijvoorbeeld grenen of douglas), afmetingen en afwerking bevestigen we vooraf met u.</p>
  </div></section>

  <!--v13-tail-->"""
    after = f"""
  <section class="v-section" aria-labelledby="titel-advies"><div class="container">
    <div class="v-advice"><div><h2 id="titel-advies">Liever advies op maat?</h2><p>Wij denken met u mee over stijl, hoogte en materiaal, en bespreken de mogelijkheden bij u in de tuin.</p></div>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="{r}contact/">Neem contact op</a><a class="btn btn-secondary btn-lg" href="{r}schutting-ontwerpen/">Start 3D-ontwerp</a></div></div>
  </div></section>
"""
    f.write_text(s.replace(m.group(0), '<main id="main">' + top + tail.rstrip().removesuffix("").rstrip() + after + "\n</main>", 1))

def plantenbakken_page():
    t = (R / "tuinaanleg/index.html").read_text()
    t = re.sub(r"<title>.*?</title>", "<title>Plantenbakken Dordrecht | Op maat geplaatst — Sealcleaning</title>", t, count=1)
    t = re.sub(r'(<meta name="description" content=")[^"]*', r"\1Plantenbakken in cortenstaal, antraciet en meer: stijlen en voorbeelden, plaatsing en beplanting door Sealcleaning in Dordrecht. Vraag vrijblijvend een offerte aan.", t, count=1)
    t = t.replace("sealcleaning.nl/tuinaanleg/", "sealcleaning.nl/plantenbakken/").replace("Tuinaanleg Dordrecht — Sealcleaning", "Plantenbakken Dordrecht — Sealcleaning")
    t = re.sub(r'"serviceType": "[^"]*"', '"serviceType": "Plantenbakken plaatsen en beplanten"', t, count=1)
    r = "../"
    cards = [("plantenbakken-cortenstaal-avond", "Cortenstaal", "Warme roestkleur, past bij hout en groen"), ("tuin-cortenbakken-grindpad-avond", "Cortenstaal in de tuin", "Plantenbakken langs een pad of terras"), ("tuin-gazon-terras-dag", "Antraciet metaal", "Strak en donker, naast grote tegels")]
    def card(n, ti, su):
        return (f'<li class="i-card"><figure class="i-card-img">{ipic(n, ALT[n], r, "(max-width: 700px) 92vw, 380px")}<span class="i-tag">Impressie</span></figure><div class="i-card-body"><h3>{ti}</h3><p>{su}</p>'
                f'<div class="i-card-actions"><a class="btn btn-primary" href="{r}contact/">Vraag offerte aan</a><a class="btn btn-secondary" href="{r}project-samenstellen/">Teken in 2D/3D</a></div></div></li>')
    main = f"""<main id="main">

  {hero_block(r, "plantenbakken-cortenstaal-avond", "Plantenbakken", "Plantenbakken", "Groen in elke tuin: plantenbakken die passen bij uw terras, schutting en stijl, geplaatst en beplant door Sealcleaning.",
       '<a href="#stijlen" class="btn btn-primary btn-lg">Bekijk stijlen</a>', f'<a href="{r}contact/" class="btn btn-light btn-lg">Vraag een offerte aan</a>')}

  {usp([("materiaal","Keuze uit stijlen en materialen"),("plaatsing","Plaatsing en beplanting"),("advies","Persoonlijk advies"),("offerte","Duidelijke offerte")])}

  <section class="v-section" id="stijlen" aria-labelledby="titel-stijlen"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-stijlen">Onze plantenbakken</h2><p class="v-lede">Kies het model dat bij uw tuin past. {STIJL_NOTE}</p></div>
    <ul class="i-cards">{"".join(card(*c) for c in cards)}</ul>
    <p class="i-disclaimer">{DISC} Materiaal, afmetingen en kleur bevestigen we vooraf met u.</p>
  </div></section>

  <section class="v-section v-sand" aria-labelledby="titel-wat"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-wat">Wat kunnen we voor u doen?</h2></div>
    <ul class="v-why"><li>{I["materiaal"]}<strong>Advies over model en materiaal</strong><span>Passend bij uw tuin, schutting en terras.</span></li><li>{I["plaatsing"]}<strong>Plaatsing</strong><span>Netjes waterpas en stevig geplaatst.</span></li><li>{I["vak"]}<strong>Beplanting</strong><span>Op wens inclusief vullen en beplanten.</span></li><li>{I["offerte"]}<strong>Offerte op maat</strong><span>Prijs op basis van uw situatie.</span></li></ul>
  </div></section>

  <section class="v-section" aria-labelledby="titel-advies"><div class="container">
    <div class="v-advice"><div><h2 id="titel-advies">Hulp bij kiezen?</h2><p>Onze vakmensen denken graag met u mee en laten zien wat bij uw tuin past.</p></div>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="{r}contact/">Neem contact op</a><a class="btn btn-secondary btn-lg" href="{r}inspiratie/">Meer inspiratie</a></div></div>
  </div></section>

</main>"""
    hs = t.index('<main id="main">'); he = t.index("</main>") + len("</main>")
    t = t[:hs] + main + t[he:]
    t = re.sub(r'<section class="page-hero.*?</section>', "", t, count=0) if False else t
    (R / "plantenbakken/index.html").write_text(t)

def swap_main(path, html):
    f = R / path; s = f.read_text()
    s = re.sub(r'<main id="main">.*?</main>', lambda m: html, s, count=1, flags=re.S)
    f.write_text(s)

if __name__ == "__main__":
    swap_main("index.html", home_main()); schuttingen_main(); plantenbakken_page()
    print("home ok")

# ---- Extra dienstpagina's (bevestigde diensten) ----
def real_hero(rel, img, alt, h1, lede, b1, b2, crumb):
    return f"""<section class="v-hero v-hero--page" aria-labelledby="hero-titel">
    <div class="v-hero-media">{rpic(rel, img, alt, "100vw", True)}</div>
    <div class="v-hero-scrim"></div>
    <div class="container v-hero-inner">
      <nav class="v-crumbs" aria-label="Kruimelpad"><a href="{rel}">Home</a> <span aria-hidden="true">/</span> <a href="{rel}#diensten">Diensten</a> <span aria-hidden="true">/</span> {crumb}</nav>
      <h1 id="hero-titel">{h1}</h1><p>{lede}</p><div class="btn-row">{b1}{b2}</div>
    </div></section>"""

SERVICE_PAGES = {
 "hogedrukreiniging": dict(title="Hogedrukreiniging Dordrecht | Terras, pad en schutting — Sealcleaning", desc="Hogedrukreiniging en warmwaterhogedruk in Dordrecht, Zwijndrecht, Hendrik-Ido-Ambacht en Rotterdam: terras, oprit, tuinpad en schutting weer schoon. Vraag vrijblijvend een offerte aan.",
   h1="Hogedrukreiniging", crumb="Hogedrukreiniging", img="tuin-voor-onderhoud-bemost-terras", alt="Terras met mos en vervuiling voor een schoonmaakbeurt, werk van Sealcleaning",
   lede="Terras, oprit, tuinpad of schutting weer schoon, met koud water of warmwaterhogedruk. Wij beoordelen vooraf of het materiaal geschikt is.",
   usp=[("vak","Koud of warmwaterhogedruk"),("plaatsing","Terras, pad, oprit en schutting"),("advies","Eerst advies over het materiaal"),("offerte","Duidelijke offerte")],
   cards=[("Terras en tuinpad","Mos, algen en vuil verwijderen van tegels en klinkers."),("Oprit en bestrating","Grotere vlakken schoon, op de juiste druk voor het materiaal."),("Schutting en erfafscheiding","Groene aanslag van hout, beton of composiet halen."),("Warmwaterhogedruk","Voor hardnekkig vuil, vet en aanslag waar koud water te weinig doet.")],
   faq=[("Beschadigt hogedruk mijn bestrating?","Te hoge druk kan voegen uitspoelen of zacht materiaal aantasten. Daarom kiezen wij druk en techniek op het materiaal en de staat van de voegen."),("Wanneer kies ik warmwaterhogedruk?","Bij hardnekkig vuil, vet of aanslag. Wij adviseren ter plaatse wat nodig is."),("Wat kost hogedrukreiniging?","Dat hangt af van oppervlakte, vervuiling en toegang. Na een korte beschrijving of bezichtiging krijgt u een offerte.")]),
 "kunstgras": dict(title="Kunstgras aanleggen Dordrecht | Strak gazon zonder onderhoud — Sealcleaning", desc="Kunstgras laten aanleggen in Dordrecht, Zwijndrecht, Hendrik-Ido-Ambacht en Rotterdam. Goede ondergrond, strakke randen en nette afwerking. Vraag vrijblijvend een offerte aan.",
   h1="Kunstgras aanleggen", crumb="Kunstgras", img="terras-houtlook-kunstgras-pad-1", alt="Terras met houtlook tegelpad tussen kunstgras, werk van Sealcleaning",
   lede="Een strak gazon dat er het hele jaar goed uitziet. De ondergrond bepaalt het resultaat, dus die maken wij eerst goed.",
   usp=[("vak","Goede ondergrond"),("plaatsing","Strakke randen en naden"),("materiaal","Materiaal in overleg"),("offerte","Duidelijke offerte")],
   cards=[("Ondergrond en afwatering","Oud gras en grond weg, zand en verdichting voor een vlakke, waterdoorlatende basis."),("Aanleg en afwerking","Kunstgras strak gelegd, naden verlijmd en randen netjes afgewerkt."),("Combineren met terras en pad","Kunstgras naast bestrating of een houtlook pad, zoals in onze projecten."),("Oud gras verwijderen","Wij verwijderen en voeren het oude gazon af.")],
   faq=[("Heeft kunstgras onderhoud nodig?","Veel minder dan gras, maar af en toe schoonmaken en afharken is verstandig."),("Welk kunstgras past bij mijn tuin?","Dat hangt af van gebruik, kleur en budget. Wij adviseren en nemen het gekozen materiaal op in de offerte."),("Kunt u ook het oude gras verwijderen?","Ja, inclusief afvoer.")],
   gallery=[("terras-kunstgras-opgeleverd","Achtertuin met kunstgras"),("terras-houtlook-kunstgras-pad-1","Houtlook pad tussen kunstgras"),("terras-kunstgras-zwart-plantenbak-1","Kunstgras bij zwarte plantenbakken")]),
 "groenafval-en-onkruid": dict(title="Onkruid verwijderen en groenafval afvoeren Dordrecht — Sealcleaning", desc="Onkruid verwijderen, kleine bomen en struiken weghalen en groenafval of oud materiaal afvoeren in Dordrecht en omgeving. Vraag vrijblijvend een offerte aan.",
   h1="Onkruid, groenafval en opruimen", crumb="Onkruid en groenafval", img="plantvak-leeggemaakt-voortuin", alt="Leeggemaakt plantvak in een voortuin, werk van Sealcleaning",
   lede="Een overwoekerde tuin weer vrij: onkruid weg, kleine bomen en struiken verwijderd en alles netjes afgevoerd.",
   usp=[("vak","Onkruid en wortels"),("plaatsing","Kleine bomen en struiken"),("materiaal","Afvoer groenafval en oud materiaal"),("offerte","Duidelijke offerte")],
   cards=[("Onkruid verwijderen","Borders, bestrating en kantjes schoon, met aandacht voor de wortels."),("Kleine bomen en struiken","Verwijderen van kleine bomen en struiken die in de weg staan of dood zijn."),("Groenafval afvoeren","Snoeiafval en tuinafval nemen wij mee."),("Oud materiaal afvoeren","Oude schutting, tegels of puin afvoeren bij een renovatie.")],
   faq=[("Voeren jullie het afval ook af?","Ja, groenafval en oud materiaal kunnen worden afgevoerd. Dit staat apart in de offerte."),("Kunnen ook grotere bomen weg?","Wij verwijderen kleine bomen en struiken. Voor grotere bomen bespreken wij eerst de mogelijkheden."),("Kan dit samen met tuinonderhoud?","Ja, als eenmalige opruiming vooraf of als start van periodiek onderhoud.")]),
}

def service_page(slug, d):
    r = "../"
    t = (R / "tuinaanleg/index.html").read_text()
    t = re.sub(r"<title>.*?</title>", f"<title>{d['title']}</title>", t, count=1)
    t = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + d["desc"], t, count=1)
    t = t.replace("sealcleaning.nl/tuinaanleg/", f"sealcleaning.nl/{slug}/").replace("Tuinaanleg Dordrecht — Sealcleaning", d["title"].split(" — ")[0])
    t = re.sub(r'"serviceType": "[^"]*"', f'"serviceType": "{d["h1"]}"', t, count=1)
    b1 = f'<a href="{r}contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a>'
    b2 = f'<a href="#diensten-lijst" class="btn btn-light btn-lg">Bekijk wat we doen</a>'
    cards = "".join(f'<li class="v-why-card"><h3>{a}</h3><p>{b}</p></li>' for a, b in d["cards"])
    faq = "".join(f'<details class="faq-item"><summary>{q}<span class="chev"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span></summary><p>{a}</p></details>' for q, a in d["faq"])
    gal = ""
    if d.get("gallery"):
        gal = '<section class="v-section" aria-labelledby="titel-werk"><div class="container"><div class="v-section-head"><h2 class="v-h2" id="titel-werk">Uit onze projecten</h2></div><div class="v-projects v-projects-3">' + "".join(f'<a class="v-project" href="{r}projecten/"><figure style="margin:0;height:100%">{rpic(r, n, c + ", werk van Sealcleaning", "(max-width: 700px) 92vw, 360px")}<figcaption><strong>{c}</strong>Eigen werk</figcaption></figure></a>' for n, c in d["gallery"]) + '</div></div></section>'
    area = "Wij werken in Dordrecht, Zwijndrecht, Hendrik-Ido-Ambacht, de Drechtsteden en Rotterdam e.o."
    main = f"""<main id="main">

  {real_hero(r, d["img"], d["alt"], d["h1"], d["lede"], b1, b2, d["crumb"])}

  {usp(d["usp"])}

  <section class="v-section" id="diensten-lijst" aria-labelledby="titel-doen"><div class="container">
    <div class="v-section-head"><h2 class="v-h2" id="titel-doen">Wat wij voor u doen</h2><p class="v-lede">{area} Een vaste prijs hangt af van uw situatie; u ontvangt een duidelijke offerte.</p></div>
    <ul class="v-why v-why--cards">{cards}</ul>
  </div></section>

  {gal}

  <section class="v-section v-sand" aria-labelledby="titel-faq-d"><div class="container"><div class="v-section-head"><h2 class="v-h2" id="titel-faq-d">Veelgestelde vragen</h2></div><div class="faq-list">{faq}</div></div></section>

  <section class="v-section" aria-labelledby="titel-advies"><div class="container">
    <div class="v-advice"><div><h2 id="titel-advies">Vrijblijvend een offerte?</h2><p>Beschrijf uw situatie of stuur foto's mee. Wij komen graag langs voor een bezichtiging in Dordrecht en omgeving.</p></div>
    <div class="btn-row"><a class="btn btn-primary btn-lg" href="{r}contact/">Vraag een offerte aan</a><a class="btn btn-secondary btn-lg" href="{r}schutting-ontwerpen/">Tuin ontwerpen in 3D</a></div></div>
  </div></section>

</main>"""
    hs = t.index('<main id="main">'); he = t.index("</main>") + len("</main>")
    t = t[:hs] + main + t[he:]
    (R / slug).mkdir(exist_ok=True); (R / slug / "index.html").write_text(t)

if __name__ == "__main__":
    for k, v in SERVICE_PAGES.items(): service_page(k, v)
    print("diensten ok")
