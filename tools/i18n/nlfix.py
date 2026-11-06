"""Zet informele aanspreekvormen (je/jij/jouw) om naar u/uw voor de Nederlandse site. Wordt ook op vertaalsleutels toegepast."""
import re
NOUNS = "ontwerp|keuzes|keuze|gegevens|tuin|schutting|maten|naam|postcode|woonplaats|aanvraag|offerte|idee|wensen|wens|omschrijving|foto|foto’s|foto's|plek|telefoonnummer|e-mailadres|project|situatie|vraag|antwoord|opmerking|overzicht|tuinplan|materiaal|hoogte|lengte|poort|buren|buurman|huis|schermen|bericht|gegeven|werk|stap|route|voorkeur|contactgegevens|beschrijving|afmetingen|erfgrens|grond|terras|pad|oprit|bestrating|plan|aanvullingen|reactie|ideeën|tekening"
VERB = {"wil": "wilt", "kun": "kunt", "ben": "bent", "heb": "heeft", "zie": "ziet", "kies": "kiest", "doe": "doet", "neem": "neemt", "ga": "gaat", "kom": "komt", "hoef": "hoeft", "weet": "weet", "mag": "mag", "moet": "moet", "zit": "zit", "vind": "vindt", "bent": "bent", "gebruik": "gebruikt", "meet": "meet", "teken": "tekent", "ken": "kent"}
def fix(s):
    if not re.search(r"\b[Jj](e|ij|ouw|ou)\b", s): return s
    def inv(m):
        v = m.group(1); lv = v.lower()
        if lv in VERB:
            t = VERB[lv]; t = t.capitalize() if v[0].isupper() else t
            return t + " u"
        return v + " u"
    s = re.sub(r"\b(Wil|wil|Kun|kun|Ben|ben|Heb|heb|Zie|zie|Kies|kies|Doe|doe|Neem|neem|Ga|ga|Kom|kom|Hoef|hoef|Weet|weet|Zit|zit|Vind|vind|Gebruik|gebruik|Meet|meet|Teken|teken) je\b", inv, s)
    s = re.sub(r"\b[Jj]ouw\b", lambda m: "Uw" if m.group(0)[0] == "J" else "uw", s)
    s = re.sub(r"\b[Jj]ij\b", lambda m: "U" if m.group(0)[0] == "J" else "u", s)
    s = re.sub(r"\b[Jj]ou\b", lambda m: "U" if m.group(0)[0] == "J" else "u", s)
    s = re.sub(r"\b([Jj])e (" + NOUNS + r")\b", lambda m: ("Uw " if m.group(1) == "J" else "uw ") + m.group(2), s)
    s = re.sub(r"\b[Jj]e\b", lambda m: "U" if m.group(0)[0] == "J" else "u", s)
    return s
if __name__ == "__main__":
    import sys
    for t in ["Wat wil je doen?", "Je keuzes zijn bewaard.", "Kun je dit meten?", "Neem je een foto mee?", "Voor je tuin", "Laat je inspireren door verschillende stijlen en afwerkingen. Wij bespreken samen de mogelijkheden en stemmen de definitieve materialen vooraf met je af."]: print(t, "->", fix(t))
