import { Paper, Stack, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Button } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SortIcon from "@mui/icons-material/Sort";
import { usePlayersViewStore } from "../../store/playersView";

interface Props {
  onAddClick: () => void;
}

export default function PlayersFilterBar({ onAddClick }: Props) {
  const search = usePlayersViewStore((s) => s.search);
  const setSearch = usePlayersViewStore((s) => s.setSearch);
  const sortBy = usePlayersViewStore((s) => s.sortBy);
  const setSortBy = usePlayersViewStore((s) => s.setSortBy);
  const sortDir = usePlayersViewStore((s) => s.sortDir);
  const setSortDir = usePlayersViewStore((s) => s.setSortDir);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search players"
          size="small"
          sx={{ minWidth: 240, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="players-sort-by">Sort By</InputLabel>
          <Select
            labelId="players-sort-by"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <MenuItem value="name"><SortIcon fontSize="small" />&nbsp;Name</MenuItem>
            <MenuItem value="rating"><SortIcon fontSize="small" />&nbsp;Rating</MenuItem>
            <MenuItem value="gamesPlayed"><SortIcon fontSize="small" />&nbsp;Games</MenuItem>
            <MenuItem value="wins"><SortIcon fontSize="small" />&nbsp;Wins</MenuItem>
            <MenuItem value="losses"><SortIcon fontSize="small" />&nbsp;Losses</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title={sortDir === "desc" ? "Descending" : "Ascending"}>
          <IconButton aria-label="Toggle sort direction" onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}>
            <SwapVertIcon />
          </IconButton>
        </Tooltip>
        <Button variant="contained" onClick={onAddClick}>Add Player</Button>
      </Stack>
    </Paper>
  );
}
