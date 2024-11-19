import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  useFetchDetailsLastWorkout,
  useFetchRoutineWorkouts,
} from '@/hooks/workoutHook';
import { useDeleteWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import { emitter } from '@/utils/emitter';
import DetailsRoutine from '@/screens/DetailsRoutine';
import { Alert } from 'react-native';

jest.mock('../../styles.css', () => ({}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: jest.fn(() => <></>),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('@/hooks/workoutHook', () => ({
  useFetchDetailsLastWorkout: jest.fn(),
  useFetchRoutineWorkouts: jest.fn(),
}));

jest.mock('@/hooks/workoutTemplateHook', () => ({
  useDeleteWorkoutTemplate: jest.fn(),
}));

jest.mock('@/utils/emitter', () => ({
  emitter: { emit: jest.fn() },
}));

Alert.alert = jest.fn();

describe('DetailsRoutine', () => {
  const mockRoutineData = {
    templateId: 1,
    myRoutineName: 'Rutina 1',
  };

  const mockChartData = [
    {
      dataTotal: '695 kg',
      dataPoints: [
        {
          label: '04 Nov.',
          value: 180,
        },
        {
          label: '07 Oct.',
          value: 515,
        },
      ],
    },
    {
      dataTotal: '158 reps',
      dataPoints: [
        {
          label: '04 Nov.',
          value: 55,
        },
        {
          label: '07 Oct.',
          value: 103,
        },
      ],
    },
    {
      dataTotal: '92 min',
      dataPoints: [
        {
          label: '04 Nov.',
          value: 2,
        },
        {
          label: '07 Oct.',
          value: 90,
        },
      ],
    },
  ];

  const mockExercises = [
    {
      id: 1,
      name: 'Flexiones',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: '00:01:30',
      notes: 'Nota 1',
      sets: [],
      primaryMuscleGroup: 'Pectorales',
    },
    {
      id: 2,
      name: 'Sentadillas',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: null,
      notes: 'Nota 2',
      sets: [],
      primaryMuscleGroup: 'Glúteos',
    },
  ];

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: mockRoutineData,
    });
    (useFetchRoutineWorkouts as jest.Mock).mockResolvedValue({
      data: mockChartData,
      error: null,
    });
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: mockExercises,
      error: null,
    });
    (useDeleteWorkoutTemplate as jest.Mock).mockResolvedValue({
      error: null,
    });
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    });
  });

  it('debería renderizar el nombre de la rutina y los ejercicios correctamente', async () => {
    const { getByText } = render(<DetailsRoutine />);

    await waitFor(() => {
      expect(getByText(mockRoutineData.myRoutineName)).toBeTruthy();
      expect(getByText('Flexiones')).toBeTruthy();
      expect(getByText('Sentadillas')).toBeTruthy();
    });
  });

  it('debería mostrar el gráfico con los detalles de la rutina', async () => {
    const { getByText } = render(<DetailsRoutine />);

    await waitFor(() => {
      expect(getByText('Volumen')).toBeTruthy();
      expect(getByText('Repeticiones')).toBeTruthy();
      expect(getByText('Duración')).toBeTruthy();
    });
  });

  it('debería navegar a la pantalla "StartWorkout" cuando se hace clic en el botón "Empezar Entrenamiento"', async () => {
    const { getByText } = render(<DetailsRoutine />);
    fireEvent.press(getByText('Empezar Entrenamiento'));

    await waitFor(() => {
      expect(useNavigation().navigate).toHaveBeenCalledWith('StartWorkout', {
        routineId: mockRoutineData.templateId,
        routineName: mockRoutineData.myRoutineName,
      });
    });
  });

  it('debería mostrar el modal para editar la rutina al hacer clic en el botón de más opciones', async () => {
    const { getByTestId, getAllByText, getByText } = render(<DetailsRoutine />);
    fireEvent.press(getByTestId('modal-button'));

    await waitFor(() => {
      expect(getAllByText('Editar rutina')[1]).toBeTruthy();
      expect(getByText('Borrar rutina')).toBeTruthy();
    });
  });

  it('debería abrir el modal de confirmación de eliminación cuando se hace clic en "Borrar rutina"', async () => {
    const { getByTestId, getByText } = render(<DetailsRoutine />);

    fireEvent.press(getByTestId('modal-button'));
    fireEvent.press(getByText('Borrar rutina'));

    await waitFor(() => {
      expect(
        getByText('¿Está seguro de que quiere borrar la rutina?')
      ).toBeTruthy();
    });
  });

  it('debería eliminar la rutina correctamente cuando se confirma', async () => {
    const { getByText, getByTestId } = render(<DetailsRoutine />);

    fireEvent.press(getByTestId('modal-button'));
    fireEvent.press(getByText('Borrar rutina'));
    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() => {
      expect(useDeleteWorkoutTemplate).toHaveBeenCalledWith(
        mockRoutineData.templateId
      );
      expect(emitter.emit).toHaveBeenCalledWith('routineDeleted');
    });
  });

  it('debería cancelar la eliminación de la rutina correctamente', async () => {
    const { getByText, getByTestId, queryByText } = render(<DetailsRoutine />);

    fireEvent.press(getByTestId('modal-button'));
    fireEvent.press(getByText('Borrar rutina'));
    fireEvent.press(getByText('Cancelar'));

    await waitFor(() => {
      expect(queryByText('Borrar rutina')).not.toBeTruthy();
    });
  });

  it('debería mostrar un error si la obtención de los datos de la gráfica falla', async () => {
    (useFetchRoutineWorkouts as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<DetailsRoutine />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error obteniendo los datos de la gráfica.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });

  it('debería mostrar un error si la obtención de los ejercicios falla', async () => {
    (useFetchDetailsLastWorkout as jest.Mock).mockResolvedValue({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<DetailsRoutine />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error obteniendo los ejercicios.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });

  it('debería mostrar un error si la eliminación de la rutina falla', async () => {
    (useDeleteWorkoutTemplate as jest.Mock).mockResolvedValue({
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText, getByTestId } = render(<DetailsRoutine />);

    fireEvent.press(getByTestId('modal-button'));
    fireEvent.press(getByText('Borrar rutina'));
    fireEvent.press(getByTestId('delete-button'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error al eliminar la rutina.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });

  it('debería navegar a EditRoutine con los parámetros correctos cuando se presiona el botón "Editar rutina"', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(<DetailsRoutine />);

    fireEvent.press(getByText('Editar rutina'));

    expect(mockNavigate).toHaveBeenCalledWith('EditRoutine', {
      routineId: mockRoutineData.templateId,
      routineName: mockRoutineData.myRoutineName,
    });
  });

  it('debería navegar a EditRoutine con los parámetros correctos cuando se presiona el botón "Editar rutina"del modal', () => {
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

    const { getAllByText, getByTestId } = render(<DetailsRoutine />);

    fireEvent.press(getByTestId('modal-button'));
    fireEvent.press(getAllByText('Editar rutina')[1]);

    expect(mockNavigate).toHaveBeenCalledWith('EditRoutine', {
      routineId: mockRoutineData.templateId,
      routineName: mockRoutineData.myRoutineName,
    });
  });
});
