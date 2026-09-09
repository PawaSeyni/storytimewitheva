# Performance Budget Policy (S8-021)

Budgets live in `budgets.json` and are enforced by `npm run check:budgets` after the build
in CI (`.github/workflows/test.yml`). A `fail` breach blocks the merge; a `warn` is printed
in the CI log and must be either fixed or raised in the same PR with a one-line reason in
this file's history. Values were set from the September 2026 baseline with roughly 10 to
20% headroom, so the first thing a regression hits is the warning.

| Budget | Warn | Fail | Baseline (2026-09) |
|---|---|---|---|
| Entry JavaScript chunk, gzip | 125 KB | 140 KB | 118 KB |
| Any lazy page chunk, gzip | 35 KB | 50 KB | 23 KB (Resources) |
| Total JavaScript, gzip | 300 KB | 350 KB | 275 KB |
| Total CSS, gzip | 40 KB | 60 KB | 35 KB |
| Prerendered HTML per route | 130 KB | 200 KB | 27 to 60 KB; the catalog page is 123 to 127 KB (20 cards with srcSets), which set the warn level |
| Page image asset, each | 320 KB | 600 KB | covers ≤ 190 KB; the hero photo and the OG image are 310 KB (900 px, already optimized) and set the warn level |
| Page image assets, total | 8 MB | 12 MB | 6.9 MB (covers 5.7, previews 0.4, app 0.5) |
| Campaign asset (`/pins/*`), each | 3 MB | 5 MB | 2.6 MB max |
| PDF, each | 8 MB | 12 MB | 6 MB max (free book) |
| Prerendered routes | minimum 150 | | 222 |

Measured outside CI and reviewed at each release audit:

| Budget | Warn | Fail | Source |
|---|---|---|---|
| Lighthouse mobile Performance | < 80 | < 60 | Netlify Lighthouse plugin, five paths per deploy (2026-09: 96 / 71 / 86 / 86 / 80; `/books` is the open item) |
| LCP | 2.5 s | | same |
| CLS | 0.1 | | same |
| INP | 200 ms | | same |
| Netlify `deploy_time` | 180 s | 300 s | deploy record (2026-09: 52 s) |
| Local prerender | 300 s | | `npm run bench:build` (2026-09: 149 to 165 s) |

Capacity fixtures, run at each release audit rather than per PR: `npm run bench:search`
(10× and 50× content) and `npm run bench:build`.

Ownership: engineering owns the numbers; the owner is asked before any `fail` value is
raised. Review cadence: at every release audit, and whenever a budget is raised.
