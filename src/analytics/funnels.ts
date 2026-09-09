// Derived FUNNEL definitions (Sprint 5 S5-001 / S5-012). BROWSER-FREE. A funnel is an ordered
// list of steps; each step is an event name plus an optional property filter. Dimensions
// are the properties a report may group by. Every funnel states whether its last step
// measures intent or a verified outcome. scripts/report-funnels.mjs turns these into reports.

export interface FunnelStep { event: string; where?: Record<string, string> }
export interface FunnelDefinition {
  id: string;
  title: string;
  steps: FunnelStep[];
  dimensions: string[];
  /** What the final step proves. */
  measures: 'intent' | 'outcome';
  notes?: string;
}

export const FUNNELS: FunnelDefinition[] = [
  { id: 'discovery-to-retailer', title: 'Discovery → detail → purchase intent → retailer click',
    steps: [{ event: 'Homepage CTA' }, { event: 'Book View' }, { event: 'Purchase CTA View', where: { placement: 'detail' } }, { event: 'Purchase Click' }],
    dimensions: ['book', 'edition', 'placement', 'language'], measures: 'intent',
    notes: 'Retailer click is the conversion proxy; no downstream purchase data exists.' },
  { id: 'card-purchase', title: 'Catalog card → retailer click',
    steps: [{ event: 'Purchase Click', where: { placement: 'card' } }], dimensions: ['book', 'edition'], measures: 'intent' },
  { id: 'activity', title: 'Book → activity → completion',
    steps: [{ event: 'Book View' }, { event: 'Continue Journey', where: { destination: 'activity' } }, { event: 'Activity Complete' }],
    dimensions: ['book', 'activity'], measures: 'outcome' },
  { id: 'loop-book-activity-book', title: 'Book → activity → next book (loop completion)',
    steps: [{ event: 'Book View' }, { event: 'Continue Journey', where: { destination: 'activity' } }, { event: 'Continue Journey', where: { placement: 'activity', destination: 'book' } }, { event: 'Book View' }],
    dimensions: ['book', 'activity'], measures: 'intent' },
  { id: 'signup-by-placement', title: 'Newsletter: view → start → submit → lead',
    steps: [{ event: 'Form View' }, { event: 'Form Start' }, { event: 'Form Submit' }, { event: 'Lead Created' }],
    dimensions: ['placement', 'lead_magnet', 'language'], measures: 'outcome',
    notes: 'Lead Created is backend-confirmed creation (single opt-in).' },
  { id: 'free-bundle-loop', title: 'Home → free bundle → download → book discovery',
    steps: [{ event: 'Homepage CTA', where: { destination: 'free-bundle' } }, { event: 'Landing View' }, { event: 'Lead Created' }, { event: 'Magnet Download' }, { event: 'Continue Journey', where: { placement: 'signup-success' } }],
    dimensions: ['lead_magnet', 'language'], measures: 'intent' },
  { id: 'landing-entrances', title: 'Landing page entrance → next action',
    steps: [{ event: 'Landing View' }, { event: 'Form Start' }, { event: 'Lead Created' }],
    dimensions: ['landing_page', 'lead_magnet', 'language', 'utm_campaign'], measures: 'outcome' },
  { id: 'return', title: 'Return: personalized view → recommendation click → book view',
    steps: [{ event: 'Personalized View' }, { event: 'Recommendation Click' }, { event: 'Book View' }],
    dimensions: ['placement', 'reason', 'book'], measures: 'intent' },
  { id: 'share', title: 'Book view → share',
    steps: [{ event: 'Book View' }, { event: 'Share' }], dimensions: ['book', 'target'], measures: 'intent' },
];

/** Minimum events in a segment before a rate is reported without a warning (S5-012). */
export const MIN_SAMPLE = 50;
