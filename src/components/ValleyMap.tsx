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
export function ValleyMap({ world, clearing, onEnter, say }: Props) {
  return (
    <section className={cn("valley-map")} aria-label="Bản đồ thung lũng">
      <div className={cn("hill hill-back")} />
      <div className={cn("hill hill-front")} />
      <div className={cn("valley-content")}>
        <h1 className={cn("valley-title")}>Thung lũng nhỏ</h1>
        <div className={cn("map-grid")}>
          {regions.map((r) => {
            const state = regionState(world.discoveries, r);
            const isClearing = clearing.includes(r.id);
            return (
              <button
                type="button"
                key={r.id}
                data-state={state}
                data-clearing={isClearing ? "true" : undefined}
                className={cn("map-region")}
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
                <span>{r.name}</span>
                {state === "soon" && <small>Sắp có</small>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
