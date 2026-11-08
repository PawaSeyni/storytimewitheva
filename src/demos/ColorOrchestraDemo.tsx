// Harmonia Color Orchestra (Activity Studio). Pairs with The Rainbow Symphony: in the
// village of Harmonia every color sings its own song, and the symphony only works when
// every voice joins in. Each color plays a soft note (Web Audio, no files); leave one out
// and hear the gap, then compose an 8-beat color song to play at home.
import { useEffect, useRef, useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions } from './studio/StudioFrame';

type ColorId = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
const COLORS: Record<ColorId, { hex: string; freq: number; word: Record<Language, string> }> = {
  red: { hex: '#ef4444', freq: 261.63, word: { en: 'red', es: 'rojo', fr: 'rouge' } },
  orange: { hex: '#f97316', freq: 293.66, word: { en: 'orange', es: 'naranja', fr: 'orange' } },
  yellow: { hex: '#facc15', freq: 329.63, word: { en: 'yellow', es: 'amarillo', fr: 'jaune' } },
  green: { hex: '#22c55e', freq: 392.0, word: { en: 'green', es: 'verde', fr: 'vert' } },
  blue: { hex: '#3b82f6', freq: 440.0, word: { en: 'blue', es: 'azul', fr: 'bleu' } },
  purple: { hex: '#a855f7', freq: 523.25, word: { en: 'purple', es: 'morado', fr: 'violet' } },
  pink: { hex: '#ec4899', freq: 587.33, word: { en: 'pink', es: 'rosa', fr: 'rose' } },
};
const IDS = Object.keys(COLORS) as ColorId[];
const MELODY: ColorId[] = [...IDS, 'purple', 'blue', 'green', 'yellow', 'orange', 'red'];
const BEATS = 8;
const STEP_MS = 420;

type AudioCtor = typeof AudioContext;
function getAudioCtor(): AudioCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  return w.AudioContext || w.webkitAudioContext;
}

const TRANSLATIONS = {
  en: {
    skill: 'Music and belonging', title: 'Harmonia Color Orchestra', subtitle: 'In Harmonia, every color sings its own song. Play them together!', grownup: 'Play the notes together',
    step1: 'Play together', intro1: 'Tap a color to switch it in or out of the band. Each color that joins sings its note. Then play the symphony.',
    inBand: 'in the band', outBand: 'resting', toggle: (c: string) => `${c} in the band`,
    playSym: 'Play the symphony', playing: 'Playing…', gap: 'silent gap',
    missing: (list: string) => `Did you hear the gap? The song needs every color. Missing: ${list}.`, belongs: 'Every color belongs in the song.',
    step2: 'Write your song', intro2: 'Pick a color, then tap a beat to put it there. Pick “rest” for a quiet beat.',
    pen: 'Choose a color for your song', rest: 'rest', beat: (n: number, c: string) => `Beat ${n}: ${c}. Tap to change.`, playMine: 'Play my song',
    noAudio: 'Sound is not available on this device, but you can still play with the colors and print your song.',
    cardTitle: 'My color song', home: 'Play it at home: line up glasses of water or tap pots and pans, one for each color.', cardLabel: 'Printable color song score',
  },
  es: {
    skill: 'Música y pertenencia', title: 'La orquesta de colores de Harmonia', subtitle: 'En Harmonia, cada color canta su propia canción. ¡Tócalos juntos!', grownup: 'Tocar las notas juntos',
    step1: 'Tocar juntos', intro1: 'Toca un color para meterlo o sacarlo de la orquesta. Cada color que entra canta su nota. Luego toca la sinfonía.',
    inBand: 'en la orquesta', outBand: 'descansando', toggle: (c: string) => `${c} en la orquesta`,
    playSym: 'Tocar la sinfonía', playing: 'Sonando…', gap: 'silencio',
    missing: (list: string) => `¿Oíste el hueco? La canción necesita todos los colores. Falta: ${list}.`, belongs: 'Todos los colores tienen su lugar en la canción.',
    step2: 'Escribe tu canción', intro2: 'Elige un color y toca un tiempo para ponerlo ahí. Elige «silencio» para un tiempo callado.',
    pen: 'Elige un color para tu canción', rest: 'silencio', beat: (n: number, c: string) => `Tiempo ${n}: ${c}. Toca para cambiarlo.`, playMine: 'Tocar mi canción',
    noAudio: 'El sonido no está disponible en este dispositivo, pero puedes jugar con los colores e imprimir tu canción.',
    cardTitle: 'Mi canción de colores', home: 'Tócala en casa: pon en fila vasos con agua o golpea ollas y cacerolas, uno para cada color.', cardLabel: 'Partitura imprimible de mi canción de colores',
  },
  fr: {
    skill: 'Musique et appartenance', title: 'L’orchestre des couleurs d’Harmonia', subtitle: 'À Harmonia, chaque couleur chante sa propre chanson. Joue-les ensemble !', grownup: 'Jouer les notes ensemble',
    step1: 'Jouer ensemble', intro1: 'Touche une couleur pour la faire entrer ou sortir de l’orchestre. Chaque couleur qui entre chante sa note. Puis joue la symphonie.',
    inBand: 'dans l’orchestre', outBand: 'au repos', toggle: (c: string) => `${c} dans l’orchestre`,
    playSym: 'Jouer la symphonie', playing: 'Ça joue…', gap: 'silence',
    missing: (list: string) => `As-tu entendu le trou ? La chanson a besoin de toutes les couleurs. Il manque : ${list}.`, belongs: 'Chaque couleur a sa place dans la chanson.',
    step2: 'Écris ta chanson', intro2: 'Choisis une couleur, puis touche un temps pour l’y mettre. Choisis « silence » pour un temps calme.',
    pen: 'Choisis une couleur pour ta chanson', rest: 'silence', beat: (n: number, c: string) => `Temps ${n} : ${c}. Touche pour changer.`, playMine: 'Jouer ma chanson',
    noAudio: 'Le son n’est pas disponible sur cet appareil, mais tu peux quand même jouer avec les couleurs et imprimer ta chanson.',
    cardTitle: 'Ma chanson en couleurs', home: 'Joue-la à la maison : aligne des verres d’eau ou tape sur des casseroles, un pour chaque couleur.', cardLabel: 'Partition de ma chanson en couleurs à imprimer',
  },
};

