import { Avatar, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import type { Game, Player } from "../../types/models";
import { computeLastNDelta, computeLastNSeries } from "../../lib/stats/dashboard";
import SparklineMini from "../common/SparklineMini";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  players: Player[];
  games: Game[];
  n?: number;
  limit?: number;
}

export default function MostImprovedCard({ players, games, n = 5, limit = 5 }: Props) {
  const deltas = computeLastNDelta(games, n);
  const series = computeLastNSeries(games, n);
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  const ranked = players
    .map((p) => ({ p, d: deltas[p.id] ?? 0 }))
    .sort((a, b) => (b.d) - (a.d))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Most Improved</Typography>} subheader={<Typography variant="body2" color="text.secondary">Net rating change over last {n} games</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {ranked.map(({ p, d }) => {
            const s = series[p.id] ?? [];
            return (
              <Stack key={p.id} direction="row" alignItems="center" spacing={1.5}>
                <Avatar component={RouterLink} to={`/players/${p.id}`}>{initial(p.name)}</Avatar>
                <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit' }}>{p.name}</Typography>
                <SparklineMini data={s} />
                <Typography color={d >= 0 ? 'success.main' : 'error.main'} fontWeight={700} sx={{ minWidth: 46, textAlign: 'right' }}>{d >= 0 ? `+${d}` : d}</Typography>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
