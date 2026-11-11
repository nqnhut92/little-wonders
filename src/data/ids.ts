// Single source of truth for identifiers, key patterns and limits.
// The client, the API schema and the tests all import these values; never copy them.
export const currentSchema = 2;
export const schemas = [1, 2] as const;
// Lowercase letters, digits and underscores. Prefix by group (harvest_, rare_, region_) so regions never collide.
export const discoveryIdPattern = /^[a-z0-9_]{1,32}$/;
export const maxDiscoveries = 200;
export const maxFields = 200;
export const maxBodyBytes = 64000;
export const maxDecorations = 30;
// Every crop the schema accepts; src/data/crops.ts decides which ones the game offers.
export const cropKinds = [
  "sunflower",
  "carrot",
  "berry",
  "tomato",
  "pumpkin",
  "corn",
  "watermelon",
  "lotus",
  "waterlily",
  "blueberry",
  "chestnut",
] as const;
export const sceneTimes = ["day", "night"] as const;
export const plantKinds = cropKinds;
// Things a basket can hold: every crop plus apples shaken from the tree.
export const dishKinds = [
  "dish_soup",
  "dish_jam",
  "dish_salad",
  "dish_pie",
  "dish_juice",
  "dish_corncake",
  "dish_applesauce",
  "dish_pumpkinsoup",
  "dish_cornsoup",
  "dish_fruitbowl",
  "dish_tea",
  "dish_smoothie",
  "dish_coconut",
  "dish_chestnut",
  "dish_mystery",
] as const;
// Things picked up in a scene rather than grown: shaken from a tree or found on the ground.
export const gatherKinds = ["apple", "coconut", "shell", "pinecone"] as const;
export const basketKinds = [
  ...cropKinds,
  ...gatherKinds,
  ...dishKinds,
] as const;
export const maxBasket = 9;
export const maxPlots = 6;
export const plotKeyPattern = /^plot\.[a-z0-9_]{1,16}\.[0-9]{1,2}$/;
export const decorationIds = [
  "flower",
  "butterfly",
  "star",
  "decor-sunflower",
  "decor-pumpkin-lamp",
] as const;
export const houseColors = [
  "#efcf9d",
  "#d7a6b5",
  "#a5bca0",
  "#a2becb",
  "#e7bc7b",
] as const;
export const mealKinds = ["orange", "colors", "berries", "apples"] as const;
// Fields named n.<name> are monotonic counters: the larger value always wins a merge.
export const counterPrefix = "n.";
export const counterKeyPattern = /^n\.[a-z0-9_]{1,40}$/;
export const maxCounter = 1_000_000_000;
export const isCounterKey = (key: string) => key.startsWith(counterPrefix);
