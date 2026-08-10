import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import NotFound from './NotFound';
import EmailSignup, { isKnownMagnet, magnetCopy } from '../components/EmailSignup';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const SITE_URL = 'https://storytimewitheva.com';

const TRANSLATIONS = {
  en: { imprint: 'An Eva Gallo Collection imprint', explore: 'Explore storytimewitheva.com' },
  es: { imprint: 'Un sello de la Colección Eva Gallo', explore: 'Explora storytimewitheva.com' },
  fr: { imprint: 'Une marque de la Collection Eva Gallo', explore: 'Découvrez storytimewitheva.com' },
};

/**
 * Dedicated, distraction-free landing page for a single lead magnet, one per
 * `/free/:magnet` (localized to `/es/free/…`, `/fr/free/…`). Built for PAID
 * traffic: the whole page is the offer — no navbar, no catalog, no competing
 * CTAs (App.tsx hides the site chrome for `/free/` paths). The offer, form,
 * MailerLite delivery, UTM capture and success screen are the SAME money-path
 * component the homepage uses (`EmailSignup`), driven here by the route's
 * magnet instead of a `?lm=` query param — so every magnet × language combo is
 * populated from the existing config with zero per-page code. noindex: these
 * are ad destinations, not search results.
 */
export default function LandingPage() {
  const { magnet } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const known = isKnownMagnet(magnet);

  // Top of the funnel: one aggregate "Landing View" per page view (mount only —
  // not re-fired if `?lang=` flips the language a tick later).
  useEffect(() => {
    if (known) track('Landing View', { language, lead_magnet: String(magnet), landing_page: `/free/${magnet}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A bad/edited pin URL gets a real 404, never a broken or default offer.
  if (!known) return <NotFound />;

  const copy = magnetCopy(magnet as string, language);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Seo
        title={copy?.title ?? 'Free printable'}
        description={copy?.blurb ?? ''}
        path={`/free/${magnet}`}
        image={`${SITE_URL}/og-image.jpg`}
        noindex
      />

      {/* Brand-only header — trust signal + an escape hatch to the main site,
          but no competing navigation. */}
      <header className="py-4 px-4 flex justify-center border-b border-gray-100">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-purple-700 hover:text-purple-900 transition-colors"
        >
          <span className="text-2xl" aria-hidden>🐾</span>
          <span>Story Time with Eva</span>
        </Link>
      </header>

      <main className="flex-1">
        {/* key remounts the signup (fresh magnet + a new Form View) if the
            :magnet param ever changes client-side — landing pages are normally
            full-load ad entries, but this keeps it correct either way. */}
        <EmailSignup key={magnet} magnet={magnet} />
      </main>

      {/* Credibility + the post-conversion path, kept below the offer. */}
      <footer className="py-6 px-4 text-center text-xs text-gray-400 space-y-2">
        <p>
          {t.imprint} · © {year} Pawa Press Inc.
        </p>
        <Link to="/" className="inline-block text-purple-600 hover:text-purple-800 font-medium">
          {t.explore} →
        </Link>
      </footer>
    </div>
  );
}
