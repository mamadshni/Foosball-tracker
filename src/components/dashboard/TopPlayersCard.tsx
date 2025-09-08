import { Avatar, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Player } from "../../types/models";

interface Props {
  players: Player[];
  limit?: number;
}

export default function TopPlayersCard({ players, limit = 5 }: Props) {
  const top = players.slice().sort((a, b) => b.rating - a.rating).slice(0, limit);
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  return (
    <Card>
      <CardHeader title={<Typography variant="h6">Top Players</Typography>} />
      <Divider />
      <CardContent>
        <Stack>
          {top.map((p, idx) => (
            <Stack
              key={p.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                minWidth: 0,
                py: 0.75,
                ...(idx > 0 ? { borderTop: '1px solid', borderColor: 'divider' } : {}),
              }}
            >
              <Typography width={20} color="text.secondary">{idx + 1}</Typography>
              <Avatar component={RouterLink} to={`/players/${p.id}`} sx={{ textDecoration: 'none' }}>
                {initial(p.name)}
              </Avatar>
              <Typography component={RouterLink} to={`/players/${p.id}`} flex={1} fontWeight={600} sx={{ textDecoration: 'none', color: 'inherit', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.name}>
                {p.name}
              </Typography>
              <Typography fontWeight={700}>{p.rating}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
