import { WorkoutCardResume } from '@/components/workout/WorkoutCardResume';
import { WorkoutExercisesResume } from '@/components/workout/WorkoutExerciseResume';
import { WorkoutHeaderResume } from '@/components/workout/WorkoutHeaderResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';
import { convertIntervalToMinutes } from '../utils/interval';

export const mapWorkoutDataToCardResume = (
  workouts: WorkoutDataDB[]
): WorkoutCardResume[] => {
  return workouts.map((workout) => {
    const workoutHeaderResume: WorkoutHeaderResume = {
      workoutId: workout.template_id,
      workoutName: workout.workout_templates.name,
      workoutDate: new Date(workout.created_at),
      workoutTime: convertIntervalToMinutes(workout.duration),
      workoutVolume: workout.volume,
      workoutSeries: workout.workout_exercises.reduce(
        (acc, exercise) => acc + exercise.sets,
        0
      ),
    };

    const groupedExercises = groupExercisesById(workout.workout_exercises);

    const workoutExercisesResume: WorkoutExercisesResume = {
      exercises: Object.values(groupedExercises).map((groupedExercise) => ({
        exerciseName: groupedExercise.exerciseName,
        exerciseThumbnailUrl: groupedExercise.exerciseThumbnailUrl,
        series: groupedExercise.totalSets,
      })),
    };

    return {
      workoutHeaderResume,
      workoutExercisesResume,
    };
  });
};

const groupExercisesById = (
  workoutExercises: WorkoutDataDB['workout_exercises']
) => {
  return workoutExercises.reduce(
    (acc, exercise) => {
      const exerciseId = exercise.exercise_id;

      if (acc[exerciseId]) {
        acc[exerciseId].totalSets += exercise.sets;
      } else {
        acc[exerciseId] = {
          exerciseName: exercise.exercises.name,
          exerciseThumbnailUrl: exercise.exercises.exercise_thumbnail_url,
          totalSets: exercise.sets,
        };
      }

      return acc;
    },
    {} as Record<
      number,
      { exerciseName: string; exerciseThumbnailUrl: string; totalSets: number }
    >
  );
};
