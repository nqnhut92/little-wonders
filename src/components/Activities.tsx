import { useState, useRef, type PointerEvent } from "react";
import { Art } from "./Art";
import { initialMeal, offer } from "../game/lunch";
import { discoveries } from "../data/content";
import { value, type Action, type World } from "../game/engine";
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
  const [meal, setMeal] = useState(initialMeal);
  const feed = (kind: string) => {
    const result = offer(meal, kind);
    setMeal(result.meal);
    say(result.spoken, "rabbit");
    if (result.discovery) {
      act({ type: "discover", id: result.discovery });
      act({
        type: "set",
        key: "lastMeal",
        value: { kind: meal.kind, count: 3 },
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
    <div className="lunch activity">
      <h2>Bữa Trưa Của Thỏ</h2>
      <p>
        {meal.kind === "orange"
          ? "Giúp thỏ tìm ba củ cà rốt màu cam nhé!"
          : "Bữa ăn sắc màu! Con chọn ba món bất kỳ nhé!"}
      </p>
      <div className="lunch-scene">
        <Art id="rabbit" />
        <button
          data-basket
          aria-label="Giỏ thức ăn"
          onClick={() => feed(food)}
          className={meal.attempts >= 3 ? "hint-glow" : ""}
        >
          <Art id="basket" />
          <span>
            {[0, 1, 2].map((i) => (
              <i key={i} className={i < meal.count ? "filled" : ""} />
            ))}
          </span>
        </button>
      </div>
      <div className="food-tray">
        {["carrot", "berry", "apple"].map((f) => (
          <button
            key={f}
            aria-label={{ carrot: "Cà rốt", berry: "Dâu", apple: "Táo" }[f]}
            className={food === f ? "selected" : ""}
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
          </button>
        ))}
      </div>
      {drag && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
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
    <div className="activity">
      <h2>Ngôi Nhà Sắc Màu</h2>
      <p>Một ngôi nhà thật giống con. Chọn màu, rồi đặt đồ trang trí nhé!</p>
      <div
        className="house-canvas"
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
        <div className="big-house">
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
      <div className="palette">
        {["#efcf9d", "#d7a6b5", "#a5bca0", "#a2becb", "#e7bc7b"].map((c, i) => (
          <button
            aria-label={`Màu ${["kem", "hồng", "xanh lá", "xanh trời", "vàng"][i]}`}
            key={c}
            style={{ background: c }}
            className={color === c ? "selected" : ""}
            onClick={() => save({ type: "set", key: "houseColor", value: c })}
          />
        ))}
        {["flower", "butterfly", "star"].map((id) => (
          <button
            aria-label={`Trang trí ${id === "flower" ? "hoa" : id === "star" ? "ngôi sao" : "bướm"}`}
            className={choice === id ? "selected" : ""}
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
      <span className="saved-note">Thiết kế được lưu tự động</span>
    </div>
  );
}
export function Notebook({ world, say }: { world: World; say: Props["say"] }) {
  const [replay, setReplay] = useState("");
  return (
    <div className="notebook activity">
      <h2>Sổ Tay Khám Phá</h2>
      <p>Những điều kỳ diệu con đã gặp</p>
      {!world.discoveries.length && (
        <p>Chạm vào cây, ao hoặc bụi cỏ để gặp bạn mới nhé!</p>
      )}
      <div className="discovery-grid">
        {discoveries
          .filter((d) => world.discoveries.includes(d.id))
          .map((d) => (
            <button
              key={d.id}
              className={replay === d.id ? "replay" : ""}
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
