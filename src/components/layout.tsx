import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import { jwtDecode } from "jwt-decode";
import nodeLogo from "../assets/node.png";
import { useFcmSync } from "../hooks/fcmSync";

const drawerWidth = 240;

// Styled component for the main content area
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#ffffff", // Clean white background
  color: "#000000",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export function Layout() {
 useFcmSync(React.useCallback((payload:any) => {
    console.log("🎯 Layout receiving message via callback:", payload);
    setNotificationCount((prev) => prev + 1);
  }, []));
  const [notificationCount, setNotificationCount] = React.useState(0); // State for badge

  
  const theme = useTheme();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const userId: string = React.useMemo(() => {
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || decoded.sub || "Unknown ID";
    } catch (e) {
      return null;
    }
  }, [token]);
  //  React.useEffect(() => {
  //   console.log("EventListener attached in Layout");
  //   const handleNewNotification = (event:any) => {
  //     console.log("Event received in Layout:", event.detail)
  //     setNotificationCount((prev) => prev + 1);
  //   };

  //   window.addEventListener("fcm_message_received", handleNewNotification);
  //   return () =>
  //     window.removeEventListener(
  //       "fcm_message_received",
  //       handleNewNotification,
  //     );
  // }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMeClick = () => {
    handleMenuClose();
    navigate(`/user/${userId}`);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // const handleLogoutClick = () => {
  //   logout();
  //   navigate('/login');
  // };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open} elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {token && (
              <IconButton
                color="inherit"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={nodeLogo}
                alt="Logo"
                sx={{ height: 35 }}
              />
              <Typography variant="h6" noWrap sx={{ fontWeight: "bold" }}>
                Welcome
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {!token ? (
              <>
                <Button component={RouterLink} to="/login" color="primary">
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    sx={{ mr: 1 }}
                    onClick={() => setNotificationCount(0)} // Reset count when clicked
                  >
                    <Badge badgeContent={notificationCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                {/* --- Profile Icon and Menu --- */}
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={isMenuOpen ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? "true" : undefined}
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                    >
                      <PersonIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5, minWidth: 150, borderRadius: 2 },
                  }}
                >
                  <MenuItem onClick={handleMeClick}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    My Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleLogoutClick}
                    sx={{ color: "error.main" }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {token && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/user")}>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Main Page Content */}
      <Main open={open}>
        <DrawerHeader /> {/* Spacer to push content below the fixed AppBar */}
        <Outlet />
      </Main>
    </Box>
  );
}
