// Versioned EVENT DICTIONARY (Sprint 5 S5-021) — BROWSER-FREE, the runtime contract behind
// src/lib/analytics.ts. Every live event: its spec alias, required and optional properties,
// allowed values, owner, privacy note, and whether it measures INTENT or a verified OUTCOME.
// docs/analytics/EVENT_DICTIONARY.md is generated from this file (npm run gen:events) and a
// test fails when the two disagree. Live names are kept (Plausible goals reference them);
// the spec's snake_case names are aliases.
//
// Deprecation: an event is never renamed in place. Add the new event, mark the old one
// `deprecated` with the replacement, keep both for one release, then remove the old one and
// bump SCHEMA_VERSION only if a property's meaning changes.

export const SCHEMA_VERSION = 1 as const;

export type EventKind = 'intent' | 'outcome' | 'exposure' | 'diagnostic';

export interface EventDefinition {
  name: string;
  /** Sprint 5 spec name, when one exists. */
  alias?: string;
  kind: EventKind;
  required: string[];
  optional: string[];
  /** Allowed values for enumerated properties. */
  values?: Record<string, string[]>;
  owner: 'growth' | 'product' | 'engineering';
  privacy: string;
  deprecated?: { replacedBy: string; since: string };
  /** Reserved: named by the spec, not instrumented, with the reason. */
  reserved?: string;
}

const PLACEMENTS = ['home', 'landing', 'books', 'activities', 'resources', 'about', 'detail', 'card', 'signup-success', 'related', 'activity', 'game', 'profile', 'journey'];

