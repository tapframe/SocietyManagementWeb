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
  IconButton
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { alpha } from '@mui/material/styles';
import axiosInstance from '../../utils/axiosInstance';
import CancelIcon from '@mui/icons-material/Cancel';

interface Incident {
  id: number;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: string;
  reportedBy: string;
  assignedTo?: string;
  dateReported: string;
  dateResolved?: string;
  evidence?: string;
}

// Sample incidents data as fallback
const sampleIncidents: Incident[] = [
  {
    id: 1,
    title: 'Water Leakage in Building A',
    description: 'Water leaking from the ceiling in the common area of Building A, first floor.',
    category: 'Maintenance',
    severity: 'high',
    status: 'in-progress',
    location: 'Building A, First Floor',
    reportedBy: 'John Doe',
    assignedTo: 'Maintenance Team',
    dateReported: '2023-10-15',
    evidence: 'photo-1.jpg'
  },
  {
    id: 2,
    title: 'Broken Street Light',
    description: 'Street light near the park entrance is not working, area is dark at night.',
    category: 'Infrastructure',
    severity: 'medium',
    status: 'pending',
    location: 'Main Street Park Entrance',
    reportedBy: 'Jane Smith',
    dateReported: '2023-10-18'
  },
  {
    id: 3,
    title: 'Unauthorized Access',
    description: 'Unknown person trying to access Building C without authorization.',
    category: 'Security',
    severity: 'critical',
    status: 'resolved',
    location: 'Building C Entrance',
    reportedBy: 'Security Guard',
    assignedTo: 'Security Team',
    dateReported: '2023-10-10',
    dateResolved: '2023-10-10',
    evidence: 'cctv-footage.mp4'
  },
  {
    id: 4,
    title: 'Noise Complaint',
    description: 'Loud music playing after hours in apartment D-205.',
    category: 'Disturbance',
    severity: 'low',
    status: 'rejected',
    location: 'Building D, Apartment 205',
    reportedBy: 'Anonymous Resident',
    assignedTo: 'Community Manager',
    dateReported: '2023-10-17',
    dateResolved: '2023-10-18'
  },
  {
    id: 5,
    title: 'Damaged Playground Equipment',
    description: 'Swing set in the children\'s playground is damaged and may be unsafe.',
    category: 'Maintenance',
    severity: 'high',
    status: 'in-progress',
    location: 'Central Playground',
    reportedBy: 'Parent Association',
    assignedTo: 'Facilities Team',
    dateReported: '2023-10-12'
  }
];

const IncidentsManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    severity: 'all',
    category: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [assignTo, setAssignTo] = useState('');

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [incidents, filters, searchQuery]);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/reports/admin/all');
      
      // Map the reports data to the incident structure
      const mappedIncidents = response.data.map((report: any) => {
        // Determine the appropriate status - if the status is 'pending' but has
        // an assignee, we'll show it as 'in-progress' in the UI
        let displayStatus = report.status;
        if (report.status === 'pending' && report.assignedTo) {
          displayStatus = 'in-progress';
        }
        
        return {
        id: report._id,
        title: report.title,
        description: report.description,
        category: report.category,
        severity: report.type || 'medium', // Use type or default to medium
          status: displayStatus,
        location: report.location,
        reportedBy: typeof report.submittedBy === 'object' ? report.submittedBy.name : 'Unknown',
        assignedTo: report.assignedTo || undefined,
        dateReported: report.createdAt.split('T')[0],
        dateResolved: report.resolvedAt ? report.resolvedAt.split('T')[0] : undefined,
        evidence: report.evidence
        };
      });
      
      setIncidents(mappedIncidents);
      setFilteredIncidents(mappedIncidents);
    } catch (err: any) {
      console.error('Error fetching incidents:', err);
      setError(`Failed to load incidents: ${err.response?.data?.message || err.message || 'Please try again later.'}`);
      // Use sample data as fallback only if needed (consider removing fallback)
      // setIncidents(sampleIncidents);
      // setFilteredIncidents(sampleIncidents);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...incidents];

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(incident => incident.status === filters.status);
    }

    // Apply severity filter
    if (filters.severity !== 'all') {
      result = result.filter(incident => incident.severity === filters.severity);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(incident => incident.category === filters.category);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(incident => 
        incident.title.toLowerCase().includes(query) ||
        incident.description.toLowerCase().includes(query) ||
        incident.location.toLowerCase().includes(query) ||
        incident.reportedBy.toLowerCase().includes(query)
      );
    }

    setFilteredIncidents(result);
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

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const openUpdateDialog = (incident: Incident) => {
    setSelectedIncident(incident);
    setStatusUpdate(incident.status);
    setAssignTo(incident.assignedTo || '');
    setUpdateDialogOpen(true);
  };

  const updateIncidentStatus = async () => {
    if (!selectedIncident) return;
    
    try {
      // Create a proper payload that matches what the backend expects
      const payload = {
        status: statusUpdate,
        note: statusUpdate === 'in-progress' && assignTo 
          ? `${statusNote}\nAssigned to: ${assignTo}` 
          : statusNote,
        actionDate: new Date().toISOString()
      };

      // Make sure to include the correct token in headers via axiosInstance
      const response = await axiosInstance.put(`/reports/admin/${selectedIncident.id}/status`, payload);
      
      // If we're setting it to in-progress and have an assignee, update the assignment
      if (statusUpdate === 'in-progress' && assignTo && assignTo !== selectedIncident.assignedTo) {
        try {
          await axiosInstance.patch(`/reports/${selectedIncident.id}/assign`, {
            adminId: assignTo
          });
        } catch (assignErr) {
          console.warn('Could not update assignment via API, using note only', assignErr);
        }
      }
      
      // Update local state after successful API call
      setIncidents(prevIncidents => 
        prevIncidents.map(incident => 
          incident.id === selectedIncident.id 
            ? { 
                ...incident, 
                status: statusUpdate as any, 
                assignedTo: statusUpdate === 'in-progress' ? assignTo : incident.assignedTo,
                dateResolved: ['resolved', 'rejected'].includes(statusUpdate) 
                  ? new Date().toISOString().split('T')[0] 
                  : incident.dateResolved 
              }
            : incident
        )
      );
      
      setUpdateDialogOpen(false);
      setStatusNote('');
      setAssignTo('');
      
      // Show success message
      setError(null);
      
      // Refresh data to ensure we have the latest from the server
      fetchIncidents();
    } catch (err: any) {
      console.error('Error updating incident status:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Please try again.';
      setError(`Failed to update incident status: ${errorMsg}`);
    }
  };

  const getSeverityChip = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Chip label="Critical" color="error" size="small" />;
      case 'high':
        return <Chip label="High" color="warning" size="small" />;
      case 'medium':
        return <Chip label="Medium" color="info" size="small" />;
      default:
        return <Chip label="Low" color="success" size="small" />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'in-progress':
        return <Chip icon={<PendingIcon />} label="In Progress" color="info" size="small" />;
      case 'resolved':
        return <Chip icon={<CheckCircleIcon />} label="Resolved" color="success" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(incidents.map(incident => incident.category));
    return Array.from(categories);
  };

  const renderIncidentCard = (incident: Incident) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>{incident.title}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} component="div">
              <Grid container spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Grid item>
                  <EventIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                </Grid>
                <Grid item>
                  Reported on {incident.dateReported}
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <PersonIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                </Grid>
                <Grid item>
                  by {incident.reportedBy}
                </Grid>
              </Grid>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <LocationOnIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> 
              {incident.location}
            </Typography>
            <Typography variant="body2" paragraph sx={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {incident.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} container direction="column" justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, alignItems: { xs: 'center', md: 'flex-end' }, flexWrap: 'wrap' }}>
              {getStatusChip(incident.status)}
              {getSeverityChip(incident.severity)}
              <Chip label={incident.category} size="small" />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<VisibilityIcon />}
                onClick={() => handleViewIncident(incident)}
              >
                Details
              </Button>
              {incident.status !== 'resolved' && incident.status !== 'rejected' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => openUpdateDialog(incident)}
                >
                  Update Status
                </Button>
              )}
            </Stack>
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
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }} elevation={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography component="h1" variant="h5">
                Incidents Management
              </Typography>
              <Button variant="contained" color="primary">
                Report New Incident
              </Button>
            </Box>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Incidents"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange as any}
                      label="Status"
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="severity-filter-label">Severity</InputLabel>
                    <Select
                      labelId="severity-filter-label"
                      name="severity"
                      value={filters.severity}
                      onChange={handleFilterChange as any}
                      label="Severity"
                    >
                      <MenuItem value="all">All Severity</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel id="category-filter-label">Category</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange as any}
                      label="Category"
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

            <Divider sx={{ mb: 3 }} />

            {/* Incidents List */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map(incident => renderIncidentCard(incident))
                ) : (
                  <Typography align="center">No incidents match your filters</Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Incident Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedIncident && (
          <>
            <DialogTitle>
              Incident Details #{selectedIncident.id}: {selectedIncident.title}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">Reported By</Typography>
                  <Typography variant="body1" gutterBottom>{selectedIncident.reportedBy}</Typography>
                  
                  <Typography variant="subtitle2">Date Reported</Typography>
                  <Typography variant="body1" gutterBottom>{selectedIncident.dateReported}</Typography>
                  
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography variant="body1" gutterBottom>{selectedIncident.category}</Typography>
                  
                  <Typography variant="subtitle2">Location</Typography>
                  <Typography variant="body1" gutterBottom>{selectedIncident.location}</Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle2">Status</Typography>
                      <Box>{getStatusChip(selectedIncident.status)}</Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Severity</Typography>
                      <Box>{getSeverityChip(selectedIncident.severity)}</Box>
                    </Box>
                  </Stack>
                  
                  {selectedIncident.assignedTo && (
                    <>
                      <Typography variant="subtitle2">Assigned To</Typography>
                      <Typography variant="body1" gutterBottom>{selectedIncident.assignedTo}</Typography>
                    </>
                  )}
                  
                  {selectedIncident.dateResolved && (
                    <>
                      <Typography variant="subtitle2">Date Resolved</Typography>
                      <Typography variant="body1" gutterBottom>{selectedIncident.dateResolved}</Typography>
                    </>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Description</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selectedIncident.description}</Typography>
                </Grid>
                {selectedIncident.evidence && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>Evidence</Typography>
                    {(() => {
                      const evidencePath = selectedIncident.evidence || '';
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
                            sx={{ textTransform: 'none' }}
                          >
                            View/Download: {fName}
                          </Button>
                        );
                      }
                    })()}
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'rejected' && (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    setDialogOpen(false);
                    openUpdateDialog(selectedIncident);
                  }}
                >
                  Update Status
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedIncident && (
          <>
            <DialogTitle>Update Incident Status</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" gutterBottom>
                {selectedIncident.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Current Status: {getStatusChip(selectedIncident.status)}
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="update-status-label">New Status</InputLabel>
                <Select
                  labelId="update-status-label"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  label="New Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                fullWidth
                label="Status Update Note"
                multiline
                rows={4}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
              
              {statusUpdate === 'in-progress' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="assign-to-label">Assign To</InputLabel>
                  <Select
                    labelId="assign-to-label"
                    label="Assign To"
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.target.value)}
                  >
                    <MenuItem value="Maintenance Team">Maintenance Team</MenuItem>
                    <MenuItem value="Security Team">Security Team</MenuItem>
                    <MenuItem value="Facilities Team">Facilities Team</MenuItem>
                    <MenuItem value="Community Manager">Community Manager</MenuItem>
                  </Select>
                </FormControl>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={updateIncidentStatus}
              >
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default IncidentsManagement; 