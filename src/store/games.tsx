import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game, PlayerId } from "../types/models";
import { mockGames } from "../db/mock";
import { usePlayersStore } from "./players";
import { v4 as uuid } from "uuid";
import { computePointsOpenSkill } from "../lib/rating/openskill";

interface GamesState {
    games: Game[];
    addGame: (game: { teamA: PlayerId[]; teamB: PlayerId[]; winnerTeam: "A" | "B" }) => void;
    getGamesByPlayer: (playerId: PlayerId) => Game[];
}

export const useGamesStore = create<GamesState>()(
    persist(
        (set, get) => ({
            games: mockGames,

            addGame: async ({ teamA, teamB, winnerTeam }) => {
                const updatePlayer = usePlayersStore.getState().updatePlayer;
                const all = usePlayersStore.getState().players;

                const teamAPlayers = teamA
                    .map((id) => all.find((p) => p.id === id))
                    .filter((p): p is NonNullable<typeof p> => Boolean(p))
                    .map((p) => ({ id: p.id, rating: p.rating, gamesPlayed: p.gamesPlayed }));
                const teamBPlayers = teamB
                    .map((id) => all.find((p) => p.id === id))
                    .filter((p): p is NonNullable<typeof p> => Boolean(p))
                    .map((p) => ({ id: p.id, rating: p.rating, gamesPlayed: p.gamesPlayed }));

                const { deltas, summary } = await computePointsOpenSkill({ teamA: teamAPlayers, teamB: teamBPlayers, winnerTeam });

                // Apply updates per player: rating + win/loss + gamesPlayed
                const winners = winnerTeam === "A" ? teamA : teamB;

                for (const id of teamA.concat(teamB)) {
                    const before = all.find((p) => p.id === id);
                    if (!before) continue;
                    const delta = deltas[id] ?? 0;
                    const isWinner = winners.includes(id);
                    updatePlayer(id, {
                        rating: before.rating + delta,
                        gamesPlayed: before.gamesPlayed + 1,
                        wins: isWinner ? before.wins + 1 : before.wins,
                        losses: !isWinner ? before.losses + 1 : before.losses,
                    });
                }

                const newGame: Game = {
                    id: uuid(),
                    date: new Date().toISOString(),
                    teamA,
                    teamB,
                    winnerTeam,
                    pointsChange: Math.abs(summary.teamDeltaA),
                    perPlayerDeltas: deltas,
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
