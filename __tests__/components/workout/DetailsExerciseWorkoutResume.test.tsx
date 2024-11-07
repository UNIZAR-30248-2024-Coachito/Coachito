import DetailsExerciseWorkoutResumeComponent, {
  ExerciseResumeRef,
} from '@/components/workout/DetailsExerciseWorkoutResume';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from '../../../components/ui/text';

const mockTimerElement = () => {
  return <Text>Temporizador Simulado</Text>;
};
jest.useFakeTimers();

jest.mock('../../../styles.css', () => ({}));
jest.mock('../../../components/workout/CountDownTimer', () => {
  return jest.fn(() => mockTimerElement());
});

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
    const mockDataWithRestTime = {
      ...mockData,
      sets: null,
    };

    const { getAllByTestId } = render(
      <DetailsExerciseWorkoutResumeComponent {...mockDataWithRestTime} />
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

    const startButton = getAllByTestId('check')[0];
    fireEvent.press(startButton);

    await waitFor(() =>
      expect(getByText('Temporizador Simulado')).toBeTruthy()
    );
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

  it('debe exponer correctamente los datos del ejercicio a través de la referencia cuando hay restTime', () => {
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
      restTime: '1',
      notes: 'Notas',
      primaryMuscleGroup: 'Cuádriceps',
      sets: [
        { weight: 60, reps: 15 },
        { weight: 55, reps: 12 },
      ],
    });
  });

  it('debe exponer correctamente los datos del ejercicio a través de la referencia cuando no hay restTime', () => {
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
});
