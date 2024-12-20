import ExercisesListCardResume from '@/components/exercise/ExercisesListCardResume';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('ExercisesListCardResume', () => {
  const mockProps = {
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

  it('debería renderizar el nombre del ejercicio correctamente', () => {
    const { getByText } = render(<ExercisesListCardResume {...mockProps} />);

    expect(getByText('Sentadillas')).toBeTruthy();
  });

  it('debería renderizar el grupo muscular correctamente', () => {
    const { getByText } = render(<ExercisesListCardResume {...mockProps} />);

    expect(getByText('Cuádriceps')).toBeTruthy();
  });
});
