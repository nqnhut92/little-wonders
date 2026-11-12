import { cn } from "../styles";
import { regions } from "../data/regions";
import { regionProgress, regionState } from "../game/regions";
import { Art } from "./Art";
import { ValleyBackdrop } from "./SceneBackdrop";
import type { World } from "../game/engine";
type Props = {
  world: World;
  clearing: string[];
  devMode?: boolean;
  onEnter: (regionId: string) => void;
  say: (text: string, kind?: string) => void;
};
// Coordinates align with the six landmarks drawn in ValleyBackdrop (SceneBackdrop.tsx).
const coords: Record<string, { x: number; y: number }> = {
  garden: { x: 14, y: 70 },
  pond: { x: 40, y: 67 },
  forest: { x: 22, y: 26 },
  beach: { x: 54, y: 24 },
  snow: { x: 74, y: 50 },
  stars: { x: 83, y: 20 },
};
export function ValleyMap({
  world,
  clearing,
  devMode = false,
  onEnter,
  say,
}: Props) {
  const states = Object.fromEntries(
    regions.map((r) => [r.id, regionState(world.discoveries, r)]),
  );
  return (
    <section className={cn("valley-map")} aria-label="Bản đồ thung lũng">
      <div className={cn("map-board")}>
        <h1 className={cn("valley-title")}>Thung lũng nhỏ</h1>
        <ValleyBackdrop className={cn("map-svg map-backdrop")} />
        {regions.map((r) => {
          const state = devMode && r.ready ? "open" : states[r.id];
          const isClearing = clearing.includes(r.id);
          const pos = coords[r.id] ?? { x: 50, y: 50 };
          return (
            <button
              type="button"
              key={r.id}
              data-state={state}
              data-clearing={isClearing ? "true" : undefined}
              className={cn("map-region map-node")}
              style={{ left: pos.x + "%", top: pos.y + "%" }}
              aria-label={`${r.name}${state === "soon" ? ", sắp có" : state === "locked" ? ", chưa mở" : ""}`}
              onClick={() => {
                if (state === "open") onEnter(r.id);
                else
                  say(
                    state === "soon"
                      ? "Khu này sắp có rồi, con chờ nhé!"
                      : "Con chơi thêm ở khu trước để mở khu này nhé!",
                    "cloud",
                  );
              }}
            >
              <span className={cn("map-icon")}>
                {state === "soon" ? (
                  <span className={cn("map-art")} aria-hidden="true">
                    ?
                  </span>
                ) : (
                  <Art id={r.art ?? "flower"} />
                )}
                {(state === "locked" || isClearing) && (
                  <span
                    className={cn(
                      `map-fog ${isClearing ? "map-fog-clearing" : ""}`,
                    )}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 64 48" className={cn("map-fog-svg")}>
                      <path
                        d="M17 34a8.5 8.5 0 0 1-1.1-16.9A11.5 11.5 0 0 1 38 13.5a9 9 0 0 1 10.8 7.7A7 7 0 0 1 47.5 35H17z"
                        fill="var(--fog-back)"
                      />
                      <path
                        d="M12 39a7.5 7.5 0 0 1-1-14.9 10 10 0 0 1 19.3-3 8 8 0 0 1 9.5 6.8 6.3 6.3 0 0 1-1.2 12.6H12z"
                        fill="var(--fog-front)"
                      />
                    </svg>
                  </span>
                )}
              </span>
              <span className={cn("map-label")}>{r.name}</span>
              {state === "open" &&
                (() => {
                  const p = regionProgress(world.discoveries, r);
                  return (
                    <span
                      className={cn("map-progress")}
                      role="progressbar"
                      aria-label={`Tiến độ ${r.name}`}
                      aria-valuenow={p.found}
                      aria-valuemin={0}
                      aria-valuemax={p.total}
                    >
                      <span
                        style={{ width: `${Math.round(p.ratio * 100)}%` }}
                      />
                    </span>
                  );
                })()}
              {state === "soon" && <small>Sắp có</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
