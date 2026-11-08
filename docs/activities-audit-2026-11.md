# Book-Linked Activities Audit — November 2026

**Scope:** every activity that a book on storytimewitheva.com links to through `relatedActivityIds`, checked against the live site (book pages render the "Try an activity" block; spot-checked `/books/cloud-collector/` and `/books/leo-and-the-wolf/`) and the source (`src/data/books.data.ts`, `src/data/activities.data.ts`, `src/demos/*`, `public/games/*`).

**Catalog at audit time:** 20 books · 29 activities (13 standalone HTML games, 16 in-app React pages) · 70 book→activity links.

---

## 1. Summary

- **Only 11 of the 20 books have an activity built for that book.** All 11 come from the September Activity Studio batch (8 activities). The other 9 books link only to generic activities, chosen because the theme roughly matches.
- **The Story Map game, linked from two books, shows ten titles that aren't in the catalog** (e.g. *Chief Mael's Final Gift*, *The Clever Pots*, *The Snow Fox*). Its "Read This Book" buttons go to `/books` or to Amazon pages outside the Eva Gallo Collection. *The Little Mapmaker* and *The Cloud Collector* send readers there.
- **The "Read next" link at the end of an activity ignores the book the child came from.** It always points to the first book in catalog order that uses the activity. A child who opens the Adventure Journal from *Russet the Fox* is sent to *The Tower That Touched the Sky*. The Emotion Wheel always sends readers to *Diego's Brave Leap*, even when they came from one of the other four books that link it.
- **A few generic activities do most of the work.** Adventure Journal is linked from 8 books, and Bingo, Coloring and Bookmark Designer from 6 each. None of the four uses anything from the stories.
- **5 activities have no book link at all:** Word Explorer, Matching, Spelling Bee, Counting & Numbers and Sentence Builder. They're the easiest to tie to books, because each one runs on a word list.
- **There's no data on how activities perform.** The September baseline has 0 "Continue Journey → activity" events and 0 "Activity Complete" events, so engagement can't be judged yet. Measurement has to be fixed alongside the content.

**Recommendation:** first fix the three trust problems: Story Map, Finish-the-Story, and the "Read next" link. Then build one activity for each of the 9 uncovered books, reusing the Studio template. In parallel, add a per-book word list (`bookVocab`) to the data, which turns the 5 orphaned word games into activities for every book.

---

## 2. Book-by-book scorecard

**Book-specific** means the activity uses the book's characters, setting or central idea. **Theme match** means a generic activity whose category matches the book's theme.

| Book | Ages | Linked activities | Book-specific | Grade | Main problem |
|---|---|---|:-:|:-:|---|
| The Day the Colors Got Mixed Up | 4-7 | Color Mix Lab, Bookmark, Build-a-Scene, Coloring | 1 | **A-** | Coloring has no Hawel/Pixel scene |
| The Adventures of Maya's Shadow | 3-7 | Shadow Theatre, Coloring, Bookmark, Build-a-Scene | 1 | **A-** | Flagship book: deserves a 2nd activity |
| Pawa and the Little Rainbow Cloud | 3-7 | Feelings Weather Report, Coloring, Emotion Wheel, Rhyme | 1 | **A-** | No Cirro song in Rhyme & Sing-Along |
| Diego's Brave Leap | 4-8 | Brave Plan, Character Workshop, Emotion Wheel, Finish-the-Story | 1 | **B+** | Character Workshop/Finish-the-Story are 6-9 and generic |
| The Cloud Collector | 4-8 | Cloud Detective, Rhyme, Story Map, World Geography | 1 | **B** | Story Map shows off-catalog books |
| The Fig Tree's Secret | 4-8 | Story Quilt, Journal, Flashcards, Bingo | 1 | **B+** | — |
| The Sparrow Who Saved the Forest | 4-8 | Kindness Ripple, Journal, Bingo, Character Workshop | 1 | **B** | 3 of 4 rated 6-9 for a 4-8 book |
| The Butterfly Effect | 5-9 | Kindness Ripple, Journal, Bingo, Emotion Wheel | 1 | **B** | Shares its only specific activity with Sparrow |
| The Sanding Block | 5-9 | Maker Passport, Bookmark, Craft Corner, Puzzles | 1 | **B** | Passport shared by 3 books |
| Heidi's Journey to Mastery | 5-9 | Maker Passport, Bookmark, Craft Corner, Build-a-Scene | 1 | **B** | Same set as Mira; nothing about inventions |
| Mira's Thousand Cubes | 5-9 | Maker Passport, Bookmark, Craft Corner, Build-a-Scene | 1 | **B** | Same set as Heidi |
| Leo and the Wolf | 4-8 | Character Workshop, Finish-the-Story, Story Dice | 0 | **C** | The free Leo PDF (the full storybook) isn't offered on the book page; see the correction in §4C |
| The Rainbow Symphony | 3-6 | Flashcards, Build-a-Scene, Coloring | 0 | **C** | A book about music, with no music activity |
| The Little Mapmaker | 4-8 | Coloring, Story Map, World Geography | 0 | **C-** | Story Map isn't about this book |
| A Little Boat's Big Wish | 3-7 | Coloring, Reading Tracker, Rhyme | 0 | **C-** | Reading Tracker is 5-9; rhymes are generic nursery songs |
| The Crooked Little Apple Tree | 4-8 | Emotion Wheel, Journal, Flashcards | 0 | **C-** | Coloring has an "Apple Tree" scene, but this book doesn't link to it |
| The True Beauty of Meadowbrook | 4-8 | Emotion Wheel, Journal, Flashcards | 0 | **C-** | Identical set to Apple Tree |
| The Tower That Touched the Sky | 5-9 | Journal, Bingo, Reading Tracker | 0 | **D** | Three reading-log tools; nothing about building or listening |
| The Emperor's True Treasure | 5-9 | Journal, Bingo, Reading Tracker | 0 | **D** | Identical set to Tower |
| Russet the Fox Learns a Lesson | 4-8 | Journal, Bingo, Bookmark | 0 | **D** | Nothing about listening or foxes |

