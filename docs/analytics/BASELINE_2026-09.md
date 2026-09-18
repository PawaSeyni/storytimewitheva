# Growth Funnel Baseline, September 2026 (S5-001)

**Date:** 2026-09-10. **Schema version:** 1. **Status:** approved by the owner on 2026-09-18 (numbers below); instrumentation baseline complete;
**numeric baseline blocked on data access** (see gaps). Every number below is either a
count of what the site instruments or a measured property of the instrumentation; no
conversion rate is quoted, because none can be read yet.

## What is measured, per funnel (`src/analytics/funnels.ts`)

| Funnel | Steps | Measures |
|---|---|---|
| Discovery → detail → purchase intent → retailer click | Homepage CTA → Book View → Purchase CTA View → Purchase Click | intent (outbound click is the proxy) |
| Catalog card → retailer click | Purchase Click {placement=card} | intent |
| Book → activity → completion | Book View → Continue Journey {destination=activity} → Activity Complete | outcome |
| Book → activity → next book | … → Continue Journey {placement=activity, destination=book} → Book View | intent |
| Newsletter by placement | Form View → Form Start → Form Submit → Lead Created | outcome (backend-confirmed creation) |
| Home → free bundle → download → book discovery | Homepage CTA {free-bundle} → Landing View → Lead Created → Magnet Download → Continue Journey {signup-success} | intent |
| Landing entrances | Landing View → Form Start → Lead Created | outcome |
| Return | Personalized View → Recommendation Click → Book View | intent |
| Share | Book View → Share | intent |

Dimensions available on every report: locale, placement, stable book id (joined to age band
and theme through the taxonomy), edition language, lead magnet, landing page, campaign UTMs.

## Instrumentation baseline (this release)

| Surface | Events | Placements |
|---|---|---|
| Book pages (20 × 3 locales) | Purchase CTA View (once, when viewable), Purchase Click with edition, Share, Book View, Recommendation Click, Continue Journey | detail |
| Catalog cards | Purchase Click with edition | card |
| Newsletter forms | Form View / Start / Submit / Lead Created / Magnet Download, all with placement | home, landing, books, activities, resources, about |
| Signup success | Continue Journey to three featured books or the catalog | signup-success |
| Landing pages (9 magnets and packs × 3) | Landing View, then the newsletter funnel | landing |

Contextual copy: the newsletter block carries one localized contextual line on the books,
activities, resources and about placements; none on home and landing (the offer is the
message there).

## Known measurement gaps

1. **Read access: DONE 2026-09-18.** A Stats API key exists (Plausible → Settings → API keys,
   "storytimewitheva funnel report (local)"); locally it lives in the git-ignored `.env` as
   `PLAUSIBLE_API_KEY`, which `npm run report:funnels` loads itself. All 28 dictionary events are
   now configured as Plausible goals and all queried properties are enabled (24 custom
   properties on the site), so every query answers 200. First full run: `REPORT_2026-09-18.md`
   (2026-08-23 → 2026-09-18). Every segment is below the 50-event minimum sample, so no rate in
   it is a baseline yet; rerun after four more weeks of traffic.
2. **Purchases are not observable.** Amazon Associates reports are not linked to site events;
   every "conversion" is an outbound click. The open decision in the Sprint 5 spec stands.
3. **Format intent is not measurable.** One Amazon URL serves paperback and eBook.
4. **Data before 2026-08-23 undercounts** everything after Form View (the buffering bug fixed
   in #117); before this release, newsletter events carry no placement and purchase clicks no
   edition. The baseline window starts at this release's deploy.
5. **Double opt-in evidence.** MailerLite is configured single opt-in; `Lead Created` is
   backend-confirmed creation, not a confirmation click.

## Baseline procedure, once data access exists

Run `PLAUSIBLE_API_KEY=… npm run report:funnels -- --from <release date> --to <+28 days> --out docs/analytics/REPORT_<date>.md`,
commit the report, and record the numbers here as the approved baseline. Experiments
(S5-009, S5-010) stay in draft until that baseline is approved (release gate 11.1).

## Approved baseline, 2026-09-18

Owner approval recorded 2026-09-18 for the report `REPORT_2026-09-18.md` (Plausible Stats API v2, 2026-08-23 to 2026-09-18, event schema 1, minimum sample 50 per segment).

| Funnel | Numbers in the window |
|---|---|
| Newsletter: view → start → lead | Form View 107, Form Start 8, Lead Created 9 |
| Landing page entrance → next action | Landing View 96, Form Start 8, Lead Created 9 |
| Home → free bundle → download | Landing View 96, Lead Created 9, Magnet Download 16, Continue Journey (signup success) 1 |
| Discovery → detail → purchase intent → retailer click | Book View 13, Purchase CTA View (detail) 6, Purchase Click 0 |
| Book → activity → completion, and the loop | Book View 13, Continue Journey 0, Activity Complete 0 |

What this approval means and does not mean:

- It is the reference point, not a target. Every step except Form View and Landing View is below the 50-event minimum sample, so no rate in this window is statistically usable; the report marks each one. The baseline is approved as "this is where we started", which is what release gate 11.1 asks for.
- The two experiments (EXP-001, EXP-002) may now move from `draft` to `active` when the owner sets `startAt` and gives the go. Their `analysisRule` still refuses to report a cell under the minimum sample, so activation is safe but will not produce a verdict at current traffic; the Google-facing content work (DA-03) is what changes that.
- The newsletter funnel in this report still lists `Form Submit` (9); that event was removed on 2026-09-18 (DA-01) and the funnel is now three steps. The scheduled rerun on 2026-10-16 reports the new shape. The duplicate-counting the deeper audit found (automatic `Form: Submission` and `File Download`) never entered this report, which reads custom events only.
