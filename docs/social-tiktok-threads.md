# TikTok, Threads, and YouTube - profile copy + content plan

Companion channels for storytimewitheva.com. Threads already exists and is wired
across the site (`@evagallo.books`); YouTube (`@StoryTimeEva`) and TikTok
(`@evagallo8`) are wired too. This doc covers profile copy for each and a shared
content plan.

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
  free starter kit, so the single allowed link does the most work). GOTCHA:
  TikTok only exposes the clickable Website field in the mobile app and gates it
  behind ~1,000 followers in most regions; the web editor hides it. Set it via
  the app (Profile > Edit profile > Website). The bio (69/80 chars) has no room
  to fit the URL as plain-text fallback without dropping content.
- Category: Education / Publisher
- Profile photo: Pixel the butterfly mascot (see brand-mark note below)

## Threads (already live)

The account exists and links work. Suggested bio refresh (fits 150 chars):
`Multicultural bilingual picture books by Eva Gallo. Read-alouds, free activities, and gentle stories of kindness, courage & wonder. EN · ES · FR`

Threads strategy: mostly text. Cross-post the caption/hook from each Instagram
or TikTok post, plus standalone questions and short tips. 3 to 4 posts a week.

## YouTube profile copy (@StoryTimeEva)

Wired across the site (Footer + Contact). YouTube is video-first, so it is the
natural home for the read-aloud clips (cross-post the TikTok read-alouds here as
Shorts, and build longer full-story read-alouds over time).

- Handle: `@StoryTimeEva`
- Channel name: `Story Time with Eva`
- Description (the "About" text):
  `Multicultural, bilingual picture books and reading activities for curious kids. Story Time with Eva brings the Eva Gallo Collection to life with warm read-alouds in English, Spanish, and French, plus free printables families love. Gentle stories about kindness, courage, and wonder. Grab the free Bilingual Starter Kit and explore everything at storytimewitheva.com.`
- Links (channel "Links" section): `storytimewitheva.com` (primary),
  `storytimewitheva.com/links` (all channels + free kit)
- Profile picture: Pixel the butterfly mascot (see brand-mark note below)
- Banner: 2560x1440 px (keep key content inside the ~1546x423 safe area). Adapt
  the Facebook cover art (book-covers row) or a Pixel + wordmark + tagline
  layout so the look matches across channels.
- Category: Education

Bio link strategy across channels stays consistent: where only one link is
allowed, point it at `storytimewitheva.com/links`.

## Brand-mark note (avatars + banners)

There is no rooster logo, despite earlier notes calling for one. The live site
brand is just the 🐾 paw emoji + the "Story Time with Eva" wordmark; the favicon
is a generic purple mark, not real brand art. For channel avatars use a single
consistent mark across all channels. Recommended: **Pixel the butterfly**
(`src/assets/pixel/hello.svg`), the mascot — it reads clearly at small avatar
sizes where a wordmark would not. Alternative: a paw + wordmark badge if the
owner prefers to keep the site's current mark. Banners can pair the wordmark +
tagline ("Where stories come to life") with Pixel and the book covers.

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
