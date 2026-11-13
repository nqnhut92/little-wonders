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
// Every region uses the same rule: 11-14 core daytime discoveries count toward the 85% unlock threshold;
// night scenes, kitchen dishes, pal story chapters, secondary crops and lucky variants are bonus uncounted discoveries.
const gardenIds = [
  "rain",
  "sun",
  "house",
  "decor",
  "apple",
  "fish",
  "bird",
  "butterfly",
  "worm",
  "ladybug",
  "grass",
  "windmill",
  "puppy",
  "sunflower",
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
  "tadpole",
  "paper_boat",
  "kingfisher",
  "frog",
  "xylophone",
];
const forestIds = [
  "blueberry",
  "chestnut",
  "harvest_blueberry",
  "harvest_chestnut",
  "hedgehog",
  "squirrel",
  "woodpecker",
  "mushroom_house",
  "treehouse",
  "fox_forest",
  "honey",
];
const beachIds = [
  "coconut",
  "shell",
  "crab",
  "sandcastle",
  "waves",
  "turtle",
  "seagull",
  "pineapple",
  "banana",
  "harvest_pineapple",
  "harvest_banana",
  "starfish",
  "dolphin",
];
const snowIds = [
  "pinecone",
  "snowman",
  "polar_bear",
  "penguin",
  "sled",
  "snowflake",
  "mint",
  "cranberry",
  "harvest_mint",
  "harvest_cranberry",
  "igloo",
  "arctic_fox",
  "hot_spring",
];
const starIds = [
  "telescope",
  "moon_face",
  "constellation",
  "star_lantern",
  "starfruit",
  "moonflower",
  "harvest_starfruit",
  "harvest_moonflower",
  "moon_rabbit",
  "meteor_rock",
  "comet",
];
export const regions: Region[] = [
  {
    id: "garden",
    name: "Vườn nhà",
    art: "flower",
    ready: true,
    counted: gardenIds,
  },
  {
    id: "pond",
    name: "Ao sen",
    art: "pond",
    ready: false,
    after: "garden",
    counted: pondIds,
  },
  {
    id: "forest",
    name: "Rừng nhỏ",
    art: "mushroom-house",
    ready: false,
    after: "pond",
    counted: forestIds,
  },
  {
    id: "beach",
    name: "Bãi biển",
    art: "coconut-tree",
    ready: false,
    after: "forest",
    counted: beachIds,
  },
  {
    id: "snow",
    name: "Đồi tuyết",
    art: "snowman-3",
    ready: false,
    after: "beach",
    counted: snowIds,
  },
  {
    id: "stars",
    name: "Núi sao",
    art: "moon-face",
    ready: false,
    after: "snow",
    counted: starIds,
  },
];
export const regionOpenId = (id: string) => `region_${id}_open`;
