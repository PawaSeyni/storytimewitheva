import { useState, useRef, useEffect, useCallback } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Eraser, Palette, Save, Trash2 } from 'lucide-react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { useToast } from '../lib/toast';

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

const drawCastle: DrawFn = (ctx, canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;

  // Ground line
  ctx.beginPath();
  ctx.moveTo(50, h - 80);
  ctx.lineTo(w - 50, h - 80);
  ctx.stroke();

  // Central wall body
  ctx.beginPath();
  ctx.rect(w / 2 - 90, h - 280, 180, 200);
  ctx.stroke();

  // Central gate arch
  const gateCx = w / 2;
  const gateBaseY = h - 80;
  const gateW = 60;
  const gateH = 80;
  ctx.beginPath();
  ctx.moveTo(gateCx - gateW / 2, gateBaseY);
  ctx.lineTo(gateCx - gateW / 2, gateBaseY - gateH + gateW / 2);
  ctx.arc(gateCx, gateBaseY - gateH + gateW / 2, gateW / 2, Math.PI, 0);
  ctx.lineTo(gateCx + gateW / 2, gateBaseY);
  ctx.stroke();

  // Left tower
  ctx.beginPath();
  ctx.rect(w / 2 - 160, h - 320, 80, 240);
  ctx.stroke();

  // Right tower
  ctx.beginPath();
  ctx.rect(w / 2 + 80, h - 320, 80, 240);
  ctx.stroke();

  // Battlements on central wall
  for (let i = 0; i < 5; i++) {
    const bx = w / 2 - 90 + i * 40;
    ctx.beginPath();
    ctx.rect(bx + 5, h - 300, 25, 25);
    ctx.stroke();
  }

  // Battlements on left tower
  for (let i = 0; i < 3; i++) {
    const bx = w / 2 - 160 + i * 28;
    ctx.beginPath();
    ctx.rect(bx + 4, h - 340, 20, 22);
    ctx.stroke();
  }

  // Battlements on right tower
  for (let i = 0; i < 3; i++) {
    const bx = w / 2 + 80 + i * 28;
    ctx.beginPath();
    ctx.rect(bx + 4, h - 340, 20, 22);
    ctx.stroke();
  }

  // Flag pole on left tower
  const flagX = w / 2 - 120;
  const flagY = h - 340;
  ctx.beginPath();
  ctx.moveTo(flagX, flagY);
  ctx.lineTo(flagX, flagY - 80);
  ctx.stroke();

  // Flag pennant
  ctx.beginPath();
  ctx.moveTo(flagX, flagY - 80);
  ctx.lineTo(flagX + 50, flagY - 65);
  ctx.lineTo(flagX, flagY - 50);
  ctx.closePath();
  ctx.stroke();

  // Tower arrow-slit windows
  ctx.beginPath();
  ctx.rect(w / 2 - 135, h - 240, 12, 28);
  ctx.stroke();
  ctx.beginPath();
  ctx.rect(w / 2 + 122, h - 240, 12, 28);
  ctx.stroke();
};

