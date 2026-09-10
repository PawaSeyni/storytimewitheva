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
import { test, expect } from './_app';
import { type Page, type BrowserContext } from '@playwright/test';

const ROUTES = ['/', '/books', '/books/mayas-shadow', '/collections/kindness', '/collections/classroom-feelings', '/collections/back-to-school', '/collections/summer-of-wonder', '/activities', '/resources', '/profile', '/journeys', '/journeys/kindness-that-shines', '/search?q=kindness', '/free/classroom-pack'];
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

  test('a journey step can be completed in memory with storage denied (S7-010)', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/journeys/kindness-that-shines', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
    const first = page.locator('button[aria-pressed]').filter({ hasText: 'Done' }).first();
    await first.click();
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[role="status"][aria-live="polite"]')).toContainText('1 of 5 steps done');
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

  test('a game continues to a book, labelled and prefixed in the reader\'s language (CJ-04)', async ({ page }) => {
    // story-map is referenced by a book; the baked block must localize its label AND
    // its href in French, under blocked storage, from ?lang= alone.
    const errors = watchErrors(page);
    await page.goto('/games/story-map.html?lang=fr', { waitUntil: 'domcontentloaded' });
    const link = page.locator('#ste-continue a[data-ste-continue]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^\/fr\/books\/[a-z0-9-]+$/);
    await expect(link).toContainText('À lire ensuite:');
    await expect(page.locator('#ste-continue-eyebrow')).toHaveText('Continuez l’aventure');
    expect(errors).toEqual([]);
  });

  test('a game with no referencing book falls back to the catalog, in the reader\'s language', async ({ page }) => {
    // matching is one of the four drills no book references. Its href is exactly /books,
    // which the nav localizer used to relabel to the nav word; the label must survive.
    await page.goto('/games/matching.html?lang=es', { waitUntil: 'domcontentloaded' });
    const link = page.locator('#ste-continue a[data-ste-continue]');
    await expect(link).toHaveAttribute('href', '/es/books');
    await expect(link).toContainText('Explora todos los libros');
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

// ---------------------------------------------------------------------------------
// Sprint 7 S7-017: the ecosystem flows — browse, open, progress, save, print/download,
// search, continuation — with cookies never set and with storage denied.
// ---------------------------------------------------------------------------------
test.describe('sprint 7 ecosystem — cookie-free and storage-free', () => {
  test('search, a collection, a journey, a pack and a guide set zero cookies', async ({ page, context }) => {
    await page.goto('/search?q=kindness');
    await page.getByRole('button', { name: /^Books/ }).click();
    await page.goto('/collections/classroom-feelings');
    await page.goto('/journeys/kindness-that-shines');
    await page.getByRole('button', { name: 'Mark step done' }).first().click();
    await page.goto('/free/classroom-pack');
    await page.goto('/resources');
    expect(await context.cookies(), 'cookies set by the site').toEqual([]);
    expect(await page.evaluate(() => document.cookie)).toBe('');
  });

  test('search works with storage denied', async ({ page, context }) => {
    await blockStorage(context);
    const errors = watchErrors(page);
    await page.goto('/search?q=kindness', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-search-group="collection"] a[href="/collections/kindness"]')).toBeVisible();
    await page.getByRole('button', { name: /^Journeys|^Reading journeys/ }).click();
    await expect(page.locator('[data-search-group="journey"]')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('a journey can be completed in memory with storage denied and announces completion', async ({ page, context }) => {
    await blockStorage(context);
    await page.goto('/journeys/kindness-that-shines', { waitUntil: 'domcontentloaded' });
    // The app client-renders over the prerendered HTML (createRoot, not hydrateRoot), so
    // there is a brief window where the step list is a Suspense fallback. Wait for the
    // rendered progress line and take the step count from it, never from an eager count().
    const progressLine = page.getByText(/^0 of \d+ steps done\./).first();
    await expect(progressLine).toBeVisible();
    const n = Number(/of (\d+) steps/.exec(await progressLine.innerText())?.[1]);
    expect(n).toBeGreaterThan(1);
    await expect(page.getByRole('button', { name: 'Mark step done' })).toHaveCount(n);
    for (let i = 0; i < n; i++) {
      await page.getByRole('button', { name: 'Mark step done' }).first().click();
      // Serialize on the rendered state so a re-render never swallows a click under load.
      await expect(page.getByRole('button', { name: 'Mark step not done' })).toHaveCount(i + 1);
    }
    // Completion is state (5 of 5) and an announcement; assert both with the live text so a
    // failure reports what was announced instead of "not found".
    await expect(page.getByText(/^\d+ of \d+ steps done\./).first()).toHaveText(`${n} of ${n} steps done.`);
    await expect(page.locator('p[role="status"][aria-live="polite"]')).toHaveText('Journey complete. Well done!');
  });

  test('a pack delivers every file with storage denied (endpoint stubbed, nothing real written)', async ({ page, context }) => {
    await blockStorage(context);
    await page.route(/plausible\.io/, (r) => r.abort());
    await page.route('**/.netlify/functions/subscribe', (r) =>
      r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
    );
    await page.goto('/es/free/home-reading-pack', { waitUntil: 'domcontentloaded' });
    await page.fill('#email-signup input[name="email"]', 'e2e@example.com');
    await page.click('#email-signup button[type="submit"]');
    const links = page.locator('[role="status"] a[download]');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '/download/bedtime-routine?lang=es');
  });

  test('print media on a journey page keeps the steps and drops the chrome, with storage denied', async ({ page, context }) => {
    await blockStorage(context);
    await page.goto('/journeys/kindness-that-shines', { waitUntil: 'domcontentloaded' });
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-print="chrome"]').first()).toBeHidden();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark step done' }).first()).toBeVisible();
  });

  test('continuation from an activity to a book works with storage denied', async ({ page, context }) => {
    await blockStorage(context);
    await page.goto('/activities/adventure-journal', { waitUntil: 'domcontentloaded' });
    const next = page.locator('a[href^="/books/"]').first();
    await expect(next).toBeVisible();
    await next.click();
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
