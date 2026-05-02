import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock users DB — replace with real API
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@genai.app': {
    password: 'password123',
    user: {
      id: 'u_001',
      email: 'demo@genai.app',
      name: 'Imran K.',
      plan: 'free',
    },
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        // Simulate network delay
        await new Promise((res) => setTimeout(res, 900));
        const record = MOCK_USERS[email.toLowerCase()];
        if (!record || record.password !== password) {
          set({ isLoading: false });
          throw new Error('Invalid email or password.');
        }
        set({ user: record.user, isAuthenticated: true, isLoading: false });
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'genai-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
