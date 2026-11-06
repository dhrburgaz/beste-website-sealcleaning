"""Contact-, zakelijke- en samenwerkingspagina: kop en begeleidende tekst herschreven, formulier behouden (zonder budgetvraag)."""
import re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pages as P
rd, wr, hero, sec, faq, checks, e = P.rd, P.wr, P.hero, P.sec, P.faq, P.checks, P.e
r = "../"

def meta(s, title, desc):
    s = re.sub(r'<title>.*?</title>', f"<title>{e(title)}</title>", s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + e(desc), s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + e(title.split(" — ")[0]) + " — Sealcleaning", s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + e(desc), s, count=1)
    return s

# contact
s = rd("contact/index.html")
s = re.sub(r'<section class="page-hero">.*?</section>', hero(r, [], "Contact", "Neem contact op", "Vertel ons wat u wilt laten doen. Bel, stuur een WhatsApp-bericht of vul het formulier in."), s, count=1, flags=re.S)
s = re.sub(r'\s*<li><svg[^>]*>(?:(?!</li>).)*?<span data-hours>.*?</li>', "", s, flags=re.S)
s = re.sub(r'<p class="callout" style="margin-top:1.5rem">.*?</p>', '<p class="callout" style="margin-top:1.5rem">Werkt u buiten ons werkgebied? Neem gerust contact op, dan bekijken we wat mogelijk is.</p>', s, count=1, flags=re.S)
s = s.replace("Offerte- of bezichtigingsformulier", "Offerteaanvraag")
s = re.sub(r'<p class="wizard-note"[^>]*>.*?</p>', '<p class="wizard-note" data-wizard-prefill-note hidden>We hebben uw keuzes uit de ontwerper hieronder alvast ingevuld. Pas ze gerust aan waar nodig.</p>', s, count=1, flags=re.S)
s = re.sub(r'(<p[^>]*>)Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met u op\..*?(</p>)', r"\1Vul het formulier in en wij nemen contact met u op. Sneller antwoord nodig? Bel ons of stuur een WhatsApp-bericht.\2", s, count=1, flags=re.S)
s = re.sub(r'\s*<fieldset class="field full">\s*<legend>Globale indicatie budget.*?</fieldset>', "", s, flags=re.S)
dup = re.search(r'(<strong>Stuur indien mogelijk[^\n]*</strong>[^\n]*\n)\s*\1', s)
if dup: s = s.replace(dup.group(0), dup.group(1))
s = s.replace("Vraag mijn bezichtiging aan", "Verstuur aanvraag").replace("Verstuur mijn aanvraag via e-mail", "Verstuur via uw e-mailprogramma")
items = [("Werken jullie buiten Dordrecht?", f'We werken in {P.AREA}. Werkt u daarbuiten? Neem contact op, dan bekijken we wat mogelijk is. Zie ook ons <a href="{r}werkgebied/">werkgebied</a>.'),
         ("Kan ik zelf materiaal kiezen?", "Ja. Wij adviseren over geschikt materiaal en de hoeveelheid. U kunt het via onze offerte laten opnemen, los of met montage, of in overleg zelf aanschaffen."),
         ("Kunnen jullie groenafval afvoeren?", "Afvoer van groenafval kan in overleg worden meegenomen in de offerte."),
         ("Doen jullie periodiek onderhoud?", f'Ja, lees meer op de pagina <a href="{r}periodiek-tuinonderhoud/">periodiek tuinonderhoud</a>.'),
         ("Hoe snel kunnen jullie beginnen?", "Dat hangt af van de planning en eventuele levertijd van materialen. We bespreken dit bij de offerte."),
         ("Kan ik foto's meesturen?", "Ja, voeg ze toe in het formulier. Lukt het versturen niet, dan kunt u de foto's via WhatsApp of e-mail naar ons sturen.")]
s = re.sub(r'<div class="faq-list">.*?</div>\s*</div>\s*</section>\s*</main>', lambda m: faq(items) + "\n    </div>\n  </section>\n</main>", s, count=1, flags=re.S)
s = meta(s, "Contact en offerte aanvragen — Sealcleaning", "Neem contact op met Sealcleaning in Dordrecht voor een offerte. Bel, stuur een WhatsApp-bericht of vul het formulier in.")
wr("contact/index.html", s)

# zakelijk
s = rd("voor-aannemers/index.html")
s = re.sub(r'<section class="page-hero">.*?</section>', hero(r, [], "Zakelijke opdrachtgevers", "Een opdracht voor uw project of terrein", "Heeft u als aannemer, vastgoedbeheerder of VvE een opdracht voor groenonderhoud of aanleg? Vertel ons wat u nodig heeft."), s, count=1, flags=re.S)
s = re.sub(r'<section class="section-tight">.*?</section>', sec("<h2>Waarvoor u ons kunt benaderen</h2>" + checks(["Schutting- en hekwerkplaatsing", "Bestrating en herstel van bestrating", "Tuinonderhoud en snoeiwerk", "Hogedrukreiniging", "Overige tuin- en groenwerkzaamheden"]), "section-tight"), s, count=1, flags=re.S)
s = s.replace("Hoe meer context, hoe sneller we een passend voorstel kunnen doen. KvK-nummer is bij een eerste aanvraag niet verplicht.", "Hoe meer context, hoe sneller we een passend voorstel kunnen doen.")
s = s.replace("U kunt ons ook rechtstreeks bereiken voor een eerste kennismaking.", "U kunt ons ook rechtstreeks bereiken.")
s = meta(s, "Zakelijke opdrachtgevers — Sealcleaning", "Een opdracht voor groenonderhoud of aanleg als aannemer, vastgoedbeheerder of VvE? Vertel Sealcleaning in Dordrecht wat u nodig heeft.")
wr("voor-aannemers/index.html", s)

# samenwerken
s = rd("werken-met-ons/index.html")
s = re.sub(r'<section class="page-hero">.*?</section>', hero(r, [], "Samenwerken", "Samenwerken met Sealcleaning", "Bent u vakman of zzp'er en wilt u met ons samenwerken? Laat het ons weten. Dit is geen concrete vacature."), s, count=1, flags=re.S)
s = s.replace("Disciplines waar we vaker mee samenwerken", "Voor welke werkzaamheden kunt u zich aanmelden?")
s = re.sub(r'<p class="callout">Uw gegevens en eventuele bijlagen.*?</p>', f'<p class="callout">Uw gegevens en eventuele bijlagen gebruiken wij alleen om uw interesse te beoordelen. Zie onze <a href="{r}privacy/">privacyverklaring</a>.</p>', s, count=1, flags=re.S)
s = meta(s, "Samenwerken — Sealcleaning", "Vakman of zzp'er en samenwerken met Sealcleaning in Dordrecht? Laat uw gegevens achter.")
wr("werken-met-ons/index.html", s)

# werkgebied-meta
s = rd("werkgebied/index.html")
s = meta(s, "Werkgebied — Sealcleaning", "Sealcleaning werkt in Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de Drechtsteden.")
wr("werkgebied/index.html", s)
print("formulierpagina's bijgewerkt")
