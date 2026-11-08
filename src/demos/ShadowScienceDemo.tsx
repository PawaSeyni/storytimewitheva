// Where Did My Shadow Go? (Activity Studio). Pairs with The Adventures of Maya's Shadow:
// every night Maya's shadow slips out the door for adventures of its own. Move a lamp
// around a child to see simple light-and-shadow science, then imagine your own shadow's
// night adventure and print a card with a home flashlight experiment.
import { useId, useState } from 'react';
import { Flashlight } from 'lucide-react';
import { useTranslation } from '../lib/language';
import ReadAloudButton from '../components/ReadAloudButton';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Pos = 'left' | 'high' | 'right';
type Place = 'park' | 'moon' | 'sea' | 'forest' | 'rooftops' | 'library';
const POSITIONS: { id: Pos; angle: number; icon: string }[] = [
  { id: 'left', angle: 160, icon: '↖️' },
  { id: 'high', angle: 90, icon: '⬆️' },
  { id: 'right', angle: 20, icon: '↗️' },
];
const PLACES: { id: Place; emoji: string }[] = [
  { id: 'park', emoji: '🌳' }, { id: 'moon', emoji: '🌙' }, { id: 'sea', emoji: '🌊' },
  { id: 'forest', emoji: '🌲' }, { id: 'rooftops', emoji: '🏠' }, { id: 'library', emoji: '📚' },
];

