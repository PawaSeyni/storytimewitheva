# Newsletter signups report, 18 November 2026

**Source:** the MailerLite account, read on 18 November 2026 (all 50 subscriber records, with their `lead_magnet`, `language` and `utm_*` fields). Aggregates only; no subscriber is named here.
**Why:** the activities re-audit (`docs/activities-audit-2026-11.md` §7d, P0) found that nothing had been measured since September. This report covers the email side; the traffic side, from a Plausible export, is `docs/analytics/REPORT_2026-11-18-funnel.md`.
**Period:** the first site signup was on 11 August 2026; the last on 12 November 2026.

## 1. What is in the account

| Kind of record | Count | Notes |
|---|---:|---|
| Site signups through a free printable | **18** | `source: api` or `webform` with a storytimewitheva `lead_magnet`. 2 later unsubscribed, so **16 active**. |
| Imported list (16 August) | 19 | No fields, no emails sent. Not from the site. |
| Another project's signups | 5 | `lead_magnet: accountability-gap-launch` (3, all 16 November, owner tests) and `topic: divorce / employment` (2). The account is shared with a different site. |
| Owner test addresses | 7 | `pnguer+…`, `x@example.com` and one manual entry. Excluded below. |
| Other | 1 | A manual entry from May. |

The owner-test and other-project records mean **the raw subscriber count overstates the site's list by about 3×**: 50 records, 16 active site signups.

## 2. Site signups by free printable

| Lead magnet | Signups | Of which unsubscribed | Languages |
|---|---:|---:|---|
| Bilingual flashcards | **6** | 0 | FR 3 · EN 2 · ES 1 |
| Bilingual bundle | **5** | 0 | ES 4 · EN 1 |
| Bedtime routine | **4** | 1 | EN 3 · ES 1 |
| Parents' guide | 2 | 1 | EN 1 · FR 1 |
| Classroom pack | 1 | 0 | EN 1 |
| Home reading pack | 0 | | |
| Leo and the Wolf storybook | 0 | | |
| Bilingual starter kit | 0 | | one owner test only |
| **20 per-book activity kits** (live since 15 November) | **0** | | nothing links to them yet |
| **Total** | **18** | 2 | EN 8 · ES 6 · FR 4 |

## 3. By month

| Month | Site signups |
|---|---:|
| August 2026 (from the 11th) | 7 |
| September | 7 |
| October | 2 |
| November (to the 18th) | 2 |

Signups fell from about 7 a month to about 2 a month in October. The UTM tags below say why: the September signups came from specific pins and Facebook posts, and the later months have almost none of those.

## 4. By source (UTM tags on the signup)

| Source | Signups | The posts that worked |
|---|---:|---|
| Pinterest | 9 | **P-032** (flashcards, French): 3 signups, the single best-performing post. P-010 (bedtime, EN): 2. P-012 (flashcards, EN): 2. P-002, P-014: 1 each. |
| Facebook | 6 | **FB-025** (bundle, Spanish): 3. FB-004, FB-015, FB-016: 1 each. |
| No tag (typed the address, or an untagged link) | 3 | |

Two posts, **P-032** and **FB-025**, account for a third of all signups. Both are non-English.

## 5. Welcome emails

Most site subscribers have received 4 emails from the welcome automation.
- 7 of 18 opened at least one email; 11 opened none.
- 1 subscriber clicked a link (the November bedtime-routine signup, who opened and clicked both emails).
- The two unsubscribes both came within 3 days of signing up, one from the parents' guide (FR) and one from the bedtime routine (EN).

With 18 people, none of these rates means much yet. They do say that the welcome sequence is being delivered.

## 6. What this says

1. **The list is small and recent:** 16 active people over three months. Every change below is cheap to test because the numbers are so low.
2. **Non-English posts convert best.** French flashcards (P-032) and the Spanish bundle (FB-025) are the two posts that produced repeat signups. The site's Spanish and French pages are a real asset, and the September report's language split (ES 5, EN 2, FR 2) pointed the same way.
3. **Signups follow posting.** The two months with pins and posts produced 14 signups; the two months after produced 4. There is no steady organic flow yet.
4. **The 20 activity kits have had no chance.** They have been live for three days, are deliberately noindex, and nothing links to them. Their first real test is the pins and captions in the P0 list.
5. **Three offers have never produced a signup:** the home reading pack, the Leo storybook and the starter kit. Nothing has been posted that links to them.
6. **The shared account muddies the count.** Another project's signups and a batch of test addresses sit in the same list. A MailerLite group or segment per site would keep the storytimewitheva numbers clean.

## 7. Recommended next steps

| Priority | Step | Needs |
|---|---|---|
| P0 | **Post the 20 kit pins**, with `?utm_source=pinterest&utm_medium=social&utm_campaign=kit_<book>&utm_content=<pin id>` on each link, so each kit's signups can be attributed like P-032's. | Owner approval of the captions |
| P0 | **Repeat what worked:** a French flashcards pin and a Spanish bundle post in the same style as P-032 and FB-025. | Owner |
| P1 | **Read Plausible** for the same period: book page → activity clicks by book, activity completions, and Form View → Lead Created by placement. That is the other half of this report. | Plausible export or access |
| P1 | **Separate the sites in MailerLite:** a group per site, and a segment that excludes `pnguer+` test addresses, so the next count is clean. | Owner (MailerLite settings) |
| P2 | **Post for the three offers that have no signups** (home reading pack, Leo storybook, starter kit), or retire the ones not worth promoting. | Owner |
| P2 | Re-run this report monthly. The reading is a few API calls; the write-up is this file's format. | — |
