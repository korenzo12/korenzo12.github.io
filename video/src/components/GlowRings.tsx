import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, easings } from "@/theme";
import { lerp } from "@/utils/animation";

interface Ring {
  /** Frame at which this ring starts expanding */
  start: number;
  /** Final scale (1 = baseSize) */
  endScale: number;
  /** Initial opacity */
  opacity: number;
  /** Stroke width in px */
  stroke: number;
}

/**
 * Concentric expanding glow rings — the signature element of the reel.
 * Rings continuously emit from the centre and fade as they expand outward.
 */
export const GlowRings: React.FC<{
  centerX?: number;
  centerY?: number;
  baseSize?: number;
  count?: number;
  cadence?: number;
  intensity?: number;
}> = ({
  centerX = 540,
  centerY = 960,
  baseSize = 600,
  count = 6,
  cadence = 35,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const rings: Ring[] = Array.from({ length: count }, (_, i) => ({
    start: -i * cadence,
    endScale: 3.4,
    opacity: 0.85,
    stroke: 3,
  }));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="ring-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        {rings.map((ring, i) => {
          const localFrame = (frame - ring.start) % (cadence * count);
          const progress = localFrame / (cadence * count);
          const scale = lerp(progress, [0, 1], [0.2, ring.endScale], {
            easing: easings.steady,
          });
          const opacity = lerp(progress, [0, 0.15, 0.7, 1], [0, ring.opacity, ring.opacity * 0.4, 0]) * intensity;
          const r = baseSize * scale * 0.5;
          return (
            <g key={i}>
              <circle
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke={colors.ring.primary}
                strokeWidth={ring.stroke}
                opacity={opacity}
                filter="url(#ring-blur)"
              />
              <circle
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke={colors.ring.secondary}
                strokeWidth={ring.stroke + 6}
                opacity={opacity * 0.35}
                filter="url(#ring-blur)"
              />
            </g>
          );
        })}
        {/* Subtle radial wash at the centre to anchor the rings */}
        <circle
          cx={centerX}
          cy={centerY}
          r={baseSize * 0.45}
          fill={colors.ring.blur}
          opacity={0.5 * intensity}
          filter="url(#ring-blur)"
        />
      </svg>
    </AbsoluteFill>
  );
};
