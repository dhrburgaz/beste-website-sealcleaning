"""Extraheert vertaalbare tekst (tekstknopen + attributen) uit de NL-pagina's naar tools/i18n/strings.json (volgorde: frequentie)."""
import re, glob, html, json, collections, sys
EXCL = ("vendor","server","beheer","node_modules","docs","tests","deploy","tools","tr","bestelling","winkelmandje","zoeken","privacy","voorwaarden","_site")
def pages():
    return sorted(f for f in glob.glob("**/index.html", recursive=True) if not f.startswith(EXCL))
ATTR = re.compile(r'\s(alt|aria-label|placeholder|title|content)="([^"]*)"')
def strings(s):
    out = []
    body = re.sub(r'<(script|style)\b[^>]*>.*?</\1>', lambda m: "<%s></%s>" % (m.group(1), m.group(1)) if m.group(1) == "style" else (m.group(0) if 'application/ld+json' in m.group(0)[:80] else "<script></script>"), s, flags=re.S)
    for t in re.findall(r'>([^<>]+)<', body):
        u = html.unescape(t).strip()
        if re.search(r'[A-Za-zÀ-ÿ]{2,}', u) and len(u) > 1: out.append(u)
    for m in re.finditer(r'<(meta|a|img|button|input|textarea|svg|nav|ul|ol|div|section|form|label|figure|details|summary|select|picture|span|link)\b[^>]*>', body):
        for a, v in ATTR.findall(m.group(0)):
            if a == "content" and not re.search(r'(name|property)="(description|og:title|og:description)"', m.group(0)): continue
            v = html.unescape(v).strip()
            if a == "title" and m.group(1) == "link": continue
            if re.search(r'[A-Za-zÀ-ÿ]{3,}', v) and not re.match(r'^(https?:|#|/|\.\./|[a-z0-9_-]+\.(png|jpg|webp|svg))', v) and not re.match(r'^[#\w-]+$', v) or (a != "content" and re.search(r'\s', v)): out.append(v)
    t = re.search(r'<title>(.*?)</title>', s, re.S)
    if t: out.append(html.unescape(t.group(1)).strip())
    return out
if __name__ == "__main__":
    cnt = collections.Counter()
    for f in pages(): cnt.update(set(strings(open(f).read())))
    import os
    old = json.load(open("tools/i18n/strings.json")) if os.path.exists("tools/i18n/strings.json") else []
    seen = set(old); new = [k for k, _ in cnt.most_common() if k not in seen and not k.startswith("{")]
    json.dump(old + new, open("tools/i18n/strings.json", "w"), ensure_ascii=False, indent=0)  # append-only: indexen blijven stabiel
    print(len(pages()), "pagina's", len(cnt), "strings", sum(len(k.split()) for k in cnt), "woorden")
