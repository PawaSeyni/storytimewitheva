import {
  SHARED_KEYS,
  getShared,
  setShared,
  getLegacy,
  removeLegacy,
  available,
  type LegacyKey,
} from './storage';

// Reading and activity progress. No backend, no auth: progress lives on the current
// device only.
//
// Storage goes through src/lib/storage.ts (S6-012), which owns availability probing,
// JSON parsing, validation and failure handling. This module owns the SHAPE and the
// domain rules only.
//
// The key stays the raw, unversioned `readingProgress`, in the SHARED tier, because all
// 12 standalone games in public/games write it directly when a child taps "Mark
// Completed". Namespacing it would not fail loudly: the games would keep writing the old
// key, the SPA would read the new one, and completed activities would quietly disappear.

export type BookStatus = 'read' | 'want_to_read' | null;

export interface Progress {
  booksRead: string[]; // Book.id values
  booksWantToRead: string[]; // Book.id values
  activitiesCompleted: string[]; // activity slugs (e.g. "story-builder")
}

const STORAGE_KEY = SHARED_KEYS.progress;

/** Generic object guard for legacy payloads owned by the games and demos. */
function isObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

/** Shape guard for the legacy flat payload the games also write. */
function isProgressLike(v: unknown): v is Partial<Progress> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

/** True when progress will actually survive a reload. Lets the UI be honest about it. */
export const progressPersists = available;

const empty = (): Progress => ({
  booksRead: [],
  booksWantToRead: [],
  activitiesCompleted: [],
});

export function loadProgress(): Progress {
  const parsed = getShared(STORAGE_KEY, isProgressLike);
  if (!parsed) return empty();
  // Each field is validated independently: a game writing one array must not invalidate
  // the others, and a partial payload is normal rather than corrupt.
  return {
    booksRead: Array.isArray(parsed.booksRead) ? parsed.booksRead : [],
    booksWantToRead: Array.isArray(parsed.booksWantToRead) ? parsed.booksWantToRead : [],
    activitiesCompleted: Array.isArray(parsed.activitiesCompleted) ? parsed.activitiesCompleted : [],
  };
}

export function saveProgress(next: Progress): void {
  // Best effort by contract: the adapter never throws, and keeps an in-memory copy when
  // the disk write fails, so the current session stays consistent even in Private Mode.
  setShared(STORAGE_KEY, next);
  // Fire regardless of whether it persisted, so listeners refresh either way.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('progresschange'));
  }
}

export function getBookStatus(progress: Progress, bookId: string): BookStatus {
  if (progress.booksRead.includes(bookId)) return 'read';
  if (progress.booksWantToRead.includes(bookId)) return 'want_to_read';
  return null;
}

export function setBookStatus(bookId: string, status: BookStatus): Progress {
  const current = loadProgress();
  const next: Progress = {
    booksRead: current.booksRead.filter((id) => id !== bookId),
    booksWantToRead: current.booksWantToRead.filter((id) => id !== bookId),
    activitiesCompleted: current.activitiesCompleted,
  };
  if (status === 'read') next.booksRead.push(bookId);
  if (status === 'want_to_read') next.booksWantToRead.push(bookId);
  saveProgress(next);
  return next;
}

export function isActivityCompleted(progress: Progress, slug: string): boolean {
  return progress.activitiesCompleted.includes(slug);
}

export function setActivityCompleted(slug: string, completed: boolean): Progress {
  const current = loadProgress();
  const next: Progress = {
    ...current,
    activitiesCompleted: completed
      ? Array.from(new Set([...current.activitiesCompleted, slug]))
      : current.activitiesCompleted.filter((s) => s !== slug),
  };
  saveProgress(next);
  return next;
}

