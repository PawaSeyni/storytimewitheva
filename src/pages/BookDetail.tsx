import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import NotFound from './NotFound';
import ReadAlong from '../components/ReadAlong';
import TapToTranslate from '../components/TapToTranslate';
import BookStatusButton from '../components/BookStatusButton';
import FavoriteButton from '../components/FavoriteButton';
import { recordExplored } from '../lib/personalLibrary';
import { books, useBook, useBooks, isComingSoon } from '../data/books';
import BookCard from '../components/BookCard';
import { relatedBooksFor } from '../data/relatedBooks';
import { journeysByBookId, publishedJourneys } from '../data/contentIndex';
import ResourceStrip from '../components/ResourceStrip';
import RelatedActivities from '../components/RelatedActivities';
import ShareButton from '../components/ShareButton';
import ReadAloudButton from '../components/ReadAloudButton';
import { useExperiment } from '../lib/experiments';
import DiscussionPrompts from '../components/DiscussionPrompts';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import { BOOK_RATINGS } from '../data/ratings';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, localizePath, useLanguage, useTranslation } from '../lib/language';
import type { Language } from '../lib/language';
import { isAmazonCover, sizedCover } from '../lib/covers';
import { track } from '../lib/analytics';

const SITE_URL = 'https://storytimewitheva.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: { back: '← Back to all books', theme: 'Theme', paperback: 'Paperback', ebook: 'eBook', priceNote: 'See current price on Amazon', buy: '🛒 Buy on Amazon', comingSoon: '🔜 Coming soon', comingSoonNote: 'This title is on its way. Check back soon!', coverAlt: 'book cover', ages: 'Ages', agesSuffix: '', bookLangs: 'Available in English · Spanish and French coming soon', bookLangsEnFr: 'Available in English and French', bookLangsAll: 'Available in English, Spanish, and French', pageAudioNote: 'Page and audio available in Spanish, English, and French', bilingualShow: '🌐 Show description in other languages', bilingualHide: '🌐 Hide other languages', tapShow: '🔤 Tap words to translate', tapHide: '🔤 Stop translating', ratedOn: 'on Amazon', ratingsWord: 'ratings', relatedHeading: 'You might also like', partOfJourney: 'Part of a reading journey', homeCrumb: 'Home', booksCrumb: 'Books', buyGroup: 'Buy this book', affiliateNote: 'As an Amazon Associate, Pawa Press earns from qualifying purchases.' },
  es: { back: '← Volver a todos los libros', theme: 'Tema', paperback: 'Tapa blanda', ebook: 'eBook', priceNote: 'Consulta el precio actual en Amazon', buy: '🛒 Comprar en Amazon', comingSoon: '🔜 Próximamente', comingSoonNote: 'Este título está en camino. ¡Vuelve pronto!', coverAlt: 'portada del libro', ages: 'Edades', agesSuffix: 'años', bookLangs: 'Disponible en inglés · Español y francés próximamente', bookLangsEnFr: 'Disponible en inglés y francés', bookLangsAll: 'Disponible en inglés, español y francés', pageAudioNote: 'Página y audio disponibles en español, inglés y francés', bilingualShow: '🌐 Mostrar la descripción en otros idiomas', bilingualHide: '🌐 Ocultar otros idiomas', tapShow: '🔤 Toca para traducir', tapHide: '🔤 Dejar de traducir', ratedOn: 'en Amazon', ratingsWord: 'valoraciones', relatedHeading: 'También te puede gustar', partOfJourney: 'Parte de un recorrido de lectura', homeCrumb: 'Inicio', booksCrumb: 'Libros', buyGroup: 'Comprar este libro', affiliateNote: 'Como Asociado de Amazon, Pawa Press recibe ingresos por las compras que cumplen los requisitos.' },
  fr: { back: '← Retour à tous les livres', theme: 'Thème', paperback: 'Livre broché', ebook: 'Livre numérique', priceNote: 'Voir le prix actuel sur Amazon', buy: '🛒 Acheter sur Amazon', comingSoon: '🔜 Bientôt disponible', comingSoonNote: 'Ce titre arrive bientôt. Revenez vite !', coverAlt: 'couverture du livre', ages: 'Âges', agesSuffix: 'ans', bookLangs: 'Disponible en anglais · Espagnol et français bientôt disponibles', bookLangsEnFr: 'Disponible en anglais et français', bookLangsAll: 'Disponible en anglais, espagnol et français', pageAudioNote: 'Page et audio disponibles en espagnol, anglais et français', bilingualShow: '🌐 Afficher la description dans d\'autres langues', bilingualHide: '🌐 Masquer les autres langues', tapShow: '🔤 Touche pour traduire', tapHide: '🔤 Arrêter la traduction', ratedOn: 'sur Amazon', ratingsWord: 'évaluations', relatedHeading: 'Vous aimerez aussi', partOfJourney: 'Fait partie d’un parcours de lecture', homeCrumb: 'Accueil', booksCrumb: 'Livres', buyGroup: 'Acheter ce livre', affiliateNote: 'En tant que Partenaire Amazon, Pawa Press réalise un bénéfice sur les achats remplissant les conditions requises.' },
};

