import { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        padding: "16px 20px 18px",
        background: "transparent",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 12,
          background: "var(--input-bg)",
          border: `1px solid ${isFocused ? "var(--border-strong)" : "var(--border)"}`,
          borderRadius: 22,
          padding: "10px 10px 10px 16px",
          transition: "all 0.2s ease",
          boxShadow: isFocused
            ? "0 0 0 4px rgba(124, 58, 237, 0.10), var(--shadow-sm)"
            : "var(--shadow-sm)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask anything"
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "Sora, sans-serif",
            lineHeight: 1.6,
            resize: "none",
            maxHeight: 180,
            overflowY: "auto",
            padding: "6px 0",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />

        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Send message (Enter)"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: canSend
              ? "1px solid rgba(124, 58, 237, 0.28)"
              : "1px solid var(--border)",
            flexShrink: 0,
            background: canSend
              ? "linear-gradient(135deg, var(--brand-light), var(--brand))"
              : "var(--bg-tertiary)",
            cursor: canSend ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: canSend ? "#ffffff" : "var(--text-muted)",
            boxShadow: canSend
              ? "0 10px 24px rgba(124, 58, 237, 0.28)"
              : "none",
            transition: "all 0.2s ease",
            transform: canSend ? "translateY(0)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!canSend) return;
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 14px 28px rgba(124, 58, 237, 0.34)";
          }}
          onMouseLeave={(e) => {
            if (!canSend) return;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 10px 24px rgba(124, 58, 237, 0.28)";
          }}
        >
          {disabled ? <Spinner /> : <SendIcon />}
        </button>
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--text-muted)",
          marginTop: 10,
        }}
      >
        Press{" "}
        <kbd
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "2px 6px",
            fontSize: 10,
            color: "var(--text-secondary)",
          }}
        >
          Enter
        </kbd>{" "}
        to send &nbsp;·&nbsp;
        <kbd
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "2px 6px",
            fontSize: 10,
            color: "var(--text-secondary)",
          }}
        >
          Shift+Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
};

const SendIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Spinner = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="2.5"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
