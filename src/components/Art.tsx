import { cn } from "../styles";
export const assetIds = [
  "tree",
  "cloud",
  "sun",
  "flower",
  "carrot",
  "berry",
  "butterfly",
  "worm",
  "bug",
  "bird",
  "rabbit",
  "puppy",
  "reindeer",
  "fish",
  "apple",
  "house",
  "rainbow",
  "rock",
  "grass",
  "pond",
  "basket",
  "star",
  "tomato",
  "pumpkin",
  "corn",
  "watermelon",
  "dish-soup",
  "dish-jam",
  "dish-salad",
  "dish-pie",
  "dish-juice",
  "dish-corncake",
  "dish-applesauce",
  "dish-pumpkinsoup",
  "dish-cornsoup",
  "dish-fruitbowl",
  "dish-tea",
  "dish-smoothie",
  "dish-mystery",
  "decor-sunflower",
  "decor-pumpkin-lamp",
  "owl",
  "frog",
  "snail",
  "windmill",
  "xylophone",
  "fx-moon",
  "fx-firefly",
  "fx-shooting-star",
  "lotus",
  "waterlily",
  "duck",
  "dragonfly",
  "pond-lantern",
  "blueberry",
  "chestnut",
  "mushroom-house",
  "leafpile",
  "hedgehog",
  "squirrel",
  "woodpecker",
  "coconut-tree",
  "coconut",
  "shell",
  "sand",
  "crab",
  "sandcastle-1",
  "sandcastle-2",
  "sandcastle-3",
  "wave",
  "turtle",
  "seagull",
  "pine-snow",
  "pinecone",
  "snowman-1",
  "snowman-2",
  "snowman-3",
  "polar-bear",
  "penguin",
  "sled",
  "snowflake",
  "telescope",
  "moon-face",
  "constellation-1",
  "constellation-2",
  "constellation-3",
  "constellation-4",
  "star-lantern",
  "dish-coconut",
  "dish-chestnut",
];
const rasterIds = new Set([
  "puppy",
  "reindeer",
  "house",
  "tree",
  "sun",
  "rabbit",
  "flower",
  "basket",
  "rock",
  "owl",
  "frog",
]);
// A bunny-shaped constellation: body, then ears, lit a few stars per stage.
const CONSTELLATION = [
  [30, 96],
  [46, 70],
  [60, 58],
  [74, 70],
  [90, 96],
  [52, 30],
  [48, 8],
  [68, 30],
  [72, 8],
];
export function Art({
  id,
  color,
  night,
}: {
  id: string;
  color?: string;
  night?: boolean;
}) {
  if (id === "cloud") {
    return (
      <span className={cn("art art-cloud art-raster-wrap")}>
        <img
          src="/assets/cloud.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          className={cn("art-img")}
        />
        <svg viewBox="0 0 120 120" aria-hidden="true" className={cn("art-fx")}>
          <path
            className={cn("raindrops")}
            d="m32 90-6 14m32-14-6 14m32-14-6 14"
            stroke="#6bb3c9"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  if (rasterIds.has(id)) {
    const tint =
      id === "house" && color && color !== "#efcf9d"
        ? { filter: `drop-shadow(0 0 10px ${color}aa)` }
        : undefined;
    return (
      <img
        src={`/assets/${id}.png`}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={tint}
        className={cn(`art art-${id}`)}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn(`art art-${id}`)}
    >
      <defs>
        <radialGradient id="lw-gold" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d99b38" />
        </radialGradient>
        <radialGradient id="lw-berry" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f29aa4" />
          <stop offset="100%" stopColor="#c95062" />
        </radialGradient>
        <radialGradient id="lw-apple" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f5a58a" />
          <stop offset="100%" stopColor="#d15f47" />
        </radialGradient>
        <radialGradient id="lw-tomato" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f78b7d" />
          <stop offset="100%" stopColor="#c9493b" />
        </radialGradient>
        <radialGradient id="lw-melon" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#a3cf7e" />
          <stop offset="100%" stopColor="#568946" />
        </radialGradient>
        <linearGradient id="lw-carrot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7b174" />
          <stop offset="100%" stopColor="#d86c36" />
        </linearGradient>
        <linearGradient id="lw-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5e0e4" />
          <stop offset="100%" stopColor="#6eaeb8" />
        </linearGradient>
        <linearGradient id="lw-wicker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ebd09e" />
          <stop offset="100%" stopColor="#b99058" />
        </linearGradient>
      </defs>
      <g
        stroke="#52684e"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {id === "flower" && (
          <>
            <path d="M60 112V52" stroke="#5b8e51" strokeWidth="6" />
            <path
              d="M59 90Q22 60 27 89q12 18 32 10m2-22q34-26 29 1-9 14-29 13"
              fill="#86b86e"
            />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <ellipse
                key={a}
                cx="60"
                cy="25"
                rx="10"
                ry="21"
                fill={color || "url(#lw-gold)"}
                transform={`rotate(${a} 60 46)`}
              />
            ))}
            <circle cx="60" cy="46" r="15" fill="#8d6539" />
            <circle cx="55" cy="42" r="3" fill="#b78a54" stroke="none" />
          </>
        )}
        {id === "carrot" && (
          <>
            <path
              d="m56 34-10-24m15 22 6-26m-3 28L88 15"
              stroke="#689b55"
              strokeWidth="7"
            />
            <path
              d="M32 43q26-23 53 1L51 112Q35 96 32 43"
              fill="url(#lw-carrot)"
            />
            <path d="m41 56 16 4m-13 13 12 4m-9 13 8 3" stroke="#b9582a" />
            <path d="M44 45q10-4 20 0" stroke="#ffd8b3" fill="none" />
          </>
        )}
        {id.startsWith("dish-") && (
          <>
            <ellipse cx="60" cy="98" rx="34" ry="8" fill="#e8dec7" />
            <path d="M14 60h92c0 28-20 44-46 44S14 88 14 60Z" fill="#fffdf4" />
            <path d="M22 68q16 20 38 20" stroke="#e3d8be" fill="none" />
            <ellipse
              cx="60"
              cy="60"
              rx="45"
              ry="11"
              fill={
                {
                  "dish-soup": "#e4695a",
                  "dish-jam": "#c8506a",
                  "dish-salad": "#8ab16e",
                  "dish-pie": "#e0a35a",
                  "dish-juice": "#ef7d86",
                  "dish-corncake": "#f2c94c",
                  "dish-applesauce": "#e69c6d",
                  "dish-pumpkinsoup": "#ee9b45",
                  "dish-cornsoup": "#f4ce6a",
                  "dish-fruitbowl": "#e8788a",
                  "dish-tea": "#e9bd58",
                  "dish-smoothie": "#d96f86",
                  "dish-mystery": "#b79bd6",
                  "dish-coconut": "#f4efe0",
                  "dish-chestnut": "#9b6640",
                }[id] ?? "#e9bd58"
              }
            />
            <ellipse
              cx="48"
              cy="58"
              rx="14"
              ry="3.5"
              fill="#fff8e8"
              stroke="none"
              opacity="0.55"
            />
          </>
        )}
        {id === "blueberry" && (
          <>
            <path d="M58 30q-6-14 8-20" stroke="#78a863" strokeWidth="5" />
            {[
              [44, 66],
              [74, 62],
              [58, 88],
            ].map(([cx, cy]) => (
              <g key={cx}>
                <circle cx={cx} cy={cy} r="20" fill="#5d6fb3" />
                <path d={`m${cx - 5} ${cy - 12} 5 4 5-4`} stroke="#c9d3f2" />
              </g>
            ))}
          </>
        )}
        {id === "chestnut" && (
          <>
            <path
              d="M60 30C32 34 22 64 32 88q28 22 56 0c10-24 0-54-28-58Z"
              fill="#9b6640"
            />
            <path d="M34 82q26 12 52 0" stroke="#e8cfa8" strokeWidth="6" />
            <path d="M60 30q2-12 8-16" stroke="#78a863" strokeWidth="5" />
          </>
        )}
        {id === "mushroom-house" && (
          <>
            <path d="M34 66h52v44H34Z" fill="#fff5df" />
            <path d="M52 110V86q8-10 16 0v24" fill="#c99a6b" />
            <circle cx="72" cy="78" r="6" fill="#bfe1ea" />
            <path d="M8 70C10 30 40 12 60 12s50 18 52 58Z" fill="#df6f5d" />
            {[
              [30, 44, 7],
              [58, 30, 9],
              [86, 46, 7],
              [46, 58, 5],
              [76, 60, 5],
            ].map(([cx, cy, r]) => (
              <circle
                key={cx}
                cx={cx}
                cy={cy}
                r={r}
                fill="#fff5df"
                stroke="none"
              />
            ))}
          </>
        )}
        {id === "leafpile" && (
          <>
            <path d="M10 104q50-60 100 0Z" fill="#d99a4e" />
            {[
              [30, 86, -30, "#e9bd58"],
              [58, 72, 10, "#c9703f"],
              [84, 88, 40, "#e9bd58"],
              [48, 96, -10, "#b9853f"],
              [72, 98, 20, "#d88a4a"],
            ].map(([cx, cy, rot, fill]) => (
              <ellipse
                key={String(cx)}
                cx={cx}
                cy={cy}
                rx="16"
                ry="8"
                fill={String(fill)}
                transform={`rotate(${rot} ${cx} ${cy})`}
              />
            ))}
          </>
        )}
        {id === "hedgehog" && (
          <>
            <path
              d="M18 92C14 56 50 38 78 50l14-8-4 14 14-2-10 12 12 4-12 8c-2 12-12 18-26 18H26Z"
              fill="#9b7a5c"
            />
            <path d="M74 64c14 0 26 10 30 26H70Z" fill="#f3dcc0" />
            <circle cx="88" cy="76" r="3.5" fill="#52684e" />
            <circle cx="104" cy="88" r="4" fill="#52684e" />
            <circle cx="84" cy="86" r="4" fill="#edb9a6" stroke="none" />
          </>
        )}
        {id === "squirrel" && (
          <>
            <path
              d="M74 100c34-6 40-50 18-74-16-16-40-4-32 14 8 16 30 10 26 32"
              fill="#d08a4f"
            />
            <ellipse cx="50" cy="84" rx="22" ry="22" fill="#e09a5c" />
            <circle cx="42" cy="54" r="16" fill="#e09a5c" />
            <path d="M34 42l-4-14 12 8Z" fill="#e09a5c" />
            <circle cx="38" cy="52" r="3" fill="#52684e" />
            <ellipse cx="50" cy="90" rx="10" ry="12" fill="#fbe7cf" />
            <circle cx="40" cy="74" r="7" fill="#9b6640" />
          </>
        )}
        {id === "woodpecker" && (
          <>
            <path d="M40 110V40" stroke="#8a6a4f" strokeWidth="10" />
            <path
              d="M48 90c-4-24 0-48 20-54 18-4 26 14 20 30-6 16-22 22-40 24Z"
              fill="#52684e"
            />
            <path
              d="M60 44c6-10 22-10 26 2l22 4-22 6c-4 8-16 10-24 4Z"
              fill="#fff5df"
            />
            <path d="M60 38q10-12 22-6" stroke="#df6f5d" strokeWidth="8" />
            <circle cx="76" cy="48" r="3" fill="#52684e" />
          </>
        )}
        {id === "coconut-tree" && (
          <>
            <path d="M58 116q-4-50 6-82" stroke="#a9805d" strokeWidth="11" />
            {[
              "M64 34Q30 20 8 40",
              "M64 34Q40 4 18 8",
              "M64 34Q88 4 108 12",
              "M64 34Q100 24 114 48",
              "M64 34Q66 10 60 0",
            ].map((d) => (
              <path
                key={d}
                d={d}
                stroke="#6f9a62"
                strokeWidth="12"
                fill="none"
              />
            ))}
            <circle cx="56" cy="42" r="8" fill="#8a6a4f" />
            <circle cx="70" cy="44" r="8" fill="#8a6a4f" />
          </>
        )}
        {id === "coconut" && (
          <>
            <circle cx="60" cy="72" r="36" fill="#8a6a4f" />
            <path d="M40 54q20-14 40 0" stroke="#c9a37d" />
            {[
              [50, 64],
              [70, 64],
              [60, 80],
            ].map(([cx, cy]) => (
              <circle key={cx * cy} cx={cx} cy={cy} r="4" fill="#52684e" />
            ))}
          </>
        )}
        {id === "shell" && (
          <>
            <path
              d="M60 104L20 60c0-26 18-40 40-40s40 14 40 40Z"
              fill="#f6c3b6"
            />
            {[
              "M60 104L36 30",
              "M60 104L48 22",
              "M60 104L72 22",
              "M60 104L84 30",
              "M60 104L26 50",
              "M60 104L94 50",
            ].map((d) => (
              <path key={d} d={d} stroke="#d9927f" />
            ))}
          </>
        )}
        {id === "sand" && <path d="M10 104q50-50 100 0Z" fill="#e8c98d" />}
        {id.startsWith("sandcastle-") && (
          <>
            <path d="M14 112q46-26 92 0Z" fill="#e8c98d" />
            {id === "sandcastle-1" && (
              <>
                <path d="M70 70h28l-4 30H74Z" fill="#df6f5d" />
                <path d="M70 70q14-16 28 0" fill="none" />
                <path
                  d="M40 98 52 60m-6 0h12"
                  stroke="#8a6a4f"
                  strokeWidth="5"
                />
              </>
            )}
            {id !== "sandcastle-1" && (
              <path d="M30 98V66h60v32Z" fill="#efd39d" />
            )}
            {id === "sandcastle-3" && (
              <>
                <path d="M42 66V40h36v26Z" fill="#f3dcaa" />
                <path d="M42 40v-8h8v8m6 0v-8h8v8m6 0v-8h8v8" fill="#f3dcaa" />
                <path d="M60 32V8l18 7-18 7" fill="#df6f5d" />
                <path d="M54 66V54q6-8 12 0v12" fill="#c99a6b" />
              </>
            )}
          </>
        )}
        {id === "wave" && (
          <>
            <path
              d="M6 92q14-50 54-50 30 0 34 28-18-12-30 4 26 0 50 18Z"
              fill="#7fc4d5"
            />
            <path d="M40 60q16-10 30 0" stroke="#ffffff" strokeWidth="5" />
          </>
        )}
        {id === "turtle" && (
          <>
            <path d="M20 86q8-46 46-46t42 46Z" fill="#7fae6a" />
            <path d="M40 86q4-22 20-30m24 30q-2-20-24-30" stroke="#d1dfa9" />
            <ellipse cx="104" cy="78" rx="12" ry="10" fill="#b9d39b" />
            <circle cx="108" cy="75" r="2.5" fill="#52684e" />
            <path
              d="M30 86l-8 14m28-14-4 14m30-14 6 14m14-14 10 12"
              stroke="#52684e"
              strokeWidth="6"
            />
          </>
        )}
        {id === "seagull" && (
          <>
            <path
              d="M8 60q26-24 52 4 26-28 52-4-26-8-52 16Q34 52 8 60Z"
              fill="#ffffff"
            />
            <path d="M60 64l8 4-8 4" fill="#e9bd58" />
          </>
        )}
        {id === "pine-snow" && (
          <>
            <path d="M54 116v-20h12v20" fill="#8a6a4f" />
            {[
              [96, 50],
              [74, 40],
              [52, 30],
            ].map(([base, w], i) => (
              <path
                key={i}
                d={`M${60 - w} ${base} Q60 ${base - 64} ${60 + w} ${base}Z`}
                fill="#6f9a8a"
              />
            ))}
            {[
              [96, 38],
              [74, 28],
              [52, 18],
            ].map(([base, w], i) => (
              <path
                key={"s" + i}
                d={`M${60 - w} ${base - 12}Q60 ${base - 34} ${60 + w} ${base - 12}`}
                stroke="#ffffff"
                strokeWidth="8"
                fill="none"
              />
            ))}
          </>
        )}
        {id === "pinecone" && (
          <>
            <path
              d="M60 18c22 10 30 40 24 62-6 20-14 28-24 32-10-4-18-12-24-32-6-22 2-52 24-62Z"
              fill="#a9805d"
            />
            {[40, 56, 72, 88].map((y) => (
              <path key={y} d={`M40 ${y}q20 10 40 0`} stroke="#7d5a3f" />
            ))}
          </>
        )}
        {id.startsWith("snowman-") && (
          <>
            <circle cx="60" cy="88" r="26" fill="#ffffff" />
            {id !== "snowman-1" && (
              <circle cx="60" cy="48" r="18" fill="#ffffff" />
            )}
            {id === "snowman-3" && (
              <>
                <circle cx="53" cy="44" r="2.5" fill="#52684e" />
                <circle cx="67" cy="44" r="2.5" fill="#52684e" />
                <path d="M60 50l16 4-16 2" fill="#ed955a" />
                <path d="M42 64q18 8 36 0l4 16-10-6" fill="#df6f5d" />
                <path d="M46 32h28m-22 0V18h16v14" fill="#52684e" />
              </>
            )}
          </>
        )}
        {id === "polar-bear" && (
          <>
            <ellipse cx="60" cy="84" rx="38" ry="28" fill="#fbfaf2" />
            <circle cx="60" cy="48" r="26" fill="#fbfaf2" />
            <circle cx="40" cy="28" r="9" fill="#fbfaf2" />
            <circle cx="80" cy="28" r="9" fill="#fbfaf2" />
            <circle cx="51" cy="46" r="3.5" fill="#52684e" />
            <circle cx="69" cy="46" r="3.5" fill="#52684e" />
            <ellipse cx="60" cy="58" rx="8" ry="6" fill="#52684e" />
            <circle cx="42" cy="56" r="5" fill="#edb9a6" stroke="none" />
            <circle cx="78" cy="56" r="5" fill="#edb9a6" stroke="none" />
          </>
        )}
        {id === "penguin" && (
          <>
            <path
              d="M60 14c-26 0-34 34-34 60s12 38 34 38 34-12 34-38-8-60-34-60Z"
              fill="#3f4d63"
            />
            <path
              d="M60 36c-16 0-20 22-20 42s8 28 20 28 20-8 20-28-4-42-20-42Z"
              fill="#ffffff"
            />
            <circle cx="52" cy="34" r="3" fill="#ffffff" stroke="none" />
            <circle cx="68" cy="34" r="3" fill="#ffffff" stroke="none" />
            <path d="M54 44h12l-6 8Z" fill="#e9bd58" />
            <path d="M44 110h12m8 0h12" stroke="#e9bd58" strokeWidth="6" />
          </>
        )}
        {id === "sled" && (
          <>
            <path d="M14 70h84v14H14Z" fill="#df6f5d" />
            <path
              d="M8 96h92q12 0 12-12"
              fill="none"
              stroke="#8a6a4f"
              strokeWidth="6"
            />
            <path d="M28 84v12m52-12v12" stroke="#8a6a4f" strokeWidth="5" />
          </>
        )}
        {id === "snowflake" && (
          <g stroke="#8fc1dc" strokeWidth="6">
            {[0, 60, 120].map((r) => (
              <path
                key={r}
                d="M60 18v84m-12-72 12 10 12-10m-24 60 12-10 12 10"
                transform={`rotate(${r} 60 60)`}
                fill="none"
              />
            ))}
          </g>
        )}
        {id === "telescope" && (
          <>
            <path
              d="M60 70 36 112m24-42 24 42m-24-42v42"
              stroke="#8a6a4f"
              strokeWidth="5"
            />
            <path d="M22 72 86 30l12 18-64 42Z" fill="#7d8ec4" />
            <path d="M86 30l6-4 12 18-6 4Z" fill="#e9bd58" />
          </>
        )}
        {id === "moon-face" && (
          <>
            <circle cx="60" cy="60" r="46" fill="#fff1b8" />
            <circle cx="40" cy="44" r="8" fill="#f1dc8c" stroke="none" />
            <circle cx="82" cy="78" r="6" fill="#f1dc8c" stroke="none" />
            <path d="M44 62q4-6 8 0m16 0q4-6 8 0" />
            <path d="M50 76q10 8 20 0" />
            <circle cx="40" cy="72" r="5" fill="#edb9a6" stroke="none" />
            <circle cx="80" cy="72" r="5" fill="#edb9a6" stroke="none" />
          </>
        )}
        {id.startsWith("constellation-") && (
          <g stroke="#fff1b8">
            {CONSTELLATION.slice(0, Number(id.slice(-1)) * 3 - 1).map(
              ([x1, y1], i, arr) =>
                i ? (
                  <path
                    key={"l" + i}
                    d={`M${arr[i - 1][0]} ${arr[i - 1][1]}L${x1} ${y1}`}
                    strokeWidth="2"
                    opacity="0.7"
                  />
                ) : null,
            )}
            {CONSTELLATION.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i < Number(id.slice(-1)) * 3 - 1 ? 6 : 3}
                fill={i < Number(id.slice(-1)) * 3 - 1 ? "#fff1b8" : "#8f8ab8"}
                stroke="none"
              />
            ))}
          </g>
        )}
        {id === "star-lantern" && (
          <>
            <path d="M60 10v14" stroke="#8a6a4f" strokeWidth="4" />
            <path
              d="M60 24l9 20 22 2-17 14 5 22-19-12-19 12 5-22-17-14 22-2Z"
              fill="#ffd36e"
            />
            <circle
              cx="60"
              cy="58"
              r="30"
              fill="#fff1b8"
              opacity="0.3"
              stroke="none"
            />
          </>
        )}
        {id === "tomato" && (
          <>
            <circle cx="60" cy="68" r="37" fill="url(#lw-tomato)" />
            <path d="m60 33-13 9 13-2 13 2Zm0 0v-11" fill="#6ca057" />
            <path
              d="M41 55q6-11 16-12"
              stroke="#ffd9cf"
              strokeWidth="3"
              fill="none"
            />
          </>
        )}
        {id === "pumpkin" && (
          <>
            <path
              d="M60 36c-8-4-36 2-36 34s20 38 36 38 36-6 36-38-28-38-36-34Z"
              fill="url(#lw-carrot)"
            />
            <path d="M60 38q-16 30 0 68m0-68q16 30 0 68" fill="none" />
            <path d="M40 50q8-6 14-5" stroke="#ffd9ad" fill="none" />
            <path d="M60 36q0-12 7-17" stroke="#689b55" strokeWidth="6" />
          </>
        )}
        {id === "corn" && (
          <>
            <path
              d="M60 12c20 16 24 52 12 78H48C36 64 40 28 60 12Z"
              fill="url(#lw-gold)"
            />
            <path
              d="M52 36h16M49 52h22M50 68h20M57 22v60m6-60v60"
              stroke="#c89432"
              strokeWidth="1.6"
            />
            <path
              d="M60 112c-26-6-34-32-30-52 14 8 24 24 30 52Zm0 0c26-6 34-32 30-52-14 8-24 24-30 52Z"
              fill="#7eb063"
            />
          </>
        )}
        {id === "watermelon" && (
          <>
            <ellipse cx="60" cy="68" rx="45" ry="37" fill="url(#lw-melon)" />
            <path
              d="M32 48q10 20 0 40m28-56q10 26 0 72m28-56q-10 20 0 40"
              stroke="#3f6a36"
              strokeWidth="4"
              fill="none"
            />
            <path d="M40 46q12-8 24-7" stroke="#d3eec0" fill="none" />
            <path d="M60 31q0-10 7-14" stroke="#689b55" strokeWidth="5" />
          </>
        )}
        {["berry", "apple"].includes(id) && (
          <>
            <path d="M60 31q-5-22 18-22-2 18-18 22" fill="#7eb063" />
            <path
              d="M60 35C12 6 17 81 52 105q9 6 18-4c38-31 36-91-10-66"
              fill={id === "berry" ? "url(#lw-berry)" : "url(#lw-apple)"}
            />
            <path
              d="M39 48q7-8 16-7"
              stroke="#ffe4df"
              strokeWidth="3"
              fill="none"
            />
            {id === "berry" &&
              [40, 60, 80].map((x) => (
                <path key={x} d={`m${x} 52 2 3m-5 16 2 3`} stroke="#ffe6b0" />
              ))}
          </>
        )}
        {id === "rabbit" && (
          <>
            <ellipse
              cx="44"
              cy="28"
              rx="13"
              ry="26"
              fill="#fff5df"
              transform="rotate(-12 44 28)"
            />
            <ellipse
              cx="77"
              cy="28"
              rx="13"
              ry="26"
              fill="#fff5df"
              transform="rotate(12 77 28)"
            />
            <path d="M44 12v26m33-26v26" stroke="#e7b4a7" strokeWidth="7" />
            <ellipse cx="60" cy="90" rx="37" ry="26" fill="#fff5df" />
            <circle cx="60" cy="61" r="33" fill="#fff5df" />
            <path d="M46 57v4m28-4v4m-19 8 5 4 5-4m-5 4v7" />
            <ellipse cx="36" cy="70" rx="7" ry="4" fill="#edb9a6" />
            <ellipse cx="83" cy="70" rx="7" ry="4" fill="#edb9a6" />
          </>
        )}
        {id === "reindeer" && (
          <>
            <path
              d="M42 36q-8-14-4-24m4 14-8-4m44 14q8-14 4-24m-4 14 8-4"
              stroke="#9e7f63"
              strokeWidth="5"
            />
            <ellipse cx="60" cy="88" rx="31" ry="23" fill="#c98b55" />
            <ellipse
              cx="60"
              cy="90"
              rx="18"
              ry="15"
              fill="#f5e3cc"
              stroke="none"
            />
            <circle cx="60" cy="56" r="28" fill="#c98b55" />
            <ellipse
              cx="60"
              cy="63"
              rx="18"
              ry="14"
              fill="#f5e3cc"
              stroke="none"
            />
            <circle cx="48" cy="52" r="3" fill="#52684e" />
            <circle cx="72" cy="52" r="3" fill="#52684e" />
            <ellipse cx="60" cy="61" rx="6" ry="4.5" fill="#a8473c" />
          </>
        )}
        {id === "butterfly" && (
          <>
            <ellipse
              cx="34"
              cy="44"
              rx="25"
              ry="31"
              fill="#e4a5b8"
              transform="rotate(-25 34 44)"
            />
            <ellipse
              cx="86"
              cy="44"
              rx="25"
              ry="31"
              fill="#e4a5b8"
              transform="rotate(25 86 44)"
            />
            <ellipse cx="38" cy="82" rx="18" ry="21" fill="url(#lw-gold)" />
            <ellipse cx="82" cy="82" rx="18" ry="21" fill="url(#lw-gold)" />
            <circle
              cx="32"
              cy="40"
              r="6"
              fill="#fff6e0"
              stroke="none"
              opacity="0.65"
            />
            <circle
              cx="88"
              cy="40"
              r="6"
              fill="#fff6e0"
              stroke="none"
              opacity="0.65"
            />
            <path d="M60 35v54m0-54L48 20m12 15 12-15" strokeWidth="4.5" />
          </>
        )}
        {id === "worm" && (
          <>
            <path
              d="M17 80q13-40 28-8t30 0 28-10"
              stroke="#95bb6b"
              strokeWidth="24"
              fill="none"
            />
            <circle cx="99" cy="55" r="17" fill="#a7cc80" />
            <circle cx="104" cy="51" r="2.5" fill="#52684e" />
            <ellipse
              cx="96"
              cy="58"
              rx="4"
              ry="2.5"
              fill="#edb9a6"
              stroke="none"
            />
          </>
        )}
        {["bird", "fish", "bug"].includes(id) && (
          <>
            <ellipse
              cx="60"
              cy="65"
              rx="36"
              ry="28"
              fill={
                id === "bird"
                  ? "#93b9c5"
                  : id === "fish"
                    ? "#f0b96a"
                    : "#d96f5d"
              }
            />
            {id === "fish" && <path d="m25 65-22-20v40Z" fill="#efba76" />}
            {id === "bird" && (
              <>
                <path d="m92 58 20 9-20 7" fill="#e6bb65" />
                <path d="M40 96v13m23-13v13M46 60q16 32 33 4" fill="none" />
              </>
            )}
            {id === "bug" && (
              <>
                <path d="M60 38v54" />
                <circle cx="45" cy="56" r="5" fill="#53654b" />
                <circle cx="78" cy="70" r="5" fill="#53654b" />
              </>
            )}
            <circle cx="81" cy="55" r="3" fill="#53654b" />
          </>
        )}
        {id === "decor-sunflower" && (
          <>
            <path d="M42 90h36l-5 20H47Z" fill="#c98b6b" />
            <path d="M60 90V52" stroke="#6b9b61" strokeWidth="6" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="60"
                cy="27"
                rx="12"
                ry="20"
                fill="url(#lw-gold)"
                transform={`rotate(${a} 60 46)`}
              />
            ))}
            <circle cx="60" cy="46" r="14" fill="#997345" />
          </>
        )}
        {id === "decor-pumpkin-lamp" && (
          <>
            <path
              d="M60 36c-8-4-36 2-36 34s20 38 36 38 36-6 36-38-28-38-36-34Z"
              fill={night ? "#f4a942" : "#ee9b45"}
            />
            <path d="M60 36q0-12 6-16" stroke="#78a863" strokeWidth="6" />
            <path
              d="M42 62l8-7 6 7Zm22 0 8-7 6 7Zm-18 17q14 10 28 0"
              fill={night ? "#fff3a8" : "#704d2c"}
            />
          </>
        )}
        {id === "rock" && (
          <>
            <path
              d="M12 96 24 53 48 34l36 5 25 57Q60 115 12 96"
              fill="#a6b29e"
            />
            <path d="M28 54q14-14 34-12" stroke="#ced6c7" fill="none" />
            <path
              d="M24 88q10-8 20 0t20 0"
              fill="#7da768"
              stroke="none"
              opacity="0.65"
            />
          </>
        )}
        {id === "grass" && (
          <path
            d="M5 105 15 52 34 86 41 24 58 84 77 40 82 91 108 61 114 106"
            fill="#7da95e"
          />
        )}
        {id === "pond" && (
          <>
            <ellipse cx="60" cy="72" rx="57" ry="33" fill="url(#lw-water)" />
            <ellipse
              cx="60"
              cy="72"
              rx="40"
              ry="21"
              fill="none"
              stroke="#e5f4ed"
            />
            <path d="M69 63q25-19 35 3-20 9-35-3" fill="#7aa667" />
          </>
        )}
        {id === "rainbow" &&
          ["#dc9290", "#edbd74", "#e9da8b", "#a8c59a", "#9cc5d1"].map(
            (c, i) => (
              <path
                key={c}
                d={`M${10 + i * 8} 101a${50 - i * 8} ${65 - i * 8} 0 0 1 ${100 - i * 16} 0`}
                fill="none"
                stroke={c}
                strokeWidth="9"
              />
            ),
          )}
        {id === "basket" && (
          <>
            <path
              d="M20 53q40-68 80 0"
              fill="none"
              stroke="#9c784c"
              strokeWidth="8"
            />
            <path d="m12 52 15 56h67l15-56Z" fill="url(#lw-wicker)" />
            <path
              d="M24 70h72M29 88h62M43 55v49m20-49v49m19-49v49"
              stroke="#9e7d4e"
            />
          </>
        )}
        {id === "star" && (
          <path
            d="m60 8 16 32 36 6-26 26 5 36-31-17-31 17 5-36L8 46l36-6Z"
            fill="url(#lw-gold)"
          />
        )}
        {id === "owl" && (
          <>
            <ellipse cx="60" cy="68" rx="31" ry="36" fill="#a88b6e" />
            <ellipse cx="60" cy="76" rx="19" ry="22" fill="#efe2cc" />
            <path d="M35 34 45 45M85 34 75 45" strokeWidth="5" />
            <circle cx="48" cy="54" r="9" fill="#fff8e8" />
            <circle cx="72" cy="54" r="9" fill="#fff8e8" />
            <circle cx="48" cy="54" r="3" fill="#52684e" />
            <circle cx="72" cy="54" r="3" fill="#52684e" />
            <path d="m56 61 4 7 4-7Z" fill="#e9bd58" />
          </>
        )}
        {id === "frog" && (
          <>
            <ellipse cx="60" cy="76" rx="36" ry="26" fill="#89b86c" />
            <ellipse cx="60" cy="84" rx="22" ry="15" fill="#d8e7b4" />
            <circle cx="43" cy="50" r="11" fill="#89b86c" />
            <circle cx="77" cy="50" r="11" fill="#89b86c" />
            <circle cx="43" cy="50" r="4" fill="#52684e" />
            <circle cx="77" cy="50" r="4" fill="#52684e" />
            <path d="M46 71q14 10 28 0" fill="none" />
          </>
        )}
        {id === "snail" && (
          <>
            <path
              d="M22 96q36 8 76-4c6-2 10-12 2-16-12-4-20 8-34 8H26Z"
              fill="#e4cfa5"
            />
            <circle cx="52" cy="66" r="26" fill="#c98b6b" />
            <path
              d="M52 66c0-8 10-8 10 0 0 12-18 12-18 0 0-16 24-16 24 0"
              fill="none"
            />
            <path d="m88 76 6-14m4 15 9-12" />
          </>
        )}
        {id === "windmill" && (
          <>
            <path d="M56 54h8l4 56H52Z" fill="#d9c6a3" />
            <g className={cn("windmill-blades")}>
              {[0, 90, 180, 270].map((a) => (
                <path
                  key={a}
                  d="M60 54 48 16h24Z"
                  fill={a % 180 === 0 ? "#e9bd58" : "#bc7f70"}
                  transform={`rotate(${a} 60 54)`}
                />
              ))}
              <circle cx="60" cy="54" r="7" fill="#fff5df" />
            </g>
          </>
        )}
        {id === "xylophone" && (
          <>
            <rect x="12" y="42" width="96" height="44" rx="10" fill="#c89e6d" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect
                key={i}
                x={17 + i * 11}
                y={46 + i * 1.5}
                width="8"
                height={36 - i * 2.5}
                rx="3"
                fill={i % 2 === 0 ? "#e9bd58" : "#df8c75"}
              />
            ))}
          </>
        )}
        {id === "fx-moon" && (
          <path
            d="M72 20a36 36 0 1 0 32 54A28 28 0 0 1 72 20Z"
            fill="#f7e396"
          />
        )}
        {id === "fx-firefly" && (
          <>
            <circle
              cx="60"
              cy="60"
              r="18"
              fill="#fff8aa"
              stroke="none"
              opacity="0.55"
            />
            <circle cx="60" cy="60" r="8" fill="#f7e371" />
          </>
        )}
        {id === "fx-shooting-star" && (
          <>
            <path d="M16 86 78 36" stroke="#fff8aa" strokeWidth="6" />
            <path
              d="m82 20 6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2Z"
              fill="#f7e396"
            />
          </>
        )}
        {id === "lotus" && (
          <>
            <ellipse cx="60" cy="96" rx="44" ry="12" fill="#87ae74" />
            <path
              d="M60 32c-16 18-18 44 0 58 18-14 16-40 0-58Z"
              fill="#f0a8b8"
            />
            <path
              d="M60 88C34 80 22 58 32 42c16 8 24 24 28 46Z"
              fill="#f5c0cc"
            />
            <path
              d="M60 88c26-8 38-30 28-46-16 8-24 24-28 46Z"
              fill="#f5c0cc"
            />
          </>
        )}
        {id === "waterlily" && (
          <>
            <ellipse cx="60" cy="96" rx="40" ry="11" fill="#7ba668" />
            {[0, 45, 90, 135, 180].map((a) => (
              <ellipse
                key={a}
                cx="60"
                cy="58"
                rx="11"
                ry="26"
                fill="#c7a2d6"
                transform={`rotate(${a - 90} 60 84)`}
              />
            ))}
            <circle cx="60" cy="76" r="9" fill="#f2d06b" />
          </>
        )}
        {id === "duck" && (
          <>
            <ellipse cx="62" cy="78" rx="34" ry="22" fill="#f6dc7a" />
            <circle cx="42" cy="48" r="20" fill="#f6dc7a" />
            <path d="m22 48-14 4 14 5Z" fill="#ed955a" />
            <circle cx="37" cy="44" r="3" fill="#52684e" />
          </>
        )}
        {id === "dragonfly" && (
          <>
            <ellipse
              cx="38"
              cy="46"
              rx="24"
              ry="9"
              fill="#cde8ec"
              transform="rotate(-18 38 46)"
            />
            <ellipse
              cx="82"
              cy="46"
              rx="24"
              ry="9"
              fill="#cde8ec"
              transform="rotate(18 82 46)"
            />
            <ellipse
              cx="38"
              cy="64"
              rx="20"
              ry="7"
              fill="#d9eef1"
              transform="rotate(14 38 64)"
            />
            <ellipse
              cx="82"
              cy="64"
              rx="20"
              ry="7"
              fill="#d9eef1"
              transform="rotate(-14 82 64)"
            />
            <path d="M60 36v66" stroke="#6aa9a0" strokeWidth="7" />
            <circle cx="60" cy="34" r="7" fill="#6aa9a0" />
          </>
        )}
        {id === "pond-lantern" && (
          <>
            <ellipse cx="60" cy="94" rx="36" ry="11" fill="#87ae74" />
            <path
              d="M36 90c0-28 12-46 24-56 12 10 24 28 24 56Z"
              fill="#f7c873"
            />
            <circle cx="60" cy="72" r="10" fill="#fff6b8" stroke="none" />
          </>
        )}
      </g>
    </svg>
  );
}
