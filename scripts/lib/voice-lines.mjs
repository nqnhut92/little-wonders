import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import process from "node:process";
import { build } from "esbuild";

const VOICE_VERSION = "vietvoice-170-0.85x-nfe32-v1";

/** Normalizes text to the exact Vietnamese phonetic form fed to VietVoice-TTS. */
export function ttsPrompt(text) {
  return text
    .replace(/\bBạn bạn /g, "Bạn ")
    .replace(/\bbạn bạn /g, "bạn ")
    .replace(/Lắc-ki|Lucky/gi, "Lắc ki")
    .replace(/Ca-pi-ba-ra|Capybara/gi, "Ca pi ba ra")
    .replace(/Salad/gi, "Sa lát")
    .replace(/…/g, ", ")
    .replaceAll("!", ".")
    .replace(/\s+/g, " ")
    .trim();
}

function scanStaticMessages(filePath) {
  const src = readFileSync(filePath, "utf8");
  const found = [];
  const patterns = [
    /\bsay\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    /\breact\([^,]+,\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    /\bmessage:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,
  ];
  for (const re of patterns) {
    for (const m of src.matchAll(re)) found.push(m[1]);
  }
  return found;
}

export async function collectVoiceLines() {
  const res = await build({
    stdin: {
      contents: `
        import { discoveries, hints } from "./src/data/content";
        import { pals } from "./src/data/pals";
        import { regions } from "./src/data/regions";
        import { dishes } from "./src/data/recipes";
        import { scenes } from "./src/data/scenes";
        import { interactions } from "./src/data/interactions";
        import { palSpeak } from "./src/game/lunch";
        import { crops, itemName } from "./src/data/crops";
        import { seasonalInfo } from "./src/game/seasons";
        import { voiceKey } from "./src/services/voice";
        export { discoveries, hints, pals, regions, dishes, scenes, interactions, palSpeak, crops, itemName, seasonalInfo, voiceKey };
      `,
      resolveDir: process.cwd(),
      loader: "ts",
    },
    bundle: true,
    write: false,
    format: "esm",
  });
  const mod = await import(
    "data:text/javascript;base64," +
      Buffer.from(res.outputFiles[0].text).toString("base64")
  );
  const {
    discoveries,
    hints,
    pals,
    regions,
    dishes,
    scenes,
    interactions,
    palSpeak,
    crops,
    itemName,
    seasonalInfo,
    voiceKey,
  } = mod;

  const byKey = new Map();
  const add = (raw) => {
    if (!raw || !raw.trim()) return;
    const key = voiceKey(raw);
    if (byKey.has(key)) return;
    const text = ttsPrompt(key);
    const hash = createHash("sha256")
      .update(`${VOICE_VERSION}|${text}`)
      .digest("hex")
      .slice(0, 10);
    const filename = `v-${hash}.m4a`;
    byKey.set(key, {
      key,
      ttsText: text,
      hash,
      filename,
      url: `/assets/voice/${filename}`,
    });
  };

  // Priority 1: Greetings, hints, ValleyMap, and core UI lines.
  add("Chào con! Khu vườn đang đợi con đó!");
  add("Thung lũng nhỏ đang đợi con! Chọn một khu đã mở để khám phá nhé!");
  add("Chào con đến Thung lũng nhỏ! Chạm vào Vườn nhà để bắt đầu chơi nhé!");
  add("Khu này sắp có rồi, con chờ nhé!");
  add("Con chơi thêm ở khu trước để mở khu này nhé!");
  for (const f of [
    "src/App.tsx",
    "src/components/ValleyMap.tsx",
    "src/components/Garden.tsx",
    "src/components/Activities.tsx",
    "src/game/events.ts",
  ]) {
    for (const line of scanStaticMessages(f)) add(line);
  }
  for (const h of hints) add(h);

  // Priority 2: Garden scene, seed prompts & interactions.
  for (const c of crops) {
    add(`Con kéo hạt ${c.name.toLowerCase()} xuống luống đất nhé!`);
  }
  for (const entry of Object.values(interactions)) {
    for (const line of entry.lines) add(line);
  }
  for (const h of scenes.garden.hotspots) {
    if (h.line) add(h.line);
    if (h.stageLines) for (const sl of h.stageLines) add(sl);
  }

  // Priority 3: Companions and kitchen dishes.
  for (const pal of pals) {
    for (const t of pal.thanks) add(palSpeak(pal, t));
    for (const st of pal.stories) add(palSpeak(pal, st));
    for (const w of pal.wants) {
      add(
        palSpeak(
          pal,
          `${pal.name} vui lắm! ${pal.name} vẫn chờ ${itemName(w).toLowerCase()} nhé!`,
        ),
      );
    }
  }
  for (const d of dishes) add(`Xong rồi! ${d.name}.`);

  // Priority 4: Later regions, region stories, seasonal greetings & unlock announcements.
  for (const season of ["tet", "mid_autumn"]) {
    add(seasonalInfo(season).line);
  }
  for (const r of regions) {
    if (r.after) add(`${r.name} đã mở ra rồi! Sương đang tan đó!`);
  }
  for (const [id, scene] of Object.entries(scenes)) {
    if (scene.story) add(scene.story);
    if (id === "garden") continue;
    for (const h of scene.hotspots) {
      if (h.line) add(h.line);
      if (h.stageLines) for (const sl of h.stageLines) add(sl);
    }
  }

  // Priority 5: Discovery notebook replay phrases.
  for (const d of discoveries) add(`Con đã khám phá ${d.name.toLowerCase()}!`);

  return [...byKey.values()];
}
