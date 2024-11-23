import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { emitter } from '@/utils/emitter';
import {
  useFetchDetailsLastWorkout,
  useCreateWorkout,
} from '@/hooks/workoutHook';
import StartWorkout from '@/screens/StartWorkout';
import { Alert } from 'react-native';

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

jest.useFakeTimers();

Alert.alert = jest.fn();

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

  it('debería renderizar el componente correctamente', async () => {
    const { getByText } = render(<StartWorkout />);
    await waitFor(() => {
      expect(getByText(routeMock.params.routineName)).toBeTruthy();
      expect(getByText('Descartar')).toBeTruthy();
      expect(getByText('Terminar')).toBeTruthy();
    });
  });

  it('debería obtener los ejercicios y mostrarlos', async () => {
    const mockExercises = [
      { id: '1', name: 'Exercise 1', restTime: '00:00:30', sets: [] },
      { id: '2', name: 'Exercise 2', restTime: '00:00:30', sets: [] },
    ];
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: mockExercises,
      error: null,
    });

    const { getByText } = render(<StartWorkout />);
    await waitFor(() => {
      expect(getByText('Exercise 1')).toBeTruthy();
      expect(getByText('Exercise 2')).toBeTruthy();
    });
  });

  it('debería manejar el parar y reinicio del timer', async () => {
    const { getByText } = render(<StartWorkout />);

    await act(async () => {
      fireEvent.press(getByText('Descartar'));
    });
    expect(getByText('Tiempo transcurrido: ')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Cancelar'));
    });
    jest.advanceTimersByTime(1000);
    expect(getByText('Tiempo transcurrido: 1s')).toBeTruthy();
  });

  it('debería aparecer el modal de cancelación al pulsar "Descartar"', async () => {
    const { getByText, queryByText } = render(<StartWorkout />);

    expect(
      queryByText('¿Está seguro de que quiere descartar el entreno?')
    ).toBeNull();

    await act(async () => {
      fireEvent.press(getByText('Descartar'));
    });

    await waitFor(() => {
      expect(
        getByText('¿Está seguro de que quiere descartar el entreno?')
      ).toBeTruthy();
    });
  });

  it('debería guardar correctamente un entrenamiento', async () => {
    (useCreateWorkout as jest.Mock).mockResolvedValue({ error: null });

    const { getByText } = render(<StartWorkout />);

    await act(async () => {
      fireEvent.press(getByText('Terminar'));
    });

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

  it('debería aparecer un alert cuando no se obtienen correctamente los ejercicios', async () => {
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });

    render(<StartWorkout />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '',
        'Se ha producido un error obteniendo los ejercicios.',
        [{ text: 'OK' }]
      );
    });
  });

  it('debería descartar el entreno al presionar "Descartar entreno" en el modal', async () => {
    const { getByText } = render(<StartWorkout />);

    await act(async () => {
      fireEvent.press(getByText('Descartar'));
    });

    const finalCancelButton = await waitFor(() =>
      getByText('Descartar entreno')
    );

    await act(async () => {
      fireEvent.press(finalCancelButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('Routine');
  });

  it('debería aparecer un alert cuando no se guarda correctamente el entrenamiento', async () => {
    (useCreateWorkout as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });

    render(<StartWorkout />);

    const { getByText } = render(<StartWorkout />);

    await act(async () => {
      fireEvent.press(getByText('Terminar'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        '',
        'Se ha producido un error al guardar el entrenamiento.',
        [{ text: 'OK' }]
      );
    });
  });
});
