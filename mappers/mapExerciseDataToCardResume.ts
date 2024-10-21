import { ExercisesListDB } from '@/repositories/exerciseRepository';
import { ExerciseListResume } from '@/screens/AddExercise';

export const mapExercisesToExerciseCardResume = (
  rows: ExercisesListDB[]
): ExerciseListResume[] => {
  return rows.map((exercise) => ({
    id: exercise.id,
    exerciseName: exercise.name!,
    exerciseThumbnailUrl: exercise.exercise_thumbnail_url,
    primaryMuscleGroup: exercise.muscle_groups?.name || 'Unknown',
  }));
};
