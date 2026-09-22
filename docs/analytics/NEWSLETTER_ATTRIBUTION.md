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

**What a real generated tag shows.** Verified 22 September 2026 by creating one.
Amazon's Attribution URL looks like this:

```
https://www.amazon.com/dp/<ASIN>?maas=maas_adg_<id>_afap_abs&ref_=aa_maas&tag=maas
```

Amazon Attribution occupies the `tag` parameter itself and sets it to `maas`.
That is the same parameter an Associates ID would use, so in this configuration
there is no room for one without overwriting Amazon's own value.

Read that as evidence for the rule in the context we actually use, not as a
general claim about every Amazon linking context. The rule does not depend on the
mechanism and does not change if the mechanism does: **use Amazon's generated
Attribution URL verbatim, and never add the Associates tag to it.**

**What it costs.** Nothing in royalty. A campaign click that converts still pays
the KDP royalty in full. Only the Associates commission is forgone, roughly 4.5%,
about thirty-five cents on an eight dollar picture book.

**The trap.** `src/lib/amazon.ts` appends the Associates tag to any amazon.com
URL passed through `amazonDp()` or `withAffiliateTag()`. Campaign links must be
pasted by hand from the Amazon Ads console and must never be generated from site
code.

## Standing rule: verify the destination, never trust the catalogue

Three things can disagree, and none of the first two is what the customer sees:

1. The Eva catalogue in this repository.
2. The publishing metadata we believe we set.
3. The live Amazon listing.

Only the third reaches a reader. A campaign destination is therefore not verified
by its ASIN being right in the catalogue. It is verified by loading the page and
reading what it actually says.

**Creating a tag is mechanical. Trusting where it points is not.** Keep those two
as separate steps and run the second one after creation, every time. Proven on
22 September 2026: nine destinations were generated from a catalogue that was
correct, and one of them still resolved to a listing with a different title and a
different age range from every other language of the same book.

Acceptance for any Amazon destination used in a campaign:

1. Correct title.
2. Correct language.
3. Correct format, paperback or Kindle as intended.
4. The generated URL used unchanged, with nothing appended.
5. The URL resolves to the intended product page when loaded.

Amazon blocks scripted fetches, so load it in a browser rather than with curl.

## Owner checklist (dashboard)

- Replace any hashed PDF URL in an email with the `/download/<slug>` form.
- Add the three UTM parameters to every link, per the table.
- After the first send, run `npm run report:funnels -- --from <send date>` and read the
  "Landing page entrance" funnel by `utm_campaign`.
