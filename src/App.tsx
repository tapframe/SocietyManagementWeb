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
import MyReports from './pages/MyReports';
import RulesPage from './pages/RulesPage';
import IdeasPage from './pages/IdeasPage';
import PetitionsPage from './pages/PetitionsPage';
import PetitionDetailPage from './pages/PetitionDetailPage';
import AdminPanel from './pages/admin/AdminPanel';

// Components
import AdminAccessDetector from './components/AdminAccessDetector';

// Auth Context
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeProvider from './context/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAccessDetector>
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
                <Route path="petitions" element={<PetitionsPage />} />
                <Route path="petitions/:id" element={<PetitionDetailPage />} />
              </Route>
              
              {/* Protected Routes for all authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route path="report" element={<ReportPage />} />
                  <Route path="my-reports" element={<MyReports />} />
                  <Route path="ideas" element={<IdeasPage />} />
                </Route>
              </Route>
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                {/* Admin panel uses its own layout */}
                <Route path="/admin/*" element={<AdminPanel />} />
              </Route>
            </Routes>
          </Box>
        </AdminAccessDetector>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 