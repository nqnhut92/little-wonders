import {
  regions as all,
  regionOpenId,
  unlockRatio,
  type Region,
} from "../data/regions";
export type RegionState = "open" | "locked" | "soon";
const explored = (found: string[], region: Region) =>
  region.counted.length === 0
    ? 0
    : region.counted.filter((id) => found.includes(id)).length /
      region.counted.length;
/** Discovery progress within a region (found count, total counted items, and 0..1 ratio). */
export function regionProgress(found: string[], region: Region) {
  const total = region.counted.length;
  const count =
    total === 0 ? 0 : region.counted.filter((id) => found.includes(id)).length;
  return { found: count, total, ratio: total === 0 ? 0 : count / total };
}
// Once recorded, a region stays open even if new discoveries later push the ratio below the threshold.
export function regionState(found: string[], region: Region): RegionState {
  if (!region.after || found.includes(regionOpenId(region.id))) return "open";
  return region.ready ? "locked" : "soon";
}
// Discovery ids to record now: ready regions whose previous region is open and explored enough.
export function regionsToOpen(
  found: string[],
  regions: Region[] = all,
  ratio = unlockRatio,
): string[] {
  const byId = new Map(regions.map((r) => [r.id, r]));
  return regions
    .filter((r) => {
      const previous = r.after ? byId.get(r.after) : undefined;
      return (
        r.ready &&
        previous &&
        !found.includes(regionOpenId(r.id)) &&
        regionState(found, previous) === "open" &&
        explored(found, previous) >= ratio
      );
    })
    .map((r) => regionOpenId(r.id));
}
