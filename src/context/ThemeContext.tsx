// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: ColorScheme;
  setTheme: (theme: Theme) => void;
}

interface ColorScheme {
  background: string;
  cardBg: string;
  text: string;
  secondaryText: string;
  accent: string;
  tabActive: string;
  tabInactive: string;
  bottomNav: string;
  border: string;
  overlay: string;
}

const lightColors: ColorScheme = {
  background: '#FFFFFF',
  cardBg: '#F2F2F7',
  text: '#000000',
  secondaryText: '#6C6C70',
  accent: '#FF6B35',
  tabActive: '#FF6B35',
  tabInactive: '#6C6C70',
  bottomNav: '#F2F2F7',
  border: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.3)',
};

const darkColors: ColorScheme = {
  background: '#000000',
  cardBg: '#1C1C1E',
  text: '#FFFFFF',
  secondaryText: '#8E8E93',
  accent: '#FF6B35',
  tabActive: '#FF6B35',
  tabInactive: '#8E8E93',
  bottomNav: '#1C1C1E',
  border: '#38383A',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('auto');
  
  const isDark = theme === 'auto' 
    ? systemColorScheme === 'dark' 
    : theme === 'dark';
  
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};