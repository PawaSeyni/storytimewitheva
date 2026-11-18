// Kindness Chain (Activity Studio). Pairs with The Butterfly Effect: one small kind thing
// turns into another, and another, until a whole community is changed. Start with one kind
// act, then follow it from person to person as each one passes kindness on, and print paper
// chain strips to keep the chain growing at home or in class.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice } from './studio/StudioFrame';

type Act = 'share' | 'carry' | 'card' | 'thanks' | 'include' | 'laugh';
type Who = 'friend' | 'family' | 'grand' | 'neighbor' | 'teacher' | 'new';
const ACTS: { id: Act; icon: string }[] = [
  { id: 'share', icon: '🍪' }, { id: 'carry', icon: '🎒' }, { id: 'card', icon: '💌' },
  { id: 'thanks', icon: '🙏' }, { id: 'include', icon: '🤗' }, { id: 'laugh', icon: '😄' },
];
const WHO: { id: Who; icon: string }[] = [
  { id: 'friend', icon: '🧒' }, { id: 'family', icon: '🏡' }, { id: 'grand', icon: '👵' },
  { id: 'neighbor', icon: '🚪' }, { id: 'teacher', icon: '🍎' }, { id: 'new', icon: '👋' },
];
const MAX_LINKS = 6;
const RING = ['border-rose-400 bg-rose-50', 'border-amber-400 bg-amber-50', 'border-emerald-400 bg-emerald-50', 'border-sky-400 bg-sky-50', 'border-violet-400 bg-violet-50', 'border-pink-400 bg-pink-50'];
type Link = { who: Who | 'me'; act: Act };

