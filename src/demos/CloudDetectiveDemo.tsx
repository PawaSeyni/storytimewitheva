// Cloud Detective Field Journal (Activity Studio, priority 2). Pairs with The Cloud
// Collector: Luna sets out with Grandpa Chen's butterfly net and a glass jar to collect
// one cloud of every kind. Observe the sky, match a cloud type, write a forecast, and
// collect five weather words in three languages.
import { useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Word = Record<Language, string>;
const CLOUDS: { id: string; shape: string; word: Word; clue: Word }[] = [
  { id: 'cumulus', shape: '☁️', word: { en: 'cumulus', es: 'cúmulo', fr: 'cumulus' }, clue: { en: 'Puffy like a cotton ball', es: 'Esponjosa como una bola de algodón', fr: 'Dodu comme une boule de coton' } },
  { id: 'cirrus', shape: '〰️', word: { en: 'cirrus', es: 'cirro', fr: 'cirrus' }, clue: { en: 'Wispy and very high', es: 'Fina y muy alta', fr: 'Fin et très haut' } },
  { id: 'stratus', shape: '🌫️', word: { en: 'stratus', es: 'estrato', fr: 'stratus' }, clue: { en: 'A soft gray blanket', es: 'Una manta gris y suave', fr: 'Une douce couverture grise' } },
  { id: 'nimbus', shape: '🌧️', word: { en: 'nimbus', es: 'nimbo', fr: 'nimbus' }, clue: { en: 'Dark and full of rain', es: 'Oscura y llena de lluvia', fr: 'Sombre et plein de pluie' } },
];
const FORECASTS: { id: string; icon: string; word: Word }[] = [
  { id: 'sun', icon: '☀️', word: { en: 'sunshine', es: 'sol', fr: 'soleil' } },
  { id: 'rain', icon: '🌧️', word: { en: 'rain', es: 'lluvia', fr: 'pluie' } },
  { id: 'wind', icon: '💨', word: { en: 'wind', es: 'viento', fr: 'vent' } },
  { id: 'snow', icon: '❄️', word: { en: 'snow', es: 'nieve', fr: 'neige' } },
  { id: 'fog', icon: '🌫️', word: { en: 'fog', es: 'niebla', fr: 'brouillard' } },
];

const TRANSLATIONS = {
  en: {
    skill: 'Science observation', title: 'Cloud Detective Field Journal', subtitle: 'Look up, observe, forecast, and collect sky words in three languages.', grownup: 'Explore outside',
    step1: 'Take your journal outside', intro: 'Luna wanted one cloud of every kind. Look up for one whole minute. Which cloud did you spot? Choose the closest shape.',
    step2: 'Make a forecast', forecastIntro: 'A cloud detective makes a guess about tomorrow. What do you think the sky will do?', note: 'My sky note', notePh: 'I noticed…',
    journal: 'Cloud Detective Field Journal', date: 'Date', spotted: 'I spotted a', cloud: 'cloud.', forecast: 'My forecast:', words: 'Word collector (five weather words)', noteEmpty: 'My sky note will go here.',
    jar: 'Grandpa Chen’s tip: you cannot keep a cloud in a jar, but you can keep the word for it.', cardLabel: 'Printable field journal page',
  },
  es: {
    skill: 'Observación científica', title: 'Diario de campo del detective de nubes', subtitle: 'Mira al cielo, observa, pronostica y colecciona palabras del cielo en tres idiomas.', grownup: 'Explorar afuera',
    step1: 'Lleva tu diario afuera', intro: 'Luna quería una nube de cada tipo. Mira al cielo durante un minuto entero. ¿Qué nube viste? Elige la forma más parecida.',
    step2: 'Haz un pronóstico', forecastIntro: 'Un detective de nubes adivina qué pasará mañana. ¿Qué crees que hará el cielo?', note: 'Mi nota del cielo', notePh: 'Vi que…',
    journal: 'Diario de campo del detective de nubes', date: 'Fecha', spotted: 'Vi una nube', cloud: '.', forecast: 'Mi pronóstico:', words: 'Colección de palabras (cinco palabras del tiempo)', noteEmpty: 'Aquí irá mi nota del cielo.',
    jar: 'Consejo del abuelo Chen: no puedes guardar una nube en un frasco, pero sí su palabra.', cardLabel: 'Página de diario de campo imprimible',
  },
  fr: {
    skill: 'Observation scientifique', title: 'Carnet de terrain du détective des nuages', subtitle: 'Lève les yeux, observe, prévois et collectionne les mots du ciel en trois langues.', grownup: 'Explorer dehors',
    step1: 'Emmène ton carnet dehors', intro: 'Luna voulait un nuage de chaque sorte. Regarde le ciel pendant une minute entière. Quel nuage as-tu repéré ? Choisis la forme la plus proche.',
    step2: 'Fais une prévision', forecastIntro: 'Un détective des nuages devine le temps de demain. Que va faire le ciel, à ton avis ?', note: 'Ma note du ciel', notePh: 'J’ai remarqué…',
    journal: 'Carnet de terrain du détective des nuages', date: 'Date', spotted: 'J’ai repéré un nuage', cloud: '.', forecast: 'Ma prévision :', words: 'Collection de mots (cinq mots de météo)', noteEmpty: 'Ma note du ciel ira ici.',
    jar: 'Le conseil de grand-père Chen : on ne peut pas garder un nuage dans un bocal, mais on peut garder son mot.', cardLabel: 'Page de carnet de terrain à imprimer',
  },
};

export default function CloudDetectiveDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [cloud, setCloud] = useState('cumulus');
  const [forecast, setForecast] = useState('sun');
  const [note, setNote] = useState('');
  const current = CLOUDS.find((c) => c.id === cloud) ?? CLOUDS[0];
  const fc = FORECASTS.find((f) => f.id === forecast) ?? FORECASTS[0];

  return (
    <StudioFrame emoji="☁️" hue="blue" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={20} bookIds={['cloud-collector']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="bg-sky-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <div className="grid gap-2 mb-5" role="group" aria-label={t.step1}>
            {CLOUDS.map((c) => (
              <Choice key={c.id} selected={cloud === c.id} onSelect={() => setCloud(c.id)} className="grid grid-cols-[2.5rem_1fr] items-center gap-x-3">
                <span className="text-3xl row-span-2" aria-hidden>{c.shape}</span>
                <strong className="text-sm">{c.word[language]}</strong>
                <small className="text-xs text-gray-500">{c.clue[language]}</small>
              </Choice>
            ))}
          </div>
          <StepLabel n="02">{t.step2}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.forecastIntro}</p>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t.step2}>
            {FORECASTS.map((f) => (
              <Choice key={f.id} selected={forecast === f.id} onSelect={() => setForecast(f.id)} className="text-sm font-semibold">
                <span aria-hidden>{f.icon}</span> {f.word[language]}
              </Choice>
            ))}
          </div>
          <LineInput label={t.note} value={note} onChange={setNote} placeholder={t.notePh} multiline />
        </Panel>
        <Printable label={t.cardLabel} className="flex flex-col bg-[linear-gradient(rgba(144,184,205,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(144,184,205,.15)_1px,transparent_1px)] bg-[size:20px_20px]">
          <p className="flex items-center gap-2 text-sm font-bold text-sky-900">☁️ {t.journal} <span className="ml-auto text-xs font-mono text-gray-500">{t.date}: __________</span></p>
          <div className="text-8xl text-center my-6" aria-hidden>{current.shape}</div>
          <p className="text-center text-gray-700">{t.spotted} <strong>{current.word[language]}</strong>{t.cloud === '.' ? '.' : ` ${t.cloud}`}</p>
          <p className="text-center text-gray-700 mt-1">{t.forecast} <strong>{fc.icon} {fc.word[language]}</strong></p>
          <div className="mt-4 rounded-xl border border-sky-200 bg-white/80 p-3 text-sm text-gray-700">
            <p className="text-xs font-mono uppercase text-sky-800 mb-1">{t.words}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-5 gap-1 text-xs">
              {FORECASTS.map((f) => (
                <li key={f.id}><span aria-hidden>{f.icon}</span> <b>EN</b> {f.word.en} <b>ES</b> {f.word.es} <b>FR</b> {f.word.fr}</li>
              ))}
            </ul>
          </div>
          <p className="mt-3 min-h-12 border-b border-sky-300 p-2 text-gray-700 italic">{note || t.noteEmpty}</p>
          <p className="mt-3 text-xs text-gray-500">{t.jar}</p>
          <StudioActions onReset={() => { setCloud('cumulus'); setForecast('sun'); setNote(''); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
