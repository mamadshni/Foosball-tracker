import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

type WinnerTeam = "A" | "B" | null;

interface Props {
  value: WinnerTeam;
  onChange: (value: WinnerTeam) => void;
}

export default function WinnerSelector({ value, onChange }: Props) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Select Winning Team</Typography>
      <ToggleButtonGroup exclusive value={value} onChange={(_, val) => onChange(val)}>
        <ToggleButton value="A" selected={value === "A"}>Team A</ToggleButton>
        <ToggleButton value="B" selected={value === "B"}>Team B</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}

