import { cn } from "../styles";
// Drawn backdrops for regions that have no painted background yet. They are temporary vectors in the
// storybook palette and will be replaced by painted art (see docs/ARTWORK_HANDOFF.md). The canvas is
// 1600×900 and is cropped, never stretched, so every screen from 4:3 to 21:9 stays filled.
export const drawnVariants = ["forest", "beach", "snow", "stars"];

// Deterministic pseudo-random points so the scene looks the same on every render and in tests.
function scatter(
  count: number,
  seed: number,
  area: [number, number, number, number],
) {
  const [x0, y0, x1, y1] = area;
  const out: { x: number; y: number; r: number }[] = [];
  for (let i = 0; i < count; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const a = seed / 4294967296;
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const b = seed / 4294967296;
    out.push({
      x: x0 + a * (x1 - x0),
      y: y0 + b * (y1 - y0),
      r: 1.2 + ((a * 7 + b * 3) % 1) * 2.4,
    });
  }
  return out;
}
// A rounded storybook fir: stacked soft triangles.
function Fir({
  x,
  y,
  s,
  fill,
  snow,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
  snow?: boolean;
}) {
  const tiers = [0, 1, 2].map((i) => {
    const w = (70 - i * 16) * s;
    const top = y - (60 + i * 46) * s;
    const base = y - i * 40 * s;
    return `M${x - w} ${base} Q${x} ${top - 12 * s} ${x + w} ${base} Z`;
  });
  return (
    <g>
      <rect
        x={x - 7 * s}
        y={y - 6 * s}
        width={14 * s}
        height={26 * s}
        rx={4 * s}
        fill="#8a6a4f"
      />
      {tiers.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}
      {snow &&
        tiers.map((_, i) => (
          <path
            key={"s" + i}
            d={`M${x - (40 - i * 10) * s} ${y - (52 + i * 40) * s} Q${x} ${y - (78 + i * 46) * s} ${x + (40 - i * 10) * s} ${y - (52 + i * 40) * s}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={9 * s}
            strokeLinecap="round"
          />
        ))}
    </g>
  );
}
function Night({ dots = true }: { dots?: boolean }) {
  return (
    <g className={cn("backdrop-night")}>
      <rect width="1600" height="900" fill="#1c2546" opacity="0.5" />
      {dots &&
        scatter(60, 7, [0, 0, 1600, 380]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#fff8d6"
            opacity="0.85"
          />
        ))}
    </g>
  );
}
function Forest({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-forest-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcebdc" />
          <stop offset="1" stopColor="#f4eed0" />
        </linearGradient>
        <linearGradient id="bd-forest-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6dc9c" />
          <stop offset="1" stopColor="#a9c784" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bd-forest-sky)" />
      <circle cx="1180" cy="170" r="150" fill="#fff4c4" opacity="0.6" />
      <path
        d="M0 470 Q260 360 520 430 T1040 410 T1600 420 V900 H0Z"
        fill="#b5cf9a"
      />
      {[...Array(18)].map((_, i) => (
        <Fir
          key={"far" + i}
          x={-40 + i * 96}
          y={520 + (i % 3) * 12}
          s={0.85}
          fill="#8fb27e"
        />
      ))}
      <path
        d="M0 560 Q400 500 800 540 T1600 530 V900 H0Z"
        fill="url(#bd-forest-ground)"
      />
      {[
        [60, 640, 1.5],
        [250, 610, 1.15],
        [1380, 620, 1.35],
        [1560, 650, 1.6],
        [1180, 600, 1.0],
      ].map(([x, y, s], i) => (
        <Fir key={"near" + i} x={x} y={y} s={s} fill="#6f9a62" />
      ))}
      <path
        d="M760 900 Q820 760 760 640 Q720 580 800 540"
        fill="none"
        stroke="#e8d6ae"
        strokeWidth="70"
        strokeLinecap="round"
        opacity="0.85"
      />
      {scatter(26, 3, [0, 640, 1600, 880]).map((p, i) => (
        <path
          key={"fern" + i}
          d={`M${p.x} ${p.y} q-12 -22 -26 -26 M${p.x} ${p.y} q12 -24 26 -28 M${p.x} ${p.y} q0 -26 2 -36`}
          stroke="#7aa765"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {night && <Night />}
    </>
  );
}
function Beach({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-beach-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cde8f2" />
          <stop offset="1" stopColor="#f7efd6" />
        </linearGradient>
        <linearGradient id="bd-beach-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fc4d5" />
          <stop offset="1" stopColor="#aedfe6" />
        </linearGradient>
        <linearGradient id="bd-beach-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dfaa" />
          <stop offset="1" stopColor="#e8c98d" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bd-beach-sky)" />
      <circle cx="1240" cy="190" r="170" fill="#fff3c2" opacity="0.55" />
      <path
        d="M980 400 q90 -60 180 0 q90 -50 170 0 Z"
        fill="#ffffff"
        opacity="0.7"
      />
      <rect y="400" width="1600" height="220" fill="url(#bd-beach-sea)" />
      {[440, 480, 525, 570].map((y, i) => (
        <path
          key={y}
          d={`M${-60 + i * 40} ${y} q40 -14 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity={0.55 - i * 0.08}
        />
      ))}
      <path
        d="M0 600 Q200 570 420 600 T860 595 T1300 600 T1600 590 V900 H0Z"
        fill="#fdf8ea"
        opacity="0.9"
      />
      <path
        d="M0 625 Q300 600 640 630 T1240 620 T1600 630 V900 H0Z"
        fill="url(#bd-beach-sand)"
      />
      {scatter(40, 11, [0, 680, 1600, 890]).map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r * 1.4}
          fill="#d8b577"
          opacity="0.5"
        />
      ))}
      {night && <Night />}
    </>
  );
}
function Snow({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-snow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6e5f4" />
          <stop offset="1" stopColor="#f5f8fc" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bd-snow-sky)" />
      <path
        d="M0 470 L220 260 L380 400 L560 220 L760 420 L980 250 L1200 430 L1400 280 L1600 420 V900 H0Z"
        fill="#c6d6ea"
      />
      <path
        d="M220 260 L180 300 L230 310 L260 290 Z M560 220 L520 262 L572 270 L600 252 Z M980 250 L940 290 L990 300 L1020 280 Z M1400 280 L1362 316 L1410 326 L1440 306 Z"
        fill="#ffffff"
      />
      {[...Array(14)].map((_, i) => (
        <Fir
          key={"p" + i}
          x={20 + i * 120}
          y={530 + (i % 2) * 14}
          s={0.7}
          fill="#93b1c4"
          snow
        />
      ))}
      <path d="M0 560 Q380 480 820 560 T1600 540 V900 H0Z" fill="#fbfdff" />
      <path d="M0 690 Q420 630 900 700 T1600 680 V900 H0Z" fill="#eef4fb" />
      <path d="M200 900 Q520 740 980 900" fill="#e1eaf5" />
      {[
        [70, 690, 1.35],
        [1500, 700, 1.5],
        [1300, 650, 1.0],
      ].map(([x, y, s], i) => (
        <Fir key={"n" + i} x={x} y={y} s={s} fill="#6f9a8a" snow />
      ))}
      <g className={cn("backdrop-snowfall")}>
        {scatter(70, 5, [0, 0, 1600, 900]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r * 1.6}
            fill="#ffffff"
            opacity="0.85"
          />
        ))}
      </g>
      {night && <Night />}
    </>
  );
}
function Stars() {
  return (
    <>
      <defs>
        <linearGradient id="bd-stars-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2550" />
          <stop offset="0.6" stopColor="#3b3f78" />
          <stop offset="1" stopColor="#6a5a92" />
        </linearGradient>
        <radialGradient id="bd-stars-band" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cdbff2" stopOpacity="0.45" />
          <stop offset="1" stopColor="#cdbff2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bd-stars-sky)" />
      <ellipse
        cx="800"
        cy="260"
        rx="900"
        ry="120"
        fill="url(#bd-stars-band)"
        transform="rotate(-12 800 260)"
      />
      <g className={cn("backdrop-twinkle")}>
        {scatter(140, 21, [0, 0, 1600, 620]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#fff6d2"
            opacity={0.5 + (i % 5) * 0.1}
          />
        ))}
      </g>
      <path
        d="M0 640 L260 470 L420 560 L640 420 L860 560 L1080 450 L1300 580 L1600 470 V900 H0Z"
        fill="#323b6a"
      />
      <path
        d="M0 720 Q300 640 640 700 Q760 720 860 660 Q980 600 1120 690 T1600 680 V900 H0Z"
        fill="#283158"
      />
      <path d="M560 900 Q700 700 820 690 Q980 690 1060 900Z" fill="#3b4677" />
      {scatter(8, 9, [100, 760, 1500, 870]).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={6} fill="#ffe08a" opacity="0.8" />
      ))}
    </>
  );
}
export function SceneBackdrop({
  variant,
  night,
}: {
  variant: string;
  night: boolean;
}) {
  return (
    <svg
      className={cn("scene-backdrop")}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {variant === "forest" && <Forest night={night} />}
      {variant === "beach" && <Beach night={night} />}
      {variant === "snow" && <Snow night={night} />}
      {variant === "stars" && <Stars />}
    </svg>
  );
}
