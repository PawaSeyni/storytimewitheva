// Leo and the Wolf: the complete story worksheet (paper first). Pairs with Leo and the
// Wolf. Two printed pages for home or class: before-reading prediction, story words,
// story order, true or not true, feelings, honest or tricky, a think-and-write question,
// a drawing box and an honesty promise, plus an optional answer key for the grown-up.
// Every story fact comes from the book's catalog description; the ending is not given away.
// The free storybook PDF (/free/leo-and-the-wolf) is a separate offer and is not linked here.
import { useState } from 'react';
import { useTranslation } from '../lib/language';
import { StudioFrame, Panel, Printable, StudioActions, LineInput } from './studio/StudioFrame';
import { Lines, Section, Circle } from './studio/Worksheet';
import { nb, DERANGE } from './studio/worksheetText';

const TRANSLATIONS = {
  en: {
    skill: 'Reading comprehension and honesty', title: 'Leo and the Wolf: Story Worksheet', subtitle: 'A complete two-page worksheet to print, for before and after reading.', grownup: 'Read the questions aloud',
    setupHeading: 'Get the worksheet ready', setupIntro: 'Type a name and date to print them on the sheet, or leave them blank and write by hand. Read each question aloud for children who are not reading yet: they can answer by circling, drawing lines or drawing.',
    name: 'Name', date: 'Date', showKey: 'Add the answer key (for grown-ups)', hideKey: 'Remove the answer key',
    cardLabel: 'Leo and the Wolf story worksheet',
    sheetTitle: 'Leo and the Wolf', sheetSub: 'My story worksheet', nameLine: 'Name:', dateLine: 'Date:',
    s1: 'Before you read', s1q: 'Leo has a real job looking after the sheep. What do you think that job needs most?',
    s2: 'Story words', s2q: 'Draw a line from each word to its picture.',
    words: [['shepherd', '🧑‍🌾'], ['sheep', '🐑'], ['wolf', '🐺'], ['village', '🏘️'], ['forest', '🌲']],
    s3: 'Story order', s3q: 'Write 1, 2, 3 and 4 to put the story in order.',
    scenes: ['The villagers come running and find nothing.', 'Leo starts his first real job as a shepherd.', 'Yellow eyes appear at the edge of the forest.', 'Leo shouts “WOLF! WOLF!” just for fun.'],
    s4: 'True or not true?', s4q: 'Circle ✓ if it is true or ✗ if it is not true.',
    facts: ['Leo’s job is to look after the sheep.', 'The first time Leo shouts “Wolf!”, there is a real wolf.', 'The villagers come running when Leo shouts.', 'After Leo tricks them again, the villagers stop coming.', 'The wolf has blue eyes.'],
    s5: 'Feelings', s5q: 'The villagers ran up the hill and found no wolf. How do you think they felt? Circle one or more.',
    feelings: [['😠', 'cross'], ['😕', 'confused'], ['😮‍💨', 'tired'], ['😢', 'sad'], ['😐', 'fed up']],
    s6: 'Honest or tricky?', s6q: 'Circle H for honest or T for tricky.',
    choices: ['You spill the juice and say, “I did it. I’m sorry.”', 'You say your little brother broke the toy, but it was you.', 'You shout “Help!” as a joke when nothing is wrong.', 'You tell a grown-up when something really is wrong.'],
    s7: 'Think and write', s7q: 'Trust breaks quickly and rebuilds slowly. How could Leo start earning it back?',
    s8: 'Draw it', s8q: 'Draw Leo keeping watch over the sheep, doing his job well.',
    s9: 'My honesty promise', s9q: 'I promise to tell the truth, even when',
    signed: 'Signed:',
    keyTitle: 'Answer key for grown-ups', keyOrder: 'Story order: Leo starts his job (1), Leo shouts “Wolf!” for fun (2), the villagers find nothing (3), yellow eyes appear (4).', keyFacts: 'True or not true: ✓, ✗, ✓, ✓, ✗ (the eyes are yellow).', keyChoices: 'Honest or tricky: H, T, T, H.', keyOpen: 'Before reading, Feelings, Think and write and the drawing have no single right answer: talk about them together.',
  },
  es: {
    skill: 'Comprensión lectora y honestidad', title: 'Leo y el lobo: ficha del cuento', subtitle: 'Una ficha completa de dos páginas para imprimir, para antes y después de leer.', grownup: 'Leer las preguntas en voz alta',
    setupHeading: 'Prepara la ficha', setupIntro: 'Escribe un nombre y una fecha para imprimirlos en la ficha, o déjalos en blanco y escríbelos a mano. Lee cada pregunta en voz alta a quien todavía no lee: puede responder rodeando, uniendo con flechas o dibujando.',
    name: 'Nombre', date: 'Fecha', showKey: 'Añadir las respuestas (para adultos)', hideKey: 'Quitar las respuestas',
    cardLabel: 'Ficha del cuento Leo y el lobo',
    sheetTitle: 'Leo y el lobo', sheetSub: 'Mi ficha del cuento', nameLine: 'Nombre:', dateLine: 'Fecha:',
    s1: 'Antes de leer', s1q: 'Leo tiene un trabajo de verdad: cuidar las ovejas. ¿Qué crees que necesita más ese trabajo?',
    s2: 'Palabras del cuento', s2q: 'Une cada palabra con su dibujo.',
    words: [['pastor', '🧑‍🌾'], ['oveja', '🐑'], ['lobo', '🐺'], ['pueblo', '🏘️'], ['bosque', '🌲']],
    s3: 'El orden del cuento', s3q: 'Escribe 1, 2, 3 y 4 para ordenar el cuento.',
    scenes: ['Los aldeanos vienen corriendo y no encuentran nada.', 'Leo empieza su primer trabajo de verdad como pastor.', 'Unos ojos amarillos aparecen al borde del bosque.', 'Leo grita «¡LOBO! ¡LOBO!» solo para divertirse.'],
    s4: '¿Verdadero o falso?', s4q: 'Rodea ✓ si es verdadero o ✗ si es falso.',
    facts: ['El trabajo de Leo es cuidar las ovejas.', 'La primera vez que Leo grita «¡Lobo!», hay un lobo de verdad.', 'Los aldeanos vienen corriendo cuando Leo grita.', 'Cuando Leo los engaña otra vez, los aldeanos dejan de venir.', 'El lobo tiene los ojos azules.'],
    s5: 'Sentimientos', s5q: 'Los aldeanos subieron corriendo la colina y no encontraron ningún lobo. ¿Cómo crees que se sintieron? Rodea uno o más.',
    feelings: [['😠', 'enfadados'], ['😕', 'confundidos'], ['😮‍💨', 'cansados'], ['😢', 'tristes'], ['😐', 'hartos']],
    s6: '¿Honesto o tramposo?', s6q: 'Rodea H si es honesto o T si es tramposo.',
    choices: ['Derramas el jugo y dices: «Fui yo. Lo siento».', 'Dices que tu hermanito rompió el juguete, pero fuiste tú.', 'Gritas «¡Socorro!» de broma cuando no pasa nada.', 'Avisas a un adulto cuando de verdad pasa algo.'],
    s7: 'Piensa y escribe', s7q: 'La confianza se rompe rápido y se reconstruye despacio. ¿Cómo podría Leo empezar a recuperarla?',
    s8: 'Dibújalo', s8q: 'Dibuja a Leo vigilando las ovejas y haciendo bien su trabajo.',
    s9: 'Mi promesa de honestidad', s9q: 'Prometo decir la verdad, incluso cuando',
    signed: 'Firma:',
    keyTitle: 'Respuestas para adultos', keyOrder: 'Orden del cuento: Leo empieza su trabajo (1), Leo grita «¡Lobo!» para divertirse (2), los aldeanos no encuentran nada (3), aparecen unos ojos amarillos (4).', keyFacts: 'Verdadero o falso: ✓, ✗, ✓, ✓, ✗ (los ojos son amarillos).', keyChoices: 'Honesto o tramposo: H, T, T, H.', keyOpen: 'Antes de leer, Sentimientos, Piensa y escribe y el dibujo no tienen una única respuesta correcta: hablen de ellos juntos.',
  },
  fr: {
    skill: 'Compréhension et honnêteté', title: 'Léo et le loup : fiche de lecture', subtitle: 'Une fiche complète de deux pages à imprimer, pour avant et après la lecture.', grownup: 'Lire les questions à voix haute',
    setupHeading: 'Préparer la fiche', setupIntro: 'Tape un prénom et une date pour les imprimer sur la fiche, ou laisse vide et écris à la main. Lis chaque question à voix haute aux enfants qui ne lisent pas encore : ils peuvent répondre en entourant, en reliant ou en dessinant.',
    name: 'Prénom', date: 'Date', showKey: 'Ajouter le corrigé (pour les adultes)', hideKey: 'Retirer le corrigé',
    cardLabel: 'Fiche de lecture Léo et le loup',
    sheetTitle: 'Léo et le loup', sheetSub: 'Ma fiche de lecture', nameLine: 'Prénom :', dateLine: 'Date :',
    s1: 'Avant de lire', s1q: 'Léo a un vrai métier : garder les moutons. De quoi ce métier a-t-il le plus besoin, à ton avis ?',
    s2: 'Les mots de l’histoire', s2q: 'Relie chaque mot à son dessin.',
    words: [['berger', '🧑‍🌾'], ['mouton', '🐑'], ['loup', '🐺'], ['village', '🏘️'], ['forêt', '🌲']],
    s3: 'L’ordre de l’histoire', s3q: 'Écris 1, 2, 3 et 4 pour remettre l’histoire dans l’ordre.',
    scenes: ['Les villageois accourent et ne trouvent rien.', 'Léo commence son premier vrai métier de berger.', 'Des yeux jaunes apparaissent à la lisière de la forêt.', 'Léo crie « LOUP ! LOUP ! » juste pour rire.'],
    s4: 'Vrai ou faux ?', s4q: 'Entoure ✓ si c’est vrai ou ✗ si c’est faux.',
    facts: ['Le métier de Léo, c’est de garder les moutons.', 'La première fois que Léo crie « Loup ! », il y a un vrai loup.', 'Les villageois accourent quand Léo crie.', 'Quand Léo les trompe encore, les villageois ne viennent plus.', 'Le loup a les yeux bleus.'],
    s5: 'Les émotions', s5q: 'Les villageois ont grimpé la colline en courant et n’ont trouvé aucun loup. Comment se sentaient-ils, à ton avis ? Entoure une ou plusieurs réponses.',
    feelings: [['😠', 'fâchés'], ['😕', 'perdus'], ['😮‍💨', 'fatigués'], ['😢', 'tristes'], ['😐', 'agacés']],
    s6: 'Honnête ou tricheur ?', s6q: 'Entoure H pour honnête ou T pour tricheur.',
    choices: ['Tu renverses le jus et tu dis : « C’est moi. Pardon. »', 'Tu dis que ton petit frère a cassé le jouet, mais c’était toi.', 'Tu cries « Au secours ! » pour rire alors que tout va bien.', 'Tu préviens un adulte quand quelque chose ne va vraiment pas.'],
    s7: 'Réfléchis et écris', s7q: 'La confiance se casse vite et se reconstruit lentement. Comment Léo pourrait-il commencer à la regagner ?',
    s8: 'Dessine', s8q: 'Dessine Léo qui surveille les moutons et fait bien son métier.',
    s9: 'Ma promesse d’honnêteté', s9q: 'Je promets de dire la vérité, même quand',
    signed: 'Signé :',
    keyTitle: 'Corrigé pour les adultes', keyOrder: 'Ordre de l’histoire : Léo commence son métier (1), Léo crie « Loup ! » pour rire (2), les villageois ne trouvent rien (3), des yeux jaunes apparaissent (4).', keyFacts: 'Vrai ou faux : ✓, ✗, ✓, ✓, ✗ (les yeux sont jaunes).', keyChoices: 'Honnête ou tricheur : H, T, T, H.', keyOpen: 'Avant de lire, Les émotions, Réfléchis et écris et le dessin n’ont pas une seule bonne réponse : parlez-en ensemble.',
  },
};

