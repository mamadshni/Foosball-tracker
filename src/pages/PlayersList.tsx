import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useNavigate } from "react-router-dom";
import type { Player } from "../types/models";
import PlayersTable from "../components/players/PlayersTable";
import AddPlayerDialog from "../components/players/AddPlayerDialog";

export default function PlayersList() {
    const players = usePlayersStore((state) => state.players);
    const addPlayer = usePlayersStore((state) => state.addPlayer);

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const [orderBy, setOrderBy] = useState<keyof Player>("rating");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const handleAdd = (name: string) => addPlayer(name);

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

            <PlayersTable
                players={sortedPlayers}
                orderBy={orderBy}
                order={order}
                onRequestSort={handleSort}
                onRowClick={(id) => navigate(`/players/${id}`)}
            />

            <AddPlayerDialog open={open} onClose={() => setOpen(false)} onAdd={handleAdd} />
        </Box>
    );
}
