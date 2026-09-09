// S5-021 / S5-022: the event dictionary is the contract. Runtime taxonomy, call sites and the
// generated documentation must agree; required properties must be present at every call site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { ROOT } from '../funnel/_manifest.mjs';
import { loadEvents, loadFunnels } from '../../scripts/lib/catalog.mjs';

const { EVENTS, EVENT_BY_NAME, validateEvent, SCHEMA_VERSION } = await loadEvents();
const { FUNNELS, MIN_SAMPLE } = await loadFunnels();
const analyticsSrc = readFileSync(`${ROOT}/src/lib/analytics.ts`, 'utf8');
const runtimeEvents = [...analyticsSrc.matchAll(/^\s*\|\s*'([^']+)'/gm)].map((m) => m[1]);
const allowedProps = [...(/const ALLOWED_PROP_KEYS = \[([\s\S]*?)\] as const;/.exec(analyticsSrc)[1]).matchAll(/'([^']+)'/g)].map((m) => m[1]);

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = `${dir}/${f}`; return statSync(p).isDirectory() ? walk(p) : [p]; });
function callSites() {
  const out = [];
  for (const f of walk(`${ROOT}/src`).filter((f) => /\.tsx?$/.test(f) && !f.endsWith('analytics.ts'))) {
    const text = readFileSync(f, 'utf8');
    for (const m of text.matchAll(/track\(\s*'([^']+)'\s*(?:,\s*\{([\s\S]*?)\})?\s*\)/g)) {
      const keys = m[2] ? m[2].split(',').map((p) => p.split(':')[0].trim()).filter((k) => /^[a-zA-Z_]+$/.test(k)) : [];
      out.push({ file: f.replace(ROOT + '/', ''), event: m[1], keys });
    }
  }
  return out;
}

test('dictionary — every runtime event is defined, every defined non-reserved event exists at runtime', () => {
  assert.equal(SCHEMA_VERSION, 1);
  for (const e of runtimeEvents) assert.ok(EVENT_BY_NAME[e], `runtime event "${e}" missing from the dictionary`);
  for (const d of EVENTS) if (!d.reserved) assert.ok(runtimeEvents.includes(d.name), `dictionary event "${d.name}" not in FunnelEvent`);
});

test('dictionary — every required/optional property is on the allowlist; every event has owner, kind and privacy', () => {
  for (const d of EVENTS) {
    for (const k of [...d.required, ...d.optional]) assert.ok(allowedProps.includes(k), `${d.name}: "${k}" not allowlisted`);
    assert.ok(['intent', 'outcome', 'exposure', 'diagnostic'].includes(d.kind), d.name);
    assert.ok(d.owner && d.privacy, d.name);
  }
});

test('dictionary — every call site passes every required property as a literal key (S5-022)', () => {
  const sites = callSites();
  assert.ok(sites.length >= 30);
  for (const s of sites) {
    const d = EVENT_BY_NAME[s.event];
    assert.ok(d && !d.reserved, `${s.file}: ${s.event} undefined or reserved`);
    for (const r of d.required) assert.ok(s.keys.includes(r), `${s.file}: track('${s.event}') lacks required "${r}"`);
    for (const k of s.keys) assert.ok([...d.required, ...d.optional].includes(k), `${s.file}: track('${s.event}') passes "${k}", not declared for this event`);
  }
});

test('dictionary — validateEvent rejects missing, unknown and out-of-range values', () => {
  assert.deepEqual(validateEvent('Purchase Click', { book: 'x', destination: 'amazon', placement: 'detail', edition: 'fr' }), []);
  assert.ok(validateEvent('Purchase Click', { book: 'x', destination: 'amazon' }).some((p) => p.includes('missing required "placement"')));
  assert.ok(validateEvent('Purchase Click', { book: 'x', destination: 'ebay', placement: 'detail', edition: 'en' }).some((p) => p.includes('not in')));
  assert.ok(validateEvent('Book View', { book: 'x', email: 'a@b.c' }).some((p) => p.includes('unexpected property "email"')));
  assert.ok(validateEvent('Nope', {})[0].includes('unknown'));
  assert.ok(validateEvent('Edition Selected', { book: 'x', edition: 'en' })[0].includes('reserved'));
  assert.deepEqual(validateEvent('Book View', { book: 'x', utm_source: 'pinterest' }), [], 'UTMs are always allowed');
});

test('funnels — every step references a defined event; dimensions are allowlisted; each funnel states what it measures', () => {
  assert.ok(FUNNELS.length >= 8 && MIN_SAMPLE >= 30);
  for (const f of FUNNELS) {
    assert.ok(['intent', 'outcome'].includes(f.measures), f.id);
    for (const st of f.steps) {
      const d = EVENT_BY_NAME[st.event];
      assert.ok(d && !d.reserved, `${f.id}: step ${st.event}`);
      for (const [k, v] of Object.entries(st.where ?? {})) {
        assert.ok([...d.required, ...d.optional].includes(k), `${f.id}: filter key ${k} not on ${st.event}`);
        if (d.values?.[k]) assert.ok(d.values[k].includes(v), `${f.id}: ${st.event}.${k}=${v} not allowed`);
      }
    }
    for (const dim of f.dimensions) assert.ok(allowedProps.includes(dim) || dim.startsWith('utm_'), `${f.id}: dimension ${dim}`);
  }
});

test('dictionary — docs/analytics/EVENT_DICTIONARY.md is current (gen:events is a no-op)', () => {
  execSync('npm run --silent gen:events', { cwd: ROOT, stdio: 'pipe' });
  const diff = execSync('git status --porcelain docs/analytics/EVENT_DICTIONARY.md', { cwd: ROOT }).toString().trim();
  assert.equal(diff, '', 'run `npm run gen:events` and commit');
});
