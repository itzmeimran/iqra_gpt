import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient, { tokenStorage } from "../services/apiClient";
import type { User } from "../types";
import { useChatStore } from "./chatStore";
import { useUsageStore } from "./usageStore";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  user: User;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleSSO: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  clearError: () => void;
  _forceLogout: () => void;
}

function applyAuth(
  set: (partial: Partial<AuthStore>) => void,
  data: AuthResponse,
): void {
  const { accessToken, refreshToken } = data;
  tokenStorage.set(accessToken, refreshToken);
  set({
    user: data.user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  });
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiClient.post<AuthResponse>(
            "/api/auth/register",
            {
              name,
              email,
              password,
            },
          );

          applyAuth(set, data);
        } catch (error: unknown) {
          const message = extractError(error);
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiClient.post<AuthResponse>(
            "/api/auth/login",
            {
              email,
              password,
            },
          );

          applyAuth(set, data);
        } catch (error: unknown) {
          const message = extractError(error);
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      googleSSO: async (idToken: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiClient.post<AuthResponse>(
            "http://localhost:8000/api/auth/google",
            {
              idToken,
            },
          );
          console.log("data", data);
          applyAuth(set, data);
        } catch (error: unknown) {
          const message = extractError(error);
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          await apiClient.post("/api/auth/logout");
        } catch {
          // best-effort logout
        } finally {
          get()._forceLogout();
        }
      },

      fetchMe: async () => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiClient.get<User>("/api/auth/me");

          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: extractError(error),
          });
        }
      },

      clearError: () => set({ error: null }),

      _forceLogout: () => {
        tokenStorage.clear();
        useChatStore.getState().reset();
        useUsageStore.getState().reset();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
    }),
    {
      name: "genai-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("genai:force-logout", () => {
    useAuthStore.getState()._forceLogout();
  });
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
