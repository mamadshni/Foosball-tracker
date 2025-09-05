import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "../types/models";

type SortBy = keyof Player;
type SortDir = "asc" | "desc";

interface PlayersViewState {
  search: string;
  sortBy: SortBy;
  sortDir: SortDir;
  setSearch: (q: string) => void;
  setSortBy: (v: SortBy) => void;
  setSortDir: (v: SortDir) => void;
  clear: () => void;
}

export const usePlayersViewStore = create<PlayersViewState>()(
  persist(
    (set) => ({
      search: "",
      sortBy: "rating",
      sortDir: "desc",
      setSearch: (q) => set({ search: q }),
      setSortBy: (v) => set({ sortBy: v }),
      setSortDir: (v) => set({ sortDir: v }),
      clear: () => set({ search: "", sortBy: "rating", sortDir: "desc" }),
    }),
    { name: "players-view" }
  )
);

