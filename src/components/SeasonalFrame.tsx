import { cn } from "../styles";
import type { SeasonalEvent } from "../game/seasons";

function TetRibbonCorner() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-svg")}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="tet-glow" cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#ffe082" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffe082" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tet-red-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b71c1c" />
          <stop offset="0.5" stopColor="#d32f2f" />
          <stop offset="1" stopColor="#e53935" />
        </linearGradient>
        <linearGradient id="tet-gold-trim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd54f" />
          <stop offset="0.5" stopColor="#fff8e1" />
          <stop offset="1" stopColor="#ffb300" />
        </linearGradient>
      </defs>

      {/* Ambient warm corner glow */}
      <circle cx="50" cy="50" r="100" fill="url(#tet-glow)" />

      {/* Decorative scalloped corner ribbon */}
      <path
        d="M-10 60 Q60 50 80 -10 L110 -10 Q85 85 -10 110 Z"
        fill="url(#tet-red-ribbon)"
        stroke="url(#tet-gold-trim)"
        strokeWidth="3.5"
      />
      <path
        d="M-10 32 Q35 28 42 -10 L62 -10 Q48 50 -10 68 Z"
        fill="#c62828"
        stroke="#ffd54f"
        strokeWidth="2"
      />

      {/* Hanging silk cord & red envelope (Bao lì xì) */}
      <path
        d="M42 80 Q45 125 48 142"
        stroke="#ffb300"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g transform="translate(36, 142) rotate(6)">
        <rect
          x="0"
          y="0"
          width="26"
          height="38"
          rx="4"
          fill="#c62828"
          stroke="#ffe082"
          strokeWidth="2"
        />
        <circle cx="13" cy="16" r="6" fill="#ffe082" />
        <path
          d="M13 12 L14.5 15 L18 15.5 L15.5 18 L16 21.5 L13 19.5 L10 21.5 L10.5 18 L8 15.5 L11.5 15 Z"
          fill="#c62828"
        />
        {/* Gold tassel */}
        <path
          d="M13 38 v14"
          stroke="#ffb300"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="13" cy="41" r="2.5" fill="#ffd54f" />
      </g>

      {/* Second smaller cord with golden coin / tassel */}
      <path
        d="M92 42 Q96 75 98 86"
        stroke="#ffb300"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="98"
        cy="90"
        r="6.5"
        fill="#ffd54f"
        stroke="#ff8f00"
        strokeWidth="1.5"
      />
      <rect x="96" y="88" width="4" height="4" fill="#c62828" />
      <path
        d="M98 96 v12"
        stroke="#e53935"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Brown blossom branches */}
      <path
        d="M-5 15 Q40 35 75 22 Q105 12 135 18 M55 30 Q70 60 95 68"
        stroke="#5d4037"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Blooming Yellow Mai Blossoms (Hoa mai vàng) */}
      {/* Blossom 1 (Large main flower) */}
      <g transform="translate(68, 26)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-12"
            rx="7"
            ry="11"
            fill="#ffca28"
            stroke="#ffb300"
            strokeWidth="1.2"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="5.5" fill="#ff6f00" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle
            key={a}
            cx={4.5 * Math.cos((a * Math.PI) / 180)}
            cy={4.5 * Math.sin((a * Math.PI) / 180)}
            r="1"
            fill="#fff9c4"
          />
        ))}
      </g>

      {/* Blossom 2 (Top branch) */}
      <g transform="translate(125, 20) scale(0.78)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-11"
            rx="6.5"
            ry="10"
            fill="#ffd54f"
            stroke="#ffb300"
            strokeWidth="1"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="4.5" fill="#ff6f00" />
      </g>

      {/* Blossom 3 (Side branch) */}
      <g transform="translate(90, 66) scale(0.85)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-11"
            rx="6.5"
            ry="10"
            fill="#ffca28"
            stroke="#ffb300"
            strokeWidth="1"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="5" fill="#ff6f00" />
      </g>

      {/* Blossom 4 (Corner bud) */}
      <g transform="translate(26, 38) scale(0.7)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-10"
            rx="6"
            ry="9"
            fill="#ffe082"
            stroke="#ffb300"
            strokeWidth="1"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="4" fill="#ff8f00" />
      </g>

      {/* Little green spring leaf buds */}
      <ellipse
        cx="44"
        cy="22"
        rx="3"
        ry="6"
        fill="#43a047"
        transform="rotate(-35 44 22)"
      />
      <ellipse
        cx="106"
        cy="18"
        rx="2.5"
        ry="5.5"
        fill="#43a047"
        transform="rotate(40 106 18)"
      />
      <ellipse
        cx="80"
        cy="54"
        rx="2.5"
        ry="5.5"
        fill="#43a047"
        transform="rotate(25 80 54)"
      />
    </svg>
  );
}

