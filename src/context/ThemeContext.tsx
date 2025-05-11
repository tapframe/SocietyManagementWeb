import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get the saved theme mode from localStorage, default to 'light'
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' ? 'dark' : 'light') as ThemeMode;
  });

  // Create the theme based on the current mode
  const theme = React.useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode,
        primary: {
          light: '#4dabf5',
          main: '#2196f3',
          dark: '#1565c0',
          contrastText: '#fff',
        },
        secondary: {
          light: '#ff4081',
          main: '#f50057',
          dark: '#c51162',
          contrastText: '#fff',
        },
        success: {
          main: '#4caf50',
          light: '#81c784',
        },
        background: {
          default: mode === 'light' ? '#fafafa' : '#121212',
          paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
        text: {
          primary: mode === 'light' ? '#212121' : '#ffffff',
          secondary: mode === 'light' ? '#5f6368' : '#b0b0b0',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            'html, body': {
              margin: 0,
              padding: 0,
              width: '100vw',
              height: '100vh',
              transition: 'background-color 0.3s ease'
            },
            '#app': {
              height: '100vh',
              width: '100vw'
            }
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              boxShadow: 'none',
              padding: '8px 22px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'none',
                boxShadow: 'none',
              },
            },
            containedPrimary: {
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            },
            containedSecondary: {
              background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
            },
            outlined: {
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'transparent',
              }
            },
            text: {
              '&:hover': {
                backgroundColor: 'transparent',
              }
            }
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow: mode === 'light' 
                ? '0 5px 15px rgba(0, 0, 0, 0.05)' 
                : '0 5px 15px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: mode === 'light'
                  ? '0 12px 20px rgba(0, 0, 0, 0.1)'
                  : '0 12px 20px rgba(0, 0, 0, 0.4)',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              fontWeight: 500,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light'
                ? '0 2px 10px rgba(0, 0, 0, 0.05)'
                : '0 2px 10px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    });
    
    return responsiveFontSizes(baseTheme);
  }, [mode]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Update the theme mode in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 