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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%' }}>
      <CssBaseline />
      
      {/* Header Component */}
      <Header />

      {/* Main Content */}
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

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default MainLayout; 