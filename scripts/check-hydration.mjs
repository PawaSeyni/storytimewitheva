// Post-build hydration check (runs in `npm run verify`, after prerender).
//
// Why: src/main.tsx HYDRATES the prerendered snapshots instead of repainting them
// (ported from griotmoon PR #46/#47, where it took mobile Lighthouse from 81 to 96). The
// contract is fragile: a component that renders Math.random()/Date output, or
// changes what it shows in a mount effect, gets baked into the snapshot with one
// value and hydrates with another. React then throws #418/#422/#423/#425 and quietly
// falls back to a full client repaint. The page still looks fine, so nothing
// else in the build would notice; only the LCP gain is gone.
//
// How: serve dist/ the way Netlify does (each route from its own index.html, no
// SPA fallback, unknown URLs get 404.html), load every prerendered route in a
// few reused headless Chrome tabs, and fail if any page reports a hydration error
// as a page error or a console error.

import http from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, blockAnalytics, ANALYTICS_HOSTS } from './lib/chrome.mjs';
import { isHydrationError } from './lib/hydration.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 5098; // prerender uses 5099
const ORIGIN = `http://localhost:${PORT}`;
const SETTLE_MS = 300;
const NOT_FOUND_ROUTE = '/__hydration_check_not_found__';

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
  '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

const isFile = p => existsSync(p) && statSync(p).isFile();

// Unlike prerender's server (which boots every route from the pristine shell),
// this one serves the SNAPSHOTS, because hydrating them is what is under test.
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let file = path.join(DIST, urlPath);
    if (!path.extname(urlPath)) file = path.join(file, 'index.html');
    if (!file.startsWith(DIST) || !isFile(file)) {
      res.statusCode = 404;
      file = path.join(DIST, '404.html');
    }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch (e) {
    res.statusCode = 500;
    res.end(String(e));
  }
});

// Every React route in the sitemap. The standalone /games/<slug>.html pages are
// static and have no React to hydrate, so they are skipped.
const xml = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
const sitemapRoutes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => new URL(m[1]).pathname)
  .filter(r => !path.extname(r));

// Plus the prerendered noindex routes that are kept out of the sitemap (/profile,
// /search, /links, the /free/<slug> landing pages, in every language). Landing
// pages have no [data-suspense-outlet], so their Suspense markers wrap #root
// directly; that is a separate hydration shape and worth covering. The 404 page
// hydrates too. "index 2.html" style names are iCloud conflict copies, never deployed.
async function* snapshots(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* snapshots(full);
    else if (e.name === 'index.html') yield full;
  }
}
const seen = new Set(sitemapRoutes.map(r => (r.endsWith('/') ? r : r + '/')));
const extraRoutes = [];
for await (const file of snapshots(DIST)) {
  const dir = path.relative(DIST, path.dirname(file)).split(path.sep).join('/');
  const route = dir ? `/${dir}/` : '/';
  if (!seen.has(route)) extraRoutes.push(route);
}
const routes = [...sitemapRoutes, ...extraRoutes, NOT_FOUND_ROUTE];

await new Promise(resolve => server.listen(PORT, resolve));

let browser;
try {
  browser = await launchChrome();
} catch (e) {
  console.error(`❌ Hydration check could not launch Chrome: ${e.message}`);
  server.close();
  process.exit(1);
}

// A few tabs, each reused for its share of the routes. Nearly all of the time per
// route is networkidle0's 500 ms quiet window plus the settle, i.e. waiting, so
// running tabs side by side cuts the wall time without making the pages race.
const TABS = 4;
const started = Date.now();
const failures = new Map(); // route -> Map(message -> count)
const fail = (route, message) => {
  const byMsg = failures.get(route) ?? new Map();
  byMsg.set(message, (byMsg.get(message) ?? 0) + 1);
  failures.set(route, byMsg);
};

