import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportPage from './pages/ReportPage';
import RulesPage from './pages/RulesPage';
import IdeasPage from './pages/IdeasPage';
import AdminDashboard from './pages/admin/Dashboard';

const App: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="ideas" element={<IdeasPage />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App; 