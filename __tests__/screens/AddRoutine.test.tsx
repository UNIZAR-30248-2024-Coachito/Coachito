import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useCreateRoutine,
  useRoutineTitleExists,
} from '@/hooks/workoutTemplateHook';
import AddRoutine from '@/screens/AddRoutine';
import { emitter } from '@/utils/emitter';
import { Alert } from 'react-native';
import { UserContext } from '@/context/UserContext';
import { Session } from '@supabase/supabase-js';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateHook', () => ({
  useCreateRoutine: jest.fn(),
  useRoutineTitleExists: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    emit: jest.fn(),
  },
}));

jest.mock('@/components/exercise/ExerciseResume', () => {
  return jest.fn(() => (
    <div data-testid="mocked-exercise-resume">Mocked Exercise Resume</div>
  ));
});

describe('AddRoutine', () => {
  const navigateMock = jest.fn();
  const mockRouteParams = {
    groupId: 'groupId',
    exercises: [
      {
        id: 1,
        name: 'Flexiones',
        thumbnailUrl: 'https://example.com/image.jpg',
        notes: '',
        primaryMuscleGroup: 'Pectorales',
        restTime: '00:01:30',
        sets: [],
      },
    ],
  };
  const routeMock = {
    key: 'test-key',
    name: 'AddRoutine',
    params: mockRouteParams,
  };

  beforeEach(() => {
    jest.mocked(useNavigation).mockReturnValue({ navigate: navigateMock });
    jest.mocked(useRoute).mockReturnValue(routeMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente el componente', async () => {
    const { getByText } = render(<AddRoutine />);
    expect(getByText('Crear Rutina')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('debería navegar al agregar un ejercicio', async () => {
    const { getByText } = render(<AddRoutine />);

    const addButton = getByText('Agregar ejercicio');
    await act(async () => {
      fireEvent.press(addButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('AddExercise', {
      selectedExercises: mockRouteParams.exercises,
      groupId: routeMock.params.groupId,
    });
  });

  it('debería actualizar el título de la rutina', async () => {
    const { getByPlaceholderText } = render(<AddRoutine />);

    const input = getByPlaceholderText('Título de la rutina');
    await act(async () => {
      fireEvent.changeText(input, 'Nueva Rutina');
    });

    expect(input.props.value).toBe('Nueva Rutina');
  });

  it('debería mostrar el modal de confirmar cancelación al presionar "Cancelar"', async () => {
    const { getByText, getByTestId } = render(<AddRoutine />);

    const cancelButton = getByTestId('cancel-routine');
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(
      getByText('¿Está seguro de que quiere descartar la rutina?')
    ).toBeTruthy();
  });

  it('debería descartar la rutina al presionar "Descartar rutina" en el modal', async () => {
    const { getByText, getByTestId } = render(<AddRoutine />);

    const cancelButton = getByTestId('cancel-routine');
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    const discardButton = getByText('Descartar rutina');
    await act(async () => {
      fireEvent.press(discardButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('Routine');
  });

  it('debería cancelar la acción al presionar "Cancelar" en el modal de cancelación', async () => {
    const { getByText, getByTestId } = render(<AddRoutine />);

    const cancelButton = getByTestId('cancel-routine');
    await act(async () => {
      fireEvent.press(cancelButton);
    });
    const cancelActionButton = getByTestId('cancel-cancel-routine-modal');
    await act(async () => {
      fireEvent.press(cancelActionButton);
    });

    expect(getByText('Crear Rutina')).toBeTruthy();
  });

  it('debería crear una rutina correctamente cuando hay un título y ejercicios seleccionados', async () => {
    const mockSession: Session = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'user-id',
        aud: 'authenticated',
        role: 'user',
        email: 'user@example.com',
        email_confirmed_at: '2024-01-01T00:00:00.000Z',
        app_metadata: {},
        user_metadata: {},
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
      },
      expires_in: 0,
      token_type: '',
    };

    const mockProfile = {
      username: 'user123',
      email: 'user123@example.com',
    };
    jest.mocked(useCreateRoutine).mockResolvedValue({ error: null });
    jest
      .mocked(useRoutineTitleExists)
      .mockResolvedValue({ data: false, error: null });
    Alert.alert = jest.fn;

    const { getByText, getByPlaceholderText } = render(
      <UserContext.Provider
        value={{ session: mockSession, profile: mockProfile }}
      >
        <AddRoutine />
      </UserContext.Provider>
    );
    const input = getByPlaceholderText('Título de la rutina');
    await act(async () => {
      fireEvent.changeText(input, 'Nueva Rutina');
    });

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(useRoutineTitleExists).toHaveBeenCalledWith(
      'Nueva Rutina',
      routeMock.params.groupId
    );
    expect(useCreateRoutine).toHaveBeenCalledWith(
      'Nueva Rutina',
      [],
      routeMock.params.groupId,
      mockSession.user.id
    );
    expect(emitter.emit).toHaveBeenCalledWith('routineAdded');
    expect(navigateMock).toHaveBeenCalledWith('Routine');
  });

  it('debería mostrar un error si ya existe una rutina con el mismo nombre en la carpeta', async () => {
    jest
      .mocked(useRoutineTitleExists)
      .mockResolvedValue({ data: true, error: null });
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<AddRoutine />);

    const input = getByPlaceholderText('Título de la rutina');
    await act(async () => {
      fireEvent.changeText(input, 'Rutina Duplicada');
    });

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(useRoutineTitleExists).toHaveBeenCalledWith(
      'Rutina Duplicada',
      routeMock.params.groupId
    );
    expect(alertMock).toHaveBeenCalledWith(
      '',
      'El título introducido ya existe. Por favor, introduzca otro.'
    );

    alertMock.mockRestore();
  });

  it('debería mostrar un error si el título de la rutina está vacío', async () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = render(<AddRoutine />);

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'Por favor, introduce un nombre para la nueva rutina.'
    );
    alertMock.mockRestore();
  });

  it('debería mostrar un error si no hay ejercicios seleccionados al crear la rutina', async () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    routeMock.params.exercises = [];
    const { getByText, getByPlaceholderText } = render(<AddRoutine />);

    const input = getByPlaceholderText('Título de la rutina');
    await act(async () => {
      fireEvent.changeText(input, 'Nueva Rutina');
    });

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'La rutina debe contener mínimo un ejercicio.'
    );
    alertMock.mockRestore();
  });

  it('debería mostrar el mensaje de "Empieza agregando un ejercicio" cuando no haya ejercicios seleccionados', async () => {
    routeMock.params.exercises = [];
    const { getByText } = render(<AddRoutine />);
    expect(
      getByText('Empieza agregando un ejercicio a tu rutina')
    ).toBeTruthy();
  });

  it('debería limitar el título de la rutina a 100 caracteres', async () => {
    const { getByPlaceholderText } = render(<AddRoutine />);

    const input = getByPlaceholderText('Título de la rutina');
    const longTitle =
      'Este es un título de rutina muy largo que definitivamente excede el límite de 100 caracteres porque queremos probar si realmente se corta correctamente.';

    await act(async () => {
      fireEvent.changeText(input, longTitle);
    });

    expect(input.props.value.length).toBeLessThanOrEqual(100);
    expect(input.props.value).toBe(longTitle.slice(0, 100));
  });
});
