// mapWorkoutDataToCardResume.test.ts
import { mapWorkoutDataToCardResume } from '../../mappers/mapWorkoutDataToCardResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';
import { convertIntervalToMinutes } from '../../utils/interval';

jest.mock('../../utils/interval', () => ({
  convertIntervalToMinutes: jest.fn(),
}));

describe('mapWorkoutDataToCardResume', () => {
  it('should map workout data to card resume correctly', () => {
    // Datos de entrada
    const workouts: WorkoutDataDB[] = [
      {
        id: 1,
        created_at: '2024-01-01',
        template_id: 2,
        volume: 10,
        duration: '1h',
        template: false,
        workout_templates: { name: 'Workout A' },
        workout_exercises: [
          {
            exercise_id: 1,
            sets: 3,
            exercises: {
              name: 'Push Up',
              exercise_thumbnail_url: 'http://example.com/push-up.jpg',
            },
          },
          {
            exercise_id: 1,
            sets: 2,
            exercises: {
              name: 'Push Up',
              exercise_thumbnail_url: 'http://example.com/push-up.jpg',
            },
          },
          {
            exercise_id: 2,
            sets: 4,
            exercises: {
              name: 'Squat',
              exercise_thumbnail_url: 'http://example.com/squat.jpg',
            },
          },
        ],
      },
    ];

    const expectedOutput = [
      {
        workoutHeaderResume: {
          workoutName: 'Workout A',
          workoutDate: new Date('2024-01-01'),
          workoutTime: 60,
          workoutVolume: 10,
          workoutSeries: 9,
        },
        workoutExercisesResume: {
          exercises: [
            {
              exerciseName: 'Push Up',
              exerciseThumbnailUrl: 'http://example.com/push-up.jpg',
              series: 5,
            },
            {
              exerciseName: 'Squat',
              exerciseThumbnailUrl: 'http://example.com/squat.jpg',
              series: 4,
            },
          ],
        },
      },
    ];

    (convertIntervalToMinutes as jest.Mock).mockReturnValue(60);

    const result = mapWorkoutDataToCardResume(workouts);

    expect(result).toEqual(expectedOutput);
  });
});
