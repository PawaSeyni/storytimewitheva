// The Patient Maker Passport (Activity Studio, priority 3). Pairs with Heidi's Journey
// to Mastery, Mira's Thousand Cubes and The Sanding Block: three makers who learn that
// the slow part is the real part. Break a goal into small practice steps, record the
// attempts, and earn a printable completion certificate. Saved on this device so the
// passport can span several practice sessions (storage adapter, never sent anywhere).
import { useState } from 'react';
import { Wand2, Star, Check } from 'lucide-react';
import { useTranslation } from '../lib/language';
import { getLegacy, setLegacy, removeLegacy } from '../lib/storage';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

const STEPS = 4;
interface Passport { goal: string; steps: string[]; done: boolean[]; attempts: number[] }
const EMPTY: Passport = { goal: '', steps: ['', '', '', ''], done: [false, false, false, false], attempts: [0, 0, 0, 0] };
const isPassport = (v: unknown): v is Passport => {
  const p = v as Passport;
  return typeof v === 'object' && v !== null && typeof p.goal === 'string' && Array.isArray(p.steps) && p.steps.length === STEPS && p.steps.every((s) => typeof s === 'string')
    && Array.isArray(p.done) && p.done.length === STEPS && p.done.every((d) => typeof d === 'boolean')
    && Array.isArray(p.attempts) && p.attempts.length === STEPS && p.attempts.every((n) => typeof n === 'number' && n >= 0 && n < 1000);
};

const TRANSLATIONS = {
  en: {
    skill: 'Growth mindset', title: 'The Patient Maker Passport', subtitle: 'Break a big wish into small practice steps and celebrate progress.', grownup: 'Cheer small steps',
    heading: 'Small steps make strong makers.', intro: 'Heidi wanted to build a robot and got a broom. Mira wanted to carve eagles and got a thousand cubes. The boy in the workshop got a sanding block. Choose a wish, then give yourself four gentle practice steps.',
    goal: 'My maker wish', goalPh: 'I would like to learn, make, or practise…', stepLabel: (n: number) => `My small practice step ${n}`, tried: 'I tried', tries: 'tries', markDone: (n: number) => `Mark practice step ${n} complete`, addTry: (n: number) => `Add a practice attempt to step ${n}`,
    stamps: 'Practice stamps', progress: 'steps done', certificate: 'This passport belongs to', maker: 'a patient maker', anyMaker: 'a wonderful maker', knows: 'who knows that practice can grow.', saved: 'Your passport is saved on this device, so practice can continue another day.', cardLabel: 'Printable maker passport and certificate',
  },
  es: {
    skill: 'Mentalidad de crecimiento', title: 'El pasaporte del creador paciente', subtitle: 'Divide un gran deseo en pequeños pasos de práctica y celebra el progreso.', grownup: 'Animar los pequeños pasos',
    heading: 'Los pasos pequeños hacen creadores fuertes.', intro: 'Heidi quería construir un robot y recibió una escoba. Mira quería tallar águilas y recibió mil cubos. El niño del taller recibió un bloque de lijar. Elige un deseo y date cuatro pasos de práctica suaves.',
    goal: 'Mi deseo de creador', goalPh: 'Me gustaría aprender, hacer o practicar…', stepLabel: (n: number) => `Mi pequeño paso de práctica ${n}`, tried: 'Lo intenté', tries: 'veces', markDone: (n: number) => `Marcar el paso ${n} como completado`, addTry: (n: number) => `Añadir un intento al paso ${n}`,
    stamps: 'Sellos de práctica', progress: 'pasos hechos', certificate: 'Este pasaporte pertenece a', maker: 'un creador paciente', anyMaker: 'un creador maravilloso', knows: 'que sabe que la práctica hace crecer.', saved: 'Tu pasaporte se guarda en este dispositivo para que la práctica pueda seguir otro día.', cardLabel: 'Pasaporte y certificado de creador imprimibles',
  },
  fr: {
    skill: 'État d’esprit de progrès', title: 'Le passeport du fabricant patient', subtitle: 'Découpe un grand souhait en petites étapes d’entraînement et fête les progrès.', grownup: 'Encourager les petits pas',
    heading: 'Les petits pas font les grands fabricants.', intro: 'Heidi voulait construire un robot et a reçu un balai. Mira voulait sculpter des aigles et a reçu mille cubes. Le garçon de l’atelier a reçu un bloc à poncer. Choisis un souhait, puis donne-toi quatre petites étapes d’entraînement.',
    goal: 'Mon souhait de fabricant', goalPh: 'J’aimerais apprendre, fabriquer ou m’entraîner à…', stepLabel: (n: number) => `Ma petite étape d’entraînement ${n}`, tried: 'J’ai essayé', tries: 'fois', markDone: (n: number) => `Marquer l’étape ${n} comme terminée`, addTry: (n: number) => `Ajouter un essai à l’étape ${n}`,
    stamps: 'Tampons d’entraînement', progress: 'étapes terminées', certificate: 'Ce passeport appartient à', maker: 'un fabricant patient', anyMaker: 'un fabricant formidable', knows: 'qui sait que l’entraînement fait grandir.', saved: 'Ton passeport est gardé sur cet appareil pour que l’entraînement continue un autre jour.', cardLabel: 'Passeport et certificat de fabricant à imprimer',
  },
};

