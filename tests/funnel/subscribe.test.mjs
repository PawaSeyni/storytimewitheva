// Remediation coverage for netlify/functions/subscribe.mjs:
//   #2 group is mandatory — a group-resolution failure must NOT create an
//      ungrouped subscriber (who would never enter the welcome automation).
//   #1 anti-abuse — honeypot + origin check reject/short-circuit before any
//      MailerLite write.
// Drives the real handler with a stubbed global fetch; nothing real is called.
//
// Test ORDER matters: subscribe.mjs caches the resolved group id in module
// scope, so the group-FAILURE case must run before any case that resolves it.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.MAILERLITE_API_KEY = 'test-key';
delete process.env.PINTEREST_CONVERSIONS_TOKEN; // keep the conversion call skipped

const { handler } = await import('../../netlify/functions/subscribe.mjs');

function stubFetch(routes) {
  const calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const method = (opts.method || 'GET').toUpperCase();
    calls.push({ url, method, body: opts.body });
    for (const r of routes) {
      if (r.match(url, method)) return { ok: r.ok, status: r.status, json: async () => r.data ?? {} };
    }
    throw new Error(`unexpected fetch: ${method} ${url}`);
  };
  return calls;
}
const jsonEvent = (body, headers = {}) => ({
  httpMethod: 'POST',
  headers: { 'content-type': 'application/json', ...headers },
  body: JSON.stringify(body),
});
const GROUPS_OK = { match: (u, m) => u.includes('/groups') && m === 'GET', ok: true, status: 200, data: { data: [{ id: 'G1', name: 'storytimewitheva-signups' }] } };
const SUBS_OK = { match: (u, m) => u.endsWith('/subscribers') && m === 'POST', ok: true, status: 201, data: { data: { id: 's1' } } };

test('#1 honeypot: a filled `company` field returns success but writes nothing', async () => {
  const calls = stubFetch([]); // any fetch would throw
  const res = await handler(jsonEvent({ email: 'bot@example.com', company: 'Acme Bots Inc' }));
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body).ok, true);
  assert.equal(calls.length, 0, 'MailerLite must not be called for a honeypot hit');
});

test('#1 origin: a foreign Origin is rejected with 403 before any write', async () => {
  const calls = stubFetch([]);
  const res = await handler(jsonEvent({ email: 'x@example.com' }, { origin: 'https://evil.example' }));
  assert.equal(res.statusCode, 403);
  assert.equal(calls.length, 0);
});

// Runs while the group cache is still empty.
test('#2 group lookup failure → 503 and NO subscriber is created', async () => {
  const calls = stubFetch([{ match: (u, m) => u.includes('/groups') && m === 'GET', ok: false, status: 500, data: {} }]);
  const res = await handler(jsonEvent({ email: 'nogroup@example.com' }));
  assert.equal(res.statusCode, 503);
  assert.equal(JSON.parse(res.body).error, 'group_unavailable');
  assert.ok(!calls.some((c) => c.url.endsWith('/subscribers') && c.method === 'POST'), 'must NOT create a subscriber when the group is unresolved');
});

test('#1 origin: our own Origin is allowed and the signup proceeds', async () => {
  const calls = stubFetch([GROUPS_OK, SUBS_OK]);
  const res = await handler(jsonEvent({ email: 'ok@example.com' }, { origin: 'https://storytimewitheva.com' }));
  assert.equal(res.statusCode, 200);
  assert.ok(calls.some((c) => c.url.endsWith('/subscribers') && c.method === 'POST'));
});

test('#2 happy path: subscriber is created WITH the resolved group', async () => {
  let postBody = null;
  stubFetch([GROUPS_OK, SUBS_OK]);
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (url.endsWith('/subscribers') && (opts?.method || '').toUpperCase() === 'POST') postBody = JSON.parse(opts.body);
    return realFetch(url, opts);
  };
  const res = await handler(jsonEvent({ email: 'real@example.com', lead_magnet: 'parents-guide' }));
  const out = JSON.parse(res.body);
  assert.equal(res.statusCode, 200);
  assert.equal(out.ok, true);
  assert.equal(out.grouped, true);
  assert.deepEqual(postBody.groups, ['G1'], 'subscriber must carry the group');
});
