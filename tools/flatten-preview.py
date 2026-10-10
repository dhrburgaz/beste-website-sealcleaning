"""Maakt van _site een preview-kopie voor hosts die mappen NIET als index.html serveren (bijv. een artifact-host):
interne mapslinks krijgen expliciet /index.html. Wijzigt alleen de kopie (pad als argument), nooit de broncode.
Gebruik: python3 tools/flatten-preview.py <map>"""
import os, re, sys
root = sys.argv[1]
n = 0
SKIP = re.compile(r"^(https?:|//|mailto:|tel:|data:|#|javascript:|/api/)")
def fix_url(u):
    if SKIP.match(u) or u == "" or u == "#":
        return u
    m = re.match(r"^([^?#]*)(.*)$", u)
    path, rest = m.group(1), m.group(2)
    if path.endswith("/"): return path + "index.html" + rest
    if path in (".", ".."): return path + "/index.html" + rest
    return u
for d, _, files in os.walk(root):
    for f in files:
        p = os.path.join(d, f)
        if f.endswith(".html"):
            s = open(p, encoding="utf-8").read()
            s2 = re.sub(r'(\s(?:href|action)=")([^"]*)(")', lambda m: m.group(1) + fix_url(m.group(2)) + m.group(3), s)
            s2 = re.sub(r'(\sdata-full-(?:webp|jpg)=")', r"\1", s2)
        elif f.endswith(".js"):
            s = open(p, encoding="utf-8").read()
            def js(m):
                q, body = m.group(1), m.group(2)
                if re.search(r"\s", body) or body.startswith(("http", "/")) or "//" in body: return m.group(0)
                if not re.match(r"^(\.\./|\./|\.\.|\.|[a-z0-9_$])", body): return m.group(0)
                m2 = re.match(r"^(.*?/)(\?.*|#.*)?$", body)
                if not m2 or "/" not in body: return m.group(0)
                return q + m2.group(1) + "index.html" + (m2.group(2) or "") + q
            s2 = re.sub(r'(["\'`])((?:\.\.?/|[a-z0-9_$][a-z0-9_$./{}-]*)[^"\'`\n]*?/(?:[?#][^"\'`\n]*)?)\1(?!\s*\+)', js, s)
            s2 = s2.replace('+ "/";', '+ "/index.html";').replace('+ "/")', '+ "/index.html")')
            s2 = re.sub(r'(\.\./projecten/\$\{[^}]+\}/)(`)', r"\1index.html\2", s2)
            s2 = s2.replace('"../" + e.url', '"../" + (e.url || "")')
        elif f.endswith(".json") and f == "search-index.json":
            s = open(p, encoding="utf-8").read()
            s2 = re.sub(r'("url":\s*")([^"]*)(")', lambda m: m.group(1) + (m.group(2) + "index.html" if m.group(2).endswith("/") or m.group(2) == "" else m.group(2)) + m.group(3), s)
        else:
            continue
        if s2 != s:
            open(p, "w", encoding="utf-8").write(s2); n += 1
print(n, "bestanden aangepast in", root)
