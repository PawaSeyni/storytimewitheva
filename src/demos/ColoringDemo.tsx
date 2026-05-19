import { useState, useRef, useEffect, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Eraser, Palette } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';

const COLOR_PALETTE_KEYS = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple',
  'pink', 'brown', 'black', 'white', 'sky', 'lime',
] as const;
type ColorKey = (typeof COLOR_PALETTE_KEYS)[number];

const COLOR_VALUES: Record<ColorKey, string> = {
  red: '#FF6B6B',
  orange: '#FFA07A',
  yellow: '#FFD93D',
  green: '#6BCF7F',
  blue: '#4D96FF',
  purple: '#9D84B7',
  pink: '#FFB6D9',
  brown: '#A0826D',
  black: '#2C3333',
  white: '#FFFFFF',
  sky: '#89CFF0',
  lime: '#BFFF00',
};

type DrawFn = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

const drawSun: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 100;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180;
    const x1 = cx + Math.cos(angle) * (r + 10);
    const y1 = cy + Math.sin(angle) * (r + 10);
    const x2 = cx + Math.cos(angle) * (r + 40);
    const y2 = cy + Math.sin(angle) * (r + 40);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx - 30, cy - 20, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 30, cy - 20, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + 20, 50, 0, Math.PI);
  ctx.stroke();
};

const drawButterfly: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 15, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - 60);
  ctx.lineTo(cx - 20, cy - 90);
  ctx.moveTo(cx, cy - 60);
  ctx.lineTo(cx + 20, cy - 90);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx - 60, cy - 30, 50, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx - 50, cy + 30, 40, 50, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 60, cy - 30, 50, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 50, cy + 30, 40, 50, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - 60, cy - 30, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 60, cy - 30, 15, 0, Math.PI * 2);
  ctx.stroke();
};

const drawStar: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const outer = 120;
  const inner = 50;
  const points = 5;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx - 25, cy - 15, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 25, cy - 15, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + 15, 35, 0, Math.PI);
  ctx.stroke();
};

const drawFlower: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * Math.PI / 180;
    const px = cx + Math.cos(angle) * 70;
    const py = cy + Math.sin(angle) * 70;
    ctx.beginPath();
    ctx.ellipse(px, py, 60, 40, angle, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + 40);
  ctx.lineTo(cx, canvas.height - 100);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx - 30, canvas.height - 150, 30, 50, (-30 * Math.PI) / 180, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 30, canvas.height - 180, 30, 50, (30 * Math.PI) / 180, 0, Math.PI * 2);
  ctx.stroke();
};

const drawHeart: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 50);
  ctx.bezierCurveTo(cx, cy + 20, cx - 50, cy - 30, cx - 80, cy - 30);
  ctx.bezierCurveTo(cx - 110, cy - 30, cx - 110, cy + 10, cx - 110, cy + 10);
  ctx.bezierCurveTo(cx - 110, cy + 40, cx - 80, cy + 70, cx, cy + 110);
  ctx.bezierCurveTo(cx + 80, cy + 70, cx + 110, cy + 40, cx + 110, cy + 10);
  ctx.bezierCurveTo(cx + 110, cy + 10, cx + 110, cy - 30, cx + 80, cy - 30);
  ctx.bezierCurveTo(cx + 50, cy - 30, cx, cy + 20, cx, cy + 50);
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx - 30, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 30, cy, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy + 20, 25, 0, Math.PI);
  ctx.stroke();
};

const drawRainbow: DrawFn = (ctx, canvas) => {
  const cx = canvas.width / 2;
  const baseY = canvas.height - 100;
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000';
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(cx, baseY, 200 - i * 25, Math.PI, 0);
    ctx.stroke();
  }
  const drawCloud = (x: number, y: number) => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + i * 30, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  };
  drawCloud(cx - 220, baseY - 10);
  drawCloud(cx + 160, baseY - 10);
};

type ThemeKey = 'sun' | 'butterfly' | 'star' | 'flower' | 'heart' | 'rainbow';

const THEME_META: { key: ThemeKey; emoji: string; draw: DrawFn }[] = [
  { key: 'sun', emoji: '☀️', draw: drawSun },
  { key: 'butterfly', emoji: '🦋', draw: drawButterfly },
  { key: 'star', emoji: '⭐', draw: drawStar },
  { key: 'flower', emoji: '🌸', draw: drawFlower },
  { key: 'heart', emoji: '💝', draw: drawHeart },
  { key: 'rainbow', emoji: '🌈', draw: drawRainbow },
];

