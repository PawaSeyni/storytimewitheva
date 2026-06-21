import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shuffle, Save, Download } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { useToast } from '../lib/toast';

type Item = { emoji: string; name: string };

const ANIMALS_BY_LANG: Record<Language, Item[]> = {
  en: [
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦉', name: 'Owl' },
    { emoji: '🐨', name: 'Koala' },
    { emoji: '🦋', name: 'Butterfly' },
    { emoji: '🐧', name: 'Penguin' },
    { emoji: '🦅', name: 'Eagle' },
    { emoji: '🐯', name: 'Tiger' },
    { emoji: '🐘', name: 'Elephant' },
    { emoji: '🦒', name: 'Giraffe' },
    { emoji: '🐬', name: 'Dolphin' },
  ],
  es: [
    { emoji: '🦊', name: 'Zorro' },
    { emoji: '🦁', name: 'León' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦉', name: 'Búho' },
    { emoji: '🐨', name: 'Koala' },
    { emoji: '🦋', name: 'Mariposa' },
    { emoji: '🐧', name: 'Pingüino' },
    { emoji: '🦅', name: 'Águila' },
    { emoji: '🐯', name: 'Tigre' },
    { emoji: '🐘', name: 'Elefante' },
    { emoji: '🦒', name: 'Jirafa' },
    { emoji: '🐬', name: 'Delfín' },
  ],
  fr: [
    { emoji: '🦊', name: 'Renard' },
    { emoji: '🦁', name: 'Lion' },
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🦉', name: 'Hibou' },
    { emoji: '🐨', name: 'Koala' },
    { emoji: '🦋', name: 'Papillon' },
    { emoji: '🐧', name: 'Pingouin' },
    { emoji: '🦅', name: 'Aigle' },
    { emoji: '🐯', name: 'Tigre' },
    { emoji: '🐘', name: 'Éléphant' },
    { emoji: '🦒', name: 'Girafe' },
    { emoji: '🐬', name: 'Dauphin' },
  ],
};

const COUNTRIES_BY_LANG: Record<Language, Item[]> = {
  en: [
    { emoji: '🇺🇸', name: 'USA' },
    { emoji: '🇯🇵', name: 'Japan' },
    { emoji: '🇫🇷', name: 'France' },
    { emoji: '🇬🇧', name: 'UK' },
    { emoji: '🇦🇺', name: 'Australia' },
    { emoji: '🇨🇦', name: 'Canada' },
    { emoji: '🇧🇷', name: 'Brazil' },
    { emoji: '🇮🇹', name: 'Italy' },
    { emoji: '🇲🇽', name: 'Mexico' },
    { emoji: '🇨🇳', name: 'China' },
    { emoji: '🇮🇳', name: 'India' },
    { emoji: '🇰🇷', name: 'Korea' },
  ],
  es: [
    { emoji: '🇺🇸', name: 'EE. UU.' },
    { emoji: '🇯🇵', name: 'Japón' },
    { emoji: '🇫🇷', name: 'Francia' },
    { emoji: '🇬🇧', name: 'Reino Unido' },
    { emoji: '🇦🇺', name: 'Australia' },
    { emoji: '🇨🇦', name: 'Canadá' },
    { emoji: '🇧🇷', name: 'Brasil' },
    { emoji: '🇮🇹', name: 'Italia' },
    { emoji: '🇲🇽', name: 'México' },
    { emoji: '🇨🇳', name: 'China' },
    { emoji: '🇮🇳', name: 'India' },
    { emoji: '🇰🇷', name: 'Corea' },
  ],
  fr: [
    { emoji: '🇺🇸', name: 'États-Unis' },
    { emoji: '🇯🇵', name: 'Japon' },
    { emoji: '🇫🇷', name: 'France' },
    { emoji: '🇬🇧', name: 'Royaume-Uni' },
    { emoji: '🇦🇺', name: 'Australie' },
    { emoji: '🇨🇦', name: 'Canada' },
    { emoji: '🇧🇷', name: 'Brésil' },
    { emoji: '🇮🇹', name: 'Italie' },
    { emoji: '🇲🇽', name: 'Mexique' },
    { emoji: '🇨🇳', name: 'Chine' },
    { emoji: '🇮🇳', name: 'Inde' },
    { emoji: '🇰🇷', name: 'Corée' },
  ],
};

const COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
];

