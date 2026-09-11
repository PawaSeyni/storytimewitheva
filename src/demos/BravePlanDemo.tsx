// First-Day Brave Plan (Activity Studio, priority 1). Pairs with Diego's Brave Leap:
// Diego stands at the edge of the cliff with everyone watching. One worry, one helper,
// one brave first step, one tiny celebration, and a conversation prompt for the adult.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StudioActions, LineInput } from './studio/StudioFrame';

type Field = 'worry' | 'helper' | 'step' | 'celebration';
const FIELDS: { id: Field; icon: string }[] = [
  { id: 'worry', icon: '🌧️' },
  { id: 'helper', icon: '🤝' },
  { id: 'step', icon: '🚩' },
  { id: 'celebration', icon: '✨' },
];
const EMPTY: Record<Field, string> = { worry: '', helper: '', step: '', celebration: '' };

const TRANSLATIONS = {
  en: {
    skill: 'Confidence and planning', title: 'First-Day Brave Plan', subtitle: 'Turn one worry into a gentle plan for a brave moment.', grownup: 'Ask the questions',
    eyebrow: 'A gentle map for a brave day', heading: 'Bravery can be one small step.', intro: 'Diego did not feel brave on the cliff. He felt his heart flutter, and he jumped anyway. There is no need to feel fearless. Let’s make a plan with a helper nearby.',
    route: ['home', 'brave step', 'celebrate'],
    labels: { worry: 'One little worry', helper: 'A helper I can find', step: 'My brave first step', celebration: 'A tiny celebration' },
    placeholders: { worry: 'I’m worried about…', helper: 'I can talk to…', step: 'I can try…', celebration: 'Afterwards, I will…' },
    quote: 'Brave is trying while your heart is still fluttering.', adult: 'Conversation prompt for the grown-up: “Diego had his family watching from the beach. Who is on your beach?”', cardLabel: 'Printable brave plan',
  },
  es: {
    skill: 'Confianza y planificación', title: 'Mi plan valiente para el primer día', subtitle: 'Convierte una preocupación en un plan suave para un momento valiente.', grownup: 'Hacer las preguntas',
    eyebrow: 'Un mapa suave para un día valiente', heading: 'Ser valiente puede ser un pasito.', intro: 'Diego no se sentía valiente en el acantilado. Sentía el corazón revoloteando, y saltó de todos modos. No hace falta no tener miedo. Hagamos un plan con un ayudante cerca.',
    route: ['casa', 'paso valiente', 'celebrar'],
    labels: { worry: 'Una pequeña preocupación', helper: 'Un ayudante que puedo buscar', step: 'Mi primer paso valiente', celebration: 'Una pequeña celebración' },
    placeholders: { worry: 'Me preocupa…', helper: 'Puedo hablar con…', step: 'Puedo intentar…', celebration: 'Después, voy a…' },
    quote: 'Ser valiente es intentarlo mientras el corazón todavía revolotea.', adult: 'Pregunta para el adulto: «La familia de Diego lo miraba desde la playa. ¿Quién está en tu playa?»', cardLabel: 'Plan valiente imprimible',
  },
  fr: {
    skill: 'Confiance et planification', title: 'Mon plan courageux du premier jour', subtitle: 'Transforme une inquiétude en un plan tout doux pour un moment courageux.', grownup: 'Poser les questions',
    eyebrow: 'Une carte toute douce pour une journée courageuse', heading: 'Le courage, ça peut être un tout petit pas.', intro: 'Diego ne se sentait pas courageux sur la falaise. Son cœur battait fort, et il a sauté quand même. Pas besoin de ne pas avoir peur. Faisons un plan avec un aide tout près.',
    route: ['maison', 'pas courageux', 'fêter'],
    labels: { worry: 'Une petite inquiétude', helper: 'Un aide que je peux trouver', step: 'Mon premier pas courageux', celebration: 'Une toute petite fête' },
    placeholders: { worry: 'J’ai peur de…', helper: 'Je peux parler à…', step: 'Je peux essayer…', celebration: 'Après, je vais…' },
    quote: 'Être courageux, c’est essayer pendant que le cœur bat encore fort.', adult: 'Question pour l’adulte : « La famille de Diego le regardait depuis la plage. Qui est sur ta plage ? »', cardLabel: 'Plan courageux à imprimer',
  },
};

export default function BravePlanDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [plan, setPlan] = useState<Record<Field, string>>(EMPTY);
  return (
    <StudioFrame emoji="🚩" hue="gold" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={12} bookIds={['diegos-brave-leap']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel className="bg-linear-to-br from-amber-100 to-yellow-50">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{t.eyebrow}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-2 mb-2">{t.heading}</h3>
          <p className="text-sm text-gray-700">{t.intro}</p>
          <p className="mt-6 flex items-center gap-2 text-xs font-mono uppercase text-amber-900" aria-hidden>
            {t.route.map((r, i) => (
              <span key={r} className="flex items-center gap-2">{i > 0 && <span className="w-6 border-t-2 border-dashed border-amber-700" />}{r}</span>
            ))}
          </p>
        </Panel>
        <Printable label={t.cardLabel}>
          <div className="grid gap-4">
            {FIELDS.map((f, i) => (
              <div key={f.id} className="grid grid-cols-[auto_auto_1fr] gap-3 items-start">
                <span className="text-xs font-mono text-amber-700 pt-2">0{i + 1}</span>
                <span className="w-9 h-9 grid place-items-center rounded-lg bg-amber-50 text-lg" aria-hidden>{f.icon}</span>
                <LineInput label={t.labels[f.id]} value={plan[f.id]} onChange={(v) => setPlan({ ...plan, [f.id]: v })} placeholder={t.placeholders[f.id]} multiline />
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm italic text-gray-600">“{t.quote}”</p>
          <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-gray-700">{t.adult}</p>
          <StudioActions onReset={() => setPlan(EMPTY)} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
