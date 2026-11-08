// Map My World (Activity Studio). Pairs with The Little Mapmaker: five-year-old Maya
// draws maps of her bedroom, the kitchen and the backyard with the tire swing, and one
// day draws a castle deep in the tall grass. Stamp a 6 by 6 map, hide the castle, and
// let a grown-up find it using rows and columns.
import { useState } from 'react';
import { Eraser, Eye, EyeOff } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Stamp = 'bed' | 'door' | 'window' | 'table' | 'toybox' | 'tree' | 'swing' | 'castle';
type Tool = Stamp | 'eraser';
const SIZE = 6;
const STAMPS: { id: Stamp; emoji: string; name: Record<Language, string> }[] = [
  { id: 'bed', emoji: '🛏️', name: { en: 'bed', es: 'cama', fr: 'lit' } },
  { id: 'door', emoji: '🚪', name: { en: 'door', es: 'puerta', fr: 'porte' } },
  { id: 'window', emoji: '🪟', name: { en: 'window', es: 'ventana', fr: 'fenêtre' } },
  { id: 'table', emoji: '🍽️', name: { en: 'table', es: 'mesa', fr: 'table' } },
  { id: 'toybox', emoji: '🧸', name: { en: 'toy box', es: 'baúl de juguetes', fr: 'coffre à jouets' } },
  { id: 'tree', emoji: '🌳', name: { en: 'tree', es: 'árbol', fr: 'arbre' } },
  { id: 'swing', emoji: '🛞', name: { en: 'tire swing', es: 'columpio de neumático', fr: 'balançoire en pneu' } },
  { id: 'castle', emoji: '🏰', name: { en: 'castle', es: 'castillo', fr: 'château' } },
];
const EMPTY: (Stamp | null)[] = Array(SIZE * SIZE).fill(null);

