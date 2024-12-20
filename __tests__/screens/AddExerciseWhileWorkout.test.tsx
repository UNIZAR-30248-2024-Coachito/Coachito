import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useFetchExercisesList } from '@/hooks/exerciseHook';
import AddExerciseWhileWorkout from '@/screens/AddExerciseWhileWorkout';
import { RootStackParamList } from '@/types/navigation';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/exerciseHook', () => ({
  useFetchExercisesList: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    emit: jest.fn(),
  },
}));

describe('AddExerciseWhileWorkout', () => {
  const navigateMock = jest.fn();
  const routeMock = {
    key: 'test-key',
    name: 'AddExerciseWhileWorkout',
    params: {
      routineId: 1,
      routineName: 'rutina 1',
    },
  };

  beforeEach(() => {
    const mockedUseNavigation = jest.mocked(useNavigation);
    const mockedUseRoute = jest.mocked(useRoute);

    mockedUseNavigation.mockReturnValue({
      navigate: navigateMock,
    } as unknown as NavigationProp<RootStackParamList>);

    mockedUseRoute.mockReturnValue(routeMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el componente AddExerciseWhileWorkout correctamente', () => {
    const exercisesMock = [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        restTime: '00:01:30',
        sets: [],
      },
    ];

    const mockedUseFetchExercisesList = jest.mocked(useFetchExercisesList);
    mockedUseFetchExercisesList.mockResolvedValue({
      data: exercisesMock,
      error: null,
    });

    const { getByText } = render(<AddExerciseWhileWorkout />);
    expect(getByText('Agregar Ejercicio')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('debería obtener los ejercicios y mostrarlos', async () => {
    const exercisesMock = [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        restTime: '00:01:30',
        sets: [],
      },
      {
        id: 2,
        name: 'Sentadillas',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Cuádriceps',
        restTime: null,
        sets: [],
      },
    ];

    const mockedUseFetchExercisesList = jest.mocked(useFetchExercisesList);
    mockedUseFetchExercisesList.mockResolvedValue({
      data: exercisesMock,
      error: null,
    });

    const { getByText } = render(<AddExerciseWhileWorkout />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText('Flexiones')).toBeTruthy();
        expect(getByText('Cuádriceps')).toBeTruthy();
      });
    });
  });

  it('debería volver a la pantalla anterior con los ejercicios iniciales al pulsar "Cancelar"', async () => {
    const { getByText } = render(<AddExerciseWhileWorkout />);
    const cancelButton = getByText('Cancelar');

    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('StartWorkout', {
      routineId: routeMock.params.routineId,
      routineName: routeMock.params.routineName,
    });
  });

  it('debería alternar el estado de un ejercicio en selectedExercises cuando se selecciona y deselecciona', async () => {
    const exercisesMock = [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        restTime: '00:01:30',
        sets: [],
      },
    ];

    const mockedUseFetchExercisesList = jest.mocked(useFetchExercisesList);
    mockedUseFetchExercisesList.mockResolvedValue({
      data: exercisesMock,
      error: null,
    });

    const { getByText, queryByText } = render(<AddExerciseWhileWorkout />);

    await act(async () => {
      await waitFor(() => getByText('Flexiones'));
    });

    const exerciseButton = getByText('Flexiones');

    await act(async () => {
      fireEvent.press(exerciseButton);
    });

    expect(getByText('Añadir Ejercicios')).toBeTruthy();

    await act(async () => {
      fireEvent.press(exerciseButton);
    });

    expect(queryByText('Añadir Ejercicios')).toBeFalsy();
  });

  it('debería volver atrás con los ejercicios seleccionados', async () => {
    const exercisesMock = [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        restTime: '00:01:30',
        sets: [],
      },
    ];

    const mockedUseFetchExercisesList = jest.mocked(useFetchExercisesList);
    mockedUseFetchExercisesList.mockResolvedValue({
      data: exercisesMock,
      error: null,
    });

    const { getByText } = render(<AddExerciseWhileWorkout />);

    await act(async () => {
      await waitFor(() => getByText('Flexiones'));
    });

    const exerciseButton = getByText('Flexiones');

    await act(async () => {
      fireEvent.press(exerciseButton);
    });

    const addButton = getByText('Añadir Ejercicios');

    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('StartWorkout', {
      routineId: routeMock.params.routineId,
      routineName: routeMock.params.routineName,
    });
  });
});
