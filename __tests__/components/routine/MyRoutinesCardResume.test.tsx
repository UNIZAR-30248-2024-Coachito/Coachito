import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MyRoutinesCardResumeComponent from '@/components/routine/MyRoutinesCardResume';
import { emitter } from '@/utils/emitter';

jest.mock('../../../styles.css', () => ({}));

jest.mock('@/hooks/workoutTemplateHook', () => ({
  useDeleteWorkoutTemplate: jest.fn().mockResolvedValue({ error: null }),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: {
    emit: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('MyRoutinesCardResumeComponent', () => {
  const routineCardResume = {
    templateId: 1,
    myRoutineName: 'Rutina de Prueba',
    myRoutineExercises: 'Ejercicio 1, Ejercicio 2',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería navegar a la pantalla de detalles de la rutina al presionar el card', () => {
    const { getByText } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const routineCard = getByText('Rutina de Prueba');
    fireEvent.press(routineCard);

    expect(mockNavigate).toHaveBeenCalledWith('DetailsRoutine', {
      templateId: routineCardResume.templateId,
      myRoutineName: routineCardResume.myRoutineName,
    });
  });

  it('debería mostrar el modal de opciones al presionar el botón de más', () => {
    const { getByText, getByTestId } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    expect(getByText('Editar Rutina')).toBeTruthy();
    expect(getByText('Eliminar Rutina')).toBeTruthy();
  });

  it('debería navegar a la pantalla de editar rutina al presionar "Editar Rutina"', () => {
    const { getByText, getByTestId } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const editButton = getByText('Editar Rutina');
    fireEvent.press(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('EditRoutine', {
      routineId: routineCardResume.templateId,
      routineName: routineCardResume.myRoutineName,
    });
  });

  it('debería mostrar el modal de confirmación de eliminación al presionar "Eliminar Rutina"', () => {
    const { getByText, getByTestId } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Rutina');
    fireEvent.press(deleteButton);

    expect(
      getByText('¿Está seguro de que quiere eliminar la rutina?')
    ).toBeTruthy();
  });

  it('debería eliminar la rutina correctamente cuando se confirma la eliminación', async () => {
    const { getByText, getByTestId, queryByText } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Rutina');
    fireEvent.press(deleteButton);

    const confirmDeleteButton = getByText('Eliminar rutina');
    fireEvent.press(confirmDeleteButton);

    await waitFor(() => expect(queryByText('Eliminar rutina')).toBeNull());
    expect(emitter.emit).toHaveBeenCalledWith('routineDeleted');
  });

  it('debería no eliminar la rutina si se cancela la eliminación', async () => {
    const { getByText, getByTestId } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const moreButton = getByTestId('slideup-modal');
    fireEvent.press(moreButton);

    const deleteButton = getByText('Eliminar Rutina');
    fireEvent.press(deleteButton);

    const cancelDeleteButton = getByText('Cancelar');
    fireEvent.press(cancelDeleteButton);

    expect(emitter.emit).not.toHaveBeenCalled();
  });

  it('debería navegar a la pantalla de empezar entrenamiento al presionar "Empezar Entrenamiento"', () => {
    const { getByText } = render(
      <MyRoutinesCardResumeComponent routineCardResume={routineCardResume} />
    );

    const startButton = getByText('Empezar Entrenamiento');
    fireEvent.press(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('StartWorkout', {
      routineId: routineCardResume.templateId,
      routineName: routineCardResume.myRoutineName,
    });
  });
});
