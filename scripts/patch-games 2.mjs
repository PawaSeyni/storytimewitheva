// Patches the standalone game HTML files in public/games so they integrate with
// the site, without porting them. Idempotent — safe to re-run after re-copying
// games. Two changes per file:
//   1. Wire the existing "Mark Completed" button to the shared progress store
//      (localStorage 'readingProgress' .activitiesCompleted[]), keyed by the
//      game's slug (= filename) which matches src/data/activities.ts. This makes
//      completion show on the site Profile and flip the Activities "Completed"
//      badge. Also reflects completed state on load.
//   2. Point the "Get Free Kit" CTA (href="#signup", a dead in-page anchor) at
//      the real home signup section (/#email-signup).

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_DIR = path.resolve(__dirname, '..', 'public', 'games');
const MARKER = 'STE_PROGRESS_SYNC';

const syncSnippet = (slug) => `
<!-- ${MARKER}: injected by scripts/patch-games.mjs -->
<script>
(function () {
  var SLUG = ${JSON.stringify(slug)};
  var KEY = 'readingProgress';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function isDone() { var p = load(); return Array.isArray(p.activitiesCompleted) && p.activitiesCompleted.indexOf(SLUG) > -1; }
  function markDone() {
    var p = load();
    p.booksRead = Array.isArray(p.booksRead) ? p.booksRead : [];
    p.booksWantToRead = Array.isArray(p.booksWantToRead) ? p.booksWantToRead : [];
    p.activitiesCompleted = Array.isArray(p.activitiesCompleted) ? p.activitiesCompleted : [];
    if (p.activitiesCompleted.indexOf(SLUG) < 0) p.activitiesCompleted.push(SLUG);
    localStorage.setItem(KEY, JSON.stringify(p));
    try { window.dispatchEvent(new CustomEvent('progresschange')); } catch (e) {}
  }
  var btn = document.getElementById('markCompleted');
  if (btn) {
    btn.addEventListener('click', markDone);
    if (isDone()) {
      btn.textContent = '✅ Completed!';
      btn.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }
  }
})();
</script>
`;

const files = (await readdir(GAMES_DIR)).filter((f) => f.endsWith('.html'));
let patched = 0;
for (const file of files) {
  const slug = file.replace(/\.html$/, '');
  const full = path.join(GAMES_DIR, file);
  let html = await readFile(full, 'utf8');
  let changed = false;

  // 1. Fix the dead signup anchor.
  if (html.includes('href="#signup"')) {
    html = html.replaceAll('href="#signup"', 'href="/#email-signup"');
    changed = true;
  }

  // 2. Inject the progress-sync script once.
  if (!html.includes(MARKER)) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${syncSnippet(slug)}</body>`);
      changed = true;
    } else {
      console.warn(`⚠️  ${file}: no </body> found, appended at end`);
      html += syncSnippet(slug);
      changed = true;
    }
  }

  if (changed) {
    await writeFile(full, html);
    patched++;
    console.log(`patched ${file} (slug: ${slug})`);
  }
}
console.log(`Done. ${patched}/${files.length} game files patched.`);
