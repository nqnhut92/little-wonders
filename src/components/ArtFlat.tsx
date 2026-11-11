import type { ReactNode } from "react";
import { cn } from "../styles";
// Flat storybook style: simple shapes, bright flat fills, no outlines, big dot eyes, one darker
// tone for shade. Art.tsx renders an id from here when one exists; everything else still uses the
// older outlined drawings until it is redrawn.
export type Draw = (p: { color?: string; night?: boolean }) => ReactNode;
export const INK = "#4a3b35";
export const BLUSH = "#ffb3a7";
export function Face({
  y = 46,
  dx = 13,
  mouthY = 58,
}: {
  y?: number;
  dx?: number;
  mouthY?: number;
}) {
  return (
    <>
      <circle cx={60 - dx} cy={y} r="5" fill={INK} />
      <circle cx={60 + dx} cy={y} r="5" fill={INK} />
      <circle cx={60 - dx + 1.6} cy={y - 1.6} r="1.600" fill="#fff" />
      <circle cx={60 + dx + 1.6} cy={y - 1.6} r="1.600" fill="#fff" />
      <path
        d={`M60 ${mouthY}v3m-6 1q3 4 6 0 3 4 6 0`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}
export const flatArt: Record<string, Draw> = {
  puppy: () => (
    <>
      <path d="M84 98c14 2 23-8 20-21-9 0-15 7-17 15Z" fill="#f2e2c4" />
      <path d="M35 112c-4-22 7-40 25-40s29 18 25 40Z" fill="#fff6e5" />
      <ellipse cx="46" cy="110" rx="10" ry="6" fill="#fffdf7" />
      <ellipse cx="74" cy="110" rx="10" ry="6" fill="#fffdf7" />
      <ellipse cx="60" cy="47" rx="32" ry="29" fill="#fff6e5" />
      <g
        className="puppy-bow"
        transform="translate(60 80) scale(0.68) translate(-60 -80)"
      >
        <path
          d="M60 80c-6-8-15-10-18-6-2 4 0 11 4 13 5 1 10-3 14-7Z"
          fill="#9b6bd6"
        />
        <path
          d="M60 80c6-8 15-10 18-6 2 4 0 11-4 13-5 1-10-3-14-7Z"
          fill="#9b6bd6"
        />
        <path d="M57 83l-4 11 6-3Zm6 0l4 11-6-3Z" fill="#8556c4" />
        <ellipse cx="60" cy="80.500" rx="4.500" ry="4" fill="#b68be6" />
      </g>
      <path d="M32 26c-17 0-21 27-10 42 10-7 14-21 16-36Z" fill="#e8b777" />
      <path d="M88 26c17 0 21 27 10 42-10-7-14-21-16-36Z" fill="#e8b777" />
      <ellipse cx="60" cy="58" rx="14" ry="10" fill="#fffdf7" />
      <path d="M56.500 63.500q3.500 7 7 0Z" fill="#ff7f7f" />
      <Face />
      <ellipse cx="60" cy="54" rx="5.500" ry="3.800" fill={INK} />
      <circle cx="38" cy="57" r="5.500" fill={BLUSH} />
      <circle cx="82" cy="57" r="5.500" fill={BLUSH} />
    </>
  ),
  reindeer: () => (
    <>
      <g fill="none" stroke="#8a5a36" strokeWidth="6" strokeLinecap="round">
        <path d="M45 26q-7-11-3-22m1 12-9-5M75 26q7-11 3-22m-1 12 9-5" />
      </g>
      <path d="M35 112c-4-22 7-40 25-40s29 18 25 40Z" fill="#c98a4b" />
      <ellipse cx="60" cy="100" rx="14" ry="12" fill="#f7e3c8" />
      <path d="M41 75q19 11 38 0l1 7q-20 10-40 0Z" fill="#4fb58a" />
      <rect x="38" y="106" width="15" height="8" rx="4" fill="#6b4226" />
      <rect x="67" y="106" width="15" height="8" rx="4" fill="#6b4226" />
      <ellipse
        cx="30"
        cy="38"
        rx="12"
        ry="7.500"
        fill="#c98a4b"
        transform="rotate(-28 30 38)"
      />
      <ellipse
        cx="90"
        cy="38"
        rx="12"
        ry="7.500"
        fill="#c98a4b"
        transform="rotate(28 90 38)"
      />
      <ellipse
        cx="30"
        cy="38"
        rx="7"
        ry="4"
        fill={BLUSH}
        transform="rotate(-28 30 38)"
      />
      <ellipse
        cx="90"
        cy="38"
        rx="7"
        ry="4"
        fill={BLUSH}
        transform="rotate(28 90 38)"
      />
      <ellipse cx="60" cy="49" rx="30" ry="27" fill="#c98a4b" />
      <ellipse cx="60" cy="60" rx="16" ry="12" fill="#f7e3c8" />
      <Face y={45} mouthY={61} />
      <ellipse cx="60" cy="56" rx="6.500" ry="4.800" fill="#e5533d" />
      <circle cx="39" cy="57" r="5.500" fill={BLUSH} />
      <circle cx="81" cy="57" r="5.500" fill={BLUSH} />
    </>
  ),
  tree: () => (
    <>
      <path d="M50 116q7-34 3-58h14q-4 24 3 58Z" fill="#b07a4e" />
      <path d="M60 58h7q-4 24 3 58h-9Z" fill="#96643c" />
      <circle cx="36" cy="54" r="26" fill="#4fae5a" />
      <circle cx="84" cy="54" r="26" fill="#4fae5a" />
      <circle cx="60" cy="38" r="32" fill="#62c06a" />
      <circle cx="50" cy="28" r="14" fill="#86d684" />
      <circle cx="30" cy="48" r="8" fill="#62c06a" />
      {[
        [38, 56],
        [82, 50],
        [62, 64],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="7.500" fill="#f0605d" />
          <circle cx={x - 2.5} cy={y - 2.5} r="2" fill="#ffc2bd" />
        </g>
      ))}
    </>
  ),
  house: ({ color, night }) => (
    <>
      <rect x="80" y="14" width="13" height="28" rx="2" fill="#c9553f" />
      <rect
        x="20"
        y="54"
        width="80"
        height="58"
        rx="4"
        fill={color || "#efcf9d"}
      />
      <rect x="20" y="54" width="80" height="9" fill="#000" opacity="0.1" />
      <path
        d="M8 58 55 14q5-4 10 0l47 44q2 4-3 4H11q-5 0-3-4Z"
        fill="#e8654f"
      />
      <path d="M52 112V88a8 8 0 0 1 16 0v24Z" fill="#5fa7b8" />
      <circle cx="64" cy="100" r="1.800" fill="#ffd24d" />
      {[28, 74].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="70"
            width="18"
            height="18"
            rx="4"
            fill={night ? "#ffd24d" : "#c8ecf7"}
          />
          <path
            d={`M${x + 9} 70v18M${x} 79h18`}
            stroke="#fff"
            strokeWidth="2.500"
          />
        </g>
      ))}
    </>
  ),
  sun: () => (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
        <rect
          key={r}
          x="56"
          y="4"
          width="8"
          height="18"
          rx="4"
          fill="#ffb020"
          transform={`rotate(${r} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="29" fill="#ffc93c" />
      <Face y={56} dx={11} mouthY={64} />
      <circle cx="42" cy="66" r="5" fill="#ff9d7a" />
      <circle cx="78" cy="66" r="5" fill="#ff9d7a" />
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
        d="M22 80a18 18 0 0 1 4-36 28 28 0 0 1 54-4 20 20 0 0 1 18 40Z"
        fill="#ffffff"
      />
      <path
        d="M12 72q48 12 100 0a18 18 0 0 1-14 8H22a18 18 0 0 1-10-8Z"
        fill="#dcedf8"
      />
      <Face y={58} dx={10} mouthY={64} />
      <circle cx="42" cy="66" r="4.500" fill={BLUSH} />
      <circle cx="78" cy="66" r="4.500" fill={BLUSH} />
    </>
  ),
};
