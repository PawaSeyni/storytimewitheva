# Artwork and songs for the remaining extras: suggestions, November 2026

**Status:** suggestions for the owner. Nothing here is on the site yet.
**Why:** the activities re-audit (`docs/activities-audit-2026-11.md` §7d) left four items that need the owner's art or words: original songs, colouring pages, story sequencing cards and spot illustrations on the printables.
**Ground rule:** every scene and every lyric below comes from the book's own catalog description. Nothing invents plot. Where a description is too short to suggest scenes, the brief says so and leaves the choice to you.

## Contents

1. [Original songs](#1-original-songs-ready-to-approve) for the cloud, rain and boat books, plus a bonus for *The Rainbow Symphony*. **Ready to approve:** once approved, they can go on the site without any art.
2. [Colouring pages](#2-colouring-pages) for the 7 books that link the Coloring activity.
3. [Story sequencing cards](#3-story-sequencing-cards): suggested scenes for all 20 books.
4. [Spot illustrations](#4-spot-illustrations-on-the-printables) for the 29 Studio printables.
5. [Suggested order](#5-suggested-order-and-what-i-need-from-you).

---

## 1. Original songs (ready to approve)

The Rhyme & Sing-Along game shows each song as six to eight short lines in English, Spanish and French, highlights each word as it is read aloud, and prints a lyrics sheet. Today its four songs are generic ("Twinkle Twinkle", "Rainbow Song", "Animal Friends", "Kindness Song"), and three books link it: *Pawa and the Little Rainbow Cloud*, *A Little Boat's Big Wish* and *The Cloud Collector*.

Each song below has **original words** set to a **public-domain melody**, so any parent or teacher already knows how to sing it. The Spanish and French versions are singable adaptations, not word-for-word translations.

> **Before publishing:** have a native Spanish speaker and a native French speaker sing each version once against the tune. Singability is the test, and they should feel free to swap words.

### Song 1. *Little Gray Cloud* (for *Pawa and the Little Rainbow Cloud*, ages 3-7)

**Tune:** "Twinkle, Twinkle, Little Star". **From the description:** Cirro, a little gray cloud who feels heavy and sad after a storm; his tears; Pawa the Sun; rain meets light.

| English | Español | Français |
|---|---|---|
| Little gray cloud, heavy and slow, | Nube gris, pesada y lenta, | Petit nuage gris et lourd, |
| After the storm you're feeling low. | tras la tormenta, triste y quieta. | l'orage est passé, le cœur est lourd. |
| Every tear that falls like rain | Cada lágrima de lluvia | Chaque larme, goutte de pluie, |
| Meets the sun and shines again. | con el sol se vuelve luz. | rencontre le soleil et luit. |
| Rain and light together play, | Lluvia y luz juegan así, | Pluie et lumière, main dans la main, |
| And a rainbow fills the day. | y el arcoíris sale al fin. | font l'arc-en-ciel du matin. |

### Song 2. *Little Yellow Boat* (for *A Little Boat's Big Wish*, ages 3-7)

**Tune:** "Row, Row, Row Your Boat". **From the description:** a small yellow wooden boat; a sparkling puddle; a frog, a turtle, a goldfish, a duckling; small worlds and wonder.

| English | Español | Français |
|---|---|---|
| Float, float, little boat, | Flota, barquito, flota, | Flotte, petit bateau, |
| Yellow wooden friend, | amarillo y de madera, | tout jaune et en bois, |
| Splashing, splashing, splashing, splashing, | chapoteando, chapoteando, | plic et ploc, plic et ploc, |
| Off to puddle land. | el charco nos espera. | la flaque est là. |
| Frog and turtle too, | Rana y tortuga van, | Grenouille et tortue, |
| Goldfish, duckling, see? | pez dorado y patito, | poisson rouge et caneton, |
| Little waters, little waters, | aguas chiquitas, aguas chiquitas, | petites eaux, petites eaux, |
| Wonder's here for me. | todo es tan bonito. | quel bel horizon. |

### Song 3. *Clouds Up High* (for *The Cloud Collector*, ages 4-8)

**Tune:** "Frère Jacques" (each line is sung twice, as in the original). **From the description:** cumulus that float just out of reach; wispy cirrus painted high; some things are too beautiful to keep; letting beautiful things stay where they are.

| English | Español | Français |
|---|---|---|
| Fluffy cumulus, fluffy cumulus, | Nube cúmulo, nube cúmulo, | Nuage cumulus, nuage cumulus, |
| Out of reach, out of reach, | tan lejos, tan lejos, | hors de portée, hors de portée, |
| Wispy cirrus painted, wispy cirrus painted, | cirros que pintan, cirros que pintan | cirrus qui dessinent, cirrus qui dessinent |
| Way up high, way up high. | el cielo azul, el cielo azul. | le ciel d'été, le ciel d'été. |
| Some things are so lovely, some things are so lovely, | Hay cosas tan bellas, hay cosas tan bellas | Il y a des merveilles, il y a des merveilles, |
| We let them be, we let them be, | para mirar, para mirar, | qu'on laisse là, qu'on laisse là, |
| Let them float on by, let them float on by, | déjalas que floten, déjalas que floten | elles flottent au ciel, elles flottent au ciel, |
| In the sky, in the sky. | en su lugar, en su lugar. | tout là-haut, tout là-haut. |

### Bonus. *Every Color Sings* (for *The Rainbow Symphony*, ages 3-6)

*The Rainbow Symphony* is a book about music, and its own Studio activity is the Harmonia Color Orchestra. It doesn't link the sing-along today; this song would let it.

**Tune:** "The More We Get Together". **From the description:** the village of Harmonia; every colour sings its own song; the colours argue and the music breaks apart; Pawa, a small glowing light who loves them all.

| English | Español | Français |
|---|---|---|
| In Harmonia, each color sings its own song, | En Harmonía, cada color canta su canción, | À Harmonia, chaque couleur a sa chanson, |
| Its own song, its own song, | su canción, su canción, | sa chanson, sa chanson, |
| In Harmonia, each color sings its own song, | En Harmonía, cada color canta su canción, | À Harmonia, chaque couleur a sa chanson, |
| And all of them, too. | y todos también. | et toutes aussi. |
| When colors all sing together, together, together, | Si todos cantan juntos, juntos, juntos, | Quand elles chantent ensemble, ensemble, ensemble, |
| The music is whole, and so are we! | la música vuelve, ¡y es para ti! | la musique revient, et nous aussi ! |

### How the songs go live

- Each song becomes one entry in the `songs` list in `public/games/rhyme-singalong.html`, in the same shape as the existing four: an emoji, title, subtitle with ages, lines in three languages, and a "Sing it to the tune of…" line.
- Each linking book page could open the sing-along on its own song (`?book=<id>`), the way the word games open on a book's words.
- This needs no artwork.
- **Status, 18 November: approved and added.** All four are in the sing-along, and each linking book page opens it on its own song (`?book=<id>`), in the page's language (`?lang=` now sets the lyrics too). *The Rainbow Symphony* now links the sing-along. Still open: a native ES and FR sing-through (tracker SW-018).

---

## 2. Colouring pages

The Coloring activity has 10 generic scenes (sun, heart, rocket…). Seven books link it, so those are the first pages to draw.

**Spec for the illustrator:**
- Black line art only, no grey fills.
- **SVG** preferred, with each fillable area as a separate closed shape, so the on-screen tap-to-fill works. Also export a **US Letter and A4 print PDF**.
- 12 to 30 fillable areas for ages 3-5, up to 45 for 6-7.
- Lines thick enough for little hands (about 4-6 px at 1000 px width).
- **Traced from the book's own illustrations,** so the characters look like themselves.

| Book | Scene (from the description) | A second scene, if you want two |
|---|---|---|
| *The Day the Colors Got Mixed Up* | Hawel at breakfast with a blue banana and purple toast, Pixel the butterfly nearby | The Color Keeper with three pots: red, yellow and blue |
| *The Rainbow Symphony* | The village of Harmonia, each colour with its own musical notes | Pawa, the small glowing light, in the middle of the colours |
| *The Adventures of Maya's Shadow* | Maya asleep in bed while her shadow slips out the door, the moon in the window | The shadow coming home in the morning |
| *The Crooked Little Apple Tree* | The orchard of straight trees, with the crooked little apple tree at the edge | The crooked tree on its own, full of apples |
| *A Little Boat's Big Wish* | The little yellow boat on a sparkling puddle with a frog, a turtle, a goldfish and a duckling | The boat on the shelf above the sink, looking at the moon |
| *The Little Mapmaker* | Maya drawing a map, her dog Pepper beside her in a red bandana | The castle in the tall grass, exactly where she drew it |
| *Pawa and the Little Rainbow Cloud* | Cirro the little gray cloud raining, Pawa the Sun shining through | The rainbow where rain meets light |

**Cheapest path:** if the interior spreads exist as layered files, an illustrator can make line art from them in an afternoon per page.

---

## 3. Story sequencing cards

Children drag 4-6 scenes into story order, then print them as cards. Each card is one image plus a short caption. The scenes below follow each description in order. Thumbnails of the book's own spreads are enough; cards don't need new art.

| Book | Suggested scenes, in order |
|---|---|
| *The Day the Colors Got Mixed Up* | Hawel wakes; the banana is blue and the toast is purple · Hawel sets off with Pixel · they find the Color Keeper · red, yellow and blue make the other colours |
| *The Rainbow Symphony* | Each colour sings in Harmonia · the colours argue · the music breaks apart · Pawa reminds them how the symphony works |
| *The Tower That Touched the Sky* | Victor designs the tallest tower · the junior engineer raises her hand · he doesn't see it · the dust settles · Victor designs with questions |
| *The Adventures of Maya's Shadow* | Maya goes to bed · she falls asleep · her shadow slips out the door · the shadow's adventure · the shadow comes home in the morning |
| *The Sparrow Who Saved the Forest* | The forest is in trouble · the big animals don't notice · the smallest sparrow does · *(the description doesn't say what the sparrow does: choose 1-2 scenes from the book)* |
| *Diego's Brave Leap* | Diego on the cliff above the sea · everyone is watching · the water far below · *(the leap and after: choose from the book)* |
| *The Butterfly Effect* | One small kind thing · it turns into another, and another · a whole community changed · *(choose the specific acts from the book)* |
| *The Emperor's True Treasure* | The emperor in his palace full of gold · he feels empty · the villagers with almost nothing · where richness really lives |
| *The Crooked Little Apple Tree* | The orchard of straight trees · the crooked tree at the edge, overlooked · the years go by · someone really looks |
| *The True Beauty of Meadowbrook* | The town where everyone competes to look beautiful · the quiet girl · she finds a different way to shine · *(choose from the book)* |
| *The Sanding Block* | The boy wants to be a great woodworker right now · his grandfather hands him a sanding block · the workshop with shavings on the floor · *(the slow craft: choose from the book)* |
| *Leo and the Wolf* | Leo's first job as a shepherd · "WOLF!" and the villagers come running · he does it again · they stop coming · yellow eyes at the edge of the forest |
| *Russet the Fox Learns a Lesson* | Russet is sure he's the cleverest · his mother warns him about the dogs and the fence · he barely listens · the night the wire wraps around his leg |
| *A Little Boat's Big Wish* | The boat on the shelf, dreaming of the ocean · the boy carries it to a puddle · the frog · the turtle · the goldfish · the duckling |
| *Heidi's Journey to Mastery* | Heidi dreams of inventions · she arrives at Grandpa Anders's workshop · he hands her a broom · she sweeps · she sorts parts · she watches and asks |
| *The Cloud Collector* | Grandpa Chen gives Luna a net and a jar · Luna in the meadow · the cumulus out of reach · the cirrus high above · letting the clouds stay |
| *The Little Mapmaker* | Maya draws maps of her room, the kitchen and the yard · Pepper beside her · she draws a castle · it's there in the tall grass · a river in a crack in the sidewalk |
| *Pawa and the Little Rainbow Cloud* | Cirro after the storm, heavy and sad · he thinks his tears only make a mess · Pawa the Sun · rain meets light · the rainbow |
| *Mira's Thousand Cubes* | Mira dreams of carving eagles and dancers · Master Hiroshi takes her on · the first task: a thousand cubes · aching hands · the lesson in doing the small thing well |
| *The Fig Tree's Secret* | Sofia inherits her grandmother's cottage · she plans to cut down the fig tree · Mr. Costas comes running · he tells what the tree has seen · harvests, festivals and recipes |

Five books (Sparrow, Diego, Butterfly, Meadowbrook, Sanding Block) need you to pick one or two scenes from the book itself, because their descriptions stop before the turning point. That's on purpose: the catalog doesn't give away endings.

---

## 4. Spot illustrations on the printables

All 29 Studio printables are text and emoji today. One small illustration per card makes the print feel like it belongs to the book, and it's what parents photograph and share.

**Spec:**
- One spot per book, reused on all of that book's printables (most books have one or two).
- **600 × 600 px PNG with a transparent background, about 30 KB.**
- Simple enough to print in black and white.
- **Cheapest path: a crop of the cover character** (Hawel and Pixel, Maya's shadow, Cirro, Leo with a sheep, Russet, the little yellow boat, Luna with her net, Mira with a cube, the fig tree…). Twenty crops cover all 29 printables.

**Where they go:** the top of each `Printable` card in `src/demos/*Demo.tsx`. I can wire them up as soon as the files exist (for example `public/spots/<book-id>.png`).

**Status, 18 November: first pass live.** 19 crops from the cover files (`public/spots/<book-id>.webp`, 300 × 300, about 19 KB each), shown at the top right of every Studio printable for its book, on screen and in print. *A Little Boat's Big Wish* has no cover file on the site yet, so its printables have no spot. These are crops, not transparent cut-outs: replace any file with the final art under the same name and nothing else changes. Owner review: tracker SW-019.

---

## 5. Suggested order, and what I need from you

| Step | What | From you | From me |
|---|---|---|---|
| 1 | **Songs** | "Approved", plus any edits; ideally a native ES and FR sing-through | Add the songs to the sing-along, with book mode on each linking book page |
| 2 | **Spot illustrations** | 20 cover crops (or let me crop the cover files already in `public/covers/` as a first pass) | Wire them into all 29 printables |
| 3 | **Colouring pages** | 7 line-art SVGs, one per book (traced from the books) | Add them to the Coloring activity, with book mode |
| 4 | **Sequencing cards** | 4-6 spread thumbnails per book, and your scene picks for the five books marked above | Build the drag-to-order activity and the printable cards |

**Done:** steps 1 and 2 (first pass), 18 November. **Next:** colouring pages (step 3) and sequencing cards (step 4), which need your art.
