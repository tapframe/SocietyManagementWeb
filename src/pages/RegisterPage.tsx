import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH_ENDPOINTS } from '../config';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    userType: 'citizen'
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear registration error
    if (registrationError) {
      setRegistrationError('');
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    };

    let valid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setRegistrationError('');
      
      try {
        // Map the role from userType
        let role = 'citizen';
        if (formData.userType === 'advocate' || formData.userType === 'police') {
          role = 'admin';
        }
        
        // Prepare data for API
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          userType: formData.userType,
          role: role,
        };
        
        const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to register');
        }
        
        // Login the user with the returned token and user data
        login(data.token, data.user);
        
        // Redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setRegistrationError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Theme-aware background (consistent with LoginPage)
  const bgGradient = theme.palette.mode === 'dark'
    ? `radial-gradient(circle at 70% 50%, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.default, 0.95)} 50%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`
    : `radial-gradient(circle at 70% 50%, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`;

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
        py: 5,
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
      <Paper
        elevation={16}
        sx={{
          position: 'relative',
          zIndex: 2,
          width: { xs: '90%', sm: 'auto' },
          minWidth: { sm: 400, md: 520 },
          maxWidth: { md: 600 },
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: '24px',
          backgroundColor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing(2.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          boxShadow: theme.shadows[8],
          maxHeight: '90vh',
          overflowY: 'auto',
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
            Create an Account
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, fontFamily: '"Poppins", Sans-serif' }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontFamily: '"Poppins", Sans-serif',
                fontWeight: 500
              }}
            >
              Log in
            </Link>
          </Typography>
        </Box>

        {registrationError && (
          <Alert severity="error" sx={{ width: '100%', mt: 1, mb:1 }}>
            {registrationError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
          <FormControl component="fieldset" sx={{ mb: 1 }}>
            <FormLabel component="legend" sx={{ fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary, mb: 0.5, fontSize: '0.875rem' }}>
              I am registering as:
            </FormLabel>
            <RadioGroup
              row
              aria-label="User type"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              sx={{ justifyContent: 'center', gap: 1, '& .MuiFormControlLabel-label': { fontFamily: '"Poppins", Sans-serif', fontSize: '0.875rem' } }}
            >
              <FormControlLabel value="citizen" control={<Radio size="small" />} label="Citizen" />
              <FormControlLabel value="advocate" control={<Radio size="small"/>} label="Advocate" />
              <FormControlLabel value="police" control={<Radio size="small"/>} label="Police Officer" />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                id="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address Line"
                id="address"
                autoComplete="address-line1"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="city"
                label="City"
                id="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="state"
                label="State"
                id="state"
                autoComplete="address-level1"
                value={formData.state}
                onChange={handleChange}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="zipCode"
                label="ZIP Code"
                id="zipCode"
                autoComplete="postal-code"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={isLoading}
                InputLabelProps={{ sx: { fontFamily: '"Poppins", Sans-serif', color: theme.palette.text.secondary } }}
                InputProps={{
                  sx: { borderRadius: '12px', fontFamily: '"Poppins", Sans-serif', backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: '40px',
              height: 50,
              fontSize: '1rem',
              fontFamily: '"Poppins", Sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              opacity: isLoading ? 0.7 : 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.85),
              },
              boxShadow: theme.shadows[3]
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'inherit' }} /> : 'Create Account'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 