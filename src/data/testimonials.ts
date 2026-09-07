// Family testimonials shown in the homepage "Loved by Families" section.
//
// IMPORTANT: we NEVER fabricate social proof. This list stays EMPTY until real,
// approved testimonials exist; the homepage section renders nothing while it is
// empty (see TestimonialSection). When approved quotes are available, add them
// here (localized) and the section appears automatically.
import { useLanguage, type Language } from '../lib/language';

type LocalizedString = Record<Language, string>;

export interface Testimonial {
  /** The quote, localized. */
  quote: LocalizedString;
  /** Attribution — a real name/handle. Not localized. */
  author: string;
  /** Optional role, e.g. "Parent of two" / "Teacher". Localized. */
  role?: LocalizedString;
}

export const testimonials: Testimonial[] = [];

export interface LocalizedTestimonial {
  quote: string;
  author: string;
  role?: string;
}

/** Testimonials resolved for the current language. */
export function useTestimonials(): LocalizedTestimonial[] {
  const { language } = useLanguage();
  return testimonials.map((t) => ({
    quote: t.quote[language] ?? t.quote.en,
    author: t.author,
    role: t.role ? (t.role[language] ?? t.role.en) : undefined,
  }));
}
