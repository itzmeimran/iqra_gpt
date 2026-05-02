import { useEffect, useRef } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { useChatStore } from '../store/chatStore';

export const ChatPage = () => {
  const { getActiveSession, createSession, sendMessage, isLoading } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const session = getActiveSession();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages.length, session?.messages[session?.messages.length - 1]?.content]);

  const handleSend = async (content: string) => {
    if (!session) createSession();
    await sendMessage(content);
  };

  return (
    <MainLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!session || session.messages.length === 0 ? (
            <EmptyState onCreate={() => { if (!session) createSession(); }} hasSession={!!session} />
          ) : (
            <>
              {session.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </MainLayout>
  );
};

const EmptyState = ({ hasSession }: { onCreate: () => void; hasSession: boolean }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '40px 20px',
    animation: 'fadeIn 0.5s ease',
  }}>
    <style>{`
      @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    `}</style>

    {/* Icon */}
    <div style={{
      width: 72, height: 72, borderRadius: 20, marginBottom: 24,
      background: 'linear-gradient(135deg, rgba(20,184,126,0.15), rgba(20,184,126,0.05))',
      border: '1px solid rgba(20,184,126,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 40px rgba(20,184,126,0.15)',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>

    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.5px' }}>
      {hasSession ? 'Start the conversation' : 'Welcome to Iqra GPT'}
    </h2>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.65, marginBottom: 28 }}>
      {hasSession
        ? 'Type a message below to get started with this chat session.'
        : 'Create a new chat from the sidebar or start typing to begin your first conversation.'}
    </p>

    {/* Suggestion chips */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 500 }}>
      {SUGGESTIONS.map((s) => (
        <SuggestionChip key={s.text} icon={s.icon} text={s.text} />
      ))}
    </div>
  </div>
);

const SUGGESTIONS = [
  { icon: '✍️', text: 'Write a product description' },
  { icon: '🧠', text: 'Explain a complex topic' },
  { icon: '💻', text: 'Help me debug code' },
  { icon: '📊', text: 'Analyze this data' },
];

const SuggestionChip = ({ icon, text }: { icon: string; text: string }) => {
  const { getActiveSession, createSession, sendMessage } = useChatStore();
  const handleClick = async () => {
    if (!getActiveSession()) createSession();
    await sendMessage(text);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '9px 16px', borderRadius: 24,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
        fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(20,184,126,0.3)';
        (e.currentTarget as HTMLElement).style.color = 'var(--brand-light)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(20,184,126,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)';
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
};
