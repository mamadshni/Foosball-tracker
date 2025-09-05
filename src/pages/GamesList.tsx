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
    Chip,
    Avatar,
    Stack,
    TableContainer,
    ToggleButtonGroup,
    ToggleButton,
    Autocomplete,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";
import type { Game } from "../types/models";
import { Link as RouterLink } from "react-router-dom";
import { useGamesViewStore } from "../store/gamesView";
import SortIcon from "@mui/icons-material/Sort";
import SwapVertIcon from "@mui/icons-material/SwapVert";

export default function GamesList() {
    const games = useGamesStore((state) => state.games);
    const players = usePlayersStore((state) => state.players);
    const teamSize = useGamesViewStore((s) => s.teamSize);
    const setTeamSize = useGamesViewStore((s) => s.setTeamSize);
    const winner = useGamesViewStore((s) => s.winner);
    const setWinner = useGamesViewStore((s) => s.setWinner);
    const selectedPlayers = useGamesViewStore((s) => s.players);
    const setSelectedPlayers = useGamesViewStore((s) => s.setPlayers);
    const sortBy = useGamesViewStore((s) => s.sortBy);
    const setSortBy = useGamesViewStore((s) => s.setSortBy);
    const sortDir = useGamesViewStore((s) => s.sortDir);
    const setSortDir = useGamesViewStore((s) => s.setSortDir);
    const clear = useGamesViewStore((s) => s.clear);

    const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || "Unknown";
    const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");

    const playerDelta = (g: Game, id: string) => {
        const d = g.perPlayerDeltas?.[id];
        return typeof d === "number" ? d : undefined;
    };

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
            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                    <ToggleButtonGroup
                        value={teamSize}
                        exclusive
                        onChange={(_, val) => val && setTeamSize(val)}
                        size="small"
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="1v1">1v1</ToggleButton>
                        <ToggleButton value="2v2">2v2</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                        value={winner}
                        exclusive
                        onChange={(_, val) => val && setWinner(val)}
                        size="small"
                    >
                        <ToggleButton value="all">All Results</ToggleButton>
                        <ToggleButton value="A">Team A</ToggleButton>
                        <ToggleButton value="B">Team B</ToggleButton>
                    </ToggleButtonGroup>

                    <Autocomplete
                        multiple
                        options={players}
                        getOptionLabel={(o) => o.name}
                        value={players.filter((p) => selectedPlayers.includes(p.id))}
                        onChange={(_, vals) => setSelectedPlayers(vals.map((v) => v.id))}
                        size="small"
                        renderInput={(params) => <TextField {...params} label="Filter by players" />}
                        sx={{ minWidth: 260, flex: 1 }}
                    />

                    <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel id="sort-by-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                label="Sort By"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <MenuItem value="date">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <SortIcon fontSize="small" />
                                        <span>Date</span>
                                    </Stack>
                                </MenuItem>
                                <MenuItem value="impact">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <SortIcon fontSize="small" />
                                        <span>Impact</span>
                                    </Stack>
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Tooltip title={sortDir === "desc" ? "Descending" : "Ascending"}>
                            <IconButton onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}>
                                <SwapVertIcon />
                            </IconButton>
                        </Tooltip>
                        <Divider flexItem orientation="vertical" />
                        <Chip label="Clear" onClick={clear} />
                    </Stack>
                </Stack>
            </Paper>
            <Paper>
                <TableContainer>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Team A</TableCell>
                            <TableCell>Team B</TableCell>
                            <TableCell align="center">Winner</TableCell>
                            <TableCell align="right">Impact</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted
                            .map((g) => (
                                <TableRow key={g.id}>
                                    <TableCell>
                                        {new Date(g.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {g.teamA.map((id) => {
                                                const name = getPlayerName(id);
                                                const d = playerDelta(g, id);
                                                const label = d === undefined ? name : `${name} (${d >= 0 ? "+" : ""}${d})`;
                                                return (
                                                    <Chip
                                                        key={id}
                                                        size="small"
                                                        avatar={<Avatar>{initial(name)}</Avatar>}
                                                        label={label}
                                                        component={RouterLink}
                                                        to={`/players/${id}`}
                                                        clickable
                                                        variant="outlined"
                                                        color={d !== undefined ? (d >= 0 ? "success" : "error") : undefined}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                            {g.teamB.map((id) => {
                                                const name = getPlayerName(id);
                                                const d = playerDelta(g, id);
                                                const label = d === undefined ? name : `${name} (${d >= 0 ? "+" : ""}${d})`;
                                                return (
                                                    <Chip
                                                        key={id}
                                                        size="small"
                                                        avatar={<Avatar>{initial(name)}</Avatar>}
                                                        label={label}
                                                        component={RouterLink}
                                                        to={`/players/${id}`}
                                                        clickable
                                                        variant="outlined"
                                                        color={d !== undefined ? (d >= 0 ? "success" : "error") : undefined}
                                                    />
                                                );
                                            })}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            size="small"
                                            label={g.winnerTeam === "A" ? "Team A" : "Team B"}
                                            color="primary"
                                            variant="filled"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {(() => {
                                            const winSum = teamSumDelta(g, g.winnerTeam);
                                            const loseSum = -winSum; // closed system
                                            return (
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <Typography color="success.main" fontWeight={600}>{`+${Math.abs(winSum)}`}</Typography>
                                                    <Typography color="text.secondary">/</Typography>
                                                    <Typography color="error.main" fontWeight={600}>{`-${Math.abs(loseSum)}`}</Typography>
                                                </Stack>
                                            );
                                        })()}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
