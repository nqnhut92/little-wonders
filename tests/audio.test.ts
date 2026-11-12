import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { voiceFiles } from "../src/data/voiceManifest";
import { loopBounds } from "../src/services/audio";
import { voiceKey } from "../src/services/voice";

describe("background music loop bounds", () => {
  it("skips the silent padding a compressed file decodes with", () => {
    const samples = new Float32Array(40);
    samples.fill(0.5, 5, 30);
    expect(loopBounds(samples, 10)).toEqual([0.5, 3]);
  });
  it("loops the whole buffer when almost nothing is audible", () => {
    const samples = new Float32Array(40);
    samples.fill(0.5, 5, 9);
    expect(loopBounds(samples, 10)).toEqual([0, 4]);
  });
});

describe("voice key normalization and manifest", () => {
  it("maps displayed names and pronunciation hints to the same canonical key", () => {
    expect(voiceKey("Cún Lắc-ki rất thích ăn dưa hấu mát lạnh đó!")).toBe(
      "Cún Lucky rất thích ăn dưa hấu mát lạnh đó!",
    );
    expect(
      voiceKey(
        "Bạn bạn Ca-pi-ba-ra đội quả quýt cam tròn xoe trên đầu, ngồi thư giãn bên bờ ao sen mát rượi.",
      ),
    ).toBe(
      "Bạn Capybara đội quả quýt cam tròn xoe trên đầu, ngồi thư giãn bên bờ ao sen mát rượi.",
    );
  });

  it("points every manifest entry to an existing clip under public/", () => {
    for (const [key, url] of Object.entries(voiceFiles)) {
      expect(url.startsWith("/assets/voice/")).toBe(true);
      expect(existsSync(resolve("public", url.slice(1))), key).toBe(true);
    }
  });
});
