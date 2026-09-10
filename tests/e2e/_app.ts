import { test as base, expect, type Page } from '@playwright/test';

/**
 * Wait for the client app to have mounted over the prerendered HTML.
 *
 * Since PD-04 the first render waits for the route chunk, so for a short window after
 * goto() the page is the static prerender: a click, focus or locator taken then lands on a
 * node React is about to replace. App.tsx sets this flag from its mount effect. Pages
 * without the app root (the static /games/*.html) are left alone.
 */
export const appReady = (page: Page) =>
  page.waitForFunction(
    () => !document.getElementById('root') || (window as unknown as { __PRERENDER_READY__?: boolean }).__PRERENDER_READY__ === true,
    undefined,
    { timeout: 15_000 },
  );

/** `test` whose `page.goto()` also waits for the app mount. Specs import this instead of
 *  the Playwright one, so no spec has to remember the wait. */
export const test = base.extend({
  page: async ({ page }, run) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const response = await goto(url, options);
      await appReady(page);
      return response;
    };
    await run(page);
  },
});

export { expect };
