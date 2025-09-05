import type {PropsWithChildren} from "react";
import { AppBar, Box, Container, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useUIStore } from "../store/ui";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Layout({ children }: PropsWithChildren) {
    const mode = useUIStore((state) => state.mode);
    const toggleMode = useUIStore((state) => state.toggleMode);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, mb: 2 }}>
                        Wuzzler
                    </Typography>
                    <Button color="inherit" component={RouterLink} to="/">Dashboard</Button>
                    <Button color="inherit" component={RouterLink} to="/players">Players</Button>
                    <Button color="inherit" component={RouterLink} to="/games">Games</Button>
                    <Button color="inherit" component={RouterLink} to="/games/new">New Game</Button>
                    <IconButton color="inherit" onClick={toggleMode}>
                        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 3, flex: 1 }}>{children}</Container>
        </Box>
    );
}