const drawOcean: DrawFn = (ctx, canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;

  // Sun top-right
  const sunCx = w - 100;
  const sunCy = 100;
  const sunR = 55;
  ctx.beginPath();
  ctx.arc(sunCx, sunCy, sunR, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(sunCx + Math.cos(angle) * (sunR + 8), sunCy + Math.sin(angle) * (sunR + 8));
    ctx.lineTo(sunCx + Math.cos(angle) * (sunR + 30), sunCy + Math.sin(angle) * (sunR + 30));
    ctx.stroke();
  }

  // Waves at bottom half
  const waveBaseY = h / 2;
  for (let row = 0; row < 4; row++) {
    const wy = waveBaseY + row * 60;
    ctx.beginPath();
    ctx.moveTo(0, wy);
    const segments = 6;
    const segW = w / segments;
    for (let s = 0; s < segments; s++) {
      const x2 = (s + 0.5) * segW;
      const x3 = (s + 1) * segW;
      ctx.quadraticCurveTo(x2, wy - 25, x3, wy);
    }
    ctx.stroke();
  }

  // Boat hull + sail
  const boatCx = 160;
  const boatY = h / 2 + 30;
  ctx.beginPath();
  ctx.moveTo(boatCx - 70, boatY);
  ctx.bezierCurveTo(boatCx - 70, boatY + 40, boatCx + 70, boatY + 40, boatCx + 70, boatY);
  ctx.closePath();
  ctx.stroke();
  // Mast
  ctx.beginPath();
  ctx.moveTo(boatCx, boatY);
  ctx.lineTo(boatCx, boatY - 110);
  ctx.stroke();
  // Sail
  ctx.beginPath();
  ctx.moveTo(boatCx, boatY - 105);
  ctx.lineTo(boatCx + 65, boatY - 50);
  ctx.lineTo(boatCx, boatY - 10);
  ctx.closePath();
  ctx.stroke();

  // Fish outline
  const fishX = w - 160;
  const fishY = h / 2 + 100;
  ctx.beginPath();
  ctx.ellipse(fishX, fishY, 55, 28, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Tail
  ctx.beginPath();
  ctx.moveTo(fishX + 55, fishY);
  ctx.lineTo(fishX + 90, fishY - 25);
  ctx.lineTo(fishX + 90, fishY + 25);
  ctx.closePath();
  ctx.stroke();
  // Eye
  ctx.beginPath();
  ctx.arc(fishX - 30, fishY - 6, 7, 0, Math.PI * 2);
  ctx.stroke();
};

const drawTree: DrawFn = (ctx, canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;

  // Ground line
  ctx.beginPath();
  ctx.moveTo(60, h - 80);
  ctx.lineTo(w - 60, h - 80);
  ctx.stroke();

  // Trunk
  const trunkCx = w / 2;
  const trunkTop = h - 80 - 160;
  const trunkW = 50;
  ctx.beginPath();
  ctx.rect(trunkCx - trunkW / 2, trunkTop, trunkW, 160);
  ctx.stroke();

  // Large round canopy
  const canopyCx = trunkCx;
  const canopyCy = trunkTop - 120;
  const canopyR = 160;
  ctx.beginPath();
  ctx.arc(canopyCx, canopyCy, canopyR, 0, Math.PI * 2);
  ctx.stroke();

  // Apples
  const applePositions = [
    { x: canopyCx - 80, y: canopyCy + 40 },
    { x: canopyCx + 60, y: canopyCy + 60 },
    { x: canopyCx + 10, y: canopyCy - 60 },
  ];
  for (const ap of applePositions) {
    ctx.beginPath();
    ctx.arc(ap.x, ap.y, 22, 0, Math.PI * 2);
    ctx.stroke();
    // Stem
    ctx.beginPath();
    ctx.moveTo(ap.x, ap.y - 22);
    ctx.lineTo(ap.x + 5, ap.y - 34);
    ctx.stroke();
  }

  // Trunk bark line
  ctx.beginPath();
  ctx.moveTo(trunkCx - 10, trunkTop + 40);
  ctx.quadraticCurveTo(trunkCx, trunkTop + 70, trunkCx - 10, trunkTop + 110);
  ctx.stroke();
};

const drawRocket: DrawFn = (ctx, canvas) => {
  const w = canvas.width;
  const h = canvas.height;
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 3;

  const rCx = w / 2;
  const rBottom = h - 100;
  const bodyH = 240;
  const bodyW = 80;
  const rTop = rBottom - bodyH;

  // Rocket body
  ctx.beginPath();
  ctx.rect(rCx - bodyW / 2, rTop, bodyW, bodyH);
  ctx.stroke();

  // Nose cone
  ctx.beginPath();
  ctx.moveTo(rCx - bodyW / 2, rTop);
  ctx.lineTo(rCx, rTop - 100);
  ctx.lineTo(rCx + bodyW / 2, rTop);
  ctx.closePath();
  ctx.stroke();

  // Left fin
  ctx.beginPath();
  ctx.moveTo(rCx - bodyW / 2, rBottom - 20);
  ctx.lineTo(rCx - bodyW / 2 - 55, rBottom + 30);
  ctx.lineTo(rCx - bodyW / 2, rBottom - 80);
  ctx.closePath();
  ctx.stroke();

  // Right fin
  ctx.beginPath();
  ctx.moveTo(rCx + bodyW / 2, rBottom - 20);
  ctx.lineTo(rCx + bodyW / 2 + 55, rBottom + 30);
  ctx.lineTo(rCx + bodyW / 2, rBottom - 80);
  ctx.closePath();
  ctx.stroke();

  // Porthole
  ctx.beginPath();
  ctx.arc(rCx, rTop + 100, 30, 0, Math.PI * 2);
  ctx.stroke();

  // Flames
  const flameBase = rBottom;
  ctx.beginPath();
  ctx.moveTo(rCx, flameBase);
  ctx.bezierCurveTo(rCx - 20, flameBase + 30, rCx - 10, flameBase + 70, rCx, flameBase + 80);
  ctx.bezierCurveTo(rCx + 10, flameBase + 70, rCx + 20, flameBase + 30, rCx, flameBase);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rCx - 20, flameBase);
  ctx.bezierCurveTo(rCx - 35, flameBase + 20, rCx - 28, flameBase + 50, rCx - 22, flameBase + 58);
  ctx.bezierCurveTo(rCx - 14, flameBase + 50, rCx - 8, flameBase + 20, rCx - 20, flameBase);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rCx + 20, flameBase);
  ctx.bezierCurveTo(rCx + 8, flameBase + 20, rCx + 14, flameBase + 50, rCx + 22, flameBase + 58);
  ctx.bezierCurveTo(rCx + 28, flameBase + 50, rCx + 35, flameBase + 20, rCx + 20, flameBase);
  ctx.stroke();

  // Stars around the rocket
  const starPositions = [
    { x: 80, y: 80 }, { x: 150, y: 200 }, { x: 70, y: 320 },
    { x: w - 80, y: 100 }, { x: w - 140, y: 240 }, { x: w - 70, y: 370 },
  ];
  for (const sp of starPositions) {
    const sr = 14;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r2 = i % 2 === 0 ? sr : sr / 2.5;
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const sx = sp.x + r2 * Math.cos(angle);
      const sy = sp.y + r2 * Math.sin(angle);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.stroke();
  }
};

