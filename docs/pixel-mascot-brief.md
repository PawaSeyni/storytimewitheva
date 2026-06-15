# Pixel the Butterfly — mascot visual-direction brief

A brief for an illustrator to produce final art for Pixel, the Story Time with
Eva reading companion. A working SVG placeholder already ships in the site
(`src/components/Pixel.tsx`); this brief is the spec for upgrading that art.

## Who Pixel is

Pixel is a small, friendly butterfly who flits alongside the reader. She is a
catalog character (she appears in *The Day the Colors Got Mixed Up*) and she
ties visually to the color, wonder, and "butterfly effect" of kindness themes
that run through Eva Gallo's books.

She is a **companion, not a teacher.** She travels *with* the child rather than
instructing from above. Curious, gentle, easily delighted. Think "a friend who
is excited about the same things you are," never "a guide who knows better."

- Audience: children ages 3 to 10 (and the parents reading with them).
- Voice in one line: warm, playful, encouraging, calm. Never hyper, never babyish.
- Gender-neutral read is fine; we refer to her as "she" for convenience.

## Personality range (the poses we need)

The mascot must work in four states. Each maps to a real spot in the product:

| Mood | Where it appears | Feeling |
|---|---|---|
| `hello` (waving) | Home hero, first impression | welcoming, excited to see you |
| `reading` (perched on a word) | beside the tap-to-translate feature | helpful, attentive |
| `praise` (holding a star) | activity completion, quiz wins | proud of you, celebratory |
| `sleepy` (eyes closed, "zzz") | empty states (no books read yet) | gentle, at rest, never sad |

Room to grow later: `thinking`, `pointing` (wayfinding), `reading-along`
(narration), seasonal variants.

## Visual direction

- **Silhouette:** symmetrical butterfly. The symmetry is functional, not just
  pretty: Pixel must stay recognizable shrunk to ~24px tall sitting inline next
  to a word. Keep the shape simple and readable at tiny sizes.
- **Wings:** rounded and soft, not sharp or naturalistic. Upper wings larger,
  lower wings smaller. Decorative "jewel" spots are part of her identity.
- **Face:** expressive but simple. Big friendly eyes with a highlight, rosy
  cheeks, a small smile. The face carries the emotion; avoid busy detail.
- **Antennae:** two, with small rounded tips (currently orange dots). Can be
  used expressively (droop when sleepy, perk up when excited).
- **A little sparkle/trail** is on-brand for her "flitting" movement.

### Palette (matches the site)

Use the existing brand colors so Pixel sits naturally in the UI.

| Role | Hex |
|---|---|
| Upper wings (purple) | `#8b5cf6`, lighter inner `#c4b5fd` |
| Lower wings (pink) | `#ec4899`, lighter inner `#f9a8d4` |
| Wing outline / body | `#6d28d9`, deeper `#581c87` / `#be185d` |
| Jewel accents (orange) | `#fb923c` / `#ea7317`, highlight `#fde68a` |
| Jewel accents (yellow) | `#fbbf24` / `#e0980c` |
| Face / cream | `#fff7ed` |
| Cheeks | `#fda4af` |
| Eyes / pupils | white + `#312e81` |
| Mouth | `#9d174d` |
| Sleepy "zzz" | `#a855f7` |

### Do / don't

- DO keep her huggable and rounded. DO keep edges clean for small sizes.
- DO make sure she reads on both light and dark backgrounds (bright fills, not
  thin lines that vanish on dark). The site supports light/dark.
- DON'T make her photorealistic or insect-accurate (no compound eyes, no
  realistic legs/proboscis). She is a cartoon friend.
- DON'T add cultural or gendered markers (bows, ties, etc.) — she should feel
  universal across the multicultural catalog.
- DON'T introduce new colors outside the palette above.

## Deliverables requested from the illustrator

1. The 4 core poses (`hello`, `reading`, `praise`, `sleepy`) as clean vector
   art (SVG preferred, so it scales and can be themed).
2. A 24px inline version of `reading` that still reads clearly.
3. Source file + exported SVGs named by mood.
4. Optional: 2 to 3 "room to grow" poses listed above.

## How it drops into the site

The site renders `<Pixel mood="hello | reading | praise | sleepy" size={n} />`
(`src/components/Pixel.tsx`). Final art replaces the placeholder SVG markup in
that component, keeping the same prop API and the same `mood` names, so no other
code has to change. Pixel is currently behind a preview flag (`?pixel=1`); flip
the default in `readEnabled()` to launch her for all visitors.
