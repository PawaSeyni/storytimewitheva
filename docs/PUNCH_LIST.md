# Content Architecture Punch List

Tracks the content-architecture programme (catalog → taxonomy → collections → resources →
relationships → related-books UI): what has shipped, what is open, and what has been
deliberately decided against.

**Scope.** This covers the data/content architecture stream only. Operational, marketing,
security and funnel items live in [`backlog.md`](backlog.md) and are not repeated here.
Cross-cutting gate items appear in both, keyed by the same ID.

**Provenance caveat.** The Sprint 1 PRD and the Sprint 3–7 technical specifications were
supplied as attachments and are **not stored in this repository**. Items below are therefore
keyed to shipped deliverables and PR numbers rather than to spec IDs. Where a spec ID survives
in the code it is cited (`S1-010`, `S3-004`, `S3-005`, `S3-016`).

**Legend.** `shipped` = merged and verified · `open` = actionable now · `editorial` = needs
owner copy or a content decision, not code · `deferred` = knowingly parked with a reason.

Last updated 2026-09-09 against `main` @ `3477fd9`.

---

## A. Shipped

### Catalog and data architecture

| ID | Item | Evidence |
|----|------|----------|
| C-01 | **Per-book `editions` field** — one source of truth for per-language cover art and Amazon ASIN, replacing parallel cover/link maps that drifted. `localize()` resolves per language and falls back to English. | #135 |
| C-02 | **Trilingual editions live** — all 20 books show three language flags; ES/FR covers and Buy links wired where the edition exists. | #134, #136 |
| C-03 | **Catalog split into a browser-free module** — `src/data/books.data.ts` imports only a type-only `Language`, so Node and esbuild can load the real catalog. `src/data/books.ts` keeps the React surface. | #142 |
| C-04 | **Build-safe catalog projection** (`S3-004`) — `scripts/lib/catalog.mjs` compiles the data module with esbuild and evaluates it in-process. **Every regex source-parse was removed from the build path.** Load failure is a hard error, never a silent fallback. Faithfulness proven by byte-identical sitemap output. | #142 |
| C-05 | **Fig Tree's Secret added** to the catalog (20 books) with A+ content. | #130 |

### Taxonomy v1 (owner-approved 2026-09-08)

| ID | Item | Evidence |
|----|------|----------|
| T-01 | **Theme + age-band registries** — 13 stable theme IDs and 3 age bands with EN/FR/ES labels, in a browser-free `src/data/taxonomy.ts`. | #142 |
| T-02 | **`themeIds` on every book** — 20-book matrix populated; counts verified against the signed-off table. Localized `theme` copy retained as display text and never parsed to infer an ID. | #142 |
| T-03 | **Exact-age containment vs deterministic primary fit** — the two age models are separate by design. Simple band overlap was rejected during sign-off because it placed all 20 books in both the 3–5 and 6–7 groups. | #142 |
| T-04 | **ID-based filters on `/books`** — theme `<select>` filters on IDs, not text; age chips are exact ages 3–9. The legacy `9+` bucket and the `age3to5`/`age6to8`/`age9plus` keys are gone. | #142 |
| T-05 | **Derived reverse indexes** — `src/data/contentIndex.ts` computes `booksByThemeId`, `booksByPrimaryAgeBand`, `incomingRelatedBookIds`, `booksByActivityId`, `themeCounts`. **Nothing reverse is persisted in source**, so it cannot drift. | #142 |

### Collections

| ID | Item | Evidence |
|----|------|----------|
| K-01 | **`/collections/:themeId`** in all three languages — 11 eligible themes × 3 languages, localized H1 and intro, breadcrumbs, CollectionPage + ItemList + BreadcrumbList JSON-LD. | #142 |
| K-02 | **Thin-page gate enforced in three independent places** — page-level 404, sitemap derivation, and the prerender guard. `honesty` and `heritage` (1 book each) cannot ship. Live-verified: `/collections/honesty` returns 404. | #142 |
| K-03 | **Bidirectional sitemap/prerender parity** (`S3-005`) — the build fails on both missing *and* extra routes, not just missing ones. | #142 |
| K-04 | **Heading-order fix** — collection grids had an h1 → h3 skip across all 33 pages (BookCard titles are h3). A localized sr-only h2 was added and locked by `tests/seo/a11y.test.mjs`. | #142 |

