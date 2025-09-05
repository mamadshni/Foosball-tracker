import { useGamesStore } from "../store/games";
import { usePlayersStore } from "../store/players";
import { usePlayersMap } from "../store/selectors";
import { Box, Typography } from "@mui/material";
import type { Game } from "../types/models";
import { useGamesViewStore } from "../store/gamesView";
import GamesFilterBar from "../components/games/GamesFilterBar";
import GamesTable from "../components/games/GamesTable";

export default function GamesList() {
    const games = useGamesStore((state) => state.games);
    const players = usePlayersStore((state) => state.players);
    const playersMap = usePlayersMap();
    const teamSize = useGamesViewStore((s) => s.teamSize);
    // filters are controlled in GamesFilterBar
    const winner = useGamesViewStore((s) => s.winner);
    const selectedPlayers = useGamesViewStore((s) => s.players);
    const sortBy = useGamesViewStore((s) => s.sortBy);
    const sortDir = useGamesViewStore((s) => s.sortDir);
    // sorting controls handled in GamesFilterBar

    const getPlayerName = (id: string) => playersMap.get(id)?.name || "Unknown";
    // helpers moved into GamesTable

    const teamSumDelta = (g: Game, team: "A" | "B") => {
        if (g.perPlayerDeltas) {
            const ids = team === "A" ? g.teamA : g.teamB;
            return ids.reduce((s: number, id: string) => s + (g.perPlayerDeltas?.[id] ?? 0), 0);
        }
        // Fallback for legacy games
        const isWinner = g.winnerTeam === team;
        return isWinner ? g.pointsChange : -g.pointsChange;
    };

    const includesAnySelected = (ids: string[]) =>
        selectedPlayers.length === 0 || selectedPlayers.some((pid) => ids.includes(pid));

    const is1v1 = (g: Game) => g.teamA.length === 1 && g.teamB.length === 1;
    const is2v2 = (g: Game) => g.teamA.length === 2 && g.teamB.length === 2;

    const filtered = games.filter((g) => {
        if (teamSize === "1v1" && !is1v1(g)) return false;
        if (teamSize === "2v2" && !is2v2(g)) return false;
        if (winner !== "all" && g.winnerTeam !== winner) return false;
        if (!includesAnySelected([...g.teamA, ...g.teamB])) return false;
        return true;
    });

    const sorted = filtered.slice().sort((a, b) => {
        if (sortBy === "date") {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            return sortDir === "desc" ? db - da : da - db;
        }
        // impact
        const ia = Math.abs(teamSumDelta(a, a.winnerTeam));
        const ib = Math.abs(teamSumDelta(b, b.winnerTeam));
        return sortDir === "desc" ? ib - ia : ia - ib;
    });

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Games
            </Typography>
            <GamesFilterBar players={players} />
            <GamesTable games={sorted} getPlayerName={getPlayerName} />
        </Box>
    );
}
