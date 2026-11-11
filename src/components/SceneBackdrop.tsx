import { cn } from "../styles";
// Drawn backdrops for regions that have no painted background yet. Vector shapes go through the shared
// watercolor filter (PaintFilters.tsx) and sit under a paper and light layer; animated details stay outside
// the filter so the browser does not re-filter every frame. The canvas is 1600×900, cropped never stretched,
// so every screen from 4:3 to 21:9 stays filled. Painted art will replace these (docs/ARTWORK_HANDOFF.md).
export const drawnVariants = [
  "garden",
  "pond",
  "forest",
  "beach",
  "snow",
  "stars",
];

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
// Small round bush used on hills and banks.
function Bush({
  x,
  y,
  s,
  fill = "#86b06c",
}: {
  x: number;
  y: number;
  s: number;
  fill?: string;
}) {
  return (
    <g>
      <circle cx={x - 26 * s} cy={y} r={26 * s} fill={fill} />
      <circle cx={x + 24 * s} cy={y + 2 * s} r={24 * s} fill={fill} />
      <circle cx={x} cy={y - 16 * s} r={30 * s} fill={fill} />
      <circle
        cx={x - 6 * s}
        cy={y - 24 * s}
        r={14 * s}
        fill="#b4d491"
        opacity="0.6"
      />
    </g>
  );
}
function Tufts({
  seed,
  area,
  count,
}: {
  seed: number;
  area: [number, number, number, number];
  count: number;
}) {
  return (
    <>
      {scatter(count, seed, area).map((p, i) => (
        <path
          key={i}
          d={`M${p.x} ${p.y} q-8 -18 -18 -22 M${p.x} ${p.y} q8 -20 18 -24 M${p.x} ${p.y} q0 -22 2 -30`}
          stroke={i % 3 ? "#7fae63" : "#96c078"}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </>
  );
}
function GardenScene({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-garden-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9e4ee" />
          <stop offset="0.6" stopColor="#eaf2dc" />
          <stop offset="1" stopColor="#f8efcf" />
        </linearGradient>
        <linearGradient id="bd-garden-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe2a2" />
          <stop offset="1" stopColor="#a5c67e" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-garden-sky)"
        />
        {[
          [180, 170, 1],
          [760, 120, 0.8],
          [1380, 210, 0.9],
        ].map(([x, y, s], i) => (
          <path
            key={i}
            d={`M${x} ${y} q${40 * s} ${-50 * s} ${90 * s} ${-10 * s} q${50 * s} ${-30 * s} ${90 * s} ${10 * s} q${40 * s} 0 ${30 * s} ${30 * s}H${x - 20 * s}q${-20 * s} ${-20 * s} ${20 * s} ${-30 * s}Z`}
            fill="#ffffff"
            opacity="0.75"
          />
        ))}
        <path
          d="M-80 500 Q200 380 520 450 T1100 420 T1680 450 V980 H-80Z"
          fill="#b7d3a0"
        />
        {[
          [120, 470, 1],
          [420, 440, 0.8],
          [900, 425, 0.9],
          [1250, 430, 1.1],
          [1520, 450, 0.9],
        ].map(([x, y, s], i) => (
          <Bush key={i} x={x} y={y} s={s} fill="#9fc189" />
        ))}
        <path
          d="M-80 590 Q400 480 900 545 T1680 525 V980 H-80Z"
          fill="#c4dc9b"
        />
        {[...Array(26)].map((_, i) => (
          <g key={"f" + i}>
            <rect
              x={-60 + i * 68}
              y={520 - Math.sin(i / 4) * 22}
              width="12"
              height="54"
              rx="5"
              fill="#f3e6c8"
            />
          </g>
        ))}
        <path
          d="M-80 548 Q400 470 900 520 T1680 500"
          fill="none"
          stroke="#f3e6c8"
          strokeWidth="9"
          opacity="0.9"
        />
        <path
          d="M-80 660 Q500 590 1000 640 T1680 630 V980 H-80Z"
          fill="url(#bd-garden-grass)"
        />
        <path
          d="M1230 590 Q1040 680 930 770 T800 980"
          fill="none"
          stroke="#e9d5a8"
          strokeWidth="96"
          strokeLinecap="round"
        />
        <path
          d="M1230 590 Q1040 680 930 770 T800 980"
          fill="none"
          stroke="#f6e7c4"
          strokeWidth="40"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Bush x={1560} y={720} s={1.5} />
        <Bush x={30} y={880} s={1.3} />
        <Tufts seed={3} area={[0, 690, 1600, 890]} count={30} />
        {scatter(24, 13, [40, 700, 1560, 885]).map((p, i) => (
          <g key={"fl" + i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={7 + p.r}
              fill={["#f3d27a", "#f3b7a8", "#ffffff"][i % 3]}
            />
            <circle cx={p.x} cy={p.y} r="3" fill="#e9a23f" />
          </g>
        ))}
      </g>
      {night && <Night dots={false} />}
      <Paper />
    </>
  );
}
function PondScene({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-pond-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6e4" />
          <stop offset="1" stopColor="#f3f0d2" />
        </linearGradient>
        <linearGradient id="bd-pond-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd0d4" />
          <stop offset="1" stopColor="#6fb0bd" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-pond-sky)"
        />
        <path
          d="M-80 470 Q300 370 700 430 T1680 410 V980 H-80Z"
          fill="#b5d2a2"
        />
        {[
          [260, 430, 1.1],
          [640, 420, 0.9],
          [1040, 410, 1],
          [1420, 420, 1.2],
        ].map(([x, y, s], i) => (
          <Bush key={i} x={x} y={y} s={s} fill="#9cbf8a" />
        ))}
        <path
          d="M-80 560 Q500 480 1000 530 T1680 520 V980 H-80Z"
          fill="#bfd998"
        />
        <path
          d="M-80 600 Q200 500 520 540 Q720 570 700 700 Q660 870 300 910 L-80 930Z"
          fill="#e3d6a6"
        />
        <path
          d="M-80 620 Q200 525 510 562 Q690 590 672 700 Q640 850 300 888 L-80 905Z"
          fill="url(#bd-pond-water)"
        />
        <ellipse cx="1240" cy="700" rx="250" ry="78" fill="#e3d6a6" />
        <ellipse
          cx="1240"
          cy="700"
          rx="230"
          ry="64"
          fill="url(#bd-pond-water)"
        />
        {[
          [120, 720, 44],
          [330, 800, 38],
          [470, 660, 34],
          [1150, 705, 30],
          [1330, 690, 36],
        ].map(([x, y, r], i) => (
          <g key={"pad" + i}>
            <path
              d={`M${x} ${y} l${r} ${-r * 0.2} a${r} ${r * 0.5} 0 1 1 ${-r * 0.3} ${-r * 0.3}Z`}
              fill="#7fb06a"
            />
            {i % 2 === 0 && (
              <circle
                cx={x - r * 0.3}
                cy={y - r * 0.1}
                r={r * 0.28}
                fill="#f4b9c4"
              />
            )}
          </g>
        ))}
        {scatter(16, 23, [560, 560, 760, 720]).map((p, i) => (
          <g key={"reed" + i}>
            <path
              d={`M${p.x} ${p.y} q-6 -60 4 -110`}
              stroke="#6f9d5d"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx={p.x + 4}
              cy={p.y - 118}
              rx="6"
              ry="16"
              fill="#8a6a4f"
            />
          </g>
        ))}
        <path
          d="M-80 900 Q600 850 1000 880 T1680 860 V980 H-80Z"
          fill="#a9c784"
        />
        <Oak x={1560} y={640} s={1.2} />
        <Tufts seed={31} area={[760, 790, 1600, 885]} count={16} />
      </g>
      <g>
        {[
          [200, 760],
          [420, 720],
          [1240, 700],
        ].map(([x, y], i) => (
          <ellipse
            key={i}
            className={cn("pulse")}
            style={{ animationDelay: `${-i}s` }}
            cx={x}
            cy={y}
            rx="70"
            ry="16"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="0.7"
          />
        ))}
      </g>
      {night && <Night />}
      <Paper />
    </>
  );
}
// The valley map: six lands along one winding trail. Region buttons sit on these landmarks (see ValleyMap.tsx).
export function ValleyBackdrop({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="vm-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd795" />
          <stop offset="1" stopColor="#9cc079" />
        </linearGradient>
        <linearGradient id="vm-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb1c8" />
          <stop offset="1" stopColor="#a9dde0" />
        </linearGradient>
        <linearGradient id="vm-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141d45" />
          <stop offset="1" stopColor="#5b4f8c" />
        </linearGradient>
      </defs>
      <g filter="url(#lw-paint-scene)">
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#vm-grass)"
        />
        {/* Sea and beach, top middle */}
        <path
          d="M560 -80 H1130 Q1120 150 980 200 Q820 240 680 170 Q590 110 560 -80Z"
          fill="#ecd9a2"
        />
        <path
          d="M600 -80 H1090 Q1080 110 960 150 Q830 180 720 125 Q640 80 600 -80Z"
          fill="url(#vm-sea)"
        />
        {[40, 80].map((y) => (
          <path
            key={y}
            d={`M660 ${y} q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            opacity="0.7"
          />
        ))}
        {/* Starry mountain, top right */}
        <path
          d="M1130 -80 H1680 V400 Q1520 350 1400 280 Q1230 190 1130 -80Z"
          fill="url(#vm-night)"
        />
        <path
          d="M1240 300 L1400 90 L1540 260 L1680 150 V400 Q1500 350 1400 280Z"
          fill="#39447a"
        />
        <path
          d="M1400 90 L1370 132 L1404 124 L1430 142Z"
          fill="#ffffff"
          opacity="0.85"
        />
        {scatter(34, 21, [1180, -40, 1600, 240]).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#fff6d2" />
        ))}
        <circle cx="1520" cy="70" r="34" fill="#fff1b8" />
        {/* Snowy hill, right */}
        <path
          d="M980 420 Q1100 300 1300 330 Q1560 360 1680 440 V760 Q1400 720 1180 640 Q1000 560 980 420Z"
          fill="#f6f9fd"
        />
        <path
          d="M1040 470 Q1200 400 1400 440"
          fill="none"
          stroke="#dbe6f3"
          strokeWidth="18"
        />
        {[
          [1040, 520, 0.6],
          [1380, 470, 0.7],
          [1500, 600, 0.9],
          [1290, 640, 0.6],
          [1600, 520, 0.7],
        ].map(([x, y, s], i) => (
          <Fir key={i} x={x} y={y} s={s} fill="#6f9a8a" snow />
        ))}
        {/* Forest, top left */}
        {[
          [80, 200, 1.1],
          [170, 300, 1],
          [250, 140, 0.9],
          [470, 190, 1],
          [520, 320, 1.1],
          [60, 380, 1.2],
          [420, 90, 0.8],
          [230, 400, 0.9],
          [330, 70, 0.8],
        ].map(([x, y, s], i) => (
          <Fir
            key={i}
            x={x}
            y={y}
            s={s}
            fill={i % 2 ? "#6f9a62" : "#5f8a55"}
            light="#9cc283"
          />
        ))}
        {/* River from the snow down to the pond and out of the valley */}
        <path
          d="M1160 660 Q1000 640 900 700 Q820 760 860 980"
          fill="none"
          stroke="#e3d6a6"
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d="M1160 660 Q1000 640 900 700 Q820 760 860 980"
          fill="none"
          stroke="#8fc6d2"
          strokeWidth="48"
          strokeLinecap="round"
        />
        {/* Pond */}
        <ellipse cx="640" cy="640" rx="190" ry="100" fill="#e3d6a6" />
        <ellipse cx="640" cy="640" rx="170" ry="84" fill="#8fc6d2" />
        {[
          [540, 620],
          [730, 670],
          [700, 600],
          [570, 680],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="24" ry="12" fill="#7fb06a" />
            {i % 2 === 0 && <circle cx={x} cy={y - 4} r="8" fill="#f4b9c4" />}
          </g>
        ))}
        {/* Trail through the six lands */}
        <path
          d="M224 700 Q420 760 600 720 M560 560 Q420 440 380 320 M440 230 Q620 260 800 250 M940 250 Q1080 330 1140 420 M1260 400 Q1330 320 1340 250"
          fill="none"
          stroke="#f1e2b8"
          strokeWidth="26"
          strokeLinecap="round"
          strokeDasharray="6 44"
        />
        {/* Home garden, bottom left */}
        <g>
          <path d="M70 700 v-70 l66 -52 l66 52 v70Z" fill="#efcf9d" />
          <path
            d="M56 634 l80 -64 l80 64"
            fill="none"
            stroke="#bc7f70"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M122 700 v-34 q14 -16 28 0 v34" fill="#9fbcae" />
        </g>
        {[...Array(9)].map((_, i) => (
          <rect
            key={i}
            x={30 + i * 44}
            y={730}
            width="10"
            height="40"
            rx="4"
            fill="#f3e6c8"
          />
        ))}
        <path d="M30 748 H392" stroke="#f3e6c8" strokeWidth="8" />
        {scatter(26, 5, [30, 780, 520, 890]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6 + p.r}
            fill={["#f3d27a", "#f3b7a8", "#ffffff"][i % 3]}
          />
        ))}
        {[
          [980, 820, 1.2],
          [1300, 840, 1],
          [520, 480, 0.9],
          [760, 420, 1],
          [1500, 800, 1.3],
        ].map(([x, y, s], i) => (
          <Bush key={i} x={x} y={y} s={s} />
        ))}
        <Tufts seed={77} area={[560, 760, 1600, 890]} count={26} />
        {/* Little bridge over the river */}
        <path
          d="M800 740 q50 -40 110 -10"
          fill="none"
          stroke="#a9805d"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M800 728 q50 -40 110 -10"
          fill="none"
          stroke="#c9a37d"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <Paper />
    </svg>
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
      {variant === "garden" && <GardenScene night={night} />}
      {variant === "pond" && <PondScene night={night} />}
      {variant === "forest" && <Forest night={night} />}
      {variant === "beach" && <Beach night={night} />}
      {variant === "snow" && <Snow night={night} />}
      {variant === "stars" && <Stars />}
    </svg>
  );
}
