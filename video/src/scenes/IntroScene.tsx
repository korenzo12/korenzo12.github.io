import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { GlowRings } from "@/components/GlowRings";
import { DesktopIllustration } from "@/components/DesktopIllustration";
import { typography, colors, easings } from "@/theme";
import { lerp, popSpring } from "@/utils/animation";

/**
 * Opening: desktop illustration appears in the centre with rings expanding outward,
 * then the title "in 30 seconds" pops in.
 */
export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const illustrationScale = popSpring(frame, fps, 0, {
    damping: 14,
    stiffness: 120,
    mass: 0.8,
  });
  const illustrationY = lerp(frame, [60, 110], [0, -120], { easing: easings.slideIn });
  const titleProgress = popSpring(frame, fps, 100);
  const titleY = lerp(frame, [100, 140], [40, 0], { easing: easings.slideIn });

  return (
    <AbsoluteFill>
      <GlowRings centerX={540} centerY={960} baseSize={560} count={6} cadence={28} />

      {/* Illustration */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: "50%",
          transform: `translate(-50%, ${illustrationY}px) scale(${illustrationScale})`,
          transformOrigin: "center",
        }}
      >
        <DesktopIllustration size={720} />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            ...typography.title,
            color: colors.text.primary,
            fontStyle: "italic",
          }}
        >
          in 30 seconds
        </div>
      </div>

      {/* Top eyebrow text */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: lerp(frame, [10, 30], [0, 1]),
        }}
      >
        <div
          style={{
            ...typography.subtitle,
            color: colors.text.secondary,
            fontWeight: 700,
          }}
        >
          Setup Claude Code
        </div>
      </div>
    </AbsoluteFill>
  );
};
