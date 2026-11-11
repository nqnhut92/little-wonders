import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { apply, emptyWorld, mergeWorld, type World } from "../src/game/engine";
import { upgradeWorld } from "../src/game/upgrade";
import { worldSchema } from "../api/index";
import { discoveries } from "../src/data/content";
import { discoveryIdPattern, maxFields } from "../src/data/ids";

const v1 = JSON.parse(readFileSync("tests/fixtures/world-v1.json", "utf8"));

// Deterministic generator so failures reproduce.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}
function randomWorld(random: () => number): World {
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];
  const fields: World["fields"] = {};
  for (const key of [
    "houseColor",
    "decorations",
    "plot.garden.0",
    "n.gift_puppy",
    "n.gift_rabbit",
    "n.visit",
  ])
    if (random() < 0.7)
      fields[key] = {
        value: key.startsWith("n.")
          ? Math.floor(random() * 4)
          : pick(["#efcf9d", "#d7a6b5", 3]),
        clock: Math.floor(random() * 4),
        device: pick(["a", "b", "C", "_z"]),
      };
  return {
    schema: pick([1, 2]) as 1 | 2,
    ...(random() < 0.8 ? { epoch: Math.floor(random() * 3) } : {}),
    discoveries: [
      "fish",
      "bird",
      "harvest_carrot",
      "region_pond_open",
      "night",
    ].filter(() => random() < 0.5),
    fields,
  };
}
const worlds = Array.from({ length: 60 }, (_, i) => randomWorld(rng(i + 1)));
const same = (a: World, b: World) => expect(a).toEqual(b);

describe("mergeWorld v2", () => {
  it("is commutative, associative and idempotent", () => {
    for (let i = 0; i < worlds.length - 2; i++) {
      const [a, b, c] = worlds.slice(i, i + 3);
      same(mergeWorld(a, b), mergeWorld(b, a));
      same(mergeWorld(mergeWorld(a, b), c), mergeWorld(a, mergeWorld(b, c)));
      const m = mergeWorld(a, b);
      same(mergeWorld(m, m), m);
      same(mergeWorld(m, a), m);
    }
  });
  it("lets the higher epoch win everything and treats a missing epoch as 0", () => {
    const old = apply(emptyWorld(), { type: "discover", id: "fish" }, "a");
    const reset = apply(old, { type: "resetAll" }, "a");
    expect(reset).toMatchObject({ epoch: 1, discoveries: [], fields: {} });
    const merged = mergeWorld(old, reset);
    expect(merged).toEqual(mergeWorld(reset, old));
    expect(merged.discoveries).toEqual([]);
    const legacy = { schema: 1 as const, discoveries: ["bird"], fields: {} };
    expect(mergeWorld(legacy, old).epoch).toBe(0);
    expect(mergeWorld(legacy, old).discoveries).toEqual(["bird", "fish"]);
  });
  it("never lowers a counter, whatever the clocks say", () => {
    const stamp = (value: number, clock: number, device: string) => ({
      value,
      clock,
      device,
    });
    const high = {
      ...emptyWorld(),
      fields: { "n.gift_puppy": stamp(5, 1, "a") },
    };
    const lateLow = {
      ...emptyWorld(),
      fields: { "n.gift_puppy": stamp(2, 90, "b") },
    };
    expect(mergeWorld(high, lateLow).fields["n.gift_puppy"].value).toBe(5);
    expect(mergeWorld(lateLow, high).fields["n.gift_puppy"].value).toBe(5);
    // Other fields still follow the clock.
    const a = { ...emptyWorld(), fields: { houseColor: stamp(1, 1, "a") } };
    const b = { ...emptyWorld(), fields: { houseColor: stamp(2, 90, "b") } };
    expect(mergeWorld(a, b).fields.houseColor.value).toBe(2);
  });
  it("keeps the schema number of the newer payload and never loses discoveries within an epoch", () => {
    expect(
      mergeWorld({ ...emptyWorld(), schema: 1 }, emptyWorld()).schema,
    ).toBe(2);
    let w = emptyWorld();
    for (const id of ["a_1", "b_2", "c_3"]) {
      const next = apply(w, { type: "discover", id }, "d");
      expect(next.discoveries.length).toBeGreaterThanOrEqual(
        w.discoveries.length,
      );
      w = next;
    }
  });
  it("does not mutate its inputs or actions' inputs", () => {
    const a = structuredClone(worlds[3]);
    const b = structuredClone(worlds[4]);
    mergeWorld(a, b);
    same(a, worlds[3]);
    const w = structuredClone(v1);
    apply(w, { type: "water", slot: 1 }, "x");
    expect(w).toEqual(v1);
  });
});

