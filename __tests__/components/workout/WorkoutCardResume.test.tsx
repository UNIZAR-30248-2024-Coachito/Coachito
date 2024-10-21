import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutCardResumeComponent from '../../../components/workout/WorkoutCardResume';
import { WorkoutExercisesResume } from '@/components/workout/WorkoutExerciseResume';
import { WorkoutHeaderResume } from '@/components/workout/WorkoutHeaderResume';
import { Text } from '../../../components/ui/text';

const mockTextElement = (text: string) => {
  return <Text>{text}</Text>;
};

jest.mock('../../../styles.css', () => ({}));

jest.mock(
  '../../../components/workout/WorkoutHeaderResume',
  () => (props: WorkoutHeaderResume) => mockTextElement(props.workoutName)
);

jest.mock(
  '../../../components/workout/WorkoutExerciseResume',
  () => (props: WorkoutExercisesResume) =>
    mockTextElement(props.exercises[0]?.exerciseName)
);

describe('WorkoutCardResumeComponent', () => {
  const mockHeaderResume = {
    workoutName: 'Test Workout',
    workoutDate: new Date('2024-10-13'),
    workoutTime: 30,
    workoutVolume: 1500,
    workoutSeries: 3,
  };

  const mockExercisesResume = {
    exercises: [
      {
        exerciseName: 'Push Up',
        exerciseThumbnailUrl: 'http://example.com/pushup.png',
        series: 3,
      },
    ],
  };

  it('should render the WorkoutCardResumeComponent correctly', () => {
    const { getByText } = render(
      <WorkoutCardResumeComponent
        workoutHeaderResume={mockHeaderResume}
        workoutExercisesResume={mockExercisesResume}
      />
    );

    expect(getByText('Test Workout')).toBeTruthy();

    expect(getByText('Push Up')).toBeTruthy();
  });
});
