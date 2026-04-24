import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { typography, colors } from "@/theme";
import { popSpring, lerp } from "@/utils/animation";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = popSpring(frame, fps, 0);
  const followScale = popSpring(frame, fps, 16);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
      <div
        style={{
          ...typography.hero,
          color: colors.text.primary,
          transform: `scale(${titleScale})`,
          fontStyle: "italic",
        }}
      >
        Done.
      </div>
      <div
        style={{
          ...typography.subtitle,
          color: colors.text.secondary,
          fontWeight: 700,
          transform: `scale(${followScale})`,
          opacity: lerp(frame, [16, 24], [0, 1]),
        }}
      >
        Follow for more ⚡
      </div>
    </AbsoluteFill>
  );
};
