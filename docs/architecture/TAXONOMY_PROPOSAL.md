# Proposed Catalog Taxonomy & Relationships — FOR SIGN-OFF

**Status:** PROPOSAL — not implemented. Awaiting owner approval.

**Why this needs sign-off first:** ~15+ work items across Sprints 3–7 (S3-008,
S4-010/011/012, S5-014/016, S6-005/007/008, S7-001/002/009) require relationships to
resolve from **stable catalog IDs**. Today the catalog has none: `theme` is free-text
display copy and `ageRange` is a display string. Guessing these IDs would bake wrong
values into four sprints of relationships.

Derived from the actual 20-book catalog (themes + age ranges read via the build-safe
projection), not invented.

---

## A. Theme IDs (needs per-book authoring)

The current `theme` field is localized display copy ("Kindness and courage") — good to
read, unusable as a key. Proposal: add stable `themeIds`, keep `theme` as the human line.

**13 proposed themes.** IDs stable, lowercase, language-independent; labels localized.

| # | themeId | EN label | Books | Count |
|---|---|---|---|---|
| 1 | `kindness` | Kindness | rainbow-symphony, sparrow-saved-forest, butterfly-effect, true-beauty-meadowbrook | 4 |
| 2 | `self-worth` | Self-Worth | diegos-brave-leap, crooked-little-apple-tree, true-beauty-meadowbrook, pawa-rainbow-cloud | 4 |
| 3 | `belonging` | Belonging & Community | rainbow-symphony, butterfly-effect, crooked-little-apple-tree, fig-trees-secret | 4 |
| 4 | `imagination` | Imagination & Making | colors-mixed-up, mayas-shadow, sanding-block, little-mapmaker | 4 |
| 5 | `courage` | Courage | sparrow-saved-forest, diegos-brave-leap, leo-and-the-wolf | 3 |
| 6 | `patience-mastery` | Patience & Mastery | sanding-block, heidis-journey-to-mastery, miras-thousand-cubes | 3 |
| 7 | `humility-listening` | Humility & Listening | tower-touched-sky, emperors-true-treasure, russet-the-fox | 3 |
| 8 | `wonder` | Wonder | mayas-shadow, little-boats-big-wish, cloud-collector | 3 |
| 9 | `curiosity` | Curiosity & Discovery | colors-mixed-up, mayas-shadow, little-mapmaker | 3 |
| 10 | `gratitude` | Gratitude & Contentment | emperors-true-treasure, little-boats-big-wish | 2 |
| 11 | `growth` | Growth & Letting Go | cloud-collector, pawa-rainbow-cloud | 2 |
| 12 | `honesty` | Honesty & Trust | leo-and-the-wolf | **1 (!)** |
| 13 | `heritage` | Heritage & Family | fig-trees-secret | **1 (!)** |

**Two deliberate merges** (identical membership made separate IDs redundant):
`patience` + `mastery` -> `patience-mastery`; `humility` + `listening` -> `humility-listening`.

**Decision needed — the two singletons.** `honesty` and `heritage` have one book each. S7
requires a minimum editorial threshold for a collection, so neither can sustain a theme
collection yet. Options:
(a) keep as themes, exclude from collections until a 2nd book exists;
(b) fold `honesty` into `courage`, `heritage` into `belonging`;
(c) keep and accept 1-book collections.
*Recommendation: (a) — the themes are real and accurate; only collection-building waits.*

### Proposed per-book assignment (1-3 themes each)
```
colors-mixed-up            curiosity, imagination
rainbow-symphony           belonging, kindness
tower-touched-sky          humility-listening
mayas-shadow               wonder, imagination, curiosity
sparrow-saved-forest       kindness, courage
diegos-brave-leap          courage, self-worth
butterfly-effect           kindness, belonging
emperors-true-treasure     gratitude, humility-listening
crooked-little-apple-tree  self-worth, belonging
true-beauty-meadowbrook    self-worth, kindness
sanding-block              patience-mastery, imagination
leo-and-the-wolf           honesty, courage
russet-the-fox             humility-listening
little-boats-big-wish      gratitude, wonder
heidis-journey-to-mastery  patience-mastery
cloud-collector            wonder, growth
little-mapmaker            imagination, curiosity
pawa-rainbow-cloud         self-worth, growth
miras-thousand-cubes       patience-mastery
fig-trees-secret           heritage, belonging
```

---

## B. Age bands (NO per-book authoring — derived)

The catalog already carries `ageRange` ("3-6", "3-7", "4-7", "4-8", "5-9") and
`src/lib/ages.ts` already exposes `parseAgeRange()`. So bands should be **derived by
overlap**, not hand-tagged: no new per-book field, nothing to drift, reuses an existing
utility.

**3 proposed bands** (the site positions itself as ages 3-9):

| ageBandId | Range | EN label |
|---|---|---|
| `ages-3-5` | 3-5 | Ages 3-5 - Read together |
| `ages-6-7` | 6-7 | Ages 6-7 - Early readers |
| `ages-8-9` | 8-9 | Ages 8-9 - Independent readers |

A book belongs to every band its `ageRange` overlaps (e.g. `4-8` -> all three).

**Decision needed:** approve the three bands + labels, and confirm derive-by-overlap
(recommended) over hand-authored `ageBandIds`.

---

## C. Relationships (needs authoring)

Specs require Book -> Activity / Related Book links from stable IDs, never arrays
duplicated in components. Proposed additions to `Book`:

```ts
relatedBookIds?: string[];        // editorial "More Like This" (S5-016, S6-007)
relatedActivitySlugs?: string[];  // Book -> Activity (S4-012, S6-008, S7-004)
```

Reverse relationships (Activity -> Book) are **derived at build time**, never duplicated,
per S7 section 5 ("reverse relationships are derived during validation or indexing").

**Open — cannot be proposed from existing data:**
1. **Resources are not modeled.** There is a `/resources` page but no resource data model
   with stable IDs, so `relatedResourceIds` (S7-006/008) has nothing to point at.
2. **`discussionQuestions` does not exist.** S7-005 says "attach through the existing
   `discussionQuestions` model where possible" — there is none.
3. **Related-book pairs are editorial.** I can propose defaults from shared themes once
   themes are approved, but final pairs should be yours.

---

## Sign-off checklist
- [ ] **A.** Approve the 13 theme IDs + labels (or rename/trim).
- [ ] **A2.** Singletons `honesty` / `heritage`: keep (rec.) · fold in · allow 1-book collections.
- [ ] **A3.** Approve the per-book theme assignment.
- [ ] **B.** Approve the 3 age bands + derive-by-overlap (recommended).
- [ ] **C.** Approve `relatedBookIds` + `relatedActivitySlugs` on `Book`.
- [ ] **C2.** Decide: model Resources as data? Add `discussionQuestions`? (Both are S7 blockers.)

Once signed off, implementation is: add the fields to `books.data.ts`, expose them through
the build-safe projection, add CI validation (unknown ID -> build failure), and the
dependent items across Sprints 3-7 unblock.
