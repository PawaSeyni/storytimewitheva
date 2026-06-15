# Usability testing plan — storytimewitheva.com

A lightweight plan to learn whether parents and kids can actually do the core
things the site is for. Two tracks: (1) passive feedback collected continuously
from real visitors, and (2) a small round of light, unmoderated task testing.

## What we want to learn

1. Can a parent find and start a book (or buy one) without help?
2. Can a child (with a parent) find and complete an activity?
3. Does the bilingual / language switching make sense and work?
4. Where do people get stuck, confused, or drop off?

## Track 1 — passive feedback widget (now live)

`src/components/FeedbackWidget.tsx` puts a small "Give feedback" button on every
page. A visitor picks a quick rating (great / okay / not great), optionally adds
a comment, and it records the current page. Submissions go to Netlify Forms
(form-name `feedback`) with no backend and no personal data.

- Review submissions in the Netlify dashboard: site `storytimewitheva` →
  Forms → `feedback`.
- Add an email notification rule the same way the `contact` form has one, so new
  feedback is not missed (Netlify dashboard → Forms → Notifications).
- Watch the `page` field: a cluster of "not great" on one page is a signal to
  investigate that flow.

## Track 2 — light unmoderated task test

### Participants
- 4 to 6 parent + child pairs (children roughly ages 3 to 10).
- Mix of: at least one Spanish-preferring and one French-preferring household
  (the bilingual promise is core); a range of device types (most traffic is
  mobile, so bias toward phones).
- Recruit from: the newsletter list, Instagram followers, friends/family of the
  team. Keep it informal; this is directional, not statistical.

### Format
- Remote and unmoderated is fine: send the task list and ask them to think aloud
  on a screen recording (Loom, or just their phone's screen record), or do it
  live over a video call if easier.
- 15 to 20 minutes per pair. No incentive needed for friends/family; a free
  book or kit is a nice thank-you otherwise.

### Tasks (give one at a time, in the participant's language)
1. "Find a book about kindness and start reading it aloud." (tests browse +
   read-aloud)
2. "Switch the site to Spanish (or French) and find the same book again."
   (tests the language switcher + per-language URLs)
3. "Find a free activity your child can do, and complete it." (tests Activities
   + a demo or game end to end)
4. "Sign up for the free starter kit." (tests the lead-capture form)
5. "Find out how much a paperback costs and where to buy it." (tests pricing +
   Amazon handoff)
6. Child-led: "Let your child pick anything they want to do and watch what they
   tap." (open exploration; watch for confusion)

### What to capture
- Did they complete the task? (yes / with struggle / no)
- Where did they hesitate, backtrack, or ask for help?
- Any moment of delight or confusion (quote it).
- Language: did anything stay in the wrong language?

## Success metrics to watch in Plausible

Pair the qualitative findings with the analytics already running (cookieless
Plausible). Define and watch:

- Newsletter signup conversion rate (goal: signups / sessions).
- Language usage split (en vs es vs fr) — does it match the audience we expect?
- Top activities and books by pageview; which demos get opened vs finished.
- Outbound clicks to Amazon (buy intent).
- Drop-off pages with high exits, cross-referenced with feedback-widget ratings.

(If any of these are not set up as Plausible goals yet, add them: signup submit,
Amazon outbound, activity-complete.)

## Privacy and consent (testing with children)

- No child accounts and no personal data on the site (localStorage only), so the
  product itself is low-risk.
- For the task test, get parental consent. The parent operates the device and is
  present throughout. Children are never recorded alone; capture the screen, not
  the child's face, unless the parent explicitly agrees.
- Do not collect children's names or personal details in notes. Refer to pairs
  as P1, P2, etc.
- Follow COPPA principles: no collection of personal information from under-13s.
  The feedback widget collects no personal data by design.

## Turning findings into work

After Track 2, write up the top 3 to 5 friction points and add them to
`PUNCH_LIST.md`. Re-check the same tasks after fixes. Track 1 (the widget) runs
continuously and feeds new items as they surface.
