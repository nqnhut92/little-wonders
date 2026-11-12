import { discoveryRules } from "../data/interactions";
import { regionsToOpen } from "./regions";
import { dishFor, maxPot } from "../data/recipes";
import {
  pals,
  giftCounter,
  fulfilledCounter,
  storyDiscovery,
} from "../data/pals";
import {
  currentSchema,
  isCounterKey,
  maxBasket,
  maxPlots,
  plotKeyPattern,
  gatherKinds,
} from "../data/ids";
import { crops, gardenRegion, ripeStage, startingPlots } from "../data/crops";
// stage 0 empty, 1 seed, 2 sprout, 3 grown, 4 ripe. water and sun clear when a full round moves the plant up a stage.
export type Plot = {
  kind: string;
  stage: number;
  water: boolean;
  sun: boolean;
  rounds?: number;
};
export type Basket = Record<string, number>;
export const plotKey = (slot: number, region = gardenRegion) =>
  `plot.${region}.${slot}`;
export type Stamp = { value: unknown; clock: number; device: string };
export type World = {
  schema: 1 | 2;
  // Raised by "start over". A higher epoch replaces everything from a lower one. Missing means 0.
  epoch?: number;
  discoveries: string[];
  fields: Record<string, Stamp>;
};
export type Action =
  | { type: "plant"; slot: number; kind: string; region?: string }
  | { type: "water" | "sun"; slot: number; region?: string }
  | { type: "harvest"; slot: number; region?: string }
  // Gathers one item from a scene: apples by default, or a coconut, shell or pinecone.
  | { type: "shake"; kind?: string }
  | { type: "gift"; pal: string; kind: string }
  | { type: "cook"; items: string[] }
  | { type: "feed"; kind: string }
  | { type: "resetRegion"; region: string }
  | { type: "discover"; id: string }
  | { type: "set"; key: string; value: unknown }
  | { type: "resetAll" };
export const emptyWorld = (): World => ({
  schema: currentSchema,
  epoch: 0,
  discoveries: [],
  fields: {},
});
const epochOf = (w: World) => w.epoch ?? 0;
const newer = (v: Stamp, old: Stamp) =>
  v.clock > old.clock || (v.clock === old.clock && v.device > old.device);
