// Layer 0.4 (headless): the committed public/_redirects is current and covers
// every magnet. Guards the download-hash-rot incident class — a rebuilt PDF
// whose new hash never made it into the stable /download/ links.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';

const redirectsPath = path.join(ROOT, 'public', '_redirects');

// Magnet slugs derived from the actual PDFs on disk (self-validating).
function magnetSlugsFromPdfs() {
  const slugs = new Set();
  for (const f of readdirSync(path.join(ROOT, 'public')).filter((x) => x.endsWith('.pdf'))) {
    const m = f.match(/^(.+?)(?:-(?:es|fr))?\.[0-9a-f]{6,}\.pdf$/);
    if (m) slugs.add(m[1]);
  }
  return [...slugs];
}

test('TEST 0.4 — committed public/_redirects is current (gen:downloads is a no-op)', () => {
  execSync('npm run --silent gen:downloads', { cwd: ROOT, stdio: 'pipe' });
  const diff = execSync('git status --porcelain public/_redirects', { cwd: ROOT }).toString().trim();
  assert.equal(diff, '', 'public/_redirects is stale — run `npm run gen:downloads` and commit');
});

test('TEST 0.4 — every magnet has a /download/ rule pointing at a real PDF', () => {
  const body = readFileSync(redirectsPath, 'utf8');
  for (const slug of magnetSlugsFromPdfs()) {
    const line = new RegExp(`^/download/${slug}\\s`, 'm');
    assert.ok(line.test(body), `no /download/${slug} rule in _redirects`);
  }
  // Every redirect target file must exist (the anti-rot assertion).
  for (const m of body.matchAll(/\s(\/[^\s]+\.pdf)\s+302/g)) {
    const target = m[1].split('?')[0];
    const abs = path.join(ROOT, 'public', target.replace(/^\//, ''));
    assert.ok(existsSync(abs) && statSync(abs).size > 0, `redirect target missing: ${target}`);
  }
});

// Guards the specific incident found 2026-08-25: a pin created before PDFs were
// hash-gated (2026-08-04) still pointed at the raw, un-hashed filename and 404'd
// for months instead of ever reaching the signup. Any pin/ad still using an old
// raw filename must land on the gated offer page, never a 404 and never a bare
// PDF (a visitor here has not opted in yet).
test('TEST 0.4 — legacy raw PDF filenames redirect to the gated offer page, not 404 or a bare PDF', () => {
  const body = readFileSync(redirectsPath, 'utf8');
  const langSuffix = { en: '', es: '-es', fr: '-fr' };
  const langPrefix = { en: '', es: '/es', fr: '/fr' };
  for (const f of readdirSync(path.join(ROOT, 'public')).filter((x) => x.endsWith('.pdf'))) {
    const m = f.match(/^(.+?)(?:-(es|fr))?\.[0-9a-f]{6,}\.pdf$/);
    if (!m) continue;
    const [, magnet, lang = 'en'] = m;
    const legacyPath = `/${magnet}${langSuffix[lang]}.pdf`;
    const target = `${langPrefix[lang]}/?lm=${magnet}#email-signup`;
    const line = new RegExp(`^${legacyPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+301\\s*$`, 'm');
    assert.ok(line.test(body), `no legacy-safety-net redirect for ${legacyPath} -> ${target}`);
  }
});
