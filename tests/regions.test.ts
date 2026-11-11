import { describe, it, expect } from "vitest";
import {
  regions,
  regionOpenId,
  luckyDiscoveries,
  type Region,
} from "../src/data/regions";
import { regionState, regionsToOpen } from "../src/game/regions";
import { apply, emptyWorld, type Action, type World } from "../src/game/engine";

const ids = (n: number, prefix = "d") =>
  Array.from({ length: n }, (_, i) => `${prefix}${i}`);
const demo: Region[] = [
  { id: "a", name: "A", ready: true, counted: ids(10) },
  { id: "b", name: "B", ready: true, after: "a", counted: ids(10, "b") },
  { id: "c", name: "C", ready: false, after: "b", counted: [] },
];
describe("regions", () => {
  it("opens the next region at 70% and not before", () => {
    expect(regionsToOpen(ids(6), demo)).toEqual([]);
    expect(regionsToOpen(ids(7), demo)).toEqual([regionOpenId("b")]);
  });
  it("never locks a region again when new discoveries lower the ratio", () => {
    const found = [...ids(7), regionOpenId("b")];
    expect(regionsToOpen(found, demo)).toEqual([]);
    const grown = demo.map((r) =>
      r.id === "a" ? { ...r, counted: ids(30) } : r,
    );
    expect(regionState(found, grown[1])).toBe("open");
  });
  it("keeps regions without content as coming soon, and the first region open", () => {
    const found = [...ids(10), ...ids(10, "b"), regionOpenId("b")];
    expect(regionsToOpen(found, demo)).toEqual([]);
    expect(regionState(found, demo[2])).toBe("soon");
    expect(regionState([], demo[0])).toBe("open");
    expect(regionState([], demo[1])).toBe("locked");
  });
  it("leaves chance-based discoveries out of the count and follows a changed ratio", () => {
    const garden = regions[0];
    for (const id of luckyDiscoveries) expect(garden.counted).not.toContain(id);
    expect(regionsToOpen(ids(5), demo, 0.5)).toEqual([regionOpenId("b")]);
  });
  it("lists every planned region in order, with garden and pond ready", () => {
    expect(regions.map((r) => r.id)).toEqual([
      "garden",
      "pond",
      "forest",
      "beach",
      "snow",
      "stars",
    ]);
    expect(regions.filter((r) => r.ready).map((r) => r.id)).toEqual([
      "garden",
      "pond",
    ]);
  });
  it("supports planting and harvesting lotus in the pond region without touching garden beds", () => {
    let w = apply(
      emptyWorld(),
      { type: "plant", slot: 0, kind: "lotus", region: "pond" },
      "d",
    );
    for (let i = 0; i < 3; i++) {
      w = apply(w, { type: "water", slot: 0, region: "pond" }, "d");
      w = apply(w, { type: "sun", slot: 0, region: "pond" }, "d");
    }
    w = apply(w, { type: "harvest", slot: 0, region: "pond" }, "d");
    expect(w.discoveries).toContain("harvest_lotus");
    expect(w.fields["plot.pond.0"]).toBeDefined();
    expect(w.fields["plot.garden.0"]).toBeUndefined();
  });
});

const ripe = (kind: string): Action[] => [
  { type: "plant", slot: 0, kind },
  ...[0, 1, 2].flatMap((): Action[] => [
    { type: "water", slot: 0 },
    { type: "sun", slot: 0 },
  ]),
  { type: "harvest", slot: 0 },
];
const play = (w: World, steps: Action[], random: () => number) =>
  steps.reduce((acc, s) => apply(acc, s, "d", 0, random), w);
describe("rare variants", () => {
  it("appear only when the dice say so and never change the harvest", () => {
    const lucky = play(emptyWorld(), ripe("carrot"), () => 0);
    expect(lucky.discoveries).toContain("rare_carrot_twin");
    expect(lucky.fields.basket.value).toEqual({ carrot: 1 });
    const plain = play(emptyWorld(), ripe("carrot"), () => 0.99);
    expect(plain.discoveries).not.toContain("rare_carrot_twin");
    expect(
      play(emptyWorld(), ripe("tomato"), () => 0).discoveries.some((d) =>
        d.startsWith("rare_"),
      ),
    ).toBe(false);
  });
  it("hit about one harvest in eight", () => {
    let seed = 7;
    const random = () =>
      (seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32;
    let hits = 0;
    for (let i = 0; i < 800; i++)
      if (
        play(emptyWorld(), ripe("berry"), random).discoveries.includes(
          "rare_berry_heart",
        )
      )
        hits++;
    expect(hits / 800).toBeGreaterThan(0.09);
    expect(hits / 800).toBeLessThan(0.16);
  });
});
