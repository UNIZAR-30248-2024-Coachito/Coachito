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
    workoutId: 1,
    workoutName: 'Test Workout',
    workoutDate: '2024-11-05T12:27:23.909629+00:00',
    workoutTime: '01:00:38',
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
        workout_header_resume={mockHeaderResume}
        workout_exercises_resume={mockExercisesResume}
      />
    );

    expect(getByText('Test Workout')).toBeTruthy();

    expect(getByText('Push Up')).toBeTruthy();
  });
});
