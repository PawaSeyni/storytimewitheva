import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Lightbulb, Download } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { useToast } from '../lib/toast';

type Difficulty = 'easy' | 'medium' | 'hard';
type CraftKey = 'mask' | 'puppet' | 'diorama' | 'crown' | 'wand' | 'cape';
type Step = { title: string; desc: string };
type Craft = {
  emoji: string;
  difficulty: Difficulty;
  ideas: string[];
  hasSafetyRules: boolean;
  color: string;
};
type LocalizedCraft = {
  title: string;
  description: string;
  materials: string[];
  steps: Step[];
  tips: string[];
  safetyRules?: string[];
};

// Static per-craft visual metadata (language-invariant).
const CRAFT_META: Record<CraftKey, Craft> = {
  mask:    { emoji: '🎭', difficulty: 'easy',   ideas: ['🦊', '🦁', '🐉', '🦉', '🐻', '🐱'], hasSafetyRules: false, color: '#e05c97' },
  puppet:  { emoji: '🧦', difficulty: 'easy',   ideas: ['🐶', '🐸', '👹', '👸', '🤖', '🦕'], hasSafetyRules: false, color: '#22a87a' },
  diorama: { emoji: '📦', difficulty: 'medium', ideas: [],                                     hasSafetyRules: false, color: '#2e7bd6' },
  crown:   { emoji: '👑', difficulty: 'easy',   ideas: [],                                     hasSafetyRules: false, color: '#d4a017' },
  wand:    { emoji: '🪄', difficulty: 'easy',   ideas: [],                                     hasSafetyRules: false, color: '#7c3aed' },
  cape:    { emoji: '🦸', difficulty: 'medium', ideas: [],                                     hasSafetyRules: true,  color: '#c0392b' },
};

const CRAFT_KEYS: CraftKey[] = ['mask', 'puppet', 'diorama', 'crown', 'wand', 'cape'];

