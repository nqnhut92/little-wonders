// Shared SVG filters for light effects only (glow and soft blur). The artwork itself is flat and unfiltered.
// Rendered once at the app root; SceneBackdrop references them by id.
export function PaintFilters() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Soft glow for lights: fireflies, lanterns, the moon halo. */}
        <filter id="lw-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="lw-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
    </svg>
  );
}
