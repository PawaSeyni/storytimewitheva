// Listen Like a Fox (Activity Studio). Pairs with Russet the Fox Learns a Lesson:
// Russet is sure he is the cleverest fox in the den, so he barely listens when his
// mother warns him about the dogs and the wire fence. Mother Fox gives one, two, then
// three steps; the child listens, remembers, and taps the places in order.
import { useEffect, useState, useSyncExternalStore } from 'react';
import { Eye, EyeOff, Volume2 } from 'lucide-react';
import { useLanguage, useTranslation } from '../lib/language';
import { play, stop, isSpeechSupported } from '../lib/speech';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, LineInput } from './studio/StudioFrame';

type Place = 'den' | 'log' | 'stream' | 'oak' | 'hedge' | 'fence';
const PLACES: { id: Place; emoji: string }[] = [
  { id: 'den', emoji: '🕳️' },
  { id: 'log', emoji: '🪵' },
  { id: 'stream', emoji: '💧' },
  { id: 'oak', emoji: '🌳' },
  { id: 'hedge', emoji: '🌿' },
  { id: 'fence', emoji: '🚧' },
];
const ROUNDS: Place[][] = [['log'], ['stream', 'oak'], ['hedge', 'log', 'den']];
const STEPS = ['✋', '👂', '👀', '🐾'];

