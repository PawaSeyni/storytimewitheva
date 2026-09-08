# Architecture Alignment — Master Technical Reference

**Status:** Living document · **Applies to:** all technical specifications (Sprints 6–8) ·
**Last updated:** 2026-09-08

This is the single technical reference every implementation document must conform to.
Its governing principle — established by the Sprint 3 PRD and reaffirmed here — is:

> **Preserve the existing architecture, extend it deliberately, and avoid unnecessary
> rewrites or new platforms.** Improve what exists; do not replace it for novelty.

Every sprint technical spec MUST cite this document and MUST distinguish: existing files
to modify · new files to create · existing utilities/components to reuse · architecture
that must not be replaced · dependencies on previous sprints · explicitly out-of-scope
technologies.

---

## 1. Current stack (as built)
| Layer | Technology | Notes |
|---|---|---|
| UI | React 18 + TypeScript | function components + hooks; no class components |
| Build | Vite 5 | `npm run build` pipeline (see §12) |
| Routing | React Router v6 | client-side; path-prefix i18n (see §4) |
| Styling | Tailwind CSS 3 | utility-first; component classes in `src/index.css` (`.btn-primary`, `.btn-secondary`, `.card`) |
| Hosting | Netlify | static publish of `dist/` + Netlify Functions + Netlify Forms |
| Prerender | Puppeteer / `@sparticuz/chromium` | `scripts/prerender.mjs` snapshots every route (see §7) |
| Analytics | Plausible (cookieless) | `src/lib/analytics.ts` (see §9) |

**Do NOT introduce** (out of scope unless a PRD explicitly approves it): Next.js, a
server-side-rendering migration, a CMS, a state-management library (Redux/Zustand/etc.),
a data-fetching library, a routing rewrite, an i18n library, or any cookie-based mechanism.

## 2. Approved architectural constraints (must not be replaced)
1. **Static prerendering is the SEO gate.** `scripts/prerender.mjs` renders each route to
   its own `index.html`; there is **no SPA catch-all** in `netlify.toml`, so an
   un-prerendered route returns a real HTTP 404. The prerender step is required — a build
   that fails it keeps the last good deploy live. Any new route MUST be prerenderable.
2. **English route vocabulary is fixed.** Routes are `/books`, `/activities`, `/resources`,
   `/about`, `/contact`, `/profile`, `/search`, `/books/<id>`, `/activities/<slug>`,
   `/free/<magnet>`. Language is a **path prefix** (`/es/…`, `/fr/…`), never a translated
   slug. Do not localize route names.
3. **Single source of truth for content** is typed data in `src/data/` (see §5), read via
   `localize()`-style hooks. Pages never store per-language content separately.
4. **Cookie-free** core functionality (see ADR-001). No cookies may become a functional
   dependency.
5. **PII-default-deny analytics** (see §9). Analytics is never required for functionality.

## 3. Sprint dependencies
- **Sprint 1 (shipped):** homepage IA + CTA hierarchy + `Homepage CTA` analytics + the
  `editions` data model + `docs/catalog-inventory.md` + `docs/multilingual-qa-checklist.md`.
- **Sprint 3 (source of these constraints):** route/URL architecture intact, prerender
  preserved, structured data as the source for sitemap/inventory generation.
- **Sprint 6** builds on: existing book data, language system, reading-status storage,
  analytics abstraction, book relationships.
- **Sprint 7** builds on: Sprint 6 storage + the explicit book↔activity↔resource
  relationships Sprint 3 establishes.
- **Sprint 8** is a **decision/measurement** sprint — it must not pre-emptively rewrite.

## 4. Route & language architecture
- **Routing:** `src/App.tsx` mounts the route table once per language prefix (`''`, `/es`,
  `/fr`). `src/components/LocalizedLink.tsx` auto-prefixes internal links to the active
  language. Active-state logic strips the prefix via `splitLangFromPath`.
