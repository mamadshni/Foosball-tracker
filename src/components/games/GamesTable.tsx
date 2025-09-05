import {
  Avatar,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Game } from "../../types/models";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  games: Game[];
  getPlayerName: (id: string) => string;
}

export default function GamesTable({ games, getPlayerName }: Props) {
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
    const isWinner = g.winnerTeam === team;
    return isWinner ? g.pointsChange : -g.pointsChange;
  };

  return (
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
            {games.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{new Date(g.date).toLocaleDateString()}</TableCell>
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
                  <Chip size="small" label={g.winnerTeam === "A" ? "Team A" : "Team B"} color="primary" variant="filled" />
                </TableCell>
                <TableCell align="right">
                  {(() => {
                    const winSum = teamSumDelta(g, g.winnerTeam);
                    const loseSum = -winSum;
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
  );
}

