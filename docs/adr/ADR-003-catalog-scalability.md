# ADR-003: Catalog scalability — the static catalog stays the source of truth

**Status:** Accepted, approved by the owner 2026-09-10 (Platform Readiness Assessment)
**Date:** 2026-09-09
**Sprint:** 8 (S8-002). **Builds on:** ADR-001, ADR-002. **Evidence:** `docs/platform/BASELINE_2026-09.md`, `docs/platform/BOTTLENECK_REGISTER.md`.

## Context

`src/data/books.data.ts` holds 20 books with trilingual copy, relationships and 60 discussion
prompts; collections, journeys, packs, resources and the search index are records in sibling
modules, loaded at build time by scripts through one esbuild projection and validated by
`contentIndex`. The question asked by Sprint 8 is whether this stays appropriate as the
catalog grows.

Measured today: prerender 0.7 s per route, 222 routes; JSON of all ecosystem records well
under 1 MB; search 0.1 ms per query; a catalog change is a PR that runs validators, the
inventory gate and a full build in about 3 minutes of CI. Growth forecast from the owner:
the Eva Gallo collection is a 30-title series with French and Spanish editions arriving over
2026 to 2027, so the realistic ceiling is ~30 books, ~90 book routes and perhaps 40
collections. Ten times today's content is not on any roadmap.

## Options

### 1. Continue: typed static records in the repository (current)
- User value: instant pages, prerendered, cookie-free, work offline once cached.
- Editorial value: every change reviewed, validated and reversible with `git revert`.
- Privacy: no runtime data source; nothing to breach.
- Accessibility: unchanged.
- Cost: zero beyond build minutes; complexity: low; migration risk: none.
- Lock-in: none; reversibility: total; operational ownership: the engineering pair.
- Cookie-free: yes by construction.
- Limits: prerender time grows linearly with routes (~0.7 s each locally, ~0.25 s on Netlify); TypeScript literal files stay readable to roughly 100 records per file.

### 2. Bounded intermediate layer: records as JSON/YAML files with a generated TypeScript index
- Same runtime, easier for a non-engineer to edit, schema validation moves to a JSON Schema.
- Cost: a generator plus schema tooling; risk: two representations to keep aligned; value only appears when a non-engineer edits content, which is not the case today (BR-07).

### 3. External catalog source (headless CMS or database) read at build time
- Editorial UI and roles; a runtime dependency during builds; credentials, retention and privacy ownership to define; migration and lock-in real; cookie-free unaffected at runtime but a second system to operate.
- No measured pressure justifies it: zero content errors reached production in Sprint 7, editorial throughput is bounded by review, not by tooling.

## Decision

Option 1. The static catalog remains the source of truth. The following thresholds, when
breached, reopen this decision (record the breach in the bottleneck register first):

- More than 100 records in any single data file, or Netlify build time above 5 minutes.
- A second, non-engineering editor who needs to publish without a pull request.
- Prerender above 600 routes, at which point incremental route rendering (per-route content
  hash) is the first response, not an external source.

## Consequences

- Nothing changes at runtime. `scripts/lib/catalog.mjs` remains the only way build tooling reads content.
- Capacity fixture: `scripts/bench-search.mjs` already projects 10× and 50×; a 10× catalog fixture for the build is added to the budget policy as a periodic (not per-PR) check.
- Option 2 is the pre-approved next step if an editor who does not use git appears; option 3 needs a fresh ADR.
