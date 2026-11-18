# Repeat what worked: French flashcards and Spanish bundle posts (draft for approval)

**Status:** draft. Nothing here is published. Tick `[x]` on each post you approve, or edit the copy in place and then tick.
**Written:** 18 November 2026, for the P0/P1 step "repeat what worked" in `docs/analytics/REPORT_2026-11-18-signups.md` §7 and `REPORT_2026-11-18-funnel.md` §8.

## Why these two offers

| Post | Offer | Language | Visitors | Signups | Rate |
|---|---|---|---:|---:|---:|
| **P-032** (organic pin) | Bilingual flashcards | FR | 13 | 3 | 23% |
| **FB-025** (organic Facebook post) | Bilingual bundle (5 printables) | ES | 7 | 3 | 43% |
| P-012 (organic pin) | Bilingual flashcards | EN | 5 | 2 | 40% |
| Paid pins (P-002, P-010, P-014, P-020) | Bedtime, parents' guide | EN, ES | 375 | 4 | about 1% |

The two posts that produced repeat signups were organic and non-English, and their offers (flashcards, bundle) convert at about 1 in 5 and 1 in 10 viewers. The drafts below repeat the **offer, language and channel** of each, with new hooks so they don't read as reposts. Nothing is boosted: the report found paid pins bought 5-second visits.

## Rules these drafts follow

