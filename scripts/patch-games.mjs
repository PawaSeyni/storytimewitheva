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
import { loadCatalog, loadJourney, loadBookVocab } from './lib/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_DIR = path.resolve(__dirname, '..', 'public', 'games');
const MARKER = 'STE_PROGRESS_SYNC';
const CONTINUE_MARKER = 'STE_CONTINUE';

// 3. Continue-the-journey block (Sprint 4 S4-011 / punch list CJ-04). The games are
//    static HTML, so the next step is resolved HERE, at patch time, by the same
//    src/lib/journey.ts the activity pages use — one rule, not two. The block carries
//    the book's EN/FR/ES titles and a tiny script that labels the link in the game's
//    language (window.GAME_LANG, set by i18n.js in <head>). The href stays the
//    unprefixed site path; i18n.js's link localizer prefixes it for FR/ES, exactly as it
//    does for the nav. Inserted before <footer>, i.e. after play, where the dead end was.
const { books } = await loadCatalog();
const { nextStep } = await loadJourney();
const bookTitles = new Map(books.map((b) => [b.id, b.title]));

// Audit 2026-11 P0: book pages open games with ?book=<id>. The continuation for each
// referring book is resolved HERE by the same journey.ts rule the activity pages use
// (nextStep with fromBook), and baked as a small map. At runtime the inline script picks
// the entry for the URL's book, re-points "Read next", and adds "Back to <book>". An id
// that is not in the map (unrelated, invented) leaves the default block untouched.
// Word games (audit 2026-11, bookVocab): opened from ANY book's "Story words" strip with
// ?book=<id>, so every book with story words is a source book for them, not only the books
// that list the game in relatedActivityIds.
const WORD_GAMES = ['bilingual-flashcards', 'matching', 'spelling-bee'];
const { bookVocab } = await loadBookVocab();
const isSourceBook = (b, slug) => (b.relatedActivityIds ?? []).includes(slug) || (WORD_GAMES.includes(slug) && (bookVocab[b.id] ?? []).length > 0);

const fromBookMap = (slug) => {
  const out = {};
  for (const b of books) {
    if (!isSourceBook(b, slug)) continue;
    // A word game's referrer that does not list the game still continues from that book:
    // nextStep only honours a book that links the activity, so resolve it from the book.
    const step = (b.relatedActivityIds ?? []).includes(slug)
      ? nextStep('activity', slug, b.id)
      : (b.relatedBookIds ?? []).map((id) => ({ type: 'book', id, href: `/books/${id}/` })).find((s) => bookTitles.has(s.id)) ?? { type: 'book', id: b.id, href: `/books/${b.id}/` };
    if (!step || step.type !== 'book') continue;
    out[b.id] = { next: step.href, nextTitles: bookTitles.get(step.id), backTitles: b.title };
  }
  return out;
};

const continueSnippet = (slug) => {
  const step = nextStep('activity', slug);
  if (!step) return '';
  const isBook = step.type === 'book';
  const titles = isBook ? bookTitles.get(step.id) : null;
  const payload = JSON.stringify({ kind: isBook ? 'book' : 'catalog', titles });
  const from = JSON.stringify(fromBookMap(slug));
  return `
<!-- ${CONTINUE_MARKER}: injected by scripts/patch-games.mjs (resolved by src/lib/journey.ts) -->
<section id="ste-continue" class="max-w-7xl mx-auto px-4 mt-10 mb-2" aria-labelledby="ste-continue-eyebrow" data-ste-from='${from.replace(/'/g, '&#39;')}'>
  <p id="ste-continue-eyebrow" data-i18n="continueEyebrow" class="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-2">Continue the journey</p>
  <a href="${step.href}" data-ste-continue='${payload.replace(/'/g, '&#39;')}' class="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-5 py-3 shadow-md hover:shadow-lg transition-all">${isBook ? 'Read next' : 'Browse all books'} <span aria-hidden="true">→</span></a>
</section>
<script>
(function () {
  var a = document.querySelector('#ste-continue a[data-ste-continue]');
  if (!a || typeof window.t !== 'function') return;
  var d; try { d = JSON.parse(a.getAttribute('data-ste-continue')); } catch (e) { return; }
  var L = window.GAME_LANG || 'en';
  var from = {}; try { from = JSON.parse(document.getElementById('ste-continue').getAttribute('data-ste-from') || '{}'); } catch (e) {}
  var src = null; try { src = new URLSearchParams(window.location.search).get('book'); } catch (e) {}
  var f = src && Object.prototype.hasOwnProperty.call(from, src) ? from[src] : null;
  if (f) {
    a.setAttribute('href', f.next);
    d = { kind: 'book', titles: f.nextTitles };
    var back = document.createElement('a');
    back.setAttribute('href', '/books/' + src + '/');
    back.className = 'inline-flex items-center gap-2 rounded-2xl border-2 border-purple-200 text-purple-700 font-semibold px-5 py-3 ml-0 sm:ml-3 mt-3 sm:mt-0 hover:bg-purple-50 transition-all';
    back.textContent = '\u2190 ' + window.t('backTo') + ' ' + (f.backTitles[L] || f.backTitles.en);
    a.parentNode.appendChild(back);
  }
  var label = d.kind === 'book'
    ? window.t('readNext') + ': ' + ((d.titles && (d.titles[L] || d.titles.en)) || '')
    : window.t('browseBooks');
  a.firstChild.nodeValue = label + ' ';
})();
</script>
`;
};

