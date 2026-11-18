// Everyone Gets Heard (Activity Studio). Pairs with The Tower That Touched the Sky: only one
// junior engineer raises her hand, and Victor never sees it. First, spot the raised hand that
// everyone in the room is missing. Then make a family or classroom promise about how the
// quietest hand gets seen, and answer the book's own question: what would you have asked
// Victor? Prints a promise card with a talking token. Nothing here goes beyond the catalog.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type SceneId = 'meeting' | 'class' | 'table';
/** Eight figures per scene; exactly one is the raised hand nobody notices. */
const SCENES: { id: SceneId; cells: string[]; hand: number }[] = [
  { id: 'meeting', cells: ['🗣️', '😤', '📣', '🧑‍💼', '🙋', '🗣️', '😠', '📣'], hand: 4 },
  { id: 'class', cells: ['📣', '🙌', '🗣️', '😆', '🙋', '😤', '🗣️', '📣'], hand: 4 },
  { id: 'table', cells: ['😋', '🗣️', '📣', '😤', '🗣️', '🙋', '😆', '🗣️'], hand: 5 },
];
type Way = 'turns' | 'ask' | 'wait' | 'repeat' | 'interrupt' | 'thank';
const WAYS: { id: Way; icon: string }[] = [
  { id: 'turns', icon: '🔄' }, { id: 'ask', icon: '🤫' }, { id: 'wait', icon: '✋' },
  { id: 'repeat', icon: '🔁' }, { id: 'interrupt', icon: '🤐' }, { id: 'thank', icon: '🙏' },
];
const MAX = 3;

