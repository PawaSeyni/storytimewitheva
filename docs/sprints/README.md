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
| S3-007 | ✅ shipped | `src/components/Breadcrumbs.tsx` — one component and one `breadcrumbSchema()` helper used by book pages and every collection; localized labels, fixed English URL segments (#164). Previously partial: two inline copies that had already drifted |
| S4-012 | ✅ shipped | `src/components/RelatedActivities.tsx` renders book → activity from stable IDs (#151) |
| S6-007 | ✅ shipped | `src/lib/recommendations.ts` implements all five ranking reasons (`editorial`, `related`, `theme`, `age`, `preference`); `relatedBooks.ts` is a policy over it (#160). Previously partial: 2 of 5 |
| S6-008 | ✅ shipped | activities recommended from structured book relationships (#150, #151) |
| S7-001 | ✅ shipped | `src/pages/ThemeCollection.tsx`, 11 eligible themes × 3 languages (#142) |
| S7-005 | ✅ shipped | `discussionQuestions` modeled (#143), 60 prompts written in (#154), rendered (#155) |
| S6-001 … S6-006 · S6-009 · S6-010 · S6-013 … S6-018 | ✅ shipped | Sprint 6 slices 1–4 (#159, #160, #161, #162); S6-011 is ADR-002, proposed and awaiting signature |
| S7-009 | ✅ shipped | `src/data/contentIndex.ts` derives every reverse relationship; nothing reverse is persisted (#142) |
| S7-013 | 🟨 partial | EN/FR/ES parity is CI-enforced for books, resources and prompts, but collections and journeys as *content records* do not exist yet |
| S3-018 · S3-019 · S3-020 | ⬜ not started | no Search Console baseline artifact, route/metadata inventory or post-deploy crawl record in the repo |
| S4-010 · S4-011 | ⬜ not started | no `ContinueJourney` component or `src/lib/journey.ts` |
| S5-008 … S5-011 | ⬜ not started | no `src/lib/experiments.ts`, experiment registry or governance docs |
| S6-012 | ✅ shipped | `src/lib/storage.ts` — availability, validation, versioned envelopes, namespaced/shared/legacy tiers; every `src/` caller routed through it and enforced by test (#157, #158). Previously not started |
| S7-002 | ✅ shipped | `/collections/ages-3-5`, `ages-6-7`, `ages-8-9` × 3 languages on the shared `CollectionPage`, primary-fit placement, same eligibility gate and localized-intro requirement as themes (#164) |
| S8-* | ⬜ not started | Sprint 8 is a decision sprint: no ADRs, baselines or Platform Readiness Assessment exist beyond ADR-001 |

## What this changes about the tracking
`docs/PUNCH_LIST.md` remains the record of what shipped and what was decided against.
It can now cite these IDs instead of describing deliverables, and a full traceability audit
across all 126 is possible where it previously was not.

