// Homepage "Loved by Families" section (PRD Section 8 / task S1-010).
//
// Renders NOTHING until real, approved testimonials exist in src/data/testimonials.ts.
// We never ship placeholder or fabricated quotes; when the data is populated this
// section appears automatically with no further code changes.
import { useTranslation } from '../lib/language';
import { useTestimonials } from '../data/testimonials';

const TRANSLATIONS = {
  en: { title: 'Loved by Families' },
  es: { title: 'Adorado por las familias' },
  fr: { title: 'Adoré par les familles' },
};

export default function TestimonialSection() {
  const t = useTranslation(TRANSLATIONS);
  const items = useTestimonials();

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.title}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <figure key={i} className="bg-purple-50 rounded-2xl p-6 border border-purple-100 flex flex-col">
              <blockquote className="text-gray-700 leading-relaxed flex-1">“{it.quote}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-purple-700">
                {it.author}
                {it.role && <span className="font-normal text-gray-500"> · {it.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
