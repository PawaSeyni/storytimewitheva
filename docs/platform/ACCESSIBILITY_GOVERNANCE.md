# Accessibility Governance (S8-020)

**Owner:** engineering pair (regression tests, fixes); **sign-off:** the owner at each release
audit. **Standard:** WCAG 2.1 AA with 2.2 AA checks where axe supports them; printable
output usable on paper (§10 of the Sprint 7 spec).

## Regression tests, on every PR

- axe (`tests/e2e/a11y.spec.ts`): serious and critical violations fail; moderate and minor
  are annotated. Routes: home, catalog, book, theme/educator/seasonal collections (open and
  closed), activities, resources, dashboard with saved state, search results, journeys
  index and journey, pack landing; English and French.
- Keyboard: journey steps (Space/Enter, `aria-pressed`, polite announcement), search filters,
  dashboard toggles and the clear control.
- Structure (`tests/seo/a11y.test.mjs`): exactly one `<h1>`, no skipped heading levels,
  `alt` on every image, `<html lang>` per locale, breadcrumbs, no English leaks on localized
  pages, audience and seasonal labels per locale.
- Print (`tests/e2e/print-packs.spec.ts`, `tests/seo/a11y.test.mjs`): chrome removed,
  breadcrumbs kept, nothing clipped.
- Media (`tests/seo/media.test.mjs`): width/height/alt on every image.

## Manual review cadence

- **Each release audit**: a screen-reader pass (VoiceOver on Safari and NVDA or Narrator on
  Windows where available) over one page of each type: catalog, book, collection, journey,
  pack landing, search; 200% zoom on the same pages. Findings go to the punch list with an
  owner. Punch-list item S4-05 (the first full pass) is still open and is scheduled for the
  Sprint 8 readiness sign-off.
- **Each new page type**: added to the axe route list and to the prerender structure tests
  in the same PR.
- **Contrast**: every new color pairing is checked before merge (axe caught two in Sprint 7).

## Release checklist entry

Accessibility is a line in every release audit: axe green on the extended route list,
keyboard tests green, manual pass done or explicitly deferred with a date, contrast findings
closed. The Lighthouse accessibility score per deploy (100 on all five audited paths today)
is recorded but is not the gate; the tests are.
