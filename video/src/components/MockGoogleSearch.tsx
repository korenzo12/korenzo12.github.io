import { typography } from "@/theme";

interface SearchResult {
  domain: string;
  url: string;
  title: string;
  snippet: string;
  sublinks?: { label: string; description: string }[];
}

const RESULTS: SearchResult[] = [
  {
    domain: "code.visualstudio.com",
    url: "https://code.visualstudio.com",
    title: "Visual Studio Code - The open source AI code editor | Your...",
    snippet:
      "Visual Studio Code redefines AI-powered coding with GitHub Copilot for building and debugging modern web and cloud applications. Visual Studio Code is free…",
    sublinks: [
      { label: "Download", description: "Visual Studio Code is free and available on your favorite…" },
      { label: "Install VS Code on Windows", description: "Install VS Code on Windows. Use the Windows installer. Once it is…" },
      { label: "Install VS Code on macOS", description: "Add VS Code to your Dock by right-clicking on the icon, located in…" },
      { label: "VS Code for the Web", description: "Visual Studio Code for the Web provides a free, zero-install…" },
      { label: "Installing VS Code on Linux", description: "The easiest way to install Visual Studio Code for Debian/Ubuntu…" },
    ],
  },
  {
    domain: "vscode.dev",
    url: "https://vscode.dev",
    title: "VS Code",
    snippet: "",
  },
];

/**
 * Faithful clone of a Google SERP for the query "vs code".
 * Used so the demo never breaks when Google's HTML changes.
 */
export const MockGoogleSearch: React.FC<{
  query?: string;
  scrollY?: number;
}> = ({ query = "vs code", scrollY = 0 }) => {
  return (
    <div
      style={{
        background: "#FFFFFF",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `translateY(${-scrollY}px)`,
          padding: "20px 28px 80px",
          fontFamily: typography.body.fontFamily,
        }}
      >
        {/* Top bar with logo + search box */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
          <span
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
          </span>
          <div
            style={{
              flex: 1,
              height: 56,
              border: "1px solid #DADCE0",
              borderRadius: 28,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontSize: 22,
              color: "#202124",
            }}
          >
            {query}
          </div>
        </div>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 28,
            borderBottom: "1px solid #EBEBEB",
            marginBottom: 24,
            fontSize: 20,
            color: "#5F6368",
          }}
        >
          {["AI Mode", "All", "Videos", "Images", "Forums", "Shopping", "News", "More ▾"].map(
            (t, i) => (
              <div
                key={t}
                style={{
                  padding: "12px 4px",
                  borderBottom: i === 1 ? "3px solid #1A73E8" : "3px solid transparent",
                  color: i === 1 ? "#1A73E8" : "#5F6368",
                  fontWeight: i === 1 ? 600 : 400,
                }}
              >
                {t}
              </div>
            ),
          )}
        </div>
        {/* Results */}
        {RESULTS.map((r, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  background: i === 0 ? "#0078D4" : "#1A73E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {i === 0 ? "</>" : "🌐"}
              </div>
              <div>
                <div style={{ fontSize: 18, color: "#202124", fontWeight: 500 }}>
                  {r.domain}
                </div>
                <div style={{ fontSize: 14, color: "#5F6368" }}>{r.url}</div>
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                color: i === 0 ? "#1558D6" : "#1558D6",
                fontWeight: 400,
                textDecoration: "underline",
                textDecorationColor: "rgba(21, 88, 214, 0.4)",
                marginBottom: 6,
              }}
            >
              {r.title}
            </div>
            {r.snippet && (
              <div style={{ fontSize: 18, color: "#4D5156", lineHeight: 1.5, marginBottom: 12 }}>
                {r.snippet}
              </div>
            )}
            {r.sublinks && (
              <div style={{ borderTop: "1px solid #F1F3F4", paddingTop: 8 }}>
                {r.sublinks.map((s, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #F1F3F4",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        color: "#1558D6",
                        marginBottom: 4,
                        fontWeight: 500,
                      }}
                    >
                      {s.label}
                    </div>
                    <div style={{ fontSize: 16, color: "#4D5156" }}>{s.description}</div>
                  </div>
                ))}
                <div
                  style={{
                    padding: "10px 0",
                    fontSize: 16,
                    color: "#1558D6",
                  }}
                >
                  More results from visualstudio.com »
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
