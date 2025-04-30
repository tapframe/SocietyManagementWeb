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
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  getToken: () => null
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
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get token function
  const getToken = () => {
    return localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 