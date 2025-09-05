import { useGamesStore } from "../store/games";
import { usePlayersStore } from "../store/players";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";

export default function GamesList() {
    const games = useGamesStore((state) => state.games);
    const players = usePlayersStore((state) => state.players);

    const getPlayerName = (id: string) =>
        players.find((p) => p.id === id)?.name || "Unknown";

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Games
            </Typography>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Team A</TableCell>
                            <TableCell>Team B</TableCell>
                            <TableCell>Winner</TableCell>
                            <TableCell>Points Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {games
                            .slice()
                            .reverse()
                            .map((g) => (
                                <TableRow key={g.id}>
                                    <TableCell>
                                        {new Date(g.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{g.teamA.map(getPlayerName).join(", ")}</TableCell>
                                    <TableCell>{g.teamB.map(getPlayerName).join(", ")}</TableCell>
                                    <TableCell>
                                        {g.winnerTeam === "A"
                                            ? `Team A (${g.teamA.map(getPlayerName).join(", ")})`
                                            : `Team B (${g.teamB.map(getPlayerName).join(", ")})`}
                                    </TableCell>
                                    <TableCell>{g.pointsChange}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
