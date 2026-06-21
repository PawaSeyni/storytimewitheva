import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, Save } from 'lucide-react';
import { useTranslation, useLanguage } from '../lib/language';
import type { Language } from '../lib/language';
import { useToast } from '../lib/toast';

type StoryItem = { name: string; emoji: string };
type ElementKey = 'character' | 'setting' | 'goal' | 'problem' | 'solution' | 'twist';
type Story = Partial<Record<ElementKey, StoryItem>>;

// Story element pools are localized — each language has its own phrasings.
const STORY_ELEMENTS: Record<Language, Record<ElementKey, StoryItem[]>> = {
  en: {
    character: [
      { name: 'a brave knight named Sir Courage', emoji: '⚔️' },
      { name: 'a clever fox named Whiskers', emoji: '🦊' },
      { name: 'a friendly dragon named Spark', emoji: '🐉' },
      { name: 'a curious robot named Bolt', emoji: '🤖' },
      { name: 'a magical fairy named Luna', emoji: '🧚' },
      { name: 'a wise wizard named Merlin', emoji: '🧙' },
    ],
    setting: [
      { name: 'an enchanted forest full of glowing mushrooms', emoji: '🌳' },
      { name: 'a floating castle in the clouds', emoji: '🏰' },
      { name: 'a mysterious underwater city', emoji: '🌊' },
      { name: 'a candy-filled kingdom', emoji: '🍭' },
      { name: 'a futuristic space station', emoji: '🚀' },
      { name: 'a magical library with endless books', emoji: '📚' },
    ],
    goal: [
      { name: 'find the legendary treasure', emoji: '💎' },
      { name: 'save the kingdom from danger', emoji: '🛡️' },
      { name: 'discover a secret recipe', emoji: '📜' },
      { name: 'make a new best friend', emoji: '🤝' },
      { name: 'win the grand tournament', emoji: '🏆' },
      { name: 'unlock ancient magic', emoji: '✨' },
    ],
    problem: [
      { name: 'a mischievous goblin steals the map', emoji: '😈' },
      { name: 'a giant maze blocks the way', emoji: '🌀' },
      { name: 'everything is frozen by an ice spell', emoji: '❄️' },
      { name: 'a riddle must be solved first', emoji: '❓' },
      { name: 'time is running out quickly', emoji: '⏰' },
      { name: 'they must work with an old rival', emoji: '😤' },
    ],
    solution: [
      { name: 'uses kindness to win over enemies', emoji: '💝' },
      { name: 'discovers a hidden talent', emoji: '⭐' },
      { name: 'finds a magical item that helps', emoji: '🔮' },
      { name: 'teams up with unlikely friends', emoji: '👥' },
      { name: 'remembers wise advice from a mentor', emoji: '💭' },
      { name: 'creates a clever invention', emoji: '💡' },
    ],
    twist: [
      { name: 'The villain becomes a good friend!', emoji: '😊' },
      { name: 'The treasure was friendship all along!', emoji: '💖' },
      { name: 'They discover they have royal blood!', emoji: '👑' },
      { name: 'The adventure was all a magical test!', emoji: '📝' },
      { name: 'They become the new guardian!', emoji: '🦸' },
      { name: 'They find a portal to new adventures!', emoji: '🌈' },
    ],
  },
  es: {
    character: [
      { name: 'un valiente caballero llamado Don Coraje', emoji: '⚔️' },
      { name: 'un zorro astuto llamado Bigotes', emoji: '🦊' },
      { name: 'un dragón amistoso llamado Chispa', emoji: '🐉' },
      { name: 'un robot curioso llamado Tornillo', emoji: '🤖' },
      { name: 'un hada mágica llamada Luna', emoji: '🧚' },
      { name: 'un sabio mago llamado Merlín', emoji: '🧙' },
    ],
    setting: [
      { name: 'un bosque encantado lleno de setas brillantes', emoji: '🌳' },
      { name: 'un castillo flotante entre las nubes', emoji: '🏰' },
      { name: 'una misteriosa ciudad submarina', emoji: '🌊' },
      { name: 'un reino lleno de dulces', emoji: '🍭' },
      { name: 'una estación espacial futurista', emoji: '🚀' },
      { name: 'una biblioteca mágica con libros infinitos', emoji: '📚' },
    ],
    goal: [
      { name: 'encontrar el tesoro legendario', emoji: '💎' },
      { name: 'salvar el reino del peligro', emoji: '🛡️' },
      { name: 'descubrir una receta secreta', emoji: '📜' },
      { name: 'hacer un nuevo mejor amigo', emoji: '🤝' },
      { name: 'ganar el gran torneo', emoji: '🏆' },
      { name: 'desbloquear una magia ancestral', emoji: '✨' },
    ],
    problem: [
      { name: 'un duende travieso roba el mapa', emoji: '😈' },
      { name: 'un laberinto gigante bloquea el camino', emoji: '🌀' },
      { name: 'todo se ha congelado por un hechizo de hielo', emoji: '❄️' },
      { name: 'primero hay que resolver un acertijo', emoji: '❓' },
      { name: 'el tiempo se acaba rápidamente', emoji: '⏰' },
      { name: 'tienen que colaborar con un viejo rival', emoji: '😤' },
    ],
    solution: [
      { name: 'usa la bondad para conquistar a sus enemigos', emoji: '💝' },
      { name: 'descubre un talento oculto', emoji: '⭐' },
      { name: 'encuentra un objeto mágico que le ayuda', emoji: '🔮' },
      { name: 'se une a amigos inesperados', emoji: '👥' },
      { name: 'recuerda el sabio consejo de un mentor', emoji: '💭' },
      { name: 'crea un invento ingenioso', emoji: '💡' },
    ],
    twist: [
      { name: '¡El villano se convierte en un buen amigo!', emoji: '😊' },
      { name: '¡El tesoro era la amistad todo el tiempo!', emoji: '💖' },
      { name: '¡Descubren que tienen sangre real!', emoji: '👑' },
      { name: '¡La aventura era una prueba mágica!', emoji: '📝' },
      { name: '¡Se convierten en los nuevos guardianes!', emoji: '🦸' },
      { name: '¡Encuentran un portal a nuevas aventuras!', emoji: '🌈' },
    ],
  },
  fr: {
    character: [
      { name: 'un brave chevalier nommé Sire Courage', emoji: '⚔️' },
      { name: 'un renard malin nommé Moustaches', emoji: '🦊' },
      { name: 'un dragon sympathique nommé Étincelle', emoji: '🐉' },
      { name: 'un robot curieux nommé Boulon', emoji: '🤖' },
      { name: 'une fée magique nommée Luna', emoji: '🧚' },
      { name: 'un sage magicien nommé Merlin', emoji: '🧙' },
    ],
    setting: [
      { name: 'une forêt enchantée pleine de champignons lumineux', emoji: '🌳' },
      { name: 'un château flottant dans les nuages', emoji: '🏰' },
      { name: 'une mystérieuse ville sous-marine', emoji: '🌊' },
      { name: 'un royaume rempli de bonbons', emoji: '🍭' },
      { name: 'une station spatiale futuriste', emoji: '🚀' },
      { name: 'une bibliothèque magique aux livres infinis', emoji: '📚' },
    ],
    goal: [
      { name: 'trouver le trésor légendaire', emoji: '💎' },
      { name: 'sauver le royaume du danger', emoji: '🛡️' },
      { name: 'découvrir une recette secrète', emoji: '📜' },
      { name: 'se faire un nouveau meilleur ami', emoji: '🤝' },
      { name: 'remporter le grand tournoi', emoji: '🏆' },
      { name: 'libérer une magie ancestrale', emoji: '✨' },
    ],
    problem: [
      { name: 'un gobelin malicieux vole la carte', emoji: '😈' },
      { name: 'un labyrinthe géant barre le chemin', emoji: '🌀' },
      { name: 'tout est gelé par un sort de glace', emoji: '❄️' },
      { name: 'il faut d\'abord résoudre une énigme', emoji: '❓' },
      { name: 'le temps presse', emoji: '⏰' },
      { name: 'ils doivent collaborer avec un vieux rival', emoji: '😤' },
    ],
    solution: [
      { name: 'use de bonté pour gagner ses ennemis', emoji: '💝' },
      { name: 'découvre un talent caché', emoji: '⭐' },
      { name: 'trouve un objet magique qui aide', emoji: '🔮' },
      { name: 'fait équipe avec des amis improbables', emoji: '👥' },
      { name: 'se souvient des sages conseils d\'un mentor', emoji: '💭' },
      { name: 'invente une astuce ingénieuse', emoji: '💡' },
    ],
    twist: [
      { name: 'Le méchant devient un bon ami !', emoji: '😊' },
      { name: 'Le trésor, c\'était l\'amitié depuis le début !', emoji: '💖' },
      { name: 'Ils découvrent qu\'ils ont du sang royal !', emoji: '👑' },
      { name: 'L\'aventure était une épreuve magique !', emoji: '📝' },
      { name: 'Ils deviennent les nouveaux gardiens !', emoji: '🦸' },
      { name: 'Ils trouvent un portail vers de nouvelles aventures !', emoji: '🌈' },
    ],
  },
};

