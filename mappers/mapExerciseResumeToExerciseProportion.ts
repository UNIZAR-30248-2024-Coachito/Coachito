import { ExerciseResume } from '@/components/detailsRoutine/ExerciseResume';
import { ExerciseProportion } from '@/components/workout/WorkoutDivision';

export const mapToExerciseProportions = (
  exerciseResumes: ExerciseResume[]
): ExerciseProportion[] => {
  const groupedExercises: { [key: string]: number } = exerciseResumes.reduce(
    (acc, exercise) => {
      if (acc[exercise.primary_muscle]) {
        acc[exercise.primary_muscle] += exercise.series.length;
      } else {
        acc[exercise.primary_muscle] = exercise.series.length;
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
