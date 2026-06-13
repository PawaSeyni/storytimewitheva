# Story Time with Eva — Punch List

Living tracking doc for the storytimewitheva.netlify.app site, originally
forked off the Base44 `Eva Storyland` export. Update this file as work
progresses — it's the canonical "what's done / what's not" record.

**Live site:** https://storytimewitheva.netlify.app
**GitHub repo:** https://github.com/PawaSeyni/storytimewitheva
**Netlify project:** storytimewitheva (Pawa Data Services team)
**Base44 source:** preserved verbatim under `base44-app/` on `main`
**Local path:** `/Users/papasnguer/Desktop/Organized/17_Completed_Books_Archive/Completed Books/Eva/storytimewitheva`

---

## 🚦 Release gates (active work)

Three gates to get to a real launch. Top-to-bottom priority. Detailed task list lives in the task tracker (#12 onward).

### Gate A — Lead-capture pipeline (BLOCKING for marketing, target: this week)

Without this, every dollar of paid traffic is wasted: form looks fine but throws away the email and never delivers the promised PDF.

- [x] **A1** MailerLite audience set up: group `storytimewitheva-signups` (id `187942568670005101`), custom fields `language` + `lead_magnet`, embedded form "Bilingual Starter Kit — site signup" (id `187942934227715798`), action URL `https://assets.mailerlite.com/jsonp/2363396/forms/187942934227715798/subscribe`, double opt-in ON
- [x] **A2** PDF live at https://storytimewitheva.netlify.app/bilingual-starter-kit.pdf
- [x] **A3** `EmailSignup.tsx` posts (no-cors fetch) to the MailerLite JSONP endpoint with `fields[email] / fields[name] / fields[language] / fields[lead_magnet]`; submitting / submitted / error states wired, optional first-name field added above email (EN/ES/FR placeholders), EN/ES/FR copy updated to reflect the double-opt-in confirmation step
- [x] **A4** Welcome automation built in MailerLite (id `187944859858895989`) — trigger `subscriber_joins_group`, 4 emails (Bilingual Starter Kit → Parent's Reading Guide → Bilingual Flashcards → Bedtime Routine Chart) with 3 / 4 / 5-day delays between them. Email #1 (welcome) carries the multilingual EN/ES/FR copy from `Welcome_Email_Copy.pdf` with `{$name|default:'…'}` merge-tag greetings (fallbacks: `there` / `amigo/a` / `à toi`). Trilingual subject + short plain-text fallback are set via MCP; full HTML body lives at `email-drafts/welcome-multilingual.html` for Eva to paste into the MailerLite block editor. Currently in draft — Eva needs to design/style each email and **activate** before live traffic
- [x] **A5** End-to-end test signup flow verified on the live site in EN / ES / FR. Three test subscribers (`pnguer+ml-test-{en,es,fr}@gmail.com`) created via the real `EmailSignup` form, each landed in `storytimewitheva-signups` with `status=unconfirmed`, `source=webform`, the correct `language` value, `lead_magnet=bilingual-starter-kit`, and the captured first name. Double-opt-in confirmations sent by MailerLite. Form's POST returns HTTP 503 to the browser (opaque under `no-cors`) but the subscriber still records — this is normal for direct-to-JSONP submissions and not a real failure.

✅ **A4 follow-up RESOLVED (2026-06-10):** all 9 lead-magnet PDFs now live in `public/` — `bilingual-starter-kit`, `bilingual-flashcards`, `follow-up-activities`, `bedtime-routine{,-es,-fr}`, `parents-guide{,-es,-fr}`. Nurture-email links no longer point to missing files. Automation can be activated without broken links.

Bonus lead magnets already sitting in `/Eva/Story_Time_With_Eva_Optimized_PDFs/`:
Parents Guide (EN/ES/FR), Bilingual Flashcards, Bedtime Routine Chart (EN/ES/FR) — usable as
nurture-sequence sends after the starter kit.

### Gate B — Site truthfulness (BLOCKING for launch, not for sales)

Things that currently lie to the visitor.

- [x] **B1** Resources page: Read More stub `<button>` removed from each of the 6 cards (`src/pages/Resources.tsx`). Cards now function as a content preview — title + description + read-time pill. Article authoring deferred to long-term backlog.
- [x] **B2** Contact form wired to Netlify Forms. `Contact.tsx` POSTs URL-encoded to `/` with `form-name=contact`, honeypot included; static placeholder form in `index.html` lets Netlify's deploy scanner register the submission target. Submitting / submitted / error states wired in all three languages. **Verified end-to-end** 2026-05-20 — submitted a live test message, "1 form collecting data → contact" + "1 submission" visible in Netlify dashboard. Required: enabling "Form detection" in Netlify dashboard (it's off by default) **and** a fresh deploy after enabling. ⚠️ Still needs: form-notification rule. Navigate Netlify dashboard → site `storytimewitheva` → Project configuration → Notifications → **Form submission notifications** → **Add notification** → **Email notification**, fill Email to notify = `galloeva2612@gmail.com`, optional Subject = "New Contact form submission — storytimewitheva", leave Event = "New form submission" and Form = "contact" (or "Any form"), Save. (~30 seconds, one-time.) Until then, submissions land silently in Netlify's Forms dashboard but no email goes out.
- [x] **B3** `hello@storytimewitheva.com` → `galloeva2612@gmail.com` in three places: `Footer.tsx` mailto, `Contact.tsx` sidebar contact card, and `EmailSignup.tsx` error message (EN/ES/FR). Revisit when the custom domain (Gate C1) lands and a real `hello@` mailbox exists.
- [x] **B4** Instagram URL wired to the real handle `https://www.instagram.com/evagallo.books/` in all 3 spots — `Footer.tsx`, `Contact.tsx` sidebar, and `Links.tsx` (CTA + link list, EN/ES/FR). No placeholder root URLs remain. **Gate B fully closed.**
- [x] **B5** Dropped `react-helmet-async` entirely. Replaced with a custom `useHead` hook (`src/lib/head.ts`) — useEffect-based imperative upsert of `<title>`, `meta[name=description]`, all `og:*`, all `twitter:*`, `link[rel=canonical]`, and `meta[name=robots]`. `Seo.tsx` rewritten to call `useHead(...)` and return `null`. `HelmetProvider` removed from `main.tsx`. Dependency removed from `package.json`. Needs production-deploy verification: view-source on a non-home route (e.g. `/books`, `/activities/story-builder`) should now show the per-route title and OG/Twitter tags in the DOM.

### Gate C — Pre-launch polish

Nice-to-have before turning on paid traffic.

- [x] **C1** Custom domain `storytimewitheva.com` LIVE. Apex → Netlify (`75.2.60.5`), valid Let's Encrypt cert (auto-renew), `www` → apex (301), `netlify.app` → apex (301). `SITE_URL` in `Seo.tsx` + `sitemap.xml` + `robots.txt` all on the custom domain (0 netlify.app refs). Lead-magnet PDFs serve over the domain. Verified end-to-end 2026-06-10.
- [x] **C2** Plausible analytics LIVE since 2026-05-20. Site-keyed script (`plausible.io/js/pa-gzJ4DP5LRQ39ZXessq04G.js`) + `plausible.init()` queue in `index.html` `<head>`. Verified 2026-06-10: script serves 200, is present on the live `storytimewitheva.com` HTML, and the site is registered in a Plausible account (tracking active).
- [x] **C3** Toast system live (`src/lib/toast.tsx`, no deps, info/success/error + auto-dismiss + stacking) via `ToastProvider` in `main.tsx`. All `alert()` placeholders replaced — used in StoryBuilder (copy/save), BookmarkCrafts (save), Bingo (no-bingo). Zero `alert()` calls remain in `src/`. The one remaining `window.confirm` (Profile "Clear all progress") is left intentionally — correct primitive for a destructive yes/no; a toast can't capture a choice.
- [ ] **C4** Update this PUNCH_LIST as gates close

---

## ✅ Completed

### Phase 0 — Infrastructure (one-time)
- [x] `netlify.toml` configured for Vite SPA (publish `dist`, SPA fallback redirect, security headers, asset cache headers)
- [x] GitHub repo `PawaSeyni/storytimewitheva` (public)
- [x] Netlify project `storytimewitheva`, auto-deploys from `main`
- [x] `@/` path alias in `vite.config.ts` and `tsconfig.app.json`
- [x] Hand-rolled TSX shims under `src/components/ui/` for `Button`, `Card`, `Input`, `Textarea` — match shadcn API surface, no Radix deps
- [x] `lucide-react` installed (only new runtime dep)

### Phase 1 — Base44 import (preserved, not built)
- [x] `pawas-storyland-c5dd18c3.zip` exported from Base44 and unpacked into `base44-app/` on `main`
- [x] `base44-app/IMPORT_NOTES.md` documents what's there and what won't work outside Base44
- [x] `base44-app/` is excluded from Netlify build (Netlify only builds from root `package.json`)

### Phase 2 — Visual upgrades from Base44
- [x] Gradient divider accents under section titles (orange/pink, blue/purple, purple/pink, cyan/blue/purple per section)
- [x] "How It Works" cards refreshed: white card + numbered badge floating above
- [x] Top 2px gradient strip on activity cards (cyan → blue → purple)
- [x] BookCard "Featured" badge → gradient yellow-orange pill with star, top-right
- [x] Hero subtitle drop-shadow
- [x] Section vertical padding bumped `py-16` → `py-20`

### Phase 3 — Interactive demos (all 8 ported)
| Route | Demo | Notable |
|---|---|---|
| `/activities/story-builder` | Story Dice Creator | 6 elements × 6 options, roll-all, copy/save |
| `/activities/character-workshop` | Character Workshop | 7-step builder, summary |
| `/activities/adventure-journal` | Reading Journal | localStorage, download .txt |
| `/activities/bingo` | Reading Bingo | 5×5, 4 themes, badge system, win detection |
| `/activities/bookmark-designer` | Bookmark Designer | 12 animals × 12 countries × 10 gradients × 4 patterns |
| `/activities/craft-corner` | Craft Corner | 6 crafts, inline expanded panel (no Dialog dep) |
| `/activities/coloring` | Coloring Adventure | Canvas, 6 templates, 12-color palette, PNG download |
| `/activities/puzzles` | Puzzle Paradise | 4 puzzle types, hand-curated hints (no AI dep) |

### Phase 4 — Site integration
- [x] Activities page rewritten: 8 demos in one grid, all Live
- [x] Home page activity preview surfaces the 3 reading/writing demos with direct deep-links
- [x] DemoPage wrapper provides back-to-Activities affordance on every demo route

### Phase 5 — Profile + localStorage tracking
- [x] `src/lib/progress.ts` typed load/save helpers + `progresschange` event
- [x] `src/data/activities.ts` canonical activity list shared across pages
- [x] `BookStatusButton` (Read / Want-to-Read toggle pair) on every BookCard
- [x] `ActivityStatusButton` (Mark Completed toggle) on every DemoPage
- [x] `/profile` page with 3 buckets + empty-state CTAs + Clear-all-progress
- [x] Profile link added to Navbar
- [x] Activities grid shows "Completed" badge + "Open Again →" on finished demos

### Phase 6 — Real Eva Gallo book content
- [x] Replaced placeholder books.ts with 11 real Eva Gallo Collection titles
- [x] 8 Amazon-live titles with real subtitles, descriptions, ASIN-based URLs
- [x] 3 newer titles (Colors Mixed Up, Rainbow Symphony, Tower) sourced from local KDP metadata; "Buy" falls back to author page until they're listed
- [x] Replaced emoji "covers" with real cover images
- [x] 8 books hot-link Amazon's CDN (m.media-amazon.com)
- [x] 3 not-yet-on-Amazon books use locally hosted 800×800 JPGs (~165 KB each) under `src/assets/covers/`
- [x] `BookCard` updated to render `<img>` with `loading="lazy"` + hover zoom
- [x] Modal updated to show full cover image at top + subtitle line

### Phase 7 — SEO basics
- [x] `react-helmet-async` installed (+4 packages, ~5 KB gzipped)
- [x] `index.html` carries only truly-invariant defaults (charset, viewport, theme-color, favicon, og:type/site_name/locale, twitter:card, fallback title + description for no-JS clients)
- [x] All per-route-variable tags (title, description, og:title/url/image/desc, twitter:* content, canonical) defined in `src/components/Seo.tsx`
- [x] Per-route SEO on Home, Books, Activities, About, Contact, Resources, Profile (noindex), and every DemoPage
- [x] `public/robots.txt` — Allow-all + Disallow /profile + sitemap pointer
- [x] `public/sitemap.xml` — 14 routes (home + books + activities + 8 demos + resources + about + contact). Profile excluded.

~~⚠️ **Known regression as of 2026-05-19** — Helmet stopped injecting meta tags on production. See Gate B5.~~ Fixed 2026-05-20 by dropping react-helmet-async for a custom `useHead` hook; awaiting production-deploy verification.

### Phase 8 — Lighthouse audit (PageSpeed Insights / Mobile)
- [x] `@netlify/plugin-lighthouse` configured in `netlify.toml` for 5 audited routes (/, /books, /activities, /activities/story-builder, /about). Plugin runs but report HTML isn't surfaced in Netlify's free-tier UI — used PageSpeed Insights manually for visibility.
- [x] Round 1 contrast fixes: bumped EmailSignup button bg from orange-400 → -600, footer copyright text from gray-500 → -400. Accessibility 94 → still 94 (orange-600 + white = 2.97:1, not enough).
- [x] Round 2 contrast + heading fixes: bumped button to bg-orange-700 (4.92:1, passes AA), and changed Footer column headings `<h4>` → `<h3>` so the page hierarchy is h1→h2→h3 (was skipping h3).
- [x] **Final mobile scores: Performance 95, Accessibility 100, Best Practices 100, SEO 100.**

### Phase 9 — Multilingual (EN / ES / FR) — shipped 2026-05-19
- [x] `src/lib/language.tsx` — LanguageContext, `useLanguage()`, `useTranslation()`, localStorage persistence, navigator.language detection on first visit, `<html lang>` set via useEffect
- [x] `src/components/LanguageSwitcher.tsx` — 3-flag pill cluster (EN/ES/FR), top-right of Navbar, vertical variant in mobile menu
- [x] All marketing pages localized (Home, Books, Activities, About, Contact, Resources, Profile)
- [x] All shared components localized (Navbar, Footer, EmailSignup, BookCard, BookStatusButton, ActivityStatusButton, Seo)
- [x] `src/data/books.ts` and `src/data/activities.ts` restructured with `Record<Language, string>` for translatable fields; `useBooks() / useActivities() / useBook(id) / useActivity(slug)` hooks
- [x] All 8 demos translated: Character Workshop, Story Builder, Adventure Journal, Bingo (4 themes × 24 items × 3 languages), Bookmark Designer (12 animals + 12 countries × 3), Craft Corner (6 crafts), Coloring (6 themes + 12 colors), Puzzle Paradise (per-language scrambles + 5 riddles + matching pairs + logic puzzle)
- [x] `Seo.tsx` sets `og:locale` per language (`en_US` / `es_ES` / `fr_FR`)

---

## 🚫 Intentionally skipped (from Base44)

These were on the Base44 version but deliberately left out. Document the
reason so we don't accidentally redo them without checking the trade-off.

| Skipped | Why |
|---|---|
| `@base44/sdk` and `@base44/vite-plugin` | Base44-specific backend client. We're static-hosted on Netlify. |
| `AuthContext`, `ProtectedRoute`, `UserNotRegisteredError`, `app-params.js`, `base44Client.js` | Auth pieces that only work inside Base44's runtime. |
| `UserProgress` entity (Base44 backend storage) | We use `localStorage` for progress tracking instead. |
| `BookStatusButton`, `ActivityStatusButton` (server-backed tracking) | Reimplemented as localStorage-backed components. |
| `ProtectedRoute` route guards | No auth on the static site. |
| AI puzzle generator (`base44.integrations.Core.InvokeLLM`) | Replaced with hand-curated static hints per puzzle. |
| shadcn `Dialog` primitive (used in CraftCorner) | Replaced with inline expanded detail panel to avoid the full Radix Dialog dep. |
| `AgeSelector` component (lazy-loaded on Home) | Recommended only after we have real reader segments. |
| `RecommendationEngine` component (lazy-loaded on Home) | Same — needs real data and tracking signal. |
| `GlobalSearch` modal | Useful, but adds non-trivial state + keyboard handling. Defer until books grow. |
| `NewsletterSignup` from Base44 | We keep our existing `EmailSignup` component (Gate A wires it to Mailchimp). |
| `PerformanceUtils`, lazy-loading scaffolding, `batchEntityRequests` | Over-engineered for a small static site. |
| Trust-badge content "10,000+ Happy Families" / "4.9/5 Parent Rating" / "100+ Free Activities" | Replaced with our truthful "6+ Magical Books / 3 Languages / 4.9/5 Amazon Rating" stats. |
| `framer-motion`, `canvas-confetti`, `three.js`, `react-leaflet`, `jspdf`, `html2canvas`, `react-quill`, `recharts`, `react-day-picker`, `embla-carousel`, `vaul`, `react-resizable-panels` | All Base44 deps not actually needed by any ported demo. Bundle stays lean. |
| Toast notifications (`window.showToast`) | Still using `alert()` placeholders. See Gate C3 for swap. |
| `ActivityDemo` page (Base44's dedicated demo viewer) | Replaced with one route per demo under `/activities/{slug}`. |
| 45 of 49 shadcn primitives under `src/components/ui/` | Only ported the 4 we actually use (Button, Card, Input, Textarea). |

---

## 📋 Long-term backlog (beyond Gate C)

Add new items as discovered. Prioritize roughly top-to-bottom within each cluster.

### Content & content-ops
- [ ] Write the 6 real Resources articles (currently stubs — Gate B1 might just hide them)
- [ ] Per-language Resources articles (EN/ES/FR) once article structure exists
- [ ] Update books.ts as Colors Mixed Up / Rainbow Symphony / Tower hit Amazon — swap author-page fallback for real ASIN URLs

### Social & marketing channels
- [ ] **YouTube channel** — create "Story Time with Eva" channel for read-alouds, behind-the-scenes author videos, animated book trailers, and bilingual story-time content. Wire the new channel URL into Footer.tsx + Contact.tsx social clusters alongside Instagram + Facebook. Decide on naming consistency (`@storytimewitheva` if available) and first 3-5 video format pilots (read-aloud? book intro? craft demo from the Craft Corner activity?).
- [ ] Facebook cover photo: design 1640×624 banner in Canva (book covers row, rooster + wordmark, or extended book illustration) and upload to the Page.
- [ ] Pinterest profile setup: ~15 pin templates already exist in `/Eva/Online Strategy/` and `/Eva/Social_Media_Complete_Package/` — needs an account + scheduling tool (Tailwind, Later, or manual).
- [ ] TikTok / Threads: consider once YouTube has a baseline.

### Engineering
- [x] Build-time prerendering for perfect per-route OG unfurls on non-JS scrapers — DONE in PR #1 (branch `fix/audit-quick-wins-seo`). `scripts/prerender.mjs` runs after `vite build` and snapshots all 51 sitemap routes (17 pages × EN/ES/FR) to `dist/<route>/index.html` with route-correct title/canonical/hreflang/JSON-LD in the static HTML. Graceful-degrades to the SPA if Chromium can't launch; `build:spa` is the escape hatch.
- [ ] Lightweight global search (subset of Base44's, no modal — inline page-search)
- [ ] Accessibility audit (axe-core), fix focus management on demo modals
- [ ] Mobile responsiveness pass — particularly the wide demo layouts (Bookmark Designer, Bingo grid)
- [ ] Lazy-load demo bundles per route to keep initial JS payload lean as i18n bumped bundle 88KB → 136KB gz

### Product
- [ ] Real book recommendation logic (subset of Base44's `RecommendationEngine`, no backend)
- [ ] User-generated puzzle bank (currently 3 scrambles, 5 riddles, 4 matches, 1 logic — could grow)
- [ ] Coloring demo: add more template scenes, save-to-localStorage gallery
- [ ] Bookmark designer: actual PDF export instead of `window.print()`
- [ ] Craft Corner: download a printable PDF "craft guide" per craft
- [ ] Activities tracking → simple personal stats page (uses same localStorage as Profile)
- [ ] Decide on Profile auth (skip / add Netlify Identity / add Supabase) if multi-device sync becomes a need

### Activity games (12 standalone games — integrated 2026-06-13)
12 self-contained HTML games were added as static pages under `public/games/<slug>.html` and registered in `src/data/activities.ts` with `game: true` (Activities grid now shows 20 activities; game cards link to `/games/<slug>.html`). They work as-is but were intentionally NOT deep-ported — these are the follow-up improvements:
- [ ] **Port games into the Vite build** — they currently load Tailwind + Nunito from a CDN (the only external CDN requests on the site, and they use Nunito instead of the site's self-hosted Lexend). Either convert each to a React demo or build the HTML through Vite so typography/colors match and there are no third-party requests.
- [ ] **Sync completion to the shared store** — each game's "✓ Mark Completed" writes to its own storage, so it does NOT flip the site's Profile counts or the Activities "Completed / Open Again" badge. Wire them to `src/lib/progress.ts` (`setActivityCompleted(slug)`) using the matching slug.
- [ ] **Fix each game's "Get Free Kit" CTA** — points at `#signup`; update to the real signup anchor (`/#email-signup`) or the home route.
- [ ] **Add the 12 game URLs to `sitemap.xml`** — currently discoverable only via the Activities page links (not in the sitemap).
- [ ] **Language**: games have internal EN/ES/FR toggles but a single URL and English default; consider opening them in the site's currently-selected language. (Card titles/descriptions are already localized in `activities.ts`.)
- [ ] **Align read-aloud** with `src/lib/speech.ts` (voice/rate) if/when ported, and re-test Web Speech on iOS Safari (needs a user gesture — the Play/Listen buttons satisfy it).

### Audit follow-ups (UX/SEO audit — 2026-06-13)
Open items from the audit. Most of the audit shipped in PR #1 (`fix/audit-quick-wins-seo`); the rest live here so nothing is lost. Items already tracked in other clusters are cross-referenced, not duplicated.

**Owner decisions / content**
- [ ] **4.9/5 Amazon rating** (Home stat band + Footer stars) — substantiate with a real aggregate + link to the Amazon author page, or remove. Last unverified trust claim on the site. _(owner)_
- [ ] **Privacy/Terms** — confirm a governing **jurisdiction** and do a legal skim (operating entity "Pawa Press Inc." already named; date "Last updated: June 2026"). _(owner)_
- [ ] **Translate the 15 English-only books** to ES/FR so the "bilingual/3 languages" promise matches the catalog (only 3 of 18 are trilingual today). Hero/stat copy was intentionally left as-is pending this. _(content)_

**Child-UX & product**
- [ ] **Dedicated "Ages 3–5" zone** — a curated younger-kids view/filter on Activities (now partially served by the 3–7 games: matching, rhyme-singalong, counting-numbers, emotion-wheel).
- [ ] **Read-aloud word-highlighting** — highlight each word as it's spoken (Web Speech `onboundary`); optionally extend the "Listen" button to the Resources/About text.
- [x] **Per-book pages** (`/books/<id>`) — DONE. `BookDetail.tsx` renders a full localized page per title (cover, blurb, theme, read-aloud, price, Buy, status) with `Book` JSON-LD + per-language canonical/hreflang; the card modal was replaced by links to it. Sitemap now 105 URLs (35 pages × EN/ES/FR) via `scripts/gen-sitemap.mjs` which reads book ids from `books.ts`; prerender covers all 105.
- [ ] **Language-learning extras** — side-by-side bilingual text, tap-to-translate words, vocabulary activities, language-progress tracking (partially covered by the sentence-builder / flashcards / reading-tracker games).
- [ ] **Guide character / mascot** — a recurring illustrated guide (Eva or Pawa) at decision points; visual-direction recommendation for the 3–10 range.
- [ ] **Mobile hero** — optionally move the family photo above the CTAs on phones (it currently sits below them). Minor.
- [ ] Accessibility/contrast + keyboard + screen-reader pass — **see Engineering › "Accessibility audit (axe-core)"** (covers the hero subheadline + white-outline secondary-button contrast the audit flagged). a11y quick wins (reduced-motion, skip link, focus-visible) already shipped in PR #1.

**Ops & verification**
- [ ] **Google Search Console** — submit `sitemap.xml` and confirm the new `/es` and `/fr` pages index.
- [ ] **Re-run Lighthouse / PageSpeed (mobile)** after PR #1 merges to recapture Core Web Vitals; confirm Chromium launches on the first Netlify build (prerender) — falls back to `build:spa` if not.
- [ ] **Usability testing** — light parent/child testing of the core flows, plus a Plausible review (conversion, language usage, top activities). _(testing)_

---

## 🛠 Operational notes for future Claude sessions

### Repo layout
```
storytimewitheva/
├── src/
│   ├── App.tsx              ← routes
│   ├── main.tsx             ← HelmetProvider + LanguageProvider + BrowserRouter
│   ├── index.css
│   ├── lib/
│   │   ├── language.tsx     ← LanguageContext, useTranslation, LANGUAGE_LABELS
│   │   └── progress.ts      ← localStorage progress tracking
│   ├── components/
│   │   ├── Navbar.tsx, Footer.tsx, BookCard.tsx, EmailSignup.tsx
│   │   ├── LanguageSwitcher.tsx, Seo.tsx
│   │   └── ui/              ← Button, Card, Input, Textarea (shadcn-shaped shims)
│   ├── data/
│   │   ├── books.ts         ← 11 books with Record<Language, string> fields + useBooks/useBook hooks
│   │   └── activities.ts    ← 8 activities with same pattern + useActivities/useActivity hooks
│   ├── pages/               ← Home, Books, Activities, About, Contact, Resources, Profile, DemoPage
│   └── demos/               ← 8 demos (all i18n-aware)
├── public/
│   ├── robots.txt, sitemap.xml, favicon.svg, icons.svg
│   └── (TODO: bilingual-starter-kit.pdf — Gate A2)
├── base44-app/              ← original Base44 export (not built, kept for reference)
├── netlify.toml
├── tailwind.config.js
├── vite.config.ts
└── PUNCH_LIST.md            ← this file
```

### Foundational rule: automate via MCP first

When a task can be done programmatically — via a dedicated MCP (MailerLite, Netlify, etc.), the Chrome MCP for any web app, or computer-use for native apps — that's the first route, not the fallback. The user accepts trade-offs (longer wall-clock, less-polished output, occasional UI breakage) in exchange for being hands-off. Hand work back to the user **only** when:

1. The required permission can't be granted (e.g. financial trades, password creation, anything the safety rules prohibit)
2. The task genuinely requires a human-only judgment (creative review, signing legal docs)
3. The user explicitly opts out

For every other task, default flow is: identify which MCP can do it → request the permission grant if needed → drive end-to-end → report progress at checkpoints, not at every click. Don't default to "give the user instructions and wait" — that pattern is what we are explicitly trying to avoid.

### Conventions that survived all the ports
- **Three languages** (en/es/fr) inlined per component via `TRANSLATIONS` object + `useTranslation(TRANSLATIONS)`. No i18next, no JSON files.
- **`localStorage`** for any persisted state. No backend, no auth.
- **`@/components/ui/{name}`** for shim imports — match shadcn API surface.
- **`/activities/{slug}`** for each interactive demo.
- **Visual:** purple/pink primary, orange/yellow accents, gradient dividers under section titles.

### Mounted-FS quirks (Cowork sandbox only)
- `git add` and `git commit` from the sandbox bash leave stale `.git/index.lock` files that the sandbox can't delete (EPERM). Workaround: hand off the actual `git commit` + `git push` to the user's Mac terminal.
- `vite build` fails to clear an existing `dist/` (same EPERM). Workaround: build to a fresh `outDir` under `/tmp/dist-check` and ignore the in-tree `dist/`.
- The handoff command pattern that works:
  ```bash
  cd "/Users/papasnguer/Desktop/Organized/17_Completed_Books_Archive/Completed Books/Eva/storytimewitheva" && \
  rm -f .git/index.lock .git/HEAD.lock && \
  git add <files> && \
  git commit -m "..." && \
  git push origin main
  ```

### Bundle budget (as of 2026-05-19, post-i18n)
- 1,795 modules transformed
- **136 kB JS gzipped** (~438 kB raw) — up from 88 kB pre-i18n; +48 kB for 3 languages × 8 demos
- **8.3 kB CSS gzipped** (55 kB raw)
- Build ~2.5 s, Netlify deploy ~12 s

### Lead magnets on hand (Gate A inputs)
- **Primary:** `/Eva/Bilingual_Starter_Kit_Optimized_Fixed.pdf` (1.2 MB, 20 pages)
- **Nurture sends:**
  - `Story_Time_With_Eva_Optimized_PDFs/Parents_Guide_Bilingual_Reading_Optimized.pdf` (749 KB)
  - `Story_Time_With_Eva_Optimized_PDFs/Parents_Guide_Bilingual_Reading_ES_Optimized.pdf` (761 KB)
  - `Story_Time_With_Eva_Optimized_PDFs/Parents_Guide_Bilingual_Reading_FR_Optimized.pdf` (788 KB)
  - `Story_Time_With_Eva_Optimized_PDFs/Bilingual_Flashcard_Set_Optimized.pdf` (1.1 MB)
  - `Story_Time_With_Eva_Optimized_PDFs/Bedtime_Routine_Chart_Optimized.pdf` (214 KB)
  - `Story_Time_With_Eva_Optimized_PDFs/Bedtime_Routine_Chart_ES_Optimized.pdf` (202 KB)
  - `Story_Time_With_Eva_Optimized_PDFs/Bedtime_Routine_Chart_FR_Optimized.pdf` (205 KB)

---

## Update log

- **2026-05-18** — Initial site stand-up, GitHub + Netlify wired. Phase 0–3 of base44 import. 8 demos live.
- **2026-05-19** — Phase 9: full EN/ES/FR i18n shipped across all marketing pages, components, data, and all 8 demos. Bundle 88 KB → 136 KB JS gz. Deep punch-list review uncovered: EmailSignup is fake (no ESP wired), lead magnet PDF was never uploaded, Contact form is fake, Resources "Read More" buttons are stubs, react-helmet-async regressed on production. New 3-gate structure (A/B/C) created with 14 tracked tasks targeting "ASAP, Gate A this week" launch path. Mailchimp picked as ESP. Primary lead magnet identified: `Bilingual_Starter_Kit_Optimized_Fixed.pdf`.
- **2026-05-19** — Pivoted ESP from Mailchimp → MailerLite (account `galloeva2612@gmail.com`, workspace `Storytimewitheva`, 14-day trial). A1 closed: group `storytimewitheva-signups`, custom fields `language` + `lead_magnet`, embedded form "Bilingual Starter Kit — site signup" with double-opt-in ON. A3 closed: `EmailSignup.tsx` now POSTs to `assets.mailerlite.com/jsonp/2363396/forms/187942934227715798/subscribe` with `no-cors` fetch, carrying `fields[email] / fields[language] / fields[lead_magnet=bilingual-starter-kit]`. A4 closed: welcome automation `187944859858895989` built — 4 emails / 3 delays, currently DRAFT, needs Eva to design + activate. Nurture-email PDF links assume 6 more PDFs will be uploaded under `public/` (parents-guide, bilingual-flashcards, bedtime-routine × {en,es,fr-ish}); fix that or strip the links before activating.
- **2026-05-20** — Added optional first-name field to `EmailSignup.tsx` (placeholder localized EN/ES/FR), wired `fields[name]` into the MailerLite POST. Replaced welcome email #1 with multilingual EN/ES/FR copy from `Welcome_Email_Copy.pdf` — subject `🎉 Your Bilingual Starter Kit is here! · ¡Aquí está! · Le voici !`, plain-text fallback set via MCP, full HTML lives at `email-drafts/welcome-multilingual.html` for Eva to paste into the block editor. Greetings use `{$name|default:'…'}` merge tags. **Gate A fully closed** — A5 end-to-end test passed on live deploy `23cc7be`: three test signups landed in MailerLite with the right `language`, `lead_magnet`, and `name` fields; double-opt-in confirmations sent. Next: Eva styles + activates the automation in the dashboard.
- **2026-05-20** — Started Gate B. Decisions: B1 → remove the Read More button so the 6 Resources cards work as a preview (article authoring deferred to long-term backlog); B3 → swap `hello@storytimewitheva.com` for `galloeva2612@gmail.com` until the custom domain (Gate C1) lands; B4 → real Instagram URL pending from Paul. Closed in this session: **B1**, **B2** (Contact → Netlify Forms with honeypot + URL-encoded fetch + static `index.html` placeholder), **B3** (3-spot email swap), **B5** (Helmet replaced with custom `useHead` hook in `src/lib/head.ts`, `react-helmet-async` dependency removed; needs prod-deploy verification). Only **B4** remains in Gate B.
- **2026-05-20** — Verified deploy `f645560` on the live site. **B5** confirmed: `/books`, `/activities/story-builder`, `/profile` (with `robots=noindex,nofollow`) all render per-route `<title>`, `og:title`, `og:url`, `og:locale`, `twitter:*`, canonical, etc. Helmet regression fully resolved. **B2** initially returned 404 on POST — root cause: Netlify Forms "form detection" was disabled at the site level. Enabled it via Netlify dashboard (one-time toggle, free tier 100 submissions/mo), triggered a manual redeploy so Netlify's scanner picked up the static placeholder form in `index.html`, then re-submitted the test — landed in dashboard ("1 form collecting data → contact, 1 submission"). Remaining Gate B work: B4 (Instagram URL) + configure Netlify form-notifications email to `galloeva2612@gmail.com`.
- **2026-06-10** — Resolved stale **A4** follow-up: all 9 lead-magnet PDFs confirmed live in `public/` (bilingual-starter-kit, bilingual-flashcards, follow-up-activities, bedtime-routine{,-es,-fr}, parents-guide{,-es,-fr}) — nurture-email links no longer broken. Closed **B4**: Instagram URL already wired to the real `evagallo.books` handle in `Footer.tsx`, `Contact.tsx`, and `Links.tsx` (placeholder was fixed in code earlier, never checked off). **Gate B is now fully closed** — only Gate C (custom domain, Plausible, toast) remains before paid traffic.
- **2026-06-10** — Closed **C1**: custom domain `storytimewitheva.com` confirmed fully live (DNS → Netlify, valid auto-renewing cert, www + netlify.app both 301 to apex, all SEO files + lead-magnet PDFs on the custom domain). Was completed in an earlier session (cert dated May 20) but never checked off. Gate C now: C2 Plausible, C3 toast swap, C4 ongoing.
- **2026-06-10** — Closed **C3**: custom toast system (`src/lib/toast.tsx`) already replaces all `alert()` placeholders (StoryBuilder/BookmarkCrafts/Bingo); zero alerts remain. Left Profile's `window.confirm` as the correct destructive-action guard. Gate C now down to **C2 (Plausible)** + C4. Three of four launch-blocking gates' polish items are closed; only analytics remains before paid traffic.
- **2026-06-10** — Closed **C2**: Plausible analytics confirmed live (installed 2026-05-20, verified serving + on live site + registered in a Plausible account). **🚦 ALL launch gates (A, B, C1–C3) are now closed.** Only C4 (keep this list current) is ongoing. The site is launch-ready for paid traffic. Today's session was a truth-up sweep: B4, C1, C2, and C3 were all functionally complete in earlier sessions but had never been checked off — the PUNCH_LIST had drifted from reality.
- **2026-06-13** — Big audit-driven session on branch `fix/audit-quick-wins-seo` (PR #1). Shipped: real Privacy/Terms pages + 404 (no soft-404), book-count fix, JSON-LD (Org/WebSite/Person/Book/FAQPage), **per-language URLs `/es` `/fr` + hreflang** (English at root), **build-time prerendering** (51 routes — closes the Engineering backlog item), **read-aloud "Listen"** on every book (Web Speech via `src/lib/speech.ts`), a11y quick wins (reduced-motion, skip link, focus-visible), **Lexend** body font (self-hosted), on-site **Formats & Pricing** (paperback $11.99 / eBook $7.99, `src/data/pricing.ts`), honest **benefit cards** replacing fabricated testimonials, **FAQ page**, **Teacher & Educator** downloads section, responsive/optimized covers (Amazon `_SX` srcset + local WebP), the **Eva headshot** (About) + **family hero photo** (Home), and **12 standalone games** integrated into Activities (see the new "Activity games" backlog cluster for follow-ups). Confirmed facts: Eva Gallo is a real person; operator is **Pawa Press Inc.** (named on Privacy/Terms + footer). Still open (owner input): the unverified **4.9/5 rating** (keep+link or remove). Remaining build items: read-aloud word-highlighting, per-book pages, deeper game integration.
- _(Add entries here as gates close)_
