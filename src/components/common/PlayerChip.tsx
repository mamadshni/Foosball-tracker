import { Avatar, Chip } from "@mui/material";
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

export default function PlayerChip({ id, name, delta, size = "small", variant = "outlined", showAvatar = true, colorOverride }: Props) {
  const hasDelta = typeof delta === "number";
  const positive = (delta ?? 0) >= 0;
  const label = hasDelta ? `${name} (${positive ? "+" : ""}${delta})` : name;
  const color = colorOverride ?? (hasDelta ? (positive ? "success" : "error") : undefined);
  return (
    <Chip
      size={size}
      avatar={showAvatar ? <Avatar>{initial(name)}</Avatar> : undefined}
      label={label}
      component={RouterLink}
      to={`/players/${id}`}
      clickable
      variant={variant}
      color={color as any}
    />
  );
}

