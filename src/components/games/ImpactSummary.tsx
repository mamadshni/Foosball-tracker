import { Stack, Typography } from "@mui/material";
import type { Game } from "../../types/models";
import { teamSumDelta } from "../../lib/game/utils";
import React from "react";

interface Props {
  game: Game;
}

function ImpactSummaryInner({ game }: Props) {
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

const ImpactSummary = React.memo(ImpactSummaryInner);
export default ImpactSummary;
