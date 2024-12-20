import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutDivisionComponent, {
  ExerciseProportion,
} from '@/components/workout/WorkoutDivision';

describe('WorkoutDivisionComponent', () => {
  it('debería renderizar correctamente el nombre y proporción de cada ejercicio', () => {
    const mockData: ExerciseProportion[] = [
      { name: 'Exercise 1', proportion: 50 },
      { name: 'Exercise 2', proportion: 30 },
      { name: 'Exercise 3', proportion: 20 },
    ];

    const { getByText } = render(
      <WorkoutDivisionComponent exercisesProportion={mockData} />
    );

    mockData.forEach((exercise) => {
      expect(getByText(exercise.name)).toBeTruthy();
      expect(getByText(`${exercise.proportion}%`)).toBeTruthy();
    });
  });

  it('debería renderizar correctamente cuando no se proporcionan ejercicios', () => {
    const { queryByText } = render(
      <WorkoutDivisionComponent exercisesProportion={[]} />
    );

    expect(queryByText(/Exercise/)).toBeNull();
  });
});
