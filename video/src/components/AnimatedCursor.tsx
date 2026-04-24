import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, easings } from "@/theme";
import { lerp, bezierPoint } from "@/utils/animation";

export interface CursorWaypoint {
  /** Frame at which the cursor arrives at this point */
  at: number;
  x: number;
  y: number;
  /** Optional control point for the bezier segment leading INTO this waypoint */
  control?: { x: number; y: number };
  /** If true, render a click ripple at this waypoint */
  click?: boolean;
}

/**
 * macOS-style arrow cursor that moves along a bezier path defined by waypoints.
 * Each segment between waypoints is eased like a human hand.
 * Click ripples are drawn automatically when waypoint.click is true.
 */
export const AnimatedCursor: React.FC<{
  path: CursorWaypoint[];
  /** Frame to fade in cursor */
  showFrom?: number;
  /** Frame to fade out cursor */
  hideAfter?: number;
  scale?: number;
}> = ({ path, showFrom = 0, hideAfter, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeOut = hideAfter ?? durationInFrames;

  if (path.length === 0) return null;

  // Determine current segment
  let position: { x: number; y: number };
  if (frame <= path[0]!.at) {
    position = { x: path[0]!.x, y: path[0]!.y };
  } else if (frame >= path[path.length - 1]!.at) {
    const last = path[path.length - 1]!;
    position = { x: last.x, y: last.y };
  } else {
    let segIndex = 0;
    for (let i = 0; i < path.length - 1; i++) {
      if (frame >= path[i]!.at && frame < path[i + 1]!.at) {
        segIndex = i;
        break;
      }
    }
    const a = path[segIndex]!;
    const b = path[segIndex + 1]!;
    const t = lerp(frame, [a.at, b.at], [0, 1], { easing: easings.hand });
    if (b.control) {
      const [px, py] = bezierPoint(
        [a.x, a.y],
        [b.control.x, b.control.y],
        [b.x, b.y],
        t,
      );
      position = { x: px, y: py };
    } else {
      position = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
      };
    }
  }

  const opacity =
    lerp(frame, [showFrom, showFrom + 6], [0, 1]) *
    lerp(frame, [fadeOut - 8, fadeOut], [1, 0]);

  // Click pulse - press scale on the cursor itself
  const clickWaypoint = path.find(
    (w) => w.click && Math.abs(frame - w.at) < 4,
  );
  const clickPulse = clickWaypoint
    ? 1 - 0.15 * Math.exp(-Math.pow(frame - clickWaypoint.at, 2) / 4)
    : 1;

  return (
    <>
      {/* Click ripples */}
      {path
        .filter((w) => w.click)
        .map((w, i) => {
          if (frame < w.at || frame > w.at + 24) return null;
          const r = lerp(frame, [w.at, w.at + 22], [0, 90]);
          const op = lerp(frame, [w.at, w.at + 6, w.at + 22], [0.7, 0.5, 0]);
          return (
            <svg
              key={i}
              width={240}
              height={240}
              style={{
                position: "absolute",
                left: w.x - 120,
                top: w.y - 120,
                pointerEvents: "none",
              }}
            >
              <circle
                cx={120}
                cy={120}
                r={r}
                fill="none"
                stroke={colors.ui.cursor}
                strokeWidth={4}
                opacity={op}
              />
            </svg>
          );
        })}
      {/* Cursor */}
      <svg
        width={48}
        height={56}
        viewBox="0 0 48 56"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: `scale(${scale * clickPulse})`,
          transformOrigin: "0 0",
          filter: `drop-shadow(0 4px 8px ${colors.ui.cursorShadow})`,
          opacity,
          pointerEvents: "none",
        }}
      >
        <path
          d="M2 2 L2 38 L11 30 L17 44 L22 42 L16 28 L28 28 Z"
          fill={colors.ui.cursor}
          stroke="#1A1A1F"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
