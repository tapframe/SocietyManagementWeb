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
  useMediaQuery,
  Card,
  CardContent,
  CardActionArea,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
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
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import { useAuth } from '../context/AuthContext';
import { REPORT_ENDPOINTS } from '../config';

// Sample recent reports data
const recentReports = [
  {
    id: 'VR-2023-0012',
    title: 'Unauthorized parking in reserved space',
    type: 'violation',
    date: '2023-10-15',
    status: 'resolved',
    location: 'Block B Parking Area'
  },
  {
    id: 'CP-2023-0034',
    title: 'Water leakage in hallway',
    type: 'complaint',
    date: '2023-10-12',
    status: 'in-progress',
    location: 'Tower C, 3rd Floor'
  },
  {
    id: 'VR-2023-0011',
    title: 'Noise disturbance after hours',
    type: 'violation',
    date: '2023-10-10',
    status: 'resolved',
    location: 'Block A, Apartment 304'
  },
  {
    id: 'CP-2023-0033',
    title: 'Elevator malfunction',
    type: 'complaint',
    date: '2023-10-08',
    status: 'resolved',
    location: 'Tower B'
  }
];

const ReportPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [reportType, setReportType] = useState<'violation' | 'complaint' | 'official' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    time: '',
    file: null as File | null,
    officialId: '' // New field for official ID/badge number
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    officialId: '' // Add error field for official ID
  });

  const [submitted, setSubmitted] = useState(false);

  const violationCategories = [
    'Traffic Violation',
    'Public Nuisance',
    'Illegal Construction',
    'Pollution',
    'Public Safety',
    'Harassment',
    'Other'
  ];

  const complaintCategories = [
    'Service Issue',
    'Facility Maintenance',
    'Staff Behavior',
    'Security Concern',
    'Noise Complaint',
    'Utility Problem',
    'Other'
  ];

  // Add official categories
  const officialCategories = [
    'Police Officer',
    'Municipal Officer',
    'Society Staff',
    'Security Personnel',
    'Maintenance Staff',
    'Administrative Staff',
    'Other'
  ];

  // Choose categories based on report type
  const categories = reportType === 'violation' 
    ? violationCategories 
    : reportType === 'complaint' 
      ? complaintCategories 
      : officialCategories;

  const steps = [
    { label: 'Basic Information', icon: <InfoIcon /> },
    { label: reportType === 'violation' ? 'Violation Details' : reportType === 'complaint' ? 'Complaint Details' : 'Official Report Details', icon: <DescriptionIcon /> },
    { label: 'Evidence Upload', icon: <FileUploadIcon /> },
    { label: 'Review & Submit', icon: <CheckCircleIcon /> }
  ];

  // Add beautiful background theme variables
  const bgGradient = `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.9)} 30%, ${alpha(theme.palette.secondary.dark, 0.3)} 100%)`;
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.08'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const { isAuthenticated, getToken } = useAuth();

  // Ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleReportTypeSelect = (type: 'violation' | 'complaint' | 'official') => {
    setReportType(type);
    // Reset form data when changing report type
    setFormData({
      ...formData,
      category: '', // Reset category as the options will change
      officialId: '' // Reset official ID
    });
  };

  const validateCurrentStep = () => {
    const newErrors = {
      title: '',
      description: '',
      location: '',
      category: '',
      officialId: ''
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

      // Validate official ID if report type is official
      if (reportType === 'official' && !formData.officialId) {
        newErrors.officialId = 'Official ID or badge number is required';
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
      category: '',
      officialId: ''
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

    // Validate official ID if report type is official
    if (reportType === 'official' && !formData.officialId) {
      newErrors.officialId = 'Official ID or badge number is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault(); // Prevent default button action
    }
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault(); // Prevent default button action
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setReportType(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      file: null,
      officialId: ''
    });
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Show loading or submission state
        
        // Format the data for submission
        const reportData = {
          title: formData.title,
          description: formData.description,
          type: reportType,
          category: formData.category,
          location: formData.location,
          date: formData.date,
          time: formData.time,
          officialId: reportType === 'official' ? formData.officialId : undefined,
          // Handle file evidence separately if needed
        };
        
        // Get auth token
        const token = getToken();
        
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }
        
        // Submit to API
        const response = await fetch(REPORT_ENDPOINTS.CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reportData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit report');
        }
        
        const reportResult = await response.json();
        
        // If file is present, handle file upload
        if (formData.file) {
          // Create a form data object for file upload
          const fileData = new FormData();
          fileData.append('file', formData.file);
          
          // Upload the file
          const fileResponse = await fetch(REPORT_ENDPOINTS.UPLOAD_EVIDENCE(reportResult._id), {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: fileData
          });
          
          if (!fileResponse.ok) {
            console.error('File upload failed, but report was created');
          }
        }
        
        // Show success message
        setSubmitted(true);
        
      } catch (error) {
        console.error('Error submitting report:', error);
        // Show error message to user
        alert(error instanceof Error ? error.message : 'Failed to submit report');
      }
    }
  };

  // Render the report type selection screen
  const renderReportTypeSelection = () => (
    <Box sx={{ 
      mt: 4, 
      animation: 'fadeIn 0.5s ease-out forwards',
      '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 }
      }
    }}>
      <Box sx={{ mb: 5 }}>
        <Chip 
          label="Help us improve our community"
          color="primary"
          sx={{ 
            mb: 2,
            px: 2, 
            py: 2.5,
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 8
          }}
        />
        <Typography variant="h4" gutterBottom align="center" sx={{ 
          mb: 3, 
          fontWeight: 700,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          What would you like to report?
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: 750, mx: 'auto', mb: 4 }}>
          Please select the appropriate option below. Your input helps maintain our community standards and improve services for everyone.
        </Typography>
      </Box>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={4} 
            sx={{ 
              borderRadius: 4,
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: `0 15px 35px ${alpha(theme.palette.error.main, 0.25)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(12px)',
              }
            }}
          >
            <CardActionArea 
              onClick={() => handleReportTypeSelect('violation')}
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ReportProblemIcon sx={{ fontSize: 60, color: theme.palette.error.main }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Report a Violation
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Report violations of society rules, illegal activities, or improper behavior within the society premises.
              </Typography>
              <Box sx={{ width: '100%', mt: 3 }}>
                <Chip 
                  size="small" 
                  label="Response time: 24-48 hours" 
                  sx={{ 
                    mt: 2, 
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    color: theme.palette.error.main,
                    fontWeight: 500
                  }} 
                />
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={4} 
            sx={{ 
              borderRadius: 4,
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: `0 15px 35px ${alpha(theme.palette.info.main, 0.25)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(12px)',
              }
            }}
          >
            <CardActionArea 
              onClick={() => handleReportTypeSelect('complaint')}
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <FeedbackIcon sx={{ fontSize: 60, color: theme.palette.info.main }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Register a Complaint
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Submit complaints about services, facilities, staff behavior, or any other issues affecting your experience.
              </Typography>
              <Box sx={{ width: '100%', mt: 3 }}>
                <Chip 
                  size="small" 
                  label="Response time: 3-5 days" 
                  sx={{ 
                    mt: 2, 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    fontWeight: 500
                  }} 
                />
              </Box>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={4} 
            sx={{ 
              borderRadius: 4,
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: `0 15px 35px ${alpha(theme.palette.warning.main, 0.25)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(12px)',
              }
            }}
          >
            <CardActionArea 
              onClick={() => handleReportTypeSelect('official')}
              sx={{ 
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  borderRadius: '50%',
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <GavelIcon sx={{ fontSize: 60, color: theme.palette.warning.main }} />
              </Box>
              <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Report an Official
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Report issues related to police officers and other officials, such as misconduct, corruption, or negligence.
              </Typography>
              <Box sx={{ width: '100%', mt: 3 }}>
                <Chip 
                  size="small" 
                  label="Response time: 1-2 days" 
                  sx={{ 
                    mt: 2, 
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    fontWeight: 500
                  }} 
                />
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Reports Summary */}
      <Box sx={{ mt: 6, mb: 3 }}>
        <Divider sx={{ mb: 4 }}>
          <Chip label="Recent Activity" />
        </Divider>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.08)}`,
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <ReportProblemIcon sx={{ color: theme.palette.error.main }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    23
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Violations Reported
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.08)}`,
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <FeedbackIcon sx={{ color: theme.palette.info.main }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    17
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complaints Registered
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This Month
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              borderRadius: 3, 
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.08)}`,
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Box component="span" sx={{ 
                    color: theme.palette.success.main,
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                  }}>85%</Box>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    Resolution Rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average response time: 36 hours
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last 30 Days
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Reports List */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Recent Reports & Their Status
        </Typography>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            backgroundColor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            '& .MuiListItem-root': {
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)',
            }
          }}
        >
          <List sx={{ p: 0 }}>
            {recentReports.map((report, index) => (
              <React.Fragment key={report.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem
                  sx={{ 
                    py: 2,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03)
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: report.type === 'violation' 
                          ? alpha(theme.palette.error.main, 0.1) 
                          : report.type === 'complaint' 
                            ? alpha(theme.palette.info.main, 0.1)
                            : alpha(theme.palette.warning.main, 0.1),
                        color: report.type === 'violation' 
                          ? theme.palette.error.main 
                          : report.type === 'complaint' 
                            ? theme.palette.info.main
                            : theme.palette.warning.main
                      }}
                    >
                      {report.type === 'violation' 
                        ? <ReportProblemIcon fontSize="small" /> 
                        : report.type === 'complaint' 
                          ? <FeedbackIcon fontSize="small" />
                          : <GavelIcon fontSize="small" />}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          {report.title}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={report.id} 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem' }}>
                          <LocationOnIcon fontSize="inherit" />
                          {report.location}
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', minWidth: 100, textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      {report.date}
                    </Typography>
                    <Chip
                      size="small"
                      icon={report.status === 'resolved' ? <CheckCircleIcon fontSize="small" /> : <AccessTimeIcon fontSize="small" />}
                      label={report.status === 'resolved' ? 'Resolved' : 'In Progress'}
                      color={report.status === 'resolved' ? 'success' : 'warning'}
                      sx={{ height: 24, fontSize: '0.7rem' }}
                    />
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Divider sx={{ mb: 4 }}>
          <Chip label="Frequently Asked Questions" />
        </Divider>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                What happens after I submit a report?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your report is reviewed by our team within the stated response time. 
                You'll receive a confirmation email with a reference number for tracking your report.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Can I submit an anonymous report?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, you can choose to remain anonymous when submitting violations. However, 
                for complaints that require follow-up, we'll need your contact information.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                How can I track the status of my report?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can use the reference number provided after submission to check the status 
                of your report through the Society Management Dashboard or by contacting the management office.
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                What if my issue doesn't fit either category?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can still submit using the "Other" category in either form. For urgent issues 
                requiring immediate attention, please contact our emergency hotline directly.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Emergency Contact Banner */}
      <Box 
        sx={{ 
          mt: 6,
          p: 3,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <Box 
          sx={{ 
            bgcolor: alpha(theme.palette.warning.main, 0.2), 
            borderRadius: '50%',
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Typography 
            variant="h5" 
            component="span" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.warning.dark 
            }}
          >!</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.dark, mb: 0.5 }}>
            For Emergencies
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            This form is not for reporting emergencies. For immediate assistance with urgent matters, please use the emergency contact below.
          </Typography>
          <Button 
            variant="contained"
            color="warning"
            sx={{ 
              borderRadius: 8,
              px: 3,
              fontWeight: 600,
              boxShadow: `0 4px 10px ${alpha(theme.palette.warning.main, 0.3)}`
            }}
          >
            Emergency Hotline: 1800-123-4567
          </Button>
        </Box>
      </Box>
    </Box>
  );

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
                    label={
                      reportType === 'violation' 
                        ? "Violation Title" 
                        : reportType === 'complaint' 
                          ? "Complaint Title" 
                          : "Official Report Title"
                    }
                    placeholder={
                      reportType === 'violation' 
                        ? "Brief title describing the violation" 
                        : reportType === 'complaint' 
                          ? "Brief title describing your complaint" 
                          : "Brief title describing the issue with the official"
                    }
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
              
              {/* Official ID field - only show for official reports */}
              {reportType === 'official' && (
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
                      id="officialId"
                      name="officialId"
                      label="Official ID/Badge Number"
                      placeholder="Enter the official's ID or badge number"
                      value={formData.officialId}
                      onChange={handleChange}
                      error={!!errors.officialId}
                      helperText={errors.officialId}
                      InputProps={{
                        startAdornment: <GavelIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                        sx: { 
                          borderRadius: 3,
                          boxShadow: !!errors.officialId ? 'none' : `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                          border: `1px solid ${!!errors.officialId ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.2)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: !!errors.officialId ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                          },
                          '&.Mui-focused': {
                            boxShadow: !!errors.officialId ? 'none' : `0 6px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                          }
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: !!errors.officialId ? alpha(theme.palette.error.main, 0.5) : alpha(theme.palette.primary.main, 0.5),
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: !!errors.officialId ? alpha(theme.palette.error.main, 0.5) : theme.palette.primary.main,
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
              )}
              
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
                  placeholder={reportType === 'violation' 
                    ? "Where did this violation occur?" 
                    : reportType === 'complaint' 
                      ? "Where did this issue occur?"
                      : "Where did this issue occur with the official?"}
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
                  placeholder={reportType === 'violation'
                    ? "Provide a detailed description of the violation..."
                    : reportType === 'complaint'
                      ? "Provide a detailed description of your complaint..."
                      : "Provide a detailed description of the issue with the official..."}
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
                    {reportType === 'violation'
                      ? "Please provide as much detail as possible, including specific time, exact location, individuals involved (if applicable), and any other relevant information that might help authorities address the issue effectively."
                      : reportType === 'complaint'
                        ? "Please provide as much detail as possible about your complaint, including when it happened, who was involved, and what specific issues you experienced. This will help us address your concerns more effectively."
                        : "Please provide as much detail as possible about the issue with the official, including when it happened, who was involved, and what specific issues you experienced. This will help us address the issue more effectively."}
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
                        onClick={() => fileInputRef.current?.click()}
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
                    ref={fileInputRef}
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
                    {reportType === 'violation'
                      ? "Providing evidence such as photos or videos can significantly help in addressing the violation. However, this is optional if you don't have any evidence to upload."
                      : reportType === 'complaint'
                        ? "Supporting documentation or images related to your complaint can help us understand and resolve the issue more effectively. This step is optional if you don't have any materials to upload."
                        : "Providing evidence such as photos or videos can significantly help in addressing the issue with the official. However, this is optional if you don't have any evidence to upload."}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 3: // Review & Submit Step
        return (
          <Box sx={{ mt: 4, p:3, backgroundColor: alpha(theme.palette.background.paper, 0.8), borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Review Your {
                reportType === 'violation' ? 'Violation Report' : 
                reportType === 'complaint' ? 'Complaint' : 
                'Official Report'}
            </Typography>
            <Paper elevation={0} sx={{ p:2, mb:2, borderRadius:2, border: `1px solid ${alpha(theme.palette.divider,0.2)}`}}>
              <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 500}}>Basic Information:</Typography>
              <Typography variant="body2"><strong>Title:</strong> {formData.title}</Typography>
              <Typography variant="body2"><strong>Category:</strong> {formData.category}</Typography>
              {reportType === 'official' && (
                <Typography variant="body2"><strong>Official ID/Badge:</strong> {formData.officialId}</Typography>
              )}
              <Typography variant="body2"><strong>Date:</strong> {formData.date}</Typography>
              {formData.time && <Typography variant="body2"><strong>Time:</strong> {formData.time}</Typography>}
            </Paper>
            <Paper elevation={0} sx={{ p:2, mb:2, borderRadius:2, border: `1px solid ${alpha(theme.palette.divider,0.2)}`}}>
              <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 500}}>Details:</Typography>
              <Typography variant="body2"><strong>Location:</strong> {formData.location}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {formData.description}</Typography>
            </Paper>
            {formData.file && (
              <Paper elevation={0} sx={{ p:2, mb:2, borderRadius:2, border: `1px solid ${alpha(theme.palette.divider,0.2)}`}}>
                <Typography variant="subtitle1" gutterBottom sx={{fontWeight: 500}}>Evidence:</Typography>
                <Typography variant="body2"><strong>File:</strong> {formData.file.name}</Typography>
              </Paper>
            )}
            <Alert severity="info" sx={{ mt: 2 }}>
              Please review all the information carefully before submitting.
            </Alert>
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
        {reportType === 'violation' ? 'Violation Report Submitted!' : reportType === 'complaint' ? 'Complaint Registered Successfully!' : 'Official Report Submitted Successfully!'}
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
        {reportType === 'violation' 
          ? 'Thank you for your contribution to maintaining social order. Your violation report has been received and will be reviewed by the authorities.'
          : reportType === 'complaint'
            ? 'Thank you for sharing your concerns with us. Your complaint has been registered and will be addressed by our team.'
            : 'Thank you for reporting the issue with the official. Your report has been received and will be reviewed by the appropriate authorities.'}
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
        Submit Another {reportType === 'violation' ? 'Report' : reportType === 'complaint' ? 'Complaint' : 'Official Report'}
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
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: bgPattern,
        backgroundSize: '200px 200px',
        opacity: 0.5,
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg">
        <Box 
          component="main" 
          sx={{ 
            position: 'relative',
            pt: { xs: 3, sm: 4 },
            pb: { xs: 8, sm: 12 },
            px: { xs: 2, sm: 4 },
            zIndex: 1
          }}
        >
          {!submitted ? (
            <>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  mb: 4,
                  backgroundColor: alpha(theme.palette.background.paper, 0.65),
                  backdropFilter: 'blur(15px)',
                  borderRadius: { xs: 2, sm: 4 },
                  border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
                  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.15)}`,
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
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
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                  fontWeight: 800, 
                  mb: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'fadeIn 0.8s ease-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}>
                  {reportType === null ? 'Report an Issue' : 
                   reportType === 'violation' ? 'Report a Violation' : 
                   reportType === 'complaint' ? 'Register a Complaint' : 
                   'Report an Official'}
                </Typography>
                
                {/* Instruction panel shown only when no report type is selected */}
                {!reportType && (
                  <Box sx={{ 
                    mb: 4, 
                    backgroundColor: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(8px)',
                    borderRadius: 2,
                    p: 2.5,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
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
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        How to use this page
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Use this page to report violations of community rules or register complaints about services. 
                      Choose the appropriate option below, then follow the guided steps to provide details. 
                      Remember to be specific and include evidence where possible.
                    </Typography>
                  </Box>
                )}
                
                {!reportType ? (
                  renderReportTypeSelection()
                ) : (
                  <>
                    <Stepper 
                      activeStep={activeStep} 
                      alternativeLabel={!isMobile}
                      orientation={isMobile ? 'vertical' : 'horizontal'}
                      sx={{ 
                        mb: 4,
                        '& .MuiStepLabel-label': {
                          mt: 0.5,
                          fontWeight: 500
                        },
                        '& .MuiStepIcon-root': {
                          fontSize: 32,
                          '&.Mui-active': {
                            color: theme.palette.secondary.main,
                            filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.secondary.main, 0.5)})`
                          },
                          '&.Mui-completed': {
                            color: theme.palette.primary.main,
                          }
                        }
                      }}
                    >
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel 
                            StepIconComponent={({ active, completed }) => (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: active 
                                    ? alpha(theme.palette.secondary.main, 0.1)
                                    : completed 
                                      ? alpha(theme.palette.primary.main, 0.1)
                                      : theme.palette.grey[100],
                                  color: active 
                                    ? theme.palette.secondary.main
                                    : completed 
                                      ? theme.palette.primary.main
                                      : theme.palette.text.secondary,
                                  transition: 'all 0.3s ease',
                                  boxShadow: active 
                                    ? `0 4px 12px ${alpha(theme.palette.secondary.main, 0.25)}`
                                    : 'none',
                                }}
                              >
                                {React.cloneElement(step.icon, { 
                                  sx: { 
                                    fontSize: 24,
                                    animation: active ? 'pulse 2s infinite' : 'none',
                                    '@keyframes pulse': {
                                      '0%': { transform: 'scale(1)' },
                                      '50%': { transform: 'scale(1.1)' },
                                      '100%': { transform: 'scale(1)' }
                                    }
                                  } 
                                })}
                              </Box>
                            )}
                          >
                            {step.label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    
                    <form onSubmit={handleSubmit}>
                      {renderStepContent(activeStep)}
                      
                      <Stack 
                        direction={{ xs: 'column', sm: 'row' }} 
                        spacing={2} 
                        sx={{ 
                          mt: 4, 
                          justifyContent: 'space-between',
                          flexDirection: isMobile ? 'column' : (activeStep === 0 ? 'row-reverse' : 'row')
                        }}
                      >
                        {activeStep === 0 ? (
                          <Button
                            variant="outlined"
                            onClick={(e) => { // Modified onClick
                              if (e) e.preventDefault();
                              setReportType(null);
                            }}
                            startIcon={<ArrowBackIcon />}
                            type="button" 
                            sx={{
                              borderRadius: 8,
                              px: 3,
                              py: 1.25,
                              fontWeight: 600,
                              borderWidth: 2,
                              textTransform: 'none',
                              width: isMobile ? '100%' : 'auto',
                              '&:hover': {
                                borderWidth: 2,
                              }
                            }}
                          >
                            Back to Selection
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={(e) => handleBack(e)} // Pass event to handleBack
                            startIcon={<ArrowBackIcon />}
                            type="button" 
                            sx={{
                              borderRadius: 8,
                              px: 3,
                              py: 1.25,
                              fontWeight: 600,
                              borderWidth: 2,
                              textTransform: 'none',
                              width: isMobile ? '100%' : 'auto',
                              '&:hover': {
                                borderWidth: 2,
                              }
                            }}
                          >
                            Back
                          </Button>
                        )}

                        {activeStep === steps.length - 1 ? (
                          <Button
                            type="submit" // This one is correct
                            variant="contained"
                            endIcon={<SendIcon />}
                            sx={{
                              borderRadius: 8,
                              px: 4,
                              py: 1.5,
                              fontWeight: 600,
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              textTransform: 'none',
                              width: isMobile ? '100%' : 'auto',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                              }
                            }}
                          >
                            Submit {reportType === 'violation' ? 'Violation Report' : reportType === 'complaint' ? 'Complaint' : 'Official Report'}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={(e) => handleNext(e)} // Pass event to handleNext
                            type="button" 
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              borderRadius: 8,
                              px: 4,
                              py: 1.5,
                              fontWeight: 600,
                              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              textTransform: 'none',
                              width: isMobile ? '100%' : 'auto',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: `0 12px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                              }
                            }}
                          >
                            Continue
                          </Button>
                        )}
                      </Stack>
                    </form>
                  </>
                )}
              </Paper>
            </>
          ) : (
            renderSuccessScreen()
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ReportPage; 