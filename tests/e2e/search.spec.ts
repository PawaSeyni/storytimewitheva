// S7-015: site search across content types, keyboard-operable filters, locale, empty query.
import { test, expect } from './_app';

test('a query finds books, collections, journeys and resources, grouped with type labels', async ({ page }) => {
  await page.goto('/search?q=kindness');
  await expect(page.getByRole('status')).toContainText(/\d+ results/);
  await expect(page.locator('[data-search-group="collection"] a[href="/collections/kindness"]')).toBeVisible();
  await expect(page.locator('[data-search-group="book"]')).toBeVisible();
  await expect(page.locator('[data-search-group="journey"] a[href="/journeys/kindness-that-shines"]')).toBeVisible();
});

test('filters are buttons with aria-pressed, keyboard operable, and update the URL and results', async ({ page }) => {
  await page.goto('/search?q=kindness');
  const books = page.getByRole('button', { name: /^Books/ });
  await expect(books).toHaveAttribute('aria-pressed', 'false');
  await books.focus();
  await page.keyboard.press('Enter');
  await expect(books).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/type=book/);
  await expect(page.locator('[data-search-group="collection"]')).toHaveCount(0);
  await expect(page.locator('[data-search-group="book"]')).toBeVisible();
  await page.keyboard.press('Space');
  await expect(books).toHaveAttribute('aria-pressed', 'false');
  await expect(page).not.toHaveURL(/type=/);
});

test('French search runs in French and links stay in the French tree', async ({ page }) => {
  await page.goto('/fr/search?q=bont%C3%A9');
  await expect(page.getByRole('status')).toContainText(/résultat/);
  await expect(page.locator('[data-search-group="collection"] a[href="/fr/collections/kindness"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /^Livres/ })).toBeVisible();
});

test('empty query shows the prompt and no results; a no-match query says so', async ({ page }) => {
  await page.goto('/search');
  await expect(page.getByText(/Type to search across/)).toBeVisible();
  await expect(page.locator('[data-search-group]')).toHaveCount(0);
  await page.getByRole('searchbox').fill('zzzzqqq');
  await expect(page.getByText(/No matches/)).toBeVisible();
  await expect(page.getByRole('status')).toContainText('0 results');
});
