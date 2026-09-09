// S5-012 / S5-013 / S5-014 / S5-004: the report is repeatable, segments by locale/placement/age/theme,
// warns below the minimum sample, classifies only with enough data, and surfaces unknown ids.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { ROOT } from '../funnel/_manifest.mjs';

const run = (extra = '') => execSync(`node scripts/report-funnels.mjs --fixture tests/analytics/fixtures/events.json ${extra}`, { cwd: ROOT, stdio: 'pipe' }).toString();

test('report — every funnel appears with step counts and rates', () => {
  const md = run();
  assert.match(md, /Discovery → detail → purchase intent → retailer click \(intent\)/);
  assert.match(md, /\| Purchase CTA View \{"placement":"detail"\} \| 280 \| 67\.5% \|/);
  assert.match(md, /\| Purchase Click \| 50 \| 17\.9% \|/);
  assert.match(md, /Newsletter: view → start → submit → lead \(outcome\)/);
});

test('report — segments by placement, locale and age band; warns below the minimum sample', () => {
  const md = run();
  assert.match(md, /By placement: home 67/);
  assert.match(md, /\| fr \| 80 \| 2 \| 2\.5% \|/);
  assert.match(md, /ages-\d-\d \d+/, 'age-band segmentation from book ids');
  assert.match(md, /cloud-collector[^\n]*below minimum sample|20 ⚠︎ below minimum sample/);
});

test('report — classifies only books with enough views and surfaces unknown book ids (S5-004, S5-014)', () => {
  const md = run();
  assert.match(md, /\| mayas-shadow \| 300 \| 38 \| 12\.7% \|/);
  assert.match(md, /\| leo-and-the-wolf \| 90 \| 12 \| 13\.3% \|/);
  assert.ok(!/\| cloud-collector \| 20/.test(md), 'a book under the minimum sample is not classified');
  assert.match(md, /2 book\(s\) below the minimum sample are not classified/);
  assert.match(md, /unknown book id\(s\) in the data: not-a-book/);
});

test('report — states range, schema version, minimum sample and known gaps', () => {
  const md = run();
  assert.match(md, /Event schema version 1/);
  assert.match(md, /Minimum sample 50/);
  assert.match(md, /Retailer purchases are not observable/);
});

test('report — without data it says so instead of inventing numbers', () => {
  const md = execSync('node scripts/report-funnels.mjs', { cwd: ROOT, stdio: 'pipe', env: { ...process.env, PLAUSIBLE_API_KEY: '' } }).toString();
  assert.match(md, /## No data/);
});
