import { Avatar, Chip, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Typography, Stack } from "@mui/material";
import type { Player } from "../../types/models";

interface Props {
  players: Player[];
  orderBy: keyof Player;
  order: "asc" | "desc";
  onRequestSort: (field: keyof Player) => void;
  onRowClick: (id: string) => void;
}

export default function PlayersTable({ players, orderBy, order, onRequestSort, onRowClick }: Props) {
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  return (
    <TableContainer>
      <Table size="small" stickyHeader data-order={order}>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => onRequestSort("name")} sx={{ cursor: "pointer", fontWeight: orderBy === "name" ? "bold" : "normal" }}>
              Name
            </TableCell>
            <TableCell onClick={() => onRequestSort("rating")} sx={{ cursor: "pointer", fontWeight: orderBy === "rating" ? "bold" : "normal" }}>
              Rating
            </TableCell>
            <TableCell onClick={() => onRequestSort("gamesPlayed")} sx={{ cursor: "pointer", fontWeight: orderBy === "gamesPlayed" ? "bold" : "normal" }}>
              Games
            </TableCell>
            <TableCell onClick={() => onRequestSort("wins")} sx={{ cursor: "pointer", fontWeight: orderBy === "wins" ? "bold" : "normal" }}>
              Wins
            </TableCell>
            <TableCell onClick={() => onRequestSort("losses")} sx={{ cursor: "pointer", fontWeight: orderBy === "losses" ? "bold" : "normal" }}>
              Losses
            </TableCell>
            <TableCell>Win Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((p) => {
            const winRate = p.gamesPlayed > 0 ? Math.round((p.wins / p.gamesPlayed) * 100) : 0;
            return (
              <TableRow key={p.id} hover sx={{ cursor: "pointer" }} onClick={() => onRowClick(p.id)}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar>{initial(p.name)}</Avatar>
                    <Typography fontWeight={600}>{p.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={700}>{p.rating}</Typography>
                </TableCell>
                <TableCell>{p.gamesPlayed}</TableCell>
                <TableCell>{p.wins}</TableCell>
                <TableCell>{p.losses}</TableCell>
                <TableCell>
                  <Chip size="small" label={`${winRate}%`} color={winRate >= 50 ? "success" : "default"} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
