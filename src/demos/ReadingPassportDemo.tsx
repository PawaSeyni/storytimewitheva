// Eva Gallo Reading Passport (activities audit 2026-11). One stamp per book in the
// collection. A stamp IS the book's "read" status in the personal library
// (src/lib/personalLibrary.ts): the same state the book page's "Read" button sets, so the
// two can never disagree, and nothing new is stored. Badges at 5, 10 and every book, a
// printable certificate, the book's "after reading" question as the reward for each stamp,
// and an "up next" pick from the books not stamped yet.
import { useEffect, useState } from 'react';
import { Link } from '../components/LocalizedLink';
import { useBooks, books as CATALOG, isComingSoon } from '../data/books';
import { relatedBooksFor } from '../data/relatedBooks';
import { useLanguage, useTranslation } from '../lib/language';
import { loadLibrary, onLibraryChange, setStatus, booksWithStatus } from '../lib/personalLibrary';
import { track } from '../lib/analytics';
import { StudioFrame, Panel, Printable, StudioActions, LineInput } from './studio/StudioFrame';
import { nb } from './studio/worksheetText';
import { isAmazonCover, sizedCover } from '../lib/covers';

/** Small cover: Amazon CDN covers are requested at thumbnail size, local ones as they are. */
const thumb = (src: string) => (isAmazonCover(src) ? sizedCover(src, 160) : src);

const TRANSLATIONS = {
  en: {
    skill: 'Reading habit', title: 'Eva Gallo Reading Passport', subtitle: 'Collect a stamp for every book you read, earn badges, and print your certificate.', grownup: 'Stamp each book together',
    stamps: (n: number, total: number) => `${n} of ${total} stamps`, stampIt: 'I read it! Stamp it', unstamp: 'Remove stamp', seeBook: 'See the book', talk: 'Talk about it:',
    next: 'Up next for your passport', nextWhy: 'A good next story, because you read', nextAny: 'Start your passport with',
    badges: 'Badges', badge: [['🥉', 'Bronze badge', '5 books'], ['🥈', 'Silver badge', '10 books'], ['🥇', 'Gold badge', 'every book']],
    toGo: (n: number) => `${n} more to the next badge`, allDone: 'Every book stamped. What a reader!',
    name: 'Reader’s name', certTitle: 'Reading Certificate', certBody: (n: number) => `has read ${n} ${n === 1 ? 'book' : 'books'} from the Eva Gallo Collection`, certNone: 'Stamp your first book to start your certificate.', certEarned: 'Badge earned:', certSoFar: 'Books stamped:',
    local: 'Your stamps stay on this device, in the same reading list as the “Read” button on each book page.', cardLabel: 'Reading passport certificate',
  },
  es: {
    skill: 'Hábito lector', title: 'Pasaporte de lectura Eva Gallo', subtitle: 'Consigue un sello por cada libro que leas, gana insignias e imprime tu certificado.', grownup: 'Sellar cada libro juntos',
    stamps: (n: number, total: number) => `${n} de ${total} sellos`, stampIt: '¡Lo leí! Sellarlo', unstamp: 'Quitar el sello', seeBook: 'Ver el libro', talk: 'Hablen de esto:',
    next: 'El próximo para tu pasaporte', nextWhy: 'Un buen próximo cuento, porque leíste', nextAny: 'Empieza tu pasaporte con',
    badges: 'Insignias', badge: [['🥉', 'Insignia de bronce', '5 libros'], ['🥈', 'Insignia de plata', '10 libros'], ['🥇', 'Insignia de oro', 'todos los libros']],
    toGo: (n: number) => `${n} más para la próxima insignia`, allDone: 'Todos los libros sellados. ¡Qué gran lectura!',
    name: 'Nombre de quien lee', certTitle: 'Certificado de lectura', certBody: (n: number) => `ha leído ${n} ${n === 1 ? 'libro' : 'libros'} de la colección Eva Gallo`, certNone: 'Sella tu primer libro para empezar tu certificado.', certEarned: 'Insignia conseguida:', certSoFar: 'Libros sellados:',
    local: 'Tus sellos se quedan en este dispositivo, en la misma lista de lectura que el botón «Leído» de cada libro.', cardLabel: 'Certificado del pasaporte de lectura',
  },
  fr: {
    skill: 'Habitude de lecture', title: 'Passeport de lecture Eva Gallo', subtitle: 'Gagne un tampon pour chaque livre lu, remporte des badges et imprime ton diplôme.', grownup: 'Tamponner chaque livre ensemble',
    stamps: (n: number, total: number) => `${n} tampons sur ${total}`, stampIt: 'Je l’ai lu ! Tamponner', unstamp: 'Retirer le tampon', seeBook: 'Voir le livre', talk: 'Parlez-en :',
    next: 'Le prochain pour ton passeport', nextWhy: 'Une bonne prochaine histoire, parce que tu as lu', nextAny: 'Commence ton passeport avec',
    badges: 'Badges', badge: [['🥉', 'Badge de bronze', '5 livres'], ['🥈', 'Badge d’argent', '10 livres'], ['🥇', 'Badge d’or', 'tous les livres']],
    toGo: (n: number) => `Encore ${n} pour le prochain badge`, allDone: 'Tous les livres tamponnés. Quelle lecture !',
    name: 'Prénom du lecteur ou de la lectrice', certTitle: 'Diplôme de lecture', certBody: (n: number) => `a lu ${n} ${n === 1 ? 'livre' : 'livres'} de la collection Eva Gallo`, certNone: 'Tamponne ton premier livre pour commencer ton diplôme.', certEarned: 'Badge obtenu :', certSoFar: 'Livres tamponnés :',
    local: 'Tes tampons restent sur cet appareil, dans la même liste de lecture que le bouton « Lu » de chaque livre.', cardLabel: 'Diplôme du passeport de lecture',
  },
};

