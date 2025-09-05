import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useNavigate } from "react-router-dom";
import type { Player } from "../types/models";
import PlayersTable from "../components/players/PlayersTable";
import AddPlayerDialog from "../components/players/AddPlayerDialog";
import PlayersFilterBar from "../components/players/PlayersFilterBar";
import { usePlayersViewStore } from "../store/playersView";

export default function PlayersList() {
    const players = usePlayersStore((state) => state.players);
    const addPlayer = usePlayersStore((state) => state.addPlayer);

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const orderBy = usePlayersViewStore((s) => s.sortBy);
    const order = usePlayersViewStore((s) => s.sortDir);
    const setSortBy = usePlayersViewStore((s) => s.setSortBy);
    const setSortDir = usePlayersViewStore((s) => s.setSortDir);
    const search = usePlayersViewStore((s) => s.search);

    const handleAdd = (name: string) => addPlayer(name);

    const filtered = players.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    const sortedPlayers = [...filtered].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (field: keyof Player) => {
        if (orderBy === field) {
            setSortDir(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDir("asc");
        }
    };

    return (
        <Box>
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} sx={{ mb: 2 }}>
                <Typography variant="h4">Players</Typography>
            </Stack>

            <PlayersFilterBar onAddClick={() => setOpen(true)} />

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
