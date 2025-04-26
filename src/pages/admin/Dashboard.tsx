import React, { useState } from 'react';
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
  TextField
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GavelIcon from '@mui/icons-material/Gavel';

interface Report {
  id: number;
  title: string;
  description: string;
  submittedBy: string;
  date: string;
  category: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  evidence?: string;
}

// Sample reports data
const sampleReports: Report[] = [
  {
    id: 1,
    title: 'Traffic Signal Violation',
    description: 'Vehicle running red light at Main St and Broadway intersection',
    submittedBy: 'Citizen123',
    date: '2023-10-15',
    category: 'Traffic Violation',
    location: 'Main St & Broadway',
    status: 'pending',
    evidence: 'video-evidence-1.mp4'
  },
  {
    id: 2,
    title: 'Illegal Dumping of Waste',
    description: 'Multiple bags of construction waste dumped near city park entrance',
    submittedBy: 'GreenEarth',
    date: '2023-10-12',
    category: 'Environmental',
    location: 'Central Park East Entrance',
    status: 'approved',
    evidence: 'photo-evidence-2.jpg'
  },
  {
    id: 3,
    title: 'Noise Complaint',
    description: 'Loud construction work continuing past allowed hours of 7pm',
    submittedBy: 'SleepyNeighbor',
    date: '2023-10-10',
    category: 'Public Nuisance',
    location: '123 Residential Ave',
    status: 'rejected',
    evidence: 'audio-evidence-3.mp3'
  },
  {
    id: 4,
    title: 'Broken Street Light',
    description: 'Street light not working for past 3 days, creating safety hazard',
    submittedBy: 'SafetyFirst',
    date: '2023-10-08',
    category: 'Infrastructure',
    location: '456 Main St',
    status: 'pending',
    evidence: 'photo-evidence-4.jpg'
  },
  {
    id: 5,
    title: 'Unauthorized Street Vendor',
    description: 'Person selling merchandise without license near school zone',
    submittedBy: 'LawAbider',
    date: '2023-10-05',
    category: 'Business Regulation',
    location: 'School Zone, Education Blvd',
    status: 'pending',
    evidence: 'photo-evidence-5.jpg'
  }
];

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
  const [reports, setReports] = useState<Report[]>(sampleReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionNote, setActionNote] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  const openActionDialog = (report: Report, action: 'approve' | 'reject') => {
    setSelectedReport(report);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setActionType(null);
    setActionNote('');
  };

  const completeAction = () => {
    if (selectedReport && actionType) {
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport.id 
            ? { ...report, status: actionType === 'approve' ? 'approved' : 'rejected' }
            : report
        )
      );
      
      closeActionDialog();
      
      // In a real app, we would send this action to an API
      console.log(`Report ${selectedReport.id} ${actionType}d with note: ${actionNote}`);
    }
  };

  const pendingReports = reports.filter(report => report.status === 'pending');
  const approvedReports = reports.filter(report => report.status === 'approved');
  const rejectedReports = reports.filter(report => report.status === 'rejected');

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending Review" color="warning" />;
      case 'approved':
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const renderReportCard = (report: Report) => (
    <Card key={report.id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">{report.title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Submitted by {report.submittedBy} on {report.date}
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
                      onClick={() => openActionDialog(report, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error" 
                      size="small" 
                      startIcon={<CancelIcon />}
                      onClick={() => openActionDialog(report, 'reject')}
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
            <Typography variant="h3">{pendingReports.length}</Typography>
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
            <Typography variant="h3">{approvedReports.length}</Typography>
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
            <Typography variant="h3">{rejectedReports.length}</Typography>
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
                <Tab label={`Approved (${approvedReports.length})`} {...a11yProps(1)} />
                <Tab label={`Rejected (${rejectedReports.length})`} {...a11yProps(2)} />
                <Tab label="All Reports" {...a11yProps(3)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {pendingReports.length > 0 ? (
                pendingReports.map(report => renderReportCard(report))
              ) : (
                <Typography align="center">No pending reports to review</Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {approvedReports.length > 0 ? (
                approvedReports.map(report => renderReportCard(report))
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
              {reports.map(report => renderReportCard(report))}
            </TabPanel>
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
              Report Details #{selectedReport.id}: {selectedReport.title}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Submitted By</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.submittedBy}</Typography>
                  
                  <Typography variant="subtitle2">Date Submitted</Typography>
                  <Typography variant="body1" gutterBottom>{selectedReport.date}</Typography>
                  
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
                      openActionDialog(selectedReport, 'approve');
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
                      openActionDialog(selectedReport, 'reject');
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
              {actionType === 'approve' ? 'Approve Report' : 'Reject Report'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {actionType === 'approve' 
                  ? 'You are about to approve this report. You can add an action note or issue a fine if applicable.' 
                  : 'You are about to reject this report. Please provide a reason for rejection.'}
              </DialogContentText>
              
              <TextField
                autoFocus
                margin="dense"
                id="note"
                label={actionType === 'approve' ? 'Action Note (Optional)' : 'Reason for Rejection'}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                sx={{ mt: 2 }}
              />
              
              {actionType === 'approve' && (
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
                color={actionType === 'approve' ? 'success' : 'error'} 
                onClick={completeAction}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard; 