"use client";

import { createTheme } from "@mui/material/styles";

export const sunriseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2c2c2c",
      light: "#4a4a4a",
      dark: "#1a1a1a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff6b35",
      light: "#ff8555",
      dark: "#cc5529",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c2c2c",
      secondary: "#666666",
    },
    divider: "#e5e5e5",
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: 'var(--font-serif), Georgia, serif',
      fontWeight: 700,
      fontSize: "3.5rem",
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      "@media (max-width:900px)": {
        fontSize: "2.25rem",
      },
      color: "#2c2c2c",
    },
    h2: {
      fontFamily: 'var(--font-serif), Georgia, serif',
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: "-0.01em",
      lineHeight: 1.2,
      color: "#2c2c2c",
    },
    h3: {
      fontFamily: 'var(--font-serif), Georgia, serif',
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      color: "#2c2c2c",
    },
    h4: {
      fontFamily: 'var(--font-serif), Georgia, serif',
      fontWeight: 700,
      fontSize: "1.5rem",
      color: "#2c2c2c",
    },
    h5: {
      fontWeight: 700,
      fontSize: "1.25rem",
      color: "#2c2c2c",
    },
    h6: {
      fontWeight: 700,
      fontSize: "1rem",
      color: "#2c2c2c",
    },
    body1: {
      fontSize: "1.0625rem",
      lineHeight: 1.75,
      fontWeight: 400,
      color: "#404040",
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.65,
      fontWeight: 400,
      color: "#666666",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.005em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "1rem",
          padding: "12px 28px",
          fontWeight: 600,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)",
          },
        },
        contained: {
          background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
          "&:hover": {
            background: "linear-gradient(135deg, #ff5a1f 0%, #ff7540 100%)",
            boxShadow: "0 8px 20px rgba(255, 107, 53, 0.3)",
          },
        },
        outlined: {
          borderColor: "#ff6b35",
          color: "#ff6b35",
          borderWidth: "2px",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 53, 0.05)",
            borderColor: "#ff5a1f",
          },
        },
        text: {
          color: "#ff6b35",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 53, 0.08)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: "#ffffff",
          borderBottom: "1px solid #e5e5e5",
          color: "#2c2c2c",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          border: "1px solid #f0f0f0",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
