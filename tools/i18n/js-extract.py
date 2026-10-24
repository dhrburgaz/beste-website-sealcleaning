"""Verzamelt Nederlandse tekst uit JS (letterlijke strings + template literals) naar tools/i18n/js_strings.json (append-only).
Template literals: ${…} wordt {0},{1}… ; vertaling gebruikt dezelfde plaatshouders."""
import re, json, os, sys
FILES = ["js/main.js","js/wizard.js","js/wizard-prefill.js","js/prijzen.js","js/search.js","js/inspiration-board.js","js/lightbox.js","js/catalog/app.js","js/catalog/search.js","js/v12/beginner/app.js","js/v12/beginner/content.js","js/v12/product.js","js/v12/home3d.js","js/configurator/app.js","js/shop/checkout.js","js/shop/cart-store.js","js/shop/status.js","js/project-state.js","data/catalog.js","data/fence-systems.js","data/materials.js","data/garden-objects.js","data/services.js","data/paving-products.js"]
SKIP = re.compile(r'^(https?:|/|\.|#|\[|<[a-z]|data:|M[\d\s.,-]|[\w.-]+\.(js|json|png|jpg|webp|svg|css|html)|[A-Za-z]+:[^\s]*$|@|\$\{)')
def cands(s):
    out = []
    for m in re.finditer(r'"((?:[^"\\\n]|\\.)+)"|\'((?:[^\'\\\n]|\\.)+)\'|`((?:[^`\\]|\\.)+)`', s):
        x = m.group(1) or m.group(2) or m.group(3)
        if m.group(3): x = re.sub(r'\$\{((?:[^{}]|\{[^{}]*\})*)\}', lambda mm, c=[0]: (c.__setitem__(0, c[0] + 1) or "{%d}" % (c[0] - 1)), x)
        x = x.replace('\\"', '"').replace("\\'", "'").replace("\\n", "\n")
        t = x.strip()
        if len(t) < 2 or SKIP.match(t) or "\n" in t and len(t) > 400: continue
        if not re.search(r'[A-Za-zÀ-ÿ]{2,}', t): continue
        if re.fullmatch(r'[a-z0-9_.:/#\[\]=>\s,*+~^|-]+', t) and not " " in t.strip(): continue   # id's, selectors, event names
        if re.fullmatch(r'[a-z0-9_.:/#\[\]=>\s,*+~^|()-]+', t) and re.search(r'[.#\[>]|^[a-z]+-[a-z-]+$', t): continue
        if re.match(r'^[a-z]+(-[a-z0-9]+)+$', t) or re.match(r'^[a-z]+([A-Z][a-z0-9]+)+$', t): continue
        if re.match(r'^[,)(;:+&|=.?!\-\]}]', t) or re.search(r'=>|function|\.\w+\(|\)\.|;\s*$|\{\s*\w+:|querySelector|addEventListener', t): continue
        if all(re.fullmatch(r'[a-z][a-z0-9]*(-[a-z0-9]+)*(:[a-z-]+)?', w) for w in t.split()) and (len(t.split()) > 1 or '-' in t): continue
        if re.search(r'[<>]', t) and re.search(r'</?[a-z]', t): continue
        out.append(t)
    return out
if __name__ == "__main__":
    import collections
    cnt = collections.Counter()
    for f in FILES:
        if os.path.exists(f): cnt.update(set(cands(open(f).read())))
    tr = json.load(open("tools/i18n/tr.json"))
    old = json.load(open("tools/i18n/js_strings.json")) if os.path.exists("tools/i18n/js_strings.json") else []
    seen = set(old)
    new = [k for k, _ in cnt.most_common() if k not in seen and k not in tr]
    json.dump(old + new, open("tools/i18n/js_strings.json", "w"), ensure_ascii=False, indent=0)
    print(len(old), "+", len(new))
