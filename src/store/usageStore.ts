import { create } from "zustand";
import apiClient from "../services/apiClient";

export interface UsageData {
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  requestCount: number;
  monthlyTotal: number;
}

export interface PlanLimits {
  plan: string;
  dailyTokenLimit: number;
  monthlyTokenLimit: number;
  maxChats: number;
  maxMessagesPerChat: number;
  dailyUsed: number;
  monthlyUsed: number;
  dailyRemaining: number;
  monthlyRemaining: number;
}

interface UsageStore {
  usage: UsageData | null;
  limits: PlanLimits | null;
  isLoading: boolean;
  error: string | null;

  usageRatio: () => number;
  isNearLimit: () => boolean;

  fetchUsage: () => Promise<void>;
  fetchLimits: () => Promise<void>;
  fetchAll: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useUsageStore = create<UsageStore>()((set, get) => ({
  usage: null,
  limits: null,
  isLoading: false,
  error: null,

  usageRatio: () => {
    const { limits } = get();
    if (!limits || limits.dailyTokenLimit <= 0) return 0;
    return Math.min(limits.dailyUsed / limits.dailyTokenLimit, 1);
  },

  isNearLimit: () => get().usageRatio() >= 0.9,

  fetchUsage: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await apiClient.get<UsageData>("/api/usage");
      set({ usage: data, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false, error: extractError(error) });
    }
  },

  fetchLimits: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await apiClient.get<PlanLimits>("/api/usage/limits");
      set({ limits: data, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false, error: extractError(error) });
    }
  },

  fetchAll: async () => {
    set({ isLoading: true, error: null });

    try {
      const [usageResponse, limitsResponse] = await Promise.all([
        apiClient.get<UsageData>("/api/usage"),
        apiClient.get<PlanLimits>("/api/usage/limits"),
      ]);

      set({
        usage: usageResponse.data,
        limits: limitsResponse.data,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({ isLoading: false, error: extractError(error) });
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      usage: null,
      limits: null,
      isLoading: false,
      error: null,
    }),
}));

function extractError(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { detail?: string; message?: string } } }
    ).response;

    return response?.data?.detail ?? response?.data?.message ?? "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
