# Amazon Title & Subtitle Audit — Eva Gallo Collection

**Date:** 2026-07-05
**Model listing:** *Little Cloud and the Magic of Rain: An Enchanting Illustrated STEM Storybook About Weather, Friendship, and Nature – Discovering How Rain, Clouds, and Nature Work for Curious Kids Ages 3–7* (Jonathan Adams, Mar 2025) — 188 characters combined.
**Source of current metadata:** `src/data/books.ts` (EN titles/subtitles). Verify each against the live KDP dashboard before editing — the site may lag the listing.

---

## The model, deconstructed

```
[Title]: A/An [emotional adjective] Illustrated [category] Storybook
About [Theme 1], [Theme 2], and [Theme 3]
– [benefit / discovery clause] for [audience descriptor] Kids Ages X–Y
```

Six components, each one a search surface:

| Component | Model example | What it captures |
|---|---|---|
| Format keyword | "Illustrated … Storybook" | "illustrated books for kids", "storybook" |
| Educational hook | "STEM" | teacher/gift-buyer searches |
| 3 searchable themes | Weather, Friendship, Nature | "children's book about weather" |
| Benefit clause after the dash | "Discovering How Rain, Clouds, and Nature Work" | long-tail how/what queries |
| Audience descriptor | "Curious Kids" | "books for curious kids" |
| Age range | "Ages 3–7" | "books for 4 year olds", the age facet |

## Cross-catalog findings

Audited all 18 titles. The catalog's titles are strong (short, evocative, brandable) — the gap is entirely in the subtitles:

1. **No subtitle carries an age range.** 0 of 18. The model puts "Ages 3–7" directly in the searchable title field. This is the single highest-impact fix.
2. **Almost none carry a format keyword.** Only *Rainbow Symphony* and *Heidi* say "Picture Book"; none say "Illustrated" or "Storybook". "A Story About…" and "A Tale of…" are not phrases buyers type.
3. **No subtitle has the two-part structure.** All are single-clause. The dash clause is free real estate for a second set of long-tail keywords (~60–80 characters currently unused per book).
4. **Several theme words are poetic, not searchable.** "Kindness to the Small", "What It Grows", "Voices Joining Together", "Quiet Magic", "Finding the Ocean in a Bathtub" — lovely on a cover, invisible in search. Nobody types them.
5. **No audience descriptor.** "Curious Kids", "for Kids", "for Preschoolers" appear nowhere.
6. **STEM hooks are being left on the table.** *Cloud Collector* (cloud types!), *Colors Mixed Up* (color theory), *Tower* (engineering), *Heidi* (inventing) all legitimately support the high-value "STEM" keyword — the exact hook the model book rides.
7. **Two title-level issues:**
   - *Leo and the Wolf: A Lesson About Honesty* — the title already contains a subtitle clause, then the subtitle repeats "Honesty". Move the lesson language into the subtitle and reclaim "The Boy Who Cried Wolf" (a high-volume search phrase) in the dash clause.
   - *Heidi's Journey to Mastery: Through Diligence* — "Through Diligence" is awkward appended to the title and duplicates the subtitle's job. Fold it into the subtitle.
8. **Average current combined length ≈ 70 characters vs. the model's 188.** Roughly 120 searchable characters per listing going unused, across 18 listings.

## Compliance guardrails (KDP)

- Title + subtitle combined must stay ≤ 200 characters. Every proposal below is 137–185.
- Keep every claimed theme honest to the book — Amazon suppresses misleading metadata. All proposals below use themes drawn from each book's actual story.
- The "Ages X–Y" in the subtitle must match the reading-age setting in KDP.
- After updating a subtitle, remove any now-duplicated phrases from the 7 backend keyword slots (duplicates waste slots).
- No quality claims ("best", "award-winning") — none used.

---

## Per-book audit and proposed subtitles

Age ranges match `books.ts`. "Chars" = title + colon + subtitle combined.

