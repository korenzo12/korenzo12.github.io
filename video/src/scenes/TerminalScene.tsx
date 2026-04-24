import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockTerminal } from "@/components/MockTerminal";
import { lerp, popSpring } from "@/utils/animation";
import type { TerminalScene as TerminalSceneProps } from "@/types/plan";

export const TerminalSceneRenderer: React.FC<{ scene: TerminalSceneProps }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, 0, { damping: 16, stiffness: 110, mass: 0.8 });
  const slideY = lerp(frame, [0, 22], [120, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);

  const lines = scene.lines.map((line) => ({
    at: Math.round(line.at * fps),
    duration: Math.round(line.typeFor * fps),
    text: line.text,
    prompt: line.prompt,
    color: line.color,
  }));

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 240,
          left: "50%",
          transform: `translate(-50%, ${slideY}px) scale(${enter})`,
          opacity,
          transformOrigin: "center top",
        }}
      >
        <MockTerminal
          width={980}
          height={900}
          user={scene.user}
          host={scene.host}
          lines={lines}
        />
      </div>
    </AbsoluteFill>
  );
};
