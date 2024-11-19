import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFetchExercisesList } from '@/hooks/exerciseHook';
import AddExerciseEdit from '@/screens/AddExerciseEdit';
import { Alert } from 'react-native';

jest.mock('../../styles.css', () => ({}));

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

Alert.alert = jest.fn();

describe('AddExerciseEdit', () => {
  const navigateMock = jest.fn();
  const routeMock = {
    key: 'test-key',
    name: 'AddExerciseEdit',
    params: {
      selectedExercises: [],
      routineId: 'routineId',
      routineName: 'routineName',
    },
  };

  beforeEach(() => {
    jest.mocked(useNavigation).mockReturnValue({ navigate: navigateMock });
    jest.mocked(useRoute).mockReturnValue(routeMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el componente AddExerciseEdit correctamente', () => {
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

    const { getByText } = render(<AddExerciseEdit />);
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

    const { getByText } = render(<AddExerciseEdit />);

    await act(async () => {
      await waitFor(() => {
        expect(getByText('Flexiones')).toBeTruthy();
        expect(getByText('Cuádriceps')).toBeTruthy();
      });
    });
  });

  it('debería volver a la pantalla anterior con los ejercicios iniciales al pulsar "Cancelar"', async () => {
    const { getByText } = render(<AddExerciseEdit />);
    const cancelButton = getByText('Cancelar');

    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('EditRoutine', {
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

    const { getByText, queryByText } = render(<AddExerciseEdit />);

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

    const { getByText } = render(<AddExerciseEdit />);

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

    expect(navigateMock).toHaveBeenCalledWith('EditRoutine', {
      exercises: routeMock.params.selectedExercises[0],
      routineId: routeMock.params.routineId,
      routineName: routeMock.params.routineName,
    });
  });

  it('debería mostrar un error si la obtención de los ejercicios falla', async () => {
    (useFetchExercisesList as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<AddExerciseEdit />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error obteniendo los ejercicios.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });

  it('debería filtrar los ejercicios según el término de búsqueda', async () => {
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
      {
        id: 3,
        name: 'Pull-ups',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Espalda',
        restTime: '00:02:00',
        sets: [],
      },
    ];

    const mockedUseFetchExercisesList = jest.mocked(useFetchExercisesList);
    mockedUseFetchExercisesList.mockResolvedValue({
      data: exercisesMock,
      error: null,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(
      <AddExerciseEdit />
    );

    await act(async () => {
      await waitFor(() => {
        expect(getByText('Flexiones')).toBeTruthy();
        expect(getByText('Sentadillas')).toBeTruthy();
        expect(getByText('Pull-ups')).toBeTruthy();
      });
    });

    const searchInput = getByPlaceholderText('Buscar Ejercicio');

    fireEvent.changeText(searchInput, 'Flex');
    await waitFor(() => {
      expect(getByText('Flexiones')).toBeTruthy();
      expect(queryByText('Sentadillas')).toBeNull();
      expect(queryByText('Pull-ups')).toBeNull();
    });

    fireEvent.changeText(searchInput, 'Espalda');
    await waitFor(() => {
      expect(queryByText('Flexiones')).toBeNull();
      expect(queryByText('Sentadillas')).toBeNull();
      expect(queryByText('Pull-ups')).toBeNull();
    });
  });
});
