import type { ReactNode } from "react";
import { cn } from "../styles";
import { BLUSH, type Draw, INK } from "./ArtFlat";
// The rest of the flat storybook set: crops, food, toys, creatures and region props.
const LINE = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
function Eye({ x, y, r = 5.2 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.34} cy={y - r * 0.34} r={r * 0.36} fill="#fff" />
      <circle
        cx={x - r * 0.32}
        cy={y + r * 0.34}
        r={r * 0.17}
        fill="#fff"
        opacity="0.85"
      />
    </>
  );
}
function Smile({
  x,
  y,
  w = 6,
  open = true,
}: {
  x: number;
  y: number;
  w?: number;
  open?: boolean;
}) {
  return open ? (
    <>
      <path
        d={`M${x - w} ${y}q${w} ${w * 1.65} ${w * 2} 0Z`}
        fill="#d94b58"
        stroke={INK}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d={`M${x - w * 0.65} ${y + w * 0.48}q${w * 0.65} ${w * 0.7} ${w * 1.3} 0Z`}
        fill="#ff8fa0"
      />
    </>
  ) : (
    <path
      d={`M${x - w} ${y}q${w} ${w} ${w * 2} 0`}
      stroke={INK}
      strokeWidth="2.3"
      {...LINE}
    />
  );
}
function Cheeks({
  x1,
  x2,
  y,
  r = 5.4,
}: {
  x1: number;
  x2: number;
  y: number;
  r?: number;
}) {
  return (
    <>
      <ellipse
        cx={x1}
        cy={y}
        rx={r * 1.15}
        ry={r * 0.78}
        fill={BLUSH}
        opacity="0.85"
      />
      <ellipse
        cx={x2}
        cy={y}
        rx={r * 1.15}
        ry={r * 0.78}
        fill={BLUSH}
        opacity="0.85"
      />
    </>
  );
}
const STAR = "m60 8 15 33 36 4-27 25 8 36-32-18-32 18 8-36L9 45l36-4Z";
const DISH: Record<string, { fill: string; rim: string; garnish: ReactNode }> =
  {
    "dish-soup": {
      fill: "#f25b58",
      rim: "#ff857d",
      garnish: (
        <>
          <path d="M44 58q8-6 16 0t16 0" stroke="#fff5d6" strokeWidth="3" {...LINE} />
          <circle cx="56" cy="57" r="4" fill="#62c06a" />
          <circle cx="64" cy="59" r="3.5" fill="#4fae5a" />
        </>
      ),
    },
    "dish-jam": {
      fill: "#d94876",
      rim: "#f57ca3",
      garnish: (
        <>
          <circle cx="55" cy="57" r="6" fill="#ff6b96" />
          <circle cx="66" cy="59" r="5" fill="#ff85aa" />
          <ellipse cx="60" cy="53" rx="5" ry="3" fill="#62c06a" />
        </>
      ),
    },
    "dish-salad": {
      fill: "#68c75a",
      rim: "#92e084",
      garnish: (
        <>
          <circle cx="46" cy="58" r="6" fill="#f25755" />
          <circle cx="72" cy="57" r="5.5" fill="#ff9a3c" />
          <circle cx="60" cy="61" r="5" fill="#ffd03b" />
        </>
      ),
    },
    "dish-pie": {
      fill: "#f0a046",
      rim: "#ffc373",
      garnish: (
        <path
          d="M36 58l24-6 24 6M36 62l24 6 24-6M48 54l24 12M72 54L48 66"
          stroke="#c97424"
          strokeWidth="3"
          {...LINE}
        />
      ),
    },
    "dish-juice": {
      fill: "#ff6e7e",
      rim: "#ff9da8",
      garnish: (
        <>
          <path d="M72 58 84 26l10-3" stroke="#ffc93c" strokeWidth="5" {...LINE} />
          <path d="M36 54a12 12 0 0 1 20-6Z" fill="#f24e5e" />
          <path d="M36 54a12 12 0 0 1 20-6" stroke="#5cc265" strokeWidth="3.5" {...LINE} />
        </>
      ),
    },
    "dish-corncake": {
      fill: "#ffd03b",
      rim: "#ffe482",
      garnish: (
        <>
          <rect x="53" y="51" width="14" height="10" rx="3" fill="#fff6bd" />
          <circle cx="42" cy="60" r="3" fill="#f09c24" />
          <circle cx="78" cy="59" r="3" fill="#f09c24" />
        </>
      ),
    },
    "dish-applesauce": {
      fill: "#f5a864",
      rim: "#ffc994",
      garnish: (
        <>
          <path d="M44 59q16-7 32 0" stroke="#c97432" strokeWidth="3" {...LINE} />
          <ellipse cx="62" cy="54" rx="7" ry="4" fill="#5cc265" />
        </>
      ),
    },
    "dish-pumpkinsoup": {
      fill: "#ff9433",
      rim: "#ffb66e",
      garnish: (
        <>
          <path d="M46 59q7-6 14 0t14 0" stroke="#fff3cf" strokeWidth="3.2" {...LINE} />
          <ellipse cx="58" cy="55" rx="3.5" ry="2" fill="#4fae5a" />
          <ellipse cx="66" cy="57" rx="3.5" ry="2" fill="#4fae5a" />
        </>
      ),
    },
    "dish-cornsoup": {
      fill: "#ffd859",
      rim: "#ffea99",
      garnish: (
        <>
          <circle cx="50" cy="58" r="4" fill="#ffb72b" />
          <circle cx="60" cy="56" r="4" fill="#ffb72b" />
          <circle cx="70" cy="59" r="4" fill="#ffb72b" />
          <circle cx="60" cy="61" r="3" fill="#5cc265" />
        </>
      ),
    },
    "dish-fruitbowl": {
      fill: "#f56c87",
      rim: "#ff9db0",
      garnish: (
        <>
          <circle cx="46" cy="57" r="6.5" fill="#f24e4e" />
          <circle cx="60" cy="55" r="6.5" fill="#ffd03b" />
          <circle cx="74" cy="57" r="6" fill="#5f7fe0" />
          <ellipse cx="60" cy="61" rx="7" ry="4" fill="#5cc265" />
        </>
      ),
    },
    "dish-tea": {
      fill: "#ebb244",
      rim: "#ffd278",
      garnish: (
        <>
          <circle cx="60" cy="57" r="8" fill="#ffe066" />
          <circle cx="60" cy="57" r="4" fill="#8a5a36" />
          <ellipse cx="47" cy="59" rx="5" ry="3" fill="#62c06a" />
        </>
      ),
    },
    "dish-smoothie": {
      fill: "#e86496",
      rim: "#ffa3c5",
      garnish: (
        <>
          <path d="M70 58 82 26l10-3" stroke="#5fb4e0" strokeWidth="5" {...LINE} />
          <circle cx="54" cy="56" r="7" fill="#fff7e8" />
          <circle cx="54" cy="53" r="4" fill="#f24e5e" />
        </>
      ),
    },
    "dish-mystery": {
      fill: "#b17ee6",
      rim: "#cfaaf5",
      garnish: (
        <>
          <path d="m60 48 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffe07a" />
          <circle cx="44" cy="59" r="3" fill="#fff" />
          <circle cx="76" cy="58" r="2.5" fill="#fff" />
        </>
      ),
    },
    "dish-coconut": {
      fill: "#f7ebd2",
      rim: "#fff9eb",
      garnish: (
        <>
          <path d="M70 58 82 26l10-3" stroke="#f25755" strokeWidth="5" {...LINE} />
          <ellipse cx="48" cy="56" rx="7" ry="4" fill="#5cc265" />
        </>
      ),
    },
    "dish-chestnut": {
      fill: "#a86639",
      rim: "#c98655",
      garnish: (
        <>
          <circle cx="52" cy="57" r="7" fill="#8a4e26" />
          <circle cx="68" cy="57" r="7" fill="#8a4e26" />
          <path d="M49 55l6 4m-6 0 6-4m10 0 6 4m-6 0 6-4" stroke="#f7e3c8" strokeWidth="2" {...LINE} />
        </>
      ),
    },
  };
