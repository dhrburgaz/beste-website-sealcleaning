#!/usr/bin/env python3
"""Bouwt de Turkse site (/tr/…) uit de Nederlandse pagina's + tools/i18n/tr.json, en zet taalschakelaar + hreflang op NL en TR.
Gebruik: python3 tools/i18n/build.py   (idempotent; NL-pagina's krijgen alleen schakelaar en hreflang)"""
import re, os, json, html, posixpath, sys
sys.path.insert(0, os.path.dirname(__file__))
from extract import pages
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
os.chdir(ROOT)
from nlfix import fix as _nlfix
TR = {_nlfix(k): v for k, v in json.load(open("tools/i18n/tr.json")).items()}
SITE = "https://sealcleaning.nl/"
PAGES = pages()
LEGAL = ["privacy/index.html", "voorwaarden/index.html"]
EXTRA_TR = LEGAL
TRSET = set(PAGES) | set(EXTRA_TR)
esc = lambda s: s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
escq = lambda s: html.escape(s, quote=True)

WA_TOPICS = {"tuinrenovatie": "bahçe yenileme", "tuinonderhoud": "bahçe bakımı", "tuinaanleg": "bahçe yapımı", "snoeiwerk": "budama", "schuttingen": "çitler", "plantenbakken": "bitki saksıları",
 "periodiek tuinonderhoud": "düzenli bahçe bakımı", "onkruid en groenafval": "yabani ot ve bahçe atığı", "kunstgras": "suni çim", "hogedrukreiniging": "yüksek basınçlı temizlik", "bestrating": "zemin kaplama", "een klus in mijn tuin": "bahçemdeki bir iş"}
def wa_tr(msg):
    """Vooraf ingevulde WhatsApp-tekst in het Turks."""
    if msg == "Hallo Sealcleaning, ik wil graag informatie over jullie diensten.": return "Merhaba Sealcleaning, hizmetleriniz hakkında bilgi almak istiyorum."
    m = re.match(r"^Hallo Sealcleaning, ik heb een vraag over (.+)\.$", msg)
    if m and m.group(1) in WA_TOPICS: return f"Merhaba Sealcleaning, {WA_TOPICS[m.group(1)]} hakkında bir sorum var."
    return msg

def tr_text(m):
    raw = m.group(1); u = html.unescape(raw).strip()
    t = TR.get(u)
    if not t: return m.group(0)
    lead = raw[:len(raw) - len(raw.lstrip())]; trail = raw[len(raw.rstrip()):]
    return ">" + lead + esc(t) + trail + "<"

def tr_attr(m):
    a, v = m.group(1), m.group(2); t = TR.get(html.unescape(v).strip())
    return f' {a}="{escq(t)}"' if t else m.group(0)

def resolve(page, url):
    """Geeft site-root-pad (zonder voorloop-/) van een relatieve URL vanuit NL-pagina `page`."""
    base = posixpath.dirname(page)
    return posixpath.normpath(posixpath.join(base, url)) if url else base

def to_target(page, url, tr_page):
    """Herschrijf een URL van NL-pagina `page` naar die van TR-pagina `tr_page` (relatief)."""
    if re.match(r"^(https?:|//|mailto:|tel:|data:|#|javascript:|/)", url) or not url: return url
    m = re.match(r"^([^?#]*)(.*)$", url); path, rest = m.group(1), m.group(2)
    if path == "": return url
    res = resolve(page, path)
    if res == ".": res = ""
    is_dir = path.endswith("/") or path in (".", "..") or res == "" or res.endswith("index.html")
    key = (res.rstrip("/") + "/index.html") if is_dir and not res.endswith("index.html") else res
    key = key.lstrip("/")
    if key == "/index.html": key = "index.html"
    if is_dir and key in TRSET:
        target = "tr/" + key[:-len("index.html")] if key != "index.html" else "tr/"
    else:
        target = res + ("/" if is_dir and res else "")
    from_dir = posixpath.dirname(tr_page)
    rel = posixpath.relpath(target.rstrip("/") or ".", from_dir or ".") if target not in ("", "/") else posixpath.relpath(".", from_dir or ".")
    if target.endswith("/") and not rel.endswith("/"): rel += "/"
    if rel == "." : rel = "./"
    return rel + rest

