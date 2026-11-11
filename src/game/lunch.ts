export const mealKinds = ["orange", "colors", "berries", "apples"] as const;
export type Meal = {
  kind: (typeof mealKinds)[number];
  count: number;
  attempts: number;
};
export const initialMeal = (): Meal => ({
  kind: "orange",
  count: 0,
  attempts: 0,
});
export const mealGoal = (meal: Meal) =>
  ({
    orange: {
      food: "carrot",
      total: 3,
      text: "Giúp thỏ tìm ba củ cà rốt màu cam nhé!",
    },
    colors: {
      food: null,
      total: 3,
      text: "Bữa ăn sắc màu! Con chọn ba món bất kỳ nhé!",
    },
    berries: {
      food: "berry",
      total: 2,
      text: "Thỏ muốn hai quả dâu đỏ. Con chọn giúp nhé!",
    },
    apples: { food: "apple", total: 1, text: "Một quả táo tròn cho thỏ nhé!" },
  })[meal.kind];
export function offer(
  meal: Meal,
  food: string,
): { meal: Meal; accepted: boolean; discovery?: string; spoken: string } {
  const goal = mealGoal(meal);
  if (goal.food && food !== goal.food)
    return {
      meal: { ...meal, attempts: meal.attempts + 1 },
      accepted: false,
      spoken:
        meal.kind === "orange"
          ? "Thỏ muốn cà rốt màu cam. Con thử lại nhé!"
          : goal.text,
    };
  const count = meal.count + 1;
  if (count === goal.total)
    return {
      meal: {
        kind: mealKinds[(mealKinds.indexOf(meal.kind) + 1) % mealKinds.length],
        count: 0,
        attempts: 0,
      },
      accepted: true,
      discovery: meal.kind === "orange" ? "lunch" : "colors",
      spoken: "Đủ rồi! Thỏ no bụng và rất vui!",
    };
  return {
    meal: { ...meal, count, attempts: 0 },
    accepted: true,
    spoken: `${["", "Một", "Hai"][count]}! Cảm ơn con!`,
  };
}
