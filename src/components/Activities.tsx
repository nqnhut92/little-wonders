import { cn } from "../styles";
import { useState, useRef, type PointerEvent } from "react";
import { Art } from "./Art";
import { initialMeal, offer, mealGoal, type Meal } from "../game/lunch";
import { discoveries } from "../data/content";
import { value, basketOf, type Action, type World } from "../game/engine";
type Props = {
  world: World;
  act: (a: Action) => void;
  say: (s: string, k?: string) => void;
};
export function Lunch({ world, act, say }: Props) {
  const [food, setFood] = useState("carrot");
  const [drag, setDrag] = useState<{
    kind: string;
    x: number;
    y: number;
  } | null>(null);
  const pointer = useRef<number | null>(null);
  const meal = value<Meal>(world, "meal", initialMeal());
  const goal = mealGoal(meal);
  const [feedback, setFeedback] = useState("Con chọn món ăn cho thỏ nhé!");
  const [reaction, setReaction] = useState("idle");
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const basket = basketOf(world);
  const feed = (kind: string) => {
    // A food taken from the basket is used up; the table always has basic foods, so the lunch never blocks.
    act({ type: "feed", kind });
    const result = offer(meal, kind);
    act({ type: "set", key: "meal", value: result.meal });
    setFeedback(result.spoken);
    setReaction(result.accepted ? "happy" : "thinking");
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction("idle"), 1000);
    say(result.spoken, "rabbit");
    if (result.discovery) {
      act({ type: "discover", id: result.discovery });
      act({
        type: "set",
        key: "lastMeal",
        value: { kind: meal.kind, count: goal.total },
      });
    }
  };
  const drop = (e: PointerEvent, kind: string) => {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    setDrag(null);
    const t = document.elementFromPoint(e.clientX, e.clientY);
    if (t?.closest("[data-basket]")) feed(kind);
  };
  return (
    <div className={cn("lunch activity")}>
      <h2>Bữa Trưa Của Thỏ</h2>
      <p>{goal.text}</p>
      <div className={cn("meal-request")} aria-label="Món thỏ đang muốn">
        {Array.from({ length: goal.total }, (_, i) => (
          <Art key={i} id={goal.food || ["carrot", "berry", "apple"][i]} />
        ))}
      </div>
      <p role="status" className={cn("meal-feedback")}>
        {feedback}
      </p>
      <div className={cn("lunch-scene")}>
        <div className={cn(`rabbit-response rabbit-${reaction}`)}>
          <Art id="rabbit" />
          {reaction === "happy" && (
            <span className={cn("rabbit-spark")}>
              <Art id="star" />
            </span>
          )}
          {reaction === "thinking" && (
            <span className={cn("rabbit-wish")}>
              <Art id={goal.food || "carrot"} />
            </span>
          )}
        </div>
        <button
          data-basket
          aria-label="Giỏ thức ăn"
          onClick={() => feed(food)}
          className={cn(meal.attempts >= 3 ? "hint-glow" : "")}
        >
          <Art id="basket" />
          <span>
            {Array.from({ length: goal.total }, (_, i) => i).map((i) => (
              <i key={i} className={cn(i < meal.count ? "filled" : "")} />
            ))}
          </span>
        </button>
      </div>
      <div className={cn("food-tray")}>
        {["carrot", "berry", "apple"].map((f) => (
          <button
            key={f}
            aria-label={{ carrot: "Cà rốt", berry: "Dâu", apple: "Táo" }[f]}
            className={cn(
              `${food === f ? "selected" : ""} ${meal.attempts >= 2 && goal.food === f ? "hint-glow" : ""}`,
            )}
            onPointerDown={(e) => {
              if (pointer.current !== null) return;
              pointer.current = e.pointerId;
              e.currentTarget.setPointerCapture(e.pointerId);
              setFood(f);
              setDrag({ kind: f, x: e.clientX, y: e.clientY });
            }}
            onPointerMove={(e) => {
              if (pointer.current === e.pointerId)
                setDrag({ kind: f, x: e.clientX, y: e.clientY });
            }}
            onPointerCancel={() => {
              pointer.current = null;
              setDrag(null);
            }}
            onPointerUp={(e) => drop(e, f)}
            onClick={() => setFood(f)}
          >
            <Art id={f} />
            {(basket[f] ?? 0) > 0 && (
              <b className={cn("food-count")} aria-hidden="true">
                {basket[f]}
              </b>
            )}
          </button>
        ))}
      </div>
      {drag && (
        <div className={cn("drag-ghost")} style={{ left: drag.x, top: drag.y }}>
          <Art id={drag.kind} />
        </div>
      )}
      <p>Con kéo món ăn vào giỏ, hoặc chọn rồi chạm giỏ.</p>
      {value(world, "lastMeal", null) && (
        <small>Thỏ vẫn nhớ bữa ăn con đã chuẩn bị.</small>
      )}
    </div>
  );
}
export function House({ world, act, say }: Props) {
  const color = value(world, "houseColor", "#efcf9d");
  const decorations = value<{ id: string; x: number; y: number }[]>(
    world,
    "decorations",
    [],
  );
  const [choice, setChoice] = useState("flower");
  const save = (a: Action) => {
    act(a);
    act({ type: "discover", id: "house" });
  };
  return (
    <div className={cn("activity")}>
      <h2>Ngôi Nhà Sắc Màu</h2>
      <p>Một ngôi nhà thật giống con. Chọn màu, rồi đặt đồ trang trí nhé!</p>
      <div
        className={cn("house-canvas")}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const item = {
            id: choice,
            x: Math.max(
              5,
              Math.min(90, ((e.clientX - r.left) / r.width) * 100),
            ),
            y: Math.max(
              5,
              Math.min(85, ((e.clientY - r.top) / r.height) * 100),
            ),
          };
          save({
            type: "set",
            key: "decorations",
            value: [...decorations.slice(-19), item],
          });
          act({ type: "discover", id: "decor" });
          say("Đẹp quá! Mình đã cất thiết kế của con rồi.", "house");
        }}
      >
        <div className={cn("big-house")}>
          <Art id="house" color={color} />
        </div>
        {decorations.map((d, i) => (
          <button
            aria-label="Di chuyển đồ trang trí"
            key={i}
            style={{ left: d.x + "%", top: d.y + "%" }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) =>
              e.currentTarget.setPointerCapture(e.pointerId)
            }
            onPointerUp={(e) => {
              e.stopPropagation();
              const r = e.currentTarget.parentElement!.getBoundingClientRect();
              const items = decorations.map((v, j) =>
                j === i
                  ? {
                      ...v,
                      x: Math.max(
                        0,
                        Math.min(90, ((e.clientX - r.left) / r.width) * 100),
                      ),
                      y: Math.max(
                        0,
                        Math.min(85, ((e.clientY - r.top) / r.height) * 100),
                      ),
                    }
                  : v,
              );
              save({ type: "set", key: "decorations", value: items });
            }}
          >
            <Art id={d.id} />
          </button>
        ))}
      </div>
      <div className={cn("palette")}>
        {["#efcf9d", "#d7a6b5", "#a5bca0", "#a2becb", "#e7bc7b"].map((c, i) => (
          <button
            aria-label={`Màu ${["kem", "hồng", "xanh lá", "xanh trời", "vàng"][i]}`}
            key={c}
            style={{ background: c }}
            className={cn(color === c ? "selected" : "")}
            onClick={() => save({ type: "set", key: "houseColor", value: c })}
          />
        ))}
        {["flower", "butterfly", "star"].map((id) => (
          <button
            aria-label={`Trang trí ${id === "flower" ? "hoa" : id === "star" ? "ngôi sao" : "bướm"}`}
            className={cn(choice === id ? "selected" : "")}
            key={id}
            onClick={() => setChoice(id)}
          >
            <Art id={id} />
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          save({ type: "set", key: "decorations", value: [] });
          say("Một khoảng sân mới để con sáng tạo!");
        }}
      >
        Dọn đồ trang trí
      </button>
      <span className={cn("saved-note")}>Thiết kế được lưu tự động</span>
    </div>
  );
}
export function Notebook({ world, say }: { world: World; say: Props["say"] }) {
  const [replay, setReplay] = useState("");
  return (
    <div className={cn("notebook activity")}>
      <h2>Sổ Tay Khám Phá</h2>
      <p>Những điều kỳ diệu con đã gặp</p>
      {!world.discoveries.length && (
        <p>Chạm vào cây, ao hoặc bụi cỏ để gặp bạn mới nhé!</p>
      )}
      <div className={cn("discovery-grid")}>
        {discoveries
          .filter((d) => world.discoveries.includes(d.id))
          .map((d) => (
            <button
              key={d.id}
              className={cn(replay === d.id ? "replay" : "")}
              onClick={() => {
                setReplay(d.id);
                setTimeout(() => setReplay(""), 800);
                say(`Con đã khám phá ${d.name.toLowerCase()}!`, d.art);
              }}
            >
              <Art id={d.art} />
              <span>{d.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
}
