import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
  InputAdornment,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import { GridLegacy as Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<number | false>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Know Your Rules & Rights
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Learn about important laws and regulations to become a more informed citizen
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
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
            />
          </Grid>

          <Grid item xs={12}>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 2,
                '& > *': {
                  mb: 1
                }
              }}
            >
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  color={selectedCategory === category ? "primary" : "default"}
                  onClick={() => handleCategorySelect(category)}
                  clickable
                />
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            {filteredRules.length > 0 ? (
              filteredRules.map((rule) => (
                <Accordion
                  key={rule.id}
                  expanded={expandedId === rule.id}
                  onChange={handleAccordionChange(rule.id)}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${rule.id}-content`}
                    id={`panel${rule.id}-header`}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                      <GavelIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {rule.title}
                        </Typography>
                        <Chip 
                          label={rule.category} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body1" paragraph>
                        {rule.description}
                      </Typography>
                      
                      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Penalty/Consequence:
                        </Typography>
                        <Typography variant="body2">
                          {rule.penalty}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InfoIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Law Reference: {rule.lawReference}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No rules found matching your search criteria.
                </Typography>
                <Button 
                  variant="text" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                  }}
                  sx={{ mt: 2 }}
                >
                  Clear Search
                </Button>
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Disclaimer: The information provided here is for educational purposes only and should not be considered as legal advice.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For specific legal inquiries, please consult with a qualified legal professional.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RulesPage; 