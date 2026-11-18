// Signup attribution (2026-11-18): a visitor who lands with utm_* tags and signs up on a later
// page must still be credited to the post that brought them in. src/lib/firstTouch.ts saves the
// first visit's tags in sessionStorage (no cookie) and EmailSignup falls back to them.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadFirstTouch } from '../../scripts/lib/catalog.mjs';

const ft = await loadFirstTouch();
const memory = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), m }; };
const PIN = '?utm_source=pinterest&utm_medium=social&utm_campaign=flashcards_fr&utm_content=P-111';
const PIN_TAGS = { utm_source: 'pinterest', utm_medium: 'social', utm_campaign: 'flashcards_fr', utm_content: 'P-111' };

test('landing with tags, signing up on a page without them: the first-touch tags are used', () => {
  const s = memory();
  ft.captureFirstTouch(s, PIN);                       // site loads on the pin's landing page
  assert.deepEqual(ft.resolveSignupUtm('', s), PIN_TAGS);            // signup on /books/, no query
  assert.deepEqual(ft.resolveSignupUtm('?lm=bilingual-bundle', s), PIN_TAGS); // other params only
});

test("the form page's own tags win over the saved ones", () => {
  const s = memory();
  ft.captureFirstTouch(s, PIN);
  assert.deepEqual(ft.resolveSignupUtm('?utm_source=facebook&utm_content=FB-047', s), { utm_source: 'facebook', utm_content: 'FB-047' });
});

test('first touch wins: a later landing with different tags does not overwrite it in the same tab', () => {
  const s = memory();
  ft.captureFirstTouch(s, PIN);
  ft.captureFirstTouch(s, '?utm_source=facebook&utm_content=FB-048');
  assert.deepEqual(ft.readFirstTouch(s), PIN_TAGS);
});

test('a first page without tags saves nothing, and a later tagged landing is still captured', () => {
  const s = memory();
  ft.captureFirstTouch(s, '');
  assert.equal(s.m.size, 0);
  ft.captureFirstTouch(s, PIN);
  assert.deepEqual(ft.readFirstTouch(s), PIN_TAGS);
});

test('only the four utm keys are kept, trimmed and capped at 120 characters', () => {
  const s = memory();
  ft.captureFirstTouch(s, `?utm_source=%20pinterest%20&utm_term=x&gclid=abc&email=a%40b.c&utm_content=${'x'.repeat(300)}`);
  const saved = ft.readFirstTouch(s);
  assert.deepEqual(Object.keys(saved).sort(), ['utm_content', 'utm_source']);
  assert.equal(saved.utm_source, 'pinterest');
  assert.equal(saved.utm_content.length, 120);
});

test('never throws: blocked storage, storage that throws, corrupt or hostile JSON', () => {
  const throwing = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.deepEqual(ft.captureFirstTouch(null, PIN), PIN_TAGS);
  assert.deepEqual(ft.captureFirstTouch(throwing, PIN), PIN_TAGS);
  assert.deepEqual(ft.resolveSignupUtm('', throwing), {});
  const s = memory();
  s.setItem(ft.FIRST_TOUCH_KEY, '{not json');
  assert.deepEqual(ft.readFirstTouch(s), {});
  s.setItem(ft.FIRST_TOUCH_KEY, JSON.stringify({ utm_source: 42, utm_medium: '', utm_campaign: ['x'], extra: 'y', utm_content: 'P-112' }));
  assert.deepEqual(ft.readFirstTouch(s), { utm_content: 'P-112' });
});

test('wired in: main.tsx captures at load, EmailSignup resolves through the fallback, no cookies', () => {
  const main = readFileSync(new URL('../../src/main.tsx', import.meta.url), 'utf8');
  const form = readFileSync(new URL('../../src/components/EmailSignup.tsx', import.meta.url), 'utf8');
  const mod = readFileSync(new URL('../../src/lib/firstTouch.ts', import.meta.url), 'utf8');
  assert.match(main, /captureFirstTouch\(sessionStore\(\), window\.location\.search\)/);
  assert.match(form, /resolveSignupUtm\(window\.location\.search, sessionStore\(\)\)/);
  assert.doesNotMatch(mod, /document\.cookie|localStorage/);
});
