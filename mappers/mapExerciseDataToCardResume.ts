import { ExerciseCardResume } from '@/components/exercise/ExerciseCardResume';
import { ExerciseDB } from '@/repositories/workoutRepository';

export const mapExercisesToCardResume = (
  exerciseDBArray: ExerciseDB[]
): ExerciseCardResume[] => {
  return exerciseDBArray.map((exercise) => ({
    exerciseResume: {
      exerciseName: exercise.name,
      exerciseThumbnailUrl: exercise.exercise_thumbnail_url,
      primaryMuscleGroup: exercise.muscle_groups.name,
    },
  }));
};
