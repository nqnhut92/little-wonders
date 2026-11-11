import { useState } from "react";
import { cn } from "../styles";
import { Art } from "./Art";
import { basketOf, type Action, type World } from "../game/engine";
import { cropArt, itemName } from "../data/crops";
import { dishFor, dishes, maxPot } from "../data/recipes";
type Props = {
  world: World;
  act: (a: Action) => void;
  say: (s: string, k?: string) => void;
};
export function Kitchen({ world, act, say }: Props) {
  const [pot, setPot] = useState<string[]>([]);
  const [made, setMade] = useState("");
  const basket = basketOf(world);
  // What is still free to add, after the items already in the pot.
  const left = (kind: string) =>
    (basket[kind] ?? 0) - pot.filter((k) => k === kind).length;
  const ingredients = Object.keys(basket).filter(
    (k) => !k.startsWith("dish_") && (basket[k] ?? 0) > 0,
  );
  return (
    <div className={cn("activity kitchen")}>
      <h2>Bếp của vườn</h2>
      <p>Chọn một, hai hoặc ba món rồi nấu nhé!</p>
      <div className={cn("pot")} aria-label="Nồi">
        {Array.from({ length: maxPot }, (_, i) => (
          <button
            type="button"
            key={i}
            className={cn("pot-slot")}
            aria-label={pot[i] ? "Bỏ món ra khỏi nồi" : "Chỗ trống trong nồi"}
            disabled={!pot[i]}
            onClick={() => setPot(pot.filter((_, j) => j !== i))}
          >
            {pot[i] && <Art id={cropArt(pot[i])} />}
          </button>
        ))}
      </div>
      <div className={cn("food-tray")}>
        {ingredients.length === 0 && (
          <p>Giỏ đang trống. Con hái cây hoặc lắc cây táo trước nhé!</p>
        )}
        {ingredients.map((kind) => (
          <button
            type="button"
            key={kind}
            aria-label={`Thêm ${itemName(kind)} vào nồi`}
            disabled={left(kind) <= 0 || pot.length >= maxPot}
            onClick={() => {
              setMade("");
              setPot([...pot, kind]);
            }}
          >
            <Art id={cropArt(kind)} />
            <b className={cn("food-count")} aria-hidden="true">
              {left(kind)}
            </b>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={cn("primary cook")}
        disabled={pot.length === 0}
        onClick={() => {
          const dish = dishFor(pot);
          act({ type: "cook", items: pot });
          setMade(dish.dish);
          setPot([]);
          say(`Xong rồi! ${dish.name}.`, "flower");
        }}
      >
        Nấu
      </button>
      {made && (
        <p role="status" className={cn("meal-feedback")}>
          <Art id={cropArt(made)} /> {dishes.find((d) => d.dish === made)?.name}
        </p>
      )}
    </div>
  );
}
