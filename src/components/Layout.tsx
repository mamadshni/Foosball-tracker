import type { PropsWithChildren } from "react";
import {
  AppBar,
  Box,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  Stack,
  Container,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

const drawerWidth = 80;

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: <DashboardRoundedIcon /> },
  { label: "Players", to: "/players", icon: <GroupRoundedIcon /> },
  { label: "Games", to: "/games", icon: <TableRowsRoundedIcon /> },
];

export default function Layout({ children }: PropsWithChildren) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const drawer = (
    <Box height="100%" display="flex" flexDirection="column">
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: 72 }}>
        <Typography variant="h6" fontWeight={800} className="text-gradient">
          W
        </Typography>
      </Stack>
      <Divider />
      <List sx={{ py: 2, flex: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <Tooltip key={item.to} title={item.label} placement="right">
              <ListItemButton
                component={RouterLink}
                to={item.to}
                selected={selected}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
                    border: `1px solid ${theme.palette.primary.main}55`,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: selected ? "primary.main" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ display: "none" }} />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      <Divider />
      {/* Theme toggle at the bottom of the drawer */}
      {/* <Box sx={{ p: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={mode === 'light' || mode === 'dark' ? mode : 'light'}
          onChange={(_, v) => {
            if (v && v !== mode) setMode(v);
          }}
          aria-label="Theme mode"
        >
          <ToggleButton value="light" aria-label="Light mode">
            <LightModeRoundedIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark mode">
            <DarkModeRoundedIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box> */}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {/* Side Navigation */}
      {isMdUp ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile top bar with burger */}
      {!isMdUp && (
        <AppBar position="fixed" color="transparent" enableColorOnDark>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>Wuzzler</Typography>
            {/* <Box sx={{ ml: "auto" }}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={mode === 'light' || mode === 'dark' ? mode : 'light'}
                onChange={(_, v) => {
                  if (v && v !== mode) setMode(v);
                }}
                aria-label="Theme mode"
              >
                <ToggleButton value="light" aria-label="Light mode">
                  <LightModeRoundedIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="Dark mode">
                  <DarkModeRoundedIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box> */}
          </Toolbar>
        </AppBar>
      )}

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, pl: { xs: 0, md: `${drawerWidth}px` } }}>
        {!isMdUp && <Toolbar />}
        <Container sx={{ py: 3 }}>{children}</Container>
      </Box>
    </Box>
  );
}