const TRANSLATIONS = {
  en: {
    skill: 'Kindness and cause and effect', title: 'Kindness Chain', subtitle: 'One small kind thing turns into another. Follow yours as it travels.', grownup: 'Keep the paper chain growing',
    step1: 'Start with one small kind thing', intro: 'In The Butterfly Effect, one small kind thing turns into another, and another, until a whole community is changed. What kind thing will you do first?',
    acts: { share: 'Share a snack', carry: 'Help carry something', card: 'Make a card', thanks: 'Say thank you', include: 'Invite someone to play', laugh: 'Make someone laugh' },
    step2: 'Watch it travel', intro2: 'Kindness travels in ways we don’t always see. Who did your kindness reach? What kind thing did they pass on?',
    whoQ: 'Who did it reach next?', passQ: 'What did they pass on?', add: 'Add this link', full: 'Your chain is full. Print it and keep it growing on paper!',
    who: { me: 'Me', friend: 'A friend', family: 'My family', grand: 'A grandparent', neighbor: 'A neighbor', teacher: 'A teacher', new: 'Someone new' },
    reached: (n: number) => (n === 0 ? 'Your chain starts with you.' : `Your one kind thing reached ${n} ${n === 1 ? 'person' : 'people'}!`),
    linkLabel: (n: number, who: string, act: string) => `Link ${n}: ${who}, ${act}`, undo: 'Remove the last link',
    cardLabel: 'Printable kindness chain strips', card: 'My kindness chain', how: 'Cut out the strips. Write a kind thing on each empty one. Loop the first strip and glue it, then thread the next one through. Add a link every time kindness travels.',
    kindThing: 'A kind thing:', by: 'Done by:', cut: 'cut',
  },
  es: {
    skill: 'Bondad y causa y efecto', title: 'La cadena de la bondad', subtitle: 'Una pequeña cosa amable se convierte en otra. Sigue la tuya en su viaje.', grownup: 'Hacer crecer la cadena de papel',
    step1: 'Empieza con una pequeña cosa amable', intro: 'En El efecto mariposa, una pequeña cosa amable se convierte en otra, y en otra, hasta que toda una comunidad cambia. ¿Qué cosa amable harás primero?',
    acts: { share: 'Compartir la merienda', carry: 'Ayudar a cargar algo', card: 'Hacer una tarjeta', thanks: 'Dar las gracias', include: 'Invitar a alguien a jugar', laugh: 'Hacer reír a alguien' },
    step2: 'Mira cómo viaja', intro2: 'La bondad viaja de maneras que no siempre vemos. ¿A quién llegó tu bondad? ¿Qué cosa amable pasó esa persona a otra?',
    whoQ: '¿A quién llegó después?', passQ: '¿Qué pasó a otra persona?', add: 'Añadir este eslabón', full: 'Tu cadena está llena. ¡Imprímela y sigue haciéndola crecer en papel!',
    who: { me: 'Yo', friend: 'Un amigo o una amiga', family: 'Mi familia', grand: 'Abuela o abuelo', neighbor: 'Un vecino o una vecina', teacher: 'Mi maestra o maestro', new: 'Alguien que acaba de llegar' },
    reached: (n: number) => (n === 0 ? 'Tu cadena empieza contigo.' : `¡Tu pequeña cosa amable llegó a ${n} ${n === 1 ? 'persona' : 'personas'}!`),
    linkLabel: (n: number, who: string, act: string) => `Eslabón ${n}: ${who}, ${act}`, undo: 'Quitar el último eslabón',
    cardLabel: 'Tiras de la cadena de la bondad para imprimir', card: 'Mi cadena de la bondad', how: 'Recorta las tiras. Escribe una cosa amable en cada tira vacía. Une los extremos de la primera tira con pegamento y pasa la siguiente por dentro. Añade un eslabón cada vez que la bondad viaje.',
    kindThing: 'Una cosa amable:', by: 'La hizo:', cut: 'recortar',
  },
  fr: {
    skill: 'Gentillesse, causes et effets', title: 'La chaîne de gentillesse', subtitle: 'Un petit geste gentil en entraîne un autre. Suis le tien dans son voyage.', grownup: 'Faire grandir la chaîne en papier',
    step1: 'Commence par un petit geste gentil', intro: 'Dans L’effet papillon, un petit geste gentil en entraîne un autre, puis un autre, jusqu’à changer toute une communauté. Quel geste gentil feras-tu en premier ?',
    acts: { share: 'Partager mon goûter', carry: 'Aider à porter quelque chose', card: 'Faire une carte', thanks: 'Dire merci', include: 'Inviter quelqu’un à jouer', laugh: 'Faire rire quelqu’un' },
    step2: 'Regarde-le voyager', intro2: 'La gentillesse voyage d’une façon qu’on ne voit pas toujours. Qui ton geste a-t-il touché ? Quel geste gentil cette personne a-t-elle transmis ?',
    whoQ: 'Qui a-t-il touché ensuite ?', passQ: 'Qu’a transmis cette personne ?', add: 'Ajouter ce maillon', full: 'Ta chaîne est complète. Imprime-la et continue-la sur papier !',
    who: { me: 'Moi', friend: 'Un ami ou une amie', family: 'Ma famille', grand: 'Mamie ou papi', neighbor: 'Un voisin ou une voisine', teacher: 'Quelqu’un de l’école', new: 'Quelqu’un de nouveau' },
    reached: (n: number) => (n === 0 ? 'Ta chaîne commence avec toi.' : `Ton petit geste gentil a touché ${n} personne${n > 1 ? 's' : ''} !`),
    linkLabel: (n: number, who: string, act: string) => `Maillon ${n} : ${who}, ${act}`, undo: 'Enlever le dernier maillon',
    cardLabel: 'Bandes de la chaîne de gentillesse à imprimer', card: 'Ma chaîne de gentillesse', how: 'Découpe les bandes. Écris un geste gentil sur chaque bande vide. Ferme la première bande en boucle avec de la colle, puis passe la suivante à l’intérieur. Ajoute un maillon chaque fois que la gentillesse voyage.',
    kindThing: 'Un geste gentil :', by: 'Fait par :', cut: 'découper',
  },
};

