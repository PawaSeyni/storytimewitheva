# Catalog Taxonomy v1 — APPROVED

**Status:** APPROVED and IMPLEMENTED (owner sign-off 2026-09-08).
**Source of decisions:** `BOOK_TAXONOMY_PROPOSAL_FOR_SIGNOFF.md` (owner document).
**Implemented in:** `src/data/taxonomy.ts` (registries) + `themeIds` on every book in
`src/data/books.data.ts`. Enforced by `tests/funnel/taxonomy.test.mjs`.

This file records the approved decisions. The registries in code are the source of
truth; if they disagree with this document, the code wins and this file is stale.

## Approved decisions
1. **13 stable theme IDs** — `curiosity`, `diversity`, `humility-listening`, `wonder`,
   `creativity`, `kindness`, `courage`, `gratitude`, `self-worth`, `patience-mastery`,
   `emotions`, `honesty`, `heritage`. IDs are language-independent; localized labels
   may change without touching stored references.
2. **The localized `theme` phrase stays editorial display copy** and is never parsed
   to infer an ID.
3. **`honesty` and `heritage` remain valid tags and search facets** but must NOT
   generate a public collection route until each has at least two published books
   (`THEME_COLLECTION_MINIMUM = 2`). This avoids thin pages without corrupting
   accurate book metadata.
4. **Age metadata does two different jobs and must not share one rule:**
   - *Suitability filtering* uses **exact containment** (`supportsAge`), so a 5-9 book
     never disappears when a parent filters for a five-year-old.
   - *Age collections* use a **deterministic primary-fit rule**
     (`derivePrimaryAgeBand`), giving every book exactly one starting-point
     collection. Current distribution: `ages-3-5` 4 · `ages-6-7` 10 · `ages-8-9` 6.
   - **Simple band overlap is rejected**: it placed all 20 books in BOTH `ages-3-5`
     and `ages-6-7`, making those two collections identical and useless.
5. **Relationships** use canonical IDs, not route slugs: `relatedBookIds`,
   `relatedActivityIds`, `relatedResourceIds`. Reverse relationships are derived at
   build time, never persisted in source records.
6. **Activity categories stay separate** from book themes. The 13 book themes are not
   forced onto activities; books connect to activities via `relatedActivityIds`.

## Implementation status
| Step (approved doc §9) | Status |
|---|---|
| 1. Theme + age-band registries | ✅ `src/data/taxonomy.ts` |
| 2. `themeIds` on Book (display copy retained) | ✅ |
| 3. Populate the 20-book matrix | ✅ counts verified against the signed-off table |
| 4. Replace text-parsing theme filters with ID-based filters | ✅ `/books` theme `<select>` is ID-based |
| 5. Separate exact-age filtering from primary-fit collections in the UI | ✅ exact-age chips `3..9`; `9+` retired; collections use primary fit |
| 6. Canonical forward relationship fields | ✅ fields + validation shipped; `relatedBookIds` awaits editorial pairs |
| 7. Build-time reverse indexes + collection counts | ✅ `src/data/contentIndex.ts` (nothing reverse persisted) |
| 8. Schema / relationship / parity / route validation | ✅ catalog, taxonomy, relationship, collection and build-guard suites |
| 9. Public collection routes for eligible themes only | ✅ 11 eligible themes × 3 languages; thin themes 404 |
| 10. EN/FR/ES content + accessibility QA | ✅ `tests/seo/a11y.test.mjs` locks the heading order |

## Resolved blockers
- **Resources are now modeled.** `src/data/resources.ts` is the browser-free registry
  for the 4 printables and 6 articles. IDs are kind-prefixed (`article-*`,
  `download-*`) because the article anchor and the download slug
  `follow-up-activities` collide, and `relatedResourceIds` is a flat string array —
  an unprefixed scheme would silently resolve a book to the wrong resource.
  `Resources.tsx` now consumes the registry; the six duplicated localized arrays are
  gone, and the rendered EN/FR/ES pages are byte-identical to before the refactor.
  `relatedResourceIds` validation flipped from "must stay empty" to "must resolve".
- **`discussionQuestions` now exists.** The `DiscussionQuestion` type (`stage` +
  localized `prompt`) and its validation ship with an empty population: prompts are
  editorial, and CI enforces EN/FR/ES parity, known stages and no duplicates the
  moment any are added.

## Editorial decisions taken
- **`relatedBookIds` pairs — approved 2026-09-08.** Ranked candidates (shared themes
  ×3 + same primary age band) were generated and signed off, then written into
  `books.data.ts`. Sign-off is what makes them editorial rather than computed; a
  future regeneration must go back through approval rather than overwrite the field.
- **Age-band-only matches rejected.** Every stored pair shares at least one theme.
  A book with no thematic match simply carries fewer related books.
- **Singleton themes kept.** `leo-and-the-wolf` (`honesty`) and `fig-trees-secret`
  (`heritage`) keep their singleton themes rather than being re-themed to widen the
  candidate pool, so they carry two related books each instead of three. Both themes
  stay below the two-book collection minimum, so neither gets a public collection
  page — that is the intended behaviour, not a gap.

## Still awaiting an editorial decision
- **Two books have no INCOMING link.** `butterfly-effect` and `fig-trees-secret` appear
  in no other book's `relatedBookIds`, because every book they point at already had
  three stronger matches. Nothing is broken today (nothing renders the field yet), but
  once Sprint 6 ships "You might also like" those two are reachable only from search,
  `/books` and their collections. Fixing it means displacing one existing pair
  somewhere, which is an editorial call. The derived `incomingRelatedBookIds` index
  makes the state checkable at any time.
- **Discussion prompt copy** per book, in all three languages.


