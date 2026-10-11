#!/usr/bin/env python3
"""Plaatst de aangeleverde inspiratiefoto's (images/inspiratie/) op home, dienstpagina's en /inspiratie/. Idempotent via markers."""
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
NOTE = "Laat je inspireren door verschillende stijlen en afwerkingen. Wij bespreken samen de mogelijkheden en stemmen de definitieve materialen vooraf met je af."
DISC = "Impressiebeelden: voorbeelden van mogelijke uitvoeringen, geen opgeleverde projecten van Sealcleaning en geen gegarandeerde exacte producten."
CAP = "Impressiebeeld, geen opgeleverd project"
def pic(n, alt, rel, sizes, eager=False, w=1448, h=1086):
    b = f"{rel}images/inspiratie/{n}"
    ld = 'fetchpriority="high" ' if eager else 'loading="lazy" '
    return (f'<picture><source srcset="{b}-640.webp 640w, {b}-960.webp 960w, {b}.webp 1448w" sizes="{sizes}" type="image/webp">'
            f'<img src="{b}.jpg" alt="{alt}" width="{w}" height="{h}" {ld}decoding="async"></picture>')
ALT = {
 "tuin-loungehoek-avond": "Tuin in de avond met loungehoek, verlichte planten en een houten schutting",
 "schutting-hardhout-horizontaal-zonsondergang": "Horizontale houten schutting in warm zonlicht, met plantenborder en terras",
 "schutting-grenen-betonpalen-dag": "Horizontale houten planken tussen betonpalen, met siergras en hortensia",
 "schutting-verticaal-hout-zwarte-palen": "Verticale houten planken tussen zwarte palen langs een gazon en terras",
 "schutting-composiet-antraciet-terras": "Antracietkleurige schutting bij een grijs terras en loungeset",
 "schutting-hout-wandverlichting-avond": "Horizontale houten schutting met lichtpunten op de zwarte palen, in de schemering",
 "poort-hout-pad-dag": "Houten tuinpoort met horizontale planken en een pad van natuursteentegels",
 "tuinpad-stapplaten-avond": "Tuinpad van grote stapplaten tussen grind, met verlichte trap en loungehoek",
 "plantenbakken-cortenstaal-avond": "Plantenbakken van cortenstaal en antraciet met olijfboom en lavendel",
 "tuin-cortenbakken-grindpad-avond": "Avondtuin met cortenstalen plantenbakken, grind en een pad van stapplaten",
 "tuin-gazon-terras-dag": "Ruime tuin met gazon, grote terrastegels, plantenbakken en overkapping",
 "tuin-terras-eettafel-dag": "Zonnig terras met eettafel, grote tegels, gazon en plantenbakken",
 "tuin-pergola-avond-blauw": "Tuin met pergola, loungehoek en verlichting in de avondschemering",
 "tuin-terras-donkere-schutting-avond": "Terras met donkere schutting, grote tegels en sfeerverlichting in de avond",
}
def A(n): return ALT[n]
def cap(): return f'<p class="i-caption">{CAP}</p>'

def hero_swap(path, name, rel, hero_class="hero-media"):
    f = R / path; s = f.read_text()
    s = re.sub(r'(<div class="%s">\s*)<picture>.*?</picture>' % hero_class, lambda m: m.group(1) + pic(name, A(name), rel, "100vw", True), s, count=1, flags=re.S)
    if "i-caption" not in s.split("</section>")[0] and f"{CAP}" not in s[:s.find("</section>", s.find(hero_class))]:
        s = re.sub(r'(<div class="%s">.*?</div>)' % hero_class, lambda m: m.group(1) + "\n    " + cap(), s, count=1, flags=re.S)
    f.write_text(s)

# 1. hero's
hero_swap("index.html", "tuin-loungehoek-avond", "", "v-hero-media")
hero_swap("bestrating/index.html", "tuinpad-stapplaten-avond", "../")
hero_swap("tuinaanleg/index.html", "tuin-gazon-terras-dag", "../")
hero_swap("tuinrenovatie/index.html", "tuin-terras-eettafel-dag", "../")
hero_swap("tuinonderhoud/index.html", "tuin-pergola-avond-blauw", "../")

