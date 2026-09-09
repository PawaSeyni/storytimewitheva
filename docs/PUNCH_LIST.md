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

### Sprint 7 — learning packs (S7-008)

| ID | Item | Evidence |
|----|------|----------|
| LP-01 | **Decision (spec §14)**: a learning pack is a *curated group of existing downloads*, not a new file and not a zip. Rationale: the spec says "bundle existing printables"; a zip fails the mobile parent (the bilingual bundle already made that call); a generated PDF would duplicate content that exists. Records in `src/data/learningPacks.ts`. | #172 |
| LP-02 | **Two packs live**: *Classroom printables pack* (educators; guide + follow-up sheets + flashcards; accompanies the three classroom collections) and *Home reading routine pack* (families; routine chart + guide + follow-up sheets; accompanies the 3-5 and 6-7 age collections). | #172 |
| LP-03 | **A pack is a lead magnet, generated, not hand-copied**: `EmailSignup` builds one offer per published pack; `/free/<pack>` is the gated page; the success screen lists every file as a named link. Item links are the stable `/download/<slug>?lang=` URLs, so a rebuilt PDF cannot rot a pack. `/download/<pack>` 301s to the gated page like the bilingual bundle. | #172 |
| LP-04 | **Clear metadata**: audience label, age bands, "what is inside" list and the collections it goes with, on `/resources#packs` and on each accompanying collection page. Validator rejects non-download items, unknown ids, fewer than two items, duplicate items, colliding ids (magnets, download slugs, collections) and missing locales. | #172 |
| LP-05 | **Print behaviour (spec §10)**: first `@media print` stylesheet: site chrome (`data-print="chrome"`), signup and dialogs removed, shadows off, scroll boxes unclipped, black links. Breadcrumbs deliberately stay. Locked by a built-CSS test and a Playwright print-emulation test. | #172 |
| LP-06 | **No product shot for the pack landing pages.** LP-001 requires a preview per magnet; packs ship with none because there is no art. Needs a design pass (a composite of the included printables would do). | open |
| LP-07 | **Copy contradiction found, not fixed**: the teachers section of `/resources` says "Download, print, and share, no sign-up needed" while every download card and pack goes through the email gate. One of the two must change. | open |
| LP-08 | **Registry gap**: `bilingual-starter-kit` (20-page trilingual kit) is a real printable served by the bundle but absent from `resources.ts`, so no pack can include it. Add it as `download-bilingual-starter-kit` if a third pack should carry it. | open |
| LP-09 | **Copy to review**: two pack titles and descriptions in EN/FR/ES, and the pack bullets and CTAs in `EmailSignup.tsx`. | open |

### Sprint 7 — educator collections (S7-007)

| ID | Item | Evidence |
|----|------|----------|
| EC-01 | **Three classroom collections live** as `educator` records: *Feelings in the classroom* (SEL), *Bilingual read-alouds*, *STEM stories for curious classrooms*. Explicit ordered `bookIds`, own trilingual copy, featured activities validated to relate to a member book, and the existing printables as resources. Routed through the same `/collections/` gate. | #171 |
| EC-02 | **Audience labeling**: an "For teachers and educators" eyebrow above the title in EN/FR/ES, a classroom SEO suffix, and links from the "For Teachers" section of `/resources`, so no educator collection is an orphan. Locked by the prerender suite. | #171 |
| EC-03 | **A structural rule added to the tests**: every member book must carry at least one of the collection's claimed theme facets, so a classroom set cannot drift into unrelated titles. | #171 |
| EC-04 | **S7-008 decided and shipped** as curated groups of existing downloads, see LP-01 below. | #172 |
| EC-05 | **Copy to review**: three titles and descriptions, EN/FR/ES, in `collections.ts`. | open |

### Sprint 7 — collections as records (S7-001 · S7-013)

| ID | Item | Evidence |
|----|------|----------|
| CR-01 | **Records hold only what cannot be derived.** For theme/age kinds membership stays derived from the taxonomy and the validator *rejects* a record that carries `bookIds`; a record may reorder (`bookOrder`, validated subset), feature activities, attach resources, or override the intro. Storing membership twice was rejected on purpose — the spec forbids duplicated relationship arrays and a copy would drift. | #169 |
| CR-02 | **Fourteen records live** (11 themes + 3 age bands), each featuring the activities its member books reference most. Generated from relationship frequency and committed as data an editor can change; the validator requires every featured activity to be related to at least one member book, so the choice is editorial *within a meaningful set*. | #169 |
| CR-03 | **Editorial kinds are modeled and routed** (`educator`, `seasonal`): explicit validated `bookIds`, own title/description in three languages, the two-book minimum, and an id that cannot collide with a taxonomy id. None exist yet; S7-007 and S7-012 become "add records". | #169 |
| CR-04 | **Collection pages gain "Activities that go with these books"** (and a resources block when a record has any), localized, with the game-vs-demo link form the rest of the site uses. Locked by the prerender suite in three languages. | #169 |
| CR-05 | **Not done, stated:** no record overrides the taxonomy intro yet, so C6-02 (richer intros) now has a home but no copy; no `bookOrder` is set, so display order remains catalog order pending editorial choice. | open |

