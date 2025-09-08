import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./app/theme";
import { AppRouter } from "./app/routes";
import { useEffect } from "react";
import { usePlayersStore } from "./store/players";
import { useGamesStore } from "./store/games";
import "./app/global.css";

function Root() {
    const playersReady = usePlayersStore((s) => s.ready);
    const fetchPlayers = usePlayersStore((s) => s.fetchAll);
    const gamesReady = useGamesStore((s) => s.ready);
    const fetchGames = useGamesStore((s) => s.fetchAll);

    useEffect(() => {
        if (!playersReady) fetchPlayers();
        if (!gamesReady) fetchGames();
    }, [playersReady, gamesReady, fetchPlayers, fetchGames]);

    return (
        <ThemeProvider theme={theme} defaultMode="dark" modeStorageKey="wuzzler-mode">
            <CssBaseline enableColorScheme />
            <AppRouter />
        </ThemeProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
