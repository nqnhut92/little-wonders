import { discoveryRules } from "../data/interactions";
import { regionsToOpen } from "./regions";
import {
  currentSchema,
  isCounterKey,
  maxBasket,
  maxPlots,
  plotKeyPattern,
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
  | { type: "plant"; slot: number; kind: string }
  | { type: "water" | "sun"; slot: number }
  | { type: "harvest"; slot: number }
  | { type: "shake" }
  | { type: "feed"; kind: string }
  | { type: "resetGarden" }
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
  const plot = (slot: number) =>
    w.fields[plotKey(slot)]?.value as Plot | undefined;
  if (a.type === "plant" && a.slot >= 0 && a.slot < plotCount(w)) {
    const p = plot(a.slot);
    // Planting over a growing plant does nothing; a bed must be harvested first.
    if (!p || p.stage === 0)
      set(plotKey(a.slot), {
        kind: a.kind,
        stage: 1,
        water: false,
        sun: false,
      });
  }
  if (a.type === "shake") {
    const held = basketOf(w).apple ?? 0;
    unlock("apple");
    if (held < maxBasket) set("basket", { ...basketOf(w), apple: held + 1 });
  }
  // Giving something from the basket away; the table always has basic foods, so an empty basket changes nothing.
  if (a.type === "feed") {
    const held = basketOf(w)[a.kind] ?? 0;
    if (held > 0) set("basket", { ...basketOf(w), [a.kind]: held - 1 });
  }
  // "Vườn mới": clears beds, basket and decorations. Discoveries, regions and friends stay.
  if (a.type === "resetGarden") {
    for (const [key, stamp] of Object.entries(w.fields)) {
      const p = stamp.value as Plot;
      if (plotKeyPattern.test(key) && p.stage > 0)
        set(key, { kind: p.kind, stage: 0, water: false, sun: false });
    }
    if (Object.values(basketOf(w)).some((n) => n > 0)) set("basket", {});
    if (value<unknown[]>(w, "decorations", []).length) set("decorations", []);
  }
  if (a.type === "harvest") {
    const p = plot(a.slot);
    const held = basketOf(w)[p?.kind ?? ""] ?? 0;
    if (p && p.stage === ripeStage && held < maxBasket) {
      set("basket", { ...basketOf(w), [p.kind]: held + 1 });
      set(plotKey(a.slot), {
        kind: p.kind,
        stage: 0,
        water: false,
        sun: false,
      });
      unlock(`harvest_${p.kind}`);
      if (rareOf[p.kind] && random() < rareChance) unlock(rareOf[p.kind]);
    }
  }
  if (a.type === "water" || a.type === "sun") {
    unlock(a.type === "water" ? "rain" : "sun");
    const p = plot(a.slot);
    if (p && p.stage >= 1 && p.stage < ripeStage) {
      const flagged = { ...p, [a.type]: true };
      const need = crops.find((c) => c.id === p.kind)?.care ?? 1;
      if (!(flagged.water && flagged.sun)) set(plotKey(a.slot), flagged);
      else if ((p.rounds ?? 0) + 1 >= need) {
        set(plotKey(a.slot), {
          kind: p.kind,
          stage: p.stage + 1,
          water: false,
          sun: false,
        });
        unlock(p.kind);
        unlock("butterfly");
      } else
        set(plotKey(a.slot), {
          kind: p.kind,
          stage: p.stage,
          water: false,
          sun: false,
          rounds: (p.rounds ?? 0) + 1,
        });
    }
    for (const rule of discoveryRules)
      if (rule.requires.every((id) => n.discoveries.includes(id)))
        unlock(rule.id);
  }
  if (changed) for (const id of regionsToOpen(n.discoveries)) unlock(id);
  return changed ? n : w;
}
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