describe("upgradeWorld", () => {
  it("upgrades a real v1 world, turning early beds into plots and keeping everything else", () => {
    const up = upgradeWorld(v1)!;
    expect(up).toMatchObject({ schema: 2, epoch: 0 });
    const { plant0, plant1, ...rest } = v1.fields;
    expect(up.fields).toEqual({
      ...rest,
      "plot.garden.0": {
        ...plant0,
        value: { kind: "sunflower", stage: 4, water: false, sun: false },
      },
      "plot.garden.1": {
        ...plant1,
        value: { kind: "carrot", stage: 1, water: true, sun: false },
      },
    });
    expect(up.discoveries).toEqual([...v1.discoveries].sort());
    expect(worldSchema.safeParse(up).success).toBe(true);
  });
  it("is idempotent and does not touch its input", () => {
    const copy = structuredClone(v1);
    const once = upgradeWorld(v1)!;
    expect(upgradeWorld(once)).toEqual(once);
    expect(v1).toEqual(copy);
  });
  it("never lets a stale early bed overwrite a plot that already exists", () => {
    const up = upgradeWorld(v1)!;
    const again = upgradeWorld({
      ...up,
      fields: {
        ...up.fields,
        plant0: {
          value: { kind: "berry", water: false, sun: false },
          clock: 99,
          device: "old",
        },
      },
    })!;
    expect(again.fields["plot.garden.0"]).toEqual(up.fields["plot.garden.0"]);
    expect(again.fields.plant0).toBeUndefined();
  });
  it("keeps an existing epoch and rejects data it cannot read", () => {
    expect(upgradeWorld({ ...v1, schema: 2, epoch: 4 })!.epoch).toBe(4);
    for (const bad of [
      null,
      undefined,
      3,
      {},
      { schema: 9, discoveries: [], fields: {} },
      { schema: 1, discoveries: "x", fields: {} },
    ])
      expect(upgradeWorld(bad)).toBeUndefined();
  });
  it("lets a v1 payload from an old client merge into a v2 world", () => {
    const merged = mergeWorld(upgradeWorld(v1)!, {
      schema: 1,
      discoveries: ["fish"],
      fields: {},
    });
    expect(merged.schema).toBe(2);
    expect(merged.discoveries).toContain("fish");
    expect(merged.fields["plot.garden.0"].value).toMatchObject({ stage: 4 });
  });
});

describe("schema contract", () => {
  it("accepts every field the actions can write", () => {
    let w = emptyWorld();
    const steps: Parameters<typeof apply>[1][] = [
      { type: "plant", slot: 0, kind: "sunflower" },
      { type: "water", slot: 0 },
      { type: "sun", slot: 0 },
      { type: "set", key: "houseColor", value: "#efcf9d" },
      { type: "set", key: "decorations", value: [{ id: "star", x: 1, y: 2 }] },
      {
        type: "set",
        key: "meal",
        value: { kind: "colors", count: 1, attempts: 0 },
      },
      { type: "set", key: "lastMeal", value: { kind: "colors", count: 3 } },
    ];
    for (const step of steps) w = apply(w, step, "dev", 0);
    expect(worldSchema.safeParse(w).success).toBe(true);
    expect(
      worldSchema.safeParse(apply(w, { type: "resetAll" }, "dev")).success,
    ).toBe(true);
  });
  it("keeps every notebook id inside the shared naming rule and limits", () => {
    for (const d of discoveries) {
      expect(d.id, d.id).toMatch(discoveryIdPattern);
      expect(d.name.length).toBeGreaterThan(0);
    }
    expect(maxFields).toBeGreaterThanOrEqual(200);
  });
});

// The riskiest part: the same merge written twice. Both must agree on every fixture.
describe("TypeScript and SQL merge agree", () => {
  it("returns identical worlds for shared fixtures and random pairs", async () => {
    const db = new PGlite();
    try {
      for (const file of ["001_initial", "002_world_v2"])
        await db.exec(readFileSync(`migrations/${file}.sql`, "utf8"));
      const sqlMerge = async (a: World, b: World) =>
        (
          await db.query<{ w: World }>(
            "SELECT merge_world($1::jsonb,$2::jsonb) AS w",
            [JSON.stringify(a), JSON.stringify(b)],
          )
        ).rows[0].w;
      const pairs: [World, World][] = [
        [v1, emptyWorld()],
        [emptyWorld(), v1],
        [v1, { ...v1, schema: 1, discoveries: ["fish"] }],
        [
          { ...emptyWorld(), epoch: 2, discoveries: ["z_last", "Z_up", "a"] },
          v1,
        ],
      ];
      for (let i = 0; i < worlds.length - 1; i++)
        pairs.push([worlds[i], worlds[i + 1]]);
      for (const [a, b] of pairs)
        expect(await sqlMerge(a, b)).toEqual(mergeWorld(a, b));
    } finally {
      await db.close();
    }
  });
});
