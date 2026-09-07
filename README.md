# Story Time with Eva — storytimewitheva.com

Trilingual (EN/ES/FR) marketing + catalog site for the Eva Gallo children's-book
collection. React + Vite + TypeScript + Tailwind, statically prerendered and
deployed on Netlify with a small set of Netlify Functions for the email funnel.

> Operational detail (accounts, MailerLite, DNS, troubleshooting, "how do I add a
> book / lead magnet") lives in **[RUNBOOK.md](RUNBOOK.md)**. This file is the
> engineering quickstart.

## Tech stack
- React 18 + TypeScript, React Router v6 (path-prefix i18n: `/`, `/es/`, `/fr/`)
- Vite 5 build; Tailwind 3
- **Static prerender** of every route via Puppeteer (`scripts/prerender.mjs`) —
  there is deliberately **no SPA catch-all**, so an unknown URL returns a real 404
- **Netlify Functions** (`netlify/functions/`): `subscribe.mjs` (server-side
  MailerLite signup — the money path), `_ratelimit.mjs`, `_verify.mjs`,
  `_pinterest.mjs`
- Analytics: Plausible only (cookieless, no PII)

## Getting started
```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # full production build (see pipeline below)
npm run preview    # preview the built site
npm test           # headless funnel tests
npm run test:seo   # per-route SEO assertions
```

## Build pipeline (`npm run build`)
Runs in this order (see `package.json`):
1. `gen:downloads` — regenerates `public/_redirects` (stable `/download/<magnet>` links) from the hashed PDFs in `public/`
2. `gen:sitemap` — regenerates `public/sitemap.xml` from `src/data/books.ts` + routes
3. `tsc` — typecheck
4. `vite build` — bundle to `dist/`
5. `gen:version` — stamps `dist/version.json` with the commit SHA (deploy provenance)
6. `prerender` — Puppeteer snapshots every route to its own `index.html`

The prerender step is **required**: if Chromium can't launch or any route fails,
the build fails and Netlify keeps the last good deploy.

## Deployment
Netlify only (config in `netlify.toml`), auto-deploying on push to `main`.
The build wires up Netlify Functions, Netlify Forms (the static contact/feedback
forms in `index.html`), the generated redirects, security headers, and the CSP —
so "drag-and-drop `dist/`" or a generic static host (Vercel / GitHub Pages /
Cloudflare Pages) would **silently drop the subscribe Function and Forms**. Don't.

**Required environment variable:** `MAILERLITE_API_KEY` (set in Netlify → Site
configuration → Environment variables). Optional: `PINTEREST_CONVERSIONS_TOKEN`.
See `.env.example`.

## Adding a book / lead magnet
See RUNBOOK.md → "Want to add a new book to the site". In short: add the entry to
`src/data/books.ts` (cover via a remote Amazon CDN URL or a local
`src/assets/covers/*.webp` import), then `npm run build` — the sitemap and the new
prerendered routes are regenerated automatically.
