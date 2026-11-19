// Classroom unit page — /classroom/:unitId (activities audit 2026-11, §5c item 5).
//
// An OPEN teacher page: the unit's books, its five-day plan (every step a link to a book page
// or to an activity opened in that book's mode), the books' story words and discussion
// prompts, and the gated offer for the unit's printable pack (/free/<unit-id>-pack, the same
// EmailSignup the other lead magnets use). Steps are references resolved here against the
// live registries; a published unit has already passed classroomUnitProblems() at build time.
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import EmailSignup from '../components/EmailSignup';
import NotFound from './NotFound';
import { books as rawBooks, useBooks } from '../data/books';
import { useActivities } from '../data/activities';
import { resources } from '../data/resources';
import { classroomUnitById, unitAgeRange, unitStepHref, unitPackSlug, unitPackItems } from '../data/classroomUnits';
import { unitDays, unitVocab } from '../data/classroomUnitPlans';
import { THEMES } from '../data/taxonomy';
import { sizedCover } from '../lib/covers';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const SITE_URL = 'https://storytimewitheva.com';
const STAGES = ['before', 'during', 'after'] as const;

const TRANSLATIONS = {
  en: {
    home: 'Home', resources: 'Parent Resources', classroom: 'Classroom units', forEducators: 'For teachers and educators',
    ages: 'Ages', seoSuffix: 'a classroom unit for teachers',
    booksHeading: 'The books', planHeading: 'The five-day plan', day: 'Day', read: 'Read', teacherNote: 'Teacher note',
    vocabHeading: 'Story words', vocabSub: 'Eight words from each book, in English, Spanish and French. The flashcards and word games in the plan play them.',
    promptsHeading: 'Discussion prompts', promptsSub: 'Three questions per book, one for each part of the read.',
    before: 'Before reading', during: 'While you read', after: 'After reading',
    packHeading: 'Get the printable pack', packIntro: 'One sign-up delivers every link in this unit, ready to open or print: each book’s two-page story worksheet and Pixel’s Story Quiz, the Studio activities with their printouts, and the classroom printables.',
    packInside: 'Inside the pack:', worksheet: 'Story worksheet', quiz: 'Pixel’s Story Quiz', otherUnits: 'Other classroom units',
  },
  es: {
    home: 'Inicio', resources: 'Recursos para padres', classroom: 'Unidades para el aula', forEducators: 'Para docentes y educadores',
    ages: 'Edades', seoSuffix: 'una unidad para el aula',
    booksHeading: 'Los libros', planHeading: 'El plan de cinco días', day: 'Día', read: 'Leer', teacherNote: 'Nota para el docente',
    vocabHeading: 'Palabras del cuento', vocabSub: 'Ocho palabras de cada libro, en español, inglés y francés. Las tarjetas y los juegos de palabras del plan las usan.',
    promptsHeading: 'Preguntas para conversar', promptsSub: 'Tres preguntas por libro, una para cada momento de la lectura.',
    before: 'Antes de leer', during: 'Mientras leen', after: 'Después de leer',
    packHeading: 'Recibe el paquete imprimible', packIntro: 'Un solo registro entrega todos los enlaces de esta unidad, listos para abrir o imprimir: la ficha de dos páginas y el quiz de Pixel de cada libro, las actividades del Estudio con sus hojas para imprimir y los imprimibles para el aula.',
    packInside: 'El paquete incluye:', worksheet: 'Ficha del cuento', quiz: 'El quiz de Pixel', otherUnits: 'Otras unidades para el aula',
  },
  fr: {
    home: 'Accueil', resources: 'Ressources pour parents', classroom: 'Unités pour la classe', forEducators: 'Pour les enseignants et éducateurs',
    ages: 'Âges', seoSuffix: 'une unité pour la classe',
    booksHeading: 'Les livres', planHeading: 'Le plan de cinq jours', day: 'Jour', read: 'Lire', teacherNote: 'Note pour l’enseignant',
    vocabHeading: 'Les mots de l’histoire', vocabSub: 'Huit mots par livre, en français, anglais et espagnol. Les cartes et les jeux de mots du plan les utilisent.',
    promptsHeading: 'Questions de discussion', promptsSub: 'Trois questions par livre, une pour chaque moment de la lecture.',
    before: 'Avant la lecture', during: 'Pendant la lecture', after: 'Après la lecture',
    packHeading: 'Recevoir le pack à imprimer', packIntro: 'Une seule inscription livre tous les liens de cette unité, prêts à ouvrir ou à imprimer : la fiche de lecture de deux pages et le quiz de Pixel de chaque livre, les activités du Studio avec leurs impressions, et les fiches pour la classe.',
    packInside: 'Le pack contient :', worksheet: 'Fiche de lecture', quiz: 'Le quiz de Pixel', otherUnits: 'Autres unités pour la classe',
  },
};

