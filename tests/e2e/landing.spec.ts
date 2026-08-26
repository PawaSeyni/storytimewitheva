// Layer 2 + 1.4 — landing-page contract, against the local build. Proves each
// page is CAPABLE of converting (it does not prove the offer does convert).
// Selectors are scoped to #email-signup so they don't collide with the hidden
// Netlify Forms detection form that also carries name/email inputs.
import { test, expect } from '@playwright/test';

const signup = '#email-signup';

test('2.1 the offer renders headline, blurb, bullets, email input, CTA', async ({ page }) => {
  await page.goto('/free/bedtime-routine');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/bedtime/i);
  await expect(page.locator(`${signup} p`).first()).not.toBeEmpty();
  await expect(page.locator(`${signup} ul li`)).toHaveCount(3);
  await expect(page.locator(`${signup} input[type="email"]`)).toBeVisible();
  await expect(page.locator(`${signup} button[type="submit"]`)).toBeVisible();
});

test('1.4 landing pages render without site chrome (no nav, no site-footer links)', async ({ page }) => {
  await page.goto('/free/bedtime-routine');
  // No site navbar, and none of the site-footer navigation links. (A minimal
  // credibility <footer> is allowed by design — what must be absent is the
  // navigable site chrome that would pull a paid visitor away from the offer.)
  await expect(page.locator('nav')).toHaveCount(0);
  await expect(page.locator('a[href$="/books"]')).toHaveCount(0);
  await expect(page.locator('a[href$="/activities"]')).toHaveCount(0);
});

test('2.2 locale tree serves its own language', async ({ page }) => {
  await page.goto('/es/free/parents-guide');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/GRATIS/);
  await page.goto('/fr/free/parents-guide');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/GRATUIT/);
});

test('2.3 ?lang= overrides the display language', async ({ page }) => {
  await page.goto('/free/bedtime-routine?lang=es');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/GRATIS/);
});

// TEST 2.5 — the LP-001 guard. Every magnet must show its product shot.
for (const magnet of ['bedtime-routine', 'parents-guide', 'bilingual-flashcards', 'follow-up-activities', 'woodworkers-patience']) {
  test(`2.5 ${magnet} shows a product-shot preview`, async ({ page }) => {
    await page.goto(`/free/${magnet}`);
    const img = page.locator(`img[src="/previews/${magnet}.webp"]`);
    await expect(img).toBeVisible();
    // the image actually loaded (not a broken <img>)
    expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  });
}
