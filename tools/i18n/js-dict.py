"""Bouwt js/i18n-tr.js: exacte woordenlijst + sjabloonregels ({n}) + MutationObserver voor door JS getekende tekst."""
import json, glob, importlib.util, re, sys
sys.path.insert(0, "tools/i18n")
s = json.load(open("tools/i18n/js_strings.json"))
d = {}
for f in sorted(glob.glob("tools/i18n/js_00*.py")):
    sp = importlib.util.spec_from_file_location("m", f); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m); d.update(m.T)
sys_path = __import__("sys").path.insert(0, "tools/i18n")
from nlfix import fix as _nlfix
norm = lambda x: _nlfix(re.sub(r"\s+", " ", x).strip())
exact, rules = {}, []
# Alleen vertalingen meenemen waarvan de Nederlandse tekst nog op de site of in de gedeelde scripts staat (geen verouderde teksten publiceren).
import extract as _ex, os as _os
live = set()
for _p in _ex.pages():
    live.update(norm(t) for t in _ex.strings(open(_p, encoding="utf-8").read()))
_jsrc = ""
for _root in ("js",):
    for _dp, _dn, _fn in _os.walk(_root):
        for _f in _fn:
            if _f.endswith(".js") and _f != "i18n-tr.js" and not any(x in _dp for x in ("beheer","catalog","shop","calc")) and _f not in ("prijzen.js","wizard.js") and not (_dp.endswith("configurator") and _f in ("app.js","variants.js","waste.js","svg-interaction.js")): _jsrc += open(_os.path.join(_dp, _f), encoding="utf-8").read() + "\n"
for _f in glob.glob("data/*.js"): _jsrc += open(_f, encoding="utf-8").read()
_jsn = re.sub(r"\s+", " ", _jsrc)
def in_js(k):
    base = max(re.split(r"\{\d+\}", k), key=len).strip()
    return len(base) < 3 or base in _jsn or base.replace("'", "\\'") in _jsn
for k, v in json.load(open("tools/i18n/tr.json")).items():
    if v and k != v and norm(k) in live: exact[norm(k)] = v
for i, k in enumerate(s):
    v = d.get(i, "")
    if not v or not in_js(k): continue
    if re.search(r"\{\d+\}", k): rules.append([norm(k), v])
    else: exact[norm(k)] = v
import importlib.util as _u
_sp=_u.spec_from_file_location("x","tools/i18n/js_extra.py");_x=_u.module_from_spec(_sp);_sp.loader.exec_module(_x)
exact.update({norm(k):v for k,v in _x.EXACT.items() if in_js(k)})
_sp2=_u.spec_from_file_location("x2","tools/i18n/js_extra2.py");_x2=_u.module_from_spec(_sp2);_sp2.loader.exec_module(_x2)
for k,v in _x2.EXACT.items():
    if re.search(r"\{\d+\}", k): rules.append([norm(k), v])
    else: exact[norm(k)] = v
rules.sort(key=lambda r: -len(r[0]))
js = open("tools/i18n/i18n-tr.tpl.js").read()
js = js.replace("__EXACT__", json.dumps(exact, ensure_ascii=False, separators=(",", ":"))).replace("__WORDS__", json.dumps(_x.WORDS, ensure_ascii=False, separators=(",", ":"))).replace("__RULES__", json.dumps(rules, ensure_ascii=False, separators=(",", ":")))
open("js/i18n-tr.js", "w").write(js)
print(len(exact), len(rules), len(js) // 1024, "KB")
