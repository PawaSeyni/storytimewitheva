# Event Dictionary, schema version 1 (S5-021)

> Generated from `src/analytics/events.ts` by `npm run gen:events`; a test fails when this file is
> stale. Live names are what `track()` sends and what Plausible goals reference; the spec's
> snake_case names are aliases. Every property is on the default-deny allowlist in
> `src/lib/analytics.ts`; UTM keys are attached from the URL automatically.

## Deprecation process
An event is never renamed in place: add the new event, mark the old one deprecated with its
replacement, keep both for one release, remove the old one, and bump the schema version only
when a property's meaning changes. Reports state the schema version they were built on.

## Events

| Live name | Spec alias | Kind | Required | Optional | Allowed values | Owner | Privacy |
|---|---|---|---|---|---|---|---|
| `Homepage CTA` |  | intent | `destination` | `book` |  | growth | destination token and book id only |
| `Book View` |  | intent | `book` |  |  | product | stable book id |
| `Recommendation Click` |  | intent | `book`, `placement`, `reason` |  | reason: editorial \| related \| theme \| age \| preference | product | ids and reason tier |
| `Personalized View` |  | exposure | `placement` |  |  | product | placement only; never the library |
| `Continue Journey` |  | intent | `placement`, `destination` | `book`, `activity`, `reason`, `resource` |  | product | ids and placement |
| `Search` |  | intent | `language`, `filter`, `results` |  |  | product | filter and count; NEVER the query text |
| `Purchase CTA View` | purchase_cta_impression | exposure | `book`, `placement`, `edition` |  | placement: detail; edition: en \| es \| fr | growth | once per book page view when the Buy control is viewable |
| `Purchase Click` | purchase_cta_clicked / retailer_click | intent | `book`, `destination`, `placement`, `edition` |  | destination: amazon; placement: detail \| card; edition: en \| es \| fr | growth | outbound click is the conversion PROXY; no retailer purchase data exists (S5 open decision) |
| `Edition Selected` (reserved) | edition_selected | intent | `book`, `edition` |  |  | growth | not instrumented: no edition selector exists: the edition follows the site language and is carried on Purchase Click as `edition`; format (paperback/eBook) is chosen on Amazon and is not measurable |
| `Landing View` | free_bundle_opened (when lead_magnet is a bundle or pack) | exposure | `language`, `lead_magnet`, `landing_page` |  |  | growth | magnet slug and route; UTMs from the URL |
| `Form View` | newsletter_cta_impression | exposure | `language`, `lead_magnet`, `placement` |  | placement: home \| landing \| books \| activities \| resources \| about \| detail \| card \| signup-success \| related \| activity \| game \| profile \| journey | growth | once per form when viewable |
| `Form Start` | newsletter_signup_started | intent | `language`, `lead_magnet`, `placement` |  |  | growth | first interaction only |
| `Form Submit` | newsletter_signup_submitted | intent | `language`, `lead_magnet`, `placement` |  |  | growth | no field values |
| `Lead Created` | newsletter_signup_confirmed (provider evidence: the subscribe function returned success; MailerLite is single opt-in, so this is creation, not a double opt-in confirmation) | outcome | `language`, `lead_magnet`, `placement` |  |  | growth | fires only on backend success; never the email |
| `Magnet Download` | free_bundle_download_started | outcome | `language`, `lead_magnet`, `asset` | `placement` |  | growth | asset path only |
| `Share` | share_initiated | intent | `book`, `target`, `placement` |  | target: native \| copy; placement: detail | growth | target kind only; the share sheet never reports the recipient |
| `Experiment Exposure` | experiment_exposure | exposure | `experiment`, `variant` | `placement` |  | product | once per assignment when the variant is viewable; ids only |
| `Read Aloud` |  | intent |  | `book`, `language` |  | product | no text |
| `Activity Complete` |  | outcome | `activity` |  |  | product | activity slug |
| `Language Switch` |  | intent |  | `language` |  | product | target language |
| `Library Status` |  | intent | `book`, `status` | `placement` |  | product | status token, never the library |
| `Favorite` |  | intent | `book`, `status` | `placement` |  | product | as above |
| `Resource Saved` |  | intent | `resource`, `status` |  |  | product | resource id |
| `Local Data Cleared` |  | intent |  | `placement` |  | product | placement only |
| `Journey Start` |  | intent | `journey` |  |  | product | journey id |
| `Journey Step` |  | intent | `journey`, `activity`, `status` |  | status: done \| undone | product | journey id, step index, state |
| `Journey Complete` |  | outcome | `journey` |  |  | product | journey id |
| `Journey Saved` |  | intent | `journey`, `status` |  | status: added \| removed | product | journey id |
| `Client Error` |  | diagnostic | `kind`, `route` |  |  | engineering | error class and route pattern only |

## Funnels (derived, `src/analytics/funnels.ts`)

Minimum sample before a rate is reported without a warning: 50 events in the segment.

| Funnel | Steps | Group by | Measures |
|---|---|---|---|
| Discovery → detail → purchase intent → retailer click | `Homepage CTA` → `Book View` → `Purchase CTA View` {placement=detail} → `Purchase Click` | book, edition, placement, language | intent: Retailer click is the conversion proxy; no downstream purchase data exists. |
| Catalog card → retailer click | `Purchase Click` {placement=card} | book, edition | intent |
| Book → activity → completion | `Book View` → `Continue Journey` {destination=activity} → `Activity Complete` | book, activity | outcome |
| Book → activity → next book (loop completion) | `Book View` → `Continue Journey` {destination=activity} → `Continue Journey` {placement=activity, destination=book} → `Book View` | book, activity | intent |
| Newsletter: view → start → submit → lead | `Form View` → `Form Start` → `Form Submit` → `Lead Created` | placement, lead_magnet, language | outcome: Lead Created is backend-confirmed creation (single opt-in). |
| Home → free bundle → download → book discovery | `Homepage CTA` {destination=free-bundle} → `Landing View` → `Lead Created` → `Magnet Download` → `Continue Journey` {placement=signup-success} | lead_magnet, language | intent |
| Landing page entrance → next action | `Landing View` → `Form Start` → `Lead Created` | landing_page, lead_magnet, language, utm_campaign | outcome |
| Return: personalized view → recommendation click → book view | `Personalized View` → `Recommendation Click` → `Book View` | placement, reason, book | intent |
| Book view → share | `Book View` → `Share` | book, target | intent |
