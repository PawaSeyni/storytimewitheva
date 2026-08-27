// Shared-store rate limiter for the signup endpoint.
//
// WHY THIS EXISTS. The Netlify platform rate limit declared in subscribe.mjs's
// `config` export is accepted by the deploy API and NOT enforced at runtime on
// this site. Measured 2026-08-27 on production and on a deploy preview, with a
// control function on a normal path to rule out the reserved /.netlify/ prefix:
//
//   /api/ratelimit-probe      3/60s rule registered  ->  18 requests, 18x 200
//   /.netlify/functions/...   5/60s rule registered  ->   9 requests,  9x 200
//
// So this is the control that actually runs. The platform rule stays declared as
// a second layer: if Netlify starts enforcing it, requests are rejected at the
// edge before they ever reach this code, which is strictly better.
//
// SLIDING WINDOW LOG, not fixed buckets. One key per subject holding recent hit
// timestamps, pruned on read. That keeps key count bounded by distinct
// subjects (Netlify Blobs has no TTL, so bucket-per-window keys would
// accumulate forever) and avoids the fixed-window edge where 2x the limit slips
// through across a boundary.
//
// PRIVACY. Subjects are SHA-256 hashed before they are used as keys, so the
// store holds no raw IP or email. This matches the site's posture elsewhere
// (the Pinterest conversion deliberately sends a hashed email and no IP).
//
// CONCURRENCY. Read-modify-write without a compare-and-swap, so simultaneous
// requests for the same subject can both read the pre-increment count and each
// be allowed. Worst case is slight over-permitting under exact concurrency,
// which is acceptable for abuse control and far better than not counting.
import { createHash } from 'node:crypto';

const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);

// Defaults: a human signs up once. The burst window matches the platform rule
// so behaviour is identical whichever layer is doing the work.
export const LIMITS = {
  ip: [
    { windowMs: 60_000, max: num(process.env.SIGNUP_LIMIT_IP_BURST, 5), label: 'ip/minute' },
    { windowMs: 3_600_000, max: num(process.env.SIGNUP_LIMIT_IP_HOUR, 30), label: 'ip/hour' },
  ],
  email: [{ windowMs: 3_600_000, max: num(process.env.SIGNUP_LIMIT_EMAIL_HOUR, 3), label: 'email/hour' }],
};

const STRICT = process.env.SIGNUP_LIMITER_STRICT === '1';
const STORE_NAME = 'signup-ratelimit';

const hash = v => createHash('sha256').update(String(v)).digest('hex').slice(0, 32);

// --- storage -------------------------------------------------------------
// Blobs is loaded lazily and defensively: a failure here must degrade the
// limiter, never take down the endpoint. `strong` consistency because a
// rate limiter reading a stale count is a rate limiter that does not work.
let storeP;
const memory = new Map();
export let lastCount = -1;   // TEMP diagnostic
export let lastBackend = '?'; // TEMP diagnostic
export const debugState = () => `${lastBackend}:${lastCount}`;

async function blobStore() {
  if (storeP === undefined) {
    storeP = (async () => {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore({ name: STORE_NAME, consistency: 'strong' });
      // Round-trip check: connecting is not the same as persisting. A store
      // that accepts a write and then hands back a stale/empty read is worse
      // than no store, because it looks healthy while counting nothing.
      await store.get('__probe__');
      const marker = `rt-${Date.now()}`;
      await store.setJSON('__roundtrip__', { marker });
      const back = await store.get('__roundtrip__', { type: 'json' });
      if (back?.marker !== marker) {
        throw new Error(`round-trip failed: wrote ${marker}, read back ${JSON.stringify(back)}`);
      }
      return store;
    })().catch(err => {
      console.error(`[ratelimit] shared store unavailable, degrading to per-instance memory: ${err.message}`);
      return null;
    });
  }
  return storeP;
}

// Reads are EXPLICITLY strongly consistent per-operation, and the increment is
// a compare-and-swap loop, not a read-modify-write.
//
// Why: measured 2026-08-27, sequential requests from one stable IP against one
// bucket read back 3,2,2,1,1,2,3,0,4 instead of climbing 0..4 — writes were
// being lost. A limiter that loses increments does not limit. ETag conditional
// writes (onlyIfMatch / onlyIfNew) make the update atomic: if another
// invocation wrote first, our write is refused and we retry against the
// current value rather than clobbering it.
const CAS_ATTEMPTS = 5;