function MidAutumnCorner() {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-svg")}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ma-glow" cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#fff59d" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff59d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient warm corner glow */}
      <circle cx="50" cy="50" r="110" fill="url(#ma-glow)" />

      {/* Festive garland hanging cord */}
      <path
        d="M-10 30 Q70 65 140 15 Q180 -5 220 -10"
        stroke="#e65100"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Traditional Star Lantern (Đèn ông sao) */}
      <g transform="translate(68, 92)">
        {/* Hanging thread */}
        <path d="M0 -45 L0 -24" stroke="#ffb300" strokeWidth="2" />
        {/* Bamboo circular ring around star */}
        <circle
          cx="0"
          cy="0"
          r="28"
          stroke="#ffb300"
          strokeWidth="2.5"
          fill="#fff9c4"
          fillOpacity="0.35"
        />
        {/* Star */}
        <path
          d="M0 -24 L7 -8 L24 -8 L11 2 L16 19 L0 9 L-16 19 L-11 2 L-24 -8 L-7 -8 Z"
          fill="#e53935"
          stroke="#ffca28"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="0" r="6" fill="#ffd54f" />
        {/* Colorful cellophane tassels */}
        <path
          d="M-8 26 v16 M0 28 v20 M8 26 v16"
          stroke="#e53935"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Round Paper Lantern (Đèn lồng tròn) */}
      <g transform="translate(142, 54)">
        <path d="M0 -40 L0 -16" stroke="#ffb300" strokeWidth="2" />
        <ellipse
          cx="0"
          cy="0"
          rx="15"
          ry="17"
          fill="#fb8c00"
          stroke="#ffd54f"
          strokeWidth="2"
        />
        <path
          d="M-12 -6 Q0 -10 12 -6 M-14 0 Q0 -3 14 0 M-12 6 Q0 3 12 6"
          stroke="#fff3e0"
          strokeWidth="1.2"
          opacity="0.8"
        />
        <rect x="-6" y="-18" width="12" height="3" rx="1.5" fill="#d84315" />
        <rect x="-6" y="15" width="12" height="3" rx="1.5" fill="#d84315" />
        <path
          d="M0 18 v14"
          stroke="#d84315"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* Small golden star sparkles */}
      <path
        d="M26 42 l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"
        fill="#ffd54f"
        opacity="0.9"
      />
      <path
        d="M112 28 l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"
        fill="#ffe082"
        opacity="0.85"
      />
      <path
        d="M104 116 l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"
        fill="#fff59d"
        opacity="0.8"
      />
    </svg>
  );
}

type Props = {
  season: SeasonalEvent;
};

export function SeasonalFrame({ season }: Props) {
  if (!season) return null;

  return (
    <aside
      className={cn("seasonal-frame")}
      data-season={season}
      aria-label={
        season === "tet" ? "Khung hội hoa mai đón Tết" : "Khung hội Trung thu"
      }
      role="presentation"
    >
      <div className={cn("seasonal-corner-tl")}>
        {season === "tet" ? <TetRibbonCorner /> : <MidAutumnCorner />}
      </div>
      <div className={cn("seasonal-corner-tr")}>
        {season === "tet" ? <TetRibbonCorner /> : <MidAutumnCorner />}
      </div>
    </aside>
  );
}
