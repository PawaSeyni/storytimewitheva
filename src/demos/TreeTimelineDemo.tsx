// What the Tree Has Seen (Activity Studio). Pairs with The Fig Tree's Secret: old
// Mr. Costas tells Sofia what the fig tree has watched for three hundred years. The child
// picks a "witness" from their own life and builds a three-generation timeline of what it
// has seen, with a grown-up telling the long-ago stories.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Witness = 'tree' | 'house' | 'table' | 'street' | 'object' | 'garden' | 'other';
const WITNESSES: { id: Witness; icon: string }[] = [
  { id: 'tree', icon: '🌳' }, { id: 'house', icon: '🏠' }, { id: 'table', icon: '🍽️' },
  { id: 'street', icon: '🛣️' }, { id: 'object', icon: '🕰️' }, { id: 'garden', icon: '🌻' }, { id: 'other', icon: '✏️' },
];
type Pic = 'celebration' | 'food' | 'harvest' | 'music' | 'work' | 'travel' | 'baby' | 'friends';
const PICS: { id: Pic; icon: string }[] = [
  { id: 'celebration', icon: '🎉' }, { id: 'food', icon: '🍲' }, { id: 'harvest', icon: '🧺' }, { id: 'music', icon: '🎶' },
  { id: 'work', icon: '🛠️' }, { id: 'travel', icon: '🧳' }, { id: 'baby', icon: '👶' }, { id: 'friends', icon: '🤝' },
];
type Band = { memory: string; pic: Pic | null };
const EMPTY_BANDS: Band[] = [0, 1, 2].map(() => ({ memory: '', pic: null }));

