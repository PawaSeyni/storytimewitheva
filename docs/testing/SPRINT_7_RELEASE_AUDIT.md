# Sprint 7 Release Audit (S7-020)

**Target:** production, `https://storytimewitheva.com`, at `main` @ `bcdfc6c` (Sprint 7 complete: #164 to #176)
**Run:** 2026-09-09 16:54 UTC
**Status:** release inventory signed below; owner acceptance pending

Every result here was produced by running something against production or against the
committed content, not by reading code. The commands are recorded so the audit is repeatable:
`npm run check:content`, `npm run test:smoke`, `npm run test:prod-audit`, plus the curl sweeps
in this file.

## 1. Routes, canonicals, locale parity (production)

45 routes swept: 15 Sprint 7 routes × 3 languages.

| Route | HTTP | Canonical is self | hreflang tags | robots |
|---|---|---|---|---|
| `/` | 200 | yes | 4 | index |
| `/books` | 200 | yes | 4 | index |
| `/journeys` | 200 | yes | 4 | index |
| `/journeys/kindness-that-shines` | 200 | yes | 4 | index |
| `/collections/kindness` | 200 | yes | 4 | index |
| `/collections/ages-6-7` | 200 | yes | 4 | index |
| `/collections/classroom-feelings` | 200 | yes | 4 | index |
| `/collections/back-to-school` | 200 | yes | 4 | index |
| `/collections/season-of-gratitude` | 200 | yes | 0 | noindex,follow |
| `/resources` | 200 | yes | 4 | index |
| `/search` | 200 | yes | 0 | noindex,follow |
| `/free/classroom-pack` | 200 | yes | 0 | noindex,follow |
| `/free/home-reading-pack` | 200 | yes | 0 | noindex,follow |
| `/links` | 200 | yes | 0 | noindex,follow |
| `/profile` | 200 | yes | 0 | noindex,follow |
| `/fr/` | 200 | yes | 4 | index |
| `/fr/books` | 200 | yes | 4 | index |
| `/fr/journeys` | 200 | yes | 4 | index |
| `/fr/journeys/kindness-that-shines` | 200 | yes | 4 | index |
| `/fr/collections/kindness` | 200 | yes | 4 | index |
| `/fr/collections/ages-6-7` | 200 | yes | 4 | index |
| `/fr/collections/classroom-feelings` | 200 | yes | 4 | index |
| `/fr/collections/back-to-school` | 200 | yes | 4 | index |
| `/fr/collections/season-of-gratitude` | 200 | yes | 0 | noindex,follow |
| `/fr/resources` | 200 | yes | 4 | index |
| `/fr/search` | 200 | yes | 0 | noindex,follow |
| `/fr/free/classroom-pack` | 200 | yes | 0 | noindex,follow |
| `/fr/free/home-reading-pack` | 200 | yes | 0 | noindex,follow |
| `/fr/links` | 200 | yes | 0 | noindex,follow |
| `/fr/profile` | 200 | yes | 0 | noindex,follow |
| `/es/` | 200 | yes | 4 | index |
| `/es/books` | 200 | yes | 4 | index |
| `/es/journeys` | 200 | yes | 4 | index |
| `/es/journeys/kindness-that-shines` | 200 | yes | 4 | index |
| `/es/collections/kindness` | 200 | yes | 4 | index |
| `/es/collections/ages-6-7` | 200 | yes | 4 | index |
| `/es/collections/classroom-feelings` | 200 | yes | 4 | index |
| `/es/collections/back-to-school` | 200 | yes | 4 | index |
| `/es/collections/season-of-gratitude` | 200 | yes | 0 | noindex,follow |
| `/es/resources` | 200 | yes | 4 | index |
| `/es/search` | 200 | yes | 0 | noindex,follow |
| `/es/free/classroom-pack` | 200 | yes | 0 | noindex,follow |
| `/es/free/home-reading-pack` | 200 | yes | 0 | noindex,follow |
| `/es/links` | 200 | yes | 0 | noindex,follow |
| `/es/profile` | 200 | yes | 0 | noindex,follow |

| Check | Result |
|---|---|
| HTTP 200 on all 45 | ✅ 45/45 |
| Canonical is the page's own URL | ✅ 45/45 |
| hreflang (en, es, fr, x-default) on every indexable route | ✅ 30/30 |
| `noindex` exactly where designed: closed seasonal collection, search, pack landing pages, link-in-bio, dashboard | ✅ 15/15, no indexable route carries it |
| Every sitemap URL returns 200 | ✅ 192/192 |
| Unknown route is a real 404 | ✅ `/no-such-page/` → 404 |
| Thin theme collection is a real 404 | ✅ `/collections/honesty/` → 404 |

## 2. Cookie-free and headers (production)

| Check | Result |
|---|---|
| `Set-Cookie` on `/`, a FR journey, an open seasonal collection, a pack landing page, search | ✅ 0 headers |
| `Content-Security-Policy`, `Strict-Transport-Security` on the same five | ✅ present on all |
| Cookie-free suite against production (search with filters, collections, journey to completion, pack delivery with the endpoint stubbed, print media, continuation) | ✅ see §5 |

## 3. Downloads and packs (production)

| Link | Result |
|---|---|
| `/download/parents-guide` | ✅ 302 → hashed PDF → 200 `application/pdf` |
| `/download/parents-guide?lang=fr` | ✅ 302 → French PDF → 200 |
| `/download/follow-up-activities?lang=es` | ✅ 302 → Spanish PDF → 200 (the flag defect fixed in #172 is what makes this line true) |
| `/download/bilingual-flashcards`, `/download/bedtime-routine`, `/download/bedtime-routine?lang=fr` | ✅ 302 → PDF → 200 |
| `/download/classroom-pack`, `/download/home-reading-pack`, `/download/bilingual-bundle` | ✅ 301 → gated `/free/<id>` → 200 |
| Pack success screen lists every file with language-correct links (endpoint stubbed in-page) | ✅ EN and FR, 3 links each, verified on the preview and in the production suite |

## 4. Content inventory and validation (committed content)

`npm run check:content`: **0 errors, 0 warnings**. The committed `docs/content-inventory.md` is current (a test fails otherwise).

## Totals

| Type | Count | Detail |
|---|---|---|
| Books | 20 | 20 with related activities, 20 with related books, 20 with discussion prompts (60 prompts) |
| Activities | 21 | 12 games, 9 in-app |
| Resources | 10 | download 4, article 6 |
| Collections | 20 | theme 11, age 3, educator 3, seasonal 3; 20 published; 20 routable |
| Journeys | 3 | 3 published, 15 steps |
| Learning packs | 2 | 2 published |

Seasonal windows at this build (from the prerender log): back-to-school OPEN (closes 09-30); season-of-gratitude closed (opens 11-01); summer-of-wonder closed (opens 06-15). A deploy is due at each boundary; the sitemap parity test fails loudly if one is missed.

## 5. Browser suites against production

| Suite | Command | Result |
|---|---|---|
| Smoke (routes, delivery, live ad destinations) | `npm run test:smoke` | ✅ 44 passed |
| Accessibility (axe WCAG 2.x A/AA, serious+critical gate) over home, catalog, book, theme/educator/seasonal collections, activities, resources, dashboard, search results, journeys, pack landing, EN + FR; keyboard tests for journey steps and search filters | `npm run test:prod-audit` | ✅ included in 68 passed |
| Cookie-free + storage-denied ecosystem flows | `npm run test:prod-audit` | ✅ included in 68 passed |
| Seasonal window states with a fixed clock, search across types, print media, pack landing | `npm run test:prod-audit` | ✅ 68 passed total, 0 failed |

`test:prod-audit` runs only specs whose network side effects are stubbed in-page; nothing writes to MailerLite or Plausible.

## 6. Defects found by Sprint 7 gates, and their state

| Found by | Defect | State |
|---|---|---|
| Pack delivery test (#172) | `download-follow-up-activities` flagged English-only while FR/ES files exist; a French pack would have served the English sheet | fixed, flag locked to disk |
| axe extension (#175) | Search filter counts and the landing-page footer failed WCAG 1.4.3; the footer defect was pre-existing on every magnet landing page | fixed |
| Linking gate (#176) | `/links` in the sitemap with no inbound link and no `<main>` landmark | decided: noindex, out of sitemap, `<main>` added |
| Linking gate (#176) | A closed seasonal collection dropped all structured data | fixed: BreadcrumbList kept |
| Print test (#172) | First print rule hid every `<nav>`, breadcrumbs included | fixed before merge |

Check-tool defects, recorded: the first production sweep of the Spanish back-to-school page read 0 books during CDN propagation; a re-fetch a minute later showed the five books. Not a product defect. The journey-completion test failed once in CI at the completion announcement while passing locally 12 of 12 under load; it was rewritten to assert the rendered state and the live-region text, and has passed every run since.

## 7. Open items carried out of Sprint 7

- LP-06 no product shot on the two pack landing pages (LP-001 policy).
- LP-07 the teachers section on `/resources` says "no sign-up needed" while every download is gated.
- LP-08 the starter kit is not in the resources registry.
- SC-04 seasonal boundaries reach crawlers at the next deploy (process: deploy at each boundary).
- SA-04 no fuzzy matching in search by design.
- Copy review: educator collections (EC-05), packs (LP-09), seasons (SC-05), guide pairings (GI-04).
- N-04 Search Console baseline, S4-05 screen-reader pass, D-02/D-03 deferred.

## 8. Release inventory (S7-020)

| Type | Published | Where |
|---|---|---|
| Collections | 20 (11 theme, 3 age, 3 educator, 3 seasonal) | `/collections/<id>` × 3 languages; 18 indexable today |
| Reading journeys | 3 (15 steps) | `/journeys`, `/journeys/<id>` × 3 languages |
| Learning packs | 2 | `/free/<id>` × 3 languages (gated), listed on `/resources#packs` |
| Parent guides | 6, each linking stories, collections and printables | `/resources#<slug>` × 3 languages |
| Downloads | 4 registered printables, 14 PDFs on disk, all served through stable `/download/` links | `/download/<slug>[?lang=]` |
| Search | 74 records across 5 content types | `/search` × 3 languages, noindex |
| Discussion prompts | 60 (20 books × 3) | book pages, journeys |
| Analytics events (all aggregate, no query text, no PII) | Journey Start / Step / Complete / Saved, Magnet Download, Continue Journey, Search | typed default-deny allowlist |

**Signed:** release inventory prepared by Claude (Fable 5.1) on 2026-09-09 16:54 UTC, against `main` @ `bcdfc6c`. Owner acceptance: ________ (PawaSeyni), date ________.
