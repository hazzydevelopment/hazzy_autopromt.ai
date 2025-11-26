import { create } from "zustand";

const STORAGE_KEY = "autoprompt_v1";

export const usePromptStore = create((set, get) => ({
  prompts: [],

  loadFromStorage: () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      set({ prompts: Array.isArray(saved) ? saved : [] });
    } catch {
      set({ prompts: [] });
    }
  },

  saveToStorage: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().prompts));
    } catch (e) {
      console.error("Failed to save prompts", e);
    }
  },

  addPrompt: (prompt) =>
    set((state) => {
      const newPrompt = { ...prompt, id: (crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()), favorite: !!prompt.favorite, createdAt: Date.now() };
      const updated = [...state.prompts, newPrompt];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { prompts: updated };
    }),

  removePrompt: (id) =>
    set((state) => {
      const updated = state.prompts.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { prompts: updated };
    }),

  updatePrompt: (id, data) =>
    set((state) => {
      const updated = state.prompts.map((p) => (p.id === id ? { ...p, ...data } : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { prompts: updated };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const updated = state.prompts.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { prompts: updated };
    }),

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ prompts: [] });
  },

  importFromJSON: (jsonStr) =>
    set(() => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return { prompts: parsed };
      } catch (e) {
        console.error("Import failed", e);
        return {};
      }
    }),

  exportToJSON: () => {
    try {
      return JSON.stringify(get().prompts, null, 2);
    } catch {
      return "[]";
    }
  },
}));
