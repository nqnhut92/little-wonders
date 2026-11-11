import type { ReactNode } from "react";
import { cn } from "../styles";
import { BLUSH, type Draw, INK } from "./ArtFlat";
// The rest of the flat storybook set: crops, food, toys, creatures and region props.
const LINE = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
function Eye({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.32} cy={y - r * 0.32} r={r * 0.32} fill="#fff" />
    </>
  );
}
function Smile({ x, y, w = 6 }: { x: number; y: number; w?: number }) {
  return (
    <path
      d={`M${x - w} ${y}q${w} ${w} ${w * 2} 0`}
      stroke={INK}
      strokeWidth="2.2"
      {...LINE}
    />
  );
}
function Cheeks({
  x1,
  x2,
  y,
  r = 5,
}: {
  x1: number;
  x2: number;
  y: number;
  r?: number;
}) {
  return (
    <>
      <circle cx={x1} cy={y} r={r} fill={BLUSH} />
      <circle cx={x2} cy={y} r={r} fill={BLUSH} />
    </>
  );
}
const STAR = "m60 8 15 33 36 4-27 25 8 36-32-18-32 18 8-36L9 45l36-4Z";
const DISH: Record<string, string> = {
  "dish-soup": "#f0605d",
  "dish-jam": "#d6507a",
  "dish-salad": "#7ccb6f",
  "dish-pie": "#f0a850",
  "dish-juice": "#ff8a94",
  "dish-corncake": "#ffc93c",
  "dish-applesauce": "#f2a56b",
  "dish-pumpkinsoup": "#ff9a3c",
  "dish-cornsoup": "#ffd766",
  "dish-fruitbowl": "#f2788f",
  "dish-tea": "#e9b44c",
  "dish-smoothie": "#e56f9a",
  "dish-mystery": "#b68be6",
  "dish-coconut": "#f6e7c8",
  "dish-chestnut": "#a86a3e",
};
const dish =
  (fill: string): Draw =>
  () => (
    <>
      <ellipse cx="60" cy="100" rx="32" ry="7" fill="#e6dcc6" />
      <path d="M14 60h92c0 28-20 44-46 44S14 88 14 60Z" fill="#ffffff" />
      <path
        d="M22 76c8 18 22 28 38 28s30-10 38-28c-12 12-24 17-38 17S34 88 22 76Z"
        fill="#e9eef5"
      />
      <ellipse cx="60" cy="60" rx="46" ry="12" fill="#ffffff" />
      <ellipse cx="60" cy="60" rx="39" ry="8.5" fill={fill} />
      <ellipse cx="46" cy="58" rx="12" ry="2.6" fill="#fff" opacity="0.45" />
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
      <path d="M10 112q50-28 100 0Z" fill="#f2cf8a" />
      {stage === 1 && (
        <>
          <path d="M68 72h30l-4 30H72Z" fill="#f0605d" />
          <path
            d="M68 72q15-18 30 0"
            stroke="#c9453f"
            strokeWidth="4"
            {...LINE}
          />
          <path
            d="M40 100 51 62"
            stroke="#b07a4e"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <rect x="42" y="56" width="18" height="9" rx="4" fill="#5fb4e0" />
        </>
      )}
      {stage > 1 && (
        <>
          <rect x="28" y="64" width="64" height="38" rx="5" fill="#f7dc9f" />
          <path d="M28 64v-9h12v9m14 0v-9h12v9m14 0v-9h12v9" fill="#f7dc9f" />
          <rect x="28" y="92" width="64" height="10" rx="4" fill="#e6bf74" />
        </>
      )}
      {stage === 3 && (
        <>
          <rect x="43" y="34" width="34" height="26" rx="4" fill="#ffe7b0" />
          <path d="M43 36v-9h9v9m4 0v-9h8v9m4 0v-9h9v9" fill="#ffe7b0" />
          <path
            d="M60 27V6"
            stroke="#b07a4e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M60 7l19 7-19 7Z" fill="#f0605d" />
          <path d="M52 102V84a8 8 0 0 1 16 0v18Z" fill="#b07a4e" />
        </>
      )}
    </>
  );
