import { describe, it, expect, vi } from "vitest";
import { emptyWorld, apply, mergeWorld, assistance } from "../src/game/engine";
import {
  load,
  persist,
  synchronize,
  type Local,
} from "../src/services/progress";
describe("garden rules", () => {
  it("requires seed, rain and sun, then records flower, butterfly and rainbow", () => {
    let w = apply(
      emptyWorld(),
      { type: "plant", slot: 0, kind: "sunflower" },
      "a",
      1,
    );
    w = apply(w, { type: "water", slot: 0 }, "a", 2);
    expect(w.discoveries).not.toContain("sunflower");
    w = apply(w, { type: "sun", slot: 0 }, "a", 3);
    expect(w.discoveries).toEqual(
      expect.arrayContaining([
        "rain",
        "sun",
        "sunflower",
        "butterfly",
        "rainbow",
      ]),
    );
    const again = apply(w, { type: "sun", slot: 0 }, "a", 4);
    expect(again.discoveries.filter((x) => x === "sunflower")).toHaveLength(1);
  });
  it("merges discoveries and resolves concurrent fields deterministically without stale overwrite", () => {
    const a = apply(
      apply(emptyWorld(), { type: "discover", id: "fish" }, "a", 1),
      { type: "set", key: "houseColor", value: "pink" },
      "a",
      100,
    );
    const b = apply(
      apply(emptyWorld(), { type: "discover", id: "bird" }, "b", 1),
      { type: "set", key: "houseColor", value: "blue" },
      "b",
      100,
    );
    expect(mergeWorld(a, b)).toEqual(mergeWorld(b, a));
    expect(mergeWorld(a, b).fields.houseColor.value).toBe("blue");
    expect(mergeWorld(a, emptyWorld()).fields.houseColor.value).toBe("pink");
    expect(mergeWorld(a, a)).toEqual(mergeWorld(emptyWorld(), a));
  });
  it("preserves creations and demonstrates hints only after exploration", () => {
    const w = apply(
      emptyWorld(),
      {
        type: "set",
        key: "decorations",
        value: [{ id: "flower", x: 20, y: 30 }],
      },
      "a",
    );
    expect(mergeWorld(w, emptyWorld()).fields.decorations.value).toHaveLength(
      1,
    );
    expect([0, 3, 5].map(assistance)).toEqual([
      "explore",
      "highlight",
      "demonstrate",
    ]);
  });
});
describe("durable offline progress", () => {
  const memory = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => memory.get(k) || null,
    setItem: (k: string, v: string) => memory.set(k, v),
  });
  it("restores unsent creations after reload, retains queue on failed retry, merges on success", async () => {
    const l: Local = {
      world: apply(
        emptyWorld(),
        {
          type: "set",
          key: "decorations",
          value: [{ id: "star", x: 40, y: 50 }],
        },
        "a",
      ),
      pending: true,
      nickname: "Mây",
      profile: "id",
      device: "a",
    };
    persist(l);
    expect(load()).toEqual(l);
    const fail = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
    await expect(synchronize(l, fail)).rejects.toThrow("RETRY");
    expect(load().pending).toBe(true);
    const remote = apply(emptyWorld(), { type: "discover", id: "bird" }, "b");
    const ok = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ world: remote })));
    const next = await synchronize(load(), ok);
    expect(next.pending).toBe(false);
    expect(next.world.discoveries).toContain("bird");
    expect(next.world.fields.decorations.value).toHaveLength(1);
  });
  it("leaves pending progress untouched when session expires", async () => {
    await expect(
      synchronize(
        load(),
        vi.fn().mockResolvedValue(new Response("", { status: 401 })),
      ),
    ).rejects.toThrow("AUTH");
    expect(load().pending).toBe(true);
  });
});

