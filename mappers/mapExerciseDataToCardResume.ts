import { ExerciseResume } from '@/components/routine/ExerciseResume';
import { ExercisesListDB } from '@/repositories/exerciseRepository';

export const mapExercisesToExerciseCardResume = (
  rows: ExercisesListDB[]
): ExerciseResume[] => {
  return rows.map((exercise) => ({
    id: exercise.id,
    name: exercise.name!,
    thumbnailUrl: exercise.exercise_thumbnail_url,
    restTime: null,
    notes: '',
    primaryMuscleGroup: exercise.muscle_groups?.name || 'Unknown',
    sets: [],
  }));
};
