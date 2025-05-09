import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
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
  Tabs,
  Tab,
  useTheme,
  Badge,
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import InboxIcon from '@mui/icons-material/Inbox';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

interface Report {
  _id: string;
  title: string;
  description: string;
  type: 'violation' | 'complaint';
  category: string;
  location: string;
  date: string;
  time?: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  evidence?: string;
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  comments?: Array<{
    text: string;
    user: {
      _id: string;
      name: string;
      role: string;
    };
    createdAt: string;
  }>;
  adminNotes?: Array<{
    text: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          py: 3,
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const MyReports: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all'
  });

  // Add beautiful background theme variables
  const theme = useTheme();
  const bgGradient = `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.background.default, 0.9)})`;
  const bgPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters, searchQuery, tabValue]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint should return only reports submitted by the current user
      const response = await axiosInstance.get('/reports');
      setReports(response.data);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(`Failed to load reports: ${err.response?.data?.message || err.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...reports];

    // First apply tab filter (All, Pending, Resolved, Rejected)
    if (tabValue === 1) { // Pending
      result = result.filter(report => report.status === 'pending' || report.status === 'in-progress');
    } else if (tabValue === 2) { // Resolved
      result = result.filter(report => report.status === 'resolved');
    } else if (tabValue === 3) { // Rejected
      result = result.filter(report => report.status === 'rejected');
    }

    // Apply report type filter
    if (filters.type !== 'all') {
      result = result.filter(report => report.type === filters.type);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(report => report.category === filters.category);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.location.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query)
      );
    }

    setFilteredReports(result);
  };

  const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as string;
    const value = event.target.value as string;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const getReportTypeIcon = (type: string) => {
    return type === 'violation' 
      ? <ReportProblemIcon fontSize="small" color="error" /> 
      : <FeedbackIcon fontSize="small" color="info" />;
  };

  const getReportStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip 
                icon={<PendingIcon />} 
                label="Pending" 
                color="warning" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      case 'in-progress':
        return <Chip 
                icon={<AccessTimeIcon />} 
                label="In Progress" 
                color="info" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      case 'resolved':
        return <Chip 
                icon={<CheckCircleIcon />} 
                label="Resolved" 
                color="success" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      case 'rejected':
        return <Chip 
                icon={<CancelIcon />} 
                label="Rejected" 
                color="error" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(reports.map(report => report.category));
    return Array.from(categories);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const renderReportCard = (report: Report) => (
    <Box 
      key={report._id} 
      sx={{ 
        mb: 4,
        position: 'relative',
        overflow: 'visible',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Grid container>
        {/* Left colored section - report type */}
        <Grid item xs={2} md={1} 
          sx={{ 
            backgroundColor: report.type === 'violation' ? '#3C3C43' : alpha(theme.palette.info.main, 0.9),
            borderRadius: '12px 0 0 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            position: 'relative',
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: '"Source Code Pro", monospace',
              fontWeight: 500,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              mb: 1
            }}
          >
            {report.type}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontFamily: '"Source Code Pro", monospace',
              color: alpha('#FFFFFF', 0.7),
            }}
          >
            {report.status}
          </Typography>
        </Grid>
        
        {/* Main content area */}
        <Grid item xs={10} md={11}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                {/* Version/ID indicator */}
                <Typography 
                  variant="caption" 
                  color="#666666" 
                  sx={{ 
                    display: 'block', 
                    mb: 0.5,
                    fontFamily: '"Source Code Pro", monospace',
                  }}
                >
                  ID: {report._id.substring(0, 8)}
                </Typography>
                
                {/* Report Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    fontFamily: '"Source Code Pro", monospace',
                    color: '#000000',
                    letterSpacing: '0.02em',
                  }}
                >
                  {report.title}
                </Typography>
              </Box>
              
              {/* Status Tag */}
              <Box>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: '100px',
                    border: '1px solid #3C3C43',
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: '"Source Code Pro", monospace',
                      fontWeight: 400,
                      color: '#3C3C43',
                    }}
                  >
                    {report.status === 'in-progress' ? 'Active' : report.status}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Progress Bar - only for in-progress reports */}
            {report.status === 'in-progress' && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ position: 'relative', height: 4, backgroundColor: 'rgba(222, 222, 222, 0.8)', width: '100%', borderRadius: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: '60%', // Example progress
                      backgroundColor: '#3C3C43',
                      borderRadius: 2
                    }} 
                  />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 0.5, 
                    textAlign: 'right',
                    color: 'rgba(102, 102, 102, 0.8)',
                    fontFamily: '"Source Code Pro", monospace',
                  }}
                >
                  In Progress
                </Typography>
              </Box>
            )}
            
            {/* Description */}
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3,
                color: '#666666',
                fontFamily: '"Source Code Pro", monospace',
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {report.description}
            </Typography>
            
            {/* Bottom section with meta info and action */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              {/* Meta info (location, date) */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: '#666666', mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#666666',
                      fontFamily: '"Source Code Pro", monospace',
                    }}
                  >
                    {report.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ fontSize: 16, color: '#666666', mr: 0.5 }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#666666',
                      fontFamily: '"Source Code Pro", monospace',
                    }}
                  >
                    {formatDate(report.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
              {/* Action button */}
              <Button 
                onClick={() => handleViewReport(report)}
                sx={{ 
                  borderRadius: '100px',
                  border: '1px solid #3C3C43',
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  textTransform: 'none',
                  fontFamily: '"Source Code Pro", monospace',
                  fontSize: '12px',
                  color: '#3C3C43',
                  '&:hover': {
                    backgroundColor: alpha('#3C3C43', 0.05),
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Count reports by status for the badge counters
  const pendingCount = reports.filter(report => report.status === 'pending' || report.status === 'in-progress').length;
  const resolvedCount = reports.filter(report => report.status === 'resolved').length;
  const rejectedCount = reports.filter(report => report.status === 'rejected').length;

  return (
    <Box sx={{
      backgroundImage: bgGradient,
      backgroundAttachment: 'fixed',
      position: 'relative',
      minHeight: '100vh',
      pt: 4, 
      pb: 8,
      backgroundColor: theme.palette.background.default,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: bgPattern,
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: 'none'
      }
    }}>
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '30%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          top: '5%',
          left: '-10%',
          zIndex: 0,
          filter: 'blur(50px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '25%',
          height: '25%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          bottom: '10%',
          right: '5%',
          zIndex: 0,
          filter: 'blur(45px)',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Custom content container with unique styling */}
        <Box sx={{ 
          position: 'relative',
          borderRadius: '24px',
          overflow: 'visible',
          backdropFilter: 'blur(12px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          boxShadow: `0 20px 80px ${alpha(theme.palette.common.black, 0.12)}`,
          p: { xs: 2.5, sm: 3.5 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            padding: '2px',
            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.5)}, ${alpha(theme.palette.secondary.main, 0.5)}, ${alpha(theme.palette.primary.main, 0)})`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -15,
            right: -15,
            width: '150px',
            height: '150px',
            background: `linear-gradient(140deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.secondary.light, 0.1)})`,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            zIndex: -1,
            filter: 'blur(15px)',
          }
        }}>
          {/* Decorative patterns */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '50%',
            opacity: 0.03,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundAttachment: 'fixed',
            zIndex: -1,
            borderRadius: '0 24px 24px 0',
          }}/>
          
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '30px',
            height: '110px',
            transform: 'translateY(-50%)',
            background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.success.main})`,
            borderRadius: '0 8px 8px 0',
            opacity: 0.1,
            zIndex: -1,
          }}/>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography 
                variant="overline" 
                color="primary" 
                sx={{ 
                  fontSize: '0.75rem',
                  letterSpacing: '1.5px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 0.5
                }}
              >
                User Dashboard
              </Typography>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 30%, ${alpha(theme.palette.text.primary, 0.7)} 90%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                My Reports
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary"
              component={RouterLink}
              to="/report"
              sx={{ 
                borderRadius: '28px',
                px: 3,
                py: 1.2,
                fontWeight: 600,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              Submit New Report
            </Button>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}
          
          <Box sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              TabIndicatorProps={{ 
                style: { display: 'none' } 
              }}
              sx={{
                borderRadius: 3,
                backgroundColor: 'transparent',
                mb: 1,
                '& .MuiTabs-flexContainer': {
                  gap: 3,
                  px: 1,
                  py: 1
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    transform: tabValue === 0 ? 'translateY(-4px)' : 'none',
                    width: '100%',
                    px: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 0.5
                    }}>
                      <Typography component="span" variant="body1" fontWeight={600}>
                        All Reports
                      </Typography>
                      <Badge 
                        badgeContent={reports.length} 
                        color="primary" 
                        sx={{ 
                          ml: 2,
                          '& .MuiBadge-badge': { 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '11px',
                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`
                          } 
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      width: '40%', 
                      height: '4px', 
                      borderRadius: '2px',
                      background: tabValue === 0 ? 
                        `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})` : 
                        'transparent',
                      transition: 'all 0.3s ease',
                      opacity: tabValue === 0 ? 1 : 0
                    }} />
                  </Box>
                }
                sx={{
                  minHeight: '72px',
                  borderRadius: 2,
                  backgroundColor: tabValue === 0 ? 
                    alpha(theme.palette.primary.main, 0.08) : 
                    alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${tabValue === 0 ? 
                    alpha(theme.palette.primary.main, 0.2) : 
                    alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: tabValue === 0 ? 
                    `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}` : 
                    'none',
                  '&:hover': {
                    backgroundColor: tabValue === 0 ? 
                      alpha(theme.palette.primary.main, 0.12) : 
                      alpha(theme.palette.background.paper, 0.6)
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  color: tabValue === 0 ? theme.palette.primary.main : theme.palette.text.primary,
                  px: 3,
                  py: 2
                }}
                {...a11yProps(0)} 
              />
              <Tab 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    transform: tabValue === 1 ? 'translateY(-4px)' : 'none',
                    width: '100%',
                    px: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 0.5,
                      py: 1
                    }}>
                      <PendingIcon 
                        fontSize="small" 
                        sx={{ 
                          mr: 1, 
                          color: tabValue === 1 ? theme.palette.warning.main : 'inherit',
                          animation: tabValue === 1 ? 'spin 2s linear infinite' : 'none',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }}
                      />
                      <Typography component="span" variant="body1" fontWeight={600}>
                        Pending
                      </Typography>
                      <Badge 
                        badgeContent={pendingCount} 
                        color="warning" 
                        sx={{ 
                          ml: 2,
                          '& .MuiBadge-badge': { 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '11px',
                            boxShadow: `0 2px 8px ${alpha(theme.palette.warning.main, 0.4)}`
                          } 
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      width: '40%', 
                      height: '4px', 
                      borderRadius: '2px',
                      background: tabValue === 1 ? 
                        `linear-gradient(to right, ${theme.palette.warning.main}, ${theme.palette.warning.light})` : 
                        'transparent',
                      transition: 'all 0.3s ease',
                      opacity: tabValue === 1 ? 1 : 0
                    }} />
                  </Box>
                }
                sx={{
                  minHeight: '72px',
                  borderRadius: 2,
                  backgroundColor: tabValue === 1 ? 
                    alpha(theme.palette.warning.main, 0.08) : 
                    alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${tabValue === 1 ? 
                    alpha(theme.palette.warning.main, 0.2) : 
                    alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: tabValue === 1 ? 
                    `0 4px 12px ${alpha(theme.palette.warning.main, 0.15)}` : 
                    'none',
                  '&:hover': {
                    backgroundColor: tabValue === 1 ? 
                      alpha(theme.palette.warning.main, 0.12) : 
                      alpha(theme.palette.background.paper, 0.6)
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  color: tabValue === 1 ? theme.palette.warning.dark : theme.palette.text.primary,
                  px: 3,
                  py: 2
                }}
                {...a11yProps(1)} 
              />
              <Tab 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    transform: tabValue === 2 ? 'translateY(-4px)' : 'none',
                    width: '100%',
                    px: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 0.5
                    }}>
                      <CheckCircleIcon 
                        fontSize="small" 
                        sx={{ 
                          mr: 1, 
                          color: tabValue === 2 ? theme.palette.success.main : 'inherit',
                          animation: tabValue === 2 ? 'pulse 2s ease-in-out infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.1)' },
                            '100%': { transform: 'scale(1)' }
                          }
                        }}
                      />
                      <Typography component="span" variant="body1" fontWeight={600}>
                        Resolved
                      </Typography>
                      <Badge 
                        badgeContent={resolvedCount} 
                        color="success" 
                        sx={{ 
                          ml: 2,
                          '& .MuiBadge-badge': { 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '11px',
                            boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.4)}`
                          } 
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      width: '40%', 
                      height: '4px', 
                      borderRadius: '2px',
                      background: tabValue === 2 ? 
                        `linear-gradient(to right, ${theme.palette.success.main}, ${theme.palette.success.light})` : 
                        'transparent',
                      transition: 'all 0.3s ease',
                      opacity: tabValue === 2 ? 1 : 0
                    }} />
                  </Box>
                }
                sx={{
                  minHeight: '72px',
                  borderRadius: 2,
                  backgroundColor: tabValue === 2 ? 
                    alpha(theme.palette.success.main, 0.08) : 
                    alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${tabValue === 2 ? 
                    alpha(theme.palette.success.main, 0.2) : 
                    alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: tabValue === 2 ? 
                    `0 4px 12px ${alpha(theme.palette.success.main, 0.15)}` : 
                    'none',
                  '&:hover': {
                    backgroundColor: tabValue === 2 ? 
                      alpha(theme.palette.success.main, 0.12) : 
                      alpha(theme.palette.background.paper, 0.6)
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  color: tabValue === 2 ? theme.palette.success.dark : theme.palette.text.primary,
                  px: 3,
                  py: 2
                }}
                {...a11yProps(2)} 
              />
              <Tab 
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    transform: tabValue === 3 ? 'translateY(-4px)' : 'none',
                    width: '100%',
                    px: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 0.5,
                      py: 1
                    }}>
                      <CancelIcon 
                        fontSize="small" 
                        sx={{ 
                          mr: 1, 
                          color: tabValue === 3 ? theme.palette.error.main : 'inherit'
                        }}
                      />
                      <Typography component="span" variant="body1" fontWeight={600}>
                        Rejected
                      </Typography>
                      <Badge 
                        badgeContent={rejectedCount} 
                        color="error" 
                        sx={{ 
                          ml: 2,
                          '& .MuiBadge-badge': { 
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '11px',
                            boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`
                          } 
                        }} 
                      />
                    </Box>
                    <Box sx={{ 
                      width: '40%', 
                      height: '4px', 
                      borderRadius: '2px',
                      background: tabValue === 3 ? 
                        `linear-gradient(to right, ${theme.palette.error.main}, ${theme.palette.error.light})` : 
                        'transparent',
                      transition: 'all 0.3s ease',
                      opacity: tabValue === 3 ? 1 : 0
                    }} />
                  </Box>
                }
                sx={{
                  minHeight: '72px',
                  borderRadius: 2,
                  backgroundColor: tabValue === 3 ? 
                    alpha(theme.palette.error.main, 0.08) : 
                    alpha(theme.palette.background.paper, 0.4),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${tabValue === 3 ? 
                    alpha(theme.palette.error.main, 0.2) : 
                    alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: tabValue === 3 ? 
                    `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}` : 
                    'none',
                  '&:hover': {
                    backgroundColor: tabValue === 3 ? 
                      alpha(theme.palette.error.main, 0.12) : 
                      alpha(theme.palette.background.paper, 0.6)
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  color: tabValue === 3 ? theme.palette.error.dark : theme.palette.text.primary,
                }}
                {...a11yProps(3)} 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search by title, description, location or category"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                    sx: { 
                      borderRadius: 2,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, 0.6),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                      },
                      boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.06)}`
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="type-filter-label">Report Type</InputLabel>
                    <Select
                      labelId="type-filter-label"
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange as any}
                      label="Report Type"
                      sx={{ 
                        borderRadius: 2,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.06)}`
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="violation">Violations</MenuItem>
                      <MenuItem value="complaint">Complaints</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange as any}
                      label="Category"
                      sx={{ 
                        borderRadius: 2,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: alpha(theme.palette.background.paper, 0.6),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        },
                        boxShadow: `0 2px 8px ${alpha(theme.palette.text.primary, 0.06)}`
                      }}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {getUniqueCategories().map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Loading your reports...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a moment
                </Typography>
              </Box>
            ) : filteredReports.length > 0 ? (
              filteredReports.map(report => renderReportCard(report))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Box sx={{
                  position: 'relative',
                  margin: '0 auto',
                  width: '120px',
                  height: '120px',
                  mb: 4
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '60px',
                    background: `radial-gradient(circle, ${alpha(theme.palette.text.secondary, 0.08)}, ${alpha(theme.palette.text.secondary, 0.03)})`,
                    animation: 'pulse 2.5s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(0.95)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(0.95)' }
                    }
                  }} />
                  <InboxIcon 
                    sx={{ 
                      fontSize: 70, 
                      color: alpha(theme.palette.text.secondary, 0.3),
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  No reports found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  maxWidth: 450, 
                  mx: 'auto', 
                  mb: 4,
                  opacity: 0.8
                }}>
                  Try adjusting your filters or search query to find what you're looking for
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<FilterListIcon />}
                  sx={{ 
                    borderRadius: '30px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Loading your reports...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a moment
                </Typography>
              </Box>
            ) : filteredReports.length > 0 ? (
              filteredReports.map(report => renderReportCard(report))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Box sx={{
                  position: 'relative',
                  margin: '0 auto',
                  width: '120px',
                  height: '120px',
                  mb: 4
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '60px',
                    background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.08)}, ${alpha(theme.palette.warning.main, 0.03)})`,
                    animation: 'pulse 2.5s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(0.95)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(0.95)' }
                    }
                  }} />
                  <PendingIcon 
                    sx={{ 
                      fontSize: 70, 
                      color: alpha(theme.palette.warning.main, 0.3),
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'spin 10s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
                        '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
                      }
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  No pending reports
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  maxWidth: 450, 
                  mx: 'auto', 
                  mb: 4,
                  opacity: 0.8
                }}>
                  All your reports have either been resolved or rejected
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<FilterListIcon />}
                  component={RouterLink}
                  to="/report"
                  sx={{ 
                    borderRadius: '30px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Submit New Report
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Loading your reports...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a moment
                </Typography>
              </Box>
            ) : filteredReports.length > 0 ? (
              filteredReports.map(report => renderReportCard(report))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Box sx={{
                  position: 'relative',
                  margin: '0 auto',
                  width: '120px',
                  height: '120px',
                  mb: 4
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '60px',
                    background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.08)}, ${alpha(theme.palette.success.main, 0.03)})`,
                    animation: 'pulse 2.5s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(0.95)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(0.95)' }
                    }
                  }} />
                  <CheckCircleIcon 
                    sx={{ 
                      fontSize: 70, 
                      color: alpha(theme.palette.success.main, 0.3),
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  No resolved reports
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  maxWidth: 450, 
                  mx: 'auto', 
                  mb: 4,
                  opacity: 0.8
                }}>
                  Your reports are still being processed
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<AccessTimeIcon />}
                  sx={{ 
                    borderRadius: '30px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Check Back Later
                </Button>
              </Box>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Loading your reports...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This may take a moment
                </Typography>
              </Box>
            ) : filteredReports.length > 0 ? (
              filteredReports.map(report => renderReportCard(report))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Box sx={{
                  position: 'relative',
                  margin: '0 auto',
                  width: '120px',
                  height: '120px',
                  mb: 4
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '60px',
                    background: `radial-gradient(circle, ${alpha(theme.palette.error.main, 0.08)}, ${alpha(theme.palette.error.main, 0.03)})`,
                    animation: 'pulse 2.5s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(0.95)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(0.95)' }
                    }
                  }} />
                  <CancelIcon 
                    sx={{ 
                      fontSize: 70, 
                      color: alpha(theme.palette.error.main, 0.3),
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </Box>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>
                  No rejected reports
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ 
                  maxWidth: 450, 
                  mx: 'auto', 
                  mb: 4,
                  opacity: 0.8
                }}>
                  Good news! None of your reports have been rejected
                </Typography>
                <Button 
                  variant="outlined" 
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  sx={{ 
                    borderRadius: '30px',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  View All Reports
                </Button>
              </Box>
            )}
          </TabPanel>
        </Box>
        
        {/* Report Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.85)} 100%)`,
              boxShadow: `0 15px 50px ${alpha(theme.palette.primary.main, 0.2)}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }
          }}
        >
          {selectedReport && (
            <>
              <DialogTitle sx={{ 
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                px: 3,
                py: 2.5,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getReportTypeIcon(selectedReport.type)}
                  <Typography variant="h5" component="span" fontWeight="bold">
                    {selectedReport.title}
                  </Typography>
                  {getReportStatusChip(selectedReport.status)}
                </Stack>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ 
                  p: 3,
                  background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.5)} 0%, rgba(255,255,255,0) 100%)` 
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Reference ID</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {selectedReport._id}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Date Submitted</Typography>
                        <Typography variant="body1">
                          {formatDate(selectedReport.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Category</Typography>
                        <Chip 
                          label={selectedReport.category} 
                          color="primary" 
                          size="small" 
                          sx={{ borderRadius: '6px', fontWeight: 'medium' }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Location</Typography>
                        <Typography variant="body1">{selectedReport.location}</Typography>
                      </Box>
                      
                      {selectedReport.resolvedAt && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {selectedReport.status === 'resolved' ? 'Resolved Date' : 'Response Date'}
                          </Typography>
                          <Typography variant="body1">{formatDate(selectedReport.resolvedAt)}</Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: '80px' }}>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{selectedReport.description}</Typography>
                        </Paper>
                      </Box>
                      
                      {selectedReport.evidence && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Evidence</Typography>
                          <Paper variant="outlined" sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: alpha(theme.palette.primary.light, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                          }}>
                            {(() => {
                              const evidencePath = selectedReport.evidence || '';
                              const fName = evidencePath.split('/').pop() || 'evidence_file';
                              const evidenceUrl = `http://localhost:5000/api/reports/evidence/${encodeURIComponent(fName)}`;
                              const fileExtension = fName.split('.').pop()?.toLowerCase();

                              if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
                                return (
                                  <img 
                                    src={evidenceUrl} 
                                    alt="Evidence" 
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', border: '1px solid #ddd' }} 
                                  />
                                );
                              } else if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension || '')) {
                                return (
                                  <video 
                                    src={evidenceUrl} 
                                    controls 
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', border: '1px solid #ddd' }} 
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              } else {
                                return (
                                  <Button 
                                    variant="outlined"
                                    href={evidenceUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    startIcon={<AttachmentIcon />}
                                    sx={{ 
                                      mt: 1, 
                                      borderRadius: '6px',
                                      textTransform: 'none'
                                    }}
                                  >
                                    View/Download: {fName}
                                  </Button>
                                );
                              }
                            })()}
                          </Paper>
                        </Box>
                      )}
                    </Grid>

                    {/* Admin Notes (if present) */}
                    {selectedReport.adminNotes && selectedReport.adminNotes.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Admin Response</Typography>
                        <Paper variant="outlined" sx={{ 
                          p: 0, 
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          {selectedReport.adminNotes.map((note, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                p: 2,
                                ...(index % 2 === 0 && { bgcolor: alpha(theme.palette.background.default, 0.5) })
                              }}
                            >
                              <Typography variant="body2">{note.text}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Added on {formatDate(note.addedAt)}
                              </Typography>
                              {index !== selectedReport.adminNotes!.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                          ))}
                        </Paper>
                      </Grid>
                    )}

                    {/* Comments (if present) */}
                    {selectedReport.comments && selectedReport.comments.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Comments</Typography>
                        <Paper variant="outlined" sx={{ 
                          p: 0, 
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          {selectedReport.comments.map((comment, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                p: 2,
                                ...(index % 2 === 0 && { bgcolor: alpha(theme.palette.background.default, 0.5) })
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {comment.user.name}
                                  {comment.user.role === 'admin' && (
                                    <Chip 
                                      label="Admin" 
                                      size="small" 
                                      color="primary" 
                                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                    />
                                  )}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDate(comment.createdAt)}
                                </Typography>
                              </Box>
                              <Typography variant="body2">{comment.text}</Typography>
                              {index !== selectedReport.comments!.length - 1 && <Divider sx={{ mt: 2 }} />}
                            </Box>
                          ))}
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                  onClick={() => setDialogOpen(false)}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Close
                </Button>
                
                {/* Add comment button could go here in a real app */}
                {false && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none'
                    }}
                  >
                    Add Comment
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyReports; 