import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil } from 'lucide-react';
import { useTranslation } from '../lib/language';

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

export default function CharacterWorkshopDemo() {
  const t = useTranslation(TRANSLATIONS);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();
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

  const StepHeader = ({ n, title }: { n: number; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">{n}</div>
      <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 text-purple-700">{t.title}</h2>
        <p className="text-gray-700 mb-4">{t.subtitle}</p>
        <div className="text-5xl mb-4">🎨✨</div>
      </div>

      <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl p-6 mb-6 text-center">
        <h3 className="text-2xl font-bold mb-3">{t.howToPlay}</h3>
        <ol className="list-decimal list-inside space-y-2 text-lg text-left max-w-2xl mx-auto">
          {t.howToList.map((line, i) => <li key={i}>{line}</li>)}
        </ol>
      </div>

      {/* Step 1: Character Type */}
      <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-6 mb-6 border-4 border-orange-300">
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
              className={`p-4 text-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedType === typeName
                  ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
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
      <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl p-6 mb-6 border-4 border-purple-300">
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
      <div className="bg-gradient-to-r from-green-200 to-cyan-200 rounded-2xl p-6 mb-6 border-4 border-cyan-300">
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
      <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-6 mb-6 border-4 border-rose-300">
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
              className={`p-3 text-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                selectedTraits.includes(traitName)
                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
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
      <div className="bg-gradient-to-r from-indigo-200 to-blue-200 rounded-2xl p-6 mb-6 border-4 border-blue-300">
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
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 mb-6 border-4 border-pink-300">
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
      <div className="bg-gradient-to-r from-yellow-200 to-lime-200 rounded-2xl p-6 mb-6 border-4 border-lime-300">
        <StepHeader n={7} title={t.step7} />
        <div className="bg-white rounded-xl p-8 text-center border-4 border-dashed border-purple-400">
          <Pencil className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-700 text-lg">{t.drawTip}</p>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleShowSummary}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t.seeSummary}
        </Button>
      </div>

      {showSummary && (
        <div id="summary-section" className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-8">
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
    </div>
  );
}
