import { useState, useMemo } from "react";
import { Box, Button, Typography, Paper, Stack } from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import type { Player } from "../types/models";
import TeamSelector from "../components/new-game/TeamSelector";
import WinnerSelector from "../components/new-game/WinnerSelector";

type WinnerTeam = "A" | "B" | null;

export default function NewGame() {
    const players = usePlayersStore((state) => state.players);
    const addGame = useGamesStore((state) => state.addGame);

    const [teamA, setTeamA] = useState<Player[]>([]);
    const [teamB, setTeamB] = useState<Player[]>([]);
    const [winnerTeam, setWinnerTeam] = useState<WinnerTeam>(null);

    const teamSizeLimit = 2; // supports 1v1 or 2v2

    // Players not yet assigned to any team
    const unassigned = useMemo(
        () =>
            players.filter(
                (p) => !teamA.some((a) => a.id === p.id) && !teamB.some((b) => b.id === p.id)
            ),
        [players, teamA, teamB]
    );

    // Allow current selection to remain visible in its Autocomplete options
    const optionsForTeamA = useMemo(
        () => [...teamA, ...unassigned.filter((p) => !teamA.some((a) => a.id === p.id))],
        [teamA, unassigned]
    );
    const optionsForTeamB = useMemo(
        () => [...teamB, ...unassigned.filter((p) => !teamB.some((b) => b.id === p.id))],
        [teamB, unassigned]
    );

    const handleTeamChange = (team: "A" | "B", value: Player[]) => {
        const limited = value.slice(0, teamSizeLimit);
        if (team === "A") {
            // Remove any A selections from B
            const ids = new Set(limited.map((p) => p.id));
            setTeamA(limited);
            setTeamB((prev) => prev.filter((p) => !ids.has(p.id)));
        } else {
            const ids = new Set(limited.map((p) => p.id));
            setTeamB(limited);
            setTeamA((prev) => prev.filter((p) => !ids.has(p.id)));
        }
        // Reset winner if teams change
        setWinnerTeam(null);
    };

    const canSave =
        (teamA.length === 1 && teamB.length === 1) ||
        (teamA.length === 2 && teamB.length === 2);

    const handleSubmit = () => {
        if (!canSave || !winnerTeam) {
            alert("Please select two balanced teams (1v1 or 2v2) and a winner.");
            return;
        }

        // NOTE: This changes the addGame payload to team-based.
        // We'll update the games store accordingly.
        addGame({
            teamA: teamA.map((p) => p.id),
            teamB: teamB.map((p) => p.id),
            winnerTeam, // "A" | "B"
        });

        setTeamA([]);
        setTeamB([]);
        setWinnerTeam(null);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="text-gradient">
                New Game
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <TeamSelector
                        label="Team A"
                        value={teamA}
                        options={optionsForTeamA}
                        limit={teamSizeLimit}
                        onChange={(value) => handleTeamChange("A", value)}
                    />
                    <TeamSelector
                        label="Team B"
                        value={teamB}
                        options={optionsForTeamB}
                        limit={teamSizeLimit}
                        onChange={(value) => handleTeamChange("B", value)}
                    />
                </Stack>
            </Paper>

            {canSave && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <WinnerSelector value={winnerTeam} onChange={setWinnerTeam} />
                </Paper>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!canSave || !winnerTeam}
            >
                Save Game
            </Button>
        </Box>
    );
}
