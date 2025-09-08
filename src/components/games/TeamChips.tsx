import { Stack } from "@mui/material";
import PlayerChip from "../common/PlayerChip";

interface Props {
  ids: string[];
  getPlayerName: (id: string) => string;
  deltaLookup?: (id: string) => number | undefined;
  winner?: boolean; // true = mark as winners (green), false = losers (red)
}

import React from "react";

function TeamChipsInner({ ids, getPlayerName, deltaLookup, winner }: Props) {
  const color = winner === undefined ? undefined : (winner ? "success" : "error");
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {ids.map((id) => (
        <PlayerChip
          key={id}
          id={id}
          name={getPlayerName(id)}
          delta={deltaLookup ? deltaLookup(id) : undefined}
          colorOverride={color}
        />
      ))}
    </Stack>
  );
}

const TeamChips = React.memo(TeamChipsInner);
export default TeamChips;
