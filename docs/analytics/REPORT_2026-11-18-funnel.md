# Site traffic and funnel report, 18 November 2026

**Source:** a Plausible export for storytimewitheva.com, all time (21 May to 18 November 2026), supplied by the owner. Aggregates only.
**Companion report:** `docs/analytics/REPORT_2026-11-18-signups.md` (the MailerLite side). Together they are the P0 "first funnel report" from the activities re-audit (`docs/activities-audit-2026-11.md` §7d).
**Caveat:** the export totals the whole period, so it cannot split a funnel by month. Where timing matters, the daily visitor series is used. Rates on samples under 50 carry a ⚠︎, as in the September report.

## 1. Headline numbers

| | Value |
|---|---:|
| Unique visitors, all time | about **640** |
| Of which Pinterest | 396 (62%) |
| Of which paid Pinterest (`utm_medium=paid_social`) | 374 (58%) |
| Signups (`Lead Created`) | **16** |
| Book page views (`Book View`, unique) | **22** |
| Book page → activity clicks (`Continue Journey` to an activity) | **1** ⚠︎ |
| Activity completions | **1** ⚠︎ |
| Amazon clicks (`Purchase Click` plus outbound Amazon links) | about **6** ⚠︎ |
| Mobile share | 68% (Android 241, iOS 209) |

The site has been running for six months with one paid push. **Most visitors arrived from one August Pinterest campaign, landed on a free-printable page for a few seconds, and left.** Very few people have reached a book page, and almost nobody has used the activities yet.

## 2. Traffic over time

| Month | Visitors (sum of daily) |
|---|---:|
| May–July | 36 |
| **August** | **399** |
| September | 70 |
| October | 59 |
| November (to the 18th) | 80 |

August is the paid Pinterest campaign (the weeks of 17 and 24 August: 149 and 64 visitors). Since then the site has drawn **15 to 35 visitors a week**, rising slightly in late October and November (24, 35, 23, 18).

## 3. Where visitors come from

| Channel | Visitors | Bounce | Avg visit |
|---|---:|---:|---:|
| Paid social (Pinterest) | 374 | 4% | **5 s** |
| Direct | 101 | 34% | 2 m 47 s |
| Organic search (Google 95, Bing 1) | 96 | 74% | 28 s |
| Organic social (Facebook 34, Pinterest unpaid, Instagram) | 59 | 12% | 1 m 33 s |
| AI assistants (ChatGPT) | 10 | 20% | 24 s |
| Referral | 5 | 0% | 27 s |

- **Paid Pinterest visitors stay about 5 seconds.** 193 visitors came through the Pinterest app's in-app browser. A 4% bounce with a 5-second visit means a page view and a close, not engagement.
- **Direct and organic social visitors stay minutes,** and organic social has a low bounce rate. These are people who meant to come.
- **Google sends 95 visitors, mostly to the follow-up activities guide** (`/es/resources/follow-up-activities/` 39 entries, `/resources/follow-up-activities/` 25), and 85-88% leave from that page. It is the site's only real search entry point.
- **ChatGPT already sends 10 visitors.**

**Countries:** United States 245, Mexico 123, Canada 81, Spain 78, France 19. **Spanish-speaking countries are a third of all traffic.**

## 4. The email signup funnel

| Step | Unique visitors | Rate from previous |
|---|---:|---:|
| Landing View (a `/free/…` page) | 407 | |
| Form View | 428 | |
| Form Start (typed in the form) | 17 | **4%** |
| Lead Created | 16 | 94% |

**The leak is between seeing the form and starting it.** Once someone starts typing, nearly all of them finish. Nearly all of the 428 form views came from the paid campaign's 5-second visits.

### By campaign

Visitors are from Plausible; signups are the `utm_content` tags on the MailerLite subscribers (first report).

| Post | Campaign | Visitors | Signups | Rate |
|---|---|---:|---:|---:|
| P-014 (paid) | parents-guide, EN, US | 167 | 1 | 0.6% |
| P-002 (paid) | bedtime, ES | 116 | 1 | 0.9% |
| P-020 (paid) | bedtime, ES | 56 | 0 | 0% |
| P-010 (paid) | bedtime, EN, US | 36 | 2 | 6% ⚠︎ |
| **P-032 (organic)** | **flashcards, FR** | **13** | **3** | **23%** ⚠︎ |
| **FB-025 (organic)** | **bundle, ES** | **7** | **3** | **43%** ⚠︎ |
| P-012 (organic) | flashcards, EN | 5 | 2 | 40% ⚠︎ |

