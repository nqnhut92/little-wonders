import { cn } from "../styles";
import { useState, useRef, type PointerEvent, type CSSProperties } from "react";
import { Art } from "./Art";
import {
  value,
  plotKey,
  plotCount,
  basketOf,
  type World,
  type Plot,
  type Action,
} from "../game/engine";
import { cropArt, crops, itemName, ripeStage } from "../data/crops";
import { pals } from "../data/pals";
import { palWish } from "../game/lunch";
import { interactions } from "../data/interactions";
import { scenes, type SceneHotspot } from "../data/scenes";
import { gardenVisitors } from "../game/visitors";
import { SceneBackdrop, drawnVariants } from "./SceneBackdrop";
import type { SurpriseEvent } from "../game/events";
type Props = {
  regionId?: string;
  world: World;
  act: (a: Action) => void;
  say: (text: string, kind?: string, spoken?: string) => void;
  open: (name: string) => void;
  highlight: boolean;
  showSteps: boolean;
  surprise?: SurpriseEvent | null;
};
const frogSpots = [
  { x: 20, y: 74 },
  { x: 39, y: 77 },
  { x: 59, y: 80 },
];
const snailSpots = [
  { x: 34, y: 74 },
  { x: 62, y: 72 },
  { x: 88, y: 79 },
];
const birdSpots = [
  { x: 17, y: 29 },
  { x: 11, y: 24 },
  { x: 22, y: 33 },
];
export function Garden({
  regionId = "garden",
  world,
  act,
  say,
  open,
  highlight,
  showSteps,
  surprise,
}: Props) {
  const scene = scenes[regionId] ?? scenes.garden;
  const night = value<string>(world, "scene.time", "day") === "night";
  const regionCrops = crops.filter(
    (c) =>
      (c.region ?? "garden") === scene.id &&
      (!c.requires || world.discoveries.includes(c.requires)),
  );
  const [selectedSeed, setSeed] = useState(
    () => regionCrops[0]?.id ?? "sunflower",
  );
  const seed = regionCrops.some((c) => c.id === selectedSeed)
    ? selectedSeed
    : (regionCrops[0]?.id ?? "sunflower");
  const counts = useRef<Record<string, number>>({});
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const windTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const fallTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [reaction, setReaction] = useState("");
  const [falling, setFalling] = useState<{
    key: number;
    art: string;
    x: number;
    y: number;
    startY?: number;
  } | null>(null);
  const [wind, setWind] = useState(false);
  const [frogSpot, setFrogSpot] = useState(0);
  const [snailSpot, setSnailSpot] = useState(0);
  const [birdSpot, setBirdSpot] = useState(0);
  const [fireflyPos, setFireflyPos] = useState({ x: 46, y: 38 });
  const [drag, setDrag] = useState<{
    kind: string;
    x: number;
    y: number;
  } | null>(null);
  const active = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const [revealed, reveal] = useState("");
  // Build hotspots (sandcastle, snowman, constellation) grow one stage per tap; a finished one starts over.
  const [builds, setBuilds] = useState<Record<string, number>>({});
  const buildStage = (h: SceneHotspot) =>
    builds[h.id] ??
    (h.discovery && world.discoveries.includes(h.discovery)
      ? (h.stages?.length ?? 1) - 1
      : 0);
  const hasCrops = regionCrops.length > 0;
  const visitors = gardenVisitors(world, scene.id);
  const react = (id: string, text: string, discovery?: string) => {
    setReaction(id);
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReaction(""), 850);
    const entry = interactions[id];
    const lines = night && entry?.nightLines ? entry.nightLines : entry?.lines;
    const count = counts.current[id] ?? 0;
    counts.current[id] = count + 1;
    say(lines ? lines[count % lines.length] : text, id);
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
  const move = (e: PointerEvent<HTMLElement>) => {
    if (night) {
      const r = e.currentTarget.getBoundingClientRect();
      if (r.width > 0 && r.height > 0)
        setFireflyPos({
          x: Math.max(12, Math.min(84, ((e.clientX - r.left) / r.width) * 100)),
          y: Math.max(18, Math.min(72, ((e.clientY - r.top) / r.height) * 100)),
        });
    }
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
      if (
        drag.kind === "cloud" ||
        drag.kind === "sun" ||
        drag.kind === "moon"
      ) {
        act({
          type: drag.kind === "cloud" ? "water" : "sun",
          slot,
          region: scene.id,
        });
        react(
          drag.kind,
          drag.kind === "cloud"
            ? "Mưa tí tách! Mầm cây uống nước rồi!"
            : drag.kind === "moon"
              ? "Ánh trăng dịu mát chiếu sáng cho cây nở hoa!"
              : "Nắng ấm giúp cây nở hoa!",
        );
      } else {
        act({ type: "plant", slot, kind: drag.kind, region: scene.id });
        react("soil", "Hạt đã nằm trong đất. Mình tưới nước nhé!");
      }
    }
    setDrag(null);
  };
  const triggerFall = (art: string, x: number, y: number, startY?: number) => {
    setFalling({ key: Date.now(), art, x, y, startY: startY ?? y });
    clearTimeout(fallTimer.current);
    fallTimer.current = setTimeout(() => setFalling(null), 850);
  };
  const triggerHotspot = (h: SceneHotspot) => {
    if (h.kind === "tree") {
      act({ type: "shake" });
      triggerFall("apple", h.x + h.w * 0.65, 61, h.y + h.w * 0.2);
      react(h.id, h.line ?? "", h.discovery);
    } else if (h.kind === "gather" && h.gives) {
      act({ type: "shake", kind: h.gives });
      if (h.gives !== "shell")
        triggerFall(
          cropArt(h.gives),
          h.x + h.w * 0.5 - 2,
          h.gives === "honey" ? 60 : Math.min(68, h.y + h.w * 1.8),
          h.y,
        );
      react(h.id, h.line ?? "");
    } else if (h.kind === "build" && h.stages) {
      const last = h.stages.length - 1;
      const now = buildStage(h);
      const next = now >= last ? 0 : now + 1;
      setBuilds((b) => ({ ...b, [h.id]: next }));
      react(h.id, h.stageLines?.[next] ?? h.line ?? "");
      if (next === last && h.discovery)
        act({ type: "discover", id: h.discovery });
    } else if (h.id === "moon-face" || h.id === "moon") {
      Array.from({ length: plotCount(world) }, (_, slot) => slot).forEach(
        (slot) => act({ type: "sun", slot, region: scene.id }),
      );
      react(h.id, "Ánh trăng dịu mát chiếu sáng cho cây nở hoa!", h.discovery);
    } else if (h.kind === "house") {
      open("house");
    } else if (h.kind === "pal" && h.palId) {
      if (h.palId === "puppy") act({ type: "discover", id: "puppy" });
      if (h.discovery) act({ type: "discover", id: h.discovery });
      open(h.palId === "puppy" ? "lunch" : `pal:${h.palId}`);
    } else if (h.kind === "xylophone") {
      open("xylophone");
      react(h.id, h.line ?? "", h.discovery);
    } else if (h.kind === "windmill") {
      setWind(true);
      clearTimeout(windTimer.current);
      windTimer.current = setTimeout(() => setWind(false), 2200);
      act({ type: "discover", id: "wind" });
      react(h.id, h.line ?? "", h.discovery);
    } else if (h.kind === "reveal" || h.kind === "flower") {
      if (h.revealTarget) reveal(h.revealTarget);
      if (h.id === "grass") act({ type: "discover", id: "worm" });
      react(h.id, h.line ?? "", h.discovery);
    } else {
      if (h.id === "bird") setBirdSpot((i) => (i + 1) % birdSpots.length);
      react(h.id, h.line ?? "", h.discovery);
    }
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
    badge?: string,
    onDown?: (e: React.PointerEvent) => void,
  ) => (
    <button
      key={id}
      aria-label={label}
      className={cn(
        `object ${art === "pond" ? "object-pond" : ""} ${art === "hot-spring" ? "object-hot-spring" : ""} ${reaction === id ? "react-" + id : ""} ${highlight && ["cloud", "rock", "puppy"].includes(id) ? "hint-glow" : ""} ${id === "windmill" && wind ? "spin-windmill" : ""}`,
      )}
      style={{
        left: x + "%",
        top: y + "%",
        width: `calc(${w} * var(--u))`,
        ...extra,
      }}
      onPointerDown={onDown}
      onClick={fn}
    >
      <Art
        id={art}
        color={
          art === "house" ? value(world, "houseColor", "#efcf9d") : undefined
        }
        night={night}
      />
      {badge && (
        <span className={cn("pal-bubble")} aria-hidden="true">
          <Art id={badge} />
        </span>
      )}
    </button>
  );
  return (
    <section
      className={cn("garden")}
      data-time={night ? "night" : "day"}
      data-variant={scene.variant}
      data-backdrop={
        drawnVariants.includes(scene.variant) ? "drawn" : undefined
      }
      data-wind={wind ? "true" : undefined}
      aria-label={scene.title}
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
          aria-label={
            scene.variant === "stars"
              ? "Chọn hạt, tưới nước, thêm ánh trăng"
              : "Chọn hạt, tưới nước, thêm nắng"
          }
        >
          <Art id="flower" />
          <span>→</span>
          <Art id="cloud" />
          <span>→</span>
          <Art id={scene.variant === "stars" ? "moon-face" : "sun"} />
        </div>
      )}
      <div className={cn("hill hill-back")} />
      <div className={cn("hill hill-front")} />
      <div className={cn("path")} />
      <h1 className={cn("sr-only")}>{scene.title}</h1>
      {drawnVariants.includes(scene.variant) && (
        <SceneBackdrop variant={scene.variant} night={night} />
      )}
      {night && scene.variant !== "stars" && (
        <>
          <div className={cn("night-stars")} aria-hidden="true">
            {[
              [22, 18],
              [37, 14],
              [62, 16],
              [44, 26],
              [70, 24],
            ].map(([sx, sy], i) => (
              <span key={i} style={{ left: sx + "%", top: sy + "%" }}>
                <Art id="star" />
              </span>
            ))}
          </div>
          <div
            className={cn("firefly")}
            style={{ left: fireflyPos.x + "%", top: fireflyPos.y + "%" }}
            aria-hidden="true"
          >
            <Art id="fx-firefly" />
          </div>
        </>
      )}
      {(world.discoveries.includes("rainbow") ||
        surprise?.kind === "rainbow") &&
        scene.sky !== false &&
        !night && (
          <div className={cn("rainbow")}>
            <Art id="rainbow" />
          </div>
        )}
      {surprise?.kind === "shooting_star" && (
        <div className={cn("shooting-star")} aria-hidden="true">
          <Art id="fx-shooting-star" />
        </div>
      )}
      {surprise?.kind === "butterflies" && (
        <div className={cn("butterfly-flock")} aria-hidden="true">
          <Art id="butterfly" />
          <Art id="butterfly" />
        </div>
      )}
      {scene.sky === false ? null : !night ? (
        <button
          aria-label="Mặt trời"
          className={cn(`object sun ${reaction === "sun" ? "react-sun" : ""}`)}
          style={{ left: "74%", top: "6%", width: "calc(10 * var(--u))" }}
          onPointerDown={(e) => down(e, "sun")}
          onClick={() => {
            Array.from({ length: plotCount(world) }, (_, slot) => slot).forEach(
              (slot) => act({ type: "sun", slot, region: scene.id }),
            );
            react("sun", "Nắng vàng ghé thăm khu vườn!");
          }}
        >
          <Art id="sun" />
        </button>
      ) : (
        object("moon", "fx-moon", 74, 6, 9, "Mặt trăng", () => {
          act({ type: "discover", id: "moon" });
          act({ type: "discover", id: "stars" });
          react("moon", "Trăng tròn sáng dịu trên bầu trời đêm!", "moon");
        })
      )}
      {(scene.sky !== false || scene.hasCloud) && (
        <button
          aria-label="Mây tưới nước"
          className={cn(
            `object cloud ${reaction === "cloud" ? "react-cloud" : ""} ${highlight ? "hint-glow" : ""}`,
          )}
          style={{
            left: `${scene.cloud?.x ?? 50}%`,
            top: `${scene.cloud?.y ?? 10}%`,
            width: "calc(15 * var(--u))",
          }}
          onPointerDown={(e) => down(e, "cloud")}
          onClick={() => {
            Array.from({ length: plotCount(world) }, (_, slot) => slot).forEach(
              (slot) => act({ type: "water", slot, region: scene.id }),
            );
            react("cloud", "Mưa tí tách! Con cũng có thể kéo mây tới cây.");
          }}
        >
          <Art id="cloud" night={night} />
        </button>
      )}
      {scene.hotspots
        .filter((h) => {
          if (h.requires && !world.discoveries.includes(h.requires))
            return false;
          if (h.dayOnly && night) return false;
          if (h.nightOnly && !night) return false;
          if (h.kind === "revealed") {
            const unlockedByDiscovery =
              h.revealedWhen === "butterfly" &&
              world.discoveries.includes("butterfly");
            if (revealed !== h.revealedWhen && !unlockedByDiscovery)
              return false;
          }
          return true;
        })
        .map((h) => {
          const pal =
            h.kind === "pal" && h.palId && h.palId !== "puppy"
              ? pals.find((p) => p.id === h.palId)
              : undefined;
          const pos =
            h.id === "bird" ? birdSpots[birdSpot] : { x: h.x, y: h.y };
          return object(
            h.id,
            h.kind === "build" && h.stages ? h.stages[buildStage(h)] : h.art,
            pos.x,
            pos.y,
            h.w,
            h.label,
            () => triggerHotspot(h),
            undefined,
            pal ? cropArt(palWish(world, pal)) : undefined,
            h.id === "moon-face" ? (e) => down(e, "moon") : undefined,
          );
        })}
      {falling && (
        <div
          key={falling.key}
          className={cn("fallen-apple")}
          style={{
            left: `${falling.x}%`,
            top: `${falling.y}%`,
            ["--drop-from" as any]: `${falling.startY ?? falling.y}%`,
            ["--drop-to" as any]: `${falling.y}%`,
          }}
        >
          <Art id={falling.art} />
        </div>
      )}
      {scene.hasHouse && (
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
              <Art id={d.id} night={night} />
            </span>
          ))}
        </div>
      )}
      {scene.hasCritters && (
        <>
          {object(
            "critter-frog",
            "frog",
            frogSpots[frogSpot].x,
            frogSpots[frogSpot].y,
            5.5,
            "Ếch nhỏ",
            () => {
              setFrogSpot((i) => (i + 1) % frogSpots.length);
              react("frog", "Ộp ộp! Bạn ếch nhảy sang chỗ mới!", "frog");
            },
          )}
          {object(
            "critter-snail",
            "snail",
            snailSpots[snailSpot].x,
            snailSpots[snailSpot].y,
            5,
            "Ốc sên",
            () => {
              setSnailSpot((i) => (i + 1) % snailSpots.length);
              react("snail", "Ốc sên bò thật chậm rãi!", "snail");
            },
          )}
        </>
      )}
      {visitors.map((v) =>
        object(v.id, v.art, v.x, v.y, 5.5, v.label, () =>
          react(v.art, `${v.label}!`),
        ),
      )}
      {hasCrops && (
        <div className={cn("plots")} aria-label="Hạt Giống Bí Ẩn">
          {Array.from({ length: plotCount(world) }, (_, slot) => {
            const p = value<Plot | undefined>(
              world,
              plotKey(slot, scene.id),
              undefined,
            );
            const growing = p && p.stage > 0 ? p : undefined;
            const art = cropArt(growing?.kind ?? "");
            return (
              <button
                data-soil={slot}
                key={slot}
                aria-label={`Luống đất ${slot + 1}`}
                className={cn(
                  `soil ${reaction === "soil" ? "react-soil" : ""}`,
                )}
                onClick={() => {
                  if (!growing) {
                    act({ type: "plant", slot, kind: seed, region: scene.id });
                    say("Hạt xuống đất rồi. Con đưa mây tới đây nhé!");
                  } else if (growing.stage === ripeStage) {
                    act({ type: "harvest", slot, region: scene.id });
                    say("Hái được rồi! Con bỏ vào giỏ nhé.", "flower");
                  } else
                    say(
                      !growing.water
                        ? "Mầm cây đang khát nước!"
                        : scene.variant === "stars"
                          ? "Cây cần thêm ánh trăng sáng!"
                          : "Cây cần thêm nắng ấm!",
                    );
                }}
              >
                {growing ? (
                  <div
                    className={cn(
                      `plant stage-${growing.stage} ${growing.stage === ripeStage ? "ripe" : ""}`,
                    )}
                  >
                    <Art id={growing.stage >= 3 ? art : "grass"} />
                    {growing.water && (
                      <span className={cn("water-dot")}>●</span>
                    )}
                  </div>
                ) : (
                  <span className={cn("soil-mark")}>＋</span>
                )}
              </button>
            );
          })}
        </div>
      )}
      {Object.entries(basketOf(world)).some(([, n]) => n > 0) && (
        <div className={cn("basket-count")} aria-label="Giỏ của con">
          <Art id="basket" />
          {Object.entries(basketOf(world))
            .filter(([, n]) => n > 0)
            .map(([kind, n]) => (
              <span key={kind} aria-label={`${itemName(kind)} ${n}`}>
                <Art id={cropArt(kind)} />
                <b>{n}</b>
              </span>
            ))}
        </div>
      )}
      {hasCrops && (
        <div className={cn("seed-tray")}>
          <span>Gieo một điều bất ngờ</span>
          <div>
            {regionCrops.map((s) => (
              <button
                key={s.id}
                aria-label={`Hạt ${s.name}`}
                className={cn(seed === s.id ? "selected" : "")}
                onClick={() => {
                  setSeed(s.id);
                  say(
                    `Con kéo hạt ${s.name.toLowerCase()} xuống luống đất nhé!`,
                    s.art,
                  );
                }}
                onPointerDown={(e) => {
                  setSeed(s.id);
                  down(e, s.id);
                }}
              >
                <Art id={cropArt(s.id)} />
                <small>{s.name}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      {drag && (
        <div className={cn("drag-ghost")} style={{ left: drag.x, top: drag.y }}>
          <Art
            id={
              drag.kind === "cloud"
                ? "cloud"
                : drag.kind === "sun"
                  ? "sun"
                  : drag.kind === "moon"
                    ? "moon-face"
                    : cropArt(drag.kind)
            }
          />
        </div>
      )}
    </section>
  );
}
