import { Avatar, Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import type { Game, Player } from "../../types/models";
import { recentUpsets, teamImpact } from "../../lib/stats/dashboard";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  players: Player[];
  games: Game[];
  limit?: number;
}

export default function UpsetsCard({ players, games, limit = 5 }: Props) {
  const getName = (id: string) => players.find((p) => p.id === id)?.name || "Unknown";
  const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");
  const top = recentUpsets(games, limit);
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Biggest Impacts</Typography>} subheader={<Typography variant="body2" color="text.secondary">Top {limit} by rating swing</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {top.map((g) => (
            <Stack key={g.id} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
              <Typography color="text.secondary" sx={{ minWidth: 95 }}>{new Date(g.date).toLocaleDateString()}</Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {(g.winnerTeam === 'A' ? g.teamA : g.teamB).map((id) => (
                  <Chip key={id} size="small" avatar={<Avatar>{initial(getName(id))}</Avatar>} label={getName(id)} component={RouterLink} to={`/players/${id}`} clickable variant="outlined" color="success" />
                ))}
              </Stack>
              <Typography color="text.secondary">def.</Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {(g.winnerTeam === 'A' ? g.teamB : g.teamA).map((id) => (
                  <Chip key={id} size="small" avatar={<Avatar>{initial(getName(id))}</Avatar>} label={getName(id)} component={RouterLink} to={`/players/${id}`} clickable variant="outlined" />
                ))}
              </Stack>
              <Typography ml="auto" fontWeight={700}>±{teamImpact(g)}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

