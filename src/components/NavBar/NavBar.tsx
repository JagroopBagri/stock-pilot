"use client";
import { useContext, useState } from "react";
import ToggleTheme from "../ToggleTheme";
import { menuItems, MenuItem } from "./helpers/menuItems";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "../Store";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Collapse, 
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { appColors } from "@/styles/appColors";

interface NavBarProps {
  toggleTheme: () => void;
}

function NavBar({ toggleTheme }: NavBarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { user } = useContext(UserContext) as UserContextType;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (route: string) => {
    router.push(route);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSubMenuToggle = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const shouldShowMenuItem = (item: MenuItem): boolean => {
    if (user?.id) {
      return !item.hide?.includes("logged-in");
    } else {
      return !item.hide?.includes("logged-out");
    }
  };

  const renderMenuItems = (items: MenuItem[], isMobile: boolean = false) => {
    return items.map((item) => {
      if (!shouldShowMenuItem(item)) {
        return null;
      }

      const listItem = (
        <ListItem 
          button 
          onClick={() => item.children ? handleSubMenuToggle(item.name) : handleNavigation(item.route)}
          key={item.name}
        >
          <ListItemText primary={item.name} />
          {item.children && (openSubMenu === item.name ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
      );

      if (item.children) {
        return (
          <div key={item.name}>
            {listItem}
            <Collapse in={openSubMenu === item.name} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, isMobile)}
              </List>
            </Collapse>
          </div>
        );
      }

      return listItem;
    });
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {renderMenuItems(menuItems, true)}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="fixed" sx={{
          backgroundColor: appColors.green, 
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              flexGrow: 1
            }}
            onClick={() => handleNavigation("/")}
          >
            <img src="/icon.png" alt="Stock Pilot Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
            <Typography variant="h6" noWrap component="div">
              Stock Pilot
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => (
              shouldShowMenuItem(item) && (
                <Button
                  key={item.name}
                  color="inherit"
                  onClick={() => handleNavigation(item.route)}
                >
                  {item.name}
                </Button>
              )
            ))}
          </Box>
          <ToggleTheme toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Toolbar /> 
    </>
  );
}

export default NavBar;