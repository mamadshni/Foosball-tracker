import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player, PlayerId } from "../types/models";
import { supabase } from "../lib/db/supabase";
import { v4 as uuid } from "uuid";

interface PlayersState {
    players: Player[];
    ready: boolean;
    fetchAll: () => Promise<void>;
    addPlayer: (name: string) => void;
    updatePlayer: (id: PlayerId, data: Partial<Player>) => void;
    getPlayerById: (id: PlayerId) => Player | undefined;
}

type DBPlayer = {
    id: string;
    name: string;
    rating: number;
    games_played: number;
    wins: number;
    losses: number;
};

function toApp(p: DBPlayer): Player {
    return {
        id: p.id,
        name: p.name,
        rating: p.rating,
        gamesPlayed: p.games_played,
        wins: p.wins,
        losses: p.losses,
    };
}

function toDB(p: Partial<Player>): Partial<DBPlayer> {
    const out: Partial<DBPlayer> = {};
    if (p.id !== undefined) out.id = p.id;
    if (p.name !== undefined) out.name = p.name;
    if (p.rating !== undefined) out.rating = p.rating;
    if (p.gamesPlayed !== undefined) out.games_played = p.gamesPlayed;
    if (p.wins !== undefined) out.wins = p.wins;
    if (p.losses !== undefined) out.losses = p.losses;
    return out;
}

export const usePlayersStore = create<PlayersState>()(
    persist(
        (set, get) => ({
            players: [],
            ready: false,

            fetchAll: async () => {
                const { data, error } = await supabase
                    .from("players")
                    .select("id,name,rating,games_played,wins,losses")
                    .order("rating", { ascending: false });
                if (!error && data) {
                    const mapped = (data as DBPlayer[]).map(toApp);
                    set({ players: mapped, ready: true });
                } else {
                    set({ ready: true });
                }
            },

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
                // fire-and-forget persist
                supabase.from("players").insert(toDB(newPlayer)).then();
            },

            updatePlayer: (id, data) => {
                set((state) => ({
                    players: state.players.map((p) => (p.id === id ? { ...p, ...data } : p)),
                }));
                supabase.from("players").update(toDB(data)).eq("id", id).then();
            },

            getPlayerById: (id) => get().players.find((p) => p.id === id),
        }),
        { name: "players-storage" }
    )
);
