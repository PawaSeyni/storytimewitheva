// Inventor's Blueprint (Activity Studio). Pairs with Heidi's Journey to Mastery: Heidi
// dreams of solar cars and a robot to clean the lake, but her grandfather Anders first
// hands her a broom. Dream up an invention, then list the small skills to learn first,
// and print it as a blueprint card with a box to draw the invention.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

type Help = 'planet' | 'animals' | 'family' | 'school' | 'play' | 'town';
type Material = 'wood' | 'metal' | 'gears' | 'wheels' | 'string' | 'solar' | 'paper' | 'recycled';
const HELPS: { id: Help; icon: string }[] = [
  { id: 'planet', icon: '🌍' }, { id: 'animals', icon: '🐾' }, { id: 'family', icon: '🏡' },
  { id: 'school', icon: '🏫' }, { id: 'play', icon: '🪁' }, { id: 'town', icon: '🏘️' },
];
const MATERIALS: { id: Material; icon: string }[] = [
  { id: 'wood', icon: '🪵' }, { id: 'metal', icon: '🔩' }, { id: 'gears', icon: '⚙️' }, { id: 'wheels', icon: '🛞' },
  { id: 'string', icon: '🧶' }, { id: 'solar', icon: '☀️' }, { id: 'paper', icon: '📄' }, { id: 'recycled', icon: '♻️' },
];
const MAX_MATERIALS = 3;

