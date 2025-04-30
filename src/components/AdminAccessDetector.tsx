import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

// The secret code to trigger admin access and for registration
const SECRET_CODE = '815787';

interface AdminAccessDetectorProps {
  children: React.ReactNode;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-access-tabpanel-${index}`}
      aria-labelledby={`admin-access-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AdminAccessDetector: React.FC<AdminAccessDetectorProps> = ({ children }) => {
  const [keySequence, setKeySequence] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Register form state
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  // Handle keydown to detect secret sequence
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore key presses if a dialog is open or if focus is on an input field
    if (dialogOpen || (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
      return;
    }

    const newSequence = keySequence + event.key;
    
    // Only keep the last N characters where N is the length of the secret code
    const trimmedSequence = newSequence.slice(-SECRET_CODE.length);
    setKeySequence(trimmedSequence);
    
    // Check if the sequence matches the secret code
    if (trimmedSequence === SECRET_CODE) {
      setDialogOpen(true);
      setKeySequence(''); // Reset the sequence
    }
  }, [keySequence, dialogOpen]);

  // Set up and clean up the event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset messages when switching tabs
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRegisterName('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setSecretKey('');
    setError(null);
    setSuccessMessage(null);
    setTabValue(0);
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.post('/admin/login', {
        email: loginEmail,
        password: loginPassword
      });

      // Check if the user role is admin (adjust based on your API response structure)
      if (response.data?.user?.role !== 'admin') {
        setError('Access denied. Only administrators can log in here.');
        setLoading(false);
        return;
      }

      // Use AuthContext login if available, otherwise set localStorage directly
      if (login && response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
      } else {
        // Fallback or direct setting if AuthContext login isn't used/available here
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('userRole', 'admin');
        // Store admin user details if provided by backend
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      setSuccessMessage('Login successful! Redirecting to admin panel...');
      
      // Redirect to admin panel after short delay
      setTimeout(() => {
        navigate('/admin');
        handleClose();
      }, 1500);
      
    } catch (err: any) {
      console.error('Admin Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validate form
    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword || !secretKey) {
      setError('Please fill in all fields');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (secretKey !== SECRET_CODE) { // Use the same secret code for registration
      setError('Invalid secret key');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axiosInstance.post('/admin/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        secretKey: secretKey // Send the secret key to the backend for verification
      });

      // If registration successful
      setSuccessMessage('Admin account created successfully! Please login.');
      setTabValue(0); // Switch to login tab
      // Clear registration form fields but keep login fields potentially filled
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
      setSecretKey('');
      
    } catch (err: any) {
      console.error('Admin Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {children}
      
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Admin Access Portal
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Secure authentication required
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
            <Tab label="Login" />
            <Tab label="Create Admin" />
          </Tabs>
          
          <Divider sx={{ mb: 3 }} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          <TabPanel value={tabValue} index={0}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerConfirmPassword}
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            />
            <TextField
              label="Admin Secret Key"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              helperText={`Enter the admin creation key (${SECRET_CODE})`}
            />
          </TabPanel>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={tabValue === 0 ? handleLogin : handleRegister}
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {tabValue === 0 ? 'Login' : 'Create Admin Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminAccessDetector; 