import { alpha, Box, Card, CardContent, CardHeader, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Button, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import type { Game, PlayerId } from "../../types/models";
import PlayerChip from "../common/PlayerChip";

interface Props {
  playerId: PlayerId;
  playerName: string;
  playerGames: Game[];
  getPlayerName: (id: string) => string;
}


export function PlayerHistoryCard({ playerId, playerName, playerGames, getPlayerName }: Props) {
  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">Game History</Typography>}
        subheader={<Typography variant="body2" color="text.secondary">{playerGames.length} {playerGames.length === 1 ? "match" : "matches"}</Typography>}
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <TableContainer sx={{ maxHeight: { xs: '52vh', md: '64vh', lg: '70vh' } }}>
          <Table size="small" stickyHeader aria-label="Player game history">
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
                const playerInTeamA = g.teamA.includes(playerId);
                const playerTeam = playerInTeamA ? g.teamA : g.teamB;
                const opponentTeam = playerInTeamA ? g.teamB : g.teamA;
                const isWin = (g.winnerTeam === "A" && playerInTeamA) || (g.winnerTeam === "B" && !playerInTeamA);
                const teammates = playerTeam.filter((id) => id !== playerId);
                const opponents = opponentTeam;
                const bg = alpha(isWin ? "#2e7d32" : "#d32f2f", 0.05);

                return (
                  <TableRow key={g.id} hover sx={{ backgroundColor: bg }}>
                    <TableCell>{format(new Date(g.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {teammates.map((id) => (
                          <PlayerChip key={id} id={id} name={getPlayerName(id)} colorOverride={isWin ? "success" : "error"} maxWidth={140} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {opponents.map((id) => (
                          <PlayerChip key={id} id={id} name={getPlayerName(id)} colorOverride={isWin ? "error" : "success"} maxWidth={140} />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip size="small" label={isWin ? "Win" : "Loss"} color={isWin ? "success" : "error"} variant="filled" />
                    </TableCell>
                    <TableCell align="right">
                      {(() => {
                        const personal = g.perPlayerDeltas?.[playerId];
                        const delta = personal !== undefined ? personal : (isWin ? g.pointsChange : -g.pointsChange);
                        const positive = delta >= 0;
                        return (
                          <Typography color={positive ? "success.main" : "error.main"} fontWeight={600}>
                            {positive ? `+${Math.abs(delta)}` : `-${Math.abs(delta)}`}
                          </Typography>
                        );
                      })()}
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
                        Record the first match for {playerName}.
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
  );
}
