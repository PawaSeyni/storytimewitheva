import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil } from 'lucide-react';
import { useTranslation } from '../lib/language';
import LittleReaderToggle from '../components/LittleReaderToggle';
import ReadAloudButton from '../components/ReadAloudButton';

const TRANSLATIONS = {
  en: {
    title: "Eva's Character Creation Workshop",
    subtitle: 'Follow these fun steps to bring your character to life!',
    howToPlay: '✨ How to Play ✨',
    howToList: [
      'Follow each step to design your unique character',
      'Choose their type, give them a name, and design their look',
      'Pick personality traits and special powers',
      'Create their backstory and goals',
      'See your complete character summary at the end!',
    ],
    step1: 'Choose Your Character Type',
    step2: 'Give Them a Name',
    step3: 'Design Their Look',
    step4: 'Create Their Personality',
    step5: 'Give Them Special Powers',
    step6: 'Create Their Story',
    step7: 'Draw Your Character!',
    types: ['Hero', 'Creature', 'Royalty', 'Wizard', 'Robot', 'Fairy'],
    traits: ['Friendly', 'Brave', 'Smart', 'Funny', 'Kind', 'Mysterious', 'Energetic', 'Gentle'],
    namePlaceholder: "Type your character's name here...",
    colors: 'Colors:',
    colorsPlaceholder: 'What colors will they wear?',
    eyes: 'Eyes:',
    eyesPlaceholder: 'Big? Small? Sparkly?',
    features: 'Hair/Features:',
    featuresPlaceholder: 'Curly hair? Wings? Horns?',
    outfit: 'Outfit:',
    outfitPlaceholder: 'What do they wear?',
    appearanceTip: '🌟 Characters with unique features are easier to remember!',
    pickTraits: 'Pick 3 personality traits!',
    traitsSelected: 'selected',
    powersPlaceholder: 'What makes your character special?',
    homeLabel: '🏠 Where do they live?',
    homePlaceholder: 'A castle? The forest? Space?',
    lovesLabel: '❤️ What do they love?',
    lovesPlaceholder: 'Adventure? Reading? Helping others?',
    fearsLabel: '😰 What are they afraid of?',
    fearsPlaceholder: 'Even heroes have fears!',
    goalLabel: "🎯 What's their goal?",
    goalPlaceholder: 'What do they want to achieve?',
    drawTip: 'Grab some paper and colored pencils to draw your character!',
    seeSummary: 'See My Character Summary!',
    summaryHeading: '🎉 Your Amazing Character! 🎉',
    name: 'Name',
    type: 'Type',
    appearance: 'Appearance',
    personality: 'Personality',
    powers: 'Powers',
    home: 'Home',
    loves: 'Loves',
    fears: 'Fears',
    goal: 'Goal',
    defaultCharName: 'My Character',
    yourCharacter: 'your character',
    summaryClosingPrefix: '✨ Now you\'re ready to write stories about',
    summaryClosingSuffix: '! ✨',
    colorsSuffix: 'colors',
    eyesSuffix: 'eyes',
    wearing: 'wearing',
  },
  es: {
    title: 'Taller de creación de personajes con Eva',
    subtitle: '¡Sigue estos pasos divertidos para dar vida a tu personaje!',
    howToPlay: '✨ Cómo jugar ✨',
    howToList: [
      'Sigue cada paso para diseñar tu personaje único',
      'Elige su tipo, dale un nombre y diseña su aspecto',
      'Elige rasgos de personalidad y poderes especiales',
      'Crea su historia y sus metas',
      '¡Mira el resumen completo de tu personaje al final!',
    ],
    step1: 'Elige el tipo de personaje',
    step2: 'Dale un nombre',
    step3: 'Diseña su aspecto',
    step4: 'Crea su personalidad',
    step5: 'Dale poderes especiales',
    step6: 'Crea su historia',
    step7: '¡Dibuja tu personaje!',
    types: ['Héroe', 'Criatura', 'Realeza', 'Mago', 'Robot', 'Hada'],
    traits: ['Amable', 'Valiente', 'Inteligente', 'Divertido', 'Bondadoso', 'Misterioso', 'Enérgico', 'Tierno'],
    namePlaceholder: 'Escribe el nombre de tu personaje aquí...',
    colors: 'Colores:',
    colorsPlaceholder: '¿Qué colores llevará?',
    eyes: 'Ojos:',
    eyesPlaceholder: '¿Grandes? ¿Pequeños? ¿Brillantes?',
    features: 'Pelo / rasgos:',
    featuresPlaceholder: '¿Pelo rizado? ¿Alas? ¿Cuernos?',
    outfit: 'Ropa:',
    outfitPlaceholder: '¿Qué lleva puesto?',
    appearanceTip: '🌟 ¡Los personajes con rasgos únicos son más fáciles de recordar!',
    pickTraits: '¡Elige 3 rasgos de personalidad!',
    traitsSelected: 'elegidos',
    powersPlaceholder: '¿Qué hace especial a tu personaje?',
    homeLabel: '🏠 ¿Dónde vive?',
    homePlaceholder: '¿En un castillo? ¿El bosque? ¿El espacio?',
    lovesLabel: '❤️ ¿Qué le encanta?',
    lovesPlaceholder: '¿La aventura? ¿Leer? ¿Ayudar a los demás?',
    fearsLabel: '😰 ¿A qué le tiene miedo?',
    fearsPlaceholder: '¡Hasta los héroes tienen miedos!',
    goalLabel: '🎯 ¿Cuál es su meta?',
    goalPlaceholder: '¿Qué quiere conseguir?',
    drawTip: '¡Coge papel y lápices de colores para dibujar a tu personaje!',
    seeSummary: '¡Ver el resumen de mi personaje!',
    summaryHeading: '🎉 ¡Tu increíble personaje! 🎉',
    name: 'Nombre',
    type: 'Tipo',
    appearance: 'Apariencia',
    personality: 'Personalidad',
    powers: 'Poderes',
    home: 'Hogar',
    loves: 'Le encanta',
    fears: 'Miedos',
    goal: 'Meta',
    defaultCharName: 'Mi personaje',
    yourCharacter: 'tu personaje',
    summaryClosingPrefix: '✨ ¡Ya estás listo para escribir historias sobre',
    summaryClosingSuffix: '! ✨',
    colorsSuffix: 'de colores',
    eyesSuffix: 'ojos',
    wearing: 'con',
  },
  fr: {
    title: 'Atelier de création de personnages avec Eva',
    subtitle: 'Suis ces étapes amusantes pour donner vie à ton personnage !',
    howToPlay: '✨ Comment jouer ✨',
    howToList: [
      'Suis chaque étape pour concevoir ton personnage unique',
      'Choisis son type, donne-lui un nom et dessine son apparence',
      'Choisis des traits de personnalité et des pouvoirs spéciaux',
      'Crée son histoire et ses objectifs',
      'Vois le résumé complet de ton personnage à la fin !',
    ],
    step1: 'Choisis le type de personnage',
    step2: 'Donne-lui un nom',
    step3: 'Dessine son apparence',
    step4: 'Crée sa personnalité',
    step5: 'Donne-lui des pouvoirs spéciaux',
    step6: 'Crée son histoire',
    step7: 'Dessine ton personnage !',
    types: ['Héros', 'Créature', 'Royauté', 'Magicien', 'Robot', 'Fée'],
    traits: ['Sympa', 'Courageux', 'Malin', 'Drôle', 'Gentil', 'Mystérieux', 'Énergique', 'Doux'],
    namePlaceholder: 'Écris le nom de ton personnage ici...',
    colors: 'Couleurs :',
    colorsPlaceholder: 'Quelles couleurs portera-t-il ?',
    eyes: 'Yeux :',
    eyesPlaceholder: 'Grands ? Petits ? Pétillants ?',
    features: 'Cheveux / particularités :',
    featuresPlaceholder: 'Cheveux frisés ? Ailes ? Cornes ?',
    outfit: 'Tenue :',
    outfitPlaceholder: 'Que porte-t-il ?',
    appearanceTip: '🌟 Les personnages aux traits uniques sont plus faciles à retenir !',
    pickTraits: 'Choisis 3 traits de personnalité !',
    traitsSelected: 'choisis',
    powersPlaceholder: 'Qu\'est-ce qui rend ton personnage spécial ?',
    homeLabel: '🏠 Où vit-il ?',
    homePlaceholder: 'Un château ? La forêt ? L\'espace ?',
    lovesLabel: "❤️ Qu'est-ce qu'il adore ?",
    lovesPlaceholder: "L'aventure ? La lecture ? Aider les autres ?",
    fearsLabel: '😰 De quoi a-t-il peur ?',
    fearsPlaceholder: 'Même les héros ont des peurs !',
    goalLabel: '🎯 Quel est son objectif ?',
    goalPlaceholder: 'Que veut-il accomplir ?',
    drawTip: 'Prends du papier et des crayons de couleur pour dessiner ton personnage !',
    seeSummary: 'Voir le résumé de mon personnage !',
    summaryHeading: '🎉 Ton incroyable personnage ! 🎉',
    name: 'Nom',
    type: 'Type',
    appearance: 'Apparence',
    personality: 'Personnalité',
    powers: 'Pouvoirs',
    home: 'Maison',
    loves: 'Adore',
    fears: 'A peur de',
    goal: 'Objectif',
    defaultCharName: 'Mon personnage',
    yourCharacter: 'ton personnage',
    summaryClosingPrefix: "✨ Maintenant tu es prêt à écrire des histoires sur",
    summaryClosingSuffix: ' ! ✨',
    colorsSuffix: 'comme couleurs',
    eyesSuffix: 'yeux',
    wearing: 'avec',
  },
};

