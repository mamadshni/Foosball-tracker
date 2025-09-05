import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useNavigate } from "react-router-dom";
import type { Player } from "../types/models";

export default function PlayersList() {
    const players = usePlayersStore((state) => state.players);
    const addPlayer = usePlayersStore((state) => state.addPlayer);

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    const [orderBy, setOrderBy] = useState<keyof Player>("rating");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const handleAdd = () => {
        if (name.trim()) {
            addPlayer(name.trim());
            setName("");
            setOpen(false);
        }
    };

    const sortedPlayers = [...players].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (field: keyof Player) => {
        if (orderBy === field) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setOrderBy(field);
            setOrder("asc");
        }
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4">Players</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add Player
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            onClick={() => handleSort("name")}
                            sx={{ cursor: "pointer", fontWeight: orderBy === "name" ? "bold" : "normal" }}
                        >
                            Name
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("rating")}
                            sx={{ cursor: "pointer", fontWeight: orderBy === "rating" ? "bold" : "normal" }}
                        >
                            Rating
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("gamesPlayed")}
                            sx={{ cursor: "pointer", fontWeight: orderBy === "gamesPlayed" ? "bold" : "normal" }}
                        >
                            Games Played
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("wins")}
                            sx={{ cursor: "pointer", fontWeight: orderBy === "wins" ? "bold" : "normal" }}
                        >
                            Wins
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("losses")}
                            sx={{ cursor: "pointer", fontWeight: orderBy === "losses" ? "bold" : "normal" }}
                        >
                            Losses
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedPlayers.map((p) => (
                        <TableRow
                            key={p.id}
                            hover
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`/players/${p.id}`)}
                        >
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.rating}</TableCell>
                            <TableCell>{p.gamesPlayed}</TableCell>
                            <TableCell>{p.wins}</TableCell>
                            <TableCell>{p.losses}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Player</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Player Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