const dish =
  ({
    fill,
    rim,
    garnish,
  }: {
    fill: string;
    rim: string;
    garnish: ReactNode;
  }): Draw =>
  () => (
    <>
      {/* Cozy steam curls above the bowl */}
      <path
        d="M44 36q-4-8 2-14m14 12q-4-8 2-14m14 14q-4-8 2-14"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.65"
        {...LINE}
      />
      <ellipse cx="60" cy="103" rx="34" ry="7" fill="#dfd3ba" />
      <path d="M14 58h92c0 30-20 46-46 46S14 88 14 58Z" fill="#fffbf2" />
      <path
        d="M21 75c8 18 22 29 39 29s31-11 39-29c-12 12-25 17-39 17S33 87 21 75Z"
        fill="#e6edf5"
      />
      {/* Cute decorative stripe on the bowl */}
      <path
        d="M17 70q43 10 86 0"
        stroke="#ff9ea2"
        strokeWidth="3.5"
        opacity="0.7"
        {...LINE}
      />
      <ellipse cx="60" cy="58" rx="46" ry="13" fill="#ffffff" />
      <ellipse cx="60" cy="58" rx="40" ry="9.5" fill={fill} />
      <ellipse cx="56" cy="56" rx="28" ry="5.5" fill={rim} opacity="0.55" />
      {garnish}
      {/* Happy little face on the front of the bowl */}
      <Eye x={50} y={82} r={3.2} />
      <Eye x={70} y={82} r={3.2} />
      <Smile x={60} y={86} w={4} open={false} />
      <Cheeks x1={43} x2={77} y={86} r={3.2} />
    </>
  );
// A puppy-shaped constellation (Lucky): body, head, then the two floppy ears, lit a few stars per stage.
const CONSTELLATION = [
  [26, 100],
  [40, 72],
  [50, 46],
  [62, 28],
  [78, 46],
  [86, 72],
  [98, 100],
  [34, 34],
  [24, 56],
  [92, 34],
  [102, 56],
];
const constellation =
  (stage: number): Draw =>
  () => {
    const lit = stage * 3 - 1;
    return (
      <>
        {CONSTELLATION.slice(0, lit).map(([x, y], i, arr) =>
          i && i !== 7 && i !== 9 ? (
            <path
              key={"l" + i}
              d={`M${arr[i - 1][0]} ${arr[i - 1][1]}L${x} ${y}`}
              stroke="#fff1b8"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.75"
            />
          ) : null,
        )}
        {CONSTELLATION.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i < lit ? 6 : 3}
            fill={i < lit ? "#ffe07a" : "#8f8ab8"}
          />
        ))}
      </>
    );
  };
const sandcastle =
  (stage: number): Draw =>
  () => (
    <>
      <path d="M8 112q52-32 104 0Z" fill="#f5d48e" />
      <path d="M60 96q28 4 52 16H60Z" fill="#e6bf72" />
      {stage === 1 && (
        <>
          {/* Bright red beach bucket & blue spade */}
          <path d="M66 70h32l-4 32H70Z" fill="#f25755" />
          <path d="M82 70h16l-4 32H82Z" fill="#d94240" />
          <rect x="64" y="66" width="36" height="7" rx="3.5" fill="#ff7876" />
          <path
            d="M68 68q14-20 28 0"
            stroke="#ffd03b"
            strokeWidth="4.5"
            {...LINE}
          />
          <path
            d="M38 100 50 60"
            stroke="#4fa9e0"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <rect
            x="41"
            y="53"
            width="18"
            height="9"
            rx="4.5"
            fill="#398dc4"
            transform="rotate(15 50 57)"
          />
        </>
      )}
      {stage > 1 && (
        <>
          {/* Sturdy sandcastle walls & side turrets */}
          <rect x="20" y="60" width="18" height="42" rx="4" fill="#edd08e" />
          <rect x="82" y="60" width="18" height="42" rx="4" fill="#e0be77" />
          <path d="M18 60l11-14 11 14Zm62 0 11-14 11 14Z" fill="#f25755" />
          <rect x="30" y="64" width="60" height="38" rx="5" fill="#fae2a5" />
          <path d="M30 64v-9h12v9m12 0v-9h12v9m12 0v-9h12v9" fill="#fae2a5" />
          <rect x="30" y="92" width="60" height="10" rx="4" fill="#e6bf74" />
        </>
      )}
      {stage === 3 && (
        <>
          <rect x="43" y="34" width="34" height="26" rx="4" fill="#ffebb8" />
          <path d="M43 36v-9h9v9m4 0v-9h8v9m4 0v-9h9v9" fill="#ffebb8" />
          <circle cx="60" cy="47" r="5" fill="#9b7548" />
          <path
            d="M60 27V5"
            stroke="#b07a4e"
            strokeWidth="3.8"
            strokeLinecap="round"
          />
          <path d="M60 6l21 7.5L60 21Z" fill="#f25755" />
          <path d="M51 102V82a9 9 0 0 1 18 0v20Z" fill="#9b6a3e" />
          <circle cx="38" cy="103" r="4.5" fill="#ff9eb0" />
        </>
      )}
    </>
  );
const snowman =
  (stage: number): Draw =>
  () => (
    <>
      <ellipse cx="60" cy="112" rx="36" ry="6" fill="#cfe3f2" />
      <circle cx="60" cy="85" r="28" fill="#ffffff" />
      <path d="M35 97a28 28 0 0 0 50 0q-25 11-50 0Z" fill="#e1eef8" />
      {stage > 1 && (
        <>
          <path
            d="M34 76 14 62m72 14 20-14m-86-6-6 3m92-3 6 3"
            stroke="#946037"
            strokeWidth="4.5"
            {...LINE}
          />
          <circle cx="60" cy="46" r="20" fill="#ffffff" />
        </>
      )}
      {stage === 3 && (
        <>
          <path d="M41 60q19 9 38 0l2 9q-21 9-42 0Z" fill="#f25755" />
          <path d="M70 66l9 19-12-3Z" fill="#d94240" />
          <Eye x={52} y={42} r={4} />
          <Eye x={68} y={42} r={4} />
          <Smile x={60} y={51} w={4.5} />
          <path d="M60 45l17 3.5-17 3.5Z" fill="#ff9433" />
          <Cheeks x1={45} x2={75} y={50} r={4} />
          {/* Cozy winter top hat with holly */}
          <rect x="41" y="23" width="38" height="6.5" rx="3.2" fill={INK} />
          <rect x="48" y="6" width="24" height="19" rx="4" fill={INK} />
          <rect x="48" y="18" width="24" height="5" fill="#f25755" />
          <circle cx="68" cy="20" r="3" fill="#5cc265" />
          <circle cx="60" cy="79" r="3" fill={INK} />
          <circle cx="60" cy="92" r="3" fill={INK} />
        </>
      )}
    </>
  );
const fruit = (body: string, shade: string, seeds: boolean): Draw =>
  function Fruit() {
    return (
      <>
        <path
          d="M60 34q-2-12 4-20"
          stroke="#8a5a36"
          strokeWidth="5"
          {...LINE}
        />
        <path d="M63 26q8-16 26-12-4 16-26 12Z" fill="#62c06a" />
        <path
          d="M60 34c-22-14-44 0-42 28 2 26 20 46 42 46s40-20 42-46c2-28-20-42-42-28Z"
          fill={body}
        />
        <path
          d="M60 108c22 0 40-20 42-46 1-10-2-18-7-24 2 34-14 58-45 68 3 1 7 2 10 2Z"
          fill={shade}
        />
        <ellipse
          cx="38"
          cy="54"
          rx="6"
          ry="10"
          fill="#fff"
          opacity="0.45"
          transform="rotate(24 38 54)"
        />
        {seeds &&
          [
            [46, 72],
            [62, 62],
            [76, 76],
            [56, 88],
          ].map(([x, y]) => (
            <ellipse key={x} cx={x} cy={y} rx="2.2" ry="3.2" fill="#ffe7a8" />
          ))}
      </>
    );
  };
