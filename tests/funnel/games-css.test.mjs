// The static games' stylesheet is a committed build artifact (public/games/games.css). The
// games build some classes dynamically (data-driven colors, grid column counts), which a
// content scan cannot see; Tailwind 4 declares them with @source inline in
// scripts/games-tw-input.css. This test fails if any class a game can produce is missing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './_manifest.mjs';

const css = readFileSync(path.join(ROOT, 'public', 'games', 'games.css'), 'utf8');
const has = (cls) => css.includes(`.${cls.replace(/[:/.]/g, (c) => '\\' + c)}{`) || css.includes(`.${cls.replace(/[:/.]/g, (c) => '\\' + c)},`);

test('games css — every dynamic color and grid class the games can build exists in the stylesheet', () => {
  const colors = 'slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky blue indigo violet purple fuchsia pink rose'.split(' ');
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  const missing = [];
  for (const prefix of ['bg', 'text', 'border']) for (const c of colors) for (const s of shades) if (!has(`${prefix}-${c}-${s}`)) missing.push(`${prefix}-${c}-${s}`);
  for (let n = 1; n <= 12; n++) if (!has(`grid-cols-${n}`)) missing.push(`grid-cols-${n}`);
  assert.deepEqual(missing.slice(0, 10), [], `${missing.length} dynamic classes missing from games.css`);
});

test('games css — every literal class in the game HTML that looks like a Tailwind color/grid/rounded/shadow utility exists', () => {
  const missing = new Set();
  for (const f of readdirSync(path.join(ROOT, 'public', 'games')).filter((x) => x.endsWith('.html'))) {
    const html = readFileSync(path.join(ROOT, 'public', 'games', f), 'utf8');
    for (const m of html.matchAll(/class="([^"]*)"/g)) for (const cls of m[1].split(/\s+/)) {
      if (/^(bg|text|border|from|to)-[a-z]+-\d{2,3}$|^grid-cols-\d+$|^rounded(-[a-z0-9]+)?$|^shadow(-[a-z0-9]+)?$/.test(cls) && !has(cls)) missing.add(`${f}: ${cls}`);
    }
  }
  assert.deepEqual([...missing].slice(0, 10), [], `${missing.size} literal classes missing`);
});

test('games css — built with Tailwind 4 (no Play CDN, v4 signature present)', () => {
  assert.ok(css.includes('@property --tw-shadow') || css.includes('--tw-shadow'), 'v4 signature');
  for (const f of readdirSync(path.join(ROOT, 'public', 'games')).filter((x) => x.endsWith('.html'))) {
    assert.ok(!readFileSync(path.join(ROOT, 'public', 'games', f), 'utf8').includes('cdn.tailwindcss.com'), `${f}: Play CDN`);
  }
});
