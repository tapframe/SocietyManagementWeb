import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
  Stack
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';

const ReportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    time: '',
    file: null as File | null
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    category: ''
  });

  const categories = [
    'Traffic Violation',
    'Public Nuisance',
    'Illegal Construction',
    'Pollution',
    'Public Safety',
    'Harassment',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when typing
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when selecting
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      location: '',
      category: ''
    };
    let valid = true;

    if (!formData.title) {
      newErrors.title = 'Title is required';
      valid = false;
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
      valid = false;
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
      valid = false;
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here we would normally handle report submission
      console.log('Report submitted:', formData);
      
      // For demo purposes, just show a success message
      alert('Report submitted successfully! (Demo only)');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Report a Violation
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Help maintain social order by reporting violations of rules and regulations
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Report Title"
                placeholder="Brief title describing the violation"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="location"
                name="location"
                label="Location"
                placeholder="Where did this violation occur?"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date of Incident"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="time"
                name="time"
                label="Time of Incident"
                type="time"
                value={formData.time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                placeholder="Provide a detailed description of the violation..."
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 }}
                fullWidth
              >
                Upload Evidence (Photo/Video)
                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {formData.file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  File selected: {formData.file.name}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  type="submit"
                  endIcon={<SendIcon />}
                >
                  Submit Report
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  onClick={() => {
                    setFormData({
                      title: '',
                      description: '',
                      location: '',
                      category: '',
                      date: new Date().toISOString().split('T')[0],
                      time: '',
                      file: null
                    });
                  }}
                >
                  Reset Form
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportPage; 