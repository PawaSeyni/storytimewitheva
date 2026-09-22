# Holiday 2026: "Raise a Bilingual Reader" execution specification

**Window:** Day 0 starts on the date the Day 0 gate closes. Days 1 to 30 follow.
**Campaign id:** `bilingual-reader-2026` (acquisition) and `bilingual-gift-2026` (holiday overlay, from Day 24).
**Owner:** Papa Nguer. **Implements:** the revised 30-day holiday strategy plus the owner review of 22 September 2026.

This is an execution specification, not a strategy. Every task has an acceptance
criterion that someone else can check. Where a criterion is a command, run it and
paste the output into the task record.

---

## 0. Four corrections to the strategy this implements

These were found while writing the spec. Two of them change Day 0 tasks. One of
them corrects the strategy document itself.

### 0.1 There is no "Form Start bug". Do not fix it.

The revised strategy listed a Day 0 task to fix Form Start, on the grounds that
the baseline shows Form Start at 8 against Form Submit at 9, which cannot happen
in an ordered funnel. That diagnosis was wrong.

`Form Submit` was deliberately removed in PR #216, "analytics: one event per
outcome, Form Submit removed (DA-01)". The code comment in `EmailSignup.tsx`
records the reason: `Lead Created`, fired only on backend success, is the single
lead conversion, and `Form Start` already records the engagement. The current
newsletter funnel in `src/analytics/funnels.ts` is `Form View → Form Start →
Lead Created`, with no Form Submit step. `Form Start` also carries an explicit
ordering guarantee: it force-fires `Form View` first if the IntersectionObserver
has not yet delivered its callback.

So the anomaly is not a defect. The approved baseline window of 23 August to
18 September straddles a schema change, and Form Submit was retired at the end of
it. Nothing is broken and nothing needs fixing.

**Consequence, and the real Day 0 task:** the approved baseline is not a clean
comparison basis, because its funnel definition changed inside the window. Re-run
the report from 19 September forward and use that as the comparison basis for the
Day 30 readout. See task D0-2.

### 0.2 The paid accelerator must be Pinterest, not Meta

The owner review asks for "a small adult-targeted paid social test". Meta is the
obvious default and it is the wrong choice here, for three concrete reasons.

1. The site carries no advertising pixel by design, and `scripts/maintenance.mjs`
   asserts that none appears on the homepage. Adding a Meta pixel turns that check
   from pass to warn and breaks a published promise.
2. The enforced Content Security Policy in `netlify.toml` locks `script-src` and
   `connect-src` to self plus `plausible.io`. A Meta pixel requires a CSP change.
3. The privacy policy states there are no advertising trackers, no cookies that
   follow visitors across the web, and no profiles of children. A pixel on a
   children's book site contradicts all three.

Pinterest has none of these problems, because the work is already done.
`netlify/functions/_pinterest.mjs` implements the Pinterest Conversions API
server-side: it fires only on a confirmed MailerLite subscribe, sends a SHA-256
hashed email and nothing else, deliberately omits IP and user agent, and carries a
per-magnet `lead_type`. Ad account `549770651316`, conversion tag `2613658812609`.

That means Pinterest Ads can optimise for **conversions** rather than clicks,
with no browser pixel, no CSP change and no privacy contradiction. It is the only
paid channel that can currently do that on this site.

**Decision: the accelerator is Pinterest Ads. Meta is out of scope for this
sprint.** Reopening Meta is a privacy-policy decision, not a media-buying one.

### 0.3 The catalogue really is trilingual, so the campaign promise is deliverable

An older note in the punch list says the books are English-only. That is out of
date. Measured from the live catalogue today:

| Editions on Amazon | Count of the 20 books on the site |
|---|---|
| Spanish edition | 19 |
| French edition | 18 |
| Paperback in all three languages | 9 |
| English only | 1 (`little-boats-big-wish`) |

This matters more than it looks. "Raise a Bilingual Reader" acquires parents on a
multilingual promise, and the holiday layer asks them to buy. If the books were
English-only, the funnel would collapse at the moment of purchase. They are not.
Nine titles can be gifted as physical books in English, Spanish or French, which
is what a gift campaign needs.

