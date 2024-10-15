import { GroupedRoutines } from '@/components/myRoutines/GroupedRoutinesResume';
import { MyRoutinesCardResume } from '@/components/myRoutines/MyRoutinesCardResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';

export const mapWorkoutDataToGroupedRoutinesResume = (
  workouts: WorkoutDataDB[]
): GroupedRoutines[] => {
  const groupedWorkouts: {
    [key: string]: { groupId: number; routines: MyRoutinesCardResume[] };
  } = {};

  workouts.forEach((workout) => {
    const uniqueExerciseNames = Array.from(
      new Set(
        workout.workout_exercises.map((exercise) => exercise.exercises.name)
      )
    );

    const exerciseNames = uniqueExerciseNames.join(', ');

    const routine: MyRoutinesCardResume = {
      templateId: workout.template_id,
      myRoutineName: workout.workout_templates.name,
      myRoutineExercises: exerciseNames,
    };

    const groupName =
      workout.workout_templates.workout_templates_group?.name || 'Mis Rutinas';

    const groupId = workout.workout_templates.workout_templates_group?.id || 0;

    if (!groupedWorkouts[groupName]) {
      groupedWorkouts[groupName] = {
        groupId: groupId,
        routines: [],
      };
    }

    groupedWorkouts[groupName].routines.push(routine);
  });

  return Object.keys(groupedWorkouts).map((groupName) => ({
    groupId: groupedWorkouts[groupName].groupId,
    groupName,
    routines: groupedWorkouts[groupName].routines,
  }));
};