const PATTERN_KEYS = ['none', 'dots', 'lines', 'waves'] as const;
type PatternKey = (typeof PATTERN_KEYS)[number];
const PATTERN_VALUES: Record<PatternKey, string> = {
  none: 'none',
  dots: 'radial-gradient(circle, white 2px, transparent 2px)',
  lines:
    'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 40px)',
  waves:
    'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)',
};

type TemplateKey = 'safari' | 'ocean' | 'japan' | 'arctic';

const TEMPLATE_META: { id: TemplateKey; icon: string; animalIdx: number; countryIdx: number; colorIdx: number }[] = [
  { id: 'safari', icon: '🦁🌍', animalIdx: 1, countryIdx: 9, colorIdx: 3 },
  { id: 'ocean', icon: '🐬🌊', animalIdx: 11, countryIdx: 5, colorIdx: 2 },
  { id: 'japan', icon: '🐼🇯🇵', animalIdx: 2, countryIdx: 1, colorIdx: 6 },
  { id: 'arctic', icon: '🐧❄️', animalIdx: 6, countryIdx: 5, colorIdx: 2 },
];

const TRANSLATIONS = {
  en: {
    heading: 'Bookmark Designer with Eva',
    subheading: 'Create your own beautiful bookmarks with animals and country themes!',
    quickStart: '✨ Quick Start Templates ✨',
    chooseAnimal: '🐾 Choose Your Animal',
    chooseCountry: '🌍 Choose Country Theme',
    chooseColor: '🎨 Choose Background Color',
    addText: '✏️ Add Your Text',
    textPlaceholder: 'Your name or favorite quote...',
    choosePattern: '🎭 Choose Pattern',
    previewHeading: '📖 Your Bookmark Preview',
    defaultBookmark: 'My Bookmark',
    download: 'Download Bookmark',
    save: 'Save Design',
    surprise: 'Surprise Me!',
    saved: 'Design saved!',
    downloaded: 'Bookmark downloaded!',
    tipsTitle: '💡 Bookmark Making Tips:',
    tips: [
      'Choose contrasting colors for text to stand out',
      'Animals and countries make great conversation starters',
      'Make multiple bookmarks as gifts for friends!',
      'Try creating a collection for different book genres',
    ],
    printingTitle: '🖨️ How to Print Your Bookmark:',
    printingSteps: [
      'Click "Download Bookmark" to save a high-quality PNG',
      'Open the file in any photo viewer or app',
      'Print at actual size on cardstock or thick paper',
      'Cut along the edges of the bookmark',
      'Optional: Laminate for extra durability!',
      'Punch a hole at the top and thread ribbon for a tassel',
    ],
    patterns: {
      none: 'None',
      dots: 'Dots',
      lines: 'Lines',
      waves: 'Waves',
    },
    templates: {
      safari: { name: 'Safari Adventure', subtitle: 'African Wildlife', text: 'Safari Adventure' },
      ocean: { name: 'Ocean Explorer', subtitle: 'Sea Creatures', text: 'Ocean Explorer' },
      japan: { name: 'Japan Journey', subtitle: 'Asian Culture', text: 'Japan Journey' },
      arctic: { name: 'Arctic Circle', subtitle: 'Polar Animals', text: 'Arctic Circle' },
    },
    quotes: ['Adventure Awaits', 'Keep Reading', 'Book Lover', 'Story Time', 'My Library'],
  },
  es: {
    heading: 'Diseñador de marcapáginas con Eva',
    subheading: '¡Crea tus propios marcapáginas preciosos con animales y temas de países!',
    quickStart: '✨ Plantillas de inicio rápido ✨',
    chooseAnimal: '🐾 Elige tu animal',
    chooseCountry: '🌍 Elige el tema del país',
    chooseColor: '🎨 Elige el color de fondo',
    addText: '✏️ Añade tu texto',
    textPlaceholder: 'Tu nombre o frase favorita...',
    choosePattern: '🎭 Elige el patrón',
    previewHeading: '📖 Vista previa de tu marcapáginas',
    defaultBookmark: 'Mi marcapáginas',
    download: 'Descargar marcapáginas',
    save: 'Guardar diseño',
    surprise: '¡Sorpréndeme!',
    saved: '¡Diseño guardado!',
    downloaded: '¡Marcapáginas descargado!',
    tipsTitle: '💡 Consejos para crear marcapáginas:',
    tips: [
      'Elige colores que contrasten para que el texto resalte',
      'Los animales y países son grandes temas de conversación',
      '¡Haz varios marcapáginas como regalo para tus amigos!',
      'Prueba a crear una colección para distintos géneros literarios',
    ],
    printingTitle: '🖨️ Cómo imprimir tu marcapáginas:',
    printingSteps: [
      'Haz clic en "Descargar marcapáginas" para guardar un PNG de alta calidad',
      'Abre el archivo en cualquier visor de fotos o aplicación',
      'Imprime a tamaño real en cartulina o papel grueso',
      'Recorta los bordes del marcapáginas',
      '¡Opcional: plastifícalo para que dure más!',
      'Haz un agujero arriba y pasa una cinta para un pompón',
    ],
    patterns: {
      none: 'Ninguno',
      dots: 'Puntos',
      lines: 'Líneas',
      waves: 'Ondas',
    },
    templates: {
      safari: { name: 'Aventura de safari', subtitle: 'Fauna africana', text: 'Aventura de safari' },
      ocean: { name: 'Explorador del océano', subtitle: 'Criaturas marinas', text: 'Explorador del océano' },
      japan: { name: 'Viaje a Japón', subtitle: 'Cultura asiática', text: 'Viaje a Japón' },
      arctic: { name: 'Círculo polar', subtitle: 'Animales polares', text: 'Círculo polar' },
    },
    quotes: ['La aventura te espera', 'Sigue leyendo', 'Amante de los libros', 'Hora del cuento', 'Mi biblioteca'],
  },
  fr: {
    heading: 'Créateur de marque-pages avec Eva',
    subheading: 'Crée tes propres marque-pages magnifiques avec des animaux et des thèmes de pays !',
    quickStart: '✨ Modèles à démarrage rapide ✨',
    chooseAnimal: '🐾 Choisis ton animal',
    chooseCountry: '🌍 Choisis le thème du pays',
    chooseColor: "🎨 Choisis la couleur de fond",
    addText: '✏️ Ajoute ton texte',
    textPlaceholder: 'Ton nom ou ta citation préférée...',
    choosePattern: '🎭 Choisis le motif',
    previewHeading: '📖 Aperçu de ton marque-page',
    defaultBookmark: 'Mon marque-page',
    download: 'Télécharger le marque-page',
    save: 'Sauvegarder le design',
    surprise: 'Surprends-moi !',
    saved: 'Design sauvegardé !',
    downloaded: 'Marque-page téléchargé !',
    tipsTitle: '💡 Conseils pour créer un marque-page :',
    tips: [
      'Choisis des couleurs contrastées pour que le texte ressorte',
      "Les animaux et les pays sont d'excellents sujets de conversation",
      'Fabrique plusieurs marque-pages à offrir à tes amis !',
      'Essaie de créer une collection pour différents genres de livres',
    ],
    printingTitle: "🖨️ Comment imprimer ton marque-page :",
    printingSteps: [
      'Clique sur « Télécharger le marque-page » pour enregistrer un PNG haute qualité',
      "Ouvre le fichier dans n'importe quelle visionneuse de photos",
      "Imprime en taille réelle sur du papier cartonné ou épais",
      'Découpe les bords du marque-page',
      'Optionnel : plastifie-le pour plus de durabilité !',
      'Fais un trou en haut et passe un ruban pour faire un pompon',
    ],
    patterns: {
      none: 'Aucun',
      dots: 'Points',
      lines: 'Lignes',
      waves: 'Vagues',
    },
    templates: {
      safari: { name: 'Aventure safari', subtitle: 'Faune africaine', text: 'Aventure safari' },
      ocean: { name: "Explorateur de l'océan", subtitle: 'Créatures marines', text: "Explorateur de l'océan" },
      japan: { name: 'Voyage au Japon', subtitle: 'Culture asiatique', text: 'Voyage au Japon' },
      arctic: { name: 'Cercle arctique', subtitle: 'Animaux polaires', text: 'Cercle arctique' },
    },
    quotes: ["L'aventure t'attend", 'Continue de lire', 'Amoureux des livres', "L'heure du conte", 'Ma bibliothèque'],
  },
};

