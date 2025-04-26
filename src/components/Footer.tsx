import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  useTheme,
  alpha,
  Link as MuiLink,
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import RuleIcon from '@mui/icons-material/Gavel';
import ReportIcon from '@mui/icons-material/Report';
import IdeaIcon from '@mui/icons-material/Lightbulb';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    { title: 'Report Issues', path: '/report', icon: <ReportIcon fontSize="small" /> },
    { title: 'Know Your Rules', path: '/rules', icon: <RuleIcon fontSize="small" /> },
    { title: 'Share Ideas', path: '/ideas', icon: <IdeaIcon fontSize="small" /> },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#', name: 'Facebook' },
    { icon: <TwitterIcon />, url: '#', name: 'Twitter' },
    { icon: <InstagramIcon />, url: '#', name: 'Instagram' },
    { icon: <LinkedInIcon />, url: '#', name: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        width: '100%',
        backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              Society Management System
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              A digital platform connecting citizens and authorities for better social governance and community development.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {socialLinks.map((social) => (
                <MuiLink
                  key={social.name}
                  href={social.url}
                  color="inherit"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    },
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </MuiLink>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.map((link) => (
                <Box key={link.path} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ mr: 1, color: 'primary.main' }}>
                    {link.icon}
                  </Box>
                  <MuiLink
                    component={Link}
                    to={link.path}
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {link.title}
                  </MuiLink>
                </Box>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <MuiLink href="mailto:contact@society-ms.com" color="inherit" sx={{ textDecoration: 'none' }}>
                contact@society-ms.com
              </MuiLink>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Have questions or suggestions? Feel free to reach out to us!
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Society Management System. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
            <MuiLink component={Link} to="/privacy" color="inherit" sx={{ textDecoration: 'none' }}>
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} to="/terms" color="inherit" sx={{ textDecoration: 'none' }}>
              Terms of Service
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 