// Shared building blocks for the paper-first worksheets (Leo and the Wolf, and the story
// worksheet that every book gets). Print layout: two columns on paper, sections never split
// across pages, French guillemets kept with their words.
import type { ReactNode } from 'react';
import { nb } from './worksheetText';


export function Lines({ n }: { n: number }) {
  return <div aria-hidden>{Array.from({ length: n }, (_, i) => <div key={i} className="h-8 print:h-7 border-b border-gray-400" />)}</div>;
}

export function Section({ n, title, prompt, children, className = '' }: { n: number; title: string; prompt: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border-2 border-gray-300 p-4 print:p-3 break-inside-avoid ${className}`}>
      <h4 className="font-bold text-gray-900 flex items-center gap-2">
        <span className="w-6 h-6 shrink-0 rounded-full bg-orange-500 text-white text-xs grid place-items-center print:bg-white print:text-black print:border print:border-black">{n}</span>
        {title}
      </h4>
      <p className="text-sm text-gray-700 mt-1 mb-3 print:mb-2">{nb(prompt)}</p>
      {children}
    </section>
  );
}

export function Circle({ letter }: { letter: string }) {
  return <span className="inline-grid place-items-center w-7 h-7 rounded-full border-2 border-gray-500 text-sm font-bold text-gray-800">{letter}</span>;
}

/** The worksheet's title row: eyebrow, title, and name/date lines (typed values or blanks). */
export function SheetHeader({ eyebrow, title, nameLabel, dateLabel, name, date }: { eyebrow: string; title: string; nameLabel: string; dateLabel: string; name: string; date: string }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-gray-800 pb-3 mb-4 print:mb-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-700 print:text-black">{eyebrow}</p>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-sm text-gray-800 grid gap-1 min-w-56">
        <p>{nameLabel} <span className="inline-block min-w-40 border-b border-gray-500 font-semibold">{name || ' '}</span></p>
        <p>{dateLabel} <span className="inline-block min-w-40 border-b border-gray-500 font-semibold">{date || ' '}</span></p>
      </div>
    </header>
  );
}

/** Word-to-picture matching: words on the left, the same pictures in another order on the right. */
export function MatchColumns({ words, pictures }: { words: string[]; pictures: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-2">
      {words.map((word, i) => (
        <div key={word} className="contents">
          <p className="flex items-center justify-between font-semibold text-gray-800">{word} <span aria-hidden className="w-2 h-2 rounded-full bg-gray-700" /></p>
          <p className="flex items-center gap-3 text-2xl"><span aria-hidden className="w-2 h-2 rounded-full bg-gray-700" />{pictures[i]}</p>
        </div>
      ))}
    </div>
  );
}

