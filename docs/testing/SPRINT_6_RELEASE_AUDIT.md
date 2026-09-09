# Sprint 6 Release Audit (S6-018)

**Target:** production, `https://storytimewitheva.com`, at `main` @ `3764c49` (slices 1–3 live)
**Run:** 2026-09-09, 01:20–01:35 UTC
**Status:** results recorded below; **owner signature pending** (see end)

Every result here was produced by running something — a script, a browser, a test
suite — not by reading code. Where a check was done with a tool I wrote in the moment,
the tool's own defects are recorded too, because a green result from a broken check is
worse than a red one.

## 1. Routes, canonicals, locale parity

27 routes swept: 9 routes × 3 languages (home, catalog, two book pages, a collection,
activities, resources, dashboard, search).

| Check | Result |
|---|---|
| HTTP 200 on all 27 | ✅ 27/27 |
| `rel="canonical"` present on all 27 | ✅ 27/27 |
| `hreflang` present on indexable routes | ✅ 21/21 (`/profile` and `/search` are noindex and suppress hreflang by design) |
| English UI strings leaking onto FR/ES pages (8 Sprint 6 strings checked) | ✅ 0 leaks on 18 localized pages |
| Every sitemap URL returns 200 | ✅ 162/162 |
| Unknown route is a real 404 (no SPA catch-all) | ✅ `/no-such-page/` → 404 |
| Thin collection is a real 404 | ✅ `/collections/honesty/` → 404 |

Sweep-tool defect, recorded: the first two runs of the sweep were wrong, not the site —
a zsh reserved variable (`status`) and an unsplit route list produced `000` results.
Fixed and re-run; the table above is from the third run.

## 2. Cookie-free and headers

| Check | Result |
|---|---|
| `Set-Cookie` from the site on `/`, `/fr/books/`, `/profile/`, `/games/matching.html` | ✅ 0 headers |
| `document.cookie` after browsing, saving a status + favorite, and loading FR home | ✅ empty |
| `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options` | ✅ all present |

## 3. Persistence, in a real browser, on production

| Flow | Result |
|---|---|
| Clear storage → FR book page → "Marquer comme en cours de lecture" + "Ajouter aux favoris" | ✅ envelope holds `{status: 'reading', favorite: true}` |
| Reload the FR book page | ✅ "Ne plus marquer comme en cours" and "Retirer des favoris" both `aria-pressed="true"` |
| FR home after saving | ✅ "Reprenez où vous en étiez" rendered; no English leak |
| Console errors on FR book page and FR home | ✅ none |

Check-tool defect, recorded: my first FR read reported the post-click labels missing.
It read the DOM 400 ms after the click, before React committed. Re-read after reload:
labels correct. Not a product defect.

## 4. Accessibility (S6-017) — automated gate + manual pass

**Automated:** axe-core (WCAG 2.0/2.1 A+AA, 2.2 AA) over 7 routes × EN/FR, plus the
dashboard with saved state. Gate fails on `serious` or `critical`.

**Found on first run — two real WCAG 1.4.3 (contrast) failures, both fixed in this PR:**

| Element | Measured | Fix |
|---|---|---|
| Dashboard "Keep it up!" streak stat: `orange-600`, 16px bold, on white | 3.58:1 (needs 4.5:1; 16px bold is not "large") | `orange-700` → 5.2:1 |
| "(affiliate)" disclosure badge in article body: `amber-600` at 70% opacity, 12px, on the gray card | ≈2.2:1 once blended | `amber-800` → 6.8:1 |

The badge matters beyond the rule: it is the FTC disclosure, and a disclosure some
readers cannot read is not a disclosure.

Post-fix axe run: **✅ 15/15** — 14 route × language scans plus the saved-state dashboard, zero serious or critical violations.

Test-tool defect, recorded: the saved-state dashboard test first failed consistently,
counting only 3 pressed-state buttons where the built HTML has 19. `/profile` is a lazy
route; at `domcontentloaded` the Suspense fallback is up and only the navbar's three
language buttons exist. The test now waits for the preferences block to be visible before
counting, and names every button it found on failure. Not a product defect.

**Manual pass (keyboard + accessible names), on the dashboard with saved state:**

| Check | Result |
|---|---|
| Every toggle is a `<button>` with `aria-pressed` and a non-empty accessible name | ✅ (asserted in `tests/e2e/a11y.spec.ts`) |
| "Clear everything on this device" reachable by keyboard focus | ✅ |
| Polite live region (`role="status" aria-live="polite"`) present for the clear announcement | ✅, and it announced "Everything on this device has been cleared." in the browser |
| Heading order on book, collection and dashboard pages | ✅ locked by `tests/seo/a11y.test.mjs` |
| Empty states never imply a child is tracked | ✅ copy reviewed: device memory, addressed to the grown-up |

**Not done, stated plainly:** no screen-reader session (VoiceOver/NVDA) was run. axe
and the name/role/state assertions cover the programmatic layer; a listening pass is
still owed and is the one item here that needs a person.

## 5. Cookie-free and storage-failure suite (S6-015 / S6-016)

`tests/e2e/cookie-free.spec.ts`, in the CI `local` project:
- all core flows complete with zero cookies (asserted on `context.cookies()`)
- all public routes render with `localStorage`/`sessionStorage` **throwing** on every access
- status and favorite controls work in memory for the session under that condition
- the dashboard tells the grown-up nothing will persist
- personalized home sections stay absent
- games still open and localize from `?lang=` alone
- a malformed envelope and a wrong-shaped legacy key are ignored without errors

Result: **✅ 7/7.** Full `local` project at the time of this audit: **40 of 41** — the one
failure was `analytics.spec.ts` 4.1, logged as S4-07 and fixed in the follow-up (#163): it
was a product race (Form Start could precede Form View), not test noise.

**And a real product bug this suite caught on its first green attempt (S4-06):**
`FavoriteButton` and `SaveResourceButton` inverted their displayed state on every click
— storage updated correctly, the control showed the opposite — because a local optimistic
flip was batched after the `librarychange` listener had already set the true value. Live
since #159/#160. My earlier browser checks read state only after a navigation or reload,
which is why they passed. Fixed here; the suite now asserts the immediate post-click
state three clicks deep.

Test-tool defect, recorded: the first run had 3 failures from my locators —
`{ name: 'Mark as read' }` substring-matched "Mark as reading now" and also hit the
compact buttons on the related-book cards. Scoped to exact name + first. Product was
correct throughout.

## 6. Analytics privacy (S6-014)

`tests/funnel/analytics-contract.test.mjs`: every `track()` call site in `src/` uses a
declared event and only allowlisted dimensions; the runtime filter is proven default-deny
against an object, an email and a non-primitive. Passing.

## 7. Open items surfaced by this audit

| ID | Item |
|---|---|
| DB-07 | `Privacy.tsx` describes local storage as "books read, want-to-read, completed activities"; it now also holds favorites, recently viewed, saved resources and preferences. **Awaits the privacy reviewer**; not edited. |
| N-05 | Recently-explored cap is 12 with no expiry; Sprint 6 §14 leaves cap and retention as an owner decision. |
| A-M | Screen-reader listening pass not performed (see §4). |
| ADR-002 | Personalization storage model — proposed local-only; **awaits signature**. |

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Owner | | ☐ Release accepted · ☐ Changes requested | |
