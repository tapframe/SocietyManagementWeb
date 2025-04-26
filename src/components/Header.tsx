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
  Paper,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
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

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ApartmentIcon color="primary" />
          <Typography variant="h6" fontWeight="bold" color="primary">
            SMS
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '0 24px 24px 0',
                mr: 2,
                ml: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List sx={{ py: 2 }}>
        {authItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '0 24px 24px 0',
                mr: 2,
                ml: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 2 : 0}
        sx={{ 
          width: '100%',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? 'none' : `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease-in-out',
          color: scrolled ? 'text.primary' : 'primary.main',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: scrolled ? 64 : 72, transition: 'height 0.3s ease' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                edge="start"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box 
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                mr: 3,
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  width: 36, 
                  height: 36,
                  mr: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                }}
              >
                <ApartmentIcon fontSize="small" />
              </Avatar>
              <Typography 
                variant={scrolled ? "h6" : "h5"} 
                component="div"
                sx={{ 
                  fontWeight: 700, 
                  transition: 'all 0.3s ease-in-out',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Society MS
              </Typography>
            </Box>
            
            {!isMobile && (
              <Box sx={{ display: 'flex', flexGrow: 1 }}>
                {menuItems.map((item) => (
                  <Button 
                    key={item.text}
                    component={Link}
                    to={item.path}
                    startIcon={isTablet ? null : item.icon}
                    sx={{ 
                      mx: 0.5,
                      px: isTablet ? 1.5 : 2,
                      py: 1,
                      borderRadius: '8px',
                      position: 'relative',
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                      fontWeight: isActive(item.path) ? 600 : 400,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      },
                      '&::after': isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '30%',
                        height: '3px',
                        backgroundColor: 'primary.main',
                        borderRadius: '3px 3px 0 0',
                      } : {},
                    }}
                  >
                    {isTablet ? (
                      <Tooltip title={item.text}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </Box>
                      </Tooltip>
                    ) : item.text}
                  </Button>
                ))}
              </Box>
            )}
            
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/register"
                  startIcon={<PersonAddIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: 'none',
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Header; 