const TYPE_ICONS = ['🦸', '🐉', '👑', '🧙', '🤖', '🧚'];
const TRAIT_ICONS = ['😊', '💪', '🤓', '😂', '🤗', '🎭', '⚡', '🌸'];

// Module scope on purpose: a component created inside render is a new type on every
// render, which remounts its subtree and resets its state (react-hooks/static-components).
function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">{n}</div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Little reader mode (ages 4-5, pre-readers): four picture-only steps, no typing
// required, every question read aloud, and a finished picture card with one
// sentence assembled from the choices. Choices are stored as indexes so the card
// and sentence follow the current language.
// ---------------------------------------------------------------------------

interface LittleSentenceParts {
  name: string;
  kindNoun: string;
  kindPhrase: string;
  colorWord: string | null;
  colorPhrase: string | null;
  withPhrase: string | null;
  traits: string[];
  power: string | null;
}

/** "A", "A and B", "A, B and C" with the language's own "and". */
function joinList(items: string[], and: string): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

const LITTLE_KIND_ICONS = ['🐱', '🐶', '🧒', '🤖', '🐉', '🧚', '👾', '🦄'];
const LITTLE_COLOR_ICONS = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '💗', '🌈'];
const LITTLE_COLOR_BG = [
  'from-red-100 to-red-200',
  'from-orange-100 to-orange-200',
  'from-yellow-100 to-yellow-200',
  'from-green-100 to-green-200',
  'from-sky-100 to-blue-200',
  'from-purple-100 to-purple-200',
  'from-pink-100 to-pink-200',
  'from-red-100 via-yellow-100 to-sky-200',
];
const LITTLE_ACCESSORY_ICONS = ['🎩', '👑', '👓', '🎀', '🧣', '🎒'];
const LITTLE_TRAIT_ICONS = ['🦁', '💗', '😂', '🙈', '🔍', '🤗'];
const LITTLE_POWER_ICONS = ['🪽', '👻', '🐾', '⚡', '🌱', '🫧', '✨'];
const LITTLE_NAMES = ['Zip', 'Luna', 'Coco', 'Pip', 'Momo', 'Kiki'];
const LITTLE_MAX_TRAITS = 3;
const LITTLE_STEPS = 4; // the result card comes after these