Note the distinction: some Spanish and French editions are Kindle only (ASINs
beginning `B0`). Two of the three featured titles, `colors-mixed-up` and
`rainbow-symphony`, are in that group. For a **gift** message, prefer the nine
with paperbacks in all three languages. See section 7.

### 0.4 Amazon Attribution goes on email links, not book pages

`tests/seo/monetization.test.mjs` asserts that every Amazon link on every book
page, in all three locales, carries the Associates tag `storytimewi20-20`, opens
in a new tab and has `rel` containing `noopener`. Putting Attribution parameters
on book-page buy buttons would require changing that test.

There is no need. The holiday purchase intent lives in email, not on the book
page. Apply Attribution to the Amazon links in the holiday email sequence and to
any direct-to-Amazon link created for this campaign. Leave book pages exactly as
they are, with the Associates tag.

This keeps the test green, keeps the affiliate income path intact, and still
closes the loop where the campaign actually asks for money.

---

## 1. Scope

**In scope:** one acquisition proposition, one landing page, one email path, four
traffic sources into that page, and a holiday monetization layer on the acquired
list.

**Explicitly out of scope for 30 days:** new lead magnets, new SEO articles, new
email automations, Amazon Ads, Meta ads, a second campaign, a Dream 100 list, any
change to the six parent guides published on 19 September.

---

## 2. Day 0 gate

Day 1 does not start until all four tasks pass. None of them is campaign work, so
none of them consumes sprint time.

**Status as of 22 September 2026:** D0-1 done and verified live, D0-2 done,
D0-3 passed, D0-4 confirmed available with tag creation outstanding. The gate
opens once D0-4's tags exist.

### D0-1 Redirect evagallo.com

`evagallo.com` serves a byte-identical build with canonical tags pointing at
`storytimewitheva.com`, and has no redirect. `netlify.toml` already contains the
exact pattern to copy, the one used for the `netlify.app` hostname.

Add to `netlify.toml`, next to the existing hostname redirect:

```toml
# evagallo.com serves the same build; send it to the canonical host so campaign
# links never split the brand across two domains.
[[redirects]]
  from = "https://evagallo.com/*"
  to = "https://storytimewitheva.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.evagallo.com/*"
  to = "https://storytimewitheva.com/:splat"
  status = 301
  force = true
```

**Acceptance:**
```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://evagallo.com/free/bilingual-bundle
# expect: 301 https://storytimewitheva.com/free/bilingual-bundle
```
Both apex and www must return 301. Verify on the live domain, not the deploy
preview, and confirm `version.json` shows the new commit before trusting the result.

### D0-2 Re-baseline from 19 September

Do not fix Form Start. See section 0.1. Instead produce a clean comparison basis
whose funnel definition does not change inside the window.

```bash
cd ~/Developer/storytimewitheva
npm run report:funnels -- --from 2026-09-19 --to <day-0-date> \
  --out docs/analytics/REPORT_PRECAMPAIGN.md
```

**Acceptance:** the report writes with zero lines containing `HTTP`, and the
Day 30 readout compares against this file rather than `REPORT_2026-09-18.md`.

### D0-3 Confirm Pinterest conversions are actually flowing

`_pinterest.mjs` skips silently when `PINTEREST_CONVERSIONS_TOKEN` is unset. A
paid test that optimises for conversions while sending none will spend the budget
and learn nothing.

**PASSED 22 September 2026, with no test signup needed.** `PINTEREST_CONVERSIONS_TOKEN`
is set in Netlify, scoped to Builds, Functions and Runtime across all four deploy
contexts. The Pinterest Ads conversions dashboard for ad account `549770651316`
shows the path already working on real signups:

| Event | Source | Total events | Last received |
|---|---|---|---|
| Signup | Api | 7 | 18 Sep 2026, 19:27 UTC |

Seven conversions against nine `Lead Created` events in the same period, which is
close agreement given deduplication and the window boundary. The server-side path
from the subscribe function to Pinterest is confirmed end to end, and no test
subscriber had to be created to prove it.

**Caveat that changes section 10.** Pinterest's dashboard recommends installing
the browser tag alongside the Conversions API "to maximize conversion visibility".
We decline that by design, for the reasons in section 0.2, and accept lower match
quality as the cost. More importantly, seven conversions a month is far below the
volume any ad platform needs to optimise a conversion objective. A conversion
campaign would never leave the learning phase.