export default function MakerPassportDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [p, setP] = useState<Passport>(() => getLegacy('makerPassport', isPassport) ?? EMPTY);
  const update = (next: Passport) => {
    setP(next);
    setLegacy('makerPassport', next);
  };
  const completed = p.done.filter(Boolean).length;
  const setAt = <T,>(arr: T[], i: number, v: T) => arr.map((x, j) => (j === i ? v : x));

  return (
    <StudioFrame emoji="🛠️" hue="teal" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['heidis-journey-to-mastery', 'miras-thousand-cubes', 'sanding-block']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <Panel className="mb-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-full border-2 border-dashed border-amber-600 bg-amber-200 text-amber-900 grid place-items-center -rotate-6" aria-hidden><Wand2 className="w-7 h-7" /></div>
              <div>
                <StepLabel n="01">{t.heading}</StepLabel>
                <p className="text-sm text-gray-600">{t.intro}</p>
              </div>
            </div>
            <div className="mt-4"><LineInput label={t.goal} value={p.goal} onChange={(v) => update({ ...p, goal: v })} placeholder={t.goalPh} /></div>
            <ol className="mt-4 grid gap-3">
              {p.steps.map((step, i) => (
                <li key={i} className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${p.done[i] ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                  <button type="button" aria-pressed={p.done[i]} aria-label={t.markDone(i + 1)} onClick={() => update({ ...p, done: setAt(p.done, i, !p.done[i]) })} className={`w-8 h-8 shrink-0 rounded-full border-2 grid place-items-center text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${p.done[i] ? 'border-emerald-600 bg-emerald-600' : 'border-gray-400 bg-white'}`}>
                    {p.done[i] && <Check className="w-4 h-4" aria-hidden />}
                  </button>
                  <span className="w-7 h-7 shrink-0 grid place-items-center rounded-md bg-amber-100 text-amber-900 text-xs font-mono" aria-hidden>{i + 1}</span>
                  <div className="flex-1 min-w-40"><LineInput label={t.stepLabel(i + 1)} value={step} onChange={(v) => update({ ...p, steps: setAt(p.steps, i, v) })} /></div>
                  <button type="button" aria-label={t.addTry(i + 1)} onClick={() => update({ ...p, attempts: setAt(p.attempts, i, Math.min(999, p.attempts[i] + 1)) })} className="text-xs font-semibold rounded-full border border-teal-300 text-teal-800 px-3 py-1.5 hover:bg-teal-50">
                    {t.tried} {p.attempts[i]} {t.tries} +
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-gray-500">{t.saved}</p>
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="flex flex-col gap-4 self-start">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-800">{t.stamps}</p>
          <div className="flex gap-2" aria-label={`${completed}/${STEPS} ${t.progress}`} role="status">
            {p.done.map((d, i) => (
              <span key={i} className={`w-10 h-10 rounded-lg border-2 border-dashed grid place-items-center text-sm font-mono ${d ? 'border-emerald-600 bg-emerald-100 text-emerald-900' : 'border-gray-300 text-gray-400'}`} aria-hidden>{d ? '✓' : i + 1}</span>
            ))}
          </div>
          <p className="text-3xl font-bold text-teal-800">{completed}<span className="text-sm font-normal text-gray-500"> / {STEPS} {t.progress}</span></p>
          {p.goal && <p className="text-sm text-gray-700 italic">“{p.goal}”</p>}
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-center text-amber-900">
            <Star className="w-6 h-6 mx-auto mb-2 text-amber-500" aria-hidden />
            <p className="text-xs font-mono uppercase tracking-wider">{t.certificate}</p>
            <p className="my-2 text-xl font-bold">{completed === STEPS ? t.maker : t.anyMaker}</p>
            <p className="text-xs font-mono uppercase tracking-wider">{t.knows}</p>
          </div>
          <StudioActions onReset={() => { removeLegacy('makerPassport'); setP(EMPTY); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
