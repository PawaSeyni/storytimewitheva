# Plausible funnel setup & KPI runbook

Privacy-first funnel measurement for storytimewitheva.com. Plausible is cookieless,
aggregate, and carries **no PII** — analytics is never joined to MailerLite subscriber
identity. This runbook is the owner-side setup that turns the events the site already
fires into a funnel + KPIs.

**Install status:** the site-keyed snippet (`pa-gzJ4DP5LRQ39ZXessq04G.js` + `plausible.init()`)
is live in `index.html` and verified — nothing more to paste. Everything below is done in the
Plausible dashboard + your ad platform.

---

## Event taxonomy (already implemented in `src/lib/analytics.ts`)

Automated/bot traffic (and the build-time prerender) is excluded via a `navigator.webdriver`
guard, so only **real** visits count. Campaign UTMs are auto-attached to every event; any
PII-shaped key (email/name/subscriber_id) is stripped defensively.

| Event | Fires when | Properties |
|---|---|---|
| `Landing View` | a `/free/:magnet` landing page renders | language, lead_magnet, landing_page, utm_* |
| `Form View` | the signup form scrolls into view | language, lead_magnet, utm_* |
| `Form Start` | first interaction with the form | language, lead_magnet, utm_* |
| `Form Submit` | a valid submission is sent | language, lead_magnet, utm_* |
| `Lead Created` | **backend confirms a MailerLite subscriber** (success only) | language, lead_magnet, utm_* |
| `Magnet Download` | a download link is clicked | language, lead_magnet, asset, utm_* |
| `Book View` | a book detail page is viewed | book, utm_* |
| `Purchase Click` | an outbound Amazon buy link is clicked | book, destination, utm_* |

UTM keys captured: `utm_source, utm_medium, utm_campaign, utm_content, utm_term`.

---

## Step 0 — Prove it works (free, 30 seconds)

On your **phone** (normal browser, no ad-blocker), open:

```
https://storytimewitheva.com/es/free/bedtime-routine?utm_source=selftest&utm_campaign=validate
```

In the dashboard: **current visitors → 1**, and within a minute you'll see the pageview, the
`Landing View` event, and `selftest` / `validate` under **Sources / Campaigns**. (My automated
test loads are deliberately filtered, which is why the dashboard reads 0 until a real visit.)

## Step 1 — Enable Custom Properties

Dashboard → your site → top-right **⋮** → **Site settings** → **Properties** → allow:

```
language   lead_magnet   landing_page   asset   book   destination
utm_source   utm_medium   utm_campaign   utm_content   utm_term
```

(Available on Growth+ plans.) Until enabled, events still count — you just can't break them
down by these dimensions.

## Step 2 — Create the goals (custom events)

Dashboard → **⋮** → **Site settings** → **Goals** → **+ Add goal** → *Custom event*, once each:

```
Landing View   Form View   Form Start   Form Submit   Lead Created
Magnet Download   Book View   Purchase Click
```

Names must match exactly (case-sensitive).

## Step 3 — Build the funnel

Dashboard → **Behaviours / Funnels** → **+ Set up funnel**, in order:

```
Landing View → Form View → Form Start → Form Submit → Lead Created
```

This shows the drop-off at each step. Filter by `utm_campaign` to see a single campaign's funnel.
(Funnels require a Business plan.)

## Step 4 — Run the controlled first test

Point the Spanish Bedtime ad at:

```
https://storytimewitheva.com/es/free/bedtime-routine?utm_source=pinterest&utm_medium=paid_social&utm_campaign=bedtime_es
```

Then in Plausible → **Campaigns**, filter `utm_campaign = bedtime_es` to watch that campaign's
pageviews, funnel, and `Lead Created` count.

---

## KPIs

Compute from Plausible goals (aggregate) + MailerLite (verified subscribers), grouped by
`utm_campaign`:

| KPI | Formula |
|---|---|
| Landing → form-start rate | `Form Start` / `Landing View` |
| Form completion rate | `Lead Created` / `Form Start` |
| Landing conversion rate | `Lead Created` / `Landing View` |
| Download rate | `Magnet Download` / `Lead Created` |
| **CPAS** (primary paid-media KPI) | ad spend / **verified MailerLite subscribers** for that `utm_campaign` |
| Subscriber → book engagement | (`Book View` + `Purchase Click`) / `Lead Created` |

**Reconciliation:** Plausible's `Lead Created` count and MailerLite's new-subscriber count for the
same magnet/language/campaign/period should track closely. A gap is an operational QA signal
(e.g. delivery or filtering issue), not a number to average.

**Why CPAS comes from MailerLite, not a pixel:** verified subscribers are the real outcome, and
computing cost-per-subscriber from MailerLite keeps the design's promise — no advertising pixel,
no cookies, no visitor-level profiling.

---

## Notes

- **Legacy `?lm=` links still work** (offer-first homepage) and fire the same events, so old pins
  keep converting; new campaigns should use the `/free/:magnet` URLs.
- **No PII, ever** — the analytics layer strips email/name/subscriber_id; MailerLite alone holds
  identity.
- To add a new magnet's landing page: add its copy/PDF to `LEAD_MAGNETS` and its slug to
  `LANDING_SLUGS` in `scripts/prerender.mjs` (a build-time guard fails the build if you forget).
