// Ask-First Architect (Activity Studio). Pairs with The Tower That Touched the Sky:
// architect Victor Mercer never sees the one raised hand, and learns to design with
// questions rather than certainty. Build a six-floor tower, stop and listen (or not),
// then take home an "ask 3 questions before you build" card for real block building.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

type Floor = 'strong' | 'wobbly';
const MAX_FLOORS = 6;

const TRANSLATIONS = {
  en: {
    open: '“', close: '”',
    skill: 'Listening and early engineering', title: 'Ask-First Architect', subtitle: 'Build a tower, and stop to listen when the junior engineer raises her hand.', grownup: 'Be the junior engineer',
    step1: 'Build floor by floor', intro: 'In the story, architect Victor Mercer never sees the one hand that goes up. This time, you are the architect. Before each new floor, the junior engineer raises her hand.',
    hand: 'The junior engineer raises her hand:',
    questions: ['Is the base wide enough?', 'Did we check the ground?', 'What happens when the wind blows?', 'Who will use this floor?', 'Are the floors lined up?', 'Can people get out safely?'],
    listen: 'Stop and listen', keep: 'Keep building',
    done: 'Six floors! Your tower is finished.',
    status: (n: number, s: number, w: number) => `Floors: ${n} of ${MAX_FLOORS}. Strong floors: ${s}. Wobbly floors: ${w}.`,
    wobbleMsg: 'Uh oh, the tower is leaning. Nobody stopped to listen. You can still fix it by asking!', steady: 'The tower stands steady.',
    floor: (n: number) => `Floor ${n}`, strong: 'strong', wobbly: 'wobbly',
    fix: (n: number) => `Fix floor ${n} by asking`, asked: 'Questions we asked', none: 'No questions yet.',
    step2: 'Ask 3 questions before you build', cardIntro: 'Use this card with real blocks at home or in class. Ask these questions before you start.',
    q: (n: number) => `Question ${n}`, ph: ['Is the bottom wide enough?', 'Is the floor flat?', 'What if someone bumps it?'],
    result: (s: number, w: number) => `My screen tower: ${s} strong, ${w} wobbly.`, cardLabel: 'Printable ask-first building card',
  },
  es: {
    open: '«', close: '»',
    skill: 'Escuchar e ingeniería para peques', title: 'Arquitecto que pregunta primero', subtitle: 'Construye una torre y detente a escuchar cuando la joven ingeniera levanta la mano.', grownup: 'Levantar la mano y preguntar',
    step1: 'Construye piso a piso', intro: 'En el cuento, el arquitecto Victor Mercer nunca ve la única mano levantada. Esta vez, tú eres quien diseña. Antes de cada piso nuevo, la joven ingeniera levanta la mano.',
    hand: 'La joven ingeniera levanta la mano:',
    questions: ['¿La base es lo bastante ancha?', '¿Revisamos el suelo?', '¿Qué pasa cuando sopla el viento?', '¿Quién usará este piso?', '¿Los pisos están alineados?', '¿La gente puede salir con seguridad?'],
    listen: 'Parar y escuchar', keep: 'Seguir construyendo',
    done: '¡Seis pisos! Tu torre está terminada.',
    status: (n: number, s: number, w: number) => `Pisos: ${n} de ${MAX_FLOORS}. Pisos firmes: ${s}. Pisos que tambalean: ${w}.`,
    wobbleMsg: 'Uy, la torre se inclina. Nadie se detuvo a escuchar. ¡Todavía puedes arreglarla preguntando!', steady: 'La torre se mantiene firme.',
    floor: (n: number) => `Piso ${n}`, strong: 'firme', wobbly: 'tambalea',
    fix: (n: number) => `Arreglar el piso ${n} preguntando`, asked: 'Preguntas que hicimos', none: 'Todavía no hay preguntas.',
    step2: 'Haz 3 preguntas antes de construir', cardIntro: 'Usa esta tarjeta con bloques de verdad en casa o en clase. Haz estas preguntas antes de empezar.',
    q: (n: number) => `Pregunta ${n}`, ph: ['¿La parte de abajo es lo bastante ancha?', '¿El suelo está plano?', '¿Y si alguien la golpea?'],
    result: (s: number, w: number) => `Mi torre en pantalla: ${s} firmes, ${w} que tambalean.`, cardLabel: 'Tarjeta imprimible para construir preguntando primero',
  },
  fr: {
    open: '« ', close: ' »',
    skill: 'Écoute et premiers pas en ingénierie', title: 'L’architecte qui pose d’abord des questions', subtitle: 'Construis une tour, et arrête-toi pour écouter quand la jeune ingénieure lève la main.', grownup: 'Lever la main et poser les questions',
    step1: 'Construis étage par étage', intro: 'Dans l’histoire, l’architecte Victor Mercer ne voit jamais la seule main levée. Cette fois, c’est toi l’architecte. Avant chaque nouvel étage, la jeune ingénieure lève la main.',
    hand: 'La jeune ingénieure lève la main :',
    questions: ['La base est-elle assez large ?', 'A-t-on vérifié le sol ?', 'Que se passe-t-il quand le vent souffle ?', 'Qui va utiliser cet étage ?', 'Les étages sont-ils bien alignés ?', 'Les gens peuvent-ils sortir en sécurité ?'],
    listen: 'S’arrêter et écouter', keep: 'Continuer à construire',
    done: 'Six étages ! Ta tour est terminée.',
    status: (n: number, s: number, w: number) => `Étages : ${n} sur ${MAX_FLOORS}. Étages solides : ${s}. Étages bancals : ${w}.`,
    wobbleMsg: 'Oh oh, la tour penche. Personne ne s’est arrêté pour écouter. Tu peux encore la réparer en posant des questions !', steady: 'La tour tient bien debout.',
    floor: (n: number) => `Étage ${n}`, strong: 'solide', wobbly: 'bancal',
    fix: (n: number) => `Réparer l’étage ${n} en posant la question`, asked: 'Les questions qu’on a posées', none: 'Pas encore de questions.',
    step2: 'Pose 3 questions avant de construire', cardIntro: 'Utilise cette carte avec de vrais cubes à la maison ou en classe. Pose ces questions avant de commencer.',
    q: (n: number) => `Question ${n}`, ph: ['Le bas est-il assez large ?', 'Le sol est-il bien plat ?', 'Et si quelqu’un la cogne ?'],
    result: (s: number, w: number) => `Ma tour à l’écran : ${s} solides, ${w} bancals.`, cardLabel: 'Carte « Je pose d’abord des questions » à imprimer',
  },
};

