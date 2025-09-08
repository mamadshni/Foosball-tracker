import { Avatar, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import type { Game, Player } from "../../types/models";
import { computeActivityLastDays } from "../../lib/stats/dashboard";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  players: Player[];
  games: Game[];
  days?: number;
  limit?: number;
}

export default function MostActiveCard({ players, games, days = 14, limit = 5 }: Props) {
  const counts = computeActivityLastDays(games, days);
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  const ranked = players
    .map((p) => ({ p, c: counts[p.id] ?? 0 }))
    .sort((a, b) => (b.c) - (a.c))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Most Active (last {days} days)</Typography>} />
      <Divider />
      <CardContent>
        <Stack>
          {ranked.map(({ p, c }, idx) => (
            <Stack key={p.id} direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0, py: 0.75, ...(idx > 0 ? { borderTop: '1px solid', borderColor: 'divider' } : {}) }}>
              <Avatar component={RouterLink} to={`/players/${p.id}`} sx={{ textDecoration: 'none' }}>{initial(p.name)}</Avatar>
              <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={p.name}>{p.name}</Typography>
              <Typography color="text.secondary">{c} games</Typography>
            </Stack>
          ))}
          {ranked.length === 0 && (
            <Typography color="text.secondary">No games in the last {days} days</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
