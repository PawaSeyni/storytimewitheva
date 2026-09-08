# Sprint 5 Technical Implementation Specification

Project: Story Time with Eva  
Scope: Monetization, Growth, and Product Intelligence  
Source: Sprint 5 PRD  
Status: Developer-ready, pending live repository path verification

## 1. Purpose

Turn the existing Discover, Read, Create, Return journey into a measurable growth loop that can also support recommendation and retailer purchase intent. Preserve the current Amazon/edition purchase model, newsletter provider, double opt-in, analytics wrapper, and browser-first application architecture.

## 2. Constraints

- Do not create checkout, order processing, payment handling, or a new ecommerce platform.
- Treat outbound retailer clicks as the measurable conversion proxy unless verified retailer data is available.
- Do not migrate analytics, newsletter, CMS, or frontend infrastructure.
- Experiments must be deterministic, documented, accessible, and privacy-conscious.
- Do not claim external purchases without valid attribution data.
- Do not send personal data, child data, newsletter addresses, or free-form text to analytics.
- English, French, and Spanish funnel reporting must use the same event taxonomy.

## 3. Repository Verification Gate

Confirm existing contracts for `analytics.ts`, book edition/retailer data in `books.ts`, Book Detail purchase CTAs, newsletter form/provider integration, free-bundle route, recommendation components, `BookCard.tsx`, `ages.ts`, and the build/test pipeline. Extend current utilities rather than creating parallel tracking or purchase systems.

## 4. Target Architecture

```text
src/lib/analytics.ts          existing wrapper, extended
src/lib/experiments.ts        lightweight assignment and exposure
src/analytics/events.ts       versioned event dictionary, if no equivalent exists
src/analytics/funnels.ts      derived funnel definitions
docs/analytics/EVENT_DICTIONARY.md
docs/experiments/
tests/analytics/
tests/experiments/
```

Experiment assignment may use stable local browser storage when available. If storage is blocked, assign the control or a session-memory variant and keep the product functional. No cookies are required.

## 5. Data Contracts

```ts
type Locale = 'en' | 'fr' | 'es';

interface AnalyticsEvent<TName extends string = string> {
  name: TName;
  schemaVersion: 1;
  occurredAt?: string;
  properties: Record<string, string | number | boolean | string[] | null>;
}

interface ExperimentDefinition {
  id: string;
  status: 'draft' | 'active' | 'paused' | 'complete';
  variants: Array<{ id: string; weight: number }>;
  eligibility: { locales?: Locale[]; routes?: string[] };
  primaryMetric: string;
  guardrails: string[];
  startAt?: string;
  endAt?: string;
}
```

Required commerce events:

```text
purchase_cta_impression
purchase_cta_clicked
retailer_click
edition_selected
newsletter_cta_impression
newsletter_signup_started
newsletter_signup_submitted
newsletter_signup_confirmed, only when provider evidence exists
free_bundle_opened
free_bundle_download_started
share_initiated
experiment_exposure
```

Every event defines required properties, optional properties, allowed values, owner, and retention/privacy notes.

## 6. Work Breakdown and Traceability

