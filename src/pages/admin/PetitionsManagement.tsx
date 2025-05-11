import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Avatar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import FlagIcon from '@mui/icons-material/Flag';
import { alpha } from '@mui/material/styles';
import axiosInstance from '../../utils/axiosInstance';
import { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';

interface PetitionSignature {
  user: string;
  name: string;
  comment?: string;
  timestamp: string;
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
  createdAt: string;
  updatedAt: string;
  adminReview: {
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    reviewedBy?: {
      _id: string;
      name: string;
    };
    reviewedAt?: string;
  };
}

const PetitionsManagement: React.FC = () => {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [filteredPetitions, setFilteredPetitions] = useState<Petition[]>([]);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchPetitions();
  }, []);

  useEffect(() => {
    filterPetitions();
  }, [petitions, tabValue, searchQuery]);

  const fetchPetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/petitions/admin/all');
      setPetitions(response.data);
      setFilteredPetitions(response.data);
    } catch (err: any) {
      console.error('Error fetching petitions:', err);
      setError(err.response?.data?.message || 'Failed to load petitions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterPetitions = () => {
    let result = [...petitions];

    // Filter by tab
    switch (tabValue) {
      case 0: // All
        // No filter
        break;
      case 1: // Pending Review
        result = result.filter(p => p.adminReview.status === 'pending');
        break;
      case 2: // Approved
        result = result.filter(p => p.adminReview.status === 'approved');
        break;
      case 3: // Rejected
        result = result.filter(p => p.adminReview.status === 'rejected');
        break;
      default:
        break;
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(petition => 
        petition.title.toLowerCase().includes(query) ||
        petition.description.toLowerCase().includes(query) ||
        petition.category.toLowerCase().includes(query) ||
        petition.createdBy.name.toLowerCase().includes(query)
      );
    }

    setFilteredPetitions(result);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleViewPetition = (petition: Petition) => {
    setSelectedPetition(petition);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPetition(null);
  };

  const handleOpenReviewDialog = (petition: Petition) => {
    setSelectedPetition(petition);
    setReviewStatus('approved'); // Default to approved
    setReviewNotes('');
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewStatus('approved');
    setReviewNotes('');
  };

  const handleReviewStatusChange = (event: SelectChangeEvent<string>) => {
    setReviewStatus(event.target.value as 'approved' | 'rejected');
  };

  const handleReviewNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReviewNotes(event.target.value);
  };

  const handleSubmitReview = async () => {
    if (!selectedPetition) return;

    setSubmitting(true);
    try {
      await axiosInstance.put(`/petitions/admin/${selectedPetition._id}/review`, {
        status: reviewStatus,
        notes: reviewNotes
      });

      // Update the petition in the local state
      setPetitions(prev => prev.map(p => 
        p._id === selectedPetition._id 
          ? { 
              ...p, 
              adminReview: { 
                ...p.adminReview, 
                status: reviewStatus,
                notes: reviewNotes,
                reviewedAt: new Date().toISOString()
              },
              status: reviewStatus === 'rejected' ? 'rejected' : p.status
            } 
          : p
      ));

      setSuccessMessage(`Petition successfully ${reviewStatus === 'approved' ? 'approved' : 'rejected'}.`);
      setTimeout(() => setSuccessMessage(null), 5000);
      handleCloseReviewDialog();
    } catch (err: any) {
      console.error('Error reviewing petition:', err);
      setError(err.response?.data?.message || 'Failed to update petition status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = (petition: Petition) => {
    return Math.min(Math.round((petition.signatures.length / petition.goal) * 100), 100);
  };

  const getReviewStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Approved"
            color="success"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Rejected"
            color="error"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
      case 'pending':
      default:
        return (
          <Chip
            icon={<PendingIcon />}
            label="Pending Review"
            color="warning"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
    }
  };

  const getPetitionStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            color="success"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
      case 'expired':
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label="Expired"
            color="warning"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
      case 'rejected':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Rejected"
            color="error"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
      case 'active':
      default:
        return (
          <Chip
            label="Active"
            color="primary"
            size="small"
            sx={{ borderRadius: '16px' }}
          />
        );
    }
  };

  const renderPetitionCard = (petition: Petition) => {
    const progress = calculateProgress(petition);

    return (
      <Grid item xs={12} md={6} lg={4} key={petition._id}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
            },
            borderRadius: 2,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
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
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              borderBottom: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              bgcolor: alpha(theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5', 0.3)
            }}
          >
            <Box>
              {getReviewStatusChip(petition.adminReview.status)}
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ mt: 0.5, color: 'text.secondary' }}
              >
                ID: {petition._id.substring(0, 8)}...
              </Typography>
            </Box>
            {getPetitionStatusChip(petition.status)}
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {petition.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CategoryIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {petition.category}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                By: {petition.createdBy.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(petition.createdAt)}
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                height: '80px', 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                mb: 2
              }}
            >
              {petition.description}
            </Typography>
            
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  <FlagIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  Goal: {petition.signatures.length}/{petition.goal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  mt: 0.5,
                  height: 6, 
                  borderRadius: 3,
                  bgcolor: alpha('#000', 0.08)
                }}
              />
            </Box>
          </CardContent>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              p: 2,
              pt: 1, 
              borderTop: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
              bgcolor: alpha(theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5', 0.1)
            }}
          >
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewPetition(petition)}
            >
              View Details
            </Button>
            
            {petition.adminReview.status === 'pending' && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleOpenReviewDialog(petition)}
              >
                Review
              </Button>
            )}
          </Box>
        </Card>
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        pb: 4,
        pt: 2,
      }}
    >
      <Container maxWidth={false} sx={{ 
        py: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Petitions Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Review and manage community petitions
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
              }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="All Petitions" />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PendingIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Pending Review
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Approved
                      </Box>
                    } 
                  />
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Rejected
                      </Box>
                    } 
                  />
                </Tabs>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search petitions..."
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(8px)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredPetitions.length > 0 ? (
          <Grid container spacing={3}>
            {filteredPetitions.map(petition => renderPetitionCard(petition))}
          </Grid>
        ) : (
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              borderRadius: 2,
              backdropFilter: 'blur(15px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.65),
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
            <Typography variant="h6" gutterBottom>
              No petitions found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 0 
                ? 'There are no petitions in the system.' 
                : tabValue === 1 
                  ? 'There are no petitions pending review.' 
                  : tabValue === 2 
                    ? 'There are no approved petitions.'
                    : 'There are no rejected petitions.'}
            </Typography>
          </Paper>
        )}

        {/* View Petition Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
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
            } 
          }}
        >
          {selectedPetition && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Petition Details</Typography>
                  <Box>
                    {getReviewStatusChip(selectedPetition.adminReview.status)}
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedPetition.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {getPetitionStatusChip(selectedPetition.status)}
                    <Chip 
                      label={selectedPetition.category} 
                      size="small" 
                      sx={{ borderRadius: '16px' }} 
                    />
                  </Stack>
                </Box>
                
                {selectedPetition.image && (
                  <Box sx={{ mb: 3, borderRadius: 1, overflow: 'hidden' }}>
                    <img 
                      src={`http://localhost:5000${selectedPetition.image}`} 
                      alt={selectedPetition.title}
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </Box>
                )}

                <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                  {selectedPetition.description}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Creator Information
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {selectedPetition.createdBy.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Email: {selectedPetition.createdBy.email}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Petition Timeline
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        Created: {formatDate(selectedPetition.createdAt)}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        Deadline: {formatDate(selectedPetition.deadline)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Signature Progress: {selectedPetition.signatures.length} of {selectedPetition.goal}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(selectedPetition)} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                {selectedPetition.adminReview.status !== 'pending' && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 1, mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Review Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {selectedPetition.adminReview.status}
                    </Typography>
                    {selectedPetition.adminReview.notes && (
                      <Typography variant="body2" color="text.secondary">
                        Notes: {selectedPetition.adminReview.notes}
                      </Typography>
                    )}
                    {selectedPetition.adminReview.reviewedAt && (
                      <Typography variant="body2" color="text.secondary">
                        Reviewed on: {formatDate(selectedPetition.adminReview.reviewedAt)}
                      </Typography>
                    )}
                  </Paper>
                )}

                {selectedPetition.signatures.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Recent Signatures ({selectedPetition.signatures.length})
                    </Typography>
                    <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 1, borderRadius: 1 }}>
                      {selectedPetition.signatures.slice(0, 5).map((sig, index) => (
                        <Box key={index} sx={{ p: 1, "&:not(:last-child)": { borderBottom: 1, borderColor: 'divider' } }}>
                          <Typography variant="body2" fontWeight="medium">
                            {sig.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Signed on {formatDate(sig.timestamp)}
                          </Typography>
                          {sig.comment && (
                            <Typography variant="body2" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                              "{sig.comment}"
                            </Typography>
                          )}
                        </Box>
                      ))}
                      {selectedPetition.signatures.length > 5 && (
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                          <Typography variant="body2" color="primary">
                            + {selectedPetition.signatures.length - 5} more signatures
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
                {selectedPetition.adminReview.status === 'pending' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => {
                      handleCloseDialog();
                      handleOpenReviewDialog(selectedPetition);
                    }}
                  >
                    Review Petition
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Review Petition Dialog */}
        <Dialog
          open={reviewDialogOpen}
          onClose={handleCloseReviewDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ 
            sx: { 
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
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
            } 
          }}
        >
          {selectedPetition && (
            <>
              <DialogTitle>
                Review Petition
              </DialogTitle>
              <DialogContent>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedPetition.title}
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="review-status-label">Status</InputLabel>
                  <Select
                    labelId="review-status-label"
                    value={reviewStatus}
                    onChange={handleReviewStatusChange}
                    label="Status"
                  >
                    <MenuItem value="approved">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUpIcon sx={{ mr: 1, color: 'success.main' }} />
                        Approve
                      </Box>
                    </MenuItem>
                    <MenuItem value="rejected">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbDownIcon sx={{ mr: 1, color: 'error.main' }} />
                        Reject
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  margin="normal"
                  fullWidth
                  multiline
                  rows={4}
                  label="Review Notes"
                  placeholder="Provide feedback or reasons for your decision..."
                  value={reviewNotes}
                  onChange={handleReviewNotesChange}
                />
                
                <Alert 
                  severity={reviewStatus === 'approved' ? 'info' : 'warning'} 
                  sx={{ mt: 2 }}
                >
                  {reviewStatus === 'approved' 
                    ? 'This petition will become publicly visible once approved.' 
                    : 'Rejecting will permanently mark this petition as rejected and notify the creator.'}
                </Alert>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseReviewDialog} disabled={submitting}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color={reviewStatus === 'approved' ? 'primary' : 'error'}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  startIcon={submitting && <CircularProgress size={20} />}
                >
                  {submitting 
                    ? 'Submitting...' 
                    : reviewStatus === 'approved' 
                      ? 'Approve Petition' 
                      : 'Reject Petition'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default PetitionsManagement; 