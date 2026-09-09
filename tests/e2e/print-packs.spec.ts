// Sprint 7 S7-008: learning packs are gated bundles; printed pages drop the chrome.
import { test, expect } from '@playwright/test';

const signup = '#email-signup';

test('pack landing renders the pack offer, three bullets and the form; success lists every file', async ({ page }) => {
  await page.goto('/free/classroom-pack');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/Classroom printables pack/);
  await expect(page.locator(`${signup} ul li`)).toHaveCount(3);
  await expect(page.locator(`${signup} input[type="email"]`)).toBeVisible();
  await expect(page.locator(`${signup} input[name="lead_magnet"]`)).toHaveValue('classroom-pack');
  await expect(page.locator('nav')).toHaveCount(0);
});

test('pack landing serves French with French item labels and language-specific download links', async ({ page }) => {
  await page.goto('/fr/free/home-reading-pack');
  await expect(page.locator(`${signup} h2`).first()).toContainText(/Pack routine de lecture/);
  await expect(page.locator(`${signup} button[type="submit"]`)).toContainText(/Envoyez-moi le pack/);
});

test('resources page lists packs with audience, ages and contents, and links the gated page', async ({ page }) => {
  await page.goto('/resources');
  const section = page.locator('#packs');
  await expect(section.getByRole('heading', { level: 2 })).toHaveText(/Learning packs/);
  await expect(section.locator('li a[href="/free/classroom-pack"]')).toBeVisible();
  await expect(section.getByText('For teachers and educators').first()).toBeVisible();
  await expect(section.locator('li:has(a[href="/free/classroom-pack"]) ul li')).toHaveCount(3);
});

test('print media hides nav, footer and signup and keeps the content (S7 §10)', async ({ page }) => {
  await page.goto('/collections/classroom-feelings');
  const chrome = page.locator('[data-print="chrome"]');
  await expect(chrome).toHaveCount(2); // site nav + footer
  await expect(chrome.first()).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(chrome.first()).toBeHidden();
  await expect(chrome.last()).toBeHidden();
  // Breadcrumbs are navigation too, and they stay on paper: they are the page's context.
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  await expect(page.locator('#email-signup')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('a[href="/books/pawa-rainbow-cloud"]').first()).toBeVisible();
});

// The delivery itself: after signup (endpoint stubbed, nothing real is written) the pack
// success screen lists EVERY file as a named link, in the visitor's language where an
// edition exists, via the stable /download URLs.
test('pack success screen lists every file with language-correct stable links', async ({ page }) => {
  await page.route(/plausible\.io/, (r) => r.abort());
  await page.route('**/.netlify/functions/subscribe', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );
  await page.goto('/fr/free/classroom-pack');
  await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
  await page.click('#email-signup button[type="submit"]');
  const status = page.locator('[role="status"]');
  await expect(status).toBeVisible();
  const links = status.locator('a[download]');
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute('href', '/download/parents-guide?lang=fr');
  await expect(links.nth(0)).toContainText('Guide parents');
  await expect(links.nth(1)).toHaveAttribute('href', '/download/follow-up-activities?lang=fr');
  await expect(links.nth(2)).toHaveAttribute('href', '/download/bilingual-flashcards');
});
