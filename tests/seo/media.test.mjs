// S8-005 media integrity, on the prerendered dist and the deploy config.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((f) => f.endsWith('index.html'));

test('media — every <img> on every prerendered page has alt, width and height', () => {
  const bad = [];
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    for (const tag of h.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\balt=/.test(tag) || !/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) bad.push(`${path.relative(DIST, f)}: ${tag.slice(0, 90)}`);
    }
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} <img> without alt/width/height`);
});

test('media — campaign assets (/pins) are never referenced by a page', () => {
  for (const f of pages) assert.ok(!readFileSync(f, 'utf8').includes('/pins/'), `${path.relative(DIST, f)} references /pins/`);
});

test('media — every PDF behind a /download rule exists in dist and is content-hashed', () => {
  const rules = readFileSync(path.join(ROOT, 'public', '_redirects'), 'utf8');
  // Only the TARGET of a 302 rule is a served file; legacy raw-name rules are sources that 301 away.
  for (const line of rules.split('\n').filter((l) => /^\/download\/\S+.*\s302\s*$/.test(l))) {
    const target = line.trim().split(/\s+/).at(-2);
    assert.match(target, /^\/[^\s]+\.[0-9a-f]{6,}\.pdf$/, `${line}: target not a hashed pdf`);
    assert.ok(existsSync(path.join(DIST, target)), `${target}: missing from dist`);
  }
});

test('media — cache and security header rules are in netlify.toml', () => {
  const toml = readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  for (const [glob, value] of [['/assets/*', 'immutable'], ['/*.pdf', 'immutable'], ['/*.webp', 'must-revalidate'], ['/*.png', 'must-revalidate'], ['/version.json', 'no-store']]) {
    const block = toml.slice(toml.indexOf(`for = "${glob}"`));
    assert.ok(block.includes(value), `${glob}: expected Cache-Control with ${value}`);
  }
  assert.ok(toml.includes('Content-Security-Policy'), 'CSP header missing');
});

test('media — no audio files ship (read-aloud is Web Speech, by design)', () => {
  assert.deepEqual(walk(DIST).filter((f) => /\.(mp3|m4a|ogg|wav)$/.test(f)), []);
});