const TRANSLATIONS = {
  en: {
    skill: 'Listening and working memory', title: 'Listen Like a Fox', subtitle: 'Hear Mother Fox, remember her steps, and follow them in order.', grownup: 'Give the instructions',
    step1: 'Listen to Mother Fox', intro: 'Russet was so sure he was clever that he barely listened to his mother. Let’s do better! Listen to the whole message first, then tap the places in the same order.',
    places: { den: 'the den', log: 'the big log', stream: 'the stream', oak: 'the old oak', hedge: 'the hedge', fence: 'the wire fence' } as Record<Place, string>,
    avoid: 'Stay away!', round: (n: number) => `Round ${n} of 3`,
    rounds: ['Go to the big log.', 'Go to the stream, then the old oak.', 'Go to the hedge, then the big log, then home to the den. Stay away from the fence!'],
    listen: 'Listen to Mother Fox', show: 'Show the words', hide: 'Hide the words', noSpeech: 'This device cannot read aloud, so here are the words. A grown-up can read them to you.',
    q: ['“', '”'], path: 'Your path:', empty: 'Tap a place to start.',
    oops: 'Russet rushed! Listen again, slow paws.', fence: 'Oh no, that is the wire fence! Russet rushed. Listen again, slow paws.',
    good: ['You listened like a wise fox!', 'Two steps, in order. Mother Fox is proud!'], next: 'Next round', allDone: 'Three rounds, every step in order. You took your time, and that is the cleverest thing a fox can do!', again: 'Play again',
    cardTitle: 'Before I rush', cardSteps: ['Stop', 'Listen', 'Look', 'Then go'], cardHints: ['Keep my paws still.', 'Hear the whole message.', 'Check where I am going.', 'Take my time.'],
    name: 'My name', namePh: 'Write your name', advice: 'Who gives you good advice?', advicePh: 'My mom, my teacher, my grandpa…', cardLabel: 'Printable Before I rush card',
  },
  es: {
    skill: 'Escucha y memoria de trabajo', title: 'Escucha como un zorro', subtitle: 'Oye a Mamá Zorra, recuerda sus pasos y síguelos en orden.', grownup: 'Dar las instrucciones',
    step1: 'Escucha a Mamá Zorra', intro: 'Russet estaba tan seguro de ser listo que apenas escuchaba a su madre. ¡Hagámoslo mejor! Escucha todo el mensaje primero y luego toca los lugares en el mismo orden.',
    places: { den: 'la madriguera', log: 'el tronco grande', stream: 'el arroyo', oak: 'el viejo roble', hedge: 'el seto', fence: 'la alambrada' } as Record<Place, string>,
    avoid: '¡No te acerques!', round: (n: number) => `Ronda ${n} de 3`,
    rounds: ['Ve al tronco grande.', 'Ve al arroyo y luego al viejo roble.', 'Ve al seto, luego al tronco grande y después vuelve a la madriguera. ¡No te acerques a la alambrada!'],
    listen: 'Escuchar a Mamá Zorra', show: 'Mostrar las palabras', hide: 'Ocultar las palabras', noSpeech: 'Este dispositivo no puede leer en voz alta, así que aquí están las palabras. Un adulto te las puede leer.',
    q: ['«', '»'], path: 'Tu camino:', empty: 'Toca un lugar para empezar.',
    oops: '¡Russet se apresuró! Escucha otra vez, patitas tranquilas.', fence: '¡Oh, no, es la alambrada! Russet se apresuró. Escucha otra vez, patitas tranquilas.',
    good: ['¡Escuchaste como un zorro sabio!', 'Dos pasos, en orden. ¡Mamá Zorra está orgullosa!'], next: 'Siguiente ronda', allDone: 'Tres rondas, cada paso en orden. Te tomaste tu tiempo, ¡y eso es lo más listo que puede hacer un zorro!', again: 'Jugar otra vez',
    cardTitle: 'Antes de apresurarme', cardSteps: ['Para', 'Escucha', 'Mira', 'Luego ve'], cardHints: ['Dejo mis patitas quietas.', 'Oigo todo el mensaje.', 'Miro a dónde voy.', 'Me tomo mi tiempo.'],
    name: 'Mi nombre', namePh: 'Escribe tu nombre', advice: '¿Quién te da buenos consejos?', advicePh: 'Mi mamá, mi maestra, mi abuelo…', cardLabel: 'Tarjeta imprimible Antes de apresurarme',
  },
  fr: {
    skill: 'Écoute et mémoire de travail', title: 'Écoute comme un renard', subtitle: 'Écoute Maman Renarde, retiens ses étapes et suis-les dans l’ordre.', grownup: 'Donner les consignes',
    step1: 'Écoute Maman Renarde', intro: 'Russet était si sûr d’être malin qu’il écoutait à peine sa mère. Faisons mieux ! Écoute tout le message d’abord, puis touche les endroits dans le même ordre.',
    places: { den: 'le terrier', log: 'le grand tronc', stream: 'le ruisseau', oak: 'le vieux chêne', hedge: 'la haie', fence: 'la clôture' } as Record<Place, string>,
    avoid: 'N’approche pas !', round: (n: number) => `Manche ${n} sur 3`,
    rounds: ['Va jusqu’au grand tronc.', 'Va au ruisseau, puis au vieux chêne.', 'Va à la haie, puis au grand tronc, puis rentre au terrier. Ne t’approche pas de la clôture !'],
    listen: 'Écouter Maman Renarde', show: 'Montrer les mots', hide: 'Cacher les mots', noSpeech: 'Cet appareil ne peut pas lire à voix haute, alors voici les mots. Un adulte peut te les lire.',
    q: ['« ', ' »'], path: 'Ton chemin :', empty: 'Touche un endroit pour commencer.',
    oops: 'Russet s’est précipité ! Écoute encore, petites pattes tranquilles.', fence: 'Oh non, c’est la clôture ! Russet s’est précipité. Écoute encore, petites pattes tranquilles.',
    good: ['Tu as écouté comme un renard sage !', 'Deux étapes, dans l’ordre. Maman Renarde est fière !'], next: 'Manche suivante', allDone: 'Trois manches, chaque étape dans l’ordre. Tu as pris ton temps, et c’est la chose la plus maligne qu’un renard puisse faire !', again: 'Rejouer',
    cardTitle: 'Avant de me précipiter', cardSteps: ['Je m’arrête', 'J’écoute', 'Je regarde', 'Puis j’y vais'], cardHints: ['Je garde mes pattes immobiles.', 'J’entends tout le message.', 'Je vérifie où je vais.', 'Je prends mon temps.'],
    name: 'Mon nom', namePh: 'Écris ton nom', advice: 'Qui te donne de bons conseils ?', advicePh: 'Ma maman, ma maîtresse, mon papi…', cardLabel: 'Carte « Avant de me précipiter » à imprimer',
  },
};

const noop = () => () => {};

