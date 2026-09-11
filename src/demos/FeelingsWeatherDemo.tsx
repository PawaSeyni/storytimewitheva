// My Feelings Weather Report (Activity Studio, priority 1). Pairs with Pawa and the
// Little Rainbow Cloud: Cirro the little gray cloud learns from Pawa the Sun that rain
// and light together make something extraordinary. Name today's weather inside, choose
// one caring next step, and take home a report card.
import { useState } from 'react';
import { Check, Heart } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice } from './studio/StudioFrame';

type Word = Record<Language, string>;
const FEELINGS: { id: string; icon: string; tone: string; word: Word }[] = [
  { id: 'sunny', icon: '☀️', tone: '#d99a1a', word: { en: 'bright and happy', es: 'alegre y luminoso', fr: 'joyeux et lumineux' } },
  { id: 'rainy', icon: '🌧️', tone: '#3f7bc0', word: { en: 'sad or heavy, like Cirro', es: 'triste o pesado, como Cirro', fr: 'triste ou lourd, comme Cirro' } },
  { id: 'windy', icon: '💨', tone: '#7b67b8', word: { en: 'wobbly or worried', es: 'inquieto o preocupado', fr: 'agité ou inquiet' } },
  { id: 'stormy', icon: '⛈️', tone: '#565277', word: { en: 'angry or stormy', es: 'enojado o tormentoso', fr: 'fâché ou orageux' } },
  { id: 'rainbow', icon: '🌈', tone: '#c0508a', word: { en: 'mixed up, rain and sun at once', es: 'mezclado, lluvia y sol a la vez', fr: 'mélangé, pluie et soleil en même temps' } },
];
const ACTIONS: { id: string; icon: string; word: Word }[] = [
  { id: 'talk', icon: '🗣️', word: { en: 'Tell a caring grown-up', es: 'Contárselo a un adulto de confianza', fr: 'Le dire à un adulte bienveillant' } },
  { id: 'breathe', icon: '🌬️', word: { en: 'Take three slow breaths', es: 'Respirar despacio tres veces', fr: 'Prendre trois respirations lentes' } },
  { id: 'cuddle', icon: '🧸', word: { en: 'Ask for a cozy cuddle', es: 'Pedir un abrazo acogedor', fr: 'Demander un câlin réconfortant' } },
  { id: 'draw', icon: '🖍️', word: { en: 'Draw the feeling', es: 'Dibujar el sentimiento', fr: 'Dessiner l’émotion' } },
  { id: 'light', icon: '🔆', word: { en: 'Find a bit of light, like Pawa: one good thing about today', es: 'Buscar un poco de luz, como Pawa: una cosa buena de hoy', fr: 'Trouver un peu de lumière, comme Pawa : une bonne chose d’aujourd’hui' } },
];