const TRANSLATIONS = {
  en: {
    skill: 'Light and shadow science', title: 'Where Did My Shadow Go?', subtitle: 'Move the lamp, watch your shadow change, then send it on a night adventure.', grownup: 'Hold the flashlight',
    step1: 'Move the lamp', intro1: 'Maya’s shadow goes out every night. But where does a shadow come from? Move the lamp and watch.',
    pos: { left: 'Low on the left', high: 'High above', right: 'Low on the right' }, near: 'Lamp closer', far: 'Lamp farther', distance: 'How far is the lamp?',
    obsPos: { left: 'The lamp is low, so the shadow is long.', high: 'The lamp is high above, so the shadow is short.', right: 'The lamp is low, so the shadow is long.' },
    obsSide: { left: 'The lamp is on the left, so the shadow points right.', high: 'The shadow stays close to your feet.', right: 'The lamp is on the right, so the shadow points left.' },
    obsNear: 'The lamp is close, so the shadow is bigger and blurrier.', obsFar: 'The lamp is far, so the shadow has sharper edges.',
    listen: 'Listen: what the shadow is doing', scene: 'A child, a lamp and the child’s shadow on the ground',
    step2: 'Your shadow’s night adventure', intro2: 'Where would your shadow go tonight while you sleep?', listen2: 'Listen: where would your shadow go tonight?',
    places: { park: 'the park', moon: 'the moon', sea: 'the sea', forest: 'the forest', rooftops: 'the rooftops', library: 'the library' },
    doLabel: 'What does it do there?', doPh: 'It swings on the swings…',
    card: 'My shadow’s night adventure', goes: 'Where my shadow goes tonight:', does: 'What it does there:', blank: '____________', draw: 'Draw it here',
    homeTitle: 'Home experiment', home: 'Tonight, with a grown-up and a flashlight, make your shadow long, then short.', cardLabel: 'Printable shadow adventure card',
  },
  es: {
    skill: 'Ciencia de la luz y la sombra', title: '¿Adónde fue mi sombra?', subtitle: 'Mueve la lámpara, mira cómo cambia tu sombra y mándala a una aventura nocturna.', grownup: 'Sostener la linterna',
    step1: 'Mueve la lámpara', intro1: 'La sombra de Maya sale cada noche. Pero ¿de dónde viene una sombra? Mueve la lámpara y observa.',
    pos: { left: 'Baja a la izquierda', high: 'Muy arriba', right: 'Baja a la derecha' }, near: 'Lámpara más cerca', far: 'Lámpara más lejos', distance: '¿A qué distancia está la lámpara?',
    obsPos: { left: 'La lámpara está baja, así que la sombra es larga.', high: 'La lámpara está muy arriba, así que la sombra es corta.', right: 'La lámpara está baja, así que la sombra es larga.' },
    obsSide: { left: 'La lámpara está a la izquierda, así que la sombra apunta a la derecha.', high: 'La sombra se queda cerca de tus pies.', right: 'La lámpara está a la derecha, así que la sombra apunta a la izquierda.' },
    obsNear: 'La lámpara está cerca, así que la sombra es más grande y borrosa.', obsFar: 'La lámpara está lejos, así que la sombra tiene bordes más nítidos.',
    listen: 'Escuchar: qué hace la sombra', scene: 'Un niño, una lámpara y la sombra del niño en el suelo',
    step2: 'La aventura nocturna de tu sombra', intro2: '¿Adónde iría tu sombra esta noche mientras duermes?', listen2: 'Escuchar: ¿adónde iría tu sombra esta noche?',
    places: { park: 'el parque', moon: 'la luna', sea: 'el mar', forest: 'el bosque', rooftops: 'los tejados', library: 'la biblioteca' },
    doLabel: '¿Qué hace allí?', doPh: 'Se columpia en los columpios…',
    card: 'La aventura nocturna de mi sombra', goes: 'Adónde va mi sombra esta noche:', does: 'Lo que hace allí:', blank: '____________', draw: 'Dibújalo aquí',
    homeTitle: 'Experimento en casa', home: 'Esta noche, con un adulto y una linterna, haz que tu sombra sea larga y después corta.', cardLabel: 'Tarjeta imprimible de la aventura de mi sombra',
  },
  fr: {
    skill: 'La science de la lumière et des ombres', title: 'Où est passée mon ombre ?', subtitle: 'Déplace la lampe, regarde ton ombre changer, puis envoie-la vivre une aventure de nuit.', grownup: 'Tenir la lampe torche',
    step1: 'Déplace la lampe', intro1: 'L’ombre de Maya sort chaque nuit. Mais d’où vient une ombre ? Déplace la lampe et observe.',
    pos: { left: 'Basse à gauche', high: 'Tout en haut', right: 'Basse à droite' }, near: 'Lampe plus près', far: 'Lampe plus loin', distance: 'La lampe est-elle près ou loin ?',
    obsPos: { left: 'La lampe est basse, alors l’ombre est longue.', high: 'La lampe est tout en haut, alors l’ombre est courte.', right: 'La lampe est basse, alors l’ombre est longue.' },
    obsSide: { left: 'La lampe est à gauche, alors l’ombre part vers la droite.', high: 'L’ombre reste tout près de tes pieds.', right: 'La lampe est à droite, alors l’ombre part vers la gauche.' },
    obsNear: 'La lampe est près, alors l’ombre est plus grande et plus floue.', obsFar: 'La lampe est loin, alors l’ombre a des bords plus nets.',
    listen: 'Écouter : ce que fait l’ombre', scene: 'Un enfant, une lampe et l’ombre de l’enfant sur le sol',
    step2: 'L’aventure de nuit de ton ombre', intro2: 'Où irait ton ombre cette nuit, pendant que tu dors ?', listen2: 'Écouter : où irait ton ombre cette nuit ?',
    places: { park: 'le parc', moon: 'la lune', sea: 'la mer', forest: 'la forêt', rooftops: 'les toits', library: 'la bibliothèque' },
    doLabel: 'Que fait-elle là-bas ?', doPh: 'Elle fait de la balançoire…',
    card: 'L’aventure de nuit de mon ombre', goes: 'Où va mon ombre ce soir :', does: 'Ce qu’elle fait là-bas :', blank: '____________', draw: 'Dessine-la ici',
    homeTitle: 'Expérience à la maison', home: 'Ce soir, avec un adulte et une lampe torche, rends ton ombre longue, puis courte.', cardLabel: 'Carte à imprimer de l’aventure de mon ombre',
  },
};

const GROUND = 170;
const CX = 160;