const TRANSLATIONS = {
  en: {
    title: 'Story Dice Creator with Eva',
    subtitle: 'Roll the dice to create your own amazing adventure!',
    howToPlay: '✨ How to Play ✨',
    howToText: 'Click on each dice to roll for different story elements, or click the big button to roll them all at once! Once you have all your elements, your unique story will appear below. Every roll creates a brand new adventure!',
    labels: { character: 'Character', setting: 'Setting', goal: 'Goal', problem: 'Problem', solution: 'Solution', twist: 'Plot Twist' },
    rollPrompts: {
      character: 'Roll to discover your hero!',
      setting: 'Roll to find where the story happens!',
      goal: 'Roll to see what they want!',
      problem: 'Roll to discover the challenge!',
      solution: 'Roll to find how they succeed!',
      twist: 'Roll for a surprise ending!',
    },
    rollAll: '🎲 ROLL ALL DICE! 🎲',
    storyHeading: '📚 Your Amazing Story 📚',
    save: 'Save Story',
    copy: 'Copy Story',
    newStory: 'Create New Story',
    copied: 'Story copied to clipboard!',
    copyError: "Couldn't copy, try selecting the text manually.",
    saved: 'Story saved! Check your saved stories below!',
    tipsHeading: '✏️ Story Writing Tips:',
    tipsBody: 'Once you have your story elements, try expanding your tale! Add more details about your character, describe the setting with colorful words, or create dialogue between characters. Every great author starts with a simple idea!',
    savedHeading: '📚 Your Saved Stories 📚',
    storyN: 'Story #',
    template: (s: Story) =>
      `Once upon a time, there lived ${s.character?.name}. They lived in ${s.setting?.name}. One day, they decided to ${s.goal?.name}! But there was a problem: ${s.problem?.name}. Thinking quickly, our hero ${s.solution?.name}! And here's the amazing part: ${s.twist?.name} The End! 🌟`,
  },
  es: {
    title: 'Creador de dados de historia con Eva',
    subtitle: '¡Lanza los dados para crear tu propia aventura increíble!',
    howToPlay: '✨ Cómo jugar ✨',
    howToText: 'Haz clic en cada dado para tirar y conseguir un elemento de la historia, o pulsa el botón grande para tirarlos todos a la vez. Cuando tengas todos los elementos, tu historia única aparecerá abajo. ¡Cada tirada crea una nueva aventura!',
    labels: { character: 'Personaje', setting: 'Escenario', goal: 'Objetivo', problem: 'Problema', solution: 'Solución', twist: 'Giro' },
    rollPrompts: {
      character: '¡Tira para descubrir tu héroe!',
      setting: '¡Tira para descubrir dónde pasa la historia!',
      goal: '¡Tira para ver qué quiere!',
      problem: '¡Tira para descubrir el reto!',
      solution: '¡Tira para ver cómo lo logra!',
      twist: '¡Tira para un final sorpresa!',
    },
    rollAll: '🎲 ¡LANZAR TODOS LOS DADOS! 🎲',
    storyHeading: '📚 Tu increíble historia 📚',
    save: 'Guardar historia',
    copy: 'Copiar historia',
    newStory: 'Crear una nueva',
    copied: '¡Historia copiada al portapapeles!',
    copyError: 'No se pudo copiar, intenta seleccionar el texto manualmente.',
    saved: '¡Historia guardada! Mira tus historias guardadas abajo.',
    tipsHeading: '✏️ Consejos para escribir historias:',
    tipsBody: 'Cuando tengas los elementos, ¡prueba a ampliar tu cuento! Añade más detalles sobre tu personaje, describe el escenario con palabras llenas de color o crea diálogos entre personajes. ¡Cada gran autor empieza con una idea sencilla!',
    savedHeading: '📚 Tus historias guardadas 📚',
    storyN: 'Historia n.º ',
    template: (s: Story) =>
      `Érase una vez ${s.character?.name}. Vivía en ${s.setting?.name}. Un día decidió ${s.goal?.name}. Pero había un problema: ${s.problem?.name}. Pensando rápido, nuestro héroe ${s.solution?.name}. Y lo más increíble fue: ${s.twist?.name} ¡Fin! 🌟`,
  },
  fr: {
    title: 'Créateur de dés à histoire avec Eva',
    subtitle: 'Lance les dés pour créer ta propre aventure incroyable !',
    howToPlay: '✨ Comment jouer ✨',
    howToText: 'Clique sur chaque dé pour obtenir un élément de l\'histoire, ou clique sur le gros bouton pour tout lancer d\'un coup ! Une fois tous les éléments choisis, ton histoire unique apparaîtra en dessous. Chaque lancer crée une toute nouvelle aventure !',
    labels: { character: 'Personnage', setting: 'Décor', goal: 'Objectif', problem: 'Problème', solution: 'Solution', twist: 'Rebondissement' },
    rollPrompts: {
      character: 'Lance pour découvrir ton héros !',
      setting: "Lance pour découvrir où se passe l'histoire !",
      goal: 'Lance pour voir ce qu\'il veut !',
      problem: 'Lance pour découvrir le défi !',
      solution: 'Lance pour voir comment il y arrive !',
      twist: 'Lance pour une fin surprise !',
    },
    rollAll: '🎲 LANCER TOUS LES DÉS ! 🎲',
    storyHeading: '📚 Ton incroyable histoire 📚',
    save: "Sauvegarder l'histoire",
    copy: "Copier l'histoire",
    newStory: 'Créer une nouvelle',
    copied: "Histoire copiée dans le presse-papiers !",
    copyError: "Impossible de copier, sélectionne le texte manuellement.",
    saved: 'Histoire sauvegardée ! Regarde tes histoires sauvegardées plus bas.',
    tipsHeading: "✏️ Conseils d'écriture :",
    tipsBody: "Une fois que tu as tes éléments, essaie d'étoffer ton récit ! Ajoute des détails sur ton personnage, décris le décor avec des mots colorés ou invente des dialogues. Chaque grand auteur commence par une simple idée !",
    savedHeading: '📚 Tes histoires sauvegardées 📚',
    storyN: 'Histoire n°',
    template: (s: Story) =>
      `Il était une fois ${s.character?.name}. Il vivait dans ${s.setting?.name}. Un jour, il a décidé de ${s.goal?.name}. Mais il y eut un problème : ${s.problem?.name}. Réfléchissant vite, notre héros ${s.solution?.name}. Et voici l'incroyable : ${s.twist?.name} Fin ! 🌟`,
  },
};

