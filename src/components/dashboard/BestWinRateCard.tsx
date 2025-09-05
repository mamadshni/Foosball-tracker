import { Avatar, Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import type { Player } from "../../types/models";
import { winRate } from "../../lib/stats/dashboard";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  players: Player[];
  minGames?: number;
  limit?: number;
}

export default function BestWinRateCard({ players, minGames = 10, limit = 5 }: Props) {
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  const ranked = players
    .filter((p) => p.gamesPlayed >= minGames)
    .map((p) => ({ p, wr: winRate(p) }))
    .sort((a, b) => (b.wr) - (a.wr))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Best Win Rate</Typography>} subheader={<Typography variant="body2" color="text.secondary">Min {minGames} games</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {ranked.map(({ p, wr }) => (
            <Stack key={p.id} direction="row" alignItems="center" spacing={1.5}>
              <Avatar component={RouterLink} to={`/players/${p.id}`}>{initial(p.name)}</Avatar>
              <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit' }}>{p.name}</Typography>
              <Chip size="small" label={`${Math.round(wr * 100)}%`} color={wr >= 0.5 ? 'success' : 'default'} />
            </Stack>
          ))}
          {ranked.length === 0 && (
            <Typography color="text.secondary">Not enough data yet</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
