// Small Noticer (Activity Studio). Pairs with The Sparrow Who Saved the Forest: when the
// forest is in trouble, the biggest animals don't notice, but the smallest sparrow does.
// Find the three small things that need help in a forest the big animals walked through,
// then notice small things at home or school and plan one tiny kind act for each. Prints a
// "Small Noticer" card. Nothing here retells the book's plot beyond its description.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice } from './studio/StudioFrame';

type Need = 'chick' | 'sprout' | 'ladybug';
/** The forest: big things everyone sees, and three small things that need help. */
const FOREST: { id: string; icon: string; need?: Need }[] = [
  { id: 'bear', icon: '🐻' }, { id: 'tree1', icon: '🌳' }, { id: 'chick', icon: '🐣', need: 'chick' }, { id: 'deer', icon: '🦌' },
  { id: 'rock', icon: '🪨' }, { id: 'pine', icon: '🌲' }, { id: 'mush', icon: '🍄' }, { id: 'sprout', icon: '🌱', need: 'sprout' },
  { id: 'boar', icon: '🐗' }, { id: 'fern', icon: '🌿' }, { id: 'ladybug', icon: '🐞', need: 'ladybug' }, { id: 'tree2', icon: '🌳' },
];
type Seen = 'alone' | 'plant' | 'sad' | 'reach' | 'litter' | 'pet';
type Act = 'hello' | 'help' | 'water' | 'share' | 'grownup' | 'pickup' | 'fill' | 'invite';
const SEEN: { id: Seen; icon: string }[] = [
  { id: 'alone', icon: '🧍' }, { id: 'plant', icon: '🪴' }, { id: 'sad', icon: '😟' },
  { id: 'reach', icon: '🙋' }, { id: 'litter', icon: '🗑️' }, { id: 'pet', icon: '🐕' },
];
const ACTS: { id: Act; icon: string }[] = [
  { id: 'hello', icon: '👋' }, { id: 'help', icon: '🤝' }, { id: 'water', icon: '💧' },
  { id: 'share', icon: '🍎' }, { id: 'grownup', icon: '🧑' }, { id: 'pickup', icon: '✋' },
  { id: 'fill', icon: '🥣' }, { id: 'invite', icon: '🤗' },
];
/** Only the kind acts that fit each thing noticed, so the card always makes sense. */
const ACTS_FOR: Record<Seen, Act[]> = {
  alone: ['hello', 'invite', 'share'],
  plant: ['water', 'grownup'],
  sad: ['hello', 'share', 'grownup'],
  reach: ['help', 'grownup'],
  litter: ['pickup', 'grownup'],
  pet: ['fill', 'grownup'],
};
const MAX = 3;

