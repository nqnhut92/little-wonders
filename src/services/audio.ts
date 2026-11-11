const audioStorageKey = "little-wonders-audio";
export function loadAudioPreference(): boolean {
  try {
    return localStorage.getItem(audioStorageKey) === "1";
  } catch {
    return false;
  }
}
export function saveAudioPreference(on: boolean) {
  try {
    localStorage.setItem(audioStorageKey, on ? "1" : "0");
  } catch {
    /* keep in memory when storage is blocked */
  }
}
let ctx: AudioContext | undefined;
let last = 0;
let activeVoices = 0;
export const maxVoices = 6;
// Pentatonic scale (C5, D5, E5, G5, A5, C6, D6, E6) so every combination sounds pleasant.
export const pentatonicNotes = [
  523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51,
];
function playTone(freq: number, endFreq: number, duration: number) {
  if (activeVoices >= maxVoices) return false;
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    activeVoices++;
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      endFreq,
      ctx.currentTime + duration * 0.5,
    );
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    o.onended = () => {
      activeVoices = Math.max(0, activeVoices - 1);
    };
    o.start();
    o.stop(ctx.currentTime + duration);
    return true;
  } catch {
    activeVoices = Math.max(0, activeVoices - 1);
    return false;
  }
}
export function sound(kind: string, on: boolean) {
  if (!on || Date.now() - last < 300) return;
  last = Date.now();
  const f: Record<string, number> = {
    water: 340,
    cloud: 340,
    pond: 280,
    grass: 900,
    rock: 190,
    bird: 1100,
    owl: 320,
    tree: 260,
    flower: 660,
    puppy: 420,
    windmill: 480,
    frog: 380,
    snail: 500,
    duck: 620,
    dragonfly: 840,
    "pond-lantern": 700,
  };
  const base = f[kind] ?? 540;
  playTone(base, base * 1.4, 0.3);
}
export function playNote(barIndex: number, on: boolean): boolean {
  if (!on) return false;
  const freq = pentatonicNotes[barIndex % pentatonicNotes.length];
  return playTone(freq, freq, 0.45);
}
let lastSpeech = 0;
// Device voices only (no paid service). Prefer an on-device Vietnamese voice: network voices
// can start before they are ready and fall back to reading letter by letter.
function vietnameseVoice() {
  const voices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("vi"));
  return voices.find((v) => v.localService) ?? voices[0];
}
if (typeof window !== "undefined" && "speechSynthesis" in window)
  speechSynthesis.addEventListener?.("voiceschanged", () => vietnameseVoice());
export function speak(text: string, on: boolean) {
  if (Date.now() - lastSpeech < 1600) return;
  if (!on || !("speechSynthesis" in window)) return;
  const voice = vietnameseVoice();
  if (!voice) return;
  lastSpeech = Date.now();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 1.1;
  speechSynthesis.speak(u);
}
