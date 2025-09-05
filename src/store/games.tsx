import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game, PlayerId } from "../types/models";
import { mockGames } from "../db/mock";
import { usePlayersStore } from "./players";
import { v4 as uuid } from "uuid";

interface GamesState {
    games: Game[];
    addGame: (game: { teamA: PlayerId[]; teamB: PlayerId[]; winnerTeam: "A" | "B" }) => void;
    getGamesByPlayer: (playerId: PlayerId) => Game[];
}

export const useGamesStore = create<GamesState>()(
    persist(
        (set, get) => ({
            games: mockGames,

            addGame: ({ teamA, teamB, winnerTeam }) => {
                const winners = winnerTeam === "A" ? teamA : teamB;
                const losers = winnerTeam === "A" ? teamB : teamA;

                const isDoubles = teamA.length === 2 && teamB.length === 2;
                const pointsChange = isDoubles ? 20 : 30;

                const updatePlayerStats = usePlayersStore.getState().updatePlayer;
                const allPlayers = usePlayersStore.getState().players;

                winners.forEach((id) => {
                    const player = allPlayers.find((p) => p.id === id);
                    if (player) {
                        updatePlayerStats(id, {
                            rating: player.rating + pointsChange,
                            gamesPlayed: player.gamesPlayed + 1,
                            wins: player.wins + 1,
                        });
                    }
                });

                losers.forEach((id) => {
                    const player = allPlayers.find((p) => p.id === id);
                    if (player) {
                        updatePlayerStats(id, {
                            rating: player.rating - pointsChange,
                            gamesPlayed: player.gamesPlayed + 1,
                            losses: player.losses + 1,
                        });
                    }
                });

                const newGame: Game = {
                    id: uuid(),
                    date: new Date().toISOString(),
                    teamA,
                    teamB,
                    winnerTeam,
                    pointsChange,
                };

                set((state) => ({ games: [...state.games, newGame] }));
            },

            getGamesByPlayer: (playerId) =>
                get().games.filter(
                    (g) => g.teamA.includes(playerId) || g.teamB.includes(playerId)
                ),
        }),
        {
            name: "games-storage",
        }
    )
);