const TRANSLATIONS = {
  en: {
    skill: 'Noticing and kindness', title: 'Small Noticer', subtitle: 'Find what the big animals missed, then notice the small things around you.', grownup: 'Notice together on a walk',
    step1: 'What did the big animals miss?', intro: 'When the forest is in trouble, the biggest animals don’t notice. The smallest sparrow does. Look closely: three small things in this forest need help. Can you find them?',
    found: (n: number) => `${n} of 3 found.`, allFound: 'You found all three. You notice like the sparrow!', notThis: 'That one is fine. Look for something small.',
    needs: { chick: 'A chick fell out of its nest. Help it back, gently.', sprout: 'A little sprout is thirsty. Give it some water.', ladybug: 'A ladybug is stuck on its back. Help it turn over.' },
    tile: (icon: string) => `Look at ${icon}`,
    step2: 'Be a small noticer', intro2: 'Small kind acts can change everything. What small things could you notice at home or at school? Pick up to 3, then choose a tiny kind act for each.',
    seen: { alone: 'Someone playing alone', plant: 'A plant that needs water', sad: 'A friend who looks sad', reach: 'Someone who can’t reach', litter: 'Litter on the path', pet: 'A pet with an empty bowl' },
    acts: { hello: 'Say hello', help: 'Lend a hand', water: 'Water it', share: 'Share', grownup: 'Tell a grown-up', pickup: 'Pick it up', fill: 'Fill the bowl', invite: 'Invite them to play' },
    actFor: (s: string) => `My kind act for “${s}”`, count: (n: number) => `${n} of ${MAX} picked.`, full: `You already picked ${MAX}. Tap one to take it off first.`,
    cardLabel: 'Printable Small Noticer card', card: 'Small Noticer', noticed: 'I noticed…', so: 'so I will…', blank: '________________', motto: 'Nobody is too small to help.', name: 'Name:',
  },
  es: {
    skill: 'Observar y ser amable', title: 'Ojos de gorrión', subtitle: 'Encuentra lo que los animales grandes no vieron y fíjate en las cosas pequeñas a tu alrededor.', grownup: 'Observen juntos en un paseo',
    step1: '¿Qué no vieron los animales grandes?', intro: 'Cuando el bosque está en peligro, los animales más grandes no se dan cuenta. El gorrión más pequeño, sí. Mira con atención: en este bosque hay tres cosas pequeñas que necesitan ayuda. ¿Las encuentras?',
    found: (n: number) => `${n} de 3 encontradas.`, allFound: 'Encontraste las tres. ¡Observas como el gorrión!', notThis: 'Ese está bien. Busca algo pequeño.',
    needs: { chick: 'Un pollito se cayó del nido. Ayúdalo a volver, con cuidado.', sprout: 'Un brote pequeño tiene sed. Dale un poco de agua.', ladybug: 'Una mariquita quedó patas arriba. Ayúdala a darse la vuelta.' },
    tile: (icon: string) => `Mirar ${icon}`,
    step2: 'Mira con ojos de gorrión', intro2: 'Los pequeños actos de bondad pueden cambiarlo todo. ¿Qué cosas pequeñas podrías notar en casa o en la escuela? Elige hasta 3 y luego un pequeño acto amable para cada una.',
    seen: { alone: 'Alguien que juega solo', plant: 'Una planta que necesita agua', sad: 'Alguien que parece triste', reach: 'Alguien que no alcanza', litter: 'Basura en el camino', pet: 'Una mascota con el plato vacío' },
    acts: { hello: 'Saludar', help: 'Echar una mano', water: 'Regarla', share: 'Compartir', grownup: 'Avisar a un adulto', pickup: 'Recogerla', fill: 'Llenar el plato', invite: 'Invitarle a jugar' },
    actFor: (s: string) => `Mi acto amable para «${s}»`, count: (n: number) => `${n} de ${MAX} elegidas.`, full: `Ya elegiste ${MAX}. Toca una para quitarla primero.`,
    cardLabel: 'Tarjeta Ojos de gorrión para imprimir', card: 'Ojos de gorrión', noticed: 'Me di cuenta de…', so: 'así que voy a…', blank: '________________', motto: 'Nadie es demasiado pequeño para ayudar.', name: 'Nombre:',
  },
  fr: {
    skill: 'Observation et gentillesse', title: 'Yeux de moineau', subtitle: 'Trouve ce que les grands animaux n’ont pas vu, puis remarque les petites choses autour de toi.', grownup: 'Observer ensemble pendant une promenade',
    step1: 'Qu’ont manqué les grands animaux ?', intro: 'Quand la forêt est en danger, les plus grands animaux ne remarquent rien. Le plus petit moineau, lui, remarque. Regarde bien : dans cette forêt, trois petites choses ont besoin d’aide. Les trouves-tu ?',
    found: (n: number) => `${n} sur 3 trouvée${n > 1 ? 's' : ''}.`, allFound: 'Tu les as toutes trouvées. Tu observes comme le moineau !', notThis: 'Celui-là va bien. Cherche quelque chose de petit.',
    needs: { chick: 'Un poussin est tombé du nid. Aide-le à y retourner, doucement.', sprout: 'Une petite pousse a soif. Donne-lui un peu d’eau.', ladybug: 'Une coccinelle est coincée sur le dos. Aide-la à se retourner.' },
    tile: (icon: string) => `Regarder ${icon}`,
    step2: 'Regarde avec des yeux de moineau', intro2: 'Les petits gestes de gentillesse peuvent tout changer. Quelles petites choses pourrais-tu remarquer à la maison ou à l’école ? Choisis-en 3 au plus, puis un petit geste gentil pour chacune.',
    seen: { alone: 'Quelqu’un qui joue seul', plant: 'Une plante qui a soif', sad: 'Quelqu’un qui a l’air triste', reach: 'Quelqu’un qui n’arrive pas à attraper', litter: 'Un déchet sur le chemin', pet: 'Un animal avec une gamelle vide' },
    acts: { hello: 'Dire bonjour', help: 'Donner un coup de main', water: 'L’arroser', share: 'Partager', grownup: 'Prévenir un adulte', pickup: 'Le ramasser', fill: 'Remplir la gamelle', invite: 'L’inviter à jouer' },
    actFor: (s: string) => `Mon geste gentil pour « ${s} »`, count: (n: number) => `${n} sur ${MAX} choisie${n > 1 ? 's' : ''}.`, full: `Tu en as déjà choisi ${MAX}. Touches-en une pour l’enlever d’abord.`,
    cardLabel: 'Carte Yeux de moineau à imprimer', card: 'Yeux de moineau', noticed: 'J’ai remarqué…', so: 'alors je vais…', blank: '________________', motto: 'Personne n’est trop petit pour aider.', name: 'Prénom :',
  },
};

