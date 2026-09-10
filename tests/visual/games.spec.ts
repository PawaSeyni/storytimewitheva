import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

// The twelve standalone games, desktop + mobile, with Math.random seeded so shuffles are stable.
const GAMES = readdirSync('public/games').filter((f) => f.endsWith('.html')).map((f) => `/games/${f}`);
const WIDTHS = [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 390, height: 844 }];

for (const w of WIDTHS) for (const p of [...GAMES, '/games/emotion-wheel.html?lang=fr']) {
  test(`${w.name} ${p}`, async ({ page }) => {
    await page.setViewportSize({ width: w.width, height: w.height });
    await page.addInitScript(() => {
      let s = 12345; Math.random = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
      Object.defineProperty(navigator, 'webdriver', { get: () => true });
    });
    await page.goto(p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
    await page.waitForTimeout(400);
    const slug = `game-${w.name}-${p.replace(/[^a-z0-9]+/gi, '_')}`;
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  });
}
