// Recipes are data: a sorted list of ingredient kinds and the dish it makes.
export type Recipe = { dish: string; name: string; needs: string[] };
export const recipes: Recipe[] = [
  {
    dish: "dish_soup",
    name: "Súp cà chua cà rốt",
    needs: ["carrot", "tomato"],
  },
  { dish: "dish_jam", name: "Mứt dâu", needs: ["berry", "berry"] },
  {
    dish: "dish_salad",
    name: "Salad nhiều màu",
    needs: ["berry", "carrot", "tomato"],
  },
  { dish: "dish_pie", name: "Bánh táo bí ngô", needs: ["apple", "pumpkin"] },
  { dish: "dish_juice", name: "Nước ép dưa hấu", needs: ["watermelon"] },
  { dish: "dish_corncake", name: "Bánh bắp ngọt", needs: ["corn", "corn"] },
  {
    dish: "dish_applesauce",
    name: "Táo nghiền mật ngọt",
    needs: ["apple", "apple"],
  },
  {
    dish: "dish_pumpkinsoup",
    name: "Súp bí ngô cà rốt",
    needs: ["carrot", "pumpkin"],
  },
  {
    dish: "dish_cornsoup",
    name: "Súp bắp bí ngô",
    needs: ["corn", "pumpkin"],
  },
  {
    dish: "dish_fruitbowl",
    name: "Tô trái cây mát",
    needs: ["apple", "berry", "watermelon"],
  },
  {
    dish: "dish_tea",
    name: "Trà hoa hướng dương",
    needs: ["sunflower", "sunflower"],
  },
  {
    dish: "dish_smoothie",
    name: "Sinh tố dưa hấu dâu",
    needs: ["berry", "watermelon"],
  },
  { dish: "dish_coconut", name: "Nước dừa mát lạnh", needs: ["coconut"] },
  {
    dish: "dish_chestnut",
    name: "Hạt dẻ nướng thơm",
    needs: ["chestnut", "chestnut"],
  },
  {
    dish: "dish_blueberry_jam",
    name: "Mứt việt quất",
    needs: ["blueberry", "blueberry"],
  },
  {
    dish: "dish_pine_tea",
    name: "Trà thông ấm áp",
    needs: ["apple", "pinecone"],
  },
  {
    dish: "dish_star_cake",
    name: "Bánh ánh sao",
    needs: ["apple", "blueberry", "sunflower"],
  },
];
// Any other mix is a surprise that is always fine to eat.
export const mysteryDish = { dish: "dish_mystery", name: "Món bất ngờ" };
export const dishes = [...recipes, mysteryDish];
export const maxPot = 3;
export const dishArt = (dish: string) => dish.replaceAll("_", "-");
export const sameItems = (a: string[], b: string[]) =>
  a.length === b.length &&
  [...a].sort().every((x, i) => x === [...b].sort()[i]);
export const dishFor = (items: string[]) =>
  recipes.find((r) => sameItems(r.needs, items)) ?? mysteryDish;