Every book has 3 sign-off-ready discussion prompts (before, during and after reading), and that part is strong. The weak spot is what comes after the reading.

---

## 3. Evaluation of each existing activity

### 3a. Activity Studio (8): the model to copy

Color Mix Lab · Feelings Weather Report · First-Day Brave Plan · Cloud Detective Journal · Shadow Theatre · Kindness Ripple · Story Quilt · Patient Maker Passport

**What works:** `StudioFrame` gives every page the same structure: a "Pairs with [book]" link, an ages and minutes badge, a role for the grown-up, a printable card, and a note that nothing leaves the device. The text quotes the book (*"Diego had his family watching from the beach. Who is on your beach?"*). Each one takes 10–15 minutes, needs no account, and is available in all three languages.

**How to make them better:**
1. **Add a small illustration from the book to each printable card.** Right now the cards are text and emoji only. One spot illustration makes the print feel like it belongs to the book, and it's what parents will photograph and share.
2. **Turn on email capture for "print and send to me".** Offer to email the PDF as well as printing it. That turns the Studio's best moment into a signup without adding friction.
3. **Give Maker Passport a version for each book:** a sanding block for *The Sanding Block*, a cube counter for *Mira*, an invention blueprint for *Heidi*. Today the three books share one generic passport.
4. **Give Kindness Ripple separate copy for each book.** Use *Sparrow* for "small is mighty" and *Butterfly Effect* for "kindness travels".

### 3b. Generic activities that books lean on

| Activity | Linked from | Verdict | How to tie it to the books |
|---|:-:|---|---|
| **Adventure Reading Journal** (6-9) | 8 books | A useful tool, but not about any book. Rated 6-9, while most of the linked books are 4-8. | Accept `?book=<id>`, pre-fill the title and cover, and seed "favourite character" from that book's cast. Add a 4-6 "draw it" mode. |
| **Reading Bingo** (6-9) | 6 books | General challenges ("A Challenge", "Victory") | Add an **Eva Gallo Collection Bingo** card where each square is a book or a story moment ("Read a story set by the sea"). Each square links to the book, so the card drives catalog visits. |
| **Coloring Adventure** (3-7) | 6 books | 10 generic scenes (sun, heart, rocket, castle) | Add line art made from the books: Hawel and Pixel, Maya's shadow, Cirro, the crooked apple tree, the little yellow boat. This is the highest-value art job on the list (see §5). |
| **Bookmark Designer** (5-9) | 6 books | "Themes from the books" is generic. | Add a quote and a motif for each book, using the book's quote from the discussion prompts. |
| **Build-a-Scene** (4-8) | 5 books | Generic characters and props | Add sticker packs for each book: Maya plus shadow plus moon; Heidi's workshop; Mira's cubes and chisel. |
| **Emotion Wheel** (3-7) | 5 books | Good, but "Read next" always goes to Diego | Fix the "Read next" link; show "How did [character] feel?" when it's opened from a book. |
| **Character Workshop** (6-9) | 3 books | Generic builder | Start from a real character ("Make a friend for Leo"). The age rating doesn't fit *Sparrow* or *Diego* (4-8). |
| **Finish-the-Story** (6-9) | 2 books | **Off-brand.** Its "The Day the Colors Got Mixed Up" prompt stars *Eva*, not Hawel and Pixel, and invents a different plot. The other 3 prompts aren't catalog books. | Rewrite all prompts around catalog books: Diego at the cliff edge, Leo after the second false alarm, Russet at the fence, Sofia deciding about the fig tree. |
| **Story Map** (5-9) | 2 books | **Broken for this site.** Shows 10 titles that aren't in the catalog; buttons go to `/books` or to outside Amazon pages. | Rebuild using the 20 catalog books and their real settings (the Mediterranean cliff, Granholm, the mountain stone village, Harmonia, the orchard), each linking to `/books/<id>`. If the other titles are PaWa Press books you want to promote, move them to a separate, clearly labelled area. |
| **Rhyme & Sing-Along** (3-7) | 3 books | Public-domain nursery rhymes ("Twinkle Twinkle"), plus generic Rainbow, Animal and Kindness songs | Add original short songs for *A Little Boat's Big Wish*, *Pawa and the Little Rainbow Cloud*, *The Cloud Collector* and *The Rainbow Symphony*. |
| **World Geography** (6-9) | 2 books | Generic country quiz | Pin the real-world inspiration for each story's setting. |
| **Reading Tracker** (5-9) | 3 books | Generic streak log. The placeholder name "Sofia" is a nice touch. | Fine as a utility, but it shouldn't count as a book's activity. Replace it on Tower, Emperor and Boat. |
| **Puzzle Paradise** (7-9) | 1 book | Generic. Its "Wolf & Grandma" is Red Riding Hood, not Leo. | Make word scrambles and riddles from each book's vocabulary. |
| **Story Dice Creator** (6-9) | 1 book | Generic | Add a Collection dice set made from catalog characters and settings. |

