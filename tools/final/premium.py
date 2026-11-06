"""Premium homepage (hero + interactieve 3D-tuin) en fotografische onderdelen. Idempotent; draai na pages.py/diensten.py.
Gebruik: python3 tools/final/premium.py"""
import re, html, os
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "/"
e = html.escape
rd = lambda p: open(R + p, encoding="utf-8").read()
def wr(p, s): open(R + p, "w", encoding="utf-8").write(s)
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

# afbeelding: (bestand zonder extensie, breedte, hoogte, alt)  -- alle impressiebeelden (geen eigen werk)
IMG = {
 "avond":    ("tuin-loungehoek-avond", 1448, 1086, "Tuin in de avond met loungehoek, verlichte planten en een houten schutting"),
 "zonsondergang": ("schutting-hardhout-horizontaal-zonsondergang", 1448, 1086, "Horizontale houten schutting in warm avondlicht, met plantenborder en loungehoek"),
 "verticaal": ("schutting-verticaal-hout-zwarte-palen", 1448, 1086, "Verticale houten schutting met zwarte palen, gazon en terras"),
 "composiet": ("schutting-composiet-antraciet-terras", 1448, 1086, "Antracietkleurige horizontale schutting naast een terras met plantenborder"),
 "betonpalen": ("schutting-grenen-betonpalen-dag", 1448, 1086, "Houten schutting tussen betonpalen met gazon, terras en loungeset"),
 "wand": ("schutting-hout-wandverlichting-avond", 1448, 1086, "Houten schutting met wandverlichting in de avond en een border met siergrassen"),
 "poort": ("poort-hout-pad-dag", 1448, 1086, "Houten poort in een schutting met tuinpad en beplanting"),
 "stapplaten": ("tuinpad-stapplaten-avond", 1448, 1086, "Tuinpad van grote stapplaten tussen grind, met verlichting en beplanting"),
 "cortenpad": ("tuin-cortenbakken-grindpad-avond", 1448, 1086, "Stapplatenpad langs cortenstalen plantenbakken en grind, verlicht in de avond"),
 "terras-avond": ("tuin-terras-donkere-schutting-avond", 1448, 1086, "Terras met donkere schutting, verlichting en plantenbakken in de avond"),
 "terras-dag": ("tuin-terras-eettafel-dag", 1448, 1086, "Terras met eettafel, gazon en plantenbakken op een zonnige dag"),
 "gazon": ("tuin-gazon-terras-dag", 1448, 1086, "Ruime tuin met gazon, grote terrastegels, plantenbakken en overkapping"),
 "pergola": ("tuin-pergola-avond-blauw", 1448, 1086, "Tuin met pergola, loungehoek en tuinverlichting in de schemering"),
 "bakken": ("plantenbakken-cortenstaal-avond", 1448, 1086, "Cortenstalen plantenbakken met siergrassen en olijfboom bij een terras"),
}
def pic(key, sizes, cls="", lazy=True, tag=False, alt=None, rel=""):
    n, w, h, a = IMG[key]
    base = f"{rel}images/inspiratie/{n}"
    attrs = 'loading="lazy" decoding="async"' if lazy else 'fetchpriority="high" decoding="async"'
    t = '<span class="i-tag">Impressie</span>' if tag else ""
    return (f'<picture><source srcset="{base}-640.webp 640w, {base}-960.webp 960w, {base}.webp {w}w" sizes="{sizes}" type="image/webp">'
            f'<img src="{base}.jpg" alt="{e(alt or a)}" width="{w}" height="{h}" {attrs}></picture>{t}')

