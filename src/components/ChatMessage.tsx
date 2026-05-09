import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useAuthStore } from "../store/authStore";
import type { ChatMessage as ChatMessageType } from "../store/chatStore";

interface Props {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: Props) => {
  const user = useAuthStore((state) => state.user);
  const isUser = message.role === "user";

  const timestamp = useMemo(() => {
    const parsed = new Date(message.createdAt);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [message.createdAt]);

  const bubbleStyle: CSSProperties = isUser
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
      };

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
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink   { 50% { opacity: 0; } }
        @keyframes pulseDot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40%           { transform: scale(1);   opacity: 1;   }
        }

        /* ── Markdown prose reset ─────────────────────────────────── */
        .md-prose { font-size: 14px; line-height: 1.75; color: var(--text-primary); }

        .md-prose p   { margin: 0 0 10px; }
        .md-prose p:last-child { margin-bottom: 0; }

        .md-prose h1, .md-prose h2, .md-prose h3,
        .md-prose h4, .md-prose h5, .md-prose h6 {
          font-weight: 700;
          line-height: 1.3;
          margin: 18px 0 8px;
          color: var(--text-primary);
        }
        .md-prose h1 { font-size: 20px; }
        .md-prose h2 { font-size: 18px; }
        .md-prose h3 { font-size: 16px; }
        .md-prose h4, .md-prose h5, .md-prose h6 { font-size: 14px; }

        /* Lists */
        .md-prose ul, .md-prose ol {
          margin: 8px 0 10px;
          padding-left: 22px;
        }
        .md-prose ul { list-style: disc; }
        .md-prose ol { list-style: decimal; }
        .md-prose li { margin: 4px 0; }
        .md-prose li > ul, .md-prose li > ol { margin: 4px 0; }

        /* Inline code */
        .md-prose :not(pre) > code {
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
          font-size: 13px;
          background: rgba(107, 78, 255, 0.10);
          border: 1px solid rgba(107, 78, 255, 0.20);
          color: #a78bfa;
          padding: 2px 6px;
          border-radius: 5px;
          white-space: nowrap;
        }

        /* Code blocks */
        .md-prose pre {
          margin: 12px 0;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #0d0d14 !important;
          position: relative;
        }
        .md-prose pre code {
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important;
          font-size: 13px !important;
          line-height: 1.65 !important;
          display: block;
          padding: 16px !important;
          background: transparent !important;
          border: none !important;
          color: #e2e8f0 !important;
          overflow-x: auto;
          white-space: pre;
        }

        /* Code block header (language label + copy btn) */
        .code-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          color: #6b7280;
        }
        .copy-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #9ca3af;
          border-radius: 5px;
          padding: 2px 8px;
          font-size: 11px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.15s;
        }
        .copy-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .copy-btn.copied { color: #34d399; border-color: rgba(52,211,153,0.3); }

        /* Blockquote */
        .md-prose blockquote {
          margin: 10px 0;
          padding: 10px 16px;
          border-left: 3px solid var(--brand);
          background: rgba(107, 78, 255, 0.06);
          border-radius: 0 8px 8px 0;
          color: var(--text-secondary);
          font-style: italic;
        }
        .md-prose blockquote p { margin: 0; }

        /* Table */
        .md-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 12px 0;
          font-size: 13px;
        }
        .md-prose th {
          background: rgba(107, 78, 255, 0.10);
          color: var(--text-primary);
          font-weight: 600;
          padding: 8px 12px;
          border: 1px solid var(--border);
          text-align: left;
        }
        .md-prose td {
          padding: 7px 12px;
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }
        .md-prose tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

        /* Horizontal rule */
        .md-prose hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 16px 0;
        }

        /* Links */
        .md-prose a {
          color: var(--brand-light);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .md-prose a:hover { color: var(--brand); }

        /* Strong / Em */
        .md-prose strong { font-weight: 700; color: var(--text-primary); }
        .md-prose em     { font-style: italic; color: var(--text-secondary); }
      `}</style>

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
          maxWidth: "78%",
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
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            ...bubbleStyle,
          }}
        >
          {message.isStreaming && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            /* User messages: plain text, no markdown */
            <span
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {message.content}
            </span>
          ) : (
            /* AI messages: full Markdown rendering */
            <div className="md-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom code block with header + copy button
                  pre({ children, ...props }) {
                    return <CodeBlock {...props}>{children}</CodeBlock>;
                  },
                  // Open links in new tab
                  a({ href, children, ...props }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 14,
                    background: "var(--brand)",
                    borderRadius: 1,
                    marginLeft: 3,
                    verticalAlign: "text-bottom",
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              )}
            </div>
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

/* ── Code block with language label + copy button ───────────────────────────── */
const CodeBlock = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) => {
  const [copied, setCopied] = useState(false);

  // Extract language from highlight.js class e.g. "hljs language-python"
  const codeEl = (children as React.ReactElement)?.props;
  const className: string = codeEl?.className ?? "";
  const language =
    className
      .replace(/hljs\s?/, "")
      .replace("language-", "")
      .trim() || "code";
  const rawCode: string = codeEl?.children ?? "";

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof rawCode === "string" ? rawCode : String(rawCode),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <pre {...props} style={{ margin: 0 }}>
      <div className="code-block-header">
        <span>{language}</span>
        <button
          className={`copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      {children}
    </pre>
  );
};

/* ── Icons ──────────────────────────────────────────────────────────────────── */
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
        }}
      />
    ))}
  </div>
);
