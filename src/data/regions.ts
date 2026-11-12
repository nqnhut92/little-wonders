import { discoveries } from "./content";
// A region is data. Adding one means adding a row (and its content) here, never changing the rules.
export type Region = {
  id: string;
  name: string;
  // Art id shown on the valley map.
  art?: string;
  // Content exists. Regions that are not ready show as "coming soon" and never open.
  ready: boolean;
  // The region whose exploration opens this one; the first region is always open.
  after?: string;
  // Discoveries of this region. Chance-based ones are left out so no child is stuck for lack of luck.
  counted: string[];
};
export const unlockRatio = 0.85;
// Chance-based discoveries never count toward opening the next region.
export const luckyDiscoveries = [
  "rare_carrot_twin",
  "rare_pumpkin_giant",
  "rare_berry_heart",
  "shooting_star",
];
const pondIds = [
  "lotus",
  "waterlily",
  "harvest_lotus",
  "harvest_waterlily",
  "duck",
  "dragonfly",
  "pond_lantern",
  "pal_capybara",
];
// Each later region lists its own discoveries; the garden counts everything that belongs to no other region.
const forestIds = [
  "blueberry",
  "chestnut",
  "harvest_blueberry",
  "harvest_chestnut",
  "hedgehog",
  "squirrel",
  "woodpecker",
  "mushroom_house",
];
const beachIds = [
  "coconut",
  "shell",
  "crab",
  "sandcastle",
  "waves",
  "turtle",
  "seagull",
];
const snowIds = [
  "pinecone",
  "snowman",
  "polar_bear",
  "penguin",
  "sled",
  "snowflake",
];
const starIds = ["telescope", "moon_face", "constellation", "star_lantern"];
// Seen only at night or found in other regions' scenes: never part of a count.
const uncounted = [
  "firefly_forest",
  "dish_coconut",
  "dish_chestnut",
  "dish_blueberry_jam",
  "dish_pine_tea",
  "dish_star_cake",
  "story_capybara_1",
  "story_capybara_2",
  "story_capybara_3",
  "story_squirrel_1",
  "story_squirrel_2",
  "story_squirrel_3",
  "story_turtle_1",
  "story_turtle_2",
  "story_turtle_3",
  "story_penguin_1",
  "story_penguin_2",
  "story_penguin_3",
  "story_owl_1",
  "story_owl_2",
  "story_owl_3",
];
const elsewhere = [
  ...pondIds,
  ...forestIds,
  ...beachIds,
  ...snowIds,
  ...starIds,
  ...uncounted,
];
export const regions: Region[] = [
  {
    id: "garden",
    name: "Vườn nhà",
    art: "flower",
    ready: true,
    counted: discoveries
      .map((d) => d.id)
      .filter(
        (id) => !luckyDiscoveries.includes(id) && !elsewhere.includes(id),
      ),
  },
  {
    id: "pond",
    name: "Ao sen",
    art: "pond",
    ready: true,
    after: "garden",
    counted: pondIds,
  },
  {
    id: "forest",
    name: "Rừng nhỏ",
    art: "mushroom-house",
    ready: true,
    after: "pond",
    counted: forestIds,
  },
  {
    id: "beach",
    name: "Bãi biển",
    art: "coconut-tree",
    ready: true,
    after: "forest",
    counted: beachIds,
  },
  {
    id: "snow",
    name: "Đồi tuyết",
    art: "snowman-3",
    ready: true,
    after: "beach",
    counted: snowIds,
  },
  {
    id: "stars",
    name: "Núi sao",
    art: "moon-face",
    ready: true,
    after: "snow",
    counted: starIds,
  },
];
export const regionOpenId = (id: string) => `region_${id}_open`;
