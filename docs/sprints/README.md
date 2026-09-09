# Sprint Technical Implementation Specifications

The six specifications that govern Sprints 3 to 8. They were previously supplied as
attachments and lived outside the repository, which meant `docs/PUNCH_LIST.md` could only
be keyed to shipped deliverables and PR numbers rather than to spec IDs anyone could look
up. That gap was tracked as D-05 and is closed by their being here.

| Sprint | Scope | IDs |
|---|---|---|
| [3](SPRINT_3_TECHNICAL_IMPLEMENTATION.md) | SEO, multilingual discoverability, organic growth | S3-001 … S3-020 |
| [4](SPRINT_4_TECHNICAL_IMPLEMENTATION.md) | Performance, accessibility, engagement, retention | S4-001 … S4-020 |
| [5](SPRINT_5_TECHNICAL_IMPLEMENTATION.md) | Monetization, growth, product intelligence | S5-001 … S5-024 |
| [6](SPRINT_6_TECHNICAL_IMPLEMENTATION.md) | Personalization and family reading experience | S6-001 … S6-018 |
| [7](SPRINT_7_TECHNICAL_IMPLEMENTATION.md) | Content and learning ecosystem | S7-001 … S7-020 |
| [8](SPRINT_8_TECHNICAL_IMPLEMENTATION.md) | Platform, infrastructure, scale (decision sprint) | S8-001 … S8-024 — complete, readiness assessment approved by the owner 2026-09-10 |

**126 distinct IDs.** Committed verbatim as received; no edits, so they remain the
authoritative brief rather than a paraphrase of it.

Each spec opens with a **Repository Verification Gate** requiring live paths to be checked
before implementation. That gate has repeatedly earned its place: the taxonomy work found
`books.ts` was not loadable by Node, and Sprint 6's `relatedActivityIds` could not be
validated until `activities.data.ts` was split out. Check the paths; do not trust them.

---

## Traceability — verified subset only

This table lists **only IDs whose status was checked against the code**, with the check
that established it. It is a partial map, not an audit of all 126.

Everything not listed is **not assessed**, which is different from not started: several
Sprint 3 SEO items (canonicals, hreflang, robots, JSON-LD, the SEO suite) demonstrably
exist from earlier sessions but have not been traced to their IDs.

