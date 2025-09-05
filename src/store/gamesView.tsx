import { create } from "zustand";
import { persist } from "zustand/middleware";

type TeamSizeFilter = "all" | "1v1" | "2v2";
type WinnerFilter = "all" | "A" | "B";
type SortBy = "date" | "impact";
type SortDir = "asc" | "desc";

interface GamesViewState {
  teamSize: TeamSizeFilter;
  winner: WinnerFilter;
  players: string[]; // filter: include any of selected players
  sortBy: SortBy;
  sortDir: SortDir;
  setTeamSize: (v: TeamSizeFilter) => void;
  setWinner: (v: WinnerFilter) => void;
  setPlayers: (ids: string[]) => void;
  setSortBy: (v: SortBy) => void;
  setSortDir: (v: SortDir) => void;
  clear: () => void;
}

export const useGamesViewStore = create<GamesViewState>()(
  persist(
    (set) => ({
      teamSize: "all",
      winner: "all",
      players: [],
      sortBy: "date",
      sortDir: "desc",
      setTeamSize: (v) => set({ teamSize: v }),
      setWinner: (v) => set({ winner: v }),
      setPlayers: (ids) => set({ players: ids }),
      setSortBy: (v) => set({ sortBy: v }),
      setSortDir: (v) => set({ sortDir: v }),
      clear: () => set({ teamSize: "all", winner: "all", players: [], sortBy: "date", sortDir: "desc" }),
    }),
    { name: "games-view" }
  )
);

