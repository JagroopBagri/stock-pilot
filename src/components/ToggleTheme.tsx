import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

interface ToggleThemeProps {
  toggleTheme: () => void;
}

function ToggleTheme({ toggleTheme }: ToggleThemeProps) {
  const theme = useTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default ToggleTheme;