### 3c. Orphaned activities with no book link (5)

Word Explorer, Matching (3-5), Spelling Bee, Counting & Numbers (3-6) and Sentence Builder each run on a fixed word or item list. A per-book vocabulary field (§4, item B) connects all five to all 20 books without new game code.

---

## 4. Platform improvements (one build each, benefits every activity)

**A. Pass the book to the activity: `?book=<id>` (P0, small).**
- `RelatedActivities` adds the id of the book page the child came from.
- `DemoPage` and `ContinueJourney` use it in place of "first referencing book in catalog order", which fixes the "Read next" problem.
- Studio and game pages can then show that book's characters or words, plus a "← Back to [book]" link.
- Add `book` as a property on the `Activity Start` and `Activity Complete` events, so the Book → Activity → Completion funnel can be measured book by book.

**B. A per-book word list: `bookVocab` (P1, medium).**
- Add 8–10 story words per book, in EN/ES/FR, to `books.data.ts`, with the same CI parity check the discussion prompts use.
- That one data set feeds Flashcards, Spelling Bee, Matching, Word Explorer, Sentence Builder and Puzzle Paradise when they're opened with `?book=`.
- Result: about 6 activities × 20 books, with no new game logic.

**C. A "Story Companion" PDF for each book (P1, medium).**
- *Leo and the Wolf* already has a free trilingual PDF, which can only be reached at `/free/leo-and-the-wolf`. **Correction (remediation pass):** that PDF is the complete 32-page storybook, not a one-page worksheet. Linking it from the book page, next to the Buy button, could take away sales, so it's an owner decision and was not done.
- Generate a one-page companion for each book from data already in the repo: the 3 discussion prompts, the vocabulary, one printable activity and the cover.
- Link each one through `relatedResourceIds`, a field that exists but is empty for every book.
- Each companion is also a lead magnet for its book (`/free/<book-id>`), which gives 20 entry points for email signup in place of 1.

**D. Fix the age fit (P2, small).**
- Adventure Journal, Bingo, Character Workshop, Finish-the-Story and Story Dice are rated 6-9 but linked from 4-8 books.
- Either add a "younger reader" mode (draw instead of write, read the prompts aloud) or swap the links.
- Also finish backlog item E6: the Activities hub still uses the old age filter.

**E. Layout (P2, trivial).** The "Try an activity" grid has 3 columns, but 11 books link 4 activities, which leaves one card alone on its own row. Use `lg:grid-cols-4` or cap the block at 3.

---

## 5. New activities to build

### 5a. One book-specific activity for each of the 9 uncovered books (Studio template)

