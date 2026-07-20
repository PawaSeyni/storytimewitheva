// Site maintenance dashboard.
//
// Runs the health checks we otherwise do by hand after a deploy (live routes,
// real-404 behaviour, SEO surface, analytics/verification tags, cover freshness,
// integration wiring, repo/deploy state) and writes a self-contained HTML report.
//
//   npm run maintenance            # check production
//   npm run maintenance -- --json  # also print machine-readable JSON
//   SITE=https://deploy-preview--x.netlify.app npm run maintenance
//
// Cover-ART freshness (does Amazon have NEW artwork?) needs a real browser and
// lives in `npm run refresh-covers -- --dry`; this dashboard only verifies the
// covers we reference still resolve.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = (process.env.SITE || 'https://storytimewitheva.com').replace(/\/$/, '');
const OUT = path.join(ROOT, 'maintenance-report.html');
const JSON_OUT = process.argv.includes('--json');

const results = [];
const add = (group, name, status, detail) => results.push({ group, name, status, detail });
const bust = u => `${u}${u.includes('?') ? '&' : '?'}cb=${Math.random().toString(36).slice(2)}`;

async function head(url) {
  try {
    const r = await fetch(bust(url), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    return { code: r.status, body: await r.text() };
  } catch (e) {
    return { code: 0, body: '', err: e.message };
  }
}

// ── Live routes ────────────────────────────────────────────────────────────
const ROUTES = ['/', '/books/', '/activities/', '/resources/', '/faq/', '/profile/', '/es/', '/fr/', '/games/matching.html'];
const pages = {};
await Promise.all(
  ROUTES.map(async r => {
    const res = await head(SITE + r);
    pages[r] = res;
    add('Live routes', r, res.code === 200 ? 'pass' : 'fail', res.err || `HTTP ${res.code}`);
  }),
);

// A real 404 (not the old soft-404 that served the homepage)
{
  const res = await head(`${SITE}/this-should-not-exist-xyz/`);
  const soft = res.code === 200 && /How It Works|Discover magical/.test(res.body);
  add('Live routes', 'unknown URL → 404', res.code === 404 ? 'pass' : 'fail', soft ? 'SOFT-404: serving homepage!' : `HTTP ${res.code}`);
}

// ── SEO surface ────────────────────────────────────────────────────────────
{
  const sm = await head(`${SITE}/sitemap.xml`);
  const n = (sm.body.match(/<loc>/g) || []).length;
  add('SEO', 'sitemap.xml', sm.code === 200 && n > 0 ? 'pass' : 'fail', `HTTP ${sm.code}, ${n} URLs`);

  const rb = await head(`${SITE}/robots.txt`);
  const hasMap = /Sitemap:/i.test(rb.body);
  const hasNoIndex = /Disallow:\s*\/profile/.test(rb.body) && /Disallow:\s*\/search/.test(rb.body);
  add('SEO', 'robots.txt', rb.code === 200 && hasMap && hasNoIndex ? 'pass' : 'warn',
      `HTTP ${rb.code}${hasMap ? ', has Sitemap' : ', NO Sitemap line'}${hasNoIndex ? ', /profile+/search disallowed' : ', missing noindex disallows'}`);

  const home = pages['/']?.body || '';
  add('SEO', 'canonical tag', /rel="canonical"/.test(home) ? 'pass' : 'warn', /rel="canonical"/.test(home) ? 'present' : 'missing on homepage');
  const hre = (home.match(/hreflang="/g) || []).length;
  add('SEO', 'hreflang alternates', hre >= 4 ? 'pass' : 'warn', `${hre} hreflang links on homepage`);
  add('SEO', 'Google Search Console tag', /google-site-verification/.test(home) ? 'pass' : 'warn',
      /google-site-verification/.test(home) ? 'verification meta present' : 'meta missing (DNS verification may still cover it)');
  const jsonld = (home.match(/application\/ld\+json/g) || []).length;
  add('SEO', 'JSON-LD blocks', jsonld > 0 ? 'pass' : 'warn', `${jsonld} on homepage`);
}

// ── Analytics ──────────────────────────────────────────────────────────────
{
  const home = pages['/']?.body || '';
  const cf = /cloudflareinsights\.com\/beacon/.test(home);
  add('Analytics', 'Cloudflare Web Analytics beacon', cf ? 'pass' : 'fail', cf ? 'beacon script present' : 'beacon MISSING from homepage');
  const tok = (home.match(/token"?:\s*"?&quot;?([0-9a-f]{20,})/) || home.match(/token&quot;:\s*&quot;([0-9a-f]{20,})/) || [])[1];
  add('Analytics', 'beacon token', tok ? 'pass' : 'warn', tok ? `…${tok.slice(-8)}` : 'could not read token from HTML');
  add('Analytics', 'Plausible removed', /plausible/i.test(home) ? 'warn' : 'pass', /plausible/i.test(home) ? 'stale Plausible reference found' : 'no Plausible references');
}

// ── Covers ─────────────────────────────────────────────────────────────────
{
  const src = await readFile(path.join(ROOT, 'src', 'data', 'books.ts'), 'utf8');
  const urls = [...src.matchAll(/^ {4}coverImage: '([^']+)',$/gm)].map(m => m[1]);
  const localIds = [...src.matchAll(/^ {4}coverImage: ([A-Za-z]\w+),$/gm)].map(m => m[1]);
  const codes = await Promise.all(urls.map(u => head(u).then(r => r.code)));
  const bad = codes.filter(c => c !== 200).length;
  add('Covers', 'Amazon cover URLs resolve', bad === 0 ? 'pass' : 'fail', `${urls.length - bad}/${urls.length} return HTTP 200`);

  const missing = ['colors-mixed-up', 'rainbow-symphony', 'tower-touched-sky'].filter(
    n => !existsSync(path.join(ROOT, 'src', 'assets', 'covers', `${n}.webp`)),
  );
  const sizes = ['colors-mixed-up', 'rainbow-symphony', 'tower-touched-sky']
    .filter(n => existsSync(path.join(ROOT, 'src', 'assets', 'covers', `${n}.webp`)))
    .map(n => Math.round(statSync(path.join(ROOT, 'src', 'assets', 'covers', `${n}.webp`)).size / 1024));
  add('Covers', 'local .webp featured covers', missing.length === 0 ? 'pass' : 'fail',
      missing.length ? `missing: ${missing.join(', ')}` : `${localIds.length} local (${sizes.join('/')} KB)`);
  add('Covers', 'cover ART freshness', 'info', 'run `npm run refresh-covers -- --dry` (needs a browser; Amazon blocks plain HTTP)');
}

// ── Integrations ───────────────────────────────────────────────────────────
{
  const idx = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  const signup = await readFile(path.join(ROOT, 'src', 'components', 'EmailSignup.tsx'), 'utf8');
  const ml = (signup.match(/assets\.mailerlite\.com\/jsonp\/(\d+)\/forms\/(\d+)/) || []);
  add('Integrations', 'MailerLite form wired', ml[1] ? 'pass' : 'fail', ml[1] ? `account ${ml[1]}, form ${ml[2]}` : 'form action not found');
  const forms = ['name="contact"', 'name="feedback"'].filter(f => idx.includes(f));
  add('Integrations', 'Netlify form placeholders', forms.length === 2 ? 'pass' : 'warn', `${forms.length}/2 registered in index.html`);
  const hp = /netlify-honeypot/.test(idx);
  add('Integrations', 'form honeypot', hp ? 'pass' : 'warn', hp ? 'configured' : 'no netlify-honeypot attribute');
}

// ── Repo / deploy ──────────────────────────────────────────────────────────
{
  const sh = c => { try { return execSync(c, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return ''; } };
  const dirty = sh('git status --porcelain');
  add('Repo', 'working tree', dirty ? 'warn' : 'pass', dirty ? `${dirty.split('\n').length} uncommitted change(s)` : 'clean');
  sh('git fetch -q origin main');
  const local = sh('git rev-parse HEAD');
  const remote = sh('git rev-parse origin/main');
  add('Repo', 'main vs origin/main', local && local === remote ? 'pass' : 'warn',
      local === remote ? `in sync (${local.slice(0, 7)})` : 'local differs from origin/main (unpushed or behind)');
  add('Repo', 'last commit', 'info', sh('git log -1 --pretty=%h\\ %s') || 'unknown');
}

// ── Render ─────────────────────────────────────────────────────────────────
const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
const overall = counts.fail ? 'FAIL' : counts.warn ? 'WARN' : 'PASS';
const groups = [...new Set(results.map(r => r.group))];
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const COLOR = { pass: '#15803d', warn: '#b45309', fail: '#b91c1c', info: '#475569' };
const BG = { pass: '#dcfce7', warn: '#fef3c7', fail: '#fee2e2', info: '#e2e8f0' };

const html = `<!doctype html><meta charset="utf-8"><title>Site maintenance — storytimewitheva</title>
<style>
 body{font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f8fafc;color:#0f172a}
 .wrap{max-width:900px;margin:0 auto;padding:32px 20px 60px}
 h1{margin:0 0 4px;font-size:26px}.sub{color:#64748b;margin:0 0 24px;font-size:13px}
 .banner{display:inline-block;padding:6px 14px;border-radius:999px;font-weight:700;font-size:13px;
   background:${BG[overall.toLowerCase()] || '#e2e8f0'};color:${COLOR[overall.toLowerCase()] || '#475569'}}
 h2{font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#64748b;margin:28px 0 8px}
 table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.06)}
 td{padding:9px 12px;border-top:1px solid #f1f5f9;vertical-align:top}
 tr:first-child td{border-top:0}
 .b{display:inline-block;min-width:44px;text-align:center;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}
 .n{font-weight:600;width:40%}.d{color:#475569;font-size:13px}
 code{background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:12px}
</style>
<div class="wrap">
<h1>Site maintenance</h1>
<p class="sub">${esc(SITE)} · ${new Date().toLocaleString()} · <span class="banner">${overall}</span>
 &nbsp;${counts.pass || 0} pass · ${counts.warn || 0} warn · ${counts.fail || 0} fail</p>
${groups
  .map(
    g => `<h2>${esc(g)}</h2><table>${results
      .filter(r => r.group === g)
      .map(
        r =>
          `<tr><td><span class="b" style="background:${BG[r.status]};color:${COLOR[r.status]}">${r.status.toUpperCase()}</span></td>` +
          `<td class="n">${esc(r.name)}</td><td class="d">${esc(r.detail)}</td></tr>`,
      )
      .join('')}</table>`,
  )
  .join('')}
<h2>Routine tasks</h2><table>
<tr><td class="d"><code>npm run refresh-covers -- --dry</code></td><td class="d">check Amazon for new cover art</td></tr>
<tr><td class="d"><code>npm run build</code></td><td class="d">full build + prerender (required; fails deploy if prerender breaks)</td></tr>
<tr><td class="d"><code>npm run maintenance</code></td><td class="d">regenerate this report</td></tr>
</table>
</div>`;

await writeFile(OUT, html);
console.log(`\n  ${overall}  —  ${counts.pass || 0} pass · ${counts.warn || 0} warn · ${counts.fail || 0} fail`);
for (const r of results.filter(r => r.status === 'fail' || r.status === 'warn')) {
  console.log(`   ${r.status.toUpperCase().padEnd(4)} ${r.group}/${r.name}: ${r.detail}`);
}
console.log(`\n  report: ${path.relative(process.cwd(), OUT)}`);
if (JSON_OUT) console.log('\n' + JSON.stringify({ site: SITE, overall, counts, results }, null, 2));
process.exit(counts.fail ? 1 : 0);
