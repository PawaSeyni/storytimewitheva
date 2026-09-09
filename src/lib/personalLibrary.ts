// Personal reading library (Sprint 6 S6-001 … S6-004).
//
// ONE versioned envelope in the namespaced tier, read and written through
// src/lib/storage.ts. Holds stable IDs and minimal state only: never a second copy of
// catalog content, never a translated title, never anything identifying.
//
// ---------------------------------------------------------------------------------
// WHY BOOK STATUS MOVES HERE BUT ACTIVITY COMPLETION DOES NOT
//
// The legacy `readingProgress` key is shared with the 12 standalone games. Inspecting
// their injected sync block shows they only ever MUTATE `activitiesCompleted`; they
// re-write `booksRead` / `booksWantToRead` verbatim from what they read, purely so they
// do not clobber them.
//
// So book status is SPA-owned in practice and moves into this envelope, where it can
// carry the three states and favorites Sprint 6 requires. Activity completion stays in
// the shared key, because the games own those writes.
//
// We deliberately DO NOT dual-write book status back to the legacy key. A game's echo of
// a stale copy would eventually overwrite newer values, which is a silent data-loss bug.
// The legacy arrays are migrated once and then left as vestigial data.
// ---------------------------------------------------------------------------------

import {
  get,
  set,
  getShared,
  clearNamespace,
  SHARED_KEYS,
  dedupe,
  capList,
  pruneMissing,
} from './storage';

export type LibraryStatus = 'want-to-read' | 'reading' | 'read';

export interface LibraryEntry {
  /** Absent when the book is only favorited: a favorite is not a reading status. */
  status?: LibraryStatus;
  favorite?: boolean;
  updatedAt: string;
}

/**
 * Sprint 6 §5. The whole envelope is declared now, including the fields later slices
 * fill (saved resources, saved journeys, preferences), so adding those does not force a
 * version bump and a migration for state that was always meant to live here.
 */
export interface PersonalizationStateV1 {
  version: 1;
  updatedAt: string;
  library: Record<string, LibraryEntry>;
  recentlyExplored: Array<{ bookId: string; viewedAt: string }>;
  savedResourceIds: string[];
  savedJourneyIds: string[];
  preferences?: {
    /**
     * Declared by Sprint 6 §5 but deliberately NEVER WRITTEN. Language already persists
     * in the shared `preferredLanguage` key because public/games/i18n.js reads it; a
     * second copy here would be two sources of truth for one setting.
     */
    locale?: 'en' | 'es' | 'fr';
    ageBandIds?: string[];
    themeIds?: string[];
  };
}

const KEY = 'personalization';
const LIBRARY_CHANGE = 'librarychange';

/**
 * Cap for recently-viewed: 12 entries, no time-based expiry. A browse session, not a
 * history log. Sprint 6 §14 left the cap and retention period as an owner decision;
 * approved as-is 2026-09-09 (punch list N-05). Change here, and the tests follow.
 */
export const RECENTLY_EXPLORED_CAP = 12;

/** Hard cap on every ID list, so a loop or a bad import cannot grow state without bound. */
const MAX_LIBRARY_ENTRIES = 500;

const STATUSES: LibraryStatus[] = ['want-to-read', 'reading', 'read'];

const empty = (): PersonalizationStateV1 => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  library: {},
  recentlyExplored: [],
  savedResourceIds: [],
  savedJourneyIds: [],
});

function isState(v: unknown): v is PersonalizationStateV1 {
  if (!v || typeof v !== 'object') return false;
  const s = v as Partial<PersonalizationStateV1>;
  return typeof s.library === 'object' && s.library !== null;
}