| # | Book | Proposed activity | What the child does | Skill | Printable |
|---|---|---|---|---|---|
| 1 | Leo and the Wolf | **The Trust Meter** | Branching story. Each "WOLF!" choice lowers the villagers' trust meter, and honest choices rebuild it. Ends with "Why did no one come?" | Honesty, cause and effect | "My honesty promise" card. Also link the existing Leo PDF. |
| 2 | The Rainbow Symphony | **Harmonia Color Orchestra** | Each color plays its own note. Remove a color and the melody breaks; put all of them back and it plays. Then compose an 8-beat song. | Music, belonging | A color-note score to play at home with cups and water |
| 3 | The Tower That Touched the Sky | **Ask-First Architect** | Build a tower from blocks on screen. Before each floor, the junior engineer asks a question. Skip it and the tower wobbles; listen and it holds. | Listening, early engineering | "Ask 3 questions before you build" card for real blocks |
| 4 | The Emperor's True Treasure | **My True Treasure Chest** | Sort items into "gold can buy" and "makes me rich" (a crown, a shared meal, a friend's song, a jewel). Fill your own chest. | Gratitude, values | A treasure map of the people and moments that make the child rich |
| 5 | The Crooked Little Apple Tree | **My One-of-a-Kind Tree** | Grow a tree with its own shape. Each branch gets a "special because…" leaf. | Self-worth | A tree page. In class, the trees join into one "orchard wall". |
| 6 | The True Beauty of Meadowbrook | **The Kindness Mirror** | A mirror that "reflects" kind acts and strengths, not looks. Pick three ways you shine, then write a compliment card about something other than appearance for someone else. | Self-worth, kindness | Mirror card plus 4 compliment cards to give away |
| 7 | Russet the Fox Learns a Lesson | **Listen Like a Fox** | Audio game: Mother Fox gives instructions that get harder ("Go left at the log, but stop at the fence"). Rushing gets Russet caught; careful listening gets him home. | Listening, working memory | "Before I rush" checklist for the family |
| 8 | A Little Boat's Big Wish | **Puddle Voyage** | Put the frog, turtle, goldfish and duckling in story order, then a float-or-sink experiment with household objects. | Sequencing, early science | Fold-a-paper-boat sheet plus a float/sink record sheet |
| 9 | The Little Mapmaker | **Map My World** | Draw a map of your room or yard on a grid with a legend, then hide a "castle" for a grown-up to find. Replaces this book's Story Map link. | Spatial thinking | A blank map grid with a legend and compass rose |

These reuse the existing `StudioFrame` (hero, "Pairs with", printable card, print button, all three languages). Estimate about 1 day each for copy and code, plus spot art. Items 2, 3 and 7 need simple interaction (audio and drag); the rest are form-and-print, like the current Studio pages.

### 5b. A second activity for the five strongest books

| Book | Proposed activity |
|---|---|
| The Adventures of Maya's Shadow (flagship) | **Where Did My Shadow Go?** Move a lamp and watch the shadow change (sun and shadow science), then draw your shadow's night adventure. |
| Diego's Brave Leap | **Brave Breathing with Diego.** A 60-second animated breathing exercise ("watch the waves"). Useful before school, and it connects to the back-to-school angle. |
| Heidi's Journey to Mastery | **Inventor's Blueprint.** Design an invention, then list the "first cubes": the basic skills you'd need to build it. |
| Mira's Thousand Cubes | **The Thousand Cubes Challenge.** A 30-day practice tracker in which every day fills one cube. |
| The Fig Tree's Secret | **What the Tree Has Seen.** A timeline of a family or neighbourhood tree, with three generations of memories. |

### 5c. Activities that work across the whole collection

1. **Eva Gallo Reading Passport.** One stamp for each of the 20 books, with a discussion prompt unlocked at each stamp. At 5 and 10 stamps the child gets a printable certificate. Unread books show a cover and an "Ask a grown-up to find this one" link (Amazon). This is the clearest way to turn activities into catalog purchases. Store progress on the device, using the existing `personalLibrary` and `progress` libraries.
2. **Story Sequencing Cards for every book.** Drag 4–6 key scenes into order and print them as cards. Build the template once and supply the scenes for each book (needs 4–6 images per book; spread thumbnails are enough).
3. **Collection Bingo** (from §3b) and **Collection Story Dice:** character, setting and problem drawn from the 20 books.
4. **Read-Aloud Pixel Quiz.** After the read-aloud, Pixel the butterfly asks the book's 3 "after" prompts as a spoken, picture-choice quiz for pre-readers (3-5). It uses the existing `ReadAloudButton` and speech libraries and the existing prompts, so no new content is needed.
5. **Classroom Book Unit pack.** For each of 4–5 themes (kindness, patience, courage, feelings, curiosity), a teacher pack: 2–3 books, their Studio printables, vocabulary and a 5-day plan. This extends the existing `learningPacks` model, which today has only 2 generic packs.

---

## 6. Prioritized roadmap

