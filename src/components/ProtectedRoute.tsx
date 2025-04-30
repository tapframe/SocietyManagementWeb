import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, loading, isAdmin } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Special check for admin role
  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  // If a specific non-admin role is required and user doesn't have it, redirect to home page
  if (requiredRole && requiredRole !== 'admin' && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and has the correct role, render the children routes
  return <Outlet />;
};

export default ProtectedRoute; 