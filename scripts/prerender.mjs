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
import { bookIds, loadContentIndex, loadLocales } from './lib/catalog.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync, readFileSync } from 'node:fs';
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
const NOINDEX_SPA_ROUTES = ['/profile', '/search', '/links'];
// Dedicated lead-magnet landing pages (/free/<slug>) — noindex and kept out of
// the sitemap, but prerendered so paid traffic gets an instant first paint
// (matters for ad conversion + Quality Score). Slugs come from LEAD_MAGNETS in
// src/components/EmailSignup.tsx; keep in sync when a magnet's page should ship.
// Every slug registered in LEAD_MAGNETS (src/components/EmailSignup.tsx) must be
// listed here. There is deliberately NO SPA catch-all in netlify.toml, so a route
// that is not prerendered returns a real 404 — even though isKnownMagnet() accepts
// it and the app would render it fine client-side. `bilingual-starter-kit` is the
// alias that five already-published assets point at (P-008, P-015, FB-009/020/023
// via `?lm=`), so /free/bilingual-starter-kit is the URL a human is most likely to
// construct by analogy. It 404'd in all three languages until 2026-08-10.
const LANDING_SLUGS = ['bedtime-routine', 'bilingual-bundle', 'bilingual-starter-kit', 'bilingual-flashcards', 'parents-guide', 'follow-up-activities', 'leo-and-the-wolf'];
const { LANG_PREFIXES } = await loadLocales(); // registry (S8-019)
// Learning packs (S7-008) are generated lead magnets; their /free/<id> pages come from
// the data module through the same projection the other guards use.
const { learningPackIds: PACK_LANDING_SLUGS } = await loadContentIndex();
// Closed seasonal collections (S7-012): prerendered (empty state, noindex) but not in the sitemap.
const closedSeasonalRoutes = [];

