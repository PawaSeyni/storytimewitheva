// Kindness Ripple Challenge (Activity Studio, priority 2). Pairs with The Butterfly
// Effect and The Sparrow Who Saved the Forest: one small kind thing travels further than
// anyone can see, and the smallest sparrow notices what the biggest animals miss. A
// one-week family or class chart; the ripples are kept on this device so the week can
// continue tomorrow (storage adapter, never a cookie, never sent anywhere).
import { useState } from 'react';
import { Heart, Sparkles, Check } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { getLegacy, setLegacy, removeLegacy } from '../lib/storage';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Word = Record<Language, string>;
const ACTS: { id: string; word: Word }[] = [
  { id: 'helped', word: { en: 'I helped someone', es: 'Ayudé a alguien', fr: 'J’ai aidé quelqu’un' } },
  { id: 'words', word: { en: 'I used kind words', es: 'Usé palabras amables', fr: 'J’ai utilisé des mots gentils' } },
  { id: 'noticed', word: { en: 'I noticed someone, like the sparrow did', es: 'Me fijé en alguien, como hizo el gorrión', fr: 'J’ai remarqué quelqu’un, comme le moineau' } },
  { id: 'shared', word: { en: 'I took care of a shared space', es: 'Cuidé un espacio compartido', fr: 'J’ai pris soin d’un lieu partagé' } },
  { id: 'welcomed', word: { en: 'I welcomed someone', es: 'Di la bienvenida a alguien', fr: 'J’ai accueilli quelqu’un' } },
  { id: 'small', word: { en: 'I did one small thing, like the butterfly', es: 'Hice una cosa pequeña, como la mariposa', fr: 'J’ai fait une petite chose, comme le papillon' } },
];
const DAYS = 7;

interface Saved { ripples: string[]; reflection: string }
const isSaved = (v: unknown): v is Saved =>
  typeof v === 'object' && v !== null && Array.isArray((v as Saved).ripples) && (v as Saved).ripples.every((r) => typeof r === 'string') && typeof (v as Saved).reflection === 'string';

const TRANSLATIONS = {
  en: {
    skill: 'Community care', title: 'Kindness Ripple Challenge', subtitle: 'Notice one kind act a day for a week and watch the ripples grow.', grownup: 'Notice the ripples',
    step1: 'One kind thing can travel far', intro: 'In The Butterfly Effect, one small kind thing turned into another and another until a whole community changed. Choose a kind act you did or noticed today. Add one ripple each day.',
    add: 'Add a kindness ripple', full: 'Seven ripples. The week is complete!', reflect: 'What changed?', reflectPh: 'I noticed…',
    chart: 'Our Kindness Ripple Challenge', days: 'days', day: 'Day', waiting: 'waiting for a ripple', reflectEmpty: 'What changed this week?', saved: 'Your ripples are saved on this device, so the challenge can continue tomorrow.', cardLabel: 'Printable kindness ripple chart',
  },
  es: {
    skill: 'Cuidado de la comunidad', title: 'El reto de las ondas de bondad', subtitle: 'Fíjate en un acto amable cada día durante una semana y mira crecer las ondas.', grownup: 'Notar las ondas',
    step1: 'Una cosa amable puede llegar lejos', intro: 'En El efecto mariposa, una pequeña cosa amable se convirtió en otra y otra hasta que toda una comunidad cambió. Elige un acto amable que hiciste o viste hoy. Añade una onda cada día.',
    add: 'Añadir una onda de bondad', full: 'Siete ondas. ¡La semana está completa!', reflect: '¿Qué cambió?', reflectPh: 'Me di cuenta de que…',
    chart: 'Nuestro reto de las ondas de bondad', days: 'días', day: 'Día', waiting: 'esperando una onda', reflectEmpty: '¿Qué cambió esta semana?', saved: 'Tus ondas se guardan en este dispositivo para que el reto pueda seguir mañana.', cardLabel: 'Tabla de ondas de bondad imprimible',
  },
  fr: {
    skill: 'Prendre soin des autres', title: 'Le défi des ondes de gentillesse', subtitle: 'Remarque un geste gentil par jour pendant une semaine et regarde les ondes grandir.', grownup: 'Remarquer les ondes',
    step1: 'Une gentillesse peut aller loin', intro: 'Dans L’effet papillon, une petite gentillesse en a entraîné une autre, puis une autre, jusqu’à changer toute une communauté. Choisis un geste gentil que tu as fait ou remarqué aujourd’hui. Ajoute une onde chaque jour.',
    add: 'Ajouter une onde de gentillesse', full: 'Sept ondes. La semaine est complète !', reflect: 'Qu’est-ce qui a changé ?', reflectPh: 'J’ai remarqué…',
    chart: 'Notre défi des ondes de gentillesse', days: 'jours', day: 'Jour', waiting: 'en attente d’une onde', reflectEmpty: 'Qu’est-ce qui a changé cette semaine ?', saved: 'Tes ondes sont gardées sur cet appareil pour que le défi continue demain.', cardLabel: 'Tableau des ondes de gentillesse à imprimer',
  },
};