function Critter({ body, children }: { body: string; children?: ReactNode }) {
  return (
    <>
      <ellipse cx="60" cy="66" rx="36" ry="29" fill={body} />
      {children}
    </>
  );
}
export const flatMore: Record<string, Draw> = {
  flower: ({ color }) => (
    <>
      <path
        d="M60 114V54"
        stroke="#46a852"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <path
        d="M60 94Q28 65 24 92q16 17 36 2Zm0-14q32-25 34 2-14 15-34-2Z"
        fill="#5cc265"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <ellipse
          key={a}
          cx="60"
          cy="22"
          rx="11"
          ry="21"
          fill={color || (i % 2 ? "#ffba26" : "#ffd242")}
          transform={`rotate(${a} 60 46)`}
        />
      ))}
      <circle cx="60" cy="46" r="17" fill="#7c4e2d" />
      <circle cx="60" cy="46" r="14" fill="#945f39" />
      <Eye x={54} y={44} r={2.8} />
      <Eye x={66} y={44} r={2.8} />
      <Smile x={60} y={49} w={3.5} open={false} />
      <Cheeks x1={49} x2={71} y={48} r={2.6} />
    </>
  ),
  carrot: () => (
    <>
      <path
        d="M57 35 42 10m18 24 4-28m0 28 22-20"
        stroke="#5cc265"
        strokeWidth="8.5"
        {...LINE}
      />
      <path d="M31 44q29-24 58 0L63 108q-3 8-7 0Z" fill="#ff9433" />
      <path d="M72 37q10 2 17 7L63 108q-2 4-4 4Z" fill="#eb7a21" />
      <ellipse
        cx="43"
        cy="56"
        rx="4"
        ry="9"
        fill="#fff"
        opacity="0.35"
        transform="rotate(14 43 56)"
      />
      <path
        d="M42 64h11m-6 15h9m-4 15h7"
        stroke="#d66614"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </>
  ),
  apple: fruit("#f25553", "#d63e3c", false),
  berry: fruit("#f54e78", "#d43560", true),
  tomato: () => (
    <>
      <circle cx="60" cy="70" r="39" fill="#f25553" />
      <path d="M60 109a39 39 0 0 0 34-58q4 39-46 56 6 2 12 2Z" fill="#d63e3c" />
      <path
        d="M60 35 40 46l15-1-5 13 10-11 10 11-5-13 15 1Z"
        fill="#46a852"
      />
      <path
        d="M60 35V20"
        stroke="#46a852"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse
        cx="39"
        cy="58"
        rx="6.5"
        ry="10"
        fill="#fff"
        opacity="0.5"
        transform="rotate(24 39 58)"
      />
      <circle cx="34" cy="70" r="2.5" fill="#fff" opacity="0.45" />
    </>
  ),
  pumpkin: () => (
    <>
      <path
        d="M60 36q0-13 9-18"
        stroke="#46a852"
        strokeWidth="7.5"
        {...LINE}
      />
      <path
        d="M65 28q10-6 14 2-6 8-14-2Z"
        fill="#5cc265"
      />
      <ellipse cx="33" cy="72" rx="23" ry="34" fill="#eb7a21" />
      <ellipse cx="87" cy="72" rx="23" ry="34" fill="#eb7a21" />
      <ellipse cx="46" cy="72" rx="22" ry="36" fill="#f58829" />
      <ellipse cx="74" cy="72" rx="22" ry="36" fill="#f58829" />
      <ellipse cx="60" cy="72" rx="22" ry="37" fill="#ff9c38" />
      <ellipse cx="52" cy="52" rx="5.5" ry="10" fill="#fff" opacity="0.45" />
    </>
  ),
  corn: () => (
    <>
      <path
        d="M60 10c20 14 24 50 13 80H47C36 60 40 24 60 10Z"
        fill="#ffc933"
      />
      {[28, 42, 56, 70].map((y) =>
        [49, 60, 71].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x - 4.2}
            y={y - 4.2}
            width="8.4"
            height="8.4"
            rx="3.2"
            fill="#ffe47a"
          />
        )),
      )}
      <path d="M60 114c-30-6-38-35-31-58 17 9 27 27 31 58Z" fill="#5cc265" />
      <path d="M60 114c30-6 38-35 31-58-17 9-27 27-31 58Z" fill="#46a852" />
    </>
  ),
  watermelon: () => (
    <>
      <path
        d="M60 31q0-10 9-14"
        stroke="#46a852"
        strokeWidth="6.5"
        {...LINE}
      />
      <ellipse cx="60" cy="70" rx="47" ry="39" fill="#5cc265" />
      <path
        d="M60 109c26 0 47-17 47-39 0-6-2-12-5-17-3 27-24 46-54 54 4 1 8 2 12 2Z"
        fill="#46a852"
      />
      <path
        d="M34 42q12 28 0 56m26-66q12 38 0 76m26-66q-12 28 0 56"
        stroke="#2f823b"
        strokeWidth="7.5"
        {...LINE}
      />
      <ellipse
        cx="39"
        cy="53"
        rx="6.5"
        ry="11"
        fill="#fff"
        opacity="0.45"
        transform="rotate(30 39 53)"
      />
    </>
  ),
  blueberry: () => (
    <>
      <path d="M60 36q-6-16 8-24" stroke="#46a852" strokeWidth="5.5" {...LINE} />
      <path d="M64 20q14-11 26-2-11 13-26 2Z" fill="#5cc265" />
      {[
        [41, 64],
        [79, 62],
        [60, 88],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="22" fill="#5778e0" />
          <path
            d={`M${x - 14} ${y + 12}a22 22 0 0 0 32-4q-16 10-32 4Z`}
            fill="#3e5bc2"
          />
          <circle cx={x - 7} cy={y - 8} r="5.5" fill="#a8befa" />
          <path
            d={`m${x - 5} ${y - 2} 5 4 5-4`}
            stroke="#2f469e"
            strokeWidth="3.2"
            {...LINE}
          />
        </g>
      ))}
    </>
  ),
  chestnut: () => (
    <>
      <path d="M60 26q2-10 8-14" stroke="#46a852" strokeWidth="5.5" {...LINE} />
      <path
        d="M60 27C28 31 18 62 29 87q31 25 62 0c11-25 1-56-31-60Z"
        fill="#a36236"
      />
      <path
        d="M29 87q31 25 62 0-2-9-6-13-25 13-50 0-4 4-6 13Z"
        fill="#f5dcb3"
      />
      <ellipse
        cx="45"
        cy="49"
        rx="6.5"
        ry="11"
        fill="#fff"
        opacity="0.38"
        transform="rotate(24 45 49)"
      />
    </>
  ),
  "mushroom-house": ({ night }) => (
    <>
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#6baa52" opacity="0.3" />
      <rect x="33" y="60" width="54" height="52" rx="12" fill="#fff7e8" />
      <rect x="33" y="60" width="54" height="10" fill="#e8d5b5" opacity="0.6" />
      <path d="M50 112V87a10 10 0 0 1 20 0v25Z" fill="#b07546" />
      <circle cx="65" cy="99" r="2" fill="#ffd24d" />
      <circle
        cx="75"
        cy="79"
        r="7.5"
        fill={night ? "#ffd454" : "#c8ecf7"}
        stroke="#fff"
        strokeWidth="2"
      />
      <path
        d="M6 69C8 27 38 8 60 8s52 19 54 61q-54 14-108 0Z"
        fill="#f25553"
      />
      <path
        d="M12 69q48 11 96 0-6-8-16-10-32 8-64 0-10 2-16 10Z"
        fill="#d63e3c"
      />
      {[
        [29, 45, 8.5],
        [58, 28, 11],
        [87, 47, 8.5],
        [47, 61, 5.5],
        [77, 63, 5.5],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#fff7e8" />
      ))}
    </>
  ),
  leafpile: () => (
    <>
      <path d="M6 108q54-68 108 0Z" fill="#f2a649" />
      <path d="M60 74q34 6 54 34H60Z" fill="#e08d31" />
      {(
        [
          [28, 90, -28, "#ffd03b"],
          [58, 72, 12, "#f25755"],
          [88, 90, 38, "#ffd03b"],
          [44, 98, -10, "#e67e29"],
          [74, 100, 22, "#ff7c94"],
          [42, 78, -18, "#62c06a"],
          [78, 78, 25, "#ff9a3c"],
        ] as const
      ).map(([x, y, rot, fill], i) => (
        <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx="16.5" ry="8.5" fill={fill} />
          <path
            d={`M${x - 10} ${y}h20`}
            stroke="#ffffff"
            strokeWidth="1.6"
            opacity="0.35"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  ),
  hedgehog: () => (
    <>
      <path
        d="M14 96C8 54 44 30 76 44l13-11-2 15 15-4-8 13 14 2-11 10 9 8-12 5c-4 8-13 14-26 14Z"
        fill="#7c4e2d"
      />
      <path
        d="M24 88c0-26 24-40 48-34l8-6-2 10 9-2-6 9 8 2-8 8c-8 10-20 13-37 13Z"
        fill="#9a643d"
      />
      <path
        d="M58 96c0-22 14-36 29-36 13 0 23 14 25 29q-4 7-13 7Z"
        fill="#fae6cd"
      />
      <ellipse cx="64" cy="48" rx="6" ry="5" fill="#fae6cd" />
      <ellipse cx="64" cy="48" rx="3.2" ry="2.6" fill={BLUSH} />
      <Eye x={86} y={74} r={4.8} />
      <Smile x={95} y={84} w={4} open={false} />
      <circle cx="111" cy="86" r="5" fill={INK} />
      <circle cx="109.5" cy="84.5" r="1.6" fill="#fff" opacity="0.7" />
      <ellipse cx="78" cy="84" rx="5.5" ry="3.8" fill={BLUSH} opacity="0.85" />
      <ellipse cx="38" cy="98" rx="10" ry="5.5" fill="#f5d5b0" />
      <ellipse cx="74" cy="98" rx="10" ry="5.5" fill="#f5d5b0" />
    </>
  ),
  squirrel: () => (
    <>
      {/* Huge fluffy curled tail */}
      <path
        d="M68 104c42-2 52-52 24-80-16-16-42-2-34 18 8 15 28 8 22 36Z"
        fill="#d97b29"
      />
      <path
        d="M84 36c12 10 14 34 2 50 4-16-6-22-12-34-4-8 2-20 10-16Z"
        fill="#f5a64c"
        opacity="0.65"
      />
      {/* Plump body & cream belly */}
      <ellipse cx="48" cy="86" rx="24" ry="24" fill="#f29d38" />
      <ellipse cx="46" cy="90" rx="13" ry="15" fill="#fff2db" />
      <ellipse cx="36" cy="108" rx="9" ry="5" fill="#d97b29" />
      <ellipse cx="58" cy="108" rx="9" ry="5" fill="#d97b29" />
      {/* Perky ears with inner pink */}
      <path d="M27 38 23 17l16 11Zm24-2 6-18 10 18Z" fill="#f29d38" />
      <path d="M29 35 26 22l10 7Zm23-2 4-12 6 12Z" fill={BLUSH} />
      {/* Big round head */}
      <ellipse cx="44" cy="50" rx="23" ry="21" fill="#f29d38" />
      <ellipse cx="44" cy="58" rx="13" ry="9" fill="#fff2db" />
      <Eye x={34} y={48} r={4.8} />
      <Eye x={54} y={48} r={4.8} />
      <ellipse cx="44" cy="54" rx="3.8" ry="2.6" fill={INK} />
      <Smile x={44} y={58} w={4.5} />
      <Cheeks x1={27} x2={61} y={56} r={4.5} />
      {/* Little hands hugging an acorn */}
      <circle cx="42" cy="80" r="9.5" fill="#a86434" />
      <path d="M33 76q9-8 18 0Z" fill="#73411f" />
      <ellipse cx="33" cy="79" rx="5.5" ry="4" fill="#e08826" />
      <ellipse cx="51" cy="79" rx="5.5" ry="4" fill="#e08826" />
    </>
  ),
  woodpecker: () => (
    <>
      <rect x="26" y="8" width="18" height="108" rx="8" fill="#b07a4e" />
      <rect x="36" y="8" width="8" height="108" rx="4" fill="#946037" />
      <path
        d="M44 96c-4-26 3-52 24-58 19-4 29 14 23 33-6 16-25 23-47 25Z"
        fill="#3d4859"
      />
      <ellipse cx="66" cy="75" rx="12" ry="15" fill="#fff8eb" />
      <path d="M54 66q12 16 24-2-4 18-24 2Z" fill="#2c3545" opacity="0.4" />
      {/* Vibrant red crest & big expressive head */}
      <path d="M55 36c6-18 22-20 32-8-10 0-15 6-18 14Z" fill="#f24e4e" />
      <circle cx="74" cy="46" r="18.5" fill="#fff8eb" />
      <path d="M90 43l23 5-23 7Z" fill="#ffb82e" />
      <Eye x={78} y={44} r={4.8} />
      <Smile x={83} y={53} w={3.5} open={false} />
      <ellipse cx="69" cy="53" rx="5" ry="3.5" fill={BLUSH} />
    </>
  ),
  "coconut-tree": () => (
    <>
      <ellipse cx="58" cy="114" rx="22" ry="4" fill="#d9b777" opacity="0.5" />
      <path d="M51 115q-5-48 8-83h11q-10 35-4 83Z" fill="#c99663" />
      <path d="M60 115q-4-48 4-83h6q-10 35-4 83Z" fill="#b07d4b" />
      <path
        d="M56 58h11m-12 18h11m-11 18h12"
        stroke="#9e6d3d"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {[
        "M64 34Q26 12 4 40q30-10 60-6Z",
        "M64 34Q38 -2 12 6q30 6 52 28Z",
        "M64 34Q92 -2 114 10q-30 4-50 24Z",
        "M64 34q40-14 54 18-24-18-54-18Z",
        "M64 34Q64 6 44 2q16 12 20 32Z",
      ].map((d, i) => (
        <path key={d} d={d} fill={i % 2 ? "#46a852" : "#5cc265"} />
      ))}
      <circle cx="55" cy="42" r="9.5" fill="#8a5630" />
      <circle cx="71" cy="45" r="9.5" fill="#a6683c" />
      <circle cx="63" cy="36" r="8.5" fill="#784927" />
    </>
  ),
  coconut: () => (
    <>
      <circle cx="60" cy="68" r="39" fill="#a6683c" />
      <path d="M60 107a39 39 0 0 0 35-56q2 37-47 54 6 2 12 2Z" fill="#87522c" />
      {[
        [50, 62],
        [70, 62],
        [60, 77],
      ].map(([x, y]) => (
        <circle key={x * y} cx={x} cy={y} r="4.8" fill={INK} />
      ))}
      <ellipse
        cx="41"
        cy="49"
        rx="6.5"
        ry="10"
        fill="#fff"
        opacity="0.32"
        transform="rotate(30 41 49)"
      />
    </>
  ),
  shell: () => (
    <>
      <path
        d="M60 106 16 58c0-28 20-42 44-42s44 14 44 42Z"
        fill="#ffa89e"
      />
      <path
        d="M60 106 60 16c24 0 44 14 44 42Z"
        fill="#f59187"
        opacity="0.6"
      />
      <path
        d="M60 106 32 30m28 76L49 20m11 86 11-86m-11 86 28-76"
        stroke="#e07065"
        strokeWidth="4"
        {...LINE}
      />
      <rect x="46" y="96" width="28" height="12" rx="6" fill="#e07065" />
      <circle cx="38" cy="40" r="4" fill="#fff" opacity="0.45" />
    </>
  ),
  sand: () => (
    <>
      <path d="M6 106q54-56 108 0Z" fill="#f5d289" />
      <path d="M60 78q32 6 54 28H60Z" fill="#e6bf72" />
      <circle cx="42" cy="94" r="2.5" fill="#d4aa5b" />
      <circle cx="76" cy="96" r="2" fill="#d4aa5b" />
      <circle cx="56" cy="86" r="2" fill="#fff3cf" />
    </>
  ),
  crab: () => (
    <>
      <path
        d="M26 70 11 56m83 14 15-14M30 90l-15 10m75-10 15 10M36 98l-8 12m56-12 8 12"
        stroke="#d64240"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="44" r="13.5" fill="#f25755" />
      <circle cx="106" cy="44" r="13.5" fill="#f25755" />
      <path
        d="M14 44 7 31m99 13 7-13"
        stroke="#fff6e5"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="78" rx="37" ry="27" fill="#f25755" />
      <ellipse cx="60" cy="85" rx="22" ry="15" fill="#ff928a" opacity="0.65" />
      <path
        d="M47 56V43m26 13V43"
        stroke="#f25755"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <circle cx="47" cy="41" r="8.5" fill="#ffffff" />
      <circle cx="73" cy="41" r="8.5" fill="#ffffff" />
      <Eye x={47} y={41} r={5.5} />
      <Eye x={73} y={41} r={5.5} />
      <Smile x={60} y={76} w={7.5} />
      <Cheeks x1={38} x2={82} y={77} />
    </>
  ),
  "sandcastle-1": sandcastle(1),
  "sandcastle-2": sandcastle(2),
  "sandcastle-3": sandcastle(3),
  wave: () => (
    <>
      <path
        d="M4 100q10-58 54-58 32 0 36 28-18-12-30 4 28 0 52 26Z"
        fill="#5fb4e0"
      />
      <path d="M4 100q40-22 112 0Z" fill="#4a9fd0" />
      <path d="M36 62q16-12 32-2" stroke="#fff" strokeWidth="6" {...LINE} />
      <circle cx="98" cy="62" r="4" fill="#fff" />
      <circle cx="108" cy="74" r="3" fill="#fff" />
    </>
  ),
  turtle: () => (
    <>
      <ellipse cx="32" cy="96" rx="13" ry="7.5" fill="#8ed479" />
      <ellipse cx="74" cy="96" rx="13" ry="7.5" fill="#8ed479" />
      <circle cx="97" cy="68" r="18" fill="#8ed479" />
      <path d="M12 92q6-54 44-54t42 54Z" fill="#45a852" />
      <path d="M14 92h82a4 4 0 0 1 0 6H14a4 4 0 0 1 0-6Z" fill="#f7de9c" />
      <path
        d="M36 62l12-10h16l12 10-6 16H42Zm-18 30 12-14m58 14-10-14"
        stroke="#2f823b"
        strokeWidth="4"
        {...LINE}
      />
      <Eye x={102} y={64} r={5} />
      <Smile x={103} y={74} w={4.5} />
      <ellipse cx="92" cy="74" rx="4.5" ry="3.2" fill={BLUSH} />
    </>
  ),
  seagull: () => (
    <>
      <path
        d="M6 58q28-28 54 6 26-34 54-6-28-6-54 22Q34 52 6 58Z"
        fill="#ffffff"
      />
      <path
        d="M6 58q10-6 20-6-6 4-10 8Zm108 0q-10-6-20-6 6 4 10 8Z"
        fill="#6b7c93"
      />
      <circle cx="60" cy="64" r="15" fill="#ffffff" />
      <path d="M55 72l5 12 5-12Z" fill="#ffa818" />
      <Eye x={53} y={62} r={3.6} />
      <Eye x={67} y={62} r={3.6} />
      <Cheeks x1={47} x2={73} y={68} r={3.2} />
    </>
  ),
  "pine-snow": () => (
    <>
      <rect x="52" y="92" width="16" height="24" rx="5" fill="#9c673d" />
      <rect x="60" y="92" width="8" height="24" rx="4" fill="#80522e" />
      {[
        [98, 50, "#388f46"],
        [74, 41, "#48a656"],
        [50, 31, "#5cc265"],
      ].map(([base, w, fill]) => (
        <path
          key={base}
          d={`M${60 - Number(w)} ${base}L60 ${Number(base) - 46} ${60 + Number(w)} ${base}Z`}
          fill={String(fill)}
          strokeLinejoin="round"
          stroke={String(fill)}
          strokeWidth="7"
        />
      ))}
      <path
        d="M47 26 60 2l13 24q-6-5-13 0-7-5-13 0Zm-12 30 9-16q7 6 16 0 9 6 16 0l9 16q-8-6-13 0-6-6-12 0-6-6-12 0-5-6-13 0Z"
        fill="#ffffff"
      />
    </>
  ),
  pinecone: () => (
    <>
      <path
        d="M60 16c25 10 33 42 27 65-6 20-16 28-27 32-11-4-21-12-27-32-6-23 2-55 27-65Z"
        fill="#ad7244"
      />
      <path
        d="M60 16c25 10 33 42 27 65-6 20-16 28-27 32Z"
        fill="#945d33"
        opacity="0.55"
      />
      {[36, 54, 72, 90].map((y) => (
        <path
          key={y}
          d={`M37 ${y}q11.5 13 23 0 11.5 13 23 0`}
          stroke="#754724"
          strokeWidth="5.2"
          {...LINE}
        />
      ))}
      <path d="M60 16q2-8 8-10" stroke="#754724" strokeWidth="5.5" {...LINE} />
    </>
  ),
  "snowman-1": snowman(1),
  "snowman-2": snowman(2),
  "snowman-3": snowman(3),
  "polar-bear": () => (
    <>
      {/* Chubby sitting polar bear cub */}
      <ellipse cx="60" cy="90" rx="35" ry="25" fill="#ffffff" />
      <ellipse cx="60" cy="96" rx="19" ry="15" fill="#eaf3fc" />
      {/* Sculpted front arms */}
      <path
        d="M34 78c-7 6-9 17-4 24 3 4 10 3 12-2 2-5 0-15-8-22Z"
        fill="#f2f7fc"
      />
      <path
        d="M86 78c7 6 9 17 4 24-3 4-10 3-12-2-2-5 0-15 8-22Z"
        fill="#f2f7fc"
      />
      {/* Round hind paws with pink pads */}
      <ellipse cx="41" cy="109" rx="11" ry="6.5" fill="#ffffff" />
      <ellipse cx="79" cy="109" rx="11" ry="6.5" fill="#ffffff" />
      <circle cx="41" cy="110" r="3" fill={BLUSH} opacity="0.8" />
      <circle cx="79" cy="110" r="3" fill={BLUSH} opacity="0.8" />
      {/* Round bear ears */}
      <circle cx="34" cy="24" r="12.5" fill="#ffffff" />
      <circle cx="86" cy="24" r="12.5" fill="#ffffff" />
      <circle cx="34" cy="24" r="6.5" fill={BLUSH} />
      <circle cx="86" cy="24" r="6.5" fill={BLUSH} />
      {/* Big round cub head & muzzle */}
      <ellipse cx="60" cy="48" rx="34" ry="29" fill="#ffffff" />
      <path
        d="M29 56c6 14 20 20 31 20s25-6 31-20c-6 17-18 22-31 22S35 73 29 56Z"
        fill="#e3eef8"
      />
      <ellipse cx="60" cy="58" rx="16" ry="11.5" fill="#eaf3fc" />
      <path
        d="M42 36q5-3 9 0M69 36q4-3 9 0"
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Eye x={46} y={45} r={5.8} />
      <Eye x={74} y={45} r={5.8} />
      <ellipse cx="60" cy="53" rx="6.5" ry="4.5" fill={INK} />
      <ellipse cx="58" cy="51.5" rx="2.2" ry="1.1" fill="#fff" opacity="0.65" />
      <Smile x={60} y={59} w={5.5} />
      <Cheeks x1={36} x2={84} y={56} />
      {/* Cozy winter scarf */}
      <path d="M37 74q23 11 46 0l2 8q-25 11-50 0Z" fill="#4fa9e0" />
      <path d="M68 79l7 16-10-2-3-14Z" fill="#398dc4" />
    </>
  ),
  penguin: () => (
    <>
      <ellipse cx="45" cy="110" rx="12" ry="6" fill="#ffa51f" />
      <ellipse cx="75" cy="110" rx="12" ry="6" fill="#ffa51f" />
      {/* Round baby penguin body & flippers */}
      <path
        d="M26 66c-10 6-14 20-8 28 4 3 10-4 12-14ZM94 66c10 6 14 20 8 28-4 3-10-4-12-14Z"
        fill="#324158"
      />
      <path
        d="M60 12c-28 0-37 34-37 60s14 38 37 38 37-12 37-38-9-60-37-60Z"
        fill="#394963"
      />
      {/* Heart-shaped white face & belly */}
      <path
        d="M60 39c-11-11-26-4-26 12 0 10 3 16 3 26 0 18 9 30 23 30s23-12 23-30c0-10 3-16 3-26 0-16-15-23-26-12Z"
        fill="#ffffff"
      />
      {/* Cute winter knit cap */}
      <path d="M35 28q25-18 50 0-25-6-50 0Z" fill="#f25755" />
      <rect x="33" y="25" width="54" height="7" rx="3.5" fill="#fff7e8" />
      <circle cx="60" cy="13" r="6.5" fill="#fff7e8" />
      <Eye x={47} y={48} r={5.4} />
      <Eye x={73} y={48} r={5.4} />
      <path d="M51 55q9-3 18 0l-9 11Z" fill="#ffa51f" />
      <Cheeks x1={39} x2={81} y={59} r={4.8} />
    </>
  ),
  sled: () => (
    <>
      <path
        d="M10 98h86q16 0 16-18q0-8-8-8"
        stroke="#b07a4e"
        strokeWidth="7"
        {...LINE}
      />
      <path
        d="M28 82v16m52-16v16"
        stroke="#946238"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <rect x="12" y="64" width="88" height="20" rx="9" fill="#f25755" />
      <rect x="12" y="75" width="88" height="9" rx="4.5" fill="#d63e3c" />
      <path d="M22 69h68" stroke="#ffd03b" strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  snowflake: () => (
    <>
      <g stroke="#6ec2f0" strokeWidth="7" {...LINE}>
        {[0, 60, 120].map((r) => (
          <path
            key={r}
            d="M60 14v92m-13-78 13 11 13-11m-26 64 13-11 13 11"
            transform={`rotate(${r} 60 60)`}
          />
        ))}
      </g>
      <circle cx="60" cy="60" r="10" fill="#b8e6ff" />
      <circle cx="60" cy="60" r="5" fill="#ffffff" />
    </>
  ),
  telescope: () => (
    <>
      <path
        d="M60 72 35 114m25-42 25 42m-25-42v42"
        stroke="#9e683c"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      <path d="M18 75 84 29l15 21-66 46Z" fill="#7084eb" />
      <path d="M25 85 91 39l8 11-66 46Z" fill="#586bd4" />
      <path d="M84 29l9-6 15 21-9 6Z" fill="#ffd03b" />
      <ellipse
        cx="97"
        cy="36"
        rx="4"
        ry="9"
        fill="#bfe8ff"
        transform="rotate(-35 97 36)"
      />
      <circle cx="60" cy="72" r="7" fill="#ffd03b" />
      <circle cx="60" cy="72" r="3.5" fill="#8a5a36" />
    </>
  ),
  "moon-face": () => (
    <>
      <circle cx="60" cy="60" r="49" fill="#ffe894" />
      <path
        d="M60 109a49 49 0 0 0 42-74q2 48-58 72 8 2 16 2Z"
        fill="#f2d26b"
        opacity="0.55"
      />
      <circle cx="35" cy="36" r="8" fill="#f0cf65" />
      <circle cx="86" cy="84" r="6" fill="#f0cf65" />
      <circle cx="84" cy="29" r="4.5" fill="#f0cf65" />
      <path
        d="M39 57q6.5-8 13 0m16 0q6.5-8 13 0"
        stroke={INK}
        strokeWidth="3.2"
        {...LINE}
      />
      <Smile x={60} y={71} w={8.5} />
      <Cheeks x1={37} x2={83} y={70} r={6} />
    </>
  ),
  "constellation-1": constellation(1),
  "constellation-2": constellation(2),
  "constellation-3": constellation(3),
  "constellation-4": constellation(4),
  "star-lantern": () => (
    <>
      <path
        d="M60 4v16"
        stroke="#b07a4e"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="62" r="42" fill="#fff1b8" opacity="0.38" />
      <path
        d={STAR}
        fill="#ffd03b"
        stroke="#ffba26"
        strokeWidth="4"
        strokeLinejoin="round"
        transform="translate(9 20) scale(0.85)"
      />
      <Eye x={52} y={62} r={3.6} />
      <Eye x={68} y={62} r={3.6} />
      <Smile x={60} y={69} w={4.8} />
      <Cheeks x1={45} x2={75} y={69} r={3.2} />
    </>
  ),
  butterfly: () => (
    <>
      <ellipse
        cx="33"
        cy="43"
        rx="26"
        ry="32"
        fill="#f77fb0"
        transform="rotate(-24 33 43)"
      />
      <ellipse
        cx="87"
        cy="43"
        rx="26"
        ry="32"
        fill="#f77fb0"
        transform="rotate(24 87 43)"
      />
      <ellipse cx="37" cy="84" rx="19" ry="22" fill="#ffc93c" />
      <ellipse cx="83" cy="84" rx="19" ry="22" fill="#ffc93c" />
      <circle cx="31" cy="40" r="9.5" fill="#ffd4e6" />
      <circle cx="89" cy="40" r="9.5" fill="#ffd4e6" />
      <circle cx="37" cy="86" r="6" fill="#fff0ba" />
      <circle cx="83" cy="86" r="6" fill="#fff0ba" />
      <path
        d="M55 28q-6-12-12-14m22 14q6-12 12-14"
        stroke={INK}
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="43" cy="14" r="3.2" fill="#7a5aa8" />
      <circle cx="77" cy="14" r="3.2" fill="#7a5aa8" />
      <rect x="52" y="34" width="16" height="66" rx="8" fill="#7a5aa8" />
      <circle cx="60" cy="36" r="11" fill="#8b69ba" />
      <Eye x={55.5} y={35} r={2.8} />
      <Eye x={64.5} y={35} r={2.8} />
      <Smile x={60} y={40} w={3.2} open={false} />
    </>
  ),
  worm: () => (
    <>
      <path
        d="M17 82q13-40 28-8t30 0 22-14"
        stroke="#8fd47b"
        strokeWidth="25"
        {...LINE}
      />
      <circle cx="98" cy="54" r="19.5" fill="#9ce087" />
      <Eye x={91} y={50} r={4.4} />
      <Eye x={105} y={50} r={4.4} />
      <Smile x={98} y={58} w={4.8} />
      <Cheeks x1={86} x2={110} y={58} r={3.6} />
    </>
  ),
  bird: () => (
    <>
      <path
        d="M46 94v16m22-16v16"
        stroke="#ffa51f"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path d="M26 62 4 48l6 30Z" fill="#3f94c9" />
      {/* Cute feather tuft on top */}
      <path d="M54 38q-2-12 6-14 4 4 2 10 6-6 9-1-2 6-8 8Z" fill="#54b0e3" />
      <Critter body="#54b0e3">
        <ellipse cx="63" cy="79" rx="22" ry="14" fill="#e1f4fc" />
        <path d="M36 58q18 28 36 0-16-8-36 0Z" fill="#3f94c9" />
        <path d="M93 55l21 8-21 9Z" fill="#ffa51f" />
        <Eye x={79} y={53} r={5.6} />
        <Smile x={85} y={64} w={4} open={false} />
        <ellipse cx="75" cy="67" rx="5.5" ry="3.8" fill={BLUSH} />
      </Critter>
    </>
  ),
  fish: () => (
    <>
      <path d="M28 66 4 42q8 24 0 48Z" fill="#ee7924" />
      <path d="M50 40q12-20 28-6Z" fill="#ee7924" />
      <Critter body="#ff9636">
        <ellipse cx="64" cy="80" rx="22" ry="12" fill="#ffdcb8" opacity="0.65" />
        <path
          d="M44 48q12 18 0 36m16-40q12 22 0 44"
          stroke="#ffd4a6"
          strokeWidth="5"
          {...LINE}
        />
        <Eye x={80} y={57} r={5.6} />
        <Smile x={85} y={69} w={4.5} />
        <ellipse cx="73" cy="70" rx="5" ry="3.5" fill={BLUSH} />
      </Critter>
    </>
  ),
  bug: () => (
    <>
      <path
        d="M44 30 35 15m41 15 9-15"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="35" cy="15" r="3.2" fill={INK} />
      <circle cx="85" cy="15" r="3.2" fill={INK} />
      <Critter body="#f25553">
        <path d="M60 37v58" stroke={INK} strokeWidth="3" />
        {[
          [42, 59],
          [78, 59],
          [46, 80],
          [74, 80],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="6.5" fill={INK} />
        ))}
      </Critter>
      <path d="M31 50a36 29 0 0 1 58 0q-29 13-58 0Z" fill={INK} />
      <circle cx="49" cy="45" r="5" fill="#fff" />
      <circle cx="71" cy="45" r="5" fill="#fff" />
      <circle cx="50" cy="45" r="2.6" fill={INK} />
      <circle cx="72" cy="45" r="2.6" fill={INK} />
      <circle cx="39" cy="49" r="3.5" fill={BLUSH} />
      <circle cx="81" cy="49" r="3.5" fill={BLUSH} />
    </>
  ),
  "decor-sunflower": () => (
    <>
      <path
        d="M60 92V52"
        stroke="#46a852"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
      <path
        d="M60 76Q36 58 34 76q12 12 26 0Zm0-8q24-16 26 2-12 10-26-2Z"
        fill="#5cc265"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <ellipse
          key={a}
          cx="60"
          cy="24"
          rx="10.5"
          ry="19"
          fill={i % 2 ? "#ffba26" : "#ffd242"}
          transform={`rotate(${a} 60 44)`}
        />
      ))}
      <circle cx="60" cy="44" r="15" fill="#7c4e2d" />
      <Eye x={55} y={42} r={2.5} />
      <Eye x={65} y={42} r={2.5} />
      <Smile x={60} y={47} w={3} open={false} />
      <path d="M39 88h42l-5 24H44Z" fill="#e8654f" />
      <path d="M60 88h21l-5 24H60Z" fill="#d1503b" />
      <rect x="36" y="83" width="48" height="10" rx="5" fill="#f58a70" />
    </>
  ),
  "decor-pumpkin-lamp": ({ night }) => (
    <>
      {night && <circle cx="60" cy="70" r="46" fill="#fff1b8" opacity="0.32" />}
      <path d="M60 36q0-12 8-17" stroke="#46a852" strokeWidth="7.5" {...LINE} />
      <ellipse cx="33" cy="72" rx="22" ry="34" fill="#eb7a21" />
      <ellipse cx="87" cy="72" rx="22" ry="34" fill="#eb7a21" />
      <ellipse cx="60" cy="72" rx="25" ry="37" fill="#ff9836" />
      <path
        d="M40 64l9-10 8 10Zm23 0 8-10 9 10Zm-19 16q16 14 32 0l-5-1-4 4-4-4-6 0-4 4-4-4Z"
        fill={night ? "#fff5ad" : "#6e3e19"}
      />
    </>
  ),
  rock: () => (
    <>
      <path
        d="M10 100 22 56q4-10 14-14l22-8q10-2 18 4l16 12q6 6 8 14l10 36q-50 14-100 0Z"
        fill="#aeb9c7"
      />
      <path
        d="M60 34q10-2 18 4l16 12q6 6 8 14l10 36q-22 6-46 7 20-30-6-73Z"
        fill="#8f9bab"
      />
      <ellipse cx="42" cy="54" rx="10" ry="5" fill="#cbd4e0" opacity="0.7" />
      <path d="M20 96q8-12 16 0t16 0" fill="#5cc265" />
      <circle cx="34" cy="92" r="4" fill="#ffd242" />
    </>
  ),
  grass: () => (
    <>
      <path
        d="M6 108 18 52l14 38 10-64 14 62 18-46 8 50 22-30 10 46Z"
        fill="#5cc265"
      />
      <path d="M56 88 74 42l8 50 22-30 10 46H52Z" fill="#46a852" />
      <circle cx="28" cy="78" r="5" fill="#ffd242" />
      <circle cx="88" cy="82" r="4.5" fill="#ff9eb0" />
    </>
  ),
  pond: () => (
    <>
      <ellipse cx="60" cy="74" rx="57" ry="33" fill="#f5de9b" />
      <ellipse cx="60" cy="72" rx="52" ry="29" fill="#54b5e3" />
      <ellipse cx="54" cy="68" rx="38" ry="18" fill="#78ccf2" opacity="0.45" />
      <path
        d="M28 66q10-6 20 0m24 16q10-6 20 0"
        stroke="#d4f2ff"
        strokeWidth="4"
        {...LINE}
      />
      <path d="M70 62a16 10 0 1 1 30 4l-14-5Z" fill="#5cc265" />
      <circle cx="86" cy="58" r="4.5" fill="#ffa3b8" />
    </>
  ),
  rainbow: () => (
    <>
      {["#f25755", "#ff9a3c", "#ffd03b", "#5cc265", "#54b5e3", "#9b6bd6"].map(
        (c, i) => (
          <path
            key={c}
            d={`M${9 + i * 7} 100a${51 - i * 7} ${62 - i * 7} 0 0 1 ${102 - i * 14} 0`}
            fill="none"
            stroke={c}
            strokeWidth="7.5"
          />
        ),
      )}
      <circle cx="16" cy="100" r="15" fill="#fff" />
      <circle cx="32" cy="103" r="11" fill="#fff" />
      <circle cx="104" cy="100" r="15" fill="#fff" />
      <circle cx="88" cy="103" r="11" fill="#fff" />
    </>
  ),
  basket: () => (
    <>
      <path d="M22 56q38-70 76 0" stroke="#9e683c" strokeWidth="9.5" {...LINE} />
      <path d="m12 54 14 52q2 6 8 6h52q6 0 8-6l14-52Z" fill="#eba85e" />
      <path d="m60 54h48l-14 52q-2 6-8 6H60Z" fill="#d99145" opacity="0.55" />
      <path d="M17 72h86l-5 18H22Z" fill="#c97d32" />
      <path
        d="M36 56v54m24-54v54m24-54v54"
        stroke="#b86d25"
        strokeWidth="3"
        opacity="0.5"
      />
      <rect x="8" y="47" width="104" height="13" rx="6.5" fill="#f5c684" />
    </>
  ),
  star: () => (
    <>
      <path
        d={STAR}
        fill="#ffd03b"
        stroke="#ffba26"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <Eye x={50} y={58} r={4.4} />
      <Eye x={70} y={58} r={4.4} />
      <Smile x={60} y={67} w={5} />
      <Cheeks x1={41} x2={79} y={66} r={4.2} />
    </>
  ),
  owl: () => (
    <>
      <ellipse cx="48" cy="108" rx="9" ry="4.5" fill="#ffa51f" />
      <ellipse cx="72" cy="108" rx="9" ry="4.5" fill="#ffa51f" />
      <path d="M31 40 27 16l21 13Zm58 0 4-24-21 13Z" fill="#9e6236" />
      <ellipse cx="60" cy="68" rx="35" ry="40" fill="#ba7e4b" />
      <ellipse cx="60" cy="82" rx="22" ry="22" fill="#fae7cf" />
      <path
        d="M49 78q4 4 8 0m6 0q4 4 8 0m-16 10q4 4 8 0"
        stroke="#d6b385"
        strokeWidth="2.8"
        {...LINE}
      />
      <ellipse
        cx="24"
        cy="75"
        rx="9"
        ry="21"
        fill="#9e6236"
        transform="rotate(14 24 75)"
      />
      <ellipse
        cx="96"
        cy="75"
        rx="9"
        ry="21"
        fill="#9e6236"
        transform="rotate(-14 96 75)"
      />
      {/* Big round owl spectacles & sparkling eyes */}
      <circle cx="45" cy="52" r="15" fill="#fae7cf" />
      <circle cx="75" cy="52" r="15" fill="#fae7cf" />
      <circle cx="45" cy="52" r="12" fill="#ffffff" />
      <circle cx="75" cy="52" r="12" fill="#ffffff" />
      <Eye x={46} y={53} r={7} />
      <Eye x={74} y={53} r={7} />
      <path d="m53 60 7 10 7-10q-7-3-14 0Z" fill="#ffa51f" />
      <Cheeks x1={33} x2={87} y={64} r={4.5} />
    </>
  ),
  frog: () => (
    <>
      <ellipse cx="29" cy="99" rx="15" ry="7.5" fill="#46a852" />
      <ellipse cx="91" cy="99" rx="15" ry="7.5" fill="#46a852" />
      <circle cx="41" cy="42" r="15.5" fill="#5cc265" />
      <circle cx="79" cy="42" r="15.5" fill="#5cc265" />
      <ellipse cx="60" cy="74" rx="39" ry="29" fill="#5cc265" />
      <ellipse cx="60" cy="86" rx="24" ry="14" fill="#d4f5c4" />
      <circle cx="41" cy="41" r="10.5" fill="#ffffff" />
      <circle cx="79" cy="41" r="10.5" fill="#ffffff" />
      <Eye x={42} y={42} r={6.2} />
      <Eye x={78} y={42} r={6.2} />
      <Smile x={60} y={65} w={10} />
      <Cheeks x1={33} x2={87} y={68} r={5.8} />
    </>
  ),
  snail: () => (
    <>
      <path
        d="M92 66 87 44m13 24 7-19"
        stroke="#f5d29c"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="87" cy="42" r="6" fill="#ffffff" />
      <circle cx="107" cy="47" r="6" fill="#ffffff" />
      <Eye x={87} y={42} r={3.8} />
      <Eye x={107} y={47} r={3.8} />
      <path
        d="M14 100q-2-10 10-10h52q10 0 12-15 2-13 13-13t13 13q0 25-24 25Z"
        fill="#f5d29c"
      />
      <circle cx="49" cy="65" r="29" fill="#f78568" />
      <circle cx="43" cy="54" r="10" fill="#ffa991" opacity="0.45" />
      <path
        d="M49 65c0-9 11-9 11 0 0 14-21 14-21 0 0-19 30-19 30 0"
        stroke="#d65a42"
        strokeWidth="4.8"
        {...LINE}
      />
      <Smile x={102} y={78} w={4.2} />
      <ellipse cx="93" cy="79" rx="4.2" ry="3" fill={BLUSH} />
    </>
  ),
  windmill: () => (
    <>
      <ellipse cx="60" cy="114" rx="22" ry="4" fill="#6baa52" opacity="0.3" />
      <path d="M50 52h20l7 62H43Z" fill="#fff8eb" />
      <path d="M60 52h10l7 62H60Z" fill="#ede0c7" />
      <path d="M48 54 60 38l12 16Z" fill="#f25755" />
      <path d="M53 114V96a7 7 0 0 1 14 0v18Z" fill="#9e683c" />
      <circle cx="60" cy="76" r="5" fill="#bfe8ff" stroke="#fff" strokeWidth="2" />
      <g className={cn("windmill-blades")}>
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d="M60 54 45 12q15-9 30 0Z"
            fill={["#f25755", "#ffd03b", "#54b5e3", "#5cc265"][a / 90]}
            transform={`rotate(${a} 60 54)`}
          />
        ))}
        <circle cx="60" cy="54" r="8.5" fill="#ffffff" />
        <circle cx="60" cy="54" r="4" fill="#9b6bd6" />
      </g>
    </>
  ),
  xylophone: () => (
    <>
      <path d="M6 42h108l-8 46H14Z" fill="#9e683c" />
      <path d="M10 82h100l-4 8H14Z" fill="#7d4f2a" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 14 + i * 11.8;
        const y = 38 + i * 1.5;
        const h = 54 - i * 3;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width="9.5"
              height={h}
              rx="4.5"
              fill={
                [
                  "#f25755",
                  "#ff9a3c",
                  "#ffd03b",
                  "#5cc265",
                  "#46b588",
                  "#54b5e3",
                  "#7084eb",
                  "#9b6bd6",
                ][i]
              }
            />
            <circle cx={x + 4.75} cy={y + 6} r="1.6" fill="#fff8eb" />
            <circle cx={x + 4.75} cy={y + h - 6} r="1.6" fill="#fff8eb" />
          </g>
        );
      })}
      {/* Two little wooden mallets below */}
      <path
        d="M32 104 76 96m12 8L44 96"
        stroke="#c98e55"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="78" cy="96" r="5.5" fill="#f25755" />
      <circle cx="42" cy="96" r="5.5" fill="#ffd03b" />
    </>
  ),
  "fx-moon": () => (
    <>
      <circle cx="60" cy="60" r="44" fill="#fff3b8" opacity="0.25" />
      <path d="M72 18a40 40 0 1 0 34 58A30 30 0 0 1 72 18Z" fill="#ffe07a" />
    </>
  ),
  "fx-firefly": () => (
    <>
      <circle cx="60" cy="60" r="24" fill="#fff8aa" opacity="0.45" />
      <ellipse
        cx="52"
        cy="50"
        rx="8"
        ry="4.5"
        fill="#d8f1fc"
        opacity="0.8"
        transform="rotate(-25 52 50)"
      />
      <ellipse
        cx="68"
        cy="50"
        rx="8"
        ry="4.5"
        fill="#d8f1fc"
        opacity="0.8"
        transform="rotate(25 68 50)"
      />
      <circle cx="60" cy="60" r="10.5" fill="#ffe45c" />
    </>
  ),
  "fx-shooting-star": () => (
    <>
      <path
        d="M10 94 74 40"
        stroke="#fff8aa"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M26 96 78 52"
        stroke="#ffe07a"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path d={STAR} fill="#ffe07a" transform="translate(58 4) scale(0.44)" />
    </>
  ),
  lotus: () => (
    <>
      <ellipse cx="60" cy="98" rx="47" ry="13" fill="#5cc265" />
      <path d="M60 98 96 90q-18-6-36 8Z" fill="#46a852" />
      <path
        d="M60 92C26 88 10 66 22 48c20 8 30 22 38 44Zm0 0c34-4 50-26 38-44-20 8-30 22-38 44Z"
        fill="#ff9eb8"
      />
      <path
        d="M60 92C32 84 18 58 28 38c18 10 26 26 32 54Zm0 0c28-8 42-34 32-54-18 10-26 26-32 54Z"
        fill="#ffb8cc"
      />
      <path d="M60 92C40 74 40 46 60 24c20 22 20 50 0 68Z" fill="#ff7aa2" />
      <circle cx="60" cy="83" r="7" fill="#ffd03b" />
    </>
  ),
  waterlily: () => (
    <>
      <ellipse cx="60" cy="96" rx="44" ry="13" fill="#5cc265" />
      <path d="M60 96 98 90q2 8-8 12Z" fill="#46a852" />
      {[0, 36, 72, 108, 144, 180].map((a, i) => (
        <ellipse
          key={a}
          cx="60"
          cy="58"
          rx="11"
          ry="27"
          fill={i % 2 ? "#cfa5f0" : "#b88be6"}
          transform={`rotate(${a - 90} 60 84)`}
        />
      ))}
      <circle cx="60" cy="78" r="9.5" fill="#ffd03b" />
    </>
  ),
  duck: () => (
    <>
      <ellipse cx="64" cy="82" rx="37" ry="25" fill="#ffd84d" />
      <ellipse cx="56" cy="90" rx="22" ry="12" fill="#ffe88a" opacity="0.7" />
      <path d="M52 78q22-10 36 6-16 14-36-6Z" fill="#f2b824" />
      <path d="M96 69l15-11-4 24Z" fill="#ffd84d" />
      {/* Fluffy duckling head & top tuft */}
      <path d="M38 24q-4-8 3-10 4 2 3 7 4-5 7-1-1 4-6 6Z" fill="#ffd84d" />
      <circle cx="42" cy="46" r="24" fill="#ffd84d" />
      <path d="M21 44 3 49q6 11 19 9Z" fill="#ff8f2b" />
      <Eye x={37} y={42} r={5.6} />
      <Smile x={31} y={53} w={4} open={false} />
      <ellipse cx="45" cy="55" rx="5.2" ry="3.6" fill={BLUSH} />
    </>
  ),
  dragonfly: () => (
    <>
      <ellipse
        cx="35"
        cy="46"
        rx="27"
        ry="11"
        fill="#b8e4f9"
        transform="rotate(-18 35 46)"
      />
      <ellipse
        cx="85"
        cy="46"
        rx="27"
        ry="11"
        fill="#b8e4f9"
        transform="rotate(18 85 46)"
      />
      <ellipse
        cx="38"
        cy="66"
        rx="21"
        ry="8.5"
        fill="#d8f1fc"
        transform="rotate(14 38 66)"
      />
      <ellipse
        cx="82"
        cy="66"
        rx="21"
        ry="8.5"
        fill="#d8f1fc"
        transform="rotate(-14 82 66)"
      />
      <rect x="55" y="40" width="10" height="70" rx="5" fill="#46b588" />
      <path
        d="M55 64h10m-10 14h10m-10 14h10"
        stroke="#33916b"
        strokeWidth="3"
      />
      <circle cx="60" cy="34" r="13.5" fill="#46b588" />
      <Eye x={54.5} y={32} r={4} />
      <Eye x={65.5} y={32} r={4} />
      <Smile x={60} y={38} w={3.5} open={false} />
    </>
  ),
  "pond-lantern": ({ night }) => (
    <>
      <ellipse cx="60" cy="98" rx="40" ry="12" fill="#5cc265" />
      <path d="M60 98 94 92q-14-5-34 6Z" fill="#46a852" />
      {night && <circle cx="60" cy="66" r="42" fill="#fff1b8" opacity="0.38" />}
      <path d="M33 92c0-28 14-49 27-59 13 10 27 31 27 59Z" fill="#ffba42" />
      <path d="M60 33c13 10 27 31 27 59H66q10-30-6-59Z" fill="#eb9426" />
      <circle cx="56" cy="72" r="11" fill="#fff5b8" />
      <rect x="44" y="88" width="32" height="6" rx="3" fill="#c97424" />
    </>
  ),
};
for (const [id, fill] of Object.entries(DISH)) flatMore[id] = dish(fill);
