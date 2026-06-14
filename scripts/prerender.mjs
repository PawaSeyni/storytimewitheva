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
import puppeteer from 'puppeteer';
import { execFileSync } from 'node:child_process';

// Prefer system Chrome on Linux CI (Netlify has it pre-installed).
// Puppeteer's bundled Chromium may fail on containers due to missing system libs.
function findSystemChrome() {
  const candidates = [
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  try {
    const found = execFileSync('which', ['google-chrome'], { stdio: ['pipe', 'pipe', 'ignore'] })
      .toString().trim();
    if (found) return found;
  } catch {}
  return null;
}

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
const routes = routesFromSitemap(await readFile(path.join(DIST, 'sitemap.xml'), 'utf8')).filter(
  r => !path.extname(r),
);
console.log(`Prerendering ${routes.length} routes…`);

// Best-effort: if Chromium can't launch (e.g. a host without the right libs),
// warn and exit 0 so the working SPA still deploys. Prerender is an
// enhancement, not a hard build requirement.
const CHROME_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--no-first-run',
  '--no-zygote',
];

const systemChrome = findSystemChrome();
if (systemChrome) console.log(`Using system Chrome: ${systemChrome}`);

let browser;
try {
  browser = await puppeteer.launch({
    ...(systemChrome ? { executablePath: systemChrome } : {}),
    args: CHROME_ARGS,
  });
} catch (e) {
  console.warn(`⚠️  Prerender skipped — could not launch Chrome: ${e.message}`);
  console.warn('   Shipping the client-rendered SPA build as-is.');
  server.close();
  process.exit(0);
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

await browser.close();
server.close();

console.log(`Prerendered ${ok}/${routes.length} routes.`);
if (failures.length) {
  // Don't fail the deploy: unprerendered routes still work via the SPA fallback.
  console.warn('⚠️  Some routes did not prerender (SPA fallback will serve them):\n  ' + failures.join('\n  '));
}