| ID | Status | Evidence |
|---|---|---|
| S3-004 | ✅ shipped | `scripts/gen-sitemap.mjs` reads the projection; regex source parsing removed from the build path (#142) |
| S3-005 | ✅ shipped | `tests/funnel/build-guards.test.mjs` fails on extra routes as well as missing ones (#142) |
| S3-008 | ✅ shipped | `relatedBookIds` / `relatedActivityIds` / `relatedResourceIds` on the catalog, all reference-validated (#142, #145, #150) |
| S3-016 | ✅ shipped | `THEME_COLLECTION_MINIMUM` enforced in three independent places: page 404, sitemap derivation, prerender guard (#142) |
| S3-007 | ✅ shipped | `src/components/Breadcrumbs.tsx` — one component and one `breadcrumbSchema()` helper used by book pages and every collection; localized labels, fixed English URL segments (#164). Previously partial: two inline copies that had already drifted |
| S4-012 | ✅ shipped | `src/components/RelatedActivities.tsx` renders book → activity from stable IDs (#151) |
| S6-007 | ✅ shipped | `src/lib/recommendations.ts` implements all five ranking reasons (`editorial`, `related`, `theme`, `age`, `preference`); `relatedBooks.ts` is a policy over it (#160). Previously partial: 2 of 5 |
| S6-008 | ✅ shipped | activities recommended from structured book relationships (#150, #151) |
| S7-001 | ✅ shipped | `src/data/collections.ts` — collection RECORDS as the editorial layer (order, featured activities, resources, overrides, editorial kinds) over derived membership; `collectionProblems()` gates publication; 14 records live (#169). Earlier row credited the derived theme pages only |
| S7-004 | ✅ shipped | Book + activity bundles are the existing `relatedActivityIds` on books (forward) and `booksByActivityId` (derived reverse): rendered as "Try an activity" on book pages and "Continue" on activities, no record copied. Validated in `relationships.test.mjs` and the content inventory |
| S7-005 | ✅ shipped | `discussionQuestions` modeled (#143), 60 prompts written in (#154), rendered (#155) |
| S6-001 … S6-006 · S6-009 · S6-010 · S6-013 … S6-018 | ✅ shipped | Sprint 6 slices 1–4 (#159, #160, #161, #162); S6-011 is ADR-002, proposed and awaiting signature |
| S7-003 · S7-010 · S7-011 | ✅ shipped | `/journeys` + `/journeys/<id>` on `src/data/journeys.ts` (3 published journeys, EN/FR/ES), build-time validation, local progress through the storage adapter with read-time pruning, saved journeys in the personalization envelope (#168) |
| S7-006 | ✅ shipped | The six parent guides on `/resources` carry `relatedThemeIds` + `relatedResourceIds`; `GuideLinks` derives the stories (first three across the themes), links the public theme collections and the paired printables, EN/FR/ES (#174) |
| S7-007 | ✅ shipped | Three `educator` collection records (feelings, bilingual read-alouds, STEM), audience-labeled, validated, routed through the collections gate, linked from the teachers section of `/resources` (#171) |
| S7-008 | ✅ shipped | Learning packs as CURATED GROUPS OF EXISTING DOWNLOADS (§14 decided): `src/data/learningPacks.ts` records (audience, ages, ordered download ids, accompanying collections, EN/FR/ES copy) validated by `learningPackProblems`; each published pack is a generated lead magnet at `/free/<id>` delivering every file as a stable `/download/` link; listed on `/resources#packs` and on the collections it accompanies; print stylesheet (#172) |
| S7-009 | ✅ shipped | `src/data/contentIndex.ts` derives every reverse relationship; nothing reverse is persisted (#142) |
| S7-012 | ✅ shipped | Three `seasonal` collection records with a RECURRING yearly `window` (MM-DD, inclusive, wraps year end). Route exists all year; inside the window it shows its books and is in the sitemap, outside it renders a localized empty state with the next opening date, `noindex`, and leaves the sitemap. Evaluated with the visitor's clock; crawlers catch up at the next deploy (the build logs each window's state). `/books` spotlights open seasons (#173) |
| S7-014 | ✅ shipped | `scripts/gen-content-inventory.mjs` writes `docs/content-inventory.md` (deterministic: totals, every collection/journey/pack/guide, downloads on disk) and `npm run check:content` fails CI on invalid published records, broken or draft references, duplicate ids, missing download files or accessible names (#174) |
| S7-015 | ✅ shipped | `src/lib/searchIndex.ts` (browser-free): one record per book, activity, public collection, published journey and resource with localized title/summary/terms, stable route; search runs within the active locale with diacritic folding, every-word matching, title-first ranking, content-type filters (`?type=`), seasonal windows honoured at query time. `/search` renders grouped results with type labels, aria-pressed filter buttons and a polite result count (#175) |
| S7-016 | ✅ shipped | Events by stable id: `Journey Start`, `Journey Step`, `Journey Complete`, `Journey Saved`, `Magnet Download` (packs by pack id), `Continue Journey`, `Search` (filter + count, never the query text). Contract test locks names and keys (#175) |
| S7-017 | ✅ shipped | Permanent cookie-free + storage-denied suite now covers the ecosystem: search with filters, educator/seasonal collections, journeys to completion, pack delivery (endpoint stubbed), print media, activity-to-book continuation. Zero cookies asserted after the whole flow (#176) |
| S7-018 | ✅ shipped | axe gate extended to search results, journeys, educator and seasonal (open/closed) collections, pack landing, EN + FR; keyboard tests for journey steps (Space/Enter, aria-pressed, polite announcement) and search filters; print emulation tests; two contrast defects found and fixed in #175 (#176) |
| S7-019 | ✅ shipped | `tests/seo/linking.test.mjs`: no orphan indexable route (inbound link from another page in its language), no thin page (min words or two book links), collections/journeys carry BreadcrumbList + ItemList whose URLs are real prerendered routes; canonical/hreflang/OG/robots already per route (#176) |
| S7-020 | ✅ audited | `docs/testing/SPRINT_7_RELEASE_AUDIT.md`: 45-route sweep, 192/192 sitemap URLs, headers, downloads and pack aliases, `check:content` 0 errors, smoke 44 passed and the client-side suites 68 passed against production (`npm run test:prod-audit`). Signed inventory; **release accepted by the owner 2026-09-09** (#179) |
| S7-013 | ✅ shipped | EN/FR/ES parity is CI-enforced for books, resources, prompts, journeys (#168) and collection records (#169) — every published ecosystem content type now exists as a validated record |
| S3-018 · S3-019 · S3-020 | ⬜ not started | no Search Console baseline artifact, route/metadata inventory or post-deploy crawl record in the repo |
| S4-010 · S4-011 | ⬜ not started | no `ContinueJourney` component or `src/lib/journey.ts` |
| S5-008 … S5-011 | ⬜ not started | no `src/lib/experiments.ts`, experiment registry or governance docs |
| S6-012 | ✅ shipped | `src/lib/storage.ts` — availability, validation, versioned envelopes, namespaced/shared/legacy tiers; every `src/` caller routed through it and enforced by test (#157, #158). Previously not started |
| S7-002 | ✅ shipped | `/collections/ages-3-5`, `ages-6-7`, `ages-8-9` × 3 languages on the shared `CollectionPage`, primary-fit placement, same eligibility gate and localized-intro requirement as themes (#164) |
| S8-001 | ✅ shipped | `docs/platform/BASELINE_2026-09.md` (measured: content counts, build/prerender/deploy timings, output weight, search latency at 1×/10×/50×, editorial throughput, error visibility, dependencies, coverage) and `docs/platform/BOTTLENECK_REGISTER.md` (11 rows with evidence, verdict, owner). Repeatable via `scripts/bench-build.mjs`, `scripts/bench-search.mjs` (#180) |
| S8-002 · S8-003 · S8-007 · S8-008 | ✅ decided | ADR-003 catalog stays static, ADR-004 no CMS (records + validators + inventory are the workflow; an authoring aid is pre-approved for a second editor), ADR-005 client-side search (lazy index chunk pre-approved past 100 KB), ADR-006 no accounts (export/import of the local envelope is the pre-approved continuity answer; S8-009/010 not started). Each ADR names the thresholds that reopen it (#181) |
| S8-005 | ✅ shipped | `docs/platform/MEDIA_DELIVERY_STRATEGY.md`: classes, rules (responsive attrs, formats, caching, downloads, campaign assets out of page budgets), `tests/seo/media.test.mjs` integrity tests (#181) |
| S8-021 | ✅ shipped | `budgets.json` + `npm run check:budgets` in CI after the build (JS entry/chunk/total gzip, CSS, HTML per route, page images, campaign assets, PDFs, route minimum); Lighthouse/LCP/CLS/INP and deploy-time budgets reviewed per release; `docs/platform/PERFORMANCE_BUDGET_POLICY.md` (#181) |
| S8-006 | ✅ shipped | Build benchmark repeatable (#180); prerender is 98% of build and CPU-bound (a 4/8-page pool measured 151/137 s vs 154 s, not kept). Determinism fixed: the prerender sets `window.__PRERENDERING__` and bingo/puzzles render a fixed first state, so two builds are byte-identical (#181) |
| S8-011 · S8-012 | ✅ shipped | `.github/workflows/post-deploy.yml` (verify the served commit, smoke on every push to main and every 6 h, full production audit daily, artifacts kept 90 days); `src/lib/errorReport.ts` beacon with pure redaction (`errorRedact.ts`, unit-tested): error class + route pattern only. Standard: `docs/platform/MONITORING_AND_ERROR_REPORTING_STANDARD.md` (#182) |
| S8-013 | ✅ reviewed | `docs/platform/SECURITY_REVIEW_2026-09.md` with threat model (pipeline, content ingestion, functions) and `tests/seo/security.test.mjs` (noopener, no mixed content, no inline handlers on React pages, external hosts = inventory, headers). Open: R-01 branch protection (owner), R-03 preview secrets scope (owner) (#182) |
| S8-015 | ✅ exercised | `docs/runbooks/DISASTER_RECOVERY.md`: RPO/RTO per asset, procedures, timed drill (recreate from source 183 s; content damage detected and restored; revert 1 s). Netlify republish left to the owner (#182) |
| S8-016 | ✅ shipped | `docs/platform/ENVIRONMENT_MATRIX.md`; `npm run check:secrets` scans dist in CI; gap recorded: previews use production function secrets (#182) |
| S8-017 · S8-018 | ✅ shipped | `docs/platform/RELEASE_GATES.md` maps every §9 gate to its implementation; post-deploy checks automated with retained results (#182) |
| S8-023 | ✅ shipped | `docs/platform/EXTERNAL_DATA_FLOWS.md`: every browser and function flow with purpose, fields, recipient, retention, consent basis, failure behavior; enforced by CSP and the external-host test (#182) |
| S8-014 | ✅ shipped | Non-breaking `npm audit fix` (13 → 4, #180); `docs/platform/DEPENDENCY_POLICY.md`, `.github/dependabot.yml` (grouped weekly minors, monthly majors, no auto-merge), `audit-allowlist.json` + `npm run check:audit` in CI with review dates (#182) |
| S8-019 | ✅ shipped | `src/lib/locales.ts` is the one locale registry (codes, prefixes, labels, Intl/OG locales, parametric path helpers); App, Seo, speech, Intl formatting, search, contentIndex and every build script derive from it; `tests/funnel/locales.test.mjs` proves a temporary `pt` locale needs only an entry and scans pages/components/demos for literals; `docs/platform/ADDING_A_LANGUAGE.md` (#183) |
| S8-020 | ✅ shipped | `docs/platform/ACCESSIBILITY_GOVERNANCE.md`: owner, regression tests per PR, manual cadence, release checklist entry; S4-05 manual pass scheduled for the sign-off (#183) |
| S8-022 | ✅ permanent | cookie-free, storage-denied and third-party-blocked suites run on every PR and daily against production (#176, #182) |
| S8-024 | ✅ approved | `docs/platform/PLATFORM_READINESS_ASSESSMENT.md`: go/no-go statements, decisions, risks R-01 to R-08, capacity thresholds, roadmap; approved by the owner 2026-09-10 (#190) |
| S8-004 · S8-009 · S8-010 | ⬜ not applicable | No migration, no accounts approved (ADR-003, ADR-006), so no migration plan, account migration or auth security review is required |

## What this changes about the tracking
`docs/PUNCH_LIST.md` remains the record of what shipped and what was decided against.
It can now cite these IDs instead of describing deliverables, and a full traceability audit
across all 126 is possible where it previously was not.