export default function ListenLikeAFoxDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const speechOk = useSyncExternalStore(noop, isSpeechSupported, () => true);
  const [round, setRound] = useState(0);
  const [taps, setTaps] = useState<Place[]>([]);
  const [showWords, setShowWords] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'oops' | 'fence' | 'good'>('idle');
  const [name, setName] = useState('');
  const [advice, setAdvice] = useState('');

  useEffect(() => () => stop(), []);

  const finished = round >= ROUNDS.length;
  const target = ROUNDS[Math.min(round, ROUNDS.length - 1)];
  const instruction = t.rounds[Math.min(round, ROUNDS.length - 1)];
  const wordsVisible = showWords || !speechOk;

  const tap = (p: Place) => {
    if (finished || feedback === 'good') return;
    if (p === 'fence' || p !== target[taps.length]) {
      setTaps([]);
      setFeedback(p === 'fence' ? 'fence' : 'oops');
      return;
    }
    const next = [...taps, p];
    setTaps(next);
    setFeedback(next.length === target.length ? 'good' : 'idle');
  };
  const nextRound = () => { stop(); setRound(round + 1); setTaps([]); setFeedback('idle'); setShowWords(false); };
  const restart = () => { stop(); setRound(0); setTaps([]); setFeedback('idle'); setShowWords(false); };

  let status = '';
  if (finished) status = t.allDone;
  else if (feedback === 'oops') status = t.oops;
  else if (feedback === 'fence') status = t.fence;
  else if (feedback === 'good') status = t.good[round] ?? t.good[1];

  return (
    <StudioFrame emoji="🦊" hue="coral" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={10} bookIds={['russet-the-fox']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="bg-orange-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          {!finished && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">{t.round(round + 1)}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {speechOk && (
                  <button type="button" onClick={() => play('listen-like-a-fox', instruction, language)} className="btn-primary">
                    <Volume2 className="w-4 h-4" aria-hidden /> {t.listen}
                  </button>
                )}
                {speechOk && (
                  <button type="button" aria-pressed={showWords} onClick={() => setShowWords(!showWords)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-300 text-orange-800 font-semibold hover:bg-orange-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500">
                    {showWords ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />} {showWords ? t.hide : t.show}
                  </button>
                )}
              </div>
              {!speechOk && <p className="text-xs text-gray-600 mb-2">{t.noSpeech}</p>}
              {wordsVisible && <p className="rounded-xl bg-white border border-orange-200 p-3 text-lg font-semibold text-gray-800 mb-3">🦊 {t.q[0]}{instruction}{t.q[1]}</p>}
            </>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLACES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => tap(p.id)}
                disabled={finished}
                className={`rounded-2xl border-2 p-3 min-h-24 flex flex-col items-center justify-center gap-1 font-semibold text-gray-800 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60 ${p.id === 'fence' ? 'border-dashed border-red-300 bg-red-50 hover:bg-red-100' : 'border-orange-200 bg-white hover:border-orange-400'}`}
              >
                <span className="text-4xl" aria-hidden>{p.emoji}</span>
                <span className="text-sm text-center">{t.places[p.id]}</span>
                {p.id === 'fence' && <span className="text-xs font-bold text-red-700">{t.avoid}</span>}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-700"><strong>{t.path}</strong> {taps.length ? taps.map((p) => t.places[p]).join(' → ') : t.empty}</p>
          <p role="status" className="mt-2 min-h-6 text-base font-semibold text-gray-800">{status}</p>
          {feedback === 'good' && !finished && (
            <button type="button" onClick={nextRound} className="btn-primary mt-2">{t.next}</button>
          )}
          {finished && <button type="button" onClick={restart} className="btn-primary mt-2">{t.again}</button>}
        </Panel>
        <Printable label={t.cardLabel} className="bg-orange-50/40">
          <p className="text-xl font-bold text-gray-800 flex items-center gap-2"><span aria-hidden>🦊</span> {t.cardTitle}</p>
          <ol className="mt-4 grid gap-3">
            {t.cardSteps.map((s, i) => (
              <li key={s} className="grid grid-cols-[auto_auto_1fr] items-center gap-3">
                <span className="text-xs font-mono text-orange-700">0{i + 1}</span>
                <span className="w-10 h-10 grid place-items-center rounded-lg bg-white border border-orange-200 text-xl" aria-hidden>{STEPS[i]}</span>
                <span><strong className="block text-gray-800">{s}</strong><small className="text-gray-600">{t.cardHints[i]}</small></span>
              </li>
            ))}
          </ol>
          <div className="mt-5 grid gap-3">
            <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
            <LineInput label={t.advice} value={advice} onChange={setAdvice} placeholder={t.advicePh} />
          </div>
          <StudioActions onReset={() => { restart(); setName(''); setAdvice(''); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
