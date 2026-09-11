// Shadow Theatre at Bedtime (Activity Studio, priority 2). Pairs with The Adventures of
// Maya's Shadow: while Maya sleeps, her shadow slips out for adventures of its own. A
// printable character kit, torch-light safety guidance, three shadow prompts, and an
// optional read-aloud cue using the browser's own speech synthesis (no network).
import { useState } from 'react';
import { Moon, ShieldCheck, Volume2, RotateCcw } from 'lucide-react';
import { useLanguage, useTranslation } from '../lib/language';
import { intlLocale } from '../lib/locales';
import { StudioFrame, Panel, Printable, StudioActions, LineInput } from './studio/StudioFrame';

const TRANSLATIONS = {
  en: {
    skill: 'Storytelling', title: 'Shadow Theatre at Bedtime', subtitle: 'Make a tiny moonlit scene with three story prompts.', grownup: 'Set the scene',
    eyebrow: 'A cozy off-screen activity', heading: 'Make a little night theatre.',
    steps: ['Ask a grown-up to help you use a torch safely.', 'Put your hands, toys, or the paper shapes below between the light and the wall.', 'Give your shadow a voice. What does it do while you sleep, like Maya’s shadow?'],
    safety: 'Keep lights low, never point a torch into anyone’s eyes, and let an adult hold the torch.',
    tonight: 'Tonight’s opening line', prompts: ['A moonbeam slips under a sleeping door…', 'A very small shadow is looking for a very big hat…', 'The night garden is whispering a secret to the stars…', 'Maya’s shadow tiptoes past the cat and out into the moonlight…'],
    readAloud: 'Read it aloud', newPrompt: 'New prompt', character: 'My shadow character is', characterPh: 'a curious rabbit',
    kit: 'Paper character kit: cut along the dashed lines, tape each shape to a straw.', kitShapes: ['🐇 rabbit', '🦉 owl', '🎩 big hat', '🌙 moon', '🐈 cat', '👧 Maya'], cardLabel: 'Printable shadow theatre kit',
  },
  es: {
    skill: 'Narración', title: 'Teatro de sombras a la hora de dormir', subtitle: 'Crea una pequeña escena a la luz de la luna con tres consignas.', grownup: 'Preparar la escena',
    eyebrow: 'Una actividad acogedora sin pantalla', heading: 'Monta un pequeño teatro nocturno.',
    steps: ['Pide a un adulto que te ayude a usar la linterna con cuidado.', 'Pon tus manos, juguetes o las figuras de papel de abajo entre la luz y la pared.', 'Dale voz a tu sombra. ¿Qué hace mientras duermes, como la sombra de Maya?'],
    safety: 'Mantén la luz baja, nunca apuntes la linterna a los ojos de nadie y deja que un adulto sostenga la linterna.',
    tonight: 'La frase de apertura de esta noche', prompts: ['Un rayo de luna se cuela por debajo de una puerta dormida…', 'Una sombra muy pequeña busca un sombrero muy grande…', 'El jardín nocturno le susurra un secreto a las estrellas…', 'La sombra de Maya pasa de puntillas junto al gato y sale a la luz de la luna…'],
    readAloud: 'Leer en voz alta', newPrompt: 'Otra consigna', character: 'Mi personaje de sombra es', characterPh: 'un conejo curioso',
    kit: 'Kit de personajes de papel: recorta por las líneas de puntos y pega cada figura a una pajita.', kitShapes: ['🐇 conejo', '🦉 búho', '🎩 sombrero grande', '🌙 luna', '🐈 gato', '👧 Maya'], cardLabel: 'Kit de teatro de sombras imprimible',
  },
  fr: {
    skill: 'Raconter des histoires', title: 'Théâtre d’ombres au coucher', subtitle: 'Crée une petite scène au clair de lune avec trois amorces d’histoire.', grownup: 'Installer la scène',
    eyebrow: 'Une activité douillette sans écran', heading: 'Fais un petit théâtre de nuit.',
    steps: ['Demande à un adulte de t’aider à utiliser la lampe torche sans danger.', 'Place tes mains, des jouets ou les formes en papier ci-dessous entre la lumière et le mur.', 'Donne une voix à ton ombre. Que fait-elle pendant que tu dors, comme l’ombre de Maya ?'],
    safety: 'Garde une lumière douce, ne pointe jamais la lampe vers les yeux de quelqu’un et laisse un adulte tenir la lampe.',
    tonight: 'La première phrase de ce soir', prompts: ['Un rayon de lune se glisse sous une porte endormie…', 'Une toute petite ombre cherche un très grand chapeau…', 'Le jardin de nuit murmure un secret aux étoiles…', 'L’ombre de Maya passe sur la pointe des pieds devant le chat et sort au clair de lune…'],
    readAloud: 'Lire à voix haute', newPrompt: 'Nouvelle amorce', character: 'Mon personnage d’ombre est', characterPh: 'un lapin curieux',
    kit: 'Kit de personnages en papier : découpe le long des pointillés et colle chaque forme sur une paille.', kitShapes: ['🐇 lapin', '🦉 hibou', '🎩 grand chapeau', '🌙 lune', '🐈 chat', '👧 Maya'], cardLabel: 'Kit de théâtre d’ombres à imprimer',
  },
};

