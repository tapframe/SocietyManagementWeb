import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  Container, 
  Paper, 
  Typography, 
  useTheme
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import RuleIcon from '@mui/icons-material/Gavel';
import IdeaIcon from '@mui/icons-material/Lightbulb';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Report Issues',
      description: 'Report violations of social rules or laws by uploading videos or descriptions. Help maintain order in your community.',
      icon: <ReportIcon fontSize="large" color="primary" />,
      link: '/report'
    },
    {
      title: 'Know Your Rules',
      description: 'Learn about important laws and regulations to become a more informed citizen and understand your rights and responsibilities.',
      icon: <RuleIcon fontSize="large" color="primary" />,
      link: '/rules'
    },
    {
      title: 'Share Ideas',
      description: 'Contribute your thoughts and suggestions for improving the community and fostering positive social change.',
      icon: <IdeaIcon fontSize="large" color="primary" />,
      link: '/ideas'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://source.unsplash.com/random?community)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Increase the priority of the hero background image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.6)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center' }}>
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            Society Management System
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Promoting social order, awareness, and community participation
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="primary" component={Link} to="/register">
              Join Now
            </Button>
            <Button variant="outlined" color="inherit" component={Link} to="/report">
              Report an Issue
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          The Society Management System empowers citizens and authorities to work together for a better community
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: theme.shadows[10],
                    transition: 'box-shadow 0.3s ease-in-out'
                  }
                }}
                elevation={3}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button size="small" color="primary" component={Link} to={feature.link}>
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            About the Platform
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            The Society Management System (SMS) is a comprehensive web-based platform designed to promote social order, 
            awareness, and active community participation in India. The system is structured around two primary user roles: 
            normal citizens and admins, with admins consisting of police officers and advocates who are responsible for 
            enforcing laws and regulations.
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            The platform allows citizens to upload videos or report situations that involve violations of social rules or laws, 
            which are then reviewed by admins for appropriate action. Admins have the authority to accept or reject the proposals 
            submitted by citizens, taking necessary actions such as issuing fines or legal notices, and updating the system to 
            reflect these decisions.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 