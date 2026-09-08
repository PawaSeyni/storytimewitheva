import { useLanguage, useTranslation } from '../lib/language';
import type { DiscussionQuestion } from '../data/books.data';

/**
 * "Talk about it together" — the book's discussion prompts (E-01).
 *
 * Addressed to the GROWN-UP reading aloud, not to the child: these are questions to ask,
 * so the copy says "ask", never "answer". The stage labels are the useful part for a
 * parent at bedtime or a teacher mid-lesson, which is why `stage` is modeled at all.
 *
 * Rendered in canonical stage order rather than array order, so display stays stable if a
 * book is ever authored out of sequence. Prompts are list items, not headings: three
 * questions do not each deserve a heading rank, and h3 here would compete with the card
 * titles in the sections below.
 */
const STAGE_ORDER = ['before', 'during', 'after'] as const;

const TRANSLATIONS = {
  en: {
    heading: 'Talk about it together',
    sub: 'Three questions to open a conversation, one for each part of the read.',
    before: 'Before reading',
    during: 'While you read',
    after: 'After reading',
  },
  es: {
    heading: 'Hablen juntos',
    sub: 'Tres preguntas para abrir una conversación, una para cada momento de la lectura.',
    before: 'Antes de leer',
    during: 'Mientras leen',
    after: 'Después de leer',
  },
  fr: {
    heading: 'Parlez-en ensemble',
    sub: 'Trois questions pour ouvrir la conversation, une pour chaque moment de la lecture.',
    before: 'Avant la lecture',
    during: 'Pendant la lecture',
    after: 'Après la lecture',
  },
};

export default function DiscussionPrompts({ questions }: { questions?: DiscussionQuestion[] }) {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  if (!questions || questions.length === 0) return null;

  const ordered = STAGE_ORDER.map((s) => questions.find((q) => q.stage === s)).filter(
    (q) => q !== undefined,
  );

  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.heading}</h2>
        <p className="text-gray-500 text-sm mb-6">{t.sub}</p>
        <ol className="space-y-4">
          {ordered.map((q) => (
            <li key={q.stage} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="shrink-0 sm:w-40 text-xs font-semibold uppercase tracking-wide text-amber-700">
                {t[q.stage]}
              </span>
              <span className="text-gray-700 leading-relaxed">{q.prompt[language]}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
