# Story Time with Eva — Funnel & Conversion QA Specification

**Product:** storytimewitheva.com (lead-magnet signup funnel)
**Audience:** external QA tester (black-box; no code access required)
**Prepared:** 2026-08-10
**Scope:** the path from an ad/pin click to a delivered PDF and a recorded email subscriber, in all 3 languages, on desktop and mobile.

---

## 1. What the funnel is

A visitor clicks a Pinterest pin / ad that points at a **lead-magnet deep link** like
`https://storytimewitheva.com/?lm=bedtime-routine#email-signup`. They should land on an
**offer for that specific freebie, shown above everything else on the page**, enter their
email, and immediately receive:

1. an on-screen **success screen with a download button** for the correct PDF, and
2. a **welcome email** from MailerLite containing the same download link,

while being recorded as a **subscriber** in MailerLite with the right language and which
magnet they requested.

There are **5 lead magnets** and **3 languages** (English, Spanish, French) = 15 offer
variants to cover.

---

## 2. Test environment & prerequisites

| Item | Detail |
|---|---|
| Environment | **Production** — `https://storytimewitheva.com` (this is a static site; there is no staging) |
| Browsers (desktop) | Chrome, Safari, Firefox (latest) |
| Devices (mobile) | iOS Safari (iPhone) + Android Chrome |
| Test email | Use a **real inbox you control** so you can verify the welcome email. Use plus-addressing to keep each test unique, e.g. `yourname+stwqa01@gmail.com`, `+stwqa02`, … |
| Tools (optional, for backend cases) | `curl` or Postman; browser DevTools (Network + Console tabs) |
| MailerLite access | Cases in **Section D** need the site owner to confirm results inside MailerLite (tester cannot see the dashboard) |

**Important:** the tester **cannot delete** test subscribers (owner-only). Keep a list of every
test email you submit and hand it to the owner for cleanup.

---

## 3. Reference data (expected values)

### 3.1 The 5 magnets, their deep links, and expected copy

Deep-link URL pattern:
- English: `https://storytimewitheva.com/?lm=<slug>#email-signup`
- Spanish: `https://storytimewitheva.com/es/?lm=<slug>#email-signup`
- French: `https://storytimewitheva.com/fr/?lm=<slug>#email-signup`

| Slug | Lang | Expected headline (H2) | Expected button (CTA) |
|---|---|---|---|
| `bedtime-routine` | EN | Your bedtime reading routine, FREE | Send me the routine |
| | ES | Tu rutina de lectura antes de dormir, GRATIS | Envíame la rutina gratis |
| | FR | Votre routine du soir, GRATUITE | Envoyez-moi la routine |
| `bilingual-starter-kit` | EN | The FREE 20-page trilingual starter kit | Send me the kit |
| | ES | El kit trilingüe de 20 páginas, GRATIS | Envíame el kit gratis |
| | FR | Le kit trilingue de 20 pages, GRATUIT | Envoyez-moi le kit |
| `bilingual-flashcards` | EN | 30 bilingual flashcards, FREE to print | Send me the flashcards |
| | ES | 30 tarjetas bilingües, GRATIS para imprimir | Envíame las tarjetas |
| | FR | 30 cartes bilingues, GRATUITES à imprimer | Envoyez-moi les cartes |
| `parents-guide` | EN | The parent's guide to raising a bilingual reader, FREE | Send me the guide |
| | ES | La guía para criar un lector bilingüe, GRATIS | Envíame la guía gratis |
| | FR | Le guide pour élever un lecteur bilingue, GRATUIT | Envoyez-moi le guide |
| `follow-up-activities` | EN | 5 things to do when the story ends, FREE | Send me the activities |
| | ES | 5 actividades para después del cuento, GRATIS | Envíame las actividades |
| | FR | 5 activités pour après l'histoire, GRATUIT | Envoyez-moi les activités |

**Preview image:** only **`bedtime-routine`** currently shows a product image (a bedtime chart).
The other 4 magnets intentionally have **no image yet** — that is expected, not a defect.

### 3.2 Expected PDF delivered on success (by magnet × language)

The download button on the success screen must point at exactly these files, and each must
open (HTTP 200):

