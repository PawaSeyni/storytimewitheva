# Platform Readiness Assessment (S8-024)

**Scope:** storytimewitheva.com after Sprints 1 to 8. **Date:** 2026-09-09.
**Evidence:** `BASELINE_2026-09.md`, `BOTTLENECK_REGISTER.md`, ADR-001 to ADR-006, the
Sprint 7 release audit, and the gates in `.github/workflows/`. **Decision owner:** PawaSeyni. **Status:** approved by the owner 2026-09-10.

## Go / no-go statements

| Question | Statement |
|---|---|
| Can the platform carry the planned catalog (30 titles, FR/ES editions, ~40 collections)? | **Go.** Static records, validators and the inventory scale linearly; prerender at 3× today's routes stays under the 5-minute Netlify threshold; search at 50× is 4.7 ms per query. |
| Rewrite, CMS, external search, accounts, backend, microservices? | **No-go, by evidence.** ADR-003 to ADR-006 each name the threshold that reopens them. Nothing is approved. |
| Cookie-free public browsing with storage and third parties blocked? | **Go, permanent.** Asserted on every PR and daily against production (S8-022). |
| Release safety? | **Go with one owner action.** Every §9 pre-deploy gate runs in CI and every post-deploy gate runs automatically with results retained; `main` is not branch-protected (R-01), so the gates bind by practice until the owner enables protection. |
| Recovery? | **Go.** Rebuild from source measured at 183 s; content restore and revert exercised; Netlify keeps the last good deploy on failed builds. The one unexercised step is a production republish (owner, two minutes). |
| Privacy? | **Go.** Every external flow inventoried with purpose, fields, recipient, retention, consent basis and outage behavior; error reports carry an error class and a route pattern only. |
| Accessibility? | **Go with one open item.** Automated gates on every PR; governance documented; the first full manual screen-reader pass (S4-05) is scheduled for this sign-off. |
| Another language? | **Go.** One registry entry plus translations and content; proved with a temporary test locale; no component duplication. |

## Decisions recorded this sprint

ADR-003 static catalog, ADR-004 no CMS, ADR-005 client-side search, ADR-006 no accounts.
Performance budgets in CI; media policy; dependency policy with an audit gate; monitoring
and error-reporting standard; security review with threat model; disaster recovery runbook;
environment matrix; external data-flow inventory; accessibility governance; locale registry.

## Risks

| ID | Risk | Likelihood / impact | Mitigation | Owner |
|---|---|---|---|---|
| R-01 | `main` unprotected; a direct push skips every gate | low / high | enable required status `test` + one review in GitHub settings | owner |
| R-02 | `script-src 'unsafe-inline'` because of the static games | low / medium | accepted; revisit when games move to external scripts | engineering |
| R-03 | deploy previews use production function secrets; a preview signup is real | medium / low | scope `MAILERLITE_GROUP` for the `deploy-preview` context | owner |
| R-04 | four allowlisted advisories until Vite 8 / Router 7 | low / low | majors scheduled, review by 2026-12-01 | engineering |
| R-05 | the working copy lives in an iCloud-synced folder; sync created duplicate "… 2" files inside the repo twice this sprint | medium / medium | move the clone outside iCloud-synced folders or exclude it from sync; `git status` before every commit | owner |
| R-06 | seasonal windows need a deploy at each boundary for crawlers | certain / low | calendar: 2026-09-30, 2026-11-01; the sitemap parity test fails if missed | engineering |
| R-07 | 49 MB of campaign PNGs in the deploy artifact | certain / low | budget caps them; owner decides whether they leave the repo | owner |
| R-08 | no paging; failures are emails from GitHub | accepted | proportionate to a static site | owner |

## Capacity and next thresholds

| Dimension | Today | Reopen at |
|---|---|---|
| Routes prerendered | 222 (Netlify 52 s) | 600 routes or 5 min Netlify build → incremental rendering |
| Records per data file | ≤ 20 | 100 → split files or JSON layer (ADR-003) |
| Search records | 74 | 2,000 or 20 ms p95 (ADR-005); lazy index chunk at 100 KB |
| Editors | 1 pair | a second, non-git editor → authoring aid (ADR-004) |
| Entry JS gzip | 118 KB | 125 warn / 140 fail |
| Continuity requests | 0 | 10 per quarter → export/import (ADR-006) |

## Roadmap after Sprint 8

1. Owner actions: R-01, R-03, R-05, the production republish drill, the S4-05 screen-reader pass, the copy reviews carried from Sprint 7.
2. Dependency majors in order: React Router 7, Vite 8, React 19, Tailwind 4.
3. `/books` Lighthouse mobile (71) with a measurement plan (PD-04).
4. Sprint 5 experiments (S5-008 to S5-011) remain not started; they need the analytics goals configured in Plausible first.

## Approvals

| Item | Decision | Signed |
|---|---|---|
| ADR-003 Catalog scalability | accept | PawaSeyni, 2026-09-10 |
| ADR-004 Content management | accept | PawaSeyni, 2026-09-10 |
| ADR-005 Search architecture | accept | PawaSeyni, 2026-09-10 |
| ADR-006 Optional adult accounts | accept (no account code) | PawaSeyni, 2026-09-10 |
| Budgets, media, dependency, monitoring, security, recovery, environment, data-flow, accessibility, locale artifacts | accept | PawaSeyni, 2026-09-10 |
| Platform readiness: proceed on the current architecture | go | PawaSeyni, 2026-09-10 |

Prepared by Claude (Fable 5.1) on 2026-09-09. Owner acceptance: **approved** by PawaSeyni on 2026-09-10.
