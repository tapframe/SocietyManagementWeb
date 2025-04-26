import React, { useState } from 'react';
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
  Alert
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';

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

const IdeasPage: React.FC = () => {
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
    }
  };

  const handleUpvote = (id: number) => {
    setIdeas(prev => 
      prev.map(idea => 
        idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea
      )
    );
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} sx={{ my: 4 }}>
        <Grid item xs={12}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Share Your Ideas for a Better Society
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Contribute your thoughts and suggestions for improving the community
          </Typography>
        </Grid>

        {/* Submit new idea section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Submit New Idea</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Idea Title"
                name="title"
                autoFocus
                value={newIdea.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                select
                id="category"
                label="Category"
                name="category"
                value={newIdea.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category || "Select the most relevant category for your idea"}
                SelectProps={{
                  native: true,
                }}
              >
                <option value=""></option>
                {categories.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </TextField>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                name="description"
                label="Idea Description"
                multiline
                rows={5}
                value={newIdea.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description || "Provide details of your idea and how it can help the community"}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<LightbulbIcon />}
              >
                Submit Idea
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Ideas list section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Community Ideas
          </Typography>
          
          {ideas.map(idea => (
            <Card key={idea.id} sx={{ mb: 3 }}>
              <CardHeader
                avatar={
                  <Avatar aria-label="author">
                    {idea.avatar}
                  </Avatar>
                }
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {idea.title}
                    </Typography>
                    <Chip 
                      label={idea.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </Box>
                }
                subheader={`Posted by ${idea.author} on ${idea.date}`}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {idea.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                      size="small" 
                      startIcon={<ThumbUpOffAltIcon />}
                      onClick={() => handleUpvote(idea.id)}
                    >
                      Upvote ({idea.upvotes})
                    </Button>
                    <Button size="small" startIcon={<CommentIcon />}>
                      Comments ({idea.comments})
                    </Button>
                    <IconButton size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Rating 
                    name={`rating-${idea.id}`} 
                    defaultValue={0} 
                    precision={0.5} 
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IdeasPage; 