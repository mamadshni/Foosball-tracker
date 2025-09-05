import { Stack, Typography } from "@mui/material";
import type { Game } from "../../types/models";
import { teamSumDelta } from "../../lib/game/utils";

interface Props {
  game: Game;
}

export default function ImpactSummary({ game }: Props) {
  const winSum = teamSumDelta(game, game.winnerTeam);
  const loseSum = -winSum;
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Typography color="success.main" fontWeight={600}>{`+${Math.abs(winSum)}`}</Typography>
      <Typography color="text.secondary">/</Typography>
      <Typography color="error.main" fontWeight={600}>{`-${Math.abs(loseSum)}`}</Typography>
    </Stack>
  );
}

