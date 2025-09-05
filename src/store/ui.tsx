import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
    mode: "light" | "dark";
    toggleMode: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            mode: "light",
            toggleMode: () =>
                set({ mode: get().mode === "light" ? "dark" : "light" }),
        }),
        { name: "ui-storage" }
    )
);
