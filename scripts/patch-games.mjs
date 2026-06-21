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
  function track() {
    // Fire the same "Activity Complete" Plausible event the React app sends,
    // via the script-less events API so games stay zero-external on load (this
    // request only fires on the completion click, not on page load).
    try {
      fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          name: 'Activity Complete',
          url: location.href,
          domain: 'storytimewitheva.com',
          props: { activity: SLUG }
        })
      });
    } catch (e) {}
  }
  function markDone() {
    var p = load();
    p.booksRead = Array.isArray(p.booksRead) ? p.booksRead : [];
    p.booksWantToRead = Array.isArray(p.booksWantToRead) ? p.booksWantToRead : [];
    p.activitiesCompleted = Array.isArray(p.activitiesCompleted) ? p.activitiesCompleted : [];
    var already = p.activitiesCompleted.indexOf(SLUG) > -1;
    if (!already) p.activitiesCompleted.push(SLUG);
    localStorage.setItem(KEY, JSON.stringify(p));
    try { window.dispatchEvent(new CustomEvent('progresschange')); } catch (e) {}
    if (!already) track();
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

  // 1b. Self-host the font: drop the Google Fonts (Nunito) CDN @import and use
  //     the site's Lexend (self-hosted in /games/lexend.woff2) for consistency
  //     and to avoid the external request. (Tailwind CDN is left as-is for now.)
  const GFONTS_IMPORT =
    "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');";
  const LEXEND_FACE =
    "@font-face{font-family:'Lexend';src:url('/games/lexend.woff2') format('woff2');font-weight:100 900;font-display:swap;}";
  if (html.includes(GFONTS_IMPORT)) {
    html = html.replace(GFONTS_IMPORT, LEXEND_FACE);
    changed = true;
  }
  if (html.includes("font-family: 'Nunito'")) {
    html = html.replaceAll("font-family: 'Nunito'", "font-family: 'Lexend'");
    changed = true;
  }

  // 1c. Replace Tailwind Play CDN with static built CSS (not meant for production).
  const TW_CDN = '<script src="https://cdn.tailwindcss.com"></script>';
  const TW_LOCAL = '<link rel="stylesheet" href="/games/games.css">';
  if (html.includes(TW_CDN)) {
    html = html.replace(TW_CDN, TW_LOCAL);
    changed = true;
  }

  // 2. Inject (or refresh) the progress-sync + analytics script. Strip any
  //    previously-injected block first so re-running upgrades it in place.
  const existingBlock = new RegExp(`\\n?<!-- ${MARKER}[\\s\\S]*?</script>\\n?`);
  html = html.replace(existingBlock, '\n');
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${syncSnippet(slug)}</body>`);
  } else {
    console.warn(`⚠️  ${file}: no </body> found, appended at end`);
    html += syncSnippet(slug);
  }
  changed = true; // always (re)write the current snippet

  if (changed) {
    await writeFile(full, html);
    patched++;
    console.log(`patched ${file} (slug: ${slug})`);
  }
}
console.log(`Done. ${patched}/${files.length} game files patched.`);

// Safety net: the Tailwind Play CDN must never ship to production. The replace
// above is an exact-string match, so a slightly different tag would slip
// through silently — assert here instead.
const offenders = [];
for (const file of files) {
  const html = await readFile(path.join(GAMES_DIR, file), 'utf8');
  if (html.includes('cdn.tailwindcss.com')) offenders.push(file);
}
if (offenders.length) {
  console.error(`\n❌ Tailwind Play CDN still present in: ${offenders.join(', ')}`);
  process.exit(1);
}
