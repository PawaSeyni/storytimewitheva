// Layer 4 — Plausible funnel events. analytics.ts short-circuits when
// navigator.webdriver is true, so to test that events fire we present as a real
// user; to test that they DON'T fire on the prerender crawler we leave
// webdriver true. Either way we stub window.plausible and assert on the stub,
// never on real network — do not "fix" the webdriver check to make this pass.
import { test, expect, type Page } from '@playwright/test';

const SUBSCRIBE = '**/.netlify/functions/subscribe';

async function installPlausibleStub(page: Page, { realUser }: { realUser: boolean }) {
  await page.addInitScript((realUser) => {
    // @ts-expect-error test shim
    window.__ev = [];
    const fn = (e: string, o?: { props?: Record<string, unknown> }) => {
      // @ts-expect-error test shim
      window.__ev.push({ e, props: o?.props ?? {} });
    };
    // @ts-expect-error test shim
    fn.init = () => {};
    // @ts-expect-error test shim
    fn.q = [];
    // @ts-expect-error test shim
    window.plausible = fn;
    if (realUser) Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
  }, realUser);
  await page.route(/plausible\.io/, (r) => r.abort());
}

const readEvents = (page: Page) =>
  page.evaluate(() => (window as unknown as { __ev: { e: string; props: Record<string, unknown> }[] }).__ev);

test('4.1 the full happy path fires the funnel events in order', async ({ page }) => {
  await installPlausibleStub(page, { realUser: true });
  await page.route(SUBSCRIBE, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );

  await page.goto('/free/bedtime-routine?utm_source=pinterest&utm_medium=paid_social&utm_campaign=bedtime_en&utm_content=P-001');
  await page.fill('#email-signup input[name="name"]', 'Test Person'); // focus → Form Start
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
  await expect(page.locator('[role="status"]')).toBeVisible();
  await page.click('#email-signup a[download]'); // → Magnet Download

  const names = (await readEvents(page)).map((x) => x.e);
  const order = ['Landing View', 'Form View', 'Form Start', 'Form Submit', 'Lead Created', 'Magnet Download'];
  const idx = order.map((n) => names.indexOf(n));
  for (const [i, n] of order.entries()) expect(idx[i], `${n} fired`).toBeGreaterThanOrEqual(0);
  for (let i = 1; i < idx.length; i++) expect(idx[i], `${order[i]} after ${order[i - 1]}`).toBeGreaterThan(idx[i - 1]);
  // exactly once each
  for (const n of order) expect(names.filter((x) => x === n).length, `${n} once`).toBe(1);
});

test('4.2/4.3 events carry UTMs + lead_magnet and NEVER carry PII', async ({ page }) => {
  await installPlausibleStub(page, { realUser: true });
  await page.route(SUBSCRIBE, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );
  await page.goto('/free/parents-guide?utm_source=pinterest&utm_medium=paid_social&utm_campaign=parents-guide_en_us&utm_content=P-014');
  await page.fill('#email-signup input[name="name"]', 'Jane Secret');
  await page.fill('#email-signup input[name="email"]', 'jane.secret@example.com');
  await page.click('#email-signup button[type="submit"]');
  await expect(page.locator('[role="status"]')).toBeVisible();

  const events = await readEvents(page);
  const lead = events.find((e) => e.e === 'Lead Created');
  expect(lead?.props.lead_magnet).toBe('parents-guide');
  expect(lead?.props.utm_campaign).toBe('parents-guide_en_us');

  const blob = JSON.stringify(events).toLowerCase();
  expect(blob).not.toContain('jane.secret@example.com');
  expect(blob).not.toContain('jane secret');

  // Default-deny: every prop key on every event must be in the analytics
  // allowlist (approved aggregate dimensions + campaign UTMs). Anything else —
  // including any PII-shaped key — must have been stripped by sanitizeProps.
  const ALLOWED = new Set([
    'language', 'lead_magnet', 'landing_page', 'asset', 'book', 'destination', 'activity',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  ]);
  for (const e of events) {
    for (const k of Object.keys(e.props)) {
      expect(ALLOWED.has(k), `unexpected analytics prop key "${k}" on "${e.e}"`).toBe(true);
    }
  }
});

// TEST 4.4 — the prerender crawler (navigator.webdriver === true) must fire
// zero events, so a deploy produces no phantom hits.
test('4.4 no events fire when navigator.webdriver is true', async ({ page }) => {
  await installPlausibleStub(page, { realUser: false });
  await page.goto('/free/bedtime-routine');
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  const events = await readEvents(page);
  expect(events.length, `expected no events, got ${JSON.stringify(events)}`).toBe(0);
});

// TEST 4.5 — REGRESSION: events fired BEFORE the async pa-*.js loads must be
// buffered and flushed once it arrives. The new script does not flush
// window.plausible.q, so without our own buffer these were silently lost
// (Form Start → Lead Created vanished for fast-interacting visitors).
test('4.5 events fired before the analytics script loads are buffered, then flushed', async ({ page }) => {
  // Real user (so tracking runs), but block the real script so only index.html's
  // marked stub exists when the funnel events fire. Do NOT install the test stub.
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true }));
  await page.route(/plausible\.io\/js\/pa-.*\.js/, (r) => r.abort());
  await page.route(SUBSCRIBE, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );

  await page.goto('/free/bedtime-routine');
  await page.fill('#email-signup input[name="name"]', 'BufferTest');
  await page.fill('#email-signup input[name="email"]', 'buf@example.com');
  await page.click('#email-signup button[type="submit"]');
  await expect(page.locator('[role="status"]')).toBeVisible();

  // Only the marked stub exists → nothing delivered yet.
  expect(await page.evaluate(() => (window as unknown as { plausible?: { stub?: boolean } }).plausible?.stub === true)).toBe(true);

  // Simulate the real script arriving (a non-stub window.plausible).
  await page.evaluate(() => {
    (window as unknown as { __ev: string[] }).__ev = [];
    (window as unknown as { plausible: (n: string) => void }).plausible = (n) =>
      (window as unknown as { __ev: string[] }).__ev.push(n);
  });
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __ev?: string[] }).__ev?.length ?? 0))
    .toBeGreaterThan(0);

  const flushed = await page.evaluate(() => (window as unknown as { __ev: string[] }).__ev);
  for (const n of ['Landing View', 'Form View', 'Form Start', 'Form Submit', 'Lead Created']) {
    expect(flushed, `${n} flushed after script load`).toContain(n);
  }
});
