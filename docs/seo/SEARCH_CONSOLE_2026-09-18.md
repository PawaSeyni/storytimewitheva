# Google Search Console, read 2026-09-18

Property: `https://storytimewitheva.com/` (URL-prefix, verified since June 2026 by the `google-site-verification` meta tag in `index.html`; the DNS is at IONOS, so a domain property would need a TXT record there and was not needed). Same Google account as the griotmoon.com property.

## State on 2026-09-18

| Item | Value |
|---|---|
| Sitemap | `/sitemap.xml`, submitted 14 Jun 2026, last read 18 Sep 2026, Success, 234 discovered URLs (the sitemap has 240 since this morning's deploy; Google reads it on its own schedule) |
| Indexed pages | 99 |
| Not indexed | 52, six reasons (below) |
| Search performance, 7 Jul to 15 Sep | 7 clicks, 206 impressions, CTR 3.4%, average position 10.1 |
| Top queries | `eva gallo` (24 impressions, 0 clicks); everything else is 1-3 impressions |
| Top pages by impressions | `/about/` 78, `/activities/story-builder/` 38, `/es/books/mayas-shadow/` 22, `/` 16, `/es/books/butterfly-effect/` 12 |
| Enhancements | Breadcrumbs: 1 valid, 0 invalid |
| HTTPS | 5 of 5 sampled pages HTTPS |
| Core Web Vitals | no field data yet (traffic too low) |

## Why 52 pages are not indexed

| Reason | Pages | Reading |
|---|---|---|
| Discovered, currently not indexed | 25 | Google knows the URLs from the sitemap and has not crawled them: the crawl budget follows authority, and the site has almost none. This is the audit's "no independent Google traffic" in one number. |
| Crawled, currently not indexed | 13 | Crawled and judged not worth indexing yet. Usually thin or near-duplicate pages; the guides expansion (DA-03) is the answer, not a technical fix. |
| Page with redirect | 8 | Expected: unslashed or old URLs now 301 to the canonical (DA-02). |
| Alternate page with proper canonical | 3 | Expected: language variants pointing at their canonical. |
| Blocked by robots.txt | 2 | `/profile` and `/search` are excluded by design. |
| Not found (404) | 1 | `https://storytimewitheva.com/Home` (capital H), crawled 6 Sep 2026: a stray inbound link. Fixed the same day (PR #219): Netlify now answers `/home` and `/Home` with a single 301 to `/`, asserted by the smoke suite on every deploy. Google will move it to "Page with redirect" on its next crawl. |

## What to watch, monthly

1. Indexed pages should climb from 99 toward the 240-URL sitemap as the new guide pages and Spanish editions get crawled. If "Discovered, currently not indexed" does not shrink within two months, the constraint is authority (inbound links), not the site.
2. Queries beyond `eva gallo`: the guides target phrases like "bedtime reading routine", "bilingual flashcards", "reluctant readers". Their first impressions will show here before Plausible sees a click.
3. The Pages report after each content release, to confirm new URLs move from Discovered to Indexed.
