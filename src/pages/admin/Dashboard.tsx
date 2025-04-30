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
  Alert
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';
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
      const response = await axiosInstance.put(`/reports/admin/${reportId}/status`, {
        status,
        note
      });
      
      // Update local state after successful API call
      setReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId 
            ? { ...report, status, ...response.data }
            : report
        )
      );
      
      // Refresh stats
      fetchStats();
      
      return true;
    } catch (err: any) {
      console.error(`Error ${status === 'resolved' ? 'approving' : 'rejecting'} report:`, err);
      setError(`Failed to ${status === 'resolved' ? 'approve' : 'reject'} report: ${err.response?.data?.message || err.message || 'Unknown error'}`);
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
        return <Chip icon={<PendingIcon />} label="Pending Review" color="warning" />;
      case 'resolved':
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" />;
      case 'in-progress':
        return <Chip icon={<PendingIcon />} label="In Progress" color="info" />;
      default:
        return <Chip label={status} />;
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
    <Card key={report._id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">{report.title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Submitted by {typeof report.submittedBy === 'object' ? report.submittedBy.name : 'Unknown'} on {formatDate(report.createdAt)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {report.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={report.category} color="primary" size="small" />
              <Chip label={`Location: ${report.location}`} size="small" variant="outlined" />
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
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewDetails(report)}
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
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small" 
                      startIcon={<CancelIcon />}
                      onClick={() => openActionDialog(report, 'rejected')}
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              mb: 3
            }}
            elevation={3}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and review user reports
            </Typography>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'warning.contrastText'
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom>Pending Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h3">{stats?.pending || pendingReports.length}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText'
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom>Approved Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h3">{stats?.approved || resolvedReports.length}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'error.light',
              color: 'error.contrastText'
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom>Rejected Reports</Typography>
            {statsLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h3">{stats?.rejected || rejectedReports.length}</Typography>
            )}
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }} elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="admin dashboard tabs"
                centered
              >
                <Tab label={`Pending (${pendingReports.length})`} {...a11yProps(0)} />
                <Tab label={`Approved (${resolvedReports.length})`} {...a11yProps(1)} />
                <Tab label={`Rejected (${rejectedReports.length})`} {...a11yProps(2)} />
                <Tab label="All Reports" {...a11yProps(3)} />
              </Tabs>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TabPanel value={tabValue} index={0}>
                  {pendingReports.length > 0 ? (
                    pendingReports.map(report => renderReportCard(report))
                  ) : (
                    <Typography align="center">No pending reports to review</Typography>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {resolvedReports.length > 0 ? (
                    resolvedReports.map((report) => renderReportCard(report))
                  ) : (
                    <Typography align="center">No approved reports</Typography>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {rejectedReports.length > 0 ? (
                    rejectedReports.map(report => renderReportCard(report))
                  ) : (
                    <Typography align="center">No rejected reports</Typography>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                  {reports.length > 0 ? (
                    reports.map(report => renderReportCard(report))
                  ) : (
                    <Typography align="center">No reports available</Typography>
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
      >
        {selectedReport && (
          <>
            <DialogTitle>
              Report Details: {selectedReport.title}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Submitted By</Typography>
                  <Typography variant="body1" gutterBottom>
                    {typeof selectedReport.submittedBy === 'object' ? selectedReport.submittedBy.name : 'Unknown'}
                  </Typography>
                  
                  <Typography variant="subtitle2">Date Submitted</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedReport.createdAt)}</Typography>
                  
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.category}</Typography>
                  
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.location}</Typography>
                  
                  <Typography variant="subtitle2">Status</Typography>
                  <Box>{getStatusChip(selectedReport.status)}</Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography variant="body1" paragraph>{selectedReport.description}</Typography>
                  
                  {selectedReport.evidence && (
                    <>
                      <Typography variant="subtitle2">Evidence</Typography>
                      <Box sx={{ mt: 1, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="body2">{selectedReport.evidence}</Typography>
                        {/* In a real app, we would display the actual evidence file/media */}
                        <Button size="small" sx={{ mt: 1 }}>View Evidence</Button>
                      </Box>
                    </>
                  )}
                </Grid>

                {selectedReport.adminNotes && selectedReport.adminNotes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Admin Notes</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      {selectedReport.adminNotes.map((note, index) => (
                        <Box key={index} sx={{ mb: index !== selectedReport.adminNotes!.length - 1 ? 2 : 0 }}>
                          <Typography variant="body2">{note.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Added on {formatDate(note.addedAt)}
                          </Typography>
                          {index !== selectedReport.adminNotes!.length - 1 && <Divider sx={{ my: 1 }} />}
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
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
      >
        {selectedReport && actionType && (
          <>
            <DialogTitle>
              {actionType === 'resolved' ? 'Approve Report' : 'Reject Report'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {actionType === 'resolved' 
                  ? 'You are about to approve this report. You can add an action note or issue a fine if applicable.' 
                  : 'You are about to reject this report. Please provide a reason for rejection.'}
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                id="note"
                label={actionType === 'resolved' ? 'Action Note (Optional)' : 'Reason for Rejection'}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                sx={{ mt: 2 }}
              />
              
              {actionType === 'resolved' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Select Action (Optional)</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<AttachMoneyIcon />}>Issue Fine</Button>
                    <Button variant="outlined" startIcon={<GavelIcon />}>Legal Notice</Button>
                  </Stack>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeActionDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color={actionType === 'resolved' ? 'success' : 'error'} 
                onClick={completeAction}
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