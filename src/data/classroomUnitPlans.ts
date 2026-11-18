// Five-day plans for the classroom units (activities audit 2026-11, §5c item 5). BROWSER-FREE.
//
// Split from ./classroomUnits.ts on purpose: the signup form (EmailSignup, in the entry bundle)
// builds each unit's gated pack from the unit RECORDS, while only the unit page needs the 25
// days of teacher notes in three languages and the books' story words. Keeping them here keeps
// the entry bundle small (performance budget: 125 KB gzip warn).
//
// Every step is a reference, resolved at render time: a book to read (no activityId) or an
// activity opened in that book's mode (?book=<id>). unitPlanProblems() validates every step
// against the live registries; tests/funnel/classroom-units.test.mjs and the content inventory
// gate run it, so a published unit can never point at a missing activity or one that would not
// open in book mode. Teacher notes say nothing about a book beyond its catalog description.

import { bookVocab, type VocabWord } from './bookVocab.data';
import { activities } from './activities.data';
import { books } from './books.data';
import type { Language } from '../lib/language';
import { LANGUAGES } from '../lib/locales';
import { classroomUnits, isSharedTool, opensInBookMode, type ClassroomUnit, type UnitStep } from './classroomUnits';

type LocalizedText = Record<Language, string>;

export interface UnitDay {
  /** One to three steps, in order. */
  steps: UnitStep[];
  /** A short teacher note, plain and warm. */
  note: LocalizedText;
}