The samples are small, but the gap is two orders of magnitude: **paid pins converted at about 1%, organic posts at 20-40%.** The paid campaign bought page views from people who had not chosen to come; the organic posts reached parents who were already looking.

### By free printable (Plausible `lead_magnet` property, visitors who saw that offer)

| Offer | Visitors who saw it | Signups (MailerLite) |
|---|---:|---:|
| Bedtime routine | 210 | 4 |
| Parents' guide | 167 | 2 |
| Bilingual bundle | 54 | 5 |
| Bilingual flashcards | 26 | 6 |
| Leo storybook | 10 | 0 |
| Classroom pack | 1 | 1 |

**The flashcards and the bundle convert best by far** (about 1 in 5 and 1 in 10 viewers). The bedtime routine and the parents' guide drew the paid traffic and converted at 1-2%.

## 5. Books and activities

| Step | Unique visitors |
|---|---:|
| Book View | 22 |
| Purchase CTA View (the Buy block) | 10 |
| Continue Journey → activity | 1 |
| Activity Complete | 1 |
| Purchase Click (on site) | 1 |
| Outbound clicks to Amazon | about 5 |

- **Only 22 people have opened a book page in six months.** Maya's Shadow (8), Colors (5) and Little Mapmaker (3) lead; every other book has 1 or 2.
- **The activities are barely visited, which is a traffic problem, not an activity problem.** Activity pages had 1-2 visitors each, except **Story Builder (25 visitors, 23 of them landing there directly, about 2 minutes on the page)**, which Google sends people to. The re-audit had it on the "decide whether to keep" list; the data says keep it, and give it a book mode.
- The first visitor to a new Studio page (Small Noticer, 18 November) stayed 2½ minutes and scrolled 93%.
- **No visits to the 20 activity kits or the classroom units yet:** they went live on 15 and 18 November and nothing links to them.

## 6. Other signals

- **Client errors:** 10 `TypeError` events from 9 visitors, 9 of them on the homepage (`route: /`) and 1 on an activity page. The event records only the error type and route, so the cause can't be read from the export. This is the one engineering follow-up the data raises.
- **Language switching:** 22 switches by 8 visitors.
- **Search:** 4 searches.
- **Journeys:** the "Kindness that shines" journey was started once and saved twice.
- **Guides:** 67 visitors read a parent guide (`Guide View`), mostly the follow-up activities guide from Google.

## 7. What this says

1. **Paid Pinterest bought clicks, not readers.** 374 paid visitors, 5-second visits, about 1% signup. Don't repeat that campaign as it was.
2. **Organic, non-English posts work.** French flashcards and the Spanish bundle converted at 20-40%, and a third of all visitors are in Spanish-speaking countries.
3. **The site has a traffic problem before it has a content problem.** About 25 visitors a week, 22 book-page visitors in six months. The activities, kits and classroom units built this month have had no traffic yet, so they can't be judged.
4. **Google's one door is the follow-up activities guide,** and most visitors leave from it. That page is where to add a clear next step (a book, a kit, a classroom unit).
5. **Story Builder earns its place** through search.

## 8. Recommended next steps

| Priority | Step | Needs |
|---|---|---|
| P0 | **Post the 60 kit pins organically** (`docs/marketing/KIT_PINS_2026-11.md`), leading with Spanish and French. Their UTM tags make each kit measurable. Do not boost them until organic results show which ones convert. | Owner: approve and post |
| P0 | **Find the homepage TypeError.** Add the error message (scrubbed) to the `Client Error` event, or reproduce it on the browsers in the export (Pinterest in-app browser, Android 10, iOS 18.7). | Engineering; no owner input |
| P1 | **Give the follow-up activities guide a next step:** link the classroom units and the matching kits from that page, since it is the only page Google sends people to. | Engineering |
| P1 | **Give Story Builder a book mode** like the other generic activities, since it is the activity people actually find. | Engineering |
| P1 | **More French and Spanish organic posts** in the style of P-032 and FB-025. | Owner |
| P2 | Re-run both reports in mid-December, after the kit pins have been up for a few weeks, and compare by `utm_campaign=kit_*`. | — |