### Resources

| ID | Item | Evidence |
|----|------|----------|
| R-01 | **Resources modeled as data** — `src/data/resources.ts` holds the 4 printables and 6 articles with stable IDs, localized titles/descriptions and card metadata. | #143 |
| R-02 | **Kind-prefixed IDs** (`article-*` / `download-*`) — the download slug and an article anchor are both `follow-up-activities`, and `relatedResourceIds` is a flat string array, so an unprefixed scheme would resolve a book to the wrong resource. A test asserts the collision still exists so the reason survives copy edits. | #143 |
| R-03 | **`Resources.tsx` consumes the registry** — `TEACHER_DOWNLOADS`, `RESOURCE_META` and six duplicated localized arrays deleted, along with the index-coupling that silently mislabeled cards when order changed. Copy was **moved, not rewritten**: rendered EN/FR/ES pages were byte-identical apart from the JS bundle hash. | #143 |
| R-04 | **`loadResources()`** added to the build projection so scripts and tests read the same source as the catalog. | #143 |

### Architecture reference

| ID | Item | Evidence |
|----|------|----------|
| A-01 | **`ARCHITECTURE_ALIGNMENT.md` + `ADR-001` (cookie-free)** merged after a full re-verification pass against the codebase. | #141 |
| A-02 | **`esbuild` declared as a devDependency.** The projection imports it, but it was reached only as a transitive dependency of Vite (`vite@5.4.21 → esbuild@0.21.5`). A Vite major upgrade or a stricter installer would have dropped it from the resolution path — and a projection load failure is a hard build error by design, so the build would have broken rather than degraded. | #141 |
| A-03 | **Dangling references removed** — 6 of the 7 documents the reference pointed at did not exist. Now split into what is in the repo versus what the sprint specs cite but nobody has written. | #141 |

### Book relationships to activities and resources

| ID | Item | Evidence |
|----|------|----------|
| V-01 | **`activities.data.ts` split out** — `activities.ts` imported `useLanguage`, which pulls in React and react-router-dom, so Node could not load it and `relatedActivityIds` could not be validated. Split browser-free exactly like the catalog, and `loadActivities()` added to the projection. | #150 |
| V-02 | **B-02 written in** — all 20 books carry 3 `relatedActivityIds`, from the owner-approved affinity map (theme → activity category, ×3) plus age-range fit, with any non-overlapping age disqualified outright. | #150 |
| V-03 | **Validation upgraded from "non-empty string" to real existence**, plus a guard that no book recommends an activity outside its age range. The old check would have shipped a typo as a dead link. | #150 |
| V-05 | **"Try an activity" section** on all 20 book pages × 3 languages, prerendered, rendering the B-02 pairs. Games link to their standalone static HTML (not language-prefixed, matching `Activities.tsx`); in-app demos use the localizing `Link`. Card titles are `h3` under the section `h2` — `Activities.tsx` uses `h2` for its own card titles, which would have put a card at the same rank as the heading it belongs to. | #151 |
| V-04 | **B-03 resolved by NOT pairing** — all ten resources were tested for a book-specific hook: zero theme references, zero title references, three generic age mentions. Per-book pairing would manufacture a signal that does not exist, so `relatedResourceIds` stays empty and a **shared strip** renders the same four resources on every book page. A test fails the build if anyone populates the field without revisiting the decision. | #150 |

### Storage adapter (S6-012)

