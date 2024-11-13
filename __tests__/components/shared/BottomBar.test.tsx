import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BottomBar from '@/components/shared/BottomBar';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

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

  it('debería renderizar correctamente y marcar "Dashboard" como activo cuando la ruta es "Dashboard"', () => {
    (useRoute as jest.Mock).mockReturnValue({ name: 'Dashboard' });

    const { getByText, getAllByTestId } = render(<BottomBar />);

    expect(getByText('Inicio').props.className).toContain('text-blue-500');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-gray-400');
    expect(
      getAllByTestId('entrenamiento-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Perfil').props.className).toContain('text-gray-400');
    expect(
      getAllByTestId('perfil-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();
  });

  it('debería marcar "Routine" como activo cuando la ruta es "Routine"', async () => {
    (useRoute as jest.Mock).mockReturnValue({ name: 'Routine' });

    const { findByText, findAllByTestId } = render(<BottomBar />);

    expect((await findByText('Inicio')).props.className).toContain(
      'text-gray-400'
    );
    expect(
      (await findAllByTestId('inicio-icon')).find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect((await findByText('Rutinas')).props.className).toContain(
      'text-blue-500'
    );
    expect(
      (await findAllByTestId('entrenamiento-icon')).find(
        (icon) => icon.props.stroke === 'rgb(59 130 246)'
      )
    ).toBeDefined();

    expect((await findByText('Perfil')).props.className).toContain(
      'text-gray-400'
    );
    expect(
      (await findAllByTestId('perfil-icon')).find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();
  });

  it('debería marcar "Profile" como activo cuando la ruta es "Profile"', () => {
    (useRoute as jest.Mock).mockReturnValue({ name: 'Profile' });

    const { getByText, getAllByTestId } = render(<BottomBar />);

    expect(getByText('Inicio').props.className).toContain('text-gray-400');
    expect(
      getAllByTestId('inicio-icon').find(
        (icon) => icon.props.stroke === 'white'
      )
    ).toBeDefined();

    expect(getByText('Rutinas').props.className).toContain('text-gray-400');
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
    (useRoute as jest.Mock).mockReturnValue({ name: 'Profile' });

    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Inicio'));

    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });

  it('debería cambiar a la pantalla de "Routine" al presionar el botón de entrenamiento', () => {
    (useRoute as jest.Mock).mockReturnValue({ name: 'Dashboard' });

    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Rutinas'));

    expect(mockNavigate).toHaveBeenCalledWith('Routine');
  });

  it('debería cambiar a la pantalla de "Profile" al presionar el botón de perfil', () => {
    (useRoute as jest.Mock).mockReturnValue({ name: 'Dashboard' });

    const { getByText } = render(<BottomBar />);

    fireEvent.press(getByText('Perfil'));

    expect(mockNavigate).toHaveBeenCalledWith('Profile', { userId: 1 });
  });
});
