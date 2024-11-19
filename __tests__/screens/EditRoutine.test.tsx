import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditRoutine from '@/screens/EditRoutine';
import { useFetchDetailsLastWorkout } from '@/hooks/workoutHook';
import { Alert } from 'react-native';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/workoutHook', () => ({
  useFetchDetailsLastWorkout: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateHook', () => ({
  useUpdateRoutine: jest.fn(),
}));

jest.mock('@/components/exercise/ExerciseResume', () => ({
  ExerciseResumeComponent: jest.fn(() => null),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    emit: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock('@/components/exercise/ExerciseResume', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

Alert.alert = jest.fn();

describe('EditRoutine', () => {
  const navigationMock = { navigate: jest.fn() };
  const routeMock = {
    params: {
      routineId: 1,
      routineName: 'Test Routine',
    },
  };
  const dataMock = {
    data: [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: '',
        restTime: '00:00:30',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        sets: [],
      },
    ],
    error: null,
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    (useRoute as jest.Mock).mockReturnValue(routeMock);
    (useFetchDetailsLastWorkout as jest.Mock).mockReturnValue(dataMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente el componente', async () => {
    const { getByText } = render(<EditRoutine />);

    expect(getByText('Editar Rutina')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('debería navegar al agregar un ejercicio', async () => {
    const { getByText } = render(<EditRoutine />);

    fireEvent.press(getByText('Agregar ejercicio'));

    expect(navigationMock.navigate).toHaveBeenCalledWith('AddExerciseEdit', {
      selectedExercises: [],
      routineId: routeMock.params.routineId,
      routineName: routeMock.params.routineName,
    });
  });

  it('debería actualizar el título de la rutina', async () => {
    const { getByPlaceholderText } = render(<EditRoutine />);

    const input = getByPlaceholderText('Título de la rutina');
    await act(async () => {
      fireEvent.changeText(input, 'Nueva Rutina');
    });

    expect(input.props.value).toBe('Nueva Rutina');
  });

  it('debería mostrar el modal de confirmar cancelación al presionar "Cancelar"', async () => {
    const { getByText } = render(<EditRoutine />);

    fireEvent.press(getByText('Cancelar'));

    expect(
      getByText('¿Está seguro de que quiere descartar los cambios?')
    ).toBeTruthy();
  });

  it('debería descartar los cambios de la rutina al presionar "Descartar cambios" en el modal', async () => {
    const { getByText } = render(<EditRoutine />);

    fireEvent.press(getByText('Cancelar'));
    fireEvent.press(getByText('Descartar cambios'));

    expect(navigationMock.navigate).toHaveBeenCalledWith('Routine');
  });

  it('debería cancelar la acción al presionar "Cancelar" en el modal de cancelación', async () => {
    const { getByText, getByTestId } = render(<EditRoutine />);

    fireEvent.press(getByText('Cancelar'));
    fireEvent.press(getByTestId('cancel-button-modal'));

    expect(getByText('Editar Rutina')).toBeTruthy();
  });

  it('debería mostrar un error si el título de la rutina está vacío', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText, getByPlaceholderText } = render(<EditRoutine />);

    const inputField = getByPlaceholderText('Título de la rutina');

    fireEvent.changeText(inputField, '');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Por favor, introduce un nombre para la rutina.',
        [{ text: 'OK' }]
      )
    );
  });

  it('debería mostrar un error si no hay ejercicios seleccionados al crear la rutina', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = render(<EditRoutine />);

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'La rutina debe contener mínimo un ejercicio.',
        [{ text: 'OK' }]
      )
    );
  });

  it('debería mostrar el mensaje de "Empieza agregando un ejercicio" cuando no haya ejercicios seleccionados', async () => {
    const { getByText } = render(<EditRoutine />);
    expect(
      getByText('Empieza agregando un ejercicio a tu rutina')
    ).toBeTruthy();
  });

  it('debería mostrar un error si la obtención de los ejercicios falla', async () => {
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Some error',
    });
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<EditRoutine />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error al obtener los ejercicios.',
        [{ text: 'OK' }]
      )
    );
  });
});
