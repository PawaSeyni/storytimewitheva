import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Eraser, Palette } from "lucide-react";

const colorPalette = [
  { name: 'Red', color: '#FF6B6B' },
  { name: 'Orange', color: '#FFA07A' },
  { name: 'Yellow', color: '#FFD93D' },
  { name: 'Green', color: '#6BCF7F' },
  { name: 'Blue', color: '#4D96FF' },
  { name: 'Purple', color: '#9D84B7' },
  { name: 'Pink', color: '#FFB6D9' },
  { name: 'Brown', color: '#A0826D' },
  { name: 'Black', color: '#2C3333' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Sky', color: '#89CFF0' },
  { name: 'Lime', color: '#BFFF00' }
];

// Define drawing functions separately to avoid circular reference
const drawingSun = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180;
    const x1 = centerX + Math.cos(angle) * (radius + 10);
    const y1 = centerY + Math.sin(angle) * (radius + 10);
    const x2 = centerX + Math.cos(angle) * (radius + 40);
    const y2 = centerY + Math.sin(angle) * (radius + 40);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.arc(centerX - 30, centerY - 20, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + 30, centerY - 20, 10, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY + 20, 50, 0, Math.PI);
  ctx.stroke();
};

const drawingButterfly = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 15, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 60);
  ctx.lineTo(centerX - 20, centerY - 90);
  ctx.moveTo(centerX, centerY - 60);
  ctx.lineTo(centerX + 20, centerY - 90);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX - 60, centerY - 30, 50, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX - 50, centerY + 30, 40, 50, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX + 60, centerY - 30, 50, 60, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX + 50, centerY + 30, 40, 50, 0, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX - 60, centerY - 30, 15, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX + 60, centerY - 30, 15, 0, Math.PI * 2);
  ctx.stroke();
};

const drawingStar = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outerRadius = 120;
  const innerRadius = 50;
  const points = 5;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX - 25, centerY - 15, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + 25, centerY - 15, 10, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY + 15, 35, 0, Math.PI);
  ctx.stroke();
};

const drawingFlower = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const petalCount = 6;
  const petalRadius = 60;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 60) * Math.PI / 180;
    const petalX = centerX + Math.cos(angle) * 70;
    const petalY = centerY + Math.sin(angle) * 70;
    
    ctx.beginPath();
    ctx.ellipse(petalX, petalY, petalRadius, 40, angle, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 40);
  ctx.lineTo(centerX, canvas.height - 100);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX - 30, canvas.height - 150, 30, 50, -30 * Math.PI / 180, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.ellipse(centerX + 30, canvas.height - 180, 30, 50, 30 * Math.PI / 180, 0, Math.PI * 2);
  ctx.stroke();
};

const drawingHeart = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 50);
  ctx.bezierCurveTo(centerX, centerY + 20, centerX - 50, centerY - 30, centerX - 80, centerY - 30);
  ctx.bezierCurveTo(centerX - 110, centerY - 30, centerX - 110, centerY + 10, centerX - 110, centerY + 10);
  ctx.bezierCurveTo(centerX - 110, centerY + 40, centerX - 80, centerY + 70, centerX, centerY + 110);
  ctx.bezierCurveTo(centerX + 80, centerY + 70, centerX + 110, centerY + 40, centerX + 110, centerY + 10);
  ctx.bezierCurveTo(centerX + 110, centerY + 10, centerX + 110, centerY - 30, centerX + 80, centerY - 30);
  ctx.bezierCurveTo(centerX + 50, centerY - 30, centerX, centerY + 20, centerX, centerY + 50);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX - 30, centerY, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX + 30, centerY, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY + 20, 25, 0, Math.PI);
  ctx.stroke();
};

const drawingRainbow = (ctx, canvas) => {
  const centerX = canvas.width / 2;
  const baseY = canvas.height - 100;
  
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000';
  
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(centerX, baseY, 200 - i * 25, Math.PI, 0);
    ctx.stroke();
  }
  
  const drawCloud = (x, y) => {
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
  
  drawCloud(centerX - 220, baseY - 10);
  drawCloud(centerX + 160, baseY - 10);
};

