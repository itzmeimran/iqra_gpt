import { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { useModelsStore } from "../store/modelsStore";

interface Props {
  onMobileMenuOpen: () => void;
}

export const Header = ({ onMobileMenuOpen }: Props) => {
  const activeSession = useChatStore((state) => state.getActiveSession());
  const messages = useChatStore((state) => state.messages);
  const { selectedModel, fetchModels } = useModelsStore();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    void fetchModels();
  }, [fetchModels]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = theme === "dark" ? "light" : "dark";

    root.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 12,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-primary)",
        flexShrink: 0,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onMobileMenuOpen}
          className="md-hide"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
          id="mobile-menu-btn"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {activeSession?.title ?? "Select a chat"}
          </h2>

          {activeSession && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = "var(--hover-bg)";
            event.currentTarget.style.color = "var(--text-primary)";
            event.currentTarget.style.borderColor = "var(--border-strong)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = "var(--bg-secondary)";
            event.currentTarget.style.color = "var(--text-secondary)";
            event.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            borderRadius: 20,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--brand)",
              boxShadow: "0 0 10px var(--brand)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {selectedModel || activeSession?.model || "Model"}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};

const SunIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" />
  </svg>
);

const MoonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
  </svg>
);
