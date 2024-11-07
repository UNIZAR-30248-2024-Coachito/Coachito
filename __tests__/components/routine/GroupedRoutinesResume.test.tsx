import GroupedRoutinesResumeComponent, {
  GroupedRoutines,
} from '@/components/routine/GroupedRoutinesResume';
import {
  useDeleteTemplateWorkoutGroupById,
  useEditTemplateWorkoutGroup,
} from '@/hooks/workoutTemplateGroupHook';
import { emitter } from '@/utils/emitter';
import { useNavigation } from '@react-navigation/native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

jest.mock('../../../styles.css', () => ({}));

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

    const { getByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const addButton = getByText('Agregar nueva rutina');
    fireEvent.press(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('AddRoutine', {
      exercises: [],
      groupId: mockGroupedRoutine.groupId,
    });
  });

  it('debería mostrar el modal para renombrar la carpeta', () => {
    const { getByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    expect(getByText('Nuevo nombre de la carpeta')).toBeTruthy();
  });

  it('debería mostrar el modal para eliminar la carpeta', () => {
    const { getByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Carpeta');
    fireEvent.press(deleteButton);

    expect(
      getByText('¿Está seguro de que quiere eliminar la carpeta?')
    ).toBeTruthy();
  });

  it('debería eliminar el grupo cuando se confirma en el modal de eliminación', async () => {
    const { getByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
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
    expect(emitter.emit).toHaveBeenCalledWith('routineDeleted');
  });

  it('debería renombrar el grupo cuando se guarda el nuevo nombre', async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
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
    expect(emitter.emit).toHaveBeenCalledWith('routineRenamed');
  });

  it('debería mostrar un alert si el nombre de la carpeta está vacío', () => {
    const alertMock = jest.fn();
    global.alert = alertMock;

    const { getByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const renameButton = getByText('Renombrar Carpeta');
    fireEvent.press(renameButton);

    const input = getByPlaceholderText('Nuevo nombre');
    fireEvent.changeText(input, '');

    const saveButton = getByText('Guardar');
    fireEvent.press(saveButton);

    expect(alertMock).toHaveBeenCalledWith(
      'Por favor, introduce un nombre para la nueva carpeta.'
    );

    global.alert = jest.fn();
  });

  it('debería cerrar el modal de renombrar cuando se presiona el botón Cancelar', async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
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
    const { getByTestId, getByText } = render(
      <GroupedRoutinesResumeComponent groupedRoutine={mockGroupedRoutine} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const renameButton = getByText('Eliminar Carpeta');
    fireEvent.press(renameButton);

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
});
