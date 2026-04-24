import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MockBrowser } from "@/components/MockBrowser";
import { MockGoogleSearch } from "@/components/MockGoogleSearch";
import { MockVSCodeWebsite } from "@/components/MockVSCodeWebsite";
import { AnimatedCursor, CursorWaypoint as CursorWaypointPx } from "@/components/AnimatedCursor";
import { lerp } from "@/utils/animation";
import type { BrowserScene as BrowserSceneProps } from "@/types/plan";

const interpolateScroll = (
  frame: number,
  fps: number,
  scrollPoints: { at: number; y: number }[],
): number => {
  if (scrollPoints.length === 0) return 0;
  if (scrollPoints.length === 1) return scrollPoints[0]!.y;
  const seconds = frame / fps;
  for (let i = 0; i < scrollPoints.length - 1; i++) {
    const a = scrollPoints[i]!;
    const b = scrollPoints[i + 1]!;
    if (seconds <= b.at) {
      return lerp(seconds, [a.at, b.at], [a.y, b.y]);
    }
  }
  return scrollPoints[scrollPoints.length - 1]!.y;
};

export const BrowserSceneRenderer: React.FC<{ scene: BrowserSceneProps }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = lerp(frame, [0, 18], [140, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);
  const scrollY = interpolateScroll(frame, fps, scene.scroll);

  // Convert seconds-based cursor path to frames for the renderer
  const cursorPath: CursorWaypointPx[] = scene.cursorPath.map((w) => ({
    at: Math.round(w.at * fps),
    x: w.x,
    y: w.y,
    control: w.control,
    click: w.click,
  }));

  let inner: React.ReactNode = null;
  switch (scene.content.kind) {
    case "google":
      inner = <MockGoogleSearch query={scene.content.query} scrollY={scrollY} />;
      break;
    case "vscode":
      inner = <MockVSCodeWebsite scrollY={scrollY} />;
      break;
    case "recording":
      inner = (
        <OffthreadVideo
          src={staticFile(`/recordings/${scene.content.file}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
      break;
    case "custom":
      inner = (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: `translateY(${-scrollY}px)`,
          }}
          dangerouslySetInnerHTML={{ __html: scene.content.html }}
        />
      );
      break;
  }

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
        <MockBrowser url={scene.url} width={1020} height={1500}>
          {inner}
        </MockBrowser>
      </div>
      {cursorPath.length > 0 && <AnimatedCursor path={cursorPath} showFrom={4} />}
    </AbsoluteFill>
  );
};
