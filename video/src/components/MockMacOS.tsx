import { useCurrentFrame } from "remotion";
import { colors, typography } from "@/theme";
import { lerp } from "@/utils/animation";

export interface MacContextMenuItem {
  label: string;
  icon?: string;
  hasSubmenu?: boolean;
  separator?: boolean;
}

const DEFAULT_MENU: MacContextMenuItem[] = [
  { label: "New Folder", icon: "folder" },
  { separator: true, label: "" },
  { label: "Get Info", icon: "info" },
  { label: "Change Wallpaper…" },
  { label: "Edit Widgets…" },
  { separator: true, label: "" },
  { label: "Use Stacks", icon: "grid" },
  { label: "Sort By", icon: "sort", hasSubmenu: true },
  { label: "Show View Options", icon: "gear" },
];

const DOCK_APPS = [
  { color: "#FFD66B", label: "📝" },
  { color: "#1B6FD8", label: "⚙️" },
  { color: "#0085FF", label: "A" },
  { color: "#26D366", label: "💬" },
  { color: "#34C759", label: "📹" },
  { color: "#FF453A", label: "🎬" },
  { color: "#0F0F0F", label: "✂︎" },
  { color: "#FF5C2B", label: "✦" },
  { color: "#1FB8E0", label: "Δ" },
  { color: "#1B5BFF", label: "VS" },
  { color: "#EA4335", label: "G" },
  { color: "#0E0E11", label: "C" },
  { color: "#3DA6FF", label: "Cr" },
  { color: "#0F0F12", label: "▌" },
  { color: "#A1A1A1", label: "🗑" },
];

/**
 * Pixel-tuned macOS desktop mockup, including dock and an optional
 * right-click context menu. Used for the "right click → New Folder" beat.
 */
export const MockMacOS: React.FC<{
  showContextMenu?: boolean;
  contextMenuAt?: { x: number; y: number };
  contextMenuStartFrame?: number;
  highlightedItemIndex?: number | null;
}> = ({
  showContextMenu = false,
  contextMenuAt = { x: 540, y: 900 },
  contextMenuStartFrame = 0,
  highlightedItemIndex = null,
}) => {
  const frame = useCurrentFrame();
  const menuOpacity = showContextMenu
    ? lerp(frame, [contextMenuStartFrame, contextMenuStartFrame + 6], [0, 1])
    : 0;
  const menuScale = showContextMenu
    ? lerp(frame, [contextMenuStartFrame, contextMenuStartFrame + 8], [0.92, 1])
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 80% 50% at 50% 35%, #2C3144 0%, #16181F 60%, #0B0C12 100%)",
        overflow: "hidden",
      }}
    >
      {/* macOS Sequoia-ish wallpaper waves */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3A4860" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1A1F2C" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFD93D" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#6BCB77" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4D96FF" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M -200 800 Q 540 1100 1280 600 L 1280 0 L -200 0 Z"
          fill="url(#wave1)"
          opacity="0.7"
        />
        <path
          d="M -200 1300 Q 540 1500 1280 1100 L 1280 1920 L -200 1920 Z"
          fill="url(#wave1)"
          opacity="0.5"
        />
        <path
          d="M -200 700 Q 540 950 1280 480"
          fill="none"
          stroke="url(#rainbow)"
          strokeWidth="3"
          opacity="0.6"
        />
      </svg>

      {/* Menu bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "rgba(10, 10, 14, 0.4)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 24,
          fontFamily: typography.body.fontFamily,
          fontSize: 24,
          color: "#FFFFFF",
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 28 }}>􀣺</span>
        <span>Finder</span>
        <span style={{ opacity: 0.7 }}>File</span>
        <span style={{ opacity: 0.7 }}>Edit</span>
        <span style={{ opacity: 0.7 }}>View</span>
        <span style={{ opacity: 0.7 }}>Go</span>
        <span style={{ flex: 1 }} />
        <span style={{ opacity: 0.7 }}>1:01</span>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div
          style={{
            position: "absolute",
            left: contextMenuAt.x,
            top: contextMenuAt.y,
            width: 320,
            background: colors.ui.macosBlur,
            backdropFilter: "blur(40px)",
            borderRadius: 14,
            border: "0.5px solid rgba(255,255,255,0.18)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
            padding: 6,
            transformOrigin: "top left",
            transform: `scale(${menuScale})`,
            opacity: menuOpacity,
            color: "#FFFFFF",
            fontFamily: typography.body.fontFamily,
            fontSize: 26,
          }}
        >
          {DEFAULT_MENU.map((item, i) =>
            item.separator ? (
              <div
                key={i}
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.14)",
                  margin: "6px 8px",
                }}
              />
            ) : (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background:
                    highlightedItemIndex === i
                      ? "rgba(0, 122, 255, 0.85)"
                      : "transparent",
                }}
              >
                {item.icon && (
                  <span style={{ width: 24, opacity: 0.85 }}>
                    {iconFor(item.icon)}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasSubmenu && <span style={{ opacity: 0.6 }}>›</span>}
              </div>
            ),
          )}
        </div>
      )}

      {/* Dock */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 28,
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          padding: "10px 18px",
          background: colors.ui.macosDock,
          backdropFilter: "blur(40px)",
          borderRadius: 22,
          border: "0.5px solid rgba(255,255,255,0.22)",
        }}
      >
        {DOCK_APPS.map((app, i) => (
          <div
            key={i}
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: app.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 800,
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
          >
            {app.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const iconFor = (id: string): string => {
  switch (id) {
    case "folder":
      return "📁";
    case "info":
      return "ⓘ";
    case "grid":
      return "▦";
    case "sort":
      return "↕";
    case "gear":
      return "⚙";
    default:
      return "•";
  }
};
