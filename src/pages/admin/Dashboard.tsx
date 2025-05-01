import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axiosInstance from '../../utils/axiosInstance';
import { format } from 'date-fns';

interface Report {
  _id: string;
  title: string;
  description: string;
  submittedBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  date: string;
  category: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  evidence?: string;
  adminNotes?: Array<{
    text: string;
    addedBy: string;
    addedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  categories: Array<{
    _id: string;
    count: number;
  }>;
  recentActivity?: Array<Report>;
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
        <Box sx={{ p: 3 }}>
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

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolved' | 'rejected' | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/reports/admin/all');
      setReports(response.data);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(`Failed to load reports: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await axiosInstance.get('/reports/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // We don't show an error message for stats, just log it
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: 'resolved' | 'rejected', note: string) => {
    try {
      // Create the proper payload with all required fields
      const payload = {
        status: status,
        note,
        actionDate: new Date().toISOString()
      };

      // Improved logging for debugging
      console.log(`Updating report ${reportId} with status: ${status}`);
      
      // Fix the API endpoint to match the correct one from documentation
      const response = await axiosInstance.put(`/reports/admin/${reportId}/status`, payload);
      
      // Update local state after successful API call
      setReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId 
            ? { ...report, status: status, ...response.data }
            : report
        )
      );
      
      // Refresh stats
      fetchStats();
      
      return true;
    } catch (err: any) {
      console.error(`Error ${status === 'resolved' ? 'approving' : 'rejecting'} report:`, err);
      
      // More detailed error message including response data if available
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      setError(`Failed to ${status === 'resolved' ? 'approve' : 'reject'} report: ${errorMsg}`);
      
      return false;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  const openActionDialog = (report: Report, action: 'resolved' | 'rejected') => {
    setSelectedReport(report);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setActionType(null);
    setActionNote('');
  };

  const completeAction = async () => {
    if (selectedReport && actionType) {
      const success = await handleUpdateStatus(selectedReport._id, actionType, actionNote);
      
      if (success) {
        closeActionDialog();
      }
    }
  };

  const pendingReports = reports.filter(report => report.status === 'pending');
  const resolvedReports = reports.filter(report => report.status === 'resolved');
  const rejectedReports = reports.filter(report => report.status === 'rejected');

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip 
                icon={<PendingIcon />} 
                label="Pending Review" 
                color="warning" 
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: '6px'
                }}
              />;
      case 'resolved':
        return <Chip 
                icon={<CheckCircleIcon />} 
                label="Approved" 
                color="success" 
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: '6px'
                }}
              />;
      case 'rejected':
        return <Chip 
                icon={<CancelIcon />} 
                label="Rejected" 
                color="error" 
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: '6px'
                }}
              />;
      case 'in-progress':
        return <Chip 
                icon={<PendingIcon />} 
                label="In Progress" 
                color="info" 
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: '6px'
                }}
              />;
      default:
        return <Chip label={status} sx={{ borderRadius: '6px' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
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
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px ${alpha(theme.palette.text.primary, 0.12)}`
        },
        position: 'relative',
        borderLeft: report.status === 'pending' 
          ? `4px solid ${theme.palette.warning.main}`
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{report.title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Submitted by <Box component="span" sx={{ fontWeight: 'medium' }}>{typeof report.submittedBy === 'object' ? report.submittedBy.name : 'Unknown'}</Box> on {formatDate(report.createdAt)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: alpha(theme.palette.text.primary, 0.8),
                maxHeight: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {report.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={report.category} 
                color="primary" 
                size="small"
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: '6px'
                }} 
              />
              <Chip 
                label={`Location: ${report.location}`} 
                size="small" 
                variant="outlined"
                sx={{ 
                  borderRadius: '6px'
                }} 
              />
              {getStatusChip(report.status)}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box>
                {report.evidence && (
                  <Typography variant="body2" color="text.secondary">
                    Evidence: {report.evidence}
                  </Typography>
                )}
                {report.resolvedAt && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Resolved on: {formatDate(report.resolvedAt)}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(report)}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  Details
                </Button>
                {report.status === 'pending' && (
                  <>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small" 
                      startIcon={<CheckCircleIcon />}
                      onClick={() => openActionDialog(report, 'resolved')}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                        }
                      }}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small" 
                      startIcon={<CancelIcon />}
                      onClick={() => openActionDialog(report, 'rejected')}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            boxShadow: theme.shadows[3],
            borderRadius: 2
          }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box 
        sx={{ 
          position: 'relative',
          mb: 5,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: theme.shadows[5],
          color: 'white',
          p: 3,
          pb: 5
        }}
      >
        <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1, fontSize: 180 }}>
          <DashboardIcon fontSize="inherit" />
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <DashboardIcon sx={{ fontSize: 40, mr: 2 }} />
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h4" fontWeight="bold">
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8, mt: 0.5 }}>
              Manage and review user reports efficiently
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.8)} 0%, ${alpha(theme.palette.warning.main, 0.8)} 100%)`,
              color: theme.palette.warning.contrastText,
              boxShadow: `0 8px 20px -10px ${alpha(theme.palette.warning.main, 0.6)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            elevation={0}
          >
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, fontSize: 100 }}>
              <WarningAmberIcon fontSize="inherit" />
            </Box>
            <WarningAmberIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>Pending Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={40} color="inherit" />
            ) : (
              <Typography variant="h2" fontWeight="bold">{stats?.pending || pendingReports.length}</Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Awaiting review</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.8)} 0%, ${alpha(theme.palette.success.main, 0.8)} 100%)`,
              color: theme.palette.success.contrastText,
              boxShadow: `0 8px 20px -10px ${alpha(theme.palette.success.main, 0.6)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            elevation={0}
          >
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, fontSize: 100 }}>
              <ThumbUpIcon fontSize="inherit" />
            </Box>
            <ThumbUpIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>Approved Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={40} color="inherit" />
            ) : (
              <Typography variant="h2" fontWeight="bold">{stats?.approved || resolvedReports.length}</Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Successfully resolved</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.8)} 0%, ${alpha(theme.palette.error.main, 0.8)} 100%)`,
              color: theme.palette.error.contrastText,
              boxShadow: `0 8px 20px -10px ${alpha(theme.palette.error.main, 0.6)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
            elevation={0}
          >
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, fontSize: 100 }}>
              <ThumbDownIcon fontSize="inherit" />
            </Box>
            <ThumbDownIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>Rejected Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={40} color="inherit" />
            ) : (
              <Typography variant="h2" fontWeight="bold">{stats?.rejected || rejectedReports.length}</Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>Dismissed requests</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ 
            width: '100%', 
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: `0 8px 24px -12px ${alpha(theme.palette.primary.main, 0.2)}`
          }} elevation={1}>
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              background: alpha(theme.palette.background.paper, 0.8)
            }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="admin dashboard tabs"
                centered
                sx={{
                  '& .MuiTab-root': {
                    py: 2,
                    px: 4,
                    fontWeight: 'medium',
                    transition: '0.2s',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  },
                  '& .Mui-selected': {
                    fontWeight: 'bold',
                    color: theme.palette.primary.main
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 1.5
                  }
                }}
              >
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PendingIcon sx={{ mr: 1, fontSize: 20 }} />
                      <span>Pending ({pendingReports.length})</span>
                    </Box>
                  } 
                  {...a11yProps(0)} 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                      <span>Approved ({resolvedReports.length})</span>
                    </Box>
                  } 
                  {...a11yProps(1)} 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CancelIcon sx={{ mr: 1, fontSize: 20 }} />
                      <span>Rejected ({rejectedReports.length})</span>
                    </Box>
                  } 
                  {...a11yProps(2)} 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
                      <span>All Reports</span>
                    </Box>
                  } 
                  {...a11yProps(3)} 
                />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TabPanel value={tabValue} index={0}>
                  {pendingReports.length > 0 ? (
                    pendingReports.map(report => renderReportCard(report))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 5,
                      opacity: 0.7
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2, opacity: 0.6 }} />
                      <Typography align="center" variant="h6">All caught up!</Typography>
                      <Typography align="center">No pending reports to review</Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {resolvedReports.length > 0 ? (
                    resolvedReports.map((report) => renderReportCard(report))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 5,
                      opacity: 0.7
                    }}>
                      <ThumbUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.6 }} />
                      <Typography align="center" variant="h6">Nothing here yet</Typography>
                      <Typography align="center">No approved reports</Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {rejectedReports.length > 0 ? (
                    rejectedReports.map(report => renderReportCard(report))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 5,
                      opacity: 0.7
                    }}>
                      <CancelIcon sx={{ fontSize: 60, color: 'error.main', mb: 2, opacity: 0.6 }} />
                      <Typography align="center" variant="h6">Nothing here</Typography>
                      <Typography align="center">No rejected reports</Typography>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  {reports.length > 0 ? (
                    reports.map(report => renderReportCard(report))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      py: 5,
                      opacity: 0.7
                    }}>
                      <DashboardIcon sx={{ fontSize: 60, color: 'info.main', mb: 2, opacity: 0.6 }} />
                      <Typography align="center" variant="h6">No data available</Typography>
                      <Typography align="center">No reports available</Typography>
                    </Box>
                  )}
                </TabPanel>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Report Details Dialog */}
      <Dialog
        open={selectedReport !== null && !actionDialogOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
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
                <Typography variant="h5" component="span" fontWeight="bold">
                  {selectedReport.title}
                </Typography>
                {getStatusChip(selectedReport.status)}
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
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Submitted By</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {typeof selectedReport.submittedBy === 'object' ? selectedReport.submittedBy.name : 'Unknown'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Date Submitted</Typography>
                      <Typography variant="body1">{formatDate(selectedReport.createdAt)}</Typography>
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
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, minHeight: '80px' }}>
                        <Typography variant="body1">{selectedReport.description}</Typography>
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
                          <Typography variant="body2">{selectedReport.evidence}</Typography>
                          {/* In a real app, we would display the actual evidence file/media */}
                          <Button 
                            size="small" 
                            sx={{ 
                              mt: 1, 
                              borderRadius: '6px',
                              textTransform: 'none'
                            }}
                          >
                            View Evidence
                          </Button>
                        </Paper>
                      </Box>
                    )}
                  </Grid>

                  {selectedReport.adminNotes && selectedReport.adminNotes.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Admin Notes</Typography>
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
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleCloseDetails}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
              {selectedReport.status === 'pending' && (
                <>
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      handleCloseDetails();
                      openActionDialog(selectedReport, 'resolved');
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                      }
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      handleCloseDetails();
                      openActionDialog(selectedReport, 'rejected');
                    }}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`
                      }
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Action Dialog (Approve/Reject) */}
      <Dialog
        open={actionDialogOpen}
        onClose={closeActionDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 500,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        {selectedReport && actionType && (
          <>
            <DialogTitle sx={{
              p: 3,
              backgroundColor: actionType === 'resolved' 
                ? alpha(theme.palette.success.light, 0.2) 
                : alpha(theme.palette.error.light, 0.2),
              color: actionType === 'resolved' 
                ? theme.palette.success.dark 
                : theme.palette.error.dark
            }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {actionType === 'resolved' 
                  ? <CheckCircleIcon color="success" /> 
                  : <CancelIcon color="error" />
                }
                <Typography variant="h6" component="div" fontWeight="bold">
                  {actionType === 'resolved' ? 'Approve Report' : 'Reject Report'}
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent sx={{ p: 3, pt: 3 }}>
              <DialogContentText sx={{ color: 'text.primary', opacity: 0.8, mb: 3 }}>
                {actionType === 'resolved' 
                  ? 'You are about to approve this report. Please provide any relevant action notes.' 
                  : 'You are about to reject this report. Please provide a reason for rejection.'}
              </DialogContentText>
              
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Report: <Box component="span" fontWeight="medium">{selectedReport.title}</Box>
              </Typography>
              
              <TextField
                autoFocus
                margin="dense"
                id="note"
                label={actionType === 'resolved' ? 'Action Notes' : 'Reason for Rejection'}
                placeholder={actionType === 'resolved' 
                  ? 'Add details about the resolution process...' 
                  : 'Explain why this report is being rejected...'}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                sx={{ 
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              
              {actionType === 'resolved' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Additional Actions (Optional)</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<AttachMoneyIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      Issue Fine
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<GavelIcon />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.secondary.main, 0.05),
                          borderColor: theme.palette.secondary.main
                        }
                      }}
                    >
                      Legal Notice
                    </Button>
                  </Stack>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Button 
                onClick={closeActionDialog}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color={actionType === 'resolved' ? 'success' : 'error'} 
                onClick={completeAction}
                disabled={actionType === 'rejected' && !actionNote.trim()}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3,
                  boxShadow: actionType === 'resolved'
                    ? `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`
                    : `0 2px 8px ${alpha(theme.palette.error.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: actionType === 'resolved'
                      ? `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}`
                      : `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`
                  }
                }}
              >
                {actionType === 'resolved' ? 'Approve' : 'Reject'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard; 