// The Kindness Mirror (Activity Studio). Pairs with The True Beauty of Meadowbrook: in a
// town where everyone competes to look the most beautiful, a quiet girl figures out a
// different way to shine. Choose three ways you shine, then make compliment cards that
// praise what people do, not how they look.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

const MAX = 3;
type Template = 'kind' | 'thanks' | 'like' | 'feel';
const TEMPLATES: Template[] = ['kind', 'thanks', 'like', 'feel'];
interface Card { template: Template; to: string; ending: string }
const EMPTY_CARDS: Card[] = [0, 1, 2, 3].map(() => ({ template: 'kind', to: '', ending: '' }));

const TRANSLATIONS = {
  en: {
    skill: 'Self-worth and kindness', title: 'The Kindness Mirror', subtitle: 'A mirror that shows how you shine on the inside, plus kind cards to give away.', grownup: 'Notice kindness out loud',
    step1: 'What the mirror sees', intro: 'In Meadowbrook, everyone competed to look the most beautiful. A quiet girl found a different way to shine. This mirror does not see hair or clothes. It sees what you do. Pick three ways you shine.',
    ways: ['I help', 'I listen', 'I share', 'I am brave', 'I make people laugh', 'I am patient', 'I am a good friend', 'I try again', 'I notice when someone is sad', 'I say thank you'],
    count: (n: number) => `${n} of ${MAX} chosen`, full: 'Your mirror is full. To change, tap one you chose to take it off, then pick another.',
    custom: 'My own way to shine (optional)', customPh: 'I…', name: 'My name', namePh: 'Write your name',
    step2: 'Compliment cards', intro2: 'Make four little cards to give to people you know. Praise something they do or how they make you feel, not how they look.',
    card: (n: number) => `Card ${n}`, templates: { kind: 'You are kind when…', thanks: 'Thank you for…', like: 'I like how you…', feel: 'You make me feel…' },
    to: 'For (a name)', toPh: 'Grandma, Sam, my teacher…', ending: 'Finish the sentence', endingPh: 'you help me tie my shoes',
    mirrorTitle: (n: string) => `${n || 'I'} ${n ? 'shines' : 'shine'} by:`, emptyWay: 'a way to shine',
    cardTo: (n: string) => `To ${n}`, cardFrom: (n: string) => `From ${n}`,
    idea: 'Kindness is the kind of beauty that lasts.', cut: 'Cut out the cards along the dashed lines and give them away.',
    adult: 'For the grown-up: this week, notice kindness out loud. Say what you saw: “You waited for your friend. That was patient.”', cardLabel: 'Printable kindness mirror and compliment cards',
  },
  es: {
    skill: 'Autoestima y bondad', title: 'El espejo de la bondad', subtitle: 'Un espejo que muestra cómo brillas por dentro, y tarjetas amables para regalar.', grownup: 'Notar la bondad en voz alta',
    step1: 'Lo que ve el espejo', intro: 'En Meadowbrook, todos competían por ser los más bellos. Una niña tranquila descubrió otra forma de brillar. Este espejo no ve el pelo ni la ropa. Ve lo que haces. Elige tres formas en que brillas.',
    ways: ['Ayudo', 'Escucho', 'Comparto', 'Soy valiente', 'Hago reír a los demás', 'Soy paciente', 'Cuido de mis amigos', 'Lo intento otra vez', 'Me doy cuenta cuando alguien está triste', 'Doy las gracias'],
    count: (n: number) => `${n} de ${MAX} elegidas`, full: 'Tu espejo está lleno. Para cambiar, toca una de las elegidas para quitarla y elige otra.',
    custom: 'Mi propia forma de brillar (opcional)', customPh: 'Yo…', name: 'Mi nombre', namePh: 'Escribe tu nombre',
    step2: 'Tarjetas de cumplidos', intro2: 'Haz cuatro tarjetitas para regalar a personas que conoces. Elogia algo que hacen o cómo te hacen sentir, no cómo se ven.',
    card: (n: number) => `Tarjeta ${n}`, templates: { kind: 'Eres amable cuando…', thanks: 'Gracias por…', like: 'Me gusta cómo…', feel: 'Me haces sentir…' },
    to: 'Para (un nombre)', toPh: 'La abuela, Sam, mi maestra…', ending: 'Completa la frase', endingPh: 'me ayudas a atarme los zapatos',
    mirrorTitle: (n: string) => (n ? `${n} brilla porque:` : 'Yo brillo porque:'), emptyWay: 'una forma de brillar',
    cardTo: (n: string) => `Para ${n}`, cardFrom: (n: string) => `De ${n}`,
    idea: 'La bondad es esa belleza que perdura.', cut: 'Recorta las tarjetas por las líneas de puntos y regálalas.',
    adult: 'Para el adulto: esta semana, nota la bondad en voz alta. Di lo que viste: «Esperaste a tu amigo. Eso fue ser paciente».', cardLabel: 'Espejo de la bondad y tarjetas de cumplidos imprimibles',
  },
  fr: {
    skill: 'Estime de soi et gentillesse', title: 'Le miroir de la gentillesse', subtitle: 'Un miroir qui montre comment tu brilles de l’intérieur, et des cartes gentilles à offrir.', grownup: 'Remarquer la gentillesse à voix haute',
    step1: 'Ce que voit le miroir', intro: 'À Meadowbrook, chacun rivalisait pour être le plus beau. Une fille discrète a découvert une autre façon de briller. Ce miroir ne voit ni les cheveux ni les habits. Il voit ce que tu fais. Choisis trois façons dont tu brilles.',
    ways: ['J’aide', 'J’écoute', 'Je partage', 'J’ai du courage', 'Je fais rire les autres', 'J’ai de la patience', 'Je prends soin de mes amis', 'J’essaie encore', 'Je remarque quand quelqu’un est triste', 'Je dis merci'],
    count: (n: number) => `${n} sur ${MAX} choisies`, full: 'Ton miroir est plein. Pour changer, touche une de tes réponses pour la retirer, puis choisis-en une autre.',
    custom: 'Ma façon à moi de briller (facultatif)', customPh: 'Je…', name: 'Mon prénom', namePh: 'Écris ton prénom',
    step2: 'Cartes de compliments', intro2: 'Fabrique quatre petites cartes à offrir à des personnes que tu connais. Fais un compliment sur ce qu’elles font ou sur ce que tu ressens avec elles, pas sur leur apparence.',
    card: (n: number) => `Carte ${n}`, templates: { kind: 'C’est gentil quand tu…', thanks: 'Merci de…', like: 'J’aime comment tu…', feel: 'Avec toi, je me sens…' },
    to: 'Pour (un prénom)', toPh: 'Mamie, Sam, ma maîtresse…', ending: 'Termine la phrase', endingPh: 'm’aides à lacer mes chaussures',
    mirrorTitle: (n: string) => (n ? `${n} brille parce que :` : 'Je brille parce que :'), emptyWay: 'une façon de briller',
    cardTo: (n: string) => `Pour ${n}`, cardFrom: (n: string) => `De ${n}`,
    idea: 'La gentillesse, c’est la beauté qui dure.', cut: 'Découpe les cartes le long des pointillés et offre-les.',
    adult: 'Pour l’adulte : cette semaine, remarque la gentillesse à voix haute. Dis ce que tu as vu : « Tu as attendu ton ami. C’était de la patience. »', cardLabel: 'Miroir de la gentillesse et cartes de compliments à imprimer',
  },
};

