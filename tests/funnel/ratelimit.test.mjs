// The in-function limiter is the control that actually runs, so unlike the
// platform rule it must be provable without deploying. These drive the real
// handler; Blobs is absent in the test env, so the limiter exercises its
// degraded in-memory path — which is exactly the path that must still ENFORCE.
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.MAILERLITE_API_KEY = 'test-key';
delete process.env.PINTEREST_CONVERSIONS_TOKEN;

const { handler } = await import('../../netlify/functions/subscribe.mjs');
const { __resetForTests, clientIp, checkRate } = await import('../../netlify/functions/_ratelimit.mjs');

const GROUPS_OK = { match: (u, m) => u.includes('/groups') && m === 'GET', ok: true, status: 200, data: { data: [{ id: 'G1', name: 'storytimewitheva-signups' }] } };
const SUBS_OK = { match: (u, m) => u.endsWith('/subscribers') && m === 'POST', ok: true, status: 201, data: { data: { id: 's1' } } };
function stubFetch(routes) {
  const calls = [];
  globalThis.fetch = async (url, opts = {}) => {
    const method = (opts.method || 'GET').toUpperCase();
    calls.push({ url, method });
    for (const r of routes) if (r.match(url, method)) return { ok: r.ok, status: r.status, json: async () => r.data ?? {} };
    throw new Error(`unexpected fetch: ${method} ${url}`);
  };
  return calls;
}
const post = (body, ip) => ({
  httpMethod: 'POST',
  headers: { 'content-type': 'application/json', ...(ip ? { 'x-nf-client-connection-ip': ip } : {}) },
  body: JSON.stringify(body),
});

test('RL1 — a single IP is blocked after the burst limit, with Retry-After', async () => {
  __resetForTests();
  stubFetch([GROUPS_OK, SUBS_OK]);
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const res = await handler(post({ email: `u${i}@example.com` }, '203.0.113.9'));
    codes.push(res.statusCode);
  }
  // Default burst is 5/60s: the first five pass, the rest are refused.
  assert.deepEqual(codes.slice(0, 5), [200, 200, 200, 200, 200], `expected 5 allowed, got ${codes}`);
  assert.ok(codes.slice(5).every(c => c === 429), `expected 429s after the limit, got ${codes}`);

  const blocked = await handler(post({ email: 'z@example.com' }, '203.0.113.9'));
  assert.equal(blocked.statusCode, 429);
  assert.ok(Number(blocked.headers['Retry-After']) > 0, 'Retry-After must be a positive number of seconds');
  assert.equal(JSON.parse(blocked.body).error, 'rate_limited');
});

test('RL2 — the limit is per-IP, so one abuser cannot lock out everyone else', async () => {
  __resetForTests();
  stubFetch([GROUPS_OK, SUBS_OK]);
  for (let i = 0; i < 6; i++) await handler(post({ email: `a${i}@example.com` }, '198.51.100.1'));
  const other = await handler(post({ email: 'innocent@example.com' }, '198.51.100.2'));
  assert.equal(other.statusCode, 200, 'a different IP must not inherit another IP\'s block');
});

test('RL3 — the same email is capped across DIFFERENT IPs', async () => {
  __resetForTests();
  stubFetch([GROUPS_OK, SUBS_OK]);
  const codes = [];
  for (let i = 0; i < 5; i++) {
    const res = await handler(post({ email: 'repeat@example.com' }, `192.0.2.${i + 1}`));
    codes.push(res.statusCode);
  }
  // Email cap is 3/hour and IP rotation must not defeat it.
  assert.deepEqual(codes.slice(0, 3), [200, 200, 200], `expected 3 allowed, got ${codes}`);
  assert.ok(codes.slice(3).every(c => c === 429), `IP rotation must not bypass the email cap, got ${codes}`);
});

test('RL4 — a blocked request never reaches MailerLite', async () => {
  __resetForTests();
  const calls = stubFetch([GROUPS_OK, SUBS_OK]);
  for (let i = 0; i < 5; i++) await handler(post({ email: `w${i}@example.com` }, '203.0.113.77'));
  const before = calls.filter(c => c.url.endsWith('/subscribers')).length;
  const res = await handler(post({ email: 'blocked@example.com' }, '203.0.113.77'));
  assert.equal(res.statusCode, 429);
  const after = calls.filter(c => c.url.endsWith('/subscribers')).length;
  assert.equal(after, before, 'a rate-limited request must not write to MailerLite');
});

test('RL5 — the limiter enforces even with no shared store (degraded path)', async () => {
  __resetForTests();
  // No Blobs is configured in tests, so this IS the degraded path. It must
  // still refuse: degrading must never mean failing open.
  const r = [];
  for (let i = 0; i < 7; i++) r.push(await checkRate({ ip: '203.0.113.200' }));
  assert.ok(r[0].allowed, 'first request should pass');
  assert.ok(r.some(x => !x.allowed), 'degraded limiter must still block');
  assert.ok(r.every(x => x.degraded), 'degraded flag should be set when no store is available');
});

test('RL6 — clientIp prefers Netlify\'s header, falls back to x-forwarded-for', () => {
  assert.equal(clientIp({ 'x-nf-client-connection-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }), '1.1.1.1');
  assert.equal(clientIp({ 'x-forwarded-for': '2.2.2.2, 3.3.3.3' }), '2.2.2.2');
  assert.equal(clientIp({}), '');
});
