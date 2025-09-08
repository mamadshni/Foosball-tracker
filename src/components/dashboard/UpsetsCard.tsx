import { Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import type { Game, Player } from "../../types/models";
import { recentUpsets, teamImpact } from "../../lib/stats/dashboard";
import TeamChips from "../games/TeamChips";
import { formatDate } from "../../lib/format/date";

interface Props {
  players: Player[];
  games: Game[];
  limit?: number;
}

export default function UpsetsCard({ players, games, limit = 5 }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name || "Unknown";
  const top = recentUpsets(games, limit);
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Biggest Impacts</Typography>} subheader={<Typography variant="body2" color="text.secondary">Top {limit} by rating swing</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {top.map((g) => (
            <Stack key={g.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
              <Typography color="text.secondary" sx={{ minWidth: 95 }}>{formatDate(g.date)}</Typography>
              <TeamChips ids={g.winnerTeam === 'A' ? g.teamA : g.teamB} getPlayerName={getName} winner />
              <Typography color="text.secondary">def.</Typography>
              <TeamChips ids={g.winnerTeam === 'A' ? g.teamB : g.teamA} getPlayerName={getName} winner={false} />
              <Typography ml="auto" fontWeight={700}>±{teamImpact(g)}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