| Priority | Item | Effort | Why now |
|---|---|---|---|
| **P0** | Rebuild Story Map with the 20 catalog books, or unlink it from Cloud Collector and Little Mapmaker | S–M | It shows parents books that aren't in this catalog |
| **P0** | Rewrite Finish-the-Story prompts around catalog books (Hawel and Pixel, not Eva) | S | Off-brand copy on a book-linked page |
| **P0** | Pass `?book=` so "Read next" returns to the right book; add `book` to activity events | S | Fixes the journey and makes the funnel measurable |
| **P1** | ~~Link the Leo PDF from the Leo book page~~ Owner decision: the PDF stays as it is for its own purpose; a complete Leo worksheet was built instead (see the remediation log) | — | Done |
| **P1** | 9 new Studio activities (§5a), in this order: Leo, Russet, Tower, Emperor, Little Mapmaker, Boat, Apple Tree, Meadowbrook, Rainbow Symphony | ~9–12 days | Takes book-specific coverage from 11/20 to 20/20 |
| **P1** | `bookVocab` data, plus `?book=` support in the 5 orphaned games and Puzzles | M | About 6 × 20 book-specific activities from one data set |
| **P1** | Book-specific coloring line art (start with the 6 books that link Coloring) | M (art) | Coloring is the most-linked activity for ages 3-7 |
| **P2** | Story Companion PDF and `/free/<book-id>` magnet for each book | M | 20 signup entry points in place of 1 |
| **P2** | Reading Passport | M | Turns activities into catalog purchases |
| **P2** | Age-fit fixes, 4-column grid, Activities-hub age filter (E6) | S | Polish |
| **P3** | ~~Second activities (§5b)~~ (pass 9), ~~Pixel Quiz~~ (pass 10), Sequencing Cards, themed Classroom Units | L | Expansion once the P0–P1 work is in and measured |

**How to measure success.** After the P0 tracking fix, report every month:
- book page → activity click-through, by book
- activity completion (print or "done"), by activity and by the book the child came from
- activity → "Read next" → book view (the loop)
- signups from activity pages

Target: every book with at least 1 book-specific activity by the end of the P1 work, and a measurable funnel (≥ minimum sample) within 30 days of the tracking fix.

---

## Appendix: how the activity links are distributed today

| Activity | Type | Ages | # books | Book-specific? |
|---|---|---|:-:|:-:|
| adventure-journal | in-app page | 6-9 | 8 | no |
| coloring | in-app page | 3-7 | 6 | no |
| bookmark-designer | in-app page | 5-9 | 6 | no |
| bingo | in-app page | 6-9 | 6 | no |
| emotion-wheel | game | 3-7 | 5 | no |
| build-a-scene | game | 4-8 | 5 | no |
| bilingual-flashcards | game | 4-8 | 4 | no |
| patient-maker-passport | Studio | 5-9 | 3 | yes |
| character-workshop | in-app page | 6-9 | 3 | no |
| craft-corner | in-app page | 6-9 | 3 | no |
| rhyme-singalong | game | 3-7 | 3 | no |
| reading-tracker | game | 5-9 | 3 | no |
| kindness-ripple | Studio | 4-9 | 2 | yes |
| world-geography | game | 6-9 | 2 | no |
| finish-the-story | game | 6-9 | 2 | no (off-brand) |
| story-map | game | 5-9 | 2 | no (off-catalog) |
| color-mix-lab, feelings-weather-report, first-day-brave-plan, cloud-detective-journal, shadow-theatre, story-quilt | Studio | — | 1 each | yes |
| story-builder, puzzles | in-app page | — | 1 each | no |
| word-explorer, matching, spelling-bee, counting-numbers, sentence-builder | mixed | — | **0** | — |

---

## Remediation log

### Pass 1: November 2026 (branch `claude/brave-dijkstra-24t6xc`)

**P0, done**
- **Story Map rebuilt.** It's now an illustrated "Storyland" map with the 20 catalog books only. The 10 off-catalog titles and the outside Amazon links are gone. Titles, summaries, themes and the "explorer question" (each book's "before reading" prompt) are copied from the catalog by `scripts/patch-games.mjs`; the game only stores where each pin goes. Regions replace continents, because several settings are invented (Harmonia, Meadowbrook, Granholm) and pinning them to real countries would mean making up facts. Also fixed: the pin animation dropped each pin's anchor offset, so pins settled about one pin-height away from their place.
- **Finish-the-Story rewritten.** Six stories in all three languages, each starting from a catalog book with its own characters: Diego, Leo, Russet, Hawel and Pixel, Sofia, and Luna. Eva is only the host who starts the story. A `?book=` visit lists that book's story first. Speech follows the game language, and choices containing quotes no longer break.
- **"Read next" now follows the book the child came from.** Book pages add `?book=<id>` to their activity links, and the id is checked against that book's own activity list. Activity pages and games then show "Back to <book>" and continue to that book's first related book. `Activity Complete` and the book → activity click now carry `book`.
- The "Try an activity" grid uses four columns when a book links four activities.

**P1, done**
- **9 new Studio activities**, one for each book that had none: Trust Meter (Leo), Harmonia Color Orchestra (Rainbow Symphony), Ask-First Architect (Tower), My True Treasure Chest (Emperor), My One-of-a-Kind Tree (Crooked Apple Tree), The Kindness Mirror (Meadowbrook), Listen Like a Fox (Russet), Puddle Voyage (Little Boat), Map My World (Little Mapmaker). Each one is listed first on its book page, so **20/20 books now lead with an activity made for them**. A test enforces this.
- Links swapped out at the same time: Reading Tracker on Tower, Emperor and Little Boat; Adventure Journal (rated 6-9) on Crooked Apple Tree; Bingo on Russet. *Russet* also gains Finish-the-Story, now that it has a Russet story. *Crooked Apple Tree* gains Coloring, which already has an apple-tree scene.

