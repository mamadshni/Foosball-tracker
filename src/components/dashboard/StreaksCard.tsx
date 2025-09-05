import { Avatar, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import type { Game, Player } from "../../types/models";
import { computeCurrentStreaks } from "../../lib/stats/dashboard";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  players: Player[];
  games: Game[];
  limit?: number;
}

export default function StreaksCard({ players, games, limit = 5 }: Props) {
  const streaks = computeCurrentStreaks(players, games);
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  const hot = players
    .map((p) => ({ p, s: streaks[p.id] }))
    .filter((x) => x.s.type === "W" && x.s.length > 1)
    .sort((a, b) => (b.s.length) - (a.s.length))
    .slice(0, limit);
  const cold = players
    .map((p) => ({ p, s: streaks[p.id] }))
    .filter((x) => x.s.type === "L" && x.s.length > 1)
    .sort((a, b) => (b.s.length) - (a.s.length))
    .slice(0, limit);

  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Streaks</Typography>} subheader={<Typography variant="body2" color="text.secondary">Who’s hot and cold (current)</Typography>} />
      <Divider />
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'flex-start' }}>
          <Stack flex={1} spacing={1}>
            <Typography variant="subtitle2" color="success.main">Hot Streaks</Typography>
            {hot.length === 0 && <Typography color="text.secondary">No active win streaks</Typography>}
            {hot.map(({ p, s }) => (
              <Stack key={p.id} direction="row" spacing={1} alignItems="center">
                <Avatar component={RouterLink} to={`/players/${p.id}`} sx={{ textDecoration: 'none' }}>{initial(p.name)}</Avatar>
                <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit' }}>{p.name}</Typography>
                <Typography color="success.main" fontWeight={700}>{`${s.length} W`}</Typography>
              </Stack>
            ))}
          </Stack>
          <Stack flex={1} spacing={1}>
            <Typography variant="subtitle2" color="error.main">Cold Streaks</Typography>
            {cold.length === 0 && <Typography color="text.secondary">No active losing streaks</Typography>}
            {cold.map(({ p, s }) => (
              <Stack key={p.id} direction="row" spacing={1} alignItems="center">
                <Avatar component={RouterLink} to={`/players/${p.id}`} sx={{ textDecoration: 'none' }}>{initial(p.name)}</Avatar>
                <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit' }}>{p.name}</Typography>
                <Typography color="error.main" fontWeight={700}>{`${s.length} L`}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
