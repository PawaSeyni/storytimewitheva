# Sprint 6 Technical Implementation Specification

Project: Story Time with Eva  
Scope: Personalization and Family Reading Experience  
Source: Sprint 6 PRD  
Status: Developer-ready, pending live repository path verification

## 1. Purpose

Deliver local, explicit, adult-oriented, transparent, optional personalization. The core journey becomes Discover, Read, Save, Return, Continue. The public site and every core flow must work with cookies disabled and with browser storage unavailable.

## 2. Non-Negotiable Constraints

- No cookies are required for navigation, reading, listening, search, activities, resources, language changes, purchase links, or personalization.
- No mandatory accounts, child accounts, child profiles, behavioral advertising profiles, or opaque AI personalization.
- Store stable identifiers and minimal state, never a second copy of catalog content.
- Prefer `localStorage`. Evaluate IndexedDB only if measured data volume or atomicity requirements justify it.
- Analytics remains separate from application functionality.
- All UI and stored-state labels support English, French, and Spanish.
- Storage errors must never crash a route or block an action.

## 3. Repository Verification Gate

Confirm current `BookStatusButton.tsx`, catalog IDs and relationships, existing reading-status key/schema, analytics wrapper, route architecture, translation system, and any current browser-storage calls. The migration must preserve existing user state where safely possible.

## 4. Target Architecture

```text
src/lib/storage.ts
src/lib/personalLibrary.ts
src/lib/preferences.ts
src/lib/recommendations.ts
src/lib/recentlyExplored.ts
src/components/ContinueReading.tsx
src/components/FavoriteButton.tsx
src/components/PersonalizedSection.tsx
src/pages/FamilyDashboard.tsx
tests/storage/
tests/personalization/
tests/cookie-free/
```

Use existing locations where equivalent modules exist.

## 5. Storage Contract

Namespace all keys and version every persisted envelope.

```ts
interface StorageAdapter {
  available(): boolean;
  get<T>(key: string, validate: (value: unknown) => value is T): T | null;
  set<T>(key: string, value: T): boolean;
  remove(key: string): boolean;
  clearNamespace(): boolean;
}

interface PersonalizationStateV1 {
  version: 1;
  updatedAt: string;
  library: Record<string, {
    status: 'want-to-read' | 'reading' | 'read';
    favorite?: boolean;
    updatedAt: string;
  }>;
  recentlyExplored: Array<{ bookId: string; viewedAt: string }>;
  savedResourceIds: string[];
  savedJourneyIds: string[];
  preferences?: {
    locale?: 'en' | 'fr' | 'es';
    ageBandIds?: string[];
    themeIds?: string[];
  };
}
```

Requirements:

- Parse in `try/catch`, validate shape, discard or quarantine invalid state, and continue in memory.
- Cap recent history and all ID lists.
- Deduplicate IDs and remove references to missing catalog items at read time.
- Writes are best effort and return success without throwing to UI callers.
- Provide a user-visible clear-local-data action.
- Do not store translated titles, images, descriptions, analytics IDs, or personal identity.

## 6. Recommendation Contract

```ts
interface RecommendationContext {
  locale: 'en' | 'fr' | 'es';
  sourceBookIds?: string[];
  favoriteBookIds?: string[];
  ageBandIds?: string[];
  themeIds?: string[];
  excludeIds?: string[];
  limit: number;
}

interface Recommendation {
  bookId: string;
  score: number;
  reasons: Array<'editorial' | 'related' | 'theme' | 'age' | 'preference'>;
}
```

Ranking order is editorial relation, direct related-book relation, matched explicit theme, matched explicit age, then deterministic catalog fallback. Filter unavailable locale variants, duplicates, excluded/read items when appropriate, and broken IDs. Stable tie-breaking uses editorial order then book ID. Return an explanation key for localized UI.

## 7. Work Breakdown and Traceability