export default function KindnessChainDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [chain, setChain] = useState<Link[]>([]);
  const [who, setWho] = useState<Who | null>(null);
  const [pass, setPass] = useState<Act | null>(null);

  const start = (a: Act) => setChain(chain.length ? [{ who: 'me', act: a }, ...chain.slice(1)] : [{ who: 'me', act: a }]);
  const add = () => {
    if (!who || !pass || chain.length >= MAX_LINKS) return;
    setChain([...chain, { who, act: pass }]);
    setWho(null); setPass(null);
  };
  const reset = () => { setChain([]); setWho(null); setPass(null); };
  const icon = (l: Link) => (l.who === 'me' ? '⭐' : WHO.find((w) => w.id === l.who)?.icon ?? '');
  const reached = Math.max(0, chain.length - 1);

  return (
    <StudioFrame emoji="🦋" hue="rose" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['butterfly-effect']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTS.map((a) => (
                <Choice key={a.id} selected={chain[0]?.act === a.id} onSelect={() => start(a.id)} className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{a.icon}</span><span className="text-sm font-semibold">{t.acts[a.id]}</span>
                </Choice>
              ))}
            </div>
          </Panel>
          {chain.length > 0 && (
            <Panel>
              <StepLabel n="02">{t.step2}</StepLabel>
              <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
              {chain.length >= MAX_LINKS ? (
                <p className="font-semibold text-gray-800">{t.full}</p>
              ) : (
                <>
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-700 mb-2">{t.whoQ}</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {WHO.map((w) => (
                        <Choice key={w.id} selected={who === w.id} onSelect={() => setWho(w.id)} className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden>{w.icon}</span><span className="text-sm font-semibold">{t.who[w.id]}</span>
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="mt-4">
                    <legend className="text-sm font-semibold text-gray-700 mb-2">{t.passQ}</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ACTS.map((a) => (
                        <Choice key={a.id} selected={pass === a.id} onSelect={() => setPass(a.id)} className="flex items-center gap-2">
                          <span className="text-xl" aria-hidden>{a.icon}</span><span className="text-sm font-semibold">{t.acts[a.id]}</span>
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <button type="button" onClick={add} disabled={!who || !pass} className="btn-primary mt-4 disabled:opacity-50">{t.add}</button>
                </>
              )}
            </Panel>
          )}
        </div>
        <div className="grid gap-4 content-start">
          <Panel>
            <ol className="flex flex-wrap items-center gap-1" aria-label={t.card}>
              {chain.map((l, i) => (
                <li key={i} className={`rounded-full border-4 px-3 py-1 text-sm font-semibold text-gray-800 ${RING[i % RING.length]}`} aria-label={t.linkLabel(i + 1, t.who[l.who], t.acts[l.act])}>
                  <span aria-hidden>{icon(l)} {ACTS.find((a) => a.id === l.act)?.icon}</span>
                </li>
              ))}
              {chain.length > 0 && chain.length < MAX_LINKS && <li aria-hidden className="rounded-full border-4 border-dashed border-gray-300 px-3 py-1 text-sm text-gray-400">?</li>}
            </ol>
            <p role="status" className="mt-3 font-bold text-rose-800">🦋 {t.reached(reached)}</p>
            {chain.length > 1 && <button type="button" onClick={() => setChain(chain.slice(0, -1))} className="mt-2 text-sm text-purple-700 underline">{t.undo}</button>}
          </Panel>
          <Printable label={t.cardLabel}>
            <h3 className="text-xl font-bold text-gray-800">{t.card}</h3>
            <p className="text-sm text-gray-600 mt-1">{t.how}</p>
            <ul className="mt-4 grid gap-2">
              {Array.from({ length: MAX_LINKS }, (_, i) => {
                const l = chain[i];
                return (
                  <li key={i} className={`rounded-md border-2 border-dashed px-3 py-2 text-sm text-gray-800 ${RING[i % RING.length]} print:bg-white`}>
                    <span className="sr-only">{t.cut}</span>
                    <span className="font-bold">{t.kindThing}</span> {l ? `${ACTS.find((a) => a.id === l.act)?.icon} ${t.acts[l.act]}` : <span className="inline-block w-40 border-b border-gray-400" />}
                    <span className="ml-3 font-bold">{t.by}</span> {l ? `${icon(l)} ${t.who[l.who]}` : <span className="inline-block w-24 border-b border-gray-400" />}
                  </li>
                );
              })}
            </ul>
          </Printable>
          <StudioActions onReset={reset} />
        </div>
      </div>
    </StudioFrame>
  );
}
