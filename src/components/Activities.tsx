import { cn } from "../styles";
import { useState, useRef, useEffect, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { Art } from "./Art";
import { palSpeak, palStatus } from "../game/lunch";
import { playNote } from "../services/audio";
import { discoveries } from "../data/content";
import { cropArt, itemName } from "../data/crops";
import { maxDecorations } from "../data/ids";
import { value, basketOf, type Action, type World } from "../game/engine";
type Props = {
  world: World;
  act: (a: Action) => void;
  say: (s: string, k?: string, spoken?: string) => void;
};
export function PalPanel({
  world,
  act,
  say,
  palId = "puppy",
}: Props & { palId?: string }) {
  const { pal, gifts, wish, unlockedChapters } = palStatus(world, palId);
  const basket = basketOf(world);
  const free = pal.freeFoods ?? [];
  const options = [
    ...new Set([
      ...free,
      ...Object.keys(basket).filter((k) => (basket[k] ?? 0) > 0),
    ]),
  ];
  const [food, setFood] = useState(() =>
    options.includes(wish) ? wish : (options[0] ?? ""),
  );
  const activeFood = options.includes(food) ? food : (options[0] ?? "");
  const [drag, setDrag] = useState<{
    kind: string;
    x: number;
    y: number;
  } | null>(null);
  const pointer = useRef<number | null>(null);
  const [feedback, setFeedback] = useState(
    `${pal.name} đang thích ${itemName(wish).toLowerCase()} nhé!`,
  );
  const [reaction, setReaction] = useState("idle");
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const give = (kind: string) => {
    if (!kind) return;
    if ((basket[kind] ?? 0) <= 0 && !free.includes(kind)) return;
    act({ type: "gift", pal: pal.id, kind });
    const matched = kind === wish;
    const line = matched
      ? pal.thanks[gifts % pal.thanks.length]
      : `${pal.name} vui lắm! ${pal.name} vẫn chờ ${itemName(wish).toLowerCase()} nhé!`;
    setFeedback(line);
    setStoryIndex(null);
    setReaction("happy");
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction("idle"), 1000);
    say(line, pal.art, palSpeak(pal, line));
  };
  const drop = (e: PointerEvent, kind: string) => {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    setDrag(null);
    const t = document.elementFromPoint(e.clientX, e.clientY);
    if (t?.closest("[data-basket]")) give(kind);
  };
  return (
    <div className={cn("lunch activity")}>
      <h2>
        {pal.id === "puppy" ? "Góc Của Lucky" : `Lời mời của ${pal.name}`}
      </h2>
      <p>
        {pal.name} đang thích {itemName(wish).toLowerCase()}
      </p>
      <div
        className={cn("meal-request")}
        aria-label={`Món ${pal.name} đang muốn`}
      >
        <Art id={cropArt(wish)} />
      </div>
      <p
        role="status"
        className={cn(
          `meal-feedback ${storyIndex !== null ? "pal-story-text" : ""}`,
        )}
      >
        {storyIndex !== null && storyIndex < unlockedChapters
          ? pal.stories[storyIndex]
          : feedback}
      </p>
      <div className={cn("lunch-scene")}>
        <div className={cn(`pal-response pal-${reaction}`)}>
          <Art id={pal.art} />
          {reaction === "happy" && (
            <span className={cn("pal-spark")}>
              <Art id="star" />
            </span>
          )}
          <span className={cn("pal-wish")} aria-hidden="true">
            <Art id={cropArt(wish)} />
          </span>
        </div>
        <button
          data-basket
          aria-label="Giỏ thức ăn"
          disabled={!activeFood}
          onClick={() => give(activeFood)}
        >
          <Art id="basket" />
        </button>
      </div>
      {options.length === 0 ? (
        <p>Con hái cây trong vườn hoặc lắc cây táo để có quà nhé!</p>
      ) : (
        <div className={cn("food-tray")}>
          {options.map((f) => (
            <button
              key={f}
              aria-label={itemName(f)}
              className={cn(activeFood === f ? "selected" : "")}
              onPointerDown={(e) => {
                if (pointer.current !== null) return;
                e.preventDefault();
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
              <Art id={cropArt(f)} />
              {(basket[f] ?? 0) > 0 && (
                <b className={cn("food-count")} aria-hidden="true">
                  {basket[f]}
                </b>
              )}
            </button>
          ))}
        </div>
      )}
      {drag &&
        createPortal(
          <div
            className={cn("drag-ghost")}
            style={{ left: drag.x, top: drag.y }}
          >
            <Art id={cropArt(drag.kind)} />
          </div>,
          document.body,
        )}
      <div className={cn("pal-stories")} aria-label={`Chuyện của ${pal.name}`}>
        {pal.stories.map((story, i) => {
          const openChapter = i < unlockedChapters;
          return (
            <button
              key={i}
              type="button"
              disabled={!openChapter}
              className={cn(storyIndex === i ? "selected" : "")}
              aria-label={
                openChapter
                  ? `Đọc chuyện ${i + 1} của ${pal.name}`
                  : `Chuyện ${i + 1} chưa mở`
              }
              onClick={() => {
                setStoryIndex(i);
                say(story, pal.art, palSpeak(pal, story));
              }}
            >
              {openChapter ? `Chuyện ${i + 1}` : "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function Lunch(props: Props) {
  return <PalPanel {...props} palId="puppy" />;
}
const houseDecorations = [
  { id: "flower", label: "Trang trí hoa" },
  { id: "butterfly", label: "Trang trí bướm" },
  { id: "star", label: "Trang trí ngôi sao" },
  {
    id: "decor-sunflower",
    label: "Trang trí hoa hướng dương",
    requires: "harvest_sunflower",
  },
  {
    id: "decor-pumpkin-lamp",
    label: "Trang trí đèn bí ngô",
    requires: "harvest_pumpkin",
  },
];
export function House({ world, act, say }: Props) {
  const color = value(world, "houseColor", "#efcf9d");
  const night = value<string>(world, "scene.time", "day") === "night";
  const decorations = value<{ id: string; x: number; y: number }[]>(
    world,
    "decorations",
    [],
  );
  const [choice, setChoice] = useState("flower");
  const [dragDecor, setDragDecor] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const dragPointer = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const save = (a: Action) => {
    act(a);
    act({ type: "discover", id: "house" });
  };
  const placeAt = (id: string, clientX: number, clientY: number) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return;
    const item = {
      id,
      x: Math.max(5, Math.min(90, ((clientX - r.left) / r.width) * 100)),
      y: Math.max(5, Math.min(85, ((clientY - r.top) / r.height) * 100)),
    };
    const next = [...decorations.slice(-(maxDecorations - 1)), item];
    save({
      type: "set",
      key: "decorations",
      value: next,
    });
    act({ type: "discover", id: "decor" });
    if (next.length >= 3) act({ type: "discover", id: "house_decorated" });
    say("Đẹp quá! Mình đã cất thiết kế của con rồi.", "house");
  };
  return (
    <div className={cn("activity")}>
      <h2>Ngôi Nhà Sắc Màu</h2>
      <p>
        Một ngôi nhà thật giống con. Chọn màu, rồi kéo hoặc chạm đặt đồ nhé!
      </p>
      <div
        ref={canvasRef}
        className={cn("house-canvas")}
        onClick={(e) => placeAt(choice, e.clientX, e.clientY)}
      >
        <div className={cn("big-house")}>
          <Art id="house" color={color} night={night} />
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
            <Art id={d.id} night={night} />
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
        {houseDecorations.map((d) => {
          const unlocked =
            !d.requires || world.discoveries.includes(d.requires);
          return (
            <button
              key={d.id}
              disabled={!unlocked}
              aria-label={unlocked ? d.label : `${d.label} chưa mở`}
              className={cn(
                `${choice === d.id ? "selected" : ""} ${!unlocked ? "locked-silhouette" : ""}`,
              )}
              onPointerDown={(e) => {
                if (!unlocked || dragPointer.current !== null) return;
                e.preventDefault();
                dragPointer.current = e.pointerId;
                e.currentTarget.setPointerCapture(e.pointerId);
                setChoice(d.id);
                setDragDecor({ id: d.id, x: e.clientX, y: e.clientY });
              }}
              onPointerMove={(e) => {
                if (dragPointer.current === e.pointerId)
                  setDragDecor({ id: d.id, x: e.clientX, y: e.clientY });
              }}
              onPointerCancel={() => {
                dragPointer.current = null;
                setDragDecor(null);
              }}
              onPointerUp={(e) => {
                if (dragPointer.current !== e.pointerId) return;
                dragPointer.current = null;
                setDragDecor(null);
                const r = canvasRef.current?.getBoundingClientRect();
                if (
                  r &&
                  e.clientX >= r.left &&
                  e.clientX <= r.right &&
                  e.clientY >= r.top &&
                  e.clientY <= r.bottom
                )
                  placeAt(d.id, e.clientX, e.clientY);
              }}
              onClick={() => setChoice(d.id)}
            >
              <Art id={d.id} night={night} />
            </button>
          );
        })}
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
      {dragDecor &&
        createPortal(
          <div
            className={cn("drag-ghost")}
            style={{ left: dragDecor.x, top: dragDecor.y }}
          >
            <Art id={dragDecor.id} night={night} />
          </div>,
          document.body,
        )}
    </div>
  );
}
export function Notebook({ world, say }: { world: World; say: Props["say"] }) {
  const [replay, setReplay] = useState("");
  return (
    <div className={cn("notebook activity")}>
      <h2>Sổ Tay Khám Phá</h2>
      <p>
        {world.discoveries.length
          ? "Chạm vào từng hình để nghe lại nhé!"
          : "Chạm vào cây, ao hoặc bụi cỏ để gặp bạn mới nhé!"}
      </p>
      <div className={cn("discovery-grid")}>
        {discoveries
          .filter((d) => world.discoveries.includes(d.id))
          .map((d) => (
            <button
              type="button"
              key={d.id}
              aria-label={d.name}
              title={d.name}
              className={cn(replay === d.id ? "replay" : "")}
              onClick={() => {
                setReplay(d.id);
                setTimeout(() => setReplay(""), 800);
                say(`Con đã khám phá ${d.name.toLowerCase()}!`, d.art);
              }}
            >
              <Art id={d.art} />
            </button>
          ))}
      </div>
    </div>
  );
}
const noteNames = ["Đồ", "Rê", "Mi", "Son", "La", "Đố", "Rế", "Mí"];
export function Xylophone({
  act,
  audio,
}: {
  act: (a: Action) => void;
  audio: boolean;
}) {
  const active = useRef<Map<number, number>>(new Map());
  const [lit, setLit] = useState<number[]>([]);
  const hit = (pointerId: number, idx: number) => {
    if (active.current.get(pointerId) === idx) return;
    active.current.set(pointerId, idx);
    playNote(idx, audio);
    act({ type: "discover", id: "xylophone" });
    setLit((prev) => [...prev, idx]);
    setTimeout(() => setLit((prev) => prev.filter((x) => x !== idx)), 260);
  };
  const release = (pointerId: number) => {
    active.current.delete(pointerId);
  };
  useEffect(() => {
    const end = (e: globalThis.PointerEvent) =>
      active.current.delete(e.pointerId);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, []);
  return (
    <div className={cn("activity")}>
      <h2>Đàn gỗ ngũ cung</h2>
      <p>Con chạm nhiều ngón hoặc vuốt qua các thanh gỗ nhé!</p>
      <div
        className={cn("xylophone")}
        aria-label="Đàn gỗ 8 thanh"
        onPointerMove={(e) => {
          if (!active.current.has(e.pointerId)) return;
          const el = document
            .elementFromPoint(e.clientX, e.clientY)
            ?.closest("[data-bar]");
          const bar = el?.getAttribute("data-bar");
          if (bar !== null && bar !== undefined) hit(e.pointerId, Number(bar));
        }}
        onPointerUp={(e) => release(e.pointerId)}
        onPointerCancel={(e) => release(e.pointerId)}
      >
        {noteNames.map((label, i) => (
          <button
            type="button"
            key={i}
            data-bar={i}
            aria-label={`Thanh đàn ${label}`}
            className={cn(`xylophone-bar ${lit.includes(i) ? "bar-lit" : ""}`)}
            style={{ height: `${190 - i * 10}px` }}
            onPointerDown={(e) => {
              e.preventDefault();
              hit(e.pointerId, i);
            }}
            onClick={(e) => {
              // Keyboard activation (Enter/Space) triggers click with detail === 0.
              if (e.detail === 0) hit(-1, i);
            }}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
