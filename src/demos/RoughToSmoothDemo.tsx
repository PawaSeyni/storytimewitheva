// Rough to Smooth (Activity Studio). Pairs with The Sanding Block: a young boy wants to be a
// great woodworker today, right now, and his grandfather hands him a sanding block. Sand a
// rough plank one patient stroke at a time, then choose something to get good at slowly and
// print a seven-day practice card. Nothing here retells the book's plot beyond its description.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

/** Strokes it takes to sand the plank smooth: enough to feel slow, short enough to finish. */
const STROKES = 24;
const ROUGH = ['🪵', '〰️', '⁂', '✳️', '⁂', '〰️'];
type Step = 'minutes' | 'slow' | 'again' | 'ask';
const STEPS: { id: Step; icon: string }[] = [{ id: 'minutes', icon: '⏱️' }, { id: 'slow', icon: '🐢' }, { id: 'again', icon: '🔁' }, { id: 'ask', icon: '🙋' }];
const DAYS = 7;

const TRANSLATIONS = {
  en: {
    skill: 'Patience and practice', title: 'Rough to Smooth', subtitle: 'Sand a rough plank one patient stroke at a time, then plan a skill you will grow slowly.', grownup: 'Practice something side by side',
    step1: 'Sand the plank', intro: 'In The Sanding Block, a young boy wants to be a great woodworker today, right now. His grandfather hands him a sanding block. Sand this rough plank smooth, one stroke at a time.',
    sand: 'Sand one stroke', strokes: (n: number) => `${n} of ${STROKES} strokes`,
    stage: (pct: number) => (pct === 0 ? 'Rough and splintery. Ready?' : pct < 40 ? 'Still rough. Keep going, slowly.' : pct < 75 ? 'It’s getting smoother. Feel the difference?' : pct < 100 ? 'Almost smooth. A few more strokes.' : 'Smooth! No one stroke did that. All of them together did.'),
    step2: 'Something I want to get good at', intro2: 'Becoming good at something is a slow craft, like sanding. What do you want to get good at? Pick one small step to practice each day.',
    goal: 'I want to get good at', goalPh: 'drawing horses', stepQ: 'My small step each day',
    steps: { minutes: 'Practice for 5 minutes', slow: 'Go slowly and carefully', again: 'Try one more time', ask: 'Ask someone to show me' },
    cardLabel: 'Printable practice card', card: 'Rough to Smooth', goalLine: 'I am getting good at:', stepLine: 'My small step:', week: 'Color one box each day you practice.', day: (n: number) => `Day ${n}`,
    motto: 'Good things take many small strokes.', blank: '________________',
  },
  es: {
    skill: 'Paciencia y práctica', title: 'De áspero a suave', subtitle: 'Lija una tabla áspera, un paciente movimiento cada vez, y planea una habilidad que irás haciendo crecer despacio.', grownup: 'Practicar algo uno al lado del otro',
    step1: 'Lija la tabla', intro: 'En El bloque de lijar, un niño quiere ser un gran carpintero hoy, ya. Su abuelo le entrega un bloque de lijar. Lija esta tabla áspera hasta dejarla suave, movimiento a movimiento.',
    sand: 'Lijar una vez', strokes: (n: number) => `${n} de ${STROKES} movimientos`,
    stage: (pct: number) => (pct === 0 ? 'Áspera y llena de astillas. ¿Empezamos?' : pct < 40 ? 'Todavía está áspera. Sigue, despacio.' : pct < 75 ? 'Se está poniendo más suave. ¿Notas la diferencia?' : pct < 100 ? 'Casi suave. Unos movimientos más.' : '¡Suave! Ningún movimiento lo hizo solo. Lo hicieron todos juntos.'),
    step2: 'Algo en lo que quiero mejorar', intro2: 'Llegar a hacer algo bien es un oficio lento, como lijar. ¿En qué quieres mejorar? Elige un pequeño paso para practicar cada día.',
    goal: 'Quiero mejorar en', goalPh: 'dibujar caballos', stepQ: 'Mi pequeño paso de cada día',
    steps: { minutes: 'Practicar 5 minutos', slow: 'Ir despacio y con cuidado', again: 'Intentarlo una vez más', ask: 'Pedir a alguien que me enseñe' },
    cardLabel: 'Tarjeta de práctica para imprimir', card: 'De áspero a suave', goalLine: 'Estoy mejorando en:', stepLine: 'Mi pequeño paso:', week: 'Colorea una casilla cada día que practiques.', day: (n: number) => `Día ${n}`,
    motto: 'Las cosas buenas llevan muchos pequeños movimientos.', blank: '________________',
  },
  fr: {
    skill: 'Patience et entraînement', title: 'De rugueux à lisse', subtitle: 'Ponce une planche rugueuse, un geste patient à la fois, puis prévois un savoir-faire à faire grandir doucement.', grownup: 'S’entraîner côte à côte',
    step1: 'Ponce la planche', intro: 'Dans Le bloc à poncer, un jeune garçon veut être un grand menuisier aujourd’hui, tout de suite. Son grand-père lui tend un bloc à poncer. Ponce cette planche rugueuse jusqu’à ce qu’elle soit lisse, un geste à la fois.',
    sand: 'Poncer une fois', strokes: (n: number) => `${n} gestes sur ${STROKES}`,
    stage: (pct: number) => (pct === 0 ? 'Rugueuse et pleine d’échardes. On commence ?' : pct < 40 ? 'Encore rugueuse. Continue, doucement.' : pct < 75 ? 'Elle devient plus lisse. Tu sens la différence ?' : pct < 100 ? 'Presque lisse. Encore quelques gestes.' : 'Lisse ! Aucun geste ne l’a fait tout seul. Tous ensemble, oui.'),
    step2: 'Quelque chose que je veux savoir bien faire', intro2: 'Devenir bon dans quelque chose, c’est un travail lent, comme poncer. Qu’aimerais-tu savoir bien faire ? Choisis un petit pas à faire chaque jour.',
    goal: 'Je veux savoir bien', goalPh: 'dessiner des chevaux', stepQ: 'Mon petit pas de chaque jour',
    steps: { minutes: 'M’entraîner 5 minutes', slow: 'Aller doucement et avec soin', again: 'Essayer encore une fois', ask: 'Demander à quelqu’un de me montrer' },
    cardLabel: 'Carte d’entraînement à imprimer', card: 'De rugueux à lisse', goalLine: 'J’apprends à bien :', stepLine: 'Mon petit pas :', week: 'Colorie une case chaque jour où tu t’entraînes.', day: (n: number) => `Jour ${n}`,
    motto: 'Les belles choses demandent beaucoup de petits gestes.', blank: '________________',
  },
};

