import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip,
  Avatar,
  Fade,
  Collapse,
  alpha,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import RuleIcon from '@mui/icons-material/Gavel';
import ReportIcon from '@mui/icons-material/Report';
import IdeaIcon from '@mui/icons-material/Lightbulb';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import ApartmentIcon from '@mui/icons-material/Apartment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Report Issues', icon: <ReportIcon />, path: '/report' },
  { text: 'Know Your Rules', icon: <RuleIcon />, path: '/rules' },
  { text: 'Share Ideas', icon: <IdeaIcon />, path: '/ideas' },
];

const authItems = [
  { text: 'Login', icon: <LoginIcon />, path: '/login' },
  { text: 'Register', icon: <PersonAddIcon />, path: '/register' },
];

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };
  
  const handleAdminDashboard = () => {
    handleProfileMenuClose();
    navigate('/admin');
  };

  // Modify menu items based on authentication status
  const visibleMenuItems = menuItems.filter(item => {
    // Hide Report and Ideas pages if not authenticated
    if ((item.path === '/report' || item.path === '/ideas') && !isAuthenticated) {
      return false;
    }
    return true;
  });

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(10px)',
      }}
      role="presentation"
    >
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main, 
              color: 'white',
              width: 40, 
              height: 40,
            }}
          >
            <ApartmentIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Society MS
          </Typography>
        </Box>
        <IconButton 
          onClick={toggleDrawer(false)} 
          sx={{ 
            p: 1,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
            transition: 'all 0.3s'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mx: 3, opacity: 0.6 }} />
      
      <List sx={{ flexGrow: 1, px: 2, py: 3 }}>
        {visibleMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': isActive(item.path) ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0 4px 4px 0',
                } : {},
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: 15,
                  fontWeight: isActive(item.path) ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {user?.role === 'admin' && (
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation('/admin')}
              selected={isActive('/admin')}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': isActive('/admin') ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '0 4px 4px 0',
                } : {},
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: isActive('/admin') ? theme.palette.primary.main : theme.palette.text.secondary,
              }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Dashboard" 
                primaryTypographyProps={{ 
                  fontSize: 15,
                  fontWeight: isActive('/admin') ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, opacity: 0.7, fontSize: 12 }}>
          ACCOUNT
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {!isAuthenticated ? (
            // Show login/register buttons when not authenticated
            authItems.map((item) => (
              <Button
                key={item.text}
                variant={item.text === 'Register' ? 'contained' : 'outlined'}
                color="primary"
                size="large"
                fullWidth
                startIcon={item.icon}
                component={Link}
                to={item.path}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::before': item.text === 'Register' ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.light, 0.4)} 50%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease',
                    zIndex: 0,
                  } : {},
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: item.text === 'Register' ? `0 6px 15px ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
                    '&::before': {
                      transform: 'translateX(100%)',
                    },
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                    boxShadow: item.text === 'Register' ? `0 3px 8px ${alpha(theme.palette.primary.main, 0.3)}` : 'none',
                  },
                  ...(item.text === 'Login' && {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateY(-3px)',
                    },
                  }),
                }}
              >
                {item.text}
              </Button>
            ))
          ) : (
            // Show logout button when authenticated
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                borderColor: alpha(theme.palette.primary.main, 0.5),
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  // Desktop header with auth context integration
  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          backgroundColor: scrolled ? alpha(theme.palette.background.default, 0.8) : 'transparent',
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
          transition: 'background-color 0.3s, border-bottom 0.3s',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer' 
              }}
              onClick={() => navigate('/')}
            >
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main,
                  width: 36, 
                  height: 36, 
                  mr: 1 
                }}
              >
                <ApartmentIcon />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.primary.main,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Society Management
              </Typography>
            </Box>

            {/* Desktop navigation menu */}
            {!isMobile && (
              <Box 
                sx={{ 
                  ml: 4, 
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: isTablet ? 'flex-end' : 'center' 
                }}
              >
                {visibleMenuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    startIcon={!isTablet && item.icon}
                    sx={{
                      mx: isTablet ? 0.5 : 1.5,
                      px: isTablet ? 1.5 : 2,
                      py: 1,
                      position: 'relative',
                      fontWeight: 500,
                      fontSize: isTablet ? 14 : 15,
                      color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
                      textTransform: 'none',
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: isTablet ? '10%' : '20%',
                        width: isTablet ? '80%' : '60%',
                        height: '3px',
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: theme.palette.primary.main,
                      } : {
                        content: hoveredItem === item.text ? '""' : 'none',
                        position: 'absolute',
                        bottom: 0,
                        left: isTablet ? '10%' : '20%',
                        width: isTablet ? '80%' : '60%',
                        height: '3px',
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: theme.palette.primary.main,
                      },
                    }}
                    onMouseEnter={() => setHoveredItem(item.text)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {/* Admin Dashboard link for admin users */}
                {!isMobile && user?.role === 'admin' && (
                  <Button
                    component={Link}
                    to="/admin"
                    color="inherit"
                    startIcon={!isTablet && <DashboardIcon />}
                    sx={{
                      mx: isTablet ? 0.5 : 1.5,
                      px: isTablet ? 1.5 : 2,
                      py: 1,
                      position: 'relative',
                      fontWeight: 500,
                      fontSize: isTablet ? 14 : 15,
                      color: isActive('/admin') ? theme.palette.primary.main : theme.palette.text.primary,
                      textTransform: 'none',
                      '&::after': isActive('/admin') ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: isTablet ? '10%' : '20%',
                        width: isTablet ? '80%' : '60%',
                        height: '3px',
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: theme.palette.primary.main,
                      } : {
                        content: hoveredItem === 'Admin' ? '""' : 'none',
                        position: 'absolute',
                        bottom: 0,
                        left: isTablet ? '10%' : '20%',
                        width: isTablet ? '80%' : '60%',
                        height: '3px',
                        borderRadius: '3px 3px 0 0',
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                        transition: 'all 0.3s ease',
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: theme.palette.primary.main,
                      },
                    }}
                    onMouseEnter={() => setHoveredItem('Admin')}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>
            )}

            {/* Authentication buttons */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                ml: 2,
                gap: 1
              }}
            >
              {!isAuthenticated ? (
                <>
                  {!isMobile && (
                    <Button
                      component={Link}
                      to="/login"
                      color="inherit"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: 15,
                      }}
                    >
                      Login
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.35)}`,
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar 
                        sx={{ 
                          width: 35, 
                          height: 35,
                          bgcolor: theme.palette.primary.main,
                          fontSize: 14,
                          fontWeight: 'bold',
                        }}
                      >
                        {user?.name?.charAt(0) || <AccountCircleIcon />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleProfileMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                      <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                        {user?.role === 'admin' ? 'Administrator' : 'Citizen'}
                      </Typography>
                    </Box>
                    <Divider />
                    {user?.role === 'admin' && (
                      <MenuItem onClick={handleAdminDashboard}>
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header;