# Kit pins, November 2026 (draft for approval)

**Status:** draft. Nothing here is published. The owner approves each pin by ticking its box, or edits the copy in place and then ticks.
**Written:** 18 November 2026, from the catalog (`src/data/books.data.ts`), the companion offer copy (`COMPANION_UI` in `src/components/EmailSignup.tsx`) and the signups report (`docs/analytics/REPORT_2026-11-18-signups.md`, section 7, P0).

## What is being pinned

Every published book has a free, email-gated **activity kit** at `/free/<book-id>-companion` (also under `/es/` and `/fr/`). The page shows the cover and a signup form. After signup the visitor gets three links, each opened in that book's mode:

1. the book's **two-page story worksheet** (questions, story words, drawing and a review), to print or save as PDF;
2. **Pixel's Story Quiz**, a picture quiz read aloud, for children who do not read yet;
3. **story-word flashcards** in English, Spanish and French.

The pin copy below promises exactly that and nothing more. No "no sign-up needed", no PDF download link, no plot beyond the catalog description.

The 18 November signups report found that the two best-converting posts were non-English (P-032, French flashcards; FB-025, Spanish bundle), so every kit gets an **EN, an ES and a FR pin**: 20 books x 3 languages = **60 pins**.

## Pin ids and UTM scheme

