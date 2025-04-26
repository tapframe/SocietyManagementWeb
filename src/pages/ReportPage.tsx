import React, { useState, useEffect } from 'react';
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
  Stack,
  Stepper,
  Step,
  StepLabel,
  alpha,
  useTheme,
  Chip,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const ReportPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
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

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Traffic Violation',
    'Public Nuisance',
    'Illegal Construction',
    'Pollution',
    'Public Safety',
    'Harassment',
    'Other'
  ];

  const steps = [
    { label: 'Basic Information', icon: <InfoIcon /> },
    { label: 'Violation Details', icon: <DescriptionIcon /> },
    { label: 'Evidence Upload', icon: <FileUploadIcon /> }
  ];

  // Add beautiful background theme variables
  const bgGradient = `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.primary.light, 0.1)})`;
  const bgPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  useEffect(() => {
    window.scrollTo(0, 0);
    
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
  }, []);

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

  const validateCurrentStep = () => {
    const newErrors = {
      title: '',
      description: '',
      location: '',
      category: ''
    };
    let valid = true;

    if (activeStep === 0) {
      if (!formData.title) {
        newErrors.title = 'Title is required';
        valid = false;
      }
      
      if (!formData.category) {
        newErrors.category = 'Category is required';
        valid = false;
      }
    } else if (activeStep === 1) {
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
    }

    setErrors(newErrors);
    return valid;
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

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      title: '',
      description: '',
      location: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      file: null
    });
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here we would normally handle report submission
      console.log('Report submitted:', formData);
      
      // Show success state instead of alert
      setSubmitted(true);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}>
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
                    InputProps={{
                      sx: { 
                        borderRadius: 3,
                        boxShadow: !!errors.title ? 'none' : `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                        border: `1px solid ${!!errors.title ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: !!errors.title ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: !!errors.title ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: !!errors.title ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: !!errors.title ? alpha(theme.palette.error.main, 0.5) : theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500
                      },
                      '& .MuiFormHelperText-root': {
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        mt: 1
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}>
                  <FormControl 
                    fullWidth 
                    required 
                    error={!!errors.category}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        boxShadow: !!errors.category ? 'none' : `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                        border: `1px solid ${!!errors.category ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: !!errors.category ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: !!errors.category ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: !!errors.category ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.5),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: !!errors.category ? alpha(theme.palette.error.main, 0.5) : theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      },
                      '& .MuiFormHelperText-root': {
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        mt: 1
                      }
                    }}
                  >
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formData.category}
                      label="Category"
                      onChange={handleSelectChange}
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />}
                    >
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}>
                  <TextField
                    fullWidth
                    id="date"
                    name="date"
                    label="Date of Incident"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <EventIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                      sx: { 
                        borderRadius: 3,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  '&:hover': {
                    transform: 'translateY(-3px)'
                  }
                }}>
                  <TextField
                    fullWidth
                    id="time"
                    name="time"
                    label="Time of Incident"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: { 
                        borderRadius: 3,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                  InputProps={{
                    startAdornment: <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                    sx: { borderRadius: 2 }
                  }}
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
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.info.main, 0.1), 
                    p: 2, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <InfoIcon color="info" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Please provide as much detail as possible, including specific time, exact location, 
                    individuals involved (if applicable), and any other relevant information that might 
                    help authorities address the issue effectively.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    minHeight: '200px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    }
                  }}
                  component="label"
                >
                  {!formData.file ? (
                    <>
                      <CloudUploadIcon 
                        sx={{ 
                          fontSize: 60, 
                          color: alpha(theme.palette.primary.main, 0.7),
                          mb: 2
                        }} 
                      />
                      <Typography variant="h6" gutterBottom>
                        Drag and drop or click to upload
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Support images and videos (Max size: 10MB)
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        sx={{ 
                          borderRadius: 6,
                          px: 3
                        }}
                      >
                        Browse Files
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                          File selected:
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            gap: 1,
                            p: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 2,
                            backgroundColor: 'white',
                            maxWidth: '400px',
                            margin: '0 auto'
                          }}
                        >
                          <FileUploadIcon color="primary" />
                          <Typography noWrap sx={{ flexGrow: 1 }}>
                            {formData.file.name}
                          </Typography>
                          <Tooltip title="Remove file">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setFormData(prev => ({ ...prev, file: null }));
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          Click anywhere to change the file
                        </Typography>
                      </Box>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    backgroundColor: alpha(theme.palette.warning.main, 0.1), 
                    p: 2, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
                  }}
                >
                  <HelpOutlineIcon color="warning" sx={{ mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    Providing evidence such as photos or videos can significantly help in addressing the violation. 
                    However, this is optional if you don't have any evidence to upload.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderSuccessScreen = () => (
    <Box sx={{ 
      textAlign: 'center', 
      py: 4,
      animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      '@keyframes popIn': {
        '0%': { transform: 'scale(0.8)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 }
      }
    }}>
      <Box
        sx={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 4,
          position: 'relative',
          boxShadow: `0 10px 30px ${alpha(theme.palette.success.main, 0.2)}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            borderRadius: '50%',
            border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 0
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0
              }
            }
          }
        }}
      >
        <SendIcon sx={{ 
          fontSize: 45, 
          color: theme.palette.success.main,
          animation: 'iconPop 0.5s ease-out forwards 0.3s',
          '@keyframes iconPop': {
            '0%': { transform: 'scale(0) rotate(-45deg)', opacity: 0 },
            '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: 1 },
            '100%': { transform: 'scale(1) rotate(0)', opacity: 1 }
          },
          opacity: 0
        }} />
      </Box>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 800,
          mb: 2,
          animation: 'fadeUp 0.4s ease-out forwards 0.2s',
          opacity: 0,
          '@keyframes fadeUp': {
            '0%': { transform: 'translateY(20px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 }
          }
        }}
      >
        Report Submitted Successfully!
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3,
          fontWeight: 400,
          maxWidth: '600px',
          mx: 'auto',
          animation: 'fadeUp 0.4s ease-out forwards 0.3s',
          opacity: 0
        }}
      >
        Thank you for your contribution to maintaining social order. 
        Your report has been received and will be reviewed by the authorities.
      </Typography>
      
      <Box sx={{ 
        display: 'inline-block',
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
        borderRadius: 2,
        px: 3,
        py: 2,
        mb: 4,
        background: alpha(theme.palette.success.main, 0.05),
        animation: 'fadeUp 0.4s ease-out forwards 0.4s',
        opacity: 0
      }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ fontWeight: 600 }}
        >
          Reference ID: <span style={{ color: theme.palette.success.main }}>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
        </Typography>
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleReset}
        sx={{
          borderRadius: 8,
          px: 4,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
          animation: 'fadeUp 0.4s ease-out forwards 0.5s',
          opacity: 0,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.35)}`,
          }
        }}
      >
        Submit Another Report
      </Button>
    </Box>
  );

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
      animation: 'gradientShift 15s ease infinite alternate',
      '@keyframes gradientShift': {
        '0%': { backgroundPosition: '0% 50%' },
        '100%': { backgroundPosition: '100% 50%' }
      },
      backgroundSize: '200% 200%',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: bgPattern,
        opacity: 0.3,
        zIndex: 0,
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        right: '-50%',
        bottom: '-50%',
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'pulse 10s ease-in-out infinite',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)', opacity: 0.3 },
          '50%': { transform: 'scale(1.2)', opacity: 0.5 },
          '100%': { transform: 'scale(1)', opacity: 0.3 }
        }
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      {/* Decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
        zIndex: 0,
        filter: 'blur(50px)',
        animation: 'float 20s ease-in-out infinite alternate',
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, -30px)' },
          '100%': { transform: 'translate(0, 0)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 70%)`,
        zIndex: 0,
        filter: 'blur(50px)',
        animation: 'float2 15s ease-in-out infinite alternate-reverse',
        '@keyframes float2': {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-20px, 20px)' },
          '100%': { transform: 'translate(0, 0)' }
        }
      }} />

      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          mx: 'auto',
          maxWidth: { xs: '100%', sm: '95%', md: '900px', lg: '1100px' },
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 5 }, 
            my: { xs: 2, md: 3 }, 
            borderRadius: '24px',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            boxShadow: `0 20px 80px ${alpha(theme.palette.common.black, 0.15)}`,
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 40%),
                radial-gradient(circle at top right, ${alpha(theme.palette.primary.light, 0.12)}, transparent 60%),
                radial-gradient(circle at bottom left, ${alpha(theme.palette.secondary.light, 0.1)}, transparent 60%)
              `,
              zIndex: 0,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
              <Box sx={{ 
                display: 'inline-block',
                animation: 'slideDown 0.5s ease-out forwards',
                '@keyframes slideDown': {
                  '0%': { transform: 'translateY(-20px)', opacity: 0 },
                  '100%': { transform: 'translateY(0)', opacity: 1 }
                }
              }}>
                <Chip 
                  label="Help Us Improve" 
                  color="primary" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 'bold',
                    px: 2.5,
                    py: 2.5,
                    fontSize: '0.9rem',
                    borderRadius: '50px',
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                  }} 
                />
              </Box>
              <Typography 
                component="h1" 
                variant="h3" 
                align="center" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'fadeIn 0.5s ease-out forwards 0.2s',
                  opacity: 0,
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                  }
                }}
              >
                Report a Violation
              </Typography>
              <Typography 
                variant="h6" 
                align="center" 
                color="text.secondary" 
                sx={{ 
                  mb: 1,
                  maxWidth: '600px',
                  mx: 'auto',
                  animation: 'fadeIn 0.5s ease-out forwards 0.3s',
                  opacity: 0,
                  lineHeight: 1.5
                }}
              >
                Help maintain social order by reporting violations of rules and regulations
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 3, 
                  mb: 4,
                  animation: 'widthGrow 0.6s ease-out forwards 0.4s',
                  '@keyframes widthGrow': {
                    '0%': { width: '0', opacity: 0 },
                    '100%': { width: '80px', opacity: 1 }
                  },
                  mx: 'auto',
                  height: '4px',
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
                  borderRadius: '2px'
                }} 
              />
            </Box>
            
            {!submitted ? (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ 
                position: 'relative',
                animation: 'fadeScale 0.5s ease-out forwards 0.6s',
                '@keyframes fadeScale': {
                  '0%': { transform: 'scale(0.95)', opacity: 0 },
                  '100%': { transform: 'scale(1)', opacity: 1 }
                },
                opacity: 0
              }}>
                <Box sx={{
                  position: 'relative',
                  mb: 6,
                  pb: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, 
                      transparent 0%, 
                      ${alpha(theme.palette.divider, 0.3)} 20%, 
                      ${alpha(theme.palette.divider, 0.7)} 50%, 
                      ${alpha(theme.palette.divider, 0.3)} 80%, 
                      transparent 100%
                    )`,
                  }
                }}>
                  <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel={!isMobile}
                    orientation={isMobile ? 'vertical' : 'horizontal'}
                    sx={{ 
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: theme.palette.secondary.main,
                      },
                      '& .MuiStepConnector-line': {
                        borderColor: alpha(theme.palette.divider, 0.5),
                      },
                      '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& .MuiStepLabel-label': {
                        fontWeight: 500,
                        mt: 1
                      },
                      '& .MuiStepLabel-iconContainer': {
                        background: alpha(theme.palette.background.paper, 0.8),
                        borderRadius: '50%',
                        p: 0.5,
                        svg: {
                          fontSize: 24
                        }
                      }
                    }}
                  >
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          StepIconProps={{
                            icon: step.icon
                          }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
                
                <Box sx={{ 
                  animation: 'fadeUp 0.3s ease-out',
                  '@keyframes fadeUp': {
                    '0%': { transform: 'translateY(20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                  },
                }}>
                  {renderStepContent(activeStep)}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      borderRadius: 8,
                      visibility: activeStep === 0 ? 'hidden' : 'visible',
                      px: 3,
                      py: 1.2,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.07)',
                      '&:hover': {
                        transform: 'translateX(-3px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Box>
                    <Button
                      variant="contained"
                      color={activeStep === steps.length - 1 ? "success" : "primary"}
                      onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                      endIcon={activeStep === steps.length - 1 ? <SendIcon /> : <ArrowForwardIcon />}
                      sx={{ 
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        backgroundImage: activeStep === steps.length - 1 
                          ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})` 
                          : `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        boxShadow: `0 10px 20px ${alpha(
                          activeStep === steps.length - 1 
                            ? theme.palette.success.main 
                            : theme.palette.primary.main,
                          0.3
                        )}`,
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 14px 28px ${alpha(
                            activeStep === steps.length - 1 
                              ? theme.palette.success.main 
                              : theme.palette.primary.main,
                            0.4
                          )}`,
                        }
                      }}
                    >
                      {activeStep === steps.length - 1 ? 'Submit Report' : 'Continue'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              renderSuccessScreen()
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportPage; 