const CRAFTS_BY_LANG: Record<Language, Record<CraftKey, LocalizedCraft>> = {
  en: {
    mask: {
      title: 'Character Masks',
      description: 'Make masks of your favorite story characters',
      materials: [
        'Paper plates or cardstock',
        'Markers or crayons',
        'Scissors',
        'Glue or tape',
        'Elastic string or stick',
        'Decorations (glitter, stickers)',
      ],
      steps: [
        { title: 'Choose Your Character', desc: 'Pick a character from your favorite story. Animals (fox, bear, lion), fantasy creatures (dragon, fairy), or people (princess, knight, pirate).' },
        { title: 'Create the Base', desc: 'Use a paper plate as your mask base. Hold it up to your face and mark where your eyes should go. Ask an adult to help cut out the eye holes.' },
        { title: 'Add Features', desc: 'Draw or glue on features like ears, nose, whiskers, or horns. Use construction paper for different colored parts.' },
        { title: 'Color and Decorate', desc: 'Color with markers, paint, or crayons. Add details like spots, stripes, or sparkles. Use glitter glue for magical characters.' },
        { title: 'Attach the Holder', desc: 'Poke holes on each side of the mask and tie elastic string through them, or tape a popsicle stick to one side as a handle.' },
      ],
      tips: [
        'Make it reversible! Decorate both sides for two characters',
        'Add feathers, yarn, or fabric scraps for texture',
        'Use aluminum foil for shiny knight or robot masks',
        'Make a whole set for story time performances',
      ],
    },
    puppet: {
      title: 'Story Puppets',
      description: 'Create puppets to act out stories',
      materials: ['Paper bags or socks', 'Construction paper', 'Googly eyes', 'Markers', 'Glue', 'Yarn or fabric scraps'],
      steps: [
        { title: 'Choose Your Base', desc: 'Pick a paper lunch bag or clean sock. Paper bags work great for animal mouths that open and close. Socks are perfect for long creatures like snakes or dragons!' },
        { title: 'Add the Face', desc: 'For paper bags: the fold at the bottom becomes the mouth. For socks: the toe becomes the mouth.' },
        { title: 'Create Features', desc: 'Cut ears, horns, or wings from construction paper and glue them on. Add yarn for hair or a mane.' },
        { title: 'Add Details', desc: 'Draw or glue on spots, stripes, scales, or feathers. Add whiskers with pipe cleaners. Use buttons for details.' },
        { title: 'Practice and Perform', desc: 'Put your hand inside and practice moving the mouth. Make different voices. Put on a puppet show to retell your favorite story!' },
      ],
      tips: [
        'Make multiple characters for a full cast',
        'Create a simple stage from a cardboard box',
        'Record your puppet show to watch later',
        'Invite friends to make puppets and perform together',
      ],
    },
    diorama: {
      title: 'Story Diorama',
      description: 'Build a 3D scene from your book',
      materials: ['Shoebox', 'Construction paper', 'Small toys or clay', 'Scissors and glue', 'Markers or paint', 'Nature items (twigs, pebbles)'],
      steps: [
        { title: 'Pick Your Scene', desc: 'Choose your favorite scene from a book. Is it in a forest, castle, underwater, or outer space? Think about what makes that place special.' },
        { title: 'Prepare the Box', desc: 'Turn your shoebox on its side so you can see inside. This is your stage! You can cut a window in the lid or leave it open.' },
        { title: 'Create the Background', desc: 'Draw or paint the back wall. Add sky, trees, buildings, or whatever fits your scene.' },
        { title: 'Add the Ground', desc: 'Cover the bottom with paper, sand, cotton (for snow), or grass. Add rocks, sticks, or other natural items.' },
        { title: 'Place Characters and Objects', desc: 'Add characters made from clay, paper cutouts, or small toys. Include important objects from the story.' },
      ],
      tips: [
        'Add cotton clouds hanging from the top',
        'Use aluminum foil for water or ice',
        'Poke holes in the top for "stars" with light shining through',
        'Make it interactive — move characters around to retell the story',
      ],
    },
    crown: {
      title: 'Royal Crown',
      description: 'Make a crown for kings and queens',
      materials: ['Yellow or gold cardstock', 'Scissors', 'Glue or tape', 'Gems, sequins, or glitter', 'Markers', 'Stapler (optional)'],
      steps: [
        { title: 'Cut the Strip', desc: 'Cut a long strip of cardstock about 3 inches tall. Make it long enough to fit around your head (about 22–24 inches).' },
        { title: 'Create the Points', desc: "Along the top edge, cut zigzag points to make the crown's peaks. Make them as tall or short as you like." },
        { title: 'Decorate', desc: 'Glue on plastic gems, sequins, buttons, or draw jewels with markers. Add glitter glue for extra sparkle.' },
        { title: 'Size and Attach', desc: "Wrap the crown around your head to check the fit. Overlap the ends and staple or tape them together. Now you're royalty!" },
      ],
      tips: [
        'Use different colors for different characters (silver for queens, gold for kings)',
        'Add feathers or flowers for a fancy look',
        'Make matching crowns for story time friends',
        'Layer different colored strips for a multi-tiered crown',
      ],
    },
    wand: {
      title: 'Magic Wand',
      description: 'Craft a magical wand for wizards',
      materials: ['Wooden dowel or pencil', 'Cardstock or foam', 'Ribbon or streamers', 'Glue gun (with adult help)', 'Glitter and paint', 'Star template'],
      steps: [
        { title: 'Prepare the Stick', desc: 'Use a wooden dowel, chopstick, or sturdy cardboard tube. Paint it in magical colors like gold, silver, purple, or rainbow!' },
        { title: 'Create the Star', desc: 'Cut two star shapes from cardstock or foam (front and back). Decorate them with glitter, gems, or markers.' },
        { title: 'Attach the Star', desc: 'With adult help using a glue gun, sandwich the top of your stick between the two star shapes. Hold until secure.' },
        { title: 'Add Ribbons', desc: "Tie colorful ribbons or streamers just below the star. Use 5–6 ribbons about 12 inches long. They'll flutter when you wave your wand!" },
        { title: 'Final Touches', desc: 'Wrap the handle with ribbon or yarn for a better grip. Add extra glitter, stickers, or paint details. Now cast your spells!' },
      ],
      tips: [
        'Make different shapes — hearts, moons, or flowers instead of stars',
        'Add bells to the ribbons for sound effects',
        'Use glow-in-the-dark paint for nighttime magic',
        'Create a matching spell book with construction paper',
      ],
    },
    cape: {
      title: 'Hero Cape',
      description: 'Design a superhero or wizard cape',
      materials: ['Large piece of fabric or old pillowcase', 'Ribbon for ties', 'Fabric markers or paint', 'Iron-on patches (optional)', 'Scissors', 'Safety pins'],
      steps: [
        { title: 'Choose Your Fabric', desc: 'Use a pillowcase, old t-shirt, or piece of fabric. Red for superheroes, purple for wizards, black for mysterious characters.' },
        { title: 'Cut and Shape', desc: 'If using a pillowcase, cut open the closed end. Round the bottom corners for a classic cape shape, or cut a zigzag edge for drama!' },
        { title: 'Add Tie Strings', desc: 'Attach two pieces of ribbon to the top corners (adult help may be needed). Make them long enough to tie comfortably around your neck.' },
        { title: 'Decorate Your Cape', desc: 'Use fabric markers to draw your logo, initial, or favorite symbol. Add iron-on patches with adult help.' },
        { title: 'Safety Check', desc: "Make sure the cape isn't too long — it should end above your knees so you don't trip. Use breakaway ties or velcro that come apart easily." },
      ],
      tips: [
        'Make it reversible — decorate both sides!',
        'Add sequins or glitter for a sparkly wizard cape',
        'Use glow-in-the-dark paint for night heroes',
        'Create a collar using felt for extra style',
      ],
      safetyRules: [
        'Never wear capes near stairs or while climbing',
        'Remove capes before playing on playground equipment',
        'Make sure ties break away easily — never use permanent attachments',
        'Always have adult supervision when wearing capes',
      ],
    },
  },
  es: {
    mask: {
      title: 'Máscaras de personajes',
      description: 'Crea máscaras de tus personajes favoritos',
      materials: [
        'Platos de papel o cartulina',
        'Rotuladores o crayones',
        'Tijeras',
        'Pegamento o cinta',
        'Cuerda elástica o palito',
        'Decoraciones (purpurina, pegatinas)',
      ],
      steps: [
        { title: 'Elige tu personaje', desc: 'Escoge un personaje de tu cuento favorito. Animales (zorro, oso, león), criaturas fantásticas (dragón, hada) o personas (princesa, caballero, pirata).' },
        { title: 'Crea la base', desc: 'Usa un plato de papel como base de la máscara. Apóyalo en tu cara y marca dónde van los ojos. Pide a un adulto que recorte los agujeros.' },
        { title: 'Añade rasgos', desc: 'Dibuja o pega orejas, nariz, bigotes o cuernos. Usa cartulina de colores para las distintas piezas.' },
        { title: 'Colorea y decora', desc: 'Pinta con rotuladores, pintura o crayones. Añade detalles como manchas, rayas o brillos. Usa cola con purpurina para personajes mágicos.' },
        { title: 'Pon el soporte', desc: 'Haz un agujero a cada lado de la máscara y pasa una cuerda elástica, o pega un palito a un lado como mango.' },
      ],
      tips: [
        '¡Hazla reversible! Decora ambos lados para tener dos personajes',
        'Añade plumas, lana o trocitos de tela para dar textura',
        'Usa papel de aluminio para máscaras brillantes de caballero o robot',
        'Haz un set completo para tus funciones de cuentacuentos',
      ],
    },
    puppet: {
      title: 'Marionetas de cuento',
      description: 'Crea marionetas para representar cuentos',
      materials: ['Bolsas de papel o calcetines', 'Cartulina de colores', 'Ojitos saltones', 'Rotuladores', 'Pegamento', 'Lana o trocitos de tela'],
      steps: [
        { title: 'Elige tu base', desc: 'Coge una bolsa de papel o un calcetín limpio. Las bolsas son geniales para bocas que se abren y cierran. ¡Los calcetines son perfectos para criaturas largas como serpientes o dragones!' },
        { title: 'Añade la cara', desc: 'En las bolsas, el pliegue del fondo es la boca. En los calcetines, la punta es la boca.' },
        { title: 'Crea los rasgos', desc: 'Recorta orejas, cuernos o alas de cartulina y pégalos. Añade lana para el pelo o una melena.' },
        { title: 'Añade detalles', desc: 'Dibuja o pega manchas, rayas, escamas o plumas. Pon bigotes con limpiapipas. Usa botones para los detalles.' },
        { title: 'Practica y actúa', desc: 'Mete la mano y practica abrir la boca. Pon voces distintas. ¡Monta una función para contar tu cuento favorito!' },
      ],
      tips: [
        'Haz varios personajes para tener un reparto completo',
        'Monta un escenario sencillo con una caja de cartón',
        'Graba tu función de marionetas para verla después',
        'Invita a amigos a hacer marionetas y actuar juntos',
      ],
    },
    diorama: {
      title: 'Diorama de cuento',
      description: 'Construye una escena 3D de tu libro',
      materials: ['Caja de zapatos', 'Cartulina', 'Juguetes pequeños o plastilina', 'Tijeras y pegamento', 'Rotuladores o pintura', 'Elementos de la naturaleza (palitos, piedrecitas)'],
      steps: [
        { title: 'Elige tu escena', desc: '¿Es un bosque, un castillo, bajo el mar o en el espacio? Piensa qué hace especial ese lugar.' },
        { title: 'Prepara la caja', desc: 'Pon la caja de lado para ver el interior. ¡Es tu escenario! Puedes recortar una ventana en la tapa o dejarla abierta.' },
        { title: 'Haz el fondo', desc: 'Dibuja o pinta la pared del fondo. Añade cielo, árboles, edificios o lo que encaje con tu escena.' },
        { title: 'Pon el suelo', desc: 'Cubre el fondo con papel, arena, algodón (para nieve) o césped. Añade piedras, palitos u otros elementos naturales.' },
        { title: 'Coloca personajes y objetos', desc: 'Añade personajes de plastilina, recortes de papel o juguetes pequeños. Incluye objetos importantes del cuento.' },
      ],
      tips: [
        'Cuelga nubes de algodón desde arriba',
        'Usa papel de aluminio para agua o hielo',
        'Haz agujeros en la parte de arriba para «estrellas» con luz que pase',
        'Hazlo interactivo: mueve los personajes para recontar la historia',
      ],
    },
    crown: {
      title: 'Corona real',
      description: 'Crea una corona para reyes y reinas',
      materials: ['Cartulina amarilla o dorada', 'Tijeras', 'Pegamento o cinta', 'Gemas, lentejuelas o purpurina', 'Rotuladores', 'Grapadora (opcional)'],
      steps: [
        { title: 'Corta la tira', desc: 'Recorta una tira larga de cartulina de unos 8 cm de alto. Que sea lo bastante larga para rodear tu cabeza (unos 55–60 cm).' },
        { title: 'Haz las puntas', desc: 'En el borde superior, recorta picos en zigzag para hacer las puntas de la corona. Pueden ser altas o bajas.' },
        { title: 'Decora', desc: 'Pega gemas de plástico, lentejuelas, botones o dibuja joyas con rotuladores. Añade cola con purpurina para más brillo.' },
        { title: 'Ajusta y cierra', desc: 'Envuelve la corona en tu cabeza para comprobar la talla. Solapa los extremos y grápalos o pégalos. ¡Ya eres de la realeza!' },
      ],
      tips: [
        'Usa colores distintos para personajes distintos (plateado para reinas, dorado para reyes)',
        'Añade plumas o flores para un look elegante',
        'Haz coronas a juego para tus amigos del cuentacuentos',
        'Superpone tiras de colores para una corona de varios pisos',
      ],
    },
    wand: {
      title: 'Varita mágica',
      description: 'Fabrica una varita mágica para magos',
      materials: ['Varilla de madera o lápiz', 'Cartulina o goma EVA', 'Cinta o serpentinas', 'Pistola de pegamento (con ayuda adulta)', 'Purpurina y pintura', 'Plantilla de estrella'],
      steps: [
        { title: 'Prepara el palito', desc: '¡Usa una varilla de madera, un palillo chino o un tubo de cartón resistente. Píntalo de colores mágicos como dorado, plateado, morado o arcoíris!' },
        { title: 'Crea la estrella', desc: 'Recorta dos estrellas de cartulina o goma EVA (anverso y reverso). Decóralas con purpurina, gemas o rotuladores.' },
        { title: 'Pega la estrella', desc: 'Con ayuda adulta y pistola de pegamento, mete la punta de tu palito entre las dos estrellas. Sujeta hasta que pegue bien.' },
        { title: 'Añade cintas', desc: 'Ata cintas de colores o serpentinas justo debajo de la estrella. Usa 5 o 6 cintas de unos 30 cm. ¡Ondearán cuando muevas la varita!' },
        { title: 'Toques finales', desc: 'Forra el mango con cinta o lana para un mejor agarre. Añade más purpurina, pegatinas o detalles de pintura. ¡Ya puedes lanzar tus hechizos!' },
      ],
      tips: [
        'Haz formas distintas: corazones, lunas o flores en vez de estrellas',
        'Añade campanillas a las cintas para efectos de sonido',
        'Usa pintura fosforescente para magia nocturna',
        'Crea un libro de hechizos a juego con cartulina',
      ],
    },
    cape: {
      title: 'Capa de héroe',
      description: 'Diseña una capa de superhéroe o mago',
      materials: ['Tela grande o funda de almohada vieja', 'Cinta para atar', 'Rotuladores o pintura para tela', 'Parches termoadhesivos (opcional)', 'Tijeras', 'Imperdibles'],
      steps: [
        { title: 'Elige tu tela', desc: 'Usa una funda de almohada, una camiseta vieja o un trozo de tela. Roja para superhéroes, morada para magos, negra para personajes misteriosos.' },
        { title: 'Corta y da forma', desc: 'Si usas una funda, abre el extremo cerrado. ¡Redondea las esquinas inferiores para una capa clásica o recorta un borde en zigzag para más drama!' },
        { title: 'Pon los lazos', desc: 'Pega dos cintas en las esquinas superiores (puede que necesites ayuda adulta). Que sean lo bastante largas para atarlas cómodamente al cuello.' },
        { title: 'Decora tu capa', desc: 'Usa rotuladores para tela para dibujar tu logo, inicial o símbolo favorito. Pon parches termoadhesivos con ayuda adulta.' },
        { title: 'Revisión de seguridad', desc: 'Asegúrate de que la capa no es demasiado larga: debe quedar por encima de las rodillas para no tropezar. Usa lazos que se suelten fácilmente o velcro.' },
      ],
      tips: [
        '¡Hazla reversible! Decora ambos lados',
        'Añade lentejuelas o purpurina para una capa de mago brillante',
        'Usa pintura fosforescente para héroes nocturnos',
        'Crea un cuello con fieltro para más estilo',
      ],
      safetyRules: [
        'Nunca lleves capas cerca de escaleras o al trepar',
        'Quítate la capa antes de jugar en aparatos del parque',
        'Asegúrate de que los lazos se suelten fácilmente: nunca uses cierres permanentes',
        'Lleva siempre la capa con supervisión de un adulto',
      ],
    },
  },
  fr: {
    mask: {
      title: 'Masques de personnages',
      description: 'Fabrique des masques de tes personnages préférés',
      materials: [
        'Assiettes en carton ou papier cartonné',
        'Feutres ou crayons',
        'Ciseaux',
        'Colle ou ruban adhésif',
        'Élastique ou bâton',
        'Décorations (paillettes, autocollants)',
      ],
      steps: [
        { title: 'Choisis ton personnage', desc: 'Choisis un personnage de ton conte préféré. Animaux (renard, ours, lion), créatures fantastiques (dragon, fée) ou personnes (princesse, chevalier, pirate).' },
        { title: 'Prépare la base', desc: 'Utilise une assiette en carton comme base. Pose-la sur ton visage et marque l\'emplacement des yeux. Demande à un adulte de découper les trous des yeux.' },
        { title: 'Ajoute les traits', desc: 'Dessine ou colle des oreilles, un nez, des moustaches ou des cornes. Utilise du papier coloré pour les différentes parties.' },
        { title: 'Colorie et décore', desc: 'Colorie avec des feutres, de la peinture ou des crayons. Ajoute des taches, des rayures ou des paillettes. Utilise de la colle pailletée pour les personnages magiques.' },
        { title: 'Fixe le support', desc: 'Perce un trou de chaque côté du masque et passe un élastique, ou colle un bâtonnet sur un côté en guise de poignée.' },
      ],
      tips: [
        'Rends-le réversible ! Décore les deux côtés pour deux personnages',
        'Ajoute des plumes, de la laine ou des chutes de tissu pour la texture',
        'Utilise du papier aluminium pour des masques brillants de chevalier ou de robot',
        'Fabrique tout un ensemble pour tes séances de lecture',
      ],
    },
    puppet: {
      title: 'Marionnettes de conte',
      description: 'Crée des marionnettes pour jouer tes histoires',
      materials: ['Sacs en papier ou chaussettes', 'Papier coloré', 'Yeux mobiles', 'Feutres', 'Colle', 'Laine ou chutes de tissu'],
      steps: [
        { title: 'Choisis ta base', desc: 'Prends un sac en papier ou une chaussette propre. Les sacs sont parfaits pour les bouches d\'animaux qui s\'ouvrent et se ferment. Les chaussettes sont idéales pour les créatures longues comme les serpents ou les dragons !' },
        { title: 'Ajoute le visage', desc: 'Pour les sacs : le pli du fond devient la bouche. Pour les chaussettes : le bout devient la bouche.' },
        { title: 'Crée les traits', desc: 'Découpe des oreilles, des cornes ou des ailes dans du papier coloré et colle-les. Ajoute de la laine pour les cheveux ou une crinière.' },
        { title: 'Ajoute des détails', desc: 'Dessine ou colle des taches, des rayures, des écailles ou des plumes. Ajoute des moustaches avec des cure-pipes. Utilise des boutons pour les détails.' },
        { title: 'Entraîne-toi et joue', desc: 'Mets la main à l\'intérieur et entraîne-toi à bouger la bouche. Fais des voix différentes. Monte un spectacle de marionnettes pour raconter ton histoire préférée !' },
      ],
      tips: [
        'Fabrique plusieurs personnages pour avoir tout un casting',
        'Crée une scène simple avec une boîte en carton',
        'Enregistre ton spectacle de marionnettes pour le revoir',
        'Invite des amis à fabriquer des marionnettes et à jouer ensemble',
      ],
    },
    diorama: {
      title: 'Diorama de conte',
      description: 'Construis une scène 3D inspirée de ton livre',
      materials: ['Boîte à chaussures', 'Papier coloré', 'Petits jouets ou pâte à modeler', 'Ciseaux et colle', 'Feutres ou peinture', 'Éléments de la nature (brindilles, cailloux)'],
      steps: [
        { title: 'Choisis ta scène', desc: 'Choisis ta scène préférée d\'un livre. Est-ce dans une forêt, un château, sous l\'eau ou dans l\'espace ? Pense à ce qui rend ce lieu spécial.' },
        { title: 'Prépare la boîte', desc: 'Couche la boîte sur le côté pour voir l\'intérieur. C\'est ta scène ! Tu peux découper une fenêtre dans le couvercle ou la laisser ouverte.' },
        { title: 'Crée l\'arrière-plan', desc: 'Dessine ou peins le mur du fond. Ajoute le ciel, les arbres, les bâtiments ou ce qui convient à ta scène.' },
        { title: 'Ajoute le sol', desc: 'Couvre le fond avec du papier, du sable, du coton (pour la neige) ou de l\'herbe. Ajoute des pierres, des bâtons ou d\'autres éléments naturels.' },
        { title: 'Place les personnages et objets', desc: 'Ajoute des personnages en pâte à modeler, en papier découpé ou en petits jouets. Inclus les objets importants de l\'histoire.' },
      ],
      tips: [
        'Suspends des nuages en coton depuis le haut',
        'Utilise du papier aluminium pour l\'eau ou la glace',
        'Perce des trous en haut pour des « étoiles » avec de la lumière',
        'Rends-le interactif : déplace les personnages pour raconter l\'histoire',
      ],
    },
    crown: {
      title: 'Couronne royale',
      description: 'Crée une couronne pour rois et reines',
      materials: ['Papier cartonné jaune ou doré', 'Ciseaux', 'Colle ou ruban adhésif', 'Gemmes, paillettes ou brillants', 'Feutres', 'Agrafeuse (optionnel)'],
      steps: [
        { title: 'Découpe la bande', desc: 'Découpe une longue bande de papier cartonné d\'environ 8 cm de haut. Assez longue pour faire le tour de ta tête (55–60 cm environ).' },
        { title: 'Crée les pointes', desc: 'Sur le bord supérieur, découpe des pointes en zigzag pour faire les pics de la couronne. Aussi hautes ou courtes que tu veux.' },
        { title: 'Décore', desc: 'Colle des gemmes en plastique, des paillettes, des boutons ou dessine des bijoux au feutre. Ajoute de la colle pailletée pour plus de brillance.' },
        { title: 'Ajuste et ferme', desc: 'Enroule la couronne autour de ta tête pour vérifier la taille. Superpose les bouts et agrafe-les ou colle-les. Te voilà royal·e !' },
      ],
      tips: [
        'Utilise des couleurs différentes pour différents personnages (argent pour les reines, or pour les rois)',
        'Ajoute des plumes ou des fleurs pour un look raffiné',
        'Fabrique des couronnes assorties pour tes amis de la lecture',
        'Superpose des bandes de couleurs pour une couronne à plusieurs étages',
      ],
    },
    wand: {
      title: 'Baguette magique',
      description: 'Fabrique une baguette magique pour magiciens',
      materials: ['Tige en bois ou crayon', 'Papier cartonné ou mousse', 'Ruban ou serpentins', 'Pistolet à colle (avec aide d\'un adulte)', 'Paillettes et peinture', 'Gabarit d\'étoile'],
      steps: [
        { title: 'Prépare le bâton', desc: 'Utilise une tige en bois, une baguette chinoise ou un tube en carton solide. Peins-le de couleurs magiques comme or, argent, violet ou arc-en-ciel !' },
        { title: 'Crée l\'étoile', desc: 'Découpe deux étoiles en papier cartonné ou mousse (avant et arrière). Décore-les avec des paillettes, des gemmes ou des feutres.' },
        { title: 'Fixe l\'étoile', desc: 'Avec l\'aide d\'un adulte et un pistolet à colle, glisse le haut du bâton entre les deux étoiles. Maintiens jusqu\'à ce que ça tienne.' },
        { title: 'Ajoute des rubans', desc: 'Noue des rubans colorés ou des serpentins juste sous l\'étoile. Utilise 5 ou 6 rubans d\'environ 30 cm. Ils flotteront quand tu agiteras la baguette !' },
        { title: 'Touches finales', desc: 'Enroule le manche avec du ruban ou de la laine pour mieux le tenir. Ajoute encore des paillettes, des autocollants ou de la peinture. Maintenant, lance tes sorts !' },
      ],
      tips: [
        'Fabrique des formes différentes — cœurs, lunes ou fleurs au lieu d\'étoiles',
        'Ajoute des grelots aux rubans pour des effets sonores',
        'Utilise de la peinture phosphorescente pour la magie nocturne',
        'Crée un grimoire assorti en papier cartonné',
      ],
    },
    cape: {
      title: 'Cape de héros',
      description: 'Dessine une cape de super-héros ou de magicien',
      materials: ['Grand morceau de tissu ou vieille taie d\'oreiller', 'Ruban pour attacher', 'Feutres ou peinture pour tissu', 'Écussons thermocollants (optionnel)', 'Ciseaux', 'Épingles de sûreté'],
      steps: [
        { title: 'Choisis ton tissu', desc: 'Utilise une taie d\'oreiller, un vieux t-shirt ou un morceau de tissu. Rouge pour super-héros, violet pour magiciens, noir pour personnages mystérieux.' },
        { title: 'Coupe et donne la forme', desc: 'Avec une taie d\'oreiller, ouvre l\'extrémité fermée. Arrondis les coins du bas pour une cape classique, ou découpe un bord en zigzag pour le drame !' },
        { title: 'Ajoute les attaches', desc: 'Fixe deux rubans aux coins supérieurs (l\'aide d\'un adulte peut être nécessaire). Assez longs pour s\'attacher confortablement au cou.' },
        { title: 'Décore ta cape', desc: 'Utilise des feutres pour tissu pour dessiner ton logo, ton initiale ou ton symbole préféré. Ajoute des écussons thermocollants avec l\'aide d\'un adulte.' },
        { title: 'Vérification sécurité', desc: 'Assure-toi que la cape n\'est pas trop longue — elle doit s\'arrêter au-dessus des genoux pour ne pas trébucher. Utilise des attaches qui se détachent facilement ou du velcro.' },
      ],
      tips: [
        'Rends-la réversible — décore les deux côtés !',
        'Ajoute des paillettes pour une cape de magicien étincelante',
        'Utilise de la peinture phosphorescente pour les héros de la nuit',
        'Crée un col en feutrine pour plus de style',
      ],
      safetyRules: [
        'Ne porte jamais de cape près d\'escaliers ou en grimpant',
        'Retire la cape avant de jouer sur les jeux d\'extérieur',
        'Assure-toi que les attaches se détachent facilement — jamais de fixations permanentes',
        'Toujours avec la supervision d\'un adulte quand tu portes une cape',
      ],
    },
  },
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'bg-green-200 text-green-800',
  medium: 'bg-yellow-200 text-yellow-800',
  hard: 'bg-orange-200 text-orange-800',
};