- **Language system:** `src/lib/language.tsx` (custom, no i18n library). `useLanguage()`
  exposes the current `Language` (`'en' | 'es' | 'fr'`); `useTranslation(TRANSLATIONS)`
  selects the slice for the current language; `splitLangFromPath` / `localizePath`
  translate between prefixed and unprefixed paths. The active language is derived from the
  URL and persisted as a **convenience only** in `localStorage` (`preferredLanguage`).
- **Localized content type:** `type LocalizedString = Record<Language, string>` — every
  translatable field is a `{ en, es, fr }` object, so a missing translation cannot ship.
- **hreflang / canonical:** `src/components/Seo.tsx` emits a self-referential canonical plus
  reciprocal `en/es/fr/x-default` hreflang for indexable routes; `noindex` routes suppress
  hreflang.

## 5. Data architecture (source of truth)
- `src/data/books.ts` — the catalog. Each `Book` has `id`, `ageRange`, `featured?`,
  `status?`, localized `title/subtitle/description/theme`, and an **`editions`** map:
  `{ en: Edition } & Partial<Record<Language, Edition>>` where `Edition = { asin?; cover? }`.
  `localize(book, lang)` resolves the per-language cover + Buy link (falling back to `en`).
  This is the model to extend for any per-language asset.
- `src/data/activities.ts` — `Activity { slug, emoji, ages, title, desc, category, game? }`,
  all localized; `useActivities()/useActivity()` hooks.
- `src/data/testimonials.ts` — empty by design; the homepage section renders nothing until
  real approved quotes exist (never fabricated).
- **Derivation, not duplication:** `scripts/gen-sitemap.mjs` derives book routes from
  `books.ts`; `scripts/gen-catalog-inventory.mjs` derives `docs/catalog-inventory.md`.
  New structured data (collections, journeys) MUST likewise be the source for any generated
  artifact (sitemap, inventory, validation), per the Sprint 3 PRD.
- **Guards:** `tests/funnel/catalog.test.mjs` (every book has an `en` edition; declared
  covers exist; no orphan covers) and the build-time book-page/landing guards in
  `prerender.mjs`.

## 6. Storage architecture
- **Client-side only, cookie-free.** Persistence lives in `localStorage` via `src/lib/
  progress.ts` (reading progress, reading journal, reading tracker) and `preferredLanguage`.
  No cookies, no server session, no account.
- **Graceful degradation is mandatory** (ADR-001): every read/write is wrapped so that when
  storage is unavailable (private mode, blocked, quota) the site still works without
  persistence. New personalization (Sprint 6) MUST route through a single storage
  abstraction (`src/lib/storage.ts`, to be added) with try/catch + schema versioning, not
  raw `localStorage` calls scattered across components.
- **IndexedDB** only where a genuine capacity/structure need is justified (large or
  relational client data) — not for small key/values.

## 7. SEO & prerendering architecture
- `src/components/Seo.tsx` + `src/lib/head.ts`: per-route unique title/description,
  canonical, hreflang, Open Graph + Twitter, `noindex,follow` for `/free/*`, `/profile`,
  `/search`.
- `src/components/JsonLd.tsx`: type-appropriate structured data (Organization/WebSite on
  home, Book/ItemList/BreadcrumbList on catalog, etc.).
- Build order (`package.json`): `gen:downloads → gen:sitemap → tsc → vite build →
  gen:version → prerender`. `gen:sitemap` runs **before** `vite build` so the fresh sitemap
  is copied into `dist/` and read by prerender. **Any new indexable route must be added to
  the sitemap source (so it prerenders) — otherwise it is a hard 404.**
- `public/robots.txt` disallows `/profile`, `/search` (+ localized) and references the
  sitemap; `/free/*` is noindex-via-meta but crawlable.

## 8. Deployment architecture
- Netlify auto-deploys `main`. `netlify.toml` holds the build command, security headers +
  CSP (enforced), cache rules (`/assets/*` and `/*.pdf` immutable; non-hashed images
  revalidate; `version.json` no-store), and the Functions directory.
