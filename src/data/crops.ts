import { maxPlots } from "./ids";
// Crops are data: adding one means adding a row here and its artwork, not changing rules.
export type Crop = {
  id: string;
  name: string;
  // Art id shown for the ripe crop and for the seed button.
  art: string;
  // Full water + sun rounds needed to move up one stage (tuning knob).
  care: number;
};
export const crops: Crop[] = [
  { id: "sunflower", name: "Hướng dương", art: "flower", care: 1 },
  { id: "carrot", name: "Cà rốt", art: "carrot", care: 1 },
  { id: "berry", name: "Dâu", art: "berry", care: 1 },
];
// seed(1) -> sprout(2) -> grown(3) -> ripe(4); stage 0 is an empty bed.
export const ripeStage = 4;
export const startingPlots = 3;
export const gardenRegion = "garden";
export { maxPlots };
