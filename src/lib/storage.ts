// Centralized browser-storage access (Sprint 6 S6-012).
//
// One place owns availability checks, JSON parsing, shape validation, envelope
// versioning, migration and failure handling. Callers get plain values and booleans and
// never see a thrown exception: Safari Private Mode rejects every write, quota can be
// exhausted, and enterprise policy can deny access entirely. A click handler must not
// break because persistence did.
//
// ---------------------------------------------------------------------------------
// TWO TIERS, and the reason there are two
//
// Sprint 6 §5 says "namespace all keys and version every persisted envelope". That is
// right for state the SPA owns alone, and WRONG for two keys, because they are a
// contract with code outside the SPA:
//
//   readingProgress    - written directly by all 12 standalone games in public/games
//                        (injected by scripts/patch-games.mjs) when a child taps
//                        "Mark Completed", in the legacy flat shape.
//   preferredLanguage  - read by public/games/i18n.js to localize game chrome.
//
// Namespacing or wrapping those would not fail loudly. The game would keep writing the
// old key, the SPA would read the new one, and completed activities would silently stop
// appearing. So SHARED keys stay raw and unversioned, and that is deliberate.
//
// Everything the SPA owns alone uses the namespaced, versioned tier.
// ---------------------------------------------------------------------------------

const NAMESPACE = 'ste';
const SEPARATOR = ':';

/** Keys that are a contract with code outside the SPA. Raw, unversioned, do not rename. */
export const SHARED_KEYS = {
  /** Reading + activity progress. Written by the 12 standalone games. */
  progress: 'readingProgress',
  /** Language preference. Read by public/games/i18n.js. */
  language: 'preferredLanguage',
  /** Pixel mascot visibility. Kept raw so an existing choice is not reset by a rename. */
  pixel: 'pixelMascot',
} as const;

export type SharedKey = (typeof SHARED_KEYS)[keyof typeof SHARED_KEYS];

/** Versioned wrapper around everything in the namespaced tier. */
interface Envelope<T> {
  v: number;
  updatedAt: string;
  data: T;
}

/**
 * In-memory fallback. When storage is unavailable or every write fails, state still works
 * for the current page so a feature degrades to "not remembered" instead of "broken".
 */
const memory = new Map<string, string>();

let availability: boolean | null = null;

/** True when localStorage can actually be read AND written. Probed once, then cached. */
export function available(): boolean {
  if (availability !== null) return availability;
  availability = (() => {
    if (typeof window === 'undefined') return false;
    try {
      const probe = `${NAMESPACE}${SEPARATOR}__probe`;
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false; // private mode, denied by policy, or quota already full
    }
  })();
  return availability;
}

/** Test seam: forget the cached probe result. */
export function resetAvailabilityCache(): void {
  availability = null;
}

const nsKey = (key: string) => `${NAMESPACE}${SEPARATOR}${key}`;

function readRaw(key: string): string | null {
  if (available()) {
    try {
      const v = window.localStorage.getItem(key);
      if (v !== null) return v;
    } catch {
      /* fall through to memory */
    }
  }
  return memory.get(key) ?? null;
}

function writeRaw(key: string, value: string): boolean {
  memory.set(key, value); // always mirror, so this session stays consistent
  if (!available()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false; // quota or private mode: the in-memory copy carries the session
  }
}

function removeRaw(key: string): boolean {
  memory.delete(key);
  if (!available()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read namespaced, versioned state. Invalid JSON, a wrong-shaped payload or a future
 * version all return null rather than throwing or handing back a half-parsed object.
 * `expectVersion` mismatches are DISCARDED, not coerced: a migration is an explicit
 * decision, never a silent reinterpretation of someone's data.
 */
export function get<T>(
  key: string,
  validate: (value: unknown) => value is T,
  expectVersion = 1,
): T | null {
  const raw = readRaw(nsKey(key));
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const env = parsed as Partial<Envelope<unknown>>;
    if (env.v !== expectVersion) return null;
    return validate(env.data) ? env.data : null;
  } catch {
    return null; // corrupt payload: report nothing rather than guess
  }
}

/** Write namespaced, versioned state. Returns whether it actually persisted to disk. */
export function set<T>(key: string, value: T, version = 1): boolean {
  const env: Envelope<T> = { v: version, updatedAt: new Date().toISOString(), data: value };
  try {
    return writeRaw(nsKey(key), JSON.stringify(env));
  } catch {
    return false; // circular or non-serializable value
  }
}

export function remove(key: string): boolean {
  return removeRaw(nsKey(key));
}

/**
 * Remove every namespaced key, leaving SHARED keys and unrelated origin data alone.
 * A clear-my-data control must not delete another feature's storage as a side effect.
 */
export function clearNamespace(): boolean {
  const prefix = `${NAMESPACE}${SEPARATOR}`;
  for (const k of [...memory.keys()]) if (k.startsWith(prefix)) memory.delete(k);
  if (!available()) return false;
  try {
    const doomed: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) doomed.push(k);
    }
    for (const k of doomed) window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/** List the namespaced keys currently stored, so a privacy screen can show what is held. */
export function namespacedKeys(): string[] {
  const prefix = `${NAMESPACE}${SEPARATOR}`;
  const out = new Set<string>();
  for (const k of memory.keys()) if (k.startsWith(prefix)) out.add(k.slice(prefix.length));
  if (available()) {
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(prefix)) out.add(k.slice(prefix.length));
      }
    } catch {
      /* ignore */
    }
  }
  return [...out].sort();
}

