# PRD — Bad Dog Hundeschule
**Version:** 1.1  
**Datum:** 2026-04-01  
**Status:** Freigegeben für Phase 1

---

## 1. Vision & Ziel

**Bad Dog** ist eine moderne Hundeschule in **Adlikon bei Winterthur (8452)** mit eigenem Community-Ökosystem. Trainer ist **Marcus**. Die Webseite dient gleichzeitig als Marketing-Plattform, Buchungssystem und geschlossene Community für Hundebesitzer. Das Maskottchen und Logo ist **Pino**, ein Dobermann (Pino.jpg).

**Kernziele:**
- Neue Kunden gewinnen (Kursbuchungen)
- Bestehende Kunden binden (Community, Lernvideos, Trainer-Feedback)
- Vertrauen aufbauen durch Transparenz & Expertise

---

## 2. Zielgruppe

**Geografischer Fokus:** Raum Winterthur / Weinland (Adlikon, Andelfingen, Winterthur, Thurgau)

| Segment | Beschreibung |
|---|---|
| **Neueinsteiger** | Welpen-/Junghundebesitzer im Raum Winterthur/Weinland, erste Schritte |
| **Fortgeschrittene** | Interesse an Mantrailing, Sozialisation |
| **Community-Mitglieder** | Bestehende Kunden von Marcus, aktive Nutzer |
| **Sport-Interessierte** | Social Walks, Mantrailing als Freizeitaktivität |

---

## 3. Sitemap & Seitenstruktur

```
/                        → Startseite
/kurse                   → Kursübersicht
  /kurse/hundeschule     → Gruppenkurse
  /kurse/einzeltraining  → 1:1 Training
  /kurse/social-walks    → Social Walks
  /kurse/mantrailing     → Mantrailing
/buchen                  → Online-Buchung
/lernvideos              → Videobibliothek (öffentlich / Members)
/community               → Community-Bereich (Login erforderlich)
  /community/feed        → Posts & Video-Uploads der Mitglieder
  /community/mein-hund   → Profil, eigene Videos, Trainer-Feedback
/ueber-uns               → Team, Philosophie, Pino
/kontakt                 → Kontaktformular + Karte
/login                   → Anmeldung / Registrierung
```

---

## 4. Seiten im Detail

### 4.1 Startseite (/)
- **Hero:** Vollbild-Bild oder Video, "Bad Dog" Logo mit Pino.jpg, CTA "Jetzt Kurs buchen"
- **Über uns in Kürze:** 2–3 Sätze, Philosophie
- **Kursübersicht:** 4 Kacheln (Hundeschule, Einzeltraining, Social Walks, Mantrailing)
- **Community-Teaser:** Screenshot/Preview, CTA "Werde Mitglied"
- **Lernvideo-Teaser:** 2–3 Video-Thumbnails
- **Kundenstimmen:** 5 Testimonials (siehe Abschnitt 11)
- **Kontakt-CTA:** "Fragen? Schreib uns"

### 4.2 Kurse (/kurse)
Jede Kursseite enthält:
- Beschreibung & Ziele
- Für wen geeignet
- Kursdauer, Gruppengröße
- Preis
- Nächste Termine
- CTA "Jetzt buchen"

| Kurs | Beschreibung |
|---|---|
| **Hundeschule** | Grundgehorsam, Gruppentraining |
| **Einzeltraining** | Individuelles 1:1 mit dem Trainer |
| **Social Walks** | Gemeinsame Spaziergänge, Sozialisation |
| **Mantrailing** | Nasenarbeit, Personensuche |

### 4.3 Online-Buchung (/buchen)
- Buchungsanfrage per Formular: Kursauswahl → Wunschtermin → Kontaktdaten → Absenden
- Marcus bestätigt manuell per E-Mail (kein sofortiger Buchungsabschluss)
- **Keine Vorauszahlung** in Phase 1 — Zahlung vor Ort
- Automatische Bestätigungs-E-Mail an Kunden ("Wir haben deine Anfrage erhalten...")
- Formularfelder: Name, E-Mail, Telefon, Hund (Name, Rasse, Alter), gewünschter Kurs, Wunschtermin, Nachricht

### 4.4 Lernvideos (/lernvideos)
- **Phase 1:** Platzhalter-Seite "Lernvideos — coming soon", kein Video-Content nötig
- **Phase 2:** Videobibliothek, kategorisiert nach Thema (Grundkommandos, Leinenführigkeit, Mantrailing etc.)
- Upload & Verwaltung durch Marcus im Admin-Panel
- Video-Player via Cloudflare Stream oder YouTube-Einbettung (Phase 2 entscheiden)

### 4.5 Community (/community) — Login erforderlich
**Feed:**
- Mitglieder können Posts erstellen (Text + Bild + Video)
- Video-Upload: max. 500 MB, Formate mp4/mov
- Likes & Kommentare
- Trainer kann Videos **bewerten** (Sterne oder Label: "Super", "Üben", "Top-Fortschritt") und **kommentieren**

