
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, AlertTriangle, Lightbulb } from "lucide-react";

export default function CraftCornerDemo({ language }) {
  const [selectedCraft, setSelectedCraft] = useState(null);

  const text = {
    en: {
      title: "Eva's Craft Corner",
      subtitle: "Create amazing crafts to bring your favorite stories to life!",
      howToPlayTitle: "How to Play",
      howToPlaySteps: [
        "Choose a craft project from the gallery below",
        "Read the materials list and gather your supplies",
        "Follow the step-by-step instructions carefully",
        "Always ask an adult for help with scissors and glue",
        "Have fun creating and use your imagination!"
      ],
      safetyNotice: "Safety First! Always ask an adult for help with scissors, glue, and other craft tools. Never use sharp objects without supervision!",
      materials: "Materials Needed:",
      steps: "Step-by-Step Instructions:",
      tips: "Pro Tips:",
      ideas: "Ideas:",
      safetyRules: "Safety Rules:",
      difficulty: {
        easy: "Easy",
        medium: "Medium",
        hard: "Hard"
      }
    },
    es: {
      title: "Rincón de Manualidades de Eva",
      subtitle: "¡Crea manualidades increíbles para dar vida a tus historias favoritas!",
      howToPlayTitle: "Cómo Jugar",
      howToPlaySteps: [
        "Elige un proyecto de manualidades de la galería de abajo",
        "Lee la lista de materiales y reúne tus suministros",
        "Sigue las instrucciones paso a paso con cuidado",
        "Siempre pide ayuda a un adulto con tijeras y pegamento",
        "¡Diviértete creando y usa tu imaginación!"
      ],
      safetyNotice: "¡Seguridad Primero! Siempre pide ayuda a un adulto con tijeras, pegamento y otras herramientas. ¡Nunca uses objetos afilados sin supervisión!",
      materials: "Materiales Necesarios:",
      steps: "Instrucciones Paso a Paso:",
      tips: "Consejos Pro:",
      ideas: "Ideas:",
      safetyRules: "Reglas de Seguridad:",
      difficulty: {
        easy: "Fácil",
        medium: "Medio",
        hard: "Difícil"
      }
    },
    fr: {
      title: "Coin Bricolage d'Eva",
      subtitle: "Créez des bricolages incroyables pour donner vie à vos histoires préférées!",
      howToPlayTitle: "Comment Jouer",
      howToPlaySteps: [
        "Choisissez un projet d'artisanat dans la galerie ci-dessous",
        "Lisez la liste des matériaux et rassemblez vos fournitures",
        "Suivez attentivement les instructions étape par étape",
        "Demandez toujours l'aide d'un adulte avec les ciseaux et la colle",
        "Amusez-vous à créer et utilisez votre imagination!"
      ],
      safetyNotice: "Sécurité d'abord! Demandez toujours l'aide d'un adulte avec les ciseaux, la colle et autres outils. N'utilisez jamais d'objets tranchants sans supervision!",
      materials: "Matériaux Nécessaires:",
      steps: "Instructions Étape par Étape:",
      tips: "Conseils Pro:",
      ideas: "Idées:",
      safetyRules: "Règles de Sécurité:",
      difficulty: {
        easy: "Facile",
        medium: "Moyen",
        hard: "Difficile"
      }
    }
  };

  const crafts = {
    mask: {
      emoji: '🎭',
      title: { en: 'Character Masks', es: 'Máscaras de Personajes', fr: 'Masques de Personnages' },
      description: { en: 'Make masks of your favorite story characters', es: 'Haz máscaras de tus personajes favoritos', fr: 'Créez des masques de vos personnages préférés' },
      difficulty: 'easy',
      materials: {
        en: ['Paper plates or cardstock', 'Markers or crayons', 'Scissors', 'Glue or tape', 'Elastic string or stick', 'Decorations (glitter, stickers)'],
        es: ['Platos de papel o cartulina', 'Marcadores o crayones', 'Tijeras', 'Pegamento o cinta', 'Cuerda elástica o palito', 'Decoraciones (brillantina, pegatinas)'],
        fr: ['Assiettes en papier ou carton', 'Marqueurs ou crayons', 'Ciseaux', 'Colle ou ruban', 'Ficelle élastique ou bâton', 'Décorations (paillettes, autocollants)']
      },
      steps: {
        en: [
          { title: 'Choose Your Character', desc: 'Pick a character from your favorite story. Think about animals (fox, bear, lion), fantasy creatures (dragon, fairy), or people (princess, knight, pirate).' },
          { title: 'Create the Base', desc: 'Use a paper plate as your mask base. Hold it up to your face and mark where your eyes should go. Ask an adult to help you cut out the eye holes with scissors.' },
          { title: 'Add Features', desc: 'Draw or glue on features like ears, nose, whiskers, or horns. Use construction paper for different colored parts. For an animal, add fuzzy ears on top. For a dragon, add horns and scales!' },
          { title: 'Color and Decorate', desc: 'Color your mask with markers, paint, or crayons. Add details like spots, stripes, or sparkles. Use glitter glue for magical characters or cotton balls for fluffy animals.' },
          { title: 'Attach the Holder', desc: 'Poke holes on each side of the mask and tie elastic string through them to wear it. Or tape a popsicle stick or ruler to one side to hold it like a handheld mask.' }
        ],
        es: [
          { title: 'Elige Tu Personaje', desc: 'Elige un personaje de tu historia favorita. Piensa en animales (zorro, oso, león), criaturas fantásticas (dragón, hada) o personas (princesa, caballero, pirata).' },
          { title: 'Crea la Base', desc: 'Usa un plato de papel como base. Sostenlo frente a tu cara y marca dónde deben ir tus ojos. Pide a un adulto que te ayude a cortar los agujeros de los ojos.' },
          { title: 'Agrega Características', desc: 'Dibuja o pega características como orejas, nariz, bigotes o cuernos. Usa papel de construcción para partes de diferentes colores.' },
          { title: 'Colorea y Decora', desc: 'Colorea tu máscara con marcadores, pintura o crayones. Agrega detalles como manchas, rayas o brillos.' },
          { title: 'Adjunta el Soporte', desc: 'Haz agujeros a cada lado de la máscara y ata una cuerda elástica para usarla. O pega un palito de helado a un lado.' }
        ],
        fr: [
          { title: 'Choisissez Votre Personnage', desc: 'Choisissez un personnage de votre histoire préférée. Pensez aux animaux (renard, ours, lion), créatures fantastiques (dragon, fée) ou personnes (princesse, chevalier, pirate).' },
          { title: 'Créez la Base', desc: 'Utilisez une assiette en papier comme base. Tenez-la devant votre visage et marquez où vos yeux doivent aller. Demandez à un adulte de vous aider à découper les trous pour les yeux.' },
          { title: 'Ajoutez des Caractéristiques', desc: 'Dessinez ou collez des caractéristiques comme des oreilles, un nez, des moustaches ou des cornes. Utilisez du papier de construction pour différentes parties colorées.' },
          { title: 'Coloriez et Décorez', desc: 'Coloriez votre masque avec des marqueurs, de la peinture ou des crayons. Ajoutez des détails comme des taches, des rayures ou des paillettes.' },
          { title: 'Attachez le Support', desc: 'Percez des trous de chaque côté du masque et attachez une ficelle élastique pour le porter. Ou collez un bâton de popsicle sur un côté.' }
        ]
      },
      tips: {
        en: ['Make it reversible! Decorate both sides for two characters', 'Add feathers, yarn, or fabric scraps for texture', 'Use aluminum foil for shiny knight or robot masks', 'Make a whole set for story time performances'],
        es: ['¡Hazlo reversible! Decora ambos lados para dos personajes', 'Agrega plumas, hilo o retazos de tela para textura', 'Usa papel aluminio para máscaras brillantes de caballero o robot', 'Haz un conjunto completo para representaciones'],
        fr: ['Rendez-le réversible! Décorez les deux côtés pour deux personnages', 'Ajoutez des plumes, du fil ou des chutes de tissu pour la texture', 'Utilisez du papier d\'aluminium pour des masques brillants de chevalier ou robot', 'Créez un ensemble complet pour les représentations']
      },
      ideas: ['🦊', '🦁', '🐉', '🦉', '🐻', '🐱']
    },
    puppet: {
      emoji: '🧦',
      title: { en: 'Story Puppets', es: 'Títeres de Historias', fr: 'Marionnettes d\'Histoire' },
      description: { en: 'Create puppets to act out stories', es: 'Crea títeres para actuar historias', fr: 'Créez des marionnettes pour jouer des histoires' },
      difficulty: 'easy',
      materials: {
        en: ['Paper bags or socks', 'Construction paper', 'Googly eyes', 'Markers', 'Glue', 'Yarn or fabric scraps'],
        es: ['Bolsas de papel o calcetines', 'Papel de construcción', 'Ojos móviles', 'Marcadores', 'Pegamento', 'Hilo o retazos de tela'],
        fr: ['Sacs en papier ou chaussettes', 'Papier de construction', 'Yeux mobiles', 'Marqueurs', 'Colle', 'Fil ou chutes de tissu']
      },
      steps: {
        en: [
          { title: 'Choose Your Base', desc: 'Pick a paper lunch bag or clean sock. Paper bags work great for animal mouths that open and close. Socks are perfect for long creatures like snakes or dragons!' },
          { title: 'Add the Face', desc: 'For paper bags: the fold at the bottom becomes the mouth. Glue eyes above the fold and a tongue inside. For socks: the toe becomes the mouth. Add eyes near the heel when your hand is inside.' },
          { title: 'Create Features', desc: 'Cut ears, horns, or wings from construction paper and glue them on. Add yarn for hair or a mane. Use felt or foam for a nose. Get creative with different textures!' },
          { title: 'Add Details', desc: 'Draw or glue on spots, stripes, scales, or feathers. Add whiskers with pipe cleaners. Use buttons for details. Make it look just like your character!' },
          { title: 'Practice and Perform', desc: 'Put your hand inside and practice moving the mouth. Make different voices for your character. Put on a puppet show to retell your favorite story!' }
        ],
        es: [
          { title: 'Elige Tu Base', desc: 'Elige una bolsa de papel o calcetín limpio. Las bolsas funcionan bien para bocas de animales que se abren y cierran. ¡Los calcetines son perfectos para criaturas largas!' },
          { title: 'Agrega la Cara', desc: 'Para bolsas: el pliegue inferior se convierte en la boca. Pega ojos arriba del pliegue y una lengua dentro. Para calcetines: el dedo del pie se convierte en la boca.' },
          { title: 'Crea Características', desc: 'Corta orejas, cuernos o alas del papel de construcción y pégalos. Agrega hilo para el cabello. Usa fieltro o espuma para la nariz.' },
          { title: 'Agrega Detalles', desc: 'Dibuja o pega manchas, rayas, escamas o plumas. Agrega bigotes con limpiapipas. Usa botones para detalles.' },
          { title: 'Practica y Presenta', desc: 'Pon tu mano dentro y practica mover la boca. Haz diferentes voces. ¡Presenta un show de títeres!' }
        ],
        fr: [
          { title: 'Choisissez Votre Base', desc: 'Choisissez un sac en papier ou une chaussette propre. Les sacs fonctionnent bien pour les bouches d\'animaux qui s\'ouvrent et se ferment. Les chaussettes sont parfaites pour les créatures longues!' },
          { title: 'Ajoutez le Visage', desc: 'Pour les sacs: le pli en bas devient la bouche. Collez les yeux au-dessus du pli et une langue à l\'intérieur. Pour les chaussettes: l\'orteil devient la bouche.' },
          { title: 'Créez des Caractéristiques', desc: 'Découpez des oreilles, des cornes ou des ailes dans du papier de construction et collez-les. Ajoutez du fil pour les cheveux.' },
          { title: 'Ajoutez des Détails', desc: 'Dessinez ou collez des taches, des rayures, des écailles ou des plumes. Ajoutez des moustaches avec des cure-pipes.' },
          { title: 'Pratiquez et Présentez', desc: 'Mettez votre main à l\'intérieur et entraînez-vous à bouger la bouche. Faites différentes voix. Montez un spectacle de marionnettes!' }
        ]
      },
      tips: {
        en: ['Make multiple characters for a full cast', 'Create a simple stage from a cardboard box', 'Record your puppet show to watch later', 'Invite friends to make puppets and perform together'],
        es: ['Haz múltiples personajes para un elenco completo', 'Crea un escenario simple de una caja de cartón', 'Graba tu show de títeres para verlo después', 'Invita amigos a hacer títeres y presentar juntos'],
        fr: ['Créez plusieurs personnages pour une distribution complète', 'Créez une scène simple à partir d\'une boîte en carton', 'Enregistrez votre spectacle de marionnettes', 'Invitez des amis à créer des marionnettes et jouer ensemble']
      },
      ideas: ['🐶', '🐸', '👹', '👸', '🤖', '🦕']
    },
    diorama: {
      emoji: '📦',
      title: { en: 'Story Diorama', es: 'Diorama de Historia', fr: 'Diorama d\'Histoire' },
      description: { en: 'Build a 3D scene from your book', es: 'Construye una escena 3D de tu libro', fr: 'Construisez une scène 3D de votre livre' },
      difficulty: 'medium',
      materials: {
        en: ['Shoebox', 'Construction paper', 'Small toys or clay', 'Scissors and glue', 'Markers or paint', 'Nature items (twigs, pebbles)'],
        es: ['Caja de zapatos', 'Papel de construcción', 'Juguetes pequeños o arcilla', 'Tijeras y pegamento', 'Marcadores o pintura', 'Elementos naturales (ramitas, piedras)'],
        fr: ['Boîte à chaussures', 'Papel de construcción', 'Petits jouets ou argile', 'Ciseaux et colle', 'Marqueurs ou peinture', 'Éléments naturels (brindilles, cailloux)']
      },
      steps: {
        en: [
          { title: 'Pick Your Scene', desc: 'Choose your favorite scene from a book. Is it in a forest, castle, underwater, or outer space? Think about what makes that place special.' },
          { title: 'Prepare the Box', desc: 'Turn your shoebox on its side so you can see inside. This is your stage! You can cut a window in the lid to look through, or leave it open.' },
          { title: 'Create the Background', desc: 'Draw or paint the back wall. Add sky, trees, buildings, or whatever fits your scene. Use blue for sky, green for grass, or black for night scenes. Make it colorful!' },
          { title: 'Add the Ground', desc: 'Cover the bottom with paper, sand, cotton (for snow), or grass. Add rocks, sticks, or other natural items. Create layers to make it look realistic!' },
          { title: 'Place Characters and Objects', desc: 'Add characters made from clay, paper cutouts, or small toys. Include important objects from the story like a castle, treasure chest, or magic lamp. Make tabs on paper figures so they stand up.' }
        ],
        es: [
          { title: 'Elige Tu Escena', desc: 'Elige tu escena favorita de un libro. ¿Está en un bosque, castillo, bajo el agua o en el espacio exterior? Piensa en qué hace especial ese lugar.' },
          { title: 'Prepara la Caja', desc: 'Voltea tu caja de zapatos de lado para que puedas ver adentro. ¡Este es tu escenario! Puedes cortar una ventana en la tapa o dejarla abierta.' },
          { title: 'Crea el Fondo', desc: 'Dibuja o pinta la pared trasera. Agrega cielo, árboles, edificios o lo que se ajuste a tu escena. Usa azul para el cielo, verde para el pasto.' },
          { title: 'Agrega el Suelo', desc: 'Cubre el fondo con papel, arena, algodón (para nieve) o hierba. Agrega rocas, palos u otros elementos naturales.' },
          { title: 'Coloca Personajes y Objetos', desc: 'Agrega personajes hechos de arcilla, recortes de papel o juguetes pequeños. Incluye objetos importantes de la historia.' }
        ],
        fr: [
          { title: 'Choisissez Votre Scène', desc: 'Choisissez votre scène préférée d\'un livre. Est-ce dans une forêt, un château, sous l\'eau ou dans l\'espace? Pensez à ce qui rend cet endroit spécial.' },
          { title: 'Préparez la Boîte', desc: 'Tournez votre boîte à chaussures sur le côté pour voir à l\'intérieur. C\'est votre scène! Vous pouvez découper une fenêtre dans le couvercle ou la laisser ouverte.' },
          { title: 'Créez l\'Arrière-Plan', desc: 'Dessinez ou peignez le mur arrière. Ajoutez le ciel, les arbres, les bâtiments ou ce qui convient à votre scène.' },
          { title: 'Ajoutez le Sol', desc: 'Couvrez le fond avec du papier, du sable, du coton (pour la neige) ou de l\'herbe. Ajoutez des roches, des bâtons.' },
          { title: 'Placez les Personnages et Objets', desc: 'Ajoutez des personnages en argile, découpages en papier ou petits jouets. Incluez des objets importants de l\'histoire.' }
        ]
      },
      tips: {
        en: ['Add cotton clouds hanging from the top', 'Use aluminum foil for water or ice', 'Poke holes in the top for "stars" with light shining through', 'Make it interactive - move characters around to retell the story'],
        es: ['Agrega nubes de algodón colgando desde arriba', 'Usa papel aluminio para agua o hielo', 'Haz agujeros en la parte superior para "estrellas"', 'Hazlo interactivo - mueve personajes para recontar la historia'],
        fr: ['Ajoutez des nuages en coton suspendus en haut', 'Utilisez du papier d\'aluminium pour l\'eau ou la glace', 'Faites des trous en haut pour des "étoiles"', 'Rendez-lo interactif - déplacez les personnages pour raconter l\'histoire']
      },
      ideas: []
    },
    crown: {
      emoji: '👑',
      title: { en: 'Royal Crown', es: 'Corona Real', fr: 'Couronne Royale' },
      description: { en: 'Make a crown for kings and queens', es: 'Haz una corona para reyes y reinas', fr: 'Créez une couronne pour rois et reines' },
      difficulty: 'easy',
      materials: {
        en: ['Yellow or gold cardstock', 'Scissors', 'Glue or tape', 'Gems, sequins, or glitter', 'Markers', 'Stapler (optional)'],
        es: ['Cartulina amarilla o dorada', 'Tijeras', 'Pegamento o cinta', 'Gemas, lentejuelas o brillantina', 'Marcadores', 'Engrapadora (opcional)'],
        fr: ['Carton jaune ou doré', 'Ciseaux', 'Colle ou ruban', 'Gemmes, paillettes ou brillants', 'Marqueurs', 'Agrafeuse (optionnelle)']
      },
      steps: {
        en: [
          { title: 'Cut the Strip', desc: 'Cut a long strip of cardstock about 3 inches tall. Make it long enough to fit around your head (about 22-24 inches). If needed, tape two strips together.' },
          { title: 'Create the Points', desc: 'Along the top edge, cut zigzag points to make the crown\'s peaks. Make them as tall or short as you like. You can also cut fancy curved shapes!' },
          { title: 'Decorate', desc: 'Glue on plastic gems, sequins, buttons, or draw jewels with markers. Add glitter glue for extra sparkle. Make patterns or write your name on it!' },
          { title: 'Size and Attach', desc: 'Wrap the crown around your head to check the fit. Overlap the ends and staple or tape them together. Now you\'re royalty!' }
        ],
        es: [
          { title: 'Corta la Tira', desc: 'Corta una tira larga de cartulina de aproximadamente 3 pulgadas de alto. Hazla lo suficientemente larga para que quepa alrededor de tu cabeza (aproximadamente 22-24 pulgadas).' },
          { title: 'Crea los Puntos', desc: 'A lo largo del borde superior, corta puntos en zigzag para hacer los picos de la corona. Hazlos tan altos o cortos como quieras.' },
          { title: 'Decora', desc: 'Pega gemas plásticas, lentejuelas, botones o dibuja joyas con marcadores. Agrega pegamento con brillantina para un brillo extra.' },
          { title: 'Ajusta y Une', desc: 'Envuelve la corona alrededor de tu cabeza para verificar el ajuste. Superpón los extremos y engrapa o pégalos. ¡Ahora eres realeza!' }
        ],
        fr: [
          { title: 'Découpez la Bande', desc: 'Découpez une longue bande de carton d\'environ 3 pouces de haut. Rendez-la assez longue pour s\'adapter autour de votre tête (environ 22-24 pouces).' },
          { title: 'Créez les Pointes', desc: 'Le long du bord supérieur, découpez des pointes en zigzag pour faire les pics de la couronne. Faites-les aussi hautes ou courtes que vous le souhaitez.' },
          { title: 'Décorez', desc: 'Collez des gemmes en plastique, des paillettes, des boutons ou dessinez des bijoux avec des marqueurs. Ajoutez de la colle pailletée.' },
          { title: 'Ajustez et Attachez', desc: 'Enroulez la couronne autour de votre tête pour vérifier l\'ajustement. Superposez les extrémités et agrafez ou collez-les ensemble. Vous êtes maintenant royauté!' }
        ]
      },
      tips: {
        en: ['Use different colors for different characters (silver for queens, gold for kings)', 'Add feathers or flowers for a fancy look', 'Make matching crowns for story time friends', 'Layer different colored strips for a multi-tiered crown'],
        es: ['Usa diferentes colores para diferentes personajes (plata para reinas, oro para reyes)', 'Agrega plumas o flores para un look elegante', 'Haz coronas a juego para amigos', 'Superpón tiras de diferentes colores para una corona de varios niveles'],
        fr: ['Utilisez différentes couleurs pour différents personnages (argent pour les reines, or pour les rois)', 'Ajoutez des plumes ou des fleurs pour un look élégant', 'Créez des couronnes assorties pour les amis', 'Superposez des bandes de différentes couleurs']
      },
      ideas: []
    },
    wand: {
      emoji: '🪄',
      title: { en: 'Magic Wand', es: 'Varita Mágica', fr: 'Baguette Magique' },
      description: { en: 'Craft a magical wand for wizards', es: 'Crea una varita mágica para magos', fr: 'Créez une baguette magique pour sorciers' },
      difficulty: 'easy',
      materials: {
        en: ['Wooden dowel or pencil', 'Cardstock or foam', 'Ribbon or streamers', 'Glue gun (with adult help)', 'Glitter and paint', 'Star template'],
        es: ['Varilla de madera o lápiz', 'Cartulina o espuma', 'Cinta o serpentinas', 'Pistola de pegamento (con ayuda de adulto)', 'Brillantina y pintura', 'Plantilla de estrella'],
        fr: ['Tige en bois ou crayon', 'Carton ou mousse', 'Ruban ou serpentins', 'Pistolet à colle (avec aide adulte)', 'Paillettes et peinture', 'Modèle d\'étoile']
      },
      steps: {
        en: [
          { title: 'Prepare the Stick', desc: 'Use a wooden dowel, chopstick, or even a sturdy cardboard tube. Paint it in magical colors like gold, silver, purple, or rainbow! Let it dry completely.' },
          { title: 'Create the Star', desc: 'Cut two star shapes from cardstock or foam (front and back). Decorate them with glitter, gems, or markers. Make them sparkle!' },
          { title: 'Attach the Star', desc: 'With adult help using a glue gun, sandwich the top of your stick between the two star shapes. Hold until secure. Let it dry completely.' },
          { title: 'Add Ribbons', desc: 'Tie colorful ribbons or streamers just below the star. Use 5-6 ribbons about 12 inches long. They\'ll flutter when you wave your wand!' },
          { title: 'Final Touches', desc: 'Wrap the handle with ribbon or yarn for a better grip. Add extra glitter, stickers, or paint details. Now cast your spells!' }
        ],
        es: [
          { title: 'Prepara el Palo', desc: 'Usa una varilla de madera, palillo chino o un tubo de cartón resistente. ¡Píntalo en colores mágicos como dorado, plateado, púrpura o arcoíris!' },
          { title: 'Crea la Estrella', desc: 'Corta dos formas de estrella de cartulina o espuma (frente y atrás). Decóralas con brillantina, gemas o marcadores.' },
          { title: 'Adjunta la Estrella', desc: 'Con ayuda de un adulto usando una pistola de pegamento, coloca la parte superior de tu palo entre las dos formas de estrella.' },
          { title: 'Agrega Cintas', desc: 'Ata cintas coloridas o serpentinas justo debajo de la estrella. Usa 5-6 cintas de aproximadamente 12 pulgadas de largo.' },
          { title: 'Toques Finales', desc: 'Envuelve el mango con cinta o hilo para un mejor agarre. Agrega brillantina extra, pegatinas o detalles de pintura. ¡Ahora lanza tus hechizos!' }
        ],
        fr: [
          { title: 'Préparez le Bâton', desc: 'Utilisez une tige en bois, une baguette ou un tube en carton solide. Peignez-le en couleurs magiques comme or, argent, violet ou arc-en-ciel!' },
          { title: 'Créez l\'Étoile', desc: 'Découpez deux formes d\'étoile en carton ou mousse (avant et arrière). Décorez-les avec des paillettes, des gemmes ou des marqueurs.' },
          { title: 'Attachez l\'Étoile', desc: 'Avec l\'aide d\'un adulte utilisant un pistolet à colle, placez le haut de votre bâton entre les deux formes d\'étoile.' },
          { title: 'Ajoutez des Rubans', desc: 'Attachez des rubans colorés ou des serpentins juste en dessous de l\'étoile. Utilisez 5-6 rubans d\'environ 12 pouces de long.' },
          { title: 'Touches Finales', desc: 'Enroulez le manche avec du ruban ou du fil pour une meilleure prise. Ajoutez des paillettes supplémentaires, des autocollants. Lancez vos sorts!' }
        ]
      },
      tips: {
        en: ['Make different shapes - hearts, moons, or flowers instead of stars', 'Add bells to the ribbons for sound effects', 'Use glow-in-the-dark paint for nighttime magic', 'Create a matching spell book with construction paper'],
        es: ['Haz diferentes formas - corazones, lunas o flores en lugar de estrellas', 'Agrega campanas a las cintas para efectos de sonido', 'Usa pintura que brilla en la oscuridad para magia nocturna', 'Crea un libro de hechizos a juego con papel de construcción'],
        fr: ['Créez différentes formes - cœurs, lunes ou fleurs au lieu d\'étoiles', 'Ajoutez des cloches aux rubans pour des effets sonores', 'Utilisez de la peinture phosphorescente pour la magie nocturne', 'Créez un livre de sorts assorti avec du papier de construction']
      },
      ideas: []
    },
    cape: {
      emoji: '🦸',
      title: { en: 'Hero Cape', es: 'Capa de Héroe', fr: 'Cape de Héros' },
      description: { en: 'Design a superhero or wizard cape', es: 'Diseña una capa de superhéroe o mago', fr: 'Concevez une cape de super-héros ou sorcier' },
      difficulty: 'medium',
      materials: {
        en: ['Large piece of fabric or old pillowcase', 'Ribbon for ties', 'Fabric markers or paint', 'Iron-on patches (optional)', 'Scissors', 'Safety pins'],
        es: ['Pieza grande de tela o funda de almohada vieja', 'Cinta para atar', 'Marcadores de tela o pintura', 'Parches termoadhesivos (opcional)', 'Tijeras', 'Alfileres de seguridad'],
        fr: ['Grand morceau de tissu ou vieille taie d\'oreiller', 'Ruban pour attaches', 'Marqueurs de tissu ou peinture', 'Patchs thermocollants (optionnel)', 'Ciseaux', 'Épingles de sûreté']
      },
      steps: {
        en: [
          { title: 'Choose Your Fabric', desc: 'Use a pillowcase, old t-shirt, or piece of fabric. Red for superheroes, purple for wizards, black for mysterious characters. The fabric should be about 2-3 feet long.' },
          { title: 'Cut and Shape', desc: 'If using a pillowcase, cut open the closed end. Round the bottom corners for a classic cape shape, or cut a zigzag edge for drama! Keep it simple - no complicated sewing needed.' },
          { title: 'Add Tie Strings', desc: 'Attach two pieces of ribbon to the top corners (adult help may be needed for safety pins or simple stitches). Make them long enough to tie comfortably around your neck.' },
          { title: 'Decorate Your Cape', desc: 'Use fabric markers to draw your logo, initial, or favorite symbol. Add iron-on patches with adult help. Use fabric paint for patterns, stars, or lightning bolts!' },
          { title: 'Safety Check', desc: 'Make sure the cape isn\'t too long - it should end above your knees so you don\'t trip. Use breakaway ties or velcro that come apart easily. Never tie capes too tight!' }
        ],
        es: [
          { title: 'Elige Tu Tela', desc: 'Usa una funda de almohada, camiseta vieja o pieza de tela. Rojo para superhéroes, púrpura para magos, negro para personajes misteriosos.' },
          { title: 'Corta y Da Forma', desc: 'Si usas una funda de almohada, corta el extremo cerrado. Redondea las esquinas inferiores para una forma clásica de capa.' },
          { title: 'Agrega Cintas de Amarre', desc: 'Adjunta dos piezas de cinta a las esquinas superiores (puede ser necesaria ayuda de un adulto). Hazlas lo suficientemente largas para atar cómodamente alrededor del cuello.' },
          { title: 'Decora Tu Capa', desc: 'Usa marcadores de tela para dibujar tu logo, inicial o símbolo favorito. Agrega parches termoadhesivos con ayuda de un adulto.' },
          { title: 'Verificación de Seguridad', desc: 'Asegúrate de que la capa no sea demasiado larga - debe terminar por encima de las rodillas. Usa amarres que se separen fácilmente. ¡Nunca ates capas demasiado apretadas!' }
        ],
        fr: [
          { title: 'Choisissez Votre Tissu', desc: 'Utilisez une taie d\'oreiller, un vieux t-shirt ou un morceau de tissu. Rouge pour les super-héros, violet pour les sorciers, noir pour les personnages mystérieux.' },
          { title: 'Découpez et Façonnez', desc: 'Si vous utilisez une taie d\'oreiller, coupez l\'extrémité fermée. Arrondissez les coins inférieurs pour une forme de cape classique.' },
          { title: 'Ajoutez des Ficelles d\'Attache', desc: 'Attachez deux morceaux de ruban aux coins supérieurs (l\'aide d\'un adulte peut être nécessaire). Rendez-les assez longs pour attacher confortablement autour du cou.' },
          { title: 'Décorez Votre Cape', desc: 'Utilisez des marqueurs de tissu pour dessiner votre logo, initiale ou symbole préféré. Ajoutez des patchs thermocollants avec l\'aide d\'un adulte.' },
          { title: 'Vérification de Sécurité', desc: 'Assurez-vous que la cape n\'est pas trop longue - elle devrait se terminer au-dessus des genoux. Utilisez des attaches séparables. Ne jamais attacher les capes trop serrées!' }
        ]
      },
      tips: {
        en: ['Make it reversible - decorate both sides!', 'Add sequins or glitter for a sparkly wizard cape', 'Use glow-in-the-dark paint for night heroes', 'Create a collar using felt for extra style'],
        es: ['Hazla reversible - ¡decora ambos lados!', 'Agrega lentejuelas o brillantina para una capa de mago brillante', 'Usa pintura que brilla en la oscuridad para héroes nocturnos', 'Crea un cuello usando fieltro para estilo extra'],
        fr: ['Rendez-la réversible - décorez les deux côtés!', 'Ajoutez des paillettes ou des brillants pour une cape de sorcier étincelante', 'Utilisez de la peinture phosphorescente pour les héros nocturnes', 'Créez un col en utilisant du feutre pour un style supplémentaire']
      },
      safetyRules: {
        en: ['Never wear capes near stairs or while climbing', 'Remove capes before playing on playground equipment', 'Make sure ties break away easily - never use permanent attachments', 'Always have adult supervision when wearing capes'],
        es: ['Nunca uses capas cerca de escaleras o mientras escalas', 'Quítate las capas antes de jugar en equipos de juegos', 'Asegúrate de que los amarres se separen fácilmente', 'Siempre ten supervisión de un adulto cuando uses capas'],
        fr: ['Ne portez jamais de capes près des escaliers ou en grimpant', 'Retirez les capes avant de jouer sur les équipements de jeu', 'Assurez-vous que les attaches se séparent facilement', 'Ayez toujours la supervision d\'un adulte en portant des capes']
      },
      ideas: []
    }
  };

  const t = text[language] || text.en;

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-200 text-green-800',
      medium: 'bg-yellow-200 text-yellow-800',
      hard: 'bg-orange-200 text-orange-800'
    };
    return colors[difficulty] || colors.easy;
  };

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl p-6 md:p-8 max-h-[70vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h3>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">✂️🎨</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-2xl p-6 mb-6">
        <h4 className="text-2xl font-bold mb-3 text-center">✨ {t.howToPlayTitle} ✨</h4>
        <ol className="list-decimal list-inside space-y-2 text-lg">
          {t.howToPlaySteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Safety Notice */}
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <strong className="text-red-800 block mb-1">⚠️ {t.safetyNotice.split('!')[0]}!</strong>
            <p className="text-red-700">{t.safetyNotice.split('!')[1]}</p>
          </div>
        </div>
      </div>

      {/* Craft Gallery */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(crafts).map(([key, craft]) => (
          <Card
            key={key}
            onClick={() => setSelectedCraft(key)}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-6xl mb-4 text-center">{craft.emoji}</div>
            <h4 className="text-xl font-bold text-gray-800 mb-2 text-center">
              {craft.title[language]}
            </h4>
            <p className="text-gray-700 text-center mb-4">
              {craft.description[language]}
            </p>
            <div className="text-center">
              <span className={`inline-block px-4 py-2 rounded-full font-bold ${getDifficultyColor(craft.difficulty)}`}>
                {t.difficulty[craft.difficulty]}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Craft Detail Modal */}
      {selectedCraft && (
        <Dialog open={!!selectedCraft} onOpenChange={() => setSelectedCraft(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white -m-6 mb-0 p-8 rounded-t-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCraft(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
              <div className="text-6xl mb-4 text-center">{crafts[selectedCraft].emoji}</div>
              <DialogTitle className="text-3xl text-center">
                {crafts[selectedCraft].title[language]}
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6">
              {/* Materials */}
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-2xl p-6">
                <h4 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  🎨 {t.materials}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {crafts[selectedCraft].materials[language].map((item, idx) => (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h4 className="text-2xl font-bold mb-4 text-gray-800">
                  📋 {t.steps}
                </h4>
                <div className="space-y-4">
                  {crafts[selectedCraft].steps[language].map((step, idx) => (
                    <div key={idx} className="bg-gray-50 border-l-6 border-purple-400 rounded-r-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h5>
                          <p className="text-gray-700 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-yellow-100 border-l-6 border-yellow-500 rounded-r-xl p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-gray-800 mb-3">{t.tips}</h4>
                    <ul className="space-y-2">
                      {crafts[selectedCraft].tips[language].map((tip, idx) => (
                        <li key={idx} className="text-gray-700">• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Character Ideas */}
              {crafts[selectedCraft].ideas.length > 0 && (
                <div className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white rounded-2xl p-6">
                  <h4 className="text-2xl font-bold mb-4 text-center">{t.ideas}</h4>
                  <div className="grid grid-cols-6 gap-4">
                    {crafts[selectedCraft].ideas.map((emoji, idx) => (
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

              {/* Safety Rules for Cape */}
              {selectedCraft === 'cape' && crafts[selectedCraft].safetyRules && (
                <div className="bg-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg text-red-800 mb-3">{t.safetyRules}</h4>
                      <ul className="space-y-2">
                        {crafts[selectedCraft].safetyRules[language].map((rule, idx) => (
                          <li key={idx} className="text-red-700">• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