// Must stay identical to merge_world in migrations/002_world_v2.sql; tests/parity.test.ts runs both on shared fixtures.
export function mergeWorld(a: World, b: World): World {
  const schema = Math.max(a.schema, b.schema) as 1 | 2;
  const [ea, eb] = [epochOf(a), epochOf(b)];
  if (ea !== eb) {
    const win = ea > eb ? a : b;
    return {
      schema,
      epoch: epochOf(win),
      discoveries: [...win.discoveries].sort(),
      fields: sortFields(win.fields),
    };
  }
  const fields = { ...a.fields };
  for (const [k, v] of Object.entries(b.fields)) {
    const old = fields[k];
    if (!old) fields[k] = v;
    else if (isCounterKey(k)) {
      const [x, y] = [Number(v.value), Number(old.value)];
      if (x > y || (x === y && newer(v, old))) fields[k] = v;
    } else if (newer(v, old)) fields[k] = v;
  }
  return {
    schema,
    epoch: ea,
    fields: sortFields(fields),
    discoveries: [...new Set([...a.discoveries, ...b.discoveries])].sort(),
  };
}
const sortFields = (fields: Record<string, Stamp>) =>
  Object.fromEntries(
    Object.entries(fields).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
// Chance of a rare variant when harvesting (about one in eight).
export const rareChance = 1 / 8;
const rareOf: Record<string, string> = {
  carrot: "rare_carrot_twin",
  pumpkin: "rare_pumpkin_giant",
  berry: "rare_berry_heart",
};
export function apply(
  w: World,
  a: Action,
  device: string,
  now = 0,
  random: () => number = Math.random,
): World {
  if (a.type === "resetAll")
    return {
      ...emptyWorld(),
      epoch: epochOf(w) + 1,
    };
  let changed = false;
  const n = { ...w, discoveries: [...w.discoveries], fields: { ...w.fields } };
  const unlock = (id: string) => {
    if (!n.discoveries.includes(id)) {
      n.discoveries.push(id);
      changed = true;
    }
  };
  const set = (k: string, value: unknown) => {
    if (JSON.stringify(w.fields[k]?.value) === JSON.stringify(value)) return;
    changed = true;
    n.fields[k] = {
      value,
      device,
      clock: Math.max(now, ...Object.values(w.fields).map((v) => v.clock + 1)),
    };
  };
  if (a.type === "discover") unlock(a.id);
  if (a.type === "set") set(a.key, a.value);
  const region =
    "region" in a && typeof a.region === "string" && a.region
      ? a.region
      : gardenRegion;
  const plot = (slot: number) =>
    w.fields[plotKey(slot, region)]?.value as Plot | undefined;
  if (a.type === "gift") {
    const pal = pals.find((x) => x.id === a.pal);
    const arrived = !pal?.arrives || w.discoveries.includes(pal.arrives);
    const held = basketOf(w)[a.kind] ?? 0;
    const canFree = pal?.freeFoods?.includes(a.kind) ?? false;
    if (pal && arrived && (held > 0 || canFree)) {
      const gifts = counter(w, giftCounter(pal.id)) + 1;
      const wishes = counter(w, fulfilledCounter(pal.id));
      if (held > 0) set("basket", { ...basketOf(w), [a.kind]: held - 1 });
      set(giftCounter(pal.id), gifts);
      // Any gift is welcome and counts; only the wished-for one grants the wish.
      if (a.kind === pal.wants[wishes % pal.wants.length]) {
        set(fulfilledCounter(pal.id), wishes + 1);
        if (pal.id === "puppy") {
          unlock("lunch");
          if (wishes >= 1) unlock("colors");
        }
      }
      pal.chapters.forEach((need, i) => {
        if (gifts >= need) unlock(storyDiscovery(pal.id, i + 1));
      });
    }
  }
  const plantCrop =
    a.type === "plant" ? crops.find((c) => c.id === a.kind) : undefined;
  if (
    a.type === "plant" &&
    a.slot >= 0 &&
    a.slot < plotCount(w) &&
    plantCrop &&
    (!plantCrop.requires || w.discoveries.includes(plantCrop.requires))
  ) {
    const p = plot(a.slot);
    // Planting over a growing plant does nothing; a bed must be harvested first.
    if (!p || p.stage === 0)
      set(plotKey(a.slot, region), {
        kind: a.kind,
        stage: 1,
        water: false,
        sun: false,
      });
  }
  if (a.type === "cook") {
    const have = { ...basketOf(w) };
    const ok =
      a.items.length >= 1 &&
      a.items.length <= maxPot &&
      a.items.every((kind) => --have[kind] >= 0 && !kind.startsWith("dish_"));
    const dish = dishFor(a.items).dish;
    if (ok && (have[dish] ?? 0) < maxBasket) {
      have[dish] = (have[dish] ?? 0) + 1;
      set("basket", have);
      unlock(dish);
    }
  }
  if (a.type === "shake") {
    const kind = a.kind ?? "apple";
    if ((gatherKinds as readonly string[]).includes(kind)) {
      const held = basketOf(w)[kind] ?? 0;
      unlock(kind);
      if (held < maxBasket) set("basket", { ...basketOf(w), [kind]: held + 1 });
    }
  }
  // Giving something from the basket away; the table always has basic foods, so an empty basket changes nothing.
  if (a.type === "feed") {
    const held = basketOf(w)[a.kind] ?? 0;
    if (held > 0) set("basket", { ...basketOf(w), [a.kind]: held - 1 });
  }
  // Adult corner, one region: its beds go empty again (the house garden also loses its decorations).
  // Discoveries, opened regions, friends and the basket stay; "resetAll" is the only way to wipe those.
  if (a.type === "resetRegion") {
    for (const [key, stamp] of Object.entries(w.fields)) {
      const p = stamp.value as Plot;
      if (
        plotKeyPattern.test(key) &&
        key.startsWith(`plot.${a.region}.`) &&
        p.stage > 0
      )
        set(key, { kind: p.kind, stage: 0, water: false, sun: false });
    }
    if (
      a.region === gardenRegion &&
      value<unknown[]>(w, "decorations", []).length
    )
      set("decorations", []);
  }
  if (a.type === "harvest") {
    const p = plot(a.slot);
    const held = basketOf(w)[p?.kind ?? ""] ?? 0;
    if (p && p.stage === ripeStage && held < maxBasket) {
      set("basket", { ...basketOf(w), [p.kind]: held + 1 });
      set(plotKey(a.slot, region), {
        kind: p.kind,
        stage: 0,
        water: false,
        sun: false,
      });
      unlock(`harvest_${p.kind}`);
      unlock("pal_reindeer");
      if (rareOf[p.kind] && random() < rareChance) unlock(rareOf[p.kind]);
    }
  }
  if (a.type === "water" || a.type === "sun") {
    unlock(a.type === "water" ? "rain" : "sun");
    const p = plot(a.slot);
    if (p && p.stage >= 1 && p.stage < ripeStage) {
      const flagged = { ...p, [a.type]: true };
      const need = crops.find((c) => c.id === p.kind)?.care ?? 1;
      if (!(flagged.water && flagged.sun))
        set(plotKey(a.slot, region), flagged);
      else if ((p.rounds ?? 0) + 1 >= need) {
        set(plotKey(a.slot, region), {
          kind: p.kind,
          stage: p.stage + 1,
          water: false,
          sun: false,
        });
        unlock(p.kind);
        unlock("butterfly");
      } else
        set(plotKey(a.slot, region), {
          kind: p.kind,
          stage: p.stage,
          water: false,
          sun: false,
          rounds: (p.rounds ?? 0) + 1,
        });
    }
  }
  if (changed) {
    for (const rule of discoveryRules)
      if (rule.requires.every((id) => n.discoveries.includes(id)))
        unlock(rule.id);
    for (const id of regionsToOpen(n.discoveries)) unlock(id);
  }
  return changed ? n : w;
}
// Something in this region the adult corner could still clear.
export const regionHasProgress = (w: World, region: string) =>
  Object.entries(w.fields).some(
    ([key, stamp]) =>
      plotKeyPattern.test(key) &&
      key.startsWith(`plot.${region}.`) &&
      (stamp.value as Plot).stage > 0,
  ) ||
  (region === gardenRegion &&
    value<unknown[]>(w, "decorations", []).length > 0);
export const counter = (w: World, k: string) => Number(w.fields[k]?.value ?? 0);
export const basketOf = (w: World): Basket =>
  (w.fields.basket?.value as Basket | undefined) ?? {};
// Beds open with the number of different crops harvested: derived from discoveries, never stored.
export const plotCount = (w: World) =>
  Math.min(
    maxPlots,
    startingPlots +
      w.discoveries.filter((d) => d.startsWith("harvest_")).length,
  );
export const value = <T>(w: World, k: string, fallback: T): T =>
  (w.fields[k]?.value as T) ?? fallback;
export const assistance = (attempts: number) =>
  attempts >= 5 ? "demonstrate" : attempts >= 3 ? "highlight" : "explore";
