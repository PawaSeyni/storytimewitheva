// Refresh book cover URLs from the current Amazon artwork.
//
// Why this exists: `coverImage` stores Amazon's /images/I/<id>.jpg URL, and that
// id pins a SPECIFIC image version. When a cover is re-uploaded on KDP, Amazon
// mints a new id and the old one keeps serving the OLD art forever, so the site
// silently goes stale. This re-reads each book's current main image by ASIN and
// rewrites src/data/books.ts.
//
// Amazon serves a bot wall to plain HTTP clients (curl gets ~4KB of nothing), so
// we drive a real headless browser. Run:
//
//   npm run refresh-covers          # update books.ts in place
//   npm run refresh-covers -- --dry # report only, change nothing
//
// The 3 featured titles use local optimized .webp (imported, not a URL). Those
// can't be rewritten automatically — if their Amazon art changed this script
// reports the new image id so you can regenerate the .webp:
//
//   curl -s -o /tmp/c.jpg "https://m.media-amazon.com/images/I/<id>._SL1000_.jpg"
//   cwebp -q 82 -resize 700 700 /tmp/c.jpg -o src/assets/covers/<slug>.webp

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS = path.resolve(__dirname, '..', 'src', 'data', 'books.ts');
const DRY = process.argv.includes('--dry');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/** Parse books.ts into { id, asin, cover, local, lineIdx } records. */
function parseBooks(src) {
  const lines = src.split('\n');
  const books = [];
  let cur = null;
  lines.forEach((ln, i) => {
    const id = ln.match(/^ {4}id: '([^']+)',$/);
    if (id) {
      cur = { id: id[1], asin: null, cover: null, local: false, lineIdx: -1 };
      books.push(cur);
      return;
    }
    if (!cur) return;
    const cov = ln.match(/^ {4}coverImage: (.+),$/);
    if (cov && cur.lineIdx === -1) {
      cur.lineIdx = i;
      cur.local = !cov[1].startsWith("'");
      cur.cover = cov[1].replace(/^'|'$/g, '');
    }
    const az = ln.match(/^ {4}amazonUrl: dp\('([^']+)'\),$/);
    if (az && !cur.asin) cur.asin = az[1];
  });
  return { lines, books };
}

const imageIdOf = url => (url.match(/images\/I\/([^.]+)\./) || [])[1] || null;

async function currentAmazonImageId(page, asin) {
  await page.goto(`https://www.amazon.com/dp/${asin}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  return page.evaluate(() => {
    const el =
      document.querySelector('#landingImage') ||
      document.querySelector('#imgBlkFront') ||
      document.querySelector('#ebooksImgBlkFront');
    if (!el) return null;
    const hi = el.getAttribute('data-old-hires') || el.src || '';
    return (hi.match(/images\/I\/([^.]+)\./) || [])[1] || null;
  });
}

const src = await readFile(BOOKS, 'utf8');
const { lines, books } = parseBooks(src);
console.log(`Checking ${books.length} books against Amazon${DRY ? ' (dry run)' : ''}…\n`);

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

let changed = 0;
const failures = [];
const manual = [];

for (const b of books) {
  if (!b.asin) {
    failures.push(`${b.id} — no ASIN`);
    continue;
  }
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  let newId = null;
  try {
    newId = await currentAmazonImageId(page, b.asin);
  } catch (e) {
    failures.push(`${b.id} — ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
  if (!newId) {
    if (!failures.some(f => f.startsWith(b.id))) failures.push(`${b.id} — no image found (bot wall?)`);
    continue;
  }

  const oldId = b.local ? null : imageIdOf(b.cover);
  if (b.local) {
    // Can't rewrite an imported .webp; surface the id so it can be regenerated.
    manual.push({ id: b.id, newId });
    console.log(`  ~ ${b.id.padEnd(28)} local .webp  (Amazon now: ${newId})`);
    continue;
  }
  // Stored ids are URL-encoded (a "+" in an id is written %2B) while Amazon
  // reports them raw, so decode before comparing or every "+" id looks changed.
  const decode = s => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  if (oldId && decode(oldId) === newId) {
    console.log(`  = ${b.id.padEnd(28)} unchanged`);
    continue;
  }
  const url = `https://m.media-amazon.com/images/I/${encodeURIComponent(newId)}.jpg`;
  lines[b.lineIdx] = `    coverImage: '${url}',`;
  changed++;
  console.log(`  ✓ ${b.id.padEnd(28)} ${oldId} -> ${newId}`);
}

await browser.close();

console.log(`\n${changed} cover${changed === 1 ? '' : 's'} changed.`);
if (manual.length) {
  console.log('\nLocal .webp titles (regenerate by hand if the art changed):');
  for (const m of manual) {
    console.log(`  ${m.id}: id ${m.newId}`);
    console.log(
      `    curl -s -o /tmp/c.jpg "https://m.media-amazon.com/images/I/${encodeURIComponent(m.newId)}._SL1000_.jpg" && ` +
        `cwebp -q 82 -resize 700 700 /tmp/c.jpg -o src/assets/covers/${m.id}.webp`,
    );
  }
}
if (failures.length) {
  console.warn(`\n⚠️  ${failures.length} lookup(s) failed (left untouched):\n  ` + failures.join('\n  '));
}

if (changed && !DRY) {
  await writeFile(BOOKS, lines.join('\n'));
  console.log(`\nWrote ${path.relative(process.cwd(), BOOKS)}. Review with: git diff src/data/books.ts`);
} else if (changed) {
  console.log('\nDry run — no files written.');
}
