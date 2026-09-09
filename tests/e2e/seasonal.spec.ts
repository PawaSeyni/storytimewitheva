// Sprint 7 S7-012: the publish window is evaluated with the visitor's clock, so the
// same route shows books inside the window and a localized empty state outside it.
import { test, expect } from '@playwright/test';

test('inside the window: books, seasonal badge with the closing date, no empty state', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-05T12:00:00'));
  await page.goto('/collections/season-of-gratitude');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A season of gratitude');
  await expect(page.getByText(/Seasonal collection · Available until December 31/)).toBeVisible();
  await expect(page.locator('a[href="/books/emperors-true-treasure"]').first()).toBeVisible();
  await expect(page.getByTestId('seasonal-empty')).toHaveCount(0);
});

test('outside the window: empty state with the next opening date, no books, other collections still offered', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-01T12:00:00'));
  await page.goto('/fr/collections/season-of-gratitude');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('La saison de la gratitude');
  const empty = page.getByTestId('seasonal-empty');
  await expect(empty).toBeVisible();
  await expect(empty).toContainText('Elle revient le 1 novembre');
  await expect(page.locator('a[href^="/fr/books/"]')).toHaveCount(0);
  await expect(page.locator('a[href="/fr/collections/kindness"]').first()).toBeVisible();
});

test('the catalogue spotlights an open season and hides a closed one', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-07-10T12:00:00'));
  await page.goto('/books');
  await expect(page.locator('a[href="/collections/summer-of-wonder"]')).toBeVisible();
  await expect(page.locator('a[href="/collections/season-of-gratitude"]')).toHaveCount(0);
});
