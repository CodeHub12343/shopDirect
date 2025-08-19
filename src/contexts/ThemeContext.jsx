import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Theme definitions
const lightTheme = {
  name: 'light',
  colors: {
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    backgroundCard: '#ffffff',
    backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
    
    // Text colors
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textInverse: '#ffffff',
    textMuted: '#64748b',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Primary colors
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    primaryHover: '#2563eb',
    
    // Success colors
    success: '#10b981',
    successLight: '#34d399',
    successDark: '#059669',
    
    // Warning colors
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    
    // Error colors
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    
    // Neutral colors
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Chart colors
    chart: {
      primary: '#3b82f6',
      secondary: '#10b981',
      tertiary: '#f59e0b',
      quaternary: '#ef4444',
      quinary: '#8b5cf6',
      senary: '#06b6d4',
    },
    
    // Shadow
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

const darkTheme = {
  name: 'dark',
  colors: {
    // Background colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    backgroundCard: '#1e293b',
    backgroundOverlay: 'rgba(0, 0, 0, 0.7)',
    
    // Text colors
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textInverse: '#0f172a',
    textMuted: '#64748b',
    
    // Border colors
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1e293b',
    
    // Primary colors
    primary: '#60a5fa',
    primaryLight: '#93c5fd',
    primaryDark: '#3b82f6',
    primaryHover: '#93c5fd',
    
    // Success colors
    success: '#34d399',
    successLight: '#6ee7b7',
    successDark: '#10b981',
    
    // Warning colors
    warning: '#fbbf24',
    warningLight: '#fcd34d',
    warningDark: '#f59e0b',
    
    // Error colors
    error: '#f87171',
    errorLight: '#fca5a5',
    errorDark: '#ef4444',
    
    // Neutral colors
    gray: {
      50: '#0f172a',
      100: '#1e293b',
      200: '#334155',
      300: '#475569',
      400: '#64748b',
      500: '#94a3b8',
      600: '#cbd5e1',
      700: '#e2e8f0',
      800: '#f1f5f9',
      900: '#f8fafc',
    },
    
    // Chart colors
    chart: {
      primary: '#60a5fa',
      secondary: '#34d399',
      tertiary: '#fbbf24',
      quaternary: '#f87171',
      quinary: '#a78bfa',
      senary: '#22d3ee',
    },
    
    // Shadow
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      return savedTheme;
    }
    return 'auto';
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      if (themeMode === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
      }
      return themeMode === 'dark' ? darkTheme : lightTheme;
    } catch (error) {
      console.warn('Error initializing theme, falling back to light theme:', error);
      return lightTheme;
    }
  });

  // Update theme when mode changes
  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setCurrentTheme(isDark ? darkTheme : lightTheme);
      } else {
        setCurrentTheme(themeMode === 'dark' ? darkTheme : lightTheme);
      }
    };

    updateTheme();

    // Listen for system theme changes when in auto mode
    if (themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Save theme mode to localStorage
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  // Apply theme to document
  useEffect(() => {
    if (!currentTheme) {
      console.warn('Theme is not initialized yet');
      return;
    }

    try {
      const root = document.documentElement;
      
      // Apply CSS custom properties
      Object.entries(currentTheme.colors).forEach(([key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--color-${key}-${subKey}`, subValue);
          });
        } else {
          root.style.setProperty(`--color-${key}`, value);
        }
      });

      // Set theme class on body
      document.body.className = `theme-${currentTheme.name}`;
      
      console.log('Theme applied:', currentTheme.name);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  const setTheme = (mode) => {
    if (['light', 'dark', 'auto'].includes(mode)) {
      setThemeMode(mode);
    }
  };

  const value = {
    theme: currentTheme || lightTheme, // Fallback to light theme if currentTheme is null/undefined
    themeMode,
    toggleTheme,
    setTheme,
    isDark: currentTheme?.name === 'dark',
    isLight: currentTheme?.name === 'light',
    isAuto: themeMode === 'auto',
  };

  // Create the styled-components theme object
  const styledTheme = {
    ...currentTheme,
    isDark: currentTheme?.name === 'dark',
    isLight: currentTheme?.name === 'light',
    isAuto: themeMode === 'auto',
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 