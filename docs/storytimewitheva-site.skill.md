---
name: storytimewitheva-site
description: >
  Resume guide for the Story Time with Eva site (storytimewitheva.netlify.app) —
  a static Vite + React + TypeScript site that consumes pieces of a Base44 export.
  Covers repo layout, architecture decisions (TSX shadcn shims, no Radix deps,
  @/ alias, localStorage tracking), Netlify deploy flow, the mounted-FS hand-off
  pattern, and how to keep the PUNCH_LIST.md in sync.

  ALWAYS trigger for: any work on the storytimewitheva site or repo, any mention of
  storytimewitheva.netlify.app, the PawaSeyni/storytimewitheva GitHub repo, the
  Base44 Eva Storyland import, ports from base44-app/ into src/, or the interactive
  demos under /activities/{slug}. Also trigger on: "story time with eva site",
  "storytimewitheva", "PUNCH_LIST.md", "base44-app/", "Eva Storyland port",
  "DemoPage wrapper", "shim Button/Card", or anything that touches the project's
  netlify.toml, vite.config.ts, src/demos/, or src/components/ui/ shims.

  Hands off to eva-gallo-collection for any book-content / imprint-voice
  decisions, to picture-book-creator for new picture book drafting, and to
  book-launch for marketing tasks.
---

# Story Time with Eva — Site Resume Guide

This skill exists so any Claude session can pick up work on the
storytimewitheva.netlify.app codebase without re-discovering the architecture,
conventions, or the mounted-FS quirks of the Cowork sandbox.

**Read `PUNCH_LIST.md` in the repo root first.** That's the live state. This
skill covers the patterns and decisions; PUNCH_LIST covers what's done vs left.

To install this as an auto-loading skill, copy this file (or just the body
below the frontmatter) into one of Claude's skills directories — for example
`~/.claude/skills/storytimewitheva-site/SKILL.md` on the user's Mac. Until
then, a fresh Claude can find this with `Read` or `Grep` from the repo.

---

## Where everything is

- **Live site:** https://storytimewitheva.netlify.app
- **GitHub repo:** https://github.com/PawaSeyni/storytimewitheva (public, on `main`)
- **Netlify project:** `storytimewitheva` under the Pawa Data Services team
- **Local checkout:** `/Users/papasnguer/Desktop/Completed Books/Eva/storytimewitheva/`
- **Sandbox path (Cowork bash):** `/sessions/jolly-kind-hawking/mnt/Eva/storytimewitheva/`

Auto-deploy: every push to `main` triggers Netlify, which runs `npm run build`
(i.e. `tsc && vite build`) and publishes `dist/`. Typical deploy: ~12s.

---

## Repo layout

```
storytimewitheva/
├── netlify.toml              # publish=dist, npm run build, SPA fallback, security headers
├── vite.config.ts            # @ alias → ./src
├── tsconfig.app.json         # baseUrl + paths for @
├── tailwind.config.js        # purple primary + orange/pink/yellow accents
├── package.json              # react, react-router-dom, lucide-react, tailwindcss
├── PUNCH_LIST.md             # ← live tracking doc, update on every PR
├── base44-app/               # original Base44 ZIP export, NOT built (reference only)
├── src/
│   ├── App.tsx               # all routes incl. /activities/{slug}
│   ├── main.tsx
│   ├── index.css             # .btn-primary, .hero-bg, star-float keyframe
│   ├── components/
│   │   ├── Navbar.tsx, Footer.tsx, BookCard.tsx, EmailSignup.tsx
│   │   └── ui/               # Button.tsx, Card.tsx, Input.tsx, Textarea.tsx (shim layer)
│   ├── data/books.ts
│   ├── pages/                # Home, Books, Activities, About, Contact, Resources, DemoPage
│   └── demos/                # 8 ported demos, all TSX, all English-only
└── docs/storytimewitheva-site.skill.md   # this file
```

---

## Core architecture decisions (don't break these)

1. **shadcn-shaped shims, no Radix.** `src/components/ui/{button,card,input,textarea}.tsx`
   match the shadcn API (e.g. `<Button variant="outline" size="lg">`) using only
   Tailwind classes. Ported demos import `@/components/ui/button` and just work.
   **Do not** add `@radix-ui/*` deps just to support one new component — either
   write another shim or pick a different pattern.

2. **`@/` resolves to `./src`.** Set in both `vite.config.ts` (`resolve.alias`)
   and `tsconfig.app.json` (`paths`). Keep both in sync if you ever change this.

3. **English-only strings, inlined.** The Base44 source had `en` / `es` / `fr`
   translation blocks; we strip to English and inline the strings. If you ever
   add multilingual support, do it via a context provider, not by restoring the
   translation block pattern.

4. **`localStorage` for any persisted state.** No backend, no auth. Examples:
   `AdventureJournalDemo` (key: `adventureJournal`), `BookmarkCraftsDemo`
   (key: `bookmarkDesign`). Profile page tracking should follow the same
   pattern (key suggestion: `readingProgress` with `{ booksRead: number[],
   wantToRead: number[], activitiesCompleted: string[] }`).

5. **One route per demo:** `/activities/{slug}` for each interactive demo.
   Wrap each route with `<DemoPage>` so users get the "← Back to Activities"
   affordance.

