// S8-012: an error report is an error class and a route pattern, plus (2026-11) a redacted
// message, the script file name and line:col. Nothing that can quote a visitor or their data.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadErrorRedact } from '../../scripts/lib/catalog.mjs';

const { redactKind, redactRoute, redactMessage, redactSource, topFrame, buildReport } = await loadErrorRedact();

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

test('report — only the five allowed keys, all strings, none carrying data', () => {
  const r = buildReport(new RangeError('bad'), '/es/books/leo-and-the-wolf?x=1');
  assert.deepEqual(r.kind, 'RangeError');
  assert.deepEqual(r.route, '/es/books/:id');
  assert.equal(r.message, 'bad');
  const err = new TypeError("Cannot read properties of null (reading 'x') at https://evil.example/a.js?token=abc for a@b.co");
  err.stack = 'TypeError: boom\n    at f (https://storytimewitheva.com/assets/index-BrTaYYlY.js?v=1:10:4821)\n    at g (https://storytimewitheva.com/assets/x.js:1:1)';
  const full = buildReport(err, '/es/books/leo-and-the-wolf?email=a@b.co');
  for (const k of Object.keys(full)) assert.ok(['kind', 'route', 'message', 'source', 'line'].includes(k), k);
  assert.deepEqual(full, {
    kind: 'TypeError',
    route: '/es/books/:id',
    message: "Cannot read properties of null (reading 'x') at <url> for <email>",
    source: 'index-BrTaYYlY.js',
    line: '10:4821',
  });
  for (const v of Object.values(full)) {
    assert.equal(typeof v, 'string');
    assert.ok(!v.includes('@') && !v.includes('?') && !/https?:|token|leo|storytimewitheva/.test(v), v);
  }
});

test('message — URLs, emails, quoted input, long numbers and query are removed; capped at 120', () => {
  assert.equal(redactMessage("Cannot read properties of undefined (reading 'addEventListener')"), "Cannot read properties of undefined (reading 'addEventListener')");
  assert.equal(redactMessage('Failed to fetch dynamically imported module: https://storytimewitheva.com/assets/DemoPage-Ddl9ZUGB.js'), 'Failed to fetch dynamically imported module: <url>');
  assert.equal(redactMessage('Unexpected token \'h\', "hello my name is Ana" is not valid JSON'), 'Unexpected token \'h\', "…" is not valid JSON');
  assert.equal(redactMessage('order 1234 for user 5551234567 failed'), 'order 1234 for user <n> failed');
  assert.equal(redactMessage('bad lookup?q=my child name'), 'bad lookup');
  assert.equal(redactMessage('contact jane.doe+kid@example.org now'), 'contact <email> now');
  assert.equal(redactMessage('see www.example.com/x for more'), 'see <url> for more');
  assert.equal(redactMessage('chrome-extension://abcdef/content.js threw'), '<url> threw');
  assert.equal(redactMessage('  spaced \n\t out  '), 'spaced out');
  const long = redactMessage('x'.repeat(500));
  assert.equal(long.length, 120);
  assert.ok(long.endsWith('…'));
  assert.equal(redactMessage(undefined), '');
  assert.equal(redactMessage({ toString: () => 'a@b.co' }), '');
  // a thrown string is redacted the same way and keeps kind StringThrown
  assert.deepEqual(buildReport('lost https://x.y/?a=1 a@b.co', '/'), { kind: 'StringThrown', route: '/', message: 'lost <url> <email>' });
});

test('source — file name only; inline, injected and document locations are "page"', () => {
  assert.equal(redactSource('https://storytimewitheva.com/assets/index-BrTaYYlY.js?v=2#x'), 'index-BrTaYYlY.js');
  assert.equal(redactSource('https://plausible.io/js/pa-gzJ4DP5LRQ39ZXessq04G.js'), 'pa-gzJ4DP5LRQ39ZXessq04G.js');
  assert.equal(redactSource('chrome-extension://abc/inject/content.mjs'), 'content.mjs');
  assert.equal(redactSource('https://storytimewitheva.com/books/mayas-shadow?email=a@b.co'), 'page');
  assert.equal(redactSource('https://storytimewitheva.com/'), 'page');
  assert.equal(redactSource(''), '');
  assert.equal(redactSource(undefined), '');
});

test('line — from the stack top frame (V8 and JavaScriptCore), else the ErrorEvent position', () => {
  assert.deepEqual(topFrame('TypeError: x\n    at a (https://s.com/assets/index-1.js:10:4821)'), { url: 'https://s.com/assets/index-1.js', line: 10, col: 4821 });
  assert.deepEqual(topFrame('a@https://s.com/assets/index-1.js:10:77\nb@https://s.com/assets/c.js:1:2'), { url: 'https://s.com/assets/index-1.js', line: 10, col: 77 });
  assert.equal(topFrame('no frames here'), null);
  const noStack = new TypeError('t');
  noStack.stack = undefined;
  assert.deepEqual(buildReport(noStack, '/', { filename: 'https://s.com/assets/index-1.js', lineno: 10, colno: 9 }), { kind: 'TypeError', route: '/', message: 't', source: 'index-1.js', line: '10:9' });
  assert.deepEqual(buildReport(noStack, '/', { filename: 'https://s.com/', lineno: 3, colno: 0 }), { kind: 'TypeError', route: '/', message: 't', source: 'page', line: '3' });
  assert.deepEqual(buildReport(noStack, '/', {}), { kind: 'TypeError', route: '/', message: 't' });
});