const TRANSLATIONS = {
  en: {
    skill: 'Spatial thinking', title: 'Map My World', subtitle: 'Stamp a map of a place you know, then hide a castle for your grown-up to find.', grownup: 'Find the castle',
    step1: 'Pick a stamp', intro: 'Maya draws maps of her bedroom, the kitchen and the backyard with the tire swing. Choose a stamp, then tap a square to place it. Tap again with the same stamp to take it away.',
    eraser: 'Eraser', castleNote: 'There is only one castle, your hidden treasure. Placing it again moves it.', mapOf: 'Map of', mapPh: 'my bedroom',
    step2: 'Hide the castle', hideIntro: 'Hide the castle, then your grown-up taps squares to guess. When the castle is hidden, it stays hidden on the printed map too, so you can play the game on paper.',
    hide: 'Hide the castle', show: 'Show the castle',
    where: (r: number, c: number) => `Your castle is at row ${r}, column ${c}. Tell your grown-up a clue, like “It is in row ${r}.”`, noCastle: 'Place the castle stamp somewhere on your map first.',
    found: (r: number, c: number) => `You found the castle at row ${r}, column ${c}!`, miss: (r: number, c: number) => `Not at row ${r}, column ${c}. Try another square!`,
    cell: (r: number, c: number, what: string) => `Row ${r}, column ${c}: ${what}`, empty: 'empty', row: 'Row', col: 'Column',
    legend: 'Legend', legendEmpty: 'Your stamps will appear here.', hidden: 'hidden!', compass: ['N', 'E', 'S', 'W'], compassLabel: 'Compass: north at the top, east on the right, south at the bottom, west on the left',
    untitled: 'my world', cardLabel: 'Printable map',
  },
  es: {
    skill: 'Pensamiento espacial', title: 'El mapa de mi mundo', subtitle: 'Haz con sellos el mapa de un lugar que conoces y esconde un castillo para que un adulto lo encuentre.', grownup: 'Encontrar el castillo',
    step1: 'Elige un sello', intro: 'Maya dibuja mapas de su habitación, de la cocina y del jardín con el columpio de neumático. Elige un sello y toca un cuadro para ponerlo. Tócalo otra vez con el mismo sello para quitarlo.',
    eraser: 'Borrador', castleNote: 'Solo hay un castillo, tu tesoro escondido. Si lo pones otra vez, se mueve.', mapOf: 'Mapa de', mapPh: 'mi habitación',
    step2: 'Esconde el castillo', hideIntro: 'Esconde el castillo y luego tu adulto toca cuadros para adivinar. Cuando el castillo está escondido, también queda escondido en el mapa impreso, así pueden jugar en papel.',
    hide: 'Esconder el castillo', show: 'Mostrar el castillo',
    where: (r: number, c: number) => `Tu castillo está en la fila ${r}, columna ${c}. Dale una pista a tu adulto, como «Está en la fila ${r}».`, noCastle: 'Primero pon el sello del castillo en tu mapa.',
    found: (r: number, c: number) => `¡Encontraste el castillo en la fila ${r}, columna ${c}!`, miss: (r: number, c: number) => `No está en la fila ${r}, columna ${c}. ¡Prueba otro cuadro!`,
    cell: (r: number, c: number, what: string) => `Fila ${r}, columna ${c}: ${what}`, empty: 'vacío', row: 'Fila', col: 'Columna',
    legend: 'Leyenda', legendEmpty: 'Tus sellos aparecerán aquí.', hidden: '¡escondido!', compass: ['N', 'E', 'S', 'O'], compassLabel: 'Brújula: norte arriba, este a la derecha, sur abajo, oeste a la izquierda',
    untitled: 'mi mundo', cardLabel: 'Mapa imprimible',
  },
  fr: {
    skill: 'Repérage dans l’espace', title: 'La carte de mon monde', subtitle: 'Tamponne la carte d’un endroit que tu connais, puis cache un château pour qu’un adulte le trouve.', grownup: 'Trouver le château',
    step1: 'Choisis un tampon', intro: 'Maya dessine des cartes de sa chambre, de la cuisine et du jardin avec la balançoire en pneu. Choisis un tampon, puis touche une case pour le poser. Touche-la encore avec le même tampon pour l’enlever.',
    eraser: 'Gomme', castleNote: 'Il n’y a qu’un seul château, ton trésor caché. Si tu le poses ailleurs, il se déplace.', mapOf: 'Carte de', mapPh: 'ma chambre',
    step2: 'Cache le château', hideIntro: 'Cache le château, puis ton adulte touche des cases pour deviner. Quand le château est caché, il reste caché sur la carte imprimée aussi : vous pouvez jouer sur papier.',
    hide: 'Cacher le château', show: 'Montrer le château',
    where: (r: number, c: number) => `Ton château est à la ligne ${r}, colonne ${c}. Donne un indice à ton adulte, comme « Il est sur la ligne ${r} ».`, noCastle: 'Pose d’abord le tampon du château sur ta carte.',
    found: (r: number, c: number) => `Tu as trouvé le château à la ligne ${r}, colonne ${c} !`, miss: (r: number, c: number) => `Pas à la ligne ${r}, colonne ${c}. Essaie une autre case !`,
    cell: (r: number, c: number, what: string) => `Ligne ${r}, colonne ${c} : ${what}`, empty: 'vide', row: 'Ligne', col: 'Colonne',
    legend: 'Légende', legendEmpty: 'Tes tampons apparaîtront ici.', hidden: 'caché !', compass: ['N', 'E', 'S', 'O'], compassLabel: 'Boussole : le nord en haut, l’est à droite, le sud en bas, l’ouest à gauche',
    untitled: 'mon monde', cardLabel: 'Carte à imprimer',
  },
};

