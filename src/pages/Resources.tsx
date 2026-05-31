import { useState } from 'react';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

// ---------------------------------------------------------------------------
// Affiliate URLs — single source of truth. Keep in sync with
// outputs/social_media_infra/trackers/00_master_tracker.xlsx → Affiliate_Links.
// All Amazon links carry the storytimewi20-20 tracking ID.
// ---------------------------------------------------------------------------
const AFFILIATE = {
  // AF-001 — SMARTERIOR Bedside Table Lamp for Kids
  readingLamp: 'https://www.amazon.com/dp/B0FMJRR92L?tag=storytimewi20-20',
  // AF-002 — MAXYOYO 3-in-1 Kids Bean Bag Chair Couch
  floorCushion: 'https://www.amazon.com/dp/B0DNZJ2W9C?tag=storytimewi20-20',
  // AF-003 — Chuiendi 4-Tier Montessori Front-Facing Bookshelf
  bookshelf: 'https://www.amazon.com/dp/B0GJLKWVKJ?tag=storytimewi20-20',
  // AF-004 — Rory's Story Cubes Classic (Box) — image-only dice, language-agnostic
  storyCubes: 'https://www.amazon.com/dp/B07P3MB9H8?tag=storytimewi20-20',
  // AF-005 — SFOUR Astronaut Galaxy Projector
  galaxyProjector: 'https://www.amazon.com/dp/B09Q2WL7C6?tag=storytimewi20-20',
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AffiliatePart = { href: string; text: string };
type BodyPart = string | AffiliatePart;
type Section = { title: string; body: BodyPart[] };
type SkipList = { title: string; items: { lead: string; rest: string }[] };

// ---------------------------------------------------------------------------
// Reusable affiliate link component — enforces rel="sponsored noopener" +
// target="_blank" + small "(affiliate)" badge for FTC clarity.
// ---------------------------------------------------------------------------
function AffiliateLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="text-amber-700 hover:text-amber-900 underline decoration-amber-300 hover:decoration-amber-700 underline-offset-2 font-medium"
    >
      {children}
      <span className="ml-1 text-xs text-amber-600/70">(affiliate)</span>
    </a>
  );
}

function renderBody(parts: BodyPart[]) {
  return parts.map((p, i) =>
    typeof p === 'string'
      ? <span key={i}>{p}</span>
      : <AffiliateLink key={i} href={p.href}>{p.text}</AffiliateLink>
  );
}

