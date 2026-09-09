// Sprint 6 S6-017 — automated accessibility gate (axe-core), in the `local` project.
//
// Scans representative routes in English and French and fails on any SERIOUS or
// CRITICAL violation. Moderate/minor findings are reported, not blocking, so the gate
// stays honest about what it enforces. This is the automated half of S6-017; the manual
// keyboard and screen-reader pass is recorded in docs/testing/SPRINT_6_RELEASE_AUDIT.md.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/books', name: 'catalog' },
  { path: '/books/mayas-shadow', name: 'book page' },
  { path: '/collections/kindness', name: 'collection' },
  { path: '/activities', name: 'activities' },
  { path: '/resources', name: 'resources' },
  { path: '/profile', name: 'dashboard' },
  // Sprint 7 surfaces (S7-018)
  { path: '/search?q=kindness', name: 'search results' },
  { path: '/journeys', name: 'journeys index' },
  { path: '/journeys/kindness-that-shines', name: 'journey' },
  { path: '/collections/classroom-feelings', name: 'educator collection' },
  { path: '/collections/back-to-school', name: 'seasonal collection (open)' },
  { path: '/collections/summer-of-wonder', name: 'seasonal collection (closed)' },
  { path: '/free/classroom-pack', name: 'pack landing' },
];

for (const prefix of ['', '/fr']) {
  for (const r of ROUTES) {
    test(`a11y — ${prefix || '/en'} ${r.name} has no serious or critical violations`, async ({ page }) => {
      await page.goto(`${prefix}${r.path}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('h1').first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      const describe = (v: (typeof results.violations)[number]) =>
        `${v.id} (${v.impact}): ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`;
      const lesser = results.violations.filter((v) => !blocking.includes(v));
      if (lesser.length) test.info().annotations.push({ type: 'a11y-minor', description: lesser.map(describe).join('\n') });
      expect(blocking.map(describe), 'serious/critical axe violations').toEqual([]);
    });
  }
}

test('a11y — the dashboard with saved state: toggles expose pressed state and the clear control is reachable by keyboard', async ({ page }) => {
  await page.goto('/books/mayas-shadow', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Mark as reading now', exact: true }).first().click();
  await page.getByRole('button', { name: 'Add to favorites', exact: true }).first().click();
  await page.goto('/profile', { waitUntil: 'domcontentloaded' });
  // Wait for the client to hydrate the preferences block before counting; the prerendered
  // shell may not carry client-only controls, and counting too early undercounts.
  await expect(page.getByText('What should we suggest?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kindness', exact: true })).toBeVisible();

  // Every toggle on the page is a real button with a pressed state and an accessible name.
  const toggles = page.locator('button[aria-pressed]');
  const n = await toggles.count();
  const found = await toggles.evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') || e.textContent?.trim()));
  expect(n, `aria-pressed buttons found: ${JSON.stringify(found)}`).toBeGreaterThan(5);
  for (let i = 0; i < n; i++) {
    const name = (await toggles.nth(i).getAttribute('aria-label')) || (await toggles.nth(i).innerText());
    expect(name.trim(), `toggle ${i} accessible name`).not.toBe('');
  }

  // The clear control can be reached with the keyboard alone and a polite live region exists.
  const clear = page.getByRole('button', { name: 'Clear everything on this device' });
  await expect(clear).toBeVisible();
  await clear.focus();
  await expect(clear).toBeFocused();
  await expect(page.locator('[role="status"][aria-live="polite"]')).toHaveCount(1);

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