**Therefore:** the paid accelerator starts on a traffic or consideration
objective, not a conversion objective, and switches to conversions only once
weekly conversion volume supports it. The Conversions API still earns its place,
because it measures the result correctly even while the campaign optimises for
something upstream.

### D0-4 Amazon Attribution

Create the tags before any link is published, per the taxonomy in section 4.

**Availability confirmed 22 September 2026.** Amazon Attribution (Beta) is live on
the "Sponsored ads - Author" account, entity `ENTITY127Y5DMIWT4MQ`, United States
marketplace. The console exposes Campaigns, Ad groups, Channels/Publishers and
Attribution tags, and reports Click-throughs, Detail page views, Purchases,
**KENP read and estimated KENP royalties**. The KENP columns are a bonus the spec
did not assume: Kindle page reads become measurable per channel, not just
purchases. No campaigns or tags exist yet, so every counter reads zero.

**Still to do, and it needs the owner:** create the campaign and tags per the
taxonomy in section 4. This is left for the owner deliberately. Creating a tag
requires choosing the products, publisher and channel, and the console displays
the generated click-through URL at that moment, which settles the open question
below on sight.

**Acceptance:** a test click on one tagged link appears in the Attribution report
within 24 hours.

---

## 3. Naming and UTM taxonomy

The site attaches `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and
`utm_term` from the URL to every Plausible event on that page view. All five are
enabled as custom properties.

**The campaign is separated from legacy traffic by `utm_campaign`, not by page.**
This matters: `/free/bilingual-bundle` and the legacy `/free/bilingual-starter-kit`
both report `lead_magnet=bilingual-bundle`, so the magnet property cannot tell new
campaign traffic from old pins. `utm_campaign` is the only clean separator.

| Parameter | Values |
|---|---|
| `utm_campaign` | `bilingual-reader-2026`, then `bilingual-gift-2026` from Day 24 |
| `utm_source` | `pinterest`, `pinterest_ads`, `partner_<slug>`, `newsletter`, `instagram`, `tiktok` |
| `utm_medium` | `organic_social`, `paid_social`, `referral`, `email` |
| `utm_content` | creative id, for example `pin-flashcards-fr-01`, or partner asset id |
| `utm_term` | reserved, leave unset |

**Language:** use the language-prefixed path rather than `?lang=`. The prefixed
path is canonical, is prerendered, and carries correct hreflang. `?lang=` remains
supported for legacy pins already published and must not be removed.

Canonical destination for an organic French pin:

```
https://storytimewitheva.com/fr/free/bilingual-bundle?utm_source=pinterest&utm_medium=organic_social&utm_campaign=bilingual-reader-2026&utm_content=pin-flashcards-fr-01
```

**Acceptance for any published link:** load it, then confirm in Plausible that the
`Landing View` event for that page view carries all four UTM values.

---

## 4. Amazon Attribution taxonomy

| Level | Value |
|---|---|
| Advertiser | Pawa Press |
| Campaign | `eva-bilingual-reader-2026` |
| Ad group | `email-welcome`, `email-holiday`, `partner`, `pinterest-paid` |
| Creative | `<book-id>-<lang>`, for example `mayas-shadow-fr` |

Apply to: Amazon links inside the holiday email sequence, and any direct
Amazon link created for a partner. Do not apply to book pages, per section 0.4.

**Attribution tags and the Associates tag may interact.** Confirm the combined URL
behaviour in the Amazon Ads console before publishing, and record what you find.
If the two cannot coexist on one URL, Attribution wins for email links, because a
measured sale is worth more than a 4.5% commission on an unmeasured one.

---

## 5. Landing page changes

**Page:** `/free/bilingual-bundle` plus `/es/` and `/fr/` variants.
**File:** `src/components/EmailSignup.tsx`, `BUNDLE_COPY` at line 120.
**Why this page:** it carries the five-resource bundle, and the code comments name
`bilingual-bundle` as the clearer alias intended for new links. The legacy
`bilingual-starter-kit` slug keeps serving already-published pins unchanged.

The current copy leads with the offer. The campaign leads with the parent outcome,
per the positioning agreed in the owner review: multilingual reading first,
heritage as proof and depth rather than the whole category.

**English, replace `BUNDLE_COPY.en`:**

| Field | From | To |
|---|---|---|
| `title` | The FREE Bilingual Learning Bundle, all 5 resources | Raise a bilingual reader, starting tonight |
| `blurb` | Everything we use at home, in one go: the starter kit, the flashcards, the bedtime chart, the parent's guide and the follow-up activities. | Five printables we use at home, in English, Spanish and French. Enough to build a reading habit in two languages without buying anything. |
| `cta` | Send me all 5 | Send me all 5, free |

Bullets stay as they are. They already say the right things.

**Spanish, replace `BUNDLE_COPY.es`:**
- `title`: `Cría a un lector bilingüe, desde esta noche`
- `blurb`: `Cinco imprimibles que usamos en casa, en español, inglés y francés. Lo suficiente para crear el hábito de leer en dos idiomas, sin comprar nada.`
- `cta`: unchanged

**French, replace `BUNDLE_COPY.fr`:**
- `title`: `Élevez un enfant bilingue, dès ce soir`
- `blurb`: `Cinq documents à imprimer que nous utilisons à la maison, en français, en anglais et en espagnol. De quoi installer une habitude de lecture dans deux langues, sans rien acheter.`
- `cta`: unchanged

House style: no em dashes in English copy. French and Spanish are exempt.

**Acceptance:**
```bash
npm run test && npm run build && npm run test:seo
```
All three pass, and the three localized pages render the new title. Then verify on
the live URL after deploy.

---

## 6. Email alignment

Three welcome sequences are live and must not be rebuilt: English 8 steps, French
7, Spanish 7, all triggered on group or segment join, all built around *Leo and
the Wolf*.

**The defect to fix:** a visitor who signs up for the bilingual bundle is promised
five trilingual printables and then receives a *Leo and the Wolf* welcome. Fix
this for the campaign magnet only. Leave the other six magnets alone.

Minimum change, in the MailerLite dashboard:
1. Email 1 delivers the five files by name, using `/download/<slug>` links with
   the campaign UTMs. Never a hashed PDF URL.
2. Email 1's book recommendation becomes a title with editions in the reader's
   language, not *Leo and the Wolf* by default. *Leo and the Wolf* has Kindle
   editions in Spanish and French but no paperback in either.
3. Emails 2 to 7 are unchanged for this sprint.

Link format follows the existing standard in `docs/analytics/NEWSLETTER_ATTRIBUTION.md`.

**Acceptance:** a test signup in each of the three languages receives an email
whose first link resolves to the correct-language PDF, and whose recommended book
exists in that language. Test the delivered email, not the dashboard preview.

---

## 7. Holiday monetization layer

The piece the owner review identified as missing. It does not get its own landing
page or its own campaign. It runs on the list acquired in Days 1 to 23.

```
Raise a Bilingual Reader  (Days 1-23, evergreen educational need)
  free five-resource bundle
      ↓
  welcome sequence, value first
      ↓
  Day 24+: holiday message to the acquired list
  "Give a child a story in more than one language"
      ↓
  curated set of 3 books, each available as a paperback in EN, ES and FR
      ↓
  Amazon, with Attribution tags
