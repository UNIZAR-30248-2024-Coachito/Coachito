import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchDetailsWorkout } from '@/hooks/workoutHook';
import DetailsWorkout from '@/screens/DetailsWorkout';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/workoutHook', () => ({
  useFetchDetailsWorkout: jest.fn(),
}));

global.alert = jest.fn();

describe('DetailsWorkout', () => {
  const navigationMock = jest.fn();
  const mockWorkoutData = {
    workout_header_resume: {
      workoutId: 1,
      workoutName: 'Entrenamiento 1',
      workoutDate: '2024-10-07T17:55:23.310882+00:00',
      workoutTime: '01:30:00',
      workoutVolume: 500,
      workoutSeries: 3,
    },
    exercise_resume: [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        restTime: '00:01:30',
        notes: 'Nota 1',
        sets: [],
        primaryMuscleGroup: 'Pectorales',
      },
      {
        id: 2,
        name: 'Sentadillas',
        thumbnailUrl: 'https://example.com/image.jpg',
        restTime: null,
        notes: 'Nota 2',
        sets: [],
        primaryMuscleGroup: 'Glúteos',
      },
    ],
  };

  const routeMock = {
    params: {
      workoutId: 1,
    },
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    (useRoute as jest.Mock).mockReturnValue(routeMock);
    (useFetchDetailsWorkout as jest.Mock).mockResolvedValue({
      data: mockWorkoutData,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deberíaría renderizar correctamente el componente', async () => {
    const { getByText } = render(<DetailsWorkout />);

    expect(getByText('Detalles de entrenamiento')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Flexiones')).toBeTruthy();
      expect(getByText('Sentadillas')).toBeTruthy();
    });
  });

  it('debería mostrar el resumen del entrenamiento cuando los datos se cargan', async () => {
    const { getByText } = render(<DetailsWorkout />);

    await waitFor(() => {
      expect(getByText('Entrenamiento 1')).toBeTruthy();
      expect(getByText('500 Kg')).toBeTruthy();
      expect(getByText('90 min')).toBeTruthy();
    });
  });

  it('debería mostrar los ejercicios correctamente', async () => {
    const { getByText } = render(<DetailsWorkout />);

    await waitFor(() => {
      expect(getByText('Flexiones')).toBeTruthy();
      expect(getByText('Sentadillas')).toBeTruthy();
    });
  });

  it('debería mostrar un error si la obtención de la información del entrenamiento falla', async () => {
    (useFetchDetailsWorkout as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(<DetailsWorkout />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        'Se ha producido un error al obtener los datos.'
      )
    );

    alertSpy.mockRestore();
  });
});
