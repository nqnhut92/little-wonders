import { describe, it, expect } from "vitest";
import {
  apply,
  basketOf,
  emptyWorld,
  plotCount,
  plotKey,
  type Action,
  type Plot,
  type World,
} from "../src/game/engine";
import { contextualHint } from "../src/game/hints";
import { worldSchema } from "../api/index";
import { crops } from "../src/data/crops";
import { cropKinds } from "../src/data/ids";
import { assetIds } from "../src/components/Art";
import { discoveries } from "../src/data/content";
const run = (w: World, ...steps: Action[]) =>
  steps.reduce((acc, step) => apply(acc, step, "dev", 0), w);
const plot = (w: World, slot = 0) =>
  w.fields[plotKey(slot)]?.value as Plot | undefined;
const care = (slot = 0): Action[] => [
  { type: "water", slot },
  { type: "sun", slot },
];
const ripe = (slot = 0, kind = "carrot") =>
  run(
    emptyWorld(),
    { type: "plant", slot, kind },
    ...care(slot),
    ...care(slot),
    ...care(slot),
  );

describe("plant stages", () => {
  it("moves one stage per full water and sun round and clears the flags", () => {
    let w = run(emptyWorld(), { type: "plant", slot: 0, kind: "berry" });
    expect(plot(w)).toEqual({
      kind: "berry",
      stage: 1,
      water: false,
      sun: false,
    });
    w = run(w, { type: "water", slot: 0 });
    expect(plot(w)).toMatchObject({ stage: 1, water: true, sun: false });
    w = run(w, { type: "sun", slot: 0 });
    expect(plot(w)).toEqual({
      kind: "berry",
      stage: 2,
      water: false,
      sun: false,
    });
    expect(plot(ripe())!.stage).toBe(4);
  });
  it("does nothing for invalid actions", () => {
    const w = ripe();
    expect(apply(w, { type: "water", slot: 0 }, "d")).toBe(w);
    expect(apply(w, { type: "plant", slot: 0, kind: "berry" }, "d")).toBe(w);
    expect(apply(w, { type: "harvest", slot: 1 }, "d")).toBe(w);
    const young = run(emptyWorld(), { type: "plant", slot: 0, kind: "carrot" });
    expect(apply(young, { type: "harvest", slot: 0 }, "d")).toBe(young);
    expect(
      apply(emptyWorld(), { type: "plant", slot: 3, kind: "carrot" }, "d")
        .fields,
    ).toEqual({});
  });
  it("records discoveries as the plant grows", () => {
    const w = run(
      emptyWorld(),
      { type: "plant", slot: 0, kind: "sunflower" },
      ...care(),
    );
    expect(w.discoveries).toEqual(
      expect.arrayContaining([
        "rain",
        "sun",
        "sunflower",
        "butterfly",
        "rainbow",
      ]),
    );
  });
});

describe("harvest and basket", () => {
  it("moves a ripe plant into the basket, empties the bed and records the harvest", () => {
    const w = run(ripe(), { type: "harvest", slot: 0 });
    expect(basketOf(w)).toEqual({ carrot: 1 });
    expect(plot(w)).toMatchObject({ stage: 0 });
    expect(w.discoveries).toContain("harvest_carrot");
    // The bed can be replanted straight away.
    expect(
      plot(run(w, { type: "plant", slot: 0, kind: "berry" })),
    ).toMatchObject({ kind: "berry", stage: 1 });
  });
  it("never holds more than nine of one crop and keeps a full plant ripe", () => {
    let w = ripe();
    w = {
      ...w,
      fields: {
        ...w.fields,
        basket: { value: { carrot: 9 }, clock: 99, device: "d" },
      },
    };
    expect(apply(w, { type: "harvest", slot: 0 }, "d")).toBe(w);
    expect(plot(w)).toMatchObject({ stage: 4 });
  });
  it("opens more beds with each different crop harvested, up to six", () => {
    expect(plotCount(emptyWorld())).toBe(3);
    let w = emptyWorld();
    for (const [i, kind] of [
      "sunflower",
      "carrot",
      "berry",
      "tomato",
    ].entries()) {
      w = run(w, ...ripeActions(kind), { type: "harvest", slot: 0 });
      expect(plotCount(w)).toBe(Math.min(6, 3 + i + 1));
    }
    expect(plotCount(w)).toBe(6);
    // Harvesting the same crop again opens nothing new.
    expect(
      plotCount(run(w, ...ripeActions("carrot"), { type: "harvest", slot: 0 })),
    ).toBe(6);
  });
  it("produces fields the API accepts", () => {
    const w = run(ripe(), { type: "harvest", slot: 0 });
    expect(worldSchema.safeParse(w).success).toBe(true);
  });
});
function ripeActions(kind: string): Action[] {
  return [{ type: "plant", slot: 0, kind }, ...care(), ...care(), ...care()];
}

describe("hints", () => {
  it("point at a ripe plant first", () => {
    expect(contextualHint(ripe())).toContain("hái");
    expect(contextualHint(emptyWorld())).toContain("chọn một hạt");
  });
});

describe("apples, feeding and a fresh garden", () => {
  it("shaking the tree puts an apple in the basket, capped at nine", () => {
    let w = run(emptyWorld(), { type: "shake" });
    expect(basketOf(w)).toEqual({ apple: 1 });
    expect(w.discoveries).toContain("apple");
    for (let i = 0; i < 12; i++) w = run(w, { type: "shake" });
    expect(basketOf(w).apple).toBe(9);
    expect(worldSchema.safeParse(w).success).toBe(true);
  });
  it("uses one item from the basket when feeding and never blocks on an empty basket", () => {
    const w = run(emptyWorld(), { type: "shake" }, { type: "shake" });
    const fed = run(w, { type: "feed", kind: "apple" });
    expect(basketOf(fed).apple).toBe(1);
    const empty = emptyWorld();
    expect(apply(empty, { type: "feed", kind: "carrot" }, "d")).toBe(empty);
  });
  it("fresh garden clears beds, basket and decorations but keeps discoveries and the house", () => {
    let w = run(
      ripe(),
      { type: "set", key: "decorations", value: [{ id: "star", x: 1, y: 1 }] },
      { type: "set", key: "houseColor", value: "#d7a6b5" },
      { type: "shake" },
    );
    w = run(w, { type: "resetGarden" });
    expect(plot(w)).toMatchObject({ stage: 0 });
    expect(basketOf(w)).toEqual({});
    expect(w.fields.decorations.value).toEqual([]);
    expect(w.fields.houseColor.value).toBe("#d7a6b5");
    expect(w.discoveries).toEqual(
      expect.arrayContaining(["carrot", "apple", "rain", "sun"]),
    );
    expect(w.epoch).toBe(0);
    expect(apply(w, { type: "resetGarden" }, "d")).toBe(w);
    expect(worldSchema.safeParse(w).success).toBe(true);
  });
  it("offers seven crops, each with artwork and a notebook entry", () => {
    expect(crops.map((c) => c.id)).toEqual(cropKinds.slice());
    for (const c of crops) {
      expect(assetIds).toContain(c.art);
      expect(discoveries.map((d) => d.id)).toContain(`harvest_${c.id}`);
    }
  });
});
