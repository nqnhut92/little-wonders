import { cn } from "../styles";
import { useState, useRef, type PointerEvent, type CSSProperties } from "react";
import { Art } from "./Art";
import { value, type World, type Plant, type Action } from "../game/engine";
import { seeds } from "../data/content";
import { interactions } from "../data/interactions";
type Props = {
  world: World;
  act: (a: Action) => void;
  say: (text: string, kind?: string) => void;
  open: (name: string) => void;
  highlight: boolean;
  showSteps: boolean;
};
export function Garden({ world, act, say, open, highlight, showSteps }: Props) {
  const counts = useRef<Record<string, number>>({});
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [reaction, setReaction] = useState("");
  const [seed, setSeed] = useState("sunflower");
  const [drag, setDrag] = useState<{
    kind: string;
    x: number;
    y: number;
  } | null>(null);
  const active = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const [revealed, reveal] = useState("");
  const react = (id: string, text: string, discovery?: string) => {
    setReaction(id);
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction(""), 850);
    const entry = interactions[id];
    const count = counts.current[id] ?? 0;
    counts.current[id] = count + 1;
    say(entry ? entry.lines[count % entry.lines.length] : text, id);
    const found = entry?.discovery || discovery;
    if (found) act({ type: "discover", id: found });
  };
  const down = (e: PointerEvent, kind: string) => {
    if (active.current !== null) return;
    e.preventDefault();
    active.current = e.pointerId;
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ kind, x: e.clientX, y: e.clientY });
  };
  const move = (e: PointerEvent) => {
    if (
      active.current === e.pointerId &&
      Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8
    )
      moved.current = true;
    if (active.current === e.pointerId)
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : null));
  };
  const up = (e: PointerEvent) => {
    if (active.current !== e.pointerId) return;
    active.current = null;
    const target = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-soil]");
    if (target && drag) {
      const slot = Number(target.getAttribute("data-soil"));
      if (drag.kind === "cloud" || drag.kind === "sun") {
        act({ type: drag.kind === "cloud" ? "water" : "sun", slot });
        react(
          drag.kind,
          drag.kind === "cloud"
            ? "Mưa tí tách! Mầm cây uống nước rồi!"
            : "Nắng ấm giúp cây nở hoa!",
        );
      } else {
        act({ type: "plant", slot, kind: drag.kind });
        react("soil", "Hạt đã nằm trong đất. Mình tưới nước nhé!");
      }
    }
    setDrag(null);
  };
  const object = (
    id: string,
    art: string,
    x: number,
    y: number,
    w: number,
    label: string,
    fn: () => void,
    extra?: CSSProperties,
  ) => (
    <button
      aria-label={label}
      className={cn(
        `object ${reaction === id ? "react-" + id : ""} ${highlight && ["cloud", "rock", "rabbit"].includes(id) ? "hint-glow" : ""}`,
      )}
      style={{
        left: x + "%",
        top: y + "%",
        width: `calc(${w} * var(--u))`,
        ...extra,
      }}
      onClick={fn}
    >
      <Art
        id={art}
        color={
          art === "house" ? value(world, "houseColor", "#efcf9d") : undefined
        }
      />
    </button>
  );
  return (
    <section
      className={cn("garden")}
      aria-label="Khu Vườn Kỳ Diệu"
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
        }
      }}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={() => {
        active.current = null;
        setDrag(null);
      }}
    >
      {showSteps && (
        <div
          className={cn("visual-hint")}
          aria-label="Chọn hạt, tưới nước, thêm nắng"
        >
          <Art id="flower" />
          <span>→</span>
          <Art id="cloud" />
          <span>→</span>
          <Art id="sun" />
        </div>
      )}
      <div className={cn("hill hill-back")} />
      <div className={cn("hill hill-front")} />
      <div className={cn("path")} />
      <h1 className={cn("sr-only")}>Khu Vườn Kỳ Diệu</h1>
      {world.discoveries.includes("rainbow") && (
        <div className={cn("rainbow")}>
          <Art id="rainbow" />
        </div>
      )}
      <button
        aria-label="Mặt trời"
        className={cn(`object sun ${reaction === "sun" ? "react-sun" : ""}`)}
        style={{ left: "74%", top: "6%", width: "calc(10 * var(--u))" }}
        onPointerDown={(e) => down(e, "sun")}
        onClick={() => {
          [0, 1, 2].forEach((slot) => act({ type: "sun", slot }));
          react("sun", "Nắng vàng ghé thăm khu vườn!");
        }}
      >
        <Art id="sun" />
      </button>
      <button
        aria-label="Mây tưới nước"
        className={cn(
          `object cloud ${reaction === "cloud" ? "react-cloud" : ""} ${highlight ? "hint-glow" : ""}`,
        )}
        style={{ left: "50%", top: "10%", width: "calc(15 * var(--u))" }}
        onPointerDown={(e) => down(e, "cloud")}
        onClick={() => {
          [0, 1, 2].forEach((slot) => act({ type: "water", slot }));
          react("cloud", "Mưa tí tách! Con cũng có thể kéo mây tới cây.");
        }}
      >
        <Art id="cloud" />
      </button>
      {object("tree", "tree", 3, 22, 25, "Cây táo", () =>
        react("tree", "Lá xào xạc… một quả táo rơi rồi!", "apple"),
      )}
      {reaction === "tree" && (
        <div className={cn("fallen-apple")}>
          <Art id="apple" />
        </div>
      )}
      {object("bird", "bird", 17, 29, 6, "Chim trên cành", () =>
        react("bird", "Chíp chíp! Bạn chim chào con!", "bird"),
      )}
      {object(
        "house",
        "house",
        66,
        37,
        22,
        "Ngôi Nhà Sắc Màu",
        () => open("house"),
        { filter: "drop-shadow(0 12px 0 #597a3814)" },
      )}
      <div
        className={cn("garden-decorations")}
        aria-label="Đồ trang trí đã đặt"
      >
        {value<{ id: string; x: number; y: number }[]>(
          world,
          "decorations",
          [],
        ).map((d, i) => (
          <span key={i} style={{ left: d.x + "%", top: d.y + "%" }}>
            <Art id={d.id} />
          </span>
        ))}
      </div>
      <div
        className={cn("house-tint")}
        style={{ background: value(world, "houseColor", "#efcf9d") }}
      />
      {object("pond", "pond", 3, 50, 26, "Ao nước", () => {
        reveal("fish");
        react("pond", "Tõm! Cá nhỏ bơi dưới làn nước.", "fish");
      })}
      {revealed === "fish" &&
        object("fish", "fish", 12, 75, 7, "Cá nhỏ", () =>
          react("fish", "Cá quẫy đuôi chào con!", "fish"),
        )}
      {object("rock", "rock", 33, 62, 9, "Đá có bọ rùa", () => {
        reveal("bug");
        react("rock", "Kìa, bọ rùa đang trốn dưới đá!", "ladybug");
      })}
      {revealed === "bug" &&
        object("bug", "bug", 38, 69, 5, "Bọ rùa", () =>
          react("bug", "Chấm tròn trên áo bạn bọ rùa!"),
        )}
      {object("grass", "grass", 27, 74, 10, "Bụi cỏ có tiếng dế", () => {
        reveal("worm");
        react("grass", "Rích rích! Dế và sâu đang ở trong cỏ.", "grass");
        act({ type: "discover", id: "worm" });
      })}
      {revealed === "worm" &&
        object("worm", "worm", 32, 82, 6, "Sâu nhỏ", () =>
          react("worm", "Bạn sâu uốn mình thật chậm."),
        )}
      {object("rabbit", "rabbit", 65, 74, 10, "Bữa Trưa Của Thỏ", () => {
        act({ type: "discover", id: "rabbit" });
        open("lunch");
      })}
      {object("flower", "flower", 90, 72, 7, "Hoa bên nhà", () => {
        react("flower", "Hoa rung rinh gọi bướm đến chơi!");
        reveal("butterfly");
      })}
      {(revealed === "butterfly" || world.discoveries.includes("butterfly")) &&
        object("butterfly", "butterfly", 82, 32, 7, "Bướm", () =>
          react(
            "butterfly",
            "Bướm thích những bông hoa con trồng!",
            "butterfly",
          ),
        )}
      <div className={cn("plots")} aria-label="Hạt Giống Bí Ẩn">
        {[0, 1, 2].map((slot) => {
          const p = value<Plant | undefined>(world, `plant${slot}`, undefined);
          return (
            <button
              data-soil={slot}
              key={slot}
              aria-label={`Luống đất ${slot + 1}`}
              className={cn(`soil ${reaction === "soil" ? "react-soil" : ""}`)}
              onClick={() => {
                if (!p) {
                  act({ type: "plant", slot, kind: seed });
                  say("Hạt xuống đất rồi. Con đưa mây tới đây nhé!");
                } else
                  say(
                    p.water
                      ? p.sun
                        ? "Hoa lớn rồi! Con có thể gieo hạt mới bằng cách kéo hạt vào luống."
                        : "Cây cần thêm nắng ấm!"
                      : "Mầm cây đang khát nước!",
                  );
              }}
            >
              {p ? (
                <div className={cn(`plant ${p.water && p.sun ? "grown" : ""}`)}>
                  <Art
                    id={
                      p.water && p.sun
                        ? p.kind === "sunflower"
                          ? "flower"
                          : p.kind
                        : "grass"
                    }
                  />
                  {p.water && <span className={cn("water-dot")}>●</span>}
                </div>
              ) : (
                <span className={cn("soil-mark")}>＋</span>
              )}
            </button>
          );
        })}
      </div>
      <div className={cn("seed-tray")}>
        <span>Gieo một điều bất ngờ</span>
        <div>
          {seeds.map((s) => (
            <button
              key={s.id}
              aria-label={`Hạt ${s.name}`}
              className={cn(seed === s.id ? "selected" : "")}
              onClick={() => {
                setSeed(s.id);
                say("Con kéo hạt xuống luống đất nhé!");
              }}
              onPointerDown={(e) => {
                setSeed(s.id);
                down(e, s.id);
              }}
            >
              <Art id={s.id === "sunflower" ? "flower" : s.id} />
              <small>{s.name}</small>
            </button>
          ))}
        </div>
      </div>
      <span className={cn("garden-sign sign-pond")}>Ao thì thầm</span>
      <span className={cn("garden-sign sign-house")}>Nhà của mình</span>
      {drag && (
        <div className={cn("drag-ghost")} style={{ left: drag.x, top: drag.y }}>
          <Art id={drag.kind === "sunflower" ? "flower" : drag.kind} />
        </div>
      )}
    </section>
  );
}