// Guard against drift: parse the magnet registry and fail the build if any
// registered slug has no prerendered landing page. Without this the mismatch is
// silent — the route simply 404s in production, which is exactly how
// `bilingual-starter-kit` went unnoticed.
{
  const registry = readFileSync(new URL('../src/components/EmailSignup.tsx', import.meta.url), 'utf8');
  const block = registry.slice(
    registry.indexOf('const LEAD_MAGNETS'),
    registry.indexOf('const DEFAULT_MAGNET'),
  );
  const registered = [...block.matchAll(/^ {2}'([a-z0-9-]+)': \{/gm)].map(m => m[1]);
  const missing = registered.filter(slug => !LANDING_SLUGS.includes(slug));
  if (missing.length) {
    console.error(
      `\nPrerender aborted: these LEAD_MAGNETS slugs have no /free/ landing page ` +
      `and would return a hard 404 in production:\n  ${missing.join('\n  ')}\n` +
      `Add them to LANDING_SLUGS in scripts/prerender.mjs.\n`,
    );
    process.exit(1);
  }
  const packClash = PACK_LANDING_SLUGS.filter(slug => registered.includes(slug) || LANDING_SLUGS.includes(slug));
  if (packClash.length) {
    console.error(`\nPrerender aborted: learning pack ids collide with registered magnets: ${packClash.join(', ')}\n`);
    process.exit(1);
  }
  console.log(`Landing-page guard OK: ${registered.length} magnet slugs + ${PACK_LANDING_SLUGS.length} learning packs all prerendered.`);
}

// Book-page guard (Sprint 3 S3-005 — catalog/sitemap/prerender parity): every book
// in the catalog must have a /books/<id> route in the sitemap. A book missing from
// the sitemap is never prerendered and returns a hard 404 in production with a green
// build. Ids come from the build-safe catalog projection (scripts/lib/catalog.mjs),
// so there is no regex over source that can silently drift.
{
  const catalogIds = await bookIds();
  // Sitemap <loc>s are trailing-slashed (/books/<id>/); normalize before comparing.
  const routeSet = new Set(sitemapRoutes.map(r => r.replace(/\/$/, '')));
  const missingBooks = catalogIds.filter(id => !routeSet.has(`/books/${id}`));
  if (missingBooks.length) {
    console.error(
      `\nPrerender aborted: these catalog books are missing from the sitemap ` +
      `(run \`npm run gen:sitemap\`):\n  ${missingBooks.join('\n  ')}\n`,
    );
    process.exit(1);
  }
  console.log(`Book-page guard OK: ${catalogIds.length} books all in the sitemap.`);
}

// Collection guard (taxonomy v1 §9): the sitemap must advertise EXACTLY the
// collection-eligible themes — no missing route (unreachable collection) and no extra
// route (a thin page for a theme below the two-book minimum, e.g. honesty/heritage).
{
  const { collectionRouteIds, indexableCollectionIds, seasonalCollectionIds, seasonalState, journeyRouteIds } = await loadContentIndex();
  const routeSet = new Set(sitemapRoutes.map(r => r.replace(/\/$/, '')));
  // Seasonal (S7-012): the sitemap advertises exactly the INDEXABLE set (open windows);
  // every route, closed seasonal included, is still prerendered (see extraRoutes).
  const indexable = indexableCollectionIds(new Date());
  const missing = indexable.filter(id => !routeSet.has(`/collections/${id}`));
  const advertised = [...routeSet].filter(r => r.startsWith('/collections/')).map(r => r.split('/')[2]);
  const extra = advertised.filter(id => !indexable.includes(id));
  for (const id of seasonalCollectionIds) {
    const st = seasonalState(id, new Date());
    const d = x => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; // local date, not UTC
    console.log(`Seasonal ${id}: ${st.open ? `OPEN, closes ${d(st.closes)}` : `closed, opens ${d(st.opens)}`} (crawlers see this state until the next deploy)`);
  }
  closedSeasonalRoutes.push(...collectionRouteIds.filter(id => !indexable.includes(id)).map(id => `/collections/${id}`));
  if (missing.length || extra.length) {
    console.error(
      `\nPrerender aborted: collection/sitemap parity failed.` +
      (missing.length ? `\n  missing (eligible but no route): ${missing.join(', ')}` : '') +
      (extra.length ? `\n  extra (route for an INELIGIBLE theme — thin page): ${extra.join(', ')}` : '') +
      `\nRun \`npm run gen:sitemap\`.\n`,
    );
    process.exit(1);
  }
  console.log(`Collection guard OK: ${indexable.length} indexable collections in the sitemap, ${collectionRouteIds.length - indexable.length} closed seasonal prerendered noindex.`);
  // Journey guard (S7-003): same bidirectional parity for /journeys/*.
  const jMissing = journeyRouteIds.filter(id => !routeSet.has(`/journeys/${id}`));
  const jAdvertised = [...routeSet].filter(r => /^\/journeys\/[^/]+$/.test(r)).map(r => r.split('/')[2]);
  const jExtra = jAdvertised.filter(id => !journeyRouteIds.includes(id));
  if (jMissing.length || jExtra.length || !routeSet.has('/journeys')) {
    throw new Error(`\nPrerender aborted: journey/sitemap parity failed. missing=${jMissing.join(',')} extra=${jExtra.join(',')} index=${routeSet.has('/journeys')}`);
  }
  console.log(`Journey guard OK: ${journeyRouteIds.length} published journeys + index.`);
}

const extraRoutes = [...NOINDEX_SPA_ROUTES, ...closedSeasonalRoutes, ...[...LANDING_SLUGS, ...PACK_LANDING_SLUGS].map(s => `/free/${s}`)].flatMap(p =>
  LANG_PREFIXES.map(pre => `${pre}${p}`),
);

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

// Both readiness waits below are FATAL, not best-effort. A route whose React
// tree never signals ready (crash, hang, unresolved lazy chunk) would otherwise
// be snapshotted mid-render and counted as a success — shipping an empty shell
// to a URL that has no SPA fallback behind it. Fail the build instead so the
// last good deploy stays live.
async function waitUntilReady(page) {
  try {
    await page.waitForFunction('window.__PRERENDER_READY__ === true', { timeout: 10000 });
  } catch {
    throw new Error('__PRERENDER_READY__ never fired within 10s (React never finished rendering)');
  }
  // Lazy-loaded routes (the demos) render a Suspense fallback tagged
  // data-prerender-loading until their chunk resolves — wait it out so we
  // snapshot the real demo, not the spinner.
  try {
    await page.waitForFunction("!document.querySelector('[data-prerender-loading]')", { timeout: 10000 });
  } catch {
    throw new Error('Suspense fallback still present after 10s (a lazy chunk never resolved)');
  }
}

let ok = 0;
const failures = [];

for (const route of routes) {
  const page = await browser.newPage();
  // S8-006: tell the app it is being snapshotted, so random-first-render pages (bingo,
  // puzzles) render a fixed state and the output is deterministic build to build.
  await page.evaluateOnNewDocument(() => { window.__PRERENDERING__ = true; });
  try {
    await page.goto(ORIGIN + route, { waitUntil: 'load', timeout: 30000 });
    await waitUntilReady(page);
    let html = await page.content();
    // Vite 8's runtime preload helper injects <link rel="modulepreload"> tags with an
    // ABSOLUTE href on the prerender origin (http://localhost:<port>/assets/…). Snapshotted
    // as-is they would ship to production pointing at localhost. Rewrite every reference
    // to the build origin to a root-relative path; nothing on a page may name the origin.
    html = html.split(ORIGIN + '/').join('/');
    // LCP hint: preload the hero image with its REAL hashed URL, taken from this
    // page's own rendered HTML — so it can never drift out of date (Vite re-hashes
    // the asset whenever it changes). Injected only on routes that actually render
    // the hero (home + /es,/fr), never site-wide. The <img> already carries
    // fetchpriority="high"; this adds the preload tag some auditors look for.
    const hero = html.match(/\/assets\/eva-reading-[A-Za-z0-9_-]+\.webp/);
    if (hero && !html.includes('rel="preload" as="image"')) {
      html = html.replace(
        '</head>',
        `<link rel="preload" as="image" href="${hero[0]}" fetchpriority="high"></head>`,
      );
    }
    const outDir = route === '/' ? DIST : path.join(DIST, route);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html);
    // Twin file so the unslashed URL (/books, the form every internal link and shared link
    // uses) is served directly. With only <route>/index.html, Netlify's pretty URLs answer
    // /books with a 301 to /books/, a ~0.3-0.9 s hop on mobile before anything paints (PD-04).
    // Same bytes as index.html, so Netlify's content-addressed upload sends it once.
    const twin = route.replace(/\/+$/, '');
    if (twin) await writeFile(path.join(DIST, `${twin}.html`), html);
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
  await waitUntilReady(page);
  await writeFile(path.join(DIST, '404.html'), (await page.content()).split(ORIGIN + '/').join('/')); // same origin rewrite as every route
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
