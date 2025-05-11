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
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  IconButton,
  Link,
  LinearProgress
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
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import axiosInstance from '../../utils/axiosInstance';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, LineChart, Line, CartesianGrid, Area, Sector } from 'recharts';
import AttachmentIcon from '@mui/icons-material/Attachment';

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const RADIAL_GRADIENT_SUFFIX = '_pie_grad';
const DROP_SHADOW_ID = 'dropShadow';
const HIGHLIGHT_FILTER_ID = 'highlightEffect';
const BEVEL_FILTER_ID = 'bevelEffect';
const BAR_TOP_GRADIENT_ID = 'barTopGradient';
const BAR_FRONT_GRADIENT_ID = 'barFrontGradient';
const BAR_RIGHT_GRADIENT_ID = 'barRightGradient';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [reports, setReports] = useState<Report[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolved' | 'rejected' | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Additional stats
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [monthlyReports, setMonthlyReports] = useState<Array<{ month: string, count: number }>>([]);
  const [categoryData, setCategoryData] = useState<Array<{ name: string, value: number }>>([]);

  // State for active pie segment index
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchReports();
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (stats && stats.categories) {
      const categoryChartData = stats.categories.map(cat => ({
        name: cat._id,
        value: cat.count
      }));
      setCategoryData(categoryChartData);
    }
  }, [stats]);

  useEffect(() => {
    if (reports.length > 0) {
      generateMonthlyReportData(reports);
    }
  }, [reports]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/reports/admin/all');
      setReports(response.data);
      // Get 5 most recent reports
      const sorted = [...response.data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentReports(sorted.slice(0, 5));
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

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data.slice(0, 5)); // Get 5 most recent users
      setTotalUsers(response.data.length);
      setActiveUsers(response.data.filter((user: User) => user.status === 'active').length);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Just log errors for users, don't display
    } finally {
      setUsersLoading(false);
    }
  };

  // Generate real monthly report data from actual reports
  const generateMonthlyReportData = (reportData: Report[]) => {
    // Create a map for months with initial count of 0
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: number } = {};
    
    // Initialize all months with 0 (for current year)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Initialize all months up to current month
    for (let i = 0; i <= currentMonth; i++) {
      monthlyData[monthNames[i]] = 0;
    }
    
    // Aggregate reports by month
    reportData.forEach(report => {
      const reportDate = new Date(report.createdAt);
      // Only include current year reports
      if (reportDate.getFullYear() === currentYear) {
        const month = monthNames[reportDate.getMonth()];
        if (month in monthlyData) {
          monthlyData[month]++;
        }
      }
    });
    
    // Convert to array format needed for chart
    const monthlyReportsData = Object.keys(monthlyData)
      .map(month => ({ 
        month, 
        count: monthlyData[month]
      }))
      // Ensure correct month order (Jan to Dec)
      .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month));
    
    setMonthlyReports(monthlyReportsData);
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
    console.log('[Dashboard Debug] handleViewDetails - report:', report);
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
                label="Pending" 
                color="warning" 
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
      case 'in-progress':
        return <Chip 
                icon={<PendingIcon />} 
                label="In Progress" 
                color="info" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  const getRoleChip = (role: string) => {
    switch (role) {
      case 'admin':
        return <Chip 
                icon={<AdminPanelSettingsIcon />} 
                label="Admin" 
                color="primary" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      case 'moderator':
        return <Chip 
                icon={<EventNoteIcon />} 
                label="Moderator" 
                color="info" 
                size="small"
                sx={{ fontWeight: 'medium' }}
              />;
      default:
        return <Chip 
                icon={<PersonIcon />} 
                label="User" 
                color="default" 
                size="small"
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />;
    }
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

  const refreshDashboard = () => {
    fetchReports();
    fetchStats();
    fetchUsers();
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';

    // More sophisticated label positioning and content
    const outerRadiusLabel = outerRadius + 10; // Position label slightly outside the pie
    const xLabel = cx + outerRadiusLabel * Math.cos(-midAngle * RADIAN);
    const yLabel = cy + outerRadiusLabel * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 3) return null; // Don't render label for very small slices

    return (
      <>
        <text
          x={x}
          y={y}
          fill={theme.palette.getContrastText(COLORS[index % COLORS.length])}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize="10px"
          fontWeight="bold"
          style={{
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  // Handler for pie segment activation (hover)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Handler for pie segment deactivation (hover out)
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  // Render active pie segment with special effects
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const mx = cx + (outerRadius + 10) * cos;
    const my = cy + (outerRadius + 10) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    // Calculate slight offset for 3D "pop" effect
    const offsetRadius = 5;
    const offsetX = offsetRadius * cos;
    const offsetY = offsetRadius * sin;

    return (
      <g>
        {/* Base sector with shadow */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 3}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={theme.palette.background.paper}
          strokeWidth={2}
          style={{ filter: `url(#${DROP_SHADOW_ID})`, opacity: 0.9 }}
        />
        
        {/* Elevated sector (appears to pop out) */}
        <Sector
          cx={cx + offsetX}
          cy={cy + offsetY}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          filter={`url(#${HIGHLIGHT_FILTER_ID})`}
        />

        {/* Label line */}
        <path d={`M${cx},${cy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        {/* Enhanced label text */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={theme.palette.text.primary} style={{ 
          fontWeight: 'bold',
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))',
          fontSize: '12px'
        }}>
          {payload.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={theme.palette.text.secondary} style={{fontSize: '11px'}}>
          {`(${value} reports, ${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // Custom bar shape to create 3D effect with top face
  const CustomBar = (props: any) => {
    const { x, y, width, height, fill } = props;
    
    // Only draw the 3D effect if bar is tall enough
    if (height < 10) return <rect x={x} y={y} width={width} height={height} fill={fill} />;
    
    const topHeight = 4; // Height of the "top" face of 3D bar
    const sideWidth = 4; // Width of the "side" face of 3D bar
    
    return (
      <g>
        {/* Front face with gradient */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#${BAR_FRONT_GRADIENT_ID})`}
          rx={2}
          ry={2}
          style={{
            filter: `url(#${DROP_SHADOW_ID})`,
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Top face with different gradient for 3D effect */}
        <rect
          x={x}
          y={y}
          width={width}
          height={topHeight}
          fill={`url(#${BAR_TOP_GRADIENT_ID})`}
          rx={2}
          ry={2}
        />
        
        {/* Right side face with different gradient for 3D effect */}
        <rect
          x={x + width - sideWidth}
          y={y + topHeight}
          width={sideWidth}
          height={height - topHeight}
          fill={`url(#${BAR_RIGHT_GRADIENT_ID})`}
        />
      </g>
    );
  };

  const renderOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Existing content */}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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

      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography component="h1" variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Tooltip title="Refresh Dashboard">
          <IconButton 
            color="primary" 
            onClick={refreshDashboard} 
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* KPI Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Report Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: theme.shadows[3], 
            borderRadius: 3,
            backgroundImage: `linear-gradient(135deg, ${alpha('#3f51b5', 0.09)} 0%, ${alpha('#3f51b5', 0.02)} 100%)`,
            border: `1px solid ${alpha('#3f51b5', 0.1)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Total Reports
                  </Typography>
                  {statsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {stats?.total || 0}
                    </Typography>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: '#3f51b5', width: 46, height: 46 }}>
                  <FolderOpenIcon />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +12% more
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  since last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: theme.shadows[3], 
            borderRadius: 3,
            backgroundImage: `linear-gradient(135deg, ${alpha('#ff9800', 0.09)} 0%, ${alpha('#ff9800', 0.02)} 100%)`,
            border: `1px solid ${alpha('#ff9800', 0.1)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Pending Reports
                  </Typography>
                  {statsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {stats?.pending || 0}
                    </Typography>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: '#ff9800', width: 46, height: 46 }}>
                  <WarningAmberIcon />
                </Avatar>
              </Box>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={statsLoading ? 0 : (stats?.pending || 0) / (stats?.total || 1) * 100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: alpha('#ff9800', 0.2),
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#ff9800'
                    }
                  }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                  {statsLoading 
                    ? '...' 
                    : `${Math.round((stats?.pending || 0) / (stats?.total || 1) * 100)}% of total reports`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: theme.shadows[3], 
            borderRadius: 3,
            backgroundImage: `linear-gradient(135deg, ${alpha('#4caf50', 0.09)} 0%, ${alpha('#4caf50', 0.02)} 100%)`,
            border: `1px solid ${alpha('#4caf50', 0.1)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Resolved Reports
                  </Typography>
                  {statsLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {stats?.approved || 0}
                    </Typography>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: '#4caf50', width: 46, height: 46 }}>
                  <CheckCircleIcon />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  +5% increase
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                  from last week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: theme.shadows[3], 
            borderRadius: 3,
            backgroundImage: `linear-gradient(135deg, ${alpha('#9c27b0', 0.09)} 0%, ${alpha('#9c27b0', 0.02)} 100%)`,
            border: `1px solid ${alpha('#9c27b0', 0.1)}`
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography color="textSecondary" variant="subtitle2" gutterBottom>
                    Total Users
                  </Typography>
                  {usersLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography variant="h4" fontWeight="bold">
                      {totalUsers}
                    </Typography>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: '#9c27b0', width: 46, height: 46 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {usersLoading ? 'Loading...' : `${activeUsers} active users`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Reports by Category */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: 350, 
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              transform: 'perspective(1200px) rotateX(2deg)',
              transformStyle: 'preserve-3d',
              '&:hover': {
                transform: 'perspective(1200px) rotateX(4deg) scale(1.02)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1)',
              }
            }}
          >
            {/* Decorative 3D elements */}
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%', 
                top: 0, 
                left: 0, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)}, ${alpha(theme.palette.background.paper, 0)})`,
                pointerEvents: 'none',
                zIndex: 1
              }} 
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ position: 'relative', zIndex: 2 }}>
              Reports by Category
            </Typography>
            {statsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ flex: 1, position: 'relative', zIndex: 2 }}>
                <Box sx={{ height: 300, position: 'relative' }}>
                  <svg style={{ width: 0, height: 0, position: 'absolute' }}>
                    <defs>
                      <filter id={DROP_SHADOW_ID} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor={alpha(theme.palette.common.black, 0.25)} />
                      </filter>
                      
                      <filter id={HIGHLIGHT_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#FFFFFF" result="specOut">
                          <fePointLight x="150" y="60" z="20" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
                        <feMerge>
                          <feMergeNode in="litPaint" />
                        </feMerge>
                      </filter>
                      
                      <filter id={BEVEL_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.5" specularExponent="10" lightingColor="#FFFFFF" result="specOut">
                          <fePointLight x="100" y="100" z="90" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                      </filter>
                      
                      {COLORS.map((color, index) => (
                        <radialGradient key={color} id={`${color.replace('#', '')}${RADIAL_GRADIENT_SUFFIX}`} cx="30%" cy="30%" r="70%" fx="30%" fy="30%">
                          <stop offset="0%" stopColor={alpha(color, 0.9)} />
                          <stop offset="50%" stopColor={alpha(color, 0.85)} />
                          <stop offset="80%" stopColor={alpha(color, 0.7)} />
                          <stop offset="100%" stopColor={alpha(color, 0.6)} />
                        </radialGradient>
                      ))}
                    </defs>
                  </svg>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 30, bottom: 20, left: 30 }} style={{ filter: `url(#${DROP_SHADOW_ID})` }}>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={5}
                        cornerRadius={8}
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                        animationBegin={200}
                        animationDuration={800}
                        animationEasing="ease-out"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#${COLORS[index % COLORS.length].replace('#', '')}${RADIAL_GRADIENT_SUFFIX})`}
                            stroke={theme.palette.background.paper}
                            strokeWidth={3}
                            style={{ 
                              transition: 'all 0.3s ease',
                              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                              filter: activeIndex === index ? `url(#${HIGHLIGHT_FILTER_ID})` : 'none'
                            }}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: alpha(theme.palette.background.paper, 0.95), 
                          borderRadius: '12px', 
                          borderColor: theme.palette.divider,
                          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                          padding: '10px',
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }} 
                        cursor={{ 
                          fill: alpha(theme.palette.primary.main, 0.1),
                          stroke: alpha(theme.palette.primary.main, 0.3),
                          strokeWidth: 1,
                          strokeDasharray: '5 5',
                          radius: 8
                        }}
                        formatter={(value, name) => [`${value} reports`, name]}
                        labelFormatter={(name) => `Category: ${name}`}
                      />
                      <Legend 
                        iconSize={10} 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} 
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Reports trend */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: 350, 
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              transform: 'perspective(1200px) rotateX(2deg)',
              transformStyle: 'preserve-3d',
              '&:hover': {
                transform: 'perspective(1200px) rotateX(4deg) scale(1.02)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1)',
              }
            }}
          >
            {/* Decorative 3D elements */}
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%', 
                top: 0, 
                left: 0, 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.1)}, ${alpha(theme.palette.background.paper, 0)})`,
                pointerEvents: 'none',
                zIndex: 1
              }} 
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ position: 'relative', zIndex: 2 }}>
              Monthly Reports Trend
            </Typography>
            <Box sx={{ flex: 1, position: 'relative', zIndex: 2 }}>
              <Box sx={{ height: 300, position: 'relative' }}>
                <svg style={{ width: 0, height: 0, position: 'absolute' }}>
                  <defs>
                    <filter id={DROP_SHADOW_ID} x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor={alpha(theme.palette.common.black, 0.25)} />
                    </filter>
                    
                    <linearGradient id={BAR_FRONT_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 1)} />
                      <stop offset="50%" stopColor={alpha(theme.palette.primary.main, 0.9)} />
                      <stop offset="100%" stopColor={alpha(theme.palette.primary.dark, 0.8)} />
                    </linearGradient>
                    
                    <linearGradient id={BAR_TOP_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={alpha(theme.palette.primary.light, 1)} />
                      <stop offset="100%" stopColor={alpha(theme.palette.primary.main, 0.9)} />
                    </linearGradient>
                    
                    <linearGradient id={BAR_RIGHT_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 0.9)} />
                      <stop offset="100%" stopColor={alpha(theme.palette.primary.dark, 0.8)} />
                    </linearGradient>
                    
                    <linearGradient id="barHoverColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={alpha(theme.palette.secondary.light, 1)} />
                      <stop offset="70%" stopColor={alpha(theme.palette.secondary.main, 0.85)} />
                      <stop offset="100%" stopColor={alpha(theme.palette.secondary.dark, 0.8)} />
                    </linearGradient>
                  </defs>
                </svg>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={monthlyReports} 
                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                    style={{ filter: `url(#${DROP_SHADOW_ID})`, transform: 'translateZ(10px)' }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={alpha(theme.palette.divider, 0.3)}
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 11, fill: theme.palette.text.secondary, fontWeight: 500 }} 
                      axisLine={{ stroke: theme.palette.divider }}
                      tickLine={{ stroke: theme.palette.divider }}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: theme.palette.text.secondary }} 
                      axisLine={{ stroke: theme.palette.divider }}
                      tickLine={{ stroke: theme.palette.divider }}
                      width={35}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: alpha(theme.palette.background.paper, 0.95), 
                        borderRadius: '12px', 
                        borderColor: theme.palette.divider,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        padding: '10px',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                      cursor={{ 
                        fill: alpha(theme.palette.primary.main, 0.1),
                        stroke: alpha(theme.palette.primary.main, 0.3),
                        strokeWidth: 1,
                        strokeDasharray: '5 5',
                        radius: 8
                      }} 
                      formatter={(value) => [`${value} reports`, 'Count']}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend 
                      iconSize={12} 
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      formatter={(value) => <span style={{ color: theme.palette.text.primary, fontWeight: 500 }}>{value}</span>}
                    />
                    <Bar 
                      dataKey="count" 
                      name="Report Count"
                      barSize={30}
                      // Custom shape for 3D effect
                      shape={<CustomBar />}
                      // Animation settings
                      animationBegin={300}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent activity row */}
      <Grid container spacing={3}>
        {/* Recent Reports */}
        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 0, 
              overflow: 'hidden',
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Reports
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, flex: 1 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer sx={{ flex: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Reported By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReports.length > 0 ? (
                      recentReports.map((report) => (
                        <TableRow key={report._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 200 }}>
                              {report.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={report.category} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>
                            {typeof report.submittedBy === 'object' 
                              ? report.submittedBy.name 
                              : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(report.status)}
                          </TableCell>
                          <TableCell>{formatDate(report.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'flex-end',
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                color="primary"
                component={Link}
                href="#"
                onClick={() => {
                  // Navigate to the incidents tab in the admin panel
                  window.parent.postMessage({ type: 'NAVIGATE_ADMIN_TAB', tab: 'incidents' }, '*');
                }}
              >
                View All Reports
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 0, 
              overflow: 'hidden',
              borderRadius: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Users
              </Typography>
            </Box>
            
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, flex: 1 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer sx={{ flex: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32,
                                  bgcolor: theme.palette.primary.main
                                }}
                              >
                                {user.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {user.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {getRoleChip(user.role)}
                          </TableCell>
                          <TableCell>
                            {formatDate(user.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'flex-end',
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Button 
                endIcon={<ArrowForwardIcon />} 
                color="primary"
                component={Link}
                href="#"
                onClick={() => {
                  // Navigate to the user management tab in the admin panel
                  window.parent.postMessage({ type: 'NAVIGATE_ADMIN_TAB', tab: 'users' }, '*');
                }}
              >
                Manage Users
              </Button>
            </Box>
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
                {(() => { 
                  console.log('[Dashboard Debug] DialogContent - selectedReport:', selectedReport); 
                  return null; 
                })()}
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
                          {(() => {
                            if (!selectedReport || !selectedReport.evidence) {
                              console.log('[Evidence Debug] selectedReport or selectedReport.evidence is missing or falsy.');
                              return <Typography variant="body2" color="text.secondary">Evidence not available.</Typography>;
                            }

                            const fName = selectedReport.evidence.split('/').pop() || 'evidence_file';
                            const evidenceUrl = `http://localhost:5000/api/reports/evidence/${encodeURIComponent(fName)}`;
                            const fileExtension = fName.split('.').pop()?.toLowerCase();

                            console.log('[Evidence Debug] selectedReport.evidence (valid):', selectedReport.evidence);
                            console.log('[Evidence Debug] fName:', fName);
                            console.log('[Evidence Debug] evidenceUrl:', evidenceUrl);
                            console.log('[Evidence Debug] fileExtension:', fileExtension);

                            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
                              return (
                                <img 
                                  src={evidenceUrl} 
                                  alt="Evidence" 
                                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} 
                                />
                              );
                            } else if (['mp4', 'webm', 'ogg', 'mov'].includes(fileExtension || '')) {
                              return (
                                <video 
                                  src={evidenceUrl} 
                                  controls 
                                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} 
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