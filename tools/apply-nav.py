"""Zet de hoofdnavigatie en de mobiele actiebalk op alle statische pagina's gelijk (v7-informatiearchitectuur).
Gebruik: python3 tools/apply-nav.py   (idempotent)"""
import glob, re

SERVICES = [("tuinonderhoud/", "Tuinonderhoud"), ("tuinaanleg/", "Tuinaanleg"), ("tuinrenovatie/", "Tuinrenovatie"),
            ("bestrating/", "Bestrating"), ("schuttingen/", "Schuttingen"), ("plantenbakken/", "Plantenbakken"), ("snoeiwerk/", "Snoeiwerk"),
            ("periodiek-tuinonderhoud/", "Periodiek onderhoud")]
ABOUT = [("over-ons/", "Over Sealcleaning"), ("werkwijze/", "Werkwijze"), ("werkgebied/", "Werkgebied"),
         ("kennisbank/", "Kennisbank"), ("voor-aannemers/", "Voor aannemers en VvE's"), ("werken-met-ons/", "Werken met ons")]
TOP = [("schutting-ontwerpen/", "Tuin ontwerpen"), ("projecten/", "Projecten")]
PHONE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'

def nav(p, here):
    def a(href, label, extra=""):
        cur = ' aria-current="page"' if here == href else ""
        return f'<a href="{p}{href}"{cur}{extra}>{label}</a>'
    sub = lambda items: "\n".join(f"            <li>{a(h, l)}</li>" for h, l in items)
    in_services = any(here == h for h, _ in SERVICES)
    in_about = any(here == h for h, _ in ABOUT)
    tops = "\n".join(f"        <li>{a(h, l)}</li>" for h, l in TOP)
    return f'''<nav class="main-nav" id="main-nav" aria-label="Hoofdnavigatie">
      <ul class="nav-list">
        <li class="nav-home">{a("", "Home")}</li>
        <li class="has-submenu">
          <a href="{p}#diensten"{' data-section-current="true"' if in_services else ""}>Diensten</a>
          <ul class="submenu">
{sub(SERVICES)}
          </ul>
        </li>
{tops}
        <li class="has-submenu">
          <a href="{p}over-ons/"{' data-section-current="true"' if in_about else ""}>Over ons</a>
          <ul class="submenu">
{sub(ABOUT)}
          </ul>
        </li>
        <li>{a("contact/", "Contact")}</li>
      </ul>
      <div class="header-cta">
        <a href="#" class="icon-btn" data-tel aria-label="Bel Sealcleaning">
          {PHONE}
        </a>
        <a href="{p}contact/" class="btn btn-primary btn-sm">Offerte aanvragen</a>
      </div>
    </nav>'''

n = 0
for f in sorted(glob.glob("**/index.html", recursive=True) + ["404.html"]):
    if f.startswith(("vendor", "server", "beheer", "node_modules", "_site")):
        continue
    s = open(f).read()
    if 'class="main-nav"' not in s:
        continue
    depth = f.count("/")
    p = "../" * depth if f != "404.html" else "/"
    here = "" if depth == 0 else f.rsplit("index.html", 1)[0]
    if here.startswith("projecten/") and here != "projecten/": here = "projecten/"
    if here.startswith("kennisbank/") and here != "kennisbank/": here = "kennisbank/"
    s = re.sub(r'<nav class="main-nav".*?</nav>', lambda m: nav(p, here), s, count=1, flags=re.S)
    s = re.sub(r'(<a href="[^"]*contact/" class="cta-primary">)Kennismaking(</a>)', r"\1Offerte\2", s)
    open(f, "w").write(s)
    n += 1
print(n, "pagina's bijgewerkt")
