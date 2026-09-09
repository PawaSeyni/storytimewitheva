# Release Gates (S8-017 / S8-018)

## Pre-deploy (every PR, `.github/workflows/test.yml`; a failure blocks the merge)

| Spec §9 gate | Implementation |
|---|---|
| Type checking, linting | `tsc`, `npm run lint` |
| Content schema, translation, relationship, route, sitemap, orphan validation | `npm run check:content`; `tests/funnel/*` (relationships, collections, journeys, packs, taxonomy, parity); `tests/seo/linking.test.mjs` (orphans, thin pages) |
| Unit and integration tests | `npm test` (funnel + storage), Playwright `local` project |
| Accessibility regression | `tests/e2e/a11y.spec.ts` (axe, keyboard), heading/alt/lang tests in `tests/seo/a11y.test.mjs` |
| Cookie-free and storage-failure suites | `tests/e2e/cookie-free.spec.ts` |
| Dependency and secret scanning | `npm run check:audit`, `npm run check:secrets`, Netlify secret scan |
| Production build, prerender, artifact validation, performance budgets | `npm run build` (prerender guards abort the build), `npm run check:budgets` |
| Non-production smoke | the Playwright `local` project runs against the built artifact; the deploy preview is checked by hand before merge |

## Post-deploy (`.github/workflows/post-deploy.yml`)

| Spec §9 gate | Implementation |
|---|---|
| Critical routes return the expected status | `npm run test:smoke` Layer 1 (routes, real 404) |
| Canonical and locale alternates | `test:smoke` + the daily `test:prod-audit` (SEO assertions per locale) |
| Key content, search, read/listen, save, activity, journey, download, retailer flows | `test:prod-audit` (search, journeys, collections, packs, print, landing, cookie-free) + smoke Layer 5 (download 302s) + 6.1 (ad destinations) |
| Monitoring receives a synthetic signal without prohibited data | analytics events asserted against the allowlist in the same suites |
| Controlled rollback | see `docs/runbooks/DISASTER_RECOVERY.md`: republish the last good deploy in Netlify, or revert and push |

Results are retained as workflow artifacts for 90 days. A critical failure in the
post-deploy job is the rollback trigger.

Missing control: branch protection on `main` (security review R-01). Until the owner
enables it, the gates are enforced by practice (every change through a PR), not by GitHub.