**Tests:** `tests/funnel/activities-audit.test.mjs`; `tests/funnel/activity-studio.test.mjs` and `tests/e2e/studio.spec.ts` extended to wave 2.

**Still open:** book mode for Word Explorer and Sentence Builder; coloring line art from the books; a companion printable for each book; the Reading Passport; age-fit modes for Journal, Bingo and Character Workshop; the Activities-hub age filter (E6); the second activities in §5b.

### Pass 2: owner decisions

- **The Color Keeper is female in every language.** Fixed the Spanish book description and SEO line ("la Guardiana de los Colores"), the French SEO line ("leur gardienne"), and the Spanish and French titles and card text of the Color Mix Lab.
- **Tower's junior engineer is a woman everywhere.** The discussion prompt now reads "her" / "una joven ingeniera" / "une jeune ingénieure" (also in the sign-off docs). The English description and the SEO lines in all three languages say so, as do the Ask-First Architect page and its card on the activities list.
- **Leo: a complete worksheet, and the PDF stays as it is.** New page `/activities/leo-and-the-wolf-worksheet`, listed second on the Leo book page after Trust Meter. It prints on two pages in every language: before reading, story words (matching), story order, true or not true, feelings, honest or tricky, think and write, draw it, and an honesty promise. Name and date are optional, and there's an optional answer key that prints on its own page. Every fact comes from the book description, and the ending is not given away. The free storybook PDF (`/free/leo-and-the-wolf`) serves a different purpose and is unchanged.
- Studio pages now leave the "Mark completed" and "Read next" buttons off the printout. A worksheet can also leave the Studio banner off paper (`printHero={false}`).

### Pass 3: story words for every book (`bookVocab`)

- **New data: `src/data/bookVocab.data.ts`.** Eight words per book in EN, ES and FR (160 in all), taken from each book's description. Each word has a single emoji and is one spellable word of 3 to 9 letters in every language. Tests enforce this (`tests/funnel/book-vocab.test.mjs`).
- **Three word games now have a book mode:** Flashcards, Memory Match and Spelling Bee. Opened with `?book=<id>`, they add a "📖 <book>" set and select it.
  - Spelling Bee spells each word in the game's language, accents included, and gives the other two languages as the hint.
  - The words are baked into each game by `scripts/patch-games.mjs`, so they can't drift from the data.
  - "Back to <book>" works from any of the 20 books.
  - An unknown id falls back to the normal game.
- **A "Story words" strip on every book page** shows the eight words in the reader's language and links to the three games in book mode.
- **Result:** three of the five word games that no book linked are now word games for every book. Word Explorer and Sentence Builder are still to do: Sentence Builder needs whole sentences per book, not single words.
- **Compromises in the word lists:**
  - Some emoji are approximate (💧 for puddle, 🥅 for net, 🧊 for cube).
  - A few natural words were left out because they were too long or hyphenated (cliff, rainbow / arc-en-ciel, grand-père, grenouille).
  - French uses "papi/mamie" for grandpa/grandma.

### Pass 4: a worksheet for every book, Word Explorer book mode, "Made for" on the hub

- **Story worksheet for every book** (`/activities/story-worksheet?book=<id>`). It's built entirely from catalog data, so it can't disagree with the book:
  - the book's own before, during and after discussion prompts;
  - 5 story words to match with pictures and 3 to write in another language (EN→ES, ES/FR→EN);
  - a drawing box, a favourite character and a star rating;
  - an optional answer key on its own page.

  All 20 books × 3 languages were printed: each comes out at exactly 2 pages. It's reached from a new **"Printable worksheet"** button in every book's Story words strip; Leo's button goes to its hand-written worksheet. Without a book, the page shows a book picker.
- **Word Explorer has a book mode.** Opened with `?book=<id>`, it adds a "📖 <book>" category of that book's 8 words, selected first, for both flashcards and the quiz.
- **`anyBook` activities.** Activities offered on every book page (the word games and the story worksheet) accept any valid book as the source book. `journey.ts` and the game patcher share this rule, and the baked game data came out identical.
- **The Activities hub shows "📖 Made for: <book>"** on the 18 book-specific activities (new `bookSpecific` flag). The 20/20 coverage test now reads the same flag.
- **Backlog E6 (the Activities age filter) was already done**: the hub uses the same exact-age model as /books.
- Shared worksheet building blocks now live in `src/demos/studio/Worksheet.tsx` and `worksheetText.ts`, used by both worksheets.
- **Still open:** Sentence Builder book mode (needs sentences per book), coloring art from the books, and second activities for the strongest books.

### Pass 5: the Eva Gallo Reading Passport