// ---------------------------------------------------------------------------------
// SHARED tier — raw keys, no namespace, no envelope. See the header for why.
// ---------------------------------------------------------------------------------

/** Read a shared key, validated. Returns null on absence, corruption or wrong shape. */
export function getShared<T>(key: SharedKey, validate: (value: unknown) => value is T): T | null {
  const raw = readRaw(key);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Read a shared key that holds a bare string (not JSON), e.g. preferredLanguage. */
export function getSharedString(key: SharedKey): string | null {
  return readRaw(key);
}

export function setShared<T>(key: SharedKey, value: T): boolean {
  try {
    return writeRaw(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function setSharedString(key: SharedKey, value: string): boolean {
  return writeRaw(key, value);
}

export function removeShared(key: SharedKey): boolean {
  return removeRaw(key);
}

// ---------------------------------------------------------------------------------
// LEGACY tier — raw, unversioned keys that predate this adapter.
//
// Two different reasons a key lives here, and neither is "we forgot":
//
//   1. Owned by another program. `eva_reading_tracker_v1` is written by
//      public/games/reading-tracker.html. The SPA only reads it.
//   2. Holds existing USER-CREATED CONTENT. The three demo keys store saved artwork,
//      journal entries and a bookmark design. No game touches them, so they COULD be
//      namespaced — but renaming a key orphans whatever is already in it, and losing a
//      child's saved drawing is a worse outcome than an inconsistent key name. If these
//      are ever migrated it must be a copy-then-verify, not a rename.
//
// Listed explicitly rather than accepted as an arbitrary string, so a typo is a compile
// error instead of a read that quietly returns nothing forever.
// ---------------------------------------------------------------------------------

export const LEGACY_KEYS = [
  'eva_reading_tracker_v1', // public/games/reading-tracker.html (SPA reads only)
  'adventureJournal',       // src/demos/AdventureJournalDemo.tsx — user entries
  'coloringGallery',        // src/demos/ColoringDemo.tsx — saved artwork (large base64)
  'bookmarkDesign',         // src/demos/BookmarkCraftsDemo.tsx — saved design
] as const;

export type LegacyKey = (typeof LEGACY_KEYS)[number];

/** Read another program's raw JSON key, validated. Null on absence or corruption. */
export function getLegacy<T>(key: LegacyKey, validate: (value: unknown) => value is T): T | null {
  const raw = readRaw(key);
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return validate(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Write another program's / a demo's raw key. Returns whether it actually persisted, so a
 * caller can tell the user when a save failed — the coloring gallery holds full-canvas
 * base64 PNGs and a dozen of them can exhaust the ~5MB quota.
 */
export function setLegacy<T>(key: LegacyKey, value: T): boolean {
  try {
    return writeRaw(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function removeLegacy(key: LegacyKey): boolean {
  return removeRaw(key);
}

// ---------------------------------------------------------------------------------
// List hygiene — Sprint 6 §5 requires ID lists to be capped and deduplicated, and
// references to missing catalog items dropped AT READ TIME rather than on write, so a
// book leaving the catalog cannot leave a dangling id behind.
// ---------------------------------------------------------------------------------

/** Deduplicate while preserving first-seen order. */
export function dedupe<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

/** Keep at most `max`, dropping from the END (oldest, for newest-first lists). */
export function capList<T>(items: readonly T[], max: number): T[] {
  return items.length <= max ? [...items] : items.slice(0, max);
}

/** Drop ids the catalog no longer contains. Call on READ, never only on write. */
export function pruneMissing(ids: readonly string[], exists: (id: string) => boolean): string[] {
  return ids.filter(exists);
}
