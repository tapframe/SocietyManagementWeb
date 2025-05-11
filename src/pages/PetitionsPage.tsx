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
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    console.log('Fetching petitions (location, auth state, or mount)');
    fetchPetitions();
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
    // const isActuallyExpired = isApproved && petition.status === 'expired'; // For future use

    return (
      <MuiGrid item xs={12} sm={6} md={4} key={petition._id}>
        <Card sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          },
          ...(isPending && {
            border: '1px dashed',
            borderColor: 'warning.main',
          }),
          ...(isRejected && {
            border: '1px dashed',
            borderColor: 'error.main',
          }),
          ...(isActuallyActive && {
            border: '1px solid',
            borderColor: 'primary.main',
          }),
          // Optional: Add border for completed if desired
          // ...(isActuallyCompleted && {
          //   border: '1px solid',
          //   borderColor: 'success.main',
          // }),
        }}>
          {petition.image ? (
            <CardMedia
              component="img"
              height="140"
              image={`http://localhost:5000${petition.image}`}
              alt={petition.title}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box 
              sx={{ 
                height: '140px', 
                bgcolor: alpha('#3f51b5', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography 
                variant="overline" 
                color="textSecondary"
                sx={{ 
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {petition.category}
              </Typography>
            </Box>
          )}
          
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip 
                label={petition.category} 
                size="small"
                sx={{ borderRadius: '16px', bgcolor: alpha('#3f51b5', 0.1) }}
              />
              <Box> {/* Container for status chips */}
                {isPending && (
                  <Chip 
                    label="Pending Review" 
                    size="small" 
                    color="warning"
                    sx={{ borderRadius: '16px' }}
                  />
                )}
                {isRejected && !isPending && (
                  <Chip 
                    label="Rejected" 
                    size="small" 
                    color="error"
                    sx={{ borderRadius: '16px' }}
                  />
                )}
                {isActuallyActive && !isPending && !isRejected && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="primary"
                    sx={{ borderRadius: '16px' }}
                  />
                )}
                {isActuallyCompleted && !isPending && !isRejected && !isActuallyActive && (
                  <Chip 
                    label="Completed" 
                    size="small" 
                    color="success"
                    sx={{ borderRadius: '16px' }}
                  />
                )}
                {/* Placeholder for Expired chip if needed later
                {isApproved && petition.status === 'expired' && !isPending && !isRejected && !isActuallyActive && !isActuallyCompleted && (
                  <Chip 
                    label="Expired" 
                    size="small" 
                    // sx={{ borderRadius: '16px', backgroundColor: grey[500], color: 'white' }} // Example
                  />
                )} */}
              </Box>
            </Box>
            
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.2,
                height: '2.4em',
                mb: 1
              }}
            >
              {petition.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                height: '4.5em'
              }}
            >
              {truncateText(petition.description, 150)}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {petition.signatures.length} of {petition.goal} signatures
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: alpha('#000', 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                  }
                }} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
                <Typography variant="body2" color="text.secondary">
                  {creatorName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(petition.deadline)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          
          <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
            <Button 
              component={Link} 
              to={`/petitions/${petition._id}`}
              size="small" 
              color="primary"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                borderRadius: '20px',
                ml: 'auto',
                textTransform: 'none',
                fontWeight: 'medium'
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Community Petitions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
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
            px: 3,
            py: 1.2,
            fontWeight: 'medium',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          }}
        >
          Create Petition
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4, borderRadius: '12px', overflow: 'hidden' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: '#3f51b5' } }}
        >
          <Tab label="All Petitions" />
          <Tab label="Active" />
          <Tab label="Completed" />
          {isAuthenticated && <Tab label="Pending Review" />}
          {isAuthenticated && <Tab label="Rejected" />}
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {getFilteredPetitions().length > 0 ? (
            <MuiGrid container spacing={3}>
              {getFilteredPetitions().map(petition => renderPetitionCard(petition))}
            </MuiGrid>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom>
                No petitions found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
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
                sx={{ mt: 2 }}
              >
                Create The First Petition
              </Button>
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
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
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
        <DialogContent sx={{ px: 3, py: 3 }}>
          <PetitionForm onSubmitSuccess={handlePetitionCreated} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PetitionsPage; 