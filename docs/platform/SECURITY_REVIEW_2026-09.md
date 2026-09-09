# Security Review and Threat Model (S8-013)

Scope: the public static site, the four Netlify functions, the release pipeline, and the
content ingestion path (pull requests to `src/data`). No authentication exists (ADR-006).
Reviewed 2026-09-09 against `main` @ `1503122`.

## Findings

| Area | Check | Result |
|---|---|---|
| Headers | HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy | present on every route (verified live in the Sprint 7 audit; `tests/seo/security.test.mjs`) |
| CSP | `default-src 'self'`; scripts and connect only self + Plausible; images self + Amazon; `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests` | enforced. `'unsafe-inline'` for `script-src` remains because the 12 static games use inline handlers; the React pages have none (tested), so a per-path strict CSP for the SPA is the next step if Netlify's header merging allows it (known limitation: two matching `[[headers]]` CSPs are both sent and intersected) |
| Forms | subscribe: honeypot, same-origin check, edge rate limit 10 POST/min/IP, server-side MailerLite call, 503 rather than an ungrouped subscriber; contact/feedback: Netlify Forms | as designed; `tests/funnel/subscribe.test.mjs` |
| External links | every `target="_blank"` has `rel="noopener"`; no `http://` resources; external hosts on pages are exactly the inventoried set | tested |
| Redirects | `_redirects` generated from the files on disk; every 302 target is a hashed PDF that exists; unknown routes are real 404s; pack and bundle aliases 301 to gated pages | tested (`redirects.test.mjs`, `media.test.mjs`) |
| Secrets | Netlify secret scan 0 matches on 362 files; `npm run check:secrets` scans dist for secret names and token shapes on every CI build; no `VITE_*` variables | pass |
| Dependencies | 4 advisories remain after the non-breaking fix, all dev-server-only or unreachable, allowlisted with review dates (`audit-allowlist.json`), gate `npm run check:audit` in CI | accepted, see dependency policy |
| User-provided HTML | none rendered; search query is text; games escape HTML | n/a |
| Telemetry | typed default-deny allowlist; error reports are class + route pattern; no query text ever | tested |
| Optional auth | none | n/a |
| Configuration | Node pinned in `netlify.toml` and CI; branch `main` has **no branch protection** | finding R-01 |

## Threat model

**Assets**: the visitor's trust (no tracking, no cookies), subscriber emails (in MailerLite,
never in our systems), the affiliate revenue links, the site's integrity and availability.

**Release pipeline**: a change reaches production only through a merged PR to `main`; CI
runs type check, lint, content gate, audit gate, unit and integration tests, build with
prerender guards, budgets, secret scan, SEO/linking/media/security suites, accessibility,
cookie-free and storage-denied suites. Netlify builds from the merged commit with its own
secret scan; a failed build never replaces the live deploy. Post-deploy checks verify the
served commit and the critical routes. Threats: a compromised maintainer account or a
malicious dependency. Mitigations: the gates above, no auto-merge of dependency PRs, lockfile
discipline, and the missing control R-01 (branch protection: require the CI status and a
review; the owner sets it in GitHub settings; this is not a code change).

**Content ingestion**: content is typed TypeScript records reviewed in PRs; validators reject
unknown ids and drafts; nothing in content is executed. A malicious record could at most
insert a link; external hosts are asserted per build. No CMS, no webhooks, no ingestion
service.

**Functions**: `subscribe` is the only write path; it accepts an email and a few tagged
fields, validates, rate-limits at the edge and in the function, and forwards to MailerLite
with a server-side key. `_pinterest` sends a hashed email only. Neither reads the site's
data. Abuse cost is bounded by the limits; a MailerLite outage returns an error to the
visitor and creates nothing.

## Accepted risks and open items

| ID | Risk | Acceptance |
|---|---|---|
| R-01 | `main` is not branch-protected; a direct push bypasses every gate | owner action: enable required status check `test` and one review |
| R-02 | `script-src 'unsafe-inline'` site-wide because of the games | accepted since #111; revisit when the games move to external scripts or Netlify supports per-path CSP replacement |
| R-03 | deploy previews use production function secrets (a preview signup is a real subscriber) | owner action: scope `MAILERLITE_GROUP` for the `deploy-preview` context to a test group |
| R-04 | four allowlisted advisories until the Vite 8 and Router 7 majors | reviewed by 2026-12-01 |
