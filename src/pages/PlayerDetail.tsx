import { useParams } from "react-router-dom";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Stack,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Divider,
    Chip,
    LinearProgress,
    TableContainer,
    Breadcrumbs,
    Link as MUILink,
    Button,
    Tooltip,
} from "@mui/material";
// Using responsive Stack and CSS grid instead of MUI Grid to avoid type friction.
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { alpha } from "@mui/material/styles";

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
            games.filter(
                (g) => g.teamA.includes(playerId || "") || g.teamB.includes(playerId || "")
            ),
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
                <Typography variant="body2" color="text.secondary">
                    Check the URL or go back to the players list.
                </Typography>
            </Paper>
        );
    }

    const winRateNumber = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;
    const winRate = winRateNumber.toFixed(1);

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
    const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");

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
            <Breadcrumbs sx={{ mb: 2 }} aria-label="breadcrumb">
                <MUILink component={RouterLink} to="/">Dashboard</MUILink>
                <MUILink component={RouterLink} to="/players">Players</MUILink>
                <Typography color="text.primary">{player.name}</Typography>
            </Breadcrumbs>
            <Stack spacing={3} direction={{ xs: "column", md: "row" }}>
                <Box sx={{ width: { xs: "100%", md: 380 }, flexShrink: 0 }}>
                    <Card>
                        <CardHeader
                            avatar={<Avatar>{initial(player.name)}</Avatar>}
                            title={
                                <Typography variant="h5" fontWeight={700}>
                                    {player.name}
                                </Typography>
                            }
                            subheader={<Typography color="text.secondary">Player Overview</Typography>}
                        />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2}>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" },
                                    }}
                                >
                                    <Box>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                                            <Typography variant="overline" color="text.secondary">
                                                Rating
                                            </Typography>
                                            <Typography variant="h5" fontWeight={700}>
                                                {player.rating}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                    <Box>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                                            <Typography variant="overline" color="text.secondary">
                                                Games
                                            </Typography>
                                            <Typography variant="h5" fontWeight={700}>
                                                {player.gamesPlayed}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                    <Box>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                                            <Typography variant="overline" color="text.secondary">
                                                Wins
                                            </Typography>
                                            <Typography variant="h5" fontWeight={700} color="success.main">
                                                {player.wins}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                    <Box>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                                            <Typography variant="overline" color="text.secondary">
                                                Losses
                                            </Typography>
                                            <Typography variant="h5" fontWeight={700} color="error.main">
                                                {player.losses}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Box>

                                <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography variant="subtitle2">Win Rate</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {winRate}%
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={winRateNumber}
                                        sx={{ height: 8, borderRadius: 5 }}
                                    />
                                </Box>

                                <Divider>
                                    <Typography variant="overline" color="text.secondary">
                                        Highlights
                                    </Typography>
                                </Divider>

                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip
                                        avatar={<Avatar>{initial(mostPlayedWith?.name)}</Avatar>}
                                        label={`With: ${mostPlayedWith ? mostPlayedWith.name : "N/A"}`}
                                        component={mostPlayedWith ? RouterLink : "div"}
                                        to={mostPlayedWith ? `/players/${mostPlayedWith.id}` : undefined}
                                        clickable={!!mostPlayedWith}
                                        variant="outlined"
                                    />
                                    <Chip
                                        avatar={<Avatar>{initial(mostPlayedAgainst?.name)}</Avatar>}
                                        label={`Vs: ${mostPlayedAgainst ? mostPlayedAgainst.name : "N/A"}`}
                                        component={mostPlayedAgainst ? RouterLink : "div"}
                                        to={mostPlayedAgainst ? `/players/${mostPlayedAgainst.id}` : undefined}
                                        clickable={!!mostPlayedAgainst}
                                        variant="outlined"
                                    />
                                </Stack>

                                <Divider>
                                    <Typography variant="overline" color="text.secondary">
                                        Recent Form
                                    </Typography>
                                </Divider>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {form.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">No recent games</Typography>
                                    ) : (
                                        <>
                                            <Stack direction="row" spacing={0.5}>
                                                {form.map((r, idx) => (
                                                    <Chip key={idx} size="small" label={r} color={r === "W" ? "success" : "error"} variant="filled" />
                                                ))}
                                            </Stack>
                                            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                            <Tooltip title="Net rating change over last 5 games">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    {lastFiveDelta >= 0 ? (
                                                        <TrendingUpIcon color="success" fontSize="small" />
                                                    ) : (
                                                        <TrendingDownIcon color="error" fontSize="small" />
                                                    )}
                                                    <Typography fontWeight={700} color={lastFiveDelta >= 0 ? "success.main" : "error.main"}>
                                                        {lastFiveDelta >= 0 ? `+${lastFiveDelta}` : `${lastFiveDelta}`}
                                                    </Typography>
                                                </Stack>
                                            </Tooltip>
                                            {streakType && (
                                                <>
                                                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                                    <Chip size="small" label={`${streakLen} ${streakType === "W" ? "win" : "loss"} streak`} />
                                                </>
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
                            <Button component={RouterLink} to="/games/new" variant="outlined" size="small">
                                Record Match
                            </Button>
                            <Button component={RouterLink} to="/players" size="small">Back to Players</Button>
                        </CardActions>
                    </Card>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Game History</Typography>}
                            subheader={
                                <Typography variant="body2" color="text.secondary">
                                    {playerGames.length} {playerGames.length === 1 ? "match" : "matches"}
                                </Typography>
                            }
                        />
                        <Divider />
                        <CardContent sx={{ p: 0 }}>
                            <TableContainer sx={{ maxHeight: 480 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: 110 }}>Date</TableCell>
                                            <TableCell>Teammates</TableCell>
                                            <TableCell>Opponents</TableCell>
                                            <TableCell align="center">Result</TableCell>
                                            <TableCell align="right">Points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {playerGames.map((g) => {
                                            const playerInTeamA = g.teamA.includes(player.id);
                                            const playerTeam = playerInTeamA ? g.teamA : g.teamB;
                                            const opponentTeam = playerInTeamA ? g.teamB : g.teamA;

                                            const isWin =
                                                (g.winnerTeam === "A" && playerInTeamA) ||
                                                (g.winnerTeam === "B" && !playerInTeamA);

                                            const teammates = playerTeam.filter((id) => id !== player.id);
                                            const opponents = opponentTeam;

                                            const bg = alpha(isWin ? "#2e7d32" : "#d32f2f", 0.05);

                                            return (
                                                <TableRow key={g.id} hover sx={{ backgroundColor: bg }}>
                                                    <TableCell>{format(new Date(g.date), "MMM d, yyyy")}</TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                            {teammates.map((id) => (
                                                                <Chip
                                                                    key={id}
                                                                    size="small"
                                                                    avatar={<Avatar>{initial(getPlayerName(id))}</Avatar>}
                                                                    label={getPlayerName(id)}
                                                                    component={RouterLink}
                                                                    to={`/players/${id}`}
                                                                    clickable
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                            {opponents.map((id) => (
                                                                <Chip
                                                                    key={id}
                                                                    size="small"
                                                                    avatar={<Avatar>{initial(getPlayerName(id))}</Avatar>}
                                                                    label={getPlayerName(id)}
                                                                    component={RouterLink}
                                                                    to={`/players/${id}`}
                                                                    clickable
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            size="small"
                                                            label={isWin ? "Win" : "Loss"}
                                                            color={isWin ? "success" : "error"}
                                                            variant="filled"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography color={isWin ? "success.main" : "error.main"} fontWeight={600}>
                                                            {isWin ? `+${g.pointsChange}` : `-${g.pointsChange}`}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {playerGames.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Box sx={{ p: 3, textAlign: "center" }}>
                                                        <Typography>No games yet</Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            Record the first match for {player.name}.
                                                        </Typography>
                                                        <Button component={RouterLink} to="/games/new" variant="contained" size="small">
                                                            Record Match
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Stack>
        </Box>
    );
}
