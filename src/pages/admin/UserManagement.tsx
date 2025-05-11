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
  Stack,
  useTheme,
  alpha,
  Avatar,
  Tooltip,
  tableCellClasses,
  styled,
  InputAdornment
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axiosInstance from '../../utils/axiosInstance';
import { useTheme as useMuiTheme } from '@mui/material';

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

// Styled components for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 14,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '12px 16px',
    '&:last-child': {
      paddingRight: 24,
    }
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.01),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  transition: 'background-color 0.2s ease',
}));

const UserManagement: React.FC = () => {
  const theme = useMuiTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(lowerCaseSearch) || 
          user.email.toLowerCase().includes(lowerCaseSearch) ||
          user.apartment.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredUsers(filtered);
    }
    setPage(0);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(`Failed to load users: ${err.response?.data?.message || err.message || 'Please try again later.'}`);
      // Use sample data as fallback
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
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
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
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
        return (
          <Chip 
            icon={<AdminPanelSettingsIcon />} 
            label="Admin" 
            color="primary" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
      case 'moderator':
        return (
          <Chip 
            icon={<PersonIcon />} 
            label="Moderator" 
            color="secondary" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
      default:
        return (
          <Chip 
            icon={<PersonIcon />} 
            label="User" 
            color="default" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Chip 
            label="Active" 
            color="success" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
      case 'suspended':
        return (
          <Chip 
            label="Suspended" 
            color="error" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
      default:
        return (
          <Chip 
            label="Inactive" 
            color="default" 
            size="small"
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '6px',
              px: 1
            }}
          />
        );
    }
  };

  const getNameInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        pb: 4,
        pt: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ 
        py: 4,
        position: 'relative',
        zIndex: 1
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              boxShadow: theme.shadows[2], 
              borderRadius: 2 
            }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            position: 'relative',
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            p: 3,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
            boxShadow: theme.shadows[4],
            color: 'white',
            backdropFilter: 'blur(10px)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, ${alpha(theme.palette.common.white, 0)}, ${alpha(theme.palette.common.white, 0.3)}, ${alpha(theme.palette.common.white, 0)})`
            }
          }}
        >
          <Box sx={{ position: 'absolute', bottom: -20, right: -20, opacity: 0.1, fontSize: 180 }}>
            <PersonIcon fontSize="inherit" />
          </Box>
          <Typography component="h1" variant="h4" fontWeight="bold">
            User Management
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, mt: 0.5 }}>
            Manage residents and administrators
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
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
              }} 
              elevation={0}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3, 
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                gap: 2
              }}>
                <TextField
                  placeholder="Search users..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    maxWidth: 400,
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Add New User
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : filteredUsers.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  py: 5,
                  opacity: 0.7
                }}>
                  <SearchIcon sx={{ fontSize: 60, color: 'info.main', mb: 2, opacity: 0.6 }} />
                  <Typography align="center" variant="h6">No users found</Typography>
                  <Typography align="center">Try adjusting your search terms</Typography>
                </Box>
              ) : (
                <>
                  <TableContainer 
                    component={Paper} 
                    elevation={0}
                    sx={{ 
                      boxShadow: 'none',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                      backgroundColor: alpha(theme.palette.background.paper, 0.7),
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Table aria-label="users table" size="medium">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>User</StyledTableCell>
                          <StyledTableCell>Email</StyledTableCell>
                          <StyledTableCell>Apartment</StyledTableCell>
                          <StyledTableCell>Role</StyledTableCell>
                          <StyledTableCell>Status</StyledTableCell>
                          <StyledTableCell>Join Date</StyledTableCell>
                          <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((user) => (
                            <StyledTableRow key={user.id}>
                              <StyledTableCell component="th" scope="row">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 36, 
                                      height: 36, 
                                      bgcolor: theme.palette.primary.main,
                                      color: 'white',
                                      fontWeight: 'bold',
                                      mr: 2,
                                      fontSize: 14
                                    }}
                                  >
                                    {getNameInitials(user.name)}
                                  </Avatar>
                                  <Typography variant="body1" fontWeight="medium">{user.name}</Typography>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>{user.email}</StyledTableCell>
                              <StyledTableCell>
                                <Chip 
                                  label={user.apartment} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ 
                                    borderRadius: '6px'
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>{getRoleChip(user.role)}</StyledTableCell>
                              <StyledTableCell>{getStatusChip(user.status)}</StyledTableCell>
                              <StyledTableCell>{user.joinDate}</StyledTableCell>
                              <StyledTableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                  <Tooltip title="View Details">
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleViewUser(user)}
                                      sx={{
                                        color: theme.palette.info.main,
                                        bgcolor: alpha(theme.palette.info.main, 0.1),
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.info.main, 0.2),
                                        }
                                      }}
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Edit User">
                                    <IconButton 
                                      size="small"
                                      sx={{
                                        color: theme.palette.primary.main,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  {user.status === 'active' ? (
                                    <Tooltip title="Suspend User">
                                      <IconButton 
                                        size="small"
                                        sx={{
                                          color: theme.palette.warning.main,
                                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.warning.main, 0.2),
                                          }
                                        }}
                                      >
                                        <BlockIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="Activate User">
                                      <IconButton 
                                        size="small"
                                        sx={{
                                          color: theme.palette.success.main,
                                          bgcolor: alpha(theme.palette.success.main, 0.1),
                                          '&:hover': {
                                            bgcolor: alpha(theme.palette.success.main, 0.2),
                                          }
                                        }}
                                      >
                                        <PersonIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  <Tooltip title="Delete User">
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleDeleteUser(user)}
                                      sx={{
                                        color: theme.palette.error.main,
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        '&:hover': {
                                          bgcolor: alpha(theme.palette.error.main, 0.2),
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredUsers.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </TableContainer>
                </>
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
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
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
            }
          }}
        >
          {selectedUser && (
            <>
              <DialogTitle sx={{ 
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 18
                  }}
                >
                  {getNameInitials(selectedUser.name)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{selectedUser.name}</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {getRoleChip(selectedUser.role)} 
                    <Box component="span" sx={{ mx: 1 }}>•</Box> 
                    {getStatusChip(selectedUser.status)}
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Email</Typography>
                      <Typography variant="body1" fontWeight="medium">{selectedUser.email}</Typography>
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Phone</Typography>
                      <Typography variant="body1">{selectedUser.phone}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Apartment</Typography>
                      <Chip 
                        label={selectedUser.apartment} 
                        variant="outlined" 
                        size="small"
                        sx={{ borderRadius: '6px' }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>Joined On</Typography>
                      <Typography variant="body1">{selectedUser.joinDate}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: alpha(theme.palette.primary.light, 0.05),
                        borderColor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Activity Summary
                      </Typography>
                      <Typography variant="body2">
                        This user has been active for {Math.floor(Math.random() * 24)} months and has submitted {Math.floor(Math.random() * 10)} reports. 
                        Last login was on {new Date().toLocaleDateString()}.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2, px: 3 }}>
                <Button 
                  onClick={() => setDialogOpen(false)}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Close
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }
                  }}
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
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.85),
              border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
              maxWidth: 400,
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
            }
          }}
        >
          <DialogTitle sx={{ 
            p: 3, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            bgcolor: alpha(theme.palette.error.light, 0.1),
            color: theme.palette.error.dark
          }}>
            <WarningIcon color="error" />
            <Typography variant="h6" fontWeight="bold">Confirm Delete</Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to delete user <Box component="span" fontWeight="bold">"{userToDelete?.name}"</Box>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This action cannot be undone and all user data will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, px: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none'
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={confirmDelete}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.4)}`,
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserManagement; 