function isLegacyProgress(v: unknown): v is { booksRead?: unknown; booksWantToRead?: unknown } {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

/**
 * One-time import of the pre-Sprint-6 two-state arrays (Sprint 6 §8). Reads the legacy
 * key WITHOUT modifying it, maps only valid string IDs, and is skipped entirely once the
 * envelope exists, so a later un-favorite or status change is never resurrected.
 */
function migrateFromLegacy(): PersonalizationStateV1 {
  const state = empty();
  const legacy = getShared(SHARED_KEYS.progress, isLegacyProgress);
  if (!legacy) return state;
  const now = new Date().toISOString();
  const add = (ids: unknown, status: LibraryStatus) => {
    if (!Array.isArray(ids)) return;
    for (const id of ids) {
      if (typeof id !== 'string' || !id) continue;
      state.library[id] = { status, updatedAt: now };
    }
  };
  // want-to-read first, so a book in both legacy arrays ends up 'read' (the stronger claim)
  add(legacy.booksWantToRead, 'want-to-read');
  add(legacy.booksRead, 'read');
  return state;
}

/** Read the envelope, migrating from the legacy key the first time. Never throws. */
export function loadLibrary(): PersonalizationStateV1 {
  const stored = get(KEY, isState);
  if (stored) {
    return {
      ...empty(),
      ...stored,
      library: stored.library ?? {},
      recentlyExplored: Array.isArray(stored.recentlyExplored) ? stored.recentlyExplored : [],
      savedResourceIds: Array.isArray(stored.savedResourceIds) ? dedupe(stored.savedResourceIds) : [],
      savedJourneyIds: Array.isArray(stored.savedJourneyIds) ? dedupe(stored.savedJourneyIds) : [],
    };
  }
  const migrated = migrateFromLegacy();
  // Persist immediately so the migration runs once, not on every read.
  if (Object.keys(migrated.library).length > 0) set(KEY, migrated);
  return migrated;
}

function save(next: PersonalizationStateV1): void {
  next.updatedAt = new Date().toISOString();
  set(KEY, next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LIBRARY_CHANGE));
  }
}

/** Subscribe to library changes. Returns an unsubscribe function. */
export function onLibraryChange(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(LIBRARY_CHANGE, fn);
  return () => window.removeEventListener(LIBRARY_CHANGE, fn);
}

// ---------------------------------------------------------------------------------
// Reading status (S6-001)
// ---------------------------------------------------------------------------------

export function getStatus(state: PersonalizationStateV1, bookId: string): LibraryStatus | null {
  const entry = state.library[bookId];
  return entry && STATUSES.includes(entry.status) ? entry.status : null;
}

/** Set or clear a book's status. Passing the current status clears it (toggle). */
export function setStatus(bookId: string, status: LibraryStatus | null): PersonalizationStateV1 {
  const state = loadLibrary();
  const existing = state.library[bookId];
  if (status === null) {
    // Clearing a status must not silently un-favorite the book, so the entry survives
    // when it is still a favorite and is dropped entirely when nothing is left to hold.
    if (existing?.favorite) {
      state.library[bookId] = { favorite: true, updatedAt: new Date().toISOString() };
    } else {
      delete state.library[bookId];
    }
  } else {
    if (Object.keys(state.library).length >= MAX_LIBRARY_ENTRIES && !existing) return state;
    state.library[bookId] = { ...existing, status, updatedAt: new Date().toISOString() };
  }
  save(state);
  return state;
}

export function booksWithStatus(state: PersonalizationStateV1, status: LibraryStatus): string[] {
  return Object.entries(state.library)
    .filter(([, e]) => e.status === status)
    .sort((a, b) => (a[1].updatedAt < b[1].updatedAt ? 1 : -1)) // newest first
    .map(([id]) => id);
}

// ---------------------------------------------------------------------------------
// Favorites (S6-002) — in the same envelope, not a parallel store
// ---------------------------------------------------------------------------------

export function isFavorite(state: PersonalizationStateV1, bookId: string): boolean {
  return state.library[bookId]?.favorite === true;
}

export function toggleFavorite(bookId: string): PersonalizationStateV1 {
  const state = loadLibrary();
  const existing = state.library[bookId];
  const next = !existing?.favorite;
  if (!next && !existing?.status) {
    delete state.library[bookId]; // nothing left to remember
  } else {
    if (Object.keys(state.library).length >= MAX_LIBRARY_ENTRIES && !existing) return state;
    state.library[bookId] = { ...existing, favorite: next, updatedAt: new Date().toISOString() };
  }
  save(state);
  return state;
}

export function favoriteBookIds(state: PersonalizationStateV1): string[] {
  return Object.entries(state.library)
    .filter(([, e]) => e.favorite)
    .sort((a, b) => (a[1].updatedAt < b[1].updatedAt ? 1 : -1))
    .map(([id]) => id);
}

// ---------------------------------------------------------------------------------
// Continue reading (S6-003) + recently explored (S6-004)
// ---------------------------------------------------------------------------------

/** The most recently touched book still marked 'reading', or null. */
export function continueReadingId(state: PersonalizationStateV1): string | null {
  return booksWithStatus(state, 'reading')[0] ?? null;
}

/** Record a book view. Deduplicated, newest first, capped. Best effort. */
export function recordExplored(bookId: string): void {
  if (!bookId) return;
  const state = loadLibrary();
  const rest = state.recentlyExplored.filter((r) => r.bookId !== bookId);
  state.recentlyExplored = capList(
    [{ bookId, viewedAt: new Date().toISOString() }, ...rest],
    RECENTLY_EXPLORED_CAP,
  );
  save(state);
}