const TRANSLATIONS = {
  en: {
    skill: 'Listening and humility', title: 'Everyone Gets Heard', subtitle: 'Spot the hand nobody sees, then promise how your family or class will see it.', grownup: 'Try the promise at your next meal',
    step1: 'Who is raising a hand?', intro: 'Victor is building the tallest tower ever. Only one junior engineer raises her hand, and he never sees it. In each room, someone has a hand up. Can you find them before it’s too late?',
    scenes: { meeting: 'The meeting room', class: 'The classroom', table: 'The dinner table' },
    tile: (icon: string) => `Look at ${icon}`, notHand: 'That one is talking. Who is waiting to be heard?', found: 'You saw it! Victor never did.', allFound: 'You found all three hands. You see what Victor missed.',
    step2: 'Our getting-heard promise', intro2: 'How will your family or class make sure the quietest hand is seen? Pick up to 3.',
    ways: { turns: 'Everyone gets a turn to talk', ask: 'Ask the quiet one what they think', wait: 'A hand up means we stop and look', repeat: 'Repeat back what we heard', interrupt: 'No interrupting', thank: 'Say thank you for the question' },
    count: (n: number) => `${n} of ${MAX} picked.`, full: `You already picked ${MAX}. Tap one to take it off first.`,
    step3: 'Your question for Victor', intro3: 'Victor learns to design with questions instead of certainty. What question would you have asked him?', qLabel: 'I would ask Victor', qPh: 'Is the ground strong enough?',
    cardLabel: 'Printable getting-heard promise', card: 'Our Getting-Heard Promise', we: 'We promise:', names: 'Signed by:', token: 'Talking token: whoever holds it speaks, everyone else listens.', myQ: 'My question for Victor:', blank: '________________', motto: 'Build with questions.',
  },
  es: {
    skill: 'Escuchar y humildad', title: 'Que todos sean escuchados', subtitle: 'Encuentra la mano que nadie ve y promete cómo tu familia o tu clase la verá.', grownup: 'Prueben la promesa en la próxima comida',
    step1: '¿Quién levanta la mano?', intro: 'Victor construye la torre más alta jamás imaginada. Solo una joven ingeniera levanta la mano, y él nunca la ve. En cada sala, alguien tiene la mano levantada. ¿Puedes encontrarla antes de que sea tarde?',
    scenes: { meeting: 'La sala de reuniones', class: 'La clase', table: 'La mesa de la cena' },
    tile: (icon: string) => `Mirar ${icon}`, notHand: 'Ese está hablando. ¿Quién espera a que lo escuchen?', found: '¡La viste! Victor nunca la vio.', allFound: 'Encontraste las tres manos. Ves lo que Victor no vio.',
    step2: 'Nuestra promesa de escuchar', intro2: '¿Cómo se asegurará tu familia o tu clase de ver la mano más callada? Elige hasta 3.',
    ways: { turns: 'Todos tienen su turno para hablar', ask: 'Preguntar a quien está callado qué piensa', wait: 'Una mano levantada: paramos y miramos', repeat: 'Repetir lo que escuchamos', interrupt: 'No interrumpir', thank: 'Dar las gracias por la pregunta' },
    count: (n: number) => `${n} de ${MAX} elegidas.`, full: `Ya elegiste ${MAX}. Toca una para quitarla primero.`,
    step3: 'Tu pregunta para Victor', intro3: 'Victor aprende a diseñar con preguntas en vez de certezas. ¿Qué pregunta le habrías hecho?', qLabel: 'Yo le preguntaría a Victor', qPh: '¿El suelo es lo bastante firme?',
    cardLabel: 'Promesa de escuchar para imprimir', card: 'Nuestra promesa de escuchar', we: 'Prometemos:', names: 'Firmado por:', token: 'Ficha para hablar: quien la tiene habla, los demás escuchan.', myQ: 'Mi pregunta para Victor:', blank: '________________', motto: 'Construye con preguntas.',
  },
  fr: {
    skill: 'Écoute et humilité', title: 'Tout le monde est écouté', subtitle: 'Trouve la main que personne ne voit, puis promets comment ta famille ou ta classe la verra.', grownup: 'Essayez la promesse au prochain repas',
    step1: 'Qui lève la main ?', intro: 'Victor construit la plus haute tour jamais imaginée. Une seule jeune ingénieure lève la main, et il ne la voit jamais. Dans chaque pièce, quelqu’un a la main levée. Peux-tu le trouver avant qu’il ne soit trop tard ?',
    scenes: { meeting: 'La salle de réunion', class: 'La classe', table: 'La table du dîner' },
    tile: (icon: string) => `Regarder ${icon}`, notHand: 'Celui-là parle. Qui attend d’être écouté ?', found: 'Tu l’as vue ! Victor ne l’a jamais vue.', allFound: 'Tu as trouvé les trois mains. Tu vois ce que Victor a manqué.',
    step2: 'Notre promesse d’écoute', intro2: 'Comment ta famille ou ta classe fera-t-elle pour voir la main la plus discrète ? Choisis-en 3 au plus.',
    ways: { turns: 'Chacun a son tour pour parler', ask: 'Demander son avis à celui qui se tait', wait: 'Une main levée : on s’arrête et on regarde', repeat: 'Redire ce qu’on a entendu', interrupt: 'On ne coupe pas la parole', thank: 'Dire merci pour la question' },
    count: (n: number) => `${n} sur ${MAX} choisie${n > 1 ? 's' : ''}.`, full: `Tu en as déjà choisi ${MAX}. Touches-en une pour l’enlever d’abord.`,
    step3: 'Ta question pour Victor', intro3: 'Victor apprend à concevoir avec des questions plutôt qu’avec des certitudes. Quelle question lui aurais-tu posée ?', qLabel: 'Je demanderais à Victor', qPh: 'Le sol est-il assez solide ?',
    cardLabel: 'Promesse d’écoute à imprimer', card: 'Notre promesse d’écoute', we: 'Nous promettons :', names: 'Signé par :', token: 'Jeton de parole : celui qui le tient parle, les autres écoutent.', myQ: 'Ma question pour Victor :', blank: '________________', motto: 'Construis avec des questions.',
  },
};

