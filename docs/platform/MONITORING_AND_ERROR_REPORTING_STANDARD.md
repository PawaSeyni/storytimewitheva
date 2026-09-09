# Monitoring and Error-Reporting Privacy Standard (S8-011 / S8-012)

Monitoring is proportionate to a static site with four serverless functions, and it is
never a functional dependency: every check runs from outside, and the client beacon is
fire-and-forget through the existing cookie-free analytics allowlist.

## What is monitored, by whom, how often

| Signal | Mechanism | Cadence | Failure surfaces as |
|---|---|---|---|
| Deploy chain (production runs the pushed commit, context and branch) | `.github/workflows/post-deploy.yml` → `npm run verify:deploy` after `/version.json` reports the commit | every push to `main` | failed workflow, email to the repository owner |
| Routes, locales, real 404s, download 302s, live ad destinations | same workflow → `npm run test:smoke` (Playwright against production) | every push to `main` and every 6 hours | failed workflow (uptime and route monitoring) |
| Accessibility, cookie-free, seasonal, search, print, landing flows on production | same workflow → `npm run test:prod-audit` | daily 05:43 UTC and on demand | failed workflow |
| Build failures | Netlify: a failed build keeps the last good deploy live | every build | Netlify notification |
| Performance | Netlify Lighthouse plugin, five paths per deploy | every deploy | deploy summary; reviewed at each release audit against `budgets.json` |
| Client-side errors | `src/lib/errorReport.ts` → `Client Error` event | as they happen | Plausible event counts by error class and route pattern |
| Function errors | Netlify function logs | on demand | dashboard |
| Secret exposure | Netlify secret scan per deploy; `npm run check:secrets` per CI build | every deploy / PR | failed deploy / failed CI |

Results of the post-deploy workflow are retained as artifacts for 90 days (S8-018).
There is no paging. The owner is emailed by GitHub on failed runs; the maintenance
dashboard (`npm run maintenance`) remains the on-demand deep check.

## Error-report payload (S8-012)

A client error report is exactly two strings: `kind` (the error class name, e.g.
`TypeError`, `ChunkLoadError`; `UnknownError` when the class is missing or malformed) and
`route` (the pathname with the language prefix kept and every dynamic segment replaced:
`/fr/books/:id`). Redaction is a pure function (`src/lib/errorRedact.ts`) with unit tests
for messages, stacks, query strings, hashes, emails and free text. Never sent: the message,
the stack, the URL query, storage values, form values, user agent beyond what Plausible
already derives, or anything from the personalization envelope. At most three reports per
page load. The beacon goes through `track()`, so the typed default-deny allowlist applies
and the event is dropped when analytics is blocked; the page is unaffected either way.

Synthetic test signal: `tests/e2e/analytics.spec.ts` asserts every event's keys are in the
allowlist; `tests/storage/errorRedact.test.mjs` asserts the redaction; the daily
production audit exercises the analytics stub path.

## Retention and deletion

Plausible keeps aggregates on our account (no per-visitor data; IP and UA hashed with a
daily salt). GitHub artifacts expire after 90 days. Netlify function logs follow Netlify's
retention. No error report is stored by us.
