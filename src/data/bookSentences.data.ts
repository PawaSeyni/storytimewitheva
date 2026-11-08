// Story sentences per book (activities audit 2026-11). BROWSER-FREE data.
// Three short sentences per book, in EN/ES/FR, built only from facts in the book's own
// description. Used by the Sentence Builder game in book mode (?book=<id>): the sentence is
// split on spaces into word tiles in the current language. Validated in
// tests/funnel/book-sentences.test.mjs.
import type { Language } from '../lib/language';

export type BookSentence = { emoji: string } & Record<Language, string>;

export const bookSentences: Record<string, BookSentence[]> = {
  'colors-mixed-up': [
    { emoji: '🍌', en: 'Her banana was blue', es: 'Su plátano era azul', fr: 'Sa banane était bleue' },
    { emoji: '🦋', en: 'Pixel is a butterfly', es: 'Pixel es una mariposa', fr: 'Pixel est un papillon' },
    { emoji: '🎨', en: 'Three colors make all the others', es: 'Tres colores forman todos los demás', fr: 'Trois couleurs font toutes les autres' },
  ],
  'rainbow-symphony': [
    { emoji: '🎶', en: 'The colors sing', es: 'Los colores cantan', fr: 'Les couleurs chantent' },
    { emoji: '✨', en: 'Pawa is a small light', es: 'Pawa es una pequeña luz', fr: 'Pawa est une petite lumière' },
    { emoji: '❤️', en: 'Pawa loves all the colors', es: 'Pawa quiere a todos los colores', fr: 'Pawa aime toutes les couleurs' },
  ],
  'tower-touched-sky': [
    { emoji: '🗼', en: 'Victor designs a tower', es: 'Victor diseña una torre', fr: 'Victor conçoit une tour' },
    { emoji: '✋', en: 'An engineer raises her hand', es: 'Una ingeniera levanta la mano', fr: 'Une ingénieure lève la main' },
    { emoji: '❓', en: 'Victor learns to design with questions', es: 'Victor aprende a diseñar con preguntas', fr: 'Victor apprend à concevoir avec des questions' },
  ],
  'mayas-shadow': [
    { emoji: '🛏️', en: 'Maya goes to bed', es: 'Maya se acuesta', fr: 'Maya va se coucher' },
    { emoji: '👤', en: 'Her shadow wakes up', es: 'Su sombra se despierta', fr: 'Son ombre se réveille' },
    { emoji: '🚪', en: 'Her shadow slips out the door', es: 'Su sombra se escapa por la puerta', fr: 'Son ombre se glisse dehors' },
  ],
  'sparrow-saved-forest': [
    { emoji: '🐦', en: 'The sparrow is small', es: 'El gorrión es pequeño', fr: 'Le moineau est petit' },
    { emoji: '🌳', en: 'The forest is in trouble', es: 'El bosque está en peligro', fr: 'La forêt est en danger' },
    { emoji: '🐻', en: 'The big animals do not notice', es: 'Los animales grandes no lo notan', fr: 'Les grands animaux ne remarquent rien' },
  ],
  'diegos-brave-leap': [
    { emoji: '👀', en: 'Everyone is watching', es: 'Todos lo miran', fr: 'Tout le monde regarde' },
    { emoji: '💧', en: 'The water is far below', es: 'El agua está muy abajo', fr: "L'eau est loin en dessous" },
    { emoji: '☀️', en: 'Diego stands on a sunny cliff', es: 'Diego está en un acantilado soleado', fr: 'Diego est sur une falaise ensoleillée' },
  ],
  'butterfly-effect': [
    { emoji: '💛', en: 'Kindness can travel', es: 'La bondad puede viajar', fr: 'La bonté peut voyager' },
    { emoji: '🏘️', en: 'The whole community changes', es: 'Toda la comunidad cambia', fr: 'Toute la communauté change' },
    { emoji: '🌱', en: 'Each kind act leads to more', es: 'Cada gesto amable lleva a otros', fr: "Chaque geste gentil en entraîne d'autres" },
  ],
  'emperors-true-treasure': [
    { emoji: '💰', en: 'The emperor has gold', es: 'El emperador tiene oro', fr: "L'empereur a de l'or" },
    { emoji: '😔', en: 'He feels so empty', es: 'Se siente tan vacío', fr: 'Il se sent si vide' },
    { emoji: '🏘️', en: 'The villagers have almost nothing', es: 'Los aldeanos casi no tienen nada', fr: "Les villageois n'ont presque rien" },
  ],
  'crooked-little-apple-tree': [
    { emoji: '🍎', en: 'The tree is crooked', es: 'El árbol está torcido', fr: "L'arbre est tordu" },
    { emoji: '🌳', en: 'The orchard wants straight trees', es: 'El huerto quiere árboles rectos', fr: 'Le verger veut des arbres droits' },
    { emoji: '👀', en: 'One year someone really looks at it', es: 'Un año alguien lo mira de verdad', fr: "Une année quelqu'un le regarde vraiment" },
  ],
  'true-beauty-meadowbrook': [
    { emoji: '👧', en: 'The girl is quiet', es: 'La niña es tranquila', fr: 'La fille est discrète' },
    { emoji: '🪞', en: 'Everyone wants to look beautiful', es: 'Todos quieren verse bellos', fr: 'Tout le monde veut être beau' },
    { emoji: '✨', en: 'She finds another way to shine', es: 'Ella descubre otra forma de brillar', fr: 'Elle découvre une autre façon de briller' },
  ],
  'sanding-block': [
    { emoji: '☀️', en: 'The workshop is sunny', es: 'El taller está soleado', fr: "L'atelier est ensoleillé" },
    { emoji: '🪵', en: 'Wood shavings cover the floor', es: 'Hay virutas en el suelo', fr: 'Des copeaux couvrent le sol' },
    { emoji: '🧱', en: 'He gets a sanding block', es: 'Recibe un bloque de lijar', fr: 'Il reçoit un bloc à poncer' },
  ],
  'leo-and-the-wolf': [
    { emoji: '🐑', en: 'Leo is a shepherd', es: 'Leo es pastor', fr: 'Léo est berger' },
    { emoji: '🏃', en: 'The villagers come running', es: 'Los aldeanos vienen corriendo', fr: 'Les villageois accourent' },
    { emoji: '🐺', en: 'One evening yellow eyes appear', es: 'Una tarde aparecen ojos amarillos', fr: 'Un soir des yeux jaunes apparaissent' },
  ],
  'russet-the-fox': [
    { emoji: '🦊', en: 'Russet is a fox', es: 'Russet es un zorro', fr: 'Russet est un renard' },
    { emoji: '⚠️', en: 'His mother warns him', es: 'Su madre le advierte', fr: 'Sa mère le prévient' },
    { emoji: '🧠', en: 'Russet thinks he is so clever', es: 'Russet cree que es muy listo', fr: 'Russet se croit très malin' },
  ],
  'little-boats-big-wish': [
    { emoji: '⛵', en: 'The boat is yellow', es: 'El barco es amarillo', fr: 'Le bateau est jaune' },
    { emoji: '🌙', en: 'He watches the moon', es: 'Él mira la luna', fr: 'Il regarde la lune' },
    { emoji: '🌊', en: 'He dreams of the big ocean', es: 'Sueña con el gran océano', fr: 'Il rêve du grand océan' },
  ],
  'heidis-journey-to-mastery': [
    { emoji: '🤖', en: 'Heidi dreams of inventions', es: 'Heidi sueña con inventos', fr: "Heidi rêve d'inventions" },
    { emoji: '🧹', en: 'Heidi gets a broom', es: 'Heidi recibe una escoba', fr: 'Heidi reçoit un balai' },
    { emoji: '⚙️', en: 'Then she sorts parts and watches', es: 'Luego clasifica piezas y observa', fr: 'Puis elle trie les pièces et observe' },
  ],
  'cloud-collector': [
    { emoji: '🌤️', en: 'Luna loves the sky', es: 'Luna ama el cielo', fr: 'Luna adore le ciel' },
    { emoji: '🌬️', en: 'Clouds dance with the wind', es: 'Las nubes bailan con el viento', fr: 'Les nuages dansent avec le vent' },
    { emoji: '☁️', en: 'She wants one cloud of every kind', es: 'Quiere una nube de cada tipo', fr: 'Elle veut un nuage de chaque sorte' },
  ],
  'little-mapmaker': [
    { emoji: '🗺️', en: 'Maya draws maps', es: 'Maya dibuja mapas', fr: 'Maya dessine des cartes' },
    { emoji: '🐕', en: 'Pepper is her dog', es: 'Pepper es su perro', fr: 'Pepper est son chien' },
    { emoji: '🏰', en: 'She draws a castle in the grass', es: 'Dibuja un castillo en la hierba', fr: "Elle dessine un château dans l'herbe" },
  ],
  'pawa-rainbow-cloud': [
    { emoji: '😢', en: 'Cirro feels sad', es: 'Cirro está triste', fr: 'Cirro est triste' },
    { emoji: '☀️', en: 'Pawa is the wise Sun', es: 'Pawa es el sabio Sol', fr: 'Pawa est le sage Soleil' },
    { emoji: '☁️', en: 'Cirro is a little gray cloud', es: 'Cirro es una pequeña nube gris', fr: 'Cirro est un petit nuage gris' },
  ],
  'miras-thousand-cubes': [
    { emoji: '🦅', en: 'Mira dreams of eagles', es: 'Mira sueña con águilas', fr: "Mira rêve d'aigles" },
    { emoji: '🔨', en: "Mira is Hiroshi's apprentice", es: 'Mira es aprendiz de Hiroshi', fr: "Mira est l'apprentie de Hiroshi" },
    { emoji: '🧊', en: 'She carves a thousand identical cubes', es: 'Ella talla mil cubos idénticos', fr: 'Elle sculpte mille cubes identiques' },
  ],
  'fig-trees-secret': [
    { emoji: '🏠', en: 'Sofia inherits a cottage', es: 'Sofía hereda una casita', fr: "Sofia hérite d'une maisonnette" },
    { emoji: '🌳', en: 'The fig tree is gnarled', es: 'La higuera es nudosa', fr: 'Le figuier est noueux' },
    { emoji: '🧺', en: 'The tree has seen many harvests', es: 'El árbol ha visto muchas cosechas', fr: "L'arbre a vu beaucoup de récoltes" },
  ],
};
