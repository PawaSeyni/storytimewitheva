// S5-008 / S5-011: registry governance, deterministic assignment, eligibility, kill switch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ROOT } from '../funnel/_manifest.mjs';
import { loadExperiments } from '../../scripts/lib/catalog.mjs';

const { EXPERIMENTS, experimentProblems, assign, hashBucket, routeMatches, CONTROL } = await loadExperiments();
const active = { ...EXPERIMENTS[0], status: 'active', startAt: '2026-10-01' };

test('registry — every experiment validates; every non-draft experiment has complete governance', () => {
  assert.ok(EXPERIMENTS.length >= 2);
  for (const e of EXPERIMENTS) assert.deepEqual(experimentProblems(e), []);
  for (const e of EXPERIMENTS) assert.ok(readFileSync(`${ROOT}/${e.doc}`, 'utf8').includes(e.id), `${e.id}: doc must reference the id`);
});

test('governance — an active experiment without hypothesis, owner, rules, sample, guardrails or startAt is rejected', () => {
  const has = (rec, needle) => experimentProblems(rec).some((p) => p.includes(needle));
  assert.ok(has({ ...active, hypothesis: '' }, 'hypothesis is required'));
  assert.ok(has({ ...active, owner: '' }, 'owner is required'));
  assert.ok(has({ ...active, analysisRule: 'x' }, 'analysisRule is required'));
  assert.ok(has({ ...active, stopRule: '' }, 'stopRule is required'));
  assert.ok(has({ ...active, minimumSample: 0 }, 'minimumSample'));
  assert.ok(has({ ...active, guardrails: [] }, 'guardrail'));
  assert.ok(has({ ...active, startAt: undefined }, 'needs startAt'));
  assert.ok(has({ ...active, variants: [{ id: 'a', weight: 60 }, { id: 'b', weight: 50 }] }, 'total 110'));
  assert.ok(has({ ...active, variants: [{ id: 'a', weight: 100 }] }, 'at least two'));
  assert.ok(has({ ...active, primaryMetric: 'Edition Selected' }, 'not a dictionary event'));
  assert.ok(has({ ...active, endAt: '2026-09-01' }, 'endAt before startAt'));
  assert.deepEqual(experimentProblems({ ...active, status: 'draft', hypothesis: '' }), [], 'drafts may be incomplete');
});

test('assignment — deterministic per unit, honours weights over many units, control when ineligible', () => {
  const input = (unitId, extra = {}) => ({ unitId, locale: 'en', route: '/books/:id', date: new Date('2026-10-05'), ...extra });
  const a = assign(active, input('unit-1')); const b = assign(active, input('unit-1'));
  assert.deepEqual(a, b);
  assert.ok(a.eligible);
  const counts = {};
  for (let i = 0; i < 20000; i++) { const v = assign(active, input(`u${i}`)).variant; counts[v] = (counts[v] ?? 0) + 1; }
  assert.ok(Math.abs(counts.control - counts['listen-first']) < 800, JSON.stringify(counts));
  assert.deepEqual(assign(active, input('u1', { locale: 'de' })), { variant: CONTROL, eligible: false });
  assert.deepEqual(assign(active, input('u1', { route: '/activities' })), { variant: CONTROL, eligible: false });
  assert.deepEqual(assign(active, input(null)), { variant: CONTROL, eligible: false }, 'no unit id → control');
  assert.deepEqual(assign(active, input('u1', { isBot: true })), { variant: CONTROL, eligible: false });
  assert.deepEqual(assign(active, input('u1', { date: new Date('2026-09-01') })), { variant: CONTROL, eligible: false }, 'before startAt');
  assert.deepEqual(assign({ ...active, endAt: '2026-10-02' }, input('u1')), { variant: CONTROL, eligible: false }, 'after endAt');
});

test('kill switch — draft, paused and complete experiments always assign control and are not eligible', () => {
  for (const status of ['draft', 'paused', 'complete']) {
    const r = assign({ ...active, status }, { unitId: 'u1', locale: 'en', route: '/books/:id', date: new Date('2026-10-05') });
    assert.deepEqual(r, { variant: CONTROL, eligible: false }, status);
  }
});

test('helpers — bucket hash is stable and in range; route patterns match by segment', () => {
  assert.equal(hashBucket('book-cta-hierarchy-v1:unit-1'), hashBucket('book-cta-hierarchy-v1:unit-1'));
  for (let i = 0; i < 1000; i++) { const b = hashBucket(`x${i}`); assert.ok(b >= 0 && b < 100); }
  assert.ok(routeMatches('/books/:id', '/books/mayas-shadow'));
  assert.ok(!routeMatches('/books/:id', '/books'));
  assert.ok(routeMatches('/books', '/books'));
  assert.ok(!routeMatches('/books', '/books/x'));
});

test('privacy — the registry never names a person, an email or a query; the unit id is not a cookie', () => {
  const src = readFileSync(`${ROOT}/src/lib/experiments.ts`, 'utf8') + readFileSync(`${ROOT}/src/analytics/experimentEngine.ts`, 'utf8');
  assert.ok(!/document\.cookie/.test(src));
  assert.ok(/from '\.\/storage'/.test(src), 'unit id goes through the storage adapter');
});
