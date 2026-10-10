"""Voegt op dienstpagina's de v7-templateblokken 'Kies uw aanpak' en 'Wat is inbegrepen — en wat niet standaard' toe.
Idempotent (markeert met data-v7-scope). Gebruik: python3 tools/apply-service-scope.py"""
import re

NOT_STANDARD = ["Vergunningen en leges (waar nodig regelt u die, of spreken we dit vooraf apart af)",
                "Elektra-aansluitingen: die laat u door een erkend installateur maken",
                "Verwijderen van onvoorziene obstakels in de grond (puin, oude funderingen, wortels)",
                "Werk aan kabels en leidingen, en herstel van schade door verborgen gebreken",
                "Afvoer van grond of groenafval als dat niet uitdrukkelijk in de offerte staat"]
QUOTE_LISTS = ["Per onderdeel de hoeveelheid, het materiaal en de eenheid (m², m¹, stuks)",
               "Arbeid in uren, tegen het vaste uurtarief van € 60,00 excl. btw per medewerker",
               "Of afvoer, voorbereiding en grondwerk wel of niet zijn inbegrepen",
               "Welke posten nog een stelpost of 'op aanvraag' zijn, en waarom",
               "Wat u zelf voorbereidt, zodat er achteraf geen verrassingen zijn"]

APPROACH = {
 "schuttingen": [("Compleet geplaatst", "Wij verzorgen materiaal, palen, onderplaten, poort en plaatsing; desgewenst ook het verwijderen van de oude schutting."),
                 ("Alleen montage", "U levert zelf het materiaal. Bespreekbaar na overleg: wij controleren vooraf aantallen en geschiktheid; gebreken of tekorten in aangeleverd materiaal vallen buiten onze verantwoordelijkheid."),
                 ("Herstel of vervangen", "Losse palen, scheve schermen of een kapotte poort: we beoordelen eerst of herstel zinvol is voordat we vervanging adviseren.")],
 "bestrating": [("Compleet aangelegd", "Uitgraven, zandbed, bestraten, opsluiten en invegen, in het materiaal en verband van uw keuze."),
                ("Alleen leggen", "U levert tegels of klinkers zelf. Bespreekbaar na overleg: snijverlies en reservemateriaal stemmen we vooraf af; tekorten of afwijkende partijen zijn voor uw rekening."),
                ("Herstel of ophogen", "Verzakte of losliggende delen herstellen, opnieuw leggen of ophogen, waar mogelijk met het bestaande materiaal.")],
 "tuinaanleg": [("Compleet aangelegd", "Van grondwerk tot beplanting, bestrating en afscheiding, in één planning en één offerte."),
                ("In fasen", "Eerst de basis (grondwerk, bestrating, schutting), later beplanting of verlichting. De fasering staat in de offerte."),
                ("Samen met uw eigen plan", "Heeft u al een ontwerp of een tekening van een tuinarchitect? Dan rekenen we daarop door.")],
 "tuinrenovatie": [("Volledige renovatie", "Oude bestrating, beplanting en afscheiding eruit, een nieuwe indeling erin."),
                   ("Gedeeltelijk vernieuwen", "Alleen de onderdelen die het verschil maken; wat goed is blijft behouden."),
                   ("Eerst opknappen", "Snoeien, onkruid verwijderen en herstellen, als tussenstap of als advies voordat u investeert.")],
 "tuinonderhoud": [("Eenmalige beurt", "Een grondige opknapbeurt: snoeien, onkruid, gazon en afvoer in overleg."),
                   ("Periodiek onderhoud", "Een vast ritme, bijvoorbeeld per seizoen of eens per twee maanden. Frequentie en tarief spreken we per tuin af."),
                   ("Advies op locatie", "U doet het liefst zelf? We lopen de tuin met u door en geven concreet advies.")],
 "periodiek-tuinonderhoud": [("Per seizoen", "Vier vaste beurten per jaar, afgestemd op voorjaar, zomer, najaar en winter."),
                             ("Vaste frequentie", "Bijvoorbeeld eens per twee maanden of maandelijks; dit spreken we per tuin af."),
                             ("Zakelijk of VvE", "Meerdere locaties, vaste werkbonnen en facturatie per object of per periode.")],
 "snoeiwerk": [("Hagen en heesters", "Vormsnoei en terugsnoei, op het juiste moment in het seizoen."),
               ("Bomen (beoordeling eerst)", "Groot boomwerk alleen na beoordeling; specialistisch werk besteden we niet zonder overleg uit."),
               ("Afvoer van snoeiafval", "Desgewenst nemen we het groenafval mee; dat staat dan expliciet in de offerte.")],
}

def li(t):
    return f'<li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>{t}</span></li>'
def li_not(t):
    return f'<li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg><span>{t}</span></li>'

for svc, options in APPROACH.items():
    p = f"{svc}/index.html"
    s = open(p).read()
    s = re.sub(r'\s*<section data-v7-scope>.*?</section><!-- /v7-scope -->', "", s, flags=re.S)
    cards = "\n".join(f'          <div class="card choice-card"><h3>{t}</h3><p>{d}</p></div>' for t, d in options)
    block = f'''
      <section data-v7-scope>
        <h2>Kies uw aanpak</h2>
        <div class="choice-grid">
{cards}
        </div>
        <h2>Wat staat er in uw offerte — en wat niet standaard?</h2>
        <div class="incl-grid">
          <div>
            <h3>Altijd benoemd in de offerte</h3>
            <ul class="checklist">{"".join(li(x) for x in QUOTE_LISTS)}</ul>
          </div>
          <div>
            <h3>Niet standaard inbegrepen</h3>
            <ul class="checklist checklist--not">{"".join(li_not(x) for x in NOT_STANDARD)}</ul>
          </div>
        </div>
        <p class="form-note">De offerte is leidend: daarin staat per onderdeel precies wat wel en niet is inbegrepen. Twijfelt u? Vraag het ons vóór u akkoord geeft.</p>
      </section><!-- /v7-scope -->
'''
    s = s.replace("\n      <h2>Hoe verloopt een opdracht?</h2>", block + "\n      <h2>Hoe verloopt een opdracht?</h2>", 1)
    open(p, "w").write(s)
print("ok")
