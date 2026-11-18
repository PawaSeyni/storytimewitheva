// Coins You Can't Spend (Activity Studio). Pairs with The Emperor's True Treasure: an emperor
// with a palace full of gold feels empty, while the villagers, who have almost nothing, seem to
// have everything that matters. Mint coins for the things no money could buy (the book's own
// "after reading" question), fill a treasury that gold never could, then print a week of coins
// to notice one each day. Nothing here goes beyond the catalog description.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Coin = 'hug' | 'laugh' | 'story' | 'walk' | 'song' | 'helping' | 'morning' | 'meal' | 'grandparent' | 'friend' | 'pet' | 'sky';
const COINS: { id: Coin; icon: string }[] = [
  { id: 'hug', icon: '🤗' }, { id: 'laugh', icon: '😂' }, { id: 'story', icon: '📖' }, { id: 'walk', icon: '🚶' },
  { id: 'song', icon: '🎶' }, { id: 'helping', icon: '🤝' }, { id: 'morning', icon: '🌅' }, { id: 'meal', icon: '🍲' },
  { id: 'grandparent', icon: '👵' }, { id: 'friend', icon: '🧑‍🤝‍🧑' }, { id: 'pet', icon: '🐕' }, { id: 'sky', icon: '🌌' },
];
const MAX = 7;
const OWN = 2;

