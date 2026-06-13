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

const LANG_TO_BCP47: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
};

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let voices: SpeechSynthesisVoice[] = [];
function refreshVoices() {
  if (isSpeechSupported()) voices = window.speechSynthesis.getVoices();
}
if (isSpeechSupported()) {
  refreshVoices();
  // getVoices() is populated asynchronously in most browsers.
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
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

/** Start narrating `text` in `lang`, tagging the active utterance with `id`. */
export function play(id: string, text: string, lang: Language): void {
  if (!isSpeechSupported() || !text.trim()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // stop anything already playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_TO_BCP47[lang] ?? 'en-US';
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
  activeId = id;
  notify();
  synth.speak(utterance);
}

/** Stop any current narration. */
export function stop(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
  if (activeId !== null) {
    activeId = null;
    notify();
  }
}