export default function ShadowScienceDemo() {
  const t = useTranslation(TRANSLATIONS);
  const blurId = `shadow-blur-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [pos, setPos] = useState<Pos>('left');
  const [close, setClose] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [doing, setDoing] = useState('');

  const p = POSITIONS.find((x) => x.id === pos) ?? POSITIONS[0];
  const radius = close ? 85 : 135;
  const rad = (p.angle * Math.PI) / 180;
  const lx = CX + radius * Math.cos(rad);
  const ly = GROUND - radius * Math.sin(rad);
  // Shadow points away from the lamp: long when the lamp is low, short when it's high,
  // bigger and blurrier when the lamp is close.
  const dir = pos === 'left' ? 1 : pos === 'right' ? -1 : 0;
  const len = pos === 'high' ? (close ? 34 : 24) : close ? 130 : 100;
  const shadowCx = CX + (dir * len) / 2;
  const rx = dir === 0 ? len / 2 : len / 2 + 6;
  const ry = close ? 9 : 5;
  const blur = close ? 3 : 0.4;
  const observation = `${t.obsPos[pos]} ${t.obsSide[pos]} ${close ? t.obsNear : t.obsFar}`;
  const reset = () => { setPos('left'); setClose(false); setPlace(null); setDoing(''); };

  return (
    <StudioFrame emoji="🔦" hue="plum" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-7" minutes={10} bookIds={['mayas-shadow']} grownup={t.grownup}>
      <div className="grid gap-6">
        <Panel>
          <StepLabel n="01">{t.step1}</StepLabel>
          <p className="text-sm text-gray-700 mb-4">{t.intro1}</p>
          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] items-start">
            <svg viewBox="0 0 320 200" role="img" aria-label={`${t.scene}. ${observation}`} className="w-full rounded-xl bg-linear-to-b from-indigo-950 to-indigo-800">
              <defs>
                <filter id={blurId} x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation={blur} /></filter>
              </defs>
              <path d={`M ${CX - 135} ${GROUND} A 135 135 0 0 1 ${CX + 135} ${GROUND}`} fill="none" stroke="#a5b4fc" strokeDasharray="4 6" strokeWidth="1.5" />
              <rect x="0" y={GROUND} width="320" height={200 - GROUND} fill="#d9f99d" />
              <ellipse cx={shadowCx} cy={GROUND + 9} rx={rx} ry={ry} fill="#1e1b4b" opacity="0.8" filter={`url(#${blurId})`} />
              <g fill="#fbbf24" stroke="#78350f" strokeWidth="1.5">
                <circle cx={CX} cy={GROUND - 52} r="9" />
                <path d={`M ${CX - 10} ${GROUND - 40} h 20 l 4 26 h -28 z`} />
                <path d={`M ${CX - 6} ${GROUND - 14} v 14 M ${CX + 6} ${GROUND - 14} v 14`} strokeWidth="4" stroke="#78350f" />
              </g>
              <g className="motion-safe:transition-transform motion-safe:duration-500" style={{ transform: `translate(${lx}px, ${ly}px)` }}>
                <circle r="16" fill="#fde68a" opacity="0.35" />
                <circle r="9" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
              </g>
            </svg>
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-2" role="group" aria-label={t.step1}>
                {POSITIONS.map((x) => (
                  <Choice key={x.id} selected={pos === x.id} onSelect={() => setPos(x.id)} className="text-center text-sm font-semibold">
                    <span className="block text-2xl" aria-hidden>{x.icon}</span>{t.pos[x.id]}
                  </Choice>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.distance}>
                <Choice selected={close} onSelect={() => setClose(true)} className="text-center text-sm font-semibold"><Flashlight className="w-5 h-5 mx-auto mb-1" aria-hidden />{t.near}</Choice>
                <Choice selected={!close} onSelect={() => setClose(false)} className="text-center text-sm font-semibold"><Flashlight className="w-3.5 h-3.5 mx-auto mb-1" aria-hidden />{t.far}</Choice>
              </div>
              <p role="status" className="rounded-xl bg-white border border-indigo-200 p-3 text-sm font-semibold text-gray-800">{observation}</p>
              <div><ReadAloudButton text={observation} compact label={t.listen} /></div>
            </div>
          </div>
        </Panel>
        <Panel>
          <StepLabel n="02">{t.step2}</StepLabel>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="text-sm text-gray-700">{t.intro2}</p>
            <ReadAloudButton text={t.intro2} compact label={t.listen2} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
            {PLACES.map((x) => (
              <Choice key={x.id} selected={place === x.id} onSelect={() => setPlace(x.id)} className="text-center text-sm font-semibold">
                <span className="block text-4xl" aria-hidden>{x.emoji}</span>{t.places[x.id]}
              </Choice>
            ))}
          </div>
          <div className="max-w-md"><LineInput label={t.doLabel} value={doing} onChange={setDoing} placeholder={t.doPh} /></div>
        </Panel>
        <Printable label={t.cardLabel}>
          <h3 className="text-2xl font-bold text-gray-800">🌙 {t.card}</h3>
          <p className="mt-3 text-lg text-gray-800">
            {t.goes}{' '}
            <strong>{place ? <><span aria-hidden>{PLACES.find((x) => x.id === place)?.emoji} </span>{t.places[place]}</> : t.blank}</strong>
          </p>
          <p className="mt-2 text-lg text-gray-800">{t.does} <strong>{doing.trim() || t.blank}</strong></p>
          <div className="mt-4 h-56 rounded-2xl border-4 border-dashed border-gray-400 grid place-items-center text-gray-500 font-semibold">{t.draw}</div>
          <p className="mt-4 rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-sm text-gray-800">
            <strong className="flex items-center gap-1"><Flashlight className="w-4 h-4" aria-hidden /> {t.homeTitle}</strong>
            {t.home}
          </p>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
