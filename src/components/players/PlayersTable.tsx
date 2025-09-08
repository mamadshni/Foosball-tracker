import { Avatar, Chip, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Typography, Stack, TableSortLabel } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Player } from "../../types/models";

interface Props {
  players: Player[];
  orderBy: keyof Player;
  order: "asc" | "desc";
  onRequestSort: (field: keyof Player) => void;
}

export default function PlayersTable({ players, orderBy, order, onRequestSort }: Props) {
  const initial = (name: string) => (name ? name.charAt(0).toUpperCase() : "?");
  return (
    <TableContainer>
      <Table size="small" stickyHeader data-order={order} aria-label="Players table">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === 'name' ? order : false}>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => onRequestSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'rating' ? order : false}>
              <TableSortLabel
                active={orderBy === 'rating'}
                direction={orderBy === 'rating' ? order : 'desc'}
                onClick={() => onRequestSort('rating')}
              >
                Rating
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'gamesPlayed' ? order : false}>
              <TableSortLabel
                active={orderBy === 'gamesPlayed'}
                direction={orderBy === 'gamesPlayed' ? order : 'desc'}
                onClick={() => onRequestSort('gamesPlayed')}
              >
                Games
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'wins' ? order : false}>
              <TableSortLabel
                active={orderBy === 'wins'}
                direction={orderBy === 'wins' ? order : 'desc'}
                onClick={() => onRequestSort('wins')}
              >
                Wins
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === 'losses' ? order : false}>
              <TableSortLabel
                active={orderBy === 'losses'}
                direction={orderBy === 'losses' ? order : 'desc'}
                onClick={() => onRequestSort('losses')}
              >
                Losses
              </TableSortLabel>
            </TableCell>
            <TableCell>Win Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((p) => {
            const winRate = p.gamesPlayed > 0 ? Math.round((p.wins / p.gamesPlayed) * 100) : 0;
            return (
              <TableRow key={p.id} hover sx={{ cursor: "pointer" }}>
                <TableCell sx={{ maxWidth: 0 }}>
                  <Stack
                    component={RouterLink}
                    to={`/players/${p.id}`}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}
                  >
                    <Avatar>{initial(p.name)}</Avatar>
                    <Typography fontWeight={600} sx={{ minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={p.name}>
                      {p.name}
                    </Typography>
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
