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
export type MusicTrack = "valley" | "play";
// CC0 recordings; sources are listed in public/assets/PROVENANCE.md.
export const musicFiles: Record<MusicTrack, string> = {
  valley: "/assets/music-valley.m4a",
  play: "/assets/music-play.mp3",
};
const musicLevel = 0.16;
const duckedLevel = 0.04;
// Compressed files decode with a little silence at both ends; looping between the first and
// last audible samples keeps the loop free of a gap.
export function loopBounds(
  samples: Float32Array,
  sampleRate: number,
): [number, number] {
  const quiet = 0.001;
  let first = 0;
  let end = samples.length;
  while (first < end && Math.abs(samples[first]) < quiet) first++;
  while (end > first && Math.abs(samples[end - 1]) < quiet) end--;
  if (end - first < sampleRate) return [0, samples.length / sampleRate];
  return [first / sampleRate, end / sampleRate];
}
const musicBuffers = new Map<MusicTrack, Promise<AudioBuffer>>();
let musicGain: GainNode | undefined;
let musicNow: { source: AudioBufferSourceNode; fade: GainNode } | undefined;
let musicWanted: MusicTrack | null = null;
let musicRequest = 0;
let musicListening = false;
function loadMusic(context: AudioContext, track: MusicTrack) {
  let buffer = musicBuffers.get(track);
  if (!buffer) {
    buffer = fetch(musicFiles[track])
      .then((r) => {
        if (!r.ok) throw Error("music unavailable");
        return r.arrayBuffer();
      })
      .then((data) => context.decodeAudioData(data));
    buffer.catch(() => musicBuffers.delete(track));
    musicBuffers.set(track, buffer);
  }
  return buffer;
}
function stopMusic() {
  if (!ctx || !musicNow) return;
  const { source, fade } = musicNow;
  musicNow = undefined;
  fade.gain.cancelScheduledValues(ctx.currentTime);
  fade.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
  source.stop(ctx.currentTime + 1.2);
}
function duckMusic(ducked: boolean) {
  if (!ctx || !musicGain) return;
  musicGain.gain.cancelScheduledValues(ctx.currentTime);
  musicGain.gain.setTargetAtTime(
    ducked ? duckedLevel : musicLevel,
    ctx.currentTime,
    0.15,
  );
}
// Browsers keep audio suspended until a touch, so every touch resumes it; a hidden tab stays quiet.
function listenForMusic() {
  if (musicListening) return;
  musicListening = true;
  const wake = () => {
    if (musicWanted && !document.hidden) void ctx?.resume();
  };
  addEventListener("pointerdown", wake);
  addEventListener("keydown", wake);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) void ctx?.suspend();
    else wake();
  });
}
/** Loops the given background track, cross-fading from the previous one; null fades to silence. */
export function setBackgroundMusic(track: MusicTrack | null) {
  if (track === musicWanted) return;
  musicWanted = track;
  const request = ++musicRequest;
  if (!track) {
    stopMusic();
    return;
  }
  try {
    ctx ??= new AudioContext();
    const context = ctx;
    void context.resume();
    listenForMusic();
    if (!musicGain) {
      musicGain = context.createGain();
      musicGain.gain.value = musicLevel;
      musicGain.connect(context.destination);
    }
    const out = musicGain;
    loadMusic(context, track)
      .then((buffer) => {
        if (request !== musicRequest) return;
        stopMusic();
        const source = context.createBufferSource();
        const fade = context.createGain();
        const [start, end] = loopBounds(
          buffer.getChannelData(0),
          buffer.sampleRate,
        );
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = start;
        source.loopEnd = end;
        fade.gain.setValueAtTime(0, context.currentTime);
        fade.gain.linearRampToValueAtTime(1, context.currentTime + 1.2);
        source.connect(fade);
        fade.connect(out);
        source.start(0, start);
        musicNow = { source, fade };
      })
      .catch(() => {
        // Offline or unsupported file: the game simply stays without music until the next change.
        if (request === musicRequest) musicWanted = null;
      });
  } catch {
    musicWanted = null;
  }
}
let lastSpeech = 0;
let speaking: SpeechSynthesisUtterance | undefined;
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
  // Music steps back while Lucky talks; the timer covers browsers that never report the end.
  speaking = u;
  duckMusic(true);
  const done = () => {
    if (speaking !== u) return;
    speaking = undefined;
    duckMusic(false);
  };
  u.onend = done;
  u.onerror = done;
  setTimeout(done, 12000);
  speechSynthesis.speak(u);
}