- **Links** follow the campaign URL convention: `https://storytimewitheva.com/<es|fr>/free/<magnet>/?utm_source=<pinterest|facebook>&utm_medium=social&utm_campaign=<flashcards|bundle>_<lang>&utm_content=<id>`. Every link is the `/free/` landing page (form + analytics), never a PDF.
- **What is promised** is only what the landing page delivers (`src/components/EmailSignup.tsx`): the flashcards are 30 print-and-cut cards (animals, colours, numbers) with English, Spanish and French on every card; the bundle is 5 printables (starter kit, flashcards, bedtime chart, parent's guide, follow-up activities). The bundle copy here does not say "all in three languages": the campaign's lead-magnet table lists the 20-page starter kit as EN and ES only, although the landing page's bullet says "English, Spanish and French throughout". **Owner check:** if the starter kit has no French edition, that landing-page bullet should be corrected.
- No em dashes; at most three emoji on a pin; gender-neutral Spanish and French where the reader or child is addressed.
- **Ids are provisional.** The highest ids in this repo are P-137 (the kit pins draft) and FB-025. The master tracker is the system of record: before scheduling, take `Pinterest_Pins` max + 1 and `FB_Group_Posts` max + 1, and renumber these in order. The FB ids below start at FB-047 on the assumption that the tracker's 46 Facebook posts use FB-001 to FB-046; confirm that first.
- **Pace:** these 5 pins fit inside the documented cadence (about 5 a week) only if they replace kit pins in the same week. The posting plan (`KIT_PINS_POSTING_PLAN_2026-11.md`) opens each of weeks 1 to 5 with one of them, inside 5 pins a week.

## Pre-flight (each post, before it goes out)

1. Open the exact link from the post. It must show the signup form, in the post's language.
2. Check that a pageview appears in Plausible Realtime.
3. After the first signup, check that MailerLite shows the `utm_content` id on the subscriber and that they joined the `storytimewitheva-signups` group (and so the "Eva — Real site signups" segment).

---

## Pinterest (5 pins)

Images: reuse the **P-032 layout** (French flashcards) for the flashcards pins, with the overlay text below, and `public/pins/pin_15_full_bundle.png` (the five-resource bundle) as the base for the bundle pins. Fallback for both: the landing page previews `public/previews/bilingual-flashcards.webp` and `public/previews/bilingual-bundle.webp`, laid out at 1000 × 1500 px.

### [ ] P-138 · FR · flashcards · board: Ressources Bilingues (Français)

- **Overlay:** 30 cartes en 3 langues · gratuit à imprimer
- **Title:** 30 cartes trilingues gratuites à imprimer : animaux, couleurs, chiffres
- **Description:** Des cartes à imprimer et découper pour apprendre les animaux, les couleurs et les chiffres en français, en anglais et en espagnol. Les trois langues sont sur chaque carte. Dix minutes de ciseaux, des mois de jeux : mémory, devinettes, tri par couleur. Envoyées gratuitement par e-mail. #CartesÉducatives #Bilinguisme #ImprimableGratuit #ApprendreEnJouant
- **Link:** `https://storytimewitheva.com/fr/free/bilingual-flashcards/?utm_source=pinterest&utm_medium=social&utm_campaign=flashcards_fr&utm_content=P-138`

### [ ] P-139 · FR · flashcards · board: Ressources Bilingues (Français)

Angle: the teacher and classroom use that made P-012 the best click-through rate among organic pins.
- **Overlay:** Pour la classe ou la maison · 30 cartes FR · EN · ES
- **Title:** Cartes de vocabulaire trilingues pour la classe ou la maison, gratuites
- **Description:** Animaux, couleurs et chiffres en français, anglais et espagnol, sur 30 cartes à imprimer. Pratiques en petits groupes, en coin langues ou à la maison avec un enfant qui grandit avec deux ou trois langues. Gratuit, reçu par e-mail. #EnseignantsFLE #ClasseBilingue #Vocabulaire #ImprimableGratuit
- **Link:** `https://storytimewitheva.com/fr/free/bilingual-flashcards/?utm_source=pinterest&utm_medium=social&utm_campaign=flashcards_fr&utm_content=P-139`

### [ ] P-140 · ES · flashcards · board: Recursos Bilingües (Español)

- **Overlay:** 30 tarjetas en 3 idiomas · gratis para imprimir
- **Title:** 30 tarjetas trilingües gratis: animales, colores y números
- **Description:** Tarjetas para imprimir y recortar con animales, colores y números en español, inglés y francés. Los tres idiomas en cada tarjeta. Diez minutos con tijeras y meses de juegos: memoria, adivinanzas, ordenar por colores. Gratis, por correo. #TarjetasEducativas #CrianzaBilingüe #ImprimiblesGratis #AprenderJugando
- **Link:** `https://storytimewitheva.com/es/free/bilingual-flashcards/?utm_source=pinterest&utm_medium=social&utm_campaign=flashcards_es&utm_content=P-140`

### [ ] P-141 · ES · bundle · board: Recursos Bilingües (Español)

- **Overlay:** 5 imprimibles bilingües · gratis
- **Title:** Paquete bilingüe gratis: 5 imprimibles para leer y aprender en casa
- **Description:** Cinco recursos en un solo envío: un kit de inicio de 20 páginas, 30 tarjetas en tres idiomas, una tabla de rutina para dormir, una guía para criar un lector bilingüe y 5 actividades para después del cuento. Para imprimir las veces que quieras. #CrianzaBilingüe #ImprimiblesGratis #NiñosBilingües #LecturaEnCasa
- **Link:** `https://storytimewitheva.com/es/free/bilingual-bundle/?utm_source=pinterest&utm_medium=social&utm_campaign=bundle_es&utm_content=P-141`

### [ ] P-142 · FR · bundle · board: Ressources Bilingues (Français)

- **Overlay:** 5 ressources bilingues · gratuites
- **Title:** Pack bilingue gratuit : 5 ressources à imprimer pour lire à la maison
- **Description:** Cinq documents en un seul envoi : un kit de démarrage de 20 pages, 30 cartes en trois langues, un tableau de la routine du soir, un guide pour élever un lecteur bilingue et 5 activités pour après l'histoire. À imprimer autant de fois que vous voulez. #Bilinguisme #ImprimableGratuit #EnfantsBilingues #LectureÀLaMaison
- **Link:** `https://storytimewitheva.com/fr/free/bilingual-bundle/?utm_source=pinterest&utm_medium=social&utm_campaign=bundle_fr&utm_content=P-142`

---

## Facebook (4 posts)

FB-025 was a Spanish post about the bundle in a parents' group. These follow the same shape: a short personal opening, what is in it, the link, no hard sell. Post each in **one** Spanish- or French-language group from the tracker's `FB_Group_Targets` tab (check each group's rules on links first), or on the Page. Image: the landing page preview for the offer.

### [ ] FB-047 · ES · bundle (closest to FB-025)

> En casa leemos en tres idiomas, y con los años juntamos cinco recursos que usamos casi a diario. Los pusimos en un solo paquete gratuito:
>
> 📚 un kit de inicio de 20 páginas
> 🃏 30 tarjetas con animales, colores y números en español, inglés y francés
> 🌙 una tabla de rutina para dormir
> 📖 una guía para criar un lector bilingüe
> ✏️ 5 actividades para después del cuento
>
> Se reciben por correo y se pueden imprimir las veces que quieran.
> https://storytimewitheva.com/es/free/bilingual-bundle/?utm_source=facebook&utm_medium=social&utm_campaign=bundle_es&utm_content=FB-047

### [ ] FB-048 · ES · bundle, bedtime angle

> ¿A alguien más le cuesta la hora de dormir cuando hay dos idiomas en casa? A nosotros nos ayudó tener una rutina dibujada, con las palabras en los dos idiomas, pegada en la pared.
>
> Esa tabla viene en un paquete gratuito con otros cuatro imprimibles: tarjetas en tres idiomas, un kit de inicio, una guía para criar un lector bilingüe y actividades para después del cuento. Se lo dejo por si le sirve a alguien:
> https://storytimewitheva.com/es/free/bilingual-bundle/?utm_source=facebook&utm_medium=social&utm_campaign=bundle_es&utm_content=FB-048

### [ ] FB-049 · FR · flashcards

> Pour les familles qui jonglent entre le français et une autre langue : nous avons fait 30 cartes à imprimer avec des animaux, des couleurs et des chiffres. Chaque carte porte le mot en français, en anglais et en espagnol.
>
> On les découpe en dix minutes et on s'en sert pour un mémory, des devinettes ou un tri par couleur. C'est gratuit, envoyé par e-mail :
> https://storytimewitheva.com/fr/free/bilingual-flashcards/?utm_source=facebook&utm_medium=social&utm_campaign=flashcards_fr&utm_content=FB-049

### [ ] FB-050 · ES · flashcards

> Hicimos 30 tarjetas para imprimir con animales, colores y números, y cada una tiene la palabra en español, inglés y francés. Con los peques las usamos para jugar a la memoria, a adivinar y a ordenar por colores.
>
> Son gratis y llegan por correo. Por si le sirven a alguien que también cría con más de un idioma:
> https://storytimewitheva.com/es/free/bilingual-flashcards/?utm_source=facebook&utm_medium=social&utm_campaign=flashcards_es&utm_content=FB-050

---

## How to read the results

Re-run both reports in mid-December. For each id above, MailerLite's `utm_content` gives signups and Plausible's `utm_content` gives visitors. A post that matches P-032 or FB-025 (20% or more of visitors signing up, on any sample) is worth a variation; a post with visitors and no signups after two weeks is not.
