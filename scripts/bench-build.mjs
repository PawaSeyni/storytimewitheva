// S8-006 build benchmark: times every build step and measures the output.
// Repeatable: node scripts/bench-build.mjs [--json]   (runs a full build; ~1-3 min)
import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STEPS = [
  ['gen:downloads', 'npm run --silent gen:downloads'],
  ['gen:sitemap', 'npm run --silent gen:sitemap'],
  ['tsc', 'npx tsc'],
  ['vite build', 'npx vite build'],
  ['gen:version', 'npm run --silent gen:version'],
  ['prerender', 'npm run --silent prerender'],
];
const timings = {};
for (const [name, cmd] of STEPS) {
  const t0 = performance.now();
  execSync(cmd, { cwd: ROOT, stdio: 'pipe' });
  timings[name] = Math.round(performance.now() - t0) / 1000;
}
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(path.join(ROOT, 'dist'));
const sum = (fs) => fs.reduce((n, f) => n + statSync(f).size, 0);
const gz = (fs) => fs.reduce((n, f) => n + gzipSync(readFileSync(f)).length, 0);
const by = (re) => files.filter((f) => re.test(f));
const js = by(/\/assets\/[^/]+\.js$/);
const out = {
  timings,
  totalSeconds: Object.values(timings).reduce((a, b) => a + b, 0),
  routes: by(/index\.html$/).length,
  dist: {
    totalMB: +(sum(files) / 1048576).toFixed(1),
    jsKB: Math.round(sum(js) / 1024), jsGzipKB: Math.round(gz(js) / 1024),
    largestJsGzipKB: Math.max(...js.map((f) => Math.round(gzipSync(readFileSync(f)).length / 1024))),
    cssGzipKB: Math.round(gz(by(/\.css$/)) / 1024),
    htmlMB: +(sum(by(/\.html$/)) / 1048576).toFixed(1),
    imagesMB: +(sum(by(/\.(webp|jpg|jpeg|png|svg)$/)) / 1048576).toFixed(1),
    pinsMB: +(sum(by(/\/pins\//)) / 1048576).toFixed(1),
    pdfMB: +(sum(by(/\.pdf$/)) / 1048576).toFixed(1),
    gamesKB: Math.round(sum(by(/\/games\//)) / 1024),
  },
};
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else {
  for (const [k, v] of Object.entries(timings)) console.log(`${k.padEnd(14)} ${v}s`);
  console.log(`total          ${out.totalSeconds.toFixed(1)}s (${out.routes} routes)`);
  console.log(JSON.stringify(out.dist));
}