```

**The curated set.** Chosen from the nine titles with paperback editions in all
three languages, laddered by age so the set reads as "grow with them" rather than
three unrelated books:

| Book | Ages | Themes |
|---|---|---|
| `mayas-shadow` | 3-7 | wonder, creativity |
| `true-beauty-meadowbrook` | 4-8 | self-worth, kindness, diversity |
| `heidis-journey-to-mastery` | 5-9 | patience and mastery, curiosity, creativity |

`mayas-shadow` is already a featured title, so it has the strongest existing art
and page assets. Do not substitute `colors-mixed-up` or `rainbow-symphony`: both
are featured but their Spanish and French editions are Kindle only, which does
not work as a physical gift.

**Timing:** first holiday email on Day 24, under `utm_campaign=bilingual-gift-2026`.
A second on Day 28 if and only if the first produced at least one Amazon click.

**Acceptance:** the holiday email's three book links carry Attribution tags and
resolve to the paperback edition in the recipient's language.

---

## 8. Pinterest creative briefs

Fifteen creatives: five concepts, each produced in English, Spanish and French.
Not fifteen unrelated pins.

**Specification for every pin:** 1000 x 1500 px, 2:3 ratio. Overlay text no more
than six words, legible at 236 px wide, which is the feed width. Brand purple
`#4C1D95`. Alt text required, describing the image for a screen reader, not
keyword stuffing. Destination per the UTM table in section 3, using the
language-prefixed path.

