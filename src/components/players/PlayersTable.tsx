import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Player } from "../../types/models";

interface Props {
  players: Player[];
  orderBy: keyof Player;
  order: "asc" | "desc";
  onRequestSort: (field: keyof Player) => void;
  onRowClick: (id: string) => void;
}

export default function PlayersTable({ players, orderBy, order, onRequestSort, onRowClick }: Props) {
  return (
    <Table data-order={order}>
      <TableHead>
        <TableRow>
          <TableCell onClick={() => onRequestSort("name")} sx={{ cursor: "pointer", fontWeight: orderBy === "name" ? "bold" : "normal" }}>
            Name
          </TableCell>
          <TableCell onClick={() => onRequestSort("rating")} sx={{ cursor: "pointer", fontWeight: orderBy === "rating" ? "bold" : "normal" }}>
            Rating
          </TableCell>
          <TableCell onClick={() => onRequestSort("gamesPlayed")} sx={{ cursor: "pointer", fontWeight: orderBy === "gamesPlayed" ? "bold" : "normal" }}>
            Games Played
          </TableCell>
          <TableCell onClick={() => onRequestSort("wins")} sx={{ cursor: "pointer", fontWeight: orderBy === "wins" ? "bold" : "normal" }}>
            Wins
          </TableCell>
          <TableCell onClick={() => onRequestSort("losses")} sx={{ cursor: "pointer", fontWeight: orderBy === "losses" ? "bold" : "normal" }}>
            Losses
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {players.map((p) => (
          <TableRow key={p.id} hover sx={{ cursor: "pointer" }} onClick={() => onRowClick(p.id)}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.rating}</TableCell>
            <TableCell>{p.gamesPlayed}</TableCell>
            <TableCell>{p.wins}</TableCell>
            <TableCell>{p.losses}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
