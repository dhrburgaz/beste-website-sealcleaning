"""Zet srcset/sizes op <source type="image/webp"> voor images/projects/NAME.webp als -640/-960 varianten bestaan. Idempotent."""
import glob, os, re
n = 0
for html in glob.glob("**/*.html", recursive=True):
    if html.startswith(("vendor", "node_modules", "_site", "server/")): continue
    s = open(html).read(); base = os.path.dirname(html)
    def fix(m):
        global n
        path, name = m.group(1) + m.group(2), m.group(3)
        before = s[max(0, m.start() - 400):m.start()]
        hero = "hero-media" in before[-200:] or "page-hero" in before[-300:]
        files = {}
        for w in (640, 960):
            if os.path.exists(os.path.normpath(os.path.join(base, f"{path}{name}-{w}.webp"))): files[w] = f"{path}{name}-{w}.webp"
        if not files: return m.group(0)
        full = f"{path}{name}.webp"
        # werkelijke breedte van het origineel
        from struct import unpack
        with open(os.path.normpath(os.path.join(base, full)), "rb") as f: d = f.read(40)
        if d[12:16] == b"VP8X": ow = int.from_bytes(d[24:27], "little") + 1
        elif d[12:16] == b"VP8 ": ow = unpack("<H", d[26:28])[0] & 0x3FFF
        else: ow = int.from_bytes(d[21:25], "little") & 0x3FFF; ow += 1
        parts = [f"{files[w]} {w}w" for w in sorted(files)] + [f"{full} {ow}w"]
        sizes = "100vw" if hero else "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 440px"
        n += 1
        return f'<source srcset="{", ".join(parts)}" sizes="{sizes}" type="image/webp">'
    s2 = re.sub(r'<source srcset="((?:\.\./)*)(images/projects/)([a-z0-9-]+)\.webp" type="image/webp">', lambda m: fix(m), s)
    if s2 != s: open(html, "w").write(s2)
print(n, "bronnen voorzien van srcset")