export default function AskFirstArchitectDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [mine, setMine] = useState(['', '', '']);
  const strong = floors.filter((f) => f === 'strong').length;
  const wobbly = floors.length - strong;
  const leaning = wobbly >= 2;
  const next = floors.length;
  const finished = next >= MAX_FLOORS;

  const add = (f: Floor) => { if (!finished) setFloors([...floors, f]); };
  const fix = (i: number) => setFloors(floors.map((f, j) => (j === i ? 'strong' : f)));

  return (
    <StudioFrame emoji="🏗️" hue="sky" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={12} bookIds={['tower-touched-sky']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
          {!finished ? (
            <div className="rounded-xl bg-white border border-sky-200 p-3 mb-4">
              <p className="text-sm font-semibold text-gray-700">✋ {t.hand}</p>
              <p className="text-lg font-bold text-gray-900 my-2">{t.open}{t.questions[next]}{t.close}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => add('strong')} className="btn-primary">{t.listen}</button>
                <button type="button" onClick={() => add('wobbly')} className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500">{t.keep}</button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-gray-800 mb-4">{t.done}</p>
          )}
          <div className="flex justify-center items-end h-72 rounded-xl bg-linear-to-b from-sky-50 to-white border border-sky-100 p-3" aria-hidden>
            <div className={`flex flex-col-reverse items-center w-full max-w-xs origin-bottom motion-safe:transition-transform motion-safe:duration-500 ${leaning ? 'rotate-3' : ''}`}>
              <div className="w-full h-2 bg-stone-400 rounded" />
              {floors.map((f, i) => (
                <div key={i} style={{ width: `${100 - i * 12}%` }}
                  className={`h-9 mt-0.5 rounded-sm flex items-center justify-center text-[11px] font-bold ${f === 'strong' ? 'bg-sky-500 text-white border-2 border-sky-700' : 'bg-amber-100 text-amber-900 border-2 border-dashed border-amber-500 -translate-x-1'}`}>
                  {f === 'strong' ? '■' : '~'} {t.floor(i + 1)}
                </div>
              ))}
            </div>
          </div>
          <div role="status" className="mt-3 text-sm text-gray-800">
            <p>{t.status(floors.length, strong, wobbly)}</p>
            {floors.length > 0 && <p className="font-semibold">{leaning ? t.wobbleMsg : t.steady}</p>}
          </div>
          {wobbly > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {floors.map((f, i) => f === 'wobbly' && (
                <button key={i} type="button" onClick={() => fix(i)} className="rounded-full border-2 border-amber-400 bg-white px-3 py-1.5 text-sm font-semibold text-amber-900 hover:bg-amber-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500">
                  ✋ {t.fix(i + 1)}
                </button>
              ))}
            </div>
          )}
          <h4 className="mt-4 text-sm font-bold text-gray-700">{t.asked}</h4>
          {strong === 0 ? <p className="text-sm text-gray-500">{t.none}</p> : (
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {floors.map((f, i) => f === 'strong' && <li key={i}>{t.floor(i + 1)}: {t.questions[i]}</li>)}
            </ul>
          )}
        </Panel>
        <Printable label={t.cardLabel}>
          <p className="text-sm font-bold text-gray-700 text-center">🏗️ {t.step2}</p>
          <p className="text-sm text-gray-600 text-center mt-1 mb-4">{t.cardIntro}</p>
          <div className="grid gap-3">
            {mine.map((v, i) => (
              <LineInput key={i} label={t.q(i + 1)} value={v} placeholder={t.ph[i]} onChange={(val) => setMine(mine.map((m, j) => (j === i ? val : m)))} />
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-sky-50 border border-sky-200 p-3 text-sm font-semibold text-gray-700">{t.result(strong, wobbly)}</p>
          <StudioActions onReset={() => { setFloors([]); setMine(['', '', '']); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
