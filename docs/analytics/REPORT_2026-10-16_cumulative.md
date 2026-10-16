# Funnel and performance report

Source: Plausible Stats API v2. Range: 2026-08-23 to 2026-10-16. Event schema version 1. Minimum sample 50 events per segment. Rates are INTENT unless the funnel says outcome.

## Discovery → detail → purchase intent → retailer click (intent)

Retailer click is the conversion proxy; no downstream purchase data exists.

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA | 1 ⚠︎ below minimum sample |  |
| Book View | 20 ⚠︎ below minimum sample | 2000.0% |
| Purchase CTA View {"placement":"detail"} | 8 ⚠︎ below minimum sample | 40.0% |
| Purchase Click | 0 ⚠︎ below minimum sample | 0.0% |

## Catalog card → retailer click (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Purchase Click {"placement":"card"} | 0 ⚠︎ below minimum sample |  |

## Book → activity → completion (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 20 ⚠︎ below minimum sample |  |
| Continue Journey {"destination":"activity"} | 0 ⚠︎ below minimum sample | 0.0% |
| Activity Complete | 0 ⚠︎ below minimum sample | n/a |

## Book → activity → next book (loop completion) (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 20 ⚠︎ below minimum sample |  |
| Continue Journey {"destination":"activity"} | 0 ⚠︎ below minimum sample | 0.0% |
| Continue Journey {"placement":"activity","destination":"book"} | 0 ⚠︎ below minimum sample | n/a |
| Book View | 20 ⚠︎ below minimum sample | n/a |

By book: mayas-shadow 6 ⚠︎ below minimum sample · colors-mixed-up 3 ⚠︎ below minimum sample · little-mapmaker 3 ⚠︎ below minimum sample · diegos-brave-leap 2 ⚠︎ below minimum sample · sanding-block 1 ⚠︎ below minimum sample · fig-trees-secret 1 ⚠︎ below minimum sample · little-boats-big-wish 1 ⚠︎ below minimum sample · tower-touched-sky 1 ⚠︎ below minimum sample · sparrow-saved-forest 1 ⚠︎ below minimum sample · heidis-journey-to-mastery 1 ⚠︎ below minimum sample

By activity: (unset) 20 ⚠︎ below minimum sample

## Newsletter: view → start → lead (outcome)

Lead Created is backend-confirmed creation (single opt-in).

| Step | Events | Rate from previous |
|---|---|---|
| Form View | 130 |  |
| Form Start | 10 ⚠︎ below minimum sample | 7.7% |
| Lead Created | 11 ⚠︎ below minimum sample | 110.0% |

By placement: (none) 6 ⚠︎ below minimum sample · landing 5 ⚠︎ below minimum sample

By lead_magnet: bilingual-bundle 4 ⚠︎ below minimum sample · bilingual-flashcards 4 ⚠︎ below minimum sample · parents-guide 1 ⚠︎ below minimum sample · bedtime-routine 1 ⚠︎ below minimum sample · classroom-pack 1 ⚠︎ below minimum sample

By language: es 5 ⚠︎ below minimum sample · fr 4 ⚠︎ below minimum sample · en 2 ⚠︎ below minimum sample

## Home → free bundle → download → book discovery (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA {"destination":"free-bundle"} | 0 ⚠︎ below minimum sample |  |
| Landing View | 118 | n/a |
| Lead Created | 11 ⚠︎ below minimum sample | 9.3% |
| Magnet Download | 19 ⚠︎ below minimum sample | 172.7% |
| Continue Journey {"placement":"signup-success"} | 1 ⚠︎ below minimum sample | 5.3% |

By lead_magnet: (unset) 1 ⚠︎ below minimum sample

By language: (unset) 1 ⚠︎ below minimum sample

## Landing page entrance → next action (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Landing View | 118 |  |
| Form Start | 10 ⚠︎ below minimum sample | 8.5% |
| Lead Created | 11 ⚠︎ below minimum sample | 110.0% |

By landing_page: (unset) 11 ⚠︎ below minimum sample

By lead_magnet: bilingual-bundle 4 ⚠︎ below minimum sample · bilingual-flashcards 4 ⚠︎ below minimum sample · parents-guide 1 ⚠︎ below minimum sample · bedtime-routine 1 ⚠︎ below minimum sample · classroom-pack 1 ⚠︎ below minimum sample

By language: es 5 ⚠︎ below minimum sample · fr 4 ⚠︎ below minimum sample · en 2 ⚠︎ below minimum sample

By utm_campaign: (unset) 11 ⚠︎ below minimum sample

## Return: personalized view → recommendation click → book view (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Personalized View | 3 ⚠︎ below minimum sample |  |
| Recommendation Click | 0 ⚠︎ below minimum sample | 0.0% |
| Book View | 20 ⚠︎ below minimum sample | n/a |

By placement: (unset) 20 ⚠︎ below minimum sample

By reason: (unset) 20 ⚠︎ below minimum sample

By book: mayas-shadow 6 ⚠︎ below minimum sample · colors-mixed-up 3 ⚠︎ below minimum sample · little-mapmaker 3 ⚠︎ below minimum sample · diegos-brave-leap 2 ⚠︎ below minimum sample · sanding-block 1 ⚠︎ below minimum sample · fig-trees-secret 1 ⚠︎ below minimum sample · little-boats-big-wish 1 ⚠︎ below minimum sample · tower-touched-sky 1 ⚠︎ below minimum sample · sparrow-saved-forest 1 ⚠︎ below minimum sample · heidis-journey-to-mastery 1 ⚠︎ below minimum sample

## Book view → share (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 20 ⚠︎ below minimum sample |  |
| Share | 0 ⚠︎ below minimum sample | 0.0% |

## Book performance (S5-004): retailer clicks per book view

No book reached 50 views; nothing is classified.

## Locale parity (S5-013)

| Locale | Form views | Leads | Rate |
|---|---|---|---|
| en | 91 | 2 | 2.2% |
| fr | 21 ⚠︎ below minimum sample | 4 | 19.0% |
| es | 18 ⚠︎ below minimum sample | 5 | 27.8% |

A locale whose rate is under half of English with a full sample is a translation or parity gap to investigate.

## Age-band segmentation (S5-014)

Book views by primary age band: ages-3-5 7 · ages-6-7 10 · ages-8-9 3.

⚠︎ 1 unknown book id(s) in the data: (none). These rows are excluded; validation failed.

## Known gaps

- Retailer purchases are not observable; every purchase figure is an outbound click (intent).
- Format (paperback / eBook) is chosen on Amazon and is not measurable.
- Plausible custom properties must be enabled per property in the dashboard for breakdowns to populate.
