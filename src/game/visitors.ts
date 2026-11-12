import { plotKeyPattern } from "../data/ids";
import { value, type Plot, type World } from "./engine";
export type Visitor = {
  id: string;
  art: string;
  label: string;
  x: number;
  y: number;
};
// Pure visitor selector based on planted crops and day/night state.
export function gardenVisitors(world: World, regionId = "garden"): Visitor[] {
  if (regionId !== "garden") return [];
  const time = value<string>(world, "scene.time", "day");
  const planted = new Set<string>();
  const prefix = `plot.${regionId}.`;
  for (const [key, stamp] of Object.entries(world.fields)) {
    if (!key.startsWith(prefix) || !plotKeyPattern.test(key)) continue;
    const plot = stamp.value as Plot | undefined;
    if (plot && plot.stage > 0) planted.add(plot.kind);
  }
  const list: Visitor[] = [];
  if (time === "night" && planted.has("pumpkin"))
    list.push({
      id: "visitor-owl",
      art: "owl",
      label: "Cú ghé thăm bí ngô",
      x: 61,
      y: 45,
    });
  return list;
}
