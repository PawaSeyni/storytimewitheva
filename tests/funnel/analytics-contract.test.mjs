// Analytics contract (Sprint 4 S4-015, Sprint 6 S6-014).
//
// Two guarantees, both checked against the REAL source rather than described:
//   1. Every track() call site in src/ uses an event name declared in FunnelEvent and
//      only property keys declared in ALLOWED_PROP_KEYS. A typo or a new dimension that
//      skipped the allowlist fails CI instead of being silently dropped in production
//      (which is what the runtime filter would do — correct, but invisible).
//   2. The runtime filter really is default-deny: unknown keys and non-primitive values
//      are stripped, so a call site can never leak the library or a preferences bundle.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { build } from 'esbuild';

const src = readFileSync('src/lib/analytics.ts', 'utf8');
const events = [...src.matchAll(/^\s*\|\s*'([^']+)'/gm)].map((m) => m[1]);
const propsBlock = /const ALLOWED_PROP_KEYS = \[([\s\S]*?)\] as const;/.exec(src)[1];
const allowedProps = [...propsBlock.matchAll(/'([^']+)'/g)].map((m) => m[1]);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = `${dir}/${f}`;
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

/** Every track('Event', { ...props }) call in src/, with its literal prop keys. */
function callSites() {
  const out = [];
  for (const f of walk('src').filter((f) => /\.tsx?$/.test(f) && !f.endsWith('analytics.ts'))) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/track\(\s*'([^']+)'\s*(?:,\s*\{([\s\S]*?)\})?\s*\)/g)) {
      // Split the object literal on commas and take the text before each colon. A
      // shorthand property ({ language }) has no colon, so the whole part is the key.
      // Values are never inspected, so `activity: slug` yields "activity", not "slug".
      const keys = m[2]
        ? m[2].split(',').map((part) => part.split(':')[0].trim()).filter((k) => /^[a-zA-Z_]+$/.test(k))
        : [];
      out.push({ file: f, event: m[1], keys });
    }
  }
  return out;
}

test('analytics — the declared taxonomy was parsed', () => {
  assert.ok(events.includes('Book View') && events.includes('Library Status'), `events parsed: ${events}`);
  assert.ok(allowedProps.includes('book') && allowedProps.includes('reason'), `props parsed: ${allowedProps}`);
});

test('analytics — every call site uses a declared event name', () => {
  const sites = callSites();
  assert.ok(sites.length >= 20, `expected many call sites, found ${sites.length}`);
  for (const s of sites) {
    assert.ok(events.includes(s.event), `${s.file}: track('${s.event}') is not in FunnelEvent`);
  }
});

test('analytics — every call site uses only allowlisted property keys', () => {
  for (const s of callSites()) {
    for (const k of s.keys) {
      assert.ok(allowedProps.includes(k), `${s.file}: track('${s.event}') passes "${k}", which is not in ALLOWED_PROP_KEYS`);
    }
  }
});

test('analytics — no call site passes a library, preferences or free-text payload', () => {
  const forbidden = ['library', 'preferences', 'email', 'name', 'note', 'thoughts', 'childName'];
  for (const s of callSites()) {
    for (const k of s.keys) assert.ok(!forbidden.includes(k), `${s.file}: forbidden key "${k}"`);
  }
});

test('analytics — the runtime filter is default-deny', async () => {
  const bundle = await build({
    entryPoints: ['src/lib/analytics.ts'],
    bundle: true, format: 'esm', platform: 'neutral', write: false, logLevel: 'silent',
  });
  const { sanitizeProps } = await import(
    `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
  );
  const out = sanitizeProps({
    book: 'mayas-shadow',
    status: 'read',
    library: { 'mayas-shadow': { status: 'read' } }, // an object, and not allowlisted
    email: 'someone@example.com',                      // not allowlisted
    reason: ['editorial'],                             // allowlisted key, but not primitive
    utm_source: 'pinterest',
  });
  assert.deepEqual(out, { book: 'mayas-shadow', status: 'read', utm_source: 'pinterest' });
});