export const EVENTS: EventDefinition[] = [
  // ---- discovery and detail ----
  { name: 'Homepage CTA', kind: 'intent', required: ['destination'], optional: ['book'], owner: 'growth', privacy: 'destination token and book id only' },
  { name: 'Book View', kind: 'intent', required: ['book'], optional: [], owner: 'product', privacy: 'stable book id' },
  { name: 'Recommendation Click', kind: 'intent', required: ['book', 'placement', 'reason'], optional: [], values: { reason: ['editorial', 'related', 'theme', 'age', 'preference'] }, owner: 'product', privacy: 'ids and reason tier' },
  { name: 'Personalized View', kind: 'exposure', required: ['placement'], optional: [], owner: 'product', privacy: 'placement only; never the library' },
  { name: 'Continue Journey', kind: 'intent', required: ['placement', 'destination'], optional: ['book', 'activity', 'reason', 'resource'], owner: 'product', privacy: 'ids and placement' },
  { name: 'Search', kind: 'intent', required: ['language', 'filter', 'results'], optional: [], owner: 'product', privacy: 'filter and count; NEVER the query text' },
  // ---- purchase intent (S5-002 / S5-003) ----
  { name: 'Purchase CTA View', alias: 'purchase_cta_impression', kind: 'exposure', required: ['book', 'placement', 'edition'], optional: [], values: { placement: ['detail'], edition: ['en', 'es', 'fr'] }, owner: 'growth', privacy: 'once per book page view when the Buy control is viewable' },
  { name: 'Purchase Click', alias: 'purchase_cta_clicked / retailer_click', kind: 'intent', required: ['book', 'destination', 'placement', 'edition'], optional: [], values: { destination: ['amazon'], placement: ['detail', 'card'], edition: ['en', 'es', 'fr'] }, owner: 'growth', privacy: 'outbound click is the conversion PROXY; no retailer purchase data exists (S5 open decision)' },
  { name: 'Edition Selected', alias: 'edition_selected', kind: 'intent', required: ['book', 'edition'], optional: [], owner: 'growth', privacy: 'n/a', reserved: 'no edition selector exists: the edition follows the site language and is carried on Purchase Click as `edition`; format (paperback/eBook) is chosen on Amazon and is not measurable' },
  // ---- newsletter (S5-005 / S5-006) ----
  { name: 'Landing View', alias: 'free_bundle_opened (when lead_magnet is a bundle or pack)', kind: 'exposure', required: ['language', 'lead_magnet', 'landing_page'], optional: [], owner: 'growth', privacy: 'magnet slug and route; UTMs from the URL' },
  { name: 'Form View', alias: 'newsletter_cta_impression', kind: 'exposure', required: ['language', 'lead_magnet', 'placement'], optional: [], values: { placement: PLACEMENTS }, owner: 'growth', privacy: 'once per form when viewable' },
  { name: 'Form Start', alias: 'newsletter_signup_started', kind: 'intent', required: ['language', 'lead_magnet', 'placement'], optional: [], owner: 'growth', privacy: 'first interaction only' },
  { name: 'Form Submit', alias: 'newsletter_signup_submitted', kind: 'intent', required: ['language', 'lead_magnet', 'placement'], optional: [], owner: 'growth', privacy: 'no field values' },
  { name: 'Lead Created', alias: 'newsletter_signup_confirmed (provider evidence: the subscribe function returned success; MailerLite is single opt-in, so this is creation, not a double opt-in confirmation)', kind: 'outcome', required: ['language', 'lead_magnet', 'placement'], optional: [], owner: 'growth', privacy: 'fires only on backend success; never the email' },
  { name: 'Magnet Download', alias: 'free_bundle_download_started', kind: 'outcome', required: ['language', 'lead_magnet', 'asset'], optional: ['placement'], owner: 'growth', privacy: 'asset path only' },
  // ---- sharing (S5-020) ----
  { name: 'Share', alias: 'share_initiated', kind: 'intent', required: ['book', 'target', 'placement'], optional: [], values: { target: ['native', 'copy'], placement: ['detail'] }, owner: 'growth', privacy: 'target kind only; the share sheet never reports the recipient' },
  // ---- experiments (S5-008) ----
  { name: 'Experiment Exposure', alias: 'experiment_exposure', kind: 'exposure', required: ['experiment', 'variant'], optional: ['placement'], owner: 'product', privacy: 'once per assignment when the variant is viewable; ids only' },
  // ---- engagement ----
  { name: 'Read Aloud', kind: 'intent', required: [], optional: ['book', 'language'], owner: 'product', privacy: 'no text' },
  { name: 'Activity Complete', kind: 'outcome', required: ['activity'], optional: [], owner: 'product', privacy: 'activity slug' },
  { name: 'Language Switch', kind: 'intent', required: [], optional: ['language'], owner: 'product', privacy: 'target language' },
  // ---- personalization (Sprint 6) ----
  { name: 'Library Status', kind: 'intent', required: ['book', 'status'], optional: ['placement'], owner: 'product', privacy: 'status token, never the library' },
  { name: 'Favorite', kind: 'intent', required: ['book', 'status'], optional: ['placement'], owner: 'product', privacy: 'as above' },
  { name: 'Resource Saved', kind: 'intent', required: ['resource', 'status'], optional: [], owner: 'product', privacy: 'resource id' },
  { name: 'Local Data Cleared', kind: 'intent', required: [], optional: ['placement'], owner: 'product', privacy: 'placement only' },
  // ---- journeys (Sprint 7) ----
  { name: 'Journey Start', kind: 'intent', required: ['journey'], optional: [], owner: 'product', privacy: 'journey id' },
  { name: 'Journey Step', kind: 'intent', required: ['journey', 'activity', 'status'], optional: [], values: { status: ['done', 'undone'] }, owner: 'product', privacy: 'journey id, step index, state' },
  { name: 'Journey Complete', kind: 'outcome', required: ['journey'], optional: [], owner: 'product', privacy: 'journey id' },
  { name: 'Journey Saved', kind: 'intent', required: ['journey', 'status'], optional: [], values: { status: ['added', 'removed'] }, owner: 'product', privacy: 'journey id' },
  // ---- diagnostics (Sprint 8) ----
  { name: 'Client Error', kind: 'diagnostic', required: ['kind', 'route'], optional: [], owner: 'engineering', privacy: 'error class and route pattern only' },
];

export const EVENT_BY_NAME: Record<string, EventDefinition> = Object.fromEntries(EVENTS.map((e) => [e.name, e]));

/** Problems with an event payload against the dictionary. Empty means valid. */
export function validateEvent(name: string, props: Record<string, unknown> = {}): string[] {
  const def = EVENT_BY_NAME[name];
  if (!def) return [`unknown event "${name}"`];
  if (def.reserved) return [`"${name}" is reserved, not instrumented: ${def.reserved}`];
  const out: string[] = [];
  for (const r of def.required) if (props[r] === undefined || props[r] === '') out.push(`${name}: missing required "${r}"`);
  const allowed = new Set([...def.required, ...def.optional]);
  for (const k of Object.keys(props)) if (!allowed.has(k) && !k.startsWith('utm_')) out.push(`${name}: unexpected property "${k}"`);
  for (const [k, vals] of Object.entries(def.values ?? {})) if (props[k] !== undefined && !vals.includes(String(props[k]))) out.push(`${name}: "${k}" = ${String(props[k])} not in [${vals.join(', ')}]`);
  return out;
}
