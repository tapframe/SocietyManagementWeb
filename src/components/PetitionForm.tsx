import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Stack,
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FlagIcon from '@mui/icons-material/Flag';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { format } from 'date-fns';

interface PetitionFormProps {
  onSubmitSuccess?: (petitionId: string) => void;
}

const PetitionForm: React.FC<PetitionFormProps> = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goal: 100,
    deadline: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default 30 days from now
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [petitionId, setPetitionId] = useState<string | null>(null);

  // Category options
  const categories = [
    'Infrastructure',
    'Safety',
    'Amenities',
    'Maintenance',
    'Community Events',
    'Environmental',
    'Parking',
    'Noise',
    'Waste Management',
    'Other'
  ];

  const steps = ['Basic Information', 'Details', 'Review'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e: any) => {
    setFormData({ ...formData, category: e.target.value as string });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be less than 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.title.trim() || !formData.category) {
        setError('Please fill in all required fields in this step');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.description.trim() || !formData.goal || !formData.deadline) {
        setError('Please fill in all required fields in this step');
        return;
      }
      
      // Validate deadline
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        setError('Deadline must be in the future');
        return;
      }
    }
    
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create a petition');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create petition
      const response = await axiosInstance.post('/petitions', formData);
      const { _id } = response.data;
      setPetitionId(_id);
      
      // Upload image if provided
      if (imageFile && _id) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        await axiosInstance.post(`/petitions/${_id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setSuccess(true);
      
      // Call the success callback if provided
      if (onSubmitSuccess && _id) {
        onSubmitSuccess(_id);
      }
      
      console.log("Petition created successfully, ID:", _id);
      
      // Redirect to the petition page after 2 seconds
      setTimeout(() => {
        console.log("Redirecting to petition detail page");
        navigate(`/petitions/${_id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating petition:', err);
      setError(err.response?.data?.message || 'Failed to create petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Petition Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Enter a clear, concise title for your petition"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    label="Category"
                    startAdornment={
                      <InputAdornment position="start">
                        <CategoryIcon />
                      </InputAdornment>
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Description"
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Describe the purpose of your petition and why people should sign it"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  name="goal"
                  label="Signature Goal"
                  variant="outlined"
                  value={formData.goal}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlagIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 10 }
                  }}
                  helperText="Minimum 10 signatures"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  name="deadline"
                  label="Deadline"
                  variant="outlined"
                  value={formData.deadline}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="When the petition will close"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Petition Image (Optional)
                </Typography>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-file">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                  >
                    Upload Image
                  </Button>
                </label>
                {imagePreview && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={imagePreview}
                      alt="Petition preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Petition
            </Typography>
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '8px' }}>
              <Typography variant="h5" gutterBottom>
                {formData.title}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <CategoryIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {formData.category}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <FlagIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Goal: {formData.goal} signatures
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <DateRangeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Deadline: {new Date(formData.deadline).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {formData.description}
              </Typography>
              {imagePreview && (
                <Box mt={2} textAlign="center">
                  <img
                    src={imagePreview}
                    alt="Petition preview"
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Paper>
            <Alert severity="info">
              Your petition will be reviewed by an administrator before it becomes publicly available.
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your petition has been successfully created!
        </Typography>
        <Typography variant="body1" paragraph>
          Redirecting to your petition page... It will be visible to you while pending approval.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Note: Your petition will need admin approval before others can see it.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 4, borderRadius: '12px' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? 'Submitting...' : 'Submit Petition'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default PetitionForm;

const Divider = ({ sx }: { sx?: any }) => (
  <Box 
    sx={{ 
      height: '1px', 
      backgroundColor: 'divider',
      width: '100%',
      ...sx
    }} 
  />
); 