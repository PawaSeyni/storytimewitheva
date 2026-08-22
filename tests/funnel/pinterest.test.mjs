// Layer 4.5 (server-side variant) — Pinterest Conversions API. Because TAG-001
// shipped as a privacy-first server-side integration (no browser pintrk), the
// 4.5 assertions live here against netlify/functions/_pinterest.mjs rather than
// in the browser analytics spec: the signup event fires, it NEVER carries a raw
// email, and it is gated on configuration.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildSignupEvent, hashEmail, sendSignupConversion } from '../../netlify/functions/_pinterest.mjs';

const RAW_EMAIL = 'Jane.Secret@Example.com';
const EXPECTED_HASH = createHash('sha256').update('jane.secret@example.com').digest('hex');

test('hashEmail normalises (trim + lowercase) before hashing', () => {
  assert.equal(hashEmail('  Jane.Secret@Example.com '), EXPECTED_HASH);
  assert.equal(hashEmail('jane.secret@example.com'), EXPECTED_HASH);
});

test('4.5b — buildSignupEvent produces a signup event carrying the magnet', () => {
  const ev = buildSignupEvent({ email: RAW_EMAIL, leadMagnet: 'parents-guide', eventId: 'id-1', eventTime: 1000 });
  assert.equal(ev.event_name, 'signup');
  assert.equal(ev.action_source, 'web');
  assert.equal(ev.custom_data.content_category, 'parents-guide');
  assert.deepEqual(ev.custom_data.content_ids, ['parents-guide']);
  assert.deepEqual(ev.user_data.em, [EXPECTED_HASH]);
});

test('4.5d — the event NEVER contains the raw email or name (only the hash)', () => {
  const ev = buildSignupEvent({
    email: RAW_EMAIL,
    leadMagnet: 'bedtime-routine',
    eventId: 'id-2',
    eventTime: 2000,
    clientIp: '203.0.113.9',
    userAgent: 'Mozilla/5.0',
  });
  const blob = JSON.stringify(ev).toLowerCase();
  assert.ok(!blob.includes('jane.secret@example.com'), 'raw email leaked');
  assert.ok(!blob.includes('jane secret'), 'name leaked');
  assert.ok(blob.includes(EXPECTED_HASH), 'hashed em missing');
});

test('sendSignupConversion is skipped (never sent) when no token is configured', async () => {
  const prev = process.env.PINTEREST_CONVERSIONS_TOKEN;
  delete process.env.PINTEREST_CONVERSIONS_TOKEN;
  let called = false;
  const res = await sendSignupConversion(
    { email: RAW_EMAIL, leadMagnet: 'parents-guide' },
    { fetchImpl: async () => { called = true; return { ok: true, json: async () => ({}) }; } }
  );
  if (prev !== undefined) process.env.PINTEREST_CONVERSIONS_TOKEN = prev;
  assert.equal(res.skipped, true);
  assert.equal(called, false, 'must not call Pinterest without a token');
});

test('sendSignupConversion POSTs a bearer-authed signup with the hashed email only', async () => {
  const prev = process.env.PINTEREST_CONVERSIONS_TOKEN;
  process.env.PINTEREST_CONVERSIONS_TOKEN = 'test-token';
  process.env.PINTEREST_AD_ACCOUNT_ID = '549770651316';
  let captured = null;
  const res = await sendSignupConversion(
    { email: RAW_EMAIL, leadMagnet: 'parents-guide', clientIp: '203.0.113.9', userAgent: 'UA' },
    {
      fetchImpl: async (url, opts) => {
        captured = { url, opts };
        return { ok: true, status: 200, json: async () => ({ num_events_received: 1 }) };
      },
      now: () => 5_000_000,
      uuid: () => 'evt-123',
    }
  );
  if (prev !== undefined) process.env.PINTEREST_CONVERSIONS_TOKEN = prev;
  else delete process.env.PINTEREST_CONVERSIONS_TOKEN;

  assert.equal(res.ok, true);
  assert.match(captured.url, /\/v5\/ad_accounts\/549770651316\/events$/);
  assert.equal(captured.opts.headers.Authorization, 'Bearer test-token');
  const sent = JSON.parse(captured.opts.body);
  assert.equal(sent.data[0].event_name, 'signup');
  assert.equal(sent.data[0].event_time, 5000); // ms → s
  assert.deepEqual(sent.data[0].user_data.em, [EXPECTED_HASH]);
  assert.ok(!captured.opts.body.toLowerCase().includes('jane.secret@example.com'), 'raw email in request body');
});
