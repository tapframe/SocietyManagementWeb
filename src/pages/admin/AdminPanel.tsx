import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  alpha,
  Paper,
  Tooltip
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApartmentIcon from '@mui/icons-material/Apartment';
import HomeIcon from '@mui/icons-material/Home';
import PetitionIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import IncidentsManagement from './IncidentsManagement';
import PetitionsManagement from '../../pages/admin/PetitionsManagement';

const drawerWidth = 280;

const AdminPanel: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close drawer by default on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  // Listen for tab navigation messages from the Dashboard component
  useEffect(() => {
    const handleTabNavigation = (event: MessageEvent) => {
      // Check if the message is from our application and has the correct type
      if (event.data && event.data.type === 'NAVIGATE_ADMIN_TAB') {
        // Set the active page based on the tab parameter
        if (event.data.tab) {
          setActivePage(event.data.tab);
        }
      }
    };

    // Add event listener
    window.addEventListener('message', handleTabNavigation);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('message', handleTabNavigation);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 2,
        sx: {
          mt: 1.5,
          overflow: 'visible',
          borderRadius: 2,
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
          minWidth: 200,
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ py: 1, px: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">Admin User</Typography>
        <Typography variant="body2" color="text.secondary">admin@society.com</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <Typography variant="body2">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <Typography variant="body2">Settings</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Typography variant="body2" color="error">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'incidents':
        return <IncidentsManagement />;
      case 'petitions':
        return <PetitionsManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.light, 0.03) : theme.palette.background.default }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          transition: theme =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          boxShadow: '0 1px 10px rgba(0,0,0,0.12)',
          bgcolor: 'background.paper',
          color: 'text.primary',
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar sx={{ paddingRight: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ 
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Society Management
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  marginRight: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ 
                  ml: 1,
                  p: 0.5,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  '&:hover': {
                    border: `2px solid ${theme.palette.primary.main}`,
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold'
                  }}
                >
                  A
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
            backgroundColor: 'background.paper',
            backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.03)}, rgba(255,255,255,0))`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            backgroundColor: 'background.paper',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ApartmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">Admin Panel</Typography>
          </Box>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Admin User</Typography>
              <Typography variant="caption" color="text.secondary">admin@society.com</Typography>
            </Box>
          </Paper>
        </Box>
        
        <List component="nav" sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
            Main
          </Typography>
          
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activePage === 'dashboard'}
              onClick={() => setActivePage('dashboard')}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <DashboardIcon color={activePage === 'dashboard' ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ 
                  fontWeight: activePage === 'dashboard' ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activePage === 'users'}
              onClick={() => setActivePage('users')}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <PeopleIcon color={activePage === 'users' ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText 
                primary="User Management" 
                primaryTypographyProps={{ 
                  fontWeight: activePage === 'users' ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activePage === 'incidents'}
              onClick={() => setActivePage('incidents')}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <ReportIcon color={activePage === 'incidents' ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText 
                primary="Incidents" 
                primaryTypographyProps={{ 
                  fontWeight: activePage === 'incidents' ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activePage === 'petitions'}
              onClick={() => setActivePage('petitions')}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <PetitionIcon color={activePage === 'petitions' ? 'primary' : undefined} />
              </ListItemIcon>
              <ListItemText 
                primary="Petitions" 
                primaryTypographyProps={{ 
                  fontWeight: activePage === 'petitions' ? 'bold' : 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider sx={{ my: 1, mx: 2 }} />
        
        <List component="nav" sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
            System
          </Typography>
          
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mt: 0.5 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.05),
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  color: 'error',
                  fontWeight: 'medium'
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 8, // Add padding to compensate for the app bar
          px: { xs: 2, md: 3 },
          transition: theme => theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminPanel; 