6. **Strip Base44 SDK calls** when porting:
   - `import { base44 } from "@/api/base44Client"` → remove
   - `import { useAuth } from "@/lib/AuthContext"` → remove
   - `base44.entities.Foo.list(...)` → replace with static data or `localStorage`
   - `base44.integrations.Core.InvokeLLM(...)` → replace with hand-curated static
     content (see `PuzzleAdventuresDemo` for the pattern)
   - `<ProtectedRoute>` → just render the children
   - `ActivityStatusButton` / `BookStatusButton` → reimplement with localStorage

7. **Replace shadcn `Dialog` with inline expanded panels.** See `CraftCornerDemo`
   for the pattern — when a "modal" is needed, render an inline expanded
   section conditionally rather than adding Radix Dialog.

---

## Visual / brand conventions

- **Primary color:** purple (`from-purple-500 to-pink-500` for primary CTAs).
- **Section dividers:** thin gradient bar under titles. Color shifts by section
  theme — orange/pink for books, blue/purple for "How It Works", purple/pink
  for testimonials, cyan/blue/purple for activities.
- **Activity cards:** 2px gradient top strip (`from-cyan-400 via-blue-400 to-purple-400`),
  badge in top-right corner overlay (green "Live", orange "Soon").
- **Featured badges:** gradient yellow-orange pill with ⭐, top-right of card.
- **Hero:** `hero-bg` class (purple-pink gradient) + floating `⭐ 🌙 ✨ 🎨`
  emoji with `star-float` animation.
- **Section padding:** `py-20` on major sections, not `py-16`.

---

## Cowork mounted-FS quirks (REQUIRED reading)

The sandbox mounts the user's repo with permission quirks that bite predictable
ways. Don't waste time on these — apply the known workarounds.

### Git from the sandbox fails on commit/push

`git add` and `git commit` from sandbox bash succeed at writing files but leave
stale `.git/index.lock` files the sandbox can't unlink (EPERM). Push also fails
because the sandbox doesn't have the user's GitHub credentials.

**The hand-off pattern:** prepare the working tree from the sandbox (Edit/Write
files), then give the user a single command to paste into Terminal on their
Mac. The Mac shell can delete the locks and uses macOS Keychain for auth.

```bash
cd "/Users/papasnguer/Desktop/Completed Books/Eva/storytimewitheva" && \
rm -f .git/index.lock .git/HEAD.lock && \
git add <specific files> && \
git commit -m "..." && \
git push origin main
```

Always list explicit files in `git add` rather than `git add .` — that way you
don't accidentally commit `base44-app/` updates or stray build artifacts.

### vite build fails to clear an existing `dist/`

Same EPERM issue. To verify a build from the sandbox, build to a fresh
out-of-tree directory:

```bash
cd "/sessions/jolly-kind-hawking/mnt/Eva/storytimewitheva" && \
npx vite build --outDir /sessions/jolly-kind-hawking/mnt/outputs/storytimewitheva-dist-vN --emptyOutDir
```

Increment `vN` each time. Also run `npx tsc --noEmit` separately — that's what
Netlify will trip on. The in-tree `dist/` is fine to leave stale; Netlify
generates its own on each deploy.

### Protected paths

Don't try to write to `.claude/` from inside the repo — the Write tool blocks
it. Use `docs/` for any Claude-facing documentation that lives in the repo.

---

## Workflow: porting one more thing from base44-app/

1. Read `base44-app/src/<file>.jsx` — note translations (`text.en/es/fr`),
   Base44 SDK calls, and any `@/components/ui/{X}` that we don't yet shim.
2. If a needed shim doesn't exist, add it under `src/components/ui/{x}.tsx`
   matching the shadcn API. Don't add Radix.
3. Write `src/<dest>/<Name>.tsx` with:
   - Inlined English strings
   - Strict types on `useState` etc.
   - Base44 SDK calls replaced (localStorage / static content / removed)
4. Add the route in `src/App.tsx`, wrap with `<DemoPage>` if user-facing.
5. Run `npx tsc --noEmit` and `npx vite build --outDir ...` from sandbox.
6. Update `PUNCH_LIST.md` — move item from Backlog to Completed.
7. Give the user the hand-off `git add + commit + push` command.
8. Once Netlify deploys (~12s), visit the new URL via Claude in Chrome MCP to
   verify visually.

---

## Bundle budget

Stay disciplined here — current numbers as of last update:

- **88 kB JS gzipped** (1,780 modules, lucide-react tree-shakes to ~10 kB used)
- **8 kB CSS gzipped**
- Build: ~2.4 s
- Netlify deploy: ~12 s

Things that would blow the budget: `framer-motion` (+20 kB), full `@radix-ui/*`
suite (+30–50 kB), `recharts` (+80 kB), `three.js` (+150 kB). Avoid unless
there's a strong reason.

---

## Hand-off communication style

- Always **show the user the exact command** to run for the push, not a
  paraphrase. They paste it.
- After verification on the live site, summarize what landed in a short bulleted
  list with URLs and bundle deltas.
- If something blocks, surface it explicitly with a recommendation rather than
  burning more attempts. Examples: missing shim primitive → propose adding a shim.
  Permission tier prevents click → ask user to confirm tier change.

---

## Update protocol for PUNCH_LIST.md

Whenever a PR lands:
1. Move the relevant items from **Backlog** → **Completed**.
2. If new things were skipped intentionally, add to **Intentionally skipped**.
3. If new TODOs surfaced, append them to **Backlog**.
4. Append a one-line entry to the **Update log** at the bottom with date and
   what shipped.

Treat `PUNCH_LIST.md` as the canonical state of the project — if it disagrees
with reality, the doc is wrong, update the doc.