| ID | Item | Evidence |
|----|------|----------|
| ST-01 | **N-01 closed: `src/lib/storage.ts` exists and is load-bearing.** Availability probing, `try/catch` parsing, shape validation via caller-supplied type guards, versioned envelopes, namespaced keys, in-memory fallback, and writes that report failure instead of throwing at a click handler. | #157 |
| ST-02 | **Two tiers, because "namespace all keys" would have broken production.** All 12 standalone games write `readingProgress` directly (injected by `scripts/patch-games.mjs`), and `public/games/i18n.js` reads `preferredLanguage`. Namespacing either would not fail loudly — the games would keep writing the old key while the SPA read the new one, silently orphaning every "Mark Completed". SHARED keys stay raw and unversioned by design; the SPA's own future state uses the namespaced tier. | #157 |
| ST-03 | **`progress.ts` routed through the adapter** — zero raw `localStorage` calls left in it, including the two read-only legacy stores (reading tracker, adventure journal), which now go through an explicit typed `LegacyKey` union so a typo is a compile error rather than a silent no-op. | #157 |
| ST-04 | **The cross-boundary contract is now tested.** A suite compares the key the SPA reads against the key each of the 12 games writes, and against the injector in `scripts/patch-games.mjs`. A rename fails CI instead of orphaning progress. | #157 |
| ST-05 | **S6-016 failure modes covered for real** — denied access, quota exhaustion, malformed JSON, wrong shape, wrong version, missing `window`, non-serializable values. The adapter is compiled and driven against a fake `localStorage` rather than asserted about in prose. `clearNamespace` is proven not to touch shared or unrelated origin data. | #157 |
| ST-06 | **`npm test` now globs `tests/storage/` too.** It only globbed `tests/funnel/`, so a new suite there would have been written, passed locally, and never run in CI. | #157 |

### Discussion prompts

| ID | Item | Evidence |
|----|------|----------|
| P-01 | **E-01 closed: 60 prompts approved as-is and written in.** Three per book (`before` / `during` / `after`), 180 localized strings, all 20 books. | #154 |
| P-04 | **Locked by two tests** — every prompt string must appear in that language's prerendered HTML, no page may leak another language's prompt, and the stage labels must be localized rather than English everywhere. | #155 |
| P-02 | **Validated before approval, not after.** The draft was applied to a scratch copy, typechecked and run through the real relationship suite, then reverted, so sign-off held no surprises. Checked mechanically for empty strings, em dashes in the English, duplicates across the whole set, missing end punctuation, over-long prompts and id drift. | #154 |
| P-03 | **"Talk about it together" section** on all 20 book pages × 3 languages, prerendered. Addressed to the grown-up reading aloud, with localized stage labels (Before reading / While you read / After reading). Placed first, above the sections that point away from the book. | #155 |

### Age model

| ID | Item | Evidence |
|----|------|----------|
| A-04 | **D-01 fixed: `/activities` now uses exact-age containment**, the same model as `/books`. The retired `3-5 / 6-8 / 9+` bands matched by OVERLAP, so filtering for a 3-year-old surfaced 8 activities that do not suit one, including a 5–9 spelling bee. Exact age 3 now returns 5 activities instead of 13. | #153 |
| A-05 | **`matchesAgeFilter` deleted**, not left dormant. It was the last implementation of the retired model and its only caller was `/activities`; keeping it would have left two contradictory answers to "does this item suit this age?". | #153 |
| A-06 | **Both pages locked by one test** — the retired band labels in all three languages must not reappear on either `/books` or `/activities`, and the exact-age chips must be present. | #153 |

### Standalone games

| ID | Item | Evidence |
|----|------|----------|
| G-01 | **C6-04 fixed: games follow the reader's language.** The chrome was always translatable — `public/games/i18n.js` and 12 games already had it — but it resolved language from `localStorage.preferredLanguage`, which the SPA writes **only** when someone clicks the language switcher. A reader arriving at `/fr/books/...` from a search result had nothing stored, so every game opened in English. The language now travels in `?lang=`, read ahead of storage, so it also survives private mode and blocked storage. | #152 |
| G-02 | **Games no longer dump readers into the English site.** Every game's nav linked to `/`, `/books`, `/activities`, `/resources`, `/about` unprefixed — arguably worse than the chrome language, since it silently ended the reader's French session. `i18n.js` now rewrites internal links to the active prefix and localizes the five nav labels, in one place rather than twelve HTML files. `/games/*` links stay unprefixed by design. | #152 |
| G-03 | **`src/lib/gameUrl.ts`** — all four call sites (book pages, `/activities`, `/search`, `/profile`) build game URLs through one helper so they cannot drift apart. | #152 |
| G-04 | **Covered by real tests, not greps** — `tests/funnel/games-i18n.test.mjs` evaluates the actual `i18n.js` against a DOM stub: parameter precedence, rejection of unknown/junk language values, blocked storage, link prefixing, no double-prefixing, and nav label localization. The games are vanilla HTML outside Vite, so nothing else covered them at all. | #152 |

