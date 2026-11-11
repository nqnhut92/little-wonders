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

import { initialMeal, offer } from "../src/game/lunch";
it("does not count wrong colors, counts three and varies the next meal", () => {
  let meal = initialMeal();
  for (let i = 0; i < 3; i++) meal = offer(meal, "berry").meal;
  expect(meal.count).toBe(0);
  expect(meal.attempts).toBe(3);
  meal = offer(meal, "carrot").meal;
  meal = offer(meal, "carrot").meal;
  const done = offer(meal, "carrot");
  expect(done.discovery).toBe("lunch");
  expect(done.meal.kind).toBe("colors");
  expect(offer(done.meal, "berry").meal.count).toBe(1);
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

it("cycles through count and food variations without accepting wrong foods", () => {
  let m = initialMeal();
  for (let i = 0; i < 3; i++) m = offer(m, "carrot").meal;
  for (let i = 0; i < 3; i++) m = offer(m, "apple").meal;
  expect(m.kind).toBe("berries");
  expect(offer(m, "carrot").accepted).toBe(false);
  m = offer(offer(m, "berry").meal, "berry").meal;
  expect(m.kind).toBe("apples");
  expect(offer(m, "apple").meal.kind).toBe("orange");
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
