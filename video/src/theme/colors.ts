/**
 * Color tokens matching the warm-amber reel aesthetic.
 * All values are hand-tuned to pop on Instagram/TikTok feeds.
 */
export const colors = {
  bg: {
    top: "#FFE7B0",
    mid: "#FFC066",
    bottom: "#F08A2A",
    glow: "#FFF4D4",
  },
  ring: {
    primary: "rgba(255, 248, 220, 0.95)",
    secondary: "rgba(255, 235, 180, 0.55)",
    blur: "rgba(255, 220, 150, 0.35)",
  },
  caption: {
    bg: "#F26B1A",
    bgAlt: "#E03E1A",
    text: "#FFFFFF",
    shadow: "rgba(120, 40, 0, 0.25)",
  },
  text: {
    primary: "#2A1604",
    secondary: "#5A3210",
    muted: "rgba(42, 22, 4, 0.6)",
    onDark: "#FFFFFF",
  },
  illustration: {
    monitor: "#E5B4FF",
    monitorGlow: "#F5DCFF",
    desk: "#3DA9FC",
    chair: "#1B1B1F",
    accent: "#FF4F8B",
    pcCase: "#15151A",
    pcGlow: "#B57EFF",
  },
  ui: {
    macosDock: "rgba(255, 255, 255, 0.18)",
    macosBlur: "rgba(40, 40, 50, 0.78)",
    cursor: "#FFFFFF",
    cursorShadow: "rgba(0, 0, 0, 0.45)",
    chrome: "#F1F3F4",
  },
} as const;

export type ColorToken = typeof colors;
