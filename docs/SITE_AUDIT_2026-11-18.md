# Site audit, 18 November 2026 (evening)

**Scope:** the whole site as deployed after #279 (production on `312c372`, published 20:22 UTC), checked with the repo's own gates, the production suites, a crawl of the live sitemap, Lighthouse and content scans of every built page.
**Verdict:** healthy. No failing check, no broken page, link or asset. Six findings, none urgent; the one worth doing first is responsive cover images on the catalog (finding 1).

## 1. What was run, and the result

| Check | Where | Result |
|---|---|---|
| Unit and funnel tests (`npm test`) | local | **305 passed**, 0 failed |
| SEO tests (`npm run test:seo`) | local | **397 passed**, 0 failed |
| Type check | local | clean |
| Lint | local | **0 errors**, 12 warnings (finding 6) |
| Content inventory (`check:content`) | local | 0 errors, 0 warnings |
| Dependency audit (`check:audit`) | local | 9 advisories, **0 blocking** (8 allowlisted, 1 moderate in dev-only lint tooling) |
| Bundle secrets (`check:secrets`) | local | 557 files, 0 hits |
| Build and prerender | local | **435 / 435 routes** |
| Budgets (`check:budgets`) | local | **0 warnings**: entry 117 KB gz; heaviest page JS 192 KB (Story Builder, warn 210) |
| End-to-end suite (all specs except smoke) | local build | **130 passed** |
| Deploy chain (`verify:deploy`) | production | `312c372` → deploy `6afe0884…` → storytimewitheva.com ✅ |
| Production smoke + client-side audit (a11y, cookie-free, seasonal, search, print packs, landing pages, commerce, experiments) | production | **123 passed** |
| Crawl of the live sitemap | production | **330 / 330 pages 200**; 522 internal links and assets, **0 broken, 0 redirecting**; every page has a title, a description, a self-canonical and one H1 |
| Sitemap coverage | build vs production | the 105 routes not in the sitemap are all `noindex` on purpose (68 free-printable and kit pages, collections drafts, profile, search, links); no indexable page is missing |
| Images without `alt` | built pages | 0 |
| Kit pins and schedule links | production | 62 / 62 pin images and 64 / 64 landing links return 200 |
| Lighthouse (Netlify plugin, mobile) | production | Performance 90 avg; Accessibility, Best Practices, SEO **100** on all 5 audited paths |

## 2. Findings

| # | Finding | Impact | Fix | Effort |
|---|---|---|---|---|
| 1 | **Catalog covers are never resized.** `BookCard` builds a `srcset` only for Amazon-hosted covers; the 19 local covers (`/covers/*.webp`, 700 × 700, 40-115 KB) are served full size where cards display at about 380 px. Lighthouse on `/books/`: performance 84-89, LCP 3.4-3.8 s (mobile, "needs improvement"), "est. savings 242 KiB". | Slower first view of the catalog, home page and book pages on phones, which are 68% of visitors. | Generate a 400 px variant per cover (`/covers/400/<file>.webp`) and give local covers the same `srcset` (400w, 700w) as Amazon ones. Recompress `colors-mixed-up-en.webp` (115 KB). | Small: one script, one component, a test |
| 2 | **The post-deploy check can be skipped by old commit text.** Netlify and `post-deploy.yml` both skip on `[skip netlify]` anywhere in the commit message; squash merges that listed the branch history skipped five deploys today (audit pass 23) and the workflow reported success. | A merge can silently not ship. | Merge with explicit messages (now the practice), and change the workflow's condition to look at the commit's **first line** only, so an inherited marker can't hide a missing deploy. | Small |
| 3 | **Long meta descriptions.** Over 160 characters on 32 EN, 44 ES and 49 FR indexable pages (up to 349). | Google cuts them off in results; no ranking penalty. Matters most for the Spanish follow-up guide, the site's main search entry. | Trim to about 155 characters, starting with the guides and the ES/FR home pages. | Medium (copy, three languages) |
| 4 | **One em dash in published English copy:** the privacy page ("anonymous statistics — never your email…"). | House style (no em dashes in published copy). | Replace with a colon or a full stop. | Trivial |
| 5 | **Dependency advisories to review.** 8 allowlisted (picomatch GHSA-fc5q-39xc-vjpf, review due **18 December 2026**); 1 moderate in eslint/minimatch, dev-only, not shipped. | None today. | Review on 18 December; take the eslint upgrade when it lands. | Small |
| 6 | **Lint warnings (12)**, all non-blocking: fast-refresh export warnings and one unused `eslint-disable` in `tests/funnel/book-songs.test.mjs`. | None for visitors. | Clean up opportunistically. | Trivial |

Not a finding: Lighthouse scored `/activities/` 74 on the deploy; three fresh runs scored 90, 95 and 95, so that was run-to-run noise.

## 3. Owner items still open (from the tracker)

- **A Little Boat's Big Wish** has no local cover: its kit page uses an Amazon image and its three pins (P-154, P-155, P-175, late January) can't be rendered yet (SW-003).
- Native ES/FR sing-through of the four songs (SW-018); review of the 19 cover crops on the printables (SW-019).
- Colouring line art and sequencing thumbnails (the artwork brief).
- Starter kit: confirm whether a French edition exists, or correct the bundle page's "three languages" bullet (SW-020).

## 4. What the numbers say about the business side (unchanged since this morning's reports)

The site is technically sound; its constraint is traffic. About 25 visitors a week, 16 real subscribers. The 65 pins (5 a week from 23 November, P-111 to P-175) and the 4 Facebook posts are the first test of the kits and classroom units. Re-run both reports in mid-December and compare by `utm_campaign=kit_*`.

## 5. Environment note

Eight finished agent worktrees remain under `.claude/worktrees/` in the cloud workspace (no uncommitted changes). They are not in the repo and do not affect CI, but they make a local `eslint .` fail with "multiple candidate TSConfigRootDirs"; lint was run with `--ignore-pattern '.claude/**'`.