- **New page `/activities/reading-passport`.** One stamp per book in the collection, 20 in all.
  - **A stamp is the book's existing "Read" status** in the reading list kept on the device. Marking a book "Read" on its page stamps the passport, and stamping in the passport marks the book read: one source, nothing new stored. A test enforces that the passport adds no storage of its own.
  - **Badges:** bronze at 5 books, silver at 10, gold at every book. There's a progress bar and a "N more to the next badge" line.
  - **A reward for each stamp:** the stamp reveals that book's "after reading" question, to talk about together.
  - **"Up next for your passport"** suggests a book related to the most recent stamp (the same editorial "You might also like" ranking as the book pages), or the first unread book. Unstamped books link to their book page, where the Buy button is.
  - **A printable reading certificate** with the reader's name, the number of books, the highest badge earned and the list of stamped books.
- **Linked from:** the book page's "Read" button ("🛂 Stamped in your Reading Passport →" once a book is marked read), the Profile's books-read stat, and the Activities hub.
- Tested in a browser: stamping 5 books earns bronze and changes "Up next"; marking a book read on a Spanish book page shows as stamped in the passport, and unstamping works.

### Pass 6: little reader modes (ages 4-5)

- **A shared "🧸 Little reader mode" switch** (`LittleReaderToggle`). It's off by default; when on, the activity uses pictures and taps instead of writing, has fewer steps, uses big tap targets, and reads every prompt aloud.
  - **Reading Journal:** four picture questions, one at a time: which book (tap a cover), favourite character, how the story felt, and stars. It prints a "draw it" page. Entries use the same saved format, plus optional fields, so old entries, the .txt download and the Profile page still work.
  - **Reading Bingo:** a 3×3 picture board. Each square has a separate read-aloud button, gets a star stamp when done, and three in a row wins. Its state is kept separately from the 5×5 board.
  - **Character Workshop:** four picture-only steps (who, look, personality, power) and an optional tap-a-name. The result card shows a one-sentence description, grammatical in ES and FR, which can be read aloud.
- **The three activities are re-rated from 6-9 to 4-9.** The Activities hub and the book-page activity cards show "🧸 Little reader mode". This resolves the age-fit issue in §4D for these three.
- **Accessibility fixes to the shared read-aloud button:** an optional `label`, so each button says what it reads (it always said "Listen to this book"), and a 44px minimum tap height in the compact style.
- **A test** checks that every activity flagged `littleReader` really renders the toggle and read-aloud, and is rated from age 4.
- **Still open:** coloring art from the books.

### Pass 7: age fit closed

- **Finish-the-Story has a little reader mode**, the same 🧸 switch as the React activities, inside the standalone game:
  - the name is optional;
  - every choice has a big picture and its own read-aloud button, and the "write your own" box is hidden;
  - the ending can be drawn instead of written: the printed certificate gets a "My ending" drawing box;
  - a `?little=1` link starts it in that mode.
  - Two bugs fixed for both modes: tapping a choice twice added it twice, and the step dots didn't move to the ending.
  - Re-rated from 6-9 to 4-9. Diego, Leo and Russet (4-8) keep linking it.
- **Generic activities aimed at older children were unlinked** where each book already had a better-fitting activity:
  - World Geography (6-9) from Cloud Collector and Little Mapmaker;
  - Bookmark Designer (5-9) from Maya's Shadow (3-7);
  - Puzzle Paradise (7-9) from The Sanding Block.
