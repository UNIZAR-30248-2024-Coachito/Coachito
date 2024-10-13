import { MyRoutinesCardResume } from '@/components/myRoutines/MyRoutinesCardResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';

export const mapWorkoutDataToMyRoutinesCardResume = (
  workouts: WorkoutDataDB[]
): MyRoutinesCardResume[] => {
  return workouts.map((workout) => {
    const uniqueExerciseNames = Array.from(
      new Set(
        workout.workout_exercises.map((exercise) => exercise.exercises.name)
      )
    );

    const exerciseNames = uniqueExerciseNames.join(', ');

    return {
      myRoutineName: workout.workout_templates.name,
      myRoutineExercises: exerciseNames,
    };
  });
};