SERVICES = [  # slug, titel, korte tekst, afbeeldingssleutel
 ("schuttingen", "Schuttingen", "Hout, hout-beton en composiet, plaatsen of vervangen.", "zonsondergang"),
 ("bestrating", "Bestrating", "Paden, terrassen en opritten aanleggen, ophogen of herstellen.", "stapplaten"),
 ("tuinaanleg", "Tuinaanleg", "Een tuin die bij u past.", "pergola"),
 ("tuinrenovatie", "Tuinrenovatie", "Een bestaande tuin vernieuwen.", "gazon"),
 ("tuinonderhoud", "Tuinonderhoud", "Hagen, struiken, onkruid, blad en winterklaar maken.", "terras-dag"),
 ("periodiek-tuinonderhoud", "Periodiek tuinonderhoud", "Vaste onderhoudsmomenten voor uw tuin.", "wand"),
 ("snoeiwerk", "Snoeiwerk", "Hagen, heggen, heesters en geschikte kleinere bomen.", "poort"),
 ("plantenbakken", "Plantenbakken", "Plantenbakken en verhoogde borders.", "bakken"),
 ("kunstgras", "Kunstgras", "Ondergrond, aanleg en afwerking.", "terras-avond"),
 ("groenafval-en-onkruid", "Onkruid en groenafval", "Verwijderen en eventueel afvoeren.", "cortenpad"),
]
def svc_card(slug, t, txt, key, rel=""):
    n, w, h, a = IMG[key]; base = f"{rel}images/inspiratie/{n}"
    return (f'<li><a class="v-card" href="{rel}{slug}/"><span class="v-card-img"><picture><source srcset="{base}-640.webp 640w, {base}-960.webp 960w" sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 300px" type="image/webp">'
            f'<img src="{base}.jpg" alt="{e(a)}" width="{w}" height="{h}" loading="lazy" decoding="async"></picture><span class="i-tag">Impressie</span></span>'
            f'<span class="v-card-body"><strong>{e(t)}</strong><span class="v-card-txt">{e(txt)}</span></span></a></li>')
def hogedruk_card():
    return ('<li><a class="v-card" href="hogedrukreiniging/"><span class="v-card-img"><picture><source srcset="images/projects/hogedrukreiniging-oprit-klinkers-resultaat-640.webp 640w, images/projects/hogedrukreiniging-oprit-klinkers-resultaat-800.webp 800w" sizes="(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 300px" type="image/webp">'
            '<img src="images/projects/hogedrukreiniging-oprit-klinkers-resultaat.jpg" alt="Gereinigde klinkeroprit met een haag en een zwart geplaveid deel" width="1200" height="1600" loading="lazy" decoding="async"></picture></span>'
            '<span class="v-card-body"><strong>Hogedrukreiniging</strong><span class="v-card-txt">Mos, onkruid en vuil verwijderen.</span></span></a></li>')