export default function BookDetail() {
  const { slug = '' } = useParams();
  const book = useBook(slug);
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const buyRef = useRef<HTMLDivElement>(null);
  // EXP-001 (draft until the baseline is approved): assignment happens here, before render.
  const ctaExperiment = useExperiment('book-cta-hierarchy-v1');
  const [bilingual, setBilingual] = useState(false);
  const [tapMode, setTapMode] = useState(false);

  // Fire one "Book View" per book (guarded against the prerender crawler in track()).
  const bookId = book?.id;
  useEffect(() => {
    if (!bookId) return;
    track('Book View', { book: bookId });
    // S6-004. Local, bounded, deduplicated; nothing leaves the device.
    recordExplored(bookId);
  }, [bookId]);

  // S5-002: one "Purchase CTA View" per book page, when the Buy group is actually viewable.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || !book) return;
    let fired = false;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        track('Purchase CTA View', { book: book.id, placement: 'detail', edition: book.editionLang });
        ctaExperiment.expose('detail'); // once per assignment, only now that the surface is viewable
        io.disconnect();
      }
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  // Sprint 6 recommendations: editorial pairs first, topped up from the theme tier.
  // Ranking lives in ../data/relatedBooks (browser-free, so CI validates what renders).
  const allBooks = useBooks();
  const related = useMemo(() => {
    if (!bookId) return [];
    const byId = new Map(allBooks.map((b) => [b.id, b]));
    return relatedBooksFor(bookId).map((r) => { const b = byId.get(r.id); return b ? { book: b, tier: r.tier } : null; }).filter((x) => x !== null);
  }, [bookId, allBooks]);

  // B-02 pairs live on the raw catalog record, not the localized projection.
  const activitySlugs = useMemo(
    () => books.find((b) => b.id === bookId)?.relatedActivityIds ?? [],
    [bookId],
  );

  const cover = book?.coverImage ?? '';
  const amazon = isAmazonCover(cover);
  const ogImage = amazon ? sizedCover(cover, 600) : `${SITE_URL}${cover}`;

  // Memoized so toggling bilingual / tap mode doesn't tear down and re-inject
  // the JSON-LD <script>. book is derived from slug+language, so those (plus
  // the derived ogImage) are the real inputs. url tracks the localized canonical.
  const bookSchema = useMemo(() => {
    if (!book) return null;
    // KDP paperback ASINs that are 10-char numeric ARE the ISBN-10; the 3
    // B0-prefixed ASINs are Amazon-only ids with no ISBN — omit isbn there
    // rather than mislabel an ASIN as an ISBN.
    const asin = book.amazonUrl.match(/\/dp\/([0-9A-Za-z]+)/)?.[1];
    const isbn = asin && /^[0-9]{9}[0-9Xx]$/.test(asin) ? asin : undefined;
    // Only mark up a rating that is REAL and shown on this page (see the visible
    // stars below). BOOK_RATINGS holds live Amazon numbers scraped by
    // scripts/refresh-ratings.mjs; a book with no ratings yet isn't in the map,
    // so no aggregateRating is emitted (never invent one — Google policy).
    const rating = BOOK_RATINGS[book.id];
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: 'Eva Gallo' },
      publisher: { '@type': 'Organization', name: 'Pawa Press Inc.' },
      inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
      bookFormat: 'https://schema.org/Paperback',
      image: ogImage,
      url: `${SITE_URL}${localizePath(`/books/${book.id}`, language)}/`,
      ...(isbn ? { isbn } : {}),
      ...(rating
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: rating.ratingValue,
              reviewCount: rating.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
      ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
      ...(book.amazonUrl ? { sameAs: book.amazonUrl.split('?')[0] } : {}),
      abstract: book.description,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, language, ogImage]);

  // Home › Books › Title trail — shared component + schema helper (S3-007). The helper
  // localizes the schema URLs to this language's canonical, trailing-slash form, so the
  // JSON-LD names the same URLs the visible links go to.
  const crumbs = book
    ? [
        { label: t.homeCrumb, to: '/' },
        { label: t.booksCrumb, to: '/books' },
        { label: book.title, to: `/books/${book.id}` },
      ]
    : null;
  const breadcrumbLd = useMemo(
    () => (crumbs ? breadcrumbSchema(crumbs, language) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book?.id, book?.title, language, t.homeCrumb, t.booksCrumb],
  );

  // Unknown id → real (noindex) 404 rather than a blank page.
  if (!book) return <NotFound />;

  // Raw record (all-language strings) for the side-by-side bilingual view.
  const raw = books.find((b) => b.id === slug);
  const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l !== language) as Language[];

  return (
    <main className="py-8 px-4">
      <Seo title={book.title} description={book.subtitle || book.description} path={`/books/${book.id}`} image={ogImage} />
      <JsonLd id="book" data={bookSchema} />
      {breadcrumbLd && <JsonLd id="breadcrumb" data={breadcrumbLd} />}

      <div className="max-w-4xl mx-auto">
        {crumbs && <Breadcrumbs crumbs={crumbs} />}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 aspect-square">
            <img
              src={amazon ? sizedCover(cover, 600) : cover}
              srcSet={amazon ? `${sizedCover(cover, 500)} 500w, ${sizedCover(cover, 900)} 900w` : undefined}
              sizes="(min-width: 768px) 448px, 90vw"
              alt={`${book.title} – ${t.coverAlt}`}
              className="w-full h-full object-cover"
              width={600}
              height={600}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {t.ages} {book.ageRange.replace('-', '–')}{t.agesSuffix && ` ${t.agesSuffix}`}
              </span>
              <span className="text-lg" aria-hidden>{book.languages.join(' ')}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{book.title}</h1>
            {book.subtitle && <p className="text-gray-500 italic mb-4">{book.subtitle}</p>}

            {tapMode ? (
              <TapToTranslate text={book.description} language={language} className="text-gray-600 leading-relaxed mb-4" />
            ) : (
              <ReadAlong text={book.description} className="text-gray-600 leading-relaxed mb-4" />
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTapMode((v) => !v)}
                aria-pressed={tapMode}
                className={`inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full transition-colors ${
                  tapMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {tapMode ? t.tapHide : t.tapShow}
              </button>
            </div>

            {raw && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700">{t.bookLangsAll}</p>
                <p className="text-xs text-gray-500 mb-2">{t.pageAudioNote}</p>
                <button
                  type="button"
                  onClick={() => setBilingual((v) => !v)}
                  aria-expanded={bilingual}
                  aria-controls="bilingual-panel"
                  className="inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full text-purple-600 border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  {bilingual ? t.bilingualHide : t.bilingualShow}
                </button>
                {bilingual && (
                  <div id="bilingual-panel" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {otherLangs.map((l) => (
                      <div key={l} className="bg-purple-50/60 rounded-xl p-4">
                        <p className="text-xs font-semibold text-purple-700 mb-1">
                          {LANGUAGE_LABELS[l].flag} {LANGUAGE_LABELS[l].name}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed" lang={l}>
                          {raw.description[l]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-purple-50 rounded-xl px-4 py-2 inline-block mb-5">
              <span className="text-sm text-purple-700 font-medium">{t.theme}: {book.theme}</span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <BookStatusButton bookId={book.id} />
              <FavoriteButton bookId={book.id} />
              <ShareButton bookId={book.id} title={book.title} />
            </div>

            {isComingSoon(book) ? (
              <>
                <p className="text-sm text-gray-500 mb-3">{t.comingSoonNote}</p>
                <span className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-gray-100 text-gray-500 font-bold rounded-full text-lg cursor-default">
                  {t.comingSoon}
                </span>
              </>
            ) : (
              <>
                {BOOK_RATINGS[book.id] && (
                  <p className="mb-3 flex items-center gap-1.5 text-sm">
                    <span className="text-amber-500" aria-hidden>★</span>
                    <span className="font-semibold text-gray-800">{BOOK_RATINGS[book.id].ratingValue.toFixed(1)}</span>
                    <span className="text-gray-500">
                      {t.ratedOn} · {BOOK_RATINGS[book.id].reviewCount} {t.ratingsWord}
                    </span>
                  </p>
                )}
                {/* S5-002: the Buy group is labelled and separate from the read/listen/save controls
                    above it; S5-003: the click carries the edition language behind the link. */}
                {ctaExperiment.variant === 'listen-first' && (
                  <div className="mb-4" data-experiment="book-cta-hierarchy-v1" data-variant="listen-first">
                    <ReadAloudButton text={[book.title, book.subtitle, book.description].filter(Boolean).join('. ')} />
                  </div>
                )}
                <div role="group" aria-label={t.buyGroup} ref={buyRef} data-cta="buy">
                <p className="text-sm text-gray-500 mb-3">
                  📖 {t.paperback} · 📱 {t.ebook} · {t.priceNote}
                </p>
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('Purchase Click', { book: book.id, destination: 'amazon', placement: 'detail', edition: book.editionLang, ...ctaExperiment.conversionProps() })}
                  className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-linear-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                >
                  {t.buy}
                </a>
                <p className="mt-2 text-xs text-gray-500" data-affiliate-disclosure>{t.affiliateNote}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {bookId && (journeysByBookId[bookId] ?? []).length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-2">{t.partOfJourney}</p>
          <ul className="flex flex-wrap gap-2">
            {(journeysByBookId[bookId] ?? []).map((jid) => {
              const j = publishedJourneys.find((x) => x.id === jid);
              return j ? (
                <li key={jid}>
                  <Link to={`/journeys/${jid}`} className="inline-block px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-sm text-amber-900 font-semibold hover:border-amber-300">
                    {j.title[language]} →
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}

      <DiscussionPrompts questions={raw?.discussionQuestions} />

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-14">
          {/* h2, not h3: BookCard titles are h3, so a lower level here would skip a
              heading rank. tests/seo/a11y.test.mjs locks this. */}
          <h2 className="text-2xl font-bold text-gray-800 mb-5">{t.relatedHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(({ book: b, tier }) => (
              // S5-015 / S5-016: a related-book click carries the tier that ranked it.
              <BookCard key={b.id} book={b} onSelect={() => track('Recommendation Click', { book: b.id, placement: 'related', reason: tier })} />
            ))}
          </div>
        </section>
      )}

      <RelatedActivities slugs={activitySlugs} />

      <ResourceStrip />
    </main>
  );
}