### 1. The Day the Colors Got Mixed Up (ages 4–7)
- **Current:** *A Color Theory Adventure with Pixel and Hawel*
- **Gaps:** character names have zero search value pre-fame; no format, age, or benefit clause. "Color theory" is the one good keyword — keep it in backend slots.
- **Proposed (185):** *An Enchanting Illustrated STEM Storybook About Colors, Curiosity, and Friendship – How Red, Yellow, and Blue Make Every Color, for Curious Kids Ages 4–7*

### 2. The Rainbow Symphony (ages 3–6)
- **Current:** *A Picture Book About Voices Joining Together*
- **Gaps:** has the format word (good) but "voices joining together" is not a search phrase; no age, no dash clause.
- **Proposed (162):** *A Heartwarming Illustrated Storybook About Music, Diversity, and Teamwork – How Every Voice Makes the Song More Beautiful, for Kids Ages 3–6*

### 3. The Tower That Touched the Sky (ages 5–9)
- **Current:** *A Story About Humility, Listening, and True Brilliance*
- **Gaps:** decent themes, but misses the engineering/STEM hook entirely — the book is literally about an architect.
- **Proposed (176):** *An Inspiring Illustrated STEM Storybook About Engineering, Humility, and Teamwork – How Listening Builds Great Things, for Curious Kids Ages 5–9*

### 4. The Adventures of Maya's Shadow (ages 3–7) — flagship
- **Current:** *A Story of Nighttime Wonder and Quiet Magic*
- **Gaps:** the imprint's bedtime book never says "bedtime" — the highest-volume keyword available to it.
- **Proposed (169):** *An Enchanting Illustrated Bedtime Storybook About Imagination, Wonder, and Nighttime Magic – A Calming Sleep Adventure for Kids Ages 3–7*

### 5. The Sparrow Who Saved the Forest (ages 4–8)
- **Current:** *A Story About Kindness to the Small*
- **Gaps:** "kindness to the small" is poetic, not typed; misses nature/animals angle.
- **Proposed (179):** *A Heartwarming Illustrated Storybook About Kindness, Courage, and Nature – How Even the Smallest Friend Makes a Big Difference, for Kids Ages 4–8*

### 6. Diego's Brave Leap (ages 4–8)
- **Current:** *A Story About Courage and Chasing Your Dreams*
- **Gaps:** courage is right; missing confidence/fear phrasing parents actually search, no age/format.
- **Proposed (155):** *An Inspiring Illustrated Storybook About Courage, Confidence, and Trying New Things – Finding the Bravery Inside You, for Kids Ages 4–8*

### 7. The Butterfly Effect (ages 5–9)
- **Current:** *A Story About Kindness and What It Grows*
- **Gaps:** "what it grows" unsearchable; missing empathy/community terms.
- **Proposed (161):** *A Heartwarming Illustrated Storybook About Kindness, Empathy, and Community – How One Small Good Deed Changes Everything, for Kids Ages 5–9*

### 8. The Emperor's True Treasure (ages 5–9)
- **Current:** *A Quiet Lesson in Gratitude*
- **Gaps:** one theme word total; shortest subtitle in the catalog.
- **Proposed (162):** *A Timeless Illustrated Storybook About Gratitude, Generosity, and Happiness – Discovering What Truly Makes Us Rich, for Kids Ages 5–9*

### 9. The Crooked Little Apple Tree (ages 4–8)
- **Current:** *A Story About Worth, Beauty, and Second Chances*
- **Gaps:** "worth" alone under-indexes; "self-esteem" and "being different" are the phrases buyers use.
- **Proposed (172):** *A Gentle Illustrated Storybook About Self-Esteem, Being Different, and Belonging – Learning That Every One of Us Has Worth, for Kids Ages 4–8*

### 10. The True Beauty of Meadowbrook (ages 4–8)
- **Current:** *A Tale of Kindness That Shines Brighter*
- **Gaps:** misses "inner beauty" — the book's exact search hook.
- **Proposed (168):** *A Heartwarming Illustrated Storybook About Inner Beauty, Kindness, and Confidence – Discovering the Beauty That Lasts, for Kids Ages 4–8*

