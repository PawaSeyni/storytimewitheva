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
| Leo and the Wolf | 4-8 | Character Workshop, Finish-the-Story, Story Dice | 0 | **C** | Has its own free PDF, but the book page doesn't link to it |
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
- *Leo and the Wolf* already has a free trilingual PDF, but it can only be reached at `/free/leo-and-the-wolf`. **The Leo book page doesn't link to it.**
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
| **P1** | Link the Leo PDF from the Leo book page; fill `relatedResourceIds` | XS | A finished asset that readers currently can't find |
| **P1** | 9 new Studio activities (§5a), in this order: Leo, Russet, Tower, Emperor, Little Mapmaker, Boat, Apple Tree, Meadowbrook, Rainbow Symphony | ~9–12 days | Takes book-specific coverage from 11/20 to 20/20 |
| **P1** | `bookVocab` data, plus `?book=` support in the 5 orphaned games and Puzzles | M | About 6 × 20 book-specific activities from one data set |
| **P1** | Book-specific coloring line art (start with the 6 books that link Coloring) | M (art) | Coloring is the most-linked activity for ages 3-7 |
| **P2** | Story Companion PDF and `/free/<book-id>` magnet for each book | M | 20 signup entry points in place of 1 |
| **P2** | Reading Passport | M | Turns activities into catalog purchases |
| **P2** | Age-fit fixes, 4-column grid, Activities-hub age filter (E6) | S | Polish |
| **P3** | Second activities (§5b), Sequencing Cards, Pixel Quiz, themed Classroom Units | L | Expansion once the P0–P1 work is in and measured |

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