- The STEM classroom collection now features Map My World instead of World Geography, and its description was updated in all three languages.
- **A new test enforces the age rule** from §4D: no book may link an activity whose minimum age is two or more years above the book's, unless the activity has a little reader mode.
- Story Dice is no longer linked from any 4-8 book (Leo's worksheet replaced it in pass 2), so it needed nothing.
- **Still open:** coloring art from the books.

### Pass 8: Sentence Builder book mode, so every word game plays the books

- **New data: `src/data/bookSentences.data.ts`.** Three short sentences per book in EN, ES and FR (60 in all), taken only from each book's description and ordered from easy to harder. The test rules:
  - 3 to 7 words each;
  - no punctuation;
  - no word repeated within a sentence, so the tiles have exactly one right order.
- **Sentence Builder book mode.** Opened with `?book=<id>`, the book's sentences become a level of their own, selected first. The tiles, the clue and the speech are in the game's language (the built-in levels are English only), and the reveal shows all three languages. An unknown book falls back to the normal game.
- **Shared data.** The sentences are baked next to the story words in the shared word-game data (`STE_BOOK_VOCAB`), so `book-words.js` exposes them as `STE_BOOK.sentences`. Sentence Builder is now an `anyBook` activity with "Back to <book>" from every book.
- **The Story words strip** on each book page links to Sentence Builder too: "Eight words and three sentences from this book".
- **Result:** all five word games that no book linked (Flashcards, Memory Match, Spelling Bee, Word Explorer, Sentence Builder) now play each book's own words.
- **Wording compromises, to stay within 7 words in every language:**
  - Sanding Block: "He gets a sanding block" (the grandfather isn't named);
  - Colors: "Three colors make all the others";
  - Mr. Costas, Grandpa Chen and Anders aren't named in any sentence (punctuation or hyphen rules).
- **Tests:** `tests/funnel/book-sentences.test.mjs`; the word-game test now also covers Sentence Builder.
- **Still open:** second activities for the strongest books; coloring art from the books.

### Pass 9: a second activity for the five strongest books (§5b)

New Studio pages, each listed second on its book page (wave 3):
- **Where Did My Shadow Go?** (*Maya's Shadow*, 3-7). Move a lamp around a child in a simple scene: low means a long shadow, high means a short one, close means bigger and blurrier. Then plan the shadow's night adventure. The printout adds a flashlight experiment to try at home.
- **Brave Breathing with Diego** (*Diego's Brave Leap*, 4-8). Six slow wave breaths of 4 seconds in and 4 out, with a tummy check before and after and a gentle comparison. With reduced motion, the circle stays still and a countdown shows instead. Prints a pocket breath card.
- **Inventor's Blueprint** (*Heidi's Journey to Mastery*, 5-9). Design an invention: what it helps and up to 3 materials, then the 3 small skills to learn first. Prints a blueprint card.
- **The Thousand Cubes Challenge** (*Mira's Thousand Cubes*, 5-9). A 30-day practice tracker where each day fills a cube. It is saved on the device under a new storage key, `thousandCubes`, checked strictly when read back and registered in `LEGACY_KEYS`, so "clear my data" covers it.
- **What the Tree Has Seen** (*The Fig Tree's Secret*, 5-9). Pick a "witness" from family life and build a three-generation timeline of what it has seen.

Links that made room for them:
- Diego no longer links Character Workshop, so the "emotions" collection features Brave Breathing instead.
- Heidi and Mira no longer link Bookmark Designer.
- Fig Tree no longer links Flashcards; its own story words in the Story words strip cover that.

Tests: Studio tests extended to 24 pages, with the new activities in slot 2. All 15 page and language combinations checked in a browser.

**Still open:** coloring pages drawn from the book illustrations, which need the owner's artwork.

### Pass 10: Pixel's Story Quiz, a spoken picture quiz for pre-readers (§5c item 4)

- **New page `/activities/pixel-quiz?book=<id>`** (ages 3-6, about 10 minutes), for any book in the collection. It's reached from a new **"🦋 Pixel's quiz"** button in every book's Story words strip. Without a book, the page shows a book picker.
- **How it plays**, after the grown-up has read the book aloud:
  1. Pixel the butterfly (from *The Day the Colors Got Mixed Up*) says hello, then asks "Which picture was in the story?" four times. Each round shows three big pictures with their words.
  2. A wrong tap fades that picture and Pixel says "Not that one. Try again!"; the right one is read aloud ("Yes! "wolf" was in the story!"). There's no score and no way to fail.
  3. "Let's talk": Pixel reads the book's own "after reading" prompt, and the child taps a face for how the story felt.
  4. A printable **story badge** shows the four pictures found, the feeling, Pixel's question and a box to draw a favourite part.
- **Everything comes from catalog data**, so no new content was written about any book:
  - the right picture is one of the book's eight story words (`bookVocab`);
  - the two wrong pictures are story words from other books, but only from a short list of concrete, distinctive things (animals, objects, buildings), and never a word the book's description, subtitle or discussion prompts use in any language. Feelings, colours, body parts, people, times of day and everyday nature (sun, rain, tree) are never offered as wrong answers, because they could be in any story even when the catalog doesn't mention them;
  - the right picture moves one place each round, so tapping the same spot never wins;
  - rounds are seeded by the book id, so the server-rendered page and the browser agree.
- **Speech:** every prompt is spoken in the page language using the existing speech library. Where the device can't speak, the page asks the grown-up to read Pixel's words aloud.
- **Feeling words** are nouns in Spanish and French ("alegría", "de la joie"), so they don't need to agree with the child's gender.
- **Tests:** `tests/funnel/pixel-quiz.test.mjs` checks every book: four rounds with three different pictures, exactly one from the book, no wrong picture named anywhere in the book's catalog text, the right picture not always in the same place, the same rounds on every run, and an "after reading" prompt in all three languages. Played through in a browser in EN (*Leo*), ES (*The Adventures of Maya's Shadow*) and FR (*A Little Boat's Big Wish*). The badge prints on one page.
- **Size:** total JavaScript is now 413 KB gzip (warning at 400, limit 420). The next new activity will need some trimming or a budget review first.
- **Still open:** Story Sequencing Cards (needs 4-6 scene images per book), themed Classroom Units, and coloring pages from the book illustrations (needs the owner's artwork).