- **Provenance:** `scripts/gen-version.mjs` stamps `dist/version.json` with the commit SHA
  (served no-store) so "is commit X in production?" is answerable from production.
- **Handoff:** after any merge to `main`, one line is appended to `DEPLOY_LOG.md` (in the
  Eva working folder) for the marketing side.

## 9. Analytics boundaries
- **Plausible only**, cookieless, loaded in `index.html`. `src/lib/analytics.ts` `track()`
  dispatches named events with a **compile-time + runtime allowlist**: `FunnelEvent` (event
  names) and `ALLOWED_PROP_KEYS` (aggregate dimensions only). A call site cannot introduce
  a PII key — it won't type-check and is stripped at runtime.
- **Separation rule:** Plausible measures aggregate behavior; MailerLite holds subscriber
  identity; the two are never joined. No email/name/subscriber-id ever reaches an event.
- Adding an event = add it to `FunnelEvent` first (intentional + greppable). Analytics must
  **never** be required for application functionality.

## 10. Netlify Functions
`netlify/functions/`: `subscribe.mjs` (server-side MailerLite signup — honeypot,
same-origin allowlist, in-function rate limit, native-form `return_to`), `_ratelimit.mjs`
(Netlify Blobs sliding window, fail-open), `_verify.mjs` (Turnstile seam — no-op today),
`_pinterest.mjs` (server-side CAPI, hashed email only). Env: `MAILERLITE_API_KEY`
(required), `PINTEREST_CONVERSIONS_TOKEN` (optional), `TURNSTILE_SECRET` (future).

## 11. Testing architecture
- `node --test tests/funnel/*.test.mjs` — headless funnel/catalog/build guards.
- `npm run test:seo` (`tests/seo/*.test.mjs`) — per-route head/canonical/hreflang/JSON-LD.
- Playwright `tests/e2e/*.spec.ts` (local) + `@smoke` against production.
- **CI** (`.github/workflows/test.yml`, Node 20): lint + test + build + test:seo + local e2e.
- New capabilities add tests **here**, in the existing runners — no new test framework.

## 12. Build pipeline (do not reorder without cause)
```
npm run gen:downloads   # public/_redirects from hashed PDFs
&& npm run gen:sitemap   # public/sitemap.xml from books.ts (+ future structured data)
&& tsc                   # typecheck
&& vite build            # bundle → dist/ (copies public/, incl. fresh sitemap)
&& npm run gen:version   # dist/version.json (commit SHA), AFTER vite wipes dist/
&& npm run prerender     # Puppeteer snapshots every route; fails build on any error
```

## 13. Extension checklist (every new technical spec must answer)
- [ ] Existing files modified (list) and existing utilities/components reused (list).
- [ ] New files created (list) — placed under `src/lib/`, `src/components/`, `src/data/`.
- [ ] Any new indexable route added to the sitemap source and prerendered?
- [ ] Any persistence routed through the storage abstraction with graceful degradation?
- [ ] Any new content data made the source of truth for generation/validation?
- [ ] Analytics events added to `FunnelEvent` (aggregate dims only)?
- [ ] Cookie-free preserved (ADR-001)? Tests added to the existing runners?
- [ ] Out-of-scope technologies explicitly named and avoided?

## Related documents
- `docs/adr/ADR-001-cookie-free-architecture.md` — the cookie-free decision record.
- `docs/architecture/DATA_ARCHITECTURE.md` — entity/relationship definitions (Sprints 6–8).
- `docs/architecture/CONTENT_VALIDATION_SPEC.md` — CI content validation.
- `docs/testing/COOKIE_FREE_TEST_SPEC.md` — permanent cookie-free test suite.
- `docs/sprints/SPRINT_{6,7,8}_TECHNICAL_IMPLEMENTATION.md` + matching `_TEST_PLAN.md`.
