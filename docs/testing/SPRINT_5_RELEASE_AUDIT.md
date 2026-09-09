# Sprint 5 Release Audit (S5-024)

**Target:** production, `https://storytimewitheva.com`, at `main` @ `e2deb46` (Sprint 5: #191, #192, #193)
**Run:** 2026-09-10
**Status:** signed below; owner acceptance pending

Every result was produced by running something against production or the committed content.
Commands: the retailer-link sweep (inline node script, recorded in this file's PR), `npm run
test:smoke`, `npm run test:prod-audit` (now including the commerce and experiments specs).

## 1. Retailer links, disclosures, edition mapping (production, 60 book pages)

| Check | Result |
|---|---|
| Book pages fetched (20 books × 3 languages) | 60/60 HTTP 200 |
| Amazon links found | 294 |
| … carrying the Associates tag `storytimewi20-20` | ✅ 294/294 |
| … opening in a new tab with `rel="noopener"` | ✅ 294/294 |
| Affiliate disclosure beside the Buy group, in the page language | ✅ 60/60 |
| Footer disclosure, per language | ❌ on the first run the element was EMPTY in all three languages (defect GA-03, the strings had never been written); fixed in #195 and re-verified on production at `01ee73f`: EN "As an Amazon Associate…", FR "En tant que Partenaire Amazon…", ES "Como Asociado de Amazon…" ✅ |
| Buy link uses the language edition where one exists, else English | ✅ 60/60 (17 FR editions, 0 ES editions, English fallback everywhere else) |
| Coming-soon CTA state | no coming-soon title in the catalog today; the state is locked by `tests/seo/monetization.test.mjs` |

## 2. Newsletter flow and provider

| Check | Result |
|---|---|
| Subscribe function rejects an invalid email with 422 (up, key configured, validating) | ✅ |
| Smoke suite Layer 5 (download 302s) and 6.1 (live ad destinations) | ✅ in 44 passed |
| Signup funnel with placement on every event; success screen continues into books | ✅ commerce spec against production (endpoint stubbed in-page; no subscriber created) |
| Double opt-in | MailerLite is single opt-in; `Lead Created` is backend-confirmed creation (dictionary note) |

## 3. Analytics contract

| Check | Result |
|---|---|
| Event dictionary = runtime taxonomy; every call site passes required keys | ✅ CI (213 node tests) |
| Purchase CTA View once, before Purchase Click, with book/edition/placement; Share with target kind; placement on signup events; loop continuation | ✅ commerce spec on production (in-page stub) |
| Draft experiments: control everywhere, no exposure, no experiment props on conversions; pages work with storage denied | ✅ experiments spec on production |
| Event receipt in Plausible | ❌ not verifiable from the repository: no Stats API key, custom properties not yet enabled (GM-05). Emission is verified; receipt is the owner's dashboard check (`docs/plausible-setup.md`, step 0) |

## 4. Accessibility, localization, console

| Check | Result |
|---|---|
| axe over home, catalog, book, collections (theme/educator/seasonal), activities, resources, dashboard, search, journeys, pack landing, EN + FR | ✅ in 75 passed (`test:prod-audit`) |
| Keyboard: journey steps, search filters; print media; seasonal states | ✅ same run |
| Console errors during the cookie-free and storage-denied flows | ✅ none (pageerror listeners in the suite) |
| Localized copy: contextual signup lines, share labels, Buy group label, affiliate note in FR/ES | ✅ rendered per language (spot-checked on production; locked by prerender tests) |

## 5. Baseline and experiments status

The instrumentation baseline is complete (BASELINE_2026-09.md). The numeric baseline and both
experiments wait on the owner: Plausible Stats API key + custom properties (GM-05), then a
28-day report, approval, `startAt` and `status: 'active'` with initials in the experiment docs.

## 6. Defects found by Sprint 5 gates

| Found by | Defect | State |
|---|---|---|
| dictionary call-site test | `Local Data Cleared` passed a `placement` the dictionary did not declare | declared |
| CI | `npm test` glob referenced an empty `tests/experiments/` directory (git does not track empty dirs) | fixed in #191 |
| monetization test | a related-book card links its cover and title to the same page, which the first assertion read as a duplicate | assertion rewritten to compare sets with the policy |
| production probe | ~1 minute of 500/502 after deploy `6aa1dfa3` published (GX-03) | recorded; not reproduced |
| this audit, §1 | footer affiliate disclosure rendered an empty element in EN/FR/ES (GA-03) | fixed in #195; test now fails on an empty or untranslated footer disclosure |

## 7. Open items carried

GM-05 (Plausible key + properties), GM-06/GL-05 copy review, GL-04 newsletter link standard in
MailerLite, GX-02 experiment activation after baseline approval, PD-04 `/books` Lighthouse 71,
entry chunk at 123 KB gzip against a 125 KB warning.

## 8. Signature

Prepared by Claude (Fable 5.1) on 2026-09-10, against `main` @ `e2deb46`. Owner acceptance: ________ (PawaSeyni), date ________.
