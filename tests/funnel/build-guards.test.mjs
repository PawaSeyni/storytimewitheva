// Layer 0.5 + 0.2-proxy (headless): structural guards for two incidents.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

// TEST 0.7 — the deploy-provenance chain stays wired. dist/version.json is what
// makes "is commit X actually in production?" answerable from production rather
// than from the Netlify dashboard; the no-store header is what stops a cached
// copy from answering with the PREVIOUS deploy's SHA. Both are easy to drop by
// accident while editing the build, and neither failure is visible at runtime,
// so guard them structurally. (Missing SHA at build time is fatal inside
// scripts/gen-version.mjs itself — that path needs no test here.)
test('TEST 0.7 — build stamps deploy provenance and serves it uncached', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(
    pkg.scripts.build,
    /gen:version/,
    'npm run build must run gen:version, or deploys ship with no provenance'
  );
  // Order matters: vite build wipes dist/, so a stamp written before it is lost.
  assert.ok(
    pkg.scripts.build.indexOf('vite build') < pkg.scripts.build.indexOf('gen:version'),
    'gen:version must run AFTER vite build (which wipes dist/)'
  );

  const toml = readFileSync('netlify.toml', 'utf8');
  const rule = toml.split('[[headers]]').find((b) => b.includes('for = "/version.json"'));
  assert.ok(rule, 'netlify.toml needs a [[headers]] rule for /version.json');
  assert.match(rule, /no-store/, '/version.json must be served no-store');
});