const TRANSLATIONS = {
  en: {
    heading: "Eva's Coloring Adventure",
    subheading: 'Pick a color and tap to paint! Let your creativity shine!',
    howToPlay: '✨ How to Play',
    howToPlaySteps: [
      'Choose a theme below and click "New Drawing"',
      'Pick a color from the palette',
      'Tap or click on the canvas to paint',
      'Use the eraser to fix mistakes',
      "Download your masterpiece when you're done!",
    ],
    chooseTheme: 'Choose Theme:',
    newDrawing: 'New Drawing',
    selectColor: 'Select Color:',
    eraser: 'Eraser',
    startOver: 'Start Over',
    saveArt: 'Save Art',
    brushSize: 'Brush Size:',
    eraserLabel: 'Eraser',
    selectColorLabel: 'Select Color',
    themes: {
      sun: { name: 'Happy Sun', short: 'Sun' },
      butterfly: { name: 'Cute Butterfly', short: 'Butterfly' },
      star: { name: 'Friendly Star', short: 'Star' },
      flower: { name: 'Happy Flower', short: 'Flower' },
      heart: { name: 'Cute Heart', short: 'Heart' },
      rainbow: { name: 'Rainbow', short: 'Rainbow' },
    },
    colors: {
      red: 'Red', orange: 'Orange', yellow: 'Yellow', green: 'Green',
      blue: 'Blue', purple: 'Purple', pink: 'Pink', brown: 'Brown',
      black: 'Black', white: 'White', sky: 'Sky', lime: 'Lime',
    },
    downloadFilename: 'eva-coloring-art.png',
  },
  es: {
    heading: 'Aventura para colorear con Eva',
    subheading: '¡Elige un color y toca para pintar! ¡Deja brillar tu creatividad!',
    howToPlay: '✨ Cómo se juega',
    howToPlaySteps: [
      'Elige un tema abajo y pulsa «Nuevo dibujo»',
      'Escoge un color de la paleta',
      'Toca o haz clic en el lienzo para pintar',
      'Usa la goma para arreglar errores',
      '¡Descarga tu obra maestra cuando acabes!',
    ],
    chooseTheme: 'Elige tema:',
    newDrawing: 'Nuevo dibujo',
    selectColor: 'Selecciona color:',
    eraser: 'Goma',
    startOver: 'Empezar de nuevo',
    saveArt: 'Guardar arte',
    brushSize: 'Tamaño del pincel:',
    eraserLabel: 'Goma',
    selectColorLabel: 'Selecciona color',
    themes: {
      sun: { name: 'Sol feliz', short: 'Sol' },
      butterfly: { name: 'Mariposa bonita', short: 'Mariposa' },
      star: { name: 'Estrella amigable', short: 'Estrella' },
      flower: { name: 'Flor feliz', short: 'Flor' },
      heart: { name: 'Corazón bonito', short: 'Corazón' },
      rainbow: { name: 'Arcoíris', short: 'Arcoíris' },
    },
    colors: {
      red: 'Rojo', orange: 'Naranja', yellow: 'Amarillo', green: 'Verde',
      blue: 'Azul', purple: 'Morado', pink: 'Rosa', brown: 'Marrón',
      black: 'Negro', white: 'Blanco', sky: 'Celeste', lime: 'Lima',
    },
    downloadFilename: 'arte-para-colorear-eva.png',
  },
  fr: {
    heading: "L'aventure coloriage d'Eva",
    subheading: 'Choisis une couleur et tape pour peindre ! Laisse parler ta créativité !',
    howToPlay: '✨ Comment ça marche',
    howToPlaySteps: [
      'Choisis un thème ci-dessous et clique sur « Nouveau dessin »',
      'Choisis une couleur dans la palette',
      'Tape ou clique sur la toile pour peindre',
      'Utilise la gomme pour corriger',
      'Télécharge ton chef-d\'œuvre quand tu as fini !',
    ],
    chooseTheme: 'Choisis le thème :',
    newDrawing: 'Nouveau dessin',
    selectColor: 'Choisis la couleur :',
    eraser: 'Gomme',
    startOver: 'Recommencer',
    saveArt: 'Sauvegarder',
    brushSize: 'Taille du pinceau :',
    eraserLabel: 'Gomme',
    selectColorLabel: 'Choisis la couleur',
    themes: {
      sun: { name: 'Soleil joyeux', short: 'Soleil' },
      butterfly: { name: 'Joli papillon', short: 'Papillon' },
      star: { name: 'Étoile amicale', short: 'Étoile' },
      flower: { name: 'Fleur joyeuse', short: 'Fleur' },
      heart: { name: 'Joli cœur', short: 'Cœur' },
      rainbow: { name: 'Arc-en-ciel', short: 'Arc-en-ciel' },
    },
    colors: {
      red: 'Rouge', orange: 'Orange', yellow: 'Jaune', green: 'Vert',
      blue: 'Bleu', purple: 'Violet', pink: 'Rose', brown: 'Marron',
      black: 'Noir', white: 'Blanc', sky: 'Ciel', lime: 'Citron',
    },
    downloadFilename: 'coloriage-eva.png',
  },
} satisfies Record<Language, unknown>;

