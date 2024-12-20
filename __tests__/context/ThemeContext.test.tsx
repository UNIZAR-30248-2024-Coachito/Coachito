import React from 'react';
import { ThemeContext, saveTheme, getTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('ThemeContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveTheme', () => {
    it('debe guardar el tema en AsyncStorage', async () => {
      await saveTheme('dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('debe manejar errores al guardar el tema', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Failed to save theme')
      );

      console.error = jest.fn();
      await saveTheme('light');
      expect(console.error).toHaveBeenCalledWith(
        'Error saving theme:',
        new Error('Failed to save theme')
      );
    });
  });

  describe('getTheme', () => {
    it('debe devolver "dark" si AsyncStorage contiene "dark"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

      const theme = await getTheme();
      expect(theme).toBe('dark');
    });

    it('debe devolver "light" si AsyncStorage contiene "light"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');

      const theme = await getTheme();
      expect(theme).toBe('light');
    });

    it('debe devolver "light" si AsyncStorage contiene un valor desconocido', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('unknown');

      const theme = await getTheme();
      expect(theme).toBe('light');
    });

    it('debe manejar errores al obtener el tema y devolver "dark" por defecto', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Failed to get theme')
      );

      console.error = jest.fn();
      const theme = await getTheme();
      expect(theme).toBe('dark');
      expect(console.error).toHaveBeenCalledWith(
        'Error getting theme:',
        new Error('Failed to get theme')
      );
    });
  });

  describe('ThemeContext default values', () => {
    it('debe tener "light" como valor predeterminado para colorMode', () => {
      const { result } = renderHook(() => React.useContext(ThemeContext));
      expect(result.current.colorMode).toBe('light');
    });

    it('debe tener una función vacía como valor predeterminado para toggleColorMode', () => {
      const { result } = renderHook(() => React.useContext(ThemeContext));
      expect(result.current.toggleColorMode).toBeInstanceOf(Function);
      expect(result.current.toggleColorMode).not.toThrow();
    });
  });
});
