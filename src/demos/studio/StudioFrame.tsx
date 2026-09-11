// Shared frame for the eight Activity Studio pages (2026-09-11).
//
// Each studio activity is a normal /activities/<slug> page (DemoPage supplies the
// breadcrumbs, the H1, the completion button and the continuation block). This frame
// adds what the studio activities share: the hero strip with the book pairing from the
// activity table, the local-only note, the instructions panel that does not print, the
// printable card, and the print button. No storage, no accounts, no network.
import type { ReactNode } from 'react';
import { Printer, RotateCcw, ShieldCheck, BookOpen } from 'lucide-react';
import { Link } from '../../components/LocalizedLink';
import { useBooks } from '../../data/books';
import { useTranslation } from '../../lib/language';

const TRANSLATIONS = {
  en: { ages: 'Ages', minutes: 'min', pairsWith: 'Pairs with', localOnly: 'Your work stays on this device. Print it or save it as a PDF with a grown-up.', print: 'Print or save as PDF', reset: 'Start again', grownup: 'Grown-up role' },
  es: { ages: 'Edades', minutes: 'min', pairsWith: 'Acompaña a', localOnly: 'Tu trabajo se queda en este dispositivo. Imprímelo o guárdalo en PDF con un adulto.', print: 'Imprimir o guardar en PDF', reset: 'Empezar de nuevo', grownup: 'Papel del adulto' },
  fr: { ages: 'Âges', minutes: 'min', pairsWith: 'À lire avec', localOnly: 'Ton travail reste sur cet appareil. Imprime-le ou enregistre-le en PDF avec un adulte.', print: 'Imprimer ou enregistrer en PDF', reset: 'Recommencer', grownup: 'Rôle de l’adulte' },
};

export type Hue = 'coral' | 'sky' | 'gold' | 'blue' | 'plum' | 'rose' | 'sage' | 'teal';

const HUES: Record<Hue, { hero: string; ring: string; accent: string }> = {
  coral: { hero: 'from-orange-100 to-rose-100', ring: 'border-orange-300', accent: 'text-orange-700' },
  sky: { hero: 'from-sky-100 to-blue-100', ring: 'border-sky-300', accent: 'text-sky-800' },
  gold: { hero: 'from-amber-100 to-yellow-100', ring: 'border-amber-300', accent: 'text-amber-800' },
  blue: { hero: 'from-blue-100 to-cyan-100', ring: 'border-blue-300', accent: 'text-blue-800' },
  plum: { hero: 'from-indigo-100 to-purple-100', ring: 'border-indigo-300', accent: 'text-indigo-800' },
  rose: { hero: 'from-pink-100 to-rose-100', ring: 'border-pink-300', accent: 'text-pink-800' },
  sage: { hero: 'from-emerald-100 to-lime-100', ring: 'border-emerald-300', accent: 'text-emerald-800' },
  teal: { hero: 'from-teal-100 to-cyan-100', ring: 'border-teal-300', accent: 'text-teal-800' },
};

interface StudioFrameProps {
  emoji: string;
  hue: Hue;
  /** Skill line above the heading (already localized). */
  skill: string;
  title: string;
  subtitle: string;
  ages: string;
  minutes: number;
  /** Book ids from the activity table; rendered as links with the catalog titles. */
  bookIds: string[];
  grownup: string;
  children: ReactNode;
}

export function StudioFrame({ emoji, hue, skill, title, subtitle, ages, minutes, bookIds, grownup, children }: StudioFrameProps) {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const paired = bookIds.map((id) => books.find((b) => b.id === id)).filter((b) => b !== undefined);
  const h = HUES[hue];
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
      <header className={`bg-linear-to-br ${h.hero} px-4 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6`}>
        <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/80 border ${h.ring} grid place-items-center text-4xl sm:text-5xl`} aria-hidden>
          {emoji}
        </div>
        <div className="min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wider ${h.accent}`}>{skill}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{title}</h2>
          <p className="text-gray-700 mt-1">{subtitle}</p>
          <ul className="flex flex-wrap gap-2 mt-3 text-xs font-semibold text-gray-700">
            <li className="bg-white/80 rounded-full px-3 py-1">{t.ages} {ages.replace('-', '–')}</li>
            <li className="bg-white/80 rounded-full px-3 py-1">{minutes} {t.minutes}</li>
            <li className="bg-white/80 rounded-full px-3 py-1">{t.grownup}: {grownup}</li>
            {paired.length > 0 && (
              <li className="bg-white/80 rounded-full px-3 py-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" aria-hidden />
                <span>{t.pairsWith}</span>
                {paired.map((b, i) => (
                  <span key={b.id}>
                    {i > 0 && <span aria-hidden> · </span>}
                    <Link to={`/books/${b.id}`} className="underline decoration-dotted underline-offset-2 hover:text-purple-700" data-studio-book={b.id}>
                      {b.title}
                    </Link>
                  </span>
                ))}
              </li>
            )}
          </ul>
        </div>
      </header>
      <p className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border-b border-gray-100 print:hidden">
        <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden /> {t.localOnly}
      </p>
      <div className="p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  );
}

/** Instructions and controls: on screen only. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6 print:hidden ${className}`}>{children}</section>;
}

/** The take-home card: the only thing that prints. */
export function Printable({ children, className = '', label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <section aria-label={label} data-studio-printable className={`rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 sm:p-6 print:border-0 print:p-0 print:shadow-none ${className}`}>
      {children}
    </section>
  );
}

export function StepLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
      <span className="text-xs font-mono font-bold text-purple-600 bg-purple-100 rounded-md px-1.5 py-0.5">{n}</span>
      {children}
    </h3>
  );
}

export function StudioActions({ onReset }: { onReset?: () => void }) {
  const t = useTranslation(TRANSLATIONS);
  return (
    <div className="flex flex-wrap gap-3 mt-4 print:hidden">
      <button type="button" onClick={() => window.print()} className="btn-primary">
        <Printer className="w-4 h-4" aria-hidden /> {t.print}
      </button>
      {onReset && (
        <button type="button" onClick={onReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition-colors">
          <RotateCcw className="w-4 h-4" aria-hidden /> {t.reset}
        </button>
      )}
    </div>
  );
}

/** A selectable option button with a pressed state (keyboard and screen-reader friendly). */
export function Choice({ selected, onSelect, children, className = '', label }: { selected: boolean; onSelect: () => void; children: ReactNode; className?: string; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onSelect}
      className={`text-left rounded-xl border-2 px-3 py-2 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${selected ? 'border-purple-500 bg-purple-50 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'} ${className}`}
    >
      {children}
    </button>
  );
}

export function LineInput({ label, value, onChange, placeholder, multiline = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const cls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500';
  return (
    <label className="block text-sm font-semibold text-gray-700">
      <span className="block mb-1">{label}</span>
      {multiline ? (
        <textarea className={cls} rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={200} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={80} />
      )}
    </label>
  );
}
