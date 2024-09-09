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
  useMediaQuery,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { appColors } from "@/styles/appColors";
import axios from "axios";
import toast from "react-hot-toast";

interface NavBarProps {
  toggleTheme: () => void;
}

function NavBar({ toggleTheme }: NavBarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user, isLoadingUser, setUser } = useContext(UserContext) as UserContextType;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const logout = async () => {
    try {
      await axios.get("/api/v1/user/logout");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error("Error occurred while attempting to logout");
    }
  };

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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    name: string
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(name);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  const shouldShowMenuItem = (item: MenuItem): boolean => {
    if (user?.id) {
      return !item.hide?.includes("logged-in");
    } else {
      return !item.hide?.includes("logged-out");
    }
  };

  const renderMenuItems = (
    items: MenuItem[],
    isMobile: boolean = false,
    level: number = 1
  ) => {
    return items.map((item) => {
      if (!shouldShowMenuItem(item) || isLoadingUser) {
        return null;
      }

      if (isMobile) {
        const listItem = (
          <ListItem
            button
            onClick={() =>
              item.children
                ? handleSubMenuToggle(item.name)
                : handleNavigation(item.route)
            }
            key={item.name}
            sx={{ pl: level * 2 }}
          >
            <ListItemText primary={item.name} />
            {item?.children?.length ? (
              openSubMenu === item.name ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            ) : (
              <></>
            )}
          </ListItem>
        );

        if (item.children && item.children.length) {
          return (
            <div key={item.name}>
              {listItem}
              <Collapse
                in={openSubMenu === item.name}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {renderMenuItems(item.children, isMobile, level + 1)}
                </List>
              </Collapse>
            </div>
          );
        }
        return listItem;
      } else if (!isMobile) {
        if (item.children && item.children.length) {
          return (
            <div key={item.name}>
              <Button
                onClick={(event) => handleMenuOpen(event, item.name)}
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? appColors.whiteSmoke
                      : appColors.black,
                  marginX: "25px",
                }}
                endIcon= {openMenu === item.name ? <ExpandLess /> : <ExpandMore />}
              >
                {item.name}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openMenu === item.name}
                onClose={handleMenuClose}
              >
                {item.children.map((child) => (
                  <MuiMenuItem
                    key={child.name}
                    onClick={() => handleNavigation(child.route)}
                  >
                    {child.name}
                  </MuiMenuItem>
                ))}
              </Menu>
            </div>
          );
        } else {
          return (
            <Button
              key={item.name}
              onClick={() => handleNavigation(item.route)}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? appColors.whiteSmoke
                    : appColors.black,
                marginX: "10px",
              }}
            >
              {item.name}
            </Button>
          );
        }
      }
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? appColors.charcoal
              : appColors.whiteSmoke,
          borderBottom: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(0, 0, 0, 0.12)"
          }`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <img
              src="/icon.png"
              alt="Stock Pilot Logo"
              style={{ width: 32, height: 32, marginRight: 8, cursor: "pointer" }}
              onClick={() => {router.push("/dashboard")}}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? appColors.logoLightBlue
                    : appColors.darkTurqoise,
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => {router.push("/dashboard")}}
            >
              Stock Pilot
            </Typography>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {renderMenuItems(menuItems, false, 1)}
            {user?.id && (
              <Button
                onClick={logout}
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? appColors.whiteSmoke
                      : appColors.black,
                  marginX: "10px",
                }}
              >
                Log Out
              </Button>
            )}
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
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? appColors.charcoal
                  : appColors.whiteSmoke,
            },
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                alignSelf: "center",
                flexGrow: 1,
                marginY: "1.5rem",
              }}
            >
              <img
                src="/icon.png"
                alt="Stock Pilot Logo"
                style={{ width: 32, height: 32, marginRight: 8 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                    ? appColors.logoLightBlue
                    : appColors.darkTurqoise,
                  fontWeight: "bold",
                }}
              >
                Stock Pilot
              </Typography>
            </Box>
            <List>{renderMenuItems(menuItems, true, 1)}</List>
            {user?.id && (
              <Button
                onClick={logout}
                sx={{
                  margin: "0 16px 16px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? appColors.logoLightBlue
                      : appColors.darkTurqoise,
                  color: appColors.whiteSmoke,
                }}
              >
                Log Out
              </Button>
            )}
          </div>
        </Drawer>
      </Box>
      <Toolbar />
    </>
  );
}

export default NavBar;
