import type {Player, Game} from "../types/models";
import { v4 as uuid } from "uuid";

export const mockPlayers: Player[] = [
    {
        id: uuid(),
        name: "Alice",
        rating: 1000,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
    },
    {
        id: uuid(),
        name: "Bob",
        rating: 1000,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
    },
    {
        id: uuid(),
        name: "Nick",
        rating: 1000,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
    },
    {
        id: uuid(),
        name: "Dan",
        rating: 1000,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
    },
];

export const mockGames: Game[] = [];