export default function ReadingPassportDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks().filter((b) => !isComingSoon(b));
  const total = books.length;
  const thresholds = [5, 10, total];

  // Read status from the personal library; re-sync when any page changes it.
  const readIds = () => new Set(booksWithStatus(loadLibrary(), 'read'));
  const [read, setRead] = useState<Set<string>>(() => new Set());
  const [lastRead, setLastRead] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => {
      setRead(readIds());
      setLastRead(booksWithStatus(loadLibrary(), 'read')[0] ?? null);
    };
    sync();
    return onLibraryChange(sync);
  }, []);
  const [name, setName] = useState('');

  const stamp = (id: string, on: boolean) => {
    setStatus(id, on ? 'read' : null);
    track('Library Status', { book: id, status: on ? 'read' : 'cleared', placement: 'passport' });
    setRead(readIds());
    setLastRead(booksWithStatus(loadLibrary(), 'read')[0] ?? null);
  };

  const count = books.filter((b) => read.has(b.id)).length;
  const earned = thresholds.filter((n) => count >= n).length; // 0..3
  const nextThreshold = thresholds.find((n) => count < n);
  const afterPrompt = (id: string) => CATALOG.find((b) => b.id === id)?.discussionQuestions?.find((q) => q.stage === 'after')?.prompt[language] ?? '';

  // Up next: an editorial pick related to the most recent stamp, else the first unread book.
  const unread = books.filter((b) => !read.has(b.id));
  const relatedNext = lastRead ? relatedBooksFor(lastRead, 6).map((r) => r.id).find((id) => !read.has(id)) : undefined;
  const nextBook = books.find((b) => b.id === relatedNext) ?? unread[0];
  const lastTitle = lastRead ? books.find((b) => b.id === lastRead)?.title : undefined;

  return (
    <StudioFrame emoji="🛂" hue="teal" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-9" minutes={5} bookIds={[]} grownup={t.grownup} printHero={false}>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <Panel className="mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-2xl font-bold text-teal-800" role="status">{t.stamps(count, total)}</p>
              <p className="text-sm font-semibold text-gray-600">{nextThreshold ? t.toGo(nextThreshold - count) : t.allDone}</p>
            </div>
            <div className="mt-3 h-3 rounded-full bg-gray-200 overflow-hidden" aria-hidden>
              <div className="h-full bg-linear-to-r from-teal-400 to-emerald-500 motion-safe:transition-all" style={{ width: `${(count / total) * 100}%` }} />
            </div>
            <p className="mt-3 text-xs text-gray-500">{t.local}</p>
          </Panel>

          {nextBook && (
            <Panel className="mb-4 bg-amber-50 border-amber-200">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{t.next}</p>
              <p className="text-sm text-gray-700 mt-1">{lastTitle && relatedNext ? `${t.nextWhy} ${lastTitle}:` : `${t.nextAny}:`}</p>
              <Link to={`/books/${nextBook.id}`} className="mt-2 inline-flex items-center gap-3 font-bold text-gray-900 hover:text-purple-700" data-passport-next={nextBook.id}>
                {nextBook.coverImage && <img src={thumb(nextBook.coverImage)} alt="" className="w-12 h-12 rounded-md object-cover" loading="lazy" />}
                {nextBook.title} <span aria-hidden>→</span>
              </Link>
            </Panel>
          )}

          <ul className="grid gap-3 sm:grid-cols-2 print:hidden">
            {books.map((b) => {
              const on = read.has(b.id);
              return (
                <li key={b.id} className={`relative rounded-2xl border-2 p-3 flex gap-3 ${on ? 'border-teal-400 bg-teal-50' : 'border-dashed border-gray-300 bg-white'}`} data-passport-book={b.id} data-stamped={on ? 'yes' : 'no'}>
                  {b.coverImage && <img src={thumb(b.coverImage)} alt="" className={`w-16 h-16 shrink-0 rounded-lg object-cover ${on ? '' : 'opacity-60 grayscale'}`} loading="lazy" />}
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-gray-800 leading-snug ${on ? 'pr-7' : ''}`}>{b.title}</p>
                    {on ? (
                      <>
                        <p className="text-xs text-gray-700 mt-1"><span className="font-semibold">{t.talk}</span> {nb(afterPrompt(b.id))}</p>
                        <button type="button" onClick={() => stamp(b.id, false)} className="mt-2 text-xs font-semibold text-gray-500 underline underline-offset-2 hover:text-gray-700">{t.unstamp}</button>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button type="button" onClick={() => stamp(b.id, true)} className="text-xs font-semibold rounded-full bg-teal-600 text-white px-3 py-1.5 hover:bg-teal-700">{t.stampIt}</button>
                        <Link to={`/books/${b.id}`} className="text-xs font-semibold rounded-full border border-gray-300 text-gray-700 px-3 py-1.5 hover:bg-gray-50">{t.seeBook}</Link>
                      </div>
                    )}
                  </div>
                  {on && <span aria-hidden className="absolute -top-2 -right-2 w-10 h-10 rounded-full border-2 border-teal-600 bg-white text-teal-700 grid place-items-center text-lg font-bold rotate-12">✓</span>}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-4 self-start">
          <Panel>
            <h3 className="font-bold text-gray-800 mb-2">{t.badges}</h3>
            <ul className="grid gap-2">
              {t.badge.map(([emoji, label, need], i) => {
                const got = i < earned;
                return (
                  <li key={label} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2 ${got ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white opacity-70'}`} data-badge={i} data-earned={got ? 'yes' : 'no'}>
                    <span aria-hidden className={`text-3xl ${got ? '' : 'grayscale'}`}>{emoji}</span>
                    <span className="text-sm"><span className="font-bold text-gray-800 block">{label}</span><span className="text-gray-600">{need}</span></span>
                    {got && <span className="ml-auto text-emerald-700 font-bold" aria-label="✓">✓</span>}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4"><LineInput label={t.name} value={name} onChange={setName} /></div>
          </Panel>

          <Printable label={t.cardLabel} className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-800">{t.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{t.certTitle}</h3>
            {count === 0 ? (
              <p className="text-sm text-gray-600 my-6">{t.certNone}</p>
            ) : (
              <>
                <p className="mt-4 text-xl font-bold text-gray-900 border-b-2 border-gray-400 pb-1">{name || ' '}</p>
                <p className="text-sm text-gray-700 mt-2">{t.certBody(count)}</p>
                {earned > 0 && (
                  <p className="mt-4 text-sm font-semibold text-gray-800">{nb(t.certEarned)} <span className="text-2xl align-middle" aria-hidden>{t.badge[earned - 1][0]}</span> {t.badge[earned - 1][1]}</p>
                )}
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-left">{nb(t.certSoFar)}</p>
                <ul className="mt-1 text-left text-sm text-gray-800 grid gap-0.5">
                  {books.filter((b) => read.has(b.id)).map((b) => <li key={b.id}>✓ {b.title}</li>)}
                </ul>
              </>
            )}
            {count > 0 && <StudioActions />}
          </Printable>
        </div>
      </div>
    </StudioFrame>
  );
}
