# Story Time with Eva — Punch List

Living tracking doc for the storytimewitheva.netlify.app site, originally
forked off the Base44 `Eva Storyland` export. Update this file as work
progresses — it's the canonical "what's done / what's not" record.

**Live site:** https://storytimewitheva.netlify.app
**GitHub repo:** https://github.com/PawaSeyni/storytimewitheva
**Netlify project:** storytimewitheva (Pawa Data Services team)
**Base44 source:** preserved verbatim under `base44-app/` on `main`

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
- [x] 3 newer titles (Colors Mixed Up, Rainbow Symphony, Tower) sourced from local KDP metadata
- [x] Replaced emoji "covers" with real cover images
- [x] 8 books hot-link Amazon's CDN (m.media-amazon.com)
- [x] 3 not-yet-on-Amazon books use locally hosted 800×800 JPGs (~165 KB each) under `src/assets/covers/`
- [x] `BookCard` updated to render `<img>` with `loading="lazy"` + hover zoom
- [x] Modal updated to show full cover image at top + subtitle line

### Phase 7 — SEO basics
- [x] `react-helmet-async` installed (+4 packages, ~5 KB gzipped)
- [x] `index.html` carries only truly-invariant defaults (charset, viewport, theme-color, favicon, og:type/site_name/locale, twitter:card, fallback title + description for no-JS clients)
- [x] All per-route-variable tags (title, description, og:title/url/image/desc, twitter:* content, canonical) live exclusively in Helmet so they appear exactly once in the DOM
- [x] `src/components/Seo.tsx` reusable component (title + description + image + path + bare + noindex props)
- [x] Per-route SEO on Home, Books, Activities, About, Contact, Resources, Profile (noindex), and every DemoPage (derived from activity slug)
- [x] `public/robots.txt` — Allow-all + Disallow /profile + sitemap pointer
- [x] `public/sitemap.xml` — 14 routes (home + books + activities + 8 demos + resources + about + contact). Profile excluded.

**Known limitation:** the static `<meta name="description">` fallback in `index.html`
is duplicated by Helmet's per-route description on subroutes (so two
`<meta name="description">` exist on `/activities/bingo`, for example). This is
intentional — most non-JS social scrapers need the static fallback to get any
description at all, and modern JS-rendering crawlers (Googlebot, FB scraper)
correctly pick the more specific Helmet version. A future improvement, if perfect
per-route OG unfurls become important, would be build-time prerendering (e.g.
`vite-plugin-prerender` or migrating to Astro). Tracked in Backlog → Mid-term.

### Phase 8 — Lighthouse audit (PageSpeed Insights / Mobile)
- [x] `@netlify/plugin-lighthouse` configured in `netlify.toml` for 5 audited routes (/, /books, /activities, /activities/story-builder, /about). Plugin runs but report HTML isn't surfaced in Netlify's free-tier UI — used PageSpeed Insights manually for visibility.
- [x] Round 1 contrast fixes: bumped EmailSignup button bg from orange-400 → -600, footer copyright text from gray-500 → -400. Accessibility 94 → still 94 (orange-600 + white = 2.97:1, not enough).
- [x] Round 2 contrast + heading fixes: bumped button to bg-orange-700 (4.92:1, passes AA), and changed Footer column headings `<h4>` → `<h3>` so the page hierarchy is h1→h2→h3 (was skipping h3).
- [x] **Final mobile scores: Performance 95, Accessibility 100, Best Practices 100, SEO 100.**

---

## 🚫 Intentionally skipped (from Base44)

These were on the Base44 version but deliberately left out. Document the
reason so we don't accidentally redo them without checking the trade-off.

