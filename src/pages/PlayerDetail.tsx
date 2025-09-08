import { useParams } from "react-router-dom";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import { Box, Typography, Paper, Stack, Breadcrumbs, Link as MUILink } from "@mui/material";
// Using responsive Stack and CSS grid instead of MUI Grid to avoid type friction.
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { PlayerOverviewCard } from "../components/player/PlayerOverviewCard";
import { PlayerHistoryCard } from "../components/player/PlayerHistoryCard";

export default function PlayerDetail() {
    const { playerId } = useParams<{ playerId: string }>();

    // Select slices separately to avoid returning a new object each render,
    // which can trip useSyncExternalStore in React 19.
    const players = usePlayersStore((state) => state.players);
    const getPlayerById = usePlayersStore((state) => state.getPlayerById);

    const games = useGamesStore((state) => state.games);

    const player = getPlayerById(playerId || "");

    const playerGames = useMemo(
        () =>
            games
                .filter(
                    (g) => g.teamA.includes(playerId || "") || g.teamB.includes(playerId || "")
                )
                .sort(_ => -1),
        [games, playerId]
    );

    // Sort games by most recent first; keep as a hook before any early returns
    const recentGames = useMemo(
        () =>
            playerGames
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [playerGames]
    );

    if (!player) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Player not found</Typography>
                <Typography variant="body2" color="text.secondary">Check the URL or go back to the players list.</Typography>
            </Paper>
        );
    }

    const winRateNumber = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;

    const teammateCount: Record<string, number> = {};
    const opponentCount: Record<string, number> = {};

    playerGames.forEach((g) => {
        const playerInTeamA = g.teamA.includes(player.id);
        const playerTeam = playerInTeamA ? g.teamA : g.teamB;
        const opponentTeam = playerInTeamA ? g.teamB : g.teamA;

        playerTeam.forEach((id) => {
            if (id !== player.id) {
                teammateCount[id] = (teammateCount[id] || 0) + 1;
            }
        });

        opponentTeam.forEach((id) => {
            opponentCount[id] = (opponentCount[id] || 0) + 1;
        });
    });

    const mostPlayedWithId =
        Object.entries(teammateCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostPlayedAgainstId =
        Object.entries(opponentCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    const mostPlayedWith = players.find((p) => p.id === mostPlayedWithId);
    const mostPlayedAgainst = players.find((p) => p.id === mostPlayedAgainstId);

    const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || "Unknown";

    // Recent performance helpers
    const isWinForPlayer = (g: typeof playerGames[number]) => {
        const playerInTeamA = g.teamA.includes(player.id);
        return (g.winnerTeam === "A" && playerInTeamA) || (g.winnerTeam === "B" && !playerInTeamA);
    };
    const lastFive = recentGames.slice(0, 5);
    const lastFiveDelta = lastFive.reduce((sum, g) => sum + (isWinForPlayer(g) ? g.pointsChange : -g.pointsChange), 0);
    const form = lastFive.map((g) => (isWinForPlayer(g) ? "W" : "L"));
    let streakType: "W" | "L" | null = null;
    let streakLen = 0;
    for (const g of recentGames) {
        const r = isWinForPlayer(g) ? "W" : "L";
        if (streakType == null) {
            streakType = r;
            streakLen = 1;
        } else if (streakType === r) {
            streakLen += 1;
        } else {
            break;
        }
    }

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 2, minWidth: 0 }} aria-label="breadcrumb">
                <MUILink component={RouterLink} to="/">Dashboard</MUILink>
                <MUILink component={RouterLink} to="/players">Players</MUILink>
                <Typography color="text.primary" title={player.name} sx={{ display: 'inline-block', maxWidth: { xs: '45vw', md: 300 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {player.name}
                </Typography>
            </Breadcrumbs>
            <Stack spacing={3} direction={{ xs: "column", md: "row" }}>
                <Box sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
                    <PlayerOverviewCard
                        player={player}
                        winRateNumber={winRateNumber}
                        mostPlayedWith={mostPlayedWith}
                        mostPlayedAgainst={mostPlayedAgainst}
                        form={form}
                        lastFiveDelta={lastFiveDelta}
                        streakType={streakType}
                        streakLen={streakLen}
                    />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <PlayerHistoryCard
                        playerId={player.id}
                        playerName={player.name}
                        playerGames={playerGames}
                        getPlayerName={getPlayerName}
                    />
                </Box>
            </Stack>
        </Box>
    );
}
