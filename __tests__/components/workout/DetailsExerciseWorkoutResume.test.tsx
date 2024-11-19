import DetailsExerciseWorkoutResumeComponent, {
  ExerciseResumeRef,
} from '@/components/workout/DetailsExerciseWorkoutResume';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Vibration } from 'react-native';

jest.useFakeTimers();

jest.mock('../../../styles.css', () => ({}));

describe('DetailsExerciseWorkoutResumeComponent', () => {
  const mockData = {
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

  it('debería renderizar correctamente los elementos del ejercicio', () => {
    const { getByText, getByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    expect(getByText('Sentadillas')).toBeTruthy();
    const textareaInput = getByTestId('text-area-input');
    expect(textareaInput.props.value).toBe('Notas');
    expect(getByText('Temporizador de descanso: DESACTIVADO')).toBeTruthy();
    expect(getByText('Agregar Serie')).toBeTruthy();
  });

  it('debería agregar un nuevo set al hacer clic en "Agregar Serie"', () => {
    const { getByText, getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const addButton = getByText('Agregar Serie');
    fireEvent.press(addButton);

    const rows = getAllByTestId('table-row');
    expect(rows.length).toBe(mockData.sets.length + 1);
  });

  it('debería aparecer un set cuando sets es null', () => {
    const mockDataWithoutSets = {
      ...mockData,
      sets: null,
    };

    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockDataWithoutSets} />
    );

    const rows = getAllByTestId('table-row');
    expect(rows.length).toBe(1);
  });

  it('debería mostrar el modal del temporizador cuando se presiona el botón de temporizador', async () => {
    const mockDataWithRestTime = {
      ...mockData,
      restTime: '00:01:30',
    };
    const { getByText, getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockDataWithRestTime} />
    );

    const startButton = getAllByTestId('start-timer')[0];
    fireEvent.press(startButton);

    await waitFor(() => expect(getByText('1 min 29 s')).toBeTruthy());
  });

  it('debería cambiar el valor de un set cuando se edite el peso o las repeticiones', () => {
    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const inputWeight = getAllByTestId('weight')[0];
    const inputReps = getAllByTestId('reps')[0];

    fireEvent.changeText(inputWeight, '60');
    fireEvent.changeText(inputReps, '15');

    expect(inputWeight.props.placeholder).toBe('60');
    expect(inputReps.props.placeholder).toBe('15');

    fireEvent.changeText(inputWeight, '60');
    fireEvent.changeText(inputReps, '15');
  });

  it('debería cambiar el valor de las notas cuando se editan', () => {
    const { getByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const textareaInput = getByTestId('text-area-input');
    expect(textareaInput.props.value).toBe('Notas');

    fireEvent.changeText(textareaInput, 'Otras notas');

    expect(textareaInput.props.value).toBe('Otras notas');
  });

  it('debería exponer correctamente los datos del ejercicio a través de la referencia cuando hay restTime', () => {
    const mockDataWithRestTime = {
      ...mockData,
      restTime: '00:01:00',
    };

    render(
      <DetailsExerciseWorkoutResumeComponent
        ref={mockRef}
        {...mockDataWithRestTime}
      />
    );

    const exerciseData = mockRef.current?.getExerciseData();

    expect(exerciseData).toEqual({
      id: 1,
      name: 'Sentadillas',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: '1min',
      notes: 'Notas',
      primaryMuscleGroup: 'Cuádriceps',
      sets: [
        { weight: 60, reps: 15 },
        { weight: 55, reps: 12 },
      ],
    });
  });

  it('debería exponer correctamente los datos del ejercicio a través de la referencia cuando no hay restTime', () => {
    render(
      <DetailsExerciseWorkoutResumeComponent ref={mockRef} {...mockData} />
    );

    const exerciseData = mockRef.current?.getExerciseData();

    expect(exerciseData).toEqual({
      id: 1,
      name: 'Sentadillas',
      thumbnailUrl: 'https://example.com/image.jpg',
      restTime: '0',
      notes: 'Notas',
      primaryMuscleGroup: 'Cuádriceps',
      sets: [
        { weight: 60, reps: 15 },
        { weight: 55, reps: 12 },
      ],
    });
  });

  it('debería resetear los sets a un solo set con peso 0 y repeticiones 0 cuando se llame a resetToOneSet', () => {
    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent ref={mockRef} {...mockData} />
    );

    const rowsBeforeReset = getAllByTestId('table-row');
    expect(rowsBeforeReset.length).toBe(mockData.sets.length);

    mockRef.current?.resetToOneSet();

    const rowsAfterReset = getAllByTestId('table-row');
    expect(rowsAfterReset.length).toBe(1);

    const setWeight = getAllByTestId('weight')[0].props.placeholder;
    const setReps = getAllByTestId('reps')[0].props.placeholder;

    expect(setWeight).toBe('0');
    expect(setReps).toBe('0');
  });

  it('debería ocultar el modal y activar la vibración cuando se detiene el temporizador', async () => {
    const mockDataWithRestTime = {
      ...mockData,
      restTime: '00:00:02',
    };
    const { getByTestId, queryByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockDataWithRestTime} />
    );

    const startButton = getByTestId('start-timer');
    fireEvent.press(startButton);

    await waitFor(() => {
      expect(getByTestId('modal')).toBeTruthy();
    });

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(queryByTestId('modal')).toBeNull();
    });

    expect(Vibration.vibrate).toHaveBeenCalledTimes(1);
  });

  it('debería ajustar el peso a los límites definidos', () => {
    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const inputWeight = getAllByTestId('weight')[0];
    fireEvent.changeText(inputWeight, '600');
    expect(inputWeight.props.value).toBe('499');
  });

  it('debería ajustar las repeticiones a los límites definidos', () => {
    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const inputReps = getAllByTestId('reps')[0];
    fireEvent.changeText(inputReps, '150');
    expect(inputReps.props.value).toBe('99');
  });

  it('debería garantizar que las notas no superen los 4000 caracteres', () => {
    const { getByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockData} />
    );

    const textareaInput = getByTestId('text-area-input');

    expect(textareaInput.props.value.length).toBeLessThanOrEqual(4000);

    const longText = 'a'.repeat(4001);
    fireEvent.changeText(textareaInput, longText);

    expect(textareaInput.props.value.length).toBe(4000);
  });
});
