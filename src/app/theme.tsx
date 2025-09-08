import { alpha, createTheme } from "@mui/material/styles";

const basePalette = {
  primary: { main: "#39e6d9" }, // teal
  secondary: { main: "#7c5cff" }, // violet
  success: { main: "#44d17e", contrastText: "#0b1020" },
  error: { main: "#ff6b6b", contrastText: "#0b1020" },
  warning: { main: "#f59e0b", contrastText: "#0b1020" },
  info: { main: "#60a5fa", contrastText: "#0b1020" },
};

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  defaultColorScheme: 'dark',
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        ...basePalette,
        background: { default: "#f7f8fb", paper: "#ffffff" },
        divider: alpha("#000", 0.08),
      },
    },
    dark: {
      palette: {
        mode: "dark",
        ...basePalette,
        background: { default: "#0b1020", paper: alpha("#0e162b", 0.6) },
        text: { primary: "#e6ecff", secondary: "#b8c6e8" },
        divider: alpha("#fff", 0.14),
        action: {
          disabled: "#9aa5bf",
          disabledBackground: "rgba(255,255,255,0.16)",
          disabledOpacity: 0.38,
        },
      },
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Ubuntu",
      "Cantarell",
      "'Helvetica Neue'",
      "Arial",
      "'Noto Sans'",
      "sans-serif",
    ].join(","),
    fontWeightBold: 700,
    h4: { fontWeight: 700, letterSpacing: -0.2 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: {
          color: themeParam.palette.mode === "dark" ? "#d7e1ff" : undefined,
        },
        a: {
          color: themeParam.palette.primary.main,
          textDecorationColor: alpha(themeParam.palette.primary.main, 0.5),
        },
      }),
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))"
              : "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))",
          border: `1px solid ${theme.palette.divider}`,
          backdropFilter: theme.palette.mode === "dark" ? "blur(10px)" : undefined,
        }),
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          overflow: "hidden",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: ({ theme }) => ({
          backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 800,
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: theme.palette.divider }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha("#0e162b", 0.7)
              : alpha("#ffffff", 0.7),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: { root: { minHeight: 64 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundImage:
            theme.palette.mode === "dark"
              ? `linear-gradient(180deg, ${alpha("#101938", 0.9)}, ${alpha("#0c122a", 0.9)})`
              : "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))",
          borderRight: `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(10px)",
        }),
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
        contained: ({ theme }) => ({
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: "#0b1020",
          '&:hover': {
            filter: "brightness(1.05)",
          },
          '&.Mui-disabled': {
            color: "#8fa0c7",
            backgroundColor: "rgba(255,255,255,0.18)",
            backgroundImage: "none",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: alpha(theme.palette.primary.main, 0.7),
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.mode === "dark" ? alpha("#ffffff", 0.06) : undefined,
          '&:hover': {
            backgroundColor: theme.palette.mode === "dark" ? alpha("#ffffff", 0.10) : undefined,
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-disabled': {
            borderColor: alpha("#ffffff", 0.24),
            color: "#9aa5bf",
          },
        }),
        text: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState, theme }: any) => ({
          ...(ownerState.color === 'default' && {
            backgroundColor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.12) : alpha('#000', 0.04),
            borderColor: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.20) : alpha('#000', 0.12),
          }),
        }),
        label: ({ ownerState, theme }: any) => ({
          ...(ownerState.color === 'default' && {
            color: theme.palette.mode === 'dark' ? '#e6ecff' : undefined,
          }),
        }),
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? alpha("#ffffff", 0.08) : alpha('#000', 0.04),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.mode === "dark" ? alpha("#ffffff", 0.06) : undefined,
        }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.mode === "dark" ? alpha("#e6ecff", 0.9) : undefined,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? alpha("#0e162b", 0.9) : alpha('#ffffff', 0.98),
          backdropFilter: "blur(8px)",
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({ borderRadius: 999, padding: 2, border: `1px solid ${theme.palette.divider}` }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: 0,
          borderRadius: 999,
          '&.Mui-selected': {
            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.32)}, ${alpha(theme.palette.secondary.main, 0.32)})`,
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
  },
});
