import { cn } from "../styles";
import { regions } from "../data/regions";
import { regionState } from "../game/regions";
import { Art } from "./Art";
import type { World } from "../game/engine";
type Props = {
  world: World;
  clearing: string[];
  onEnter: (regionId: string) => void;
  say: (text: string, kind?: string) => void;
};
// Coordinates align directly with the 6 illustrated landmarks in bg-valley-map.jpg.
const coords: Record<string, { x: number; y: number }> = {
  garden: { x: 14, y: 70 },
  pond: { x: 40, y: 67 },
  forest: { x: 22, y: 26 },
  beach: { x: 54, y: 24 },
  snow: { x: 74, y: 50 },
  stars: { x: 83, y: 20 },
};
export function ValleyMap({ world, clearing, onEnter, say }: Props) {
  const states = Object.fromEntries(
    regions.map((r) => [r.id, regionState(world.discoveries, r)]),
  );
  return (
    <section className={cn("valley-map")} aria-label="Bản đồ thung lũng">
      <div className={cn("map-board")}>
        <h1 className={cn("valley-title")}>Thung lũng nhỏ</h1>
        <img
          src="/assets/bg-valley-map.jpg"
          alt=""
          aria-hidden="true"
          draggable={false}
          className={cn("map-svg map-backdrop")}
        />
        {regions.map((r) => {
          const state = states[r.id];
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
                    ☁
                  </span>
                )}
              </span>
              <span className={cn("map-label")}>{r.name}</span>
              {state === "soon" && <small>Sắp có</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
