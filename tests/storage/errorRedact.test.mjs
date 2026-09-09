// S8-012: an error report is an error class and a route pattern, nothing else.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadErrorRedact } from '../../scripts/lib/catalog.mjs';

const { redactKind, redactRoute, buildReport } = await loadErrorRedact();

test('kind — class name only; messages, stacks and odd names never pass through', () => {
  assert.equal(redactKind(new TypeError('x is not a function at https://evil.example?token=abc')), 'TypeError');
  assert.equal(redactKind(Object.assign(new Error('boom'), { name: 'ChunkLoadError' })), 'ChunkLoadError');
  assert.equal(redactKind(Object.assign(new Error('boom'), { name: 'Bad Name With Spaces email@x.com' })), 'UnknownError');
  assert.equal(redactKind('a thrown string with an email a@b.c'), 'StringThrown');
  assert.equal(redactKind(null), 'UnknownError');
  assert.equal(redactKind({ message: 'no name' }), 'UnknownError');
});

test('route — dynamic segments, query strings and hashes are removed; the language prefix stays', () => {
  assert.equal(redactRoute('/books/mayas-shadow'), '/books/:id');
  assert.equal(redactRoute('/fr/collections/back-to-school/?lm=parents-guide&utm_source=x'), '/fr/collections/:id');
  assert.equal(redactRoute('/es/free/classroom-pack#email-signup'), '/es/free/:id');
  assert.equal(redactRoute('/search?q=my%20child%20name'), '/search');
  assert.equal(redactRoute('/'), '/');
  assert.equal(redactRoute('/fr/'), '/fr');
  assert.equal(redactRoute('/journeys/kindness-that-shines/'), '/journeys/:id');
  assert.equal(redactRoute('/Weird%20Path/UPPER'), '/:x/:x');
});

test('report — exactly two keys, both safe', () => {
  const r = buildReport(new RangeError('bad'), '/es/books/leo-and-the-wolf?x=1');
  assert.deepEqual(Object.keys(r).sort(), ['kind', 'route']);
  assert.deepEqual(r, { kind: 'RangeError', route: '/es/books/:id' });
  for (const v of Object.values(r)) { assert.ok(!v.includes('@')); assert.ok(!v.includes('?')); assert.ok(!/leo/.test(v)); }
});