const TRANSLATIONS = {
  en: {
    heading: "Eva's Craft Corner",
    subheading: 'Create amazing crafts to bring your favorite stories to life!',
    howToPlay: '✨ How to Play ✨',
    howToPlaySteps: [
      'Choose a craft project from the gallery below',
      'Read the materials list and gather your supplies',
      'Follow the step-by-step instructions carefully',
      'Always ask an adult for help with scissors and glue',
      'Have fun creating and use your imagination!',
    ],
    safetyFirst: '⚠️ Safety First!',
    safetyBody:
      'Always ask an adult for help with scissors, glue, and other craft tools. Never use sharp objects without supervision!',
    materialsNeeded: '🎨 Materials Needed:',
    instructions: '📋 Step-by-Step Instructions:',
    proTips: 'Pro Tips:',
    ideas: 'Ideas:',
    safetyRules: 'Safety Rules:',
    downloadGuide: 'Download Guide',
    downloadSuccess: 'Craft guide downloaded!',
    difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as Record<Difficulty, string>,
  },
  es: {
    heading: 'Rincón creativo de Eva',
    subheading: '¡Crea manualidades increíbles para dar vida a tus cuentos favoritos!',
    howToPlay: '✨ Cómo se juega ✨',
    howToPlaySteps: [
      'Elige un proyecto de la galería de abajo',
      'Lee la lista de materiales y reúne lo que necesitas',
      'Sigue las instrucciones paso a paso con cuidado',
      'Pide siempre ayuda a un adulto con tijeras y pegamento',
      '¡Diviértete creando y usa tu imaginación!',
    ],
    safetyFirst: '⚠️ ¡La seguridad primero!',
    safetyBody:
      '¡Pide siempre ayuda a un adulto con tijeras, pegamento y otras herramientas! Nunca uses objetos punzantes sin supervisión.',
    materialsNeeded: '🎨 Materiales necesarios:',
    instructions: '📋 Instrucciones paso a paso:',
    proTips: 'Consejos pro:',
    ideas: 'Ideas:',
    safetyRules: 'Reglas de seguridad:',
    downloadGuide: 'Descargar guía',
    downloadSuccess: '¡Guía descargada!',
    difficulty: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' } as Record<Difficulty, string>,
  },
  fr: {
    heading: 'Le coin créatif d\'Eva',
    subheading: 'Crée des bricolages incroyables pour donner vie à tes histoires préférées !',
    howToPlay: '✨ Comment ça marche ✨',
    howToPlaySteps: [
      'Choisis un projet dans la galerie ci-dessous',
      'Lis la liste du matériel et rassemble tes fournitures',
      'Suis les instructions étape par étape attentivement',
      'Demande toujours l\'aide d\'un adulte pour les ciseaux et la colle',
      'Amuse-toi à créer et laisse parler ton imagination !',
    ],
    safetyFirst: '⚠️ La sécurité avant tout !',
    safetyBody:
      'Demande toujours l\'aide d\'un adulte pour les ciseaux, la colle et autres outils. N\'utilise jamais d\'objets tranchants sans supervision !',
    materialsNeeded: '🎨 Matériel nécessaire :',
    instructions: '📋 Instructions étape par étape :',
    proTips: 'Astuces de pro :',
    ideas: 'Idées :',
    safetyRules: 'Règles de sécurité :',
    downloadGuide: 'Télécharger le guide',
    downloadSuccess: 'Guide téléchargé !',
    difficulty: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' } as Record<Difficulty, string>,
  },
};

