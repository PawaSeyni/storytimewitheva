// S8-013 security assertions on the prerendered output and deploy config.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((f) => f.endsWith('index.html') || f.endsWith('404.html'));
const rel = (f) => path.relative(DIST, f);

test('security — every target=_blank link carries rel=noopener', () => {
  const bad = [];
  for (const f of pages) for (const a of readFileSync(f, 'utf8').match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) if (!/rel="[^"]*noopener/.test(a)) bad.push(`${rel(f)}: ${a.slice(0, 80)}`);
  assert.deepEqual(bad.slice(0, 5), [], `${bad.length} external links without noopener`);
});

test('security — no http:// resource on any page (no mixed content)', () => {
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    const refs = [...h.matchAll(/(?:src|href)="(http:\/\/[^"]+)"/g)].map((m) => m[1]).filter((u) => !/^http:\/\/(www\.w3\.org|schema\.org|localhost)/.test(u));
    assert.deepEqual(refs, [], `${rel(f)}: insecure references`);
  }
});

test('security — React pages have no inline event handlers (CSP could drop unsafe-inline for the SPA)', () => {
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    assert.ok(!/\son(click|load|error|mouseover)="/i.test(h), `${rel(f)}: inline handler`);
  }
});

test('security — external hosts on pages are exactly the inventoried ones', () => {
  const allowed = new Set(['storytimewitheva.com', 'www.amazon.com', 'm.media-amazon.com', 'plausible.io', 'schema.org', 'www.w3.org', 'www.instagram.com', 'www.tiktok.com', 'www.threads.com', 'www.pinterest.com', 'www.youtube.com', 'www.facebook.com', 'fonts.googleapis.com']);
  const seen = new Set();
  for (const f of pages) for (const m of readFileSync(f, 'utf8').matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) seen.add(m[1]);
  const extra = [...seen].filter((h) => !allowed.has(h) && !h.endsWith('.netlify.app'));
  assert.deepEqual(extra, [], 'new external host: add it to docs/platform/EXTERNAL_DATA_FLOWS.md and the CSP first');
});

test('security — headers block: CSP, HSTS-compatible, no-sniff, frame denial, referrer and permissions policies', () => {
  const toml = readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  for (const h of ['Content-Security-Policy', 'X-Content-Type-Options = "nosniff"', 'X-Frame-Options = "DENY"', 'Referrer-Policy', 'Permissions-Policy']) assert.ok(toml.includes(h), `${h} missing`);
  assert.ok(/frame-ancestors 'none'/.test(toml) && /object-src 'none'/.test(toml) && /base-uri 'self'/.test(toml));
});
