// The Thousand Cubes Challenge (Activity Studio). Pairs with Mira's Thousand Cubes: Mira
// dreams of carving eagles, but her first task from Master Hiroshi is a thousand identical
// cubes. A 30-day practice tracker: one cube per day of practice, saved on this device
// only, with a printable cube chart for the fridge.
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from '../lib/language';
import { getLegacy, setLegacy, removeLegacy } from '../lib/storage';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

const DAYS = 30;
interface Tracker { practice: string; goal: string; filled: boolean[] }
const EMPTY: Tracker = { practice: '', goal: '', filled: Array.from({ length: DAYS }, () => false) };
const isTracker = (v: unknown): v is Tracker => {
  const p = v as Tracker;
  return typeof v === 'object' && v !== null
    && typeof p.practice === 'string' && p.practice.length <= 80 && typeof p.goal === 'string' && p.goal.length <= 80
    && Array.isArray(p.filled) && p.filled.length === DAYS && p.filled.every((d) => typeof d === 'boolean');
};

const TRANSLATIONS = {
  en: {
    skill: 'Daily practice', title: 'The Thousand Cubes Challenge', subtitle: 'Practise one thing a little every day and watch your cubes add up.', grownup: 'Notice the practice, not the result',
    intro: 'Mira dreamed of carving eagles and dancing figures. Her first task was a thousand identical cubes. Her hands ached and she felt frustrated, but she found the lesson hidden in doing the small thing well. What will you practise?',
    step1: 'Choose your cube', practice: 'Every day I will practise', practicePh: 'reading, drawing, piano, kicking a ball…', goal: 'My dream goal, like Mira’s eagle (optional)', goalPh: 'read a whole chapter book',
    step2: 'Fill a cube each day', practised: 'I practised today', allDone: 'All 30 cubes are filled!', count: (n: number) => `${n} of ${DAYS} cubes`,
    cubeLabel: (n: number, on: boolean) => `Day ${n}, ${on ? 'filled. Tap to empty it.' : 'empty. Tap to fill it.'}`, fixTip: 'Tapped by mistake? Tap a filled cube to empty it.',
    msg0: 'Every cube starts with one day. Ready for your first?', msg7: 'Seven cubes! A whole week of small steps, one cube at a time, like Mira.', msg15: 'Fifteen cubes, halfway there! Your practice is quietly getting stronger.', msg30: 'Thirty cubes! Great things take time, and you gave it time. Your eagle is getting closer.',
    saved: 'Your cubes are saved on this device, so you can come back tomorrow.', restart: 'Start again', confirm: 'Yes, empty all my cubes', cancel: 'Keep my cubes', confirmQ: 'Empty all 30 cubes and start a new chart?',
    cardLabel: 'Printable cube chart', chart: 'My cube chart', iPractise: 'I practise:', dream: 'My dream goal:', blank: '____________________', motto: 'Every great carving starts with one small cube.',
  },
  es: {
    skill: 'Práctica diaria', title: 'El reto de los mil cubos', subtitle: 'Practica algo un poquito cada día y mira cómo se suman tus cubos.', grownup: 'Fijarse en la práctica, no en el resultado',
    intro: 'Mira soñaba con esculpir águilas y figuras danzantes. Su primera tarea fueron mil cubos idénticos. Le dolían las manos y se sentía frustrada, pero descubrió la lección escondida en hacer bien lo pequeño. ¿Qué vas a practicar tú?',
    step1: 'Elige tu cubo', practice: 'Cada día voy a practicar', practicePh: 'leer, dibujar, piano, patear la pelota…', goal: 'Mi gran sueño, como el águila de Mira (opcional)', goalPh: 'leer un libro de capítulos entero',
    step2: 'Llena un cubo cada día', practised: 'Hoy practiqué', allDone: '¡Los 30 cubos están llenos!', count: (n: number) => `${n} de ${DAYS} cubos`,
    cubeLabel: (n: number, on: boolean) => `Día ${n}, ${on ? 'lleno. Toca para vaciarlo.' : 'vacío. Toca para llenarlo.'}`, fixTip: '¿Te equivocaste? Toca un cubo lleno para vaciarlo.',
    msg0: 'Cada cubo empieza con un día. ¿Listo para el primero?', msg7: '¡Siete cubos! Una semana entera de pasitos, cubo a cubo, como Mira.', msg15: '¡Quince cubos, ya vas por la mitad! Tu práctica se hace más fuerte poco a poco.', msg30: '¡Treinta cubos! Las grandes cosas llevan tiempo, y tú se lo diste. Tu águila está más cerca.',
    saved: 'Tus cubos se guardan en este dispositivo para que vuelvas mañana.', restart: 'Empezar de nuevo', confirm: 'Sí, vaciar todos mis cubos', cancel: 'Guardar mis cubos', confirmQ: '¿Vaciar los 30 cubos y empezar una tabla nueva?',
    cardLabel: 'Tabla de cubos imprimible', chart: 'Mi tabla de cubos', iPractise: 'Practico:', dream: 'Mi gran sueño:', blank: '____________________', motto: 'Toda gran escultura empieza con un pequeño cubo.',
  },
  fr: {
    skill: 'Pratique quotidienne', title: 'Le défi des mille cubes', subtitle: 'Entraîne-toi un petit peu chaque jour et regarde tes cubes s’additionner.', grownup: 'Remarquer l’effort, pas le résultat',
    intro: 'Mira rêvait de sculpter des aigles et des danseurs. Sa première tâche, c’était mille cubes identiques. Elle avait mal aux mains et elle était frustrée, mais elle a découvert la leçon cachée : bien faire les petites choses. Et toi, à quoi vas-tu t’entraîner ?',
    step1: 'Choisis ton cube', practice: 'Chaque jour, je m’entraîne à', practicePh: 'lire, dessiner, jouer du piano, taper dans un ballon…', goal: 'Mon grand rêve, comme l’aigle de Mira (facultatif)', goalPh: 'lire tout un roman',
    step2: 'Remplis un cube chaque jour', practised: 'Je me suis entraîné aujourd’hui', allDone: 'Les 30 cubes sont remplis !', count: (n: number) => `${n} cube${n > 1 ? 's' : ''} sur ${DAYS}`,
    cubeLabel: (n: number, on: boolean) => `Jour ${n}, ${on ? 'rempli. Touche pour le vider.' : 'vide. Touche pour le remplir.'}`, fixTip: 'Une erreur ? Touche un cube rempli pour le vider.',
    msg0: 'Chaque cube commence par une journée. Prêt pour le premier ?', msg7: 'Sept cubes ! Toute une semaine de petits pas, cube après cube, comme Mira.', msg15: 'Quinze cubes, déjà la moitié ! Ton entraînement devient plus solide, tout doucement.', msg30: 'Trente cubes ! Les grandes choses prennent du temps, et tu leur as donné ce temps. Ton aigle se rapproche.',
    saved: 'Tes cubes sont gardés sur cet appareil pour que tu reviennes demain.', restart: 'Recommencer', confirm: 'Oui, vider tous mes cubes', cancel: 'Garder mes cubes', confirmQ: 'Vider les 30 cubes et commencer un nouveau tableau ?',
    cardLabel: 'Tableau des cubes à imprimer', chart: 'Mon tableau des cubes', iPractise: 'Je m’entraîne à :', dream: 'Mon grand rêve :', blank: '____________________', motto: 'Toute grande sculpture commence par un petit cube.',
  },
};