def rewrite_urls(s, page, tr_page):
    def one(m):
        return f'{m.group(1)}="{to_target(page, m.group(2), tr_page)}"'
    s = re.sub(r'\b(href|src|action|poster|data-full-webp|data-full-jpg)="([^"]*)"', one, s)
    def ss(m):
        parts = [p.strip() for p in m.group(1).split(",")]
        out = []
        for p in parts:
            u, *w = p.split(" ", 1)
            out.append(to_target(page, u, tr_page) + (" " + w[0] if w else ""))
        return 'srcset="' + ", ".join(out) + '"'
    def imap(m):
        return re.sub(r'"((?:\.{1,2}/)*vendor/[^"]*)"', lambda k: '"' + to_target(page, k.group(1), tr_page) + '"', m.group(0))
    def inl(m):
        return re.sub(r'(from\s+|import\s*\(?\s*)"((?:\.{1,2}/)+js/[^"]*)"', lambda k: k.group(1) + '"' + to_target(page, k.group(2), tr_page) + '"', m.group(0))
    s = re.sub(r'<script type="module">.*?</script>', inl, s, flags=re.S)
    s = re.sub(r'<script type="importmap">.*?</script>', imap, s, flags=re.S)
    return re.sub(r'srcset="([^"]*)"', ss, s)

def counterpart(page, lang):
    d = posixpath.dirname(page)
    return ("tr/" + page) if lang == "nl" else page

def url_of(page, lang):
    p = ("tr/" + page) if lang == "tr" else page
    p = p[:-len("index.html")] if p.endswith("index.html") else p
    return SITE + p

def rel_link(from_page, to_page):
    r = posixpath.relpath(posixpath.dirname(to_page) or ".", posixpath.dirname(from_page) or ".")
    return ("./" if r == "." else r.rstrip("/") + "/")

def head_alternates(s, page):
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">', "", s)
    alt = (f'\n<link rel="alternate" hreflang="nl" href="{url_of(page, "nl")}">\n<link rel="alternate" hreflang="tr" href="{url_of(page, "tr")}">\n'
           f'<link rel="alternate" hreflang="x-default" href="{url_of(page, "nl")}">')
    return re.sub(r'(<link rel="canonical"[^>]*>)', lambda m: m.group(1) + alt, s, count=1)

SWITCH_RE = re.compile(r'\s*<a class="lang-switch"[^>]*>.*?</a>', re.S)
def switcher(page, lang):
    if page not in TRSET: return ""
    other = "tr" if lang == "nl" else "nl"
    me = page if lang == "nl" else "tr/" + page
    to = ("tr/" + page) if lang == "nl" else page
    href = rel_link(me, to)
    label = "Türkçe" if other == "tr" else "Nederlands"
    return (f'\n        <a class="lang-switch" href="{href}" hreflang="{other}" lang="{other}" aria-label="{"Bekijk deze pagina in het Turks (Türkçe)" if lang=="nl" else "Bu sayfayı Hollandaca görüntüle (Nederlands)"}">'
            f'<span aria-hidden="true"><b>{lang.upper()}</b> / {other.upper()}</span></a>')

def add_switch(s, page, lang):
    s = SWITCH_RE.sub("", s)
    sw = switcher(page, lang)
    if not sw: return s
    return s.replace('<div class="header-cta">', '<div class="header-cta">' + sw, 1)

TR_SCRIPT = '<script src="{p}js/i18n-tr.js"></script>\n'
import tr_legal as _tl
def _legal_main(data, nl_href, nl_label, unreviewed):
    title, upd, secs = data
    out = [f'<h1 class="v-h2">{esc(title)}</h1>', f'<p class="v-lede">{esc(_tl.NOTE)}</p>', f'<p>{esc(upd)}</p>']
    if unreviewed: out.append(f'<p><strong>{esc(_tl.OPEN_NOTE)}</strong></p>')
    for h, items in secs:
        out.append(f"<h2>{esc(h)}</h2>")
        for it in items:
            out.append("<ul>" + "".join(f"<li>{esc(x)}</li>" for x in it[1]) + "</ul>" if isinstance(it, tuple) else f"<p>{esc(it)}</p>")
    out.append(f'<p><a class="btn btn-primary btn-lg" href="{nl_href}" lang="nl">{nl_label}</a></p>')
    return '<main id="main"><section class="v-section"><div class="container" style="max-width:46rem">' + "".join(out) + '</div></section></main>'
LEGAL_TR = {"privacy/index.html": (_tl.PRIVACY, "Hollandaca metni oku", False), "voorwaarden/index.html": (_tl.TERMS, "Hollandaca metni oku", True)}

