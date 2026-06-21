import { useEffect, useState } from 'react';
import { useTranslation } from '../lib/language';
import helloUrl from '../assets/pixel/hello.svg';
import readingUrl from '../assets/pixel/reading.svg';
import readingInlineUrl from '../assets/pixel/reading-inline.svg';
import praiseUrl from '../assets/pixel/praise.svg';
import sleepyUrl from '../assets/pixel/sleepy.svg';
import pointingUrl from '../assets/pixel/pointing.svg';
import listeningUrl from '../assets/pixel/listening.svg';

// Pixel the Butterfly mascot.
//
// Final illustrated art lives in src/assets/pixel/*.svg (see
// docs/pixel-mascot-brief.md). Each mood is a self-contained SVG rendered as an
// <img>, so multiple Pixels can share a page without SVG id collisions.
//
// Pixel is ON for all visitors. A reader can opt out by visiting any page with
// ?pixel=0 (the choice persists via localStorage); ?pixel=1 turns her back on.
// To hide her from everyone again, default the localStorage branch back to
// `=== 'on'` (and return false from the no-window / catch branches).

export type PixelMood = 'hello' | 'reading' | 'praise' | 'sleepy' | 'pointing' | 'listening';

const ART: Record<PixelMood, string> = {
  hello: helloUrl,
  reading: readingUrl,
  praise: praiseUrl,
  sleepy: sleepyUrl,
  pointing: pointingUrl,
  listening: listeningUrl,
};

// Per-language alt text so screen readers describe Pixel in the active locale.
const ALT_TRANSLATIONS: Record<'en' | 'es' | 'fr', Record<PixelMood, string>> = {
  en: {
    hello: 'Pixel the butterfly waving hello',
    reading: 'Pixel the butterfly reading along',
    praise: 'Pixel the butterfly holding a star',
    sleepy: 'Pixel the butterfly resting',
    pointing: 'Pixel the butterfly pointing at a word',
    listening: 'Pixel the butterfly listening',
  },
  es: {
    hello: 'Pixel la mariposa saludando',
    reading: 'Pixel la mariposa leyendo',
    praise: 'Pixel la mariposa sosteniendo una estrella',
    sleepy: 'Pixel la mariposa descansando',
    pointing: 'Pixel la mariposa señalando una palabra',
    listening: 'Pixel la mariposa escuchando',
  },
  fr: {
    hello: 'Pixel le papillon qui dit bonjour',
    reading: 'Pixel le papillon qui lit',
    praise: 'Pixel le papillon tenant une étoile',
    sleepy: 'Pixel le papillon qui se repose',
    pointing: 'Pixel le papillon qui montre un mot',
    listening: 'Pixel le papillon qui écoute',
  },
};

function readEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('pixel')) {
      const on = params.get('pixel') !== '0';
      window.localStorage.setItem('pixelMascot', on ? 'on' : 'off');
      return on;
    }
    return window.localStorage.getItem('pixelMascot') !== 'off';
  } catch {
    return true;
  }
}

export function usePixelEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(readEnabled());
  }, []);
  return enabled;
}

interface PixelProps {
  mood?: PixelMood;
  size?: number;
  className?: string;
  /** Use the compact 24px-optimized art (only meaningful for the reading mood). */
  inline?: boolean;
  /** Accessible label; defaults to a per-mood description. Pass "" for decorative. */
  title?: string;
}

export default function Pixel({ mood = 'hello', size = 120, className, inline = false, title }: PixelProps) {
  const enabled = usePixelEnabled();
  const ALT = useTranslation(ALT_TRANSLATIONS);

  if (!enabled) return null;

  const src = inline && mood === 'reading' ? readingInlineUrl : ART[mood];
  const alt = title ?? ALT[mood];

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      className={className}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
