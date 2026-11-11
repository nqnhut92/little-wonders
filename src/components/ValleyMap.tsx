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
const coords: Record<string, { x: number; y: number }> = {
  garden: { x: 14, y: 74 },
  pond: { x: 35, y: 58 },
  forest: { x: 25, y: 26 },
  beach: { x: 56, y: 26 },
  snow: { x: 76, y: 54 },
  stars: { x: 84, y: 20 },
};
export function ValleyMap({ world, clearing, onEnter, say }: Props) {
  const states = Object.fromEntries(
    regions.map((r) => [r.id, regionState(world.discoveries, r)]),
  );
  return (
    <section className={cn("valley-map")} aria-label="Bản đồ thung lũng">
      <div className={cn("hill hill-back")} />
      <div className={cn("hill hill-front")} />
      <div className={cn("map-board")}>
        <h1 className={cn("valley-title")}>Thung lũng nhỏ</h1>
        <svg
          viewBox="0 0 1000 560"
          className={cn("map-svg")}
          aria-hidden="true"
        >
          {/* Decorative clouds */}
          <g fill="var(--glass-solid)" opacity="0.72">
            <ellipse cx="140" cy="74" rx="46" ry="20" />
            <ellipse cx="170" cy="68" rx="34" ry="18" />
            <ellipse cx="670" cy="64" rx="52" ry="20" />
            <ellipse cx="705" cy="58" rx="32" ry="16" />
          </g>
          {/* Garden meadow patch */}
          <ellipse cx="140" cy="422" rx="115" ry="58" fill="var(--scene-grass)" />
          <path
            d="M72 414v-16m18 16v-16m18 16v-16m-40 6h44"
            stroke="var(--scene-trail-dash)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Pond and meandering river */}
          <path
            d="M360 324Q430 370 405 445T470 555"
            fill="none"
            stroke="var(--scene-water)"
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.75"
          />
          <ellipse cx="350" cy="325" rx="95" ry="48" fill="var(--scene-water)" opacity="0.88" />
          <ellipse cx="315" cy="316" rx="18" ry="8" fill="var(--scene-pine)" opacity="0.75" />
          <ellipse cx="395" cy="336" rx="16" ry="7" fill="var(--scene-pine)" opacity="0.75" />
          {/* Forest hill and pine trees */}
          <ellipse cx="255" cy="164" rx="115" ry="56" fill="var(--scene-hill)" />
          {[
            [185, 165, 1],
            [225, 128, 0.9],
            [305, 138, 1.05],
            [335, 175, 0.85],
          ].map(([tx, ty, s], i) => (
            <g key={i} transform={`translate(${tx} ${ty}) scale(${s})`}>
              <path d="M-16 0 0-34 16 0Z" fill="var(--scene-pine)" />
              <path d="M-12-16 0-44 12-16Z" fill="var(--scene-pine)" />
            </g>
          ))}
          {/* Beach sandy cove and waves */}
          <ellipse cx="565" cy="142" rx="125" ry="58" fill="var(--scene-sea)" opacity="0.85" />
          <ellipse cx="555" cy="162" rx="102" ry="40" fill="var(--scene-sand)" />
          <path
            d="M505 112q18-8 36 0t36 0 36 0"
            fill="none"
            stroke="var(--glass-solid)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Snowy hills */}
          <path
            d="M655 340Q760 210 875 340Z"
            fill="var(--scene-snow-shade)"
          />
          <path
            d="M685 330Q760 225 845 330Q795 298 760 308Q720 296 685 330Z"
            fill="var(--scene-snow)"
          />
          {/* Starry mountain peak */}
          <path
            d="M735 162Q840 36 945 162Z"
            fill="var(--scene-peak)"
            opacity="0.85"
          />
          <circle cx="790" cy="76" r="4" fill="var(--scene-star-gold)" />
          <circle cx="888" cy="72" r="5" fill="var(--scene-star-gold)" />
          <circle cx="852" cy="50" r="3.5" fill="var(--scene-star-gold)" />
          {/* Winding adventure trail connecting the 6 regions */}
          <path
            d="M140 414C220 405 265 360 350 325C295 270 235 225 250 146C345 115 445 170 560 146C675 130 705 245 760 302C815 265 845 190 840 112"
            fill="none"
            stroke="var(--scene-trail)"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M140 414C220 405 265 360 350 325"
            fill="none"
            stroke="var(--scene-trail-dash)"
            strokeWidth="4.5"
            strokeDasharray="10 14"
            strokeLinecap="round"
            opacity={states.pond === "open" ? 0.95 : 0.45}
          />
          <path
            d="M350 325C295 270 235 225 250 146C345 115 445 170 560 146C675 130 705 245 760 302C815 265 845 190 840 112"
            fill="none"
            stroke="var(--scene-trail-dash)"
            strokeWidth="4.5"
            strokeDasharray="10 14"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
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