const TRANSLATIONS = {
  en: {
    skill: 'Design thinking and patience', title: 'Inventor’s Blueprint', subtitle: 'Dream up an invention, then plan the small skills that come first.', grownup: 'Ask how it works',
    intro: 'Heidi dreams of solar cars, wind-turbine bridges and a small robot to clean the lake. What would you invent?',
    step1: 'Dream it', name: 'My invention is called', namePh: 'The Lake Helper 3000', helpsQ: 'What does it help?', matsQ: 'What is it made of? Pick up to 3.',
    helps: { planet: 'The planet', animals: 'Animals', family: 'My family', school: 'School', play: 'Play', town: 'My town' },
    mats: { wood: 'Wood', metal: 'Metal', gears: 'Gears', wheels: 'Wheels', string: 'String', solar: 'Solar panel', paper: 'Paper', recycled: 'Recycled bits' },
    matsCount: (n: number) => `${n} of ${MAX_MATERIALS} materials picked.`, matsFull: `You already picked ${MAX_MATERIALS}. Tap one to take it off first.`,
    step2: 'The first cubes', step2Intro: 'Heidi expected gears and tools, but Grandpa Anders handed her a broom. She swept, sorted parts, watched and asked. Mira’s first task was a thousand plain cubes. Big inventions start with small skills. Which three would you learn first?',
    skillLabel: (n: number) => `Skill ${n}`, skillPh: ['measure carefully', 'saw a straight line', 'test and try again'],
    cardLabel: 'Printable inventor’s blueprint', blueprint: 'Blueprint', unnamed: 'My invention', helpsLabel: 'It helps:', madeOf: 'Made of:', draw: 'Draw your invention here', before: 'Before I build:', blank: '________',
  },
  es: {
    skill: 'Diseño y paciencia', title: 'El plano del inventor', subtitle: 'Imagina un invento y planea las pequeñas habilidades que vienen primero.', grownup: 'Preguntar cómo funciona',
    intro: 'Heidi sueña con coches solares, puentes con turbinas de viento y un pequeño robot para limpiar el lago. ¿Qué inventarías tú?',
    step1: 'Imagínalo', name: 'Mi invento se llama', namePh: 'El Ayudante del Lago 3000', helpsQ: '¿A qué ayuda?', matsQ: '¿De qué está hecho? Elige hasta 3.',
    helps: { planet: 'Al planeta', animals: 'A los animales', family: 'A mi familia', school: 'En la escuela', play: 'Para jugar', town: 'A mi pueblo' },
    mats: { wood: 'Madera', metal: 'Metal', gears: 'Engranajes', wheels: 'Ruedas', string: 'Cuerda', solar: 'Panel solar', paper: 'Papel', recycled: 'Piezas recicladas' },
    matsCount: (n: number) => `${n} de ${MAX_MATERIALS} materiales elegidos.`, matsFull: `Ya elegiste ${MAX_MATERIALS}. Toca uno para quitarlo primero.`,
    step2: 'Los primeros cubos', step2Intro: 'Heidi esperaba engranajes y herramientas, pero el abuelo Anders le dio una escoba. Barrió, clasificó piezas, observó y preguntó. La primera tarea de Mira fueron mil cubos simples. Los grandes inventos empiezan con pequeñas habilidades. ¿Cuáles tres aprenderías primero?',
    skillLabel: (n: number) => `Habilidad ${n}`, skillPh: ['medir con cuidado', 'serrar en línea recta', 'probar y volver a intentar'],
    cardLabel: 'Plano del inventor imprimible', blueprint: 'Plano', unnamed: 'Mi invento', helpsLabel: 'Ayuda:', madeOf: 'Hecho de:', draw: 'Dibuja tu invento aquí', before: 'Antes de construir:', blank: '________',
  },
  fr: {
    skill: 'Conception et patience', title: 'Le plan de l’inventeur', subtitle: 'Imagine une invention, puis prévois les petits savoir-faire à apprendre d’abord.', grownup: 'Demander comment ça marche',
    intro: 'Heidi rêve de voitures solaires, de ponts à éoliennes et d’un petit robot pour nettoyer le lac. Et toi, qu’inventerais-tu ?',
    step1: 'Imagine-la', name: 'Mon invention s’appelle', namePh: 'L’Aide-Lac 3000', helpsQ: 'À quoi sert-elle ?', matsQ: 'En quoi est-elle faite ? Choisis-en 3 au plus.',
    helps: { planet: 'La planète', animals: 'Les animaux', family: 'Ma famille', school: 'L’école', play: 'Le jeu', town: 'Ma ville' },
    mats: { wood: 'Bois', metal: 'Métal', gears: 'Engrenages', wheels: 'Roues', string: 'Ficelle', solar: 'Panneau solaire', paper: 'Papier', recycled: 'Objets recyclés' },
    matsCount: (n: number) => `${n} matériau${n > 1 ? 'x' : ''} sur ${MAX_MATERIALS}.`, matsFull: `Tu en as déjà choisi ${MAX_MATERIALS}. Touches-en un pour l’enlever d’abord.`,
    step2: 'Les premiers cubes', step2Intro: 'Heidi s’attendait à des engrenages et à des outils, mais grand-père Anders lui a tendu un balai. Elle a balayé, trié les pièces, observé et posé des questions. La première tâche de Mira, c’était mille cubes tout simples. Les grandes inventions commencent par de petits savoir-faire. Lesquels apprendrais-tu en premier ?',
    skillLabel: (n: number) => `Savoir-faire ${n}`, skillPh: ['mesurer avec soin', 'scier bien droit', 'tester et réessayer'],
    cardLabel: 'Plan de l’inventeur à imprimer', blueprint: 'Plan', unnamed: 'Mon invention', helpsLabel: 'Elle aide :', madeOf: 'Faite de :', draw: 'Dessine ton invention ici', before: 'Avant de construire :', blank: '________',
  },
};

const GRID = 'bg-blue-800 text-white bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-size-[20px_20px] '
  + 'print:bg-white print:text-blue-950 print:bg-[linear-gradient(#bfdbfe_1px,transparent_1px),linear-gradient(90deg,#bfdbfe_1px,transparent_1px)] print:[print-color-adjust:exact]';

