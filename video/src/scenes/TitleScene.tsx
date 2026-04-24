import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { GlowRings } from "@/components/GlowRings";
import { DesktopIllustration } from "@/components/DesktopIllustration";
import { typography, colors, easings } from "@/theme";
import { lerp, popSpring } from "@/utils/animation";
import type { TitleScene as TitleSceneProps } from "@/types/plan";

export const TitleSceneRenderer: React.FC<{ scene: TitleSceneProps; rtl?: boolean }> = ({
  scene,
  rtl = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const illustrationScale = popSpring(frame, fps, 0, {
    damping: 14,
    stiffness: 120,
    mass: 0.8,
  });
  const illustrationY = lerp(frame, [60, 110], [0, -120], { easing: easings.slideIn });
  const titleScale = popSpring(frame, fps, 90);
  const titleY = lerp(frame, [90, 140], [40, 0], { easing: easings.slideIn });

  return (
    <AbsoluteFill style={{ direction: rtl ? "rtl" : "ltr" }}>
      {scene.showRings && (
        <GlowRings centerX={540} centerY={960} baseSize={560} count={6} cadence={28} />
      )}
      {scene.illustration === "desktop" && (
        <div
          style={{
            position: "absolute",
            top: 700,
            left: "50%",
            transform: `translate(-50%, ${illustrationY}px) scale(${illustrationScale})`,
          }}
        >
          <DesktopIllustration size={720} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${titleY}px) scale(${titleScale})`,
          opacity: lerp(frame, [80, 110], [0, 1]),
        }}
      >
        <div
          style={{
            ...typography.title,
            color: colors.text.primary,
            fontStyle: "italic",
            padding: "0 60px",
          }}
        >
          {scene.title}
        </div>
      </div>
      {scene.subtitle && (
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
              padding: "0 60px",
            }}
          >
            {scene.subtitle}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
