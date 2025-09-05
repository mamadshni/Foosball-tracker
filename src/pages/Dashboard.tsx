import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Stack,
} from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import { Link as RouterLink } from "react-router-dom";

export default function Dashboard() {
    const players = usePlayersStore((state) => state.players);
    const games = useGamesStore((state) => state.games);

    const topPlayers = [...players]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    const recentGames = [...games]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const getPlayerName = (id: string) =>
        players.find((p) => p.id === id)?.name || "Unknown";

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" component={RouterLink} to="/games/new">
                    New Game
                </Button>
                <Button variant="outlined" component={RouterLink} to="/players">
                    View Players
                </Button>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                {/* Top Players */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Top Players
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Rating</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topPlayers.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                {/* Recent Games */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Games
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Winners</TableCell>
                                <TableCell>Losers</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentGames.map((g) => {
                                const winners =
                                    g.winnerTeam === "A"
                                        ? g.teamA.map(getPlayerName)
                                        : g.teamB.map(getPlayerName);
                                const losers =
                                    g.winnerTeam === "A"
                                        ? g.teamB.map(getPlayerName)
                                        : g.teamA.map(getPlayerName);

                                return (
                                    <TableRow key={g.id}>
                                        <TableCell>
                                            {new Date(g.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{winners.join(", ")}</TableCell>
                                        <TableCell>{losers.join(", ")}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>
        </Box>
    );
}