async function worker(queue) {
  const page = await browser.newPage();
  await blockAnalytics(page);
  // First-time visitor on every route: the tab is reused, and book pages write storage.
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); sessionStorage.clear(); } catch { /* blocked */ } });
  let current = null;
  const report = (kind, text) => {
    if (current && isHydrationError(text)) fail(current, `${kind}: ${String(text).split('\n')[0]}`);
  };
  page.on('pageerror', err => report('pageerror', err?.message ?? err));
  page.on('console', msg => {
    if (msg.type() === 'error') report('console.error', msg.text());
  });
  for (let route; (route = queue.shift()) !== undefined; ) {
    current = route;
    try {
      await page.goto(ORIGIN + route, { waitUntil: 'networkidle0', timeout: 30000 });
      // App's mount effect sets this. If it never fires, React never committed, so
      // hydration was never exercised and a clean result would mean nothing.
      await page.waitForFunction('window.__PRERENDER_READY__ === true', { polling: 100, timeout: 10000 });
      await new Promise(r => setTimeout(r, SETTLE_MS));
    } catch (e) {
      fail(route, `did not load/boot: ${e.message.split('\n')[0]}`);
    }
    current = null;
  }
  await page.close();
}

const queue = [...routes];
await Promise.all(Array.from({ length: TABS }, () => worker(queue)));

// Slow-chunk pass. On a fast machine a lazy page chunk resolves before the app's
// mount effects run, so an effect that updates state above the page's Suspense
// boundary goes unnoticed. On a slow phone or a cold CDN the effect wins, and
// React abandons hydration of the page (#421). Reload a few representative pages
// with their lazy chunks held back 2 s, so that race always happens here.
// Only chunks OUTSIDE the entry's static import graph are held: holding the
// entry's own static imports would delay the app's boot by the same 2 s and the
// race would never happen. (Found on opttutor.com on 2026-09-25; the fix there
// was startTransition for the mount-time updates.)
// The entry plus everything it imports statically (import ... from "./x.js").
// Dynamic import("./x.js") calls are the lazy chunks and are not followed.
const STATIC_IMPORT = /(?:^|[;}\n])\s*import\s*(?:[\w$*{}\s,]+?\s*from\s*)?["'](\.{1,2}\/[^"']+)["']/g;
async function staticGraph(entry) {
  const seen = new Set();
  const visit = async p => {
    if (seen.has(p)) return;
    seen.add(p);
    const src = await (await fetch(ORIGIN + p)).text();
    for (const m of src.matchAll(STATIC_IMPORT)) await visit(new URL(m[1], ORIGIN + p).pathname);
  };
  await visit(entry);
  return seen;
}
const SLOW_ROUTES = ['/books/', '/activities/', '/free/bilingual-starter-kit/'].filter(r => routes.includes(r));
if (SLOW_ROUTES.length < 3) console.warn(`check-hydration: only ${SLOW_ROUTES.length} slow-chunk routes found`);
async function slowPass(route) {
  const label = `${route} (slow chunks)`;
  const html = await (await fetch(ORIGIN + route)).text();
  const entry = (html.match(/<script type="module"[^>]*src="([^"]+)"/) || [])[1];
  if (!entry) return fail(label, 'no entry <script type="module"> found');
  const boot = await staticGraph(entry);
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = new URL(req.url());
    if (ANALYTICS_HOSTS.some(h => u.host.includes(h))) return req.abort();
    const hold = u.origin === ORIGIN && u.pathname.endsWith('.js') && !boot.has(u.pathname);
    if (hold) setTimeout(() => req.continue(), 2000);
    else req.continue();
  });
  const report = (kind, text) => { if (isHydrationError(text)) fail(label, `${kind}: ${String(text).split('\n')[0]}`); };
  page.on('pageerror', err => report('pageerror', err?.message ?? err));
  page.on('console', msg => { if (msg.type() === 'error') report('console.error', msg.text()); });
  try {
    await page.goto(ORIGIN + route, { waitUntil: 'networkidle0', timeout: 60000 });
    await page.waitForFunction('window.__PRERENDER_READY__ === true', { polling: 100, timeout: 15000 });
    await new Promise(r => setTimeout(r, SETTLE_MS));
  } catch (e) {
    fail(label, `did not load/boot: ${e.message.split('\n')[0]}`);
  }
  await page.close();
}
await Promise.all(SLOW_ROUTES.map(slowPass));

