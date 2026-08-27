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

async function blobStore() {
  if (storeP === undefined) {
    storeP = (async () => {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore({ name: STORE_NAME, consistency: 'strong' });
      await store.get('__probe__'); // fail fast here rather than mid-decision
      return store;
    })().catch(err => {
      console.error(`[ratelimit] shared store unavailable, degrading to per-instance memory: ${err.message}`);
      return null;
    });
  }
  return storeP;
}

async function readHits(store, key) {
  if (!store) return memory.get(key) || [];
  const v = await store.get(key, { type: 'json' });
  return Array.isArray(v?.hits) ? v.hits : [];
}
async function writeHits(store, key, hits) {
  if (!store) { memory.set(key, hits); return; }
  await store.setJSON(key, { hits });
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

    let hits;
    try {
      hits = await readHits(store, key);
    } catch (err) {
      console.error(`[ratelimit] read failed for ${kind}: ${err.message}`);
      if (STRICT) return { allowed: false, retryAfter: 60, scope: 'store_error', degraded: true };
      hits = memory.get(key) || [];
    }

    hits = hits.filter(t => now - t < longest); // prune as we go: keys stay bounded

    for (const w of windows) {
      const inWindow = hits.filter(t => now - t < w.windowMs);
      if (inWindow.length >= w.max) {
        const oldest = Math.min(...inWindow);
        return {
          allowed: false,
          retryAfter: Math.max(1, Math.ceil((w.windowMs - (now - oldest)) / 1000)),
          scope: w.label,
          degraded,
        };
      }
    }

    hits.push(now);
    try {
      await writeHits(store, key, hits);
    } catch (err) {
      // A failed write under-counts; it must not reject a request we already
      // decided to allow. Mirror into memory so the instance still counts.
      console.error(`[ratelimit] write failed for ${kind}: ${err.message}`);
      memory.set(key, hits);
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