STIJLEN = [
 ("schutting-hardhout-horizontaal-zonsondergang", "Warm hout, horizontaal", "Brede horizontale planken in een warme houtlook. Een rustige, moderne uitstraling.", "lamellen"),
 ("schutting-grenen-betonpalen-dag", "Hout tussen betonpalen", "Houten planken tussen stevige betonpalen. Strak en rustig in een moderne tuin.", "hout-beton"),
 ("schutting-verticaal-hout-zwarte-palen", "Verticaal hout, zwarte palen", "Verticale planken tussen zwarte palen. Een hoge, gesloten wand voor veel privacy.", "hout"),
 ("schutting-composiet-antraciet-terras", "Antraciet composiet", "Een gesloten antracietkleurig vlak. Past bij strakke tegels en moderne tuinmeubels.", "composiet"),
 ("schutting-hout-wandverlichting-avond", "Hout met sfeerverlichting", "Een houten schutting met lichtpunten op de palen, voor tuinen waar je ook 's avonds van geniet.", "hout"),
]
def card_style(rel, n, t, d, mat):
    return (f'<li class="i-card"><figure class="i-card-img">{pic(n, A(n), rel, "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 380px")}</figure>'
            f'<div class="i-card-body"><h3>{t}</h3><p>{d}</p><div class="i-card-actions">'
            f'<a class="btn btn-primary" href="{rel}schutting-ontwerpen/?materiaal={mat}">Bekijk mogelijkheden</a>'
            f'<a class="btn btn-secondary" href="{rel}contact/">Vraag offerte aan</a></div></div></li>')
def section_styles(rel):
    return ('<!--i-stijlen--><section class="v-section" id="stijlen" aria-labelledby="titel-stijlen"><div class="container">'
            '<div class="v-section-head"><p class="v-eyebrow">Schuttingen</p><h2 class="v-h2" id="titel-stijlen">Vijf stijlen om uit te kiezen</h2>'
            f'<p class="v-lede">{NOTE}</p></div><ul class="i-cards">' + "".join(card_style(rel, *x) for x in STIJLEN) +
            f'<li class="i-card i-card-poort"><figure class="i-card-img">{pic("poort-hout-pad-dag", A("poort-hout-pad-dag"), rel, "(max-width: 700px) 92vw, 380px")}</figure>'
            f'<div class="i-card-body"><h3>Met een poort</h3><p>Een poort in dezelfde stijl als je schutting. Je kiest de breedte en de plek in de ontwerper. Wij controleren of het past.</p>'
            f'<div class="i-card-actions"><a class="btn btn-primary" href="{rel}schutting-ontwerpen/">Bekijk mogelijkheden</a><a class="btn btn-secondary" href="{rel}contact/">Vraag offerte aan</a></div></div></li>'
            f'</ul><p class="i-disclaimer">{DISC}</p></div></section>')
f = R / "schuttingen/index.html"; s = f.read_text()
if "<!--i-stijlen-->" not in s:
    s = s.replace('  <section class="section section-sand-deep">', "  " + section_styles("../") + '\n\n  <section class="section section-sand-deep">', 1); f.write_text(s)

# 2. galerij-sectie (home + diensten)
def gallery(rel, title, eyebrow, items, ident):
    cards = "".join(f'<li class="i-photo"><figure>{pic(n, A(n), rel, "(max-width: 700px) 92vw, 380px")}<figcaption>{c}</figcaption></figure></li>' for n, c in items)
    return (f'<!--i-{ident}--><section class="v-section v-sand" id="inspiratie-{ident}" aria-labelledby="titel-i-{ident}"><div class="container">'
            f'<div class="v-section-head"><p class="v-eyebrow">{eyebrow}</p><h2 class="v-h2" id="titel-i-{ident}">{title}</h2><p class="v-lede">{NOTE}</p></div>'
            f'<ul class="i-photos">{cards}</ul><p class="i-disclaimer">{DISC} <a href="{rel}inspiratie/">Meer inspiratie</a> · <a href="{rel}contact/">Bespreek jouw idee</a></p></div></section>')
HOME = [("tuin-terras-donkere-schutting-avond","Donkere schutting, grote tegels"),("tuinpad-stapplaten-avond","Pad van stapplaten"),("plantenbakken-cortenstaal-avond","Plantenbakken van cortenstaal"),("tuin-gazon-terras-dag","Gazon en terras"),("schutting-verticaal-hout-zwarte-palen","Verticaal hout"),("tuin-pergola-avond-blauw","Overkapping met verlichting")]
f = R / "index.html"; s = f.read_text()
if "<!--i-home-->" not in s:
    s = s.replace('  <section class="v-section v-sand" aria-labelledby="titel-projecten">', "  " + gallery("", "Zo zou je jouw tuin ook willen hebben", "Inspiratie", HOME, "home") + '\n\n  <section class="v-section v-sand" aria-labelledby="titel-projecten">', 1); f.write_text(s)