| # | Concept | Image | Overlay, EN | Why it should work |
|---|---|---|---|---|
| C1 | Flashcards in use | The 30 trilingual cards fanned out, a child's hands reaching | Three languages, one card | The single most concrete asset. Shows the product without explaining it. |
| C2 | One story, three languages | The same spread photographed three times, side by side | One story. Three languages. | Makes the trilingual claim visible rather than stated. |
| C3 | The chart on the fridge | The bedtime routine chart in a real kitchen, magnets and all | Bedtime, without the argument | In-situ beats studio for parenting saves. |
| C4 | The stack | All five printables stacked, edges visible, counted | Five printables. Nothing to buy. | Communicates scale of the free offer in one frame. |
| C5 | Grandparent reading | An older adult reading with a child, book visible | The language you grew up in | Reaches the heritage-language motivation directly, and the grandparent segment buys gifts. |

Localize the overlay, not just the caption. A French pin with English overlay text
will not save into French-language boards.

**Acceptance:** fifteen pins published, each with a destination URL that returns
200 and carries the four UTM values, verified by loading one pin per language.

---

## 9. Proven 20 targeting criteria

Twenty contacts, not a hundred names. Outreach begins Day 6, not Day 21, so that
a reply on Day 12 can still become something published inside the window.

**Four buckets, five each:**

1. **Bilingual and multilingual parenting creators.** Audience between 2,000 and
   50,000. Posts in French or Spanish, not only about them in English. Has shared
   someone else's printable before, which proves they link out.
2. **French immersion and heritage-language school communities.** Alliance
   Française chapters, immersion school parent associations, FLAM associations,
   international school parent groups.
3. **Language teachers and literacy specialists.** Early-years, FLE and ELE
   teachers who publish classroom resources. The five-resource bundle is
   classroom currency.
4. **Grandparent and diaspora family accounts.** The segment that buys books as
   gifts and cares most about the heritage-language motivation.

**Disqualifiers:** any account whose audience is primarily children rather than
parents; any group with a no-promotion rule, where you participate as a parent
first and do not pitch; anyone requiring paid placement above the section 10 cap.

**The ask:** the five-resource bundle as a gift for their audience, with a
partner-specific link carrying `utm_source=partner_<slug>`. No book pitch in first
contact.

**Acceptance:** twenty contacts logged with name, bucket, date of contact and
reply status. The count is the deliverable. Collaborations that land are upside.

---

## 10. Paid accelerator

**Channel:** Pinterest Ads only, for the reasons in section 0.2.
**Budget cap:** treat as a test, not a scale. Set a total cap before launch and do
not raise it mid-sprint.
**Objective:** conversions, using the existing server-side Conversions API. Not
traffic, not awareness. If D0-3 did not confirm a test conversion, run clicks
instead and say so in the readout.
**Targeting:** adults only. Interests in bilingual parenting, homeschooling,
early literacy, French or Spanish language learning. Exclude anything that targets
by child age in a way the platform treats as targeting minors.
**Creative:** promote the best two organic pins from C1 to C5 after Day 12. Do not
create paid-only creative. The point is to accelerate a message that already works.
**Destination:** the same landing page as everything else, with
`utm_source=pinterest_ads&utm_medium=paid_social`.

**Kill rule:** if cost per lead after the first third of the budget exceeds three
times the blended organic cost, stop and put the remainder behind partners.

---

## 11. Day 15 decision logic

Day 15 is a diagnostic, not a gate. Nothing is cancelled on Day 15. The question
is where the funnel leaks, and the answer determines what Days 16 to 23 fix.

```bash
npm run report:funnels -- --from <day-1> --to <day-15> --out docs/analytics/REPORT_D15.md
```

