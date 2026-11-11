import { discoveryRules } from "../data/interactions";
export type Plant = { kind: string; water: boolean; sun: boolean };
export type Stamp = { value: unknown; clock: number; device: string };
export type World = {
  schema: 1;
  discoveries: string[];
  fields: Record<string, Stamp>;
};
export type Action =
  | { type: "plant"; slot: number; kind: string }
  | { type: "water" | "sun"; slot: number }
  | { type: "discover"; id: string }
  | { type: "set"; key: string; value: unknown };
export const emptyWorld = (): World => ({
  schema: 1,
  discoveries: [],
  fields: {},
});
export function mergeWorld(a: World, b: World): World {
  const fields = { ...a.fields };
  for (const [k, v] of Object.entries(b.fields)) {
    const old = fields[k];
    if (
      !old ||
      v.clock > old.clock ||
      (v.clock === old.clock && v.device > old.device)
    )
      fields[k] = v;
  }
  return {
    schema: 1,
    fields: Object.fromEntries(
      Object.entries(fields).sort(([a], [b]) => a.localeCompare(b)),
    ),
    discoveries: [...new Set([...a.discoveries, ...b.discoveries])].sort(),
  };
}
export function apply(w: World, a: Action, device: string, now = 0): World {
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
