# Platform Baseline, September 2026 (S8-001 / §3)

Measured on 2026-09-09 at `main` @ `a44f81c` (Sprint 7 complete). Local machine: Apple
Silicon, Node 22; production builds on Netlify with Node 20. Reproduce with the commands
in each section; the numbers here are the ones cited by the bottleneck register and the ADRs.

## Content and ecosystem (`npm run check:content`, `docs/content-inventory.md`)

| Type | Count | Locales |
|---|---|---|
| Books | 20 | title, subtitle, description, theme in EN/FR/ES; 60 discussion prompts (3 per book) |
| Activities | 21 (12 games, 9 in-app) | EN/FR/ES |
| Resources | 10 (6 guides, 4 downloads) | EN/FR/ES; 14 PDFs on disk (3 downloads × 3 languages + 1 shared + free book × 3 + starter kit) |
| Collections | 20 (11 theme, 3 age, 3 educator, 3 seasonal) | EN/FR/ES; 18 indexable today |
| Reading journeys | 3 (15 steps) | EN/FR/ES |
| Learning packs | 2 | EN/FR/ES |
| Search records | 74 | EN/FR/ES |
| Public routes | 222 prerendered (192 indexable in the sitemap, 42 noindex) | 3 locales |

## Build, prerender, deploy (`node scripts/bench-build.mjs`)

| Step | Local | Notes |
|---|---|---|
| gen:downloads + gen:sitemap + gen:version | 0.5 s | |
| tsc | 0.2 s | |
| vite build | 2.3 s (warm 2.4 s) | 33 JS chunks |
| prerender | 149 to 165 s | 222 routes, sequential, 0.7 s/route; 4-page pool 151 s, 8-page pool 137 s (CPU-bound, pool not kept) |
| total | ~152 to 168 s | prerender is 98% |
| Netlify `deploy_time` for the same commit | 52 s | cached Chromium, faster CPU; deploy `6aa1c4ed`, published 2026-09-09 20:44 UTC |
| Deploys, last 30 days | 30 merges to main, 83 first-parent commits, 24 touching `src/data` | every merge deploys |

Determinism: two sequential builds differ on 6 HTML files (`/activities/bingo`, `/activities/puzzles` × 3 languages) because those pages render a random card or puzzle at build time. All other 218 files are byte-identical.

## Output size (fresh `dist/`)

| Item | Size |
|---|---|
| dist total | 86 MB |
| JavaScript | 791 KB raw, 275 KB gzip; entry chunk 118 KB gzip; largest page chunk 23 KB gzip (Resources) |
| CSS | 35 KB gzip |
| HTML | 8.2 MB (224 files) |
| Images | 55.8 MB in 103 files: Pinterest pins 48.9 MB (29 PNGs, ~2 MB each), covers 5.7 MB (57 files), previews 0.4 MB, app assets 0.5 MB |
| PDFs | 20.7 MB in 14 files |
| Games | 744 KB |
| Audio | none (read-aloud is Web Speech, no files) |

Lighthouse mobile (Netlify plugin, deploy `6aa1c4ed`): home 96, `/books` 71, `/activities` 86, `/activities/story-builder` 86, `/about` 80; Accessibility, Best Practices and SEO 100 on all five.

## Search (`node scripts/bench-search.mjs`)

| Scale | Records | Avg query |
|---|---|---|
| current | 74 (76 KB JSON) | 0.10 ms |
| 10× | 740 | 0.98 ms |
| 50× | 3,700 | 4.7 ms |

Relevance defects reported: none (search shipped in Sprint 7; the `Search` event carries filter and result count for future zero-result analysis).

## Editorial operations

Content changes are PRs against `src/data/*.ts` gated by validators, the content inventory and a full build. 24 content-touching merges in 30 days, all by the engineering pair. Review time is the PR cycle. Content errors that reached production in Sprint 7: 0 (five defects were caught by gates before merge; see the Sprint 7 audit §6).

## Production errors and recovery

No error reporting or uptime monitoring exists. Known failure classes from history: build-credit exhaustion (Netlify skipped builds, last good deploy stayed live), prerender failures (fail the build by design), a silent signup drop in July (fixed with the serverless function). Recovery time is unmeasured. This is bottleneck BR-08.

## Dependencies (`npm ls --depth=0`, `npm audit`, `npm outdated`)

| Metric | Value |
|---|---|
| Direct dependencies | 7 runtime, 20 dev; 249 packages installed |
| `npm audit` before / after non-breaking fix | 13 (6 high, 5 moderate, 2 low) / 4 (1 high: vite 5 dev-server path traversal; 3 moderate: esbuild dev server, react-router 6 open redirect × 2) |
| Major versions behind | 13 of 27 direct deps (React 19, React Router 7, Vite 8, Tailwind 4, TypeScript 7, ESLint 10, plugin-react 6, react-hooks 7, sparticuz/chromium 152, @types/react 19) |
| Node | 20 on Netlify and CI, 22 locally |
| Secret scan (Netlify, this deploy) | 362 files, 0 matches |
| Ownership | engineering pair; no Dependabot yet |

## Automated coverage of critical journeys

216 node tests (funnel, storage, SEO, linking), 54 Playwright tests against the built site, 6 smoke tests against production, 68 client-side tests runnable against production (`npm run test:prod-audit`). Covered: browse, book page, buy click, search with filters, collections (theme, age, educator, seasonal open/closed), journey progress and save, pack signup and delivery (stubbed), downloads, language switch, games continuation, print, accessibility (axe), cookie-free and storage-denied variants of all of the above. Not covered by automation: the live newsletter round-trip (owner-only, creates a subscriber) and Amazon product-page availability (third party).
