// The Trust Meter (Activity Studio). Pairs with Leo and the Wolf: Leo, a new shepherd,
// gets bored and shouts "WOLF!" for fun. A short branching story where each honest or
// tricky choice moves a trust meter, then a take-home honesty promise card.
// Trust breaks quickly (two steps down) and rebuilds slowly (one step up).
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StepLabel, StudioActions, Choice, LineInput } from './studio/StudioFrame';

const MAX = 5;
type Pick = 'honest' | 'tricky';

const TRANSLATIONS = {
  en: {
    open: '“', close: '”',
    skill: 'Honesty, cause and effect', title: 'The Trust Meter', subtitle: 'Make Leo’s choices and watch how trust breaks and grows.', grownup: 'Talk about the choices',
    intro: 'Leo loves his first real job as a shepherd. But the hours get long… What should Leo do? Choose, then watch the trust meter.',
    meter: 'Trust meter', level: (n: number) => `The villagers’ trust: ${n} out of ${MAX}.`,
    scenes: [
      { title: 'A long afternoon', text: 'The sheep munch the grass. The sun is warm. Leo feels bored, and a small mischief slips into his face.', honest: 'Count the sheep and keep watch', tricky: 'Shout “WOLF! WOLF!” just for fun' },
      { title: 'Up the hill', textAfterTrick: 'The villagers come running up the hill, out of breath, and find nothing. “Where is the wolf?” they ask.', textAfterHonest: 'A villager walks up the hill. “All quiet, Leo? Did you see anything?”', honest: 'Tell the truth: “There is no wolf. I’m sorry.”', tricky: 'Make something up: “It ran away!”' },
      { title: 'The next day', text: 'The hours feel long again. Leo looks down at the village and the mischief tickles his nose.', honest: 'Sing to the sheep and keep watch', tricky: 'Shout “WOLF!” one more time' },
    ],
    honestDone: 'Honest choice. Trust grows back one small step. Slowly, slowly.', trickyDone: 'Tricky choice. Trust drops two steps, all at once.',
    next: 'Next', finalTitle: 'One evening…', finalText: 'Yellow eyes appear at the edge of the forest. A real wolf! Leo calls for help.',
    believed: 'The villagers trust Leo, so they come running together. The sheep stay close, and the wolf slips back into the forest.',
    doubted: 'The villagers think it is another trick, so nobody comes. Leo has to run to the village himself to fetch the grown-ups.',
    lesson: 'Trust breaks quickly and rebuilds slowly.', ask: 'Ask: how could Leo start earning trust back?', again: 'Play again',
    step2: 'My honesty promise', name: 'My name', namePh: 'Write your name', promise: 'One honest promise', promisePh: 'I promise to tell the truth when…',
    cardTitle: 'My honesty promise', finalLevel: 'My trust meter', cardLabel: 'Printable honesty promise card',
  },
  es: {
    open: '«', close: '»',
    skill: 'Honestidad, causa y efecto', title: 'El medidor de confianza', subtitle: 'Elige por Leo y mira cómo la confianza se rompe y vuelve a crecer.', grownup: 'Hablar de las decisiones',
    intro: 'Leo adora su primer trabajo de verdad como pastor. Pero las horas se hacen largas… ¿Qué debería hacer Leo? Elige y mira el medidor de confianza.',
    meter: 'Medidor de confianza', level: (n: number) => `La confianza de los aldeanos: ${n} de ${MAX}.`,
    scenes: [
      { title: 'Una tarde larga', text: 'Las ovejas comen hierba. El sol calienta. Leo se aburre, y una pequeña travesura le cruza la cara.', honest: 'Contar las ovejas y vigilar', tricky: 'Gritar «¡LOBO! ¡LOBO!» solo por diversión' },
      { title: 'Colina arriba', textAfterTrick: 'Los aldeanos suben corriendo la colina, sin aliento, y no encuentran nada. «¿Dónde está el lobo?», preguntan.', textAfterHonest: 'Un aldeano sube la colina. «¿Todo tranquilo, Leo? ¿Viste algo?»', honest: 'Decir la verdad: «No hay ningún lobo. Lo siento».', tricky: 'Inventar algo: «¡Se escapó!»' },
      { title: 'Al día siguiente', text: 'Las horas vuelven a hacerse largas. Leo mira el pueblo y la travesura le hace cosquillas en la nariz.', honest: 'Cantarles a las ovejas y vigilar', tricky: 'Gritar «¡LOBO!» otra vez' },
    ],
    honestDone: 'Decisión honesta. La confianza crece un pasito. Despacio, despacio.', trickyDone: 'Decisión tramposa. La confianza baja dos pasos de golpe.',
    next: 'Siguiente', finalTitle: 'Una tarde…', finalText: 'Unos ojos amarillos aparecen al borde del bosque. ¡Un lobo de verdad! Leo pide ayuda.',
    believed: 'Los aldeanos confían en Leo y vienen corriendo juntos. Las ovejas se quedan cerca y el lobo vuelve al bosque.',
    doubted: 'Los aldeanos creen que es otra broma y nadie viene. Leo tiene que correr él mismo al pueblo para buscar a los adultos.',
    lesson: 'La confianza se rompe rápido y se reconstruye despacio.', ask: 'Pregunta: ¿cómo podría Leo empezar a recuperar la confianza?', again: 'Jugar otra vez',
    step2: 'Mi promesa de honestidad', name: 'Mi nombre', namePh: 'Escribe tu nombre', promise: 'Una promesa honesta', promisePh: 'Prometo decir la verdad cuando…',
    cardTitle: 'Mi promesa de honestidad', finalLevel: 'Mi medidor de confianza', cardLabel: 'Tarjeta imprimible de promesa de honestidad',
  },
  fr: {
    open: '« ', close: ' »',
    skill: 'Honnêteté, cause et effet', title: 'Le baromètre de la confiance', subtitle: 'Fais les choix de Léo et regarde la confiance se casser et grandir.', grownup: 'Parler des choix',
    intro: 'Léo adore son premier vrai métier de berger. Mais les heures s’allongent… Que devrait faire Léo ? Choisis, puis regarde le baromètre.',
    meter: 'Baromètre de la confiance', level: (n: number) => `La confiance des villageois : ${n} sur ${MAX}.`,
    scenes: [
      { title: 'Un long après-midi', text: 'Les moutons broutent l’herbe. Le soleil est chaud. Léo s’ennuie, et une petite malice lui traverse le visage.', honest: 'Compter les moutons et surveiller', tricky: 'Crier « LOUP ! LOUP ! » pour rire' },
      { title: 'En haut de la colline', textAfterTrick: 'Les villageois accourent en haut de la colline, tout essoufflés, et ne trouvent rien. « Où est le loup ? » demandent-ils.', textAfterHonest: 'Un villageois monte la colline. « Tout est calme, Léo ? Tu as vu quelque chose ? »', honest: 'Dire la vérité : « Il n’y a pas de loup. Pardon. »', tricky: 'Inventer une histoire : « Il s’est enfui ! »' },
      { title: 'Le lendemain', text: 'Les heures s’allongent encore. Léo regarde le village et la malice lui chatouille le nez.', honest: 'Chanter pour les moutons et surveiller', tricky: 'Crier « LOUP ! » encore une fois' },
    ],
    honestDone: 'Choix honnête. La confiance remonte d’un petit pas. Doucement, doucement.', trickyDone: 'Choix rusé. La confiance chute de deux pas, d’un coup.',
    next: 'Suite', finalTitle: 'Un soir…', finalText: 'Des yeux jaunes apparaissent à la lisière de la forêt. Un vrai loup ! Léo appelle à l’aide.',
    believed: 'Les villageois font confiance à Léo, alors ils accourent tous ensemble. Les moutons restent groupés et le loup retourne dans la forêt.',
    doubted: 'Les villageois pensent que c’est encore une blague, alors personne ne vient. Léo doit courir lui-même au village pour chercher les adultes.',
    lesson: 'La confiance se casse vite et se reconstruit lentement.', ask: 'Demande : comment Léo pourrait-il commencer à regagner la confiance ?', again: 'Rejouer',
    step2: 'Ma promesse d’honnêteté', name: 'Mon nom', namePh: 'Écris ton nom', promise: 'Une promesse honnête', promisePh: 'Je promets de dire la vérité quand…',
    cardTitle: 'Ma promesse d’honnêteté', finalLevel: 'Mon baromètre de la confiance', cardLabel: 'Carte de promesse d’honnêteté à imprimer',
  },
};

function MeterBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: MAX }, (_, i) => (
        <span key={i} className={`h-4 flex-1 rounded-full border-2 ${i < level ? 'bg-orange-400 border-orange-500' : 'bg-white border-gray-300 border-dashed'} motion-safe:transition-colors`} />
      ))}
    </div>
  );
}

export default function TrustMeterDemo() {
  const t = useTranslation(TRANSLATIONS);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [answered, setAnswered] = useState<Pick | null>(null);
  const [name, setName] = useState('');
  const [promise, setPromise] = useState('');

  const all = answered ? [...picks, answered] : picks;
  const trust = all.reduce((n, p) => Math.max(0, Math.min(MAX, n + (p === 'honest' ? 1 : -2))), MAX);
  const sceneIndex = picks.length;
  const done = sceneIndex >= t.scenes.length;
  const scene = t.scenes[Math.min(sceneIndex, t.scenes.length - 1)];
  const sceneText = 'text' in scene ? scene.text : picks[0] === 'tricky' ? scene.textAfterTrick : scene.textAfterHonest;

  const next = () => { if (answered) { setPicks([...picks, answered]); setAnswered(null); } };
  const restart = () => { setPicks([]); setAnswered(null); };

  return (
    <StudioFrame emoji="🐑" hue="coral" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={12} bookIds={['leo-and-the-wolf']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <p className="text-sm text-gray-600 mb-4">{t.intro}</p>
          <div className="rounded-xl bg-white border border-orange-200 p-3 mb-4">
            <p className="text-sm font-bold text-gray-700 mb-2 flex justify-between"><span>{t.meter}</span><span className="font-mono">{trust} / {MAX}</span></p>
            <MeterBar level={trust} />
            <p role="status" className="mt-2 text-sm text-gray-700">{t.level(trust)}</p>
          </div>
          {!done ? (
            <div>
              <StepLabel n={`0${sceneIndex + 1}`}>{scene.title}</StepLabel>
              <p className="text-sm text-gray-700 mb-3">{sceneText}</p>
              <div className="grid gap-2">
                <Choice selected={answered === 'honest'} onSelect={() => !answered && setAnswered('honest')}>🙋 {scene.honest}</Choice>
                <Choice selected={answered === 'tricky'} onSelect={() => !answered && setAnswered('tricky')}>😜 {scene.tricky}</Choice>
              </div>
              {answered && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800">{answered === 'honest' ? t.honestDone : t.trickyDone}</p>
                  <button type="button" onClick={next} className="btn-primary mt-3">{t.next}</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <StepLabel n="04">{t.finalTitle}</StepLabel>
              <p className="text-sm text-gray-700 mb-2">{t.finalText}</p>
              <p className="text-sm font-semibold text-gray-800 mb-3">{trust >= 4 ? t.believed : t.doubted}</p>
              <p className="text-base font-bold text-orange-800">{t.open}{t.lesson}{t.close}</p>
              <p className="text-sm text-gray-600 mt-1">{t.ask}</p>
              <button type="button" onClick={restart} className="btn-primary mt-3">{t.again}</button>
            </div>
          )}
        </Panel>
        <Printable label={t.cardLabel}>
          <p className="text-sm font-bold text-gray-700 text-center mb-4">🐑 {t.cardTitle}</p>
          <div className="grid gap-3 print:hidden">
            <LineInput label={t.name} value={name} onChange={setName} placeholder={t.namePh} />
            <LineInput label={t.promise} value={promise} onChange={setPromise} placeholder={t.promisePh} multiline />
          </div>
          <div className="hidden print:block">
            <p className="text-lg font-bold text-gray-800">{name || '______________'}</p>
            <p className="text-gray-700 mt-2">{promise || t.promisePh}</p>
          </div>
          <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">{t.finalLevel}: <span className="font-mono">{trust} / {MAX}</span></p>
            <MeterBar level={trust} />
          </div>
          <p className="mt-4 text-sm italic text-gray-600 text-center">{t.open}{t.lesson}{t.close}</p>
          <StudioActions onReset={() => { restart(); setName(''); setPromise(''); }} />
        </Printable>
      </div>
    </StudioFrame>
  );
}
