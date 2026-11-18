// Read-aloud via the Web Speech API (speechSynthesis). No backend, no audio
// files — the browser's built-in en/es/fr voices narrate on demand. Fits the
// static-site model and gives pre-readers + language learners a "Listen"
// option with correct per-language pronunciation.
//
// A tiny module-level controller guarantees only ONE utterance plays at a time
// and lets every <ReadAloudButton> reflect whether *it* is the active one
// (via useSyncExternalStore). All window access is guarded so it stays
// import-safe under SSR/prerender.

import type { Language } from './language';
import { intlLocale } from './locales';
import { listen } from './compat';

export function isSpeechSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    !!window.speechSynthesis &&
    typeof window.speechSynthesis.speak === 'function' &&
    typeof window.SpeechSynthesisUtterance === 'function'
  );
}

let voices: SpeechSynthesisVoice[] = [];
function refreshVoices() {
  if (!isSpeechSupported()) return;
  try {
    const list = window.speechSynthesis.getVoices();
    if (Array.isArray(list)) voices = list;
  } catch {
    /* a partial speechSynthesis (some WebViews): keep the voices we have */
  }
}
if (isSpeechSupported()) {
  refreshVoices();
  // getVoices() is populated asynchronously in most browsers. This runs at module load, in
  // the entry chunk, so it must not throw: some WebViews ship a speechSynthesis that is not
  // an EventTarget, and a throw here stops the whole app before React renders.
  listen(window.speechSynthesis, 'voiceschanged', refreshVoices);
}

function pickVoice(bcp47: string): SpeechSynthesisVoice | null {
  if (!voices.length) refreshVoices();
  const exact = voices.find(v => v.lang === bcp47);
  if (exact) return exact;
  const prefix = bcp47.slice(0, 2);
  return voices.find(v => v.lang?.toLowerCase().startsWith(prefix)) ?? null;
}

// --- single active utterance, with a pub/sub so buttons can subscribe ---
let activeId: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getActiveId(): string | null {
  return activeId;
}

interface PlayOptions {
  /** Fires as each word is spoken (Web Speech `boundary`), with the char index
   *  into `text`. Used for read-along word highlighting. Support varies by
   *  browser/voice; callers must tolerate it never firing. */
  onBoundary?: (charIndex: number) => void;
}

/** Start narrating `text` in `lang`, tagging the active utterance with `id`. */
export function play(id: string, text: string, lang: Language, opts?: PlayOptions): void {
  if (!isSpeechSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything already playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = intlLocale(lang);
  const voice = pickVoice(utterance.lang);
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95; // a touch slower for young listeners and learners
  const clear = () => {
    if (activeId === id) {
      activeId = null;
      notify();
    }
  };
  utterance.onend = clear;
  utterance.onerror = clear;
  if (opts?.onBoundary) {
    utterance.onboundary = (e: SpeechSynthesisEvent) => {
      if (activeId === id) opts.onBoundary!(e.charIndex);
    };
  }
  activeId = id;
  notify();
  synth.speak(utterance);
}

/** Stop any current narration. */
export function stop(): void {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* nothing was playing */
    }
  }
  if (activeId !== null) {
    activeId = null;
    notify();
  }
}
