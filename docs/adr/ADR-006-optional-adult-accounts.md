# ADR-006: Optional adult accounts — not justified; no account code

**Status:** Accepted (engineering recommendation; owner acceptance in the Platform Readiness Assessment)
**Date:** 2026-09-09
**Sprint:** 8 (S8-008, S8-009, S8-010). **Builds on:** ADR-001, ADR-002.

## Context

ADR-002 (Sprint 6, accepted by the owner) chose local-only personalization and asked Sprint 8
to decide on optional adult accounts from evidence. The evidence available:

- Usage: the site records only aggregate, cookie-free events. Personalization events
  (`Library Status`, `Favorite`, `Resource Saved`, `Journey Saved`, `Journey Step`) exist since
  Sprint 6 and 7; no visitor has asked for sync or cross-device continuity through the
  feedback widget or the contact form.
- Need: every personalization feature works locally; the dashboard tells the visitor nothing
  persists when storage is denied; the only thing an account would add is continuity across
  devices and recovery after clearing the browser.
- Cost: accounts require identity, sessions, recovery, rate limiting, CSRF/XSS review, a
  threat model, a data-retention policy, a privacy-policy change, migration of local state
  with consent and idempotency, and a first server-side store of personal data for a site
  whose promise is that it keeps none.

## Options

1. **No accounts** (current). Keeps ADR-001's promise intact; zero new data flows.
2. **Bounded layer: export/import of the local envelope** as a file the adult downloads and
   re-imports on another device. Continuity without identity, servers or cookies.
3. **Optional adult accounts** with server-side sync (S8-009/010 scope).

## Decision

Option 1. Option 2 is pre-approved as the first response to a continuity request because
it satisfies the need with no identity and no server. Option 3 is deferred; S8-009 and
S8-010 are not started and no account code is authorized.

Thresholds that reopen this ADR: continuity or sync requested by visitors in feedback or
contact at least ten times in a quarter, or a paid product that requires entitlement.

## Consequences

- `PersonalizationStateV1.locale` and the migration hooks in `personalLibrary.ts` remain the only account-shaped affordances; they are documented, not used.
- The Sprint 8 security review (S8-013) covers the site as it is: no authentication surface.
