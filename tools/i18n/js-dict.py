"""Bouwt js/i18n-tr.js: exacte woordenlijst + sjabloonregels ({n}) + MutationObserver voor door JS getekende tekst."""
import json, glob, importlib.util, re
s = json.load(open("tools/i18n/js_strings.json"))
d = {}
for f in sorted(glob.glob("tools/i18n/js_00*.py")):
    sp = importlib.util.spec_from_file_location("m", f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); d.update(m.T)
norm = lambda x: re.sub(r"\s+", " ", x).strip()
exact, rules = {}, []
for k, v in json.load(open("tools/i18n/tr.json")).items():
    if v and k != v: exact[norm(k)] = v
for i, k in enumerate(s):
    v = d.get(i, "")
    if not v: continue
    if re.search(r"\{\d+\}", k): rules.append([norm(k), v])
    else: exact[norm(k)] = v
import importlib.util as _u
_sp=_u.spec_from_file_location("x","tools/i18n/js_extra.py");_x=_u.module_from_spec(_sp);_sp.loader.exec_module(_x)
exact.update({norm(k):v for k,v in _x.EXACT.items()})
rules.sort(key=lambda r: -len(r[0]))
js = open("tools/i18n/i18n-tr.tpl.js").read()
js = js.replace("__EXACT__", json.dumps(exact, ensure_ascii=False, separators=(",", ":"))).replace("__WORDS__", json.dumps(_x.WORDS, ensure_ascii=False, separators=(",", ":"))).replace("__RULES__", json.dumps(rules, ensure_ascii=False, separators=(",", ":")))
open("js/i18n-tr.js", "w").write(js)
print(len(exact), len(rules), len(js) // 1024, "KB")