// ---------------------------------------------------------------------------
// TRANSLATIONS
// Note: brand voice is warm, multilingual, parent-to-parent, lightly poetic.
// Translations are adapted (not literal) so each language reads as if Eva
// wrote it in that language directly.
// ---------------------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    seoTitle: 'Parent Resources',
    seoDesc: 'Reading tips, child-development milestones, and activity ideas for parents and teachers. Helping you make every reading session magical.',
    heading: 'Parent Resources & Guides',
    subheading: 'Expert tips, activities, and strategies to make reading time magical',
    searchPlaceholder: 'Search resources...',
    popular: 'Popular',
    readArticle: 'Read article ↓',
    emptyMsg: 'No resources found. Try a different search!',
    minRead: 'min read',
    categories: {
      all: 'All Resources',
      readingTips: 'Reading Tips',
      activityIdeas: 'Activity Ideas',
      childDev: 'Child Development',
      engagement: 'Building Engagement',
    },
    disclosure: {
      heading: 'A note on affiliate links',
      body: 'This page contains affiliate links. If you purchase through these links I may earn a small commission at no extra cost to you. I only recommend products I genuinely use and trust.',
      amazon: 'As an Amazon Associate I earn from qualifying purchases.',
    },
    resources: [
      { title: '10 Ways to Make Reading Time Magical', desc: 'Transform ordinary reading sessions into memorable adventures your child will love.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Age-Appropriate Reading Milestones', desc: "What to expect at each stage and how to support your child's literacy journey.", minutes: 8 },
      { title: '5 Creative Follow-Up Activities After Reading', desc: 'Extend the learning and fun beyond the last page with these engaging activities.', minutes: 6 },
      { title: 'Building a Love for Reading in Reluctant Readers', desc: 'Practical strategies to help children who resist reading discover the joy of books.', minutes: 7 },
      { title: 'Creating the Perfect Reading Environment', desc: 'Design a space that makes your child excited to pick up a book.', minutes: 4, anchor: 'perfect-reading-environment' },
      { title: 'The Science of Reading: What Parents Need to Know', desc: 'Understanding how children learn to read can help you support them better.', minutes: 10 },
    ],
    article1: {
      eyebrow: 'Reading Tips · 5 min read',
      title: '10 Ways to Make Reading Time Magical',
      intro: 'Transform ordinary reading sessions into memorable adventures your child will look forward to every single day.',
      sections: [
        { title: '1. Set the mood — light matters more than you think', body: [
          'Bedtime reading hits different when the overhead light is off and a soft, warm glow surrounds the book. We use a clip-on kids’ reading lamp that gives off just enough light for the words without the overstimulation of a ceiling fixture. Our pick: ',
          { href: AFFILIATE.readingLamp, text: 'this dimmable bedside lamp' },
          '.',
        ] },
        { title: '2. Build a reading rhythm, not a reading rule', body: [
          'Kids resist rules; they lean into rhythms. Pair reading time with something sensory — a particular blanket, a specific tea for you, the same playlist on low. After two weeks the cue alone makes them reach for a book.',
        ] },
        { title: '3. Pair the story with hands-on play', body: [
          'Reading about animals? Pull out finger puppets. About space? Cardboard rockets. The point isn’t a Pinterest-perfect craft, it’s the bridge from page to body. After the last page, we keep a tin of ',
          { href: AFFILIATE.storyCubes, text: 'story cubes' },
          ' on the shelf. Nine dice with images instead of words, so the kids invent the sequel together in whichever language they feel like that night.',
        ] },
        { title: '4. Let them turn the pages — even when they get it wrong', body: [
          'Control is the gateway to engagement. A three-year-old turning two pages at once still chose to be there. Don’t correct it. Just keep reading.',
        ] },
        { title: '5. Voice acting is allowed', body: [
          'If you’ve never been a grandmother witch with a stuffy nose, this is your moment. Kids will quote you back to themselves for weeks.',
        ] },
        { title: '6. Read the same book until you can’t stand it', body: [
          'Repetition is how fluency develops. The book you’ve read 47 times is the one teaching them most. Keep going.',
        ] },
        { title: '7. Bring in a second language casually', body: [
          'Even if you’re not fluent, swap a single word per page. “Look at the perro.” Then “The perro is sleeping.” Children absorb the second language as part of the story, not as a lesson.',
        ] },
        { title: '8. Pause for predictions', body: [
          'Halfway through, ask: “What do you think will happen?” Then go back to reading. Comprehension goes up by roughly 30% on the next read-through when kids have already guessed once.',
        ] },
        { title: '9. Build the nook', body: [
          'A reading nook is a vote of confidence — a small space that says “this matters here.” Start with a ',
          { href: AFFILIATE.floorCushion, text: 'convertible floor cushion' },
          ' and a ',
          { href: AFFILIATE.bookshelf, text: 'front-facing Montessori bookshelf' },
          ' so they can see the covers. That’s the whole setup.',
        ] },
        { title: '10. Be the reader your child sees most', body: [
          'Children read more if they live with someone who reads. Twenty minutes of you on the couch with your own book does more for their literacy than any printable.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Reading Tips · 4 min read',
      title: 'Creating the Perfect Reading Environment',
      intro: 'Design a space that makes your child reach for a book without being asked. This isn’t about Pinterest-perfect rooms. It’s about three deliberate choices.',
      choices: [
        { title: 'Choice 1 — Comfort that says “stay a while”', body: [
          'Forget structured chairs. Kids read longer when they’re slouching, side-lying, or upside-down on something soft. A washable floor cushion is the workhorse here. Our pick: ',
          { href: AFFILIATE.floorCushion, text: 'this 3-in-1 convertible kids’ bean bag couch' },
          '. Machine-washable, big enough that two kids can pile on without an elbow war.',
        ] },
        { title: 'Choice 2 — Book covers, not book spines', body: [
          'Traditional bookshelves hide picture-book covers and turn reading into a search problem. A forward-facing Montessori-style bookshelf shows four to six books at a time. Rotate them weekly. Kids pick up books they see, not books they have to dig for. Our pick: ',
          { href: AFFILIATE.bookshelf, text: 'this 4-tier wooden front-facing bookshelf' },
          '.',
        ] },
        { title: 'Choice 3 — Light that signals “reading”', body: [
          'Lighting is the most underrated piece. We use ',
          { href: AFFILIATE.readingLamp, text: 'a warm dimmable lamp' },
          ' that we only turn on for reading. After a few weeks, the click of the lamp is itself the bedtime cue. The lamp goes on, the body settles.',
        ] },
        { title: 'Choice 4 — On special nights, turn the ceiling into the sky', body: [
          'We keep this one for the books that deserve an event. Maya’s Shadow, anything moon-related, the rare second-read request. Plug in ',
          { href: AFFILIATE.galaxyProjector, text: 'a star projector' },
          ', kill the lamps, and the ceiling becomes a slow-drifting galaxy. The remote lets you match the brightness to the mood. Eight nebula effects, timer included, so it switches off after they’ve fallen asleep mid-page.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Three things to skip',
        items: [
          { lead: 'A theme.', rest: 'Nautical, jungle, princess — kids outgrow themes faster than the paint dries.' },
          { lead: 'A screen anywhere in sight.', rest: 'Even an off iPad on a side table is a competitor. Move it.' },
          { lead: 'Background music with lyrics.', rest: 'Instrumental only. Lyrics fight with the story for the same processing channel.' },
        ],
      } satisfies SkipList,
    },
  },
  es: {
    seoTitle: 'Recursos para padres',
    seoDesc: 'Consejos de lectura, hitos del desarrollo infantil e ideas de actividades para padres y docentes. Para hacer cada sesión de lectura mágica.',
    heading: 'Recursos y guías para padres',
    subheading: 'Consejos de expertos, actividades y estrategias para que el tiempo de lectura sea mágico',
    searchPlaceholder: 'Buscar recursos...',
    popular: 'Popular',
    readArticle: 'Leer el artículo ↓',
    emptyMsg: 'No se encontraron recursos. ¡Prueba otra búsqueda!',
    minRead: 'min de lectura',
    categories: {
      all: 'Todos los recursos',
      readingTips: 'Consejos de lectura',
      activityIdeas: 'Ideas de actividades',
      childDev: 'Desarrollo infantil',
      engagement: 'Fomentar el interés',
    },
    disclosure: {
      heading: 'Sobre los enlaces de afiliados',
      body: 'Esta página contiene enlaces de afiliados. Si compras a través de ellos, podemos ganar una pequeña comisión sin coste adicional para ti. Solo recomendamos productos que de verdad usamos y nos gustan.',
      amazon: 'Como afiliados de Amazon, ganamos con compras que cumplen los requisitos.',
    },
    resources: [
      { title: '10 formas de hacer mágico el tiempo de lectura', desc: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque adorará.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Hitos de lectura por edades', desc: 'Qué esperar en cada etapa y cómo apoyar el camino lector de tu peque.', minutes: 8 },
      { title: '5 actividades creativas para después de leer', desc: 'Alarga la diversión y el aprendizaje más allá de la última página con estas actividades.', minutes: 6 },
      { title: 'Cultivar el amor por la lectura en lectores reticentes', desc: 'Estrategias prácticas para que los niños que se resisten descubran el placer de los libros.', minutes: 7 },
      { title: 'Crear el ambiente perfecto para leer', desc: 'Diseña un espacio que invite a tu peque a coger un libro con ganas.', minutes: 4, anchor: 'perfect-reading-environment' },
      { title: 'La ciencia de la lectura: lo que los padres deben saber', desc: 'Entender cómo aprenden a leer los niños te ayudará a apoyarles mejor.', minutes: 10 },
    ],
    article1: {
      eyebrow: 'Consejos de lectura · 5 min de lectura',
      title: '10 formas de hacer mágico el tiempo de lectura',
      intro: 'Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque esperará con ilusión cada día.',
      sections: [
        { title: '1. Crea el ambiente — la luz importa más de lo que crees', body: [
          'La lectura a la hora de dormir cambia cuando se apaga la luz del techo y un resplandor cálido y suave envuelve el libro. Usamos una lámpara infantil con pinza que da la luz justa para las palabras, sin la sobrecarga de la luz cenital. Nuestra elección: ',
          { href: AFFILIATE.readingLamp, text: 'esta lámpara de mesilla regulable' },
          '.',
        ] },
        { title: '2. Crea un ritmo de lectura, no una regla de lectura', body: [
          'Los niños se resisten a las reglas; se inclinan a los rituales. Empareja el tiempo de lectura con algo sensorial: una manta concreta, un té específico para ti, la misma playlist a volumen bajo. A las dos semanas, la señal sola basta para que cojan un libro.',
        ] },
        { title: '3. Une la historia con juego sensorial', body: [
          '¿Leen sobre animales? Saca marionetas de dedo. ¿Sobre el espacio? Cohetes de cartón. No se trata de una manualidad perfecta de Pinterest, se trata del puente entre la página y el cuerpo. Cuando termina el cuento, guardamos una caja de ',
          { href: AFFILIATE.storyCubes, text: 'cubos de cuentos' },
          ' en la estantería. Nueve dados con imágenes en vez de palabras, para que los peques inventen la continuación juntos en el idioma que les apetezca esa noche.',
        ] },
        { title: '4. Déjales pasar las páginas — incluso cuando se equivocan', body: [
          'El control es la puerta de entrada al interés. Un peque de tres años que pasa dos páginas a la vez igualmente eligió estar ahí. No corrijas. Sigue leyendo.',
        ] },
        { title: '5. Las voces de personajes están permitidas', body: [
          'Si nunca has sido una abuela bruja con la nariz tapada, este es tu momento. Los niños te imitarán durante semanas.',
        ] },
        { title: '6. Lee el mismo libro hasta que no lo soportes', body: [
          'La repetición es como se desarrolla la fluidez. El libro que has leído 47 veces es el que más les está enseñando. Sigue.',
        ] },
        { title: '7. Introduce un segundo idioma con naturalidad', body: [
          'Aunque no domines el idioma, cambia una sola palabra por página. “Look at the perro.” Luego “The perro is sleeping.” Los niños absorben el segundo idioma como parte de la historia, no como una lección.',
        ] },
        { title: '8. Pausa para predecir', body: [
          'A mitad del cuento, pregunta: “¿Qué crees que pasará?” Luego sigue leyendo. La comprensión sube alrededor de un 30% en la siguiente lectura cuando los niños ya han hecho una conjetura.',
        ] },
        { title: '9. Construye el rincón', body: [
          'Un rincón de lectura es un voto de confianza — un pequeño espacio que dice “esto importa aquí.” Empieza con un ',
          { href: AFFILIATE.floorCushion, text: 'cojín de suelo convertible' },
          ' y una ',
          { href: AFFILIATE.bookshelf, text: 'estantería Montessori de frente' },
          ' para que vean las portadas. Esa es toda la instalación.',
        ] },
        { title: '10. Sé el lector que tu peque más ve', body: [
          'Los niños leen más si conviven con alguien que lee. Veinte minutos tuyos en el sofá con tu propio libro hacen más por su alfabetización que cualquier imprimible.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Consejos de lectura · 4 min de lectura',
      title: 'Crear el ambiente perfecto para leer',
      intro: 'Diseña un espacio que invite a tu peque a coger un libro sin que se lo pidas. No se trata de habitaciones perfectas de Pinterest. Se trata de tres decisiones deliberadas.',
      choices: [
        { title: 'Decisión 1 — Comodidad que dice “quédate un rato”', body: [
          'Olvida las sillas rígidas. Los peques leen más tiempo cuando están desparramados, de lado o boca abajo sobre algo blando. Un cojín de suelo lavable es el caballo de batalla aquí. Nuestra elección: ',
          { href: AFFILIATE.floorCushion, text: 'este sofá puff 3-en-1 para niños' },
          '. Lavable a máquina, lo bastante grande para que dos peques se amontonen sin guerra de codos.',
        ] },
        { title: 'Decisión 2 — Portadas de libros, no lomos', body: [
          'Las estanterías tradicionales esconden las portadas de los álbumes ilustrados y convierten la lectura en un problema de búsqueda. Una estantería Montessori de frente muestra entre cuatro y seis libros a la vez. Rotalos cada semana. Los niños cogen los libros que ven, no los que tienen que rebuscar. Nuestra elección: ',
          { href: AFFILIATE.bookshelf, text: 'esta estantería de madera de 4 niveles, libros de frente' },
          '.',
        ] },
        { title: 'Decisión 3 — Una luz que dice “lectura”', body: [
          'La iluminación es la pieza más infravalorada. Usamos ',
          { href: AFFILIATE.readingLamp, text: 'una lámpara cálida regulable' },
          ' que solo encendemos para leer. A las pocas semanas, el clic de la lámpara es la señal de la hora de dormir. La lámpara se enciende, el cuerpo se calma.',
        ] },
        { title: 'Decisión 4 — En noches especiales, convierte el techo en un cielo', body: [
          'Esta la reservamos para los libros que merecen ceremonia. Maya’s Shadow, cualquier historia de luna, la rara petición de “otra vez seguido.” Enchufa ',
          { href: AFFILIATE.galaxyProjector, text: 'un proyector de estrellas' },
          ', apaga las lámparas, y el techo se convierte en una galaxia que se mueve despacio. El mando permite ajustar el brillo al ánimo. Ocho efectos de nebulosa, temporizador incluido, así se apaga cuando ya se han dormido a mitad de página.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Tres cosas que evitar',
        items: [
          { lead: 'Una temática.', rest: 'Marinera, selva, princesa — los peques superan las temáticas antes de que se seque la pintura.' },
          { lead: 'Una pantalla a la vista.', rest: 'Incluso un iPad apagado en la mesilla es competencia. Muévelo.' },
          { lead: 'Música de fondo con letra.', rest: 'Solo instrumental. La letra pelea con la historia por el mismo canal.' },
        ],
      } satisfies SkipList,
    },
  },
  fr: {
    seoTitle: 'Ressources pour parents',
    seoDesc: 'Conseils de lecture, étapes du développement de l’enfant et idées d’activités pour les parents et enseignants. Pour rendre chaque séance de lecture magique.',
    heading: 'Ressources et guides pour parents',
    subheading: 'Conseils d’experts, activités et stratégies pour rendre le temps de lecture magique',
    searchPlaceholder: 'Rechercher des ressources...',
    popular: 'Populaire',
    readArticle: 'Lire l’article ↓',
    emptyMsg: 'Aucune ressource trouvée. Essayez une autre recherche !',
    minRead: 'min de lecture',
    categories: {
      all: 'Toutes les ressources',
      readingTips: 'Conseils de lecture',
      activityIdeas: 'Idées d’activités',
      childDev: 'Développement de l’enfant',
      engagement: 'Susciter l’intérêt',
    },
    disclosure: {
      heading: 'À propos des liens affiliés',
      body: 'Cette page contient des liens affiliés. Si vous achetez via ces liens, nous pouvons gagner une petite commission sans coût supplémentaire pour vous. Nous ne recommandons que des produits que nous utilisons réellement.',
      amazon: 'En tant qu’affilié Amazon, nous percevons une commission sur les achats éligibles.',
    },
    resources: [
      { title: '10 façons de rendre le temps de lecture magique', desc: 'Transformez les séances de lecture ordinaires en aventures inoubliables que votre enfant adorera.', minutes: 5, anchor: 'making-reading-magical' },
      { title: 'Les étapes de lecture selon l’âge', desc: 'À quoi s’attendre à chaque étape et comment soutenir le parcours de lecture de votre enfant.', minutes: 8 },
      { title: '5 activités créatives à faire après la lecture', desc: 'Prolongez l’apprentissage et le plaisir au-delà de la dernière page avec ces activités.', minutes: 6 },
      { title: 'Faire aimer la lecture aux lecteurs réticents', desc: 'Stratégies concrètes pour aider les enfants qui résistent à découvrir le plaisir des livres.', minutes: 7 },
      { title: 'Créer l’environnement de lecture idéal', desc: 'Aménagez un espace qui donne envie à votre enfant de prendre un livre.', minutes: 4, anchor: 'perfect-reading-environment' },
      { title: 'La science de la lecture : ce que les parents doivent savoir', desc: 'Comprendre comment les enfants apprennent à lire vous aidera à mieux les accompagner.', minutes: 10 },
    ],
    article1: {
      eyebrow: 'Conseils de lecture · 5 min de lecture',
      title: '10 façons de rendre le temps de lecture magique',
      intro: 'Transformez les séances de lecture ordinaires en aventures inoubliables que votre enfant attendra avec impatience chaque jour.',
      sections: [
        { title: '1. Préparez l’ambiance — la lumière compte plus que vous ne le pensez', body: [
          'La lecture du soir change quand la lumière du plafond s’éteint et qu’une lueur douce et chaude entoure le livre. Nous utilisons une lampe pince pour enfants qui éclaire juste assez les mots, sans la surcharge d’une suspension. Notre choix : ',
          { href: AFFILIATE.readingLamp, text: 'cette lampe de chevet à intensité réglable' },
          '.',
        ] },
        { title: '2. Créez un rythme de lecture, pas une règle de lecture', body: [
          'Les enfants résistent aux règles ; ils adoptent les rituels. Associez la lecture à quelque chose de sensoriel — une couverture précise, une tisane particulière pour vous, la même playlist en sourdine. Au bout de deux semaines, le signal seul suffit à leur faire ouvrir un livre.',
        ] },
        { title: '3. Associez l’histoire à un jeu manuel', body: [
          'Vous lisez une histoire d’animaux ? Sortez les marionnettes à doigts. De l’espace ? Des fusées en carton. Le but n’est pas un bricolage parfait pour Pinterest, c’est le pont entre la page et le corps. Après la dernière page, nous gardons une boîte de ',
          { href: AFFILIATE.storyCubes, text: 'dés à histoires' },
          ' sur l’étagère. Neuf dés avec des images au lieu de mots, pour que les enfants inventent la suite ensemble dans la langue qu’ils choisissent ce soir-là.',
        ] },
        { title: '4. Laissez-les tourner les pages — même quand ils se trompent', body: [
          'Le contrôle est la porte d’entrée de l’engagement. Un enfant de trois ans qui tourne deux pages d’un coup a quand même choisi d’être là. Ne corrigez pas. Continuez à lire.',
        ] },
        { title: '5. Le doublage est autorisé', body: [
          'Si vous n’avez jamais joué une grand-mère sorcière enrhumée, c’est le moment. Les enfants vous reciteront vos voix pendant des semaines.',
        ] },
        { title: '6. Lisez le même livre jusqu’à n’en plus pouvoir', body: [
          'C’est par la répétition que la fluidité se construit. Le livre que vous avez lu 47 fois est celui qui leur apprend le plus. Continuez.',
        ] },
        { title: '7. Glissez une seconde langue, l’air de rien', body: [
          'Même si vous ne parlez pas couramment, remplacez un mot par page. « Look at the perro. » Puis « The perro is sleeping. » Les enfants intègrent la deuxième langue comme une partie de l’histoire, pas comme une leçon.',
        ] },
        { title: '8. Faites une pause pour prédire', body: [
          'À mi-parcours, demandez : « À ton avis, qu’est-ce qui va se passer ? » Puis reprenez la lecture. La compréhension grimpe d’environ 30 % à la relecture quand les enfants ont déjà fait une hypothèse.',
        ] },
        { title: '9. Aménagez le coin lecture', body: [
          'Un coin lecture est un vote de confiance — un petit espace qui dit « ça compte ici ». Commencez avec un ',
          { href: AFFILIATE.floorCushion, text: 'coussin de sol convertible' },
          ' et une ',
          { href: AFFILIATE.bookshelf, text: 'étagère Montessori frontale' },
          ' pour qu’ils voient les couvertures. C’est toute l’installation.',
        ] },
        { title: '10. Soyez le lecteur que votre enfant voit le plus', body: [
          'Les enfants lisent davantage s’ils vivent avec quelqu’un qui lit. Vingt minutes de vous sur le canapé avec votre propre livre font plus pour leur lecture que tous les imprimables réunis.',
        ] },
      ] satisfies Section[],
    },
    article2: {
      eyebrow: 'Conseils de lecture · 4 min de lecture',
      title: 'Créer l’environnement de lecture idéal',
      intro: 'Aménagez un espace qui donne à votre enfant l’envie de prendre un livre sans qu’on le lui demande. Il ne s’agit pas de chambres parfaites pour Pinterest. Il s’agit de trois choix réfléchis.',
      choices: [
        { title: 'Choix 1 — Un confort qui dit « reste un moment »', body: [
          'Oubliez les chaises rigides. Les enfants lisent plus longtemps quand ils sont avachis, sur le côté ou la tête en bas sur quelque chose de doux. Un coussin de sol lavable est la pièce maîtresse. Notre choix : ',
          { href: AFFILIATE.floorCushion, text: 'ce pouf-canapé 3-en-1 pour enfants' },
          '. Lavable en machine, assez grand pour que deux enfants s’y entassent sans guerre de coudes.',
        ] },
        { title: 'Choix 2 — Couvertures, pas dos de livres', body: [
          'Les bibliothèques classiques cachent les couvertures des albums et transforment la lecture en problème de recherche. Une étagère Montessori frontale montre quatre à six livres à la fois. Faites-les tourner chaque semaine. Les enfants prennent les livres qu’ils voient, pas ceux qu’ils doivent fouiller. Notre choix : ',
          { href: AFFILIATE.bookshelf, text: 'cette étagère en bois 4 niveaux, livres de face' },
          '.',
        ] },
        { title: 'Choix 3 — Une lumière qui dit « lecture »', body: [
          'L’éclairage est l’élément le plus sous-estimé. Nous utilisons ',
          { href: AFFILIATE.readingLamp, text: 'une lampe chaude à intensité réglable' },
          ' que nous n’allumons que pour la lecture. Au bout de quelques semaines, le clic de la lampe devient le signal du coucher. La lampe s’allume, le corps se pose.',
        ] },
        { title: 'Choix 4 — Les soirs spéciaux, transformez le plafond en ciel', body: [
          'Nous gardons celui-ci pour les livres qui méritent une cérémonie. Maya’s Shadow, toute histoire de lune, la rare demande de relecture immédiate. Branchez ',
          { href: AFFILIATE.galaxyProjector, text: 'un projecteur d’étoiles' },
          ', éteignez les lampes, et le plafond devient une galaxie qui dérive doucement. La télécommande permet d’ajuster la luminosité à l’humeur. Huit effets de nébuleuse, minuterie incluse, donc il s’éteint quand ils se sont endormis en pleine page.',
        ] },
      ] satisfies Section[],
      skip: {
        title: 'Trois choses à éviter',
        items: [
          { lead: 'Un thème.', rest: 'Marin, jungle, princesse — les enfants en sortent plus vite que la peinture ne sèche.' },
          { lead: 'Un écran en vue.', rest: 'Même un iPad éteint sur une commode est un concurrent. Déplacez-le.' },
          { lead: 'De la musique avec paroles.', rest: 'Instrumental uniquement. Les paroles se battent avec l’histoire pour le même canal de traitement.' },
        ],
      } satisfies SkipList,
    },
  },
};

const RESOURCE_META = [
  { emoji: '✨', categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: true },
  { emoji: '📊', categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: true },
  { emoji: '🎨', categoryKey: 'activityIdeas', categoryColor: 'bg-orange-100 text-orange-700', popular: false },
  { emoji: '💪', categoryKey: 'engagement', categoryColor: 'bg-pink-100 text-pink-700', popular: false },
  { emoji: '🏠', categoryKey: 'readingTips', categoryColor: 'bg-blue-100 text-blue-700', popular: false },
  { emoji: '🧠', categoryKey: 'childDev', categoryColor: 'bg-green-100 text-green-700', popular: false },
] as const;

type CategoryKey = 'all' | 'readingTips' | 'activityIdeas' | 'childDev' | 'engagement';

// ---------------------------------------------------------------------------
// Article components — data-driven from translations.
// ---------------------------------------------------------------------------
type Article1T = (typeof TRANSLATIONS)['en']['article1'];
type Article2T = (typeof TRANSLATIONS)['en']['article2'];

function ArticleMakingReadingMagical({ t }: { t: Article1T }) {
  return (
    <article id="making-reading-magical" className="scroll-mt-24 max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">{t.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">{t.title}</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{t.intro}</p>
      </header>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        {t.sections.map((s, i) => (
          <section key={i}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h3>
            <p>{renderBody(s.body)}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

function ArticlePerfectReadingEnvironment({ t }: { t: Article2T }) {
  return (
    <article id="perfect-reading-environment" className="scroll-mt-24 max-w-3xl mx-auto px-4 py-12 border-t border-gray-100">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">{t.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">{t.title}</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{t.intro}</p>
      </header>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        {t.choices.map((s, i) => (
          <section key={i}>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h3>
            <p>{renderBody(s.body)}</p>
          </section>
        ))}

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t.skip.title}</h3>
          <ul className="list-disc pl-6 space-y-2">
            {t.skip.items.map((item, i) => (
              <li key={i}><strong>{item.lead}</strong> {item.rest}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [search, setSearch] = useState('');
  const t = useTranslation(TRANSLATIONS);

  const categoryButtons: { key: CategoryKey; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'readingTips', label: t.categories.readingTips },
    { key: 'activityIdeas', label: t.categories.activityIdeas },
    { key: 'childDev', label: t.categories.childDev },
    { key: 'engagement', label: t.categories.engagement },
  ];

  // Combine static meta with localized content.
  const merged = t.resources.map((r, i) => ({
    ...RESOURCE_META[i],
    ...r,
  }));

  const filtered = merged.filter(r => {
    const matchesCat = activeCategory === 'all' || r.categoryKey === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/resources" />

      <section className="bg-gradient-to-b from-blue-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      {/* FTC affiliate disclosure — placed prominently above all content. */}
      <section className="bg-amber-50 border-y border-amber-200 px-4 py-4">
        <div className="max-w-3xl mx-auto text-sm text-amber-900">
          <p className="font-semibold mb-1">{t.disclosure.heading}</p>
          <p className="leading-relaxed">{t.disclosure.body}</p>
          <p className="leading-relaxed mt-1 italic">{t.disclosure.amazon}</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="relative max-w-sm mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoryButtons.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => {
              const card = (
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-50 group h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{r.emoji}</span>
                    {r.popular && (
                      <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{t.popular}</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mb-3 inline-block ${r.categoryColor}`}>
                    {t.categories[r.categoryKey]}
                  </span>
                  <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-700 transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{r.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      ⏱ {r.minutes} {t.minRead}
                    </span>
                    {('anchor' in r && r.anchor) && (
                      <span className="text-xs text-amber-700 font-medium group-hover:text-amber-900">
                        {t.readArticle}
                      </span>
                    )}
                  </div>
                </div>
              );

              return 'anchor' in r && r.anchor ? (
                <a key={i} href={`#${r.anchor}`} className="block">
                  {card}
                </a>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-gray-500 text-lg">{t.emptyMsg}</p>
            </div>
          )}
        </div>
      </section>

      {/* Full articles — now trilingual (EN/ES/FR), data-driven from translations. */}
      <ArticleMakingReadingMagical t={t.article1} />
      <ArticlePerfectReadingEnvironment t={t.article2} />

      <EmailSignup />
    </main>
  );
}
