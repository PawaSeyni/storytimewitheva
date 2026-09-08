# ADR-001 — Cookie-Free Architecture

- **Status:** Accepted
- **Date:** 2026-09-08
- **Deciders:** Product owner (Eva Gallo / Pawa Press)
- **Context source:** established practice in the repo; reaffirmed by the Sprint 3 PRD and
  the Sprint 6–8 technical direction.

## Context
Story Time with Eva is a public children's-reading website for parents, guardians,
caregivers, and educators. It has no login, no server-side user session, and serves
children's content. Cookies carry legal weight (ePrivacy/GDPR consent) and UX cost (cookie
walls), and none of the site's core value requires them: content is public and static, UI
state is React state, and the only persistence needed is per-device convenience
(preferences, favorites, reading status).

The site already operates this way — analytics is cookieless (Plausible), persistence is
`localStorage` only, and there is no cookie banner. This ADR makes that a **binding
architectural constraint** so future work (personalization in Sprint 6, content ecosystem
in Sprint 7, scaling decisions in Sprint 8) cannot erode it.

## Decision
**Story Time with Eva must not require cookies for any core functionality.**

```
USER
 │
 ▼
PUBLIC WEBSITE  ── no cookie requirement
 │
 ├── Public content (static, prerendered)
 ├── React state (in-memory UI)
 └── Optional local persistence (per device)
        ├── localStorage        (default)
        └── IndexedDB           (only where capacity/structure justifies it)
```

### Core functionality — MUST work with cookies fully disabled
Navigation · Books · Book discovery · Reading · Listening (read-aloud) · Activities ·
Resources · Search · Language switching · Favorites · Reading status · Personalization ·
Reading journeys · Purchase links.

### Optional browser persistence — MAY be used, never required
First-party `localStorage` (and `IndexedDB` only where justified) to remember preferences,
favorites, reading status, journey progress, and recently explored items **on this device**.
This is an enhancement layer, not a dependency.

### Explicitly prohibited as functional dependencies
- Required cookies of any kind
- Tracking cookies · advertising cookies
- Cookie walls / consent gates that block content
- Cookie-based navigation, reading, or personalization
- Any cookie-based application session

### Analytics boundary
Analytics (Plausible, cookieless) measures aggregate behavior and is **never required for
functionality**. It sets no cookies, stores no persistent visitor id, and is never joined
to subscriber identity (see `ARCHITECTURE_ALIGNMENT.md` §9). If analytics fails to load,
the site works identically.

## Graceful degradation (mandatory)
```
Storage available            Storage unavailable (private mode / blocked / quota)
      │                                    │
      ▼                                    ▼
Persist preferences,          Website still works — content, navigation, reading,
favorites, status,            listening, search and language switching all function;
journey progress              personalization simply does not persist this session.
```

Every persistence access MUST be wrapped (try/catch) and MUST tolerate: storage disabled,
throwing accessors (some privacy/thumbnail contexts throw on access), empty/corrupt values,
schema version mismatch, and quota-exceeded. The single storage abstraction
(`src/lib/storage.ts`, added in Sprint 6) centralizes this so no component calls
`localStorage` directly.

## Consequences
**Positive**
- No cookie banner/consent gate; simplest possible privacy posture for a kids' site.
- Content is fully accessible to first-time and privacy-strict visitors and to crawlers.
- Personalization is per-device and disposable — no server-side PII to protect.
- Legal surface is minimal (no ePrivacy cookie-consent obligation for functional storage).

**Negative / trade-offs (accepted)**
- Personalization does not sync across devices or survive cleared site data. (Acceptable;
  cross-device sync would require the optional adult-accounts path — see a future ADR — and
  even then must remain opt-in and never a requirement for core content.)
- Developers must route all persistence through the abstraction and handle failure paths.

## Compliance & verification
- **Permanent test suite:** `docs/testing/COOKIE_FREE_TEST_SPEC.md` defines critical
  journeys run with cookies disabled and with storage disabled; **a failing cookie-free run
  blocks release.**
- **Code review gate:** no direct `document.cookie` writes; no `localStorage`/`IndexedDB`
  access outside `src/lib/storage.ts`; no analytics call in a critical path.
- **CSP already enforces** no third-party script/cookie vectors (`netlify.toml`).

## Related
- `docs/architecture/ARCHITECTURE_ALIGNMENT.md` (§6 storage, §9 analytics)
- `docs/testing/COOKIE_FREE_TEST_SPEC.md`
- Future: `ADR-002-client-side-data.md`, `ADR-003-optional-adult-accounts.md`
