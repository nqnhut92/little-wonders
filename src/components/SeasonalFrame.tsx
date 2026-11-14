import { cn } from "../styles";
import type { SeasonalEvent } from "../game/seasons";

/* -------------------------------------------------------------------------- */
/* Tết (Lunar New Year) Ornaments                                             */
/* -------------------------------------------------------------------------- */

function TetCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Traditional gilded cloud corner bracket */}
      <path
        d="M2 2 H26 C22 8 16 10 12 14 C10 16 8 22 2 26 Z"
        fill="#c62828"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      {/* Bright 5-petal golden apricot blossom (hoa mai) */}
      <g transform="translate(14, 14) scale(0.65)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-9"
            rx="5.5"
            ry="8.5"
            fill="#ffca28"
            stroke="#ff8f00"
            strokeWidth="0.8"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle cx="0" cy="0" r="4.2" fill="#e65100" />
        <circle cx="0" cy="0" r="2.2" fill="#ffd54f" />
      </g>
    </svg>
  );
}

function TetCenterGarland() {
  return (
    <svg
      viewBox="0 0 280 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-center-garland")}
      aria-hidden="true"
    >
      {/* Red silk ribbon draped left and right */}
      <path
        d="M20 6 Q70 24 140 18 Q210 24 260 6 Q210 28 140 24 Q70 28 20 6Z"
        fill="#c62828"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      {/* Golden coins on both sides */}
      <g transform="translate(56, 17)">
        <circle
          cx="0"
          cy="0"
          r="7"
          fill="#ffd54f"
          stroke="#ff8f00"
          strokeWidth="1"
        />
        <rect x="-2.5" y="-2.5" width="5" height="5" fill="#c62828" />
      </g>
      <g transform="translate(224, 17)">
        <circle
          cx="0"
          cy="0"
          r="7"
          fill="#ffd54f"
          stroke="#ff8f00"
          strokeWidth="1"
        />
        <rect x="-2.5" y="-2.5" width="5" height="5" fill="#c62828" />
      </g>

      {/* Flanking golden apricot blossoms (hoa mai) */}
      <g transform="translate(98, 19) scale(0.65)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-8"
            rx="5"
            ry="7.5"
            fill="#ffca28"
            stroke="#ff8f00"
            strokeWidth="0.8"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#e65100" />
        <circle cx="0" cy="0" r="1.8" fill="#ffd54f" />
      </g>
      <g transform="translate(182, 19) scale(0.65)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-8"
            rx="5"
            ry="7.5"
            fill="#ffca28"
            stroke="#ff8f00"
            strokeWidth="0.8"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#e65100" />
        <circle cx="0" cy="0" r="1.8" fill="#ffd54f" />
      </g>

      {/* Center main blossom rosette */}
      <g transform="translate(140, 18) scale(0.9)">
        <circle
          cx="0"
          cy="0"
          r="12"
          fill="#b71c1c"
          stroke="#ffd54f"
          strokeWidth="1.5"
        />
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-8"
            rx="4.8"
            ry="7.5"
            fill="#ffca28"
            stroke="#ff8f00"
            strokeWidth="0.8"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#e65100" />
        <circle cx="0" cy="0" r="2" fill="#ffd54f" />
      </g>

      {/* Hanging red envelope (bao lì xì) under center */}
      <g transform="translate(140, 28)">
        <path d="M0 0 L0 5" stroke="#ffd54f" strokeWidth="1.2" />
        <rect
          x="-5.5"
          y="5"
          width="11"
          height="14"
          rx="1.5"
          fill="#d32f2f"
          stroke="#ffd54f"
          strokeWidth="1"
        />
        <circle cx="0" cy="11" r="2.2" fill="#ffd54f" />
      </g>
    </svg>
  );
}

