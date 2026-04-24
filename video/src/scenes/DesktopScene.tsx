import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { MockMacOS } from "@/components/MockMacOS";
import { AnimatedCursor, CursorWaypoint as CursorWaypointPx } from "@/components/AnimatedCursor";
import { lerp } from "@/utils/animation";
import type { DesktopScene as DesktopSceneProps } from "@/types/plan";

export const DesktopSceneRenderer: React.FC<{ scene: DesktopSceneProps }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = lerp(frame, [0, 18], [180, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);

  const menuStartFrame = scene.contextMenu
    ? Math.round(scene.contextMenu.openAt * fps)
    : 0;
  const showMenu = !!scene.contextMenu && frame >= menuStartFrame - 2;
  const highlightFrame =
    scene.contextMenu?.highlightAt !== undefined
      ? Math.round(scene.contextMenu.highlightAt * fps)
      : null;

  const cursorPath: CursorWaypointPx[] = scene.cursorPath.map((w) => ({
    at: Math.round(w.at * fps),
    x: w.x,
    y: w.y,
    control: w.control,
    click: w.click,
  }));

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
          contextMenuAt={scene.contextMenu?.at}
          contextMenuStartFrame={menuStartFrame}
          highlightedItemIndex={
            highlightFrame !== null && frame >= highlightFrame
              ? scene.contextMenu?.highlightIndex ?? null
              : null
          }
        />
      </div>
      {cursorPath.length > 0 && <AnimatedCursor path={cursorPath} showFrom={2} />}
    </AbsoluteFill>
  );
};
