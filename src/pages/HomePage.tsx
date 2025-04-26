import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardActions, 
  CardContent, 
  Container, 
  Paper, 
  Typography, 
  useTheme,
  alpha,
  Fade,
  Grow,
  Zoom,
  Divider,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import RuleIcon from '@mui/icons-material/Gavel';
import IdeaIcon from '@mui/icons-material/Lightbulb';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import CommunityIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Add beautiful background theme variables
  const bgGradient = `linear-gradient(to bottom right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.8)})`;
  const bgPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  const features = [
    {
      title: 'Report Issues',
      description: 'Report violations of social rules or laws by uploading videos or descriptions. Help maintain order in your community.',
      icon: <ReportIcon fontSize="large" sx={{ color: theme.palette.primary.main }} />,
      link: '/report',
      color: theme.palette.primary.light
    },
    {
      title: 'Know Your Rules',
      description: 'Learn about important laws and regulations to become a more informed citizen and understand your rights and responsibilities.',
      icon: <RuleIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />,
      link: '/rules',
      color: theme.palette.secondary.light
    },
    {
      title: 'Share Ideas',
      description: 'Contribute your thoughts and suggestions for improving the community and fostering positive social change.',
      icon: <IdeaIcon fontSize="large" sx={{ color: theme.palette.success.main }} />,
      link: '/ideas',
      color: theme.palette.success.light
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Citizens', icon: <CommunityIcon fontSize="large" /> },
    { value: '500+', label: 'Issues Resolved', icon: <SecurityIcon fontSize="large" /> },
    { value: '50+', label: 'Authorities', icon: <GroupsIcon fontSize="large" /> }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{
      backgroundImage: bgGradient,
      backgroundAttachment: 'fixed',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: bgPattern,
        opacity: 0.3,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'opacity'
      }
    }}>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          background: 'transparent',
          color: 'text.primary',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: 8 },
          mb: 8,
          boxShadow: (theme) => 
            `0 15px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
          mx: { xs: 0, md: 3 },
          minHeight: { xs: 'auto', md: '65vh' },
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
        }}
      >
        {/* Enhanced decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            top: '-150px',
            left: '-150px',
            zIndex: 0,
            filter: 'blur(10px)',
            animation: 'pulse-slow 20s ease-in-out infinite alternate',
            '@keyframes pulse-slow': {
              '0%': { opacity: 0.5 },
              '100%': { opacity: 0.8 }
            }
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
            bottom: '-80px',
            right: '25%',
            zIndex: 0,
            filter: 'blur(8px)',
            animation: 'pulse-slow 18s ease-in-out infinite alternate-reverse',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.15)}, ${alpha(theme.palette.info.main, 0.05)})`,
            top: '15%',
            right: '10%',
            zIndex: 0,
            filter: 'blur(5px)',
            animation: 'pulse-slow 15s ease-in-out infinite alternate',
          }}
        />

        <Grid container spacing={0}>
          <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 }, position: 'relative', zIndex: 1 }}>
            <Box 
              sx={{ 
                p: { xs: 4, sm: 6, md: 8 }, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center'
              }}
            >
              <Box sx={{ 
                opacity: 0, 
                animation: 'slideInFromLeft 0.8s ease-out forwards',
                '@keyframes slideInFromLeft': {
                  '0%': { transform: 'translateX(-50px)', opacity: 0 },
                  '100%': { transform: 'translateX(0)', opacity: 1 }
                }
              }}>
                <Chip 
                  icon={<CheckCircleIcon fontSize="small" />}
                  label="Modern Society Management" 
                  color="primary" 
                  variant="filled"
                  sx={{ 
                    mb: 3, 
                    fontWeight: 'bold',
                    px: 2.5,
                    py: 3,
                    fontSize: '1rem',
                    borderRadius: '50px',
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.35)}`,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.7)}`
                      },
                      '70%': {
                        boxShadow: `0 0 0 12px ${alpha(theme.palette.primary.main, 0)}`
                      },
                      '100%': {
                        boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`
                      }
                    }
                  }} 
                />
              </Box>
              
              <Box sx={{ 
                opacity: 0, 
                animation: 'slideInFromBottom 0.8s ease-out forwards 0.3s',
                animationFillMode: 'forwards',
                '@keyframes slideInFromBottom': {
                  '0%': { transform: 'translateY(30px)', opacity: 0 },
                  '100%': { transform: 'translateY(0)', opacity: 1 }
                }
              }}>
                <Typography 
                  component="h1" 
                  variant={isMobile ? "h3" : "h2"} 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 3,
                    mt: 2,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  <Box component="span" sx={{ color: '#e91e63' }}>Transform</Box>
                  {' '}
                  <Box component="span" sx={{ color: '#212121' }}>Your</Box>
                  {' '}
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    position: 'relative',
                    color: '#2196f3' 
                  }}>
                    Community
                    <Box 
                      component="span" 
                      sx={{ 
                        position: 'absolute', 
                        height: '10px', 
                        width: '100%', 
                        background: 'rgba(33, 150, 243, 0.3)', 
                        bottom: '10px', 
                        left: 0, 
                        zIndex: -1,
                        borderRadius: '6px'
                      }} 
                    />
                  </Box>
                  {' '}
                  <Box component="span" sx={{ color: '#06b6d4' }}>Together</Box>
                </Typography>
              </Box>
              
              <Box sx={{ 
                opacity: 0, 
                animation: 'fadeIn 1s ease-out forwards 0.6s',
                animationFillMode: 'forwards',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }}>
                <Box sx={{ display: 'flex', mb: 4, gap: 2, alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: '50px',
                      height: '5px',
                      background: theme.palette.primary.main,
                      borderRadius: '6px'
                    }} 
                  />
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    sx={{ 
                      fontWeight: 500, 
                      lineHeight: 1.6, 
                      fontSize: { xs: '1.1rem', md: '1.35rem' }
                    }}
                  >
                    A digital platform connecting citizens and authorities for better social governance and community development.
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3, 
                  mb: 5,
                }}>
                  {[
                    { icon: <CommunityIcon sx={{ fontSize: '1.4rem' }} />, text: "Engage Citizens" },
                    { icon: <SecurityIcon sx={{ fontSize: '1.4rem' }} />, text: "Solve Issues" },
                    { icon: <IdeaIcon sx={{ fontSize: '1.4rem' }} />, text: "Share Ideas" }
                  ].map((item, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.07),
                        borderRadius: '12px',
                        padding: '10px 16px',
                        transition: 'all 0.3s ease',
                        opacity: 0,
                        animation: `slideFeatureIn 0.5s ease-out forwards ${0.8 + index * 0.2}s`,
                        '@keyframes slideFeatureIn': {
                          '0%': { transform: 'translateX(20px)', opacity: 0 },
                          '100%': { transform: 'translateX(0)', opacity: 1 }
                        },
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          transform: 'translateY(-3px)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        borderRadius: '8px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>{item.icon}</Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.text}</Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  flexWrap: 'wrap',
                  opacity: 0,
                  animation: 'slideUpFade 0.8s ease-out forwards 1.2s',
                  '@keyframes slideUpFade': {
                    '0%': { transform: 'translateY(20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                  }
                }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to="/register"
                    size="large"
                    sx={{ 
                      borderRadius: '50px', 
                      px: 4, 
                      py: 2,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      backgroundColor: theme.palette.primary.main,
                      backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.secondary.main, 0.9)})`,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 15px 35px ${alpha(theme.palette.primary.main, 0.5)}`
                      }
                    }}
                  >
                    Join Now
                  </Button>
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/report"
                    size="large"
                    sx={{ 
                      borderRadius: '50px', 
                      px: 4, 
                      py: 2,
                      borderWidth: '2px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderWidth: '2px',
                        borderColor: theme.palette.primary.main,
                        background: alpha(theme.palette.primary.main, 0.08),
                        transform: 'translateY(-5px)'
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Report Issue
                  </Button>
                  
                  <Tooltip title="Watch Demo">
                    <IconButton 
                      color="primary" 
                      sx={{ 
                        width: '60px', 
                        height: '60px', 
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <PlayArrowIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                opacity: 0,
                animation: 'fadeInBounce 2s ease-out forwards 1.6s',
                '@keyframes fadeInBounce': {
                  '0%': { transform: 'translateY(20px) translateX(-50%)', opacity: 0 },
                  '60%': { transform: 'translateY(-10px) translateX(-50%)', opacity: 1 },
                  '80%': { transform: 'translateY(5px) translateX(-50%)', opacity: 1 },
                  '100%': { transform: 'translateY(0) translateX(-50%)', opacity: 1 }
                },
                display: { xs: 'none', md: 'block' },
                zIndex: 10
              }}
            >
              <IconButton 
                color="primary"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  animation: 'pulse-button 2s infinite',
                  '@keyframes pulse-button': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' }
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    transform: 'scale(1.1)'
                  }
                }}
                onClick={() => {
                  document.getElementById('stats-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                <KeyboardArrowDownIcon fontSize="large" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 }, position: 'relative' }}>
            <Box sx={{ 
              position: 'relative', 
              height: { xs: '350px', md: '600px' },
              opacity: 0,
              animation: 'fadeInScale 1s ease-out forwards 0.4s',
              '@keyframes fadeInScale': {
                '0%': { transform: 'scale(0.92)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 }
              }
            }}>
              {/* Main Image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: '20px', md: '50px' },
                  right: { xs: '0', md: '20px' },
                  width: { xs: '100%', md: '95%' },
                  height: { xs: '300px', md: '480px' },
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: `0 30px 70px ${alpha('#000', 0.25)}`,
                  zIndex: 2,
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0))',
                    zIndex: 3
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://media.istockphoto.com/id/1444399074/photo/basketball-winner-and-hands-team-high-five-for-outdoor-game-success-diversity-and-victory.jpg?s=612x612&w=0&k=20&c=67vmcxGQPTXYBWINquxXgQv-amjYZQX8zcgYaG-Xd0Q="
                  alt="Community teamwork"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 8s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}
                />
              </Box>
              
              {/* Decorative Dot Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: '0', md: '120px' },
                  right: { xs: '5%', md: '85%' },
                  width: { xs: '50px', md: '200px' },
                  height: { xs: '100px', md: '350px' },
                  backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.4)} 2px, transparent 2px)`,
                  backgroundSize: '18px 18px',
                  zIndex: 1,
                  opacity: 0.7
                }}
              />
              
              {/* Featured Cards */}
              {!isMobile && (
                <>
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      left: '0',
                      p: 2.5,
                      borderRadius: '16px',
                      width: '200px',
                      backgroundColor: 'white',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transform: 'translateX(-50px)',
                      opacity: 0,
                      animation: 'slideInCard 0.6s ease-out forwards 0.8s',
                      '@keyframes slideInCard': {
                        '0%': { transform: 'translateX(-50px)', opacity: 0 },
                        '100%': { transform: 'translateX(0)', opacity: 1 }
                      },
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.success.main, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: theme.palette.success.main
                      }}
                    >
                      <CheckCircleIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">Issue Resolved</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.9 }}>2 minutes ago</Typography>
                    </Box>
                  </Paper>
                  
                  <Paper
                    elevation={4}
                    sx={{
                      position: 'absolute',
                      bottom: '25%',
                      left: '10%',
                      p: 2.5,
                      borderRadius: '16px',
                      width: '200px',
                      backgroundColor: 'white',
                      zIndex: 3,
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      transform: 'translateY(50px)',
                      opacity: 0,
                      animation: 'slideUpCard 0.6s ease-out forwards 1.2s',
                      '@keyframes slideUpCard': {
                        '0%': { transform: 'translateY(50px)', opacity: 0 },
                        '100%': { transform: 'translateY(0)', opacity: 1 }
                      },
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Community Engagement</Typography>
                    <Box sx={{ display: 'flex', gap: 0.8, mt: 1 }}>
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: '10px',
                            height: '25px',
                            backgroundColor: i < 4 ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.3),
                            borderRadius: '6px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scaleY(1.2)',
                              backgroundColor: theme.palette.primary.main
                            }
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block', fontWeight: 500 }}>85% Participation</Typography>
                  </Paper>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Section */}
      <Container id="stats-section" maxWidth="lg" sx={{ 
        mb: 10,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Decorative floating elements */}
        <Box sx={{
          position: 'absolute',
          top: '-50px',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.4)}, ${alpha(theme.palette.primary.main, 0.1)})`,
          transform: 'rotate(15deg)',
          filter: 'blur(2px)',
          zIndex: -1,
          opacity: 0.6,
          willChange: 'opacity',
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.3)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          filter: 'blur(2px)',
          zIndex: -1,
          opacity: 0.6,
          willChange: 'opacity',
        }} />
        
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: '2px'
              }
            }}
          >
            Our Impact
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '650px', 
              mx: 'auto',
              mt: 3
            }}
          >
            Together we're building a stronger, more engaged community through active participation and collaboration
          </Typography>
        </Box>
        
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Grow in={true} timeout={(index + 1) * 500}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '24px',
                    transition: 'all 0.5s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.7)})`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: index === 0 
                        ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})` 
                        : index === 1 
                          ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})` 
                          : `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.warning.main})`,
                      opacity: 0.8,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '6px',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: index === 0 
                        ? `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)` 
                        : index === 1 
                          ? `radial-gradient(circle at top left, ${alpha(theme.palette.success.main, 0.1)}, transparent 70%)` 
                          : `radial-gradient(circle at bottom right, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 70%)`,
                      zIndex: 0,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: index === 0 
                        ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.25)}` 
                        : index === 1 
                          ? `0 20px 40px ${alpha(theme.palette.success.main, 0.25)}` 
                          : `0 20px 40px ${alpha(theme.palette.secondary.main, 0.25)}`,
                      '& .stat-icon': {
                        transform: 'scale(1.15) rotate(10deg)',
                        boxShadow: index === 0 
                          ? `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}` 
                          : index === 1 
                            ? `0 10px 25px ${alpha(theme.palette.success.main, 0.4)}` 
                            : `0 10px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      },
                      '& .stat-value': {
                        transform: 'scale(1.05)',
                      }
                    }
                  }}
                >
                  <Box 
                    className="stat-icon"
                    sx={{ 
                      color: index === 0 
                        ? theme.palette.primary.main 
                        : index === 1 
                          ? theme.palette.success.main 
                          : theme.palette.secondary.main, 
                      mb: 3,
                      p: 2.5,
                      borderRadius: '50%',
                      backgroundColor: index === 0 
                        ? alpha(theme.palette.primary.main, 0.12)
                        : index === 1 
                          ? alpha(theme.palette.success.main, 0.12)
                          : alpha(theme.palette.secondary.main, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '90px',
                      height: '90px',
                      marginBottom: 4,
                      position: 'relative',
                      zIndex: 2,
                      transition: 'all 0.5s ease',
                      boxShadow: index === 0 
                        ? `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}` 
                        : index === 1 
                          ? `0 8px 20px ${alpha(theme.palette.success.main, 0.25)}` 
                          : `0 8px 20px ${alpha(theme.palette.secondary.main, 0.25)}`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-15%',
                        left: '-15%',
                        width: '130%',
                        height: '130%',
                        borderRadius: '50%',
                        border: `2px dashed ${
                          index === 0 
                            ? alpha(theme.palette.primary.main, 0.3) 
                            : index === 1 
                              ? alpha(theme.palette.success.main, 0.3) 
                              : alpha(theme.palette.secondary.main, 0.3)
                        }`,
                        animation: 'spin 20s linear infinite',
                        '@keyframes spin': {
                          '0%': {
                            transform: 'rotate(0deg)',
                          },
                          '100%': {
                            transform: 'rotate(360deg)',
                          }
                        }
                      }
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography 
                    className="stat-value"
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      position: 'relative',
                      zIndex: 2,
                      color: index === 0 
                        ? theme.palette.primary.main 
                        : index === 1 
                          ? theme.palette.success.main 
                          : theme.palette.secondary.main,
                      transition: 'all 0.5s ease',
                      textShadow: index === 0 
                        ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` 
                        : index === 1 
                          ? `0 4px 12px ${alpha(theme.palette.success.main, 0.4)}` 
                          : `0 4px 12px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{ 
                      position: 'relative',
                      zIndex: 2,
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        height: '2px',
                        width: '40px',
                        background: index === 0 
                          ? theme.palette.primary.main 
                          : index === 1 
                            ? theme.palette.success.main 
                            : theme.palette.secondary.main,
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderRadius: '2px',
                        opacity: 0.7,
                      }
                    }}
                  >
                    {stat.label}
                  </Typography>
                  
                  {/* Decorative elements */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '18px', 
                      right: '20px',
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      background: index === 0 
                        ? alpha(theme.palette.primary.main, 0.3) 
                        : index === 1 
                          ? alpha(theme.palette.success.main, 0.3) 
                          : alpha(theme.palette.secondary.main, 0.3),
                      zIndex: 1,
                    }} 
                  />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: '25px', 
                      left: '20px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === 0 
                        ? alpha(theme.palette.primary.main, 0.3) 
                        : index === 1 
                          ? alpha(theme.palette.success.main, 0.3) 
                          : alpha(theme.palette.secondary.main, 0.3),
                      zIndex: 1,
                    }} 
                  />
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        py: 10, 
        background: 'transparent',
        position: 'relative',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(circle at 20% 30%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 25%), 
                           radial-gradient(circle at 80% 60%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 25%)`,
          zIndex: -1
        }
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '8%',
          width: '180px',
          height: '180px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.97 50c0-9.04-7.28-16.36-16.28-16.47C13.68 33.42 21 26.14 21 17.1c0 9.05 7.32 16.37 16.31 16.47-8.99.11-16.31 7.42-16.31 16.47 0-9.05-7.28-16.33-16.28-16.47 8.99-.1 16.28-7.37 16.28-16.42 0 9.05 7.28 16.32 16.31 16.47-9.03-.15-16.31-7.42-16.31-16.47zm62.5 0c0-4.52-3.64-8.18-8.14-8.23 4.5-.06 8.14-3.72 8.14-8.24 0 4.52 3.64 8.18 8.16 8.24-4.52.05-8.16 3.71-8.16 8.23 0-4.52-3.64-8.18-8.14-8.23 4.5-.05 8.14-3.72 8.14-8.24 0 4.52 3.64 8.19 8.16 8.24-4.52.05-8.16 3.71-8.16 8.23zm-45.56 0c0-3.01-2.43-5.45-5.42-5.49 3-.04 5.42-2.48 5.42-5.5 0 3.01 2.43 5.45 5.44 5.5-3.01.03-5.44 2.48-5.44 5.5 0-3.01-2.43-5.45-5.42-5.5 3-.04 5.42-2.48 5.42-5.5 0 3.01 2.43 5.46 5.44 5.5-3.01.04-5.44 2.48-5.44 5.5z' fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.7,
          transform: 'rotate(10deg)',
          zIndex: -1
        }} />
        
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '220px',
          height: '220px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${theme.palette.secondary.main.replace('#', '')}' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.7,
          zIndex: -1
        }} />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="POWERFUL FEATURES" 
              size="small" 
              color="secondary" 
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                px: 1.5,
                background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.9)}, ${alpha(theme.palette.secondary.light, 0.9)})`,
                backdropFilter: 'blur(8px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`
              }} 
            />
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              How It Works
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                mb: 3,
                fontWeight: 400
              }}
            >
              The Society Management System empowers citizens and authorities to work together for a better community
            </Typography>
            <Box 
              sx={{ 
                width: '80px', 
                height: '4px', 
                background: theme.palette.primary.main,
                mx: 'auto',
                borderRadius: '2px'
              }} 
            />
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Grow in={true} timeout={(index + 1) * 500}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      boxShadow: 'none',
                      backdropFilter: 'blur(8px)',
                      backgroundColor: alpha(theme.palette.background.paper, 0.7),
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '100%',
                        background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)}, transparent 80%)`,
                        zIndex: 0
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                        borderColor: alpha(feature.color, 0.2),
                        '& .feature-icon-wrapper': {
                          transform: 'scale(1.1)',
                        }
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4, pt: 3 }}>
                      <Box 
                        className="feature-icon-wrapper"
                        sx={{ 
                          display: 'inline-flex', 
                          p: 2, 
                          borderRadius: '16px', 
                          mb: 3,
                          backgroundColor: alpha(feature.color, 0.12),
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        gutterBottom 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 1.5 
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ 
                      borderTop: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                      p: 0
                    }}>
                      <CardActions sx={{ p: 0 }}>
                        <Button 
                          component={Link} 
                          to={feature.link}
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            fontWeight: 'medium',
                            p: 2,
                            width: '100%',
                            justifyContent: 'space-between',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05)
                            }
                          }}
                        >
                          Learn More
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box sx={{ 
        py: 12, 
        position: 'relative',
        background: 'transparent',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(circle at 80% 20%, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 25%), 
                           radial-gradient(circle at 20% 70%, ${alpha(theme.palette.secondary.light, 0.08)} 0%, transparent 25%)`,
          zIndex: -1
        }
      }}>
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          filter: 'blur(2px)',
          zIndex: -1,
          animation: 'morph 15s linear infinite alternate',
          '@keyframes morph': {
            '0%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
            '25%': { borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' },
            '50%': { borderRadius: '30% 30% 70% 70% / 60% 40% 60% 40%' },
            '75%': { borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%' },
            '100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }
          }
        }} />
        
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          width: '150px',
          height: '150px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.15)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(2px)',
          zIndex: -1,
          animation: 'morph 12s linear infinite alternate-reverse'
        }} />

        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box 
                  sx={{ 
                    borderRadius: 5, 
                    overflow: 'hidden',
                    boxShadow: theme.shadows[8],
                    position: 'relative',
                    background: alpha(theme.palette.primary.main, 0.05),
                    padding: '10px',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.2)',
                      zIndex: 1
                    }
                  }}
                >
                  <Box sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Box
                      component="img"
                      src="https://source.unsplash.com/random?society" 
                      alt="About the Society Management System"
                      sx={{ 
                        width: '100%', 
                        height: isMedium ? '360px' : '460px',
                        objectFit: 'cover',
                        transition: 'transform 10s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </Box>
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      p: 4,
                      zIndex: 2
                    }}
                  >
                    <Chip 
                      label="About Our Vision" 
                      color="secondary"
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 2,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.9)
                      }}
                    />
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1500}>
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 3,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -10,
                        left: 0,
                        width: '60px',
                        height: '4px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '4px'
                      }
                    }}
                  >
                    About the Platform
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: alpha(theme.palette.text.primary, 0.8) }}>
                    The Society Management System (SMS) is a comprehensive web-based platform designed to promote social order, 
                    awareness, and active community participation in India. The system is structured around two primary user roles: 
                    normal citizens and admins, with admins consisting of police officers and advocates who are responsible for 
                    enforcing laws and regulations.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: alpha(theme.palette.text.primary, 0.8) }}>
                    The platform allows citizens to upload videos or report situations that involve violations of social rules or laws, 
                    which are then reviewed by admins for appropriate action. Admins have the authority to accept or reject the proposals 
                    submitted by citizens, taking necessary actions such as issuing fines or legal notices, and updating the system to 
                    reflect these decisions.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, mt: 5 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="large"
                      component={Link}
                      to="/register"
                      sx={{ 
                        borderRadius: '50px', 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 'bold',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                          boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                          transform: 'translateY(-3px)'
                        }
                      }}
                    >
                      Join the Movement
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      component={Link}
                      to="/about"
                      sx={{ 
                        borderRadius: '50px', 
                        px: 4, 
                        py: 1.5,
                        fontWeight: 'bold',
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          transform: 'translateY(-3px)'
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        py: 12, 
        textAlign: 'center',
        background: 'transparent',
        color: theme.palette.text.primary,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          zIndex: -1
        }
      }}>
        {/* Animated decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: -1,
          opacity: 0.4
        }}>
          {/* Animated particles */}
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: ['20px', '30px', '40px', '25px', '35px', '45px', '50px', '25px'][i],
                height: ['20px', '30px', '40px', '25px', '35px', '45px', '50px', '25px'][i],
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(
                  [theme.palette.primary.light, theme.palette.secondary.light, theme.palette.primary.main, 
                   theme.palette.secondary.main, theme.palette.primary.light, theme.palette.secondary.light,
                   theme.palette.primary.main, theme.palette.secondary.main][i],
                  0.6
                )}, ${alpha(
                  [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.primary.light, 
                   theme.palette.secondary.light, theme.palette.primary.main, theme.palette.secondary.main,
                   theme.palette.primary.light, theme.palette.secondary.light][i],
                  0.2
                )})`,
                top: [`${10 + i * 10}%`, `${80 - i * 9}%`, `${30 + i * 7}%`, `${60 - i * 8}%`, 
                      `${50 + i * 6}%`, `${20 - i * 5}%`, `${70 + i * 3}%`, `${40 - i * 4}%`][i],
                left: [`${20 + i * 8}%`, `${75 - i * 7}%`, `${40 + i * 6}%`, `${60 - i * 5}%`, 
                       `${10 + i * 9}%`, `${90 - i * 4}%`, `${30 + i * 5}%`, `${80 - i * 6}%`][i],
                filter: 'blur(3px)',
                animation: `float-particle ${5 + i * 3}s ease-in-out infinite alternate-reverse`,
                '@keyframes float-particle': {
                  '0%': { 
                    transform: 'translateY(0) translateX(0) scale(1)',
                    opacity: 0.7
                  },
                  '50%': { 
                    transform: `translateY(${10 + i * 5}px) translateX(${5 + i * 3}px) scale(${0.8 + i * 0.05})`,
                    opacity: 0.9
                  },
                  '100%': { 
                    transform: `translateY(${-10 - i * 5}px) translateX(${-5 - i * 3}px) scale(1)`,
                    opacity: 0.7
                  }
                }
              }}
            />
          ))}
        </Box>

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: theme.palette.text.primary,
                  textShadow: 'none'
                }}
              >
                Ready to make a difference?
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, color: theme.palette.text.secondary, maxWidth: '800px', mx: 'auto' }}>
                Join thousands of citizens committed to building a better society through active participation and collaboration.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={Link} 
                to="/register"
                sx={{ 
                  borderRadius: '50px', 
                  px: 6, 
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`
                  }
                }}
              >
                Get Started Today
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 