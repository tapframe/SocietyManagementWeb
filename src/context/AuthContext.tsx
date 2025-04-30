import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_ENDPOINTS } from '../config';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getToken: () => string | null;
  isAdmin: () => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  getToken: () => null,
  isAdmin: () => false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const adminToken = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('userRole');

    // Check for regular user authentication
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Optionally verify the token with the backend
        verifyToken(token);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } 
    // Check for admin authentication
    else if (adminToken && userRole === 'admin') {
      // Create a temporary admin user object
      const adminUser: User = {
        id: 'admin-id',
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'admin'
      };
      setUser(adminUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);
  
  // Function to verify token with backend
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.ME, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      // Token is valid, you could optionally update user data here
      // from the response if needed
    } catch (error) {
      console.error('Token verification failed:', error);
      // Token is invalid or expired, log the user out
      logout();
    }
  };

  // Login function
  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get token function
  const getToken = () => {
    const adminToken = localStorage.getItem('adminToken');
    const regularToken = localStorage.getItem('token');
    
    // Prioritize admin token if it exists
    return adminToken || regularToken;
  };

  // Check if user is an admin
  const isAdmin = () => {
    return user?.role === 'admin' || localStorage.getItem('userRole') === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout, 
      getToken,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 