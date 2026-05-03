import { useEffect, useMemo, useRef } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { useChatStore } from "../store/chatStore";
import { useModelsStore } from "../store/modelsStore";

export const ChatPage = () => {
  const {
    messages,
    isSending,
    isLoadingMessages,
    activeSessionId,
    fetchSessions,
    selectSession,
    createSession,
    sendMessage,
    getActiveSession,
  } = useChatStore();

  const { selectedModel, fetchModels } = useModelsStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const session = getActiveSession();

  useEffect(() => {
    void fetchSessions();
    void fetchModels();
  }, [fetchSessions, fetchModels]);

  useEffect(() => {
    if (activeSessionId && messages.length === 0) {
      void selectSession(activeSessionId);
    }
  }, [activeSessionId, messages.length, selectSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, messages[messages.length - 1]?.content]);

  const handleSend = async (content: string) => {
    if (!getActiveSession()) {
      await createSession(selectedModel || undefined, "New Chat");
    }

    await sendMessage(content, selectedModel || undefined);
  };

  const hasMessages = messages.length > 0;
  const emptyTitle = useMemo(() => {
    return session ? "Start the conversation" : "Welcome to Iqra AI";
  }, [session]);

  const emptyDescription = useMemo(() => {
    return session
      ? "Type a message below to get started with this chat session."
      : "Create a new chat from the sidebar or start typing to begin your first conversation.";
  }, [session]);

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {isLoadingMessages ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", paddingTop: 20 }}>
              Loading conversation…
            </div>
          ) : !hasMessages ? (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <ChatInput onSend={handleSend} disabled={isSending} />
      </div>
    </MainLayout>
  );
};

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px",
      animation: "fadeIn 0.5s ease",
    }}
  >
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        marginBottom: 24,
        background: "linear-gradient(135deg, rgba(20,184,126,0.15), rgba(20,184,126,0.05))",
        border: "1px solid rgba(20,184,126,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(20,184,126,0.15)",
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>

    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "var(--text-primary)",
        marginBottom: 10,
        letterSpacing: "-0.5px",
      }}
    >
      {title}
    </h2>

    <p
      style={{
        fontSize: 14,
        color: "var(--text-secondary)",
        maxWidth: 380,
        lineHeight: 1.65,
        marginBottom: 28,
      }}
    >
      {description}
    </p>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 500 }}>
      {SUGGESTIONS.map((suggestion) => (
        <SuggestionChip key={suggestion.text} icon={suggestion.icon} text={suggestion.text} />
      ))}
    </div>
  </div>
);

const SUGGESTIONS = [
  { icon: "✍️", text: "Write a product description" },
  { icon: "🧠", text: "Explain a complex topic" },
  { icon: "💻", text: "Help me debug code" },
  { icon: "📊", text: "Analyze this data" },
];

const SuggestionChip = ({ icon, text }: { icon: string; text: string }) => {
  const { getActiveSession, createSession, sendMessage } = useChatStore();
  const { selectedModel } = useModelsStore();

  const handleClick = async () => {
    if (!getActiveSession()) {
      await createSession(selectedModel || undefined, "New Chat");
    }

    await sendMessage(text, selectedModel || undefined);
  };

  return (
    <button
      onClick={() => void handleClick()}
      type="button"
      style={{
        padding: "9px 16px",
        borderRadius: 24,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "Sora, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = "rgba(20,184,126,0.3)";
        event.currentTarget.style.color = "var(--brand-light)";
        event.currentTarget.style.background = "rgba(20,184,126,0.06)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = "var(--border)";
        event.currentTarget.style.color = "var(--text-secondary)";
        event.currentTarget.style.background = "var(--bg-secondary)";
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
};
