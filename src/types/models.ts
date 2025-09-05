export type PlayerId = string;
export type GameId = string;

export interface Player {
    id: PlayerId;
    name: string;
    rating: number; // starts at 1000
    gamesPlayed: number;
    wins: number;
    losses: number;
}

export interface Game {
    id: string;
    date: string;
    teamA: PlayerId[];
    teamB: PlayerId[];
    winnerTeam: "A" | "B";
    pointsChange: number; // legacy overall magnitude used in some tables
    perPlayerDeltas?: Record<PlayerId, number>; // detailed per-player rating deltas
}