| PRD ID | Implementation | Primary verification |
| --- | --- | --- |
| S6-001 | Extend the existing reading library with want-to-read, reading, and read states using stable IDs. | Migration and state-transition tests. |
| S6-002 | Add explicit favorites integrated into the same library envelope. | Toggle, persistence, blocked-storage, and localization tests. |
| S6-003 | Add Continue Reading from the most recent valid reading state. | Deterministic ordering and stale-ID cleanup. |
| S6-004 | Record a small, deduplicated, bounded list of recently viewed books. | Limit, order, privacy, and expiry policy tests. |
| S6-005 | Add optional adult preference selection using existing age and theme IDs. | Clear, skip, change, and invalid-ID behavior. |
| S6-006 | Add optional homepage sections only when enough valid local context exists. | New-user page remains complete without personalization. |
| S6-007 | Implement deterministic recommendation utility with explainable reasons. | Golden ranking fixtures and locale filtering. |
| S6-008 | Recommend activities from structured book relationships. | Stable-ID and missing-relationship tests. |
| S6-009 | Add a local saved-resource shelf. | Save/remove, invalid ID, and no-storage tests. |
| S6-010 | Add an adult/caregiver Family Reading Dashboard, not a child account page. | Privacy copy and full keyboard journey. |
| S6-011 | Produce ADR comparing local-only, optional adult accounts, and local-first sync. Do not implement accounts without evidence. | Signed architecture decision. |
| S6-012 | Centralize storage availability, JSON parsing, validation, migration, removal, and failure handling. | Forced exception and corruption suite. |
| S6-013 | Provide clear-local-data controls and transparent explanation of on-device storage. | Data is actually removed and UI resets. |
| S6-014 | Measure feature use with aggregate content IDs and placements, not identity. | Event privacy/schema tests. |
| S6-015 | Run all core flows with cookies disabled. | Permanent browser regression suite. |
| S6-016 | Run quota, denied access, malformed JSON, unavailable API, and write-failure tests. | Site remains usable with no persistence. |
| S6-017 | Validate keyboard, screen-reader, contrast, focus, and status announcements. | Zero critical accessibility violations. |
| S6-018 | Audit production persistence, locale parity, links, console errors, privacy controls, and recommendations. | Signed release audit. |

## 8. State Migration

1. Read existing status keys without modifying them.
2. Validate known legacy shapes.
3. Map valid stable book IDs into version 1 state.
4. Write the new envelope only after successful conversion.
5. Retain the old key for one release if rollback compatibility requires it, then remove under a documented cleanup release.
6. If migration fails, preserve the old value and continue without personalization.

## 9. Accessibility and UX

- Saved-state controls use native buttons with localized accessible names and visible pressed state.
- State changes announce through a polite live region without stealing focus.
- Personalized sections have semantic headings and a clear reason label.
- Empty states explain how to save content and never imply a child is being tracked.
- Privacy controls show what is stored, where it is stored, and what clearing does.

## 10. Analytics

Events may include `library_status_changed`, `favorite_changed`, `personalized_section_viewed`, `recommendation_clicked`, `resource_saved`, `journey_saved`, and `local_data_cleared`. Allowed properties are locale, stable content ID, placement, recommendation reason, and state. Never send the full library, preferences bundle, device identity, or child-related free text.

## 11. Test Plan

- Unit: adapters, validators, migrations, ranking, caps, deduplication.
- Component: all save controls, dashboard sections, transparency copy, live-region behavior.
- Integration: save to return to continue, preferences to recommendations, clear data.
- Resilience: cookies disabled, localStorage missing, access denied, quota exceeded, malformed state.
- Accessibility: keyboard-only and screen-reader paths in all locales.
- Production: clean profile, returning profile, and blocked-storage profile.

## 12. Implementation Sequence

1. Inventory storage calls and define ADR boundaries.
2. Implement storage adapter, schema, validation, and migration.
3. Integrate personal library, favorites, recent history, and resources.
4. Implement preferences and recommendation engine.
5. Add homepage personalization and Family Dashboard.
6. Add transparency controls and privacy-safe analytics.
7. Complete cookie-free, failure, accessibility, and production testing.

## 13. Release Gates

- All core flows pass with zero cookies.
- All core flows remain usable with browser storage disabled or failing.
- No duplicate content database or child profile is introduced.
- Recommendation outputs are deterministic, localized, and explainable.
- Users can inspect and clear local personalization data.
- Zero critical accessibility, privacy, or production defects.

## 14. Open Decisions

- Approved cap and retention period for recent history.
- Whether reading progress requires more than status and timestamp.
- Whether evidence supports optional adult accounts. This remains an ADR decision, not an implementation assumption.

