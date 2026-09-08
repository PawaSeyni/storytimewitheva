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
| [8](SPRINT_8_TECHNICAL_IMPLEMENTATION.md) | Platform, infrastructure, scale (decision sprint) | S8-001 … S8-024 |

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
| S3-007 | 🟨 partial | `BreadcrumbList` JSON-LD exists on `BookDetail` and `ThemeCollection`, but there is **no shared `Breadcrumbs` component** — the spec asks for it generalized |
| S4-012 | ✅ shipped | `src/components/RelatedActivities.tsx` renders book → activity from stable IDs (#151) |
| S6-007 | 🟨 partial | `src/data/relatedBooks.ts` is deterministic with explainable tiers, but implements **2 of the 5 ranking reasons** in the spec (`editorial`, `theme`; not `related`, `age`, `preference`) |
| S6-008 | ✅ shipped | activities recommended from structured book relationships (#150, #151) |
| S7-001 | ✅ shipped | `src/pages/ThemeCollection.tsx`, 11 eligible themes × 3 languages (#142) |
| S7-005 | ✅ shipped | `discussionQuestions` modeled (#143), 60 prompts written in (#154), rendered (#155) |
| S7-009 | ✅ shipped | `src/data/contentIndex.ts` derives every reverse relationship; nothing reverse is persisted (#142) |
| S7-013 | 🟨 partial | EN/FR/ES parity is CI-enforced for books, resources and prompts, but collections and journeys as *content records* do not exist yet |
| S3-018 · S3-019 · S3-020 | ⬜ not started | no Search Console baseline artifact, route/metadata inventory or post-deploy crawl record in the repo |
| S4-010 · S4-011 | ⬜ not started | no `ContinueJourney` component or `src/lib/journey.ts` |
| S5-008 … S5-011 | ⬜ not started | no `src/lib/experiments.ts`, experiment registry or governance docs |
| S6-012 | ⬜ not started | **no `src/lib/storage.ts`.** Sprint 6 requires all persistence to route through one adapter with try/catch and schema versioning; `src/lib/progress.ts` still writes `localStorage` directly |
| S7-002 | ⬜ not started | age-band collections have no route; only theme collections ship |
| S8-* | ⬜ not started | Sprint 8 is a decision sprint: no ADRs, baselines or Platform Readiness Assessment exist beyond ADR-001 |

## What this changes about the tracking
`docs/PUNCH_LIST.md` remains the record of what shipped and what was decided against.
It can now cite these IDs instead of describing deliverables, and a full traceability audit
across all 126 is possible where it previously was not.

**Worth flagging: S6-012 is a prerequisite the punch list did not capture.** Sprint 6 makes
a single storage adapter non-negotiable, and Sprint 7's journey progress is specified to run
through it. Any further personalization work is blocked on it, not merely improved by it.
