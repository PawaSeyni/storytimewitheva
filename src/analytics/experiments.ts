// Experiment REGISTRY (Sprint 5 S5-008 / S5-011) — BROWSER-FREE records. The engine is
// src/lib/experiments.ts. Governance fields are REQUIRED for any experiment that is not a
// draft; tests/experiments/registry.test.mjs fails CI on an incomplete active experiment.
// Completed experiments stay here as records with status 'complete' (archived, never reused).
import type { Language } from '../lib/locales';

export type ExperimentStatus = 'draft' | 'active' | 'paused' | 'complete';

export interface ExperimentDefinition {
  id: string;
  status: ExperimentStatus;
  variants: Array<{ id: string; weight: number }>;
  eligibility: { locales?: Language[]; routes?: string[] };
  /** A dictionary event name. */
  primaryMetric: string;
  guardrails: string[];
  startAt?: string;
  endAt?: string;
  // ---- governance (S5-011) ----
  hypothesis: string;
  owner: string;
  audience: string;
  durationDays: number;
  minimumSample: number;
  analysisRule: string;
  stopRule: string;
  doc: string;
}

export const EXPERIMENTS: ExperimentDefinition[] = [
  {
    id: 'book-cta-hierarchy-v1',
    status: 'draft',
    variants: [{ id: 'control', weight: 50 }, { id: 'listen-first', weight: 50 }],
    eligibility: { locales: ['en', 'fr', 'es'], routes: ['/books/:id'] },
    primaryMetric: 'Purchase Click',
    guardrails: ['Read Aloud per Book View does not drop by more than 10% relative', 'axe serious/critical stays at zero on the variant', 'Client Error rate on /books/:id does not rise', 'Lighthouse mobile performance on /books stays above 70'],
    hypothesis: 'Offering "Listen to this story" as the primary action above the Buy group increases retailer clicks per book view, because a parent who has heard the opening is more likely to buy than one who has only seen the cover.',
    owner: 'growth (PawaSeyni)',
    audience: 'all visitors on book detail pages, three locales, bots excluded by navigator.webdriver',
    durationDays: 28,
    minimumSample: 400,
    analysisRule: 'Purchase Click per Purchase CTA View by variant, computed from Plausible with experiment and variant properties; report only if each variant has at least minimumSample exposures; decision by two-proportion z-test at 95%, otherwise "no difference".',
    stopRule: 'Stop early only if a guardrail breaks for 3 consecutive days or the variant is at least 30% worse with 200+ exposures each.',
    doc: 'docs/experiments/EXP-001-book-cta-hierarchy.md',
  },
  {
    id: 'newsletter-contextual-cta-v1',
    status: 'draft',
    variants: [{ id: 'contextual', weight: 50 }, { id: 'plain', weight: 50 }],
    eligibility: { locales: ['en', 'fr', 'es'], routes: ['/books', '/activities', '/resources', '/about'] },
    primaryMetric: 'Lead Created',
    guardrails: ['Form View per page view unchanged (the block itself is identical)', 'Unsubscribe rate in MailerLite does not rise week over week', 'axe serious/critical stays at zero'],
    hypothesis: 'A one-line contextual lead above the newsletter offer on content pages increases signups per form view compared with the plain offer, because it connects the printables to what the visitor was just doing.',
    owner: 'growth (PawaSeyni)',
    audience: 'visitors who scroll to the newsletter block on the books, activities, resources and about pages, three locales',
    durationDays: 28,
    minimumSample: 300,
    analysisRule: 'Lead Created per Form View by variant and placement; report per locale only where each cell has minimumSample form views; decision by two-proportion z-test at 95%.',
    stopRule: 'Stop if unsubscribe rate rises by more than 25% relative in any week, or if a variant is at least 30% worse with 150+ form views each.',
    doc: 'docs/experiments/EXP-002-newsletter-contextual-cta.md',
  },
];

export const EXPERIMENT_BY_ID: Record<string, ExperimentDefinition> = Object.fromEntries(EXPERIMENTS.map((e) => [e.id, e]));