type ThemeKey = 'sun' | 'butterfly' | 'star' | 'flower' | 'heart' | 'rainbow' | 'castle' | 'ocean' | 'tree' | 'rocket';

const THEME_META: { key: ThemeKey; emoji: string; draw: DrawFn }[] = [
  { key: 'sun', emoji: '☀️', draw: drawSun },
  { key: 'butterfly', emoji: '🦋', draw: drawButterfly },
  { key: 'star', emoji: '⭐', draw: drawStar },
  { key: 'flower', emoji: '🌸', draw: drawFlower },
  { key: 'heart', emoji: '💝', draw: drawHeart },
  { key: 'rainbow', emoji: '🌈', draw: drawRainbow },
  { key: 'castle', emoji: '🏰', draw: drawCastle },
  { key: 'ocean', emoji: '🌊', draw: drawOcean },
  { key: 'tree', emoji: '🌳', draw: drawTree },
  { key: 'rocket', emoji: '🚀', draw: drawRocket },
];

const GALLERY_KEY = 'coloringGallery';
const GALLERY_MAX = 12;

interface GalleryItem {
  dataUrl: string;
  template: string;
  savedAt: string;
}

function readGallery(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GalleryItem[];
  } catch {
    return [];
  }
}

function writeGallery(items: GalleryItem[]): boolean {
  // Gallery entries are full-canvas base64 PNGs; a dozen can exceed the ~5MB
  // localStorage quota (and Safari private mode throws on any write). Never let
  // that surface as an uncaught exception out of a click handler.
  try {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

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
    saveArt: 'Download',
    saveToGallery: 'Save to Gallery',
    saveToGallerySuccess: 'Saved to your gallery!',
    saveToGalleryError: "Couldn't save, your gallery may be full. Try deleting a few.",
    brushSize: 'Brush Size:',
    eraserLabel: 'Eraser',
    selectColorLabel: 'Select Color',
    myGallery: 'My Gallery',
    galleryEmpty: 'Your saved artworks will appear here',
    deleteArtwork: 'Delete',
    themes: {
      sun: { name: 'Happy Sun', short: 'Sun' },
      butterfly: { name: 'Cute Butterfly', short: 'Butterfly' },
      star: { name: 'Friendly Star', short: 'Star' },
      flower: { name: 'Happy Flower', short: 'Flower' },
      heart: { name: 'Cute Heart', short: 'Heart' },
      rainbow: { name: 'Rainbow', short: 'Rainbow' },
      castle: { name: 'Fairy-Tale Castle', short: 'Castle' },
      ocean: { name: 'Ocean Fun', short: 'Ocean' },
      tree: { name: 'Apple Tree', short: 'Tree' },
      rocket: { name: 'Rocket Ship', short: 'Rocket' },
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
    saveArt: 'Descargar',
    saveToGallery: 'Guardar en galería',
    saveToGallerySuccess: '¡Guardado en tu galería!',
    saveToGalleryError: 'No se pudo guardar, tu galería puede estar llena. Borra algunos.',
    brushSize: 'Tamaño del pincel:',
    eraserLabel: 'Goma',
    selectColorLabel: 'Selecciona color',
    myGallery: 'Mi galería',
    galleryEmpty: 'Tus obras guardadas aparecerán aquí',
    deleteArtwork: 'Eliminar',
    themes: {
      sun: { name: 'Sol feliz', short: 'Sol' },
      butterfly: { name: 'Mariposa bonita', short: 'Mariposa' },
      star: { name: 'Estrella amigable', short: 'Estrella' },
      flower: { name: 'Flor feliz', short: 'Flor' },
      heart: { name: 'Corazón bonito', short: 'Corazón' },
      rainbow: { name: 'Arcoíris', short: 'Arcoíris' },
      castle: { name: 'Castillo de cuento', short: 'Castillo' },
      ocean: { name: 'Diversión en el mar', short: 'Mar' },
      tree: { name: 'Manzano', short: 'Árbol' },
      rocket: { name: 'Cohete espacial', short: 'Cohete' },
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
    saveArt: 'Télécharger',
    saveToGallery: 'Enregistrer dans la galerie',
    saveToGallerySuccess: 'Enregistré dans ta galerie !',
    saveToGalleryError: "Impossible d'enregistrer, ta galerie est peut-être pleine. Supprime-en quelques-uns.",
    brushSize: 'Taille du pinceau :',
    eraserLabel: 'Gomme',
    selectColorLabel: 'Choisis la couleur',
    myGallery: 'Ma galerie',
    galleryEmpty: 'Tes dessins enregistrés apparaîtront ici',
    deleteArtwork: 'Supprimer',
    themes: {
      sun: { name: 'Soleil joyeux', short: 'Soleil' },
      butterfly: { name: 'Joli papillon', short: 'Papillon' },
      star: { name: 'Étoile amicale', short: 'Étoile' },
      flower: { name: 'Fleur joyeuse', short: 'Fleur' },
      heart: { name: 'Joli cœur', short: 'Cœur' },
      rainbow: { name: 'Arc-en-ciel', short: 'Arc-en-ciel' },
      castle: { name: 'Château de conte', short: 'Château' },
      ocean: { name: "L'océan", short: 'Océan' },
      tree: { name: 'Pommier', short: 'Arbre' },
      rocket: { name: 'Fusée spatiale', short: 'Fusée' },
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
  const toast = useToast();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_VALUES.red);
  const [brushSize, setBrushSize] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);
  // Load the gallery in an effect (not at render) so this demo is safe under
  // the static prerender / any non-browser render path.
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  useEffect(() => {
    setGallery(readGallery());
  }, []);

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

  const saveToGallery = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const templateKey = THEME_META[selectedThemeIdx].key;
    const newItem: GalleryItem = {
      dataUrl,
      template: templateKey,
      savedAt: new Date().toISOString(),
    };
    const prev = readGallery();
    const updated = [newItem, ...prev].slice(0, GALLERY_MAX);
    if (!writeGallery(updated)) {
      toast.error(t.saveToGalleryError);
      return;
    }
    setGallery(updated);
    toast.success(t.saveToGallerySuccess);
  };

  const deleteFromGallery = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    writeGallery(updated);
    setGallery(updated);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">{t.heading}</h2>
        <p className="text-gray-600">{t.subheading}</p>
        <div className="text-5xl my-4 animate-bounce">🎨</div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 drop-shadow-md">{t.howToPlay}</h3>
          <ol className="list-decimal list-inside space-y-2 text-lg drop-shadow-md">
            {t.howToPlaySteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-purple-700 mb-3">{t.chooseTheme}</label>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
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
        <Button
          onClick={saveToGallery}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {t.saveToGallery}
        </Button>
      </div>

      <div className="mb-4">
        <label htmlFor="brush-size" className="block text-sm font-bold text-purple-700 mb-2">{t.brushSize} {brushSize}px</label>
        <input
          id="brush-size"
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

      {/* My Gallery section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-purple-700 mb-4">{t.myGallery}</h3>
        {gallery.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-2xl text-gray-400">
            {t.galleryEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((item, index) => (
              <div key={item.savedAt + String(index)} className="relative group rounded-xl overflow-hidden shadow-md">
                <img
                  src={item.dataUrl}
                  alt={item.template}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => deleteFromGallery(index)}
                  aria-label={t.deleteArtwork}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