const snowman =
  (stage: number): Draw =>
  () => (
    <>
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#d5e6f2" />
      <circle cx="60" cy="86" r="27" fill="#ffffff" />
      <path d="M36 98a27 27 0 0 0 48 0q-24 10-48 0Z" fill="#e3eef7" />
      {stage > 1 && <circle cx="60" cy="46" r="19" fill="#ffffff" />}
      {stage === 3 && (
        <>
          <path d="M42 60q18 9 36 0l2 8q-20 9-40 0Z" fill="#f0605d" />
          <path d="M70 66l8 18-11-3Z" fill="#d94a48" />
          <Eye x={53} y={43} r={3.5} />
          <Eye x={67} y={43} r={3.5} />
          <path d="M60 48l17 4-17 3Z" fill="#ff9a3c" />
          <Cheeks x1={47} x2={73} y={52} r={4} />
          <rect x="44" y="24" width="32" height="6" rx="3" fill={INK} />
          <rect x="50" y="8" width="20" height="18" rx="3" fill={INK} />
          <rect x="50" y="19" width="20" height="5" fill="#9b6bd6" />
          <circle cx="60" cy="80" r="2.6" fill={INK} />
          <circle cx="60" cy="92" r="2.6" fill={INK} />
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
        stroke="#4fae5a"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M60 94Q30 66 26 92q14 16 34 2Zm0-14q30-24 32 2-12 14-32-2Z"
        fill="#62c06a"
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse
          key={a}
          cx="60"
          cy="24"
          rx="10"
          ry="20"
          fill={color || "#ffc93c"}
          transform={`rotate(${a} 60 46)`}
        />
      ))}
      <circle cx="60" cy="46" r="15" fill="#8a5a36" />
      <circle cx="55" cy="41" r="4" fill="#a8744a" />
    </>
  ),
  carrot: () => (
    <>
      <path
        d="M58 36 44 10m16 24 4-28m0 28 22-20"
        stroke="#62c06a"
        strokeWidth="8"
        {...LINE}
      />
      <path d="M33 44q27-22 54 0L62 108q-4 8-8 0Z" fill="#ff9a3c" />
      <path d="M72 38q9 2 15 6L62 108q-2 4-4 4Z" fill="#f0822a" />
      <path
        d="M44 58h13m-8 16h10m-5 16h7"
        stroke="#e0711f"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </>
  ),
  apple: fruit("#f0605d", "#d94a48", false),
  berry: fruit("#f2567a", "#d63f66", true),
  tomato: () => (
    <>
      <circle cx="60" cy="70" r="38" fill="#f0605d" />
      <path d="M60 108a38 38 0 0 0 33-57q4 38-45 55 6 2 12 2Z" fill="#d94a48" />
      <path d="M60 36 42 46l14-1-4 12 8-10 8 10-4-12 14 1Z" fill="#4fae5a" />
      <path
        d="M60 36V22"
        stroke="#4fae5a"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse
        cx="40"
        cy="60"
        rx="6"
        ry="9"
        fill="#fff"
        opacity="0.45"
        transform="rotate(24 40 60)"
      />
    </>
  ),
  pumpkin: () => (
    <>
      <path d="M60 36q0-12 8-17" stroke="#4fae5a" strokeWidth="7" {...LINE} />
      <ellipse cx="34" cy="72" rx="22" ry="34" fill="#f0822a" />
      <ellipse cx="86" cy="72" rx="22" ry="34" fill="#f0822a" />
      <ellipse cx="60" cy="72" rx="24" ry="37" fill="#ff9a3c" />
      <ellipse cx="52" cy="52" rx="5" ry="9" fill="#fff" opacity="0.4" />
    </>
  ),
  corn: () => (
    <>
      <path d="M60 10c18 14 22 50 12 80H48C38 60 42 24 60 10Z" fill="#ffc93c" />
      {[28, 42, 56, 70].map((y) =>
        [50, 60, 70].map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#ffdf7a" />
        )),
      )}
      <path d="M60 114c-28-6-36-34-30-56 16 8 26 26 30 56Z" fill="#62c06a" />
      <path d="M60 114c28-6 36-34 30-56-16 8-26 26-30 56Z" fill="#4fae5a" />
    </>
  ),
  watermelon: () => (
    <>
      <path d="M60 32q0-10 8-14" stroke="#4fae5a" strokeWidth="6" {...LINE} />
      <ellipse cx="60" cy="70" rx="46" ry="38" fill="#62c06a" />
      <path
        d="M34 42q12 28 0 56m26-66q12 38 0 76m26-66q-12 28 0 56"
        stroke="#3d9449"
        strokeWidth="7"
        {...LINE}
      />
      <ellipse
        cx="40"
        cy="54"
        rx="6"
        ry="10"
        fill="#fff"
        opacity="0.35"
        transform="rotate(30 40 54)"
      />
    </>
  ),
  blueberry: () => (
    <>
      <path d="M60 36q-6-16 8-24" stroke="#4fae5a" strokeWidth="5" {...LINE} />
      <path d="M64 20q12-10 24-2-10 12-24 2Z" fill="#62c06a" />
      {[
        [42, 64],
        [78, 62],
        [60, 88],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="21" fill="#5f7fe0" />
          <circle cx={x - 7} cy={y - 8} r="5" fill="#9db4f5" />
          <path
            d={`m${x - 5} ${y - 2} 5 4 5-4`}
            stroke="#3f58b0"
            strokeWidth="3"
            {...LINE}
          />
        </g>
      ))}
    </>
  ),
  chestnut: () => (
    <>
      <path d="M60 26q2-10 8-14" stroke="#4fae5a" strokeWidth="5" {...LINE} />
      <path
        d="M60 28C30 32 20 62 30 86q30 24 60 0c10-24 0-54-30-58Z"
        fill="#a86a3e"
      />
      <path
        d="M30 86q30 24 60 0-2-8-6-12-24 12-48 0-4 4-6 12Z"
        fill="#f2d9b0"
      />
      <ellipse
        cx="46"
        cy="50"
        rx="6"
        ry="10"
        fill="#fff"
        opacity="0.3"
        transform="rotate(24 46 50)"
      />
    </>
  ),
  "mushroom-house": ({ night }) => (
    <>
      <rect x="34" y="62" width="52" height="50" rx="8" fill="#fff6e5" />
      <path d="M52 112V90a8 8 0 0 1 16 0v22Z" fill="#b07a4e" />
      <circle cx="74" cy="80" r="7" fill={night ? "#ffd24d" : "#c8ecf7"} />
      <path
        d="M8 70C10 30 40 10 60 10s50 20 52 60q-52 12-104 0Z"
        fill="#f0605d"
      />
      {[
        [30, 46, 8],
        [58, 30, 10],
        [86, 48, 8],
        [48, 62, 5],
        [76, 64, 5],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#fff6e5" />
      ))}
    </>
  ),
  leafpile: () => (
    <>
      <path d="M8 108q52-64 104 0Z" fill="#f0a850" />
      {(
        [
          [30, 90, -30, "#ffc93c"],
          [58, 72, 10, "#f0605d"],
          [86, 90, 40, "#ffc93c"],
          [46, 98, -10, "#d98032"],
          [72, 100, 20, "#f2788f"],
        ] as const
      ).map(([x, y, rot, fill]) => (
        <ellipse
          key={x}
          cx={x}
          cy={y}
          rx="16"
          ry="8"
          fill={fill}
          transform={`rotate(${rot} ${x} ${y})`}
        />
      ))}
    </>
  ),
  hedgehog: () => (
    <>
      <path
        d="M16 96C10 56 46 34 76 46l12-10-2 14 14-4-8 13 13 2-10 10 9 8-12 4c-4 8-12 13-24 13Z"
        fill="#8a5a36"
      />
      <path
        d="M62 96c0-20 12-34 26-34 12 0 22 14 24 28q-4 6-12 6Z"
        fill="#f7e3c8"
      />
      <Eye x={88} y={76} r={4} />
      <circle cx="111" cy="89" r="4.5" fill={INK} />
      <circle cx="80" cy="86" r="4.5" fill={BLUSH} />
      <ellipse cx="40" cy="98" rx="9" ry="5" fill="#f7e3c8" />
      <ellipse cx="74" cy="98" rx="9" ry="5" fill="#f7e3c8" />
    </>
  ),
  squirrel: () => (
    <>
      <path
        d="M72 104c36-4 44-50 20-76-16-16-42-4-34 16 8 16 30 8 24 34Z"
        fill="#d98032"
      />
      <ellipse cx="50" cy="86" rx="23" ry="24" fill="#f0a850" />
      <ellipse cx="48" cy="92" rx="11" ry="14" fill="#fff0d6" />
      <path d="M30 40 27 22l14 9Zm22-2 5-16 8 16Z" fill="#f0a850" />
      <circle cx="44" cy="52" r="20" fill="#f0a850" />
      <Eye x={36} y={50} r={4} />
      <Eye x={52} y={50} r={4} />
      <ellipse cx="44" cy="57" rx="3" ry="2.2" fill={INK} />
      <Cheeks x1={30} x2={58} y={58} r={4} />
      <circle cx="40" cy="78" r="8" fill="#a86a3e" />
      <path d="M33 74q7-6 14 0Z" fill="#8a5a36" />
    </>
  ),
  woodpecker: () => (
    <>
      <rect x="28" y="8" width="18" height="108" rx="8" fill="#b07a4e" />
      <rect x="38" y="8" width="8" height="108" rx="4" fill="#96643c" />
      <path
        d="M46 96c-4-26 2-52 22-58 18-4 28 14 22 32-6 16-24 24-44 26Z"
        fill="#4a5568"
      />
      <ellipse cx="66" cy="76" rx="10" ry="14" fill="#fff6e5" />
      <circle cx="74" cy="46" r="17" fill="#fff6e5" />
      <path d="M60 38q10-16 28-6-12 0-16 10Z" fill="#f0605d" />
      <path d="M89 44l22 5-22 6Z" fill="#ffc93c" />
      <Eye x={78} y={46} r={4} />
      <circle cx="70" cy="54" r="4" fill={BLUSH} />
    </>
  ),
  "coconut-tree": () => (
    <>
      <path d="M52 116q-4-48 8-84h10q-10 36-4 84Z" fill="#c99a6b" />
      <path
        d="M57 60h11m-12 18h11m-11 18h12"
        stroke="#a87c50"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {[
        "M64 34Q28 14 6 40q30-10 58-6Z",
        "M64 34Q40 0 14 6q30 6 50 28Z",
        "M64 34Q90 0 112 10q-30 4-48 24Z",
        "M64 34q38-14 52 16-24-16-52-16Z",
      ].map((d, i) => (
        <path key={d} d={d} fill={i % 2 ? "#4fae5a" : "#62c06a"} />
      ))}
      <circle cx="56" cy="42" r="9" fill="#8a5a36" />
      <circle cx="71" cy="45" r="9" fill="#a86a3e" />
    </>
  ),
  coconut: () => (
    <>
      <circle cx="60" cy="68" r="38" fill="#a86a3e" />
      <path d="M60 106a38 38 0 0 0 34-55q2 36-46 53 6 2 12 2Z" fill="#8a5a36" />
      {[
        [50, 62],
        [70, 62],
        [60, 78],
      ].map(([x, y]) => (
        <circle key={x * y} cx={x} cy={y} r="4.5" fill={INK} />
      ))}
      <ellipse
        cx="42"
        cy="50"
        rx="6"
        ry="9"
        fill="#fff"
        opacity="0.3"
        transform="rotate(30 42 50)"
      />
    </>
  ),
  shell: () => (
    <>
      <path d="M60 106 18 60c0-26 18-42 42-42s42 16 42 42Z" fill="#ffb3a7" />
      <path
        d="M60 106 34 30m26 76L50 20m10 86 10-86m-10 86 26-76"
        stroke="#f2877a"
        strokeWidth="4"
        {...LINE}
      />
      <circle cx="60" cy="104" r="8" fill="#f2877a" />
    </>
  ),
  sand: () => (
    <>
      <path d="M8 106q52-54 104 0Z" fill="#f2cf8a" />
      <path d="M60 79q30 6 52 27H60Z" fill="#e6bf74" />
    </>
  ),
  crab: () => (
    <>
      <path
        d="M26 70 12 58m82 12 14-12M30 90l-14 10m74-10 14 10M36 98l-8 12m56-12 8 12"
        stroke="#d94a48"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="14" cy="46" r="12" fill="#f0605d" />
      <circle cx="106" cy="46" r="12" fill="#f0605d" />
      <path
        d="M14 46 8 34m98 12 6-12"
        stroke="#fff6e5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="78" rx="36" ry="26" fill="#f0605d" />
      <path
        d="M48 56V44m24 12V44"
        stroke="#f0605d"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <Eye x={48} y={42} r={6} />
      <Eye x={72} y={42} r={6} />
      <Smile x={60} y={80} w={8} />
      <Cheeks x1={40} x2={80} y={80} />
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
      <ellipse cx="34" cy="96" rx="12" ry="7" fill="#9bd68a" />
      <ellipse cx="76" cy="96" rx="12" ry="7" fill="#9bd68a" />
      <circle cx="98" cy="70" r="16" fill="#9bd68a" />
      <path d="M12 92q6-52 44-52t42 52Z" fill="#4fae5a" />
      <path
        d="M36 62l12-10h16l12 10-6 16H42Zm-18 30 12-14m58 14-10-14"
        stroke="#3d9449"
        strokeWidth="4"
        {...LINE}
      />
      <Eye x={102} y={66} r={4} />
      <Smile x={104} y={75} w={4} />
      <circle cx="94" cy="76" r="3.5" fill={BLUSH} />
    </>
  ),
  seagull: () => (
    <>
      <path
        d="M6 58q28-26 54 6 26-32 54-6-28-6-54 20Q34 52 6 58Z"
        fill="#ffffff"
      />
      <path
        d="M6 58q10-6 20-6-6 4-10 8Zm108 0q-10-6-20-6 6 4 10 8Z"
        fill="#8a97a8"
      />
      <path d="M56 72l4 12 4-12Z" fill="#ffb020" />
      <Eye x={54} y={64} r={2.6} />
      <Eye x={66} y={64} r={2.6} />
    </>
  ),
  "pine-snow": () => (
    <>
      <rect x="53" y="92" width="14" height="24" rx="4" fill="#b07a4e" />
      {[
        [98, 50, "#3d9449"],
        [74, 40, "#4fae5a"],
        [50, 30, "#62c06a"],
      ].map(([base, w, fill]) => (
        <path
          key={base}
          d={`M${60 - Number(w)} ${base}L60 ${Number(base) - 46} ${60 + Number(w)} ${base}Z`}
          fill={String(fill)}
          strokeLinejoin="round"
          stroke={String(fill)}
          strokeWidth="6"
        />
      ))}
      <path
        d="M48 26 60 2l12 24q-6-5-12 0-6-5-12 0Zm-12 30 9-16q7 6 15 0 8 6 15 0l9 16q-8-6-12 0-6-6-12 0-6-6-12 0-4-6-12 0Z"
        fill="#ffffff"
      />
    </>
  ),
  pinecone: () => (
    <>
      <path
        d="M60 16c24 10 32 42 26 64-6 20-16 28-26 32-10-4-20-12-26-32-6-22 2-54 26-64Z"
        fill="#b07a4e"
      />
      {[36, 54, 72, 90].map((y) => (
        <path
          key={y}
          d={`M38 ${y}q11 12 22 0 11 12 22 0`}
          stroke="#8a5a36"
          strokeWidth="5"
          {...LINE}
        />
      ))}
      <path d="M60 16q2-8 8-10" stroke="#8a5a36" strokeWidth="5" {...LINE} />
    </>
  ),
  "snowman-1": snowman(1),
  "snowman-2": snowman(2),
  "snowman-3": snowman(3),
  "polar-bear": () => (
    <>
      <ellipse cx="60" cy="90" rx="36" ry="26" fill="#ffffff" />
      <ellipse cx="60" cy="98" rx="18" ry="14" fill="#eef4fa" />
      <circle cx="36" cy="26" r="11" fill="#ffffff" />
      <circle cx="84" cy="26" r="11" fill="#ffffff" />
      <circle cx="36" cy="26" r="5.5" fill={BLUSH} />
      <circle cx="84" cy="26" r="5.5" fill={BLUSH} />
      <ellipse cx="60" cy="50" rx="32" ry="28" fill="#ffffff" />
      <ellipse cx="60" cy="60" rx="14" ry="10" fill="#eef4fa" />
      <Eye x={47} y={46} r={5} />
      <Eye x={73} y={46} r={5} />
      <ellipse cx="60" cy="56" rx="5.5" ry="3.8" fill={INK} />
      <Smile x={60} y={62} w={5} />
      <Cheeks x1={38} x2={82} y={58} />
      <path d="M40 76q20 10 40 0l1 7q-21 10-42 0Z" fill="#5fb4e0" />
    </>
  ),
  penguin: () => (
    <>
      <ellipse cx="46" cy="110" rx="12" ry="6" fill="#ffb020" />
      <ellipse cx="74" cy="110" rx="12" ry="6" fill="#ffb020" />
      <path
        d="M60 10c-26 0-36 36-36 62s14 38 36 38 36-12 36-38-10-62-36-62Z"
        fill="#3f4d63"
      />
      <path
        d="M60 38c-10-10-24-4-24 12 0 10 4 16 4 26 0 18 8 30 20 30s20-12 20-30c0-10 4-16 4-26 0-16-14-22-24-12Z"
        fill="#ffffff"
      />
      <Eye x={48} y={48} r={4.5} />
      <Eye x={72} y={48} r={4.5} />
      <path d="M52 56h16l-8 10Z" fill="#ffb020" />
      <Cheeks x1={42} x2={78} y={60} r={4.5} />
    </>
  ),
  sled: () => (
    <>
      <path
        d="M10 98h88q14 0 14-16"
        stroke="#b07a4e"
        strokeWidth="7"
        {...LINE}
      />
      <path
        d="M28 84v14m52-14v14"
        stroke="#b07a4e"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="12" y="66" width="88" height="18" rx="8" fill="#f0605d" />
      <rect x="12" y="76" width="88" height="8" rx="4" fill="#d94a48" />
    </>
  ),
  snowflake: () => (
    <g stroke="#7cc4ee" strokeWidth="7" {...LINE}>
      {[0, 60, 120].map((r) => (
        <path
          key={r}
          d="M60 14v92m-13-78 13 11 13-11m-26 64 13-11 13 11"
          transform={`rotate(${r} 60 60)`}
        />
      ))}
    </g>
  ),
  telescope: () => (
    <>
      <path
        d="M60 72 36 114m24-42 24 42m-24-42v42"
        stroke="#b07a4e"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M20 74 84 30l14 20-64 44Z" fill="#7d8ef0" />
      <path d="M27 84 91 40l7 10-64 44Z" fill="#6676d6" />
      <path d="M84 30l8-5 14 20-8 5Z" fill="#ffc93c" />
      <circle cx="60" cy="72" r="6" fill="#8a5a36" />
    </>
  ),
  "moon-face": () => (
    <>
      <circle cx="60" cy="60" r="48" fill="#ffe89a" />
      <circle cx="36" cy="38" r="8" fill="#f5d670" />
      <circle cx="86" cy="84" r="6" fill="#f5d670" />
      <circle cx="84" cy="30" r="4" fill="#f5d670" />
      <path
        d="M40 58q6-8 12 0m16 0q6-8 12 0"
        stroke={INK}
        strokeWidth="3"
        {...LINE}
      />
      <Smile x={60} y={72} w={9} />
      <Cheeks x1={38} x2={82} y={72} r={5.5} />
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
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="60" cy="62" r="40" fill="#fff1b8" opacity="0.35" />
      <path d={STAR} fill="#ffc93c" transform="translate(9 20) scale(0.85)" />
      <Eye x={52} y={62} r={3.2} />
      <Eye x={68} y={62} r={3.2} />
      <Smile x={60} y={69} w={5} />
    </>
  ),
  butterfly: () => (
    <>
      <ellipse
        cx="34"
        cy="44"
        rx="25"
        ry="31"
        fill="#f58fb8"
        transform="rotate(-25 34 44)"
      />
      <ellipse
        cx="86"
        cy="44"
        rx="25"
        ry="31"
        fill="#f58fb8"
        transform="rotate(25 86 44)"
      />
      <ellipse cx="38" cy="84" rx="18" ry="21" fill="#ffc93c" />
      <ellipse cx="82" cy="84" rx="18" ry="21" fill="#ffc93c" />
      <circle cx="32" cy="42" r="8" fill="#ffd0e2" />
      <circle cx="88" cy="42" r="8" fill="#ffd0e2" />
      <circle cx="38" cy="86" r="5" fill="#ffe7a8" />
      <circle cx="82" cy="86" r="5" fill="#ffe7a8" />
      <path
        d="M56 30 48 14m16 16 8-16"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="53" y="28" width="14" height="72" rx="7" fill="#7a5aa8" />
      <Eye x={56.5} y={40} r={2.4} />
      <Eye x={63.5} y={40} r={2.4} />
    </>
  ),
  worm: () => (
    <>
      <path
        d="M17 82q13-40 28-8t30 0 22-14"
        stroke="#9bd68a"
        strokeWidth="24"
        {...LINE}
      />
      <circle cx="98" cy="54" r="18" fill="#9bd68a" />
      <Eye x={92} y={50} r={3.6} />
      <Eye x={105} y={50} r={3.6} />
      <Smile x={98} y={58} w={5} />
      <Cheeks x1={87} x2={109} y={59} r={3.2} />
    </>
  ),
  bird: () => (
    <>
      <path
        d="M46 94v16m22-16v16"
        stroke="#ffb020"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M26 62 4 50l6 28Z" fill="#4a9fd0" />
      <Critter body="#5fb4e0">
        <ellipse cx="62" cy="80" rx="20" ry="13" fill="#d8f0fb" />
        <path d="M40 60q16 26 34 0Z" fill="#4a9fd0" />
        <path d="M94 56l20 8-20 8Z" fill="#ffb020" />
        <Eye x={80} y={54} />
        <circle cx="78" cy="68" r="4.5" fill={BLUSH} />
      </Critter>
    </>
  ),
  fish: () => (
    <>
      <path d="M28 66 4 44v44Z" fill="#f0822a" />
      <path d="M52 40q10-18 26-6Z" fill="#f0822a" />
      <Critter body="#ff9a3c">
        <path
          d="M44 48q12 18 0 36m16-40q12 22 0 44"
          stroke="#ffd0a0"
          strokeWidth="5"
          {...LINE}
        />
        <Eye x={80} y={58} />
        <Smile x={86} y={72} w={4} />
        <circle cx="74" cy="72" r="4.5" fill={BLUSH} />
      </Critter>
    </>
  ),
  bug: () => (
    <>
      <path
        d="M44 30 36 16m40 14 8-14"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Critter body="#f0605d">
        <path d="M60 37v58" stroke={INK} strokeWidth="3" />
        {[
          [42, 58],
          [78, 58],
          [46, 80],
          [74, 80],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill={INK} />
        ))}
      </Critter>
      <path d="M32 50a36 29 0 0 1 56 0q-28 12-56 0Z" fill={INK} />
      <circle cx="50" cy="46" r="3.6" fill="#fff" />
      <circle cx="70" cy="46" r="3.6" fill="#fff" />
    </>
  ),
  "decor-sunflower": () => (
    <>
      <path
        d="M60 92V54"
        stroke="#4fae5a"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse
          key={a}
          cx="60"
          cy="27"
          rx="12"
          ry="20"
          fill="#ffc93c"
          transform={`rotate(${a} 60 46)`}
        />
      ))}
      <circle cx="60" cy="46" r="14" fill="#8a5a36" />
      <path d="M40 88h40l-5 24H45Z" fill="#e8654f" />
      <rect x="37" y="84" width="46" height="9" rx="4" fill="#f58a70" />
    </>
  ),
  "decor-pumpkin-lamp": ({ night }) => (
    <>
      <path d="M60 36q0-12 7-16" stroke="#4fae5a" strokeWidth="7" {...LINE} />
      <ellipse cx="34" cy="72" rx="22" ry="34" fill="#f0822a" />
      <ellipse cx="86" cy="72" rx="22" ry="34" fill="#f0822a" />
      <ellipse cx="60" cy="72" rx="24" ry="37" fill="#ff9a3c" />
      <path
        d="M40 64l9-9 8 9Zm23 0 8-9 9 9Zm-19 16q16 12 32 0l-5-1-4 4-4-4-6 0-4 4-4-4Z"
        fill={night ? "#fff3a8" : "#7a4a22"}
      />
    </>
  ),
  rock: () => (
    <>
      <path
        d="M10 100 22 56q4-10 14-14l22-8q10-2 18 4l16 12q6 6 8 14l10 36q-50 14-100 0Z"
        fill="#a9b4c2"
      />
      <path
        d="M60 34q10-2 18 4l16 12q6 6 8 14l10 36q-22 6-46 7 20-30-6-73Z"
        fill="#8f9bab"
      />
      <path d="M22 96q8-10 16 0t16 0" fill="#62c06a" />
    </>
  ),
  grass: () => (
    <>
      <path
        d="M6 108 18 52l14 38 10-64 14 62 18-46 8 50 22-30 10 46Z"
        fill="#62c06a"
      />
      <path d="M56 88 74 42l8 50 22-30 10 46H52Z" fill="#4fae5a" />
    </>
  ),
  pond: () => (
    <>
      <ellipse cx="60" cy="74" rx="57" ry="33" fill="#bfe6f7" />
      <ellipse cx="60" cy="72" rx="52" ry="29" fill="#5fb4e0" />
      <path
        d="M28 66q10-6 20 0m24 16q10-6 20 0"
        stroke="#bfe6f7"
        strokeWidth="4"
        {...LINE}
      />
      <path d="M70 62a16 10 0 1 1 30 4l-14-5Z" fill="#62c06a" />
    </>
  ),
  rainbow: () => (
    <>
      {["#f0605d", "#ff9a3c", "#ffc93c", "#62c06a", "#5fb4e0", "#9b6bd6"].map(
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
      <circle cx="16" cy="100" r="14" fill="#fff" />
      <circle cx="32" cy="104" r="10" fill="#fff" />
      <circle cx="104" cy="100" r="14" fill="#fff" />
      <circle cx="88" cy="104" r="10" fill="#fff" />
    </>
  ),
  basket: () => (
    <>
      <path d="M22 56q38-70 76 0" stroke="#b07a4e" strokeWidth="9" {...LINE} />
      <path d="m12 54 14 52q2 6 8 6h52q6 0 8-6l14-52Z" fill="#e8b777" />
      <path d="M17 72h86l-5 18H22Z" fill="#d49a55" />
      <rect x="8" y="48" width="104" height="12" rx="6" fill="#f2cf9a" />
    </>
  ),
  star: () => (
    <>
      <path
        d={STAR}
        fill="#ffc93c"
        stroke="#ffc93c"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <Eye x={51} y={58} r={4} />
      <Eye x={69} y={58} r={4} />
      <Smile x={60} y={67} w={5} />
      <Cheeks x1={42} x2={78} y={66} r={4} />
    </>
  ),
  owl: () => (
    <>
      <path d="M32 40 30 18l18 12Zm56 0 2-22-18 12Z" fill="#a86a3e" />
      <ellipse cx="60" cy="68" rx="34" ry="40" fill="#b9814f" />
      <ellipse cx="60" cy="82" rx="20" ry="22" fill="#f7e3c8" />
      <path
        d="M50 78q4 4 8 0m4 0q4 4 8 0m-14 10q4 4 8 0"
        stroke="#d9b98c"
        strokeWidth="2.6"
        {...LINE}
      />
      <ellipse
        cx="24"
        cy="76"
        rx="8"
        ry="20"
        fill="#a86a3e"
        transform="rotate(12 24 76)"
      />
      <ellipse
        cx="96"
        cy="76"
        rx="8"
        ry="20"
        fill="#a86a3e"
        transform="rotate(-12 96 76)"
      />
      <circle cx="46" cy="52" r="13" fill="#fff" />
      <circle cx="74" cy="52" r="13" fill="#fff" />
      <Eye x={47} y={53} r={6} />
      <Eye x={73} y={53} r={6} />
      <path d="m54 62 6 9 6-9Z" fill="#ffb020" />
    </>
  ),
  frog: () => (
    <>
      <ellipse cx="30" cy="98" rx="14" ry="7" fill="#4fae5a" />
      <ellipse cx="90" cy="98" rx="14" ry="7" fill="#4fae5a" />
      <circle cx="42" cy="44" r="14" fill="#62c06a" />
      <circle cx="78" cy="44" r="14" fill="#62c06a" />
      <ellipse cx="60" cy="74" rx="38" ry="28" fill="#62c06a" />
      <ellipse cx="60" cy="88" rx="22" ry="12" fill="#c8f0b8" />
      <circle cx="42" cy="43" r="9" fill="#fff" />
      <circle cx="78" cy="43" r="9" fill="#fff" />
      <Eye x={43} y={44} r={5} />
      <Eye x={77} y={44} r={5} />
      <Smile x={60} y={68} w={12} />
      <Cheeks x1={36} x2={84} y={70} />
    </>
  ),
  snail: () => (
    <>
      <path
        d="M92 66 88 46m12 22 6-18"
        stroke="#f2cf9a"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle cx="88" cy="44" r="4" fill={INK} />
      <circle cx="107" cy="48" r="4" fill={INK} />
      <path
        d="M14 100q-2-10 10-10h52q10 0 12-14 2-12 12-12t12 12q0 24-22 24Z"
        fill="#f2cf9a"
      />
      <circle cx="50" cy="66" r="28" fill="#f58a70" />
      <path
        d="M50 66c0-9 11-9 11 0 0 14-21 14-21 0 0-19 30-19 30 0"
        stroke="#d9634c"
        strokeWidth="4.5"
        {...LINE}
      />
      <Smile x={102} y={80} w={4} />
      <circle cx="94" cy="80" r="3.5" fill={BLUSH} />
    </>
  ),
  windmill: () => (
    <>
      <path d="M52 54h16l6 60H46Z" fill="#fff6e5" />
      <path d="M60 54h8l6 60H60Z" fill="#f0dfc0" />
      <path d="M54 114V98a6 6 0 0 1 12 0v16Z" fill="#b07a4e" />
      <g className={cn("windmill-blades")}>
        {[0, 90, 180, 270].map((a) => (
          <path
            key={a}
            d="M60 54 46 14q14-8 28 0Z"
            fill={["#f0605d", "#ffc93c", "#5fb4e0", "#62c06a"][a / 90]}
            transform={`rotate(${a} 60 54)`}
          />
        ))}
        <circle cx="60" cy="54" r="8" fill="#ffffff" />
        <circle cx="60" cy="54" r="3.5" fill="#9b6bd6" />
      </g>
    </>
  ),
  xylophone: () => (
    <>
      <path d="M8 44h104l-8 44H16Z" fill="#b07a4e" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect
          key={i}
          x={15 + i * 11.5}
          y={40 + i * 1.5}
          width="9"
          height={52 - i * 3}
          rx="4"
          fill={
            [
              "#f0605d",
              "#ff9a3c",
              "#ffc93c",
              "#62c06a",
              "#4fb58a",
              "#5fb4e0",
              "#7d8ef0",
              "#9b6bd6",
            ][i]
          }
        />
      ))}
    </>
  ),
  "fx-moon": () => (
    <path d="M72 18a40 40 0 1 0 34 58A30 30 0 0 1 72 18Z" fill="#ffe07a" />
  ),
  "fx-firefly": () => (
    <>
      <circle cx="60" cy="60" r="22" fill="#fff8aa" opacity="0.45" />
      <circle cx="60" cy="60" r="10" fill="#ffe45c" />
    </>
  ),
  "fx-shooting-star": () => (
    <>
      <path
        d="M12 92 74 40"
        stroke="#fff8aa"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path d={STAR} fill="#ffe07a" transform="translate(58 4) scale(0.42)" />
    </>
  ),
  lotus: () => (
    <>
      <ellipse cx="60" cy="98" rx="46" ry="12" fill="#62c06a" />
      <path d="M60 98 96 90q-18-6-36 8Z" fill="#4fae5a" />
      <path
        d="M60 92C30 86 16 62 26 44c18 8 28 24 34 48Zm0 0c30-6 44-30 34-48-18 8-28 24-34 48Z"
        fill="#ffb3cc"
      />
      <path d="M60 92C40 76 40 48 60 28c20 20 20 48 0 64Z" fill="#f58fb8" />
      <circle cx="60" cy="84" r="6" fill="#ffc93c" />
    </>
  ),
  waterlily: () => (
    <>
      <ellipse cx="60" cy="96" rx="42" ry="12" fill="#62c06a" />
      <path d="M60 96 98 90q2 8-8 12Z" fill="#4fae5a" />
      {[0, 45, 90, 135, 180].map((a) => (
        <ellipse
          key={a}
          cx="60"
          cy="58"
          rx="11"
          ry="26"
          fill={a % 90 ? "#c79bea" : "#b68be6"}
          transform={`rotate(${a - 90} 60 84)`}
        />
      ))}
      <circle cx="60" cy="78" r="9" fill="#ffc93c" />
    </>
  ),
  duck: () => (
    <>
      <ellipse cx="64" cy="82" rx="36" ry="24" fill="#ffd84d" />
      <path d="M52 78q20-8 34 6-16 12-34-6Z" fill="#f5bf2a" />
      <path d="M96 70l14-10-4 22Z" fill="#ffd84d" />
      <circle cx="42" cy="46" r="23" fill="#ffd84d" />
      <path d="M22 46 4 50q6 10 18 8Z" fill="#ff9a3c" />
      <Eye x={38} y={42} />
      <circle cx="44" cy="56" r="4.5" fill={BLUSH} />
    </>
  ),
  dragonfly: () => (
    <>
      <ellipse
        cx="36"
        cy="46"
        rx="26"
        ry="10"
        fill="#bfe6f7"
        transform="rotate(-18 36 46)"
      />
      <ellipse
        cx="84"
        cy="46"
        rx="26"
        ry="10"
        fill="#bfe6f7"
        transform="rotate(18 84 46)"
      />
      <ellipse
        cx="38"
        cy="66"
        rx="20"
        ry="8"
        fill="#d8f0fb"
        transform="rotate(14 38 66)"
      />
      <ellipse
        cx="82"
        cy="66"
        rx="20"
        ry="8"
        fill="#d8f0fb"
        transform="rotate(-14 82 66)"
      />
      <rect x="55" y="40" width="10" height="70" rx="5" fill="#4fb58a" />
      <path
        d="M55 64h10m-10 14h10m-10 14h10"
        stroke="#3a9470"
        strokeWidth="3"
      />
      <circle cx="60" cy="34" r="12" fill="#4fb58a" />
      <Eye x={55} y={32} r={3.4} />
      <Eye x={65} y={32} r={3.4} />
    </>
  ),
  "pond-lantern": ({ night }) => (
    <>
      <ellipse cx="60" cy="98" rx="38" ry="11" fill="#62c06a" />
      {night && <circle cx="60" cy="66" r="40" fill="#fff1b8" opacity="0.35" />}
      <path d="M34 92c0-28 14-48 26-58 12 10 26 30 26 58Z" fill="#ffb84d" />
      <path d="M60 34c12 10 26 30 26 58H66q10-30-6-58Z" fill="#f59a2e" />
      <circle cx="56" cy="74" r="10" fill="#fff3a8" />
    </>
  ),
};
for (const [id, fill] of Object.entries(DISH)) flatMore[id] = dish(fill);
