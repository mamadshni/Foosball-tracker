import {
  Autocomplete,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useGamesViewStore } from "../../store/gamesView";
import type { Player } from "../../types/models";

interface Props {
  players: Player[];
}

export default function GamesFilterBar({ players }: Props) {
  const teamSize = useGamesViewStore((s) => s.teamSize);
  const setTeamSize = useGamesViewStore((s) => s.setTeamSize);
  const winner = useGamesViewStore((s) => s.winner);
  const setWinner = useGamesViewStore((s) => s.setWinner);
  const selectedPlayers = useGamesViewStore((s) => s.players);
  const setSelectedPlayers = useGamesViewStore((s) => s.setPlayers);
  const sortBy = useGamesViewStore((s) => s.sortBy);
  const setSortBy = useGamesViewStore((s) => s.setSortBy);
  const sortDir = useGamesViewStore((s) => s.sortDir);
  const setSortDir = useGamesViewStore((s) => s.setSortDir);
  const clear = useGamesViewStore((s) => s.clear);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <ToggleButtonGroup
          value={teamSize}
          exclusive
          onChange={(_, val) => val && setTeamSize(val)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="1v1">1v1</ToggleButton>
          <ToggleButton value="2v2">2v2</ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={winner}
          exclusive
          onChange={(_, val) => val && setWinner(val)}
          size="small"
        >
          <ToggleButton value="all">All Results</ToggleButton>
          <ToggleButton value="A">Team A</ToggleButton>
          <ToggleButton value="B">Team B</ToggleButton>
        </ToggleButtonGroup>

        <Autocomplete
          multiple
          options={players}
          getOptionLabel={(o) => o.name}
          value={players.filter((p) => selectedPlayers.includes(p.id))}
          onChange={(_, vals) => setSelectedPlayers(vals.map((v) => v.id))}
          size="small"
          renderInput={(params) => <TextField {...params} label="Filter by players" />}
          sx={{ minWidth: 260, flex: 1 }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <MenuItem value="date">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SortIcon fontSize="small" />
                  <span>Date</span>
                </Stack>
              </MenuItem>
              <MenuItem value="impact">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SortIcon fontSize="small" />
                  <span>Impact</span>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>
          <Tooltip title={sortDir === "desc" ? "Descending" : "Ascending"}>
            <IconButton aria-label="Toggle sort direction" onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}>
              <SwapVertIcon />
            </IconButton>
          </Tooltip>
          <Divider flexItem orientation="vertical" />
          <Chip label="Clear" onClick={clear} />
        </Stack>
      </Stack>
    </Paper>
  );
}
