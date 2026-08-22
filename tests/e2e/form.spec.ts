// Layer 3 — form → MailerLite. The part that was silently broken before
// 2026-07-20 (mode:'no-cors' showed success while dropping every email). The
// subscribe endpoint is stubbed with page.route; nothing real is written.
import { test, expect, type Page } from '@playwright/test';

const SUBSCRIBE = '**/.netlify/functions/subscribe';

// Record events into window.__ev and present as a real user so analytics.ts
// does not short-circuit on navigator.webdriver.
async function asRealUserWithPlausible(page: Page) {
  await page.addInitScript(() => {
    // @ts-expect-error test shim
    window.__ev = [];
    const fn = (e: string, o?: { props?: Record<string, unknown> }) => {
      // @ts-expect-error test shim
      window.__ev.push({ e, props: o?.props });
    };
    // @ts-expect-error test shim
    fn.init = () => {};
    // @ts-expect-error test shim
    fn.q = [];
    // @ts-expect-error test shim
    window.plausible = fn;
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
  });
  await page.route(/plausible\.io/, (r) => r.abort());
}

async function fillAndSubmit(page: Page) {
  await page.fill('#email-signup input[name="name"]', 'Test Person');
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
}

test('3.2 request body carries email, name, language, magnet and all UTMs', async ({ page }) => {
  let body: Record<string, unknown> | null = null;
  await page.route(SUBSCRIBE, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto(
    '/free/parents-guide?utm_source=pinterest&utm_medium=paid_social&utm_campaign=parents-guide_en_us&utm_content=P-014'
  );
  await fillAndSubmit(page);
  await expect(page.locator('[role="status"]')).toBeVisible();

  expect(body).toMatchObject({
    email: 'e2e@example.com',
    name: 'Test Person',
    language: 'en',
    lead_magnet: 'parents-guide',
    utm_source: 'pinterest',
    utm_medium: 'paid_social',
    utm_campaign: 'parents-guide_en_us',
    utm_content: 'P-014',
  });
});

test('3.4 legacy bilingual-starter-kit slug posts the bundle tag', async ({ page }) => {
  let body: Record<string, unknown> | null = null;
  await page.route(SUBSCRIBE, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/free/bilingual-starter-kit');
  await fillAndSubmit(page);
  await expect(page.locator('[role="status"]')).toBeVisible();
  expect(body?.lead_magnet).toBe('bilingual-bundle');
});

// TEST 3.5 — failure paths must fail VISIBLY. The regression test for the
// no-cors silent-drop. A green success screen must never appear without a
// confirmed backend ok.
test('3.5a HTTP 500 shows the error state, not success', async ({ page }) => {
  await page.route(SUBSCRIBE, (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto('/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('[role="status"]')).toHaveCount(0);
});

test('3.5b HTTP 200 with { ok:false } shows the error state (res.ok is not enough)', async ({ page }) => {
  await page.route(SUBSCRIBE, (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: false }) })
  );
  await page.goto('/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('[role="status"]')).toHaveCount(0);
});

test('3.5c network abort shows the error state', async ({ page }) => {
  await page.route(SUBSCRIBE, (r) => r.abort());
  await page.goto('/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('[role="alert"]')).toBeVisible();
  await expect(page.locator('[role="status"]')).toHaveCount(0);
});

// TEST 3.5d — no phantom conversion. On failure, 'Form Submit' fires but
// 'Lead Created' must NOT. (webdriver overridden so events can fire at all.)
test('3.5d a failed signup never fires Lead Created', async ({ page }) => {
  await asRealUserWithPlausible(page);
  await page.route(SUBSCRIBE, (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto('/free/bedtime-routine');
  await fillAndSubmit(page);
  await expect(page.locator('[role="alert"]')).toBeVisible();
  const events = await page.evaluate(() => (window as unknown as { __ev: { e: string }[] }).__ev.map((x) => x.e));
  expect(events).toContain('Form Submit');
  expect(events).not.toContain('Lead Created');
});
