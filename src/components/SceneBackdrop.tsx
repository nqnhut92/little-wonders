import { cn } from "../styles";
// Drawn backdrops for regions that have no painted background yet. Vector shapes go through the shared
// watercolor filter (PaintFilters.tsx) and sit under a paper and light layer; animated details stay outside
// the filter so the browser does not re-filter every frame. The canvas is 1600×900, cropped never stretched,
// so every screen from 4:3 to 21:9 stays filled. Painted art will replace these (docs/ARTWORK_HANDOFF.md).
export const drawnVariants = ["forest", "beach", "snow", "stars"];

// Deterministic pseudo-random points so the scene is the same on every render and in tests.
function scatter(
  count: number,
  seed: number,
  area: [number, number, number, number],
) {
  const [x0, y0, x1, y1] = area;
  const out: { x: number; y: number; r: number; t: number }[] = [];
  for (let i = 0; i < count; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const a = seed / 4294967296;
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const b = seed / 4294967296;
    out.push({
      x: x0 + a * (x1 - x0),
      y: y0 + b * (y1 - y0),
      r: 1.2 + ((a * 7 + b * 3) % 1) * 2.4,
      t: (a + b) % 1,
    });
  }
  return out;
}
// A rounded storybook fir: stacked soft tiers with a lit side.
function Fir({
  x,
  y,
  s,
  fill,
  light,
  snow,
}: {
  x: number;
  y: number;
  s: number;
  fill: string;
  light?: string;
  snow?: boolean;
}) {
  const tiers = [0, 1, 2].map((i) => {
    const w = (70 - i * 16) * s;
    const top = y - (60 + i * 46) * s;
    const base = y - i * 40 * s;
    return {
      w,
      top,
      base,
      d: `M${x - w} ${base} Q${x} ${top - 12 * s} ${x + w} ${base} Z`,
    };
  });
  return (
    <g>
      <rect
        x={x - 7 * s}
        y={y - 6 * s}
        width={14 * s}
        height={26 * s}
        rx={4 * s}
        fill="#7d5d45"
      />
      {tiers.map((t, i) => (
        <g key={i}>
          <path d={t.d} fill={fill} />
          {light && (
            <path
              d={`M${x} ${t.base} Q${x + t.w * 0.2} ${t.top + 10 * s} ${x + t.w} ${t.base} Z`}
              fill={light}
              opacity="0.55"
            />
          )}
        </g>
      ))}
      {snow &&
        tiers.map((t, i) => (
          <path
            key={"s" + i}
            d={`M${x - t.w * 0.62} ${t.base - 14 * s} Q${x} ${t.top + 6 * s} ${x + t.w * 0.62} ${t.base - 14 * s}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={10 * s}
            strokeLinecap="round"
          />
        ))}
    </g>
  );
}
// Leafy round tree for the near forest.
function Oak({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <path
        d={`M${x - 10 * s} ${y} q4 ${-70 * s} ${-2 * s} ${-120 * s} h${24 * s} q-6 ${50 * s} ${-2 * s} ${120 * s}Z`}
        fill="#7a5b43"
      />
      {[
        [-50, -150, 62],
        [30, -170, 70],
        [-10, -210, 66],
        [60, -130, 50],
        [-70, -110, 44],
      ].map(([dx, dy, r], i) => (
        <circle
          key={i}
          cx={x + dx * s}
          cy={y + dy * s}
          r={r * s}
          fill={i % 2 ? "#6f9a5c" : "#7fab68"}
        />
      ))}
      {[
        [-30, -190, 30],
        [44, -190, 26],
      ].map(([dx, dy, r], i) => (
        <circle
          key={"h" + i}
          cx={x + dx * s}
          cy={y + dy * s}
          r={r * s}
          fill="#a9cf86"
          opacity="0.6"
        />
      ))}
    </g>
  );
}
function Night({ dots = true }: { dots?: boolean }) {
  return (
    <g className={cn("backdrop-night")}>
      <rect width="1600" height="900" fill="#1b2448" opacity="0.52" />
      {dots &&
        scatter(70, 7, [0, 0, 1600, 380]).map((p, i) => (
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
// Paper grain and a soft vignette, shared by every drawn scene.
function Paper() {
  return (
    <>
      <defs>
        <radialGradient id="bd-vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#3b2f1f" stopOpacity="0" />
          <stop offset="1" stopColor="#3b2f1f" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bd-vignette)" />
    </>
  );
}
function Forest({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-forest-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4e6d2" />
          <stop offset="0.55" stopColor="#eef0cf" />
          <stop offset="1" stopColor="#f6e7bd" />
        </linearGradient>
        <linearGradient id="bd-forest-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfd896" />
          <stop offset="1" stopColor="#97ba72" />
        </linearGradient>
        <linearGradient id="bd-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-forest-sky)"
        />

        <path
          d="M0 450 Q260 340 520 410 T1040 390 T1600 400 V980 H-80Z"
          fill="#b8d1a2"
        />
        {[...Array(20)].map((_, i) => (
          <Fir
            key={"far" + i}
            x={-40 + i * 86}
            y={500 + (i % 3) * 14}
            s={0.75}
            fill="#9dbb8c"
          />
        ))}
        <path d="M0 520 Q320 470 700 505 T1600 490 V980 H-80Z" fill="#a9c78d" />
        {[...Array(13)].map((_, i) => (
          <Fir
            key={"mid" + i}
            x={20 + i * 130}
            y={560 + (i % 2) * 18}
            s={1.0}
            fill="#7da36c"
            light="#a6c889"
          />
        ))}
        <path
          d="M0 575 Q400 525 800 560 T1600 550 V980 H-80Z"
          fill="url(#bd-forest-ground)"
        />
        <path
          d="M760 900 Q830 770 770 655 Q735 590 800 548"
          fill="none"
          stroke="#ead7ad"
          strokeWidth="78"
          strokeLinecap="round"
        />
        <path
          d="M760 900 Q830 770 770 655 Q735 590 800 548"
          fill="none"
          stroke="#f6e6c2"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Oak x={90} y={760} s={1.35} />
        <Oak x={1520} y={780} s={1.5} />
        <Fir x={300} y={700} s={1.25} fill="#6a955c" light="#9cc283" />
        <Fir x={1300} y={690} s={1.15} fill="#6a955c" light="#9cc283" />
        {scatter(34, 3, [0, 650, 1600, 885]).map((p, i) => (
          <path
            key={"fern" + i}
            d={`M${p.x} ${p.y} q-14 -24 -30 -28 M${p.x} ${p.y} q14 -26 30 -30 M${p.x} ${p.y} q0 -30 2 -40`}
            stroke={i % 3 ? "#6f9d5d" : "#86b26e"}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        ))}
        {scatter(18, 13, [100, 700, 1500, 880]).map((p, i) => (
          <circle
            key={"flower" + i}
            cx={p.x}
            cy={p.y}
            r={5 + p.r}
            fill={i % 2 ? "#f3d27a" : "#f3b7a8"}
          />
        ))}
      </g>
      {!night && (
        <g className={cn("backdrop-shafts")} style={{ mixBlendMode: "screen" }}>
          {[
            [980, 0, 1180, 0, 860, 900, 620, 900],
            [1240, 0, 1340, 0, 1120, 900, 960, 900],
            [1420, 0, 1480, 0, 1360, 900, 1260, 900],
          ].map((pts, i) => (
            <polygon
              key={i}
              points={pts.join(" ")}
              fill="url(#bd-shaft)"
              opacity={0.42 - i * 0.08}
            />
          ))}
        </g>
      )}
      <g className={cn("backdrop-leaves")}>
        {scatter(9, 17, [120, -40, 1500, 300]).map((p, i) => (
          <ellipse
            key={i}
            className={cn("drift")}
            style={{
              animationDelay: `${-p.t * 12}s`,
              animationDuration: `${10 + (i % 4) * 2}s`,
            }}
            cx={p.x}
            cy={p.y}
            rx="12"
            ry="6"
            fill={i % 3 ? "#e3a24f" : "#c9703f"}
            opacity="0.85"
          />
        ))}
      </g>
      {night && <Night />}
      {night && (
        <g filter="url(#lw-glow)">
          {scatter(16, 29, [100, 420, 1500, 820]).map((p, i) => (
            <circle
              key={i}
              className={cn("pulse")}
              style={{ animationDelay: `${-p.t * 3}s` }}
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#e9ff9a"
            />
          ))}
        </g>
      )}
      <Paper />
    </>
  );
}
function Beach({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-beach-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe2f0" />
          <stop offset="0.7" stopColor="#e8f1e6" />
          <stop offset="1" stopColor="#fbefd2" />
        </linearGradient>
        <linearGradient id="bd-beach-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb1c8" />
          <stop offset="0.6" stopColor="#86cbd6" />
          <stop offset="1" stopColor="#b7e3e2" />
        </linearGradient>
        <linearGradient id="bd-beach-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1dba4" />
          <stop offset="1" stopColor="#e4c286" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-beach-sky)"
        />

        {[
          [260, 150, 1],
          [700, 110, 0.8],
          [1450, 260, 0.9],
        ].map(([x, y, s], i) => (
          <path
            key={i}
            d={`M${x} ${y} q${40 * s} ${-50 * s} ${90 * s} ${-10 * s} q${50 * s} ${-30 * s} ${90 * s} ${10 * s} q${40 * s} 0 ${30 * s} ${30 * s}H${x - 20 * s}q${-20 * s} ${-20 * s} ${20 * s} ${-30 * s}Z`}
            fill="#ffffff"
            opacity="0.8"
          />
        ))}
        <path
          d="M1080 410 q70 -70 150 -20 q60 -30 110 20Z"
          fill="#8fb58c"
          opacity="0.7"
        />
        <rect y="405" width="1600" height="225" fill="url(#bd-beach-sea)" />
        {scatter(40, 31, [0, 420, 1600, 600]).map((p, i) => (
          <path
            key={"sp" + i}
            d={`M${p.x} ${p.y}h${10 + p.r * 6}`}
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.35 + p.t * 0.4}
          />
        ))}
        <path
          d="M0 610 Q200 585 420 610 T860 605 T1300 610 T1600 600 V980 H-80Z"
          fill="#c9d9c8"
          opacity="0.9"
        />
        <path
          d="M0 628 Q300 605 640 632 T1240 622 T1600 632 V980 H-80Z"
          fill="url(#bd-beach-sand)"
        />
        <path
          d="M0 645 Q300 625 640 650 T1240 640 T1600 650 V690 Q900 660 0 690Z"
          fill="#d8b678"
          opacity="0.45"
        />
        {scatter(55, 11, [0, 690, 1600, 890]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r * 1.5}
            fill={i % 4 ? "#d7b273" : "#f7ead0"}
            opacity="0.6"
          />
        ))}
        {[
          [1460, 820],
          [180, 840],
          [1230, 760],
        ].map(([x, y], i) => (
          <path
            key={"st" + i}
            d={`M${x} ${y - 16}l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z`}
            fill="#f2a46f"
          />
        ))}
      </g>
      <g className={cn("backdrop-waves")}>
        {[452, 500, 548, 596].map((y, i) => (
          <path
            key={y}
            className={cn("slide")}
            style={{ animationDelay: `${-i * 1.6}s` }}
            d={`M-200 ${y} ${Array.from({ length: 24 }, () => "q40 -14 80 0 t80 0").join(" ")}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity={0.6 - i * 0.1}
          />
        ))}
        <path
          className={cn("foam")}
          d="M-100 620 Q200 598 420 620 T860 615 T1300 620 T1800 610"
          fill="none"
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>
      {night && <Night />}
      <Paper />
    </>
  );
}
function Snow({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-snow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9dcf0" />
          <stop offset="0.7" stopColor="#eef4fb" />
          <stop offset="1" stopColor="#fbf6ee" />
        </linearGradient>
        <linearGradient id="bd-snow-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7c9e2" />
          <stop offset="1" stopColor="#d6e2f0" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-snow-sky)"
        />

        <path
          d="M0 470 L220 250 L380 400 L560 200 L760 420 L980 240 L1200 430 L1400 270 L1600 420 V980 H-80Z"
          fill="url(#bd-snow-mtn)"
        />
        <path
          d="M220 250 L160 312 L210 300 L240 322 L280 290 Z M560 200 L500 262 L548 254 L580 276 L620 244 Z M980 240 L920 302 L968 292 L1000 314 L1040 282 Z M1400 270 L1344 324 L1390 316 L1420 336 L1456 306 Z"
          fill="#ffffff"
        />
        {[...Array(15)].map((_, i) => (
          <Fir
            key={"p" + i}
            x={10 + i * 112}
            y={530 + (i % 2) * 14}
            s={0.66}
            fill="#8eabc0"
            snow
          />
        ))}
        <path d="M0 560 Q380 480 820 560 T1600 540 V980 H-80Z" fill="#fbfdff" />
        <g>
          <path d="M1060 560 v-60 l60 -46 l60 46 v60Z" fill="#c98c64" />
          <path
            d="M1050 504 l70 -56 l70 56"
            fill="none"
            stroke="#ffffff"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <rect x="1100" y="516" width="34" height="30" rx="4" fill="#ffd37a" />
          <path d="M1160 470 v-40 h18 v40" fill="#9b6a50" />
        </g>
        <path d="M0 690 Q420 630 900 700 T1600 680 V980 H-80Z" fill="#eef4fb" />
        <path d="M200 900 Q520 740 980 900" fill="#e0e9f4" />
        {[
          [70, 690, 1.35],
          [1500, 700, 1.5],
          [1300, 650, 1.0],
          [360, 640, 0.9],
        ].map(([x, y, s], i) => (
          <Fir
            key={"n" + i}
            x={x}
            y={y}
            s={s}
            fill="#5f8e7d"
            light="#8fb8a4"
            snow
          />
        ))}
      </g>
      <g className={cn("backdrop-smoke")}>
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            className={cn("rise")}
            style={{ animationDelay: `${-i * 1.4}s` }}
            cx="1169"
            cy="420"
            r={12 + i * 4}
            fill="#ffffff"
            opacity="0.7"
          />
        ))}
      </g>
      <g className={cn("backdrop-sparkle")}>
        {scatter(14, 41, [100, 580, 1500, 860]).map((p, i) => (
          <path
            key={i}
            className={cn("twinkle")}
            style={{ animationDelay: `${-p.t * 3}s` }}
            d={`M${p.x} ${p.y - 9}l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z`}
            fill="#ffffff"
          />
        ))}
      </g>
      <g className={cn("backdrop-snowfall")}>
        {/* Drawn twice, 900 units apart, so the fall loops without a jump. */}
        {[0, -900].flatMap((dy) =>
          scatter(36, 5, [0, 0, 1600, 900]).map((p, i) => (
            <circle
              key={dy + "-" + i}
              cx={p.x}
              cy={p.y + dy}
              r={p.r * 1.5}
              fill="#ffffff"
              opacity="0.9"
            />
          )),
        )}
      </g>
      <g className={cn("backdrop-snowfall slow")}>
        {[0, -900].flatMap((dy) =>
          scatter(22, 55, [0, 0, 1600, 900]).map((p, i) => (
            <circle
              key={dy + "-" + i}
              cx={p.x}
              cy={p.y + dy}
              r={p.r * 2.6}
              fill="#ffffff"
              opacity="0.65"
            />
          )),
        )}
      </g>
      {night && <Night />}
      <Paper />
    </>
  );
}
function Stars() {
  return (
    <>
      <defs>
        <linearGradient id="bd-stars-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141d45" />
          <stop offset="0.55" stopColor="#323a76" />
          <stop offset="1" stopColor="#6b5a94" />
        </linearGradient>
        <radialGradient id="bd-stars-band" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cdbff2" stopOpacity="0.5" />
          <stop offset="1" stopColor="#cdbff2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7ef0c4" stopOpacity="0" />
          <stop offset="0.3" stopColor="#7ef0c4" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#b59cf5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#b59cf5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-stars-sky)"
        />
        <ellipse
          cx="800"
          cy="260"
          rx="900"
          ry="130"
          fill="url(#bd-stars-band)"
          transform="rotate(-12 800 260)"
        />
        <path
          d="M0 640 L260 470 L420 560 L640 420 L860 560 L1080 450 L1300 580 L1600 470 V980 H-80Z"
          fill="#2f3866"
        />
        <path
          d="M260 470 L230 500 L270 496 L300 516Z M640 420 L606 456 L650 450 L680 470Z M1080 450 L1050 482 L1090 478 L1120 498Z"
          fill="#8f97c9"
          opacity="0.6"
        />
        <path
          d="M0 720 Q300 640 640 700 Q760 720 860 660 Q980 600 1120 690 T1600 680 V980 H-80Z"
          fill="#252e57"
        />
        <path d="M560 900 Q700 700 820 690 Q980 690 1060 900Z" fill="#39447a" />
        {[
          [180, 760, 1],
          [1420, 770, 1.2],
        ].map(([x, y, s], i) => (
          <Fir key={i} x={x} y={y} s={s} fill="#1f2a4d" />
        ))}
      </g>
      <g className={cn("backdrop-aurora")} filter="url(#lw-soft)">
        <path
          className={cn("sway-slow")}
          d="M-100 230 C200 120 500 300 800 190 S1300 120 1700 220 L1700 300 C1300 200 1000 360 800 280 S300 220 -100 320Z"
          fill="url(#bd-aurora)"
        />
      </g>
      <g>
        {scatter(150, 21, [0, 0, 1600, 640]).map((p, i) => (
          <circle
            key={i}
            className={cn(i % 4 === 0 ? "twinkle" : "")}
            style={i % 4 === 0 ? { animationDelay: `${-p.t * 4}s` } : undefined}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#fff6d2"
            opacity={0.45 + (i % 5) * 0.1}
          />
        ))}
      </g>
      <g filter="url(#lw-glow)">
        {scatter(9, 9, [100, 770, 1500, 870]).map((p, i) => (
          <circle
            key={i}
            className={cn("pulse")}
            style={{ animationDelay: `${-p.t * 3}s` }}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="#ffe08a"
          />
        ))}
      </g>
      <Paper />
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
