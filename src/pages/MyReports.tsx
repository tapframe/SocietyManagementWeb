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
  IconButton,
  Tabs,
  Tab,
  useTheme,
  Badge,
  Avatar,
  Link,
  Tooltip
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';
import HistoryIcon from '@mui/icons-material/History';
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
import { useAuth } from '../context/AuthContext';

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
  const theme = useTheme();

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
  const theme = useTheme();
  const { user } = useAuth();
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
    <Card 
      key={report._id} 
      sx={{ 
        mb: 2,
        borderRadius: 2,
        boxShadow: `0 3px 10px ${alpha(theme.palette.text.primary, 0.08)}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.15)}`
        },
        position: 'relative',
        backdropFilter: 'blur(4px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderLeft: report.status === 'pending' 
          ? `4px solid ${theme.palette.warning.main}`
          : report.status === 'in-progress'
            ? `4px solid ${theme.palette.info.main}`
            : report.status === 'resolved'
              ? `4px solid ${theme.palette.success.main}`
              : report.status === 'rejected'
                ? `4px solid ${theme.palette.error.main}`
                : 'none'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getReportTypeIcon(report.type)}
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {report.title}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                {formatDate(report.createdAt)}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                {report.category}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                {report.location}
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 2
              }}
            >
              {report.description}
            </Typography>
            
            {report.comments && report.comments.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {report.comments.length} comment{report.comments.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Box>
                {getReportStatusChip(report.status)}
                
                {report.resolvedAt && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {report.status === 'resolved' ? 'Resolved' : 'Responded'} on {formatDate(report.resolvedAt)}
                  </Typography>
                )}
                
                {report.evidence && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <AttachmentIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Evidence attached
                  </Typography>
                )}
              </Box>
              
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<VisibilityIcon />}
                onClick={() => handleViewReport(report)}
                sx={{ mt: 2 }}
              >
                View Details
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
        <Paper elevation={3} sx={{ 
          p: 3, 
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.75),
          boxShadow: (theme) => 
            `0 15px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              My Reports
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              component={RouterLink}
              to="/report"
              sx={{ 
                borderRadius: 8,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`
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
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <InboxIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: alpha(theme.palette.text.secondary, 0.3),
                    mb: 2
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No reports found matching your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Try adjusting your filters or search query to find what you're looking for
                </Typography>
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
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <PendingIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: alpha(theme.palette.warning.main, 0.3),
                    mb: 2
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No pending reports found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  All your reports have either been resolved or rejected
                </Typography>
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
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CheckCircleIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: alpha(theme.palette.success.main, 0.3),
                    mb: 2
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No resolved reports found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Your reports are still being processed
                </Typography>
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
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CancelIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: alpha(theme.palette.error.main, 0.3),
                    mb: 2
                  }} 
                />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No rejected reports found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Good news! None of your reports have been rejected
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
        
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