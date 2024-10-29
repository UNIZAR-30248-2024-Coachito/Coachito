import { WorkoutDataDB } from '@/repositories/workoutRepository';
import { UserWorkouts, UserWorkoutsDetails } from '@/screens/Profile';

export const mapWorkoutDataToProfileresume = (
  workoutDataDB: WorkoutDataDB[]
): UserWorkoutsDetails => {
  const username = workoutDataDB[0].workout_templates?.users?.username || '';

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const recentWorkouts = workoutDataDB.filter((workout) => {
    const workoutDate = new Date(workout.created_at);
    return workoutDate >= threeMonthsAgo;
  });

  const workouts: UserWorkouts[] = recentWorkouts.map((workout) => {
    const repsCount =
      workout.workout_exercises.length > 0
        ? workout.workout_exercises[0].reps
        : 0;

    return {
      workoutId: workout.id,
      duration: parseDuration(workout.duration),
      repsCount: repsCount,
      volumen: workout.volume,
      created_at: formatDate(workout.created_at),
    };
  });

  return {
    username: username,
    workoutsCount: workoutDataDB.length,
    workouts: workouts,
  };
};

function parseDuration(duration: string): number {
  const parts = duration.split(':');
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;

  return hours * 60 + minutes + Math.round(seconds / 60);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}