### Sprint 7 — reading journeys (S7-003 · S7-010 · S7-011)

| ID | Item | Evidence |
|----|------|----------|
| RJ-01 | **Three published journeys** in `src/data/journeys.ts`: kindness pair, patience trio, sky/curiosity cluster. Each: book → its own discussion prompts → a related activity → a resource for the grown-up (optional) → the next book. Every step is a reference to a stable id; no catalog content is duplicated. | #168 |
| RJ-02 | **Publication is gated at build time.** `journeyProblems()` checks ids, EN/FR/ES parity, theme/age membership, reference existence, step namespacing, duplicate steps, "book first", "a continuation exists", and that a discussion step names a book that actually has prompts. A published journey with any problem fails the build. The validator is itself tested against broken records. | #168 |
| RJ-03 | **S7-010 progress**: one namespaced, versioned envelope per journey through the storage adapter; step ids removed from a journey are dropped on read; works in memory under blocked storage (browser-tested). **S7-011**: saved journeys are ids in the personalization envelope, counted on the transparency panel. | #168 |
| RJ-04 | **Accessibility (§10)**: progress stated in text ("Step 2 of 5", "1 of 5 steps done"), completion controls are real buttons with `aria-pressed` and per-step accessible names, changes announced through a polite live region. Locked by the prerender suite in all three languages. | #168 |
| RJ-05 | **Routes, sitemap and prerender guard** extended with the same bidirectional parity as collections; `/journeys` is linked from `/books`, and book pages show "Part of a reading journey" from the derived reverse index, so no journey is an orphan. Route vocabulary recorded in the alignment document. | #168 |
| RJ-06 | ✅ **APPROVED 2026-09-09** — the three journeys' titles and descriptions (EN/FR/ES) approved as-is. Recorded on the content file. | #170 |

### Sprint 4 — continue the journey (S4-010 · S4-011)

| ID | Item | Evidence |
|----|------|----------|
| CJ-01 | **`src/lib/journey.ts`** — browser-free, pure, deterministic. Resolves the first valid next step in the spec's fixed priority (related activity → related book → related resource → browse all), checking every candidate against the live registries so it can never emit a broken link, and returning `null` when nothing resolves so the component renders nothing. | #166 |
| CJ-02 | **S4-011: no activity dead-ends.** Activity pages carried only "← Back to Activities". They now continue to the first book that references them (the derived reverse relation, `booksByActivityId`), or to the catalog when none does. | #166 |
| CJ-03 | **Deliberately not placed on book pages.** They already carry three continuation sections (related books, activities, resources); a fourth CTA would be noise. The component is reusable and the resolver covers all three source types. | #166 |
| CJ-04 | ✅ **RESOLVED** — every game now carries a continuation block before its footer, injected by `patch-games.mjs` and resolved by the **same** `journey.ts` the activity pages use. 8 games continue to the first book that references them; the 4 unreferenced drills (`counting-numbers`, `matching`, `sentence-builder`, `spelling-bee`) fall back to the catalog, honestly. Labels come from `i18n.js` and the href is localized by the same link rewriter as the nav. A test compares every baked block to today's resolver, so a relationship change without `npm run patch:games` fails CI instead of drifting. | #167 |
| CJ-05 | Analytics: one event, `Continue Journey`, on the typed allowlist with placement, destination type, reason tier and the target id. The contract test covers the new call site. | #166 |

### Sprint 7 — age-band collections (S7-002) and shared breadcrumbs (S3-007)