def home_main():
    cards = "".join(svc_card(*s) for s in SERVICES[:7]) + hogedruk_card() + "".join(svc_card(*s) for s in SERVICES[7:])
    old = rd("index.html"); m = re.search(r'<div class="v-projects v-projects-3">.*?</div>\n    <p style="margin-top:1.25rem"><a class="link-underline" href="projecten/">Bekijk alle projecten</a></p>', old, re.S)
    projecten = m.group(0)
    projecten = projecten.replace("hogedrukreiniging-oprit-klinkers-aanhanger", "hogedrukreiniging-zijpad-klinkers-avondzon").replace('alt="Klinkeroprit met werkslang en aanhanger tijdens het reinigen met hogedruk"', 'alt="Klinkerpad langs een woning met een haag, in de avondzon"').replace('width="1600" height="1200"', 'width="1200" height="1600"')
    hero = f'''<section class="v-hero v-hero--stage" aria-labelledby="hero-titel">
    <div class="v-hero-media">{pic("avond", "100vw", lazy=False)}</div>
    <div class="v-hero-scrim"></div>
    <div class="container v-hero-grid">
      <div class="v-hero-copy">
        <p class="v-eyebrow v-eyebrow--light">Sealcleaning Groenonderhoud &amp; Aanleg</p>
        <h1 id="hero-titel">Groenonderhoud en tuinaanleg in Dordrecht</h1>
        <p class="v-hero-lede">Tuinonderhoud, snoeiwerk, schuttingen, bestrating, hogedrukreiniging en kunstgras. Bekijk rechts een voorbeeldtuin in 3D en vraag een offerte aan voor uw eigen tuin.</p>
        <div class="btn-row"><a href="contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a><a href="#" class="btn btn-light btn-lg v-hide-sm" data-tel>Bel ons</a><a href="#" class="btn btn-light btn-lg v-hide-sm" data-whatsapp data-whatsapp-msg="Hallo Sealcleaning, ik heb een vraag over een klus in mijn tuin.">WhatsApp</a></div>
      </div>
      <div class="v-hero-3d" id="ontwerp3d">
        <div class="v-3d-stage" data-home-3d>
          <div class="v-3d-poster"><img src="images/home-3d-poster.jpg" alt="Voorbeeldtuin in 3D: houten schutting op betonnen onderplaat, terras en borders" width="1284" height="884" decoding="async"><span>3D-voorbeeld wordt geladen…</span></div>
          <div data-home-3d-canvas></div>
          <svg data-home-3d-flat hidden role="img" aria-label="Voorbeeldtuin in 2D, bovenaanzicht"></svg>
        </div>
        <div class="v-3d-bar v-3d-bar--hero">
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
        <p class="v-3d-status" data-home-3d-status role="status">Voorbeeld in 3D, geen echt project. Sleep om rond te kijken.</p>
      </div>
    </div>
    <p class="i-caption">Impressiebeeld, geen opgeleverd project</p>
  </section>'''
    return f'''<main id="main">

  {hero}

  <div class="v-usp" aria-label="Kenmerken"><div class="container"><ul>
    <li><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg><span>Dordrecht en de Drechtsteden</span></li>
    <li><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 8l9-5 9 5v8l-9 5-9-5z M3 8l9 5 9-5 M12 13v8"/></svg><span>Materiaal los of met montage</span></li>
    <li><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 20h16 M6 20V8l6-4 6 4v12 M10 20v-6h4v6"/></svg><span>Hout, hout-beton en composiet</span></li>
    <li><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 4h14v16H5z M8 9h8 M8 13h8 M8 17h5"/></svg><span>Offerte voor uw situatie</span></li>
  </ul></div></div>

  <section class="v-section" id="diensten" aria-labelledby="titel-diensten"><div class="container">
    <div class="v-section-head"><p class="v-eyebrow">Diensten</p><h2 class="v-h2" id="titel-diensten">Wat wij voor u doen</h2><p class="v-lede">Kies de werkzaamheid die bij u past. Twijfelt u? Neem contact op, dan denken wij met u mee. De beelden met "Impressie" laten mogelijkheden zien en zijn geen opgeleverde projecten.</p></div>
    <ul class="v-cards v-cards-4">{cards}</ul>
  </div></section>

  <section class="v-section v-band" aria-labelledby="titel-band">
    <div class="v-band-media">{pic("composiet", "100vw")}</div><div class="v-band-scrim"></div>
    <div class="container v-band-inner"><h2 id="titel-band">Schuttingen in hout, hout-beton en composiet</h2><p>Wij plaatsen schuttingen en poorten en adviseren over materiaal en afwerking. Het materiaal schaft u zelf aan of nemen wij op in de offerte, los of samen met montage.</p><div class="btn-row"><a class="btn btn-light btn-lg" href="schuttingen/">Bekijk schuttingen</a><a class="btn btn-line-light btn-lg" href="schutting-ontwerpen/">Ontwerp uw schutting in 3D</a></div></div>
    <p class="i-caption">Impressiebeeld, geen opgeleverd project</p>
  </section>

  <section class="v-section v-sand" aria-labelledby="titel-werk"><div class="container">
    <div class="v-section-head"><p class="v-eyebrow">Projecten</p><h2 class="v-h2" id="titel-werk">Ons werk</h2><p class="v-lede">Een selectie van werk dat wij hebben uitgevoerd.</p></div>
    {projecten}
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

  <section class="v-section v-band v-band--evening" aria-labelledby="titel-regio">
    <div class="v-band-media">{pic("wand", "100vw")}</div><div class="v-band-scrim"></div>
    <div class="container v-band-inner"><h2 id="titel-regio">Waar wij werken</h2><p>Sealcleaning is gevestigd in Dordrecht en werkt in Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de Drechtsteden. Werkt u daarbuiten? Neem contact op, dan bekijken we wat mogelijk is.</p><div class="btn-row"><a class="btn btn-primary btn-lg" href="contact/">Vraag een offerte aan</a><a class="btn btn-line-light btn-lg" href="werkgebied/">Ons werkgebied</a></div></div>
    <p class="i-caption">Impressiebeeld, geen opgeleverd project</p>
  </section>

</main>'''