function downloadCraftGuide(
  craftKey: CraftKey,
  localizedCraft: LocalizedCraft,
  meta: Craft,
  successLabel: string,
  toast: (msg: string) => void,
): void {
  const W = 800;
  const H = 1100;
  const RADIUS = 24;
  const HEADER_H = 180;
  const SIDE_PAD = 48;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Rounded-corner clip path
  ctx.beginPath();
  ctx.moveTo(RADIUS, 0);
  ctx.lineTo(W - RADIUS, 0);
  ctx.quadraticCurveTo(W, 0, W, RADIUS);
  ctx.lineTo(W, H - RADIUS);
  ctx.quadraticCurveTo(W, H, W - RADIUS, H);
  ctx.lineTo(RADIUS, H);
  ctx.quadraticCurveTo(0, H, 0, H - RADIUS);
  ctx.lineTo(0, RADIUS);
  ctx.quadraticCurveTo(0, 0, RADIUS, 0);
  ctx.closePath();
  ctx.clip();

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Coloured header bar
  ctx.fillStyle = meta.color;
  ctx.fillRect(0, 0, W, HEADER_H);

  // Craft emoji (large)
  ctx.font = '72px serif';
  ctx.textAlign = 'center';
  ctx.fillText(meta.emoji, W / 2, 80);

  // Craft title in header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(localizedCraft.title, W / 2, 148);

  // Body text helpers
  const lineH = 22;
  let y = HEADER_H + 36;

  function drawSectionHeading(label: string) {
    ctx!.fillStyle = meta.color;
    ctx!.font = 'bold 20px sans-serif';
    ctx!.textAlign = 'left';
    ctx!.fillText(label, SIDE_PAD, y);
    y += 8;
    ctx!.fillStyle = meta.color;
    ctx!.fillRect(SIDE_PAD, y, W - SIDE_PAD * 2, 2);
    y += 14;
  }

  function wrapText(text: string, maxW: number, fontSize: number, fontStyle: string): string[] {
    ctx!.font = `${fontStyle} ${fontSize}px sans-serif`;
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx!.measureText(test).width > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // -- Materials section --
  drawSectionHeading('Materials');
  ctx.fillStyle = '#374151';
  for (const mat of localizedCraft.materials) {
    const lines = wrapText(`- ${mat}`, W - SIDE_PAD * 2 - 16, 15, 'normal');
    for (const ln of lines) {
      ctx.font = '15px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#374151';
      ctx.fillText(ln, SIDE_PAD + 16, y);
      y += lineH;
    }
  }
  y += 16;

  // -- Steps section --
  drawSectionHeading('Steps');
  for (let i = 0; i < localizedCraft.steps.length; i++) {
    const step = localizedCraft.steps[i];
    // Step number badge
    ctx.fillStyle = meta.color;
    ctx.beginPath();
    ctx.arc(SIDE_PAD + 12, y - 4, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), SIDE_PAD + 12, y);
    // Step title (bold)
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(step.title, SIDE_PAD + 32, y);
    y += lineH;
    // Step description (wrapped)
    const descLines = wrapText(step.desc, W - SIDE_PAD * 2 - 32, 14, 'normal');
    ctx.fillStyle = '#4b5563';
    for (const ln of descLines) {
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(ln, SIDE_PAD + 32, y);
      y += lineH - 2;
    }
    y += 8;
  }

  // Footer watermark
  ctx.fillStyle = '#9ca3af';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('storytimewitheva.com', W / 2, H - 20);

  // Trigger download
  const link = document.createElement('a');
  link.download = `craft-guide-${craftKey}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  toast(successLabel);
}

export default function CraftCornerDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const crafts = CRAFTS_BY_LANG[language] ?? CRAFTS_BY_LANG.en;
  const toast = useToast();

  const [selectedCraft, setSelectedCraft] = useState<CraftKey | null>(null);
  const craft = selectedCraft ? crafts[selectedCraft] : null;
  const meta = selectedCraft ? CRAFT_META[selectedCraft] : null;

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.heading}</h2>
        <p className="text-gray-700 mb-4">{t.subheading}</p>
        <div className="text-5xl mb-4">✂️🎨</div>
      </div>

      <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h3 className="text-2xl font-bold mb-3 text-center">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToPlaySteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-red-800 block mb-1">{t.safetyFirst}</strong>
            <p className="text-red-700">{t.safetyBody}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {CRAFT_KEYS.map((key) => {
          const c = crafts[key];
          const m = CRAFT_META[key];
          return (
            <Card
              key={key}
              onClick={() => setSelectedCraft(key)}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-6xl mb-4 text-center">{m.emoji}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{c.title}</h3>
              <p className="text-gray-700 text-center mb-4">{c.description}</p>
              <div className="text-center">
                <span className={`inline-block px-4 py-2 rounded-full font-bold ${DIFFICULTY_COLOR[m.difficulty]}`}>
                  {t.difficulty[m.difficulty]}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {craft && meta && (
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-purple-300 overflow-hidden">
          <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedCraft(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
            <div className="text-6xl mb-4 text-center">{meta.emoji}</div>
            <h2 className="text-3xl font-bold text-center">{craft.title}</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">{t.materialsNeeded}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {craft.materials.map((item, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    ✓ {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{t.instructions}</h3>
              <div className="space-y-4">
                {craft.steps.map((step, idx) => (
                  <div key={idx} className="bg-gray-50 border-l-4 border-purple-400 rounded-r-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-r-xl p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-3">{t.proTips}</h3>
                  <ul className="space-y-2">
                    {craft.tips.map((tip, idx) => (
                      <li key={idx} className="text-gray-700">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {meta.ideas.length > 0 && (
              <div className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">{t.ideas}</h3>
                <div className="grid grid-cols-6 gap-4">
                  {meta.ideas.map((emoji, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 text-5xl text-center hover:scale-110 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {craft.safetyRules && (
              <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-red-800 mb-3">{t.safetyRules}</h3>
                    <ul className="space-y-2">
                      {craft.safetyRules.map((rule, idx) => (
                        <li key={idx} className="text-red-700">
                          • {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={() =>
                  downloadCraftGuide(
                    selectedCraft!,
                    craft,
                    meta,
                    t.downloadSuccess,
                    toast.success,
                  )
                }
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all"
              >
                <Download className="w-5 h-5" />
                {t.downloadGuide}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
