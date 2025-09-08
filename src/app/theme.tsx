import { alpha, createTheme } from "@mui/material/styles";

const basePalette = {
  primary: { main: "#39e6d9" }, // teal
  secondary: { main: "#7c5cff" }, // violet
  success: { main: "#44d17e", contrastText: "#0b1020" },
  error: { main: "#ff6b6b", contrastText: "#0b1020" },
  warning: { main: "#f59e0b", contrastText: "#0b1020" },
  info: { main: "#60a5fa", contrastText: "#0b1020" },
};

export const getTheme = (mode: "light" | "dark") => {
  const dark = mode === "dark";
  const bgDefault = dark ? "#0b1020" : "#f7f8fb";
  const bgPaper = dark ? alpha("#0e162b", 0.6) : "#ffffff";
  const border = dark ? alpha("#ffffff", 0.14) : alpha("#000", 0.08);

  return createTheme({
    palette: {
      mode,
      ...basePalette,
      background: {
        default: bgDefault,
        paper: bgPaper,
      },
      text: dark
        ? { primary: "#e6ecff", secondary: "#b8c6e8" }
        : undefined,
      divider: border,
      action: dark
        ? {
            disabled: "#9aa5bf",
            disabledBackground: "rgba(255,255,255,0.16)",
            disabledOpacity: 0.38,
          }
        : undefined,
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
        styleOverrides: {
          body: {
            color: dark ? "#d7e1ff" : undefined,
          },
          a: {
            color: basePalette.primary.main,
            textDecorationColor: alpha(basePalette.primary.main, 0.5),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: dark
              ? "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))"
              : undefined,
            border: `1px solid ${border}`,
            backdropFilter: dark ? "blur(10px)" : undefined,
          },
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
          title: {
            backgroundImage: `linear-gradient(90deg, ${basePalette.primary.main}, ${basePalette.secondary.main})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: border },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: dark
              ? alpha("#0e162b", 0.7)
              : alpha("#ffffff", 0.7),
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${border}`,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: { root: { minHeight: 64 } },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: dark
              ? `linear-gradient(180deg, ${alpha("#101938", 0.9)}, ${alpha("#0c122a", 0.9)})`
              : undefined,
            borderRight: `1px solid ${border}`,
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 18,
          },
          contained: {
            backgroundImage: `linear-gradient(135deg, ${basePalette.primary.main}, ${basePalette.secondary.main})`,
            color: "#0b1020",
            '&:hover': {
              filter: "brightness(1.05)",
            },
            '&.Mui-disabled': {
              color: "#8fa0c7",
              backgroundColor: "rgba(255,255,255,0.18)",
              backgroundImage: "none",
            },
          },
          outlined: {
            borderColor: alpha(basePalette.primary.main, 0.7),
            color: basePalette.primary.main,
            backgroundColor: dark ? alpha("#ffffff", 0.06) : undefined,
            '&:hover': {
              backgroundColor: dark ? alpha("#ffffff", 0.10) : undefined,
              borderColor: basePalette.primary.main,
            },
            '&.Mui-disabled': {
              borderColor: alpha("#ffffff", 0.24),
              color: "#9aa5bf",
            },
          },
          text: {
            color: basePalette.primary.main,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ ownerState }: any) => ({
            ...(ownerState.color === 'default' && {
              backgroundColor: dark ? alpha('#ffffff', 0.12) : undefined,
              borderColor: dark ? alpha('#ffffff', 0.20) : undefined,
            }),
          }),
          label: ({ ownerState }: any) => ({
            ...(ownerState.color === 'default' && {
              color: dark ? '#e6ecff' : undefined,
            }),
          }),
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: dark ? alpha("#ffffff", 0.08) : undefined,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: dark ? alpha("#ffffff", 0.06) : undefined,
          },
          notchedOutline: {
            borderColor: border,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: dark ? alpha("#e6ecff", 0.9) : undefined,
            '&.Mui-focused': {
              color: basePalette.primary.main,
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: dark ? alpha("#0e162b", 0.9) : undefined,
            backdropFilter: "blur(8px)",
            border: `1px solid ${border}`,
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: { borderRadius: 999, padding: 2, border: `1px solid ${border}` },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            border: 0,
            borderRadius: 999,
            '&.Mui-selected': {
              backgroundImage: `linear-gradient(135deg, ${alpha(basePalette.primary.main, 0.32)}, ${alpha(basePalette.secondary.main, 0.32)})`,
              color: basePalette.primary.main,
            },
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: { fontWeight: 700 },
        },
      },
    },
  });
};
