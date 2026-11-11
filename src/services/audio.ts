let ctx: AudioContext | undefined;
let last = 0;
export function sound(kind: string, on: boolean) {
  if (!on || Date.now() - last < 300) return;
  last = Date.now();
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    const f: Record<string, number> = {
      water: 340,
      cloud: 340,
      pond: 280,
      grass: 900,
      rock: 190,
      bird: 1100,
      tree: 260,
      flower: 660,
      rabbit: 420,
    };
    o.frequency.setValueAtTime(f[kind] ?? 540, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      (f[kind] ?? 540) * 1.4,
      ctx.currentTime + 0.14,
    );
    g.gain.setValueAtTime(0.04, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start();
    o.stop(ctx.currentTime + 0.3);
  } catch {
    /* visual fallback */
  }
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
  u.rate = 1;
  speechSynthesis.speak(u);
}