const LITTLE_TRANSLATIONS = {
  en: {
    q1: 'Who is your character?',
    q2: 'What do they look like?',
    q2color: 'Pick a color.',
    q2acc: 'Pick one thing to wear.',
    q3: 'What are they like? Pick up to 3.',
    q4: 'What can they do?',
    nameQ: 'Do they have a name?',
    nameHint: 'Tap a name, or a grown-up can type one.',
    grownUpLabel: 'Grown-up: type a name',
    noName: 'No name',
    resultTitle: 'Here is your character!',
    back: 'Back',
    next: 'Next',
    done: 'All done!',
    startOver: 'Make another one',
    pickFirst: 'Tap a picture first.',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    listen: (what: string) => `Listen: ${what}`,
    and: 'and',
    or: 'or',
    kinds: [
      { label: 'Kitty', noun: 'kitty', phrase: 'a kitty' },
      { label: 'Puppy', noun: 'puppy', phrase: 'a puppy' },
      { label: 'Child', noun: 'child', phrase: 'a child' },
      { label: 'Robot', noun: 'robot', phrase: 'a robot' },
      { label: 'Dragon', noun: 'dragon', phrase: 'a dragon' },
      { label: 'Fairy', noun: 'fairy', phrase: 'a fairy' },
      { label: 'Monster', noun: 'monster', phrase: 'a monster' },
      { label: 'Unicorn', noun: 'unicorn', phrase: 'a unicorn' },
    ],
    colors: [
      { label: 'Red', word: 'red', phrase: 'red' },
      { label: 'Orange', word: 'orange', phrase: 'orange' },
      { label: 'Yellow', word: 'yellow', phrase: 'yellow' },
      { label: 'Green', word: 'green', phrase: 'green' },
      { label: 'Blue', word: 'blue', phrase: 'blue' },
      { label: 'Purple', word: 'purple', phrase: 'purple' },
      { label: 'Pink', word: 'pink', phrase: 'pink' },
      { label: 'Rainbow', word: 'rainbow', phrase: 'rainbow' },
    ],
    accessories: [
      { label: 'Hat', phrase: 'with a hat' },
      { label: 'Crown', phrase: 'with a crown' },
      { label: 'Glasses', phrase: 'with glasses' },
      { label: 'Bow', phrase: 'with a bow' },
      { label: 'Scarf', phrase: 'with a scarf' },
      { label: 'Backpack', phrase: 'with a backpack' },
    ],
    traits: ['brave', 'kind', 'funny', 'shy', 'curious', 'cuddly'],
    traitLabels: ['Brave', 'Kind', 'Funny', 'Shy', 'Curious', 'Cuddly'],
    powers: [
      { label: 'Fly', phrase: 'fly' },
      { label: 'Turn invisible', phrase: 'turn invisible' },
      { label: 'Talk to animals', phrase: 'talk to animals' },
      { label: 'Run super fast', phrase: 'run super fast' },
      { label: 'Make flowers grow', phrase: 'make flowers grow' },
      { label: 'Blow magic bubbles', phrase: 'blow magic bubbles' },
      { label: 'Glow in the dark', phrase: 'glow in the dark' },
    ],
    sentence: (p: LittleSentenceParts) => {
      const who = p.colorWord
        ? `${/^[aeiou]/i.test(p.colorWord) ? 'an' : 'a'} ${p.colorWord} ${p.kindNoun}`
        : p.kindPhrase;
      const clauses = [`is ${who}${p.withPhrase ? ` ${p.withPhrase}` : ''}`];
      if (p.traits.length) clauses.push(`is ${joinList(p.traits, 'and')}`);
      if (p.power) clauses.push(`can ${p.power}`);
      const joined = clauses.length === 3
        ? `${clauses[0]}, ${clauses[1]}, and ${clauses[2]}`
        : joinList(clauses, 'and');
      return `My character${p.name ? `, ${p.name},` : ''} ${joined}!`;
    },
  },
  es: {
    q1: '¿Quién es tu personaje?',
    q2: '¿De qué color es y qué lleva puesto?',
    q2color: 'Elige un color.',
    q2acc: 'Elige una cosa para ponerse.',
    q3: '¿Cómo es tu personaje? Elige hasta 3.',
    q4: '¿Qué sabe hacer?',
    nameQ: '¿Cómo se llama?',
    nameHint: 'Toca un nombre, o un adulto puede escribir uno.',
    grownUpLabel: 'Para adultos: escribe un nombre',
    noName: 'Sin nombre',
    resultTitle: '¡Aquí está tu personaje!',
    back: 'Atrás',
    next: 'Siguiente',
    done: '¡Listo!',
    startOver: 'Crear otro',
    pickFirst: 'Primero toca un dibujo.',
    stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
    listen: (what: string) => `Escuchar: ${what}`,
    and: 'y',
    or: 'o',
    kinds: [
      { label: 'Gatito', noun: 'gatito', phrase: 'un gatito' },
      { label: 'Perrito', noun: 'perrito', phrase: 'un perrito' },
      { label: 'Peque', noun: 'peque', phrase: 'un peque' },
      { label: 'Robot', noun: 'robot', phrase: 'un robot' },
      { label: 'Dragón', noun: 'dragón', phrase: 'un dragón' },
      { label: 'Hada', noun: 'hada', phrase: 'un hada' },
      { label: 'Monstruo', noun: 'monstruo', phrase: 'un monstruo' },
      { label: 'Unicornio', noun: 'unicornio', phrase: 'un unicornio' },
    ],
    // "de color rojo" agrees with "color", so it works for any character.
    colors: [
      { label: 'Rojo', word: 'rojo', phrase: 'de color rojo' },
      { label: 'Naranja', word: 'naranja', phrase: 'de color naranja' },
      { label: 'Amarillo', word: 'amarillo', phrase: 'de color amarillo' },
      { label: 'Verde', word: 'verde', phrase: 'de color verde' },
      { label: 'Azul', word: 'azul', phrase: 'de color azul' },
      { label: 'Morado', word: 'morado', phrase: 'de color morado' },
      { label: 'Rosa', word: 'rosa', phrase: 'de color rosa' },
      { label: 'Arcoíris', word: 'arcoíris', phrase: 'de todos los colores' },
    ],
    accessories: [
      { label: 'Sombrero', phrase: 'con un sombrero' },
      { label: 'Corona', phrase: 'con una corona' },
      { label: 'Gafas', phrase: 'con gafas' },
      { label: 'Lazo', phrase: 'con un lazo' },
      { label: 'Bufanda', phrase: 'con una bufanda' },
      { label: 'Mochila', phrase: 'con una mochila' },
    ],
    // Masculine forms: they describe "mi personaje".
    traits: ['valiente', 'amable', 'divertido', 'tímido', 'curioso', 'cariñoso'],
    traitLabels: ['Valiente', 'Amable', 'Divertido', 'Tímido', 'Curioso', 'Cariñoso'],
    powers: [
      { label: 'Volar', phrase: 'volar' },
      { label: 'Volverse invisible', phrase: 'volverse invisible' },
      { label: 'Hablar con los animales', phrase: 'hablar con los animales' },
      { label: 'Correr superrápido', phrase: 'correr superrápido' },
      { label: 'Hacer crecer flores', phrase: 'hacer crecer flores' },
      { label: 'Hacer burbujas mágicas', phrase: 'hacer burbujas mágicas' },
      { label: 'Brillar en la oscuridad', phrase: 'brillar en la oscuridad' },
    ],
    sentence: (p: LittleSentenceParts) => {
      const clauses = [`es ${p.kindPhrase}${p.colorPhrase ? ` ${p.colorPhrase}` : ''}${p.withPhrase ? ` ${p.withPhrase}` : ''}`];
      if (p.traits.length) clauses.push(`es ${joinList(p.traits, 'y')}`);
      if (p.power) clauses.push(`puede ${p.power}`);
      return `¡Mi personaje${p.name ? `, ${p.name},` : ''} ${joinList(clauses, 'y')}!`;
    },
  },
  fr: {
    q1: 'Qui est ton personnage ?',
    q2: 'De quelle couleur est-il et que porte-t-il ?',
    q2color: 'Choisis une couleur.',
    q2acc: 'Choisis une chose à porter.',
    q3: 'Comment est ton personnage ? Choisis-en jusqu’à 3.',
    q4: 'Qu’est-ce qu’il sait faire ?',
    nameQ: 'Comment s’appelle-t-il ?',
    nameHint: 'Touche un prénom, ou un adulte peut en écrire un.',
    grownUpLabel: 'Pour les adultes : écris un prénom',
    noName: 'Sans nom',
    resultTitle: 'Voici ton personnage !',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé !',
    startOver: 'En créer un autre',
    pickFirst: 'Touche d’abord une image.',
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    listen: (what: string) => `Écouter : ${what}`,
    and: 'et',
    or: 'ou',
    kinds: [
      { label: 'Chaton', noun: 'chaton', phrase: 'un chaton' },
      { label: 'Chiot', noun: 'chiot', phrase: 'un chiot' },
      { label: 'Enfant', noun: 'enfant', phrase: 'un enfant' },
      { label: 'Robot', noun: 'robot', phrase: 'un robot' },
      { label: 'Dragon', noun: 'dragon', phrase: 'un dragon' },
      { label: 'Fée', noun: 'fée', phrase: 'une fée' },
      { label: 'Monstre', noun: 'monstre', phrase: 'un monstre' },
      { label: 'Licorne', noun: 'licorne', phrase: 'une licorne' },
    ],
    // « de couleur bleue » agrees with « couleur », so it works for any character.
    colors: [
      { label: 'Rouge', word: 'rouge', phrase: 'de couleur rouge' },
      { label: 'Orange', word: 'orange', phrase: 'de couleur orange' },
      { label: 'Jaune', word: 'jaune', phrase: 'de couleur jaune' },
      { label: 'Vert', word: 'vert', phrase: 'de couleur verte' },
      { label: 'Bleu', word: 'bleu', phrase: 'de couleur bleue' },
      { label: 'Violet', word: 'violet', phrase: 'de couleur violette' },
      { label: 'Rose', word: 'rose', phrase: 'de couleur rose' },
      { label: 'Arc-en-ciel', word: 'arc-en-ciel', phrase: 'aux couleurs de l’arc-en-ciel' },
    ],
    accessories: [
      { label: 'Chapeau', phrase: 'avec un chapeau' },
      { label: 'Couronne', phrase: 'avec une couronne' },
      { label: 'Lunettes', phrase: 'avec des lunettes' },
      { label: 'Nœud', phrase: 'avec un nœud' },
      { label: 'Écharpe', phrase: 'avec une écharpe' },
      { label: 'Sac à dos', phrase: 'avec un sac à dos' },
    ],
    // Masculine forms: they describe « mon personnage ».
    traits: ['courageux', 'gentil', 'drôle', 'timide', 'curieux', 'câlin'],
    traitLabels: ['Courageux', 'Gentil', 'Drôle', 'Timide', 'Curieux', 'Câlin'],
    powers: [
      { label: 'Voler', phrase: 'voler' },
      { label: 'Devenir invisible', phrase: 'devenir invisible' },
      { label: 'Parler aux animaux', phrase: 'parler aux animaux' },
      { label: 'Courir super vite', phrase: 'courir super vite' },
      { label: 'Faire pousser des fleurs', phrase: 'faire pousser des fleurs' },
      { label: 'Faire des bulles magiques', phrase: 'faire des bulles magiques' },
      { label: 'Briller dans le noir', phrase: 'briller dans le noir' },
    ],
    sentence: (p: LittleSentenceParts) => {
      const clauses = [`est ${p.kindPhrase}${p.colorPhrase ? ` ${p.colorPhrase}` : ''}${p.withPhrase ? ` ${p.withPhrase}` : ''}`];
      if (p.traits.length) clauses.push(`est ${joinList(p.traits, 'et')}`);
      if (p.power) clauses.push(`peut ${p.power}`);
      return `Mon personnage${p.name ? `, ${p.name},` : ''} ${joinList(clauses, 'et')} !`;
    },
  },
};