Read it in this order and stop at the first failure. That is the leak.

| Check | Threshold at Day 15 | If below, the problem is | Do this in Days 16-23 |
|---|---|---|---|
| Landing View, campaign | 120 | Distribution | Change creative and targeting, not the page. More pins on the winning concept. |
| Lead Created, campaign | 12 | The page | Test the headline. One change at a time. |
| Book View | 15 | The email | The sequence is not walking people to books. Fix email 1's recommendation. |
| Purchase Click | 1 | The handoff | Check the buy link renders the right language edition. |

If every line clears, spend Days 16 to 23 doing more of exactly what worked, and
change nothing else.

---

## 12. Day 30 readout

```bash
npm run report:funnels -- --from <day-1> --to <day-30> --out docs/analytics/REPORT_D30.md
```

**These are directional milestones, not pass or fail thresholds.** Thirty leads
against twenty-nine is not the difference between success and failure. The owner
review is right about this and it is repeated here so nobody treats the table as a
scorecard.

**Measured pre-campaign basis (D0-2, run 22 September):** effectively zero.
One landing view and no leads across 19 to 22 September, against an all-source
rate of about 2.6 visitors a day. See `docs/analytics/REPORT_PRECAMPAIGN.md`.
The milestones below are therefore close to a standing start, not a multiple of
an existing flow. This makes attribution clean and the targets harder.

| Metric | Pre-campaign basis | Directional milestone |
|---|---|---|
| Landing views, campaign | from `REPORT_PRECAMPAIGN.md` | about 250 |
| Leads created, campaign | same | about 30 |
| Book views | same | about 40 |
| Purchase clicks | 0 | any number above 0 |
| Attributed Amazon sales | not previously measurable | 1 or more |
| Guide impressions, Search Console | near 0 | any |

**The real Day 30 question** is not whether the numbers were hit. It is whether
the funnel has a recognisable shape:

> traffic exists → people voluntarily subscribe → some subscribers view books →
> some click through to Amazon → ideally a purchase appears

A funnel with that shape at low volume is a working machine that needs more
traffic. A funnel that produces traffic and no subscribers, or subscribers and no
book views, is a broken machine that more traffic will not fix. Say which one it
is in plain words at the top of the readout, before any number.

**If the shape holds:** November scales the winning source and the holiday overlay
runs against a larger list.
**If it does not:** the readout names the single broken step, and December work is
that step only.

---

## 13. Schedule

| Days | Action | What it answers |
|---|---|---|
| 0 | Section 2 gate: redirect, re-baseline, Pinterest conversions, Attribution | Can we measure the whole funnel? |
| 1-3 | Landing page copy, section 5. Align email 1, section 6. | Does the proposition hold end to end? |
| 4-5 | Produce 15 pins, section 8. Draft partner asset. | Is distribution ready? |
| 6-8 | Begin Proven 20 outreach, section 9. Publish first 5 pins. | Early, so replies land inside the window. |
| 9-14 | Pinterest organic plus partners. Paid accelerator from Day 12. | Can we generate qualified parent traffic? |
| 15 | Diagnostic, section 11. | Where does it leak? |
| 16-23 | Fix the one leak. Double down on the best source. | Can we reproduce leads? |
| 24-27 | Holiday overlay to the acquired list, section 7. | Do leads move toward books? |
| 28-30 | Readout, section 12. | Is the funnel shape real? |

---

## 14. Standing risks

- **Shared Netlify credits.** All sites share one team. When credits run out,
  production deploys are silently skipped and the live site keeps serving the
  previous commit. Every acceptance criterion in this document that mentions a
  live URL must be checked against the live URL, with `version.json` confirming
  the expected commit. Never trust a deploy preview for sign-off.
- **Two domains until D0-1 ships.** No campaign link may be published before the
  redirect is live.
- **Single operator.** Days 6 to 8 put twenty outreach contacts and fifteen pins
  in the same window. If the week is short, publish the pins and cut the outreach
  to ten. Do not cut the pins, because they are the only compounding asset.
- **Do not add a second campaign mid-sprint.** The measured volume cannot separate
  two. This is the whole reason the sprint is shaped this way.
