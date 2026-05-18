# Base44 Eva Storyland — Import Notes

Source: Base44 app `68dbe562c0ce1220c5dd18c3` (Eva Storyland) exported as ZIP
on May 18, 2026. Copied verbatim into this directory. Not yet integrated with
the parent project.

## What's here

Full Vite + React + Tailwind project, **JSX (not TSX)**. About 30 feature
components plus 49 shadcn/ui primitives under `src/components/ui/`.

Pages: Home, Books, Activities, ActivityDemo, About, Contact, Resources,
Profile.

Interactive demos: AdventureJournalDemo, BingoDemo, BookmarkCraftsDemo,
CharacterWorkshopDemo, ColoringDemo, CraftCornerDemo, PuzzleAdventuresDemo,
StoryBuilderDemo.

## Things that will NOT work outside Base44 without rework

These pieces talk to Base44's hosted backend (auth + database + functions):

- `src/api/base44Client.js` — creates a `@base44/sdk` client using an
  appId/token injected by Base44's build system at runtime.
- `src/lib/AuthContext.jsx` — auth provider.
- `src/components/ProtectedRoute.jsx` — gates routes by auth state.
- `src/components/UserNotRegisteredError.jsx` — Base44-specific auth error.
- `src/lib/app-params.js` — reads the Base44-injected app params.
- `base44/entities/UserProgress.jsonc` — defines a backend entity (the
  Read / Want-to-Read / Activities-completed store).
- `BookStatusButton`, `ActivityStatusButton`, `FavoritesManager`, the Profile
  page — all read/write `UserProgress` via the SDK.

## Heavy third-party deps to be aware of before merging

Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`), Three.js,
react-leaflet, jsPDF, html2canvas, react-quill, framer-motion,
react-day-picker, embla-carousel, vaul, react-resizable-panels,
canvas-confetti.

## Pick a forward path

1. **Reference only** — leave under `base44-app/`, lift components or copy
   visual ideas into the parent TypeScript app as needed.
2. **Replace the parent app** — make this the new root. Requires either
   removing the Base44 SDK pieces (loses tracking features) or wiring those
   pieces to Supabase / Firebase / Netlify Identity (real work).
3. **Run both side by side** — deploy this as its own Netlify site (would
   still need backend replacements to be useful) and keep the parent as the
   static marketing site.
