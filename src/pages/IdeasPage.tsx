import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
  Rating,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  CardActionArea,
  Grow,
  MenuItem,
  InputAdornment,
  Slide,
  CircularProgress,
  Skeleton
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import CategoryIcon from '@mui/icons-material/Category';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TransitionProps } from '@mui/material/transitions';

// Sample ideas data
const sampleIdeas = [
  {
    id: 1,
    title: 'Community Cleanup Drive',
    description: 'Organize monthly community cleanup drives where citizens can come together to clean public spaces, parks, and streets. This will not only improve the cleanliness of our surroundings but also foster a sense of community responsibility.',
    author: 'Rahul Sharma',
    date: '2023-06-15',
    category: 'Environment',
    upvotes: 45,
    comments: 12,
    avatar: 'R'
  },
  {
    id: 2,
    title: 'Traffic Volunteer Program',
    description: 'Create a volunteer program where citizens can assist traffic police during peak hours. Volunteers can be trained and certified to help manage traffic flow at busy intersections, especially near schools and markets.',
    author: 'Anjali Patel',
    date: '2023-07-02',
    category: 'Transportation',
    upvotes: 38,
    comments: 8,
    avatar: 'A'
  },
  {
    id: 3,
    title: 'Neighborhood Watch System',
    description: 'Implement a digital neighborhood watch system where residents can report suspicious activities or safety concerns via a mobile app. This will help create a safer community by enabling quick response to potential security threats.',
    author: 'Vikram Singh',
    date: '2023-07-10',
    category: 'Safety',
    upvotes: 52,
    comments: 15,
    avatar: 'V'
  },
  {
    id: 4,
    title: 'E-waste Collection Centers',
    description: 'Set up dedicated e-waste collection centers in every neighborhood to properly dispose of electronic waste. This initiative can help prevent environmental damage caused by improper disposal of electronic items.',
    author: 'Priya Malhotra',
    date: '2023-08-05',
    category: 'Environment',
    upvotes: 29,
    comments: 6,
    avatar: 'P'
  }
];

const categories = [
  'Environment',
  'Transportation',
  'Safety',
  'Education',
  'Health',
  'Technology',
  'Infrastructure',
  'Social Welfare',
  'Other'
];

// Slide transition for Snackbar
const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide {...props} direction="up" ref={ref} />;
});

