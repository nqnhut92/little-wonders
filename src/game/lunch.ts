export type Meal = {
  kind: "orange" | "colors";
  count: number;
  attempts: number;
};
export const initialMeal = (): Meal => ({
  kind: "orange",
  count: 0,
  attempts: 0,
});
export function offer(
  meal: Meal,
  food: string,
): { meal: Meal; accepted: boolean; discovery?: string; spoken: string } {
  if (meal.kind === "orange" && food !== "carrot")
    return {
      meal: { ...meal, attempts: meal.attempts + 1 },
      accepted: false,
      spoken: "Thỏ muốn cà rốt màu cam. Con thử lại nhé!",
    };
  const count = meal.count + 1;
  if (count === 3)
    return {
      meal: {
        kind: meal.kind === "orange" ? "colors" : "orange",
        count: 0,
        attempts: 0,
      },
      accepted: true,
      discovery: meal.kind === "orange" ? "lunch" : "colors",
      spoken: "Đủ ba rồi! Thỏ no bụng và rất vui!",
    };
  return {
    meal: { ...meal, count, attempts: 0 },
    accepted: true,
    spoken: `${["", "Một", "Hai"][count]}! Cảm ơn con!`,
  };
}
