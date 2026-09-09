# ADR-005: Search architecture — client-side index, decided from measured scale

**Status:** Accepted, approved by the owner 2026-09-10 (Platform Readiness Assessment)
**Date:** 2026-09-09
**Sprint:** 8 (S8-007). **Builds on:** Sprint 7 S7-015. **Evidence:** `node scripts/bench-search.mjs`, register BR-05.

## Context

Search shipped in Sprint 7 as a browser-free index of 74 records (books, activities,
collections, journeys, resources) built at import time and searched with a linear scan
within the active locale. Measured: 76 KB of JSON inside the app bundle, 0.10 ms per query
today, 0.98 ms at 10× and 4.7 ms at 50× the content. No relevance defects are recorded;
the `Search` event carries the filter and result count so zero-result queries can be
counted without ever sending the query text.

## Options

1. **Continue: client-side index in the bundle.** Zero latency, zero requests, works offline and with third parties blocked, cookie-free by construction, no data leaves the browser. Limits: bundle weight grows with content (≈1 KB per record); relevance is substring matching with diacritic folding and title-first ranking, no stemming or fuzziness.
2. **Bounded layer: prebuilt index file loaded on demand** (same engine, index moved out of the entry bundle into a lazy chunk or a static JSON), or a small in-browser library (MiniSearch/Lunr) for stemming and fuzziness. Keeps every privacy property; adds one request or one dependency.
3. **External search service** (Algolia, Typesense, Meilisearch). Sends every query, with the visitor's IP, to a third party; needs an API key in the client, a data-flow entry, retention terms, a CSP change and a cost line; brings typo tolerance and analytics the site does not need at 74 records.

## Decision

Option 1. Option 2's first half (lazy-load the index chunk) is pre-approved when the index
passes 100 KB or the entry chunk budget is breached; its second half (a ranking library) is
pre-approved when zero-result queries exceed 20% of searches for a month. Option 3 requires
a new ADR and would need to clear ADR-001 first.

Thresholds: > 2,000 records, or > 20 ms p95 query time on a mid-range phone, or the relevance
signals above.

## Consequences

- `scripts/bench-search.mjs` is the capacity fixture and runs in the budget policy periodically.
- The search index size is part of the JavaScript budget.
