// Headless Chrome for check-hydration.mjs (ported from griotmoon). prerender.mjs keeps its
// own launch code; both block the same analytics host.
//
// On CI (Netlify, GitHub Actions) use @sparticuz/chromium: a statically-linked
// build that works in containers without system-level Chrome libs. Locally
// (macOS / dev) fall back to puppeteer's own bundled Chromium.
export const IS_CI = process.env.CI === 'true' || process.env.NETLIFY === 'true';

export async function launchChrome() {
  const { default: puppeteer } = IS_CI
    ? await import('puppeteer-core')
    : await import('puppeteer');
  if (IS_CI) {
    const chromium = (await import('@sparticuz/chromium')).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }
  return puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });
}

// Analytics beacons to abort during build-time page loads. Every build loads
// ~200 pages in headless Chromium, twice (prerender, then the hydration check);
// without this they'd land in the dashboard as real traffic. The snapshot keeps
// the <script> tags, so actual visitors are still counted.
// Keep in sync with the active analytics scripts in index.html. Cloudflare Web
// Analytics was removed; keeping stale hosts here can hide accidental
// regressions during build QA.
export const ANALYTICS_HOSTS = ['plausible.io'];

export async function blockAnalytics(page) {
  await page.setRequestInterception(true);
  page.on('request', req =>
    ANALYTICS_HOSTS.some(h => req.url().includes(h)) ? req.abort() : req.continue()
  );
}
