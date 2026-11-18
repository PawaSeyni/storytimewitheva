// Renders the Pinterest images for the 60 kit pins and the 5 repeat-winner pins listed in
// docs/marketing/tracker-pinterest-pins-2026-11-18.csv: P-111 to P-175, numbered in posting-date
// order (renumbered 2026-11-18; P-078 to P-110 belong to earlier pins in the master tracker).
// Repeat-winner pins: P-111, P-116, P-121, P-126, P-131.
//   node scripts/make-kit-pins.mjs [P-088 ...]
// Output: public/pins/<id>_kit_<book>_<lang>.jpg (or <id>_lm_<magnet>_<lang>.jpg), 1000 x 1500,
// in the layout of the existing book pins (P-055 to P-077): cream background, blue pill, the
// cover in the pin's language, the title, a short promise, the site name. The text promises
// only what the kit or offer page delivers (KIT_PINS_2026-11.md, REPEAT_WINNERS_2026-11.md).
// Books without a local cover file are skipped and reported.
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { loadCatalog } from './lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import(pathToFileURL('/opt/node22/lib/node_modules/playwright/index.mjs').href).catch(() => ({}))); }
if (!chromium) { console.error('make-kit-pins: playwright is not available'); process.exit(1); }

// Minimal CSV reader (quoted fields, doubled quotes, CRLF).
function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f.replace(/\r$/, '')); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

const T = {
  kitPill: { en: 'Free activity kit', es: 'Actividades gratis', fr: 'Activités gratuites' },
  kitLead: { en: 'After you read it together', es: 'Para después de leer juntos', fr: 'Pour après la lecture' },
  kitItems: {
    en: ['Two-page story worksheet to print', "Pixel's picture quiz, read aloud", 'Story-word flashcards in 3 languages'],
    es: ['Ficha del cuento de dos páginas', 'El quiz de Pixel, con dibujos y voz', 'Tarjetas de palabras en 3 idiomas'],
    fr: ['Fiche de lecture de deux pages', 'Le quiz de Pixel, en images et à voix haute', 'Cartes de mots en 3 langues'],
  },
  ages: { en: (a, b) => `Ages ${a} to ${b}`, es: (a, b) => `De ${a} a ${b} años`, fr: (a, b) => `De ${a} à ${b} ans` },
  sent: { en: 'Sent free by email', es: 'Gratis, por correo', fr: 'Gratuit, par e-mail' },
  lmPill: { en: 'Free printable', es: 'Imprimible gratis', fr: 'À imprimer, gratuit' },
};
// Repeat-winner offers: headline = the pin overlay in REPEAT_WINNERS_2026-11.md; bullets = the
// landing page's own bullets (src/components/EmailSignup.tsx), minus any language claim the
// starter kit can't back (see SW-020).
const OFFERS = {
  'bilingual-flashcards': {
    image: '/previews/bilingual-flashcards.webp',
    headline: { es: '30 tarjetas en 3 idiomas', fr: '30 cartes en 3 langues' },
    items: {
      es: ['Animales, colores y números', 'Español, inglés y francés en cada tarjeta', 'Imprimir, recortar, listo'],
      fr: ['Animaux, couleurs et chiffres', 'Français, anglais et espagnol sur chaque carte', 'Imprimer, découper, terminé'],
    },
  },
  'bilingual-bundle': {
    image: '/previews/bilingual-bundle.webp',
    headline: { es: '5 imprimibles bilingües', fr: '5 ressources bilingues' },
    items: {
      es: ['Kit de inicio y 30 tarjetas', 'Rutina de dormir y guía para padres', '5 actividades para después del cuento'],
      fr: ['Kit de démarrage et 30 cartes', 'Routine du soir et guide des parents', '5 activités pour après l’histoire'],
    },
  },
};
const P121 = { fr: 'Pour la classe ou la maison' }; // P-121's own overlay line (classroom angle; was P-139)

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Inlined as data URIs: a page set with setContent cannot load file:// URLs.
const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`;
const lexend = dataUri(path.join(ROOT, 'node_modules/@fontsource-variable/lexend/files/lexend-latin-wght-normal.woff2'), 'font/woff2');
const TYPES = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const fileUrl = (p) => dataUri(path.join(PUB, p), TYPES[path.extname(p)] || 'application/octet-stream');

function page({ pill, imageUrl, imageShape, title, lead, items, footLine }) {
  const imgBox = imageShape === 'square' ? 'width:620px;height:620px;object-fit:cover;' : 'max-width:760px;max-height:720px;object-fit:contain;background:#fff;';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Lexend;src:url(${lexend}) format('woff2');font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1000px;height:1500px;font-family:Lexend,sans-serif;color:#2A2018;
  background:linear-gradient(180deg,#FBF6EC 0%,#F7EBD3 60%,#F2D08A 135%);display:flex;flex-direction:column;align-items:center;position:relative}
.main{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:96px}
.pill{margin-top:58px;background:#3B5E7A;color:#FBF6EC;border-radius:40px;padding:14px 38px;font-size:31px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.img{margin-top:0;${imgBox}border-radius:18px;box-shadow:0 18px 40px rgba(42,32,24,.25)}
h1{margin:38px 70px 0;font-family:'Liberation Serif',Georgia,serif;font-weight:700;text-align:center;line-height:1.08;font-size:var(--fs)}
.rule{margin-top:20px;display:flex;align-items:center;gap:14px;color:#E8A053;font-size:24px}
.rule:before,.rule:after{content:"";width:100px;height:2px;background:#E8A053}
.lead{margin-top:14px;font-family:'Liberation Serif',Georgia,serif;font-style:italic;color:#3B5E7A;font-size:36px}
ul{list-style:none;margin-top:22px;display:flex;flex-direction:column;gap:14px}
li{display:flex;align-items:center;gap:16px;font-size:31px;font-weight:500}
li b{flex:none;width:40px;height:40px;border-radius:50%;background:#E8A053;color:#fff;display:grid;place-items:center;font-size:24px;font-weight:700}
.foot2{margin-top:24px;font-size:29px;font-weight:500;color:#2A2018}
.site{position:absolute;bottom:0;left:0;right:0;height:78px;border-top:2px solid #EAD9B4;background:#FBF6EC;display:grid;place-items:center;font-size:31px;font-weight:500}
</style></head><body>
<div class="pill">${esc(pill)}</div>
<div class="main"><img class="img" src="${imageUrl}" alt="">
<h1>${esc(title)}</h1>
<div class="rule">★</div>
${lead ? `<div class="lead">${esc(lead)}</div>` : ''}
<ul>${items.map((t) => `<li><b>✓</b>${esc(t)}</li>`).join('')}</ul>
<div class="foot2">${esc(footLine)}</div></div>
<div class="site">storytimewitheva.com</div>
</body></html>`;
}

