"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "@/components/NavBar/NavBar";
import { appColors } from "@/styles/appColors";

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedMode = localStorage.getItem("stock-pilot-theme");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
        paper: mode === "dark" ? "#2d2d2d" : "#ffffff",
      },
      primary: {
        main: appColors.green, // This sets the primary color to green
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: appColors.green,
            color: "white",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          },
          text: {
            color: mode === "dark" ? "#ffffff" : "#000000",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          },
          outlined: {
            borderColor: appColors.green,
            color: appColors.green,
            "&:hover": {
              backgroundColor: "rgba(76, 175, 80, 0.08)",
            },
          },
          contained: {
            backgroundColor: appColors.green,
            color: "white",
            padding: "10px 20px",
            borderRadius: " 4px",
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor: "#45a049",
            },
            '&.MuiButton-containedPrimary': {
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#45a049',
            },
          },
          },
        },
      },
    },
  });
  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("stock-pilot-theme", newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavBar toggleTheme={toggleTheme} />
        <div style={{ padding: "4rem", flex: 1 }}>{children}</div>
      </div>
    </ThemeProvider>
  );
}
