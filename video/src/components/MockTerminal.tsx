import { useCurrentFrame } from "remotion";
import { typography } from "@/theme";
import { lerp } from "@/utils/animation";

interface TerminalLine {
  /** Frame at which this line begins typing */
  at: number;
  /** Frames to type the line over */
  duration: number;
  text: string;
  /** True for prompt lines, false for output */
  prompt?: boolean;
  /** Color override */
  color?: string;
}

const typewrite = (text: string, frame: number, start: number, duration: number) => {
  const progress = lerp(frame, [start, start + duration], [0, 1]);
  const visible = Math.floor(progress * text.length);
  return text.slice(0, visible);
};

export const MockTerminal: React.FC<{
  lines: TerminalLine[];
  user?: string;
  host?: string;
  width?: number;
  height?: number;
}> = ({ lines, user = "alex", host = "Mac", width = 980, height = 700 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        width,
        height,
        background: "#1B1F23",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
        fontFamily: typography.code.fontFamily,
        color: "#E6E6E6",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 36,
          background: "#2A2F35",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
          borderBottom: "1px solid #14171A",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F56" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FFBD2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#27C93F" }} />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            color: "#9DA5B0",
            letterSpacing: 0.3,
          }}
        >
          {user}@{host}: ~
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: 22, fontSize: 24, lineHeight: 1.55 }}>
        {lines.map((line, i) => {
          const visible = typewrite(line.text, frame, line.at, line.duration);
          if (!visible) return null;
          return (
            <div key={i} style={{ color: line.color ?? (line.prompt ? "#7EE787" : "#E6E6E6") }}>
              {line.prompt && (
                <span style={{ color: "#7EE787" }}>{user}@{host} ~ % </span>
              )}
              <span>{visible}</span>
              {frame >= line.at && frame < line.at + line.duration && (
                <span style={{ animation: "none", marginLeft: 2, color: "#7EE787" }}>▌</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
