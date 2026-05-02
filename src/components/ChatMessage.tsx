import { useRef } from "react";
import type { Message } from "../types";
import { useAuthStore } from "../store/authStore";

interface Props {
  message: Message;
}

export const ChatMessage = ({ message }: Props) => {
  const user = useAuthStore((s) => s.user);
  const isUser = message.role === "user";
  const dotRef = useRef<HTMLSpanElement>(null);

  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        animation: "fadeUp 0.3s ease forwards",
        padding: "6px 0",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          boxShadow: "var(--shadow-sm)",
          ...(isUser
            ? {
                background:
                  "linear-gradient(135deg, var(--brand-light), var(--brand), var(--brand-dark))",
                color: "#ffffff",
              }
            : {
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                color: "var(--brand)",
              }),
        }}
      >
        {isUser ? (user?.name?.[0]?.toUpperCase() ?? "U") : <AiIcon />}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "72%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
          gap: 6,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderRadius: isUser ? "20px 6px 20px 20px" : "6px 20px 20px 20px",
            fontSize: 14,
            lineHeight: 1.7,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            ...(isUser
              ? {
                  background:
                    "linear-gradient(135deg, rgba(167,139,250,0.22), rgba(124,58,237,0.18))",
                  border: "1px solid rgba(124, 58, 237, 0.28)",
                  color: "var(--text-primary)",
                  boxShadow: "0 10px 24px rgba(124, 58, 237, 0.14)",
                }
              : {
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-sm)",
                }),
          }}
        >
          {message.isStreaming && message.content === "" ? (
            <TypingIndicator />
          ) : (
            <>
              <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {message.content}
              </span>
              {message.isStreaming && (
                <span
                  ref={dotRef}
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 14,
                    background: "currentColor",
                    borderRadius: 1,
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              )}
            </>
          )}
        </div>

        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            paddingLeft: 6,
            paddingRight: 6,
          }}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
};

const AiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
    <path
      d="M12 5.2l1.45 3.35 3.35 1.45-3.35 1.45L12 14.8l-1.45-3.35L7.2 10l3.35-1.45L12 5.2Z"
      fill="currentColor"
    />
    <path
      d="M17.4 15.8l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

const TypingIndicator = () => (
  <div
    style={{ display: "flex", gap: 5, alignItems: "center", padding: "2px 0" }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--brand-light)",
          animation: "pulseDot 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.16}s`,
          display: "inline-block",
          boxShadow: "0 0 10px rgba(124, 58, 237, 0.18)",
        }}
      />
    ))}
    <style>{`
      @keyframes pulseDot {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);
