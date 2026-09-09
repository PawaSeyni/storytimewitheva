// S8-021: enforce budgets.json against a fresh dist/. Exit 1 on any 'fail' breach.
//   node scripts/check-budgets.mjs [--json]
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const B = JSON.parse(readFileSync(path.join(ROOT, 'budgets.json'), 'utf8'));
if (!existsSync(path.join(DIST, 'index.html'))) { console.error('check-budgets: dist/ missing, run the build first'); process.exit(1); }

const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);
const rel = (f) => path.relative(DIST, f);
const kb = (n) => Math.round(n / 1024);
const gzKB = (f) => kb(gzipSync(readFileSync(f)).length);
const sizeKB = (f) => kb(statSync(f).size);

const findings = []; // { level: 'warn'|'fail', what, value, limit }
const check = (what, value, limits, unit) => {
  if (value > limits.fail) findings.push({ level: 'fail', what, value, limit: limits.fail, unit });
  else if (value > limits.warn) findings.push({ level: 'warn', what, value, limit: limits.warn, unit });
};

// JavaScript
const js = files.filter((f) => /\/assets\/[^/]+\.js$/.test(f));
const entry = js.find((f) => /\/assets\/index-[^/]+\.js$/.test(f));
const jsGz = Object.fromEntries(js.map((f) => [rel(f), gzKB(f)]));
if (entry) check('entry chunk (gzip)', jsGz[rel(entry)], B.js.entryGzipKB, 'KB');
for (const f of js) if (f !== entry) check(`chunk ${rel(f)} (gzip)`, jsGz[rel(f)], B.js.pageChunkGzipKB, 'KB');
check('total JavaScript (gzip)', Object.values(jsGz).reduce((a, b) => a + b, 0), B.js.totalGzipKB, 'KB');

// CSS
const css = files.filter((f) => f.endsWith('.css'));
check('total CSS (gzip)', css.reduce((n, f) => n + gzKB(f), 0), B.css.totalGzipKB, 'KB');

// HTML per route
const html = files.filter((f) => f.endsWith('index.html'));
for (const f of html) check(`html ${rel(f)}`, sizeKB(f), B.html.perRouteKB, 'KB');
if (html.length < B.routes.min) findings.push({ level: 'fail', what: 'prerendered routes', value: html.length, limit: B.routes.min, unit: 'routes (minimum)' });

// Images: page assets (everything a page can load) vs campaign assets (/pins, never on a page)
const img = files.filter((f) => /\.(webp|jpe?g|png|svg|gif|avif)$/i.test(f));
const campaign = img.filter((f) => /\/pins\//.test(f));
const pageAssets = img.filter((f) => !campaign.includes(f));
for (const f of pageAssets) check(`image ${rel(f)}`, sizeKB(f), B.images.pageAssetKB, 'KB');
check('page image assets total', pageAssets.reduce((n, f) => n + statSync(f).size, 0) / 1048576, B.images.pageAssetsTotalMB, 'MB');
for (const f of campaign) check(`campaign asset ${rel(f)}`, statSync(f).size / 1048576, B.images.campaignAssetMB, 'MB');

// PDFs
for (const f of files.filter((f) => f.endsWith('.pdf'))) check(`pdf ${rel(f)}`, statSync(f).size / 1048576, B.pdf.perFileMB, 'MB');

const fails = findings.filter((x) => x.level === 'fail');
const warns = findings.filter((x) => x.level === 'warn');
if (process.argv.includes('--json')) console.log(JSON.stringify({ fails, warns, entryGzipKB: entry ? jsGz[rel(entry)] : null, routes: html.length }, null, 2));
else {
  for (const x of warns) console.log(`WARN ${x.what}: ${typeof x.value === 'number' ? +x.value.toFixed(1) : x.value} ${x.unit} (budget ${x.limit})`);
  for (const x of fails) console.error(`FAIL ${x.what}: ${typeof x.value === 'number' ? +x.value.toFixed(1) : x.value} ${x.unit} (budget ${x.limit})`);
  console.log(`check-budgets: ${html.length} routes, entry ${entry ? jsGz[rel(entry)] : '?'} KB gz, ${warns.length} warnings, ${fails.length} failures`);
}
process.exit(fails.length ? 1 : 0);
