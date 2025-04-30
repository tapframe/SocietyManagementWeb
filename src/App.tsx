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

// Auth Context
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
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
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="rules" element={<RulesPage />} />
          </Route>
          
          {/* Protected Routes for all authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="report" element={<ReportPage />} />
              <Route path="ideas" element={<IdeasPage />} />
            </Route>
          </Route>
          
          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Box>
    </AuthProvider>
  );
};

export default App; 