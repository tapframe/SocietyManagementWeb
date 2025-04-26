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
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          color: 'text.primary',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: 8 },
          mb: 8,
          boxShadow: (theme) => 
            `0 15px 50px ${alpha(theme.palette.primary.main, 0.15)}`,
          mx: { xs: 0, md: 3 },
          minHeight: { xs: 'auto', md: '65vh' },
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
            top: '-150px',
            left: '-150px',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.06)}, ${alpha(theme.palette.primary.main, 0.06)})`,
            bottom: '-80px',
            right: '25%',
            zIndex: 0,
            filter: 'blur(8px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.info.main, 0.07)}, ${alpha(theme.palette.success.main, 0.07)})`,
            top: '15%',
            right: '10%',
            zIndex: 0,
            filter: 'blur(5px)',
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
              <Fade in={true} timeout={800}>
                <Box>
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
              </Fade>
              
              <Fade in={true} timeout={1200}>
                <Box>
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
              </Fade>
              
              <Fade in={true} timeout={1600}>
                <Box>
                  <Box sx={{ display: 'flex', mb: 4, gap: 2, alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: '50px',
                        height: '5px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 5 }}>
                    {[
                      { icon: <CommunityIcon sx={{ fontSize: '1.4rem' }} />, text: "Engage Citizens" },
                      { icon: <SecurityIcon sx={{ fontSize: '1.4rem' }} />, text: "Solve Issues" },
                      { icon: <IdeaIcon sx={{ fontSize: '1.4rem' }} />, text: "Share Ideas" }
                    ].map((item, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.07),
                        borderRadius: '12px',
                        padding: '10px 16px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.12),
                          transform: 'translateY(-3px)'
                        }
                      }}>
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
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
              </Fade>
            </Box>
            
            <Fade in={true} timeout={2000}>
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: '20px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': {
                      transform: 'translateY(0) translateX(-50%)'
                    },
                    '40%': {
                      transform: 'translateY(-20px) translateX(-50%)'
                    },
                    '60%': {
                      transform: 'translateY(-10px) translateX(-50%)'
                    }
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
            </Fade>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 }, position: 'relative' }}>
            <Zoom in={true} timeout={1000}>
              <Box sx={{ position: 'relative', height: { xs: '350px', md: '600px' } }}>
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
                    <Zoom in={true} timeout={1500}>
                      <Paper
                        elevation={8}
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
                          animation: 'float 4s ease-in-out infinite',
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          '@keyframes float': {
                            '0%': {
                              transform: 'translateY(0px)'
                            },
                            '50%': {
                              transform: 'translateY(-15px)'
                            },
                            '100%': {
                              transform: 'translateY(0px)'
                            }
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
                    </Zoom>
                    
                    <Zoom in={true} timeout={2000}>
                      <Paper
                        elevation={8}
                        sx={{
                          position: 'absolute',
                          bottom: '25%',
                          left: '10%',
                          p: 2.5,
                          borderRadius: '16px',
                          width: '200px',
                          backgroundColor: 'white',
                          zIndex: 3,
                          animation: 'float 5s ease-in-out infinite 1s',
                          backdropFilter: 'blur(8px)',
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          '@keyframes float': {
                            '0%': {
                              transform: 'translateY(0px)'
                            },
                            '50%': {
                              transform: 'translateY(-15px)'
                            },
                            '100%': {
                              transform: 'translateY(0px)'
                            }
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
                    </Zoom>
                  </>
                )}
              </Box>
            </Zoom>
          </Grid>
        </Grid>

        {/* Add a subtle background pattern overlay to the hero section */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      </Box>

      {/* Stats Section */}
      <Container id="stats-section" maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Grow in={true} timeout={(index + 1) * 500}>
                <Box 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${alpha(theme.palette.primary.main, 0.1)}`
                    }
                  }}
                >
                  <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2 
            }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto',
              mb: 2
            }}
          >
            The Society Management System empowers citizens and authorities to work together for a better community
          </Typography>
          <Divider sx={{ width: '80px', mx: 'auto', borderWidth: '4px', borderColor: theme.palette.primary.main, borderRadius: '2px' }} />
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
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[10]
                    },
                    position: 'relative'
                  }}
                  elevation={2}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      height: '8px', 
                      backgroundColor: feature.color 
                    }} 
                  />
                  <CardContent sx={{ flexGrow: 1, pt: 5 }}>
                    <Box 
                      sx={{ 
                        display: 'inline-flex', 
                        p: 1.5, 
                        borderRadius: '12px', 
                        mb: 2,
                        backgroundColor: alpha(feature.color, 0.1)
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link} 
                      to={feature.link}
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 'medium' }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    boxShadow: theme.shadows[10]
                  }}
                >
                  <img 
                    src="https://source.unsplash.com/random?society" 
                    alt="About the Society Management System"
                    style={{ 
                      width: '100%', 
                      height: isMedium ? '300px' : '400px',
                      objectFit: 'cover' 
                    }}
                  />
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
                      mb: 3
                    }}
                  >
                    About the Platform
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                    The Society Management System (SMS) is a comprehensive web-based platform designed to promote social order, 
                    awareness, and active community participation in India. The system is structured around two primary user roles: 
                    normal citizens and admins, with admins consisting of police officers and advocates who are responsible for 
                    enforcing laws and regulations.
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                    The platform allows citizens to upload videos or report situations that involve violations of social rules or laws, 
                    which are then reviewed by admins for appropriate action. Admins have the authority to accept or reject the proposals 
                    submitted by citizens, taking necessary actions such as issuing fines or legal notices, and updating the system to 
                    reflect these decisions.
                  </Typography>
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
                      fontWeight: 'bold'
                    }}
                  >
                    Join the Movement
                  </Button>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 3,
            }}
          >
            Ready to make a difference?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
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
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 