const TRANSLATIONS = {
  en: {
    skill: 'Feelings language', title: 'My Feelings Weather Report', subtitle: 'Name today’s feeling like weather, then choose one small caring step.', grownup: 'Listen and wonder',
    step1: 'What is your weather today?', intro: 'Feelings come and go, just like weather. Cirro felt heavy and gray after the storm. Choose the weather that feels closest right now.',
    step2: 'Choose a caring next step', report: 'My feelings weather report', today: 'Today feels', oneThing: 'One kind thing I can do:', prompt: 'Grown-up prompt: “Would you like to tell me more?”',
    remember: 'Remember what Pawa the Sun told Cirro: when rain meets light, something extraordinary happens.', cardLabel: 'Printable feelings weather report',
  },
  es: {
    skill: 'Lenguaje de las emociones', title: 'Mi parte del tiempo emocional', subtitle: 'Nombra el sentimiento de hoy como si fuera el tiempo y elige un pequeño paso de cuidado.', grownup: 'Escuchar y preguntar',
    step1: '¿Qué tiempo hace hoy dentro de ti?', intro: 'Los sentimientos vienen y van, igual que el tiempo. Cirro se sentía pesado y gris después de la tormenta. Elige el tiempo que más se parezca a cómo te sientes ahora.',
    step2: 'Elige un paso de cuidado', report: 'Mi parte del tiempo emocional', today: 'Hoy me siento', oneThing: 'Una cosa amable que puedo hacer:', prompt: 'Pregunta para el adulto: «¿Quieres contarme más?»',
    remember: 'Recuerda lo que Pawa el Sol le dijo a Cirro: cuando la lluvia se encuentra con la luz, ocurre algo extraordinario.', cardLabel: 'Parte del tiempo emocional imprimible',
  },
  fr: {
    skill: 'Le langage des émotions', title: 'Ma météo des émotions', subtitle: 'Nomme l’émotion du jour comme une météo, puis choisis un petit geste de soin.', grownup: 'Écouter et s’étonner',
    step1: 'Quel temps fait-il en toi aujourd’hui ?', intro: 'Les émotions vont et viennent, comme la météo. Cirro se sentait lourd et gris après l’orage. Choisis la météo la plus proche de ce que tu ressens.',
    step2: 'Choisis un geste de soin', report: 'Ma météo des émotions', today: 'Aujourd’hui je me sens', oneThing: 'Une chose gentille que je peux faire :', prompt: 'Question pour l’adulte : « Veux-tu m’en dire plus ? »',
    remember: 'Souviens-toi de ce que Pawa le Soleil a dit à Cirro : quand la pluie rencontre la lumière, quelque chose d’extraordinaire arrive.', cardLabel: 'Météo des émotions à imprimer',
  },
};

export default function FeelingsWeatherDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [weather, setWeather] = useState('sunny');
  const [action, setAction] = useState('talk');
  const current = FEELINGS.find((f) => f.id === weather) ?? FEELINGS[0];
  const step = ACTIONS.find((a) => a.id === action) ?? ACTIONS[0];

  return (
    <StudioFrame emoji="🌦️" hue="sky" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-7" minutes={10} bookIds={['pawa-rainbow-cloud']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <div className="grid grid-cols-2 gap-2 mb-5" role="group" aria-label={t.step1}>
            {FEELINGS.map((f) => (
              <Choice key={f.id} selected={weather === f.id} onSelect={() => setWeather(f.id)}>
                <span className="block text-2xl mb-1" aria-hidden>{f.icon}</span>
                <strong className="text-sm">{f.word[language]}</strong>
              </Choice>
            ))}
          </div>
          <StepLabel n="02">{t.step2}</StepLabel>
          <div className="grid gap-2" role="group" aria-label={t.step2}>
            {ACTIONS.map((a) => (
              <Choice key={a.id} selected={action === a.id} onSelect={() => setAction(a.id)} className="flex items-center gap-3 text-sm font-semibold">
                <span aria-hidden>{a.icon}</span>
                <span className="flex-1">{a.word[language]}</span>
                {action === a.id && <Check className="w-4 h-4" aria-hidden />}
              </Choice>
            ))}
          </div>
        </Panel>
        <Printable label={t.cardLabel} className="flex flex-col">
          <div className="text-6xl self-end" aria-hidden>{current.icon}</div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.report}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{t.today}<br /><span style={{ color: current.tone }}>{current.word[language]}</span></p>
          <hr className="my-4 border-gray-200" />
          <p className="text-sm font-semibold text-gray-600">{t.oneThing}</p>
          <p className="text-xl font-bold text-gray-800 mt-1 mb-4">{step.icon} {step.word[language]}</p>
          <p className="mt-auto rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-gray-700 flex gap-2"><Heart className="w-4 h-4 shrink-0 text-pink-600" aria-hidden /> <span>{t.prompt}</span></p>
          <p className="mt-2 text-xs text-gray-500 italic">{t.remember}</p>
          <StudioActions onReset={() => { setWeather('sunny'); setAction('talk'); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
