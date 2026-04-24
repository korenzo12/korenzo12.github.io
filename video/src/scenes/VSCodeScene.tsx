import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockBrowser } from "@/components/MockBrowser";
import { MockVSCodeWebsite } from "@/components/MockVSCodeWebsite";
import { AnimatedCursor, CursorWaypoint } from "@/components/AnimatedCursor";
import { lerp } from "@/utils/animation";

/**
 * Scene 3: code.visualstudio.com page with the "Download for macOS" CTA.
 * Cursor approaches the download button and clicks.
 */
export const VSCodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = lerp(frame, [0, 18], [140, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);
  const scrollY = lerp(frame, [60, 150], [0, 380]);

  const cursorPath: CursorWaypoint[] = [
    { at: 8, x: 880, y: 200 },
    { at: 50, x: 540, y: 980, control: { x: 720, y: 480 } },
    { at: 100, x: 540, y: 1180, click: true },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 180,
          left: "50%",
          transform: `translate(-50%, ${slideIn}px)`,
          opacity,
        }}
      >
        <MockBrowser url="code.visualstudio.com" width={1020} height={1560}>
          <MockVSCodeWebsite scrollY={scrollY} />
        </MockBrowser>
      </div>

      <AnimatedCursor path={cursorPath} showFrom={6} />
    </AbsoluteFill>
  );
};
