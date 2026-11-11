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