export default function ColoringDemo() {
  const t = useTranslation(TRANSLATIONS);
  const { language: _language } = useLanguage();
  void _language;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_VALUES.red);
  const [brushSize, setBrushSize] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);

  const generateColoringPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 600;
    canvas.height = 600;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    THEME_META[selectedThemeIdx].draw(ctx, canvas);
  }, [selectedThemeIdx]);

  useEffect(() => {
    generateColoringPage();
  }, [generateColoringPage]);

  const getCanvasCoords = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX: number;
    let clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y, ctx: canvas.getContext('2d') };
  };

  const handleStart = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const c = getCanvasCoords(e);
    if (!c || !c.ctx) return;
    c.ctx.lineCap = 'round';
    c.ctx.lineJoin = 'round';
    c.ctx.lineWidth = brushSize;
    c.ctx.strokeStyle = isEraser ? 'white' : selectedColor;
    c.ctx.beginPath();
    c.ctx.moveTo(c.x, c.y);
  };

  const handleMove = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const c = getCanvasCoords(e);
    if (!c || !c.ctx) return;
    c.ctx.lineCap = 'round';
    c.ctx.lineJoin = 'round';
    c.ctx.lineWidth = brushSize;
    c.ctx.strokeStyle = isEraser ? 'white' : selectedColor;
    c.ctx.lineTo(c.x, c.y);
    c.ctx.stroke();
  };

  const handleStop = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = t.downloadFilename;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-purple-700 mb-2">{t.heading}</h3>
        <p className="text-gray-600">{t.subheading}</p>
        <div className="text-5xl my-4 animate-bounce">🎨</div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h4 className="text-2xl font-bold mb-3 flex items-center gap-2 drop-shadow-md">{t.howToPlay}</h4>
          <ol className="list-decimal list-inside space-y-2 text-lg drop-shadow-md">
            {t.howToPlaySteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-purple-700 mb-3">{t.chooseTheme}</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {THEME_META.map((theme, index) => (
            <Button
              key={theme.key}
              onClick={() => setSelectedThemeIdx(index)}
              variant={selectedThemeIdx === index ? 'default' : 'outline'}
              className={`text-xs md:text-sm flex flex-col items-center gap-1 h-auto py-3 ${
                selectedThemeIdx === index ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''
              }`}
            >
              <span className="text-2xl">{theme.emoji}</span>
              <span className="text-xs">{t.themes[theme.key].short}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={generateColoringPage}
          className="w-full max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg min-h-[56px]"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {t.newDrawing}
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-purple-700 mb-3">{t.selectColor}</label>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-4">
          {COLOR_PALETTE_KEYS.map((key) => {
            const value = COLOR_VALUES[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedColor(value);
                  setIsEraser(false);
                }}
                className={`w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                  selectedColor === value && !isEraser ? 'ring-4 ring-purple-500 scale-110' : 'ring-2 ring-gray-300'
                }`}
                style={{ backgroundColor: value }}
                title={t.colors[key]}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          onClick={() => setIsEraser(!isEraser)}
          variant={isEraser ? 'default' : 'outline'}
          className={isEraser ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' : ''}
        >
          <Eraser className="w-4 h-4 mr-2" />
          {t.eraser}
        </Button>
        <Button onClick={generateColoringPage} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.startOver}
        </Button>
        <Button
          onClick={downloadImage}
          className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          {t.saveArt}
        </Button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-purple-700 mb-2">{t.brushSize} {brushSize}px</label>
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="bg-white rounded-xl p-2 shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseUp={handleStop}
          onMouseMove={handleMove}
          onMouseLeave={handleStop}
          onTouchStart={handleStart}
          onTouchEnd={handleStop}
          onTouchMove={handleMove}
          className="w-full h-auto rounded-lg cursor-crosshair touch-none"
          style={{ maxWidth: '600px', margin: '0 auto', display: 'block' }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 mt-4 bg-white rounded-full py-3 px-6 shadow-lg">
        <Palette className="w-5 h-5 text-purple-600" />
        <span className="font-semibold text-gray-700">{isEraser ? t.eraserLabel : t.selectColorLabel}</span>
        <div
          className="w-10 h-10 rounded-full border-4 border-purple-300 shadow-md"
          style={{ backgroundColor: isEraser ? 'white' : selectedColor }}
        />
      </div>
    </div>
  );
}
