# Sprint 4 Technical Implementation Specification

Project: Story Time with Eva  
Scope: Performance, Accessibility, Engagement, and Retention  
Source: Sprint 4 PRD  
Status: Developer-ready, pending live repository path verification

## 1. Purpose

Improve the complete Discover, Browse, Read, Create, Return journey while preserving the current React, TypeScript, Vite, React Router, Netlify, read-aloud, analytics, and browser-local reading-status architecture.

## 2. Constraints

- No framework, backend, CMS, account system, or analytics-provider migration.
- Target WCAG 2.2 AA where technically applicable.
- Preserve `localStorage` for existing reading-status persistence.
- Do not collect unnecessary personal or child-related data.
- Performance changes require a measured baseline and after-state.
- New recommendations must resolve from stable catalog relationships, not duplicated arrays in components.

## 3. Repository Verification Gate

Confirm existing contracts for `BookCard.tsx`, `BookStatusButton.tsx`, `BookDetail.tsx`, `Books.tsx`, `books.ts`, `ages.ts`, `analytics.ts`, `language.tsx`, `Seo.tsx`, `JsonLd.tsx`, activity routes, read-aloud controls, and current test runners. Reuse equivalent components and utilities when names differ.

## 4. Target Architecture

Suggested additions:

```text
src/components/ContinueJourney.tsx
src/components/LoadingState.tsx
src/components/EmptyState.tsx
src/components/ErrorState.tsx
src/lib/journey.ts
tests/performance/
tests/accessibility/
tests/analytics/
```

The continuation utility receives a content ID and returns the first valid next action in this order: related activity, related book, related resource, browse all books. Components render the result and localized label, but do not own relationship data.

## 5. Analytics Contract

All events use a versioned dictionary and a single analytics wrapper. Minimum events:

```text
page_view
catalog_filter_applied
book_opened
read_aloud_started
read_aloud_completed
reading_status_changed
activity_opened
continue_journey_clicked
related_book_clicked
purchase_cta_clicked
newsletter_cta_clicked
```

Allowed properties are stable IDs, locale, content type, placement, age-band ID, theme IDs, CTA ID, and non-identifying status. Never send names, free-form child data, or local-storage contents.

## 6. Work Breakdown and Traceability

| PRD ID | Implementation | Primary verification |
| --- | --- | --- |
| S4-001 | Measure representative home, catalog, book, activity, and resource routes on mobile and desktop. Record LCP, CLS, responsiveness, asset weight, and bundle size. | Dated baseline report before optimization. |
| S4-002 | Generate appropriately sized modern image variants, preserve intrinsic dimensions, prioritize the main above-fold image, and lazy-load below-fold content. | Image coverage audit and visual comparison. |
| S4-003 | Reserve space for images, embeds, controls, async sections, and font changes. | CLS comparison and screenshot regression. |
| S4-004 | Inspect Vite chunks and dependencies; apply route or component lazy loading only where measured value exceeds complexity. | Bundle diff and route behavior tests. |
| S4-005 | Optimize mobile navigation, tap targets, focus behavior, responsive grids, and motion. | Device matrix and reduced-motion test. |
| S4-006 | Audit semantic structure, names, labels, contrast, forms, errors, live regions, and landmarks. | Automated scan plus manual screen-reader review. |
| S4-007 | Make the primary journey fully keyboard-operable with visible focus and logical order. | Keyboard script from home through activity and next book. |
| S4-008 | Preserve read-aloud internals while improving discoverability, labels, states, progress, keyboard support, and announcements. | Assistive-technology and state-transition tests. |
| S4-009 | Improve existing reading-status UX and localized states without creating a competing persistence model. | State persistence, localization, and no-storage tests. |
| S4-010 | Add reusable `ContinueJourney` based on catalog relationships and deterministic fallback priority. | Unit tests for every priority and missing relation. |
| S4-011 | Add Activity to Book continuation using shared stable IDs. | No activity dead ends when a valid relationship exists. |
| S4-012 | Add contextual Book to Activity recommendations from `relatedActivities`. | Click path and localization tests. |
| S4-013 | Render a welcome-back experience only when reliable local state exists. | New visitor, returning visitor, cleared storage, and blocked storage scenarios. |
| S4-014 | Instrument the complete journey through the existing analytics wrapper. | Event schema and placement tests. |
| S4-015 | Add automated analytics contract tests and reject unknown events or properties. | CI fails on event drift. |
| S4-016 | Add performance and accessibility regression gates for representative routes. | Thresholds checked in CI with controlled conditions. |
| S4-017 | Standardize localized loading, empty, offline-tolerant, and recoverable error states. | Component, keyboard, and screen-reader tests. |
| S4-018 | Polish interactions while honoring `prefers-reduced-motion` and avoiding blocking transitions. | Reduced-motion and input-responsiveness checks. |
| S4-019 | Execute mobile QA across supported viewport, orientation, input, and browser matrix. | Signed device checklist with zero critical regressions. |
| S4-020 | Audit production links, console errors, status codes, analytics, accessibility, and critical flows. | Post-deploy smoke report. |

## 7. Component Contracts

```ts
interface ContinueJourneyProps {
  sourceType: 'book' | 'activity' | 'resource';
  sourceId: string;
  locale: 'en' | 'fr' | 'es';
  placement: string;
}

interface JourneyTarget {
  type: 'activity' | 'book' | 'resource' | 'catalog';
  id?: string;
  href: string;
  label: string;
  reason: 'related-activity' | 'related-book' | 'related-resource' | 'fallback';
}
```

`ContinueJourney` must return nothing when no meaningful or fallback action can be resolved. It must not render broken links.

## 8. Performance Budgets

Record baseline first, then set enforceable route budgets. At minimum track compressed JavaScript, total image bytes above the fold, LCP, CLS, and interaction latency. The sprint target is at least 20% improvement in LCP and interaction responsiveness, at least 30% lower CLS, and at least 90% mobile Core Web Vitals pass rate. Treat field data and controlled lab data as different measurements.

## 9. Test Plan

- Unit: continuation ordering, analytics schema, reading-state adapters.
- Component: focus, accessible names, read-aloud states, empty/error/loading states.
- Integration: Book to Activity, Activity to Book, return experience, and local persistence.
- Accessibility: automated WCAG checks plus manual keyboard and screen-reader scripts.
- Performance: repeatable production-build runs and bundle comparison.
- Resilience: blocked/corrupt storage, slow images, offline navigation, missing relationships.
- Production: localized journey smoke tests on desktop and mobile.

## 10. Implementation Sequence

1. Baseline performance and analytics.
2. Optimize images, layout stability, bundles, and mobile navigation.
3. Remediate global accessibility and keyboard issues.
4. Improve read-aloud and existing reading-status experiences.
5. Add continuation loops and returning-user UI.
6. Complete instrumentation, regression tests, mobile QA, and production audit.

## 11. Release Gates

- Zero critical accessibility issues, broken links, critical production bugs, and mobile regressions.
- Keyboard coverage for 100% of public interactive flows.
- Major-image optimization coverage is 100%.
- Analytics contract tests pass without personal data.
- Book to Activity, Activity to Book, related-book, reading-status, and return-engagement metrics have recorded baselines.

## 12. Open Decisions

- Exact supported browser and assistive-technology matrix.
- Baseline-derived numeric CI budgets for individual routes.
- Whether an existing generic state component can absorb loading, empty, and error variants.

