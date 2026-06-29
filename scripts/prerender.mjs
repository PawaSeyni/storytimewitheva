// Post-build prerender (static snapshot SSG).
//
// Why a headless snapshot rather than render-to-string: this app injects its
// SEO head (title, canonical, hreflang, JSON-LD) in useEffect, which never runs
// during Node render-to-string. A real browser DOES run those effects, so
// snapshotting captures the exact head + localized body for every route.
//
// Flow: serve dist/ (with SPA fallback) -> for each URL in the built sitemap,
// load it in headless Chromium, wait for App's __PRERENDER_READY__ flag, and
// write the rendered HTML to dist/<route>/index.html. Netlify serves those
// files directly; the SPA fallback in netlify.toml stays for anything unlisted.
//
// The client still boots normally (createRoot re-renders over the snapshot), so
// interactive routes (the activity games) work exactly as before.

import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// On CI (Netlify) use @sparticuz/chromium — a statically-linked build that
// works in containers without system-level Chrome libs.
// Locally (macOS / dev) fall back to puppeteer's own bundled Chromium.
const IS_CI = process.env.CI === 'true' || process.env.NETLIFY === 'true';
const { default: puppeteer } = IS_CI
  ? await import('puppeteer-core')
  : await import('puppeteer');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 5099;
const ORIGIN = `http://localhost:${PORT}`;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
  '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

// Static server. Real files (with an extension) are served from disk; every
// route request boots from `shell` — the PRISTINE index.html captured before we
// start writing snapshots. Using the pristine shell (not the freshly-written
// home snapshot) is essential: otherwise the home page's static JSON-LD would
// leak into every other route's snapshot as a stale SPA-fallback shell.
function createServer(shell) {
  return http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(DIST, urlPath);
      if (path.extname(urlPath) && existsSync(filePath) && statSync(filePath).isFile()) {
        const data = await readFile(filePath);
        res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
        res.end(data);
        return;
      }
      if (path.extname(urlPath)) {
        res.statusCode = 404;
        res.end('not found');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.end(shell); // clean SPA shell for any route
    } catch (e) {
      res.statusCode = 500;
      res.end(String(e));
    }
  });
}

function routesFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname);
}

// Capture the pristine shell BEFORE any snapshot overwrites dist/index.html.
const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
const server = createServer(shell);
await new Promise(resolve => server.listen(PORT, resolve));

// Only prerender SPA routes. Sitemap entries with a file extension (e.g. the
// standalone /games/<slug>.html pages) are already static and must NOT be
// snapshotted — they'd just stall waiting for the SPA's ready flag.
const sitemapRoutes = routesFromSitemap(await readFile(path.join(DIST, 'sitemap.xml'), 'utf8')).filter(
  r => !path.extname(r),
);

// SPA routes deliberately kept out of the sitemap because they're noindex
// utility pages (Profile, Search). They still need a prerendered shell — without
// one, the Netlify SPA fallback serves the HOME page's HTML for them, so a
// crawler or a pre-hydration paint shows the homepage instead of the real page.
// Mounted at every language prefix, exactly like App.tsx routeDefs × LANG_PREFIXES.
const NOINDEX_SPA_ROUTES = ['/profile', '/search'];
const LANG_PREFIXES = ['', '/es', '/fr'];
const extraRoutes = NOINDEX_SPA_ROUTES.flatMap(p => LANG_PREFIXES.map(pre => `${pre}${p}`));

const routes = [...new Set([...sitemapRoutes, ...extraRoutes])];
console.log(`Prerendering ${routes.length} routes (${extraRoutes.length} noindex SPA routes)…`);

// Prerender is REQUIRED: if Chromium can't launch or any route fails to render,
// exit non-zero so the build fails and Netlify keeps the last good deploy. The
// SPA fallback (`/* -> /index.html 200`) that used to serve a working shell for
// every URL has been removed (it caused soft-404s — unknown URLs returned the
// home page with HTTP 200), so a partial prerender must NOT ship silently.
let launchOpts;
if (IS_CI) {
  const chromium = (await import('@sparticuz/chromium')).default;
  launchOpts = {
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  };
  console.log('CI mode: using @sparticuz/chromium');
} else {
  launchOpts = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  };
}

let browser;
try {
  browser = await puppeteer.launch(launchOpts);
} catch (e) {
  console.error(`❌ Prerender could not launch Chrome: ${e.message}`);
  console.error('   Failing the build so the last good deploy stays live.');
  server.close();
  process.exit(1);
}
console.log('Chrome launched OK');

let ok = 0;
const failures = [];

for (const route of routes) {
  const page = await browser.newPage();
  try {
    await page.goto(ORIGIN + route, { waitUntil: 'load', timeout: 30000 });
    await page
      .waitForFunction('window.__PRERENDER_READY__ === true', { timeout: 10000 })
      .catch(() => {}); // fall back to the networkidle snapshot if the flag never fires
    // Lazy-loaded routes (the demos) render a Suspense fallback tagged
    // data-prerender-loading until their chunk resolves — wait it out so we
    // snapshot the real demo, not the spinner.
    await page
      .waitForFunction("!document.querySelector('[data-prerender-loading]')", { timeout: 10000 })
      .catch(() => {});
    const html = await page.content();
    const outDir = route === '/' ? DIST : path.join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html);
    ok++;
  } catch (e) {
    failures.push(`${route} — ${e.message}`);
  } finally {
    await page.close();
  }
}

// Emit a real 404 page: snapshot the NotFound route (it sets robots=noindex) and
// write it to dist/404.html. With the SPA catch-all removed, Netlify serves this
// with a proper HTTP 404 for any unmatched URL — no more soft-404 home fallback.
try {
  const page = await browser.newPage();
  await page.goto(ORIGIN + '/__prerender_not_found__', { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction('window.__PRERENDER_READY__ === true', { timeout: 10000 }).catch(() => {});
  await page
    .waitForFunction("!document.querySelector('[data-prerender-loading]')", { timeout: 10000 })
    .catch(() => {});
  await writeFile(path.join(DIST, '404.html'), await page.content());
  await page.close();
  console.log('Wrote dist/404.html (NotFound snapshot, noindex).');
} catch (e) {
  failures.push(`404.html — ${e.message}`);
}

await browser.close();
server.close();

console.log(`Prerendered ${ok}/${routes.length} routes.`);
if (failures.length) {
  // Prerender is required (the SPA fallback was removed). Fail the build so the
  // last good deploy stays live rather than shipping soft-404s / missing routes.
  console.error('❌ Prerender failed for:\n  ' + failures.join('\n  '));
  process.exit(1);
}
