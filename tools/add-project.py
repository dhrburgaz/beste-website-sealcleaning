#!/usr/bin/env python3
"""Voegt een project toe aan de website vanuit een manifest (tools/projects/<slug>.json) en een map met originele foto's.

Gebruik:  python3 -I tools/add-project.py tools/projects/<slug>.json <map-met-foto's>
          (daarna: python3 tools/i18n/build.py && node tools/build-search-index.mjs)

Manifest (alleen wat bekend is; onbekende velden weglaten of null):
  slug, title, category (filter op /projecten/), services [..], location (of null), tag (meta onder de titel),
  summary, intro, work [..], result, seoTitle, seoDescription, related [[dienst-slug, linktekst]],
  photos [{src, name, alt, role (cover|detail|before|after|during), caption?, blur: [[x,y,w,h]]}],
  pairs [{before: name, after: name, caption}]  -> interactieve voor/na-slider
Foto's worden verkleind (max 1600 px lange zijde), kentekens/privé-delen afgeschermd via `blur`, en als WebP + JPG
(+ 640/800/960 px WebP) in images/projects/ gezet. Bestaat het project al (slug), dan wordt niets dubbel toegevoegd.
"""
import json, os, re, sys, html
from PIL import Image, ImageOps, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://sealcleaning.nl/"
esc = html.escape
CATS = {"tuinonderhoud": "Tuinonderhoud", "tuinaanleg": "Tuinaanleg", "renovatie": "Renovatie", "bestrating": "Bestrating", "schutting": "Schutting", "snoeiwerk": "Snoeiwerk", "hogedrukreiniging": "Hogedrukreiniging", "kunstgras": "Kunstgras"}
def rd(p): return open(os.path.join(ROOT, p), encoding="utf-8").read()
def wr(p, s): open(os.path.join(ROOT, p), "w", encoding="utf-8").write(s)

def process(photo, srcdir):
    im = ImageOps.exif_transpose(Image.open(os.path.join(srcdir, photo["src"]))).convert("RGB")
    for x, y, w, h in photo.get("blur", []):
        box = (x, y, min(im.width, x + w), min(im.height, y + h))
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(14)), box)
    scale = min(1.0, 1600 / max(im.size))
    full = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS) if scale < 1 else im
    base = os.path.join(ROOT, "images", "projects", photo["name"])
    full.save(base + ".jpg", "JPEG", quality=82, optimize=True, progressive=True)
    full.save(base + ".webp", "WEBP", quality=80, method=6)
    for w in (640, 800, 960):
        if full.width > w * 1.05:
            full.resize((w, round(full.height * w / full.width)), Image.LANCZOS).save(f"{base}-{w}.webp", "WEBP", quality=78, method=6)
        else:
            full.save(f"{base}-{w}.webp", "WEBP", quality=80, method=6)
    return full.size

def pic(name, size, alt, rel, sizes, hero=False):
    w, h = size
    srcset = ", ".join(f"{rel}images/projects/{name}-{x}.webp {x}w" for x in (640, 800, 960)) + f", {rel}images/projects/{name}.webp {w}w"
    attrs = 'fetchpriority="high" decoding="async"' if hero else 'loading="lazy" decoding="async"'
    return (f'<picture><source srcset="{srcset}" sizes="{sizes}" type="image/webp">'
            f'<img src="{rel}images/projects/{name}.jpg" alt="{esc(alt)}" {attrs} width="{w}" height="{h}"></picture>')

def meta_line(m):
    parts = [m["location"]] if m.get("location") else []
    parts.append(m["tag"]); return " · ".join(parts)

def lightbox_block():
    s = rd("projecten/index.html")
    a = s.index("<!-- PROJECT LIGHTBOX -->"); b = s.index("<!-- PREMIUM CLOSING CTA -->")
    return s[a:b].rstrip() + "\n"

