import { Avatar, Card, CardContent, CardHeader, Chip, Divider, Stack, Typography } from "@mui/material";
import type { Game } from "../../types/models";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  games: Game[];
  getPlayerName: (id: string) => string;
  limit?: number;
}

export default function RecentGamesCard({ games, getPlayerName, limit = 5 }: Props) {
  const recent = games.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Recent Games</Typography>} />
      <Divider />
      <CardContent>
        <Stack spacing={1.5}>
          {recent.map((g) => (
            <Stack key={g.id} direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
              <Typography color="text.secondary" sx={{ minWidth: 95 }}>{new Date(g.date).toLocaleDateString()}</Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {(g.winnerTeam === 'A' ? g.teamA : g.teamB).map((id) => (
                  <Chip key={id} size="small" avatar={<Avatar>{initial(getPlayerName(id))}</Avatar>} label={getPlayerName(id)} component={RouterLink} to={`/players/${id}`} clickable variant="outlined" color="success" />
                ))}
              </Stack>
              <Typography color="text.secondary">def.</Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {(g.winnerTeam === 'A' ? g.teamB : g.teamA).map((id) => (
                  <Chip key={id} size="small" avatar={<Avatar>{initial(getPlayerName(id))}</Avatar>} label={getPlayerName(id)} component={RouterLink} to={`/players/${id}`} clickable variant="outlined" color="default" />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

