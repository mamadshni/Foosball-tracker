import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Game, PlayerId } from "../types/models";
import { usePlayersStore } from "./players";
import { v4 as uuid } from "uuid";
import { computePointsOpenSkill } from "../lib/rating/openskill";
import { supabase } from "../lib/db/supabase";

interface GamesState {
    games: Game[];
    ready: boolean;
    fetchAll: () => Promise<void>;
    addGame: (game: { teamA: PlayerId[]; teamB: PlayerId[]; winnerTeam: "A" | "B" }) => Promise<void>;
    getGamesByPlayer: (playerId: PlayerId) => Game[];
}

type DBGame = {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    winner_team: "A" | "B";
    points_change: number;
    per_player_deltas: Record<string, number> | null;
};

function toAppGame(g: DBGame): Game {
    return {
        id: g.id,
        date: g.date,
        teamA: g.team_a,
        teamB: g.team_b,
        winnerTeam: g.winner_team,
        pointsChange: g.points_change,
        perPlayerDeltas: g.per_player_deltas ?? undefined,
    };
}

export const useGamesStore = create<GamesState>()(
    persist(
        (set, get) => ({
            games: [],
            ready: false,

            fetchAll: async () => {
                const { data, error } = await supabase
                    .from("games")
                    .select("id,date,team_a,team_b,winner_team,points_change,per_player_deltas")
                    .order("date", { ascending: true });
                if (!error && data) {
                    const mapped = (data as DBGame[]).map(toAppGame);
                    set({ games: mapped, ready: true });
                } else {
                    set({ ready: true });
                }
            },

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
                // persist
                await supabase.from("games").insert({
                    id: newGame.id,
                    date: newGame.date,
                    team_a: newGame.teamA,
                    team_b: newGame.teamB,
                    winner_team: newGame.winnerTeam,
                    points_change: newGame.pointsChange,
                    per_player_deltas: newGame.perPlayerDeltas,
                }).then();
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
