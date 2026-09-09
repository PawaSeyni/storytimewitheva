# External Data Flow Inventory (S8-023)

Every place the browser or the site's own functions send data to a third party. Anything
not in this table is not allowed; the CSP in `netlify.toml` enforces the browser side
(`script-src`/`connect-src` allow only Plausible, `img-src` only Amazon's image host).

## Browser to third party

| Flow | Trigger | Recipient | Fields sent | Purpose | Retention (recipient) | Consent basis | If it fails |
|---|---|---|---|---|---|---|---|
| Analytics script + events | every page view; the typed `track()` calls | plausible.io | URL path, referrer, screen size, UA (Plausible hashes IP+UA daily, no cookie); event name + allowlisted props (language, lead_magnet, book id, journey id, placement, status, filter, result count). Never the search text, never email, never local state. | aggregate product and funnel measurement | Plausible: raw data not kept beyond the daily hash salt; aggregates indefinitely on our account | Cookie-free, no personal data: no consent banner (ADR-001); listed in the privacy policy | page works; events buffer then drop |
| Book covers | catalog and book pages | m.media-amazon.com | the image request (IP, UA, referrer per browser policy `strict-origin-when-cross-origin`) | display covers for non-featured titles | Amazon's CDN logs | image load, disclosed as a third-party image host | broken image with alt text; featured covers are local |
| Buy links | click on a Buy button | amazon.com | navigation (affiliate tag in the URL) | purchase on Amazon | Amazon | user-initiated navigation | link opens Amazon or fails there |
| Social links | click | Instagram, TikTok, Threads, Pinterest, YouTube, Facebook | navigation | reach the brand's profiles | theirs | user-initiated navigation | n/a |
| Newsletter signup | submit on any signup form | our function `/.netlify/functions/subscribe` (same origin), then MailerLite | email, optional first name, language, lead magnet slug, utm_* | deliver the printable and the welcome sequence | MailerLite: until unsubscribe/deletion (owner-managed) | explicit form submit; privacy policy | error shown, nothing lost silently |
| Contact and feedback forms | submit | Netlify Forms (same origin POST) | contact: name, email, message; feedback: rating, comment, page, language (no personal data) | support and product feedback | Netlify: until deleted by the owner | explicit submit | error shown |
| Read-aloud | click Listen | none (Web Speech API runs in the browser; some browsers use a cloud voice under the browser's own terms) | text of the page | narration | browser vendor | user-initiated | button hidden where unsupported |

## Site functions to third party

| Flow | Recipient | Fields | Purpose | Retention | Failure behavior |
|---|---|---|---|---|---|
| Subscribe | MailerLite API (`connect.mailerlite.com`) | email, name, language, lead_magnet, utm_* | create/upsert subscriber in the signups group | MailerLite | 503 to the browser; no ungrouped subscriber is ever created |
| Pinterest conversion | Pinterest Conversions API (`api.pinterest.com`) | SHA-256 of the email, event time, lead type; no IP, no UA | attribute paid signups | Pinterest (advertising) | swallowed; signup unaffected; inert without `PINTEREST_CONVERSIONS_TOKEN` |
| Rate limiting | Netlify edge (first party) | IP, path | 10 POST/min per IP on subscribe | Netlify | 429 |

## Build and operations (not the browser)

| Flow | Recipient | Purpose |
|---|---|---|
| Netlify build and hosting | Netlify | build, CDN, forms, functions, Lighthouse plugin, secret scan |
| GitHub Actions | GitHub | CI on every PR |
| Cover and rating refresh scripts | amazon.com (headless browser, owner-run) | keep covers and ratings current |

## Not present, by decision

No Meta Pixel, no GA4/GTM, no session replay, no error-reporting SaaS, no external search, no
fonts CDN at runtime (Lexend is self-hosted), no cookies of any kind (ADR-001).

Owner of this inventory: engineering (accuracy), owner (retention and vendor terms). Reviewed
at each release audit; a new external host requires a row here and a CSP change in the same PR.
