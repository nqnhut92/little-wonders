import { cn } from "../styles";
import type { SeasonalEvent } from "../game/seasons";

function TetCornerFlower() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-corner-ornament")}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="#c62828"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      <g transform="translate(12, 12) scale(0.55)">
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
        <circle cx="0" cy="0" r="4" fill="#e65100" />
        <circle cx="0" cy="0" r="2.2" fill="#ffd54f" />
      </g>
    </svg>
  );
}

function MidAutumnCornerStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("seasonal-corner-ornament")}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="#1a237e"
        stroke="#ffd54f"
        strokeWidth="1.5"
      />
      <path
        d="M12 4.5 L14 9.5 L19.5 10 L15.5 13.8 L16.8 19.5 L12 16.5 L7.2 19.5 L8.5 13.8 L4.5 10 L10 9.5 Z"
        fill="#ffca28"
        stroke="#ff8f00"
        strokeWidth="0.8"
      />
    </svg>
  );
}

type Props = {
  season?: SeasonalEvent;
};

export function SeasonalFrame({ season }: Props) {
  if (!season) return null;
  const isTet = season === "tet";
  const Corner = isTet ? TetCornerFlower : MidAutumnCornerStar;
  return (
    <aside
      className={cn("seasonal-frame")}
      data-season={season}
      aria-label={isTet ? "Khung đón Tết hoa mai" : "Khung hội Trung thu"}
      role="presentation"
    >
      <div className={cn("seasonal-border")}>
        <div className={cn("seasonal-corner tl")}>
          <Corner />
        </div>
        <div className={cn("seasonal-corner tr")}>
          <Corner />
        </div>
        <div className={cn("seasonal-corner bl")}>
          <Corner />
        </div>
        <div className={cn("seasonal-corner br")}>
          <Corner />
        </div>
      </div>
    </aside>
  );
}