| ID | Item | Evidence |
|----|------|----------|
| AC-01 | **Three age collections live** — `/collections/ages-3-5`, `ages-6-7`, `ages-8-9` in EN/FR/ES, placed by primary fit so the three pages partition the catalog (4 / 10 / 6, no overlap, no gap — asserted). | #164 |
| AC-02 | **Same gate as themes.** Minimum-book count and a unique localized intro per band, enforced in the page, the sitemap and the prerender guard from ONE list (`collectionRouteIds`), so the three cannot disagree. Band ids (`ages-N-M`) cannot collide with theme ids. | #164 |
| AC-03 | **One `CollectionPage`, one route.** `/collections/:collectionId` resolves theme or band; `ThemeCollection.tsx` is deleted rather than duplicated. The theme pages' rendered HTML was captured before the refactor and compared after. | #164 |
| AC-04 | **Age-band intros are new product copy** (`taxonomy.ts`), describing the reading stage rather than the child. Flagged for editorial review; easy to change in one place. | #164 |
| AC-05 | **`docs/sprints/README.md` corrected** — it still claimed `storage.ts` did not exist and S6-007 had 2 of 5 reasons; both shipped days ago. | #164 |

### Sprint 6 — decision record, permanent suites, audit (S6-011 · S6-015 · S6-016 · S6-017 · S6-018)