const TRANSLATIONS = {
  en: {
    skill: 'Gratitude and perspective', title: 'Coins You Can’t Spend', subtitle: 'Mint a coin for each thing no money could buy, and fill a treasury richer than the emperor’s.', grownup: 'Add a coin of your own',
    step1: 'Mint your coins', intro: 'The emperor has a palace full of gold and still feels empty. The villagers have almost nothing and seem to have everything that matters. What do you have that no money could buy? Mint up to 7 coins.',
    coins: { hug: 'A hug', laugh: 'A friend’s laugh', story: 'A story at bedtime', walk: 'A walk together', song: 'A song I love', helping: 'Helping someone', morning: 'A sunny morning', meal: 'A meal we share', grandparent: 'Time with a grandparent', friend: 'A good friend', pet: 'My pet', sky: 'The stars at night' },
    ownLabel: (n: number) => `My own coin ${n}`, ownPh: ['the smell of rain', 'my sister’s jokes'], count: (n: number) => `${n} of ${MAX} coins minted.`, full: `Your treasury holds ${MAX} coins. Take one out to mint another.`,
    treasury: 'Your treasury', empty: 'Empty, like the emperor’s palace felt.', rich: (n: number) => `${n} ${n === 1 ? 'coin' : 'coins'} no gold could buy.`, richest: 'Seven coins. Richer than the emperor!',
    step2: 'Spend one today', intro2: 'A coin you can’t spend is still a coin you can use. Which one will you notice or share today?', today: 'Today I will notice:',
    cardLabel: 'Printable week of coins', card: 'My True Treasury', week: 'Color one coin each day you notice it.', day: (n: number) => `Day ${n}`, blank: '…', motto: 'Where richness really lives.',
  },
  es: {
    skill: 'Gratitud y perspectiva', title: 'Monedas que no se gastan', subtitle: 'Acuña una moneda por cada cosa que el dinero no puede comprar y llena un tesoro más rico que el del emperador.', grownup: 'Añade una moneda tuya',
    step1: 'Acuña tus monedas', intro: 'El emperador tiene un palacio lleno de oro y aun así se siente vacío. Los aldeanos casi no tienen nada y parecen tener todo lo que importa. ¿Qué tienes tú que el dinero no podría comprar? Acuña hasta 7 monedas.',
    coins: { hug: 'Un abrazo', laugh: 'La risa de un amigo', story: 'Un cuento antes de dormir', walk: 'Un paseo juntos', song: 'Una canción que me encanta', helping: 'Ayudar a alguien', morning: 'Una mañana de sol', meal: 'Una comida compartida', grandparent: 'Tiempo con los abuelos', friend: 'Un buen amigo', pet: 'Mi mascota', sky: 'Las estrellas de noche' },
    ownLabel: (n: number) => `Mi propia moneda ${n}`, ownPh: ['el olor de la lluvia', 'los chistes de mi hermana'], count: (n: number) => `${n} de ${MAX} monedas acuñadas.`, full: `Tu tesoro ya tiene ${MAX} monedas. Saca una para acuñar otra.`,
    treasury: 'Tu tesoro', empty: 'Vacío, como se sentía el palacio del emperador.', rich: (n: number) => `${n} ${n === 1 ? 'moneda' : 'monedas'} que ningún oro podría comprar.`, richest: 'Siete monedas. ¡Más rico que el emperador!',
    step2: 'Gasta una hoy', intro2: 'Una moneda que no se gasta sigue sirviendo. ¿Cuál vas a notar o compartir hoy?', today: 'Hoy voy a fijarme en:',
    cardLabel: 'Semana de monedas para imprimir', card: 'Mi verdadero tesoro', week: 'Colorea una moneda cada día que la notes.', day: (n: number) => `Día ${n}`, blank: '…', motto: 'Donde vive de verdad la riqueza.',
  },
  fr: {
    skill: 'Gratitude et recul', title: 'Des pièces qu’on ne dépense pas', subtitle: 'Frappe une pièce pour chaque chose que l’argent ne peut pas acheter, et remplis un trésor plus riche que celui de l’empereur.', grownup: 'Ajoutez une pièce à vous',
    step1: 'Frappe tes pièces', intro: 'L’empereur a un palais rempli d’or et se sent quand même vide. Les villageois n’ont presque rien et semblent avoir tout ce qui compte. Qu’as-tu que l’argent ne pourrait pas acheter ? Frappe jusqu’à 7 pièces.',
    coins: { hug: 'Un câlin', laugh: 'Le rire d’un ami', story: 'Une histoire au coucher', walk: 'Une promenade ensemble', song: 'Une chanson que j’adore', helping: 'Aider quelqu’un', morning: 'Un matin de soleil', meal: 'Un repas partagé', grandparent: 'Du temps avec papi ou mamie', friend: 'Un bon ami', pet: 'Mon animal', sky: 'Les étoiles la nuit' },
    ownLabel: (n: number) => `Ma propre pièce ${n}`, ownPh: ['l’odeur de la pluie', 'les blagues de ma sœur'], count: (n: number) => `${n} pièce${n > 1 ? 's' : ''} sur ${MAX}.`, full: `Ton trésor a déjà ${MAX} pièces. Retires-en une pour en frapper une autre.`,
    treasury: 'Ton trésor', empty: 'Vide, comme le palais de l’empereur lui semblait.', rich: (n: number) => `${n} pièce${n > 1 ? 's' : ''} qu’aucun or ne pourrait acheter.`, richest: 'Sept pièces. Plus riche que l’empereur !',
    step2: 'Dépenses-en une aujourd’hui', intro2: 'Une pièce qu’on ne dépense pas sert quand même. Laquelle vas-tu remarquer ou partager aujourd’hui ?', today: 'Aujourd’hui, je vais remarquer :',
    cardLabel: 'Semaine de pièces à imprimer', card: 'Mon vrai trésor', week: 'Colorie une pièce chaque jour où tu la remarques.', day: (n: number) => `Jour ${n}`, blank: '…', motto: 'Là où vit vraiment la richesse.',
  },
};