const IdeasPage: React.FC = () => {
  const theme = useTheme();
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [filter, setFilter] = useState('');
  const [voted, setVoted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Simulate loading of ideas
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIdea(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (name in errors) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      category: ''
    };
    let valid = true;

    if (!newIdea.title) {
      newErrors.title = 'Title is required';
      valid = false;
    } else if (newIdea.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      valid = false;
    }

    if (!newIdea.description) {
      newErrors.description = 'Description is required';
      valid = false;
    } else if (newIdea.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
      valid = false;
    }

    if (!newIdea.category) {
      newErrors.category = 'Please select a category';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // In a real app, we would send this to an API
        const newIdeaObject = {
          id: ideas.length + 1,
          title: newIdea.title,
          description: newIdea.description,
          category: newIdea.category,
          author: 'Current User', // In a real app, this would be the logged-in user
          date: new Date().toISOString().split('T')[0],
          upvotes: 0,
          comments: 0,
          avatar: 'U'
        };

        setIdeas(prev => [newIdeaObject, ...prev]);
        setNewIdea({
          title: '',
          description: '',
          category: ''
        });

        setSnackbar({
          open: true,
          message: 'Your idea has been successfully submitted!',
          severity: 'success'
        });
        
        setSubmitting(false);
      }, 800);
    }
  };

  const handleUpvote = (id: number) => {
    if (voted.includes(id)) return;
    
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea
      )
    );
    setVoted(prev => [...prev, id]);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const filteredIdeas = filter 
    ? ideas.filter(idea => idea.category === filter)
    : ideas;

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const getRandomGradient = (seed: number) => {
    const colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.secondary.light, theme.palette.secondary.main],
      ['#4dabf5', '#1976d2'],
      ['#ff9800', '#ed6c02'],
      ['#66bb6a', '#2e7d32']
    ];
    return `linear-gradient(135deg, ${colors[seed % colors.length][0]} 0%, ${colors[seed % colors.length][1]} 100%)`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box 
        sx={{ 
          mb: 7, 
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,203,243,0.05) 70%, rgba(255,255,255,0) 100%)',
            zIndex: -1
          }
        }}
      >
        <Typography 
          component="h1" 
          variant="h2" 
          gutterBottom
          sx={{
            fontWeight: '800',
            background: 'linear-gradient(45deg, #2196F3 20%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            mb: 2
          }}
        >
          Innovate Together
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            mb: 3, 
            fontWeight: 400,
            lineHeight: 1.5,
            color: alpha(theme.palette.text.primary, 0.7)
          }}
        >
          Share brilliant ideas and shape the future of our community
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          {categories.slice(0, 5).map(category => (
            <Chip
              key={category}
              label={category}
              color="primary"
              variant="outlined"
              size="medium"
              sx={{
                borderRadius: 5,
                px: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => setFilter(category)}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Submit new idea section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              height: '100%', 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 10px 40px -10px ${alpha(theme.palette.primary.main, 0.12)}`,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.2)} 0%, transparent 70%)`,
                zIndex: 0
              },
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 20px 40px -15px ${alpha(theme.palette.primary.main, 0.2)}`,
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              position: 'relative',
              zIndex: 1
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.main, 0.1),
                  mr: 2
                }}
              >
                <LightbulbIcon 
                  color="primary" 
                  sx={{ 
                    fontSize: '1.8rem',
                  }} 
                />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700">Share Your Idea</Typography>
                <Typography variant="body2" color="text.secondary">Help improve our community</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 4 }} />
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ position: 'relative', zIndex: 1 }}>
              <TextField
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoFocus
                value={newIdea.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="primary" sx={{ fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover, &.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                      }
                    },
                  }
                }}
              />
              
              <TextField
                required
                fullWidth
                select
                id="category"
                label="Category"
                name="category"
                value={newIdea.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category || "Select the most relevant category"}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="primary" sx={{ fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover, &.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                      }
                    },
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map(option => (
                  <MenuItem key={option} value={option} sx={{
                    borderLeft: option === newIdea.category ? `3px solid ${theme.palette.primary.main}` : 'none',
                    backgroundColor: option === newIdea.category ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={5}
                value={newIdea.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description || "How would your idea benefit the community?"}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <DescriptionIcon color="primary" sx={{ fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover, &.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1px',
                      }
                    },
                  }
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disableElevation
                disabled={submitting}
                sx={{ 
                  mt: 2, 
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 6px 20px rgba(33, 203, 243, .25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 10px 20px rgba(33, 203, 243, .3)',
                  }
                }}
                startIcon={submitting ? 
                  <CircularProgress size={20} color="inherit" /> : 
                  <LightbulbIcon />
                }
              >
                {submitting ? 'Submitting...' : 'Submit Idea'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Ideas list section */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                Community Ideas 
                <Box component="span" sx={{ 
                  ml: 1, 
                  color: theme.palette.primary.main, 
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10
                }}>
                  {filteredIdeas.length}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filter ? `Showing ${filter} ideas` : 'Browse all community ideas'}
              </Typography>
            </Box>
            
            <TextField
              select
              size="small"
              value={filter}
              onChange={handleFilterChange}
              label="Filter by category"
              variant="outlined"
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category} sx={{
                  borderLeft: category === filter ? `3px solid ${theme.palette.primary.main}` : 'none',
                  backgroundColor: category === filter ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                }}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          {loading ? (
            // Loading skeleton
            Array.from(new Array(3)).map((_, index) => (
              <Card key={index} sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ height: 6, background: getRandomGradient(index) }} />
                <CardHeader
                  avatar={<Skeleton variant="circular" width={40} height={40} />}
                  title={<Skeleton variant="text" width="70%" height={30} />}
                  subheader={<Skeleton variant="text" width="40%" />}
                />
                <CardContent>
                  <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 10 }} />
                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 10 }} />
                    </Box>
                    <Skeleton variant="rectangular" width={120} height={30} />
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : filteredIdeas.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                px: 3,
                borderRadius: 4,
                border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <LightbulbIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No ideas found in this category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to share an idea in the {filter} category
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => setFilter('')}
              >
                View all ideas
              </Button>
            </Box>
          ) : (
            filteredIdeas.map((idea, index) => (
              <Grow in={true} key={idea.id} timeout={(index + 1) * 200}>
                <Card 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 6,
                      background: getRandomGradient(idea.id),
                    }}
                  />
                  <CardHeader
                    avatar={
                      <Avatar 
                        aria-label="author"
                        sx={{ 
                          background: getRandomGradient(idea.id + 1),
                          fontWeight: 'bold',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        {idea.avatar}
                      </Avatar>
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {idea.title}
                        </Typography>
                        <Chip 
                          label={idea.category} 
                          size="small" 
                          color="primary" 
                          sx={{ 
                            borderRadius: 1,
                            fontWeight: 500,
                            background: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.dark
                          }}
                        />
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Posted by {idea.author} on {idea.date}
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3, 
                        color: alpha(theme.palette.text.primary, 0.8),
                        lineHeight: 1.6,
                        fontSize: '0.95rem'
                      }}
                    >
                      {idea.description}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button 
                          size="small"
                          variant={voted.includes(idea.id) ? "contained" : "outlined"}
                          color={voted.includes(idea.id) ? "primary" : "inherit"}
                          startIcon={voted.includes(idea.id) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                          onClick={() => handleUpvote(idea.id)}
                          sx={{ 
                            borderRadius: 6,
                            px: 2,
                            transition: 'all 0.2s ease',
                            ...(voted.includes(idea.id) && {
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                            })
                          }}
                        >
                          {idea.upvotes}
                        </Button>
                        
                        <Button 
                          size="small"
                          variant="outlined"
                          color="inherit"
                          startIcon={<CommentIcon />}
                          sx={{ 
                            borderRadius: 6,
                            px: 2
                          }}
                        >
                          {idea.comments}
                        </Button>
                        
                        <IconButton 
                          size="small"
                          sx={{ 
                            ml: 1,
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              color: theme.palette.primary.main,
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Rating 
                        name={`rating-${idea.id}`} 
                        defaultValue={0} 
                        precision={0.5} 
                        size="medium"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            ))
          )}
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: 2
          }
        }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
          elevation={6}
          iconMapping={{
            success: <ThumbUpIcon fontSize="inherit" />,
            error: <React.Fragment />
          }}
          sx={{ 
            width: '100%', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            borderRadius: 2,
            py: 1,
            ...(snackbar.severity === 'success' && {
              background: 'linear-gradient(90deg, #4caf50, #2e7d32)'
            })
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontWeight="500">
              {snackbar.message}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IdeasPage; 