async function readEntry(store, key) {
  if (!store) return { hits: memory.get(key) || [], etag: null, exists: memory.has(key) };
  const r = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
  const hits = Array.isArray(r?.data?.hits) ? r.data.hits : [];
  return { hits, etag: r?.etag ?? null, exists: r != null };
}

/** @returns true if the write landed, false if another writer beat us. */
async function writeEntry(store, key, hits, { etag, exists }) {
  if (!store) { memory.set(key, hits); return true; }
  const opts = exists && etag ? { onlyIfMatch: etag } : { onlyIfNew: true };
  const res = await store.setJSON(key, { hits }, opts);
  // `modified: false` means the precondition failed — someone else wrote.
  return res?.modified !== false;
}

// --- decision ------------------------------------------------------------
/**
 * @returns {{allowed:boolean, retryAfter:number, scope:string|null, degraded:boolean}}
 */
export async function checkRate(subjects, now = Date.now()) {
  const entries = Object.entries(subjects).filter(([, v]) => v);
  if (!entries.length) return { allowed: true, retryAfter: 0, scope: null, degraded: false };

  const store = await blobStore();
  const degraded = store === null;

  // Hard fail-closed is opt-in. The default degrades to an in-memory window and
  // STILL ENFORCES: the check is never skipped, so this does not fail open.
  // Denying every signup during a store outage trades an abuse risk for a
  // revenue outage, which is the wrong trade to make silently on a lead form.
  if (degraded && STRICT) {
    return { allowed: false, retryAfter: 60, scope: 'store_unavailable', degraded: true };
  }

  for (const [kind, value] of entries) {
    const windows = LIMITS[kind];
    if (!windows) continue;
    const key = `${kind}:${hash(value)}`;
    const longest = Math.max(...windows.map(w => w.windowMs));

    let denied = null;
    let committed = false;

    for (let attempt = 0; attempt < CAS_ATTEMPTS && !committed; attempt++) {
      let entry;
      try {
        entry = await readEntry(store, key);
      } catch (err) {
        console.error(`[ratelimit] read failed for ${kind}: ${err.message}`);
        if (STRICT) return { allowed: false, retryAfter: 60, scope: 'store_error', degraded: true };
        entry = { hits: memory.get(key) || [], etag: null, exists: memory.has(key) };
      }

      const hits = entry.hits.filter(t => now - t < longest); // prune: keys stay bounded
      lastCount = hits.length; // TEMP diagnostic
      lastBackend = store ? 'blob' : 'mem'; // TEMP diagnostic

      // Over-limit is decided from the freshly-read value, so a losing CAS
      // simply re-reads and re-decides rather than admitting the request.
      denied = null;
      for (const w of windows) {
        const inWindow = hits.filter(t => now - t < w.windowMs);
        if (inWindow.length >= w.max) {
          const oldest = Math.min(...inWindow);
          denied = {
            allowed: false,
            retryAfter: Math.max(1, Math.ceil((w.windowMs - (now - oldest)) / 1000)),
            scope: w.label,
            degraded,
          };
          break;
        }
      }
      if (denied) break;

      hits.push(now);
      try {
        committed = await writeEntry(store, key, hits, entry);
      } catch (err) {
        console.error(`[ratelimit] write failed for ${kind}: ${err.message}`);
        memory.set(key, hits); // keep counting on this instance at least
        committed = true;
      }
    }

    if (denied) return denied;
    if (!committed) {
      // Sustained contention on one key is itself an abuse signal: many
      // simultaneous writers for the same subject. Refuse rather than admit an
      // uncounted request.
      console.warn(`[ratelimit] gave up after ${CAS_ATTEMPTS} CAS attempts for ${kind}`);
      return { allowed: false, retryAfter: 5, scope: `${kind}/contention`, degraded };
    }
  }

  return { allowed: true, retryAfter: 0, scope: null, degraded };
}

/** Netlify's real client IP; x-forwarded-for's first hop is the fallback. */
export function clientIp(headers = {}) {
  const h = k => headers[k] || headers[k.toLowerCase()] || headers[k.toUpperCase()] || '';
  const direct = h('x-nf-client-connection-ip');
  if (direct) return String(direct).trim();
  const fwd = String(h('x-forwarded-for') || '').split(',')[0].trim();
  return fwd || '';
}

/** Test seam — clears per-instance state and the memoised store handle. */
export function __resetForTests() {
  memory.clear();
  storeP = undefined;
}