export default function EveryoneGetsHeardDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [found, setFound] = useState<SceneId[]>([]);
  const [msg, setMsg] = useState('');
  const [ways, setWays] = useState<Way[]>([]);
  const [full, setFull] = useState(false);
  const [question, setQuestion] = useState('');

  const tap = (scene: (typeof SCENES)[number], i: number) => {
    if (i !== scene.hand) { setMsg(t.notHand); return; }
    if (!found.includes(scene.id)) setFound([...found, scene.id]);
    setMsg(t.found);
  };
  const toggle = (w: Way) => {
    if (ways.includes(w)) { setWays(ways.filter((x) => x !== w)); setFull(false); return; }
    if (ways.length >= MAX) { setFull(true); return; }
    setWays([...ways, w]); setFull(false);
  };
  const reset = () => { setFound([]); setMsg(''); setWays([]); setFull(false); setQuestion(''); };

  return (
    <StudioFrame emoji="🙋" hue="blue" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['tower-touched-sky']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <div className="grid gap-3">
              {SCENES.map((scene) => {
                const done = found.includes(scene.id);
                return (
                  <div key={scene.id} className={`rounded-2xl border-2 p-3 ${done ? 'border-emerald-400 bg-emerald-50' : 'border-blue-200 bg-blue-50'}`} data-heard-scene={done ? 'found' : 'open'}>
                    <p className="text-sm font-bold text-gray-800 mb-2">{t.scenes[scene.id]} {done && '✅'}</p>
                    <ul className="grid grid-cols-8 gap-1">
                      {scene.cells.map((c, i) => (
                        <li key={i}>
                          <button type="button" onClick={() => tap(scene, i)} aria-label={t.tile(c)} data-heard={i === scene.hand ? 'hand' : 'talking'}
                            className={`w-full aspect-square rounded-lg grid place-items-center bg-white hover:bg-blue-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 ${i === scene.hand ? 'text-base' : 'text-2xl'} ${done && i === scene.hand ? 'ring-2 ring-amber-400 bg-amber-100' : ''}`}>
                            <span aria-hidden>{c}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p role="status" className="mt-3 min-h-10 text-sm font-semibold text-gray-800">{found.length === SCENES.length ? t.allFound : msg}</p>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {WAYS.map((w) => (
                <Choice key={w.id} selected={ways.includes(w.id)} onSelect={() => toggle(w.id)} className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{w.icon}</span><span className="text-sm font-semibold">{t.ways[w.id]}</span>
                </Choice>
              ))}
            </div>
            <p role="status" className="mt-2 text-xs text-gray-600">{full ? t.full : t.count(ways.length)}</p>
          </Panel>
          <Panel>
            <StepLabel n="03">{t.step3}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro3}</p>
            <LineInput label={t.qLabel} value={question} onChange={setQuestion} placeholder={t.qPh} />
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <div className="rounded-xl border-4 border-blue-300 bg-blue-50 p-5 print:bg-white">
            <p className="text-center text-4xl" aria-hidden>🙋</p>
            <h3 className="text-center text-2xl font-bold text-blue-900">{t.card}</h3>
            <p className="mt-4 text-sm font-bold text-gray-800">{t.we}</p>
            <ol className="mt-1 grid gap-2 text-sm text-gray-800">
              {Array.from({ length: MAX }, (_, i) => {
                const w = ways[i];
                return <li key={i} className="flex gap-2"><span className="font-bold">{i + 1}.</span><span>{w ? `${WAYS.find((x) => x.id === w)?.icon} ${t.ways[w]}` : t.blank}</span></li>;
              })}
            </ol>
            <p className="mt-4 text-sm text-gray-800"><span className="font-bold">{t.myQ}</span> {question.trim() || t.blank}</p>
            <p className="mt-4 text-sm text-gray-800">{t.names} <span className="inline-block w-56 border-b border-gray-500" /></p>
            <div className="mt-5 flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-400 p-3">
              <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-blue-400 bg-white text-3xl">🗣️</span>
              <p className="text-xs text-gray-700">{t.token}</p>
            </div>
            <p className="mt-5 text-center font-bold text-blue-900">{t.motto}</p>
          </div>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
