import { describe, it, expect } from "vitest";
import { apply, basketOf, emptyWorld, type World } from "../src/game/engine";
import { dishFor, recipes, mysteryDish } from "../src/data/recipes";
import { worldSchema } from "../api/index";
const stocked = (basket: Record<string, number>): World => ({
  ...emptyWorld(),
  fields: { basket: { value: basket, clock: 1, device: "d" } },
});
const cook = (w: World, items: string[]) =>
  apply(w, { type: "cook", items }, "d");
describe("kitchen", () => {
  it("makes the special dish for a recipe in any order, using up the ingredients", () => {
    const w = cook(stocked({ tomato: 1, carrot: 2 }), ["tomato", "carrot"]);
    expect(basketOf(w)).toEqual({ tomato: 0, carrot: 1, dish_soup: 1 });
    expect(w.discoveries).toContain("dish_soup");
    expect(dishFor(["carrot", "tomato"]).dish).toBe("dish_soup");
    expect(worldSchema.safeParse(w).success).toBe(true);
  });
  it("turns every other mix into a surprise that can always be eaten", () => {
    const w = cook(stocked({ corn: 1, pumpkin: 1, tomato: 1 }), [
      "corn",
      "pumpkin",
      "tomato",
    ]);
    expect(basketOf(w).dish_mystery).toBe(1);
    expect(dishFor(["corn"])).toBe(mysteryDish);
    expect(new Set(recipes.map((r) => r.needs.join())).size).toBe(
      recipes.length,
    );
  });
  it("never fails: invalid requests change nothing", () => {
    const w = stocked({ carrot: 1, dish_soup: 1 });
    expect(cook(w, [])).toBe(w);
    expect(cook(w, ["carrot", "carrot"])).toBe(w);
    expect(cook(w, ["carrot", "carrot", "carrot", "carrot"])).toBe(w);
    expect(cook(w, ["dish_soup"])).toBe(w);
    const full = stocked({ watermelon: 1, dish_juice: 9 });
    expect(cook(full, ["watermelon"])).toBe(full);
    expect(recipes.length).toBeGreaterThanOrEqual(12);
    for (const r of recipes) {
      const made = cook(
        stocked(
          r.needs.reduce<Record<string, number>>(
            (acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }),
            {},
          ),
        ),
        r.needs,
      );
      expect(basketOf(made)[r.dish]).toBe(1);
      expect(worldSchema.safeParse(made).success).toBe(true);
    }
  });
});