| Skipped | Why |
|---|---|
| Spanish / French translations on all pages and demos | Site is English-only for now. Each demo has its English strings inlined; adding back would mean either restoring translation blocks or wiring a language-context provider. |
| `@base44/sdk` and `@base44/vite-plugin` | Base44-specific backend client. We're static-hosted on Netlify. |
| `AuthContext`, `ProtectedRoute`, `UserNotRegisteredError`, `app-params.js`, `base44Client.js` | Auth pieces that only work inside Base44's runtime. |
| `UserProgress` entity (Base44 backend storage) | We use `localStorage` for progress tracking instead. |
| `BookStatusButton`, `ActivityStatusButton` (server-backed tracking) | Will be reimplemented as localStorage-backed components. |
| `ProtectedRoute` route guards | No auth on the static site. |
| AI puzzle generator (`base44.integrations.Core.InvokeLLM`) | Replaced with hand-curated static hints per puzzle. |
| shadcn `Dialog` primitive (used in CraftCorner) | Replaced with inline expanded detail panel to avoid the full Radix Dialog dep. |
| `AgeSelector` component (lazy-loaded on Home) | Recommended only after we have real reader segments. |
| `RecommendationEngine` component (lazy-loaded on Home) | Same — needs real data and tracking signal. |
| `GlobalSearch` modal | Useful, but adds non-trivial state + keyboard handling. Defer until books grow. |
| `NewsletterSignup` from Base44 | We keep our existing `EmailSignup` component (already wired). |
| `PerformanceUtils`, lazy-loading scaffolding, `batchEntityRequests` | Over-engineered for a small static site. |
| Trust-badge content "10,000+ Happy Families" / "4.9/5 Parent Rating" / "100+ Free Activities" | Replaced with our truthful "6+ Magical Books / 3 Languages / 4.9/5 Amazon Rating" stats. |
| `framer-motion`, `canvas-confetti`, `three.js`, `react-leaflet`, `jspdf`, `html2canvas`, `react-quill`, `recharts`, `react-day-picker`, `embla-carousel`, `vaul`, `react-resizable-panels` | All Base44 deps not actually needed by any ported demo. Bundle stays lean. |
| Toast notifications (`window.showToast`) | Using `alert()` placeholders where needed. Can swap for a real toast later. |
| `ActivityDemo` page (Base44's dedicated demo viewer) | Replaced with one route per demo under `/activities/{slug}`. |
| 45 of 49 shadcn primitives under `src/components/ui/` | Only ported the 4 we actually use (Button, Card, Input, Textarea). |

---

## 📋 Backlog (not started)

Prioritize roughly top-to-bottom. Add new items as discovered.

### Near-term (high signal, low risk)
- [ ] **Profile page + localStorage tracking** (in progress — see Phase 5 below once shipped)
- [ ] Real book content from Eva Gallo collection (current `src/data/books.ts` may be placeholder)
- [ ] Replace emoji book "covers" with actual cover image assets
- [ ] SEO basics: `sitemap.xml`, `robots.txt`, per-route `<title>` and `<meta>` (use react-helmet-async or inline)
- [ ] Open Graph tags so links share well on social
- [ ] Run Netlify Lighthouse plugin, address red flags

### Mid-term (meaningful work)
- [ ] Custom domain (e.g. `storytimewitheva.com`) attached to Netlify, DNS, HTTPS
- [ ] Build-time prerendering for perfect per-route OG unfurls on non-JS scrapers (e.g. `vite-plugin-prerender` or migrate to Astro). Currently each subroute's description duplicates the static homepage fallback in the DOM — modern crawlers handle this correctly but a non-JS Twitterbot would only see the static one.
- [ ] Multilingual support (ES/FR) restored — likely via a language context + translation files
- [ ] Lightweight global search (subset of Base44's, no modal — inline page-search)
- [ ] Toast notification component to replace `alert()` calls
- [ ] Accessibility audit (axe-core or Lighthouse a11y), fix focus management on demo modals
- [ ] Mobile responsiveness pass — particularly the wide demo layouts (Bookmark Designer, Bingo grid)
- [ ] Analytics (Plausible, Fathom, or GA4)

### Long-term / nice-to-have
- [ ] Real book recommendation logic (subset of Base44's `RecommendationEngine`, no backend)
- [ ] User-generated puzzle bank (currently 3 scrambles, 5 riddles, 4 matches, 1 logic — could grow)
- [ ] Coloring demo: add more template scenes, save-to-localStorage gallery
- [ ] Bookmark designer: actual PDF export instead of `window.print()`
- [ ] Craft Corner: download a printable PDF "craft guide" per craft
- [ ] Activities tracking → simple personal stats page (uses same localStorage as Profile)
- [ ] Decide on Profile auth (skip / add Netlify Identity / add Supabase) if multi-device sync becomes a need

---

## 🛠 Operational notes for future Claude sessions

### Repo layout
```
storytimewitheva/
├── src/
│   ├── App.tsx              ← routes
│   ├── main.tsx
│   ├── index.css            ← .btn-primary, .hero-bg, star-float keyframe
│   ├── components/
│   │   ├── Navbar.tsx, Footer.tsx, BookCard.tsx, EmailSignup.tsx
│   │   └── ui/              ← Button, Card, Input, Textarea (shadcn-shaped shims)
│   ├── data/books.ts
│   ├── pages/               ← Home, Books, Activities, About, Contact, Resources, DemoPage
│   └── demos/               ← 8 ported demos as TSX
├── base44-app/              ← original Base44 export (not built, kept for reference)
├── netlify.toml
├── tailwind.config.js       ← purple primary + orange/pink/yellow accents
├── vite.config.ts           ← @/ alias to ./src
└── PUNCH_LIST.md            ← this file
```

### Conventions that survived all the ports
- **English-only** strings, inlined. No translation blocks in ported code.
- **`localStorage`** for any persisted state. No backend, no auth.
- **`@/components/ui/{name}`** for shim imports — match shadcn API surface.
- **`/activities/{slug}`** for each interactive demo.
- **Visual:** purple/pink primary, orange/yellow accents, gradient dividers under section titles.

### Mounted-FS quirks (Cowork sandbox only)
- `git add` and `git commit` from the sandbox bash leave stale `.git/index.lock` files that the sandbox can't delete (EPERM). Workaround: hand off the actual `git commit` + `git push` to the user's Mac terminal.
- `vite build` fails to clear an existing `dist/` (same EPERM). Workaround: build to a fresh `outDir` under `/sessions/jolly-kind-hawking/mnt/outputs/storytimewitheva-dist-vN/` and ignore the in-tree `dist/`.
- The handoff command pattern that works:
  ```bash
  cd "/Users/papasnguer/Desktop/Completed Books/Eva/storytimewitheva" && \
  rm -f .git/index.lock .git/HEAD.lock && \
  git add <files> && \
  git commit -m "..." && \
  git push origin main
  ```

### Bundle budget (as of last update)
- 1,780 modules transformed
- **88 kB JS gzipped** (301 kB raw)
- **8 kB CSS gzipped** (53 kB raw)
- Build ~2.4 s, Netlify deploy ~12 s

---

## Update log

- **2026-05-18** — Initial site stand-up, GitHub + Netlify wired. Phase 0–3 of base44 import. 8 demos live.
- _(Add entries here as PR descriptions when phases land)_
