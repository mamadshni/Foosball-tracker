import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./app/theme";
import { AppRouter } from "./app/routes";
import { useUIStore } from "./store/ui";

function Root() {
    const mode = useUIStore((state) => state.mode);
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