**Mein Hund (Profil):**
- Hundeprofil mit Name, Rasse, Alter, Foto
- Eigene hochgeladene Videos
- Trainer-Feedback-History
- Gebuchte Kurse

**Rollen:**
| Rolle | Rechte |
|---|---|
| **Gast** | Startseite, Kurse, Kontakt |
| **Mitglied** | Community, Lernvideos (voll), eigene Videos hochladen |
| **Trainer** | Videos bewerten/kommentieren, Lernvideos uploaden |
| **Admin** | Vollzugriff, Nutzerverwaltung |

### 4.6 Über uns (/ueber-uns)
- Trainer-Profil **Marcus**: Foto, Zertifikate, Erfahrung, Trainingsphilosophie
- Geschichte & Philosophie von Bad Dog
- Standort: **Andelfingerstrasse 2b, 8452 Adlikon** (Google Maps einbetten)
- Pino als Maskottchen — seine eigene Story
- Galerie

### 4.7 Kontakt (/kontakt)
- Kontaktformular (Name, E-Mail, Hund, Nachricht)
- Google Maps: Andelfingerstrasse 2b, 8452 Adlikon
- Telefon / WhatsApp Links
- FAQ-Akkordeon (häufige Fragen)

---

## 5. Design-System

### Farbpalette (inspiriert von Pino — Dobermann)
| Rolle | Farbe | Hex |
|---|---|---|
| **Primary** | Tiefschwarz | `#0D0D0D` |
| **Accent** | Rost / Tan (Dobermann-Abzeichen) | `#B5541A` |
| **Secondary** | Dunkelgrau | `#1E1E1E` |
| **Background** | Off-White / Creme | `#F5F0E8` |
| **Text** | Anthrazit | `#2C2C2C` |
| **Success** | Moosgrün | `#4A7C59` |

### Typography
- **Headlines:** Slab Serif oder Bold Sans (z.B. "Oswald", "Anton") — kraftvoll, markant
- **Body:** Clean Sans-Serif (z.B. "Inter", "DM Sans")

### Bildsprache
- Echte Fotos: Hunde in Aktion, Training, Natur
- Kein Stock-Foto-Look
- Pino.jpg prominent auf der Startseite als Logo/Maskottchen
- Dunkle, kontrastreiche Verarbeitung passend zur Marke

### Tone of Voice
- Direkt, selbstsicher, mit Humor ("Bad Dog" — der Name ist Programm)
- Professionell aber nicht steril
- Auf Augenhöhe mit Hundebesitzern

---

## 6. Tech-Stack

| Layer | Technologie | Begründung |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | SEO, Performance, Vercel-nativ |
| **Styling** | Tailwind CSS | Schnell, konsistent |
| **Auth** | NextAuth.js / Clerk | Community-Login, Rollen |
| **Datenbank** | PostgreSQL via Supabase | Community, Profile, Buchungen |
| **CMS** | Sanity.io | Lernvideos, Kursinhalte |
| **Video** | Cloudflare Stream oder Mux | Community-Uploads, Lernvideos |
| **Buchung** | Cal.com (self-hosted) oder Calendly | Termine |
| **Zahlung** | Stripe | Kursbuchung Vorauszahlung |
| **Hosting** | Vercel | CI/CD, Edge Network |
| **E-Mail** | Resend | Bestätigungen, Benachrichtigungen |

---

## 7. Community-Features im Detail

### Video-Upload Flow (Mitglied)
1. Mitglied öffnet Community-Feed
2. "Video hochladen" → Datei wählen (mp4/mov, max 500 MB)
3. Titel + Beschreibung eingeben ("Pino beim Sitz — Tag 3")
4. Optional: Kurs-Tag hinzufügen
5. Upload → Verarbeitungsstatus anzeigen
6. Video erscheint im Feed & im eigenen Profil

### Trainer-Feedback Flow
1. Trainer sieht neue Videos im Admin/Trainer-Dashboard
2. Bewertung auswählen: ⭐ Labels (z.B. "Sehr gut", "Weiter üben", "Top Fortschritt!")
3. Kommentar schreiben (Text, kann auch Timestamp-Links enthalten)
4. Mitglied erhält Benachrichtigung (E-Mail + In-App)

### Community-Regeln
- Nur eigene Hunde uploaden
- Kein Spam, kein Fremdinhalte
- Trainer-Kommentare sind bindend / professionell

---

## 8. SEO & Marketing

- **Lokale SEO:** "Hundeschule Winterthur", "Hundeschule Adlikon", "Mantrailing Winterthur", "Einzeltraining Hund Winterthur", "Social Walks Hund Zürich Unterland"
- **Google Business Profile:** Bad Dog Hundeschule, Andelfingerstrasse 2b, 8452 Adlikon
- **Meta-Tags** pro Seite (Open Graph für Social Sharing)
- **Strukturierte Daten:** LocalBusiness, Course, FAQ
- **Blog** (optional, Phase 3): Trainingstipps, Pino-Updates
- **Instagram-Feed** (Phase 3, sobald Account vorhanden)

