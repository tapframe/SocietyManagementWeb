import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Avatar,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
} from '@mui/material';
import { GridLegacy as MuiGrid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import PetitionForm from '../components/PetitionForm';
import { alpha } from '@mui/material/styles';

interface Petition {
  _id: string;
  title: string;
  description: string;
  category: string;
  goal: number;
  deadline: string;
  status: 'active' | 'completed' | 'expired' | 'rejected';
  image?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  signatures: Array<{
    user: string;
    name: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
  adminReview: {
    status: 'pending' | 'approved' | 'rejected';
  };
}

const PetitionsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Add beautiful background theme variables
  const bgGradient = theme.palette.mode === 'dark' 
    ? `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.default, 0.95)} 50%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`
    : `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`;
    
  const bgPattern = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='${theme.palette.mode === 'dark' ? '0.07' : '0.05'}'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  useEffect(() => {
    console.log('Fetching petitions (location, auth state, or mount)');
    fetchPetitions();
    
    // Apply style to parent container to ensure full width/height
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      // Save original styles to restore on unmount
      const originalStyles = {
        padding: mainContainer.style.padding,
        margin: mainContainer.style.margin,
        maxWidth: mainContainer.style.maxWidth,
        width: mainContainer.style.width
      };
      
      // Apply new styles
      mainContainer.style.padding = '0';
      mainContainer.style.margin = '0';
      mainContainer.style.maxWidth = '100vw';
      mainContainer.style.width = '100%';
      
      // Cleanup function to restore original styles on component unmount
      return () => {
        mainContainer.style.padding = originalStyles.padding;
        mainContainer.style.margin = originalStyles.margin;
        mainContainer.style.maxWidth = originalStyles.maxWidth;
        mainContainer.style.width = originalStyles.width;
      };
    }
  }, [location, isAuthenticated, user?.id]); // Re-fetch when location changes or auth state changes

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      let fetchedPetitions: Petition[] = [];

      // Fetch all approved petitions (public)
      const approvedResponse = await axiosInstance.get('/petitions');
      fetchedPetitions = approvedResponse.data || [];
      console.log('Approved petitions fetched:', fetchedPetitions);

      if (isAuthenticated && user?.id) {
        // Fetch user's own petitions (pending, approved, rejected)
        try {
          const userPetitionsResponse = await axiosInstance.get('/petitions/user');
          const userPetitions: Petition[] = userPetitionsResponse.data || [];
          console.log('User-specific petitions fetched:', userPetitions);

          // Combine and de-duplicate
          const combinedMap = new Map<string, Petition>();
          fetchedPetitions.forEach(p => combinedMap.set(p._id, p));
          userPetitions.forEach(p => combinedMap.set(p._id, p)); 
          fetchedPetitions = Array.from(combinedMap.values());
        } catch (userErr: any) {
          console.error('ERROR FETCHING USER-SPECIFIC PETITIONS:', userErr);
          if (userErr.response) {
            console.error('User-specific petitions - Error Response Data:', userErr.response.data);
            console.error('User-specific petitions - Error Response Status:', userErr.response.status);
            console.error('User-specific petitions - Error Response Headers:', userErr.response.headers);
          } else if (userErr.request) {
            console.error('User-specific petitions - Error Request:', userErr.request);
          } else {
            console.error('User-specific petitions - Error Message:', userErr.message);
          }
          setError(prevError => prevError ? `${prevError}\nFailed to load your specific petitions.` : 'Failed to load your specific petitions.');
        }
      }

      console.log('Combined petitions to be set:', fetchedPetitions);
      setPetitions(fetchedPetitions);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching petitions:', err);
      setError(err.response?.data?.message || 'Failed to load petitions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateDialogOpen = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/petitions', message: 'You must be logged in to create a petition' } });
      return;
    }
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  const handlePetitionCreated = (petitionId: string) => {
    console.log(`Petition created with ID: ${petitionId}, refreshing list`);
    
    // Force a refresh
    setTimeout(() => {
      fetchPetitions();
    }, 500);
    
    handleCreateDialogClose();
  };

  const getFilteredPetitions = () => {
    // Get the user ID if authenticated
    const userId = user?.id || '';
    
    console.log('User ID for filtering:', userId);
    console.log('All petitions before filtering:', petitions);
    
    // Define a filter function to show approved petitions or user's own pending/rejected petitions
    const filterPetition = (p: Petition) => {
      // For pending or rejected petitions, only show if user is the creator
      if (p.adminReview.status !== 'approved') {
        if (isAuthenticated && userId) {
          const creatorId = typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy;
          return creatorId === userId;
        }
        return false;
      }
      // Always show approved petitions
      return true;
    };

    let filteredPetitions = [];
    
    switch (tabValue) {
      case 0: // All petitions (approved + user's own pending/rejected)
        filteredPetitions = petitions.filter(filterPetition);
        break;
      case 1: // Active petitions (must be approved by admin)
        filteredPetitions = petitions.filter(p => p.adminReview.status === 'approved' && p.status === 'active');
        break;
      case 2: // Completed petitions (must be approved by admin)
        filteredPetitions = petitions.filter(p => p.adminReview.status === 'approved' && p.status === 'completed');
        break;
      case 3: // Pending review (user's own only)
        filteredPetitions = petitions.filter(p => 
          p.adminReview.status === 'pending' && 
          isAuthenticated && 
          userId && 
          (typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy) === userId
        );
        break;
      case 4: // Rejected (user's own only)
        filteredPetitions = petitions.filter(p => 
          p.adminReview.status === 'rejected' && 
          isAuthenticated && 
          userId && 
          (typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy) === userId
        );
        break;
      default:
        filteredPetitions = petitions.filter(filterPetition);
    }
    
    console.log('Filtered petitions:', filteredPetitions);
    return filteredPetitions;
  };

  const calculateProgress = (petition: Petition) => {
    return Math.min(Math.round((petition.signatures.length / petition.goal) * 100), 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderPetitionCard = (petition: Petition) => {
    const progress = calculateProgress(petition);
    const creatorName = typeof petition.createdBy === 'object' ? petition.createdBy.name : 'Unknown';
    const isPending = petition.adminReview.status === 'pending';
    const isRejected = petition.adminReview.status === 'rejected';
    const isApproved = petition.adminReview.status === 'approved';
    const isActuallyActive = isApproved && petition.status === 'active';
    const isActuallyCompleted = isApproved && petition.status === 'completed';
    
    return (
      <MuiGrid item xs={12} sm={6} md={4} key={petition._id}>
        <Card sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(12px)',
          border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.2)}, ${alpha(theme.palette.common.white, 0)})`
          },
          ...(isPending && {
            border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          }),
          ...(isRejected && {
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          }),
          ...(isActuallyActive && {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          }),
        }}>
          {petition.image ? (
            <CardMedia
              component="img"
              height="160"
              image={`http://localhost:5000${petition.image}`}
              alt={petition.title}
              sx={{ 
                objectFit: 'cover',
                borderBottom: '1px solid',
                borderColor: alpha('#000', 0.05)
              }}
            />
          ) : (
            <Box 
              sx={{ 
                height: '160px', 
                bgcolor: alpha('#3f51b5', 0.05),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderBottom: '1px solid',
                borderColor: alpha('#000', 0.05)
              }}
            >
              <Typography 
                variant="overline" 
                color="primary"
                sx={{ 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 600,
                  opacity: 0.9,
                  mb: 1
                }}
              >
                {petition.category}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontStyle: 'italic',
                  maxWidth: '80%',
                  textAlign: 'center',
                  opacity: 0.7
                }}
              >
                Make a difference in our community
              </Typography>
            </Box>
          )}
          
          <CardContent sx={{ flexGrow: 1, py: 2.5, px: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Chip 
                label={petition.category} 
                size="small"
                sx={{ 
                  borderRadius: '16px', 
                  bgcolor: alpha('#3f51b5', 0.1),
                  fontWeight: 500,
                  px: 1
                }}
              />
              <Box> {/* Container for status chips */}
                {isPending && (
                  <Chip 
                    label="Pending Review" 
                    size="small" 
                    color="warning"
                    sx={{ borderRadius: '16px', fontWeight: 500 }}
                  />
                )}
                {isRejected && !isPending && (
                  <Chip 
                    label="Rejected" 
                    size="small" 
                    color="error"
                    sx={{ borderRadius: '16px', fontWeight: 500 }}
                  />
                )}
                {isActuallyActive && !isPending && !isRejected && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="primary"
                    sx={{ borderRadius: '16px', fontWeight: 500 }}
                  />
                )}
                {isActuallyCompleted && !isPending && !isRejected && !isActuallyActive && (
                  <Chip 
                    label="Completed" 
                    size="small" 
                    color="success"
                    sx={{ borderRadius: '16px', fontWeight: 500 }}
                  />
                )}
              </Box>
            </Box>
            
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                height: '2.6em',
                mb: 1.5,
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text'
              }}
            >
              {petition.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                height: '4.5em',
                lineHeight: 1.5
              }}
            >
              {truncateText(petition.description, 150)}
            </Typography>
            
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {petition.signatures.length} of {petition.goal} signatures
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: progress === 100 ? 'success.main' : 'primary.main'
                  }}
                >
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: alpha('#000', 0.05),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: progress === 100 
                      ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' 
                      : 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                  }
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 28, 
                    height: 28, 
                    mr: 1, 
                    bgcolor: 'primary.main',
                    fontSize: '0.85rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                  }}
                >
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {creatorName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.75, color: 'text.secondary', fontSize: '1rem' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {formatDate(petition.deadline)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          <CardActions sx={{ pt: 0, pb: 2.5, px: 2.5 }}>
            <Button 
              component={Link} 
              to={`/petitions/${petition._id}`}
              size="medium" 
              color="primary"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderRadius: '20px',
                ml: 'auto',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderWidth: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.15)',
                  borderWidth: 1.5
                }
              }}
            >
              View Details
            </Button>
          </CardActions>
        </Card>
      </MuiGrid>
    );
  };

  return (
    <Box sx={{
      backgroundImage: bgGradient,
      backgroundAttachment: 'fixed',
      position: 'relative',
      minHeight: '100vh',
      height: '100%',
      width: '100vw',
      maxWidth: '100%',
      py: { xs: 0, md: 0 },
      px: 0,
      mx: 0,
      my: 0,
      overflow: 'hidden',
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
        width: '100%',
        height: '100%',
        backgroundImage: bgPattern,
        backgroundSize: '180px 180px',
        opacity: theme.palette.mode === 'dark' ? 0.6 : 0.7,
        zIndex: 0
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: theme.palette.mode === 'dark' 
          ? `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.main, 0.2)}, transparent 600px)`
          : `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.light, 0.15)}, transparent 600px)`,
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg" sx={{ 
        position: 'relative',
        py: { xs: 4, md: 6 },
        zIndex: 1
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            mb: { xs: 4, md: 5 },
            gap: 2
          }}
        >
          <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                lineHeight: 1.2,
                background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                animation: 'fadeIn 0.8s ease-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              Community Petitions
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                maxWidth: '95%',
                mb: { xs: 2, md: 0 }
              }}
            >
              Support initiatives that matter to our society and create positive change
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateDialogOpen}
            sx={{ 
              borderRadius: '28px',
              px: { xs: 2.5, md: 3.5 },
              py: 1.5,
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 8px 20px rgba(63, 81, 181, 0.2)',
              background: 'linear-gradient(45deg, #3f51b5 10%, #2196f3 90%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 28px rgba(33, 150, 243, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Create Petition
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Paper 
          sx={{ 
            mb: 4, 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.65),
            backdropFilter: 'blur(15px)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.3)}, ${alpha(theme.palette.common.white, 0)})`
            }
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{ 
              style: { 
                height: '3px',
                borderRadius: '3px'
              } 
            }}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                py: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  opacity: 0.8
                }
              }
            }}
          >
            <Tab label="All Petitions" />
            <Tab label="Active" />
            <Tab label="Completed" />
            {isAuthenticated && <Tab label="Pending Review" />}
            {isAuthenticated && <Tab label="Rejected" />}
          </Tabs>
        </Paper>

        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              py: 10,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              p: 4,
              border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.2)}, ${alpha(theme.palette.common.white, 0)})`
              }
            }}
          >
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Loading petitions...
            </Typography>
          </Box>
        ) : (
          <>
            {getFilteredPetitions().length > 0 ? (
              <MuiGrid container spacing={3}>
                {getFilteredPetitions().map(petition => renderPetitionCard(petition))}
              </MuiGrid>
            ) : (
              <Paper 
                sx={{ 
                  p: { xs: 4, md: 6 }, 
                  textAlign: 'center', 
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.2)}, ${alpha(theme.palette.common.white, 0)})`
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    maxWidth: '500px',
                    mx: 'auto'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 3,
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: alpha('#e0e0e0', 0.3)
                    }}
                  >
                    {tabValue === 3 ? (
                      <span style={{ fontSize: '3rem' }}>⌛</span>
                    ) : tabValue === 4 ? (
                      <span style={{ fontSize: '3rem' }}>❌</span>
                    ) : (
                      <span style={{ fontSize: '3rem' }}>📝</span>
                    )}
                  </Box>

                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    No petitions found
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {tabValue === 0 
                      ? 'There are currently no petitions available.' 
                      : tabValue === 1 
                        ? 'There are no active petitions at the moment.' 
                        : tabValue === 2 
                          ? 'There are no completed petitions yet.'
                          : tabValue === 3
                            ? 'You have no petitions pending review.'
                            : 'You have no rejected petitions.'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateDialogOpen}
                    sx={{ 
                      borderRadius: '28px',
                      px: 3,
                      py: 1.25,
                      fontWeight: 600
                    }}
                  >
                    Create The First Petition
                  </Button>
                </Box>
              </Paper>
            )}
          </>
        )}

        {/* Create Petition Dialog */}
        <Dialog 
          open={createDialogOpen} 
          onClose={handleCreateDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { 
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(15px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.2)}, ${alpha(theme.palette.common.white, 0)})`
              }
            }
          }}
        >
          <DialogTitle sx={{ px: { xs: 2, md: 3 }, pt: 3, pb: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  animation: 'fadeIn 0.6s ease-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(-5px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                Create a New Petition
              </Typography>
              <IconButton
                onClick={handleCreateDialogClose}
                aria-label="close"
                size="small"
                sx={{ 
                  bgcolor: alpha('#000', 0.05),
                  '&:hover': {
                    bgcolor: alpha('#000', 0.1)
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, md: 3 }, pt: 2, pb: 3 }}>
            <PetitionForm onSubmitSuccess={handlePetitionCreated} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PetitionsPage; 