def build(page):
    s = open(page).read()
    tr_page = "tr/" + page
    if page in LEGAL_TR:
        data, lbl, unrev = LEGAL_TR[page]; t = data[0]; p = _tl.NOTE
        main = _legal_main(data, posixpath.relpath(posixpath.dirname(page), posixpath.dirname(tr_page)) + "/", lbl, unrev)
        s = re.sub(r'<main id="main">.*?</main>', lambda m: main, s, count=1, flags=re.S)
        s = re.sub(r"<title>.*?</title>", f"<title>{t} — Sealcleaning</title>", s, count=1)
        s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + p[:150], s, count=1)
    # tekst en attributen
    s = re.sub(r">([^<>]+)<", tr_text, s)
    s = re.sub(r'\s(alt|aria-label|placeholder|title)="([^"]*)"', tr_attr, s)
    s = re.sub(r'(data-whatsapp-msg=")([^"]*)(")', lambda m: m.group(1) + escq(wa_tr(html.unescape(m.group(2)))) + m.group(3), s)
    s = re.sub(r'(<meta (?:name="description"|property="og:title"|property="og:description") content=")([^"]*)(")', lambda m: m.group(1) + (escq(TR.get(html.unescape(m.group(2)).strip(), html.unescape(m.group(2)))) ) + m.group(3), s)
    s = re.sub(r"<title>(.*?)</title>", lambda m: "<title>" + esc(TR.get(html.unescape(m.group(1)).strip(), html.unescape(m.group(1)).strip())) + "</title>", s, count=1, flags=re.S)
    # taal + canonical
    s = s.replace('<html lang="nl">', '<html lang="tr">', 1)
    s = re.sub(r'(<link rel="canonical" href=")[^"]*', lambda m: m.group(1) + url_of(page, "tr"), s, count=1)
    s = re.sub(r'(<meta property="og:url" content=")[^"]*', lambda m: m.group(1) + url_of(page, "tr"), s, count=1)
    s = s.replace('content="nl_NL"', 'content="tr_TR"')
    s = re.sub(r'<meta property="og:locale"[^>]*>', '<meta property="og:locale" content="tr_TR">\n<meta property="og:locale:alternate" content="nl_NL">', s, count=1)
    # URL's
    s = rewrite_urls(s, page, tr_page)
    s = head_alternates(s, page)
    s = add_switch(s, page, "tr")
    depth = tr_page.count("/")
    s = s.replace("<script src=\"" + "../" * depth, TR_SCRIPT.format(p="../" * depth) + "<script src=\"" + "../" * depth, 1) if False else s
    # i18n-script vóór config.js
    m = re.search(r'<script src="((?:\.\./)*)js/config\.js"></script>', s)
    if m: s = s.replace(m.group(0), TR_SCRIPT.format(p=m.group(1)) + m.group(0), 1)
    else:
        m = re.search(r'<script (?:type="module" )?src="((?:\.\./)*)js/', s)
        if m: s = s.replace(m.group(0), TR_SCRIPT.format(p=m.group(1)) + m.group(0), 1)
    os.makedirs(os.path.dirname(tr_page), exist_ok=True)
    open(tr_page, "w").write(s)

def patch_nl(page):
    s = open(page).read()
    s = head_alternates(s, page) if page in TRSET else s
    s = add_switch(s, page, "nl")
    open(page, "w").write(s)

if __name__ == "__main__":
    for p in sorted(TRSET):
        patch_nl(p); build(p)
    # sitemap
    sm = open("sitemap.xml").read()
    sm = re.sub(r'\s*<url><loc>https://sealcleaning\.nl/tr/.*?</url>', "", sm, flags=re.S)
    sm = re.sub(r'\s*<xhtml:link[^>]*/>', "", sm)
    if "xmlns:xhtml" not in sm: sm = sm.replace("<urlset ", '<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml" ', 1)
    def alt(m):
        loc = m.group(1); rel = loc[len(SITE):]; pg = (rel + "index.html") if (rel == "" or rel.endswith("/")) else rel
        if pg not in TRSET: return m.group(0)
        links = f'\n    <xhtml:link rel="alternate" hreflang="nl" href="{SITE}{rel}"/>\n    <xhtml:link rel="alternate" hreflang="tr" href="{SITE}tr/{rel}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{rel}"/>\n  '
        return m.group(0).replace("</url>", links + "</url>")
    sm = re.sub(r"<url><loc>(https://sealcleaning\.nl/[^<]*)</loc>.*?</url>", alt, sm, flags=re.S)
    trs = ""
    for p in sorted(TRSET):
        rel = p[:-len("index.html")] if p.endswith("index.html") else p
        if rel.startswith("projecten/") and False: pass
        trs += f'\n  <url><loc>{SITE}tr/{rel}</loc>\n    <xhtml:link rel="alternate" hreflang="nl" href="{SITE}{rel}"/>\n    <xhtml:link rel="alternate" hreflang="tr" href="{SITE}tr/{rel}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{rel}"/>\n  </url>'
    sm = sm.replace("</urlset>", trs + "\n</urlset>")
    open("sitemap.xml", "w").write(sm)
    print(len(TRSET), "TR-pagina's")
