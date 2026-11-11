import { describe, it, expect } from "vitest";
import { regions, luckyDiscoveries } from "../src/data/regions";
import { scenes } from "../src/data/scenes";
import { discoveries } from "../src/data/content";
import { crops } from "../src/data/crops";
import { assetIds } from "../src/components/Art";
import { apply, basketOf, emptyWorld } from "../src/game/engine";
import { gatherKinds } from "../src/data/ids";
import { recipes } from "../src/data/recipes";
import { worldSchema } from "../api/index";

const notebook = new Set(discoveries.map((d) => d.id));
// Discoveries a child can actually trigger in a region: hotspots, build endings, gathering and its crops.
function reachable(regionId: string) {
  const scene = scenes[regionId];
  const ids = new Set<string>();
  for (const h of scene.hotspots) {
    if (h.discovery) ids.add(h.discovery);
    if (h.gives) ids.add(h.gives);
  }
  for (const c of crops.filter((c) => (c.region ?? "garden") === regionId)) {
    ids.add(c.id);
    ids.add(`harvest_${c.id}`);
  }
  return ids;
}
describe("every region is complete data", () => {
  it("has a scene, and every region except the last is ready to open the next", () => {
    for (const r of regions) {
      expect(scenes[r.id], r.id).toBeDefined();
      expect(r.ready, r.id).toBe(true);
    }
  });
  it("uses only artwork that exists", () => {
    for (const r of regions)
      for (const h of scenes[r.id].hotspots) {
        expect(assetIds, `${r.id}/${h.id}`).toContain(h.art);
        for (const stage of h.stages ?? [])
          expect(assetIds, stage).toContain(stage);
      }
    for (const d of discoveries) expect(assetIds, d.id).toContain(d.art);
  });
  it("counts only notebook entries a child can reach in that region, enough to open the next one", () => {
    for (const r of regions.filter((r) => r.id !== "garden")) {
      const can = reachable(r.id);
      for (const id of r.counted) {
        expect(notebook.has(id), `${id} in notebook`).toBe(true);
        expect(can.has(id), `${id} reachable in ${r.id}`).toBe(true);
      }
      expect(r.counted.length, r.id).toBeGreaterThanOrEqual(4);
    }
  });
  it("never counts a discovery in two regions or a chance-based one", () => {
    const seen = new Map<string, string>();
    for (const r of regions)
      for (const id of r.counted) {
        expect(seen.get(id), `${id} counted twice`).toBeUndefined();
        expect(luckyDiscoveries).not.toContain(id);
        seen.set(id, r.id);
      }
  });
  it("gives Vietnamese labels and lines for every hotspot", () => {
    for (const r of regions)
      for (const h of scenes[r.id].hotspots) {
        expect(h.label.length, h.id).toBeGreaterThan(1);
        expect(
          (h.line ?? h.stageLines?.join("") ?? "x").length,
        ).toBeGreaterThan(0);
      }
  });
});
describe("gathering and new dishes", () => {
  it("puts coconuts, shells and pinecones into the basket and records them", () => {
    let w = emptyWorld();
    for (const kind of gatherKinds) w = apply(w, { type: "shake", kind }, "d");
    expect(basketOf(w)).toEqual({
      apple: 1,
      coconut: 1,
      shell: 1,
      pinecone: 1,
    });
    expect(w.discoveries).toEqual(
      expect.arrayContaining(["coconut", "shell", "pinecone"]),
    );
    expect(worldSchema.safeParse(w).success).toBe(true);
    const same = apply(w, { type: "shake", kind: "carrot" }, "d");
    expect(same).toBe(w);
  });
  it("cooks coconut water and roasted chestnuts", () => {
    const w = {
      ...emptyWorld(),
      fields: {
        basket: { value: { coconut: 1, chestnut: 2 }, clock: 1, device: "d" },
      },
    };
    const a = apply(w, { type: "cook", items: ["coconut"] }, "d");
    expect(basketOf(a).dish_coconut).toBe(1);
    const b = apply(w, { type: "cook", items: ["chestnut", "chestnut"] }, "d");
    expect(basketOf(b).dish_chestnut).toBe(1);
    expect(new Set(recipes.map((r) => [...r.needs].sort().join())).size).toBe(
      recipes.length,
    );
  });
});
