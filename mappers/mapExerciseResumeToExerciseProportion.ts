import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import { ExerciseProportion } from '@/components/workout/WorkoutDivision';

export const mapToExerciseProportions = (
  exerciseResumes: ExerciseResume[]
): ExerciseProportion[] => {
  const groupedExercises: { [key: string]: number } = exerciseResumes.reduce(
    (acc, exercise) => {
      if (acc[exercise.primaryMuscleGroup]) {
        acc[exercise.primaryMuscleGroup] += exercise.sets.length;
      } else {
        acc[exercise.primaryMuscleGroup] = exercise.sets.length;
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  const totalSeries = Object.values(groupedExercises).reduce(
    (acc, seriesCount) => acc + seriesCount,
    0
  );

  return Object.keys(groupedExercises).map((name) => ({
    name,
    proportion:
      totalSeries > 0 ? (groupedExercises[name] / totalSeries) * 100 : 0,
  }));
};
