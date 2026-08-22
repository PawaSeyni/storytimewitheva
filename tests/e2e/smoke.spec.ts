// Layers 1, 5.1, 6.1 — production smoke. Tagged @smoke. Runs against LIVE
// production because these are Netlify-runtime behaviours. This is the automated
// version of the destination pre-flight that would have caught the 2026-08-03
// raw-PDF flight (~CA$35, zero pageviews).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
// Landing-page slug → the lead_magnet tag the page actually posts (guarded by 3.4).
const SLUG_TO_TAG: Record<string, string> = {
  'bedtime-routine': 'bedtime-routine',
  'bilingual-starter-kit': 'bilingual-bundle',
  'bilingual-bundle': 'bilingual-bundle',
  'bilingual-flashcards': 'bilingual-flashcards',
  'parents-guide': 'parents-guide',
  'follow-up-activities': 'follow-up-activities',
};

// ---- Layer 1: route coverage (the known route SPACE is serviceable) ----
// This is NOT the ad pre-flight. It proves every landing route we ship is a real
// HTML offer, but it says nothing about where a live ad actually points. That is
// Layer 6.1 below, which reads the real ad URLs.
test.describe('@smoke Layer 1 — route coverage', () => {
  for (const prefix of LOCALES) {
    for (const magnet of MAGNETS) {
      test(`1.1 ${prefix || '/'} free/${magnet} is a real HTML offer page`, async ({ page }) => {
        const resp = await page.goto(`${prefix}/free/${magnet}`, { waitUntil: 'domcontentloaded' });
        expect(resp?.status(), 'HTTP status').toBe(200);
        expect(resp?.headers()['content-type'] || '', 'must be HTML, not a PDF').toContain('text/html');
        await expect(page.locator('#email-signup input[type="email"]')).toBeVisible();
        await expect(page.locator('#email-signup h2').first()).not.toBeEmpty();
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

// ---- Layer 5.1: delivery ----
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

// ---- Layer 6.1: the ACTUAL live ad destinations ----
// The August incident was an ad that pointed at a .pdf while every route was
// fine, so Layer 1 passing is NOT the pre-flight. This reads the real ad URLs
// (verbatim, not retyped) from AD_DESTINATIONS env or tests/e2e/ad-destinations.json
// and asserts each one is a serviceable, correct-magnet, correct-locale offer.
function loadAdUrls(): string[] {
  const env = process.env.AD_DESTINATIONS?.trim();
  if (env) {
    try {
      const parsed = JSON.parse(env);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return env.split(/[\s,]+/).filter(Boolean);
    }
  }
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const file = JSON.parse(readFileSync(path.join(__dirname, 'ad-destinations.json'), 'utf8'));
    if (Array.isArray(file?.urls)) return file.urls.map(String).filter(Boolean);
  } catch { /* no file / bad json → treated as empty */ }
  return [];
}

function parseDestination(rawUrl: string): { locale: string; slug: string; expectedLang: string; expectedTag: string | null } {
  const u = new URL(rawUrl);
  const m = u.pathname.replace(/\/+$/, '').match(/^\/(?:(es|fr)\/)?free\/([^/]+)$/);
  const locale = m?.[1] ?? 'en';
  const slug = m?.[2] ?? '';
  const override = (u.searchParams.get('lang') || '').toLowerCase();
  const expectedLang = ['en', 'es', 'fr'].includes(override) ? override : locale;
  return { locale, slug, expectedLang, expectedTag: SLUG_TO_TAG[slug] ?? null };
}

const AD_URLS = loadAdUrls();

test.describe('@smoke Layer 6.1 — live ad destinations', () => {
  test('6.1 ad destinations are configured for pre-flight', () => {
    // A loud skip — NOT a pass — when no ad URLs are provided. A green suite
    // must never be read as "the live ads are verified"; that requires pasting
    // the real destination URLs (see tests/e2e/ad-destinations.json).
    test.skip(
      AD_URLS.length === 0,
      'No ad URLs configured. Paste live ad destinations into tests/e2e/ad-destinations.json ' +
        '(or set AD_DESTINATIONS) before a flight. The live-ad pre-flight did NOT run.'
    );
    expect(AD_URLS.length).toBeGreaterThan(0);
  });

  for (const url of AD_URLS) {
    test(`6.1 live ad destination: ${url}`, async ({ page }) => {
      const { slug, expectedLang, expectedTag } = parseDestination(url);
      expect(expectedTag, `unknown magnet slug "${slug}" in ad URL — would 404`).not.toBeNull();

      const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
      // 6.1a — 200 and HTML, never a PDF (the exact August failure).
      expect(resp?.status(), 'HTTP status').toBe(200);
      expect(resp?.headers()['content-type'] || '', 'destination must be HTML, not a PDF').toContain('text/html');
      // 6.1b — the offer presents an email capture.
      await expect(page.locator('#email-signup input[type="email"]')).toBeVisible();
      // 6.1c — the magnet the page renders matches the magnet in the URL.
      expect(await page.locator('#email-signup input[name="lead_magnet"]').inputValue(), 'rendered magnet').toBe(expectedTag);
      // 6.1d — the language the page renders matches the URL locale / ?lang.
      expect(await page.locator('#email-signup input[name="language"]').inputValue(), 'rendered language').toBe(expectedLang);
      // 6.1e — analytics present.
      expect(await page.evaluate(() => typeof (window as unknown as { plausible?: unknown }).plausible)).toBe('function');
    });
  }
});