// Now create templates using the defined functions
const coloringTemplates = {
  en: [
    { name: "Happy Sun", emoji: "☀️", draw: drawingSun },
    { name: "Cute Butterfly", emoji: "🦋", draw: drawingButterfly },
    { name: "Friendly Star", emoji: "⭐", draw: drawingStar },
    { name: "Happy Flower", emoji: "🌸", draw: drawingFlower },
    { name: "Cute Heart", emoji: "💝", draw: drawingHeart },
    { name: "Rainbow", emoji: "🌈", draw: drawingRainbow }
  ],
  es: [
    { name: "Sol Feliz", emoji: "☀️", draw: drawingSun },
    { name: "Mariposa Linda", emoji: "🦋", draw: drawingButterfly },
    { name: "Estrella Amigable", emoji: "⭐", draw: drawingStar },
    { name: "Flor Feliz", emoji: "🌸", draw: drawingFlower },
    { name: "Corazón Lindo", emoji: "💝", draw: drawingHeart },
    { name: "Arcoíris", emoji: "🌈", draw: drawingRainbow }
  ],
  fr: [
    { name: "Soleil Joyeux", emoji: "☀️", draw: drawingSun },
    { name: "Papillon Mignon", emoji: "🦋", draw: drawingButterfly },
    { name: "Étoile Amicale", emoji: "⭐", draw: drawingStar },
    { name: "Fleur Heureuse", emoji: "🌸", draw: drawingFlower },
    { name: "Cœur Mignon", emoji: "💝", draw: drawingHeart },
    { name: "Arc-en-ciel", emoji: "🌈", draw: drawingRainbow }
  ]
};

const translations = {
  en: {
    title: "Eva's Coloring Adventure",
    subtitle: "Pick a color and tap to paint! Let your creativity shine!",
    generate: "New Drawing",
    generating: "Loading...",
    download: "Save Art",
    eraser: "Eraser",
    clear: "Start Over",
    brushSize: "Brush Size:",
    selectColor: "Select Color:",
    chooseTheme: "Choose Theme:",
    howToPlay: "How to Play",
    htp1: "Choose a theme below and click \"New Drawing\"",
    htp2: "Pick a color from the palette",
    htp3: "Tap or click on the canvas to paint",
    htp4: "Use the eraser to fix mistakes",
    htp5: "Download your masterpiece when you're done!"
  },
  es: {
    title: "Aventura de Colorear con Eva",
    subtitle: "¡Elige un color y toca para pintar! ¡Deja brillar tu creatividad!",
    generate: "Nuevo Dibujo",
    generating: "Cargando...",
    download: "Guardar Arte",
    eraser: "Borrador",
    clear: "Empezar de Nuevo",
    brushSize: "Tamaño del Pincel:",
    selectColor: "Seleccionar Color:",
    chooseTheme: "Elegir Tema:",
    howToPlay: "Cómo Jugar",
    htp1: "Elige un tema y haz clic en \"Nuevo Dibujo\"",
    htp2: "Selecciona un color de la paleta",
    htp3: "Toca o haz clic en el lienzo para pintar",
    htp4: "Usa el borrador para corregir errores",
    htp5: "¡Descarga tu obra maestra cuando hayas terminado!"
  },
  fr: {
    title: "Aventure de Coloriage avec Eva",
    subtitle: "Choisissez une couleur et tapez pour peindre! Laissez briller votre créativité!",
    generate: "Nouveau Dessin",
    generating: "Chargement...",
    download: "Sauvegarder l'Art",
    eraser: "Gomme",
    clear: "Recommencer",
    brushSize: "Taille du Pinceau:",
    selectColor: "Sélectionner la Couleur:",
    chooseTheme: "Choisir le Thème:",
    howToPlay: "Comment Jouer",
    htp1: "Choisissez un thème ci-dessous et cliquez sur \"Nouveau Dessin\"",
    htp2: "Sélectionnez une couleur de la palette",
    htp3: "Appuyez ou cliquez sur la toile pour peindre",
    htp4: "Utilisez la gomme pour corriger les erreurs",
    htp5: "Téléchargez votre chef-d'œuvre une fois terminé !"
  }
};

