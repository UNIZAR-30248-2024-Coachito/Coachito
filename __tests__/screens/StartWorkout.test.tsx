import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { emitter } from '@/utils/emitter';
import {
  useFetchDetailsLastWorkout,
  useCreateWorkout,
} from '@/hooks/workoutHook';
import StartWorkout from '@/screens/StartWorkout';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/workoutHook', () => ({
  useFetchDetailsLastWorkout: jest.fn(),
  useCreateWorkout: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: { emit: jest.fn() },
}));

jest.mock('@/components/workout/Timer', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('@/components/ui/text');
  const TimerMock = (props: { active: boolean }) => {
    return (
      <Text testID="timer">
        {props.active ? 'Timer Active' : 'Timer Stopped'}
      </Text>
    );
  };
  TimerMock.displayName = 'TimerMock';
  return TimerMock;
});

global.alert = jest.fn();

describe('StartWorkout', () => {
  const navigateMock = jest.fn();
  const routeMock = { params: { routineId: 1, routineName: 'Test Routine' } };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: navigateMock });
    (useRoute as jest.Mock).mockReturnValue(routeMock);
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: [],
      error: null,
    });
  });

  it('debería renderizar el componente correctamente', () => {
    const { getByText } = render(<StartWorkout />);
    expect(getByText(routeMock.params.routineName)).toBeTruthy();
    expect(getByText('Descartar')).toBeTruthy();
    expect(getByText('Terminar')).toBeTruthy();
  });

  it('debería obtener los ejercicios y mostrarlos', async () => {
    const mockExercises = [
      {
        id: '1',
        name: 'Exercise 1',
        thumbnailUrl: '',
        restTime: '00:00:30',
        notes: '',
        primaryMuscleGroup: '',
        sets: [],
      },
      {
        id: '2',
        name: 'Exercise 2',
        thumbnailUrl: '',
        restTime: '00:00:30',
        notes: '',
        primaryMuscleGroup: '',
        sets: [],
      },
    ];
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: mockExercises,
      error: null,
    });

    const { findByText } = render(<StartWorkout />);
    expect(findByText('Exercise 1')).toBeTruthy();
    expect(findByText('Exercise 2')).toBeTruthy();
  });

  it('debería manejar el parar y reinicio del timer', () => {
    const { getByText, getByTestId } = render(<StartWorkout />);

    fireEvent.press(getByText('Descartar'));
    expect(getByTestId('timer').props.children).toBe('Timer Stopped');

    fireEvent.press(getByText('Cancelar'));
    expect(getByTestId('timer').props.children).toBe('Timer Active');
  });

  it('debería aparecer el modal de cancelación al pulsar "Descartar"', () => {
    const { getByText, queryByText } = render(<StartWorkout />);

    expect(
      queryByText('¿Está seguro de que quiere descartar el entreno?')
    ).toBeNull();

    fireEvent.press(getByText('Descartar'));

    expect(
      getByText('¿Está seguro de que quiere descartar el entreno?')
    ).toBeTruthy();
  });

  it('debería guardar correctamente un entrenamiento', async () => {
    (useCreateWorkout as jest.Mock).mockResolvedValue({ error: null });

    const { getByText } = render(<StartWorkout />);

    fireEvent.press(getByText('Terminar'));

    await waitFor(() => {
      expect(useCreateWorkout).toHaveBeenCalledWith(
        routeMock.params.routineId,
        expect.any(Number),
        expect.any(Array)
      );
      expect(emitter.emit).toHaveBeenCalledWith('workoutFinished');
      expect(navigateMock).toHaveBeenCalledWith('Dashboard');
    });
  });

  it('debería aparecer un alert cuando no se guarda correctamente el entrenamiento', async () => {
    (useCreateWorkout as jest.Mock).mockResolvedValue({ error: 'Some error' });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText } = render(<StartWorkout />);
    fireEvent.press(getByText('Terminar'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Se ha producido un error al guardar el entrenamiento.'
      );
    });
  });

  it('debería aparecer un alert cuando no se obtienen correctamente los ejercicios', async () => {
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<StartWorkout />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Se ha producido un error obteniendo los ejercicios.'
      );
    });

    (global.alert as jest.Mock).mockRestore();
  });

  it('debería descartar el entreno al presionar "Descartar entreno" en el modal', async () => {
    const { getByText } = render(<StartWorkout />);

    const discardButton = getByText('Descartar');
    await act(async () => {
      fireEvent.press(discardButton);
    });

    const finalCancelButton = getByText('Descartar entreno');
    await act(async () => {
      fireEvent.press(finalCancelButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('Routine');
  });
});
