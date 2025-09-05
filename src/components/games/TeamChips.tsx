import { Stack } from "@mui/material";
import PlayerChip from "../common/PlayerChip";

interface Props {
  ids: string[];
  getPlayerName: (id: string) => string;
  deltaLookup?: (id: string) => number | undefined;
  winner?: boolean;
}

export default function TeamChips({ ids, getPlayerName, deltaLookup, winner }: Props) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {ids.map((id) => (
        <PlayerChip
          key={id}
          id={id}
          name={getPlayerName(id)}
          delta={deltaLookup ? deltaLookup(id) : undefined}
          colorOverride={deltaLookup ? undefined : (winner ? "success" : undefined)}
        />
      ))}
    </Stack>
  );
}

