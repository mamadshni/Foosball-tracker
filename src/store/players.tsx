import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {Player, PlayerId} from "../types/models";
import { mockPlayers } from "../db/mock";
import { v4 as uuid } from "uuid";

interface PlayersState {
    players: Player[];
    addPlayer: (name: string) => void;
    updatePlayer: (id: PlayerId, data: Partial<Player>) => void;
    getPlayerById: (id: PlayerId) => Player | undefined;
}

export const usePlayersStore = create<PlayersState>()(
    persist(
        (set, get) => ({
            players: mockPlayers,

            addPlayer: (name) => {
                const newPlayer: Player = {
                    id: uuid(),
                    name,
                    rating: 1000,
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                };
                set((state) => ({ players: [...state.players, newPlayer] }));
            },

            updatePlayer: (id, data) => {
                set((state) => ({
                    players: state.players.map((p) =>
                        p.id === id ? { ...p, ...data } : p
                    ),
                }));
            },

            getPlayerById: (id) => get().players.find((p) => p.id === id),
        }),
        {
            name: "players-storage", // key in localStorage
        }
    )
);