| PRD ID | Implementation | Primary verification |
| --- | --- | --- |
| S5-001 | Define and baseline discovery, detail, purchase-intent, retailer-click, activity, signup, and return funnels. | Dated baseline report with known measurement gaps. |
| S5-002 | Improve CTA hierarchy and distinguish Read/Listen from Buy without adding checkout. | Accessible usability review and click instrumentation. |
| S5-003 | Track selected edition, format, language, retailer, placement, and stable book ID when available. | Report can compare edition and format intent. |
| S5-004 | Produce editorial/commercial performance classification from reports, not public hardcoding. | Top and underperforming items are explainable from metrics. |
| S5-005 | Evaluate newsletter placements around book, activity, resource, and return moments while preserving provider and double opt-in. | Signup funnel by placement. |
| S5-006 | Add localized contextual CTA copy through the existing translation system. | EN/FR/ES content and accessibility review. |
| S5-007 | Instrument homepage to free bundle to download/signup to book discovery loop. | Funnel path and continuation links validated. |
| S5-008 | Implement a minimal experiment registry, eligibility, assignment, exposure, and kill switch. | Deterministic unit tests and no-storage behavior. |
| S5-009 | Run one documented Book Detail CTA hierarchy experiment after baseline approval. | Exposure precedes conversion, guardrails monitored. |
| S5-010 | Run one contextual newsletter CTA experiment with the same governance. | Variant and conversion report by locale and placement. |
| S5-011 | Require hypothesis, owner, audience, duration, primary metric, guardrails, analysis rule, and stop rule. | CI/content validation rejects incomplete active experiments. |
| S5-012 | Build a repeatable report for book, activity, and resource impressions, engagement, continuation, and conversion. | Top/bottom performers available with minimum-sample warnings. |
| S5-013 | Segment funnel reports by locale and identify parity or translation gaps. | EN/FR/ES comparison uses identical definitions. |
| S5-014 | Segment by existing age taxonomy only. | Unknown age IDs fail validation. |
| S5-015 | Instrument Book to Activity to Book and related-content loops. | Loop completion report. |
| S5-016 | Optimize More Like This ranking and placement using stable relationships and measured outcomes. | No duplicates, broken links, or locale mismatches. |
| S5-017 | Compare landing-page entrances, next actions, abandonment, signup, and retailer intent. | Route-level conversion report. |
| S5-018 | Add editorial merchandising flags or ordered IDs only where approved, keeping ranking explainable. | Public ordering remains deterministic and testable. |
| S5-019 | Ensure newsletter content links to relevant reading and resources with campaign attribution where supported. | Newsletter to reading path report. |
| S5-020 | Add privacy-conscious native sharing foundations without dark patterns or child data. | Share target, fallback, and event tests. |
| S5-021 | Publish the versioned event dictionary and deprecation process. | Runtime and documentation schemas agree. |
| S5-022 | Add funnel QA tests for event order, once-only exposure, required properties, and placement IDs. | CI detects duplicate or missing critical events. |
| S5-023 | Audit retailer links, disclosures, edition mapping, CTA states, newsletter flow, and experiment fallback. | Zero critical monetization defects. |
| S5-024 | Run production analytics, conversion, accessibility, localization, and console-error checks. | Signed post-deploy audit. |

## 7. Experiment Rules

- Assignment occurs before the variant renders.
- Exposure fires once per experiment assignment and only when the variant is actually viewable.
- Conversion events include experiment and variant IDs only when an exposure exists.
- Variant weights total 100 and remain immutable during a run.
- Bots, internal test traffic, and unsupported locales follow documented handling.
- Accessibility, page performance, unsubscribe, and error-rate guardrails can stop an experiment.
- Completed experiments are archived, not silently reused.

## 8. Reporting Model

Reports should group by stable content ID, locale, age-band ID, theme ID, CTA placement, edition/format, and experiment variant. Each report must state its date range, event schema version, known data gaps, minimum sample rule, and whether the metric measures intent or a verified outcome.

## 9. Implementation Sequence

1. Audit and version the event dictionary.
2. Capture revenue, content, language, age, newsletter, and landing-page baselines.
3. Harden purchase CTA and edition instrumentation.
4. Improve newsletter and free-bundle continuation paths.
5. Add the governed experiment framework and QA.
6. Run only the approved first experiments.
7. Strengthen recommendation, merchandising, newsletter, and sharing loops.
8. Complete reports and production audits.

## 10. Test Plan

- Unit: event validation, funnel derivation, experiment assignment, kill switch, no-storage fallback.
- Component: CTA impressions/clicks, edition selection, contextual newsletter copy, sharing fallback.
- Integration: discovery to retailer click, free bundle to reading, Book to Activity loop.
- Data quality: unknown properties, duplicate exposure, missing stable IDs, invalid age/locale values.
- Accessibility: CTA hierarchy, focus behavior, signup errors, experiment variants.
- Production: outbound links, disclosures, provider flow, event receipt, and dashboard freshness.

## 11. Release Gates

- Baselines exist before UI experiments start.
- Event schema validation passes and contains no prohibited data.
- Affiliate disclosures and external-link behavior are correct.
- Every active experiment has complete governance metadata and a kill switch.
- No critical accessibility, locale, analytics, or revenue-link defect remains.

## 12. Open Decisions

- Which analytics/reporting surface is the approved source for product dashboards?
- Which retailer or affiliate program provides verified downstream purchase data, if any?
- Minimum sample size and decision method for experiments.
- Approved merchandising control and disclosure rules.