export const unitPlans: Record<string, UnitDay[]> = {
  'unit-kindness': [
      {
        steps: [{ bookId: 'sparrow-saved-forest' }],
        note: {
          en: 'Read aloud, then use the three discussion prompts below. Ask the class who noticed the forest was in trouble, and why the smallest one did.',
          es: 'Lean en voz alta y usen las tres preguntas de abajo. Pregunta a la clase quién se dio cuenta de que el bosque estaba en peligro, y por qué fue el más pequeño.',
          fr: 'Lisez à voix haute, puis utilisez les trois questions ci-dessous. Demandez à la classe qui a remarqué que la forêt était en danger, et pourquoi c’est le plus petit.',
        },
      },
      {
        steps: [{ bookId: 'sparrow-saved-forest', activityId: 'small-noticer' }],
        note: {
          en: 'Find the three small things the big animals walked past, then each child picks a tiny kind act for home or school. Print the card to take home.',
          es: 'Encuentren las tres cosas pequeñas que los animales grandes pasaron de largo; luego cada niño o niña elige un gesto amable pequeñito para casa o la escuela. Impriman la tarjeta para llevar a casa.',
          fr: 'Trouvez les trois petites choses devant lesquelles les grands animaux sont passés, puis chaque enfant choisit un tout petit geste gentil pour la maison ou l’école. Imprimez la carte à rapporter.',
        },
      },
      {
        steps: [{ bookId: 'butterfly-effect' }, { bookId: 'butterfly-effect', activityId: 'kindness-chain' }],
        note: {
          en: 'Read aloud and pause each time the kindness reaches a new person. Then follow one kind act from person to person in Kindness Chain and print the paper-chain strips for the classroom wall.',
          es: 'Lean en voz alta y hagan una pausa cada vez que la bondad llega a una persona nueva. Luego sigan un gesto amable de persona en persona en La cadena de la bondad e impriman las tiras de la cadena de papel para la pared del aula.',
          fr: 'Lisez à voix haute et arrêtez-vous chaque fois que la gentillesse atteint une nouvelle personne. Puis suivez un geste gentil de personne en personne dans La chaîne de gentillesse et imprimez les bandes de la guirlande pour le mur de la classe.',
        },
      },
      {
        steps: [{ bookId: 'true-beauty-meadowbrook' }, { bookId: 'true-beauty-meadowbrook', activityId: 'kindness-mirror' }],
        note: {
          en: 'Read aloud and ask what the quiet girl does differently from everyone else. Then make compliment cards in The Kindness Mirror and hand them out in class.',
          es: 'Lean en voz alta y pregunten qué hace la niña tranquila de forma distinta a los demás. Luego hagan tarjetas de cumplidos en El espejo de la bondad y repártanlas en clase.',
          fr: 'Lisez à voix haute et demandez ce que la fille discrète fait différemment des autres. Puis fabriquez des cartes de compliments dans Le miroir de la gentillesse et distribuez-les en classe.',
        },
      },
      {
        steps: [
          { bookId: 'butterfly-effect', activityId: 'story-worksheet' },
          { bookId: 'sparrow-saved-forest', activityId: 'pixel-quiz' },
          { bookId: 'true-beauty-meadowbrook', activityId: 'bilingual-flashcards' },
        ],
        note: {
          en: 'Review day. Print the story worksheet for The Butterfly Effect, let the youngest take Pixel’s picture quiz on the sparrow, and warm up with the story-word flashcards in English, Spanish and French.',
          es: 'Día de repaso. Impriman la ficha de El efecto mariposa, dejen que los más pequeños hagan el quiz con dibujos de Pixel sobre el gorrión y calienten con las tarjetas de palabras en español, inglés y francés.',
          fr: 'Jour de révision. Imprimez la fiche de lecture de L’effet papillon, laissez les plus petits faire le quiz en images de Pixel sur le moineau, et échauffez-vous avec les cartes de mots en français, anglais et espagnol.',
        },
      },
  ],
  'unit-patience': [
      {
        steps: [{ bookId: 'sanding-block' }],
        note: {
          en: 'Read aloud. Pause when the grandfather hands over the sanding block and ask why. Afterwards, each child names one thing they are slowly getting better at.',
          es: 'Lean en voz alta. Hagan una pausa cuando el abuelo entrega el bloque de lijar y pregunten por qué. Después, cada niño o niña nombra algo en lo que está mejorando poco a poco.',
          fr: 'Lisez à voix haute. Arrêtez-vous quand le grand-père tend le bloc à poncer et demandez pourquoi. Ensuite, chaque enfant nomme une chose dans laquelle il ou elle progresse petit à petit.',
        },
      },
      {
        steps: [{ bookId: 'sanding-block', activityId: 'rough-to-smooth' }],
        note: {
          en: 'Sand the rough plank one stroke at a time, then choose a skill to grow and print the seven-day practice card. Keep the cards for Friday.',
          es: 'Lijen la tabla áspera pasada a pasada, luego elijan una habilidad para mejorar e impriman la tarjeta de práctica de siete días. Guarden las tarjetas para el viernes.',
          fr: 'Poncez la planche rugueuse coup par coup, puis choisissez une compétence à faire grandir et imprimez la carte d’entraînement de sept jours. Gardez les cartes pour vendredi.',
        },
      },
      {
        steps: [{ bookId: 'heidis-journey-to-mastery' }, { bookId: 'heidis-journey-to-mastery', activityId: 'inventor-blueprint' }],
        note: {
          en: 'Read aloud and ask whether a broom instead of tools seems fair. Then design an invention in Inventor’s Blueprint and list the first small skills to learn before building it.',
          es: 'Lean en voz alta y pregunten si una escoba en lugar de herramientas les parece justo. Luego diseñen un invento en El plano del inventor y anoten las primeras habilidades pequeñas que habría que aprender antes de construirlo.',
          fr: 'Lisez à voix haute et demandez si un balai à la place des outils semble juste. Puis concevez une invention dans Le plan de l’inventeur et listez les premières petites compétences à apprendre avant de la construire.',
        },
      },
      {
        steps: [{ bookId: 'miras-thousand-cubes' }, { bookId: 'miras-thousand-cubes', activityId: 'thousand-cubes-challenge' }],
        note: {
          en: 'Read aloud and ask what the cubes are teaching Mira. Then each child picks something to practise and starts a 30-day chart, one cube a day.',
          es: 'Lean en voz alta y pregunten qué le enseñan los cubos a Mira. Luego cada niño o niña elige algo que practicar y empieza una tabla de 30 días, un cubo al día.',
          fr: 'Lisez à voix haute et demandez ce que les cubes apprennent à Mira. Puis chaque enfant choisit quelque chose à pratiquer et commence un tableau de 30 jours, un cube par jour.',
        },
      },
      {
        steps: [{ bookId: 'heidis-journey-to-mastery', activityId: 'patient-maker-passport' }, { bookId: 'sanding-block', activityId: 'story-worksheet' }],
        note: {
          en: 'Finish with The Patient Maker Passport: break a goal into small practice steps and earn the certificate. The story worksheet for The Sanding Block makes a quiet review.',
          es: 'Terminen con El pasaporte del creador paciente: dividan una meta en pasos pequeños de práctica y ganen el certificado. La ficha de El bloque de lijar sirve como repaso tranquilo.',
          fr: 'Terminez avec Le passeport du fabricant patient : découpez un objectif en petites étapes d’entraînement et obtenez le certificat. La fiche de lecture du Bloc à poncer fait une révision tranquille.',
        },
      },
  ],
  'unit-courage': [
      {
        steps: [{ bookId: 'diegos-brave-leap' }],
        note: {
          en: 'Read aloud. Ask how Diego’s tummy feels at the edge, and what helps the children when they feel scared.',
          es: 'Lean en voz alta. Pregunten cómo siente Diego la barriga al borde del acantilado, y qué les ayuda a ellos cuando tienen miedo.',
          fr: 'Lisez à voix haute. Demandez ce que Diego ressent dans son ventre au bord de la falaise, et ce qui aide les enfants quand ils ont peur.',
        },
      },
      {
        steps: [{ bookId: 'diegos-brave-leap', activityId: 'first-day-brave-plan' }],
        note: {
          en: 'Each child maps one worry, one helper, one brave step and one celebration. The printout carries a conversation prompt for the grown-up at home.',
          es: 'Cada niño o niña anota una preocupación, una persona que ayuda, un paso valiente y una celebración. La hoja impresa incluye una pregunta para conversar con el adulto en casa.',
          fr: 'Chaque enfant note une inquiétude, une personne qui aide, un pas courageux et une célébration. La feuille imprimée contient une question pour l’adulte à la maison.',
        },
      },
      {
        steps: [{ bookId: 'diegos-brave-leap', activityId: 'brave-breathing' }],
        note: {
          en: 'A one-minute wave breathing break for fluttery moments, with a pocket card to print. Try it before anything the class finds hard this week.',
          es: 'Una pausa de un minuto de respiración en olas para los momentos de nervios, con una tarjeta de bolsillo para imprimir. Pruébenla antes de algo que la clase encuentre difícil esta semana.',
          fr: 'Une pause respiration en vagues d’une minute pour les moments de trac, avec une carte de poche à imprimer. Essayez-la avant quelque chose que la classe trouve difficile cette semaine.',
        },
      },
      {
        steps: [{ bookId: 'leo-and-the-wolf' }, { bookId: 'leo-and-the-wolf', activityId: 'trust-meter' }],
        note: {
          en: 'Read aloud and pause before the third shout: will the villagers come? Then make Leo’s choices in The Trust Meter and watch trust fall fast and come back slowly.',
          es: 'Lean en voz alta y hagan una pausa antes del tercer grito: ¿vendrán los aldeanos? Luego tomen las decisiones de Leo en El medidor de confianza y vean cómo la confianza baja rápido y vuelve despacio.',
          fr: 'Lisez à voix haute et arrêtez-vous avant le troisième cri : les villageois viendront-ils ? Puis faites les choix de Léo dans Le baromètre de la confiance et regardez la confiance tomber vite et revenir lentement.',
        },
      },
      {
        steps: [{ bookId: 'leo-and-the-wolf', activityId: 'leo-and-the-wolf-worksheet' }, { bookId: 'diegos-brave-leap', activityId: 'pixel-quiz' }],
        note: {
          en: 'Review day. Leo’s two-page story worksheet for the readers, and Pixel’s picture quiz on Diego for the children who do not read yet.',
          es: 'Día de repaso. La ficha de dos páginas de Leo para quienes ya leen, y el quiz con dibujos de Pixel sobre Diego para quienes aún no leen.',
          fr: 'Jour de révision. La fiche de lecture de deux pages de Léo pour les lecteurs, et le quiz en images de Pixel sur Diego pour les enfants qui ne lisent pas encore.',
        },
      },
  ],
  'unit-feelings': [
      {
        steps: [{ bookId: 'pawa-rainbow-cloud' }],
        note: {
          en: 'Read aloud. Ask what might help Cirro, and whether his tears really only make a mess.',
          es: 'Lean en voz alta. Pregunten qué podría ayudar a Cirro, y si de verdad sus lágrimas solo ensucian.',
          fr: 'Lisez à voix haute. Demandez ce qui pourrait aider Cirro, et si ses larmes ne font vraiment que du désordre.',
        },
      },
      {
        steps: [{ bookId: 'pawa-rainbow-cloud', activityId: 'feelings-weather-report' }],
        note: {
          en: 'Each child chooses a weather icon for today’s feeling and one caring next step, then prints the report card to take home.',
          es: 'Cada niño o niña elige un icono del tiempo para cómo se siente hoy y un pequeño paso para cuidarse, y luego imprime la tarjeta para llevar a casa.',
          fr: 'Chaque enfant choisit une icône météo pour son sentiment du jour et un petit geste pour prendre soin de soi, puis imprime la carte à rapporter.',
        },
      },
      {
        steps: [{ bookId: 'pawa-rainbow-cloud', activityId: 'emotion-wheel' }],
        note: {
          en: 'Open the feelings wheel from Cirro’s story: how did Cirro feel, and when? Then the children spin it for their own feelings and talk about them together.',
          es: 'Abran la rueda de las emociones desde el cuento de Cirro: ¿cómo se sentía Cirro, y cuándo? Luego cada niño o niña la gira para sus propias emociones y hablan de ellas juntos.',
          fr: 'Ouvrez la roue des émotions depuis l’histoire de Cirro : comment Cirro se sentait-il, et quand ? Puis les enfants la font tourner pour leurs propres émotions et en parlent ensemble.',
        },
      },
      {
        steps: [{ bookId: 'crooked-little-apple-tree' }, { bookId: 'crooked-little-apple-tree', activityId: 'one-of-a-kind-tree' }],
        note: {
          en: 'Read aloud and ask what people missed when they walked past the tree for years. Then each child grows a one-of-a-kind tree, crooked counts, and prints it for a class orchard wall.',
          es: 'Lean en voz alta y pregunten qué se perdieron las personas que pasaron de largo durante años. Luego cada niño o niña crea un árbol único, torcido también vale, y lo imprime para un huerto en la pared del aula.',
          fr: 'Lisez à voix haute et demandez ce que les gens ont manqué en passant devant l’arbre pendant des années. Puis chaque enfant fait pousser un arbre unique, tordu compris, et l’imprime pour un verger sur le mur de la classe.',
        },
      },
      {
        steps: [{ bookId: 'pawa-rainbow-cloud', activityId: 'pixel-quiz' }, { bookId: 'crooked-little-apple-tree', activityId: 'story-worksheet' }],
        note: {
          en: 'Review day. Pixel’s picture quiz on Cirro for the youngest, and the story worksheet for The Crooked Little Apple Tree for the readers.',
          es: 'Día de repaso. El quiz con dibujos de Pixel sobre Cirro para los más pequeños, y la ficha de El pequeño manzano torcido para quienes ya leen.',
          fr: 'Jour de révision. Le quiz en images de Pixel sur Cirro pour les plus petits, et la fiche de lecture du Petit pommier tordu pour les lecteurs.',
        },
      },
  ],
  'unit-curiosity': [
      {
        steps: [{ bookId: 'cloud-collector' }],
        note: {
          en: 'Read aloud, then look out of the window together: what shape is the sky making right now? Ask whether Luna can really keep a cloud in a jar.',
          es: 'Lean en voz alta y luego miren juntos por la ventana: ¿qué forma tiene el cielo ahora mismo? Pregunten si Luna de verdad puede guardar una nube en un frasco.',
          fr: 'Lisez à voix haute, puis regardez ensemble par la fenêtre : quelle forme le ciel dessine-t-il en ce moment ? Demandez si Luna peut vraiment garder un nuage dans un bocal.',
        },
      },
      {
        steps: [{ bookId: 'cloud-collector', activityId: 'cloud-detective-journal' }],
        note: {
          en: 'Observe the sky, match a cloud type, make a forecast and collect five weather words in three languages. Check the forecast tomorrow morning.',
          es: 'Observen el cielo, identifiquen un tipo de nube, hagan un pronóstico y recojan cinco palabras del tiempo en tres idiomas. Comprueben el pronóstico mañana por la mañana.',
          fr: 'Observez le ciel, reconnaissez un type de nuage, faites une prévision et collectez cinq mots de météo en trois langues. Vérifiez la prévision demain matin.',
        },
      },
      {
        steps: [{ bookId: 'little-mapmaker' }, { bookId: 'little-mapmaker', activityId: 'map-my-world' }],
        note: {
          en: 'Read aloud and ask what the children would put on a map of their home. Then draw a map of the classroom with stamps and a legend, and hide a castle for a grown-up to find.',
          es: 'Lean en voz alta y pregunten qué pondrían en un mapa de su casa. Luego dibujen un mapa del aula con sellos y una leyenda, y escondan un castillo para que lo encuentre un adulto.',
          fr: 'Lisez à voix haute et demandez ce que les enfants mettraient sur une carte de leur maison. Puis dessinez une carte de la classe avec des tampons et une légende, et cachez un château qu’un adulte devra trouver.',
        },
      },
      {
        steps: [{ bookId: 'colors-mixed-up' }, { bookId: 'colors-mixed-up', activityId: 'color-mix-lab' }],
        note: {
          en: 'Read aloud and ask which two colors the class would mix first. Then predict, mix and print the color recipe card in the Mix-It Lab.',
          es: 'Lean en voz alta y pregunten qué dos colores mezclaría la clase primero. Luego predigan, mezclen e impriman la receta de colores en el laboratorio de mezclas.',
          fr: 'Lisez à voix haute et demandez quelles deux couleurs la classe mélangerait d’abord. Puis prédisez, mélangez et imprimez la recette de couleurs dans le labo des mélanges.',
        },
      },
      {
        steps: [{ bookId: 'cloud-collector', activityId: 'bilingual-flashcards' }, { bookId: 'little-mapmaker', activityId: 'story-worksheet' }],
        note: {
          en: 'Review day. The story-word flashcards for The Cloud Collector in English, Spanish and French, and the story worksheet for The Little Mapmaker.',
          es: 'Día de repaso. Las tarjetas con las palabras de La coleccionista de nubes en español, inglés y francés, y la ficha de La pequeña cartógrafa.',
          fr: 'Jour de révision. Les cartes de mots de La collectionneuse de nuages en français, anglais et espagnol, et la fiche de lecture de La petite cartographe.',
        },
      },
  ],
};

