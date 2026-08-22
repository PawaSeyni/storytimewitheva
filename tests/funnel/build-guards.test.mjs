// Layer 0.5 + 0.2-proxy (headless): structural guards for two incidents.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { parseMagnets, parseLandingSlugs } from './_manifest.mjs';

// TEST 0.5 — no raw PDF URL is hard-coded anywhere it could be pasted into an
// ad. Guards the 2026-08-03 raw-PDF-destination incident (~CA$35, zero
// pageviews because a static PDF fires no analytics and has no form).
test('TEST 0.5 — no absolute storytimewitheva.com/*.pdf URL in shippable source', () => {
  let hits = '';
  try {
    // Grep app source + the built HTML entry; exclude the redirect map and
    // build scripts, which legitimately reference hashed PDF filenames.
    hits = execSync(
      `grep -rEn "https?://storytimewitheva\\.com/[^\"'\\s]+\\.pdf" src index.html netlify 2>/dev/null || true`,
      { cwd: process.cwd() }
    ).toString().trim();
  } catch { /* grep exit 1 = no matches */ }
  assert.equal(hits, '', `raw PDF campaign URL found:\n${hits}`);
});

// TEST 0.2 (proxy) — the prerender build aborts if a magnet has no landing
// page. The full abort is exercised by `npm run build` in CI; here we catch the
// divergence that would trigger it, faster: LEAD_MAGNETS slugs must equal
// LANDING_SLUGS in scripts/prerender.mjs.
test('TEST 0.2 — LEAD_MAGNETS and prerender LANDING_SLUGS are in sync', () => {
  const registered = Object.keys(parseMagnets()).sort();
  const landing = parseLandingSlugs().sort();
  assert.deepEqual(
    registered,
    landing,
    'LEAD_MAGNETS and LANDING_SLUGS diverged — `npm run build` would abort'
  );
});
