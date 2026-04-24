import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockTerminal } from "@/components/MockTerminal";
import { lerp, popSpring } from "@/utils/animation";
import { typography, colors } from "@/theme";

/**
 * Scene 5: Terminal opens, runs `npm install -g @anthropic-ai/claude-code`,
 * then `claude` authenticates and shows ready prompt.
 */
export const TerminalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, 0, { damping: 16, stiffness: 110, mass: 0.8 });
  const slideY = lerp(frame, [0, 22], [120, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 220,
          left: "50%",
          transform: `translate(-50%, ${slideY}px) scale(${enter})`,
          opacity,
          transformOrigin: "center top",
        }}
      >
        <MockTerminal
          width={980}
          height={900}
          lines={[
            { at: 6, duration: 22, text: "npm install -g @anthropic-ai/claude-code", prompt: true },
            { at: 36, duration: 12, text: "added 1 package in 3s", color: "#9DA5B0" },
            { at: 56, duration: 14, text: "claude", prompt: true },
            { at: 78, duration: 10, text: "✓ Authenticated", color: "#7EE787" },
            { at: 92, duration: 18, text: "Welcome to Claude Code — start coding!", color: "#E6E6E6" },
          ]}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: lerp(frame, [70, 95], [0, 1]),
        }}
      >
        <div style={{ ...typography.subtitle, color: colors.text.primary, fontWeight: 700 }}>
          That's it. ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};
