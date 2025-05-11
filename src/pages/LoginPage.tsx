import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH_ENDPOINTS } from '../config';

// Assuming icons are in src/assets/icons and image in src/assets/images
// These would ideally be imported as components or used with an <img> tag
// For this example, we'll use placeholders or Material UI icons if available.
// import FacebookIcon from '@mui/icons-material/Facebook';
// import GoogleIcon from '@mui/icons-material/Google';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close'; // Placeholder for custom close icons

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    // Password length validation can be added if needed, Figma doesn't specify

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setLoginError('');

      try {
        const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to login');
        }

        login(data.token, data.user);

        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(
          error instanceof Error ? error.message : 'Login failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Theme-aware background (consistent with other pages)
  const bgGradient = theme.palette.mode === 'dark' 
    ? `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.default, 0.95)} 50%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`
    : `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`;
    
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='${theme.palette.mode === 'dark' ? '0.06' : '0.04'}'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: bgGradient,
        backgroundAttachment: 'fixed',
        animation: 'gradientShift 30s ease infinite alternate',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: bgPattern,
          backgroundSize: '72px 144px',
          opacity: theme.palette.mode === 'dark' ? 0.5 : 0.6,
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          animation: 'patternMove 60s linear infinite',
          '@keyframes patternMove': {
            '0%': { transform: 'translateY(0) rotate(0deg)' },
            '100%': { transform: 'translateY(20px) rotate(1deg)' }
          }
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: theme.palette.mode === 'dark' 
              ? `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.main, 0.15)}, transparent 500px)`
              : `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.light, 0.1)}, transparent 500px)`,
            zIndex: 0,
            animation: 'pulseGradient 15s ease-in-out infinite alternate',
            '@keyframes pulseGradient': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 0.8 },
              '100%': { opacity: 0.6 }
            }
        }
      }}
    >
      {/* Backdrop - Now handled by the main Box animations and layers */}
      {/* <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: alpha(theme.palette.common.black, 0.35),
          backdropFilter: 'blur(10px)', 
          zIndex: 1,
        }}
      /> */}

      <Paper
        elevation={16}
        sx={{
          position: 'relative',
          zIndex: 2, // Ensure card is above background pseudo-elements
          width: { xs: '90%', sm: 'auto' },
          minWidth: { sm: 400, md: 460 }, // Adjusted minWidth as social buttons are removed
          p: { xs: 3, sm: 4, md: 5 }, 
          borderRadius: '24px',
          backgroundColor: alpha(theme.palette.background.paper, 0.85), // Slightly more transparent for glassmorphism
          backdropFilter: 'blur(12px)', // Enhance glassmorphism
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing(3), // Maintained gap for remaining elements
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`, // Stronger border for definition
          boxShadow: theme.shadows[8] // Slightly more pronounced shadow
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: theme.spacing(1.5) }}>
          <Box 
            sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.dark, 0.5) : alpha(theme.palette.grey[400],0.8), 
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 500, color: theme.palette.text.primary, fontFamily: '"Poppins", Sans-serif' }}
          >
            Log in
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: theme.palette.text.secondary, fontFamily: '"Poppins", Sans-serif' }}
          >
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: theme.palette.primary.main, 
                textDecoration: 'none',
                fontFamily: '"Poppins", Sans-serif',
                fontWeight: 500
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        {loginError && (
          <Alert severity="error" sx={{ width: '100%', mt: 1, mb:1 }}>
            {loginError}
          </Alert>
        )}

        {/* Social Logins Removed */}
        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5), width: '100%', maxWidth: 480 }}> ... </Box> */}

        {/* Divider OR Removed */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 480, my: 0.5 }}> ... </Box> */}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: theme.spacing(2.5) }}> {/* Adjusted maxWidth and gap */}
          <TextField
            fullWidth
            id="email"
            label="Your email"
            name="email"
            autoComplete="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
            InputProps={{
              sx: { 
                borderRadius: '12px', 
                fontFamily: '"Poppins", Sans-serif',
                backgroundColor: alpha(theme.palette.action.hover, 0.05) // Slightly more pronounced input bg
              },
            }}
          />
          <TextField
            fullWidth
            name="password"
            label="Your password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
            InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
            InputProps={{
              sx: { 
                borderRadius: '12px', 
                fontFamily: '"Poppins", Sans-serif',
                backgroundColor: alpha(theme.palette.action.hover, 0.05)
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Link
            to="/forgot-password"
            style={{
              color: theme.palette.text.primary, 
              textDecoration: 'none',
              fontFamily: '"Poppins", Sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              alignSelf: 'flex-end',
              marginTop: -theme.spacing(1), // Adjusted for closer spacing to password field
            }}
          >
            Forget your password
          </Link>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: theme.palette.primary.main, 
              color: theme.palette.primary.contrastText,
              borderRadius: '40px',
              height: 50, 
              fontSize: '1rem',
              fontFamily: '"Poppins", Sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              mt: 1.5, // Adjusted margin top
              opacity: isLoading ? 0.7 : 1, 
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.85),
              },
              boxShadow: theme.shadows[3] // Add subtle shadow to button
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : 'Log in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 