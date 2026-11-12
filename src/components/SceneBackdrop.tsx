import { cn } from "../styles";
// Drawn backdrops for every region, in the same flat storybook style as Art: bright flat fills, no
// outlines, no texture filters. The canvas is 1600×900, cropped never stretched, so every screen from
// 4:3 to 21:9 stays filled.
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
        fill="#915a31"
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
        fill="#8d5930"
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
          fill={i % 2 ? "#66b145" : "#78c350"}
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
          fill="#a8e66f"
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
function Forest({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-forest-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ceedcb" />
          <stop offset="0.55" stopColor="#f7fac5" />
          <stop offset="1" stopColor="#ffebb4" />
        </linearGradient>
        <linearGradient id="bd-forest-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4ed81" />
          <stop offset="1" stopColor="#98d25a" />
        </linearGradient>
        <linearGradient id="bd-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff7d6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-forest-sky)"
        />

        <path
          d="M0 450 Q260 340 520 410 T1040 390 T1600 400 V980 H-80Z"
          fill="#b7e192"
        />
        {[...Array(20)].map((_, i) => (
          <Fir
            key={"far" + i}
            x={-40 + i * 86}
            y={500 + (i % 3) * 14}
            s={0.75}
            fill="#98cc7b"
          />
        ))}
        <path d="M0 520 Q320 470 700 505 T1600 490 V980 H-80Z" fill="#a8db79" />
        {[...Array(13)].map((_, i) => (
          <Fir
            key={"mid" + i}
            x={20 + i * 130}
            y={560 + (i % 2) * 18}
            s={1.0}
            fill="#75b857"
            light="#a4dd74"
          />
        ))}
        <path
          d="M0 575 Q400 525 800 560 T1600 550 V980 H-80Z"
          fill="url(#bd-forest-ground)"
        />
        <path
          d="M760 900 Q830 770 770 655 Q735 590 800 548"
          fill="none"
          stroke="#fcde9b"
          strokeWidth="78"
          strokeLinecap="round"
        />
        <path
          d="M760 900 Q830 770 770 655 Q735 590 800 548"
          fill="none"
          stroke="#ffe9b9"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.7"
        />
        <Oak x={90} y={760} s={1.35} />
        <Oak x={1520} y={780} s={1.5} />
        <Fir x={300} y={700} s={1.25} fill="#5faa47" light="#98d76e" />
        <Fir x={1300} y={690} s={1.15} fill="#5faa47" light="#98d76e" />
        {scatter(34, 3, [0, 650, 1600, 885]).map((p, i) => (
          <path
            key={"fern" + i}
            d={`M${p.x} ${p.y} q-14 -24 -30 -28 M${p.x} ${p.y} q14 -26 30 -30 M${p.x} ${p.y} q0 -30 2 -40`}
            stroke={i % 3 ? "#65b545" : "#7fca56"}
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
            fill={i % 2 ? "#ffd76e" : "#ffb09c"}
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
            fill={i % 3 ? "#ffa533" : "#f36415"}
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
    </>
  );
}
function Beach({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-beach-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b0e8ff" />
          <stop offset="0.7" stopColor="#e6f5e2" />
          <stop offset="1" stopColor="#fff1ce" />
        </linearGradient>
        <linearGradient id="bd-beach-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3ec3e9" />
          <stop offset="0.6" stopColor="#6dddef" />
          <stop offset="1" stopColor="#a9f1ef" />
        </linearGradient>
        <linearGradient id="bd-beach-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe196" />
          <stop offset="1" stopColor="#ffc96b" />
        </linearGradient>
      </defs>
      <g>
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
          fill="#81c57c"
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
          fill="#c3e0c1"
          opacity="0.9"
        />
        <path
          d="M0 628 Q300 605 640 632 T1240 622 T1600 632 V980 H-80Z"
          fill="url(#bd-beach-sand)"
        />
        <path
          d="M0 645 Q300 625 640 650 T1240 640 T1600 650 V690 Q900 660 0 690Z"
          fill="#f5bf5b"
          opacity="0.45"
        />
        {scatter(55, 11, [0, 690, 1600, 890]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r * 1.5}
            fill={i % 4 ? "#f5ba55" : "#ffedc8"}
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
            fill="#ffa262"
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
    </>
  );
}
function Snow({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-snow-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bddcfc" />
          <stop offset="0.7" stopColor="#eef4fb" />
          <stop offset="1" stopColor="#fbf6ee" />
        </linearGradient>
        <linearGradient id="bd-snow-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c7f0" />
          <stop offset="1" stopColor="#cee1f8" />
        </linearGradient>
      </defs>
      <g>
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
            fill="#7caed2"
            snow
          />
        ))}
        <path d="M0 560 Q380 480 820 560 T1600 540 V980 H-80Z" fill="#dcebfa" />
        <g>
          <path d="M1060 560 v-60 l60 -46 l60 46 v60Z" fill="#e98544" />
          <path
            d="M1050 504 l70 -56 l70 56"
            fill="none"
            stroke="#ffffff"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <rect x="1100" y="516" width="34" height="30" rx="4" fill="#ffd37a" />
          <path d="M1160 470 v-40 h18 v40" fill="#b56236" />
        </g>
        <path d="M0 690 Q420 630 900 700 T1600 680 V980 H-80Z" fill="#cbe0f6" />
        <path d="M200 900 Q520 740 980 900" fill="#b9d4f1" />
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
            fill="#4ca182"
            light="#7fc8a4"
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
    </>
  );
}
function Stars() {
  return (
    <>
      <defs>
        <linearGradient id="bd-stars-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#051454" />
          <stop offset="0.55" stopColor="#1c298c" />
          <stop offset="1" stopColor="#6244aa" />
        </linearGradient>
        <radialGradient id="bd-stars-band" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c7b2ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#c7b2ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6fffc7" stopOpacity="0" />
          <stop offset="0.3" stopColor="#6fffc7" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#b192ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#b192ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
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
          fill="#1d2c78"
        />
        <path
          d="M260 470 L230 500 L270 496 L300 516Z M640 420 L606 456 L650 450 L680 470Z M1080 450 L1050 482 L1090 478 L1120 498Z"
          fill="#7c89dc"
          opacity="0.6"
        />
        <path
          d="M0 720 Q300 640 640 700 Q760 720 860 660 Q980 600 1120 690 T1600 680 V980 H-80Z"
          fill="#152467"
        />
        <path d="M560 900 Q700 700 820 690 Q980 690 1060 900Z" fill="#233690" />
        {[
          [180, 760, 1],
          [1420, 770, 1.2],
        ].map(([x, y, s], i) => (
          <Fir key={i} x={x} y={y} s={s} fill="#10225c" />
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
    </>
  );
}
// Small round bush used on hills and banks.
function Bush({
  x,
  y,
  s,
  fill = "#80c854",
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
        fill="#b5e97c"
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
          stroke={i % 3 ? "#78c849" : "#92d860"}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </>
  );
}
// Flat storybook garden: broad bright shapes in layers, no filter.
function FlatBush({
  x,
  y,
  s,
  fill = "#4fae5a",
  light = "#74c877",
}: {
  x: number;
  y: number;
  s: number;
  fill?: string;
  light?: string;
}) {
  return (
    <g>
      <circle cx={x - 28 * s} cy={y} r={28 * s} fill={fill} />
      <circle cx={x + 26 * s} cy={y + 2 * s} r={26 * s} fill={fill} />
      <circle cx={x} cy={y - 18 * s} r={32 * s} fill={fill} />
      <circle cx={x - 8 * s} cy={y - 26 * s} r={13 * s} fill={light} />
    </g>
  );
}
function FlatCloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <path
        d={`M${x} ${y}a${26 * s} ${26 * s} 0 0 1 ${6 * s} ${-52 * s} ${40 * s} ${40 * s} 0 0 1 ${76 * s} ${-8 * s} ${30 * s} ${30 * s} 0 0 1 ${28 * s} ${60 * s}Z`}
        fill="#ffffff"
        opacity="0.94"
      />
      <path
        d={`M${x + 12 * s} ${y - 6 * s}h${86 * s}`}
        stroke="#e1f2fc"
        strokeWidth={8 * s}
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  );
}
function GardenScene({ night }: { night: boolean }) {
  return (
    <>
      <rect x="-80" y="-80" width="1760" height="1060" fill="#bfe6f7" />
      <rect x="-80" y="300" width="1760" height="300" fill="#d7f0fa" />
      <FlatCloud x={150} y={210} s={1.1} />
      <FlatCloud x={720} y={150} s={0.8} />
      <FlatCloud x={1330} y={250} s={1} />
      <path
        d="M-80 500 Q200 380 520 450 T1100 420 T1680 450 V980 H-80Z"
        fill="#a5d99b"
      />
      {[
        [120, 470, 1],
        [430, 440, 0.8],
        [900, 425, 0.9],
        [1260, 430, 1.1],
        [1530, 450, 0.9],
      ].map(([x, y, s], i) => (
        <FlatBush key={i} x={x} y={y} s={s} fill="#7cc67f" light="#9bd89a" />
      ))}
      <path d="M-80 590 Q400 480 900 545 T1680 525 V980 H-80Z" fill="#8fd083" />
      {[...Array(26)].map((_, i) => (
        <rect
          key={i}
          x={-60 + i * 68}
          y={522 - Math.sin(i / 4) * 22}
          width="14"
          height="56"
          rx="7"
          fill="#fff8ea"
        />
      ))}
      <path
        d="M-80 550 Q400 472 900 522 T1680 502"
        fill="none"
        stroke="#fff8ea"
        strokeWidth="10"
      />
      <path
        d="M-80 660 Q500 590 1000 640 T1680 630 V980 H-80Z"
        fill="#78c26b"
      />
      <path
        d="M-80 700 Q500 640 1000 690 T1680 680"
        fill="none"
        stroke="#8fd083"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M1230 590 Q1040 680 930 770 T800 980"
        fill="none"
        stroke="#f4d9a0"
        strokeWidth="96"
        strokeLinecap="round"
      />
      <FlatBush x={1570} y={730} s={1.5} />
      <FlatBush x={20} y={890} s={1.3} />
      {scatter(26, 3, [0, 700, 1600, 890]).map((p, i) => (
        <path
          key={"t" + i}
          d={`M${p.x - 14} ${p.y}q6 -24 14 -30q8 6 14 30Z`}
          fill="#5fb55a"
        />
      ))}
      {scatter(22, 13, [40, 705, 1560, 885]).map((p, i) => (
        <g key={"fl" + i}>
          {[0, 72, 144, 216, 288].map((r) => (
            <circle
              key={r}
              cx={p.x}
              cy={p.y - 8}
              r="6"
              fill={["#ffd24d", "#ff9eb0", "#ffffff"][i % 3]}
              transform={`rotate(${r} ${p.x} ${p.y})`}
            />
          ))}
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill={i % 3 === 0 ? "#f08a3c" : "#ffd24d"}
          />
        </g>
      ))}
      {night && <Night dots={false} />}
    </>
  );
}
function PondScene({ night }: { night: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="bd-pond-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7eeeb" />
          <stop offset="1" stopColor="#fdf8c8" />
        </linearGradient>
        <linearGradient id="bd-pond-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8edfe5" />
          <stop offset="1" stopColor="#55c1d7" />
        </linearGradient>
      </defs>
      <g>
        <rect
          x="-80"
          y="-80"
          width="1760"
          height="1060"
          fill="url(#bd-pond-sky)"
        />
        <path
          d="M-80 470 Q300 370 700 430 T1680 410 V980 H-80Z"
          fill="#b2e292"
        />
        {[
          [260, 430, 1.1],
          [640, 420, 0.9],
          [1040, 410, 1],
          [1420, 420, 1.2],
        ].map(([x, y, s], i) => (
          <Bush key={i} x={x} y={y} s={s} fill="#96d277" />
        ))}
        <path
          d="M-80 560 Q500 480 1000 530 T1680 520 V980 H-80Z"
          fill="#c3ed84"
        />
        <path
          d="M-80 600 Q200 500 520 540 Q720 570 700 700 Q660 870 300 910 L-80 930Z"
          fill="#f6e193"
        />
        <path
          d="M-80 620 Q200 525 510 562 Q690 590 672 700 Q640 850 300 888 L-80 905Z"
          fill="url(#bd-pond-water)"
        />
        <ellipse cx="1240" cy="700" rx="250" ry="78" fill="#f6e193" />
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
              fill="#75c852"
            />
            {i % 2 === 0 && (
              <circle
                cx={x - r * 0.3}
                cy={y - r * 0.1}
                r={r * 0.28}
                fill="#ffaebd"
              />
            )}
          </g>
        ))}
        {scatter(16, 23, [560, 560, 760, 720]).map((p, i) => (
          <g key={"reed" + i}>
            <path
              d={`M${p.x} ${p.y} q-6 -60 4 -110`}
              stroke="#65b545"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx={p.x + 4}
              cy={p.y - 118}
              rx="6"
              ry="16"
              fill="#9f683a"
            />
          </g>
        ))}
        <path
          d="M-80 900 Q600 850 1000 880 T1680 860 V980 H-80Z"
          fill="#abdd6e"
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
          <stop offset="0" stopColor="#c0ec80" />
          <stop offset="1" stopColor="#9cd861" />
        </linearGradient>
        <linearGradient id="vm-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3ec3e9" />
          <stop offset="1" stopColor="#98ecf1" />
        </linearGradient>
        <linearGradient id="vm-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#051454" />
          <stop offset="1" stopColor="#4e39a2" />
        </linearGradient>
      </defs>
      <g>
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
          fill="#ffe28f"
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
          fill="#233690"
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
          stroke="#d4e5fa"
          strokeWidth="18"
        />
        {[
          [1040, 520, 0.6],
          [1380, 470, 0.7],
          [1500, 600, 0.9],
          [1290, 640, 0.6],
          [1600, 520, 0.7],
        ].map(([x, y, s], i) => (
          <Fir key={i} x={x} y={y} s={s} fill="#5dac8f" snow />
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
            fill={i % 2 ? "#63b04c" : "#539e41"}
            light="#98d76e"
          />
        ))}
        {/* River from the snow down to the pond and out of the valley */}
        <path
          d="M1160 660 Q1000 640 900 700 Q820 760 860 980"
          fill="none"
          stroke="#f6e193"
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d="M1160 660 Q1000 640 900 700 Q820 760 860 980"
          fill="none"
          stroke="#7ad4e7"
          strokeWidth="48"
          strokeLinecap="round"
        />
        {/* Pond */}
        <ellipse cx="640" cy="640" rx="190" ry="100" fill="#f6e193" />
        <ellipse cx="640" cy="640" rx="170" ry="84" fill="#7ad4e7" />
        {[
          [540, 620],
          [730, 670],
          [700, 600],
          [570, 680],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="24" ry="12" fill="#75c852" />
            {i % 2 === 0 && <circle cx={x} cy={y - 4} r="8" fill="#ffaebd" />}
          </g>
        ))}
        {/* Trail through the six lands */}
        <path
          d="M224 700 Q420 760 600 720 M560 560 Q420 440 380 320 M440 230 Q620 260 800 250 M940 250 Q1080 330 1140 420 M1260 400 Q1330 320 1340 250"
          fill="none"
          stroke="#ffe9aa"
          strokeWidth="26"
          strokeLinecap="round"
          strokeDasharray="6 44"
        />
        {/* Home garden, bottom left */}
        <g>
          <path d="M70 700 v-70 l66 -52 l66 52 v70Z" fill="#fff4db" />
          <rect x="70" y="684" width="132" height="16" rx="4" fill="#ead3aa" />
          <rect x="160" y="576" width="20" height="36" rx="4" fill="#d96b43" />
          <path
            d="M54 634 l82 -66 l82 66"
            fill="none"
            stroke="#f05a54"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M120 700 v-38 a16 16 0 0 1 32 0 v38Z" fill="#b37848" />
          <circle
            cx="94"
            cy="656"
            r="11"
            fill="#bfe8ff"
            stroke="#fff"
            strokeWidth="3"
          />
          <circle
            cx="178"
            cy="656"
            r="11"
            fill="#bfe8ff"
            stroke="#fff"
            strokeWidth="3"
          />
        </g>
        {/* Cozy red-capped mushroom in the forest */}
        <g>
          <rect x="318" y="256" width="28" height="26" rx="6" fill="#fff7e8" />
          <path
            d="M302 260c2-22 18-32 30-32s28 10 30 32q-30 8-60 0Z"
            fill="#f25553"
          />
          <circle cx="322" cy="244" r="4.5" fill="#fff7e8" />
          <circle cx="340" cy="240" r="5.5" fill="#fff7e8" />
          <circle cx="348" cy="252" r="3.5" fill="#fff7e8" />
        </g>
        {/* Cheerful beach umbrella & sandcastle hint */}
        <g>
          <path
            d="M750 185 L762 138"
            stroke="#b07a4e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M726 142 c8-22 48-22 56 0Z" fill="#f25755" />
          <path d="M742 142 c6-20 20-20 26 0Z" fill="#ffd03b" />
        </g>
        {/* Warm cabin on the snowy hill */}
        <g>
          <path d="M1180 510 v-36 l36 -28 l36 28 v36Z" fill="#e98544" />
          <path
            d="M1172 476 l44 -34 l44 34"
            fill="none"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <rect x="1204" y="484" width="20" height="18" rx="3" fill="#ffd37a" />
        </g>
        {[...Array(9)].map((_, i) => (
          <rect
            key={i}
            x={30 + i * 44}
            y={730}
            width="10"
            height="40"
            rx="4"
            fill="#ffebbc"
          />
        ))}
        <path d="M30 748 H392" stroke="#ffebbc" strokeWidth="8" />
        {scatter(26, 5, [30, 780, 520, 890]).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6 + p.r}
            fill={["#ffd76e", "#ffb09c", "#ffffff"][i % 3]}
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
          stroke="#c37e43"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M800 728 q50 -40 110 -10"
          fill="none"
          stroke="#e2a364"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
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
