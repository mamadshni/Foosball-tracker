import { useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, IconButton, useMediaQuery, Fade } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { usePlayersStore } from "../../store/players";
import { useGamesStore } from "../../store/games";
import type { Player } from "../../types/models";
import TeamSelector from "../new-game/TeamSelector";
import WinnerSelector from "../new-game/WinnerSelector";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddGameDialog({ open, onClose }: Props) {
  const players = usePlayersStore((s) => s.players);
  const addGame = useGamesStore((s) => s.addGame);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [winnerTeam, setWinnerTeam] = useState<"A" | "B" | null>(null);

  const teamSizeLimit = 2;

  const resetForm = () => {
    setTeamA([]);
    setTeamB([]);
    setWinnerTeam(null);
  };

  const unassigned = useMemo(
    () => players.filter((p) => !teamA.some((a) => a.id === p.id) && !teamB.some((b) => b.id === p.id)),
    [players, teamA, teamB]
  );

  const optionsForTeamA = useMemo(
    () => [...teamA, ...unassigned.filter((p) => !teamA.some((a) => a.id === p.id))],
    [teamA, unassigned]
  );
  const optionsForTeamB = useMemo(
    () => [...teamB, ...unassigned.filter((p) => !teamB.some((b) => b.id === p.id))],
    [teamB, unassigned]
  );

  const handleTeamChange = (team: "A" | "B", value: Player[]) => {
    const limited = value.slice(0, teamSizeLimit);
    if (team === "A") {
      const ids = new Set(limited.map((p) => p.id));
      setTeamA(limited);
      setTeamB((prev) => prev.filter((p) => !ids.has(p.id)));
    } else {
      const ids = new Set(limited.map((p) => p.id));
      setTeamB(limited);
      setTeamA((prev) => prev.filter((p) => !ids.has(p.id)));
    }
    setWinnerTeam(null);
  };

  const canSave =
    (teamA.length === 1 && teamB.length === 1) ||
    (teamA.length === 2 && teamB.length === 2);

  const handleSave = async () => {
    if (!canSave || !winnerTeam) return;
    await addGame({
      teamA: teamA.map((p) => p.id),
      teamB: teamB.map((p) => p.id),
      winnerTeam,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isSmall}
      maxWidth="md"
      aria-labelledby="add-game-title"
      keepMounted
      TransitionComponent={Fade}
      transitionDuration={{ enter: 160, exit: 120 }}
      TransitionProps={{ onExited: resetForm }}
      BackdropProps={{
        sx: {
          // No blur to avoid jank; higher alpha + subtle vignette for separation
          backgroundColor: alpha(theme.palette.background.default, 0.82),
          backgroundImage: `radial-gradient(1200px 800px at 50% 30%, ${alpha('#000', 0.25)}, transparent 65%)`,
        },
      }}
      PaperProps={{
        sx: {
          // Solid, high-contrast surface to avoid blending with background
          bgcolor: alpha(theme.palette.background.default, 0.92),
          backgroundImage: `linear-gradient(180deg, ${alpha('#ffffff', 0.06)}, ${alpha('#ffffff', 0.03)})`,
          border: `1px solid ${alpha('#ffffff', 0.22)}`,
          backdropFilter: 'none',
          boxShadow: `0 24px 60px ${alpha('#000', 0.55)}`,
          maxHeight: '90vh'
        },
      }}
    >
      <DialogTitle id="add-game-title" sx={{ display: 'flex', alignItems: 'center', pr: 6 }}>
        Add Game
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{ ml: 'auto' }}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 2 }}>
          <TeamSelector label="Team A" value={teamA} options={optionsForTeamA} limit={teamSizeLimit} onChange={(v) => handleTeamChange("A", v)} />
          <TeamSelector label="Team B" value={teamB} options={optionsForTeamB} limit={teamSizeLimit} onChange={(v) => handleTeamChange("B", v)} />
        </Stack>
        {canSave && <WinnerSelector value={winnerTeam} onChange={setWinnerTeam} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave || !winnerTeam}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