export default function KindnessRippleDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [selected, setSelected] = useState(ACTS[0].id);
  const [saved, setSaved] = useState<Saved>(() => getLegacy('kindnessRipples', isSaved) ?? { ripples: [], reflection: '' });
  const update = (next: Saved) => {
    setSaved(next);
    setLegacy('kindnessRipples', next);
  };
  const addRipple = () => {
    if (saved.ripples.length >= DAYS) return;
    update({ ...saved, ripples: [...saved.ripples, selected] });
  };
  const wordFor = (id: string) => ACTS.find((a) => a.id === id)?.word[language] ?? id;
  const count = saved.ripples.length;

  return (
    <StudioFrame emoji="💗" hue="rose" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-9" minutes={10} bookIds={['butterfly-effect', 'sparrow-saved-forest']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <div className="grid gap-2 mb-4" role="group" aria-label={t.step1}>
            {ACTS.map((a) => (
              <Choice key={a.id} selected={selected === a.id} onSelect={() => setSelected(a.id)} className="flex items-center gap-3 text-sm font-semibold">
                <Heart className="w-4 h-4 text-pink-600" aria-hidden />
                <span className="flex-1">{a.word[language]}</span>
                {selected === a.id && <Check className="w-4 h-4" aria-hidden />}
              </Choice>
            ))}
          </div>
          <button type="button" onClick={addRipple} disabled={count >= DAYS} className="btn-primary w-full justify-center disabled:opacity-50 disabled:hover:scale-100">
            <Sparkles className="w-4 h-4" aria-hidden /> {count >= DAYS ? t.full : t.add}
          </button>
          <div className="mt-4"><LineInput label={t.reflect} value={saved.reflection} onChange={(v) => update({ ...saved, reflection: v })} placeholder={t.reflectPh} multiline /></div>
          <p className="mt-3 text-xs text-gray-500">{t.saved}</p>
        </Panel>
        <Printable label={t.cardLabel} className="bg-linear-to-br from-white to-sky-50">
          <p className="flex items-center gap-2 text-sm font-bold text-pink-800"><Heart className="w-4 h-4" aria-hidden /> {t.chart} <span className="ml-auto text-xs font-mono text-gray-500" role="status" aria-live="polite">{count}/{DAYS} {t.days}</span></p>
          <div className="relative grid place-items-center my-4 aspect-square max-w-xs mx-auto" aria-hidden>
            {[7, 6, 5, 4, 3, 2, 1].map((size, index) => (
              <div key={size} className={`absolute rounded-full border-2 transition-colors ${index < count ? 'border-pink-400 bg-pink-100/40' : 'border-sky-200'}`} style={{ width: `${size * 13}%`, height: `${size * 13}%` }} />
            ))}
            <span className="relative text-4xl text-pink-600">♥</span>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
            {Array.from({ length: DAYS }).map((_, i) => (
              <li key={i} className="flex gap-2 rounded-lg border border-sky-100 bg-white/80 px-2 py-1.5 min-h-8">
                <span className="font-mono text-gray-500 whitespace-nowrap">{t.day} {i + 1}</span>
                {saved.ripples[i] ? <b className="text-gray-800">{wordFor(saved.ripples[i])}</b> : <i className="text-gray-400 not-italic">{t.waiting}</i>}
              </li>
            ))}
          </ol>
          <p className="mt-3 min-h-9 border-b border-sky-300 p-2 text-gray-700 italic">{saved.reflection || t.reflectEmpty}</p>
          <StudioActions onReset={() => { removeLegacy('kindnessRipples'); setSaved({ ripples: [], reflection: '' }); setSelected(ACTS[0].id); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