| ID | Item | Evidence |
|----|------|----------|
| S4-01 | **S6-011: ADR-002 accepted and signed 2026-09-09** (option 1, local-only; #165). Compares local-only, optional adult accounts, and local-first sync on user value, privacy, cost, lock-in and reversibility; recommends local-only for Sprints 6–7 with an explicit evidence threshold for reopening at Sprint 8 (S8-008). Does not authorize account code. | #162 |
| S4-02 | **S6-015/016: permanent cookie-free + storage-failure suite** in the CI `local` project. Asserts zero cookies on `context.cookies()` after every core flow, and that every route and control survives `localStorage` **throwing** — injected for real, not simulated by prose. Also covers a malformed envelope and the games' `?lang=` path. | #162 |
| S4-03 | **S6-017: axe-core gate**, 7 routes × EN/FR plus the dashboard with saved state, failing on serious/critical. Its first run found **two real WCAG 1.4.3 contrast failures**: the streak stat (3.58:1) and the FTC "(affiliate)" badge (≈2.2:1 at 70% opacity). Both fixed. The manual name/role/state and keyboard checks are asserted in the same spec. | #162 |
| S4-04 | **S6-018: release audit recorded** in `docs/testing/SPRINT_6_RELEASE_AUDIT.md` — 27/27 routes, 162/162 sitemap URLs, zero cookies, headers present, persistence round-trip in FR on production, no console errors. Every check-tool defect that occurred is written into the report next to the result it affected. Signed by the owner 2026-09-09 (#165). | #162 |
| S4-06 | **A live product bug caught by the new suite and fixed: inverted favorite/save toggles.** `FavoriteButton` and `SaveResourceButton` did `toggle()` then `setState(v => !v)`. `toggle()` dispatches `librarychange` synchronously and the listener already sets state from storage; React batched the local flip after it and inverted the result — the heart showed *not* favorited while storage said favorited, and every later click showed the opposite of storage. Live since #159/#160. **My browser checks missed it because every one read state after a navigation or reload — persistence, never the immediate response.** The spec now asserts the immediate post-click state, three clicks deep. | #162 |
| S4-07 | ✅ **RESOLVED — the "flake" was a product race.** `Form View` fires from an `IntersectionObserver` callback, which is asynchronous; `Form Start` fires on focus. A keyboard user tabbing in, autofill, or a fast tap on an above-the-fold form recorded Start before View in real traffic, and the test reproduced it ~1 in 3. `onFormStart` now fires `Form View` first if the observer has not, keeping exactly-once. Test 4.5 forces the worst case deterministically by stubbing the observer to never fire. The ordering assertion in 4.1 was kept strict, not loosened. | #163 |
| S4-05 | **Not done, stated:** no screen-reader listening pass (VoiceOver/NVDA). The programmatic layer is covered; the listening pass needs a person and is logged as A-M. | open |

### Sprint 6 — dashboard, transparency, analytics (S6-010 · S6-013 · S6-014)

| ID | Item | Evidence |
|----|------|----------|
| DB-01 | **Two regressions from slice 1 fixed.** After #159 moved book status into the envelope, `Profile.tsx` and `BookRecommendations.tsx` still read the legacy arrays nothing writes anymore — so every status set since then was invisible on the profile page — and "Clear all progress" no longer cleared the library. Both were live for the gap between #159 and this PR. | #161 |
| DB-02 | **S6-010: the profile page is the Family Reading Dashboard.** Evolved in place rather than adding a route: `/profile` is already noindex, adult-facing and titled "My Reading" (Sprint 1), and the route vocabulary is fixed. Adds Reading Now and Favorites sections beside Read / Want to Read; stats and top theme now come from the library, with the theme tallied on stable IDs and rendered through taxonomy labels rather than by parsing display copy. | #161 |
| DB-03 | **S6-013: "What this device remembers".** Lists every count the device holds (library states, favorites, recent, saved resources, preferences, activities, journal, tracker), says where it lives and what clearing does, then clears **both** stores behind one control — the Sprint 6 envelope and the legacy game/demo stores — so a parent never has to know there are two. Announces completion through a polite live region without moving focus (§9). Warns when storage is unavailable so nothing will persist. | #161 |
| DB-04 | **S6-014: six events, four dimensions**, added to the typed default-deny allowlist first: `Library Status`, `Favorite`, `Resource Saved`, `Personalized View`, `Recommendation Click`, `Local Data Cleared`, with `status` / `placement` / `reason` / `resource`. Never the library, the preferences bundle, or free text. A personalized view is only counted when the section actually rendered items. | #161 |
| DB-05 | **Analytics contract test (also S4-015).** Every `track()` call site in `src/` is checked against `FunnelEvent` and `ALLOWED_PROP_KEYS`, forbidden keys are rejected by name, and the runtime filter is proven default-deny against an object, an email and a non-primitive value. A typo or an unlisted dimension now fails CI instead of being silently dropped in production. | #161 |
| DB-06 | **`BookRecommendations` was a third ranker that parsed the English theme phrase into word tokens** — the exact text-parsing the taxonomy record forbids. Rebuilt on the Sprint 6 engine with the library as seeds; it now also excludes every engaged book and reports a reason on click. | #161 |
| DB-07 | ✅ **RESOLVED (approved 2026-09-09)** — `Privacy.tsx` now lists everything the browser stores: read / reading / want-to-read, favorites, recently viewed, saved resources, suggestion preferences, completed activities, journal entries, tracker sessions. The edit is the **factual inventory only** — no wording about rights, retention or transmission changed — so the privacy reviewer sees one delimited change. | #165 |

### Sprint 6 — recommendations, preferences, saved resources (S6-005 · S6-007 · S6-009)

| ID | Item | Evidence |
|----|------|----------|
| RC-01 | **N-02 closed: S6-007 implements all five ranking reasons** — `editorial`, `related`, `theme`, `age`, `preference`, weighted so a stronger tier always outranks a weaker stack, with ties broken on catalog order then ID. `related` is the REVERSE relation (books linking *to* the seed), the only other relation the catalog actually has. | #160 |
| RC-02 | **Engine and policy are separate.** `src/lib/recommendations.ts` answers "how do these relate, and why"; `relatedBooks.ts` is now a thin **policy** over it that allows only the editorial and theme tiers. That is what stops a signed-off editorial decision being quietly widened by a change made for another screen. | #160 |
| RC-03 | **The refactor is proven behaviour-preserving.** The book-page output was captured as a golden fixture before the change and is byte-identical after for all 20 books: 58 editorial slots, 0 theme top-ups. | #160 |
| RC-04 | **S6-005 preferences** — optional, explicit, adult-facing, reusing existing theme and age-band IDs. Nothing inferred from browsing; skipping and clearing are first-class. Unknown IDs are dropped on READ so a retired theme cannot poison suggestions forever. | #160 |
| RC-05 | **`preferences.locale` is declared but never written.** Sprint 6 §5 includes it, but language already persists in the shared `preferredLanguage` key because the games read it; a second copy would be two sources of truth for one setting. | #160 |
| RC-06 | **S6-009 saved-resource shelf** — IDs only, resolved against the registry at read time. Save controls sit on the resource cards; the shelf renders nothing when empty rather than nagging. | #160 |
| RC-07 | **Every suggestion shows its reason** ("Same themes as your books", "Matches your preferences"). Personalization a parent can question rather than one they must trust. | #160 |
| RC-08 | **Personalized sections need TWO signals** (`hasEnoughContext`), so a single stray page view cannot replace the default homepage with a thinner personalized one. Verified: zero personalized headings in the prerendered EN/FR/ES homepages and profile. | #160 |

### Sprint 6 — personal library (S6-001 … S6-004)

| ID | Item | Evidence |
|----|------|----------|
| PL-01 | **S6-001: three reading states** (`want-to-read` / `reading` / `read`) on stable IDs, in one versioned envelope in the namespaced tier. | #159 |
| PL-02 | **S6-002: explicit favorites** on the same library entry, not a parallel store — so clearing a status cannot silently un-favorite a book, and un-favoriting a book with no status forgets it entirely rather than leaving an empty entry. | #159 |
| PL-03 | **S6-003 Continue Reading + S6-004 recently explored** — deduplicated, newest-first, capped at 12, with missing catalog IDs pruned at READ time so a retired book cannot leave a dangling entry. | #159 |
| PL-04 | **Book status moved, activity completion did NOT.** Inspecting the games' injected sync block shows they only ever mutate `activitiesCompleted` and merely echo the book arrays. So book status is SPA-owned and moved into the envelope; activity completion stays in the shared key. **No dual-write**: a game echoing a stale copy would eventually overwrite newer values, which is silent data loss. | #159 |
| PL-05 | **Legacy state migrated once**, per Sprint 6 §8: reads the old arrays without modifying them, maps valid IDs, persists immediately, and never re-imports — so clearing a status later is not resurrected on the next load. A book in both legacy arrays becomes `read`, the stronger claim. | #159 |
| PL-06 | **The new-visitor homepage is unchanged.** `ContinueReading` renders nothing without local state, verified against the prerendered HTML in all three languages, so there is no empty personalized shell. | #159 |
| PL-07 | **15 tests** covering migration, the once-only guarantee, all three states, favorite/status independence, caps, dedup, read-time pruning, corrupt envelopes, denied storage, and an assertion that the envelope holds **no catalog content** (no title, cover, description or URL). | #159 |

### Storage adapter (S6-012)

| ID | Item | Evidence |
|----|------|----------|
| ST-01 | **N-01 closed: `src/lib/storage.ts` exists and is load-bearing.** Availability probing, `try/catch` parsing, shape validation via caller-supplied type guards, versioned envelopes, namespaced keys, in-memory fallback, and writes that report failure instead of throwing at a click handler. | #157 |
| ST-02 | **Two tiers, because "namespace all keys" would have broken production.** All 12 standalone games write `readingProgress` directly (injected by `scripts/patch-games.mjs`), and `public/games/i18n.js` reads `preferredLanguage`. Namespacing either would not fail loudly — the games would keep writing the old key while the SPA read the new one, silently orphaning every "Mark Completed". SHARED keys stay raw and unversioned by design; the SPA's own future state uses the namespaced tier. | #157 |
| ST-03 | **`progress.ts` routed through the adapter** — zero raw `localStorage` calls left in it, including the two read-only legacy stores (reading tracker, adventure journal), which now go through an explicit typed `LegacyKey` union so a typo is a compile error rather than a silent no-op. | #157 |
| ST-04 | **The cross-boundary contract is now tested.** A suite compares the key the SPA reads against the key each of the 12 games writes, and against the injector in `scripts/patch-games.mjs`. A rename fails CI instead of orphaning progress. | #157 |
| ST-05 | **S6-016 failure modes covered for real** — denied access, quota exhaustion, malformed JSON, wrong shape, wrong version, missing `window`, non-serializable values. The adapter is compiled and driven against a fake `localStorage` rather than asserted about in prose. `clearNamespace` is proven not to touch shared or unrelated origin data. | #157 |
| ST-07 | **Every remaining caller migrated** — `Pixel.tsx`, `language.tsx` and the three activity demos (adventure journal, coloring gallery, bookmark designer). `src/` now has **zero** raw browser-storage calls outside the adapter. | #158 |
| ST-08 | **Centralization is enforced, not conventional.** A test walks `src/` and fails on any `localStorage` / `sessionStorage` / `indexedDB` call outside `storage.ts`, ignoring comments. Verified by introducing a violation and watching it fail. | #158 |
| ST-09 | **Demo keys kept, deliberately.** The three demo stores hold user-created content (saved artwork, journal entries, a bookmark design) and no game reads them, so they *could* be namespaced — but a rename orphans whatever is already stored, and losing a child's saved drawing is worse than an inconsistent key name. Documented as copy-then-verify if ever migrated. | #158 |
| ST-10 | **A key I invented in #157 was removed.** `readingJournal` was declared in `LEGACY_KEYS` with a comment claiming a game wrote it. Nothing read or wrote it. A test now fails on any declared key that is unused, so dead configuration cannot masquerade as intent. | #158 |
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
| N-05 | ✅ **DECIDED** — cap of 12, no time-based expiry, approved as-is 2026-09-09. Recorded on the constant. | decided | #165 |
| N-03 | ✅ **RESOLVED** — `Breadcrumbs.tsx` + `breadcrumbSchema()`; the two inline copies had drifted (one localized schema URLs, one did not; different separators) and are gone. | shipped | #164 |
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
