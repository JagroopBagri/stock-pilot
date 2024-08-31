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
        default: mode === "dark" ? appColors.charcoal : appColors.whiteSmoke,
        paper: mode === "dark" ? appColors.charcoal : appColors.white,
      },
      primary: {
        main: appColors.logoLightBlue,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: appColors.logoLightBlue,
            color: "white",
            "&:hover": {
              backgroundColor: appColors.darkTurqoise,
            },
          },
          text: {
            color: mode === "dark" ? appColors.whiteSmoke : appColors.black,
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
            },
          },
          outlined: {
            borderColor: appColors.logoLightBlue,
            color: appColors.logoLightBlue,
            "&:hover": {
              backgroundColor: "rgba(76, 175, 80, 0.08)",
            },
          },
          contained: {
            backgroundColor: appColors.logoLightBlue,
            color: mode === "dark" ? appColors.black : appColors.black,
            padding: "10px 20px",
            borderRadius: " 4px",
            transition: "background-color 0.3s",
            "&:hover": {
              backgroundColor: appColors.darkTurqoise,
            },
            '&.MuiButton-containedPrimary': {
            backgroundColor: appColors.logoLightBlue,
            '&:hover': {
              backgroundColor: appColors.darkTurqoise,
            },
          },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? appColors.whiteSmoke : appColors.black,
          },
          // h1: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
          // h2: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
          // h3: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
          // h4: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
          // h5: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
          // h6: { color: mode === "dark" ? appColors.logoLightBlue : appColors.darkTurqoise },
        }
      }
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
