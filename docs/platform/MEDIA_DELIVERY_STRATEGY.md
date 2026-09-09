# Media Delivery Strategy (S8-005)

What the site serves, how it is sized, cached and checked. Measured in the baseline;
enforced by `budgets.json`, `tests/seo/media.test.mjs`, and the headers in `netlify.toml`.

## Inventory and classes

| Class | What | Weight | Loaded by a page? |
|---|---|---|---|
| Covers | 57 files in `/covers`, local WebP 700×700 for featured titles, Amazon image URLs sized per slot for the rest | 5.7 MB | yes, catalog and book pages |
| App assets | hero photo, author photo, mascot SVGs, icons in `/assets` | 0.5 MB | yes |
| Previews | product shots of the printables, WebP 720 px | 0.4 MB | yes, landing pages |
| Games | 12 static HTML games with inline CSS | 744 KB | yes, on demand |
| PDFs | 14 content-hashed printables and the free book | 20.7 MB | on download only, through `/download/` 302s |
| Campaign assets | 29 Pinterest pin PNGs in `/pins`, ~2 MB each, CORS-enabled for Pinterest | 48.9 MB | never |
| Audio | none: read-aloud is Web Speech synthesis | 0 | |

## Rules

1. **Responsive images.** Every content image carries `width`/`height` (no layout shift), `alt`, `loading="lazy"` except above-the-fold covers (`priority`, the first three on the catalog), `decoding="async"`, and a `srcSet`/`sizes` pair where a sized variant exists. Amazon covers are requested at the slot size through `sizedCover`. The home hero is preloaded with its real hashed URL by the prerender.
2. **Formats.** WebP for photos and covers, SVG for icons and the mascot, PNG only where transparency or a third party (Pinterest) requires it. New raster assets over 300 KB need a reason in the PR.
3. **Caching.** Hashed files (`/assets/*`, `*.pdf`) are `immutable, max-age=1y`; un-hashed images (`*.png`, `*.webp`, `*.svg`) are `max-age=1d, must-revalidate`; `version.json` is `no-store`. A replaced PDF gets a new hash and the `/download/` redirect follows it at build time, so links never rot.
4. **Downloads.** Served only through `/download/<slug>[?lang=]` (302 to the hashed file) or from a gated success screen; raw `/<name>.pdf` paths 301 to the offer page. Every download resource's `localizedFile` flag mirrors the files on disk (tested).
5. **Campaign assets** are not site media. They stay out of every page budget and every page (tested: no prerendered page references `/pins/`). They inflate the deploy artifact by 49 MB; the owner decides whether they move to the marketing bucket outside the repo (punch list PB-05). Until then, each must stay under 3 MB (warn) / 5 MB (fail).
6. **CDN.** Netlify's CDN serves everything; there is no second CDN and no image service. Lighthouse mobile is measured by the Netlify plugin on every deploy.

## Integrity tests

`tests/seo/media.test.mjs`: every `<img>` in every prerendered page has `alt`, `width` and `height`; no page references `/pins/`; every PDF referenced by `_redirects` exists and is hashed; the header rules above are present in `netlify.toml`. `check-budgets` enforces the sizes.