// 4. Story Map catalog data (audit 2026-11 P0). The map shows ONLY Eva Gallo Collection
//    books; their titles, summaries, themes and explorer question (the book's "before"
//    discussion prompt) are baked from the catalog so the static game cannot drift from it.
//    The game file owns placement only (region + pin position per book id).
const STORY_MAP_MARKER = 'STE_STORY_BOOKS';
const storyMapSnippet = () => {
  const data = Object.fromEntries(
    books
      .filter((b) => b.status !== 'coming-soon')
      .map((b) => [b.id, {
        title: b.title,
        description: b.description,
        theme: b.theme,
        ask: (b.discussionQuestions ?? []).find((q) => q.stage === 'before')?.prompt ?? null,
      }]),
  );
  // JSON inside <script>: escape "<" so no string can close the tag early.
  return `\n<!-- ${STORY_MAP_MARKER}: injected by scripts/patch-games.mjs from src/data/books.data.ts -->\n<script>window.STE_STORY_BOOKS = ${JSON.stringify(data).replace(/</g, '\\u003c')};</script>\n`;
};

// 5. Word-game book mode (audit 2026-11): story words for every book + the shared helper.
const VOCAB_MARKER = 'STE_BOOK_VOCAB';
const vocabSnippet = () => {
  const data = Object.fromEntries(
    books.filter((b) => (bookVocab[b.id] ?? []).length > 0).map((b) => [b.id, { title: b.title, words: bookVocab[b.id] }]),
  );
  return `\n<!-- ${VOCAB_MARKER}: injected by scripts/patch-games.mjs from src/data/bookVocab.data.ts -->\n<script>window.STE_BOOK_VOCAB = ${JSON.stringify(data).replace(/</g, '\\u003c')};</script>\n<script src="/games/book-words.js"></script>\n`;
};

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
    var already = p.activitiesCompleted.indexOf(SLUG) > -1;
    if (!already) p.activitiesCompleted.push(SLUG);
    localStorage.setItem(KEY, JSON.stringify(p));
    try { window.dispatchEvent(new CustomEvent('progresschange')); } catch (e) {}
  }
  var btn = document.getElementById('markCompleted');
  if (btn) {
    btn.addEventListener('click', markDone);
    if (isDone()) {
      btn.textContent = window.t('completed');
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

  // 2. Inject (or refresh) the progress-sync script. Strip any previously-
  //    injected block first so re-running upgrades it in place. (An older
  //    version also POSTed an "Activity Complete" event to plausible.io from the
  //    game itself; that direct-from-game beacon was removed so the standalone
  //    games stay zero-external on load — re-running scrubs it from every game.
  //    Site analytics is Plausible, fired from the React app, not these games.)
  // Idempotency, precisely: consume EVERY newline around the old block and put nothing
  // back — the snippet carries its own leading and trailing newline. The previous form
  // (`\n?` … `\n?` replaced by '\n') left one extra blank line per run, forever.
  const existingBlock = new RegExp(`\\n*<!-- ${MARKER}[\\s\\S]*?</script>\\n*`);
  html = html.replace(existingBlock, '');
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${syncSnippet(slug)}</body>`);
  } else {
    console.warn(`⚠️  ${file}: no </body> found, appended at end`);
    html += syncSnippet(slug);
  }
  // 3. Inject (or refresh) the continuation block before the footer. Stripped first so
  //    re-running upgrades it in place, like the sync block.
  const existingContinue = new RegExp(`\\n*<!-- ${CONTINUE_MARKER}[\\s\\S]*?</script>\\n*`);
  html = html.replace(existingContinue, '');
  const snippet = continueSnippet(slug);
  if (snippet) {
    if (html.includes('<footer')) {
      html = html.replace('<footer', `${snippet}<footer`);
    } else {
      console.warn(`⚠️  ${file}: no <footer> found, continuation not injected`);
    }
  }
  // 5. Word games: story words + book-words.js, right after i18n.js (before the game script).
  html = html.replace(new RegExp(`\\n*<!-- ${VOCAB_MARKER}[\\s\\S]*?<script src="/games/book-words.js"></script>\\n*`), '\n');
  if (WORD_GAMES.includes(slug)) {
    const I18N_TAG = '<script src="/games/i18n.js"></script>';
    if (!html.includes(I18N_TAG)) throw new Error(`${file}: i18n.js tag not found`);
    html = html.replace(I18N_TAG, `${I18N_TAG}${vocabSnippet()}`);
  }
  // 4. Story Map data, right after i18n.js so it exists before the game script runs.
  if (slug === 'story-map') {
    html = html.replace(new RegExp(`\\n*<!-- ${STORY_MAP_MARKER}[\\s\\S]*?</script>\\n*`), '\n');
    const I18N_TAG = '<script src="/games/i18n.js"></script>';
    if (!html.includes(I18N_TAG)) throw new Error('story-map.html: i18n.js tag not found');
    html = html.replace(I18N_TAG, `${I18N_TAG}${storyMapSnippet()}`);
  }
  changed = true; // always (re)write the current snippets

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
