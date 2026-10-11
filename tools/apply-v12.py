"""Zet de v12-stijl op alle publieke pagina's: body-klasse `v12`, css/v12.css na css/style.css, theme-color. Idempotent. Beheer blijft ongewijzigd."""
import glob, os, re
n = 0
for f in glob.glob("**/*.html", recursive=True):
    if f.startswith(("node_modules", "server/", "_site", "beheer/", "docs/", "tests/")): continue
    s = open(f).read(); o = s
    depth = f.count("/")
    pre = "../" * depth
    if "v12.css" not in s:
        s = re.sub(r'(<link rel="stylesheet" href="' + re.escape(pre) + r'css/style\.css">)', r'\1\n<link rel="stylesheet" href="' + pre + 'css/v12.css">', s, count=1)
    if re.search(r"<body>", s): s = s.replace("<body>", '<body class="v12">', 1)
    elif re.search(r'<body class="([^"]*)"', s) and "v12" not in re.search(r'<body class="([^"]*)"', s).group(1):
        s = re.sub(r'<body class="([^"]*)"', r'<body class="\1 v12"', s, count=1)
    s = s.replace('<meta name="theme-color" content="#1b2a1e">', '<meta name="theme-color" content="#102E27">')
    if s != o: open(f, "w").write(s); n += 1
print(n, "pagina's bijgewerkt")
