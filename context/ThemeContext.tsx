import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  colorMode?: 'dark' | 'light';
  toggleColorMode?: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: 'light',
  toggleColorMode: () => {},
});

export const saveTheme = async (theme: 'light' | 'dark') => {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const getTheme = async (): Promise<'light' | 'dark'> => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    return theme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'dark';
  }
};