### Related-books UI (Sprint 6)

| ID | Item | Evidence |
|----|------|----------|
| U-01 | **B-04 decided: top up from the theme tier.** Two tiers, editorial first, theme matches filling only the seats the editorial tier left empty. A theme match can never displace or reorder a signed-off pair. No third tier: age-band-only filler stays rejected, so a book with too few thematic neighbours renders a short row. | #147 |
| U-02 | **`src/data/relatedBooks.ts`** — browser-free, pure, deterministic ranking, loaded by the UI and by CI through the same projection, so an asserted rule is a rendered rule. | #147 |
| U-03 | **"You might also like" section** on all 20 book pages × 3 languages, prerendered, using the existing `BookCard`. Localized heading is an `h2` above the h3 card titles. | #147 |
| U-04 | **Locked by tests** — 5 ranking tests (tier order, no self-reference, theme-only top-up, non-empty, deterministic) and 2 a11y tests over the prerendered book pages. | #147 |
| U-06 | **B-01 closed by two editorial swaps, limit kept at 3.** `sparrow-saved-forest`: `crooked-little-apple-tree` → `butterfly-effect` (kindness). `emperors-true-treasure`: `little-boats-big-wish` → `fig-trees-secret` (gratitude). Both like-for-like on shared theme; each displaced the best-covered entry so the change costs the least discovery. Every book now has an incoming link, and a test keeps it that way. | #149 |
| U-07 | **`RELATED_BOOKS_LIMIT` stays 3 — decided, not open.** Raising it was measured, not assumed: limit 4 fixes only one of the two orphans (72 links, 14 mechanical), limit 5 fixes both (86 links, 28 mechanical). Inflating every row across 20 books × 3 languages to patch two books is a bad trade, and 3 fills the `lg:grid-cols-3` row exactly while keeping every card a signed-off pick. | #149 |
| U-05 | **The top-up adds nothing today, by arithmetic** — 58 editorial slots, **0 theme top-ups**. The only two short lists (`leo-and-the-wolf`, `fig-trees-secret`) are short *because* their editorial pairs already exhausted their entire theme pool. The rule is a live safety net for future catalog edits, not a fix for the current data. Raising `RELATED_BOOKS_LIMIT` above 3 is what would make the theme tier visible. | #147 |

### Relationships

| ID | Item | Evidence |
|----|------|----------|
| L-01 | **Canonical forward relationship fields** — `relatedBookIds`, `relatedActivityIds`, `relatedResourceIds` use canonical IDs, never route slugs. (Owner correction during sign-off: `relatedActivitySlugs` → `relatedActivityIds`, because a route slug is a URL concern and identity is a content concern.) | #142 |
| L-02 | **`discussionQuestions` contract** — `stage` (`before`/`during`/`after`) plus a localized `prompt`, with CI enforcing known stages, EN/FR/ES parity and no duplicates. Population is intentionally empty; see E-02. | #143 |
| L-03 | **`relatedBookIds` populated from owner-approved pairs** — 58 forward links across 20 books (min 2, max 3). Age-band-only matches rejected as filler catalog-wide: every stored pair shares at least one theme. | #145 |
| L-04 | **Singleton themes kept** — `leo-and-the-wolf` (`honesty`) and `fig-trees-secret` (`heritage`) keep their themes rather than being re-themed to widen the candidate pool, so they carry two related books each. Both stay below the two-book collection minimum by design. | #145 |
| L-05 | **`relatedResourceIds` validation flipped** from "must stay empty" to "must resolve to a real resource". | #143 |