- **Ids:** renumbered on 18 November 2026 (owner decision) to **P-111 to P-175, in posting-date order**, because P-078 to P-110 already belong to published or planned pins in the master tracker; the 5 repeat-winner pins share this range. The map from the first-draft ids is `PIN_ID_MAP_2026-11-18.csv` in the owner's tracker folder. The kit pins were first numbered in catalog order, EN then ES then FR per book. The convention is the campaign skill's Pinterest ledger rule ("take max + 1" from the tracker's `Pinterest_Pins` tab; `utm_content` carries the creative id). The highest id visible in this repo is **P-077** (`public/pins/P-077_bk_pawa-rainbow-cloud_es.png`), so this draft starts at P-157. **Before scheduling, confirm in the tracker that P-157 is still free**; if the tracker is ahead of the repo, renumber from its max + 1 and keep the order below.
- **Link:** `https://storytimewitheva.com<lang prefix>/free/<book-id>-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_<book-id>&utm_content=<pin id>`, where the prefix is empty for EN, `/es` for ES and `/fr` for FR. This is the report's section 7 recommendation: one campaign per kit, so each kit's signups can be read the way P-032's were. The language is carried by the path and by the pin id, not by the campaign.
- **Boards:** the eight boards already exist and the skill says not to propose new ones. EN pins go to **Free Printables for Kids**, ES to **Recursos Bilingües (Español)**, FR to **Ressources Bilingues (Français)**. Pins for the 5 to 9 books could be cross-saved to **Homeschool Resources** or **Classroom Resources** later; that is not part of this approval.
- **Images:** the book cover from the catalog (`editions[lang].cover`, falling back to the English cover), laid out at 1000 x 1500 px with the overlay in the pin's language (section 8 of the holiday brief). None of the 56 PNGs in `public/pins/` is a kit pin. Where a **book** pin for the same book and language exists (P-055 to P-077, the `bk_` files), it is named so its layout can be reused with the overlay changed to the kit offer.

## How to approve

Tick `[x]` on each pin you approve. Edit the title or description in place if you want it changed; the limits are 100 characters for the title and 500 for the description, with 3 to 5 hashtags at the end. Leave a pin unticked to hold it back. Links and ids should not be edited by hand; if the id range has to move, say so and the file will be regenerated.

## Things to know before approving

- **A Little Boat's Big Wish** has no cover file in the repo. The catalog points at an Amazon-hosted image for EN and has no ES or FR edition, so all three pins fall back to that remote image. A local cover (or a render of the kit page) is needed before these three can be produced.
- **Ages 5 to 9 books** (Tower, Butterfly Effect, Emperor, Sanding Block, Heidi, Mira): the quiz is aimed at children who do not read yet, the younger end of these books. The copy keeps the kit page's own wording ("for children who don't read yet") rather than claiming the quiz suits the whole range.
- **Leo and the Wolf** gets Leo's own hand-written worksheet rather than the generic one; the pin still says "two-page story worksheet", as the kit page does.
- **The Little Mapmaker and The Adventures of Maya's Shadow** both star a Maya; the hooks name the shadow and the maps so the two are not confused.
- Spanish and French copy is gender-neutral where it addresses the child or reader ("quienes aún no leen", "les enfants"). Characters are described as the catalog describes them.
- Spanish and French descriptions say "three languages" rather than naming them, to stay under 500 characters; the kit page blurb uses the same wording.

## Summary of all 60 pins

| OK | Pin | Lang | Book | Board | Existing book pin |
|---|---|---|---|---|---|
| [ ] | P-157 | EN | The Day the Colors Got Mixed Up | Free Printables for Kids |  |
| [ ] | P-114 | ES | The Day the Colors Got Mixed Up | Recursos Bilingües (Español) |  |
| [ ] | P-115 | FR | The Day the Colors Got Mixed Up | Ressources Bilingues (Français) | P-057 |
| [ ] | P-159 | EN | The Rainbow Symphony | Free Printables for Kids |  |
| [ ] | P-119 | ES | The Rainbow Symphony | Recursos Bilingües (Español) |  |
| [ ] | P-120 | FR | The Rainbow Symphony | Ressources Bilingues (Français) | P-063 |
| [ ] | P-160 | EN | The Tower That Touched the Sky | Free Printables for Kids |  |
| [ ] | P-122 | ES | The Tower That Touched the Sky | Recursos Bilingües (Español) |  |
| [ ] | P-123 | FR | The Tower That Touched the Sky | Ressources Bilingues (Français) |  |
| [ ] | P-156 | EN | The Adventures of Maya's Shadow | Free Printables for Kids | P-055 |
| [ ] | P-112 | ES | The Adventures of Maya's Shadow | Recursos Bilingües (Español) |  |
| [ ] | P-113 | FR | The Adventures of Maya's Shadow | Ressources Bilingues (Français) |  |
| [ ] | P-161 | EN | The Sparrow Who Saved the Forest | Free Printables for Kids |  |
| [ ] | P-124 | ES | The Sparrow Who Saved the Forest | Recursos Bilingües (Español) | P-065 |
| [ ] | P-125 | FR | The Sparrow Who Saved the Forest | Ressources Bilingues (Français) |  |
| [ ] | P-162 | EN | Diego's Brave Leap | Free Printables for Kids |  |
| [ ] | P-127 | ES | Diego's Brave Leap | Recursos Bilingües (Español) | P-059 |
| [ ] | P-128 | FR | Diego's Brave Leap | Ressources Bilingues (Français) |  |
| [ ] | P-163 | EN | The Butterfly Effect | Free Printables for Kids | P-067 |
| [ ] | P-129 | ES | The Butterfly Effect | Recursos Bilingües (Español) |  |
| [ ] | P-130 | FR | The Butterfly Effect | Ressources Bilingues (Français) |  |
| [ ] | P-164 | EN | The Emperor's True Treasure | Free Printables for Kids |  |
| [ ] | P-132 | ES | The Emperor's True Treasure | Recursos Bilingües (Español) |  |
| [ ] | P-133 | FR | The Emperor's True Treasure | Ressources Bilingues (Français) | P-075 |
| [ ] | P-165 | EN | The Crooked Little Apple Tree | Free Printables for Kids |  |
| [ ] | P-134 | ES | The Crooked Little Apple Tree | Recursos Bilingües (Español) |  |
| [ ] | P-135 | FR | The Crooked Little Apple Tree | Ressources Bilingues (Français) | P-069 |
| [ ] | P-166 | EN | The True Beauty of Meadowbrook | Free Printables for Kids | P-073 |
| [ ] | P-136 | ES | The True Beauty of Meadowbrook | Recursos Bilingües (Español) |  |
| [ ] | P-137 | FR | The True Beauty of Meadowbrook | Ressources Bilingues (Français) |  |
| [ ] | P-167 | EN | The Sanding Block | Free Printables for Kids |  |
| [ ] | P-138 | ES | The Sanding Block | Recursos Bilingües (Español) |  |
| [ ] | P-139 | FR | The Sanding Block | Ressources Bilingues (Français) |  |
| [ ] | P-168 | EN | Leo and the Wolf | Free Printables for Kids |  |
| [ ] | P-140 | ES | Leo and the Wolf | Recursos Bilingües (Español) |  |
| [ ] | P-141 | FR | Leo and the Wolf | Ressources Bilingues (Français) |  |
| [ ] | P-169 | EN | Russet the Fox Learns a Lesson | Free Printables for Kids |  |
| [ ] | P-142 | ES | Russet the Fox Learns a Lesson | Recursos Bilingües (Español) |  |
| [ ] | P-143 | FR | Russet the Fox Learns a Lesson | Ressources Bilingues (Français) |  |
| [ ] | P-175 | EN | A Little Boat's Big Wish | Free Printables for Kids |  |
| [ ] | P-154 | ES | A Little Boat's Big Wish | Recursos Bilingües (Español) |  |
| [ ] | P-155 | FR | A Little Boat's Big Wish | Ressources Bilingues (Français) |  |
| [ ] | P-170 | EN | Heidi's Journey to Mastery | Free Printables for Kids |  |
| [ ] | P-144 | ES | Heidi's Journey to Mastery | Recursos Bilingües (Español) |  |
| [ ] | P-145 | FR | Heidi's Journey to Mastery | Ressources Bilingues (Français) |  |
| [ ] | P-171 | EN | The Cloud Collector | Free Printables for Kids |  |
| [ ] | P-146 | ES | The Cloud Collector | Recursos Bilingües (Español) |  |
| [ ] | P-147 | FR | The Cloud Collector | Ressources Bilingues (Français) |  |
| [ ] | P-158 | EN | The Little Mapmaker | Free Printables for Kids |  |
| [ ] | P-117 | ES | The Little Mapmaker | Recursos Bilingües (Español) | P-071 |
| [ ] | P-118 | FR | The Little Mapmaker | Ressources Bilingues (Français) |  |
| [ ] | P-172 | EN | Pawa and the Little Rainbow Cloud | Free Printables for Kids |  |
| [ ] | P-148 | ES | Pawa and the Little Rainbow Cloud | Recursos Bilingües (Español) | P-077 |
| [ ] | P-149 | FR | Pawa and the Little Rainbow Cloud | Ressources Bilingues (Français) |  |
| [ ] | P-173 | EN | Mira's Thousand Cubes | Free Printables for Kids | P-061 |
| [ ] | P-150 | ES | Mira's Thousand Cubes | Recursos Bilingües (Español) |  |
| [ ] | P-151 | FR | Mira's Thousand Cubes | Ressources Bilingues (Français) |  |
| [ ] | P-174 | EN | The Fig Tree's Secret | Free Printables for Kids |  |
| [ ] | P-152 | ES | The Fig Tree's Secret | Recursos Bilingües (Español) |  |
| [ ] | P-153 | FR | The Fig Tree's Secret | Ressources Bilingues (Français) |  |

## Pins by book

### The Day the Colors Got Mixed Up (`colors-mixed-up`, ages 4 to 7)

Theme: Color theory and curiosity. Kit page: `/free/colors-mixed-up-companion`. Pins P-157 (EN), P-114 (ES) and P-115 (FR).

#### P-157 (English)

- [ ] **Approved**
- **Title** (68/100): Free activity kit for "The Day the Colors Got Mixed Up", ages 4 to 7
- **Description** (459/500): Hawel wakes up to a blue banana and purple toast, then sets off with Pixel the butterfly to learn how red, yellow and blue make every other color. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 7. Sent by email. #FreePrintables #PictureBooks #ReadAloud #ColorTheory
- **Link:** `https://storytimewitheva.com/free/colors-mixed-up-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_colors-mixed-up&utm_content=P-157`
- **Image:** `/covers/colors-mixed-up-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-114 (Spanish)

- [ ] **Approved**
- **Title** (76/100): Actividades gratis para «El día que se mezclaron los colores», de 4 a 7 años
- **Description** (440/500): Hawel despierta con el plátano azul y la tostada morada, y sale con Pixel la mariposa a aprender cómo el rojo, el amarillo y el azul forman los demás colores. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 7 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Colores
- **Link:** `https://storytimewitheva.com/es/free/colors-mixed-up-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_colors-mixed-up&utm_content=P-114`
- **Image:** `/covers/colors-mixed-up-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-115 (French)

- [ ] **Approved**
- **Title** (85/100): Kit d'activités gratuit pour « Le jour où les couleurs se sont mélangées », 4 à 7 ans
- **Description** (475/500): Hawel se réveille avec une banane bleue et du pain grillé violet, puis part avec Pixel le papillon apprendre comment le rouge, le jaune et le bleu font les autres couleurs. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 7 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Couleurs
- **Link:** `https://storytimewitheva.com/fr/free/colors-mixed-up-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_colors-mixed-up&utm_content=P-115`
- **Image:** `/covers/colors-mixed-up-fr.webp`. Existing book pin for this book and language: `public/pins/P-057_bk_colors-mixed-up_fr.png`; reuse the layout with the kit overlay.
- **Board:** Ressources Bilingues (Français)

### The Rainbow Symphony (`rainbow-symphony`, ages 3 to 6)

Theme: Diversity and harmony. Kit page: `/free/rainbow-symphony-companion`. Pins P-159 (EN), P-119 (ES) and P-120 (FR).

#### P-159 (English)

- [ ] **Approved**
- **Title** (57/100): Free activity kit for "The Rainbow Symphony", ages 3 to 6
- **Description** (463/500): In the village of Harmonia every color sings its own song, until they argue about whose is best. Pawa, a small glowing light who loves them all, reminds them how a symphony works. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 3 to 6. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Harmony
- **Link:** `https://storytimewitheva.com/free/rainbow-symphony-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_rainbow-symphony&utm_content=P-159`
- **Image:** `/covers/rainbow-symphony-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-119 (Spanish)

- [ ] **Approved**
- **Title** (65/100): Actividades gratis para «La sinfonía del arcoíris», de 3 a 6 años
- **Description** (442/500): En Harmonía cada color canta su propia canción, hasta que se pelean por quién canta mejor. Pawa, una pequeña luz que los quiere a todos, les recuerda cómo funciona una sinfonía. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 3 a 6 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Diversidad
- **Link:** `https://storytimewitheva.com/es/free/rainbow-symphony-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_rainbow-symphony&utm_content=P-119`
- **Image:** `/covers/rainbow-symphony-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-120 (French)

- [ ] **Approved**
- **Title** (73/100): Kit d'activités gratuit pour « La symphonie de l'arc-en-ciel », 3 à 6 ans
- **Description** (473/500): À Harmonia, chaque couleur chante sa propre chanson, jusqu'au jour où elles se disputent. Pawa, une petite lumière qui les aime toutes, leur rappelle comment marche une symphonie. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 3 à 6 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Harmonie
- **Link:** `https://storytimewitheva.com/fr/free/rainbow-symphony-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_rainbow-symphony&utm_content=P-120`
- **Image:** `/covers/rainbow-symphony-fr.webp`. Existing book pin for this book and language: `public/pins/P-063_bk_rainbow-symphony_fr.png`; reuse the layout with the kit overlay.
- **Board:** Ressources Bilingues (Français)

### The Tower That Touched the Sky (`tower-touched-sky`, ages 5 to 9)

Theme: Humility and listening. Kit page: `/free/tower-touched-sky-companion`. Pins P-160 (EN), P-122 (ES) and P-123 (FR).

#### P-160 (English)

- [ ] **Approved**
- **Title** (67/100): Free activity kit for "The Tower That Touched the Sky", ages 5 to 9
- **Description** (473/500): Architect Victor Mercer designs the tallest tower ever imagined. One junior engineer raises her hand, and he never sees it. A story about humility and learning to ask questions. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Listening
- **Link:** `https://storytimewitheva.com/free/tower-touched-sky-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_tower-touched-sky&utm_content=P-160`
- **Image:** `/covers/tower-touched-sky-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-122 (Spanish)

- [ ] **Approved**
- **Title** (67/100): Actividades gratis para «La torre que tocó el cielo», de 5 a 9 años
- **Description** (442/500): El arquitecto Victor Mercer diseña la torre más alta jamás concebida. Una joven ingeniera levanta la mano, y él nunca la ve. Una historia sobre la humildad y la escucha. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Humildad
- **Link:** `https://storytimewitheva.com/es/free/tower-touched-sky-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_tower-touched-sky&utm_content=P-122`
- **Image:** `/covers/tower-touched-sky-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-123 (French)

- [ ] **Approved**
- **Title** (72/100): Kit d'activités gratuit pour « La tour qui touchait le ciel », 5 à 9 ans
- **Description** (470/500): L'architecte Victor Mercer conçoit la tour la plus haute jamais imaginée. Une jeune ingénieure lève la main, et il ne la voit jamais. Une histoire sur l'humilité et l'écoute. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Écoute
- **Link:** `https://storytimewitheva.com/fr/free/tower-touched-sky-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_tower-touched-sky&utm_content=P-123`
- **Image:** `/covers/tower-touched-sky-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Adventures of Maya's Shadow (`mayas-shadow`, ages 3 to 7)

Theme: Wonder and imagination. Kit page: `/free/mayas-shadow-companion`. Pins P-156 (EN), P-112 (ES) and P-113 (FR).

#### P-156 (English)

- [ ] **Approved**
- **Title** (68/100): Free activity kit for "The Adventures of Maya's Shadow", ages 3 to 7
- **Description** (469/500): Every night while Maya sleeps, her shadow wakes up and slips out the door for adventures of its own, and comes home by morning. Quiet wonder for bedtime. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 3 to 7. Sent by email. #FreePrintables #PictureBooks #ReadAloud #BedtimeStories
- **Link:** `https://storytimewitheva.com/free/mayas-shadow-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_mayas-shadow&utm_content=P-156`
- **Image:** `/covers/mayas-shadow-en.webp`. Existing book pin for this book and language: `public/pins/P-055_bk_mayas-shadow_en.png`; reuse the layout with the kit overlay.
- **Board:** Free Printables for Kids

#### P-112 (Spanish)

- [ ] **Approved**
- **Title** (75/100): Actividades gratis para «Las aventuras de la sombra de Maya», de 3 a 7 años
- **Description** (467/500): Cada noche, mientras Maya duerme, su sombra despierta y se escapa por la puerta hacia aventuras propias, y vuelve a casa al amanecer. Asombro tranquilo para la hora de dormir. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 3 a 7 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #CuentosParaDormir
- **Link:** `https://storytimewitheva.com/es/free/mayas-shadow-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_mayas-shadow&utm_content=P-112`
- **Image:** `/covers/mayas-shadow-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-113 (French)

- [ ] **Approved**
- **Title** (76/100): Kit d'activités gratuit pour « Les aventures de l'ombre de Maya », 3 à 7 ans
- **Description** (495/500): Chaque soir, pendant que Maya dort, son ombre se réveille et se glisse dehors pour vivre ses propres aventures, puis rentre au petit matin. Un émerveillement tranquille, pour le coucher. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 3 à 7 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #HistoireDuSoir
- **Link:** `https://storytimewitheva.com/fr/free/mayas-shadow-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_mayas-shadow&utm_content=P-113`
- **Image:** `/covers/mayas-shadow-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Sparrow Who Saved the Forest (`sparrow-saved-forest`, ages 4 to 8)

Theme: Kindness and courage. Kit page: `/free/sparrow-saved-forest-companion`. Pins P-161 (EN), P-124 (ES) and P-125 (FR).

#### P-161 (English)

- [ ] **Approved**
- **Title** (69/100): Free activity kit for "The Sparrow Who Saved the Forest", ages 4 to 8
- **Description** (453/500): When the forest is in trouble, the biggest animals don't notice. The smallest sparrow does. A gentle story about how the tiniest acts of kindness can change everything. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Kindness
- **Link:** `https://storytimewitheva.com/free/sparrow-saved-forest-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sparrow-saved-forest&utm_content=P-161`
- **Image:** `/covers/sparrow-saved-forest-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-124 (Spanish)

- [ ] **Approved**
- **Title** (71/100): Actividades gratis para «El gorrión que salvó el bosque», de 4 a 8 años
- **Description** (442/500): Cuando el bosque está en peligro, los animales más grandes no se dan cuenta. El gorrión más pequeño sí. Un cuento tierno sobre cómo los actos de bondad más pequeños lo cambian todo. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Bondad
- **Link:** `https://storytimewitheva.com/es/free/sparrow-saved-forest-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sparrow-saved-forest&utm_content=P-124`
- **Image:** `/covers/sparrow-saved-forest-es.webp`. Existing book pin for this book and language: `public/pins/P-065_bk_sparrow-saved-forest_es.png`; reuse the layout with the kit overlay.
- **Board:** Recursos Bilingües (Español)

#### P-125 (French)

- [ ] **Approved**
- **Title** (73/100): Kit d'activités gratuit pour « Le moineau qui sauva la forêt », 4 à 8 ans
- **Description** (473/500): Quand la forêt est en difficulté, les plus grands animaux ne voient rien. Le plus petit moineau, lui, le voit. Un album tendre sur les petits gestes de bonté qui changent tout. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Gentillesse
- **Link:** `https://storytimewitheva.com/fr/free/sparrow-saved-forest-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sparrow-saved-forest&utm_content=P-125`
- **Image:** `/covers/sparrow-saved-forest-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Diego's Brave Leap (`diegos-brave-leap`, ages 4 to 8)

Theme: Courage and self-trust. Kit page: `/free/diegos-brave-leap-companion`. Pins P-162 (EN), P-127 (ES) and P-128 (FR).

#### P-162 (English)

- [ ] **Approved**
- **Title** (55/100): Free activity kit for "Diego's Brave Leap", ages 4 to 8
- **Description** (464/500): On a sun-warmed cliff above the Mediterranean, Diego stands at the edge while everyone watches. A story about the kind of bravery that doesn't feel brave from the inside. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Courage
- **Link:** `https://storytimewitheva.com/free/diegos-brave-leap-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_diegos-brave-leap&utm_content=P-162`
- **Image:** `/covers/diegos-brave-leap-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-127 (Spanish)

- [ ] **Approved**
- **Title** (67/100): Actividades gratis para «El salto valiente de Diego», de 4 a 8 años
- **Description** (430/500): En un acantilado sobre el Mediterráneo, Diego está al borde mientras todos miran. Un cuento sobre el tipo de valentía que no se siente valiente desde dentro. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Valentía
- **Link:** `https://storytimewitheva.com/es/free/diegos-brave-leap-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_diegos-brave-leap&utm_content=P-127`
- **Image:** `/covers/diegos-brave-leap-es.webp`. Existing book pin for this book and language: `public/pins/P-059_bk_diegos-brave-leap_es.png`; reuse the layout with the kit overlay.
- **Board:** Recursos Bilingües (Español)

#### P-128 (French)

- [ ] **Approved**
- **Title** (70/100): Kit d'activités gratuit pour « Le saut courageux de Diego », 4 à 8 ans
- **Description** (485/500): Sur une falaise ensoleillée au-dessus de la Méditerranée, Diego se tient au bord pendant que tout le monde regarde. Une histoire sur le courage qui ne se sent pas courageux de l'intérieur. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Courage
- **Link:** `https://storytimewitheva.com/fr/free/diegos-brave-leap-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_diegos-brave-leap&utm_content=P-128`
- **Image:** `/covers/diegos-brave-leap-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Butterfly Effect (`butterfly-effect`, ages 5 to 9)

Theme: Kindness and ripple effects. Kit page: `/free/butterfly-effect-companion`. Pins P-163 (EN), P-129 (ES) and P-130 (FR).

#### P-163 (English)

- [ ] **Approved**
- **Title** (57/100): Free activity kit for "The Butterfly Effect", ages 5 to 9
- **Description** (463/500): One small kind thing turns into another, and another, until a whole community is changed. A story about how kindness travels in ways we don't always see. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Kindness
- **Link:** `https://storytimewitheva.com/free/butterfly-effect-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_butterfly-effect&utm_content=P-163`
- **Image:** `/covers/butterfly-effect-en.webp`. Existing book pin for this book and language: `public/pins/P-067_bk_butterfly-effect_en.png`; reuse the layout with the kit overlay.
- **Board:** Free Printables for Kids

#### P-129 (Spanish)

- [ ] **Approved**
- **Title** (59/100): Actividades gratis para «El efecto mariposa», de 5 a 9 años
- **Description** (444/500): Un pequeño gesto amable se convierte en otro, y otro, hasta que una comunidad entera cambia. Un cuento sobre cómo la bondad viaja por caminos que no siempre vemos. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Bondad
- **Link:** `https://storytimewitheva.com/es/free/butterfly-effect-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_butterfly-effect&utm_content=P-129`
- **Image:** `/covers/butterfly-effect-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-130 (French)

- [ ] **Approved**
- **Title** (60/100): Kit d'activités gratuit pour « L'effet papillon », 5 à 9 ans
- **Description** (485/500): Un petit geste de bonté en entraîne un autre, puis un autre, jusqu'à transformer toute une communauté. Un album sur la bonté qui voyage par des chemins qu'on ne voit pas toujours. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Gentillesse
- **Link:** `https://storytimewitheva.com/fr/free/butterfly-effect-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_butterfly-effect&utm_content=P-130`
- **Image:** `/covers/butterfly-effect-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Emperor's True Treasure (`emperors-true-treasure`, ages 5 to 9)

Theme: Gratitude and perspective. Kit page: `/free/emperors-true-treasure-companion`. Pins P-164 (EN), P-132 (ES) and P-133 (FR).

#### P-164 (English)

- [ ] **Approved**
- **Title** (64/100): Free activity kit for "The Emperor's True Treasure", ages 5 to 9
- **Description** (448/500): An emperor with a palace full of gold cannot understand why he feels so empty, while the villagers, who have almost nothing, seem to have everything that matters. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Gratitude
- **Link:** `https://storytimewitheva.com/free/emperors-true-treasure-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_emperors-true-treasure&utm_content=P-164`
- **Image:** `/covers/emperors-true-treasure-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-132 (Spanish)

- [ ] **Approved**
- **Title** (74/100): Actividades gratis para «El verdadero tesoro del emperador», de 5 a 9 años
- **Description** (427/500): Un emperador con un palacio lleno de oro no entiende por qué se siente tan vacío, mientras los aldeanos, que casi no tienen nada, parecen tener todo lo que importa. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Gratitud
- **Link:** `https://storytimewitheva.com/es/free/emperors-true-treasure-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_emperors-true-treasure&utm_content=P-132`
- **Image:** `/covers/emperors-true-treasure-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-133 (French)

- [ ] **Approved**
- **Title** (72/100): Kit d'activités gratuit pour « Le vrai trésor de l'empereur », 5 à 9 ans
- **Description** (464/500): Un empereur dont le palais regorge d'or ne comprend pas pourquoi il se sent si vide, alors que les villageois, qui n'ont presque rien, semblent avoir tout ce qui compte. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Gratitude
- **Link:** `https://storytimewitheva.com/fr/free/emperors-true-treasure-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_emperors-true-treasure&utm_content=P-133`
- **Image:** `/covers/emperors-true-treasure-fr.webp`. Existing book pin for this book and language: `public/pins/P-075_bk_emperors-true-treasure_fr.png`; reuse the layout with the kit overlay.
- **Board:** Ressources Bilingues (Français)

### The Crooked Little Apple Tree (`crooked-little-apple-tree`, ages 4 to 8)

Theme: Worth and being seen. Kit page: `/free/crooked-little-apple-tree-companion`. Pins P-165 (EN), P-134 (ES) and P-135 (FR).

#### P-165 (English)

- [ ] **Approved**
- **Title** (66/100): Free activity kit for "The Crooked Little Apple Tree", ages 4 to 8
- **Description** (457/500): The orchard wants only straight, perfect trees, and the crooked little apple tree at the edge has been overlooked for years. Until the year someone really looks. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #SelfWorth
- **Link:** `https://storytimewitheva.com/free/crooked-little-apple-tree-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_crooked-little-apple-tree&utm_content=P-165`
- **Image:** `/covers/crooked-little-apple-tree-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-134 (Spanish)

- [ ] **Approved**
- **Title** (67/100): Actividades gratis para «El pequeño manzano torcido», de 4 a 8 años
- **Description** (437/500): En el huerto solo quieren árboles rectos y perfectos, y al pequeño manzano torcido del borde llevan años sin verlo. Hasta el año en que alguien lo mira de verdad. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Autoestima
- **Link:** `https://storytimewitheva.com/es/free/crooked-little-apple-tree-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_crooked-little-apple-tree&utm_content=P-134`
- **Image:** `/covers/crooked-little-apple-tree-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-135 (French)

- [ ] **Approved**
- **Title** (66/100): Kit d'activités gratuit pour « Le petit pommier tordu », 4 à 8 ans
- **Description** (477/500): Le verger ne veut que des arbres droits et parfaits, et le petit pommier tordu au bord est resté invisible pendant des années. Jusqu'à l'année où quelqu'un le regarde vraiment. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #EstimeDeSoi
- **Link:** `https://storytimewitheva.com/fr/free/crooked-little-apple-tree-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_crooked-little-apple-tree&utm_content=P-135`
- **Image:** `/covers/crooked-little-apple-tree-fr.webp`. Existing book pin for this book and language: `public/pins/P-069_bk_crooked-little-apple-tree_fr.png`; reuse the layout with the kit overlay.
- **Board:** Ressources Bilingues (Français)

### The True Beauty of Meadowbrook (`true-beauty-meadowbrook`, ages 4 to 8)

Theme: Inner beauty and kindness. Kit page: `/free/true-beauty-meadowbrook-companion`. Pins P-166 (EN), P-136 (ES) and P-137 (FR).

#### P-166 (English)

- [ ] **Approved**
- **Title** (67/100): Free activity kit for "The True Beauty of Meadowbrook", ages 4 to 8
- **Description** (474/500): In a town where everyone competes to look the most beautiful, a quiet girl figures out a different way to shine. A story about kindness as the beauty that lasts. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #InnerBeauty
- **Link:** `https://storytimewitheva.com/free/true-beauty-meadowbrook-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_true-beauty-meadowbrook&utm_content=P-166`
- **Image:** `/covers/true-beauty-meadowbrook-en.webp`. Existing book pin for this book and language: `public/pins/P-073_bk_true-beauty-meadowbrook_en.png`; reuse the layout with the kit overlay.
- **Board:** Free Printables for Kids

#### P-136 (Spanish)

- [ ] **Approved**
- **Title** (76/100): Actividades gratis para «La verdadera belleza de Meadowbrook», de 4 a 8 años
- **Description** (453/500): En un pueblo donde todos compiten por ser los más bellos, una niña tranquila descubre otra forma de brillar. Un cuento sobre la bondad como la belleza que perdura. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #BellezaInterior
- **Link:** `https://storytimewitheva.com/es/free/true-beauty-meadowbrook-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_true-beauty-meadowbrook&utm_content=P-136`
- **Image:** `/covers/true-beauty-meadowbrook-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-137 (French)

- [ ] **Approved**
- **Title** (74/100): Kit d'activités gratuit pour « La vraie beauté de Meadowbrook », 4 à 8 ans
- **Description** (472/500): Dans une ville où chacun rivalise pour être le plus beau, une fille discrète découvre une autre façon de briller. Un album sur la bonté comme la beauté qui dure. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #BeautéIntérieure
- **Link:** `https://storytimewitheva.com/fr/free/true-beauty-meadowbrook-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_true-beauty-meadowbrook&utm_content=P-137`
- **Image:** `/covers/true-beauty-meadowbrook-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Sanding Block (`sanding-block`, ages 5 to 9)

Theme: Patience and craft. Kit page: `/free/sanding-block-companion`. Pins P-167 (EN), P-138 (ES) and P-139 (FR).

#### P-167 (English)

- [ ] **Approved**
- **Title** (54/100): Free activity kit for "The Sanding Block", ages 5 to 9
- **Description** (442/500): A boy wants to be a great woodworker today, right now. His grandfather hands him a sanding block. A story about the slow craft of becoming good at something. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Patience
- **Link:** `https://storytimewitheva.com/free/sanding-block-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sanding-block&utm_content=P-167`
- **Image:** `/covers/sanding-block-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-138 (Spanish)

- [ ] **Approved**
- **Title** (59/100): Actividades gratis para «El bloque de lijar», de 5 a 9 años
- **Description** (414/500): Un niño quiere ser un gran carpintero hoy, ya. Su abuelo le entrega un bloque de lijar. Un cuento sobre el oficio lento de llegar a ser bueno en algo. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Paciencia
- **Link:** `https://storytimewitheva.com/es/free/sanding-block-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sanding-block&utm_content=P-138`
- **Image:** `/covers/sanding-block-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-139 (French)

- [ ] **Approved**
- **Title** (60/100): Kit d'activités gratuit pour « Le bloc à poncer », 5 à 9 ans
- **Description** (468/500): Un jeune garçon veut être un grand menuisier aujourd'hui, tout de suite. Son grand-père lui tend un bloc à poncer. Un album sur l'art patient de devenir bon en quelque chose. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Patience
- **Link:** `https://storytimewitheva.com/fr/free/sanding-block-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_sanding-block&utm_content=P-139`
- **Image:** `/covers/sanding-block-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Leo and the Wolf (`leo-and-the-wolf`, ages 4 to 8)

Theme: Honesty and trust. Kit page: `/free/leo-and-the-wolf-companion`. Pins P-168 (EN), P-140 (ES) and P-141 (FR).

#### P-168 (English)

- [ ] **Approved**
- **Title** (53/100): Free activity kit for "Leo and the Wolf", ages 4 to 8
- **Description** (459/500): Leo loves his first real job as a shepherd, until a small mischief makes him shout 'Wolf!' once too often. A retelling of the timeless fable about honesty and trust. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Honesty
- **Link:** `https://storytimewitheva.com/free/leo-and-the-wolf-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_leo-and-the-wolf&utm_content=P-168`
- **Image:** `/covers/leo-and-the-wolf-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-140 (Spanish)

- [ ] **Approved**
- **Title** (54/100): Actividades gratis para «Leo y el lobo», de 4 a 8 años
- **Description** (452/500): Leo adora su primer trabajo de pastor, hasta que una travesura le hace gritar «¡Lobo!» una vez de más. La fábula eterna sobre la honestidad y la confianza, en una nueva versión. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Honestidad
- **Link:** `https://storytimewitheva.com/es/free/leo-and-the-wolf-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_leo-and-the-wolf&utm_content=P-140`
- **Image:** `/covers/leo-and-the-wolf-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-141 (French)

- [ ] **Approved**
- **Title** (58/100): Kit d'activités gratuit pour « Léo et le loup », 4 à 8 ans
- **Description** (474/500): Léo adore son premier métier de berger, jusqu'à ce qu'une malice lui fasse crier « Loup ! » une fois de trop. La fable intemporelle sur l'honnêteté et la confiance, revisitée. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Honnêteté
- **Link:** `https://storytimewitheva.com/fr/free/leo-and-the-wolf-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_leo-and-the-wolf&utm_content=P-141`
- **Image:** `/covers/leo-and-the-wolf-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Russet the Fox Learns a Lesson (`russet-the-fox`, ages 4 to 8)

Theme: Listening and humility. Kit page: `/free/russet-the-fox-companion`. Pins P-169 (EN), P-142 (ES) and P-143 (FR).

#### P-169 (English)

- [ ] **Approved**
- **Title** (67/100): Free activity kit for "Russet the Fox Learns a Lesson", ages 4 to 8
- **Description** (486/500): Russet is sure he is the cleverest fox in the den, so when his mother warns him about the dogs and the wire fence, he barely listens. A fable about humility and taking your time. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Fables
- **Link:** `https://storytimewitheva.com/free/russet-the-fox-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_russet-the-fox&utm_content=P-169`
- **Image:** `/covers/russet-the-fox-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-142 (Spanish)

- [ ] **Approved**
- **Title** (76/100): Actividades gratis para «Russet el zorro aprende una lección», de 4 a 8 años
- **Description** (459/500): Russet está seguro de ser el zorro más listo de la madriguera, así que cuando su madre le advierte sobre los perros y la alambrada, apenas escucha. Una fábula sobre la humildad. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Fábulas
- **Link:** `https://storytimewitheva.com/es/free/russet-the-fox-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_russet-the-fox&utm_content=P-142`
- **Image:** `/covers/russet-the-fox-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-143 (French)

- [ ] **Approved**
- **Title** (78/100): Kit d'activités gratuit pour « Russet le renard apprend une leçon », 4 à 8 ans
- **Description** (472/500): Russet est sûr d'être le renard le plus malin du terrier, alors quand sa mère le met en garde contre les chiens et la clôture, il écoute à peine. Une fable sur l'humilité. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Fables
- **Link:** `https://storytimewitheva.com/fr/free/russet-the-fox-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_russet-the-fox&utm_content=P-143`
- **Image:** `/covers/russet-the-fox-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### A Little Boat's Big Wish (`little-boats-big-wish`, ages 3 to 7)

Theme: Contentment and wonder in small worlds. Kit page: `/free/little-boats-big-wish-companion`. Pins P-175 (EN), P-154 (ES) and P-155 (FR).

#### P-175 (English)

- [ ] **Approved**
- **Title** (61/100): Free activity kit for "A Little Boat's Big Wish", ages 3 to 7
- **Description** (491/500): A small yellow wooden boat on the bathroom shelf dreams of the open ocean. Then a boy carries him out to a puddle, where a frog, a turtle, a goldfish and a duckling are waiting. A gentle bedtime book. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 3 to 7. Sent by email. #FreePrintables #PictureBooks #ReadAloud #BedtimeStories
- **Link:** `https://storytimewitheva.com/free/little-boats-big-wish-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-boats-big-wish&utm_content=P-175`
- **Image:** `https://m.media-amazon.com/images/I/71Zjj22p5sL.jpg` (remote image, not in the repo). No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-154 (Spanish)

- [ ] **Approved**
- **Title** (74/100): Actividades gratis para «El gran deseo de un pequeño barco», de 3 a 7 años
- **Description** (474/500): Un pequeño barco amarillo de madera sueña con el océano desde el estante del baño. Hasta que un niño lo lleva a un charco, donde esperan una rana, una tortuga, un pez y un patito. Un cuento para dormir. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 3 a 7 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #CuentosParaDormir
- **Link:** `https://storytimewitheva.com/es/free/little-boats-big-wish-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-boats-big-wish&utm_content=P-154`
- **Image:** `https://m.media-amazon.com/images/I/71Zjj22p5sL.jpg` (no ES cover in the catalog; English cover used) (remote image, not in the repo). No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-155 (French)

- [ ] **Approved**
- **Title** (75/100): Kit d'activités gratuit pour « Le grand rêve d’un petit bateau », 3 à 7 ans
- **Description** (500/500): Un petit bateau jaune en bois rêve de l'océan depuis l'étagère de la salle de bain. Puis un enfant l'emporte vers une flaque, où l'attendent une grenouille, une tortue et un caneton. Un livre du soir. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 3 à 7 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #HistoireDuSoir
- **Link:** `https://storytimewitheva.com/fr/free/little-boats-big-wish-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-boats-big-wish&utm_content=P-155`
- **Image:** `https://m.media-amazon.com/images/I/71Zjj22p5sL.jpg` (no FR cover in the catalog; English cover used) (remote image, not in the repo). No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Heidi's Journey to Mastery (`heidis-journey-to-mastery`, ages 5 to 9)

Theme: Patience and apprenticeship. Kit page: `/free/heidis-journey-to-mastery-companion`. Pins P-170 (EN), P-144 (ES) and P-145 (FR).

#### P-170 (English)

- [ ] **Approved**
- **Title** (63/100): Free activity kit for "Heidi's Journey to Mastery", ages 5 to 9
- **Description** (473/500): Seven-year-old Heidi dreams of inventions and expects gears and tools in her grandfather's workshop. He hands her a broom. A story about the patient road from dreaming to making. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Patience
- **Link:** `https://storytimewitheva.com/free/heidis-journey-to-mastery-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_heidis-journey-to-mastery&utm_content=P-170`
- **Image:** `/covers/heidis-journey-to-mastery-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-144 (Spanish)

- [ ] **Approved**
- **Title** (77/100): Actividades gratis para «El camino de Heidi hacia la maestría», de 5 a 9 años
- **Description** (454/500): Heidi tiene siete años, sueña con inventos y espera engranajes y herramientas en el taller de su abuelo. Él le da una escoba. Un cuento sobre el camino paciente del soñar al hacer. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Paciencia
- **Link:** `https://storytimewitheva.com/es/free/heidis-journey-to-mastery-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_heidis-journey-to-mastery&utm_content=P-144`
- **Image:** `/covers/heidis-journey-to-mastery-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-145 (French)

- [ ] **Approved**
- **Title** (79/100): Kit d'activités gratuit pour « Le chemin de Heidi vers la maîtrise », 5 à 9 ans
- **Description** (489/500): Heidi a sept ans, rêve d'inventions et s'attend à des engrenages et des outils dans l'atelier de son grand-père. Il lui tend un balai. Un album sur la route patiente du rêve à la fabrication. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Patience
- **Link:** `https://storytimewitheva.com/fr/free/heidis-journey-to-mastery-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_heidis-journey-to-mastery&utm_content=P-145`
- **Image:** `/covers/heidis-journey-to-mastery-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Cloud Collector (`cloud-collector`, ages 4 to 8)

Theme: Wonder and letting go. Kit page: `/free/cloud-collector-companion`. Pins P-171 (EN), P-146 (ES) and P-147 (FR).

#### P-171 (English)

- [ ] **Approved**
- **Title** (56/100): Free activity kit for "The Cloud Collector", ages 4 to 8
- **Description** (472/500): Luna sets out into the meadow with a butterfly net and a glass jar to collect one cloud of every kind, and slowly learns that some things are too beautiful to keep. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Wonder
- **Link:** `https://storytimewitheva.com/free/cloud-collector-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_cloud-collector&utm_content=P-171`
- **Image:** `/covers/cloud-collector-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-146 (Spanish)

- [ ] **Approved**
- **Title** (66/100): Actividades gratis para «La coleccionista de nubes», de 4 a 8 años
- **Description** (457/500): Luna sale al prado con una red de mariposas y un frasco para coleccionar una nube de cada tipo, y poco a poco aprende que algunas cosas son demasiado hermosas para guardarlas. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Asombro
- **Link:** `https://storytimewitheva.com/es/free/cloud-collector-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_cloud-collector&utm_content=P-146`
- **Image:** `/covers/cloud-collector-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-147 (French)

- [ ] **Approved**
- **Title** (72/100): Kit d'activités gratuit pour « La collectionneuse de nuages », 4 à 8 ans
- **Description** (498/500): Luna part dans la prairie avec un filet à papillons et un bocal pour collectionner un nuage de chaque sorte, et apprend peu à peu que certaines choses sont trop belles pour qu'on les garde. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Émerveillement
- **Link:** `https://storytimewitheva.com/fr/free/cloud-collector-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_cloud-collector&utm_content=P-147`
- **Image:** `/covers/cloud-collector-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Little Mapmaker (`little-mapmaker`, ages 4 to 8)

Theme: Imagination and making. Kit page: `/free/little-mapmaker-companion`. Pins P-158 (EN), P-117 (ES) and P-118 (FR).

#### P-158 (English)

- [ ] **Approved**
- **Title** (56/100): Free activity kit for "The Little Mapmaker", ages 4 to 8
- **Description** (474/500): Maya is five and she draws maps, with her dog Pepper beside her. One day she draws a castle in the tall grass, and it is exactly where she put it. A story about imagination and a pencil. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Imagination
- **Link:** `https://storytimewitheva.com/free/little-mapmaker-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-mapmaker&utm_content=P-158`
- **Image:** `/covers/little-mapmaker-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-117 (Spanish)

- [ ] **Approved**
- **Title** (62/100): Actividades gratis para «La pequeña cartógrafa», de 4 a 8 años
- **Description** (453/500): Maya tiene cinco años y dibuja mapas, con su perro Pepper a su lado. Un día dibuja un castillo entre la hierba alta, y está justo donde lo puso. Un cuento sobre la imaginación y un lápiz. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Imaginación
- **Link:** `https://storytimewitheva.com/es/free/little-mapmaker-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-mapmaker&utm_content=P-117`
- **Image:** `/covers/little-mapmaker-es.webp`. Existing book pin for this book and language: `public/pins/P-071_bk_little-mapmaker_es.png`; reuse the layout with the kit overlay.
- **Board:** Recursos Bilingües (Español)

#### P-118 (French)

- [ ] **Approved**
- **Title** (65/100): Kit d'activités gratuit pour « La petite cartographe », 4 à 8 ans
- **Description** (492/500): Maya a cinq ans et dessine des cartes, son chien Pepper à ses côtés. Un jour, elle dessine un château dans les hautes herbes, et il est exactement là où elle l'a posé. Une histoire d'imagination. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Imagination
- **Link:** `https://storytimewitheva.com/fr/free/little-mapmaker-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_little-mapmaker&utm_content=P-118`
- **Image:** `/covers/little-mapmaker-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Pawa and the Little Rainbow Cloud (`pawa-rainbow-cloud`, ages 3 to 7)

Theme: Self-worth and transformation. Kit page: `/free/pawa-rainbow-cloud-companion`. Pins P-172 (EN), P-148 (ES) and P-149 (FR).

#### P-172 (English)

- [ ] **Approved**
- **Title** (70/100): Free activity kit for "Pawa and the Little Rainbow Cloud", ages 3 to 7
- **Description** (474/500): Cirro is a little gray cloud who feels heavy and sad after a storm. Pawa the wise Sun knows a quiet secret about what happens when rain meets light. A story about big feelings. The free kit picks up where the book ends: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 3 to 7. Sent by email. #FreePrintables #PictureBooks #ReadAloud #BigFeelings
- **Link:** `https://storytimewitheva.com/free/pawa-rainbow-cloud-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_pawa-rainbow-cloud&utm_content=P-172`
- **Image:** `/covers/pawa-rainbow-cloud-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-148 (Spanish)

- [ ] **Approved**
- **Title** (72/100): Actividades gratis para «Pawa y la pequeña nube arcoíris», de 3 a 7 años
- **Description** (451/500): Cirro es una pequeña nube gris que se siente pesada y triste tras una tormenta. Pawa, el sabio Sol, conoce un secreto sobre lo que pasa cuando la lluvia se encuentra con la luz. Las actividades gratis siguen al cuento: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 3 a 7 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Emociones
- **Link:** `https://storytimewitheva.com/es/free/pawa-rainbow-cloud-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_pawa-rainbow-cloud&utm_content=P-148`
- **Image:** `/covers/pawa-rainbow-cloud-es.webp`. Existing book pin for this book and language: `public/pins/P-077_bk_pawa-rainbow-cloud_es.png`; reuse the layout with the kit overlay.
- **Board:** Recursos Bilingües (Español)

#### P-149 (French)

- [ ] **Approved**
- **Title** (78/100): Kit d'activités gratuit pour « Pawa et le petit nuage arc-en-ciel », 3 à 7 ans
- **Description** (476/500): Cirro est un petit nuage gris qui se sent lourd et triste après l'orage. Pawa, le sage Soleil, connaît un secret tranquille sur ce qui arrive quand la pluie rencontre la lumière. Le kit gratuit prend le relais du livre : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 3 à 7 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Émotions
- **Link:** `https://storytimewitheva.com/fr/free/pawa-rainbow-cloud-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_pawa-rainbow-cloud&utm_content=P-149`
- **Image:** `/covers/pawa-rainbow-cloud-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### Mira's Thousand Cubes (`miras-thousand-cubes`, ages 5 to 9)

Theme: Patience and mastery. Kit page: `/free/miras-thousand-cubes-companion`. Pins P-173 (EN), P-150 (ES) and P-151 (FR).

#### P-173 (English)

- [ ] **Approved**
- **Title** (58/100): Free activity kit for "Mira's Thousand Cubes", ages 5 to 9
- **Description** (491/500): In a mountain village of stone carvers, Mira dreams of sculpting eagles. Master Hiroshi's first task for her is a thousand identical cubes. A story about doing the small thing well. After you read it together, keep going with the free kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 5 to 9. Sent by email. #FreePrintables #PictureBooks #ReadAloud #Patience
- **Link:** `https://storytimewitheva.com/free/miras-thousand-cubes-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_miras-thousand-cubes&utm_content=P-173`
- **Image:** `/covers/miras-thousand-cubes-en.webp`. Existing book pin for this book and language: `public/pins/P-061_bk_miras-thousand-cubes_en.png`; reuse the layout with the kit overlay.
- **Board:** Free Printables for Kids

#### P-150 (Spanish)

- [ ] **Approved**
- **Title** (62/100): Actividades gratis para «Los mil cubos de Mira», de 5 a 9 años
- **Description** (470/500): En un pueblo de talladores de piedra, Mira sueña con esculpir águilas. La primera tarea que le da el maestro Hiroshi es tallar mil cubos idénticos. Un cuento sobre hacer bien lo pequeño. Después de leer, sigan con las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 5 a 9 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Paciencia
- **Link:** `https://storytimewitheva.com/es/free/miras-thousand-cubes-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_miras-thousand-cubes&utm_content=P-150`
- **Image:** `/covers/miras-thousand-cubes-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-151 (French)

- [ ] **Approved**
- **Title** (67/100): Kit d'activités gratuit pour « Les mille cubes de Mira », 5 à 9 ans
- **Description** (497/500): Dans un village de sculpteurs, Mira rêve de tailler des aigles. La première tâche que lui confie Maître Hiroshi : mille cubes identiques. Une histoire sur l'art de bien faire les petites choses. Après la lecture, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 5 à 9 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Patience
- **Link:** `https://storytimewitheva.com/fr/free/miras-thousand-cubes-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_miras-thousand-cubes&utm_content=P-151`
- **Image:** `/covers/miras-thousand-cubes-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

### The Fig Tree's Secret (`fig-trees-secret`, ages 4 to 8)

Theme: Heritage and memory. Kit page: `/free/fig-trees-secret-companion`. Pins P-174 (EN), P-152 (ES) and P-153 (FR).

#### P-174 (English)

- [ ] **Approved**
- **Title** (58/100): Free activity kit for "The Fig Tree's Secret", ages 4 to 8
- **Description** (477/500): Sofia wants to cut down the gnarled old fig tree in her grandmother's garden, until Mr. Costas tells her what the tree has watched: three hundred years of harvests, festivals and recipes. Then open the free activity kit: a two-page story worksheet to print, Pixel's Story Quiz with pictures and a voice for children who don't read yet, and story-word flashcards in English, Spanish and French. Ages 4 to 8. Sent by email. #FreePrintables #PictureBooks #ReadAloud #FamilyStories
- **Link:** `https://storytimewitheva.com/free/fig-trees-secret-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_fig-trees-secret&utm_content=P-174`
- **Image:** `/covers/fig-trees-secret-en.webp`. No existing pin PNG for this book and language.
- **Board:** Free Printables for Kids

#### P-152 (Spanish)

- [ ] **Approved**
- **Title** (65/100): Actividades gratis para «El secreto de la higuera», de 4 a 8 años
- **Description** (434/500): Sofía quiere talar la vieja higuera del jardín de su abuela, hasta que el señor Costas le cuenta lo que el árbol ha visto: trescientos años de cosechas, fiestas y recetas. Luego, las actividades gratis: una ficha de dos páginas para imprimir, el quiz de Pixel con dibujos y voz para quienes aún no leen, y tarjetas con las palabras del cuento en tres idiomas. De 4 a 8 años. Por correo. #ImprimiblesGratis #CuentosInfantiles #Herencia
- **Link:** `https://storytimewitheva.com/es/free/fig-trees-secret-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_fig-trees-secret&utm_content=P-152`
- **Image:** `/covers/fig-trees-secret-es.webp`. No existing pin PNG for this book and language.
- **Board:** Recursos Bilingües (Español)

#### P-153 (French)

- [ ] **Approved**
- **Title** (64/100): Kit d'activités gratuit pour « Le secret du figuier », 4 à 8 ans
- **Description** (476/500): Sofia veut abattre le vieux figuier du jardin de sa grand-mère, jusqu'à ce que monsieur Costas lui raconte ce que l'arbre a vu : trois cents ans de récoltes, de fêtes et de recettes. Ensuite, le kit d'activités gratuit : une fiche de lecture de deux pages à imprimer, le quiz de Pixel, images et voix pour les enfants qui ne lisent pas encore, et des cartes des mots de l'histoire en trois langues. Pour les 4 à 8 ans. Par e-mail. #ImprimablesGratuits #AlbumJeunesse #Héritage
- **Link:** `https://storytimewitheva.com/fr/free/fig-trees-secret-companion/?utm_source=pinterest&utm_medium=social&utm_campaign=kit_fig-trees-secret&utm_content=P-153`
- **Image:** `/covers/fig-trees-secret-fr.webp`. No existing pin PNG for this book and language.
- **Board:** Ressources Bilingues (Français)