export default function ThousandCubesDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [s, setS] = useState<Tracker>(() => getLegacy('thousandCubes', isTracker) ?? EMPTY);
  const [confirming, setConfirming] = useState(false);
  const update = (next: Tracker) => { setS(next); setLegacy('thousandCubes', next); };
  const count = s.filled.filter(Boolean).length;
  const toggle = (i: number) => update({ ...s, filled: s.filled.map((d, j) => (j === i ? !d : d)) });
  const fillNext = () => { const i = s.filled.indexOf(false); if (i >= 0) toggle(i); };
  const reset = () => { removeLegacy('thousandCubes'); setS(EMPTY); setConfirming(false); };
  const message = count >= 30 ? t.msg30 : count >= 15 ? t.msg15 : count >= 7 ? t.msg7 : t.msg0;

  return (
    <StudioFrame emoji="🧊" hue="teal" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={5} bookIds={['miras-thousand-cubes']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <div className="grid gap-3">
              <LineInput label={t.practice} value={s.practice} onChange={(v) => update({ ...s, practice: v })} placeholder={t.practicePh} />
              <LineInput label={t.goal} value={s.goal} onChange={(v) => update({ ...s, goal: v })} placeholder={t.goalPh} />
            </div>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <button type="button" onClick={fillNext} disabled={count >= DAYS} className="btn-primary mt-2 disabled:opacity-60">
              {count >= DAYS ? t.allDone : `+ ${t.practised}`}
            </button>
            <p className="mt-4 text-lg font-bold text-teal-800">{t.count(count)}</p>
            <div role="progressbar" aria-label={t.count(count)} aria-valuemin={0} aria-valuemax={DAYS} aria-valuenow={count} className="mt-1 h-3 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-teal-600 motion-safe:transition-all motion-safe:duration-500" style={{ width: `${(count / DAYS) * 100}%` }} />
            </div>
            <p role="status" className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">{message}</p>
            <div className="mt-4 grid grid-cols-6 gap-2 max-w-sm">
              {s.filled.map((on, i) => (
                <button key={i} type="button" aria-pressed={on} aria-label={t.cubeLabel(i + 1, on)} onClick={() => toggle(i)}
                  className={`aspect-square rounded-md border-2 grid place-items-center text-xs font-mono focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 motion-safe:transition-transform ${on ? 'border-teal-700 bg-teal-500 text-white motion-safe:scale-105' : 'border-dashed border-gray-400 bg-white text-gray-500 hover:border-teal-400'}`}>
                  {on ? <Check className="w-4 h-4" aria-hidden /> : i + 1}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">{t.fixTip} {t.saved}</p>
            <div className="mt-4">
              {confirming ? (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-700">{t.confirmQ}</span>
                  <button type="button" onClick={reset} className="rounded-full border-2 border-rose-400 px-4 py-1.5 font-semibold text-rose-700 hover:bg-rose-50">{t.confirm}</button>
                  <button type="button" onClick={() => setConfirming(false)} className="rounded-full border-2 border-gray-300 px-4 py-1.5 font-semibold text-gray-700 hover:bg-gray-100">{t.cancel}</button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirming(true)} className="rounded-full border-2 border-purple-300 px-4 py-1.5 text-sm font-semibold text-purple-700 hover:bg-purple-50">{t.restart}</button>
              )}
            </div>
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <h3 className="text-2xl font-bold text-teal-800 print:text-black">{t.chart}</h3>
          <p className="mt-3 text-sm"><span className="font-bold">{t.iPractise}</span> {s.practice.trim() || t.blank}</p>
          <p className="mt-1 text-sm"><span className="font-bold">{t.dream}</span> {s.goal.trim() || t.blank}</p>
          <p className="mt-3 text-sm font-semibold text-gray-700">{t.count(count)}</p>
          <ol className="mt-2 grid grid-cols-6 gap-2 max-w-sm">
            {s.filled.map((on, i) => (
              <li key={i} className="aspect-square border-2 border-gray-700 rounded-sm relative grid place-items-center">
                <span className="absolute top-0.5 left-1 text-[10px] text-gray-500">{i + 1}</span>
                {on && <Check className="w-6 h-6 text-teal-800 print:text-black" aria-hidden />}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-center italic text-gray-700">{t.motto}</p>
          <StudioActions />
        </Printable>
      </div>
    </StudioFrame>
  );
}
