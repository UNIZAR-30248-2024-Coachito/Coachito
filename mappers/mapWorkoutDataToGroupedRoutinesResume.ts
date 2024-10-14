import { GroupedRoutines } from '@/components/myRoutines/GroupedRoutinesResume';
import { MyRoutinesCardResume } from '@/components/myRoutines/MyRoutinesCardResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';

export const mapWorkoutDataToGroupedRoutinesResume = (
  workouts: WorkoutDataDB[]
): GroupedRoutines[] => {
  const groupedWorkouts: { [key: string]: MyRoutinesCardResume[] } = {};

  workouts.forEach((workout) => {
    const uniqueExerciseNames = Array.from(
      new Set(
        workout.workout_exercises.map((exercise) => exercise.exercises.name)
      )
    );

    const exerciseNames = uniqueExerciseNames.join(', ');

    const routine: MyRoutinesCardResume = {
      myRoutineName: workout.workout_templates.name,
      myRoutineExercises: exerciseNames,
    };

    const groupName =
      workout.workout_templates.workout_templates_group?.name || 'Mis Rutinas';

    if (!groupedWorkouts[groupName]) {
      groupedWorkouts[groupName] = [];
    }

    groupedWorkouts[groupName].push(routine);
  });

  return Object.keys(groupedWorkouts).map((groupName) => ({
    groupName,
    routines: groupedWorkouts[groupName],
  }));
};
