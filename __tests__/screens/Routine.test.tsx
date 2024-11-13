import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { emitter } from '@/utils/emitter';
import { useFetchTemplateWorkouts } from '@/hooks/workoutTemplateHook';
import { useCreateTemplateWorkoutGroup } from '@/hooks/workoutTemplateGroupHook';
import Routine from '@/screens/Routine';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateHook', () => ({
  useFetchTemplateWorkouts: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateGroupHook', () => ({
  useCreateTemplateWorkoutGroup: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    emit: jest.fn(),
    addListener: jest.fn().mockImplementation((event, callback) => {
      if (
        event === 'routineAdded' ||
        event === 'routineRenamed' ||
        event === 'routineDeleted'
      ) {
        callback();
      }
    }),
    removeListener: jest.fn(),
  },
}));

global.alert = jest.fn();

describe('Routine', () => {
  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    });

    (useFetchTemplateWorkouts as jest.Mock).mockResolvedValue({
      data: [
        {
          groupId: 1,
          groupName: 'Mi grupo',
          routines: [
            {
              templateId: 1,
              myRoutineName: 'Rutina 1',
              myRoutineExercises: 'Sentadillas, flexiones',
            },
            {
              templateId: 1,
              myRoutineName: 'Rutina 2',
              myRoutineExercises: 'Abdominales, flexiones',
            },
          ],
        },
      ],
      error: null,
    });

    (useCreateTemplateWorkoutGroup as jest.Mock).mockResolvedValue({
      error: null,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería renderizar el componente correctamente', async () => {
    const { getByText } = render(<Routine />);

    expect(getByText('Rutinas')).toBeTruthy();
    expect(getByText('Nueva Rutina')).toBeTruthy();
    expect(getByText('Nueva Carpeta')).toBeTruthy();
  });

  it('debería obtener las rutinas y mostrarlas', async () => {
    const { getByText } = render(<Routine />);

    await waitFor(() =>
      expect(useFetchTemplateWorkouts).toHaveBeenCalledTimes(8)
    );
    expect(getByText('Rutina 1')).toBeTruthy();
    expect(getByText('Rutina 2')).toBeTruthy();
  });

  it('debería navegar a AddRoutine cuando se pulsa "Nueva Rutina"', async () => {
    const navigateMock = useNavigation().navigate;
    const { getByText } = render(<Routine />);

    const newRoutineButton = getByText('Nueva Rutina');
    fireEvent.press(newRoutineButton);

    expect(navigateMock).toHaveBeenCalledWith('AddRoutine', {
      exercises: [],
      groupId: 0,
    });
  });

  it('debería mostrar el modal de nueva carpeta', () => {
    const { getByText } = render(<Routine />);

    const newFolderButton = getByText('Nueva Carpeta');
    fireEvent.press(newFolderButton);

    expect(getByText('Crear nueva carpeta')).toBeTruthy();
  });

  it('´debería aparecer la nueva carpeta cuando se crea', async () => {
    const { getByText, getByPlaceholderText } = render(<Routine />);

    const newFolderButton = getByText('Nueva Carpeta');
    fireEvent.press(newFolderButton);

    const inputField = getByPlaceholderText('Nueva carpeta');
    fireEvent.changeText(inputField, 'New Group');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() =>
      expect(useCreateTemplateWorkoutGroup).toHaveBeenCalledWith('New Group')
    );
  });

  it('debería mostrar un alert cuando se añade una rutina, se elimina o se edita correctamente', async () => {
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});

    render(<Routine />);

    await waitFor(() => expect(emitter.addListener).toHaveBeenCalledTimes(36));

    emitter.emit('routineAdded');
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('¡Rutina creada correctamente!');
    });

    emitter.emit('routineDeleted');
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('¡Rutina eliminada correctamente!');
    });

    emitter.emit('routineRenamed');
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('¡Rutina editada correctamente!');
    });

    alertSpy.mockRestore();
  });

  it('debería cerrarse el modal de nueva carpeta si se pulsa "Cancelar"', async () => {
    const { getByText } = render(<Routine />);

    const newFolderButton = getByText('Nueva Carpeta');
    await act(async () => {
      fireEvent.press(newFolderButton);
    });

    const cancelButton = getByText('Cancelar');
    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(getByText('Rutina 1')).toBeTruthy();
    expect(getByText('Rutina 2')).toBeTruthy();
  });

  it('debería aparecer un alert cuando se intenta guardar un nombre de carpeta vacío', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const { getByText, getByPlaceholderText } = render(<Routine />);

    const newFolderButton = getByText('Nueva Carpeta');
    fireEvent.press(newFolderButton);

    const inputField = getByPlaceholderText('Nueva carpeta');
    fireEvent.changeText(inputField, '');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Por favor, introduce un nombre para la nueva carpeta.'
      );
    });
  });

  it('debería aparecer un alert cuando no se añade la nueva carpeta correctamente', async () => {
    (useCreateTemplateWorkoutGroup as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText, getByPlaceholderText } = render(<Routine />);

    const newFolderButton = getByText('Nueva Carpeta');
    fireEvent.press(newFolderButton);

    const inputField = getByPlaceholderText('Nueva carpeta');
    fireEvent.changeText(inputField, 'Nuevo nombre');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Se ha producido un error al crear el nuevo grupo.'
      );
    });
  });

  it('debería aparecer un alert cuando no se obtienen las rutinas correctamente', async () => {
    (useFetchTemplateWorkouts as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<Routine />);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Se ha producido un error al obtener las rutinas.'
      );
    });

    (global.alert as jest.Mock).mockRestore();
  });
});
