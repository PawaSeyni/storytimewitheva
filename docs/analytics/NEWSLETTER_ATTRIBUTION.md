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

## Standing rule: Associates and Amazon Attribution never share a link

This is permanent and applies to every campaign, not just Holiday 2026.

| Surface | Tag | Never |
|---|---|---|
| Book pages and anything rendered by the site | Associates `storytimewi20-20`, added by `amazonDp()` | Attribution parameters |
| Campaign links authored in MailerLite | The Amazon-generated Attribution URL, used verbatim | The Associates tag |

**Why it is not a preference.** Associates Program Policies, Commission Income
Statement section 5, "Commission Income Limitations": attempting to claim
commissions from both Associates and another program using the same traffic,
"for example, by manipulating or combining attribution links", can lead to
withheld commissions or termination from the Associates program.

**Why it is also impossible.** Verified 22 September 2026 by generating a real
tag. Amazon's Attribution URL looks like this:

```
https://www.amazon.com/dp/<ASIN>?maas=maas_adg_<id>_afap_abs&ref_=aa_maas&tag=maas
```

It sets `tag=maas`. That is the same `tag` parameter the Associates ID uses, so
an Associates tag cannot be added without overwriting Amazon's own value. There
is no URL that carries both. The question is closed by construction.

**What it costs.** Nothing in royalty. A campaign click that converts still pays
the KDP royalty in full. Only the Associates commission is forgone, roughly 4.5%,
about thirty-five cents on an eight dollar picture book.

**The trap.** `src/lib/amazon.ts` appends the Associates tag to any amazon.com
URL passed through `amazonDp()` or `withAffiliateTag()`. Campaign links must be
pasted by hand from the Amazon Ads console and must never be generated from site
code.

## Owner checklist (dashboard)

- Replace any hashed PDF URL in an email with the `/download/<slug>` form.
- Add the three UTM parameters to every link, per the table.
- After the first send, run `npm run report:funnels -- --from <send date>` and read the
  "Landing page entrance" funnel by `utm_campaign`.
