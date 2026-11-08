// My True Treasure Chest (Activity Studio). Pairs with The Emperor's True Treasure: an
// emperor with a palace full of gold feels empty, while villagers with almost nothing
// seem to have everything that matters. Sort gold from true riches, then fill a chest
// with three things that make you truly rich.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

type Item = 'crown' | 'jewels' | 'throne' | 'robes' | 'laugh' | 'meal' | 'singing' | 'hug';
type Basket = 'gold' | 'rich';
const ITEMS: { id: Item; icon: string }[] = [
  { id: 'crown', icon: '👑' },
  { id: 'laugh', icon: '😄' },
  { id: 'jewels', icon: '💎' },
  { id: 'meal', icon: '🍲' },
  { id: 'throne', icon: '🪑' },
  { id: 'singing', icon: '🎶' },
  { id: 'robes', icon: '👘' },
  { id: 'hug', icon: '🤗' },
];
const BASKETS: { id: Basket; icon: string }[] = [
  { id: 'gold', icon: '🪙' },
  { id: 'rich', icon: '💛' },
];
const EMPTY_CHEST = ['', '', ''];

const TRANSLATIONS = {
  en: {
    skill: 'Gratitude and values', title: 'My True Treasure Chest', subtitle: 'Find out where your real riches live, then fill your own chest.', grownup: 'Share your own treasure',
    step1: 'Sort the treasures', intro: 'The emperor had a palace full of gold, and still he felt empty. The villagers had almost nothing, yet they seemed to have everything that matters. Put each card in a basket. There is no wrong answer: just think about it.',
    items: { crown: 'A golden crown', jewels: 'A pile of jewels', throne: 'A golden throne', robes: 'Silk robes', laugh: 'A friend’s laugh', meal: 'Sharing a meal together', singing: 'Singing with family', hug: 'A hug' },
    baskets: { gold: 'Gold can buy it', rich: 'Makes me truly rich' },
    putIn: (item: string, basket: string) => `Put “${item}” in the basket: ${basket}`,
    sorted: (n: number) => `${n} of 8 cards sorted`, emptyBasket: 'Nothing here yet.',
    reflection: 'You sorted every card! Look at your two baskets. The villagers in the story had very little gold, but they had friends, family and time together. Which basket would you rather carry home?',
    step2: 'Fill your own chest', intro2: 'Name three things that make YOU truly rich. They can be people, moments, places or feelings.',
    treasure: (n: number) => `Treasure ${n}`, placeholders: ['Someone I love…', 'A moment I treasure…', 'Something that makes me smile…'],
    name: 'My name (optional)', namePh: 'Write your name',
    cardTitle: 'My true treasure', cardOf: (n: string) => `The true treasure of ${n}`, emptyLine: 'a treasure to discover',
    idea: 'Real riches live in people and moments, not in gold.', adult: 'For the grown-up: share one treasure of your own that no money could buy, and tell why it matters to you.', cardLabel: 'Printable treasure chest card',
  },
  es: {
    skill: 'Gratitud y valores', title: 'Mi cofre del verdadero tesoro', subtitle: 'Descubre dónde viven tus verdaderas riquezas y llena tu propio cofre.', grownup: 'Compartir tu propio tesoro',
    step1: 'Clasifica los tesoros', intro: 'El emperador tenía un palacio lleno de oro y aun así se sentía vacío. Los aldeanos casi no tenían nada, pero parecían tener todo lo que importa. Pon cada tarjeta en una cesta. No hay respuestas equivocadas: solo piénsalo.',
    items: { crown: 'Una corona de oro', jewels: 'Un montón de joyas', throne: 'Un trono de oro', robes: 'Ropa de seda', laugh: 'La risa de un amigo', meal: 'Compartir una comida', singing: 'Cantar en familia', hug: 'Un abrazo' },
    baskets: { gold: 'El oro lo puede comprar', rich: 'Es mi verdadera riqueza' },
    putIn: (item: string, basket: string) => `Poner «${item}» en la cesta: ${basket}`,
    sorted: (n: number) => `${n} de 8 tarjetas clasificadas`, emptyBasket: 'Todavía no hay nada.',
    reflection: '¡Clasificaste todas las tarjetas! Mira tus dos cestas. Los aldeanos del cuento tenían muy poco oro, pero tenían amigos, familia y tiempo juntos. ¿Qué cesta te gustaría llevarte a casa?',
    step2: 'Llena tu propio cofre', intro2: 'Nombra tres cosas que son TU verdadera riqueza. Pueden ser personas, momentos, lugares o sentimientos.',
    treasure: (n: number) => `Tesoro ${n}`, placeholders: ['Alguien a quien quiero…', 'Un momento que atesoro…', 'Algo que me hace sonreír…'],
    name: 'Mi nombre (opcional)', namePh: 'Escribe tu nombre',
    cardTitle: 'Mi verdadero tesoro', cardOf: (n: string) => `El verdadero tesoro de ${n}`, emptyLine: 'un tesoro por descubrir',
    idea: 'Las verdaderas riquezas viven en las personas y los momentos, no en el oro.', adult: 'Para el adulto: comparte un tesoro tuyo que ningún dinero podría comprar y cuenta por qué es importante para ti.', cardLabel: 'Tarjeta imprimible del cofre del tesoro',
  },
  fr: {
    skill: 'Gratitude et valeurs', title: 'Mon coffre au vrai trésor', subtitle: 'Découvre où vivent tes vraies richesses, puis remplis ton propre coffre.', grownup: 'Partager son propre trésor',
    step1: 'Trie les trésors', intro: 'L’empereur avait un palais rempli d’or, et pourtant il se sentait vide. Les villageois n’avaient presque rien, mais ils semblaient avoir tout ce qui compte. Mets chaque carte dans un panier. Il n’y a pas de mauvaise réponse : réfléchis, tout simplement.',
    items: { crown: 'Une couronne en or', jewels: 'Un tas de bijoux', throne: 'Un trône en or', robes: 'Des habits de soie', laugh: 'Le rire d’un ami', meal: 'Partager un repas', singing: 'Chanter en famille', hug: 'Un câlin' },
    baskets: { gold: 'L’or peut l’acheter', rich: 'Me rend vraiment riche' },
    putIn: (item: string, basket: string) => `Mettre « ${item} » dans le panier : ${basket}`,
    sorted: (n: number) => `${n} cartes triées sur 8`, emptyBasket: 'Rien pour l’instant.',
    reflection: 'Tu as trié toutes les cartes ! Regarde tes deux paniers. Les villageois de l’histoire avaient très peu d’or, mais ils avaient des amis, de la famille et du temps ensemble. Quel panier aimerais-tu rapporter à la maison ?',
    step2: 'Remplis ton propre coffre', intro2: 'Nomme trois choses qui TE rendent vraiment riche. Ce peut être des personnes, des moments, des lieux ou des sentiments.',
    treasure: (n: number) => `Trésor ${n}`, placeholders: ['Quelqu’un que j’aime…', 'Un moment précieux…', 'Quelque chose qui me fait sourire…'],
    name: 'Mon prénom (facultatif)', namePh: 'Écris ton prénom',
    cardTitle: 'Mon vrai trésor', cardOf: (n: string) => `Le vrai trésor de ${n}`, emptyLine: 'un trésor à découvrir',
    idea: 'Les vraies richesses vivent dans les personnes et les moments, pas dans l’or.', adult: 'Pour l’adulte : partage un trésor à toi qu’aucun argent ne pourrait acheter, et explique pourquoi il compte pour toi.', cardLabel: 'Carte du coffre au trésor à imprimer',
  },
};