SERV = {
 "bestrating": [("tuinpad-stapplaten-avond","Stapplaten in grind"),("tuin-cortenbakken-grindpad-avond","Pad langs plantenbakken"),("tuin-terras-eettafel-dag","Terras met grote tegels")],
 "tuinaanleg": [("tuin-gazon-terras-dag","Gazon, terras en overkapping"),("plantenbakken-cortenstaal-avond","Plantenbakken van cortenstaal"),("tuin-cortenbakken-grindpad-avond","Beplanting en verlichting")],
 "tuinrenovatie": [("tuin-terras-donkere-schutting-avond","Een tuin opnieuw ingedeeld"),("tuin-gazon-terras-dag","Nieuw terras en gazon"),("plantenbakken-cortenstaal-avond","Plantenbakken")],
 "tuinonderhoud": [("tuin-terras-eettafel-dag","Een verzorgde tuin"),("tuin-loungehoek-avond","Genieten in de avond"),("tuin-pergola-avond-blauw","Tuin met verlichting")],
}
TIT = {"bestrating":"Inspiratie voor terras en tuinpad","tuinaanleg":"Inspiratie voor aanleg en plantenbakken","tuinrenovatie":"Inspiratie voor een vernieuwde tuin","tuinonderhoud":"Inspiratie voor een verzorgde tuin"}
for k, items in SERV.items():
    f = R / k / "index.html"; s = f.read_text()
    if "<!--i-dienst-->" in s: continue
    block = gallery("../", TIT[k], "Inspiratie", items, "dienst").replace("<!--i-dienst-->", "<!--i-dienst-->")
    i = s.find('  <section class="section">', s.find('page-hero'))
    # voor de slot-CTA invoegen
    j = s.find("<!-- PREMIUM CLOSING CTA -->")
    s = s[:j].rstrip() + "\n\n  " + block + "\n</main>\n" + s[j:] if False else s
    m = re.search(r'\n\s*</main>', s)
    s = s[:m.start()] + "\n\n  " + block + s[m.start():]
    f.write_text(s)
print("ok")

# 3. /inspiratie/ galerij met filter
p = R / "inspiratie/index.html"; s = p.read_text()
if "data-i-gallery" not in s:
    ITEMS=[("schutting-hardhout-horizontaal-zonsondergang","Warm hout, horizontaal","schutting"),("schutting-grenen-betonpalen-dag","Hout tussen betonpalen","schutting"),("schutting-verticaal-hout-zwarte-palen","Verticaal hout, zwarte palen","schutting"),("schutting-composiet-antraciet-terras","Antraciet composiet","schutting"),("schutting-hout-wandverlichting-avond","Hout met sfeerverlichting","schutting avond"),("poort-hout-pad-dag","Houten poort met pad","schutting"),("tuinpad-stapplaten-avond","Pad van stapplaten","terras avond"),("tuin-terras-eettafel-dag","Terras met eettafel","terras"),("tuin-gazon-terras-dag","Gazon en terras","terras"),("plantenbakken-cortenstaal-avond","Cortenstalen plantenbakken","bakken avond"),("tuin-cortenbakken-grindpad-avond","Bakken en grindpad","bakken avond terras"),("tuin-terras-donkere-schutting-avond","Donkere schutting en terras","schutting terras avond"),("tuin-pergola-avond-blauw","Overkapping in de avond","terras avond"),("tuin-loungehoek-avond","Loungehoek in de avond","terras avond")]
    cards = "".join(f'<li class="i-photo" data-cat="{c}"><figure>{pic(n,A(n),"../","(max-width: 700px) 92vw, 380px")}<figcaption>{t}</figcaption></figure></li>' for n,t,c in ITEMS)
    FIL=[("all","Alles"),("schutting","Schuttingen"),("terras","Terrassen en bestrating"),("bakken","Plantenbakken"),("avond","Avondverlichting")]
    flt = "".join(f'<li><button type="button" data-f="{k}" aria-pressed="{"true" if k=="all" else "false"}">{l}</button></li>' for k,l in FIL)
    sec = (f'  <section class="v-section v-sand" aria-labelledby="titel-galerij" data-i-gallery><div class="container"><div class="v-section-head"><p class="v-eyebrow">Voorbeelden</p><h2 class="v-h2" id="titel-galerij">Laat je inspireren</h2><p class="v-lede">{NOTE}</p></div>'
           f'<ul class="i-filter" aria-label="Filter op soort">{flt}</ul><ul class="i-photos">{cards}</ul><p class="i-disclaimer">{DISC}</p>'
           f'<p style="margin-top:1rem;display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-primary" href="../schutting-ontwerpen/">Ontwerp je schutting</a> <a class="btn btn-secondary" href="../contact/">Bespreek jouw idee</a></p></div></section>\n')
    s = s.replace('  <section class="section-tight">', sec + '  <section class="section-tight">', 1)
    p.write_text(s)