// Visitor-state pass. The passes above load every page as a first-time visitor with no query
// string. Real visitors also arrive with saved progress, with storage blocked, or from a
// campaign or book link with a query string; anything that reads those during the FIRST
// render (instead of after hydration, src/lib/hydrated.ts) hydrates on a clean load and fails
// for them. Each scenario reloads a few representative pages in its own browser context.
const now = new Date().toISOString();
const SAVED = {
  'ste:personalization': JSON.stringify({ v: 1, updatedAt: now, data: {
    version: 1, updatedAt: now,
    library: { 'mayas-shadow': { status: 'reading', favorite: true, updatedAt: now } },
    recentlyExplored: [{ bookId: 'mayas-shadow', viewedAt: now }],
    savedResourceIds: [], savedJourneyIds: ['kindness-that-shines'],
  } }),
  pixelMascot: 'off',
};
const SCENARIOS = [
  {
    name: 'saved progress',
    init: `(() => { const s = ${JSON.stringify(SAVED)}; for (const k in s) localStorage.setItem(k, s[k]); })()`,
    routes: ['/', '/books/', '/books/mayas-shadow/', '/profile/', '/journeys/kindness-that-shines/', '/es/books/', '/fr/'],
  },
  {
    name: 'storage blocked',
    init: `Object.defineProperty(window, 'localStorage', { get() { throw new Error('denied'); } })`,
    routes: ['/', '/books/mayas-shadow/', '/profile/', '/journeys/kindness-that-shines/', '/search/'],
  },
  {
    name: 'query string',
    init: '',
    routes: ['/?lm=bedtime-routine', '/?pixel=0', '/?signup=ok', '/search/?q=kindness', '/activities/shadow-science/?book=mayas-shadow', '/free/classroom-pack/?signup=ok'],
  },
];
async function scenarioPass({ name, init, routes: list }) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await blockAnalytics(page);
  if (init) await page.evaluateOnNewDocument(init);
  let current = null;
  const report = (kind, text) => {
    if (current && isHydrationError(text)) fail(`${current} (${name})`, `${kind}: ${String(text).split('\n')[0]}`);
  };
  page.on('pageerror', err => report('pageerror', err?.message ?? err));
  page.on('console', msg => { if (msg.type() === 'error') report('console.error', msg.text()); });
  for (const route of list) {
    if (!routes.includes(route.split('?')[0])) { fail(`${route} (${name})`, 'route is not prerendered'); continue; }
    current = route;
    try {
      await page.goto(ORIGIN + route, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForFunction('window.__PRERENDER_READY__ === true', { polling: 100, timeout: 10000 });
      await new Promise(r => setTimeout(r, SETTLE_MS));
    } catch (e) {
      fail(`${route} (${name})`, `did not load/boot: ${e.message.split('\n')[0]}`);
    }
    current = null;
  }
  await context.close();
}
await Promise.all(SCENARIOS.map(scenarioPass));
const SCENARIO_ROUTES = SCENARIOS.reduce((n, sc) => n + sc.routes.length, 0);

await browser.close();
server.close();

const secs = ((Date.now() - started) / 1000).toFixed(1);
if (failures.size) {
  const lines = [...failures].flatMap(([route, byMsg]) =>
    [...byMsg].map(([msg, n]) => `${route} — ${msg}${n > 1 ? ` (×${n})` : ''}`),
  );
  console.error(
    `\n❌ Hydration check failed on ${failures.size} of ${routes.length} routes:\n  ` +
      lines.join('\n  ') +
      '\n\nA prerendered page no longer matches what React renders on the client, so it falls back\n' +
      'to a full repaint and loses the mobile LCP gain. Usual causes: Math.random()/Date output in\n' +
      'render, or a mount effect that changes visible output. See the comment in src/main.tsx.\n',
  );
  process.exit(1);
}
console.log(`Hydration check OK: ${routes.length} routes hydrated cleanly (${sitemapRoutes.length} sitemap, ${extraRoutes.length} noindex, 404; ${SLOW_ROUTES.length} again with slow chunks; ${SCENARIO_ROUTES} loads with saved, blocked or query-string visitor state) in ${secs}s.`);
