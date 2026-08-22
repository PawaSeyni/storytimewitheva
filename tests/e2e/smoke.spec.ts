// Layers 1, 5.1, 6.1 — production smoke. Tagged @smoke. Runs against LIVE
// production because these are Netlify-runtime behaviours. This is the automated
// version of the destination pre-flight that would have caught the 2026-08-03
// raw-PDF flight (~CA$35, zero pageviews).
import { test, expect } from '@playwright/test';

const MAGNETS = [
  'bedtime-routine',
  'bilingual-starter-kit',
  'bilingual-bundle',
  'bilingual-flashcards',
  'parents-guide',
  'follow-up-activities',
];
const LOCALES = ['', '/es', '/fr'];
// magnet slugs that actually resolve to a /download/ rule (PDF-prefixed)
const DOWNLOAD_MAGNETS = [
  'bedtime-routine',
  'parents-guide',
  'follow-up-activities',
  'bilingual-flashcards',
  'bilingual-starter-kit',
];

test.describe('@smoke Layer 1 — route coverage', () => {
  for (const prefix of LOCALES) {
    for (const magnet of MAGNETS) {
      test(`1.1/6.1 ${prefix || '/'} free/${magnet} is a real HTML offer page`, async ({ page }) => {
        const resp = await page.goto(`${prefix}/free/${magnet}`, { waitUntil: 'domcontentloaded' });
        expect(resp?.status(), 'HTTP status').toBe(200);
        // 6.1a — must be HTML, never a PDF served as the destination.
        expect(resp?.headers()['content-type'] || '').toContain('text/html');
        // 6.1b — the offer must present an email capture.
        await expect(page.locator('#email-signup input[type="email"]')).toBeVisible();
        // capable-of-converting: a headline is rendered, not an empty #root.
        await expect(page.locator('#email-signup h2').first()).not.toBeEmpty();
        // 6.1e — analytics is present on the page.
        expect(await page.evaluate(() => typeof (window as unknown as { plausible?: unknown }).plausible)).toBe('function');
      });
    }
  }

  test('1.2 unknown magnet renders a real 404, never a default offer', async ({ page }) => {
    for (const prefix of LOCALES) {
      const resp = await page.request.get(`${prefix}/free/not-a-real-magnet`);
      expect(resp.status(), `${prefix}/free/not-a-real-magnet`).toBe(404);
    }
  });

  test('1.3 landing routes are noindex', async ({ page }) => {
    await page.goto('/free/parents-guide', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test.describe('@smoke Layer 5 — delivery', () => {
  for (const magnet of DOWNLOAD_MAGNETS) {
    for (const lang of ['en', 'es', 'fr']) {
      const q = lang === 'en' ? '' : `?lang=${lang}`;
      test(`5.1 /download/${magnet}${q} 302s to a working PDF`, async ({ request }) => {
        const hop = await request.get(`/download/${magnet}${q}`, { maxRedirects: 0 });
        expect(hop.status(), 'redirect status').toBe(302);
        const loc = hop.headers()['location'] || '';
        expect(loc).toMatch(/\.pdf(\?|$)/);
        const pdf = await request.get(`/download/${magnet}${q}`); // follow
        expect(pdf.status()).toBe(200);
        expect(pdf.headers()['content-type'] || '').toContain('application/pdf');
        expect(Number(pdf.headers()['content-length'] || '0')).toBeGreaterThan(1000);
      });
    }
  }
});