/** Marks to circle: [true, not true] are symbols in every language, so English "T" stays free for "tricky". */
const MARKS = { en: { tf: ['✓', '✗'], hk: ['H', 'T'] }, es: { tf: ['✓', '✗'], hk: ['H', 'T'] }, fr: { tf: ['✓', '✗'], hk: ['H', 'T'] } };
/** Pictures in a different order from the words, so the matching is a real task. */
const PICTURE_ORDER = DERANGE[5];

export default function LeoWorksheetDemo() {
  const t = useTranslation(TRANSLATIONS);
  const marks = useTranslation(MARKS);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [key, setKey] = useState(false);

  return (
    <StudioFrame emoji="📝" hue="coral" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="4-8" minutes={30} bookIds={['leo-and-the-wolf']} grownup={t.grownup} printHero={false}>
      <Panel className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{t.setupHeading}</h3>
        <p className="text-sm text-gray-600 mb-4">{t.setupIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <LineInput label={t.name} value={name} onChange={setName} />
          <LineInput label={t.date} value={date} onChange={setDate} />
        </div>
        <button type="button" aria-pressed={key} onClick={() => setKey(!key)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-300 text-orange-800 text-sm font-semibold hover:bg-orange-50">
          {key ? t.hideKey : t.showKey}
        </button>
        <StudioActions />
      </Panel>

      <Printable label={t.cardLabel}>
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-gray-800 pb-3 mb-4 print:mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-700 print:text-black">{t.sheetSub}</p>
            <h3 className="text-2xl font-bold text-gray-900">🐑 {t.sheetTitle} 🐺</h3>
          </div>
          <div className="text-sm text-gray-800 grid gap-1 min-w-56">
            <p>{t.nameLine} <span className="inline-block min-w-40 border-b border-gray-500 font-semibold">{name || ' '}</span></p>
            <p>{t.dateLine} <span className="inline-block min-w-40 border-b border-gray-500 font-semibold">{date || ' '}</span></p>
          </div>
        </header>

        <div className="grid gap-4 print:gap-3 md:grid-cols-2 print:grid-cols-2">
          <Section n={1} title={t.s1} prompt={t.s1q} className="md:col-span-2 print:col-span-2"><Lines n={2} /></Section>

          <Section n={2} title={t.s2} prompt={t.s2q}>
            <div className="grid grid-cols-2 gap-x-10 gap-y-2">
              {t.words.map(([word], i) => {
                const pic = t.words[PICTURE_ORDER[i]][1];
                return (
                  <div key={word} className="contents">
                    <p className="flex items-center justify-between font-semibold text-gray-800">{word} <span aria-hidden className="w-2 h-2 rounded-full bg-gray-700" /></p>
                    <p className="flex items-center gap-3 text-2xl"><span aria-hidden className="w-2 h-2 rounded-full bg-gray-700" />{pic}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          <Section n={3} title={t.s3} prompt={t.s3q}>
            <ul className="grid gap-2">
              {t.scenes.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-gray-800">
                  <span aria-hidden className="w-8 h-8 shrink-0 rounded-md border-2 border-gray-500" />{nb(s)}
                </li>
              ))}
            </ul>
          </Section>

          <Section n={4} title={t.s4} prompt={t.s4q} className="md:col-span-2 print:col-span-2">
            <ul className="grid gap-2">
              {t.facts.map((f) => (
                <li key={f} className="flex items-center justify-between gap-3 text-sm text-gray-800">
                  <span>{nb(f)}</span><span className="flex gap-1 shrink-0"><Circle letter={marks.tf[0]} /><Circle letter={marks.tf[1]} /></span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n={5} title={t.s5} prompt={t.s5q}>
            <ul className="flex flex-wrap gap-3">
              {t.feelings.map(([emoji, label]) => (
                <li key={label} className="flex flex-col items-center rounded-xl border-2 border-gray-300 px-3 py-2 print:py-1 min-w-16">
                  <span aria-hidden className="text-3xl">{emoji}</span><span className="text-xs font-semibold text-gray-800">{label}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n={6} title={t.s6} prompt={t.s6q}>
            <ul className="grid gap-2">
              {t.choices.map((c) => (
                <li key={c} className="flex items-center justify-between gap-3 text-sm text-gray-800 rounded-lg border border-gray-200 px-3 py-2">
                  <span>{nb(c)}</span><span className="flex gap-1 shrink-0"><Circle letter={marks.hk[0]} /><Circle letter={marks.hk[1]} /></span>
                </li>
              ))}
            </ul>
          </Section>

          <Section n={7} title={t.s7} prompt={t.s7q}><Lines n={3} /></Section>

          <Section n={8} title={t.s8} prompt={t.s8q}><div aria-hidden className="h-44 print:h-32 rounded-lg border-2 border-dashed border-gray-400" /></Section>

          <Section n={9} title={t.s9} prompt={t.s9q} className="md:col-span-2 print:col-span-2">
            <Lines n={2} />
            <p className="mt-4 text-sm text-gray-800">{t.signed} <span className="inline-block min-w-48 border-b border-gray-500 font-semibold">{name || ' '}</span></p>
          </Section>
        </div>

        {key && (
          <aside className="mt-6 rounded-xl border-2 border-orange-300 bg-orange-50 p-4 text-sm text-gray-800 break-inside-avoid print:break-before-page print:bg-white print:border-gray-500">
            <h4 className="font-bold mb-2">{t.keyTitle}</h4>
            <p>{nb(t.keyOrder)}</p>
            <p className="mt-1">{nb(t.keyFacts)}</p>
            <p className="mt-1">{nb(t.keyChoices)}</p>
            <p className="mt-1 text-gray-600">{nb(t.keyOpen)}</p>
          </aside>
        )}
      </Printable>
    </StudioFrame>
  );
}
