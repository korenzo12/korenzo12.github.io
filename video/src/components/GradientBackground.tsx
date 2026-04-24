import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "@/theme";
import { lerp } from "@/utils/animation";

/**
 * Warm-amber gradient background with subtle drifting glow,
 * mirroring the look of the @alex.snippet reel.
 */
export const GradientBackground: React.FC<{
  drift?: boolean;
}> = ({ drift = true }) => {
  const frame = useCurrentFrame();
  const angle = drift ? lerp(frame, [0, 600], [165, 195]) : 180;
  const glowX = drift ? lerp(frame, [0, 600], [50, 55]) : 50;
  const glowY = drift ? lerp(frame, [0, 600], [22, 28]) : 25;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${colors.bg.top} 0%, ${colors.bg.mid} 55%, ${colors.bg.bottom} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${glowX}% ${glowY}%, ${colors.bg.glow} 0%, rgba(255,244,212,0) 60%)`,
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 100%, rgba(208, 80, 20, 0.45) 0%, rgba(208,80,20,0) 55%)`,
          mixBlendMode: "multiply",
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