export default function TreasureChestDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [sort, setSort] = useState<Partial<Record<Item, Basket>>>({});
  const [chest, setChest] = useState<string[]>(EMPTY_CHEST);
  const [name, setName] = useState('');
  const count = Object.keys(sort).length;
  const reset = () => { setSort({}); setChest(EMPTY_CHEST); setName(''); };

  return (
    <StudioFrame emoji="🧰" hue="gold" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={10} bookIds={['emperors-true-treasure']} grownup={t.grownup}>
      <div className="grid gap-6">
        <Panel className="bg-amber-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ITEMS.map((it) => (
              <li key={it.id} className="rounded-xl border border-amber-200 bg-white p-3">
                <p className="font-semibold text-gray-800 flex items-center gap-2"><span className="text-2xl" aria-hidden>{it.icon}</span>{t.items[it.id]}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BASKETS.map((b) => {
                    const on = sort[it.id] === b.id;
                    return (
                      <button key={b.id} type="button" aria-pressed={on} aria-label={t.putIn(t.items[it.id], t.baskets[b.id])} onClick={() => setSort({ ...sort, [it.id]: b.id })} className={`rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${on ? 'border-amber-600 bg-amber-100 text-amber-900' : 'border-gray-200 text-gray-700 hover:border-amber-300'}`}>
                        <span aria-hidden>{on ? '✓ ' : ''}{b.icon} </span>{t.baskets[b.id]}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-amber-900" aria-live="polite">{t.sorted(count)}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {BASKETS.map((b) => {
              const inside = ITEMS.filter((it) => sort[it.id] === b.id);
              return (
                <div key={b.id} className="rounded-2xl border-2 border-amber-300 bg-white p-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2"><span aria-hidden>{b.icon}</span>{t.baskets[b.id]}</h4>
                  {inside.length === 0 ? <p className="mt-2 text-sm text-gray-500">{t.emptyBasket}</p> : (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {inside.map((it) => <li key={it.id} className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm text-gray-800"><span aria-hidden>{it.icon} </span>{t.items[it.id]}</li>)}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          {count === ITEMS.length && <p className="mt-4 rounded-xl bg-yellow-100 border border-yellow-300 p-3 text-sm text-gray-800">{t.reflection}</p>}
        </Panel>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
            <div className="grid gap-3">
              {chest.map((v, i) => (
                <LineInput key={i} label={t.treasure(i + 1)} value={v} placeholder={t.placeholders[i]} onChange={(nv) => setChest(chest.map((c, j) => (j === i ? nv : c)))} />
              ))}
              <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
            </div>
          </Panel>
          <Printable label={t.cardLabel}>
            <div className="rounded-2xl border-4 border-amber-700 bg-amber-50 overflow-hidden">
              <div className="bg-amber-700 text-amber-50 text-center py-3 px-4">
                <p className="text-3xl" aria-hidden>🧰</p>
                <h4 className="text-xl font-bold">{name.trim() ? t.cardOf(name.trim()) : t.cardTitle}</h4>
              </div>
              <ol className="p-5 grid gap-3">
                {chest.map((v, i) => (
                  <li key={i} className="flex items-start gap-3 border-b-2 border-dotted border-amber-300 pb-2">
                    <span className="text-xl" aria-hidden>💛</span>
                    <span className={`break-words text-lg ${v.trim() ? 'font-semibold text-gray-900' : 'italic text-gray-400'}`}>{v.trim() || t.emptyLine}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-4 text-center text-sm italic text-gray-700">{t.idea}</p>
            <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-gray-700">{t.adult}</p>
            <StudioActions onReset={reset} />
          </Printable>
        </div>
      </div>
    </StudioFrame>
  );
}
