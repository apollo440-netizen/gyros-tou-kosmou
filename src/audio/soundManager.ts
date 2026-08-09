/**
 * Ηχητικά εφέ συντιθέμενα με WebAudio — κανένα εξωτερικό αρχείο,
 * κανένα autoplay: ο ήχος παράγεται μόνο ως απόκριση σε ενέργεια του χρήστη.
 */

export type SoundName = 'correct' | 'wrong' | 'click' | 'highscore';

let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

function getContext(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  audio: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.12,
): void {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

export function playSound(name: SoundName): void {
  if (!enabled) return;
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  switch (name) {
    case 'correct':
      tone(audio, 523.25, now, 0.12, 'sine');
      tone(audio, 659.25, now + 0.09, 0.12, 'sine');
      tone(audio, 783.99, now + 0.18, 0.2, 'sine');
      break;
    case 'wrong':
      tone(audio, 220, now, 0.18, 'square', 0.06);
      tone(audio, 174.61, now + 0.15, 0.25, 'square', 0.06);
      break;
    case 'click':
      tone(audio, 880, now, 0.05, 'sine', 0.05);
      break;
    case 'highscore':
      tone(audio, 523.25, now, 0.12);
      tone(audio, 659.25, now + 0.1, 0.12);
      tone(audio, 783.99, now + 0.2, 0.12);
      tone(audio, 1046.5, now + 0.3, 0.35);
      break;
  }
}