### 11. The Sanding Block (ages 5–9)
- **Current:** *A Woodworker's Lesson in Patience*
- **Gaps:** misses "perseverance" and "growth mindset" — strong parent/teacher terms; keeps the grandfather hook in the dash clause.
- **Proposed (157):** *An Inspiring Illustrated Storybook About Patience, Perseverance, and Growth Mindset – A Grandfather's Woodworking Lesson for Kids Ages 5–9*

### 12. Leo and the Wolf: A Lesson About Honesty (ages 4–8) — **retitle**
- **Current title issue:** lesson clause inside the title, "Honesty" duplicated in the subtitle.
- **Current subtitle:** *A Timeless Story About Trust, Honesty, and Starting Again*
- **Proposed title:** *Leo and the Wolf*
- **Proposed subtitle (137):** *A Timeless Illustrated Fable About Honesty, Trust, and Second Chances – The Boy Who Cried Wolf Retold for Kids Ages 4–8*
- "The Boy Who Cried Wolf" is the highest-volume phrase this book can legitimately claim; it belongs in the searchable field.

### 13. Russet the Fox Learns a Lesson (ages 4–8)
- **Current:** *A Quiet Tale About Listening, Patience, and Growing Up*
- **Gaps:** themes fine; missing format keyword, "fable", fox story hook, age.
- **Proposed (152):** *A Gentle Illustrated Fable About Listening, Humility, and Patience – A Clever Fox Story of Growing Up, for Kids Ages 4–8*

### 14. A Little Boat's Big Wish (ages 3–7)
- **Current:** *A Story About Finding the Ocean in a Bathtub, a Puddle, and a Pond*
- **Gaps:** longest current subtitle, yet nearly zero search value; this is a bedtime book that never says bedtime.
- **Proposed (160):** *A Calming Illustrated Bedtime Storybook About Contentment, Gratitude, and Wonder – A Little Toy Boat's Big Adventure for Kids Ages 3–7*

### 15. Heidi's Journey to Mastery: Through Diligence (ages 5–9) — **retitle**
- **Current title issue:** "Through Diligence" is a dangling clause doing subtitle work.
- **Current subtitle:** *A Picture Book About Patience, Apprenticeship, and Becoming Good at Something*
- **Proposed title:** *Heidi's Journey to Mastery*
- **Proposed subtitle (179):** *An Inspiring Illustrated STEM Storybook About Perseverance, Patience, and Learning by Doing – A Young Inventor's Growth Mindset Story for Kids Ages 5–9*

### 16. The Cloud Collector (ages 4–8) — closest sibling to the model book
- **Current:** *A Story About Wonder, Letting Go, and Watching the Sky*
- **Gaps:** the book teaches cumulus/cirrus cloud types and never claims STEM, clouds, or weather. It competes directly with *Little Cloud and the Magic of Rain* and cedes every shared keyword.
- **Proposed (162):** *An Enchanting Illustrated STEM Storybook About Clouds, Weather, and Letting Go – Discovering the Wonders of the Sky for Curious Kids Ages 4–8*

### 17. The Little Mapmaker (ages 4–8)
- **Current:** *A Story About Imagination, Drawing, and Making the World a Place You Can Go*
- **Gaps:** wordy tail with no search value; "maps"/"creativity" missing.
- **Proposed (152):** *An Enchanting Illustrated Storybook About Imagination, Creativity, and Maps – A Magical Drawing Adventure for Curious Kids Ages 4–8*

### 18. Pawa and the Little Rainbow Cloud (ages 3–7)
- **Current:** *A Tale of Self-Worth and Transformation*
- **Gaps:** "transformation" is an adult word; "big feelings" is the parent search phrase this book earns.
- **Proposed (178):** *A Gentle Illustrated Storybook About Big Feelings, Self-Worth, and Rainbows – How Rain and Sunshine Make Something Beautiful, for Kids Ages 3–7*

---

## KDP update status (2026-07-05) — entered, NOT published

All changes below were entered in KDP and saved with **Save as Draft** only. Live listings are unchanged until you review and click Publish on each book.

