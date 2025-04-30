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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Stack
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axiosInstance from '../../utils/axiosInstance';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  apartment: string;
  joinDate: string;
}

// Sample users data as fallback
const sampleUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    role: 'admin',
    status: 'active',
    apartment: 'A-101',
    joinDate: '2022-01-15'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    role: 'user',
    status: 'active',
    apartment: 'B-205',
    joinDate: '2022-03-20'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-567-8901',
    role: 'moderator',
    status: 'active',
    apartment: 'C-310',
    joinDate: '2022-02-10'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '555-345-6789',
    role: 'user',
    status: 'suspended',
    apartment: 'A-102',
    joinDate: '2022-04-05'
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '555-234-5678',
    role: 'user',
    status: 'inactive',
    apartment: 'D-401',
    joinDate: '2022-01-30'
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(`Failed to load users: ${err.response?.data?.message || err.message || 'Please try again later.'}`);
      // Use sample data as fallback only if needed (consider removing fallback)
      // setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await axiosInstance.delete(`/admin/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(`Failed to delete user: ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const getRoleChip = (role: string) => {
    switch (role) {
      case 'admin':
        return <Chip icon={<AdminPanelSettingsIcon />} label="Admin" color="primary" size="small" />;
      case 'moderator':
        return <Chip icon={<PersonIcon />} label="Moderator" color="secondary" size="small" />;
      default:
        return <Chip icon={<PersonIcon />} label="User" color="default" size="small" />;
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'suspended':
        return <Chip label="Suspended" color="error" size="small" />;
      default:
        return <Chip label="Inactive" color="default" size="small" />;
    }
  };

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h1" variant="h5">
                User Management
              </Typography>
              <Button variant="contained" color="primary">
                Add New User
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table aria-label="users table" size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Apartment</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell component="th" scope="row">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.apartment}</TableCell>
                          <TableCell>{getRoleChip(user.role)}</TableCell>
                          <TableCell>{getStatusChip(user.status)}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewUser(user)}
                                color="info"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small"
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {user.status === 'active' ? (
                                <IconButton 
                                  size="small"
                                  color="warning"
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton 
                                  size="small"
                                  color="success"
                                >
                                  <PersonIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* User Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              User Details
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.name}</Typography>
                  
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.email}</Typography>
                  
                  <Typography variant="subtitle2">Phone</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.phone}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Apartment</Typography>
                  <Typography variant="body1" gutterBottom>{selectedUser.apartment}</Typography>
                  
                  <Typography variant="subtitle2">Role</Typography>
                  <Box sx={{ mb: 1 }}>{getRoleChip(selectedUser.role)}</Box>
                  
                  <Typography variant="subtitle2">Status</Typography>
                  <Box>{getStatusChip(selectedUser.status)}</Box>
                  
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>Joined On</Typography>
                  <Typography variant="body1">{selectedUser.joinDate}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<EditIcon />}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement; 