function TetSideLeft() {
  return (
    <svg
      viewBox="0 0 28 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-side-streamer left")}
      aria-hidden="true"
    >
      {/* Golden hanging thread */}
      <path d="M14 0 V24 M14 36 V52" stroke="#ffd54f" strokeWidth="1.2" />
      {/* Top mai flower */}
      <g transform="translate(14, 24) scale(0.55)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="0"
            cy="-8"
            rx="5"
            ry="7.5"
            fill="#ffca28"
            stroke="#ff8f00"
            strokeWidth="0.8"
            transform={`rotate(${a})`}
          />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="#e65100" />
      </g>
      {/* Red envelope (bao lì xì) */}
      <rect
        x="8"
        y="52"
        width="12"
        height="18"
        rx="2"
        fill="#d32f2f"
        stroke="#ffd54f"
        strokeWidth="1.2"
      />
      <circle cx="14" cy="60" r="2.5" fill="#ffd54f" />
      {/* Tassel */}
      <path
        d="M14 70 V79 M11 77 L14 79 L17 77"
        stroke="#ffd54f"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function TetSideRight() {
  return (
    <svg
      viewBox="0 0 28 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-side-streamer right")}
      aria-hidden="true"
    >
      {/* Hanging thread */}
      <path d="M14 0 V30" stroke="#ffd54f" strokeWidth="1.2" />
      {/* Round Vietnamese red paper lantern (đèn lồng đỏ) */}
      <g transform="translate(14, 44)">
        {/* Top/bottom gold rims */}
        <rect x="-6" y="-16" width="12" height="3" rx="1" fill="#ffd54f" />
        <rect x="-5" y="13" width="10" height="3" rx="1" fill="#ffd54f" />
        {/* Lantern sphere */}
        <ellipse
          cx="0"
          cy="0"
          rx="11"
          ry="14"
          fill="#c62828"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="6"
          ry="14"
          fill="none"
          stroke="#ffd54f"
          strokeWidth="0.8"
        />
        <path d="M0 -14 V14" stroke="#ffd54f" strokeWidth="0.8" />
        {/* Hanging tassel */}
        <path
          d="M0 16 V28 M-3 25 L0 28 L3 25"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Trung Thu (Mid-Autumn) Ornaments                                           */
/* -------------------------------------------------------------------------- */

function MidAutumnCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Night-sky corner bracket */}
      <path
        d="M2 2 H26 C22 8 16 10 12 14 C10 16 8 22 2 26 Z"
        fill="#1a237e"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      {/* Golden star */}
      <path
        d="M14 7 L15.5 11.5 L20 12 L16.8 15 L17.8 19.5 L14 17 L10.2 19.5 L11.2 15 L8 12 L12.5 11.5 Z"
        fill="#ffd54f"
        stroke="#ff8f00"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function MidAutumnCenterGarland() {
  return (
    <svg
      viewBox="0 0 280 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-center-garland")}
      aria-hidden="true"
    >
      {/* Midnight blue ribbon with gold border */}
      <path
        d="M20 6 Q70 24 140 18 Q210 24 260 6 Q210 28 140 24 Q70 28 20 6Z"
        fill="#1a237e"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      {/* Golden stars */}
      <g transform="translate(52, 17)">
        <path
          d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"
          fill="#ffd54f"
        />
      </g>
      <g transform="translate(228, 17)">
        <path
          d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"
          fill="#ffd54f"
        />
      </g>

      {/* Flanking Vietnamese star lanterns (lồng đèn ông sao) */}
      <g transform="translate(96, 20)">
        {/* Red bamboo rim */}
        <circle
          cx="0"
          cy="0"
          r="10.5"
          fill="#c62828"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
        {/* Star */}
        <path
          d="M0 -8 L2.4 -2.5 L8.5 -2.5 L3.8 1 L5.6 7 L0 3.5 L-5.6 7 L-3.8 1 L-8.5 -2.5 L-2.4 -2.5 Z"
          fill="#ffca28"
          stroke="#e65100"
          strokeWidth="0.8"
        />
        <circle cx="0" cy="0" r="2.2" fill="#d32f2f" />
        {/* Tassels */}
        <path
          d="M-4 10 L-4 16 M0 10 L0 18 M4 10 L4 16"
          stroke="#ffd54f"
          strokeWidth="1"
        />
      </g>
      <g transform="translate(184, 20)">
        <circle
          cx="0"
          cy="0"
          r="10.5"
          fill="#c62828"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
        <path
          d="M0 -8 L2.4 -2.5 L8.5 -2.5 L3.8 1 L5.6 7 L0 3.5 L-5.6 7 L-3.8 1 L-8.5 -2.5 L-2.4 -2.5 Z"
          fill="#ffca28"
          stroke="#e65100"
          strokeWidth="0.8"
        />
        <circle cx="0" cy="0" r="2.2" fill="#d32f2f" />
        <path
          d="M-4 10 L-4 16 M0 10 L0 18 M4 10 L4 16"
          stroke="#ffd54f"
          strokeWidth="1"
        />
      </g>

      {/* Center glowing golden full moon (vầng trăng tròn Trung Thu) */}
      <g transform="translate(140, 19)">
        <circle
          cx="0"
          cy="0"
          r="13.5"
          fill="#ffd54f"
          stroke="#ff8f00"
          strokeWidth="1.5"
        />
        {/* Moon blush and cute face */}
        <ellipse cx="-4" cy="-1" rx="1.5" ry="2" fill="#5d4037" />
        <ellipse cx="4" cy="-1" rx="1.5" ry="2" fill="#5d4037" />
        <path
          d="M-2.5 3 Q0 5.5 2.5 3"
          stroke="#5d4037"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="-7" cy="2" rx="2" ry="1.2" fill="#ff7043" opacity="0.6" />
        <ellipse cx="7" cy="2" rx="2" ry="1.2" fill="#ff7043" opacity="0.6" />
      </g>
    </svg>
  );
}

