import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../services/apiClient";

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  isAvailable: boolean;
  contextLength: number | null;
}

interface ModelsResponse {
  models: LLMModel[];
  defaultModel: string;
}

interface ModelsStore {
  models: LLMModel[];
  defaultModel: string;
  selectedModel: string;
  isLoading: boolean;
  error: string | null;

  fetchModels: () => Promise<void>;
  selectModel: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useModelsStore = create<ModelsStore>()(
  persist(
    (set, get) => ({
      models: [],
      defaultModel: "gemma4:31b",
      selectedModel: "",
      isLoading: false,
      error: null,

      fetchModels: async () => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiClient.get<ModelsResponse>("/api/models");

          set((state) => {
            const nextSelectedModel = data.models.some(
              (model) => model.id === state.selectedModel,
            )
              ? state.selectedModel
              : data.defaultModel;

            return {
              models: data.models,
              defaultModel: data.defaultModel,
              selectedModel: nextSelectedModel,
              isLoading: false,
            };
          });
        } catch (error: unknown) {
          set({ isLoading: false, error: extractError(error) });
        }
      },

      selectModel: async (id: string) => {
        const previousModel = get().selectedModel;
        set({ selectedModel: id, error: null });

        try {
          await apiClient.post("/api/models/select", { model: id });
        } catch (error: unknown) {
          set({ selectedModel: previousModel, error: extractError(error) });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "genai-models",
      partialize: (state) => ({ selectedModel: state.selectedModel }),
    },
  ),
);

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
