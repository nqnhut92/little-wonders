import type { ReactNode } from "react";
import { cn } from "../styles";
// Expressive flat storybook style: rounded chibi proportions, bright flat fills,
// sparkling big eyes with curved eyebrows and happy mouth, natural paw pads, and layered shade.
export type Draw = (p: { color?: string; night?: boolean }) => ReactNode;
export const INK = "#3b2d28";
export const BLUSH = "#ff9ea2";
export function Face({
  y = 46,
  dx = 14,
  mouthY = 58,
  brows = true,
  openMouth = true,
}: {
  y?: number;
  dx?: number;
  mouthY?: number;
  brows?: boolean;
  openMouth?: boolean;
}) {
  return (
    <>
      {brows && (
        <path
          d={`M${60 - dx - 5} ${y - 9}q5-4 10-1M${60 + dx - 5} ${y - 10}q5-3 10 1`}
          fill="none"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      )}
      <circle cx={60 - dx} cy={y} r="6.5" fill={INK} />
      <circle cx={60 + dx} cy={y} r="6.5" fill={INK} />
      <circle cx={60 - dx + 2} cy={y - 2} r="2.3" fill="#fff" />
      <circle cx={60 + dx + 2} cy={y - 2} r="2.3" fill="#fff" />
      <circle cx={60 - dx - 2} cy={y + 2.2} r="1" fill="#fff" opacity="0.85" />
      <circle cx={60 + dx - 2} cy={y + 2.2} r="1" fill="#fff" opacity="0.85" />
      {openMouth ? (
        <>
          <path
            d={`M${60 - 7} ${mouthY}q7 12 14 0Z`}
            fill="#d94b58"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d={`M${60 - 4.5} ${mouthY + 3.5}q4.5 5 9 0Z`} fill="#ff8fa0" />
        </>
      ) : (
        <path
          d={`M60 ${mouthY - 1}v3m-6.5 1q3.2 4.5 6.5 0 3.2 4.5 6.5 0`}
          fill="none"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </>
  );
}
export const flatArt: Record<string, Draw> = {
  puppy: () => (
    <>
      {/* Wagging fluffy tail */}
      <path
        d="M82 96c16 3 28-8 24-24-4-6-12-2-15 5-2 5-5 10-9 12Z"
        fill="#f0dfc2"
      />
      <path d="M98 73c4-3 9 1 7 8-3 4-7 5-10 3 0-5 1-9 3-11Z" fill="#e8b777" />
      {/* Chubby sitting body & soft chest */}
      <path d="M32 110c-5-24 6-42 28-42s33 18 28 42Z" fill="#fff7e8" />
      <path
        d="M35 104c8 6 42 6 50 0-1 4-2 6-5 6H40c-3 0-4-2-5-6Z"
        fill="#f0dfc2"
      />
      <ellipse cx="60" cy="92" rx="16" ry="14" fill="#ffffff" />
      {/* Sculpted front arms with tapered wrists & paw pads */}
      <path
        d="M38 78c-7 6-10 18-6 26 3 4 10 4 13-1 2-5 1-16-7-25Z"
        fill="#f5e6cc"
      />
      <path
        d="M82 78c7 6 10 18 6 26-3 4-10 4-13-1-2-5-1-16 7-25Z"
        fill="#f5e6cc"
      />
      {/* Sitting hind paws */}
      <ellipse cx="42" cy="109" rx="11" ry="6.5" fill="#fffdf9" />
      <ellipse cx="78" cy="109" rx="11" ry="6.5" fill="#fffdf9" />
      <circle cx="42" cy="110.5" r="3" fill={BLUSH} opacity="0.75" />
      <circle cx="78" cy="110.5" r="3" fill={BLUSH} opacity="0.75" />
      <circle cx="37.5" cy="107.5" r="1.6" fill={BLUSH} opacity="0.75" />
      <circle cx="42" cy="106.5" r="1.6" fill={BLUSH} opacity="0.75" />
      <circle cx="46.5" cy="107.5" r="1.6" fill={BLUSH} opacity="0.75" />
      <circle cx="73.5" cy="107.5" r="1.6" fill={BLUSH} opacity="0.75" />
      <circle cx="78" cy="106.5" r="1.6" fill={BLUSH} opacity="0.75" />
      <circle cx="82.5" cy="107.5" r="1.6" fill={BLUSH} opacity="0.75" />
      {/* Floppy warm tan ears */}
      <path
        d="M32 23c-18-2-25 26-13 43 4 5 11 4 15-2 5-8 6-24-2-41Z"
        fill="#e5ab65"
      />
      <path
        d="M28 31c-9 3-12 20-5 30 3 3 7 2 9-2 3-7 2-18-4-28Z"
        fill="#d1924c"
      />
      <path
        d="M88 23c18-2 25 26 13 43-4 5-11 4-15-2-5-8-6-24 2-41Z"
        fill="#e5ab65"
      />
      <path
        d="M92 31c9 3 12 20 5 30-3 3-7 2-9-2-3-7-2-18 4-28Z"
        fill="#d1924c"
      />
      {/* Big round chibi head + top tuft + warm spot */}
      <ellipse cx="60" cy="46" rx="34" ry="30" fill="#fff7e8" />
      <path
        d="M30 56c6 14 20 20 30 20s24-6 30-20c-6 18-18 22-30 22S36 74 30 56Z"
        fill="#f2e2c6"
      />
      <path
        d="M68 18c12 2 22 10 24 22-8 4-18 0-24-8-4-5-4-11 0-14Z"
        fill="#f0c387"
        opacity="0.75"
      />
      <path
        d="M52 18q4-7 9-2 5-6 8 2-8 2-17 0Z"
        fill="#fff7e8"
      />
      {/* Signature purple bow at the neck */}
      <g
        className="puppy-bow"
        transform="translate(60 74.5) scale(0.46) translate(-60 -76)"
      >
        <path
          d="M28 72q32 9 64 0l-2 5q-30 9-60 0Z"
          fill="#8556c4"
        />
        <path
          d="M60 76c-7-9-17-11-20-6-3 5 0 13 5 15 6 1 11-4 15-9Z"
          fill="#9b6bd6"
        />
        <path
          d="M60 76c7-9 17-11 20-6 3 5 0 13-5 15-6 1-11-4-15-9Z"
          fill="#9b6bd6"
        />
        <path d="M56 79l-5 12 7-3Zm8 0l5 12-7-3Z" fill="#7847b8" />
        <ellipse cx="60" cy="76.5" rx="5" ry="4.5" fill="#c39cf0" />
      </g>
      {/* Plump cream muzzle, shiny button nose, expressive eyes & rosy cheeks */}
      <ellipse cx="60" cy="56" rx="16" ry="11.5" fill="#ffffff" />
      <Face y={44} dx={14.5} mouthY={58} />
      <ellipse cx="60" cy="51.5" rx="6" ry="4.2" fill={INK} />
      <ellipse cx="58" cy="50.2" rx="2" ry="1" fill="#fff" opacity="0.65" />
      <ellipse cx="36" cy="55" rx="6.5" ry="4.5" fill={BLUSH} opacity="0.85" />
      <ellipse cx="84" cy="55" rx="6.5" ry="4.5" fill={BLUSH} opacity="0.85" />
    </>
  ),
  reindeer: () => (
    <>
      {/* Rounded velvety baby antlers */}
      <g fill="none" stroke="#8a5632" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M44 25c-6-8-6-16-2-21m1 12-9-4M76 25c6-8 6-16 2-21m-1 12 9-4" />
      </g>
      {/* Fluffy little tail */}
      <path d="M83 96c10-2 15-10 12-17-6 0-11 5-12 17Z" fill="#f7e3c8" />
      {/* Chubby body & cream chest fur */}
      <path d="M33 111c-4-23 7-41 27-41s31 18 27 41Z" fill="#cf8b4c" />
      <ellipse cx="60" cy="96" rx="16" ry="14" fill="#fae8d0" />
      {/* Faint baby fawn spots */}
      <circle cx="42" cy="92" r="2.8" fill="#fae8d0" opacity="0.7" />
      <circle cx="78" cy="92" r="2.8" fill="#fae8d0" opacity="0.7" />
      <circle cx="38" cy="100" r="2.2" fill="#fae8d0" opacity="0.7" />
      <circle cx="82" cy="100" r="2.2" fill="#fae8d0" opacity="0.7" />
      {/* Festive red collar with golden sleigh bell */}
      <path d="M39 73q21 10 42 0l1.5 6.5q-22.5 10-45 0Z" fill="#e64543" />
      <path d="M40 76.5q20 9 40 0" stroke="#c92e2c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="82" r="5" fill="#ffd03b" stroke="#d49b1a" strokeWidth="1.2" />
      <circle cx="58.5" cy="80.5" r="1.4" fill="#fff8c4" />
      <circle cx="60" cy="83.2" r="1.2" fill="#8a5632" />
      <path d="M60 83.2v2.8" stroke="#8a5632" strokeWidth="1.2" strokeLinecap="round" />
      {/* Cute cloven hooves */}
      <rect x="36" y="104" width="16" height="9" rx="4.5" fill="#633b20" />
      <rect x="68" y="104" width="16" height="9" rx="4.5" fill="#633b20" />
      <path d="M44 108v5m32-5v5" stroke="#4a2b16" strokeWidth="2" strokeLinecap="round" />
      {/* Expressive leaf-shaped ears */}
      <ellipse
        cx="27"
        cy="37"
        rx="14"
        ry="8.5"
        fill="#cf8b4c"
        transform="rotate(-24 27 37)"
      />
      <ellipse
        cx="93"
        cy="37"
        rx="14"
        ry="8.5"
        fill="#cf8b4c"
        transform="rotate(24 93 37)"
      />
      <ellipse
        cx="27"
        cy="37"
        rx="8.5"
        ry="4.8"
        fill={BLUSH}
        transform="rotate(-24 27 37)"
      />
      <ellipse
        cx="93"
        cy="37"
        rx="8.5"
        ry="4.8"
        fill={BLUSH}
        transform="rotate(24 93 37)"
      />
      {/* Big round head, forehead tuft & cream muzzle */}
      <ellipse cx="60" cy="47" rx="32" ry="28" fill="#cf8b4c" />
      <path
        d="M31 56c6 13 19 19 29 19s23-6 29-19c-6 16-17 21-29 21S37 72 31 56Z"
        fill="#ba783c"
      />
      <path d="M53 20q4-6 7-1 4-5 7 1-7 2-14 0Z" fill="#cf8b4c" />
      <ellipse cx="60" cy="58" rx="17" ry="12.5" fill="#fae8d0" />
      <Face y={44} dx={14} mouthY={60} />
      {/* Shiny cherry-brown nose */}
      <ellipse cx="60" cy="53" rx="7" ry="5" fill="#e84f3d" />
      <ellipse cx="57.8" cy="51.3" rx="2.3" ry="1.2" fill="#fff" opacity="0.7" />
      <ellipse cx="37" cy="55" rx="6" ry="4.2" fill={BLUSH} opacity="0.85" />
      <ellipse cx="83" cy="55" rx="6" ry="4.2" fill={BLUSH} opacity="0.85" />
    </>
  ),
  capybara: () => (
    <>
      {/* Ground shadow */}
      <ellipse cx="62" cy="112" rx="44" ry="5" fill="#4f6d3a" opacity="0.22" />
      {/* Back legs tucked in loaf pose */}
      <ellipse cx="89" cy="107" rx="13" ry="6.5" fill="#7a4c28" />
      <ellipse cx="38" cy="107" rx="11" ry="6" fill="#7a4c28" />
      {/* Plump potato-loaf body (horizontal rounded bean silhouette) */}
      <path
        d="M36 62c18-5 44-3 57 7 12 9 14 27 6 37-6 6-54 6-67 1-10-4-11-36 4-45Z"
        fill="#c88b55"
      />
      {/* Warm lower-belly shade & soft cream chest patch */}
      <path
        d="M30 98c18 7 54 7 69 0-2 5-5 8-10 9-14 2-44 2-53-1-4-1-5-4-6-8Z"
        fill="#ae713d"
      />
      <ellipse cx="44" cy="94" rx="14" ry="11" fill="#e0ab78" />
      {/* Short stubby front & hind paws with 3 dark toes */}
      <rect x="27" y="102" width="15" height="9.5" rx="4.8" fill="#6b4022" />
      <rect x="52" y="103" width="15" height="9.5" rx="4.8" fill="#6b4022" />
      <rect x="81" y="102" width="16" height="9.5" rx="4.8" fill="#6b4022" />
      <path
        d="M31.5 107.5v3.5m4.5-3.5v3.5m20.5-3v3.5m4.5-3.5v3.5m24.5-3.5v3.5m4.5-3.5v3.5"
        stroke="#472812"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Tiny dark-brown ear pinned back on the crown */}
      <ellipse
        cx="31"
        cy="30"
        rx="5"
        ry="3.5"
        fill="#5e371c"
        transform="rotate(-18 31 30)"
      />
      {/* Iconic boxy capybara head & big blunt snout facing left */}
      <path
        d="M27 29c14-3 29 0 35 9 6 9 6 26-2 34-8 7-31 7-42 2-9-4-11-18-9-29 2-10 8-14 18-16Z"
        fill="#d4965e"
      />
      {/* Darker warm brown bridge & big blunt square muzzle patch */}
      <path
        d="M11 45c2-9 9-14 18-14 10 0 16 7 16 19 0 13-7 22-19 22-11 0-17-7-15-27Z"
        fill="#8c5832"
      />
      <ellipse cx="25" cy="54" rx="13" ry="14" fill="#9c643b" />
      {/* Curved slit nostrils & iconic vertical philtrum + chill w-mouth */}
      <ellipse
        cx="18.5"
        cy="46.5"
        rx="2.6"
        ry="1.6"
        fill={INK}
        transform="rotate(-20 18.5 46.5)"
      />
      <ellipse
        cx="29.5"
        cy="46.5"
        rx="2.6"
        ry="1.6"
        fill={INK}
        transform="rotate(20 29.5 46.5)"
      />
      <path
        d="M24 49v9m-6.5 1.5q3.2 4 6.5 0 3.3 4 6.5 0"
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cute little pink tongue tip */}
      <path d="M21.5 60.2q2.5 3.8 5 0Z" fill="#ff8fa0" />
      {/* Relaxed chill eye with gentle upward arch (not angry) & rosy cheek */}
      <circle cx="48" cy="45.5" r="5" fill={INK} />
      <circle cx="49.5" cy="43.8" r="1.9" fill="#fff" />
      <circle cx="46.5" cy="47.2" r="0.9" fill="#fff" opacity="0.85" />
      <path
        d="M42.5 39q5.5-2.5 10.5 0.5"
        fill="none"
        stroke="#573318"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse cx="52" cy="54" rx="6" ry="3.8" fill={BLUSH} opacity="0.85" />
      {/* Tiny folded ear in foreground */}
      <ellipse
        cx="61"
        cy="34"
        rx="6.8"
        ry="4.6"
        fill="#6b4022"
        transform="rotate(22 61 34)"
      />
      <ellipse
        cx="61"
        cy="34.5"
        rx="3.6"
        ry="2.3"
        fill="#b5794c"
        transform="rotate(22 61 34.5)"
      />
      {/* Signature tangerine balanced on top of the flat head */}
      <ellipse
        cx="44"
        cy="27.5"
        rx="10.5"
        ry="2.2"
        fill="#8c5832"
        opacity="0.45"
      />
      <ellipse cx="44" cy="20" rx="10" ry="8.2" fill="#ff9429" />
      <ellipse
        cx="40.8"
        cy="17.2"
        rx="3.4"
        ry="1.9"
        fill="#ffd085"
        opacity="0.85"
      />
      <path
        d="M44 12c0-2 1.5-3.5 3-4"
        stroke="#5a3820"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M45 11.8c4-3 9-2 10 1.5-3 2.5-7 2-10-1.5Z" fill="#5cc265" />
    </>
  ),
  tree: () => (
    <>
      <ellipse cx="60" cy="113" rx="28" ry="5" fill="#6baa52" opacity="0.35" />
      <path
        d="M47 115c5-26 6-44 3-60h20c-3 16-2 34 3 60Z"
        fill="#b57c4e"
      />
      <path d="M60 55h10c-3 16-2 34 3 60H60Z" fill="#99643b" />
      <circle cx="34" cy="54" r="27" fill="#46a854" />
      <circle cx="86" cy="54" r="27" fill="#46a854" />
      <circle cx="60" cy="36" r="34" fill="#5cc265" />
      <circle cx="46" cy="26" r="16" fill="#85de83" />
      <circle cx="76" cy="30" r="11" fill="#85de83" opacity="0.7" />
      <circle cx="28" cy="48" r="10" fill="#5cc265" />
      {[
        [36, 56],
        [82, 50],
        [61, 63],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y - 7}q2-4 5-3`} stroke="#5a3820" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx={x} cy={y} r="8.5" fill="#f25755" />
          <circle cx={x - 2.8} cy={y - 2.8} r="2.4" fill="#ffd0cc" />
        </g>
      ))}
    </>
  ),
  house: ({ color, night }) => (
    <>
      <rect x="79" y="13" width="14" height="28" rx="3" fill="#cf553e" />
      <rect x="77" y="11" width="18" height="6" rx="2.5" fill="#e86850" />
      <rect
        x="19"
        y="53"
        width="82"
        height="59"
        rx="7"
        fill={color || "#efcf9d"}
      />
      <rect x="19" y="53" width="82" height="10" fill="#000" opacity="0.1" />
      <path
        d="M7 58 54 13q6-5 12 0l47 45q3 5-3 5H10q-6 0-3-5Z"
        fill="#eb644d"
      />
      <path
        d="M14 58 56 18q4-3 8 0l42 40"
        fill="none"
        stroke="#ff8a73"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path d="M50 112V85a10 10 0 0 1 20 0v27Z" fill="#53a2b8" />
      <path
        d="M60 79c-2-2.5-5.5-2-5.5 1 0 2.5 5.5 5.5 5.5 5.5s5.5-3 5.5-5.5c0-3-3.5-3.5-5.5-1Z"
        fill="#ffd966"
      />
      <circle cx="65" cy="99" r="2.2" fill="#ffd24d" />
      {[26, 74].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="69"
            width="20"
            height="20"
            rx="5"
            fill={night ? "#ffd454" : "#c8ecf7"}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <path
            d={`M${x + 10} 69v20M${x} 79h20`}
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <rect x={x - 2} y="88" width="24" height="4" rx="2" fill="#d99b66" />
        </g>
      ))}
    </>
  ),
  sun: () => (
    <>
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((r, i) => (
        <rect
          key={r}
          x="55.5"
          y={i % 2 ? "7" : "3"}
          width="9"
          height={i % 2 ? "14" : "18"}
          rx="4.5"
          fill={i % 2 ? "#ff9f1c" : "#ffb72b"}
          transform={`rotate(${r} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="31" fill="#ffd03b" />
      <circle cx="52" cy="46" r="18" fill="#ffe270" opacity="0.45" />
      <Face y={55} dx={11.5} mouthY={63} brows={false} />
      <ellipse cx="41" cy="64" rx="5.5" ry="3.8" fill="#ff9470" />
      <ellipse cx="79" cy="64" rx="5.5" ry="3.8" fill="#ff9470" />
    </>
  ),
  cloud: () => (
    <>
      <path
        className={cn("raindrops")}
        d="m32 90-6 14m32-14-6 14m32-14-6 14"
        stroke="#4fa9d6"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M22 80a19 19 0 0 1 4-37 29 29 0 0 1 55-4 21 21 0 0 1 17 41Z"
        fill="#ffffff"
      />
      <path
        d="M12 71q48 13 100 0a19 19 0 0 1-14 9H22a19 19 0 0 1-10-9Z"
        fill="#d9edf8"
      />
      <Face y={57} dx={11} mouthY={64} brows={false} openMouth={false} />
      <ellipse cx="41" cy="64" rx="5" ry="3.5" fill={BLUSH} />
      <ellipse cx="79" cy="64" rx="5" ry="3.5" fill={BLUSH} />
    </>
  ),
};
