# Growth Funnel Baseline, September 2026 (S5-001)

**Date:** 2026-09-10. **Schema version:** 1. **Status:** instrumentation baseline complete;
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

1. **No read access to the data.** Plausible has no API key configured for this repository and
   custom properties must be enabled per property in the dashboard (`docs/plausible-setup.md`,
   step 1). Until both exist, `npm run report:funnels` prints "No data". Owner action: create a
   Stats API key, set `PLAUSIBLE_API_KEY` for the report, enable the properties listed in the
   event dictionary.
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
