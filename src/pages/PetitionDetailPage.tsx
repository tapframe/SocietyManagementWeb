import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import { GridLegacy as MuiGrid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UpdateIcon from '@mui/icons-material/Update';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { alpha } from '@mui/material/styles';

interface PetitionSignature {
  user: string;
  name: string;
  comment?: string;
  timestamp: string;
}

interface PetitionUpdate {
  text: string;
  addedBy: string;
  addedAt: string;
}

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
  };
  signatures: PetitionSignature[];
  updates: PetitionUpdate[];
  createdAt: string;
  updatedAt: string;
  adminReview: {
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    reviewedAt?: string;
  };
}

const PetitionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signDialogOpen, setSignDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [signing, setSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [userHasSigned, setUserHasSigned] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPetition(id);
    }
  }, [id]);

  const fetchPetition = async (petitionId: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/petitions/${petitionId}`);
      setPetition(response.data);
      
      if (isAuthenticated && user && response.data.signatures) {
        const hasSigned = response.data.signatures.some(
          (sig: PetitionSignature) => sig.user === user.id
        );
        setUserHasSigned(hasSigned);
      }
      
      if (isAuthenticated && user && response.data.createdBy) {
        const creatorId = typeof response.data.createdBy === 'object' ? response.data.createdBy._id : response.data.createdBy;
        setIsCreator(creatorId === user.id);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching petition:', err);
      setError(err.response?.data?.message || 'Failed to load petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignButtonClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/petitions/${id}`, 
          message: 'You must be logged in to sign a petition' 
        } 
      });
      return;
    }
    setSignDialogOpen(true);
  };

  const handleSignDialogClose = () => {
    setSignDialogOpen(false);
    setComment('');
  };

  const handleSignPetition = async () => {
    if (!petition || !isAuthenticated) return;
    
    try {
      setSigning(true);
      
      await axiosInstance.post(`/petitions/${petition._id}/sign`, {
        comment
      });
      
      setPetition(prevPetition => {
        if (!prevPetition) return null;
        
        return {
          ...prevPetition,
          signatures: [
            ...prevPetition.signatures,
            {
              user: user?.id || '',
              name: user?.name || '',
              comment,
              timestamp: new Date().toISOString()
            }
          ],
          status: prevPetition.signatures.length + 1 >= prevPetition.goal ? 'completed' : prevPetition.status
        };
      });
      
      setUserHasSigned(true);
      setSignSuccess(true);
      
      setTimeout(() => {
        handleSignDialogClose();
        setSignSuccess(false);
      }, 1500);
      
    } catch (err: any) {
      console.error('Error signing petition:', err);
      setError(err.response?.data?.message || 'Failed to sign petition. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeletePetition = async () => {
    if (!petition || !isCreator) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/petitions/${petition._id}`);
      setDeleting(false);
      handleDeleteDialogClose();
      navigate('/petitions', { state: { message: 'Petition deleted successfully' } });
    } catch (err: any) {
      console.error('Error deleting petition:', err);
      setError(err.response?.data?.message || 'Failed to delete petition. Please try again.');
      setDeleting(false);
      handleDeleteDialogClose();
    }
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

  const daysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusText = (petition: Petition) => {
    if (petition.status === 'completed') return 'Completed';
    if (petition.status === 'expired') return 'Expired';
    if (petition.status === 'rejected') return 'Rejected';
    
    const days = daysRemaining(petition.deadline);
    return days > 0 ? `${days} days remaining` : 'Deadline reached';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'expired': return 'error';
      case 'rejected': return 'error';
      default: return 'primary';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column',
          minHeight: '50vh'
        }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              mb: 3,
              color: 'primary.main'
            }} 
          />
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Loading petition...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !deleting) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ 
              mt: 2,
              borderRadius: '28px',
              px: 4,
              py: 1.2,
              fontWeight: 600
            }}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  if (!petition) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 4,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          Petition not found
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ 
              mt: 2,
              borderRadius: '28px',
              px: 4,
              py: 1.2,
              fontWeight: 600
            }}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  if (petition.adminReview.status !== 'approved' && !isCreator) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Alert 
          severity={petition.adminReview.status === 'pending' ? 'info' : 'error'} 
          sx={{ 
            mb: 4,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: 2
          }}
          icon={petition.adminReview.status === 'pending' ? <WarningIcon fontSize="large" /> : <ErrorIcon fontSize="large" />}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {petition.adminReview.status === 'pending' ? 'Petition Under Review' : 'Petition Rejected'}
          </Typography>
          <Typography variant="body1">
            {petition.adminReview.status === 'pending' 
              ? 'This petition is currently pending administrative review and is not publicly available yet.' 
              : 'This petition has been rejected by an administrator and is not available.'}
          </Typography>
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            color="primary"
            size="large"
            sx={{ 
              mt: 2,
              borderRadius: '28px',
              px: 4,
              py: 1.2,
              fontWeight: 600
            }}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  const progress = calculateProgress(petition);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
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
      
      {isCreator && petition.adminReview.status !== 'approved' && (
        <Alert 
          severity={petition.adminReview.status === 'pending' ? 'warning' : 'error'} 
          sx={{ 
            mb: 3,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            padding: 2
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {petition.adminReview.status === 'pending' 
              ? 'Your petition is pending review' 
              : 'Your petition has been rejected'}
          </Typography>
          <Typography variant="body2">
            {petition.adminReview.status === 'pending' 
              ? 'Your petition is pending administrative review. It will not be publicly visible until approved.' 
              : 'Your petition has been rejected by an administrator.'}
          </Typography>
          {petition.adminReview.notes && (
            <Box sx={{ mt: 1, p: 1.5, bgcolor: alpha('#000', 0.04), borderRadius: '8px' }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Admin notes: {petition.adminReview.notes}
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ 
          mb: 4,
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
          '& a': {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            }
          }
        }}
      >
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit"
          sx={{ fontWeight: 500 }}
        >
          Home
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/petitions" 
          color="inherit"
          onClick={() => console.log("Navigating back to petitions list")}
          sx={{ fontWeight: 500 }}
        >
          Petitions
        </MuiLink>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
          {petition.title.length > 30 ? petition.title.substring(0, 30) + '...' : petition.title}
        </Typography>
      </Breadcrumbs>

      <MuiGrid container spacing={4}>
        <MuiGrid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 4 }, 
              mb: 4, 
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Chip 
                  label={petition.category} 
                  size="small"
                  sx={{ 
                    mb: 2, 
                    borderRadius: '16px', 
                    bgcolor: alpha('#3f51b5', 0.1),
                    fontWeight: 600,
                    px: 1
                  }}
                />
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 1.5,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    lineHeight: 1.2,
                    background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  {petition.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      mr: 1.5, 
                      bgcolor: 'primary.main',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    Started by <span style={{ fontWeight: 600 }}>{petition.createdBy.name}</span> • {formatDate(petition.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Chip 
                  label={getStatusText(petition)}
                  color={getStatusColor(petition.status) as any}
                  sx={{ 
                    fontWeight: 600, 
                    borderRadius: '16px', 
                    mb: isCreator ? 1 : 0,
                    fontSize: '0.85rem',
                    py: 0.5
                  }}
                />
                {isCreator && (
                  <IconButton 
                    onClick={handleDeleteDialogOpen} 
                    color="error"
                    aria-label="delete petition"
                    size="small"
                    sx={{
                      bgcolor: alpha('#f44336', 0.1),
                      '&:hover': {
                        bgcolor: alpha('#f44336', 0.2),
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>

            {petition.image && (
              <Box 
                sx={{ 
                  mb: 4, 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  border: '1px solid',
                  borderColor: alpha('#000', 0.05)
                }}
              >
                <img 
                  src={`http://localhost:5000${petition.image}`} 
                  alt={petition.title}
                  style={{ 
                    width: '100%', 
                    maxHeight: '480px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Box>
            )}

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                color: 'text.primary',
                fontSize: '1.05rem',
              }}
            >
              {petition.description}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ChatBubbleOutlineIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                <Typography 
                  variant="h6" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}
                >
                  Signatures ({petition.signatures.length})
                </Typography>
              </Box>
              
              {petition.signatures.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper', px: 0 }}>
                  {petition.signatures.slice()
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 10)
                    .map((signature, index) => (
                      <ListItem 
                        key={index} 
                        alignItems="flex-start"
                        sx={{ 
                          px: 0, 
                          pt: 1.5, 
                          pb: 1.5,
                          borderBottom: index < petition.signatures.length - 1 ? '1px solid' : 'none',
                          borderColor: alpha('#000', 0.08),
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: `hsl(${(index * 40) % 360}, 70%, 50%)`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                            }}
                          >
                            {signature.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              component="div"
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: 'text.primary'
                              }}
                            >
                              {signature.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ 
                                  display: 'block',
                                  mb: signature.comment ? 1 : 0,
                                  fontWeight: 500,
                                  fontSize: '0.85rem',
                                }}
                              >
                                {formatDate(signature.timestamp)}
                              </Typography>
                              {signature.comment && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ 
                                    display: 'block',
                                    color: 'text.primary',
                                    fontStyle: 'italic',
                                    padding: 1.5,
                                    borderRadius: '8px',
                                    bgcolor: alpha('#f5f5f5', 0.6),
                                    lineHeight: 1.5
                                  }}
                                >
                                  "{signature.comment}"
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  
                  {petition.signatures.length > 10 && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      align="center"
                      sx={{ 
                        mt: 2, 
                        fontStyle: 'italic',
                        fontWeight: 500,
                        pt: 1,
                        pb: 1
                      }}
                    >
                      + {petition.signatures.length - 10} more signatures
                    </Typography>
                  )}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    py: 4, 
                    px: 3, 
                    textAlign: 'center',
                    bgcolor: alpha('#f5f5f5', 0.4),
                    borderRadius: '12px'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Be the first to sign this petition!
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </MuiGrid>
        
        <MuiGrid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: '24px' } }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, md: 3.5 }, 
                mb: 4, 
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  mb: 2.5,
                }}
              >
                Petition Progress
              </Typography>
              
              <Box sx={{ mb: 3.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {petition.signatures.length} of {petition.goal} signatures
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700,
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
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: alpha('#000', 0.05),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: progress === 100 
                        ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' 
                        : 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
                    }
                  }} 
                />
                
                <Box 
                  sx={{ 
                    mt: 2.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 1.5,
                    borderRadius: '8px',
                    bgcolor: alpha(progress === 100 ? '#4caf50' : '#3f51b5', 0.08)
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: progress === 100 ? 'success.main' : 'primary.main',
                    }}
                  >
                    {progress === 100 
                      ? '🎉 Goal reached! Thank you for your support!' 
                      : `Only ${petition.goal - petition.signatures.length} more signatures needed`}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2.5 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1.5,
                    fontWeight: 500
                  }}
                >
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1.5 }} />
                  <span style={{ fontWeight: 600 }}>Deadline:</span>&nbsp;{formatDate(petition.deadline)}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 500
                  }}
                >
                  <CategoryIcon fontSize="small" sx={{ mr: 1.5 }} />
                  <span style={{ fontWeight: 600 }}>Category:</span>&nbsp;{petition.category}
                </Typography>
              </Box>
              
              <Button 
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<HowToVoteIcon />}
                onClick={handleSignButtonClick}
                disabled={userHasSigned || petition.status !== 'active' || (petition.adminReview.status !== 'approved' && !isCreator)}
                sx={{ 
                  borderRadius: '28px',
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(63, 81, 181, 0.25)',
                  background: 'linear-gradient(45deg, #3f51b5 10%, #2196f3 90%)',
                  transition: 'all 0.3s ease',
                  '&:not(:disabled):hover': {
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.35)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    opacity: 0.7
                  }
                }}
              >
                {userHasSigned ? 'You have signed' : 'Sign this petition'}
              </Button>
              
              {petition.status !== 'active' && petition.adminReview.status === 'approved' && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mt: 2, 
                    textAlign: 'center',
                    fontStyle: 'italic',
                    opacity: 0.8
                  }}
                >
                  This petition is {petition.status.toLowerCase()} and no longer accepting signatures.
                </Typography>
              )}
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                sx={{ 
                  borderRadius: '28px',
                  fontWeight: 600,
                  textTransform: 'none',
                  width: '100%'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setError('Petition link copied to clipboard!');
                  setTimeout(() => setError(null), 3000);
                }}
              >
                Share Petition
              </Button>
            </Paper>
          </Box>
        </MuiGrid>
      </MuiGrid>

      <Dialog 
        open={signDialogOpen} 
        onClose={signing ? undefined : handleSignDialogClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: signSuccess ? 2 : 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: signSuccess 
                  ? 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)' 
                  : 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text'
              }}
            >
              {signSuccess ? 'Thank You!' : 'Sign This Petition'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ px: 3, pt: 2, pb: 3 }}>
          {signSuccess ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  color: 'white',
                  mb: 3,
                  fontSize: '2.5rem'
                }}
              >
                ✓
              </Box>
              <Typography variant="h6" gutterBottom>
                Your signature has been added!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Thank you for supporting this petition.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You're signing: <strong>{petition.title}</strong>
              </Typography>
              
              <TextField
                autoFocus
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                label="Comment (Optional)"
                placeholder="Share why you're signing this petition..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={signing}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        
        {!signSuccess && (
          <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
            <Button 
              onClick={handleSignDialogClose} 
              color="inherit"
              disabled={signing}
              sx={{ 
                borderRadius: '28px',
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSignPetition} 
              color="primary"
              variant="contained"
              disabled={signing}
              sx={{ 
                borderRadius: '28px',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 4px 14px rgba(63, 81, 181, 0.2)',
                background: 'linear-gradient(45deg, #3f51b5 10%, #2196f3 90%)',
              }}
            >
              {signing ? 'Signing...' : 'Sign Now'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={deleting ? undefined : handleDeleteDialogClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { 
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: alpha('#f44336', 0.05), px: 3, pt: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
            <WarningIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Delete Petition?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="body1" paragraph>
            Are you sure you want to delete this petition? This action is permanent and cannot be undone.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            "{petition.title}"
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={handleDeleteDialogClose}
            disabled={deleting}
            sx={{ 
              borderRadius: '28px',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePetition}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ 
              borderRadius: '28px',
              fontWeight: 600,
              bgcolor: 'error.main',
              '&:hover': {
                bgcolor: 'error.dark',
              }
            }}
          >
            {deleting ? 'Deleting...' : 'Delete Petition'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetitionDetailPage; 