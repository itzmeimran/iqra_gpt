import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatSession, Message, ChatState } from '../types';
import { llmService } from '../services/llmService';

const generateId = () => Math.random().toString(36).slice(2, 10);

const newSession = (): ChatSession => ({
  id: generateId(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  model: 'gpt-4o',
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSesssionId: null,
      isLoading: false,

      createSession: () => {
        const session = newSession();
        set((s) => ({
          sessions: [session, ...s.sessions],
          activeSesssionId: session.id,
        }));
        return session;
      },

      deleteSession: (id) =>
        set((s) => {
          const filtered = s.sessions.filter((x) => x.id !== id);
          const nextId =
            s.activeSesssionId === id
              ? (filtered[0]?.id ?? null)
              : s.activeSesssionId;
          return { sessions: filtered, activeSesssionId: nextId };
        }),

      setActiveSession: (id) => set({ activeSesssionId: id }),

      getActiveSession: () => {
        const { sessions, activeSesssionId } = get();
        return sessions.find((s) => s.id === activeSesssionId) ?? null;
      },

      updateSessionTitle: (id, title) =>
        set((s) => ({
          sessions: s.sessions.map((x) =>
            x.id === id ? { ...x, title } : x
          ),
        })),

      sendMessage: async (content: string) => {
        const { activeSesssionId, sessions } = get();
        if (!activeSesssionId) return;

        const userMsg: Message = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date(),
        };
        const aiMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isStreaming: true,
        };

        // Auto-title from first message
        const session = sessions.find((s) => s.id === activeSesssionId);
        const isFirst = session?.messages.length === 0;
        const autoTitle = isFirst
          ? content.slice(0, 40) + (content.length > 40 ? '…' : '')
          : undefined;

        set((s) => ({
          isLoading: true,
          sessions: s.sessions.map((sess) =>
            sess.id === activeSesssionId
              ? {
                  ...sess,
                  title: autoTitle ?? sess.title,
                  messages: [...sess.messages, userMsg, aiMsg],
                  updatedAt: new Date(),
                }
              : sess
          ),
        }));

        try {
          const history = [
            ...(session?.messages ?? []),
            userMsg,
          ];

          await llmService.streamResponse(
            history,
            (chunk: string) => {
              set((s) => ({
                sessions: s.sessions.map((sess) =>
                  sess.id === activeSesssionId
                    ? {
                        ...sess,
                        messages: sess.messages.map((m) =>
                          m.id === aiMsg.id
                            ? { ...m, content: m.content + chunk }
                            : m
                        ),
                      }
                    : sess
                ),
              }));
            }
          );
        } catch (e) {
          const errText =
            e instanceof Error ? e.message : 'Something went wrong.';
          set((s) => ({
            sessions: s.sessions.map((sess) =>
              sess.id === activeSesssionId
                ? {
                    ...sess,
                    messages: sess.messages.map((m) =>
                      m.id === aiMsg.id
                        ? { ...m, content: `⚠️ ${errText}`, isStreaming: false }
                        : m
                    ),
                  }
                : sess
            ),
          }));
        } finally {
          set((s) => ({
            isLoading: false,
            sessions: s.sessions.map((sess) =>
              sess.id === activeSesssionId
                ? {
                    ...sess,
                    messages: sess.messages.map((m) =>
                      m.id === aiMsg.id ? { ...m, isStreaming: false } : m
                    ),
                  }
                : sess
            ),
          }));
        }
      },
    }),
    {
      name: 'genai-chat',
      partialize: (s) => ({ sessions: s.sessions, activeSesssionId: s.activeSesssionId }),
    }
  )
);