interface LittleState {
  step: number; // 0..LITTLE_STEPS-1 are questions; LITTLE_STEPS is the result card
  kind: number | null;
  color: number | null;
  accessory: number | null;
  traits: number[];
  power: number | null;
  name: string;
}

const EMPTY_LITTLE: LittleState = { step: 0, kind: null, color: null, accessory: null, traits: [], power: null, name: '' };

/** Big picture button (at least 96px tall): emoji + word, aria-pressed, and a check mark so
 *  the selected state never depends on color alone. */
function PictureChoice({ icon, label, pressed, onClick, disabled = false }: {
  icon: string;
  label: string;
  pressed: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`relative flex min-h-24 min-w-[44px] flex-col items-center justify-center gap-1 rounded-2xl border-4 p-3 text-center font-bold motion-safe:transition-transform motion-safe:hover:scale-105 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${
        pressed ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-lg' : 'border-white bg-white text-gray-800 hover:border-purple-200'
      }`}
    >
      {pressed && (
        <span aria-hidden className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-base text-white">✓</span>
      )}
      <span aria-hidden className="text-5xl leading-none">{icon}</span>
      <span className="text-base leading-tight">{label}</span>
    </button>
  );
}

function LittleQuestion({ text, readText, headingRef }: { text: string; readText: string; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const l = useTranslation(LITTLE_TRANSLATIONS);
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-gray-800 focus:outline-hidden">{text}</h3>
      <ReadAloudButton text={readText} compact label={l.listen(text)} />
    </div>
  );
}