---

## 9. Phasen & Prioritäten

### Phase 1 — MVP (Launch) ← AKTUELLER FOKUS
- [ ] Startseite mit Pino-Logo (Pino.jpg)
- [ ] Kursseiten: Hundeschule, Einzeltraining, Social Walks, Mantrailing
- [ ] Trainer-Seite: Marcus
- [ ] Kontaktformular
- [ ] Online-Buchung (Cal.com / Calendly)
- [ ] Lernvideos (statisch, kein Login nötig)
- [ ] Lokale SEO Winterthur
- [ ] Responsive Design (Mobile-first)
- [ ] Vercel Deployment

### Phase 2 — Community
- [ ] Auth (Login/Registrierung)
- [ ] Community Feed
- [ ] Video-Upload durch Mitglieder
- [ ] Trainer-Bewertungs- und Kommentarsystem (Marcus)
- [ ] Mitglieder-Profile (Hund-Profil)

### Phase 3 — Erweiterungen
- [ ] Stripe-Zahlung / Vorauszahlung
- [ ] Wartelisten
- [ ] Instagram-Integration
- [ ] Blog / Trainingstipps
- [ ] Push-Benachrichtigungen
- [ ] App (PWA)

---

## 10. Offene Fragen

**Geklärt:**
- [x] Standort: Andelfingerstrasse 2b, 8452 Adlikon
- [x] Trainer: Marcus
- [x] Community: erst ab Phase 2
- [x] Instagram: erst ab Phase 3

**Noch offen:**
- [ ] Telefonnummer / WhatsApp von Marcus für die Kontaktseite?
- [ ] Foto von Marcus für die Über-uns-Seite?
- [ ] Kurse: Gibt es bereits Preise und Termine die wir verwenden können?

**Alle weiteren Punkte geklärt:**
- [x] Adresse: Andelfingerstrasse 2b, 8452 Adlikon
- [x] Lernvideos: Platzhalter in Phase 1, Inhalt folgt später
- [x] Buchung: Formular-Anfrage, keine Zahlung online
- [x] Sprache: Deutsch
- [x] Testimonials: fiktiv (siehe Abschnitt 11)

---

## 11. Kundenstimmen (fiktiv — Platzhalter)

> **"Pino hat unser Leben verändert!"**
> Unser Labrador Bruno war völlig unerzogen — zog an der Leine, bellte jeden an, ignorierte uns komplett. Nach 4 Wochen Hundeschule bei Marcus ist er kaum wiederzuerkennen. Die ruhige, konsequente Art von Marcus hat nicht nur Bruno, sondern auch uns als Hundehalter weitergebracht.
> — *Sandra K., Winterthur — Hundeschule Grundkurs*

---

> **"Mantrailing ist unser neues Hobby!"**
> Ich habe den Mantrailing-Kurs gebucht, weil ich meiner Hündin Mia etwas Besonderes bieten wollte. Was für ein Erlebnis! Marcus erklärt alles geduldig, Schritt für Schritt. Mia liebt es, und ich bin jedes Mal wieder erstaunt, was Hunde leisten können. Absolute Empfehlung!
> — *Thomas R., Andelfingen — Mantrailing*

---

> **"Einzeltraining — genau das, was wir gebraucht haben"**
> Unser Berner Senne hatte massive Probleme mit anderen Hunden. Gruppentraining wäre nicht möglich gewesen. Marcus hat sich die Zeit genommen, unsere Situation wirklich zu verstehen, und einen individuellen Plan erstellt. Nach 3 Einzeltrainings sehen wir bereits riesige Fortschritte.
> — *Claudia M., Winterthur — Einzeltraining*

---

> **"Social Walks = Community für Hund und Mensch"**
> Die Social Walks sind weit mehr als nur spazieren gehen. Die Hunde lernen, entspannt in der Gruppe zu sein, und wir als Halter tauschen uns aus und lernen voneinander. Marcus ist immer dabei, gibt Tipps und sorgt dafür, dass es für alle sicher bleibt. Jede Woche ein Highlight!
> — *Mirjam W., Adlikon — Social Walks*

---

> **"Endlich eine Hundeschule die hält, was sie verspricht"**
> Ich war skeptisch — wir hatten schon zwei andere Hundeschulen ausprobiert, ohne Erfolg. Bei Bad Dog ist es anders. Marcus ist direkt, ehrlich und erklärt genau warum er was macht. Kein Hokuspokus, nur konsequente, hundefreundliche Methoden. Rex und ich kommen gerne wieder!
> — *Patrick D., Elgg — Hundeschule Aufbaukurs*