| Slug | EN | ES | FR |
|---|---|---|---|
| bedtime-routine | `/bedtime-routine.7cdc728eb026.pdf` | `/bedtime-routine-es.9db70549b2cb.pdf` | `/bedtime-routine-fr.91d87fe35749.pdf` |
| bilingual-starter-kit | `/bilingual-starter-kit.67152acba3fc.pdf` | *(same file)* | *(same file)* |
| bilingual-flashcards | `/bilingual-flashcards.8d2eff72661a.pdf` | *(same file)* | *(same file)* |
| parents-guide | `/parents-guide.12ba12f60096.pdf` | `/parents-guide-es.5c21d77b24d2.pdf` | `/parents-guide-fr.16a27a138de4.pdf` |
| follow-up-activities | `/follow-up-activities.43818dc842cc.pdf` | `/follow-up-activities-es.a733da2b2546.pdf` | `/follow-up-activities-fr.e605cd5fa2d4.pdf` |

(Prepend `https://storytimewitheva.com` to each path.)

---

## 4. Test cases

Each case: **ID · Title · Steps · Expected result.** Record Pass/Fail + notes in the log (Section 8).

### Section A — Deep-link landing (the core behavior)

**A1 — Correct offer shows, above the hero (spot-check all 15 variants).**
For each row in the table in §3.1:
1. Open the deep link in a fresh tab.
2. **Expected:** the first meaningful block on the page is the purple signup section with a
   🎁 icon, showing the **exact headline and button text** from the table, in the matching
   language. The book "hero" section appears **below** it.

**A2 — Preview image.**
1. Open `…/?lm=bedtime-routine#email-signup`.
2. **Expected:** a bedtime-routine chart image is visible inside the offer block.
3. Open any other magnet (e.g. `?lm=parents-guide`).
4. **Expected:** no image (by design) — everything else still correct.

**A3 — Exactly one signup form.**
1. On any `?lm=` deep link, search the page (Ctrl/Cmd-F) for the email field / "🎁".
2. **Expected:** the signup section appears **once** only (never duplicated top and bottom).

**A4 — Visitor lands on the offer, not the top of a long page.**
1. Open any `?lm=` deep link on both desktop and mobile.
2. **Expected:** the offer (headline + email field) is visible without the user having to
   scroll past several screens of unrelated content. A brief layout settle on load is
   acceptable (see §7).

**A5 — Unknown magnet falls back gracefully.**
1. Open `https://storytimewitheva.com/?lm=does-not-exist#email-signup`.
2. **Expected:** page loads normally (no error/blank). It shows the **general newsletter
   signup**, in its normal position (below the hero) — i.e. it behaves like an organic visit.

**A6 — Language via path prefix.**
1. Open the ES and FR variants (`/es/?lm=…`, `/fr/?lm=…`) for at least 2 magnets.
2. **Expected:** headline, bullets, button, and all page chrome are fully in that language.

### Section B — Organic visit (regression: must be unchanged)

**B1 — Plain homepage.**
1. Open `https://storytimewitheva.com/` (no `?lm=`), EN/ES/FR.
2. **Expected:** normal homepage — hero first; the newsletter signup appears **near the
   bottom** with the general "starter kit / newsletter" pitch; exactly one signup section.

### Section C — Form submission & PDF delivery