export default function SmallNoticerDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [found, setFound] = useState<Need[]>([]);
  const [last, setLast] = useState<string>('');
  const [seen, setSeen] = useState<Seen[]>([]);
  const [acts, setActs] = useState<Partial<Record<Seen, Act>>>({});
  const [full, setFull] = useState(false);

  const tap = (cell: (typeof FOREST)[number]) => {
    if (!cell.need) { setLast(t.notThis); return; }
    if (!found.includes(cell.need)) setFound([...found, cell.need]);
    setLast(t.needs[cell.need]);
  };
  const toggleSeen = (s: Seen) => {
    if (seen.includes(s)) { setSeen(seen.filter((x) => x !== s)); setFull(false); return; }
    if (seen.length >= MAX) { setFull(true); return; }
    setSeen([...seen, s]);
    setFull(false);
  };
  const reset = () => { setFound([]); setLast(''); setSeen([]); setActs({}); setFull(false); };

  return (
    <StudioFrame emoji="🐦" hue="sage" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={10} bookIds={['sparrow-saved-forest']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <ul className="grid grid-cols-4 gap-2 rounded-2xl bg-emerald-50 p-3">
              {FOREST.map((cell) => {
                const done = cell.need && found.includes(cell.need);
                return (
                  <li key={cell.id}>
                    <button
                      type="button"
                      onClick={() => tap(cell)}
                      aria-label={t.tile(cell.icon)}
                      data-noticer={cell.need ? 'needs-help' : 'fine'}
                      className={`w-full aspect-square rounded-xl grid place-items-center transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 ${done ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-white hover:bg-emerald-100'} ${cell.need ? 'text-xl' : 'text-4xl'}`}
                    >
                      <span aria-hidden>{cell.icon}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p role="status" className="mt-3 min-h-10 text-sm font-semibold text-gray-800">
              {found.length === 3 ? t.allFound : last || t.found(found.length)}
            </p>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SEEN.map((s) => (
                <Choice key={s.id} selected={seen.includes(s.id)} onSelect={() => toggleSeen(s.id)} className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{s.icon}</span><span className="text-sm font-semibold">{t.seen[s.id]}</span>
                </Choice>
              ))}
            </div>
            <p role="status" className="mt-2 text-xs text-gray-600">{full ? t.full : t.count(seen.length)}</p>
            {seen.map((s) => (
              <fieldset key={s} className="mt-4">
                <legend className="text-sm font-semibold text-gray-700 mb-2">{t.actFor(t.seen[s])}</legend>
                <div className="grid grid-cols-3 gap-2">
                  {ACTS.filter((a) => ACTS_FOR[s].includes(a.id)).map((a) => (
                    <Choice key={a.id} selected={acts[s] === a.id} onSelect={() => setActs({ ...acts, [s]: a.id })} className="flex flex-col items-center gap-1 text-center">
                      <span className="text-xl" aria-hidden>{a.icon}</span><span className="text-xs font-semibold">{t.acts[a.id]}</span>
                    </Choice>
                  ))}
                </div>
              </fieldset>
            ))}
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <div className="rounded-xl border-4 border-emerald-300 bg-emerald-50 p-5 print:bg-white">
            <p className="text-center text-4xl" aria-hidden>🐦</p>
            <h3 className="text-center text-2xl font-bold text-emerald-900">{t.card}</h3>
            <p className="mt-2 text-sm text-gray-700">{t.name} <span className="inline-block w-40 border-b border-gray-500" /></p>
            <ol className="mt-4 grid gap-4">
              {Array.from({ length: MAX }, (_, i) => {
                const s = seen[i];
                const a = s ? acts[s] : undefined;
                return (
                  <li key={i} className="text-sm text-gray-800">
                    <p><span className="font-bold">{t.noticed}</span> {s ? `${SEEN.find((x) => x.id === s)?.icon} ${t.seen[s]}` : t.blank}</p>
                    <p className="mt-1"><span className="font-bold">{t.so}</span> {a ? `${ACTS.find((x) => x.id === a)?.icon} ${t.acts[a]}` : t.blank}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-center font-bold text-emerald-900">{t.motto}</p>
          </div>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
