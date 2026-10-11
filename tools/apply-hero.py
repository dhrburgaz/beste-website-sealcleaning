"""Zet de kop van pagina's zonder fotohero (breadcrumbs + eyebrow + h1 + lede) om in een v12-bandhero. Idempotent."""
import re, os, struct
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def dims(path):
    d = open(path, "rb").read(40)
    if d[12:16] == b"VP8X": return int.from_bytes(d[24:27], "little") + 1, int.from_bytes(d[27:30], "little") + 1
    if d[12:16] == b"VP8 ": return struct.unpack("<H", d[26:28])[0] & 0x3FFF, struct.unpack("<H", d[28:30])[0] & 0x3FFF
    v = int.from_bytes(d[21:25], "little"); return (v & 0x3FFF) + 1, ((v >> 14) & 0x3FFF) + 1
PAGES = {  # pagina: (foto of None, alt)
    "contact": ("tuin-hangstoel-border", "Terras met border en hangstoel, eigen werk"),
    "werkwijze": ("schutting-materiaal-voorbereiding-dordrecht", "Voorbereiding van een schuttingproject, eigen werk"),
    "kennisbank": ("waterzijde-tuin-border-haag", "Tuin aan het water met border en haag, eigen werk"),
    "privacy": None, "voorwaarden": None, "zoeken": None, "inspiratie": None,
    "kennisbank/schutting-opmeten": None, "kennisbank/bestratingsoppervlak-berekenen": None, "kennisbank/hout-beton-vs-composiet": None,
}
for page, photo in PAGES.items():
    p = f"{ROOT}/{page}/index.html"; s = open(p).read()
    if "page-hero" in s: continue
    pre = "../" * (page.count("/") + 1)
    m = re.search(r'(<div class="container breadcrumbs">.*?</div>)\s*<(section|article) class="section-tight">\s*<div class="([^"]*)">\s*(<p class="eyebrow">.*?</p>)\s*(<h1[^>]*>.*?</h1>)\s*(<p class="lede">.*?</p>)?', s, flags=re.S)
    if not m: m2 = re.search(r'(<div class="container breadcrumbs">.*?</div>)\s*<(section|article) class="section-tight">\s*<div class="([^"]*)">\s*(<p class="eyebrow">.*?</p>)\s*(<h1[^>]*>.*?</h1>)', s, flags=re.S); m = m2
    if not m: print("geen patroon:", page); continue
    bc, tag, cls, eye, h1 = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
    lede = m.group(6) or ""
    media = ""
    if photo:
        name, alt = photo; base = f"{ROOT}/images/projects/{name}"; w, h = dims(base + ".webp")
        parts = [f"{pre}images/projects/{name}-{x}.webp {x}w" for x in (640, 800, 960) if os.path.exists(f"{base}-{x}.webp")] + [f"{pre}images/projects/{name}.webp {w}w"]
        media = f'<div class="hero-media"><picture><source srcset="{", ".join(parts)}" sizes="100vw" type="image/webp"><img src="{pre}images/projects/{name}.jpg" alt="{alt}" width="{w}" height="{h}" fetchpriority="high" decoding="async"></picture></div><div class="hero-scrim"></div>'
    hero = f'<section class="page-hero{"" if photo else " page-hero--plain"}">{media}<div class="container page-hero-inner">{bc}{eye}{h1}{lede}</div></section>\n  '
    rest_start = m.end()
    rest = s[rest_start:]
    if re.match(r'\s*</div>\s*</' + tag + '>', rest):
        new = hero + rest[re.match(r'\s*</div>\s*</' + tag + '>', rest).end():]
    else:
        new = hero + f'<{tag} class="section-tight">\n    <div class="{cls}">' + rest
    s = s[:m.start()] + new; open(p, "w").write(s); print("ok", page)