/**
 * Recently viewed IDs, with anything the catalog no longer contains dropped AT READ TIME
 * (Sprint 6 §5) so a retired book cannot leave a dangling entry behind.
 */
export function recentlyExploredIds(
  state: PersonalizationStateV1,
  exists: (id: string) => boolean,
  excludeId?: string,
): string[] {
  const ids = state.recentlyExplored.map((r) => r.bookId).filter((id) => id !== excludeId);
  return pruneMissing(dedupe(ids), exists);
}

/** Everything this device remembers, for the transparency + clear-data controls. */
export function libraryCounts(state: PersonalizationStateV1): {
  read: number;
  reading: number;
  wantToRead: number;
  favorites: number;
  recentlyExplored: number;
  savedResources: number;
  preferences: number;
} {
  return {
    read: booksWithStatus(state, 'read').length,
    reading: booksWithStatus(state, 'reading').length,
    wantToRead: booksWithStatus(state, 'want-to-read').length,
    favorites: favoriteBookIds(state).length,
    recentlyExplored: state.recentlyExplored.length,
    savedResources: state.savedResourceIds.length,
    preferences:
      (state.preferences?.themeIds?.length ?? 0) + (state.preferences?.ageBandIds?.length ?? 0),
  };
}

// ---------------------------------------------------------------------------------
// Adult preferences (S6-005)
//
// Optional and explicit: nothing is inferred from behavior. Unknown IDs are dropped on
// read rather than trusted, so a retired theme cannot poison a recommendation forever.
// ---------------------------------------------------------------------------------

export interface Preferences {
  ageBandIds: string[];
  themeIds: string[];
}

export function getPreferences(
  state: PersonalizationStateV1,
  validTheme: (id: string) => boolean,
  validBand: (id: string) => boolean,
): Preferences {
  const p = state.preferences ?? {};
  return {
    themeIds: pruneMissing(dedupe(p.themeIds ?? []), validTheme),
    ageBandIds: pruneMissing(dedupe(p.ageBandIds ?? []), validBand),
  };
}

/** Replace preferences wholesale. Passing empty arrays is how "skip" and "clear" work. */
export function setPreferences(next: Partial<Preferences>): PersonalizationStateV1 {
  const state = loadLibrary();
  state.preferences = {
    ...state.preferences,
    themeIds: dedupe(next.themeIds ?? state.preferences?.themeIds ?? []),
    ageBandIds: dedupe(next.ageBandIds ?? state.preferences?.ageBandIds ?? []),
  };
  save(state);
  return state;
}

export function hasPreferences(state: PersonalizationStateV1): boolean {
  const p = state.preferences;
  return Boolean((p?.themeIds?.length ?? 0) + (p?.ageBandIds?.length ?? 0));
}

// ---------------------------------------------------------------------------------
// Saved resources (S6-009) — IDs only, resolved against the registry at read time
// ---------------------------------------------------------------------------------

export function isResourceSaved(state: PersonalizationStateV1, resourceId: string): boolean {
  return state.savedResourceIds.includes(resourceId);
}

export function toggleSavedResource(resourceId: string): PersonalizationStateV1 {
  const state = loadLibrary();
  state.savedResourceIds = state.savedResourceIds.includes(resourceId)
    ? state.savedResourceIds.filter((id) => id !== resourceId)
    : capList(dedupe([resourceId, ...state.savedResourceIds]), MAX_LIBRARY_ENTRIES);
  save(state);
  return state;
}

/** Saved resource IDs, with anything the registry no longer contains dropped on read. */
export function savedResourceIds(
  state: PersonalizationStateV1,
  exists: (id: string) => boolean,
): string[] {
  return pruneMissing(dedupe(state.savedResourceIds), exists);
}

// ---------------------------------------------------------------------------------
// Clear local data (S6-013)
// ---------------------------------------------------------------------------------

/**
 * Remove everything in the personalization envelope. Clears the whole namespaced tier
 * (this envelope is currently its only occupant) and notifies listeners so every control
 * on the page resets. Callers that also want the legacy activity/journal stores gone
 * call progress.clearProgress() alongside; the two are kept separate because they are
 * owned by different code and one must not silently depend on the other.
 */
export function clearLibrary(): boolean {
  const ok = clearNamespace();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LIBRARY_CHANGE));
  }
  return ok;
}
