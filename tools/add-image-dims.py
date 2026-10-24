"""Voegt width/height toe aan <img>-tags zonder afmetingen (voorkomt layoutverschuiving, CLS).
Leest de echte pixelmaten uit JPEG/PNG/WebP-bestanden. Idempotent. Gebruik: python3 tools/add-image-dims.py"""
import glob, os, re, struct

def dims(path):
    with open(path, "rb") as f:
        d = f.read(65536)
    if d[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", d[16:24])
    if d[:4] == b"RIFF" and d[8:12] == b"WEBP":
        c = d[12:16]
        if c == b"VP8X": return (int.from_bytes(d[24:27], "little") + 1, int.from_bytes(d[27:30], "little") + 1)
        if c == b"VP8 ": return (struct.unpack("<H", d[26:28])[0] & 0x3FFF, struct.unpack("<H", d[28:30])[0] & 0x3FFF)
        if c == b"VP8L":
            b = int.from_bytes(d[21:25], "little"); return ((b & 0x3FFF) + 1, ((b >> 14) & 0x3FFF) + 1)
    if d[:2] == b"\xff\xd8":
        with open(path, "rb") as f:
            f.read(2)
            while True:
                m = f.read(2)
                if len(m) < 2 or m[0] != 0xFF: return None
                if m[1] in (0xC0, 0xC1, 0xC2):
                    f.read(3); h, w = struct.unpack(">HH", f.read(4)); return (w, h)
                ln = struct.unpack(">H", f.read(2))[0]; f.read(ln - 2)
    return None

changed = 0
for html in glob.glob("**/*.html", recursive=True):
    if html.startswith(("vendor", "node_modules", "_site")): continue
    s = open(html).read(); base = os.path.dirname(html)
    def fix(m):
        global changed
        tag = m.group(0)
        if re.search(r"\swidth=", tag) and re.search(r"\sheight=", tag): return tag
        src = re.search(r'\ssrc="([^"]+)"', tag)
        if not src or src.group(1).startswith(("http", "data:")): return tag
        p = src.group(1)
        path = os.path.normpath(p.lstrip("/") if p.startswith("/") else os.path.join(base, p))
        if not os.path.exists(path): return tag
        wh = dims(path)
        if not wh: return tag
        changed += 1
        return tag[:-1].rstrip("/").rstrip() + f' width="{wh[0]}" height="{wh[1]}">'
    s2 = re.sub(r"<img\b[^>]*>", fix, s)
    if s2 != s: open(html, "w").write(s2)
print(changed, "afbeeldingen voorzien van afmetingen")
