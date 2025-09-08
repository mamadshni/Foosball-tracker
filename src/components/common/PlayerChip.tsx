import { Avatar, Chip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  id: string;
  name: string;
  delta?: number;
  size?: "small" | "medium";
  variant?: "outlined" | "filled";
  showAvatar?: boolean;
  colorOverride?: "default" | "success" | "error";
}

const initial = (name?: string) => (name ? name.charAt(0).toUpperCase() : "?");

function PlayerChipInner({ id, name, delta, size = "small", variant = "outlined", showAvatar = true, colorOverride }: Props) {
  const theme = useTheme();
  const hasDelta = typeof delta === "number";
  const positive = (delta ?? 0) >= 0;
  const label = hasDelta ? `${name} (${positive ? "+" : ""}${delta})` : name;
  // For explicit winner/loser tags, tint to match theme rather than strong red/green
  const tone = colorOverride
    ? (colorOverride === "success" ? theme.palette.success.main : theme.palette.error.main)
    : undefined;
  const color = colorOverride ? undefined : (hasDelta ? (positive ? "success" : "error") : undefined);
  const resolvedVariant = variant; // keep outlined look; tint via sx below when colorOverride is set
  const sx = colorOverride
    ? {
        backgroundColor: alpha(tone!, 0.25),
        borderColor: alpha(tone!, 0.5),
        color: theme.palette.text.primary,
      }
    : undefined;
  return (
    <Chip
      size={size}
      avatar={showAvatar ? <Avatar>{initial(name)}</Avatar> : undefined}
      label={label}
      component={RouterLink}
      to={`/players/${id}`}
      clickable
      variant={resolvedVariant}
      color={color as any}
      sx={sx}
    />
  );
}

import React from "react";
const PlayerChip = React.memo(PlayerChipInner);
export default PlayerChip;
