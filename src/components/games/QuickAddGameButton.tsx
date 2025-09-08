import { Fragment, useState } from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import AddGameDialog from "./AddGameDialog";

interface Props {
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  color?: ButtonProps["color"];
  fullWidth?: boolean;
}

export default function QuickAddGameButton({ label = "Record Match", variant = "contained", size = "medium", color = "primary", fullWidth }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Button variant={variant} size={size} color={color} onClick={() => setOpen(true)} fullWidth={fullWidth} aria-label={label}>
        {label}
      </Button>
      <AddGameDialog open={open} onClose={() => setOpen(false)} />
    </Fragment>
  );
}