const TRANSLATIONS = {
  en: {
    skill: 'Family history and time', title: 'What the Tree Has Seen', subtitle: 'Choose a witness from your life and make a timeline of what it has seen.', grownup: 'Tell the long-ago stories',
    step1: 'Choose your witness', intro1: 'The old fig tree watched three hundred years of harvests, festivals and recipes. What has watched your family? Pick something that has been around a long time.',
    witnesses: { tree: 'A tree near home', house: 'A house', table: 'A kitchen table', street: 'A street', object: 'A grandparent’s treasure', garden: 'A garden', other: 'Something else' },
    mine: { tree: 'my tree', house: 'my house', table: 'my kitchen table', street: 'my street', object: 'my grandparent’s treasure', garden: 'my garden' },
    otherLabel: 'What is your witness?', otherPh: 'the old bench, Grandma’s teapot…', fallback: 'my witness',
    step2: 'Fill the timeline', intro2: 'Mr. Costas told Sofia the tree’s stories. Ask a grandparent or another grown-up in your family about the first two times. You can tell the last one yourself!',
    bands: ['Long ago (my grandparents’ time)', 'Not so long ago (my parents’ time)', 'Now (my time)'],
    ask: ['Ask a grandparent or older family member.', 'Ask a parent or another grown-up.', 'This one is yours to tell.'],
    memory: 'A memory', memoryPh: 'It saw…', picture: 'A picture for this memory',
    pics: { celebration: 'Celebration', food: 'Food', harvest: 'Harvest', music: 'Music', work: 'Work', travel: 'Travel', baby: 'A new baby', friends: 'Friends' },
    heading: (w: string) => `What ${w} has seen`, step: 'Time', blank: 'Write or draw a memory here.', noPic: 'No picture yet',
    draw: 'Draw your witness', closing: '“Some of what we inherit is made of stories.”', cardLabel: 'Printable timeline page',
  },
  es: {
    skill: 'Historia familiar y tiempo', title: 'Lo que ha visto el árbol', subtitle: 'Elige un testigo de tu vida y haz una línea del tiempo de lo que ha visto.', grownup: 'Contar las historias de antes',
    step1: 'Elige tu testigo', intro1: 'La vieja higuera vio trescientos años de cosechas, fiestas y recetas. ¿Qué ha visto crecer a tu familia? Elige algo que lleve mucho tiempo ahí.',
    witnesses: { tree: 'Un árbol cerca de casa', house: 'Una casa', table: 'Una mesa de cocina', street: 'Una calle', object: 'Un tesoro de los abuelos', garden: 'Un jardín', other: 'Otra cosa' },
    mine: { tree: 'mi árbol', house: 'mi casa', table: 'mi mesa de cocina', street: 'mi calle', object: 'el tesoro de mis abuelos', garden: 'mi jardín' },
    otherLabel: '¿Cuál es tu testigo?', otherPh: 'el banco viejo, la tetera de la abuela…', fallback: 'mi testigo',
    step2: 'Completa la línea del tiempo', intro2: 'El señor Costas le contó a Sofía las historias del árbol. Pregunta a un abuelo o a otro adulto de tu familia por los dos primeros tiempos. ¡El último lo puedes contar tú!',
    bands: ['Hace mucho (la época de mis abuelos)', 'No hace tanto (la época de mis padres)', 'Ahora (mi época)'],
    ask: ['Pregunta a un abuelo o a un familiar mayor.', 'Pregunta a tu mamá, a tu papá o a otro adulto.', 'Este lo cuentas tú.'],
    memory: 'Un recuerdo', memoryPh: 'Vio…', picture: 'Un dibujo para este recuerdo',
    pics: { celebration: 'Fiesta', food: 'Comida', harvest: 'Cosecha', music: 'Música', work: 'Trabajo', travel: 'Viaje', baby: 'Un bebé', friends: 'Amigos' },
    heading: (w: string) => `Lo que ha visto ${w}`, step: 'Tiempo', blank: 'Escribe o dibuja un recuerdo aquí.', noPic: 'Todavía sin dibujo',
    draw: 'Dibuja a tu testigo', closing: '«Parte de lo que heredamos está hecho de historias.»', cardLabel: 'Línea del tiempo imprimible',
  },
  fr: {
    skill: 'Histoire familiale et temps', title: 'Ce que l’arbre a vu', subtitle: 'Choisis un témoin de ta vie et fais une frise de ce qu’il a vu.', grownup: 'Raconter les histoires d’autrefois',
    step1: 'Choisis ton témoin', intro1: 'Le vieux figuier a vu trois cents ans de récoltes, de fêtes et de recettes. Qu’est-ce qui a vu grandir ta famille ? Choisis quelque chose qui est là depuis longtemps.',
    witnesses: { tree: 'Un arbre près de chez moi', house: 'Une maison', table: 'Une table de cuisine', street: 'Une rue', object: 'Un trésor des grands-parents', garden: 'Un jardin', other: 'Autre chose' },
    mine: { tree: 'mon arbre', house: 'ma maison', table: 'ma table de cuisine', street: 'ma rue', object: 'le trésor de mes grands-parents', garden: 'mon jardin' },
    otherLabel: 'Quel est ton témoin ?', otherPh: 'le vieux banc, la théière de mamie…', fallback: 'mon témoin',
    step2: 'Remplis la frise', intro2: 'M. Costas a raconté à Sofia les histoires de l’arbre. Demande à un grand-parent ou à un autre adulte de ta famille pour les deux premières époques. La dernière, c’est toi qui la racontes !',
    bands: ['Il y a longtemps (au temps de mes grands-parents)', 'Il n’y a pas si longtemps (au temps de mes parents)', 'Maintenant (à mon époque)'],
    ask: ['Demande à un grand-parent ou à un aîné de la famille.', 'Demande à un parent ou à un autre adulte.', 'Celle-ci, c’est toi qui la racontes.'],
    memory: 'Un souvenir', memoryPh: 'Il a vu…', picture: 'Une image pour ce souvenir',
    pics: { celebration: 'Fête', food: 'Repas', harvest: 'Récolte', music: 'Musique', work: 'Travail', travel: 'Voyage', baby: 'Un bébé', friends: 'Amis' },
    heading: (w: string) => `Ce que ${w} a vu`, step: 'Époque', blank: 'Écris ou dessine un souvenir ici.', noPic: 'Pas encore d’image',
    draw: 'Dessine ton témoin', closing: '« Une partie de ce que l’on hérite est faite d’histoires. »', cardLabel: 'Frise à imprimer',
  },
};

