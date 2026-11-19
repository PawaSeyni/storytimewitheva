# Book-Linked Activities Audit — November 2026

**Scope:** every activity that a book on storytimewitheva.com links to through `relatedActivityIds`, checked against the live site (book pages render the "Try an activity" block; spot-checked `/books/cloud-collector/` and `/books/leo-and-the-wolf/`) and the source (`src/data/books.data.ts`, `src/data/activities.data.ts`, `src/demos/*`, `public/games/*`).

**Catalog at audit time:** 20 books · 29 activities (13 standalone HTML games, 16 in-app React pages) · 70 book→activity links.

> **Re-audited 18 November 2026,** after remediation passes 1 to 11. For the current scorecard and the open to-do list, see **§7**. Sections 1 to 6 describe the site as it was at the first audit.

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
| **P2** | ~~Story Companion PDF and `/free/<book-id>` magnet for each book~~ Done in pass 11 as a free activity kit per book at `/free/<book-id>-companion` | M | 20 signup entry points in place of 1 |
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

## 7. Re-audit, 18 November 2026

**Scope:** the same method as the first audit, run against `main` after passes 1 to 11 (PRs #256 to #263) and the live site. Spot-checked live: `/books/leo-and-the-wolf/`, `/es/books/fig-trees-secret/`, `/fr/free/little-boats-big-wish-companion/`, `/activities/pixel-quiz/?book=russet-the-fox`.

**Catalog now:** 20 books · **47 activities** (12 standalone games, 35 in-app pages), up from 29 · **74 book→activity links**, up from 70.
- **23 book-specific activities** (8 at the first audit);
- **7 that work for any book** (word games, story worksheet, Pixel's Story Quiz);
- **4 with a little-reader mode.**

On every book page, the Story words strip offers 6 more activities in that book's mode (4 word games, the worksheet and the quiz). Each book also has a free activity kit at `/free/<book-id>-companion`.

### 7a. What the first audit found, and where it stands

| First-audit finding | Now |
|---|---|
| Only 11 of 20 books had an activity built for them | **Fixed.** 20/20 books lead with a book-specific activity; a test enforces it. 6 books have two. |
| Story Map showed 10 off-catalog books | **Fixed.** It shows the 20 catalog books only. |
| Finish-the-Story starred Eva and invented plots | **Fixed.** Six stories from catalog books. |
| "Read next" ignored the book the child came from | **Fixed.** `?book=` carries the book; activity events record it. |
| 5 word activities had no book link | **Fixed.** All five play each book's words (book mode, from the Story words strip). |
| Activities rated 6-9 linked from 4-8 books | **Fixed.** Little-reader modes or swapped links; a test enforces the age rule. |
| No per-book printable | **Fixed.** A two-page worksheet for every book, plus Leo's hand-written one. |
| One signup entry point | **Fixed.** 20 per-book activity kits, tagged by book in MailerLite. |
| No performance data | **Still open.** Events now carry `book`, but no report has been run since the September baseline. |
| Coloring has no scenes from the books | **Still open** (needs artwork). Coloring is now the most-linked activity, from 7 books. |

### 7b. Book-by-book scorecard

**Grades:** **A** = two activities built for the book; **A-** = one of its own plus good theme matches; **B+** = one of its own, but only three activities, two of them generic logs; **B** = its only "book-specific" activity is shared with other books. (★ = book-specific.)

| Book | Ages | Linked activities | Own | Grade | Main problem now |
|---|---|---|:-:|:-:|---|
| The Adventures of Maya's Shadow | 3-7 | ★Shadow Theatre, ★Where Did My Shadow Go?, Coloring, Build-a-Scene | 2 | **A** | Coloring is generic |
| Diego's Brave Leap | 4-8 | ★Brave Plan, ★Brave Breathing, Emotion Wheel, Finish-the-Story | 2 | **A** | — |
| Leo and the Wolf | 4-8 | ★Trust Meter, ★Leo worksheet, Finish-the-Story, Character Workshop | 2 | **A** | — |
| Heidi's Journey to Mastery | 5-9 | ★Maker Passport (shared), ★Inventor's Blueprint, Craft Corner, Build-a-Scene | 2 | **A** | — |
| Mira's Thousand Cubes | 5-9 | ★Maker Passport (shared), ★Thousand Cubes Challenge, Craft Corner, Build-a-Scene | 2 | **A** | — |
| The Fig Tree's Secret | 4-8 | ★Story Quilt, ★What the Tree Has Seen, Journal, Bingo | 2 | **A** | — |
| The Day the Colors Got Mixed Up | 4-7 | ★Color Mix Lab, Bookmark, Build-a-Scene, Coloring | 1 | **A-** | No Hawel and Pixel coloring page |
| The Rainbow Symphony | 3-6 | ★Harmonia Orchestra, Build-a-Scene, Coloring, Flashcards | 1 | **A-** | — |
| Pawa and the Little Rainbow Cloud | 3-7 | ★Feelings Weather Report, Coloring, Emotion Wheel, Rhyme | 1 | **A-** | Rhyme & Sing-Along is nursery rhymes, no Cirro song |
| The Crooked Little Apple Tree | 4-8 | ★One-of-a-Kind Tree, Emotion Wheel, Coloring, Flashcards | 1 | **A-** | — |
| The True Beauty of Meadowbrook | 4-8 | ★Kindness Mirror, Emotion Wheel, Journal, Flashcards | 1 | **A-** | — |
| Russet the Fox Learns a Lesson | 4-8 | ★Listen Like a Fox, Finish-the-Story, Journal, Bookmark | 1 | **A-** | — |
| A Little Boat's Big Wish | 3-7 | ★Puddle Voyage, Rhyme, Coloring | 1 | **A-** | Rhymes are generic; no boat coloring page |
| The Cloud Collector | 4-8 | ★Cloud Detective, Rhyme, Story Map | 1 | **A-** | — |
| The Little Mapmaker | 4-8 | ★Map My World, Story Map, Coloring | 1 | **A-** | — |
| The Tower That Touched the Sky | 5-9 | ★Ask-First Architect, ★Everyone Gets Heard, Journal | 2 | **A** | Fixed in pass 14 |
| The Emperor's True Treasure | 5-9 | ★True Treasure Chest, ★Coins You Can't Spend, Journal | 2 | **A** | Fixed in pass 14 |
| The Sparrow Who Saved the Forest | 4-8 | ★Small Noticer, ★Kindness Ripple (shared), Journal, Bingo | 1 | **A-** | Fixed in pass 12. Before: its only book-specific activity was shared with *Butterfly Effect* |
| The Butterfly Effect | 5-9 | ★Kindness Chain, ★Kindness Ripple (shared), Emotion Wheel, Journal | 1 | **A-** | Fixed in pass 12. Before: shared its only activity with *Sparrow* |
| The Sanding Block | 5-9 | ★Rough to Smooth, ★Maker Passport (shared), Bookmark, Craft Corner | 1 | **A-** | Fixed in pass 12. Before: shared the passport with Heidi and Mira |

**Grade spread:** 6 A, 9 A-, 2 B+, 3 B, and nothing below B at the re-audit. **After pass 12:** 6 A, 12 A-, 2 B+. **After pass 14:** 8 A, 12 A-, nothing below A-. At the first audit: 0 A, 3 A-, 2 B+, 6 B, 2 C, 4 C- and 3 D.

### 7c. New and remaining findings

1. ~~**Three books still have no activity of their own:** *Sparrow*, *Butterfly Effect* and *Sanding Block*.~~ **Done in pass 12:** Small Noticer, Kindness Chain and Rough to Smooth. All 20 books now have an activity of their own.
2. **The generic activities carry the most links, and they still ignore the book.** None of these reads `?book=`:
   - Adventure Journal (7 books) and Coloring (7);
   - Bingo, Emotion Wheel and Build-a-Scene (5 each);
   - Bookmark, Craft Corner and Rhyme (3 each).

   Two of these improvements need no art, and were **done in pass 13**:
   - **Journal:** pre-fills the book title and cover when opened from a book.
   - **Emotion Wheel:** asks "How did <character> feel in the story?".
3. ~~**Puzzle Paradise still has fairy-tale content.**~~ **Rebuilt in pass 13** on each book's story words and sentences (owner decision: rebuild, not retire).
4. **Five activities are linked from no book and have no book mode:** Story Builder, Puzzle Paradise, Counting & Numbers, World Geography and Reading Tracker. The Reading Passport is also unlinked, but book pages reach it from the "Read" button, so it's fine.
5. **Rhyme & Sing-Along** is still public-domain nursery rhymes ("Twinkle Twinkle") on three books about clouds, rain and a boat.
6. ~~**Bookmark Designer** still offers generic quotes.~~ **Done in pass 14:** opened from a book, the bookmark starts with that book's own line.
7. **The Studio printables are still text and emoji only.** A spot illustration from each book was the first audit's top idea for making prints shareable. It needs artwork.
8. ~~**`relatedResourceIds` is still empty for every book.**~~ **Done in pass 15.** This reversed the September decision (backlog B-03) to keep a shared strip; the guides now carry theme tags, which was the missing signal.
9. **Nothing points to the 20 activity kits yet.** They're noindex and deliberately not linked from the site, so until pins, posts or ads link to them, they get no visitors. **Pass 15 drafted the 60 pins** for the owner's approval.
10. **No measurement since September.** The funnel events and the `book` property are in place, and so are the MailerLite tags for the kits. But nobody has looked at book → activity → completion, or at signups by kit.

### 7d. Updated to-do list

| Priority | Item | Needs | Effort | Why now |
|---|---|---|---|---|
| **P0** | **First funnel report:** book page → activity click-through by book, completions by activity and source book, signups by magnet (including the 20 kits). **Done:** email half in `docs/analytics/REPORT_2026-11-18-signups.md`, traffic half in `docs/analytics/REPORT_2026-11-18-funnel.md`. About 640 visitors in six months, 58% from one August paid Pinterest campaign (5-second visits, about 1% signup); organic French and Spanish posts converted at 20-40%; 22 book-page visitors; activities barely visited because traffic is low, not because of the activities. | — | S | 11 passes shipped with no data on what children actually use. This decides what gets built next. |
| **P0** | **Point traffic at the 20 kits.** **Drafted in pass 15:** 60 pins (EN/ES/FR per book, ids P-078 to P-137, tracked links) in `docs/marketing/KIT_PINS_2026-11.md`, awaiting the owner's tick per pin. | Owner approval of copy; pin art from existing covers | S–M | The kits get no visitors until something links to them |
| ~~**P1**~~ | ~~**One activity of their own for *Sparrow*, *Butterfly Effect* and *Sanding Block*.**~~ **Done in pass 12.** Ideas from their descriptions: *Small Noticer* (spot what the big animals miss), *Kindness Chain* (each kind act leads to the next; a paper chain to print), *Rough to Smooth* (patient strokes that smooth a plank, with a practice card) | — | M (3 Studio pages) | They're the three B books; this gives 20/20 books an activity of their own |
| ~~**P1**~~ | ~~**Book mode for the two most-linked generic activities**~~ **Done in pass 13.** | — | S–M | 12 book links became book-aware |
| ~~**P1**~~ | ~~**Fix Puzzle Paradise**~~ **Rebuilt in pass 13** on the books' words and sentences. | Owner chose: rebuild | S | Off-brand content on the hub |
| **P1** | **Coloring pages from the book illustrations,** starting with the 7 books that link Coloring | Owner artwork | M (art) | Coloring is now the most-linked activity |
| ~~**P2**~~ | ~~**Themed classroom units**~~ **Done in pass 15:** five open unit pages at `/classroom/<unit>` with a 5-day plan each, plus a gated pack per unit (owner chose: open plus a gated pack). | — | M | Teacher audience; the content already exists |
| ~~**P2**~~ | ~~**Bookmark quotes per book**~~ **Done in pass 14.** | — | S | Cheap, and makes 3 links book-aware |
| ~~**P2**~~ | ~~**A second activity for *Tower* and *Emperor***~~ **Done in pass 14:** Everyone Gets Heard and Coins You Can't Spend. | — | M | The two B+ books |
| ~~**P2**~~ | ~~**Link books to resources**~~ **Done in pass 15.** | — | S | The Resources page and book pages don't point to each other |
| ~~**P2**~~ | ~~**Trim the `/books` catalog HTML**~~ **Done in pass 15:** 113–117 KB. No budget warnings remain. | — | S | The last budget warning |
| **P3** | **Story sequencing cards** | 4–6 scene images per book | M | Waiting on art |
| **P3** | **Original songs** for the cloud, rain and boat books in Rhyme & Sing-Along | Lyrics (owner) | M | Replaces nursery rhymes on 3 books |
| **P3** | **Spot illustrations on the Studio printables** | Owner artwork | M (art) | Makes prints shareable |
| ~~**P3**~~ | ~~**Collection Story Dice**~~ **Done in pass 15.** | — | S | Fun extra, no assets needed |
| **P3** | **Decide on the unlinked generic activities** (Story Builder, Counting & Numbers, World Geography, Reading Tracker): give them a book mode or retire them | Owner decision | S | Hub clean-up |

---

## Appendix: how the activity links were distributed at the first audit

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

### Pass 11: a free activity kit for every book (§4C)

- **20 new email-gated landing pages**, one per published book, at `/free/<book-id>-companion` (also `/es/…` and `/fr/…`). The `-companion` suffix keeps `/free/leo-and-the-wolf` for the free Leo storybook, unchanged.
- **The offer** is the book's cover, a short blurb with the book's title and age range, and the same signup form as every other free printable. After signing up, the visitor gets three links in their language, each opened in that book's mode:
  - the two-page story worksheet (Leo's hand-written worksheet for Leo);
  - Pixel's Story Quiz;
  - the story-word flashcards.
- **Nothing new to write or maintain.** The kits are built from the catalog and the activities that already exist, like the learning packs (`src/data/bookCompanions.ts`). A new published book gets its kit automatically; "coming soon" books don't get one.
- **Tagging:** each signup is tagged `lead_magnet = <book-id>-companion` in MailerLite, so signups can be counted book by book. The subscribe function already accepts any tag, so no server change was needed.
- **Activity links open instead of downloading.** Bundle links used to carry the `download` attribute, which on an HTML page would save the page as a file. Links to activity pages now open normally (marked 👉); file links still download (📥), checked on the bilingual bundle, the classroom pack and the Leo storybook.
- **Build guards:** the prerender builds all 60 pages and aborts if a companion slug collides with an existing magnet or pack. Like the other landing pages, they are noindex and stay out of the sitemap.
- **Not linked from the site on purpose.** On the site, the same activities are already free and open from each book page. These pages are entry points for Pinterest, social posts and ads, one per book.
- **Tests:** `tests/funnel/book-companions.test.mjs` (one kit per published book, no slug collisions, every link opens an existing activity in that book's mode and language); `tests/seo/book-companions.test.mjs` (all 60 pages prerendered, noindex, tagged, naming the book).
- **Size:** the signup form is part of the first page load, so the entry bundle grows by 2 KB to 109 KB gzip (budget 125); total JavaScript is 415 KB. A trimming pass found nothing to remove without cutting features, so the total-JavaScript budget was raised to 460 / 480 KB (owner decision; reasons in `docs/platform/PERFORMANCE_BUDGET_POLICY.md`). The entry and per-page budgets, which govern what a visitor downloads, are unchanged.
- **Their own thank-you message** (owner decision). After signup a kit names the book and says to open the activities ("Your "The Fig Tree's Secret" activity kit is ready! Tap an activity below to open it."), in all three languages. The other offers keep "your download is ready".

### Pass 12: an activity of their own for the last three books (re-audit §7c item 1)

New Studio pages, each listed first on its book page:
- **Small Noticer** (*The Sparrow Who Saved the Forest*, 4-8), `/activities/small-noticer`:
  - Find the three small things in a forest the big animals walked past: a fallen chick, a thirsty sprout, a ladybug on its back. The small things are drawn smaller, so children have to look closely.
  - Then notice up to three small things at home or school and pick a tiny kind act for each. Only acts that fit are offered (a thirsty plant gets "water it", an empty pet bowl "fill the bowl").
  - Prints a card: "I noticed… so I will…" and "Nobody is too small to help."
- **Kindness Chain** (*The Butterfly Effect*, 5-9), `/activities/kindness-chain`:
  - Start with one small kind act, then follow it from person to person: who it reached, and what they passed on, up to six links ("Your one kind thing reached 3 people!").
  - Prints paper-chain strips to cut, glue and keep growing at home or in class.
- **Rough to Smooth** (*The Sanding Block*, 5-9), `/activities/rough-to-smooth`:
  - Sand a rough plank one stroke at a time (24 strokes). The rough marks fade, the message changes as it gets smoother, and it ends: "No one stroke did that. All of them together did." The progress bar respects reduced motion.
  - Then choose something to get good at and a small daily step.
  - Prints a seven-day practice card.

**Grounded in the catalog.** Each page uses only what the book's description says. The grandfather and the boy in *The Sanding Block* aren't named in the catalog, so they aren't named here either. Spanish and French titles are gender-neutral: "Ojos de gorrión" and "Yeux de moineau" ("Sparrow eyes").

**Links that made room.** The shared activities move to second place. *Sparrow* no longer links Character Workshop (Leo still does), and *Butterfly Effect* no longer links Bingo (five other books still do).

**Tests:** the Studio unit test covers 27 pages and allows a shared activity to sit in a different slot per book; the Studio browser test covers the three new pages (30 pass). All three were played through in EN, ES and FR, and each prints on one page.

### Pass 13: the generic activities learn which book they came from (re-audit §7c items 2 and 3)

- **Adventure Journal** (linked from 7 books). Opened with `?book=<id>`, it fills the book in:
  - normal mode shows the cover and pre-fills the title, and the saved entry keeps the book id, so the journal and the Profile page show the cover and the title in the reader's language. If the child types a different title, the id is dropped so they never disagree;
  - little-reader mode starts with that cover already selected.
- **Emotion Wheel** (linked from 5 books). Opened with `?book=<id>` from one of them, a banner names the book and the wheel asks how its character felt: "How did Diego feel in the story? Tap a feeling on the wheel, then tell a grown-up when." Each feeling then asks "Do you think Diego felt this way in the story? When?" before the game's own question.
  - **New data: `src/data/bookHeroes.data.ts`**, who each book is about in the words of its own description: Diego; Cirro; the crooked little apple tree; the quiet girl; and, for *The Butterfly Effect*, "the people in the story". `scripts/patch-games.mjs` bakes it into the game for the books that link the wheel.
  - The wording never needs an adjective to agree with the hero, so "la niña tranquila" and "le petit pommier tordu" read correctly.
- **Puzzle Paradise rebuilt** (owner decision: rebuild). The fairy-tale scrambles, riddles, "Wolf & Grandma" matching and logic puzzles are gone. For any book in the collection, it now offers:
  - **Unscramble the story words:** the book's eight story words in the page language, accent-free so a child can type them, with a hint in the other two languages, three tries, then "show the word";
  - **Put the sentence back together:** the book's three story sentences as word tiles to tap in order;
  - a score ("Solved: 7 of 11"), a "Puzzle Master" line, and a **one-page printable worksheet** of the same puzzles.
  - Shuffles are seeded by book and language, so the page is the same on the server, in the browser and after a reload. Now an `anyBook` activity, ages 6-9, reached from a new "🧩 Word puzzles" button in every book's Story words strip.
- **Tests:** `tests/funnel/book-modes.test.mjs`: the Journal reads the source book in both modes; every book that links the wheel has a hero and the baked data matches the catalog; the puzzles carry no fairy-tale content; for every book and language, each scramble is a true permutation that never equals the answer and is stable between runs.

### Pass 14: the last two B+ books, bookmark lines, and the first signups report

- **Everyone Gets Heard** (*The Tower That Touched the Sky*, 5-9), listed second on its book page. In three rooms (a meeting, a classroom, a dinner table) one small figure has a hand up while everyone else talks; find it before it's too late ("You saw it! Victor never did."). Then pick up to three ways the family or class will make sure the quietest hand is seen, and answer the book's own question: what would you have asked Victor? Prints a "Getting-Heard Promise" card with a talking token to cut out.
- **Coins You Can't Spend** (*The Emperor's True Treasure*, 5-9), listed second on its book page. Mint up to seven coins for things no money could buy (a hug, a story at bedtime, a walk together, or two of the child's own), watch the emperor's empty treasury fill, and choose one coin to "spend" today. Prints a week of coins to colour one each day.
- Both replace Bingo on those book pages. Bingo stays on three books. The *Ages 8-9* collection, which featured Bingo, now features Craft Corner instead, which its member books do link.
- **Bookmark Designer book mode.** Opened from a book page, the bookmark starts with that book's own line, and "Surprise me" can pick it too. **New data: `src/data/bookQuotes.data.ts`**, one line per book in three languages, each drawn from the book's catalog description or theme and short enough for the bookmark's 30-character field ("Build with questions", "Kindness travels", "Even shadows have adventures").
- **First signups report** (`docs/analytics/REPORT_2026-11-18-signups.md`), from the MailerLite account: 16 active site signups since August, falling from 7 a month to 2 once posting stopped; French flashcards and the Spanish bundle were the two posts that produced repeat signups; the 20 activity kits have had no signups because nothing links to them; the account is shared with another project and test addresses, which inflate the raw count 3×. The Plausible half of the funnel report is still to do.
- **Grades:** 8 A, 12 A-, nothing below A-.
- **Tests:** `tests/funnel/book-quotes.test.mjs` (one line per book, three languages, within 30 characters, wired to the bookmark); the Studio tests cover 29 pages.

### Pass 15: five items built in parallel

Five pieces of work were run side by side, each in its own copy of the repo, then merged.

- **Kit pins drafted for approval** (`docs/marketing/KIT_PINS_2026-11.md`). 60 pins: an EN, ES and FR pin for each of the 20 books, ids P-078 to P-137, each with a tracked link (`utm_campaign=kit_<book-id>`, `utm_content=<pin id>`) to `/free/<book-id>-companion`, the board, the cover to use and a tick box. The copy promises exactly what the kit delivers. Flagged: *A Little Boat's Big Wish* has no local cover file, and the ids must be confirmed against the Pinterest tracker before scheduling.
- **Books and resources point to each other.** Every book now carries two or three `relatedResourceIds`: the parents' guide for every book; the bedtime routine chart (ages 3-7 books) or the classroom follow-up sheets (5-9 books); and the parent guide that shares the most themes with the book, where one does. The book page shows them in a "Guides and printables for this book" block, and the Resources page shows "Pairs with: <books>" under each guide and printable. This reverses the September B-03 decision (a shared strip), which was made before the guides had theme tags; the decision change is recorded in `docs/backlog.md` and `docs/PUNCH_LIST.md`.
- **The `/books` catalog HTML is under budget:** 136/140/142 KB → 113/116/117 KB. The three status icons on every book card (60 inline SVGs, 25 KB) became one shared sprite, and the catalog's structured data dropped a description field that each book page already carries. Nothing visible changed. **No performance-budget warnings remain.**
- **Collection Story Dice** (`/activities/collection-story-dice`, ages 5-9). Three dice, a character, a setting and a problem, whose faces all come from the 20 books' own descriptions ("Leo the shepherd", "a meadow under the sky", "a cloud that can't be kept"), each face naming and linking its book. Roll, lock a die, re-roll; tell, write or draw the story; a read-aloud of the three faces; a printable story-starter card. New data `src/data/storyDice.data.ts`.
- **Themed classroom units** (owner decision: open pages plus a gated pack). Five units at `/classroom/<unit>` with an index at `/classroom`, in three languages, indexable: Kindness (Sparrow, Butterfly Effect, Meadowbrook), Patience (Sanding Block, Heidi, Mira), Courage (Diego, Leo), Feelings (Pawa, Crooked Apple Tree), Curiosity (Cloud Collector, Little Mapmaker, Colors). Each has a 5-day plan built only from things that exist (the books, their Studio activities, the worksheet, Pixel's quiz, the word games, the discussion prompts), the unit's story words, and a gated **classroom pack** at `/free/<unit>-pack` that delivers the unit's worksheets, quizzes and activities as links plus the parents' guide and follow-up sheets as downloads. Linked from the teachers' section of `/resources` and from the educator collections. Data in `src/data/classroomUnits.ts` (light, used by the signup form) and `src/data/classroomUnitPlans.ts` (the plans, loaded only by the unit page, to keep the entry bundle small).
- **Size:** the entry bundle is 116 KB gz (budget warn 125, fail 140), up from 110, from the five unit packs' offer copy in the signup form.
- **Tests:** `tests/funnel/book-resources.test.mjs`, `tests/funnel/story-dice.test.mjs`, `tests/funnel/classroom-units.test.mjs`, `tests/seo/classroom-units.test.mjs`, and new book-page checks in `tests/seo/a11y.test.mjs`. 284 unit tests, 435 prerendered routes, 395 SEO tests.
- **For the owner to read:** the unit titles, descriptions and 25 teacher notes are new copy in three languages; the pins need a tick per pin.

### Pass 16: the traffic half of the funnel report

`docs/analytics/REPORT_2026-11-18-funnel.md`, from a Plausible export of the whole site history (21 May to 18 November 2026). With the signups report, this closes the P0 "first funnel report".
- **About 640 visitors in six months.** 374 (58%) came from one paid Pinterest campaign in August; they stayed about 5 seconds and signed up at about 1%. Since September the site draws 15 to 35 visitors a week.
- **Organic French and Spanish posts converted at 20-40%** (P-032, FB-025, P-012), against about 1% for the paid pins. A third of all visitors are in Spanish-speaking countries.
- **The signup leak is form view → form start (4%);** once someone starts typing, 94% finish.
- **Only 22 people have opened a book page, and the activities have had almost no visitors.** That is a traffic problem, not an activity problem. The exception is **Story Builder** (25 visitors, mostly from Google, about 2 minutes on the page), so it should be kept and given a book mode.
- **Google's one door is the follow-up activities guide** (64 entries, 85-88% leave from it).
- **10 client TypeErrors,** 9 on the homepage. The event records no message, so the cause needs engineering follow-up.

**Updated next steps:** post the kit pins organically, leading with Spanish and French (do not boost yet); find the homepage TypeError; give the follow-up activities guide a next step (classroom units, kits); give Story Builder a book mode.

### Pass 17: acting on the funnel report

Three fixes from `docs/analytics/REPORT_2026-11-18-funnel.md`, built in parallel and merged.
- **The client errors, partly found.**
  - The one on an activity page was real. When a page's code file fails to load (after a deploy removes the old files, or on a flaky in-app connection), the page went blank with "Failed to fetch dynamically imported module". It now **reloads once to recover**, guarded to at most once every 5 minutes and never when session storage is blocked (`src/lib/chunkRecovery.ts`).
  - Two crash paths for embedded browsers were closed: speech on a WebView whose `speechSynthesis` is not an event target, and a missing IntersectionObserver.
  - The nine homepage errors could not be reproduced from the site's code; the likeliest source is scripts the Pinterest in-app browser injects. **`Client Error` now records a redacted `message`, the script file name and line:col**, so the next ones can be traced.
- **A next step on every parent guide.** Google sends almost all its search visitors to the follow-up activities guide, and most left from it. All eight guides now show "Try it with a book" twice: a compact block about 40% of the way down, and a fuller one at the end with 3-4 book covers, the free printable and the five classroom units. Clicks are tracked as `Continue Journey {placement: guide}`.
- **Story Builder book mode.** The activity people find through search now opens in a book's mode from every book page (new "✍️ Story builder" link): the book's character, setting and problem preselected, its story words as a word bank, and a back link. It is now an `anyBook` activity. Two generic characters that could be mistaken for catalog books were renamed: a clever fox (too close to Russet) is now an otter, and a fairy named Luna (*The Cloud Collector*'s Luna) is now Clover.
- **Tracker rows** for the owner's master tracker: `docs/marketing/tracker-punch-list-2026-11-18.csv` (17 to-dos) and `docs/marketing/tracker-pinterest-pins-2026-11-18.csv` (the 60 kit pins).
- **Size:** total JavaScript is 462 KB, just over the 460 KB warning (fail 480), from this month's new pages. Entry bundle 117 KB (warn 125). A trimming pass, or a decision on the total budget, is due before the next new activity.

### Pass 18: suggestions for the extras that need the owner's art or words

`docs/content/ARTWORK_AND_SONGS_BRIEF_2026-11.md`. The owner reviewed the classroom unit copy (done).
- **Four original songs,** ready to approve, each in English, Spanish and French and set to a public-domain tune: *Little Gray Cloud* (Pawa, "Twinkle, Twinkle"), *Little Yellow Boat* ("Row, Row, Row Your Boat"), *Clouds Up High* (Cloud Collector, "Frère Jacques") and a bonus, *Every Color Sings* (Rainbow Symphony, "The More We Get Together"). Every line comes from the book's catalog description. They need no artwork, and replace generic nursery rhymes on three books.
- **Colouring pages:** a spec (SVG line art with closed fillable shapes, print PDFs, area counts by age) and one or two scenes for each of the 7 books that link Coloring.
- **Story sequencing cards:** 4-6 scenes in order for all 20 books. Five books need the owner to pick the turning-point scenes, because their descriptions stop before it.
- **Spot illustrations:** one 600 px transparent PNG per book, ideally a cover crop, reused across that book's printables (20 crops cover all 29).
- **Suggested order:** songs first (approval only), then spot illustrations (first-pass crops from the existing covers are possible), then colouring pages, then sequencing cards.


### Pass 19: the songs and the first spot illustrations

The owner approved everything in pass 18's brief that needs no new art.
- **Four original songs are live** in Rhyme & Sing-Along: *Little Gray Cloud* (Pawa), *Little Yellow Boat* (Little Boat), *Clouds Up High* (Cloud Collector) and *Every Color Sings* (Rainbow Symphony), in English, Spanish and French.
  - Each book page opens the game on its own song (`?book=<id>`). *The Rainbow Symphony* now links the sing-along instead of Build-a-Scene.
  - **Fixed along the way:** the sing-along's lyrics ignored `?lang=`, so Spanish and French book pages opened English lyrics. The URL language now wins, as in `i18n.js`.
  - A test checks that every book linking the sing-along has a song, with equal line counts in all three languages.
- **Spot illustrations, first pass:** 19 cover crops (`public/spots/`, 300 px WebP, about 363 KB in total, loaded lazily) appear at the top right of every Studio printable for their book, on screen and in print. Print page counts are unchanged.
  - *A Little Boat's Big Wish* has no cover file yet, so it has no spot.
  - Final art can replace any crop under the same file name.
- **Still with the owner:** a native ES and FR sing-through (SW-018), a review of the crops (SW-019), and the colouring and sequencing art.

### Pass 20: a size budget per page

Total JavaScript reached 463 KB (warn 460). A second trimming pass found nothing duplicated and no dead pages. The total is the sum of every page in the site, so it grows with each activity, while a visitor downloads only one page's share.
- **New budget (owner decision):** the JavaScript each page downloads up front (its scripts and modulepreloads plus their static imports), warn 210 KB, fail 240 KB, checked for all 435 routes in CI. Heaviest today: Story Builder at 192 KB; median 181 KB; homepage 173 KB.
- The site total stays as a loose ceiling (560 / 600). The entry (125 / 140) and per-chunk (35 / 50) budgets are unchanged.

### Pass 21: getting the kits and the winning offers in front of people

- **MailerLite:** site signups already land in the `storytimewitheva-signups` group. A new segment, "Eva — Real site signups", leaves out test addresses and counts 16 people, the same as the signups report.
- **Repeat what worked:** `docs/marketing/REPEAT_WINNERS_2026-11.md` has 9 drafts for approval: 5 pins (P-138 to P-142: French and Spanish flashcards, Spanish and French bundle) and 4 Facebook posts (FB-047 to FB-050, Spanish bundle in FB-025's shape, French and Spanish flashcards). Ids are provisional until checked against the master tracker.
- **Kit pin posting plan:** `docs/marketing/KIT_PINS_POSTING_PLAN_2026-11.md` orders the 60 kit pins and the 5 new pins at 5 a week from 23 November (13 weeks): Spanish and French first, books with existing visitors first, Little Boat last. Every pin has a checklist: image, link check, posted, logged. Every link was checked against the build.

### Pass 22: pin ids moved onto the tracker's range

P-078 to P-110 already belonged to published or planned pins in the owner's master tracker, so the first-draft ids would have mixed new clicks into old pins' attribution. The owner renumbered the 65 new pins to **P-111 to P-175, in posting-date order** (map: `PIN_ID_MAP_2026-11-18.csv` in the tracker folder). The 62 images were renamed in two passes (the old and new ranges overlap), and the pins tracker CSV, the posting schedule (links and images), the posting plan, both pin docs and `scripts/make-kit-pins.mjs` (the classroom-angle pin is now P-121) use the new ids. Facebook posts FB-047 to FB-050 keep theirs. Little Boat's pins are P-154 (ES), P-155 (FR) and P-175 (EN), still waiting for a cover.

### Pass 23: five merges that never deployed

Production stayed on #273 (`453bf90`) while #274 to #278 merged. Those squash merges used GitHub's default message, which lists every commit on the long-lived work branch, and two old commits in that list say `[skip netlify]`. Netlify skips any build whose message contains that marker, and the post-deploy workflow skips its "wait for production" check on the same marker, so the gap was not flagged. **Fix:** this merge carries a short message of its own, so Netlify builds main (which already holds #274 to #278). **From now on** every squash merge passes an explicit commit message.

### Pass 24: three fixes from the site audit

From `docs/SITE_AUDIT_2026-11-18.md` §6.
- **SW-023, lighter covers.** Two changes, measured on `/books/` against the live site:
  - The 57 covers (700 px) were re-encoded at WebP quality 75: 5.8 to 4.4 MB, visually the same. `scripts/refresh-covers.mjs` now uses the same setting so a refresh doesn't undo it.
  - Every cover has a 400 px copy (`public/covers/400/`, `scripts/make-cover-variants.py`). `sizedCover()` serves it for displays up to 400 px (the guides' book strips, classroom units, Continue Reading, search, journeys), and `BookCard` gives local covers a `srcset` (400w and 700w).
  - Result on `/books/`: **phone about 2.0 to 1.35 MB** of covers (phones have 2 to 3 device pixels per CSS pixel, so cards rightly keep the 700 px file; the saving there is the re-encode), **desktop 1.27 MB to 0.16 MB**. Page image total 7.7 MB, under the 8 MB warning.
- **SW-024, deploy check.** `post-deploy.yml` lets only the commit **title** opt out of the production check. A `[skip netlify]` copied into a squash merge's body now triggers a warning and the normal wait, so a build Netlify skipped is caught and recovered through the build hook.
- **SW-025, em dashes.** The English privacy page no longer has one, and `tests/seo/copy-style.test.mjs` fails the build if an em dash appears in the visible copy, title or description of any indexable English page.
- **SW-021** (signup attribution) is live and verified on production.
