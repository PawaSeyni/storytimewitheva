// Layer 0.3 + 2.5 + 3.4 (headless): the lead-magnet registry is internally
// consistent and every asset it promises actually exists on disk.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseMagnets, EXPECTED_SLUGS, ROOT } from './_manifest.mjs';

const magnets = parseMagnets();
const pub = (p) => path.join(ROOT, 'public', p.replace(/^\//, ''));
const nonEmptyFile = (p) => existsSync(pub(p)) && statSync(pub(p)).size > 0;

test('all six expected magnets are registered', () => {
  assert.deepEqual(Object.keys(magnets).sort(), [...EXPECTED_SLUGS].sort());
});

// TEST 2.5 — every magnet shows the visitor a product shot. This is the guard
// for LP-001: parents-guide took 102/116 paid clicks with no preview and
// converted 0. Missing art must fail loudly, not degrade silently.
test('TEST 2.5 — every magnet has a preview image that exists on disk', () => {
  for (const [slug, m] of Object.entries(magnets)) {
    assert.ok(m.preview, `${slug} has no preview image (LP-001 regression)`);
    assert.ok(nonEmptyFile(m.preview), `${slug} preview file missing: ${m.preview}`);
  }
});

// TEST 0.3 — every magnet claims a PDF for en/es/fr and each file exists.
test('TEST 0.3 — every magnet has a non-empty PDF for en/es/fr', () => {
  for (const [slug, m] of Object.entries(magnets)) {
    for (const lang of ['en', 'es', 'fr']) {
      const p = m.pdf[lang];
      assert.ok(p, `${slug}.pdf.${lang} is not set`);
      assert.ok(nonEmptyFile(p), `${slug}.pdf.${lang} missing file: ${p}`);
    }
  }
});

// TEST 3.4 — the legacy slug must keep delivering the bundle. Published pins
// P-008/P-015 and FB-009/020/023 point at it and cannot be edited.
test('TEST 3.4 — bilingual-starter-kit maps to the bundle tag', () => {
  assert.equal(magnets['bilingual-starter-kit'].tag, 'bilingual-bundle');
  assert.equal(magnets['bilingual-bundle'].tag, 'bilingual-bundle');
});