def home():
    s = rd("index.html")
    s = re.sub(r"<main.*?</main>", lambda m: home_main(), s, count=1, flags=re.S)
    if 'type="importmap"' not in s:
        s = s.replace('<link rel="stylesheet" href="css/v12.css">', '<link rel="stylesheet" href="css/v12.css">\n<script type="importmap">\n{\n  "imports": {\n    "three": "./vendor/three/three.module.js",\n    "three/addons/": "./vendor/three/examples/jsm/"\n  }\n}\n</script>', 1)
    if "js/v12/home3d.js" not in s:
        s = s.replace('<script src="js/main.js"></script>', '<script src="js/main.js"></script>\n<script type="module" src="js/v12/home3d.js"></script>', 1)
    s = s.replace('<meta property="og:image" content="https://sealcleaning.nl/images/branding/logo.jpg">', '<meta property="og:image" content="https://sealcleaning.nl/images/inspiratie/tuin-loungehoek-avond.jpg">')
    wr("index.html", s)

PAGES = {  # slug: (heldenbeeld, [galerij], titel galerij)
 "schuttingen": ("zonsondergang", ["verticaal", "composiet", "betonpalen", "poort", "wand"], "Impressies: schuttingen en poorten"),
 "bestrating": ("stapplaten", ["terras-dag", "cortenpad", "terras-avond"], "Impressies: paden en terrassen"),
 "tuinaanleg": ("pergola", ["gazon", "avond", "terras-dag"], "Impressies: tuinen"),
 "tuinrenovatie": ("gazon", ["cortenpad", "avond", "bakken"], "Impressies: vernieuwde tuinen"),
 "tuinonderhoud": ("terras-dag", ["poort", "wand", "bakken"], "Impressies: verzorgde tuinen"),
 "periodiek-tuinonderhoud": ("wand", ["gazon", "poort", "terras-dag"], "Impressies: verzorgde tuinen"),
 "snoeiwerk": ("poort", ["wand", "bakken", "gazon"], "Impressies: beplanting en groen"),
 "plantenbakken": ("bakken", ["cortenpad", "terras-avond", "gazon"], "Impressies: plantenbakken en borders"),
 "kunstgras": ("terras-avond", ["gazon", "betonpalen", "terras-dag"], "Impressies: gazon en terras"),
 "groenafval-en-onkruid": ("cortenpad", ["bakken", "poort", "wand"], "Impressies: borders en paden"),
}
def service_photos():
    for slug, (hero, gal, ttl) in PAGES.items():
        f = f"{slug}/index.html"; s = rd(f)
        if "v-hero--photo" in s: continue
        s = s.replace('class="v-hero v-hero--page v-hero--plain"', 'class="v-hero v-hero--page v-hero--photo"', 1)
        s = s.replace('<div class="container v-hero-inner">', f'<div class="v-hero-media">{pic(hero, "100vw", lazy=False, rel="../")}</div><div class="v-hero-scrim"></div><div class="container v-hero-inner">', 1)
        s = s.replace('</div></section>\n\n  <section class="v-section" aria-labelledby="titel-doen">', '</div><p class="i-caption">Impressiebeeld, geen opgeleverd project</p></section>\n\n  <section class="v-section" aria-labelledby="titel-doen">', 1)
        items = "".join(f'<li>{pic(k, "(max-width: 700px) 92vw, 640px", tag=True, rel="../")}</li>' for k in gal)
        sec = (f'<section class="v-section" aria-labelledby="titel-impressie"><div class="container"><div class="v-section-head"><p class="v-eyebrow">Ter inspiratie</p><h2 class="v-h2" id="titel-impressie">{e(ttl)}</h2>'
               f'<p class="v-lede">Impressiebeelden van wat mogelijk is. Het zijn geen opgeleverde projecten van Sealcleaning en geen vaste producten of materialen; wat bij uw tuin past, bespreken wij met u.</p></div><ul class="v-photo-row">{items}</ul></div></section>\n\n  ')
        s = s.replace('<section class="v-section" aria-labelledby="titel-faq-d">', sec + '<section class="v-section" aria-labelledby="titel-faq-d">', 1)
        wr(f, s)

