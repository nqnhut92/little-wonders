import { discoveries } from "./content";
// A region is data. Adding one means adding a row (and its content) here, never changing the rules.
export type Region = {
  id: string;
  name: string;
  // Content exists. Regions that are not ready show as "coming soon" and never open.
  ready: boolean;
  // The region whose exploration opens this one; the first region is always open.
  after?: string;
  // Discoveries of this region. Chance-based ones are left out so no child is stuck for lack of luck.
  counted: string[];
};
export const unlockRatio = 0.7;
// Chance-based discoveries never count toward opening the next region.
export const luckyDiscoveries = [
  "rare_carrot_twin",
  "rare_pumpkin_giant",
  "rare_berry_heart",
  "shooting_star",
];
export const regions: Region[] = [
  {
    id: "garden",
    name: "Vườn nhà",
    ready: true,
    counted: discoveries
      .map((d) => d.id)
      .filter((id) => !luckyDiscoveries.includes(id)),
  },
  { id: "pond", name: "Ao sen", ready: false, after: "garden", counted: [] },
  { id: "forest", name: "Rừng nhỏ", ready: false, after: "pond", counted: [] },
  { id: "beach", name: "Bãi biển", ready: false, after: "forest", counted: [] },
  { id: "snow", name: "Đồi tuyết", ready: false, after: "beach", counted: [] },
  { id: "stars", name: "Núi sao", ready: false, after: "snow", counted: [] },
];
export const regionOpenId = (id: string) => `region_${id}_open`;
