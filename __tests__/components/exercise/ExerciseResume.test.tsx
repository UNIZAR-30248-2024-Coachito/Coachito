import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ExerciseResumeComponent, {
  ExerciseResumeRef,
} from '@/components/exercise/ExerciseResume';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

describe('ExerciseResumeComponent', () => {
  const mockData: ExerciseResume = {
    id: 1,
    name: 'Sentadillas',
    thumbnailUrl: 'https://example.com/image.jpg',
    restTime: null,
    notes: 'Notas',
    primaryMuscleGroup: 'Cuádriceps',
    sets: [
      { weight: 50, reps: 10 },
      { weight: 55, reps: 12 },
    ],
  };

  const mockRef = React.createRef<ExerciseResumeRef>();

  it('debería renderizar correctamente la información del ejercicio', () => {
    const { getByText, getByTestId, getByDisplayValue } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    expect(getByText('Sentadillas')).toBeTruthy();

    const textareaInput = getByTestId('text-area-input');
    expect(textareaInput.props.value).toBe('Notas');
    expect(getByText('Temporizador de descanso: DESACTIVADO')).toBeTruthy();
    mockData.sets?.forEach((set, index) => {
      expect(getByText(`${index + 1}`)).toBeTruthy();
      expect(getByDisplayValue(set.weight.toString())).toBeTruthy();
      expect(getByDisplayValue(set.reps.toString())).toBeTruthy();
    });
  });

  it('debería agregar una nueva serie al presionar "Agregar Serie"', () => {
    const { getByText, getAllByTestId } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const addButton = getByText('Agregar Serie');
    fireEvent.press(addButton);

    const rows = getAllByTestId('table-row');
    expect(rows.length).toBe(mockData.sets && mockData.sets.length + 1);
  });

  it('debería aparecer un set cuando sets es null', () => {
    const mockDataWithRestTime = {
      ...mockData,
      sets: null,
    };

    const { getAllByTestId } = render(
      <ExerciseResumeComponent {...mockDataWithRestTime} />
    );

    const rows = getAllByTestId('table-row');
    expect(rows.length).toBe(1);
  });

  it('debería eliminar una serie al presionar el botón de eliminar (trash)', async () => {
    const { getAllByTestId, getByText } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    await waitFor(() => fireEvent.press(getByText('Agregar Serie')));

    const deleteButton = getAllByTestId('trash')[0];
    fireEvent.press(deleteButton);

    expect(getAllByTestId('trash').length).toBe(1);
  });

  it('debería mostrar el modal de temporizador cuando se presiona el botón de temporizador', () => {
    const { getByTestId, getByText } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const timerButton = getByTestId('temporizador');
    fireEvent.press(timerButton);

    expect(getByText('0 min 0 s')).toBeTruthy();
  });

  it('debería cambiar el valor de un set cuando se edite el peso o las repeticiones', () => {
    const { getAllByTestId } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const inputWeight = getAllByTestId('weight')[0];
    const inputReps = getAllByTestId('reps')[0];

    fireEvent.changeText(inputWeight, '60');
    fireEvent.changeText(inputReps, '15');

    expect(inputWeight.props.value).toBe('60');
    expect(inputReps.props.value).toBe('15');

    fireEvent.changeText(inputWeight, '60');
    fireEvent.changeText(inputReps, '15');
  });

  it('debería cambiar el valor de las notas cuando se editan', () => {
    const { getByTestId } = render(<ExerciseResumeComponent {...mockData} />);

    const textareaInput = getByTestId('text-area-input');
    expect(textareaInput.props.value).toBe('Notas');

    fireEvent.changeText(textareaInput, 'Otras notas');

    expect(textareaInput.props.value).toBe('Otras notas');
  });

  it('debería exponer correctamente los datos del ejercicio a través de la referencia cuando hay restTime', () => {
    const mockDataWithRestTime = {
      ...mockData,
      restTime: '2min',
    };

    render(<ExerciseResumeComponent ref={mockRef} {...mockDataWithRestTime} />);

    const exerciseData = mockRef.current?.getExerciseData();

    expect(exerciseData).toEqual({
      id: 1,
      name: 'Sentadillas',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: '2min',
      notes: 'Notas',
      primaryMuscleGroup: 'Cuádriceps',
      targetReps: 0,
      sets: [
        { weight: 60, reps: 15 },
        { weight: 55, reps: 12 },
      ],
    });
  });

  it('debería exponer correctamente los datos del ejercicio a través de la referencia cuando no hay restTime', () => {
    render(<ExerciseResumeComponent ref={mockRef} {...mockData} />);

    const exerciseData = mockRef.current?.getExerciseData();

    expect(exerciseData).toEqual({
      id: 1,
      name: 'Sentadillas',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: '0',
      notes: 'Notas',
      primaryMuscleGroup: 'Cuádriceps',
      targetReps: 0,
      sets: [
        { weight: 60, reps: 15 },
        { weight: 55, reps: 12 },
      ],
    });
  });

  it('debería actualizar el tiempo de descanso cuando se cambia el valor del slider', () => {
    const { getByTestId, getByText } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const timerButton = getByTestId('temporizador');
    fireEvent.press(timerButton);

    const slider = getByTestId('slider');
    fireEvent(slider, 'valueChange', 150);

    expect(getByText('2 min 30 s')).toBeTruthy();
  });

  it('debería cerrar el modal del slider al presionar el botón "Confirmar"', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const timerButton = getByTestId('temporizador');
    fireEvent.press(timerButton);

    const slider = getByTestId('slider');
    fireEvent(slider, 'valueChange', 150);

    const confirmButton = getByText('Confirmar');
    fireEvent.press(confirmButton);

    expect(queryByTestId('slider')).toBeNull();
  });

  it('debería ajustar el peso a los límites definidos', () => {
    const { getAllByTestId } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const inputWeight = getAllByTestId('weight')[0];
    fireEvent.changeText(inputWeight, '600');
    expect(inputWeight.props.value).toBe('499');
  });

  it('debería ajustar las repeticiones a los límites definidos', () => {
    const { getAllByTestId } = render(
      <ExerciseResumeComponent {...mockData} />
    );

    const inputReps = getAllByTestId('reps')[0];
    fireEvent.changeText(inputReps, '150');
    expect(inputReps.props.value).toBe('99');
  });

  it('debería garantizar que siempre haya entre 1 y 10 series', async () => {
    const {
      getByText,
      getAllByTestId,
      queryAllByTestId,
      queryByText,
      queryByTestId,
    } = render(<ExerciseResumeComponent {...mockData} />);

    let rows = getAllByTestId('table-row');
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows.length).toBeLessThanOrEqual(10);

    for (let i = 0; i < 8; i++) {
      const addButton = getByText('Agregar Serie');
      fireEvent.press(addButton);
    }
    rows = getAllByTestId('table-row');
    expect(rows.length).toBe(10);
    expect(queryByText('Agregar Serie')).toBeNull();

    for (let i = 0; i < 9; i++) {
      fireEvent.press(queryAllByTestId('trash')[0]);
    }
    expect(queryByTestId('trash')).toBeNull();
    rows = getAllByTestId('table-row');
    expect(rows.length).toBe(1);
  });

  it('debería garantizar que las notas no superen los 4000 caracteres', () => {
    const { getByTestId } = render(<ExerciseResumeComponent {...mockData} />);

    const textareaInput = getByTestId('text-area-input');

    expect(textareaInput.props.value.length).toBeLessThanOrEqual(4000);

    const longText = 'a'.repeat(4001);
    fireEvent.changeText(textareaInput, longText);

    expect(textareaInput.props.value.length).toBe(4000);
  });
});
