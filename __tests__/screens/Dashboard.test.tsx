import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react-native';
import Dashboard from '@/screens/Dashboard';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { emitter } from '@/utils/emitter';
import { Alert } from 'react-native';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/hooks/dashboardHook', () => ({
  useFetchDashboardWorkouts: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  },
}));

describe('Dashboard', () => {
  const mockUseFetchDashboardWorkouts = useFetchDashboardWorkouts as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería cargar y renderizar los entrenamientos correctamente', async () => {
    const mockData = [
      {
        workout_header_resume: { workoutId: 1, title: 'Entrenamiento 1' },
        workout_exercises_resume: [{ name: 'Ejercicio 1' }],
      },
      {
        workout_header_resume: { workoutId: 2, title: 'Entrenamiento 2' },
        workout_exercises_resume: [{ name: 'Ejercicio 2' }],
      },
    ];
    mockUseFetchDashboardWorkouts.mockResolvedValue({
      data: mockData,
      error: null,
    });

    const { getByText } = render(<Dashboard />);

    await waitFor(() =>
      expect(useFetchDashboardWorkouts).toHaveBeenCalledTimes(2)
    );

    expect(getByText('Entrenamiento 1')).toBeTruthy();
    expect(getByText('Entrenamiento 2')).toBeTruthy();
  });

  /*it('debería manejar el caso cuando no hay entrenamientos disponibles', async () => {
    // Simulamos que useFetchDashboardWorkouts devuelve una respuesta sin datos
    useFetchDashboardWorkouts.mockResolvedValue({ data: [], error: null });

    render(<Dashboard />);

    // Esperamos a que se cargue
    await waitFor(() =>
      expect(useFetchDashboardWorkouts).toHaveBeenCalledTimes(1)
    );

    // Verificamos que no haya entrenamientos renderizados
    expect(screen.queryByText('Entrenamiento 1')).toBeNull();
    expect(screen.queryByText('Entrenamiento 2')).toBeNull();
  });

  it('debería navegar a los detalles del entrenamiento al presionar en un entrenamiento', async () => {
    const mockData = [
      {
        workout_header_resume: { workoutId: 1, title: 'Entrenamiento 1' },
        workout_exercises_resume: [{ name: 'Ejercicio 1' }],
      },
    ];

    // Mockeamos la navegación
    const navigateMock = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({ navigate: navigateMock });

    useFetchDashboardWorkouts.mockResolvedValue({
      data: mockData,
      error: null,
    });

    render(<Dashboard />);

    // Esperamos a que los datos sean cargados
    await waitFor(() =>
      expect(useFetchDashboardWorkouts).toHaveBeenCalledTimes(1)
    );

    // Simulamos presionar en el primer entrenamiento
    fireEvent.press(screen.getByText('Entrenamiento 1'));

    // Verificamos si la navegación ocurrió correctamente
    expect(navigateMock).toHaveBeenCalledWith('DetailsWorkout', {
      workoutId: 1,
    });
  });

  it('debería mostrar un alert cuando se emite el evento "workoutFinished"', async () => {
    const mockData = [
      {
        workout_header_resume: { workoutId: 1, title: 'Entrenamiento 1' },
        workout_exercises_resume: [{ name: 'Ejercicio 1' }],
      },
    ];

    useFetchDashboardWorkouts.mockResolvedValue({
      data: mockData,
      error: null,
    });

    render(<Dashboard />);

    // Disparamos el evento 'workoutFinished'
    act(() => {
      emitter.emit('workoutFinished');
    });

    // Verificamos que el alert fue mostrado
    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        '¡Entrenamiento completado!',
        '',
        [{ text: 'Aceptar' }]
      )
    );

    // Verificamos que los datos fueron recargados
    await waitFor(() =>
      expect(useFetchDashboardWorkouts).toHaveBeenCalledTimes(2)
    );
  });*/
});
