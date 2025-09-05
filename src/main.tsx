import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./app/theme";
import { AppRouter } from "./app/routes";
import { useUIStore } from "./store/ui";
import { useEffect } from "react";
import { usePlayersStore } from "./store/players";
import { useGamesStore } from "./store/games";

function Root() {
    const mode = useUIStore((state) => state.mode);
    const playersReady = usePlayersStore((s) => s.ready);
    const fetchPlayers = usePlayersStore((s) => s.fetchAll);
    const gamesReady = useGamesStore((s) => s.ready);
    const fetchGames = useGamesStore((s) => s.fetchAll);

    useEffect(() => {
        if (!playersReady) fetchPlayers();
        if (!gamesReady) fetchGames();
    }, [playersReady, gamesReady, fetchPlayers, fetchGames]);
    return (
        <ThemeProvider theme={getTheme(mode)}>
            <CssBaseline />
            <AppRouter />
        </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