// Draw a CSS linear-gradient string onto a canvas context.
function drawGradient(ctx: CanvasRenderingContext2D, css: string, w: number, h: number) {
  const hexes = css.match(/#[0-9a-fA-F]{6}/g) ?? ['#667eea', '#764ba2'];
  const grd = ctx.createLinearGradient(0, 0, w, h); // diagonal ~ 135deg
  grd.addColorStop(0, hexes[0]);
  grd.addColorStop(1, hexes[hexes.length - 1]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

function drawPattern(ctx: CanvasRenderingContext2D, pattern: PatternKey, w: number, h: number) {
  if (pattern === 'dots') {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let y = 30; y < h; y += 60) {
      for (let x = 30; x < w; x += 60) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === 'lines') {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 4;
    for (let i = -h; i < w + h; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  } else if (pattern === 'waves') {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 4;
    for (let y = 40; y < h; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}

// Wrap and draw centered text, returning the y position after the last line.
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  cx: number,
  maxWidth: number,
  startY: number,
  lineHeight: number,
): number {
  ctx.font = font;
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lineHeight));
  return startY + lines.length * lineHeight;
}

export default function BookmarkCraftsDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const toast = useToast();

  const animals = ANIMALS_BY_LANG[language] ?? ANIMALS_BY_LANG.en;
  const countries = COUNTRIES_BY_LANG[language] ?? COUNTRIES_BY_LANG.en;

  const [selectedAnimal, setSelectedAnimal] = useState<Item>(animals[0]);
  const [selectedCountry, setSelectedCountry] = useState<Item>(countries[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedPatternKey, setSelectedPatternKey] = useState<PatternKey>('none');
  const [bookmarkText, setBookmarkText] = useState('');

  const currentAnimal = animals.find(a => a.emoji === selectedAnimal.emoji) ?? animals[0];
  const currentCountry = countries.find(c => c.emoji === selectedCountry.emoji) ?? countries[0];

  // Keyboard activation for the picker cards (which are styled <div>s, not <button>s).
  const onActivate = (fn: () => void) => (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  const loadTemplate = (templateKey: TemplateKey) => {
    const meta = TEMPLATE_META.find(m => m.id === templateKey);
    if (!meta) return;
    setSelectedAnimal(animals[meta.animalIdx]);
    setSelectedCountry(countries[meta.countryIdx]);
    setSelectedColor(COLORS[meta.colorIdx]);
    setBookmarkText(t.templates[templateKey].text);
    setSelectedPatternKey('none');
  };

  const randomizeDesign = () => {
    setSelectedAnimal(animals[Math.floor(Math.random() * animals.length)]);
    setSelectedCountry(countries[Math.floor(Math.random() * countries.length)]);
    setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setSelectedPatternKey(PATTERN_KEYS[Math.floor(Math.random() * PATTERN_KEYS.length)]);
    setBookmarkText(t.quotes[Math.floor(Math.random() * t.quotes.length)]);
  };

  // Canvas-based PNG download — 600×2100 px (2"×7" at 300 DPI, standard bookmark size)
  const handleDownload = () => {
    const W = 600;
    const H = 2100;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rounded-corner clip
    const r = 48;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(W - r, 0);
    ctx.quadraticCurveTo(W, 0, W, r);
    ctx.lineTo(W, H - r);
    ctx.quadraticCurveTo(W, H, W - r, H);
    ctx.lineTo(r, H);
    ctx.quadraticCurveTo(0, H, 0, H - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Background
    drawGradient(ctx, selectedColor, W, H);

    // Pattern overlay
    drawPattern(ctx, selectedPatternKey, W, H);

    // Top text
    const displayText = bookmarkText || t.defaultBookmark;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    drawWrappedText(ctx, displayText, 'bold 72px sans-serif', W / 2, W - 80, 180, 90);

    // Animal emoji (large)
    ctx.font = '320px serif';
    ctx.fillText(currentAnimal.emoji, W / 2, 1080);

    // Country flag
    ctx.font = '180px serif';
    ctx.fillText(currentCountry.emoji, W / 2, 1620);

    // Country name
    ctx.shadowBlur = 4;
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(currentCountry.name, W / 2, 1740);

    // Footer watermark
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.globalAlpha = 0.55;
    ctx.font = '34px sans-serif';
    ctx.fillText('storytimewitheva.com', W / 2, 2040);
    ctx.globalAlpha = 1;

    // Trigger download
    const slug = `${currentAnimal.name}-${currentCountry.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    const link = document.createElement('a');
    link.download = `bookmark-${slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast.success(t.downloaded);
  };

  const handleSave = () => {
    const design = {
      animalEmoji: selectedAnimal.emoji,
      countryEmoji: selectedCountry.emoji,
      selectedColor,
      selectedPatternKey,
      bookmarkText,
    };
    // Only confirm success if the write actually went through (Safari private
    // mode throws on any setItem); never claim "saved" when it didn't.
    try {
      localStorage.setItem('bookmarkDesign', JSON.stringify(design));
      toast.success(t.saved);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700">{t.heading}</h2>
        <p className="text-gray-700 mb-4 text-sm sm:text-base">{t.subheading}</p>
        <div className="text-5xl mb-4">🎨📚</div>
      </div>

      {/* Quick-start templates */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-4 sm:p-6 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-4">{t.quickStart}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATE_META.map((template) => (
            <Card
              key={template.id}
              role="button"
              tabIndex={0}
              onClick={() => loadTemplate(template.id)}
              onKeyDown={onActivate(() => loadTemplate(template.id))}
              aria-label={t.templates[template.id].name}
              className="bg-white p-3 sm:p-4 text-center cursor-pointer hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <div className="text-3xl sm:text-4xl mb-2">{template.icon}</div>
              <div className="font-bold text-purple-700 text-sm sm:text-base">{t.templates[template.id].name}</div>
              <div className="text-xs text-gray-600">{t.templates[template.id].subtitle}</div>
            </Card>
          ))}
        </div>
      </div>

      {/*
        Mobile: flex-col-reverse puts the preview first, controls below.
        lg+: two-column grid, controls left, preview right.
      */}
      <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-6">
        {/* ── Controls (right side on lg, bottom on mobile) ─────────────── */}
        <div className="space-y-4 sm:space-y-6">
          {/* Animal picker */}
          <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl p-4 sm:p-6 border-4 border-orange-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{t.chooseAnimal}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
              {animals.map((animal) => (
                <Card
                  key={animal.emoji}
                  role="button"
                  tabIndex={0}
                  aria-pressed={currentAnimal.emoji === animal.emoji}
                  aria-label={animal.name}
                  onClick={() => setSelectedAnimal(animal)}
                  onKeyDown={onActivate(() => setSelectedAnimal(animal))}
                  className={`p-2 sm:p-3 text-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    currentAnimal.emoji === animal.emoji
                      ? 'bg-gradient-to-br from-pink-400 to-red-400 text-white ring-4 ring-pink-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1">{animal.emoji}</div>
                  <div className="text-xs font-medium leading-tight">{animal.name}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Country picker */}
          <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl p-4 sm:p-6 border-4 border-cyan-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{t.chooseCountry}</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
              {countries.map((country) => (
                <Card
                  key={country.emoji}
                  role="button"
                  tabIndex={0}
                  aria-pressed={currentCountry.emoji === country.emoji}
                  aria-label={country.name}
                  onClick={() => setSelectedCountry(country)}
                  onKeyDown={onActivate(() => setSelectedCountry(country))}
                  className={`p-2 sm:p-3 text-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    currentCountry.emoji === country.emoji
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 text-white ring-4 ring-blue-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1">{country.emoji}</div>
                  <div className="text-xs font-medium leading-tight">{country.name}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="bg-gradient-to-r from-green-200 to-teal-200 rounded-2xl p-4 sm:p-6 border-4 border-teal-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{t.chooseColor}</h3>
            <div className="grid grid-cols-5 gap-3">
              {COLORS.map((color, idx) => (
                <button
                  type="button"
                  key={idx}
                  aria-label={`${t.chooseColor} ${idx + 1}`}
                  aria-pressed={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-full cursor-pointer transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 ${
                    selectedColor === color ? 'ring-4 ring-gray-800 scale-110' : 'ring-2 ring-white'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl p-4 sm:p-6 border-4 border-rose-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{t.addText}</h3>
            <Input
              value={bookmarkText}
              onChange={(e) => setBookmarkText(e.target.value)}
              placeholder={t.textPlaceholder}
              aria-label={t.addText}
              maxLength={30}
              className="text-base sm:text-lg border-2 border-rose-400"
            />
          </div>

          {/* Pattern picker */}
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-4 sm:p-6 border-4 border-pink-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{t.choosePattern}</h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {PATTERN_KEYS.map((key) => (
                <Card
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedPatternKey === key}
                  aria-label={t.patterns[key]}
                  onClick={() => setSelectedPatternKey(key)}
                  onKeyDown={onActivate(() => setSelectedPatternKey(key))}
                  className={`p-3 sm:p-4 text-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    selectedPatternKey === key
                      ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white ring-4 ring-purple-300'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-medium text-xs sm:text-sm">{t.patterns[key]}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* ── Preview + action buttons (top on mobile, right on lg) ──────── */}
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">{t.previewHeading}</h3>
            {/* Bookmark preview — scales down on smaller screens */}
            <div
              className="w-44 h-64 sm:w-56 sm:h-80 md:w-64 md:h-[24rem] lg:w-72 lg:h-[32rem] mx-auto rounded-2xl shadow-2xl overflow-hidden relative"
              style={{ background: selectedColor }}
            >
              {selectedPatternKey !== 'none' && (
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: PATTERN_VALUES[selectedPatternKey], backgroundSize: '20px 20px' }}
                />
              )}
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 text-white">
                <div className="text-base sm:text-lg lg:text-2xl font-bold text-center leading-tight">
                  {bookmarkText || t.defaultBookmark}
                </div>
                <div className="text-6xl sm:text-7xl lg:text-8xl">{currentAnimal.emoji}</div>
                <div className="text-sm sm:text-base lg:text-xl font-semibold text-center">
                  {currentCountry.emoji} {currentCountry.name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-5 sm:py-6 text-base sm:text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              {t.download}
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white font-bold py-5 sm:py-6 text-base sm:text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {t.save}
            </Button>
            <Button
              onClick={randomizeDesign}
              className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-5 sm:py-6 text-base sm:text-lg"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              {t.surprise}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-2xl p-4 sm:p-6 mt-6">
        <h3 className="text-lg sm:text-xl font-bold mb-3">{t.tipsTitle}</h3>
        <ul className="space-y-2">
          {t.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm sm:text-base">
              <span className="text-yellow-300 shrink-0">★</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 mt-6 border-4 border-dashed border-purple-400">
        <h3 className="text-lg sm:text-xl font-bold text-purple-700 mb-3">{t.printingTitle}</h3>
        <ol className="space-y-2 list-decimal list-inside">
          {t.printingSteps.map((step, idx) => (
            <li key={idx} className="text-gray-700 text-sm sm:text-base">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