export default function TreeTimelineDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [witness, setWitness] = useState<Witness>('tree');
  const [other, setOther] = useState('');
  const [bands, setBands] = useState<Band[]>(EMPTY_BANDS);
  const update = (i: number, patch: Partial<Band>) => setBands(bands.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const name = witness === 'other' ? other.trim() || t.fallback : t.mine[witness];
  const witnessIcon = WITNESSES.find((w) => w.id === witness)?.icon ?? '🌳';
  const reset = () => { setWitness('tree'); setOther(''); setBands(EMPTY_BANDS); };

  return (
    <StudioFrame emoji="🌳" hue="sage" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['fig-trees-secret']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel className="bg-emerald-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro1}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label={t.step1}>
            {WITNESSES.map((w) => (
              <Choice key={w.id} selected={witness === w.id} onSelect={() => setWitness(w.id)} className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-2xl" aria-hidden>{w.icon}</span>{t.witnesses[w.id]}
              </Choice>
            ))}
          </div>
          {witness === 'other' && <div className="mt-3"><LineInput label={t.otherLabel} value={other} onChange={setOther} placeholder={t.otherPh} /></div>}

          <div className="mt-6"><StepLabel n="02">{t.step2}</StepLabel></div>
          <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
          <div className="grid gap-5">
            {bands.map((b, i) => (
              <fieldset key={i} className="rounded-xl border border-emerald-200 bg-white p-3">
                <legend className="px-1 text-sm font-bold text-emerald-900">{i + 1}. {t.bands[i]}</legend>
                <p className="text-xs text-gray-600 mb-2">{t.ask[i]}</p>
                <LineInput label={t.memory} value={b.memory} onChange={(v) => update(i, { memory: v })} placeholder={t.memoryPh} multiline />
                <p className="text-sm font-semibold text-gray-700 mt-3 mb-1">{t.picture}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label={`${t.picture}: ${t.bands[i]}`}>
                  {PICS.map((p) => (
                    <Choice key={p.id} selected={b.pic === p.id} onSelect={() => update(i, { pic: b.pic === p.id ? null : p.id })} className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="text-lg" aria-hidden>{p.icon}</span>{t.pics[p.id]}
                    </Choice>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Panel>

        <Printable label={t.cardLabel}>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl font-bold text-emerald-900 break-words min-w-0">{witnessIcon !== '✏️' && <span aria-hidden>{witnessIcon} </span>}{t.heading(name)}</h3>
            <div className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-emerald-400 grid place-items-center p-1 text-center text-xs font-semibold text-emerald-800">{t.draw}</div>
          </div>
          <ol className="relative mt-6 ml-4 border-l-4 border-emerald-700 space-y-6">
            {bands.map((b, i) => {
              const pic = PICS.find((p) => p.id === b.pic);
              return (
                <li key={i} className="relative pl-8">
                  <span className="absolute -left-[1.15rem] top-0 w-8 h-8 rounded-full bg-emerald-700 text-white font-bold grid place-items-center" aria-hidden>{i + 1}</span>
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-800"><span className="sr-only">{t.step} {i + 1}: </span>{t.bands[i]}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    {pic ? <><span className="text-2xl" aria-hidden>{pic.icon}</span>{t.pics[pic.id]}</> : <span className="italic text-gray-500">{t.noPic}</span>}
                  </p>
                  {b.memory.trim()
                    ? <p className="mt-1 text-gray-900 break-words">{b.memory}</p>
                    : <p className="mt-2 border-b-2 border-dotted border-gray-300 pb-1 text-sm italic text-gray-500">{t.blank}</p>}
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-center italic text-emerald-900">{t.closing}</p>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
