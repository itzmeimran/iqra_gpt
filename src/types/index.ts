export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ChatState {
  sessions: ChatSession[];
  activeSesssionId: string | null;
  isLoading: boolean;
  createSession: () => ChatSession;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  getActiveSession: () => ChatSession | null;
  updateSessionTitle: (id: string, title: string) => void;
}