function LittleWorkshop({ state, setState }: { state: LittleState; setState: (next: LittleState) => void }) {
  const l = useTranslation(LITTLE_TRANSLATIONS);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);

  // Move focus to the new question after Back/Next, so keyboard and screen-reader
  // users land on it (not on first render, so the toggle keeps focus).
  useEffect(() => {
    if (navigated.current) headingRef.current?.focus();
  }, [state.step]);

  const update = (patch: Partial<LittleState>) => setState({ ...state, ...patch });
  const goTo = (step: number) => {
    navigated.current = true;
    update({ step });
  };
  const toggle = (current: number | null, i: number) => (current === i ? null : i);
  const toggleTrait = (i: number) => {
    if (state.traits.includes(i)) update({ traits: state.traits.filter(x => x !== i) });
    else if (state.traits.length < LITTLE_MAX_TRAITS) update({ traits: [...state.traits, i] });
  };

  const optionsText = (labels: string[]) => `${labels.slice(0, -1).join(', ')}, ${l.or} ${labels[labels.length - 1]}.`;
  const kindLabels = l.kinds.map(k => k.label);

  const sentence = state.kind === null ? '' : l.sentence({
    name: state.name.trim(),
    kindNoun: l.kinds[state.kind].noun,
    kindPhrase: l.kinds[state.kind].phrase,
    colorWord: state.color === null ? null : l.colors[state.color].word,
    colorPhrase: state.color === null ? null : l.colors[state.color].phrase,
    withPhrase: state.accessory === null ? null : l.accessories[state.accessory].phrase,
    traits: [...state.traits].sort((a, b) => a - b).map(i => l.traits[i]),
    power: state.power === null ? null : l.powers[state.power].phrase,
  });

  const canGoNext = state.step !== 0 || state.kind !== null;
  const atResult = state.step >= LITTLE_STEPS;

  return (
    <div className="rounded-2xl border-4 border-amber-300 bg-white/70 p-5 md:p-6">
      {!atResult && (
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span aria-hidden className="flex gap-1.5">
            {Array.from({ length: LITTLE_STEPS }, (_, i) => (
              <span key={i} className={`inline-block h-3 w-3 rounded-full border-2 border-purple-500 ${i <= state.step ? 'bg-purple-500' : 'bg-white'}`} />
            ))}
          </span>
          {l.stepOf(state.step + 1, LITTLE_STEPS)}
        </p>
      )}

      {state.step === 0 && (
        <section>
          <LittleQuestion headingRef={headingRef} text={l.q1} readText={`${l.q1} ${optionsText(kindLabels)}`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {l.kinds.map((k, i) => (
              <PictureChoice key={LITTLE_KIND_ICONS[i]} icon={LITTLE_KIND_ICONS[i]} label={k.label} pressed={state.kind === i} onClick={() => update({ kind: i })} />
            ))}
          </div>
        </section>
      )}

      {state.step === 1 && (
        <section>
          <LittleQuestion headingRef={headingRef} text={l.q2} readText={`${l.q2} ${l.q2color} ${l.q2acc}`} />
          <h4 className="mb-2 text-lg font-bold text-gray-700">{l.q2color}</h4>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {l.colors.map((c, i) => (
              <PictureChoice key={LITTLE_COLOR_ICONS[i]} icon={LITTLE_COLOR_ICONS[i]} label={c.label} pressed={state.color === i} onClick={() => update({ color: toggle(state.color, i) })} />
            ))}
          </div>
          <h4 className="mb-2 text-lg font-bold text-gray-700">{l.q2acc}</h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {l.accessories.map((a, i) => (
              <PictureChoice key={LITTLE_ACCESSORY_ICONS[i]} icon={LITTLE_ACCESSORY_ICONS[i]} label={a.label} pressed={state.accessory === i} onClick={() => update({ accessory: toggle(state.accessory, i) })} />
            ))}
          </div>
        </section>
      )}

      {state.step === 2 && (
        <section>
          <LittleQuestion headingRef={headingRef} text={l.q3} readText={`${l.q3} ${optionsText(l.traitLabels)}`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {l.traitLabels.map((label, i) => {
              const pressed = state.traits.includes(i);
              return (
                <PictureChoice
                  key={LITTLE_TRAIT_ICONS[i]}
                  icon={LITTLE_TRAIT_ICONS[i]}
                  label={label}
                  pressed={pressed}
                  disabled={!pressed && state.traits.length >= LITTLE_MAX_TRAITS}
                  onClick={() => toggleTrait(i)}
                />
              );
            })}
          </div>
          <p className="mt-3 text-center text-lg font-bold text-gray-700" aria-live="polite">
            <span aria-hidden>{Array.from({ length: LITTLE_MAX_TRAITS }, (_, i) => (i < state.traits.length ? '⭐' : '☆')).join(' ')}</span>
            <span className="sr-only">{state.traits.length}/{LITTLE_MAX_TRAITS}</span>
          </p>
        </section>
      )}

      {state.step === 3 && (
        <section>
          <LittleQuestion headingRef={headingRef} text={l.q4} readText={`${l.q4} ${optionsText(l.powers.map(p => p.label))}`} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {l.powers.map((p, i) => (
              <PictureChoice key={LITTLE_POWER_ICONS[i]} icon={LITTLE_POWER_ICONS[i]} label={p.label} pressed={state.power === i} onClick={() => update({ power: toggle(state.power, i) })} />
            ))}
          </div>
        </section>
      )}

      {atResult && state.kind !== null && (
        <section>
          <LittleQuestion headingRef={headingRef} text={l.resultTitle} readText={`${l.resultTitle} ${sentence}`} />
          <figure
            className={`mx-auto max-w-xl rounded-3xl border-4 border-purple-400 bg-linear-to-br p-6 text-center shadow-xl ${
              state.color === null ? 'from-purple-100 to-pink-100' : LITTLE_COLOR_BG[state.color]
            }`}
          >
            {state.name.trim() && <p className="mb-2 text-3xl font-extrabold text-purple-800">{state.name.trim()}</p>}
            <div aria-hidden className="relative mx-auto mb-3 w-fit">
              {state.accessory !== null && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl">{LITTLE_ACCESSORY_ICONS[state.accessory]}</span>}
              <span className="block pt-6 text-9xl leading-none motion-safe:animate-bounce">{LITTLE_KIND_ICONS[state.kind]}</span>
              {state.power !== null && <span className="absolute -right-10 bottom-0 text-5xl">{LITTLE_POWER_ICONS[state.power]}</span>}
              {state.color !== null && <span className="absolute -left-10 bottom-0 text-4xl">{LITTLE_COLOR_ICONS[state.color]}</span>}
            </div>
            {state.traits.length > 0 && (
              <p aria-hidden className="mb-3 text-4xl">{[...state.traits].sort((a, b) => a - b).map(i => LITTLE_TRAIT_ICONS[i]).join(' ')}</p>
            )}
            <figcaption className="text-xl font-bold leading-snug text-gray-800">{sentence}</figcaption>
            <div className="mt-4 flex justify-center">
              <ReadAloudButton text={sentence} compact label={l.listen(sentence)} />
            </div>
          </figure>

          <div className="mx-auto mt-6 max-w-xl">
            <LittleQuestion text={l.nameQ} readText={`${l.nameQ} ${l.nameHint}`} />
            <p className="mb-3 text-gray-700">{l.nameHint}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {LITTLE_NAMES.map(n => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={state.name === n}
                  onClick={() => update({ name: n })}
                  className={`min-h-[44px] rounded-full border-4 px-5 text-lg font-bold focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-500 ${
                    state.name === n ? 'border-purple-600 bg-purple-100 text-purple-900' : 'border-white bg-white text-gray-800 hover:border-purple-200'
                  }`}
                >
                  {state.name === n && <span aria-hidden>✓ </span>}{n}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={state.name === ''}
                onClick={() => update({ name: '' })}
                className={`min-h-[44px] rounded-full border-4 px-5 text-lg font-bold focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-500 ${
                  state.name === '' ? 'border-purple-600 bg-purple-100 text-purple-900' : 'border-white bg-white text-gray-800 hover:border-purple-200'
                }`}
              >
                {state.name === '' && <span aria-hidden>✓ </span>}{l.noName}
              </button>
            </div>
            <label htmlFor="cw-little-name" className="mb-1 block text-sm font-bold text-gray-700">{l.grownUpLabel}</label>
            <Input
              id="cw-little-name"
              value={state.name}
              maxLength={30}
              autoComplete="off"
              onChange={(e) => update({ name: e.target.value })}
              className="min-h-[44px] border-2 border-purple-300 text-lg"
            />
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {state.step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(state.step - 1)}
            className="min-h-[44px] rounded-full border-2 border-purple-300 bg-white px-6 text-lg font-bold text-purple-700 hover:bg-purple-50 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-500"
          >
            <span aria-hidden>⬅️ </span>{l.back}
          </button>
        ) : <span />}
        {atResult ? (
          <button
            type="button"
            onClick={() => { navigated.current = true; setState(EMPTY_LITTLE); }}
            className="min-h-[44px] rounded-full bg-linear-to-r from-pink-500 to-purple-500 px-6 text-lg font-bold text-white shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-300"
          >
            <span aria-hidden>🔄 </span>{l.startOver}
          </button>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={() => goTo(state.step + 1)}
              disabled={!canGoNext}
              aria-describedby={canGoNext ? undefined : 'cw-little-hint'}
              className="min-h-[44px] rounded-full bg-linear-to-r from-pink-500 to-purple-500 px-6 text-lg font-bold text-white shadow-lg hover:from-pink-600 hover:to-purple-600 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state.step === LITTLE_STEPS - 1 ? l.done : l.next}<span aria-hidden>{state.step === LITTLE_STEPS - 1 ? ' 🎉' : ' ➡️'}</span>
            </button>
            {!canGoNext && <p id="cw-little-hint" className="text-sm font-semibold text-gray-700"><span aria-hidden>👆 </span>{l.pickFirst}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CharacterWorkshopDemo() {
  const t = useTranslation(TRANSLATIONS);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(scrollTimer.current), []);
  const [selectedType, setSelectedType] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [charName, setCharName] = useState('');
  const [colors, setColors] = useState('');
  const [eyes, setEyes] = useState('');
  const [features, setFeatures] = useState('');
  const [outfit, setOutfit] = useState('');
  const [powers, setPowers] = useState('');
  const [home, setHome] = useState('');
  const [loves, setLoves] = useState('');
  const [fears, setFears] = useState('');
  const [goal, setGoal] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [littleReader, setLittleReader] = useState(false);
  const [little, setLittle] = useState<LittleState>(EMPTY_LITTLE);

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter(x => x !== trait));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  // Keyboard activation for the picker cards (styled <div>s, not <button>s).
  const onActivate = (fn: () => void) => (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  const handleShowSummary = () => {
    setShowSummary(true);
    scrollTimer.current = setTimeout(() => {
      document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-linear-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h2>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎨✨</div>
      </div>

      <LittleReaderToggle on={littleReader} onChange={setLittleReader} />

      {littleReader ? (
        <LittleWorkshop state={little} setState={setLittle} />
      ) : (
      <>

      <div className="bg-linear-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h3 className="text-2xl font-bold mb-3">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg text-left max-w-2xl mx-auto">
          {t.howToList.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
      </div>

      {/* Step 1: Character Type */}
      <div className="bg-linear-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
        <StepHeader n={1} title={t.step1} />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {t.types.map((typeName, i) => (
            <Card
              key={TYPE_ICONS[i]}
              role="button"
              tabIndex={0}
              aria-pressed={selectedType === typeName}
              aria-label={typeName}
              onClick={() => setSelectedType(typeName)}
              onKeyDown={onActivate(() => setSelectedType(typeName))}
              className={`p-4 text-center cursor-pointer transition-all hover:scale-105 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedType === typeName
                  ? 'bg-linear-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
                  : 'bg-white hover:bg-pink-50'
              }`}
            >
              <div className="text-3xl mb-1">{TYPE_ICONS[i]}</div>
              <div className="font-medium text-xs">{typeName}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Step 2: Name */}
      <div className="bg-linear-to-r from-blue-200 to-purple-200 rounded-2xl p-6 mb-6 border-4 border-purple-300">
        <StepHeader n={2} title={t.step2} />
        <Input
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          placeholder={t.namePlaceholder}
          aria-label={t.step2}
          className="text-lg border-2 border-purple-400 focus:border-purple-600"
        />
      </div>

      {/* Step 3: Appearance */}
      <div className="bg-linear-to-r from-green-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
        <StepHeader n={3} title={t.step3} />
        <div className="space-y-3">
          <div>
            <label htmlFor="cw-colors" className="block text-sm font-bold text-gray-700 mb-1">{t.colors}</label>
            <Input id="cw-colors" value={colors} onChange={(e) => setColors(e.target.value)} placeholder={t.colorsPlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-eyes" className="block text-sm font-bold text-gray-700 mb-1">{t.eyes}</label>
            <Input id="cw-eyes" value={eyes} onChange={(e) => setEyes(e.target.value)} placeholder={t.eyesPlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-features" className="block text-sm font-bold text-gray-700 mb-1">{t.features}</label>
            <Input id="cw-features" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder={t.featuresPlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-outfit" className="block text-sm font-bold text-gray-700 mb-1">{t.outfit}</label>
            <Input id="cw-outfit" value={outfit} onChange={(e) => setOutfit(e.target.value)} placeholder={t.outfitPlaceholder} />
          </div>
        </div>
        <div className="mt-4 bg-green-300 text-green-900 p-3 rounded-lg font-semibold text-sm">
          {t.appearanceTip}
        </div>
      </div>

      {/* Step 4: Personality */}
      <div className="bg-linear-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
        <StepHeader n={4} title={t.step4} />
        <p className="text-gray-700 mb-3">{t.pickTraits}</p>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
          {t.traits.map((traitName, i) => (
            <Card
              key={TRAIT_ICONS[i]}
              role="button"
              tabIndex={0}
              aria-pressed={selectedTraits.includes(traitName)}
              aria-label={traitName}
              onClick={() => toggleTrait(traitName)}
              onKeyDown={onActivate(() => toggleTrait(traitName))}
              className={`p-3 text-center cursor-pointer transition-all hover:scale-105 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedTraits.includes(traitName)
                  ? 'bg-linear-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
                  : 'bg-white hover:bg-purple-50'
              }`}
            >
              <div className="text-2xl mb-1">{TRAIT_ICONS[i]}</div>
              <div className="font-medium text-xs">{traitName}</div>
            </Card>
          ))}
        </div>
        <div className="text-sm text-gray-600 text-center">{selectedTraits.length}/3 {t.traitsSelected}</div>
      </div>

      {/* Step 5: Powers */}
      <div className="bg-linear-to-r from-indigo-200 to-blue-200 rounded-2xl p-6 mb-6 border-4 border-blue-300">
        <StepHeader n={5} title={t.step5} />
        <Textarea
          value={powers}
          onChange={(e) => setPowers(e.target.value)}
          placeholder={t.powersPlaceholder}
          aria-label={t.step5}
          rows={3}
          className="border-2 border-blue-400"
        />
      </div>

      {/* Step 6: Story */}
      <div className="bg-linear-to-r from-purple-200 to-pink-200 rounded-2xl p-6 mb-6 border-4 border-pink-300">
        <StepHeader n={6} title={t.step6} />
        <div className="space-y-3">
          <div>
            <label htmlFor="cw-home" className="block text-sm font-bold text-gray-700 mb-1">{t.homeLabel}</label>
            <Input id="cw-home" value={home} onChange={(e) => setHome(e.target.value)} placeholder={t.homePlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-loves" className="block text-sm font-bold text-gray-700 mb-1">{t.lovesLabel}</label>
            <Input id="cw-loves" value={loves} onChange={(e) => setLoves(e.target.value)} placeholder={t.lovesPlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-fears" className="block text-sm font-bold text-gray-700 mb-1">{t.fearsLabel}</label>
            <Input id="cw-fears" value={fears} onChange={(e) => setFears(e.target.value)} placeholder={t.fearsPlaceholder} />
          </div>
          <div>
            <label htmlFor="cw-goal" className="block text-sm font-bold text-gray-700 mb-1">{t.goalLabel}</label>
            <Input id="cw-goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder={t.goalPlaceholder} />
          </div>
        </div>
      </div>

      {/* Step 7: Draw */}
      <div className="bg-linear-to-r from-yellow-200 to-lime-200 rounded-2xl p-6 mb-6 border-4 border-lime-300">
        <StepHeader n={7} title={t.step7} />
        <div className="bg-white rounded-xl p-8 text-center border-4 border-dashed border-purple-400">
          <Pencil className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-700 text-lg">{t.drawTip}</p>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleShowSummary}
          className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t.seeSummary}
        </Button>
      </div>

      {showSummary && (
        <div id="summary-section" className="mt-8 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6">{t.summaryHeading}</h2>
          <div className="space-y-3 text-lg">
            <p><strong>📛 {t.name}:</strong> {charName || t.defaultCharName}</p>
            {selectedType && <p><strong>✨ {t.type}:</strong> {selectedType}</p>}
            {(colors || eyes || features || outfit) && (
              <p>
                <strong>🎨 {t.appearance}:</strong>{' '}
                {[
                  colors && `${colors} ${t.colorsSuffix}`,
                  eyes && `${eyes} ${t.eyesSuffix}`,
                  features && features,
                  outfit && `${t.wearing} ${outfit}`,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {selectedTraits.length > 0 && <p><strong>💫 {t.personality}:</strong> {selectedTraits.join(', ')}</p>}
            {powers && <p><strong>⚡ {t.powers}:</strong> {powers}</p>}
            {home && <p><strong>🏠 {t.home}:</strong> {home}</p>}
            {loves && <p><strong>❤️ {t.loves}:</strong> {loves}</p>}
            {fears && <p><strong>😰 {t.fears}:</strong> {fears}</p>}
            {goal && <p><strong>🎯 {t.goal}:</strong> {goal}</p>}
            <p className="text-center mt-6 text-xl">
              {t.summaryClosingPrefix} {charName || t.yourCharacter}{t.summaryClosingSuffix}
            </p>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
