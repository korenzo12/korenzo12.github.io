import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { typography } from "@/theme";
import { lerp, popSpring } from "@/utils/animation";
import type { CodeScene as CodeSceneProps } from "@/types/plan";

const TOKEN_COLORS: Record<string, string> = {
  keyword: "#C586C0",
  string: "#CE9178",
  comment: "#6A9955",
  func: "#DCDCAA",
  var: "#9CDCFE",
  type: "#4EC9B0",
};

const tokenize = (line: string): { color: string; text: string }[] => {
  // Very lightweight syntax highlighting (no full parser).
  const parts: { color: string; text: string }[] = [];
  const re =
    /(\b(?:import|export|const|let|var|function|return|if|else|for|while|class|new|async|await|from|true|false|null|undefined)\b)|(["'`][^"'`]*["'`])|(\/\/.*$)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-z_][A-Za-z0-9_]*\s*(?=\())|(\b[a-z_][A-Za-z0-9_]*\b)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) parts.push({ color: TOKEN_COLORS.keyword!, text: m[1] });
    else if (m[2]) parts.push({ color: TOKEN_COLORS.string!, text: m[2] });
    else if (m[3]) parts.push({ color: TOKEN_COLORS.comment!, text: m[3] });
    else if (m[4]) parts.push({ color: TOKEN_COLORS.type!, text: m[4] });
    else if (m[5]) parts.push({ color: TOKEN_COLORS.func!, text: m[5] });
    else if (m[6]) parts.push({ color: TOKEN_COLORS.var!, text: m[6] });
    else parts.push({ color: "#D4D4D4", text: m[0] });
  }
  return parts;
};

export const CodeSceneRenderer: React.FC<{ scene: CodeSceneProps }> = ({
  scene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = popSpring(frame, fps, 0, { damping: 16, stiffness: 110, mass: 0.8 });
  const slideY = lerp(frame, [0, 22], [120, 0]);
  const opacity = lerp(frame, [0, 14], [0, 1]);

  const lines = scene.code.split("\n");
  const highlightLine =
    scene.highlights.find(
      (h) => frame >= Math.round(h.at * fps) && frame < Math.round((h.at + 1.5) * fps),
    )?.line ?? null;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 280,
          left: "50%",
          width: 980,
          transform: `translate(-50%, ${slideY}px) scale(${enter})`,
          opacity,
          background: "#1B1F23",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            background: "#2A2F35",
            padding: "10px 18px",
            borderBottom: "1px solid #14171A",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#9DA5B0",
            fontFamily: typography.code.fontFamily,
            fontSize: 18,
          }}
        >
          {scene.filename}
        </div>
        <div
          style={{
            padding: "20px 0",
            fontFamily: typography.code.fontFamily,
            fontSize: 26,
            lineHeight: 1.6,
          }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                padding: "0 24px",
                background:
                  highlightLine === i + 1 ? "rgba(255, 200, 80, 0.12)" : "transparent",
                borderLeft:
                  highlightLine === i + 1 ? "4px solid #FFC850" : "4px solid transparent",
              }}
            >
              <span style={{ color: "#5A6270", width: 32, textAlign: "right" }}>
                {i + 1}
              </span>
              <span>
                {tokenize(line).map((tok, j) => (
                  <span key={j} style={{ color: tok.color }}>
                    {tok.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
