# ADR-002: Personalization storage model — local-only, optional accounts deferred

**Status:** Proposed — awaiting owner signature
**Date:** 2026-09-09
**Sprint:** 6 (S6-011). Feeds Sprint 8 S8-008.
**Supersedes:** nothing. **Builds on:** ADR-001 (cookie-free architecture).

## Context

Sprint 6 shipped local, explicit, adult-oriented personalization: a three-state reading
library, favorites, continue-reading, recently viewed, saved resources and suggestion
preferences, all in one versioned envelope in the browser (`src/lib/personalLibrary.ts`
over `src/lib/storage.ts`). The public site and every core flow work with cookies
disabled and with browser storage failing (`tests/e2e/cookie-free.spec.ts`).

The Sprint 6 specification asks for a decision between three models before any account
work is contemplated, and forbids implementing accounts "without evidence". This record
compares them and recommends one. It does not authorize account code.

## Options

### 1. Local-only (current)
State lives on the device. No identity, no server, no sync.

- **User value:** immediate, zero friction, nothing to sign up for. Loses state on a new
  device or a cleared browser; the dashboard says so plainly.
- **Privacy:** strongest possible. Nothing about a child's reading leaves the browser.
  No account means no credential, no recovery flow, no breach surface.
- **Cookie-free:** trivially preserved.
- **Cost / complexity:** already built and tested. Zero operational ownership.
- **Reversibility:** total — the other two options can be layered on later; the envelope
  is versioned and id-based precisely so it can be migrated.

### 2. Optional adult accounts with server-side sync
An adult may create an account; local state migrates up and syncs across devices.

- **User value:** cross-device continuity. Real for a family with a phone and a tablet;
  unproven for this audience (see Evidence).
- **Privacy:** materially weaker. Introduces identity, a credential, session handling,
  recovery, deletion obligations, and a server holding reading behaviour that can be tied
  to a household. The public architecture stays cookie-free only if authentication is
  isolated from browsing — feasible, but it is a second architecture to keep honest.
- **Cost / complexity:** a backend, an auth provider or custom auth, threat model, rate
  limiting, CSRF/XSS review, account deletion, support. Sprint 8 (S8-009, S8-010) lists
  exactly this work and gates it on evidence.
- **Lock-in / ownership:** an always-on service with an owner, uptime and a data-retention
  policy. The site currently has none of those.
- **Reversibility:** poor once users hold accounts.

### 3. Local-first with optional sync
Local remains the source of truth; an adult may opt in to sync a copy to a server keyed
by an account. Conflicts resolve toward local.

- **User value:** same continuity as option 2 when opted in, none otherwise.
- **Privacy:** better than 2 in principle (local stays primary), but the server, the
  identity and the obligations are identical once anyone opts in.
- **Cost / complexity:** strictly higher than 2 — everything 2 needs plus conflict rules
  for library status, favorites, resources, journeys and preferences (Sprint 8 §7 lists
  them). The "local-first" framing is attractive and buys almost nothing here because the
  data is small and the write pattern is a single device at a time.
- **Reversibility:** as poor as 2.

## Evidence available today

- **Feature use** is now measured in aggregate (`Library Status`, `Favorite`,
  `Resource Saved`, `Personalized View`, `Recommendation Click`, `Local Data Cleared`),
  with no identity. There is not yet a measurement window: Sprint 6 shipped 2026-09-09.
- **No user has asked** for cross-device sync. There is no support channel evidence, no
  survey, no usability-test finding (`docs/usability-test-plan.md` is unrun).
- **The audience is parents of children aged 3–9 reading aloud.** The state at stake is a
  short list of book ids. Losing it costs a few taps to rebuild.
- **The privacy posture is a stated brand promise** (ADR-001, the Privacy page). An
  account system, even optional, changes what the site can truthfully say.

## Decision (proposed)

**Adopt option 1, local-only, as the model for Sprint 6 and Sprint 7.** Do not build
accounts or sync. Revisit at Sprint 8 (S8-008) against evidence, with a threshold the
owner sets now rather than later.

Proposed threshold for reopening: a measured 90-day window showing sustained library use
(a meaningful share of returning visitors with three or more saved books) **and** a
recorded demand signal for continuity (support requests, survey, or usability findings).
Feature use alone is not a reason to add identity; it is a reason to keep the feature.

If reopened, option 2 is preferred over option 3: option 3's extra complexity buys nothing
for data this small, and "local-first" must not become a way to describe an account
system as if it were not one.

## Consequences

- The dashboard keeps telling the grown-up, in plain words, that state is on this device
  only and how to clear it. That copy is the product's honesty, not a limitation notice.
- `PersonalizationStateV1` stays id-based and versioned so a future migration to an
  account is a copy-then-verify, never a rewrite.
- `preferences.locale` stays unwritten; language lives in the shared key the games read.
- Sprint 8's account items (S8-008 … S8-010) remain assessment-only until this ADR is
  revised with evidence.
- The Privacy page's description of local storage is now incomplete (DB-07) and must be
  updated by the privacy reviewer before any further personalization surface ships.

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Owner | | ☐ Approve option 1 · ☐ Request changes | |
