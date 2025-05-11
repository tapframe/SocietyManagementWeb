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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading petition...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error && !deleting) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => console.log("Navigating back to petitions list from error state")}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  if (!petition) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Petition not found
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => console.log("Navigating back to petitions list from error state")}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  if (petition.adminReview.status !== 'approved' && !isCreator) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert 
          severity={petition.adminReview.status === 'pending' ? 'info' : 'error'} 
          sx={{ mb: 3 }}
          icon={petition.adminReview.status === 'pending' ? <WarningIcon /> : <ErrorIcon />}
        >
          {petition.adminReview.status === 'pending' 
            ? 'This petition is currently pending administrative review and is not publicly available yet.' 
            : 'This petition has been rejected by an administrator and is not available.'}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            component={Link} 
            to="/petitions"
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => console.log("Navigating back to petitions list from error state")}
          >
            Go back to Petitions
          </Button>
        </Box>
      </Container>
    );
  }

  const progress = calculateProgress(petition);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {isCreator && petition.adminReview.status !== 'approved' && (
        <Alert 
          severity={petition.adminReview.status === 'pending' ? 'warning' : 'error'} 
          sx={{ mb: 3 }}
        >
          {petition.adminReview.status === 'pending' 
            ? 'Your petition is pending administrative review. It will not be publicly visible until approved.' 
            : 'Your petition has been rejected by an administrator.'}
          {petition.adminReview.notes && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Admin notes: {petition.adminReview.notes}
            </Typography>
          )}
        </Alert>
      )}

      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit"
        >
          Home
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/petitions" 
          color="inherit"
          onClick={() => console.log("Navigating back to petitions list")}
        >
          Petitions
        </MuiLink>
        <Typography color="text.primary">
          {petition.title.length > 30 ? petition.title.substring(0, 30) + '...' : petition.title}
        </Typography>
      </Breadcrumbs>

      <MuiGrid container spacing={4}>
        <MuiGrid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
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
                    fontWeight: 'medium',
                  }}
                />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {petition.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    Started by {petition.createdBy.name} • {formatDate(petition.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Chip 
                  label={getStatusText(petition)}
                  color={getStatusColor(petition.status) as any}
                  sx={{ fontWeight: 'medium', borderRadius: '16px', mb: isCreator ? 1 : 0 }}
                />
                {isCreator && (
                  <IconButton 
                    onClick={handleDeleteDialogOpen} 
                    color="error"
                    aria-label="delete petition"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>

            {petition.image && (
              <Box sx={{ mb: 4, borderRadius: '8px', overflow: 'hidden' }}>
                <img 
                  src={`http://localhost:5000${petition.image}`} 
                  alt={petition.title}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
              </Box>
            )}

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                whiteSpace: 'pre-wrap',
                lineHeight: 1.7,
              }}
            >
              {petition.description}
            </Typography>

            {petition.updates.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <UpdateIcon sx={{ mr: 1 }} />
                  Updates ({petition.updates.length})
                </Typography>
                <List sx={{ bgcolor: alpha('#f5f5f5', 0.5), borderRadius: '8px' }}>
                  {petition.updates.slice(0, 3).map((update, index) => (
                    <ListItem key={index} alignItems="flex-start" divider={index < petition.updates.length - 1}>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                            Update • {formatDate(update.addedAt)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {update.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </MuiGrid>
        
        <MuiGrid item xs={12} md={4}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: '24px' } }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Petition Progress
              </Typography>
              
              <Box sx={{ mb: 3 }}>
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
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: alpha('#000', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: progress === 100 ? 'success.main' : 'primary.main',
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                  Deadline: {formatDate(petition.deadline)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                  Category: {petition.category}
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
                  py: 1.2,
                  fontWeight: 'medium',
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {userHasSigned ? 'You have signed' : 'Sign this petition'}
              </Button>
              
              {petition.status !== 'active' && petition.adminReview.status === 'approved' && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  This petition is {petition.status.toLowerCase()} and no longer accepting signatures.
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  startIcon={<ShareIcon />} 
                  sx={{ textTransform: 'none', fontWeight: 'medium' }}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Share this petition
                </Button>
              </Box>
            </Paper>
            
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
                Recent Signatures
              </Typography>
              
              {petition.signatures.length > 0 ? (
                <List sx={{ pb: 0 }}>
                  {petition.signatures.slice(-5).reverse().map((signature, index) => (
                    <ListItem key={index} alignItems="flex-start" divider={index < Math.min(petition.signatures.length, 5) - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={signature.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {formatDate(signature.timestamp)}
                            </Typography>
                            {signature.comment && (
                              <Typography component="p" variant="body2" sx={{ mt: 0.5 }}>
                                "{signature.comment}"
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No signatures yet. Be the first to sign!
                </Typography>
              )}
              
              {petition.signatures.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{ textTransform: 'none', fontWeight: 'medium' }}
                    onClick={() => {
                      alert('View all signatures functionality to be implemented');
                    }}
                  >
                    View all {petition.signatures.length} signatures
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        </MuiGrid>
      </MuiGrid>

      <Dialog 
        open={signDialogOpen} 
        onClose={handleSignDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ pb: signSuccess ? 2 : 1 }}>
          {signSuccess ? 'Thank You!' : 'Sign this Petition'}
        </DialogTitle>
        <DialogContent sx={{ pb: signSuccess ? 3 : 2 }}>
          {signSuccess ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                Your signature has been added!
              </Typography>
              <Typography variant="body1">
                Thank you for supporting this petition.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" paragraph>
                You are about to sign: <strong>{petition?.title}</strong>
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label="Comment (Optional)"
                placeholder="Share why you\'re supporting this petition..."
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        {!signSuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleSignDialogClose} disabled={signing}>
              Cancel
            </Button>
            <Button 
              onClick={handleSignPetition} 
              variant="contained" 
              color="primary"
              disabled={signing}
              startIcon={signing && <CircularProgress size={20} />}
            >
              {signing ? 'Signing...' : 'Sign Now'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-petition-dialog-title"
        aria-describedby="delete-petition-dialog-description"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle id="delete-petition-dialog-title" sx={{ fontWeight: 'bold' }}>
          Delete Petition?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="delete-petition-dialog-description">
            Are you sure you want to delete the petition titled "<strong>{petition?.title}</strong>"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDeleteDialogClose} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeletePetition} 
            color="error" 
            variant="contained" 
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={20} color="inherit" />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default PetitionDetailPage; 