| Book | eBook | Paperback |
|---|---|---|
| The Rainbow Symphony | ✅ staged | 🔒 locked (published) |
| Pawa and the Little Rainbow Cloud | ✅ staged | 🔒 locked |
| Heidi's Journey to Mastery | ✅ staged | ✅ staged (was Draft) |
| Mira's Thousand Cubes *(not in audit; added)* | ✅ staged (Draft) | ✅ staged (Draft) |
| Russet the Fox Learns a Lesson | ✅ staged | 🔒 locked |
| Leo and the Wolf | ✅ staged | 🔒 locked |
| The Day the Colors Got Mixed Up | ✅ staged | 🔒 locked |
| The Tower That Touched the Sky | ✅ staged | 🔒 locked |
| A Little Boat's Big Wish | ✅ staged | 🔒 locked |
| The Fig Tree's Secret *(not in audit; added)* | ✅ staged | 🔒 locked |
| The Little Mapmaker | ✅ staged | 🔒 locked |
| The Cloud Collector | ✅ staged | ⛔ BLOCKED — untouched |

Findings from the live dashboard:

- **No retitles were needed.** On KDP, "Leo and the Wolf" and "Heidi's Journey to Mastery" already have clean title fields — the lesson clauses were subtitles all along (the bookshelf display concatenates them).
- **Paperback title/subtitle are locked after publication** ("changes require publishing a new edition"). Only eBooks and Draft paperbacks could be staged. To fix a live paperback subtitle, KDP requires a new edition.
- **Only 12 titles live in this KDP account.** Maya's Shadow, Sparrow, Diego, Butterfly Effect, Emperor, Crooked Apple Tree, Meadowbrook, and Sanding Block are not on this bookshelf — they're presumably in another account/imprint. Their proposed subtitles above remain to be applied wherever they're hosted.
- Two catalog additions not in books.ts were found and staged with model-formula subtitles: **Mira's Thousand Cubes** (Draft, ages 5–9) and **The Fig Tree's Secret** (Live, ages 4–8).
- Cloud Collector's paperback is in **BLOCKED** state — left untouched; resolve the block with KDP support before any metadata edits.

New subtitles used for the two additions:
- **Mira's Thousand Cubes:** *An Inspiring Illustrated Storybook About Patience, Practice, and Mastery – Learning That Great Things Take Time, for Kids Ages 5–9*
- **The Fig Tree's Secret:** *A Heartwarming Illustrated Storybook About Family, Heritage, and Memory – A Mediterranean Tale of the Trees That Hold Us Together, for Kids Ages 4–8*

To publish: KDP Bookshelf → each book shows "Live With unpublished changes" → Continue setup → review Details → Publish. To discard: re-edit the subtitle back and save.

## Rollout recommendations

