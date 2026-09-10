// PD-04 — a prerendered page must never be swapped for the Suspense fallback on load.
//
// Before the fix, React.lazy committed the fallback even with the chunk in cache: the
// footer jumped from 17,000 px down into the viewport and back (CLS 0.58 on /books,
// Lighthouse mobile 71). main.tsx now preloads the current route's chunk and the route
// components read it with use(), so the first commit is the full page. Measured with the
// CPU throttled so the window between the shell script and the page chunk is real.
import { test, expect } from './_app';

const ROUTES = ['/books', '/activities/bingo', '/es/resources', '/fr/books/mayas-shadow', '/profile', '/no-such-page'];

for (const route of ROUTES) {
  test(`no fallback flash and no layout shift on load: ${route}`, async ({ page, context }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __fallbacks: number };
      w.__cls = 0;
      w.__fallbacks = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
          if (!e.hadRecentInput) w.__cls += e.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new MutationObserver(() => {
        if (document.querySelector('[data-prerender-loading]')) w.__fallbacks++;
      }).observe(document.documentElement, { childList: true, subtree: true });
    });
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const { cls, fallbacks } = await page.evaluate(() => {
      const w = window as unknown as { __cls: number; __fallbacks: number };
      return { cls: w.__cls, fallbacks: w.__fallbacks };
    });
    expect(fallbacks, 'Suspense fallback committed over the prerendered page').toBe(0);
    // The fallback flash scores 0.25-0.58; a font swap or a late image on a CI runner can add
    // a hundredth or two, so the gate is Google's 0.1 "good" boundary.
    expect(cls, 'cumulative layout shift on load').toBeLessThan(0.1);
    await expect(page.locator('main')).toBeVisible();
  });
}
