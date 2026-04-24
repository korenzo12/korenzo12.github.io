import { ReactNode } from "react";
import { typography } from "@/theme";

/**
 * Pixel-tuned Chrome-on-macOS browser chrome wrapper.
 * Renders any children inside the viewport area.
 */
export const MockBrowser: React.FC<{
  url?: string;
  children: ReactNode;
  width?: number;
  height?: number;
}> = ({ url = "google.com", children, width = 1080, height = 1500 }) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 40,
          background: "#E8EAED",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
          borderBottom: "1px solid #DADCE0",
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#FF5F56",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#FFBD2E",
          }}
        />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            background: "#27C93F",
          }}
        />
      </div>
      {/* URL bar */}
      <div
        style={{
          height: 56,
          background: "#F1F3F4",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderBottom: "1px solid #DADCE0",
        }}
      >
        <div style={{ display: "flex", gap: 8, opacity: 0.6 }}>
          <span style={{ fontSize: 22, color: "#5F6368" }}>‹</span>
          <span style={{ fontSize: 22, color: "#5F6368" }}>›</span>
          <span style={{ fontSize: 18, color: "#5F6368" }}>↻</span>
        </div>
        <div
          style={{
            flex: 1,
            height: 36,
            background: "#FFFFFF",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            fontFamily: typography.body.fontFamily,
            fontSize: 18,
            color: "#202124",
            border: "1px solid #DADCE0",
          }}
        >
          <span style={{ marginRight: 8, color: "#5F6368" }}>🔒</span>
          {url}
        </div>
      </div>
      {/* Page content */}
      <div style={{ flex: 1, overflow: "hidden", background: "#FFFFFF" }}>
        {children}
      </div>
    </div>
  );
};
