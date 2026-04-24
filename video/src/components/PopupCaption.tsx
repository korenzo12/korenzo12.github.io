import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, typography } from "@/theme";
import { popSpring, lerp } from "@/utils/animation";

interface PopupCaptionProps {
  text: string;
  x: number;
  y: number;
  /** Frame the bubble appears */
  startAt: number;
  /** Frames the bubble stays on screen (excl. enter/exit) */
  hold?: number;
  /** Visual variant */
  variant?: "primary" | "secondary";
  /** Slight rotation (deg) for hand-placed feel */
  rotation?: number;
  /** Scale multiplier */
  scale?: number;
}

/**
 * The signature "word bubble" overlay — orange rounded rectangle
 * with white bold text, pops in with a spring and out with a fade.
 */
export const PopupCaption: React.FC<PopupCaptionProps> = ({
  text,
  x,
  y,
  startAt,
  hold = 30,
  variant = "primary",
  rotation = 0,
  scale: scaleProp = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = popSpring(frame, fps, startAt);
  const exitStart = startAt + hold;
  const exit = lerp(frame, [exitStart, exitStart + 8], [1, 0]);
  const opacity = lerp(frame, [startAt, startAt + 4], [0, 1]) * exit;
  const scale = enter * exit * scaleProp;

  if (frame < startAt - 2 || frame > exitStart + 12) return null;

  const bg = variant === "primary" ? colors.caption.bg : colors.caption.bgAlt;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        opacity,
        padding: "16px 36px",
        background: bg,
        borderRadius: 18,
        boxShadow: `0 14px 32px ${colors.caption.shadow}, 0 4px 0 rgba(0,0,0,0.12)`,
        whiteSpace: "nowrap",
        ...typography.caption,
        color: colors.caption.text,
        textShadow: "0 2px 0 rgba(0,0,0,0.18)",
      }}
    >
      {text}
    </div>
  );
};
