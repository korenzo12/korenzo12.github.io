import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockBrowser } from "@/components/MockBrowser";
import { MockGoogleSearch } from "@/components/MockGoogleSearch";
import { AnimatedCursor, CursorWaypoint } from "@/components/AnimatedCursor";
import { lerp } from "@/utils/animation";

/**
 * Scene 2: Google search results for "vs code".
 * Cursor moves from URL bar, hovers over the first result, clicks.
 */
export const GoogleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = lerp(frame, [0, 16], [120, 0]);
  const opacity = lerp(frame, [0, 12], [0, 1]);
  const scrollY = lerp(frame, [50, 90], [0, 80]);

  const cursorPath: CursorWaypoint[] = [
    { at: 6, x: 880, y: 220 },
    { at: 36, x: 540, y: 690, control: { x: 700, y: 360 } },
    { at: 72, x: 460, y: 760, click: true },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 200,
          left: "50%",
          transform: `translate(-50%, ${slideIn}px)`,
          opacity,
        }}
      >
        <MockBrowser url="google.com/search?q=vs+code" width={1020} height={1500}>
          <MockGoogleSearch query="vs code" scrollY={scrollY} />
        </MockBrowser>
      </div>

      <AnimatedCursor path={cursorPath} showFrom={4} />
    </AbsoluteFill>
  );
};
