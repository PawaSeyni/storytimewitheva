// S5-008 / S5-009 / S5-010 in the built site: both experiments are drafts, so every visitor is
// control, no exposure fires, conversions carry no experiment props, and the pages work with
// storage denied. (Assignment, weights, eligibility and the kill switch are unit-tested.)
import { test, expect, type Page } from '@playwright/test';

async function stub(page: Page) {
  await page.addInitScript(() => {
    // @ts-expect-error test shim
    window.__ev = [];
    // @ts-expect-error test shim
    window.plausible = (e: string, o?: { props?: Record<string, unknown> }) => { window.__ev.push({ e, props: o?.props }); };
    Object.defineProperty(navigator, 'webdriver', { get: () => false, configurable: true });
  });
  await page.route(/plausible\.io/, (r) => r.abort());
}
const events = (page: Page) => page.evaluate(() => (window as unknown as { __ev: { e: string; props: Record<string, unknown> }[] }).__ev);

test('draft experiments: control everywhere, no exposure, conversions carry no experiment props', async ({ page }) => {
  await stub(page);
  await page.goto('/books/mayas-shadow');
  await page.getByRole('group', { name: 'Buy this book' }).scrollIntoViewIfNeeded();
  await expect.poll(async () => (await events(page)).some((x) => x.e === 'Purchase CTA View')).toBe(true);
  await expect(page.locator('[data-experiment="book-cta-hierarchy-v1"]')).toHaveCount(0);
  await page.goto('/resources');
  await page.locator('#email-signup').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-signup-context="resources"]')).toBeVisible(); // 'contextual' is the shipped default
  await expect.poll(async () => (await events(page)).some((x) => x.e === 'Form View')).toBe(true);
  const ev = await events(page);
  expect(ev.filter((x) => x.e === 'Experiment Exposure')).toEqual([]);
  for (const e of ev) { expect(e.props?.experiment, e.e).toBeUndefined(); expect(e.props?.variant, e.e).toBeUndefined(); }
});

test('with storage denied the experiment surfaces still render and nothing throws', async ({ page, context }) => {
  await context.addInitScript(() => {
    const deny = () => { throw new DOMException('Storage is disabled', 'SecurityError'); };
    for (const name of ['localStorage', 'sessionStorage'] as const) Object.defineProperty(window, name, { get: deny, configurable: true });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/fr/books/leo-and-the-wolf', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('group', { name: 'Acheter ce livre' })).toBeVisible();
  await page.goto('/activities', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-signup-context="activities"]')).toBeVisible();
  expect(errors).toEqual([]);
});