export default function ShadowTheatreDemo() {
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [promptIndex, setPromptIndex] = useState(0);
  const [character, setCharacter] = useState('');
  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.prompts[promptIndex]);
    u.lang = intlLocale(language);
    window.speechSynthesis.speak(u);
  };

  return (
    <StudioFrame emoji="🌙" hue="plum" skill={t.skill} title={t.title} subtitle={t.subtitle} ages="3-7" minutes={15} bookIds={['mayas-shadow']} grownup={t.grownup}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Panel className="bg-indigo-950 text-indigo-50 border-indigo-900">
          <div className="w-14 h-14 rounded-full bg-amber-300 text-amber-900 grid place-items-center mb-4" aria-hidden><Moon className="w-7 h-7" /></div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-200">{t.eyebrow}</p>
          <h3 className="text-2xl font-bold mt-1 mb-3">{t.heading}</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-indigo-100">
            {t.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-5 flex gap-2 rounded-xl bg-white/10 p-3 text-xs text-amber-100"><ShieldCheck className="w-4 h-4 shrink-0 text-amber-300" aria-hidden /> {t.safety}</p>
        </Panel>
        <div className="grid gap-4">
          <section className="relative overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_30%,#3f5076,#1a2b4b_74%)] text-indigo-50 p-6 sm:p-10 text-center print:hidden" aria-label={t.tonight}>
            <span className="absolute top-4 left-[44%] text-amber-200" aria-hidden>✦</span>
            <span className="absolute top-16 right-[23%] text-amber-200" aria-hidden>✦</span>
            <span className="absolute bottom-8 left-[26%] text-amber-200" aria-hidden>✦</span>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-100">{t.tonight}</p>
            <blockquote className="my-5 text-2xl sm:text-3xl font-bold leading-snug" aria-live="polite">“{t.prompts[promptIndex]}”</blockquote>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={speak} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
                <Volume2 className="w-4 h-4" aria-hidden /> {t.readAloud}
              </button>
              <button type="button" onClick={() => setPromptIndex((promptIndex + 1) % t.prompts.length)} className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-indigo-950 hover:bg-amber-200">
                <RotateCcw className="w-4 h-4" aria-hidden /> {t.newPrompt}
              </button>
            </div>
          </section>
          <Printable label={t.cardLabel}>
            <p className="text-lg font-bold text-gray-800">“{t.prompts[promptIndex]}”</p>
            <div className="mt-3 max-w-sm"><LineInput label={t.character} value={character} onChange={setCharacter} placeholder={t.characterPh} /></div>
            <p className="mt-5 text-sm text-gray-600">{t.kit}</p>
            <ul className="mt-3 grid grid-cols-3 gap-3">
              {t.kitShapes.map((s) => (
                <li key={s} className="aspect-square rounded-xl border-2 border-dashed border-gray-400 grid place-items-center text-center text-sm font-semibold text-gray-800 bg-gray-50">
                  <span><span className="block text-3xl" aria-hidden>{s.split(' ')[0]}</span>{s.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
            <StudioActions onReset={() => { setPromptIndex(0); setCharacter(''); }} />
          </Printable>
        </div>
      </div>
    </StudioFrame>
  );
}
