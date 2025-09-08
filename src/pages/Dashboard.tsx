import { Box, Typography, Stack, Button } from "@mui/material";
import { usePlayersStore } from "../store/players";
import { useGamesStore } from "../store/games";
import { Link as RouterLink } from "react-router-dom";
import { usePlayersMap } from "../store/selectors";
import TopPlayersCard from "../components/dashboard/TopPlayersCard";
import RecentGamesCard from "../components/dashboard/RecentGamesCard";
import StreaksCard from "../components/dashboard/StreaksCard";
import UpsetsCard from "../components/dashboard/UpsetsCard";
import MostActiveCard from "../components/dashboard/MostActiveCard";
import BestWinRateCard from "../components/dashboard/BestWinRateCard";

export default function Dashboard() {
    const players = usePlayersStore((state) => state.players);
    const games = useGamesStore((state) => state.games);

    const playersMap = usePlayersMap();
    const getPlayerName = (id: string) => playersMap.get(id)?.name || "Unknown";

    return (
        <Box>
            <Typography variant="h4" gutterBottom className="text-gradient">
                Dashboard
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Button variant="contained" component={RouterLink} to="/games/new">
                    New Game
                </Button>
                <Button variant="outlined" component={RouterLink} to="/players">
                    View Players
                </Button>
            </Stack>

            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
                <TopPlayersCard players={players} />
                <RecentGamesCard games={games} getPlayerName={getPlayerName} />
                <StreaksCard players={players} games={games} />
                {/* <MostImprovedCard players={players} games={games} /> */}
                <MostActiveCard players={players} games={games} />
                <BestWinRateCard players={players} />
                <UpsetsCard players={players} games={games} />
            </Box>
        </Box>
    );
}