export default function TrueRichesCoinsDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [picked, setPicked] = useState<Coin[]>([]);
  const [own, setOwn] = useState<string[]>(Array(OWN).fill(''));
  const [full, setFull] = useState(false);
  const [today, setToday] = useState<string | null>(null);

  const ownCoins = own.map((s) => s.trim()).filter(Boolean);
  const minted: { key: string; icon: string; label: string }[] = [
    ...picked.map((c) => ({ key: c, icon: COINS.find((x) => x.id === c)?.icon ?? '🪙', label: t.coins[c] })),
    ...ownCoins.map((s, i) => ({ key: `own-${i}`, icon: '🪙', label: s })),
  ].slice(0, MAX);
  const toggle = (c: Coin) => {
    if (picked.includes(c)) { setPicked(picked.filter((x) => x !== c)); setFull(false); return; }
    if (minted.length >= MAX) { setFull(true); return; }
    setPicked([...picked, c]); setFull(false);
  };
  const reset = () => { setPicked([]); setOwn(Array(OWN).fill('')); setFull(false); setToday(null); };

  return (
    <StudioFrame emoji="🪙" hue="gold" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['emperors-true-treasure']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COINS.map((c) => (
                <Choice key={c.id} selected={picked.includes(c.id)} onSelect={() => toggle(c.id)} className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{c.icon}</span><span className="text-sm font-semibold">{t.coins[c.id]}</span>
                </Choice>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {own.map((s, i) => (
                <LineInput key={i} label={t.ownLabel(i + 1)} value={s} placeholder={t.ownPh[i]} onChange={(v) => setOwn(own.map((x, j) => (j === i ? v : x)))} />
              ))}
            </div>
            <p role="status" className="mt-2 text-xs text-gray-600">{full ? t.full : t.count(minted.length)}</p>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro2}</p>
            <div className="flex flex-wrap gap-2">
              {minted.map((m) => (
                <Choice key={m.key} selected={today === m.key} onSelect={() => setToday(m.key)} className="flex items-center gap-2">
                  <span aria-hidden>{m.icon}</span><span className="text-sm font-semibold">{m.label}</span>
                </Choice>
              ))}
            </div>
          </Panel>
        </div>
        <div className="grid gap-4 content-start">
          <Panel>
            <p className="text-sm font-bold text-amber-900">{t.treasury}</p>
            <div className="mt-2 min-h-24 rounded-2xl border-4 border-amber-300 bg-amber-50 p-3 flex flex-wrap gap-2" data-coins={minted.length}>
              {minted.map((m) => (
                <span key={m.key} className="inline-flex items-center gap-1 rounded-full border-2 border-amber-400 bg-yellow-100 px-3 py-1 text-sm font-semibold text-amber-900"><span aria-hidden>{m.icon}</span>{m.label}</span>
              ))}
            </div>
            <p role="status" className="mt-2 font-bold text-amber-900">{minted.length === 0 ? t.empty : minted.length >= MAX ? t.richest : t.rich(minted.length)}</p>
          </Panel>
          <Printable label={t.cardLabel}>
            <div className="rounded-xl border-4 border-amber-300 bg-amber-50 p-5 print:bg-white">
              <p className="text-center text-4xl" aria-hidden>🪙</p>
              <h3 className="text-center text-2xl font-bold text-amber-900">{t.card}</h3>
              <p className="mt-3 text-sm text-gray-700">{t.week}</p>
              <ol className="mt-3 grid grid-cols-4 gap-3">
                {Array.from({ length: MAX }, (_, i) => {
                  const m = minted[i];
                  return (
                    <li key={i} className="flex flex-col items-center text-center">
                      <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-amber-400 bg-white text-2xl" aria-hidden>{m?.icon ?? ''}</span>
                      <span className="mt-1 text-[10px] font-bold text-amber-900">{t.day(i + 1)}</span>
                      <span className="text-[10px] text-gray-700 leading-tight">{m?.label ?? t.blank}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-sm text-gray-800"><span className="font-bold">{t.today}</span> {today ? minted.find((m) => m.key === today)?.label : <span className="inline-block w-40 border-b border-gray-500" />}</p>
              <p className="mt-4 text-center font-bold text-amber-900">{t.motto}</p>
            </div>
          </Printable>
          <StudioActions onReset={reset} />
        </div>
      </div>
    </StudioFrame>
  );
}
