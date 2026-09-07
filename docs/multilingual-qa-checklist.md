# Multilingual Content QA Checklist

Sprint 1 deliverable (PRD §9). Run this **before publishing** any new book,
activity, or major multilingual content change, to prevent inconsistent
experiences across English, French, and Spanish.

## How this site keeps languages in sync (context)
- **Path-prefix routing**: every page is served at `/`, `/es/…`, `/fr/…`. There
  are no separate per-language page files, so a page cannot exist in one language
  and be missing in another. `Seo` emits reciprocal `en/es/fr/x-default` hreflang.
- **Single source of truth**: books and activities store text as `{ en, es, fr }`
  objects and (books) an `editions` map with the per-language ASIN + cover. The
  TypeScript type makes a missing *translation* impossible to ship.
- **Automated guards** (run in CI): `tests/funnel/catalog.test.mjs` (every book has
  an English edition; every declared cover exists; no orphan covers), the build's
  book-page + landing-page guards, and `tests/seo/seo.test.mjs` (per-route head,
  canonical, hreflang). Green CI already covers most of the checklist below.
- **Living inventory**: `docs/catalog-inventory.md` (regenerate with
  `node scripts/gen-catalog-inventory.mjs`) lists current per-language coverage and
  every gap.

The manual checks below cover what automation cannot: **translation quality** and
**Amazon-side correctness**.

## Book checklist (per new/changed book)
For **each** of English / French / Spanish:
- [ ] **Title** reads naturally (not machine-literal) and matches the Amazon edition's title where one exists.
- [ ] **Description** is accurate and idiomatic (EN: no em dashes — house style; ES/FR may use them).
- [ ] **Subtitle** and **theme** are translated and consistent in tone.
- [ ] **Age range** matches across languages.
- [ ] **Cover**: language-specific cover shipped, or the English cover is an acceptable fallback (record which in the inventory).
- [ ] **Purchase link**: if a separate ASIN exists for this language, it is wired in `editions.<lang>.asin` and **verified to open the correct-language product** on Amazon; otherwise the English fallback is intentional.

Then:
- [ ] `node scripts/gen-catalog-inventory.mjs` run and the new book appears with the expected coverage.
- [ ] CI green (catalog + SEO + build guards).

## Activity checklist (per new/changed activity)
- [ ] English, French, Spanish `title`, `desc`, and `category` are present and idiomatic.
- [ ] Instructions (in-app demo copy or in-game `/games/i18n.js`) are correctly translated.
- [ ] Links are correct in every language (`/activities/<slug>` resolves at `/es/…`, `/fr/…`).
- [ ] Age information matches across languages.
- [ ] Standalone games: `document.documentElement.lang` follows the site language (via `/games/i18n.js`).

## Language-switching checklist (spot-check a sample page in each language)
- [ ] EN page → correct FR equivalent (same content, translated).
- [ ] EN page → correct ES equivalent.
- [ ] FR page → correct EN and ES equivalents.
- [ ] ES page → correct EN and FR equivalents.
- [ ] The language switcher preserves the current route (book/activity), not just the home page.
- [ ] `<html lang>` and the canonical/hreflang tags match the language shown.

## Sign-off
- [ ] Inventory regenerated and committed.
- [ ] No new gaps introduced (or new gaps are intentional and recorded).
- [ ] CI green.