export default function ClassroomUnit() {
  const { unitId = '' } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const activities = useActivities();

  const unit = classroomUnitById[unitId];
  if (!unit) return <NotFound />;

  const title = unit.title[language];
  const intro = unit.description[language];
  const path = `/classroom/${unit.id}`;
  const [from, to] = unitAgeRange(unit).split('-');
  const bookOf = (id: string) => books.find((b) => b.id === id);
  const activityOf = (slug: string) => activities.find((a) => a.slug === slug);
  const cover = (src: string, w: number) => sizedCover(src, w);
  const unitBookList = unit.bookIds.map(bookOf).filter((b) => b !== undefined);
  const packItems = unitPackItems(unit, language);
  const others = Object.values(classroomUnitById).filter((u) => u.id !== unit.id);

  const crumbs = [{ label: t.home, to: '/' }, { label: t.resources, to: '/resources' }, { label: t.classroom, to: '/classroom' }, { label: title, to: path }];
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description: intro, url: `${SITE_URL}${path}`, inLanguage: language,
      mainEntity: {
        '@type': 'ItemList', numberOfItems: unitBookList.length,
        itemListElement: unitBookList.map((b, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/books/${b.id}`, name: b.title })),
      },
    },
    breadcrumbSchema(crumbs, language),
  ];

  const packLabel = (item: ReturnType<typeof unitPackItems>[number]) => {
    if (item.kind === 'worksheet') return `${t.worksheet}: ${bookOf(item.bookId ?? '')?.title ?? ''}`;
    if (item.kind === 'quiz') return `${t.quiz}: ${bookOf(item.bookId ?? '')?.title ?? ''}`;
    if (item.kind === 'activity') return activityOf(item.activityId ?? '')?.title ?? item.activityId ?? '';
    return resources.find((r) => r.id === item.resourceId)?.title[language] ?? item.resourceId ?? '';
  };

  return (
    <main>
      <Seo title={`${title}: ${t.seoSuffix}`} description={intro} path={path} />
      <JsonLd id={`classroom-${unit.id}`} data={schema} />

      <section className="bg-linear-to-b from-emerald-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={crumbs} className="mb-6" />
          <p className="inline-block text-xs font-semibold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 mb-3">{t.forEducators}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3"><span aria-hidden>{unit.emoji} </span>{title}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">{intro}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">{t.ages} {from}-{to}</span>
            {unit.themeIds.map((th) => (
              <Link key={th} to={`/collections/${th}`} className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold hover:bg-purple-200">{THEMES[th].labels[language]}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.booksHeading}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {unitBookList.map((b) => (
              <li key={b.id}>
                <Link to={`/books/${b.id}`} className="flex sm:flex-col items-center sm:items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all h-full group">
                  <img src={cover(b.coverImage, 240)} alt="" width={96} height={96} loading="lazy" className="w-24 h-24 sm:w-full sm:h-auto sm:aspect-square rounded-xl object-cover shrink-0" />
                  <span>
                    <span className="block font-bold text-gray-800 group-hover:text-emerald-700">{b.title}</span>
                    <span className="block text-xs text-gray-500 mt-1">{t.ages} {b.ageRange}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-10 px-4 bg-white border-y border-gray-100" id="plan">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.planHeading}</h2>
          <ol className="space-y-5">
            {unitDays(unit.id).map((day, i) => (
              <li key={i} className="rounded-2xl border border-gray-100 bg-emerald-50/40 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">{t.day} {i + 1}</p>
                <ul className="flex flex-wrap gap-2 mb-3">
                  {day.steps.map((step, j) => {
                    const book = bookOf(step.bookId);
                    const activity = step.activityId ? activityOf(step.activityId) : undefined;
                    const cls = 'inline-flex items-center gap-2 rounded-full bg-white border-2 border-emerald-300 text-emerald-900 font-semibold px-4 py-2 hover:bg-emerald-50 transition-colors';
                    const onClick = () => track('Continue Journey', { placement: 'classroom-unit', destination: activity ? 'activity' : 'book', activity: step.activityId ?? '', book: step.bookId, reason: `unit-day-${i + 1}` });
                    if (!activity) {
                      return (
                        <li key={j}>
                          <Link to={`/books/${step.bookId}`} onClick={onClick} className={cls}><span aria-hidden>📖</span>{t.read}: {book?.title}</Link>
                        </li>
                      );
                    }
                    return (
                      <li key={j}>
                        {activity.game ? (
                          <a href={unitStepHref(step, language)} onClick={onClick} className={cls}><span aria-hidden>{activity.emoji}</span>{activity.title}</a>
                        ) : (
                          <Link to={unitStepHref(step, 'en')} onClick={onClick} className={cls}><span aria-hidden>{activity.emoji}</span>{activity.title}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-gray-700 leading-relaxed"><span className="font-semibold text-gray-800">{t.teacherNote}: </span>{day.note[language]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-10 px-4" id="words">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.vocabHeading}</h2>
          <p className="text-gray-500 text-sm mb-5">{t.vocabSub}</p>
          <div className="space-y-5">
            {unitVocab(unit).map(({ bookId, words }) => (
              <div key={bookId}>
                <h3 className="font-bold text-gray-800 mb-2">{bookOf(bookId)?.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {words.map((w) => (
                    <li key={w.emoji + w.en} lang={language} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-purple-100 shadow-xs px-3 py-1.5 text-sm font-semibold text-gray-700">
                      <span aria-hidden>{w.emoji}</span>{w[language]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4" id="prompts">
        <div className="max-w-4xl mx-auto bg-amber-50/70 border border-amber-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.promptsHeading}</h2>
          <p className="text-gray-500 text-sm mb-6">{t.promptsSub}</p>
          <div className="space-y-6">
            {unit.bookIds.map((bookId) => {
              const raw = rawBooks.find((b) => b.id === bookId);
              const qs = STAGES.map((s) => raw?.discussionQuestions?.find((q) => q.stage === s)).filter((q) => q !== undefined);
              return (
                <div key={bookId}>
                  <h3 className="font-bold text-gray-800 mb-2">{bookOf(bookId)?.title}</h3>
                  <ol className="space-y-2">
                    {qs.map((q) => (
                      <li key={q.stage} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                        <span className="shrink-0 sm:w-40 text-xs font-semibold uppercase tracking-wide text-amber-700">{t[q.stage]}</span>
                        <span className="text-gray-700 leading-relaxed">{q.prompt[language]}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 px-4" id="pack">
        <div className="max-w-4xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.packHeading}</h2>
          <p className="text-gray-600 leading-relaxed mb-4">{t.packIntro}</p>
          <p className="text-xs font-semibold text-gray-700 mb-1">{t.packInside}</p>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-0.5" data-unit-pack={unitPackSlug(unit.id)}>
            {packItems.map((item, i) => <li key={i}>{packLabel(item)}</li>)}
          </ul>
        </div>
        <EmailSignup magnet={unitPackSlug(unit.id)} placement="classroom" />
      </section>

      {others.length > 0 && (
        <section className="py-10 px-4 bg-emerald-50/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.otherUnits}</h2>
            <ul className="flex flex-wrap gap-2">
              {others.map((u) => (
                <li key={u.id}>
                  <Link to={`/classroom/${u.id}`} className="inline-block px-4 py-2 rounded-full bg-white border border-emerald-100 text-sm text-emerald-900 font-semibold hover:border-emerald-300">
                    <span aria-hidden>{u.emoji} </span>{u.title[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
