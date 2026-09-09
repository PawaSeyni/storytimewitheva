# Experiments: governance (S5-008 to S5-011)

An experiment is a record in `src/analytics/experiments.ts`; the engine is `src/lib/experiments.ts`.
CI (`tests/experiments/registry.test.mjs`) rejects any experiment that is not a draft and lacks
hypothesis, owner, audience, duration, minimum sample, primary metric (a dictionary event),
guardrails, analysis rule, stop rule and a document; weights must total 100.

## Rules, and where each is enforced

| Rule | Enforced by |
|---|---|
| Assignment before render; deterministic per anonymous unit | `assign()` hashes `experiment:unit` (FNV-1a) into 100 buckets; unit id lives in the storage adapter (memory when storage is denied) |
| Exposure once per assignment, only when viewable | `exposeOnce()` keyed on experiment+variant, persisted; called from the surface's IntersectionObserver |
| Conversions carry experiment/variant only when an exposure exists | `conversionProps()` |
| Weights total 100, immutable during a run | validator; changing weights means a new experiment id |
| Bots, internal test traffic, ineligible locales and routes | `navigator.webdriver` → control, no exposure (analytics also drops); locale and route eligibility in `assign()` |
| Kill switch | set `status` to `paused` or `complete` and deploy (about a minute); every visitor gets control, no exposure |
| Guardrails can stop an experiment | listed per experiment; monitored in the funnel report and the post-deploy checks |
| Completed experiments are archived, not reused | records stay with `status: 'complete'`; a re-run is a new id (`-v2`) |
| No cookies, no identity | the unit id is a random string in the site's own storage namespace; cleared by "Clear everything on this device" |

## Lifecycle

draft (may ship, always control) → active (needs `startAt`, the baseline approved, and the owner's
sign-off in the experiment document) → paused (kill switch) or complete (archived with the
analysis in the document).

## Analysis

`npm run report:funnels` breaks the primary metric down by `experiment` and `variant` once
Plausible custom properties are enabled for those two keys. Decisions follow each experiment's
analysis rule; nothing is decided below the minimum sample.

## Current experiments

| Id | Status | Doc |
|---|---|---|
| book-cta-hierarchy-v1 | draft, pending baseline approval | EXP-001-book-cta-hierarchy.md |
| newsletter-contextual-cta-v1 | draft, pending baseline approval | EXP-002-newsletter-contextual-cta.md |