function MidAutumnSideLeft() {
  return (
    <svg
      viewBox="0 0 28 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-side-streamer left")}
      aria-hidden="true"
    >
      {/* Hanging thread */}
      <path d="M14 0 V26" stroke="#ffd54f" strokeWidth="1.2" />
      {/* 5-pointed star lantern (đèn ông sao) */}
      <g transform="translate(14, 38)">
        <circle
          cx="0"
          cy="0"
          r="11"
          fill="#c62828"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
        <path
          d="M0 -9 L2.5 -2.8 L9 -2.8 L4 1.2 L6 7.5 L0 3.8 L-6 7.5 L-4 1.2 L-9 -2.8 L-2.5 -2.8 Z"
          fill="#ffca28"
          stroke="#e65100"
          strokeWidth="0.8"
        />
        <circle cx="0" cy="0" r="2.5" fill="#d32f2f" />
        {/* Festive streamer tails */}
        <path
          d="M-4 11 L-6 24 M0 11 L0 26 M4 11 L6 24"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

function MidAutumnSideRight() {
  return (
    <svg
      viewBox="0 0 28 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-side-streamer right")}
      aria-hidden="true"
    >
      {/* Hanging thread */}
      <path d="M14 0 V24" stroke="#ffd54f" strokeWidth="1.2" />
      {/* Accordion paper lantern (đèn lồng quả trám/giấy xếp) */}
      <g transform="translate(14, 42)">
        <rect x="-6" y="-16" width="12" height="3" rx="1" fill="#ffd54f" />
        <rect x="-5" y="13" width="10" height="3" rx="1" fill="#ffd54f" />
        <path
          d="M-8 -13 L-11 -4 L-11 4 L-8 13 H8 L11 4 L11 -4 L8 -13 Z"
          fill="#ff7043"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
        <path d="M-11 -4 H11 M-11 4 H11" stroke="#ffd54f" strokeWidth="0.8" />
        <path
          d="M0 16 V26 M-3 24 L0 26 L3 24"
          stroke="#ffd54f"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Exported Seasonal Frame                                                    */
/* -------------------------------------------------------------------------- */

type Props = {
  season?: SeasonalEvent;
};

export function SeasonalFrame({ season }: Props) {
  if (!season) return null;
  const isTet = season === "tet";
  const Corner = isTet ? TetCorner : MidAutumnCorner;
  const Garland = isTet ? TetCenterGarland : MidAutumnCenterGarland;
  const SideLeft = isTet ? TetSideLeft : MidAutumnSideLeft;
  const SideRight = isTet ? TetSideRight : MidAutumnSideRight;

  return (
    <aside
      className={cn("seasonal-frame")}
      data-season={season}
      aria-label={isTet ? "Khung đón Tết hoa mai" : "Khung hội Trung thu"}
      role="presentation"
    >
      {/* Outer framing border with gold ribbon piping */}
      <div className={cn("seasonal-border")}>
        {/* 4 Corner decorative brackets */}
        <Corner className={cn("seasonal-corner tl")} />
        <Corner className={cn("seasonal-corner tr")} />
        <Corner className={cn("seasonal-corner bl")} />
        <Corner className={cn("seasonal-corner br")} />

        {/* Hanging vertical side streamers along outer margins (no buttons) */}
        <SideLeft />
        <SideRight />

        {/* Top-center festive holiday garland */}
        <Garland />
      </div>
    </aside>
  );
}
