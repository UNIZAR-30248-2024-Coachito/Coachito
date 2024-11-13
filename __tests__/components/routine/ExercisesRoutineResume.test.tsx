import ExercisesRoutineResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExercisesRoutineResume';
import { useNavigation } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

jest.mock('../../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('ExercisesRoutineResumeComponent', () => {
  const mockExercise: ExerciseResume = {
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

  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  it('debería navegar a la pantalla de detalles cuando se presiona el componente', () => {
    const { getByTestId } = render(
      <ExercisesRoutineResumeComponent {...mockExercise} />
    );

    const pressable = getByTestId('ver-detalles');
    fireEvent.press(pressable);

    expect(mockNavigate).toHaveBeenCalledWith('DetailsExercise', {
      exerciseId: 1,
    });
  });

  it('debería mostrar el nombre del ejercicio correctamente', () => {
    const { getByText } = render(
      <ExercisesRoutineResumeComponent {...mockExercise} />
    );

    expect(getByText(mockExercise.name)).toBeTruthy();
  });

  it('debería mostrar correctamente las series con sus pesos y repeticiones', () => {
    const { getByText } = render(
      <ExercisesRoutineResumeComponent {...mockExercise} />
    );

    mockExercise.sets?.forEach((set, index) => {
      expect(getByText((index + 1).toString())).toBeTruthy();
      expect(getByText(set.weight.toString())).toBeTruthy();
      expect(getByText(set.reps.toString())).toBeTruthy();
    });
  });

  it('debería mostrar el temporizador de descanso correctamente', () => {
    const { getByText } = render(
      <ExercisesRoutineResumeComponent {...mockExercise} />
    );

    expect(getByText('Temporizador de descanso: DESACTIVADO')).toBeTruthy();
  });

  it('debería renderizar correctamente el texto de notas', () => {
    const { getByText } = render(
      <ExercisesRoutineResumeComponent {...mockExercise} />
    );

    expect(getByText(mockExercise.notes)).toBeTruthy();
  });
});