**C1 — Happy path (run for at least one magnet per language).**
1. On a `?lm=<slug>` deep link, enter a valid unique test email; submit.
2. **Expected:** button shows a submitting state, then a **success screen** ("Success, your
   download is ready!" / localized) with a **📥 Download** button.
3. Click Download.
4. **Expected:** the PDF from §3.2 for that magnet + language opens (HTTP 200) and is the
   correct freebie in the correct language.

**C2 — Invalid email is rejected.**
1. Enter `not-an-email`; submit.
2. **Expected:** an inline error; **no** success screen; you are not navigated away.

**C3 — Empty email.**
1. Leave the email field blank; submit.
2. **Expected:** the browser's required-field prompt (or an inline error); no submission.

**C4 — Re-submit the same email.**
1. Submit an email you already used in C1.
2. **Expected:** still resolves to a success screen (duplicates are fine); no crash.

**C5 — PDFs are gated (no un-hashed public link).**
1. In the browser, open `https://storytimewitheva.com/bedtime-routine.pdf`
   (the guessable, un-hashed name).
2. **Expected:** **HTTP 404** (page not found).
3. Open the hashed link from §3.2 (`/bedtime-routine.7cdc728eb026.pdf`).
4. **Expected:** **HTTP 200** (the PDF opens). Repeat for one more magnet.

**C6 — Delivered PDF matches the requested magnet + language.**
1. For 3 different magnet/language combos, complete C1 and confirm the **downloaded file
   contents** match both the magnet and the language (not a different freebie, not the wrong
   language).

### Section D — Backend / subscriber record (needs owner to confirm in MailerLite)

**D1 — Subscriber is created with correct data.**
1. Complete a happy-path signup (C1) with a known test email, magnet, and language.
2. **Expected (owner confirms):** a new subscriber appears in the **`storytimewitheva-signups`**
   group with fields `language` and `lead_magnet` set correctly (and first name if entered).

**D2 — Single opt-in (no confirmation step).**
1. After D1, check the test inbox.
2. **Expected:** the subscriber is active immediately; there is **no "please confirm your
   subscription"** double-opt-in email required before delivery.

**D3 — Welcome email arrives with a working link.**
1. Check the test inbox within a few minutes of signup.
2. **Expected:** a welcome email is received; any download link in it opens the correct PDF.

**D4 — Subscribe endpoint contract (optional, via curl/Postman).**
Send requests to `https://storytimewitheva.com/.netlify/functions/subscribe`:
| Request | Expected |
|---|---|
| `POST` JSON `{"email":"not-an-email"}` | HTTP **422** `{"ok":false,"error":"invalid_email"}` |
| `POST` JSON `{"email":"you+qa@example.com","fields":{"language":"en","lead_magnet":"bedtime-routine"}}` | HTTP **200** `{"ok":true,...}` |
| `GET` (any) | HTTP **405** |

### Section E — Cross-browser & responsive

**E1 — Browser matrix.** Run A1 (one magnet), C1, and B1 on Chrome, Safari, Firefox (desktop).
**E2 — Mobile.** Run A1, A4, C1 on iOS Safari and Android Chrome. **Expected:** offer text is
readable, the preview image scales, the email field and button are easily tappable, no
horizontal scrolling.

### Section F — Accessibility

**F1 — Keyboard only.** Complete a signup using only Tab/Enter (no mouse). **Expected:** you
can reach and operate the email field and submit button; focus is visible.
**F2 — Screen reader.** With VoiceOver/NVDA, submit the form. **Expected:** the success message
is announced.
**F3 — Labels.** The email (and optional name) fields have programmatic labels/placeholders.

### Section G — Analytics (optional, informational)

**G1 — Page view fires.** In DevTools → Network, filter for `cloudflareinsights`. **Expected:**
a beacon request fires on page load. *Note:* per-magnet **conversion events are not tracked**
by design (the analytics tier records page views only) — do not raise this as a bug.

---

## 5. Priority / suggested run order

1. **P0 (must pass):** A1, A3, A4, B1, C1, C5, D1–D3 — this is the money path.
2. **P1:** A2, A5, A6, C2, C3, C6, E1, E2.
3. **P2:** C4, D4, F1–F3, G1.

---

## 6. Acceptance / exit criteria

- **All P0 cases pass** in at least Chrome (desktop) and one mobile browser.
- Every magnet delivers the **correct, language-matched PDF** (§3.2), and un-hashed PDF URLs
  return 404 (C5).
- Every happy-path signup produces a **subscriber record + welcome email** (D1–D3).
- No console **errors** on load other than the known Cloudflare-beacon note (§7).

---

## 7. Known behaviors — do **NOT** log these as bugs

- **Brief layout settle on `?lm=` deep links.** On these deep links the page may visibly
  "settle" (the offer snapping to the top) within the first moment of load. This is a known
  trade-off of the static-page architecture; the end state is correct.
- **No preview image on 4 of 5 magnets.** Only `bedtime-routine` has artwork today; the others
  are intentionally image-less until art is added.
- **No conversion/goal events in analytics.** Only page views are collected (analytics tier
  limitation) — see G1.
- **Cloudflare beacon console message on non-production origins.** Irrelevant to the funnel.
- **The default/organic signup headline mentions the "starter kit."** That is the intended
  general newsletter pitch when there is no `?lm=`.

---

## 8. Results log template

Copy this table (or import into your test tool). One row per case × environment.

| Case ID | Browser / device | Magnet / lang | Result (Pass/Fail) | Evidence (screenshot / HTTP code) | Notes |
|---|---|---|---|---|---|
| A1 | Chrome / desktop | bedtime-routine / EN | | | |
| … | | | | | |

**Test subscribers created (for owner cleanup):**

| Email used | Magnet | Language | Date/time |
|---|---|---|---|
| | | | |

---

## 9. How to report a defect

For each failure, include: **Case ID**, exact **URL**, **browser + device/OS + version**,
**steps**, **expected vs actual**, a **screenshot or screen recording**, and — if relevant —
the **Network tab** entry (status code + response) for the `subscribe` call or the PDF request.
