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
];
// Any other mix is a surprise that is always fine to eat.
export const mysteryDish = { dish: "dish_mystery", name: "Món bất ngờ" };
export const dishes = [...recipes, mysteryDish];
export const maxPot = 3;
export const dishArt = (dish: string) => dish.replace("_", "-");
export const sameItems = (a: string[], b: string[]) =>
  a.length === b.length &&
  [...a].sort().every((x, i) => x === [...b].sort()[i]);
export const dishFor = (items: string[]) =>
  recipes.find((r) => sameItems(r.needs, items)) ?? mysteryDish;
