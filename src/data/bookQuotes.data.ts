// One short line per book for the Bookmark Designer (activities re-audit 2026-11-18, §7d,
// "bookmark quotes per book"). BROWSER-FREE data. Each line is drawn from the book's own
// catalog description or theme, never from text inside the book, and fits the bookmark's
// 30-character text field (tests enforce it).
import type { Language } from '../lib/language';

export const bookQuotes: Record<string, Record<Language, string>> = {
  'colors-mixed-up': { en: 'Red, yellow and blue make all', es: 'Tres colores hacen los demás', fr: 'Rouge, jaune, bleu font tout' },
  'rainbow-symphony': { en: 'Every color sings its song', es: 'Cada color canta su canción', fr: 'Chaque couleur a sa chanson' },
  'tower-touched-sky': { en: 'Build with questions', es: 'Construye con preguntas', fr: 'Construis avec des questions' },
  'mayas-shadow': { en: 'Even shadows have adventures', es: 'Las sombras también viajan', fr: 'Même les ombres voyagent' },
  'sparrow-saved-forest': { en: 'No one is too small to help', es: 'Nadie es demasiado pequeño', fr: 'Personne n’est trop petit' },
  'diegos-brave-leap': { en: 'Bravery doesn’t feel brave', es: 'Valiente, aunque no lo parezca', fr: 'Courageux sans le sentir' },
  'butterfly-effect': { en: 'Kindness travels', es: 'La bondad viaja', fr: 'La bonté voyage' },
  'emperors-true-treasure': { en: 'Where richness really lives', es: 'Donde vive la riqueza', fr: 'Là où vit la richesse' },
  'crooked-little-apple-tree': { en: 'Someone really looked', es: 'Alguien lo miró de verdad', fr: 'Quelqu’un a vraiment regardé' },
  'true-beauty-meadowbrook': { en: 'Kindness is beauty that lasts', es: 'La bondad es belleza que dura', fr: 'La bonté, la beauté qui dure' },
  'sanding-block': { en: 'Good things take small strokes', es: 'Lo bueno se hace poco a poco', fr: 'Le beau se fait doucement' },
  'leo-and-the-wolf': { en: 'Trust is the long road back', es: 'La confianza es el camino', fr: 'La confiance, le long retour' },
  'russet-the-fox': { en: 'Take your time and listen', es: 'Tómate tu tiempo y escucha', fr: 'Prends ton temps et écoute' },
  'little-boats-big-wish': { en: 'The ocean was never the point', es: 'El océano no era lo importante', fr: 'L’océan n’était pas le but' },
  'heidis-journey-to-mastery': { en: 'From dreaming to making', es: 'Del soñar al hacer', fr: 'Du rêve à la fabrication' },
  'cloud-collector': { en: 'Too beautiful to keep', es: 'Demasiado bello para guardar', fr: 'Trop beau pour être gardé' },
  'little-mapmaker': { en: 'A pencil can make a world', es: 'Un lápiz puede crear un mundo', fr: 'Un crayon fait un monde' },
  'pawa-rainbow-cloud': { en: 'When rain meets light', es: 'Cuando la lluvia halla la luz', fr: 'La pluie rencontre la lumière' },
  'miras-thousand-cubes': { en: 'Do the small thing well', es: 'Haz bien lo pequeño', fr: 'Bien faire les petites choses' },
  'fig-trees-secret': { en: 'Inheritances made of stories', es: 'Herencias hechas de historias', fr: 'Un héritage fait d’histoires' },
};
