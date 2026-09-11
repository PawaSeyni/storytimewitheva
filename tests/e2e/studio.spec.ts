// Activity Studio (2026-09-11) — the eight book-linked activities render, name their paired
// books from the activity table, print from a visible button, and the two that keep state
// (ripples, passport) survive a reload through the storage adapter.
import { test, expect } from './_app';

const PAIRINGS: Record<string, string[]> = {
  '/activities/color-mix-lab': ['colors-mixed-up'],
  '/activities/feelings-weather-report': ['pawa-rainbow-cloud'],
  '/activities/first-day-brave-plan': ['diegos-brave-leap'],
  '/activities/cloud-detective-journal': ['cloud-collector'],
  '/activities/shadow-theatre': ['mayas-shadow'],
  '/activities/kindness-ripple': ['butterfly-effect', 'sparrow-saved-forest'],
  '/activities/story-quilt': ['fig-trees-secret'],
  '/activities/patient-maker-passport': ['heidis-journey-to-mastery', 'miras-thousand-cubes', 'sanding-block'],
};

for (const [route, books] of Object.entries(PAIRINGS)) {
  test(`studio page renders with its table pairings: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
    for (const id of books) await expect(page.locator(`[data-studio-book="${id}"]`)).toHaveAttribute('href', `/books/${id}`);
    await expect(page.locator('[data-studio-printable]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Print or save as PDF/ })).toBeVisible();
    // continuation goes to one of the paired books
    const next = page.locator('a[data-continue-journey], a[href^="/books/"]').filter({ hasText: /Read next/ }).first();
    await expect(next).toHaveAttribute('href', new RegExp(`^/books/(${books.join('|')})$`));
    expect(errors).toEqual([]);
  });
}

test('color lab: changing the second color changes the recipe', async ({ page }) => {
  await page.goto('/activities/color-mix-lab');
  await expect(page.getByText('Orange!')).toBeVisible();
  await page.getByRole('button', { name: 'Choose blue as the second color color' }).click();
  await expect(page.getByText('Purple!')).toBeVisible();
});

test('kindness ripple: a ripple is added, shown on the chart, and survives a reload', async ({ page }) => {
  await page.goto('/activities/kindness-ripple');
  await page.getByRole('button', { name: 'I used kind words' }).click();
  await page.getByRole('button', { name: 'Add a kindness ripple' }).click();
  await expect(page.getByRole('status')).toContainText('1/7');
  await page.reload();
  await expect(page.getByRole('status')).toContainText('1/7');
  await expect(page.locator('[data-studio-printable]')).toContainText('I used kind words');
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.getByRole('status')).toContainText('0/7');
});

test('maker passport: a step marked done counts toward the certificate', async ({ page }) => {
  await page.goto('/activities/patient-maker-passport');
  await page.getByRole('button', { name: 'Mark practice step 1 complete' }).click();
  await page.getByRole('button', { name: 'Add a practice attempt to step 1' }).click();
  await expect(page.getByRole('status')).toHaveAttribute('aria-label', /1\/4/);
  await page.reload();
  await expect(page.getByRole('status')).toHaveAttribute('aria-label', /1\/4/);
  await expect(page.getByRole('button', { name: 'Add a practice attempt to step 1' })).toContainText('1 tries');
});

test('french studio page: breadcrumbs, pairing and copy are French', async ({ page }) => {
  await page.goto('/fr/activities/feelings-weather-report');
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText('Accueil');
  await expect(page.locator('[data-studio-book="pawa-rainbow-cloud"]')).toContainText('Pawa et le petit nuage arc-en-ciel');
  await expect(page.getByRole('button', { name: /Imprimer ou enregistrer en PDF/ })).toBeVisible();
});
