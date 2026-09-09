# Adding a Language (S8-019)

Everything that varies by language derives from `src/lib/locales.ts`. Adding one is
configuration, translations and content; no route or component is copied.

1. **Registry**: add `{ code, prefix, name, flag, intl, ogLocale }` to `LOCALES`. This alone
   gives the language: its URL prefix (App mounts the route table under it), canonical and
   hreflang alternates, `og:locale`, `<html lang>`, Intl date formatting, speech synthesis
   locale, the language switcher entry, the sitemap URLs, the prerendered routes, the
   `/download/?lang=` rules, the inventories and the search index languages.
2. **Translations**: every `Record<Language, …>` table (component `TRANSLATIONS`, taxonomy
   labels and descriptions, resources, collections, journeys, packs, prompts) fails to
   type-check until the new key exists. Pages whose table is not yet translated render
   English (`useTranslation` falls back), so a language can ship page by page behind
   `noindex` if wanted.
3. **Content**: books, prompts and printables (`localizedFile` mirrors the files on disk).
4. **Static games**: `public/games/i18n.js` keeps its own dictionary; add the language there.
5. **Checks**: `npm run check:content` (parity), `npm test` (locales suite), the build (route
   parity guards), `tests/seo` (per-locale head), Playwright locale tests.

Proof that step 1 is sufficient for routing and metadata: `tests/funnel/locales.test.mjs`
passes a temporary `pt` locale through the parametric helpers and asserts routes, path
splitting, localization and hreflang, and scans pages, components and demos for language
literals (none allowed outside the registry).