def detail_page(m, sizes):
    s = rd("projecten/klimopheg-in-model/index.html")
    url = f"{SITE}projecten/{m['slug']}/"; title = f"{m['seoTitle']} — Sealcleaning"
    cover = next(p for p in m["photos"] if p["role"] == "cover"); coverjpg = f"{SITE}images/projects/{cover['name']}.jpg"
    head = (f'<title>{esc(title)}</title>\n<meta name="description" content="{esc(m["seoDescription"])}">\n<link rel="canonical" href="{url}">\n'
            f'<link rel="alternate" hreflang="nl" href="{url}">\n<link rel="alternate" hreflang="tr" href="{SITE}tr/projecten/{m["slug"]}/">\n<link rel="alternate" hreflang="x-default" href="{url}">\n'
            f'<meta property="og:type" content="article">\n<meta property="og:title" content="{esc(m["title"])}">\n<meta property="og:description" content="{esc(m["seoDescription"])}">\n'
            f'<meta property="og:url" content="{url}">\n<meta property="og:image" content="{coverjpg}">\n<meta property="og:locale" content="nl_NL">\n')
    a = s.index("<title>"); b = s.index('<meta name="theme-color"'); s = s[:a] + head + s[b:]
    images = [f"{SITE}images/projects/{p['name']}.jpg" for p in m["photos"]]
    ld = ('<script type="application/ld+json">\n' + json.dumps({"@context": "https://schema.org", "@type": "CreativeWork", "name": m["title"], "about": CATS.get(m["category"], m["category"]), "description": m["seoDescription"], "url": url, "image": images}, ensure_ascii=False, indent=2) + '\n</script>\n'
          '<script type="application/ld+json">\n' + json.dumps({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": SITE}, {"@type": "ListItem", "position": 2, "name": "Projecten", "item": SITE + "projecten/"}, {"@type": "ListItem", "position": 3, "name": m["title"], "item": url}]}, ensure_ascii=False, indent=2) + '\n</script>\n')
    a = s.index('<script type="application/ld+json">'); b = s.index("</head>"); s = s[:a] + ld + s[b:]
    s = s.replace("tr/projecten/klimopheg-in-model/", f"tr/projecten/{m['slug']}/")
    rel = "../../"
    hero = pic(cover["name"], sizes[cover["name"]], cover["alt"], rel, "100vw", hero=True)
    work = "".join(f"<li>{esc(x)}</li>" for x in m.get("work", []))
    tiles, pairs = [], ""
    for p in m["photos"]:
        w, h = sizes[p["name"]]; portrait = h > w
        cap = f'<p class="photo-caption">{esc(p["caption"])}</p>' if p.get("caption") else ""
        tiles.append(f'        <div><button type="button" class="project-tile{" is-portrait" if portrait else ""}" data-lightbox data-full-webp="{rel}images/projects/{p["name"]}.webp" data-full-jpg="{rel}images/projects/{p["name"]}.jpg" data-alt="{esc(p["alt"])}" data-title="{esc(m["title"])}" data-meta="{esc(meta_line(m))}"><div class="media-frame">{pic(p["name"], (w, h), p["alt"], rel, "(max-width: 700px) 92vw, 420px")}</div></button>{cap}</div>')
    for i, pr in enumerate(m.get("pairs", [])):
        bf = next(p for p in m["photos"] if p["name"] == pr["before"]); af = next(p for p in m["photos"] if p["name"] == pr["after"])
        pairs += (f'<div class="ba" data-ba><img src="{rel}images/projects/{bf["name"]}.jpg" alt="{esc(bf["alt"])}" loading="lazy" decoding="async"><img class="ba-after" src="{rel}images/projects/{af["name"]}.jpg" alt="{esc(af["alt"])}" loading="lazy" decoding="async">'
                  f'<span class="ba-label l">Voor</span><span class="ba-label r">Na</span><span class="ba-handle"></span>'
                  f'<input type="range" min="0" max="100" value="50" aria-label="Schuif om voor en na te vergelijken"></div><p class="photo-caption">{esc(pr.get("caption", ""))}</p>\n')
    ba_section = f'<section class="section-tight"><div class="container-narrow"><h2>Voor en na</h2>{pairs}</div></section>\n' if pairs else ""
    related = "".join(f'<a href="{rel}{d}/" class="btn btn-secondary btn-lg">{esc(t)}</a>' for d, t in m.get("related", []))
    first = m["services"][0]
    main = f'''<main id="main">
  <section class="page-hero">
    <div class="hero-media">{hero}</div>
    <div class="hero-scrim"></div>
    <div class="container page-hero-inner">
      <div class="breadcrumbs"><ol><li><a href="{rel}">Home</a></li><li><a href="../">Projecten</a></li><li>{esc(m["title"])}</li></ol></div>
      <p class="eyebrow">{esc(meta_line(m))}</p>
      <h1>{esc(m["title"])}</h1>
    </div>
  </section>

  <section class="section-tight">
    <div class="container-narrow">
      <div class="case-copy">
        <div class="case-meta">{"".join(f'<span class="tag">{esc(t)}</span>' for t in m["services"])}</div>
        <p class="lede">{esc(m["intro"])}</p>
        <h2>Uitgevoerde werkzaamheden</h2>
        <ul class="case-list">{work}</ul>
        <h2>Resultaat</h2>
        <p>{esc(m["result"])}</p>
      </div>
    </div>
  </section>
{ba_section}
  <section class="section">
    <div class="container">
      <div class="section-head"><p class="eyebrow">Foto's</p><h2>Dit project in beeld</h2></div>
      <div class="case-gallery">
{chr(10).join(tiles)}
      </div>
    </div>
  </section>

  <section class="section section-sand-deep">
    <div class="container-narrow text-center">
      <h2>Heeft u een vergelijkbaar project?</h2>
      <p>Vertel ons wat u wilt laten doen. U ontvangt een duidelijk voorstel, vooraf afgestemd op uw situatie.</p>
      <div class="btn-row" style="justify-content:center">
        <a href="{rel}contact/" class="btn btn-primary btn-lg">Vraag een offerte aan</a>
        {related}
      </div>
    </div>
  </section>
</main>

{lightbox_block()}'''
    a = s.index('<main id="main">'); b = s.index("<section class=\"footer-cta\">")
    s = s[:a] + main + "\n" + s[b:]
    scripts = '<script src="../../js/main.js"></script>\n<script src="../../js/lightbox.js"></script>' + ('\n<script src="../../js/ba-slider.js"></script>' if pairs else "")
    s = s.replace('<script src="../../js/main.js"></script>', scripts, 1)
    return s

def main():
    manifest, srcdir = sys.argv[1], sys.argv[2]
    m = json.load(open(manifest, encoding="utf-8"))
    if os.path.exists(os.path.join(ROOT, "projecten", m["slug"])):
        sys.exit(f"Project {m['slug']} bestaat al; verwijder het eerst bewust als u het wilt vervangen.")
    for p in m["photos"]:
        if os.path.exists(os.path.join(ROOT, "images", "projects", p["name"] + ".jpg")): sys.exit(f"Afbeeldingsnaam bestaat al: {p['name']}")
    sizes = {p["name"]: process(p, srcdir) for p in m["photos"]}
    os.makedirs(os.path.join(ROOT, "projecten", m["slug"]), exist_ok=True)
    wr(f"projecten/{m['slug']}/index.html", detail_page(m, sizes))
    # overzichtspagina: filterknop + tegel vooraan
    idx = rd("projecten/index.html")
    if f'data-filter="{m["category"]}"' not in idx:
        idx = re.sub(r'(<button class="filter-btn" data-filter="snoeiwerk"[^>]*>[^<]*</button>)', lambda mm: mm.group(1) + f'\n        <button class="filter-btn" data-filter="{m["category"]}" aria-pressed="false">{CATS.get(m["category"], m["category"].title())}</button>', idx, 1)
    cover = next(p for p in m["photos"] if p["role"] == "cover"); w, h = sizes[cover["name"]]
    tile = (f'        <button type="button" class="project-tile reveal" data-category="{m["category"]}" data-lightbox data-slug="{m["slug"]}" data-full-webp="../images/projects/{cover["name"]}.webp" data-full-jpg="../images/projects/{cover["name"]}.jpg" data-alt="{esc(cover["alt"])}" data-title="{esc(m["title"])}" data-meta="{esc(meta_line(m))}">\n'
            f'          <div class="media-frame">{pic(cover["name"], (w, h), cover["alt"], "../", "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 440px")}</div>\n'
            f'          <h3>{esc(m["title"])}</h3>\n          <p class="meta">{esc(meta_line(m))}</p>\n        </button>\n')
    idx = idx.replace('<div class="project-grid">\n', '<div class="project-grid">\n' + tile, 1)
    wr("projecten/index.html", idx)
    # datamodel
    dp = rd("data/projects.js")
    entry = {"slug": m["slug"], "title": m["title"], "primaryService": m["services"][0], "services": m["services"], "location": ({"city": m["location"], "verified": True} if m.get("location") else None),
             "coverImage": cover["name"], "gallery": [{"image": p["name"], "alt": p["alt"], "role": p["role"]} for p in m["photos"]], "summary": m["summary"],
             "situation": None, "workDone": m.get("work", []), "materials": [], "duration": None, "dimensions": None, "tags": m["services"], "featured": True, "verification": "visually-confirmed", "publishStatus": "published"}
    dp = dp.replace("export const PROJECTS = [\n", "export const PROJECTS = [\n  " + json.dumps(entry, ensure_ascii=False, indent=2).replace("\n", "\n  ") + ",\n", 1)
    wr("data/projects.js", dp)
    # sitemap
    sm = rd("sitemap.xml"); u = f"{SITE}projecten/{m['slug']}/"
    if u not in sm: sm = sm.replace("</urlset>", f'  <url><loc>{u}</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>\n</urlset>'); wr("sitemap.xml", sm)
    print("project toegevoegd:", m["slug"], "-", len(m["photos"]), "foto's")

if __name__ == "__main__":
    main()