def ppic(name, w, h, alt, rel="../", sizes="(max-width: 700px) 92vw, 640px", lazy=True):
    b = f"{rel}images/projects/{name}"; a = 'loading="lazy" decoding="async"' if lazy else 'fetchpriority="high" decoding="async"'
    return (f'<picture><source srcset="{b}-640.webp 640w, {b}-800.webp 800w, {b}-960.webp 960w" sizes="{sizes}" type="image/webp"><img src="{b}.jpg" alt="{e(alt)}" width="{w}" height="{h}" {a}></picture>')

def hogedruk_photos():
    f = "hogedrukreiniging/index.html"; s = rd(f)
    if "v-hero--photo" in s: return
    s = s.replace('class="v-hero v-hero--page v-hero--plain"', 'class="v-hero v-hero--page v-hero--photo v-hero--real"', 1)
    s = s.replace('<div class="container v-hero-inner">', '<div class="v-hero-media">' + ppic("hogedrukreiniging-zijpad-klinkers-avondzon", 1200, 1600, "Klinkerpad langs een woning met een haag, in de avondzon", sizes="100vw", lazy=False) + '</div><div class="v-hero-scrim"></div><div class="container v-hero-inner">', 1)
    items = "".join(f'<li>{ppic(n, w, h, a)}</li>' for n, w, h, a in [
        ("hogedrukreiniging-klinkers-scheidslijn-voor-na", 1200, 1600, "Klinkers met een duidelijke scheidslijn tussen gereinigd en nog niet gereinigd"),
        ("hogedrukreiniging-oprit-klinkers-gereinigd-deel", 1200, 1600, "Klinkeroprit waarvan een deel is gereinigd"),
        ("hogedrukreiniging-oprit-klinkers-aanhanger", 1600, 1200, "Klinkeroprit met werkslang en aanhanger tijdens het reinigen")])
    sec = ('<section class="v-section" aria-labelledby="titel-foto"><div class="container"><div class="v-section-head"><p class="v-eyebrow">Uit ons werk</p><h2 class="v-h2" id="titel-foto">Hogedrukreiniging in de praktijk</h2>'
           '<p class="v-lede">Foto\'s van een oprit en pad die wij hebben gereinigd. Wat een reiniging oplevert, hangt af van de ondergrond en wat is afgesproken.</p></div>'
           f'<ul class="v-photo-row v-photo-row--portrait">{items}</ul></div></section>\n\n  ')
    s = s.replace('<section class="v-section" aria-labelledby="titel-faq-d">', sec + '<section class="v-section" aria-labelledby="titel-faq-d">', 1)
    wr(f, s)

def materialen():
    f = "materialen/index.html"; s = rd(f)
    s = s.replace(" Online bestellen is niet mogelijk; u vraagt een offerte aan.", " Wij adviseren u graag over geschikte materialen.")
    if "page-hero--photo" not in s:
        s = s.replace('class="page-hero page-hero--plain"', 'class="v-hero v-hero--page v-hero--photo"', 1)
        s = s.replace('<div class="container page-hero-inner">', '<div class="v-hero-media">' + pic("betonpalen", "100vw", lazy=False, rel="../") + '</div><div class="v-hero-scrim"></div><div class="container v-hero-inner">', 1)
        s = s.replace('</div></section>', '</div><p class="i-caption">Impressiebeeld, geen opgeleverd project</p></section>', 1)
        items = "".join(f'<li>{pic(k, "(max-width: 700px) 92vw, 640px", tag=True, rel="../")}</li>' for k in ["verticaal", "composiet", "stapplaten"])
        sec = ('<section class="section"><div class="container"><div class="v-section-head"><p class="v-eyebrow">Ter inspiratie</p><h2 class="v-h2">Materialen in de tuin</h2><p class="v-lede">Impressiebeelden van mogelijke uitvoeringen. Het zijn geen opgeleverde projecten en geen vaste producten; welk materiaal bij uw tuin past, bespreken wij met u.</p></div>'
               f'<ul class="v-photo-row">{items}</ul></div></section>\n  ')
        s = s.replace('<section class="section section-sand-deep"><div class="container-narrow"><h2>Los of met montage', sec + '<section class="section section-sand-deep"><div class="container-narrow"><h2>Los of met montage', 1)
    wr(f, s)

if __name__ == "__main__":
    home(); service_photos(); hogedruk_photos(); materialen()
    print("home en dienstpagina's herschreven")
