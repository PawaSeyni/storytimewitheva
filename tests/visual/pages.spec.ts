import { test, expect } from '@playwright/test';

const PAGES = ['/', '/books', '/books/mayas-shadow', '/fr/books/leo-and-the-wolf', '/collections/kindness', '/collections/back-to-school', '/collections/season-of-gratitude', '/journeys', '/journeys/kindness-that-shines', '/activities', '/activities/word-explorer', '/activities/bingo', '/activities/coloring', '/activities/story-builder', '/activities/character-workshop', '/activities/adventure-journal', '/activities/craft-corner', '/activities/bookmark-designer', '/activities/puzzles', '/activities/color-mix-lab', '/activities/feelings-weather-report', '/activities/first-day-brave-plan', '/activities/cloud-detective-journal', '/activities/shadow-theatre', '/activities/kindness-ripple', '/activities/story-quilt', '/activities/patient-maker-passport', '/resources', '/search?q=kindness', '/free/classroom-pack', '/es/free/bedtime-routine', '/profile', '/about', '/faq', '/contact', '/privacy', '/no-such-page'];
const WIDTHS = [{ name: 'desktop', width: 1280, height: 900 }, { name: 'mobile', width: 390, height: 844 }];

for (const w of WIDTHS) for (const p of PAGES) {
  test(`${w.name} ${p}`, async ({ page }) => {
    await page.setViewportSize({ width: w.width, height: w.height });
    // webdriver: analytics stays silent; __PRERENDERING__: demos with a random first render (bingo, puzzles) render their fixed state.
    await page.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => true }); (window as unknown as { __PRERENDERING__: boolean }).__PRERENDERING__ = true; });
    await page.goto(p, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; } .star-float { display: none !important; }' });
    await page.waitForTimeout(300);
    const slug = `${w.name}-${p.replace(/[^a-z0-9]+/gi, '_') || 'home'}`;
    await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true });
  });
}