1. **Prioritize by traffic:** flagship first (*Maya's Shadow*), then the STEM four (*Cloud Collector*, *Colors Mixed Up*, *Tower*, *Heidi*), then the rest.
2. **Confirm phrases against live Amazon autocomplete** before saving each — these are candidates, not finals. Type "children's book about…" / "illustrated storybook…" and prefer whatever the dropdown ranks.
3. **After each subtitle update, re-do that book's 7 backend keyword slots** to remove anything now in the subtitle and backfill freed slots from the keyword bank (bedtime, SEL, read-aloud, multicultural angles).
4. **Retitles (Leo, Heidi) change the cover file too** — subtitle-only edits are metadata changes in KDP; a title change requires re-approval and an updated cover. Do those two last.
5. **Localize:** once EN subtitles are locked, mirror the structure for the FR (and upcoming ES) editions.
6. **Update `src/data/books.ts` subtitles** after the Amazon listings change so the site matches the listings.
7. **Revisit in 3–6 months** against ad search-term reports.

## Second KDP account (pnguer@icloud.com) — entered 2026-07-05, NOT published

Same rules: every change saved with **Save as Draft** only. This account holds the Pawa Seyni catalog plus the 8 older Eva Gallo titles.

Staged (16 Kindle eBooks + 1 draft paperback), all with new model-formula subtitles and ages matching each book's reading-age setting:

| Book | New subtitle |
|---|---|
| Ubuntu We Are Together | A Heartwarming Illustrated Storybook About Community, Friendship, and Togetherness – An African Tale of Ubuntu for Kids Ages 3–8 |
| The Talking Tree | A Wise Illustrated Storybook About Peace, Listening, and Community – A West African Folktale for Kids Ages 3–8 |
| The Grandmother's Trees | A Heartwarming Illustrated Storybook About Family, Nature, and Memory – A Grandmother's Legacy of Trees for Kids Ages 4–8 *(had no subtitle)* |
| Our Child | A Heartwarming Illustrated Storybook About Community, Belonging, and Family – A Fulani Tale of Raising a Child Together, for Kids Ages 3–6 |
| The Clever Pots | A Playful Illustrated Storybook About Cleverness, Wisdom, and Tradition – A Haalpulaar Folktale from West Africa for Kids Ages 4–7 |
| The Broken Toy | A Heartwarming Illustrated Storybook About Friendship, Forgiveness, and Making Things Right – A Yama Story of Ubuntu for Kids Ages 3–8 |
| The Garden of Second Chances | A Gentle Illustrated Storybook About Forgiveness, Trust, and Second Chances – Learning to Repair and Grow Again, for Kids Ages 5–9 |
| The Spirit That Shares | A Heartwarming Illustrated Storybook About Generosity, Gratitude, and Abundance – Discovering the Joy of Sharing, for Kids Ages 3–8 |
| The Hunt with Two Paths | A Wise Illustrated Storybook About Perspective, Empathy, and Truth – An African Tale of Seeing Every Side, for Kids Ages 4–8 |
| The Brothers and the Wise Land | An Inspiring Illustrated Storybook About Knowledge, Hard Work, and Wisdom – A Tale of Books, Soil, and Learning from the Land, for Kids Ages 6–8 |
| Kweku and the Wise Forest | A Wise Illustrated Storybook About Listening, Learning, and Nature – A West African Forest Tale for Kids Ages 7–8 |
| The Wolf Pack's Promise | A Heartwarming Illustrated Storybook About Family, Tradition, and Courage – A Tale of Loyalty and Belonging for Kids Ages 3–9 |
| The Chief's Green Rule | An Inspiring Illustrated Storybook About Generosity, Nature, and Wise Leadership – Five Seeds for One, an African Tale of Giving Back, for Kids Ages 4–8 *(reading age was unset; set to 4–8)* |
| The Chief's Three Gifts | An Inspiring Illustrated Storybook About Wisdom, Strength, and Gentle Leadership – An African Chief's Tale for Kids Ages 3–9 |
| The Yam and the Egg | A Playful Illustrated Storybook About Choices, Wisdom, and Consequences – A West African Folktale for Kids Ages 4–9 *(had no subtitle)* |
| A Tale of Hope and Humor | An Uplifting Illustrated Storybook About Resilience, Joy, and Hope – A West African Tale of Laughter Through Hard Times, for Kids Ages 3–8 |
| Mira's Thousand Cubes (paperback, Draft) | An Inspiring Illustrated Storybook About Patience, Practice, and Mastery – Learning That Great Things Take Time, for Kids Ages 5–9 |

Not editable / skipped on this account:

- **The 8 older Eva Gallo titles** (Maya's Shadow, Sparrow, Diego, Butterfly Effect, Emperor, Crooked Apple Tree, Meadowbrook, Sanding Block) exist here as **paperback-only** listings, published May 5, 2026 — title/subtitle locked. Applying the audit subtitles requires either creating Kindle eBook editions (recommended: new format inherits the optimized subtitle) or publishing new print editions.
- **~20 Pawa Seyni paperback-only titles** (Mighty Fist, Whistling Secret, Full Pot, Servant King, Yama series, etc.) — same lock; new editions or eBook formats needed.
- **Winning the Moments That Matter** (Papa Nguer) — business book, children's formula not applicable; untouched.

To publish any of these: Bookshelf → book shows "Live With unpublished changes" → Continue setup → review → Publish.