const pins = parseCsv(readFileSync(path.join(ROOT, 'docs/marketing/tracker-pinterest-pins-2026-11-18.csv'), 'utf8'));
const only = process.argv.slice(2).filter((a) => /^P-\d+$/.test(a));
const { books } = await loadCatalog();
const byId = Object.fromEntries(books.map((b) => [b.id, b]));
mkdirSync(path.join(PUB, 'pins'), { recursive: true });

// In the cloud container the project's Playwright may not match the installed browser.
const browser = await chromium.launch(existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const ctx = await browser.newContext({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
const page1 = await ctx.newPage();
const made = [], skipped = [];
for (const p of pins) {
  const id = p['Pin ID']; if (only.length && !only.includes(id)) continue;
  const lang = p.Language.toLowerCase();
  let html, out;
  if (p.Book) {
    const b = byId[p.Book]; if (!b) { skipped.push(`${id}: unknown book ${p.Book}`); continue; }
    const cover = b.editions?.[lang]?.cover || b.editions?.en?.cover;
    if (!cover || !cover.startsWith('/') || !existsSync(path.join(PUB, cover))) { skipped.push(`${id}: no local cover for ${p.Book}`); continue; }
    const [a1, a2] = String(b.ageRange).split('-');
    const title = b.title[lang] || b.title.en;
    html = page({ pill: T.kitPill[lang], imageUrl: fileUrl(cover), imageShape: 'square', title, lead: T.kitLead[lang], items: T.kitItems[lang], footLine: `${T.ages[lang](a1, a2)}  ·  ${T.sent[lang]}` });
    out = `pins/${id}_kit_${p.Book}_${lang}.jpg`;
  } else {
    const slug = p['Lead magnet (slug)']; const o = OFFERS[slug];
    if (!o || !o.headline[lang]) { skipped.push(`${id}: no offer layout for ${slug} ${lang}`); continue; }
    html = page({ pill: T.lmPill[lang], imageUrl: fileUrl(o.image), imageShape: 'contain', title: o.headline[lang], lead: id === 'P-121' ? P121[lang] : '', items: o.items[lang], footLine: T.sent[lang] });
    out = `pins/${id}_lm_${slug}_${lang}.jpg`;
  }
  await page1.setContent(html, { waitUntil: 'load' });
  if (!(await page1.$eval('img.img', (i) => i.complete && i.naturalWidth > 0))) throw new Error(`${id}: image did not load`);
  await page1.evaluate(async () => {
    await document.fonts.ready;
    if (!document.fonts.check('500 31px Lexend')) throw new Error('Lexend did not load');
    const h = document.querySelector('h1'); let fs = 64; h.style.setProperty('--fs', fs + 'px');
    while (h.getBoundingClientRect().height > 150 && fs > 40) { fs -= 2; h.style.setProperty('--fs', fs + 'px'); }
    const foot = document.querySelector('.foot2').getBoundingClientRect();
    if (foot.bottom > 1500 - 90) throw new Error('layout overflow');
  });
  await page1.screenshot({ path: path.join(PUB, out), type: 'jpeg', quality: 86 });
  made.push(out);
}
await browser.close();
console.log(`make-kit-pins: ${made.length} made, ${skipped.length} skipped`);
for (const s of skipped) console.log('  skipped ' + s);
