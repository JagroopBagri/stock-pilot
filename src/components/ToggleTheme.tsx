import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ToggleThemeProps {
  toggleTheme: () => void;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out, background-color 0.3s ease-in-out',
  '&:hover': {
    transform: 'rotate(45deg)',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.04)',
  },
}));

function ToggleTheme({ toggleTheme }: ToggleThemeProps) {
  const theme = useTheme();

  return (
    <StyledIconButton onClick={toggleTheme} color="inherit" aria-label="toggle light/dark mode">
      {theme.palette.mode === 'dark' ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </StyledIconButton>
  );
}

export default ToggleTheme;