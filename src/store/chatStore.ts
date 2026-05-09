import { create } from "zustand";
import apiClient from "../services/apiClient";

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokenCount: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  isStreaming?: boolean;
}

interface SessionListResponse {
  sessions: ChatSession[];
  total: number;
}

interface ChatWithMessagesResponse {
  session: ChatSession;
  messages: ChatMessage[];
}

interface StreamChunk {
  type: "chunk" | "done" | "error";
  content?: string;
  messageId?: string;
  inputTokens?: number;
  outputTokens?: number;
  message?: string;
}

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;

  getActiveSession: () => ChatSession | null;

  fetchSessions: () => Promise<void>;
  createSession: (model?: string, title?: string) => Promise<ChatSession>;
  selectSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  sendMessage: (content: string, model?: string) => Promise<void>;
  sendMessageFull: (content: string, model?: string) => Promise<void>;
  regenerate: () => Promise<void>;

  clearError: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  isLoadingSessions: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    return sessions.find((session) => session.id === activeSessionId) ?? null;
  },

  fetchSessions: async () => {
    set({ isLoadingSessions: true, error: null });

    try {
      const { data } = await apiClient.get<SessionListResponse>("/api/chats");

      set((state) => {
        const nextActiveId =
          state.activeSessionId &&
          data.sessions.some((s) => s.id === state.activeSessionId)
            ? state.activeSessionId
            : (data.sessions[0]?.id ?? null);

        return {
          sessions: data.sessions,
          activeSessionId: nextActiveId,
          isLoadingSessions: false,
        };
      });
    } catch (error: unknown) {
      set({ isLoadingSessions: false, error: extractError(error) });
    }
  },

  createSession: async (model = "gemma4:31b", title = "New Chat") => {
    const { data } = await apiClient.post<ChatSession>("/api/chats", {
      model,
      title,
    });

    set((state) => ({
      sessions: [
        data,
        ...state.sessions.filter((session) => session.id !== data.id),
      ],
      activeSessionId: data.id,
      messages: [],
      error: null,
    }));

    return data;
  },

  selectSession: async (id: string) => {
    if (!id) return;

    set({ activeSessionId: id, isLoadingMessages: true, error: null });

    try {
      const { data } = await apiClient.get<ChatWithMessagesResponse>(
        `/api/chats/${id}`,
      );

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === id ? data.session : session,
        ),
        messages: data.messages,
        isLoadingMessages: false,
      }));
    } catch (error: unknown) {
      set({ isLoadingMessages: false, error: extractError(error) });
    }
  },

  renameSession: async (id: string, title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const { data } = await apiClient.patch<ChatSession>(`/api/chats/${id}`, {
      title: trimmedTitle,
    });

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id ? data : session,
      ),
    }));
  },

  deleteSession: async (id: string) => {
    await apiClient.delete(`/api/chats/${id}`);

    const { activeSessionId } = get();

    set((state) => {
      const nextSessions = state.sessions.filter(
        (session) => session.id !== id,
      );
      const nextActiveId =
        activeSessionId === id
          ? (nextSessions[0]?.id ?? null)
          : activeSessionId;

      return {
        sessions: nextSessions,
        activeSessionId: nextActiveId,
        messages: activeSessionId === id ? [] : state.messages,
      };
    });

    const nextActiveId = get().activeSessionId;
    if (nextActiveId) {
      await get().selectSession(nextActiveId);
    }
  },

  sendMessage: async (content: string, model?: string) => {
    let { activeSessionId } = get();

    if (!activeSessionId) {
      const created = await get().createSession(model, "New Chat");
      activeSessionId = created.id;
    }

    const session = get().getActiveSession();
    const effectiveModel = model ?? session?.model;

    const tempUserId = `temp-user-${Date.now()}`;
    const tempAssistantId = `temp-ai-${Date.now()}`;

    const optimisticUserMessage: ChatMessage = {
      id: tempUserId,
      sessionId: activeSessionId!,
      role: "user",
      content,
      tokenCount: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
    };

    const optimisticAssistantMessage: ChatMessage = {
      id: tempAssistantId,
      sessionId: activeSessionId!,
      role: "assistant",
      content: "",
      tokenCount: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
      isStreaming: true,
    };

    set((state) => ({
      isSending: true,
      error: null,
      messages: [
        ...state.messages,
        optimisticUserMessage,
        optimisticAssistantMessage,
      ],
    }));

    try {
      const baseURL = (apiClient.defaults.baseURL ?? "").replace(/\/$/, "");
      const accessToken = localStorage.getItem("genai:accessToken");

      const response = await fetch(
        `${baseURL}api/chats/${activeSessionId}/messages/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            content,
            ...(effectiveModel ? { model: effectiveModel } : {}),
          }),
        },
      );

      if (!response.ok || !response.body) {
        throw new Error(
          `Stream request failed: ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type") ?? "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      if (contentType.includes("text/event-stream")) {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const frames = buffer.split(/\r?\n\r?\n/);
          buffer = frames.pop() ?? "";

          for (const frame of frames) {
            const lines = frame.split(/\r?\n/);

            for (const line of lines) {
              if (!line.startsWith("data:")) continue;

              const raw = line.slice(5).trim();
              if (!raw || raw === "[DONE]") continue;

              let parsed: StreamChunk;

              try {
                parsed = JSON.parse(raw) as StreamChunk;
              } catch {
                parsed = { type: "chunk", content: raw };
              }

              if (parsed.type === "chunk") {
                set((state) => ({
                  messages: state.messages.map((message) =>
                    message.id === tempAssistantId
                      ? {
                          ...message,
                          content: `${message.content}${parsed.content ?? ""}`,
                        }
                      : message,
                  ),
                }));
              }

              if (parsed.type === "done") {
                set((state) => ({
                  messages: state.messages.map((message) =>
                    message.id === tempAssistantId
                      ? {
                          ...message,
                          id: parsed.messageId ?? message.id,
                          tokenCount: parsed.outputTokens ?? message.tokenCount,
                          isStreaming: false,
                        }
                      : message,
                  ),
                  sessions: state.sessions.map((chatSession) =>
                    chatSession.id === activeSessionId
                      ? {
                          ...chatSession,
                          messageCount: chatSession.messageCount + 2,
                          updatedAt: new Date().toISOString(),
                        }
                      : chatSession,
                  ),
                }));
              }

              if (parsed.type === "error") {
                throw new Error(parsed.message ?? "Streaming failed");
              }
            }
          }
        }
      } else {
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });

          set((state) => ({
            messages: state.messages.map((message) =>
              message.id === tempAssistantId
                ? { ...message, content: fullText }
                : message,
            ),
          }));
        }

        set((state) => ({
          messages: state.messages.map((message) =>
            message.id === tempAssistantId
              ? { ...message, isStreaming: false }
              : message,
          ),
          sessions: state.sessions.map((chatSession) =>
            chatSession.id === activeSessionId
              ? {
                  ...chatSession,
                  messageCount: chatSession.messageCount + 2,
                  updatedAt: new Date().toISOString(),
                }
              : chatSession,
          ),
        }));
      }
    } catch (error: unknown) {
      const message = extractError(error);

      set((state) => ({
        error: message,
        messages: state.messages.map((chatMessage) =>
          chatMessage.id === tempAssistantId
            ? {
                ...chatMessage,
                content: `⚠️ ${message}`,
                isStreaming: false,
              }
            : chatMessage,
        ),
      }));
    } finally {
      set((state) => ({
        isSending: false,
        messages: state.messages.map((chatMessage) =>
          chatMessage.id === tempAssistantId
            ? { ...chatMessage, isStreaming: false }
            : chatMessage,
        ),
      }));
    }
  },

  sendMessageFull: async (content: string, model?: string) => {
    let { activeSessionId } = get();

    if (!activeSessionId) {
      const created = await get().createSession(model, "New Chat");
      activeSessionId = created.id;
    }

    const session = get().getActiveSession();

    const optimisticUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      sessionId: activeSessionId!,
      role: "user",
      content,
      tokenCount: 0,
      metadata: {},
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      isSending: true,
      error: null,
      messages: [...state.messages, optimisticUserMessage],
    }));

    try {
      const { data } = await apiClient.post<ChatMessage>(
        `/api/chats/${activeSessionId}/messages`,
        {
          content,
          ...((model ?? session?.model)
            ? { model: model ?? session?.model }
            : {}),
        },
      );

      set((state) => ({
        isSending: false,
        messages: [...state.messages, data],
        sessions: state.sessions.map((chatSession) =>
          chatSession.id === activeSessionId
            ? {
                ...chatSession,
                messageCount: chatSession.messageCount + 2,
                updatedAt: new Date().toISOString(),
              }
            : chatSession,
        ),
      }));
    } catch (error: unknown) {
      set({ isSending: false, error: extractError(error) });
    }
  },

  regenerate: async () => {
    const { activeSessionId } = get();
    if (!activeSessionId) return;

    set((state) => ({
      isSending: true,
      error: null,
      messages: removeLastAssistant(state.messages),
    }));

    try {
      const { data } = await apiClient.post<ChatMessage>(
        `/api/chats/${activeSessionId}/regenerate`,
      );

      set((state) => ({
        isSending: false,
        messages: [...state.messages, data],
      }));
    } catch (error: unknown) {
      set({ isSending: false, error: extractError(error) });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      sessions: [],
      activeSessionId: null,
      messages: [],
      isLoadingSessions: false,
      isLoadingMessages: false,
      isSending: false,
      error: null,
    }),
}));

function removeLastAssistant(messages: ChatMessage[]): ChatMessage[] {
  const reversedIndex = [...messages]
    .reverse()
    .findIndex((message) => message.role === "assistant");
  if (reversedIndex === -1) return messages;

  const actualIndex = messages.length - 1 - reversedIndex;
  return messages.filter((_, index) => index !== actualIndex);
}

function extractError(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { detail?: string; message?: string } } }
    ).response;

    return (
      response?.data?.detail ??
      response?.data?.message ??
      "An unexpected error occurred."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
