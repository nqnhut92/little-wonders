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
  "dish-mystery",
];
export function Art({ id, color }: { id: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={cn(`art art-${id}`)}
    >
      <g
        stroke="#52684e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {id === "tree" && (
          <>
            <path d="m50 116 7-70h13l9 70" fill="#ac805b" />
            <path d="m60 80-26-29m34 16 23-25" />
            <path
              d="M17 70C-7 47 13 23 34 25 30-4 82-6 88 23c32-6 50 36 21 48-31 9-60 10-92-1"
              fill="#84ad6b"
            />
            <circle cx="33" cy="44" r="7" fill="#df8c75" />
            <circle cx="87" cy="50" r="7" fill="#df8c75" />
          </>
        )}
        {id === "cloud" && (
          <>
            <path
              d="M20 73C-2 72 2 40 26 43 24 12 71 12 76 38c29-13 49 27 22 36Z"
              fill="#fffdf4"
            />
            <path
              className={cn("raindrops")}
              d="m30 90-6 13m36-13-6 13m36-13-6 13"
              stroke="#80b9c5"
              strokeWidth="5"
            />
            <path d="M43 56v2m25-2v2m-20 8q8 6 15-1" />
          </>
        )}
        {id === "sun" && (
          <>
            <path
              d="M60 3v13m0 88v13M3 60h13m88 0h13M18 18l10 10m64 64 10 10M18 102l10-10m64-64 10-10"
              stroke="#e8b44e"
              strokeWidth="5"
            />
            <circle cx="60" cy="60" r="32" fill="#f4d77a" />
            <path d="M47 55v3m26-3v3m-24 11q11 10 22 0" />
          </>
        )}
        {id === "flower" && (
          <>
            <path d="M60 110V52" stroke="#6b9b61" strokeWidth="6" />
            <path
              d="M59 88Q22 58 27 87q12 18 32 10m2-22q34-26 29 1-9 14-29 13"
              fill="#8fba79"
            />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="60"
                cy="27"
                rx="13"
                ry="23"
                fill={color || "#e9bd58"}
                transform={`rotate(${a} 60 48)`}
              />
            ))}
            <circle cx="60" cy="48" r="16" fill="#997345" />
          </>
        )}
        {id === "carrot" && (
          <>
            <path
              d="m56 34-8-24m13 22 7-27m-4 29L89 15"
              stroke="#78a863"
              strokeWidth="9"
            />
            <path d="M32 43q26-23 53 1L51 111Q35 96 32 43" fill="#ed955a" />
            <path d="m40 57 18 5m-14 14 13 4" />
          </>
        )}
        {id.startsWith("dish-") && (
          <>
            <path d="M14 60h92c0 28-20 46-46 46S14 88 14 60Z" fill="#fffdf4" />
            <ellipse
              cx="60"
              cy="60"
              rx="46"
              ry="10"
              fill={
                {
                  "dish-soup": "#e4695a",
                  "dish-jam": "#c8506a",
                  "dish-salad": "#8ab16e",
                  "dish-pie": "#e0a35a",
                  "dish-juice": "#ef7d86",
                  "dish-mystery": "#b79bd6",
                }[id] ?? "#e9bd58"
              }
            />
          </>
        )}
        {id === "tomato" && (
          <>
            <circle cx="60" cy="68" r="38" fill="#e4695a" />
            <path d="m60 33-12 8 12-1 12 1Zm0 0v-10" fill="#78a863" />
            <path d="M45 62q4-8 12-9" stroke="#ffd9cf" />
          </>
        )}
        {id === "pumpkin" && (
          <>
            <path
              d="M60 36c-8-4-36 2-36 34s20 38 36 38 36-6 36-38-28-38-36-34Z"
              fill="#ee9b45"
            />
            <path d="M60 38q-16 30 0 68m0-68q16 30 0 68" />
            <path d="M60 36q0-12 6-16" stroke="#78a863" strokeWidth="6" />
          </>
        )}
        {id === "corn" && (
          <>
            <path
              d="M60 12c20 16 24 52 12 78H48C36 64 40 28 60 12Z"
              fill="#f2c94c"
            />
            <path d="M52 40h16M49 56h22M50 72h20" />
            <path
              d="M60 112c-26-6-34-32-30-52 14 8 24 24 30 52Zm0 0c26-6 34-32 30-52-14 8-24 24-30 52Z"
              fill="#8ab16e"
            />
          </>
        )}
        {id === "watermelon" && (
          <>
            <ellipse cx="60" cy="68" rx="46" ry="38" fill="#7fb069" />
            <path
              d="M32 50q10 18 0 36m28-52q10 24 0 68m28-52q-10 18 0 36"
              stroke="#4f7a43"
            />
            <path d="M60 30q0-10 6-14" stroke="#78a863" strokeWidth="5" />
          </>
        )}
        {["berry", "apple"].includes(id) && (
          <>
            <path d="M60 31q-5-22 18-22-2 18-18 22" fill="#8ab16e" />
            <path
              d="M60 35C12 6 17 81 52 105q9 6 18-4c38-31 36-91-10-66"
              fill={id === "berry" ? "#dc7884" : "#e99677"}
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
        {id === "butterfly" && (
          <>
            <ellipse
              cx="34"
              cy="44"
              rx="25"
              ry="31"
              fill="#dfa7b8"
              transform="rotate(-25 34 44)"
            />
            <ellipse
              cx="86"
              cy="44"
              rx="25"
              ry="31"
              fill="#dfa7b8"
              transform="rotate(25 86 44)"
            />
            <ellipse cx="38" cy="82" rx="18" ry="21" fill="#edc778" />
            <ellipse cx="82" cy="82" rx="18" ry="21" fill="#edc778" />
            <path d="M60 35v54m0-54L48 20m12 15 12-15" strokeWidth="5" />
          </>
        )}
        {id === "worm" && (
          <>
            <path
              d="M17 80q13-40 28-8t30 0 28-10"
              stroke="#9ebc77"
              strokeWidth="25"
            />
            <circle cx="99" cy="55" r="17" fill="#a7c782" />
            <circle cx="104" cy="51" r="2" />
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
                  ? "#9dbcc5"
                  : id === "fish"
                    ? "#efba76"
                    : "#d97d6c"
              }
            />
            {id === "fish" && <path d="m25 65-22-20v40Z" fill="#efba76" />}
            {id === "bird" && (
              <>
                <path d="m92 58 20 9-20 7" fill="#e6bb65" />
                <path d="M40 96v13m23-13v13M46 60q16 32 33 4" />
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
        {id === "house" && (
          <>
            <path d="M23 53h74v59H23Z" fill={color || "#efcf9d"} />
            <path d="M10 55 60 12l50 43Z" fill="#bc7f70" />
            <path d="M49 112V78q11-18 23 0v34" fill="#9dbaaa" />
            <rect x="30" y="65" width="17" height="18" rx="4" fill="#fff5cd" />
            <path d="M39 66v17m-8-8h15" />
          </>
        )}
        {id === "rock" && (
          <path d="M12 96 24 53 48 34l36 5 25 57Q60 115 12 96" fill="#abb4a3" />
        )}
        {id === "grass" && (
          <path
            d="M5 105 15 52 34 86 41 24 58 84 77 40 82 91 108 61 114 106"
            fill="#89ad6b"
          />
        )}
        {id === "pond" && (
          <>
            <ellipse cx="60" cy="72" rx="57" ry="33" fill="#9ccbd0" />
            <ellipse
              cx="60"
              cy="72"
              rx="40"
              ry="21"
              fill="none"
              stroke="#d4e6d7"
            />
            <path d="M69 63q25-19 35 3-20 9-35-3" fill="#87ae74" />
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
              stroke="#ab875c"
              strokeWidth="8"
            />
            <path d="m12 52 15 56h67l15-56Z" fill="#daba87" />
            <path
              d="M24 70h72M29 88h62M43 55v49m20-49v49m19-49v49"
              stroke="#b39364"
            />
          </>
        )}
        {id === "star" && (
          <path
            d="m60 8 16 32 36 6-26 26 5 36-31-17-31 17 5-36L8 46l36-6Z"
            fill="#ebce7d"
          />
        )}
      </g>
    </svg>
  );
}
