import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutExercisesResumeComponent, {
  WorkoutExercisesResume,
} from '@/components/workout/WorkoutExerciseResume';

jest.mock('../../../styles.css', () => ({}));

jest.mock('../../../components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AvatarFallbackText: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  AvatarImage: () => <img alt="avatar" />,
}));

describe('WorkoutExercisesResumeComponent', () => {
  const mockExercises: WorkoutExercisesResume = {
    exercises: [
      {
        exerciseName: 'Push Up',
        exerciseThumbnailUrl: 'http://example.com/pushup.png',
        series: 3,
      },
      {
        exerciseName: 'Squat',
        exerciseThumbnailUrl: 'http://example.com/squat.png',
        series: 4,
      },
      {
        exerciseName: 'Deadlift',
        exerciseThumbnailUrl: 'http://example.com/deadlift.png',
        series: 2,
      },
      {
        exerciseName: 'Bench Press',
        exerciseThumbnailUrl: 'http://example.com/benchpress.png',
        series: 5,
      },
    ],
  };

  it('should render the training header correctly', () => {
    const { getByText } = render(
      <WorkoutExercisesResumeComponent {...mockExercises} />
    );

    expect(getByText('Entrenamiento')).toBeTruthy();
  });

  it('should render the visible exercises correctly', () => {
    const { getByText } = render(
      <WorkoutExercisesResumeComponent {...mockExercises} />
    );

    expect(getByText('3 series Push Up')).toBeTruthy();
    expect(getByText('4 series Squat')).toBeTruthy();
    expect(getByText('2 series Deadlift')).toBeTruthy();

    expect(() => getByText('5 series Bench Press')).toThrow();
  });

  it('should render the additional exercises message when there are more than 3 exercises', () => {
    const { getByText } = render(
      <WorkoutExercisesResumeComponent {...mockExercises} />
    );

    expect(getByText('Ver 1 ejercicios más')).toBeTruthy();
  });

  it('should not render the additional exercises message when there are 3 or fewer exercises', () => {
    const { queryByText } = render(
      <WorkoutExercisesResumeComponent
        exercises={[
          {
            exerciseName: 'Push Up',
            exerciseThumbnailUrl: 'http://example.com/pushup.png',
            series: 3,
          },
          {
            exerciseName: 'Squat',
            exerciseThumbnailUrl: 'http://example.com/squat.png',
            series: 4,
          },
        ]}
      />
    );

    expect(queryByText('Ver')).toBeNull();
  });
});