/** The unit's five-day plan (empty for an unknown unit). */
export const unitDays = (unitId: string): UnitDay[] => unitPlans[unitId] ?? [];

/** The unit's story words: every book's eight words, in unit order. */
export function unitVocab(unit: ClassroomUnit): { bookId: string; words: VocabWord[] }[] {
  return unit.bookIds.map((bookId) => ({ bookId, words: bookVocab[bookId] ?? [] }));
}

const activityBySlug = new Map(activities.map((a) => [a.slug, a]));
const bookById = new Map(books.map((b) => [b.id, b]));

/** Every reason a unit's PLAN may not publish. Empty = valid. */
export function unitPlanProblems(u: ClassroomUnit): string[] {
  const out: string[] = [];
  const days = unitPlans[u.id];
  if (!days) return [`${u.id}: no five-day plan`];
  if (days.length !== 5) out.push(`${u.id}: a unit is a five-day plan (${days.length} days)`);
  days.forEach((d, i) => {
    if (d.steps.length < 1 || d.steps.length > 3) out.push(`${u.id}: day ${i + 1} has ${d.steps.length} steps (1 to 3)`);
    for (const s of d.steps) {
      if (!u.bookIds.includes(s.bookId)) out.push(`${u.id}: day ${i + 1} uses "${s.bookId}", not a unit book`);
      if (s.activityId) {
        const a = activityBySlug.get(s.activityId);
        if (!a) out.push(`${u.id}: day ${i + 1} uses missing activity "${s.activityId}"`);
        else if (!opensInBookMode(s.activityId, s.bookId)) out.push(`${u.id}: day ${i + 1}: "${s.activityId}" would not open in "${s.bookId}" mode`);
        else if (!isSharedTool(s.activityId, s.bookId) && !u.activityIds.includes(s.activityId)) out.push(`${u.id}: day ${i + 1}: Studio activity "${s.activityId}" is not listed in activityIds`);
      }
    }
    for (const l of LANGUAGES) if (!d.note[l]?.trim()) out.push(`${u.id}: day ${i + 1} note missing ${l}`);
    if (d.note.en.includes('—')) out.push(`${u.id}: day ${i + 1}: em dash in English note`);
  });
  for (const id of u.bookIds) {
    if (!days.some((d) => d.steps.some((s) => s.bookId === id && !s.activityId))) out.push(`${u.id}: "${id}" is never read in the plan`);
    if ((bookVocab[id] ?? []).length < 8) out.push(`${u.id}: book "${id}" has no story words`);
    if (!bookById.has(id)) out.push(`${u.id}: book "${id}" does not exist`);
  }
  for (const slug of u.activityIds) if (!days.some((d) => d.steps.some((s) => s.activityId === slug))) out.push(`${u.id}: Studio activity "${slug}" is listed but never used in the plan`);
  for (const id of Object.keys(unitPlans)) if (!classroomUnits.some((x) => x.id === id)) out.push(`plan for unknown unit "${id}"`);
  return out;
}