### Sprint 1 — homepage and conversion

| ID | Item | Evidence |
|----|------|----------|
| S1-a | Homepage value proposition, CTA hierarchy, IA reorder and analytics instrumentation. | #137 |
| S1-b | Navigation: Profile → **My Reading**; redundant Home item dropped. | #139 |
| S1-c | Testimonial section (`S1-010`) and free-bundle supporting CTA. | #140 |
| S1-d | Catalog content inventory + multilingual QA checklist. | #138 |

### Testing and build guards

| ID | Item | Evidence |
|----|------|----------|
| Q-01 | **10 funnel suites / 56 tests** and **2 SEO suites / 170 tests** green on `main`. | #142, #143, #145 |
| Q-02 | Guards that fail the build loudly: landing-page magnets, book pages in the sitemap, collection eligibility, bidirectional route parity, prerender readiness. | #142 |
| Q-03 | `tests/seo/a11y.test.mjs` locks collection heading order permanently. | #142 |

---

## B. Sprint 6 gate — all four resolved

B-01 (no incoming link) fixed by two editorial swaps · B-02 (`relatedActivityIds`) written
in and rendered · B-03 (`relatedResourceIds`) resolved by choosing a shared strip over
fabricated per-book pairing · B-04 (short-list fallback) decided as the theme-tier top-up.
The decision record lives in `backlog.md`; the shipped work is in §A above.

---

## C. Open — Sprint 6 remainder

| ID | Item | Type | Notes |
|----|------|------|-------|
| C6-02 | **Richer collection intros** — collection pages currently carry a short localized intro only. | open | Queued, not specified. |

---

## D. Open — technical debt and deferred

| ID | Item | Type | Notes |
|----|------|------|-------|
| D-02 | **`react-router` moderate advisory** — the only offered fix is a breaking v7 major. Deliberately deferred rather than force-upgraded mid-programme. | deferred | Re-evaluate when a v6 patch exists or at a natural upgrade window. |
| D-03 | **12 lint warnings**, all `react-refresh/only-export-components`, 0 errors. Pre-existing and stable. | deferred | Cosmetic; touching them churns component files for no runtime benefit. |
| D-05 | ✅ **RESOLVED** — the six Sprint 3-8 specifications are in `docs/sprints/` (126 IDs) with a verified-subset traceability index. Tracking can now cite real IDs. | shipped | #156 |

---

## D2. Newly visible from the specs

| ID | Item | Type | Notes |
|----|------|------|-------|
| N-02 | **S6-007 implements 2 of 5 ranking reasons.** `relatedBooks.ts` covers `editorial` and `theme`; `related`, `age` and `preference` need the preferences model that does not exist yet. | open | Deliberate: the missing reasons depend on N-01. |
| N-03 | **S3-007 breadcrumbs are not generalized.** `BreadcrumbList` markup is inline on two pages; the spec asks for a shared component with localized labels and stable URL segments. | open | Small, and it removes duplicated JSON-LD. |
| N-04 | **S3-018/019/020 have no baseline artifacts.** No Search Console baseline, route/metadata inventory or post-deploy crawl record exists, and Sprint 3's definition of done requires them. | open | Owner/data task more than a code task. |

---

## E. Decided — not doing

Recorded so they do not get quietly re-opened.

- **Do not auto-derive `relatedBookIds` from shared themes.** Sprint 6 ranks "editorial
  relation" and "matched theme" as separate tiers; deriving one from the other collapses them
  and fakes curation. The 2026-09-08 pairs are editorial *because* they were signed off, not
  because they were ranked. A future regeneration goes back through approval.
- **Do not pad related-books lists with age-band-only matches.** A book with no thematic match
  carries a shorter list.
- **Do not re-theme `honesty` or `heritage`** to widen candidate pools or unlock collection
  pages. Both stay below the two-book minimum by design.
- **Do not persist reverse indexes** in source. They are derived at build time; persisting them
  guarantees drift.
- **Do not fall back to source parsing** if the catalog projection fails. A hard build error is
  the point.
