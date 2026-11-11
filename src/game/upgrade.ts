import { currentSchema, schemas } from "../data/ids";
import type { World } from "./engine";
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
  return {
    schema: currentSchema,
    epoch: typeof w.epoch === "number" && w.epoch > 0 ? w.epoch : 0,
    discoveries: [...w.discoveries].sort(),
    fields: { ...w.fields },
  };
}
