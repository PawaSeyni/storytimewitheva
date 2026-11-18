// Collection Story Dice (activities audit 2026-11, §5c item 3). BROWSER-FREE data.
//
// Three dice, a character, a setting and a problem, whose faces all come from the twenty
// books of the collection. Every face is taken from the book's own catalog description in
// that language (src/data/books.data.ts), so nothing here says more about a book than the
// catalog does: names and facts are the description's, and where the description names no
// one, the face describes the character instead ("the quiet girl", "a little gray cloud").
// Faces are 2 to 6 words so three of them fit on one printed card. Spanish and French never
// address the child here, so no wording needs to agree with a gender.
import type { Language } from '../lib/language';

export type Face = Record<Language, string>;
export interface DiceFaces {
  character: Face;
  setting: Face;
  problem: Face;
}

export const storyDice: Record<string, DiceFaces> = {
  'colors-mixed-up': {
    character: { en: 'Hawel and Pixel the butterfly', es: 'Hawel y Pixel la mariposa', fr: 'Hawel et Pixel le papillon' },
    setting: { en: 'a world with swapped colors', es: 'un mundo de colores cambiados', fr: 'un monde aux couleurs échangées' },
    problem: { en: 'every color is mixed up', es: 'todos los colores se cambiaron', fr: 'toutes les couleurs sont échangées' },
  },
  'rainbow-symphony': {
    character: { en: 'Pawa, a small glowing light', es: 'Pawa, una pequeña luz brillante', fr: 'Pawa, une petite lumière' },
    setting: { en: 'the village of Harmonia', es: 'el pueblo de Harmonía', fr: 'le village d’Harmonia' },
    problem: { en: 'the music breaks apart', es: 'la música se rompe', fr: 'la musique se brise' },
  },
  'tower-touched-sky': {
    character: { en: 'Victor Mercer the architect', es: 'el arquitecto Victor Mercer', fr: 'l’architecte Victor Mercer' },
    setting: { en: 'the tallest tower ever designed', es: 'la torre más alta jamás diseñada', fr: 'la tour la plus haute jamais conçue' },
    problem: { en: 'a raised hand nobody sees', es: 'una mano levantada que nadie ve', fr: 'une main que personne ne voit' },
  },
  'mayas-shadow': {
    character: { en: 'Maya’s shadow, out for adventures', es: 'la sombra de Maya, de aventuras', fr: 'l’ombre de Maya, partie à l’aventure' },
    setting: { en: 'the night, while Maya sleeps', es: 'la noche, mientras Maya duerme', fr: 'la nuit, pendant que Maya dort' },
    problem: { en: 'getting home by morning', es: 'volver a casa al amanecer', fr: 'rentrer avant le matin' },
  },
  'sparrow-saved-forest': {
    character: { en: 'the smallest sparrow', es: 'el gorrión más pequeño', fr: 'le plus petit moineau' },
    setting: { en: 'a forest in trouble', es: 'un bosque en peligro', fr: 'une forêt en difficulté' },
    problem: { en: 'the biggest animals don’t notice', es: 'los animales grandes no se dan cuenta', fr: 'les grands animaux ne voient rien' },
  },
  'diegos-brave-leap': {
    character: { en: 'Diego at the edge', es: 'Diego al borde del acantilado', fr: 'Diego au bord de la falaise' },
    setting: { en: 'a sunny cliff above the sea', es: 'un acantilado sobre el Mediterráneo', fr: 'une falaise au-dessus de la mer' },
    problem: { en: 'everyone is watching', es: 'todos están mirando', fr: 'tout le monde regarde' },
  },
  'butterfly-effect': {
    character: { en: 'someone doing one kind thing', es: 'alguien que hace un gesto amable', fr: 'quelqu’un qui fait un geste de bonté' },
    setting: { en: 'a whole community', es: 'una comunidad entera', fr: 'toute une communauté' },
    problem: { en: 'kindness travels where no one sees', es: 'la bondad viaja sin verse', fr: 'la bonté voyage sans être vue' },
  },
  'emperors-true-treasure': {
    character: { en: 'an emperor with gold everywhere', es: 'un emperador rodeado de oro', fr: 'un empereur entouré d’or' },
    setting: { en: 'a palace full of gold', es: 'un palacio lleno de oro', fr: 'un palais rempli d’or' },
    problem: { en: 'he still feels empty', es: 'aun así se siente vacío', fr: 'il se sent pourtant si vide' },
  },
  'crooked-little-apple-tree': {
    character: { en: 'the crooked little apple tree', es: 'el pequeño manzano torcido', fr: 'le petit pommier tordu' },
    setting: { en: 'the edge of the orchard', es: 'el borde del huerto', fr: 'le bord du verger' },
    problem: { en: 'overlooked for years', es: 'nadie lo mira desde hace años', fr: 'invisible depuis des années' },
  },
  'true-beauty-meadowbrook': {
    character: { en: 'the quiet girl', es: 'la niña tranquila', fr: 'la fille discrète' },
    setting: { en: 'the town of Meadowbrook', es: 'el pueblo de Meadowbrook', fr: 'la ville de Meadowbrook' },
    problem: { en: 'everyone competes to look beautiful', es: 'todos compiten por ser bellos', fr: 'chacun veut être le plus beau' },
  },
  'sanding-block': {
    character: { en: 'a boy who can’t wait', es: 'un niño que no quiere esperar', fr: 'un garçon trop pressé' },
    setting: { en: 'a sunlit workshop', es: 'un taller lleno de sol', fr: 'un atelier ensoleillé' },
    problem: { en: 'Grandpa hands him a sanding block', es: 'solo recibe un bloque de lijar', fr: 'il reçoit un bloc à poncer' },
  },
  'leo-and-the-wolf': {
    character: { en: 'Leo the shepherd', es: 'Leo el pastor', fr: 'Léo le berger' },
    setting: { en: 'the village pasture', es: 'los pastos del pueblo', fr: 'le pâturage du village' },
    problem: { en: 'no one believes him', es: 'nadie le cree', fr: 'personne ne le croit' },
  },
  'russet-the-fox': {
    character: { en: 'Russet the clever fox', es: 'Russet el zorro listo', fr: 'Russet le renard malin' },
    setting: { en: 'the farm with the wire fence', es: 'la granja con la alambrada', fr: 'la ferme et sa clôture' },
    problem: { en: 'he won’t listen to a warning', es: 'no escucha la advertencia', fr: 'il n’écoute pas l’avertissement' },
  },
  'little-boats-big-wish': {
    character: { en: 'a small yellow wooden boat', es: 'un pequeño barco amarillo', fr: 'un petit bateau jaune' },
    setting: { en: 'a sparkling puddle', es: 'un charco brillante', fr: 'une flaque scintillante' },
    problem: { en: 'dreaming of the vast ocean', es: 'sueña con el océano', fr: 'il rêve de l’océan' },
  },
  'heidis-journey-to-mastery': {
    character: { en: 'Heidi, who dreams of inventions', es: 'Heidi, que sueña con inventos', fr: 'Heidi, qui rêve d’inventions' },
    setting: { en: 'Grandpa Anders’s workshop in Granholm', es: 'el taller del abuelo Anders', fr: 'l’atelier de grand-père Anders' },
    problem: { en: 'she gets a broom, not tools', es: 'recibe una escoba, no herramientas', fr: 'elle reçoit un balai, pas d’outils' },
  },
  'cloud-collector': {
    character: { en: 'Luna with a butterfly net', es: 'Luna con una red de mariposas', fr: 'Luna avec un filet à papillons' },
    setting: { en: 'a meadow under the sky', es: 'un prado bajo el cielo', fr: 'une prairie sous le ciel' },
    problem: { en: 'a cloud that can’t be kept', es: 'una nube imposible de guardar', fr: 'un nuage impossible à garder' },
  },
  'little-mapmaker': {
    character: { en: 'Maya and her dog Pepper', es: 'Maya y su perro Pepper', fr: 'Maya et son chien Pepper' },
    setting: { en: 'a backyard with a tire swing', es: 'un jardín con columpio de neumático', fr: 'un jardin avec une balançoire' },
    problem: { en: 'her maps come true', es: 'sus mapas se hacen realidad', fr: 'ses cartes deviennent réelles' },
  },
  'pawa-rainbow-cloud': {
    character: { en: 'Cirro, a little gray cloud', es: 'Cirro, una pequeña nube gris', fr: 'Cirro, un petit nuage gris' },
    setting: { en: 'the sky after a storm', es: 'el cielo tras la tormenta', fr: 'le ciel après l’orage' },
    problem: { en: 'his tears feel like too much', es: 'sus lágrimas parecen demasiado', fr: 'ses larmes semblent trop grandes' },
  },
  'miras-thousand-cubes': {
    character: { en: 'Mira, Master Hiroshi’s apprentice', es: 'Mira, la aprendiz del maestro Hiroshi', fr: 'Mira, l’apprentie de Maître Hiroshi' },
    setting: { en: 'a mountain village of stone carvers', es: 'un pueblo de talladores de piedra', fr: 'un village de sculpteurs de pierre' },
    problem: { en: 'a thousand cubes before any eagles', es: 'mil cubos antes que águilas', fr: 'mille cubes avant les aigles' },
  },
  'fig-trees-secret': {
    character: { en: 'Sofia and old Mr. Costas', es: 'Sofía y el viejo señor Costas', fr: 'Sofia et le vieux monsieur Costas' },
    setting: { en: 'a Mediterranean cottage garden', es: 'el jardín de una casita mediterránea', fr: 'le jardin d’une maisonnette méditerranéenne' },
    problem: { en: 'an old fig tree in danger', es: 'la vieja higuera en peligro', fr: 'le vieux figuier en danger' },
  },
};

/** One picture per book for the character die; the setting and problem dice use a fixed icon. */
export const storyDiceEmoji: Record<string, string> = {
  'colors-mixed-up': '🦋', 'rainbow-symphony': '✨', 'tower-touched-sky': '🏗️', 'mayas-shadow': '🌙', 'sparrow-saved-forest': '🐦',
  'diegos-brave-leap': '🌊', 'butterfly-effect': '💛', 'emperors-true-treasure': '👑', 'crooked-little-apple-tree': '🍎', 'true-beauty-meadowbrook': '🌼',
  'sanding-block': '🪵', 'leo-and-the-wolf': '🐺', 'russet-the-fox': '🦊', 'little-boats-big-wish': '⛵', 'heidis-journey-to-mastery': '🧹',
  'cloud-collector': '☁️', 'little-mapmaker': '🗺️', 'pawa-rainbow-cloud': '🌦️', 'miras-thousand-cubes': '🪨', 'fig-trees-secret': '🌳',
};
