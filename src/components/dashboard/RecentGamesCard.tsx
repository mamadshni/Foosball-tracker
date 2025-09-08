import { Box, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
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
        {recent.map((g, idx) => {
          const winners = g.winnerTeam === 'A' ? g.teamA : g.teamB;
          const losers = g.winnerTeam === 'A' ? g.teamB : g.teamA;
          return (
            <Box
              key={g.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '84px 1fr 1fr', sm: '95px 1fr auto 1fr' },
                alignItems: 'center',
                columnGap: 1,
                rowGap: 1,
                py: 0.75,
                ...(idx > 0 ? { borderTop: '1px solid', borderColor: 'divider' } : {}),
              }}
            >
              <Typography color="text.secondary">{formatDate(g.date)}</Typography>
              <TeamChips ids={winners} getPlayerName={getPlayerName} winner />
              <Typography color="text.secondary" sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>def.</Typography>
              <TeamChips ids={losers} getPlayerName={getPlayerName} winner={false} />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
