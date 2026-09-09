# Newsletter links and attribution (S5-019)

Newsletter emails are authored in the MailerLite dashboard (the API cannot edit email HTML,
see the welcome-sequence notes). This is the link standard the owner applies there so the
newsletter-to-reading path is measurable with the same taxonomy as the site.

## Link standard

| Purpose | URL shape | Why |
|---|---|---|
| A printable | `https://storytimewitheva.com/download/<slug>?lang=<xx>&utm_source=newsletter&utm_medium=email&utm_campaign=<sequence>-<n>` | stable, never rots; `lang` picks the edition |
| A book | `https://storytimewitheva.com/<xx>/books/<id>/?utm_source=newsletter&utm_medium=email&utm_campaign=<sequence>-<n>` | the page fires `Book View` with the UTMs attached automatically |
| A collection, journey or guide | same pattern on `/collections/<id>/`, `/journeys/<id>/`, `/resources/#<slug>` | same |
| A pack or offer | `https://storytimewitheva.com/<xx>/free/<magnet>?utm_source=newsletter&utm_medium=email&utm_campaign=<sequence>-<n>` | `Landing View` and the signup funnel carry the campaign |

`<sequence>` is `welcome`, `monthly`, or the campaign name; `<n>` the email number. Never a
subscriber id, an email address or a name in any URL.

## What the site does with it

`track()` attaches `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term`
from the URL to every event on that page view, so the funnel report's "Landing page entrance"
and every other funnel can be filtered by `utm_campaign=welcome-2`. Relevance is content, not
tracking: the welcome sequence links the printables, the parent guides that pair with them
(each guide now links its stories and collections), and the catalog.

## Owner checklist (dashboard)

- Replace any hashed PDF URL in an email with the `/download/<slug>` form.
- Add the three UTM parameters to every link, per the table.
- After the first send, run `npm run report:funnels -- --from <send date>` and read the
  "Landing page entrance" funnel by `utm_campaign`.
