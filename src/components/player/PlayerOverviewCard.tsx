import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Player } from "../../types/models";

interface Props {
  player: Player;
  winRateNumber: number;
  mostPlayedWith?: Player;
  mostPlayedAgainst?: Player;
  form: ("W" | "L")[];
  lastFiveDelta: number;
  streakType: "W" | "L" | null;
  streakLen: number;
}

const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");

export function PlayerOverviewCard({
  player,
  winRateNumber,
  mostPlayedWith,
  mostPlayedAgainst,
  form,
  lastFiveDelta,
  streakType,
  streakLen,
}: Props) {
  const winRate = winRateNumber.toFixed(1);

  return (
    <Card>
      <CardHeader
        sx={{ '& .MuiCardHeader-content': { minWidth: 0 } }}
        avatar={<Avatar>{initial(player.name)}</Avatar>}
        title={<Typography variant="h5" fontWeight={700} noWrap title={player.name} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</Typography>}
        subheader={<Typography color="text.secondary">Player Overview</Typography>}
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)" } }}>
            <Box>
              <StatTile label="Rating" value={player.rating} />
            </Box>
            <Box>
              <StatTile label="Games" value={player.gamesPlayed} />
            </Box>
            <Box>
              <StatTile label="Wins" value={player.wins} color="success.main" />
            </Box>
            <Box>
              <StatTile label="Losses" value={player.losses} color="error.main" />
            </Box>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
              <Typography variant="subtitle2">Win Rate</Typography>
              <Typography variant="body2" color="text.secondary">{winRate}%</Typography>
            </Stack>
            <LinearProgress variant="determinate" value={winRateNumber} sx={{ height: 8, borderRadius: 5 }} />
          </Box>

          <Divider>
            <Typography variant="overline" color="text.secondary">Highlights</Typography>
          </Divider>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              avatar={<Avatar>{initial(mostPlayedWith?.name)}</Avatar>}
              label={`With: ${mostPlayedWith ? mostPlayedWith.name : "N/A"}`}
              component={mostPlayedWith ? RouterLink : "div"}
              to={mostPlayedWith ? `/players/${mostPlayedWith.id}` : undefined}
              clickable={!!mostPlayedWith}
              variant="outlined"
              sx={{ '.MuiChip-label': { maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
            <Chip
              avatar={<Avatar>{initial(mostPlayedAgainst?.name)}</Avatar>}
              label={`Vs: ${mostPlayedAgainst ? mostPlayedAgainst.name : "N/A"}`}
              component={mostPlayedAgainst ? RouterLink : "div"}
              to={mostPlayedAgainst ? `/players/${mostPlayedAgainst.id}` : undefined}
              clickable={!!mostPlayedAgainst}
              variant="outlined"
              sx={{ '.MuiChip-label': { maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
          </Stack>

          <Divider>
            <Typography variant="overline" color="text.secondary">Recent Form</Typography>
          </Divider>
          <Stack direction="row" spacing={1} alignItems="center">
            {form.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No recent games</Typography>
            ) : (
              <>
                <Stack direction="row" spacing={0.5}>
                  {form.map((r, idx) => (
                    <Chip key={idx} size="small" label={r} color={r === "W" ? "success" : "error"} variant="filled" />
                  ))}
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Typography fontWeight={700} color={lastFiveDelta >= 0 ? "success.main" : "error.main"}>
                  {lastFiveDelta >= 0 ? `+${lastFiveDelta}` : `${lastFiveDelta}`}
                </Typography>
                {streakType && (
                  <>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <Chip size="small" label={`${streakLen} ${streakType === "W" ? "win" : "loss"} streak`} />
                  </>
                )}
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2, py: 1.5 }}>
        <Button component={RouterLink} to="/games/new" variant="outlined" size="small">
          Record Match
        </Button>
        <Button component={RouterLink} to="/players" size="small">Back to Players</Button>
      </CardActions>
    </Card>
  );
}

function StatTile({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="overline" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={color ? { color } : undefined}>
        {value}
      </Typography>
    </Paper>
  );
}
