// Sprint 5 S5-002/003/005/006/007/020/022: purchase-intent, contextual signup, loop and share
// instrumentation, against the built site with the analytics stub from analytics.spec.
import { test, expect, type Page } from '@playwright/test';

/** Wait for the client app to have mounted over the prerendered HTML. Since PD-04 the first
 *  render waits for the route chunk, so a locator resolved straight after goto() can point at
 *  a prerendered node that React is about to replace. */
const appReady = (page: Page) => page.waitForFunction(() => (window as unknown as { __PRERENDER_READY__?: boolean }).__PRERENDER_READY__ === true);

async function stub(page: Page) {
  await page.addInitScript(() => {
    // @ts-expect-error test shim
    window.__ev = [];
    const fn = (e: string, o?: { props?: Record<string, unknown> }) => {
      // @ts-expect-error test shim
      window.__ev.push({ e, props: o?.props });
    };
    // @ts-expect-error test shim
    window.plausible = fn;
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
  });
  await page.route(/plausible\.io/, (r) => r.abort());
}
const events = (page: Page) => page.evaluate(() => (window as unknown as { __ev: { e: string; props: Record<string, unknown> }[] }).__ev);

test('purchase intent: one CTA impression when the Buy group is viewable, then a click with book, edition and placement', async ({ page }) => {
  await stub(page);
  await page.goto('/fr/books/leo-and-the-wolf');
  await appReady(page);
  const group = page.getByRole('group', { name: 'Acheter ce livre' });
  await group.scrollIntoViewIfNeeded();
  await expect.poll(async () => (await events(page)).filter((x) => x.e === 'Purchase CTA View').length).toBe(1);
  await page.route('https://www.amazon.com/**', (r) => r.fulfill({ status: 200, body: 'ok' }));
  const [popup] = await Promise.all([page.context().waitForEvent('page'), group.getByRole('link', { name: /Acheter sur Amazon/ }).click()]);
  await popup.close();
  const ev = await events(page);
  const view = ev.find((x) => x.e === 'Purchase CTA View');
  const click = ev.find((x) => x.e === 'Purchase Click');
  expect(view?.props).toEqual({ book: 'leo-and-the-wolf', placement: 'detail', edition: 'fr' });
  expect(click?.props).toEqual({ book: 'leo-and-the-wolf', destination: 'amazon', placement: 'detail', edition: 'fr' });
  expect(ev.findIndex((x) => x.e === 'Purchase CTA View')).toBeLessThan(ev.findIndex((x) => x.e === 'Purchase Click'));
  expect(ev.filter((x) => x.e === 'Purchase CTA View').length).toBe(1);
});

test('edition falls back to English on a book without a French edition', async ({ page }) => {
  await stub(page);
  await page.goto('/fr/books/emperors-true-treasure');
  await appReady(page);
  await page.getByRole('group', { name: 'Acheter ce livre' }).scrollIntoViewIfNeeded();
  await expect.poll(async () => (await events(page)).find((x) => x.e === 'Purchase CTA View')?.props?.edition).toBe('en');
});

test('contextual signup copy differs by placement and the placement travels on every funnel event', async ({ page }) => {
  await stub(page);
  await page.route('**/.netlify/functions/subscribe', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await page.goto('/resources');
  await appReady(page);
  await expect(page.locator('[data-signup-context="resources"]')).toContainText('Reading the guides?');
  await page.locator('#email-signup').scrollIntoViewIfNeeded();
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
  await expect(page.locator('[role="status"]').first()).toBeVisible();
  const ev = await events(page);
  for (const name of ['Form View', 'Form Start', 'Form Submit', 'Lead Created']) {
    const e = ev.find((x) => x.e === name);
    expect(e, name).toBeTruthy();
    expect(e!.props.placement, `${name} placement`).toBe('resources');
  }
  await page.goto('/');
  await appReady(page);
  await expect(page.locator('[data-signup-context]')).toHaveCount(0);
});

test('free-bundle loop: the success screen continues into books and the continuation is tracked', async ({ page }) => {
  await stub(page);
  await page.route('**/.netlify/functions/subscribe', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }));
  await page.goto('/free/bilingual-bundle');
  await appReady(page);
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
  const cont = page.locator('[data-signup-continue]');
  await expect(cont).toBeVisible();
  await expect(cont.locator('a[href^="/books/"]')).toHaveCount(3);
  await cont.locator('a[href^="/books/"]').first().click();
  await expect(page).toHaveURL(/\/books\/[a-z0-9-]+/);
  const ev = await events(page);
  const c = ev.find((x) => x.e === 'Continue Journey');
  expect(c?.props.placement).toBe('signup-success');
  expect(c?.props.destination).toBe('book');
  expect(typeof c?.props.book).toBe('string');
});

test('share: copy-link fallback copies the localized URL, announces it, and fires Share with the target kind only', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await stub(page);
  await page.addInitScript(() => { Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }); });
  await page.goto('/es/books/mayas-shadow');
  await appReady(page);
  const btn = page.getByRole('button', { name: 'Copiar enlace' });
  await expect(btn).toHaveAttribute('data-share-mode', 'copy');
  await btn.click();
  await expect(page.getByText('Enlace copiado')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://storytimewitheva.com/es/books/mayas-shadow/');
  const s = (await events(page)).find((x) => x.e === 'Share');
  expect(s?.props).toEqual({ book: 'mayas-shadow', target: 'copy', placement: 'detail' });
});