export default function RoughToSmoothDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [strokes, setStrokes] = useState(0);
  const [goal, setGoal] = useState('');
  const [step, setStep] = useState<Step | null>(null);

  const pct = Math.round((strokes / STROKES) * 100);
  const smooth = strokes >= STROKES;
  const reset = () => { setStrokes(0); setGoal(''); setStep(null); };
  // Rough marks fade as the plank is sanded; the grain shows through.
  const marks = Math.ceil(ROUGH.length * (1 - strokes / STROKES));

  return (
    <StudioFrame emoji="🪵" hue="gold" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={10} bookIds={['sanding-block']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <div
              aria-hidden
              data-plank={smooth ? 'smooth' : 'rough'}
              className="relative h-24 rounded-xl border-4 border-amber-700 overflow-hidden"
              style={{ background: `repeating-linear-gradient(90deg, #d6a46b 0 18px, #c8935a 18px 22px)`, filter: `saturate(${0.7 + 0.3 * (strokes / STROKES)})` }}
            >
              <div className="absolute inset-0 flex items-center justify-around text-2xl text-amber-950" style={{ opacity: 1 - strokes / STROKES }}>
                {ROUGH.slice(0, marks).map((m, i) => <span key={i}>{m}</span>)}
              </div>
              {smooth && <div className="absolute inset-0 grid place-items-center text-4xl">✨</div>}
            </div>
            <div className="mt-3 h-3 rounded-full bg-amber-100 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={STROKES} aria-valuenow={strokes} aria-label={t.strokes(strokes)}>
              <div className="h-full bg-amber-500 transition-[width] motion-reduce:transition-none" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-primary" onClick={() => setStrokes(Math.min(STROKES, strokes + 1))} disabled={smooth}>🧽 {t.sand}</button>
              <span className="text-sm text-gray-600">{t.strokes(strokes)}</span>
            </div>
            <p role="status" className="mt-3 min-h-10 font-semibold text-gray-800">{t.stage(pct)}</p>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
            <LineInput label={t.goal} value={goal} onChange={setGoal} placeholder={t.goalPh} />
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-gray-700 mb-2">{t.stepQ}</legend>
              <div className="grid grid-cols-2 gap-2">
                {STEPS.map((s) => (
                  <Choice key={s.id} selected={step === s.id} onSelect={() => setStep(s.id)} className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>{s.icon}</span><span className="text-sm font-semibold">{t.steps[s.id]}</span>
                  </Choice>
                ))}
              </div>
            </fieldset>
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <div className="rounded-xl border-4 border-amber-300 bg-amber-50 p-5 print:bg-white">
            <p className="text-center text-4xl" aria-hidden>🪵🧽</p>
            <h3 className="text-center text-2xl font-bold text-amber-900">{t.card}</h3>
            <p className="mt-4 text-sm text-gray-800"><span className="font-bold">{t.goalLine}</span> {goal.trim() || t.blank}</p>
            <p className="mt-2 text-sm text-gray-800"><span className="font-bold">{t.stepLine}</span> {step ? `${STEPS.find((s) => s.id === step)?.icon} ${t.steps[step]}` : t.blank}</p>
            <p className="mt-4 text-sm text-gray-700">{t.week}</p>
            <ol className="mt-2 grid grid-cols-7 gap-1">
              {Array.from({ length: DAYS }, (_, i) => (
                <li key={i} className="aspect-square rounded-md border-2 border-amber-400 bg-white text-[10px] font-semibold text-amber-900 p-1">{t.day(i + 1)}</li>
              ))}
            </ol>
            <p className="mt-5 text-center font-bold text-amber-900">{t.motto}</p>
          </div>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
