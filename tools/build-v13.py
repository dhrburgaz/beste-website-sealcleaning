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
     ("plantenbakken/", "Plantenbakken", "Groen in elke tuin", ipic("plantenbakken-cortenstaal-avond", ALT["plantenbakken-cortenstaal-avond"], r, SIZES), True),
     ("tuinonderhoud/", "Tuinonderhoud", "Altijd een verzorgde tuin", rpic(r, "voortuin-haag-gesnoeid", "Strak gesnoeide haag in een voortuin, onderhoud door Sealcleaning", SIZES), False),
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

  {usp([("advies","Gratis bezichtiging in Dordrecht"),("plaatsing","Professionele plaatsing"),("materiaal","Materiaalkeuze op maat"),("offerte","Duidelijke offerte"),("bezoek","Persoonlijk advies")])}

  <section class="v-section" id="diensten" aria-labelledby="titel-help">
    <div class="container">
      <div class="v-section-head"><h2 class="v-h2" id="titel-help">Waar kunnen we u mee helpen?</h2><p class="v-lede">Kies wat het beste past. Twijfelt u? Dan denken we graag met u mee.</p></div>
      <ul class="v-cards v-cards-4">{"".join(service_card(r, *c) for c in cards)}</ul>
      <p class="i-disclaimer">Beelden met &lsquo;Impressie&rsquo; zijn voorbeelden van mogelijke uitvoeringen, geen opgeleverde projecten van Sealcleaning.</p>
    </div>
  </section>

  <section class="v-section v-3d-wrap" aria-labelledby="titel-3d">
    <div class="container">
      <div class="v-3d-panel">
        <div class="v-3d-copy">
          <h2 id="titel-3d">Bekijk uw tuinidee in 3D</h2>
          <p>Kies eenvoudig uw stijl, materiaal en indeling. Geen technische kennis nodig. Ook als u niet precies weet hoe u moet meten, helpen we u verder.</p>
          <p><a href="schutting-ontwerpen/" class="btn btn-light btn-lg">Start 3D-ontwerp {ARROW}</a></p>
          <div class="v-3d-tools">
            <button type="button" class="v-chip" data-3d-iso>Schuin van boven</button>
            <button type="button" class="v-chip" data-3d-top>Van boven</button>
            <button type="button" class="v-chip" data-3d-reset>Terug naar begin</button>
          </div>
          <p class="v-3d-status" data-home-3d-status role="status">Voorbeeld in 3D, geen echt project.</p>
        </div>
        <div class="v-3d-stage" data-home-3d>
          <div class="v-3d-poster" aria-hidden="true"><span>Voorbeeldtuin laden…</span></div>
          <div data-home-3d-canvas></div>
          <svg data-home-3d-flat hidden role="img" aria-label="Voorbeeldtuin in 2D, bovenaanzicht"></svg>
        </div>
      </div>
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
 ("schutting-composiet-antraciet-terras", "Modern", "Strak en tijdloos", "composiet"),
 ("schutting-verticaal-hout-zwarte-palen", "Klassiek", "Rustiek en stijlvol", "hout"),
 ("schutting-hardhout-horizontaal-zonsondergang", "Horizontaal", "Modern en luxe", "lamellen"),
 ("tuin-terras-donkere-schutting-avond", "Composiet zwart", "Donker, strak en gesloten", "composiet"),
 ("schutting-grenen-betonpalen-dag", "Hout-beton", "Warm hout tussen betonpalen", "hout-beton"),
 ("poort-hout-pad-dag", "Met poort", "Schutting en poort in één stijl", None),
]
def style_card(rel, n, t, sub, mat):
    link = f"{rel}schutting-ontwerpen/" + (f"?materiaal={mat}" if mat else "")
    return (f'<li class="i-card"><figure class="i-card-img">{ipic(n, ALT[n], rel, "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 380px")}<span class="i-tag">Impressie</span></figure>'
            f'<div class="i-card-body"><h3>{t}</h3><p>{sub}</p><div class="i-card-actions"><a class="btn btn-primary" href="{link}">Bekijk mogelijkheden</a><a class="btn btn-secondary" href="{rel}contact/">Vraag offerte aan</a></div></div></li>')

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