export default function ColoringDemo({ language = 'en' }) {
  const t = translations[language] || translations.en;
  const templates = coloringTemplates[language] || coloringTemplates.en;
  
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0].color);
  const [brushSize, setBrushSize] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const generateColoringPage = useCallback(() => {
    setIsLoading(true);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 600;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      templates[selectedTheme].draw(ctx, canvas);
      
      setTimeout(() => {
        setIsLoading(false);
        if (window.showToast) {
          window.showToast("Coloring page ready! 🎨", 'success');
        }
      }, 500);
    }
  }, [selectedTheme, templates]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      templates[0].draw(ctx, canvas);
    }
  }, [templates]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? 'white' : selectedColor;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    generateColoringPage();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'eva-coloring-art.png';
      link.href = canvas.toDataURL();
      link.click();
      
      if (window.showToast) {
        window.showToast("Your artwork has been downloaded! 🎨", 'success');
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-purple-700 mb-2">{t.title}</h3>
        <p className="text-gray-600">{t.subtitle}</p>
        <div className="text-5xl my-4 animate-bounce">🎨</div>
      </div>

      {/* How to Play */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h4 className="text-2xl font-bold mb-3 flex items-center gap-2 drop-shadow-md">
            ✨ {t.howToPlay}
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-lg drop-shadow-md">
            <li>{t.htp1}</li>
            <li>{t.htp2}</li>
            <li>{t.htp3}</li>
            <li>{t.htp4}</li>
            <li>{t.htp5}</li>
          </ol>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-purple-700 mb-3">
          {t.chooseTheme}
        </label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {templates.map((theme, index) => (
            <Button
              key={index}
              onClick={() => setSelectedTheme(index)}
              variant={selectedTheme === index ? "default" : "outline"}
              className={`text-xs md:text-sm flex flex-col items-center gap-1 h-auto py-3 ${
                selectedTheme === index 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : ""
              }`}
            >
              <span className="text-2xl">{theme.emoji}</span>
              <span className="text-xs">{theme.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mb-6">
        <Button
          onClick={generateColoringPage}
          disabled={isLoading}
          className="w-full max-w-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg min-h-[56px]"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              {t.generating}
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              {t.generate}
            </>
          )}
        </Button>
      </div>

      {/* Color Palette */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-purple-700 mb-3">
          {t.selectColor}
        </label>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-4">
          {colorPalette.map((colorItem) => (
            <button
              key={colorItem.color}
              onClick={() => {
                setSelectedColor(colorItem.color);
                setIsEraser(false);
              }}
              className={`w-full aspect-square rounded-xl transition-all hover:scale-110 ${
                selectedColor === colorItem.color && !isEraser
                  ? 'ring-4 ring-purple-500 scale-110'
                  : 'ring-2 ring-gray-300'
              }`}
              style={{ backgroundColor: colorItem.color }}
              title={colorItem.name}
            />
          ))}
        </div>
      </div>

      {/* Tools */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          onClick={() => setIsEraser(!isEraser)}
          variant={isEraser ? "default" : "outline"}
          className={isEraser ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white" : ""}
        >
          <Eraser className="w-4 h-4 mr-2" />
          {t.eraser}
        </Button>
        <Button onClick={clearCanvas} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t.clear}
        </Button>
        <Button
          onClick={downloadImage}
          className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          {t.download}
        </Button>
      </div>

      {/* Brush Size */}
      <div className="mb-4">
        <label className="block text-sm font-bold text-purple-700 mb-2">
          {t.brushSize} {brushSize}px
        </label>
        <input
          type="range"
          min="5"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl p-2 shadow-2xl">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-auto rounded-lg cursor-crosshair touch-none"
          style={{ maxWidth: '600px', margin: '0 auto', display: 'block' }}
        />
      </div>

      {/* Current Color Indicator */}
      <div className="flex items-center justify-center gap-3 mt-4 bg-white rounded-full py-3 px-6 shadow-lg">
        <Palette className="w-5 h-5 text-purple-600" />
        <span className="font-semibold text-gray-700">
          {isEraser ? t.eraser : t.selectColor}
        </span>
        <div
          className="w-10 h-10 rounded-full border-4 border-purple-300 shadow-md"
          style={{ backgroundColor: isEraser ? 'white' : selectedColor }}
        />
      </div>
    </div>
  );
}