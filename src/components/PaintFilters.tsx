// Shared SVG filters that give vector placeholders a hand-painted watercolor look:
// slightly wobbly edges, pigment that pools a little darker at the rim, and paper grain.
// Rendered once at the app root; Art and SceneBackdrop reference them by id.
// Animated layers must stay outside these filters so the browser does not re-filter every frame.
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
        {/* Objects drawn on a 120×120 canvas. */}
        <filter
          id="lw-paint"
          x="-12%"
          y="-12%"
          width="124%"
          height="124%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="2"
            seed="7"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="3.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="wobble"
          />
          <feMorphology
            in="wobble"
            operator="erode"
            radius="1.6"
            result="inner"
          />
          <feComposite in="wobble" in2="inner" operator="out" result="rim" />
          <feColorMatrix
            in="rim"
            type="matrix"
            values="0.72 0 0 0 0  0 0.72 0 0 0  0 0 0.72 0 0  0 0 0 0.38 0"
            result="pool"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            numOctaves="3"
            seed="2"
            result="grainNoise"
          />
          <feColorMatrix
            in="grainNoise"
            type="saturate"
            values="0"
            result="grainGray"
          />
          <feComponentTransfer in="grainGray" result="paper">
            <feFuncR type="linear" slope="0.22" intercept="0.8" />
            <feFuncG type="linear" slope="0.22" intercept="0.8" />
            <feFuncB type="linear" slope="0.22" intercept="0.8" />
          </feComponentTransfer>
          <feBlend in="wobble" in2="paper" mode="multiply" result="painted" />
          <feComposite in="painted" in2="wobble" operator="in" result="body" />
          <feMerge>
            <feMergeNode in="body" />
            <feMergeNode in="pool" />
          </feMerge>
        </filter>
        {/* Full scenes drawn on a 1600×900 canvas: larger wobble, finer paper. */}
        <filter
          id="lw-paint-scene"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006"
            numOctaves="2"
            seed="11"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="16"
            xChannelSelector="R"
            yChannelSelector="G"
            result="wobble"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="3"
            seed="4"
            result="washNoise"
          />
          <feColorMatrix
            in="washNoise"
            type="saturate"
            values="0"
            result="washGray"
          />
          <feComponentTransfer in="washGray" result="wash">
            <feFuncR type="linear" slope="0.13" intercept="0.88" />
            <feFuncG type="linear" slope="0.13" intercept="0.88" />
            <feFuncB type="linear" slope="0.13" intercept="0.88" />
          </feComponentTransfer>
          <feBlend in="wobble" in2="wash" mode="multiply" result="washed" />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.45"
            numOctaves="2"
            seed="9"
            result="grainNoise"
          />
          <feColorMatrix
            in="grainNoise"
            type="saturate"
            values="0"
            result="grainGray"
          />
          <feComponentTransfer in="grainGray" result="paper">
            <feFuncR type="linear" slope="0.1" intercept="0.91" />
            <feFuncG type="linear" slope="0.1" intercept="0.91" />
            <feFuncB type="linear" slope="0.1" intercept="0.91" />
          </feComponentTransfer>
          <feBlend in="washed" in2="paper" mode="multiply" />
        </filter>
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
