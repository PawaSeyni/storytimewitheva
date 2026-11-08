// Brave Breathing with Diego (Activity Studio). Pairs with Diego's Brave Leap: Diego
// stands at the edge of a sun-warmed cliff with the water far below, and brave doesn't
// feel brave inside. A one-minute wave-breathing exercise (6 slow breaths), a tummy
// check before and after, and a printable pocket card with the three steps.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTranslation } from '../lib/language';
import ReadAloudButton from '../components/ReadAloudButton';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Feel = 'fluttery' | 'tight' | 'ok' | 'calm';
const FEELS: { id: Feel; emoji: string; rank: number }[] = [
  { id: 'fluttery', emoji: '🦋', rank: 0 }, { id: 'tight', emoji: '🪢', rank: 0 },
  { id: 'ok', emoji: '🙂', rank: 1 }, { id: 'calm', emoji: '😌', rank: 2 },
];
const PHASE_MS = 4000;
const BREATHS = 6;
const TOTAL = BREATHS * PHASE_MS * 2;

const MQ = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (cb: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const m = window.matchMedia(MQ);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(MQ).matches;

const TRANSLATIONS = {
  en: {
    skill: 'Calming breath', title: 'Brave Breathing with Diego', subtitle: 'Six slow wave breaths for when your tummy feels fluttery.', grownup: 'Breathe together',
    intro: 'Diego stood at the edge of the cliff. Everyone was watching, and the water was far below. Brave doesn’t always feel brave inside. Let’s breathe like the waves of the sea.',
    before: 'How does your tummy feel right now?', after: 'How does it feel now?', listen: 'Listen: ', step1: 'Tummy check', step2: 'Wave breathing', step3: 'Tummy check again',
    feels: { fluttery: 'fluttery', tight: 'tight', ok: 'OK', calm: 'calm' },
    in: 'Breathe in like a wave coming in…', out: 'Breathe out like a wave going out…', ready: 'Press Start when you are ready.', done: 'Six brave breaths. Well done!',
    breath: (n: number) => `Breath ${n} of ${BREATHS}`, countIn: 'in', countOut: 'out',
    start: 'Start', pause: 'Pause', again: 'Again', reset: 'Reset',
    helped: (b: string, a: string) => `Before: ${b}. Now: ${a}. Breathing helped!`,
    same: (b: string, a: string) => `Before: ${b}. Now: ${a}. Feelings take their time, and that’s OK. You can breathe like a wave again whenever you like.`,
    card: 'My brave breath card', name: 'My name', namePh: 'Your name', steps: ['Breathe in like the wave coming in.', 'Breathe out like the wave going out.', 'Do it 6 times.'],
    quote: 'Brave can feel fluttery inside.', cardLabel: 'Printable brave breath card',
  },
  es: {
    skill: 'Respiración tranquila', title: 'Respiración valiente con Diego', subtitle: 'Seis respiraciones lentas como olas para cuando sientes mariposas en la barriga.', grownup: 'Respirar juntos',
    intro: 'Diego estaba al borde del acantilado. Todos miraban y el agua estaba muy abajo. Ser valiente no siempre se siente valiente por dentro. Respiremos como las olas del mar.',
    before: '¿Cómo sientes la barriga ahora mismo?', after: '¿Y ahora cómo la sientes?', listen: 'Escuchar: ', step1: 'Mira tu barriga', step2: 'Respiración de ola', step3: 'Mira tu barriga otra vez',
    feels: { fluttery: 'con mariposas', tight: 'apretada', ok: 'bien', calm: 'tranquila' },
    in: 'Toma aire como una ola que llega…', out: 'Suelta el aire como una ola que se va…', ready: 'Pulsa Empezar cuando estés listo.', done: 'Seis respiraciones valientes. ¡Muy bien!',
    breath: (n: number) => `Respiración ${n} de ${BREATHS}`, countIn: 'entra', countOut: 'sale',
    start: 'Empezar', pause: 'Pausa', again: 'Otra vez', reset: 'Reiniciar',
    helped: (b: string, a: string) => `Antes: ${b}. Ahora: ${a}. ¡Respirar te ayudó!`,
    same: (b: string, a: string) => `Antes: ${b}. Ahora: ${a}. Los sentimientos se toman su tiempo, y está bien. Puedes respirar como una ola siempre que quieras.`,
    card: 'Mi tarjeta de respiración valiente', name: 'Mi nombre', namePh: 'Tu nombre', steps: ['Toma aire como la ola que llega.', 'Suelta el aire como la ola que se va.', 'Hazlo 6 veces.'],
    quote: 'Ser valiente puede sentirse como mariposas por dentro.', cardLabel: 'Tarjeta de respiración valiente imprimible',
  },
  fr: {
    skill: 'Respiration apaisante', title: 'Respirer avec courage, comme Diego', subtitle: 'Six lentes respirations de vague pour quand ton ventre est plein de papillons.', grownup: 'Respirer ensemble',
    intro: 'Diego se tenait au bord de la falaise. Tout le monde regardait, et l’eau était loin en dessous. Le courage ne se sent pas toujours courageux à l’intérieur. Respirons comme les vagues de la mer.',
    before: 'Comment se sent ton ventre en ce moment ?', after: 'Et maintenant, comment se sent-il ?', listen: 'Écouter : ', step1: 'Écoute ton ventre', step2: 'La respiration de la vague', step3: 'Écoute ton ventre encore',
    feels: { fluttery: 'plein de papillons', tight: 'tout serré', ok: 'ça va', calm: 'calme' },
    in: 'Inspire comme une vague qui arrive…', out: 'Expire comme une vague qui repart…', ready: 'Appuie sur Commencer quand tu es prêt.', done: 'Six respirations courageuses. Bravo !',
    breath: (n: number) => `Respiration ${n} sur ${BREATHS}`, countIn: 'inspire', countOut: 'expire',
    start: 'Commencer', pause: 'Pause', again: 'Encore', reset: 'Remettre à zéro',
    helped: (b: string, a: string) => `Avant : ${b}. Maintenant : ${a}. Respirer t’a aidé !`,
    same: (b: string, a: string) => `Avant : ${b}. Maintenant : ${a}. Les émotions prennent leur temps, et c’est normal. Tu peux respirer comme une vague quand tu veux.`,
    card: 'Ma carte de respiration courageuse', name: 'Mon prénom', namePh: 'Ton prénom', steps: ['Inspire comme la vague qui arrive.', 'Expire comme la vague qui repart.', 'Fais-le 6 fois.'],
    quote: 'Être courageux, ça peut faire des papillons dans le ventre.', cardLabel: 'Carte de respiration courageuse à imprimer',
  },
};

export default function BraveBreathingDemo() {
  const t = useTranslation(TRANSLATIONS);
  const reduced = useSyncExternalStore(subscribeMotion, getReduced, () => false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const [before, setBefore] = useState<Feel | null>(null);
  const [after, setAfter] = useState<Feel | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      elapsedRef.current = Math.min(TOTAL, elapsedRef.current + (now - last));
      last = now;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= TOTAL) setRunning(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const done = elapsed >= TOTAL;
  const started = elapsed > 0;
  const breathing = started && !done;
  const inPhase = Math.floor(elapsed / PHASE_MS) % 2 === 0;
  const progress = (elapsed % PHASE_MS) / PHASE_MS;
  const breathNo = Math.min(BREATHS, Math.floor(elapsed / (PHASE_MS * 2)) + 1);
  const secondsLeft = PHASE_MS / 1000 - Math.floor((elapsed % PHASE_MS) / 1000);
  const scale = !breathing || reduced ? 0.8 : inPhase ? 0.5 + 0.5 * progress : 1 - 0.5 * progress;
  const status = done ? t.done : breathing ? `${t.breath(breathNo)}. ${inPhase ? t.in : t.out}` : t.ready;

  const resetBreath = () => { setRunning(false); elapsedRef.current = 0; setElapsed(0); setAfter(null); };
  const toggle = () => {
    if (done) { elapsedRef.current = 0; setElapsed(0); setAfter(null); setRunning(true); }
    else setRunning(!running);
  };
  const feel = (id: Feel | null) => FEELS.find((f) => f.id === id);
  const b = feel(before);
  const a = feel(after);
  const compare = b && a ? (a.rank > b.rank ? t.helped : t.same)(t.feels[b.id], t.feels[a.id]) : '';

  const feelRow = (value: Feel | null, set: (f: Feel) => void) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {FEELS.map((f) => (
        <Choice key={f.id} selected={value === f.id} onSelect={() => set(f.id)} className="text-center font-semibold">
          <span className="block text-4xl" aria-hidden>{f.emoji}</span>{t.feels[f.id]}
        </Choice>
      ))}
    </div>
  );

  return (
    <StudioFrame emoji="🌊" hue="sky" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={5} bookIds={['diegos-brave-leap']} grownup={t.grownup}>
      <div className="grid gap-6">
        <Panel>
          <p className="text-sm text-gray-700 mb-4">{t.intro}</p>
          <StepLabel n="01">{t.step1}</StepLabel>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-gray-800 font-semibold">{t.before}</p>
            <ReadAloudButton text={t.before} compact label={`${t.listen}${t.before}`} />
          </div>
          {feelRow(before, setBefore)}
        </Panel>
        <Panel className="bg-linear-to-b from-sky-50 to-blue-100">
          <StepLabel n="02">{t.step2}</StepLabel>
          <div className="grid place-items-center py-4">
            <div className="relative w-56 h-56 grid place-items-center" aria-hidden>
              <div
                className="absolute inset-0 rounded-full bg-sky-400/70 border-4 border-sky-600 motion-safe:transition-transform motion-safe:duration-100"
                style={{ transform: `scale(${scale})` }}
              />
              <span className="relative text-5xl">{done ? '🌅' : inPhase ? '🌊' : '🫧'}</span>
            </div>
            <p role="status" className="mt-4 text-xl font-bold text-gray-800 text-center min-h-14">{status}</p>
            {breathing && (
              <p className="mt-1 flex items-center gap-3 text-lg text-gray-700" aria-hidden>
                <span className="font-semibold">{inPhase ? t.countIn : t.countOut}</span>
                {[4, 3, 2, 1].map((n) => (
                  <span key={n} className={n === secondsLeft ? 'text-3xl font-bold text-sky-900 underline' : 'text-gray-400'}>{n}</span>
                ))}
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={toggle} className="btn-primary">
                {running ? <Pause className="w-4 h-4" aria-hidden /> : <Play className="w-4 h-4" aria-hidden />}
                {running ? t.pause : done ? t.again : t.start}
              </button>
              <button type="button" onClick={resetBreath} disabled={!started} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-sky-400 text-sky-800 font-semibold hover:bg-sky-50 disabled:opacity-50">
                <RotateCcw className="w-4 h-4" aria-hidden /> {t.reset}
              </button>
            </div>
          </div>
        </Panel>
        {done && (
          <Panel>
            <StepLabel n="03">{t.step3}</StepLabel>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <p className="text-gray-800 font-semibold">{t.after}</p>
              <ReadAloudButton text={t.after} compact label={`${t.listen}${t.after}`} />
            </div>
            {feelRow(after, setAfter)}
            <p role="status" className="mt-4 text-gray-800 font-semibold">{compare}</p>
          </Panel>
        )}
        <Printable label={t.cardLabel} className="max-w-md">
          <h3 className="text-xl font-bold text-gray-800">🌊 {t.card}</h3>
          <div className="mt-3 print:hidden"><LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} /></div>
          <p className="mt-3 text-gray-800">{t.name}: <strong>{name.trim() || '____________'}</strong></p>
          <ol className="mt-3 list-decimal pl-6 space-y-1 text-gray-800">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-4 text-sm italic text-gray-700">{t.quote}</p>
          <StudioActions onReset={() => { resetBreath(); setBefore(null); setName(''); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
