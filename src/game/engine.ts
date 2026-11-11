import { discoveryRules } from "../data/interactions";
import { currentSchema, isCounterKey } from "../data/ids";
export type Plant = { kind: string; water: boolean; sun: boolean };
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
export function apply(w: World, a: Action, device: string, now = 0): World {
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
  if (a.type === "plant")
    set(`plant${a.slot}`, { kind: a.kind, water: false, sun: false });
  if (a.type === "water" || a.type === "sun") {
    unlock(a.type === "water" ? "rain" : "sun");
    const p = w.fields[`plant${a.slot}`]?.value as Plant | undefined;
    if (p) {
      const plant = { ...p, [a.type]: true };
      set(`plant${a.slot}`, plant);
      if (plant.sun && plant.water) {
        unlock(plant.kind);
        unlock("butterfly");
      }
    }
    for (const rule of discoveryRules)
      if (rule.requires.every((id) => n.discoveries.includes(id)))
        unlock(rule.id);
  }
  return changed ? n : w;
}
export const value = <T>(w: World, k: string, fallback: T): T =>
  (w.fields[k]?.value as T) ?? fallback;
export const assistance = (attempts: number) =>
  attempts >= 5 ? "demonstrate" : attempts >= 3 ? "highlight" : "explore";
