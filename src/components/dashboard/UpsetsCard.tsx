import { Box, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
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
        {top.map((g, idx) => {
          const winners = g.winnerTeam === 'A' ? g.teamA : g.teamB;
          const losers = g.winnerTeam === 'A' ? g.teamB : g.teamA;
          return (
            <Box
              key={g.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '84px 1fr 1fr auto', sm: '95px 1fr auto 1fr auto' },
                alignItems: 'center',
                columnGap: 1,
                rowGap: 1,
                py: 0.75,
                ...(idx > 0 ? { borderTop: '1px solid', borderColor: 'divider' } : {}),
              }}
            >
              <Typography color="text.secondary">{formatDate(g.date)}</Typography>
              <TeamChips ids={winners} getPlayerName={getName} winner />
              <Typography color="text.secondary" sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>def.</Typography>
              <TeamChips ids={losers} getPlayerName={getName} winner={false} />
              <Typography fontWeight={700} textAlign="right">±{teamImpact(g)}</Typography>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
