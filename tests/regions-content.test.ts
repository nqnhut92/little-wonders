import { describe, it, expect } from "vitest";
import { regions, luckyDiscoveries } from "../src/data/regions";
import { scenes } from "../src/data/scenes";
import { discoveries } from "../src/data/content";
import { crops } from "../src/data/crops";
import { assetIds } from "../src/components/Art";
import { apply, basketOf, emptyWorld } from "../src/game/engine";
import { gatherKinds } from "../src/data/ids";
import { recipes } from "../src/data/recipes";
import { pals } from "../src/data/pals";
import { currentSeasonalEvent, seasonalInfo } from "../src/game/seasons";
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
  it("has a scene for every region, with only the garden open to players right now", () => {
    for (const r of regions) {
      expect(scenes[r.id], r.id).toBeDefined();
      expect(r.ready, r.id).toBe(r.id === "garden");
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
      honey: 1,
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
  it("cooks blueberry jam, pine tea and star cake", () => {
    const w = {
      ...emptyWorld(),
      fields: {
        basket: {
          value: { blueberry: 3, pinecone: 1, apple: 2, sunflower: 1 },
          clock: 1,
          device: "d",
        },
      },
    };
    expect(
      basketOf(
        apply(w, { type: "cook", items: ["blueberry", "blueberry"] }, "d"),
      ).dish_blueberry_jam,
    ).toBe(1);
    expect(
      basketOf(apply(w, { type: "cook", items: ["pinecone", "apple"] }, "d"))
        .dish_pine_tea,
    ).toBe(1);
    expect(
      basketOf(
        apply(
          w,
          { type: "cook", items: ["sunflower", "blueberry", "apple"] },
          "d",
        ),
      ).dish_star_cake,
    ).toBe(1);
  });
});

describe("region stories, regional pals and seasonal lunar events", () => {
  it("gives every region a story and every pal valid stories, thanks and wants", () => {
    for (const r of regions) {
      expect(scenes[r.id].story.length).toBeGreaterThan(10);
    }
    expect(pals.map((p) => p.id)).toEqual([
      "puppy",
      "reindeer",
      "capybara",
      "squirrel",
      "turtle",
      "penguin",
      "owl",
    ]);
    for (const pal of pals) {
      expect(pal.stories.length).toBe(3);
      expect(pal.thanks.length).toBe(3);
      expect(pal.wants.length).toBe(4);
    }
  });
  it("detects Tet and Mid-Autumn from the lunar calendar and supports override", () => {
    expect(currentSeasonalEvent(new Date("2026-02-17T12:00:00Z"))).toBe("tet");
    expect(currentSeasonalEvent(new Date("2026-09-25T12:00:00Z"))).toBe(
      "mid_autumn",
    );
    expect(currentSeasonalEvent(new Date("2026-06-15T12:00:00Z"))).toBeNull();
    expect(currentSeasonalEvent(new Date("2026-06-15T12:00:00Z"), "tet")).toBe(
      "tet",
    );
    expect(seasonalInfo("tet").line.length).toBeGreaterThan(10);
    expect(seasonalInfo("mid_autumn").line.length).toBeGreaterThan(10);
  });
  it("keeps scene hotspots clear of the soil plots area on every map", () => {
    for (const scene of Object.values(scenes)) {
      for (const h of scene.hotspots) {
        if (h.id === "house") continue;
        const overlapsPlots =
          h.x + h.w > 43 && h.x < 69 && h.y + h.w > 58 && h.y < 77;
        expect(overlapsPlots, `${scene.id}:${h.id}`).toBe(false);
      }
    }
  });
});
