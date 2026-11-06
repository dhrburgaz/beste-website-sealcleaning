"""Algemene opschoning van alle publieke NL-pagina's: gedeelde slotbanner, structured data zonder onbevestigde gegevens, regio-teksten.
Gebruik: python3 tools/final/sweep.py (idempotent)"""
import glob, re, os
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "/"
os.chdir(R)
ALLOWED = re.compile(r"images/projects/(?:hogedruk|schutting-grenen-zwarte-voet|schutting-kastanje-paaltjes)")
FOOT = '''<section class="footer-cta">
  <div class="container-narrow reveal">
    <p class="eyebrow">Aan de slag</p>
    <h2>Vertel ons wat u wilt laten doen.</h2>
    <p>Vraag een offerte aan, of stuur ons een bericht via WhatsApp voor een persoonlijk antwoord.</p>
    <div class="btn-row" style="justify-content:center">
      <a href="%scontact/" class="btn btn-ghost-light btn-lg" style="background:#fff;color:var(--c-forest);border-color:#fff">Vraag een offerte aan</a>
      <a href="#" class="btn btn-ghost-light btn-lg" data-whatsapp data-whatsapp-msg="Hallo Sealcleaning, ik wil graag informatie over jullie diensten.">Stuur een WhatsApp-bericht</a>
    </div>
  </div>
</section>'''
SKIP = ("tr/", "archief", "docs", "tests", "tools", "vendor", "node_modules", "server", "deploy", "beheer", "_site")
n = 0
for f in glob.glob("**/index.html", recursive=True) + ["404.html"]:
    if f.startswith(SKIP): continue
    s0 = s = open(f, encoding="utf-8").read()
    depth = f.count("/") if f != "404.html" else 0
    rel = "../" * depth if f != "404.html" else "/"
    s = re.sub(r'<section class="footer-cta">.*?</section>', lambda m: FOOT % rel, s, count=1, flags=re.S)
    def plain(m):
        blk = m.group(0)
        if ALLOWED.search(blk) or "hero-media" not in blk: return blk
        blk = re.sub(r'\s*<div class="hero-media">.*?</div>\s*(?=<div class="hero-scrim">)', "", blk, count=1, flags=re.S)
        blk = re.sub(r'\s*<div class="hero-scrim"></div>', "", blk, count=1)
        return blk.replace('class="page-hero"', 'class="page-hero page-hero--plain"', 1)
    s = re.sub(r'<section class="page-hero">.*?</section>', plain, s, count=1, flags=re.S)
    s = re.sub(r'\s*"openingHours":\s*"[^"]*",?', "", s)
    s = re.sub(r',?\s*"priceRange":\s*"[^"]*"', "", s)
    s = re.sub(r'"areaServed":\s*\[[^\]]*\]', '"areaServed": ["Dordrecht", "Hendrik-Ido-Ambacht", "Zwijndrecht", "Drechtsteden"]', s)
    s = re.sub(r'("image":\s*")https://sealcleaning\.nl/images/projects/waterzijde-tuin-terras-hortensia\.jpg', r"\1https://sealcleaning.nl/images/branding/logo.jpg", s)
    s = re.sub(r'(<meta property="og:image" content=")https://sealcleaning\.nl/images/projects/(?:waterzijde[^"]*|terras-kunstgras-opgeleverd\.jpg)', r"\1https://sealcleaning.nl/images/branding/logo.jpg", s)
    ALLOWED = re.compile(r"images/projects/(?:hogedruk|schutting-grenen-zwarte-voet|schutting-kastanje-paaltjes)")
    s = re.sub(r'(<meta property="og:image" content=")([^"]*)', lambda m: m.group(1) + (m.group(2) if (ALLOWED.search(m.group(2)) or "branding" in m.group(2)) else "https://sealcleaning.nl/images/branding/logo.jpg"), s)
    s = re.sub(r'("image":\s*)"([^"]*)"', lambda m: m.group(1) + '"' + (m.group(2) if (ALLOWED.search(m.group(2)) or "branding" in m.group(2)) else "https://sealcleaning.nl/images/branding/logo.jpg") + '"', s)
    s = re.sub(r'\bDordrecht,? (?:&amp;|&) ?Drechtsteden(?:,? (?:&amp;|&|en) Rotterdam)?|Dordrecht, Drechtsteden & Rotterdam', "Dordrecht en de Drechtsteden", s)
    if s != s0: open(f, "w", encoding="utf-8").write(s); n += 1
print(n, "pagina's opgeschoond")
