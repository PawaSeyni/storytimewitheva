// Copy checks on the built pages. House style for published English copy: no em dashes (site audit 2026-11-18, finding 4 /
// SW-025). Checks the visible text, title and meta description of every indexable English page
// in the built dist/. Spanish and French pages are not checked: their typography uses dashes
// for dialogue and the house rule is stated for English.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');

function englishPages(dir = DIST, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (dir === DIST && ['es', 'fr', 'games', 'assets'].includes(name)) continue;
      englishPages(p, out);
    } else if (name === 'index.html') out.push(p);
  }
  return out;
}

const visibleText = (html) => {
  const head = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const body = (html.split(/<body[^>]*>/)[1] || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ');
  return `${head}\n${desc}\n${body}`;
};

test('no em dash in the visible copy of indexable English pages', { skip: !existsSync(path.join(DIST, 'index.html')) && 'dist/ not built' }, () => {
  const offenders = [];
  for (const file of englishPages()) {
    const html = readFileSync(file, 'utf8');
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
    const text = visibleText(html);
    const i = text.indexOf('—');
    if (i >= 0) offenders.push(`${path.relative(DIST, file)}: "${text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ').trim()}"`);
  }
  assert.deepEqual(offenders, [], `em dashes in English copy:\n${offenders.join('\n')}`);
});

// Meta descriptions fit a search result (SW-026): every indexable page, all three languages.
test('every indexable page has a meta description of 160 characters or fewer', { skip: !existsSync(path.join(DIST, 'index.html')) && 'dist/ not built' }, () => {
  const all = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) { if (!(dir === DIST && ['games', 'assets'].includes(name))) walk(p); } else if (name === 'index.html') all.push(p);
    }
  })(DIST);
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const long = [];
  for (const file of all) {
    const html = readFileSync(file, 'utf8');
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
    const d = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
    if (!d) long.push(`${path.relative(DIST, file)}: missing`);
    else if ([...d].length > 160) long.push(`${path.relative(DIST, file)}: ${[...d].length}`);
  }
  assert.deepEqual(long, []);
});
