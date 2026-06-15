# TikTok and Threads — profile copy + content plan

Companion channels for storytimewitheva.com. Threads already exists and is wired
across the site (`@evagallo.books`). This doc covers the TikTok launch and a
shared content plan for both.

## Handle

TikTok handle: **`@evagallo8`** (claimed 2026-06-15, after the cleaner variants
were all taken — the BookTok username namespace is heavily squatted). The
display name stays "Story Time with Eva", so the handle reading slightly off
brand does not matter much.

Wired into the site: Footer social row, Contact sidebar, and the `/links` page,
linking to `https://www.tiktok.com/@evagallo8`.

## TikTok profile copy

- Handle: `@evagallo8`
- Display name: `Story Time with Eva`
- Bio (fits the 80-character limit):
  `Bilingual picture books & activities for curious kids 📚 EN · ES · FR`
- Bio link: `https://storytimewitheva.com/links` (routes to all channels + the
  free starter kit, so the single allowed link does the most work)
- Category: Education / Publisher
- Profile photo: the rooster + wordmark brand mark (same as other channels)

## Threads (already live)

The account exists and links work. Suggested bio refresh (fits 150 chars):
`Multicultural bilingual picture books by Eva Gallo. Read-alouds, free activities, and gentle stories of kindness, courage & wonder. EN · ES · FR`

Threads strategy: mostly text. Cross-post the caption/hook from each Instagram
or TikTok post, plus standalone questions and short tips. 3 to 4 posts a week.

## Content pillars (both platforms, repurpose what already exists)

Everything below is built from assets you already have — no new production
pipeline required.

1. **Read-aloud clips** — 30 to 60s of a book's opening, read warmly, with the
   text on screen in two languages. Source: the books + the site's read-aloud.
2. **Word of the day** — one word in EN / ES / FR with the emoji and a kid
   example. Source: the Word Explorer word bank + tap-to-translate dictionary.
3. **Activity process videos** — satisfying time-lapse of a coloring page,
   bookmark, or craft being made. Source: the 12 games + craft/coloring demos.
4. **Theme picks** — "a book for a child who is learning kindness / courage /
   patience / wonder". Source: the 18 books and their themes.
5. **Eva's story** — short, warm author moments (real grandmother, retired
   public-health worker). Source: the About page narrative.

## Two-week starter calendar (TikTok, 3 posts/week)

| Day | Pillar | Idea |
|---|---|---|
| Wk1 Mon | Read-aloud | Opening of *The Sparrow Who Saved the Forest*, EN with ES subtitles |
| Wk1 Wed | Activity | Time-lapse: design a bookmark in the Bookmark Designer |
| Wk1 Fri | Word of the day | "kindness / bondad / gentillesse" with examples |
| Wk2 Mon | Theme pick | "3 books for a child learning to be brave" |
| Wk2 Wed | Read-aloud | *A Little Boat's Big Wish*, bilingual |
| Wk2 Fri | Eva's story | Why a retired public-health worker writes kids' books |

Batch-film in one or two sessions. Re-use each TikTok as an Instagram Reel; pull
its hook into a Threads text post the same day.

## Wiring (done 2026-06-15)

The TikTok link (`https://www.tiktok.com/@evagallo8`) is wired in three places,
matching the existing social pattern:

- `Footer.tsx` social row — `<a aria-label="TikTok @evagallo8">` with the 🎵 icon
- `Contact.tsx` sidebar — alongside Amazon/Instagram/YouTube
- `Links.tsx` — a `tiktokCta` row (EN/ES/FR) in the Follow Along section

No em dashes in any user-facing copy, per the site convention.
