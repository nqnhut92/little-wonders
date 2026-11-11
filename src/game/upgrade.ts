import { currentSchema, schemas } from "../data/ids";
import { gardenRegion } from "../data/crops";
import { plotKey, type World } from "./engine";
// Pure and idempotent: runs on data read from localStorage, backups and the API.
// v1 -> v2 only adds the schema number and epoch; every v1 field keeps its name and meaning.
export function upgradeWorld(input: unknown): World | undefined {
  const w = input as Partial<World> | null | undefined;
  if (
    !w ||
    typeof w !== "object" ||
    !(schemas as readonly unknown[]).includes(w.schema) ||
    !Array.isArray(w.discoveries) ||
    !w.fields ||
    typeof w.fields !== "object"
  )
    return undefined;
  const fields: World["fields"] = { ...w.fields };
  // Early beds (plant0..2) become plot.garden.N. A fully cared plant (water and sun) was a grown
  // flower in v1, so it is ripe now; a missing care keeps its seed with its flags. An existing plot wins.
  for (const [key, stamp] of Object.entries(w.fields)) {
    const slot = /^plant([0-9])$/.exec(key)?.[1];
    if (slot === undefined) continue;
    delete fields[key];
    const old = stamp.value as { kind: string; water: boolean; sun: boolean };
    const target = plotKey(Number(slot), gardenRegion);
    if (fields[target] || !old) continue;
    fields[target] = {
      ...stamp,
      value: {
        kind: old.kind,
        stage: old.water && old.sun ? 4 : 1,
        water: old.water && !old.sun,
        sun: old.sun && !old.water,
      },
    };
  }
  return {
    schema: currentSchema,
    epoch: typeof w.epoch === "number" && w.epoch > 0 ? w.epoch : 0,
    discoveries: [...w.discoveries].sort(),
    fields,
  };
}
