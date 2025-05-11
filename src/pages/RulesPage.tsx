import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
  InputAdornment,
  TextField,
  Chip,
  Stack,
  alpha,
  Fade,
  useTheme,
  Grow,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// Sample rules data
const rulesData = [
  {
    id: 1,
    category: 'Traffic',
    title: 'Driving Under Influence',
    description: 'Driving under the influence of alcohol or drugs is illegal. Blood alcohol content (BAC) limit is 0.08% for general drivers and 0.04% for commercial drivers.',
    penalty: 'Imprisonment up to 6 months, fine up to ₹10,000, license suspension.',
    lawReference: 'Section 185, Motor Vehicles Act'
  },
  {
    id: 2,
    category: 'Traffic',
    title: 'Speeding',
    description: 'Exceeding the speed limit on any road is punishable. Speed limits vary by road type and vehicle type.',
    penalty: 'Fine from ₹1,000 to ₹2,000 depending on the offense.',
    lawReference: 'Section 183, Motor Vehicles Act'
  },
  {
    id: 3,
    category: 'Public Safety',
    title: 'Public Littering',
    description: 'Throwing or depositing litter in public places, streets, or open areas is prohibited.',
    penalty: 'Fine up to ₹500, community service, or both.',
    lawReference: 'Solid Waste Management Rules, 2016'
  },
  {
    id: 4,
    category: 'Public Safety',
    title: 'Noise Pollution',
    description: 'Creating excessive noise in residential areas or during night hours (10 PM to 6 AM) is prohibited.',
    penalty: 'Fine up to ₹1,000 and confiscation of noise-producing equipment.',
    lawReference: 'Noise Pollution (Regulation and Control) Rules, 2000'
  },
  {
    id: 5,
    category: 'Environmental',
    title: 'Burning Waste',
    description: 'Open burning of waste materials, including leaves, plastic, and garbage is prohibited in urban areas.',
    penalty: 'Fine up to ₹5,000 for first-time offenders.',
    lawReference: 'Environmental Protection Act, 1986'
  },
  {
    id: 6,
    category: 'Property',
    title: 'Illegal Construction',
    description: 'Construction without proper permits or in violation of zoning laws is prohibited.',
    penalty: 'Demolition of illegal construction, fine up to ₹50,000.',
    lawReference: 'Various Municipal Corporation Acts'
  },
  {
    id: 7,
    category: 'Civil Rights',
    title: 'Right to Information',
    description: 'Citizens have the right to request information from a public authority, which must be provided within 30 days.',
    penalty: 'Not applicable (enables citizen rights).',
    lawReference: 'Right to Information Act, 2005'
  },
  {
    id: 8,
    category: 'Civil Rights',
    title: 'Consumer Protection',
    description: 'Protects consumers from unfair trade practices, defective products, and poor services.',
    penalty: 'Compensation to consumers, fines for businesses.',
    lawReference: 'Consumer Protection Act, 2019'
  }
];

const RulesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | false>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
    
    // Automatically close accordions when scrolling down
    const handleScroll = () => {
      if (window.scrollY > 300 && expandedId !== false) {
        setExpandedId(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [expandedId]);

  // Background theme variables (matching HomePage)
  const bgGradient = theme.palette.mode === 'dark' 
    ? `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.default, 0.95)} 50%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`
    : `radial-gradient(circle at 30% 50%, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.background.default, 0.9)} 50%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`;
    
  // Different pattern - triangular grid
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='72' viewBox='0 0 36 72'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${theme.palette.primary.main.replace('#', '')}' fill-opacity='${theme.palette.mode === 'dark' ? '0.06' : '0.04'}'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  const categories = [...new Set(rulesData.map(rule => rule.category))];

  // Filter rules based on search term and selected category
  const filteredRules = rulesData.filter(rule => {
    const matchesSearch = 
      rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.lawReference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? rule.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedId(isExpanded ? panel : false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Traffic':
        return '#3f51b5';
      case 'Public Safety':
        return '#4caf50';
      case 'Environmental':
        return '#009688';
      case 'Property':
        return '#ff9800';
      case 'Civil Rights':
        return '#2196f3';
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: bgGradient,
        backgroundAttachment: 'fixed',
        pb: 8,
        animation: 'gradientShift 30s ease infinite alternate',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 100%' }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: bgPattern,
          backgroundSize: '72px 144px',
          opacity: theme.palette.mode === 'dark' ? 0.6 : 0.7,
          zIndex: 0,
          pointerEvents: 'none',
          willChange: 'transform',
          animation: 'patternMove 60s linear infinite',
          '@keyframes patternMove': {
            '0%': { transform: 'translateY(0) rotate(0deg)' },
            '100%': { transform: 'translateY(20px) rotate(1deg)' }
          }
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: theme.palette.mode === 'dark' 
            ? `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.main, 0.2)}, transparent 600px)`
            : `radial-gradient(circle at right bottom, ${alpha(theme.palette.primary.light, 0.15)}, transparent 600px)`,
          zIndex: 0,
          animation: 'pulseGradient 15s ease-in-out infinite alternate',
          '@keyframes pulseGradient': {
            '0%': { opacity: 0.7 },
            '50%': { opacity: 0.9 },
            '100%': { opacity: 0.7 }
          }
        }
      }}
    >
      {/* Floating bubbles/orbs as decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.01)} 70%, transparent)`,
        zIndex: 0,
        animation: 'floatBubble1 25s ease-in-out infinite',
        '@keyframes floatBubble1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -30px)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center, ${alpha(theme.palette.secondary.light, 0.05)}, ${alpha(theme.palette.secondary.main, 0.02)} 70%, transparent)`,
        zIndex: 0,
        animation: 'floatBubble2 30s ease-in-out infinite',
        '@keyframes floatBubble2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, 20px) scale(1.05)' },
          '66%': { transform: 'translate(20px, -10px) scale(0.95)' }
        }
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '40%',
        right: '15%',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.dark, 0.04)}, ${alpha(theme.palette.primary.main, 0.01)} 70%, transparent)`,
        zIndex: 0,
        animation: 'floatBubble3 20s ease-in-out infinite',
        '@keyframes floatBubble3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, 30px) scale(1.1)' }
        }
      }} />

      {/* Header with gradient background */}
      <Box 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 4, md: 8 },
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
          color: 'white',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          mb: 8,
          borderRadius: { xs: 0, md: '0 0 30px 30px' },
          clipPath: { xs: 'none', md: 'inset(0 0 -10% 0)' }, // Creates a slight overlap effect
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
        {/* Animated decorative elements with improved animations */}
        <Box sx={{ 
          position: 'absolute', 
          top: -100, 
          right: -100, 
          width: 300, 
          height: 300, 
          borderRadius: '50%', 
          bgcolor: 'white', 
          opacity: 0.05,
          animation: 'floatOrb1 25s ease-in-out infinite',
          '@keyframes floatOrb1': {
            '0%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
            '33%': { transform: 'translateY(15px) scale(1.03) rotate(3deg)' },
            '66%': { transform: 'translateY(-10px) scale(0.97) rotate(-1deg)' },
            '100%': { transform: 'translateY(0) scale(1) rotate(0deg)' }
          }
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: -50, 
          left: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          bgcolor: 'white', 
          opacity: 0.08,
          animation: 'floatOrb2 20s ease-in-out infinite',
          '@keyframes floatOrb2': {
            '0%': { transform: 'translateX(0) scale(1) rotate(0deg)' },
            '50%': { transform: 'translateX(20px) scale(1.05) rotate(5deg)' },
            '100%': { transform: 'translateX(0) scale(1) rotate(0deg)' }
          }
        }} />
        
        <Fade in={fadeIn} timeout={1000}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '14px', 
                  bgcolor: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  mr: 2,
                  transform: 'rotate(-5deg)'
                }}
              >
                <GavelIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              </Box>
              <Typography 
                component="h1" 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  letterSpacing: 1,
                  mb: 0,
                  fontSize: { xs: '2.2rem', md: '3.2rem' }
                }}
              >
                Know Your Rules & Rights
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto', 
                opacity: 0.9,
                mb: 1,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.2rem' },
                letterSpacing: 0.5
              }}
            >
              Learn about important laws and regulations to become a more informed citizen
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                maxWidth: '650px', 
                mx: 'auto', 
                opacity: 0.8,
                fontStyle: 'italic',
                mt: 1
              }}
            >
              "Knowledge of the law is the first step towards empowerment and justice."
            </Typography>
          </Box>
        </Fade>

        <Fade in={fadeIn} timeout={1500}>
          <Box sx={{ 
            maxWidth: '650px', 
            mx: 'auto', 
            position: 'relative',
            transform: 'translateY(50%)',
            zIndex: 2
          }}>
            <TextField
              fullWidth
              placeholder="Search for rules, laws, or regulations..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                  bgcolor: 'background.paper',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  '&:hover': {
                    boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
                  },
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                  transition: 'all 0.3s ease-in-out',
                  height: 60,
                  fontSize: '1.1rem'
                }
              }}
            />
          </Box>
        </Fade>
      </Box>

      <Box sx={{ 
        maxWidth: '1400px', 
        mx: 'auto', 
        width: '100%', 
        px: { xs: 2, sm: 4 },
        mt: { xs: 12, md: 10 },
        position: 'relative',
        zIndex: 1
      }}>
        {/* Decorative floating elements (matching HomePage) */}
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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Fade in={fadeIn} timeout={2000}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                mb: 6
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <FilterAltIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    Filter by Category
                  </Typography>
                </Box>

                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    flexWrap: 'wrap', 
                    gap: 1.5,
                    justifyContent: 'center',
                    '& > *': {
                      mb: 1
                    }
                  }}
                >
                  {categories.map((category, index) => (
                    <Grow 
                      in={fadeIn} 
                      timeout={(index + 1) * 200 + 1000}
                      key={category}
                    >
                      <Chip
                        avatar={
                          <Avatar 
                            sx={{ 
                              bgcolor: selectedCategory === category ? 'white' : alpha(getCategoryColor(category), 0.2),
                              color: selectedCategory === category ? getCategoryColor(category) : 'inherit'
                            }}
                          >
                            {category.charAt(0)}
                          </Avatar>
                        }
                        label={category}
                        color={selectedCategory === category ? "primary" : "default"}
                        onClick={() => handleCategorySelect(category)}
                        clickable
                        sx={{ 
                          borderRadius: 8,
                          px: 1,
                          height: 42,
                          fontWeight: selectedCategory === category ? 'bold' : 'normal',
                          fontSize: '0.95rem',
                          boxShadow: selectedCategory === category ? 3 : 1,
                          border: '1px solid',
                          borderColor: selectedCategory === category 
                            ? 'primary.main' 
                            : alpha(theme.palette.text.primary, 0.08),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: 5,
                            animation: 'none',
                            ...(selectedCategory !== category ? {
                              animation: 'shimmer 1.5s infinite'
                            } : {}),
                          },
                          '@keyframes shimmer': {
                            '0%': { boxShadow: `0 4px 10px ${alpha(getCategoryColor(category), 0.2)}` },
                            '50%': { boxShadow: `0 4px 20px ${alpha(getCategoryColor(category), 0.4)}` },
                            '100%': { boxShadow: `0 4px 10px ${alpha(getCategoryColor(category), 0.2)}` }
                          },
                          backdropFilter: 'blur(4px)',
                          backgroundColor: selectedCategory === category 
                            ? getCategoryColor(category)
                            : alpha(theme.palette.background.paper, 0.7),
                          color: selectedCategory === category ? 'white' : 'text.primary',
                          pl: 0.5
                        }}
                      />
                    </Grow>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              maxWidth: '950px', 
              mx: 'auto', 
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundImage: `linear-gradient(to bottom, transparent, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
                zIndex: -1,
                display: { xs: 'none', md: 'block' }
              }
            }}>
              {filteredRules.length > 0 ? (
                filteredRules.map((rule, index) => (
                  <Fade 
                    in={fadeIn} 
                    timeout={(index + 1) * 300 + 1000} 
                    key={rule.id}
                  >
                    <Accordion
                      expanded={expandedId === rule.id}
                      onChange={handleAccordionChange(rule.id)}
                      sx={{ 
                        mb: 4,
                        borderRadius: '20px', 
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.background.paper, 0.2),
                        boxShadow: expandedId === rule.id 
                          ? '0 18px 40px rgba(0,0,0,0.15)' 
                          : '0 6px 18px rgba(0,0,0,0.08)',
                        '&:before': {
                          display: 'none',
                        },
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': {
                          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                          transform: expandedId === rule.id ? 'none' : 'translateY(-5px)'
                        },
                        backdropFilter: 'blur(15px)',
                        backgroundColor: alpha(theme.palette.background.paper, 0.65),
                        transform: expandedId === rule.id ? 'scale(1.02)' : 'none',
                        ml: { xs: 0, md: index % 2 === 0 ? '5%' : 0 },
                        mr: { xs: 0, md: index % 2 === 1 ? '5%' : 0 },
                        width: { xs: '100%', md: '95%' }
                      }}
                      disableGutters
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon sx={{ 
                            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: expandedId === rule.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: expandedId === rule.id ? 'primary.main' : 'text.secondary',
                            fontSize: 28
                          }} />
                        }
                        aria-controls={`panel${rule.id}-content`}
                        id={`panel${rule.id}-header`}
                        sx={{ 
                          py: 2,
                          px: { xs: 2, md: 3 },
                          bgcolor: expandedId === rule.id 
                            ? alpha(getCategoryColor(rule.category), 0.05)
                            : 'transparent',
                          '&:hover': {
                            bgcolor: alpha(getCategoryColor(rule.category), 0.07),
                          },
                          transition: 'background-color 0.3s',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                          <Box 
                            sx={{ 
                              mr: 3, 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: { xs: 45, md: 56 },
                              height: { xs: 45, md: 56 },
                              borderRadius: '14px',
                              background: `linear-gradient(135deg, ${getCategoryColor(rule.category)} 0%, ${alpha(getCategoryColor(rule.category), 0.8)} 100%)`,
                              color: 'white',
                              boxShadow: expandedId === rule.id 
                                ? `0 8px 25px ${alpha(getCategoryColor(rule.category), 0.3)}` 
                                : `0 5px 15px ${alpha(getCategoryColor(rule.category), 0.2)}`,
                              transition: 'all 0.3s'
                            }}
                          >
                            <GavelIcon fontSize={isMobile ? "small" : "medium"} />
                          </Box>
                          <Box>
                            <Typography 
                              variant={isMobile ? "subtitle1" : "h6"} 
                              sx={{ 
                                fontWeight: 600,
                                color: expandedId === rule.id 
                                  ? getCategoryColor(rule.category) 
                                  : 'text.primary',
                                lineHeight: 1.3
                              }}
                            >
                              {rule.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
                              <Chip 
                                label={rule.category} 
                                size="small" 
                                sx={{ 
                                  borderRadius: 5,
                                  height: 24,
                                  fontSize: '0.75rem',
                                  bgcolor: alpha(getCategoryColor(rule.category), 0.1),
                                  color: getCategoryColor(rule.category),
                                  border: '1px solid',
                                  borderColor: alpha(getCategoryColor(rule.category), 0.2),
                                  mr: 1.5
                                }}
                              />
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  mt: { xs: isMobile ? 0.5 : 0, sm: 0 }
                                }}
                              >
                                <InfoIcon 
                                  fontSize="small" 
                                  sx={{ mr: 0.5, fontSize: '0.875rem', color: alpha(theme.palette.text.secondary, 0.7) }} 
                                />
                                {rule.lawReference}
                              </Typography>
                              {!isMobile && (
                                <Button 
                                  size="small" 
                                  startIcon={<BookmarkBorderIcon />} 
                                  sx={{ 
                                    ml: 'auto', 
                                    color: 'text.secondary',
                                    '&:hover': {
                                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                                      color: theme.palette.primary.main
                                    }
                                  }}
                                >
                                  Save
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ 
                        p: { xs: 2, md: 4 }, 
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        pb: 4
                      }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start',
                                mb: 3,
                                borderLeft: '3px solid',
                                borderColor: alpha(getCategoryColor(rule.category), 0.5),
                                pl: 2,
                                py: 0.5
                              }}
                            >
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  lineHeight: 1.7, 
                                  color: alpha(theme.palette.text.primary, 0.87),
                                  fontSize: '1.05rem'
                                }}
                              >
                                {rule.description}
                              </Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Box 
                              sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                mb: 3,
                                background: `linear-gradient(135deg, ${alpha('#f44336', 0.05)} 0%, ${alpha('#f44336', 0.1)} 100%)`,
                                border: '1px solid',
                                borderColor: alpha('#f44336', 0.15),
                                display: 'flex',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              <Box 
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  width: '100px',
                                  height: '100%',
                                  background: `linear-gradient(to right, transparent, ${alpha('#f44336', 0.02)})`,
                                  zIndex: 0
                                }}
                              />
                              <WarningIcon 
                                sx={{ 
                                  mr: 2, 
                                  color: '#d32f2f',
                                  mt: 0.5,
                                  fontSize: 28
                                }} 
                              />
                              <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography 
                                  variant="subtitle1" 
                                  color="#d32f2f" 
                                  fontWeight="bold" 
                                  gutterBottom
                                  sx={{ fontSize: '1.1rem' }}
                                >
                                  Penalty/Consequence:
                                </Typography>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    color: alpha(theme.palette.text.primary, 0.87),
                                    lineHeight: 1.6
                                  }}
                                >
                                  {rule.penalty}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                bgcolor: alpha(theme.palette.background.default, 0.7),
                                p: 2,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.1)
                              }}
                            >
                              <InfoIcon fontSize="small" sx={{ mr: 1, color: getCategoryColor(rule.category) }} />
                              <Typography 
                                variant="body2" 
                                sx={{ color: alpha(theme.palette.text.secondary, 0.9) }}
                              >
                                Legal Reference: <Box 
                                  component="span" 
                                  sx={{ 
                                    fontWeight: 'bold',
                                    color: alpha(theme.palette.text.primary, 0.9)
                                  }}
                                >
                                  {rule.lawReference}
                                </Box>
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Fade>
                ))
              ) : (
                <Fade in={fadeIn} timeout={1500}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 10, 
                    px: 4,
                    borderRadius: 6,
                    backgroundColor: alpha(theme.palette.background.paper, 0.65),
                    backdropFilter: 'blur(15px)',
                    border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
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
                  }}>
                    <Box 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        borderRadius: '20px',
                        bgcolor: alpha(theme.palette.primary.light, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.2)
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                    </Box>
                    <Typography variant="h5" color="text.primary" fontWeight={600} gutterBottom>
                      No rules found matching your search criteria.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Try adjusting your search term or clearing the category filter.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                      }}
                      sx={{ 
                        mt: 2,
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s'
                      }}
                      startIcon={<ArrowBackIosNewIcon />}
                    >
                      Reset Search
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ 
              my: 6,
              width: '80%',
              mx: 'auto',
              '&::before, &::after': {
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }
            }} />
            <Fade in={fadeIn} timeout={2500}>
              <Box sx={{ 
                textAlign: 'center', 
                maxWidth: '800px', 
                mx: 'auto',
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                backdropFilter: 'blur(15px)',
                p: 4,
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.background.paper, 0.2)}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
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
              }}>
                <Typography variant="h6" color="text.secondary" fontWeight={500} gutterBottom>
                  Legal Disclaimer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.7 }}>
                  The information provided here is for educational purposes only and should not be considered as legal advice.
                  For specific legal inquiries, please consult with a qualified legal professional.
                </Typography>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RulesPage; 