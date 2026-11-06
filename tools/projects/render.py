#!/usr/bin/env python3
"""Bouwt alle projectonderdelen opnieuw uit de manifesten in tools/projects/*.json:
detailpagina's, tegels + filters op /projecten/, interne projectdata en sitemap.
Alleen manifesten met status "published" zijn openbaar; "hidden" blijft buiten de site (pagina's staan in projecten-archief/).
Gebruik: python3 -I tools/projects/render.py"""
import glob, importlib.util, json, os, re, shutil, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sp = importlib.util.spec_from_file_location("ap", os.path.join(ROOT, "tools/add-project.py")); ap = importlib.util.module_from_spec(sp); sp.loader.exec_module(ap)
rd, wr, pic, esc, meta_line, SITE = ap.rd, ap.wr, ap.pic, ap.esc, ap.meta_line, ap.SITE
CATS = ap.CATS

def load():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, "tools/projects/*.json"))):
        if f.endswith("hidden.json"): continue
        m = json.load(open(f, encoding="utf-8")); m.setdefault("status", "published"); out.append(m)
    return sorted(out, key=lambda m: m.get("order", 99))

def sizes(m):
    return {p["name"]: Image.open(os.path.join(ROOT, "images/projects", p["name"] + ".jpg")).size for p in m["photos"]}

def main():
    ms = load(); pub = [m for m in ms if m["status"] == "published"]
    for m in pub:
        d = os.path.join(ROOT, "projecten", m["slug"]); os.makedirs(d, exist_ok=True)
        wr(f"projecten/{m['slug']}/index.html", ap.detail_page(m, sizes(m)))
    # overzichtspagina
    idx = rd("projecten/index.html")
    cats = []
    for m in pub:
        if m["category"] not in cats: cats.append(m["category"])
    buttons = '<button class="filter-btn" data-filter="alle" aria-pressed="true">Alle projecten</button>' + "".join(f'\n        <button class="filter-btn" data-filter="{c}" aria-pressed="false">{CATS.get(c, c.title())}</button>' for c in cats)
    idx = re.sub(r'(<div class="filter-bar"[^>]*>\s*).*?(\s*</div>)', lambda mm: mm.group(1) + buttons + mm.group(2), idx, count=1, flags=re.S)
    tiles = ""
    for m in pub:
        cover = next(p for p in m["photos"] if p["role"] == "cover"); sz = sizes(m)[cover["name"]]
        tiles += (f'        <button type="button" class="project-tile reveal" data-category="{m["category"]}" data-lightbox data-slug="{m["slug"]}" data-full-webp="../images/projects/{cover["name"]}.webp" data-full-jpg="../images/projects/{cover["name"]}.jpg" data-alt="{esc(cover["alt"])}" data-title="{esc(m["title"])}" data-meta="{esc(meta_line(m))}">\n'
                  f'          <div class="media-frame">{pic(cover["name"], sz, cover["alt"], "../", "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 440px")}</div>\n'
                  f'          <h3>{esc(m["title"])}</h3>\n          <p class="meta">{esc(meta_line(m))}</p>\n        </button>\n')
    a = idx.index('<div class="project-grid">') + len('<div class="project-grid">\n'); b = idx.index("\n      </div>", idx.rindex("</button>", a, idx.index("</section>", a)))
    idx = idx[:a] + tiles.rstrip("\n") + idx[b:]
    wr("projecten/index.html", idx)
    # interne projectdata (niet gepubliceerd)
    hidden = json.load(open(os.path.join(ROOT, "tools/projects/hidden.json"), encoding="utf-8"))
    entries = [{"slug": m["slug"], "title": m["title"], "primaryService": m["services"][0], "services": m["services"], "location": None, "coverImage": next(p for p in m["photos"] if p["role"] == "cover")["name"],
                "gallery": [{"image": p["name"], "alt": p["alt"], "role": p["role"]} for p in m["photos"]], "summary": m["summary"], "workDone": m.get("work", []), "publishStatus": "published", "ownerConfirmed": False} for m in pub]
    wr("tools/projects/projects.js", "// Gegenereerd door tools/projects/render.py. Alleen intern gebruik; niet openbaar.\nexport const PROJECTS = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\nexport const HIDDEN = " + json.dumps(hidden, ensure_ascii=False, indent=2) + ";\n")
    # sitemap: alleen pagina's die bestaan
    sm = rd("sitemap.xml")
    def keep(mm):
        rel = mm.group(1)[len(SITE):]
        return mm.group(0) if os.path.exists(os.path.join(ROOT, rel, "index.html" if rel else "index.html")) or rel == "" else ""
    sm = re.sub(r'\s*<url><loc>(https://sealcleaning\.nl/(?!tr/)[^<]*)</loc>.*?</url>', keep, sm, flags=re.S)
    for m in pub:
        u = f"{SITE}projecten/{m['slug']}/"
        if u not in sm: sm = sm.replace("</urlset>", f'  <url><loc>{u}</loc><changefreq>yearly</changefreq><priority>0.6</priority></url>\n</urlset>')
    wr("sitemap.xml", sm)
    print("projecten gepubliceerd:", [m["slug"] for m in pub])
    # Het sjabloon bevat oude navigatie/footer; breng gegenereerde pagina's op de actuele stand.
    import subprocess, sys
    for cmd in (["tools/final/sweep.py"], ["tools/apply-nav.py"]):
        subprocess.run([sys.executable, os.path.join(ROOT, cmd[0])], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
if __name__ == "__main__": main()
