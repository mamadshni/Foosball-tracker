import { z } from "zod";

export const playerSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    rating: z.number(),
    gamesPlayed: z.number(),
    wins: z.number(),
    losses: z.number(),
});
export const gameSchema = z.object({
    id: z.string(),
    date: z.string(),
    teamA: z.array(z.string()).min(1).max(2),
    teamB: z.array(z.string()).min(1).max(2),
    winnerTeam: z.enum(["A", "B"]),
    pointsChange: z.number(),
});
