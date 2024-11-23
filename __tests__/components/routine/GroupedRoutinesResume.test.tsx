import GroupedRoutinesResumeComponent, {
  GroupedRoutines,
} from '@/components/routine/GroupedRoutinesResume';
import {
  useDeleteTemplateWorkoutGroupById,
  useEditTemplateWorkoutGroup,
} from '@/hooks/workoutTemplateGroupHook';
import { emitter } from '@/utils/emitter';
import { useNavigation } from '@react-navigation/native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateGroupHook', () => ({
  useDeleteTemplateWorkoutGroupById: jest.fn(),
  useEditTemplateWorkoutGroup: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: { emit: jest.fn() },
}));

Alert.alert = jest.fn();

describe('GroupedRoutinesResumeComponent', () => {
  const mockGroupedRoutine: GroupedRoutines = {
    groupId: 1,
    groupName: 'Mi Grupo',
    routines: [
      {
        templateId: 1,
        myRoutineName: 'Rutina 1',
        myRoutineExercises: 'Sentadillas, flexiones, peso muerto',
      },
      {
        templateId: 2,
        myRoutineName: 'Rutina 2',
        myRoutineExercises: 'Sentadillas, toques de talón',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() });
    (useDeleteTemplateWorkoutGroupById as jest.Mock).mockResolvedValue({
      error: null,
    });
    (useEditTemplateWorkoutGroup as jest.Mock).mockResolvedValue({
      error: null,
    });
  });

  it('debería mostrar el nombre del grupo y la cantidad de rutinas', () => {
    const { getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    expect(getByText('Mi Grupo (2)')).toBeTruthy();
  });

  it('debería mostrar y ocultar las rutinas cuando se presiona el botón de mostrar/ocultar', () => {
    const { getByText, queryByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    expect(getByText('Rutina 1')).toBeTruthy();
    expect(getByText('Rutina 2')).toBeTruthy();

    const toggleButton = getByText('Mi Grupo (2)');
    fireEvent.press(toggleButton);

    expect(queryByText('Rutina 1')).toBeNull();
    expect(queryByText('Rutina 2')).toBeNull();
  });

  it('debería navegar a la pantalla "AddRoutine" cuando se presiona el botón de agregar nueva rutina', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const { getAllByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const addButton = getByText('Agregar nueva rutina');
    fireEvent.press(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('AddRoutine', {
      exercises: [],
      groupId: mockGroupedRoutine.groupId,
    });
  });

  it('debería mostrar el modal para renombrar la carpeta', () => {
    const { getAllByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    expect(getByText('Nuevo nombre de la carpeta')).toBeTruthy();
  });

  it('debería mostrar el modal para eliminar la carpeta', () => {
    const { getAllByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Carpeta');
    fireEvent.press(deleteButton);

    expect(
      getByText('¿Está seguro de que quiere eliminar la carpeta?')
    ).toBeTruthy();
  });

  it('debería eliminar el grupo cuando se confirma en el modal de eliminación', async () => {
    const { getAllByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Carpeta');
    fireEvent.press(deleteButton);

    const confirmDeleteButton = getByText('Eliminar carpeta');
    fireEvent.press(confirmDeleteButton);

    await waitFor(() =>
      expect(useDeleteTemplateWorkoutGroupById).toHaveBeenCalledWith(
        mockGroupedRoutine.groupId
      )
    );
    expect(emitter.emit).toHaveBeenCalledWith('groupDeleted');
  });

  it('debería renombrar el grupo cuando se guarda el nuevo nombre', async () => {
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    const input = getByPlaceholderText('Nuevo nombre');
    fireEvent.changeText(input, 'Nuevo Grupo');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    await waitFor(() =>
      expect(useEditTemplateWorkoutGroup).toHaveBeenCalledWith(
        mockGroupedRoutine.groupId,
        'Nuevo Grupo'
      )
    );
    expect(emitter.emit).toHaveBeenCalledWith('groupRenamed');
  });

  it('debería mostrar un alert si el nombre de la carpeta está vacío', async () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    const input = getByPlaceholderText('Nuevo nombre');
    fireEvent.changeText(input, '');

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'Por favor, introduce un nombre para la nueva carpeta.',
      [{ text: 'OK' }]
    );
  });

  it('debería cerrar el modal de renombrar cuando se presiona el botón Cancelar', async () => {
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    const input = getByPlaceholderText('Nuevo nombre');
    fireEvent.changeText(input, 'Nuevo Grupo');

    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);

    expect(getByText('Mi Grupo (2)')).toBeTruthy();
  });

  it('debería cerrar el modal de eliminación cuando se presiona el botón Cancelar', async () => {
    const { getAllByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Carpeta');
    fireEvent.press(deleteButton);

    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);

    expect(getByText('Mi Grupo (2)')).toBeTruthy();
  });

  it('debería mostrar "Mis Rutinas" y 0 cuando no hay un groupName', () => {
    const groupedRoutine = {
      groupId: 1,
      groupName: null,
      routines: [],
    };

    const { getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={groupedRoutine} />
    );

    expect(getByText('Mis Rutinas (0)')).toBeTruthy();
  });

  it('debería mostrar un error si la eliminación de la carpeta falla', async () => {
    (useDeleteTemplateWorkoutGroupById as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getAllByTestId, getByText, getByTestId } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Carpeta');
    fireEvent.press(deleteButton);

    const finalDeleteButton = getByTestId('delete-button');
    await act(async () => {
      fireEvent.press(finalDeleteButton);
    });

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'Se ha producido un error eliminando la carpeta.',
      [{ text: 'OK' }]
    );

    alertMock.mockRestore();
  });

  it('debería mostrar un error si el renombrar la carpeta falla', async () => {
    (useEditTemplateWorkoutGroup as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getAllByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    const input = getByPlaceholderText('Nuevo nombre');
    fireEvent.changeText(input, 'Nuevo Grupo');

    const saveButton = getByText('Guardar');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'Se ha producido un error al renombrar la carpeta.',
      [{ text: 'OK' }]
    );

    expect(mockGroupedRoutine.groupName).toBe('Mi Grupo');

    alertMock.mockRestore();
  });

  it('debería mostrar una alerta cuando se intenta agregar más de 7 rutinas', async () => {
    const mockGroupedRoutine: GroupedRoutines = {
      groupId: 1,
      groupName: 'Mi Grupo',
      routines: [
        {
          templateId: 1,
          myRoutineName: 'Rutina 1',
          myRoutineExercises: 'Sentadillas, flexiones, peso muerto',
        },
        {
          templateId: 2,
          myRoutineName: 'Rutina 2',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
        {
          templateId: 3,
          myRoutineName: 'Rutina 3',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
        {
          templateId: 4,
          myRoutineName: 'Rutina 4',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
        {
          templateId: 5,
          myRoutineName: 'Rutina 5',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
        {
          templateId: 6,
          myRoutineName: 'Rutina 6',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
        {
          templateId: 7,
          myRoutineName: 'Rutina 7',
          myRoutineExercises: 'Sentadillas, toques de talón',
        },
      ],
    };

    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getAllByTestId } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getAllByTestId('slideup-modal')[0];
    fireEvent.press(moreButton);

    const addButton = getByText('Agregar nueva rutina');
    fireEvent.press(addButton);

    expect(alertMock).toHaveBeenCalledWith(
      '',
      'No puede añadir más de 7 rutinas por carpeta.',
      [{ text: 'OK' }]
    );

    alertMock.mockRestore();
  });
});