import { palSpeak, palStatus } from "../src/game/lunch";
import { pals } from "../src/data/pals";
import { worldSchema } from "../api/index";
import { gardenVisitors } from "../src/game/visitors";
import { nextSurpriseDelayMs, pickSurpriseEvent } from "../src/game/events";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
it("accepts any pal gift for story chapters while advancing wishes only on the wished item", () => {
  let w = emptyWorld();
  // Lucky (puppy) is the main character from the start and accepts basic table snacks even on an empty basket.
  expect(palStatus(w, "puppy").wish).toBe("watermelon");
  w = apply(w, { type: "gift", pal: "puppy", kind: "carrot" }, "a");
  expect(palStatus(w, "puppy").gifts).toBe(1);
  expect(palStatus(w, "puppy").wishes).toBe(0);
  expect(palStatus(w, "puppy").wish).toBe("watermelon");
  expect(w.discoveries).toContain("story_puppy_1");
  // Fulfilling the wish unlocks the next wish and lunch discovery.
  w = apply(w, { type: "gift", pal: "puppy", kind: "watermelon" }, "a");
  expect(palStatus(w, "puppy").wishes).toBe(1);
  expect(palStatus(w, "puppy").wish).toBe("apple");
  expect(w.discoveries).toContain("lunch");
  expect(worldSchema.safeParse(w).success).toBe(true);
});
it("unlocks the little reindeer on first harvest and uses spokenName for TTS", () => {
  let w = emptyWorld();
  w = apply(w, { type: "plant", slot: 0, kind: "watermelon" }, "a");
  for (let i = 0; i < 3; i++) {
    w = apply(w, { type: "water", slot: 0 }, "a");
    w = apply(w, { type: "sun", slot: 0 }, "a");
  }
  w = apply(w, { type: "harvest", slot: 0 }, "a");
  expect(w.discoveries).toContain("pal_reindeer");
  w = apply(w, { type: "gift", pal: "reindeer", kind: "watermelon" }, "a");
  expect(palStatus(w, "reindeer").gifts).toBe(1);
  expect(palStatus(w, "reindeer").wishes).toBe(1);
  expect(w.discoveries).toContain("story_reindeer_1");
  const puppy = pals.find((p) => p.id === "puppy")!;
  expect(palSpeak(puppy, "Lucky thích dưa hấu")).toBe("Lắc-ki thích dưa hấu");
  expect(worldSchema.safeParse(w).success).toBe(true);
});

import { contextualHint } from "../src/game/hints";
import { cachedProfile } from "../src/services/progress";
it("offers stage-specific hints and leaves a completed world unchanged on repeated taps", () => {
  let w = apply(
    emptyWorld(),
    { type: "plant", slot: 0, kind: "carrot" },
    "a",
    1,
  );
  expect(contextualHint(w)).toContain("khát nước");
  w = apply(w, { type: "water", slot: 0 }, "a", 2);
  expect(contextualHint(w)).toContain("mặt trời");
  expect(apply(w, { type: "water", slot: 0 }, "a", 3)).toBe(w);
});
it("keeps separate backups and does not discard a newer unsent creation", () => {
  const l: Local = {
    world: apply(
      emptyWorld(),
      { type: "set", key: "houseColor", value: "pink" },
      "a",
      100,
    ),
    pending: true,
    nickname: "Mây",
    device: "a",
    profile: "child-a",
  };
  persist(l);
  persist({ ...l, profile: "child-b", world: emptyWorld() });
  expect(cachedProfile("child-a")?.world.fields.houseColor.value).toBe("pink");
  persist({ ...l, world: emptyWorld(), pending: false });
  expect(cachedProfile("child-a")?.world.fields.houseColor.value).toBe("pink");
  expect(cachedProfile("child-a")?.pending).toBe(true);
});

it("default logical edits do not depend on the wall clock", () => {
  const real = Date.now;
  Date.now = () => 999999999999;
  try {
    const w = apply(
      emptyWorld(),
      { type: "set", key: "houseColor", value: "pink" },
      "writer-a",
    );
    expect(w.fields.houseColor.clock).toBe(0);
    expect(
      apply(w, { type: "set", key: "houseColor", value: "blue" }, "writer-b")
        .fields.houseColor.clock,
    ).toBe(1);
  } finally {
    Date.now = real;
  }
});
it("supports synced day/night, discovery combos, visitors and surprise events", () => {
  let w = apply(
    emptyWorld(),
    { type: "set", key: "scene.time", value: "night" },
    "a",
  );
  w = apply(w, { type: "discover", id: "night" }, "a");
  w = apply(w, { type: "discover", id: "rain" }, "a");
  expect(w.discoveries).toContain("firefly");
  w = apply(w, { type: "plant", slot: 0, kind: "pumpkin" }, "a");
  expect(gardenVisitors(w).map((v) => v.art)).toContain("owl");
  expect(worldSchema.safeParse(w).success).toBe(true);
  const ev = pickSurpriseEvent(w, () => 0);
  expect(ev?.kind).toBe("shooting_star");
  expect(nextSurpriseDelayMs(() => 0)).toBe(45_000);
  expect(nextSurpriseDelayMs(() => 0.999)).toBeLessThan(90_000);
});
it("contains no forbidden pressure mechanics in src/", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  for (const file of walk("src")) {
    const text = readFileSync(file, "utf8");
    expect(text, file).not.toMatch(/\b(game over|streak|countdown)\b/i);
  }
});