export default function MapMyWorldDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [cells, setCells] = useState(EMPTY);
  const [tool, setTool] = useState<Tool>('bed');
  const [title, setTitle] = useState('');
  const [hidden, setHidden] = useState(false);
  const [guess, setGuess] = useState<{ i: number; hit: boolean } | null>(null);

  const castleAt = cells.indexOf('castle');
  const rc = (i: number) => [Math.floor(i / SIZE) + 1, (i % SIZE) + 1] as const;
  const used = STAMPS.filter((s) => cells.includes(s.id));
  const nameOf = (id: Stamp) => STAMPS.find((s) => s.id === id)!.name[language];

  const press = (i: number) => {
    if (hidden) {
      const hit = i === castleAt;
      setGuess({ i, hit });
      if (hit) setHidden(false);
      return;
    }
    const next = [...cells];
    if (tool === 'eraser' || next[i] === tool) next[i] = null;
    else {
      if (tool === 'castle' && castleAt >= 0) next[castleAt] = null;
      next[i] = tool;
    }
    setCells(next);
    setGuess(null);
  };
  const toggleHide = () => { setHidden(!hidden); setGuess(null); };

  let status = '';
  if (guess) status = guess.hit ? `🎉 ${t.found(...rc(guess.i))}` : t.miss(...rc(guess.i));
  else if (castleAt >= 0 && !hidden) status = t.where(...rc(castleAt));
  else if (castleAt < 0) status = t.noCastle;

  const [n, e, s, w] = t.compass;

  return (
    <StudioFrame emoji="🗺️" hue="teal" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={15} bookIds={['little-mapmaker']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel className="bg-teal-50">
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-600 mb-3">{t.intro}</p>
          <div className="grid grid-cols-2 gap-2 mb-2" role="group" aria-label={t.step1}>
            {STAMPS.map((st) => (
              <Choice key={st.id} selected={tool === st.id} onSelect={() => setTool(st.id)} className="text-sm font-semibold flex items-center gap-2">
                <span className="text-2xl" aria-hidden>{st.emoji}</span> {st.name[language]}
              </Choice>
            ))}
            <Choice selected={tool === 'eraser'} onSelect={() => setTool('eraser')} className="text-sm font-semibold flex items-center gap-2">
              <Eraser className="w-5 h-5" aria-hidden /> {t.eraser}
            </Choice>
          </div>
          <p className="text-xs text-gray-600 mb-4"><span aria-hidden>🏰 </span>{t.castleNote}</p>
          <LineInput label={t.mapOf} value={title} onChange={setTitle} placeholder={t.mapPh} />
          <div className="mt-5">
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-3">{t.hideIntro}</p>
            <button type="button" aria-pressed={hidden} disabled={castleAt < 0} onClick={toggleHide} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-teal-400 text-teal-800 font-semibold hover:bg-teal-100 disabled:opacity-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500">
              {hidden ? <Eye className="w-4 h-4" aria-hidden /> : <EyeOff className="w-4 h-4" aria-hidden />} {hidden ? t.show : t.hide}
            </button>
          </div>
          <p role="status" className="mt-3 min-h-6 text-sm font-semibold text-gray-800">{status}</p>
        </Panel>

        <Printable label={t.cardLabel}>
          <div className="flex items-start justify-between gap-4">
            <p className="text-xl font-bold text-gray-800"><span aria-hidden>🗺️ </span>{t.mapOf} {title.trim() || t.untitled}</p>
            <div role="img" aria-label={t.compassLabel} className="shrink-0 grid grid-cols-3 grid-rows-3 w-16 h-16 text-xs font-bold text-teal-800 place-items-center rounded-full border-2 border-teal-300 bg-teal-50">
              <span className="col-start-2">{n}</span>
              <span className="row-start-2 col-start-1">{w}</span>
              <span className="row-start-2 col-start-2" aria-hidden>✦</span>
              <span className="row-start-2 col-start-3">{e}</span>
              <span className="row-start-3 col-start-2">{s}</span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[auto_repeat(6,minmax(0,1fr))] gap-1 max-w-md">
            <span aria-hidden />
            {Array.from({ length: SIZE }, (_, c) => <span key={c} className="text-center text-xs font-mono text-gray-500" aria-hidden>{c + 1}</span>)}
            {Array.from({ length: SIZE }, (_, r) => [
              <span key={`r${r}`} className="pr-1 self-center text-xs font-mono text-gray-500" aria-hidden>{r + 1}</span>,
              ...Array.from({ length: SIZE }, (_, c) => {
                const i = r * SIZE + c;
                const v = cells[i];
                const show = v && !(v === 'castle' && hidden);
                const missed = guess && !guess.hit && guess.i === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => press(i)}
                    aria-label={t.cell(r + 1, c + 1, show ? nameOf(v) : t.empty)}
                    className={`aspect-square rounded-md border text-xl sm:text-2xl grid place-items-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${missed ? 'border-amber-400 bg-amber-50' : 'border-teal-200 bg-white hover:bg-teal-50'}`}
                  >
                    {show ? <span aria-hidden>{STAMPS.find((x) => x.id === v)!.emoji}</span> : missed ? <span aria-hidden className="text-sm text-amber-700">✕</span> : null}
                  </button>
                );
              }),
            ])}
          </div>
          <h3 className="mt-4 font-bold text-gray-800">{t.legend}</h3>
          {used.length ? (
            <ul className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-1 text-sm text-gray-700">
              {used.map((st) => (
                <li key={st.id}><span aria-hidden>{st.id === 'castle' && hidden ? '❓' : st.emoji} </span>{st.name[language]}{st.id === 'castle' && hidden ? ` (${t.hidden})` : ''}</li>
              ))}
            </ul>
          ) : <p className="mt-1 text-sm text-gray-500">{t.legendEmpty}</p>}
          <StudioActions onReset={() => { setCells(EMPTY); setTitle(''); setHidden(false); setGuess(null); setTool('bed'); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
