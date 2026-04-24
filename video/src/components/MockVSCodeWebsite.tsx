import { typography } from "@/theme";

/**
 * Stylised replica of code.visualstudio.com hero section -
 * binary background, hero text, "Download for macOS" button.
 */
export const MockVSCodeWebsite: React.FC<{
  scrollY?: number;
}> = ({ scrollY = 0 }) => {
  // Pseudo-binary background to mimic the marketing hero
  const binaryRows = Array.from({ length: 24 }, (_, r) =>
    Array.from({ length: 60 }, (_, c) => ((r * 31 + c * 17) % 7 < 4 ? "1" : "0")).join(" "),
  );

  return (
    <div
      style={{
        background: "#FFFFFF",
        height: "100%",
        overflow: "hidden",
        fontFamily: typography.body.fontFamily,
      }}
    >
      <div style={{ transform: `translateY(${-scrollY}px)` }}>
        {/* Top nav */}
        <div
          style={{
            display: "flex",
            gap: 28,
            padding: "16px 32px",
            borderBottom: "1px solid #E5E5E5",
            fontSize: 20,
            color: "#3C3C3C",
            background: "#FFFFFF",
          }}
        >
          {["Docs", "Updates", "Blog", "API", "Extensions", "MCP", "FAQ", "Learn", "Events"].map(
            (t) => (
              <span key={t}>{t}</span>
            ),
          )}
        </div>
        {/* Banner */}
        <div
          style={{
            background: "#F8F9FB",
            padding: "16px 28px",
            fontSize: 20,
            color: "#1F1F1F",
            textAlign: "center",
          }}
        >
          Explore Agentic Development -{" "}
          <span style={{ color: "#0078D4" }}>Join a GitHub Copilot Dev Day near you!</span>
        </div>
        {/* Hero with binary background */}
        <div
          style={{
            position: "relative",
            padding: "48px 28px 80px",
            overflow: "hidden",
            background: "#FFFFFF",
          }}
        >
          <pre
            style={{
              position: "absolute",
              inset: 0,
              fontFamily: typography.code.fontFamily,
              fontSize: 18,
              color: "rgba(0,0,0,0.18)",
              lineHeight: 1.4,
              padding: "16px 0",
              whiteSpace: "pre",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {binaryRows.join("\n")}
          </pre>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontSize: 78,
                fontWeight: 700,
                color: "#000000",
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              The open source AI code editor
            </h1>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: "#1F1F1F",
                margin: "24px 0 32px",
              }}
            >
              Your home for multi-agent development
            </h2>
            <button
              style={{
                background: "#000000",
                color: "#FFFFFF",
                padding: "20px 36px",
                borderRadius: 32,
                border: "none",
                fontSize: 24,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 28 }}></span>
              Download for macOS
            </button>
            <div style={{ marginTop: 20, fontSize: 18, color: "#5F6368" }}>
              Web, <span style={{ color: "#1A73E8", textDecoration: "underline" }}>Insiders edition</span>, or{" "}
              <span style={{ color: "#1A73E8", textDecoration: "underline" }}>other platforms</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 16, color: "#5F6368" }}>
              By using VS Code, you agree to its{" "}
              <span style={{ color: "#1A73E8", textDecoration: "underline" }}>license</span> and{" "}
              <span style={{ color: "#1A73E8", textDecoration: "underline" }}>privacy statement</span>
              .
            </div>
          </div>
        </div>
        {/* Decorative editor stripe */}
        <div style={{ height: 80, background: "#0078D4" }} />
        <div
          style={{
            background: "#1E1E1E",
            color: "#D4D4D4",
            fontFamily: typography.code.fontFamily,
            fontSize: 22,
            padding: "20px 24px",
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: "#569CD6" }}>
            import {"{"} For, createSignal, createMemo {"}"} from "solid-js";
          </div>
          <div style={{ color: "#569CD6" }}>
            import {"{"} useNavigate, useParams {"}"} from "@solidjs/router";
          </div>
          <div style={{ color: "#569CD6" }}>
            import {"{"} getEmailsForMailbox {"}"} from "~/api";
          </div>
          <div style={{ color: "#569CD6" }}>
            import {"{"} MailListItem {"}"} from "~/components";
          </div>
          <div style={{ height: 8 }} />
          <div>
            <span style={{ color: "#C586C0" }}>export function</span>{" "}
            <span style={{ color: "#DCDCAA" }}>MailList</span>() {"{"}
          </div>
          <div style={{ paddingLeft: 32 }}>
            <span style={{ color: "#569CD6" }}>const</span> params ={" "}
            <span style={{ color: "#DCDCAA" }}>useParams</span>();
          </div>
          <div style={{ paddingLeft: 32 }}>
            <span style={{ color: "#569CD6" }}>const</span> [query, setQuery] ={" "}
            <span style={{ color: "#DCDCAA" }}>createSignal</span>("");
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  );
};
