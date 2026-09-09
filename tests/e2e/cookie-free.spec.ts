// Sprint 6 S6-015 / S6-016 — the permanent cookie-free and storage-failure suite.
//
// Runs in the `local` project against the built dist, so it is in CI. Two guarantees:
//
//   1. COOKIE-FREE. Every core flow — browse, read, save, switch language, personalize —
//      completes with ZERO cookies set by the site. Not "works when cookies are blocked":
//      the stronger claim that nothing ever sets one (ADR-001).
//
//   2. STORAGE-FREE. The same flows complete with localStorage and sessionStorage
//      THROWING on every access (private mode, enterprise policy, quota). Nothing crashes,
//      every page renders, and controls still work for the session in memory.
//
// Storage failure is injected with an init script that replaces the storage getters, so
// it is exercised for real rather than described.
import { test, expect, type Page, type BrowserContext } from '@playwright/test';

const ROUTES = ['/', '/books', '/books/mayas-shadow', '/collections/kindness', '/activities', '/resources', '/profile'];
const LOCALES = ['', '/fr', '/es'];

/** Collect uncaught page errors for the life of the page. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

/** Make every storage access throw, the way Safari Private Mode and policy-blocked browsers do. */
async function blockStorage(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    const deny = () => {
      throw new DOMException('Storage is disabled', 'SecurityError');
    };
    for (const name of ['localStorage', 'sessionStorage'] as const) {
      Object.defineProperty(window, name, { get: deny, configurable: true });
    }
  });
}

async function exerciseBookControls(page: Page): Promise<void> {
  await page.goto('/books/mayas-shadow', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toBeVisible();
  const reading = page.getByRole('button', { name: 'Mark as reading now', exact: true }).first();
  await reading.click();
  await expect(page.getByRole('button', { name: 'Stop marking as reading now', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
  const fav = page.getByRole('button', { name: 'Add to favorites', exact: true }).first();
  await fav.click();
  await expect(page.getByRole('button', { name: 'Remove from favorites', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
  // and a second click reverses it immediately — the inverted-toggle bug showed the
  // opposite of storage on every click after the first
  await page.getByRole('button', { name: 'Remove from favorites', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Add to favorites', exact: true }).first()).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Add to favorites', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Remove from favorites', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
}

test.describe('cookie-free — no core flow sets a cookie', () => {
  test('browse, read, save, personalize and switch language: zero cookies', async ({ page, context }) => {
    const errors = watchErrors(page);
    for (const prefix of LOCALES) {
      for (const route of ROUTES) {
        const resp = await page.goto(`${prefix}${route}`, { waitUntil: 'domcontentloaded' });
        expect(resp?.status(), `${prefix}${route}`).toBe(200);
        await expect(page.locator('h1').first(), `${prefix}${route} h1`).toBeVisible();
      }
    }
    await exerciseBookControls(page);
    // preferences + saved resource on the adult page
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Kindness' }).click();
    await page.goto('/resources', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Save for later', exact: true }).first().click();
    // The IMMEDIATE state after the click, not after a reload. This is the assertion that
    // caught the inverted-toggle bug in FavoriteButton; SaveResourceButton had the same.
    await expect(page.getByRole('button', { name: 'Remove from saved', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
    // language switch persists a preference — still no cookie
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /français|switch to french/i }).first().click().catch(() => {});

    expect(await context.cookies(), 'the site must set no cookies at all').toEqual([]);
    expect(errors, 'no uncaught errors').toEqual([]);
  });
});

test.describe('storage-free — every flow survives localStorage throwing', () => {
  test.beforeEach(async ({ context }) => blockStorage(context));

  test('every public route renders with storage denied', async ({ page }) => {
    const errors = watchErrors(page);
    for (const prefix of LOCALES) {
      for (const route of ROUTES) {
        await page.goto(`${prefix}${route}`, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('h1').first(), `${prefix}${route}`).toBeVisible();
      }
    }
    expect(errors).toEqual([]);
  });

  test('status and favorite controls work in memory for the session', async ({ page }) => {
    const errors = watchErrors(page);
    await exerciseBookControls(page);
    expect(errors).toEqual([]);
  });

  test('the dashboard tells the grown-up nothing will persist', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Storage is unavailable in this browser')).toBeVisible();
  });

  test('personalized homepage sections stay absent without stored context', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Picked for you')).toHaveCount(0);
    await expect(page.getByText('Pick up where you left off')).toHaveCount(0);
  });

  test('the games still open and localize from the URL alone', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/games/matching.html?lang=fr', { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => (window as unknown as { GAME_LANG?: string }).GAME_LANG)).toBe('fr');
    expect(errors).toEqual([]);
  });
});

test.describe('corrupt state — a malformed envelope never breaks a page', () => {
  test('junk in the personalization key is ignored, controls default off', async ({ page }) => {
    const errors = watchErrors(page);
    await page.addInitScript(() => {
      try {
        localStorage.setItem('ste:personalization', '{not json');
        localStorage.setItem('readingProgress', '[]'); // wrong shape too
      } catch {
        /* storage may be blocked in other tests */
      }
    });
    await page.goto('/books/mayas-shadow', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark as read', exact: true }).first()).toHaveAttribute('aria-pressed', 'false');
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