export default function ColorOrchestraDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [band, setBand] = useState<ColorId[]>(IDS);
  const [symBeat, setSymBeat] = useState<number | null>(null);
  const [played, setPlayed] = useState(false);
  const [pen, setPen] = useState<ColorId | null>('red');
  const [song, setSong] = useState<(ColorId | null)[]>(() => Array(BEATS).fill(null));
  const [songBeat, setSongBeat] = useState<number | null>(null);
  const [noAudio, setNoAudio] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => { timers.current.forEach((id) => window.clearTimeout(id)); }, []);

  const playNote = (c: ColorId) => {
    if (!ctxRef.current) {
      const Ctor = getAudioCtor();
      if (!Ctor) { setNoAudio(true); return; }
      try { ctxRef.current = new Ctor(); } catch { setNoAudio(true); return; }
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.value = COLORS[c].freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  };

  const stopAll = () => { timers.current.forEach((id) => window.clearTimeout(id)); timers.current = []; setSymBeat(null); setSongBeat(null); };

  const playSequence = (seq: (ColorId | null)[], setBeat: (n: number | null) => void, onDone?: () => void) => {
    stopAll();
    seq.forEach((c, i) => {
      timers.current.push(window.setTimeout(() => { setBeat(i); if (c) playNote(c); }, i * STEP_MS));
    });
    timers.current.push(window.setTimeout(() => { setBeat(null); onDone?.(); }, seq.length * STEP_MS));
  };

  const toggle = (c: ColorId) => { setPlayed(false); setBand(band.includes(c) ? band.filter((b) => b !== c) : [...band, c]); };
  const missing = IDS.filter((c) => !band.includes(c));
  const name = (c: ColorId | null) => (c ? COLORS[c].word[language] : t.rest);
  const busy = symBeat !== null || songBeat !== null;
  const reset = () => { stopAll(); setBand(IDS); setPlayed(false); setPen('red'); setSong(Array(BEATS).fill(null)); };

  return (
    <StudioFrame emoji="🎶" hue="plum" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-6" minutes={10} bookIds={['rainbow-symphony']} grownup={t.grownup}>
      <div className="grid gap-6">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-4">{t.intro1}</p>
          {noAudio && <p className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg p-2 mb-3">{t.noAudio}</p>}
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t.step1}>
            {IDS.map((c) => {
              const on = band.includes(c);
              return (
                <button key={c} type="button" aria-pressed={on} aria-label={t.toggle(COLORS[c].word[language])} onClick={() => { toggle(c); if (!on) playNote(c); }}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-2 text-xs font-semibold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${on ? 'border-gray-700 bg-white text-gray-800' : 'border-dashed border-gray-300 bg-gray-100 text-gray-500'}`}>
                  <span className={`w-10 h-10 rounded-full ${on ? '' : 'opacity-30'}`} style={{ background: COLORS[c].hex }} aria-hidden />
                  <span className="capitalize">{COLORS[c].word[language]}</span>
                  <span>{on ? t.inBand : t.outBand}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={() => playSequence(MELODY.map((c) => (band.includes(c) ? c : null)), setSymBeat, () => setPlayed(true))}>
            {symBeat !== null ? t.playing : t.playSym}
          </button>
          <ol className="flex flex-wrap gap-1.5 mt-4" aria-hidden>
            {MELODY.map((c, i) => {
              const on = band.includes(c);
              return (
                <li key={i} className={`w-9 h-9 rounded-full grid place-items-center text-[10px] font-bold ${on ? 'text-white' : 'border-2 border-dashed border-gray-400 text-gray-500'} ${symBeat === i ? 'ring-4 ring-purple-400 motion-safe:scale-110' : ''} motion-safe:transition-transform`} style={on ? { background: COLORS[c].hex } : undefined}>
                  {on ? '♪' : '…'}
                </li>
              );
            })}
          </ol>
          <p role="status" className="mt-3 text-sm font-semibold text-gray-800">
            {missing.length > 0 ? (played ? t.missing(missing.map((c) => COLORS[c].word[language]).join(', ')) : '') : t.belongs}
          </p>
        </Panel>
        <Panel>
          <StepLabel n="02">{t.step2}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro2}</p>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label={t.pen}>
            {[...IDS, null].map((c) => (
              <button key={c ?? 'rest'} type="button" aria-pressed={pen === c} onClick={() => { setPen(c); if (c) playNote(c); }}
                className={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold capitalize focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${pen === c ? 'border-gray-800 bg-white' : 'border-gray-200 bg-white/60'}`}>
                <span className={`w-5 h-5 rounded-full ${c ? '' : 'border-2 border-dashed border-gray-400'}`} style={c ? { background: COLORS[c].hex } : undefined} aria-hidden />
                {name(c)}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
            {song.map((c, i) => (
              <button key={i} type="button" aria-label={t.beat(i + 1, name(c))} onClick={() => setSong(song.map((s, j) => (j === i ? pen : s)))}
                className={`aspect-square rounded-full grid place-items-center text-xs font-bold focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${c ? 'text-white' : 'border-2 border-dashed border-gray-400 text-gray-500'} ${songBeat === i ? 'ring-4 ring-purple-400 motion-safe:scale-110' : ''} motion-safe:transition-transform`}
                style={c ? { background: COLORS[c].hex } : undefined}>
                <span className="bg-white/90 text-gray-900 rounded-full px-1.5">{i + 1}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary" disabled={busy} onClick={() => playSequence(song, setSongBeat)}>{songBeat !== null ? t.playing : t.playMine}</button>
        </Panel>
        <Printable label={t.cardLabel}>
          <p className="text-sm font-bold text-gray-700 text-center mb-4">🎶 {t.cardTitle}</p>
          <ol className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {song.map((c, i) => (
              <li key={i} className="flex flex-col items-center gap-1">
                <span className={`w-14 h-14 rounded-full grid place-items-center text-lg font-bold ${c ? 'text-white' : 'border-2 border-dashed border-gray-400 text-gray-500'}`} style={c ? { background: COLORS[c].hex, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } : undefined}><span className="bg-white/90 text-gray-900 rounded-full px-1.5">{i + 1}</span></span>
                <span className="text-sm font-semibold text-gray-700 capitalize">{name(c)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm text-gray-700 text-center">{t.home}</p>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
