import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ScoringMode = "dynamic" | "openskill";

interface SettingsState {
  scoring: ScoringMode;
  setScoring: (m: ScoringMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      scoring: "dynamic",
      setScoring: (m) => set({ scoring: m }),
    }),
    { name: "settings" }
  )
);

