// Parent guides live at /resources/<slug> (one page each, EN/ES/FR). The old anchor form
// /resources#<slug> is still out in the world (pins, posts, emails), so the index forwards
// it to the guide's own page and keeps the language prefix.
import { test, expect } from './_app';

test('a guide page renders its title, its related stories and the other guides', async ({ page }) => {
  await page.goto('/resources/reluctant-readers');
  await expect(page.locator('h1')).toContainText('Reluctant');
  await expect(page.locator('[data-guide-links="reluctant-readers"] a[href^="/books/"]:not([href="/books/"])').first()).toBeVisible();
  await expect(page.locator('a[href="/resources/making-reading-magical/"]').first()).toBeVisible();
  // The page never links itself from its body; the footer's guide list (DA-03) is site chrome.
  await expect(page.locator('main a[href="/resources/reluctant-readers/"]')).toHaveCount(0);
});

test('an old /resources#<slug> anchor forwards to the guide page, in its language', async ({ page }) => {
  await page.goto('/resources#reluctant-readers');
  await expect(page).toHaveURL(/\/resources\/reluctant-readers\/$/);
  await expect(page.locator('h1')).toContainText('Reluctant');

  await page.goto('/fr/resources#bilingual-reading');
  await expect(page).toHaveURL(/\/fr\/resources\/bilingual-reading\/$/);
  await expect(page.locator('h1')).toContainText('bilingue');
});

test('an unknown guide slug is a real 404', async ({ page }) => {
  await page.goto('/resources/no-such-guide');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
