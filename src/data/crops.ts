import { maxPlots } from "./ids";
import { dishes } from "./recipes";
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
  { id: "tomato", name: "Cà chua", art: "tomato", care: 1 },
  { id: "pumpkin", name: "Bí ngô", art: "pumpkin", care: 1 },
  { id: "corn", name: "Bắp", art: "corn", care: 1 },
  { id: "watermelon", name: "Dưa hấu", art: "watermelon", care: 1 },
];
// Spoken and screen-reader name of anything a basket can hold.
export const itemName = (kind: string) =>
  kind === "apple"
    ? "Táo"
    : (crops.find((c) => c.id === kind)?.name ??
      dishes.find((d) => d.dish === kind)?.name ??
      kind);
export const cropArt = (kind: string) =>
  kind.startsWith("dish_")
    ? kind.replace("_", "-")
    : (crops.find((c) => c.id === kind)?.art ?? kind);
// seed(1) -> sprout(2) -> grown(3) -> ripe(4); stage 0 is an empty bed.
export const ripeStage = 4;
export const startingPlots = 3;
export const gardenRegion = "garden";
export { maxPlots };