const ELEMENTS_LIST: ElementKey[] = ['character', 'setting', 'goal', 'problem', 'solution', 'twist'];

const ICONS: Record<ElementKey, string> = {
  character: '👤',
  setting: '🗺️',
  goal: '🎯',
  problem: '⚠️',
  solution: '💡',
  twist: '🌟',
};

type SavedStory = { text: string; date: string };

export default function StoryBuilderDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const toast = useToast();
  const pools = STORY_ELEMENTS[language] || STORY_ELEMENTS.en;

  const [currentStory, setCurrentStory] = useState<Story>({});
  const [rollingElement, setRollingElement] = useState<ElementKey | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);

  // Track dice-animation timeouts so they can be cleared on unmount (otherwise
  // they fire setState after the component is gone).
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const rollDice = (element: ElementKey) => {
    setRollingElement(element);
    schedule(() => {
      const options = pools[element];
      const selected = options[Math.floor(Math.random() * options.length)];
      setCurrentStory(prev => {
        const updated = { ...prev, [element]: selected };
        if (Object.keys(updated).length === 6) {
          schedule(() => setShowStory(true), 500);
        }
        return updated;
      });
      setRollingElement(null);
    }, 500);
  };

  const rollAllDice = () => {
    setShowStory(false);
    ELEMENTS_LIST.forEach((element, index) => {
      schedule(() => {
        setRollingElement(element);
        schedule(() => {
          const options = pools[element];
          const selected = options[Math.floor(Math.random() * options.length)];
          setCurrentStory(prev => ({ ...prev, [element]: selected }));
          setRollingElement(null);
          if (index === ELEMENTS_LIST.length - 1) {
            schedule(() => setShowStory(true), 500);
          }
        }, 500);
      }, index * 800);
    });
  };

  const generateStoryText = () => t.template(currentStory);

  const copyStory = async () => {
    // clipboard API is undefined on insecure origins and rejects without
    // permission — only claim success when the write actually resolves.
    try {
      await navigator.clipboard.writeText(generateStoryText());
      toast.success(t.copied);
    } catch {
      toast.error(t.copyError);
    }
  };

  const saveStory = () => {
    const date = new Date().toLocaleString();
    setSavedStories(prev => [...prev, { text: generateStoryText(), date }]);
    toast.success(t.saved);
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h2>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎲📖</div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h3 className="text-2xl font-bold mb-3">{t.howToPlay}</h3>
        <p className="text-lg leading-relaxed">{t.howToText}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {ELEMENTS_LIST.map((element) => (
          <Card
            key={element}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-orange-300 p-6 hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{ICONS[element]}</span>
                {t.labels[element]}
              </div>
              <Button
                onClick={() => rollDice(element)}
                disabled={rollingElement === element}
                variant="outline"
                className={`w-14 h-14 p-0 rounded-xl border-2 border-gray-800 text-3xl hover:bg-yellow-200 hover:rotate-12 transition-all ${
                  rollingElement === element ? 'animate-spin' : ''
                }`}
              >
                🎲
              </Button>
            </div>
            <div
              className={`bg-white rounded-xl p-4 min-h-[80px] flex items-center justify-center text-center ${
                currentStory[element] ? 'text-gray-800' : 'text-gray-600 italic'
              }`}
            >
              {currentStory[element] ? (
                <span>
                  <span className="text-3xl mr-2">{currentStory[element]!.emoji}</span>
                  {currentStory[element]!.name}
                </span>
              ) : (
                t.rollPrompts[element]
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mb-6">
        <Button
          onClick={rollAllDice}
          disabled={rollingElement !== null}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl px-12 py-8 rounded-full shadow-2xl"
        >
          {t.rollAll}
        </Button>
      </div>

      {showStory && Object.keys(currentStory).length === 6 && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl p-8 mb-6">
          <div className="text-3xl font-bold text-center mb-6">{t.storyHeading}</div>
          <div className="text-lg leading-relaxed text-center bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
            {generateStoryText()}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={saveStory} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </Button>
            <Button onClick={copyStory} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <Copy className="w-4 h-4 mr-2" />
              {t.copy}
            </Button>
            <Button onClick={rollAllDice} className="bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.newStory}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-green-300 text-green-900 rounded-2xl p-6 border-l-8 border-green-600 mb-6">
        <h3 className="font-bold text-lg mb-2">{t.tipsHeading}</h3>
        <p className="leading-relaxed">{t.tipsBody}</p>
      </div>

      {savedStories.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">{t.savedHeading}</h2>
          <div className="space-y-4">
            {[...savedStories].reverse().map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
                <div className="text-purple-700 font-bold text-lg mb-2">
                  {t.storyN}{savedStories.length - index} — {story.date}
                </div>
                <div className="text-gray-700 leading-relaxed">{story.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
