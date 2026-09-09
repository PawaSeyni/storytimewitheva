import { Link } from './LocalizedLink';
import { useLanguage, useTranslation } from '../lib/language';
import { gameUrl } from '../lib/gameUrl';
import { track } from '../lib/analytics';
import { useActivities } from '../data/activities';

/**
 * "Try an activity" — renders a book's `relatedActivityIds` (B-02).
 *
 * The pairs are data, ranked by the owner-approved theme -> activity-category affinity
 * map plus age fit and validated in tests/funnel/relationships.test.mjs, so an unknown
 * slug fails the build rather than rendering a dead card. Unknown ids are still skipped
 * defensively here so a data mistake can never crash a book page.
 *
 * Games are standalone static HTML in /public/games and are NOT language-prefixed, so
 * they use a plain <a>; in-app demos use the localizing <Link>. Same convention as
 * Activities.tsx — deliberately not re-invented.
 */
const TRANSLATIONS = {
  en: { heading: 'Try an activity', sub: 'Hand-matched to this story.', ages: 'Ages', tryNow: 'Try it' },
  es: { heading: 'Prueba una actividad', sub: 'Elegidas para esta historia.', ages: 'Edades', tryNow: 'Probar' },
  fr: { heading: 'Essayez une activité', sub: 'Choisies pour cette histoire.', ages: 'Âges', tryNow: 'Essayer' },
};

export default function RelatedActivities({ slugs }: { slugs: string[] }) {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const all = useActivities();
  const items = slugs.map((s) => all.find((a) => a.slug === s)).filter((a) => a !== undefined);
  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      {/* h2 with h3 card titles: the same heading contract the collection grid and the
          related-books section follow, locked by tests/seo/a11y.test.mjs. */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.heading}</h2>
      <p className="text-gray-500 text-sm mb-5">{t.sub}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((a) => {
          const cta = (
            <span className="text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 px-4 py-1.5 rounded-full shadow-sm transition-all">
              {t.tryNow}
            </span>
          );
          const inner = (
            <>
              <span className="text-4xl block mb-3" aria-hidden>{a.emoji}</span>
              <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mb-2 inline-block self-start">
                {a.category}
              </span>
              <h3 className="font-bold text-gray-800 leading-snug mb-1">{a.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{a.desc}</p>
              <span className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">
                  {t.ages}: <strong>{a.ages}</strong>
                </span>
                {cta}
              </span>
            </>
          );
          const cls =
            'group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-50 p-5 flex flex-col h-full transition-all';
          // S5-015: the Book → Activity half of the loop, tracked as a continuation.
          const onClick = () => track('Continue Journey', { placement: 'detail', destination: 'activity', activity: a.slug, reason: 'related' });
          return a.game ? (
            <a key={a.slug} href={gameUrl(a.slug, language)} onClick={onClick} className={cls}>{inner}</a>
          ) : (
            <Link key={a.slug} to={`/activities/${a.slug}`} onClick={onClick} className={cls}>{inner}</Link>
          );
        })}
      </div>
    </section>
  );
}
