import { useState, useMemo } from "react";
import {
    Box,
    Button,
    Typography,
    Autocomplete,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Paper,
    Stack,
    Chip,
} from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import type { Player } from "../types/models";

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
        alert("Game recorded!");
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                New Game
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" spacing={3}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Team A
                        </Typography>
                        <Autocomplete
                            multiple
                            options={optionsForTeamA}
                            getOptionLabel={(o) => o.name}
                            value={teamA}
                            onChange={(_, value) => handleTeamChange("A", value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={`Select Team A (${teamA.length}/${teamSizeLimit})`}
                                />
                            )}
                        />
                        {teamA.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                {teamA.map((p) => (
                                    <Chip
                                        key={p.id}
                                        label={p.name}
                                        onDelete={() => handleTeamChange("A", teamA.filter((x) => x.id !== p.id))}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Team B
                        </Typography>
                        <Autocomplete
                            multiple
                            options={optionsForTeamB}
                            getOptionLabel={(o) => o.name}
                            value={teamB}
                            onChange={(_, value) => handleTeamChange("B", value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={`Select Team B (${teamB.length}/${teamSizeLimit})`}
                                />
                            )}
                        />
                        {teamB.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                                {teamB.map((p) => (
                                    <Chip
                                        key={p.id}
                                        label={p.name}
                                        onDelete={() => handleTeamChange("B", teamB.filter((x) => x.id !== p.id))}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </Paper>

            {canSave && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Select Winning Team
                    </Typography>
                    <ToggleButtonGroup
                        exclusive
                        value={winnerTeam}
                        onChange={(_, val) => setWinnerTeam(val)}
                    >
                        <ToggleButton value="A" selected={winnerTeam === "A"}>
                            Team A
                        </ToggleButton>
                        <ToggleButton value="B" selected={winnerTeam === "B"}>
                            Team B
                        </ToggleButton>
                    </ToggleButtonGroup>
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