export function clearProgress(): Progress {
  const next = empty();
  saveProgress(next);
  // Several activities persist under their own keys (see below, plus the
  // Coloring gallery and Bookmark designer). "Clear all progress" should wipe
  // every user-created store, not just the readingProgress one.
  for (const key of EXTRA_PROGRESS_KEYS) {
    removeLegacy(key);
  }
  return next;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading Tracker entries
//
// Owned by the standalone vanilla-JS game at public/games/reading-tracker.html,
// which persists under its own key. We read that key here (read-only) so the
// Profile page can surface logged sessions. The schema below mirrors the shape
// the game writes; keep them in sync.
// ─────────────────────────────────────────────────────────────────────────────

const READING_TRACKER_KEY: LegacyKey = 'eva_reading_tracker_v1';

export interface ReadingTrackerSession {
  date: string; // ISO timestamp
  book: string;
  mins: number;
  stars: number;
  note: string;
}

export interface ReadingTracker {
  childName: string;
  totalBooks: number;
  totalMins: number;
  streak: number;
  log: ReadingTrackerSession[];
}

export function loadReadingTracker(): ReadingTracker | null {
  const parsed = getLegacy(READING_TRACKER_KEY, isObject) as Partial<ReadingTracker> | null;
  if (!parsed) return null;
  const log = Array.isArray(parsed.log)
    ? parsed.log
        .filter((e): e is ReadingTrackerSession => Boolean(e) && typeof e === 'object')
        .map((e) => ({
          date: typeof e.date === 'string' ? e.date : '',
          book: typeof e.book === 'string' ? e.book : '',
          mins: typeof e.mins === 'number' ? e.mins : 0,
          stars: typeof e.stars === 'number' ? e.stars : 0,
          note: typeof e.note === 'string' ? e.note : '',
        }))
    : [];
  return {
    childName: typeof parsed.childName === 'string' ? parsed.childName : '',
    totalBooks: typeof parsed.totalBooks === 'number' ? parsed.totalBooks : log.length,
    totalMins: typeof parsed.totalMins === 'number' ? parsed.totalMins : 0,
    streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
    log,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reading Journal entries
//
// Owned by the Adventure Journal demo (src/demos/AdventureJournalDemo.tsx),
// which persists an array under its own key. We read it here (read-only) so the
// Profile page can surface saved entries. Keep this schema in sync with that
// component's Entry type.
// ─────────────────────────────────────────────────────────────────────────────

const READING_JOURNAL_KEY: LegacyKey = 'adventureJournal';

export interface JournalEntry {
  id: number;
  bookTitle: string;
  date: string; // YYYY-MM-DD
  rating: number;
  favoriteCharacter: string;
  favoriteScene: string;
  thoughts: string;
  emoji: string;
}

export function loadReadingJournal(): JournalEntry[] {
  const parsed = getLegacy(READING_JOURNAL_KEY, Array.isArray);
  if (!parsed) return [];
  return (parsed as unknown[])
    .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
    .map((e) => ({
      id: typeof e.id === 'number' ? e.id : 0,
      bookTitle: typeof e.bookTitle === 'string' ? e.bookTitle : '',
      date: typeof e.date === 'string' ? e.date : '',
      rating: typeof e.rating === 'number' ? e.rating : 0,
      favoriteCharacter: typeof e.favoriteCharacter === 'string' ? e.favoriteCharacter : '',
      favoriteScene: typeof e.favoriteScene === 'string' ? e.favoriteScene : '',
      thoughts: typeof e.thoughts === 'string' ? e.thoughts : '',
      emoji: typeof e.emoji === 'string' ? e.emoji : '📖',
    }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Other user-created stores
//
// These activities save the user's own creations under their own keys but are
// not surfaced on the Profile page. They are listed here only so that
// "Clear all progress" can remove them along with everything else.
//   - 'coloringGallery'  — saved coloring artwork (src/demos/ColoringDemo.tsx)
//   - 'bookmarkDesign'   — saved bookmark design (src/demos/BookmarkCraftsDemo.tsx)
// ─────────────────────────────────────────────────────────────────────────────

const COLORING_GALLERY_KEY: LegacyKey = 'coloringGallery';
const BOOKMARK_DESIGN_KEY: LegacyKey = 'bookmarkDesign';

// Every namespaced store that "Clear all progress" should wipe (the main
// readingProgress store is cleared separately via saveProgress(empty())).
const EXTRA_PROGRESS_KEYS: LegacyKey[] = [
  READING_TRACKER_KEY,
  READING_JOURNAL_KEY,
  COLORING_GALLERY_KEY,
  BOOKMARK_DESIGN_KEY,
];
