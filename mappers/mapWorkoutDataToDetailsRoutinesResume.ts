import { WorkoutDataDB } from '@/repositories/workoutRepository';
import {
  ExerciseResume,
  SetsExerciseResume,
} from '../components/routine/ExerciseResume';

const convertRestTime = (restTime: string): string => {
  const timeParts = restTime.split(':').map(Number);
  const [hours, minutes, seconds] = timeParts;

  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}min `;
  if (seconds > 0) result += `${seconds}s`;

  return result.trim() || 'Desactivado';
};

export const mapWorkoutDataToExerciseResumeArray = (
  workout: WorkoutDataDB
): ExerciseResume[] => {
  const exercisesMap = workout.workout_exercises
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .reduce<Record<string, ExerciseResume>>((acc, exercise) => {
      const exerciseKey = exercise.exercises.name;

      if (!acc[exerciseKey]) {
        acc[exerciseKey] = {
          id: exercise.exercises.id,
          name: exercise.exercises.name,
          thumbnailUrl: exercise.exercises.exercise_thumbnail_url,
          restTime: convertRestTime(exercise.rest_time ?? '00:00:00'),
          notes: exercise.notes ?? '',
          primaryMuscleGroup: exercise.exercises.muscle_groups.name,
          sets: [],
        };
      }

      const newSeries: SetsExerciseResume[] = Array.from({
        length: exercise.sets,
      }).map((_, index) => ({
        serie: acc[exerciseKey].sets.length + index + 1,
        weight: exercise.weight ?? 0,
        reps: exercise.reps,
      }));

      acc[exerciseKey].sets.push(...newSeries);

      return acc;
    }, {});

  return Object.values(exercisesMap);
};