export default function InventorBlueprintDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [name, setName] = useState('');
  const [help, setHelp] = useState<Help | null>(null);
  const [mats, setMats] = useState<Material[]>([]);
  const [skills, setSkills] = useState(['', '', '']);
  const [full, setFull] = useState(false);

  const toggleMat = (m: Material) => {
    if (mats.includes(m)) { setMats(mats.filter((x) => x !== m)); setFull(false); return; }
    if (mats.length >= MAX_MATERIALS) { setFull(true); return; }
    setMats([...mats, m]);
    setFull(false);
  };
  const reset = () => { setName(''); setHelp(null); setMats([]); setSkills(['', '', '']); setFull(false); };
  const helpItem = HELPS.find((h) => h.id === help);

  return (
    <StudioFrame emoji="📐" hue="blue" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="5-9" minutes={15} bookIds={['heidis-journey-to-mastery']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 content-start">
          <Panel>
            <StepLabel n="01">{t.step1}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
            <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-gray-700 mb-2">{t.helpsQ}</legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {HELPS.map((h) => (
                  <Choice key={h.id} selected={help === h.id} onSelect={() => setHelp(help === h.id ? null : h.id)} className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>{h.icon}</span><span className="text-sm font-semibold">{t.helps[h.id]}</span>
                  </Choice>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-gray-700 mb-2">{t.matsQ}</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MATERIALS.map((m) => (
                  <Choice key={m.id} selected={mats.includes(m.id)} onSelect={() => toggleMat(m.id)} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-2xl" aria-hidden>{m.icon}</span><span className="text-xs font-semibold">{t.mats[m.id]}</span>
                    {mats.includes(m.id) && <span className="text-xs text-purple-700" aria-hidden>✓</span>}
                  </Choice>
                ))}
              </div>
              <p role="status" className="mt-2 text-xs text-gray-600">{full ? t.matsFull : t.matsCount(mats.length)}</p>
            </fieldset>
          </Panel>
          <Panel>
            <StepLabel n="02">{t.step2}</StepLabel>
            <p className="text-sm text-gray-600 mb-4">{t.step2Intro}</p>
            <div className="grid gap-3">
              {skills.map((s, i) => (
                <LineInput key={i} label={t.skillLabel(i + 1)} value={s} placeholder={t.skillPh[i]} onChange={(v) => setSkills(skills.map((x, j) => (j === i ? v : x)))} />
              ))}
            </div>
          </Panel>
        </div>
        <Printable label={t.cardLabel} className="self-start">
          <div className={`rounded-xl p-5 font-mono ${GRID}`}>
            <p className="text-xs uppercase tracking-[0.3em] opacity-80">{t.blueprint}</p>
            <p className="text-2xl font-bold mt-1 break-words">{name.trim() || t.unnamed}</p>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex flex-wrap gap-2"><dt className="font-bold uppercase">{t.helpsLabel}</dt><dd>{helpItem ? `${helpItem.icon} ${t.helps[helpItem.id]}` : t.blank}</dd></div>
              <div className="flex flex-wrap gap-2"><dt className="font-bold uppercase">{t.madeOf}</dt><dd>{mats.length ? mats.map((m) => `${MATERIALS.find((x) => x.id === m)?.icon ?? ''} ${t.mats[m]}`).join(', ') : t.blank}</dd></div>
            </dl>
            <div className="mt-4 h-48 rounded-lg border-2 border-dashed border-white/80 print:border-blue-400 grid place-items-center text-sm opacity-90">{t.draw}</div>
            <p className="mt-4 text-sm font-bold uppercase">{t.before}</p>
            <ol className="mt-1 grid gap-1 text-sm">
              {skills.map((s, i) => (
                <li key={i} className="flex gap-2"><span className="font-bold">{i + 1}.</span><span className="flex-1 border-b border-white/60 print:border-blue-300">{s.trim() || ' '}</span></li>
              ))}
            </ol>
          </div>
          <StudioActions onReset={reset} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
