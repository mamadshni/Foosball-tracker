import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Game } from "../../types/models";
import TeamChips from "./TeamChips";
import ImpactSummary from "./ImpactSummary";
import { formatDate } from "../../lib/format/date";

interface Props {
  games: Game[];
  getPlayerName: (id: string) => string;
}

export default function GamesTable({ games, getPlayerName }: Props) {
  const deltaLookup = (g: Game) => (id: string) => (g.perPlayerDeltas?.[id] ?? undefined);

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <TableContainer sx={{ overflow: 'hidden' }}>
        <Table
          size="small"
          stickyHeader
          aria-label="Games table"
          sx={{
            '& .MuiTableRow-root:last-of-type .MuiTableCell-root': { borderBottom: 0 },
          }}
        >
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
                <TableCell>{formatDate(g.date)}</TableCell>
                <TableCell>
                  <TeamChips ids={g.teamA} getPlayerName={getPlayerName} deltaLookup={deltaLookup(g)} winner={g.winnerTeam === 'A'} />
                </TableCell>
                <TableCell>
                  <TeamChips ids={g.teamB} getPlayerName={getPlayerName} deltaLookup={deltaLookup(g)} winner={g.winnerTeam === 'B'} />
                </TableCell>
                <TableCell align="center">
                  <Typography fontWeight={700}>{g.winnerTeam === "A" ? "Team A" : "Team B"}</Typography>
                </TableCell>
                <TableCell align="right"><ImpactSummary game={g} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
