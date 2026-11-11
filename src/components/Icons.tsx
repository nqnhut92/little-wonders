import type { ReactNode } from "react";
import { cn } from "../styles";
// Interface icons stay as repository vectors: solid, rounded, one visual weight.
// They are chrome, not artwork, so they are not part of the Gemini handoff.
export type IconName =
  | "speaker-on"
  | "speaker-off"
  | "book"
  | "gear"
  | "bulb"
  | "close"
  | "cup"
  | "saved"
  | "cloud-saved"
  | "cloud-waiting"
  | "busy"
  | "map"
  | "broom"
  | "yes"
  | "no";
const speaker = (
  <path d="M4 9.5A1.5 1.5 0 0 1 5.5 8H8l4.2-3.4a1 1 0 0 1 1.6.8v13.2a1 1 0 0 1-1.6.8L8 16H5.5A1.5 1.5 0 0 1 4 14.5z" />
);
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const cloud =
  "M7 19a4.6 4.6 0 0 1-.7-9.15A6.1 6.1 0 0 1 18.1 11 4.05 4.05 0 0 1 17.5 19z";
const paths: Record<IconName, ReactNode> = {
  "speaker-on": (
    <>
      {speaker}
      <path
        {...line}
        d="M17 9.3a4 4 0 0 1 0 5.4M19.4 6.6a7.7 7.7 0 0 1 0 10.8"
      />
    </>
  ),
  "speaker-off": (
    <>
      {speaker}
      <path {...line} d="m17 9.6 4.8 4.8m0-4.8L17 14.4" />
    </>
  ),
  book: (
    <>
      <path d="M2.8 6.3c0-.8.7-1.4 1.5-1.3 2.5.1 4.7.8 6.6 2v12.7c-1.9-1.2-4.1-1.8-6.7-1.9-.8 0-1.4-.6-1.4-1.4z" />
      <path d="M21.2 6.3c0-.8-.7-1.4-1.5-1.3-2.5.1-4.7.8-6.6 2v12.7c1.9-1.2 4.1-1.8 6.7-1.9.8 0 1.4-.6 1.4-1.4z" />
    </>
  ),
  gear: (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect
          key={a}
          x="10.1"
          y="1.7"
          width="3.8"
          height="5.2"
          rx="1.5"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
      <path
        fillRule="evenodd"
        d="M12 4.9a7.1 7.1 0 1 0 0 14.2 7.1 7.1 0 0 0 0-14.2zm0 4.2a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8z"
      />
    </>
  ),
  bulb: (
    <>
      <path d="M12 2.4a7 7 0 0 0-4.3 12.5c.6.5 1 1.1 1 1.8v.5h6.6v-.5c0-.7.4-1.3 1-1.8A7 7 0 0 0 12 2.4z" />
      <rect x="8.9" y="18.3" width="6.2" height="1.9" rx=".95" />
      <rect x="10" y="20.7" width="4" height="1.7" rx=".85" />
    </>
  ),
  close: <path {...line} strokeWidth={3} d="m6.5 6.5 11 11m0-11-11 11" />,
  cup: (
    <>
      <path d="M4.5 9h11.6v5.3a5.2 5.2 0 0 1-5.2 5.2H9.7a5.2 5.2 0 0 1-5.2-5.2z" />
      <path {...line} strokeWidth={2} d="M16 10.6h1.3a2.4 2.4 0 0 1 0 4.8H16" />
      <path {...line} strokeWidth={2} d="M8 3.6v2.2m4-2.8v2.8" />
    </>
  ),
  saved: (
    <path
      fillRule="evenodd"
      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm4.5 6.9a1.1 1.1 0 0 0-1.6-1.5l-4.1 4.3-1.7-1.7a1.1 1.1 0 1 0-1.6 1.6l2.5 2.5a1.1 1.1 0 0 0 1.6 0z"
    />
  ),
  "cloud-saved": (
    <>
      <path d={cloud} />
      <path
        fill="none"
        stroke="var(--icon-cut, #fff)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.2 13.9 2 2 3.6-3.9"
      />
    </>
  ),
  "cloud-waiting": <path {...line} strokeWidth={2} d={cloud} />,
  map: (
    <>
      <path d="M3 6.5 9 4v14l-6 2.500z" />
      <path d="m10.500 4 4 2v14l-4-2z" />
      <path d="m16 6 5-2v14l-5 2.500z" />
    </>
  ),
  broom: (
    <>
      <path d="M14.6 3.2a1.6 1.6 0 0 1 2.3 2.2l-4.1 5.2-2.6-1.9z" />
      <path d="M9.4 9.9 14 13.2c.9.7 1.2 1.9.6 2.9l-2.4 4.1c-.3.5-.9.7-1.4.5-3.4-1.4-5.8-3.7-7.1-7-.2-.6.1-1.200.7-1.400z" />
    </>
  ),
  yes: <path {...line} strokeWidth={3.2} d="m5 12.5 4.6 4.6L19 7.4" />,
  no: <path {...line} strokeWidth={3.2} d="m6.5 6.5 11 11m0-11-11 11" />,
  busy: <path {...line} d="M12 4a8 8 0 1 1-7.4 5" />,
};
export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      className={cn(`icon ${name === "busy" ? "spin" : ""}`)}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
export function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
