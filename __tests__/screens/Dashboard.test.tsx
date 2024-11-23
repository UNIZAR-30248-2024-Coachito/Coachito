import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import Dashboard from '@/screens/Dashboard';
import { useFetchDashboardWorkouts } from '@/hooks/dashboardHook';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('@/hooks/dashboardHook', () => ({
  useFetchDashboardWorkouts: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    addListener: jest.fn().mockImplementation((event, callback) => {
      if (event === 'workoutFinished') {
        callback();
      }
    }),
  },
}));

Alert.alert = jest.fn();

describe('Dashboard', () => {
  const mockWorkouts = [
    {
      workout_header_resume: {
        workoutId: 1,
        workoutDate: '2024-11-05T12:27:23.909629+00:00',
        workoutName: 'Rutina 1',
        workoutTime: '01:00:38',
        workoutSeries: 6,
        workoutVolume: 119,
      },
      workout_exercises_resume: {
        exercises: [
          {
            series: 1,
            exerciseName: 'Flexiones',
            exerciseThumbnailUrl: 'https://example.com/image.png',
          },
          {
            series: 2,
            exerciseName: 'Sentadillas',
            exerciseThumbnailUrl: 'https://example.com/image.png',
          },
        ],
      },
    },
    {
      workout_header_resume: {
        workoutId: 2,
        workoutDate: '2024-11-05T12:27:23.909629+00:00',
        workoutName: 'Rutina 2',
        workoutTime: '01:00:38',
        workoutSeries: 6,
        workoutVolume: 119,
      },
      workout_exercises_resume: {
        exercises: [
          {
            series: 1,
            exerciseName: 'Flexiones',
            exerciseThumbnailUrl: 'https://example.com/image.png',
          },
          {
            series: 2,
            exerciseName: 'Sentadillas',
            exerciseThumbnailUrl: 'https://example.com/image.png',
          },
        ],
      },
    },
  ];

  beforeEach(() => {
    (useFetchDashboardWorkouts as jest.Mock).mockResolvedValue({
      data: mockWorkouts,
      error: null,
    });

    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    });
  });

  it('debería mostrar los entrenamientos después de obtener los datos', async () => {
    const { getByText } = render(<Dashboard />);

    await waitFor(() => {
      expect(getByText('Rutina 1')).toBeTruthy();
      expect(getByText('Rutina 2')).toBeTruthy();
    });
  });

  it('debería navegar a la pantalla de detalles del entrenamiento cuando se presione un entrenamiento', async () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });

    const { getByText } = render(<Dashboard />);

    await waitFor(() => {
      fireEvent.press(getByText('Rutina 1'));
      expect(navigateMock).toHaveBeenCalledWith('DetailsWorkout', {
        workoutId: 1,
      });
    });
  });

  it('debería mostrar un mensaje de error si ocurre un error al obtener los entrenamientos', async () => {
    (useFetchDashboardWorkouts as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<Dashboard />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error al obtener los entrenamientos.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });
});
