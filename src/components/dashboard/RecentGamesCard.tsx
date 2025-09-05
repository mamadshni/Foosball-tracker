import { Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import type { Game } from "../../types/models";
import TeamChips from "../games/TeamChips";
import { formatDate } from "../../lib/format/date";

interface Props {
  games: Game[];
  getPlayerName: (id: string) => string;
  limit?: number;
}

export default function RecentGamesCard({ games, getPlayerName, limit = 5 }: Props) {
  const recent = games.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Recent Games</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {recent.map((g) => (
            <Stack key={g.id} direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
              <Typography color="text.secondary" sx={{ minWidth: 95 }}>{formatDate(g.date)}</Typography>
              <TeamChips ids={g.winnerTeam === 'A' ? g.teamA : g.teamB} getPlayerName={getPlayerName} winner />
              <Typography color="text.secondary">def.</Typography>
              <TeamChips ids={g.winnerTeam === 'A' ? g.teamB : g.teamA} getPlayerName={getPlayerName} />
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
