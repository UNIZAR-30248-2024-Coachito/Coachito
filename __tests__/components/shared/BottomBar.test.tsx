import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomBar from '@/components/shared/BottomBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemeContext } from '@/context/ThemeContext';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    mergeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    multiMerge: jest.fn(),
  };
});

describe('BottomBar', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (theme: 'light' | 'dark', routeName: string) => {
    (useRoute as jest.Mock).mockReturnValue({ name: routeName });

    return render(
      <ThemeContext.Provider value={{ colorMode: theme }}>
        <BottomBar />
      </ThemeContext.Provider>
    );
  };

  it('debería marcar "Dashboard" como activo y renderizar correctamente con tema claro', () => {
    const { getByText, getAllByTestId } = renderWithTheme('light', 'Dashboard');

    expect(getByText('Inicio').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();
  });

  it('debería marcar "Dashboard" como activo y renderizar correctamente con tema oscuro', () => {
    const { getByText, getAllByTestId } = renderWithTheme('dark', 'Dashboard');

    expect(getByText('Inicio').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();
  });

  it('debería marcar "Routine" como activo y renderizar correctamente con tema claro', async () => {
    const { getByText, getAllByTestId } = renderWithTheme('light', 'Routine');

    expect(getByText('Inicio').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();
  });

  it('debería marcar "Routine" como activo y renderizar correctamente con tema oscuro', async () => {
    const { getByText, getAllByTestId } = renderWithTheme('dark', 'Routine');

    expect(getByText('Inicio').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();
  });

  it('debería marcar "Profile" como activo y renderizar correctamente con tema claro', () => {
    const { getByText, getAllByTestId } = renderWithTheme('light', 'Profile');

    expect(getByText('Inicio').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'black'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();
  });

  it('debería marcar "Profile" como activo y renderizar correctamente con tema oscuro', () => {
    const { getByText, getAllByTestId } = renderWithTheme('dark', 'Profile');

    expect(getByText('Inicio').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-typography-0');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();
  });

  it('debería cambiar a la pantalla de "Dashboard" al presionar el botón de inicio', () => {
    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Inicio'));
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });

  it('debería cambiar a la pantalla de "Routine" al presionar el botón de entrenamiento', () => {
    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Rutinas'));
    expect(mockNavigate).toHaveBeenCalledWith('Routine');
  });

  it('debería cambiar a la pantalla de "Profile" al presionar el botón de perfil', () => {
    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('Profile', { userId: 1 });
  });
});