export default function KindnessMirrorDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [picked, setPicked] = useState<number[]>([]);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [cards, setCards] = useState<Card[]>(EMPTY_CARDS);
  const full = picked.length >= MAX;
  const toggle = (i: number) => setPicked(picked.includes(i) ? picked.filter((p) => p !== i) : full ? picked : [...picked, i]);
  const setCard = (i: number, patch: Partial<Card>) => setCards(cards.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const shines = [...picked.map((i) => t.ways[i]), ...(custom.trim() ? [custom.trim()] : [])];
  const reset = () => { setPicked([]); setCustom(''); setName(''); setCards(EMPTY_CARDS); };

  return (
    <StudioFrame emoji="🪞" hue="rose" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={10} bookIds={['true-beauty-meadowbrook']} grownup={t.grownup}>
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="bg-pink-50">
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
            <p className="text-sm font-bold text-pink-900 mb-2" aria-live="polite">{t.count(picked.length)}{full ? ` ${t.full}` : ''}</p>
            <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label={t.step1}>
              {t.ways.map((w, i) => {
                const on = picked.includes(i);
                return (
                  <Choice key={w} selected={on} onSelect={() => toggle(i)} className={`text-sm font-semibold ${full && !on ? 'opacity-60' : ''}`}>
                    <span aria-hidden>{on ? '✨ ' : '○ '}</span>{w}
                  </Choice>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3">
              <LineInput label={t.custom} value={custom} onChange={setCustom} placeholder={t.customPh} />
              <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
            </div>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
            <div className="grid gap-4">
              {cards.map((c, i) => (
                <fieldset key={i} className="rounded-xl border border-pink-200 bg-white p-3">
                  <legend className="px-1 text-sm font-bold text-pink-900">{t.card(i + 1)}</legend>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {TEMPLATES.map((tp) => (
                      <Choice key={tp} selected={c.template === tp} onSelect={() => setCard(i, { template: tp })} className="text-xs font-semibold px-2 py-1">{t.templates[tp]}</Choice>
                    ))}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <LineInput label={t.to} value={c.to} onChange={(v) => setCard(i, { to: v })} placeholder={t.toPh} />
                    <LineInput label={t.ending} value={c.ending} onChange={(v) => setCard(i, { ending: v })} placeholder={t.endingPh} />
                  </div>
                </fieldset>
              ))}
            </div>
          </Panel>
        </div>
        <Printable label={t.cardLabel}>
          <div className="mx-auto max-w-sm rounded-[50%/40%] border-[10px] border-pink-300 bg-linear-to-b from-pink-50 to-white px-8 py-12 text-center print:border-gray-500">
            <p className="text-3xl" aria-hidden>🪞</p>
            <h4 className="mt-2 text-xl font-bold text-gray-900 break-words">{t.mirrorTitle(name.trim())}</h4>
            <ul className="mt-4 grid gap-2">
              {(shines.length ? shines : [t.emptyWay]).map((s) => (
                <li key={s} className={`break-words text-lg ${shines.length ? 'font-semibold text-gray-900' : 'italic text-gray-400'}`}><span aria-hidden>✨ </span>{s}</li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-center text-sm italic text-gray-700">{t.idea}</p>
          <p className="mt-6 text-xs font-mono uppercase tracking-wider text-gray-500 text-center">{t.cut}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 print:grid-cols-2">
            {cards.map((c, i) => (
              <div key={i} className="rounded-lg border-2 border-dashed border-gray-400 p-4 min-h-32 flex flex-col break-inside-avoid">
                {c.to.trim() && <p className="text-sm font-bold text-pink-800 break-words">{t.cardTo(c.to.trim())}</p>}
                <p className="mt-1 text-gray-900 break-words flex-1">
                  <span className="font-semibold">{t.templates[c.template].replace('…', '')}</span>{' '}
                  {c.ending.trim() || <span className="inline-block w-32 border-b border-gray-400 align-bottom" aria-hidden>&nbsp;</span>}
                </p>
                {name.trim() && <p className="mt-2 text-sm text-gray-600 text-right break-words">{t.cardFrom(name.trim())}</p>}
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-pink-50 border border-pink-200 p-3 text-sm text-gray-700">{t.adult}</p>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
