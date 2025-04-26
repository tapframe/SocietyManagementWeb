import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Divider,
  CssBaseline,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import RuleIcon from '@mui/icons-material/Gavel';
import ReportIcon from '@mui/icons-material/Report';
import IdeaIcon from '@mui/icons-material/Lightbulb';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Report Issues', icon: <ReportIcon />, path: '/report' },
    { text: 'Know Your Rules', icon: <RuleIcon />, path: '/rules' },
    { text: 'Share Ideas', icon: <IdeaIcon />, path: '/ideas' },
    { text: 'Login', icon: <LoginIcon />, path: '/login' },
    { text: 'Register', icon: <PersonAddIcon />, path: '/register' },
  ];

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

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          SMS
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} onClick={() => handleNavigation(item.path)} sx={{ cursor: 'pointer' }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <CssBaseline />
      <AppBar position="static" sx={{ width: '100%' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Society Management System
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {menuItems.map((item) => (
                <Button 
                  color="inherit" 
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>

      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4, 
          px: { xs: 1, sm: 2, md: 3 }, 
          maxWidth: '100% !important',
          width: '100%'
        }}
        disableGutters
      >
        <Outlet />
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          width: '100%',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800]
        }}
      >
        <Container maxWidth={false} sx={{ width: '100%' }}>
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} Society Management System
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Promoting social order, awareness, and community participation
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 