// Render the social brand assets (HTML -> PNG) at exact dimensions using the
// project's bundled headless Chromium (puppeteer). Run: node brand/render.mjs
import puppeteer from 'puppeteer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));

const jobs = [
  { html: 'avatar.html', out: 'youtube-avatar.png', w: 800, h: 800 },
  { html: 'banner.html', out: 'youtube-banner.png', w: 2048, h: 1152 },
];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
for (const j of jobs) {
  const page = await browser.newPage();
  await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, j.html), { waitUntil: 'networkidle0' });
  try { await page.evaluateHandle('document.fonts.ready'); } catch {}
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: path.join(dir, j.out), type: 'png' });
  await page.close();
  console.log('wrote', j.out, `(${j.w}x${j.h})`);
}
await browser.close();
