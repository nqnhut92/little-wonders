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
      <path d="M52 18q4-7 9-2 5-6 8 2-8 2-17 0Z" fill="#fff7e8" />
      {/* Signature purple bow at the neck */}
      <g
        className="puppy-bow"
        transform="translate(60 74.5) scale(0.46) translate(-60 -76)"
      >
        <path d="M28 72q32 9 64 0l-2 5q-30 9-60 0Z" fill="#8556c4" />
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
      <g
        fill="none"
        stroke="#8a5632"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <path
        d="M40 76.5q20 9 40 0"
        stroke="#c92e2c"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="82"
        r="5"
        fill="#ffd03b"
        stroke="#d49b1a"
        strokeWidth="1.2"
      />
      <circle cx="58.5" cy="80.5" r="1.4" fill="#fff8c4" />
      <circle cx="60" cy="83.2" r="1.2" fill="#8a5632" />
      <path
        d="M60 83.2v2.8"
        stroke="#8a5632"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Cute cloven hooves */}
      <rect x="36" y="104" width="16" height="9" rx="4.5" fill="#633b20" />
      <rect x="68" y="104" width="16" height="9" rx="4.5" fill="#633b20" />
      <path
        d="M44 108v5m32-5v5"
        stroke="#4a2b16"
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      <ellipse
        cx="57.8"
        cy="51.3"
        rx="2.3"
        ry="1.2"
        fill="#fff"
        opacity="0.7"
      />
      <ellipse cx="37" cy="55" rx="6" ry="4.2" fill={BLUSH} opacity="0.85" />
      <ellipse cx="83" cy="55" rx="6" ry="4.2" fill={BLUSH} opacity="0.85" />
    </>
  ),
  deer: () => (
    <>
      {/* Little white-tipped fawn tail */}
      <path d="M86 86c8-1 14-8 11-15-5 0-9 4-11 15Z" fill="#ffffff" />
      <path d="M85 85c6-1 11-6 9-12-4 0-7 3-9 12Z" fill="#ba7234" />

      {/* Continuous sculpted deer body: smoothly connecting neck, chest, belly and wide haunches */}
      <path
        d="M48 46 C44 58 38 72 32 84 C24 94 24 106 34 108 C46 110 74 110 86 108 C96 106 96 94 88 84 C82 72 76 58 72 46 Z"
        fill="#ba7234"
      />
      {/* Seated hindquarters volume */}
      <ellipse cx="34" cy="94" rx="13" ry="12" fill="#ba7234" />
      <ellipse cx="86" cy="94" rx="13" ry="12" fill="#ba7234" />

      {/* Soft cream chest and throat bib */}
      <path d="M52 48 C48 64 50 82 60 86 C70 82 72 64 68 48 Z" fill="#fff1db" />

      {/* Distinct star-shaped white spots along both flanks */}
      <circle cx="34" cy="88" r="2.6" fill="#ffffff" opacity="0.95" />
      <circle cx="42" cy="88" r="2.6" fill="#ffffff" opacity="0.95" />
      <circle cx="32" cy="95" r="2.4" fill="#ffffff" opacity="0.95" />
      <circle cx="40" cy="96" r="2.4" fill="#ffffff" opacity="0.95" />
      <circle cx="36" cy="102" r="2.2" fill="#ffffff" opacity="0.9" />

      <circle cx="78" cy="88" r="2.6" fill="#ffffff" opacity="0.95" />
      <circle cx="86" cy="88" r="2.6" fill="#ffffff" opacity="0.95" />
      <circle cx="80" cy="96" r="2.4" fill="#ffffff" opacity="0.95" />
      <circle cx="88" cy="95" r="2.4" fill="#ffffff" opacity="0.95" />
      <circle cx="84" cy="102" r="2.2" fill="#ffffff" opacity="0.9" />

      {/* Symmetrical front legs side-by-side with clear definition */}
      <g>
        {/* Subtle leg shadow separation */}
        <rect x="46" y="82" width="11" height="25" rx="5.5" fill="#8d4a18" />
        <rect x="63" y="82" width="11" height="25" rx="5.5" fill="#8d4a18" />

        {/* Both front legs with matching, clear warm fawn tone */}
        <rect x="47" y="81" width="9.5" height="25" rx="4.7" fill="#a45f26" />
        <rect x="63.5" y="81" width="9.5" height="25" rx="4.7" fill="#a45f26" />

        {/* Matching cloven hooves */}
        <rect x="47" y="104" width="9.5" height="6.5" rx="2" fill="#3a1f0d" />
        <rect x="63.5" y="104" width="9.5" height="6.5" rx="2" fill="#3a1f0d" />
        <path d="M51.8 105v5m16.5-5v5" stroke="#241206" strokeWidth="1.2" />
      </g>

      {/* Tall leaf-shaped alert ears with fluffy cream inner ear */}
      <g transform="rotate(-28 36 28)">
        <path d="M36 8 C26 18 28 38 36 44 C44 38 46 18 36 8 Z" fill="#ba7234" />
        <path
          d="M36 14 C30 22 31 34 36 38 C41 34 42 22 36 14 Z"
          fill="#fff1db"
        />
      </g>
      <g transform="rotate(28 84 28)">
        <path d="M84 8 C74 18 76 38 84 44 C92 38 94 18 84 8 Z" fill="#ba7234" />
        <path
          d="M84 14 C78 22 79 34 84 38 C89 34 90 22 84 14 Z"
          fill="#fff1db"
        />
      </g>

      {/* Delicate tiny velvet antler tips (spotted fawn) */}
      <path
        d="M48 24 Q46 12 42 7 M72 24 Q74 12 78 7"
        stroke="#824c20"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="42" cy="7" r="2.5" fill="#9c5e2a" />
      <circle cx="78" cy="7" r="2.5" fill="#9c5e2a" />

      {/* Elegant deer head */}
      <path
        d="M40 34 C36 46 44 60 60 62 C76 60 84 46 80 34 C76 22 44 22 40 34 Z"
        fill="#ba7234"
      />

      {/* Soft cream muzzle & cheeks */}
      <ellipse cx="60" cy="50" rx="14" ry="10" fill="#fff1db" />

      {/* Large expressive doe eyes with cream contour and double catchlights */}
      <ellipse cx="46" cy="38" rx="6.5" ry="7.5" fill="#fff1db" />
      <ellipse cx="74" cy="38" rx="6.5" ry="7.5" fill="#fff1db" />
      <ellipse cx="46.5" cy="38" rx="5" ry="6" fill="#2d170b" />
      <ellipse cx="73.5" cy="38" rx="5" ry="6" fill="#2d170b" />
      <circle cx="45" cy="36" r="2" fill="#ffffff" />
      <circle cx="72" cy="36" r="2" fill="#ffffff" />
      <circle cx="48" cy="40.5" r="1" fill="#ffffff" opacity="0.8" />
      <circle cx="75" cy="40.5" r="1" fill="#ffffff" opacity="0.8" />

      {/* Soft rosy blush */}
      <ellipse cx="38" cy="47" rx="5" ry="3.2" fill={BLUSH} opacity="0.75" />
      <ellipse cx="82" cy="47" rx="5" ry="3.2" fill={BLUSH} opacity="0.75" />

      {/* Cute dark button nose & gentle smile */}
      <path d="M56 46 Q60 44 64 46 Q60 49 56 46 Z" fill="#3d200f" />
      <path
        d="M57 52 Q60 55 63 52"
        fill="none"
        stroke="#3d200f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  capybara: () => (
    <>
      {/* Ground shadow under the flat loaf */}
      <ellipse cx="60" cy="111" rx="51" ry="5" fill="#4f6d3a" opacity="0.22" />
      {/* Far-side tiny ear */}
      <ellipse
        cx="38"
        cy="50"
        rx="5.5"
        ry="3.6"
        fill="#704323"
        transform="rotate(-12 38 50)"
      />
      {/* One continuous horizontal potato-loaf silhouette: head & back at the same level! */}
      <path
        d="M28 53c16-3 56-3 71 2 12 4 16 19 14 35-2 13-10 18-24 19H25c-11 0-18-7-19-19-1-13 2-25 10-31 4-3 8-5 12-6Z"
        fill="#d6955b"
      />
      {/* Soft warm underbelly shade along the bottom of the loaf */}
      <path
        d="M10 96c22 7 76 7 99 0-2 7-8 12-18 13H25c-8 0-13-5-15-13Z"
        fill="#bd7b43"
      />
      {/* Subtle warm muzzle shading at the front of the blunt snout */}
      <path
        d="M28 53c-4 1-8 3-12 6-8 6-11 18-10 31 1 12 8 19 18 19 6-5 9-19 8-35-1-11-2-18-4-21Z"
        fill="#c4824a"
      />
      {/* Tiny stubby paws tucked right under the horizontal loaf */}
      <rect x="20" y="102" width="15" height="9" rx="4.5" fill="#784826" />
      <rect x="44" y="102.5" width="15" height="9" rx="4.5" fill="#784826" />
      <rect x="82" y="102" width="16" height="9" rx="4.5" fill="#784826" />
      <path
        d="M24.5 107.5v3m4.5-3v3m19.5-2.5v3m4.5-3v3m33.5-3v3m4.5-3v3"
        stroke="#4f2d15"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Near-side tiny rounded ear pinned back on the upper corner of the head */}
      <ellipse
        cx="55"
        cy="53"
        rx="6.8"
        ry="4.5"
        fill="#784826"
        transform="rotate(18 55 53)"
      />
      <ellipse
        cx="54.8"
        cy="53.5"
        rx="3.6"
        ry="2.2"
        fill={BLUSH}
        opacity="0.82"
        transform="rotate(18 54.8 53.5)"
      />
      {/* Cute dark nose pad at the top-front corner of the blunt snout + vertical Y mouth */}
      <ellipse cx="14.5" cy="68" rx="4.2" ry="3" fill="#4f2d15" />
      <ellipse cx="13.5" cy="67" rx="1.4" ry="0.8" fill="#fff" opacity="0.45" />
      <path
        d="M14.5 71v12m-5 2q5 4.5 10-0.5"
        fill="none"
        stroke="#4f2d15"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Big kawaii sparkling eye & rosy cheek */}
      <path
        d="M32 61.5q4.5-2.8 9 0"
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="36.5" cy="69" r="5.8" fill={INK} />
      <circle cx="38.4" cy="67" r="2.1" fill="#fff" />
      <circle cx="34.7" cy="70.8" r="1" fill="#fff" opacity="0.85" />
      <ellipse
        cx="42"
        cy="78.5"
        rx="6.5"
        ry="4.2"
        fill={BLUSH}
        opacity="0.88"
      />
      {/* Signature tangerine sitting right on the low flat head */}
      <ellipse cx="41" cy="52" rx="11" ry="2.3" fill="#9e6230" opacity="0.4" />
      <ellipse cx="41" cy="44" rx="10.5" ry="8.5" fill="#ff9429" />
      <ellipse
        cx="37.5"
        cy="41"
        rx="3.6"
        ry="2"
        fill="#ffd085"
        opacity="0.85"
      />
      <path
        d="M41 35.5c0-2.2 1.5-3.8 3.2-4.2"
        stroke="#5a3820"
        strokeWidth="1.9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M42 35.2c4.2-3.2 9.5-2 10.5 1.6-3.2 2.6-7.5 2-10.5-1.6Z"
        fill="#5cc265"
      />
    </>
  ),
  tree: () => (
    <>
      <ellipse cx="60" cy="113" rx="28" ry="5" fill="#6baa52" opacity="0.35" />
      <path d="M47 115c5-26 6-44 3-60h20c-3 16-2 34 3 60Z" fill="#b57c4e" />
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
          <path
            d={`M${x} ${y - 7}q2-4 5-3`}
            stroke="#5a3820"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
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
