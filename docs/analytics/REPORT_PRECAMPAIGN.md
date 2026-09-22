# Pre-campaign baseline (Holiday 2026, task D0-2)

> **Read this before the numbers.** This file is the comparison basis for the Day 30
> readout of the "Raise a Bilingual Reader" campaign
> (`docs/campaigns/HOLIDAY_2026_BILINGUAL_READER.md`). The generated report follows
> the header.

## Why this window and not the approved baseline

`REPORT_2026-09-18.md` covers 23 August to 18 September and was approved by the
owner, but its funnel definition changed inside the window: `Form Submit` was
removed in #216 (DA-01) on the last day of it. That is the whole explanation for
the Form Start 8 against Form Submit 9 anomaly, which is a schema change and not a
defect. This window starts on 19 September, after the change, so every step is
measured under one definition throughout.

## What it shows: the starting line is effectively zero

| Step | Events, 19 to 22 Sep |
|---|---|
| Landing View | 1 |
| Form View | 1 |
| Form Start | 0 |
| Lead Created | 0 |
| Book View | 0 |
| Purchase Click | 0 |

Whole-site context for the same period, from the Plausible stats API:

| Measure | Value |
|---|---|
| Pageviews per day, 19 to 22 Sep | 1 to 3 |
| Visitors, all sources, last 14 days | 36, about 2.6 per day |
| From Google, last 14 days | 1 |
| From Pinterest, last 14 days | 4 |
| From Facebook, last 14 days | 9 |
| Direct, last 14 days | 21 |

The 96 Landing Views in the approved baseline were not a steady flow. Daily
pageviews across 25 August to 22 September range from 0 to 27, with three spikes
(25 and 26 August, 10 September, 18 September) accounting for most of the total.
Between the spikes the site receives one to three pageviews a day.

## What this changes about the campaign

**Good:** there is no existing traffic stream for campaign traffic to be confused
with. Attribution over the next 30 days will be unusually clean, because almost
every visit will be one the campaign created.

**Hard:** the Day 30 milestones in the spec are not a multiple of an existing
flow, they are close to a standing start. Reaching about 250 landing views means
roughly eight times the current all-source visitor rate, sustained for a month.
Treat the milestones as direction, per section 12 of the spec, and treat the
funnel **shape** as the real test.

**Pinterest is currently producing 4 visitors a fortnight.** The one-channel bet
is not yet delivering at a level any measurement can act on. That is an argument
for the paid accelerator in section 10 of the spec, not against it.

---

# Funnel and performance report

Source: Plausible Stats API v2. Range: 2026-09-19 to 2026-09-22. Event schema version 1. Minimum sample 50 events per segment. Rates are INTENT unless the funnel says outcome.

## Discovery → detail → purchase intent → retailer click (intent)

Retailer click is the conversion proxy; no downstream purchase data exists.

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA | 0 ⚠︎ below minimum sample |  |
| Book View | 0 ⚠︎ below minimum sample | n/a |
| Purchase CTA View {"placement":"detail"} | 0 ⚠︎ below minimum sample | n/a |
| Purchase Click | 0 ⚠︎ below minimum sample | n/a |

## Catalog card → retailer click (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Purchase Click {"placement":"card"} | 0 ⚠︎ below minimum sample |  |

## Book → activity → completion (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 0 ⚠︎ below minimum sample |  |
| Continue Journey {"destination":"activity"} | 0 ⚠︎ below minimum sample | n/a |
| Activity Complete | 0 ⚠︎ below minimum sample | n/a |

## Book → activity → next book (loop completion) (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 0 ⚠︎ below minimum sample |  |
| Continue Journey {"destination":"activity"} | 0 ⚠︎ below minimum sample | n/a |
| Continue Journey {"placement":"activity","destination":"book"} | 0 ⚠︎ below minimum sample | n/a |
| Book View | 0 ⚠︎ below minimum sample | n/a |

## Newsletter: view → start → lead (outcome)

Lead Created is backend-confirmed creation (single opt-in).

| Step | Events | Rate from previous |
|---|---|---|
| Form View | 1 ⚠︎ below minimum sample |  |
| Form Start | 0 ⚠︎ below minimum sample | 0.0% |
| Lead Created | 0 ⚠︎ below minimum sample | n/a |

## Home → free bundle → download → book discovery (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA {"destination":"free-bundle"} | 0 ⚠︎ below minimum sample |  |
| Landing View | 1 ⚠︎ below minimum sample | n/a |
| Lead Created | 0 ⚠︎ below minimum sample | 0.0% |
| Magnet Download | 0 ⚠︎ below minimum sample | n/a |
| Continue Journey {"placement":"signup-success"} | 0 ⚠︎ below minimum sample | n/a |

## Landing page entrance → next action (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Landing View | 1 ⚠︎ below minimum sample |  |
| Form Start | 0 ⚠︎ below minimum sample | 0.0% |
| Lead Created | 0 ⚠︎ below minimum sample | n/a |

## Return: personalized view → recommendation click → book view (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Personalized View | 0 ⚠︎ below minimum sample |  |
| Recommendation Click | 0 ⚠︎ below minimum sample | n/a |
| Book View | 0 ⚠︎ below minimum sample | n/a |

## Book view → share (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 0 ⚠︎ below minimum sample |  |
| Share | 0 ⚠︎ below minimum sample | n/a |

## Book performance (S5-004): retailer clicks per book view

No book reached 50 views; nothing is classified.

## Locale parity (S5-013)

| Locale | Form views | Leads | Rate |
|---|---|---|---|
| en | 0 ⚠︎ below minimum sample | 0 | n/a |
| fr | 1 ⚠︎ below minimum sample | 0 | 0.0% |
| es | 0 ⚠︎ below minimum sample | 0 | n/a |

A locale whose rate is under half of English with a full sample is a translation or parity gap to investigate.

## Age-band segmentation (S5-014)

Book views by primary age band: none.


## Known gaps

- Retailer purchases are not observable; every purchase figure is an outbound click (intent).
- Format (paperback / eBook) is chosen on Amazon and is not measurable.
- Plausible custom properties must be enabled per property in the dashboard for breakdowns to populate.
