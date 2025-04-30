import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Container,
  CssBaseline,
} from '@mui/material';

// Custom components
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        bgcolor: 'background.default',
        margin: 0,
        padding: 0,
        '& > *': {
          margin: '0 !important',
          padding: '0 !important'
        }
      }}
    >
      <CssBaseline />
      
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <Container 
        component="main" 
        maxWidth={false}
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflowY: 'auto',
          m: 0,
          p: 0,
          '&.MuiContainer-root': {
            maxWidth: 'none',
            px: 0
          }
        }}
        disableGutters
      >
        <Box sx={{ 
          flexGrow: 1, 
          width: '100%', 
          height: '100%',
          m: 0,
          p: 0,
          overflowY: 'auto'
        }}>
          <Outlet />
        </Box>
      </Container>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default MainLayout; 