import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockMacOS } from "@/components/MockMacOS";
import { AnimatedCursor, CursorWaypoint } from "@/components/AnimatedCursor";
import { lerp } from "@/utils/animation";

/**
 * Scene 4: macOS desktop. Cursor right-clicks, context menu appears,
 * cursor highlights "New Folder".
 */
export const DesktopScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = lerp(frame, [0, 18], [180, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);

  const menuStartFrame = 30;
  const showMenu = frame >= menuStartFrame - 2;

  const cursorPath: CursorWaypoint[] = [
    { at: 4, x: 720, y: 1100 },
    { at: 26, x: 510, y: 1210, control: { x: 600, y: 1180 }, click: true },
    { at: 60, x: 540, y: 1230 },
    { at: 84, x: 590, y: 1280, click: true },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${slideIn}px)`,
          opacity,
        }}
      >
        <MockMacOS
          showContextMenu={showMenu}
          contextMenuAt={{ x: 510, y: 1210 }}
          contextMenuStartFrame={menuStartFrame}
          highlightedItemIndex={frame >= 76 ? 0 : null}
        />
      </div>

      <AnimatedCursor path={cursorPath} showFrom={2} />
    </AbsoluteFill>
  );
};
